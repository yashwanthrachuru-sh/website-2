// ============================================================
// controllers/adminController.js — Admin Controls & Moderation
// ============================================================

const userModel = require('../models/userModel');
const toolModel = require('../models/toolModel');
const auditModel = require('../models/auditModel');
const db = require('../config/db');

// GET /api/admin/stats
// Fetches dashboard statistics
const getStats = async (req, res) => {
  try {
    const totalUsers = await userModel.countUsers();
    const pendingUsers = await userModel.countPendingUsers();
    const approvedTools = await toolModel.countApprovedTools();
    const pendingTools = await toolModel.countPendingTools();

    res.json({
      success: true,
      stats: {
        totalUsers,
        pendingUsers,
        approvedTools,
        pendingTools
      }
    });
  } catch (err) {
    console.error('Fetch admin stats error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching metrics.' });
  }
};

// GET /api/admin/users
// Fetches list of all users
const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json({
      success: true,
      users
    });
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching users list.' });
  }
};

// PUT /api/admin/users/:id/status
// Updates a user's status (approved, rejected, suspended, pending)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status type.' });
    }

    const targetUser = await userModel.findById(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const success = await userModel.updateStatus(id, status);
    if (!success) {
      return res.status(400).json({ success: false, message: 'Failed to update user status.' });
    }

    // Write audit log
    await auditModel.addLog(
      req.user.username, 
      `Updated user status for '${targetUser.username}' to '${status}'.`
    );

    res.json({
      success: true,
      message: `User status successfully updated to ${status}.`
    });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ success: false, message: 'Server error while updating status.' });
  }
};

// PUT /api/admin/users/:id/role
// Promotes or demotes a user (admin, user)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'moderator', 'user'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

    const targetUser = await userModel.findById(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const success = await userModel.updateRole(id, role);
    if (!success) {
      return res.status(400).json({ success: false, message: 'Failed to update user role.' });
    }

    // Write audit log
    await auditModel.addLog(
      req.user.username,
      `Updated role of '${targetUser.username}' to '${role}'.`
    );

    res.json({
      success: true,
      message: `User role promoted to ${role}.`
    });
  } catch (err) {
    console.error('Update role error:', err);
    res.status(500).json({ success: false, message: 'Server error while updating role.' });
  }
};

// DELETE /api/admin/users/:id
// Deletes a user account
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const targetUser = await userModel.findById(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Prevent admin deleting themselves
    if (parseInt(id, 10) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Administrators cannot self-terminate.' });
    }

    const success = await userModel.deleteUser(id);
    if (!success) {
      return res.status(400).json({ success: false, message: 'Failed to delete user.' });
    }

    // Write audit log
    await auditModel.addLog(
      req.user.username,
      `Deleted user account '${targetUser.username}'.`
    );

    res.json({
      success: true,
      message: 'User account successfully deleted.'
    });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ success: false, message: 'Server error while deleting user.' });
  }
};

// GET /api/admin/audit-logs
// Returns all audit log entries
const getAuditLogs = async (req, res) => {
  try {
    const logs = await auditModel.getAllLogs();
    res.json({
      success: true,
      logs
    });
  } catch (err) {
    console.error('Fetch audit logs error:', err);
    res.status(500).json({ success: false, message: 'Server error while retrieving audit trail.' });
  }
};

// GET /api/admin/tools
// Fetches all tools (curation view)
const getTools = async (req, res) => {
  try {
    const tools = await toolModel.getAllTools();
    res.json({
      success: true,
      tools
    });
  } catch (err) {
    console.error('Fetch tools admin error:', err);
    res.status(500).json({ success: false, message: 'Server error while listing tools.' });
  }
};

// PUT /api/admin/tools/:id/status
// Moderates an AI tool (approves, rejects, etc.)
const updateToolStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected', 'deleted'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid tool status type.' });
    }

    const targetTool = await toolModel.findById(id);
    if (!targetTool) {
      return res.status(404).json({ success: false, message: 'AI Tool not found.' });
    }

    const success = await toolModel.updateStatus(id, status);
    if (!success) {
      return res.status(400).json({ success: false, message: 'Failed to update tool status.' });
    }

    // Write audit log
    await auditModel.addLog(
      req.user.username,
      `Moderated tool '${targetTool.name}' status to '${status}'.`
    );

    res.json({
      success: true,
      message: `Tool status updated to ${status}.`
    });
  } catch (err) {
    console.error('Update tool status error:', err);
    res.status(500).json({ success: false, message: 'Server error while moderating tool.' });
  }
};

// POST /api/admin/tools
// Manually adds a new AI tool
const createTool = async (req, res) => {
  try {
    const { id, name, description, category, pricing, official_link, status } = req.body;
    
    if (!id || !name || !description || !category) {
      return res.status(400).json({ success: false, message: 'Required fields: id, name, description, category.' });
    }

    const existing = await toolModel.findById(id);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Tool with this ID already exists.' });
    }

    const newId = await toolModel.createTool(req.body);

    await auditModel.addLog(
      req.user.username,
      `Manually created new AI Tool '${name}' (ID: ${newId}).`
    );

    res.status(201).json({
      success: true,
      message: 'AI Tool successfully added.',
      id: newId
    });
  } catch (err) {
    console.error('Create tool error:', err);
    res.status(500).json({ success: false, message: 'Server error while creating tool.' });
  }
};

