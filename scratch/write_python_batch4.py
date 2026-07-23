#!/usr/bin/env python3
"""
EduNet Python Curriculum Writer — Batch 4
Covers 6 lessons:
- loops_iteration/while_loops
- loops_iteration/for_loops
- loops_iteration/loop_control_statements
- functions_scope/function_definitions
- functions_scope/parameters_arguments
- functions_scope/lambda_functions
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
# 1. loops_iteration / while_loops
# ══════════════════════════════════════════════════════════════

M = 'loops_iteration'
L = 'while_loops'

wjson(M, L, 'beginner.json', {
  "whyExists": "Programs often need to repeat an action until a specific target condition changes — for example, waiting for user input, retrying a failed network request, or processing data streams of unknown length. A `while` loop continues executing its code block repeatedly as long as its condition remains `True`.",
  "curiosityQuestion": "What happens inside your computer's CPU and memory when a `while` loop gets stuck in an infinite loop?",
  "problemItSolves": "Without `while` loops, you would have to duplicate code lines manually. `while` loops automate indefinite iteration where the exact number of repetitions is unknown beforehand.",
  "realWorldAnalogy": "A `while` loop is like a thermostat: WHILE the current temperature is below 70°F, keep the heater running. Once 70°F is reached, turn off the heater.",
  "simpleExplanation": "In Python:\n- `while condition:` evaluates the condition.\n- If `True`, the indented block runs.\n- Then it re-checks the condition. This repeats until the condition evaluates to `False`.\n- Make sure the condition eventually becomes `False`, or the loop will run forever!",
  "syntaxExplanation": "count = 1\nwhile count <= 3:\n    print('Count is:', count)\n    count += 1  # Increment to avoid infinite loop",
  "examples": [
    {
      "title": "Basic Countdown Loop",
      "code": "countdown = 3\nwhile countdown > 0:\n    print(countdown)\n    countdown -= 1\nprint('Blast off!')",
      "explanation": "Prints 3, 2, 1. When `countdown` hits 0, `0 > 0` is False, terminating the loop.",
      "language": "python"
    }
  ],
  "visualDiagram": "```mermaid\nflowchart TD\n    A[Start Loop] --> B{condition True?}\n    B -- Yes --> C[Execute Loop Body]\n    C --> D[Update Loop Variables]\n    D --> B\n    B -- No --> E[Exit Loop]\n```",
  "stepByStepExecution": [
    { "step": 1, "action": "Initialize `countdown = 3`", "explanation": "Set loop counter." },
    { "step": 2, "action": "Evaluate `3 > 0`", "explanation": "True: Print 3, decrement to 2." },
    { "step": 3, "action": "Evaluate `2 > 0`", "explanation": "True: Print 2, decrement to 1." },
    { "step": 4, "action": "Evaluate `1 > 0`", "explanation": "True: Print 1, decrement to 0." },
    { "step": 5, "action": "Evaluate `0 > 0`", "explanation": "False: Exit loop and print 'Blast off!'." }
  ],
  "memoryDiagram": { "stack": "[Counter Variable]\n  countdown = 3 -> 2 -> 1 -> 0", "heap": "N/A" },
  "namingRules": ["Ensure counter or flag variable names clearly state their purpose."],
  "commonMistakes": [
    "Forgetting to update the loop control variable, causing an infinite loop.",
    "Off-by-one errors in loop termination condition (`<` vs `<=`)."
  ]
})
wjson(M, L, 'intermediate.json', {
  "deeperExplanation": "Python `while` loops support an optional `else` block: `while cond: ... else: ...`. The `else` block executes when the condition becomes `False`, but NOT if the loop is terminated prematurely with a `break` statement.",
  "internalImplementation": "CPython executes `while` loops using `JUMP_ABSOLUTE` instructions jumping back to the evaluation instruction at the top of the loop frame.",
  "examples": [
    {
      "code": "# While-Else Searching Pattern\nattempts = 0\nsuccess = False\nwhile attempts < 3:\n    attempts += 1\n    if attempts == 2:  # Simulated success on attempt 2\n        success = True\n        break\nelse:\n    print('All attempts failed')\n\nif success: print('Connected!')",
      "explanation": "If `break` triggers, the `else` block is skipped."
    }
  ],
  "performanceConsiderations": { "timeComplexity": "O(K) where K is number of loop iterations.", "spaceComplexity": "O(1)" },
  "debuggingWalkthrough": {
    "bugDescription": "Infinite loop causing 100% CPU usage due to missing counter increment.",
    "incorrectCode": "i = 1\nwhile i <= 5:\n    print(i)  # i is never modified!",
    "correctCode": "i = 1\nwhile i <= 5:\n    print(i)\n    i += 1"
  },
  "bestPractices": [
    "Always guarantee a clear exit path or timeout counter for while loops.",
    "Prefer `for` loops when iterating over known collections or ranges."
  ]
})
wjson(M, L, 'expert.json', { "examples": [{ "code": "# Event Loop & Consumer Pattern\nimport queue\nq = queue.Queue()\nq.put('job1')\nq.put('job2')\n\nwhile not q.empty():\n    job = q.get()\n    print(f'Processing {job}')\n    q.task_done()", "explanation": "Standard concurrent worker queue pattern using `while not q.empty()`." }] })
wjson(M, L, 'quiz.json', { "mcqs": [{ "id": "q1", "question": "When does the `else` block of a `while` loop execute?", "options": ["When the condition becomes False, provided no break occurred", "Always after every iteration", "Only if an error occurs", "When break is called"], "answer": 0, "explanation": "The while-else block executes only if the condition evaluates to False naturally without hitting a break.", "difficulty": "intermediate" }], "checkpoints": [{ "id": "cp1", "question": "True or False: An infinite while loop can be interrupted by Ctrl+C (KeyboardInterrupt).", "answer": True, "explanation": "True. Sending a SIGINT signal interrupts loop execution in terminal." }] })
wjson(M, L, 'practice.json', {
  "easy": { "title": "Sum of First N Integers", "description": "Calculate sum of numbers 1 to N using a while loop.", "starterCode": "def sum_n(n):\n    pass", "expectedOutput": "15", "solution": "def sum_n(n):\n    total = 0\n    curr = 1\n    while curr <= n:\n        total += curr\n        curr += 1\n    return total", "hints": ["Maintain total and curr variables"], "difficulty": "easy" },
  "medium": { "title": "Collatz Conjecture Steps", "description": "Given N, if even divide by 2, if odd multiply by 3 and add 1. Count steps until N becomes 1.", "starterCode": "def collatz_steps(n):\n    pass", "expectedOutput": "7", "solution": "def collatz_steps(n):\n    steps = 0\n    while n > 1:\n        if n % 2 == 0:\n            n = n // 2\n        else:\n            n = 3 * n + 1\n        steps += 1\n    return steps", "hints": ["Use integer division // for even numbers"], "difficulty": "medium" },
  "hard": { "title": "Binary Conversion", "description": "Convert non-negative integer N to its binary string representation using while loop division by 2.", "starterCode": "def to_binary(n):\n    pass", "expectedOutput": "'1010'", "solution": "def to_binary(n):\n    if n == 0: return '0'\n    bits = []\n    while n > 0:\n        bits.append(str(n % 2))\n        n = n // 2\n    return ''.join(reversed(bits))", "hints": ["Collect remainders n % 2 and reverse"], "difficulty": "hard" },
  "debugging": { "title": "Fix Infinite While Loop", "description": "Fix the loop condition decrement.", "buggyCode": "i = 10\nwhile i > 0:\n    print(i)\n    i += 1", "fixedCode": "i = 10\nwhile i > 0:\n    print(i)\n    i -= 1", "bugs": ["`i += 1` increases i, making `i > 0` always True. Change to `i -= 1`."] }
})
wjson(M, L, 'interview.json', { "questions": [{ "question": "Compare `while` loop vs `for` loop usage in Python.", "answer": "`for` loops are preferred for definite iteration over collections or range sequences of known size. `while` loops are used for indefinite iteration where the loop depends on a state condition or event loop.", "level": "beginner" }] })
wjson(M, L, 'project.json', {
  "title": "Interactive Number Guessing Game Engine", "tagline": "Stateful game loop implementation", "description": "Build a game loop prompting guesses until user finds the secret number or exhausts attempts.", "learningGoals": ["State tracking in while loops", "Handling invalid inputs"],
  "requirements": ["Allow max 5 attempts", "Provide 'higher'/'lower' hints"], "starterCode": "def run_game(secret, guesses):\n    pass", "solution": "def run_game(secret, guesses):\n    idx = 0\n    while idx < len(guesses):\n        g = guesses[idx]\n        idx += 1\n        if g == secret:\n            return f'Won in {idx} tries!'\n        elif g < secret:\n            print('Higher')\n        else:\n            print('Lower')\n    return 'Game Over'",
  "solutionExpl": "Iterates over guess inputs using a while loop, checking win condition.", "expectedOutput": "'Won in 2 tries!'", "extensions": ["Add score multiplier based on remaining tries"]
})
wjson(M, L, 'revision.json', { "summary": "`while` loops repeat while a condition is True. Ensure counter variable changes to avoid infinite loops.", "oneLineSummary": "while loops repeat execution as long as a condition evaluates to True.", "keyTakeaways": ["Condition checked before every iteration.", "while-else executes if no break occurs."], "memoryTricks": [{ "concept": "while loop", "trick": "Think of a security guard checking passes WHILE people enter." }], "commonErrors": [{ "error": "Infinite Loop", "cause": "Missing variable update", "fix": "Ensure loop condition updates inside block" }], "preInterviewChecklist": ["Explain while-else behavior"], "nextTopics": [{ "title": "for Loops", "whyNext": "Learn sequence iteration using for loops." }] })
wjson(M, L, 'cheatsheet.json', { "printNote": "while Loop Reference", "sections": [{ "heading": "while Loop", "entries": [{ "syntax": "while cond:\n    body", "example": "i = 0\nwhile i < 5:\n    i += 1", "description": "Indefinite iteration structure" }] }] })
wjson(M, L, 'resources.json', { "links": [{ "type": "official", "title": "Python while Statement", "url": "https://docs.python.org/3/reference/compound_stmts.html#while" }] })
wjson(M, L, 'videos.json', [{ "title": "Python While Loops Tutorial", "video_id": "dHANJ4l6fwA", "url": "https://www.youtube.com/watch?v=dHANJ4l6fwA", "channel": "Programming with Mosh", "duration": "9m", "description": "Mastering while loops and condition checks in Python." }])


# ══════════════════════════════════════════════════════════════
# 2. loops_iteration / for_loops
# ══════════════════════════════════════════════════════════════

L = 'for_loops'

wjson(M, L, 'beginner.json', {
  "whyExists": "Iterating over collections of data (lists of items, characters in text, rows in a table) is one of the most common programming tasks. Python's `for` loop is an iterator-based loop that automatically retrieves each item from a sequence one by one, eliminating manual index tracking.",
  "curiosityQuestion": "How does Python iterate over lists without needing an index counter like `i = 0; i < len(array); i++`?",
  "problemItSolves": "Automates sequence iteration cleanly and safely without index-out-of-bound errors.",
  "realWorldAnalogy": "A `for` loop is like an assembly line worker dealing with a box of parts: take item 1, inspect it; take item 2, inspect it; repeat until the box is empty.",
  "simpleExplanation": "Syntax:\n`for item in iterable:`\n    `print(item)`\nPython automatically manages advancing to the next item until all elements are processed.",
  "syntaxExplanation": "fruits = ['apple', 'banana', 'cherry']\nfor fruit in fruits:\n    print(fruit)\n\n# Using range():\nfor i in range(3):\n    print(i)  # Prints 0, 1, 2",
  "examples": [
    {
      "title": "Iterating Over List & Range",
      "code": "names = ['Alice', 'Bob', 'Charlie']\nfor name in names:\n    print(f'Hello, {name}!')\n\nfor i in range(1, 4):\n    print('Step', i)",
      "explanation": "`for name in names` yields each string. `range(1, 4)` generates numbers 1, 2, 3.",
      "language": "python"
    }
  ],
  "visualDiagram": "```mermaid\nflowchart LR\n    Seq[\"['apple', 'banana']\"] --> Item1[\"1st iter: item = 'apple'\"]\n    Item1 --> Item2[\"2nd iter: item = 'banana'\"]\n    Item2 --> End[Loop Finish]\n```",
  "stepByStepExecution": [
    { "step": 1, "action": "Obtain iterator from `names`", "explanation": "Calls `iter(names)` behind the scenes." },
    { "step": 2, "action": "Fetch next item", "explanation": "Retrieves 'Alice' and executes block." },
    { "step": 3, "action": "Repeat until `StopIteration`", "explanation": "Exits cleanly when items are exhausted." }
  ],
  "memoryDiagram": { "stack": "[Iterator Pointer]\n  Points to current collection index automatically", "heap": "N/A" },
  "namingRules": ["Use singular item names for plural collections (`for user in users:`)."],
  "commonMistakes": [
    "Modifying the list size while iterating over it (causes skipped elements).",
    "Expecting `range(1, 5)` to include 5 (stop index is exclusive)."
  ]
})
wjson(M, L, 'intermediate.json', {
  "deeperExplanation": "Python `for` loops work on any object implementing the Iterator Protocol (`__iter__()` and `__next__()`). Use `enumerate()` to get both index and item, and `zip()` to iterate over multiple sequences simultaneously.",
  "internalImplementation": "CPython compiles `for` loops into `GET_ITER` and `FOR_ITER` bytecode instructions.",
  "examples": [
    {
      "code": "# Enumerate & Zip Patterns\nnames = ['Alice', 'Bob']\nscores = [85, 92]\n\nfor idx, name in enumerate(names, start=1):\n    print(f'{idx}. {name}')\n\nfor name, score in zip(names, scores):\n    print(f'{name}: {score}')",
      "explanation": "`enumerate` yields `(index, item)` tuples. `zip` pairs corresponding elements from multiple lists."
    }
  ],
  "performanceConsiderations": { "timeComplexity": "O(N) where N is sequence length.", "spaceComplexity": "O(1) with generator iterators." },
  "debuggingWalkthrough": {
    "bugDescription": "Skipping elements when removing items from a list during a for loop.",
    "incorrectCode": "nums = [1, 2, 3, 4]\nfor n in nums:\n    if n % 2 == 0:\n        nums.remove(n)",
    "correctCode": "nums = [1, 2, 3, 4]\nnums = [n for n in nums if n % 2 != 0]"
  },
  "bestPractices": [
    "Use list comprehensions for simple transformations.",
    "Use `zip()` and `enumerate()` instead of manual index counters (`range(len(lst))`)."
  ]
})
wjson(M, L, 'expert.json', { "examples": [{ "code": "# Custom Iterator Implementation\nclass SquareSequence:\n    def __init__(self, limit):\n        self.limit = limit\n        self.curr = 1\n    def __iter__(self):\n        return self\n    def __next__(self):\n        if self.curr > self.limit:\n            raise StopIteration\n        res = self.curr ** 2\n        self.curr += 1\n        return res\n\nfor val in SquareSequence(3):\n    print(val)  # 1, 4, 9", "explanation": "Implements standard Iterator Protocol with `__iter__` and `__next__`." }] })
wjson(M, L, 'quiz.json', { "mcqs": [{ "id": "q1", "question": "What is printed by `list(range(2, 5))`?", "options": ["[2, 3, 4]", "[2, 3, 4, 5]", "[0, 1, 2, 3, 4]", "[3, 4, 5]"], "answer": 0, "explanation": "range(start, stop) is inclusive of start (2) and exclusive of stop (5).", "difficulty": "beginner" }], "checkpoints": [{ "id": "cp1", "question": "True or False: `zip()` stops iterating when the shortest input sequence is exhausted.", "answer": True, "explanation": "True. Standard zip stops at the shortest iterable." }] })
wjson(M, L, 'practice.json', {
  "easy": { "title": "Character Frequency Counter", "description": "Count occurrences of each letter in string using for loop.", "starterCode": "def char_freq(s):\n    pass", "expectedOutput": "{'a': 2, 'b': 1}", "solution": "def char_freq(s):\n    freq = {}\n    for c in s:\n        freq[c] = freq.get(c, 0) + 1\n    return freq", "hints": ["Use dict.get(key, 0)"], "difficulty": "easy" },
  "medium": { "title": "Parallel List Combination", "description": "Given student names and marks lists, return list of strings 'Name: Score' for scores >= 50.", "starterCode": "def get_passing(names, scores):\n    pass", "expectedOutput": "['Alice: 85']", "solution": "def get_passing(names, scores):\n    passing = []\n    for name, score in zip(names, scores):\n        if score >= 50:\n            passing.append(f'{name}: {score}')\n    return passing", "hints": ["Use zip(names, scores)"], "difficulty": "medium" },
  "hard": { "title": "Matrix Transpose", "description": "Transpose a 2D matrix (swap rows and columns) using nested for loops.", "starterCode": "def transpose(matrix):\n    pass", "expectedOutput": "[[1, 3], [2, 4]]", "solution": "def transpose(matrix):\n    if not matrix: return []\n    rows, cols = len(matrix), len(matrix[0])\n    result = [[0]*rows for _ in range(cols)]\n    for r in range(rows):\n        for c in range(cols):\n            result[c][r] = matrix[r][c]\n    return result", "hints": ["Result grid has dimensions cols x rows"], "difficulty": "hard" },
  "debugging": { "title": "Fix Range Off-by-One", "description": "Fix range boundary to include end number.", "buggyCode": "def sum_1_to_n(n):\n    tot = 0\n    for i in range(1, n):\n        tot += i\n    return tot", "fixedCode": "def sum_1_to_n(n):\n    tot = 0\n    for i in range(1, n + 1):\n        tot += i\n    return tot", "bugs": ["`range(1, n)` excludes n. Change stop bound to `n + 1`."] }
})
wjson(M, L, 'interview.json', { "questions": [{ "question": "What happens under the hood when a `for` loop runs in Python?", "answer": "Python calls `iter(obj)` to get an iterator object. In each iteration, it calls `next(iterator)`. When the sequence ends, `next()` raises a `StopIteration` exception, which the `for` loop catches silently to exit.", "level": "intermediate" }] })
wjson(M, L, 'project.json', {
  "title": "Sales Data Aggregator Report", "tagline": "Multi-dimensional dataset processor", "description": "Process quarterly product sales records and generate summary statistics.", "learningGoals": ["Nested sequence iteration", "Data accumulation"],
  "requirements": ["Calculate total sales per category", "Identify highest selling product"], "starterCode": "def process_sales(records):\n    pass", "solution": "def process_sales(records):\n    totals = {}\n    for item in records:\n        cat = item['category']\n        rev = item['price'] * item['qty']\n        totals[cat] = totals.get(cat, 0) + rev\n    return totals",
  "solutionExpl": "Iterates sales records aggregating revenue per category dictionary.", "expectedOutput": "{'Electronics': 1200}", "extensions": ["Sort categories by total revenue"]
})
wjson(M, L, 'revision.json', { "summary": "`for` loops iterate over any sequence/iterable object. Use `enumerate()` for index+item, `zip()` for parallel sequences.", "oneLineSummary": "for loops iterate sequentially over items in any iterable object.", "keyTakeaways": ["range(start, stop) excludes stop.", "Never mutate list size during iteration."], "memoryTricks": [{ "concept": "for loop", "trick": "FOR each item IN list, DO action." }], "commonErrors": [{ "error": "IndexError", "cause": "Manual index looping `range(len(lst))` out of bounds", "fix": "Iterate directly over elements `for item in lst`" }], "preInterviewChecklist": ["Explain Iterator Protocol (__iter__, __next__)"], "nextTopics": [{ "title": "Loop Control Statements", "whyNext": "Learn break, continue, and pass to control loop behavior." }] })
wjson(M, L, 'cheatsheet.json', { "printNote": "for Loop Syntax Reference", "sections": [{ "heading": "for Loop Variants", "entries": [{ "syntax": "for item in seq:", "example": "for x in [1,2]: print(x)", "description": "Direct item iteration" }] }] })
wjson(M, L, 'resources.json', { "links": [{ "type": "official", "title": "Python for Statement", "url": "https://docs.python.org/3/reference/compound_stmts.html#for" }] })
wjson(M, L, 'videos.json', [{ "title": "Python For Loops & Range", "video_id": "0ZJ-D31A_uM", "url": "https://www.youtube.com/watch?v=0ZJ-D31A_uM", "channel": "Corey Schafer", "duration": "10m", "description": "Mastering for loops, range, enumerate, and zip in Python." }])


# ══════════════════════════════════════════════════════════════
# 3. loops_iteration / loop_control_statements
# ══════════════════════════════════════════════════════════════

L = 'loop_control_statements'

wjson(M, L, 'beginner.json', {
  "whyExists": "Standard loops iterate through every element sequentially. However, real applications frequently need to exit a loop early when a match is found (`break`), skip processing certain unwanted items (`continue`), or define a syntactically required empty block placeholder (`pass`).",
  "curiosityQuestion": "What is the difference between `pass` and `continue` inside a loop?",
  "problemItSolves": "Allows fine-grained control over loop execution and early termination.",
  "realWorldAnalogy": "- `break`: Searching for your lost keys in a box; once found, STOP searching completely.\n- `continue`: Sorting fruit; if an apple is rotten, SKIP it and move to the next apple.\n- `pass`: A 'Under Construction' sign on a door — holds the space without taking action.",
  "simpleExplanation": "- `break`: Immediately exits the loop.\n- `continue`: Skips the rest of the current iteration and jumps to the next iteration.\n- `pass`: Does nothing (a null operation used as a code placeholder).",
  "syntaxExplanation": "for i in range(5):\n    if i == 2:\n        continue  # Skip 2\n    if i == 4:\n        break     # Exit loop\n    print(i)",
  "examples": [
    {
      "title": "Break and Continue Demo",
      "code": "for num in range(1, 6):\n    if num == 3:\n        continue  # Skips 3\n    if num == 5:\n        break     # Stops at 5\n    print(num)    # Output: 1, 2, 4",
      "explanation": "3 is skipped by `continue`. When `num` hits 5, `break` terminates the loop.",
      "language": "python"
    }
  ],
  "visualDiagram": "```mermaid\nflowchart TD\n    A[Loop Iteration] --> B{Check Control Statement}\n    B -- break --> C[Exit Loop Immediately]\n    B -- continue --> D[Skip Rest & Go To Next Iteration]\n    B -- pass --> E[Execute Remaining Block Normally]\n```",
  "stepByStepExecution": [
    { "step": 1, "action": "num = 3: Hit `continue`", "explanation": "Skip print(3), jump to num = 4." },
    { "step": 2, "action": "num = 5: Hit `break`", "explanation": "Terminate loop immediately." }
  ],
  "memoryDiagram": { "stack": "Jumps execution pointer out of or to start of loop block", "heap": "N/A" },
  "namingRules": ["Use break/continue intentionally to simplify loop logic."],
  "commonMistakes": [
    "Thinking `pass` skips to the next iteration (that is `continue`!). `pass` does nothing.",
    "Using `break` in nested loops expecting it to exit ALL loops (it only exits the innermost loop)."
  ]
})
wjson(M, L, 'intermediate.json', {
  "deeperExplanation": "`break` statements cause a loop's `else` clause to be skipped. `continue` statements do NOT skip the loop's `else` clause.",
  "internalImplementation": "CPython compiles `break` to `BREAK_LOOP` / `JUMP_FORWARD` and `continue` to `JUMP_ABSOLUTE` to the loop header.",
  "examples": [
    {
      "code": "# Prime Number Search using break & loop-else\nfor n in range(2, 10):\n    for x in range(2, n):\n        if n % x == 0:\n            print(f'{n} equals {x} * {n//x}')\n            break\n    else:\n        print(f'{n} is a prime number')",
      "explanation": "If no factor is found (`break` not hit), the `else` block executes, identifying prime numbers."
    }
  ],
  "performanceConsiderations": { "timeComplexity": "O(1) per jump.", "spaceComplexity": "O(1)" },
  "debuggingWalkthrough": {
    "bugDescription": "Confusing `pass` with `continue`, causing unwanted code execution.",
    "incorrectCode": "for item in items:\n    if item is None:\n        pass  # Intended to skip None!\n    print(item.name)",
    "correctCode": "for item in items:\n    if item is None:\n        continue  # Skips None safely\n    print(item.name)"
  },
  "bestPractices": [
    "Use `continue` to reduce nesting inside loop bodies.",
    "Remember `break` only breaks out of the innermost enclosing loop."
  ]
})
wjson(M, L, 'expert.json', { "examples": [{ "code": "# Breaking Outer Loop using Function Return\ndef find_matrix_target(matrix, target):\n    for r_idx, row in enumerate(matrix):\n        for c_idx, val in enumerate(row):\n            if val == target:\n                return (r_idx, c_idx)  # Cleanly exits both loops\n    return None", "explanation": "Returning from a function is the cleanest way to break out of multi-level nested loops." }] })
wjson(M, L, 'quiz.json', { "mcqs": [{ "id": "q1", "question": "What is the difference between `continue` and `pass`?", "options": ["continue skips to the next iteration; pass does nothing", "pass exits the loop; continue skips iteration", "They are identical synonyms", "pass skips to next iteration; continue does nothing"], "answer": 0, "explanation": "`continue` jumps to the next loop iteration. `pass` is a no-op placeholder.", "difficulty": "beginner" }], "checkpoints": [{ "id": "cp1", "question": "True or False: A `break` statement inside an inner loop exits both the inner and outer loops.", "answer": False, "explanation": "False. `break` exits only the immediate innermost loop." }] })
wjson(M, L, 'practice.json', {
  "easy": { "title": "First Negative Number Finder", "description": "Return first negative number in list using loop with break.", "starterCode": "def first_negative(nums):\n    pass", "expectedOutput": "-5", "solution": "def first_negative(nums):\n    for n in nums:\n        if n < 0:\n            return n\n    return None", "hints": ["Return immediately when n < 0"], "difficulty": "easy" },
  "medium": { "title": "Filter and Sum Positive Evens", "description": "Sum all positive even numbers, skipping odd and negative numbers using continue.", "starterCode": "def sum_pos_evens(nums):\n    pass", "expectedOutput": "12", "solution": "def sum_pos_evens(nums):\n    total = 0\n    for n in nums:\n        if n <= 0 or n % 2 != 0:\n            continue\n        total += n\n    return total", "hints": ["Use continue to skip unwanted numbers"], "difficulty": "medium" },
  "hard": { "title": "First Non-Repeating Character", "description": "Find first character in string that does not repeat. Return its index or -1.", "starterCode": "def first_uniq_char(s):\n    pass", "expectedOutput": "0", "solution": "def first_uniq_char(s):\n    counts = {}\n    for c in s:\n        counts[c] = counts.get(c, 0) + 1\n    for idx, c in enumerate(s):\n        if counts[c] == 1:\n            return idx\n    return -1", "hints": ["Build frequency table first, then search in order"], "difficulty": "hard" },
  "debugging": { "title": "Fix Broken Search Loop", "description": "Fix pass vs continue in filter loop.", "buggyCode": "def print_valid(items):\n    for item in items:\n        if item < 0:\n            pass\n        print(item)", "fixedCode": "def print_valid(items):\n    for item in items:\n        if item < 0:\n            continue\n        print(item)", "bugs": ["`pass` did not skip printing negative items. Replaced with `continue`."] }
})
wjson(M, L, 'interview.json', { "questions": [{ "question": "How do you break out of nested loops in Python cleanly?", "answer": "Options include: (1) Wrap loops inside a function and use `return`, (2) Use boolean flag variables, (3) Use `itertools.product` to flatten nested loops into a single loop.", "level": "intermediate" }] })
wjson(M, L, 'project.json', {
  "title": "Log File Severity Processor", "tagline": "Stream log parser with early filtering", "description": "Parse lines from a log stream, skipping debug logs (`continue`) and halting on critical errors (`break`).", "learningGoals": ["Apply break and continue to stream parsing"],
  "requirements": ["Skip [DEBUG]", "Process [INFO] & [WARNING]", "Halt on [FATAL]"], "starterCode": "def process_logs(log_lines):\n    pass", "solution": "def process_logs(log_lines):\n    processed = []\n    for line in log_lines:\n        if '[DEBUG]' in line:\n            continue\n        if '[FATAL]' in line:\n            processed.append('CRITICAL_HALT')\n            break\n        processed.append(line)\n    return processed",
  "solutionExpl": "Filters logs using continue and halts parsing on FATAL log line.", "expectedOutput": "['[INFO] Started', 'CRITICAL_HALT']", "extensions": ["Count skipped debug lines"]
})
wjson(M, L, 'revision.json', { "summary": "`break` exits loop entirely. `continue` skips to next iteration. `pass` is a no-op placeholder.", "oneLineSummary": "break terminates loop; continue skips iteration; pass is a no-op statement.", "keyTakeaways": ["break skips loop-else block.", "continue does NOT skip loop-else block."], "memoryTricks": [{ "concept": "Control Keywords", "trick": "BREAK = Stop & Exit; CONTINUE = Next Item; PASS = Do Nothing." }], "commonErrors": [{ "error": "Using pass expecting continue", "cause": "Misunderstanding pass", "fix": "Use continue to skip remaining code in iteration" }], "preInterviewChecklist": ["Differentiate break, continue, and pass"], "nextTopics": [{ "title": "Functions & Scope", "whyNext": "Organize code into reusable modular functions." }] })
wjson(M, L, 'cheatsheet.json', { "printNote": "Loop Control Statements Reference", "sections": [{ "heading": "Control Keywords", "entries": [{ "syntax": "break", "example": "if done: break", "description": "Terminates loop" }, { "syntax": "continue", "example": "if skip: continue", "description": "Jumps to next iteration" }, { "syntax": "pass", "example": "class Empty: pass", "description": "No-operation placeholder" }] }] })
wjson(M, L, 'resources.json', { "links": [{ "type": "official", "title": "Python break and continue", "url": "https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements-and-else-clauses-on-loops" }] })
wjson(M, L, 'videos.json', [{ "title": "Python Break, Continue, and Pass", "video_id": "yCZBnjF4_tU", "url": "https://www.youtube.com/watch?v=yCZBnjF4_tU", "channel": "Corey Schafer", "duration": "8m", "description": "Clear explanation of break, continue, and pass keywords in loops." }])


# ══════════════════════════════════════════════════════════════
# 4. functions_scope / function_definitions
# ══════════════════════════════════════════════════════════════

M = 'functions_scope'
L = 'function_definitions'

wjson(M, L, 'beginner.json', {
  "whyExists": "As programs grow, writing repetitive code in one long sequence becomes unmanageable. Functions allow you to group reusable statements into a named block. You define a function once using `def`, and can execute (call) it anywhere in your program as many times as needed.",
  "curiosityQuestion": "What does a Python function return if you don't write an explicit `return` statement?",
  "problemItSolves": "Promotes code reuse (DRY principle: Don't Repeat Yourself), improves readability, and makes testing and debugging isolated components easy.",
  "realWorldAnalogy": "A function is like a button on a blender labelled 'Smoothie': whenever you press that button (call the function), the blender performs a predefined series of actions (crush ice, blend fruit) and hands you the resulting drink (returns a value).",
  "simpleExplanation": "In Python:\n- Define using `def function_name():` followed by an indented body.\n- Call using `function_name()`.\n- Use `return value` to send data back to the caller. If omitted, Python implicitly returns `None`.",
  "syntaxExplanation": "def greet():\n    print('Hello, EduNet!')\n\n# Call the function:\ngreet()  # Prints: Hello, EduNet!",
  "examples": [
    {
      "title": "Defining & Returning Values",
      "code": "def add_numbers(a, b):\n    result = a + b\n    return result\n\nsum_val = add_numbers(10, 5)\nprint('Sum:', sum_val)  # Sum: 15",
      "explanation": "`add_numbers` accepts two inputs (`a` and `b`), adds them, and `return` sends 15 back to `sum_val`.",
      "language": "python"
    }
  ],
  "visualDiagram": "```mermaid\nflowchart LR\n    Inputs[\"Arguments: (10, 5)\"] --> Func[\"def add_numbers(a, b)\"]\n    Func --> Process[\"a + b = 15\"]\n    Process --> Output[\"Return: 15\"]\n```",
  "stepByStepExecution": [
    { "step": 1, "action": "Call `add_numbers(10, 5)`", "explanation": "Create new stack frame for `add_numbers`." },
    { "step": 2, "action": "Execute `result = a + b`", "explanation": "10 + 5 = 15 stored in local variable `result`." },
    { "step": 3, "action": "Execute `return result`", "explanation": "Destroy stack frame and return 15 to caller." }
  ],
  "memoryDiagram": { "stack": "[Call Stack Frame]\n  add_numbers(a=10, b=5) -> returns 15 -> frame popped", "heap": "N/A" },
  "namingRules": ["Use lower_case_with_underscores (snake_case) for function names, starting with a verb (e.g. `calculate_total`)."],
  "commonMistakes": [
    "Forgetting to call the function with parentheses `()`: printing `greet` displays the function object `<function greet at ...>`, not its output.",
    "Expecting print() inside a function to return a value to a variable."
  ]
})
wjson(M, L, 'intermediate.json', {
  "deeperExplanation": "In Python, functions are First-Class Objects. This means functions can be assigned to variables, passed as arguments to other functions, returned from functions, and stored in data structures like dicts and lists.",
  "internalImplementation": "CPython creates a `PyFunctionObject` in memory. Calling a function pushes a new `PyFrameObject` onto the execution call stack.",
  "examples": [
    {
      "code": "# First-Class Functions Pattern\ndef square(x): return x * x\ndef cube(x): return x * x * x\n\nmath_ops = {'sq': square, 'cb': cube}\nprint(math_ops['sq'](4))  # 16",
      "explanation": "Functions stored as values in a dictionary and called dynamically."
    }
  ],
  "performanceConsiderations": { "timeComplexity": "Function call stack frame creation adds slight overhead (~50ns).", "spaceComplexity": "Stack memory scales with call depth (recursion limits)." },
  "debuggingWalkthrough": {
    "bugDescription": "Assigning function result when function returns None implicitly.",
    "incorrectCode": "def set_user(name):\n    user = name\n    # Missing return!\n\nu = set_user('Alice')\nprint(u.upper())",
    "correctCode": "def set_user(name):\n    return name\n\nu = set_user('Alice')\nprint(u.upper())"
  },
  "bestPractices": [
    "Follow the Single Responsibility Principle: each function should do one thing well.",
    "Include Google or NumPy style docstrings for every public function."
  ]
})
wjson(M, L, 'expert.json', { "examples": [{ "code": "# Higher-Order Function returning a function\ndef make_multiplier(factor):\n    def multiply(number):\n        return number * factor\n    return multiply\n\ndouble = make_multiplier(2)\nprint(double(5))  # 10", "explanation": "`make_multiplier` creates a closure capturing `factor` in its environment." }] })
wjson(M, L, 'quiz.json', { "mcqs": [{ "id": "q1", "question": "What is returned by a Python function that has no explicit `return` statement?", "options": ["None", "0", "False", "Undefined"], "answer": 0, "explanation": "Functions without a return statement implicitly return `None` upon reaching the end of the body.", "difficulty": "beginner" }], "checkpoints": [{ "id": "cp1", "question": "True or False: In Python, functions can be passed as arguments to other functions.", "answer": True, "explanation": "True. Functions are first-class objects in Python." }] })
wjson(M, L, 'practice.json', {
  "easy": { "title": "Celsius to Fahrenheit Converter", "description": "Write function `c_to_f(celsius)` returning `(celsius * 9/5) + 32`.", "starterCode": "def c_to_f(celsius):\n    pass", "expectedOutput": "98.6", "solution": "def c_to_f(celsius):\n    return (celsius * 9/5) + 32", "hints": ["Use standard arithmetic formula"], "difficulty": "easy" },
  "medium": { "title": "Word Frequency Analyzer", "description": "Write function `clean_and_count(text)` returning word count dict (lowercased, punctuation removed).", "starterCode": "def clean_and_count(text):\n    pass", "expectedOutput": "{'hello': 2}", "solution": "def clean_and_count(text):\n    words = ''.join(c.lower() if c.isalnum() or c.isspace() else '' for c in text).split()\n    counts = {}\n    for w in words:\n        counts[w] = counts.get(w, 0) + 1\n    return counts", "hints": ["Clean text before splitting"], "difficulty": "medium" },
  "hard": { "title": "Custom Map Function", "description": "Implement `my_map(func, iterable)` returning a list of results without using built-in `map()`.", "starterCode": "def my_map(func, iterable):\n    pass", "expectedOutput": "[1, 4, 9]", "solution": "def my_map(func, iterable):\n    return [func(item) for item in iterable]", "hints": ["Apply func(item) for each element"], "difficulty": "hard" },
  "debugging": { "title": "Fix Missing Return Bug", "description": "Fix function returning None instead of result.", "buggyCode": "def area(w, h):\n    res = w * h\n\na = area(5, 4)", "fixedCode": "def area(w, h):\n    return w * h\n\na = area(5, 4)", "bugs": ["Missing `return` statement causes function to return `None`."] }
})
wjson(M, L, 'interview.json', { "questions": [{ "question": "What does it mean that functions are 'First-Class Objects' in Python?", "answer": "It means functions are treated like any other variable/object: they have types, can be passed as arguments, returned from other functions, stored in lists/dicts, and assigned new attributes.", "level": "intermediate" }] })
wjson(M, L, 'project.json', {
  "title": "Modular Unit Conversion Suite", "tagline": "Clean function-oriented utility library", "description": "Build a modular conversion toolkit for length, temperature, and weight.", "learningGoals": ["Function encapsulation & modularity"],
  "requirements": ["c_to_f", "f_to_c", "km_to_miles", "miles_to_km"], "starterCode": "# Define converter functions", "solution": "def c_to_f(c): return (c * 9/5) + 32\ndef f_to_c(f): return (f - 32) * 5/9\ndef km_to_miles(km): return km * 0.621371\ndef miles_to_km(m): return m / 0.621371",
  "solutionExpl": "Encapsulates mathematical conversions into clean single-responsibility functions.", "expectedOutput": "32.0", "extensions": ["Add generic converter router"]
})
wjson(M, L, 'revision.json', { "summary": "Functions group reusable code defined with `def`. Return values with `return`; missing returns yield `None`.", "oneLineSummary": "Functions package reusable code blocks; first-class objects in Python.", "keyTakeaways": ["Functions implicitly return None without `return`.", "First-class objects can be passed as arguments."], "memoryTricks": [{ "concept": "Functions", "trick": "Think of a recipe card: write it once, use it to cook anytime." }], "commonErrors": [{ "error": "Printing function reference instead of output", "cause": "Omitting parentheses `func` instead of `func()`", "fix": "Add `()` to invoke function" }], "preInterviewChecklist": ["Explain first-class functions"], "nextTopics": [{ "title": "Parameters & Arguments", "whyNext": "Learn positional, keyword, default, and *args/**kwargs parameters." }] })
wjson(M, L, 'cheatsheet.json', { "printNote": "Function Definition Syntax Reference", "sections": [{ "heading": "Function Definition", "entries": [{ "syntax": "def name(params):\n    return val", "example": "def add(a, b):\n    return a + b", "description": "Basic function definition" }] }] })
wjson(M, L, 'resources.json', { "links": [{ "type": "official", "title": "Python Defining Functions", "url": "https://docs.python.org/3/tutorial/controlflow.html#defining-functions" }] })
wjson(M, L, 'videos.json', [{ "title": "Python Functions Tutorial", "video_id": "9Os0o3wzS_I", "url": "https://www.youtube.com/watch?v=9Os0o3wzS_I", "channel": "Corey Schafer", "duration": "15m", "description": "Complete guide to writing and using functions in Python." }])


# ══════════════════════════════════════════════════════════════
# 5. functions_scope / parameters_arguments
# ══════════════════════════════════════════════════════════════

L = 'parameters_arguments'

wjson(M, L, 'beginner.json', {
  "whyExists": "Functions need flexibility to process different inputs each time they run. Parameters are variables listed in the function definition, while arguments are the actual values passed into the function when called. Python supports positional arguments, keyword arguments, default parameters, and flexible variable-length arguments (`*args` and `**kwargs`).",
  "curiosityQuestion": "What is the difference between a parameter and an argument in programming terminology?",
  "problemItSolves": "Enables functions to operate dynamically on varying data without hardcoding values.",
  "realWorldAnalogy": "A job application form has blank slots labeled 'Full Name' and 'Age' (Parameters). When you fill out the form with 'Alice' and '25' (Arguments), you supply the actual values for those slots.",
  "simpleExplanation": "- **Parameters**: Variables defined in the `def` header.\n- **Arguments**: Real values passed when calling the function.\n- **Default Parameters**: Fallback values used if an argument isn't provided (e.g. `def greet(name='Guest'):`).\n- **Keyword Arguments**: Passing args explicitly by parameter name (`greet(name='Alice')`).",
  "syntaxExplanation": "def greet(name, msg='Hello'):  # name: positional, msg: default\n    print(f'{msg}, {name}!')\n\ngreet('Alice')                 # Hello, Alice!\ngreet('Bob', msg='Good morning')# Good morning, Bob!",
  "examples": [
    {
      "title": "Default & Keyword Arguments",
      "code": "def make_coffee(size='Medium', sugar=1):\n    print(f'Coffee: {size} with {sugar} sugar(s)')\n\nmake_coffee()                      # Coffee: Medium with 1 sugar(s)\nmake_coffee(size='Large', sugar=2)  # Coffee: Large with 2 sugar(s)",
      "explanation": "Default parameters allow calling `make_coffee()` with 0, 1, or 2 arguments.",
      "language": "python"
    }
  ],
  "visualDiagram": "```mermaid\nflowchart LR\n    Call[\"make_coffee(size='Large')\"] --> Match[\"Match keyword parameter size\"]\n    Match --> Exec[\"Execute function with size='Large'\"]\n```",
  "stepByStepExecution": [
    { "step": 1, "action": "Call `make_coffee(size='Large')`", "explanation": "Bind `size='Large'`. Use default `sugar=1`." }
  ],
  "memoryDiagram": { "stack": "Local frame binds argument values to parameter variable names", "heap": "N/A" },
  "namingRules": ["Place parameters without defaults BEFORE parameters with defaults."],
  "commonMistakes": [
    "Placing a non-default parameter after a default parameter in `def` (SyntaxError).",
    "Using mutable default arguments like `def append_to(element, target=[])` (CRITICAL PYTHON BUG!)."
  ]
})
wjson(M, L, 'intermediate.json', {
  "deeperExplanation": "Mutable default arguments (like `def foo(l=[])`) are evaluated ONCE when the function definition is executed, NOT every time the function is called. Subsequent calls mutate the SAME list across invocations!",
  "internalImplementation": "Default parameter values are stored in the function object's `__defaults__` tuple attribute.",
  "examples": [
    {
      "code": "# Mutable Default Argument Pitfall & Fix\ndef append_good(element, target=None):\n    if target is None:\n        target = []\n    target.append(element)\n    return target\n\nprint(append_good(1))  # [1]\nprint(append_good(2))  # [2]",
      "explanation": "Using `None` as the default value and creating a fresh list inside the function avoids shared state."
    }
  ],
  "performanceConsiderations": { "timeComplexity": "O(1) parameter binding.", "spaceComplexity": "O(1)" },
  "debuggingWalkthrough": {
    "bugDescription": "Shared list state bug from mutable default argument.",
    "incorrectCode": "def add_item(item, box=[]):\n    box.append(item)\n    return box",
    "correctCode": "def add_item(item, box=None):\n    if box is None: box = []\n    box.append(item)\n    return box"
  },
  "bestPractices": [
    "Always use `None` as default value for mutable parameters (lists, dicts).",
    "Use `*args` for arbitrary positional args and `**kwargs` for arbitrary keyword args."
  ]
})
wjson(M, L, 'expert.json', { "examples": [{ "code": "# Flexible *args and **kwargs Wrapper Pattern\ndef log_call(func):\n    def wrapper(*args, **kwargs):\n        print(f'Calling {func.__name__} with args={args}, kwargs={kwargs}')\n        return func(*args, **kwargs)\n    return wrapper\n\n@log_call\ndef multiply(a, b=1):\n    return a * b\n\nmultiply(5, b=3)", "explanation": "`*args` collects extra positional args as a tuple; `**kwargs` collects extra keyword args as a dict." }] })
wjson(M, L, 'quiz.json', { "mcqs": [{ "id": "q1", "question": "Why is `def func(lst=[])` dangerous in Python?", "options": ["The default list is created once and shared across all function calls", "It causes a SyntaxError", "It is slower than tuple defaults", "Lists cannot be passed to functions"], "answer": 0, "explanation": "Default parameter expressions are evaluated once when the function is defined, causing mutable objects to persist across calls.", "difficulty": "intermediate" }], "checkpoints": [{ "id": "cp1", "question": "True or False: `*args` in a function signature receives extra positional arguments as a tuple.", "answer": True, "explanation": "True. `*args` collects positional arguments into a tuple." }] })
wjson(M, L, 'practice.json', {
  "easy": { "title": "Flex Sum (*args)", "description": "Write `sum_all(*args)` returning sum of all numbers passed.", "starterCode": "def sum_all(*args):\n    pass", "expectedOutput": "15", "solution": "def sum_all(*args):\n    return sum(args)", "hints": ["args is a tuple of inputs"], "difficulty": "easy" },
  "medium": { "title": "HTML Tag Generator (**kwargs)", "description": "Write `make_tag(tag, content, **attrs)` returning HTML string e.g. `<a href='link'>Click</a>`.", "starterCode": "def make_tag(tag, content, **attrs):\n    pass", "expectedOutput": "'<a href=\"link\">Click</a>'", "solution": "def make_tag(tag, content, **attrs):\n    attr_str = ''.join(f' {k}=\"{v}\"' for k, v in attrs.items())\n    return f'<{tag}{attr_str}>{content}</{tag}>'", "hints": ["Format kwargs items as key=\"value\""], "difficulty": "medium" },
  "hard": { "title": "Strict Type Enforcer Decorator", "description": "Write decorator verifying keyword args match target types.", "starterCode": "def enforce_types(**type_specs):\n    pass", "expectedOutput": "True", "solution": "def enforce_types(**type_specs):\n    def decorator(func):\n        def wrapper(*args, **kwargs):\n            for param, expected_type in type_specs.items():\n                if param in kwargs and not isinstance(kwargs[param], expected_type):\n                    raise TypeError(f'{param} must be {expected_type}')\n            return func(*args, **kwargs)\n        return wrapper\n    return decorator", "hints": ["Inspect kwargs and check isinstance against spec"], "difficulty": "hard" },
  "debugging": { "title": "Fix Default Parameter Order Bug", "description": "Fix SyntaxError in function header parameter order.", "buggyCode": "def build_profile(title='Guest', name):\n    return f'{title} {name}'", "fixedCode": "def build_profile(name, title='Guest'):\n    return f'{title} {name}'", "bugs": ["Non-default parameter `name` follows default parameter `title`."] }
})
wjson(M, L, 'interview.json', { "questions": [{ "question": "Explain positional-only (`/`) and keyword-only (`*`) parameters in Python 3.8+.", "answer": "Parameters before `/` can ONLY be passed positionally. Parameters after `*` can ONLY be passed using keyword arguments. E.g. `def f(a, /, b, *, c):` — `a` is positional-only, `b` is either, `c` is keyword-only.", "level": "advanced" }] })
wjson(M, L, 'project.json', {
  "title": "Flexible Config Builder Engine", "tagline": "Dynamic parameter handling suite", "description": "Build a database connection string builder accepting positional host/db and arbitrary query params via `**kwargs`.", "learningGoals": ["Handling positional, default, and **kwargs parameters"],
  "requirements": ["Format URI: postgresql://user:pass@host:port/dbname?k1=v1&k2=v2"], "starterCode": "def build_db_url(host, db, user='postgres', port=5432, **params):\n    pass", "solution": "def build_db_url(host, db, user='postgres', port=5432, **params):\n    base = f'postgresql://{user}@{host}:{port}/{db}'\n    if params:\n        q_str = '&'.join(f'{k}={v}' for k, v in params.items())\n        return f'{base}?{q_str}'\n    return base",
  "solutionExpl": "Combines positional host/db with default user/port and optional URL query params.", "expectedOutput": "'postgresql://postgres@localhost:5432/mydb?ssl=true'", "extensions": ["Add password masking"]
})
wjson(M, L, 'revision.json', { "summary": "Parameters define input variables. `*args` packs positional args as a tuple; `**kwargs` packs keyword args as a dict. Never use mutable objects as defaults.", "oneLineSummary": "Parameters receive arguments; use None for mutable defaults and *args/**kwargs for flexible signatures.", "keyTakeaways": ["Mutable default args persist across calls.", "*args = tuple, **kwargs = dict."], "memoryTricks": [{ "concept": "Mutable Defaults", "trick": "Default list = Shared Bucket! Use None to get a fresh bucket every time." }], "commonErrors": [{ "error": "SyntaxError: non-default argument follows default argument", "cause": "Wrong parameter order", "fix": "Put all positional parameters before default parameters" }], "preInterviewChecklist": ["Explain *args vs **kwargs", "Demonstrate fixing mutable default argument bug"], "nextTopics": [{ "title": "Lambda Functions", "whyNext": "Learn anonymous one-line functions." }] })
wjson(M, L, 'cheatsheet.json', { "printNote": "Parameters & Arguments Reference", "sections": [{ "heading": "Flex Signatures", "entries": [{ "syntax": "def f(*args, **kwargs):", "example": "f(1, 2, a=3)", "description": "*args -> tuple, **kwargs -> dict" }] }] })
wjson(M, L, 'resources.json', { "links": [{ "type": "official", "title": "Python Default Argument Values", "url": "https://docs.python.org/3/tutorial/controlflow.html#default-argument-values" }] })
wjson(M, L, 'videos.json', [{ "title": "Python *args and **kwargs Explained", "video_id": "4jBJhCaNrWU", "url": "https://www.youtube.com/watch?v=4jBJhCaNrWU", "channel": "Corey Schafer", "duration": "11m", "description": "Mastering args, kwargs, and default parameters in Python functions." }])


# ══════════════════════════════════════════════════════════════
# 6. functions_scope / lambda_functions
# ══════════════════════════════════════════════════════════════

L = 'lambda_functions'

wjson(M, L, 'beginner.json', {
  "whyExists": "Sometimes you need a simple function for a short task — like sorting a list by a specific key or filtering items — and defining a full 3-line `def` function feels unnecessarily verbose. Python's `lambda` keyword lets you create small, inline, anonymous (unnamed) functions in a single line.",
  "curiosityQuestion": "Why are lambda functions called 'anonymous' functions if you can assign them to a variable?",
  "problemItSolves": "Allows passing simple inline operations directly into higher-order functions like `sorted()`, `map()`, and `filter()` without polluting namespace.",
  "realWorldAnalogy": "A disposable sticky note: you write a quick 1-step instruction ('Sort by age') on a sticky note, use it once for a task, and throw it away.",
  "simpleExplanation": "Syntax:\n`lambda arguments: expression`\n- Returns the result of `expression` automatically (no `return` keyword allowed).\n- Limited to a single expression.",
  "syntaxExplanation": "# Equivalent functions:\ndef double_def(x): return x * 2\n\ndouble_lambda = lambda x: x * 2\n\nprint(double_lambda(5))  # Output: 10",
  "examples": [
    {
      "title": "Sorting a List of Tuples with Lambda",
      "code": "students = [('Alice', 88), ('Bob', 95), ('Charlie', 78)]\n# Sort students by score (index 1)\nstudents_sorted = sorted(students, key=lambda s: s[1], reverse=True)\nprint(students_sorted)  # [('Bob', 95), ('Alice', 88), ('Charlie', 78)]",
      "explanation": "`lambda s: s[1]` extracts the score element from each tuple to serve as the sorting key.",
      "language": "python"
    }
  ],
  "visualDiagram": "```mermaid\nflowchart LR\n    Input[x = 5] --> Lambda[\"lambda x: x * 2\"]\n    Lambda --> Output[10]\n```",
  "stepByStepExecution": [
    { "step": 1, "action": "Pass item to lambda", "explanation": "Lambda receives tuple `('Alice', 88)`." },
    { "step": 2, "action": "Evaluate expression `s[1]`", "explanation": "Returns 88 for sorting comparison." }
  ],
  "memoryDiagram": { "stack": "Anonymous function object evaluated inline", "heap": "N/A" },
  "namingRules": ["Use lambdas strictly for short, one-line callback keys."],
  "commonMistakes": [
    "Assigning lambdas to variables permanently (`f = lambda x: x`). PEP 8 recommends using `def` instead for named functions.",
    "Trying to write multiple statements or assign variables inside a lambda (SyntaxError)."
  ]
})
wjson(M, L, 'intermediate.json', {
  "deeperExplanation": "Lambda functions are syntactically restricted to a single expression. They cannot contain statements (`if`, `for`, `assert`, `=`). However, they support ternary expressions: `lambda x: 'even' if x % 2 == 0 else 'odd'`.",
  "internalImplementation": "CPython constructs a standard `code` object for a lambda. `lambda` functions differ from `def` functions only in `__name__` (which evaluates to `'<lambda>'`).",
  "examples": [
    {
      "code": "# Filtering & Mapping with Lambdas\nnums = [1, 2, 3, 4, 5, 6]\nevens = list(filter(lambda x: x % 2 == 0, nums))\nsquares = list(map(lambda x: x ** 2, nums))\nprint('Evens:', evens)\nprint('Squares:', squares)",
      "explanation": "`filter()` keeps items where lambda returns True. `map()` transforms each item with lambda expression."
    }
  ],
  "performanceConsiderations": { "timeComplexity": "Identical call overhead to `def` functions.", "spaceComplexity": "O(1)" },
  "debuggingWalkthrough": {
    "bugDescription": "Late binding closure bug in lambdas created inside loops.",
    "incorrectCode": "funcs = [lambda: i for i in range(3)]\nprint([f() for f in funcs]) # [2, 2, 2]",
    "correctCode": "funcs = [lambda i=i: i for i in range(3)]\nprint([f() for f in funcs]) # [0, 1, 2]"
  },
  "bestPractices": [
    "Use lambdas for short inline key functions in `sorted()`, `min()`, `max()`.",
    "Use `def` when function requires docstrings, multiple lines, or recursion."
  ]
})
wjson(M, L, 'expert.json', { "examples": [{ "code": "# Sorting complex nested structure with multi-key lambda\nusers = [\n    {'name': 'Alice', 'role': 'user', 'age': 25},\n    {'name': 'Bob', 'role': 'admin', 'age': 30},\n    {'name': 'Charlie', 'role': 'user', 'age': 20}\n]\nusers.sort(key=lambda u: (u['role'], -u['age']))\nprint(users)", "explanation": "Returns a tuple `(role, -age)` to perform multi-level composite sorting." }] })
wjson(M, L, 'quiz.json', { "mcqs": [{ "id": "q1", "question": "What is a limitation of Python lambda functions?", "options": ["They are restricted to a single expression and cannot contain multi-line statements", "They cannot accept arguments", "They execute slower than def functions", "They cannot be used with sorted()"], "answer": 0, "explanation": "Lambdas are restricted to a single expression syntax.", "difficulty": "beginner" }], "checkpoints": [{ "id": "cp1", "question": "True or False: `lambda x: x + 1` automatically returns the result of `x + 1`.", "answer": True, "explanation": "True. The single expression's value is implicitly returned." }] })
wjson(M, L, 'practice.json', {
  "easy": { "title": "Square Number Lambda", "description": "Assign a lambda calculating square of `x` to `sq`.", "starterCode": "sq = None", "expectedOutput": "25", "solution": "sq = lambda x: x ** 2", "hints": ["lambda x: x ** 2"], "difficulty": "easy" },
  "medium": { "title": "Sort Dicts by Key", "description": "Sort list of product dicts by price using `sorted()` and lambda.", "starterCode": "def sort_by_price(products):\n    pass", "expectedOutput": "[{'name': 'b', 'price': 5}]", "solution": "def sort_by_price(products):\n    return sorted(products, key=lambda p: p['price'])", "hints": ["key=lambda p: p['price']"], "difficulty": "medium" },
  "hard": { "title": "Late Binding Fixer", "description": "Write function returning list of multiplier functions 1..N binding iteration variable immediately.", "starterCode": "def make_multipliers(n):\n    pass", "expectedOutput": "6", "solution": "def make_multipliers(n):\n    return [lambda x, i=i: x * i for i in range(1, n + 1)]", "hints": ["Use default arg `i=i` inside lambda definition"], "difficulty": "hard" },
  "debugging": { "title": "Fix Lambda Syntax", "description": "Fix return statement inside lambda.", "buggyCode": "add = lambda a, b: return a + b", "fixedCode": "add = lambda a, b: a + b", "bugs": ["`return` keyword is invalid inside lambda expressions; remove `return`."] }
})
wjson(M, L, 'interview.json', { "questions": [{ "question": "What causes the 'Late Binding Closure' issue in Python loops with lambdas?", "answer": "Python closures bind variables by reference, not value. In a loop, lambdas look up the loop variable when called (after loop completion), taking its final value. Fixing requires binding current value as default arg: `lambda i=i: i`.", "level": "advanced" }] })
wjson(M, L, 'project.json', {
  "title": "Custom Data Table Sorter", "tagline": "Dynamic multi-column sorting tool", "description": "Build a table sorting helper accepting column name and sort direction using lambda keys.", "learningGoals": ["Using lambdas as dynamic sorting keys"],
  "requirements": ["Sort rows by selected dict key"], "starterCode": "def sort_table(rows, col_name, reverse=False):\n    pass", "solution": "def sort_table(rows, col_name, reverse=False):\n    return sorted(rows, key=lambda row: row.get(col_name, 0), reverse=reverse)",
  "solutionExpl": "Uses lambda key to dynamically extract column value for sorting.", "expectedOutput": "[{'score': 90}, {'score': 80}]", "extensions": ["Add secondary tie-breaker column"]
})
wjson(M, L, 'revision.json', { "summary": "Lambda functions are single-expression anonymous functions written `lambda args: expr`. Ideal for short keys in `sorted()`, `min()`, `max()`.", "oneLineSummary": "Lambda functions are single-expression anonymous inline functions.", "keyTakeaways": ["No return statement allowed.", "Useful as sorting keys.", "Watch out for late-binding in loops."], "memoryTricks": [{ "concept": "Lambda", "trick": "Lambda = One-Line Function on the fly." }], "commonErrors": [{ "error": "SyntaxError using return in lambda", "cause": "Including return keyword", "fix": "Remove return keyword — expression evaluates automatically" }], "preInterviewChecklist": ["Explain late binding in lambda loops"], "nextTopics": [{ "title": "Data Structures: Lists & Tuples", "whyNext": "Explore Python's foundational data collections." }] })
wjson(M, L, 'cheatsheet.json', { "printNote": "Lambda Function Reference", "sections": [{ "heading": "Lambda Syntax", "entries": [{ "syntax": "lambda args: expr", "example": "sorted(lst, key=lambda x: x[1])", "description": "Inline single-expression function" }] }] })
wjson(M, L, 'resources.json', { "links": [{ "type": "official", "title": "Python Lambda Expressions", "url": "https://docs.python.org/3/tutorial/controlflow.html#lambda-expressions" }] })
wjson(M, L, 'videos.json', [{ "title": "Python Lambda Functions Tutorial", "video_id": "25ovWs2V154", "url": "https://www.youtube.com/watch?v=25ovWs2V154", "channel": "Corey Schafer", "duration": "9m", "description": "How to use lambda functions with map, filter, and sorted." }])

print("\n✅ Batch 4 complete! Written:\n  - loops_iteration/while_loops\n  - loops_iteration/for_loops\n  - loops_iteration/loop_control_statements\n  - functions_scope/function_definitions\n  - functions_scope/parameters_arguments\n  - functions_scope/lambda_functions")
