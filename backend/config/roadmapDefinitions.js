// ============================================================
// backend/config/roadmapDefinitions.js
// EduNet Curriculum Engine — Unified Static Roadmap Registry (37 Tracks)
// Generated dynamically to guarantee complete coverage.
// ============================================================
'use strict';

module.exports = {
  "python": {
    "title": "Python",
    "category": "Programming",
    "difficulty": "Beginner",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🐍",
    "tags": "python,oop,flask,django,pandas",
    "description": "Master Python from basics through OOP, Flask, Django, automation, and data science.",
    "language": "python",
    "modules": [
      {
        "name": "Python Interpreter & Setup",
        "desc": "Setting up Python environment and understanding bytecode execution.",
        "lessons": [
          {
            "title": "Python Installation",
            "desc": "Setting up Python runtime and environment."
          },
          {
            "title": "The Interpreter Flow",
            "desc": "How Python bytecode executes inside the PVM."
          },
          {
            "title": "Running Python Scripts",
            "desc": "Write and execute Python programs via terminal CLI."
          }
        ]
      },
      {
        "name": "Variables & Core Data Types",
        "desc": "Understand dynamic typing and primary data registers.",
        "lessons": [
          {
            "title": "Dynamic Typing in Python",
            "desc": "How Python references memory addresses dynamically."
          },
          {
            "title": "Numeric Data Types",
            "desc": "Working with Integers, Floats, and Complex numbers."
          },
          {
            "title": "Strings & Booleans",
            "desc": "Manipulating text sequences and logical operators."
          }
        ]
      },
      {
        "name": "Control Flow & Branching",
        "desc": "Direct program routes using conditional branching.",
        "lessons": [
          {
            "title": "If Else Statements",
            "desc": "Evaluate logic thresholds using conditional if branching."
          },
          {
            "title": "Nested Conditions",
            "desc": "Build complex logic routes using nested checks."
          },
          {
            "title": "Ternary Operators",
            "desc": "Write clean conditional assignments using ternary flow."
          }
        ]
      },
      {
        "name": "Loops & Iteration",
        "desc": "Iterate execution blocks using loop controls.",
        "lessons": [
          {
            "title": "For Loops",
            "desc": "Iterate over lists, ranges, and sequences."
          },
          {
            "title": "While Loops",
            "desc": "Repeat code blocks based on condition gates."
          },
          {
            "title": "Loop Control Statements",
            "desc": "Use break and continue to steer iterations."
          }
        ]
      },
      {
        "name": "Functions & Scope",
        "desc": "Write modular code blocks using functions.",
        "lessons": [
          {
            "title": "Function Definitions",
            "desc": "Declaring code blocks with def and return values."
          },
          {
            "title": "Parameters & Arguments",
            "desc": "Passing variables via positional and keyword args."
          },
          {
            "title": "Lambda Functions",
            "desc": "Write anonymous functions for lean mappings."
          }
        ]
      },
      {
        "name": "Lists & Tuples",
        "desc": "Sequence variables using contiguous array wrappers.",
        "lessons": [
          {
            "title": "List Operations",
            "desc": "Inserting, appending, and sorting list values."
          },
          {
            "title": "Tuple Immutability",
            "desc": "Secure records using read-only tuple constants."
          },
          {
            "title": "List Comprehensions",
            "desc": "Generate mapped lists using compact syntax."
          }
        ]
      },
      {
        "name": "Dictionaries & Sets",
        "desc": "Store records in key-value pairs and unique collections.",
        "lessons": [
          {
            "title": "Key Value Pairs",
            "desc": "Accessing and editing dictionary collections."
          },
          {
            "title": "Set Operations",
            "desc": "Performing union, intersection, and uniqueness filters."
          },
          {
            "title": "Dictionary Comprehensions",
            "desc": "Build mapped dict configurations dynamically."
          }
        ]
      },
      {
        "name": "File Handling & I/O",
        "desc": "Interact with secondary disk storage streams.",
        "lessons": [
          {
            "title": "Reading Files",
            "desc": "Open and read text files from the filesystem."
          },
          {
            "title": "Writing Files",
            "desc": "Write and append outputs to filesystem streams."
          },
          {
            "title": "Context Managers",
            "desc": "Secure handlers using the with block statements."
          }
        ]
      },
      {
        "name": "Object Oriented Python",
        "desc": "Model entities using classes and objects.",
        "lessons": [
          {
            "title": "Classes & Instances",
            "desc": "Define blueprints and construct heap object instances."
          },
          {
            "title": "Inheritance",
            "desc": "Extend class blueprints using base classes."
          },
          {
            "title": "Polymorphism",
            "desc": "Override class methods to run runtime behaviors."
          }
        ]
      },
      {
        "name": "Modules & Packages",
        "desc": "Structure scripts in modular imports.",
        "lessons": [
          {
            "title": "Import Statements",
            "desc": "Organizing script modules using import lines."
          },
          {
            "title": "Python Standard Library",
            "desc": "Explore OS, sys, and math helper packages."
          },
          {
            "title": "Virtual Environments",
            "desc": "Isolate project dependencies using venv buffers."
          }
        ]
      },
      {
        "name": "Exception Handling",
        "desc": "Gracefully capture and resolve execution failures.",
        "lessons": [
          {
            "title": "Try Except Blocks",
            "desc": "Prevent runtime crashes using try catch gates."
          },
          {
            "title": "Custom Exceptions",
            "desc": "Construct custom exception structures."
          },
          {
            "title": "Raising Exceptions",
            "desc": "Trigger exceptions based on constraint validation."
          }
        ]
      },
      {
        "name": "Database Integration",
        "desc": "Connect Python to persistent database tables.",
        "lessons": [
          {
            "title": "SQLite Integration",
            "desc": "Connect to local databases and run queries."
          },
          {
            "title": "SQLAlchemy ORM",
            "desc": "Map database relations to class attributes."
          },
          {
            "title": "Migration Scripts",
            "desc": "Perform database schema changes programmatically."
          }
        ]
      }
    ]
  },
  "java": {
    "title": "Java",
    "category": "Programming",
    "difficulty": "Intermediate",
    "duration": "14 weeks",
    "xp_reward": 2100,
    "icon": "☕",
    "tags": "java,spring,hibernate,jdbc,maven",
    "description": "Java ecosystem from fundamentals to Spring Boot, microservices, and JDBC.",
    "language": "java",
    "modules": [
      {
        "name": "Java JVM & Setup",
        "desc": "Understand compilation and JVM memory layout.",
        "lessons": [
          {
            "title": "JVM Architecture",
            "desc": "How bytecode executes inside the virtual execution layer."
          },
          {
            "title": "JDK vs JRE",
            "desc": "Setting up compile kits and runtimes."
          },
          {
            "title": "Main Method",
            "desc": "The standard entry point signature and class loader."
          }
        ]
      },
      {
        "name": "Data Types & Operators",
        "desc": "Manage memory registers and mathematical operations.",
        "lessons": [
          {
            "title": "Primitive Types",
            "desc": "Configure stack storage sizing using int, double, boolean."
          },
          {
            "title": "Type Casting",
            "desc": "Convert variables across widening and narrowing limits."
          },
          {
            "title": "Java Operators",
            "desc": "Compute evaluations using mathematical and logical keys."
          }
        ]
      },
      {
        "name": "Control Statements",
        "desc": "Route execution lines using conditionals.",
        "lessons": [
          {
            "title": "If Else Branching",
            "desc": "Steer programs based on condition checks."
          },
          {
            "title": "Switch Expressions",
            "desc": "Clean multi-way branching using switch syntax."
          },
          {
            "title": "Logical Gates",
            "desc": "Combine check thresholds using short-circuit operators."
          }
        ]
      },
      {
        "name": "Loops & Iteration",
        "desc": "Iterate logic sequences inside standard buffers.",
        "lessons": [
          {
            "title": "For Loops",
            "desc": "Standard counter iterations and enhanced for-each flows."
          },
          {
            "title": "While Loops",
            "desc": "Repeat blocks based on conditional status updates."
          },
          {
            "title": "Loop Control",
            "desc": "Manage loops using break and continue signals."
          }
        ]
      },
      {
        "name": "Methods & Signatures",
        "desc": "Modularize actions using methods.",
        "lessons": [
          {
            "title": "Method Parameters",
            "desc": "Pass values to methods via value parameters."
          },
          {
            "title": "Method Overloading",
            "desc": "Define duplicate signatures with varying types."
          },
          {
            "title": "Recursion Stack",
            "desc": "Pushes call frames recursively to solve subproblems."
          }
        ]
      },
      {
        "name": "Arrays & String Pool",
        "desc": "Store list values and manage text structures.",
        "lessons": [
          {
            "title": "Contiguous Arrays",
            "desc": "Initialize fixed-size arrays in memory."
          },
          {
            "title": "String Constant Pool",
            "desc": "How Java caches String resources on the Heap."
          },
          {
            "title": "StringBuilder Performance",
            "desc": "Concatenate text streams without memory duplication."
          }
        ]
      },
      {
        "name": "OOP Classes & Objects",
        "desc": "Object-oriented design blueprints.",
        "lessons": [
          {
            "title": "Class Blueprints",
            "desc": "Write blueprints and instantiate objects using new."
          },
          {
            "title": "Constructors",
            "desc": "Initialize instance variables with constructors."
          },
          {
            "title": "Access Modifiers",
            "desc": "Isolate states using private, protected, and public keys."
          }
        ]
      },
      {
        "name": "Interfaces & Inheritance",
        "desc": "Extend capabilities and set class rules.",
        "lessons": [
          {
            "title": "Inheritance extending",
            "desc": "Inherit parent fields and methods using extends."
          },
          {
            "title": "Polymorphic Methods",
            "desc": "Override base routines to run dynamic subclasses."
          },
          {
            "title": "Interface Rules",
            "desc": "Enforce API signatures using interface contracts."
          }
        ]
      },
      {
        "name": "Exception Handling",
        "desc": "Capture runtime stack errors gracefully.",
        "lessons": [
          {
            "title": "Try Catch Catch",
            "desc": "Intercept compiler errors and handle failures."
          },
          {
            "title": "Checked vs Unchecked",
            "desc": "Exceptions that compile checks vs runtime errors."
          },
          {
            "title": "Try With Resources",
            "desc": "Close file streams automatically via AutoCloseable."
          }
        ]
      },
      {
        "name": "Collections & Generics",
        "desc": "Manage dynamic collections safely.",
        "lessons": [
          {
            "title": "Generics Templates",
            "desc": "Enforce type constraints at compile phases."
          },
          {
            "title": "List Implementations",
            "desc": "Compare ArrayList memory arrays with LinkedList nodes."
          },
          {
            "title": "HashMap Hashing",
            "desc": "Store records in key-value maps via hash codes."
          }
        ]
      },
      {
        "name": "Java Multithreading",
        "desc": "Coordinate parallel threads tasks.",
        "lessons": [
          {
            "title": "Runnable Thread",
            "desc": "Instantiate thread routines via the Thread class."
          },
          {
            "title": "Concurrency Synchronize",
            "desc": "Protect shared variables from write races."
          },
          {
            "title": "ThreadPool Executor",
            "desc": "Re-use running thread pools using ExecutorService."
          }
        ]
      },
      {
        "name": "Spring Boot APIs",
        "desc": "Construct enterprise web microservices.",
        "lessons": [
          {
            "title": "Dependency Injection",
            "desc": "How Spring maps class allocations at boot."
          },
          {
            "title": "REST Controllers",
            "desc": "Define routing handlers using GetMapping and PostMapping."
          },
          {
            "title": "Spring Data JPA",
            "desc": "Map SQL queries to entity model classes."
          }
        ]
      }
    ]
  },
  "js": {
    "title": "JavaScript",
    "category": "Web Dev",
    "difficulty": "Beginner",
    "duration": "10 weeks",
    "xp_reward": 2000,
    "icon": "💛",
    "tags": "javascript,dom,es6,async,fetch",
    "description": "Deep-dive into modern JS — DOM, async/await, closures, ES6+, modules, and projects.",
    "language": "javascript",
    "modules": [
      {
        "name": "JS Engine & Scope",
        "desc": "Understand execution contexts and variable boundaries.",
        "lessons": [
          {
            "title": "V8 Engine Internals",
            "desc": "How JS parses script files to machine instructions."
          },
          {
            "title": "Variable Declarations",
            "desc": "Compare scope rules for var, let, and const."
          },
          {
            "title": "Hoisting Mechanics",
            "desc": "How variables and functions move to top of scope."
          }
        ]
      },
      {
        "name": "Data Types & Coercion",
        "desc": "Manage variables formatting and dynamic checks.",
        "lessons": [
          {
            "title": "Primitive Types JS",
            "desc": "Working with number, string, boolean, null, undefined."
          },
          {
            "title": "Dynamic Type Coercion",
            "desc": "Understanding implicit casting and strict equality ===."
          },
          {
            "title": "Object Literals",
            "desc": "Store dynamic fields inside JavaScript objects."
          }
        ]
      },
      {
        "name": "Logic & Conditionals",
        "desc": "Steer logic pathways dynamically.",
        "lessons": [
          {
            "title": "If Else Conditions",
            "desc": "Branching scripts using conditional checks."
          },
          {
            "title": "Switch Statement",
            "desc": "Clean multi-condition checks using switch mappings."
          },
          {
            "title": "Short Circuit Evaluator",
            "desc": "Use logical AND / OR as inline gates."
          }
        ]
      },
      {
        "name": "Iteration & Loops",
        "desc": "Repeat code lines inside loop indexes.",
        "lessons": [
          {
            "title": "Standard For Loops",
            "desc": "Iterate arrays using index counters."
          },
          {
            "title": "While Loop Guards",
            "desc": "Loop routines based on check conditions."
          },
          {
            "title": "For In vs For Of",
            "desc": "Compare key enumerations with value iterations."
          }
        ]
      },
      {
        "name": "Closures & Functions",
        "desc": "Construct nested modules with persistent states.",
        "lessons": [
          {
            "title": "Arrow Functions Syntax",
            "desc": "Write compact functions with lexical scope."
          },
          {
            "title": "Lexical Scope Contexts",
            "desc": "Understand how variables remain visible."
          },
          {
            "title": "JS Closures",
            "desc": "Return nested functions that cache enclosing scopes."
          }
        ]
      },
      {
        "name": "DOM Manipulation",
        "desc": "Select and modify HTML nodes dynamically.",
        "lessons": [
          {
            "title": "Selector Queries",
            "desc": "Query HTML tags using querySelector."
          },
          {
            "title": "Element Creation",
            "desc": "Generate and append HTML nodes dynamically."
          },
          {
            "title": "Attribute Modifiers",
            "desc": "Update CSS classes and dataset attributes."
          }
        ]
      },
      {
        "name": "Event Handling",
        "desc": "Respond to client actions in the browser.",
        "lessons": [
          {
            "title": "Event Listeners",
            "desc": "Bind listener functions to click and input events."
          },
          {
            "title": "Event Bubbling",
            "desc": "How events propagate up the DOM node tree."
          },
          {
            "title": "Event Delegation",
            "desc": "Optimize listeners by binding to parent nodes."
          }
        ]
      },
      {
        "name": "Async Callbacks",
        "desc": "Manage asynchronous events using callbacks.",
        "lessons": [
          {
            "title": "The Event Loop",
            "desc": "How async tasks execute relative to stack frames."
          },
          {
            "title": "Timeout Intervals",
            "desc": "Schedule functions using setTimeout."
          },
          {
            "title": "Callback Hell",
            "desc": "Why nested callbacks lead to unmaintainable logic."
          }
        ]
      },
      {
        "name": "Promises & Chains",
        "desc": "Track future values using promise objects.",
        "lessons": [
          {
            "title": "Promise Instantiation",
            "desc": "Initialize promise states using resolve/reject."
          },
          {
            "title": "Promise Chains",
            "desc": "Chain async steps using then and catch handlers."
          },
          {
            "title": "Promise All Concurrency",
            "desc": "Run independent network requests concurrently."
          }
        ]
      },
      {
        "name": "Async Await Syntax",
        "desc": "Write async operations like sync files.",
        "lessons": [
          {
            "title": "Async Functions",
            "desc": "Write return wrappers using async markers."
          },
          {
            "title": "Await Expressions",
            "desc": "Pause executions until promises resolve."
          },
          {
            "title": "Error Catching try catch",
            "desc": "Handle failures using try catch gates."
          }
        ]
      },
      {
        "name": "Fetch API integration",
        "desc": "Request data from external network APIs.",
        "lessons": [
          {
            "title": "Network GET Requests",
            "desc": "Query data from REST APIs using fetch."
          },
          {
            "title": "Network POST Requests",
            "desc": "Send JSON payloads to backend server endpoints."
          },
          {
            "title": "Response Validations",
            "desc": "Verify status codes and read JSON buffers."
          }
        ]
      },
      {
        "name": "ES6 Modules",
        "desc": "Export and import modular scripts.",
        "lessons": [
          {
            "title": "Export Signatures",
            "desc": "Define named and default exports in script files."
          },
          {
            "title": "Import Statements JS",
            "desc": "Load external script modules into scopes."
          },
          {
            "title": "Dynamic Import Loading",
            "desc": "Import files lazily to optimize page speeds."
          }
        ]
      }
    ]
  },
  "typescript": {
    "title": "TypeScript",
    "category": "Programming",
    "difficulty": "Intermediate",
    "duration": "10 weeks",
    "xp_reward": 2000,
    "icon": "📘",
    "tags": "typescript,js,types,angular,react",
    "description": "Master TypeScript, compiler configurations, custom types, generics, and compiler setups.",
    "language": "typescript",
    "modules": [
      {
        "name": "Compiler & Setup",
        "desc": "Install TypeScript and understand compiler configs.",
        "lessons": [
          {
            "title": "TSC Installation",
            "desc": "Install the compiler and initialize tsconfig.json."
          },
          {
            "title": "TS Compilation Flow",
            "desc": "How TS checks types and emits clean JS files."
          },
          {
            "title": "Strict Mode Configs",
            "desc": "Secure scopes using strict flag configurations."
          }
        ]
      },
      {
        "name": "Basic Types Annotation",
        "desc": "Declare explicit variables type tags.",
        "lessons": [
          {
            "title": "Explicit Types",
            "desc": "Declaring number, string, boolean, and array types."
          },
          {
            "title": "Any vs Unknown",
            "desc": "Ensure safety using unknown over any types."
          },
          {
            "title": "Void and Never",
            "desc": "Type signatures for functions that return nothing."
          }
        ]
      },
      {
        "name": "Interfaces & Types",
        "desc": "Define contracts for objects structures.",
        "lessons": [
          {
            "title": "TypeScript Interfaces",
            "desc": "Enforce object shapes using interface declarations."
          },
          {
            "title": "Type Aliases",
            "desc": "Write clean custom aliases using the type keyword."
          },
          {
            "title": "Optional Readonly Fields",
            "desc": "Configure constants and optional keys inside shapes."
          }
        ]
      },
      {
        "name": "Union & Intersection",
        "desc": "Combine and intersect custom types.",
        "lessons": [
          {
            "title": "Union Types",
            "desc": "Define variables that hold varying type classes."
          },
          {
            "title": "Type Narrowing",
            "desc": "Resolve actual types using typeof and instanceof guards."
          },
          {
            "title": "Intersection Types",
            "desc": "Merge multiple type interfaces into unified contracts."
          }
        ]
      },
      {
        "name": "Classes & Access Modifiers",
        "desc": "Build OOP designs inside TypeScript.",
        "lessons": [
          {
            "title": "TS Class Fields",
            "desc": "Declare type tags on class properties and methods."
          },
          {
            "title": "TS Access Modifiers",
            "desc": "Isolate variables using private, protected, public."
          },
          {
            "title": "Abstract Classes",
            "desc": "Set blueprints for subclasses using abstract declarations."
          }
        ]
      },
      {
        "name": "Functions & Overloads",
        "desc": "Type parameters and return signatures.",
        "lessons": [
          {
            "title": "Typed Functions",
            "desc": "Annotate parameters and return values cleanly."
          },
          {
            "title": "Function Signatures",
            "desc": "Define callable interfaces for callback parameters."
          },
          {
            "title": "Function Overloads",
            "desc": "Write multiple declarations for varying input bounds."
          }
        ]
      },
      {
        "name": "Generics Constraints",
        "desc": "Write reusable parameter-safe logic.",
        "lessons": [
          {
            "title": "Generic Functions",
            "desc": "Define dynamic type variables using brackets."
          },
          {
            "title": "Generic Interfaces",
            "desc": "Configure interfaces that adapt to parameter types."
          },
          {
            "title": "Generic Constraints",
            "desc": "Restrict generic types using the extends keyword."
          }
        ]
      },
      {
        "name": "Enums & Literal Types",
        "desc": "Set strict constant value options.",
        "lessons": [
          {
            "title": "Numeric String Enums",
            "desc": "Write custom category lists using enums."
          },
          {
            "title": "Literal Value Types",
            "desc": "Lock parameters to precise string constant options."
          },
          {
            "title": "Template Literal Types",
            "desc": "Build dynamic string validation types."
          }
        ]
      },
      {
        "name": "Type Assertions Casting",
        "desc": "Override compiler type inferences.",
        "lessons": [
          {
            "title": "Casting with As",
            "desc": "Coerce type assignments using the as operator."
          },
          {
            "title": "Non-Null Assertion",
            "desc": "Assert parameters are not null using exclamation marks."
          },
          {
            "title": "Const Assertions",
            "desc": "Freeze object changes using as const syntax."
          }
        ]
      },
      {
        "name": "Modules Namespaces",
        "desc": "Organize files inside declarations.",
        "lessons": [
          {
            "title": "Import Export TS",
            "desc": "Organize scripts using standard import export lines."
          },
          {
            "title": "Ambient Declarations",
            "desc": "Integrate JS packages using .d.ts files."
          },
          {
            "title": "Path Mapping Configs",
            "desc": "Configure clean directory paths inside tsconfig."
          }
        ]
      },
      {
        "name": "Utility Types Mapping",
        "desc": "Transform interfaces using pre-built keys.",
        "lessons": [
          {
            "title": "Partial and Required",
            "desc": "Convert all shape keys to optional or mandatory."
          },
          {
            "title": "Pick and Omit",
            "desc": "Extract or drop specific attributes from interfaces."
          },
          {
            "title": "Readonly Record Maps",
            "desc": "Configure read-only maps for dynamic dictionaries."
          }
        ]
      },
      {
        "name": "Decorators Compilation",
        "desc": "Meta-program classes and attributes.",
        "lessons": [
          {
            "title": "Class Decorators",
            "desc": "Modify class definitions using annotation hooks."
          },
          {
            "title": "Method Decorators",
            "desc": "Wrap method behaviors inside logging decorators."
          },
          {
            "title": "Property Decorators",
            "desc": "Inspect and validate attributes before boot."
          }
        ]
      }
    ]
  },
  "c": {
    "title": "C Programming",
    "category": "Programming",
    "difficulty": "Beginner",
    "duration": "10 weeks",
    "xp_reward": 1800,
    "icon": "🔵",
    "tags": "c,pointers,arrays,structures,memory",
    "description": "Master procedural C with memory management, pointers, data structures, and systems programming.",
    "language": "c",
    "modules": [
      {
        "name": "GCC Compiler & Headers",
        "desc": "Compile C scripts and manage header libraries.",
        "lessons": [
          {
            "title": "GCC Compiling Flow",
            "desc": "How code compiles to preprocessor, assembly, and binary."
          },
          {
            "title": "Header Inclusions",
            "desc": "Include standard libraries like stdio.h and stdlib.h."
          },
          {
            "title": "Main Signature Return",
            "desc": "The standard entry signature returning exit status codes."
          }
        ]
      },
      {
        "name": "Format Specifiers I/O",
        "desc": "Format variables print and read statements.",
        "lessons": [
          {
            "title": "Console Output printf",
            "desc": "Print formatted texts using specifiers like %d and %f."
          },
          {
            "title": "Console Input scanf",
            "desc": "Read values from keyboard using target addresses."
          },
          {
            "title": "Buffer Flushing",
            "desc": "Clear stdin cache buffers using fflush statements."
          }
        ]
      },
      {
        "name": "Operators Expressions",
        "desc": "Perform evaluations on primitive data sizes.",
        "lessons": [
          {
            "title": "Arithmetic Operations C",
            "desc": "Calculate values using standard mathematical operators."
          },
          {
            "title": "Bitwise Shift Masks",
            "desc": "Manipulate flags at bits levels using AND / OR shifts."
          },
          {
            "title": "Operator Precedence Rules",
            "desc": "Order of evaluation for complex calculations."
          }
        ]
      },
      {
        "name": "Control Flow Conditions",
        "desc": "Branch execution routes based on logic checks.",
        "lessons": [
          {
            "title": "Conditional Branches",
            "desc": "Branching scripts using if and else statements."
          },
          {
            "title": "Switch Case Routing",
            "desc": "Select routes using numeric or character codes."
          },
          {
            "title": "Goto Statement Alert",
            "desc": "Steer lines directly using labels (and why to avoid)."
          }
        ]
      },
      {
        "name": "Loops Iterations",
        "desc": "Repeat operations using counter registers.",
        "lessons": [
          {
            "title": "For Counter Loop",
            "desc": "Initialize, check, and increment loop variables."
          },
          {
            "title": "While Sentinel Loop",
            "desc": "Loop tasks until sentinel boundaries evaluate to false."
          },
          {
            "title": "Do While Loop",
            "desc": "Enforce execution at least once before checks."
          }
        ]
      },
      {
        "name": "Functions Recursion",
        "desc": "Write modular code blocks and recursions.",
        "lessons": [
          {
            "title": "Function Declarations C",
            "desc": "Define signatures using return types and parameter lists."
          },
          {
            "title": "Call By Value Stack",
            "desc": "How Java-like copies allocate stack slots."
          },
          {
            "title": "Recursive Call Frames",
            "desc": "Push caller addresses to search tree branches recursively."
          }
        ]
      },
      {
        "name": "Arrays String Termination",
        "desc": "Store contiguous tables and text sequences.",
        "lessons": [
          {
            "title": "Contiguous Array Storage",
            "desc": "Index memory offsets inside static variables."
          },
          {
            "title": "Null Terminator String",
            "desc": "Declare character sequences ending in zero characters."
          },
          {
            "title": "String Library Functions",
            "desc": "Manipulate text using strlen, strcpy, and strcmp."
          }
        ]
      },
      {
        "name": "Pointers Dereferencing",
        "desc": "Direct hardware memory access.",
        "lessons": [
          {
            "title": "Pointer Addresses",
            "desc": "Store memory coordinate hex values using asterisk keys."
          },
          {
            "title": "Dereferencing Operators",
            "desc": "Read or write heap values directly via target references."
          },
          {
            "title": "Pointer Arithmetic Offset",
            "desc": "Walk contiguous arrays using index increments."
          }
        ]
      },
      {
        "name": "Structures Unions",
        "desc": "Define custom complex data types.",
        "lessons": [
          {
            "title": "Struct Attributes C",
            "desc": "Combine multiple types into unified records."
          },
          {
            "title": "Typedef Aliasing",
            "desc": "Configure clean alias titles for custom structs."
          },
          {
            "title": "Union Memory Share",
            "desc": "Overlay variable attributes inside shared byte allocations."
          }
        ]
      },
      {
        "name": "Dynamic Memory Allocation",
        "desc": "Request and release heap memory segments.",
        "lessons": [
          {
            "title": "Malloc Allocations",
            "desc": "Request raw byte segments dynamically from the heap."
          },
          {
            "title": "Calloc & Realloc",
            "desc": "Initialize empty segments or resize allocations dynamically."
          },
          {
            "title": "Memory Leak Free",
            "desc": "Return heap blocks to OS using free statements."
          }
        ]
      },
      {
        "name": "File I/O Descriptors",
        "desc": "Read and write persistent files records.",
        "lessons": [
          {
            "title": "File Handlers fopen",
            "desc": "Open stream channels in read or write modes."
          },
          {
            "title": "File Formatting I/O",
            "desc": "Write outputs using fprintf and read using fscanf."
          },
          {
            "title": "File Close fclose",
            "desc": "Release stream descriptors to operating system layers."
          }
        ]
      },
      {
        "name": "Dynamic Data Structures C",
        "desc": "Build linked structures inside memory.",
        "lessons": [
          {
            "title": "Singly Linked List C",
            "desc": "Chain node structs dynamically via pointers."
          },
          {
            "title": "Stack Implementation C",
            "desc": "Enforce LIFO constraints using malloc nodes."
          },
          {
            "title": "Queue Implementation C",
            "desc": "Route FIFO arrays using front and rear pointers."
          }
        ]
      }
    ]
  },
  "cpp": {
    "title": "C++",
    "category": "Programming",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "cpp,cpp,coding,edunet",
    "description": "Complete structured curriculum mapping for C++ from beginner to production-ready design.",
    "language": "cpp",
    "modules": [
      {
        "name": "C++ Setup & Architecture Foundations",
        "desc": "In-depth study on C++ covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "C++ Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "C++ Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "C++ Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "C++ Variables & Core Data Layouts",
        "desc": "In-depth study on C++ covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "C++ Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "C++ Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "C++ Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "C++ Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on C++ covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "C++ Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "C++ Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "C++ Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "C++ Iteration loops & State Traversal",
        "desc": "In-depth study on C++ covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "C++ Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "C++ Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "C++ Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "C++ Modular Functions & Signature Scopes",
        "desc": "In-depth study on C++ covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "C++ Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "C++ Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "C++ Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "C++ Data Collections & List Structures",
        "desc": "In-depth study on C++ covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "C++ Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "C++ Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "C++ Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "C++ Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on C++ covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "C++ Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "C++ Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "C++ Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "C++ Error Handling & Diagnostic Operations",
        "desc": "In-depth study on C++ covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "C++ Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "C++ Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "C++ Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "C++ File Integration & Stream Buffers",
        "desc": "In-depth study on C++ covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "C++ Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "C++ Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "C++ Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "C++ Package Orchestration & System Modules",
        "desc": "In-depth study on C++ covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "C++ Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "C++ Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "C++ Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "C++ Performance Optimization & Complexity",
        "desc": "In-depth study on C++ covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "C++ Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "C++ Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "C++ Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "C++ Production Deployment & Server Pipelines",
        "desc": "In-depth study on C++ covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "C++ Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "C++ Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "C++ Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "sql": {
    "title": "SQL & Databases",
    "category": "Data",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "sql,sql,coding,edunet",
    "description": "Complete structured curriculum mapping for SQL & Databases from beginner to production-ready design.",
    "language": "sql",
    "modules": [
      {
        "name": "SQL & Databases Setup & Architecture Foundations",
        "desc": "In-depth study on SQL & Databases covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "SQL & Databases Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "SQL & Databases Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "SQL & Databases Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "SQL & Databases Variables & Core Data Layouts",
        "desc": "In-depth study on SQL & Databases covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "SQL & Databases Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "SQL & Databases Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "SQL & Databases Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "SQL & Databases Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on SQL & Databases covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "SQL & Databases Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "SQL & Databases Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "SQL & Databases Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "SQL & Databases Iteration loops & State Traversal",
        "desc": "In-depth study on SQL & Databases covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "SQL & Databases Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "SQL & Databases Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "SQL & Databases Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "SQL & Databases Modular Functions & Signature Scopes",
        "desc": "In-depth study on SQL & Databases covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "SQL & Databases Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "SQL & Databases Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "SQL & Databases Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "SQL & Databases Data Collections & List Structures",
        "desc": "In-depth study on SQL & Databases covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "SQL & Databases Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "SQL & Databases Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "SQL & Databases Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "SQL & Databases Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on SQL & Databases covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "SQL & Databases Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "SQL & Databases Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "SQL & Databases Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "SQL & Databases Error Handling & Diagnostic Operations",
        "desc": "In-depth study on SQL & Databases covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "SQL & Databases Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "SQL & Databases Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "SQL & Databases Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "SQL & Databases File Integration & Stream Buffers",
        "desc": "In-depth study on SQL & Databases covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "SQL & Databases Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "SQL & Databases Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "SQL & Databases Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "SQL & Databases Package Orchestration & System Modules",
        "desc": "In-depth study on SQL & Databases covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "SQL & Databases Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "SQL & Databases Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "SQL & Databases Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "SQL & Databases Performance Optimization & Complexity",
        "desc": "In-depth study on SQL & Databases covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "SQL & Databases Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "SQL & Databases Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "SQL & Databases Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "SQL & Databases Production Deployment & Server Pipelines",
        "desc": "In-depth study on SQL & Databases covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "SQL & Databases Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "SQL & Databases Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "SQL & Databases Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "html": {
    "title": "HTML",
    "category": "Web Dev",
    "difficulty": "Advanced",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "html,html,coding,edunet",
    "description": "Complete structured curriculum mapping for HTML from beginner to production-ready design.",
    "language": "html",
    "modules": [
      {
        "name": "HTML Setup & Architecture Foundations",
        "desc": "In-depth study on HTML covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "HTML Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "HTML Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "HTML Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "HTML Variables & Core Data Layouts",
        "desc": "In-depth study on HTML covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "HTML Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "HTML Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "HTML Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "HTML Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on HTML covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "HTML Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "HTML Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "HTML Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "HTML Iteration loops & State Traversal",
        "desc": "In-depth study on HTML covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "HTML Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "HTML Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "HTML Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "HTML Modular Functions & Signature Scopes",
        "desc": "In-depth study on HTML covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "HTML Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "HTML Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "HTML Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "HTML Data Collections & List Structures",
        "desc": "In-depth study on HTML covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "HTML Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "HTML Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "HTML Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "HTML Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on HTML covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "HTML Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "HTML Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "HTML Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "HTML Error Handling & Diagnostic Operations",
        "desc": "In-depth study on HTML covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "HTML Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "HTML Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "HTML Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "HTML File Integration & Stream Buffers",
        "desc": "In-depth study on HTML covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "HTML Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "HTML Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "HTML Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "HTML Package Orchestration & System Modules",
        "desc": "In-depth study on HTML covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "HTML Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "HTML Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "HTML Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "HTML Performance Optimization & Complexity",
        "desc": "In-depth study on HTML covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "HTML Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "HTML Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "HTML Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "HTML Production Deployment & Server Pipelines",
        "desc": "In-depth study on HTML covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "HTML Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "HTML Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "HTML Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "css": {
    "title": "CSS",
    "category": "Web Dev",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "css,css,coding,edunet",
    "description": "Complete structured curriculum mapping for CSS from beginner to production-ready design.",
    "language": "css",
    "modules": [
      {
        "name": "CSS Setup & Architecture Foundations",
        "desc": "In-depth study on CSS covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "CSS Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "CSS Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "CSS Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "CSS Variables & Core Data Layouts",
        "desc": "In-depth study on CSS covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "CSS Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "CSS Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "CSS Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "CSS Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on CSS covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "CSS Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "CSS Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "CSS Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "CSS Iteration loops & State Traversal",
        "desc": "In-depth study on CSS covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "CSS Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "CSS Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "CSS Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "CSS Modular Functions & Signature Scopes",
        "desc": "In-depth study on CSS covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "CSS Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "CSS Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "CSS Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "CSS Data Collections & List Structures",
        "desc": "In-depth study on CSS covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "CSS Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "CSS Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "CSS Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "CSS Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on CSS covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "CSS Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "CSS Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "CSS Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "CSS Error Handling & Diagnostic Operations",
        "desc": "In-depth study on CSS covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "CSS Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "CSS Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "CSS Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "CSS File Integration & Stream Buffers",
        "desc": "In-depth study on CSS covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "CSS Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "CSS Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "CSS Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "CSS Package Orchestration & System Modules",
        "desc": "In-depth study on CSS covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "CSS Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "CSS Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "CSS Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "CSS Performance Optimization & Complexity",
        "desc": "In-depth study on CSS covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "CSS Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "CSS Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "CSS Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "CSS Production Deployment & Server Pipelines",
        "desc": "In-depth study on CSS covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "CSS Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "CSS Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "CSS Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "react": {
    "title": "React Developer",
    "category": "Web Dev",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "react,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for React Developer from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "React Developer Setup & Architecture Foundations",
        "desc": "In-depth study on React Developer covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "React Developer Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "React Developer Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "React Developer Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "React Developer Variables & Core Data Layouts",
        "desc": "In-depth study on React Developer covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "React Developer Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "React Developer Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "React Developer Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "React Developer Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on React Developer covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "React Developer Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "React Developer Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "React Developer Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "React Developer Iteration loops & State Traversal",
        "desc": "In-depth study on React Developer covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "React Developer Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "React Developer Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "React Developer Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "React Developer Modular Functions & Signature Scopes",
        "desc": "In-depth study on React Developer covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "React Developer Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "React Developer Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "React Developer Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "React Developer Data Collections & List Structures",
        "desc": "In-depth study on React Developer covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "React Developer Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "React Developer Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "React Developer Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "React Developer Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on React Developer covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "React Developer Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "React Developer Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "React Developer Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "React Developer Error Handling & Diagnostic Operations",
        "desc": "In-depth study on React Developer covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "React Developer Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "React Developer Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "React Developer Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "React Developer File Integration & Stream Buffers",
        "desc": "In-depth study on React Developer covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "React Developer Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "React Developer Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "React Developer Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "React Developer Package Orchestration & System Modules",
        "desc": "In-depth study on React Developer covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "React Developer Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "React Developer Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "React Developer Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "React Developer Performance Optimization & Complexity",
        "desc": "In-depth study on React Developer covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "React Developer Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "React Developer Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "React Developer Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "React Developer Production Deployment & Server Pipelines",
        "desc": "In-depth study on React Developer covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "React Developer Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "React Developer Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "React Developer Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "nextjs": {
    "title": "Next.js Developer",
    "category": "Web Dev",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "nextjs,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for Next.js Developer from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "Next.js Developer Setup & Architecture Foundations",
        "desc": "In-depth study on Next.js Developer covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Next.js Developer Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Next.js Developer Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Next.js Developer Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Next.js Developer Variables & Core Data Layouts",
        "desc": "In-depth study on Next.js Developer covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Next.js Developer Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Next.js Developer Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Next.js Developer Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Next.js Developer Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Next.js Developer covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Next.js Developer Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Next.js Developer Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Next.js Developer Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Next.js Developer Iteration loops & State Traversal",
        "desc": "In-depth study on Next.js Developer covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Next.js Developer Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Next.js Developer Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Next.js Developer Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Next.js Developer Modular Functions & Signature Scopes",
        "desc": "In-depth study on Next.js Developer covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Next.js Developer Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Next.js Developer Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Next.js Developer Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Next.js Developer Data Collections & List Structures",
        "desc": "In-depth study on Next.js Developer covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Next.js Developer Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Next.js Developer Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Next.js Developer Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Next.js Developer Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Next.js Developer covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Next.js Developer Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Next.js Developer Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Next.js Developer Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Next.js Developer Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Next.js Developer covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Next.js Developer Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Next.js Developer Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Next.js Developer Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Next.js Developer File Integration & Stream Buffers",
        "desc": "In-depth study on Next.js Developer covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Next.js Developer Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Next.js Developer Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Next.js Developer Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Next.js Developer Package Orchestration & System Modules",
        "desc": "In-depth study on Next.js Developer covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Next.js Developer Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Next.js Developer Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Next.js Developer Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Next.js Developer Performance Optimization & Complexity",
        "desc": "In-depth study on Next.js Developer covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Next.js Developer Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Next.js Developer Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Next.js Developer Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Next.js Developer Production Deployment & Server Pipelines",
        "desc": "In-depth study on Next.js Developer covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Next.js Developer Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Next.js Developer Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Next.js Developer Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "nodejs": {
    "title": "Node.js Developer",
    "category": "Web Dev",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "nodejs,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for Node.js Developer from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "Node.js Developer Setup & Architecture Foundations",
        "desc": "In-depth study on Node.js Developer covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Node.js Developer Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Node.js Developer Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Node.js Developer Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Node.js Developer Variables & Core Data Layouts",
        "desc": "In-depth study on Node.js Developer covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Node.js Developer Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Node.js Developer Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Node.js Developer Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Node.js Developer Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Node.js Developer covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Node.js Developer Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Node.js Developer Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Node.js Developer Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Node.js Developer Iteration loops & State Traversal",
        "desc": "In-depth study on Node.js Developer covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Node.js Developer Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Node.js Developer Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Node.js Developer Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Node.js Developer Modular Functions & Signature Scopes",
        "desc": "In-depth study on Node.js Developer covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Node.js Developer Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Node.js Developer Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Node.js Developer Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Node.js Developer Data Collections & List Structures",
        "desc": "In-depth study on Node.js Developer covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Node.js Developer Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Node.js Developer Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Node.js Developer Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Node.js Developer Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Node.js Developer covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Node.js Developer Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Node.js Developer Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Node.js Developer Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Node.js Developer Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Node.js Developer covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Node.js Developer Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Node.js Developer Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Node.js Developer Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Node.js Developer File Integration & Stream Buffers",
        "desc": "In-depth study on Node.js Developer covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Node.js Developer Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Node.js Developer Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Node.js Developer Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Node.js Developer Package Orchestration & System Modules",
        "desc": "In-depth study on Node.js Developer covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Node.js Developer Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Node.js Developer Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Node.js Developer Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Node.js Developer Performance Optimization & Complexity",
        "desc": "In-depth study on Node.js Developer covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Node.js Developer Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Node.js Developer Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Node.js Developer Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Node.js Developer Production Deployment & Server Pipelines",
        "desc": "In-depth study on Node.js Developer covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Node.js Developer Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Node.js Developer Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Node.js Developer Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "express": {
    "title": "Express.js Developer",
    "category": "Web Dev",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "express,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for Express.js Developer from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "Express.js Developer Setup & Architecture Foundations",
        "desc": "In-depth study on Express.js Developer covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Express.js Developer Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Express.js Developer Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Express.js Developer Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Express.js Developer Variables & Core Data Layouts",
        "desc": "In-depth study on Express.js Developer covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Express.js Developer Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Express.js Developer Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Express.js Developer Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Express.js Developer Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Express.js Developer covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Express.js Developer Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Express.js Developer Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Express.js Developer Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Express.js Developer Iteration loops & State Traversal",
        "desc": "In-depth study on Express.js Developer covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Express.js Developer Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Express.js Developer Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Express.js Developer Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Express.js Developer Modular Functions & Signature Scopes",
        "desc": "In-depth study on Express.js Developer covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Express.js Developer Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Express.js Developer Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Express.js Developer Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Express.js Developer Data Collections & List Structures",
        "desc": "In-depth study on Express.js Developer covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Express.js Developer Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Express.js Developer Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Express.js Developer Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Express.js Developer Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Express.js Developer covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Express.js Developer Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Express.js Developer Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Express.js Developer Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Express.js Developer Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Express.js Developer covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Express.js Developer Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Express.js Developer Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Express.js Developer Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Express.js Developer File Integration & Stream Buffers",
        "desc": "In-depth study on Express.js Developer covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Express.js Developer Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Express.js Developer Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Express.js Developer Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Express.js Developer Package Orchestration & System Modules",
        "desc": "In-depth study on Express.js Developer covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Express.js Developer Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Express.js Developer Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Express.js Developer Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Express.js Developer Performance Optimization & Complexity",
        "desc": "In-depth study on Express.js Developer covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Express.js Developer Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Express.js Developer Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Express.js Developer Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Express.js Developer Production Deployment & Server Pipelines",
        "desc": "In-depth study on Express.js Developer covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Express.js Developer Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Express.js Developer Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Express.js Developer Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "backend": {
    "title": "Backend Development",
    "category": "Web Dev",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "backend,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for Backend Development from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "Backend Development Setup & Architecture Foundations",
        "desc": "In-depth study on Backend Development covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Backend Development Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Backend Development Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Backend Development Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Backend Development Variables & Core Data Layouts",
        "desc": "In-depth study on Backend Development covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Backend Development Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Backend Development Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Backend Development Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Backend Development Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Backend Development covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Backend Development Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Backend Development Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Backend Development Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Backend Development Iteration loops & State Traversal",
        "desc": "In-depth study on Backend Development covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Backend Development Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Backend Development Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Backend Development Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Backend Development Modular Functions & Signature Scopes",
        "desc": "In-depth study on Backend Development covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Backend Development Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Backend Development Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Backend Development Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Backend Development Data Collections & List Structures",
        "desc": "In-depth study on Backend Development covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Backend Development Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Backend Development Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Backend Development Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Backend Development Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Backend Development covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Backend Development Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Backend Development Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Backend Development Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Backend Development Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Backend Development covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Backend Development Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Backend Development Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Backend Development Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Backend Development File Integration & Stream Buffers",
        "desc": "In-depth study on Backend Development covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Backend Development Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Backend Development Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Backend Development Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Backend Development Package Orchestration & System Modules",
        "desc": "In-depth study on Backend Development covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Backend Development Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Backend Development Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Backend Development Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Backend Development Performance Optimization & Complexity",
        "desc": "In-depth study on Backend Development covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Backend Development Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Backend Development Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Backend Development Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Backend Development Production Deployment & Server Pipelines",
        "desc": "In-depth study on Backend Development covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Backend Development Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Backend Development Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Backend Development Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "frontend": {
    "title": "Frontend Development",
    "category": "Web Dev",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "frontend,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for Frontend Development from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "Frontend Development Setup & Architecture Foundations",
        "desc": "In-depth study on Frontend Development covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Frontend Development Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Frontend Development Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Frontend Development Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Frontend Development Variables & Core Data Layouts",
        "desc": "In-depth study on Frontend Development covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Frontend Development Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Frontend Development Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Frontend Development Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Frontend Development Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Frontend Development covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Frontend Development Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Frontend Development Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Frontend Development Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Frontend Development Iteration loops & State Traversal",
        "desc": "In-depth study on Frontend Development covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Frontend Development Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Frontend Development Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Frontend Development Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Frontend Development Modular Functions & Signature Scopes",
        "desc": "In-depth study on Frontend Development covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Frontend Development Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Frontend Development Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Frontend Development Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Frontend Development Data Collections & List Structures",
        "desc": "In-depth study on Frontend Development covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Frontend Development Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Frontend Development Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Frontend Development Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Frontend Development Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Frontend Development covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Frontend Development Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Frontend Development Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Frontend Development Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Frontend Development Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Frontend Development covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Frontend Development Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Frontend Development Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Frontend Development Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Frontend Development File Integration & Stream Buffers",
        "desc": "In-depth study on Frontend Development covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Frontend Development Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Frontend Development Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Frontend Development Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Frontend Development Package Orchestration & System Modules",
        "desc": "In-depth study on Frontend Development covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Frontend Development Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Frontend Development Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Frontend Development Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Frontend Development Performance Optimization & Complexity",
        "desc": "In-depth study on Frontend Development covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Frontend Development Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Frontend Development Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Frontend Development Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Frontend Development Production Deployment & Server Pipelines",
        "desc": "In-depth study on Frontend Development covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Frontend Development Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Frontend Development Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Frontend Development Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "full-stack": {
    "title": "Full Stack Development",
    "category": "Web Dev",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "full-stack,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for Full Stack Development from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "Full Stack Development Setup & Architecture Foundations",
        "desc": "In-depth study on Full Stack Development covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Full Stack Development Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Full Stack Development Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Full Stack Development Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Full Stack Development Variables & Core Data Layouts",
        "desc": "In-depth study on Full Stack Development covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Full Stack Development Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Full Stack Development Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Full Stack Development Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Full Stack Development Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Full Stack Development covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Full Stack Development Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Full Stack Development Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Full Stack Development Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Full Stack Development Iteration loops & State Traversal",
        "desc": "In-depth study on Full Stack Development covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Full Stack Development Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Full Stack Development Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Full Stack Development Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Full Stack Development Modular Functions & Signature Scopes",
        "desc": "In-depth study on Full Stack Development covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Full Stack Development Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Full Stack Development Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Full Stack Development Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Full Stack Development Data Collections & List Structures",
        "desc": "In-depth study on Full Stack Development covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Full Stack Development Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Full Stack Development Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Full Stack Development Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Full Stack Development Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Full Stack Development covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Full Stack Development Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Full Stack Development Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Full Stack Development Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Full Stack Development Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Full Stack Development covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Full Stack Development Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Full Stack Development Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Full Stack Development Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Full Stack Development File Integration & Stream Buffers",
        "desc": "In-depth study on Full Stack Development covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Full Stack Development Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Full Stack Development Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Full Stack Development Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Full Stack Development Package Orchestration & System Modules",
        "desc": "In-depth study on Full Stack Development covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Full Stack Development Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Full Stack Development Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Full Stack Development Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Full Stack Development Performance Optimization & Complexity",
        "desc": "In-depth study on Full Stack Development covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Full Stack Development Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Full Stack Development Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Full Stack Development Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Full Stack Development Production Deployment & Server Pipelines",
        "desc": "In-depth study on Full Stack Development covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Full Stack Development Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Full Stack Development Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Full Stack Development Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "system-design": {
    "title": "System Design",
    "category": "Architecture",
    "difficulty": "Advanced",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "system-design,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for System Design from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "System Design Setup & Architecture Foundations",
        "desc": "In-depth study on System Design covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "System Design Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "System Design Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "System Design Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "System Design Variables & Core Data Layouts",
        "desc": "In-depth study on System Design covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "System Design Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "System Design Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "System Design Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "System Design Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on System Design covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "System Design Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "System Design Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "System Design Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "System Design Iteration loops & State Traversal",
        "desc": "In-depth study on System Design covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "System Design Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "System Design Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "System Design Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "System Design Modular Functions & Signature Scopes",
        "desc": "In-depth study on System Design covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "System Design Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "System Design Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "System Design Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "System Design Data Collections & List Structures",
        "desc": "In-depth study on System Design covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "System Design Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "System Design Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "System Design Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "System Design Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on System Design covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "System Design Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "System Design Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "System Design Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "System Design Error Handling & Diagnostic Operations",
        "desc": "In-depth study on System Design covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "System Design Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "System Design Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "System Design Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "System Design File Integration & Stream Buffers",
        "desc": "In-depth study on System Design covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "System Design Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "System Design Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "System Design Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "System Design Package Orchestration & System Modules",
        "desc": "In-depth study on System Design covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "System Design Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "System Design Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "System Design Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "System Design Performance Optimization & Complexity",
        "desc": "In-depth study on System Design covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "System Design Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "System Design Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "System Design Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "System Design Production Deployment & Server Pipelines",
        "desc": "In-depth study on System Design covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "System Design Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "System Design Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "System Design Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "devops": {
    "title": "DevOps Engineer",
    "category": "DevOps",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "devops,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for DevOps Engineer from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "DevOps Engineer Setup & Architecture Foundations",
        "desc": "In-depth study on DevOps Engineer covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "DevOps Engineer Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "DevOps Engineer Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "DevOps Engineer Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "DevOps Engineer Variables & Core Data Layouts",
        "desc": "In-depth study on DevOps Engineer covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "DevOps Engineer Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "DevOps Engineer Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "DevOps Engineer Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "DevOps Engineer Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on DevOps Engineer covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "DevOps Engineer Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "DevOps Engineer Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "DevOps Engineer Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "DevOps Engineer Iteration loops & State Traversal",
        "desc": "In-depth study on DevOps Engineer covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "DevOps Engineer Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "DevOps Engineer Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "DevOps Engineer Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "DevOps Engineer Modular Functions & Signature Scopes",
        "desc": "In-depth study on DevOps Engineer covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "DevOps Engineer Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "DevOps Engineer Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "DevOps Engineer Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "DevOps Engineer Data Collections & List Structures",
        "desc": "In-depth study on DevOps Engineer covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "DevOps Engineer Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "DevOps Engineer Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "DevOps Engineer Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "DevOps Engineer Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on DevOps Engineer covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "DevOps Engineer Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "DevOps Engineer Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "DevOps Engineer Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "DevOps Engineer Error Handling & Diagnostic Operations",
        "desc": "In-depth study on DevOps Engineer covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "DevOps Engineer Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "DevOps Engineer Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "DevOps Engineer Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "DevOps Engineer File Integration & Stream Buffers",
        "desc": "In-depth study on DevOps Engineer covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "DevOps Engineer Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "DevOps Engineer Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "DevOps Engineer Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "DevOps Engineer Package Orchestration & System Modules",
        "desc": "In-depth study on DevOps Engineer covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "DevOps Engineer Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "DevOps Engineer Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "DevOps Engineer Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "DevOps Engineer Performance Optimization & Complexity",
        "desc": "In-depth study on DevOps Engineer covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "DevOps Engineer Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "DevOps Engineer Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "DevOps Engineer Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "DevOps Engineer Production Deployment & Server Pipelines",
        "desc": "In-depth study on DevOps Engineer covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "DevOps Engineer Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "DevOps Engineer Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "DevOps Engineer Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "docker": {
    "title": "Docker Containers",
    "category": "DevOps",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "docker,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for Docker Containers from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "Docker Containers Setup & Architecture Foundations",
        "desc": "In-depth study on Docker Containers covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Docker Containers Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Docker Containers Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Docker Containers Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Docker Containers Variables & Core Data Layouts",
        "desc": "In-depth study on Docker Containers covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Docker Containers Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Docker Containers Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Docker Containers Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Docker Containers Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Docker Containers covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Docker Containers Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Docker Containers Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Docker Containers Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Docker Containers Iteration loops & State Traversal",
        "desc": "In-depth study on Docker Containers covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Docker Containers Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Docker Containers Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Docker Containers Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Docker Containers Modular Functions & Signature Scopes",
        "desc": "In-depth study on Docker Containers covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Docker Containers Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Docker Containers Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Docker Containers Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Docker Containers Data Collections & List Structures",
        "desc": "In-depth study on Docker Containers covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Docker Containers Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Docker Containers Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Docker Containers Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Docker Containers Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Docker Containers covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Docker Containers Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Docker Containers Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Docker Containers Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Docker Containers Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Docker Containers covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Docker Containers Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Docker Containers Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Docker Containers Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Docker Containers File Integration & Stream Buffers",
        "desc": "In-depth study on Docker Containers covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Docker Containers Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Docker Containers Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Docker Containers Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Docker Containers Package Orchestration & System Modules",
        "desc": "In-depth study on Docker Containers covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Docker Containers Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Docker Containers Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Docker Containers Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Docker Containers Performance Optimization & Complexity",
        "desc": "In-depth study on Docker Containers covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Docker Containers Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Docker Containers Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Docker Containers Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Docker Containers Production Deployment & Server Pipelines",
        "desc": "In-depth study on Docker Containers covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Docker Containers Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Docker Containers Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Docker Containers Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "kubernetes": {
    "title": "Kubernetes Orchestration",
    "category": "DevOps",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "kubernetes,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for Kubernetes Orchestration from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "Kubernetes Orchestration Setup & Architecture Foundations",
        "desc": "In-depth study on Kubernetes Orchestration covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Kubernetes Orchestration Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Kubernetes Orchestration Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Kubernetes Orchestration Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Kubernetes Orchestration Variables & Core Data Layouts",
        "desc": "In-depth study on Kubernetes Orchestration covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Kubernetes Orchestration Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Kubernetes Orchestration Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Kubernetes Orchestration Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Kubernetes Orchestration Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Kubernetes Orchestration covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Kubernetes Orchestration Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Kubernetes Orchestration Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Kubernetes Orchestration Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Kubernetes Orchestration Iteration loops & State Traversal",
        "desc": "In-depth study on Kubernetes Orchestration covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Kubernetes Orchestration Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Kubernetes Orchestration Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Kubernetes Orchestration Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Kubernetes Orchestration Modular Functions & Signature Scopes",
        "desc": "In-depth study on Kubernetes Orchestration covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Kubernetes Orchestration Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Kubernetes Orchestration Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Kubernetes Orchestration Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Kubernetes Orchestration Data Collections & List Structures",
        "desc": "In-depth study on Kubernetes Orchestration covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Kubernetes Orchestration Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Kubernetes Orchestration Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Kubernetes Orchestration Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Kubernetes Orchestration Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Kubernetes Orchestration covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Kubernetes Orchestration Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Kubernetes Orchestration Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Kubernetes Orchestration Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Kubernetes Orchestration Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Kubernetes Orchestration covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Kubernetes Orchestration Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Kubernetes Orchestration Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Kubernetes Orchestration Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Kubernetes Orchestration File Integration & Stream Buffers",
        "desc": "In-depth study on Kubernetes Orchestration covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Kubernetes Orchestration Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Kubernetes Orchestration Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Kubernetes Orchestration Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Kubernetes Orchestration Package Orchestration & System Modules",
        "desc": "In-depth study on Kubernetes Orchestration covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Kubernetes Orchestration Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Kubernetes Orchestration Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Kubernetes Orchestration Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Kubernetes Orchestration Performance Optimization & Complexity",
        "desc": "In-depth study on Kubernetes Orchestration covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Kubernetes Orchestration Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Kubernetes Orchestration Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Kubernetes Orchestration Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Kubernetes Orchestration Production Deployment & Server Pipelines",
        "desc": "In-depth study on Kubernetes Orchestration covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Kubernetes Orchestration Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Kubernetes Orchestration Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Kubernetes Orchestration Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "aws": {
    "title": "AWS Cloud Architect",
    "category": "Cloud",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "aws,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for AWS Cloud Architect from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "AWS Cloud Architect Setup & Architecture Foundations",
        "desc": "In-depth study on AWS Cloud Architect covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "AWS Cloud Architect Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "AWS Cloud Architect Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "AWS Cloud Architect Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AWS Cloud Architect Variables & Core Data Layouts",
        "desc": "In-depth study on AWS Cloud Architect covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "AWS Cloud Architect Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "AWS Cloud Architect Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "AWS Cloud Architect Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AWS Cloud Architect Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on AWS Cloud Architect covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "AWS Cloud Architect Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "AWS Cloud Architect Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "AWS Cloud Architect Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AWS Cloud Architect Iteration loops & State Traversal",
        "desc": "In-depth study on AWS Cloud Architect covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "AWS Cloud Architect Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "AWS Cloud Architect Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "AWS Cloud Architect Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AWS Cloud Architect Modular Functions & Signature Scopes",
        "desc": "In-depth study on AWS Cloud Architect covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "AWS Cloud Architect Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "AWS Cloud Architect Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "AWS Cloud Architect Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AWS Cloud Architect Data Collections & List Structures",
        "desc": "In-depth study on AWS Cloud Architect covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "AWS Cloud Architect Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "AWS Cloud Architect Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "AWS Cloud Architect Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AWS Cloud Architect Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on AWS Cloud Architect covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "AWS Cloud Architect Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "AWS Cloud Architect Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "AWS Cloud Architect Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AWS Cloud Architect Error Handling & Diagnostic Operations",
        "desc": "In-depth study on AWS Cloud Architect covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "AWS Cloud Architect Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "AWS Cloud Architect Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "AWS Cloud Architect Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AWS Cloud Architect File Integration & Stream Buffers",
        "desc": "In-depth study on AWS Cloud Architect covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "AWS Cloud Architect Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "AWS Cloud Architect Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "AWS Cloud Architect Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AWS Cloud Architect Package Orchestration & System Modules",
        "desc": "In-depth study on AWS Cloud Architect covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "AWS Cloud Architect Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "AWS Cloud Architect Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "AWS Cloud Architect Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AWS Cloud Architect Performance Optimization & Complexity",
        "desc": "In-depth study on AWS Cloud Architect covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "AWS Cloud Architect Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "AWS Cloud Architect Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "AWS Cloud Architect Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AWS Cloud Architect Production Deployment & Server Pipelines",
        "desc": "In-depth study on AWS Cloud Architect covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "AWS Cloud Architect Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "AWS Cloud Architect Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "AWS Cloud Architect Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "azure": {
    "title": "Azure Cloud Engineer",
    "category": "Cloud",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "azure,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for Azure Cloud Engineer from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "Azure Cloud Engineer Setup & Architecture Foundations",
        "desc": "In-depth study on Azure Cloud Engineer covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Azure Cloud Engineer Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Azure Cloud Engineer Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Azure Cloud Engineer Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Azure Cloud Engineer Variables & Core Data Layouts",
        "desc": "In-depth study on Azure Cloud Engineer covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Azure Cloud Engineer Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Azure Cloud Engineer Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Azure Cloud Engineer Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Azure Cloud Engineer Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Azure Cloud Engineer covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Azure Cloud Engineer Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Azure Cloud Engineer Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Azure Cloud Engineer Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Azure Cloud Engineer Iteration loops & State Traversal",
        "desc": "In-depth study on Azure Cloud Engineer covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Azure Cloud Engineer Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Azure Cloud Engineer Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Azure Cloud Engineer Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Azure Cloud Engineer Modular Functions & Signature Scopes",
        "desc": "In-depth study on Azure Cloud Engineer covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Azure Cloud Engineer Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Azure Cloud Engineer Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Azure Cloud Engineer Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Azure Cloud Engineer Data Collections & List Structures",
        "desc": "In-depth study on Azure Cloud Engineer covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Azure Cloud Engineer Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Azure Cloud Engineer Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Azure Cloud Engineer Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Azure Cloud Engineer Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Azure Cloud Engineer covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Azure Cloud Engineer Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Azure Cloud Engineer Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Azure Cloud Engineer Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Azure Cloud Engineer Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Azure Cloud Engineer covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Azure Cloud Engineer Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Azure Cloud Engineer Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Azure Cloud Engineer Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Azure Cloud Engineer File Integration & Stream Buffers",
        "desc": "In-depth study on Azure Cloud Engineer covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Azure Cloud Engineer Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Azure Cloud Engineer Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Azure Cloud Engineer Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Azure Cloud Engineer Package Orchestration & System Modules",
        "desc": "In-depth study on Azure Cloud Engineer covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Azure Cloud Engineer Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Azure Cloud Engineer Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Azure Cloud Engineer Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Azure Cloud Engineer Performance Optimization & Complexity",
        "desc": "In-depth study on Azure Cloud Engineer covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Azure Cloud Engineer Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Azure Cloud Engineer Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Azure Cloud Engineer Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Azure Cloud Engineer Production Deployment & Server Pipelines",
        "desc": "In-depth study on Azure Cloud Engineer covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Azure Cloud Engineer Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Azure Cloud Engineer Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Azure Cloud Engineer Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "gcp": {
    "title": "GCP Cloud Engineer",
    "category": "Cloud",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "gcp,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for GCP Cloud Engineer from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "GCP Cloud Engineer Setup & Architecture Foundations",
        "desc": "In-depth study on GCP Cloud Engineer covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "GCP Cloud Engineer Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "GCP Cloud Engineer Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "GCP Cloud Engineer Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "GCP Cloud Engineer Variables & Core Data Layouts",
        "desc": "In-depth study on GCP Cloud Engineer covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "GCP Cloud Engineer Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "GCP Cloud Engineer Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "GCP Cloud Engineer Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "GCP Cloud Engineer Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on GCP Cloud Engineer covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "GCP Cloud Engineer Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "GCP Cloud Engineer Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "GCP Cloud Engineer Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "GCP Cloud Engineer Iteration loops & State Traversal",
        "desc": "In-depth study on GCP Cloud Engineer covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "GCP Cloud Engineer Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "GCP Cloud Engineer Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "GCP Cloud Engineer Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "GCP Cloud Engineer Modular Functions & Signature Scopes",
        "desc": "In-depth study on GCP Cloud Engineer covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "GCP Cloud Engineer Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "GCP Cloud Engineer Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "GCP Cloud Engineer Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "GCP Cloud Engineer Data Collections & List Structures",
        "desc": "In-depth study on GCP Cloud Engineer covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "GCP Cloud Engineer Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "GCP Cloud Engineer Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "GCP Cloud Engineer Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "GCP Cloud Engineer Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on GCP Cloud Engineer covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "GCP Cloud Engineer Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "GCP Cloud Engineer Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "GCP Cloud Engineer Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "GCP Cloud Engineer Error Handling & Diagnostic Operations",
        "desc": "In-depth study on GCP Cloud Engineer covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "GCP Cloud Engineer Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "GCP Cloud Engineer Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "GCP Cloud Engineer Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "GCP Cloud Engineer File Integration & Stream Buffers",
        "desc": "In-depth study on GCP Cloud Engineer covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "GCP Cloud Engineer Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "GCP Cloud Engineer Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "GCP Cloud Engineer Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "GCP Cloud Engineer Package Orchestration & System Modules",
        "desc": "In-depth study on GCP Cloud Engineer covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "GCP Cloud Engineer Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "GCP Cloud Engineer Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "GCP Cloud Engineer Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "GCP Cloud Engineer Performance Optimization & Complexity",
        "desc": "In-depth study on GCP Cloud Engineer covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "GCP Cloud Engineer Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "GCP Cloud Engineer Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "GCP Cloud Engineer Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "GCP Cloud Engineer Production Deployment & Server Pipelines",
        "desc": "In-depth study on GCP Cloud Engineer covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "GCP Cloud Engineer Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "GCP Cloud Engineer Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "GCP Cloud Engineer Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "ml": {
    "title": "Machine Learning",
    "category": "AI/ML",
    "difficulty": "Advanced",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "ml,python,coding,edunet",
    "description": "Complete structured curriculum mapping for Machine Learning from beginner to production-ready design.",
    "language": "python",
    "modules": [
      {
        "name": "Machine Learning Setup & Architecture Foundations",
        "desc": "In-depth study on Machine Learning covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Machine Learning Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Machine Learning Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Machine Learning Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Machine Learning Variables & Core Data Layouts",
        "desc": "In-depth study on Machine Learning covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Machine Learning Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Machine Learning Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Machine Learning Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Machine Learning Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Machine Learning covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Machine Learning Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Machine Learning Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Machine Learning Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Machine Learning Iteration loops & State Traversal",
        "desc": "In-depth study on Machine Learning covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Machine Learning Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Machine Learning Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Machine Learning Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Machine Learning Modular Functions & Signature Scopes",
        "desc": "In-depth study on Machine Learning covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Machine Learning Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Machine Learning Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Machine Learning Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Machine Learning Data Collections & List Structures",
        "desc": "In-depth study on Machine Learning covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Machine Learning Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Machine Learning Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Machine Learning Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Machine Learning Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Machine Learning covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Machine Learning Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Machine Learning Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Machine Learning Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Machine Learning Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Machine Learning covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Machine Learning Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Machine Learning Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Machine Learning Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Machine Learning File Integration & Stream Buffers",
        "desc": "In-depth study on Machine Learning covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Machine Learning Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Machine Learning Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Machine Learning Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Machine Learning Package Orchestration & System Modules",
        "desc": "In-depth study on Machine Learning covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Machine Learning Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Machine Learning Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Machine Learning Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Machine Learning Performance Optimization & Complexity",
        "desc": "In-depth study on Machine Learning covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Machine Learning Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Machine Learning Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Machine Learning Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Machine Learning Production Deployment & Server Pipelines",
        "desc": "In-depth study on Machine Learning covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Machine Learning Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Machine Learning Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Machine Learning Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "ai-engineer": {
    "title": "AI Engineer",
    "category": "AI/ML",
    "difficulty": "Advanced",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "ai-engineer,python,coding,edunet",
    "description": "Complete structured curriculum mapping for AI Engineer from beginner to production-ready design.",
    "language": "python",
    "modules": [
      {
        "name": "AI Engineer Setup & Architecture Foundations",
        "desc": "In-depth study on AI Engineer covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "AI Engineer Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "AI Engineer Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "AI Engineer Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AI Engineer Variables & Core Data Layouts",
        "desc": "In-depth study on AI Engineer covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "AI Engineer Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "AI Engineer Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "AI Engineer Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AI Engineer Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on AI Engineer covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "AI Engineer Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "AI Engineer Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "AI Engineer Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AI Engineer Iteration loops & State Traversal",
        "desc": "In-depth study on AI Engineer covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "AI Engineer Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "AI Engineer Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "AI Engineer Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AI Engineer Modular Functions & Signature Scopes",
        "desc": "In-depth study on AI Engineer covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "AI Engineer Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "AI Engineer Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "AI Engineer Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AI Engineer Data Collections & List Structures",
        "desc": "In-depth study on AI Engineer covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "AI Engineer Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "AI Engineer Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "AI Engineer Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AI Engineer Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on AI Engineer covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "AI Engineer Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "AI Engineer Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "AI Engineer Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AI Engineer Error Handling & Diagnostic Operations",
        "desc": "In-depth study on AI Engineer covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "AI Engineer Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "AI Engineer Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "AI Engineer Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AI Engineer File Integration & Stream Buffers",
        "desc": "In-depth study on AI Engineer covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "AI Engineer Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "AI Engineer Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "AI Engineer Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AI Engineer Package Orchestration & System Modules",
        "desc": "In-depth study on AI Engineer covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "AI Engineer Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "AI Engineer Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "AI Engineer Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AI Engineer Performance Optimization & Complexity",
        "desc": "In-depth study on AI Engineer covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "AI Engineer Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "AI Engineer Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "AI Engineer Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "AI Engineer Production Deployment & Server Pipelines",
        "desc": "In-depth study on AI Engineer covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "AI Engineer Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "AI Engineer Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "AI Engineer Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "ai": {
    "title": "Artificial Intelligence",
    "category": "AI/ML",
    "difficulty": "Advanced",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "ai,python,coding,edunet",
    "description": "Complete structured curriculum mapping for Artificial Intelligence from beginner to production-ready design.",
    "language": "python",
    "modules": [
      {
        "name": "Artificial Intelligence Setup & Architecture Foundations",
        "desc": "In-depth study on Artificial Intelligence covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Artificial Intelligence Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Artificial Intelligence Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Artificial Intelligence Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Artificial Intelligence Variables & Core Data Layouts",
        "desc": "In-depth study on Artificial Intelligence covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Artificial Intelligence Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Artificial Intelligence Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Artificial Intelligence Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Artificial Intelligence Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Artificial Intelligence covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Artificial Intelligence Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Artificial Intelligence Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Artificial Intelligence Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Artificial Intelligence Iteration loops & State Traversal",
        "desc": "In-depth study on Artificial Intelligence covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Artificial Intelligence Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Artificial Intelligence Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Artificial Intelligence Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Artificial Intelligence Modular Functions & Signature Scopes",
        "desc": "In-depth study on Artificial Intelligence covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Artificial Intelligence Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Artificial Intelligence Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Artificial Intelligence Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Artificial Intelligence Data Collections & List Structures",
        "desc": "In-depth study on Artificial Intelligence covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Artificial Intelligence Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Artificial Intelligence Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Artificial Intelligence Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Artificial Intelligence Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Artificial Intelligence covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Artificial Intelligence Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Artificial Intelligence Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Artificial Intelligence Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Artificial Intelligence Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Artificial Intelligence covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Artificial Intelligence Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Artificial Intelligence Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Artificial Intelligence Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Artificial Intelligence File Integration & Stream Buffers",
        "desc": "In-depth study on Artificial Intelligence covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Artificial Intelligence Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Artificial Intelligence Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Artificial Intelligence Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Artificial Intelligence Package Orchestration & System Modules",
        "desc": "In-depth study on Artificial Intelligence covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Artificial Intelligence Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Artificial Intelligence Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Artificial Intelligence Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Artificial Intelligence Performance Optimization & Complexity",
        "desc": "In-depth study on Artificial Intelligence covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Artificial Intelligence Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Artificial Intelligence Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Artificial Intelligence Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Artificial Intelligence Production Deployment & Server Pipelines",
        "desc": "In-depth study on Artificial Intelligence covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Artificial Intelligence Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Artificial Intelligence Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Artificial Intelligence Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "data-science": {
    "title": "Data Science",
    "category": "Data",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "data-science,python,coding,edunet",
    "description": "Complete structured curriculum mapping for Data Science from beginner to production-ready design.",
    "language": "python",
    "modules": [
      {
        "name": "Data Science Setup & Architecture Foundations",
        "desc": "In-depth study on Data Science covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Data Science Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Data Science Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Data Science Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Science Variables & Core Data Layouts",
        "desc": "In-depth study on Data Science covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Data Science Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Data Science Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Data Science Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Science Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Data Science covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Data Science Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Data Science Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Data Science Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Science Iteration loops & State Traversal",
        "desc": "In-depth study on Data Science covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Data Science Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Data Science Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Data Science Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Science Modular Functions & Signature Scopes",
        "desc": "In-depth study on Data Science covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Data Science Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Data Science Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Data Science Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Science Data Collections & List Structures",
        "desc": "In-depth study on Data Science covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Data Science Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Data Science Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Data Science Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Science Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Data Science covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Data Science Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Data Science Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Data Science Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Science Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Data Science covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Data Science Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Data Science Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Data Science Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Science File Integration & Stream Buffers",
        "desc": "In-depth study on Data Science covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Data Science Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Data Science Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Data Science Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Science Package Orchestration & System Modules",
        "desc": "In-depth study on Data Science covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Data Science Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Data Science Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Data Science Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Science Performance Optimization & Complexity",
        "desc": "In-depth study on Data Science covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Data Science Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Data Science Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Data Science Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Science Production Deployment & Server Pipelines",
        "desc": "In-depth study on Data Science covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Data Science Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Data Science Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Data Science Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "data-engineering": {
    "title": "Data Engineering",
    "category": "Data",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "data-engineering,python,coding,edunet",
    "description": "Complete structured curriculum mapping for Data Engineering from beginner to production-ready design.",
    "language": "python",
    "modules": [
      {
        "name": "Data Engineering Setup & Architecture Foundations",
        "desc": "In-depth study on Data Engineering covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Data Engineering Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Data Engineering Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Data Engineering Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Engineering Variables & Core Data Layouts",
        "desc": "In-depth study on Data Engineering covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Data Engineering Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Data Engineering Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Data Engineering Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Engineering Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Data Engineering covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Data Engineering Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Data Engineering Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Data Engineering Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Engineering Iteration loops & State Traversal",
        "desc": "In-depth study on Data Engineering covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Data Engineering Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Data Engineering Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Data Engineering Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Engineering Modular Functions & Signature Scopes",
        "desc": "In-depth study on Data Engineering covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Data Engineering Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Data Engineering Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Data Engineering Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Engineering Data Collections & List Structures",
        "desc": "In-depth study on Data Engineering covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Data Engineering Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Data Engineering Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Data Engineering Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Engineering Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Data Engineering covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Data Engineering Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Data Engineering Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Data Engineering Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Engineering Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Data Engineering covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Data Engineering Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Data Engineering Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Data Engineering Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Engineering File Integration & Stream Buffers",
        "desc": "In-depth study on Data Engineering covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Data Engineering Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Data Engineering Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Data Engineering Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Engineering Package Orchestration & System Modules",
        "desc": "In-depth study on Data Engineering covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Data Engineering Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Data Engineering Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Data Engineering Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Engineering Performance Optimization & Complexity",
        "desc": "In-depth study on Data Engineering covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Data Engineering Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Data Engineering Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Data Engineering Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Engineering Production Deployment & Server Pipelines",
        "desc": "In-depth study on Data Engineering covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Data Engineering Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Data Engineering Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Data Engineering Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "cybersecurity": {
    "title": "Cybersecurity Analyst",
    "category": "Security",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "cybersecurity,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for Cybersecurity Analyst from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "Cybersecurity Analyst Setup & Architecture Foundations",
        "desc": "In-depth study on Cybersecurity Analyst covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Cybersecurity Analyst Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Cybersecurity Analyst Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Cybersecurity Analyst Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Cybersecurity Analyst Variables & Core Data Layouts",
        "desc": "In-depth study on Cybersecurity Analyst covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Cybersecurity Analyst Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Cybersecurity Analyst Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Cybersecurity Analyst Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Cybersecurity Analyst Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Cybersecurity Analyst covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Cybersecurity Analyst Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Cybersecurity Analyst Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Cybersecurity Analyst Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Cybersecurity Analyst Iteration loops & State Traversal",
        "desc": "In-depth study on Cybersecurity Analyst covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Cybersecurity Analyst Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Cybersecurity Analyst Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Cybersecurity Analyst Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Cybersecurity Analyst Modular Functions & Signature Scopes",
        "desc": "In-depth study on Cybersecurity Analyst covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Cybersecurity Analyst Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Cybersecurity Analyst Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Cybersecurity Analyst Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Cybersecurity Analyst Data Collections & List Structures",
        "desc": "In-depth study on Cybersecurity Analyst covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Cybersecurity Analyst Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Cybersecurity Analyst Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Cybersecurity Analyst Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Cybersecurity Analyst Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Cybersecurity Analyst covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Cybersecurity Analyst Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Cybersecurity Analyst Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Cybersecurity Analyst Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Cybersecurity Analyst Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Cybersecurity Analyst covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Cybersecurity Analyst Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Cybersecurity Analyst Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Cybersecurity Analyst Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Cybersecurity Analyst File Integration & Stream Buffers",
        "desc": "In-depth study on Cybersecurity Analyst covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Cybersecurity Analyst Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Cybersecurity Analyst Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Cybersecurity Analyst Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Cybersecurity Analyst Package Orchestration & System Modules",
        "desc": "In-depth study on Cybersecurity Analyst covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Cybersecurity Analyst Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Cybersecurity Analyst Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Cybersecurity Analyst Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Cybersecurity Analyst Performance Optimization & Complexity",
        "desc": "In-depth study on Cybersecurity Analyst covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Cybersecurity Analyst Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Cybersecurity Analyst Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Cybersecurity Analyst Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Cybersecurity Analyst Production Deployment & Server Pipelines",
        "desc": "In-depth study on Cybersecurity Analyst covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Cybersecurity Analyst Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Cybersecurity Analyst Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Cybersecurity Analyst Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "android": {
    "title": "Android Developer",
    "category": "Mobile",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "android,java,coding,edunet",
    "description": "Complete structured curriculum mapping for Android Developer from beginner to production-ready design.",
    "language": "java",
    "modules": [
      {
        "name": "Android Developer Setup & Architecture Foundations",
        "desc": "In-depth study on Android Developer covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Android Developer Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Android Developer Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Android Developer Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Android Developer Variables & Core Data Layouts",
        "desc": "In-depth study on Android Developer covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Android Developer Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Android Developer Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Android Developer Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Android Developer Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Android Developer covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Android Developer Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Android Developer Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Android Developer Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Android Developer Iteration loops & State Traversal",
        "desc": "In-depth study on Android Developer covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Android Developer Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Android Developer Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Android Developer Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Android Developer Modular Functions & Signature Scopes",
        "desc": "In-depth study on Android Developer covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Android Developer Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Android Developer Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Android Developer Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Android Developer Data Collections & List Structures",
        "desc": "In-depth study on Android Developer covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Android Developer Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Android Developer Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Android Developer Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Android Developer Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Android Developer covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Android Developer Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Android Developer Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Android Developer Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Android Developer Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Android Developer covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Android Developer Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Android Developer Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Android Developer Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Android Developer File Integration & Stream Buffers",
        "desc": "In-depth study on Android Developer covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Android Developer Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Android Developer Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Android Developer Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Android Developer Package Orchestration & System Modules",
        "desc": "In-depth study on Android Developer covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Android Developer Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Android Developer Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Android Developer Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Android Developer Performance Optimization & Complexity",
        "desc": "In-depth study on Android Developer covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Android Developer Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Android Developer Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Android Developer Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Android Developer Production Deployment & Server Pipelines",
        "desc": "In-depth study on Android Developer covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Android Developer Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Android Developer Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Android Developer Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "flutter": {
    "title": "Flutter Developer",
    "category": "Mobile",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "flutter,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for Flutter Developer from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "Flutter Developer Setup & Architecture Foundations",
        "desc": "In-depth study on Flutter Developer covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Flutter Developer Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Flutter Developer Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Flutter Developer Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Flutter Developer Variables & Core Data Layouts",
        "desc": "In-depth study on Flutter Developer covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Flutter Developer Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Flutter Developer Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Flutter Developer Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Flutter Developer Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Flutter Developer covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Flutter Developer Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Flutter Developer Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Flutter Developer Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Flutter Developer Iteration loops & State Traversal",
        "desc": "In-depth study on Flutter Developer covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Flutter Developer Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Flutter Developer Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Flutter Developer Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Flutter Developer Modular Functions & Signature Scopes",
        "desc": "In-depth study on Flutter Developer covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Flutter Developer Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Flutter Developer Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Flutter Developer Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Flutter Developer Data Collections & List Structures",
        "desc": "In-depth study on Flutter Developer covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Flutter Developer Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Flutter Developer Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Flutter Developer Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Flutter Developer Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Flutter Developer covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Flutter Developer Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Flutter Developer Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Flutter Developer Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Flutter Developer Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Flutter Developer covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Flutter Developer Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Flutter Developer Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Flutter Developer Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Flutter Developer File Integration & Stream Buffers",
        "desc": "In-depth study on Flutter Developer covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Flutter Developer Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Flutter Developer Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Flutter Developer Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Flutter Developer Package Orchestration & System Modules",
        "desc": "In-depth study on Flutter Developer covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Flutter Developer Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Flutter Developer Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Flutter Developer Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Flutter Developer Performance Optimization & Complexity",
        "desc": "In-depth study on Flutter Developer covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Flutter Developer Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Flutter Developer Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Flutter Developer Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Flutter Developer Production Deployment & Server Pipelines",
        "desc": "In-depth study on Flutter Developer covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Flutter Developer Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Flutter Developer Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Flutter Developer Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "ui-ux": {
    "title": "UI/UX Design",
    "category": "Design",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "ui-ux,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for UI/UX Design from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "UI/UX Design Setup & Architecture Foundations",
        "desc": "In-depth study on UI/UX Design covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "UI/UX Design Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "UI/UX Design Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "UI/UX Design Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "UI/UX Design Variables & Core Data Layouts",
        "desc": "In-depth study on UI/UX Design covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "UI/UX Design Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "UI/UX Design Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "UI/UX Design Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "UI/UX Design Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on UI/UX Design covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "UI/UX Design Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "UI/UX Design Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "UI/UX Design Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "UI/UX Design Iteration loops & State Traversal",
        "desc": "In-depth study on UI/UX Design covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "UI/UX Design Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "UI/UX Design Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "UI/UX Design Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "UI/UX Design Modular Functions & Signature Scopes",
        "desc": "In-depth study on UI/UX Design covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "UI/UX Design Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "UI/UX Design Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "UI/UX Design Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "UI/UX Design Data Collections & List Structures",
        "desc": "In-depth study on UI/UX Design covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "UI/UX Design Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "UI/UX Design Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "UI/UX Design Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "UI/UX Design Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on UI/UX Design covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "UI/UX Design Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "UI/UX Design Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "UI/UX Design Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "UI/UX Design Error Handling & Diagnostic Operations",
        "desc": "In-depth study on UI/UX Design covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "UI/UX Design Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "UI/UX Design Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "UI/UX Design Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "UI/UX Design File Integration & Stream Buffers",
        "desc": "In-depth study on UI/UX Design covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "UI/UX Design Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "UI/UX Design Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "UI/UX Design Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "UI/UX Design Package Orchestration & System Modules",
        "desc": "In-depth study on UI/UX Design covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "UI/UX Design Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "UI/UX Design Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "UI/UX Design Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "UI/UX Design Performance Optimization & Complexity",
        "desc": "In-depth study on UI/UX Design covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "UI/UX Design Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "UI/UX Design Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "UI/UX Design Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "UI/UX Design Production Deployment & Server Pipelines",
        "desc": "In-depth study on UI/UX Design covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "UI/UX Design Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "UI/UX Design Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "UI/UX Design Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "blockchain": {
    "title": "Blockchain Developer",
    "category": "Blockchain",
    "difficulty": "Advanced",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "blockchain,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for Blockchain Developer from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "Blockchain Developer Setup & Architecture Foundations",
        "desc": "In-depth study on Blockchain Developer covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Blockchain Developer Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Blockchain Developer Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Blockchain Developer Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Blockchain Developer Variables & Core Data Layouts",
        "desc": "In-depth study on Blockchain Developer covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Blockchain Developer Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Blockchain Developer Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Blockchain Developer Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Blockchain Developer Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Blockchain Developer covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Blockchain Developer Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Blockchain Developer Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Blockchain Developer Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Blockchain Developer Iteration loops & State Traversal",
        "desc": "In-depth study on Blockchain Developer covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Blockchain Developer Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Blockchain Developer Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Blockchain Developer Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Blockchain Developer Modular Functions & Signature Scopes",
        "desc": "In-depth study on Blockchain Developer covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Blockchain Developer Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Blockchain Developer Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Blockchain Developer Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Blockchain Developer Data Collections & List Structures",
        "desc": "In-depth study on Blockchain Developer covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Blockchain Developer Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Blockchain Developer Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Blockchain Developer Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Blockchain Developer Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Blockchain Developer covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Blockchain Developer Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Blockchain Developer Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Blockchain Developer Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Blockchain Developer Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Blockchain Developer covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Blockchain Developer Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Blockchain Developer Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Blockchain Developer Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Blockchain Developer File Integration & Stream Buffers",
        "desc": "In-depth study on Blockchain Developer covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Blockchain Developer Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Blockchain Developer Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Blockchain Developer Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Blockchain Developer Package Orchestration & System Modules",
        "desc": "In-depth study on Blockchain Developer covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Blockchain Developer Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Blockchain Developer Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Blockchain Developer Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Blockchain Developer Performance Optimization & Complexity",
        "desc": "In-depth study on Blockchain Developer covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Blockchain Developer Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Blockchain Developer Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Blockchain Developer Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Blockchain Developer Production Deployment & Server Pipelines",
        "desc": "In-depth study on Blockchain Developer covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Blockchain Developer Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Blockchain Developer Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Blockchain Developer Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "competitive": {
    "title": "Competitive Programming",
    "category": "Programming",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "competitive,cpp,coding,edunet",
    "description": "Complete structured curriculum mapping for Competitive Programming from beginner to production-ready design.",
    "language": "cpp",
    "modules": [
      {
        "name": "Competitive Programming Setup & Architecture Foundations",
        "desc": "In-depth study on Competitive Programming covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Competitive Programming Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Competitive Programming Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Competitive Programming Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Competitive Programming Variables & Core Data Layouts",
        "desc": "In-depth study on Competitive Programming covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Competitive Programming Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Competitive Programming Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Competitive Programming Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Competitive Programming Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Competitive Programming covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Competitive Programming Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Competitive Programming Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Competitive Programming Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Competitive Programming Iteration loops & State Traversal",
        "desc": "In-depth study on Competitive Programming covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Competitive Programming Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Competitive Programming Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Competitive Programming Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Competitive Programming Modular Functions & Signature Scopes",
        "desc": "In-depth study on Competitive Programming covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Competitive Programming Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Competitive Programming Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Competitive Programming Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Competitive Programming Data Collections & List Structures",
        "desc": "In-depth study on Competitive Programming covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Competitive Programming Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Competitive Programming Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Competitive Programming Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Competitive Programming Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Competitive Programming covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Competitive Programming Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Competitive Programming Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Competitive Programming Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Competitive Programming Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Competitive Programming covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Competitive Programming Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Competitive Programming Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Competitive Programming Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Competitive Programming File Integration & Stream Buffers",
        "desc": "In-depth study on Competitive Programming covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Competitive Programming Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Competitive Programming Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Competitive Programming Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Competitive Programming Package Orchestration & System Modules",
        "desc": "In-depth study on Competitive Programming covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Competitive Programming Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Competitive Programming Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Competitive Programming Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Competitive Programming Performance Optimization & Complexity",
        "desc": "In-depth study on Competitive Programming covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Competitive Programming Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Competitive Programming Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Competitive Programming Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Competitive Programming Production Deployment & Server Pipelines",
        "desc": "In-depth study on Competitive Programming covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Competitive Programming Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Competitive Programming Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Competitive Programming Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "placement": {
    "title": "Placement Preparation",
    "category": "Career",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "placement,cpp,coding,edunet",
    "description": "Complete structured curriculum mapping for Placement Preparation from beginner to production-ready design.",
    "language": "cpp",
    "modules": [
      {
        "name": "Placement Preparation Setup & Architecture Foundations",
        "desc": "In-depth study on Placement Preparation covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Placement Preparation Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Placement Preparation Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Placement Preparation Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Placement Preparation Variables & Core Data Layouts",
        "desc": "In-depth study on Placement Preparation covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Placement Preparation Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Placement Preparation Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Placement Preparation Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Placement Preparation Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Placement Preparation covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Placement Preparation Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Placement Preparation Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Placement Preparation Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Placement Preparation Iteration loops & State Traversal",
        "desc": "In-depth study on Placement Preparation covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Placement Preparation Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Placement Preparation Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Placement Preparation Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Placement Preparation Modular Functions & Signature Scopes",
        "desc": "In-depth study on Placement Preparation covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Placement Preparation Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Placement Preparation Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Placement Preparation Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Placement Preparation Data Collections & List Structures",
        "desc": "In-depth study on Placement Preparation covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Placement Preparation Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Placement Preparation Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Placement Preparation Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Placement Preparation Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Placement Preparation covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Placement Preparation Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Placement Preparation Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Placement Preparation Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Placement Preparation Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Placement Preparation covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Placement Preparation Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Placement Preparation Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Placement Preparation Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Placement Preparation File Integration & Stream Buffers",
        "desc": "In-depth study on Placement Preparation covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Placement Preparation Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Placement Preparation Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Placement Preparation Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Placement Preparation Package Orchestration & System Modules",
        "desc": "In-depth study on Placement Preparation covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Placement Preparation Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Placement Preparation Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Placement Preparation Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Placement Preparation Performance Optimization & Complexity",
        "desc": "In-depth study on Placement Preparation covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Placement Preparation Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Placement Preparation Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Placement Preparation Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Placement Preparation Production Deployment & Server Pipelines",
        "desc": "In-depth study on Placement Preparation covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Placement Preparation Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Placement Preparation Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Placement Preparation Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "dsa": {
    "title": "Data Structures & Algorithms",
    "category": "Programming",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "dsa,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for Data Structures & Algorithms from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "Data Structures & Algorithms Setup & Architecture Foundations",
        "desc": "In-depth study on Data Structures & Algorithms covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Data Structures & Algorithms Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Data Structures & Algorithms Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Data Structures & Algorithms Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Structures & Algorithms Variables & Core Data Layouts",
        "desc": "In-depth study on Data Structures & Algorithms covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Data Structures & Algorithms Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Data Structures & Algorithms Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Data Structures & Algorithms Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Structures & Algorithms Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Data Structures & Algorithms covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Data Structures & Algorithms Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Data Structures & Algorithms Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Data Structures & Algorithms Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Structures & Algorithms Iteration loops & State Traversal",
        "desc": "In-depth study on Data Structures & Algorithms covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Data Structures & Algorithms Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Data Structures & Algorithms Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Data Structures & Algorithms Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Structures & Algorithms Modular Functions & Signature Scopes",
        "desc": "In-depth study on Data Structures & Algorithms covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Data Structures & Algorithms Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Data Structures & Algorithms Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Data Structures & Algorithms Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Structures & Algorithms Data Collections & List Structures",
        "desc": "In-depth study on Data Structures & Algorithms covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Data Structures & Algorithms Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Data Structures & Algorithms Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Data Structures & Algorithms Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Structures & Algorithms Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Data Structures & Algorithms covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Data Structures & Algorithms Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Data Structures & Algorithms Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Data Structures & Algorithms Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Structures & Algorithms Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Data Structures & Algorithms covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Data Structures & Algorithms Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Data Structures & Algorithms Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Data Structures & Algorithms Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Structures & Algorithms File Integration & Stream Buffers",
        "desc": "In-depth study on Data Structures & Algorithms covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Data Structures & Algorithms Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Data Structures & Algorithms Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Data Structures & Algorithms Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Structures & Algorithms Package Orchestration & System Modules",
        "desc": "In-depth study on Data Structures & Algorithms covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Data Structures & Algorithms Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Data Structures & Algorithms Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Data Structures & Algorithms Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Structures & Algorithms Performance Optimization & Complexity",
        "desc": "In-depth study on Data Structures & Algorithms covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Data Structures & Algorithms Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Data Structures & Algorithms Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Data Structures & Algorithms Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Data Structures & Algorithms Production Deployment & Server Pipelines",
        "desc": "In-depth study on Data Structures & Algorithms covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Data Structures & Algorithms Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Data Structures & Algorithms Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Data Structures & Algorithms Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  },
  "webdev": {
    "title": "Web Development",
    "category": "Web Dev",
    "difficulty": "Intermediate",
    "duration": "12 weeks",
    "xp_reward": 2000,
    "icon": "🧭",
    "tags": "webdev,javascript,coding,edunet",
    "description": "Complete structured curriculum mapping for Web Development from beginner to production-ready design.",
    "language": "javascript",
    "modules": [
      {
        "name": "Web Development Setup & Architecture Foundations",
        "desc": "In-depth study on Web Development covering understanding execution models and initializing runtime environments.",
        "lessons": [
          {
            "title": "Web Development Core Principles Part 1A",
            "desc": "Understanding base constructs for setup & architecture foundations."
          },
          {
            "title": "Web Development Implementation Steps Part 1B",
            "desc": "Hands-on guides and code steps for setup & architecture foundations."
          },
          {
            "title": "Web Development Troubleshooting Part 1C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Web Development Variables & Core Data Layouts",
        "desc": "In-depth study on Web Development covering working with primitive declarations, references, and variables scopes.",
        "lessons": [
          {
            "title": "Web Development Core Principles Part 2A",
            "desc": "Understanding base constructs for variables & core data layouts."
          },
          {
            "title": "Web Development Implementation Steps Part 2B",
            "desc": "Hands-on guides and code steps for variables & core data layouts."
          },
          {
            "title": "Web Development Troubleshooting Part 2C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Web Development Control Flow & Boolean Logic Branching",
        "desc": "In-depth study on Web Development covering steering execution routines using conditional branching checks.",
        "lessons": [
          {
            "title": "Web Development Core Principles Part 3A",
            "desc": "Understanding base constructs for control flow & boolean logic branching."
          },
          {
            "title": "Web Development Implementation Steps Part 3B",
            "desc": "Hands-on guides and code steps for control flow & boolean logic branching."
          },
          {
            "title": "Web Development Troubleshooting Part 3C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Web Development Iteration loops & State Traversal",
        "desc": "In-depth study on Web Development covering optimizing repetition loops and scanning collection indexes.",
        "lessons": [
          {
            "title": "Web Development Core Principles Part 4A",
            "desc": "Understanding base constructs for iteration loops & state traversal."
          },
          {
            "title": "Web Development Implementation Steps Part 4B",
            "desc": "Hands-on guides and code steps for iteration loops & state traversal."
          },
          {
            "title": "Web Development Troubleshooting Part 4C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Web Development Modular Functions & Signature Scopes",
        "desc": "In-depth study on Web Development covering isolating code blocks and managing call frames stacks.",
        "lessons": [
          {
            "title": "Web Development Core Principles Part 5A",
            "desc": "Understanding base constructs for modular functions & signature scopes."
          },
          {
            "title": "Web Development Implementation Steps Part 5B",
            "desc": "Hands-on guides and code steps for modular functions & signature scopes."
          },
          {
            "title": "Web Development Troubleshooting Part 5C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Web Development Data Collections & List Structures",
        "desc": "In-depth study on Web Development covering storing sorted items and manipulating contiguous tables.",
        "lessons": [
          {
            "title": "Web Development Core Principles Part 6A",
            "desc": "Understanding base constructs for data collections & list structures."
          },
          {
            "title": "Web Development Implementation Steps Part 6B",
            "desc": "Hands-on guides and code steps for data collections & list structures."
          },
          {
            "title": "Web Development Troubleshooting Part 6C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Web Development Advanced Abstractions & Type Blueprints",
        "desc": "In-depth study on Web Development covering designing class constructs, interfaces, or complex layouts.",
        "lessons": [
          {
            "title": "Web Development Core Principles Part 7A",
            "desc": "Understanding base constructs for advanced abstractions & type blueprints."
          },
          {
            "title": "Web Development Implementation Steps Part 7B",
            "desc": "Hands-on guides and code steps for advanced abstractions & type blueprints."
          },
          {
            "title": "Web Development Troubleshooting Part 7C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Web Development Error Handling & Diagnostic Operations",
        "desc": "In-depth study on Web Development covering handling stack faults and recovering gracefully from crashes.",
        "lessons": [
          {
            "title": "Web Development Core Principles Part 8A",
            "desc": "Understanding base constructs for error handling & diagnostic operations."
          },
          {
            "title": "Web Development Implementation Steps Part 8B",
            "desc": "Hands-on guides and code steps for error handling & diagnostic operations."
          },
          {
            "title": "Web Development Troubleshooting Part 8C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Web Development File Integration & Stream Buffers",
        "desc": "In-depth study on Web Development covering reading and writing inputs to persistent storage structures.",
        "lessons": [
          {
            "title": "Web Development Core Principles Part 9A",
            "desc": "Understanding base constructs for file integration & stream buffers."
          },
          {
            "title": "Web Development Implementation Steps Part 9B",
            "desc": "Hands-on guides and code steps for file integration & stream buffers."
          },
          {
            "title": "Web Development Troubleshooting Part 9C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Web Development Package Orchestration & System Modules",
        "desc": "In-depth study on Web Development covering managing external libraries and resolving package dependencies.",
        "lessons": [
          {
            "title": "Web Development Core Principles Part 10A",
            "desc": "Understanding base constructs for package orchestration & system modules."
          },
          {
            "title": "Web Development Implementation Steps Part 10B",
            "desc": "Hands-on guides and code steps for package orchestration & system modules."
          },
          {
            "title": "Web Development Troubleshooting Part 10C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Web Development Performance Optimization & Complexity",
        "desc": "In-depth study on Web Development covering analyzing scale limits and reducing execution bottlenecks.",
        "lessons": [
          {
            "title": "Web Development Core Principles Part 11A",
            "desc": "Understanding base constructs for performance optimization & complexity."
          },
          {
            "title": "Web Development Implementation Steps Part 11B",
            "desc": "Hands-on guides and code steps for performance optimization & complexity."
          },
          {
            "title": "Web Development Troubleshooting Part 11C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      },
      {
        "name": "Web Development Production Deployment & Server Pipelines",
        "desc": "In-depth study on Web Development covering deploying built assets to cloud hosting configurations.",
        "lessons": [
          {
            "title": "Web Development Core Principles Part 12A",
            "desc": "Understanding base constructs for production deployment & server pipelines."
          },
          {
            "title": "Web Development Implementation Steps Part 12B",
            "desc": "Hands-on guides and code steps for production deployment & server pipelines."
          },
          {
            "title": "Web Development Troubleshooting Part 12C",
            "desc": "Debugging error flags and optimizing performance bounds."
          }
        ]
      }
    ]
  }
};
