// ============================================================
// backend/routes/moduleRoutes.js
// EduNet — API Routes for Modules, Bookmarks, and Certificates
// ============================================================
'use strict';

const express = require('express');
const router  = express.Router();
const roadmapController = require('../controllers/roadmapController');
const { verifyToken, optionalToken } = require('../middleware/authMiddleware');

// Module-specific routes
router.get('/:id',            optionalToken, roadmapController.getModuleDetail);
router.get('/:id/videos',     roadmapController.getModuleVideos);
router.get('/:id/resources',  roadmapController.getModuleResources);
router.get('/:id/projects',   roadmapController.getModuleProjects);
router.get('/:id/exercises',  roadmapController.getModuleExercises);
router.get('/:id/quizzes',    roadmapController.getModuleQuizzes);
router.post('/:id/progress',  verifyToken,   roadmapController.completeModule);

// Notes routes
router.post('/:id/notes',     verifyToken,   roadmapController.saveModuleNote);
router.get('/:id/notes',      verifyToken,   roadmapController.getModuleNote);

module.exports = router;
