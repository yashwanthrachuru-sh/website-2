// ============================================================
// backend/routes/analyticsRoutes.js
// EduNet — Analytics API Routes
// ============================================================
'use strict';

const express = require('express');
const router  = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { verifyToken } = require('../middleware/authMiddleware');

// All analytics endpoints require authentication
router.get('/dashboard', verifyToken, analyticsController.getDashboard);
router.get('/heatmap',   verifyToken, analyticsController.getHeatmap);
router.get('/weekly',    verifyToken, analyticsController.getWeekly);
router.get('/monthly',   verifyToken, analyticsController.getMonthly);
router.get('/streaks',   verifyToken, analyticsController.getStreaks);
router.get('/topics',    verifyToken, analyticsController.getTopicInsights);

module.exports = router;
