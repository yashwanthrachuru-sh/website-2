// ============================================================
// backend/routes/resumeRoutes.js
// REST Routes for AI Resume Builder & ATS Scanner
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const resumeController = require('../controllers/resumeController');

// Authenticated routes
router.get('/', verifyToken, resumeController.getResume);
router.post('/save', verifyToken, resumeController.saveResume);
router.put('/update', verifyToken, resumeController.updateResume);
router.delete('/:id', verifyToken, resumeController.deleteResume);
router.post('/scan', verifyToken, resumeController.scanResume);
router.post('/download', verifyToken, resumeController.downloadResume);
router.post('/template', verifyToken, resumeController.changeTemplate);
router.get('/history', verifyToken, resumeController.getHistory);
router.post('/ai/improve', verifyToken, resumeController.improveResume);

// Public route for developer portfolio loading
router.get('/public/:username', resumeController.getPublicResume);

module.exports = router;
