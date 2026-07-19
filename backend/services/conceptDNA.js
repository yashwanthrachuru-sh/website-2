// ============================================================
// backend/services/conceptDNA.js
// EduNet Human Teaching Engine — Concept DNA Registry
// ============================================================
'use strict';

const DNA_REGISTRY = {
  'Python Introduction': {
    concept: 'Python Introduction',
    category: 'Python Basics',
    difficulty: 'Beginner',
    purpose: 'Understand what Python is, why Guido created it, and run your first program.',
    problemSolved: 'Low-level computer instructions are complex and unreadable for humans. Python provides a language that reads like simple English.',
    realLifeAnalogy: 'Speaking to a translator at the United Nations who translates your English thoughts directly into a foreign language in real-time.',
    computerView: 'The Python Interpreter reads source files, compiles them into intermediate bytecode, and executes them step-by-step inside the Python Virtual Machine (PVM) runtime loop.',
    usedIn: ['Instagram Web Platform', 'YouTube Video Streaming', 'Spotify Recommendations Engine'],
    commonMistakes: [
      { wrong: 'print "Hello World"', reason: 'Python 3 requires parentheses for printing. Failing to use parentheses raises a SyntaxError.' }
    ],
    bestPractices: [
      'Verify that Python is added to your environment variables (PATH) during installation.',
      'Always run scripts using python3 to avoid compatibility problems with Python 2.'
    ],
    interviewTopics: [
      'Bytecode compilation versus machine code interpretation',
      'Role of the Python Virtual Machine (PVM)'
    ]
  },
  'Variables': {
    concept: 'Variables',
    category: 'Variables & Memory',
    difficulty: 'Beginner',
    purpose: 'Store and label changing data in computer memory.',
    problemSolved: 'Without variables, programs would have to read raw hardware addresses or hardcode values, preventing dynamic updates like scores or totals.',
    realLifeAnalogy: 'Labeled cardboard boxes on a storage shelf. You put items inside, write a label on the outside, and can change the contents anytime.',
    computerView: 'When declared, the execution engine reserves a specific slot in RAM (typically Stack memory for primitives). The variable name maps to that address, and operations write or read binary bits.',
    usedIn: ['Amazon Shopping Carts', 'Spotify Streaks', 'Player Health Bars'],
    commonMistakes: [
      { wrong: 'score = 100\nprint(scroe)', reason: 'Typo in variable name throws a NameError/ReferenceError because the slot label index is unregistered.' }
    ],
    bestPractices: [
      'Use descriptive, self-documenting names (e.g. student_score instead of s).',
      'Prefer constant declarations if the value should not change during execution.'
    ],
    interviewTopics: [
      'Scope lifespans (Local vs Global)',
      'Variable hoisting and Temporal Dead Zones in compile phases'
    ]
  },
  'Constants': {
    concept: 'Constants',
    category: 'Variables & Memory',
    difficulty: 'Beginner',
    purpose: 'Declare read-only values that must not change during runtime.',
    problemSolved: 'Accidental modifications to values like tax rates, mathematical PI, or configuration keys, which breaks safety and predictability.',
    realLifeAnalogy: 'A birth date on a birth certificate. Once written, it remains identical and cannot be altered.',
    computerView: 'The compiler writes the variable into a read-only segment of memory or marks its reference address as locked. Reassignment attempts throw runtime compiler errors.',
    usedIn: ['App Config Files', 'API Gateways', 'Physics Engine Constants (GRAVITY)'],
    commonMistakes: [
      { wrong: 'const tax_rate = 0.05;\ntax_rate = 0.08;', reason: 'Modifying a constant variable throws a TypeError: Assignment to constant variable.' }
    ],
    bestPractices: [
      'Declare variable names in uppercase with underscores to identify constants visually.',
      'Always default to constants unless you are certain the value will change.'
    ],
    interviewTopics: [
      'Difference between mutable references and constant pointer bindings',
      'Compile-time optimization of constant folding'
    ]
  },
  'If Statements': {
    concept: 'If Statements',
    category: 'Control Flow',
    difficulty: 'Beginner',
    purpose: 'Route execution paths based on conditional conditions.',
    problemSolved: 'Linear code execution where the program counter executes every instruction sequentially. If statements allow branching logic.',
    realLifeAnalogy: 'A traffic signal. If the light is Green, you drive. If it is Red, you stop.',
    computerView: 'The CPU evaluates the comparison condition, sets the zero status register, and uses jump flags to alter the program counter address.',
    usedIn: ['Login Validation Gates', 'Age restrictions on YouTube', 'Checking checkout balances'],
    commonMistakes: [
      { wrong: 'if balance = 10:\n  print("True")', reason: 'Using a single equals sign performs assignment instead of logical comparison, leading to compilation alerts.' }
    ],
    bestPractices: [
      'Perform check conditions for boundary checks first (fail fast).',
      'Avoid deeply nesting conditions. Extract validation checks to helper methods.'
    ],
    interviewTopics: [
      'Short-circuit logical evaluations (&& / and, || / or)',
      'Boolean truthy and falsy rules across types'
    ]
  },
  'Loops': {
    concept: 'Loops',
    category: 'Control Flow',
    difficulty: 'Beginner',
    purpose: 'Repeat statement blocks while a condition remains True.',
    problemSolved: 'Manually duplicating lines of code to process list elements, which bloats scripts and limits size limits.',
    realLifeAnalogy: 'Doing morning exercise repetitions. You repeat jumping jacks until the counter hit 20.',
    computerView: 'The CPU sets up a jump loop structure. After running the code block, it updates the counter and evaluates the loop condition to jump back.',
    usedIn: ['Spotify Playlist Playback', 'Search indexing engines', 'Rendering rows of images'],
    commonMistakes: [
      { wrong: 'while loop_counter < 5:\n  print("Repetition")', reason: 'Forgetting to increment the loop counter keeps the evaluation true, creating an infinite loop that locks the browser/CPU.' }
    ],
    bestPractices: [
      'Ensure loop exit checks are reachable under every execution branch.',
      'Do not place heavy database calls or heavy file queries inside loop scopes.'
    ],
    interviewTopics: [
      'Time complexity differences of nested loops (O(N^2))',
      'Breaking out of loops vs skipping steps (break vs continue)'
    ]
  },
  'Functions': {
    concept: 'Functions',
    category: 'Variables & Memory',
    difficulty: 'Beginner',
    purpose: 'Package reusable blocks of execution logic under a single name.',
    problemSolved: 'Scattering copy-pasted blocks of arithmetic or validation algorithms across files, which makes updates impossible.',
    realLifeAnalogy: 'A coffee machine. You insert coffee beans and milk (inputs), the machine runs internal processing, and outputs a latte.',
    computerView: 'Calling triggers pushes a stack frame containing arguments, local variables, and the return address. When returning, the frame is popped and execution returns to the caller.',
    usedIn: ['Tax Calculation modules', 'Image processing algorithms', 'E-commerce totals'],
    commonMistakes: [
      { wrong: 'def add(price):\n  res = price + 5\n\ntotal = add(10)\nprint(total)', reason: 'Omitting the return statement executes the calculation, but outputs undefined or None.' }
    ],
    bestPractices: [
      'Follow the Single Responsibility Principle: a function should accomplish exactly one task.',
      'Aim to keep functions short (fewer than 30 lines) for testability.'
    ],
    interviewTopics: [
      'Scope closures and execution variables bindings',
      'Call stack mechanics and stack overflow limits'
    ]
  },
  'Arrays': {
    concept: 'Arrays',
    category: 'Data Structures',
    difficulty: 'Beginner',
    purpose: 'Store list elements sequentially in contiguous memory blocks.',
    problemSolved: 'Declaring countless separate variables like score1, score2, score3, which makes searching or sorting impossible.',
    realLifeAnalogy: 'A bookshelf holding slots of books side-by-side. You access the third book directly by pointing to slot 2.',
    computerView: 'Reserves a single contiguous block of addresses in memory. Element lookup is extremely fast (O(1)) since the memory position matches: base address + index * element size.',
    usedIn: ['Movie Playlists', 'Leaderboards', 'Product Inventory Rows'],
    commonMistakes: [
      { wrong: 'let list = [1,2];\nconsole.log(list[2]);', reason: 'Accessing indices beyond array size bounds returns undefined or throws index out of range.' }
    ],
    bestPractices: [
      'Use arrays when you need to access items directly by position.',
      'Avoid resizing arrays frequently in performance-critical loops due to copy overheads.'
    ],
    interviewTopics: [
      'Time complexity of search (O(N)) vs insertion/deletion (O(N))',
      'Dynamic array resizing algorithms (doubling factors)'
    ]
  },
  'Objects': {
    concept: 'Objects',
    category: 'Object-Oriented Programming',
    difficulty: 'Beginner',
    purpose: 'Group related states (attributes) and actions (methods) together.',
    problemSolved: 'Managing variables in separation (e.g. username, user_age, user_email). Objects group data into structured packages.',
    realLifeAnalogy: 'A physical car. It has states (color, fuel level) and behaviors (accelerate, brake).',
    computerView: 'Allocates space on the memory Heap. The variables point to the heap address where a property name map coordinates state records.',
    usedIn: ['User Account Profiles', 'Game Entity characters', 'E-commerce Checkout Models'],
    commonMistakes: [
      { wrong: 'let user = null;\nconsole.log(user.username);', reason: 'Reading properties from empty or null references causes a NullPointerException/TypeError.' }
    ],
    bestPractices: [
      'Keep properties private and interact with them using public getter/setter methods (encapsulation).',
      'Use self-descriptive key names.'
    ],
    interviewTopics: [
      'Memory differences between reference variables (Heap) and local values (Stack)',
      'Prototype inheritance vs class structures'
    ]
  },
  'Classes': {
    concept: 'Classes',
    category: 'Object-Oriented Programming',
    difficulty: 'Intermediate',
    purpose: 'Provide a blueprint structure to instantiate similar objects easily.',
    problemSolved: 'Manually duplicating structure schemas for thousands of user profiles or products. Classes automate structure creation.',
    realLifeAnalogy: 'A blueprint drawing for a house. The blueprint shows standard room sizes, but you can build many houses from it.',
    computerView: 'The engine registers the class constructor logic and prototype mapping table. Instantiation creates a template object copy from the schema.',
    usedIn: ['Spotify Account Creators', 'RPG Character Factories', 'Payment Gateways'],
    commonMistakes: [
      { wrong: 'class User:\n  def __init__(self, name):\n    username = name', reason: 'Forgetting to bind fields to "self" creates temporary local variables instead of saving property states.' }
    ],
    bestPractices: [
      'Initialize class structures with a constructor method.',
      'Favor composition over deep inheritance hierarchy trees.'
    ],
    interviewTopics: [
      'Difference between Class blueprints and Object instances',
      'Static methods/variables vs instance properties'
    ]
  },
  'Inheritance': {
    concept: 'Inheritance',
    category: 'Object-Oriented Programming',
    difficulty: 'Intermediate',
    purpose: 'Enable a child class to reuse methods and fields from a parent class.',
    problemSolved: 'Duplicating fields like name, ID, and authentication methods across subclasses like Student and Teacher.',
    realLifeAnalogy: 'Family traits. You inherit features (e.g. eye color) from parents but add your own unique traits.',
    computerView: 'Subclasses link their prototype index pointer to parent blueprints, chaining lookup steps up the inheritance ladder.',
    usedIn: ['UI Button layouts inheriting from generic components', 'Role management permissions', 'Game elements'],
    commonMistakes: [
      { wrong: 'class Dog extends Animal {\n  constructor() {}\n}', reason: 'Not calling super() inside subclasses constructor prevents parent properties initialization, causing errors.' }
    ],
    bestPractices: [
      'Only use inheritance when a strict "is-a" relationship applies (e.g. a Dog IS an Animal).',
      'Limit hierarchy depth to 2 or 3 layers.'
    ],
    interviewTopics: [
      'Super constructors and method overriding rules',
      'Why multiple inheritance is restricted in standard languages (Diamond problem)'
    ]
  },
  'Polymorphism': {
    concept: 'Polymorphism',
    category: 'Object-Oriented Programming',
    difficulty: 'Advanced',
    purpose: 'Allow different classes to be treated through the same parent interface.',
    problemSolved: 'Writing complex switch statements to run custom methods for separate subclass instances.',
    realLifeAnalogy: 'A universal remote. Pressing the "Power" button sends the command, but different devices react in their own way.',
    computerView: 'The compile engine routes calls dynamically. During runtime execution, it queries the object type and executes the specific subclass override.',
    usedIn: ['Graphics rendering shapes', 'Payment gateways processing card/PayPal/cash inputs', 'Media players'],
    commonMistakes: [
      { wrong: 'class Shape:\n  def draw(self): pass\n# Typo override:\nclass Circle(Shape):\n  def draww(self): print("Circle")', reason: 'Typing parent method names incorrectly creates a new method instead of overriding the parent one.' }
    ],
    bestPractices: [
      'Use override keyword flags to let compilers catch syntax mistakes.',
      'Design software around abstract interfaces instead of specific implementation classes.'
    ],
    interviewTopics: [
      'Dynamic method dispatch vs static method overloading',
      'Abstract classes vs Interfaces'
    ]
  },
  'SQL JOIN': {
    concept: 'SQL JOIN',
    category: 'Database Management',
    difficulty: 'Intermediate',
    purpose: 'Combine records from multiple database tables based on a related column.',
    problemSolved: 'Storing duplicate customer details in every order row, which corrupts databases and bloats storage.',
    realLifeAnalogy: 'Merging related columns in two Excel worksheets using a shared ID column (like VLOOKUP).',
    computerView: 'The query engine parses joint tables, reads relational keys, performs comparison matches (like nested loop or hash match), and compiles a temporary results view.',
    usedIn: ['Retrieving Customer Profiles along with Order Histories', 'Linking student grades to class catalogs', 'User permissions'],
    commonMistakes: [
      { wrong: 'SELECT * FROM orders JOIN customers;', reason: 'Omitting the "ON" match key condition creates a cross join (Cartesian product) matching every order to every customer.' }
    ],
    bestPractices: [
      'Always add indexes to keys used in table joints to speed up lookup checks.',
      'Specify inner vs outer joins depending on how rows with missing keys should behave.'
    ],
    interviewTopics: [
      'Differences between INNER, LEFT, RIGHT, and FULL joins',
      'JOIN execution strategies (Hash Join, Merge Join, Nested Loops)'
    ]
  },
  'REST API': {
    concept: 'REST API',
    category: 'Web Development',
    difficulty: 'Intermediate',
    purpose: 'Exchange data securely between client frontends and backend servers.',
    problemSolved: 'Hardcoupling client platforms to local database scripts. APIs let apps exchange JSON data over standard HTTP.',
    realLifeAnalogy: 'A restaurant waiter. You order food from the menu (request), the waiter takes it to the kitchen (server), and brings back your dish (response).',
    computerView: 'The client sends structured JSON bytes over TCP. The API server routes the request through express middleware, connects to databases, and writes response status frames.',
    usedIn: ['Instagram feed requests', 'Weather forecast widgets', 'Google Maps route planning'],
    commonMistakes: [
      { wrong: 'fetch("/api/users", {method: "POST"})\n// but no parameters sent', reason: 'Calling post routes without sending inputs causes database verification to fail.' }
    ],
    bestPractices: [
      'Use proper HTTP verb rules (GET to read, POST to write, PUT to edit, DELETE to remove).',
      'Always validate and sanitize incoming client inputs to prevent system injections.'
    ],
    interviewTopics: [
      'Idempotent HTTP request verbs',
      'Standard HTTP status code series (2xx, 3xx, 4xx, 5xx)'
    ]
  },
  'JSON': {
    concept: 'JSON',
    category: 'Web Development',
    difficulty: 'Beginner',
    purpose: 'Format data as structured key-value text for server communication.',
    problemSolved: 'Exchanging complex objects in custom text formats that are difficult to parse and standardize.',
    realLifeAnalogy: 'A physical application form. It contains labeled fields (Name, Age) where inputs are written clearly.',
    computerView: 'Converts objects to raw UTF-8 string bytes (serialization) to transmit over network streams, and parses them back into objects (deserialization) on receipt.',
    usedIn: ['HTTP Request bodies', 'Local configurations settings', 'GitHub APIs responses'],
    commonMistakes: [
      { wrong: '{ name: "Student", age: 10 }', reason: 'Invalid JSON requires double quotes around both keys and values, e.g., {"name": "Student", "age": 10}.' }
    ],
    bestPractices: [
      'Validate JSON syntax before sending payloads.',
      'Do not serialize circular reference graphs.'
    ],
    interviewTopics: [
      'JSON serialization vs deserialization performance constraints',
      'Standard syntax validation rules'
    ]
  },
  'Pointers': {
    concept: 'Pointers',
    category: 'System Programming',
    difficulty: 'Intermediate',
    purpose: 'Store the exact physical memory address of another variable.',
    problemSolved: 'Copying large arrays or objects during function calls, which duplicates variables and exhausts system RAM.',
    realLifeAnalogy: 'A home address written on a notepad. Passing the notepad doesn\'t copy the house, it just tells someone where to find it.',
    computerView: 'A pointer variable holds a hex address (e.g. 0x7ffd53) representing a physical slot in RAM. Dereferencing tells the CPU to read values from that slot.',
    usedIn: ['C/C++ memory management', 'Game engine engines', 'High-throughput system programming'],
    commonMistakes: [
      { wrong: 'int *ptr;\n*ptr = 100;', reason: 'Writing to an uninitialized pointer (wild pointer) attempts to write to a random address, causing a segmentation fault crash.' }
    ],
    bestPractices: [
      'Always initialize pointers to NULL or nullptr to prevent memory safety issues.',
      'Match pointer allocations with free/delete commands to avoid memory leaks.'
    ],
    interviewTopics: [
      'Pass-by-value vs Pass-by-reference mechanics',
      'Pointer arithmetic and dereferencing arrays'
    ]
  },
    bestPractices: [
      'Always write and test the base case condition first before writing recursive logic.',
      'Prefer standard iteration loops if call stacks risk exceeding limits.'
    ],
    interviewTopics: [
      'Base cases vs recursive cases',
      'Stack overflow reasons and call limits'
    ]
  },
  'Strings': {
    concept: 'Strings',
    category: 'Data Structures',
    difficulty: 'Beginner',
    purpose: 'Store and manipulate collections of characters.',
    problemSolved: 'Handling raw user text, filenames, configuration keys, or network socket payloads without character sequences structures.',
    realLifeAnalogy: 'A beaded necklace. Each bead is a character, and the thread holds them in a specific sequential order.',
    computerView: 'Strings are stored in memory as contiguous character byte arrays. In some runtimes (like Java), strings are immutable and pooled to save space.',
    usedIn: ['Search bars', 'URL routing paths', 'JSON configuration parsers'],
    commonMistakes: [
      { wrong: 'str[0] = "A" // in JS/Python', reason: 'Strings are immutable in JS/Python. Attempting direct modification fails silently or throws TypeErrors.' }
    ],
    bestPractices: [
      'Use StringBuilder/join() when concatenating strings inside loops to avoid intermediate memory copies.',
      'Use strict comparisons (===) for text equality evaluations.'
    ],
    interviewTopics: [
      'String mutability and Constant Pools',
      'Substring search algorithms (KMP, Rabin-Karp)'
    ]
  },
  'Linked Lists': {
    concept: 'Linked Lists',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    purpose: 'Store list elements dynamically using node addresses and links.',
    problemSolved: 'Array sizing rigidity and expensive O(N) element shifts on middle additions or deletions.',
    realLifeAnalogy: 'A scavenger hunt map. Each location has a clue detailing the memory location of the next clue.',
    computerView: 'Nodes are scattered in memory (Heap). A node object holds a value field and a pointer field referencing the next node address.',
    usedIn: ['Browser hist (Forward/Back buttons)', 'Music playlist managers', 'OS task queues'],
    commonMistakes: [
      { wrong: 'curr = head\nwhile curr:\n  // missing curr = curr.next', reason: 'Forgetting to increment the node reference cursor causes an infinite traversal loop.' }
    ],
    bestPractices: [
      'Always check for empty head list pointers (NullPointer guards) before traversing.',
      'Use dummy head nodes to simplify insertion and deletion corner cases.'
    ],
    interviewTopics: [
      'Singly vs Doubly Linked list structures',
      'Runner technique (Fast & Slow pointer checks)'
    ]
  },
  'Stacks': {
    concept: 'Stacks',
    category: 'Data Structures',
    difficulty: 'Beginner',
    purpose: 'Store items under Last-In, First-Out (LIFO) access rules.',
    problemSolved: 'Reverting states or walking back logic tracks (like Undo history) without LIFO data bounds.',
    realLifeAnalogy: 'A stack of dinner plates. You place new plates on top, and can only retrieve plates from the top.',
    computerView: 'Allocates sequential memory or linked nodes. The Stack Pointer (SP) points to the top index, moving on push/pop operations.',
    usedIn: ['Compiler call stacks', 'Undo (Ctrl+Z) histories', 'Parentheses syntax validators'],
    commonMistakes: [
      { wrong: 'val = stack.pop() // on empty stack', reason: 'Popping from empty stacks triggers stack underflow exceptions.' }
    ],
    bestPractices: [
      'Verify that stack size exceeds zero before executing pop operations.',
      'Limit recursion depth to avoid compile call stack overflows.'
    ],
    interviewTopics: [
      'LIFO execution protocols',
      'Implementing stack objects using dynamic arrays vs linked nodes'
    ]
  },
  'Queues': {
    concept: 'Queues',
    category: 'Data Structures',
    difficulty: 'Beginner',
    purpose: 'Store items under First-In, First-Out (FIFO) access rules.',
    problemSolved: 'Processing shared system requests (like print jobs) out of order, violating fair wait-times.',
    realLifeAnalogy: 'A line of customers waiting at a checkout. The customer at the front is served first.',
    computerView: 'Maintains index trackers for front and rear boundary coordinates. Circular buffers reuse indices to prevent space wastage.',
    usedIn: ['Printer job buffers', 'Asynchronous queue handlers', 'Web traffic load balance queues'],
    commonMistakes: [
      { wrong: 'queue[rear] = val // without checking size', reason: 'Inserting into full static queue buffers causes queue overflow exceptions.' }
    ],
    bestPractices: [
      'Use circular array configurations to optimize index reuse during enqueue/dequeue operations.',
      'Implement concurrency locks when queues are accessed across threads.'
    ],
    interviewTopics: [
      'FIFO queue mechanics',
      'Circular arrays queues vs double-ended queues (Deques)'
    ]
  },
  'Trees': {
    concept: 'Trees',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    purpose: 'Store hierarchical data values using node relationships.',
    problemSolved: 'Representing organic nested relationships (like filesystem directories) inside flat linear lists.',
    realLifeAnalogy: 'A corporate organization chart. The CEO is at the root, leading down to directors, managers, and employees.',
    computerView: 'Nodes reside on the heap, holding arrays or lists of pointers referencing child node addresses.',
    usedIn: ['File Explorer folder directories', 'DOM node trees', 'XML/HTML parsers'],
    commonMistakes: [
      { wrong: 'root.left.val // when root.left is null', reason: 'Failing to assert node pointer existence before querying properties raises null pointer exceptions.' }
    ],
    bestPractices: [
      'Write recursive traversals (preorder, inorder, postorder) to navigate levels cleanly.',
      'Maintain balance metrics to keep lookup operations fast.'
    ],
    interviewTopics: [
      'Binary trees vs generic N-ary trees',
      'Time complexity of balanced vs skewed trees'
    ]
  },
  'Binary Search Trees': {
    concept: 'Binary Search Trees',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    purpose: 'Maintain sorted node structures enabling logarithmic search times.',
    problemSolved: 'Linear search O(N) overhead on unsorted collections and expensive array insertions.',
    realLifeAnalogy: 'A phonebook split method. To find "John", you open the middle, determine if "John" is before or after, and discard the other half.',
    computerView: 'A tree where every node satisfies: Left child value < Node value < Right child value. Permits O(log N) lookups.',
    usedIn: ['Database index files', 'Symbol tables in compilers', 'Dynamic sorted sets'],
    commonMistakes: [
      { wrong: 'insert(val) // without balancing', reason: 'Inserting sorted inputs yields a skewed tree (linked list equivalent), degrading lookup times to linear O(N).' }
    ],
    bestPractices: [
      'Use self-balancing variants (like AVL or Red-Black trees) in high-throughput database systems.',
      'Verify that traversals return in-order sorted elements.'
    ],
    interviewTopics: [
      'BST search, insertion, and deletion algorithms',
      'Self-balancing tree mechanics (rotations)'
    ]
  },
  'Heaps': {
    concept: 'Heaps',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    purpose: 'Retrieve the maximum or minimum element in constant O(1) time.',
    problemSolved: 'Finding the highest-priority item in sorting arrays dynamically, which incurs linear O(N) search overhead.',
    realLifeAnalogy: 'An emergency room triage. Incoming patients are scored by severity, and the most critical patient is treated next.',
    computerView: 'A complete binary tree mapped compact into a flat array. Parent-child indexes match formulas: Left = 2i + 1, Right = 2i + 2.',
    usedIn: ['Priority queues', 'Heapsort algorithm', 'OS scheduler queues'],
    commonMistakes: [
      { wrong: 'heap[0] = val // without heapifying', reason: 'Direct index mutations break heap balance constraints. Elements must bubble up/down.' }
    ],
    bestPractices: [
      'Utilize array structures for heaps to save pointer memory overhead.',
      'Implement heapify-down on deletion to restore balance values.'
    ],
    interviewTopics: [
      'Min-heap vs Max-heap structures',
      'Time complexity of heapify operations (O(log N))'
    ]
  },
  'Graphs': {
    concept: 'Graphs',
    category: 'Data Structures',
    difficulty: 'Advanced',
    purpose: 'Represent network relations between vertices and edges.',
    problemSolved: 'Modeling multi-relational maps (like route networks or friendships) using rigid grid designs.',
    realLifeAnalogy: 'A train route map. Cities are vertices (nodes) and track lanes are edges connecting them.',
    computerView: 'Represented using Adjacency Lists (array of linked lists) or Adjacency Matrices (2D arrays matching boolean connections).',
    usedIn: ['Google Maps routing', 'Facebook friend networks', 'Recommender engines'],
    commonMistakes: [
      { wrong: 'dfs(node) // without tracking visited nodes', reason: 'Traversing cyclic graphs without tracking visited list nodes triggers infinite loops and stack overflows.' }
    ],
    bestPractices: [
      'Use visited boolean sets to avoid evaluating nodes repeatedly.',
      'Prefer adjacency lists for sparse graphs to save memory space.'
    ],
    interviewTopics: [
      'BFS (queue-based) vs DFS (stack-based) traversals',
      'Adjacency List vs Adjacency Matrix space profiles'
    ]
  },
  'Hash Tables': {
    concept: 'Hash Tables',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    purpose: 'Store key-value pairs enabling constant O(1) lookup speeds.',
    problemSolved: 'Scanning arrays sequentially O(N) to match keys against attributes.',
    realLifeAnalogy: 'A library layout. Books are stored in aisles matching genres; you calculate the aisle coordinate from the category name.',
    computerView: 'Uses a hash function to map keys to array index coordinates. Collisions are handled using chaining (linked lists) or open addressing.',
    usedIn: ['Database caches', 'Compiler symbol lookups', 'Browser cookie storage maps'],
    commonMistakes: [
      { wrong: 'hash = key % size // when size is even', reason: 'Using weak hash functions or non-prime array sizes leads to high collision clusters.' }
    ],
    bestPractices: [
      'Ensure hash tables resize (rehash) when the load factor exceeds 0.7.',
      'Use prime numbers for hash table sizes to distribute index mappings evenly.'
    ],
    interviewTopics: [
      'Hash collisions resolution techniques (Chaining vs Open Addressing)',
      'Time complexity degradation from O(1) to O(N) on collisions'
    ]
  },
  'Sorting Algorithms': {
    concept: 'Sorting Algorithms',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    purpose: 'Arrange elements in chronological or numerical order.',
    problemSolved: 'Searching through unsorted arrays, which requires O(N) sequential search scans instead of O(log N) binary search checks.',
    realLifeAnalogy: 'Organizing a deck of playing cards from smallest to largest value in your hand.',
    computerView: 'Manipulates array elements in-place or via divide-and-conquer recurse trees, swapping coordinates to match comparisons.',
    usedIn: ['Database index creation', 'Google Search result sorting', 'E-commerce filters'],
    commonMistakes: [
      { wrong: 'sort() // on mixed data types', reason: 'Comparing mismatched data types raises type errors or inconsistent sort distributions.' }
    ],
    bestPractices: [
      'Use Quick Sort for general in-memory sorting; use Merge Sort when stability is required.',
      'Avoid quadratic O(N^2) sorting algorithms (like Bubble Sort) on large datasets.'
    ],
    interviewTopics: [
      'Time and Space complexities of Quick, Merge, and Heap Sort',
      'Stable vs Unstable sorting algorithms definition'
    ]
  },
  'Searching Algorithms': {
    concept: 'Searching Algorithms',
    category: 'Algorithms',
    difficulty: 'Beginner',
    purpose: 'Locate target values inside arrays or collections.',
    problemSolved: 'Scanning massive files without indexed search patterns, locking processor threads.',
    realLifeAnalogy: 'Looking for a word in a dictionary. Instead of reading page 1, 2, 3 sequentially, you split open matching letter bounds.',
    computerView: 'Compares index values. Linear Search scans index 0 to N; Binary Search halves the sorted search bounds on each step.',
    usedIn: ['Database record checks', 'Find command (Ctrl+F) utilities', 'Inventory scanning systems'],
    commonMistakes: [
      { wrong: 'binarySearch(arr, val) // on unsorted array', reason: 'Binary search fails to return correct index matches if the input array is not sorted.' }
    ],
    bestPractices: [
      'Only apply binary search checks on sorted arrays.',
      'Avoid linear searching when values can be pre-indexed into hash maps.'
    ],
    interviewTopics: [
      'Binary Search space halving logic O(log N)',
      'Sequential Linear Search O(N) performance bounds'
    ]
  },
  'Backtracking': {
    concept: 'Backtracking',
    category: 'Algorithms',
    difficulty: 'Advanced',
    purpose: 'Explore all options by building solutions and backing up on dead ends.',
    problemSolved: 'Writing nested loops to solve combinatorics problems where the depth is unknown.',
    realLifeAnalogy: 'Navigating a garden maze. When you hit a hedge (dead end), you walk back to the last fork and try another path.',
    computerView: 'Recursively checks states. When checks fail constraint assertions, the routine restores state variables (backtracks) and alters call steps.',
    usedIn: ['Sudoku solver scripts', 'N-Queens puzzle checkers', 'Regex matching engines'],
    commonMistakes: [
      { wrong: 'solve(state) // without undoing state changes', reason: 'Failing to restore state parameters before returning corrupts subsequent recursion branches.' }
    ],
    bestPractices: [
      'Implement early pruning checks to skip branches that cannot lead to valid outcomes.',
      'Pass states via reference to prevent memory copying overhead.'
    ],
    interviewTopics: [
      'State-space tree traversal checks',
      'Pruning algorithms and backtracking recursion stack tracing'
    ]
  },
  'Dynamic Programming': {
    concept: 'Dynamic Programming',
    category: 'Algorithms',
    difficulty: 'Advanced',
    purpose: 'Solve complex problems by combining solutions to overlapping subproblems.',
    problemSolved: 'Recursion trees that compute identical parameters repeatedly (like Fibonacci), degrading performance to exponential O(2^N).',
    realLifeAnalogy: 'Writing down 1+1+1+1 = 4. If you add another "+1", you do not re-count from 1; you recall 4 and add 1.',
    computerView: 'Caches subproblem solutions in a table (Memoization for Top-Down recursion, Tabulation for Bottom-Up iteration), reducing steps to O(N).',
    usedIn: ['Diff comparison checkers (git diff)', 'Text autocomplete editors', 'Resource allocation engines'],
    commonMistakes: [
      { wrong: 'fib(n) // without table check', reason: 'Omitting table checks executes redundant calculations, losing all optimization benefits.' }
    ],
    bestPractices: [
      'Identify the state transition equation and base boundary criteria first.',
      'Optimize space complexity by only caching variables required for subsequent steps.'
    ],
    interviewTopics: [
      'Top-Down Memoization vs Bottom-Up Tabulation loops',
      'Overlapping subproblems and optimal substructure metrics'
    ]
  },
  'Sliding Window': {
    concept: 'Sliding Window',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    purpose: 'Optimize nested loop operations on arrays by shifting subarray bounds.',
    problemSolved: 'Calculating subarray sums using nested loops O(K * N), which recalculates overlapping index regions.',
    realLifeAnalogy: 'A dynamic camera lens framing items in a moving conveyor belt. To see the next set, you shift the camera right without restarting.',
    computerView: 'Maintains left and right index coordinates, adjusting indices to expand or contract window sizes as bounds iterate.',
    usedIn: ['Network traffic congestion controllers', 'Video streaming buffer trackers', 'Longest substring search algorithms'],
    commonMistakes: [
      { wrong: 'sum += arr[right]; sum -= arr[left++] // out of order', reason: 'Updating index counters before modifying sum values causes boundary reference errors.' }
    ],
    bestPractices: [
      'Update window variables (like sum or count) before incrementing coordinate pointer indexes.',
      'Use sliding windows to optimize quadratic calculations to linear O(N) time.'
    ],
    interviewTopics: [
      'Fixed-size vs variable-size sliding window bounds',
      'Converting O(N^2) array algorithms to linear O(N) time'
    ]
  },
  'Two Pointer': {
    concept: 'Two Pointer',
    category: 'Algorithms',
    difficulty: 'Beginner',
    purpose: 'Iterate array coordinates from different indices concurrently.',
    problemSolved: 'Scanning arrays using nested loops O(N^2) to search for target sums or reversals.',
    realLifeAnalogy: 'Two readers checking a list. One starts from the top, the other from the bottom, reading until their eyes meet.',
    computerView: 'Declares two index integer counters (typically left = 0, right = length - 1) and shifts them inwards based on comparison checks.',
    usedIn: ['Array reversing operations', 'Palindrome checking algorithms', 'Container water-trapping math'],
    commonMistakes: [
      { wrong: 'while left <= right:\n  left++\n  right--', reason: 'Mismatched increment updates can cause pointers to cross unchecked, skipping target items.' }
    ],
    bestPractices: [
      'Ensure pointer increment steps are strictly governed by conditional assertions to prevent infinite loops.',
      'Use two pointers to solve sorting or array summation tasks in linear O(N) steps.'
    ],
    interviewTopics: [
      'Converging pointers (opposite ends) vs relative tracking pointers (same direction)',
      'Solving pair sum problems in O(N) time'
    ]
  },
  'Binary Search': {
    concept: 'Binary Search',
    category: 'Algorithms',
    difficulty: 'Beginner',
    purpose: 'Search sorted lists by halving the check region iteratively.',
    problemSolved: 'Checking lists using linear scans O(N), which becomes unacceptably slow on massive databases.',
    realLifeAnalogy: 'Looking up a name in a massive dictionary by repeatedly splitting the pages in the middle.',
    computerView: 'Compares middle indices: mid = low + (high - low)/2. If value matches, returns index; else halves boundaries to left/right bounds.',
    usedIn: ['Git bisect command', 'Database index lookups', 'Standard library searching utilities'],
    commonMistakes: [
      { wrong: 'mid = (low + high) / 2', reason: 'Adding low + high can exceed maximum integer bounds in languages like Java/C++, causing overflow bugs. Use low + (high - low)/2.' }
    ],
    bestPractices: [
      'Always verify that input collections are sorted before executing binary search checks.',
      'Calculate midpoints safely to prevent integer boundaries overflow errors.'
    ],
    interviewTopics: [
      'Halving search space logarithmic complexities O(log N)',
      'Avoiding integer overflows when calculating midpoints'
    ]
  },
  'Greedy Algorithms': {
    concept: 'Greedy Algorithms',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    purpose: 'Build optimal solutions by making local optimal choices at each step.',
    problemSolved: 'Evaluating millions of paths using recursive checks (NP-Hard), which requires hours of compute time.',
    realLifeAnalogy: 'Making change for money. To change $36, you choose the largest bill first ($20), then ($10), then ($5), then ($1).',
    computerView: 'Sorts inputs according to weights or criteria, and iterates through candidates selecting items that satisfy criteria immediately.',
    usedIn: ['Dijkstra shortest path router', 'Huffman coding file compression', 'Activity selection schedules'],
    commonMistakes: [
      { wrong: 'greedyChange(coins, amount) // on non-canonical systems', reason: 'Greedy choice can fail to yield global optimal solutions if system bounds are not canonical (e.g. coin denominations 1, 3, 4 for change 6).' }
    ],
    bestPractices: [
      'Only apply greedy methods if the problem satisfies optimal substructure and greedy-choice properties.',
      'Sort candidate items beforehand to streamline selection loops.'
    ],
    interviewTopics: [
      'Greedy choice property vs optimal substructures',
      'Proving greedy algorithms correctness (Matroids)'
    ]
  }
};
};

