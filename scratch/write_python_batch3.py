#!/usr/bin/env python3
"""
EduNet Python Curriculum Writer — Batch 3
Covers:
- variables_core_data_types/strings_booleans
- control_flow_branching/if_else_statements
- control_flow_branching/nested_conditions
- control_flow_branching/ternary_operators
"""

import json, os

BASE = os.path.join(os.path.dirname(__file__), '..', 'curriculum', 'python', 'modules')

def wjson(module, lesson, filename, data):
    p = os.path.join(BASE, module, lesson, 'locales', 'en', filename)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  ✓ {module}/{lesson}/{filename}")

# ══════════════════════════════════════════════════════════════
# 1. variables_core_data_types / strings_booleans
# ══════════════════════════════════════════════════════════════

M = 'variables_core_data_types'
L = 'strings_booleans'

wjson(M, L, 'beginner.json', {
  "whyExists": "Programs constantly work with text and truth values — user names, email messages, login decisions, and conditional flags. In Python, text is represented by strings (`str`), which are immutable sequences of Unicode characters. Truth values are represented by booleans (`bool`), which take only `True` or `False`. Together, strings and booleans form the foundation of user input processing, data validation, and decision-making.",
  "curiosityQuestion": "Why are Python strings immutable (unchangeable), and what actually happens in memory when you 'modify' a string?",
  "problemItSolves": "Strings handle textual representation across all languages and alphabets using UTF-8 encoding. Booleans evaluate conditions (like `age >= 18`), enabling programs to branch and execute different logic paths. Without these two types, interactive applications would be impossible.",
  "realWorldAnalogy": "A Python string is like a printed book page: once printed, you cannot change a single letter on that physical page. If you want an edited version, you must print a brand new page. A boolean is like a light switch: it is strictly ON (`True`) or OFF (`False`).",
  "simpleExplanation": "In Python:\n- Strings are text wrapped in quotes: `'hello'`, `\"world\"`, or `'''multi-line'''`.\n- Strings are immutable: once created, their characters cannot be modified in-place.\n- Booleans are truth flags: `True` or `False` (capitalized).\n- Comparison operations like `5 > 3` evaluate directly to a boolean (`True`).",
  "syntaxExplanation": "# Strings:\nname = 'Alice'\ngreet = \"Hello, \" + name\nmultiline = '''Line 1\nLine 2'''\n\n# Booleans:\nis_active = True\nis_logged_in = False\n\n# Comparisons return booleans:\ncheck = (10 > 5)  # Evaluates to True",
  "examples": [
    {
      "title": "String Creation & Basic Indexing",
      "code": "text = 'Python Programming'\nprint(text[0])       # 'P' (first character)\nprint(text[-1])      # 'g' (last character)\nprint(len(text))     # 18 (total characters)\nprint(text.upper())  # 'PYTHON PROGRAMMING' (returns new string)",
      "explanation": "Strings are 0-indexed sequences. Negative indices count from the end (`-1` is the last character). Calling `.upper()` returns a new modified string because the original string cannot be changed.",
      "language": "python"
    },
    {
      "title": "Boolean Logic & Conditionals",
      "code": "age = 20\nhas_id = True\n\ncan_enter = (age >= 18) and has_id\nprint('Can enter venue:', can_enter)  # Can enter venue: True",
      "explanation": "Comparison `age >= 18` yields `True`. Combined with `has_id` using the boolean operator `and`, `can_enter` holds `True`.",
      "language": "python"
    }
  ],
  "visualDiagram": "```mermaid\nflowchart LR\n    S[\"String: 'PYTHON'\"] --> I0[\"Index 0: 'P'\"]\n    S --> I1[\"Index 1: 'Y'\"]\n    S --> I2[\"Index 2: 'T'\"]\n    S --> I3[\"Index 3: 'H'\"]\n    S --> I4[\"Index 4: 'O'\"]\n    S --> I5[\"Index 5: 'N'\"]\n```",
  "stepByStepExecution": [
    { "step": 1, "action": "s = 'Hello'", "explanation": "Python allocates a `str` object containing the characters H-e-l-l-o in memory." },
    { "step": 2, "action": "s[0] = 'h'", "explanation": "Raises `TypeError: 'str' object does not support item assignment` because strings are immutable." },
    { "step": 3, "action": "s = 'h' + s[1:]", "explanation": "Creates a completely new `str` object 'hello' and rebinds `s` to it." }
  ],
  "memoryDiagram": {
    "stack": "[Variable Namespace]\n  s → 0x88ff (points to 'hello')",
    "heap": "[Heap]\n  0x77aa: 'Hello' (orphaned if reassigned)\n  0x88ff: 'hello'"
  },
  "namingRules": [
    "Boolean flags should be named with prefixes like `is_`, `has_`, `can_`, or `should_` (e.g. `is_valid`, `has_permission`).",
    "Use snake_case for string variable names."
  ],
  "commonMistakes": [
    "Trying to modify a string in-place: `s[0] = 'A'` raises TypeError. Create a new string instead.",
    "Using lowercase `true` or `false`: Python requires `True` and `False` capitalized.",
    "Confusing assignment `=` with equality check `==`: `if x = True:` is a SyntaxError."
  ]
})

