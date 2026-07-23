// ============================================================
// backend/curriculum/engine/ConceptContentEngine.js
// EduNet Curriculum-Driven Educational Engine — ConceptContentEngine (v5.0)
// ============================================================
'use strict';

const fs = require('fs');
const path = require('path');

const premiumCurriculum = require('../../services/premiumCurriculum');
const offlineGen = require('../../services/offlineGenerators');
const CURRICULUM_DIR = path.resolve(__dirname, '..', '..', '..', 'curriculum');

const compiledCache = {};

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
 * Resolves a curriculum component file path, checking rootPath first,
 * then falling back to locales/<lang>/ (backward-compatible).
 */
function resolveComponentPath(folder, filename, lang = 'en') {
  const rootPath = path.join(folder, filename);
  if (fs.existsSync(rootPath)) return rootPath;
  const localePath = path.join(folder, 'locales', lang, filename);
  if (fs.existsSync(localePath)) return localePath;
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

function generateQuiz(title, moduleName, langNorm, components = {}) {
  const t = title || 'Concept';
  const mcqs = [];

  const b = components.beginner || {};
  const im = components.intermediate || {};
  const ex = components.expert || {};
  const p = components.practice || {};
  const iv = components.interview || {};
  const cs = components.cheatsheet || {};
  const rv = components.revision || {};

  function makeQuestion(q, correctAnswer, distractors, exp, difficulty, id) {
    const options = [correctAnswer, ...distractors];
    const indices = [0, 1, 2, 3];
    // Seedless deterministic shuffle based on title/id
    const seed = t.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + (id ? Number(id.replace(/\D/g, '')) || 0 : 0);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = (seed + i) % (i + 1);
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    const shuffled = [];
    let answerChar = 'A';
    indices.forEach((originalIdx, shuffledIdx) => {
      shuffled.push(options[originalIdx]);
      if (originalIdx === 0) {
        answerChar = String.fromCharCode(65 + shuffledIdx);
      }
    });

    return {
      id: id,
      question: q,
      options: shuffled,
      answer: answerChar,
      explanation: exp,
      difficulty: difficulty
    };
  }

  const titleLower = t.toLowerCase();
  
  if (titleLower.includes('variable') || titleLower.includes('identifier') || titleLower.includes('declaring')) {
    mcqs.push(makeQuestion(
      `In programming, what is the primary role of a variable in hardware memory?`,
      `To map a user-defined name to a physical RAM location to hold data.`,
      [`To duplicate compiler files across folders.`, `To delete hardware cache registers.`, `To support static page layout configurations.`],
      `Variables assign a reference label to physical RAM slots so values can be stored, updated, and retrieved easily.`,
      `easy`, `q_1`
    ));
    mcqs.push(makeQuestion(
      `Which of the following is considered a best practice for naming variables?`,
      `Using clear, self-documenting names like student_marks or studentMarks.`,
      [`Using single-letter names like x, y, z for all data values.`, `Starting variable names with numbers like 1stStudent.`, `Using long obscure codes like usr_dat_rec_val.`],
      `Descriptive naming makes code readable and easy to maintain for other developers.`,
      `medium`, `q_2`
    ));
    mcqs.push(makeQuestion(
      `What runtime error typically occurs if a program attempts to read an undeclared variable?`,
      `ReferenceError or NameError.`,
      [`SyntaxError.`, `TypeError.`, `DivisionByZeroError.`],
      `If the runtime engine does not find the symbol name in the active scopes, it throws a ReferenceError or NameError.`,
      `medium`, `q_3`
    ));
    mcqs.push(makeQuestion(
      `In JavaScript, how do declarations with let/const differ from var regarding scoping?`,
      `let and const are block-scoped, whereas var is function-scoped.`,
      [`let is globally scoped while var is restricted to single lines.`, `const is stored in CPU registers, and var is stored on disk.`, `There is no scope difference between them.`],
      `Block scope locks let/const variables inside curly braces {}, preventing scope leakage common with var.`,
      `hard`, `q_4`
    ));
    mcqs.push(makeQuestion(
      `When analyzing variable allocations in a high-performance system, what is a key memory trade-off?`,
      `Minimizing scope lifetime to allow the garbage collector to reclaim heap space early.`,
      [`Naming variables in uppercase to make execution faster.`, `Declaring all variables in the global namespace.`, `Writing every variable value directly to external text files.`],
      `Keeping scopes small ensures variable references are cleared from stack frames and heap early, reducing memory footprint.`,
      `hard`, `q_5`
    ));
  } else if (titleLower.includes('const') || titleLower.includes('constant')) {
    mcqs.push(makeQuestion(
      `What is the primary architectural purpose of a constant (const) binding?`,
      `To declare values that should remain read-only and immutable throughout the execution.`,
      [`To speed up compiler calculations by 50%.`, `To permit duplicate declarations in the same scope.`, `To clear memory registers automatically.`],
      `Constants protect variables from being accidentally reassigned elsewhere in your code.`,
      `easy`, `q_1`
    ));
    mcqs.push(makeQuestion(
      `What happens if you attempt to reassign a constant variable in JavaScript?`,
      `It immediately throws a TypeError.`,
      [`The compiler ignores it and uses the old value.`, `The computer resets to clear heap buffers.`, `It updates the value anyway.`],
      `Reassigning a const binding raises 'TypeError: Assignment to constant variable'.`,
      `medium`, `q_2`
    ));
    mcqs.push(makeQuestion(
      `Which constant variable name follows the widely accepted naming convention?`,
      `MAX_USER_LIMIT`,
      [`maxUserLimit`, `Max_User_Limit`, `max_user_limit`],
      `Uppercase words separated by underscores is the standard convention for constant parameters.`,
      `medium`, `q_3`
    ));
    mcqs.push(makeQuestion(
      `Does declaring an object as const in JavaScript make its nested properties immutable?`,
      `No, const only locks the variable reference; nested properties can still be modified.`,
      [`Yes, it completely freezes the object and all its sub-objects.`, `No, objects cannot be declared as const.`, `Yes, but only for numeric fields.`],
      `To freeze an object's properties in JavaScript, you must use Object.freeze(). const only prevents reassignment of the object reference itself.`,
      `hard`, `q_4`
    ));
    mcqs.push(makeQuestion(
      `Why do compilers optimize constant declarations better than variables?`,
      `Because their values are fixed, enabling constant folding optimizations during compilation.`,
      [`Because constants bypass system garbage collection entirely.`, `Because constants are automatically multi-threaded.`, `Because constants do not use heap memory.`],
      `Compilers replace constant references with their actual values at compile time, eliminating lookup overhead.`,
      `hard`, `q_5`
    ));
  } else if (titleLower.includes('loop') || titleLower.includes('for') || titleLower.includes('while') || titleLower.includes('iteration')) {
    mcqs.push(makeQuestion(
      `What problem is solved by using loop control structures?`,
      `Eliminating code duplication when repeating identical actions.`,
      [`Reclaiming stack frame allocations early.`, `Converting string datatypes to numbers.`, `Handling database locking protocols.`],
      `Loops allow blocks of instructions to repeat continuously while conditions match, keeping source code DRY (Don't Repeat Yourself).`,
      `easy`, `q_1`
    ));
    mcqs.push(makeQuestion(
      `What condition causes a program to enter an infinite loop?`,
      `The exit condition remains true or is never updated to false.`,
      [`The index starts at number one instead of zero.`, `The loop is declared as a while loop instead of a for loop.`, `The loop iterates more than 100 times.`],
      `If loop boundaries are set incorrectly such that the exit condition is never satisfied, execution runs indefinitely, freezing the thread.`,
      `medium`, `q_2`
    ));
    mcqs.push(makeQuestion(
      `When should a for loop be preferred over a while loop?`,
      `When the number of loop iterations is predetermined or known beforehand.`,
      [`When checking database connections for activity.`, `When dealing with multi-threaded execution pools.`, `When accessing global variables.`],
      `For loops are ideal for counting ranges or iterating over collections of fixed size.`,
      `medium`, `q_3`
    ));
    mcqs.push(makeQuestion(
      `What is an off-by-one error (OBOE) in loop index boundaries?`,
      `An index mistake that iterates one time too many or one time too few, often causing index out of bounds.`,
      [`An error where the loop runs on a separate thread pool.`, `A type error caused by comparing numbers with strings.`, `A compiler warning regarding global variable hoisting.`],
      `OBOE typically occurs when setting limits to <= instead of < (or vice versa), causing loop limits to exceed index limits.`,
      `hard`, `q_4`
    ));
    mcqs.push(makeQuestion(
      `What is the time complexity of two nested loops where each iterates N times?`,
      `O(N^2) quadratic time.`,
      [`O(N) linear time.`, `O(2^N) exponential time.`, `O(log N) logarithmic time.`],
      `Nesting one loop inside another causes the inner loop to run N times for each outer loop step, leading to N * N operations.`,
      `hard`, `q_5`
    ));
  } else if (titleLower.includes('array') || titleLower.includes('list')) {
    mcqs.push(makeQuestion(
      `Which index refers to the first element in a zero-indexed array structure?`,
      `0`,
      [`1`, `-1`, `10`],
      `Zero-indexed array slots map index indices straight to byte offsets in memory. Index 0 references the start block.`,
      `easy`, `q_1`
    ));
    mcqs.push(makeQuestion(
      `How are elements of a standard array stored physically in hardware memory?`,
      `In a contiguous, sequential block of address spaces.`,
      [`In random locations connected by pointers.`, `Directly inside CPU registers.`, `In external database cache rows.`],
      `Arrays require sequential memory slots, enabling O(1) constant-time element lookup via offsets.`,
      `medium`, `2`
    ));
    mcqs.push(makeQuestion(
      `What property is used in JavaScript to fetch the current number of elements in an array?`,
      `.length`,
      [`.size`, `.count()`, `.sizeof()`],
      `The .length property returns the total elements active in the array.`,
      `medium`, `q_3`
    ));
    mcqs.push(makeQuestion(
      `What is the time complexity of inserting an element at index 0 of an array of size N?`,
      `O(N) linear time, because subsequent elements must be shifted in memory.`,
      [`O(1) constant time, since index 0 is accessed directly.`, `O(log N) logarithmic time.`, `O(N^2) quadratic time.`],
      `Adding elements at index 0 requires shifting all N existing elements to the next address slot, incurring linear overhead.`,
      `hard`, `q_4`
    ));
    mcqs.push(makeQuestion(
      `What is the main drawback of standard arrays compared to linked lists?`,
      `Fixed memory sizing and expensive element insertion/deletion.`,
      [`Slow random access lookups.`, `Poor usage of CPU caches.`, `Inability to store primitive datatypes.`],
      `Arrays have contiguous constraints, making allocations rigid and insertions/deletions slow due to index shifts.`,
      `hard`, `q_5`
    ));
  } else if (titleLower.includes('function') || titleLower.includes('method') || titleLower.includes('closure')) {
    mcqs.push(makeQuestion(
      `What is the primary software engineering goal of writing functions?`,
      `To encapsulate reusable logic blocks and improve modularity.`,
      [`To force the garbage collector to run on every line.`, `To make compiler files compile faster.`, `To override CPU hardware architecture constraints.`],
      `Functions group statement blocks into a single named block, ensuring DRY principles and code reuse.`,
      `easy`, `q_1`
    ));
    mcqs.push(makeQuestion(
      `What happens to local variables declared inside a function when the function call completes?`,
      `They are popped off the thread stack frame and cleaned from memory.`,
      [`They are converted to global constant values.`, `They remain in heap storage permanently.`, `They are printed to database log records.`],
      `Local scope bindings reside inside stack frames, which are automatically deallocated when functions return.`,
      `medium`, `q_2`
    ));
    mcqs.push(makeQuestion(
      `What is a base case in recursive function implementations?`,
      `A condition check that stops further recursion, preventing stack overflow.`,
      [`The main class entry point configuration.`, `The first line that allocates thread registers.`, `The exception catch block.`],
      `Without a base case, recursive functions push stack frames endlessly, causing stack overflow crashes.`,
      `medium`, `q_3`
    ));
    mcqs.push(makeQuestion(
      `What is a closure in programming?`,
      `A function that retains access to its lexical scope variables even when executed outside its original scope.`,
      [`A method that terminates the compiler execution loop.`, `A private class initializer.`, `A function that accepts only numeric values.`],
      `Closures combine function blocks with references to their enclosing lexical environments.`,
      `hard`, `q_4`
    ));
    mcqs.push(makeQuestion(
      `How does the stack frame manage arguments and local variables during a nested function call?`,
      `It pushes a new stack frame containing local variables and return addresses for each call.`,
      [`It dumps all local values straight into physical CPU caches.`, `It allocates static files in the project folder.`, `It bypasses memory systems entirely.`],
      `Each nested call creates a fresh stack record, isolating parameters and maintaining return execution paths.`,
      `hard`, `q_5`
    ));
  } else if (titleLower.includes('if') || titleLower.includes('condition') || titleLower.includes('branch') || titleLower.includes('boolean')) {
    mcqs.push(makeQuestion(
      `What is the primary function of conditional if-else statements?`,
      `To branch code execution pathways based on Boolean logical checks.`,
      [`To loop identical instructions continuously.`, `To declare read-only constant bindings.`, `To clean unused heap variables.`],
      `Conditionals guide thread steps to run different paths depending on logic gates.`,
      `easy`, `q_1`
    ));
    mcqs.push(makeQuestion(
      `What is short-circuit evaluation in logical AND (&&) operations?`,
      `Evaluation stops early if the first operand is false, since the outcome is guaranteed false.`,
      [`The script files compile early on warnings.`, `The CPU thread locks on infinite loops.`, `The values are cast to hex codes.`],
      `Logical AND requires all values to be true. If the first check fails, subsequent expressions are skipped.`,
      `medium`, `q_2`
    ));
    mcqs.push(makeQuestion(
      `Which comparison operator checks both value and type equality in JavaScript?`,
      `===`,
      [`==`, `=`, `!=`],
      `Strict equality (===) prevents type coercion bugs during comparison checks.`,
      `medium`, `q_3`
    ));
    mcqs.push(makeQuestion(
      `What is a common pitfall in nested if statement structures?`,
      `Readability problems and scope confusion (spaghetti logic).`,
      [`Under-allocating memory stack blocks.`, `Bypassing the compiler garbage collection routines.`, `Requiring static constant keywords.`],
      `Deep logic nesting is hard to parse and debug, so refactoring using guard clauses is recommended.`,
      `hard`, `q_4`
    ));
    mcqs.push(makeQuestion(
      `How does CPU branch prediction optimize condition statements?`,
      `By speculating on conditional directions to pre-fill instruction pipeline logs.`,
      [`By executing both paths in parallel threads.`, `By converting conditionals into constant ranges.`, `By deleting branch options.`],
      `Processors guess branch outcomes to avoid pipeline stalls. Mispredictions cause latency resets.`,
      `hard`, `q_5`
    ));
  } else if (titleLower.includes('sql') || titleLower.includes('select') || titleLower.includes('join') || titleLower.includes('query')) {
    mcqs.push(makeQuestion(
      `Which SQL clause is responsible for selecting and filtering database rows?`,
      `WHERE`,
      [`SELECT`, `FROM`, `ORDER BY`],
      `The WHERE clause filters dataset records based on specific logical conditions.`,
      `easy`, `q_1`
    ));
    mcqs.push(makeQuestion(
      `What is the result of executing an INNER JOIN between two tables?`,
      `It returns only rows that have matching values in both tables.`,
      [`It returns all rows from both tables regardless of matches.`, `It copies table structures into cache buffers.`, `It raises a Cartesian key exception.`],
      `INNER JOIN matches primary/foreign keys to merge related records, skipping unmatched lines.`,
      `medium`, `q_2`
    ));
    mcqs.push(makeQuestion(
      `How does a LEFT OUTER JOIN handle unmatched rows in the right table?`,
      `It returns all rows from the left table, displaying NULL for missing right columns.`,
      [`It ignores left rows that lack right matches.`, `It throws a foreign key violation error.`, `It populates missing columns with zeroes.`],
      `LEFT JOIN preserves all left table records, filling missing right table values with NULL.`,
      `medium`, `q_3`
    ));
    mcqs.push(makeQuestion(
      `What is a SQL Cartesian product (Cross Join) bug and when does it happen?`,
      `When JOIN conditions are missing, causing every row of table A to combine with every row of table B.`,
      [`When database index keys become fragmented.`, `When SELECT statements return zero results.`, `When columns have incorrect datatypes.`],
      `Omitting joining constraints yields A * B total rows, which wastes memory and processing time.`,
      `hard`, `q_4`
    ));
    mcqs.push(makeQuestion(
      `How do database indexes improve SELECT query performance?`,
      `By providing quick lookup trees to locate records without scanning entire tables.`,
      [`By sorting table records physically on disk on every save.`, `By encrypting user credential columns.`, `By clearing transaction buffers.`],
      `Indexes act like books index sections, permitting rapid B-Tree lookups instead of slow O(N) full table scans.`,
      `hard`, `q_5`
    ));
  } else {
    const probItSolves = b.problemItSolves || b.whyExists || 'Managing logical structure and organization.';
    const analogy = b.realWorldAnalogy || b.simpleExplanation || 'A systematic flow of execution.';
    const internalWorks = im.internalImplementation || im.deeperExplanation || 'A structured routing pattern.';
    const mistakesDesc = (im.debuggingWalkthrough && im.debuggingWalkthrough.bugDescription) || 'Invalid scope or boundary references.';
    const ivQuest = (iv.questions && iv.questions[0] && iv.questions[0].question) || `Explain the mechanism of ${t}.`;
    const ivAns = (iv.questions && iv.questions[0] && iv.questions[0].answer) || 'It separates concerns and organizes statements.';

    mcqs.push(makeQuestion(
      `Based on the curriculum for "${t}", which description best represents the primary problem it solves?`,
      `It addresses: "${probItSolves.substring(0, 100)}...".`,
      [
        `It bypasses hardware registers to run straight on local browser graphics units.`,
        `It forces all data inputs to map directly to external database file formats.`,
        `It clears the operating system background caches periodically.`
      ],
      `The lesson material indicates that this concept helps resolve specific scoping or logical layout issues in development.`,
      `easy`, `q_1`
    ));

    mcqs.push(makeQuestion(
      `Which of the following is the most accurate analogy or explanation for "${t}"?`,
      `"${analogy.substring(0, 100)}...".`,
      [
        `A static styling rule used purely for user interface card layouts.`,
        `A local networking socket that fetches external source libraries.`,
        `A compiler macro that disables memory allocation operations.`
      ],
      `This analogy helps conceptualize how data references are grouped and accessed.`,
      `medium`, `q_2`
    ));

    mcqs.push(makeQuestion(
      `Regarding the internal workings or deep details of "${t}", which statement is correct?`,
      `"${internalWorks.substring(0, 100)}...".`,
      [
        `It generates a thread pool of 50 asynchronous background actions.`,
        `It requires storing variable names inside root hardware storage slots.`,
        `It acts as a private syntax validator that turns off language checks.`
      ],
      `The implementation details in the lesson specify this operational pattern.`,
      `medium`, `q_3`
    ));

    mcqs.push(makeQuestion(
      `Which mistake is most common when implementing or working with "${t}"?`,
      `Scope issues or reference errors: "${mistakesDesc.substring(0, 100)}...".`,
      [
        `Declaring constants with lowercase variable letters.`,
        `Using external text editors to run compiler scripts.`,
        `Adding description text inside code comment headers.`
      ],
      `Common pitfalls involve scoping conflicts and incorrect reference logic.`,
      `hard`, `q_4`
    ));

    mcqs.push(makeQuestion(
      `Interview Prep: ${ivQuest.substring(0, 80)}`,
      `${ivAns.substring(0, 120)}...`,
      [
        `It is deprecated because it requires GPU-scheduling support.`,
        `It has no practical utility in real-world application pipelines.`,
        `It is only used to format web page navigation labels.`
      ],
      `This verifies a deep engineering grasp of architectural trade-offs.`,
      `hard`, `q_5`
    ));
  }

  const finalMcqs = [];
  for (let i = 1; i <= 5; i++) {
    finalMcqs.push(mcqs[i - 1]);
  }
  for (let i = 6; i <= 12; i++) {
    const template = mcqs[(i - 1) % 5];
    finalMcqs.push({
      ...template,
      id: `q_${i}`,
      question: `${template.question} (Level check ${i})`
    });
  }

  return { mcqs: finalMcqs };
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
  const cacheKey = `${getSlug(roadmapId)}:${getSlug(moduleName)}:${getSlug(title)}:${lang}`;
  if (compiledCache[cacheKey]) {
    return compiledCache[cacheKey];
  }

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

  // Load components statically if they exist
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

  const isTemplate = (str) => {
    if (!str || typeof str !== 'string') return true;
    const s = str.toLowerCase();
    return s.includes('from first principles') || 
           s.includes('acts as a named workspace or rule') || 
           s.includes('principles part') ||
           s.includes('core principles') ||
           s.includes('troubleshooting part') ||
           s.includes('implementation steps part') ||
           s.includes('running data structures & algorithms') ||
           s.includes('running web development') ||
           s.includes('running competitive');
  };

  // Enrich with premium static templates dynamically
  const dna = premiumCurriculum.getDynamicConceptDNA(title, langNorm);

  if (!beginner.motivation || isTemplate(beginner.motivation)) beginner.motivation = dna.motivation;
  if (!beginner.whyExists || isTemplate(beginner.whyExists)) beginner.whyExists = dna.whyExists;
  if (!beginner.realWorldAnalogy || isTemplate(beginner.realWorldAnalogy)) beginner.realWorldAnalogy = dna.analogy;
  if (!beginner.simpleExplanation || isTemplate(beginner.simpleExplanation)) {
    beginner.simpleExplanation = `At its core, **${title}** defines a structured logic pattern. In this lesson, we will cover how this operates under the hood, standard implementation rules, and real-world optimizations.`;
  }
  if (!beginner.syntaxExplanation || isTemplate(beginner.syntaxExplanation)) {
    beginner.syntaxExplanation = `To initialize this inside your projects, declare scoping variables and structure statements to match standard design patterns.`;
  }
  if (!beginner.visualDiagram || isTemplate(beginner.visualDiagram)) {
    beginner.visualDiagram = `[Start] ──► [Process Scope: ${title}] ──► [Evaluate Outputs] ──► [Complete]`;
  }

  if (!beginner.examples || beginner.examples.length === 0 || isTemplate(beginner.examples[0]?.code)) {
    beginner.examples = [{
      title: 'Beginner Implementation',
      code: dna.examples[langNorm]?.code || dna.examples['js']?.code || '// Code',
      explanation: dna.examples[langNorm]?.explanation || 'Basic pattern overview.'
    }];
  }

  if (!beginner.stepByStepExecution || beginner.stepByStepExecution.length === 0 || isTemplate(beginner.stepByStepExecution[0]?.desc)) {
    beginner.stepByStepExecution = dna.stepByStep.map((s, i) => ({ step: i + 1, desc: s.desc }));
  }

  if (!beginner.memoryDiagram) {
    beginner.memoryDiagram = {
      type: 'variables',
      theme: 'dark',
      slots: [
        { address: '0x7fff10', label: `${getSlug(title)}_ptr`, value: '0x7fff18' },
        { address: '0x7fff18', label: `${getSlug(title)}_val`, value: '100' }
      ]
    };
  }

  if (!intermediate.deeperExplanation) intermediate.deeperExplanation = `Scaling complex application systems requires utilizing **${title}** as a fundamental builder. This section explores internal allocation bounds and scoping behaviors.`;
  if (!intermediate.internalImplementation) intermediate.internalImplementation = `The execution runtime optimizes memory addresses mapping for ${title} records by placing static structures inside the Heap frame.`;
  if (!intermediate.examples || intermediate.examples.length === 0) {
    intermediate.examples = [{
      title: 'Intermediate Optimization Pattern',
      code: dna.examples[langNorm]?.code || '// Code',
      explanation: 'Optimized control block demonstrating boundary controls.'
    }];
  }
  if (!intermediate.performanceConsiderations) {
    intermediate.performanceConsiderations = {
      timeComplexity: dna.examples[langNorm]?.time || 'O(1)',
      spaceComplexity: dna.examples[langNorm]?.space || 'O(1)'
    };
  }
  if (!intermediate.bestPractices || intermediate.bestPractices.length === 0) {
    intermediate.bestPractices = [
      'Document boundary cases clearly inside configuration parameters.',
      'Prefer localized block constants to limit scope pollution.'
    ];
  }
  if (!intermediate.debuggingWalkthrough) {
    intermediate.debuggingWalkthrough = {
      bugDescription: 'Scope references evaluation failure when calling uninitialized indices.',
      incorrectCode: `// Mismatched scopes\nlet data;\nprocess(data);`,
      correctCode: `// Verified execution\nlet data = 100;\nprocess(data);`
    };
  }

  if (!expert.overview) expert.overview = `Production deployment architectures leverage **${title}** inside asynchronous loops to balance thread workloads.`;
  if (!expert.examples || expert.examples.length === 0) {
    expert.examples = [{
      title: 'Expert Decoupled Architecture',
      code: dna.examples[langNorm]?.code || '// Code',
      explanation: 'Production-ready framework showing thread decoupling.'
    }];
  }

  if (!practice.easy || !practice.easy.problem) {
    practice.easy = {
      title: 'Beginner Exercise',
      problem: `Write a simple function verifying that variables initialization works for **${title}** statements.`,
      starterCode: dna.examples[langNorm]?.code.split('\n').slice(0, 3).join('\n') || '// Starter',
      expectedOutput: 'Success',
      solution: dna.examples[langNorm]?.code || '// Solution',
      hints: ['Verify matching scoping brackets.']
    };
  }
  if (!practice.medium || !practice.medium.problem) {
    practice.medium = {
      title: 'Intermediate Challenge',
      problem: `Implement basic validation checks for inputs before applying **${title}** processing rules.`,
      starterCode: dna.examples[langNorm]?.code || '// Starter',
      expectedOutput: 'Success',
      solution: dna.examples[langNorm]?.code || '// Solution'
    };
  }
  if (!practice.hard || !practice.hard.problem) {
    practice.hard = {
      title: 'Advanced System Optimization',
      problem: `Optimize intermediate implementations of **${title}** to process bulk datasets within strict time thresholds.`,
      starterCode: dna.examples[langNorm]?.code || '// Starter',
      expectedOutput: 'Success',
      solution: dna.examples[langNorm]?.code || '// Solution'
    };
  }
  if (!practice.debugging || !practice.debugging.problem) {
    practice.debugging = {
      title: 'Bug Hunting Challenge',
      problem: 'Find and fix scoping syntax mismatch errors in the provided starter snippet.',
      starterCode: `// Buggy code\nfunction run() {\n  let ref;\n  console.log(ref.value);\n}`,
      solution: `// Solved code\nfunction run() {\n  let ref = { value: "Active" };\n  console.log(ref.value);\n}`
    };
  }

  let quizIsGeneric = false;
  if (quiz && quiz.mcqs) {
    for (const q of quiz.mcqs) {
      const qText = q.question || '';
      if (qText.toLowerCase().includes("which of the following is true about") || qText.includes("GPUs with zero CPU")) {
        quizIsGeneric = true;
        break;
      }
    }
  }

  if (!quiz.mcqs || quiz.mcqs.length === 0 || quizIsGeneric) {
    quiz = generateQuiz(title, moduleName, langNorm, { beginner, intermediate, expert, practice, cheatsheet, interview, revision });
  }

  if (!cheatsheet.sections || cheatsheet.sections.length === 0) {
    cheatsheet = generateCheatsheet(title, moduleName, langNorm);
  }

  if (!project.title || !project.description) {
    project = {
      title: `${title} Management System`,
      tagline: 'Practical Module Project Application',
      description: `Build a modular, structured codebase processing **${title}** rules, incorporating validation pipelines and testing metrics.`,
      learningGoals: [
        'Organize file configurations matching production criteria.',
        'Implement robust error checking logic doors.',
        'Optimize memory footprints during high-scale evaluations.'
      ],
      requirements: [
        'Include detailed instruction comments explaining execution logic.',
        'Support standard inputs format handling.',
        'Compile clean code output with zero syntax notices.'
      ],
      starterCode: dna.examples[langNorm]?.code || '// Starter code',
      solution: dna.examples[langNorm]?.code || '// Solution code',
      expectedOutput: 'Processed inputs successfully.',
      solutionExplanation: 'Integrates validation and array structures sequentially.',
      extensions: ['Support asynchronous operations.', 'Build a CLI menu dashboard.']
    };
  }

  if (!interview.questions || interview.questions.length === 0) {
    interview = {
      questions: [
        {
          question: `What is the core role of ${title} in standard architectures?`,
          answer: `**${title}** serves to organize execution pathways and isolate code logics. This ensures modularity, clean memory scoping, and maintainability.`,
          level: 'beginner',
          category: 'Conceptual'
        },
        {
          question: `Describe the time and space complexity characteristics of ${title}.`,
          answer: `Typically runs in O(N) or O(1) complexity depending on lookup constraints. Space complexity scales with elements count in heap frames.`,
          level: 'intermediate',
          category: 'Complexity'
        },
        {
          question: `How does standard multi-threading affect variables safety in ${title}?`,
          answer: `Concurrent mutation of states inside threads triggers lock hazards. Developers protect frames using sync locks or immutability blocks.`,
          level: 'advanced',
          category: 'Concurrency'
        }
      ]
    };
  }

  if (!revision.summary || !revision.keyTakeaways) {
    revision = {
      summary: `In this lesson, we mastered **${title}** core operations, syntax conventions, and execution steps.`,
      oneLineSummary: `Mastered ${title} syntax and optimizations.`,
      keyTakeaways: [
        `Variables inside ${title} adhere to scoping limitations.`,
        `Always perform input validation early to avoid logical crashes.`,
        `Complexity profiles should be traced during compile checks.`
      ],
      memoryTricks: [
        { concept: title, trick: `Remember it like labeling storage compartments inside your database.` }
      ],
      commonErrors: [
        { error: 'ReferenceError', cause: 'Reading undeclared labels.', fix: 'Verify bindings initialization before access.' }
      ],
      preInterviewChecklist: [
        `Understand structural syntax patterns.`,
        `Trace execution flows and performance metrics.`
      ],
      nextTopics: [
        { title: 'Data Structures Part B', whyNext: 'Extends scoping patterns to dynamic lists.' }
      ]
    };
  }

  if (!lesson.title) {
    lesson.title = title;
    lesson.learningObjectives = [`Master core rules of ${title}`, `Implement sample syntax loops`, `Analyze runtime complexities`];
    lesson.nextLessons = [];
  }

  // Double-check collections are arrays to avoid runtime mapping checks
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

  // Build generator context
  const ctx = {
    lesson: { title: title, language: langNorm, id: order },
    module: { title: moduleName, language: langNorm },
    roadmap: { title: roadmapId || 'Software Engineering', id: roadmapId },
    userContext: { xp: 500, rank: 'Beginner', completedLessons: [] }
  };
  const fullQuiz = offlineGen.generateQuizResponse(ctx);
  const fullProjects = offlineGen.generateProjectsResponse(ctx);

  // Build the unified 6-stage premium layout
  const stages = {
    overview: {
      objectives: lesson.learningObjectives || [`Master ${title} patterns`],
      prerequisites: lesson.prerequisites || [],
      estimatedTime: lesson.estimatedTime || '30 mins',
      difficulty: level,
      whyLearnThis: beginner.motivation,
      careerRelevance: `Crucial SDE role core concept. Frequently queried in technical screenings at Apple, Google, Microsoft, and Amazon.`
    },
    learn: {
      theory: beginner.simpleExplanation,
      visualExplanation: beginner.visualDiagram,
      realWorldAnalogy: beginner.realWorldAnalogy,
      stepByStepWalkthrough: lineByLineText,
      internalWorking: intermediate.internalImplementation,
      complexityAnalysis: `**Time Complexity:** ${intermediate.performanceConsiderations?.timeComplexity || 'O(1)'}\n\n**Space Complexity:** ${intermediate.performanceConsiderations?.spaceComplexity || 'O(1)'}`,
      commonMistakes: commonMistakesText,
      bestPractices: bestPracticesText,
      importantNotes: `Ensure clean parameter mappings and bounds safety when deploying systems.`
    },
    codelab: {
      multilingual: dna.examples, // JS, Python, Java, C++ code samples
      stepByStep: stepByStepList,
      memoryDiagram: beginner.memoryDiagram
    },
    practicelab: {
      easy: practice.easy,
      medium: practice.medium,
      hard: practice.hard,
      debugging: practice.debugging,
      quiz: fullQuiz.mcqs,
      fullQuiz: fullQuiz
    },
    interviewprep: {
      questions: interview.questions,
      cheatsheet: cheatsheet,
      revision: revision
    },
    projectassessment: {
      project: project,
      projects: fullProjects,
      assessment: {
        title: 'Module Final Assessment',
        questions: fullQuiz.mcqs.map((q, idx) => ({
          ...q,
          id: `aq_${idx + 1}`
        }))
      }
    }
  };

  // Enforce strict LessonValidator assertions
  const isOverviewValid = !!(stages.overview.whyLearnThis && stages.overview.whyLearnThis.length > 10);
  const isLearnValid = !!(stages.learn.theory && stages.learn.realWorldAnalogy && stages.learn.realWorldAnalogy.length > 10);
  const isCodeLabValid = !!(stages.codelab.multilingual.js && stages.codelab.multilingual.python && stages.codelab.multilingual.cpp && stages.codelab.multilingual.java);
  const isPracticeValid = !!(stages.practicelab.easy && stages.practicelab.quiz && stages.practicelab.quiz.length >= 5);
  const isInterviewValid = !!(stages.interviewprep.questions && stages.interviewprep.questions.length >= 3);
  const isProjectValid = !!(stages.projectassessment.project && stages.projectassessment.project.title);

  if (!isOverviewValid || !isLearnValid || !isCodeLabValid || !isPracticeValid || !isInterviewValid || !isProjectValid) {
    throw new Error(`Lesson "${title}" failed premium validation checklist validation. Gaps detected in core stages.`);
  }

  const content = {
    // Keep backward-compatible definition for page loading routing
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
    next_learning_path: (lesson.nextLessons && lesson.nextLessons[0]) || '',

    memoryDiagram: beginner.memoryDiagram ? JSON.stringify(beginner.memoryDiagram) : null,
    executionStepper: beginner.stepByStepExecution ? JSON.stringify(beginner.stepByStepExecution.map(s => ({
      line: s.step,
      code: beginner.examples && beginner.examples[0] ? beginner.examples[0].code.split('\n')[s.step - 1] || '// Step' : '// Step',
      explanation: s.desc
    }))) : null,
    checkpointQuestions: quiz.mcqs ? JSON.stringify(quiz.mcqs.slice(0, 3).map(q => {
      let correctIdx = 0;
      if (typeof q.answer === 'number') {
        correctIdx = q.answer;
      } else if (typeof q.answer === 'string') {
        if (q.answer.length === 1) {
          const code = q.answer.toUpperCase().charCodeAt(0);
          if (code >= 65 && code <= 90) {
            correctIdx = code - 65;
          } else {
            correctIdx = parseInt(q.answer) || 0;
          }
        } else {
          correctIdx = parseInt(q.answer) || 0;
        }
      }
      return {
        question: q.question,
        options: q.options,
        correct: correctIdx,
        explanation: q.explanation
      };
    })) : null,
    gradualCode: beginner.examples && intermediate.examples ? JSON.stringify([
      { step: 1, code: beginner.examples[0]?.code || '', explanation: beginner.examples[0]?.explanation || '' },
      { step: 2, code: intermediate.examples[0]?.code || '', explanation: intermediate.examples[0]?.explanation || '' }
    ]) : null,

    // Expose the 6 premium stages object
    stages,
    raw: {
      lesson, beginner, intermediate, expert, practice, quiz, cheatsheet, project, resources, videos, interview, revision,
      multilingual: dna.examples
    }
  };

  const compiled = {
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

  // Save to compiler cache
  compiledCache[cacheKey] = compiled;
  return compiled;
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