/**
 * Gets Concept DNA metadata object for a detected concept.
 * @param {string} conceptName - The normalized concept key.
 * @returns {Object} Metadata DNA.
 */
function getDNA(conceptName) {
  const normalized = conceptName ? conceptName.replace(/s$/, '') : ''; // simple plural handle
  
  // Try matching exact key
  for (const [key, val] of Object.entries(DNA_REGISTRY)) {
    if (key.toLowerCase() === (conceptName || '').toLowerCase() || key.toLowerCase() === normalized.toLowerCase()) {
      return val;
    }
  }

  // General fallback
  return {
    concept: conceptName || 'General Concept',
    category: 'General Programming',
    difficulty: 'Beginner',
    purpose: 'Resolve programming instructions efficiently.',
    problemSolved: 'Repetitive code and unoptimized structure.',
    realLifeAnalogy: 'A tool in a toolbox. You choose the right tool for the job.',
    computerView: 'The execution engine parses statement blocks and maps instructions.',
    usedIn: ['Software applications', 'APIs'],
    commonMistakes: [{ wrong: '// Unchecked syntax\nx = 10', reason: 'Missing scoping variables declaration.' }],
    bestPractices: ['Write self-documenting code with descriptive labels.'],
    interviewTopics: ['Core execution rules and memory complexities']
  };
}

module.exports = {
  getDNA,
  DNA_REGISTRY
};