wjson(M, L, 'intermediate.json', {
  "deeperExplanation": "In Python, strings are sequence objects of immutable Unicode code points. CPython uses an adaptive internal representation (PEP 393): ASCII-only strings take 1 byte per character, Latin-1 takes 1 byte, UCS-2 takes 2 bytes, and UCS-4 takes 4 bytes. This optimizes memory footprint automatically.\n\nBooleans in Python are a strict subclass of integers (`bool` inherits from `int`). `True` has numerical value `1` and `False` has numerical value `0`. Truthiness evaluation applies to all Python objects via the `__bool__()` or `__len__()` dunder methods.",
  "internalImplementation": "Because strings are immutable, string concatenation in a loop (e.g., `s += char`) can create O(N^2) memory allocations. CPython includes an optimization for `s += char` when `s` has a reference count of 1, but the idiomatic and guaranteed O(N) pattern is appending to a list and calling `''.join(list)`.",
  "examples": [
    {
      "code": "# Efficient String Construction with join()\nwords = ['Python', 'is', 'fast', 'and', 'expressive']\nsentence = ' '.join(words)\nprint(sentence)  # 'Python is fast and expressive'",
      "explanation": "`' '.join(words)` calculates total memory required in advance, allocates one contiguous buffer, and copies characters in a single pass."
    },
    {
      "code": "# Truthiness & Falsy Values\nfalsy_values = [0, 0.0, '', [], {}, set(), None, False]\nfor v in falsy_values:\n    print(f'bool({v!r}) -> {bool(v)}')",
      "explanation": "Python considers empty containers, zeroes, `None`, and `False` as falsy in conditional contexts (`if not container:`)."
    }
  ],
  "performanceConsiderations": {
    "timeComplexity": "String indexing `s[i]` is O(1). String slicing `s[a:b]` is O(b-a). String concatenation `a + b` is O(len(a) + len(b)).",
    "spaceComplexity": "Strings require 48 bytes base overhead plus 1 to 4 bytes per character depending on highest Unicode code point."
  },
  "debuggingWalkthrough": {
    "bugDescription": "Unintended string repetition instead of integer addition due to `input()` returning strings.",
    "incorrectCode": "num1 = input('Enter first number: ')\nnum2 = input('Enter second number: ')\nprint('Total:', num1 + num2)",
    "correctCode": "num1 = int(input('Enter first number: '))\nnum2 = int(input('Enter second number: '))\nprint('Total:', num1 + num2)"
  },
  "bestPractices": [
    "Use f-strings (`f'Hello {name}'`) for string formatting instead of `%` or `.format()`.",
    "Use `''.join(list)` when concatenating multiple strings inside loops.",
    "Rely on implicit truthiness: use `if not items:` instead of `if len(items) == 0:`."
  ]
})

wjson(M, L, 'expert.json', {
  "examples": [
    {
      "code": "# String Interning and Memory Optimization\nimport sys\na = sys.intern('custom_string_identifier')\nb = sys.intern('custom_string_identifier')\nprint(a is b)  # True: guaranteed exact same memory pointer",
      "explanation": "sys.intern() forces Python to enter strings into an internal global lookup table, ensuring single-instance allocation and allowing O(1) pointer comparison (`is`) instead of O(N) string equality comparison (`==`)."
    }
  ]
})

wjson(M, L, 'quiz.json', {
  "mcqs": [
    {
      "id": "q1",
      "question": "What happens when you execute `s = 'hello'; s[0] = 'H'` in Python?",
      "options": [
        "Raises TypeError because strings are immutable",
        "Modifies string in-place to 'Hello'",
        "Creates a new string and updates pointer",
        "Raises AttributeError"
      ],
      "answer": 0,
      "explanation": "Python strings are immutable. You cannot modify individual characters in-place; attempting to do so raises a TypeError.",
      "difficulty": "beginner"
    },
    {
      "id": "q2",
      "question": "What is the boolean evaluation of `bool([])` in Python?",
      "options": [
        "False — empty collections are falsy",
        "True — non-null object",
        "TypeError — lists cannot be converted to bool",
        "None"
      ],
      "answer": 0,
      "explanation": "All empty collections (lists, tuples, dicts, sets, empty strings) evaluate to `False` in boolean contexts.",
      "difficulty": "beginner"
    },
    {
      "id": "q3",
      "question": "Why is `''.join(string_list)` preferred over `+=` inside long loops?",
      "options": [
        "join() allocates memory once (O(N)), while += can cause repeated reallocations (O(N^2))",
        "join() supports Unicode while += does not",
        "+= is deprecated in Python 3",
        "join() executes on multiple CPU cores"
      ],
      "answer": 0,
      "explanation": "join() computes total length beforehand and performs a single memory allocation (O(N)), avoiding repeated reallocations.",
      "difficulty": "intermediate"
    }
  ],
  "checkpoints": [
    { "id": "cp1", "question": "True or False: In Python, `isinstance(True, int)` evaluates to True.", "answer": True, "explanation": "True. In Python, `bool` is a direct subclass of `int`. `True` has integer value `1`." }
  ]
})

wjson(M, L, 'practice.json', {
  "easy": {
    "title": "Palindrome & Truthiness Checker",
    "description": "Write a function `is_palindrome(text)` that returns `True` if the string is a palindrome (reads same forwards and backwards, case-insensitive, ignoring spaces).",
    "starterCode": "def is_palindrome(text):\n    pass",
    "expectedOutput": "True",
    "solution": "def is_palindrome(text):\n    cleaned = ''.join(c.lower() for c in text if c.isalnum())\n    return cleaned == cleaned[::-1]",
    "hints": ["Filter out non-alphanumeric characters with c.isalnum()", "Reverse string with slicing text[::-1]"],
    "difficulty": "easy"
  },
  "medium": {
    "title": "String Compression (RLE)",
    "description": "Implement Run-Length Encoding: convert 'aabcccccaaa' into 'a2b1c5a3'. If compressed string is not shorter, return original.",
    "starterCode": "def compress_string(s):\n    pass",
    "expectedOutput": "a2b1c5a3",
    "solution": "def compress_string(s):\n    if not s: return s\n    res = []\n    count = 1\n    for i in range(1, len(s)):\n        if s[i] == s[i-1]:\n            count += 1\n        else:\n            res.append(s[i-1] + str(count))\n            count = 1\n    res.append(s[-1] + str(count))\n    out = ''.join(res)\n    return out if len(out) < len(s) else s",
    "hints": ["Iterate through indices from 1 to len(s)", "Use a list to collect parts and join at the end"],
    "difficulty": "medium"
  },
  "hard": {
    "title": "Valid Password Validator",
    "description": "Write `validate_password(pwd)` returning `(is_valid: bool, issues: list)`. Password must have min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char (`!@#$%^&*`).",
    "starterCode": "def validate_password(pwd):\n    pass",
    "expectedOutput": "(True, [])",
    "solution": "def validate_password(pwd):\n    issues = []\n    if len(pwd) < 8:\n        issues.append('Must be at least 8 characters long')\n    if not any(c.isupper() for c in pwd):\n        issues.append('Must contain an uppercase letter')\n    if not any(c.islower() for c in pwd):\n        issues.append('Must contain a lowercase letter')\n    if not any(c.isdigit() for c in pwd):\n        issues.append('Must contain a digit')\n    specials = set('!@#$%^&*')\n    if not any(c in specials for c in pwd):\n        issues.append('Must contain a special character (!@#$%^&*)')\n    return (len(issues) == 0, issues)",
    "hints": ["Use generator expressions with any()", "Check each requirement independently and collect error messages"],
    "difficulty": "hard"
  },
  "debugging": {
    "title": "Fix String Mutability Bug",
    "description": "Fix the function trying to capitalize vowels in a string.",
    "buggyCode": "def capitalize_vowels(s):\n    vowels = 'aeiou'\n    for i in range(len(s)):\n        if s[i] in vowels:\n            s[i] = s[i].upper()\n    return s",
    "fixedCode": "def capitalize_vowels(s):\n    vowels = 'aeiou'\n    res = []\n    for char in s:\n        if char in vowels:\n            res.append(char.upper())\n        else:\n            res.append(char)\n    return ''.join(res)",
    "bugs": ["Strings are immutable in Python; `s[i] = ...` throws TypeError. Rebuild using list and `join()`."]
  }
})

