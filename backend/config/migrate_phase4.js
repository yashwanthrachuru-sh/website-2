// ============================================================
// backend/config/migrate_phase4.js
// Database Migration for Phase 4 Resume Builder & ATS Scanner
// ============================================================
'use strict';

const db = require('./db');

async function migrate() {
  console.log('🏁 Starting Phase 4 database migration...');

  try {
    // 1. Table: user_resumes
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_resumes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL DEFAULT 'My Resume',
        template VARCHAR(50) NOT NULL DEFAULT 'classic',
        personal_info TEXT, -- JSON
        summary TEXT,
        skills TEXT, -- JSON
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `user_resumes` checked/created.');

    // 2. Table: resume_sections
    await db.query(`
      CREATE TABLE IF NOT EXISTS resume_sections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        resume_id INT NOT NULL,
        section_name VARCHAR(100) NOT NULL, -- education, experience, projects, certifications, achievements, languages, interests
        content_json TEXT, -- JSON array
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (resume_id) REFERENCES user_resumes(id) ON DELETE CASCADE,
        UNIQUE KEY uq_resume_section (resume_id, section_name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `resume_sections` checked/created.');

    // 3. Table: resume_templates
    await db.query(`
      CREATE TABLE IF NOT EXISTS resume_templates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        css_styles TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `resume_templates` checked/created.');

    // 4. Table: resume_versions
    await db.query(`
      CREATE TABLE IF NOT EXISTS resume_versions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        resume_id INT NOT NULL,
        version_number INT NOT NULL,
        content_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (resume_id) REFERENCES user_resumes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `resume_versions` checked/created.');

    // 5. Table: resume_job_scans
    await db.query(`
      CREATE TABLE IF NOT EXISTS resume_job_scans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        resume_id INT NOT NULL,
        job_description TEXT NOT NULL,
        score INT NOT NULL,
        matched_keywords TEXT, -- JSON
        missing_keywords TEXT, -- JSON
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (resume_id) REFERENCES user_resumes(id) ON DELETE CASCADE,
        KEY idx_user_id (user_id),
        KEY idx_resume_id (resume_id),
        KEY idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `resume_job_scans` checked/created.');

    // 6. Table: resume_keywords
    await db.query(`
      CREATE TABLE IF NOT EXISTS resume_keywords (
        id INT AUTO_INCREMENT PRIMARY KEY,
        resume_id INT NOT NULL,
        keyword VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (resume_id) REFERENCES user_resumes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `resume_keywords` checked/created.');

    // 7. Table: resume_downloads
    await db.query(`
      CREATE TABLE IF NOT EXISTS resume_downloads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        resume_id INT NOT NULL,
        format VARCHAR(20) NOT NULL, -- pdf, markdown
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (resume_id) REFERENCES user_resumes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `resume_downloads` checked/created.');

    // 8. Table: resume_ai_history
    await db.query(`
      CREATE TABLE IF NOT EXISTS resume_ai_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        resume_id INT NOT NULL,
        prompt TEXT NOT NULL,
        response TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (resume_id) REFERENCES user_resumes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `resume_ai_history` checked/created.');

    // Seed default resume templates
    await db.query(`
      INSERT INTO resume_templates (name, css_styles)
      VALUES 
        ('classic', 'font-family: serif; color: #111; line-height: 1.5;'),
        ('modern', 'font-family: sans-serif; color: #0284c7; line-height: 1.6;'),
        ('minimal', 'font-family: sans-serif; color: #333; line-height: 1.4;'),
        ('developer', 'font-family: monospace; color: #0f172a; line-height: 1.5;'),
        ('executive', 'font-family: Georgia, serif; color: #1e293b; line-height: 1.6;')
      ON DUPLICATE KEY UPDATE
        css_styles = VALUES(css_styles)
    `);
    console.log('   ✓ Seeded default templates styles mappings.');

    console.log('✅ Phase 4 database migration completed successfully.');
  } catch (err) {
    console.error('❌ Phase 4 database migration failed:', err.message);
    throw err;
  }
}

module.exports = { migrate };
