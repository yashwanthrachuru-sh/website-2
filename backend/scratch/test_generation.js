// ============================================================
// backend/scratch/test_generation.js
// Test Generation & Seeding script for representative concepts
// ============================================================
'use strict';

const contentEngine = require('../services/contentEngine');

const conceptsToTest = [
  { topic: 'Python Introduction', lang: 'python' },
  { topic: 'Variables', lang: 'python' },
  { topic: 'Constants', lang: 'javascript' },
  { topic: 'If Statements', lang: 'python' },
  { topic: 'Loops', lang: 'python' },
  { topic: 'Functions', lang: 'javascript' },
  { topic: 'Arrays', lang: 'javascript' },
  { topic: 'Objects', lang: 'javascript' },
  { topic: 'Classes', lang: 'javascript' },
  { topic: 'SQL JOIN', lang: 'sql' },
  { topic: 'REST API', lang: 'javascript' },
  { topic: 'JSON', lang: 'javascript' }
];

async function run() {
  console.log('🏁 Seeding and validating representative concepts...');
  
  for (const item of conceptsToTest) {
    console.log(`\n⏳ Generating concept: "${item.topic}" in language: "${item.lang}"`);
    try {
      const data = await contentEngine.generateFullLessonContent(item.topic, item.lang);
      console.log(`✅ Success! Generated keys: [${Object.keys(data).join(', ')}]`);
      console.log(`📝 Real-life Analogy: "${data.real_world_analogies.substring(0, 120)}..."`);
      console.log(`📝 Behind the Scenes preview: "${data.internal_working.substring(0, 120)}..."`);
      console.log(`📝 Level 1 Example: \n${data.beginner_example}\n`);
    } catch (e) {
      console.error(`❌ Failed generating: ${item.topic}`, e);
    }
  }
  
  console.log('\n🎉 Finished representative concept generation.');
}

run();
