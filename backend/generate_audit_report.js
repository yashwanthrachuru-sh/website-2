// ============================================================
// backend/generate_audit_report.js
// Audits DB lessons for empty modules, duplicates, and coverage.
// ============================================================
'use strict';
require('dotenv').config();
const db = require('./config/db');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function run() {
  console.log('Starting Curriculum Audit...');
  
  // 1. Fetch all lessons
  const [lessons] = await db.query(`
    SELECT ml.id, ml.title, ml.language, ml.learning_notes,
           rm.title AS module_title, rm.id AS module_id,
           r.title AS roadmap_title, r.id AS roadmap_id
    FROM module_lessons ml
    JOIN roadmap_modules rm ON ml.module_id = rm.id
    JOIN roadmaps r ON rm.roadmap_id = r.id
    ORDER BY r.id, rm.order_index, ml.order_index
  `);
  
  console.log(`Loaded ${lessons.length} lessons from database.`);

  // 2. Analyze duplicates
  const hashGroups = {};
  const byteGroups = {};
  const emptyLessons = [];
  const validLessons = [];
  
  for (const lesson of lessons) {
    const notes = lesson.learning_notes || '';
    if (!notes || notes.trim() === '' || !notes.includes('<!--EDUNET_STRUCTURED_V1-->')) {
      emptyLessons.push(lesson);
      continue;
    }
    
    // Hash the definition and summary to detect similarity
    const defMatch = notes.match(/<!--SECTION:definition-->([\s\S]*?)<!--\/SECTION:definition-->/);
    const sumMatch = notes.match(/<!--SECTION:summary-->([\s\S]*?)<!--\/SECTION:summary-->/);
    
    const defText = defMatch ? defMatch[1].trim() : '';
    const sumText = sumMatch ? sumMatch[1].trim() : '';
    
    const hash = crypto.createHash('md5').update(defText + '|||' + sumText).digest('hex');
    const byteLen = notes.length;
    
    if (!hashGroups[hash]) hashGroups[hash] = [];
    hashGroups[hash].push(lesson);
    
    if (!byteGroups[byteLen]) byteGroups[byteLen] = [];
    byteGroups[byteLen].push(lesson);
    
    validLessons.push(lesson);
  }
  
  // Find duplicate groups
  const duplicatesByHash = Object.values(hashGroups).filter(g => g.length > 1);
  const duplicatesByByte = Object.values(byteGroups).filter(g => g.length > 1 && g[0].learning_notes.length > 1000);
  
  console.log(`Found ${emptyLessons.length} empty or unstructured lessons.`);
  console.log(`Found ${duplicatesByHash.length} distinct duplicate content hash groups.`);
  console.log(`Found ${duplicatesByByte.length} distinct duplicate byte size groups.`);

  // Write reports
  const reportDir = '/home/asta/.gemini/antigravity-ide/brain/9c0fb410-2caf-48e2-add9-733ccf3d3f4d';
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  // Generate audit report contents
  const auditReport = `# Curriculum Audit Report
Generated At: ${new Date().toISOString()}

## Dependency Graph of Pipeline Layers
\`\`\`mermaid
graph TD
  A[contentEngine.js / Client API] --> B[lessonAssembler.js]
  B --> C[domainDetector.js]
  B --> D[conceptDetector.js]
  B --> E[focusProfiles.js]
  B --> F[languageProfiles.js]
  B --> G[conceptProfiles.js]
  B --> H[lessonComposer.js]
  H --> I[validator.js]
  I --> J[(MySQL Database)]
\`\`\`

## Roadmap & Lesson Coverage Summary
| Roadmap | Total Lessons | Structured | Empty/Invalid | Duplicates |
${Array.from(new Set(lessons.map(l => l.roadmap_id))).map(rid => {
  const rLessons = lessons.filter(l => l.roadmap_id === rid);
  const rEmpty = rLessons.filter(l => !l.learning_notes || !l.learning_notes.includes('<!--EDUNET_STRUCTURED_V1-->')).length;
  const rTotal = rLessons.length;
  const rStruct = rTotal - rEmpty;
  // count duplicates in this roadmap
  let dupCount = 0;
  rLessons.forEach(l => {
    const notes = l.learning_notes || '';
    const defMatch = notes.match(/<!--SECTION:definition-->([\s\S]*?)<!--\/SECTION:definition-->/);
    const sumMatch = notes.match(/<!--SECTION:summary-->([\s\S]*?)<!--\/SECTION:summary-->/);
    const defText = defMatch ? defMatch[1].trim() : '';
    const sumText = sumMatch ? sumMatch[1].trim() : '';
    const hash = crypto.createHash('md5').update(defText + '|||' + sumText).digest('hex');
    if (hashGroups[hash] && hashGroups[hash].length > 1) {
      dupCount++;
    }
  });
  return `| ${rid} | ${rTotal} | ${rStruct} | ${rEmpty} | ${dupCount} |`;
}).join('\n')}

## Top Duplication Clusters
${duplicatesByHash.slice(0, 10).map((g, i) => {
  return `### Group ${i + 1} (Hash: ${g[0].id}, Count: ${g.length}, Length: ${g[0].learning_notes.length} bytes)
Sample title: "${g[0].roadmap_title} - ${g[0].module_title} - ${g[0].title}"
Matching lessons:
${g.map(l => `- [ID ${l.id}] ${l.roadmap_id} > ${l.module_title} > ${l.title}`).join('\n')}
`;
}).join('\n')}

## Empty or Unstructured Lessons
${emptyLessons.map(l => `- [ID ${l.id}] ${l.roadmap_id} > ${l.module_title} > ${l.title} (${l.language || 'none'})`).join('\n')}
`;

  fs.writeFileSync(path.join(reportDir, 'curriculum_audit_report.md'), auditReport);
  console.log('Written curriculum_audit_report.md');
  
  // Write duplicate report
  const dupReport = `# Duplicate Lesson Report
Generated At: ${new Date().toISOString()}

Total duplicate groups: ${duplicatesByHash.length}
Total duplicate lessons involved: ${duplicatesByHash.reduce((sum, g) => sum + g.length, 0)}

${duplicatesByHash.map((g, i) => {
  return `## Duplicate Cluster #${i+1}
- Unique Identifier Hash: ${crypto.createHash('md5').update(g[0].learning_notes).digest('hex').substring(0, 8)}
- Content Byte Size: ${g[0].learning_notes.length}
- Lessons affected:
${g.map(l => `  - **ID ${l.id}**: ${l.roadmap_id} -> ${l.module_title} -> ${l.title}`).join('\n')}
`;
}).join('\n')}
`;
  fs.writeFileSync(path.join(reportDir, 'duplicate_lesson_report.md'), dupReport);
  console.log('Written duplicate_lesson_report.md');

  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
