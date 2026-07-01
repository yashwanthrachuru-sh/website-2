// ============================================================
// backend/models/challengeModel.js
// Database queries for Daily Coding Challenges
// ============================================================
'use strict';

const db = require('../config/db');

async function getDailyChallenge() {
  // Return the first seeded challenge as today's default
  const [[challenge]] = await db.query('SELECT * FROM daily_challenges LIMIT 1');
  return challenge;
}

async function getRecommendedChallenges() {
  const [challenges] = await db.query('SELECT * FROM daily_challenges ORDER BY id DESC LIMIT 5');
  return challenges;
}

async function getChallenge(id) {
  const [[challenge]] = await db.query('SELECT * FROM daily_challenges WHERE id = ?', [id]);
  return challenge;
}

async function getTestCases(challengeId) {
  const [cases] = await db.query('SELECT * FROM challenge_test_cases WHERE challenge_id = ?', [challengeId]);
  return cases;
}

async function saveDraftCode(userId, challengeId, filename, content, language) {
  await db.query(`
    INSERT INTO saved_code (user_id, challenge_id, filename, content, language)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      content = VALUES(content),
      language = VALUES(language)
  `, [userId, challengeId, filename, content, language]);
}

async function getDraftCode(userId, challengeId, filename) {
  const [[draft]] = await db.query(`
    SELECT * FROM saved_code 
    WHERE user_id = ? AND challenge_id = ? AND filename = ?
  `, [userId, challengeId, filename]);
  return draft;
}

async function getSavedCodeFiles(userId) {
  const [files] = await db.query('SELECT * FROM saved_code WHERE user_id = ?', [userId]);
  return files;
}

async function insertSubmission(userId, challengeId, language, code, status, time, memory, xp) {
  const [res] = await db.query(`
    INSERT INTO challenge_submissions (user_id, challenge_id, language, source_code, status, execution_time_ms, memory_usage_kb, xp_awarded)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [userId, challengeId, language, code, status, time, memory, xp]);
  return res.insertId;
}

async function getSubmissionHistory(userId) {
  const [history] = await db.query(`
    SELECT s.*, c.title AS challenge_title 
    FROM challenge_submissions s
    JOIN daily_challenges c ON s.challenge_id = c.id
    WHERE s.user_id = ? 
    ORDER BY s.created_at DESC
  `, [userId]);
  return history;
}

async function toggleBookmark(userId, challengeId) {
  const [[existing]] = await db.query('SELECT id FROM challenge_bookmarks WHERE user_id = ? AND challenge_id = ?', [userId, challengeId]);
  if (existing) {
    await db.query('DELETE FROM challenge_bookmarks WHERE id = ?', [existing.id]);
    return false;
  } else {
    await db.query('INSERT INTO challenge_bookmarks (user_id, challenge_id) VALUES (?, ?)', [userId, challengeId]);
    return true;
  }
}

async function isBookmarked(userId, challengeId) {
  const [[existing]] = await db.query('SELECT id FROM challenge_bookmarks WHERE user_id = ? AND challenge_id = ?', [userId, challengeId]);
  return !!existing;
}

module.exports = {
  getDailyChallenge,
  getRecommendedChallenges,
  getChallenge,
  getTestCases,
  saveDraftCode,
  getDraftCode,
  getSavedCodeFiles,
  insertSubmission,
  getSubmissionHistory,
  toggleBookmark,
  isBookmarked
};
