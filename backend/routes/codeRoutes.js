// ============================================================
// routes/codeRoutes.js — CodeLabs Compiler & Templates Routing
// ============================================================
const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');
const { verifyToken } = require('../middleware/authMiddleware');

// Secure all CodeLabs routes with token verification
router.use(verifyToken);

// Templates & Problems listings
router.get('/', codeController.getCodeOverview);
router.get('/templates', codeController.getTemplates);
router.get('/problems', codeController.getProblems);

// Code workspace actions
router.post('/save', codeController.saveUserProgram);
router.get('/saved', codeController.getSavedPrograms);
router.post('/run', codeController.runSandboxCode);
router.post('/submit', codeController.submitChallengeCode);
router.get('/history', codeController.getSubmissionHistory);

module.exports = router;
