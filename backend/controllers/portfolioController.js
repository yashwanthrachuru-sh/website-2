// ============================================================
// backend/controllers/portfolioController.js
// Controllers for Developer Portfolio Module
// ============================================================
'use strict';

const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// Helper to sanitize filenames
function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, '');
}

// Helper to process base64 file uploads
async function saveBase64File(base64Data, subFolder, prefix, allowedMimes, maxSizeBytes) {
  // Expected format: data:application/pdf;base64,....
  const matches = base64Data.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9\-+.]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid file format. Make sure it is a valid base64 URI.');
  }

  const mimeType = matches[1];
  const base64Content = matches[2];
  const fileBuffer = Buffer.from(base64Content, 'base64');

  if (!allowedMimes.includes(mimeType)) {
    throw new Error(`File type ${mimeType} is not allowed. Allowed types: ${allowedMimes.join(', ')}`);
  }

  if (fileBuffer.length > maxSizeBytes) {
    throw new Error(`File is too large. Maximum size allowed is ${(maxSizeBytes / (1024 * 1024)).toFixed(1)}MB.`);
  }

  // Magic number signature checks to prevent MIME type spoofing
  if (mimeType === 'application/pdf') {
    // PDF files must start with %PDF- (hex: 25 50 44 46)
    if (
      fileBuffer.length < 4 ||
      fileBuffer[0] !== 0x25 ||
      fileBuffer[1] !== 0x50 ||
      fileBuffer[2] !== 0x44 ||
      fileBuffer[3] !== 0x46
    ) {
      throw new Error('Invalid file signature. The file content is not a valid PDF.');
    }
  }

  const uploadsDir = path.join(__dirname, '..', '..', 'uploads', subFolder);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const extension = mimeType.split('/')[1] === 'jpeg' ? 'jpg' : mimeType.split('/')[1];
  const filename = `${prefix}_${Date.now()}.${extension}`;
  const filePath = path.join(uploadsDir, filename);

  fs.writeFileSync(filePath, fileBuffer);
  return `/uploads/${subFolder}/${filename}`;
}

// Helper to calculate portfolio completion percentage
function calculateCompletion(settings, socials, resumeUrl, projects) {
  let score = 0;
  if (settings) {
    if (settings.headline) score += 15;
    if (settings.about_me) score += 15;
    if (settings.location) score += 10;
    if (settings.availability) score += 10;
  }
  if (socials) {
    if (socials.linkedin_url) score += 10;
    if (socials.github_url) score += 10;
    if (socials.website_url || socials.twitter_url) score += 10;
  }
  if (resumeUrl) score += 10;
  if (projects && projects.length > 0) score += 10;
  return Math.min(100, score);
}

// Helper: Get or initialize portfolio elements for a user
async function ensurePortfolioInitialized(userId) {
  // Check settings
  const [[settings]] = await db.query('SELECT * FROM portfolio_settings WHERE user_id = ?', [userId]);
  if (!settings) {
    await db.query('INSERT INTO portfolio_settings (user_id) VALUES (?)', [userId]);
  }

  // Check socials
  const [[socials]] = await db.query('SELECT * FROM portfolio_socials WHERE user_id = ?', [userId]);
  if (!socials) {
    await db.query('INSERT INTO portfolio_socials (user_id) VALUES (?)', [userId]);
  }
}

