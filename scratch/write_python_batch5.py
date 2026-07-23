#!/usr/bin/env python3
"""
EduNet Python Curriculum Writer — Batch 5
Covers 6 lessons across 2 modules:
- lists_tuples/list_operations
- lists_tuples/tuple_immutability
- lists_tuples/list_comprehensions
- dictionaries_sets/key_value_pairs
- dictionaries_sets/set_operations
- dictionaries_sets/dictionary_comprehensions
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
# 1. lists_tuples / list_operations
# ══════════════════════════════════════════════════════════════

M = 'lists_tuples'
L = 'list_operations'

wjson(M, L, 'beginner.json', {
  "whyExists": "Programs constantly manage groups of items: lists of registered users, shopping cart items, high scores, or search results. Python `list` is a mutable, ordered sequence that can store elements of any data type. Learning list operations (appending, inserting, removing, slicing, sorting) is essential for data collection management.",
  "curiosityQuestion": "Why does appending an item to a Python list take O(1) time on average even when the underlying memory block needs to grow?",
  "problemItSolves": "Allows storing, accessing, modifying, and ordering collections of objects dynamically without fixing array sizes in advance.",
  "realWorldAnalogy": "A list is like an adjustable binder with loose-leaf pages: you can add a page at the end, insert a page in the middle, remove a page, or swap page order at any time.",
  "simpleExplanation": "In Python:\n- Lists are defined with square brackets: `items = [10, 20, 30]`.\n- Access items by 0-based index: `items[0]` is 10.\n- Modify items directly: `items[0] = 99`.\n- Append items: `items.append(40)`.",
  "syntaxExplanation": "nums = [1, 2, 3]\nnums.append(4)      # [1, 2, 3, 4]\nnums.insert(0, 0)   # [0, 1, 2, 3, 4]\nnums.pop()          # removes 4, returns 4\nprint(nums[1:3])    # [1, 2] (slicing)",
  "examples": [
    {
      "title": "Basic List Mutation & Slicing",
      "code": "fruits = ['apple', 'banana', 'cherry']\nfruits.append('orange')\nfruits.remove('banana')\nprint(fruits)          # ['apple', 'cherry', 'orange']\nprint(fruits[:2])      # ['apple', 'cherry']",
      "explanation": "Demonstrates `.append()`, `.remove()`, and slice indexing `[:2]`.",
      "language": "python"
    }
  ],
  "visualDiagram": "```mermaid\nflowchart LR\n    L[\"List Memory Layout\"] --> E0[\"Index 0 -> 'apple'\"]\n    L --> E1[\"Index 1 -> 'cherry'\"]\n    L --> E2[\"Index 2 -> 'orange'\"]\n```",
  "stepByStepExecution": [
    { "step": 1, "action": "fruits.append('orange')", "explanation": "Appends 'orange' at index 3." },
    { "step": 2, "action": "fruits.remove('banana')", "explanation": "Finds 'banana' at index 1, removes it, shifts remaining items left." }
  ],
  "memoryDiagram": { "stack": "[List Object Reference]\n  points to contiguous array of PyObject pointers", "heap": "N/A" },
  "namingRules": ["Use plural nouns for list variable names (e.g. `users`, `scores`)."],
  "commonMistakes": [
    "Expecting `.append()` or `.sort()` to return a new list (`items = items.append(5)` sets `items` to `None`!).",
    "IndexError when trying to access an index `>= len(list)`."
  ]
})
wjson(M, L, 'intermediate.json', {
  "deeperExplanation": "Python lists are dynamic arrays of object pointers (`PyObject**`). CPython uses an over-allocation strategy (`0, 4, 8, 16, 25, 35, 46, 58, 72, 88...`) to ensure `.append()` achieves amortized O(1) time complexity.",
  "internalImplementation": "Inserting or removing elements at index 0 requires shifting all N pointers in memory (O(N) operation). For frequent double-ended insertion/pop, use `collections.deque` (O(1)).",
  "examples": [
    {
      "code": "# List In-Place Sorting vs sorted()\nnums = [5, 2, 8, 1]\nnums.sort(reverse=True)  # Modifies nums in-place, returns None\nprint('In-place:', nums) # [8, 5, 2, 1]\n\noriginal = [5, 2, 8, 1]\nnew_list = sorted(original) # Returns brand new list\nprint('New list:', new_list)",
      "explanation": "`.sort()` mutates list in-place returning `None`. `sorted()` leaves original untouched and returns new sorted list."
    }
  ],
  "performanceConsiderations": { "timeComplexity": "Indexing O(1), append() amortized O(1), insert(0)/pop(0) O(N), sort() O(N log N) Timsort.", "spaceComplexity": "O(N)" },
  "debuggingWalkthrough": {
    "bugDescription": "Assigning result of in-place method `.append()` to variable.",
    "incorrectCode": "items = [1, 2]\nitems = items.append(3)  # BUG: items becomes None!",
    "correctCode": "items = [1, 2]\nitems.append(3)          # Correct: mutates items in-place"
  },
  "bestPractices": [
    "Use `.sort()` when you don't need the original order; use `sorted()` when preserving original data.",
    "Use `collections.deque` for O(1) queue/deque push and pop operations."
  ]
})
wjson(M, L, 'expert.json', { "examples": [{ "code": "# Deep copy vs Shallow copy of nested lists\nimport copy\noriginal = [[1, 2], [3, 4]]\nshallow = original.copy()\ndeep = copy.deepcopy(original)\n\noriginal[0][0] = 99\nprint('Shallow affected:', shallow[0][0]) # 99\nprint('Deep unaffected:', deep[0][0])     # 1", "explanation": "Shallow copy copies outer array of pointers; deepcopy recursively duplicates nested objects." }] })
wjson(M, L, 'quiz.json', { "mcqs": [{ "id": "q1", "question": "What is returned by `lst.append(x)`?", "options": ["None", "The modified list", "The index of appended item", "Length of list"], "answer": 0, "explanation": "In-place mutation methods like .append(), .sort(), and .reverse() return None in Python.", "difficulty": "beginner" }], "checkpoints": [{ "id": "cp1", "question": "True or False: Python list indexing `lst[-1]` accesses the last element.", "answer": True, "explanation": "True. Negative indices count backwards from the end." }] })
wjson(M, L, 'practice.json', {
  "easy": { "title": "Second Largest Number", "description": "Write `second_largest(nums)` returning second highest distinct number.", "starterCode": "def second_largest(nums):\n    pass", "expectedOutput": "5", "solution": "def second_largest(nums):\n    unique = sorted(set(nums))\n    return unique[-2] if len(unique) >= 2 else None", "hints": ["Use set() to remove duplicates"], "difficulty": "easy" },
  "medium": { "title": "Rotate List K Steps", "description": "Rotate list right by K steps in O(N) time.", "starterCode": "def rotate_list(nums, k):\n    pass", "expectedOutput": "[4, 5, 1, 2, 3]", "solution": "def rotate_list(nums, k):\n    if not nums: return []\n    k = k % len(nums)\n    return nums[-k:] + nums[:-k]", "hints": ["Use slicing nums[-k:] and nums[:-k]"], "difficulty": "medium" },
  "hard": { "title": "Merge Intervals", "description": "Given list of overlapping intervals `[[1,3],[2,6],[8,10]]`, merge overlapping ranges.", "starterCode": "def merge_intervals(intervals):\n    pass", "expectedOutput": "[[1, 6], [8, 10]]", "solution": "def merge_intervals(intervals):\n    if not intervals: return []\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for curr in intervals[1:]:\n        prev = merged[-1]\n        if curr[0] <= prev[1]:\n            prev[1] = max(prev[1], curr[1])\n        else:\n            merged.append(curr)\n    return merged", "hints": ["Sort intervals by start time first"], "difficulty": "hard" },
  "debugging": { "title": "Fix In-Place Assignment Bug", "description": "Fix function setting list to None.", "buggyCode": "def get_sorted(nums):\n    return nums.sort()", "fixedCode": "def get_sorted(nums):\n    return sorted(nums)", "bugs": ["`nums.sort()` returns None. Use `sorted(nums)` to return new sorted list."] }
})
wjson(M, L, 'interview.json', { "questions": [{ "question": "Explain amortized O(1) time complexity of Python `list.append()`.", "answer": "CPython over-allocates list capacity when resizing. When capacity is exceeded, it allocates a larger chunk of memory (growing by ~1.125x) and copies elements. Because resizes occur infrequently, the average cost per `append()` over N operations is O(1).", "level": "intermediate" }] })
wjson(M, L, 'project.json', {
  "title": "Task Queue Priority Manager", "tagline": "Dynamic task list processor", "description": "Build a task manager queue supporting adding tasks with priority, removing completed tasks, and reordering.", "learningGoals": ["List manipulation & slicing"],
  "requirements": ["Add task at index", "Remove task by name", "Move task to top"], "starterCode": "class TaskManager:\n    def __init__(self): self.tasks = []", "solution": "class TaskManager:\n    def __init__(self):\n        self.tasks = []\n    def add_task(self, name, priority=False):\n        if priority:\n            self.tasks.insert(0, name)\n        else:\n            self.tasks.append(name)\n    def remove_task(self, name):\n        if name in self.tasks:\n            self.tasks.remove(name)\n    def get_tasks(self):\n        return self.tasks",
  "solutionExpl": "Uses `.insert(0)` for priority tasks and `.append()` for standard tasks.", "expectedOutput": "['urgent', 'normal']", "extensions": ["Add status tracking per task"]
})
wjson(M, L, 'revision.json', { "summary": "Lists are mutable, ordered sequences. Indexing is O(1). `.append()` is O(1) amortized. In-place methods return `None`.", "oneLineSummary": "Lists are mutable ordered dynamic arrays of object references.", "keyTakeaways": [".append() returns None.", "sorted() returns new list; .sort() mutates in-place.", "Slicing lst[a:b] creates a shallow copy."], "memoryTricks": [{ "concept": "List Methods", "trick": "Methods that modify in-place return None (Silent Modifiers)." }], "commonErrors": [{ "error": "AttributeError: 'NoneType' object has no attribute...", "cause": "Assigning result of .sort() or .append() to variable", "fix": "Do not assign .sort()/.append() calls to variables" }], "preInterviewChecklist": ["Explain shallow vs deep copy", "Explain amortized O(1) list append"], "nextTopics": [{ "title": "Tuple Immutability", "whyNext": "Learn fixed immutable sequences using tuples." }] })
wjson(M, L, 'cheatsheet.json', { "printNote": "List Operations Reference", "sections": [{ "heading": "List Slicing & Methods", "entries": [{ "syntax": "lst[start:stop:step]", "example": "lst[::-1]", "description": "Reverse list slice" }] }] })
wjson(M, L, 'resources.json', { "links": [{ "type": "official", "title": "Python List Data Structure", "url": "https://docs.python.org/3/tutorial/datastructures.html#more-on-lists" }] })
wjson(M, L, 'videos.json', [{ "title": "Python Lists & Slicing Complete Guide", "video_id": "W8KRzm-HUcc", "url": "https://www.youtube.com/watch?v=W8KRzm-HUcc", "channel": "Corey Schafer", "duration": "12m", "description": "Complete tutorial on Python lists, methods, and slicing." }])


# ══════════════════════════════════════════════════════════════
# 2. lists_tuples / tuple_immutability
# ══════════════════════════════════════════════════════════════

L = 'tuple_immutability'

wjson(M, L, 'beginner.json', {
  "whyExists": "Lists are great for mutable collections, but sometimes data should be protected from accidental modification — like geographic coordinates `(latitude, longitude)`, database records, or dictionary keys. Python `tuple` is an immutable sequence that cannot be modified after creation.",
  "curiosityQuestion": "Why can tuples be used as dictionary keys while lists cannot?",
  "problemItSolves": "Guarantees data integrity, prevents accidental mutation bugs, and allows sequences to be hashable (usable as dict keys or set elements).",
  "realWorldAnalogy": "A tuple is like a sealed, stamped birth certificate: once issued, the information cannot be altered without creating a new official document.",
  "simpleExplanation": "In Python:\n- Tuples use parentheses: `point = (10, 20)`.\n- Single-element tuples require a trailing comma: `single = (42,)`.\n- Access items by index: `point[0]` is 10.\n- Immutable: `point[0] = 99` raises TypeError.",
  "syntaxExplanation": "point = (10, 20)\nx, y = point  # Tuple unpacking!\nprint(f'X: {x}, Y: {y}')\n\n# Single element tuple:\none_item = (5,)  # Comma is required!",
  "examples": [
    {
      "title": "Tuple Unpacking & Immutability",
      "code": "location = (37.7749, -122.4194)  # SF coords\nlat, lon = location\nprint(f'Latitude: {lat}, Longitude: {lon}')\n\n# Location[0] = 0  # TypeError: 'tuple' object does not support item assignment",
      "explanation": "Demonstrates tuple unpacking into `lat` and `lon`, and enforces immutability.",
      "language": "python"
    }
  ],
  "visualDiagram": "```mermaid\nflowchart LR\n    T[\"Tuple (10, 20)\"] --> Index0[\"Index 0: 10 (Locked)\"]\n    T --> Index1[\"Index 1: 20 (Locked)\"]\n```",
  "stepByStepExecution": [
    { "step": 1, "action": "x, y = (10, 20)", "explanation": "Unpacks tuple element 0 into x (10) and element 1 into y (20)." }
  ],
  "memoryDiagram": { "stack": "[Immutable Tuple Reference]\n  Points to fixed memory block allocated once at creation", "heap": "N/A" },
  "namingRules": ["Use descriptive tuple names for fixed record structures."],
  "commonMistakes": [
    "Writing `x = (5)` and expecting a tuple (without comma, it's just an integer `5`!). Must write `(5,)`.",
    "Expecting to append or remove items from a tuple."
  ]
})
wjson(M, L, 'intermediate.json', {
  "deeperExplanation": "Tuples are slightly faster and consume less memory than lists because CPython allocates exact memory size once during creation. A tuple is hashable (has a `__hash__()` method) ONLY if all of its contained elements are also hashable. If a tuple contains a mutable list `(1, [2, 3])`, the tuple itself cannot be hashed!",
  "internalImplementation": "CPython maintains a free-list cache for small tuples (up to size 20) to speed up creation/allocation.",
  "examples": [
    {
      "code": "# Tuple with Mutable Objects\ntup = (1, [2, 3])\ntup[1].append(4)  # Modifies nested list inside tuple!\nprint(tup)         # (1, [2, 3, 4])\n# hash(tup)        # TypeError: unhashable type: 'list'",
      "explanation": "While tuple reference array is immutable, nested mutable objects inside can still mutate, making tuple unhashable."
    }
  ],
  "performanceConsiderations": { "timeComplexity": "Creation & Indexing O(1).", "spaceComplexity": "Saves 16-24 bytes memory compared to equivalent list." },
  "debuggingWalkthrough": {
    "bugDescription": "Creating single element parenthesis expression instead of tuple.",
    "incorrectCode": "item = ('apple')  # Type is str!\nprint(type(item)) # <class 'str'>",
    "correctCode": "item = ('apple',) # Trailing comma creates tuple\nprint(type(item)) # <class 'tuple'>"
  },
  "bestPractices": [
    "Use tuples for heterogeneous records `(name, age, email)`.",
    "Use namedtuples (`collections.namedtuple`) for self-documenting tuple fields."
  ]
})
wjson(M, L, 'expert.json', { "examples": [{ "code": "# collections.namedtuple for self-documenting data structures\nfrom collections import namedtuple\nPoint = namedtuple('Point', ['x', 'y'])\np = Point(x=10, y=20)\nprint(f'X={p.x}, Y={p.y}')  # Access by field name or index p[0]", "explanation": "namedtuple provides tuple memory efficiency + attribute name access." }] })
wjson(M, L, 'quiz.json', { "mcqs": [{ "id": "q1", "question": "How do you create a tuple with a single element in Python?", "options": ["(element,)", "(element)", "[element]", "tuple[element]"], "answer": 0, "explanation": "A trailing comma `(element,)` is required to distinguish a 1-element tuple from parenthesized expression.", "difficulty": "beginner" }], "checkpoints": [{ "id": "cp1", "question": "True or False: A tuple containing a list can be used as a dictionary key.", "answer": False, "explanation": "False. A tuple is hashable only if all its elements are hashable." }] })
wjson(M, L, 'practice.json', {
  "easy": { "title": "Swap Variables using Tuple Unpacking", "description": "Write `swap(a, b)` returning `(b, a)` using single-line tuple unpacking.", "starterCode": "def swap(a, b):\n    pass", "expectedOutput": "(20, 10)", "solution": "def swap(a, b):\n    return b, a", "hints": ["Return b, a"], "difficulty": "easy" },
  "medium": { "title": "Distance Between 2D Points", "description": "Calculate Euclidean distance between points `p1=(x1,y1)` and `p2=(x2,y2)`.", "starterCode": "import math\ndef distance(p1, p2):\n    pass", "expectedOutput": "5.0", "solution": "import math\ndef distance(p1, p2):\n    x1, y1 = p1\n    x2, y2 = p2\n    return math.sqrt((x2 - x1)**2 + (y2 - y1)**2)", "hints": ["Unpack tuple coordinates first"], "difficulty": "medium" },
  "hard": { "title": "Immutable RGB Palette Generator", "description": "Create namedtuple `Color(r, g, b)` and return list of hex strings.", "starterCode": "from collections import namedtuple\ndef colors_to_hex(color_list):\n    pass", "expectedOutput": "['#ff0000']", "solution": "from collections import namedtuple\nColor = namedtuple('Color', ['r', 'g', 'b'])\ndef colors_to_hex(color_list):\n    return [f'#{c.r:02x}{c.g:02x}{c.b:02x}' for c in color_list]", "hints": ["Use :02x format specifier"], "difficulty": "hard" },
  "debugging": { "title": "Fix Single Tuple Syntax", "description": "Fix string type return when tuple expected.", "buggyCode": "def get_singleton(val):\n    return (val)", "fixedCode": "def get_singleton(val):\n    return (val,)", "bugs": ["`(val)` without comma evaluates to type of val. Add trailing comma `(val,)`."] }
})
wjson(M, L, 'interview.json', { "questions": [{ "question": "Why are tuples faster than lists in Python?", "answer": "Tuples are immutable, allowing CPython to allocate a fixed-size memory block upfront without over-allocation padding. They also benefit from CPython's internal free-list memory caching.", "level": "intermediate" }] })
wjson(M, L, 'project.json', {
  "title": "GPS Coordinate Track Tracker", "tagline": "Immutable telemetry data recorder", "description": "Record telemetry track logs using immutable namedtuple structures.", "learningGoals": ["Immutability for telemetry data audit trails"],
  "requirements": ["Store timestamp, lat, lon in namedtuple"], "starterCode": "from collections import namedtuple\n# Create Telemetry namedtuple", "solution": "from collections import namedtuple\nTelemetry = namedtuple('Telemetry', ['timestamp', 'lat', 'lon'])\n\ndef create_log(ts, lat, lon):\n    return Telemetry(timestamp=ts, lat=lat, lon=lon)",
  "solutionExpl": "Uses immutable namedtuple ensuring historical GPS telemetry cannot be tampered with.", "expectedOutput": "Telemetry(timestamp='12:00', lat=37.77, lon=-122.41)", "extensions": ["Calculate total distance traveled along track"]
})
wjson(M, L, 'revision.json', { "summary": "Tuples are immutable sequences created with `()`. Require trailing comma for 1-element tuples `(x,)`. Usable as dict keys if hashable.", "oneLineSummary": "Tuples are immutable fixed-size sequences ideal for records and dict keys.", "keyTakeaways": ["Immutability protects data integrity.", "(x,) creates single element tuple.", "Unpacking syntax `x, y = point`."], "memoryTricks": [{ "concept": "Tuples", "trick": "Tuple = Fixed Lockbox. Once shut, you can't swap what's inside." }], "commonErrors": [{ "error": "TypeError: 'tuple' object does not support item assignment", "cause": "Trying to modify tuple index", "fix": "Construct a new tuple instead" }], "preInterviewChecklist": ["Explain why single-element tuple needs comma"], "nextTopics": [{ "title": "List Comprehensions", "whyNext": "Learn concise syntax for constructing lists." }] })
wjson(M, L, 'cheatsheet.json', { "printNote": "Tuple Reference", "sections": [{ "heading": "Tuple Syntax", "entries": [{ "syntax": "tup = (1, 2)", "example": "a, b = tup", "description": "Tuple creation and unpacking" }] }] })
wjson(M, L, 'resources.json', { "links": [{ "type": "official", "title": "Python Tuples", "url": "https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences" }] })
wjson(M, L, 'videos.json', [{ "title": "Python Tuples and Immutability", "video_id": "NI2646mwxn0", "url": "https://www.youtube.com/watch?v=NI2646mwxn0", "channel": "Corey Schafer", "duration": "8m", "description": "Complete guide to Python tuples and immutability." }])


# ══════════════════════════════════════════════════════════════
# 3. lists_tuples / list_comprehensions
# ══════════════════════════════════════════════════════════════

L = 'list_comprehensions'

wjson(M, L, 'beginner.json', {
  "whyExists": "Building a new list by transforming or filtering elements from an existing list using standard `for` loops requires 3-5 lines of code. Python's `list comprehension` offers a single, elegant line of syntax to construct lists dynamically.",
  "curiosityQuestion": "Are list comprehensions just cleaner syntax, or do they actually run faster than traditional `for` loops in Python?",
  "problemItSolves": "Reduces boilerplate code for mapping, filtering, and flattening sequences.",
  "realWorldAnalogy": "A automated coffee filter: instead of picking out coffee grounds one by one by hand (`for` loop), you pour the mixture through a filter cone in one single motion (list comprehension).",
  "simpleExplanation": "Syntax:\n`[expression for item in iterable if condition]`\n- `expression`: what goes into the new list.\n- `for item in iterable`: the loop.\n- `if condition`: optional filter.",
  "syntaxExplanation": "nums = [1, 2, 3, 4]\n# Traditional:\nsquares = []\nfor n in nums:\n    squares.append(n ** 2)\n\n# List Comprehension:\nsquares = [n ** 2 for n in nums]  # [1, 4, 9, 16]\nevens = [n for n in nums if n % 2 == 0]  # [2, 4]",
  "examples": [
    {
      "title": "Mapping and Filtering Lists",
      "code": "words = ['hello', 'world', 'python']\nuppers = [w.upper() for w in words if len(w) > 5]\nprint(uppers)  # ['PYTHON']",
      "explanation": "Filters words with length > 5, then transforms matching words to uppercase.",
      "language": "python"
    }
  ],
  "visualDiagram": "```mermaid\nflowchart LR\n    Input[\"[1, 2, 3, 4]\"] --> Filter[\"if n % 2 == 0\"]\n    Filter --> Transform[\"n ** 2\"]\n    Transform --> Output[\"[4, 16]\"]\n```",
  "stepByStepExecution": [
    { "step": 1, "action": "Evaluate `if n % 2 == 0`", "explanation": "Keeps 2 and 4." },
    { "step": 2, "action": "Evaluate `n ** 2`", "explanation": "2^2=4, 4^2=16. Constructs [4, 16]." }
  ],
  "memoryDiagram": { "stack": "Optimized C-level list creation bytecode frame", "heap": "N/A" },
  "namingRules": ["Keep list comprehensions short; if longer than 1 line, use standard loop."],
  "commonMistakes": [
    "Over-complicating comprehensions with nested ternary conditionals and multiple loops (unreadable!).",
    "Using list comprehension for side effects (like calling `print()`) instead of returning a new list."
  ]
})
wjson(M, L, 'intermediate.json', {
  "deeperExplanation": "List comprehensions run faster than traditional `.append()` loops in CPython because element appending is executed directly in optimized C bytecodes (`LIST_APPEND`), avoiding python-level method lookup overhead.",
  "internalImplementation": "CPython uses the `LIST_APPEND` bytecode instruction inside comprehension frames.",
  "examples": [
    {
      "code": "# Flattening 2D Matrix with Nested Comprehension\nmatrix = [[1, 2], [3, 4], [5, 6]]\nflat = [num for row in matrix for num in row]\nprint(flat)  # [1, 2, 3, 4, 5, 6]",
      "explanation": "Outer loop `for row in matrix` comes first, followed by inner loop `for num in row`."
    }
  ],
  "performanceConsiderations": { "timeComplexity": "O(N) — roughly 20-30% faster than explicit for-loop append.", "spaceComplexity": "O(N) memory allocation for new list." },
  "debuggingWalkthrough": {
    "bugDescription": "Confusing filter `if` position with ternary `if-else` position.",
    "incorrectCode": "# Trying to use if-else at the end:\n[x ** 2 for x in nums if x > 0 else 0]  # SyntaxError!",
    "correctCode": "# Ternary if-else goes BEFORE 'for':\n[x ** 2 if x > 0 else 0 for x in nums]\n# Filter if goes AFTER 'for':\n[x ** 2 for x in nums if x > 0]"
  },
  "bestPractices": [
    "Use list comprehension when creating a new list from an iterable.",
    "If comprehension exceeds 2 loops or 80 characters, refactor into standard for loop."
  ]
})
wjson(M, L, 'expert.json', { "examples": [{ "code": "# Generator Expression vs List Comprehension Memory Test\nimport sys\nlist_comp = [x ** 2 for x in range(100000)]\ngen_exp = (x ** 2 for x in range(100000))\nprint('List Comp Bytes:', sys.getsizeof(list_comp)) # ~800,000 bytes\nprint('Gen Exp Bytes:', sys.getsizeof(gen_exp))     # ~200 bytes", "explanation": "Generator expressions `(...)` compute items lazily on demand, consuming minimal memory." }] })
wjson(M, L, 'quiz.json', { "mcqs": [{ "id": "q1", "question": "Where does a ternary `if-else` placement go in a list comprehension?", "options": ["Before the `for` keyword", "After the `for` keyword", "At the very end of comprehension", "Not allowed in comprehensions"], "answer": 0, "explanation": "Ternary expressions `X if cond else Y` go before `for`. Filtering `if cond` goes after `for`.", "difficulty": "intermediate" }], "checkpoints": [{ "id": "cp1", "question": "True or False: List comprehensions are generally faster than standard for-loops using `.append()` in CPython.", "answer": True, "explanation": "True. List comprehensions use optimized `LIST_APPEND` bytecode instructions." }] })
wjson(M, L, 'practice.json', {
  "easy": { "title": "Square Even Numbers", "description": "Return squares of even numbers from input list using list comprehension.", "starterCode": "def square_evens(nums):\n    pass", "expectedOutput": "[4, 16]", "solution": "def square_evens(nums):\n    return [x**2 for x in nums if x % 2 == 0]", "hints": ["Use x**2 for x in nums if x % 2 == 0"], "difficulty": "easy" },
  "medium": { "title": "Vowel Stripper", "description": "Remove all vowels from string and return list of remaining lowercase characters.", "starterCode": "def strip_vowels(s):\n    pass", "expectedOutput": "['h', 'l', 'l', 'w', 'r', 'l', 'd']", "solution": "def strip_vowels(s):\n    vowels = set('aeiouAEIOU')\n    return [c.lower() for c in s if c.isalnum() and c not in vowels]", "hints": ["Filter out c in vowels"], "difficulty": "medium" },
  "hard": { "title": "Pythagorean Triples Generator", "description": "Generate list of tuples `(a, b, c)` such that `a^2 + b^2 = c^2` for 1 <= a < b < c <= N.", "starterCode": "def pythagorean_triples(n):\n    pass", "expectedOutput": "[(3, 4, 5)]", "solution": "def pythagorean_triples(n):\n    return [(a, b, c) for a in range(1, n+1) for b in range(a+1, n+1) for c in range(b+1, n+1) if a**2 + b**2 == c**2]", "hints": ["Use 3 nested for clauses in comprehension"], "difficulty": "hard" },
  "debugging": { "title": "Fix SyntaxError in Filter", "description": "Fix placement of filter condition.", "buggyCode": "res = [x for x in range(10) if x % 2 == 0 else 'odd']", "fixedCode": "res = [x if x % 2 == 0 else 'odd' for x in range(10)]", "bugs": ["Ternary `if-else` must precede `for` clause."] }
})
wjson(M, L, 'interview.json', { "questions": [{ "question": "When should you NOT use a list comprehension in Python?", "answer": "Avoid list comprehensions when: (1) The expression is overly complex or nested > 2 levels deep, (2) You only need side-effects without building a list, (3) Memory is constrained and a generator expression `(...)` should be used instead.", "level": "intermediate" }] })
wjson(M, L, 'project.json', {
  "title": "CSV Data Cleaning Pipeline", "tagline": "Compact data transformation suite", "description": "Clean raw CSV data rows (strip whitespace, parse floats, drop empty entries) using comprehensions.", "learningGoals": ["Data transformation pipelines using comprehensions"],
  "requirements": ["Parse numeric strings to floats", "Filter out invalid rows"], "starterCode": "def clean_csv_rows(raw_rows):\n    pass", "solution": "def clean_csv_rows(raw_rows):\n    return [[float(val.strip()) for val in row.split(',') if val.strip().replace('.','',1).isdigit()] for row in raw_rows if row.strip()]",
  "solutionExpl": "Cleans and converts raw CSV string rows using nested list comprehensions.", "expectedOutput": "[[10.5, 20.0]]", "extensions": ["Add header column map"]
})
wjson(M, L, 'revision.json', { "summary": "List comprehensions construct lists concisely: `[expr for item in sequence if cond]`. Faster than append loops.", "oneLineSummary": "List comprehension: concise `[expr for item in iter if cond]` syntax for building lists.", "keyTakeaways": ["Faster than loop append.", "Ternary goes before `for`, filter goes after `for`."], "memoryTricks": [{ "concept": "Comprehension Syntax", "trick": "[WHAT_TO_KEEP for ITEM in LIST if FILTER]" }], "commonErrors": [{ "error": "SyntaxError with if-else at end", "cause": "Placing ternary else clause after for", "fix": "Move ternary expression before `for` keyword" }], "preInterviewChecklist": ["Explain list comprehension vs generator expression"], "nextTopics": [{ "title": "Dictionaries & Sets", "whyNext": "Learn key-value mappings and unique sets." }] })
wjson(M, L, 'cheatsheet.json', { "printNote": "List Comprehension Reference", "sections": [{ "heading": "Comprehension Syntax", "entries": [{ "syntax": "[x**2 for x in nums if x > 0]", "example": "[x for x in range(5)]", "description": "Concise list creation" }] }] })
wjson(M, L, 'resources.json', { "links": [{ "type": "official", "title": "Python List Comprehensions", "url": "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions" }] })
wjson(M, L, 'videos.json', [{ "title": "Python List Comprehensions Tutorial", "video_id": "3dt4OGnU5sM", "url": "https://www.youtube.com/watch?v=3dt4OGnU5sM", "channel": "Corey Schafer", "duration": "14m", "description": "Mastering list comprehensions, map, filter, and generator expressions." }])


# ══════════════════════════════════════════════════════════════
# 4. dictionaries_sets / key_value_pairs
# ══════════════════════════════════════════════════════════════

M = 'dictionaries_sets'
L = 'key_value_pairs'

wjson(M, L, 'beginner.json', {
  "whyExists": "Storing collections by integer index (like lists) is great for ordered lists, but real-world data is indexed by meaningful names — looking up a user by `username`, a product by `SKU`, or a word by `definition`. Python `dict` stores key-value pairs, providing O(1) instant lookups by key.",
  "curiosityQuestion": "How can Python look up any key in a dictionary containing 10,000,000 items instantly in O(1) time?",
  "problemItSolves": "Eliminates O(N) linear search scans when querying attributes or records by unique identifiers.",
  "realWorldAnalogy": "A physical dictionary book: you look up the word 'Python' (Key) to immediately read its definition (Value). You don't read every page from start to end.",
  "simpleExplanation": "In Python:\n- Dictionaries use curly braces with colons: `user = {'name': 'Alice', 'age': 25}`.\n- Access values by key: `user['name']` returns `'Alice'`.\n- Add or update keys: `user['age'] = 26`.\n- Use `.get(key, default)` to avoid KeyError when key might not exist.",
  "syntaxExplanation": "student = {'id': 101, 'name': 'Bob'}\nprint(student['name'])          # 'Bob'\nprint(student.get('age', 18))   # Returns 18 (default, no error!)\nstudent['grade'] = 'A'          # Add new key-value pair",
  "examples": [
    {
      "title": "Dictionary Operations & Safety",
      "code": "user = {'username': 'coder123', 'email': 'coder@example.com'}\nprint(user.get('role', 'standard')) # 'standard'\n\nfor key, val in user.items():\n    print(f'{key}: {val}')",
      "explanation": "`.get()` provides fallback value. `.items()` yields `(key, value)` pairs for looping.",
      "language": "python"
    }
  ],
  "visualDiagram": "```mermaid\nflowchart LR\n    Key[\"'username'\"] --> Hash[\"hash('username')\"]\n    Hash --> Bucket[\"Bucket Slot 4\"]\n    Bucket --> Value[\"'coder123'\"]\n```",
  "stepByStepExecution": [
    { "step": 1, "action": "user['username']", "explanation": "Hashes 'username', jumps to bucket index, returns 'coder123' in O(1) time." }
  ],
  "memoryDiagram": { "stack": "[Dict Reference]\n  Points to sparse hash table containing key-value pointers", "heap": "N/A" },
  "namingRules": ["Use descriptive singular nouns for dictionary records (`user`, `config`)."],
  "commonMistakes": [
    "Accessing a missing key using `d['missing']`, raising a KeyError. Use `d.get('missing')` instead.",
    "Using a mutable list as a dictionary key (KeyError/TypeError: unhashable type: 'list')."
  ]
})
wjson(M, L, 'intermediate.json', {
  "deeperExplanation": "Python 3.6+ dictionaries preserve insertion order. CPython implements dictionaries as compact hash tables: a dense array of `(hash, key, value)` entries plus a sparse indices table, reducing memory footprint by 20-25%.",
  "internalImplementation": "Lookups calculate `hash(key) % capacity`. Collisions are resolved using open addressing with quadratic probing.",
  "examples": [
    {
      "code": "# Dict Merging Patterns (Python 3.9+ | operator)\ndefault_config = {'theme': 'light', 'fontsize': 14}\nuser_config = {'theme': 'dark'}\n\n# Merge using | operator\nfinal_config = default_config | user_config\nprint(final_config)  # {'theme': 'dark', 'fontsize': 14}",
      "explanation": "The `|` union operator merges two dicts, with values on the right overriding the left."
    }
  ],
  "performanceConsiderations": { "timeComplexity": "Key lookup, insertion, deletion are O(1) average.", "spaceComplexity": "O(N) with ~30% hash table overhead." },
  "debuggingWalkthrough": {
    "bugDescription": "Crashing with KeyError when accessing optional dictionary keys.",
    "incorrectCode": "data = {'name': 'Alice'}\nprint(data['age'])  # KeyError: 'age'",
    "correctCode": "data = {'name': 'Alice'}\nprint(data.get('age', 0))  # Returns default 0 safely"
  },
  "bestPractices": [
    "Use `.get()` or `collections.defaultdict` to handle missing keys gracefully.",
    "Use dictionary unpacking `{**d1, **d2}` or `d1 | d2` for merging configs."
  ]
})
wjson(M, L, 'expert.json', { "examples": [{ "code": "from collections import defaultdict\n# Grouping items cleanly with defaultdict\ngroups = defaultdict(list)\nwords = ['apple', 'apricot', 'banana', 'blueberry']\nfor w in words:\n    groups[w[0]].append(w)\nprint(dict(groups)) # {'a': ['apple', 'apricot'], 'b': ['banana', 'blueberry']}", "explanation": "`defaultdict(list)` automatically initializes empty list for new keys upon access." }] })
wjson(M, L, 'quiz.json', { "mcqs": [{ "id": "q1", "question": "Which object CANNOT be used as a dictionary key?", "options": ["List `[1, 2]`", "Tuple `(1, 2)`", "String `'key'`", "Integer `42`"], "answer": 0, "explanation": "Dictionary keys must be hashable (immutable). Lists are mutable and unhashable.", "difficulty": "beginner" }], "checkpoints": [{ "id": "cp1", "question": "True or False: As of Python 3.7+, standard dictionaries preserve key insertion order.", "answer": True, "explanation": "True. Insertion order preservation is an official Python language spec guarantee." }] })
wjson(M, L, 'practice.json', {
  "easy": { "title": "Character Frequency Map", "description": "Return dictionary mapping each char to its frequency.", "starterCode": "def count_chars(s):\n    pass", "expectedOutput": "{'a': 2}", "solution": "def count_chars(s):\n    counts = {}\n    for c in s:\n        counts[c] = counts.get(c, 0) + 1\n    return counts", "hints": ["Use counts.get(c, 0) + 1"], "difficulty": "easy" },
  "medium": { "title": "Invert Dictionary", "description": "Invert dict keys and values (assume unique values). `{'a': 1}` -> `{1: 'a'}`.", "starterCode": "def invert_dict(d):\n    pass", "expectedOutput": "{1: 'a'}", "solution": "def invert_dict(d):\n    return {v: k for k, v in d.items()}", "hints": ["Use dict comprehension {v: k for k, v in d.items()}"], "difficulty": "medium" },
  "hard": { "title": "Deep Nested Dict Getter", "description": "Write `get_nested(d, path_str, default=None)` where path_str is `'user.profile.name'`.", "starterCode": "def get_nested(d, path_str, default=None):\n    pass", "expectedOutput": "'Alice'", "solution": "def get_nested(d, path_str, default=None):\n    keys = path_str.split('.')\n    curr = d\n    for k in keys:\n        if isinstance(curr, dict) and k in curr:\n            curr = curr[k]\n        else:\n            return default\n    return curr", "hints": ["Split path string by '.' and traverse"], "difficulty": "hard" },
  "debugging": { "title": "Fix Unhashable Key Error", "description": "Fix TypeError trying to use list as dict key.", "buggyCode": "d = {}\nkey = [1, 2]\nd[key] = 'val'", "fixedCode": "d = {}\nkey = (1, 2)\nd[key] = 'val'", "bugs": ["Lists are unhashable. Convert key list to immutable tuple `(1, 2)`."] }
})
wjson(M, L, 'interview.json', { "questions": [{ "question": "How does Python dictionary collision resolution work?", "answer": "CPython uses open addressing with pseudo-random probing. When `hash(key) % capacity` hits an occupied slot with a different key, Python calculates secondary probe indices until an empty slot or matching key is found.", "level": "advanced" }] })
wjson(M, L, 'project.json', {
  "title": "JSON Config Store Manager", "tagline": "Key-value setting management engine", "description": "Build a configuration manager loading defaults, applying user overrides, and looking up nested keys.", "learningGoals": ["Dictionary manipulation & merging"],
  "requirements": ["Merge default and user dicts", "Provide safe key lookup"], "starterCode": "class ConfigStore:\n    def __init__(self, defaults): self.cfg = defaults", "solution": "class ConfigStore:\n    def __init__(self, defaults):\n        self.cfg = dict(defaults)\n    def update(self, overrides):\n        self.cfg |= overrides\n    def get(self, key, default=None):\n        return self.cfg.get(key, default)",
  "solutionExpl": "Uses dict union operator `|` to apply settings overrides.", "expectedOutput": "'dark'", "extensions": ["Save settings to JSON file"]
})
wjson(M, L, 'revision.json', { "summary": "Dictionaries store key-value pairs with O(1) lookup. Keys must be hashable. Access safely with `.get()`.", "oneLineSummary": "Dictionaries provide fast O(1) key-value storage and preserve insertion order.", "keyTakeaways": ["Keys must be immutable.", ".get() avoids KeyError.", "Python 3.7+ preserves insertion order."], "memoryTricks": [{ "concept": "Dict Lookup", "trick": "Key = Coat Check Ticket. Hand the ticket to get your exact coat instantly." }], "commonErrors": [{ "error": "KeyError", "cause": "Direct bracket access for missing key `d['bad']`", "fix": "Use `d.get('bad', default)`" }], "preInterviewChecklist": ["Explain dict hash table implementation"], "nextTopics": [{ "title": "Set Operations", "whyNext": "Learn unique element collection operations." }] })
wjson(M, L, 'cheatsheet.json', { "printNote": "Dictionary Reference", "sections": [{ "heading": "Dict Operations", "entries": [{ "syntax": "d.get(k, default)", "example": "d.get('age', 0)", "description": "Safe key lookup" }] }] })
wjson(M, L, 'resources.json', { "links": [{ "type": "official", "title": "Python Dictionary Data Structure", "url": "https://docs.python.org/3/tutorial/datastructures.html#dictionaries" }] })
wjson(M, L, 'videos.json', [{ "title": "Python Dictionaries - Working with Key-Value Pairs", "video_id": "daefaLgNkw0", "url": "https://www.youtube.com/watch?v=daefaLgNkw0", "channel": "Corey Schafer", "duration": "10m", "description": "Complete guide to Python dictionaries and methods." }])


# ══════════════════════════════════════════════════════════════
# 5. dictionaries_sets / set_operations
# ══════════════════════════════════════════════════════════════

L = 'set_operations'

wjson(M, L, 'beginner.json', {
  "whyExists": "When working with collections, you frequently need to eliminate duplicate items or perform mathematical set operations (find common elements, differences, or combinations). Python `set` is an unordered collection of unique, hashable elements.",
  "curiosityQuestion": "How does converting a list of 1,000,000 items to a `set` instantly remove all duplicate items?",
  "problemItSolves": "Provides automatic duplicate removal and O(1) membership testing (`x in my_set`).",
  "realWorldAnalogy": "A bag of unique marbles: if you try to put a second blue marble into the bag, the bag rejects it — it only holds one of each color.",
  "simpleExplanation": "In Python:\n- Sets use curly braces: `s = {1, 2, 3}` (empty set must be `set()`, not `{}`).\n- Unique items only: `{1, 1, 2}` becomes `{1, 2}`.\n- Fast membership check: `'apple' in fruit_set` takes O(1) time.",
  "syntaxExplanation": "a = {1, 2, 3}\nb = {3, 4, 5}\nprint(a | b)  # Union: {1, 2, 3, 4, 5}\nprint(a & b)  # Intersection: {3}\nprint(a - b)  # Difference: {1, 2}",
  "examples": [
    {
      "title": "Deduplication & Set Operators",
      "code": "raw_tags = ['python', 'coding', 'python', 'web']\nunique_tags = set(raw_tags)\nprint(unique_tags)  # {'python', 'coding', 'web'}\n\nadmin_users = {'alice', 'bob'}\nactive_users = {'bob', 'charlie'}\nprint('Active Admins:', admin_users & active_users)  # {'bob'}",
      "explanation": "`set()` strips duplicates automatically. `&` finds common elements (intersection).",
      "language": "python"
    }
  ],
  "visualDiagram": "```mermaid\nflowchart LR\n    SetA[\"Set A: {1, 2}\"] --- Int[\"Intersection (&): {2}\"] --- SetB[\"Set B: {2, 3}\"]\n```",
  "stepByStepExecution": [
    { "step": 1, "action": "admin_users & active_users", "explanation": "Evaluates intersection, returning set containing only 'bob'." }
  ],
  "memoryDiagram": { "stack": "[Set Reference]\n  Points to hash table storing unique key references without values", "heap": "N/A" },
  "namingRules": ["Use plural names for set collections (`tags`, `unique_ids`)."],
  "commonMistakes": [
    "Writing `{}` to create an empty set (creates an empty dictionary `{}`! Use `set()`).",
    "Expecting set elements to remain in a specific ordered sequence."
  ]
})
wjson(M, L, 'intermediate.json', {
  "deeperExplanation": "Python sets are implemented as hash tables without values (keys only). Membership testing (`x in set`) is O(1) average time complexity, compared to O(N) linear search for lists.",
  "internalImplementation": "Frozenset (`frozenset()`) is the immutable, hashable variant of a set, allowing sets to be stored inside other sets or used as dict keys.",
  "examples": [
    {
      "code": "# Set Operations Comparison Methods vs Operators\ns1 = {1, 2}\ns2 = {2, 3}\nprint(s1.union(s2))        # {1, 2, 3} (accepts any iterable)\nprint(s1.intersection(s2)) # {2}\nprint(s1.difference(s2))   # {1}\nprint(s1.symmetric_difference(s2)) # {1, 3}",
      "explanation": "Method versions (e.g. `.union()`) accept any iterable as argument, unlike bitwise operators which require sets on both sides."
    }
  ],
  "performanceConsiderations": { "timeComplexity": "Add, remove, in-check are O(1) average. Set operations (union/intersection) are O(len(s1) + len(s2)).", "spaceComplexity": "O(N)" },
  "debuggingWalkthrough": {
    "bugDescription": "Creating empty dict instead of empty set.",
    "incorrectCode": "s = {}\ns.add(1)  # AttributeError: 'dict' object has no attribute 'add'",
    "correctCode": "s = set()\ns.add(1)  # Works correctly"
  },
  "bestPractices": [
    "Use sets when checking membership (`item in collection`) frequently in large datasets.",
    "Use `frozenset()` when immutable set data is needed for dict keys."
  ]
})
wjson(M, L, 'expert.json', { "examples": [{ "code": "# Fast Set Operations for Large Datasets\nallowed_ip_set = {f'192.168.1.{i}' for i in range(1, 100000)}\n# Checking 1,000 incoming requests against set takes ~0.0001s (O(1) per check)", "explanation": "Using set lookup for IP blacklists/whitelists is orders of magnitude faster than list search." }] })
wjson(M, L, 'quiz.json', { "mcqs": [{ "id": "q1", "question": "How do you create an empty set in Python?", "options": ["set()", "{}", "set({})", "[]"], "answer": 0, "explanation": "`{}` creates an empty dictionary. `set()` creates an empty set.", "difficulty": "beginner" }], "checkpoints": [{ "id": "cp1", "question": "True or False: Checking membership `x in s` takes O(1) average time for a set.", "answer": True, "explanation": "True. Set membership testing uses O(1) hash table lookups." }] })
wjson(M, L, 'practice.json', {
  "easy": { "title": "Deduplicate & Sort", "description": "Return sorted list of unique elements from input list.", "starterCode": "def unique_sorted(lst):\n    pass", "expectedOutput": "[1, 2, 3]", "solution": "def unique_sorted(lst):\n    return sorted(set(lst))", "hints": ["Combine set() and sorted()"], "difficulty": "easy" },
  "medium": { "title": "Common & Unique Tags", "description": "Given two lists of tags, return tuple `(common_set, total_unique_set)`.", "starterCode": "def process_tags(tags1, tags2):\n    pass", "expectedOutput": "({'b'}, {'a', 'b', 'c'})", "solution": "def process_tags(tags1, tags2):\n    s1, s2 = set(tags1), set(tags2)\n    return (s1 & s2, s1 | s2)", "hints": ["Use & for intersection and | for union"], "difficulty": "medium" },
  "hard": { "title": "Find Missing and Duplicate Number", "description": "Given array of 1..N with one missing and one duplicate, find both using sets.", "starterCode": "def find_error_nums(nums):\n    pass", "expectedOutput": "(2, 3)", "solution": "def find_error_nums(nums):\n    n = len(nums)\n    expected_set = set(range(1, n + 1))\n    actual_set = set()\n    duplicate = -1\n    for x in nums:\n        if x in actual_set:\n            duplicate = x\n        actual_set.add(x)\n    missing = list(expected_set - actual_set)[0]\n    return (duplicate, missing)", "hints": ["Use set difference to find missing element"], "difficulty": "hard" },
  "debugging": { "title": "Fix Empty Set Bug", "description": "Fix AttributeError on empty set initialization.", "buggyCode": "my_set = {}\nmy_set.add('item')", "fixedCode": "my_set = set()\nmy_set.add('item')", "bugs": ["`{}` creates dict, not set. Change initialization to `set()`."] }
})
wjson(M, L, 'interview.json', { "questions": [{ "question": "What is the difference between a `set` and a `frozenset` in Python?", "answer": "`set` is mutable (supports `.add()`, `.remove()`) and unhashable. `frozenset` is immutable and hashable, allowing it to be used as a dictionary key or stored inside another set.", "level": "intermediate" }] })
wjson(M, L, 'project.json', {
  "title": "Access Permission Overlap Engine", "tagline": "Role-based access matrix comparator", "description": "Compare user permissions against required security roles using set intersection/difference.", "learningGoals": ["Set algebra for access control"],
  "requirements": ["Find missing permissions for required role"], "starterCode": "def check_permissions(user_perms, role_perms):\n    pass", "solution": "def check_permissions(user_perms, role_perms):\n    u, r = set(user_perms), set(role_perms)\n    missing = r - u\n    return {\n        'has_access': len(missing) == 0,\n        'missing': list(missing),\n        'extra': list(u - r)\n    }",
  "solutionExpl": "Uses set difference `-` to compute missing and extra user permissions.", "expectedOutput": "{'has_access': False, 'missing': ['write'], 'extra': []}", "extensions": ["Support multi-role aggregation"]
})
wjson(M, L, 'revision.json', { "summary": "Sets store unique, hashable elements with O(1) lookups. Use `set()` for empty sets. Operations: `|` (union), `&` (intersection), `-` (difference).", "oneLineSummary": "Sets store unique elements and perform O(1) membership checks and mathematical set algebra.", "keyTakeaways": ["set() for empty set.", "O(1) membership testing (`x in set`).", "frozenset is the immutable variant."], "memoryTricks": [{ "concept": "Set Operators", "trick": "& = AND (Intersection), | = OR (Union), - = SUBTRACT (Difference)." }], "commonErrors": [{ "error": "AttributeError on dict", "cause": "Using `{}` for empty set", "fix": "Use `set()` instead" }], "preInterviewChecklist": ["Explain set vs frozenset"], "nextTopics": [{ "title": "Dictionary Comprehensions", "whyNext": "Construct dynamic dictionaries concisely." }] })
wjson(M, L, 'cheatsheet.json', { "printNote": "Set Operations Reference", "sections": [{ "heading": "Set Operators", "entries": [{ "syntax": "a & b | c - d", "example": "{1,2} & {2,3} -> {2}", "description": "Set intersection, union, difference" }] }] })
wjson(M, L, 'resources.json', { "links": [{ "type": "official", "title": "Python Set Types", "url": "https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset" }] })
wjson(M, L, 'videos.json', [{ "title": "Python Sets - Tuples, Sets, and Disjoint Sets", "video_id": "r3R3h5ly_8g", "url": "https://www.youtube.com/watch?v=r3R3h5ly_8g", "channel": "Corey Schafer", "duration": "10m", "description": "Complete guide to sets and set operations in Python." }])


# ══════════════════════════════════════════════════════════════
# 6. dictionaries_sets / dictionary_comprehensions
# ══════════════════════════════════════════════════════════════

L = 'dictionary_comprehensions'

wjson(M, L, 'beginner.json', {
  "whyExists": "Just like list comprehensions build lists in a single line, `dictionary comprehensions` build dictionaries dynamically from iterables using a concise, inline syntax: `{key_expr: val_expr for item in iterable}`.",
  "curiosityQuestion": "How do you swap keys and values in a dictionary using a single line of Python?",
  "problemItSolves": "Eliminates multi-line loops for mapping, transforming, or filtering key-value data structures.",
  "realWorldAnalogy": "A phonebook update machine: you feed in a list of contact cards, and the machine automatically prints a indexed directory (dict) matching each name to a phone number.",
  "simpleExplanation": "Syntax:\n`{key_expr: value_expr for item in iterable if condition}`",
  "syntaxExplanation": "nums = [1, 2, 3]\n# Create dict mapping number -> square:\nsquares = {x: x**2 for x in nums}  # {1: 1, 2: 4, 3: 9}",
  "examples": [
    {
      "title": "Mapping and Filtering Dictionaries",
      "code": "prices_usd = {'apple': 1.0, 'banana': 0.5, 'kiwi': 2.0}\n# Convert to EUR and filter items >= 1.0\nprices_eur = {item: price * 0.9 for item, price in prices_usd.items() if price >= 1.0}\nprint(prices_eur)  # {'apple': 0.9, 'kiwi': 1.8}",
      "explanation": "Filters items with price >= 1.0 and applies 0.9 exchange multiplier.",
      "language": "python"
    }
  ],
  "visualDiagram": "```mermaid\nflowchart LR\n    Input[\"prices_usd\"] --> Filter[\"if price >= 1.0\"]\n    Filter --> Transform[\"{item: price * 0.9}\"]\n    Transform --> Output[\"prices_eur\"]\n```",
  "stepByStepExecution": [
    { "step": 1, "action": "Iterate `.items()`", "explanation": "Filter 'banana' (0.5 < 1.0). Convert 'apple' and 'kiwi'." }
  ],
  "memoryDiagram": { "stack": "Evaluates bytecode into new dict object frame", "heap": "N/A" },
  "namingRules": ["Keep dict comprehensions readable; avoid excessive nesting."],
  "commonMistakes": [
    "Forgetting the colon `:` separating key and value expressions inside `{}`.",
    "Overwriting duplicate keys silently (last key evaluated wins!)."
  ]
})
wjson(M, L, 'intermediate.json', {
  "deeperExplanation": "Dictionary comprehensions create a new dictionary in a single bytecode execution pass. Duplicate keys during iteration overwrite previous entries without throwing errors.",
  "internalImplementation": "CPython uses the `MAP_ADD` bytecode instruction inside dictionary comprehension frames.",
  "examples": [
    {
      "code": "# Inverting a Dictionary with Dict Comprehension\noriginal = {'a': 1, 'b': 2, 'c': 3}\ninverted = {v: k for k, v in original.items()}\nprint(inverted)  # {1: 'a', 2: 'b', 3: 'c'}",
      "explanation": "Swaps keys and values into a new inverted dictionary structure."
    }
  ],
  "performanceConsiderations": { "timeComplexity": "O(N) iteration time.", "spaceComplexity": "O(N) memory allocation." },
  "debuggingWalkthrough": {
    "bugDescription": "Accidentally creating a set instead of a dict due to missing colon.",
    "incorrectCode": "s = {x for x in range(3)}  # Set: {0, 1, 2}",
    "correctCode": "d = {x: x*2 for x in range(3)}  # Dict: {0: 0, 1: 2, 2: 4}"
  },
  "bestPractices": [
    "Use dict comprehensions for filtering or transforming existing dictionary records.",
    "Be mindful of key collision when inverting dictionaries with duplicate values."
  ]
})
wjson(M, L, 'expert.json', { "examples": [{ "code": "# Grouping with Dict Comprehension and Sets\nwords = ['apple', 'apricot', 'banana', 'bare', 'cat']\ngrouped = {c: [w for w in words if w.startswith(c)] for c in set(w[0] for w in words)}\nprint(grouped)", "explanation": "Nested comprehension grouping words by starting letter key." }] })
wjson(M, L, 'quiz.json', { "mcqs": [{ "id": "q1", "question": "What separates the key expression from the value expression in a dict comprehension?", "options": [": (colon)", "= (equals)", "-> (arrow)", ", (comma)"], "answer": 0, "explanation": "Dict comprehensions use `{key: value for ...}` syntax.", "difficulty": "beginner" }], "checkpoints": [{ "id": "cp1", "question": "True or False: If duplicate keys are produced in a dict comprehension, the last key-value pair overwrites earlier ones.", "answer": True, "explanation": "True. Later duplicate key evaluations overwrite prior entries." }] })
wjson(M, L, 'practice.json', {
  "easy": { "title": "Word Length Map", "description": "Given list of words, return dict mapping `word: len(word)` using dict comprehension.", "starterCode": "def word_lengths(words):\n    pass", "expectedOutput": "{'cat': 3}", "solution": "def word_lengths(words):\n    return {w: len(w) for w in words}", "hints": ["Use {w: len(w) for w in words}"], "difficulty": "easy" },
  "medium": { "title": "Filter Passing Grades", "description": "Given dict `{'Alice': 85, 'Bob': 45}`, return dict of students with score >= 50.", "starterCode": "def filter_passing(scores):\n    pass", "expectedOutput": "{'Alice': 85}", "solution": "def filter_passing(scores):\n    return {k: v for k, v in scores.items() if v >= 50}", "hints": ["Iterate scores.items() with if v >= 50"], "difficulty": "medium" },
  "hard": { "title": "Count Character Occurrences", "description": "Build frequency dict for string using set and count in dict comprehension.", "starterCode": "def char_freq_comp(s):\n    pass", "expectedOutput": "{'a': 2}", "solution": "def char_freq_comp(s):\n    return {c: s.count(c) for c in set(s)}", "hints": ["Iterate set(s) to avoid redundant counts"], "difficulty": "hard" },
  "debugging": { "title": "Fix Missing Colon Syntax", "description": "Fix SyntaxError in dict comprehension.", "buggyCode": "d = {x, x**2 for x in range(3)}", "fixedCode": "d = {x: x**2 for x in range(3)}", "bugs": ["Comma used instead of colon `:` between key and value."] }
})
wjson(M, L, 'interview.json', { "questions": [{ "question": "Compare memory and speed of dict comprehension vs `dict(zip(keys, values))`.", "answer": "`dict(zip(keys, values))` is faster when merging two existing parallel sequences. Dict comprehensions are better when transforming or filtering keys/values during construction.", "level": "intermediate" }] })
wjson(M, L, 'project.json', {
  "title": "API Payload Normalizer", "tagline": "Dynamic API data sanitizer", "description": "Sanitize API response payload dict (lowercase keys, strip values, drop None) using dict comprehension.", "learningGoals": ["Data normalization via dict comprehensions"],
  "requirements": ["Lowercase keys, strip string values, filter None values"], "starterCode": "def sanitize_payload(payload):\n    pass", "solution": "def sanitize_payload(payload):\n    return {k.lower(): (v.strip() if isinstance(v, str) else v) for k, v in payload.items() if v is not None}",
  "solutionExpl": "Applies key lowercasing, string stripping, and None filtering in one comprehension.", "expectedOutput": "{'name': 'Alice'}", "extensions": ["Support nested payload dictionary cleaning"]
})
wjson(M, L, 'revision.json', { "summary": "Dict comprehensions construct dicts in one line: `{k: v for item in iter if cond}`. Requires colon `:` between key and value.", "oneLineSummary": "Dict comprehensions build dynamic dictionaries using `{k: v for item in iter}` syntax.", "keyTakeaways": ["Requires colon between key and value.", "Duplicate keys overwrite earlier entries.", "Can invert dicts with `{v: k}`."], "memoryTricks": [{ "concept": "Dict Comp", "trick": "{KEY: VALUE for ITEM in ITERABLE}" }], "commonErrors": [{ "error": "SyntaxError", "cause": "Using comma instead of colon between key and value", "fix": "Use `{k: v ...}`" }], "preInterviewChecklist": ["Demonstrate inverting a dict with dict comprehension"], "nextTopics": [{ "title": "Exception Handling", "whyNext": "Learn robust error handling with try-except blocks." }] })
wjson(M, L, 'cheatsheet.json', { "printNote": "Dict Comprehension Reference", "sections": [{ "heading": "Dict Comprehension", "entries": [{ "syntax": "{k: v for k, v in d.items() if v > 0}", "example": "{x: x**2 for x in range(3)}", "description": "Inline dict construction" }] }] })
wjson(M, L, 'resources.json', { "links": [{ "type": "official", "title": "Python Dict Comprehensions", "url": "https://docs.python.org/3/tutorial/datastructures.html#dictionaries" }] })
wjson(M, L, 'videos.json', [{ "title": "Python Dictionary Comprehensions", "video_id": "3dt4OGnU5sM", "url": "https://www.youtube.com/watch?v=3dt4OGnU5sM", "channel": "Corey Schafer", "duration": "8m", "description": "Guide to dictionary comprehensions and practical use cases." }])

print("\n✅ Batch 5 complete! Written:\n  - lists_tuples/list_operations\n  - lists_tuples/tuple_immutability\n  - lists_tuples/list_comprehensions\n  - dictionaries_sets/key_value_pairs\n  - dictionaries_sets/set_operations\n  - dictionaries_sets/dictionary_comprehensions")
