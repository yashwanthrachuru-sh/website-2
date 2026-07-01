// ============================================================
// backend/config/migrate_phase5.js
// Database Migration for Phase 5:
// GitHub Integration, Portfolio Analytics & Recruiter Experience
// ============================================================
'use strict';

const db = require('./db');

async function migrate() {
  console.log('🏁 Starting Phase 5 database migration...');

  try {
    // ── 1. user_github_profiles ────────────────────────────────
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_github_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        github_username VARCHAR(255) NOT NULL,
        access_token TEXT,
        token_encrypted TINYINT(1) NOT NULL DEFAULT 0,
        avatar_url VARCHAR(500),
        name VARCHAR(255),
        bio TEXT,
        company VARCHAR(255),
        blog VARCHAR(500),
        location VARCHAR(255),
        followers INT DEFAULT 0,
        following INT DEFAULT 0,
        public_repos INT DEFAULT 0,
        total_stars INT DEFAULT 0,
        total_forks INT DEFAULT 0,
        github_created_at VARCHAR(50),
        last_synced TIMESTAMP NULL,
        oauth_mode TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        KEY idx_github_username (github_username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `user_github_profiles` checked/created.');

    // ── 2. github_repositories ─────────────────────────────────
    await db.query(`
      CREATE TABLE IF NOT EXISTS github_repositories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        github_repo_id BIGINT NOT NULL,
        name VARCHAR(255) NOT NULL,
        full_name VARCHAR(500),
        description TEXT,
        html_url VARCHAR(500),
        homepage VARCHAR(500),
        language VARCHAR(100),
        stars INT DEFAULT 0,
        forks INT DEFAULT 0,
        watchers INT DEFAULT 0,
        open_issues INT DEFAULT 0,
        size_kb INT DEFAULT 0,
        license VARCHAR(100),
        topics TEXT,
        default_branch VARCHAR(100) DEFAULT 'main',
        is_fork TINYINT(1) DEFAULT 0,
        is_archived TINYINT(1) DEFAULT 0,
        is_pinned TINYINT(1) DEFAULT 0,
        is_hidden TINYINT(1) DEFAULT 0,
        sort_order INT DEFAULT 0,
        last_commit_sha VARCHAR(100),
        last_commit_message TEXT,
        last_commit_date VARCHAR(50),
        github_created_at VARCHAR(50),
        github_updated_at VARCHAR(50),
        last_synced TIMESTAMP NULL,
        imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY uq_user_repo (user_id, github_repo_id),
        KEY idx_user_id (user_id),
        KEY idx_is_pinned (is_pinned)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `github_repositories` checked/created.');

    // ── 3. portfolio_views ─────────────────────────────────────
    await db.query(`
      CREATE TABLE IF NOT EXISTS portfolio_views (
        id INT AUTO_INCREMENT PRIMARY KEY,
        portfolio_user_id INT NOT NULL,
        visitor_hash VARCHAR(64),
        referrer VARCHAR(500),
        user_agent_hash VARCHAR(64),
        country_code VARCHAR(10),
        is_unique TINYINT(1) DEFAULT 1,
        is_returning TINYINT(1) DEFAULT 0,
        session_seconds INT DEFAULT 0,
        view_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (portfolio_user_id) REFERENCES users(id) ON DELETE CASCADE,
        KEY idx_portfolio_user (portfolio_user_id),
        KEY idx_view_date (view_date),
        KEY idx_visitor_hash (visitor_hash)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `portfolio_views` checked/created.');

    // ── 4. portfolio_clicks ────────────────────────────────────
    await db.query(`
      CREATE TABLE IF NOT EXISTS portfolio_clicks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        portfolio_user_id INT NOT NULL,
        visitor_hash VARCHAR(64),
        click_type ENUM('project','github','linkedin','twitter','website','resume_view','resume_download','certificate','contact','share','bookmark') NOT NULL,
        target_id VARCHAR(255),
        target_name VARCHAR(255),
        click_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (portfolio_user_id) REFERENCES users(id) ON DELETE CASCADE,
        KEY idx_portfolio_user (portfolio_user_id),
        KEY idx_click_type (click_type),
        KEY idx_click_date (click_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `portfolio_clicks` checked/created.');

    // ── 5. portfolio_shares ────────────────────────────────────
    await db.query(`
      CREATE TABLE IF NOT EXISTS portfolio_shares (
        id INT AUTO_INCREMENT PRIMARY KEY,
        portfolio_user_id INT NOT NULL,
        share_token VARCHAR(64) UNIQUE,
        share_type ENUM('copy_link','qr_scan','social','print','bookmark') NOT NULL DEFAULT 'copy_link',
        visitor_hash VARCHAR(64),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (portfolio_user_id) REFERENCES users(id) ON DELETE CASCADE,
        KEY idx_portfolio_user (portfolio_user_id),
        KEY idx_share_token (share_token)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `portfolio_shares` checked/created.');

    // ── 6. portfolio_qr_scans ──────────────────────────────────
    await db.query(`
      CREATE TABLE IF NOT EXISTS portfolio_qr_scans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        portfolio_user_id INT NOT NULL,
        visitor_hash VARCHAR(64),
        scan_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (portfolio_user_id) REFERENCES users(id) ON DELETE CASCADE,
        KEY idx_portfolio_user (portfolio_user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `portfolio_qr_scans` checked/created.');

    // ── 7. portfolio_theme ─────────────────────────────────────
    await db.query(`
      CREATE TABLE IF NOT EXISTS portfolio_theme (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        accent_color VARCHAR(30) DEFAULT '#8b5cf6',
        background_style ENUM('dark','light','system') DEFAULT 'dark',
        card_radius VARCHAR(10) DEFAULT '12px',
        glass_blur VARCHAR(10) DEFAULT '16px',
        font_family VARCHAR(100) DEFAULT 'Outfit',
        font_size VARCHAR(10) DEFAULT '14px',
        animation_speed ENUM('none','slow','normal','fast') DEFAULT 'normal',
        border_style ENUM('solid','dashed','none') DEFAULT 'solid',
        card_style ENUM('glass','flat','bordered','elevated') DEFAULT 'glass',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `portfolio_theme` checked/created.');

    // ── 8. portfolio_strength_cache ────────────────────────────
    await db.query(`
      CREATE TABLE IF NOT EXISTS portfolio_strength_cache (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        score INT NOT NULL DEFAULT 0,
        recommendations TEXT,
        breakdown TEXT,
        calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `portfolio_strength_cache` checked/created.');

    // ── 9. portfolio_visitors (aggregated session data) ────────
    await db.query(`
      CREATE TABLE IF NOT EXISTS portfolio_visitors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        portfolio_user_id INT NOT NULL,
        visitor_hash VARCHAR(64) NOT NULL,
        first_seen DATE NOT NULL,
        last_seen DATE NOT NULL,
        total_visits INT DEFAULT 1,
        total_seconds INT DEFAULT 0,
        FOREIGN KEY (portfolio_user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY uq_user_visitor (portfolio_user_id, visitor_hash),
        KEY idx_portfolio_user (portfolio_user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   ✓ Table `portfolio_visitors` checked/created.');

    // ── 10. ALTER portfolio_projects — add new columns safely ──
    const newColumns = [
      { name: 'github_repo_id',   def: 'BIGINT NULL DEFAULT NULL' },
      { name: 'repository_url',   def: 'VARCHAR(500) NULL DEFAULT NULL' },
      { name: 'stars',            def: 'INT NOT NULL DEFAULT 0' },
      { name: 'forks',            def: 'INT NOT NULL DEFAULT 0' },
      { name: 'language',         def: 'VARCHAR(100) NULL DEFAULT NULL' },
      { name: 'last_synced',      def: 'TIMESTAMP NULL DEFAULT NULL' },
      { name: 'is_pinned',        def: 'TINYINT(1) NOT NULL DEFAULT 0' },
      { name: 'is_hidden',        def: 'TINYINT(1) NOT NULL DEFAULT 0' },
      { name: 'sort_order',       def: 'INT NOT NULL DEFAULT 0' },
      { name: 'cover_image',      def: 'TEXT NULL DEFAULT NULL' },
      { name: 'team_size',        def: 'INT NULL DEFAULT NULL' },
      { name: 'duration',         def: 'VARCHAR(100) NULL DEFAULT NULL' },
      { name: 'challenges_faced', def: 'TEXT NULL DEFAULT NULL' },
      { name: 'lessons_learned',  def: 'TEXT NULL DEFAULT NULL' },
      { name: 'future_improvements', def: 'TEXT NULL DEFAULT NULL' },
      { name: 'architecture_notes', def: 'TEXT NULL DEFAULT NULL' }
    ];

    const [existingCols] = await db.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'portfolio_projects'
    `);
    const existingColNames = existingCols.map(c => c.COLUMN_NAME.toLowerCase());

    for (const col of newColumns) {
      if (!existingColNames.includes(col.name.toLowerCase())) {
        await db.query(`ALTER TABLE portfolio_projects ADD COLUMN ${col.name} ${col.def}`);
        console.log(`   ✓ Added column \`portfolio_projects.${col.name}\`.`);
      }
    }

    console.log('✅ Phase 5 database migration completed successfully.');
  } catch (err) {
    console.error('❌ Phase 5 migration failed:', err.message);
    throw err;
  }
}

module.exports = { migrate };
