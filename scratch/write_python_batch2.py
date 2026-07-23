#!/usr/bin/env python3
"""
EduNet Python Curriculum Writer — Batch 2
Covers: the_interpreter_flow (remaining files) + variables_core_data_types (all 3 lessons)
"""

import json, os

BASE = os.path.join(os.path.dirname(__file__), '..', 'curriculum', 'python', 'modules')

def wjson(module, lesson, filename, data):
    p = os.path.join(BASE, module, lesson, 'locales', 'en', filename)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  ✓ {module}/{lesson}/{filename}")

# ══════════════════════════════════════════════════════════════
# the_interpreter_flow — remaining files
# ══════════════════════════════════════════════════════════════

M = 'python_interpreter_setup'
L = 'the_interpreter_flow'

wjson(M, L, 'intermediate.json', {
    "deeperExplanation": "The Python interpreter processes your code through 4 stages:\n\n1. **Lexing (Tokenization)**: The source text is split into tokens — keywords (if, for, def), identifiers (variable names), literals (42, 'hello'), operators (+, ==), and punctuation. The tokenize module lets you inspect this.\n\n2. **Parsing**: Tokens are assembled into an Abstract Syntax Tree (AST) — a tree structure representing the logical meaning of your code. The ast module lets you inspect this.\n\n3. **Compilation**: The AST is compiled to bytecode — platform-independent VM instructions stored in .pyc files.\n\n4. **Execution**: CPython's virtual machine executes the bytecode on a stack-based VM. Each LOAD, STORE, CALL, RETURN is a bytecode instruction.\n\nUnderstanding this pipeline helps you understand SyntaxErrors (raised during parsing), NameErrors (raised during execution), and ImportErrors (raised when modules can't be found at import time).",
    "internalImplementation": "You can inspect each stage of the pipeline using Python's standard library:\n- tokenize.tokenize(): shows the token stream\n- ast.parse() + ast.dump(): shows the AST\n- dis.dis(): shows the bytecode\n- compile(): converts source to a code object\n\nThis is the foundation for building Python tools: linters, formatters, and transpilers all operate on the AST.",
    "examples": [
        {
            "code": "# Inspecting the AST (Abstract Syntax Tree)\nimport ast\n\nsource = 'x = 5 + 3'\ntree = ast.parse(source)\nprint(ast.dump(tree, indent=2))\n\n# Output shows the tree structure:\n# Module(\n#   body=[\n#     Assign(\n#       targets=[Name(id='x', ...)],\n#       value=BinOp(\n#         left=Constant(value=5),\n#         op=Add(),\n#         right=Constant(value=3)))])",
            "explanation": "ast.parse() converts Python source code into a tree of AST nodes. Each node represents a syntactic construct: Assign, BinOp, Name, Constant. Tools like black (formatter), pylint (linter), and mypy (type checker) work by analyzing this tree."
        },
        {
            "code": "# Inspecting bytecode\nimport dis\n\ndef compute(x, y):\n    return x + y\n\ndis.dis(compute)\n\n# Output:\n#   LOAD_FAST   0 (x)     # push x onto stack\n#   LOAD_FAST   1 (y)     # push y onto stack\n#   BINARY_OP   0 (+)     # pop two values, add, push result\n#   RETURN_VALUE          # return top of stack",
            "explanation": "dis.dis() shows the bytecode — the actual instructions the CPython VM executes. LOAD_FAST loads a local variable onto the evaluation stack. BINARY_OP pops two operands and pushes the result. CPython is a stack-based VM: all intermediate values live on an evaluation stack."
        }
    ],
    "performanceConsiderations": {
        "timeComplexity": "Parsing + compilation is fast (milliseconds for typical files). For performance-critical startup time, reduce imports. The -O flag (optimized mode) removes assert statements and __debug__-gated code.",
        "spaceComplexity": "The bytecode (.pyc) is cached in __pycache__. It's roughly 2-3x the source size. The AST is only in memory during compilation and is garbage collected afterward."
    },
    "debuggingWalkthrough": {
        "bugDescription": "IndentationError — mixing tabs and spaces",
        "incorrectCode": "def greet():\n\tprint('hello')   # tab\n    print('world')   # spaces — MIXING ERROR\n\ngreet()",
        "correctCode": "def greet():\n    print('hello')   # 4 spaces\n    print('world')   # 4 spaces — consistent\n\ngreet()"
    },
    "bestPractices": [
        "Understand the difference between SyntaxError (detected at parse time, before any code runs) and RuntimeError (detected during execution)",
        "Use 'python3 -m py_compile script.py' to check for syntax errors without running the file",
        "The ast module is the right way to analyze Python code programmatically — don't parse it with string manipulation",
        "Use dis.dis() to understand why a function is slow — too many LOAD_ATTR instructions may indicate repeated attribute lookups",
        "Import time matters for CLI tools — delay expensive imports to when they're actually needed (lazy imports)"
    ]
})

wjson(M, L, 'expert.json', {
    "examples": [
        {
            "code": "# Building a simple AST transformer\nimport ast\n\nclass ConstantFolder(ast.NodeTransformer):\n    \"\"\"Folds constant arithmetic at compile time.\"\"\"\n    def visit_BinOp(self, node):\n        self.generic_visit(node)  # recurse first\n        if (isinstance(node.left, ast.Constant) and\n            isinstance(node.right, ast.Constant) and\n            isinstance(node.op, ast.Add)):\n            return ast.Constant(value=node.left.value + node.right.value)\n        return node\n\nsource = 'result = 2 + 3'\ntree = ast.parse(source)\nfolded = ConstantFolder().visit(tree)\nprint(ast.unparse(folded))   # result = 5",
            "explanation": "AST transformers walk the AST and replace nodes. This ConstantFolder detects binary addition of two constants and replaces the BinOp node with a single Constant node — turning '2 + 3' into '5' at 'compile time'. This is a simplified version of what Python's peephole optimizer does."
        }
    ]
})

wjson(M, L, 'quiz.json', {
    "mcqs": [
        {"id": "q1", "question": "In what order does CPython process a Python source file?", "options": ["Tokenize → Parse → Compile to bytecode → Execute", "Compile → Parse → Tokenize → Execute", "Execute → Compile → Parse → Tokenize", "Parse → Tokenize → Execute → Compile"], "answer": 0, "explanation": "CPython's pipeline: (1) Tokenize: split source into tokens. (2) Parse: build an AST from tokens. (3) Compile: convert AST to bytecode. (4) Execute: run bytecode on the VM. SyntaxErrors occur in step 2, NameErrors and other runtime errors occur in step 4.", "difficulty": "intermediate"},
        {"id": "q2", "question": "What type of error does Python raise if you have a syntax problem like 'if x = 5:'?", "options": ["SyntaxError — detected during parsing before any code executes", "RuntimeError — detected when the if statement is reached", "ValueError — because the value assignment is wrong", "NameError — because x is not defined"], "answer": 0, "explanation": "SyntaxError is raised during the parsing phase (step 2 of the pipeline). Python doesn't execute any code in a file that has a SyntaxError — the entire file is rejected before any line runs. This is different from, say, ZeroDivisionError which only occurs when that specific line executes.", "difficulty": "beginner"},
        {"id": "q3", "question": "What is the purpose of __pycache__ directories?", "options": ["Store compiled bytecode (.pyc files) so Python skips re-parsing unchanged source files on future runs", "Store Python's configuration files", "Cache network requests made by Python programs", "Store temporary files during script execution"], "answer": 0, "explanation": "Python compiles .py files to bytecode and caches the result in __pycache__/filename.cpython-XY.pyc. If the source file hasn't changed (same timestamp and size), Python loads the cached bytecode instead of re-parsing the source. This makes subsequent imports faster. Delete __pycache__ freely — Python recreates it.", "difficulty": "intermediate"},
        {"id": "q4", "question": "What does the 'dis' module do?", "options": ["Disassembles Python bytecode to show the VM instructions Python executes", "Displays error information for debugging", "Distributes Python packages to PyPI", "Disconnects network connections"], "answer": 0, "explanation": "dis (disassembler) shows the bytecode instructions that CPython executes. Use dis.dis(function) to see operations like LOAD_FAST (load a local variable), BINARY_OP (perform arithmetic), CALL (call a function). This helps understand performance characteristics and Python's internal evaluation model.", "difficulty": "intermediate"},
        {"id": "q5", "question": "At what stage does a NameError (undefined variable) occur in Python's execution pipeline?", "options": ["At execution time — when that specific line runs, not when the file is parsed", "At parse time — when Python reads the file", "At tokenization time — before parsing", "At compilation time — when converting AST to bytecode"], "answer": 0, "explanation": "NameError is a runtime error raised during execution. Python doesn't know if a name exists until it tries to look it up in the namespace. Contrast with SyntaxError which occurs at parse time (step 2) — a file with a SyntaxError never executes any code.", "difficulty": "intermediate"}
    ],
    "checkpoints": [
        {"id": "cp1", "question": "True or False: A Python file with a SyntaxError will execute the lines before the error before stopping.", "answer": False, "explanation": "False. Python parses the entire file before executing any of it. A SyntaxError prevents the entire file from executing — not just the lines after the error. This is fundamentally different from languages that interpret line-by-line."},
        {"id": "cp2", "question": "True or False: Deleting __pycache__ will break your Python program.", "answer": False, "explanation": "False. __pycache__ contains performance cache files (.pyc bytecode). Deleting it is completely safe. Python will re-create it automatically the next time the file is imported. The only effect is that the next run will be slightly slower as Python re-parses and recompiles."}
    ]
})

