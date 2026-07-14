"// ============================================================
// backend/curriculum/engine/LessonGenerator.js
// EduNet Curriculum-Driven Educational Engine — Lesson Composer
// Converts rich curriculum JSON lesson definitions into the
// full EDUNET_STRUCTURED_V1 format (26+ educational sections).
// ============================================================
'use strict';

const STRUCTURED_OPEN  = '<!--EDUNET_STRUCTURED_V1-->';
const STRUCTURED_CLOSE = '<!--/EDUNET_STRUCTURED_V1-->';
const SO = (n) => `<!--SECTION:${n}-->`;
const SC = (n) => `<!--/SECTION:${n}-->`;

const LESSON_SECTIONS = [
  'definition','why_exists','importance','learning_objectives',
  'beginner_explanation','detailed_concept','internal_working',
  'syntax_breakdown','visual_flow','real_world_analogies',
  'beginner_example','intermediate_example','advanced_example',
  'production_example','line_by_line','common_mistakes',
  'best_practices','performance','interview_questions',
  'faqs','mcqs','coding_practice','debugging_exercises',
  'project_ideas','summary','key_takeaways','related_topics',
  'next_learning_path','memoryDiagram','executionStepper',
  'checkpointQuestions','gradualCode'
];

// ── Serializer ─────────────────────────────────────────────────
function serialize(sections) {
  const parts = [STRUCTURED_OPEN];
  for (const key of LESSON_SECTIONS) {
    const val = sections[key];
    if (val !== undefined && val !== null && String(val).trim().length > 0) {
      parts.push(SO(key));
      parts.push(String(val).trim());
      parts.push(SC(key));
    }
  }
  parts.push(STRUCTURED_CLOSE);
  return parts.join('\
');
}

// ── Code fence helper ──────────────────────────────────────────
function fence(lang, code) {
  return `\`\`\`${lang || 'javascript'}\
${String(code || '').trim()}\
\`\`
<truncated 25386 bytes>