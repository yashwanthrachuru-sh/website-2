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
  'Recursion': {
    concept: 'Recursion',
    category: 'Variables & Memory',
    difficulty: 'Advanced',
    purpose: 'Solve problems by making a function call itself with smaller inputs.',
    problemSolved: 'Writing complex, deeply nested loop trees to scan hierarchical directories or trees.',
    realLifeAnalogy: 'Standing between two mirrors. You see infinite copies of yourself reflecting smaller and smaller.',
    computerView: 'Each recursive call pushes a new frame onto the runtime Call Stack. A base case condition stops recursion and pops frames back.',
    usedIn: ['File folder scanners', 'DOM tree traversal', 'JSON parse engines'],
    commonMistakes: [
      { wrong: 'def count(n):\n  return count(n-1)', reason: 'Forgetting a base case condition runs recursive calls infinitely, filling the call stack and causing a Stack Overflow.' }
    ],
    bestPractices: [
      'Always write and test the base case condition first before writing recursive logic.',
      'Prefer standard iteration loops if call stacks risk exceeding limits.'
    ],
    interviewTopics: [
      'Base cases vs recursive cases',
      'Stack overflow reasons and call limits'
    ]
  }
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
