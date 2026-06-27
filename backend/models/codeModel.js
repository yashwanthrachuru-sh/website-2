// ============================================================
// models/codeModel.js — Database Queries for Monaco CodeLabs
// ============================================================
const db = require('../config/db');

const getTemplates = async () => {
  const [rows] = await db.query('SELECT * FROM language_templates');
  return rows;
};

const getProblems = async () => {
  const [rows] = await db.query('SELECT * FROM code_snippets');
  return rows;
};

const saveUserCode = async (userId, snippetId, code, language, status) => {
  const [result] = await db.query(
    `INSERT INTO user_code (user_id, snippet_id, code, language, status)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE code = ?, status = ?`,
    [userId, snippetId || null, code, language, status, code, status]
  );
  return result.affectedRows > 0;
};

const saveProgram = async (userId, name, code, language) => {
  const [result] = await db.query(
    `INSERT INTO saved_programs (user_id, program_name, code, language)
     VALUES (?, ?, ?, ?)`,
    [userId, name, code, language]
  );
  return result.insertId;
};

const getSavedProgramsByUserId = async (userId) => {
  const [rows] = await db.query('SELECT * FROM saved_programs WHERE user_id = ? ORDER BY saved_at DESC', [userId]);
  return rows;
};

const createHistory = async (userId, code, language) => {
  const [result] = await db.query(
    'INSERT INTO code_history (user_id, code, language) VALUES (?, ?, ?)',
    [userId, code, language]
  );
  return result.insertId;
};

const getHistoryByUserId = async (userId) => {
  const [rows] = await db.query('SELECT * FROM code_history WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 20', [userId]);
  return rows;
};

const createExecutionLog = async (userId, code, language, output) => {
  const [result] = await db.query(
    'INSERT INTO execution_logs (user_id, code, language, output) VALUES (?, ?, ?, ?)',
    [userId, code, language, output]
  );
  return result.insertId;
};

module.exports = {
  getTemplates,
  getProblems,
  saveUserCode,
  saveProgram,
  getSavedProgramsByUserId,
  createHistory,
  getHistoryByUserId,
  createExecutionLog
};
