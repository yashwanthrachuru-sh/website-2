// ============================================================
// backend/controllers/coachController.js
// Business logic for AI Career Coach
// ============================================================
'use strict';

const db = require('../config/db');
const coachModel = require('../models/coachModel');
const contentEngine = require('../services/contentEngine');
// Local plan generation removed - delegated to contentEngine

// GET /api/coach/dashboard
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user details
    const [[user]] = await db.query('SELECT xp, level, streak, longest_streak FROM users WHERE id = ?', [userId]);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    // Fetch career coach goal
    const coach = await coachModel.getCurrentGoal(userId);
    if (!coach) {
      return res.json({ success: true, onboarding: true, message: 'No active career goal.' });
    }

    const plans = await coachModel.getWeeklyPlans(coach.id);
    const tasks = await coachModel.getTasks(coach.id);

    // Calculate completions metrics
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const remainingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'postponed');
    const totalTasksCount = tasks.length;
    const completedTasksCount = completedTasks.length;

    // Estimations
    const completedPct = totalTasksCount ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    // Call dynamic calculator for portfolio completion percentage
    // Fetch settings, socials, resume, and projects for portfolio strength calculation
    const [[portfolioSettings]] = await db.query('SELECT * FROM portfolio_settings WHERE user_id = ?', [userId]).catch(() => [[null]]);
    const [[portfolioSocials]]  = await db.query('SELECT * FROM portfolio_socials WHERE user_id = ?', [userId]).catch(() => [[null]]);
    const [[portfolioResume]]   = await db.query('SELECT resume_url FROM portfolio_resume WHERE user_id = ?', [userId]).catch(() => [[null]]);
    const [portfolioProjects]   = await db.query('SELECT id FROM portfolio_projects WHERE user_id = ?', [userId]).catch(() => [[]]);

    let portfolioCompletion = 0;
    if (portfolioSettings) {
      if (portfolioSettings.headline) portfolioCompletion += 15;
      if (portfolioSettings.about_me) portfolioCompletion += 15;
      if (portfolioSettings.location) portfolioCompletion += 10;
      if (portfolioSettings.availability) portfolioCompletion += 10;
    }
    if (portfolioSocials) {
      if (portfolioSocials.linkedin_url) portfolioCompletion += 10;
      if (portfolioSocials.github_url) portfolioCompletion += 10;
      if (portfolioSocials.website_url || portfolioSocials.twitter_url) portfolioCompletion += 10;
    }
    if (portfolioResume && portfolioResume.resume_url) portfolioCompletion += 10;
    if (portfolioProjects && portfolioProjects.length > 0) portfolioCompletion += 10;

    // Fetch roadmap completions
    const [[roadmapProgressRow]] = await db.query(`
      SELECT COUNT(*) AS count FROM roadmap_progress 
      WHERE username = (SELECT username FROM users WHERE id = ?) AND completed = 1
    `, [userId]).catch(() => [[{ count: 0 }]]);

    // Fetch interview scores averages
    const [[interviewRow]] = await db.query(`
      SELECT AVG(score) AS avg_score FROM interview_sessions WHERE user_id = ?
    `, [userId]).catch(() => [[{ avg_score: 0 }]]);

    res.json({
      success: true,
      onboarding: false,
      coach: {
        goal: coach.goal,
        estimated_completion: coach.estimated_completion,
        total_tasks: totalTasksCount,
        completed_tasks: completedTasksCount,
        remaining_tasks: remainingTasks.length,
        completion_percentage: completedPct,
        xp: user.xp,
        streak: user.streak,
        longest_streak: user.longest_streak,
        portfolio_completion: Math.min(100, portfolioCompletion),
        roadmap_completion: roadmapProgressRow ? roadmapProgressRow.count * 10 : 0,
        interview_readiness: Math.round(interviewRow ? (interviewRow.avg_score || 0) : 0),
        resume_score: portfolioResume ? 85 : 0
      }
    });
  } catch (err) {
    console.error('coach getDashboard error:', err);
    res.status(500).json({ success: false, message: 'Server error loading coach details.' });
  }
};

// GET /api/coach/tasks
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const coach = await coachModel.getCurrentGoal(userId);
    if (!coach) return res.status(400).json({ success: false, message: 'No active career planner.' });

    const tasks = await coachModel.getTasks(coach.id);
    res.json({ success: true, tasks });
  } catch (err) {
    console.error('coach getTasks error:', err);
    res.status(500).json({ success: false, message: 'Server error loading tasks.' });
  }
};

