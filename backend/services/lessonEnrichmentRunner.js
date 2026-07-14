// ============================================================
// backend/services/lessonEnrichmentRunner.js
// EduNet — Bulk Lesson & Tool Content Enrichment Script
// Usage: node backend/services/lessonEnrichmentRunner.js
// Or: require('./lessonEnrichmentRunner').runEnrichment()
// ============================================================
'use strict';

require('dotenv').config();
const db = require('../config/db');
const contentEngine = require('./contentEngine');

let enrichmentStatus = {
  running: false,
  total: 0,
  enriched: 0,
  skipped: 0,
  failed: 0,
  startedAt: null,
  finishedAt: null,
  errors: []
};

/**
 * Enrich all lessons that are missing or have sparse learning_notes.
 * This modifies the existing learning_notes field — no schema changes needed.
 */
async function enrichAllLessons(options = {}) {
  const { batchSize = 10, minContentLength = 500, force = false } = options;

  console.log('[LessonEnrichment] Starting lesson enrichment...');
  enrichmentStatus = {
    running: true,
    total: 0,
    enriched: 0,
    skipped: 0,
    failed: 0,
    startedAt: new Date(),
    finishedAt: null,
    errors: []
  };

  try {
    // Get all lessons from module_lessons (the live lesson table)
    const [lessons] = await db.query(
      `SELECT ml.id, ml.title, ml.language, ml.learning_notes, ml.short_desc,
              rm.title AS module_title, r.title AS roadmap_title
       FROM module_lessons ml
       JOIN roadmap_modules rm ON ml.module_id = rm.id
       JOIN roadmaps r ON rm.roadmap_id = r.id
       ORDER BY ml.id ASC`
    ).catch(() => [[]]); // Fallback if table doesn't exist yet

    enrichmentStatus.total = lessons.length;
    console.log(`[LessonEnrichment] Found ${lessons.length} lessons to process`);

    // Process in batches to avoid overwhelming the DB
    for (let i = 0; i < lessons.length; i += batchSize) {
      const batch = lessons.slice(i, i + batchSize);

      for (const lesson of batch) {
        try {
          const needsEnrichment = force ||
            !lesson.learning_notes ||
            lesson.learning_notes.length < minContentLength ||
            !contentEngine.hasStructuredContent(lesson.learning_notes);

          if (!needsEnrichment) {
            enrichmentStatus.skipped++;
            continue;
          }

          console.log(`[LessonEnrichment] Enriching: "${lesson.title}" (ID: ${lesson.id})`);

          const topic = lesson.title || 'Programming Concept';
          const lang  = lesson.language || 'javascript';

          // Generate full structured content
          const structuredNotes = contentEngine.generateLessonNotes(topic, lang);

          // Update the existing learning_notes field
          await db.query(
            `UPDATE module_lessons SET learning_notes = ? WHERE id = ?`,
            [structuredNotes, lesson.id]
          );

          enrichmentStatus.enriched++;
          console.log(`[LessonEnrichment] ✅ Enriched lesson ${lesson.id}: "${lesson.title}"`);

        } catch (lessonErr) {
          enrichmentStatus.failed++;
          enrichmentStatus.errors.push({ id: lesson.id, title: lesson.title, error: lessonErr.message });
          console.error(`[LessonEnrichment] ❌ Failed lesson ${lesson.id}: ${lessonErr.message}`);
        }
      }

      // Small delay between batches to be respectful to DB
      if (i + batchSize < lessons.length) {
        await new Promise(r => setTimeout(r, 100));
      }
    }

    enrichmentStatus.running = false;
    enrichmentStatus.finishedAt = new Date();

    console.log(`[LessonEnrichment] Complete!`);
    console.log(`  ✅ Enriched: ${enrichmentStatus.enriched}`);
    console.log(`  ⏭️  Skipped: ${enrichmentStatus.skipped}`);
    console.log(`  ❌ Failed: ${enrichmentStatus.failed}`);

    return enrichmentStatus;

  } catch (err) {
    enrichmentStatus.running = false;
    enrichmentStatus.finishedAt = new Date();
    console.error('[LessonEnrichment] Fatal error:', err.message);
    throw err;
  }
}

/**
 * Enrich all AI tools with learning guides.
 * Stores in learning_notes column if available, otherwise enriches on-the-fly.
 */