wjson(M, L, 'interview.json', {
  "questions": [
    {
      "question": "Explain how string immutability in Python affects performance and memory management.",
      "answer": "String immutability allows Python to perform string interning (reusing identical string literals in memory) and safely use strings as hash keys in dictionaries and sets. However, constructing strings via repeated concatenation in loops causes O(N^2) complexity due to repeated memory allocations. Using list appends + `''.join()` avoids this, achieving O(N) linear performance.",
      "level": "intermediate",
      "followUp": "How does `sys.intern()` alter string pointer comparisons?"
    }
  ]
})

wjson(M, L, 'project.json', {
  "title": "Student Information Form Validator",
  "tagline": "Real-world string & boolean validation suite",
  "description": "Build a robust user input validator for student registration forms (name, email, age, phone).",
  "learningGoals": ["Master string slice/strip/formatting methods", "Evaluate complex boolean conditions", "Return structured validation reports"],
  "requirements": ["Validate email contains @ and domain", "Validate phone number contains exactly 10 digits", "Format student names to Title Case"],
  "starterCode": "def validate_student(data):\n    pass",
  "solution": "def validate_student(data):\n    errors = []\n    name = data.get('name', '').strip().title()\n    email = data.get('email', '').strip().lower()\n    phone = ''.join(c for c in data.get('phone', '') if c.isdigit())\n    \n    if not name or len(name) < 2:\n        errors.append('Invalid name')\n    if '@' not in email or '.' not in email.split('@')[-1]:\n        errors.append('Invalid email address')\n    if len(phone) != 10:\n        errors.append('Phone number must be 10 digits')\n        \n    return {\n        'valid': len(errors) == 0,\n        'errors': errors,\n        'formatted': {'name': name, 'email': email, 'phone': phone}\n    }",
  "solutionExpl": "Strips whitespace, converts name to title case, filters digits for phone validation, and verifies email domain structure.",
  "expectedOutput": "{'valid': True, 'errors': [], 'formatted': {'name': 'John Doe', ...}}",
  "extensions": ["Add regex-based email verification", "Export validation log to JSON format"]
})

wjson(M, L, 'revision.json', {
  "summary": "Strings (`str`) are immutable sequences of Unicode characters. Booleans (`bool`) are a subclass of `int` taking `True` or `False`. Empty collections are falsy.",
  "oneLineSummary": "Strings are immutable Unicode sequences; booleans are binary truth flags inheriting from int.",
  "keyTakeaways": [
    "Strings cannot be modified in-place.",
    "Use `''.join(list)` for efficient loop concatenation.",
    "Empty strings, 0, `None`, and `[]` are falsy.",
    "`bool` inherits from `int` (`True == 1`)."
  ],
  "memoryTricks": [{ "concept": "Immutability", "trick": "Think of strings like frozen ice blocks — to reshape them, you must melt and freeze a new block." }],
  "commonErrors": [{ "error": "TypeError on item assignment", "cause": "Trying to modify string index directly", "fix": "Create a new string using slicing or list join" }],
  "preInterviewChecklist": ["Explain string immutability", "Demonstrate join vs +", "Explain truthiness in Python"],
  "nextTopics": [{ "title": "Control Flow & Branching", "whyNext": "Use booleans to control program execution flow with if-else statements." }]
})

wjson(M, L, 'cheatsheet.json', {
  "printNote": "Python Strings & Booleans Cheat Sheet",
  "sections": [
    {
      "heading": "String Operations",
      "entries": [
        { "syntax": "s.strip()", "example": "' hi '.strip() -> 'hi'", "description": "Removes leading/trailing whitespace" },
        { "syntax": "s.split(delim)", "example": "'a,b,c'.split(',') -> ['a','b','c']", "description": "Splits string into list" },
        { "syntax": "delim.join(list)", "example": "'-'.join(['a','b']) -> 'a-b'", "description": "Joins list elements into string" }
      ]
    }
  ]
})

wjson(M, L, 'resources.json', { "links": [{ "type": "official", "title": "Python String Methods", "url": "https://docs.python.org/3/library/stdtypes.html#string-methods" }] })
wjson(M, L, 'videos.json', [{ "title": "Python Strings & Booleans Complete Guide", "video_id": "k9TUPpGqYTo", "url": "https://www.youtube.com/watch?v=k9TUPpGqYTo", "channel": "Corey Schafer", "duration": "14m", "description": "Comprehensive tutorial on Python strings, immutability, and boolean logic." }])


# ══════════════════════════════════════════════════════════════
# 2. control_flow_branching / if_else_statements
# ══════════════════════════════════════════════════════════════

M = 'control_flow_branching'
L = 'if_else_statements'

