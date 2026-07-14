// ============================================================
// routes/toolsRoutes.js — Public AI Tools Routes
// ============================================================

const express = require('express');
const router = express.Router();
const toolsController = require('../controllers/toolsController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public route: list approved tools
router.get('/', toolsController.getApprovedTools);

// Public route: single AI tool with full learning guide
router.get('/:id', toolsController.getToolById);

// Secured user routes: bookmarks, ratings, reviews, launches
router.post('/:id/bookmark', verifyToken, toolsController.toggleBookmark);
router.post('/:id/rate', verifyToken, toolsController.rateTool);
router.post('/:id/reviews', verifyToken, toolsController.submitReview);
router.get('/:id/reviews', toolsController.getReviews);
router.post('/:id/launch', verifyToken, toolsController.logLaunchUsage);

module.exports = router;
