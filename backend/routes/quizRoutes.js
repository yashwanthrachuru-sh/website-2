const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', quizController.getQuizzes);
router.get('/history', quizController.getHistory);
router.get('/:id/questions', quizController.getQuestions);
router.post('/:id/submit', quizController.submitResult);

module.exports = router;
