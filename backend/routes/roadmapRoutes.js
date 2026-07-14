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

// ── Level Assessment routes ────────────────────────────────────
router.get('/:id/level/:level/exam',         optionalToken, roadmapController.getLevelAssessment);
router.post('/:id/level/:level/exam/submit', verifyToken,   roadmapController.submitLevelAssessment);

// Roadmap exam routes (Certification)
router.get('/:id/exam',          optionalToken, roadmapController.getRoadmapExam);
router.post('/:id/exam/submit',  verifyToken, roadmapController.submitRoadmapExam);

// Quiz session save/resume
router.post('/quiz-session/save',   verifyToken, roadmapController.saveQuizSession);
router.get('/quiz-session/:type/:targetId', verifyToken, roadmapController.getQuizSession);

// Roadmap by ID (must be after specific routes)
router.get('/:id/modules',  roadmapController.getRoadmapModules);
router.get('/:id',          optionalToken, roadmapController.getRoadmapById);

module.exports = router;
