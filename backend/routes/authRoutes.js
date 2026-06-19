// ============================================================
// routes/authRoutes.js — Auth Route Definitions
// ============================================================
// Maps HTTP methods + URL paths to controller functions.
// Input validation rules are declared here using express-validator
// and passed as middleware arrays before the controller.
//
// Mounted at: /api/auth  (in server.js)
//
// Final endpoints:
//   POST /api/auth/register
//   POST /api/auth/login
//   POST /api/auth/logout   (protected — requires JWT)
// ============================================================

const express                              = require('express');
const router                               = express.Router();
const { body }                             = require('express-validator');
const authController                       = require('../controllers/authController');
const { verifyToken }                      = require('../middleware/authMiddleware');

// ── Validation rule sets ─────────────────────────────────────

const registerRules = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores.'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),

  body('branch')
    .trim()
    .notEmpty()
    .withMessage('Please select a branch/track.')
    .isIn(['SDE', 'Data Science', 'Cybersecurity', 'Self Learner'])
    .withMessage('Invalid branch selected.')
];

const loginRules = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username or email is required.'),

  body('password')
    .notEmpty()
    .withMessage('Password is required.')
];

// ── Route definitions ────────────────────────────────────────

// Public routes — no token required
router.post('/register', registerRules, authController.register);
router.post('/login',    loginRules,    authController.login);

// Protected route — token required to record who logged out
router.post('/logout', verifyToken, authController.logout);

module.exports = router;
