// ============================================================
// backend/controllers/analyticsController.js
// EduNet — Analytics Engine
// ============================================================
'use strict';

const db = require('../config/db');

// ── Helper: Record today's activity ───────────────────────────
async function recordActivity(userId, delta = {}) {
  const today = new Date().toISOString().slice(0, 10);
  try {
    await db.query(`
      INSERT INTO user_activity (user_id, date, lessons_done, xp_earned, coding_minutes, quiz_attempts)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        lessons_done   = lessons_done   + VALUES(lessons_done),
        xp_earned      = xp_earned      + VALUES(xp_earned),
        coding_minutes = coding_minutes + VALUES(coding_minutes),
        quiz_attempts  = quiz_attempts  + VALUES(quiz_attempts)
    `, [
      userId, today,
      delta.lessons   || 0,
      delta.xp        || 0,
      delta.coding    || 0,
      delta.quizzes   || 0
    ]);
  } catch (e) {
    // Table may not exist yet — fail silently
    console.warn('recordActivity: user_activity table may not exist:', e.message);
  }
}

// ── GET /api/analytics/dashboard ───────────────────────────────
const getDashboard = async (req, res) => {
  try {
    const uid = req.user.id;

    // User base info
    const [[user]] = await db.query(
      `SELECT xp, level, streak, longest_streak, total_coding_minutes
       FROM users WHERE id = ?`, [uid]
    ).catch(() => [[{}]]);

    // Lessons completed
    const [[lessonStats]] = await db.query(
      `SELECT COUNT(*) AS total, SUM(completed) AS done
       FROM lesson_progress WHERE user_id = ?`, [uid]
    ).catch(() => [[{ total: 0, done: 0 }]]);

    // Modules completed
    const [[moduleStats]] = await db.query(
      `SELECT COUNT(*) AS total, SUM(completed) AS done
       FROM module_progress WHERE user_id = ?`, [uid]
    ).catch(() => [[{ total: 0, done: 0 }]]);

    // Roadmaps started / completed
    const [[roadmapStats]] = await db.query(`
      SELECT
        COUNT(DISTINCT mp.roadmap_id) AS started,
        COUNT(DISTINCT CASE WHEN rms.total = rms.done THEN mp.roadmap_id END) AS completed
      FROM module_progress mp
      JOIN (
        SELECT roadmap_id,
          COUNT(*) AS total,
          SUM(CASE WHEN mp2.user_id = ? AND mp2.completed = 1 THEN 1 ELSE 0 END) AS done
        FROM roadmap_modules rm
        LEFT JOIN module_progress mp2 ON mp2.module_id = rm.id AND mp2.user_id = ?
        GROUP BY roadmap_id
      ) rms ON rms.roadmap_id = mp.roadmap_id
      WHERE mp.user_id = ?
    `, [uid, uid, uid]).catch(() => [[{ started: 0, completed: 0 }]]);

    // Certificates earned
    const [[certStats]] = await db.query(
      `SELECT COUNT(*) AS count FROM certificates WHERE user_id = ?`, [uid]
    ).catch(() => [[{ count: 0 }]]);

    // Quiz accuracy
    const [[quizStats]] = await db.query(
      `SELECT COUNT(*) AS attempts, ROUND(AVG(score), 1) AS avg_score
       FROM results WHERE user_id = ?`, [uid]
    ).catch(() => [[{ attempts: 0, avg_score: 0 }]]);

    // Module-level quiz accuracy
    const [[modQuizStats]] = await db.query(
      `SELECT COUNT(*) AS attempts, ROUND(AVG(quiz_score), 1) AS avg_score
       FROM module_progress WHERE user_id = ? AND quiz_score > 0`, [uid]
    ).catch(() => [[{ attempts: 0, avg_score: 0 }]]);

    // Recent quiz results (last 10)
    const [recentQuizzes] = await db.query(
      `SELECT r.score, r.total_questions, r.correct_answers, r.attempted_at, t.title
       FROM results r
       JOIN tests t ON r.test_id = t.id
       WHERE r.user_id = ?
       ORDER BY r.attempted_at DESC LIMIT 10`, [uid]
    ).catch(() => [[]]);

    // Projects completed
    const [[projectStats]] = await db.query(
      `SELECT COUNT(*) AS count FROM projects WHERE user_id = ?`, [uid]
    ).catch(() => [[{ count: 0 }]]);

    // Leaderboard rank
    const [[rankRow]] = await db.query(
      `SELECT COUNT(*) + 1 AS rank FROM users WHERE xp > (SELECT xp FROM users WHERE id = ?)`, [uid, uid]
    ).catch(() => [[{ rank: 0 }]]);

    res.json({
      success: true,
      dashboard: {
        xp:                user?.xp || 0,
        level:             user?.level || 1,
        streak:            user?.streak || 0,
        longest_streak:    user?.longest_streak || 0,
        total_coding_mins: user?.total_coding_minutes || 0,
        lessons_done:      parseInt(lessonStats?.done || 0),
        lessons_total:     parseInt(lessonStats?.total || 0),
        modules_done:      parseInt(moduleStats?.done || 0),
        modules_total:     parseInt(moduleStats?.total || 0),
        roadmaps_started:  parseInt(roadmapStats?.started || 0),
        roadmaps_done:     parseInt(roadmapStats?.completed || 0),
        certificates:      parseInt(certStats?.count || 0),
        quiz_attempts:     parseInt(quizStats?.attempts || 0) + parseInt(modQuizStats?.attempts || 0),
        quiz_avg_score:    modQuizStats?.avg_score || quizStats?.avg_score || 0,
        projects_done:     parseInt(projectStats?.count || 0),
        leaderboard_rank:  parseInt(rankRow?.rank || 0),
        recent_quizzes:    recentQuizzes,
      }
    });
  } catch (err) {
    console.error('getDashboard error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/analytics/heatmap ─────────────────────────────────
// Returns 365 days of activity data for the GitHub-style heatmap
const getHeatmap = async (req, res) => {
  try {
    const uid = req.user.id;
    const days = parseInt(req.query.days || '365');

    let activity = [];
    try {
      const [rows] = await db.query(`
        SELECT DATE_FORMAT(date, '%Y-%m-%d') AS day,
               lessons_done, xp_earned, quiz_attempts, coding_minutes
        FROM user_activity
        WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        ORDER BY date ASC
      `, [uid, days]);
      activity = rows;
    } catch (e) {
      // user_activity table doesn't exist yet — return empty data
    }

    // Also gather lesson completion dates as fallback
    if (!activity.length) {
      try {
        const [lessonDays] = await db.query(`
          SELECT DATE_FORMAT(updated_at, '%Y-%m-%d') AS day,
                 COUNT(*) AS lessons_done, COUNT(*) * 100 AS xp_earned,
                 0 AS quiz_attempts, 0 AS coding_minutes
          FROM lesson_progress
          WHERE user_id = ? AND completed = 1
            AND updated_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
          GROUP BY DAY(updated_at), MONTH(updated_at), YEAR(updated_at)
          ORDER BY updated_at ASC
        `, [uid, days]);
        activity = lessonDays;
      } catch (e) { /* ignore */ }
    }

    res.json({ success: true, heatmap: activity });
  } catch (err) {
    console.error('getHeatmap error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/analytics/weekly ──────────────────────────────────
const getWeekly = async (req, res) => {
  try {
    const uid = req.user.id;

    // Build last 7 days labels
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }

    let activityMap = {};
    try {
      const [rows] = await db.query(`
        SELECT DATE_FORMAT(date, '%Y-%m-%d') AS day, xp_earned, lessons_done
        FROM user_activity
        WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      `, [uid]);
      rows.forEach(r => activityMap[r.day] = r);
    } catch (e) {
      // Fallback to lesson_progress
      try {
        const [rows] = await db.query(`
          SELECT DATE_FORMAT(updated_at, '%Y-%m-%d') AS day,
                 COUNT(*) * 100 AS xp_earned, COUNT(*) AS lessons_done
          FROM lesson_progress
          WHERE user_id = ? AND completed = 1
            AND updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
          GROUP BY DATE(updated_at)
        `, [uid]);
        rows.forEach(r => activityMap[r.day] = r);
      } catch (e2) { /* ignore */ }
    }

    const result = days.map(d => ({
      day: d,
      label: new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
      xp_earned:    activityMap[d]?.xp_earned    || 0,
      lessons_done: activityMap[d]?.lessons_done || 0,
    }));

    res.json({ success: true, weekly: result });
  } catch (err) {
    console.error('getWeekly error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/analytics/monthly ─────────────────────────────────
const getMonthly = async (req, res) => {
  try {
    const uid = req.user.id;

    // Last 30 days grouped by week
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    let weeklyData = [0, 0, 0, 0];

    try {
      const [rows] = await db.query(`
        SELECT WEEK(date) AS wk, SUM(xp_earned) AS total_xp
        FROM user_activity
        WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY WEEK(date)
        ORDER BY wk DESC
        LIMIT 4
      `, [uid]);
      rows.slice(0, 4).reverse().forEach((r, i) => weeklyData[i] = r.total_xp || 0);
    } catch (e) {
      try {
        const [rows] = await db.query(`
          SELECT WEEK(updated_at) AS wk, COUNT(*) * 100 AS total_xp
          FROM lesson_progress
          WHERE user_id = ? AND completed = 1
            AND updated_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          GROUP BY WEEK(updated_at)
          ORDER BY wk DESC
          LIMIT 4
        `, [uid]);
        rows.slice(0, 4).reverse().forEach((r, i) => weeklyData[i] = r.total_xp || 0);
      } catch (e2) { /* ignore */ }
    }

    res.json({
      success: true,
      monthly: weeks.map((label, i) => ({ label, xp: weeklyData[i] }))
    });
  } catch (err) {
    console.error('getMonthly error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/analytics/streaks ─────────────────────────────────
const getStreaks = async (req, res) => {
  try {
    const uid = req.user.id;
    const [[user]] = await db.query(
      `SELECT streak, longest_streak, last_active_date FROM users WHERE id = ?`, [uid]
    ).catch(() => [[{ streak: 0, longest_streak: 0, last_active_date: null }]]);

    res.json({
      success: true,
      streak: {
        current:  user?.streak || 0,
        longest:  user?.longest_streak || 0,
        last_active: user?.last_active_date || null,
      }
    });
  } catch (err) {
    console.error('getStreaks error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/analytics/topics ──────────────────────────────────
// Returns weakest and strongest quiz topics
const getTopicInsights = async (req, res) => {
  try {
    const uid = req.user.id;

    // Module quiz performance
    const [topicRows] = await db.query(`
      SELECT rm.title AS topic, mp.quiz_score AS score, rm.language
      FROM module_progress mp
      JOIN roadmap_modules rm ON rm.id = mp.module_id
      WHERE mp.user_id = ? AND mp.quiz_score > 0
      ORDER BY mp.quiz_score ASC
    `, [uid]).catch(() => [[]]);

    const weakest  = topicRows.slice(0, 5);
    const strongest = [...topicRows].sort((a, b) => b.score - a.score).slice(0, 5);

    // Language time distribution
    const [langRows] = await db.query(`
      SELECT rm.language, COUNT(*) AS modules_done
      FROM module_progress mp
      JOIN roadmap_modules rm ON rm.id = mp.module_id
      WHERE mp.user_id = ? AND mp.completed = 1
      GROUP BY rm.language
      ORDER BY modules_done DESC
    `, [uid]).catch(() => [[]]);

    res.json({
      success: true,
      insights: {
        weakest_topics:   weakest,
        strongest_topics: strongest,
        language_dist:    langRows,
      }
    });
  } catch (err) {
    console.error('getTopicInsights error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getDashboard,
  getHeatmap,
  getWeekly,
  getMonthly,
  getStreaks,
  getTopicInsights,
  recordActivity  // exported for use by other controllers
};