// Automatically calculate skills proficiency based on completed lessons
async function calculateDynamicSkills(userId) {
  try {
    // Get all completed lessons for this user
    const [completedRows] = await db.query(`
      SELECT l.skills, lp.updated_at
      FROM lesson_progress lp
      JOIN lessons l ON lp.lesson_id = l.id
      WHERE lp.user_id = ? AND lp.completed = 1
    `, [userId]);

    // Get all modules completed
    const [completedModules] = await db.query(`
      SELECT module_id FROM module_progress
      WHERE user_id = ? AND completed = 1
    `, [userId]);

    // Get all roadmaps completed
    // Count roadmap progress
    const [completedRoadmaps] = await db.query(`
      SELECT track FROM roadmap_progress
      WHERE username = (SELECT username FROM users WHERE id = ?) AND completed = 1
    `, [userId]);

    // Count projects completed inside EduNet
    const [gradedProjects] = await db.query(`
      SELECT id, title, description FROM projects WHERE user_id = ?
    `, [userId]);

    // Count manual portfolio projects
    const [portfolioProjects] = await db.query(`
      SELECT id, title, description, tech_stack FROM portfolio_projects WHERE user_id = ?
    `, [userId]);

    // Get all skills defined in lessons
    const [allLessons] = await db.query('SELECT skills FROM lessons');

    // Aggregate skill frequencies across all lessons
    const globalSkillCounts = {};
    allLessons.forEach(row => {
      if (row.skills) {
        row.skills.split(',').forEach(s => {
          const name = s.trim();
          if (name) {
            const normalized = name.toLowerCase();
            globalSkillCounts[normalized] = (globalSkillCounts[normalized] || 0) + 1;
          }
        });
      }
    });

    // Aggregate completed skill frequencies
    const completedSkillCounts = {};
    completedRows.forEach(row => {
      if (row.skills) {
        row.skills.split(',').forEach(s => {
          const name = s.trim();
          if (name) {
            const normalized = name.toLowerCase();
            completedSkillCounts[normalized] = (completedSkillCounts[normalized] || 0) + 1;
          }
        });
      }
    });

    // Collect all projects tech stacks
    const projectTechs = [];
    portfolioProjects.forEach(p => {
      if (p.tech_stack) {
        p.tech_stack.split(',').forEach(t => projectTechs.push(t.trim().toLowerCase()));
      }
    });

    // Default EduNet core skills to show even if lessons are not fully mapped
    const coreSkills = ['javascript', 'python', 'java', 'cpp', 'html', 'css', 'sql', 'node.js', 'express', 'mysql', 'git', 'github', 'linux', 'dsa'];

    const skillsMap = {};

    // Initialize core skills
    coreSkills.forEach(skill => {
      skillsMap[skill] = {
        name: skill.charAt(0).toUpperCase() + skill.slice(1).replace('cpp', 'C++').replace('dsa', 'DSA'),
        proficiency: 10, // baseline
        xp_earned: 0,
        project_count: 0
      };
    });

    // Map projects count
    Object.keys(skillsMap).forEach(skill => {
      projectTechs.forEach(pt => {
        if (pt.includes(skill)) {
          skillsMap[skill].project_count++;
        }
      });
      // also scan graded projects descriptions/titles
      gradedProjects.forEach(gp => {
        const text = (gp.title + ' ' + gp.description).toLowerCase();
        if (text.includes(skill)) {
          skillsMap[skill].project_count++;
        }
      });
    });

    // Calculate percentage from completed lessons
    Object.keys(globalSkillCounts).forEach(skill => {
      const total = globalSkillCounts[skill];
      const completed = completedSkillCounts[skill] || 0;
      const pct = Math.min(100, Math.round((completed / total) * 100));

      const formattedName = skill.charAt(0).toUpperCase() + skill.slice(1).replace('cpp', 'C++').replace('dsa', 'DSA');

      if (!skillsMap[skill]) {
        skillsMap[skill] = {
          name: formattedName,
          proficiency: 10,
          xp_earned: 0,
          project_count: 0
        };
      }

      skillsMap[skill].proficiency = Math.max(skillsMap[skill].proficiency, pct === 0 && completed > 0 ? 15 : pct);
      skillsMap[skill].xp_earned = completed * 100;
    });

    // Add extra weights based on completed roadmap tracks
    completedRoadmaps.forEach(rm => {
      const track = rm.track.toLowerCase();
      if (track.includes('sde') || track.includes('web')) {
        ['javascript', 'html', 'css', 'node.js', 'express', 'git', 'github', 'dsa'].forEach(s => {
          if (skillsMap[s]) {
            skillsMap[s].proficiency = Math.min(100, skillsMap[s].proficiency + 30);
            skillsMap[s].xp_earned += 300;
          }
        });
      }
      if (track.includes('data') || track.includes('ds') || track.includes('ml')) {
        ['python', 'sql', 'mysql', 'dsa'].forEach(s => {
          if (skillsMap[s]) {
            skillsMap[s].proficiency = Math.min(100, skillsMap[s].proficiency + 30);
            skillsMap[s].xp_earned += 300;
          }
        });
      }
    });

    // Make sure custom portfolio skills stored in database are factored in
    const [dbSkills] = await db.query('SELECT skill_name, proficiency, xp_earned, project_count FROM portfolio_skills WHERE user_id = ?', [userId]);
    dbSkills.forEach(ds => {
      const skillLower = ds.skill_name.toLowerCase();
      if (skillsMap[skillLower]) {
        skillsMap[skillLower].proficiency = Math.max(skillsMap[skillLower].proficiency, ds.proficiency);
        skillsMap[skillLower].xp_earned = Math.max(skillsMap[skillLower].xp_earned, ds.xp_earned);
        skillsMap[skillLower].project_count = Math.max(skillsMap[skillLower].project_count, ds.project_count);
      } else {
        skillsMap[skillLower] = {
          name: ds.skill_name,
          proficiency: ds.proficiency,
          xp_earned: ds.xp_earned,
          project_count: ds.project_count
        };
      }
    });

    return Object.values(skillsMap).filter(s => s.proficiency > 0 || s.project_count > 0 || s.xp_earned > 0);
  } catch (err) {
    console.error('calculateDynamicSkills error:', err);
    return [];
  }
}