wjson(M, L, 'practice.json', {
    "easy": {
        "title": "AST Inspector",
        "description": "Write a script that uses the ast module to parse the expression '10 * 5 + 3' and print how many AST nodes it contains (use ast.walk() to iterate all nodes).",
        "starterCode": "import ast\n\nsource = '10 * 5 + 3'\ntree = ast.parse(source)\n\n# Count all nodes using ast.walk()\n# Print: 'AST nodes: N'\n",
        "expectedOutput": "AST nodes: 7",
        "solution": "import ast\n\nsource = '10 * 5 + 3'\ntree = ast.parse(source)\n\nnodes = list(ast.walk(tree))\nprint(f'AST nodes: {len(nodes)}')",
        "hints": ["ast.walk(tree) is a generator that yields all nodes recursively", "Wrap in list() to get all nodes at once", "Use len() to count"],
        "difficulty": "easy"
    },
    "medium": {
        "title": "Bytecode Inspector",
        "description": "Write a function 'count_ops(func)' that accepts a Python function and returns a dictionary counting how many times each bytecode instruction name appears.\n\nTest it with a function like: def add(a, b): return a + b",
        "starterCode": "import dis\n\ndef count_ops(func):\n    # Use dis.get_instructions(func) to iterate bytecode\n    # Count each opname\n    pass\n\ndef add(a, b):\n    return a + b\n\nprint(count_ops(add))\n",
        "expectedOutput": "{'RESUME': 1, 'LOAD_FAST': 2, 'BINARY_OP': 1, 'RETURN_VALUE': 1}",
        "solution": "import dis\n\ndef count_ops(func):\n    counts = {}\n    for instr in dis.get_instructions(func):\n        counts[instr.opname] = counts.get(instr.opname, 0) + 1\n    return counts\n\ndef add(a, b):\n    return a + b\n\nprint(count_ops(add))",
        "hints": ["dis.get_instructions(func) yields Instruction namedtuples", "Each Instruction has an .opname attribute", "Use a dictionary to count: counts[name] = counts.get(name, 0) + 1"],
        "difficulty": "medium"
    },
    "hard": {
        "title": "Syntax Validator",
        "description": "Write a function 'validate_python(code: str) -> dict' that attempts to parse a Python code string and returns a dictionary with:\n- 'valid': True or False\n- 'error': None if valid, or the error message string if invalid\n- 'line': None if valid, or the line number where the error occurred\n\nTest with both valid and invalid code.",
        "starterCode": "import ast\n\ndef validate_python(code):\n    pass\n\n# Test cases:\nprint(validate_python('x = 5 + 3'))\nprint(validate_python('def foo(: pass'))  # syntax error\n",
        "expectedOutput": "{'valid': True, 'error': None, 'line': None}\n{'valid': False, 'error': \"invalid syntax\", 'line': 1}",
        "solution": "import ast\n\ndef validate_python(code):\n    try:\n        ast.parse(code)\n        return {'valid': True, 'error': None, 'line': None}\n    except SyntaxError as e:\n        return {'valid': False, 'error': e.msg, 'line': e.lineno}\n\nprint(validate_python('x = 5 + 3'))\nprint(validate_python('def foo(: pass'))",
        "hints": ["ast.parse() raises SyntaxError for invalid syntax", "SyntaxError has .msg and .lineno attributes", "Use try/except SyntaxError to catch parse failures"],
        "difficulty": "hard"
    },
    "debugging": {
        "title": "Fix the Bytecode Reader",
        "description": "This code tries to inspect bytecode but has 3 bugs.",
        "buggyCode": "import dis\n\ndef multiply(a, b):\n    return a * b\n\n# Bug 1: dis() needs the function object, not a string\ndis.dis('multiply')\n\n# Bug 2: get_instructions returns objects, not strings\nfor instr in dis.get_instructions(multiply):\n    print(instr.name)  # wrong attribute\n\n# Bug 3: co_consts is on the code object, not the function\nprint(multiply.co_consts)",
        "fixedCode": "import dis\n\ndef multiply(a, b):\n    return a * b\n\n# Fix 1: Pass the function object, not a string name\ndis.dis(multiply)\n\n# Fix 2: The attribute is .opname, not .name\nfor instr in dis.get_instructions(multiply):\n    print(instr.opname)  # correct\n\n# Fix 3: co_consts is on multiply.__code__, not multiply\nprint(multiply.__code__.co_consts)",
        "bugs": ["dis.dis() takes a function object, not a string. Pass 'multiply' (the variable), not '\"multiply\"' (the string).", "Instruction objects have .opname (the instruction name string), not .name.", "Code object attributes like co_consts live on function.__code__, not directly on the function."]
    }
})

wjson(M, L, 'interview.json', {
    "questions": [
        {"question": "Walk me through what happens when you type 'python3 app.py' and press Enter.", "answer": "The OS finds python3 in PATH and launches the CPython interpreter. Python then: (1) Tokenizes app.py — splits source into tokens. (2) Parses tokens into an Abstract Syntax Tree (AST). (3) Compiles the AST to bytecode and caches it in __pycache__/app.cpython-312.pyc. (4) Executes the bytecode on CPython's stack-based virtual machine. Any import statements trigger the same process recursively for imported modules. If the module is already in sys.modules (import cache), it's reused without re-execution.", "level": "intermediate", "followUp": "What is sys.modules and why does it matter?"},
        {"question": "What is the difference between a SyntaxError and a NameError in Python?", "answer": "SyntaxError: raised during the parsing phase before any code executes. The file structure is invalid Python syntax (missing colon, mismatched brackets, etc.). The entire file fails to run. NameError: raised at runtime when Python tries to look up a name in the local/global/builtin namespace and can't find it. The file is syntactically valid Python; the error only occurs when that specific line executes. A file can have a NameError on line 50 and still execute lines 1-49 successfully.", "level": "intermediate", "followUp": "Is 'if x == undefined_var:' a SyntaxError or NameError?"}
    ]
})

wjson(M, L, 'project.json', {
    "title": "Python Source Analyzer", "tagline": "Build a code analysis tool using Python's own AST",
    "description": "Build a script 'analyze.py' that takes a Python file path as an argument and reports statistics about its structure.",
    "learningGoals": ["Use ast.parse() to process Python source", "Walk the AST to collect statistics", "Use sys.argv for file input"],
    "requirements": ["Accept a .py file path as sys.argv[1]", "Count total lines, functions (ast.FunctionDef), classes (ast.ClassDef), imports (ast.Import + ast.ImportFrom)", "Print a formatted report", "Handle FileNotFoundError and SyntaxError gracefully"],
    "starterCode": "import ast, sys, os\n\ndef analyze(filepath):\n    # Read file\n    # Parse AST\n    # Walk and count\n    # Print report\n    pass\n\nif __name__ == '__main__':\n    if len(sys.argv) < 2:\n        print('Usage: python3 analyze.py <file.py>')\n        sys.exit(1)\n    analyze(sys.argv[1])\n",
    "solution": "import ast, sys\n\ndef analyze(filepath):\n    try:\n        with open(filepath, 'r') as f:\n            source = f.read()\n    except FileNotFoundError:\n        print(f'Error: File not found: {filepath}')\n        return\n    \n    try:\n        tree = ast.parse(source)\n    except SyntaxError as e:\n        print(f'SyntaxError in {filepath}: {e.msg} (line {e.lineno})')\n        return\n    \n    lines = len(source.splitlines())\n    functions = sum(1 for n in ast.walk(tree) if isinstance(n, ast.FunctionDef))\n    classes = sum(1 for n in ast.walk(tree) if isinstance(n, ast.ClassDef))\n    imports = sum(1 for n in ast.walk(tree) if isinstance(n, (ast.Import, ast.ImportFrom)))\n    \n    print(f'File: {filepath}')\n    print(f'Lines:     {lines}')\n    print(f'Functions: {functions}')\n    print(f'Classes:   {classes}')\n    print(f'Imports:   {imports}')\n\nif __name__ == '__main__':\n    if len(sys.argv) < 2:\n        print('Usage: python3 analyze.py <file.py>')\n        sys.exit(1)\n    analyze(sys.argv[1])",
    "solutionExpl": "ast.walk() recursively yields every node in the tree. isinstance(node, ast.FunctionDef) checks if a node is a function definition. sum(1 for n in ...) counts matching items without building a full list.",
    "expectedOutput": "File: analyze.py\nLines:     45\nFunctions: 1\nClasses:   0\nImports:   2",
    "extensions": ["Count method definitions (FunctionDef inside a ClassDef)", "List all function names", "Check for TODO comments in the source"]
})

wjson(M, L, 'revision.json', {
    "summary": "Python processes source files in 4 stages: tokenize → parse → compile to bytecode → execute on the VM. SyntaxErrors occur at parse time; runtime errors occur during execution. Bytecode is cached in __pycache__. The ast module lets you inspect and transform the AST. The dis module shows bytecode.",
    "oneLineSummary": "Python: tokenize → AST → bytecode (.pyc) → execute on CPython VM; inspect with ast and dis modules.",
    "keyTakeaways": ["4 stages: tokenize, parse, compile, execute", "SyntaxError = parse failure; NameError = runtime failure", "__pycache__ stores .pyc bytecode cache — safe to delete", "ast module: inspect the parse tree", "dis module: inspect bytecode instructions", "Imports use sys.modules cache to avoid re-executing modules"],
    "memoryTricks": [{"concept": "SyntaxError vs NameError", "trick": "Syntax = the grammar of the sentence is wrong (caught before reading). Name = the word doesn't exist in the dictionary (caught while reading)."}],
    "commonErrors": [
        {"error": "SyntaxError: unexpected EOF while parsing", "cause": "Unclosed parenthesis, bracket, or string", "fix": "Check for matching (), [], {}, and quotes"},
        {"error": "IndentationError: unexpected indent", "cause": "Mixed tabs and spaces, or wrong indent level", "fix": "Use 4 spaces consistently; configure editor to show whitespace"}
    ],
    "preInterviewChecklist": ["Explain the 4 stages of Python execution", "Difference between SyntaxError and runtime errors", "What is __pycache__ and when is it used"],
    "nextTopics": [{"title": "Variables & Assignment", "whyNext": "With a solid understanding of how Python runs code, dive into how Python manages data through variables."}]
})

wjson(M, L, 'cheatsheet.json', {
    "printNote": "Quick reference for Python's execution pipeline and introspection tools.",
    "sections": [
        {
            "heading": "Execution Pipeline Tools",
            "entries": [
                {"syntax": "python3 -m py_compile file.py", "example": "$ python3 -m py_compile app.py", "description": "Check for syntax errors without executing the file", "commonMistake": "Using 'python3 -c \"import app\"' instead — this executes module-level code"},
                {"syntax": "import ast; ast.parse(source)", "example": "tree = ast.parse('x = 1 + 2')", "description": "Parse Python source into an AST", "commonMistake": "Forgetting ast.parse takes a string, not a filename"},
                {"syntax": "import dis; dis.dis(func)", "example": "dis.dis(my_function)", "description": "Show bytecode instructions for a function", "commonMistake": "Passing a string name instead of the function object"}
            ]
        }
    ]
})

wjson(M, L, 'resources.json', {"links": [
    {"type": "official", "title": "Python AST Module", "url": "https://docs.python.org/3/library/ast.html"},
    {"type": "official", "title": "dis — Disassembler", "url": "https://docs.python.org/3/library/dis.html"},
    {"type": "official", "title": "CPython Internals", "url": "https://devguide.python.org/internals/"}
]})

wjson(M, L, 'videos.json', [{"title": "How Python Works Internally", "video_id": "oRp6VfEqbCw", "url": "https://www.youtube.com/watch?v=oRp6VfEqbCw", "thumbnail": "https://img.youtube.com/vi/oRp6VfEqbCw/maxresdefault.jpg", "channel": "NeuralNine", "duration": "12m", "description": "Inside CPython: tokenization, AST, bytecode, and how the VM executes your Python code."}])

print("\n✅ python_interpreter_setup/the_interpreter_flow — all files written")

