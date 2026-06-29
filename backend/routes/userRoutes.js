// ============================================================
// routes/userRoutes.js — User API Routing
// ============================================================
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// Secure all user routes with token verification
router.use(verifyToken);

// Roadmap endpoints
router.get('/roadmaps',     userController.getRoadmaps);
router.get('/roadmaps/:id', userController.getRoadmapDetail);

// Progress tracking endpoints
router.get('/progress/:track',  userController.getTrackProgress);
router.post('/progress/:track', userController.updateTrackProgress);

// Leaderboard route
router.get('/leaderboard', userController.getLeaderboard);

// Profile routes (also accessible via /api/profile — kept for compatibility)
router.get('/profile',  userController.getProfile);
router.put('/profile',  userController.updateProfile);

// XP sync — DB-backed XP endpoints (replaces localStorage-only approach)
router.get('/xp',  userController.getXP);
router.post('/xp', userController.syncXP);

module.exports = router;
