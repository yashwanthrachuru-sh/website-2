// ============================================================
// routes/videoRoutes.js — YouTube Video Routes
// ============================================================
'use strict';

const express = require('express');
const router  = express.Router();
const {
  getVideos, adminGetVideos, createVideo, updateVideo,
  deleteVideo, pinVideo, toggleVideoStatus, getCategories
} = require('../controllers/videoController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// ── Public / User Routes ─────────────────────────────────────
// GET /api/videos?category=DSA&search=arrays&limit=20 — public
router.get('/', getVideos);

// GET /api/videos/categories — public
router.get('/categories', getCategories);

// ── Admin Routes ─────────────────────────────────────────────
// GET  /api/videos/admin
router.get('/admin',          verifyToken, requireAdmin, adminGetVideos);

// POST /api/videos/admin  — add new video
router.post('/admin',         verifyToken, requireAdmin, createVideo);

// PUT  /api/videos/admin/:id — update video
router.put('/admin/:id',      verifyToken, requireAdmin, updateVideo);

// DELETE /api/videos/admin/:id — delete video
router.delete('/admin/:id',   verifyToken, requireAdmin, deleteVideo);

// PUT /api/videos/admin/:id/pin — toggle pin
router.put('/admin/:id/pin',  verifyToken, requireAdmin, pinVideo);

// PUT /api/videos/admin/:id/status — toggle active/inactive
router.put('/admin/:id/status', verifyToken, requireAdmin, toggleVideoStatus);

module.exports = router;
