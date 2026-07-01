// ============================================================
// backend/models/resumeModel.js
// Database queries for AI Resume Builder
// ============================================================
'use strict';

const db = require('../config/db');

async function getResumes(userId) {
  const [rows] = await db.query('SELECT * FROM user_resumes WHERE user_id = ? ORDER BY updated_at DESC', [userId]);
  return rows;
}

async function getResumeById(id) {
  const [[resume]] = await db.query('SELECT * FROM user_resumes WHERE id = ?', [id]);
  return resume;
}

async function getSections(resumeId) {
  const [rows] = await db.query('SELECT * FROM resume_sections WHERE resume_id = ?', [resumeId]);
  return rows;
}

async function createResume(userId, title, template, info, summary, skills) {
  const [res] = await db.query(`
    INSERT INTO user_resumes (user_id, title, template, personal_info, summary, skills)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [userId, title, template, info, summary, skills]);
  return res.insertId;
}

async function updateResume(id, title, template, info, summary, skills) {
  await db.query(`
    UPDATE user_resumes
    SET title = ?, template = ?, personal_info = ?, summary = ?, skills = ?
    WHERE id = ?
  `, [title, template, info, summary, skills, id]);
}

async function deleteResume(id) {
  await db.query('DELETE FROM user_resumes WHERE id = ?', [id]);
}

async function saveSection(resumeId, sectionName, contentJson) {
  await db.query(`
    INSERT INTO resume_sections (resume_id, section_name, content_json)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      content_json = VALUES(content_json)
  `, [resumeId, sectionName, contentJson]);
}

async function logScan(userId, resumeId, jd, score, matched, missing) {
  const [res] = await db.query(`
    INSERT INTO resume_job_scans (user_id, resume_id, job_description, score, matched_keywords, missing_keywords)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [userId, resumeId, jd, score, matched, missing]);
  return res.insertId;
}

async function getScanHistory(userId) {
  const [rows] = await db.query('SELECT * FROM resume_job_scans WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  return rows;
}

async function logDownload(userId, resumeId, format) {
  await db.query(`
    INSERT INTO resume_downloads (user_id, resume_id, format)
    VALUES (?, ?, ?)
  `, [userId, resumeId, format]);
}

async function getDownloadsCount(resumeId) {
  const [[row]] = await db.query('SELECT COUNT(*) AS count FROM resume_downloads WHERE resume_id = ?', [resumeId]);
  return row ? row.count : 0;
}

async function logAiHistory(userId, resumeId, prompt, response) {
  await db.query(`
    INSERT INTO resume_ai_history (user_id, resume_id, prompt, response)
    VALUES (?, ?, ?, ?)
  `, [userId, resumeId, prompt, response]);
}

module.exports = {
  getResumes,
  getResumeById,
  getSections,
  createResume,
  updateResume,
  deleteResume,
  saveSection,
  logScan,
  getScanHistory,
  logDownload,
  getDownloadsCount,
  logAiHistory
};
