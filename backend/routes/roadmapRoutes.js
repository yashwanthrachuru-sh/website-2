const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public routes
router.get('/', userController.getRoadmaps);

// Protected routes
router.get('/:id', verifyToken, userController.getRoadmapDetail);

module.exports = router;