# ══════════════════════════════════════════════════════════════
# MODULE: variables_core_data_types
# Lessons: dynamic_typing_in_python, numeric_data_types, strings_booleans
# ══════════════════════════════════════════════════════════════

M = 'variables_core_data_types'

# ── dynamic_typing_in_python — all files ──────────────────────
L = 'dynamic_typing_in_python'

wjson(M, L, 'beginner.json', {
    "whyExists": "In some programming languages, you must declare what type of data a variable will hold before using it, and that type can never change. Python takes a fundamentally different approach: it figures out the type from the value you assign, and you can reassign different types to the same name later. This design choice — called dynamic typing — makes Python faster to write and easier to learn, while also introducing a specific category of bugs to watch for.",
    "curiosityQuestion": "Why do some programming languages force you to declare variable types explicitly?",
    "problemItSolves": "Static typing (C, Java, C#) requires: int age = 25; — you commit to int before the program runs. Dynamic typing means Python discovers types at runtime based on actual values. This eliminates boilerplate, accelerates prototyping, and is the reason Python code is typically 2-5x shorter than equivalent Java.",
    "realWorldAnalogy": "A dynamically typed variable is like a universal remote. Today it controls the TV, tomorrow it controls the AC, next week it controls the stereo. The remote (variable name) doesn't change — what it points to does. A statically typed variable is like a specialized remote that can only ever control one brand of TV, hardwired at the factory.",
    "simpleExplanation": "In Python:\n- x = 42 → Python creates an int object (value 42), binds the name 'x' to it\n- x = 'hello' → Python creates a str object (value 'hello'), rebinds 'x' to it\n- x = [1, 2, 3] → Python creates a list object, rebinds 'x'\n\nThe NAME 'x' has no type. The OBJECTS it points to have types. You can check the current type with type(x) or isinstance(x, SomeType).",
    "syntaxExplanation": "# No type declaration needed:\ncount = 5            # Python: int\ncount = 'five'       # Now str — valid!\ncount = [5, 10, 15]  # Now list — still valid!\n\n# Check type:\nprint(type(count))           # <class 'list'>\nprint(isinstance(count, list))   # True\nprint(isinstance(count, str))    # False",
    "examples": [
        {"title": "Variables Change Type Freely", "code": "x = 100\nprint(f'{type(x).__name__}: {x}')  # int: 100\n\nx = 3.14\nprint(f'{type(x).__name__}: {x}')  # float: 3.14\n\nx = 'Python'\nprint(f'{type(x).__name__}: {x}')  # str: Python\n\nx = True\nprint(f'{type(x).__name__}: {x}')  # bool: True\n\nx = None\nprint(f'{type(x).__name__}: {x}')  # NoneType: None", "explanation": "Each assignment rebinds 'x' to a new object. type(x).__name__ gives the type name as a string (without the <class '...'> wrapper).", "language": "python"},
        {"title": "isinstance() for Safe Type Checking", "code": "value = 42\n\n# Prefer isinstance() over type() ==\nif isinstance(value, int):    # True for int AND bool (subclass)\n    print('is int')\n\n# Check multiple types:\nif isinstance(value, (int, float)):\n    print('is numeric')\n\n# Critical: bool is a subclass of int\nprint(isinstance(True, int))   # True — bool inherits from int\nprint(isinstance(True, bool))  # True\nprint(type(True) == int)       # False — type() checks exact class", "explanation": "isinstance() handles class inheritance. bool is a subclass of int, so isinstance(True, int) is True. type() checks exact class only.", "language": "python"}
    ],
    "visualDiagram": "```mermaid\nflowchart LR\n    Name[\"Variable name 'x'\\n(just a label)\"]\n    Name -->|first assignment| O1[\"int object\\nvalue=42\"]\n    Name -->|second assignment| O2[\"str object\\nvalue='hello'\"]\n    Name -->|third assignment| O3[\"list object\\n[1,2,3]\"]\n    note1[\"Type is on the OBJECT\\nnot on the name\"]\n```",
    "stepByStepExecution": [
        {"step": 1, "action": "x = 42", "explanation": "Python allocates an int object (value 42) on the heap. Creates a binding: name 'x' → this object."},
        {"step": 2, "action": "x = 'hello'", "explanation": "Python allocates a str object. Rebinds 'x' to the new str. The int(42) object now has 0 references."},
        {"step": 3, "action": "type(x)", "explanation": "Python follows the binding 'x' → str object, returns str's type. Returns <class 'str'>."},
        {"step": 4, "action": "Garbage collection", "explanation": "The int(42) object has reference count 0. Python's garbage collector reclaims its memory automatically."}
    ],
    "memoryDiagram": {"stack": "[Name table]\n  x → heap address 0x7f3a (currently str object)", "heap": "[Heap]\n  0x7f3a: str 'hello'\n  [int 42 — GC eligible]"},
    "namingRules": [],
    "commonMistakes": [
        "Performing arithmetic on a string that looks like a number: '5' + 5 raises TypeError — use int('5') + 5 = 6",
        "Assuming isinstance() and type() == are equivalent — bool is a subclass of int; isinstance(True, int) is True but type(True) == int is False",
        "Thinking dynamic typing means Python has no types — every object has exactly one type; variables just don't have fixed types",
        "Ignoring type incompatibilities: result = user_input + 10 fails if user_input is a string (from input())"
    ]
})

wjson(M, L, 'intermediate.json', {
    "deeperExplanation": "Python's type system is built on a unified object model. Everything — integers, strings, functions, classes, modules — is an object with a type. The type of an object is itself an object (an instance of 'type', the metaclass). This gives Python remarkable reflective capabilities: you can inspect, create, and modify types at runtime.\n\nType annotations (PEP 484, Python 3.5+) let you document expected types without enforcing them at runtime:\n```python\ndef add(a: int, b: int) -> int:\n    return a + b\n```\nThese annotations are purely informational by default. Tools like mypy and pyright perform static type checking using these annotations, catching type errors before runtime without changing Python's dynamic nature.",
    "internalImplementation": "In CPython, every Python object is a C struct (PyObject) with two mandatory fields: ob_refcnt (reference count) and ob_type (pointer to the type object). The type determines which C functions handle operations like addition, string representation, and attribute access. This is why adding an int and a str raises TypeError — the int type's C implementation of __add__ doesn't know how to handle str operands.",
    "examples": [
        {"code": "# Type annotations (informational, not enforced)\ndef greet(name: str, times: int = 1) -> str:\n    return (f'Hello, {name}! ' * times).strip()\n\nprint(greet('Alice', 3))\n# Hello, Alice! Hello, Alice! Hello, Alice!\n\n# Annotations don't prevent wrong types at runtime:\nprint(greet(42, 1))  # No error! '42' is 42 the integer\n# TypeError only when * tries to repeat 42 times\n\n# Use mypy to catch this before running:\n# $ mypy script.py\n# error: Argument 1 to 'greet' has incompatible type 'int'; expected 'str'", "explanation": "Type annotations document intent and enable static analysis tools but don't enforce types at runtime. mypy (static type checker) can find type mismatches before you run the code — giving you some benefits of static typing while keeping Python's dynamic nature."},
        {"code": "# Duck typing: if it walks like a duck...\ndef print_length(collection):\n    # We never check the type — we just call len()\n    # Works for str, list, tuple, dict, set, and any custom class with __len__\n    print(f'Length: {len(collection)}')\n\nprint_length('hello')     # Length: 5\nprint_length([1, 2, 3])   # Length: 3\nprint_length({'a': 1})    # Length: 1\n\nclass MyCollection:\n    def __len__(self):\n        return 42\n\nprint_length(MyCollection())  # Length: 42", "explanation": "Duck typing is the natural style for dynamically typed Python: instead of checking isinstance(collection, list), you just call len(). If the object has __len__, it works. This makes code more flexible and general."}
    ],
    "performanceConsiderations": {
        "timeComplexity": "type() and isinstance() are O(1) operations. The overhead of dynamic dispatch (calling the right C function based on type) is typically 1-2 nanoseconds per operation — negligible for most code.",
        "spaceComplexity": "Each Python object has a base overhead of 16-28 bytes for the PyObject header (refcount + type pointer + possible extra fields). Integers from -5 to 256 are interned (cached globally), so they share the same object."
    },
    "debuggingWalkthrough": {
        "bugDescription": "TypeError when adding string from input() to a number",
        "incorrectCode": "age = input('Enter your age: ')  # input() always returns str\nbirth_year = 2024 - age          # TypeError: unsupported operand type(s) for -: 'int' and 'str'",
        "correctCode": "age = int(input('Enter your age: '))  # convert string to int first\nbirth_year = 2024 - age               # works: 2024 - 25 = 1999"
    },
    "bestPractices": [
        "Use isinstance() instead of type() == for type checks — handles inheritance correctly",
        "Add type annotations to function signatures for documentation and static analysis tooling",
        "Don't mix types in arithmetic without explicit conversion — int() and float() are your friends",
        "Use duck typing (try the operation, catch TypeError) instead of defensive type checking where possible",
        "Run mypy or pyright on your codebase to catch type errors statically without abandoning Python's dynamic flexibility"
    ]
})

wjson(M, L, 'expert.json', {
    "examples": [
        {"code": "# Creating types dynamically at runtime\n# type(name, bases, dict) creates a new class\n\nMyClass = type('MyClass', (object,), {\n    '__init__': lambda self, x: setattr(self, 'x', x),\n    '__repr__': lambda self: f'MyClass(x={self.x})',\n    'double': lambda self: self.x * 2\n})\n\nobj = MyClass(5)\nprint(obj)          # MyClass(x=5)\nprint(obj.double()) # 10\nprint(type(obj))    # <class '__main__.MyClass'>", "explanation": "Python's type system is fully dynamic: type() (the metaclass) can create new classes at runtime. This is how ORMs, serializers, and metaclass-based frameworks work. The class body is just a dictionary — hence dict comprehensions and metaclasses can generate entire class hierarchies programmatically."},
        {"code": "# Runtime type protocol inspection with __class_getitem__ and Protocols\nfrom typing import Protocol, runtime_checkable\n\n@runtime_checkable\nclass Drawable(Protocol):\n    def draw(self) -> None: ...\n\nclass Circle:\n    def draw(self) -> None:\n        print('Drawing circle')\n\nclass Square:\n    def draw(self) -> None:\n        print('Drawing square')\n\nclass Point:  # no draw method\n    pass\n\nfor shape in [Circle(), Square(), Point()]:\n    if isinstance(shape, Drawable):  # runtime_checkable enables this\n        shape.draw()\n    else:\n        print(f'{type(shape).__name__} is not drawable')", "explanation": "runtime_checkable Protocols combine structural subtyping (duck typing) with isinstance() checking. At runtime, isinstance(obj, Drawable) returns True if obj has all the methods declared in the Protocol, without the class explicitly inheriting from Drawable."}
    ]
})

