// ============================================================
// backend/scratch/verify_test.js
// Tests the LessonGenerator and Validator on a single curriculum JSON.
// ============================================================
'use strict';

const CurriculumLoader = require('../curriculum/engine/CurriculumLoader');
const LessonGenerator = require('../curriculum/engine/LessonGenerator');
const validator = require('../services/validator');

const rm = CurriculumLoader.loadRoadmap('python');
if (!rm) {
  console.error('Roadmap not found!');
  process.exit(1);
}

const lessonDef = rm.modules[0].lessons[0];
console.log('Testing lesson:', lessonDef.title);

const content = LessonGenerator.generateLessonContent(lessonDef, 'python');
console.log('Generated content length:', content.length);

// Parse the structured content to pass to validator
const result = {};
const sectionPattern = /<!--SECTION:(\w+)-->([\s\S]*?)<!--\/SECTION:\1-->/g;
let match;
while ((match = sectionPattern.exec(content)) !== null) {
  result[match[1]] = match[2].trim();
}

console.log('Parsed sections:', Object.keys(result));

const valResult = validator.validateLesson(result);
console.log('Validation passed:', valResult.passed);
if (!valResult.passed) {
  console.error('Validation errors:', valResult.errors);
  console.warn('Validation warnings:', valResult.warnings);
} else {
  console.log('Success! No errors.');
  console.log('Warnings:', valResult.warnings);
}
process.exit(valResult.passed ? 0 : 1);
