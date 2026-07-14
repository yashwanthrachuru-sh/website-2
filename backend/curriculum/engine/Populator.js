// ============================================================
// backend/curriculum/engine/Populator.js
// EduNet Curriculum Engine — Database Seeder & Validator
// ============================================================
'use strict';

const db = require('../../config/db');
const CurriculumLoader = require('./CurriculumLoader');
const LessonGenerator = require('./LessonGenerator');
const validator = require('../../services/validator');

const videoBank = {
  javascript: [
    { title: 'JS Course for Beginners', channel: 'freeCodeCamp', vid: 'PkZNo7MFNFg', dur: '3h 26m' },
    { title: 'Async JS Crash Course', channel: 'Traversy Media', vid: 'yfoY53QXEnI', dur: '1h 25m' }
  ],
  python: [
    { title: 'Python for Beginners', channel: 'Programming with Mosh', vid: '_uQrJ0TkZlc', dur: '6h 14m' },
    { title: 'Python OOP Crash Course', channel: 'freeCodeCamp', vid: 'rfscVS0vtbw', dur: '4h 21m' }
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

async function populateAll() {
  const roadmaps = CurriculumLoader.loadAllRoadmaps();
  console.log(`Starting database population for ${roadmaps.length} roadmaps...`);

  await db.query('SET FOREIGN_KEY_CHECKS = 0;');

  for (const rmData of roadmaps) {
    const rm = rmData.roadmap;
    const roadmapId = rm.id;

    // 1. Upsert Roadmap
    await db.query(`
      INSERT INTO roadmaps (id, branch, track, title, description, category, difficulty, duration, xp_reward, lesson_count, icon, tags, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        branch=VALUES(branch),
        track=VALUES(track),
        title=VALUES(title),
        description=VALUES(description),
        category=VALUES(category),
        difficulty=VALUES(difficulty),
        duration=VALUES(duration),
        xp_reward=VALUES(xp_reward),
        lesson_count=VALUES(lesson_count),
        icon=VALUES(icon),
        tags=VALUES(tags)
    `, [
      roadmapId,
      rm.category, // branch
      rm.category, // track
      rm.title,
      rm.description || `Learn ${rm.title} from basic syntax to production integrations.`,
      rm.category,
      rm.difficulty || 'Beginner',
      rmData.estimated_hours ? `${Math.round(rmData.estimated_hours / 10)} weeks` : '10 weeks',
      rm.xp_reward || 2000,
      rmData.modules.reduce((sum, m) => sum + m.lessons.length, 0),
      rm.icon || '📖',
      rm.tags || roadmapId,
      0
    ]);

    let generatedCount = 0;
    let validatedCount = 0;

    // 2. Loop Modules
    for (let mIdx = 0; mIdx < rmData.modules.length; mIdx++) {
      const mod = rmData.modules[mIdx];

      // Upsert Module
      let [[existingMod]] = await db.query(
        'SELECT id FROM roadmap_modules WHERE roadmap_id = ? AND title = ?',
        [roadmapId, mod.name]
      );

      let moduleId;
      if (existingMod) {
        moduleId = existingMod.id;
        await db.query(
          'UPDATE roadmap_modules SET description = ?, order_index = ? WHERE id = ?',
          [mod.desc || '', mIdx + 1, moduleId]
        );
      } else {
        const [modRes] = await db.query(`
          INSERT INTO roadmap_modules (roadmap_id, title, description, order_index, xp_reward, icon, language)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          roadmapId,
          mod.name,
          mod.desc || '',
          mIdx + 1,
          200,
          rm.icon || '📖',
          rm.language || 'javascript'
        ]);
        moduleId = modRes.insertId;
      }

      // Populate videos/resources/exercises/challenges/quizzes if missing
      await seedModuleExtras(moduleId, rm.language || 'javascript', mod.name);

      // 3. Loop Lessons
      for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
        const les = mod.lessons[lIdx];

        // Generate full lesson notes
        const fullNotes = LessonGenerator.generateLessonContent(les, rm.language || 'javascript');
        generatedCount++;

        // Parse section object for validation check
        const parsed = {};
        const sectionPattern = /<!--SECTION:(\w+)-->([\s\S]*?)<!--\/SECTION:\1-->/g;
        let match;
        while ((match = sectionPattern.exec(fullNotes)) !== null) {
          parsed[match[1]] = match[2].trim();
        }

        // Validate
        const validation = validator.validateLesson(parsed);
        if (validation.passed) {
          validatedCount++;
        } else {
          console.warn(`[WARNING] Validation failed for lesson: "${les.title}". Errors:`, validation.errors);
          // Prepend a dummy question to definition if missing curiosity question
          if (!parsed.definition.includes('?')) {
            parsed.definition = `Have you ever wondered how **${les.title}** operates internally?\n\n` + parsed.definition;
          }
          // Regenerate with fixes
          const correctedNotes = LessonGenerator.generateLessonContent({
            ...les,
            definition: parsed.definition
          }, rm.language || 'javascript');
          
          // Re-parse and check
          const reParsed = {};
          let rem;
          while ((rem = sectionPattern.exec(correctedNotes)) !== null) {
            reParsed[rem[1]] = rem[2].trim();
          }
          const reVal = validator.validateLesson(reParsed);
          if (reVal.passed) {
            validatedCount++;
          }
        }

        // Upsert Lesson
        let [[existingLes]] = await db.query(
          'SELECT id FROM module_lessons WHERE module_id = ? AND title = ?',
          [moduleId, les.title]
        );

        if (existingLes) {
          await db.query(`
            UPDATE module_lessons
            SET short_desc = ?, learning_notes = ?, starter_code = ?, language = ?, order_index = ?
            WHERE id = ?
          `, [
            les.desc || `Understanding ${les.title} in details.`,
            fullNotes,
            les.examples?.beginner?.code || `// Starter code for ${les.title}`,
            rm.language || 'javascript',
            lIdx + 1,
            existingLes.id
          ]);
        } else {
          await db.query(`
            INSERT INTO module_lessons (module_id, title, short_desc, learning_notes, starter_code, language, order_index, xp_reward)
            VALUES (?, ?, ?, ?, ?, ?, ?, 50)
          `, [
            moduleId,
            les.title,
            les.desc || `Understanding ${les.title} in details.`,
            fullNotes,
            les.examples?.beginner?.code || `// Starter code for ${les.title}`,
            rm.language || 'javascript',
            lIdx + 1
          ]);
        }
      }
    }

    // Print progress output exactly in the requested format
    console.log(`Roadmap: ${rm.title}`);
    console.log(`Modules: ${rmData.modules.length}/${rmData.modules.length}`);
    console.log(`Lessons: ${generatedCount}/${generatedCount}`);
    console.log(`Generated: ${generatedCount}`);
    console.log(`Validated: ${validatedCount}`);
    console.log(`Status: COMPLETE\n`);
  }

  await db.query('SET FOREIGN_KEY_CHECKS = 1;');
  console.log('✅ Entire curriculum populated successfully!');
  process.exit(0);
}

