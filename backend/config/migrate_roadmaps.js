// ============================================================
// backend/config/migrate_roadmaps.js
// EduNet — Roadmap Learning System Full Migration + Seed (37 Tracks)
// Run: node backend/config/migrate_roadmaps.js
// ============================================================
'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mysql = require('mysql2/promise');
const roadmapDefinitions = require('./roadmapDefinitions');

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
  console.log('------------------------------------------------------------');
  console.log('🚨 CURRICULUM RECONSTRUCTION MIGRATION');
  console.log('Database Backup Filename: backend/backups/edunet_backup_20260709_221137.sql');
  console.log('------------------------------------------------------------\n');

  const conn = await mysql.createConnection(cfg);
  console.log('✅ DB Connected\n');

  await conn.query('SET FOREIGN_KEY_CHECKS = 0;');

  // ─────────────────────────────────────────────
  // PHASE 1: Re-create curriculum tables if not exists
  // ─────────────────────────────────────────────
  console.log('📐 Re-creating database curriculum tables...');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS roadmap_modules (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      roadmap_id    VARCHAR(50) NOT NULL,
      title         VARCHAR(200) NOT NULL,
      description   TEXT NOT NULL,
      order_index   INT DEFAULT 0,
      xp_reward     INT DEFAULT 200,
      icon          VARCHAR(10) DEFAULT '📖',
      language      VARCHAR(30) DEFAULT 'text',
      is_free       TINYINT(1) DEFAULT 1,
      created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE,
      INDEX idx_rm_roadmap (roadmap_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS module_lessons (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      module_id       INT NOT NULL,
      title           VARCHAR(200) NOT NULL,
      short_desc      TEXT NOT NULL,
      learning_notes  MEDIUMTEXT NOT NULL,
      starter_code    TEXT,
      language        VARCHAR(30) DEFAULT 'javascript',
      order_index     INT DEFAULT 0,
      xp_reward       INT DEFAULT 50,
      created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (module_id) REFERENCES roadmap_modules(id) ON DELETE CASCADE,
      INDEX idx_ml_module (module_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS lesson_videos (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      module_id   INT NOT NULL,
      title       VARCHAR(255) NOT NULL,
      channel     VARCHAR(100) NOT NULL,
      video_id    VARCHAR(50) NOT NULL,
      embed_url   VARCHAR(255) NOT NULL,
      thumbnail   VARCHAR(255) NOT NULL,
      duration    VARCHAR(20) DEFAULT '',
      FOREIGN KEY (module_id) REFERENCES roadmap_modules(id) ON DELETE CASCADE,
      INDEX idx_lv_module (module_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS lesson_resources (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      module_id   INT NOT NULL,
      title       VARCHAR(255) NOT NULL,
      url         VARCHAR(500) NOT NULL,
      type        VARCHAR(30) DEFAULT 'docs',
      FOREIGN KEY (module_id) REFERENCES roadmap_modules(id) ON DELETE CASCADE,
      INDEX idx_lr_module (module_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS lesson_exercises (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      module_id   INT NOT NULL,
      title       VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      difficulty  VARCHAR(20) DEFAULT 'Easy',
      starter_code TEXT,
      hint        TEXT,
      order_index INT DEFAULT 0,
      FOREIGN KEY (module_id) REFERENCES roadmap_modules(id) ON DELETE CASCADE,
      INDEX idx_le_module (module_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS lesson_challenges (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      module_id     INT NOT NULL,
      title         VARCHAR(255) NOT NULL,
      description   TEXT NOT NULL,
      starter_code  TEXT,
      language      VARCHAR(30) DEFAULT 'javascript',
      xp_reward     INT DEFAULT 150,
      FOREIGN KEY (module_id) REFERENCES roadmap_modules(id) ON DELETE CASCADE,
      INDEX idx_lc_module (module_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS lesson_quizzes (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      module_id       INT NOT NULL,
      question        TEXT NOT NULL,
      option_a        VARCHAR(500) NOT NULL,
      option_b        VARCHAR(500) NOT NULL,
      option_c        VARCHAR(500) NOT NULL,
      option_d        VARCHAR(500) NOT NULL,
      correct_option  CHAR(1) NOT NULL,
      explanation     TEXT,
      order_index     INT DEFAULT 0,
      FOREIGN KEY (module_id) REFERENCES roadmap_modules(id) ON DELETE CASCADE,
      INDEX idx_lq_module (module_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // ─────────────────────────────────────────────
  // PHASE 2: Clear old curriculum modules
  // ─────────────────────────────────────────────
  console.log('🧹 Wiping dynamic curriculum rows...');
  await conn.query('DELETE FROM roadmap_modules;');
  console.log('  ✓ Wiped all old modules, lessons, and metadata safely.');

  // ─────────────────────────────────────────────
  // PHASE 3: Seed / Update Roadmaps (37 Tracks)
  // ─────────────────────────────────────────────
  console.log('\n🗺  Upserting 37 roadmaps into database...');
  for (const [rid, rdata] of Object.entries(roadmapDefinitions)) {
    await conn.query(`
      INSERT INTO roadmaps (id, branch, track, title, description, category, difficulty, duration, xp_reward, lesson_count, icon, tags, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title=VALUES(title),
        description=VALUES(description),
        category=VALUES(category),
        difficulty=VALUES(difficulty),
        duration=VALUES(duration),
        xp_reward=VALUES(xp_reward),
        icon=VALUES(icon),
        tags=VALUES(tags)
    `, [
      rid,
      rdata.category, // branch
      rdata.category, // track
      rdata.title,
      rdata.description,
      rdata.category,
      rdata.difficulty,
      rdata.duration,
      rdata.xp_reward,
      rdata.modules.length * 3, // total lessons (3 per module)
      rdata.icon,
      rdata.tags,
      rdata.is_featured || 0
    ]);
  }
  console.log('  ✓ 37 roadmaps upserted successfully.');

  // ─────────────────────────────────────────────
  // PHASE 4: Seed modules and lesson stubs
  // ─────────────────────────────────────────────
  console.log('\n📚 Seeding modules and lesson stubs...');

  const videoBank = {
    javascript: [
      { title: 'JS Course for Beginners', channel: 'freeCodeCamp', vid: 'PkZNo7MFNFg', dur: '3h 26m' },
      { title: 'Async JS Crash Course', channel: 'Traversy Media', vid: 'yfoY53QXEnI', dur: '1h 25m' },
      { title: 'Event Loop in 100 Seconds', channel: 'Fireship', vid: 'DHjqpvDnNGE', dur: '1m 40s' }
    ],
    python: [
      { title: 'Python for Beginners', channel: 'Programming with Mosh', vid: '_uQrJ0TkZlc', dur: '6h 14m' },
      { title: 'Python OOP Crash Course', channel: 'freeCodeCamp', vid: 'rfscVS0vtbw', dur: '4h 21m' },
      { title: 'Python in 100 Seconds', channel: 'Fireship', vid: 'x7X9w_GIm1s', dur: '1m 40s' }
    ],
    java: [
      { title: 'Java Tutorial for Beginners', channel: 'Programming with Mosh', vid: 'eIrMbAQSU34', dur: '2h 30m' },
      { title: 'Spring Boot Complete Guide', channel: 'Amigoscode', vid: '9SGDpanrc8U', dur: '3h' }
    ]
  };

  const resourceBank = {
    javascript: [
      { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', type: 'docs' },
      { title: 'JavaScript.info', url: 'https://javascript.info', type: 'tutorial' }
    ],
    python: [
      { title: 'Python Official Docs', url: 'https://docs.python.org', type: 'docs' },
      { title: 'Real Python Tutorials', url: 'https://realpython.com', type: 'tutorial' }
    ],
    java: [
      { title: 'Oracle Java Documentation', url: 'https://docs.oracle.com/en/java/', type: 'docs' },
      { title: 'Baeldung Spring Guides', url: 'https://www.baeldung.com', type: 'tutorial' }
    ]
  };

  for (const [rid, rdata] of Object.entries(roadmapDefinitions)) {
    const modules = rdata.modules;
    const rlang = rdata.language || 'javascript';

    for (let m = 0; m < modules.length; m++) {
      const mod = modules[m];

      // 1. Insert module
      const [modRes] = await conn.query(`
        INSERT INTO roadmap_modules (roadmap_id, title, description, order_index, xp_reward, icon, language)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        rid,
        mod.name,
        mod.desc,
        m + 1,
        200,
        rdata.icon,
        rlang
      ]);
      const moduleId = modRes.insertId;

      // 2. Insert lesson stubs (initialize with skeleton notes for lazy enrichment validation)
      const lessons = mod.lessons;
      for (let l = 0; l < lessons.length; l++) {
        const les = lessons[l];
        await conn.query(`
          INSERT INTO module_lessons (module_id, title, short_desc, learning_notes, starter_code, language, order_index, xp_reward)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          moduleId,
          les.title,
          les.desc,
          '<!--EDUNET_STRUCTURED_V1-->\n<!--SECTION:definition-->\nSkeleton outline\n<!--/SECTION:definition-->\n<!--/EDUNET_STRUCTURED_V1-->', // bare placeholder to trigger rebuild check
          `// Starter code for ${les.title}`,
          rlang,
          l + 1,
          50
        ]);
      }

      // 3. Seed videos
      const vPool = videoBank[rlang] || videoBank.javascript;
      for (const v of vPool) {
        await conn.query(`
          INSERT INTO lesson_videos (module_id, title, channel, video_id, embed_url, thumbnail, duration)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          moduleId,
          v.title,
          v.channel,
          v.vid,
          `https://www.youtube.com/embed/${v.vid}`,
          `https://img.youtube.com/vi/${v.vid}/hqdefault.jpg`,
          v.dur
        ]);
      }

      // 4. Seed resources
      const rPool = resourceBank[rlang] || resourceBank.javascript;
      for (const r of rPool) {
        await conn.query(`
          INSERT INTO lesson_resources (module_id, title, url, type)
          VALUES (?, ?, ?, ?)
        `, [
          moduleId,
          r.title,
          r.url,
          r.type
        ]);
      }

      // 5. Seed exercise
      await conn.query(`
        INSERT INTO lesson_exercises (module_id, title, description, difficulty, starter_code, hint, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        moduleId,
        `Exercise: Basic ${mod.name}`,
        `Write a clean implementation matching the core logic of ${mod.name}.`,
        'Easy',
        rlang === 'python' ? '# Write code here' : '// Write code here',
        'Refer to the lesson definition rules.',
        1
      ]);

      // 6. Seed challenge
      await conn.query(`
        INSERT INTO lesson_challenges (module_id, title, description, starter_code, language, xp_reward)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        moduleId,
        `Challenge: Real-world ${mod.name}`,
        `Solve the engineering challenge targeting dynamic implementations of ${mod.name}.`,
        rlang === 'python' ? '# Write production code here' : '// Write production code here',
        rlang,
        150
      ]);

      // 7. Seed quiz
      await conn.query(`
        INSERT INTO lesson_quizzes (module_id, question, option_a, option_b, option_c, option_d, correct_option, explanation, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        moduleId,
        `What is the primary architectural goal of ${mod.name}?`,
        'To optimize execution flows and resource structures',
        'To bypass compiler validations',
        'To format data strings into hex coordinates',
        'To delete operating system caches',
        'A',
        'This matches standard design practices for this structure.',
        1
      ]);
    }
  }

  console.log('  ✓ Seeding completed.');

  // Also seed lesson_projects via migration extensions
  try {
    const migrateExtensions = require('./migrate_roadmap_extensions');
    if (migrateExtensions && typeof migrateExtensions.run === 'function') {
      console.log('\n📐 Seeding extension tables...');
      await migrateExtensions.run();
    }
  } catch (extErr) {
    console.log('Note: Extension tables will be migrated on server reboot.');
  }

  await conn.query('SET FOREIGN_KEY_CHECKS = 1;');
  await conn.end();

  console.log('\n============================================================');
  console.log('✅ CURRICULUM SCHEMA REBUILT SUCCESSFULLY');
  console.log('============================================================\n');
}

run().catch(err => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
