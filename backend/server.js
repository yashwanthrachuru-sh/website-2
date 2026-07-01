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

module.exports = app;
