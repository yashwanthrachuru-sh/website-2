// ============================================================
// routes/progressRoutes.js — Quiz & Performance Routing
// ============================================================
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { verifyToken } = require('../middleware/authMiddleware');

// Secure all endpoints with token validation
router.use(verifyToken);

// Quiz assessment routes
router.get('/quiz', quizController.getQuizzes);
router.get('/quiz/:id/questions', quizController.getQuestions);
router.post('/quiz/:id/submit', quizController.submitResult);
router.get('/quiz/history', quizController.getHistory);

module.exports = router;
