// ============================================================
// backend/routes/challengeRoutes.js
// REST Routes for Coding Challenges and Playground compiler
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const challengeController = require('../controllers/challengeController');
const runnerController = require('../controllers/runnerController');

// All endpoints require session authentication
router.get('/daily', verifyToken, challengeController.getDaily);
router.get('/recommended', verifyToken, challengeController.getRecommended);
router.post('/submit', verifyToken, challengeController.submitSolution);
router.post('/save', verifyToken, challengeController.saveDraft);
router.get('/history', verifyToken, challengeController.getHistory);
router.post('/bookmark', verifyToken, challengeController.bookmarkChallenge);
router.post('/run', verifyToken, runnerController.runPlaygroundCode);
router.get('/:id', verifyToken, challengeController.getById);

module.exports = router;
