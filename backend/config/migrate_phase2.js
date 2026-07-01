// ============================================================
// backend/config/migrate_phase2.js
// Database Migration for Phase 2 AI Career Coach
// ============================================================
'use strict';

const db = require('./db');

async function migrate() {
  console.log('🏁 Starting Phase 2 database migration...');

  try {
    // 1. Table: ai_career_coaches
    await db.query(`
      CREATE TABLE IF NOT EXISTS ai_career_coaches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE NOT NULL,
        goal VARCHAR(255) NOT NULL,
        estimated_completion DATE DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `ai_career_coaches` checked/created.');

    // 2. Table: weekly_plans
    await db.query(`
      CREATE TABLE IF NOT EXISTS weekly_plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        coach_id INT NOT NULL,
        week_number INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        goal_description TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (coach_id) REFERENCES ai_career_coaches(id) ON DELETE CASCADE,
        UNIQUE KEY uq_coach_week (coach_id, week_number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `weekly_plans` checked/created.');

    // 3. Table: study_tasks
    await db.query(`
      CREATE TABLE IF NOT EXISTS study_tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        coach_id INT NOT NULL,
        week_plan_id INT DEFAULT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        task_type VARCHAR(50) DEFAULT 'lesson',
        task_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        xp_reward INT DEFAULT 50,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (coach_id) REFERENCES ai_career_coaches(id) ON DELETE CASCADE,
        FOREIGN KEY (week_plan_id) REFERENCES weekly_plans(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `study_tasks` checked/created.');

    // 4. Table: study_sessions
    await db.query(`
      CREATE TABLE IF NOT EXISTS study_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        session_date DATE NOT NULL,
        duration_minutes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY uq_user_session_date (user_id, session_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `study_sessions` checked/created.');

    // 5. Table: coach_recommendations
    await db.query(`
      CREATE TABLE IF NOT EXISTS coach_recommendations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        coach_id INT NOT NULL,
        item_type VARCHAR(50) NOT NULL,
        item_id VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        url VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (coach_id) REFERENCES ai_career_coaches(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `coach_recommendations` checked/created.');

    console.log('✅ Phase 2 database migration completed successfully.');
  } catch (err) {
    console.error('❌ Phase 2 database migration failed:', err.message);
    throw err;
  }
}

module.exports = { migrate };