wjson(M, L, 'quiz.json', {
    "mcqs": [
        {"id": "q1", "question": "In Python, where does the type information of a variable's value live?", "options": ["On the variable name in the symbol table", "On the object (value) that the variable currently refers to", "In a global type registry maintained by the interpreter", "In the Python source file's header"], "answer": 1, "explanation": "Python variables are names (references) that point to objects. The type information is stored on the object itself — each Python object is a C struct with an ob_type field. The name has no type; it just points to the currently bound object.", "difficulty": "intermediate"},
        {"id": "q2", "question": "What is the result of: isinstance(True, int) in Python?", "options": ["True — because bool is a subclass of int", "False — because True is a bool, not an int", "TypeError — bool and int are incompatible", "None"], "answer": 0, "explanation": "Python's bool type is implemented as a subclass of int. True == 1 and False == 0 in numeric contexts. isinstance() considers the inheritance hierarchy, so isinstance(True, int) returns True. Use type(True) == bool if you need to distinguish.", "difficulty": "intermediate"},
        {"id": "q3", "question": "What is 'duck typing'?", "options": ["Programming by testing if an object has the needed attributes/methods rather than checking its class", "A typing style where all variables must be declared with a type", "Python's mechanism for automatic type conversion", "A security feature that prevents type confusion attacks"], "answer": 0, "explanation": "Duck typing: 'If it walks like a duck and quacks like a duck, it's a duck.' Instead of isinstance(obj, List) before calling len(), you just call len(obj). If the object has __len__, it works — regardless of its class. This is Python's natural and idiomatic style.", "difficulty": "intermediate"},
        {"id": "q4", "question": "What does a Python type annotation like 'def add(a: int, b: int) -> int:' do?", "options": ["Documents the expected types for tools and documentation; does NOT enforce types at runtime", "Enforces strict type checking at runtime", "Converts arguments to int automatically", "Speeds up execution by bypassing dynamic dispatch"], "answer": 0, "explanation": "Type annotations (PEP 484) are metadata only. Python ignores them at runtime — you can still call add('hello', 'world') without an error. Tools like mypy, pyright, and IDE type checkers read annotations to find type errors statically, before you run the code.", "difficulty": "intermediate"},
        {"id": "q5", "question": "What happens when you type: type('hello') == str in Python?", "options": ["True — type() returns the exact class, and str == str", "False — type() returns a string representation, not a class", "TypeError", "AttributeError"], "answer": 0, "explanation": "type('hello') returns the class object <class 'str'>. Comparing it to str (the class itself, not the string 'str') with == returns True. This is why isinstance() is preferred: type() == checks exact class, while isinstance() checks class hierarchy.", "difficulty": "beginner"}
    ],
    "checkpoints": [
        {"id": "cp1", "question": "True or False: In Python, you must declare a variable's type before assigning a value to it.", "answer": False, "explanation": "False. Python uses dynamic typing — variable types are determined at runtime from the assigned value. No type declaration is needed."},
        {"id": "cp2", "question": "True or False: '5' + 5 is valid in Python because Python automatically converts the string '5' to an integer.", "answer": False, "explanation": "False. Python does NOT silently coerce types. '5' + 5 raises TypeError: can only concatenate str (not 'int') to str. You must explicitly convert: int('5') + 5 = 6."}
    ]
})

wjson(M, L, 'practice.json', {
    "easy": {"title": "Type Detective", "description": "Write a function 'what_is(x)' that returns a human-readable string describing the type of x:\n- 'integer' for int (but not bool)\n- 'boolean' for bool\n- 'decimal' for float\n- 'text' for str\n- 'nothing' for None\n- 'collection' for list, tuple, or set\n- 'mapping' for dict\n- 'unknown' for anything else", "starterCode": "def what_is(x):\n    pass\n\nprint(what_is(42))      # integer\nprint(what_is(True))    # boolean\nprint(what_is(3.14))    # decimal\nprint(what_is('hi'))    # text\nprint(what_is(None))    # nothing\nprint(what_is([1,2]))   # collection\nprint(what_is({'a':1})) # mapping\n", "expectedOutput": "integer\nboolean\ndecimal\ntext\nnothing\ncollection\nmapping", "solution": "def what_is(x):\n    if isinstance(x, bool):              return 'boolean'  # before int!\n    elif isinstance(x, int):             return 'integer'\n    elif isinstance(x, float):           return 'decimal'\n    elif isinstance(x, str):             return 'text'\n    elif x is None:                      return 'nothing'\n    elif isinstance(x, (list,tuple,set)):return 'collection'\n    elif isinstance(x, dict):            return 'mapping'\n    else:                                return 'unknown'\n\nprint(what_is(42))\nprint(what_is(True))\nprint(what_is(3.14))\nprint(what_is('hi'))\nprint(what_is(None))\nprint(what_is([1,2]))\nprint(what_is({'a':1}))", "hints": ["Check isinstance(x, bool) BEFORE isinstance(x, int) — bool is a subclass of int", "Use x is None (not isinstance) for None check", "isinstance accepts a tuple of types"], "difficulty": "easy"},
    "medium": {"title": "Type-Aware Accumulator", "description": "Write a class 'Accumulator' that can add values to itself but only adds values of the same type as the first value added.\n\n- accumulate(value): if list is empty, accept; if same type as first, accept; otherwise raise TypeError\n- total(): for numbers, return sum; for strings, return concatenation; for lists, return merged list\n- reset(): clear all accumulated values", "starterCode": "class Accumulator:\n    def __init__(self):\n        self.values = []\n    \n    def accumulate(self, value):\n        pass\n    \n    def total(self):\n        pass\n    \n    def reset(self):\n        pass\n\nacc = Accumulator()\nacc.accumulate(1)\nacc.accumulate(2)\nacc.accumulate(3)\nprint(acc.total())  # 6\nacc.reset()\nacc.accumulate('hello')\nacc.accumulate(' world')\nprint(acc.total())  # hello world\n", "expectedOutput": "6\nhello world", "solution": "class Accumulator:\n    def __init__(self):\n        self.values = []\n    \n    def accumulate(self, value):\n        if not self.values:\n            self.values.append(value)\n        elif type(value) == type(self.values[0]):\n            self.values.append(value)\n        else:\n            raise TypeError(f'Expected {type(self.values[0]).__name__}, got {type(value).__name__}')\n    \n    def total(self):\n        if not self.values: return None\n        if isinstance(self.values[0], (int, float)):\n            return sum(self.values)\n        elif isinstance(self.values[0], str):\n            return ''.join(self.values)\n        elif isinstance(self.values[0], list):\n            result = []\n            for lst in self.values: result.extend(lst)\n            return result\n        return self.values\n    \n    def reset(self):\n        self.values = []\n\nacc = Accumulator()\nacc.accumulate(1)\nacc.accumulate(2)\nacc.accumulate(3)\nprint(acc.total())\nacc.reset()\nacc.accumulate('hello')\nacc.accumulate(' world')\nprint(acc.total())", "hints": ["Use type() == type() to check exact match (not isinstance — bool and int are different 'category' here)", "Check len(self.values) == 0 for the empty case", "isinstance(x, (int, float)) handles both numeric types for total()"], "difficulty": "medium"},
    "hard": {"title": "Polymorphic Container", "description": "Write a class 'TypeSafe' that wraps a value and tracks its history of type changes.\n\n- TypeSafe(value): create with initial value\n- set(value): change the value (any type allowed)\n- get(): return current value\n- history: list of (old_value, old_type_name, new_value, new_type_name) tuples for each change\n- type_changes: return count of times the type changed (not just value)\n\nTest: set int, then str (type change), then another str (no type change), then float (type change).", "starterCode": "class TypeSafe:\n    def __init__(self, value):\n        pass\n    \n    def set(self, value):\n        pass\n    \n    def get(self):\n        pass\n\nts = TypeSafe(42)\nts.set('hello')\nts.set('world')\nts.set(3.14)\nprint(ts.get())           # 3.14\nprint(ts.type_changes)    # 2 (int→str, str→float)\nprint(len(ts.history))    # 3 (3 set() calls)\n", "solution": "class TypeSafe:\n    def __init__(self, value):\n        self._value = value\n        self.history = []\n        self.type_changes = 0\n    \n    def set(self, value):\n        old_type = type(self._value).__name__\n        new_type = type(value).__name__\n        self.history.append((self._value, old_type, value, new_type))\n        if old_type != new_type:\n            self.type_changes += 1\n        self._value = value\n    \n    def get(self):\n        return self._value\n\nts = TypeSafe(42)\nts.set('hello')\nts.set('world')\nts.set(3.14)\nprint(ts.get())\nprint(ts.type_changes)\nprint(len(ts.history))", "hints": ["Store current value in self._value", "Track type name (not type object) in history for clean comparison", "Compare old and new type names to detect type changes"], "difficulty": "hard"},
    "debugging": {"title": "Fix the Type Checker", "description": "This code has 3 type-related bugs.", "buggyCode": "# Bug 1: Wrong order — bool check after int check\ndef classify(x):\n    if isinstance(x, int):\n        return 'int'\n    if isinstance(x, bool):\n        return 'bool'  # Never reached — bool is subclass of int\n\n# Bug 2: String concatenation without conversion\nage = input('Age: ')  # returns str '25'\nage_next_year = age + 1  # TypeError\n\n# Bug 3: Incorrect isinstance syntax\nif isinstance(x, int, float):  # TypeError — should be tuple\n    print('number')", "fixedCode": "# Fix 1: Check bool BEFORE int\ndef classify(x):\n    if isinstance(x, bool):   # must come first\n        return 'bool'\n    if isinstance(x, int):\n        return 'int'\n\n# Fix 2: Convert string to int before arithmetic\nage = int(input('Age: '))\nage_next_year = age + 1    # works\n\n# Fix 3: Use a tuple for multiple types\nif isinstance(x, (int, float)):  # tuple, not separate args\n    print('number')", "bugs": ["isinstance(x, bool) after isinstance(x, int) is unreachable — bool is a subclass of int, so isinstance(True, int) is True. Always check the more specific type first.", "input() always returns a string. You must convert with int() or float() before arithmetic.", "isinstance() takes exactly two arguments: the object and a type OR a tuple of types. isinstance(x, int, float) raises TypeError."]}
})

