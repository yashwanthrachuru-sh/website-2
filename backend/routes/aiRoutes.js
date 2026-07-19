// ============================================================
// backend/routes/aiRoutes.js
// EduNet — AI Mentor API Routes (Provider-Agnostic, Offline-First)
// ============================================================
'use strict';

const express      = require('express');
const router       = express.Router();
const aiController = require('../controllers/aiController');
const { verifyToken } = require('../middleware/authMiddleware');

// ── Core AI Mentor (handles all modes) ─────────────────────────
router.post('/mentor',     verifyToken, aiController.aiMentor);
router.post('/flashcards', verifyToken, aiController.generateFlashcards);

// ── Chat history ────────────────────────────────────────────────
router.get('/history/:lessonId', verifyToken, aiController.getChatHistory);

// ── User context (XP, rank, completed lessons, weak/strong topics)
router.get('/user-context', verifyToken, aiController.getUserContext);

module.exports = router;
