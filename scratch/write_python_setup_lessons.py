#!/usr/bin/env python3
"""
EduNet Python Curriculum Full Content Writer
Writes all Python lesson content files with real, lesson-specific educational material.
Run with: python3 write_full_python_curriculum.py
"""

import json
import os
import sys

CURRICULUM_BASE = os.path.join(os.path.dirname(__file__), '..', 'curriculum', 'python', 'modules')


def write_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  wrote: {os.path.relpath(path, CURRICULUM_BASE)}")


def write_lesson(module_slug, lesson_slug, content):
    base = os.path.join(CURRICULUM_BASE, module_slug, lesson_slug, 'locales', 'en')
    for filename, data in content.items():
        write_json(os.path.join(base, filename), data)


# ══════════════════════════════════════════════════════════════
# MODULE: python_interpreter_setup
# ══════════════════════════════════════════════════════════════

# python_installation — ALREADY WRITTEN
# running_python_scripts — ALREADY WRITTEN (beginner.json)
# the_interpreter_flow — ALREADY WRITTEN (beginner.json)

# Write remaining files for running_python_scripts and the_interpreter_flow

write_lesson('python_interpreter_setup', 'running_python_scripts', {
    'intermediate.json': {
        "deeperExplanation": "When Python runs a script, it doesn't interpret raw text directly. It first parses the source into an Abstract Syntax Tree (AST), then compiles the AST to bytecode (.pyc files stored in __pycache__), and finally executes the bytecode via the CPython virtual machine. The bytecode step explains why Python is faster on subsequent runs — if the .py hasn't changed, Python skips parsing/compilation and loads the cached .pyc directly.\n\nYou can inspect bytecode with the dis module: import dis; dis.dis(your_function). This level of understanding helps when debugging performance-sensitive code.",
        "internalImplementation": "The CPython bytecode is a stack-based VM instruction set. Operations like LOAD_CONST, STORE_NAME, CALL_FUNCTION, RETURN_VALUE are the actual instructions that run your script. These are platform-independent — the same .pyc file runs on Windows, macOS, and Linux as long as the Python version matches.",
        "examples": [
            {
                "code": "# Inspect Python's bytecode for a simple function\nimport dis\n\ndef greet(name):\n    return f'Hello, {name}!'\n\ndis.dis(greet)\n\n# Output shows bytecode instructions:\n# LOAD_CONST, LOAD_FAST, FORMAT_VALUE, RETURN_VALUE, etc.",
                "explanation": "dis.dis() disassembles a function or code object into its bytecode instructions. This is how CPython actually runs your Python code — the human-readable .py is compiled to these VM instructions first."
            },
            {
                "code": "# Shebang line makes a script directly executable on Unix\n#!/usr/bin/env python3\n# ^^ Put this as line 1 of your script\n\nimport sys\nprint(f'Running with Python {sys.version_info.major}.{sys.version_info.minor}')\nprint(f'Arguments: {sys.argv[1:]}')\n\n# Then make executable and run:\n# $ chmod +x myscript.py\n# $ ./myscript.py arg1 arg2",
                "explanation": "The shebang (#!) is a Unix feature: when the OS sees #!/usr/bin/env python3 as the first line, it routes the file to python3 automatically. This lets you run './script.py' instead of 'python3 script.py'. The env command finds python3 in PATH, which correctly handles virtual environments."
            }
        ],
        "performanceConsiderations": {
            "timeComplexity": "Python script startup time is 20–100ms for a trivial script. Each import adds time. Import caching via .pyc bytecode reduces subsequent import time by 30–50%.",
            "spaceComplexity": "Each .py file generates a .pyc bytecode cache in __pycache__. The bytecode is roughly 2-4x larger than the source. Delete __pycache__ directories freely — Python regenerates them automatically."
        },
        "debuggingWalkthrough": {
            "bugDescription": "Script fails with 'SyntaxError: Non-UTF-8 code starting with ...' when containing special characters",
            "incorrectCode": "# No encoding declaration\nname = 'Ünïcödé name'   # SyntaxError in Python 2",
            "correctCode": "# Python 3 defaults to UTF-8 — no declaration needed\n# But if you need to be explicit:\n# -*- coding: utf-8 -*-\n\nname = 'Ünïcödé name'   # Works fine in Python 3"
        },
        "bestPractices": [
            "Always use 'if __name__ == \"__main__\":' to separate runnable code from importable code",
            "Use sys.argv for command-line arguments in simple scripts; use argparse for complex CLIs",
            "Put all executable code inside functions — only the if __name__ == '__main__': block calls them",
            "Use the shebang (#!/usr/bin/env python3) in executable scripts on Unix/Linux/macOS",
            "Never rely on the script's current working directory — use pathlib.Path(__file__).parent to get the script's directory"
        ]
    },
    'expert.json': {
        "examples": [
            {
                "code": "# Production CLI pattern using argparse\nimport argparse\nimport sys\n\ndef main():\n    parser = argparse.ArgumentParser(\n        description='Process data files',\n        formatter_class=argparse.RawDescriptionHelpFormatter\n    )\n    parser.add_argument('input', help='Input file path')\n    parser.add_argument('-o', '--output', default='output.txt', help='Output file path')\n    parser.add_argument('-v', '--verbose', action='store_true', help='Enable verbose output')\n    parser.add_argument('--version', action='version', version='%(prog)s 1.0')\n    \n    args = parser.parse_args()\n    \n    if args.verbose:\n        print(f'Processing: {args.input}', file=sys.stderr)\n    \n    # Main logic here\n    return 0  # Exit code: 0 = success\n\nif __name__ == '__main__':\n    sys.exit(main())",
                "explanation": "This is the production pattern for Python CLI scripts: argparse handles argument parsing, main() returns an exit code, sys.exit() passes it to the OS, and all output goes through proper streams (stdout for data, stderr for logs). The if __name__ == '__main__': guard ensures main() only runs when executed directly."
            }
        ]
    },
    'quiz.json': {
        "mcqs": [
            {"id": "q1", "question": "What does the '>>> ' prompt in a Python terminal session mean?", "options": ["Python has encountered an error", "Python is ready for interactive input (REPL mode)", "Python is in debug mode", "Python is running a background process"], "answer": 1, "explanation": "The '>>> ' prompt is the Python REPL (Read-Eval-Print Loop) waiting for input. The '...' prompt appears when continuing a multi-line block. This is the standard Python interactive interpreter.", "difficulty": "beginner"},
            {"id": "q2", "question": "What is the '# -*- coding: utf-8 -*-' line at the top of a Python file?", "options": ["A comment that has no effect in Python 3", "An encoding declaration that tells Python how to read the file bytes", "A magic function call to enable Unicode", "A required Python 3 header line"], "answer": 1, "explanation": "In Python 2, the encoding declaration was required for non-ASCII source files. In Python 3, UTF-8 is the default, so this declaration is usually unnecessary. It's still valid and harmless to include, and some tools use it as a hint.", "difficulty": "intermediate"},
            {"id": "q3", "question": "What is __pycache__ and when does Python create it?", "options": ["A directory Python creates when it compiles your .py files to bytecode (.pyc files) for faster subsequent loading", "Python's hidden configuration directory", "A cache of recently imported module names", "A temporary directory deleted when Python exits"], "answer": 0, "explanation": "When Python first imports a .py file, it compiles it to bytecode and caches the result in __pycache__/__name__.cpython-312.pyc. On subsequent imports, Python loads the cached bytecode instead of re-parsing the source, which is faster. You can safely delete __pycache__ — Python will recreate it.", "difficulty": "intermediate"},
            {"id": "q4", "question": "What happens to __name__ when you run a script directly vs when it's imported?", "options": ["Direct run: __name__ = '__main__'; Imported: __name__ = the module filename", "Direct run: __name__ = 'main'; Imported: __name__ = '__imported__'", "Direct run: __name__ = None; Imported: __name__ = the filename", "Direct run: __name__ = '__file__'; Imported: __name__ = '__main__'"], "answer": 0, "explanation": "When you run 'python3 script.py', Python sets __name__ = '__main__'. When another file does 'import script', Python sets __name__ = 'script'. This is why 'if __name__ == \"__main__\":' is the standard guard for code that should only run when a script is executed directly, not when imported.", "difficulty": "intermediate"},
            {"id": "q5", "question": "What is the purpose of 'sys.argv' in a Python script?", "options": ["A list of command-line arguments passed to the script when it was run", "The Python version information", "The list of installed modules", "The current working directory"], "answer": 0, "explanation": "sys.argv is a list where argv[0] is the script name and argv[1:] are any arguments passed on the command line. For example, 'python3 greet.py Alice 25' gives sys.argv = ['greet.py', 'Alice', '25'].", "difficulty": "beginner"},
            {"id": "q6", "question": "What does 'python3 -m module_name' do?", "options": ["Runs the module as a script (executes its __main__ block), finding it via sys.path", "Imports the module into memory without running it", "Lists all functions in the module", "Compiles the module to bytecode"], "answer": 0, "explanation": "The -m flag tells Python to find the named module in sys.path and run it as a __main__ script. 'python3 -m venv .venv' runs the venv module. 'python3 -m http.server' starts a web server. This ensures the correct Python's module is used.", "difficulty": "intermediate"},
            {"id": "q7", "question": "Why is it bad practice to name your Python file 'os.py' or 'math.py'?", "options": ["It shadows Python's built-in standard library module of the same name, causing ImportError when you try to import the real one", "Python will refuse to run files with those names", "Those filenames are reserved by the Python runtime", "The files won't be found by the interpreter"], "answer": 0, "explanation": "Python searches for modules in sys.path, starting with the current directory. If you have a file called math.py in the same directory as your code, 'import math' will import YOUR file instead of Python's standard library math module. This causes confusing errors. Always use unique, project-specific names.", "difficulty": "intermediate"}
        ],
        "checkpoints": [
            {"id": "cp1", "question": "True or False: In the Python REPL, you must use print() to see the value of an expression.", "answer": False, "explanation": "False. The REPL automatically prints the value of expressions that aren't assignments. Just type '2 + 2' and press Enter — the REPL prints '4'. However, in script files (.py), you DO need print() to see output."},
            {"id": "cp2", "question": "True or False: Variables defined in a REPL session are saved automatically when you exit().", "answer": False, "explanation": "False. All variables and code typed in a REPL session exist only in memory and are lost when you exit. To save your work, copy important code into a .py file."}
        ]
    },
    'practice.json': {
        "easy": {
            "title": "Script with User Arguments",
            "description": "Write a Python script 'calculator.py' that takes two numbers as command-line arguments and prints their sum.\n\nThe script should:\n1. Read the two numbers from sys.argv[1] and sys.argv[2]\n2. Convert them to float\n3. Print: 'Sum: {result}'\n4. If not enough arguments, print: 'Usage: python3 calculator.py num1 num2'\n\nRun it as: python3 calculator.py 3.5 2.1",
            "starterCode": "import sys\n\n# Check argument count\n# Read and convert arguments\n# Print the result\n",
            "expectedOutput": "Sum: 5.6",
            "solution": "import sys\n\nif len(sys.argv) < 3:\n    print('Usage: python3 calculator.py num1 num2')\n    sys.exit(1)\n\na = float(sys.argv[1])\nb = float(sys.argv[2])\nprint(f'Sum: {a + b}')",
            "hints": ["sys.argv[0] is the script name, sys.argv[1] is the first argument", "sys.argv elements are strings — convert with float()", "len(sys.argv) checks how many arguments were given"],
            "difficulty": "easy"
        },
        "medium": {
            "title": "Module Guard Pattern",
            "description": "Write two files:\n\n1. 'utils.py': Define a function greet(name) that returns 'Hello, {name}!'. Also add: if __name__ == '__main__': print(greet('World')) at the bottom.\n\n2. 'main.py': Import greet from utils and call it with a name from sys.argv[1].\n\nVerify: running 'python3 utils.py' should print 'Hello, World!'. Running 'python3 main.py Alice' should print 'Hello, Alice!'.",
            "starterCode": "# utils.py\ndef greet(name):\n    pass\n\n# Add the __name__ guard here\n\n# ─────────────────\n# main.py\nimport sys\n# from utils import greet\n\n# Get name from sys.argv[1] and call greet\n",
            "expectedOutput": "Hello, Alice!",
            "solution": "# utils.py:\ndef greet(name):\n    return f'Hello, {name}!'\n\nif __name__ == '__main__':\n    print(greet('World'))\n\n# main.py:\nimport sys\nfrom utils import greet\n\nif len(sys.argv) > 1:\n    print(greet(sys.argv[1]))\nelse:\n    print('Usage: python3 main.py <name>')",
            "hints": ["if __name__ == '__main__': runs only when the file is executed directly", "from utils import greet imports the function (not the __main__ block)", "sys.argv[1] is the first command-line argument"],
            "difficulty": "medium"
        },
        "hard": {
            "title": "Mini Task Runner",
            "description": "Write a script 'run.py' that works like a simple task runner. It should:\n1. Accept a task name as sys.argv[1]\n2. Support tasks: 'hello' (prints 'Hello from Python!'), 'info' (prints Python version and OS platform), 'check' (prints whether sys.argv[2] is an int, float, or string)\n3. For unknown tasks, print 'Unknown task: {name}' and list available tasks\n4. For missing arguments, print usage instructions",
            "starterCode": "import sys\n\ndef task_hello():\n    pass\n\ndef task_info():\n    pass\n\ndef task_check(value):\n    pass\n\n# Route to correct task based on sys.argv\n",
            "expectedOutput": "$ python3 run.py hello\nHello from Python!\n\n$ python3 run.py info\nPython 3.12.0\nPlatform: linux\n\n$ python3 run.py check 42\n'42' looks like: int",
            "solution": "import sys\n\ndef task_hello():\n    print('Hello from Python!')\n\ndef task_info():\n    import platform\n    print(f'Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}')\n    print(f'Platform: {sys.platform}')\n\ndef task_check(value):\n    try:\n        int(value)\n        print(f\"'{value}' looks like: int\")\n        return\n    except ValueError:\n        pass\n    try:\n        float(value)\n        print(f\"'{value}' looks like: float\")\n        return\n    except ValueError:\n        pass\n    print(f\"'{value}' looks like: string\")\n\nTASKS = {\n    'hello': lambda: task_hello(),\n    'info': lambda: task_info(),\n    'check': lambda: task_check(sys.argv[2] if len(sys.argv) > 2 else ''),\n}\n\nif len(sys.argv) < 2:\n    print('Usage: python3 run.py <task>')\n    print(f'Available tasks: {\", \".join(TASKS)}')\n    sys.exit(1)\n\ntask_name = sys.argv[1]\nif task_name in TASKS:\n    TASKS[task_name]()\nelse:\n    print(f'Unknown task: {task_name}')\n    print(f'Available tasks: {\", \".join(TASKS)}')",
            "hints": ["Use a dictionary mapping task names to functions", "try/except ValueError is how you test if a string can be converted to int/float", "sys.exit(1) signals an error exit to the calling shell"],
            "difficulty": "hard"
        },
        "debugging": {
            "title": "Fix the Script Runner",
            "description": "This script has 3 bugs.",
            "buggyCode": "import sys\n\n# Bug 1: Wrong index for first argument\nscript_name = sys.argv[1]  # should be 0\n\n# Bug 2: Comparison uses = instead of ==\nif __name__ = '__main__':\n    print('Running directly')\n\n# Bug 3: Missing conversion from string to number\nnum = sys.argv[1]\nresult = num + 10  # TypeError: can't add str and int",
            "fixedCode": "import sys\n\n# Fix 1: argv[0] is the script name\nscript_name = sys.argv[0]   # correct index\n\n# Fix 2: Use == for comparison\nif __name__ == '__main__':\n    print('Running directly')\n\n# Fix 3: Convert string to number\nnum = int(sys.argv[1])   # convert first\nresult = num + 10",
            "bugs": ["sys.argv[0] is the script name, argv[1] is the first user argument", "if __name__ = '__main__': uses = (assignment) which is a SyntaxError. Must use == (comparison).", "sys.argv elements are always strings. You must convert with int() or float() before doing arithmetic."]
        }
    },
    'interview.json': {
        "questions": [
            {"question": "What is the Python REPL and when would you use it over writing a script?", "answer": "REPL stands for Read-Eval-Print Loop — the interactive Python interpreter started by typing 'python3' in a terminal. It reads input, evaluates it, prints the result, and loops. It's ideal for: (1) Quickly testing a function or expression, (2) Exploring an API or library, (3) Debugging — pasting problematic code and testing it in isolation, (4) Data exploration (Python's primary use in data science). Scripts are better when: code needs to be repeatable, shareable, or longer than a few lines.", "level": "beginner", "followUp": "What is Jupyter Notebook and how does it relate to the REPL?"},
            {"question": "Explain why the pattern 'if __name__ == \"__main__\":' exists and why every Python script should use it.", "answer": "When Python runs a file directly (python3 foo.py), it sets __name__ = '__main__'. When another file imports it (import foo), Python sets __name__ = 'foo'. Without the guard, any code at module level runs both when executed directly AND when imported. This causes side effects on import. The guard ensures demonstration/test code and entry points only run when the file is the main script, not when it's used as a library module.", "level": "intermediate", "followUp": "What would break in a library module that doesn't use this guard?"}
        ]
    },
    'project.json': {
        "title": "Personal Python CLI Tool", "tagline": "Build a useful command-line utility",
        "description": "Create a script 'tools.py' that serves as a personal utility CLI. It should support multiple sub-commands and demonstrate proper Python script conventions.",
        "learningGoals": ["Use sys.argv for command routing", "Apply the __name__ == '__main__' guard", "Structure a script with multiple functions", "Handle errors gracefully"],
        "requirements": ["Support sub-command 'count': count words in a given string (passed as argument)", "Support sub-command 'reverse': reverse a given string", "Support sub-command 'upper': uppercase a given string", "Show usage help if no arguments given", "Exit with code 1 on errors, 0 on success"],
        "starterCode": "import sys\n\ndef cmd_count(text):\n    pass\n\ndef cmd_reverse(text):\n    pass\n\ndef cmd_upper(text):\n    pass\n\nCOMMANDS = {\n    'count': cmd_count,\n    'reverse': cmd_reverse,\n    'upper': cmd_upper,\n}\n\nif __name__ == '__main__':\n    # Parse and route sub-commands\n    pass\n",
        "solution": "import sys\n\ndef cmd_count(text):\n    words = text.split()\n    print(f'Word count: {len(words)}')\n\ndef cmd_reverse(text):\n    print(text[::-1])\n\ndef cmd_upper(text):\n    print(text.upper())\n\nCOMMANDS = {\n    'count': cmd_count,\n    'reverse': cmd_reverse,\n    'upper': cmd_upper,\n}\n\nif __name__ == '__main__':\n    if len(sys.argv) < 3:\n        print('Usage: python3 tools.py <command> <text>')\n        print(f'Commands: {\", \".join(COMMANDS)}')\n        sys.exit(1)\n    \n    cmd = sys.argv[1]\n    text = ' '.join(sys.argv[2:])\n    \n    if cmd not in COMMANDS:\n        print(f'Unknown command: {cmd}')\n        sys.exit(1)\n    \n    COMMANDS[cmd](text)\n    sys.exit(0)",
        "solutionExpl": "The COMMANDS dictionary maps command names to functions — this is the 'dispatch table' pattern, a cleaner alternative to if/elif chains. ' '.join(sys.argv[2:]) handles multi-word input by joining all remaining arguments.",
        "expectedOutput": "$ python3 tools.py count hello world Python\nWord count: 3\n\n$ python3 tools.py reverse Python\nnohtyP\n\n$ python3 tools.py upper hello world\nHELLO WORLD",
        "extensions": ["Add a 'stats' command that counts words, characters, and lines", "Read input from a file instead of command line", "Add --help flag support"]
    },
    'revision.json': {
        "summary": "Python scripts are .py files executed with 'python3 filename.py'. Python compiles source to bytecode (.pyc in __pycache__) for faster loading. sys.argv contains command-line arguments. The REPL (python3 with no arguments) runs interactive Python sessions. __name__ == '__main__' is the guard that separates runnable script code from importable module code.",
        "oneLineSummary": "Python reads your .py file top-to-bottom, compiles to bytecode, and executes it; use __name__ == '__main__' to protect entry-point code.",
        "keyTakeaways": ["Run scripts with: python3 script.py", "sys.argv is a list where [0]=script name, [1+]=arguments", "REPL auto-prints expressions; scripts need explicit print()", "__name__ == '__main__' only True when run directly, not when imported", "Python caches bytecode in __pycache__/*.pyc for performance", "Never name scripts after standard library modules (os.py, math.py)"],
        "memoryTricks": [{"concept": "__name__ == '__main__'", "trick": "Think: 'Am I the main character or a supporting character?' If you're run directly, you're the main character (__name__ == '__main__'). If you're imported, you play a supporting role."}],
        "commonErrors": [
            {"error": "ModuleNotFoundError: No module named 'xyz'", "cause": "Named your script the same as a standard library module (e.g., random.py)", "fix": "Rename your script to something unique"},
            {"error": "IndexError: list index out of range on sys.argv[1]", "cause": "Accessing sys.argv[1] but no arguments were passed", "fix": "Check len(sys.argv) > 1 before accessing sys.argv[1]"}
        ],
        "preInterviewChecklist": ["Explain __name__ == '__main__' and why it matters", "Describe sys.argv structure", "Explain the REPL vs script differences"],
        "nextTopics": [{"title": "Variables & Data Types", "whyNext": "With Python running, learn the fundamental building blocks: variables and the types of data Python can store."}]
    },
    'cheatsheet.json': {
        "printNote": "Quick reference for running Python scripts and using the REPL.",
        "sections": [
            {
                "heading": "Running Scripts",
                "entries": [
                    {"syntax": "python3 script.py", "example": "$ python3 hello.py", "description": "Run a Python script file", "commonMistake": "Running from wrong directory — use cd to navigate first"},
                    {"syntax": "python3 script.py arg1 arg2", "example": "$ python3 greet.py Alice 25", "description": "Pass command-line arguments", "commonMistake": "Forgetting sys.argv elements are strings — convert with int() or float()"},
                    {"syntax": "python3 -c 'code'", "example": "$ python3 -c 'print(2+2)'", "description": "Run inline Python expression", "commonMistake": "Quote conflicts — use double quotes outside if single quotes inside"},
                    {"syntax": "python3 -m module", "example": "$ python3 -m http.server", "description": "Run a module as a script", "commonMistake": "Confusing module name with filename — use 'http.server' not 'http/server.py'"}
                ]
            },
            {
                "heading": "Script Conventions",
                "entries": [
                    {"syntax": "if __name__ == '__main__':", "example": "if __name__ == '__main__':\n    main()", "description": "Entry point guard — code only runs when file is executed directly", "commonMistake": "Forgetting the double underscores: __main__ not _main_"},
                    {"syntax": "sys.argv", "example": "name = sys.argv[1]  # first argument", "description": "List of command-line arguments", "commonMistake": "argv[0] is the script name, not the first user argument"}
                ]
            }
        ]
    },
    'resources.json': {
        "links": [
            {"type": "official", "title": "Python REPL — Python Docs", "url": "https://docs.python.org/3/tutorial/interpreter.html"},
            {"type": "official", "title": "sys.argv — Python Docs", "url": "https://docs.python.org/3/library/sys.html#sys.argv"},
            {"type": "official", "title": "argparse — Command-Line Parser", "url": "https://docs.python.org/3/library/argparse.html"}
        ]
    },
    'videos.json': [{"title": "Python Scripts and Command Line Arguments", "video_id": "kWBWrdiFr6M", "url": "https://www.youtube.com/watch?v=kWBWrdiFr6M", "thumbnail": "https://img.youtube.com/vi/kWBWrdiFr6M/maxresdefault.jpg", "channel": "Corey Schafer", "duration": "8m", "description": "Running Python scripts, command-line arguments with sys.argv, and the __name__ == '__main__' pattern."}]
})

# ══════════════════════════════════════════════════════════════
# CONFIRMATION
# ══════════════════════════════════════════════════════════════

print("\n✅ python_interpreter_setup/running_python_scripts — all files written")
print("   Next: write the_interpreter_flow remaining files and variables module")
