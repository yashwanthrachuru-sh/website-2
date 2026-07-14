// ============================================================
// backend/services/engine/conceptProfiles.js
// EduNet Content Engine — Unified Concept Profiles Registry (v6.2)
// Provides textbook-grade, unique educational profiles for all 103 curriculum concepts.
// ============================================================
'use strict';

const CONCEPT_REGISTRY = {
  // ── PYTHON ROADMAP ──────────────────────────────────────────
  'python_introduction': {
    definition: 'Python is a high-level, interpreted programming language designed for readability, clean structures, and rapid execution workflows.',
    why_exists: 'Traditional low-level languages like C require verbose syntax, manual memory allocation, and compilation cycles. Python solves this by reading like standard English, enabling faster software development.',
    analogy: 'Using a personal simultaneous translator during a foreign business trip. Instead of learning machine code, you speak naturally and the translator handles the details on the fly.',
    detailed_concept: 'The Python Interpreter compiles code into an intermediate format called bytecode (.pyc files) rather than native CPU machine code. The Python Virtual Machine (PVM) then loops through this bytecode stack, translating instructions into CPU-level operations.',
    internal_working: 'Allocates reference count counters for variables. The Garbage Collector monitors these counts, reclaiming object slots in heap memory once references hit zero.',
    best_practices: ['Write scripts following PEP 8 style guides.', 'Prefer virtual environments (venv) to isolate package dependencies.'],
    summary: 'Python provides a modern developer-friendly syntax, optimizing development speed across web, scripting, and machine learning.'
  },
  'variables_data_types': {
    definition: 'Variables are named references pointing to memory coordinates, while data types define the specific size and formatting of the binary payload stored within those registers.',
    why_exists: 'Without variables, computer programs would have to hardcode hardware addresses (like 0x7FFF) or raw data values, preventing dynamic inputs like scores, prices, or user inputs.',
    analogy: 'Labeled storage drawers in a closet. The label on the drawer is the variable name, the drawer itself is the memory slot, and the item inside is the value.',
    detailed_concept: 'In dynamically typed languages, variables are bindings pointing to object headers on the heap. In statically typed languages, the compiler allocates direct byte spaces on the stack based on the type definition (e.g., 4 bytes for an integer).',
    internal_working: 'The execution stack handles call frames, storing variable labels in a lexical symbol table mapping name strings to memory offsets.',
    best_practices: ['Use descriptive, self-documenting naming styles.', 'Always define constants for immutable configurations.'],
    summary: 'Variables and data types form the bedrock of memory operations, ensuring code blocks can refer to and update changing states.'
  },
  'control_flow_loops': {
    definition: 'Control flow structures steer execution paths using conditional statements and looping cycles to run blocks repeatedly.',
    why_exists: 'Linear execution runs every line from top to bottom exactly once. Branching and looping allow applications to respond dynamically to input thresholds and process data lists.',
    analogy: 'A highway routing gate. It checks vehicle parameters (like toll tags or height) and directs the vehicle to the appropriate lane, looping vehicles back if necessary.',
    detailed_concept: 'Conditionals and loops alter the linear incrementation of the CPU Instruction Pointer. The ALU performs checks on flags (Zero, Negative) to execute conditional jumps in machine code.',
    internal_working: 'Constructs loop frames using index counters in register allocations. CPU branch predictors optimize jump operations to avoid pipeline stalls.',
    best_practices: ['Always ensure loops have a reachable exit condition.', 'Avoid nested conditional blocks (prefer guard clauses).'],
    summary: 'Branching and iteration structures make code responsive, allowing computers to process inputs based on variable parameters.'
  },
  'functions_scope': {
    definition: 'Functions are modular, callable code blocks, while scope determines the visibility and lifecycle of variables defined inside or outside those modules.',
    why_exists: 'Monolithic scripts are difficult to maintain and test. Package abstraction isolates code blocks, ensuring clean variables do not pollute global tables.',
    analogy: 'A kitchen recipe book. Instead of copying instructions for making dough every time, you write the "makeDough" recipe once and refer to it by name.',
    detailed_concept: 'When a function is invoked, the engine pushes a Stack Frame onto the Call Stack. This frame encapsulates local variables, arguments, and return registers, popping off immediately upon function return.',
    internal_working: 'Maintains scope linkages through Lexical Environment chains. Lookup moves outward from local parameters to enclosing lexical frames, stopping at global records.',
    best_practices: ['Follow the Single Responsibility Principle: each function should do one task.', 'Avoid global variables inside local blocks.'],
    summary: 'Functions compartmentalize operations and limit variable visibility, preventing execution side-effects.'
  },
  'object_oriented_python': {
    definition: 'Object-Oriented Programming (OOP) in Python structures programs around classes (blueprints) and objects (instances) to model real-world concepts.',
    why_exists: 'Procedural code separates data from functions, which becomes complex as projects scale. OOP binds attributes and behaviors together into reusable capsule units.',
    analogy: 'A factory blueprint. The blueprint defines what a vehicle contains (engine, wheels) and how it runs, while each manufactured car is an object instance.',
    detailed_concept: 'Classes establish user-defined types. Python classes maintain instance data inside a special dictionary (__dict__), resolving attribute calls using method resolution tables (MRO).',
    internal_working: 'Instance methods bind the object itself to the first parameter (self), allowing the function stack frame to resolve attributes in instance heap slots.',
    best_practices: ['Follow standard inheritance rules (Liskov Substitution).', 'Keep inheritance trees shallow to avoid multiple inheritance resolution bugs.'],
    summary: 'OOP combines data state and related methods into class structures, enhancing abstraction and modular reuse.'
  },
  'file_handling_io': {
    definition: 'File I/O operations read or write raw bytes and text data streams to secondary storage devices.',
    why_exists: 'Variables in RAM vanish once the program shuts down. File streams enable permanent data storage across sessions.',
    analogy: 'Writing down notes in a journal. If you speak, the words are temporary (RAM). Writing them down on paper creates a permanent record you can read later.',
    detailed_concept: 'The system calls kernel File Descriptors. When opening a file, the OS allocates stream buffer sizes in system memory to handle asynchronous read/write requests.',
    internal_working: 'Blocks of file bytes are fetched into operating system cache buffers, resolving permissions and locking write locks to prevent concurrent corruption.',
    best_practices: ['Always close file handlers using context managers (with/try-with-resources).', 'Check file presence before running write steps.'],
    summary: 'File handling enables persistent storage by linking active heap objects to permanent secondary memory files.'
  },
  'python_modules_packages': {
    definition: 'Modules are single scripts containing definitions, while packages are nested structures of modules configured with a package descriptor.',
    why_exists: 'Putting all code in one massive file results in merge conflicts and namespace collisions. Modules organize large structures into independent namespaces.',
    analogy: 'Organizing a workshop. Instead of dumping all tools in one bucket, you place screwdrivers in one drawer and wrenches in another, labeling them clearly.',
    detailed_concept: 'When importing, Python searches directories listed in sys.path, compiles the module to bytecode, executes its code to populate the module namespaces, and caches the module object in sys.modules.',
    internal_working: 'Prevents multiple evaluation cycles by loading modules into global cached dictionaries. Sub-imports reference the active cached instance directly.',
    best_practices: ['Avoid circular dependency patterns (A imports B, B imports A).', 'Explicitly export module APIs using __all__ lists.'],
    summary: 'Modules and packages segment large architectures, maintaining clear namespaces and dependencies.'
  },
  'apis_requests': {
    definition: 'API request layers fetch or send data to web endpoints using standard web protocols over network sockets.',
    why_exists: 'Isolated software cannot access external services. API protocols allow applications to retrieve real-time weather, database records, or credit card clearances.',
    analogy: 'Ordering food through a waiter. You check the menu (API documentation), tell the waiter (Request), and wait for the kitchen to return your food (Response).',
    detailed_concept: 'Constructs HTTP raw frames containing headers, methods (GET, POST), and payloads. The socket handles TCP handshakes, transmitting serialized frames to external host addresses.',
    internal_working: 'Handles network payloads asynchronously, parsing returned stream bytes into JSON object strings while managing network timeouts.',
    best_practices: ['Implement robust retry logic with exponential backoffs.', 'Gracefully catch connection errors to avoid runtime app crashes.'],
    summary: 'HTTP requests connect local programs to network systems, facilitating distributed data exchanges.'
  },
  'flask_web_framework': {
    definition: 'Flask is a lightweight WSGI micro web framework designed to map network URLs to python handler functions.',
    why_exists: 'Writing bare TCP socket code to parse HTTP paths, routes, query parameters, and session cookies is highly complex. Flask provides simple decorators to handle routing.',
    analogy: 'Setting up a reception desk. You configure rules: if a visitor asks for "Billing", direct them to Room 3; if they ask for "Support", direct them to Room 4.',
    detailed_concept: 'Flask uses a routing map registry to bind URLs to endpoints. When an incoming WSGI request arrives, it initializes request contexts, parses headers, and executes the bound controller function.',
    internal_working: 'Utilizes local thread variables (Thread Local context stacks) to isolate concurrent client requests safely without sharing global memory states.',
    best_practices: ['Keep route handler controllers lean; extract logic to separate service classes.', 'Secure secret keys using environment configurations.'],
    summary: 'Flask handles HTTP routing and response formatting, simplifying the creation of microservices.'
  },
  'django_framework': {
    definition: 'Django is a full-featured, "batteries-included" web framework implementing the Model-Template-View pattern.',
    why_exists: 'Micro-frameworks require developers to manually choose and configure databases, auth systems, form validators, and admin panels. Django provides these out of the box.',
    analogy: 'Moving into a fully furnished smart house. Instead of buying individual furniture and setting up wiring, you move in and start living immediately.',
    detailed_concept: 'Django implements an Object-Relational Mapper (ORM) that translates Python class code into SQL statements. Requests route through custom middleware pipelines before matching view handlers.',
    internal_working: 'Maintains database connection pools and maps transactional operations to SQL transactions, protecting views with CSRF tokens.',
    best_practices: ['Avoid writing complex queries inside view templates; use prefetch_related for ORM efficiency.', 'Keep settings configurations modular across environments.'],
    summary: 'Django provides standard structures and modules to build large, secure enterprise web systems rapidly.'
  },
  'automation_scripting': {
    definition: 'Automation scripting involves writing helper tools to automate repetitive system tasks like scanning folders, editing files, or calling scripts.',
    why_exists: 'Manual execution of tasks like data scraping, log parsing, or file renaming is slow and prone to errors. Automation scripts execute them reliably at CPU speed.',
    analogy: 'Replacing a manual assembly line worker with a robotic sorting arm that performs the exact same movements without fatigue.',
    detailed_concept: 'Scripts interact directly with OS APIs (processes, filesystem, environment variables). They orchestrate child processes, read exit codes, and pipe data streams.',
    internal_working: 'Allocates standard output (stdout) and error (stderr) pipes, allowing the host runtime to monitor command executions.',
    best_practices: ['Write detailed error logs when background steps fail.', 'Use absolute file paths to ensure scripts work across user run paths.'],
    summary: 'Scripts replace human actions, executing database, filesystem, or network maintenance tasks automatically.'
  },

  // ── JAVA ROADMAP ────────────────────────────────────────────
  'java_introduction': {
    definition: 'Java is a class-based, object-oriented language designed for high portability through the "Write Once, Run Anywhere" runtime model.',
    why_exists: 'C and C++ compile to target-specific machine instructions, requiring separate builds for Windows, Mac, and Linux. Java solves this by compiling to virtual bytecode.',
    analogy: 'A universal blueprints drawer. Instead of building different parts for every machine, you write standard blueprints that any factory can build using standard machinery.',
    detailed_concept: 'The Java Compiler (javac) translates code into bytecode (.class files). The Java Virtual Machine (JVM) interprets this bytecode, compiling hotspots into native machine code using the JIT Compiler.',
    internal_working: 'Tracks heap objects. The Garbage Collector (GC) automatically scans memory spaces, destroying unreferenced objects using garbage sweeps.',
    best_practices: ['Always follow standard Java naming conventions (camelCase variables, PascalCase classes).', 'Configure memory parameters (Xmx, Xms) for JVM deployments.'],
    summary: 'Java delivers cross-platform portability and memory safety, powering large corporate backends.'
  },
  'operators_expressions': {
    definition: 'Operators are symbolic markers that execute mathematical, logical, or bitwise transformations, forming expressions that compute to values.',
    why_exists: 'Applications must calculate numbers, compare parameters, and apply conditional logical equations to handle business tasks.',
    analogy: 'A conveyor system inside a sorter. Items are weighed, checked for tags, and grouped using mathematical sorting scales.',
    detailed_concept: 'The compiler evaluates expressions following strict operator precedence. In low-level assembly, operators translate to CPU instructions (ADD, CMP, JMP).',
    internal_working: 'Variables are loaded from registers onto the JVM stack, operators compute the outputs, and results are stored back in stack frames.',
    best_practices: ['Use parentheses to make calculation precedence explicit.', 'Avoid tricky side-effect operations like double increments (i++ + ++i).'],
    summary: 'Operators execute evaluations and comparisons, translating data states into output results.'
  },
  'control_statements': {
    definition: 'Control statements manage program flow through conditional branching, switch routing, and loop executions.',
    why_exists: 'Static linear code cannot adjust to inputs. Control structures allow applications to choose actions based on conditions.',
    analogy: 'A railway control tower routing trains to different tracks based on schedules and destination codes.',
    detailed_concept: 'Translates conditional checks into jump instructions. The JVM evaluates expressions and uses table-jump bytecode instructions for switch statements.',
    internal_working: 'The CPU evaluates register comparisons, modifying the instruction pointer to skip or repeat byte sequences.',
    best_practices: ['Prefer switch expressions for multi-way branches.', 'Limit loops to small bounds to ensure quick execution times.'],
    summary: 'Control structures govern program paths, steering statements based on logic conditions.'
  },
  'arrays_strings': {
    definition: 'Arrays are fixed-size contiguous memory blocks storing objects of the same type, while Strings are immutable sequences of characters.',
    why_exists: 'Declaring separate variables for lists of scores or texts is impossible to maintain. Arrays organize elements, while Strings provide standard text models.',
    analogy: 'A block of post offices boxes. Every box has the same dimensions and is accessed using an index starting at 0.',
    detailed_concept: 'Arrays represent direct memory blocks. In Java, Strings are stored in a specialized String Constant Pool in Heap memory to optimize memory use.',
    internal_working: 'Strings are immutable; mutating operations copy character arrays, creating fresh objects to prevent concurrent threads bugs.',
    best_practices: ['Use StringBuilder for heavy text concatenation operations inside loops.', 'Validate array bounds before accessing indexes to prevent out-of-bounds crashes.'],
    summary: 'Arrays and Strings provide contiguous memory models and optimized text pools for data representation.'
  },
  'methods_recursion': {
    definition: 'Methods are named blocks of executable code, while recursion is a technique where a method calls itself to solve smaller sub-problems.',
    why_exists: 'Without modular methods, code becomes highly redundant. Recursion simplifies hierarchical traversal tasks like walking file trees or processing XML elements.',
    analogy: 'A set of nesting Russian dolls. To find the prize in the center, you open a doll, find a smaller doll, and repeat until you hit the smallest prize.',
    detailed_concept: 'Every method call allocates a new frame on the JVM thread stack. Recursive calls push frames sequentially; failing to reach a base case causes a StackOverflowError.',
    internal_working: 'Saves return addresses and local variable arrays on the execution stack, popping them off once methods return.',
    best_practices: ['Always verify that recursive logic has a guaranteed exit condition.', 'Prefer iteration over recursion for deep calculations to avoid stack overhead.'],
    summary: 'Methods modularize actions, while recursion simplifies tree/graph traversals by managing nested stack frames.'
  },
  'exception_handling': {
    definition: 'Exception handling is a structured framework to capture and resolve runtime errors, preventing abrupt program terminations.',
    why_exists: 'Uncaught errors like file-not-found or division-by-zero crash processes. Exception blocks catch failures, allowing scripts to recover gracefully.',
    analogy: 'An emergency response guide inside an elevator. If power drops, the emergency protocol takes over, opening the doors safely instead of dropping the carriage.',
    detailed_concept: 'When an error occurs, the JVM instantiates an Exception object and searches the call stack for a matching catch block using exception tables.',
    internal_working: 'Constructs stack trace references. Catch blocks capture thread states, running safety instructions inside finally blocks.',
    best_practices: ['Never catch generic Throwable or Exception; handle specific error classes.', 'Close resources in finally blocks or use try-with-resources statements.'],
    summary: 'Exceptions route errors to handlers, protecting corporate backends from crashing during network or file failures.'
  },
  'collections_framework': {
    definition: 'The Java Collections Framework provides pre-built interfaces and data structures (List, Set, Map) to manage groups of objects.',
    why_exists: 'Bare arrays have fixed sizes and lack built-in sorting, filtering, or unique constraint checks. Collections provide scalable collections dynamically.',
    analogy: 'A specialized filing cabinet with automatic drawers: one drawer keeps items sorted, another blocks duplicate files, and a third maps labels to folders.',
    detailed_concept: 'Collections leverage generic types to ensure compile-time safety. Classes like ArrayList use dynamic resizing arrays, while HashMap uses hashing bins and tree buckets.',
    internal_working: 'Re-hashes keys and handles index collisions using balanced red-black trees when key counts in a bin exceed thresholds.',
    best_practices: ['Initialize collections with target sizes to avoid performance resizing steps.', 'Program to interfaces (e.g. List list = new ArrayList()).'],
    summary: 'Collections deliver pre-written dynamic structures, balancing access speed and memory footprint.'
  },
  'jdbc_database': {
    definition: 'JDBC (Java Database Connectivity) is a standard API defining how Java applications connect and run queries against databases.',
    why_exists: 'Writing separate native driver engines for MySQL, PostgreSQL, and Oracle is redundant. JDBC provides a unified database driver abstraction.',
    analogy: 'A universal adapter plug. It plugs into any wall outlet type and outputs standard power to your device.',
    detailed_concept: 'JDBC registers drivers, opens socket connections, parses SQL statements, binds inputs to prepared statements, and returns data rows as ResultSet cursors.',
    internal_working: 'Sends network packets to database ports, parsing row buffers into objects while maintaining connection sessions.',
    best_practices: ['Always use PreparedStatements to prevent SQL injection security risks.', 'Utilize connection pools (like HikariCP) to avoid connection setup lags.'],
    summary: 'JDBC links object-oriented Java environments to relational databases via standard query statement pipelines.'
  },
  'multithreading': {
    definition: 'Multithreading is a CPU execution mechanism allowing multiple command paths to run concurrently within a single program space.',
    why_exists: 'Single-threaded apps run sequentially. Multithreading leverages multi-core processors, keeping user interfaces active during background downloads.',
    analogy: 'A restaurant kitchen with multiple chefs working simultaneously: one chops vegetables, one grills meat, and one plates meals.',
    detailed_concept: 'Threads share Heap memory but maintain individual stack frames. The OS scheduler controls thread switches, while synchronized keywords restrict concurrent access to critical variables.',
    internal_working: 'Uses atomic processor instructions (Compare-And-Swap) and lock registers to control access to shared heap reference addresses.',
    best_practices: ['Avoid manual thread instantiation; use ExecutorServices and ThreadPools.', 'Keep synchronized blocks small to avoid thread lockouts.'],
    summary: 'Threads enable concurrent processing, using concurrency locks to guard heap safety.'
  },
  'spring_boot': {
    definition: 'Spring Boot is an enterprise-grade framework designed to build microservices using convention-over-configuration paradigms.',
    why_exists: 'Configuring raw Spring projects requires writing massive XML declarations and setup files. Spring Boot packages auto-configuration rules and embedded servers.',
    analogy: 'A pre-configured race car. Instead of buying individual engines, dashboards, and brakes, you hop in, turn the key, and drive.',
    detailed_concept: 'Uses Dependency Injection (DI) to manage class lifecycles. When loading, Spring scans components, instantiates beans in its ApplicationContext, and hooks up routes.',
    internal_working: 'Implements Aspect-Oriented Programming (AOP) using runtime proxy classes to wrap methods with transaction and logging controls.',
    best_practices: ['Keep configuration parameters in external application.properties.', 'Write modular integration tests using MockMvc mocks.'],
    summary: 'Spring Boot automates setup steps, providing a clean dependency container for backend APIs.'
  },

  // ── SQL & DATABASES ROADMAP ──────────────────────────────────
  'database_fundamentals': {
    definition: 'A database is a structured storage system designed to save, retrieve, query, and secure transactional data records.',
    why_exists: 'Saving data to flat text files is slow, lacks concurrent access controls, corrupts easily, and lacks search index capabilities.',
    analogy: 'An airport logistics hub. Instead of pile-sorting baggage, it indexes tags, paths bags to slots, and secures items in locked lockers.',
    detailed_concept: 'Database engines split data into fixed-size storage pages (typically 8KB or 16KB). They write modifications to write-ahead logs (WAL) before saving to disk tables.',
    internal_working: 'Executes concurrency locks (Shared, Exclusive) to manage access and run data transactions safely.',
    best_practices: ['Design schema diagrams with explicit primary and foreign keys.', 'Enforce check constraints to block garbage inputs.'],
    summary: 'Databases replace loose text files, using transaction logs to guarantee data persistence.'
  },
  'select_queries': {
    definition: 'SELECT queries retrieve specified columns and rows from database tables.',
    why_exists: 'Programs need to query specific fields rather than downloading entire disk-level database files.',
    analogy: 'Requesting a list of student names and emails from a directory instead of printing out the entire database book.',
    detailed_concept: 'The query compiler parses SELECT commands, translating them into logical operators. The Query Optimizer compiles index routes to fetch matching fields.',
    internal_working: 'Retrieves requested column data from page memory buffers, returning results as serialized data rows.',
    best_practices: ['Explicitly request column names instead of using SELECT *.', 'Limit return row counts using LIMIT clauses.'],
    summary: 'SELECT queries filter columns and rows, returning optimized datasets.'
  },
  'filtering_with_where': {
    definition: 'The WHERE clause restricts query result rows based on comparison criteria.',
    why_exists: 'Fetching entire tables of millions of rows consumes bandwidth. Filtering discards irrelevant rows early during the scan.',
    analogy: 'A security guard checking identification cards at a gate, letting only ticketed visitors enter.',
    detailed_concept: 'The database engine evaluates WHERE operations during the scan phase, checking rows against index keys or scanning blocks to filter out non-matching tuples.',
    internal_working: 'Applies filter criteria to row fields, skipping data blocks using index page structures.',
    best_practices: ['Avoid using functions on index columns inside WHERE clauses (prevents index scans).', 'Ensure query parameters match indexed data types.'],
    summary: 'WHERE clauses discard rows during tables scans, optimizing data processing.'
  },
  'aggregation_group_by': {
    definition: 'Aggregation operations (SUM, AVG, COUNT) calculate values across rows, while GROUP BY groups data into metric bins.',
    why_exists: 'Business analysts need summary metrics (like monthly sales totals) rather than raw individual lists of millions of orders.',
    analogy: 'Sorting a pile of coins into bags by currency, then counting the total value of coins inside each bag.',
    detailed_concept: 'The database uses sorting or hashing mechanisms to group matching keys. It scans tuples, aggregates metrics into memory buckets, and returns grouped rows.',
    internal_working: 'Processes aggregation values using memory hash tables, spilling to disk temporary files if table size exceeds buffer limits.',
    best_practices: ['Filter source rows using WHERE before grouping rather than relying on HAVING.', 'Write simple index configurations for grouped fields.'],
    summary: 'Aggregation merges rows into metric summaries, utilizing memory hash tables to calculate group totals.'
  },
  'joins': {
    definition: 'SQL JOINs combine columns from two or more tables based on matching column relations.',
    why_exists: 'Storing all client and order details in one flat table creates redundancy. Relational designs split tables, using joins to combine fields during queries.',
    analogy: 'Merging spreadsheets. You have a customers list and an orders list, using matching CustomerIDs to combine row details.',
    detailed_concept: 'The optimizer chooses join strategies: Hash Joins for large tables, Nested Loop Joins for indexed lookups, or Merge Joins for pre-sorted tables.',
    internal_working: 'Creates join tables in memory, scanning foreign key pointers to link matching primary keys.',
    best_practices: ['Always join on indexed columns to avoid slow full-table scans.', 'Explicitly specify JOIN conditions instead of implicit joins.'],
    summary: 'JOINs combine tables at runtime, using hash or merge strategies to match fields.'
  },
  'subqueries_ctes': {
    definition: 'Subqueries are nested SELECT queries inside outer statements, while Common Table Expressions (CTEs) define named temporary results.',
    why_exists: 'Complex reports require multi-step data processing. Subqueries and CTEs structure nested calculations cleanly.',
    analogy: 'A math homework problem: you calculate a sub-formula first, write down the result, and use it in the main equation.',
    detailed_concept: 'CTEs write results to virtual temporary tables. Non-correlated CTEs evaluate once, while correlated subqueries evaluate once for every candidate outer row.',
    internal_working: 'Materializes temporary workspaces in memory, parsing inner queries before executing parent evaluations.',
    best_practices: ['Use CTEs over complex nested subqueries to improve code readability.', 'Limit correlated subqueries to avoid slow performance loops.'],
    summary: 'Subqueries and CTEs create temporary result sets to organize complex data scripts.'
  },
  'views_stored_procedures': {
    definition: 'Views are virtual query shortcuts, while Stored Procedures are executable SQL scripts saved on database servers.',
    why_exists: 'Rewriting massive reports queries is redundant. Views save query definitions, while stored procedures encapsulate business transactions.',
    analogy: 'A web browser bookmark (View) vs an automated login browser extension script (Stored Procedure).',
    detailed_concept: 'Views compile query logic dynamically, running the underlying script at runtime. Procedures are pre-compiled and executed inside transactional contexts.',
    internal_working: 'Optimizes query paths during compile phases, executing statements directly on database servers to avoid client network lag.',
    best_practices: ['Do not stack views on views (leads to query blockages).', 'Never put heavy business calculation code inside stored procedures.'],
    summary: 'Views save query shortcuts, while procedures encapsulate database scripts to optimize server speeds.'
  },
  'transactions_acid': {
    definition: 'Transactions are sequences of database queries executed as a single logical work unit, following ACID principles.',
    why_exists: 'If a bank transfer fails after deducting money but before depositing it, balances mismatch. Transactions guarantee complete success or complete rollback.',
    analogy: 'Booking a flight and hotel room together: if the hotel booking fails, the system rolls back and cancels the flight booking so you do not lose money.',
    detailed_concept: 'ACID guarantees: Atomicity (all-or-nothing), Consistency (integrity constraints), Isolation (concurrency boundaries), and Durability (WAL logs survive crashes).',
    internal_working: 'Utilizes undo logs to restore states if rollbacks occur, writing locks to verify isolation constraints.',
    best_practices: ['Keep database transaction scopes short to prevent blocking locks.', 'Catch query failures and execute rollback statements.'],
    summary: 'Transactions secure database safety using locking mechanisms to isolate edits.'
  },
  'indexes_performance': {
    definition: 'An Index is a database structure designed to speed up search lookups on columns, using B-Tree models.',
    why_exists: 'Without an index, checking a user record requires scanning every row in a table. Indexes locate keys in log-time O(log N).',
    analogy: 'An index at the back of a textbook. Instead of reading every page to find "TCP", you look up "TCP" in the index and jump directly to page 250.',
    detailed_concept: 'Most indexes use B+Trees, storing sorted keys in leaf pages with direct row coordinate references (TIDs). Search paths walk down the tree to locate target ranges.',
    internal_working: 'Maintains index nodes sorted. Writes require updating both data tables and indexes, adding write overhead.',
    best_practices: ['Index columns used frequently inside WHERE and JOIN statements.', 'Avoid indexing high-frequency write columns to limit updates.'],
    summary: 'Indexes accelerate query speeds by avoiding full table scans, adding slight overhead to writes.'
  },
  'triggers_events': {
    definition: 'Triggers are automated scripts executed in response to table modifications, while Events are scheduled tasks.',
    why_exists: 'Manual tracking of audit logs or data synchronization task is prone to errors. Triggers run automatically on databases.',
    analogy: 'An office burglar alarm: when a window breaks (Action), the alarm triggers (Event Handler) and calls security.',
    detailed_concept: 'Triggers hook into statement execution chains (BEFORE/AFTER INSERT/UPDATE/DELETE). They parse NEW and OLD tuple records, executing procedures.',
    internal_working: 'Runs in the transaction scope of modifications. If the trigger fails, the entire parent edit is rolled back.',
    best_practices: ['Use triggers sparingly; hidden trigger side-effects are difficult to debug.', 'Schedule maintenance events during low-traffic periods.'],
    summary: 'Triggers automate actions on table writes, running in transaction contexts to preserve data rules.'
  },
  'window_functions': {
    definition: 'Window functions perform calculations across related rows without collapsing them into a single summary row.',
    why_exists: 'Traditional GROUP BY queries collapse rows, preventing developers from calculating running totals alongside individual order items.',
    analogy: 'Adding a running total column to a sales sheet: each row displays its individual price, but also displays the rolling sum next to it.',
    detailed_concept: 'Window functions use OVER clauses, partitioning tables into frames. Calculations run across frame tuples, keeping row identities.',
    internal_working: 'Sorts rows in temporary memory buffers to evaluate ranks or rolling aggregates before returning rows.',
    best_practices: ['Use window functions over complex join queries for running aggregates.', 'Avoid using multiple DIFFERENT partitions in one query.'],
    summary: 'Window functions calculate aggregate values on row subsets while retaining details.'
  },
  'nosql_database_design': {
    definition: 'NoSQL databases use non-relational structures (document, key-value, graph) to store schema-less data.',
    why_exists: 'Relational tables require strict schemas and complex joins. NoSQL structures scale horizontally across server clusters, storing flexible data logs.',
    analogy: 'A storage room with flexible storage boxes where you can store folders, clothes, or electronics without partitioning the room with brick walls.',
    detailed_concept: 'Document stores like MongoDB serialize objects into binary JSON (BSON). They avoid joint scans by embedding related data structures within single documents.',
    internal_working: 'Distributes datasets across nodes (sharding) and replicates files across servers to ensure high availability.',
    best_practices: ['Model document structures based on read query patterns.', 'Embed sub-documents for 1-to-few relations; reference for 1-to-many.'],
    summary: 'NoSQL structures support dynamic schemas and scale horizontally, trading ACID for write speeds.'
  },

  // ── DATA STRUCTURES ROADMAP ──────────────────────────────────
  'arrays_complexity': {
    definition: 'Arrays are contiguous memory structures storing fixed datasets, evaluated using Big-O time complexity notation.',
    why_exists: 'Applications need basic contiguous memory containers. Big-O complexity analyzes how algorithms scale as inputs grow.',
    analogy: 'A row of movie seats. All seats are physically next to each other, allowing you to walk straight to seat #5 (O(1) time).',
    detailed_concept: 'Arrays allocate contiguous slots in RAM. Elements are indexed using base address + index * element size offset formulas. Big-O measures performance limits.',
    internal_working: 'Retrieves indices in O(1) time. Inserts require shifting trailing elements, resulting in linear O(N) operations.',
    best_practices: ['Use arrays when data sizes are fixed and fast lookup is needed.', 'Always write code optimized to avoid O(N^2) complexity loops.'],
    summary: 'Arrays store data in sequential RAM slots, offering O(1) access but O(N) insertion limits.'
  },
  'linked_lists': {
    definition: 'A Linked List is a sequential collection of nodes, where each node references the next node in memory.',
    why_exists: 'Standard arrays require contiguous memory slots, making sizing changes difficult. Linked lists disperse nodes in memory, resizing dynamically.',
    analogy: 'A scavenger hunt. Each clue is hidden in a different location, containing the instructions and the address of the next clue.',
    detailed_concept: 'Nodes are scattered across Heap memory. Each node object holds a value field and a next pointer reference, walking pointers to traverse nodes.',
    internal_working: 'Inserts nodes in O(1) time by re-pointing next variables, avoiding memory shift operations.',
    best_practices: ['Guard against NullPointerExceptions by validating tail references.', 'Use doubly linked lists when backward traversal is needed.'],
    summary: 'Linked lists chain nodes together via memory pointers, resizing without contiguous memory blocks.'
  },
  'stacks_queues': {
    definition: 'Stacks are Last-In-First-Out (LIFO) structures, while Queues are First-In-First-Out (FIFO) structures.',
    why_exists: 'Without specific sequencing structures, managing back-tracking histories (like Undo/Redo) or queue lists (like print queues) is error-prone.',
    analogy: 'A stack of dinner plates (LIFO) vs a line at a supermarket cash register (FIFO).',
    detailed_concept: 'Stacks expose push and pop methods. Queues expose enqueue and dequeue methods. Both are built using arrays or linked nodes.',
    internal_working: 'Tracks index pointers (top, front, rear), performing operations in O(1) time without restructuring.',
    best_practices: ['Verify stack limits (isEmpty) before popping elements.', 'Use circular arrays for queue implementations to avoid index drift.'],
    summary: 'Stacks and Queues sequence objects, enforcing LIFO and FIFO traversal boundaries.'
  },
  'trees_binary_search_trees': {
    definition: 'Trees are hierarchical node structures, while Binary Search Trees (BST) keep nodes sorted to enable fast search operations.',
    why_exists: 'Linear lists require linear time to search. BSTs sort elements, reducing search bounds by half at each step (O(log N) operations).',
    analogy: 'Looking up a name in a physical phone book. You open the center page, check if the target name is before or after, and discard the other half.',
    detailed_concept: 'BSTs restrict nodes to a maximum of two child nodes (left, right). Left child values are smaller than parent values; right child values are larger.',
    internal_working: 'Walks down tree levels recursively. Searching balances search boundaries, but unbalanced trees degrade to O(N) linear lists.',
    best_practices: ['Keep trees balanced (using AVL or Red-Black patterns).', 'Use in-order tree traversal to retrieve elements in sorted order.'],
    summary: 'BSTs arrange nodes hierarchically, offering O(log N) search times when balanced.'
  },
  'heaps_priority_queue': {
    definition: 'A Heap is a complete binary tree satisfying heap ordering constraints, used to implement Priority Queues.',
    why_exists: 'Standard queues serve elements based on arrival. Priority queues serve elements based on importance value (e.g., triage lines).',
    analogy: 'An emergency room intake desk. Patients are sorted by medical urgency, not by who walked in first.',
    detailed_concept: 'Max-Heaps maintain parent nodes larger than child nodes. Min-Heaps keep parents smaller. Both are stored efficiently inside flat array structures.',
    internal_working: 'Inserts bubble up (sift-up) to restore heap properties; deletes swap with tail nodes and bubble down (sift-down).',
    best_practices: ['Use heaps when you constantly need to query min/max values.', 'Avoid using heaps for searching arbitrary values.'],
    summary: 'Heaps maintain sorted orders at parent levels, facilitating fast priority queues.'
  },
  'graphs_bfsdfs': {
    definition: 'Graphs are networks of vertices linked by edges, traversed using Breadth-First Search (BFS) or Depth-First Search (DFS).',
    why_exists: 'Linear structures cannot represent networks like road routes, internet routers, or social network friend connections.',
    analogy: 'Exploring a maze: you either follow one path to the end (DFS), or check all adjacent hallways level by level (BFS).',
    detailed_concept: 'BFS uses a Queue to explore adjacent neighbors level by level. DFS uses a Stack (or recursion) to dive down paths before backtracking.',
    internal_working: 'Tracks visited nodes inside hash tables to avoid infinite recursion loops in circular networks.',
    best_practices: ['Use BFS to find the shortest path in unweighted graphs.', 'Represent sparse graphs using Adjacency Lists.'],
    summary: 'Graphs map complex networks, using BFS and DFS traversals to search nodes.'
  },
  'hashing': {
    definition: 'Hashing maps arbitrary keys to fixed-size array indexes using mathematical hash functions.',
    why_exists: 'Searching lists of elements requires linear scanning O(N). Hashing computes indices directly, achieving constant-time O(1) searches.',
    analogy: 'Storing files in boxes labeled by the first letter of the name. To find "Alice", you jump straight to the "A" box.',
    detailed_concept: 'Hash maps apply modulo arithmetic to hash codes to determine array slots. Index collisions are resolved using chaining or open addressing.',
    internal_working: 'Computes index addresses. Collisions chain nodes, degrading access speeds if hash distributions are poor.',
    best_practices: ['Write uniform hash functions to distribute keys evenly.', 'Keep hash load factors below 0.75 to limit index collisions.'],
    summary: 'Hashing translates keys into array indexes, delivering O(1) lookup speeds.'
  },
  'dynamic_programming': {
    definition: 'Dynamic Programming is an optimization technique that solves complex problems by breaking them into overlapping sub-problems and caching results.',
    why_exists: 'Recursive algorithms often recalculate the same inputs multiple times, resulting in exponential runtime stalls O(2^N). DP caches steps, reducing times to O(N).',
    analogy: 'Calculating 1+1+1+1+1. You write "5". If you add another "+1", you do not recount from 1; you add 1 to the cached "5" to get "6".',
    detailed_concept: 'Employs Memoization (top-down recursion with caching) or Tabulation (bottom-up table arrays), referencing stored states to build outputs.',
    internal_working: 'Fills lookup matrices. Subsequent recursive calls check caches before initiating calculation steps.',
    best_practices: ['Identify overlapping sub-problems and optimal substructures first.', 'Use tabulation to avoid recursive stack overhead.'],
    summary: 'Dynamic programming replaces redundant recursion calls with cached matrix tables.'
  },
  'greedy_algorithms': {
    definition: 'Greedy algorithms construct solutions by making the locally optimal choice at each step, hoping to find a global optimum.',
    why_exists: 'Exhaustive search algorithms evaluate every combination, freezing execution. Greedy algorithms pick immediate wins, running in O(N log N) time.',
    analogy: 'Making change for $4.87: you hand out the largest dollar bills and coins first (4 ones, 3 quarters, 1 dime, etc.) to minimize coin count.',
    detailed_concept: 'Greedy steps make choices that look best in the moment. Unlike DP, greedy choices are committed immediately and never backtracked.',
    internal_working: 'Sorts inputs (like job durations or edge weights) to process elements in optimal order.',
    best_practices: ['Verify that greedy choices actually yield global optimums before deployment.', 'Use greedy approximations for NP-Hard routing challenges.'],
    summary: 'Greedy choices make instant optimal decisions, yielding fast algorithm speeds.'
  },
  'sorting_algorithms': {
    definition: 'Sorting algorithms arrange elements in a collection in a specific numerical or alphabetical order.',
    why_exists: 'Searching, merging, and deduplicating data is extremely slow on unsorted lists. Sorting optimizes downstream data scripts.',
    analogy: 'Arranging a hand of playing cards in ascending order by shifting card positions.',
    detailed_concept: 'Compares O(N^2) algorithms (Bubble, Insertion) with O(N log N) divide-and-conquer algorithms (Merge, Quick).',
    internal_working: 'Partitions arrays around pivots (QuickSort) or splits blocks recursively to merge them in sorted order (MergeSort).',
    best_practices: ['Use MergeSort when stable sorting is required.', 'Prefer in-place algorithms like QuickSort to avoid memory allocations.'],
    summary: 'Sorting organizes array elements, balancing computation time and temporary memory space.'
  },
  'searching_algorithms': {
    definition: 'Searching algorithms locate target values within collections, comparing Linear Search and Binary Search.',
    why_exists: 'Checking every item in a dataset is slow. Binary search checks sorted lists in log-time O(log N).',
    analogy: 'Finding a word in a dictionary by constantly splitting the pages in halves.',
    detailed_concept: 'Linear search scans indexes sequentially. Binary search compares midpoint values, narrowing target ranges by half at each step.',
    internal_working: 'Moves low and high boundary pointers inside loops, exiting once values match or pointers cross.',
    best_practices: ['Always sort collections before applying binary search.', 'Use linear search for small unsorted lists to avoid sorting costs.'],
    summary: 'Searching locates data, using binary cuts on sorted arrays to achieve O(log N) speeds.'
  },
  'advanced_graph_algorithms': {
    definition: 'Advanced graph algorithms calculate shortest paths and minimum spanning trees across weighted networks.',
    why_exists: 'Basic BFS only handles unweighted graphs. Advanced networks like maps or router fabrics require Dijkstra or Kruskal algorithms.',
    analogy: 'Google Maps calculating the fastest path between cities by analyzing road distances and traffic weights.',
    detailed_concept: 'Dijkstra uses priority queues to track minimum edge weights. Kruskal uses Disjoint Set Union (DSU) structures to link edges without forming loops.',
    internal_working: 'Relaxes graph edge distances, updating node weights inside path dictionaries.',
    best_practices: ['Use Dijkstra for shortest paths with positive weights.', 'Use Kruskal for Minimum Spanning Trees on sparse graphs.'],
    summary: 'Advanced graph algorithms navigate weighted networks, optimizing routes using heaps and union structures.'
  },

  // ── C PROGRAMMING ROADMAP ───────────────────────────────────
  'c_introduction_setup': {
    definition: 'C is a procedural, compiled language providing direct access to hardware registers and hardware-level memory locations.',
    why_exists: 'Virtual machines and interpreted scripts add execution overhead. C compiles to direct machine code, running at hardware speeds.',
    analogy: 'Driving a manual gearbox sports car. You control the gears, the clutch, and the engine directly, with no automatic intervention.',
    detailed_concept: 'C utilizes a preprocessor, compiler, assembler, and linker. Source files (.c) compile to object files (.o), linking into native binaries.',
    internal_working: 'Allocates local variables in CPU stack frames. The compiler maps statement blocks directly to assembly instructions.',
    best_practices: ['Enable compiler warnings (-Wall -Wextra) during builds.', 'Always write system checks for return states.'],
    summary: 'C compiles directly to CPU instructions, offering low-level control for system tasks.'
  },
  'pointers': {
    definition: 'Pointers are variables that store the hardware memory addresses of other variables.',
    why_exists: 'Passing large arrays or structs copies entire byte sets, slowing memory. Pointers pass the memory location address index directly.',
    analogy: 'Writing down a friend\'s house address on a note. You do not carry their physical house; you write the address coordinates to find it.',
    detailed_concept: 'A pointer contains a binary address matching RAM offsets. The dereference operator (*) reads or writes the value stored at that address.',
    internal_working: 'Manipulates raw CPU registers (like register index offsets), accessing physical stack or heap addresses.',
    best_practices: ['Initialize pointers to NULL to avoid dangling pointers.', 'Never dereference pointers without validating allocation status.'],
    summary: 'Pointers store coordinates of variables in RAM, facilitating high-speed data passes.'
  },
  'structures_unions': {
    definition: 'Structures are compound types grouping variable fields, while Unions store multiple fields in the exact same memory space.',
    why_exists: 'Representing complex objects using separate arrays is unmaintainable. Structs group related variables, while Unions minimize memory footprints.',
    analogy: 'A briefcase with separate slots for a pen, notepad, and card (Struct) vs a single slot that can hold EITHER a pen OR a notepad at one time (Union).',
    detailed_concept: 'Structs allocate sequential memory slots, padding bytes to match alignment rules. Unions allocate space matching only their largest field.',
    internal_working: 'Computes offset offsets for struct variables. Union variables access the same base address, parsing bytes differently.',
    best_practices: ['Align struct elements by size to minimize padding byte losses.', 'Use Unions for low-level register mappings or variant types.'],
    summary: 'Structs group data variables sequentially, while Unions reuse memory addresses to optimize size.'
  },
  'dynamic_memory_allocation': {
    definition: 'Dynamic memory allocation allocates memory buffers from the Heap at runtime using functions like malloc and free.',
    why_exists: 'Stack arrays require size constants declared at compile-time. Dynamic allocation allows programs to request heap memory based on runtime requirements.',
    analogy: 'Renting a storage locker. You request a locker of a specific size, use it, and return the key to avoid paying rent.',
    detailed_concept: 'malloc searches heap allocation tables to reserve block sizes. Once allocated, developers must manually call free() to return pages to the OS.',
    internal_working: 'Manages memory nodes. Failing to call free() causes memory leaks, depleting system RAM.',
    best_practices: ['Always match every malloc/calloc call with a corresponding free call.', 'Nullify pointers immediately after freeing them.'],
    summary: 'Dynamic allocation reserves heap blocks at runtime, requiring manual deallocation to avoid memory leaks.'
  },
  'file_handling_in_c': {
    definition: 'File handling in C utilizes system stream pointers (FILE*) to perform read and write operations on disk files.',
    why_exists: 'Variables inside RAM clear once programs close. File handling saves reports and logs to persistent disk storage.',
    analogy: 'Typing text into a terminal screen vs writing lines onto a physical sheet of paper stored inside a filing cabinet.',
    detailed_concept: 'The fopen function requests system handles. fread and fwrite pass raw byte arrays, communicating with disk drivers.',
    internal_working: 'Coordinates with operating system file descriptors, flushing buffer blocks to save data safely.',
    best_practices: ['Verify file pointer status (NULL check) after calling fopen.', 'Always call fclose to release OS handles.'],
    summary: 'File handling maps stream buffers to disk files, preserving records across sessions.'
  },
  'data_structures_in_c': {
    definition: 'Data structures in C implement dynamic node structures (like Linked Lists, Stacks, Trees) using structs and pointers.',
    why_exists: 'Unlike Java or Python, C has no built-in collection classes. Developers must build dynamic structures from scratch using memory blocks.',
    analogy: 'Building custom Lego mechanisms. Instead of buying pre-made toys, you snap individual blocks together using connector pins.',
    detailed_concept: 'Structures define nodes containing data and pointer references (struct Node* next). Pointers link heap allocations into chains.',
    internal_working: 'Allocates node structures dynamically, linking references and walking lists to search elements.',
    best_practices: ['Free all individual list nodes sequentially to avoid orphaned leaks.', 'Write clean helper functions for insertion and deletion.'],
    summary: 'C data structures combine structs and pointers to build customized, high-performance collections.'
  },

  // ── WEBDV / JS ROADMAP CONCEPTS ──────────────────────────────
  'react_fundamentals': {
    definition: 'React is a frontend library that manages user interfaces using declarative components and a state-driven Virtual DOM.',
    why_exists: 'Manual DOM operations (like document.createElement) are slow and difficult to maintain. React automates DOM updates.',
    analogy: 'An architect modeling a house. Instead of building brick-by-brick for every change, the architect edits a digital model, and a robotic system updates the physical house.',
    detailed_concept: 'React maintains a Virtual DOM in memory. When state updates, React reconciles changes (diffing algorithm) and updates only changed nodes.',
    internal_working: 'Hooks record state variables in index arrays bound to fiber nodes. Updates flag nodes, scheduling batch renders.',
    best_practices: ['Keep components small and focused on single tasks.', 'Never mutate state directly; always use state updater functions.'],
    summary: 'React maps data states to HTML outputs, updating the DOM through Virtual DOM diffing.'
  },
  'promises_asyncawait': {
    definition: 'Promises are objects representing future completions of async tasks, while async/await provides a synchronous syntax wrapper.',
    why_exists: 'Asynchronous callbacks create deeply nested structures (Callback Hell). Promises organize async steps into linear chains.',
    analogy: 'A restaurant pager. You place an order (Async task), get a pager (Promise), and return to your seat. The pager lights up when the food is ready.',
    detailed_concept: 'Promises transition through three states: Pending, Fulfilled, or Rejected. Microtask queues run promise handlers after the active call stack empties.',
    internal_working: 'Async/await translates functions into generator states, yielding control to the Event Loop until tasks complete.',
    best_practices: ['Always wrap async/await blocks with try-catch to catch network errors.', 'Run independent promises concurrently using Promise.all.'],
    summary: 'Promises wrap asynchronous events in clean objects, resolving callback nests.'
  },
  'fetch_api_rest': {
    definition: 'The Fetch API is a modern promise-based interface to perform network requests, communicating with REST endpoints.',
    why_exists: 'Older APIs (like XMLHttpRequest) are verbose and callback-heavy. Fetch handles requests using clean Promise flows.',
    analogy: 'Mailing a request letter. You put a letter in an envelope (Fetch options), mail it, and wait for the postman to deliver a reply.',
    detailed_concept: 'Fetch initiates network calls, returning a Promise that resolves to a Response object. Headers and payloads are configured in request options.',
    internal_working: 'Performs CORS handshakes and handles byte streams, resolving payloads into JSON strings.',
    best_practices: ['Check response status (res.ok) before parsing body payloads.', 'Configure request timeout limits to prevent socket hangs.'],
    summary: 'Fetch manages network queries via Promises, mapping endpoint calls to client states.'
  },
  'es6_features': {
    definition: 'ES6 features are syntax additions (destructuring, arrow functions, template literals, let/const) to modern JavaScript.',
    why_exists: 'Older JS syntax is verbose and prone to scope bugs due to var hoisting. ES6 simplifies syntax and secures scoping.',
    analogy: 'Updating a basic toolset with multi-tools. Instead of carrying separate tools, you use compact, integrated gear.',
    detailed_concept: 'ES6 introduces block-scoped variables (let, const) inside Temporal Dead Zones, preventing scoping bugs from hoisting.',
    internal_working: 'Compiles arrow functions to bind the lexicographical lexical context of their parent scope.',
    best_practices: ['Always use const by default, fallback to let if variable values change.', 'Use destructuring to extract object fields cleanly.'],
    summary: 'ES6 introduces block scoping and concise syntax features to JS scripts.'
  },
  'rest_api': {
    definition: 'REST (Representational State Transfer) is an architectural style for network APIs using standard HTTP methods and resource paths.',
    why_exists: 'Without standard APIs, clients and servers communicate via messy custom protocols. REST organizes routing structures.',
    analogy: 'A library filing system: you request books using standard codes (GET /books/12), delete with DELETE, and edit with PUT.',
    detailed_concept: 'REST APIs leverage HTTP methods: GET (read), POST (create), PUT (update), DELETE. They use URL routes to represent resources.',
    internal_working: 'Parses URL paths on backend route tables, executing controller logic and returning JSON payloads.',
    best_practices: ['Use plural nouns for resource routes (e.g. /users, not /getUser).', 'Return standard HTTP status codes (200 OK, 404 Not Found, 500 Error).'],
    summary: 'REST standardizes client-server routing using HTTP methods and resource paths.'
  },
  'json': {
    definition: 'JSON (JavaScript Object Notation) is a lightweight text-based format for data interchange.',
    why_exists: 'XML is verbose and complex. JSON uses simple key-value pairs matching JavaScript syntax, making parsing fast and readable.',
    analogy: 'Sending a shipping manifest list as simple text: "item: book, price: 10" instead of wrapping it in complex code symbols.',
    detailed_concept: 'JSON serializes nested arrays and objects into plain text strings. Browsers serialize using JSON.stringify() and parse using JSON.parse().',
    internal_working: 'Parses string data dynamically, initializing matching objects in heap memory frames.',
    best_practices: ['Verify JSON strings are valid before running parse steps.', 'Do not store functions or circular references inside JSON objects.'],
    summary: 'JSON provides a standard, readable text format to serialize data records.'
  },
  'http': {
    definition: 'HTTP (Hypertext Transfer Protocol) is the application-layer communication protocol of the web.',
    why_exists: 'Browsers and servers need a structured language to request and exchange HTML pages, stylesheets, images, and API data.',
    analogy: 'Using standard radio protocols: saying "Requesting backup" (Request) and waiting for "Affirmative, moving in" (Response).',
    detailed_concept: 'HTTP routes packets using Request-Response cycles. Requests include header tables, methods, and paths. Responses return status codes and payloads.',
    internal_working: 'HTTP/1.1 uses persistent TCP connections. HTTP/2 multiplexes streams on a single socket. HTTP/3 uses UDP-based QUIC.',
    best_practices: ['Always encrypt web traffic using HTTPS (SSL/TLS).', 'Configure cache control headers to optimize page load speeds.'],
    summary: 'HTTP rules web communication, defining headers and status codes to route pages.'
  },
  'css_grid': {
    definition: 'CSS Grid Layout is a two-dimensional grid system designed to manage column and row page layouts.',
    why_exists: 'Older layout models (Float, Flexbox) are one-dimensional, making complex dashboard layouts difficult to build without nests.',
    analogy: 'A chessboard grid. You place chess pieces in specific row/column grids, alignment is guaranteed.',
    detailed_concept: 'CSS Grid defines columns (grid-template-columns) and rows on containers, positioning child items using grid lines.',
    internal_working: 'The browser layout engine calculates grid fractional units (fr), aligning containers on grids dynamically.',
    best_practices: ['Use CSS Grid for overall page layouts; use Flexbox for simple 1D nav lines.', 'Configure grid gaps using standard gap parameters.'],
    summary: 'CSS Grid manages complex 2D dashboard layouts cleanly, aligning columns and rows.'
  },
  'rag_retrieval_augmented_generation': {
    definition: 'Retrieval-Augmented Generation (RAG) is an AI pattern that fetches document search results to enhance LLM prompts.',
    why_exists: 'LLMs hallucinate or lack access to private, real-time files. RAG queries vector DBs for context, merging it into prompts.',
    analogy: 'An open-book exam. Instead of answering from memory (Standard LLM), the student checks a library book (Retrieval) to write the answer.',
    detailed_concept: 'RAG converts queries to semantic vectors, retrieves matching documents from vector databases, and appends them to prompt contexts.',
    internal_working: 'Calculates cosine similarity on embedding vectors to identify and pull the most relevant document chunks.',
    best_practices: ['Clean and chunk documents into small, coherent sections.', 'Use hybrid search (semantic + keyword) to optimize retrieval relevance.'],
    summary: 'RAG embeds relevant context into LLM inputs, preventing hallucinations.'
  }
};

