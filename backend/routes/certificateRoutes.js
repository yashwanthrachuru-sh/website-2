// ============================================================
// backend/routes/certificateRoutes.js
// EduNet — API Routes for Certificates
// ============================================================
'use strict';

const express = require('express');
const router  = express.Router();
const roadmapController = require('../controllers/roadmapController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, roadmapController.getUserCertificates);
router.get('/verify/:hash', roadmapController.verifyCertificate);

module.exports = router;
