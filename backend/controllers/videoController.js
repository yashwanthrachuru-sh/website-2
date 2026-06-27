// ============================================================
// controllers/videoController.js — YouTube Video Management
// ============================================================
'use strict';

const db         = require('../config/db');
const auditModel = require('../models/auditModel');

// ── Utility: Extract YouTube video ID from any URL format ────
function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// ── GET /api/videos — authenticated users, list active videos ─
const getVideos = async (req, res) => {
  try {
    const { category, search, limit } = req.query;
    let sql = 'SELECT * FROM videos WHERE status = "active"';
    const params = [];

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      sql += ' AND (title LIKE ? OR description LIKE ? OR tags LIKE ? OR instructor LIKE ?)';
      const q = `%${search}%`;
      params.push(q, q, q, q);
    }
    sql += ' ORDER BY pinned DESC, created_at DESC';
    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit, 10));
    }

    const [rows] = await db.query(sql, params);
    res.json({ success: true, videos: rows });
  } catch (err) {
    console.error('Get videos error:', err);
    res.status(500).json({ success: false, message: 'Error fetching videos.' });
  }
};

// ── GET /api/videos/admin — admin, get ALL videos ─────────────
const adminGetVideos = async (req, res) => {
  try {
    const { category, search } = req.query;
    let sql = 'SELECT * FROM videos';
    const params = [];
    const conditions = [];

    if (category && category !== 'all') {
      conditions.push('category = ?');
      params.push(category);
    }
    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ? OR tags LIKE ?)');
      const q = `%${search}%`;
      params.push(q, q, q);
    }
    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY pinned DESC, created_at DESC';

    const [rows] = await db.query(sql, params);
    res.json({ success: true, videos: rows });
  } catch (err) {
    console.error('Admin get videos error:', err);
    res.status(500).json({ success: false, message: 'Error fetching videos.' });
  }
};

// ── POST /api/videos/admin — admin, add new video ─────────────
const createVideo = async (req, res) => {
  try {
    const {
      title, youtube_url, description, category, branch,
      tags, instructor, duration, pinned
    } = req.body;

    if (!title || !youtube_url) {
      return res.status(400).json({
        success: false,
        message: 'Title and YouTube URL are required.'
      });
    }

    const video_id = extractYouTubeId(youtube_url);
    if (!video_id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL. Supported: youtube.com/watch?v=... or youtu.be/...'
      });
    }

    const thumbnail = `https://img.youtube.com/vi/${video_id}/maxresdefault.jpg`;
    const embed_url = `https://www.youtube.com/embed/${video_id}`;
    const adminId   = req.user ? req.user.id : null;

    const [result] = await db.query(
      `INSERT INTO videos
        (title, youtube_url, video_id, embed_url, thumbnail,
         description, category, branch, tags, instructor, duration, pinned, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)`,
      [
        title, youtube_url, video_id, embed_url, thumbnail,
        description || '', category || 'General', branch || null,
        tags || '', instructor || '', duration || '',
        pinned ? 1 : 0, adminId
      ]
    );

    if (req.user) {
      await auditModel.addLog(req.user.username, `Added video: "${title}" (${video_id})`);
    }

    res.status(201).json({
      success: true,
      message: 'Video added successfully.',
      id: result.insertId,
      video_id,
      thumbnail,
      embed_url
    });
  } catch (err) {
    console.error('Create video error:', err);
    res.status(500).json({ success: false, message: 'Error creating video.' });
  }
};

// ── PUT /api/videos/admin/:id — admin, update video ───────────
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT * FROM videos WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: 'Video not found.' });
    }
    const v = existing[0];

    const {
      title, youtube_url, description, category, branch,
      tags, instructor, duration, pinned, status
    } = req.body;

    let video_id = v.video_id;
    let embed_url = v.embed_url;
    let thumbnail = v.thumbnail;

    if (youtube_url && youtube_url !== v.youtube_url) {
      const newId = extractYouTubeId(youtube_url);
      if (!newId) {
        return res.status(400).json({ success: false, message: 'Invalid YouTube URL.' });
      }
      video_id  = newId;
      embed_url = `https://www.youtube.com/embed/${video_id}`;
      thumbnail = `https://img.youtube.com/vi/${video_id}/maxresdefault.jpg`;
    }

    await db.query(
      `UPDATE videos SET
        title=?, youtube_url=?, video_id=?, embed_url=?, thumbnail=?,
        description=?, category=?, branch=?, tags=?, instructor=?,
        duration=?, pinned=?, status=?
       WHERE id=?`,
      [
        title        ?? v.title,
        youtube_url  ?? v.youtube_url,
        video_id,
        embed_url,
        thumbnail,
        description  ?? v.description,
        category     ?? v.category,
        branch       ?? v.branch,
        tags         ?? v.tags,
        instructor   ?? v.instructor,
        duration     ?? v.duration,
        pinned !== undefined ? (pinned ? 1 : 0) : v.pinned,
        status       ?? v.status,
        id
      ]
    );

    if (req.user) {
      await auditModel.addLog(req.user.username, `Updated video: "${v.title}" (ID ${id})`);
    }

    res.json({ success: true, message: 'Video updated successfully.' });
  } catch (err) {
    console.error('Update video error:', err);
    res.status(500).json({ success: false, message: 'Error updating video.' });
  }
};

// ── DELETE /api/videos/admin/:id — admin, delete video ────────
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT title FROM videos WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: 'Video not found.' });
    }

    await db.query('DELETE FROM videos WHERE id = ?', [id]);

    if (req.user) {
      await auditModel.addLog(req.user.username, `Deleted video: "${existing[0].title}" (ID ${id})`);
    }

    res.json({ success: true, message: 'Video deleted successfully.' });
  } catch (err) {
    console.error('Delete video error:', err);
    res.status(500).json({ success: false, message: 'Error deleting video.' });
  }
};

// ── PUT /api/videos/admin/:id/pin — toggle pin status ─────────
const pinVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT * FROM videos WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: 'Video not found.' });
    }

    const newPin = existing[0].pinned ? 0 : 1;
    await db.query('UPDATE videos SET pinned = ? WHERE id = ?', [newPin, id]);

    res.json({
      success: true,
      pinned: newPin,
      message: `Video ${newPin ? 'pinned' : 'unpinned'} successfully.`
    });
  } catch (err) {
    console.error('Pin video error:', err);
    res.status(500).json({ success: false, message: 'Error updating pin status.' });
  }
};

// ── PUT /api/videos/admin/:id/status — toggle active/inactive ─
const toggleVideoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT * FROM videos WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: 'Video not found.' });
    }
    const newStatus = existing[0].status === 'active' ? 'inactive' : 'active';
    await db.query('UPDATE videos SET status = ? WHERE id = ?', [newStatus, id]);
    res.json({ success: true, status: newStatus, message: `Video ${newStatus}.` });
  } catch (err) {
    console.error('Toggle status error:', err);
    res.status(500).json({ success: false, message: 'Error updating status.' });
  }
};

// ── GET /api/videos/categories — distinct categories ──────────
const getCategories = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT DISTINCT category FROM videos WHERE category IS NOT NULL AND status="active" ORDER BY category'
    );
    res.json({ success: true, categories: rows.map(r => r.category) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching categories.' });
  }
};

module.exports = {
  getVideos,
  adminGetVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  pinVideo,
  toggleVideoStatus,
  getCategories
};
