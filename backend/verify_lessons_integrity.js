// ============================================================
// backend/verify_lessons_integrity.js
// Verifies that the API serves correct structured content for
// various lesson IDs, checking that all required fields are present.
// ============================================================
'use strict';

const db = require('./config/db');
const contentEngine = require('./services/contentEngine');

const REQUIRED_FRONTEND_FIELDS = [
  'definition', 'why_exists', 'importance', 'learning_objectives',
  'beginner_explanation', 'detailed_concept', 'internal_working',
  'syntax_breakdown', 'visual_flow', 'real_world_analogies',
  'beginner_example', 'intermediate_example', 'advanced_example',
  'production_example', 'line_by_line', 'common_mistakes',
  'best_practices', 'performance', 'interview_questions',
  'faqs', 'mcqs', 'coding_practice', 'debugging_exercises',
  'project_ideas', 'summary', 'key_takeaways', 'related_topics',
  'next_learning_path', 'memoryDiagram', 'executionStepper',
  'checkpointQuestions', 'gradualCode'
];

async function verify() {
  console.log('====================================================');
  console.log(' EduNet Database Lessons Integrity Checker');
  console.log('====================================================\n');

  // Fetch 10 random valid lesson IDs from database
  const [rows] = await db.query(
    `SELECT ml.id FROM module_lessons ml
     JOIN roadmap_modules rm ON ml.module_id = rm.id
     LIMIT 10`
  );
  const testIds = rows.map(r => r.id);
  
  for (const id of testIds) {
    const [[lesson]] = await db.query(
      `SELECT ml.*, rm.title AS module_title, rm.roadmap_id
       FROM module_lessons ml
       JOIN roadmap_modules rm ON ml.module_id = rm.id
       WHERE ml.id = ?`, [id]
    );
    
    if (!lesson) {
      console.log(`❌ Lesson ${id} not found in DB`);
      continue;
    }

    console.log(`Checking Lesson ${id}: "${lesson.title}" (${lesson.language || 'general'})`);
    
    // Check if learning_notes contains skeleton or is incomplete
    const isComplete = contentEngine.isContentComplete(lesson.learning_notes);
    console.log(`  - isContentComplete: ${isComplete ? '✅ TRUE' : '❌ FALSE'}`);
    
    // Enrich the lesson
    contentEngine.enrichLesson(lesson);
    const sc = lesson.structured_content;
    
    if (!sc) {
      console.log(`  ❌ No structured_content object generated`);
      continue;
    }

    const missing = [];
    const nullOrUndefined = [];
    
    for (const field of REQUIRED_FRONTEND_FIELDS) {
      if (!(field in sc)) {
        missing.push(field);
      } else if (sc[field] === null || sc[field] === undefined) {
        // memoryDiagram etc can be null, but let's check
        if (!['memoryDiagram', 'executionStepper', 'checkpointQuestions', 'gradualCode'].includes(field)) {
          nullOrUndefined.push(field);
        }
      }
    }

    if (missing.length > 0) {
      console.log(`  ❌ Missing fields: ${missing.join(', ')}`);
    }
    if (nullOrUndefined.length > 0) {
      console.log(`  ❌ Null or Undefined fields: ${nullOrUndefined.join(', ')}`);
    }
    
    if (missing.length === 0 && nullOrUndefined.length === 0) {
      console.log(`  ✅ All ${REQUIRED_FRONTEND_FIELDS.length} expected fields are present and valid.`);
      console.log(`  - definition length: ${sc.definition.length} chars`);
      console.log(`  - why_exists length: ${sc.why_exists.length} chars`);
      console.log(`  - memoryDiagram: ${sc.memoryDiagram ? 'Present (JSON)' : 'None (null)'}`);
      console.log(`  - executionStepper: ${sc.executionStepper ? 'Present (JSON)' : 'None (null)'}`);
    }
    console.log('');
  }
  
  process.exit(0);
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
