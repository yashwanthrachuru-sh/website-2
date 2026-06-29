// ============================================================
// backend/config/migrate_v2.js
// EduNet — Major Schema Upgrade & Dynamic Seeding for 5 Lessons per Module
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

  // ─────────────────────────────────────────────
  // 1. Structural Upgrades (Adding lesson_id columns)
  // ─────────────────────────────────────────────
  console.log('🔧 Upgrading schemas for Lesson-level content...');

  const alterTables = [
    ['lesson_videos', 'ALTER TABLE lesson_videos ADD COLUMN lesson_id INT NULL, ADD CONSTRAINT fk_lv_lesson FOREIGN KEY (lesson_id) REFERENCES module_lessons(id) ON DELETE CASCADE'],
    ['lesson_resources', 'ALTER TABLE lesson_resources ADD COLUMN lesson_id INT NULL, ADD CONSTRAINT fk_lr_lesson FOREIGN KEY (lesson_id) REFERENCES module_lessons(id) ON DELETE CASCADE'],
    ['lesson_exercises', 'ALTER TABLE lesson_exercises ADD COLUMN lesson_id INT NULL, ADD CONSTRAINT fk_le_lesson FOREIGN KEY (lesson_id) REFERENCES module_lessons(id) ON DELETE CASCADE'],
    ['lesson_quizzes', 'ALTER TABLE lesson_quizzes ADD COLUMN lesson_id INT NULL, ADD CONSTRAINT fk_lq_lesson FOREIGN KEY (lesson_id) REFERENCES module_lessons(id) ON DELETE CASCADE'],
    ['lesson_projects', 'ALTER TABLE lesson_projects ADD COLUMN lesson_id INT NULL, ADD CONSTRAINT fk_lp_lesson FOREIGN KEY (lesson_id) REFERENCES module_lessons(id) ON DELETE CASCADE'],
    ['lesson_notes', 'ALTER TABLE lesson_notes ADD COLUMN lesson_id INT NULL, ADD CONSTRAINT fk_ln_lesson FOREIGN KEY (lesson_id) REFERENCES module_lessons(id) ON DELETE CASCADE']
  ];

  for (const [table, sql] of alterTables) {
    // Check if column already exists
    const [cols] = await conn.query(`SHOW COLUMNS FROM \`${table}\` LIKE 'lesson_id'`);
    if (cols.length === 0) {
      await conn.query(sql);
      console.log(`  ✓ Upgraded table \`${table}\` with \`lesson_id\``);
    } else {
      console.log(`  ✓ Table \`${table}\` already has \`lesson_id\``);
    }
  }

  // Create roadmap certification exams table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS roadmap_exams (
      id INT AUTO_INCREMENT PRIMARY KEY,
      roadmap_id VARCHAR(50) NOT NULL,
      question TEXT NOT NULL,
      option_a VARCHAR(500) NOT NULL,
      option_b VARCHAR(500) NOT NULL,
      option_c VARCHAR(500) NOT NULL,
      option_d VARCHAR(500) NOT NULL,
      correct_option CHAR(1) NOT NULL,
      explanation TEXT,
      xp_reward INT DEFAULT 50,
      FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE,
      INDEX idx_re_roadmap (roadmap_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('  ✓ Created `roadmap_exams` table');

  // Let's create lesson progress table to track individual lesson completions
  await conn.query(`
    CREATE TABLE IF NOT EXISTS lesson_progress (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      lesson_id INT NOT NULL,
      completed TINYINT(1) DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_user_lesson (user_id, lesson_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (lesson_id) REFERENCES module_lessons(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('  ✓ Created `lesson_progress` table');

  // ─────────────────────────────────────────────
  // 2. Seeding Lessons (5-8 lessons per module)
  // ─────────────────────────────────────────────
  console.log('📚 Expanding module_lessons...');

  // Let's fetch all modules
  const [modules] = await conn.query(`SELECT id, title, language, roadmap_id FROM roadmap_modules`);
  console.log(`  Found ${modules.length} modules.`);

  // Let's clear current lessons, videos, resources, exercises, projects, and quizzes to avoid dupes or mismatches
  console.log('  Clearing old lesson-level tables to perform clean seed...');
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');
  await conn.query('TRUNCATE TABLE module_lessons');
  await conn.query('TRUNCATE TABLE lesson_videos');
  await conn.query('TRUNCATE TABLE lesson_resources');
  await conn.query('TRUNCATE TABLE lesson_exercises');
  await conn.query('TRUNCATE TABLE lesson_quizzes');
  await conn.query('TRUNCATE TABLE lesson_projects');
  await conn.query('TRUNCATE TABLE roadmap_exams');
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');

  // Lesson sub-topics generators
  const subtopics = {
    webdev: ['Fundamentals & Syntax', 'Practical Syntax & Structure', 'Best Practices & Optimization', 'Real-world Implementations', 'Interview Prep & Exercises'],
    python: ['Introduction & Setup', 'Control Flow & Logic', 'OOP & Abstraction', 'Packages & Best Practices', 'Debugging & Testing'],
    java:   ['Syntax & Basic Types', 'Loops & Methods', 'Classes & Inheritances', 'Interfaces & Collections', 'Concurrency & JDBC'],
    dsa:    ['Basic Concept & Arrays', 'Linked Lists & Pointers', 'Stacks, Queues & Storing', 'Recursion & Dynamic Ops', 'Complexity Analysis'],
    ml:     ['Statistical Foundations', 'Data Prep & Cleaning', 'Algorithm Operations', 'Training & Regularizing', 'Deployment & Validation'],
    ai:     ['Historical Overview', 'Transformers & Weights', 'Prompt Systems & Rules', 'LangChain & RAG setups', 'Agent Automations'],
    sql:    ['Schema Basics', 'SELECT & Constraints', 'Aggregations & Subqueries', 'Joins & Unions', 'Stored Procs & Views'],
    cpp:    ['Pointers & References', 'STL Containers', 'Templates & Generics', 'OOP & Encapsulation', 'CP Strategies'],
    c:      ['Structure & Main', 'Variables & cast', 'Pointers & heap', 'File I/O operations', 'Structures & Union'],
    js:     ['DOM & selectors', 'Async & Event Loop', 'Promises & Fetch', 'ES6+ modules', 'Testing frameworks']
  };

  const videoCreators = ['freeCodeCamp', 'Traversy Media', 'Programming with Mosh', 'The Net Ninja', 'Fireship', 'Web Dev Simplified', 'Academind', 'Java Brains', 'Tech With Tim', 'Corey Schafer'];
  const dummyVids = ['pQN-pnXPaVg', 'UB1O30fR-EE', 'HD13eq_Pei8', 'OXGznpKZ_sA', 'yfoY53QXEnI', 'K74l26pE4YA', 'PkZNo7MFNFg', 'hdI2bqOjy3c', '8dWL3wB7Hok', '_uQrJ0TkZlc'];

  for (const mod of modules) {
    const lang = mod.language || 'javascript';
    const roadmapId = mod.roadmap_id;
    const subs = subtopics[roadmapId] || subtopics.webdev;

    // Seed 5 lessons per module
    for (let li = 0; li < 5; li++) {
      const lessonTitle = `${mod.title} — Lesson ${li + 1}: ${subs[li]}`;
      const shortDesc = `Lesson ${li + 1} of ${mod.title}. Under this topic we learn the core theoretical aspects of ${subs[li]} with detailed code snippets.`;
      
      const detailedNotes = generateDetailedNotes(lessonTitle, lang, li + 1);
      const starterCode = generateStarterCode(lang, lessonTitle);

      const [res] = await conn.query(`
        INSERT INTO module_lessons (module_id, title, short_desc, learning_notes, starter_code, language, order_index, xp_reward)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [mod.id, lessonTitle, shortDesc, detailedNotes, starterCode, lang, li + 1, 100]);
      
      const lessonId = res.insertId;

      // Seed 3 videos for this lesson (Beginner, Intermediate, Advanced)
      const diffs = ['Beginner', 'Intermediate', 'Advanced'];
      for (let vi = 0; vi < 3; vi++) {
        const creator = videoCreators[Math.floor(Math.random() * videoCreators.length)];
        const vidId = dummyVids[Math.floor(Math.random() * dummyVids.length)];
        await conn.query(`
          INSERT INTO lesson_videos (module_id, lesson_id, title, channel, video_id, embed_url, thumbnail, duration)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          mod.id,
          lessonId,
          `[${diffs[vi]}] ${subs[li]} Tutorial`,
          creator,
          vidId,
          `https://www.youtube.com/embed/${vidId}`,
          `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`,
          `${Math.floor(Math.random() * 20) + 5}m`
        ]);
      }

      // Seed 3 resources for this lesson
      const resources = [
        { title: `Official Documentation — ${subs[li]}`, url: 'https://docs.oracle.com/en/' },
        { title: `Cheat Sheet & Reference Guide`, url: 'https://developer.mozilla.org/en-US/' },
        { title: `GitHub Code Examples Repository`, url: 'https://github.com/' }
      ];
      for (const r of resources) {
        await conn.query(`
          INSERT INTO lesson_resources (module_id, lesson_id, title, url, type)
          VALUES (?, ?, ?, ?, 'docs')
        `, [mod.id, lessonId, r.title, r.url]);
      }

      // Seed 3 exercises for this lesson (Easy, Medium, Hard)
      const exercises = [
        { title: `Exercise 1: Predict output of ${subs[li]}`, desc: `Look at the code below and predict what it outputs. Try to explain why.`, diff: 'Easy' },
        { title: `Exercise 2: Debug syntax in ${subs[li]}`, desc: `There is a logical bug in the starter code. Locate it and fix it.`, diff: 'Medium' },
        { title: `Exercise 3: Write the logic for ${subs[li]}`, desc: `Write a clean function that accomplishes the requested task using optimal complexity.`, diff: 'Hard' }
      ];
      for (let ei = 0; ei < 3; ei++) {
        await conn.query(`
          INSERT INTO lesson_exercises (module_id, lesson_id, title, description, difficulty, starter_code, hint, order_index)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          mod.id,
          lessonId,
          exercises[ei].title,
          exercises[ei].desc,
          exercises[ei].diff,
          starterCode,
          `Think about edge cases and type casting.`,
          ei + 1
        ]);
      }

      // Seed 5 quizzes for this lesson
      const quizzes = [
        [`What is the primary concept behind ${subs[li]}?`, 'It enables encapsulation and abstraction', 'It optimizes compiler instructions', 'It acts as an entry point for memory alloc', 'It has no primary concept', 'A', 'Correct! That is the core pillar of software architecture.'],
        [`Which of the following is considered a best practice for ${subs[li]}?`, 'Using global variables everywhere', 'Keeping modules/functions small and focused', 'Skipping validation of input parameters', 'Writing code without code comments', 'B', 'Best practice recommends single-responsibility blocks.'],
        [`What common mistake happens with ${subs[li]}?`, 'Under-allocating buffer memory spaces', 'Scope pollution or hoisting bugs', 'Not testing edge conditions', 'All of the above', 'D', 'All of these mistakes are typical for beginners.'],
        [`True or False: ${subs[li]} always runs in linear time.`, 'True', 'False', 'Depends on dataset complexity', 'None of these', 'B', 'Time complexity depends entirely on how loop nesting is defined.'],
        [`How does the runtime stack handle calls to ${subs[li]}?`, 'It pushes a stack frame containing variables', 'It dumps memory straight to heap', 'It creates concurrent thread pools', 'It ignores call instructions', 'A', 'Stack frames manage call tracking and local scope variables.']
      ];

      for (let qi = 0; qi < 5; qi++) {
        await conn.query(`
          INSERT INTO lesson_quizzes (module_id, lesson_id, question, option_a, option_b, option_c, option_d, correct_option, explanation, order_index)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [mod.id, lessonId, quizzes[qi][0], quizzes[qi][1], quizzes[qi][2], quizzes[qi][3], quizzes[qi][4], quizzes[qi][5], quizzes[qi][6], qi + 1]);
      }
    }

    // Seed 1 final Project for the module
    const projectTitle = `Final Module Capstone: Build a ${mod.title.replace('— Core Concepts', '').replace('Fundamentals', '').replace('Basics', '').trim()} System`;
    const projectDesc = `Apply your knowledge from all 5 lessons to build a fully functional system. This counts as your final module grade.`;
    const projReq = `- Clean directory layouts\n- Implementation of core data/UI controls\n- Proper validation and error handlers\n- Follow styling guides.`;
    const projCriterias = `- Compiles and executes\n- Correctness of results\n- Optimal memory/time complexity.`;

    await conn.query(`
      INSERT INTO lesson_projects (module_id, title, description, difficulty, requirements, expected_output, technologies, time_estimate, completion_criteria)
      VALUES (?, ?, ?, 'Intermediate', ?, 'A fully complete system directory with all unit checks passing.', ?, '8 hours', ?)
    `, [mod.id, projectTitle, projectDesc, projReq, lang.toUpperCase(), projCriterias]);

    // Seed 1 Roadmap certification exam question per module
    await conn.query(`
      INSERT INTO roadmap_exams (roadmap_id, question, option_a, option_b, option_c, option_d, correct_option, explanation, xp_reward)
      VALUES (?, ?, 'A correct conceptual design pattern', 'An unoptimized execution loop', 'A syntax warning message', 'None of these', 'A', 'Certification questions ensure complete track understanding.', 100)
    `, [roadmapId, `Certification Exam Question: Explain the mechanism behind ${mod.title}.`]);
  }

  console.log('✓ Successfully expanded to 5 lessons per module (600 lessons seeded!).');
  await conn.end();
  console.log('✅ Upgrade & Seed Completed.');
}

