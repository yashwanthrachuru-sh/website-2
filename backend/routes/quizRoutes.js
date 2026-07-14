// ============================================================
// routes/quizRoutes.js — Routes for redesigned quiz system
// ============================================================
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

// Redesigned Quiz System Routes
router.get('/topic/:lessonId', quizController.getTopicQuiz);
router.post('/topic/:lessonId/submit', quizController.submitTopicQuiz);

router.get('/level/:roadmapId/:level', quizController.getLevelAssessment);
router.post('/level/:roadmapId/:level/submit', quizController.submitLevelAssessment);

router.get('/final/:roadmapId', quizController.getCertificationExam);
router.post('/final/:roadmapId/submit', quizController.submitCertificationExam);

router.get('/session/:type/:targetId', quizController.getSessionState);
router.post('/session/:type/:targetId/save', quizController.saveSessionState);

// Compatibility Routes
router.get('/', quizController.getQuizzes);
router.get('/history', quizController.getHistory);
router.get('/:id/questions', quizController.getQuestions);
router.post('/:id/submit', quizController.submitResult);

module.exports = router;
