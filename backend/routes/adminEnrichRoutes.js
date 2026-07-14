// ============================================================
// backend/routes/adminEnrichRoutes.js
// EduNet — Admin Content Enrichment API Routes
// ============================================================
'use strict';

const express = require('express');
const router  = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const enrichmentRunner = require('../services/lessonEnrichmentRunner');

// All routes require admin authentication
router.use(verifyToken, requireAdmin);

// GET /api/admin/enrich/status
// Returns current enrichment progress
router.get('/status', (req, res) => {
  const status = enrichmentRunner.getEnrichmentStatus();
  res.json({ success: true, status });
});

// POST /api/admin/enrich/lessons
// Trigger bulk lesson enrichment
router.post('/lessons', async (req, res) => {
  const status = enrichmentRunner.getEnrichmentStatus();
  if (status.running) {
    return res.status(409).json({
      success: false,
      message: 'Enrichment is already running.',
      status
    });
  }

  const { force = false, batchSize = 10, minContentLength = 500 } = req.body;

  // Run asynchronously — don't block the response
  enrichmentRunner.enrichAllLessons({ force, batchSize, minContentLength })
    .then(result => console.log('[AdminEnrich] Lesson enrichment complete:', result))
    .catch(err  => console.error('[AdminEnrich] Lesson enrichment error:', err.message));

  res.json({
    success: true,
    message: 'Lesson enrichment started in background.',
    options: { force, batchSize, minContentLength }
  });
});

// POST /api/admin/enrich/tools
// Trigger bulk AI tool guide enrichment
router.post('/tools', async (req, res) => {
  const { force = false } = req.body;

  enrichmentRunner.enrichAllTools({ force })
    .then(result => console.log('[AdminEnrich] Tool enrichment complete:', result))
    .catch(err  => console.error('[AdminEnrich] Tool enrichment error:', err.message));

  res.json({
    success: true,
    message: 'Tool enrichment started in background.',
    options: { force }
  });
});

// POST /api/admin/enrich/quizzes
// Trigger bulk quiz explanation enrichment
router.post('/quizzes', async (req, res) => {
  const { minLength = 50, force = false } = req.body;

  enrichmentRunner.enrichQuizExplanations({ minLength, force })
    .then(result => console.log('[AdminEnrich] Quiz enrichment complete:', result))
    .catch(err  => console.error('[AdminEnrich] Quiz enrichment error:', err.message));

  res.json({
    success: true,
    message: 'Quiz explanation enrichment started in background.',
    options: { minLength, force }
  });
});

// POST /api/admin/enrich/all
// Run all enrichment tasks
router.post('/all', async (req, res) => {
  const { force = false } = req.body;

  enrichmentRunner.runEnrichment({ force })
    .then(results => console.log('[AdminEnrich] Full enrichment complete:', results))
    .catch(err   => console.error('[AdminEnrich] Full enrichment error:', err.message));

  res.json({
    success: true,
    message: 'Full content enrichment started in background (lessons + tools + quizzes).',
    options: { force }
  });
});

module.exports = router;
