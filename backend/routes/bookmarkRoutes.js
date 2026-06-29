// ============================================================
// backend/routes/bookmarkRoutes.js
// EduNet — API Routes for Bookmarks
// ============================================================
'use strict';

const express = require('express');
const router  = express.Router();
const roadmapController = require('../controllers/roadmapController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, roadmapController.saveBookmark);
router.get('/',  verifyToken, roadmapController.getUserBookmarks);

module.exports = router;