// PUT /api/admin/tools/:id
// Modifies an existing AI tool
const updateTool = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = await toolModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'AI Tool not found.' });
    }

    const success = await toolModel.updateTool(id, req.body);
    if (!success) {
      return res.status(400).json({ success: false, message: 'No changes made or update failed.' });
    }

    await auditModel.addLog(
      req.user.username,
      `Modified details for AI Tool '${existing.name}'.`
    );

    res.json({
      success: true,
      message: 'AI Tool details successfully updated.'
    });
  } catch (err) {
    console.error('Update tool error:', err);
    res.status(500).json({ success: false, message: 'Server error while updating tool.' });
  }
};

// DELETE /api/admin/tools/:id
// Removes an AI tool from database
const deleteTool = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await toolModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'AI Tool not found.' });
    }

    const success = await toolModel.deleteTool(id);
    if (!success) {
      return res.status(400).json({ success: false, message: 'Failed to delete tool.' });
    }

    await auditModel.addLog(
      req.user.username,
      `Permanently deleted AI Tool '${existing.name}' from directory.`
    );

    res.json({
      success: true,
      message: 'AI Tool successfully removed.'
    });
  } catch (err) {
    console.error('Delete tool error:', err);
    res.status(500).json({ success: false, message: 'Server error while removing tool.' });
  }
};

// --- Quiz management handlers ---
const getQuizzes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tests');
    res.json({ success: true, quizzes: rows });
  } catch (err) {
    console.error('Admin get quizzes error:', err);
    res.status(500).json({ success: false, message: 'Server error listing quizzes.' });
  }
};

const createQuiz = async (req, res) => {
  try {
    const { title, difficulty, type, lesson_id, course_id } = req.body;
    if (!title || !difficulty || !type) {
      return res.status(400).json({ success: false, message: 'Title, difficulty, and type are required.' });
    }
    const [result] = await db.query(
      'INSERT INTO tests (title, difficulty, type, lesson_id, course_id) VALUES (?, ?, ?, ?, ?)',
      [title, difficulty, type, lesson_id || null, course_id || null]
    );
    await auditModel.addLog(req.user.username, `Created new quiz test '${title}'.`);
    res.status(201).json({ success: true, message: 'Quiz created successfully.', id: result.insertId });
  } catch (err) {
    console.error('Admin create quiz error:', err);
    res.status(500).json({ success: false, message: 'Server error creating quiz.' });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT title FROM tests WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }
    await db.query('DELETE FROM tests WHERE id = ?', [id]);
    await auditModel.addLog(req.user.username, `Deleted quiz test '${rows[0].title}'.`);
    res.json({ success: true, message: 'Quiz deleted successfully.' });
  } catch (err) {
    console.error('Admin delete quiz error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting quiz.' });
  }
};

const getQuizQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM questions WHERE test_id = ?', [id]);
    res.json({ success: true, questions: rows });
  } catch (err) {
    console.error('Admin get quiz questions error:', err);
    res.status(500).json({ success: false, message: 'Server error loading questions.' });
  }
};

const addQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question_text, option_a, option_b, option_c, option_d, correct_option } = req.body;
    if (!question_text || !correct_option) {
      return res.status(400).json({ success: false, message: 'Question text and correct option are required.' });
    }
    const [result] = await db.query(
      `INSERT INTO questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_option)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, question_text, option_a || null, option_b || null, option_c || null, option_d || null, correct_option]
    );
    res.status(201).json({ success: true, message: 'Question added successfully.', id: result.insertId });
  } catch (err) {
    console.error('Admin add question error:', err);
    res.status(500).json({ success: false, message: 'Server error adding question.' });
  }
};

const getScores = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, u.username, t.title as quiz_title
       FROM results r
       JOIN users u ON r.user_id = u.id
       JOIN tests t ON r.test_id = t.id
       ORDER BY r.attempted_at DESC`
    );
    res.json({ success: true, scores: rows });
  } catch (err) {
    console.error('Admin get scores error:', err);
    res.status(500).json({ success: false, message: 'Server error loading scores.' });
  }
};

const getQuizAnalytics = async (req, res) => {
  try {
    const [totalAttempts] = await db.query('SELECT COUNT(*) as total FROM results');
    const [averageScore] = await db.query('SELECT AVG(score) as avg_score FROM results');
    const [byQuiz] = await db.query(
      `SELECT t.title, COUNT(r.id) as attempts, AVG(r.score) as avg_score
       FROM results r
       JOIN tests t ON r.test_id = t.id
       GROUP BY t.id`
    );
    res.json({
      success: true,
      analytics: {
        totalAttempts: totalAttempts[0].total,
        averageScore: averageScore[0].avg_score || 0,
        byQuiz
      }
    });
  } catch (err) {
    console.error('Admin quiz analytics error:', err);
    res.status(500).json({ success: false, message: 'Server error loading analytics.' });
  }
};

module.exports = {
  getStats,
  getUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getAuditLogs,
  getTools,
  updateToolStatus,
  createTool,
  updateTool,
  deleteTool,
  getQuizzes,
  createQuiz,
  deleteQuiz,
  getQuizQuestions,
  addQuestion,
  getScores,
  getQuizAnalytics
};
