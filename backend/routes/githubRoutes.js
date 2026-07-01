// ============================================================
// backend/routes/githubRoutes.js
// REST routes for GitHub Integration
// ============================================================
'use strict';

const express      = require('express');
const router       = express.Router();
const ghCtrl       = require('../controllers/githubController');
const { verifyToken, optionalToken } = require('../middleware/authMiddleware');

// OAuth flow (callback may arrive before login session is fully present)
router.get('/connect',       verifyToken, ghCtrl.getConnectUrl);
router.get('/callback',      optionalToken, ghCtrl.handleCallback);

// Authenticated routes
router.post('/manual',       verifyToken, ghCtrl.connectManual);
router.post('/disconnect',   verifyToken, ghCtrl.disconnect);
router.get('/profile',       verifyToken, ghCtrl.getProfile);
router.get('/repos',         verifyToken, ghCtrl.getRepos);
router.post('/import',       verifyToken, ghCtrl.importRepos);
router.post('/sync',         verifyToken, ghCtrl.syncRepos);
router.get('/contributions', verifyToken, ghCtrl.getContributions);
router.post('/pin',          verifyToken, ghCtrl.pinRepo);
router.post('/hide',         verifyToken, ghCtrl.hideRepo);
router.post('/reorder',      verifyToken, ghCtrl.reorderRepos);

module.exports = router;