wjson(M, L, 'beginner.json', {
  "whyExists": "Programs cannot just execute blindly line by line — they must make decisions based on data. Should a user be allowed to log in? Is a shopping cart total eligible for free shipping? Has a game character run out of health? The `if`, `elif`, and `else` statements allow Python code to branch into different execution paths depending on whether conditions evaluate to `True` or `False`.",
  "curiosityQuestion": "How does Python decide which block of code to run when multiple conditions are met?",
  "problemItSolves": "Without conditional branching, software would run identical instructions regardless of user input or environmental state. Conditional statements provide the decision-making logic of software.",
  "realWorldAnalogy": "A conditional statement is like a traffic signal: IF the light is GREEN, drive. ELIF the light is YELLOW, slow down. ELSE (light is RED), stop completely. Only one path is executed.",
  "simpleExplanation": "In Python:\n- `if condition:` evaluates the condition. If `True`, its indented block runs.\n- `elif condition:` (short for else-if) checks a new condition if previous conditions were `False`.\n- `else:` runs if ALL preceding `if` and `elif` conditions were `False`.\n- Indentation (4 spaces) defines which lines belong to which block.",
  "syntaxExplanation": "score = 85\n\nif score >= 90:\n    print('Grade: A')\nelif score >= 80:\n    print('Grade: B')  # Executed!\nelif score >= 70:\n    print('Grade: C')\nelse:\n    print('Grade: F')",
  "examples": [
    {
      "title": "Basic If-Elif-Else Branching",
      "code": "temperature = 28\n\nif temperature > 30:\n    print('It is hot outside!')\nelif temperature >= 20:\n    print('The weather is pleasant.')\nelse:\n    print('It is cold outside.')",
      "explanation": "Python checks conditions top-to-bottom. Since `28 > 30` is False, it proceeds to `28 >= 20`, which is True. It prints 'The weather is pleasant.' and skips all remaining branches.",
      "language": "python"
    }
  ],
  "visualDiagram": "```mermaid\nflowchart TD\n    A[Start] --> B{temperature > 30?}\n    B -- True --> C[Print Hot]\n    B -- False --> D{temperature >= 20?}\n    D -- True --> E[Print Pleasant]\n    D -- False --> F[Print Cold]\n    C --> G[End]\n    E --> G\n    F --> G\n```",
  "stepByStepExecution": [
    { "step": 1, "action": "Evaluate `if temperature > 30`", "explanation": "28 > 30 is False. Skip indented block." },
    { "step": 2, "action": "Evaluate `elif temperature >= 20`", "explanation": "28 >= 20 is True. Execute indented block." },
    { "step": 3, "action": "Skip `else` block", "explanation": "Branch complete. Resume execution after the control flow structure." }
  ],
  "memoryDiagram": { "stack": "[Instruction Pointer]\n  Executes matching branch block, skips remaining conditional frames", "heap": "N/A" },
  "namingRules": ["Keep condition expressions clean and readable."],
  "commonMistakes": [
    "Mixing up `=` (assignment) and `==` (equality comparison) in `if` statements.",
    "Forgetting the colon `:` at the end of `if`, `elif`, or `else` lines.",
    "Inconsistent indentation inside block levels (IndentationError)."
  ]
})

wjson(M, L, 'intermediate.json', {
  "deeperExplanation": "Python evaluates conditional expressions using short-circuit logic: `A and B` stops immediately if `A` is falsy (without evaluating `B`). `A or B` stops immediately if `A` is truthy. This enables safe property checks like `if ptr is not None and ptr.value > 0:` without throwing NullPointer/AttributeError.",
  "internalImplementation": "CPython compiles `if` statements into `POP_JUMP_IF_FALSE` and `JUMP_FORWARD` bytecode instructions, jumping over non-matching blocks efficiently.",
  "examples": [
    {
      "code": "# Short-Circuit Evaluation Guard Pattern\ndef process_user(user):\n    if user is not None and user.get('is_active', False):\n        print(f\"Processing active user: {user['name']}\")\n    else:\n        print('No valid active user')",
      "explanation": "If `user` is `None`, the `and` operator short-circuits immediately. `user.get()` is never called, preventing an AttributeError."
    }
  ],
  "performanceConsiderations": {
    "timeComplexity": "Evaluating conditional branches is O(1). Arrange most frequent or computationally cheap conditions first to optimize short-circuiting.",
    "spaceComplexity": "O(1) memory."
  },
  "debuggingWalkthrough": {
    "bugDescription": "Accidentally using independent `if` statements instead of `elif`, causing multiple branches to trigger.",
    "incorrectCode": "score = 95\nif score >= 80:\n    print('Pass')\nif score >= 90:\n    print('Honors')",
    "correctCode": "score = 95\nif score >= 90:\n    print('Honors')\nelif score >= 80:\n    print('Pass')"
  },
  "bestPractices": [
    "Place most specific/restrictive conditions first in `elif` chains.",
    "Use short-circuiting for guard clauses.",
    "Avoid redundant checks like `if is_valid == True:` — write `if is_valid:`."
  ]
})

wjson(M, L, 'expert.json', {
  "examples": [
    {
      "code": "# Dispatch Table Pattern (Replacing complex if-elif chains)\ndef handle_add(a, b): return a + b\ndef handle_sub(a, b): return a - b\ndef handle_mul(a, b): return a * b\n\nACTIONS = {\n    'add': handle_add,\n    'sub': handle_sub,\n    'mul': handle_mul\n}\n\ndef execute_op(op, a, b):\n    handler = ACTIONS.get(op)\n    if not handler:\n        raise ValueError(f'Unknown operation: {op}')\n    return handler(a, b)\n\nprint(execute_op('add', 10, 5))  # 15",
      "explanation": "Replacing a 20-branch `elif` chain with a dictionary dispatch table turns O(N) sequential branch checking into O(1) hash lookup."
    }
  ]
})

wjson(M, L, 'quiz.json', {
  "mcqs": [
    {
      "id": "q1",
      "question": "What is printed by: `x = 5; if x > 10: print('A') elif x > 3: print('B') else: print('C')`?",
      "options": ["B", "A", "C", "B and C"],
      "answer": 0,
      "explanation": "5 is not > 10 (False). 5 > 3 is True, so 'B' is printed. Remaining branches are skipped.",
      "difficulty": "beginner"
    }
  ],
  "checkpoints": [
    { "id": "cp1", "question": "True or False: In `A and B`, if A is False, Python will still evaluate B.", "answer": False, "explanation": "False. Short-circuit evaluation stops immediately if A is False." }
  ]
})

