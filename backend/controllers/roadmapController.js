// ============================================================
// backend/controllers/roadmapController.js
// EduNet — Full Roadmap Learning System API Controller
// ============================================================
'use strict';

const db = require('../config/db');
const contentEngine = require('../services/contentEngine');

async function updateLearningStreak(userId) {
  try {
    const [[user]] = await db.query(
      `SELECT streak, longest_streak, last_active_date FROM users WHERE id = ?`,
      [userId]
    );

    if (!user) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const lastActive = user.last_active_date ? new Date(user.last_active_date).toISOString().split('T')[0] : null;

    if (lastActive === todayStr) {
      return;
    }

    let newStreak = 1;
    if (lastActive) {
      const oneDayMs = 24 * 60 * 60 * 1000;
      const diffDays = Math.round((new Date(todayStr) - new Date(lastActive)) / oneDayMs);
      if (diffDays === 1) {
        newStreak = (user.streak || 0) + 1;
      }
    }

    const newLongest = Math.max(user.longest_streak || 0, newStreak);

    await db.query(
      `UPDATE users SET streak = ?, longest_streak = ?, last_active_date = ? WHERE id = ?`,
      [newStreak, newLongest, todayStr, userId]
    );

    await db.query(
      `INSERT IGNORE INTO learning_streak_log (user_id, date, streak_day) VALUES (?, ?, ?)`,
      [userId, todayStr, newStreak]
    );
  } catch (err) {
    console.error('Failed to update streak:', err.message);
  }
}

let roadmapsCache = null;
let modMapCache = null;
let roadmapCacheTimestamp = 0;
const ROADMAP_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const getCachedRoadmapsData = async () => {
  const now = Date.now();
  if (roadmapsCache && modMapCache && (now - roadmapCacheTimestamp < ROADMAP_CACHE_TTL)) {
    return { roadmaps: roadmapsCache, modMap: modMapCache };
  }

  const [roadmaps] = await db.query(`
    SELECT id, title, description, category, difficulty, duration,
           xp_reward, lesson_count, icon, tags, is_featured,
           salary_min, salary_max, enrolled
    FROM roadmaps
    ORDER BY is_featured DESC, enrolled DESC, title ASC
  `);

  const [modCounts] = await db.query(`
    SELECT roadmap_id, COUNT(*) AS module_count
    FROM roadmap_modules
    GROUP BY roadmap_id
  `);

  const modMap = {};
  modCounts.forEach(r => modMap[r.roadmap_id] = r.module_count);

  roadmapsCache = roadmaps;
  modMapCache = modMap;
  roadmapCacheTimestamp = now;

  return { roadmaps, modMap };
};

const clearRoadmapCache = () => {
  roadmapsCache = null;
  modMapCache = null;
  roadmapCacheTimestamp = 0;
};
exports.clearRoadmapCache = clearRoadmapCache;

