// ============================================================
// backend/routes/aiRoutes.js
// EduNet — AI Mentor API Routes (Context-aware, no API key required)
// ============================================================
'use strict';

const express = require('express');
const router  = express.Router();
const aiController = require('../controllers/aiController');
const { verifyToken, optionalToken } = require('../middleware/authMiddleware');

// AI mentor — requires auth so we know the student's context
router.post('/mentor',     verifyToken, aiController.aiMentor);
router.post('/flashcards', verifyToken, aiController.generateFlashcards);
router.get('/history/:lessonId', verifyToken, aiController.getChatHistory);

module.exports = router;
