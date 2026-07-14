// ============================================================
// backend/services/validator.js
// EduNet Human Teaching Engine v6.1 — Lesson Quality Validator
// ============================================================
'use strict';

const BANNED_PHRASES = [
  // Classic AI filler
  'at its heart',
  'understanding this concept',
  'in simple words',
  'today we are going to learn',
  "let's understand",
  'this concept simply',
  'super cool',
  'basically',
  'it is important to note',
  "now let's dive in",
  // v6.1 additions
  "let's learn",
  "in this lesson we will",
  "today we will learn",
  "this concept is",
  "now let's",
  "let me explain",
  "as you can see",
  "as we discussed",
  "moving on",
  "in conclusion",
  "in summary",
  "to summarize",
  "as mentioned above",
  "as stated before",
  "it should be noted"
];

// Headers that indicate documentation-style layout rather than teaching narrative
const DOCUMENTATION_HEADERS = [
  '## Why This Concept Exists',
  '## How It Works',
  '## Learning Objectives',
  '## Introduction',
  '## Overview',
  '## Definition',
  '## Description',
  '## What Is',
  '## What are',
  '## Syntax Overview',
];

/**
 * Validates a generated lesson against the full v6.1 quality checklist.
 * @param {Object} sections - Key-value map of lesson sections.
 * @returns {Object} Validation results { passed: boolean, errors: Array, warnings: Array }
 */
function validateLesson(sections) {
  const errors   = [];
  const warnings = [];

  if (!sections) {
    errors.push('CRITICAL: Lesson content is empty or null.');
    return { passed: false, errors, warnings };
  }

  const serialized = JSON.stringify(sections).toLowerCase();

  // ── Rule 1: Definition must NOT open with "A [topic] is..." ─────────────
  if (sections.definition) {
    const defStart = sections.definition.replace(/[#*`\n]/g, '').trim();
    if (/^(a|an)\s+\w[\w\s]*\s+(is|are)\s+/i.test(defStart)) {
      errors.push('CRITICAL: Lesson opens with "A [X] is..." — must begin with curiosity or a real-world situation.');
    }
  }

  // ── Rule 2: Curiosity check — at least one question in definition ────────
  if (!sections.definition || !sections.definition.includes('?')) {
    errors.push('CRITICAL: No curiosity question found in definition section. The lesson must create curiosity before explaining anything.');
  }

  // ── Rule 3: Behind the Scenes required and non-trivial ──────────────────
  if (!sections.detailed_concept || sections.detailed_concept.replace(/[#*`\s]/g, '').length < 100) {
    errors.push('CRITICAL: "Behind the Scenes" section (detailed_concept) is missing or too sparse. Must explain RAM, Call Stack, PVM, CPU registers, or Query Planner behavior.');
  }

  // ── Rule 4: Real-world problem required ─────────────────────────────────
  if (!sections.why_exists || sections.why_exists.replace(/[#*`\s]/g, '').length < 60) {
    errors.push('CRITICAL: Missing real-world problem statement (why_exists). Students must understand WHY before WHAT.');
  }

  // ── Rule 5: Execution walkthrough required ──────────────────────────────
  if (!sections.line_by_line || sections.line_by_line.replace(/[#*`\s]/g, '').length < 60) {
    errors.push('CRITICAL: Missing execution walkthrough (line_by_line). Students must watch the program execute step-by-step.');
  }

  // ── Rule 6: No documentation-style section headers ──────────────────────
  const fullText = JSON.stringify(sections);
  for (const header of DOCUMENTATION_HEADERS) {
    if (fullText.includes(header)) {
      errors.push(`CRITICAL: Found documentation-style header "${header}". Replace with teaching narrative.`);
    }
  }

  // ── Rule 7: Banned AI phrases ───────────────────────────────────────────
  for (const phrase of BANNED_PHRASES) {
    if (serialized.includes(phrase.toLowerCase())) {
      errors.push(`Banned phrase found: "${phrase}" — sounds AI-generated, not human teaching.`);
    }
  }

  // ── Rule 8: Generic variable names in code blocks ───────────────────────
  const codeBlockPattern = /```(?:[a-zA-Z]+)?\n?([\s\S]*?)```/g;
  let match;
  while ((match = codeBlockPattern.exec(fullText)) !== null) {
    const code = match[1].toLowerCase();
    if (/\b(?:let|var|const|def|int|string)\s+(?:x|y|z|abc|test|hello|foo|bar|temp|val|num|str)\b/.test(code) ||
        /\b(?:x|y|z|abc|foo|bar|temp)\s*=\s*/.test(code)) {
      errors.push('Generic variable name found (x, y, z, abc, foo, bar, temp) in code block. Use meaningful names like student_marks, bank_balance, shopping_cart.');
    }
  }

  // ── Rule 9: Required sections present ───────────────────────────────────
  const required = [
    'definition', 'why_exists', 'beginner_explanation', 'detailed_concept',
    'internal_working', 'visual_flow', 'real_world_analogies',
    'beginner_example', 'line_by_line', 'common_mistakes',
    'best_practices', 'interview_questions', 'summary'
  ];
  for (const key of required) {
    if (!sections[key] || sections[key].replace(/[#*`\s]/g, '').length < 20) {
      warnings.push(`Sparse or missing required section: "${key}"`);
    }
  }

  // ── Rule 10: Practical examples required ────────────────────────────────
  if (!sections.intermediate_example || !sections.advanced_example) {
    warnings.push('Missing practical/advanced examples. Lessons need beginner → practical → real-world progression.');
  }

  // ── Rule 11: Interview questions required ────────────────────────────────
  if (!sections.interview_questions || sections.interview_questions.replace(/[#*`\s]/g, '').length < 40) {
    warnings.push('Interview questions section is too sparse. Must include at least 2 Q&A pairs.');
  }

  // ── Rule 12: Definition should not be excessively long ──────────────────
  if (sections.definition) {
    const plain = sections.definition.replace(/[#*`]/g, '');
    const sentences = plain.split(/[.!?]+/).filter(s => s.trim().length > 5);
    if (sentences.length > 12) {
      warnings.push(`Definition section has ${sentences.length} sentences — keep the curiosity section focused (max ~10 sentences).`);
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings
  };
}

module.exports = {
  validateLesson,
  BANNED_PHRASES,
  DOCUMENTATION_HEADERS
};
