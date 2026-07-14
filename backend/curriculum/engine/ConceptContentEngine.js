// ============================================================
// backend/curriculum/engine/ConceptContentEngine.js
// EduNet Curriculum-Driven Educational Engine — ConceptContentEngine (v5.0)
// ============================================================
'use strict';

const fs = require('fs');
const path = require('path');

const CURRICULUM_DIR = path.resolve(__dirname, '..', '..', '..', 'curriculum');

// Standard slug helper
function getSlug(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Searches for a lesson folder across the curriculum directory tree.
 */
function findLessonFolder(title, moduleName, roadmapId) {
  const rmId = getSlug(roadmapId || 'python');
  const modSlug = getSlug(moduleName || 'fundamentals');
  const conceptSlug = getSlug(title);

  // Try direct path: curriculum/[roadmapId]/modules/[moduleSlug]/[conceptSlug]
  const directPath = path.join(CURRICULUM_DIR, rmId, 'modules', modSlug, conceptSlug);
  if (fs.existsSync(directPath)) return directPath;

  // Try searching in all modules of the roadmap: curriculum/[roadmapId]/modules/*/[conceptSlug]
  const rmPath = path.join(CURRICULUM_DIR, rmId);
  const modulesDir = path.join(rmPath, 'modules');
  if (fs.existsSync(modulesDir)) {
    const modDirs = fs.readdirSync(modulesDir);
    for (const d of modDirs) {
      const p = path.join(modulesDir, d, conceptSlug);
      if (fs.existsSync(p)) return p;
    }
  }

  // Fallback: search all roadmaps, all modules for this concept slug
  if (fs.existsSync(CURRICULUM_DIR)) {
    const allRoadmaps = fs.readdirSync(CURRICULUM_DIR);
    for (const r of allRoadmaps) {
      const rModules = path.join(CURRICULUM_DIR, r, 'modules');
      if (fs.existsSync(rModules)) {
        const modDirs = fs.readdirSync(rModules);
        for (const d of modDirs) {
          const p = path.join(rModules, d, conceptSlug);
          if (fs.existsSync(p)) return p;
        }
      }
    }
  }

  return null;
}

/**
 * Resolves a curriculum component file path, checking locales/<lang>/ first
 * then falling back to the concept folder root (backward-compatible).
 */
function resolveComponentPath(folder, filename, lang = 'en') {
  const localePath = path.join(folder, 'locales', lang, filename);
  if (fs.existsSync(localePath)) return localePath;
  const rootPath = path.join(folder, filename);
  if (fs.existsSync(rootPath)) return rootPath;
  return null; // caller decides how to handle missing
}

/**
 * Loads a JSON file safely. Returns fallback if missing/corrupt.
 */
function loadJsonFile(filePath, fallback = {}) {
  if (!filePath || !fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error(`[ConceptContentEngine] Failed to parse JSON: ${filePath}`, e.message);
    return fallback;
  }
}

/**
 * Locale-aware loader: resolves and loads a curriculum component JSON.
 */
function loadComponent(folder, filename, lang = 'en', fallback = {}) {
  const resolved = resolveComponentPath(folder, filename, lang);
  return loadJsonFile(resolved, fallback);
}

/**
 * Main API: Reads and maps decentralized JSON components into the legacy
 * 32-section structured content object used by the engine renderer.
 */
function getCodeSnippet(title, langNorm) {
  const t = title || 'Concept';
  if (langNorm === 'python') {
    return `# Python implementation for ${t}\ndef process_data(value):\n    print(f"Initializing ${t}...")\n    return f"Result: {value}"\n\nresult = process_data("Active")\nprint(result)`;
  } else if (langNorm === 'javascript' || langNorm === 'typescript') {
    return `// JavaScript implementation for ${t}\nfunction processData(value) {\n    console.log("Initializing ${t}...");\n    return "Result: " + value;\n}\n\nconst result = processData("Active");\nconsole.log(result);`;
  } else if (langNorm === 'sql') {
    return `-- SQL query for ${t}\nSELECT id, name, category, created_at\nFROM system_records\nWHERE category = '${t}'\nORDER BY created_at DESC\nLIMIT 10;`;
  } else if (langNorm === 'cpp' || langNorm === 'c++') {
    return `// C++ implementation for ${t}\n#include <iostream>\n#include <string>\n\nvoid processData(std::string value) {\n    std::cout << "Initializing ${t}: " << value << std::endl;\n}\n\nint main() {\n    processData("Active");\n    return 0;\n}`;
  } else if (langNorm === 'java') {
    return `// Java implementation for ${t}\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Initializing ${t}...");\n    }\n}`;
  } else if (langNorm === 'go') {
    return `// Go implementation for ${t}\npackage main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Initializing ${t}...")\n}`;
  } else if (langNorm === 'rust') {
    return `// Rust implementation for ${t}\nfn main() {\n    println!("Initializing ${t}...");\n}`;
  }
  return `// Implementation for ${t}\n// Language: ${langNorm}\nfunction main() {\n    console.log("Initializing ${t}...");\n}`;
}

function generateBeginner(title, moduleName, langNorm) {
  const code = getCodeSnippet(title, langNorm);
  return {
    motivation: `Understanding ${title} is crucial for managing execution flow and application state in ${langNorm}. It allows developers to build robust, modular, and maintainable systems.`,
    whyExists: `Without ${title}, software designs often suffer from duplicate logic paths, performance inefficiencies, and poor resource scoping. This concept solves those structural challenges.`,
    simpleExplanation: `At its core, ${title} is a protocol for executing modular operations. In ${langNorm}, it sets up defined runtime instructions that the runtime engine compiles and executes sequentially.`,
    syntaxExplanation: `To use ${title} in ${langNorm}, we write structured blocks matching compile patterns, ensuring scoping parameters and reference types are clearly initialized.`,
    visualDiagram: `[Input Data] ──► [${title} Engine] ──► [Output Result]`,
    realWorldAnalogy: `Think of it like a production blueprint in a factory. It defines exactly what steps to take and what parameters are required to manufacture the final product.`,
    examples: [
      {
        code: code,
        explanation: `A basic implementation of ${title} illustrating variable configuration and execution parameters.`
      }
    ],
    stepByStepExecution: [
      { step: 1, desc: `Initialize the ${title} scope block.` },
      { step: 2, desc: `Execute core statements sequentially.` },
      { step: 3, desc: `Process complete; clean up frame and return values.` }
    ],
    memoryDiagram: {
      stack: [
        { address: "0x7FFEE1", label: "scopeRef", value: "0x100A3C" }
      ],
      heap: [
        { address: "0x100A3C", label: `${title}_data`, value: "{ status: 'initialized' }" }
      ]
    }
  };
}

function generateIntermediate(title, moduleName, langNorm) {
  const code = getCodeSnippet(title, langNorm);
  const badCode = langNorm === 'python' ? `# Mismatched scopes\nvalue = None\ndef execute():\n    print(value)` : `// Scope error\nlet value;\nfunction execute() {\n    console.log(value);\n}`;
  return {
    deeperExplanation: `When scaling applications, ${title} acts as a baseline optimizer. By organizing logic threads using this concept, engineers prevent concurrent resource lockups.`,
    internalImplementation: `The ${langNorm} compiler resolves symbols for ${title} during evaluation, mapping references and preparing execution records on the call stack.`,
    examples: [
      {
        code: code,
        explanation: `Intermediate implementation showing modular scoping patterns.`
      }
    ],
    performanceConsiderations: {
      timeComplexity: "O(1) lookup and execution time",
      spaceComplexity: "O(1) auxiliary memory usage"
    },
    debuggingWalkthrough: {
      bugDescription: `Scope reference errors when referencing uninitialized blocks.`,
      incorrectCode: badCode,
      correctCode: code
    },
    bestPractices: [
      `Validate parameters before entering execution scopes.`,
      `Document state transitions clearly.`
    ]
  };
}

function generateExpert(title, moduleName, langNorm) {
  return {
    examples: [
      {
        code: getCodeSnippet(title, langNorm),
        explanation: `Expert-level optimization demonstrating decoupled and safe processing pipelines.`
      }
    ]
  };
}

function generatePractice(title, moduleName, langNorm) {
  const code = getCodeSnippet(title, langNorm);
  return {
    easy: {
      problem: `Create a simple program that prints initialization logs for ${title} using basic syntax controls.`,
      starterCode: getCodeSnippet(title, langNorm).split('\n').slice(0, 3).join('\n'),
      expectedOutput: `Initializing ${title}...`,
      solution: code,
      hints: [`Verify matching scopes.`, `Follow structural declaration patterns.`]
    },
    medium: {
      problem: `Refactor the basic ${title} code to handle conditional logic branches safely.`,
      starterCode: code,
      expectedOutput: `Result: Active`,
      solution: code
    },
    hard: {
      problem: `Design a fully-fledged decoupled application applying intermediate ${title} interfaces.`,
      starterCode: code,
      expectedOutput: `Success`,
      solution: code
    },
    debugging: {
      problem: `Identify and fix compilation issues in the provided snippet.`,
      starterCode: code
    }
  };
}

function generateQuiz(title, moduleName, langNorm) {
  const mcqs = [];
  const questionsList = [
    {
      q: `What is the primary architectural purpose of ${title} in software systems?`,
      o: [
        `To encapsulate modular logic and structure data flow.`,
        `To replace general compiler instructions completely.`,
        `To run processes asynchronously on separate hardware blocks.`,
        `To delete unused object references automatically.`
      ],
      a: "A",
      exp: `Option A is correct because ${title} organizes and encapsulates execution structures for predictability.`
    },
    {
      q: `Which time complexity is typically associated with optimized implementations of ${title}?`,
      o: [
        `O(1) constant time complexity.`,
        `O(N^2) quadratic scaling.`,
        `O(N!) factorial overhead.`,
        `O(2^N) exponential complexity.`
      ],
      a: "A",
      exp: `Optimized concepts execute inside structured scopes leading to constant O(1) performance characteristics.`
    },
    {
      q: `How does scope safety improve when utilizing ${title} properly?`,
      o: [
        `It localizes references and prevents global namespace pollution.`,
        `It bypasses authentication layers in Web interfaces.`,
        `It increases RAM usage to speed up instruction decoding.`,
        `It prevents variable names from being lowercase.`
      ],
      a: "A",
      exp: `Proper scoping isolates internal variables from outside interference, preventing leakage.`
    }
  ];

  for (let i = 1; i <= 12; i++) {
    const template = questionsList[(i - 1) % questionsList.length];
    mcqs.push({
      id: `q_${i}`,
      question: `${template.q} (Version ${i})`,
      options: template.o,
      answer: template.a,
      explanation: template.exp,
      difficulty: i <= 4 ? "easy" : i <= 8 ? "medium" : "hard"
    });
  }

  return { mcqs };
}

function generateCheatsheet(title, moduleName, langNorm) {
  return {
    printNote: `Use this cheat sheet reference guide for ${title} syntax.`,
    sections: [
      {
        heading: `${title} Syntax Patterns`,
        entries: [
          {
            syntax: getCodeSnippet(title, langNorm).split('\n')[0] || `// Declare ${title}`,
            example: getCodeSnippet(title, langNorm).replace(/\n/g, ' ').substring(0, 40),
            description: `Declares and runs core constructs for ${title}.`,
            commonMistake: `Mismatched scope blocks or uninitialized references.`
          }
        ]
      },
      {
        heading: `Common Best Practices`,
        entries: [
          {
            syntax: `Scoping Rules`,
            example: `Avoid globally defining values`,
            description: `Keep references localized inside functions or block scopes.`,
            commonMistake: `Polluting the outer global namespace.`
          }
        ]
      }
    ]
  };
}

function generateProject(title, moduleName, langNorm) {
  return {
    title: `${title} Core System`,
    description: `Construct a robust implementation that models ${title} rules, processes complex logic strings, and returns structured data output in ${langNorm}.`,
    objectives: [
      `Define interface scopes matching ${title} parameters.`,
      `Optimize runtime loops to limit stack calls.`,
      `Write unit tests verifying edge-case evaluations.`
    ],
    requirements: [
      `Write clean, documented files compile-ready for ${langNorm}.`,
      `Prevent logical index out of bounds.`,
      `Output log status updates to stdout.`
    ],
    steps: [
      `Step 1: Setup project directory and source configurations.`,
      `Step 2: Implement core algorithm processing loops.`,
      `Step 3: Run regression tests verifying execution correctness.`
    ],
    expectedOutput: `Execution Success: Process completed in 0.45s.`,
    extensions: [
      `Build a visual interface showing the process step-by-step.`,
      `Support multithreading capabilities.`
    ]
  };
}

function generateInterview(title, moduleName, langNorm) {
  return {
    questions: [
      {
        question: `Explain the fundamental concept of ${title} to a beginner.`,
        answer: `${title} defines a clear protocol for structuring execution pathways. It helps keep code modular, readable, and decoupled.`,
        difficulty: "beginner"
      },
      {
        question: `What are the runtime performance trade-offs when scaling ${title}?`,
        answer: `While encapsulation improves maintainability, excessive scope allocations can incur minimal stack frame overhead.`,
        difficulty: "intermediate"
      },
      {
        question: `How would you address thread safety issues when shared states are touched inside ${title}?`,
        answer: `Apply locks or immutable data structures to prevent concurrent mutation errors during operations.`,
        difficulty: "advanced"
      }
    ]
  };
}

function generateRevision(title, moduleName, langNorm) {
  return {
    summary: `This lesson covered ${title} inside ${moduleName} for the ${langNorm} track. We reviewed Motivation, Example Codes, Practice Exercises, and Projects.`,
    keyTakeaways: [
      `${title} represents a core foundation of programming logic.`,
      `Always maintain clean parameter definitions and trace stack cycles.`,
      `Complete exercises and review cheat sheets before moving to assessments.`
    ]
  };
}

function getConceptContent(title, moduleName, lang, roadmapId) {
  const folder = findLessonFolder(title, moduleName, roadmapId);
  const locale = lang && lang.length === 2 ? lang : 'en';
  const langNorm = (lang || 'javascript').toLowerCase();

  let lesson = {};
  if (folder) {
    lesson = loadJsonFile(path.join(folder, 'lesson.json')) || {};
  }

  const roadmapDefinitions = require('../../config/roadmapDefinitions');
  let level = 'beginner';
  let order = lesson.orderIndex || 1;
  const rm = roadmapDefinitions[roadmapId];
  if (rm) {
    const modIdx = rm.modules.findIndex(m => m.name.toLowerCase() === moduleName.toLowerCase());
    if (modIdx !== -1) {
      const total = rm.modules.length;
      const levelIdx = Math.floor((modIdx / total) * 3);
      level = levelIdx === 0 ? 'beginner' : levelIdx === 1 ? 'intermediate' : 'expert';
      
      const modObj = rm.modules[modIdx];
      if (modObj && modObj.lessons) {
        const lesIdx = modObj.lessons.findIndex(l => l.title.toLowerCase() === title.toLowerCase());
        if (lesIdx !== -1) {
          order = lesIdx + 1;
        }
      }
    }
  }

  let beginner     = (folder ? loadComponent(folder, 'beginner.json',     locale) : {}) || {};
  let intermediate = (folder ? loadComponent(folder, 'intermediate.json', locale) : {}) || {};
  let expert       = (folder ? loadComponent(folder, 'expert.json',       locale) : {}) || {};
  let practice     = (folder ? loadComponent(folder, 'practice.json',     locale) : {}) || {};
  let quiz         = (folder ? loadComponent(folder, 'quiz.json',         locale) : {}) || {};
  let cheatsheet   = (folder ? loadComponent(folder, 'cheatsheet.json',   locale) : {}) || {};
  let project      = (folder ? loadComponent(folder, 'project.json',      locale) : {}) || {};
  let resources    = (folder ? loadComponent(folder, 'resources.json',    locale) : {}) || {};
  let videos       = (folder ? loadComponent(folder, 'videos.json',       locale) : {}) || {};
  let interview    = (folder ? loadComponent(folder, 'interview.json',    locale) : {}) || {};
  let revision     = (folder ? loadComponent(folder, 'revision.json',     locale) : {}) || {};

  if (!beginner.motivation || !beginner.simpleExplanation) {
    beginner = { ...generateBeginner(title, moduleName, langNorm), ...beginner };
  }
  if (!intermediate.deeperExplanation || !intermediate.internalImplementation) {
    intermediate = { ...generateIntermediate(title, moduleName, langNorm), ...intermediate };
  }
  if (!expert.examples || expert.examples.length === 0) {
    expert = { ...generateExpert(title, moduleName, langNorm), ...expert };
  }
  if (!practice.easy || !practice.easy.problem) {
    practice = { ...generatePractice(title, moduleName, langNorm), ...practice };
  }
  if (!quiz.mcqs || quiz.mcqs.length === 0) {
    quiz = { ...generateQuiz(title, moduleName, langNorm), ...quiz };
  }
  if (!cheatsheet.sections || cheatsheet.sections.length === 0) {
    cheatsheet = { ...generateCheatsheet(title, moduleName, langNorm), ...cheatsheet };
  }
  if (!project.title || !project.description) {
    project = { ...generateProject(title, moduleName, langNorm), ...project };
  }
  if (!interview.questions || interview.questions.length === 0) {
    interview = { ...generateInterview(title, moduleName, langNorm), ...interview };
  }
  if (!revision.summary || !revision.keyTakeaways) {
    revision = { ...generateRevision(title, moduleName, langNorm), ...revision };
  }
  if (!lesson.title) {
    lesson.title = title;
    lesson.learningObjectives = [`Understand core concepts of ${title}`, `Implement simple example operations`, `Verify logical correctness`];
    lesson.nextLessons = [];
  }

  if (!Array.isArray(beginner.examples)) beginner.examples = [];
  if (!Array.isArray(intermediate.examples)) intermediate.examples = [];
  if (!Array.isArray(expert.examples)) expert.examples = [];
  if (!Array.isArray(interview.questions)) interview.questions = [];
  if (!Array.isArray(quiz.mcqs)) quiz.mcqs = [];
  if (!Array.isArray(cheatsheet.sections)) cheatsheet.sections = [];
  if (!Array.isArray(revision.keyTakeaways)) revision.keyTakeaways = [];

  const stepByStepList = beginner.stepByStepExecution || [];
  const lineByLineText = stepByStepList.map(s => `${s.step}. ${s.desc}`).join('\n');

  const bestPracticesList = intermediate.bestPractices || [];
  const bestPracticesText = bestPracticesList.map(b => `- ${b}`).join('\n');

  const dbg = intermediate.debuggingWalkthrough || {};
  const commonMistakesText = `### ${dbg.bugDescription || 'Common Pitfall'}
\`\`\`${langNorm}
${dbg.incorrectCode || ''}
\`\`\`
*Why it fails:* Scope mismatch or syntax error.

### Verified Safe Pattern
\`\`\`${langNorm}
${dbg.correctCode || ''}
\`\`\`
*Why it works:* Corrected references and safe execution.`;

  const ivQuestions = interview.questions || [];
  const ivQuestionsText = ivQuestions.slice(0, 3).map(q => `#### Q: ${q.question}\n${q.answer}`).join('\n\n');

  const mcqList = quiz.mcqs || [];
  const mcqsText = mcqList.slice(0, 1).map(q => `### Question 1: ${q.question}
${(q.options || []).map((o, oidx) => `- ${String.fromCharCode(65 + oidx)}) ${o}`).join('\n')}
<details>
<summary>Answer & Explanation</summary>
<strong>Correct Answer: ${q.answer}</strong><br>
${q.explanation}
</details>`).join('\n\n');

  const content = {
    definition: `### Motivation\n${beginner.motivation || ''}\n\n### Why it exists\n${beginner.whyExists || ''}\n\n### Explanation\n${beginner.simpleExplanation || ''}`,
    why_exists: beginner.whyExists || '',
    importance: beginner.motivation || '',
    learning_objectives: lesson.learningObjectives ? lesson.learningObjectives.map(o => `- ${o}`).join('\n') : '',
    beginner_explanation: beginner.simpleExplanation || '',
    detailed_concept: intermediate.deeperExplanation || '',
    internal_working: intermediate.internalImplementation || '',
    syntax_breakdown: beginner.syntaxExplanation || '',
    visual_flow: beginner.visualDiagram || '',
    real_world_analogies: beginner.realWorldAnalogy || '',
    beginner_example: beginner.examples && beginner.examples[0] ? fence(langNorm, beginner.examples[0].code) : '',
    intermediate_example: intermediate.examples && intermediate.examples[0] ? fence(langNorm, intermediate.examples[0].code) : '',
    advanced_example: expert.examples && expert.examples[0] ? fence(langNorm, expert.examples[0].code) : '',
    production_example: expert.examples && expert.examples[0] ? fence(langNorm, expert.examples[0].code) : '',
    line_by_line: lineByLineText,
    common_mistakes: commonMistakesText,
    best_practices: bestPracticesText,
    performance: `**Time Complexity:** ${intermediate.performanceConsiderations?.timeComplexity || 'O(1)'}\n\n**Space Complexity:** ${intermediate.performanceConsiderations?.spaceComplexity || 'O(1)'}`,
    interview_questions: ivQuestionsText,
    faqs: revision.summary || '',
    mcqs: mcqsText,
    coding_practice: practice.easy?.problem || '',
    debugging_exercises: practice.debugging?.problem || '',
    project_ideas: `### ${project.title || 'Project'}\n${project.description || ''}`,
    summary: revision.summary || '',
    key_takeaways: revision.summary || '',
    related_topics: lesson.nextLessons ? lesson.nextLessons.join('\n') : '',
    next_learning_path: lesson.nextLessons ? lesson.nextLessons[0] : '',

    memoryDiagram: beginner.memoryDiagram ? JSON.stringify(beginner.memoryDiagram) : null,
    executionStepper: beginner.stepByStepExecution ? JSON.stringify(beginner.stepByStepExecution.map(s => ({
      line: s.step,
      code: beginner.examples && beginner.examples[0] ? beginner.examples[0].code.split('\n')[s.step - 1] || '// Step' : '// Step',
      explanation: s.desc
    }))) : null,
    checkpointQuestions: quiz.mcqs ? JSON.stringify(quiz.mcqs.slice(0, 3).map(q => ({
      question: q.question,
      options: q.options,
      correct: q.answer.charCodeAt(0) - 65,
      explanation: q.explanation
    }))) : null,
    gradualCode: beginner.examples && intermediate.examples ? JSON.stringify([
      { step: 1, code: beginner.examples[0]?.code || '', explanation: beginner.examples[0]?.explanation || '' },
      { step: 2, code: intermediate.examples[0]?.code || '', explanation: intermediate.examples[0]?.explanation || '' }
    ]) : null,

    raw: {
      lesson, beginner, intermediate, expert, practice, quiz, cheatsheet, project, resources, videos, interview, revision
    }
  };

  return {
    category: getSlug(title),
    schemaVersion: '2.0',
    lessonMeta: {
      ...lesson,
      level,
      order,
      module: moduleName,
      roadmap: roadmapId
    },
    content
  };
}

function fence(lang, code) {
  return `\`\`\`${lang}\n${code}\n\`\`\``;
}

module.exports = {
  getConceptContent,
  findLessonFolder,
  resolveComponentPath,
  loadComponent,
  fence,
  getSlug
};
