const roadmapModel = require('../models/roadmapModel');
const db = require('../config/db');

// GET /api/user/roadmaps
const getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await roadmapModel.getAllRoadmaps();
    res.json({ success: true, roadmaps });
  } catch (err) {
    console.error('Fetch roadmaps error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching roadmaps.' });
  }
};

const getRoadmapDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const roadmap = await roadmapModel.getRoadmapById(id);
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found.' });
    }

    // Load nested courses
    const courses = await roadmapModel.getCoursesByRoadmapId(id);
    if (courses.length === 0) {
      return res.json({
        success: true,
        roadmap,
        courses: []
      });
    }

    const courseIds = courses.map(c => c.id);
    const [modules] = await db.query(
      'SELECT * FROM modules WHERE course_id IN (?) ORDER BY order_index ASC',
      [courseIds]
    );

    if (modules.length === 0) {
      const fullCourses = courses.map(course => ({
        ...course,
        modules: []
      }));
      return res.json({
        success: true,
        roadmap,
        courses: fullCourses
      });
    }

    const moduleIds = modules.map(m => m.id);
    const [lessons] = await db.query(
      'SELECT * FROM lessons WHERE module_id IN (?) ORDER BY order_index ASC',
      [moduleIds]
    );

    // Group lessons by module_id
    const lessonsByModule = {};
    for (const lesson of lessons) {
      if (!lessonsByModule[lesson.module_id]) {
        lessonsByModule[lesson.module_id] = [];
      }
      lessonsByModule[lesson.module_id].push(lesson);
    }

    // Group modules by course_id
    const modulesByCourse = {};
    for (const mod of modules) {
      if (!modulesByCourse[mod.course_id]) {
        modulesByCourse[mod.course_id] = [];
      }
      modulesByCourse[mod.course_id].push({
        ...mod,
        lessons: lessonsByModule[mod.id] || []
      });
    }

    // Map modules to courses
    const fullCourses = courses.map(course => ({
      ...course,
      modules: modulesByCourse[course.id] || []
    }));

    res.json({
      success: true,
      roadmap,
      courses: fullCourses
    });
  } catch (err) {
    console.error('Fetch roadmap detail error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching track details.' });
  }
};

// GET /api/user/progress/:track
const getTrackProgress = async (req, res) => {
  try {
    const { track } = req.params;
    const username = req.user.username; // populated by verifyToken
    const progress = await roadmapModel.getProgress(username, track);
    res.json({ success: true, progress });
  } catch (err) {
    console.error('Fetch progress error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching progress.' });
  }
};

// POST /api/user/progress/:track
const updateTrackProgress = async (req, res) => {
  try {
    const { track } = req.params;
    const { nodeId, completed } = req.body;
    const username = req.user.username;

    if (!nodeId) {
      return res.status(400).json({ success: false, message: 'nodeId parameter required.' });
    }

    const success = await roadmapModel.saveProgress(username, track, nodeId, completed);
    res.json({ success, message: 'Progress saved successfully.' });
  } catch (err) {
    console.error('Update progress error:', err);
    res.status(500).json({ success: false, message: 'Server error saving progress.' });
  }
};

// GET /api/user/profile or /api/profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      'SELECT id, username, email, branch, role, status, xp, level, bio, linkedin, github, skills, streak, avatar_initials, learning_goals, weekly_target_xp, preferred_language, preferred_difficulty, daily_reminder, interests, created_at FROM users WHERE id = ? LIMIT 1',
      [userId]
    );
    const user = rows[0];
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error('Fetch profile error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching profile.' });
  }
};

// PUT /api/user/profile or /api/profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio, linkedin, github, skills, avatar_initials, learning_goals, weekly_target_xp, preferred_language, preferred_difficulty, daily_reminder, interests } = req.body;
    
    await db.query(
      `UPDATE users 
       SET bio = ?, linkedin = ?, github = ?, skills = ?, avatar_initials = ?,
           learning_goals = ?, weekly_target_xp = ?, preferred_language = ?,
           preferred_difficulty = ?, daily_reminder = ?, interests = ?
       WHERE id = ?`,
      [
        bio || null, linkedin || null, github || null, skills || null, avatar_initials || null,
        learning_goals || null, parseInt(weekly_target_xp) || 500, preferred_language || 'javascript',
        preferred_difficulty || 'medium', daily_reminder ? 1 : 0, interests || null,
        userId
      ]
    );
    
    res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Server error while updating profile.' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT username, branch, xp, level, role FROM users ORDER BY xp DESC LIMIT 100'
    );
    res.json({ success: true, users: rows });
  } catch (err) {
    console.error('Fetch leaderboard error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching leaderboard.' });
  }
};

// GET /api/user/xp — fetch current DB XP
const getXP = async (req, res) => {
  try {
    const userId = req.user.id;
    const [[row]] = await db.query('SELECT xp, level FROM users WHERE id = ?', [userId]);
    if (!row) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, xp: row.xp, level: row.level });
  } catch (err) {
    console.error('getXP error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching XP.' });
  }
};

const syncXP = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, source } = req.body;

    if (typeof amount !== 'number' || amount < 0 || amount > 10000) {
      return res.status(400).json({ success: false, message: 'Invalid XP amount.' });
    }

    const userModel = require('../models/userModel');
    const result = await userModel.awardXPAndIncrementStreak(
      userId,
      amount,
      (source && source !== 'general' && source !== 'lesson') ? source : null
    );

    res.json({
      success: true,
      xp:     result.xp,
      level:  result.level,
      added:  result.added,
      already_claimed: result.already_claimed,
      source: source || 'general'
    });
  } catch (err) {
    console.error('syncXP error:', err);
    res.status(500).json({ success: false, message: 'Server error syncing XP.' });
  }
};

module.exports = {
  getRoadmaps,
  getRoadmapDetail,
  getTrackProgress,
  updateTrackProgress,
  getProfile,
  updateProfile,
  getLeaderboard,
  getXP,
  syncXP
};
