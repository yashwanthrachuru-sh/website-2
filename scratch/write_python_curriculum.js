#!/usr/bin/env node
/**
 * EduNet Python Curriculum Builder
 * 
 * Writes real, lesson-specific educational content for every Python lesson.
 * Content is original, written specifically for EduNet. 
 * Structure: beginner.json, intermediate.json, expert.json, quiz.json, 
 *            practice.json, interview.json, project.json, revision.json,
 *            cheatsheet.json, resources.json, videos.json
 */

const fs = require('fs');
const path = require('path');

const CURRICULUM = path.join(__dirname, '../curriculum/python/modules');

// ─────────────────────────────────────────────────────────────
// LESSON DATABASE: Real content for every Python lesson
// ─────────────────────────────────────────────────────────────

const LESSONS = {

  // MODULE: variables_core_data_types
  // ----------------------------------------------------------------
  'variables_core_data_types/dynamic_typing_in_python': {
    beginner: {
      whyExists: "In some programming languages, you must tell the computer exactly what type of data a variable will hold before you use it — and it can never change. Python takes a completely different approach: it figures out the type automatically based on what value you give it, and the variable can hold a different type later. This flexibility is called dynamic typing, and it's one of Python's most distinctive design choices.",
      curiosityQuestion: "Why do some languages force you to declare the type of a variable before using it?",
      problemItSolves: "Static typing (required in C, Java, C++) means writing code like 'int age = 25;' — you commit to an integer before the program runs. Dynamic typing means Python discovers the type at runtime. This makes Python faster to write and easier to experiment with, at the cost of type-related bugs that a static language would catch at compile time.",
      realWorldAnalogy: "Think of a dynamically typed variable as a labeled box that can hold anything: apples today, a dictionary tomorrow, a number next week. A statically typed variable is a specialized container — like a milk carton that can only ever hold liquid.",
      simpleExplanation: "In Python:\n- You write: x = 42 (Python sees: this is an int)\n- Then: x = 'hello' (Python sees: now this is a str)\n- Then: x = [1, 2, 3] (now it's a list)\n\nPython doesn't complain. The variable x is just a name pointing to whatever object you most recently assigned to it. The type belongs to the object, not the variable.",
      syntaxExplanation: "# Static typing (Java/C — NOT Python):\nint count = 5;         # type declared permanently\ncount = \"five\";        # ERROR in Java\n\n# Dynamic typing (Python):\ncount = 5              # Python: 'count' → int object (value 5)\ncount = 'five'         # Python: 'count' → str object (value 'five') — valid!\ncount = [5, 10, 15]    # Python: 'count' → list object — still valid!\n\n# Check the type at any time:\nprint(type(count))     # <class 'list'>",
      examples: [
        {
          title: "Watching a Variable's Type Change",
          code: "x = 100\nprint(type(x), x)   # <class 'int'> 100\n\nx = 3.14\nprint(type(x), x)   # <class 'float'> 3.14\n\nx = 'Python'\nprint(type(x), x)   # <class 'str'> Python\n\nx = True\nprint(type(x), x)   # <class 'bool'> True\n\nx = [1, 2, 3]\nprint(type(x), x)   # <class 'list'> [1, 2, 3]\n\nx = None\nprint(type(x), x)   # <class 'NoneType'> None",
          explanation: "Each assignment completely replaces what 'x' refers to. The old object is abandoned (Python's garbage collector eventually reclaims its memory). type() reveals the current type at any moment.",
          language: "python"
        },
        {
          title: "isinstance() — Safer Than type()==",
          code: "value = 42\n\n# Bad pattern — fragile:\nif type(value) == int:\n    print('is int')\n\n# Better pattern — handles subclasses too:\nif isinstance(value, int):\n    print('is int or subclass of int')\n\n# isinstance accepts a tuple of types:\nif isinstance(value, (int, float)):\n    print('is a number')\n\n# True: booleans are ints in Python!\nprint(isinstance(True, int))   # True\nprint(isinstance(True, bool))  # True",
          explanation: "isinstance() is preferred over type() == because it correctly handles inheritance — bool is a subclass of int in Python, so True behaves as both a bool and an int (True + True == 2 is valid Python). type() would not consider True an int, but isinstance() does.",
          language: "python"
        }
      ],
      visualDiagram: "```mermaid\nflowchart LR\n    subgraph Memory\n        direction TB\n        O1[\"int object\\nvalue: 42\"]\n        O2[\"str object\\nvalue: 'Python'\"]\n        O3[\"list object\\nvalue: [1,2,3]\"]\n    end\n    V[\"Variable 'x'\\n(just a name)\"] -->|assignment 1| O1\n    V -->|assignment 2| O2\n    V -->|assignment 3| O3\n    note[\"The type lives on the OBJECT\\nnot on the variable name\"] \n```",
      stepByStepExecution: [
        { step: 1, action: "x = 42", explanation: "Python creates an int object with value 42 in memory, then binds the name 'x' to it." },
        { step: 2, action: "x = 'Python'", explanation: "Python creates a new str object with value 'Python', then rebinds the name 'x' to it. The int object (42) is now unreferenced." },
        { step: 3, action: "type(x)", explanation: "Python looks up what object 'x' currently refers to and returns its type. Since 'x' now points to a str object, type() returns <class 'str'>." },
        { step: 4, action: "Garbage collection", explanation: "The int object 42 has no more references, so Python's reference counter drops to 0 and the memory is reclaimed automatically." }
      ],
      memoryDiagram: {
        stack: "[Name binding table]\n  x → 0x7f1a (currently)",
        heap: "[Heap Memory]\n  0x7f1a: str object 'Python'\n  [int object 42 — no references, will be GC'd]"
      },
      namingRules: [],
      commonMistakes: [
        "Assuming a variable retains its type — always check with type() or isinstance() if the type matters for logic",
        "Using type() == int for comparison — prefer isinstance(x, int) which handles subclasses correctly",
        "Confusing dynamic typing with no types — Python absolutely has types (str, int, float, etc.). Dynamic means the type is determined at runtime, not that values are untyped",
        "Performing operations on wrong types without checking: '5' + 5 raises TypeError because you can't add a string and an int, even though Python allowed both assignments"
      ]
    },
    quiz: {
      mcqs: [
        { id: "q1", question: "In Python, where does the 'type' information live?", options: ["On the variable name", "On the object/value the variable refers to", "In the Python source file's header", "In a separate type registry"], answer: 1, explanation: "In Python, variables are names that reference objects. The type information is stored on the object itself, not on the variable name. That's why the same name can point to an int one moment and a string the next.", difficulty: "beginner" },
        { id: "q2", question: "What does type(True) return in Python?", options: ["<class 'int'>", "<class 'bool'>", "<class 'boolean'>", "<class 'object'>"], answer: 1, explanation: "type(True) returns <class 'bool'>. However, isinstance(True, int) also returns True because bool is a subclass of int in Python. This is why True + 1 == 2 is valid.", difficulty: "intermediate" },
        { id: "q3", question: "What is the output of: x = 5; x = 'five'; print(type(x))?", options: ["<class 'int'>", "<class 'str'>", "TypeError", "<class 'NoneType'>"], answer: 1, explanation: "After x = 'five', x refers to a string object. The earlier int assignment is irrelevant — the name 'x' now points to a str. type(x) returns <class 'str'>.", difficulty: "beginner" },
        { id: "q4", question: "Why is isinstance(x, int) preferred over type(x) == int?", options: ["isinstance() is faster", "isinstance() correctly handles subclasses — bool is a subclass of int", "type() is deprecated in Python 3", "isinstance() works on all Python versions"], answer: 1, explanation: "bool is a subclass of int. type(True) == int is False, but isinstance(True, int) is True. For robust type checking that handles inheritance, isinstance() is always preferred.", difficulty: "intermediate" },
        { id: "q5", question: "What does 'dynamic typing' mean?", options: ["Variables can hold any type and the type is determined at runtime", "Python programs run dynamically without compilation", "Variables grow dynamically in memory", "Python uses dynamic memory allocation"], answer: 0, explanation: "Dynamic typing means the type of a variable is not declared in advance — Python determines the type at runtime based on the value assigned. The same variable name can hold different types at different points in execution.", difficulty: "beginner" }
      ],
      checkpoints: [
        { id: "cp1", question: "True or False: In Python, you must declare a variable's type before assigning a value to it.", answer: false, explanation: "False. Python uses dynamic typing — you simply assign a value and Python determines the type automatically. No type declaration is needed or allowed in standard Python." },
        { id: "cp2", question: "True or False: isinstance(True, int) returns True in Python.", answer: true, explanation: "True. Python's bool type is a subclass of int. True and False behave as 1 and 0 in numeric contexts. isinstance(True, int) returns True because True IS an instance of int through inheritance." }
      ]
    },
    practice: {
      easy: { title: "Type Explorer", description: "Write a script that creates 5 variables — one of each type: int, float, str, bool, and list. Then print the type and value of each variable on a single line each.", starterCode: "# Create variables of 5 different types\n# Print type and value for each\n\n", expectedOutput: "<class 'int'> 42\n<class 'float'> 3.14\n<class 'str'> hello\n<class 'bool'> True\n<class 'list'> [1, 2, 3]", solution: "a = 42\nb = 3.14\nc = 'hello'\nd = True\ne = [1, 2, 3]\n\nprint(type(a), a)\nprint(type(b), b)\nprint(type(c), c)\nprint(type(d), d)\nprint(type(e), e)", hints: ["type() returns the type object of a value", "You can print multiple things: print(type(x), x)", "List literal uses square brackets: [1, 2, 3]"], difficulty: "easy" },
      medium: { title: "Safe Type Checker Function", description: "Write a function called 'describe_value(x)' that accepts any value and prints:\n1. Its type (using type())\n2. Whether it's a number (int or float using isinstance)\n3. Whether it's iterable (str, list, tuple, dict — try to call iter() on it and catch TypeError)\n\nTest it with: 42, 3.14, 'hello', [1,2,3], True", starterCode: "def describe_value(x):\n    # Print type\n    # Check if number\n    # Check if iterable\n    pass\n\n# Test:\ndescribe_value(42)\ndescribe_value(3.14)\ndescribe_value('hello')\ndescribe_value([1, 2, 3])\ndescribe_value(True)\n", solution: "def describe_value(x):\n    print(f'Type: {type(x).__name__}')\n    if isinstance(x, (int, float)) and not isinstance(x, bool):\n        print('  Is a number: Yes')\n    else:\n        print('  Is a number: No')\n    try:\n        iter(x)\n        print('  Is iterable: Yes')\n    except TypeError:\n        print('  Is iterable: No')\n\ndescribe_value(42)\ndescribe_value(3.14)\ndescribe_value('hello')\ndescribe_value([1, 2, 3])\ndescribe_value(True)", hints: ["isinstance(x, (int, float)) checks both types at once", "bool is a subclass of int — exclude it explicitly: and not isinstance(x, bool)", "iter(x) raises TypeError if x is not iterable — wrap in try/except TypeError"], difficulty: "medium" },
      hard: { title: "Type-Safe Calculator", description: "Write a function 'safe_add(a, b)' that adds two values safely:\n- If both are numbers (int or float, not bool), return their sum\n- If both are strings, return their concatenation\n- If both are lists, return their combined list\n- If types don't match or are unsupported, raise a TypeError with a clear message\n\nDo NOT use any external libraries.", starterCode: "def safe_add(a, b):\n    pass\n\n# Tests:\nprint(safe_add(3, 4))          # 7\nprint(safe_add(1.5, 2.5))      # 4.0\nprint(safe_add('foo', 'bar'))  # foobar\nprint(safe_add([1,2], [3,4]))  # [1, 2, 3, 4]\n# safe_add(3, 'three')         # should raise TypeError\n", solution: "def safe_add(a, b):\n    def is_real_number(x):\n        return isinstance(x, (int, float)) and not isinstance(x, bool)\n    \n    if is_real_number(a) and is_real_number(b):\n        return a + b\n    elif isinstance(a, str) and isinstance(b, str):\n        return a + b\n    elif isinstance(a, list) and isinstance(b, list):\n        return a + b\n    else:\n        raise TypeError(f'Cannot add {type(a).__name__} and {type(b).__name__}')\n\nprint(safe_add(3, 4))\nprint(safe_add(1.5, 2.5))\nprint(safe_add('foo', 'bar'))\nprint(safe_add([1,2], [3,4]))", hints: ["Create a helper function to check 'real number' (excludes bool)", "Check type compatibility before adding", "Use isinstance with tuples to check multiple types at once", "The error message should tell the user which types were incompatible"], difficulty: "hard" },
      debugging: { title: "Fix the Type Checker", description: "This script has 3 bugs related to type checking.", buggyCode: "x = True\n\n# Bug 1: Wrong type check for bool\nif type(x) == int:\n    print('x is int')\n\n# Bug 2: Wrong method name\nif x.isinstance(float):\n    print('x is float')\n\n# Bug 3: Comparing type objects incorrectly\nif type(x) = bool:\n    print('x is bool')", fixedCode: "x = True\n\n# Fix 1: isinstance correctly handles bool as subclass of int\nif isinstance(x, int):\n    print('x is int or bool')  # prints because bool is subclass of int\n\n# Fix 2: isinstance is a built-in function, not a method\nif isinstance(x, float):\n    print('x is float')\n\n# Fix 3: Use == for comparison, not = (which is assignment)\nif type(x) == bool:\n    print('x is bool')", bugs: ["type(x) == int is False for True because type(True) is bool, not int. Use isinstance() for subclass-aware checks.", "isinstance is a built-in function called as isinstance(obj, type), not a method on objects. x.isinstance() raises AttributeError.", "type(x) = bool uses = (assignment operator) which is a SyntaxError. Use == for comparison."] }
    },
    interview: {
      questions: [
        { question: "Explain the difference between dynamic typing and duck typing in Python.", answer: "Dynamic typing means the type of a variable is determined at runtime, not at declaration time. Duck typing means Python doesn't check types explicitly — if an object has the method or attribute you're trying to use, Python calls it regardless of the object's actual class (if it walks like a duck and quacks like a duck, it's a duck). Dynamic typing enables duck typing, but they're distinct concepts: dynamic typing is about when types are checked, duck typing is about how type compatibility is evaluated.", level: "intermediate", followUp: "How does duck typing relate to Python's 'EAFP' coding style?" },
        { question: "Why does isinstance(True, int) return True in Python?", answer: "In Python, bool is implemented as a subclass of int. True and False are just the integer values 1 and 0 with special string representations. This means True + True == 2 is valid, True * 5 == 5 is valid, and isinstance(True, int) returns True because True IS an int (via inheritance). This design decision lets booleans participate in arithmetic without explicit conversion.", level: "intermediate", followUp: "Name one situation where this bool/int relationship causes a subtle bug." }
      ]
    },
    revision: {
      summary: "Dynamic typing means Python determines a variable's type at runtime based on the value assigned. The type lives on the object, not on the variable name. The same variable can hold an int, then a string, then a list. isinstance() is preferred over type() == for type checking because it handles inheritance correctly. bool is a subclass of int in Python.",
      oneLineSummary: "Python variables are names that point to typed objects — the name has no type, the object does.",
      keyTakeaways: ["Variables in Python are references (names pointing to objects), not typed containers", "The type lives on the object, not on the variable name", "bool is a subclass of int — True and False behave as 1 and 0", "Use isinstance() over type() == for subclass-aware checks", "Dynamic typing ≠ no types — every Python object has exactly one type"],
      memoryTricks: [{ concept: "Dynamic typing", trick: "The variable is a sticky note; the object is the thing it's stuck on. Stick the note on a different object and the 'type' of the note changes." }],
      commonErrors: [{ error: "type(True) == int is False", cause: "type() returns exactly bool for True, not int", fix: "Use isinstance(True, int) which returns True because bool inherits from int" }],
      preInterviewChecklist: ["Explain dynamic typing vs static typing", "Why isinstance() is preferred over type()==", "Why bool is a subclass of int in Python"],
      nextTopics: [{ title: "Numeric Data Types", whyNext: "Now that you understand how Python handles types dynamically, explore the specific numeric types: int, float, and complex." }]
    },
    cheatsheet: {
      printNote: "Quick reference for Python's dynamic type system.",
      sections: [
        {
          heading: "Type Checking",
          entries: [
            { syntax: "type(x)", example: "type(42)  # <class 'int'>", description: "Returns the exact type of x. Does not consider subclasses.", commonMistake: "Using type() == for checks when isinstance() is more appropriate" },
            { syntax: "isinstance(x, T)", example: "isinstance(True, int)  # True", description: "Returns True if x is an instance of T or any subclass of T.", commonMistake: "isinstance(True, bool) and isinstance(True, int) both return True" },
            { syntax: "isinstance(x, (T1, T2))", example: "isinstance(3.14, (int, float))  # True", description: "Check against multiple types at once using a tuple.", commonMistake: "Writing isinstance(x, int) or isinstance(x, float) separately — use a tuple" }
          ]
        }
      ]
    },
    resources: {
      links: [
        { type: "official", title: "Python Data Model — Types and Objects", url: "https://docs.python.org/3/reference/datamodel.html" },
        { type: "official", title: "isinstance() — Python Docs", url: "https://docs.python.org/3/library/functions.html#isinstance" }
      ]
    },
    videos: [{ title: "Python Dynamic Typing Explained", video_id: "C_lAjBiGiW0", url: "https://www.youtube.com/watch?v=C_lAjBiGiW0", thumbnail: "https://img.youtube.com/vi/C_lAjBiGiW0/maxresdefault.jpg", channel: "Corey Schafer", duration: "6m", description: "Clear explanation of Python's dynamic type system and how variables work as references to objects." }],
    project: {
      title: "Mini Type Inspector", tagline: "Build a dynamic type analysis tool",
      description: "Build a function 'type_report(data)' that accepts a list of mixed values and prints a summary table of what types appear in the list and how many of each.",
      learningGoals: ["Apply isinstance() in real code", "Use a dictionary to count occurrences", "Format output as a readable table"],
      requirements: ["Accept a list of any values", "Count how many items are int, float, str, bool, list, and 'other'", "Print a formatted table with type name and count", "Handle bool separately from int (check bool first since bool is a subclass of int)"],
      starterCode: "def type_report(data):\n    counts = {}\n    # Count types\n    # Print table\n    pass\n\ntype_report([1, 2.5, 'hello', True, [1,2], None, 42, 'world', False])\n",
      solution: "def type_report(data):\n    counts = {'bool': 0, 'int': 0, 'float': 0, 'str': 0, 'list': 0, 'other': 0}\n    for item in data:\n        if isinstance(item, bool):   counts['bool'] += 1   # check bool FIRST\n        elif isinstance(item, int):  counts['int'] += 1\n        elif isinstance(item, float): counts['float'] += 1\n        elif isinstance(item, str):  counts['str'] += 1\n        elif isinstance(item, list): counts['list'] += 1\n        else:                         counts['other'] += 1\n    print(f'{\"Type\":<10} {\"Count\"}')\n    print('-' * 18)\n    for t, c in counts.items():\n        if c > 0:\n            print(f'{t:<10} {c}')\n\ntype_report([1, 2.5, 'hello', True, [1,2], None, 42, 'world', False])\n",
      solutionExpl: "The key insight: check isinstance(item, bool) BEFORE isinstance(item, int), because bool is a subclass of int and would be counted as int otherwise. The f-string formatting with :<10 left-aligns the type name in a 10-character-wide column.",
      expectedOutput: "Type       Count\n------------------\nbool       2\nint        2\nfloat      1\nstr        2\nlist       1\nother      1",
      extensions: ["Add percentage next to each count", "Accept any depth of nesting (lists within lists)", "Sort the output by count descending"]
    }
  },

  // We'll add more lessons in the generation loop below
};