wjson(M, L, 'interview.json', {
    "questions": [
        {"question": "What is the difference between dynamic typing, duck typing, and type annotations in Python?", "answer": "Dynamic typing: types are determined at runtime from values, not declared in advance. Variables don't have types — objects do. Duck typing: a programming style where you call methods/access attributes without checking type — if the object supports the operation, it works. This is enabled by dynamic typing. Type annotations (PEP 484): optional metadata added to function signatures and variables to document expected types. Ignored at runtime but used by static analysis tools (mypy, pyright) to catch type errors before running code. Python is dynamically typed with duck typing as the idiomatic style, and type annotations as optional documentation/tooling.", "level": "senior", "followUp": "How would you add mypy to a project and what would you configure?"},
        {"question": "Why does isinstance(True, int) return True in Python? Is this a bug?", "answer": "It's intentional. In CPython's implementation, bool is a subclass of int. True and False are actually the integer values 1 and 0 with a custom __repr__. This design allows booleans to participate in arithmetic (True + True == 2, sum([True, False, True]) == 2) without explicit conversion. While surprising to newcomers, it's a deliberate design choice that simplifies many common patterns. To distinguish: use type(x) == bool (exact check) vs isinstance(x, bool) (hierarchy check).", "level": "intermediate", "followUp": "Name a common bug this bool/int relationship causes in Python code."}
    ]
})

wjson(M, L, 'project.json', {
    "title": "Dynamic Type System Explorer",
    "tagline": "Build a runtime type analysis dashboard",
    "description": "Build a tool that accepts a Python expression string, evaluates it safely, and produces a detailed type analysis report.",
    "learningGoals": ["Apply isinstance() and type() in complex scenarios", "Understand Python's type hierarchy", "Build a safe expression evaluator"],
    "requirements": ["Accept a Python expression as a string input", "Evaluate it using eval() with a restricted namespace", "Report: type name, isinstance checks for int/float/str/bool/list/dict, whether it's iterable, whether it's callable", "Handle exceptions gracefully"],
    "starterCode": "def analyze_expression(expr):\n    SAFE_GLOBALS = {'__builtins__': {}}\n    try:\n        result = eval(expr, SAFE_GLOBALS)\n    except Exception as e:\n        print(f'Error: {e}')\n        return\n    \n    # Print type report\n    pass\n\nanalyze_expression('42')\nanalyze_expression('[1, 2, 3]')\nanalyze_expression('True')\n",
    "solution": "def analyze_expression(expr):\n    SAFE_GLOBALS = {'__builtins__': {'True': True, 'False': False, 'None': None}}\n    try:\n        result = eval(expr, SAFE_GLOBALS)\n    except Exception as e:\n        print(f'Error evaluating \"{expr}\": {e}')\n        return\n    \n    print(f'Expression: {expr!r}')\n    print(f'Value: {result!r}')\n    print(f'Type: {type(result).__name__}')\n    print(f'isinstance(int): {isinstance(result, int)}')\n    print(f'isinstance(float): {isinstance(result, float)}')\n    print(f'isinstance(str): {isinstance(result, str)}')\n    print(f'isinstance(bool): {isinstance(result, bool)}')\n    print(f'isinstance(list): {isinstance(result, list)}')\n    try:\n        iter(result)\n        print('Iterable: Yes')\n    except TypeError:\n        print('Iterable: No')\n    print(f'Callable: {callable(result)}')\n    print()\n\nanalyze_expression('42')\nanalyze_expression('[1, 2, 3]')\nanalyze_expression('True')",
    "solutionExpl": "eval() evaluates a Python expression string. The restricted SAFE_GLOBALS limits available names to prevent code injection (no access to open, __import__, etc.). Note: True is isinstance of both bool AND int.",
    "expectedOutput": "Expression: '42'\nValue: 42\nType: int\nisinstance(int): True\n...",
    "extensions": ["Add JSON output option with --json flag", "Show the MRO (method resolution order) with type(result).__mro__", "Compare two expressions and show what operations they share"]
})

wjson(M, L, 'revision.json', {
    "summary": "Python uses dynamic typing — variable types are determined at runtime from values. Variables are names that refer to objects; the type belongs to the object. isinstance() is preferred over type() == because it handles inheritance. bool is a subclass of int. Type annotations document expected types but are not enforced at runtime. Duck typing uses attributes/methods directly without type checking.",
    "oneLineSummary": "Python variables are names pointing to typed objects — no type declaration needed; isinstance() handles inheritance correctly.",
    "keyTakeaways": ["Type lives on the object, not the variable name", "isinstance(x, T) checks T and all subclasses — bool is a subclass of int", "type(x) == T checks exact class only", "Type annotations: documentation/tooling only, not runtime enforcement", "Duck typing: call the method, catch the exception — don't pre-check types", "input() always returns str — convert explicitly with int() or float()"],
    "memoryTricks": [{"concept": "Dynamic typing", "trick": "Variable = post-it note stuck to an object. You can move the note to a different object anytime. The object's type is printed on the object, not on the note."}],
    "commonErrors": [
        {"error": "TypeError: unsupported operand type(s) for +: 'int' and 'str'", "cause": "Forgetting to convert types before arithmetic", "fix": "Use int() or float() to convert: int(user_input) + 5"},
        {"error": "isinstance check for bool vs int always matches int", "cause": "bool is a subclass of int — isinstance(True, int) is True", "fix": "Check isinstance(x, bool) BEFORE isinstance(x, int) to handle booleans separately"}
    ],
    "preInterviewChecklist": ["Explain dynamic typing vs static typing with an example", "Explain why isinstance() is preferred over type() ==", "Explain duck typing and EAFP vs LBYL", "Explain why type annotations don't enforce types at runtime"],
    "nextTopics": [{"title": "Numeric Data Types", "whyNext": "Having understood how Python handles types dynamically, explore the specific numeric types: int, float, and complex."}]
})

wjson(M, L, 'cheatsheet.json', {
    "printNote": "Python type system quick reference.",
    "sections": [
        {"heading": "Type Checking", "entries": [
            {"syntax": "type(x)", "example": "type(42)  →  <class 'int'>", "description": "Returns exact type. Does not consider subclasses.", "commonMistake": "type(True) == int is False — bool is not exactly int"},
            {"syntax": "isinstance(x, T)", "example": "isinstance(True, int)  →  True", "description": "Checks type and all parent classes. Use for most type checking.", "commonMistake": "isinstance(x, int, float) is wrong — must use tuple: isinstance(x, (int, float))"},
            {"syntax": "isinstance(x, (T1, T2))", "example": "isinstance(3.14, (int, float))  →  True", "description": "Check multiple types at once with a tuple.", "commonMistake": "Always check bool before int when distinguishing them"}
        ]},
        {"heading": "Type Conversion", "entries": [
            {"syntax": "int(x)", "example": "int('42')  →  42\nint(3.9)  →  3  (truncates)", "description": "Convert to integer. Raises ValueError if string is not numeric.", "commonMistake": "int('3.14') raises ValueError — use int(float('3.14')) instead"},
            {"syntax": "float(x)", "example": "float('3.14')  →  3.14", "description": "Convert to float.", "commonMistake": "float(None) raises TypeError"},
            {"syntax": "str(x)", "example": "str(42)  →  '42'", "description": "Convert anything to string representation.", "commonMistake": "Not needed for f-strings — f'{42}' works directly"}
        ]}
    ]
})

wjson(M, L, 'resources.json', {"links": [
    {"type": "official", "title": "Python Type Hierarchy", "url": "https://docs.python.org/3/reference/datamodel.html#the-standard-type-hierarchy"},
    {"type": "official", "title": "PEP 484 — Type Hints", "url": "https://peps.python.org/pep-0484/"},
    {"type": "official", "title": "isinstance() builtin", "url": "https://docs.python.org/3/library/functions.html#isinstance"}
]})

wjson(M, L, 'videos.json', [{"title": "Python Typing - Type Hints & Annotations", "video_id": "QORvB-_mbZ0", "url": "https://www.youtube.com/watch?v=QORvB-_mbZ0", "thumbnail": "https://img.youtube.com/vi/QORvB-_mbZ0/maxresdefault.jpg", "channel": "Corey Schafer", "duration": "10m", "description": "Python's dynamic typing, type hints, isinstance vs type(), and the bool/int relationship."}])

print("\n✅ variables_core_data_types/dynamic_typing_in_python — all files written")

# ══════════════════════════════════════════════════════════════
# numeric_data_types
# ══════════════════════════════════════════════════════════════

L = 'numeric_data_types'

