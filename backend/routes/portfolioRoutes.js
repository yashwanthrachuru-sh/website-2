// ============================================================
// backend/routes/portfolioRoutes.js
// Express Routes for Developer Portfolio Module
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const portfolioController = require('../controllers/portfolioController');
const { verifyToken } = require('../middleware/authMiddleware');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

const projectRules = [
  body('title').trim().notEmpty().withMessage('Project title is required.').isLength({ max: 150 }).withMessage('Title too long.'),
  body('description').trim().notEmpty().withMessage('Project description is required.'),
  body('github_link').optional({ checkFalsy: true }).trim().isURL().withMessage('Invalid GitHub link URL.'),
  body('live_link').optional({ checkFalsy: true }).trim().isURL().withMessage('Invalid Live link URL.'),
  body('difficulty').optional().trim().isIn(['Beginner', 'Medium', 'Advanced', 'Hard']).withMessage('Invalid difficulty level.'),
  body('status').optional().trim().isIn(['In Progress', 'Completed', 'Graded', 'Archived']).withMessage('Invalid status.'),
  validate
];

const settingsRules = [
  body('is_public').optional().isBoolean().withMessage('is_public must be boolean.'),
  body('email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Invalid contact email.'),
  body('phone').optional({ checkFalsy: true }).trim().matches(/^\+?[0-9\s\-()]{7,25}$/).withMessage('Invalid contact phone.'),
  validate
];

const themeRules = [
  body('accent_color').optional().trim().matches(/^#[0-9a-fA-F]{3,8}$|^hsl|^rgb/).withMessage('Invalid accent color format.'),
  body('background_style').optional().trim().isIn(['dark', 'light', 'glassmorphism', 'neon', 'minimalist']).withMessage('Invalid theme background style.'),
  validate
];

// ── Private / Authenticated Routes (requires valid token) ────
router.get('/',               verifyToken, portfolioController.getPortfolio);
router.put('/settings',      verifyToken, settingsRules, portfolioController.updateSettings);
router.get('/analytics',     verifyToken, portfolioController.getPortfolioAnalytics);

// Projects CRUD
router.post('/project',       verifyToken, projectRules, portfolioController.addProject);
router.put('/project/:id',    verifyToken, projectRules, portfolioController.editProject);
router.delete('/project/:id', verifyToken, portfolioController.deleteProject);

// Resume upload & delete
router.post('/resume',        verifyToken, portfolioController.uploadResume);
router.delete('/resume',      verifyToken, portfolioController.deleteResume);

// ── Phase 5 — Analytics & GitHub Tracking (public endpoints) ─
// IMPORTANT: Must be registered BEFORE the /:username wildcard
router.post('/track-view',  portfolioController.trackPortfolioView);
router.post('/track-click', portfolioController.trackPortfolioClick);

// ── Phase 5 — Authenticated Analytics & Theme ─────────────────
// IMPORTANT: Named specific routes before /:username wildcard
router.get('/views',              verifyToken, portfolioController.getPortfolioViews);
router.get('/strength',           verifyToken, portfolioController.getPortfolioStrength);
router.get('/theme',              verifyToken, portfolioController.getPortfolioTheme);
router.put('/theme',              verifyToken, themeRules, portfolioController.updatePortfolioTheme);
router.post('/share',             verifyToken, portfolioController.sharePortfolio);
router.get('/qr',                 verifyToken, portfolioController.getQRCode);
router.get('/resume-analytics',   verifyToken, portfolioController.getResumeAnalytics);

// ── Public Routes (anyone can view, no auth required) ─────────
// Wildcard /:username MUST come LAST to avoid swallowing named routes
router.get('/public/:username', portfolioController.getPublicPortfolio);
router.get('/:username',        portfolioController.getPublicPortfolio);

module.exports = router;