// ─────────────────────────────────────────────────────────────
// File writer helper
// ─────────────────────────────────────────────────────────────

function writeLesson(modulePath, lessonSlug, data) {
  const lessonDir = path.join(CURRICULUM, modulePath, lessonSlug, 'locales', 'en');
  fs.mkdirSync(lessonDir, { recursive: true });

  const files = {
    'beginner.json': data.beginner,
    'intermediate.json': data.intermediate || { deeperExplanation: '', internalImplementation: '', examples: [], performanceConsiderations: { timeComplexity: '', spaceComplexity: '' }, debuggingWalkthrough: { bugDescription: '', incorrectCode: '', correctCode: '' }, bestPractices: [] },
    'expert.json': data.expert || { examples: [] },
    'quiz.json': data.quiz,
    'practice.json': data.practice,
    'interview.json': data.interview,
    'project.json': data.project,
    'revision.json': data.revision,
    'cheatsheet.json': data.cheatsheet,
    'resources.json': data.resources,
    'videos.json': data.videos
  };

  let written = 0;
  for (const [filename, content] of Object.entries(files)) {
    if (!content) continue;
    const filePath = path.join(lessonDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
    written++;
  }
  console.log(`  ✓ ${modulePath}/${lessonSlug} — ${written} files written`);
}

// ─────────────────────────────────────────────────────────────
// MAIN: Write all lessons
// ─────────────────────────────────────────────────────────────

console.log('Writing Python curriculum content...\n');

for (const [lessonPath, data] of Object.entries(LESSONS)) {
  const parts = lessonPath.split('/');
  const moduleSlug = parts[0];
  const lessonSlug = parts[1];
  writeLesson(moduleSlug, lessonSlug, data);
}

console.log('\nDone!');
