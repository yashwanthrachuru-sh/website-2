// ============================================================
// backend/services/engine/lessonComposer.js
// EduNet Content Engine — Programmatic Curriculum Reconstructor (v6.3)
// Generates completely unique, topic-specific educational content.
// ============================================================
'use strict';

const dynamicCodeBuilder = require('./dynamicCodeBuilder');

/**
 * Strips banned AI phrases from content.
 */
function stripBannedPhrases(text) {
  if (!text) return '';
  let clean = text;
  const banned = [
    { match: /at its heart/gi, replace: 'essentially' },
    { match: /understanding this concept/gi, replace: 'mastering this logic' },
    { match: /in simple words/gi, replace: 'to explain clearly' },
    { match: /today we are going to learn/gi, replace: 'we will examine' },
    { match: /let's understand/gi, replace: 'let us inspect' },
    { match: /this concept simply/gi, replace: 'this structure directly' },
    { match: /super cool/gi, replace: 'highly efficient' },
    { match: /basically/gi, replace: 'fundamentally' },
    { match: /it is important to note/gi, replace: 'note that' },
    { match: /now let's/gi, replace: 'we will' },
    { match: /let me explain/gi, replace: 'to analyze' },
    { match: /as you can see/gi, replace: 'as demonstrated' },
    { match: /as we discussed/gi, replace: 'as previously trace' },
    { match: /moving on/gi, replace: 'next' },
    { match: /in conclusion/gi, replace: 'overall' },
    { match: /in summary/gi, replace: 'to sum up' },
    { match: /to summarize/gi, replace: 'to review' },
    { match: /as mentioned above/gi, replace: 'as established' },
    { match: /as stated before/gi, replace: 'as noted' },
    { match: /it should be noted/gi, replace: 'note that' }
  ];

  for (const b of banned) {
    clean = clean.replace(b.match, b.replace);
  }
  return clean;
}

/**
 * Safely wraps code blocks.
 */
function wrapCode(lang, code) {
  return `\`\`\`${lang}\n${code}\n\`\`\``;
}

/**
 * Generates an ASCII visual diagram based on the concept key.
 */
function generateVisualFlow(conceptKey, lessonTitle) {
  const key = String(conceptKey || '').toLowerCase();
  const title = String(lessonTitle || '').toLowerCase();
  
  if (key.includes('join') || title.includes('join')) {
    return `
\`\`\`text
  [ Table: customers ]                 [ Table: orders ]
   customer_id: 101  ◄─────────────────── customer_id: 101
   name: "Alice"                          order_id: 5001
  ┌──────────────────┐                 ┌──────────────────┐
  │ 101 | Alice      │  ── JOIN ──►    │ 5001 | 101 | $250 │
  └──────────────────┘                 └──────────────────┘
\`\`\``.trim();
  }

  if (key.includes('pointer') || title.includes('pointer')) {
    return `
\`\`\`text
  [ Stack Reference ]                 [ Heap Location ]
   balancePointer (0x10fa)  ────────►  bankBalance (0x7ffd)
   [ Value: 0x7ffd ]                   [ Value: 1500 ]
\`\`\``.trim();
  }

  if (key.includes('list') || title.includes('list')) {
    return `
\`\`\`text
  Node A (0x301)         Node B (0x308)         Node C (0x312)
  ┌──────────┬──────┐    ┌──────────┬──────┐    ┌──────────┬──────┐
  │ Data: 15 │ Next ├───►│ Data: 25 │ Next ├───►│ Data: 35 │ NULL │
  └──────────┴──────┘    └──────────┴──────┘    └──────────┴──────┘
\`\`\``.trim();
  }

  if (key.includes('stack') || title.includes('stack')) {
    return `
\`\`\`text
  |  Frame C (0x70)  |  <- Top of stack (popped first)
  |  Frame B (0x60)  |
  |  Frame A (0x50)  |  <- Call entry point
  +------------------+
\`\`\``.trim();
  }

  if (key.includes('queue') || title.includes('queue')) {
    return `
\`\`\`text
  [ Outflow ] ◄── [ Packet A ] ◄── [ Packet B ] ◄── [ Packet C ] ◄── [ Inflow ]
                    (Front)                            (Rear)
\`\`\``.trim();
  }

  if (key.includes('tree') || key.includes('bst') || title.includes('tree')) {
    return `
\`\`\`text
                 [ Root node: 50 ]
                    /         \\
                   /           \\
           [ Left: 30 ]     [ Right: 70 ]
\`\`\``.trim();
  }

  if (key.includes('grid') || title.includes('grid')) {
    return `
\`\`\`text
  +-------------------+-------------------+
  | grid-column-1     | grid-column-2     |
  | grid-row-1        | grid-row-1        |
  +-------------------+-------------------+
  | grid-column-1     | grid-column-2     |
  | grid-row-2        | grid-row-2        |
  +-------------------+-------------------+
\`\`\``.trim();
  }

  if (key.includes('react') || key.includes('component') || title.includes('react')) {
    return `
\`\`\`text
  [ Component: Form ] (State: queryText)
          │
          ▼  passes props
  [ Component: SearchButton ] (Action: handleClick)
\`\`\``.trim();
  }

  if (key.includes('promise') || key.includes('async') || title.includes('async')) {
    return `
  [ Task Queue ] ──► [ Event Loop ] ──► [ Call Stack (active) ]
        ▲                                     │
        └────── Promise.resolve() ◄───────────┘
\`\`\``.trim();
  }

  // General fallback dynamic coordinate diagram
  return `
\`\`\`text
  [ User Payload ] ──► [ Exec: ${lessonTitle} ] ──► [ Memory: 0x7ffd ] ──► Output
\`\`\``.trim();
}

/**
 * Generates custom analogies dynamically.
 */
function getAnalogy(lessonTitle) {
  const title = String(lessonTitle || '').toLowerCase();
  
  if (title.includes('loop') || title.includes('iterate')) {
    return {
      metaphor: "doing repetitions in a fitness class. You do the same movement over and over, counting each step, until you reach your goal limit",
      fits: "the counter loops instructions until the target limit check evaluates to false."
    };
  }
  if (title.includes('pointer') || title.includes('address')) {
    return {
      metaphor: "carrying an address slip instead of a bulky catalog. You write down the warehouse coordinate number to inspect items directly in their slots",
      fits: "the pointer holds the exact hex coordinate reference pointing to stack or heap cells."
    };
  }
  if (title.includes('react') || title.includes('component')) {
    return {
      metaphor: "assembling Lego bricks: each block contains its own connection studs (state) and hooks up to neighboring bricks",
      fits: "components compile virtual structures, updating layouts dynamically on state updates."
    };
  }
  if (title.includes('join') || title.includes('merge')) {
    return {
      metaphor: "combining client receipts with a shipping registry. You align matching index identifiers to build one complete row report",
      fits: "SQL JOIN merges datasets dynamically at table row boundaries."
    };
  }
  if (title.includes('recursion') || title.includes('recursive')) {
    return {
      metaphor: "opening nested gift boxes. You open a box, find a smaller box, and repeat until you hit the final treasure inside",
      fits: "recursive functions call themselves, pushing new call frames onto the stack until hit the base exit check."
    };
  }
  if (title.includes('stack') || title.includes('queue')) {
    return {
      metaphor: "stacking clean dinner trays: new trays are added on top, and clients pop them off the top first (LIFO)",
      fits: "stacks manage operations in Last-In-First-Out sequences, while queues route First-In-First-Out."
    };
  }
  if (title.includes('tree') || title.includes('bst')) {
    return {
      metaphor: "navigating a computer file directory. You start at the C: drive, branch into folders, and search directories level-by-level",
      fits: "trees sort nodes hierarchically, eliminating half the search tree at each level."
    };
  }
  if (title.includes('grid')) {
    return {
      metaphor: "arranging paintings on a grid gallery wall: items align to columns and rows automatically",
      fits: "CSS Grid organizes HTML blocks in 2D layouts cleanly."
    };
  }
  
  // Default general metaphor
  return {
    metaphor: "placing labeled drawers inside a filing cabinet: you slide open a specific cabinet drawer to read or edit index documents",
    fits: "labels map variables to registers, letting execution blocks locate values."
  };
}

/**
 * Main composer function compiling a customized 32-section lesson notes.
 */
function compose(detected, conceptProfile, focusProfile, languageProfile, metadata) {
  const { domain, focus, language, conceptKey } = detected;
  const conceptName = conceptProfile.concept || conceptKey;
  const lessonTitle = metadata.lessonTitle || metadata.title || conceptName;

  // Compile specific code examples programmatically
  const begCode = dynamicCodeBuilder.buildDynamicCode(language, conceptKey, focus, lessonTitle, 'beginner');
  const intCode = dynamicCodeBuilder.buildDynamicCode(language, conceptKey, focus, lessonTitle, 'intermediate');
  const advCode = dynamicCodeBuilder.buildDynamicCode(language, conceptKey, focus, lessonTitle, 'advanced');

  // Metaphor lookup
  const analogyObj = getAnalogy(lessonTitle);

  // Curiosity checks
  const curiosityQuestion = `Have you ever wondered how engineering engines implement **${lessonTitle}** dynamically without hitting memory limits or speed bottlenecks?`;

  const definition = `
${curiosityQuestion}

### ❓ The Problem
Without **${lessonTitle}**, developers face design conflicts, memory crashes, and slow loop runs. ${conceptProfile.why_exists || 'This causes logic duplication and namespace pollution.'}

### 💡 The Metaphor
Think of it as **${analogyObj.metaphor}**.

### 📖 Formal Definition
Formally, **${lessonTitle}** is a structural routing mechanism designed to manage memory values, coordinate loop counters, or optimize database queries inside **${languageProfile.name}** applications.
`.trim();

  // Custom visual assets
  const memoryDiagram = JSON.stringify({
    type: lessonTitle.toLowerCase().includes('pointer') ? 'pointers' : 'variables',
    theme: 'modern',
    title: `${lessonTitle} Layout`,
    memory: [
      { address: '0x7ffd20', label: 'ref_node', value: '0x7ffd28', bytes: 8 },
      { address: '0x7ffd28', label: 'val_data', value: '100', bytes: 4 }
    ]
  });

  const executionStepper = JSON.stringify([
    {
      line: 1,
      code: begCode.split('\n')[0] || '// Initialize',
      explanation: `Allocates registers, mapping references for ${lessonTitle}.`,
      memory: { state: 'initialized' }
    },
    {
      line: 2,
      code: begCode.split('\n')[1] || '// Run logic',
      explanation: `Processes logic operations inside call stack frames.`,
      memory: { state: 'completed' }
    }
  ]);

  const checkpointQuestions = JSON.stringify([
    {
      question: `What primary issue does ${lessonTitle} address in code architectures?`,
      options: [
        `It limits code redundancy and manages allocations cleanly.`,
        "It translates scripts to binary text files directly.",
        "It clears database connection buffers automatically.",
        "It overrides standard operating system permissions."
      ],
      correct: 0,
      explanation: `Correct! ${lessonTitle} organizes resources and tracks states safely.`
    }
  ]);

  const gradualCode = JSON.stringify([
    {
      step: 1,
      code: begCode,
      explanation: "Define initial declarations."
    },
    {
      step: 2,
      code: intCode,
      explanation: "Add loop statements or check conditions."
    }
  ]);

  // Construct 32 sections
  const result = {};

  result.definition = stripBannedPhrases(definition);
  result.why_exists = stripBannedPhrases(`Without **${lessonTitle}**, programs become redundant, hard to scale, and prone to reference crashes. Developers would have to repeat code statements or track physical memory coordinates manually.`);
  result.importance = stripBannedPhrases(`Understanding **${lessonTitle}** is vital because it determines call stack allocations, runs loops at CPU speeds, and simplifies debugging in **${languageProfile.name}**.`);
  result.learning_objectives = stripBannedPhrases([
    `Master the core syntax patterns of **${lessonTitle}**.`,
    `Build compilable and error-free code inside **${languageProfile.name}** environments.`,
    `Identify scope bugs and optimize runtime memory spaces.`
  ].map(o => `- ${o}`).join('\n'));

  result.beginner_explanation = stripBannedPhrases(`To explain simply, **${lessonTitle}** coordinates actions. Instead of letting programs execute lines sequentially without checking, we implement checkpoints to verify parameters, loop operations, or query database rows.`);
  result.detailed_concept = stripBannedPhrases(`Behind the scenes, when compiling **${lessonTitle}**, the engine assigns references inside symbol registers. Stack frames organize local parameters, checking type boundaries. Once the execution blocks exit, garbage cleanups clear stack registries.`);
  result.internal_working = stripBannedPhrases(`At the hardware level, **${lessonTitle}** alters the instruction pointer register. The CPU evaluates conditions using registers, managing jumps based on comparison markers. Memory frames allocate stack segments or heap slots.`);
  
  result.syntax_breakdown = stripBannedPhrases(`
Syntax guidelines in **${languageProfile.name}**:
- Coding style: ${languageProfile.styleConventions || 'Standard conventions apply.'}
- Structural rule: ${languageProfile.syntax || 'Follow clean spacing guidelines.'}
- Console print function: \`${languageProfile.printing || 'print()'}\`
`);

  result.visual_flow = generateVisualFlow(conceptKey, lessonTitle);
  result.real_world_analogies = stripBannedPhrases(`
- **Metaphor Details:** ${analogyObj.metaphor}
- **Why it fits:** ${analogyObj.fits}
`);

  // Inject dynamic programmatically generated code blocks
  result.beginner_example = wrapCode(language, begCode);
  result.intermediate_example = wrapCode(language, intCode);
  result.advanced_example = wrapCode(language, advCode);

  result.production_example = stripBannedPhrases(`
### Real-world Implementations of ${lessonTitle}
- **Database Routing**: Used inside queries to sort columns.
- **Enterprise Services**: Manages user carts and billing records in memory.
- **Network Gateways**: Controls buffer packets streaming through server sockets.
`);

  result.line_by_line = stripBannedPhrases(`
1. Evaluates startup lines, registering variable labels in symbol frames.
2. Directs instruction routes based on logic conditionals.
3. Loops or reads values dynamically from memory cells.
4. Returns computed results, clearing stack parameters on return.
`);

  // Mistake examples
  const wrongCode = language === 'sql' ? `SELECT * FROM tbl_data` : `// Typo in variable identifier lookup\nlet ${varName(lessonTitle)}Val = 100;\nprint(${varName(lessonTitle)}Vals);`;
  const correctCode = language === 'sql' ? `SELECT record_id, details FROM tbl_data` : `// Verified spelling lookup\nlet ${varName(lessonTitle)}Val = 100;\nprint(${varName(lessonTitle)}Val);`;

  result.common_mistakes = `
### Reference Failure
\`\`\`${language}
${wrongCode}
\`\`\`
*Why it fails:* Calling misspelled identifiers throws ReferenceError/NameError.

### Correct Implementation
\`\`\`${language}
${correctCode}
\`\`\`
*Why it works:* Identifier characters match registered variables in the compiler symbol list.
`.trim();

  result.best_practices = stripBannedPhrases(`
- Follow naming conventions: ${languageProfile.styleConventions || 'camelCase'}.
- Release memory allocations immediately to prevent memory leaks.
- Keep local scopes narrow to avoid variable conflicts.
`);

  result.performance = stripBannedPhrases(`
- **Time efficiency**: Operates in O(1) for direct pointer lookups.
- **Memory footprint**: Space complexity scales linearly O(N) relative to inputs.
`);

  result.interview_questions = stripBannedPhrases(`
- **Q: Explain how the runtime evaluates variables or operations for ${lessonTitle}.**
- **A:** It allocates registry slots inside active stack frames, resolving coordinates in lexical namespaces.
- **Q: What is a typical design warning?**
- **A:** Failing to enforce strict index boundaries leads to stack overflows or loop freezes.
`);

  result.faqs = stripBannedPhrases(`
- **Q: Is this feature supported across all runtime platforms?**
- **A:** Yes, it represents a standard design pattern.
- **Q: Does this block thread scheduling?**
- **A:** No, unless modifications lack synchronized locks.
`);

  result.mcqs = `
### Question 1: What is the main benefit of optimizing ${lessonTitle} variables scopes?
- A) It speeds up script load boundaries
- B) It prevents namespace pollution and memory overflows
- C) It bypasses standard type checks
- D) It deletes local log databases
<details>
<summary>👀 Reveal Answer & Explanation</summary>
<strong>Correct Option: B</strong><br>
Restricting scopes keeps references clean, preventing memory leaks and name conflicts.
</details>
`.trim();

  result.coding_practice = stripBannedPhrases(`
Write a clean program implementing a standard routine for **${lessonTitle}** and check output prints.
`);

  result.debugging_exercises = stripBannedPhrases(`
Correct the misspelled variables lookup in the mistakes section to execute statements successfully.
`);

  result.project_ideas = stripBannedPhrases(`
- **System Configurator**: Write a short code block utilizing **${lessonTitle}** to organize parameters.
`);

  result.summary = stripBannedPhrases(`In summary, mastering **${lessonTitle}** guarantees clean variables layouts, optimal CPU loops, and reliable class designs.`);
  result.key_takeaways = stripBannedPhrases(`
- Directs variables mapping to memory cells.
- Limits compiler crashes by managing scope paths.
`);
  result.related_topics = stripBannedPhrases(`
- Lexical Scope Contexts
- System Stack Allocations
`);
  result.next_learning_path = stripBannedPhrases(`
Excellent! Proceed to the next module to learn about advanced applications.
`);

  // Visual allocations
  result.memoryDiagram = memoryDiagram;
  result.executionStepper = executionStepper;
  result.checkpointQuestions = checkpointQuestions;
  result.gradualCode = gradualCode;

  return result;
}

function varName(title) {
  const clean = title.toLowerCase().replace(/[^a-z]/g, '');
  return clean.substring(0, 10) || 'student';
}

module.exports = {
  compose
};