wjson(M, L, 'beginner.json', {
    "whyExists": "Every program works with numbers — ages, prices, temperatures, counts, coordinates. Python gives you three distinct numeric types that handle different scenarios: int for whole numbers without any size limit, float for decimal numbers (with a known precision limitation), and complex for numbers with real and imaginary parts used in scientific computing. Understanding which type to use and how each behaves prevents a class of subtle bugs that trip up even experienced programmers.",
    "curiosityQuestion": "Why does 0.1 + 0.2 not equal exactly 0.3 in Python (and every other language)?",
    "problemItSolves": "Before dedicated numeric types, all numbers had to be stored as binary patterns of fixed size — causing overflow (numbers too big) and precision loss (decimals not representable exactly in binary). Python's int has no size limit, float follows IEEE 754 double precision, and the decimal module exists for exact decimal arithmetic.",
    "realWorldAnalogy": "int is like counting with your fingers — perfectly exact, no fractions. float is like a ruler with millimeter markings — very precise but not infinitely so; 1/3 of a ruler can't be marked exactly. complex is like a map with both an East-West coordinate and a North-South coordinate — two numbers treated as one.",
    "simpleExplanation": "Python's three numeric types:\n\n**int**: Any whole number, positive or negative, any size.\n  - 0, 1, -1, 100, 999999999999999999999 (all valid)\n  - No overflow in Python 3 — ints grow as needed\n\n**float**: Decimal numbers, stored in 64-bit IEEE 754 format.\n  - 3.14, -0.5, 1.0, 1e10 (scientific notation), 1.5e-3\n  - WARNING: 0.1 + 0.2 == 0.30000000000000004 (floating point imprecision)\n\n**complex**: Numbers with a real and imaginary part.\n  - 3 + 4j, 1j, complex(2, 3)\n  - Used in signal processing, physics, and advanced math",
    "syntaxExplanation": "# Integer literals:\ncount = 42\nnegative = -17\nbig = 1_000_000_000  # underscores for readability\nbinary = 0b1010      # 10 in binary\nhexa = 0xFF          # 255 in hex\noctal = 0o17         # 15 in octal\n\n# Float literals:\nprice = 19.99\nscientific = 1.5e3   # 1500.0\ntiny = 2.5e-4        # 0.00025\n\n# Complex literals:\nz = 3 + 4j           # real=3, imaginary=4\nz2 = complex(2, -1)  # 2 - 1j",
    "examples": [
        {"title": "Integer Operations — No Size Limit", "code": "# Python integers have no maximum value\nbig = 2 ** 1000   # enormous number — works fine!\nprint(type(big))   # <class 'int'>\nprint(big > 10**200)  # True\n\n# Integer division operators:\nprint(17 // 3)    # 5  (floor division — integer result)\nprint(17 % 3)     # 2  (modulo — remainder)\nprint(17 / 3)     # 5.666... (true division — always float)\nprint(divmod(17, 3))  # (5, 2)  — quotient AND remainder at once\n\n# Powers:\nprint(2 ** 10)    # 1024\nprint(abs(-42))   # 42  (absolute value)", "explanation": "Python integers are arbitrary-precision — they grow as large as your memory allows. The // operator always gives an integer result (floor division). / always gives a float. % gives the remainder (modulo). divmod(a, b) gives both at once.", "language": "python"},
        {"title": "Float Precision — The 0.1 + 0.2 Problem", "code": "# The surprising float behavior:\nprint(0.1 + 0.2)           # 0.30000000000000004 (NOT 0.3!)\nprint(0.1 + 0.2 == 0.3)    # False!\n\n# Why: 0.1 has no exact binary representation\n# (like 1/3 has no exact decimal representation)\n\n# Fix 1: round() for display\nprint(round(0.1 + 0.2, 2))  # 0.3\n\n# Fix 2: math.isclose() for comparisons\nimport math\nprint(math.isclose(0.1 + 0.2, 0.3))  # True\n\n# Fix 3: decimal module for exact decimal arithmetic\nfrom decimal import Decimal\nprint(Decimal('0.1') + Decimal('0.2'))  # 0.3 (exact!)", "explanation": "0.1 cannot be represented exactly in binary floating point (base 2), just as 1/3 cannot be represented exactly in decimal. The IEEE 754 standard stores the closest binary approximation. Always use math.isclose() for float comparisons, and the decimal module when exactness matters (e.g., money).", "language": "python"},
        {"title": "Numeric Type Conversions", "code": "# Explicit conversion:\nprint(int(3.9))      # 3   (truncates toward zero — does NOT round)\nprint(int(-3.9))     # -3  (toward zero, not floor)\nprint(float(5))      # 5.0\nprint(complex(3, 4)) # (3+4j)\n\n# int() with base for string conversion:\nprint(int('ff', 16)) # 255 (hex string to int)\nprint(int('1010', 2)) # 10 (binary string to int)\n\n# Automatic type promotion in mixed arithmetic:\nresult = 5 + 2.0     # int + float = float (5 + 2.0 = 7.0)\nprint(type(result))   # <class 'float'>", "explanation": "int() truncates (toward zero), not floors. int(-3.9) is -3, not -4. In mixed arithmetic (int + float), Python promotes int to float. Base conversions: int(string, base) works for binary (2), octal (8), hex (16).", "language": "python"}
    ],
    "visualDiagram": "```mermaid\nflowchart TD\n    N[Numeric Types in Python]\n    N --> INT[int\\nWhole numbers\\nArbitrary precision\\nExample: 42, -17, 2**1000]\n    N --> FLOAT[float\\nDecimal numbers\\nIEEE 754 double\\nExample: 3.14, 1.5e-3]\n    N --> COMPLEX[complex\\nReal + Imaginary\\nExample: 3+4j]\n    FLOAT --> WARN[⚠️ 0.1+0.2 ≠ 0.3\\nUse math.isclose()\\nor Decimal for money]\n    INT --> PROM[Mixed: int + float → float]\n```",
    "stepByStepExecution": [
        {"step": 1, "action": "x = 42", "explanation": "Python creates an int object. Integers -5 to 256 are pre-allocated (interned) — Python reuses the same object. For larger integers, a new object is created."},
        {"step": 2, "action": "y = 3.14", "explanation": "Python creates a float object — a 64-bit IEEE 754 double. The value stored is the closest binary fraction to 3.14."},
        {"step": 3, "action": "z = x + y", "explanation": "Python sees int + float. Per the type promotion rules, int is widened to float. The result is a float (45.14)."},
        {"step": 4, "action": "type(z)", "explanation": "Returns <class 'float'> — the promotion happened silently during the addition."}
    ],
    "memoryDiagram": {"stack": "[Variables]\n  x → int(42)    [interned, shared object]\n  y → float(3.14) [64-bit IEEE 754]", "heap": "[Python small int cache]\n  -5 to 256: pre-allocated int objects\n  All other ints: allocated on demand"},
    "namingRules": [],
    "commonMistakes": [
        "Using == to compare floats: 0.1 + 0.2 == 0.3 is False. Use math.isclose(a, b) instead",
        "Expecting int() to round: int(3.9) == 3, not 4. Python truncates toward zero. Use round() if you need rounding",
        "Integer division returning float: 7 / 2 == 3.5 (true division). Use 7 // 2 == 3 for integer division",
        "Storing money as float: 0.1 + 0.1 + 0.1 != 0.3. Use the decimal module or store amounts in integer cents",
        "Integer overflow doesn't exist in Python: Python ints are arbitrary precision. 2**10000 just works."
    ]
})

wjson(M, L, 'intermediate.json', {
    "deeperExplanation": "Python integers in CPython are implemented as arbitrary-precision integers (big integers). Small integers (-5 to 256) are pre-allocated and reused (interned) — all occurrences of `x = 5` point to the same int object. Larger integers are allocated on demand.\n\nPython floats are IEEE 754 double-precision (64-bit): 1 sign bit, 11 exponent bits, 52 mantissa bits. This gives approximately 15-17 significant decimal digits of precision and a range of roughly ±1.8 × 10^308.\n\nFor financial calculations, the decimal module provides arbitrary-precision decimal arithmetic with configurable rounding: from decimal import Decimal, getcontext; getcontext().prec = 28. For fractions, the fractions module stores exact rational numbers: Fraction(1, 3) + Fraction(2, 3) == 1.",
    "internalImplementation": "Python integers are stored as arrays of C `digit` values (typically 30-bit digits). The sys.getsizeof() function shows that small ints (0-256) take 28 bytes each; each additional 30-bit digit adds 4 bytes. A 1000-bit integer takes about 172 bytes. Floats are always 24 bytes (the C double plus Python object overhead).",
    "examples": [
        {"code": "import sys, math\n\n# Integer size growth with large numbers\nprint(sys.getsizeof(0))         # 24 bytes\nprint(sys.getsizeof(2**30))     # 32 bytes  (2 digits)\nprint(sys.getsizeof(2**60))     # 36 bytes  (3 digits)\nprint(sys.getsizeof(2**90))     # 40 bytes  (4 digits)\n\n# Float special values:\nprint(math.inf)       # inf (positive infinity)\nprint(-math.inf)      # -inf\nprint(math.nan)       # nan (not a number)\nprint(math.isnan(math.nan))  # True\nprint(math.isinf(math.inf))  # True\nprint(1.0 / 0.0)     # ZeroDivisionError (unlike some languages)", "explanation": "Each additional 30-bit 'digit' in Python's bigint representation adds 4 bytes. Floats have IEEE 754 special values: inf, -inf, and nan. Python raises ZeroDivisionError for 1.0/0 instead of returning inf (unlike JavaScript)."},
        {"code": "# Exact decimal arithmetic with the decimal module\nfrom decimal import Decimal, getcontext\n\n# Set precision to 28 significant digits\ngetcontext().prec = 28\n\n# Financial calculation:\nprice = Decimal('19.99')\ntax_rate = Decimal('0.08')\ntax = price * tax_rate\ntotal = price + tax\n\nprint(f'Price: ${price}')\nprint(f'Tax (8%): ${tax}')\nprint(f'Total: ${total}')\n\n# Compare with float version:\nfloat_total = 19.99 * 1.08\nprint(f'Float total: {float_total}')  # 21.58920000000000...", "explanation": "The decimal module implements IBM's General Decimal Arithmetic standard. Always pass Decimal values as strings ('19.99'), never as floats (Decimal(19.99) would capture the float imprecision). Financial applications always use Decimal or integer cents."}
    ],
    "performanceConsiderations": {
        "timeComplexity": "Integer arithmetic: O(n) where n is the number of digits. Small integers (fits in machine word) are fast; very large integers (thousands of bits) are slower. Float arithmetic is O(1) — always 64-bit operations handled by hardware FPU.",
        "spaceComplexity": "int: 28 bytes base + 4 bytes per 30-bit digit. float: always 24 bytes. For performance-critical numerical code with large arrays, use numpy which stores numbers in compact C arrays."
    },
    "debuggingWalkthrough": {
        "bugDescription": "Integer division returning float unexpectedly",
        "incorrectCode": "total_items = 10\nbatch_size = 3\nbatches = total_items / batch_size  # 3.3333...\nprint(f'Need {batches} batches')    # 'Need 3.3333... batches'",
        "correctCode": "total_items = 10\nbatch_size = 3\nbatches = -(-total_items // batch_size)  # ceiling division: 4\n# Or:\nimport math\nbatches = math.ceil(total_items / batch_size)  # 4\nprint(f'Need {batches} batches')  # 'Need 4 batches'"
    },
    "bestPractices": [
        "Never use float for money — use the decimal module or store amounts as integer cents (1999 cents instead of $19.99)",
        "Use math.isclose(a, b, rel_tol=1e-9) for float equality comparisons — never == for floats",
        "Use underscore separators for large literals: 1_000_000 is clearer than 1000000",
        "Prefer // (floor division) over int(a/b) for integer division — int() truncates, // floors",
        "For scientific/numerical computing, use numpy float arrays instead of Python floats — 50-100x faster"
    ]
})

wjson(M, L, 'expert.json', {
    "examples": [
        {"code": "# Integer bit manipulation — common in systems programming\nx = 0b10110011  # 179 in decimal\n\nprint(bin(x))           # 0b10110011\nprint(x >> 2)           # 44 (right shift by 2 = divide by 4)\nprint(x << 1)           # 358 (left shift by 1 = multiply by 2)\nprint(x & 0b00001111)   # 3 (AND — extract lower 4 bits)\nprint(x | 0b01000000)   # 243 (OR — set bit 6)\nprint(x ^ 0b11111111)   # 76 (XOR with all 1s = flip all bits)\nprint(~x)               # -180 (bitwise NOT — two's complement)\n\n# Practical: check if even/odd using bitmask\nfor n in [0, 1, 2, 3, 4, 5]:\n    print(f'{n} is {\"even\" if n & 1 == 0 else \"odd\"}')", "explanation": "Bitwise operations on integers are essential for systems programming, networking (IP masks), cryptography, and performance-critical code. Python ints support all standard bitwise operators. n & 1 tests the least significant bit — faster than n % 2 == 0 for parity checks."},
        {"code": "# Complex numbers in signal processing\nimport cmath\n\n# Euler's formula: e^(i*pi) + 1 = 0\nresult = cmath.exp(1j * cmath.pi) + 1\nprint(f'e^(i*pi) + 1 = {result:.0f}')  # 0+0j (Euler's identity)\n\n# Polar form of complex numbers\nz = 3 + 4j\nprint(f'Magnitude (|z|): {abs(z)}')     # 5.0 (Pythagorean theorem)\nprint(f'Phase angle: {cmath.phase(z):.4f} rad')  # 0.9273 rad\nr, phi = cmath.polar(z)\nprint(f'Polar form: {r:.1f} ∠ {phi:.4f}')\nz_reconstructed = cmath.rect(r, phi)\nprint(f'Back to rectangular: {z_reconstructed:.1f}')  # (3+4j)", "explanation": "Python complex numbers support standard arithmetic and the cmath module for complex-specific functions. abs(z) gives the magnitude (distance from origin). cmath.phase(z) gives the angle. This is the foundation of Fourier transforms, signal processing, and quantum computing simulations."}
    ]
})