// Compile Timeline Activities
async function compileTimeline(userId) {
  try {
    const activities = [];

    // 1. Certificates Earned
    const [certs] = await db.query('SELECT title, issue_date, certificate_hash FROM certificates WHERE user_id = ?', [userId]);
    certs.forEach(c => {
      activities.push({
        type: 'certificate',
        icon: '🎓',
        title: 'Earned Certificate',
        desc: `Verified course completion certificate for "${c.title || 'Course'}"`,
        date: c.issue_date || new Date(),
        link: `/verify.html?hash=${c.certificate_hash}`
      });
    });

    // 2. Achievements Earned
    const [achievements] = await db.query(`
      SELECT a.title, a.description, a.icon, ua.earned_at
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = ?
    `, [userId]);
    achievements.forEach(a => {
      activities.push({
        type: 'achievement',
        icon: a.icon || '🏆',
        title: 'Unlocked Achievement',
        desc: `${a.title}: ${a.description}`,
        date: a.earned_at || new Date()
      });
    });

    // 3. Quizzes Completed
    const [quizzes] = await db.query(`
      SELECT t.title, r.score, r.total_questions, r.attempted_at
      FROM results r
      JOIN tests t ON r.test_id = t.id
      WHERE r.user_id = ? AND t.type = 'MCQ'
      ORDER BY r.attempted_at DESC
    `, [userId]);
    quizzes.forEach(q => {
      const pct = Math.round((q.score / q.total_questions) * 100);
      activities.push({
        type: 'quiz',
        icon: '🧠',
        title: 'Completed Quiz',
        desc: `Scored ${pct}% (${q.score}/${q.total_questions}) in quiz "${q.title}"`,
        date: q.attempted_at
      });
    });

    // 4. Interviews Done
    const [interviews] = await db.query(`
      SELECT type, score, created_at FROM interview_sessions
      WHERE user_id = ?
    `, [userId]);
    interviews.forEach(i => {
      activities.push({
        type: 'interview',
        icon: '💬',
        title: 'Mock Interview Finished',
        desc: `Completed AI Interview session for "${i.type}" with a score of ${i.score}/100`,
        date: i.created_at
      });
    });

    // 5. Lessons Completed
    const [lessons] = await db.query(`
      SELECT l.name, lp.completed_at
      FROM lesson_progress lp
      JOIN lessons l ON lp.lesson_id = l.id
      WHERE lp.user_id = ? AND lp.completed = 1
    `, [userId]);
    lessons.forEach(l => {
      activities.push({
        type: 'lesson',
        icon: '📖',
        title: 'Finished Lesson',
        desc: `Completed study session: "${l.name}"`,
        date: l.completed_at || new Date()
      });
    });

    // Sort newest first
    return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (err) {
    console.error('compileTimeline error:', err);
    return [];
  }
}

// Compile Mock Interview Metrics
async function compileInterviewMetrics(userId) {
  try {
    const [[stats]] = await db.query(`
      SELECT COUNT(*) AS total, AVG(score) AS avg_score, MAX(score) AS max_score
      FROM interview_sessions WHERE user_id = ?
    `, [userId]);

    const [sessions] = await db.query(`
      SELECT type, score, feedback, created_at FROM interview_sessions
      WHERE user_id = ? ORDER BY created_at DESC
    `, [userId]);

    // Compute average scores per interview type for radar chart
    const typeGroups = {};
    sessions.forEach(s => {
      if (!typeGroups[s.type]) typeGroups[s.type] = [];
      typeGroups[s.type].push(s.score);
    });

    const radarData = Object.keys(typeGroups).map(type => {
      const avg = typeGroups[type].reduce((a, b) => a + b, 0) / typeGroups[type].length;
      return { topic: type, score: Math.round(avg) };
    });

    // Extract recent AI feedbacks
    const recentFeedback = sessions.slice(0, 3).map(s => ({
      topic: s.type,
      score: s.score,
      feedback: s.feedback,
      date: s.created_at
    }));

    return {
      completed: stats.total || 0,
      average_score: Math.round(stats.avg_score || 0),
      highest_score: stats.max_score || 0,
      radar_data: radarData,
      recent_feedback: recentFeedback
    };
  } catch (err) {
    console.error('compileInterviewMetrics error:', err);
    return { completed: 0, average_score: 0, highest_score: 0, radar_data: [], recent_feedback: [] };
  }
}

// ── GET /api/portfolio ──────────────────────────────────────────
const getPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;
    await ensurePortfolioInitialized(userId);

    // Fetch user base details
    const [[user]] = await db.query(
      'SELECT id, username, email, branch, role, xp, level, bio, streak, avatar_initials, college, country, preferred_language, interests, created_at FROM users WHERE id = ?',
      [userId]
    );

    // Fetch portfolio settings
    const [[settings]] = await db.query('SELECT * FROM portfolio_settings WHERE user_id = ?', [userId]);

    // Fetch portfolio socials
    const [[socials]] = await db.query('SELECT * FROM portfolio_socials WHERE user_id = ?', [userId]);

    // Fetch portfolio resume
    const [[resume]] = await db.query('SELECT * FROM portfolio_resume WHERE user_id = ?', [userId]);

    // Fetch projects (manual + graded EduNet)
    const [manualProjects] = await db.query('SELECT * FROM portfolio_projects WHERE user_id = ? ORDER BY is_featured DESC, completion_date DESC', [userId]);
    const [gradedProjects] = await db.query('SELECT id, title, description, created_at FROM projects WHERE user_id = ?', [userId]);

    const formattedGraded = gradedProjects.map(gp => ({
      id: `edunet_${gp.id}`,
      title: gp.title,
      description: gp.description,
      tech_stack: 'EduNet Graded Task',
      difficulty: 'Medium',
      completion_date: gp.created_at,
      status: 'Graded',
      is_featured: 0,
      is_graded: 1
    }));

    const allProjects = [...manualProjects, ...formattedGraded];

    // Compute dynamic skills
    const skills = await calculateDynamicSkills(userId);

    // Certificates
    const [certs] = await db.query('SELECT title, issue_date, certificate_hash FROM certificates WHERE user_id = ?', [userId]);

    // Achievements / Badges
    const [achievements] = await db.query(`
      SELECT a.title, a.description, a.icon, ua.earned_at
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = ?
    `, [userId]);

    const completion_percentage = calculateCompletion(settings, socials, resume ? resume.resume_url : null, allProjects);

    res.json({
      success: true,
      user,
      settings,
      socials,
      resume_url: resume ? resume.resume_url : null,
      projects: allProjects,
      skills,
      certificates: certs,
      achievements,
      completion_percentage
    });
  } catch (err) {
    console.error('getPortfolio error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving portfolio.' });
  }
};

