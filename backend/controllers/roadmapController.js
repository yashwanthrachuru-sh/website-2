// ============================================================
// backend/controllers/roadmapController.js
// EduNet — Full Roadmap Learning System API Controller
// ============================================================
'use strict';

const db = require('../config/db');

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
    }

    // Get all lessons for these modules
    let enrichedModules = [];
    if (modules.length > 0) {
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

      enrichedModules = modules.map((m, idx) => ({
        ...m,
        lessons: lessonGroup[m.id] || [],
        status: progMap[m.id]?.completed ? 'completed' : idx === 0 ? 'unlocked' : (progMap[modules[idx-1]?.id]?.completed ? 'unlocked' : 'locked'),
        completed: !!(progMap[m.id]?.completed),
        quiz_score: progMap[m.id]?.quiz_score || 0,
        challenge_done: !!(progMap[m.id]?.challenge_done),
      }));
    }

    const totalModules = modules.length;
    const doneCount = Object.values(progMap).filter(p => p.completed).length;

    res.json({
      success: true,
      roadmap: {
        ...roadmap,
        modules: enrichedModules,
        modules_total: totalModules,
        modules_done: doneCount,
        progress_pct: totalModules > 0 ? Math.round((doneCount / totalModules) * 100) : 0,
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

    // Fetch related content
    const [videos] = await db.query(`SELECT * FROM lesson_videos WHERE lesson_id = ?`, [lid]);
    const [resources] = await db.query(`SELECT * FROM lesson_resources WHERE lesson_id = ?`, [lid]);
    const [exercises] = await db.query(`SELECT * FROM lesson_exercises WHERE lesson_id = ? ORDER BY order_index`, [lid]);
    const [quizzes] = await db.query(`SELECT * FROM lesson_quizzes WHERE lesson_id = ? ORDER BY order_index`, [lid]);
    const [projects] = await db.query(`SELECT * FROM lesson_projects WHERE module_id = ?`, [lesson.module_id]);

    // Adjacent lessons
    const [[prevLesson]] = await db.query(
      `SELECT id, title FROM module_lessons WHERE module_id = ? AND order_index < ? ORDER BY order_index DESC LIMIT 1`,
      [lesson.module_id, lesson.order_index]
    );
    const [[nextLesson]] = await db.query(
      `SELECT id, title FROM module_lessons WHERE module_id = ? AND order_index > ? ORDER BY order_index ASC LIMIT 1`,
      [lesson.module_id, lesson.order_index]
    );

    // User progress
    let completed = false;
    if (req.user) {
      const [[prog]] = await db.query(
        `SELECT completed FROM lesson_progress WHERE user_id = ? AND lesson_id = ?`,
        [req.user.id, lid]
      );
      completed = !!prog?.completed;
    }

    res.json({
      success: true,
      lesson,
      videos,
      resources,
      exercises,
      quizzes,
      projects,
      prev_lesson: prevLesson || null,
      next_lesson: nextLesson || null,
      completed
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

    res.json({
      success: true,
      xp_awarded: 100,
      module_completed: moduleCompleted,
      lessons_done: doneLessons.cnt,
      lessons_total: totalLessons.cnt
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
    const [questions] = await db.query(
      `SELECT id, question, option_a, option_b, option_c, option_d FROM roadmap_exams WHERE roadmap_id = ?`,
      [req.params.id]
    );
    res.json({ success: true, questions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/roadmaps/:id/exam/submit ────────────────────────
exports.submitRoadmapExam = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login required' });
    const { answers } = req.body;
    if (!answers) return res.status(400).json({ success: false, message: 'answers required' });

    const [questions] = await db.query(
      `SELECT id, correct_option, explanation, xp_reward FROM roadmap_exams WHERE roadmap_id = ?`,
      [req.params.id]
    );

    let correct = 0;
    let totalXp = 0;
    const results = questions.map(q => {
      const userAns = answers[q.id];
      const isCorrect = userAns === q.correct_option;
      if (isCorrect) {
        correct++;
        totalXp += q.xp_reward;
      }
      return { question_id: q.id, correct: isCorrect, correct_option: q.correct_option, explanation: q.explanation };
    });

    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    const passed = score >= 70;

    let certificate = null;
    if (passed) {
      // Award XP
      await db.query(
        `UPDATE users SET xp = xp + ?, level = FLOOR((xp + ?) / 500) + 1 WHERE id = ?`,
        [totalXp, totalXp, req.user.id]
      );

      // Check / Create Certificate
      const [[existing]] = await db.query(
        `SELECT id, certificate_hash FROM certificates WHERE user_id = ? AND roadmap_id = ?`,
        [req.user.id, req.params.id]
      );
      if (!existing) {
        const hash = 'EN-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2,8).toUpperCase();
        const [[rm]] = await db.query(`SELECT title FROM roadmaps WHERE id = ?`, [req.params.id]);
        await db.query(`
          INSERT INTO certificates (user_id, roadmap_id, certificate_hash, title)
          VALUES (?, ?, ?, ?)
        `, [req.user.id, req.params.id, hash, rm?.title + ' Mastery Certificate']);
        certificate = { hash, title: rm?.title + ' Mastery Certificate' };
      } else {
        certificate = { hash: existing.certificate_hash };
      }
    }

    res.json({ success: true, score, correct, total: questions.length, passed, xp_awarded: passed ? totalXp : 0, certificate, results });
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


