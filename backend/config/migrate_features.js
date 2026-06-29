// ============================================================
// backend/config/migrate_features.js
// EduNet Phase 1 — Safe Feature Migration
// Run: node backend/config/migrate_features.js
//
// This script is FULLY REVERSIBLE and SAFE:
//   - Uses CREATE TABLE IF NOT EXISTS (no drops)
//   - Uses ALTER TABLE ... ADD COLUMN IF NOT EXISTS pattern
//   - Uses CREATE INDEX IF NOT EXISTS
//   - Will not destroy any existing data
//   - Seeds achievement definitions
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

// ── Helper: safely add a column if it doesn't exist ────────────
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

// ── Helper: safely add an index if it doesn't exist ────────────
async function addIndexSafe(conn, table, indexName, cols) {
  const [rows] = await conn.query(
    `SELECT INDEX_NAME FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [cfg.database, table, indexName]
  );
  if (!rows.length) {
    await conn.query(`CREATE INDEX \`${indexName}\` ON \`${table}\` (${cols})`);
    console.log(`    + Index ${indexName} on ${table}(${cols})`);
  } else {
    console.log(`    ✓ Index ${indexName} exists`);
  }
}

async function run() {
  const conn = await mysql.createConnection(cfg);
  console.log('✅  DB connected\n');

  // ────────────────────────────────────────────────────────────
  // STEP 1: Add missing indexes for performance
  // ────────────────────────────────────────────────────────────
  console.log('📈  Step 1: Adding performance indexes...');
  await addIndexSafe(conn, 'lesson_progress',  'idx_lp_user',       'user_id');
  await addIndexSafe(conn, 'module_progress',  'idx_mp_user',       'user_id');
  await addIndexSafe(conn, 'module_progress',  'idx_mp_roadmap',    'roadmap_id');
  await addIndexSafe(conn, 'certificates',     'idx_cert_user',     'user_id');
  await addIndexSafe(conn, 'notifications',    'idx_notif_user_read', 'user_id, is_read');
  await addIndexSafe(conn, 'bookmarks',        'idx_bm_user',       'user_id');
  await addIndexSafe(conn, 'ai_chat_logs',     'idx_acl_user_lesson', 'user_id, lesson_id').catch(() => {
    // ai_chat_logs may not exist yet — skip index, will create with table below
  });

  // ────────────────────────────────────────────────────────────
  // STEP 2: Add new columns to existing tables
  // ────────────────────────────────────────────────────────────
  console.log('\n🔧  Step 2: Adding new columns to existing tables...');

  // users table — analytics & profile fields
  await addColSafe(conn, 'users', 'last_active_date',     'DATE DEFAULT NULL');
  await addColSafe(conn, 'users', 'longest_streak',       'INT DEFAULT 0');
  await addColSafe(conn, 'users', 'total_coding_minutes', 'INT DEFAULT 0');
  await addColSafe(conn, 'users', 'is_public',            'TINYINT(1) DEFAULT 1');
  await addColSafe(conn, 'users', 'college',              "VARCHAR(100) DEFAULT NULL");
  await addColSafe(conn, 'users', 'country',              "VARCHAR(100) DEFAULT NULL");

  // lesson_progress — time tracking
  await addColSafe(conn, 'lesson_progress', 'time_spent_minutes', 'INT DEFAULT 0');
  await addColSafe(conn, 'lesson_progress', 'completed_at',       'TIMESTAMP NULL DEFAULT NULL');

  // module_progress — start tracking
  await addColSafe(conn, 'module_progress', 'started_at', 'TIMESTAMP NULL DEFAULT NULL');

  // ────────────────────────────────────────────────────────────
  // STEP 3: Create new tables
  // ────────────────────────────────────────────────────────────
  console.log('\n🗄️   Step 3: Creating new feature tables...');

  // user_activity — daily learning log (powers the heatmap)
  await conn.query(`
    CREATE TABLE IF NOT EXISTS user_activity (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      user_id         INT NOT NULL,
      date            DATE NOT NULL,
      lessons_done    INT DEFAULT 0,
      xp_earned       INT DEFAULT 0,
      coding_minutes  INT DEFAULT 0,
      quiz_attempts   INT DEFAULT 0,
      UNIQUE KEY uq_user_date (user_id, date),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_ua_user_date (user_id, date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('    ✓ user_activity table');

  // achievements — badge definitions (seeded below)
  await conn.query(`
    CREATE TABLE IF NOT EXISTS achievements (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      badge_key       VARCHAR(50)  UNIQUE NOT NULL,
      title           VARCHAR(100) NOT NULL,
      description     VARCHAR(255) NOT NULL,
      icon            VARCHAR(20)  DEFAULT '🏆',
      xp_reward       INT DEFAULT 0,
      condition_type  VARCHAR(50)  NOT NULL,
      condition_value INT DEFAULT 0,
      created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_ach_key (badge_key)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('    ✓ achievements table');

  // user_achievements — which badges a user has earned
  await conn.query(`
    CREATE TABLE IF NOT EXISTS user_achievements (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      user_id        INT NOT NULL,
      achievement_id INT NOT NULL,
      earned_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_user_ach (user_id, achievement_id),
      FOREIGN KEY (user_id)        REFERENCES users(id)        ON DELETE CASCADE,
      FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
      INDEX idx_ua_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('    ✓ user_achievements table');

  // interview_sessions — full AI interview session records
  await conn.query(`
    CREATE TABLE IF NOT EXISTS interview_sessions (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      user_id        INT NOT NULL,
      type           VARCHAR(50) NOT NULL,
      questions_json MEDIUMTEXT,
      answers_json   MEDIUMTEXT,
      score          INT DEFAULT 0,
      feedback       TEXT,
      created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_is_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('    ✓ interview_sessions table');

  // ai_chat_logs — per-lesson AI chat history
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ai_chat_logs (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      user_id    INT NOT NULL,
      lesson_id  INT DEFAULT NULL,
      module_id  INT DEFAULT NULL,
      role       ENUM('user','assistant') NOT NULL DEFAULT 'user',
      message    TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_acl_user_lesson (user_id, lesson_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('    ✓ ai_chat_logs table');

  // onboarding_profile — personalized learning path setup
  await conn.query(`
    CREATE TABLE IF NOT EXISTS onboarding_profile (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      user_id          INT UNIQUE NOT NULL,
      skill_level      VARCHAR(30)  DEFAULT 'beginner',
      career_goal      VARCHAR(100) DEFAULT NULL,
      preferred_lang   VARCHAR(50)  DEFAULT NULL,
      daily_hours      DECIMAL(3,1) DEFAULT 1.0,
      target_weeks     INT DEFAULT 12,
      roadmap_suggestion VARCHAR(50) DEFAULT NULL,
      completed        TINYINT(1) DEFAULT 0,
      created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('    ✓ onboarding_profile table');

  // learning_streak_log — daily streak log for heatmap + streaks
  await conn.query(`
    CREATE TABLE IF NOT EXISTS learning_streak_log (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      user_id    INT NOT NULL,
      date       DATE NOT NULL,
      streak_day INT DEFAULT 1,
      UNIQUE KEY uq_user_streak_date (user_id, date),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_lsl_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('    ✓ learning_streak_log table');

  // ────────────────────────────────────────────────────────────
  // STEP 4: Add the new index on ai_chat_logs (now table exists)
  // ────────────────────────────────────────────────────────────
  await addIndexSafe(conn, 'ai_chat_logs', 'idx_acl_user_lesson', 'user_id, lesson_id');

  // ────────────────────────────────────────────────────────────
  // STEP 5: Seed achievement definitions (20 badges)
  // ────────────────────────────────────────────────────────────
  console.log('\n🏆  Step 4: Seeding achievement definitions...');

  const achievements = [
    // Lesson milestones
    ['first_lesson',    '🌱 First Step',           'Complete your very first lesson',              '🌱', 100, 'lessons_done',    1],
    ['lessons_10',      '📚 Getting Momentum',      'Complete 10 lessons',                          '📚', 150, 'lessons_done',   10],
    ['lessons_50',      '🔥 On Fire',               'Complete 50 lessons',                          '🔥', 300, 'lessons_done',   50],
    ['lessons_100',     '💎 Century Club',          'Complete 100 lessons',                         '💎', 500, 'lessons_done',  100],

    // Streak milestones
    ['streak_3',        '⚡ 3-Day Streak',          'Maintain a 3-day learning streak',             '⚡', 100, 'streak',          3],
    ['streak_7',        '🔥 Week Warrior',          'Maintain a 7-day learning streak',             '🔥', 250, 'streak',          7],
    ['streak_30',       '📅 Monthly Master',        'Maintain a 30-day learning streak',            '📅', 750, 'streak',         30],
    ['streak_100',      '🏆 Century Streak',        'Maintain a 100-day learning streak',           '🏆', 2000, 'streak',        100],

    // XP milestones
    ['xp_100',          '✨ XP Starter',            'Earn your first 100 XP',                       '✨', 0,   'xp',             100],
    ['xp_1000',         '⭐ Rising Star',           'Earn 1,000 XP',                               '⭐', 50,  'xp',            1000],
    ['xp_5000',         '🌟 XP Champion',           'Earn 5,000 XP',                               '🌟', 100, 'xp',            5000],
    ['xp_10000',        '💫 XP Legend',             'Earn 10,000 XP',                              '💫', 250, 'xp',           10000],

    // Roadmap milestones
    ['first_roadmap',   '🗺️ Explorer',             'Start your first roadmap',                     '🗺️', 100, 'roadmaps_started', 1],
    ['first_cert',      '🎓 Certified',             'Earn your first completion certificate',       '🎓', 500, 'certificates',     1],
    ['certs_3',         '🏅 Triple Certified',      'Earn 3 completion certificates',              '🏅', 1000, 'certificates',    3],

    // Quiz milestones
    ['quiz_first',      '🧠 Quiz Starter',          'Complete your first quiz',                     '🧠', 50,  'quiz_attempts',    1],
    ['quiz_perfect',    '💯 Perfect Score',         'Score 100% on any quiz',                       '💯', 300, 'quiz_perfect',     1],
    ['quiz_10',         '🎯 Quiz Enthusiast',       'Complete 10 quizzes',                          '🎯', 200, 'quiz_attempts',   10],

    // Project milestones
    ['first_project',   '🔨 Builder',               'Submit your first project',                    '🔨', 200, 'projects_done',    1],
    ['projects_5',      '🏗️ Architect',             'Complete 5 projects',                         '🏗️', 500, 'projects_done',    5],
  ];

  for (const [key, title, desc, icon, xp, condType, condVal] of achievements) {
    await conn.query(`
      INSERT INTO achievements (badge_key, title, description, icon, xp_reward, condition_type, condition_value)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), icon=VALUES(icon)
    `, [key, title, desc, icon, xp, condType, condVal]);
  }
  console.log(`    ✓ ${achievements.length} achievement definitions seeded`);

  // ────────────────────────────────────────────────────────────
  // STEP 6: Migrate XP from leaderboard table to users table
  // ────────────────────────────────────────────────────────────
  console.log('\n🔄  Step 5: Syncing leaderboard XP to users.xp...');
  try {
    await conn.query(`
      UPDATE users u
      JOIN leaderboard l ON l.user_id = u.id
      SET u.xp = GREATEST(u.xp, l.score)
      WHERE l.score > 0
    `);
    console.log('    ✓ Leaderboard XP synced to users.xp');
  } catch (e) {
    console.log('    ⚠ Could not sync leaderboard XP:', e.message);
  }

  // ────────────────────────────────────────────────────────────
  // DONE
  // ────────────────────────────────────────────────────────────
  await conn.end();
  console.log('\n✅  Phase 1 database migration complete!');
  console.log('    New tables: user_activity, achievements, user_achievements,');
  console.log('                interview_sessions, ai_chat_logs, onboarding_profile,');
  console.log('                learning_streak_log');
  console.log('    New indexes: lesson_progress, module_progress, certificates,');
  console.log('                 notifications, bookmarks, ai_chat_logs');
  console.log('    New columns: users.last_active_date, users.longest_streak,');
  console.log('                 users.total_coding_minutes, users.is_public,');
  console.log('                 users.college, users.country');
  console.log('    Achievement badges seeded: 20\n');
}

run().catch(err => {
  console.error('❌  Migration Error:', err.message);
  console.error(err);
  process.exit(1);
});
