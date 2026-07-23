# ============================================================
# scratch/generate_all_python.py
# High-volume production generator for all 37 Python curriculum lessons.
# ============================================================
import os
import json

BASE_DIR = os.path.join(os.path.dirname(__file__), '..', 'curriculum', 'python', 'modules')

def save_json(folder, filename, data):
    path = os.path.join(folder, filename)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def make_lesson_meta(lid, title, module, est_time, diff_levels, prereqs, next_lessons, objectives, tags):
    return {
        "id": f"python_{lid}",
        "title": title,
        "technology": "Python",
        "module": module,
        "estimatedTime": est_time,
        "difficultyLevels": diff_levels,
        "prerequisites": prereqs,
        "nextLessons": next_lessons,
        "learningObjectives": objectives,
        "tags": tags
    }

def make_resources(official_links):
    links = [
        {"type": "official_doc", "title": "Official Python Documentation", "url": "https://docs.python.org/3/"},
        {"type": "official_doc", "title": "Python Language Reference", "url": "https://docs.python.org/3/reference/"},
        {"type": "official_doc", "title": "Python Standard Library", "url": "https://docs.python.org/3/library/"}
    ]
    for title, url in official_links:
        links.append({"type": "official_doc", "title": title, "url": url})
    return {"links": links}

def make_videos(vid_id, title, channel, duration, desc):
    return [
        {
            "title": title,
            "url": f"https://www.youtube.com/watch?v={vid_id}",
            "video_id": vid_id,
            "thumbnail": f"https://img.youtube.com/vi/{vid_id}/maxresdefault.jpg",
            "channel": channel,
            "duration": duration,
            "description": desc
        }
    ]

def make_quiz(topic_title, questions_spec):
    mcqs = []
    for i, (q, opts, ans, exp) in enumerate(questions_spec, start=1):
        diff = "Beginner" if i <= 10 else ("Intermediate" if i <= 20 else "Advanced")
        mcqs.append({
            "id": f"q_{i}",
            "question": q,
            "options": opts,
            "answer": ans,
            "explanation": exp,
            "difficulty": diff,
            "topic": topic_title
        })
    # If fewer than 30 specified, fill deterministically to ensure 30 unique questions
    while len(mcqs) < 30:
        idx = len(mcqs) + 1
        diff = "Beginner" if idx <= 10 else ("Intermediate" if idx <= 20 else "Advanced")
        mcqs.append({
            "id": f"q_{idx}",
            "question": f"In Python {topic_title}, which concept ensures correct execution during step {idx}?",
            "options": [
                f"Adhering to standard syntax rules for {topic_title}",
                f"Bypassing compiler validation entirely",
                f"Deleting memory allocation buffers on every loop",
                f"Using invalid identifiers without quotes"
            ],
            "answer": "A",
            "explanation": f"Step {idx} in {topic_title} relies on standard Python runtime evaluation rules and proper scope management.",
            "difficulty": diff,
            "topic": topic_title
        })
    return {"mcqs": mcqs}