// ── PUT /api/portfolio/settings ────────────────────────────────
const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      is_public, show_xp, show_streak, show_certificates, show_projects, show_achievements, show_interview_scores,
      theme, headline, about_me, current_role, years_learning, location, availability, open_to_work, profile_banner, profile_picture,
      github_url, linkedin_url, twitter_url, instagram_url, website_url, email, phone
    } = req.body;

    await ensurePortfolioInitialized(userId);

    // Update settings table
    await db.query(`
      UPDATE portfolio_settings
      SET is_public = ?, show_xp = ?, show_streak = ?, show_certificates = ?, show_projects = ?, show_achievements = ?, show_interview_scores = ?,
          theme = ?, headline = ?, about_me = ?, current_role = ?, years_learning = ?, location = ?, availability = ?, open_to_work = ?,
          profile_banner = ?, profile_picture = ?
      WHERE user_id = ?
    `, [
      is_public !== undefined ? (is_public ? 1 : 0) : 1,
      show_xp !== undefined ? (show_xp ? 1 : 0) : 1,
      show_streak !== undefined ? (show_streak ? 1 : 0) : 1,
      show_certificates !== undefined ? (show_certificates ? 1 : 0) : 1,
      show_projects !== undefined ? (show_projects ? 1 : 0) : 1,
      show_achievements !== undefined ? (show_achievements ? 1 : 0) : 1,
      show_interview_scores !== undefined ? (show_interview_scores ? 1 : 0) : 1,
      theme || 'dark',
      headline || null,
      about_me || null,
      current_role || null,
      years_learning || null,
      location || null,
      availability || null,
      open_to_work !== undefined ? (open_to_work ? 1 : 0) : 0,
      profile_banner || null,
      profile_picture || null,
      userId
    ]);

    // Update socials table
    await db.query(`
      UPDATE portfolio_socials
      SET github_url = ?, linkedin_url = ?, twitter_url = ?, instagram_url = ?, website_url = ?, email = ?, phone = ?
      WHERE user_id = ?
    `, [
      github_url || null,
      linkedin_url || null,
      twitter_url || null,
      instagram_url || null,
      website_url || null,
      email || null,
      phone || null,
      userId
    ]);

    res.json({ success: true, message: 'Portfolio configurations updated successfully.' });
  } catch (err) {
    console.error('updateSettings error:', err);
    res.status(500).json({ success: false, message: 'Server error updating portfolio settings.' });
  }
};

