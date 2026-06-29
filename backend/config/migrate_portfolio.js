// ============================================================
// backend/config/migrate_portfolio.js
// Database Migration for Developer Portfolio Module
// ============================================================
'use strict';

const db = require('./db');

async function migrate() {
  console.log('🏁 Starting portfolio database migration...');

  try {
    // 1. Table: portfolio_settings
    await db.query(`
      CREATE TABLE IF NOT EXISTS portfolio_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE NOT NULL,
        is_public TINYINT(1) DEFAULT 1,
        show_xp TINYINT(1) DEFAULT 1,
        show_streak TINYINT(1) DEFAULT 1,
        show_certificates TINYINT(1) DEFAULT 1,
        show_projects TINYINT(1) DEFAULT 1,
        show_achievements TINYINT(1) DEFAULT 1,
        show_interview_scores TINYINT(1) DEFAULT 1,
        theme VARCHAR(50) DEFAULT 'dark',
        headline VARCHAR(255) DEFAULT NULL,
        about_me TEXT DEFAULT NULL,
        current_role VARCHAR(100) DEFAULT NULL,
        years_learning VARCHAR(50) DEFAULT NULL,
        location VARCHAR(150) DEFAULT NULL,
        availability VARCHAR(100) DEFAULT NULL,
        open_to_work TINYINT(1) DEFAULT 0,
        profile_banner VARCHAR(255) DEFAULT NULL,
        profile_picture VARCHAR(255) DEFAULT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `portfolio_settings` checked/created.');

    // 2. Table: portfolio_socials
    await db.query(`
      CREATE TABLE IF NOT EXISTS portfolio_socials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE NOT NULL,
        github_url VARCHAR(255) DEFAULT NULL,
        linkedin_url VARCHAR(255) DEFAULT NULL,
        twitter_url VARCHAR(255) DEFAULT NULL,
        instagram_url VARCHAR(255) DEFAULT NULL,
        website_url VARCHAR(255) DEFAULT NULL,
        email VARCHAR(100) DEFAULT NULL,
        phone VARCHAR(30) DEFAULT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `portfolio_socials` checked/created.');

    // 3. Table: portfolio_resume
    await db.query(`
      CREATE TABLE IF NOT EXISTS portfolio_resume (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE NOT NULL,
        resume_url VARCHAR(255) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `portfolio_resume` checked/created.');

    // 4. Table: portfolio_projects
    await db.query(`
      CREATE TABLE IF NOT EXISTS portfolio_projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        tech_stack VARCHAR(255) DEFAULT NULL,
        github_link VARCHAR(255) DEFAULT NULL,
        live_link VARCHAR(255) DEFAULT NULL,
        images TEXT DEFAULT NULL,
        video VARCHAR(255) DEFAULT NULL,
        difficulty VARCHAR(50) DEFAULT NULL,
        completion_date DATE DEFAULT NULL,
        status VARCHAR(50) DEFAULT NULL,
        is_featured TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `portfolio_projects` checked/created.');

    // 5. Table: portfolio_skills
    await db.query(`
      CREATE TABLE IF NOT EXISTS portfolio_skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        skill_name VARCHAR(100) NOT NULL,
        proficiency INT NOT NULL DEFAULT 0,
        xp_earned INT NOT NULL DEFAULT 0,
        project_count INT NOT NULL DEFAULT 0,
        is_custom TINYINT(1) DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_user_skill (user_id, skill_name),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `portfolio_skills` checked/created.');

    console.log('✅ Portfolio database migration completed successfully.');
  } catch (err) {
    console.error('❌ Portfolio database migration failed:', err.message);
    throw err;
  }
}

module.exports = { migrate };