wjson(M, L, 'quiz.json', {
    "mcqs": [
        {"id": "q1", "question": "What is the result of 17 // 3 in Python?", "options": ["5", "5.666...", "6", "5.0"], "answer": 0, "explanation": "// is floor division — it divides and rounds down to the nearest integer. 17 / 3 = 5.666..., floor is 5. The result is an int (if both operands are int). Contrast with 17 / 3 = 5.666... (always float).", "difficulty": "beginner"},
        {"id": "q2", "question": "Why does 0.1 + 0.2 == 0.3 return False in Python?", "options": ["0.1 and 0.2 cannot be represented exactly in IEEE 754 binary floating point, so their sum has accumulated rounding error", "Python uses integer arithmetic for decimals by default", "The == operator doesn't work with floats", "This is a known Python 3 bug"], "answer": 0, "explanation": "IEEE 754 double precision uses binary (base 2) fractions. 0.1 in binary is 0.0001100110011... (repeating) — like 1/3 in decimal is 0.333... (repeating). The nearest representable double to 0.1 is not exactly 0.1, and accumulated rounding makes 0.1 + 0.2 != 0.3 exactly. Use math.isclose() for float comparisons.", "difficulty": "intermediate"},
        {"id": "q3", "question": "What does int(3.9) return in Python?", "options": ["3 (truncates toward zero)", "4 (rounds to nearest)", "4.0 (float)", "ValueError"], "answer": 0, "explanation": "int() truncates toward zero (like C casting). int(3.9) = 3, int(-3.9) = -3. This is different from rounding: round(3.9) = 4, round(-3.9) = -4. Use round() if you want mathematical rounding.", "difficulty": "beginner"},
        {"id": "q4", "question": "Which module provides exact decimal arithmetic in Python?", "options": ["decimal", "math", "fractions", "numbers"], "answer": 0, "explanation": "The decimal module implements arbitrary-precision decimal arithmetic. Decimal('0.1') + Decimal('0.2') == Decimal('0.3') — exactly. Always pass values as strings to Decimal to avoid capturing float imprecision.", "difficulty": "intermediate"},
        {"id": "q5", "question": "What is the maximum value of a Python int?", "options": ["No limit — Python ints are arbitrary-precision big integers", "2^63 - 1 (64-bit signed max)", "2^31 - 1 (32-bit signed max)", "Defined by sys.maxsize"], "answer": 0, "explanation": "Python 3 integers are arbitrary-precision. Unlike C (where int overflows) or Java (where long wraps at 2^63-1), Python integers can be as large as available memory. 2**1000 is a valid Python integer. sys.maxsize is the max list index size, not the max integer.", "difficulty": "beginner"},
        {"id": "q6", "question": "What is the result of: type(5 / 2) in Python 3?", "options": ["<class 'float'>", "<class 'int'>", "<class 'Fraction'>", "ZeroDivisionError"], "answer": 0, "explanation": "In Python 3, / is true division and ALWAYS returns a float, even when the result is whole: 4 / 2 = 2.0 (not 2). Use // for integer division: 4 // 2 = 2. This was a breaking change from Python 2 where 5 / 2 = 2 (integer division).", "difficulty": "intermediate"}
    ],
    "checkpoints": [
        {"id": "cp1", "question": "True or False: Python integers can overflow like C integers if they get too large.", "answer": False, "explanation": "False. Python 3 integers are arbitrary-precision. They grow dynamically to hold any number. You cannot overflow a Python int — only a MemoryError if the number is too large to fit in available RAM."},
        {"id": "cp2", "question": "True or False: math.isclose(0.1 + 0.2, 0.3) returns True.", "answer": True, "explanation": "True. math.isclose() uses relative and absolute tolerance to compare floats approximately. By default, rel_tol=1e-9 and abs_tol=0.0. 0.1 + 0.2 = 0.30000000000000004, which is close enough to 0.3 within the default tolerance."}
    ]
})

wjson(M, L, 'practice.json', {
    "easy": {"title": "Number Inspector", "description": "Write a function 'describe_number(n)' that takes any numeric value and prints:\n1. Its type (int, float, or complex)\n2. Whether it's positive, negative, or zero\n3. If float: whether it's NaN or infinite (using math.isnan() and math.isinf())", "starterCode": "import math\n\ndef describe_number(n):\n    pass\n\ndescribe_number(42)\ndescribe_number(-3.14)\ndescribe_number(0)\ndescribe_number(float('inf'))\n", "expectedOutput": "42: int, positive\n-3.14: float, negative\n0: int, zero\ninf: float, positive, infinite", "solution": "import math\n\ndef describe_number(n):\n    t = type(n).__name__\n    parts = [f'{n}: {t}']\n    if isinstance(n, complex):\n        parts.append('complex')\n    elif math.isnan(n):\n        parts.append('NaN')\n    elif math.isinf(n):\n        parts.append('positive' if n > 0 else 'negative')\n        parts.append('infinite')\n    elif n > 0:\n        parts.append('positive')\n    elif n < 0:\n        parts.append('negative')\n    else:\n        parts.append('zero')\n    print(', '.join(parts))\n\ndescribe_number(42)\ndescribe_number(-3.14)\ndescribe_number(0)\ndescribe_number(float('inf'))", "hints": ["math.isinf() and math.isnan() only work on floats", "Check for NaN and inf before positive/negative (math.nan > 0 is False, but so is math.nan < 0)", "type(n).__name__ gives the type name as a string"], "difficulty": "easy"},
    "medium": {"title": "Safe Division Function", "description": "Write a function 'safe_divide(a, b, default=None)' that:\n1. Divides a by b\n2. Returns default if b is zero (instead of raising ZeroDivisionError)\n3. Returns an int if both inputs are int and the division is exact\n4. Otherwise returns a float\n5. Raises TypeError if either argument is not a number (int or float)", "starterCode": "def safe_divide(a, b, default=None):\n    pass\n\nprint(safe_divide(10, 2))      # 5  (int, exact)\nprint(safe_divide(10, 3))      # 3.333...\nprint(safe_divide(10, 0))      # None\nprint(safe_divide(10, 0, 0))   # 0  (custom default)\n", "solution": "def safe_divide(a, b, default=None):\n    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):\n        raise TypeError(f'Arguments must be numeric, got {type(a).__name__} and {type(b).__name__}')\n    if b == 0:\n        return default\n    result = a / b\n    if isinstance(a, int) and isinstance(b, int) and a % b == 0:\n        return int(result)\n    return result\n\nprint(safe_divide(10, 2))\nprint(safe_divide(10, 3))\nprint(safe_divide(10, 0))\nprint(safe_divide(10, 0, 0))", "hints": ["isinstance(x, (int, float)) checks both types at once", "a % b == 0 checks if b divides a evenly", "Return int(result) for exact integer results"], "difficulty": "medium"},
    "hard": {"title": "Statistics Calculator", "description": "Write a class 'Stats' that accepts a list of numbers and provides:\n- mean(): arithmetic mean\n- median(): middle value (sort and pick middle; average two middles if even count)\n- mode(): most frequent value (return list of all modes if tie)\n- variance(): population variance (mean of squared deviations)\n- std_dev(): standard deviation (square root of variance)\n\nDo not import statistics module — implement from scratch.", "starterCode": "class Stats:\n    def __init__(self, data):\n        self.data = list(data)\n    \n    def mean(self):\n        pass\n    \n    def median(self):\n        pass\n    \n    def mode(self):\n        pass\n    \n    def variance(self):\n        pass\n    \n    def std_dev(self):\n        pass\n\ns = Stats([4, 1, 2, 2, 3, 5, 2])\nprint(s.mean())\nprint(s.median())\nprint(s.mode())\n", "solution": "import math\n\nclass Stats:\n    def __init__(self, data):\n        self.data = list(data)\n    \n    def mean(self):\n        return sum(self.data) / len(self.data)\n    \n    def median(self):\n        s = sorted(self.data)\n        n = len(s)\n        mid = n // 2\n        return s[mid] if n % 2 else (s[mid-1] + s[mid]) / 2\n    \n    def mode(self):\n        counts = {}\n        for x in self.data:\n            counts[x] = counts.get(x, 0) + 1\n        max_count = max(counts.values())\n        return [k for k, v in counts.items() if v == max_count]\n    \n    def variance(self):\n        m = self.mean()\n        return sum((x - m)**2 for x in self.data) / len(self.data)\n    \n    def std_dev(self):\n        return math.sqrt(self.variance())\n\ns = Stats([4, 1, 2, 2, 3, 5, 2])\nprint(f'Mean: {s.mean():.2f}')\nprint(f'Median: {s.median()}')\nprint(f'Mode: {s.mode()}')\nprint(f'StdDev: {s.std_dev():.4f}')", "hints": ["sorted() returns a new sorted list", "Count occurrences with a dict: counts[x] = counts.get(x, 0) + 1", "Variance: average of squared differences from mean", "math.sqrt() for standard deviation"], "difficulty": "hard"},
    "debugging": {"title": "Fix the Calculator", "description": "This calculator has 3 numeric bugs.", "buggyCode": "# Bug 1: Integer division when float needed\ntotal = 10 + 5 + 7\naverage = total / 3   # Actually this is fine in Python 3, but the intent:\n# However, this version:\ndef avg_int(nums):\n    return sum(nums) // len(nums)  # BUG: floor division loses decimals\nprint(avg_int([1, 2, 4]))  # prints 2 instead of 2.333...\n\n# Bug 2: Float comparison\nprice = 0.1 + 0.2 + 0.3\nif price == 0.6:  # BUG: False due to float precision\n    print('Price is 60 cents')\n\n# Bug 3: Wrong type for money\nfrom decimal import Decimal\ntax_rate = 0.08  # BUG: float, loses precision\ntotal = Decimal('19.99') * tax_rate  # TypeError!", "fixedCode": "# Fix 1: Use true division (/) not floor division (//) for averages\ndef avg_int(nums):\n    return sum(nums) / len(nums)   # true division, always float\nprint(avg_int([1, 2, 4]))  # 2.3333...\n\n# Fix 2: Use math.isclose() for float comparison\nimport math\nprice = 0.1 + 0.2 + 0.3\nif math.isclose(price, 0.6):\n    print('Price is 60 cents')\n\n# Fix 3: Use Decimal for the rate too\nfrom decimal import Decimal\ntax_rate = Decimal('0.08')         # Decimal, not float\ntotal = Decimal('19.99') * tax_rate  # Works correctly", "bugs": ["// (floor division) truncates the decimal part — use / for averages that should be floats.", "Float equality with == is unreliable due to IEEE 754 precision. Use math.isclose(a, b) for float comparisons.", "Multiplying Decimal by a float raises TypeError. The tax rate must also be a Decimal: Decimal('0.08')."]}
})

