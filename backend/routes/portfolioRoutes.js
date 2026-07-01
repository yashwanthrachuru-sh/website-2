// ============================================================
// backend/routes/portfolioRoutes.js
// Express Routes for Developer Portfolio Module
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { verifyToken } = require('../middleware/authMiddleware');

// ── Private / Authenticated Routes (requires valid token) ────
router.get('/',               verifyToken, portfolioController.getPortfolio);
router.put('/settings',      verifyToken, portfolioController.updateSettings);
router.get('/analytics',     verifyToken, portfolioController.getPortfolioAnalytics);

// Projects CRUD
router.post('/project',       verifyToken, portfolioController.addProject);
router.put('/project/:id',    verifyToken, portfolioController.editProject);
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
router.put('/theme',              verifyToken, portfolioController.updatePortfolioTheme);
router.post('/share',             verifyToken, portfolioController.sharePortfolio);
router.get('/qr',                 verifyToken, portfolioController.getQRCode);
router.get('/resume-analytics',   verifyToken, portfolioController.getResumeAnalytics);

// ── Public Routes (anyone can view, no auth required) ─────────
// Wildcard /:username MUST come LAST to avoid swallowing named routes
router.get('/public/:username', portfolioController.getPublicPortfolio);
router.get('/:username',        portfolioController.getPublicPortfolio);

module.exports = router;