// POST /api/coach/generate
const generatePlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { goal } = req.body;

    if (!goal || goal.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Invalid goal description.' });
    }

    // Set estimated date as today + 28 days
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 28);
    const dateStr = estimatedDate.toISOString().slice(0, 10);

    const coach = await coachModel.createOrUpdateGoal(userId, goal, dateStr);
    await coachModel.clearCoachPlan(coach.id);

    // Call template generator (delegated to contentEngine)
    const data = contentEngine.generate({ type: 'career_plan', goal });

    // Write to database
    for (const w of data.weeks) {
      const planId = await coachModel.createWeeklyPlan(coach.id, w.week, w.title, w.desc, w.week === 1 ? 'active' : 'pending');

      // Seed 3 daily tasks per week spaced dynamically
      for (let i = 0; i < w.tasks.length; i++) {
        const t = w.tasks[i];
        const taskDate = new Date();
        // Space tasks every 2 days
        taskDate.setDate(taskDate.getDate() + (w.week - 1) * 7 + i * 2);
        const taskDateStr = taskDate.toISOString().slice(0, 10);

        await coachModel.createTask(coach.id, planId, t.title, t.desc, t.type, taskDateStr, t.xp);
      }

      // Seed recommendations
      for (const r of w.recs) {
        await coachModel.addRecommendation(coach.id, r.type, r.id, r.title, r.desc, `/roadmaps.html?id=${r.id}`);
      }
    }

    res.json({ success: true, message: 'AI Plan generated successfully.' });
  } catch (err) {
    console.error('coach generatePlan error:', err);
    res.status(500).json({ success: false, message: 'Server error generating plan.' });
  }
};

// POST /api/coach/task/complete
const completeTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.body;

    if (!id) return res.status(400).json({ success: false, message: 'Task ID is required.' });

    // Validate ownership
    const [[task]] = await db.query(`
      SELECT t.id, t.status, t.xp_reward, c.user_id 
      FROM study_tasks t
      JOIN ai_career_coaches c ON t.coach_id = c.id
      WHERE t.id = ?
    `, [id]);

    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    if (task.user_id !== userId) return res.status(403).json({ success: false, message: 'Access denied.' });

    if (task.status === 'completed') {
      return res.json({ success: true, message: 'Task already completed.' });
    }

    // Mark task complete
    await coachModel.updateTaskStatus(id, 'completed');

    // Secure double-claim prevention inside xp_ledger
    const sourceKey = `task_${id}`;
    let claimedOutput = false;

    try {
      const userModel = require('../models/userModel');
      const awardResult = await userModel.awardXPAndIncrementStreak(userId, task.xp_reward, sourceKey);
      if (!awardResult.already_claimed) {
        // Log study session duration minutes (+15 mins per completed task)
        await coachModel.logStudySession(userId, 15);
        claimedOutput = true;
      }
    } catch (e) {
      if (e.code !== 'ER_DUP_ENTRY') throw e;
    }

    res.json({ success: true, message: 'Task marked complete successfully.', xp_awarded: claimedOutput ? task.xp_reward : 0 });
  } catch (err) {
    console.error('coach completeTask error:', err);
    res.status(500).json({ success: false, message: 'Server error updating task.' });
  }
};

// POST /api/coach/task/skip
const skipTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.body;

    if (!id) return res.status(400).json({ success: false, message: 'Task ID is required.' });

    // Validate ownership
    const [[task]] = await db.query(`
      SELECT t.id, c.user_id FROM study_tasks t
      JOIN ai_career_coaches c ON t.coach_id = c.id
      WHERE t.id = ?
    `, [id]);

    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    if (task.user_id !== userId) return res.status(403).json({ success: false, message: 'Access denied.' });

    await coachModel.updateTaskStatus(id, 'skipped');
    res.json({ success: true, message: 'Task skipped successfully.' });
  } catch (err) {
    console.error('coach skipTask error:', err);
    res.status(500).json({ success: false, message: 'Server error skipping task.' });
  }
};

// POST /api/coach/task/postpone
const postponeTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.body;

    if (!id) return res.status(400).json({ success: false, message: 'Task ID is required.' });

    // Validate ownership
    const [[task]] = await db.query(`
      SELECT t.id, c.user_id FROM study_tasks t
      JOIN ai_career_coaches c ON t.coach_id = c.id
      WHERE t.id = ?
    `, [id]);

    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    if (task.user_id !== userId) return res.status(403).json({ success: false, message: 'Access denied.' });

    await coachModel.postponeTaskToTomorrow(id);
    res.json({ success: true, message: 'Task postponed to tomorrow successfully.' });
  } catch (err) {
    console.error('coach postponeTask error:', err);
    res.status(500).json({ success: false, message: 'Server error postponing task.' });
  }
};

// GET /api/coach/recommendations
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const coach = await coachModel.getCurrentGoal(userId);
    if (!coach) return res.status(400).json({ success: false, message: 'No active career goal.' });

    const recommendations = await coachModel.getRecommendations(coach.id);
    res.json({ success: true, recommendations });
  } catch (err) {
    console.error('coach getRecommendations error:', err);
    res.status(500).json({ success: false, message: 'Server error loading recommendations.' });
  }
};

// GET /api/coach/calendar
const getCalendar = async (req, res) => {
  try {
    const userId = req.user.id;
    const coach = await coachModel.getCurrentGoal(userId);
    if (!coach) return res.status(400).json({ success: false, message: 'No active career planner.' });

    const tasks = await coachModel.getTasks(coach.id);
    
    // Fetch study sessions durations
    const [sessions] = await db.query('SELECT DATE_FORMAT(session_date, "%Y-%m-%d") AS day, duration_minutes FROM study_sessions WHERE user_id = ?', [userId]);

    res.json({ success: true, tasks, sessions });
  } catch (err) {
    console.error('coach getCalendar error:', err);
    res.status(500).json({ success: false, message: 'Server error loading calendar.' });
  }
};

module.exports = {
  getDashboard,
  getTasks,
  generatePlan,
  completeTask,
  skipTask,
  postponeTask,
  getRecommendations,
  getCalendar
};