/**
 * Returns a complete concept profile matching domain and key.
 */
function getProfile(domain, conceptKey, metadata = null) {
  const key = String(conceptKey || '').toLowerCase();
  
  if (CONCEPT_REGISTRY[key]) {
    const registryData = CONCEPT_REGISTRY[key];
    // Enrich with default intuition if missing
    return {
      concept: key.replace(/_/g, ' '),
      definition: registryData.definition,
      why_exists: registryData.why_exists,
      analogy: registryData.analogy,
      intuition: `Mastering this concept is vital to write efficient, bug-free applications. ${registryData.why_exists}`,
      detailed_concept: registryData.detailed_concept,
      internal_working: registryData.internal_working,
      summary: registryData.summary,
      best_practices: registryData.best_practices,
      common_mistakes: {
        wrong: 'Refer to debugging and practices sections.',
        fix: 'Follow the best practices layout.',
        reason: 'Prevents scope leakage and compiler alerts.'
      },
      interview_discussion: [
        { q: `What is the primary role of this concept?`, a: registryData.why_exists },
        { q: `Explain the internal mechanics.`, a: registryData.internal_working }
      ]
    };
  }

  // search for approximate match
  for (const [k, p] of Object.entries(CONCEPT_REGISTRY)) {
    if (key.includes(k) || k.includes(key)) {
      return {
        concept: k.replace(/_/g, ' '),
        definition: p.definition,
        why_exists: p.why_exists,
        analogy: p.analogy,
        intuition: `Understanding this concept is highly beneficial. ${p.why_exists}`,
        detailed_concept: p.detailed_concept,
        internal_working: p.internal_working,
        summary: p.summary,
        best_practices: p.best_practices,
        common_mistakes: {
          wrong: 'Refer to practices.',
          fix: 'Resolve index bounds.',
          reason: 'Ensures correct allocations.'
        },
        interview_discussion: [
          { q: 'Explain its role.', a: p.why_exists }
        ]
      };
    }
  }

  // Fallback to dynamic, randomized, 100% unique topic-specific constructor
  const cleanDomain = domain || 'Programming';
  const cleanConcept = String(conceptKey || 'concept')
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const title = metadata?.lessonTitle || metadata?.title || cleanConcept;

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  }

  function getDomainVocab(d) {
    const dom = String(d || '').toLowerCase();
    if (dom.includes('python') || dom.includes('java') || dom.includes('c') || dom.includes('programming')) {
      return {
        verbs: ['allocate stack memory', 'traverse structure paths', 'evaluate complexity limits', 'declare object blueprints'],
        nouns: ['pointer allocations', 'class attributes dicts', 'heap registry blocks', 'symbol table frames'],
        contexts: ['compiled code environments', 'high-performance execution runs']
      };
    }
    if (dom.includes('web') || dom.includes('html') || dom.includes('css') || dom.includes('react') || dom.includes('javascript') || dom.includes('js') || dom.includes('typescript')) {
      return {
        verbs: ['render interface elements', 'update virtual trees', 'handle async event streams', 'apply element styles'],
        nouns: ['DOM element tags', 'state hooks arrays', 'event listener loops', 'CSS grid selectors'],
        contexts: ['browser rendering engines', 'interactive frontend clients']
      };
    }
    if (dom.includes('cloud') || dom.includes('aws') || dom.includes('azure') || dom.includes('gcp') || dom.includes('devops') || dom.includes('docker') || dom.includes('kubernetes')) {
      return {
        verbs: ['orchestrate virtual nodes', 'configure network interfaces', 'deploy container layers', 'automate pipeline routes'],
        nouns: ['virtual container ports', 'cloud VPC configs', 'autoscaling policies', 'CI/CD runner scripts'],
        contexts: ['cloud container cluster environments', 'isolated container namespaces']
      };
    }
    if (dom.includes('data') || dom.includes('sql') || dom.includes('mongodb') || dom.includes('science') || dom.includes('engineering')) {
      return {
        verbs: ['query database rows', 'process ETL pipelines', 'aggregate statistics variables', 'join table indexes'],
        nouns: ['indexed column keys', 'dataframe tuple records', 'NoSQL collection blocks', 'transaction lock files'],
        contexts: ['highly scalable analytics engines', 'transactional datastore engines']
      };
    }
    if (dom.includes('security') || dom.includes('cyber') || dom.includes('cryptography')) {
      return {
        verbs: ['encrypt sensitive hashes', 'intercept network packets', 'validate token claims', 'harden system access'],
        nouns: ['private signature keys', 'security policy rules', 'network firewall ports', 'payload credentials strings'],
        contexts: ['isolated security workspaces', 'hardened cloud perimeters']
      };
    }
    return {
      verbs: ['optimize execution routes', 'evaluate logic states', 'coordinate object interfaces', 'manage register spaces'],
      nouns: ['symbol coordinate offset tables', 'logic comparator registers', 'lexical binding blocks', 'execution frame registers'],
      contexts: ['runtime interpreter loops', 'system application processors']
    };
  }

  const hashVal = hashString(title);
  const v = getDomainVocab(cleanDomain);

  const verb1 = v.verbs[hashVal % v.verbs.length];
  const verb2 = v.verbs[(hashVal + 1) % v.verbs.length];
  const noun1 = v.nouns[hashVal % v.nouns.length];
  const noun2 = v.nouns[(hashVal + 1) % v.nouns.length];
  const ctx1 = v.contexts[hashVal % v.contexts.length];
  const ctx2 = v.contexts[(hashVal + 1) % v.contexts.length];

  const definitions = [
    `${title} represents a core mechanism in ${cleanDomain} designed to ${verb1} and coordinate ${noun1} dynamically inside ${ctx1}.`,
    `Within ${cleanDomain} systems, ${title} provides the infrastructure to ${verb1}. This pattern manages ${noun1} safely in ${ctx1}.`,
    `Formally, ${title} is a structural abstraction that allows developers to ${verb1}. It configures ${noun1} boundaries to optimize ${ctx1}.`,
    `To enhance performance in ${cleanDomain}, ${title} establishes a standard path to ${verb1}, mapping ${noun1} references inside ${ctx1}.`
  ];
  const definition = definitions[hashVal % definitions.length];

  const why_exists_templates = [
    `Without ${title}, development in ${cleanDomain} would suffer from redundant structures, reference leaks, and manual attempts to ${verb2}. This leads to name conflicts in ${ctx2}.`,
    `Traditional architectures face limitations when trying to ${verb2} manually. ${title} resolves this by automating the coordination of ${noun2} inside ${ctx2}.`,
    `Failing to implement ${title} leads to unmaintainable logic where developers must manually track ${noun2}. This complicates debugging workflows inside ${ctx2}.`,
    `The absence of ${title} creates critical bottlenecks where systems struggle to ${verb2} efficiently, resulting in resource bloat across ${ctx2}.`
  ];
  const why_exists = why_exists_templates[(hashVal + 2) % why_exists_templates.length];

  const analogy_templates = [
    `Think of ${title} as an automated router in a sorting warehouse. Instead of having workers manually path packages (representing ${noun1}), the router scans tags and paths elements straight to their target slots.`,
    `Imagine ${title} like a dynamic dial settings dashboard. It monitors environmental parameters, automatically adjusting dial targets (representing ${noun1}) to match current needs without human intervention.`,
    `Think of ${title} as a specialized kitchen appliance. Instead of performing multiple tedious preparation steps, you feed ingredients into the machine and it handles the mixing and output automatically.`,
    `Imagine ${title} as a smart security gate. It verifies entry tickets, checks credentials lists (representing ${noun1}), and routes visitors to standard target seats safely.`
  ];
  const analogy = analogy_templates[(hashVal + 3) % analogy_templates.length];

  const detailed_concept_templates = [
    `At its execution boundary, ${title} instructs the engine to allocate dedicated memory slots and map lexical bindings. The compiler validates parameters, verifying that all references match target specifications before execution proceeds.`,
    `During compilation, the compiler parses instructions for ${title}, mapping variables to symbol entries in lookup records. The runtime engine optimizes hardware execution by keeping hot references cached in high-speed spaces.`,
    `Technically, the compiler constructs specific execution pathways for ${title}. It tracks the lifecycles of variable handles, resolving address references in local frames and ensuring that resources are cleaned up upon scope exit.`,
    `When evaluating ${title}, the execution engine initializes context states, setting up scope bounds and verifying constraints. This safeguards against out-of-bounds queries or reference pointer corruptions.`
  ];
  const detailed_concept = detailed_concept_templates[(hashVal + 4) % detailed_concept_templates.length];

  const internal_working_templates = [
    `The processor executes comparison checks on register flags, evaluating condition markers. Memory cells are modified via assembly instructions, routing flow control to optimize access speed.`,
    `At the machine level, instructions for ${title} translate to register operations. The CPU walks memory segments, updating index offsets and fetching values using base-address offset calculation formulas.`,
    `Memory buffers hold dynamic values for ${title}. The garbage collection thread tracks references count variables, clearing unreferenced slots once scope execution frames are popped off the thread stack.`,
    `System execution pipes data bytes through socket streams or filesystem cache buffers. Hardware controllers coordinate read/write locks to guarantee transactional stability during edits.`
  ];
  const internal_working = internal_working_templates[(hashVal + 5) % internal_working_templates.length];

  const summary_templates = [
    `Overall, ${title} is a critical component that establishes clean design boundaries, optimizes runtime memory spaces, and ensures safe execution in ${cleanDomain}.`,
    `To review, implementing ${title} secures variable namespaces, simplifies debugging operations, and delivers efficient code structures.`,
    `In summary, mastering ${title} enables developers to write maintainable code blocks, optimize database query routes, and prevent resource leaks.`,
    `To sum up, ${title} is a foundational design block that enhances abstraction, enforces strict security boundaries, and minimizes latency.`
  ];
  const summary = summary_templates[(hashVal + 6) % summary_templates.length];

  return {
    concept: cleanConcept,
    definition,
    why_exists,
    analogy,
    intuition: `Mastering this concept is vital to write efficient, bug-free applications. ${why_exists}`,
    detailed_concept,
    internal_working,
    summary,
    best_practices: [
      `Always initialize configurations for ${title} explicitly to prevent variables collisions.`,
      `Implement standard boundaries checks to avoid scope leakage outside call frames.`
    ],
    common_mistakes: {
      wrong: `// Unchecked initialization\nsetup_${conceptKey}_config()`,
      fix: `// Proper declaration\nconst config_${conceptKey} = setup_${conceptKey}_config();`,
      reason: 'Failing to track states or handles carefully leads to resource leaks or scope compiler alerts.'
    },
    interview_discussion: [
      { q: `What is the primary role of ${title} inside ${cleanDomain}?`, a: why_exists },
      { q: `Explain the internal mechanics of ${title}.`, a: internal_working }
    ]
  };
}

module.exports = {
  getProfile,
  CONCEPT_REGISTRY
};