// ── GET /api/roadmaps ──────────────────────────────────────────
// List all roadmaps with metadata and progress for authenticated user
exports.getAllRoadmaps = async (req, res) => {
  try {
    const { roadmaps, modMap } = await getCachedRoadmapsData();

    // Get user progress if logged in
    let progressMap = {};
    if (req.user) {
      const [prog] = await db.query(`
        SELECT mp.roadmap_id, COUNT(*) AS done
        FROM module_progress mp
        WHERE mp.user_id = ? AND mp.completed = 1
        GROUP BY mp.roadmap_id
      `, [req.user.id]);
      prog.forEach(p => progressMap[p.roadmap_id] = p.done);
    }

    const result = roadmaps.map(rm => {
      const total = modMap[rm.id] || rm.lesson_count || 12;
      const done = progressMap[rm.id] || 0;
      return {
        ...rm,
        module_count: total,
        modules_done: done,
        progress_pct: total > 0 ? Math.round((done / total) * 100) : 0,
      };
    });

    res.json({ success: true, roadmaps: result });
  } catch (err) {
    console.error('getAllRoadmaps error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/roadmaps/:id ──────────────────────────────────────
// Get single roadmap detail with all modules
exports.getRoadmapById = async (req, res) => {
  try {
    const { id } = req.params;
    const [[roadmap]] = await db.query(
      `SELECT * FROM roadmaps WHERE id = ?`, [id]
    );
    if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });

    const [modules] = await db.query(`
      SELECT id, title, description, order_index, xp_reward, icon, language
      FROM roadmap_modules
      WHERE roadmap_id = ?
      ORDER BY order_index ASC
    `, [id]);

    // Progress per module
    let progMap = {};
    let lessonProgMap = {};
    let beginnerAssessmentPassed = false;
    let intermediateAssessmentPassed = false;
    let expertAssessmentPassed = false;
    let hasCertificate = false;
    let certHash = null;

    if (req.user) {
      const [prog] = await db.query(`
        SELECT module_id, completed, quiz_score, challenge_done
        FROM module_progress
        WHERE user_id = ? AND roadmap_id = ?
      `, [req.user.id, id]);
      prog.forEach(p => progMap[p.module_id] = p);

      const [lprog] = await db.query(`
        SELECT lp.lesson_id, lp.completed
        FROM lesson_progress lp
        JOIN module_lessons ml ON lp.lesson_id = ml.id
        JOIN roadmap_modules rm ON ml.module_id = rm.id
        WHERE lp.user_id = ? AND rm.roadmap_id = ?
      `, [req.user.id, id]);
      lprog.forEach(lp => lessonProgMap[lp.lesson_id] = !!lp.completed);

      const [levelProg] = await db.query(
        `SELECT level, passed FROM level_progress WHERE user_id = ? AND roadmap_id = ?`,
        [req.user.id, id]
      );
      levelProg.forEach(lp => {
        if (lp.level.toLowerCase() === 'beginner' && lp.passed) beginnerAssessmentPassed = true;
        if (lp.level.toLowerCase() === 'intermediate' && lp.passed) intermediateAssessmentPassed = true;
        if (lp.level.toLowerCase() === 'expert' && lp.passed) expertAssessmentPassed = true;
      });

      const [[cert]] = await db.query(
        `SELECT id, certificate_hash FROM certificates WHERE user_id = ? AND roadmap_id = ? LIMIT 1`,
        [req.user.id, id]
      );
      if (cert) {
        hasCertificate = true;
        certHash = cert.certificate_hash;
      }
    }

    // Get all lessons for these modules
    let enrichedModules = [];
    const beginnerLessons = [];
    const intermediateLessons = [];
    const expertLessons = [];
    const totalModules = modules.length;

    // Determine levels for modules dynamically
    modules.forEach((m, idx) => {
      const levelIdx = Math.floor((idx / totalModules) * 3);
      m.level = levelIdx === 0 ? 'beginner' : levelIdx === 1 ? 'intermediate' : 'expert';
    });

    const flatLessons = [];
    let doneCount = 0;

    if (totalModules > 0) {
      const mids = modules.map(m => m.id);
      const [lessons] = await db.query(`
        SELECT id, module_id, title, order_index
        FROM module_lessons
        WHERE module_id IN (${mids.join(',')})
        ORDER BY order_index ASC
      `);

      const lessonGroup = {};
      lessons.forEach(l => {
        if (!lessonGroup[l.module_id]) lessonGroup[l.module_id] = [];
        lessonGroup[l.module_id].push({
          ...l,
          completed: !!lessonProgMap[l.id]
        });
      });

      // Calculate total done lessons
      lessons.forEach(l => {
        if (lessonProgMap[l.id]) doneCount++;
      });

      // Set status on lessons within each module
      modules.forEach((m, mIdx) => {
        const moduleLessons = lessonGroup[m.id] || [];
        const isModuleUnlocked = mIdx === 0 || !!(progMap[modules[mIdx - 1]?.id]?.completed);
        
        let prevLessonCompleted = true; // Within the module, first lesson is unlocked if module is unlocked
        
        moduleLessons.forEach((l) => {
          let levelLocked = false;
          if (m.level === 'intermediate' && !beginnerAssessmentPassed) {
            levelLocked = true;
          }
          if (m.level === 'expert' && !intermediateAssessmentPassed) {
            levelLocked = true;
          }
          
          if (!isModuleUnlocked || levelLocked) {
            l.status = 'locked';
          } else if (l.completed) {
            l.status = 'completed';
          } else if (prevLessonCompleted) {
            l.status = 'current';
            prevLessonCompleted = false; // Only one active lesson at a time
          } else {
            l.status = 'locked';
          }
          l.locked = (l.status === 'locked');
          
          prevLessonCompleted = l.completed;
        });
      });

      enrichedModules = modules.map((m, idx) => {
        const moduleLessons = lessonGroup[m.id] || [];
        const doneLessonsCount = moduleLessons.filter(l => l.completed).length;
        const totalLessonsCount = moduleLessons.length;
        const progressVal = totalLessonsCount > 0 ? Math.round((doneLessonsCount / totalLessonsCount) * 100) : 0;

        return {
          ...m,
          lessons: moduleLessons,
          status: progMap[m.id]?.completed ? 'completed' : idx === 0 ? 'unlocked' : (progMap[modules[idx-1]?.id]?.completed ? 'unlocked' : 'locked'),
          completed: !!(progMap[m.id]?.completed),
          progress: progressVal, // calculated as completedLessons / totalLessons
          quiz_score: progMap[m.id]?.quiz_score || 0,
          challenge_done: !!(progMap[m.id]?.challenge_done),
        };
      });

      // Flatten lessons across the whole roadmap in sequence
      modules.forEach(m => {
        const moduleLessons = lessonGroup[m.id] || [];
        moduleLessons.forEach(l => {
          flatLessons.push({
            id: l.id,
            title: l.title,
            module_id: m.id,
            module_title: m.title,
            level: m.level,
            completed: l.completed,
            status: l.status, // Preserve computed status
            locked: l.locked
          });
        });
      });

      // Group into level categories
      flatLessons.forEach(l => {
        if (l.level === 'beginner') beginnerLessons.push(l);
        else if (l.level === 'intermediate') intermediateLessons.push(l);
        else if (l.level === 'expert') expertLessons.push(l);
      });
    }

    const getLevelProgress = (lessonsList) => {
      if (!lessonsList.length) return 0;
      const done = lessonsList.filter(l => l.completed).length;
      return Math.round((done / lessonsList.length) * 100);
    };

    const beginnerProgress = getLevelProgress(beginnerLessons);
    const intermediateProgress = getLevelProgress(intermediateLessons);
    const expertProgress = getLevelProgress(expertLessons);

    const totalLessonsCount = flatLessons.length;
    const progressPct = totalLessonsCount > 0 ? Math.round((doneCount / totalLessonsCount) * 100) : 0;

    res.json({
      success: true,
      roadmap: {
        ...roadmap,
        modules: enrichedModules,
        beginner: beginnerLessons,
        intermediate: intermediateLessons,
        expert: expertLessons,
        beginner_progress: beginnerProgress,
        intermediate_progress: intermediateProgress,
        expert_progress: expertProgress,
        beginner_assessment: {
          locked: beginnerLessons.length === 0 || !beginnerLessons.every(l => l.completed),
          passed: beginnerAssessmentPassed
        },
        intermediate_assessment: {
          locked: intermediateLessons.length === 0 || !intermediateLessons.every(l => l.completed) || !beginnerAssessmentPassed,
          passed: intermediateAssessmentPassed
        },
        expert_assessment: {
          locked: expertLessons.length === 0 || !expertLessons.every(l => l.completed) || !intermediateAssessmentPassed,
          passed: expertAssessmentPassed
        },
        certification_exam: {
          locked: !expertAssessmentPassed,
          passed: hasCertificate,
          hash: certHash
        },
        modules_total: totalModules,
        modules_done: doneCount,
        progress_pct: progressPct,
      }
    });
  } catch (err) {
    console.error('getRoadmapById error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/roadmaps/:id/modules ─────────────────────────────
exports.getRoadmapModules = async (req, res) => {
  try {
    const [modules] = await db.query(`
      SELECT id, title, description, order_index, xp_reward, icon, language
      FROM roadmap_modules
      WHERE roadmap_id = ?
      ORDER BY order_index ASC
    `, [req.params.id]);
    res.json({ success: true, modules });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/roadmaps/modules/:moduleId ───────────────────────
// Full module detail: lesson, videos, resources, exercises, challenge, quiz
exports.getModuleDetail = async (req, res) => {
  try {
    const mid = req.params.moduleId || req.params.id;

    const [[module]] = await db.query(`
      SELECT rm.*, r.title AS roadmap_title, r.icon AS roadmap_icon
      FROM roadmap_modules rm
      JOIN roadmaps r ON rm.roadmap_id = r.id
      WHERE rm.id = ?
    `, [mid]);
    if (!module) return res.status(404).json({ success: false, message: 'Module not found' });

    const [[lesson]] = await db.query(
      `SELECT * FROM module_lessons WHERE module_id = ? ORDER BY order_index LIMIT 1`, [mid]
    );

    const [videos] = await db.query(
      `SELECT * FROM lesson_videos WHERE module_id = ? LIMIT 4`, [mid]
    );

    const [resources] = await db.query(
      `SELECT * FROM lesson_resources WHERE module_id = ?`, [mid]
    );

    const [exercises] = await db.query(
      `SELECT * FROM lesson_exercises WHERE module_id = ? ORDER BY order_index`, [mid]
    );

    const [[challenge]] = await db.query(
      `SELECT * FROM lesson_challenges WHERE module_id = ? LIMIT 1`, [mid]
    );

    const [quizzes] = await db.query(
      `SELECT id, question, option_a, option_b, option_c, option_d, explanation, order_index
       FROM lesson_quizzes WHERE module_id = ? ORDER BY order_index`, [mid]
    );

    // Get adjacent modules
    const [[prevModule]] = await db.query(`
      SELECT id, title FROM roadmap_modules
      WHERE roadmap_id = ? AND order_index < ?
      ORDER BY order_index DESC LIMIT 1
    `, [module.roadmap_id, module.order_index]);

    const [[nextModule]] = await db.query(`
      SELECT id, title FROM roadmap_modules
      WHERE roadmap_id = ? AND order_index > ?
      ORDER BY order_index ASC LIMIT 1
    `, [module.roadmap_id, module.order_index]);

    // User progress
    let userProgress = null;
    if (req.user) {
      const [[prog]] = await db.query(
        `SELECT * FROM module_progress WHERE user_id = ? AND module_id = ?`,
        [req.user.id, mid]
      );
      userProgress = prog || null;
    }

    res.json({
      success: true,
      module,
      lesson: lesson || null,
      videos,
      resources,
      exercises,
      challenge: challenge || null,
      quizzes,
      prev_module: prevModule || null,
      next_module: nextModule || null,
      user_progress: userProgress,
    });
  } catch (err) {
    console.error('getModuleDetail error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/roadmaps/modules/:moduleId/quiz ──────────────────
exports.getModuleQuiz = async (req, res) => {
  try {
    const [quizzes] = await db.query(
      `SELECT id, question, option_a, option_b, option_c, option_d, order_index
       FROM lesson_quizzes WHERE module_id = ? ORDER BY order_index`,
      [req.params.moduleId]
    );
    res.json({ success: true, quizzes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/roadmaps/modules/:moduleId/quiz/submit ──────────
exports.submitModuleQuiz = async (req, res) => {
  try {
    const mid = req.params.moduleId;
    const { answers } = req.body; // { quiz_id: 'A'|'B'|'C'|'D', ... }
    if (!answers) return res.status(400).json({ success: false, message: 'answers required' });

    const [quizzes] = await db.query(
      `SELECT id, correct_option, explanation FROM lesson_quizzes WHERE module_id = ?`, [mid]
    );

    let correct = 0;
    const results = quizzes.map(q => {
      const userAns = answers[q.id];
      const isCorrect = userAns === q.correct_option;
      if (isCorrect) correct++;
      return { quiz_id: q.id, correct: isCorrect, correct_option: q.correct_option, explanation: q.explanation };
    });

    const score = quizzes.length > 0 ? Math.round((correct / quizzes.length) * 100) : 0;

    // Update module progress quiz score
    if (req.user) {
      const [[mod]] = await db.query(
        `SELECT roadmap_id FROM roadmap_modules WHERE id = ?`, [mid]
      );
      await db.query(`
        INSERT INTO module_progress (user_id, module_id, roadmap_id, quiz_score)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE quiz_score = GREATEST(quiz_score, ?)
      `, [req.user.id, mid, mod?.roadmap_id || '', score, score]);
    }

    clearRoadmapCache();
    res.json({ success: true, score, correct, total: quizzes.length, results });
  } catch (err) {
    console.error('submitModuleQuiz error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/roadmaps/modules/:moduleId/complete ─────────────
exports.completeModule = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login required' });
    const mid = req.params.moduleId;
    const { challenge_done = false } = req.body;

    const [[mod]] = await db.query(
      `SELECT roadmap_id, xp_reward FROM roadmap_modules WHERE id = ?`, [mid]
    );
    if (!mod) return res.status(404).json({ success: false, message: 'Module not found' });

    await db.query(`
      INSERT INTO module_progress (user_id, module_id, roadmap_id, completed, challenge_done)
      VALUES (?, ?, ?, 1, ?)
      ON DUPLICATE KEY UPDATE completed = 1, challenge_done = GREATEST(challenge_done, ?)
    `, [req.user.id, mid, mod.roadmap_id, challenge_done ? 1 : 0, challenge_done ? 1 : 0]);

    // Grant XP
    const xp = mod.xp_reward + (challenge_done ? 150 : 0);
    await db.query(
      `UPDATE users SET xp = xp + ?, level = FLOOR((xp + ?) / 500) + 1 WHERE id = ?`,
      [xp, xp, req.user.id]
    );

    // Check if roadmap is complete → generate certificate
    const [[totalMods]] = await db.query(
      `SELECT COUNT(*) AS cnt FROM roadmap_modules WHERE roadmap_id = ?`, [mod.roadmap_id]
    );
    const [[doneMods]] = await db.query(
      `SELECT COUNT(*) AS cnt FROM module_progress WHERE user_id = ? AND roadmap_id = ? AND completed = 1`,
      [req.user.id, mod.roadmap_id]
    );

    let certificate = null;
    if (doneMods.cnt >= totalMods.cnt && totalMods.cnt > 0) {
      const [[existing]] = await db.query(
        `SELECT id FROM certificates WHERE user_id = ? AND roadmap_id = ?`,
        [req.user.id, mod.roadmap_id]
      );
      if (!existing) {
        const hash = 'EN-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2,8).toUpperCase();
        const [[rm]] = await db.query(`SELECT title FROM roadmaps WHERE id = ?`, [mod.roadmap_id]);
        await db.query(`
          INSERT INTO certificates (user_id, roadmap_id, certificate_hash, title)
          VALUES (?, ?, ?, ?)
        `, [req.user.id, mod.roadmap_id, hash, rm?.title + ' Completion Certificate']);
        certificate = { hash, roadmap_id: mod.roadmap_id };
      }
    }

    clearRoadmapCache();
    res.json({
      success: true,
      xp_awarded: xp,
      certificate,
      modules_done: doneMods.cnt,
      modules_total: totalMods.cnt,
      roadmap_complete: doneMods.cnt >= totalMods.cnt,
    });
  } catch (err) {
    console.error('completeModule error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/roadmaps/bookmark ───────────────────────────────
exports.bookmarkRoadmap = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login required' });
    const { roadmap_id } = req.body;
    if (!roadmap_id) return res.status(400).json({ success: false, message: 'roadmap_id required' });

    const [[existing]] = await db.query(
      `SELECT id FROM bookmarks WHERE user_id = ? AND item_type = 'roadmap' AND item_id = ?`,
      [req.user.id, roadmap_id]
    );
    if (existing) {
      await db.query(`DELETE FROM bookmarks WHERE id = ?`, [existing.id]);
      return res.json({ success: true, bookmarked: false });
    }
    await db.query(
      `INSERT INTO bookmarks (user_id, item_type, item_id) VALUES (?, 'roadmap', ?)`,
      [req.user.id, roadmap_id]
    );
    res.json({ success: true, bookmarked: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/roadmaps/progress/:roadmapId ─────────────────────
exports.getRoadmapProgress = async (req, res) => {
  try {
    if (!req.user) return res.json({ success: true, progress: [] });

    const [progress] = await db.query(`
      SELECT mp.module_id, mp.completed, mp.quiz_score, mp.challenge_done
      FROM module_progress mp
      WHERE mp.user_id = ? AND mp.roadmap_id = ?
    `, [req.user.id, req.params.roadmapId]);

    res.json({ success: true, progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/roadmaps/search ──────────────────────────────────
// Global Database Search (Roadmaps, Modules, Lessons, Users, Certificates)
exports.searchRoadmaps = async (req, res) => {
  try {
    const term = req.query.q || '';
    if (!term.trim()) {
      return res.json({ success: true, results: [] });
    }
    const q = `%${term}%`;

    // 1. Roadmaps
    const [rmResults] = await db.query(`
      SELECT 'roadmap' AS type, r.id AS id, r.title, r.description AS rdesc, r.icon, 'roadmaps.html' AS link
      FROM roadmaps r
      WHERE r.title LIKE ? OR r.description LIKE ? OR r.tags LIKE ?
      LIMIT 6
    `, [q, q, q]);

    // 2. Modules
    const [modResults] = await db.query(`
      SELECT 'module' AS type, CAST(rm.id AS CHAR) AS id, rm.title, rm.description AS rdesc, rm.icon, 'roadmaps.html' AS link
      FROM roadmap_modules rm
      WHERE rm.title LIKE ? OR rm.description LIKE ?
      LIMIT 6
    `, [q, q]);

    // 3. Lessons
    const [lessonResults] = await db.query(`
      SELECT 'lesson' AS type, CAST(ml.id AS CHAR) AS id, ml.title, ml.short_desc AS rdesc, '📖' AS icon, 'roadmaps.html' AS link
      FROM module_lessons ml
      WHERE ml.title LIKE ? OR ml.short_desc LIKE ?
      LIMIT 6
    `, [q, q]);

    // 4. Users (Public search)
    const [userResults] = await db.query(`
      SELECT 'user' AS type, CAST(u.id AS CHAR) AS id, u.username AS title, CONCAT(IFNULL(u.branch, 'SDE'), ' Track') AS rdesc, '👤' AS icon, 'profile.html' AS link
      FROM users u
      WHERE u.username LIKE ? AND u.is_public = 1
      LIMIT 4
    `, [q]);

    // 5. Certificates (Verification hash search)
    const [certResults] = await db.query(`
      SELECT 'certificate' AS type, c.certificate_hash AS id, CONCAT('Certificate for ', r.title) AS title, CONCAT('Hash: ', SUBSTRING(c.certificate_hash, 1, 12), '...') AS rdesc, '🏆' AS icon, 'certificates.html' AS link
      FROM certificates c
      JOIN roadmaps r ON c.roadmap_id = r.id
      WHERE c.certificate_hash LIKE ?
      LIMIT 4
    `, [q]);

    // Merge & limit
    const results = [...rmResults, ...modResults, ...lessonResults, ...userResults, ...certResults].slice(0, 25);
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/roadmaps/user/stats ─────────────────────────────
exports.getUserRoadmapStats = async (req, res) => {
  try {
    if (!req.user) return res.json({ success: true, stats: {} });

    const [[stats]] = await db.query(`
      SELECT
        COUNT(DISTINCT mp.roadmap_id) AS roadmaps_started,
        SUM(mp.completed) AS modules_completed,
        SUM(mp.challenge_done) AS challenges_done
      FROM module_progress mp
      WHERE mp.user_id = ?
    `, [req.user.id]);

    const [certs] = await db.query(
      `SELECT COUNT(*) AS cert_count FROM certificates WHERE user_id = ?`, [req.user.id]
    );

    res.json({
      success: true,
      stats: {
        roadmaps_started: stats.roadmaps_started || 0,
        modules_completed: stats.modules_completed || 0,
        challenges_done: stats.challenges_done || 0,
        certificates: certs[0].cert_count || 0,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/modules/:id/videos ──────────────────────────────
exports.getModuleVideos = async (req, res) => {
  try {
    const [videos] = await db.query(
      `SELECT * FROM lesson_videos WHERE module_id = ?`,
      [req.params.id]
    );
    res.json({ success: true, videos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/modules/:id/resources ───────────────────────────
exports.getModuleResources = async (req, res) => {
  try {
    const [resources] = await db.query(
      `SELECT * FROM lesson_resources WHERE module_id = ?`,
      [req.params.id]
    );
    res.json({ success: true, resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/modules/:id/projects ────────────────────────────
exports.getModuleProjects = async (req, res) => {
  try {
    const [projects] = await db.query(
      `SELECT * FROM lesson_projects WHERE module_id = ?`,
      [req.params.id]
    );
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/modules/:id/exercises ───────────────────────────
exports.getModuleExercises = async (req, res) => {
  try {
    const [exercises] = await db.query(
      `SELECT * FROM lesson_exercises WHERE module_id = ? ORDER BY order_index`,
      [req.params.id]
    );
    res.json({ success: true, exercises });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/modules/:id/quizzes ─────────────────────────────
exports.getModuleQuizzes = async (req, res) => {
  try {
    const [quizzes] = await db.query(
      `SELECT id, question, option_a, option_b, option_c, option_d, explanation, order_index
       FROM lesson_quizzes WHERE module_id = ? ORDER BY order_index`,
      [req.params.id]
    );
    res.json({ success: true, quizzes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/modules/:id/notes ──────────────────────────────
exports.saveModuleNote = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login required' });
    const { content } = req.body;
    if (content === undefined) return res.status(400).json({ success: false, message: 'content is required' });

    await db.query(`
      INSERT INTO lesson_notes (user_id, module_id, content)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE content = VALUES(content)
    `, [req.user.id, req.params.id, content]);

    res.json({ success: true, message: 'Note saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/modules/:id/notes ───────────────────────────────
exports.getModuleNote = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login required' });

    const [[note]] = await db.query(
      `SELECT content, updated_at FROM lesson_notes WHERE user_id = ? AND module_id = ?`,
      [req.user.id, req.params.id]
    );

    res.json({ success: true, note: note || { content: '' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/bookmarks ──────────────────────────────────────
exports.saveBookmark = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login required' });
    const { item_type, item_id } = req.body;
    if (!item_type || !item_id) return res.status(400).json({ success: false, message: 'item_type and item_id required' });

    const [[existing]] = await db.query(
      `SELECT id FROM bookmarks WHERE user_id = ? AND item_type = ? AND item_id = ?`,
      [req.user.id, item_type, item_id]
    );
    if (existing) {
      await db.query(`DELETE FROM bookmarks WHERE id = ?`, [existing.id]);
      return res.json({ success: true, bookmarked: false });
    }
    await db.query(
      `INSERT INTO bookmarks (user_id, item_type, item_id) VALUES (?, ?, ?)`,
      [req.user.id, item_type, item_id]
    );
    res.json({ success: true, bookmarked: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/bookmarks ───────────────────────────────────────
exports.getUserBookmarks = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login required' });
    const [bookmarks] = await db.query(
      `SELECT item_type, item_id, created_at FROM bookmarks WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, bookmarks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/certificates ────────────────────────────────────
exports.getUserCertificates = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login required' });
    const [certs] = await db.query(`
      SELECT c.*, r.title AS roadmap_title, r.icon AS roadmap_icon
      FROM certificates c
      JOIN roadmaps r ON c.roadmap_id = r.id
      WHERE c.user_id = ?
      ORDER BY c.issued_at DESC
    `, [req.user.id]);
    res.json({ success: true, certificates: certs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

async function syncLessonQuizzes(lessonId, lesson) {
  // Check existing quizzes in DB
  const [quizzes] = await db.query(`SELECT * FROM lesson_quizzes WHERE lesson_id = ?`, [lessonId]);
  
  let isGeneric = false;
  if (quizzes.length === 0) {
    isGeneric = true;
  } else {
    for (const q of quizzes) {
      const qText = q.question || '';
      if (
        qText.includes("What is the primary concept behind") ||
        qText.includes("Which of the following is considered a best practice for") ||
        qText.includes("What common mistake happens with") ||
        qText.includes("always runs in linear time.") ||
        qText.includes("How does the runtime stack handle calls to") ||
        qText.includes("What is the primary architectural goal of")
      ) {
        isGeneric = true;
        break;
      }
    }
  }

  if (isGeneric) {
    console.log(`[syncLessonQuizzes] Lesson ${lessonId} has generic or empty quizzes. Regenerating unique quizzes...`);
    // Ensure lesson is enriched to get generated quiz questions
    contentEngine.enrichLesson(lesson);
    const uniqueQuizzes = lesson.quiz?.mcqs || [];
    
    if (uniqueQuizzes.length > 0) {
      await db.query(`DELETE FROM lesson_quizzes WHERE lesson_id = ?`, [lessonId]);
      for (let i = 0; i < uniqueQuizzes.length; i++) {
        const uq = uniqueQuizzes[i];
        const optA = uq.options[0] || 'Option A';
        const optB = uq.options[1] || 'Option B';
        const optC = uq.options[2] || 'Option C';
        const optD = uq.options[3] || 'Option D';
        
        await db.query(`
          INSERT INTO lesson_quizzes (module_id, lesson_id, question, option_a, option_b, option_c, option_d, correct_option, explanation, order_index)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          lesson.module_id,
          lessonId,
          uq.question,
          optA,
          optB,
          optC,
          optD,
          uq.answer,
          uq.explanation || '',
          i + 1
        ]);
      }
      console.log(`[syncLessonQuizzes] Saved ${uniqueQuizzes.length} unique quizzes to DB for Lesson ${lessonId}`);
      return true;
    }
  }
  return false;
}

// ── GET /api/lessons/:id ─────────────────────────────────────
exports.getLessonDetail = async (req, res) => {
  try {
    const lid = req.params.id;
    const [[lesson]] = await db.query(
      `SELECT ml.*, rm.title AS module_title, rm.roadmap_id
       FROM module_lessons ml
       JOIN roadmap_modules rm ON ml.module_id = rm.id
       WHERE ml.id = ?`, [lid]
    );
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });

    // ── Lazy content enrichment ──────────────────────────────────────────
    // Uses isContentComplete() which detects skeleton boilerplate and
    // validates per-section educational content quality. Unlike the old
    // hasStructuredContent() / isFullyStructured(), this cannot be fooled
    // by lessons that merely have the EDUNET_STRUCTURED_V1 marker.
    if (!contentEngine.isContentComplete(lesson.learning_notes)) {
      try {
        console.log(`[getLessonDetail] Lesson ${lid} ("${lesson.title}") — content incomplete. Regenerating...`);
        const metadata = {
          language: lesson.language || 'javascript',
          module: lesson.module_title || 'General',
          lessonTitle: lesson.title,
          lessonDescription: lesson.short_desc || '',
          roadmap: lesson.roadmap_id || 'general'
        };
        const sectionsObj = await contentEngine.generateFullLessonContent(
          metadata,
          lesson.language || 'javascript'
        );
        const fullNotes = contentEngine.serializeLessonContent(sectionsObj);
        await db.query(
          `UPDATE module_lessons SET learning_notes = ? WHERE id = ?`,
          [fullNotes, lid]
        );
        lesson.learning_notes = fullNotes;
        console.log(`[getLessonDetail] Lesson ${lid} — regeneration saved to DB. Sections: ${Object.keys(sectionsObj).length}`);
      } catch (enrichErr) {
        console.warn('[getLessonDetail] Enrichment failed (non-fatal):', enrichErr.message);
      }
    } else {
      console.log(`[getLessonDetail] Lesson ${lid} ("${lesson.title}") — content complete, serving from DB.`);
    }

    // Attach structured_content parsed from learning_notes.
    // Ensures every field the frontend expects is present (never null/undefined).
    contentEngine.enrichLesson(lesson);

    // Sync/regenerate quizzes if they are generic or empty in database
    await syncLessonQuizzes(lid, lesson);

    // Fetch related content
    const [videos] = await db.query(`SELECT * FROM lesson_videos WHERE lesson_id = ?`, [lid]);
    const [resources] = await db.query(`SELECT * FROM lesson_resources WHERE lesson_id = ?`, [lid]);
    const [exercises] = await db.query(`SELECT * FROM lesson_exercises WHERE lesson_id = ? ORDER BY order_index`, [lid]);
    const [quizzes] = await db.query(`SELECT * FROM lesson_quizzes WHERE lesson_id = ? ORDER BY order_index`, [lid]);
    const [projects] = await db.query(`SELECT * FROM lesson_projects WHERE module_id = ?`, [lesson.module_id]);

    // Enrich quiz explanations if sparse
    const enrichedQuizzes = quizzes.map(q => ({
      ...q,
      structured_explanation: q.explanation && q.explanation.length > 50
        ? q.explanation
        : `✅ **Correct Answer: ${q.correct_option || 'See above'}**\n\nThis question tests your understanding of **${lesson.title}**. Review the lesson content to reinforce the correct answer and understand why the other options are incorrect.`
    }));

    // Adjacent lessons across entire roadmap
    const [rmModules] = await db.query(
      `SELECT id, title FROM roadmap_modules WHERE roadmap_id = ? ORDER BY order_index ASC`,
      [lesson.roadmap_id]
    );
    const rmModuleIds = rmModules.map(m => m.id);
    let prevLesson = null;
    let nextLesson = null;
    if (rmModuleIds.length > 0) {
      const [lessonsList] = await db.query(`
        SELECT ml.id, ml.title, ml.module_id, rm.title as module_title
        FROM module_lessons ml
        JOIN roadmap_modules rm ON ml.module_id = rm.id
        WHERE ml.module_id IN (${rmModuleIds.join(',')})
        ORDER BY rm.order_index ASC, ml.order_index ASC
      `);
      const curIdx = lessonsList.findIndex(l => l.id === parseInt(lid));
      if (curIdx !== -1) {
        if (curIdx > 0) prevLesson = lessonsList[curIdx - 1];
        if (curIdx < lessonsList.length - 1) nextLesson = lessonsList[curIdx + 1];
      }
    }

    // User progress & lock status
    let completed = false;
    let locked = false;
    if (req.user) {
      const userId = req.user.id;
      const [[prog]] = await db.query(
        `SELECT completed FROM lesson_progress WHERE user_id = ? AND lesson_id = ?`,
        [userId, lid]
      );
      completed = !!prog?.completed;

      // Compute lock status using the exact sequencing logic
      try {
        const roadmapId = lesson.roadmap_id;
        const [modules] = await db.query(
          `SELECT id, level FROM roadmap_modules WHERE roadmap_id = ? ORDER BY order_index ASC`,
          [roadmapId]
        );

        // Assign levels to modules
        const totalModules = modules.length;
        modules.forEach((m, idx) => {
          const levelIdx = Math.floor((idx / totalModules) * 3);
          m.level = levelIdx === 0 ? 'beginner' : levelIdx === 1 ? 'intermediate' : 'expert';
        });

        const [progList] = await db.query(
          `SELECT module_id, completed FROM module_progress WHERE user_id = ? AND roadmap_id = ?`,
          [userId, roadmapId]
        );
        const progMap = {};
        progList.forEach(p => {
          progMap[p.module_id] = { completed: !!p.completed };
        });

        const [lprog] = await db.query(`
          SELECT lp.lesson_id, lp.completed
          FROM lesson_progress lp
          JOIN module_lessons ml ON lp.lesson_id = ml.id
          JOIN roadmap_modules rm ON ml.module_id = rm.id
          WHERE lp.user_id = ? AND rm.roadmap_id = ?
        `, [userId, roadmapId]);
        const lessonProgMap = {};
        lprog.forEach(lp => {
          lessonProgMap[lp.lesson_id] = !!lp.completed;
        });

        const [beginnerAssessAttempts] = await db.query(
          `SELECT passed FROM level_assessments WHERE user_id = ? AND roadmap_id = ? AND level = 'beginner'`,
          [userId, roadmapId]
        );
        const beginnerAssessmentPassed = beginnerAssessAttempts.some(a => a.passed === 1);

        const [intermediateAssessAttempts] = await db.query(
          `SELECT passed FROM level_assessments WHERE user_id = ? AND roadmap_id = ? AND level = 'intermediate'`,
          [userId, roadmapId]
        );
        const intermediateAssessmentPassed = intermediateAssessAttempts.some(a => a.passed === 1);

        const mids = modules.map(m => m.id);
        if (mids.length > 0) {
          const [allLessons] = await db.query(`
            SELECT id, module_id FROM module_lessons
            WHERE module_id IN (${mids.join(',')})
            ORDER BY order_index ASC
          `);

          const lessonGroup = {};
          allLessons.forEach(l => {
            if (!lessonGroup[l.module_id]) lessonGroup[l.module_id] = [];
            lessonGroup[l.module_id].push({
              ...l,
              completed: !!lessonProgMap[l.id]
            });
          });

          let targetStatus = 'locked';
          modules.forEach((m, mIdx) => {
            const moduleLessons = lessonGroup[m.id] || [];
            const isModuleUnlocked = mIdx === 0 || !!(progMap[modules[mIdx - 1]?.id]?.completed);
            
            let prevLessonCompleted = true;
            
            moduleLessons.forEach((l) => {
              let levelLocked = false;
              if (m.level === 'intermediate' && !beginnerAssessmentPassed) {
                levelLocked = true;
              }
              if (m.level === 'expert' && !intermediateAssessmentPassed) {
                levelLocked = true;
              }
              
              let status = 'locked';
              if (!isModuleUnlocked || levelLocked) {
                status = 'locked';
              } else if (l.completed) {
                status = 'completed';
              } else if (prevLessonCompleted) {
                status = 'current';
                prevLessonCompleted = false;
              } else {
                status = 'locked';
              }
              
              if (l.id === parseInt(lid)) {
                targetStatus = status;
              }
              
              prevLessonCompleted = l.completed;
            });
          });

          locked = (targetStatus === 'locked');
        }
      } catch (err) {
        console.error('[getLessonDetail] Lock calculation error:', err);
      }
    }

    res.json({
      success: true,
      lesson,           // includes learning_notes (backward compat) + structured_content (new)
      videos,
      resources,
      exercises,
      quizzes: enrichedQuizzes,
      projects,
      prev_lesson: prevLesson || null,
      next_lesson: nextLesson || null,
      completed,
      locked
    });
  } catch (err) {
    console.error('getLessonDetail error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/lessons/:id/videos ──────────────────────────────
exports.getLessonVideos = async (req, res) => {
  try {
    const [videos] = await db.query(`SELECT * FROM lesson_videos WHERE lesson_id = ?`, [req.params.id]);
    res.json({ success: true, videos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/lessons/:id/resources ───────────────────────────
exports.getLessonResources = async (req, res) => {
  try {
    const [resources] = await db.query(`SELECT * FROM lesson_resources WHERE lesson_id = ?`, [req.params.id]);
    res.json({ success: true, resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/lessons/:id/exercises ───────────────────────────
exports.getLessonExercises = async (req, res) => {
  try {
    const [exercises] = await db.query(`SELECT * FROM lesson_exercises WHERE lesson_id = ? ORDER BY order_index`, [req.params.id]);
    res.json({ success: true, exercises });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/lessons/:id/quizzes ─────────────────────────────
exports.getLessonQuizzes = async (req, res) => {
  try {
    const [quizzes] = await db.query(`SELECT * FROM lesson_quizzes WHERE lesson_id = ? ORDER BY order_index`, [req.params.id]);
    res.json({ success: true, quizzes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/lessons/:id/progress ───────────────────────────
exports.completeLesson = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login required' });
    const lid = req.params.id;

    const [[lesson]] = await db.query(
      `SELECT ml.module_id, rm.roadmap_id FROM module_lessons ml
       JOIN roadmap_modules rm ON ml.module_id = rm.id
       WHERE ml.id = ?`, [lid]
    );
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });

    // Mark lesson complete
    await db.query(`
      INSERT INTO lesson_progress (user_id, lesson_id, completed)
      VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE completed = 1
    `, [req.user.id, lid]);

    // Award XP
    await db.query(
      `UPDATE users SET xp = xp + 100, level = FLOOR((xp + 100) / 500) + 1 WHERE id = ?`,
      [req.user.id]
    );

    // Update streak
    await updateLearningStreak(req.user.id);

    // Check if all lessons of this module are completed
    const [[totalLessons]] = await db.query(
      `SELECT COUNT(*) AS cnt FROM module_lessons WHERE module_id = ?`, [lesson.module_id]
    );
    const [[doneLessons]] = await db.query(`
      SELECT COUNT(*) AS cnt FROM lesson_progress lp
      JOIN module_lessons ml ON lp.lesson_id = ml.id
      WHERE lp.user_id = ? AND ml.module_id = ? AND lp.completed = 1
    `, [req.user.id, lesson.module_id]);

    let moduleCompleted = false;
    if (doneLessons.cnt >= totalLessons.cnt && totalLessons.cnt > 0) {
      // Mark module complete
      await db.query(`
        INSERT INTO module_progress (user_id, module_id, roadmap_id, completed)
        VALUES (?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE completed = 1
      `, [req.user.id, lesson.module_id, lesson.roadmap_id]);
      moduleCompleted = true;
    }

    // Invalidate roadmap caches
    clearRoadmapCache();

    // Query updated user XP and Level
    const [[updatedUser]] = await db.query(
      `SELECT xp, level FROM users WHERE id = ?`, [req.user.id]
    );

    res.json({
      success: true,
      xp_awarded: 100,
      module_completed: moduleCompleted,
      lessons_done: doneLessons.cnt,
      lessons_total: totalLessons.cnt,
      user_xp: updatedUser ? updatedUser.xp : 0,
      user_level: updatedUser ? updatedUser.level : 1
    });
  } catch (err) {
    console.error('completeLesson error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/lessons/:id/notes ──────────────────────────────
exports.saveLessonNote = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login required' });
    const { content } = req.body;
    if (content === undefined) return res.status(400).json({ success: false, message: 'content is required' });

    const [[lesson]] = await db.query(`SELECT module_id FROM module_lessons WHERE id = ?`, [req.params.id]);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });

    await db.query(`
      INSERT INTO lesson_notes (user_id, module_id, lesson_id, content)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE content = VALUES(content)
    `, [req.user.id, lesson.module_id, req.params.id, content]);

    res.json({ success: true, message: 'Note saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/lessons/:id/notes ───────────────────────────────
exports.getLessonNote = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login required' });
    const [[note]] = await db.query(
      `SELECT content, updated_at FROM lesson_notes WHERE user_id = ? AND lesson_id = ?`,
      [req.user.id, req.params.id]
    );
    res.json({ success: true, note: note || { content: '' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/roadmaps/:id/exam ───────────────────────────────
exports.getRoadmapExam = async (req, res) => {
  try {
    const roadmapId = req.params.id;

    // Get all modules in this roadmap
    const [modules] = await db.query(`
      SELECT id FROM roadmap_modules WHERE roadmap_id = ?
    `, [roadmapId]);

    if (!modules.length) {
      return res.json({ success: true, questions: [] });
    }

    const mids = modules.map(m => m.id);
    // Get all lessons in these modules
    const [lessons] = await db.query(
      `SELECT id FROM module_lessons WHERE module_id IN (${mids.map(() => '?').join(',')})`,
      mids
    );

    if (!lessons.length) {
      return res.json({ success: true, questions: [] });
    }

    const lids = lessons.map(l => l.id);

    // Get quizzes from lesson_id or module_id
    let [quizzes] = await db.query(`
      SELECT id, question, option_a, option_b, option_c, option_d, correct_option, explanation
      FROM lesson_quizzes
      WHERE (lesson_id IN (${lids.map(() => '?').join(',')})
        OR module_id IN (${mids.map(() => '?').join(',')}))
      ORDER BY RAND()
      LIMIT 150
    `, [...lids, ...mids]);

    if (!quizzes.length) {
      // Fallback: search by roadmap_exams table if lesson quizzes are empty
      const [legacyQuestions] = await db.query(
        `SELECT id, question, option_a, option_b, option_c, option_d, correct_option, explanation FROM roadmap_exams WHERE roadmap_id = ?`,
        [roadmapId]
      );
      quizzes = legacyQuestions;
    }

    // Pick 100 questions
    const selected = shuffleArray(quizzes).slice(0, 100);

    const questions = selected.map(q => ({
      id: q.id,
      question: q.question,
      options: [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean),
    }));

    // Check if user has existing session to resume
    let session = null;
    if (req.user) {
      const [[existing]] = await db.query(
        `SELECT * FROM quiz_sessions WHERE user_id = ? AND type = 'final' AND target_id = ? AND completed = 0`,
        [req.user.id, roadmapId]
      );
      if (existing) {
        session = {
          answers: JSON.parse(existing.answers || '{}'),
          time_left: existing.time_left,
          bookmarks: JSON.parse(existing.bookmarks || '[]'),
          question_ids: JSON.parse(existing.questions || '[]'),
        };
      }
    }

    res.json({
      success: true,
      questions,
      total: questions.length,
      time_limit: 90 * 60, // 90 minutes in seconds
      passing_score: 70,
      session,
    });
  } catch (err) {
    console.error('getRoadmapExam error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/roadmaps/:id/exam/submit ────────────────────────
exports.submitRoadmapExam = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login required' });
    const { answers, time_taken = 0 } = req.body;
    if (!answers) return res.status(400).json({ success: false, message: 'answers required' });
    const roadmapId = req.params.id;

    const qids = Object.keys(answers);
    if (!qids.length) return res.status(400).json({ success: false, message: 'No answers provided' });

    // Retrieve the correct option for the questions submitted
    const [quizzes] = await db.query(
      `SELECT id, correct_option, explanation, question, option_a, option_b, option_c, option_d
       FROM lesson_quizzes WHERE id IN (${qids.map(() => '?').join(',')})`,
      qids
    );

    let correct = 0;
    const results = quizzes.map(q => {
      const userAns = answers[q.id];
      const isCorrect = userAns === q.correct_option;
      if (isCorrect) {
        correct++;
      }
      return {
        id: q.id,
        question: q.question,
        correct: isCorrect,
        user_answer: userAns,
        correct_option: q.correct_option,
        explanation: q.explanation || '',
        options: [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean)
      };
    });

    const total = quizzes.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = score >= 70;

    let certificate = null;
    let hash = null;
    if (passed) {
      // Award XP
      const totalXp = 1000;
      await db.query(
        `UPDATE users SET xp = xp + ?, level = FLOOR((xp + ?) / 500) + 1 WHERE id = ?`,
        [totalXp, totalXp, req.user.id]
      );

      // Check / Create Certificate
      const [[existing]] = await db.query(
        `SELECT id, certificate_hash FROM certificates WHERE user_id = ? AND roadmap_id = ?`,
        [req.user.id, roadmapId]
      );
      if (!existing) {
        hash = 'EN-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2,8).toUpperCase();
        const [[rm]] = await db.query(`SELECT title FROM roadmaps WHERE id = ?`, [roadmapId]);
        await db.query(`
          INSERT INTO certificates (user_id, roadmap_id, certificate_hash, title)
          VALUES (?, ?, ?, ?)
        `, [req.user.id, roadmapId, hash, (rm?.title || 'Roadmap') + ' Mastery Certificate']);
        certificate = { hash, title: (rm?.title || 'Roadmap') + ' Mastery Certificate' };
      } else {
        hash = existing.certificate_hash;
        const [[rm]] = await db.query(`SELECT title FROM roadmaps WHERE id = ?`, [roadmapId]);
        certificate = { hash, title: (rm?.title || 'Roadmap') + ' Mastery Certificate' };
      }
    }

    // Save certification attempt
    await db.query(`
      INSERT INTO certification_attempts (user_id, roadmap_id, score, correct_count, total_questions, passed, time_taken, answers, certificate_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [req.user.id, roadmapId, score, correct, total, passed ? 1 : 0, time_taken, JSON.stringify(answers), hash]);

    // Update streak
    await updateLearningStreak(req.user.id);

    // Mark quiz session as completed
    await db.query(`
      UPDATE quiz_sessions SET completed = 1
      WHERE user_id = ? AND type = 'final' AND target_id = ?
    `, [req.user.id, roadmapId]);

    clearRoadmapCache();
    res.json({ success: true, score, correct, total, passed, xp_awarded: passed ? 1000 : 0, certificate, results });
  } catch (err) {
    console.error('submitRoadmapExam error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/certificates/verify/:hash ───────────────────────
exports.verifyCertificate = async (req, res) => {
  try {
    const { hash } = req.params;
    const [[cert]] = await db.query(`
      SELECT c.certificate_hash, c.issued_at, u.username, r.title AS roadmap_title
      FROM certificates c
      JOIN users u ON c.user_id = u.id
      JOIN roadmaps r ON c.roadmap_id = r.id
      WHERE c.certificate_hash = ?
    `, [hash]);

    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate verification ID is invalid.' });
    }

    res.json({
      success: true,
      certificate: {
        hash: cert.certificate_hash,
        issued_to: cert.username,
        roadmap: cert.roadmap_title,
        issued_at: cert.issued_at
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Shuffle helper ─────────────────────────────────────────────
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── GET /api/lessons/:id/quiz ─────────────────────────────────
// Returns 10-15 randomized questions for the topic quiz
exports.getLessonTopicQuiz = async (req, res) => {
  try {
    const lid = req.params.id;

    const [[lesson]] = await db.query(
      `SELECT ml.*, rm.title AS module_title, rm.roadmap_id
       FROM module_lessons ml
       JOIN roadmap_modules rm ON ml.module_id = rm.id
       WHERE ml.id = ?`, [lid]
    );

    if (lesson) {
      await syncLessonQuizzes(lid, lesson);
    }

    // First try lesson_id-based lookup, fallback to module_id
    let [quizzes] = await db.query(
      `SELECT id, question, option_a, option_b, option_c, option_d, correct_option, explanation, order_index
       FROM lesson_quizzes WHERE lesson_id = ? ORDER BY RAND() LIMIT 15`,
      [lid]
    );

    // Fallback: get module_id and fetch by module
    if (!quizzes || quizzes.length === 0) {
      const [[lesson]] = await db.query(`SELECT module_id FROM module_lessons WHERE id = ?`, [lid]);
      if (lesson) {
        [quizzes] = await db.query(
          `SELECT id, question, option_a, option_b, option_c, option_d, correct_option, explanation, order_index
           FROM lesson_quizzes WHERE module_id = ? ORDER BY RAND() LIMIT 15`,
          [lesson.module_id]
        );
      }
    }

    if (!quizzes || quizzes.length === 0) {
      return res.json({ success: true, questions: [] });
    }

    // Pick 10-15 questions
    const count = Math.min(quizzes.length, Math.max(10, Math.min(15, quizzes.length)));
    const selected = shuffleArray(quizzes).slice(0, count);

    // Remove correct_option from public response (client gets it after submit)
    const questions = selected.map(q => ({
      id: q.id,
      question: q.question,
      options: [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean),
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
    }));

    res.json({ success: true, questions, total: questions.length });
  } catch (err) {
    console.error('getLessonTopicQuiz error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/lessons/:id/quiz/submit ─────────────────────────
exports.submitLessonTopicQuiz = async (req, res) => {
  try {
    const lid = req.params.id;
    const { answers } = req.body; // { quiz_id: 'A'|'B'|'C'|'D', ... }
    if (!answers) return res.status(400).json({ success: false, message: 'answers required' });

    const qids = Object.keys(answers);
    if (!qids.length) return res.status(400).json({ success: false, message: 'No answers provided' });

    const [quizzes] = await db.query(
      `SELECT id, correct_option, explanation, question, option_a, option_b, option_c, option_d
       FROM lesson_quizzes WHERE id IN (${qids.map(() => '?').join(',')})`,
      qids
    );

    let correct = 0;
    const results = quizzes.map(q => {
      const userAns = answers[q.id];
      const isCorrect = userAns === q.correct_option;
      if (isCorrect) correct++;
      return {
        id: q.id,
        question: q.question,
        correct: isCorrect,
        user_answer: userAns,
        correct_option: q.correct_option,
        explanation: q.explanation || '',
        options: [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean),
      };
    });

    const total = quizzes.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = score >= 70;

    // Save attempt
    if (req.user) {
      await db.query(`
        INSERT INTO topic_quiz_attempts (user_id, lesson_id, score, correct_count, total_questions, passed, answers)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [req.user.id, lid, score, correct, total, passed ? 1 : 0, JSON.stringify(answers)]);

      // Award XP for passing
      if (passed) {
        await db.query(
          `UPDATE users SET xp = xp + 50 WHERE id = ?`,
          [req.user.id]
        );
      }
      
      // Update streak
      await updateLearningStreak(req.user.id);
    }

    res.json({ success: true, score, correct, total, passed, results });
  } catch (err) {
    console.error('submitLessonTopicQuiz error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/roadmaps/:id/level/:level/exam ───────────────────
// Returns 50 randomized questions for a level assessment
exports.getLevelAssessment = async (req, res) => {
  try {
    const { id: roadmapId, level } = req.params;
    const levelNorm = level.toLowerCase();

    // Get all modules in this roadmap for this level
    const [modules] = await db.query(`
      SELECT id FROM roadmap_modules
      WHERE roadmap_id = ? AND LOWER(level) = ?
      ORDER BY order_index ASC
    `, [roadmapId, levelNorm]);

    if (!modules.length) {
      return res.json({ success: true, questions: [], message: 'No modules found for this level' });
    }

    const mids = modules.map(m => m.id);
    // Get all lessons in these modules
    const [lessons] = await db.query(
      `SELECT id FROM module_lessons WHERE module_id IN (${mids.map(() => '?').join(',')})`,
      mids
    );

    if (!lessons.length) {
      return res.json({ success: true, questions: [] });
    }

    const lids = lessons.map(l => l.id);

    // Get quizzes from lesson_id or module_id
    let [quizzes] = await db.query(`
      SELECT id, question, option_a, option_b, option_c, option_d, correct_option, explanation
      FROM lesson_quizzes
      WHERE (lesson_id IN (${lids.map(() => '?').join(',')})
        OR module_id IN (${mids.map(() => '?').join(',')}))
      ORDER BY RAND()
      LIMIT 100
    `, [...lids, ...mids]);

    // Pick up to 50
    const selected = shuffleArray(quizzes).slice(0, 50);

    const questions = selected.map(q => ({
      id: q.id,
      question: q.question,
      options: [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean),
    }));

    // Check if user has existing session to resume
    let session = null;
    if (req.user) {
      const [[existing]] = await db.query(
        `SELECT * FROM quiz_sessions WHERE user_id = ? AND type = 'level' AND target_id = ? AND completed = 0`,
        [req.user.id, `${roadmapId}_${levelNorm}`]
      );
      if (existing) {
        session = {
          answers: JSON.parse(existing.answers || '{}'),
          time_left: existing.time_left,
          bookmarks: JSON.parse(existing.bookmarks || '[]'),
          question_ids: JSON.parse(existing.questions || '[]'),
        };
      }
    }

    res.json({
      success: true,
      questions,
      total: questions.length,
      time_limit: 60 * 60, // 60 minutes in seconds
      passing_score: 70,
      session,
    });
  } catch (err) {
    console.error('getLevelAssessment error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/roadmaps/:id/level/:level/exam/submit ───────────
exports.submitLevelAssessment = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login required' });
    const { id: roadmapId, level } = req.params;
    const { answers, time_taken = 0 } = req.body;
    if (!answers) return res.status(400).json({ success: false, message: 'answers required' });
    const levelNorm = level.toLowerCase();

    const qids = Object.keys(answers);
    if (!qids.length) return res.status(400).json({ success: false, message: 'No answers provided' });

    const [quizzes] = await db.query(
      `SELECT id, correct_option, explanation, question, option_a, option_b, option_c, option_d
       FROM lesson_quizzes WHERE id IN (${qids.map(() => '?').join(',')})`,
      qids
    );

    let correct = 0;
    const results = quizzes.map(q => {
      const userAns = answers[q.id];
      const isCorrect = userAns === q.correct_option;
      if (isCorrect) correct++;
      return {
        id: q.id,
        question: q.question,
        correct: isCorrect,
        user_answer: userAns,
        correct_option: q.correct_option,
        explanation: q.explanation || '',
        options: [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean),
      };
    });

    const total = quizzes.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = score >= 70;

    // Save assessment attempt
    await db.query(`
      INSERT INTO level_assessments (user_id, roadmap_id, level, score, correct_count, total_questions, passed, time_taken, answers)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [req.user.id, roadmapId, levelNorm, score, correct, total, passed ? 1 : 0, time_taken, JSON.stringify(answers)]);

    // Update level_progress
    await db.query(`
      INSERT INTO level_progress (user_id, roadmap_id, level, passed, score)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE passed = GREATEST(passed, ?), score = GREATEST(score, ?)
    `, [req.user.id, roadmapId, levelNorm, passed ? 1 : 0, score, passed ? 1 : 0, score]);

    // Mark quiz session as completed
    await db.query(`
      UPDATE quiz_sessions SET completed = 1
      WHERE user_id = ? AND type = 'level' AND target_id = ?
    `, [req.user.id, `${roadmapId}_${levelNorm}`]);

    // Award XP if passed
    if (passed) {
      const xpMap = { beginner: 300, intermediate: 500, expert: 700 };
      const xp = xpMap[levelNorm] || 300;
      await db.query(
        `UPDATE users SET xp = xp + ?, level = FLOOR((xp + ?) / 500) + 1 WHERE id = ?`,
        [xp, xp, req.user.id]
      );
    }

    // Update streak
    await updateLearningStreak(req.user.id);

    clearRoadmapCache();
    res.json({ success: true, score, correct, total, passed, results, xp_awarded: passed ? (levelNorm === 'beginner' ? 300 : levelNorm === 'intermediate' ? 500 : 700) : 0 });
  } catch (err) {
    console.error('submitLevelAssessment error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/roadmaps/quiz-session/save ─────────────────────
exports.saveQuizSession = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login required' });
    const { type, target_id, questions, answers, time_left, bookmarks } = req.body;
    if (!type || !target_id) return res.status(400).json({ success: false, message: 'type and target_id required' });

    await db.query(`
      INSERT INTO quiz_sessions (user_id, type, target_id, questions, answers, time_left, bookmarks, completed, score)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)
      ON DUPLICATE KEY UPDATE
        questions = VALUES(questions),
        answers = VALUES(answers),
        time_left = VALUES(time_left),
        bookmarks = VALUES(bookmarks),
        updated_at = CURRENT_TIMESTAMP
    `, [
      req.user.id, type, target_id,
      JSON.stringify(questions || []),
      JSON.stringify(answers || {}),
      time_left || 0,
      JSON.stringify(bookmarks || [])
    ]);

    res.json({ success: true, message: 'Session saved' });
  } catch (err) {
    console.error('saveQuizSession error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/roadmaps/quiz-session/:type/:targetId ────────────
exports.getQuizSession = async (req, res) => {
  try {
    if (!req.user) return res.json({ success: true, session: null });
    const { type, targetId } = req.params;

    const [[session]] = await db.query(
      `SELECT * FROM quiz_sessions WHERE user_id = ? AND type = ? AND target_id = ? AND completed = 0`,
      [req.user.id, type, targetId]
    );

    if (!session) return res.json({ success: true, session: null });

    res.json({
      success: true,
      session: {
        questions: JSON.parse(session.questions || '[]'),
        answers: JSON.parse(session.answers || '{}'),
        time_left: session.time_left,
        bookmarks: JSON.parse(session.bookmarks || '[]'),
      }
    });
  } catch (err) {
    console.error('getQuizSession error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