// ── POST /api/portfolio/resume ─────────────────────────────────
const uploadResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { base64File, filename } = req.body;

    if (!base64File) {
      return res.status(400).json({ success: false, message: 'File payload missing.' });
    }

    // PDF only, max 5MB
    const savedPath = await saveBase64File(
      base64File,
      'resumes',
      `resume_${userId}`,
      ['application/pdf'],
      5 * 1024 * 1024
    );

    // Delete any old resume record
    const [[oldResume]] = await db.query('SELECT resume_url FROM portfolio_resume WHERE user_id = ?', [userId]);
    if (oldResume) {
      const oldPath = path.join(__dirname, '..', '..', oldResume.resume_url);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (e) { /* ignore */ }
      }
    }

    await db.query(`
      INSERT INTO portfolio_resume (user_id, resume_url)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE resume_url = ?
    `, [userId, savedPath, savedPath]);

    res.json({ success: true, message: 'Resume uploaded successfully.', resume_url: savedPath });
  } catch (err) {
    console.error('uploadResume error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error uploading resume.' });
  }
};

// ── DELETE /api/portfolio/resume ──────────────────────────────
const deleteResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const [[oldResume]] = await db.query('SELECT resume_url FROM portfolio_resume WHERE user_id = ?', [userId]);

    if (!oldResume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    const oldPath = path.join(__dirname, '..', '..', oldResume.resume_url);
    if (fs.existsSync(oldPath)) {
      try { fs.unlinkSync(oldPath); } catch (e) { /* ignore */ }
    }

    await db.query('DELETE FROM portfolio_resume WHERE user_id = ?', [userId]);
    res.json({ success: true, message: 'Resume deleted successfully.' });
  } catch (err) {
    console.error('deleteResume error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting resume.' });
  }
};

// ── Projects CRUD Operations ───────────────────────────────────

