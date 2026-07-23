// ============================================================
// backend/routes/lessonRoutes.js
// EduNet — API Routes for Lesson-level content and progress
// ============================================================
'use strict';

const express = require('express');
const router  = express.Router();
const roadmapController = require('../controllers/roadmapController');
const { verifyToken, optionalToken } = require('../middleware/authMiddleware');

// Lesson detail and resource fetching
router.get('/:id',            optionalToken, roadmapController.getLessonDetail);
router.get('/:id/videos',     roadmapController.getLessonVideos);
router.get('/:id/resources',  roadmapController.getLessonResources);
router.get('/:id/exercises',  roadmapController.getLessonExercises);

// Topic Quiz — randomized 10-15 questions
router.get('/:id/quiz',       optionalToken, roadmapController.getLessonTopicQuiz);
router.post('/:id/quiz/submit', verifyToken, roadmapController.submitLessonTopicQuiz);

// Legacy quiz list endpoint (kept for compatibility)
router.get('/:id/quizzes',    roadmapController.getLessonQuizzes);

// Lesson progress
router.post('/:id/progress',       verifyToken, roadmapController.completeLesson);
router.post('/:id/stage-progress', verifyToken, roadmapController.saveLessonStageProgress);

// Lesson notes
router.post('/:id/notes',     verifyToken,   roadmapController.saveLessonNote);
router.get('/:id/notes',      verifyToken,   roadmapController.getLessonNote);

module.exports = router;
