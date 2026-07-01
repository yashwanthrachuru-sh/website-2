// ============================================================
// backend/models/coachModel.js
// Database queries for AI Career Coach
// ============================================================
'use strict';

const db = require('../config/db');

async function createOrUpdateGoal(userId, goal, estimatedCompletion) {
  await db.query(`
    INSERT INTO ai_career_coaches (user_id, goal, estimated_completion)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      goal = VALUES(goal),
      estimated_completion = VALUES(estimated_completion)
  `, [userId, goal, estimatedCompletion]);

  const [[coach]] = await db.query('SELECT * FROM ai_career_coaches WHERE user_id = ?', [userId]);
  return coach;
}

async function getCurrentGoal(userId) {
  const [[coach]] = await db.query('SELECT * FROM ai_career_coaches WHERE user_id = ?', [userId]);
  return coach;
}

async function getWeeklyPlans(coachId) {
  const [plans] = await db.query('SELECT * FROM weekly_plans WHERE coach_id = ? ORDER BY week_number ASC', [coachId]);
  return plans;
}

async function getTasks(coachId) {
  const [tasks] = await db.query('SELECT * FROM study_tasks WHERE coach_id = ? ORDER BY task_date ASC, id ASC', [coachId]);
  return tasks;
}

async function updateTaskStatus(taskId, status) {
  await db.query('UPDATE study_tasks SET status = ? WHERE id = ?', [status, taskId]);
}

async function postponeTaskToTomorrow(taskId) {
  const today = new Date().toISOString().slice(0, 10);
  await db.query(`
    UPDATE study_tasks
    SET task_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY),
        status = 'postponed'
    WHERE id = ?
  `, [taskId]);
}

async function createWeeklyPlan(coachId, weekNum, title, desc, status) {
  const [res] = await db.query(`
    INSERT INTO weekly_plans (coach_id, week_number, title, goal_description, status)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      goal_description = VALUES(goal_description),
      status = VALUES(status)
  `, [coachId, weekNum, title, desc, status]);
  return res.insertId;
}

async function createTask(coachId, planId, title, desc, type, date, xp) {
  const [res] = await db.query(`
    INSERT INTO study_tasks (coach_id, week_plan_id, title, description, task_type, task_date, status, xp_reward)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
  `, [coachId, planId, title, desc, type, date, xp]);
  return res.insertId;
}

async function clearCoachPlan(coachId) {
  await db.query('DELETE FROM weekly_plans WHERE coach_id = ?', [coachId]);
  await db.query('DELETE FROM study_tasks WHERE coach_id = ?', [coachId]);
  await db.query('DELETE FROM coach_recommendations WHERE coach_id = ?', [coachId]);
}

async function addRecommendation(coachId, type, itemId, title, desc, url) {
  await db.query(`
    INSERT INTO coach_recommendations (coach_id, item_type, item_id, title, description, url)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [coachId, type, itemId, title, desc, url]);
}

async function getRecommendations(coachId) {
  const [recs] = await db.query('SELECT * FROM coach_recommendations WHERE coach_id = ?', [coachId]);
  return recs;
}

async function logStudySession(userId, minutes) {
  const today = new Date().toISOString().slice(0, 10);
  await db.query(`
    INSERT INTO study_sessions (user_id, session_date, duration_minutes)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      duration_minutes = duration_minutes + VALUES(duration_minutes)
  `, [userId, today, minutes]);
}

module.exports = {
  createOrUpdateGoal,
  getCurrentGoal,
  getWeeklyPlans,
  getTasks,
  updateTaskStatus,
  postponeTaskToTomorrow,
  createWeeklyPlan,
  createTask,
  clearCoachPlan,
  addRecommendation,
  getRecommendations,
  logStudySession
};
