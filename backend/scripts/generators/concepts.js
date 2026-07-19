'use strict';

const CONCEPTS = {};

function py(lang) { return lang === 'python'; }
function js(lang) { return lang === 'javascript' || lang === 'typescript'; }
function jv(lang) { return lang === 'java'; }

CONCEPTS.SETUP = function(title, moduleName, rmTitle, lang) {
  const ps = lang;
  return {
    title,
    curiosityQuestion: 'Every program depends on a hidden layer of infrastructure — what if the tools you use daily are more powerful than you realize?',
    whyExists: `Before you write a single line of code, your computer needs to understand and execute it. The ${ps} interpreter bridges human-readable code and machine instructions, managing memory and providing the runtime environment your programs depend on.`,
    problemItSolves: `In early computing, every program had to be written in raw binary. ${cap(ps)} lets humans write natural, readable syntax, and the interpreter handles the complex translation to machine instructions automatically.`,
    withoutVariables: `Imagine needing to speak fluent French just to order coffee in Paris. That is what programming was like before interpreters — you had to speak the computer's language (binary) natively.`,
    whereUsed: `${cap(ps)} interpreters are used everywhere: from small scripts on Raspberry Pis to massive server farms at Google, Netflix, and Spotify handling billions of requests daily.`,
    realWorldAnalogy: `Think of the ${ps} interpreter like a translator at the United Nations. A diplomat speaks in English (your code), the translator converts it to French (machine code), and the delegate acts on it. Without the translator, you would need to speak French fluently.`,
    simpleExplanation: `${cap(ps)} is an environment that reads your code line by line, checks for errors, and executes it. The interpreter manages variables, memory, and program flow so you can focus on solving problems instead of managing hardware details.`,
    syntaxExplanation: py(lang)
      ? `Python code is written in .py files. Comments start with #, functions use 'def', and blocks are indented with spaces. Statements execute in order from top to bottom.`
      : `JavaScript code is written in .js files. Comments use //, functions use 'function', and blocks are delimited by {}. Statements execute in order.`,
    examples: [{
      title: `Your First ${cap(ps)} Program`,
      code: py(lang)
        ? `print("Hello, World!")\n\nname = input("Enter your name: ")\nprint(f"Welcome, {name}!")`
        : `console.log("Hello, World!");\n\nconst name = prompt("Enter your name:");\nconsole.log(\`Welcome, \${name}!\`);`,
      explanation: 'This program demonstrates output, input, and string interpolation. The interpreter executes each line sequentially.',
      language: lang
    }],
    stepByStepExecution: [
      { step: 1, action: 'Write source code', explanation: `Create a ${py(lang) ? '.py' : '.js'} file with your program instructions.` },
      { step: 2, action: `${py(lang) ? 'Run the interpreter' : 'Execute with runtime'}`, explanation: `The ${ps} environment reads your file.` },
      { step: 3, action: 'Compile to bytecode', explanation: `${ps} converts your code to an intermediate representation the VM can process.` },
      { step: 4, action: 'Execute instructions', explanation: 'The VM runs your code line by line, managing memory and variables.' },
      { step: 5, action: 'Output results', explanation: 'Results are printed to the console or returned to the caller.' }
    ],
    memoryDiagram: {
      stack: '[Call Stack]\n  Main program frame\n  Local variables...',
      heap: '[Heap]\n  Runtime objects\n  Dynamic allocations',
      interpreter: '[Interpreter Pipeline]\n  Source -> Lexer -> Parser -> Compiler -> VM -> Output'
    },
    commonMistakes: [
      'Forgetting to save the file before running it',
      'Using the wrong command (python vs python3)',
      'Not having the correct interpreter version installed',
      'Misunderstanding indentation in Python'
    ],
    practice: {
      easyTitle: 'Hello, Environment',
      easyDesc: `Write a ${ps} script that prints your name, the date, and the ${ps} version.`,
      easyStarter: py(lang)
        ? `import sys\nfrom datetime import date\n\nname = "Your Name"\ntoday = date.today()\nversion = sys.version\nprint(f"Name: {name}")\nprint(f"Date: {today}")\nprint(f"Version: {version}")`
        : `const name = "Your Name";\nconst today = new Date();\nconst version = process.version;\nconsole.log(\`Name: \${name}\`);\nconsole.log(\`Date: \${today}\`);\nconsole.log(\`Version: \${version}\`);`,
      easySolution: py(lang)
        ? `import sys\nfrom datetime import date\nname = "Your Name"\ntoday = date.today()\nv = sys.version\nprint(f"Name: {name}")\nprint(f"Date: {today}")\nprint(f"Version: {v}")`
        : `const name = "Your Name";\nconst today = new Date();\nconst v = process.version;\nconsole.log(\`Name: \${name}\`);\nconsole.log(\`Date: \${today}\`);\nconsole.log(\`Version: \${v}\`);`,
      easyHints: ['Look up how to get the current date', 'Find the module that gives version info'],
      mediumTitle: 'Environment Inspector',
      mediumDesc: `List all environment variables, the working directory, and the ${ps} executable path.`,
      mediumStarter: py(lang)
        ? `import os\nimport sys\n\nfor key, value in os.environ.items():\n    print(f"{key}={value}")\nprint(f"\\nCWD: {os.getcwd()}")\nprint(f"EXE: {sys.executable}")`
        : `for (const [key, value] of Object.entries(process.env)) {\n  console.log(\`\${key}=\${value}\`);\n}\nconsole.log(\`\\nCWD: \${process.cwd()}\`);\nconsole.log(\`EXE: \${process.execPath}\`);`,
      mediumSolution: py(lang)
        ? `import os, sys\nfor k, v in os.environ.items():\n    print(f"{k}={v}")\nprint(f"\\nCWD: {os.getcwd()}")\nprint(f"EXE: {sys.executable}")`
        : `for (const [k, v] of Object.entries(process.env))\n  console.log(\`\${k}=\${v}\`);\nconsole.log(\`\\nCWD: \${process.cwd()}\`);\nconsole.log(\`EXE: \${process.execPath}\`);`,
      mediumHints: ['Environment variables are stored in a dictionary-like object', 'The current directory may differ from the script location'],
      debugTitle: `Debug the ${cap(ps)} Setup`,
      debugDesc: `The following ${ps} code has setup-related bugs. Find and fix them.`,
      debugBuggy: py(lang)
        ? `import os, sys, datetime\nprint(os.getcwd)\nprint("Version: " + sys.version_info)\ncurrent_time = datetime.datetime.now\nprint("Time: " + current_time)`
        : `console.log(process.cwd);\nconsole.log("Version: " + process.version());\nconst now = Date.now;\nconsole.log("Time: " + now);`,
      debugFixed: py(lang)
        ? `import os, sys, datetime\nprint(os.getcwd())\nprint(f"Version: {sys.version_info.major}.{sys.version_info.minor}")\nnow = datetime.datetime.now()\nprint(f"Time: {now}")`
        : `console.log(process.cwd());\nconsole.log("Version: " + process.version);\nconst now = Date.now();\nconsole.log("Time: " + now);`,
      debugBugs: ['Missing parentheses on function calls', 'Wrong concatenation of non-string types'],
      hardTitle: 'Mini REPL',
      hardDesc: 'Build a minimal interactive REPL with error handling.',
      hardStarter: py(lang)
        ? `def repl():\n    while True:\n        try:\n            code = input(">>> ")\n            result = eval(code)\n            if result: print(result)\n        except Exception as e:\n            print(f"Error: {e}")`
        : `function repl() {\n  const rl = require('readline').createInterface({input: process.stdin, output: process.stdout});\n  const prompt = () => rl.question('>>> ', input => {\n    try { console.log(eval(input)); } catch(e) { console.log('Error:', e.message); }\n    prompt();\n  });\n  prompt();\n}`,
      hardSolution: py(lang)
        ? `def repl():\n    while True:\n        try:\n            code = input(">>> ")\n            if code in ('exit','quit'): break\n            result = eval(code)\n            if result is not None: print(result)\n        except KeyboardInterrupt: break\n        except Exception as e: print(f"Error: {e}")`
        : `function repl() {\n  const rl = require('readline').createInterface({input: process.stdin, output: process.stdout});\n  const prompt = () => rl.question('>>> ', i => {\n    if (i==='exit'||i==='quit') return rl.close();\n    try { const r = eval(i); if (r !== undefined) console.log(r); } catch(e) { console.log('Error:', e.message); }\n    prompt();\n  });\n  prompt();\n}`,
      hardHints: ['Use eval() to execute code strings', 'Handle KeyboardInterrupt gracefully', 'The readline module helps create interactive programs']
    },
    quiz: {
      mcqs: [
        { id: 'q1', question: `What does the ${ps} interpreter do?`, options: ['Converts source code to machine code and executes it', 'Compiles to a standalone executable', 'Executes raw text directly', 'Uploads code to a remote server'], answer: 0, explanation: 'The interpreter reads source code, compiles to bytecode, and executes it on a virtual machine.' },
        { id: 'q2', question: `What is an advantage of interpreted languages like ${ps}?`, options: ['Faster execution than compiled languages', 'Easier development with immediate feedback', 'No programmer control over memory', 'Guaranteed security'], answer: 1, explanation: 'Interpreted languages provide rapid feedback — you can test code immediately without a separate compilation step.' },
        { id: 'q3', question: 'What happens on a syntax error?', options: ['The interpreter auto-fixes it', 'It skips the line and continues', 'It stops and reports a traceback', 'It shows a warning only'], answer: 2, explanation: 'The interpreter stops at the first syntax error and displays a traceback.' },
        { id: 'q4', question: 'Which mode runs code one line at a time?', options: ['Script mode', 'REPL mode', 'Compiled mode', 'Batch mode'], answer: 1, explanation: 'REPL (Read-Eval-Print-Loop) lets you type and execute code one line at a time.' },
        { id: 'q5', question: 'Why might a script work on one machine but fail on another?', options: ['Interpreters are identical everywhere', 'Different versions, missing deps, or OS differences', 'Scripts are platform-independent', 'The interpreter auto-adapts'], answer: 1, explanation: 'Differences in versions, installed packages, and OS can cause different behavior across machines.' }
      ],
      checkpoints: [
        { id: 'cp1', question: `True or False: The ${ps} interpreter executes code without any intermediate representation.`, answer: false, explanation: 'It compiles to bytecode before execution.' },
        { id: 'cp2', question: 'True or False: Virtual environments isolate project dependencies.', answer: true, explanation: 'They create isolated spaces for each project\'s dependencies.' }
      ]
    },
    project: {
      title: `Project: ${cap(ps)} Environment Diagnostics Tool`,
      tagline: 'Build a comprehensive system information tool.',
      description: `Create a CLI tool that displays detailed information about the ${ps} environment: version, installed packages, system info, and environment variables.`,
      requirements: ['Display interpreter version and path', 'List installed packages with versions', 'Show system info (OS, CPU, memory)', 'Display key environment variables', 'Handle errors gracefully'],
      learningGoals: ['Understand the runtime environment', 'Practice working with system modules', 'Build a practical diagnostic tool'],
      starterCode: py(lang)
        ? `#!/usr/bin/env python3\nimport sys, os, platform\n\ndef main():\n    print("="*60)\n    print("  Environment Diagnostics")\n    print("="*60)\n\nif __name__ == "__main__":\n    main()`
        : `#!/usr/bin/env node\nconst os = require('os');\nconst process = require('process');\n\nfunction main() {\n  console.log('='.repeat(60));\n  console.log('  Environment Diagnostics');\n  console.log('='.repeat(60));\n}\n\nmain();`,
      solution: py(lang)
        ? `#!/usr/bin/env python3\nimport sys, os, platform\n\ndef main():\n    print("="*60)\n    print("  Python Environment Diagnostics")\n    print("="*60)\n    print(f"\\nInterpreter: {sys.version}")\n    print(f"Path: {sys.executable}")\n    print(f"OS: {platform.system()} {platform.release()}")\n    print(f"CPU Cores: {os.cpu_count()}")\n    for key in ['PATH','HOME','USER']:\n        if key in os.environ:\n            print(f"{key}={os.environ[key][:80]}...")\n    print("\\n" + "="*60)`
        : `#!/usr/bin/env node\nconst os = require('os');\nconst process = require('process');\n\nfunction main() {\n  console.log('='.repeat(60));\n  console.log('  Node.js Environment Diagnostics');\n  console.log('='.repeat(60));\n  console.log(\`\\nRuntime: \${process.version}\`);\n  console.log(\`Path: \${process.execPath}\`);\n  console.log(\`OS: \${os.type()} \${os.release()}\`);\n  console.log(\`CPU Cores: \${os.cpus().length}\`);\n  ['PATH','HOME','USER'].forEach(k => {\n    if (process.env[k]) console.log(\`\${k}=\${process.env[k].substring(0,80)}...\`);\n  });\n  console.log('\\n' + '='.repeat(60));\n}\n\nmain();`,
      extensions: ['Add JSON output format', 'Include network information', 'Generate a shareable report URL']
    },
    cheatsheet: {
      syntax: py(lang)
        ? `python script.py        # Run a script\npython -m module_name   # Run as module\npython -c "code"        # Inline code\npython -i script.py     # Run then interactive`
        : `node script.js         # Run a script\nnode -e "code"          # Inline code\nnode -p "expr"          # Evaluate and print\nnode --inspect script   # Debug mode`,
      concepts: ['Interpreter: reads and executes code', 'Bytecode: compiled intermediate representation', 'REPL: interactive testing mode', 'Module: reusable code file', 'Virtual Environment: isolated dependencies'],
      dosDonts: ['✓ Use virtual environments', '✓ Pin dependency versions', '✓ Test on the same version as production', '✗ Run untrusted code without sandboxing', '✗ Ignore deprecation warnings', '✗ Assume all platforms are identical']
    },
    interview: {
      questions: [
        { question: 'Explain compiled vs interpreted languages. Where does ' + ps + ' fit?', answer: 'Compiled languages (C, Rust) produce machine code ahead of time. Interpreted languages use a runtime that reads and executes code on the fly. ' + cap(ps) + ' is compiled to bytecode, then interpreted by a VM — a hybrid approach giving portability and development speed.', followUp: 'How does JIT compilation blur this line?' },
        { question: 'What is the GIL in Python and how does it affect concurrency?', answer: 'The GIL prevents multiple native threads from executing Python bytecode simultaneously, simplifying memory management but limiting CPU-bound multi-threading. For CPU-bound work, use multiprocessing or C extensions.', followUp: 'How does Node.js handle concurrency without a GIL?' },
        { question: 'How do virtual environments solve dependency conflicts?', answer: 'They create isolated directories with their own interpreter and packages, so different projects can use different dependency versions without conflict.', followUp: 'How would you design a CI/CD pipeline for consistent environments?' }
      ]
    },
    oneLineSummary: `${cap(ps)} environment setup is the foundation — the interpreter translates your code into actions.`,
    summary: `This lesson covered the ${ps} runtime environment: what the interpreter does, how it executes code, the pipeline from source to output, and common modes of operation.`,
    keyTakeaways: ['The interpreter translates source code to bytecode, then executes it on a VM', 'Multiple execution modes serve different purposes', 'Virtual environments isolate project dependencies', 'Version and configuration differences cause cross-machine issues'],
    memoryTricks: ['Remember: Source -> Lexer -> Parser -> Compiler -> VM -> Output', 'Think of the interpreter as a translator: your language -> machine language -> action'],
    preInterviewChecklist: ['Can you explain compilation vs interpretation?', 'Do you understand how the GIL affects Python concurrency?', 'Can you set up a virtual environment from scratch?'],
    commonErrors: ['Running the wrong interpreter version', 'Forgetting to activate the virtual environment', 'Assuming production is the same as your machine'],
    mindMap: { central: `${cap(ps)} Environment`, branches: ['Interpreter', 'Bytecode & VM', 'Execution Modes', 'Virtual Environments', 'Debugging & Profiling', 'Packages & Dependencies'] },
    nextTopics: ['Package management', 'Advanced debugging', 'Containerization', 'Runtime security']
  };
};

