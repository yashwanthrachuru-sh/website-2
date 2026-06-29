// ============================================================
// backend/config/optimize_db.js
// Database performance optimization script (adding indexes)
// ============================================================
'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const cfg = {
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'edunet'
};

async function run() {
  const conn = await mysql.createConnection(cfg);
  console.log('✅ Connected to DB');

  const indexes = [
    { table: 'lesson_videos', indexName: 'idx_lv_lesson', column: 'lesson_id' },
    { table: 'lesson_resources', indexName: 'idx_lr_lesson', column: 'lesson_id' },
    { table: 'lesson_exercises', indexName: 'idx_le_lesson', column: 'lesson_id' },
    { table: 'lesson_quizzes', indexName: 'idx_lq_lesson', column: 'lesson_id' },
    { table: 'lesson_progress', indexName: 'idx_lp_lesson', column: 'lesson_id' },
    { table: 'module_progress', indexName: 'idx_mp_module', column: 'module_id' },
    { table: 'bookmarks', indexName: 'idx_bm_user_item', column: 'user_id, item_type, item_id' }
  ];

  for (const idx of indexes) {
    try {
      // Check if index already exists
      const [existing] = await conn.query(`
        SHOW INDEX FROM \`${idx.table}\` WHERE Key_name = ?
      `, [idx.indexName]);

      if (existing.length === 0) {
        await conn.query(`
          ALTER TABLE \`${idx.table}\` ADD INDEX \`${idx.indexName}\` (${idx.column})
        `);
        console.log(`  ✓ Added index \`${idx.indexName}\` to table \`${idx.table}\``);
      } else {
        console.log(`  ✓ Index \`${idx.indexName}\` already exists on table \`${idx.table}\``);
      }
    } catch (e) {
      console.warn(`  ⚠️ Failed to check/create index \`${idx.indexName}\`: ${e.message}`);
    }
  }

  await conn.end();
  console.log('✅ Database Index Optimization Complete');
}

run().catch(err => {
  console.error('❌ Optimization Error:', err.message);
  process.exit(1);
});
