// ============================================================
// backend/config/migrate_roadmap_extensions.js
// EduNet — Create lesson_projects and lesson_notes, and seed projects
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
  const conn = await mysql.createConnection(cfg);
  console.log('✅ DB Connected');

  console.log('📐 Creating extensions tables...');
  await conn.query(`
    CREATE TABLE IF NOT EXISTS lesson_projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      module_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      difficulty VARCHAR(50) NOT NULL DEFAULT 'Medium',
      requirements TEXT NOT NULL,
      expected_output TEXT NOT NULL,
      screenshots VARCHAR(500) DEFAULT '',
      technologies VARCHAR(255) NOT NULL DEFAULT 'HTML, CSS, JavaScript',
      time_estimate VARCHAR(50) NOT NULL DEFAULT '4 hours',
      starter_files VARCHAR(500) DEFAULT '',
      completion_criteria TEXT NOT NULL,
      FOREIGN KEY (module_id) REFERENCES roadmap_modules(id) ON DELETE CASCADE,
      INDEX idx_lp_module (module_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('  ✓ lesson_projects table');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS lesson_notes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      module_id INT NOT NULL,
      content TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_user_note (user_id, module_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (module_id) REFERENCES roadmap_modules(id) ON DELETE CASCADE,
      INDEX idx_ln_user (user_id),
      INDEX idx_ln_module (module_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('  ✓ lesson_notes table');

  // Let's seed lesson projects
  // We have 120 modules. Let's seed a project for each one.
  const [modules] = await conn.query(`SELECT id, title, language, roadmap_id FROM roadmap_modules`);
  console.log(`📚 Found ${modules.length} modules to seed projects for.`);

  // Check if projects already exist
  const [[existingCount]] = await conn.query('SELECT COUNT(*) AS cnt FROM lesson_projects');
  if (existingCount.cnt > 0) {
    console.log('  ✓ Projects already seeded. Clearing to refresh...');
    await conn.query('DELETE FROM lesson_projects');
  }

  for (const mod of modules) {
    const title = `Project: Build a ${mod.title.replace('— Core Concepts', '').replace('Fundamentals', '').replace('Basics', '').trim()}`;
    const desc = `In this project, you will build a real-world application to apply what you learned in "${mod.title}". This project is designed to test your knowledge of syntax, best practices, and clean implementation.`;
    const diff = mod.title.includes('Introduction') || mod.title.includes('Basics') ? 'Beginner' : mod.title.includes('Advanced') || mod.title.includes('ML') || mod.title.includes('AI') ? 'Advanced' : 'Intermediate';
    const reqs = `- Implement all functional requirements cleanly\n- Use meaningful naming conventions\n- Write unit tests or verify input/output\n- Follow security and performance guidelines.`;
    const expected = `A fully functional application running locally or deployed. Verified via custom input assertions.`;
    const tech = mod.language === 'html' ? 'HTML5' : mod.language === 'css' ? 'CSS3, Flexbox' : mod.language === 'javascript' ? 'JavaScript (ES6+)' : mod.language === 'python' ? 'Python 3' : mod.language === 'java' ? 'Java JDK 17' : mod.language === 'sql' ? 'MySQL / SQLite' : 'C/C++';
    const time = diff === 'Beginner' ? '2-3 hours' : diff === 'Intermediate' ? '4-6 hours' : '8-10 hours';
    const criteria = `- Code must compile/run without errors\n- Proper error handling and input validation\n- Code is clean, well-commented, and formatted.`;

    await conn.query(`
      INSERT INTO lesson_projects (module_id, title, description, difficulty, requirements, expected_output, technologies, time_estimate, completion_criteria)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [mod.id, title, desc, diff, reqs, expected, tech, time, criteria]);
  }
  console.log(`  ✓ Seeded projects for ${modules.length} modules.`);

  await conn.end();
  console.log('✅ Extension tables migration and seed completed.');
}

run().catch(err => {
  console.error('❌ Migration Error:', err.message);
  process.exit(1);
});