wjson(M, L, 'practice.json', {
  "easy": {
    "title": "Leap Year Detector",
    "description": "Write `is_leap_year(year)`: return `True` if year is divisible by 4, except century years must be divisible by 400.",
    "starterCode": "def is_leap_year(year):\n    pass",
    "expectedOutput": "True",
    "solution": "def is_leap_year(year):\n    if year % 400 == 0:\n        return True\n    elif year % 100 == 0:\n        return False\n    return year % 4 == 0",
    "hints": ["Check 400 first, then 100, then 4"],
    "difficulty": "easy"
  },
  "medium": {
    "title": "E-commerce Shipping Fee Calculator",
    "description": "Calculate shipping: Orders >= $100 -> Free. Orders >= $50 -> $5. Prime members get free shipping regardless of order amount.",
    "starterCode": "def calc_shipping(amount, is_prime):\n    pass",
    "expectedOutput": "0",
    "solution": "def calc_shipping(amount, is_prime):\n    if is_prime or amount >= 100:\n        return 0\n    elif amount >= 50:\n        return 5\n    else:\n        return 10",
    "hints": ["Combine is_prime or amount >= 100 in the first branch"],
    "difficulty": "medium"
  },
  "hard": {
    "title": "Tax Bracket Calculator",
    "description": "Calculate progressive tax: Income up to $10,000 @ 0%, $10k-$50k @ 10%, above $50k @ 20%.",
    "starterCode": "def calc_tax(income):\n    pass",
    "expectedOutput": "5000.0",
    "solution": "def calc_tax(income):\n    if income <= 10000:\n        return 0.0\n    elif income <= 50000:\n        return (income - 10000) * 0.10\n    else:\n        return (40000 * 0.10) + ((income - 50000) * 0.20)",
    "hints": ["Calculate marginal tax per bracket, not flat rate on entire income"],
    "difficulty": "hard"
  },
  "debugging": {
    "title": "Fix Grade Assigner",
    "description": "Fix the condition order bug causing all scores above 60 to get 'D'.",
    "buggyCode": "def get_grade(score):\n    if score >= 60:\n        return 'D'\n    elif score >= 90:\n        return 'A'\n    return 'F'",
    "fixedCode": "def get_grade(score):\n    if score >= 90:\n        return 'A'\n    elif score >= 60:\n        return 'D'\n    return 'F'",
    "bugs": ["Ordering branches from least restrictive to most restrictive causes higher grades to be intercepted prematurely."]
  }
})

wjson(M, L, 'interview.json', {
  "questions": [
    {
      "question": "How does short-circuit evaluation work in Python boolean logic?",
      "answer": "In `A and B`, if A evaluates to False, Python short-circuits and returns A immediately without evaluating B. In `A or B`, if A is True, Python returns A immediately without evaluating B. This is used for guard clauses and default value fallbacks.",
      "level": "intermediate"
    }
  ]
})

wjson(M, L, 'project.json', {
  "title": "ATM Withdrawal Simulator",
  "tagline": "Decision-tree financial transaction engine",
  "description": "Simulate an ATM cash withdrawal enforcing account balance, daily limit, and bill denomination constraints.",
  "learningGoals": ["Nested conditional validation", "Clear user messaging per failure mode"],
  "requirements": ["Check account balance", "Check daily withdrawal limit ($500)", "Verify amount is a multiple of $20"],
  "starterCode": "def withdraw(balance, daily_spent, amount):\n    pass",
  "solution": "def withdraw(balance, daily_spent, amount):\n    if amount <= 0:\n        return (False, 'Amount must be positive')\n    if amount % 20 != 0:\n        return (False, 'Amount must be a multiple of $20')\n    if amount > balance:\n        return (False, 'Insufficient funds')\n    if daily_spent + amount > 500:\n        return (False, 'Exceeds daily withdrawal limit of $500')\n    return (True, f'Successfully withdrew ${amount}')",
  "solutionExpl": "Applies guard conditions sequentially, returning descriptive error tuples on failure.",
  "expectedOutput": "(True, 'Successfully withdrew $60')",
  "extensions": ["Add PIN verification attempts check"]
})

wjson(M, L, 'revision.json', {
  "summary": "`if`, `elif`, and `else` control code execution paths. Conditions evaluate top-down; the first `True` branch executes and remaining branches are skipped.",
  "oneLineSummary": "Conditional branching executes the first true block in a sequence of checks.",
  "keyTakeaways": ["Order conditions from most specific to least specific.", "Use `and`/`or` for short-circuit safety.", "Always use 4-space indentation for blocks."],
  "memoryTricks": [{ "concept": "Branching", "trick": "Think of a train track switch — once the switch is set to one track, the train travels down that path only." }],
  "commonErrors": [{ "error": "IndentationError", "cause": "Mismatched indentation spaces", "fix": "Ensure all statements in block share identical indent level" }],
  "preInterviewChecklist": ["Explain short-circuiting", "Differentiate if-if vs if-elif"],
  "nextTopics": [{ "title": "Nested Conditions & Ternary Operators", "whyNext": "Learn inline conditionals and nested decision trees." }]
})

wjson(M, L, 'cheatsheet.json', {
  "printNote": "Control Flow Syntax Reference",
  "sections": [
    {
      "heading": "If-Elif-Else Syntax",
      "entries": [{ "syntax": "if cond1:\n    pass\nelif cond2:\n    pass\nelse:\n    pass", "example": "if x > 0: print('pos')", "description": "Standard multi-branch structure" }]
    }
  ]
})

wjson(M, L, 'resources.json', { "links": [{ "type": "official", "title": "Python Control Flow", "url": "https://docs.python.org/3/tutorial/controlflow.html" }] })
wjson(M, L, 'videos.json', [{ "title": "Python Conditionals & Booleans", "video_id": "DZwmZ8Usvnk", "url": "https://www.youtube.com/watch?v=DZwmZ8Usvnk", "channel": "Corey Schafer", "duration": "12m", "description": "Mastering if, elif, else, and logical operators in Python." }])


# ══════════════════════════════════════════════════════════════
# 3. Remaining lessons in control_flow_branching
# ══════════════════════════════════════════════════════════════

