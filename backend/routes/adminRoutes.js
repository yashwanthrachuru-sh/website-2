// ============================================================
// routes/adminRoutes.js — Administrative API Routing
// ============================================================

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// Secure all admin routes with JWT and Admin guard
router.use(verifyToken, requireAdmin);

// Dashboard metrics
router.get('/stats', adminController.getStats);

// User account actions
router.get('/users', adminController.getUsers);
router.put('/users/:id/status', adminController.updateUserStatus);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Audit logging
router.get('/audit-logs', adminController.getAuditLogs);

// AI Tools directory management
router.get('/tools', adminController.getTools);
router.post('/tools', adminController.createTool);
router.put('/tools/:id', adminController.updateTool);
router.put('/tools/:id/status', adminController.updateToolStatus);
router.delete('/tools/:id', adminController.deleteTool);

// Quiz administration
router.get('/quizzes', adminController.getQuizzes);
router.post('/quizzes', adminController.createQuiz);
router.delete('/quizzes/:id', adminController.deleteQuiz);
router.get('/quizzes/:id/questions', adminController.getQuizQuestions);
router.post('/quizzes/:id/questions', adminController.addQuestion);
router.get('/scores', adminController.getScores);
router.get('/quiz-analytics', adminController.getQuizAnalytics);

// Content enrichment actions
router.use('/enrich', require('./adminEnrichRoutes'));

module.exports = router;
