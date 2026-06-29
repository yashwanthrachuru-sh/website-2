// ============================================================
// backend/routes/achievementRoutes.js
// EduNet — Achievements API
// ============================================================
'use strict';
const express = require('express');
const router  = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const db = require('../config/db');

// GET /api/achievements — all achievements + user's earned ones
router.get('/', verifyToken, async (req, res) => {
  try {
    const uid = req.user.id;

    // All achievement definitions
    const [allAch] = await db.query(
      'SELECT * FROM achievements ORDER BY condition_type, condition_value ASC'
    ).catch(() => [[]]);

    // User's earned achievements
    const [earned] = await db.query(
      `SELECT ua.achievement_id, ua.earned_at
       FROM user_achievements ua WHERE ua.user_id = ?`, [uid]
    ).catch(() => [[]]);

    const earnedSet = new Map(earned.map(e => [e.achievement_id, e.earned_at]));

    const result = allAch.map(a => ({
      ...a,
      earned:    earnedSet.has(a.id),
      earned_at: earnedSet.get(a.id) || null,
    }));

    res.json({ success: true, achievements: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/achievements/check — check and award any new achievements
router.post('/check', verifyToken, async (req, res) => {
  try {
    const uid = req.user.id;

    // Get user stats
    const [[user]] = await db.query(
      'SELECT xp, streak, level FROM users WHERE id = ?', [uid]
    ).catch(() => [[{}]]);

    const [[lessonRow]] = await db.query(
      'SELECT COUNT(*) AS done FROM lesson_progress WHERE user_id = ? AND completed = 1', [uid]
    ).catch(() => [[{ done: 0 }]]);

    const [[quizRow]] = await db.query(
      'SELECT COUNT(*) AS attempts FROM module_progress WHERE user_id = ? AND quiz_score > 0', [uid]
    ).catch(() => [[{ attempts: 0 }]]);

    const [[certRow]] = await db.query(
      'SELECT COUNT(*) AS count FROM certificates WHERE user_id = ?', [uid]
    ).catch(() => [[{ count: 0 }]]);

    const [[projRow]] = await db.query(
      'SELECT COUNT(*) AS count FROM projects WHERE user_id = ?', [uid]
    ).catch(() => [[{ count: 0 }]]);

    const stats = {
      xp:             user?.xp || 0,
      streak:         user?.streak || 0,
      lessons_done:   parseInt(lessonRow?.done || 0),
      quiz_attempts:  parseInt(quizRow?.attempts || 0),
      certificates:   parseInt(certRow?.count || 0),
      projects_done:  parseInt(projRow?.count || 0),
      roadmaps_started: 0,
    };

    // Get all achievement definitions
    const [allAch] = await db.query('SELECT * FROM achievements').catch(() => [[]]);

    // Get already earned
    const [alreadyEarned] = await db.query(
      'SELECT achievement_id FROM user_achievements WHERE user_id = ?', [uid]
    ).catch(() => [[]]);
    const earnedIds = new Set(alreadyEarned.map(e => e.achievement_id));

    const newlyEarned = [];
    for (const a of allAch) {
      if (earnedIds.has(a.id)) continue;
      const val = stats[a.condition_type] || 0;
      if (val >= a.condition_value) {
        // Award it
        await db.query(
          'INSERT IGNORE INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
          [uid, a.id]
        ).catch(() => {});
        // Bonus XP for achievement
        if (a.xp_reward > 0) {
          await db.query('UPDATE users SET xp = xp + ? WHERE id = ?', [a.xp_reward, uid]).catch(() => {});
        }
        newlyEarned.push(a);
      }
    }

    res.json({ success: true, newly_earned: newlyEarned, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