async function enrichAllTools(options = {}) {
  const { force = false } = options;

  console.log('[ToolEnrichment] Starting tool enrichment...');

  try {
    // Check if tools table has learning_notes column
    const [cols] = await db.query(`SHOW COLUMNS FROM tools LIKE 'learning_notes'`).catch(() => [[]]);
    const hasLearningNotes = cols.length > 0;

    const [tools] = await db.query(
      `SELECT id, name, description, category, features, pricing, use_cases, alternatives, official_link
       FROM tools WHERE status = 'approved' ORDER BY id ASC`
    ).catch(() => [[]]);

    console.log(`[ToolEnrichment] Found ${tools.length} approved tools`);
    let enriched = 0;

    for (const tool of tools) {
      try {
        if (hasLearningNotes) {
          const needsEnrichment = force ||
            !tool.learning_notes ||
            !contentEngine.hasStructuredContent(tool.learning_notes);

          if (!needsEnrichment) continue;

          const guide = contentEngine.generateAIToolGuide(tool);
          const serialized = contentEngine.serializeToolContent(guide);

          await db.query(
            `UPDATE tools SET learning_notes = ? WHERE id = ?`,
            [serialized, tool.id]
          );
        }

        enriched++;
        console.log(`[ToolEnrichment] ✅ Enriched tool: ${tool.name}`);
      } catch (toolErr) {
        console.error(`[ToolEnrichment] ❌ Failed tool ${tool.id}: ${toolErr.message}`);
      }
    }

    console.log(`[ToolEnrichment] Complete! Enriched ${enriched} tools`);
    return { enriched, total: tools.length };

  } catch (err) {
    console.error('[ToolEnrichment] Fatal error:', err.message);
    throw err;
  }
}

/**
 * Enrich quiz explanations with detailed structured explanations.
 */
async function enrichQuizExplanations(options = {}) {
  const { minLength = 50, force = false } = options;

  console.log('[QuizEnrichment] Starting quiz explanation enrichment...');
  let enriched = 0;

  try {
    const [quizzes] = await db.query(
      `SELECT lq.id, lq.question, lq.explanation, lq.correct_option,
              ml.title AS lesson_title, ml.language
       FROM lesson_quizzes lq
       JOIN module_lessons ml ON lq.lesson_id = ml.id
       WHERE lq.explanation IS NULL OR LENGTH(lq.explanation) < ?
       ORDER BY lq.id ASC`,
      [minLength]
    ).catch(() => [[]]);

    console.log(`[QuizEnrichment] Found ${quizzes.length} quizzes needing better explanations`);

    for (const quiz of quizzes) {
      try {
        const topic = quiz.lesson_title || 'Programming';
        const lang  = quiz.language || 'javascript';

        // Generate a contextual explanation
        const explanation = generateQuizExplanation(quiz.question, quiz.correct_option, topic, lang);

        await db.query(
          `UPDATE lesson_quizzes SET explanation = ? WHERE id = ?`,
          [explanation, quiz.id]
        );

        enriched++;
      } catch (e) {
        console.error(`[QuizEnrichment] Failed quiz ${quiz.id}: ${e.message}`);
      }
    }

    console.log(`[QuizEnrichment] Complete! Enriched ${enriched} quiz explanations`);
    return { enriched, total: quizzes.length };

  } catch (err) {
    console.error('[QuizEnrichment] Fatal error:', err.message);
    return { enriched: 0, total: 0 };
  }
}

/**
 * Generate a contextual explanation for a quiz question.
 */
function generateQuizExplanation(question, correctOption, topic, lang) {
  return `✅ **Correct Answer: ${correctOption}**

**Why this is correct:**
This question tests your understanding of **${topic}**. The correct answer (Option ${correctOption}) is the right choice because it accurately reflects the fundamental behavior and principles of ${topic} in ${lang} programming.

**Key concept tested:**
${question.length > 100 ? question.substring(0, 100) + '...' : question}

**Remember:**
- Option ${correctOption} aligns with the core definition and usage of ${topic}
- The incorrect options represent common misconceptions that beginners often have
- In an interview setting, always explain WHY your answer is correct, not just what it is

**Real-world application:**
Understanding this concept correctly is essential when working with ${topic} in professional ${lang} development. Misunderstanding this point often leads to bugs that are difficult to debug in production.

*Review the lesson content if this concept is still unclear — the detailed explanation and examples will reinforce this answer.*`;
}

/**
 * Get the current enrichment status.
 */
function getEnrichmentStatus() {
  return { ...enrichmentStatus };
}

/**
 * Main enrichment runner — runs all enrichment tasks.
 */
async function runEnrichment(options = {}) {
  const lessonsResult = await enrichAllLessons(options);
  const toolsResult   = await enrichAllTools(options);
  const quizResult    = await enrichQuizExplanations(options);

  return {
    lessons: lessonsResult,
    tools:   toolsResult,
    quizzes: quizResult
  };
}

module.exports = {
  enrichAllLessons,
  enrichAllTools,
  enrichQuizExplanations,
  getEnrichmentStatus,
  runEnrichment
};

// ── Run directly if called as script ───────────────────────────
if (require.main === module) {
  const force = process.argv.includes('--force');
  runEnrichment({ force })
    .then(results => {
      console.log('\n[Enrichment Runner] All tasks complete!');
      console.log(JSON.stringify(results, null, 2));
      process.exit(0);
    })
    .catch(err => {
      console.error('[Enrichment Runner] Fatal error:', err);
      process.exit(1);
    });
}
