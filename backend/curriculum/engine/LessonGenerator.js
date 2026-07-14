// ============================================================
// backend/curriculum/engine/LessonGenerator.js
// EduNet Curriculum-Driven Educational Engine — LessonGenerator
// ============================================================
'use strict';

const { getConceptContent } = require('./ConceptContentEngine');

const STRUCTURED_OPEN  = '<!--EDUNET_STRUCTURED_V1-->';
const STRUCTURED_CLOSE = '<!--/EDUNET_STRUCTURED_V1-->';
const SO = (n) => `<!--SECTION:${n}-->`;
const SC = (n) => `<!--/SECTION:${n}-->`;

const LESSON_SECTIONS = [
  'definition', 'why_exists', 'importance', 'learning_objectives',
  'beginner_explanation', 'detailed_concept', 'internal_working',
  'syntax_breakdown', 'visual_flow', 'real_world_analogies',
  'beginner_example', 'intermediate_example', 'advanced_example',
  'production_example', 'line_by_line', 'common_mistakes',
  'best_practices', 'performance', 'interview_questions',
  'faqs', 'mcqs', 'coding_practice', 'debugging_exercises',
  'project_ideas', 'summary', 'key_takeaways', 'related_topics',
  'next_learning_path',
  // Visual Elements
  'memoryDiagram', 'executionStepper', 'checkpointQuestions', 'gradualCode'
];

/**
 * Compiles a lesson definition into the database serialization format
 * by loading its 12 JSON components from the curriculum folder.
 */
function generateLessonContent(lessonMeta, rawLanguage) {
  const title = lessonMeta.title || lessonMeta.name || '';
  const moduleName = lessonMeta.module || '';
  const lang = (rawLanguage || lessonMeta.language || 'python').toLowerCase();
  const roadmapId = lessonMeta.roadmapId || lessonMeta.roadmap || 'python';

  // Load compiled sections from JSON files via the engine
  const resolved = getConceptContent(title, moduleName, lang, roadmapId);
  if (!resolved || !resolved.content) {
    throw new Error(`Curriculum content not found for lesson: "${title}" inside "${moduleName}"`);
  }

  const s = resolved.content;

  // Assemble into final structured notes string with comments markers
  const parts = [STRUCTURED_OPEN];
  for (const key of LESSON_SECTIONS) {
    if (s[key] !== undefined && s[key] !== null) {
      parts.push(SO(key));
      parts.push(String(s[key]).trim());
      parts.push(SC(key));
    }
  }
  parts.push(STRUCTURED_CLOSE);
  return parts.join('\n');
}

/**
 * Returns a fully parsed lesson structure.
 */
function generateLesson(lessonMeta) {
  const contentStr = generateLessonContent(lessonMeta, lessonMeta.language);
  const parsed = {};
  const sectionPattern = /<!--SECTION:(\w+)-->([\s\S]*?)<!--\/SECTION:\1-->/g;
  let match;
  while ((match = sectionPattern.exec(contentStr)) !== null) {
    parsed[match[1]] = match[2].trim();
  }
  return {
    ...lessonMeta,
    ...parsed,
    structured_content: parsed
  };
}

module.exports = {
  generateLesson,
  generateLessonContent,
  LESSON_SECTIONS
};