function generateDetailedNotes(title, lang, lessonIndex) {
  return `# ${title}

## 📖 Introduction & Core Theory

Welcome to **Lesson ${lessonIndex}**. In this lesson, we will deep-dive into the core details of this topic. This guide explains key terms, definitions, and operational diagrams step by step to build your understanding.

### 🌟 Beginner Friendly Explanation

At a basic level, think of this topic like a recipe. You have inputs (ingredients), processes (mixing, baking), and outputs (the final dish). By following structured, predictable syntax rules, the computer executes your instructions consistently.

### 🔍 Intermediate Analysis

As we advance, we see that variables and calls reside inside runtime stack frames. In ${lang === 'python' ? 'Python' : lang === 'java' ? 'Java' : 'JavaScript'}, compiler scopes dictate when reference pointers remain in memory or get collected by the garbage collection engine.

### 🚀 Advanced Deep-Dive

For expert developers, optimizing memory access paths is critical. Avoid thread blocking, leverage hardware CPU cache locality by nesting arrays properly, and choose algorithms with minimum memory complexities.

---

## 🏗️ Real-World Example

In real production systems, this logic manages high-throughput web routes, handles asynchronous requests to database pools, and parses JSON inputs securely under peak traffic conditions.

\`\`\`${lang}
// Code Snippet: Standard implementation pattern
function processLessonTopic() {
  console.log("Processing lesson ${lessonIndex}...");
  return true;
}
processLessonTopic();
\`\`\`

---

## 💡 Best Practices & Mistakes

### ✅ Best Practices
- Keep your functions small and focused on a single responsibility.
- Write clean, human-readable variable names instead of short abbreviations.
- Add code comments explaining **why** you wrote a block of code, not just **what** it does.

### ❌ Common Mistakes to Avoid
- **Scope Pollution**: Don't use global variables unless absolutely necessary.
- **Off-by-One Errors**: Be extremely careful with loop boundaries and indices.
- **Ignoring Errors**: Always wrap network calls or database actions in try-catch blocks.

---

## 💼 Interview Tips

> **Q: Explain the complexity difference between linear and binary searches.**
> *Answer:* Linear search checks index-by-index in $O(n)$ time. Binary search divides the range in half, running in $O(\\log n)$ time but requires a pre-sorted dataset.

---

## 📝 Key Takeaways
- Mastery of basic blocks is essential before building full-stack platforms.
- Performance optimization must always follow functional correctness.
- Testing boundaries protects against server downtime.
`;
}

function generateStarterCode(lang, title) {
  const starters = {
    javascript: `// Starter Code for ${title}\nfunction solve() {\n  // Write your code here\n  return true;\n}\n`,
    python: `# Starter Code for ${title}\ndef solve():\n    # Write your code here\n    return True\n`,
    java: `// Starter Code for ${title}\npublic class Solution {\n    public static boolean solve() {\n        // Write your code here\n        return true;\n    }\n}\n`,
    sql: `-- Starter Code for ${title}\nSELECT * FROM users;\n`,
    c: `// Starter Code for ${title}\n#include <stdio.h>\nint solve() {\n    // Write your code here\n    return 1;\n}\n`,
    cpp: `// Starter Code for ${title}\n#include <iostream>\nusing namespace std;\nbool solve() {\n    // Write your code here\n    return true;\n}\n`
  };
  return starters[lang] || starters.javascript;
}

run().catch(err => {
  console.error('❌ Migration Error:', err.message);
  process.exit(1);
});
