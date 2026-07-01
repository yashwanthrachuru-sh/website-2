// ============================================================
// backend/routes/coachRoutes.js
// REST Routes for AI Career Coach
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const coachController = require('../controllers/coachController');

// All coach routes are authenticated
router.get('/dashboard', verifyToken, coachController.getDashboard);
router.get('/tasks', verifyToken, coachController.getTasks);
router.post('/generate', verifyToken, coachController.generatePlan);
router.post('/task/complete', verifyToken, coachController.completeTask);
router.post('/task/skip', verifyToken, coachController.skipTask);
router.post('/task/postpone', verifyToken, coachController.postponeTask);
router.get('/recommendations', verifyToken, coachController.getRecommendations);
router.get('/calendar', verifyToken, coachController.getCalendar);

module.exports = router;