# nested_conditions
L = 'nested_conditions'
wjson(M, L, 'beginner.json', {
  "whyExists": "Real-world decisions often depend on multiple layers of criteria. For example, to grant access to a system, a user must first be logged in, AND THEN their account must be active, AND THEN they must have admin privileges. Placing `if` statements inside other `if` statements (nesting) allows you to model these hierarchical, multi-level decision trees.",
  "curiosityQuestion": "When should you use nested `if` statements versus combining conditions with `and`?",
  "problemItSolves": "Nested conditions allow a program to perform preliminary checks before attempting secondary checks that might be expensive or cause errors if the first check failed.",
  "realWorldAnalogy": "Entering a secure building: First, you pass the security gate at the perimeter (`if has_badge:`). Then, you proceed to the specific office floor and scan your finger (`if fingerprint_matches:`). You cannot check the fingerprint scanner until you have passed the outer gate.",
  "simpleExplanation": "In Python, you can put an `if` block inside another `if` block. Each level of nesting adds 4 more spaces of indentation.",
  "syntaxExplanation": "if outer_condition:\n    # Level 1 indent\n    if inner_condition:\n        # Level 2 indent\n        print('Both conditions met!')",
  "examples": [
    {
      "title": "Nested Security Check",
      "code": "is_logged_in = True\nis_admin = False\n\nif is_logged_in:\n    print('Welcome, User.')\n    if is_admin:\n        print('Accessing Admin Dashboard...')\n    else:\n        print('Accessing Standard User Dashboard...')\nelse:\n    print('Please log in first.')",
      "explanation": "The inner `if is_admin:` is only evaluated if `is_logged_in` is True.",
      "language": "python"
    }
  ],
  "visualDiagram": "```mermaid\nflowchart TD\n    A[Start] --> B{is_logged_in?}\n    B -- True --> C{is_admin?}\n    B -- False --> D[Please log in]\n    C -- True --> E[Admin Dashboard]\n    C -- False --> F[User Dashboard]\n```",
  "stepByStepExecution": [
    { "step": 1, "action": "Check `is_logged_in`", "explanation": "True: Enter outer block." },
    { "step": 2, "action": "Check `is_admin`", "explanation": "False: Execute inner `else` block." }
  ],
  "memoryDiagram": { "stack": "[Nested Block Stack]\n  Outer block (4 spaces) -> Inner block (8 spaces)", "heap": "N/A" },
  "namingRules": ["Avoid nesting more than 2-3 levels deep."],
  "commonMistakes": [
    "Creating 'Arrow Anti-Pattern' by nesting 5+ levels deep, making code unreadable.",
    "Mismatched indentation levels across nested blocks."
  ]
})
wjson(M, L, 'intermediate.json', {
  "deeperExplanation": "Excessive nesting degrades code maintainability. Refactoring nested conditionals using guard clauses (early returns) flattens execution depth and simplifies cognitive load.",
  "internalImplementation": "CPython bytecode for nested `if` statements constructs sequential `POP_JUMP_IF_FALSE` offsets pointing to nested code blocks.",
  "examples": [
    {
      "code": "# Refactoring Nested Code to Guard Clauses\ndef process_order_flat(order):\n    if not order: return 'Cannot Ship'\n    if not order.is_paid: return 'Cannot Ship'\n    if not order.has_stock: return 'Cannot Ship'\n    return 'Ship Order'",
      "explanation": "Guard clauses test for failure modes early and return immediately, keeping the main happy-path logic unindented."
    }
  ],
  "performanceConsiderations": { "timeComplexity": "O(1)", "spaceComplexity": "O(1)" },
  "debuggingWalkthrough": {
    "bugDescription": "Inner `else` aligning with wrong outer `if` due to incorrect indentation.",
    "incorrectCode": "if x > 0:\n    if y > 0:\n        print('Both positive')\nelse:\n    print('x is not positive')",
    "correctCode": "if x > 0:\n    if y > 0:\n        print('Both positive')\n    else:\n        print('y is not positive')"
  },
  "bestPractices": ["Flatten nested code using return early / guard clauses.", "Keep nesting depth <= 2 levels."]
})
wjson(M, L, 'expert.json', { "examples": [{ "code": "# Pattern Matching (Python 3.10+) as alternative to deep nesting\ndef handle_event(event):\n    match event:\n        case {'type': 'click', 'pos': (x, y)}:\n            print(f'Click at {x},{y}')\n        case {'type': 'hover', 'element': elem}:\n            print(f'Hover over {elem}')\n        case _:\n            print('Unknown event')", "explanation": "Structural pattern matching (`match-case`) cleanly destructures complex nested dictionary/object structures." }] })
wjson(M, L, 'quiz.json', { "mcqs": [{ "id": "q1", "question": "What is the primary benefit of guard clauses over deep nesting?", "options": ["Flattens code layout and reduces cognitive complexity", "Executes faster on CPU", "Uses less memory", "Prevents all runtime exceptions"], "answer": 0, "explanation": "Guard clauses handle edge cases upfront and return early, avoiding deep indentation levels.", "difficulty": "intermediate" }], "checkpoints": [{ "id": "cp1", "question": "True or False: A nested if statement can always be flattened using logical `and` operators if no intermediate logic exists.", "answer": True, "explanation": "True. `if A: if B:` is logically identical to `if A and B:` when no statements sit between them." }] })
wjson(M, L, 'practice.json', {
  "easy": { "title": "Loan Eligibility", "description": "Write `can_get_loan(age, income, credit_score)` using nested checks: age >= 21 -> income >= 30000 -> credit_score >= 650.", "starterCode": "def can_get_loan(age, income, credit_score):\n    pass", "expectedOutput": "True", "solution": "def can_get_loan(age, income, credit_score):\n    if age >= 21:\n        if income >= 30000:\n            if credit_score >= 650:\n                return True\n    return False", "hints": ["Nest checks sequentially"], "difficulty": "easy" },
  "medium": { "title": "Refactor to Guard Clauses", "description": "Rewrite the loan eligibility function above using flat guard clauses with early returns.", "starterCode": "def can_get_loan_flat(age, income, credit_score):\n    pass", "expectedOutput": "True", "solution": "def can_get_loan_flat(age, income, credit_score):\n    if age < 21: return False\n    if income < 30000: return False\n    if credit_score < 650: return False\n    return True", "hints": ["Check failing condition and return False immediately"], "difficulty": "medium" },
  "hard": { "title": "Nested Permission Matrix", "description": "Evaluate user roles ('admin', 'editor', 'viewer') and document status ('draft', 'published', 'archived') to check edit access.", "starterCode": "def can_edit(role, doc_status):\n    pass", "expectedOutput": "True", "solution": "def can_edit(role, doc_status):\n    if role == 'admin':\n        return True\n    if role == 'editor':\n        if doc_status in ('draft', 'published'):\n            return True\n    return False", "hints": ["Admin can edit anything; Editor can edit draft & published"], "difficulty": "hard" },
  "debugging": { "title": "Fix Dangling Else Bug", "description": "Fix the indentation of else block to match inner condition.", "buggyCode": "if age >= 18:\n    if has_ticket:\n        print('Enter')\nelse:\n    print('No ticket')", "fixedCode": "if age >= 18:\n    if has_ticket:\n        print('Enter')\n    else:\n        print('No ticket')", "bugs": ["Else block was aligned with age check instead of ticket check."] }
})
wjson(M, L, 'interview.json', { "questions": [{ "question": "What is the 'Arrow Anti-Pattern' in software architecture?", "answer": "The Arrow Anti-Pattern (or Pyramid of Doom) refers to code that severely indents inward due to excessive nested `if` statements and loops, creating a shape like an arrowhead `>>>>`. It makes code hard to read, test, and maintain. It is fixed using guard clauses, early returns, or pattern matching.", "level": "intermediate" }] })
wjson(M, L, 'project.json', {
  "title": "Hierarchical File Access Guard", "tagline": "Multi-tier security authorization engine", "description": "Build a file access controller verifying user authentication, subscription level, and file security classification.", "learningGoals": ["Nested condition evaluation", "Security rule layering"],
  "requirements": ["Verify user authenticated", "Verify clearance level matches file classification"], "starterCode": "def check_file_access(user, file_obj):\n    pass",
  "solution": "def check_file_access(user, file_obj):\n    if not user.get('is_authenticated'):\n        return 'Denied: Unauthenticated'\n    if file_obj['is_public']:\n        return 'Granted: Public File'\n    if user['role'] == 'admin':\n        return 'Granted: Admin Clearance'\n    if user['clearance'] >= file_obj['required_clearance']:\n        return 'Granted: Clearance Verified'\n    return 'Denied: Insufficient Clearance'",
  "solutionExpl": "Uses flat guard checks to evaluate permission hierarchy.", "expectedOutput": "'Granted: Clearance Verified'", "extensions": ["Add audit logging for denied access attempts"]
})
wjson(M, L, 'revision.json', { "summary": "Nested `if` statements place conditional blocks inside each other. Flatten deep nesting using guard clauses.", "oneLineSummary": "Nested conditions evaluate hierarchical rules; flatten deep trees using early returns.", "keyTakeaways": ["Limit nesting to 2 levels.", "Guard clauses flatten nested logic."], "memoryTricks": [{ "concept": "Nesting", "trick": "Think of Russian nesting dolls — open the outer doll first before reaching the inner doll." }], "commonErrors": [{ "error": "Arrow Anti-Pattern", "cause": "Nesting 4+ levels deep", "fix": "Use return early / guard clauses" }], "preInterviewChecklist": ["Explain how to refactor deep nesting"], "nextTopics": [{ "title": "Ternary Operators", "whyNext": "Learn inline conditionals and nested decision trees." }] })
wjson(M, L, 'cheatsheet.json', { "printNote": "Nested Conditions Reference", "sections": [{ "heading": "Guard Clause Pattern", "entries": [{ "syntax": "if not cond: return default\n# Main logic here", "example": "if not user: return None", "description": "Flattens nested conditional code" }] }] })
wjson(M, L, 'resources.json', { "links": [{ "type": "official", "title": "Refactoring Guard Clauses", "url": "https://refactoring.guru/replace-nested-conditional-with-guard-clauses" }] })
wjson(M, L, 'videos.json', [{ "title": "Clean Code - Flattening Nested If Statements", "video_id": "CFRhGnuXG-4", "url": "https://www.youtube.com/watch?v=CFRhGnuXG-4", "channel": "ArjanCodes", "duration": "10m", "description": "How to refactor deeply nested conditionals into clean guard clauses." }])