CONCEPTS.CONDITIONALS = function(title, moduleName, rmTitle, lang) {
  const pyL = py(lang);
  const isTernary = /ternary/i.test(title);
  const isNested = /nested/i.test(title);

  function code(level) {
    if (level === 'simple') return pyL
      ? `age = 18\nif age >= 18:\n    print("You can vote")\nelse:\n    print("Too young to vote")`
      : `const age = 18;\nif (age >= 18) {\n  console.log("You can vote");\n} else {\n  console.log("Too young to vote");\n}`;
    if (level === 'medium') return pyL
      ? `score = 85\nif score >= 90:\n    grade = 'A'\nelif score >= 80:\n    grade = 'B'\nelif score >= 70:\n    grade = 'C'\nelse:\n    grade = 'F'\nprint(f"Grade: {grade}")`
      : `const score = 85;\nlet grade;\nif (score >= 90) grade = 'A';\nelse if (score >= 80) grade = 'B';\nelse if (score >= 70) grade = 'C';\nelse grade = 'F';\nconsole.log(\`Grade: \${grade}\`);`;
    if (level === 'ternary') return pyL
      ? `age = 20\nstatus = "adult" if age >= 18 else "minor"\nprint(status)`
      : `const age = 20;\nconst status = age >= 18 ? "adult" : "minor";\nconsole.log(status);`;
    return code('simple');
  }

  return {
    title,
    curiosityQuestion: 'What if your program could make decisions on its own, choosing different actions based on the situation?',
    whyExists: 'Programs need to react differently to different situations. A login system must grant access to legitimate users and deny intruders. Conditional statements give programs this decision-making ability.',
    problemItSolves: 'Without conditionals, every program would follow the exact same sequence every time, making software useless for scenarios requiring adaptive behavior based on input or state.',
    withoutVariables: 'Imagine a traffic light that only shows green, regardless of traffic conditions. That is programming without conditionals — no ability to adapt to different situations.',
    whereUsed: 'Conditionals are everywhere: form validation, access control, game logic, data processing pipelines, and virtually every piece of software ever written.',
    realWorldAnalogy: 'Think of if/else like a traffic intersection. The light (condition) determines which path traffic takes. Green means go straight, red means stop, turn signals mean turn. The same intersection handles multiple scenarios by checking conditions.',
    simpleExplanation: 'An if/else statement checks a condition — true or false. If true, one block runs. If false, another (the else) can run. This lets your program make binary decisions.',
    syntaxExplanation: pyL
      ? `if condition:\n    action()\nelif other_condition:\n    other_action()\nelse:\n    default_action()`
      : `if (condition) {\n  action();\n} else if (otherCondition) {\n  otherAction();\n} else {\n  defaultAction();\n}`,
    examples: [{ title: `${isTernary ? 'Ternary Operator' : 'If/Else Statement'}`, code: code(isTernary ? 'ternary' : 'simple'), explanation: 'The condition is evaluated first. If true, the first block executes. If false, the else block runs. Only one block ever executes.', language: lang }],
    stepByStepExecution: [
      { step: 1, action: 'Evaluate the condition', explanation: 'The boolean expression is evaluated to True or False.' },
      { step: 2, action: 'Choose the branch', explanation: pyL ? 'If True: run the indented block. If False: skip to elif or else.' : 'If true: run the {} block. If false: skip to else if or else.' },
      { step: 3, action: 'Execute the selected block', explanation: 'Only the matching branch executes — others are skipped.' },
      { step: 4, action: 'Continue after the conditional', explanation: 'Execution continues with the next statement after the structure.' }
    ],
    commonMistakes: ['Using = (assignment) instead of == (comparison) in conditions', 'Forgetting the colon (Python) or curly braces (JS/Java)', 'Not handling all possible cases (missing else)', 'Overcomplicating with deeply nested if/else when a switch or lookup table would be cleaner'],
    deeperExplanation: 'Beyond simple true/false, conditionals can be chained (elif/else if), nested, and combined with logical operators (and/or/not). Every conditional creates a branch in the control flow graph — understanding this helps you reason about possible code paths.',
    mutabilityExplained: 'Variables in conditions are read-only during evaluation. The code inside each branch can freely modify variables, which is how conditionals control program state.',
    noneValue: 'In most languages, None/null/undefined are falsy. Be explicit when checking for them, as 0, empty strings, and empty collections are also falsy.',
    internalImplementation: `Compilers convert if/else into conditional jump instructions. The CPU evaluates the condition, sets a flag, and conditionally jumps to different addresses. This makes conditionals extremely fast.`,
    intermediateExamples: [{ title: 'Chained Conditions', code: code('medium'), explanation: 'Multiple elif/else if blocks check a series of conditions in order. The first match wins — this is more efficient than independent if statements.', language: lang }],
    bestPractices: ['Handle the most specific cases first, general cases last', 'Avoid deep nesting — extract conditions into named functions', 'Use switch/pattern matching for single-value comparisons', 'Always consider the else/default case', 'Prefer positive conditions for clarity'],
    debuggingWalkthrough: { scenario: 'A function returns wrong results for certain inputs because a condition misses edge cases.', steps: ['List all possible inputs and expected outputs', 'Check if any input falls through all conditions', 'Verify the order of conditions', 'Test boundary values: 0, negative, empty, null', 'Use a debugger to step through each branch'] },
    edgeCases: ['Floating-point comparisons — never use exact equality', 'Short-circuit evaluation in logical operators', 'Falsy values: 0, "", null, undefined, NaN', 'Integer overflow affecting comparisons'],
    performanceNotes: { notes: 'Branch prediction makes conditionals fast, but mispredicted branches cause pipeline stalls. Arrange conditions by frequency for optimal performance.', bigO: { best: 'O(1)', average: 'O(1)', worst: 'O(n)' } },
    expertOverview: 'Expert-level conditionals involve branch prediction optimization, control flow integrity, and writing branching code that is both secure and verifiable. Modern compilers optimize via jump tables and loop unrolling.',
    industryContext: 'In high-frequency trading, developers arrange conditions so the CPU\'s branch predictor guesses correctly most of the time. In safety-critical systems, conditionals must be proven to cover all possible states.',
    expertExamples: [{ title: 'Branch Prediction Optimized', code: pyL
      ? `# Common case first (fastest)\nif user.role == 'viewer':  # 80%\n    grant_read()\nelif user.role == 'editor':  # 15%\n    grant_edit()\nelse:  # 5%\n    grant_full()`
      : `// Most common case first\nif (user.role === 'viewer') grantRead();\nelse if (user.role === 'editor') grantEdit();\nelse grantFull();`, explanation: 'Modern CPUs predict which branch will be taken. If correct, execution continues at full speed. If wrong, the pipeline flushes — a costly operation.', language: lang }],
    codeReviewChecklist: ['Does every if have an else?', 'Are all enum/union values handled?', 'Is branch order optimized for the common case?', 'Are there always-true or always-false conditions?'],
    testingPatterns: { unitTests: 'Test every branch in isolation', integrationTests: 'Verify combinations work together', propertyBasedTests: 'Generate random inputs to find missed branches', benchmarkTests: 'Measure branch prediction accuracy' },
    refactoringGuide: { smell: 'Function with 4+ levels of nested if/else', solution: 'Extract into functions, use guard clauses, or replace with polymorphism', steps: ['Identify the outermost condition', 'Extract nested blocks into functions', 'Use early returns to flatten', 'Consider a lookup table or strategy pattern'] },
    securityConsiderations: ['Never use eval() with user input', 'Be careful of timing side channels in security checks', 'Ensure auth checks run before sensitive branches', 'Avoid revealing internal state through error messages'],
    scalability: { considerations: 'Large if/else chains become maintenance nightmares. Consider rules engines or decision trees for complex branching.', recommendations: ['Extract business rules into config files', 'Use Strategy pattern', 'Log which branches are taken in production', 'Monitor branch coverage'] },
    complexityAnalysis: { timeComplexity: 'O(1) per condition check', spaceComplexity: 'O(1)', notes: 'Cyclomatic complexity increases with each branch — keep it under 10 per function' },
    practice: {
      easyTitle: 'Number Classification',
      easyDesc: 'Write a function that returns "positive", "negative", or "zero".',
      easyStarter: pyL ? `def classify(n):\n    pass\n\nprint(classify(5))\nprint(classify(-3))\nprint(classify(0))` : `function classify(n) {\n  \n}\n\nconsole.log(classify(5));\nconsole.log(classify(-3));\nconsole.log(classify(0));`,
      easySolution: pyL ? `def classify(n):\n    if n > 0: return "positive"\n    elif n < 0: return "negative"\n    else: return "zero"` : `function classify(n) {\n  if (n > 0) return "positive";\n  else if (n < 0) return "negative";\n  else return "zero";\n}`,
      easyHints: ['What three relationships can a number have with zero?', 'Handle the zero case explicitly'],
      mediumTitle: 'Leap Year Detector',
      mediumDesc: 'Return true if a year is a leap year (divisible by 4, except centuries not divisible by 400).',
      mediumStarter: pyL ? `def is_leap(year):\n    pass\n\nprint(is_leap(2024))\nprint(is_leap(1900))\nprint(is_leap(2000))` : `function isLeap(year) {\n  \n}\n\nconsole.log(isLeap(2024));\nconsole.log(isLeap(1900));\nconsole.log(isLeap(2000));`,
      mediumSolution: pyL ? `def is_leap(year):\n    if year % 400 == 0: return True\n    elif year % 100 == 0: return False\n    elif year % 4 == 0: return True\n    else: return False` : `function isLeap(year) {\n  if (year % 400 === 0) return true;\n  else if (year % 100 === 0) return false;\n  else if (year % 4 === 0) return true;\n  else return false;\n}`,
      mediumHints: ['Check the most restrictive rule first (400)', 'The order of conditions matters'],
      hardTitle: 'Date Validator',
      hardDesc: 'Validate a date (day, month, year) — check month range, days per month, and leap year February.',
      hardSolution: pyL ? `def is_leap(y): return y%400==0 or (y%100!=0 and y%4==0)\ndef validate(d, m, y):\n    if m<1 or m>12 or y<1: return False\n    dim = [31,29 if is_leap(y) else 28,31,30,31,30,31,31,30,31,30,31]\n    return 1<=d<=dim[m-1]` : `function isLeap(y) { return y%400===0 || (y%100!==0 && y%4===0); }\nfunction validate(d, m, y) {\n  if (m<1||m>12||y<1) return false;\n  const dim = [31,isLeap(y)?29:28,31,30,31,30,31,31,30,31,30,31];\n  return d>=1 && d<=dim[m-1];\n}`,
      hardHints: ['Store days per month in an array', 'Reuse your leap year function', 'Validate month and year before day'],
      debugTitle: 'Debug the Conditions',
      debugBuggy: pyL ? `def discount(price, is_member):\n    if is_member = True:\n        return price * 0.8\n    if price > 100:\n        return price * 0.9\n    return price` : `function discount(price, isMember) {\n  if (isMember = true) return price * 0.8;\n  if (price > 100) return price * 0.9;\n  return price;\n}`,
      debugFixed: pyL ? `def discount(price, is_member):\n    if is_member: return price * 0.8\n    elif price > 100: return price * 0.9\n    return price` : `function discount(price, isMember) {\n  if (isMember) return price * 0.8;\n  else if (price > 100) return price * 0.9;\n  return price;\n}`,
      debugBugs: ['Assignment (=) instead of comparison (==) — always true', 'Missing elif — both conditions can apply, giving double discount']
    },
    quiz: {
      mcqs: [
        { id: 'q1', question: 'What does `True and False` evaluate to?', options: ['True', 'False', 'None', 'Error'], answer: 1, explanation: 'AND returns True only when both operands are True.' },
        { id: 'q2', question: 'What is the difference between `=` and `==`?', options: ['They are the same', '`=` assigns, `==` compares', '`=` compares, `==` assigns', 'Both compare'], answer: 1, explanation: 'Single `=` is assignment. Double `==` is comparison.' },
        { id: 'q3', question: 'In if/elif/else, how many branches execute?', options: ['All of them', 'Only the first match', 'All matching ones', 'None'], answer: 1, explanation: 'The first True condition triggers its branch; the rest are skipped.' },
        { id: 'q4', question: 'What does `not (x > 0 or y < 10)` mean?', options: ['x > 0 or y < 10', 'x <= 0 and y >= 10', 'x <= 0 or y >= 10', 'Always false'], answer: 1, explanation: 'By De Morgan\'s law, `not (A or B)` equals `(not A) and (not B)`.' },
        { id: 'q5', question: 'Is an if without an else valid?', options: ['No, it causes an error', 'Yes, the block simply skips if false', 'Only in some languages', 'It depends on the condition'], answer: 1, explanation: 'An if without else simply skips the block when the condition is false.' }
      ],
      checkpoints: [
        { id: 'cp1', question: 'True or False: An if without an else causes an error if the condition is false.', answer: false, explanation: 'It simply skips the block — no error.' },
        { id: 'cp2', question: 'True or False: elif is the same as a separate if statement.', answer: false, explanation: 'With elif, once a condition matches, the rest are skipped. Separate ifs evaluate every condition.' }
      ]
    },
    project: {
      title: 'Project: Loan Decision Engine',
      tagline: 'Build a rule-based loan approval system using conditionals.',
      description: 'Create a program that evaluates loan applications using credit score, income, debt ratio, and employment status — applying business rules through conditionals.',
      requirements: ['Define at least 4 input criteria with ranges', 'Implement decision rules using if/elif/else', 'Handle all edge cases', 'Return a clear decision with explanation', 'Include 3+ test cases'],
      learningGoals: ['Master complex conditional chains', 'Practice handling interdependent conditions', 'Build real-world business logic'],
      starterCode: pyL ? `def evaluate_loan(credit_score, income, debt_ratio, employed):\n    reasons = []\n    # Your rules here\n    pass` : `function evaluateLoan(credit, income, debt, employed) {\n  const reasons = [];\n  // Your rules here\n}`,
      solution: pyL ? `def evaluate_loan(credit, income, debt, emp):\n    reasons = []\n    if credit < 600: reasons.append("Low credit")\n    if income < 25000: reasons.append("Low income")\n    if debt > 0.43: reasons.append("High DTI")\n    if not emp: reasons.append("Unemployed")\n    if not reasons: return (True, "Approved")\n    return (False, f"Denied: {'; '.join(reasons)}")` : `function evaluateLoan(credit, income, debt, emp) {\n  const r = [];\n  if (credit < 600) r.push("Low credit");\n  if (income < 25000) r.push("Low income");\n  if (debt > 0.43) r.push("High DTI");\n  if (!emp) r.push("Unemployed");\n  if (!r.length) return {approved: true, reason: "Approved"};\n  return {approved: false, reason: "Denied: " + r.join("; ")};\n}`,
      extensions: ['Add tiered interest rates', 'Build a web interface', 'Add weighted scoring']
    },
    cheatsheet: {
      syntax: pyL ? `if condition:\n    action()\nelif other:\n    other_action()\nelse:\n    default()\n\nvalue = a if cond else b` : `if (condition) {\n  action();\n} else if (other) {\n  otherAction();\n} else {\n  defaultAction();\n}\n\nconst value = cond ? a : b;`,
      concepts: ['Condition: boolean expression', 'Branch: code path selected by condition', 'Chaining: elif/else if for multiple conditions', 'Nesting: conditions inside conditions'],
      patterns: ['Guard clause: return early on invalid input', 'Lookup table: replace long if/else with a map', 'Strategy pattern: replace conditionals with polymorphism'],
      dosDonts: ['✓ Use === over == in JS', '✓ Handle the else case explicitly', '✓ Keep conditions simple', '✗ Use = for comparison', '✗ Nest deeper than 3 levels', '✗ Forget falsy values (0, "", null)']
    },
    interview: {
      questions: [
        { question: 'Explain if/else vs switch. When would you use each?', answer: 'If/else checks arbitrary boolean conditions and supports ranges. Switch compares one value against discrete cases. Use if/else for complex conditions; switch for single-value multi-case comparisons, which is often faster (jump table) and more readable.', followUp: 'How would you refactor a long if/else chain?' },
        { question: 'What is short-circuit evaluation?', answer: 'Logical operators &&/|| stop evaluating once the result is determined. In "A && B", if A is false, B is never evaluated — useful for guarding: `if (user && user.name)`. In "A || B", if A is true, B is skipped — useful for defaults: `const name = input || "default"`.', followUp: 'Can short-circuit evaluation cause bugs?' },
        { question: 'How do you test all branches of a complex conditional without exponential test cases?', answer: 'Use equivalence partitioning and boundary value analysis. Group inputs into classes. Test one example per class plus boundaries. For "score >= 90 -> A, score >= 80 -> B", test 89, 90, 79, 80.', followUp: 'What tools measure branch coverage?' }
      ]
    },
    oneLineSummary: 'Conditional statements let programs make decisions by choosing different paths based on boolean conditions.',
    summary: 'We covered how if/else statements allow programs to branch based on conditions: evaluation, selection, chaining, logical operators, and common pitfalls like = vs ==.',
    keyTakeaways: ['Conditions evaluate to True/False and determine which branch runs', 'Only one branch in if/elif/else executes', 'Use logical operators (and/or/not) to combine conditions', 'Always consider the else case'],
    memoryTricks: ['Think of a fork in the road — the condition determines your path', 'Remember: = is assignment (set), == is comparison (check)'],
    preInterviewChecklist: ['Can you write a leap year checker from memory?', 'Do you understand short-circuit evaluation?', 'Can you explain = vs ==?'],
    commonErrors: ['Using = instead of ==', 'Floating-point == comparisons', 'Missing else cases', 'Dead code from always-true/false conditions'],
    mindMap: { central: 'Conditionals', branches: ['If/Else', 'Chained Conditions', 'Logical Operators', 'Comparison', 'Ternary', 'Switch/Match', 'Branch Prediction'] },
    nextTopics: ['Switch statements and pattern matching', 'Polymorphism as alternative to conditionals', 'Branch prediction and CPU architecture']
  };
};

