// ============================================================
// models/roadmapModel.js — SQL Queries for Curriculum & Tracks
// ============================================================
const db = require('../config/db');

// Get list of all roadmaps
const getAllRoadmaps = async () => {
  const [rows] = await db.query('SELECT * FROM roadmaps');
  return rows;
};

// Get a roadmap by ID
const getRoadmapById = async (id) => {
  const [rows] = await db.query('SELECT * FROM roadmaps WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
};

// Get courses in a roadmap
const getCoursesByRoadmapId = async (roadmapId) => {
  const [rows] = await db.query(
    'SELECT * FROM courses WHERE roadmap_id = ? ORDER BY semester ASC',
    [roadmapId]
  );
  return rows;
};

// Get modules for a course
const getModulesByCourseId = async (courseId) => {
  const [rows] = await db.query(
    'SELECT * FROM modules WHERE course_id = ? ORDER BY order_index ASC',
    [courseId]
  );
  return rows;
};

// Get lessons for a module
const getLessonsByModuleId = async (moduleId) => {
  const [rows] = await db.query(
    'SELECT * FROM lessons WHERE module_id = ? ORDER BY order_index ASC',
    [moduleId]
  );
  return rows;
};

// Get progress for a specific track
const getProgress = async (username, track) => {
  const [rows] = await db.query(
    'SELECT node_id, completed FROM roadmap_progress WHERE username = ? AND track = ?',
    [username, track]
  );
  return rows;
};

// Save node progress (using UNIQUE KEY constraints)
const saveProgress = async (username, track, nodeId, completed) => {
  const [result] = await db.query(
    `INSERT INTO roadmap_progress (username, track, node_id, completed)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE completed = ?`,
    [username, track, nodeId, completed, completed]
  );
  return result.affectedRows > 0;
};

module.exports = {
  getAllRoadmaps,
  getRoadmapById,
  getCoursesByRoadmapId,
  getModulesByCourseId,
  getLessonsByModuleId,
  getProgress,
  saveProgress
};
