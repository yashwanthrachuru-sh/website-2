// ============================================================
// backend/controllers/resumeController.js
// Business logic for AI Resume Builder
// ============================================================
'use strict';

const db = require('../config/db');
const resumeModel = require('../models/resumeModel');
const resumeService = require('../services/resumeService');

// GET /api/resume
const getResume = async (req, res) => {
  try {
    const userId = req.user.id;
    let resumes = await resumeModel.getResumes(userId);

    // If no resume exists, seed a blank default one
    if (resumes.length === 0) {
      const defaultInfo = JSON.stringify({
        name: 'Student Name',
        email: 'student@edunet.com',
        phone: '+91 99999 99999',
        location: 'Bangalore, India',
        github: 'github.com/student',
        linkedin: 'linkedin.com/in/student',
        website: 'student.dev'
      });
      const defaultSkills = JSON.stringify({
        languages: ['JavaScript', 'Python'],
        frontend: ['React', 'HTML', 'CSS'],
        backend: ['Node.js'],
        database: ['MySQL']
      });

      const resumeId = await resumeModel.createResume(userId, 'My Default Resume', 'classic', defaultInfo, 'Motivated developer seeking placements.', defaultSkills);
      
      // Seed default sections: education, experience, projects
      await resumeModel.saveSection(resumeId, 'education', JSON.stringify([
        { college: 'EduNet University', degree: 'B.Tech', stream: 'Computer Science', cgpa: '8.5', start_year: '2023', end_year: '2027' }
      ]));
      await resumeModel.saveSection(resumeId, 'experience', JSON.stringify([
        { company: 'Coding Labs', role: 'Software Engineer Intern', description: 'Assisted in building database dashboards.', start_date: '2025-01-01', end_date: '2025-06-01' }
      ]));
      await resumeModel.saveSection(resumeId, 'projects', JSON.stringify([
        { name: 'EduNet Portal', description: 'A learning platform for students.', technologies: 'React, Node.js', github_url: 'github.com/student/edunet', live_url: 'edunet.dev' }
      ]));

      resumes = await resumeModel.getResumes(userId);
    }

    // Load sections for each resume
    const detailedResumes = [];
    for (const r of resumes) {
      const sections = await resumeModel.getSections(r.id);
      const viewsCount = 5; // simulated views
      const downloadsCount = await resumeModel.getDownloadsCount(r.id);

      detailedResumes.push({
        ...r,
        personal_info: JSON.parse(r.personal_info || '{}'),
        skills: JSON.parse(r.skills || '{}'),
        sections: sections.reduce((acc, s) => {
          acc[s.section_name] = JSON.parse(s.content_json || '[]');
          return acc;
        }, {}),
        views: viewsCount,
        downloads: downloadsCount
      });
    }

    res.json({ success: true, resumes: detailedResumes });
  } catch (err) {
    console.error('getResume error:', err);
    res.status(500).json({ success: false, message: 'Server error loading resumes.' });
  }
};

// POST /api/resume/save
const saveResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, template, personal_info, summary, skills, sections } = req.body;

    const resumeId = await resumeModel.createResume(
      userId,
      title || 'My Resume',
      template || 'classic',
      JSON.stringify(personal_info || {}),
      summary || '',
      JSON.stringify(skills || {})
    );

    // Save sections if present
    if (sections) {
      for (const sectionName of Object.keys(sections)) {
        await resumeModel.saveSection(resumeId, sectionName, JSON.stringify(sections[sectionName]));
      }
    }

    res.json({ success: true, id: resumeId, message: 'Resume created successfully.' });
  } catch (err) {
    console.error('saveResume error:', err);
    res.status(500).json({ success: false, message: 'Server error saving resume.' });
  }
};

// PUT /api/resume/update
const updateResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, title, template, personal_info, summary, skills, sections } = req.body;

    if (!id) return res.status(400).json({ success: false, message: 'Resume ID is required.' });

    // Validate ownership
    const resume = await resumeModel.getResumeById(id);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });
    if (resume.user_id !== userId) return res.status(403).json({ success: false, message: 'Access denied.' });

    await resumeModel.updateResume(
      id,
      title || resume.title,
      template || resume.template,
      JSON.stringify(personal_info || {}),
      summary || '',
      JSON.stringify(skills || {})
    );

    // Save sections if present
    if (sections) {
      for (const sectionName of Object.keys(sections)) {
        await resumeModel.saveSection(id, sectionName, JSON.stringify(sections[sectionName]));
      }
    }

    res.json({ success: true, message: 'Resume updated successfully.' });
  } catch (err) {
    console.error('updateResume error:', err);
    res.status(500).json({ success: false, message: 'Server error updating resume.' });
  }
};

