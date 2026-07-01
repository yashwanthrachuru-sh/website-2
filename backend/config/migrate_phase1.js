// ============================================================
// backend/config/migrate_phase1.js
// Database Migration for Phase 1 Gamified Features
// ============================================================
'use strict';

const db = require('./db');

async function migrate() {
  console.log('🏁 Starting Phase 1 database migration...');

  try {
    // 1. Table: xp_ledger
    await db.query(`
      CREATE TABLE IF NOT EXISTS xp_ledger (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        source VARCHAR(100) NOT NULL,
        amount INT NOT NULL,
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY uq_user_source (user_id, source)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `xp_ledger` checked/created.');

    // 2. Seed Phase 1 Achievements
    const newAchievements = [
      {
        badge_key: 'roadmap_python',
        title: '🐍 Python Master',
        description: 'Complete the Python Career Roadmap',
        icon: '🐍',
        xp_reward: 500,
        condition_type: 'roadmap_python',
        condition_value: 1
      },
      {
        badge_key: 'roadmap_java',
        title: '☕ Java Master',
        description: 'Complete the Java Career Roadmap',
        icon: '☕',
        xp_reward: 500,
        condition_type: 'roadmap_java',
        condition_value: 1
      },
      {
        badge_key: 'sql_expert',
        title: '🛢️ SQL Expert',
        description: 'Score 90% or higher on an SQL test',
        icon: '🛢️',
        xp_reward: 300,
        condition_type: 'quiz_score_sql',
        condition_value: 90
      },
      {
        badge_key: 'ai_explorer',
        title: '🤖 AI Explorer',
        description: 'Use 3 or more AI tools',
        icon: '🤖',
        xp_reward: 200,
        condition_type: 'tools_used',
        condition_value: 3
      },
      {
        badge_key: 'roadmap_sde',
        title: '⚡ Full Stack Hero',
        description: 'Complete the Software Development Engineer Roadmap',
        icon: '⚡',
        xp_reward: 500,
        condition_type: 'roadmap_sde',
        condition_value: 1
      },
      {
        badge_key: 'interview_champion',
        title: '🎤 Interview Champion',
        description: 'Score 85% or higher on any AI Mock Interview',
        icon: '🎤',
        xp_reward: 400,
        condition_type: 'interview_score',
        condition_value: 85
      }
    ];

    for (const a of newAchievements) {
      await db.query(`
        INSERT INTO achievements (badge_key, title, description, icon, xp_reward, condition_type, condition_value)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          description = VALUES(description),
          icon = VALUES(icon),
          xp_reward = VALUES(xp_reward),
          condition_type = VALUES(condition_type),
          condition_value = VALUES(condition_value)
      `, [a.badge_key, a.title, a.description, a.icon, a.xp_reward, a.condition_type, a.condition_value]);
    }
    console.log('   ✓ Seeded Phase 1 achievements.');

    console.log('✅ Phase 1 database migration completed successfully.');
  } catch (err) {
    console.error('❌ Phase 1 database migration failed:', err.message);
    throw err;
  }
}

module.exports = { migrate };
