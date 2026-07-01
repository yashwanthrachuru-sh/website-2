// ============================================================
// backend/routes/resumeRoutes.js
// REST Routes for AI Resume Builder & ATS Scanner
// ============================================================
'use strict';

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../middleware/authMiddleware');
const resumeController = require('../controllers/resumeController');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

const saveRules = [
  body('title').trim().notEmpty().withMessage('Resume title is required.').isLength({ max: 150 }).withMessage('Title too long.'),
  body('template').optional().trim().isIn(['classic', 'modern', 'creative', 'minimalist']).withMessage('Invalid resume template.'),
  body('personal_info').optional().isObject().withMessage('personal_info must be an object.'),
  body('personal_info.email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Invalid personal email in info.'),
  validate
];

const updateRules = [
  body('id').notEmpty().withMessage('Resume ID is required.').isInt().withMessage('Invalid Resume ID.'),
  body('title').optional().trim().isLength({ max: 150 }).withMessage('Title too long.'),
  body('template').optional().trim().isIn(['classic', 'modern', 'creative', 'minimalist']).withMessage('Invalid resume template.'),
  body('personal_info').optional().isObject().withMessage('personal_info must be an object.'),
  body('personal_info.email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Invalid personal email in info.'),
  validate
];

const scanRules = [
  body('id').notEmpty().withMessage('Resume ID is required.').isInt().withMessage('Invalid Resume ID.'),
  body('job_description').trim().notEmpty().withMessage('Job description is required.'),
  validate
];

const downloadRules = [
  body('id').notEmpty().withMessage('Resume ID is required.').isInt().withMessage('Invalid Resume ID.'),
  body('format').optional().trim().isIn(['pdf', 'txt', 'docx', 'html']).withMessage('Invalid format.'),
  validate
];

const templateRules = [
  body('id').notEmpty().withMessage('Resume ID is required.').isInt().withMessage('Invalid Resume ID.'),
  body('template').trim().notEmpty().isIn(['classic', 'modern', 'creative', 'minimalist']).withMessage('Invalid resume template.'),
  validate
];

const improveRules = [
  body('content').trim().notEmpty().withMessage('Content is required.'),
  validate
];

// Authenticated routes
router.get('/', verifyToken, resumeController.getResume);
router.post('/save', verifyToken, saveRules, resumeController.saveResume);
router.put('/update', verifyToken, updateRules, resumeController.updateResume);
router.delete('/:id', verifyToken, resumeController.deleteResume);
router.post('/scan', verifyToken, scanRules, resumeController.scanResume);
router.post('/download', verifyToken, downloadRules, resumeController.downloadResume);
router.post('/template', verifyToken, templateRules, resumeController.changeTemplate);
router.get('/history', verifyToken, resumeController.getHistory);
router.post('/ai/improve', verifyToken, improveRules, resumeController.improveResume);

// Public route for developer portfolio loading
router.get('/public/:username', resumeController.getPublicResume);

module.exports = router;
