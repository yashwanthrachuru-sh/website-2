// ============================================================
// server.js — EduNet Express Application Entry Point
// ============================================================
// This is the heart of the backend. It:
//   1. Loads environment variables from .env
//   2. Sets up middleware (CORS, JSON body parser)
//   3. Serves the static HTML/CSS frontend files
//   4. Mounts all API route groups under /api/*
//   5. Provides a health-check endpoint
//   6. Handles 404 and global errors
//   7. Starts listening on the configured port
// ============================================================

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const path       = require('path');

// ── Import database pool (runs testConnection on require) ────
const db = require('./config/db');

const app  = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// MIDDLEWARE
// ============================================================

// CORS — Allow requests from the frontend origin
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    // Allow localhost/127.0.0.1 on any port, or custom FRONTEND_ORIGIN
    const isLocalhost = origin.indexOf('://localhost') !== -1 || origin.indexOf('://127.0.0.1') !== -1;
    if (isLocalhost || origin === process.env.FRONTEND_ORIGIN) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true                         // Allow cookies / auth headers
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form bodies (for any HTML form POSTs)
app.use(express.urlencoded({ extended: true }));

// ============================================================
// SERVE STATIC FRONTEND FILES
// ============================================================
// The frontend HTML files live one directory above the backend.
// Express will serve index.html, user.html, admin.html,
// and index.css from the project root automatically.
// This means the browser can open http://localhost:5000 and
// see the landing page without a separate web server.
//
// __dirname = /path/to/website-2/backend
// path.join(__dirname, '..') = /path/to/website-2  ← root
// ============================================================

const FRONTEND_ROOT = path.join(__dirname, '..');

app.use(express.static(FRONTEND_ROOT));

// ============================================================
// API ROUTES
// ============================================================
// All API endpoints are prefixed with /api to separate them
// cleanly from the static frontend routes.
// Routes will be imported and mounted here as each step is built.
// ============================================================

// Health check — confirm the server and DB are alive
app.get('/api/health', async (req, res) => {
  try {
    // Run a minimal query to verify DB connectivity
    await db.query('SELECT 1');
    res.json({
      success: true,
      database: 'connected'
    });
  } catch (err) {
    res.status(503).json({
      success: false,
      database: 'disconnected'
    });
  }
});

// ── Route mounts (uncommented as each step is built) ───────────
const authRoutes = require('./routes/authRoutes');
const userRoutes     = require('./routes/userRoutes');     // Step 4
const progressRoutes = require('./routes/progressRoutes'); // Step 5
const toolsRoutes    = require('./routes/toolsRoutes');    // Step 6
const adminRoutes    = require('./routes/adminRoutes');    // Step 7
const codeRoutes     = require('./routes/codeRoutes');
const videoRoutes    = require('./routes/videoRoutes');
const roadmapRoutes  = require('./routes/roadmapRoutes');
const quizRoutes     = require('./routes/quizRoutes');
const profileRoutes  = require('./routes/profileRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/user',     userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/tools',    toolsRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/codelabs', codeRoutes);
app.use('/api/code',     codeRoutes);
app.use('/api/videos',   videoRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/quizzes',  quizRoutes);
app.use('/api/profile',  profileRoutes);

// ============================================================
// CATCH-ALL: Serve index.html for any unknown GET route
// ============================================================
// This ensures that navigating directly to /user.html or
// /admin.html in the browser works correctly via Express.
// API 404s are handled separately above via /api/* misses.
// ============================================================

app.get('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_ROOT, 'index.html'));
});

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================
// Any error passed via next(err) in route handlers lands here.
// Returns a consistent JSON error shape.
// ============================================================

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('❌  Unhandled error:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.'
  });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║       EduNet API Server — Running      ║');
  console.log(`║   http://localhost:${PORT}                 ║`);
  console.log(`║   Environment: ${process.env.NODE_ENV || 'development'}              ║`);
  console.log('╚════════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