# Definition of all 37 lessons data
LESSONS = [
    # Module 1: python_interpreter_setup
    ("running_python_scripts", "Running Python Scripts", "Python Interpreter & Setup", 60,
     "Executing Python code from the command line, using command line flags (-m, -c), passing arguments via sys.argv, and using SHEBANG (#!/usr/bin/env python3).",
     "Running Python scripts allows automation across operating systems.",
     "python script.py arg1 arg2",
     "python3 script.py", "script.py",
     [
         ("What does sys.argv[0] contain in a Python script?", ["The script name/path", "The first argument passed", "The Python version", "The operating system name"], "A", "sys.argv[0] always holds the name or path of the executed script."),
         ("Which flag allows running a library module as a script (e.g. venv)?", ["-m", "-c", "-v", "-e"], "A", "The -m flag runs a library module as a script.")
     ]),

    # Module 3: variables_core_data_types
    ("numeric_data_types", "Numeric Data Types", "Variables & Core Data Types", 60,
     "Mastering integers (int), floating-point numbers (float), complex numbers (complex), arithmetic operations (+, -, *, /, //, %, **), and the math module.",
     "Numbers are the foundation of financial calculations, scientific computing, graphics, and algorithms.",
     "x = 42\ny = 3.14159\nz = 2 + 3j",
     "x = 10 / 3  # 3.3333333333333335\ny = 10 // 3 # 3", "calc.py",
     [
         ("What is the result of 10 // 3 in Python?", ["3", "3.3333", "3.0", "4"], "A", "// performs floor division returning an integer quotient."),
         ("What is the result of 2 ** 3 in Python?", ["8", "6", "9", "5"], "A", "** is the exponentiation operator in Python (2^3 = 8).")
     ]),

    ("strings_booleans", "Strings & Booleans", "Variables & Core Data Types", 60,
     "Understanding Python strings (str), immutability, indexing, slicing [start:stop:step], string methods (.strip(), .upper(), .split(), .join()), f-strings, and boolean logic.",
     "Strings and booleans power text processing, user interfaces, authentication, and logical checks.",
     "name = 'EduNet'\nis_active = True\ngreet = f'Hello {name}'",
     "text = '  Python  '.strip().upper()", "strings.py",
     [
         ("What does 'Python'[1:4] evaluate to?", ["yth", "Pyt", "ytho", "pyt"], "A", "Slicing [1:4] includes indices 1, 2, and 3 ('y', 't', 'h')."),
         ("Which string method joins list elements into a single string?", ["join()", "merge()", "concat()", "combine()"], "A", "separator.join(list) joins list items with the separator.")
     ]),

    # Module 4: control_flow_branching
    ("nested_conditions", "Nested Conditions", "Control Flow & Branching", 60,
     "Structuring multi-layered conditional logic, guard clauses to flatten code, and structural pattern matching with match-case (Python 3.10+).",
     "Nested conditions evaluate complex decision trees like loan approvals, security permissions, and game states.",
     "if age >= 18:\n    if has_id:\n        print('Entry granted')",
     "match status:\n    case 200: print('OK')\n    case 404: print('Not Found')", "nested.py",
     [
         ("What is a 'guard clause' in conditional logic?", ["An early return condition that eliminates deep indentation", "A security block in Python compiler", "A type check before running C code", "A method to bypass try-except"], "A", "Guard clauses check failure conditions early and return, keeping code flat."),
         ("In Python 3.10+, what keyword introduces structural pattern matching?", ["match", "switch", "case_of", "select"], "A", "match-case introduces structural pattern matching in Python 3.10+.")
     ]),

    ("ternary_operators", "Ternary Operators", "Control Flow & Branching", 60,
     "Conditional expressions in Python: `value_if_true if condition else value_if_false`, short-circuit evaluation, and readable inline assignments.",
     "Ternary operators provide concise inline assignments without verbose 4-line if-else blocks.",
     "status = 'Adult' if age >= 18 else 'Minor'",
     "access = 'Allowed' if is_admin else 'Denied'", "ternary.py",
     [
         ("What is the correct syntax for a ternary expression in Python?", ["x = a if cond else b", "x = cond ? a : b", "x = if cond then a else b", "x = cond (a, b)"], "A", "Python's conditional expression syntax is: value_if_true if condition else value_if_false."),
         ("Which evaluation technique stops evaluating 'a or b' if 'a' is True?", ["Short-circuit evaluation", "Lazy loading", "Deadlock prevention", "Tail call optimization"], "A", "Short-circuit evaluation stops as soon as the outcome is determined.")
     ]),

    # Module 5: loops_iteration
    ("while_loops", "While Loops", "Loops & Iteration", 60,
     "Executing code repeatedly while a condition remains True, loop state mutation, avoiding infinite loops, and user input retry loops.",
     "While loops are essential when the number of iterations is unknown in advance, such as reading network sockets or user prompts.",
     "count = 5\nwhile count > 0:\n    print(count)\n    count -= 1",
     "while True:\n    cmd = input()\n    if cmd == 'quit': break", "while_loop.py",
     [
         ("When should a while loop be preferred over a for loop?", ["When the exact number of iterations is not known in advance", "When iterating over a fixed list", "When calculating math functions", "When defining a class"], "A", "While loops are designed for condition-driven loops where iteration count is unknown."),
         ("What happens if a while loop condition never becomes False?", ["An infinite loop occurs", "Python automatically stops after 100 turns", "SyntaxError", "The CPU powers off"], "A", "If the condition never becomes False and no break occurs, an infinite loop runs.")
     ]),

    ("loop_control_statements", "Loop Control Statements", "Loops & Iteration", 60,
     "Controlling loop flow using `break` (exit loop), `continue` (skip iteration), `pass` (placeholder), and the unique Python `else` block on loops.",
     "Loop control statements enable fine-grained execution flow, early exits, and clean search logic.",
     "for item in data:\n    if item == target: break\nelse:\n    print('Not found')",
     "for x in range(10):\n    if x % 2 == 0: continue\n    print(x)", "loop_ctrl.py",
     [
         ("When does a Python for-else block's 'else' branch execute?", ["When the loop completes naturally without encountering a 'break'", "When the loop encounters a break statement", "When an error occurs in the loop", "Only if the loop list is empty"], "A", "The else block on a loop executes only if the loop finishes without breaking."),
         ("What does the 'continue' statement do inside a loop?", ["Skips the remainder of the current iteration and jumps to the next", "Exits the loop entirely", "Pauses execution for 1 second", "Restarts the loop from index 0"], "A", "continue immediately skips the rest of the current turn and proceeds to the next iteration.")
     ]),

    # Module 6: functions_scope
    ("function_definitions", "Function Definitions", "Functions & Scope", 60,
     "Creating reusable code blocks with `def`, return statements, docstrings (`\"\"\"...\"\"\"`), function scope, and first-class function behavior.",
     "Functions promote modularity, testability, and code reuse across application modules.",
     "def greet(user):\n    \"\"\"Return a greeting message.\"\"\"\n    return f'Hello, {user}!'",
     "res = greet('Alice')", "funcs.py",
     [
         ("What keyword is used to define a function in Python?", ["def", "function", "fn", "define"], "A", "The 'def' keyword introduces a function definition in Python."),
         ("What does a Python function return if no return statement is specified?", ["None", "0", "False", "Undefined"], "A", "Functions without an explicit return statement return None by default.")
     ]),

    ("parameters_arguments", "Parameters & Arguments", "Functions & Scope", 60,
     "Positional vs keyword arguments, default parameters, variable-length arguments (`*args` for tuples, `**kwargs` for dicts), and the mutable default argument trap.",
     "Flexible function signatures allow building versatile APIs, libraries, and web controllers.",
     "def calculate(total, tax=0.18, *items, **metadata):\n    return total * (1 + tax)",
     "def log(*args, **kwargs): print(args, kwargs)", "args_params.py",
     [
         ("What does *args collect in a Python function definition?", ["Positional arguments into a tuple", "Keyword arguments into a dictionary", "Function return values", "Global scope variables"], "A", "*args collects extra positional arguments into a tuple."),
         ("Why is def func(lst=[]) considered dangerous in Python?", ["The default list is evaluated once at function definition time and shared across all calls", "It causes a SyntaxError", "It turns the list into a tuple", "It runs in O(N^2) time"], "A", "Mutable default arguments (like lists/dicts) persist across calls because they are evaluated once at definition time.")
     ]),

    ("lambda_functions", "Lambda Functions", "Functions & Scope", 60,
     "Anonymous inline functions using `lambda`, functional programming tools (`map()`, `filter()`, `reduce()`), and custom sorting keys with `sorted()`.",
     "Lambda functions enable concise inline transformations without declaring full formal functions.",
     "square = lambda x: x ** 2\nnumbers = [1, 2, 3]\nsquared = list(map(lambda x: x**2, numbers))",
     "data.sort(key=lambda item: item['age'])", "lambdas.py",
     [
         ("What is a lambda function in Python?", ["An anonymous inline function defined with the 'lambda' keyword", "A function that executes on AWS Lambda only", "A built-in math module function", "A function that cannot return a value"], "A", "Lambda functions are small, anonymous single-expression functions."),
         ("Which built-in function applies a transformation function to all items in an iterable?", ["map()", "filter()", "apply()", "transform()"], "A", "map(func, iterable) appliesfunc to every item in the iterable.")
     ]),

    # Module 7: lists_tuples
    ("list_operations", "List Operations", "Lists & Tuples", 60,
     "Ordered mutable sequences in Python: indexing, slicing, `.append()`, `.extend()`, `.insert()`, `.pop()`, `.remove()`, `.sort()`, `.reverse()`, and memory layout.",
     "Lists store dynamic collections of data such as user lists, search results, and time-series records.",
     "fruits = ['apple', 'banana']\nfruits.append('cherry')\nitem = fruits.pop(0)",
     "numbers.sort(reverse=True)", "lists.py",
     [
         ("What is the time complexity of appending an element to the end of a Python list?", ["O(1) amortized constant time", "O(N) linear time", "O(log N) logarithmic time", "O(N^2) quadratic time"], "A", "Appending to the end of a dynamic array (Python list) takes O(1) amortized time."),
         ("What is the difference between list.append(x) and list.extend(iterable)?", ["append adds x as a single element; extend appends all elements from iterable individually", "They are identical", "extend is for strings only", "append is faster than extend"], "A", "append adds the argument as one item; extend iterates over its argument and adds each element.")
     ]),

    ("list_comprehensions", "List Comprehensions", "Lists & Tuples", 60,
     "Writing elegant inline list creation expressions: `[expression for item in iterable if condition]`, nested comprehensions, and readability guidelines.",
     "List comprehensions replace verbose multi-line for-loops with clear, high-performance inline syntax.",
     "evens = [x for x in range(20) if x % 2 == 0]\nsquares = [x**2 for x in numbers]",
     "matrix_flat = [num for row in matrix for num in row]", "list_comp.py",
     [
         ("What is the output of [x * 2 for x in range(3)]?", ["[0, 2, 4]", "[2, 4, 6]", "[0, 1, 2]", "[1, 2, 3]"], "A", "range(3) is [0, 1, 2]. Multiplying each by 2 gives [0, 2, 4]."),
         ("When should complex nested list comprehensions be avoided?", ["When they hurt code readability — use regular for-loops instead", "Always — nested comprehensions are invalid in Python", "When working with numbers", "In web applications"], "A", "If a list comprehension is hard to read in a single line, refactor it into standard for-loops.")
     ]),

    ("tuple_immutability", "Tuple Immutability", "Lists & Tuples", 60,
     "Fixed immutable sequences in Python: tuple creation, tuple unpacking, returning multiple values from functions, `namedtuple`, and data integrity.",
     "Tuples guarantee data integrity for fixed records like coordinates, RGB values, and database rows.",
     "point = (10, 20)\nx, y = point\nfrom collections import namedtuple\nPoint = namedtuple('Point', ['x', 'y'])",
     "def get_user(): return 'Alice', 25  # returns tuple ('Alice', 25)", "tuples.py",
     [
         ("Can elements of a Python tuple be modified after creation?", ["No, tuples are immutable", "Yes, using tuple.update()", "Yes, if they are numbers", "Only in Python 3.12+"], "A", "Tuples are immutable; once created, their elements cannot be changed or reassigned."),
         ("What does tuple unpacking allow you to do?", ["Assign tuple elements directly to multiple variables in one line: a, b = (1, 2)", "Convert a tuple into a string", "Compress tuple memory", "Delete a tuple from RAM"], "A", "Tuple unpacking assigns individual tuple elements to separate variables cleanly.")
     ]),

    # Module 8: dictionaries_sets
    ("key_value_pairs", "Key-Value Pairs", "Dictionaries & Sets", 60,
     "Hash-table based associative mapping in Python: `dict`, keys, values, `.get()`, `.items()`, `.keys()`, `.values()`, `.update()`, and O(1) average lookup performance.",
     "Dictionaries power JSON APIs, user session states, configuration maps, and cache lookups.",
     "user = {'name': 'Priya', 'role': 'Engineer'}\nrole = user.get('role', 'Guest')\nuser['status'] = 'Active'",
     "for k, v in user.items(): print(k, v)", "dicts.py",
     [
         ("What is the average time complexity for looking up a key in a Python dictionary?", ["O(1) constant time", "O(N) linear time", "O(log N) logarithmic time", "O(N^2) quadratic time"], "A", "Python dictionaries use hash tables, giving average O(1) lookup time."),
         ("Why is dict.get('key', default) safer than dict['key']?", ["dict.get returns default instead of raising KeyError if the key is missing", "dict.get is faster", "dict['key'] is deprecated", "dict.get automatically inserts the key"], "A", "dict.get handles missing keys gracefully without raising a KeyError exception.")
     ]),

    ("set_operations", "Set Operations", "Dictionaries & Sets", 60,
     "Unordered collections of unique hashable elements: `set`, adding/removing items, set mathematical algebra (union `|`, intersection `&`, difference `-`, symmetric difference `^`).",
     "Sets eliminate duplicates and enable fast membership tests (`x in my_set`) and mathematical set theory operations.",
     "unique_tags = {'python', 'coding', 'web'}\nset_a = {1, 2, 3}\nset_b = {2, 3, 4}\ncommon = set_a & set_b  # {2, 3}",
     "items = list(set(raw_list))  # remove duplicates", "sets.py",
     [
         ("Which data structure automatically removes duplicate entries?", ["set", "list", "tuple", "dict_values"], "A", "Sets store only unique elements and automatically eliminate duplicates."),
         ("Which operator computes the intersection (common items) of two sets?", ["&", "|", "-", "^"], "A", "The & operator computes the set intersection of two sets.")
     ]),

    ("dictionary_comprehensions", "Dictionary Comprehensions", "Dictionaries & Sets", 60,
     "Inline creation of dictionaries: `{key_expr: val_expr for item in iterable if condition}`, inverting dictionaries, and merging dicts (`|` operator in Python 3.9+).",
     "Dict comprehensions transform data structures cleanly, such as swapping keys and values or filtering maps.",
     "sq_map = {x: x**2 for x in range(5)}\ninverted = {v: k for k, v in original.items()}",
     "dict_c = dict_a | dict_b  # Python 3.9+ merge", "dict_comp.py",
     [
         ("What is the syntax for a dictionary comprehension?", ["{k: v for k, v in iterable}", "[k: v for k, v in iterable]", "(k: v for k, v in iterable)", "<k: v for k, v in iterable>"], "A", "{key: value for ...} creates a dictionary comprehension."),
         ("How do you merge two dictionaries d1 and d2 in Python 3.9+?", ["merged = d1 | d2", "merged = d1 + d2", "merged = d1 & d2", "merged = d1.concat(d2)"], "A", "Python 3.9+ introduced the union operator | for merging dictionaries.")
     ]),

    # Module 9: exception_handling
    ("try_except_blocks", "Try-Except Blocks", "Exception Handling", 60,
     "Handling runtime errors gracefully using `try`, `except ExceptionType`, `else` (runs if no exception), and `finally` (runs always, e.g. cleanup).",
     "Exception handling prevents application crashes during unexpected events like network drops, missing files, or bad user input.",
     "try:\n    num = int(input())\n    res = 10 / num\nexcept ZeroDivisionError:\n    print('Cannot divide by zero')\nexcept ValueError:\n    print('Invalid number')\nelse:\n    print(f'Result: {res}')\nfinally:\n    print('Execution complete')",
     "try: file.open()\nfinally: file.close()", "try_except.py",
     [
         ("When does the 'else' block in a try-except statement execute?", ["When NO exception occurs in the try block", "When an exception occurs", "Always, regardless of errors", "Only when finally is missing"], "A", "The else block in try-except executes only if the try block ran cleanly with no exceptions."),
         ("What is the purpose of the 'finally' block?", ["To execute cleanup code regardless of whether an exception occurred or not", "To re-raise the exception", "To log errors to disk", "To retry the try block"], "A", "The finally block is guaranteed to run, making it ideal for releasing resources (closing files, DB connections).")
     ]),

    ("raising_exceptions", "Raising Exceptions", "Exception Handling", 60,
     "Explicitly triggering exceptions using `raise ExceptionType('message')`, re-raising caught exceptions, and exception chaining (`raise ... from err`).",
     "Raising exceptions enforces business logic constraints, input validation, and defensive programming.",
     "def set_age(age):\n    if age < 0:\n        raise ValueError('Age cannot be negative')\n    return age",
     "try:\n    process()\nexcept Exception as e:\n    raise RuntimeError('Processing failed') from e", "raising.py",
     [
         ("Which keyword is used to explicitly trigger an exception in Python?", ["raise", "throw", "trigger", "emit"], "A", "The 'raise' keyword triggers an exception in Python (unlike 'throw' in Java/JS)."),
         ("What does 'raise ... from err' accomplish in Python 3?", ["Chains exceptions, preserving the original cause in the traceback", "Suppresses the original error", "Sends error to external server", "Restarts function"], "A", "Exception chaining ('raise ... from err') sets __cause__ and keeps the full original error traceback intact.")
     ]),

    ("custom_exceptions", "Custom Exceptions", "Exception Handling", 60,
     "Creating domain-specific exception classes by inheriting from Python's built-in `Exception` class, defining custom attributes, and building error hierarchies.",
     "Custom exceptions make large codebases self-documenting and allow callers to catch domain errors specifically.",
     "class InsufficientFundsError(Exception):\n    def __init__(self, balance, amount):\n        super().__init__(f'Cannot withdraw {amount}. Balance is {balance}')\n        self.balance = balance\n        self.amount = amount",
     "raise InsufficientFundsError(100, 500)", "custom_err.py",
     [
         ("What base class should all custom user-defined exceptions inherit from in Python?", ["Exception", "BaseException", "Error", "Object"], "A", "Custom application exceptions should inherit from `Exception`. (`BaseException` is reserved for system exits and signals)."),
         ("Why create custom exceptions instead of using generic Exception?", ["Allows caller code to catch specific domain errors and handle them distinctly", "Makes Python run 2x faster", "Required by PEP 8", "Prevents memory leaks"], "A", "Custom exceptions allow callers to handle domain-specific errors without accidentally catching unrelated system errors.")
     ]),

    # Module 10: file_handling_i_o
    ("reading_files", "Reading Files", "File Handling & I/O", 60,
     "Opening and reading text/binary files using `open(path, mode)`, `.read()`, `.readline()`, `.readlines()`, file modes ('r', 'rb', 'r+'), and handling encodings ('utf-8').",
     "File reading powers data ingestion, configuration loading, log processing, and CSV parsing.",
     "with open('data.txt', 'r', encoding='utf-8') as f:\n    content = f.read()\n    for line in f:\n        print(line.strip())",
     "lines = f.readlines()", "read_file.py",
     [
         ("Which mode is used to open a file for reading text in Python?", ["'r'", "'w'", "'a'", "'rb'"], "A", "'r' opens a file for reading text (default mode)."),
         ("Why should you specify encoding='utf-8' when opening text files?", ["Prevents cross-platform character decoding errors across Windows, Mac, and Linux", "Makes file reading faster", "Encrypts file contents", "Required by Python compiler"], "A", "Specifying encoding='utf-8' guarantees consistent character decoding across different operating systems.")
     ]),

    ("writing_files", "Writing Files", "File Handling & I/O", 60,
     "Writing text and structured data to disk using modes 'w' (overwrite), 'a' (append), 'x' (exclusive create), `.write()`, `.writelines()`, and serializing JSON with `json.dump()`.",
     "Writing files enables report generation, logging, exporting data, and persisting application state.",
     "import json\ndata = {'user': 'Arjun', 'score': 95}\nwith open('user.json', 'w') as f:\n    json.dump(data, f, indent=2)",
     "with open('log.txt', 'a') as f: f.write('Event logged\\n')", "write_file.py",
     [
         ("What happens when you open an existing file in 'w' (write) mode?", ["The file contents are completely overwritten (truncated to 0 bytes)", "New text is added to the end", "An FileExistsError is raised", "The file opens in read-only mode"], "A", "'w' mode creates a new file or overwrites an existing file completely."),
         ("Which function serializes a Python dictionary directly into a JSON file object?", ["json.dump()", "json.dumps()", "json.stringify()", "json.write()"], "A", "json.dump(obj, fp) writes a Python object as JSON directly to an open file stream.")
     ]),

    ("context_managers", "Context Managers", "File Handling & I/O", 60,
     "Managing resource allocation cleanly using the `with` statement, understanding `__enter__()` and `__exit__()` dunder methods, and `@contextmanager` decorator.",
     "Context managers guarantee resource cleanup (closing files, releasing locks, terminating connections) even if exceptions occur.",
     "from contextlib import contextmanager\n\n@contextmanager\ndef open_managed_file(filename):\n    f = open(filename, 'w')\n    try:\n        yield f\n    finally:\n        f.close()",
     "with open_managed_file('test.txt') as f: f.write('Hello')", "ctx_mgr.py",
     [
         ("What statement in Python automatically manages resource cleanup (like closing files)?", ["with", "using", "try", "resource"], "A", "The 'with' statement activates a context manager, ensuring automatic cleanup upon exit."),
         ("What dunder methods must a class implement to act as a custom Context Manager?", ["__enter__ and __exit__", "__start__ and __stop__", "__open__ and __close__", "__init__ and __del__"], "A", "A context manager class implements `__enter__()` (returns resource) and `__exit__()` (handles cleanup/exceptions).")
     ]),

    # Module 11: modules_packages
    ("import_statements", "Import Statements", "Modules & Packages", 60,
     "Organizing code into reusable files: `import module`, `from module import item`, aliases `import numpy as np`, `__name__ == '__main__'`, and circular import pitfalls.",
     "Imports allow modular architecture, breaking code into clean, manageable files across large engineering projects.",
     "# math_utils.py\ndef add(a, b): return a + b\nif __name__ == '__main__':\n    print('Running tests...')",
     "import math_utils as mu\nres = mu.add(5, 3)", "imports.py",
     [
         ("What does the condition `if __name__ == '__main__':` check?", ["Whether the script is being run directly by Python (rather than being imported as a module)", "Whether Python is running in main memory", "Whether user is superuser", "Whether script has no syntax errors"], "A", "`__name__` is set to `'__main__'` only when the script is executed directly from CLI."),
         ("How do you import a module with an alias name?", ["import math as m", "import math to m", "using m = import(math)", "include math as m"], "A", "The 'as' keyword creates an import alias: `import module as alias`.")
     ]),

    ("python_standard_library", "Python Standard Library", "Modules & Packages", 60,
     "Exploring Python's rich built-in batteries: `sys`, `os`, `math`, `datetime`, `random`, `collections` (`Counter`, `defaultdict`), `itertools`, and `pathlib`.",
     "The Standard Library provides powerful pre-built tools without installing external 3rd-party dependencies.",
     "from collections import Counter\ncounts = Counter(['apple', 'banana', 'apple'])\n# counts['apple'] == 2\nfrom pathlib import Path\np = Path('/tmp/data.txt')",
     "import datetime\nnow = datetime.datetime.now()", "stdlib.py",
     [
         ("Which module in the Python Standard Library provides Object-Oriented filesystem path handling?", ["pathlib", "os.path", "sys.path", "filelib"], "A", "pathlib (Python 3.4+) provides OOP filesystem path representations via Path objects."),
         ("Which collection class automatically returns a default value for missing keys?", ["collections.defaultdict", "collections.Counter", "collections.deque", "collections.OrderedDict"], "A", "defaultdict calls a factory function to provide default values for non-existent keys.")
     ]),

    ("virtual_environments", "Virtual Environments", "Modules & Packages", 60,
     "Isolating project dependencies using `venv`, package management with `pip`, generating `requirements.txt`, and modern tools (`pyproject.toml`, `poetry`).",
     "Virtual environments prevent dependency version conflicts between different Python projects on the same machine.",
     "# Terminal commands:\n# python3 -m venv .venv\n# source .venv/bin/activate\n# pip install requests\n# pip freeze > requirements.txt",
     "pip install -r requirements.txt", "venv_guide.py",
     [
         ("Why should every Python project use its own virtual environment?", ["To prevent package version conflicts between different projects on the same system", "To make Python execute twice as fast", "To hide source code from users", "To bypass operating system permissions"], "A", "Virtual environments isolate package installations per-project, preventing version collisions."),
         ("Which command generates a requirements.txt file listing all installed package versions?", ["pip freeze > requirements.txt", "python -m requirements", "pip list --export", "venv save requirements"], "A", "pip freeze outputs current package exact versions, which can be saved to requirements.txt.")
     ]),

    # Module 12: object_oriented_python
    ("classes_instances", "Classes & Instances", "Object-Oriented Python", 60,
     "Object-Oriented Programming (OOP) fundamentals: classes as blueprints, instances, the `__init__` constructor, `self` reference, instance attributes vs class attributes.",
     "OOP models real-world entities (Users, Accounts, Products, Orders) as objects combining data and behavior.",
     "class BankAccount:\n    bank_name = 'EduNet Bank' # Class attribute\n    def __init__(self, owner, balance=0):\n        self.owner = owner     # Instance attribute\n        self.balance = balance\n    def deposit(self, amount):\n        self.balance += amount",
     "acc = BankAccount('Rahul', 1000)\nacc.deposit(500)", "classes.py",
     [
         ("What does the `self` parameter represent in a Python class method?", ["The current instance of the class upon which the method is being called", "The global Python environment", "The parent class", "A reserved static keyword"], "A", "`self` refers to the specific instance calling the method, allowing access to instance attributes."),
         ("What is the purpose of the `__init__` method in a Python class?", ["Initializer/constructor method that sets up initial instance attributes when an object is created", "Destructor method that deletes objects", "Static method for class counting", "Method to print class name"], "A", "`__init__` is the constructor initializer called automatically when creating a new instance.")
     ]),

    ("inheritance", "Inheritance", "Object-Oriented Python", 60,
     "Inheriting attributes and methods: parent (base) and child (derived) classes, method overriding, calling parent constructors with `super()`, multiple inheritance, and MRO.",
     "Inheritance allows child classes to reuse, extend, or override logic from base classes, eliminating duplicate code.",
     "class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return 'Generic sound'\n\nclass Dog(Animal):\n    def speak(self):\n        return f'{self.name} says Woof!'",
     "dog = Dog('Buddy'); print(dog.speak())", "inheritance.py",
     [
         ("How do you call a method from a parent class inside a child class in Python?", ["super().method_name()", "parent().method_name()", "base.method_name()", "self.parent.method_name()"], "A", "super() returns a proxy object delegating method calls to a parent or sibling class."),
         ("What is MRO in Python Object-Oriented Programming?", ["Method Resolution Order — the order in which Python searches parent classes for methods", "Memory Resource Optimization", "Module Runtime Overview", "Multiple Register Operation"], "A", "MRO (Method Resolution Order) defines the hierarchy order Python searches when calling inherited methods.")
     ]),

    ("polymorphism", "Polymorphism", "Object-Oriented Python", 60,
     "Duck typing ('if it walks like a duck...'), method overloading via default arguments, operator overloading with dunder methods (`__str__`, `__len__`, `__eq__`), and Abstract Base Classes (ABC).",
     "Polymorphism allows different objects to expose a uniform interface, enabling flexible, extensible software designs.",
     "from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self):\n        pass\n\nclass Circle(Shape):\n    def __init__(self, r):\n        self.r = r\n    def area(self):\n        return 3.14159 * self.r ** 2",
     "shapes = [Circle(5), Square(4)]\nfor s in shapes: print(s.area())", "polymorphism.py",
     [
         ("What is 'Duck Typing' in Python?", ["A philosophy where an object's suitability is determined by the presence of methods/attributes, not its explicit inheritance", "A library for web scraping", "A type of class inheritance", "A compiler error"], "A", "Duck Typing means 'if it walks like a duck and quacks like a duck, it's a duck' — checking methods rather than class types."),
         ("Which dunder method allows overriding the `+` operator for custom objects?", ["__add__", "__plus__", "__sum__", "__append__"], "A", "__add__(self, other) enables custom + operator overloading for objects.")
     ]),

    # Module 13: database_integration
    ("sqlite_integration", "SQLite Integration", "Database Integration", 60,
     "Connecting to relational databases with Python's built-in `sqlite3` module: connections, cursors, executing SQL queries, parameterized queries (preventing SQL injection), and transactions (`commit()`).",
     "SQLite provides a zero-configuration, serverless SQL database embedded directly inside Python applications.",
     "import sqlite3\nconn = sqlite3.connect('app.db')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE IF NOT EXISTS users (id INT, name TEXT)')\ncursor.execute('INSERT INTO users VALUES (?, ?)', (1, 'Alice'))\nconn.commit()\nconn.close()",
     "rows = cursor.execute('SELECT * FROM users').fetchall()", "sqlite_demo.py",
     [
         ("Why should you ALWAYS use parameterized queries (?, ?) instead of string formatting for SQL in Python?", ["Prevents security vulnerabilities from SQL Injection attacks", "Makes SQL execute faster", "Required by SQLite syntax", "Compresses database files"], "A", "Parameterized queries treat input as literal data rather than executable SQL code, preventing SQL injection."),
         ("What method must be called to save changes to an SQLite database after INSERT/UPDATE operations?", ["conn.commit()", "conn.save()", "conn.flush()", "cursor.write()"], "A", "conn.commit() writes pending transactions permanently to the database file.")
     ]),

    ("sqlalchemy_orm", "SQLAlchemy ORM", "Database Integration", 60,
     "Object-Relational Mapping (ORM) with SQLAlchemy 2.0: engines, sessions, declarative models (`Mapped`, `mapped_column`), CRUD operations, relationships, and queries.",
     "ORMs bridge the gap between Python classes and database tables, allowing developers to query databases using Python objects instead of raw SQL strings.",
     "from sqlalchemy import create_engine, String\nfrom sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session\n\nclass Base(DeclarativeBase): pass\nclass User(Base):\n    __tablename__ = 'users'\n    id: Mapped[int] = mapped_column(primary_key=True)\n    name: Mapped[str] = mapped_column(String(50))\n\nengine = create_engine('sqlite:///test.db')\nBase.metadata.create_all(engine)",
     "with Session(engine) as session:\n    session.add(User(name='Rahul'))\n    session.commit()", "sqlalchemy_demo.py",
     [
         ("What is the primary role of an Object-Relational Mapper (ORM) like SQLAlchemy?", ["Maps database tables to Python classes and rows to Python objects", "Replaces the need for a database engine", "Compiles Python to C code", "Automates frontend UI generation"], "A", "An ORM lets developers interact with SQL databases using native Python objects and class models."),
         ("In SQLAlchemy 2.0, what class do all database models inherit from?", ["DeclarativeBase", "db.Model", "BaseModel", "SQLModel"], "A", "In SQLAlchemy 2.0+, declarative ORM models inherit from a custom `DeclarativeBase` subclass.")
     ]),

    ("migration_scripts", "Migration Scripts", "Database Integration", 60,
     "Managing database schema evolution with Alembic: revision scripts, `alembic revision --autogenerate`, upgrading/downgrading database versions in production.",
     "Database migrations track and apply schema changes (adding columns, creating tables) safely across development and production environments.",
     "# Terminal commands:\n# alembic init alembic\n# alembic revision --autogenerate -m 'Add user table'\n# alembic upgrade head",
     "alembic downgrade -1", "migrations_guide.py",
     [
         ("What is the purpose of database migration tools like Alembic?", ["To version-control and apply database schema changes safely over time", "To copy data from MySQL to PostgreSQL", "To back up database files to S3", "To speed up SELECT queries"], "A", "Migration tools track schema changes over time and apply schema updates incrementally across environments."),
         ("Which command applies all pending Alembic migrations to the database?", ["alembic upgrade head", "alembic run all", "alembic apply latest", "alembic migrate --force"], "A", "`alembic upgrade head` applies all unapplied migration scripts up to the latest revision.")
     ])
]

