// ============================================================
// backend/repairLessons.js
// EduNet Lesson Pipeline Repair Script (v1.0)
//
// PURPOSE: Finds all skeleton/stale lessons in the DB and
// regenerates them using the real lesson assemblers.
//
// SAFE TO RUN MULTIPLE TIMES: Uses isContentComplete() to skip
// lessons that are already correct.
//
// USAGE: node repairLessons.js
// ============================================================
'use strict';

require('dotenv').config();

const db           = require('./config/db');
const contentEngine = require('./services/contentEngine');
const lessonAssembler = require('./services/lessonAssembler');

// ── Stats tracking ────────────────────────────────────────────
const stats = {
  total:      0,
  complete:   0,
  repaired:   0,
  failed:     0,
  skipped:    0,
};

const failedIds = [];
const repairedIds = [];

async function repairAll() {
  console.log('====================================================');
  console.log(' EduNet Lesson Pipeline Repair Script');
  console.log(' Started:', new Date().toISOString());
  console.log('====================================================\n');

  // Load all lessons
  const [lessons] = await db.query(
    `SELECT id, title, language, learning_notes FROM module_lessons ORDER BY id ASC`
  );

  stats.total = lessons.length;
  console.log(`📊 Total lessons in database: ${stats.total}\n`);

  for (const lesson of lessons) {
    const lid = lesson.id;
    const title = lesson.title || `Lesson ${lid}`;
    const lang = lesson.language || 'javascript';

    // Check if already complete — never overwrite good content
    if (contentEngine.isContentComplete(lesson.learning_notes)) {
      stats.complete++;
      console.log(`✅ [${lid}] COMPLETE — "${title}" (skipping)`);
      continue;
    }

    // Lesson needs repair
    console.log(`🔧 [${lid}] INCOMPLETE — "${title}" (${lang}) — Regenerating...`);

    try {
      // Generate fresh content using the real assembler pipeline
      const sectionsObj = await lessonAssembler.assembleLesson(title, lang);

      // Validate generated content has real sections
      const keyCount = Object.keys(sectionsObj).filter(k => sectionsObj[k] && String(sectionsObj[k]).trim().length > 20).length;
      if (keyCount < 10) {
        console.warn(`  ⚠️  [${lid}] Generated content too sparse (only ${keyCount} non-empty fields) — skipping save`);
        stats.skipped++;
        continue;
      }

      // Serialize to learning_notes format
      const fullNotes = contentEngine.serializeLessonContent(sectionsObj);

      // Verify the serialized version passes isContentComplete
      if (!contentEngine.isContentComplete(fullNotes)) {
        console.warn(`  ⚠️  [${lid}] Regenerated content did not pass isContentComplete — skipping save`);
        stats.skipped++;
        continue;
      }

      // Save to DB
      await db.query(
        `UPDATE module_lessons SET learning_notes = ? WHERE id = ?`,
        [fullNotes, lid]
      );

      stats.repaired++;
      repairedIds.push(lid);
      console.log(`  ✅ [${lid}] Repaired successfully (${fullNotes.length} bytes, ${keyCount} sections)`);

    } catch (err) {
      stats.failed++;
      failedIds.push(lid);
      console.error(`  ❌ [${lid}] FAILED: ${err.message}`);
    }
  }

  // ── Final Report ───────────────────────────────────────────────
  console.log('\n====================================================');
  console.log(' REPAIR COMPLETE — Final Report');
  console.log('====================================================');
  console.log(`  Total lessons   : ${stats.total}`);
  console.log(`  Already complete: ${stats.complete}`);
  console.log(`  Repaired        : ${stats.repaired}`);
  console.log(`  Skipped (sparse): ${stats.skipped}`);
  console.log(`  Failed          : ${stats.failed}`);
  console.log(`  Repaired IDs    : ${repairedIds.join(', ') || 'none'}`);
  console.log(`  Failed IDs      : ${failedIds.join(', ') || 'none'}`);
  console.log('====================================================\n');

  // Verify a sample of repaired lessons
  if (repairedIds.length > 0) {
    console.log('🔍 Verification — spot-checking first 5 repaired lessons...\n');
    const sample = repairedIds.slice(0, 5);
    for (const sid of sample) {
      const [[row]] = await db.query(
        `SELECT id, title, LENGTH(learning_notes) as len FROM module_lessons WHERE id = ?`, [sid]
      );
      const [[check]] = await db.query(
        `SELECT learning_notes FROM module_lessons WHERE id = ?`, [sid]
      );
      const ok = contentEngine.isContentComplete(check.learning_notes);
      console.log(`  Lesson ${sid} ("${row?.title}"): ${ok ? '✅ PASS' : '❌ FAIL'} — ${row?.len} bytes`);
    }
  }

  process.exit(0);
}

repairAll().catch(err => {
  console.error('FATAL REPAIR ERROR:', err);
  process.exit(1);
});
