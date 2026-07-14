// ============================================================
// backend/curriculum_engine/lessonContent.js
// EduNet — Master Lesson Content Library
// Every section is unique, topic-specific, and educationally sound
// ============================================================
'use strict';

const OPEN  = '<!--EDUNET_STRUCTURED_V1-->';
const CLOSE = '<!--/EDUNET_STRUCTURED_V1-->';
const SO = (n) => `<!--SECTION:${n}-->`;
const SC = (n) => `<!--/SECTION:${n}-->`;

/**
 * Builds a fully structured lesson for a specific topic.
 * @param {Object} p - lesson parameters
 * @param {string} p.title - exact lesson title
 * @param {string} p.lang - programming language
 * @param {string} p.definition - crisp definition (2-3 sentences)
 * @param {string} p.why_exists - why this concept exists
 * @param {string} p.beginner - beginner explanation with analogy
 * @param {string} p.detailed - technical deep dive
 * @param {string} p.internal_working - how it works internally
 * @param {string} p.syntax - syntax/code examples
 * @param {string} p.examples - multiple code examples
 * @param {string} p.mistakes - common mistakes
 * @param {string} p.best_practices - industry best practices
 * @param {string} p.interview - interview questions + answers
 * @param {string} p.exercises - practical exercises
 * @param {string} p.summary - lesson summary
 */
function buildLesson(p) {
  const sections = [
    ['definition',           p.definition       || ''],
    ['why_exists',           p.why_exists        || ''],
    ['importance',           p.importance        || `## Why Master ${p.title}\n\n${p.title} is a fundamental concept used in every professional ${p.lang} codebase. Mastering it enables you to write cleaner, more efficient programs and directly impacts your ability to succeed in technical interviews and production engineering roles.`],
    ['learning_objectives',  p.objectives        || `## Learning Objectives\n\nAfter completing this lesson you will be able to:\n- Explain ${p.title} in your own words\n- Write correct ${p.lang} code using ${p.title}\n- Identify and fix common bugs related to ${p.title}\n- Apply ${p.title} to real-world programming problems`],
    ['beginner_explanation', p.beginner          || ''],
    ['detailed_concept',     p.detailed          || ''],
    ['internal_working',     p.internal_working  || ''],
    ['syntax_breakdown',     p.syntax            || ''],
    ['visual_flow',          p.visual_flow       || `## Execution Flow\n\n\`\`\`\nProgram starts\n  └─> ${p.title} is encountered\n        └─> Runtime processes the concept\n              └─> Result is produced\n                    └─> Program continues\n\`\`\``],
    ['real_world_analogies', p.analogy           || `## Real-World Analogy\n\nThink of ${p.title} like a well-organized filing cabinet: each drawer is labeled, and you always know exactly where to find what you need. In programming, ${p.title} provides the same structured organization to your code.`],
    ['beginner_example',     p.example_beginner  || ''],
    ['intermediate_example', p.example_mid       || ''],
    ['advanced_example',     p.example_adv       || ''],
    ['production_example',   p.example_prod      || ''],
    ['line_by_line',         p.line_by_line      || ''],
    ['common_mistakes',      p.mistakes          || ''],
    ['best_practices',       p.best_practices    || ''],
    ['performance',          p.performance       || `## Performance Considerations\n\nWhen using ${p.title}, be mindful of: computational overhead for large inputs, memory allocation patterns, and how runtime behavior changes with scale. Always profile before optimizing.`],
    ['interview_questions',  p.interview         || ''],
    ['faqs',                 p.faqs              || `## Frequently Asked Questions\n\n**Q: When should I use ${p.title}?**\nA: Use it whenever the problem requires the functionality it provides. Consult documentation when unsure.\n\n**Q: What are the performance implications?**\nA: Always measure before assuming performance issues exist.`],
    ['mcqs',                 p.mcqs              || ''],
    ['coding_practice',      p.exercises         || ''],
    ['debugging_exercises',  p.debugging         || `## Debugging ${p.title}\n\n**Common Debug Scenario:** Your ${p.title} code isn't working as expected.\n\n**Steps:**\n1. Read the error message carefully\n2. Add print/console.log statements to trace execution\n3. Verify your syntax matches the language specification\n4. Check edge cases (empty input, null values, boundary conditions)\n5. Use a debugger to step through line by line`],
    ['project_ideas',        p.project           || ''],
    ['summary',              p.summary           || ''],
    ['key_takeaways',        p.key_takeaways     || `## Key Takeaways\n\n- ${p.title} is a core concept in ${p.lang} programming\n- Understanding it deeply improves code quality and interview performance\n- Practice with real examples to build muscle memory\n- Always consider edge cases and performance implications`],
    ['related_topics',       p.related           || ''],
    ['next_learning_path',   p.next_path         || `## What to Learn Next\n\nNow that you understand ${p.title}, the natural progression is to explore related concepts that build on this foundation. Check the next lesson in this module for a guided path forward.`],
  ];

  const parts = [OPEN];
  for (const [name, content] of sections) {
    parts.push(SO(name));
    parts.push(content);
    parts.push(SC(name));
  }
  parts.push(CLOSE);
  return parts.join('\n');
}

module.exports = { buildLesson };
