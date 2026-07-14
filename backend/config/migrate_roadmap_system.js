// ============================================================
// backend/config/migrate_roadmap_system.js
// Migration for complete roadmap quiz/assessment/certification system
// Tables: topic_quiz_attempts, level_assessments, certification_attempts
// Also ensures level_progress and quiz_sessions exist (idempotent)
// ============================================================
'use strict';

const db = require('./db');

async function migrate() {
  console.log('🏁 Starting Roadmap System database migration...');

  try {
    // ── 1. topic_quiz_attempts ─────────────────────────────────
    await db.query(`
      CREATE TABLE IF NOT EXISTS topic_quiz_attempts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        lesson_id INT NOT NULL,
        score INT NOT NULL DEFAULT 0,
        correct_count INT NOT NULL DEFAULT 0,
        total_questions INT NOT NULL DEFAULT 0,
        passed TINYINT(1) NOT NULL DEFAULT 0,
        answers TEXT,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (lesson_id) REFERENCES module_lessons(id) ON DELETE CASCADE,
        KEY idx_user_lesson (user_id, lesson_id),
        KEY idx_lesson (lesson_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `topic_quiz_attempts` checked/created.');

    // ── 2. level_assessments ───────────────────────────────────
    await db.query(`
      CREATE TABLE IF NOT EXISTS level_assessments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        roadmap_id VARCHAR(50) NOT NULL,
        level VARCHAR(20) NOT NULL,
        score INT NOT NULL DEFAULT 0,
        correct_count INT NOT NULL DEFAULT 0,
        total_questions INT NOT NULL DEFAULT 0,
        passed TINYINT(1) NOT NULL DEFAULT 0,
        time_taken INT DEFAULT 0,
        answers TEXT,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        KEY idx_user_roadmap_level (user_id, roadmap_id, level)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `level_assessments` checked/created.');

    // ── 3. certification_attempts ──────────────────────────────
    await db.query(`
      CREATE TABLE IF NOT EXISTS certification_attempts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        roadmap_id VARCHAR(50) NOT NULL,
        score INT NOT NULL DEFAULT 0,
        correct_count INT NOT NULL DEFAULT 0,
        total_questions INT NOT NULL DEFAULT 0,
        passed TINYINT(1) NOT NULL DEFAULT 0,
        time_taken INT DEFAULT 0,
        answers TEXT,
        certificate_hash VARCHAR(100),
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        KEY idx_user_roadmap (user_id, roadmap_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `certification_attempts` checked/created.');

    // ── 4. Ensure level_progress exists ──────────────────────
    await db.query(`
      CREATE TABLE IF NOT EXISTS level_progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        roadmap_id VARCHAR(50) NOT NULL,
        level VARCHAR(20) NOT NULL,
        passed TINYINT(1) DEFAULT 0,
        score INT DEFAULT 0,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY uq_user_roadmap_level (user_id, roadmap_id, level)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `level_progress` checked/created.');

    // ── 5. Ensure quiz_sessions exists ────────────────────────
    await db.query(`
      CREATE TABLE IF NOT EXISTS quiz_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(30) NOT NULL,
        target_id VARCHAR(50) NOT NULL,
        questions TEXT NOT NULL,
        answers TEXT NOT NULL,
        time_left INT DEFAULT 0,
        bookmarks TEXT,
        completed TINYINT(1) DEFAULT 0,
        score INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY uq_user_quiz_session (user_id, type, target_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `quiz_sessions` checked/created.');

    // ── 6. Add lesson_id column to lesson_quizzes if missing ──
    const [quizCols] = await db.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'lesson_quizzes'
      AND COLUMN_NAME = 'lesson_id'
    `);
    if (!quizCols.length) {
      await db.query(`
        ALTER TABLE lesson_quizzes
        ADD COLUMN lesson_id INT NULL DEFAULT NULL AFTER id,
        ADD KEY idx_lesson_id (lesson_id)
      `);
      // Backfill: derive lesson_id from module_id (use first lesson in module)
      await db.query(`
        UPDATE lesson_quizzes lq
        JOIN (
          SELECT ml.id AS lesson_id, ml.module_id
          FROM module_lessons ml
          WHERE ml.order_index = (
            SELECT MIN(order_index) FROM module_lessons WHERE module_id = ml.module_id
          )
        ) first_lesson ON lq.module_id = first_lesson.module_id
        SET lq.lesson_id = first_lesson.lesson_id
        WHERE lq.lesson_id IS NULL
      `);
      console.log('   ✓ Added and backfilled `lesson_id` in `lesson_quizzes`.');
    } else {
      console.log('   ✓ Column `lesson_id` already exists in `lesson_quizzes`.');
    }

    // ── 7. Ensure `level` column in roadmap_modules ───────────
    const [modCols] = await db.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'roadmap_modules'
      AND COLUMN_NAME = 'level'
    `);
    if (!modCols.length) {
      await db.query(`
        ALTER TABLE roadmap_modules
        ADD COLUMN level VARCHAR(20) NOT NULL DEFAULT 'beginner'
      `);
      console.log('   ✓ Added `level` column to `roadmap_modules`.');
    } else {
      console.log('   ✓ Column `level` already exists in `roadmap_modules`.');
    }

    // ── 8. Backfill module levels dynamically ─────────────────
    const [roadmaps] = await db.query('SELECT id FROM roadmaps');
    for (const rm of roadmaps) {
      const [modules] = await db.query(
        'SELECT id FROM roadmap_modules WHERE roadmap_id = ? ORDER BY order_index ASC',
        [rm.id]
      );
      const total = modules.length;
      if (!total) continue;
      for (let idx = 0; idx < total; idx++) {
        const levelIdx = Math.floor((idx / total) * 3);
        const level = levelIdx === 0 ? 'beginner' : levelIdx === 1 ? 'intermediate' : 'expert';
        await db.query(
          'UPDATE roadmap_modules SET level = ? WHERE id = ?',
          [level, modules[idx].id]
        );
      }
    }
    console.log('   ✓ Backfilled levels for all roadmap modules.');

    console.log('✅ Roadmap System migration completed successfully.');
  } catch (err) {
    console.error('❌ Roadmap System migration failed:', err.message);
    throw err;
  }
}

module.exports = { migrate };

if (require.main === module) {
  migrate().then(() => {
    process.exit(0);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
