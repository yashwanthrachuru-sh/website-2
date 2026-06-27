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
router.get('/roadmaps', userController.getRoadmaps);
router.get('/roadmaps/:id', userController.getRoadmapDetail);

// Progress tracking endpoints
router.get('/progress/:track', userController.getTrackProgress);
router.post('/progress/:track', userController.updateTrackProgress);

// Leaderboard route
router.get('/leaderboard', userController.getLeaderboard);

module.exports = router;
