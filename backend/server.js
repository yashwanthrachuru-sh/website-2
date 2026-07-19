// ============================================================
// server.js — EduNet Express Application Entry Point
// ============================================================
// v2: Added helmet, global rate limiting, analytics & AI routes,
//     removed duplicate /api/codelabs mount, tightened CORS.
// ============================================================

require('dotenv').config({ path: require('path').join(__dirname, '.env') });

// ── Environment Variables Validation ──────────────────────────
const requiredEnvVars = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(name => !process.env[name]);
if (missingEnvVars.length > 0) {
  console.error(`❌  CRITICAL ERROR: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('    Please configure them in your environment or backend/.env file.');
  process.exit(1);
}
if (!process.env.DATABASE_URL && (!process.env.DB_HOST || !process.env.DB_USER)) {
  console.warn('⚠️  WARNING: Neither DATABASE_URL nor DB_HOST/DB_USER are configured. Database connections may fail.');
}

const express     = require('express');
const cors        = require('cors');
const path        = require('path');
const helmet      = require('helmet');
const rateLimit   = require('express-rate-limit');

// ── Database pool ─────────────────────────────────────────────
const db = require('./config/db');

// Run portfolio database migrations on boot
require('./config/migrate_portfolio').migrate().catch(err => {
  console.error('Portfolio migration failed on startup:', err.message);
});
require('./config/migrate_phase1').migrate().catch(err => {
  console.error('Phase 1 migration failed on startup:', err.message);
});
require('./config/migrate_phase2').migrate().catch(err => {
  console.error('Phase 2 migration failed on startup:', err.message);
});
require('./config/migrate_phase3').migrate().catch(err => {
  console.error('Phase 3 migration failed on startup:', err.message);
});
require('./config/migrate_phase4').migrate().catch(err => {
  console.error('Phase 4 migration failed on startup:', err.message);
});
require('./config/migrate_phase5').migrate().catch(err => {
  console.error('Phase 5 migration failed on startup:', err.message);
});
require('./config/migrate_roadmap_system').migrate().catch(err => {
  console.error('Roadmap System migration failed on startup:', err.message);
});

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Trust Proxy ───────────────────────────────────────────────
// Render (and most cloud hosts) route traffic through a reverse
// proxy. Without this, req.ip always returns the proxy IP,
// breaking per-IP rate limiting and req.protocol detection.
app.set('trust proxy', 1);


// ============================================================
// SECURITY MIDDLEWARE
// ============================================================

// Helmet — sets secure HTTP headers (XSS protection, frame options, etc.) with structured CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net", "cdnjs.cloudflare.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc:   ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc:    ["'self'", "fonts.gstatic.com", "fonts.googleapis.com"],
      imgSrc:     ["'self'", "data:", "blob:", "images.unsplash.com", "img.youtube.com", "*.vercel.app"],
      frameSrc:   ["'self'", "www.youtube.com", "youtube.com"],
      connectSrc: ["'self'", "https://edunet-yx17.onrender.com", "https://api.github.com"]
    }
  },
  crossOriginEmbedderPolicy: false // Required for YouTube iframing to work
}));

// Global rate limiter — 150 requests per 15 minutes per IP
// (health check and static files are excluded automatically via Express static)
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 min default
  max:      parseInt(process.env.RATE_LIMIT_MAX        || '150'),   // 150 req/window
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: 'Too many requests. Please slow down and try again later.' },
  skip: (req) => {
    // Skip rate limiting for health check and static file serving
    return req.path === '/api/health' || !req.path.startsWith('/api/');
  }
});
app.use(globalLimiter);

// Stricter limiter for AI endpoints (10 req/minute per IP)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { success: false, message: 'AI mentor rate limit reached. Please wait a moment.' }
});

// ============================================================
// CORS
// ============================================================
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isLocalhost = origin.indexOf('://localhost') !== -1 || origin.indexOf('://127.0.0.1') !== -1;
    const isVercelPreview = origin.endsWith('.vercel.app');

    const allowedOrigins = (process.env.FRONTEND_ORIGIN || '')
      .split(',')
      .map(o => o.trim())
      .filter(Boolean);

    if (isLocalhost || allowedOrigins.includes(origin) || isVercelPreview) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods:            ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders:     ['Content-Type', 'Authorization'],
  credentials:        true
}));

// ============================================================
// BODY PARSERS
// ============================================================
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Disable Express fingerprinting header
app.disable('x-powered-by');

// Mount XSS Input HTML Sanitizer middleware
const { sanitizeInput } = require('./middleware/sanitizeMiddleware');
app.use(sanitizeInput);

// ============================================================
// STATIC FRONTEND FILES
// ============================================================
const FRONTEND_ROOT = path.join(__dirname, '..');
app.use(express.static(FRONTEND_ROOT));

// ============================================================
// API ROUTES
// ============================================================

// Health check — no rate limiting, no auth
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ success: true, database: 'connected', version: '2.0' });
  } catch (err) {
    res.status(503).json({ success: false, database: 'disconnected' });
  }
});

// ── Import Routes ────────────────────────────────────────────
const authRoutes        = require('./routes/authRoutes');
const userRoutes        = require('./routes/userRoutes');
const progressRoutes    = require('./routes/progressRoutes');
const toolsRoutes       = require('./routes/toolsRoutes');
const adminRoutes       = require('./routes/adminRoutes');
const codeRoutes        = require('./routes/codeRoutes');
const videoRoutes       = require('./routes/videoRoutes');
const roadmapRoutes     = require('./routes/roadmapRoutes');
const quizRoutes        = require('./routes/quizRoutes');
const profileRoutes     = require('./routes/profileRoutes');
const moduleRoutes      = require('./routes/moduleRoutes');
const bookmarkRoutes    = require('./routes/bookmarkRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const lessonRoutes      = require('./routes/lessonRoutes');
const analyticsRoutes   = require('./routes/analyticsRoutes');
const aiRoutes          = require('./routes/aiRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const portfolioRoutes   = require('./routes/portfolioRoutes');
const coachRoutes       = require('./routes/coachRoutes');
const challengeRoutes   = require('./routes/challengeRoutes');
const resumeRoutes      = require('./routes/resumeRoutes');
const githubRoutes      = require('./routes/githubRoutes');

// ── Mount Routes ─────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/user',         userRoutes);
app.use('/api/progress',     progressRoutes);
app.use('/api/tools',        toolsRoutes);
app.use('/api/admin',        adminRoutes);
app.use('/api/code',         codeRoutes);       // Only /api/code — removed duplicate /api/codelabs
app.use('/api/videos',       videoRoutes);
app.use('/api/roadmaps',     roadmapRoutes);
app.use('/api/quizzes',      quizRoutes);
app.use('/api/profile',      profileRoutes);
app.use('/api/modules',      moduleRoutes);
app.use('/api/bookmarks',    bookmarkRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/lessons',      lessonRoutes);
app.use('/api/analytics',    analyticsRoutes);
app.use('/api/ai',           aiLimiter, aiRoutes); // AI gets its own stricter limiter
app.use('/api/achievements', achievementRoutes);
app.use('/api/portfolio',    portfolioRoutes);
app.use('/api/coach',        coachRoutes);
app.use('/api/challenges',   challengeRoutes);
app.use('/api/resume',       resumeRoutes);
app.use('/api/github',       githubRoutes);

// ============================================================
// INTERVIEW PREP ROUTES
// ============================================================

// GET /api/interview/questions — Return 10 real DSA interview questions
app.get('/api/interview/questions', (req, res) => {
  const questions = [
    {
      id: 'q1',
      title: 'Two Sum',
      difficulty: 'Easy',
      category: 'Arrays',
      question: 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target. You may assume that each input has exactly one solution.',
      sampleAnswer: 'Use a HashMap to store each element and its index as you iterate. For each element, check if (target - element) exists in the map. If yes, return the current index and the stored index. Time: O(n), Space: O(n).'
    },
    {
      id: 'q2',
      title: 'Reverse a Linked List',
      difficulty: 'Easy',
      category: 'Linked Lists',
      question: 'Given the head of a singly linked list, reverse the list and return its head.',
      sampleAnswer: 'Use three pointers: prev (initially null), curr (head), and next. Iterate: save curr.next in next, set curr.next = prev, move prev = curr, move curr = next. Continue until curr is null. Return prev as the new head. Time: O(n), Space: O(1).'
    },
    {
      id: 'q3',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      category: 'Stacks',
      question: 'Given a string s containing just the characters "(", ")", "{", "}", "[", "]", determine if the input string is valid. A string is valid if brackets close in the correct order.',
      sampleAnswer: 'Use a stack. Iterate through characters: if opening bracket ( (, {, [ ), push onto stack. If closing bracket, check if stack top matches (pop if matches, return false otherwise). After iteration, return true if stack is empty. Time: O(n), Space: O(n).'
    },
    {
      id: 'q4',
      title: 'Maximum Subarray (Kadane\'s Algorithm)',
      difficulty: 'Medium',
      category: 'Arrays',
      question: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
      sampleAnswer: 'Use Kadane\'s Algorithm: maintain maxEndingHere and maxSoFar. For each element, set maxEndingHere = max(nums[i], maxEndingHere + nums[i]), then maxSoFar = max(maxSoFar, maxEndingHere). Time: O(n), Space: O(1).'
    },
    {
      id: 'q5',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      category: 'Linked Lists',
      question: 'You are given the heads of two sorted linked lists list1 and list2. Merge them into one sorted linked list and return its head.',
      sampleAnswer: 'Use a dummy node approach. Compare nodes from both lists and attach the smaller one. Continue until one list is exhausted, then attach the remainder. Return dummy.next. Time: O(m+n), Space: O(1).'
    },
    {
      id: 'q6',
      title: 'Binary Tree Level Order Traversal',
      difficulty: 'Medium',
      category: 'Trees',
      question: 'Given the root of a binary tree, return the level order traversal of its nodes\' values (left to right, level by level).',
      sampleAnswer: 'Use a queue. Start with root in queue. While queue is not empty, process all nodes at current level (size = queue.length), add their values to current level list, enqueue left and right children. Add level list to result. Time: O(n), Space: O(n).'
    },
    {
      id: 'q7',
      title: 'LRU Cache',
      difficulty: 'Hard',
      category: 'Design',
      question: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement get() and put() in O(1) average time.',
      sampleAnswer: 'Use a HashMap (for O(1) lookup) combined with a doubly linked list (for O(1) removal/insertion). Most Recently Used items go to head, Least Recently Used are at tail. On get: move accessed node to head. On put: if at capacity, remove tail node before inserting new node at head.'
    },
    {
      id: 'q8',
      title: 'Find All Duplicates in Array',
      difficulty: 'Medium',
      category: 'Arrays',
      question: 'Given an integer array of length n where all values are in range [1, n], some elements appear twice. Find all elements that appear twice without using extra space.',
      sampleAnswer: 'Use the array itself as a hash map. For each element, use its value as an index, negate the value at that index. If the value at that index is already negative, the element is a duplicate. Time: O(n), Space: O(1) besides output array.'
    },
    {
      id: 'q9',
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      category: 'Strings',
      question: 'Given a string s, find the length of the longest substring without repeating characters.',
      sampleAnswer: 'Use sliding window with two pointers and a HashMap (or Set). Expand right pointer, adding characters. If duplicate found, move left pointer to skip past the previous occurrence. Track max window length. Time: O(n), Space: O(min(m, n)) where m is charset size.'
    },
    {
      id: 'q10',
      title: 'Serialize and Deserialize Binary Tree',
      difficulty: 'Hard',
      category: 'Trees',
      question: 'Design an algorithm to serialize a binary tree into a string and deserialize that string back into the tree.',
      sampleAnswer: 'Use preorder traversal with a sentinel (e.g., "null") for null nodes. Serialize: recursively build string using "," as delimiter. Deserialize: split string into array, use a pointer/index to build tree recursively, consuming values in preorder order. Time: O(n) for both operations.'
    }
  ];
  res.json({ success: true, questions });
});

// POST /api/interview/feedback — Mock AI feedback on user's answer
app.post('/api/interview/feedback', (req, res) => {
  const { question, userAnswer } = req.body;
  if (!question || !userAnswer) {
    return res.status(400).json({ success: false, message: 'Question and userAnswer are required.' });
  }

  const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;
  let feedback = '';

  if (wordCount < 10) {
    feedback = 'Your answer is too brief. Expand your response with a step-by-step explanation, including time and space complexity analysis. Aim for at least 30-50 words.';
  } else if (wordCount < 30) {
    feedback = 'Good start! Your answer has some structure but could be more detailed. Consider including: 1) The approach/algorithm name, 2) Step-by-step explanation, 3) Time and space complexity analysis, 4) Edge cases and how to handle them.';
  } else {
    const complexityTerms = /O\(|time|space|complexity|O\(1\)|O\(n\)|O\(log n\)|O\(n²\)/i;
    const structureTerms = /first|then|next|step|approach|algorithm|iterate|traverse|recursive|iterative/i;
    const hasComplexity = complexityTerms.test(userAnswer);
    const hasStructure = structureTerms.test(userAnswer);

    if (hasComplexity && hasStructure) {
      feedback = 'Excellent answer! Your response is well-structured with clear step-by-step reasoning and complexity analysis. This demonstrates the depth expected at FAANG-level interviews. Consider also discussing alternative approaches and their tradeoffs.';
    } else if (hasStructure) {
      feedback = 'Good structured answer! You explained the approach clearly. To improve, add time and space complexity analysis (Big O notation) and discuss edge cases. Interviewers expect complexity analysis for every solution.';
    } else if (hasComplexity) {
      feedback = 'Good analysis of complexity, but your answer needs more structure. Walk through the algorithm step by step, explaining the data structures used and the reasoning behind each decision.';
    } else {
      feedback = 'Your answer covers the basics but lacks structure and complexity analysis. For better interview performance: 1) Name the approach/algorithm, 2) Explain step by step with pseudocode, 3) Provide time & space complexity, 4) Discuss edge cases.';
    }

    if (wordCount >= 80) {
      feedback += ' Excellent length — comprehensive answers like this stand out in interviews.';
    }
  }

  // Simulate slight delay for realism
  setTimeout(() => {
    res.json({
      success: true,
      feedback,
      metrics: {
        wordCount,
        hasComplexityAnalysis: /O\(|complexity/i.test(userAnswer),
        hasStructure: /first|then|next|step|approach|algorithm/i.test(userAnswer),
        hasCodeExample: /function|class|def |int |var |let |const/i.test(userAnswer)
      }
    });
  }, 500);
});

// ============================================================
// CATCH-ALL ROUTES
// ============================================================

// API 404 handler — must come after all /api/* mounts
app.get('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

// SPA portfolio routing fallbacks — must come before general catch-all
app.get('/profile/portfolio', (req, res) => {
  res.sendFile(path.join(FRONTEND_ROOT, 'portfolio.html'));
});
app.get('/portfolio/:username', (req, res) => {
  res.sendFile(path.join(FRONTEND_ROOT, 'portfolio.html'));
});

// SPA catch-all — serve index.html for any non-API GET
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_ROOT, 'index.html'));
});

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Don't leak internal error details in production
  const isDev = process.env.NODE_ENV !== 'production';
  console.error('❌  Unhandled error:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: isDev ? (err.message || 'Internal server error.') : 'Internal server error.'
  });
});

// ============================================================
// START SERVER
// ============================================================
const server = app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║       EduNet API Server — v2.0 Running    ║');
  console.log(`║   http://localhost:${PORT}                   ║`);
  console.log(`║   Environment: ${process.env.NODE_ENV || 'development'}                 ║`);
  console.log('║   Security: Helmet ✓  Rate Limit ✓        ║');
  console.log('║   Routes: Analytics ✓  AI Mentor ✓        ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('');
});

// ── Graceful Shutdown Handler ──────────────────────────────
const dbPool = require('./config/db');

function gracefulShutdown() {
  console.log('⏳ Received shutdown signal (SIGTERM/SIGINT). Closing HTTP server...');
  server.close(() => {
    console.log('✅ HTTP server closed. Closing database connections...');
    dbPool.end().then(() => {
      console.log('✅ Database connection pool closed. Exiting process.');
      process.exit(0);
    }).catch((err) => {
      console.error('❌ Error during database pool close:', err.message);
      process.exit(1);
    });
  });

  // Force exit after 10 seconds if shutdown hangs
  setTimeout(() => {
    console.error('⚠️ Force exiting process after 10s timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// ── Unhandled Rejection / Exception Guards ─────────────────────
// Prevents a single unhandled async error from crashing Render.
// Logs the error and keeps the process alive in production.
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️  Unhandled Promise Rejection at:', promise, 'reason:', reason);
  // In development, crash fast to surface bugs quickly
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error('💥  Uncaught Exception:', err.stack || err.message);
  // Always exit on uncaughtException — the process state is undefined after this
  process.exit(1);
});

module.exports = app;