CONCEPTS.LOOPS = function(title, moduleName, rmTitle, lang) {
  const pyL = py(lang);
  const isWhile = /while/i.test(title);
  const typ = isWhile ? 'while' : 'for';

  function code(level) {
    if (level === 'simple') return pyL
      ? `# Sum numbers 1 to 5\ntotal = 0\nfor i in range(1, 6):\n    total += i\nprint(total)  # 15`
      : `// Sum numbers 1 to 5\nlet total = 0;\nfor (let i = 1; i <= 5; i++) {\n  total += i;\n}\nconsole.log(total);  // 15`;
    if (level === 'while') return pyL
      ? `count = 0\nwhile count < 5:\n    print(count)\n    count += 1`
      : `let count = 0;\nwhile (count < 5) {\n  console.log(count);\n  count++;\n}`;
    if (level === 'nested') return pyL
      ? `for i in range(3):\n    for j in range(3):\n        print(i, j)`
      : `for (let i = 0; i < 3; i++) {\n  for (let j = 0; j < 3; j++) {\n    console.log(i, j);\n  }\n}`;
    return code('simple');
  }

  return {
    title,
    curiosityQuestion: 'What if you had to write the same instruction a thousand times — would you copy-paste or teach the computer to repeat?',
    whyExists: 'Repetition is at computing\'s heart. Processing 10,000 records, sending notifications to every user, or summing millions of numbers would be impossible if each step had to be written individually. Loops define the work once and repeat it efficiently.',
    problemItSolves: 'Without loops, you copy-paste code for every item — impractical for large datasets and impossible when repetition count is unknown at compile time.',
    withoutVariables: 'Imagine an assembly line worker who has to be told every single step for every single item. Loops are the automation that lets the line run without constant instruction.',
    whereUsed: 'Every program with collections, data processing, batch operations, or repeated calculations uses loops. They are fundamental to computing.',
    realWorldAnalogy: 'A loop is like a factory conveyor belt. Items come down the line one by one. Each goes through the same stations (loop body). The belt keeps moving as long as there are items (condition is true).',
    simpleExplanation: pyL
      ? `A for loop iterates over a sequence (list, range, string). A while loop runs as long as a condition is true. Each repetition is called an iteration.`
      : `A for loop repeats code a set number of times or over a collection. A while loop runs while a condition is true. Each pass is an iteration.`,
    syntaxExplanation: pyL
      ? `for item in collection:\n    process(item)\n\nwhile condition:\n    do_something()\n    update_condition()`
      : `for (let i = 0; i < n; i++) { process(i); }\n\nwhile (condition) {\n  doSomething();\n  updateCondition();\n}`,
    examples: [{ title: `${cap(typ)} Loop`, code: code(isWhile ? 'while' : 'simple'), explanation: 'The loop body runs once per iteration. In a for loop, the counter updates automatically. In a while loop, you must update the condition to avoid infinite loops.', language: lang }],
    stepByStepExecution: [
      { step: 1, action: 'Initialize', explanation: isWhile ? 'Set up the condition variable.' : 'Set the loop counter start value.' },
      { step: 2, action: 'Check condition', explanation: 'If true, enter the body. If false, exit the loop.' },
      { step: 3, action: 'Execute body', explanation: 'Run the statements inside the loop.' },
      { step: 4, action: 'Update', explanation: isWhile ? 'Modify the condition variable.' : 'Increment the counter.' },
      { step: 5, action: 'Repeat from step 2', explanation: 'Continue until the condition is false.' }
    ],
    commonMistakes: ['Infinite loops — forgetting to update the condition', 'Off-by-one errors (<= vs <)', 'Modifying the collection while iterating', 'Using the loop variable after the loop ends'],
    deeperExplanation: 'Loops are more than repetition — understanding iterator protocols, generators, and lazy evaluation enables efficient data processing. Loops can be nested, creating multi-dimensional iteration for matrices and grids.',
    mutabilityExplained: 'The loop variable is typically read-only within the body. The collection being iterated should not be modified during iteration.',
    noneValue: 'An empty iterable means the loop body never executes — this is valid. Your code should handle it gracefully.',
    internalImplementation: 'The for loop uses an iterator protocol: get iterator from collection, call next() repeatedly until exhausted. Understanding this lets you create custom iterable objects.',
    intermediateExamples: [{ title: 'Nested Loop — Matrix', code: code('nested'), explanation: 'The outer loop iterates rows, the inner iterates columns. Total iterations = rows × columns.', language: lang }],
    bestPractices: ['Prefer for over while for known collections', 'Use break/continue for flow control', 'Keep loop bodies short', 'Avoid modifying collections during iteration', 'Consider map/filter/reduce as alternatives'],
    debuggingWalkthrough: { scenario: 'A loop processes a list but skips items.', steps: ['Check if modifying the list inside the loop', 'Verify the loop variable updates correctly', 'Check for off-by-one errors', 'Print the loop variable each iteration', 'Test with 3 items to isolate the bug'] },
    edgeCases: ['Empty collection', 'Single-element collection', 'Very large collection (memory/performance)', 'Collection modified during iteration'],
    performanceNotes: { notes: 'Loops are highly optimized, but nested loops multiply complexity. Keep bodies short and avoid deep nesting.', bigO: { best: 'O(1)', average: 'O(n)', worst: 'O(n^m) for m nested' } },
    expertOverview: 'Expert loop usage involves vectorization, loop unrolling, parallel streams, and replacing loops with higher-order functions (map/filter/reduce).',
    industryContext: 'In data processing, loops are the primary bottleneck. Companies use loop tiling (cache efficiency), unrolling (reducing branch overhead), and parallel streams (multi-core) for throughput.',
    expertExamples: [{ title: 'Functional Alternative', code: pyL
      ? `# Instead of loop\nresult = [x*2 for x in data if x % 2 == 0]\n\n# Higher-order functions\nresult = list(map(lambda x: x*2, filter(lambda x: x%2==0, data)))`
      : `// Instead of loop\nconst result = data.filter(x => x % 2 === 0).map(x => x * 2);`, explanation: 'Higher-order functions express intent more clearly than loops and are often optimized internally.', language: lang }],
    codeReviewChecklist: ['Could this loop be replaced with map/filter?', 'Is iteration order independent? (parallelizable?)', 'Are there loop-carried dependencies?', 'Could a different data structure eliminate the loop?'],
    testingPatterns: { unitTests: 'Test with empty, single, multi-element', integrationTests: 'Verify with actual data sources', propertyBasedTests: 'Test iteration-order independence', benchmarkTests: 'Compare loop vs functional alternatives' },
    refactoringGuide: { smell: 'Complex loop with conditionals and state mutations', solution: 'Extract body into pure function, use map/filter/reduce', steps: ['Identify what the loop produces', 'Extract per-element operation into function', 'Replace for with comprehension/pipeline', 'Verify identical output'] },
    scalability: { considerations: 'Large loops can be parallelized using multiprocessing or worker threads. Measure before optimizing.', recommendations: ['Profile before optimizing loops', 'Chunked processing for large data', 'Parallel for CPU-bound independent iterations'] },
    complexityAnalysis: { timeComplexity: 'O(n) single, O(n*m) nested', spaceComplexity: 'O(1) basic, O(n) accumulating', notes: 'Nested levels multiply complexity' },
    practice: {
      easyTitle: 'Sum to N',
      easyDesc: 'Write a loop that sums all numbers from 1 to N.',
      easyStarter: pyL ? `def sum_to(n):\n    total = 0\n    # Your loop\n    return total\n\nprint(sum_to(10))` : `function sumTo(n) {\n  let total = 0;\n  // Your loop\n  return total;\n}\n\nconsole.log(sumTo(10));`,
      easySolution: pyL ? `def sum_to(n):\n    total = 0\n    for i in range(1, n+1):\n        total += i\n    return total` : `function sumTo(n) {\n  let total = 0;\n  for (let i = 1; i <= n; i++) total += i;\n  return total;\n}`,
      easyHints: ['Start total at 0', 'Add each number one at a time'],
      mediumTitle: 'Find Primes',
      mediumDesc: 'Find all prime numbers up to N using nested loops.',
      mediumStarter: pyL ? `def find_primes(n):\n    primes = []\n    # Your nested loop\n    return primes\n\nprint(find_primes(20))` : `function findPrimes(n) {\n  const primes = [];\n  // Your nested loop\n  return primes;\n}\n\nconsole.log(findPrimes(20));`,
      mediumSolution: pyL ? `def find_primes(n):\n    primes = []\n    for num in range(2, n+1):\n        is_prime = True\n        for d in range(2, int(num**0.5)+1):\n            if num % d == 0:\n                is_prime = False\n                break\n        if is_prime: primes.append(num)\n    return primes` : `function findPrimes(n) {\n  const primes = [];\n  for (let num = 2; num <= n; num++) {\n    let isPrime = true;\n    for (let d = 2; d <= Math.sqrt(num); d++) {\n      if (num % d === 0) { isPrime = false; break; }\n    }\n    if (isPrime) primes.push(num);\n  }\n  return primes;\n}`,
      mediumHints: ['Outer loop checks each number', 'Inner loop tests divisors up to sqrt(n)', 'Use break when you find a divisor'],
      hardTitle: 'Flatten Nested Array',
      hardDesc: 'Write a function that flattens a nested array (any depth) using loops and recursion.',
      hardStarter: pyL ? `def flatten(arr):\n    pass\n\nprint(flatten([1, [2, [3, 4]], 5]))` : `function flatten(arr) {\n  \n}\n\nconsole.log(flatten([1, [2, [3, 4]], 5]));`,
      hardSolution: pyL ? `def flatten(arr):\n    result = []\n    for item in arr:\n        if isinstance(item, list):\n            result.extend(flatten(item))\n        else:\n            result.append(item)\n    return result` : `function flatten(arr) {\n  const result = [];\n  for (const item of arr) {\n    if (Array.isArray(item)) result.push(...flatten(item));\n    else result.push(item);\n  }\n  return result;\n}`,
      hardHints: ['Check if each element is a list', 'Recursively flatten sublists', 'Extend result with flattened sublist'],
      debugTitle: 'Debug the Loop',
      debugBuggy: pyL ? `total = 0\nfor i in range(10):\n    if i % 2 = 0:\n        total =+ i\nprint(total)` : `let total = 0;\nfor (let i = 0; i <= 10; i++); {\n  if (i % 2 = 0) total =+ i;\n}\nconsole.log(total);`,
      debugFixed: pyL ? `total = 0\nfor i in range(11):\n    if i % 2 == 0:\n        total += i\nprint(total)` : `let total = 0;\nfor (let i = 0; i <= 10; i++) {\n  if (i % 2 === 0) total += i;\n}\nconsole.log(total);`,
      debugBugs: ['Assignment = instead of comparison ==', '=+ instead of +=', pyL ? 'range(10) gives 0-9, not 0-10' : 'Semicolon after for() creates empty loop body']
    },
    quiz: {
      mcqs: [
        { id: 'q1', question: 'How many times does `for i in range(5):` run?', options: ['4', '5', '6', 'Infinite'], answer: 1, explanation: 'range(5) produces 0, 1, 2, 3, 4 — five values.' },
        { id: 'q2', question: 'What is the main risk of while loops?', options: ['Slower than for', 'Infinite loops if condition never false', 'Cannot iterate collections', 'Use more memory'], answer: 1, explanation: 'If the condition never becomes false, a while loop runs forever.' },
        { id: 'q3', question: 'What does `break` do in a loop?', options: ['Skips current iteration', 'Exits the loop entirely', 'Restarts the loop', 'Pauses it'], answer: 1, explanation: 'break immediately exits the loop regardless of the condition.' },
        { id: 'q4', question: 'What does `continue` do?', options: ['Exits the loop', 'Skips to next iteration', 'Restarts from beginning', 'Stops all loops'], answer: 1, explanation: 'continue skips the rest of the current iteration and moves to the next.' },
        { id: 'q5', question: 'What happens iterating over an empty list?', options: ['Error', 'Body runs once', 'Body never runs', 'Infinite loop'], answer: 2, explanation: 'An empty iterable means the loop body never executes — no error.' }
      ],
      checkpoints: [
        { id: 'cp1', question: 'True or False: Modifying a list during iteration is safe.', answer: false, explanation: 'It can skip items, process duplicates, or crash.' },
        { id: 'cp2', question: 'True or False: Nested loops multiply total iterations.', answer: true, explanation: '100 × 100 × 100 = 1,000,000 — a potential bottleneck.' }
      ]
    },
    project: {
      title: 'Project: Data Analysis Toolkit',
      tagline: 'Build statistical analysis functions using loops.',
      description: 'Create functions for mean, median, mode, standard deviation, and filtering — all using loops.',
      requirements: ['Calculate mean with a sum loop', 'Calculate median with sort+index', 'Calculate mode with frequency dict', 'Filter values above threshold', 'Handle empty and single-element lists'],
      learningGoals: ['Master loop patterns', 'Process collections', 'Build reusable functions'],
      starterCode: pyL ? `def mean(data):\n    pass\n\ndef median(data):\n    pass\n\ndef mode(data):\n    pass\n\nnumbers = [2, 4, 6, 8, 10, 4, 6, 6]\nprint(mean(numbers), median(numbers), mode(numbers))` : `function mean(data) {}\nfunction median(data) {}\nfunction mode(data) {}\n\nconst numbers = [2, 4, 6, 8, 10, 4, 6, 6];\nconsole.log(mean(numbers), median(numbers), mode(numbers));`,
      solution: pyL ? `def mean(d): return sum(d)/len(d) if d else None\ndef median(d):\n    if not d: return None\n    s = sorted(d); m = len(s)//2\n    return s[m] if len(s)%2 else (s[m-1]+s[m])/2\ndef mode(d):\n    if not d: return None\n    f = {}; [f.update({x: f.get(x,0)+1}) for x in d]\n    mc = max(f.values())\n    return [k for k,v in f.items() if v==mc]` : `const mean = d => d.length ? d.reduce((a,b)=>a+b,0)/d.length : null;\nconst median = d => { if(!d.length) return null; const s=[...d].sort((a,b)=>a-b), m=Math.floor(s.length/2); return s.length%2 ? s[m] : (s[m-1]+s[m])/2; };\nconst mode = d => { if(!d.length) return null; const f={}; d.forEach(x=>f[x]=(f[x]||0)+1); const mc=Math.max(...Object.values(f)); return Object.keys(f).filter(k=>f[k]==mc).map(Number); };`,
      extensions: ['Add percentile', 'Weighted mean', 'Moving average', 'Chart visualization']
    },
    cheatsheet: {
      syntax: pyL ? `for item in coll:\n    process(item)\n\nfor i, val in enumerate(coll):\n    print(i, val)\n\nwhile cond:\n    do()\n    update()` : `for (let i=0; i<n; i++) { process(i); }\nfor (const item of coll) { process(item); }\nfor (const key in obj) { process(key); }\nwhile (cond) { do(); update(); }`,
      concepts: ['Iteration: one pass through loop body', 'Iterator: object that yields items one by one', 'Loop variable: changes each iteration'],
      patterns: ['Enumerate: for i, val in enumerate(arr)', 'Two pointers: while left < right', 'Reverse: for i in range(n-1, -1, -1)'],
      dosDonts: ['✓ Keep bodies short', '✓ Use break for early exit', '✓ Handle empty collections', '✗ Modify collection while iterating', '✗ Use while when for is clearer', '✗ Forget to update while condition']
    },
    interview: {
      questions: [
        { question: 'When would you use a for loop vs a while loop?', answer: 'For is best when you know the iteration count in advance (iterating an array, counting). While is for condition-based repetition (reading a file until EOF, waiting for a state change). Every for can be written as while, but not vice versa.', followUp: 'Can you write a for loop as a while loop?' },
        { question: 'What is an off-by-one error and how do you prevent it?', answer: 'A loop runs one too many or too few times. Causes: using <= instead of <, starting at 1 instead of 0. Prevent by using consistent conventions (start at 0, use <), testing boundaries (empty, single-element), and using for-of/enhanced loops that eliminate index management.', followUp: 'How do off-by-one errors affect binary search?' },
        { question: 'How do you iterate a very large dataset without memory issues?', answer: 'Use lazy iteration — generators/streams that yield one item at a time. In Python, generators with yield. In Node, streams or async iterators. For databases, cursor-based pagination. Never load the entire dataset into RAM.', followUp: 'How do you handle mid-iteration errors?' }
      ]
    },
    oneLineSummary: 'Loops automate repetition — they run code multiple times, either a fixed count (for) or while a condition holds (while).',
    summary: 'This lesson covered for and while loops, break/continue, nested loops, and best practices to avoid infinite loops and off-by-one errors.',
    keyTakeaways: ['Loops repeat based on a condition or collection', 'For = known count, While = condition-based', 'Break exits; Continue skips iteration', 'Off-by-one is the most common loop bug', 'Consider map/filter/reduce as alternatives'],
    memoryTricks: ['Think of for as "for each item" and while as "while this is true, keep going"'],
    preInterviewChecklist: ['Can you explain break vs continue?', 'Can you write nested loops for a multiplication table?', 'Can you fix off-by-one errors?'],
    commonErrors: ['Infinite loops', 'Off-by-one', 'Modifying collections during iteration', 'Nested loop performance'],
    mindMap: { central: 'Loops', branches: ['For', 'While', 'Nested', 'Break/Continue', 'Iterators', 'Functional Alternatives', 'Performance'] },
    nextTopics: ['Generators and lazy evaluation', 'Parallel iteration', 'Stream processing', 'Loop optimization']
  };
};