// DELETE /api/resume/:id
const deleteResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;

    const resume = await resumeModel.getResumeById(resumeId);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });
    if (resume.user_id !== userId) return res.status(403).json({ success: false, message: 'Access denied.' });

    await resumeModel.deleteResume(resumeId);
    res.json({ success: true, message: 'Resume deleted successfully.' });
  } catch (err) {
    console.error('deleteResume error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting resume.' });
  }
};

// POST /api/resume/scan
const scanResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, job_description } = req.body;

    if (!id || !job_description) {
      return res.status(400).json({ success: false, message: 'Missing parameters.' });
    }

    const resume = await resumeModel.getResumeById(id);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });
    if (resume.user_id !== userId) return res.status(403).json({ success: false, message: 'Access denied.' });

    const sections = await resumeModel.getSections(id);

    // Aggregate entire resume text for scoring keyword matching
    let resumeText = `${resume.title} ${resume.summary} ${resume.skills} `;
    sections.forEach(s => {
      resumeText += ` ${s.content_json} `;
    });

    const result = await resumeService.scanATS(resumeText, job_description);

    // Log scan results
    await resumeModel.logScan(
      userId,
      id,
      job_description,
      result.score,
      JSON.stringify(result.matched),
      JSON.stringify(result.missing)
    );

    res.json({
      success: true,
      score: result.score,
      matched: result.matched,
      missing: result.missing,
      suggestions: result.suggestions
    });
  } catch (err) {
    console.error('scanResume error:', err);
    res.status(500).json({ success: false, message: 'Server error scanning resume.' });
  }
};

// POST /api/resume/download
const downloadResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, format } = req.body;

    if (!id) return res.status(400).json({ success: false, message: 'Resume ID is required.' });

    // Validate ownership before tracking download
    const resume = await resumeModel.getResumeById(id);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });
    if (resume.user_id !== userId) return res.status(403).json({ success: false, message: 'Access denied.' });

    await resumeModel.logDownload(userId, id, format || 'pdf');
    res.json({ success: true, message: 'Download tracked successfully.' });
  } catch (err) {
    console.error('downloadResume error:', err);
    res.status(500).json({ success: false, message: 'Server error tracking download.' });
  }
};

// POST /api/resume/template
const changeTemplate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, template } = req.body;

    if (!id || !template) return res.status(400).json({ success: false, message: 'Missing parameters.' });

    const resume = await resumeModel.getResumeById(id);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });
    if (resume.user_id !== userId) return res.status(403).json({ success: false, message: 'Access denied.' });

    await db.query('UPDATE user_resumes SET template = ? WHERE id = ?', [template, id]);

    res.json({ success: true, message: 'Template updated successfully.' });
  } catch (err) {
    console.error('changeTemplate error:', err);
    res.status(500).json({ success: false, message: 'Server error updating template.' });
  }
};

// GET /api/resume/history
const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await resumeModel.getScanHistory(userId);
    res.json({ success: true, history });
  } catch (err) {
    console.error('getHistory error:', err);
    res.status(500).json({ success: false, message: 'Server error loading history.' });
  }
};

// POST /api/resume/ai/improve
const improveResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, section_name, content } = req.body;

    if (!content) return res.status(400).json({ success: false, message: 'Content is required.' });

    // Mock AI professional writing rewrites fallback
    let improvedText = content;
    if (section_name === 'summary') {
      improvedText = `Highly motivated and results-oriented Software Engineer with a solid foundation in ${content}. Adept at designing scalable REST APIs and building responsive front-end frameworks to streamline user operations.`;
    } else {
      improvedText = `Optimized and built high-performance data systems by leveraging ${content}, achieving a 25% improvement in processing latency.`;
    }

    if (id) {
      await resumeModel.logAiHistory(userId, id, `improve ${section_name}: ${content}`, improvedText);
    }

    res.json({ success: true, improved: improvedText });
  } catch (err) {
    console.error('improveResume error:', err);
    res.status(500).json({ success: false, message: 'Server error optimizing content.' });
  }
};

// GET /api/resume/public/:username
const getPublicResume = async (req, res) => {
  try {
    const username = req.params.username;

    const [[user]] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const resumes = await resumeModel.getResumes(user.id);
    if (resumes.length === 0) {
      return res.status(404).json({ success: false, message: 'No public resume found.' });
    }

    const latestResume = resumes[0];
    const sections = await resumeModel.getSections(latestResume.id);

    res.json({
      success: true,
      resume: {
        ...latestResume,
        personal_info: JSON.parse(latestResume.personal_info || '{}'),
        skills: JSON.parse(latestResume.skills || '{}'),
        sections: sections.reduce((acc, s) => {
          acc[s.section_name] = JSON.parse(s.content_json || '[]');
          return acc;
        }, {})
      }
    });
  } catch (err) {
    console.error('getPublicResume error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching public resume.' });
  }
};

module.exports = {
  getResume,
  saveResume,
  updateResume,
  deleteResume,
  scanResume,
  downloadResume,
  changeTemplate,
  getHistory,
  improveResume,
  getPublicResume
};
