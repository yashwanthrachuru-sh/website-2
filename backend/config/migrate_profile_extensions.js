// ============================================================
// backend/config/migrate_profile_extensions.js
// Safe, Reversible Database Migration for Profile Extensions
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
  multipleStatements: false,
  charset: 'utf8mb4'
};

async function addColSafe(conn, table, col, def) {
  const [rows] = await conn.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [cfg.database, table, col]
  );
  if (!rows.length) {
    await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${col}\` ${def}`);
    console.log(`    + Added ${table}.${col}`);
  } else {
    console.log(`    ✓ ${table}.${col} exists`);
  }
}

async function run() {
  const conn = await mysql.createConnection(cfg);
  console.log('✅ Connected to database.');

  await addColSafe(conn, 'users', 'learning_goals',       'TEXT DEFAULT NULL');
  await addColSafe(conn, 'users', 'weekly_target_xp',     'INT DEFAULT 500');
  await addColSafe(conn, 'users', 'preferred_language',   "VARCHAR(50) DEFAULT 'javascript'");
  await addColSafe(conn, 'users', 'preferred_difficulty', "VARCHAR(30) DEFAULT 'medium'");
  await addColSafe(conn, 'users', 'daily_reminder',       'TINYINT(1) DEFAULT 0');
  await addColSafe(conn, 'users', 'interests',            'VARCHAR(255) DEFAULT NULL');

  await conn.end();
  console.log('✅ Profile extensions database migration complete!');
}

run().catch(err => {
  console.error('❌ Migration Error:', err.message);
  process.exit(1);
});