wjson(M, L, 'interview.json', {
    "questions": [
        {"question": "Why does 0.1 + 0.2 != 0.3 in Python? How do you handle floating point comparisons in production code?", "answer": "IEEE 754 double-precision stores numbers in binary (base 2). 0.1 has no exact finite binary representation — like 1/3 has no exact decimal representation. The nearest 64-bit double to 0.1 is 0.1000000000000000055511151231257827021181583404541015625. Adding 0.1 and 0.2 accumulates rounding errors, giving 0.30000000000000004. In production: use math.isclose(a, b, rel_tol=1e-9) for comparisons; use the decimal module for financial calculations; use integer cents (store 1999 instead of 19.99).", "level": "intermediate", "followUp": "When would you use Decimal vs Fraction vs float?"},
        {"question": "What is the difference between // and / in Python 3?", "answer": "/ (true division) always returns a float: 4/2 = 2.0, 7/2 = 3.5. // (floor division) returns the largest integer ≤ the true quotient: 7//2 = 3, 7.0//2 = 3.0. For negative numbers, floor division rounds toward negative infinity: -7//2 = -4 (not -3). int(-7/2) = -3 (truncates toward zero). This difference matters for ceiling division: -(-a//b) gives ceiling division. Python 2 used integer division for int/int — Python 3 changed this (PEP 238).", "level": "intermediate", "followUp": "How do you implement ceiling integer division without importing math?"}
    ]
})

wjson(M, L, 'project.json', {
    "title": "Currency Calculator", "tagline": "Build a precise financial calculator",
    "description": "Build a currency calculator that handles common monetary operations with exact decimal arithmetic.",
    "learningGoals": ["Use the decimal module for exact arithmetic", "Handle formatting for currency display", "Implement common financial calculations"],
    "requirements": ["Define a Money class that stores amount as Decimal and currency code as str", "Implement __add__, __sub__, __mul__ (by a scalar), and __repr__", "add_tax(rate_percent): returns new Money with tax added", "split(n): splits amount into n equal parts (distributing any rounding remainder to first part)", "Display with 2 decimal places and currency symbol"],
    "starterCode": "from decimal import Decimal, ROUND_HALF_UP\n\nclass Money:\n    def __init__(self, amount, currency='USD'):\n        self.amount = Decimal(str(amount)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)\n        self.currency = currency\n    \n    def __repr__(self):\n        pass\n    \n    def __add__(self, other):\n        pass\n    \n    def add_tax(self, rate_percent):\n        pass\n    \n    def split(self, n):\n        pass\n\nprice = Money(19.99)\nprint(price)\nprint(price.add_tax(8))\nparts = price.split(3)\nprint(parts)\n",
    "solution": "from decimal import Decimal, ROUND_HALF_UP\n\nclass Money:\n    SYMBOLS = {'USD': '$', 'EUR': '€', 'GBP': '£'}\n    \n    def __init__(self, amount, currency='USD'):\n        self.amount = Decimal(str(amount)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)\n        self.currency = currency\n    \n    def __repr__(self):\n        sym = self.SYMBOLS.get(self.currency, self.currency)\n        return f'{sym}{self.amount}'\n    \n    def __add__(self, other):\n        if self.currency != other.currency:\n            raise ValueError('Cannot add different currencies')\n        return Money(self.amount + other.amount, self.currency)\n    \n    def add_tax(self, rate_percent):\n        rate = Decimal(str(rate_percent)) / 100\n        tax = (self.amount * rate).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)\n        return Money(self.amount + tax, self.currency)\n    \n    def split(self, n):\n        each = (self.amount / n).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)\n        remainder = self.amount - each * n\n        parts = [Money(each + remainder, self.currency)] + [Money(each, self.currency)] * (n - 1)\n        return parts\n\nprice = Money(19.99)\nprint(price)\nprint(price.add_tax(8))\nparts = price.split(3)\nprint(parts)",
    "solutionExpl": "Decimal(str(amount)) converts via string to avoid float imprecision. quantize() rounds to 2 decimal places. split() distributes rounding remainder to the first part — a real accounting practice called 'penny rounding'.",
    "expectedOutput": "$19.99\n$21.59\n[$6.67, $6.66, $6.66]",
    "extensions": ["Add currency conversion with exchange rates", "Implement __mul__ (Money * 2) and __truediv__ (Money / 2)", "Add a shopping cart that calculates subtotal, tax, and total"]
})

wjson(M, L, 'revision.json', {
    "summary": "Python has three numeric types: int (arbitrary-precision whole numbers), float (IEEE 754 64-bit decimal), and complex (real + imaginary). Float imprecision is inherent to binary representation — use math.isclose() for comparisons and the decimal module for exact arithmetic. int has no overflow. / always returns float; // returns integer (floor).",
    "oneLineSummary": "int: unlimited precision; float: ~15 significant digits (use math.isclose for comparisons); decimal: exact; money → always use Decimal.",
    "keyTakeaways": ["Python ints have no size limit — no overflow", "/ always returns float in Python 3 (even 4/2 = 2.0)", "// is floor division (rounds toward -inf)", "0.1 + 0.2 != 0.3 — use math.isclose() for float comparison", "Decimal module for exact monetary arithmetic", "int() truncates toward zero, round() rounds mathematically"],
    "memoryTricks": [{"concept": "Float precision", "trick": "Imagine 0.1 written in binary: 0.0001100110011... (never ends). Your computer cuts it off. The cut-off errors compound."}],
    "commonErrors": [
        {"error": "0.1 + 0.2 == 0.3 → False", "cause": "Binary floating point cannot represent 0.1 exactly", "fix": "Use math.isclose(0.1+0.2, 0.3)"},
        {"error": "int('3.14') → ValueError", "cause": "int() cannot convert a string with a decimal point", "fix": "Use int(float('3.14')) or int(Decimal('3.14'))"}
    ],
    "preInterviewChecklist": ["Explain IEEE 754 float precision issue and fix", "Difference between / and // in Python 3", "When to use decimal module", "Python int is arbitrary-precision — no overflow"],
    "nextTopics": [{"title": "Strings and Booleans", "whyNext": "With numbers covered, learn Python's text handling (str) and logical values (bool)."}]
})

wjson(M, L, 'cheatsheet.json', {
    "printNote": "Python numeric types quick reference.",
    "sections": [
        {"heading": "Numeric Literals", "entries": [
            {"syntax": "int", "example": "42, -17, 1_000_000, 0b1010, 0xFF, 0o17", "description": "Integer: whole numbers, arbitrary precision. Underscores for readability. Prefix: 0b=binary, 0x=hex, 0o=octal", "commonMistake": "0b, 0x, 0o create ints, not strings"},
            {"syntax": "float", "example": "3.14, -0.5, 1e10, 2.5e-3", "description": "64-bit IEEE 754. Scientific notation with e.", "commonMistake": "float cannot represent all decimals exactly — 0.1 is approximate"},
            {"syntax": "complex", "example": "3+4j, 1j, complex(2, -1)", "description": "Real + imaginary. 'j' suffix for imaginary part.", "commonMistake": "Must have a number before j: 1j, not j (which is a variable name)"}
        ]},
        {"heading": "Arithmetic Operators", "entries": [
            {"syntax": "/", "example": "7 / 2  →  3.5", "description": "True division — always returns float", "commonMistake": "10 / 2 = 5.0 (not 5) in Python 3"},
            {"syntax": "//", "example": "7 // 2  →  3\n-7 // 2  →  -4", "description": "Floor division — rounds toward negative infinity", "commonMistake": "int(-7/2) = -3 (truncates), -7 // 2 = -4 (floors) — different!"},
            {"syntax": "%", "example": "17 % 5  →  2", "description": "Modulo (remainder)", "commonMistake": "In Python, -7 % 3 = 2 (not -1) — result has sign of divisor"},
            {"syntax": "**", "example": "2 ** 10  →  1024", "description": "Exponentiation", "commonMistake": "2 ** -1 = 0.5 (float) — negative exponents return float"}
        ]},
        {"heading": "Numeric Functions", "entries": [
            {"syntax": "abs(x)", "example": "abs(-42)  →  42", "description": "Absolute value", "commonMistake": "Works on complex too: abs(3+4j) = 5.0"},
            {"syntax": "round(x, n)", "example": "round(3.14159, 2)  →  3.14", "description": "Round to n decimal places (banker's rounding)", "commonMistake": "round(0.5) = 0, round(1.5) = 2 — Python uses banker's rounding (round half to even)"},
            {"syntax": "divmod(a, b)", "example": "divmod(17, 5)  →  (3, 2)", "description": "Returns (quotient, remainder) tuple", "commonMistake": "Same as (a // b, a % b) but computed in one step"},
            {"syntax": "math.isclose(a, b)", "example": "math.isclose(0.1+0.2, 0.3)  →  True", "description": "Safe float comparison with tolerance", "commonMistake": "Never compare floats with == — use isclose()"}
        ]}
    ]
})

wjson(M, L, 'resources.json', {"links": [
    {"type": "official", "title": "Python Numeric Types", "url": "https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex"},
    {"type": "official", "title": "decimal — Decimal fixed point and floating point arithmetic", "url": "https://docs.python.org/3/library/decimal.html"},
    {"type": "official", "title": "math module", "url": "https://docs.python.org/3/library/math.html"},
    {"type": "reference", "title": "IEEE 754 floating point explained (Wikipedia)", "url": "https://en.wikipedia.org/wiki/IEEE_754"}
]})

wjson(M, L, 'videos.json', [{"title": "Integers and Floats - Working with Numeric Data in Python", "video_id": "khKv-8q7YmY", "url": "https://www.youtube.com/watch?v=khKv-8q7YmY", "thumbnail": "https://img.youtube.com/vi/khKv-8q7YmY/maxresdefault.jpg", "channel": "Corey Schafer", "duration": "11m", "description": "Python's int, float, and complex types — arithmetic operators, division, precision issues, and the math module."}])

print("\n✅ variables_core_data_types/numeric_data_types — all files written")
print("\nAll batches complete! Lessons written:\n  - python_interpreter_setup/the_interpreter_flow\n  - variables_core_data_types/dynamic_typing_in_python\n  - variables_core_data_types/numeric_data_types")
