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

// ── Public Routes (anyone can view, no auth required) ────────
router.get('/public/:username', portfolioController.getPublicPortfolio);
router.get('/:username',        portfolioController.getPublicPortfolio);
module.exports = router;