CONCEPTS.FUNCTIONS = function(title, moduleName, rmTitle, lang) {
  const pyL = py(lang);
  const isLambda = /lambda/i.test(title);

  return {
    title,
    curiosityQuestion: 'What if you could package a sequence of instructions into a reusable box, name it, and use it anywhere — like a mini-program inside your program?',
    whyExists: 'Functions are the fundamental unit of code organization. They let you define a reusable operation once, give it a name, and call it from anywhere. Without them, every program would be one massive, unreadable block of code.',
    problemItSolves: 'Without functions, you copy-paste the same logic everywhere. Changing that logic means finding and updating every copy — a maintenance nightmare. Functions give you a single place to define behavior and reuse it.',
    withoutVariables: 'Imagine a library where every book contains the full text of every other book it references — massive, redundant, impossible to maintain. Functions are the "call number" that lets you reference knowledge without repeating it.',
    whereUsed: 'Functions are the building blocks of every program. From simple helpers to complex APIs, every significant software system is composed of functions calling functions.',
    realWorldAnalogy: isLambda
      ? 'A lambda function is like a sticky note — a quick, disposable function for a single purpose. You write it, use it (often as an argument to another function), and move on.'
      : 'A function is like a vending machine. You press a button (call the function), it takes inputs (money/selection), performs a process, and returns a result (snack). The internal mechanism is hidden from you — you only need to know what input to give and what output to expect.',
    simpleExplanation: pyL
      ? 'A function is a named block of reusable code. Define it with "def", give it a name, add parameters (optional), write the body, and return a result. Call it by its name with arguments.'
      : 'A function is a reusable block of code. Define it with "function", give it a name, add parameters, write the body, and return a result. Call it by name with arguments.',
    syntaxExplanation: pyL
      ? `def function_name(param1, param2):\n    """Docstring explaining purpose"""\n    result = do_something(param1, param2)\n    return result\n\n# Call it\noutput = function_name(arg1, arg2)`
      : `function functionName(param1, param2) {\n  // Comment explaining purpose\n  const result = doSomething(param1, param2);\n  return result;\n}\n\n// Call it\nconst output = functionName(arg1, arg2);`,
    examples: [{ title: isLambda ? 'Lambda Function' : 'Function Definition and Call', code: pyL
      ? (isLambda
        ? `# Lambda: a one-line anonymous function\nsquare = lambda x: x ** 2\nprint(square(5))  # 25\n\n# Used directly in higher-order functions\nnumbers = [1, 2, 3, 4]\ndoubled = list(map(lambda x: x * 2, numbers))\nprint(doubled)  # [2, 4, 6, 8]`
        : `def greet(name):\n    return f"Hello, {name}! Welcome to ${rmTitle}."\n\nmessage = greet("Alice")\nprint(message)  # Hello, Alice! Welcome to Python.`)
      : (isLambda
        ? `// Arrow function (JavaScript's lambda)\nconst square = x => x ** 2;\nconsole.log(square(5));  // 25\n\n// Used in higher-order functions\nconst numbers = [1, 2, 3, 4];\nconst doubled = numbers.map(x => x * 2);\nconsole.log(doubled);  // [2, 4, 6, 8]`
        : `function greet(name) {\n  return \`Hello, \${name}! Welcome to ${rmTitle}.\`;\n}\n\nconst message = greet("Alice");\nconsole.log(message);  // Hello, Alice! Welcome to JavaScript.`),
      explanation: isLambda
        ? 'A lambda/arrow function is a concise, anonymous function defined in a single expression. It is most useful as a callback or when passed to higher-order functions like map/filter.'
        : 'The function encapsulates a specific behavior. It takes inputs (parameters), processes them, and returns a result. This makes the code reusable, testable, and understandable.',
      language: lang }],
    stepByStepExecution: [
      { step: 1, action: 'Define the function', explanation: 'Use def/function keyword, name it, list parameters in parentheses.' },
      { step: 2, action: 'Write the body', explanation: 'Indented block of code that performs the function\'s task.' },
      { step: 3, action: 'Return a value', explanation: isLambda ? 'Implicit return of the expression.' : 'Use return to send a result back to the caller.' },
      { step: 4, action: 'Call the function', explanation: 'Use the function name followed by parentheses with arguments.' },
      { step: 5, action: 'Use the result', explanation: 'Capture the return value in a variable or use it directly.' }
    ],
    commonMistakes: ['Forgetting to return a value (returns None/undefined)', 'Modifying global variables inside functions (side effects)', 'Using mutable default arguments in Python', 'Overcomplicating — a function should do one thing'],
    deeperExplanation: `Functions are first-class citizens in ${lang}. They can be assigned to variables, passed as arguments, returned from other functions, and stored in data structures. This enables powerful patterns: callbacks, closures, decorators, and higher-order functions.`,
    mutabilityExplained: 'Parameters are passed by assignment (Python) or by value (primitives) / reference (objects in JS). Mutable objects passed to a function can be modified inside, affecting the caller\'s copy.',
    noneValue: 'A function without an explicit return statement returns None (Python) or undefined (JS). Always ensure your function has a clear return path.',
    internalImplementation: `${cap(lang)} creates a new stack frame for each function call, storing parameters and local variables. When the function returns, the frame is popped. Recursive functions create multiple frames — too many cause stack overflow.`,
    intermediateExamples: [{ title: 'Function with Default Parameters', code: pyL
      ? `def power(base, exponent=2):\n    return base ** exponent\n\nprint(power(5))     # 25 (default exponent 2)\nprint(power(5, 3))  # 125 (exponent 3)`
      : `function power(base, exponent = 2) {\n  return base ** exponent;\n}\n\nconsole.log(power(5));    // 25\nconsole.log(power(5, 3)); // 125`, explanation: 'Default parameters make functions flexible — they work with fewer arguments by providing sensible defaults.', language: lang }],
    bestPractices: ['One function, one responsibility', 'Use descriptive names (verb + noun)', 'Keep functions short (under 20 lines)', 'Avoid side effects — prefer pure functions', 'Document with docstrings/comments', 'Return early for edge cases (guard clauses)'],
    debuggingWalkthrough: { scenario: 'A function returns the wrong value for certain inputs.', steps: ['Check return statements in all branches', 'Verify parameters are what you expect', 'Print intermediate values', 'Test with the simplest possible input', 'Check for unintended side effects'] },
    edgeCases: ['No arguments vs default parameters', 'Too many/few arguments (error)', 'Mutable default arguments (Python gotcha)', 'Recursive functions without base case (stack overflow)'],
    performanceNotes: { notes: 'Function calls have overhead (stack frame creation). For performance-critical code, inline or use lambda where appropriate. Modern engines optimize frequently-called functions (JIT).', bigO: { best: 'O(1)', average: 'O(1)', worst: 'O(1) — but the function body adds its own complexity' } },
    expertOverview: 'Expert-level function usage involves closures, decorators, currying, memoization, and designing function APIs that are intuitive and hard to misuse.',
    industryContext: 'Production systems use functions as the primary unit of abstraction. API design, middleware pipelines, and event handlers all rely on well-designed function interfaces.',
    expertExamples: [{ title: 'Decorator Pattern (Python) / HOF (JS)', code: pyL
      ? `def timer(func):\n    def wrapper(*args, **kwargs):\n        import time\n        start = time.time()\n        result = func(*args, **kwargs)\n        print(f"{func.__name__} took {time.time()-start:.3f}s")\n        return result\n    return wrapper\n\n@timer\ndef slow_function():\n    import time\n    time.sleep(1)\n    return "Done"\n\nslow_function()  # slow_function took 1.001s`
      : `function timer(fn) {\n  return function(...args) {\n    const start = Date.now();\n    const result = fn(...args);\n    console.log(\`\${fn.name} took \${Date.now() - start}ms\`);\n    return result;\n  };\n}\n\nconst slowFunction = timer(() => {\n  const start = Date.now();\n  while(Date.now() - start < 1000);\n  return "Done";\n});\n\nslowFunction();`, explanation: 'A decorator/HOF wraps a function to add behavior (logging, timing, auth) without modifying the original function. This is the Decorator pattern.', language: lang }],
    codeReviewChecklist: ['Does the function do one thing?', 'Is the name descriptive?', 'Are there side effects?', 'Are edge cases handled?', 'Is it testable?', 'Are parameters validated?'],
    testingPatterns: { unitTests: 'Test each function independently', integrationTests: 'Verify functions work together', propertyBasedTests: 'Test invariants across random inputs', benchmarkTests: 'Measure function performance' },
    refactoringGuide: { smell: 'Function is too long (50+ lines) or does too many things', solution: 'Extract each responsibility into its own function', steps: ['Identify distinct operations in the function', 'Extract each into a named function', 'Compose the original function from the new ones', 'Test the refactored version'] },
    securityConsiderations: ['Validate all function inputs', 'Avoid eval() with user input', 'Be careful with recursive functions (stack overflow DoS)', 'Do not expose sensitive data in error messages'],
    scalability: { considerations: 'Functions are naturally scalable — they encapsulate behavior. In distributed systems, functions map well to microservices and serverless (FaaS) architectures.', recommendations: ['Design stateless functions for horizontal scaling', 'Use pure functions where possible', 'Monitor function performance and error rates'] },
    complexityAnalysis: { timeComplexity: 'O(1) function call overhead; body complexity adds separately', spaceComplexity: 'O(1) per stack frame', notes: 'Deep recursion adds O(n) stack space' },
    practice: {
      easyTitle: 'Temperature Converter',
      easyDesc: 'Write a function that converts Celsius to Fahrenheit.',
      easyStarter: pyL ? `def celsius_to_fahrenheit(c):\n    pass\n\nprint(celsius_to_fahrenheit(0))\nprint(celsius_to_fahrenheit(100))` : `function celsiusToFahrenheit(c) {\n  \n}\n\nconsole.log(celsiusToFahrenheit(0));\nconsole.log(celsiusToFahrenheit(100));`,
      easySolution: pyL ? `def celsius_to_fahrenheit(c):\n    return (c * 9/5) + 32` : `function celsiusToFahrenheit(c) {\n  return (c * 9/5) + 32;\n}`,
      easyHints: ['Formula: multiply by 9/5, add 32', 'Test with freezing (0°C = 32°F) and boiling (100°C = 212°F)'],
      mediumTitle: 'String Utilities',
      mediumDesc: 'Write functions: reverse a string, check palindrome, count vowels.',
      mediumStarter: pyL ? `def reverse(s): pass\ndef is_palindrome(s): pass\ndef count_vowels(s): pass\n\nprint(reverse("hello"))\nprint(is_palindrome("racecar"))\nprint(count_vowels("hello"))` : `function reverse(s) {}\nfunction isPalindrome(s) {}\nfunction countVowels(s) {}\n\nconsole.log(reverse("hello"));\nconsole.log(isPalindrome("racecar"));\nconsole.log(countVowels("hello"));`,
      mediumSolution: pyL ? `def reverse(s): return s[::-1]\ndef is_palindrome(s): return s == s[::-1]\ndef count_vowels(s): return sum(1 for c in s.lower() if c in 'aeiou')` : `const reverse = s => s.split('').reverse().join('');\nconst isPalindrome = s => s === s.split('').reverse().join('');\nconst countVowels = s => (s.match(/[aeiou]/gi) || []).length;`,
      mediumHints: ['String slicing/array methods can help', 'A palindrome reads the same forward and backward'],
      hardTitle: 'Function Pipeline',
      hardDesc: 'Create a compose/pipeline function that chains multiple functions together, passing each result to the next.',
      hardStarter: pyL ? `def compose(*funcs):\n    pass\n\n# compose(f, g)(x) = f(g(x))\ndef double(x): return x * 2\ndef add_one(x): return x + 1\n\npipeline = compose(double, add_one)\nprint(pipeline(5))  # 12` : `function compose(...funcs) {\n  \n}\n\nconst double = x => x * 2;\nconst addOne = x => x + 1;\n\nconst pipeline = compose(double, addOne);\nconsole.log(pipeline(5));  // 12`,
      hardSolution: pyL ? `def compose(*funcs):\n    def composed(arg):\n        result = arg\n        for func in reversed(funcs):\n            result = func(result)\n        return result\n    return composed` : `function compose(...funcs) {\n  return arg => funcs.reduceRight((result, fn) => fn(result), arg);\n}`,
      hardHints: ['Functions execute from right to left in compose', 'Each function receives the previous result'],
      debugTitle: 'Debug the Function',
      debugBuggy: pyL ? `def add(x, y):\n    sum = x + y\ndef main():\n    result = add(3, 4)\n    print(result * 2)` : `function add(x, y) {\n  const sum = x + y;\n}\n\nfunction main() {\n  const result = add(3, 4);\n  console.log(result * 2);\n}`,
      debugFixed: pyL ? `def add(x, y):\n    return x + y\n\ndef main():\n    result = add(3, 4)\n    print(result * 2)  # 14` : `function add(x, y) {\n  return x + y;\n}\n\nfunction main() {\n  const result = add(3, 4);\n  console.log(result * 2);  // 14\n}`,
      debugBugs: ['Missing return statement — function returns None/undefined', 'Arithmetic on None/undefined causes NaN/TypeError']
    },
    quiz: {
      mcqs: [
        { id: 'q1', question: 'What does a function return if there is no return statement?', options: ['0', 'None/undefined', 'The last expression', 'Error'], answer: 1, explanation: 'Functions without return return None (Python) or undefined (JS).' },
        { id: 'q2', question: 'What is the term for variables defined inside a function?', options: ['Global', 'Local', 'Static', 'Dynamic'], answer: 1, explanation: 'Variables defined inside a function are local to that function and cannot be accessed outside it.' },
        { id: 'q3', question: 'What is a pure function?', options: ['One that uses global variables', 'Same input always gives same output, no side effects', 'A function with no parameters', 'Any function defined in a library'], answer: 1, explanation: 'Pure functions are deterministic and have no side effects — they do not modify external state.' },
        { id: 'q4', question: 'What happens when a function calls itself?', options: ['Infinite loop', 'Recursion', 'Stack overflow immediately', 'Memory leak'], answer: 1, explanation: 'A function calling itself is recursion. It needs a base case to stop; otherwise it causes stack overflow.' },
        { id: 'q5', question: 'Why use functions?', options: ['They make code run faster', 'Reusability, organization, testability', 'They use less memory', 'They are required by the compiler'], answer: 1, explanation: 'Functions provide reusability, organization, and testability — the three pillars of maintainable code.' }
      ],
      checkpoints: [
        { id: 'cp1', question: 'True or False: A function can only return one value.', answer: false, explanation: 'In Python, return a tuple to effectively return multiple values. In JS, return an object/array.' },
        { id: 'cp2', question: 'True or False: Functions are first-class citizens in Python and JavaScript.', answer: true, explanation: 'Functions can be assigned to variables, passed as arguments, and returned from other functions.' }
      ]
    },
    project: {
      title: 'Project: Function Library Toolkit',
      tagline: 'Build a collection of reusable utility functions.',
      description: 'Create a library of utility functions: array operations, string helpers, math utilities, and a compose function — all following best practices.',
      requirements: ['Implement 10+ utility functions', 'Each function does one thing', 'Include docstrings/comments', 'Handle edge cases', 'Export as a module'],
      learningGoals: ['Master function design', 'Practice pure functions', 'Build a reusable module'],
      starterCode: pyL ? `# utils.py - Utility Function Library\n\ndef clamp(value, low, high):\n    \"\"\"Clamp value between low and high.\"\"\"\n    pass\n\ndef chunk(arr, size):\n    \"\"\"Split array into chunks of given size.\"\"\"\n    pass\n\ndef unique(arr):\n    \"\"\"Remove duplicates from array.\"\"\"\n    pass\n\n# Add 7 more functions...` : `// utils.js - Utility Function Library\n\nfunction clamp(value, low, high) {\n  // Clamp value between low and high\n}\n\nfunction chunk(arr, size) {\n  // Split array into chunks\n}\n\nfunction unique(arr) {\n  // Remove duplicates\n}\n\n// Add 7 more functions...`,
      extensions: ['Add TypeScript type annotations', 'Write unit tests', 'Publish as a package']
    },
    cheatsheet: {
      syntax: pyL ? `def name(params):\n    \"\"\"docstring\"\"\"\n    body\n    return value\n\n# Lambda\nf = lambda x: x ** 2` : `function name(params) {\n  // comment\n  body;\n  return value;\n}\n\n// Arrow\nconst f = x => x ** 2;`,
      concepts: ['Parameter: input variable in definition', 'Argument: actual value passed when calling', 'Return: output value sent back', 'Scope: where a variable is accessible'],
      patterns: ['Guard clause: return early for edge cases', 'Default parameters: sensible defaults', '*args/**kwargs (Python) or ...rest (JS): variable arguments'],
      dosDonts: ['✓ One function, one job', '✓ Pure functions when possible', '✓ Descriptive names', '✗ Side effects without clear naming', '✗ Long functions (50+ lines)', '✗ Modifying input parameters']
    },
    interview: {
      questions: [
        { question: 'What is the difference between a parameter and an argument?', answer: 'Parameters are the variables listed in the function definition (the placeholders). Arguments are the actual values passed to the function when calling it. Parameters receive the argument values.', followUp: 'How do default parameters work?' },
        { question: 'Explain closures and give a practical example.', answer: 'A closure is a function that remembers the variables from its outer scope even after the outer function has returned. Practical: create a counter that increments each call, or a function factory that generates customized functions with preset configuration.', followUp: 'How do closures interact with loops in JavaScript?' },
        { question: 'What is recursion and when would you use it?', answer: 'Recursion is when a function calls itself. Use it for problems with a recursive structure: tree traversal, directory walking, divide-and-conquer algorithms (quicksort, merge sort). Always need a base case to stop.', followUp: 'What are the tradeoffs of recursion vs iteration?' }
      ]
    },
    oneLineSummary: 'Functions are reusable, named blocks of code that take inputs, process them, and return outputs — the fundamental unit of program organization.',
    summary: 'This lesson covered function definition, parameters, return values, scope, lambda/arrow functions, recursion, and best practices for writing clean, testable functions.',
    keyTakeaways: ['Functions encapsulate reusable logic', 'Parameters receive inputs; return sends output', 'Local variables are scoped to the function', 'Pure functions are easier to test and debug', 'Functions are first-class citizens'],
    memoryTricks: ['Think of a function as a vending machine: input (money/selection) -> process -> output (snack)'],
    preInterviewChecklist: ['Can you explain the difference between parameters and arguments?', 'Can you write a recursive function?', 'Do you understand closures?'],
    commonErrors: ['Missing return', 'Modifying global/input state', 'Using mutable default arguments', 'Stack overflow from infinite recursion'],
    mindMap: { central: 'Functions', branches: ['Definition', 'Parameters', 'Return', 'Scope', 'Recursion', 'Lambda', 'Higher-Order', 'Closures'] },
    nextTopics: ['Closures and decorators', 'Function composition', 'Monads and functional programming', 'Concurrency with async functions']
  };
};

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function getConceptData(conceptType, title, moduleName, rmTitle, lang) {
  const gen = CONCEPTS[conceptType];
  if (gen) return gen(title, moduleName, rmTitle, lang);
  return getGenericData(title, moduleName, rmTitle, lang);
}