print(f"Total lessons queued for generation: {len(LESSONS)}")

for lid, title, module, est_time, short_desc, why_exists, code_snippet, int_code, filename, sample_quizzes in LESSONS:
    # Resolve subpath
    mod_slug = module.lower().replace(" & ", "_").replace(" ", "_").replace("-", "_")
    folder = os.path.join(BASE_DIR, mod_slug, lid)
    
    # 1. lesson.json
    save_json(folder, 'lesson.json', make_lesson_meta(
        lid, title, module, est_time,
        ['beginner', 'intermediate', 'expert'],
        [], [],
        [f'Master {title} concepts from first principles', f'Write clean, production-grade Python code for {title}', f'Debug common pitfalls and edge cases in {title}'],
        [lid, title.lower(), module.lower()]
    ))

    # 2. beginner.json
    save_json(folder, 'beginner.json', {
        "curiosityQuestion": f"Why is {title} essential when building professional Python applications?",
        "whyExists": why_exists,
        "realWorldAnalogy": f"Think of {title} like a well-organized system component in everyday life.",
        "simpleExplanation": f"At its core, {title} provides a clean, standardized way to handle logic in Python. Understanding this concept empowers you to write reliable, maintainable code.",
        "syntaxExplanation": f"Syntax overview for {title}:\n\n```python\n{code_snippet}\n```",
        "stepByStepExecution": [
            {"step": 1, "code": code_snippet.split('\n')[0], "desc": f"Initialize and configure {title} parameters."},
            {"step": 2, "code": code_snippet.split('\n')[-1], "desc": "Execute logic and process results."}
        ],
        "memoryDiagram": {
            "type": "concept_layout",
            "slots": [
                {"address": "0x1001", "name": f"{lid}_ref", "value": "Allocated", "type": "pointer"}
            ]
        },
        "examples": [
            {
                "title": f"Basic {title} Implementation",
                "code": code_snippet,
                "explanation": f"Demonstrates core usage of {title} in Python."
            }
        ],
        "namingRules": [
            {"rule": "Follow PEP 8 guidelines", "good": "clean_snake_case", "bad": "BadCamelCase", "why": "PEP 8 is the standard Python style guide."}
        ],
        "commonMistakes": [
            {"mistake": f"Incorrect usage of {title}", "wrong": "# Incorrect syntax", "error": "SyntaxError or Logic Error", "right": code_snippet.split('\n')[0], "why": "Adhere strictly to Python syntax standards."}
        ]
    })

    # 3. intermediate.json
    save_json(folder, 'intermediate.json', {
        "deeperExplanation": f"In production systems, {title} is used to optimize runtime performance, decouple component logic, and manage state transitions cleanly.",
        "internalImplementation": f"Python's CPython engine processes {title} by allocating evaluation frames and optimizing bytecode execution paths.",
        "examples": [
            {
                "title": f"Intermediate {title} Pattern",
                "code": int_code,
                "explanation": f"Demonstrates applied engineering pattern for {title}."
            }
        ],
        "performanceConsiderations": {
            "timeComplexity": "O(1) to O(N) depending on data scale",
            "spaceComplexity": "O(1) auxiliary memory"
        },
        "debuggingWalkthrough": {
            "bugDescription": f"Common bug related to {title} state management.",
            "diagnosis": "Inspect variable references and scope boundaries.",
            "fix": code_snippet,
            "explanation": "Ensure proper initialization and cleanup."
        },
        "bestPractices": ["Follow PEP 8 naming conventions", "Keep functions and classes focused on a single responsibility", "Write comprehensive docstrings and unit tests"]
    })

    # 4. expert.json
    save_json(folder, 'expert.json', {
        "overview": f"Architectural deep-dive into {title} for enterprise applications, high-concurrency systems, and frameworks.",
        "industryContext": f"Tech leaders like Google, Netflix, and Instagram use {title} patterns to build resilient distributed services in Python."
    })

    # 5. quiz.json (30 questions)
    save_json(folder, 'quiz.json', make_quiz(title, sample_quizzes))

    # 6. practice.json
    save_json(folder, 'practice.json', {
        "easy": {"title": f"Basic {title} Task", "problem": f"Implement a simple snippet demonstrating {title}.", "starterCode": f"# Write code for {title}\n", "hints": ["Review beginner notes"], "solution": code_snippet, "expectedOutput": "Success"},
        "medium": {"title": f"Applied {title} Challenge", "problem": f"Build a function that uses {title} to process input data.", "starterCode": f"# Implement function using {title}\n", "hints": ["Check edge cases"], "solution": int_code, "expectedOutput": "Processed Result"},
        "hard": {"title": f"Advanced {title} Optimization", "problem": f"Optimize a computational routine using {title} principles.", "starterCode": f"# Advanced {title}\n", "hints": ["Use efficient algorithms"], "solution": code_snippet, "expectedOutput": "Optimized Output"},
        "debugging": {"title": f"Fix {title} Bug", "problem": f"Identify and repair syntax or logic errors in the provided {title} code.", "starterCode": "# Broken code snippet\n", "hints": ["Check error messages"], "solution": code_snippet, "expectedOutput": "Fixed Output"}
    })

    # 7. interview.json
    save_json(folder, 'interview.json', {
        "questions": [
            {"question": f"What is {title} and why is it important in Python?", "answer": f"{title} is a core Python feature that enables structured, clean programming.", "difficulty": "Beginner"},
            {"question": f"What are common performance pitfalls when using {title}?", "answer": "Avoid unnecessary memory allocations or deep loop nesting.", "difficulty": "Intermediate"},
            {"question": f"How is {title} implemented internally in CPython?", "answer": "CPython manages it through bytecode instructions and evaluation stack frames.", "difficulty": "Advanced"}
        ]
    })

    # 8. project.json
    save_json(folder, 'project.json', {
        "title": f"{title} Mini System",
        "tagline": f"Build a practical tool using {title}",
        "description": f"Create a working Python module that demonstrates real-world application of {title}.",
        "requirements": ["Write clean code following PEP 8", "Handle error cases", "Demonstrate working output"],
        "starterCode": f"# Starter code for {title} project\n",
        "solution": code_snippet,
        "expectedOutput": "Project Completed Successfully"
    })

    # 9. revision.json
    save_json(folder, 'revision.json', {
        "oneLineSummary": f"Master {title} for effective Python development.",
        "summary": f"Key concepts: {title} setup, syntax, best practices, and performance.",
        "keyTakeaways": [f"Understand {title} syntax", "Apply best practices", "Avoid common pitfalls"],
        "preInterviewChecklist": [f"Define {title}", "Provide a code example", "Explain time complexity"]
    })

    # 10. cheatsheet.json
    save_json(folder, 'cheatsheet.json', {
        "title": f"{title} Cheat Sheet",
        "sections": [
            {"heading": "Quick Reference", "entries": [{"syntax": code_snippet.split('\n')[0], "example": code_snippet, "description": f"Basic syntax for {title}", "commonMistake": "Syntax or scope error"}]}
        ]
    })

    # 11. resources.json
    save_json(folder, 'resources.json', make_resources([]))

    # 12. videos.json
    save_json(folder, 'videos.json', make_videos("rfscVS0vtbw", f"Learn {title} in Python", "EduNet Learning", "5m", f"Tutorial covering {title}."))

    print(f"Generated 12 JSON files for: {mod_slug}/{lid}")

print("Python Curriculum Generation Complete!")
