// ============================================================
// models/toolModel.js — Database Queries for the tools Table
// ============================================================

const db = require('../config/db');

// Get all tools
const getAllTools = async () => {
  const [rows] = await db.query(
    'SELECT * FROM tools ORDER BY created_at DESC'
  );
  return rows;
};

// Get tools with 'approved' status
const getApprovedTools = async () => {
  const [rows] = await db.query(
    "SELECT * FROM tools WHERE status = 'approved' ORDER BY created_at DESC"
  );
  return rows;
};

// Get tools with 'pending' status
const getPendingTools = async () => {
  const [rows] = await db.query(
    "SELECT * FROM tools WHERE status = 'pending' ORDER BY created_at DESC"
  );
  return rows;
};

// Find a tool by ID
const findById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM tools WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

// Create a new tool
const createTool = async ({ id, name, description, category, status = 'pending', features, pricing, use_cases, alternatives, tutorials, official_link, rating = 0.0 }) => {
  // Convert JSON or arrays to string if necessary
  const featuresStr = Array.isArray(features) ? JSON.stringify(features) : features;
  
  const [result] = await db.query(
    `INSERT INTO tools (id, name, description, category, status, features, pricing, use_cases, alternatives, tutorials, official_link, rating)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, description, category, status, featuresStr, pricing, use_cases, alternatives, tutorials, official_link, rating]
  );
  return id;
};

// Update an existing tool
const updateTool = async (id, { name, description, category, features, pricing, use_cases, alternatives, tutorials, official_link, rating, status }) => {
  const featuresStr = Array.isArray(features) ? JSON.stringify(features) : features;
  
  const [result] = await db.query(
    `UPDATE tools 
     SET name = ?, description = ?, category = ?, features = ?, pricing = ?, use_cases = ?, alternatives = ?, tutorials = ?, official_link = ?, rating = ?, status = ?
     WHERE id = ?`,
    [name, description, category, featuresStr, pricing, use_cases, alternatives, tutorials, official_link, rating, status, id]
  );
  return result.affectedRows > 0;
};

// Update tool status (approve, reject, delete)
const updateStatus = async (id, status) => {
  const [result] = await db.query(
    'UPDATE tools SET status = ? WHERE id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
};

// Delete a tool from database
const deleteTool = async (id) => {
  const [result] = await db.query(
    'DELETE FROM tools WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

// Count approved tools
const countApprovedTools = async () => {
  const [rows] = await db.query(
    "SELECT COUNT(*) AS total FROM tools WHERE status = 'approved'"
  );
  return rows[0].total;
};

// Count pending tools
const countPendingTools = async () => {
  const [rows] = await db.query(
    "SELECT COUNT(*) AS total FROM tools WHERE status = 'pending'"
  );
  return rows[0].total;
};

// --- Bookmark management ---
const addBookmark = async (userId, toolId) => {
  const [result] = await db.query(
    'INSERT IGNORE INTO tool_bookmarks (user_id, tool_id) VALUES (?, ?)',
    [userId, toolId]
  );
  return result.affectedRows > 0;
};

const removeBookmark = async (userId, toolId) => {
  const [result] = await db.query(
    'DELETE FROM tool_bookmarks WHERE user_id = ? AND tool_id = ?',
    [userId, toolId]
  );
  return result.affectedRows > 0;
};

const getBookmarks = async (userId) => {
  const [rows] = await db.query(
    `SELECT t.* FROM ai_tools t
     JOIN tool_bookmarks b ON t.id = b.tool_id
     WHERE b.user_id = ?`,
    [userId]
  );
  return rows;
};

// --- Rating management ---
const addRating = async (userId, toolId, rating) => {
  await db.query(
    `INSERT INTO tool_ratings (user_id, tool_id, rating)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE rating = ?`,
    [userId, toolId, rating, rating]
  );
  
  // Recalculate average rating
  const [avgRows] = await db.query(
    'SELECT AVG(rating) as avg_rating FROM tool_ratings WHERE tool_id = ?',
    [toolId]
  );
  const avg = avgRows[0].avg_rating || 0;
  
  await db.query(
    'UPDATE ai_tools SET rating = ? WHERE id = ?',
    [avg, toolId]
  );
  return avg;
};

// --- Review management ---
const addReview = async (userId, toolId, reviewText, rating) => {
  const [result] = await db.query(
    'INSERT INTO tool_reviews (user_id, tool_id, review_text, rating) VALUES (?, ?, ?, ?)',
    [userId, toolId, reviewText, rating]
  );
  return result.insertId;
};

const getReviewsByToolId = async (toolId) => {
  const [rows] = await db.query(
    `SELECT r.*, u.username
     FROM tool_reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.tool_id = ?
     ORDER BY r.created_at DESC`,
    [toolId]
  );
  return rows;
};

// --- Usage analytics logs ---
const logUsage = async (userId, toolId) => {
  const [result] = await db.query(
    'INSERT INTO tool_usage_logs (user_id, tool_id) VALUES (?, ?)',
    [userId, toolId]
  );
  return result.insertId;
};

const getMostUsedTools = async (limit = 10) => {
  const [rows] = await db.query(
    `SELECT t.name, t.category, COUNT(u.id) as usage_count
     FROM tool_usage_logs u
     JOIN ai_tools t ON u.tool_id = t.id
     GROUP BY t.id
     ORDER BY usage_count DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
};

const getTopRatedTools = async (limit = 10) => {
  const [rows] = await db.query(
    `SELECT name, category, rating FROM ai_tools
     WHERE status = 'approved'
     ORDER BY rating DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
};

module.exports = {
  getAllTools,
  getApprovedTools,
  getPendingTools,
  findById,
  createTool,
  updateTool,
  updateStatus,
  deleteTool,
  countApprovedTools,
  countPendingTools,
  addBookmark,
  removeBookmark,
  getBookmarks,
  addRating,
  addReview,
  getReviewsByToolId,
  logUsage,
  getMostUsedTools,
  getTopRatedTools
};