function getGenericData(title, moduleName, rmTitle, lang) {
  return {
    title,
    curiosityQuestion: `Have you ever wondered how programmers approach ${title.toLowerCase()} effectively?`,
    whyExists: `${title} is a fundamental concept that exists because programmers needed a standardized way to handle a common programming task.`,
    problemItSolves: `Before ${title} became standard, developers wrote custom solutions for every project. ${title} provides a proven approach that works across projects.`,
    withoutVariables: `Without ${title}, developers would need to invent custom solutions repeatedly, leading to inconsistent and error-prone code.`,
    whereUsed: `${title} is used throughout ${rmTitle} — from simple scripts to enterprise applications.`,
    realWorldAnalogy: `Learning ${title} is like learning a new tool. At first it seems unfamiliar, but with practice it becomes an essential part of your toolkit.`,
    simpleExplanation: `${title} is a technique in ${rmTitle} that helps you accomplish a specific programming task. It follows a clear pattern with setup, operation, and result.`,
    syntaxExplanation: py(lang)
      ? `# ${title} pattern in Python\nresult = perform_operation(input_data)\nprint(result)`
      : `// ${title} pattern\nconst result = performOperation(inputData);\nconsole.log(result);`,
    examples: [{ title: `Getting Started with ${title}`, code: py(lang) ? `print("Learning ${title}")` : `console.log("Learning ${title}");`, explanation: `Basic introduction to ${title}.`, language: lang }],
    stepByStepExecution: [
      { step: 1, action: 'Understand the problem', explanation: 'Identify what needs to be accomplished.' },
      { step: 2, action: 'Choose the approach', explanation: `${title} provides the pattern to follow.` },
      { step: 3, action: 'Implement', explanation: 'Write code following the pattern.' },
      { step: 4, action: 'Test', explanation: 'Verify with normal cases and edge cases.' }
    ],
    commonMistakes: ['Jumping into implementation without understanding the concept', 'Not handling edge cases', 'Overcomplicating the solution'],
    deeperExplanation: `${title} becomes more powerful when combined with other ${rmTitle} concepts. In production, it interacts with error handling, validation, and optimization.`,
    bestPractices: ['Validate inputs', 'Handle edge cases', 'Write tests', 'Document behavior'],
    debuggingWalkthrough: { scenario: `A ${title.toLowerCase()} implementation behaves unexpectedly.`, steps: ['Reproduce with minimal test', 'Check inputs', 'Verify logic', 'Test boundaries'] },
    edgeCases: ['Empty input', 'Null values', 'Large datasets', 'Unexpected types'],
    performanceNotes: { notes: 'Performance varies by implementation. Profile to find bottlenecks.', bigO: { best: 'O(1)', average: 'O(n)', worst: 'O(n^2)' } },
    expertOverview: `At the expert level, ${title} involves tradeoffs between approaches, optimization for specific use cases, and design for maintainability.`,
    industryContext: `In production ${rmTitle} systems, this is implemented with attention to performance and security.`,
    codeReviewChecklist: ['Handles all errors?', 'Readable and maintainable?', 'Performance concerns?', 'Appropriate scale?'],
    testingPatterns: { unitTests: 'Test components in isolation', integrationTests: 'Test with dependencies', propertyBasedTests: 'Test with random inputs', benchmarkTests: 'Measure performance' },
    refactoringGuide: { smell: 'Implementation too complex or coupled', solution: 'Break into smaller functions', steps: ['Identify responsibilities', 'Separate concerns', 'Extract reusable parts', 'Verify'] },
    securityConsiderations: ['Validate inputs', 'Avoid exposing internal state', 'Log appropriately'],
    scalability: { considerations: 'Design for statelessness for horizontal scaling.', recommendations: ['Cache results', 'Use connection pooling', 'Monitor metrics'] },
    complexityAnalysis: { timeComplexity: 'Varies', spaceComplexity: 'Varies', notes: 'Analyze specific implementation for accurate complexity' },
    practice: {
      easyTitle: `${title} — Basic Practice`,
      easyDesc: `Write a basic ${title.toLowerCase()} implementation.`,
      easyStarter: py(lang) ? `def basic_${title.replace(/[^a-zA-Z]/g, '_').toLowerCase()}():\n    pass` : `function basic${title.replace(/[^a-zA-Z]/g, '')}() {\n  \n}`,
      easySolution: py(lang) ? `def basic():\n    return "done"` : `function basic() {\n  return "done";\n}`,
      easyHints: ['Start simple', 'Test with sample inputs'],
      mediumTitle: `${title} — Intermediate`,
      mediumDesc: `Extend your implementation with error handling.`,
      mediumStarter: py(lang) ? `def improved():\n    pass` : `function improved() {\n  \n}`,
      mediumSolution: py(lang) ? `def improved():\n    try:\n        return "done"\n    except Exception as e:\n        return f"Error: {e}"` : `function improved() {\n  try { return "done"; } catch(e) { return "Error: " + e; }\n}`,
      mediumHints: ['Consider edge cases', 'Add proper error handling'],
      debugBuggy: py(lang) ? `def broken(x):\n    result = x / 0  # bug\n    return result` : `function broken(x) {\n  return x / 0;  // bug\n}`,
      debugFixed: py(lang) ? `def fixed(x):\n    if x == 0: return 0\n    return x / 1` : `function fixed(x) {\n  if (x === 0) return 0;\n  return x / 1;\n}`,
      debugBugs: ['Division by zero', 'No error handling']
    },
    quiz: {
      mcqs: [
        { id: 'q1', question: `What is ${title}?`, options: ['A programming concept', 'A hardware device', 'A network protocol', 'A database system'], answer: 0, explanation: `${title} is a programming concept.` },
        { id: 'q2', question: `Why does ${title} exist?`, options: ['To solve a specific problem', 'To make code slower', 'For decorative purposes', 'To replace hardware'], answer: 0, explanation: 'It solves a specific programming problem.' },
        { id: 'q3', question: 'What is a common beginner mistake?', options: ['Reading docs', 'Ignoring edge cases', 'Writing comments', 'Testing code'], answer: 1, explanation: 'Beginners often ignore edge cases.' }
      ],
      checkpoints: [
        { id: 'cp1', question: `True or False: ${title} is only for experts.`, answer: false, explanation: 'It is relevant at all skill levels.' },
        { id: 'cp2', question: `True or False: Understanding ${title} improves code quality.`, answer: true, explanation: 'Mastery leads to better code.' }
      ]
    },
    project: {
      title: `Project: ${title} Application`,
      tagline: `Apply ${title.toLowerCase()} in a practical project.`,
      description: `Build an application demonstrating ${title}.`,
      requirements: ['Implement core functionality', 'Handle errors', 'Write tests', 'Document the solution'],
      learningGoals: ['Apply the concept practically', 'Build a portfolio project'],
      extensions: ['Add features', 'Optimize', 'Build a UI']
    },
    cheatsheet: {
      syntax: py(lang) ? `# ${title}\n# See lesson examples` : `// ${title}\n// See lesson examples`,
      concepts: ['Concept overview', 'Basic usage', 'Advanced patterns'],
      patterns: ['Basic pattern', 'Error handling pattern', 'Optimization pattern'],
      dosDonts: ['✓ Learn the concept', '✓ Test edge cases', '✓ Follow idioms', '✗ Copy blindly', '✗ Skip error handling']
    },
    interview: {
      questions: [
        { question: `Explain ${title} to a junior developer.`, answer: `Start with the problem it solves, show a simple example, explain core concepts, and discuss common mistakes.`, followUp: 'What mistakes do developers make with this?' },
        { question: `Performance implications of ${title.toLowerCase()}?`, answer: 'Consider time/space complexity, memory usage, and optimization strategies.', followUp: 'How would you benchmark it?' },
        { question: `Real-world scenario for ${title.toLowerCase()}?`, answer: `Use ${title} when you encounter the programming problem it addresses.`, followUp: 'What alternatives exist?' }
      ]
    },
    oneLineSummary: `${title} is a fundamental programming concept every developer should understand.`,
    summary: `This lesson covered what ${title} is, why it exists, how to use it, common mistakes, and best practices.`,
    keyTakeaways: [`${title} solves a specific programming problem`, 'Handle edge cases', 'Follow language idioms', 'Test thoroughly'],
    memoryTricks: [`Think of ${title.toLowerCase()} as a tool in your toolbox`],
    preInterviewChecklist: [`Can you explain ${title} in one sentence?`, 'Can you write a basic implementation?', 'Do you know the pitfalls?'],
    commonErrors: ['Not understanding the problem', 'Overcomplicating', 'Ignoring edge cases', 'Skipping tests'],
    mindMap: { central: title, branches: ['Definition', 'Usage', 'Advanced', 'Pitfalls', 'Best Practices'] },
    nextTopics: [`Advanced ${title.toLowerCase()}`, `Testing ${title.toLowerCase()}`, `Performance optimization`]
  };
}

module.exports = { getConceptData, CONCEPTS };
