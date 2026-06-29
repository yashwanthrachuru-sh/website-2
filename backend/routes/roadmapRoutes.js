// ============================================================
// backend/routes/roadmapRoutes.js
// EduNet — Complete Roadmap Learning System Routes
// ============================================================
'use strict';

const express = require('express');
const router  = express.Router();
const roadmapController = require('../controllers/roadmapController');
const { verifyToken, optionalToken } = require('../middleware/authMiddleware');

// Public routes (with optional auth for progress)
router.get('/',                          optionalToken, roadmapController.getAllRoadmaps);
router.get('/search',                    roadmapController.searchRoadmaps);
router.get('/user/stats',                verifyToken,   roadmapController.getUserRoadmapStats);
router.get('/progress/:roadmapId',       optionalToken, roadmapController.getRoadmapProgress);
router.get('/modules/:moduleId',         optionalToken, roadmapController.getModuleDetail);
router.get('/modules/:moduleId/quiz',    roadmapController.getModuleQuiz);

// Protected routes
router.post('/modules/:moduleId/complete',      verifyToken, roadmapController.completeModule);
router.post('/modules/:moduleId/quiz/submit',   verifyToken, roadmapController.submitModuleQuiz);
router.post('/bookmark',                         verifyToken, roadmapController.bookmarkRoadmap);

// Roadmap exam routes
router.get('/:id/exam',          roadmapController.getRoadmapExam);
router.post('/:id/exam/submit',  verifyToken, roadmapController.submitRoadmapExam);

// Roadmap by ID (must be after specific routes)
router.get('/:id/modules',  roadmapController.getRoadmapModules);
router.get('/:id',          optionalToken, roadmapController.getRoadmapById);

module.exports = router;
