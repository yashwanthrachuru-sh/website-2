// ============================================================
// backend/verify_assemblers.js
// Audits all custom lesson assemblers to ensure they return
// fully populated, valid structures that conform to the schema.
// ============================================================
'use strict';

const assemblePythonIntroduction = require('./services/lessonAssembler/python/pythonIntroduction');
const assembleVariables = require('./services/lessonAssembler/python/variables');
const assembleConstants = require('./services/lessonAssembler/python/constants');
const assembleIfStatements = require('./services/lessonAssembler/python/ifStatement');
const assembleLoops = require('./services/lessonAssembler/python/loops');
const assembleFunctions = require('./services/lessonAssembler/python/functions');
const assembleArrays = require('./services/lessonAssembler/python/arrays');
const assembleClasses = require('./services/lessonAssembler/python/classes');
const assembleObjects = require('./services/lessonAssembler/python/objects');
const assembleSQLJoin = require('./services/lessonAssembler/sql/join');
const assembleRESTAPI = require('./services/lessonAssembler/web/restApi');
const assembleJSON = require('./services/lessonAssembler/web/json');
const assembleHTTP = require('./services/lessonAssembler/web/http');

const assemblers = {
  pythonIntroduction: () => assemblePythonIntroduction(),
  variables:           () => assembleVariables('javascript'),
  constants:           () => assembleConstants('javascript'),
  ifStatement:         () => assembleIfStatements('javascript'),
  loops:               () => assembleLoops('javascript'),
  functions:           () => assembleFunctions('javascript'),
  arrays:              () => assembleArrays('javascript'),
  classes:             () => assembleClasses('javascript'),
  objects:             () => assembleObjects('javascript'),
  join:                () => assembleSQLJoin(),
  restApi:             () => assembleRESTAPI(),
  json:                () => assembleJSON(),
  http:                () => assembleHTTP(),
};

const REQUIRED_KEYS = [
  'definition', 'why_exists', 'importance', 'learning_objectives',
  'beginner_explanation', 'detailed_concept', 'internal_working',
  'syntax_breakdown', 'visual_flow', 'real_world_analogies',
  'beginner_example', 'intermediate_example', 'advanced_example',
  'production_example', 'line_by_line', 'common_mistakes',
  'best_practices', 'performance', 'interview_questions',
  'faqs', 'mcqs', 'coding_practice', 'debugging_exercises',
  'project_ideas', 'summary', 'key_takeaways', 'related_topics',
  'next_learning_path'
];

const VISUAL_KEYS = [
  'memoryDiagram', 'executionStepper', 'checkpointQuestions', 'gradualCode'
];

console.log('====================================================');
console.log(' EduNet Assemblers Quality Audit');
console.log('====================================================\n');

for (const [name, fn] of Object.entries(assemblers)) {
  console.log(`Checking assembler: "${name}"`);
  try {
    const lesson = fn();
    
    // Check standard keys
    const missing = [];
    const empty = [];
    const placeholders = [];
    
    for (const key of REQUIRED_KEYS) {
      const val = lesson[key];
      if (val === undefined) {
        missing.push(key);
      } else if (val === null || String(val).trim().length === 0) {
        empty.push(key);
      } else if (String(val).toLowerCase().includes('placeholder') || String(val).toLowerCase().includes('todo') || String(val).toLowerCase().includes('coming soon')) {
        placeholders.push(key);
      }
    }
    
    // Check visual keys
    const missingVisual = [];
    const malformedVisual = [];
    for (const key of VISUAL_KEYS) {
      const val = lesson[key];
      if (val === null || val === undefined) {
        missingVisual.push(key);
      } else {
        try {
          JSON.parse(val);
        } catch (err) {
          malformedVisual.push(`${key} (${err.message})`);
        }
      }
    }
    
    if (missing.length > 0) console.log(`  ❌ Missing standard keys: ${missing.join(', ')}`);
    if (empty.length > 0) console.log(`  ⚠️  Empty standard keys: ${empty.join(', ')}`);
    if (placeholders.length > 0) console.log(`  ⚠️  Placeholder values: ${placeholders.join(', ')}`);
    if (missingVisual.length > 0) console.log(`  ⚠️  Missing visual keys: ${missingVisual.join(', ')}`);
    if (malformedVisual.length > 0) console.log(`  ❌ Malformed JSON visual keys: ${malformedVisual.join(', ')}`);
    
    if (missing.length === 0 && empty.length === 0 && placeholders.length === 0 && missingVisual.length === 0 && malformedVisual.length === 0) {
      console.log('  ✅ 100% PERFECT conformance');
    }
  } catch (err) {
    console.log(`  ❌ Failed execution: ${err.message}`);
  }
  console.log('');
}
