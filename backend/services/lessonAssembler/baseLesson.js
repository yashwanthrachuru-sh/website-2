// ============================================================
// backend/services/lessonAssembler/baseLesson.js
// Common helper functions for handcrafted v6.1 lessons
// ============================================================
'use strict';

/**
 * Creates a baseline lesson template structure with empty fields.
 */
function createBaseLesson() {
  return {
    definition: '',
    why_exists: '',
    importance: '',
    learning_objectives: '',
    beginner_explanation: '',
    detailed_concept: '',
    internal_working: '',
    syntax_breakdown: '',
    visual_flow: '',
    real_world_analogies: '',
    beginner_example: '',
    intermediate_example: '',
    advanced_example: '',
    production_example: '',
    line_by_line: '',
    common_mistakes: '',
    best_practices: '',
    performance: '',
    interview_questions: '',
    faqs: '',
    mcqs: '',
    coding_practice: '',
    debugging_exercises: '',
    project_ideas: '',
    summary: '',
    key_takeaways: '',
    related_topics: '',
    next_learning_path: '',
    
    // Structured visual elements
    memoryDiagram: null,
    executionStepper: null,
    checkpointQuestions: null,
    gradualCode: null
  };
}

module.exports = {
  createBaseLesson
};
