// ============================================================
// server.js — EduNet Express Application Entry Point
// ============================================================
// v2: Added helmet, global rate limiting, analytics & AI routes,
//     removed duplicate /api/codelabs mount, tightened CORS.
// ============================================================

require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express     = require('express');
const cors        = require('cors');
const path        = require('path');
const helmet      = require('helmet');
const rateLimit   = require('express-rate-limit');

// ── Database pool ─────────────────────────────────────────────
const db = require('./config/db');

const app  = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// SECURITY MIDDLEWARE
// ============================================================

// Helmet — sets secure HTTP headers (XSS protection, frame options, etc.) with structured CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
      styleSrc:   ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc:    ["'self'", "fonts.gstatic.com", "fonts.googleapis.com"],
      imgSrc:     ["'self'", "data:", "blob:", "images.unsplash.com", "img.youtube.com"],
      frameSrc:   ["'self'", "www.youtube.com", "youtube.com"],
      connectSrc: ["'self'"]
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
    if (isLocalhost || origin === process.env.FRONTEND_ORIGIN) {
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

// ============================================================
// CATCH-ALL ROUTES
// ============================================================

// API 404 handler — must come after all /api/* mounts
app.get('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
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
app.listen(PORT, () => {
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

module.exports = app;
