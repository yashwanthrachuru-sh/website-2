// ============================================================
// backend/controllers/coachController.js
// Business logic for AI Career Coach
// ============================================================
'use strict';

const db = require('../config/db');
const coachModel = require('../models/coachModel');

// Template generator for goals fallback
function generateLocalPlan(goal) {
  const goalClean = goal.toLowerCase();
  let title = 'Software Engineer Track';
  let weeks = [];
  let recommendations = [];

  if (goalClean.includes('full stack') || goalClean.includes('web')) {
    title = 'Full Stack Developer Pathway';
    weeks = [
      {
        week: 1,
        title: 'HTML, CSS & JavaScript Essentials',
        desc: 'Master responsive layouts and modern DOM manipulation APIs.',
        tasks: [
          { title: 'Learn CSS Flexbox and Grid', desc: 'Create a responsive landing page layout.', type: 'lesson', xp: 50 },
          { title: 'JavaScript Promises and Async/Await', desc: 'Fetch user data from public REST endpoint.', type: 'lesson', xp: 50 },
          { title: 'Interactive Portfolio Page', desc: 'Build local portfolio cards using CSS grids.', type: 'project', xp: 100 }
        ],
        recs: [
          { type: 'roadmap', id: 'cse-sde', title: 'Software Development Track', desc: 'Core SDE curriculum.' },
          { type: 'video', id: '58YBPFoFHto', title: 'Intro to Web Development', desc: 'Core frontend elements.' }
        ]
      },
      {
        week: 2,
        title: 'Backend Frameworks with Node.js & Express',
        desc: 'Construct REST APIs and configure routing structures.',
        tasks: [
          { title: 'Express Routing & Middleware', desc: 'Setup standard logger and CORS parameters.', type: 'lesson', xp: 50 },
          { title: 'MySQL Relational Schema Integration', desc: 'Connect Express endpoints to local MySQL pool.', type: 'lesson', xp: 50 },
          { title: 'Build a task manager API', desc: 'Create CRUD endpoints for managing items.', type: 'project', xp: 100 }
        ],
        recs: [
          { type: 'video', id: 't0Cq6tVNRBA', title: 'Building REST APIs', desc: 'Node.js and Express setups.' }
        ]
      },
      {
        week: 3,
        title: 'System Design & State Management',
        desc: 'Configure caching mechanisms and handle socket streams.',
        tasks: [
          { title: 'Study database indexing and query tuning', desc: 'Run execution plan checks on relational tables.', type: 'lesson', xp: 50 },
          { title: 'WebSockets Real-time Communications', desc: 'Setup dynamic chat listeners.', type: 'lesson', xp: 50 },
          { title: 'Real-time collaborative dashboard', desc: 'Build a socket sharing application.', type: 'project', xp: 100 }
        ],
        recs: [
          { type: 'roadmap', id: 'cse-sde', title: 'System Scalability Track', desc: 'Study horizontal scaling.' }
        ]
      },
      {
        week: 4,
        title: 'Mock Interviews & Deployments',
        desc: 'Review placement mock evaluations and trigger CI/CD actions.',
        tasks: [
          { title: 'Prepare for Web Dev Technical Quiz', desc: 'Revise Javascript algorithms questions.', type: 'quiz', xp: 50 },
          { title: 'Deploy Express apps to Cloud Services', desc: 'Dockerize applications and trigger actions.', type: 'lesson', xp: 50 },
          { title: 'Full Stack mock interview challenge', desc: 'Complete placement mock evaluation with average score >= 85%.', type: 'interview', xp: 150 }
        ],
        recs: [
          { type: 'interview_question', id: 'iq_js', title: 'JS Closes & Scope questions', desc: 'Practice scope scenarios.' }
        ]
      }
    ];
  } else if (goalClean.includes('ai') || goalClean.includes('machine') || goalClean.includes('ml')) {
    title = 'AI & Machine Learning Engineer Pathway';
    weeks = [
      {
        week: 1,
        title: 'Python for Data Analysis & Math foundations',
        desc: 'Revise linear algebra, matrices, and NumPy arrays.',
        tasks: [
          { title: 'NumPy array manipulations', desc: 'Configure matrix metrics calculations.', type: 'lesson', xp: 50 },
          { title: 'Linear algebra and dot products', desc: 'Study vectors dimensions similarity rules.', type: 'lesson', xp: 50 },
          { title: 'Text data cleanup script', desc: 'Write parser scripts utilizing RegEx filters.', type: 'project', xp: 100 }
        ],
        recs: [
          { type: 'roadmap', id: 'cse-ds', title: 'Data Scientist Track', desc: 'Math and Statistics guidelines.' }
        ]
      },
      {
        week: 2,
        title: 'Supervised Learning & Model Tuning',
        desc: 'Train regressions models and evaluate parameters.',
        tasks: [
          { title: 'Linear and Logistic Regressions', desc: 'Fit test data logs using Scikit-Learn.', type: 'lesson', xp: 50 },
          { title: 'Gradient Descent optimizations', desc: 'Study loss minimization calculations.', type: 'lesson', xp: 50 },
          { title: 'Boston housing pricing predictor', desc: 'Train models and audit error statistics.', type: 'project', xp: 100 }
        ],
        recs: [
          { type: 'video', id: 't0Cq6tVNRBA', title: 'Scikit-Learn models introduction', desc: 'Training pipelines.' }
        ]
      },
      {
        week: 3,
        title: 'Deep Learning & Vector Databases',
        desc: 'Configure neural network layers and setup semantic RAG pipelines.',
        tasks: [
          { title: 'Intro to Neural Networks', desc: 'Study weights, biases, and activation formulas.', type: 'lesson', xp: 50 },
          { title: 'Configure similarity indices in Pinecone', desc: 'Load document vectors datasets.', type: 'lesson', xp: 50 },
          { title: 'Document search chatbot', desc: 'Construct vector matching RAG systems.', type: 'project', xp: 100 }
        ],
        recs: [
          { type: 'roadmap', id: 'cse-ds', title: 'Large Language Models Track', desc: 'Fine-tuning rules.' }
        ]
      },
      {
        week: 4,
        title: 'AI model deployment & interview practice',
        desc: 'Convert models to API endpoints and prepare for assessments.',
        tasks: [
          { title: 'Package models as REST endpoints', desc: 'Use Flask/FastAPI configurations.', type: 'lesson', xp: 50 },
          { title: 'Audit AI safety & prompt injections', desc: 'Scan parameters vulnerabilities.', type: 'lesson', xp: 50 },
          { title: 'AI Engineering mock interview', desc: 'Perform system checks and score >= 85%.', type: 'interview', xp: 150 }
        ],
        recs: [
          { type: 'interview_question', id: 'iq_ai', title: 'Explain Backpropagation', desc: 'Explain weights tuning mechanisms.' }
        ]
      }
    ];
  } else {
    // Default Software Engineer Track
    title = 'Software Engineer Career Pathway';
    weeks = [
      {
        week: 1,
        title: 'Data Structures & Core Algorithms',
        desc: 'Study stacks, queues, and singly linked lists.',
        tasks: [
          { title: 'Review Singly Linked Lists', desc: 'Trace pointer operations recursively.', type: 'lesson', xp: 50 },
          { title: 'Stack operations evaluation', desc: 'Implement push/pop mechanisms in C++.', type: 'lesson', xp: 50 },
          { title: 'Balanced parenthesizer checker', desc: 'Write matching checks script using stack templates.', type: 'project', xp: 100 }
        ],
        recs: [
          { type: 'roadmap', id: 'cse-sde', title: 'Data Structures & Algorithms Track', desc: 'Classical structures.' }
        ]
      },
      {
        week: 2,
        title: 'Complexity Analysis & Sorting Algorithms',
        desc: 'Evaluate time/space complexity and optimize paths.',
        tasks: [
          { title: 'Big O Complexity Analysis', desc: 'Measure algorithms scaling metrics.', type: 'lesson', xp: 50 },
          { title: 'Merge Sort and Quick Sort', desc: 'Analyze partitions operations step-by-step.', type: 'lesson', xp: 50 },
          { title: 'Custom sorting comparator project', desc: 'Sort student objects according to multiple grades metrics.', type: 'project', xp: 100 }
        ],
        recs: [
          { type: 'video', id: '58YBPFoFHto', title: 'Introduction to Algorithms', desc: 'CLRS study guides.' }
        ]
      },
      {
        week: 3,
        title: 'Advanced Tree Structures & Binary Heaps',
        desc: 'Review node relationships and priority queues.',
        tasks: [
          { title: 'Binary Search Trees lookup times', desc: 'Trace nodes balances configurations.', type: 'lesson', xp: 50 },
          { title: 'Binary Heaps and heap sorting', desc: 'Study priority queue arrays keys calculations.', type: 'lesson', xp: 50 },
          { title: 'File compressor using Huffman trees', desc: 'Write data compressor script.', type: 'project', xp: 100 }
        ],
        recs: [
          { type: 'video', id: 't0Cq6tVNRBA', title: 'BST Traversals details', desc: 'Inorder/preorder guides.' }
        ]
      },
      {
        week: 4,
        title: 'Graph traversals & Technical Interviews readiness',
        desc: 'Master BFS, DFS, and technical placements checklists.',
        tasks: [
          { title: 'Graph adjacency listings checks', desc: 'Implement BFS pathfinders matrices.', type: 'lesson', xp: 50 },
          { title: 'Study Dijkstra shortest path algorithms', desc: 'Configure priority queue nodes updates.', type: 'lesson', xp: 50 },
          { title: 'Software Engineering interview exam', desc: 'Answer complex systems design challenges.', type: 'interview', xp: 150 }
        ],
        recs: [
          { type: 'interview_question', id: 'iq_dsa', title: 'Dynamic Programming questions', desc: 'Practice knapsack scenarios.' }
        ]
      }
    ];
  }

  return { title, weeks };
}

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

    // Call template generator (offline rules configuration)
    const data = generateLocalPlan(goal);

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
