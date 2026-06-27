// ============================================================
// models/quizModel.js — Database Queries for Quizzes and Results
// ============================================================
const db = require('../config/db');

// Get all tests / quizzes
const getAllQuizzes = async () => {
  const [rows] = await db.query('SELECT * FROM tests');
  return rows;
};

// Get quiz by ID
const getQuizById = async (id) => {
  const [rows] = await db.query('SELECT * FROM tests WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
};

// Get questions for a quiz
const getQuestionsByQuizId = async (testId) => {
  const [rows] = await db.query('SELECT * FROM questions WHERE test_id = ?', [testId]);
  return rows;
};

// Save attempt results
const createResult = async ({ user_id, test_id, score, total_questions, correct_answers, feedback }) => {
  const [result] = await db.query(
    `INSERT INTO results (user_id, test_id, score, total_questions, correct_answers, feedback)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, test_id, score, total_questions, correct_answers, feedback || null]
  );
  return result.insertId;
};

// Fetch student scores history
const getResultsByUserId = async (userId) => {
  const [rows] = await db.query(
    `SELECT r.*, t.title as quiz_title, t.difficulty, t.type
     FROM results r
     JOIN tests t ON r.test_id = t.id
     WHERE r.user_id = ?
     ORDER BY r.attempted_at DESC`,
    [userId]
  );
  return rows;
};

module.exports = {
  getAllQuizzes,
  getQuizById,
  getQuestionsByQuizId,
  createResult,
  getResultsByUserId
};