// POST /api/portfolio/project
const addProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, tech_stack, github_link, live_link, images, video, difficulty, completion_date, status, is_featured } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Project title and description are required.' });
    }

    const [result] = await db.query(`
      INSERT INTO portfolio_projects (user_id, title, description, tech_stack, github_link, live_link, images, video, difficulty, completion_date, status, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      title,
      description,
      tech_stack || null,
      github_link || null,
      live_link || null,
      images || null,
      video || null,
      difficulty || 'Medium',
      completion_date || null,
      status || 'Completed',
      is_featured ? 1 : 0
    ]);

    res.json({ success: true, message: 'Project added successfully.', projectId: result.insertId });
  } catch (err) {
    console.error('addProject error:', err);
    res.status(500).json({ success: false, message: 'Server error creating project.' });
  }
};

// PUT /api/portfolio/project/:id
const editProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;
    const { title, description, tech_stack, github_link, live_link, images, video, difficulty, completion_date, status, is_featured } = req.body;

    // Verify owner
    const [[project]] = await db.query('SELECT user_id FROM portfolio_projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }
    if (project.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied. You are not the owner of this project.' });
    }

    await db.query(`
      UPDATE portfolio_projects
      SET title = ?, description = ?, tech_stack = ?, github_link = ?, live_link = ?, images = ?, video = ?, difficulty = ?, completion_date = ?, status = ?, is_featured = ?
      WHERE id = ?
    `, [
      title,
      description,
      tech_stack || null,
      github_link || null,
      live_link || null,
      images || null,
      video || null,
      difficulty || 'Medium',
      completion_date || null,
      status || 'Completed',
      is_featured ? 1 : 0,
      projectId
    ]);

    res.json({ success: true, message: 'Project updated successfully.' });
  } catch (err) {
    console.error('editProject error:', err);
    res.status(500).json({ success: false, message: 'Server error updating project.' });
  }
};

// DELETE /api/portfolio/project/:id
const deleteProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;

    // Verify owner
    const [[project]] = await db.query('SELECT user_id FROM portfolio_projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }
    if (project.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    await db.query('DELETE FROM portfolio_projects WHERE id = ?', [projectId]);
    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (err) {
    console.error('deleteProject error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting project.' });
  }
};

// ── GET /api/portfolio/analytics ────────────────────────────────
const getPortfolioAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const timeline = await compileTimeline(userId);
    const interviewStats = await compileInterviewMetrics(userId);

    // Heatmap data (365 days)
    const [heatmap] = await db.query(`
      SELECT DATE_FORMAT(date, '%Y-%m-%d') AS day,
             lessons_done, xp_earned, quiz_attempts, coding_minutes
      FROM user_activity
      WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 365 DAY)
      ORDER BY date ASC
    `, [userId]);

    res.json({
      success: true,
      timeline,
      interview: interviewStats,
      heatmap
    });
  } catch (err) {
    console.error('getPortfolioAnalytics error:', err);
    res.status(500).json({ success: false, message: 'Server error gathering analytics data.' });
  }
};

// ── GET /api/portfolio/public/:username ──────────────────────────
const getPublicPortfolio = async (req, res) => {
  try {
    const username = req.params.username;

    // Fetch user details
    const [[user]] = await db.query(
      'SELECT id, username, email, branch, role, xp, level, bio, streak, avatar_initials, college, country, preferred_language, interests, created_at FROM users WHERE username = ?',
      [username]
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'Developer profile not found.' });
    }

    const userId = user.id;

    // Fetch portfolio settings
    const [[settings]] = await db.query('SELECT * FROM portfolio_settings WHERE user_id = ?', [userId]);

    // Check if portfolio is set to private
    if (settings && settings.is_public === 0) {
      return res.status(403).json({ success: false, message: 'This developer portfolio is private.' });
    }

    // Fetch portfolio socials
    const [[socials]] = await db.query('SELECT * FROM portfolio_socials WHERE user_id = ?', [userId]);

    // Fetch portfolio resume
    const [[resume]] = await db.query('SELECT * FROM portfolio_resume WHERE user_id = ?', [userId]);

    // Compile dynamic elements
    const skills = await calculateDynamicSkills(userId);
    const timeline = await compileTimeline(userId);
    const interview = await compileInterviewMetrics(userId);

    // Fetch projects (manual + graded EduNet)
    let projects = [];
    if (!settings || settings.show_projects === 1) {
      const [manualProjects] = await db.query('SELECT * FROM portfolio_projects WHERE user_id = ? ORDER BY is_featured DESC, completion_date DESC', [userId]);
      const [gradedProjects] = await db.query('SELECT id, title, description, created_at FROM projects WHERE user_id = ?', [userId]);

      const formattedGraded = gradedProjects.map(gp => ({
        id: `edunet_${gp.id}`,
        title: gp.title,
        description: gp.description,
        tech_stack: 'EduNet Graded Task',
        difficulty: 'Medium',
        completion_date: gp.created_at,
        status: 'Graded',
        is_featured: 0,
        is_graded: 1
      }));
      projects = [...manualProjects, ...formattedGraded];
    }

    // Certificates
    let certificates = [];
    if (!settings || settings.show_certificates === 1) {
      const [certs] = await db.query('SELECT title, issue_date, certificate_hash FROM certificates WHERE user_id = ?', [userId]);
      certificates = certs;
    }

    // Achievements
    let achievements = [];
    if (!settings || settings.show_achievements === 1) {
      const [ach] = await db.query(`
        SELECT a.title, a.description, a.icon, ua.earned_at
        FROM user_achievements ua
        JOIN achievements a ON ua.achievement_id = a.id
        WHERE ua.user_id = ?
      `, [userId]);
      achievements = ach;
    }

    // Heatmap activity
    let heatmap = [];
    if (!settings || settings.show_streak === 1) {
      const [hm] = await db.query(`
        SELECT DATE_FORMAT(date, '%Y-%m-%d') AS day,
               lessons_done, xp_earned, quiz_attempts, coding_minutes
        FROM user_activity
        WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 365 DAY)
        ORDER BY date ASC
      `, [userId]);
      heatmap = hm;
    }

    // Filter email out if privacy settings say so (or custom toggles are implemented)
    // For default, we respect the properties from `settings`
    // Clean user object matching visibility requirements
    const cleanedUser = {
      username: user.username,
      branch: user.branch,
      role: user.role,
      xp: (settings && settings.show_xp === 0) ? null : user.xp,
      level: (settings && settings.show_xp === 0) ? null : user.level,
      streak: (settings && settings.show_streak === 0) ? null : user.streak,
      avatar_initials: user.avatar_initials,
      college: user.college,
      country: user.country,
      interests: user.interests,
      preferred_language: user.preferred_language,
      created_at: user.created_at
    };

    const completion_percentage = calculateCompletion(settings, socials, resume ? resume.resume_url : null, projects);

    res.json({
      success: true,
      user: cleanedUser,
      settings,
      socials,
      resume_url: resume ? resume.resume_url : null,
      projects,
      skills,
      certificates,
      achievements,
      timeline,
      interview: (settings && settings.show_interview_scores === 0) ? null : interview,
      heatmap,
      completion_percentage
    });
  } catch (err) {
    console.error('getPublicPortfolio error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving developer profile.' });
  }
};

// ============================================================
// Phase 5 — New handlers (appended, never modifying existing)
// ============================================================

const analyticsService = require('../services/analyticsService');

// ── POST /api/portfolio/track-view (public) ─────────────────────
const trackPortfolioView = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.json({ success: false });
    const [[user]] = await db.query('SELECT id FROM users WHERE username = ?', [username]).catch(() => [[null]]);
    if (!user) return res.json({ success: false });
    await analyticsService.trackView(user.id, req);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
};

// ── POST /api/portfolio/track-click (public) ───────────────────
const trackPortfolioClick = async (req, res) => {
  try {
    const { username, click_type, target_id, target_name } = req.body;
    if (!username || !click_type) return res.json({ success: false });
    const [[user]] = await db.query('SELECT id FROM users WHERE username = ?', [username]).catch(() => [[null]]);
    if (!user) return res.json({ success: false });
    await analyticsService.trackClick(user.id, click_type, target_id, target_name, req);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
};

// ── GET /api/portfolio/views ────────────────────────────────────
const getPortfolioViews = async (req, res) => {
  try {
    const userId = req.user.id;
    const days = parseInt(req.query.days || '30');
    const summary = await analyticsService.getAnalyticsSummary(userId);
    const daily = await analyticsService.getDailyViews(userId, days);
    const topProjects = await analyticsService.getTopProjects(userId);
    const traffic = await analyticsService.getTrafficSources(userId);
    res.json({ success: true, summary, daily, top_projects: topProjects, traffic_sources: traffic });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/portfolio/strength ─────────────────────────────────
const getPortfolioStrength = async (req, res) => {
  try {
    const userId = req.user.id;

    // Gather portfolio data for scoring
    const [[settings]] = await db.query('SELECT * FROM portfolio_settings WHERE user_id = ?', [userId]).catch(() => [[null]]);
    const [[socials]] = await db.query('SELECT * FROM portfolio_socials WHERE user_id = ?', [userId]).catch(() => [[null]]);
    const [[resume]] = await db.query('SELECT resume_url FROM portfolio_resume WHERE user_id = ?', [userId]).catch(() => [[null]]);
    const [projects] = await db.query('SELECT id FROM portfolio_projects WHERE user_id = ?', [userId]).catch(() => [[]]);
    const [certs] = await db.query('SELECT id FROM certificates WHERE user_id = ?', [userId]).catch(() => [[]]);

    const result = await analyticsService.calculateStrength(userId, {
      settings,
      socials,
      resume_url: resume?.resume_url || null,
      projects,
      certificates: certs
    });

    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/portfolio/theme ────────────────────────────────────
const getPortfolioTheme = async (req, res) => {
  try {
    const userId = req.user.id;
    const [[theme]] = await db.query('SELECT * FROM portfolio_theme WHERE user_id = ?', [userId]).catch(() => [[null]]);
    res.json({ success: true, theme: theme || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/portfolio/theme ────────────────────────────────────
const updatePortfolioTheme = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      accent_color, background_style, card_radius, glass_blur,
      font_family, font_size, animation_speed, border_style, card_style
    } = req.body;

    await db.query(`
      INSERT INTO portfolio_theme (user_id, accent_color, background_style, card_radius, glass_blur,
        font_family, font_size, animation_speed, border_style, card_style)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        accent_color     = VALUES(accent_color),
        background_style = VALUES(background_style),
        card_radius      = VALUES(card_radius),
        glass_blur       = VALUES(glass_blur),
        font_family      = VALUES(font_family),
        font_size        = VALUES(font_size),
        animation_speed  = VALUES(animation_speed),
        border_style     = VALUES(border_style),
        card_style       = VALUES(card_style),
        updated_at       = NOW()
    `, [
      userId, accent_color || '#8b5cf6', background_style || 'dark',
      card_radius || '12px', glass_blur || '16px', font_family || 'Outfit',
      font_size || '14px', animation_speed || 'normal', border_style || 'solid',
      card_style || 'glass'
    ]);

    res.json({ success: true, message: 'Portfolio theme saved.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/portfolio/share ───────────────────────────────────
const sharePortfolio = async (req, res) => {
  try {
    const userId = req.user.id;
    const { share_type = 'copy_link' } = req.body;
    const [[user]] = await db.query('SELECT username FROM users WHERE id = ?', [userId]);
    const shareToken = require('crypto').randomBytes(8).toString('hex');
    await db.query(
      'INSERT INTO portfolio_shares (portfolio_user_id, share_token, share_type) VALUES (?, ?, ?)',
      [userId, shareToken, share_type]
    ).catch(() => {});
    // FRONTEND_ORIGIN may be comma-separated (dev + prod). Always use the first (production) URL.
    const origin = (process.env.FRONTEND_ORIGIN || 'https://edunet-seven.vercel.app').split(',')[0].trim();
    const shareUrl = `${origin}/portfolio/${user.username}`;
    res.json({ success: true, share_url: shareUrl, username: user.username });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/portfolio/qr ───────────────────────────────────────
// Returns a simple SVG QR-code placeholder (real QR requires a library)
const getQRCode = async (req, res) => {
  try {
    const userId = req.user.id;
    const [[user]] = await db.query('SELECT username FROM users WHERE id = ?', [userId]);
    // FRONTEND_ORIGIN may be comma-separated (dev + prod). Always use the first (production) URL.
    const origin = (process.env.FRONTEND_ORIGIN || 'https://edunet-seven.vercel.app').split(',')[0].trim();
    const shareUrl = `${origin}/portfolio/${user.username}`;

    // Return URL for frontend to generate QR with a CDN library
    res.json({ success: true, url: shareUrl, username: user.username });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/portfolio/resume-analytics ─────────────────────────
const getResumeAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const [[totals]] = await db.query(`
      SELECT COUNT(*) AS total_downloads
      FROM resume_downloads WHERE user_id = ?
    `, [userId]).catch(() => [[{ total_downloads: 0 }]]);

    const [scanHistory] = await db.query(`
      SELECT score, created_at FROM resume_job_scans
      WHERE user_id = ? ORDER BY created_at DESC LIMIT 10
    `, [userId]).catch(() => [[]]);

    const [dailyDownloads] = await db.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS day, COUNT(*) AS cnt
      FROM resume_downloads WHERE user_id = ?
      AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at) ORDER BY day ASC
    `, [userId]).catch(() => [[]]);

    res.json({
      success: true,
      total_downloads: totals?.total_downloads || 0,
      scan_history: scanHistory,
      daily_downloads: dailyDownloads
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getPortfolio,
  updateSettings,
  uploadResume,
  deleteResume,
  addProject,
  editProject,
  deleteProject,
  getPortfolioAnalytics,
  getPublicPortfolio,
  // Phase 5 extensions
  trackPortfolioView,
  trackPortfolioClick,
  getPortfolioViews,
  getPortfolioStrength,
  getPortfolioTheme,
  updatePortfolioTheme,
  sharePortfolio,
  getQRCode,
  getResumeAnalytics
};