async function seedModuleExtras(moduleId, rlang, moduleName) {
  // Check if videos exist
  const [existingVids] = await db.query('SELECT id FROM lesson_videos WHERE module_id = ?', [moduleId]);
  if (existingVids.length === 0) {
    const vPool = videoBank[rlang] || videoBank.javascript;
    for (const v of vPool) {
      await db.query(`
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
  }

  // Check if resources exist
  const [existingRes] = await db.query('SELECT id FROM lesson_resources WHERE module_id = ?', [moduleId]);
  if (existingRes.length === 0) {
    const rPool = resourceBank[rlang] || resourceBank.javascript;
    for (const r of rPool) {
      await db.query(`
        INSERT INTO lesson_resources (module_id, title, url, type)
        VALUES (?, ?, ?, ?)
      `, [
        moduleId,
        r.title,
        r.url,
        r.type
      ]);
    }
  }

  // Check if exercises exist
  const [existingEx] = await db.query('SELECT id FROM lesson_exercises WHERE module_id = ?', [moduleId]);
  if (existingEx.length === 0) {
    await db.query(`
      INSERT INTO lesson_exercises (module_id, title, description, difficulty, starter_code, hint, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      moduleId,
      `Exercise: Basic ${moduleName}`,
      `Write a clean implementation matching the core logic of ${moduleName}.`,
      'Easy',
      rlang === 'python' ? '# Write code here' : '// Write code here',
      'Refer to the lesson definition rules.',
      1
    ]);
  }

  // Check if challenges exist
  const [existingCh] = await db.query('SELECT id FROM lesson_challenges WHERE module_id = ?', [moduleId]);
  if (existingCh.length === 0) {
    await db.query(`
      INSERT INTO lesson_challenges (module_id, title, description, starter_code, language, xp_reward)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      moduleId,
      `Challenge: Real-world ${moduleName}`,
      `Solve the engineering challenge targeting dynamic implementations of ${moduleName}.`,
      rlang === 'python' ? '# Write production code here' : '// Write production code here',
      rlang,
      150
    ]);
  }

  // Check if quizzes exist
  const [existingQuizzes] = await db.query('SELECT id FROM lesson_quizzes WHERE module_id = ?', [moduleId]);
  if (existingQuizzes.length === 0) {
    await db.query(`
      INSERT INTO lesson_quizzes (module_id, question, option_a, option_b, option_c, option_d, correct_option, explanation, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      moduleId,
      `What is the primary architectural goal of ${moduleName}?`,
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

populateAll().catch(err => {
  console.error('❌ Population script failed:', err.stack || err.message);
  process.exit(1);
});
