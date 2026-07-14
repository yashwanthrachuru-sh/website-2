// ============================================================
// backend/config/migrate_level_based.js
// Migration script for level-based roadmap features & quiz sessions
// ============================================================
'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const cfg = {
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'edunet',
  multipleStatements: true,
  charset: 'utf8mb4'
};

async function run() {
  console.log('🏁 Starting level-based learning database migration...');
  const conn = await mysql.createConnection(cfg);
  console.log('✅ DB Connected');

  await conn.query('SET FOREIGN_KEY_CHECKS = 0;');

  // 1. Add level column to roadmap_modules
  const [cols] = await conn.query("SHOW COLUMNS FROM `roadmap_modules` LIKE 'level'");
  if (cols.length === 0) {
    await conn.query("ALTER TABLE `roadmap_modules` ADD COLUMN `level` VARCHAR(20) NOT NULL DEFAULT 'Beginner'");
    console.log('   ✓ Added `level` column to `roadmap_modules`.');
  } else {
    console.log('   ✓ Column `level` already exists in `roadmap_modules`.');
  }

  // 2. Create level_progress table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS level_progress (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      roadmap_id VARCHAR(50) NOT NULL,
      level VARCHAR(20) NOT NULL,
      passed TINYINT(1) DEFAULT 0,
      score INT DEFAULT 0,
      attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE,
      UNIQUE KEY uq_user_roadmap_level (user_id, roadmap_id, level)
    ) ENGINE=InnoDB;
  `);
  console.log('   ✓ Created `level_progress` table.');

  // 3. Create quiz_sessions table for storing in-progress quiz state (prevent loss, resume, timer, bookmarks)
  await conn.query(`
    CREATE TABLE IF NOT EXISTS quiz_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      type VARCHAR(30) NOT NULL, -- 'topic', 'level', 'final'
      target_id VARCHAR(50) NOT NULL, -- lesson_id (for topic) or roadmap_id (for level/final)
      questions TEXT NOT NULL, -- JSON array of question IDs
      answers TEXT NOT NULL, -- JSON object of answers { qid: ans }
      time_left INT DEFAULT 0, -- remaining seconds
      bookmarks TEXT, -- JSON array of bookmarked qids
      completed TINYINT(1) DEFAULT 0,
      score INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY uq_user_quiz_session (user_id, type, target_id)
    ) ENGINE=InnoDB;
  `);
  console.log('   ✓ Created `quiz_sessions` table.');

  // 4. Update the levels of modules dynamically based on their order_index
  const [roadmaps] = await conn.query('SELECT id FROM roadmaps');
  console.log(`   ✓ Backfilling levels for modules in ${roadmaps.length} roadmaps...`);
  
  for (const rm of roadmaps) {
    const [modules] = await conn.query(
      'SELECT id FROM roadmap_modules WHERE roadmap_id = ? ORDER BY order_index ASC',
      [rm.id]
    );
    const total = modules.length;
    for (let idx = 0; idx < total; idx++) {
      const levelIdx = Math.floor((idx / total) * 3);
      const level = levelIdx === 0 ? 'Beginner' : levelIdx === 1 ? 'Intermediate' : 'Expert';
      await conn.query(
        'UPDATE roadmap_modules SET level = ? WHERE id = ?',
        [level, modules[idx].id]
      );
    }
  }
  console.log('   ✓ Backfilled levels successfully.');

  await conn.query('SET FOREIGN_KEY_CHECKS = 1;');
  await conn.end();
  console.log('✅ Level-based learning database migration completed successfully.');
}

run().catch(err => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
