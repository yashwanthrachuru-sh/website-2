// ============================================================
// controllers/quizController.js — API for Assessments & Exams
// ============================================================
const quizModel = require('../models/quizModel');

// GET /api/quiz
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await quizModel.getAllQuizzes();
    res.json({ success: true, quizzes });
  } catch (err) {
    console.error('Fetch quizzes error:', err);
    res.status(500).json({ success: false, message: 'Server error while listing quizzes.' });
  }
};

// GET /api/quiz/:id/questions
const getQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await quizModel.getQuizById(id);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Quiz test not found.' });
    }

    const questions = await quizModel.getQuestionsByQuizId(id);
    res.json({ success: true, quiz: test, questions });
  } catch (err) {
    console.error('Fetch questions error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching questions.' });
  }
};

// POST /api/quiz/:id/submit
const submitResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, totalQuestions, correctAnswers, feedback } = req.body;
    const userId = req.user.id; // from token verify

    const test = await quizModel.getQuizById(id);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Quiz test not found.' });
    }

    const resultId = await quizModel.createResult({
      user_id: userId,
      test_id: id,
      score: score || 0,
      total_questions: totalQuestions || 0,
      correct_answers: correctAnswers || 0,
      feedback: feedback || `Scored ${correctAnswers}/${totalQuestions}`
    });

    res.status(201).json({
      success: true,
      message: 'Quiz results saved successfully.',
      resultId
    });
  } catch (err) {
    console.error('Save quiz result error:', err);
    res.status(500).json({ success: false, message: 'Server error while saving score.' });
  }
};

// GET /api/quiz/history
const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await quizModel.getResultsByUserId(userId);
    res.json({ success: true, history });
  } catch (err) {
    console.error('Fetch history error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching score logs.' });
  }
};

module.exports = {
  getQuizzes,
  getQuestions,
  submitResult,
  getHistory
};