# ternary_operators
L = 'ternary_operators'
wjson(M, L, 'beginner.json', {
  "whyExists": "Standard `if-else` blocks require at least 4 lines of code to assign a value based on a condition. Python's ternary operator (conditional expression) lets you compute and evaluate a single value in one compact line: `value_if_true if condition else value_if_false`.",
  "curiosityQuestion": "Can you assign the result of a standard 4-line `if-else` directly into a variable in Python?",
  "problemItSolves": "Condenses simple binary variable assignments (like setting a status string or default value) from 4 lines down to 1 concise line.",
  "realWorldAnalogy": "A light switch label: 'ON' if switch is UP else 'OFF'. It evaluates directly to one of two words.",
  "simpleExplanation": "The ternary expression returns one of two values based on a condition. Syntax:\n`x = true_value if condition else false_value`",
  "syntaxExplanation": "age = 20\nstatus = 'Adult' if age >= 18 else 'Minor'\nprint(status)  # Output: Adult",
  "examples": [
    {
      "title": "Basic Ternary Assignment",
      "code": "score = 85\nresult = 'Pass' if score >= 60 else 'Fail'\nprint(result)  # Pass",
      "explanation": "If `score >= 60` is True, 'Pass' is returned and assigned to `result`.",
      "language": "python"
    }
  ],
  "visualDiagram": "```mermaid\nflowchart LR\n    C{condition}\n    C -- True --> V1[value_if_true]\n    C -- False --> V2[value_if_false]\n```",
  "stepByStepExecution": [
    { "step": 1, "action": "Evaluate condition `score >= 60`", "explanation": "85 >= 60 is True." },
    { "step": 2, "action": "Return `value_if_true` ('Pass')", "explanation": "Assign 'Pass' to target variable." }
  ],
  "memoryDiagram": { "stack": "[Evaluates to single object reference]", "heap": "N/A" },
  "namingRules": ["Use ternary only for simple, short expressions."],
  "commonMistakes": [
    "Writing multi-statement logic inside a ternary expression.",
    "Forgetting the `else` clause (Python ternary REQUIRES both `if` and `else`)."
  ]
})
wjson(M, L, 'intermediate.json', {
  "deeperExplanation": "Unlike C/Java (`cond ? val1 : val2`), Python uses readable English keywords `val1 if cond else val2`. The ternary expression is a true expression (it evaluates to a value), meaning it can be passed directly into function arguments or dictionary values.",
  "internalImplementation": "CPython compiles ternary expressions to `POP_JUMP_IF_FALSE` instructions that jump over the `true_val` bytecodes directly to the `false_val` bytecodes.",
  "examples": [
    {
      "code": "# Ternary inside function call\ndef greet(is_morning):\n    print(f\"Good {'morning' if is_morning else 'evening'}!\")\n\ngreet(True)   # Good morning!\ngreet(False)  # Good evening!",
      "explanation": "Passes the ternary expression directly into f-string interpolation."
    }
  ],
  "performanceConsiderations": { "timeComplexity": "O(1)", "spaceComplexity": "O(1)" },
  "debuggingWalkthrough": {
    "bugDescription": "Trying to omit the `else` part of a ternary operator.",
    "incorrectCode": "msg = 'OK' if valid  # SyntaxError!",
    "correctCode": "msg = 'OK' if valid else 'INVALID'"
  },
  "bestPractices": ["Keep ternary expressions on a single line.", "Never chain multiple ternary operators together (unreadable)."]
})
wjson(M, L, 'expert.json', { "examples": [{ "code": "# Ternary with Tuples/Dicts (Alternative evaluation pattern)\nstatus = ('Minor', 'Adult')[age >= 18]", "explanation": "Tuple indexing `(false_val, true_val)[cond]` works but loses short-circuit evaluation." }] })
wjson(M, L, 'quiz.json', { "mcqs": [{ "id": "q1", "question": "What is the correct syntax for Python's ternary operator?", "options": ["val1 if condition else val2", "condition ? val1 : val2", "if condition then val1 else val2", "val1 when condition else val2"], "answer": 0, "explanation": "Python uses `val1 if condition else val2`.", "difficulty": "beginner" }], "checkpoints": [{ "id": "cp1", "question": "True or False: Python's ternary operator supports omitting the `else` clause.", "answer": False, "explanation": "False. The `else` clause is strictly required in Python conditional expressions." }] })
wjson(M, L, 'practice.json', {
  "easy": { "title": "Even or Odd String", "description": "Write `even_or_odd(n)` returning `'Even'` if `n` is even else `'Odd'` using a single-line ternary.", "starterCode": "def even_or_odd(n):\n    pass", "expectedOutput": "'Even'", "solution": "def even_or_odd(n):\n    return 'Even' if n % 2 == 0 else 'Odd'", "hints": ["Use n % 2 == 0 as condition"], "difficulty": "easy" },
  "medium": { "title": "Absolute Value Calculator", "description": "Implement `my_abs(n)` returning `n` if `n >= 0` else `-n` using a ternary.", "starterCode": "def my_abs(n):\n    pass", "expectedOutput": "5", "solution": "def my_abs(n):\n    return n if n >= 0 else -n", "hints": ["Return -n for negative numbers"], "difficulty": "medium" },
  "hard": { "title": "Formatted Access Label", "description": "Write `get_access_label(user)` returning `'Admin (Full)'` if admin, `'VIP ({tier})'` if subscriber, else `'Guest'` using clean ternary expressions.", "starterCode": "def get_access_label(user):\n    pass", "expectedOutput": "'Admin (Full)'", "solution": "def get_access_label(user):\n    if user.get('is_admin'): return 'Admin (Full)'\n    return f\"VIP ({user['tier']})\" if user.get('is_sub') else 'Guest'", "hints": ["Combine early return with ternary for tier"], "difficulty": "hard" },
  "debugging": { "title": "Fix C-Style Ternary", "description": "Fix Python SyntaxError caused by C-style ternary.", "buggyCode": "res = is_valid ? 'Yes' : 'No'", "fixedCode": "res = 'Yes' if is_valid else 'No'", "bugs": ["Python does not use `? :` syntax. Use `X if cond else Y`."] }
})
wjson(M, L, 'interview.json', { "questions": [{ "question": "Does Python's ternary expression short-circuit?", "answer": "Yes. In `A if cond else B`, Python evaluates `cond` first. If True, only A is evaluated and returned. B is completely skipped. If False, only B is evaluated.", "level": "intermediate" }] })
wjson(M, L, 'project.json', {
  "title": "Dynamic Discount Pricing Engine", "tagline": "Inline conditional pricing rules", "description": "Calculate product price applying instant tier discounts with ternary logic.", "learningGoals": ["Compact inline condition evaluation"],
  "requirements": ["Apply 20% discount if quantity >= 10, else 0%"], "starterCode": "def calc_price(unit_price, qty):\n    pass",
  "solution": "def calc_price(unit_price, qty):\n    discount = 0.20 if qty >= 10 else 0.0\n    total = (unit_price * qty) * (1 - discount)\n    return round(total, 2)",
  "solutionExpl": "Uses single-line ternary to compute discount factor.", "expectedOutput": "160.0", "extensions": ["Format as currency string"]
})
wjson(M, L, 'revision.json', { "summary": "Ternary operator evaluates `val1 if condition else val2`. Both `if` and `else` are mandatory.", "oneLineSummary": "Ternary expression: `X if condition else Y` computes inline values in one line.", "keyTakeaways": ["Requires both if and else.", "Short-circuits evaluation.", "Keep on 1 line."], "memoryTricks": [{ "concept": "Ternary Syntax", "trick": "Read as English: 'GIVE ME THIS if THIS IS TRUE else GIVE ME THAT'." }], "commonErrors": [{ "error": "SyntaxError using ?", "cause": "Using C-style `? :`", "fix": "Use Python `if-else` syntax" }], "preInterviewChecklist": ["Explain Python ternary syntax vs C-style"], "nextTopics": [{ "title": "Loops & Iteration: while Loops", "whyNext": "Transition from branching decisions to repeating code using while loops." }] })
wjson(M, L, 'cheatsheet.json', { "printNote": "Ternary Operator Reference", "sections": [{ "heading": "Ternary Expression", "entries": [{ "syntax": "x = A if cond else B", "example": "status = 'Active' if is_on else 'Idle'", "description": "Inline conditional assignment" }] }] })
wjson(M, L, 'resources.json', { "links": [{ "type": "official", "title": "Python Conditional Expressions", "url": "https://docs.python.org/3/reference/expressions.html#conditional-expressions" }] })
wjson(M, L, 'videos.json', [{ "title": "Python Ternary Operator Tutorial", "video_id": "0W2RjU-aV6k", "url": "https://www.youtube.com/watch?v=0W2RjU-aV6k", "channel": "Tech With Tim", "duration": "6m", "description": "How and when to use one-line if-else statements in Python." }])

print("\n✅ Batch 3 complete! Written:\n  - variables_core_data_types/strings_booleans\n  - control_flow_branching/if_else_statements\n  - control_flow_branching/nested_conditions\n  - control_flow_branching/ternary_operators")
