# EduNet Curriculum Audit & Rebuild — Master Tracker

**Last Updated**: 2026-07-22  
**Current Phase**: Phase 3 — Design & Rebuild (Python first)  
**Phase 1 Status**: ✅ COMPLETE  
**Phase 2 Status**: ✅ COMPLETE  
**Phase 3 Status**: 🔄 IN PROGRESS — Python  

---

## Phase 1 — Restored Learning Experience (Sign-off) ✅

### Workspace Tabs — Verified Present & Functional
| Tab | Panel ID | Status |
|-----|----------|--------|
| Overview | `tab-overview` | ✅ |
| Learn & Theory | `tab-learn` | ✅ |
| Interactive Code Lab | `tab-codelab` | ✅ |
| Practice Lab | `tab-practice` | ✅ |
| Interview Prep | `tab-interview` | ✅ |
| Project & Assessment | `tab-project` | ✅ |
| Completion | `tab-complete` | ✅ |
| Student Notes | `tab-notes` | ✅ |

### Navigation & Progress — Verified
- ✅ Previous / Next Lesson buttons (`#prevModBtn`, `#nextModBtn`)
- ✅ Stage navigation: `renderNavigationButtons()` — "← Back to [Stage]" / "Continue to [Stage] →"
- ✅ Stage locking/unlocking (`completedStages`, `isTabUnlocked`)
- ✅ Sidebar hierarchy with lock icons and completion badges
- ✅ XP system (`/api/lessons/:id/complete`)
- ✅ Certification exam and hash verification
- ✅ Notes auto-save (`POST /api/lessons/:id/notes`)

---

## Phase 2 — Curriculum Audit Report ✅

### CRITICAL FINDING: 100% Placeholder Content

**Every single roadmap (36 of 36) has the exact same structural and content problem.**

This is not a partial content quality issue. This is a **wholesale template generation failure** where a batch script ran and:
1. Generated 12 JSON files per lesson using substituted lesson-title strings
2. Never wrote any real educational content
3. Produced identical boilerplate for every lesson across every technology

**Evidence (Python > Variables > beginner.json):**
```
"whyExists": "Variables is a fundamental concept that exists because programmers needed a standardized way to handle a common programming task."
"simpleExplanation": "Variables is a technique in Python that helps you accomplish a specific programming task. It follows a clear pattern with setup, operation, and result."
"syntaxExplanation": "# Variables pattern in Python\nresult = perform_operation(input_data)\nprint(result)"
```

**Evidence (Python > Strings & Booleans > beginner.json):**
```
"whyExists": "Strings & Booleans is a fundamental concept that exists because programmers needed a standardized way to handle a common programming task."
"simpleExplanation": "Strings & Booleans is a technique in Python..."
"syntaxExplanation": "# Strings & Booleans pattern in Python\nresult = perform_operation(input_data)\nprint(result)"
```
The only difference is the lesson title string. The content is structurally identical.

**Evidence (Python > Variables > quiz.json):**
```
"question": "What is Variables?"
"options": ["A programming concept", "A hardware device", "A network protocol", "A database system"]
"question": "Why does Variables exist?"
"options": ["To solve a specific problem", "To make code slower", "For decorative purposes", "To replace hardware"]
```
These quizzes test nothing. A student cannot learn from them.

---

### Inventory: 37 Roadmaps

| # | Roadmap | Modules | Lessons | Module Quality | Lesson Names | Content Quality |
|---|---------|---------|---------|----------------|-------------|-----------------|
| 1 | `python` | 14 (correct, custom) | 40 | ✅ Relevant | ✅ Relevant | ❌ ALL PLACEHOLDER |
| 2 | `html` | 12 (generic template) | 36 | ❌ Wrong topic names | ❌ Wrong lessons | ❌ ALL PLACEHOLDER |
| 3 | `css` | 12 (generic template) | 36 | ❌ Wrong topic names | ❌ Wrong lessons | ❌ ALL PLACEHOLDER |
| 4 | `js` | 12 (generic template) | 36 | ❌ Wrong topic names | ❌ Wrong lessons | ❌ ALL PLACEHOLDER |
| 5 | `typescript` | 12 (generic template) | 36 | ❌ Wrong topic names | ❌ Wrong lessons | ❌ ALL PLACEHOLDER |
| 6 | `react` | 12 (generic template) | 36 | ❌ Wrong topic names | ❌ Wrong lessons | ❌ ALL PLACEHOLDER |
| 7 | `nodejs` | 12 (generic template) | 36 | ❌ Wrong topic names | ❌ Wrong lessons | ❌ ALL PLACEHOLDER |
| 8 | `express` | 12 (generic template) | 36 | ❌ Wrong topic names | ❌ Wrong lessons | ❌ ALL PLACEHOLDER |
| 9 | `sql` | 12 (generic template) | 36 | ❌ Wrong topic names | ❌ Wrong lessons | ❌ ALL PLACEHOLDER |
| 10 | `java` | 12 (generic template) | 36 | ❌ Wrong topic names | ❌ Wrong lessons | ❌ ALL PLACEHOLDER |
| 11 | `c` | 12 (correct, custom) | 36 | ✅ Relevant | ✅ Relevant | ❌ ALL PLACEHOLDER |
| 12 | `cpp` | 12 (generic template, mislabeled as C) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 13 | `dsa` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 14 | `ai` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 15 | `ml` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 16 | `aws` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 17 | `docker` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 18 | `kubernetes` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 19 | `devops` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 20 | `git` (webdev) | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 21 | `data-science` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 22 | `data-engineering` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 23 | `cybersecurity` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 24 | `blockchain` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 25 | `system-design` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 26 | `nextjs` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 27 | `android` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 28 | `flutter` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 29 | `gcp` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 30 | `azure` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 31 | `backend` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 32 | `frontend` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 33 | `full-stack` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 34 | `competitive` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 35 | `placement` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 36 | `ui-ux` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |
| 37 | `webdev` | 12 (generic template) | 36 | ❌ Wrong | ❌ Wrong | ❌ ALL PLACEHOLDER |

### Universal Problems (Apply to ALL Roadmaps)

| Problem | Description |
|---------|-------------|
| **Placeholder content** | All `beginner.json`, `intermediate.json`, `expert.json` contain template strings with only the lesson title substituted. No real explanation exists anywhere. |
| **Useless quizzes** | All `quiz.json` files contain 2-3 trivially obvious MCQs ("What is X?" with options "A hardware device / A network protocol"). No quiz tests real knowledge. |
| **Useless practice** | All `practice.json` contain `def basic_{lesson}(): pass` with no real problem statement, no test case, no expected output. |
| **Useless interview prep** | All `interview.json` contain 3 generic questions ("Explain X to a junior developer" / "Performance implications of X?") with non-answers. |
| **Wrong module taxonomy** | 35 of 37 roadmaps have the same 12 generic module names (e.g. `html_control_flow_boolean_logic_branching`, `css_iteration_loops_state_traversal`) — these are programming language concepts applied nonsensically to CSS, Docker, AWS, etc. |
| **Duplicate module structure** | Every roadmap has the identical 12-module skeleton regardless of the technology. AWS has "iteration loops." HTML has "advanced abstractions." CSS has "file integration." |
| **No progression** | Lesson ordering does not follow pedagogical progression. There is no prerequisite chain enforcement. |
| **Missing roadmap content** | Python roadmap is the only one with partially correct module names. C roadmap has correct module names. All others are completely wrong. |

### Only Two Correct Taxonomies

**Python** — module structure is correct and pedagogically sound:
- `python_interpreter_setup` → `variables_core_data_types` → `control_flow_branching` → `loops_iteration` → `functions_scope` → `lists_tuples` → `dictionaries_sets` → `exception_handling` → `file_handling_i_o` → `modules_packages` → `object_oriented_python` → `database_integration`

**C** — module structure is correct:
- `gcc_compiler_headers` → `format_specifiers_i_o` → `operators_expressions` → `control_flow_conditions` → `loops_iterations` → `functions_recursion` → `arrays_string_termination` → `pointers_dereferencing` → `structures_unions` → `dynamic_memory_allocation` → `dynamic_data_structures_c` → `file_i_o_descriptors`

All other roadmaps: **delete and rewrite module structure from scratch.**

---

## Phase 3 — Professional Curriculum Design (Backlog)

### Implementation Order (Priority)
1. **Python** — correct module taxonomy exists, only content needs rebuilding
2. **HTML** — fundamental; most students start here  
3. **CSS** — follows HTML
4. **JavaScript** — core language
5. **C** — correct module taxonomy exists, only content needs rebuilding
6. **Java** — widely taught
7. **DSA** — used by all roadmaps for interviews
8. **SQL** — foundational for backend/data
9. **React** — most popular frontend framework
10. **Node.js / Express** — backend
11. All remaining roadmaps in priority order

### Target Module Trees

Each roadmap below defines the **correct** module/lesson structure.  
These are the authoritative definitions — lesson content files must match these trees exactly.

---

#### PYTHON (Priority 1)
> Existing modules are correct — keep folder structure, rewrite content only

| # | Module | Lessons |
|---|--------|---------|
| 1 | Setup & First Steps | Python Installation, The REPL, Running Scripts, IDEs & VS Code Setup |
| 2 | Variables & Data Types | Variables & Assignment, Numbers (int/float/complex), Strings, Booleans, None & Type System, Type Casting |
| 3 | Operators | Arithmetic Operators, Comparison Operators, Logical Operators, Bitwise Operators, Assignment Operators |
| 4 | Control Flow | if / elif / else, Ternary Expressions, Match-Case (Python 3.10+), Nested Conditions |
| 5 | Loops & Iteration | while Loops, for Loops, range(), break / continue / pass, Nested Loops, List Comprehensions |
| 6 | Functions | Defining Functions, Parameters & Arguments, *args & **kwargs, Return Values, Scope & LEGB Rule, Lambda Functions, Recursion |
| 7 | Data Structures | Lists, Tuples, Sets, Dictionaries, Dictionary Comprehensions, Stacks & Queues with Lists |
| 8 | Strings In-Depth | String Methods, f-Strings & Formatting, Regular Expressions with re |
| 9 | Exception Handling | try / except / else / finally, Built-in Exceptions, Custom Exceptions, Raising Exceptions |
| 10 | File & I/O | Reading Files, Writing Files, Context Managers, Working with CSV & JSON |
| 11 | Modules & Packages | import & from, Standard Library Tour, Creating Packages, Virtual Environments, pip |
| 12 | OOP | Classes & Objects, Constructors (__init__), Inheritance, Polymorphism, Encapsulation, Dunder Methods, Dataclasses |
| 13 | Advanced Python | Decorators, Generators & Iterators, Context Managers (custom), Async/Await, Threading & Multiprocessing |
| 14 | Python in Practice | Unit Testing with unittest/pytest, Logging, Database with SQLite/SQLAlchemy, Flask Basics, Django Basics |

---

#### HTML (Priority 2)
> Delete all existing modules. Create new structure.

| # | Module | Lessons |
|---|--------|---------|
| 1 | Introduction to HTML | What is HTML, How Browsers Work, Your First Page, HTML Document Structure, Saving & Opening |
| 2 | Text & Semantics | Headings, Paragraphs & Line Breaks, Bold / Italic / Emphasis, Semantic Elements (article/section/nav), HTML Entities |
| 3 | Links & Navigation | Anchor Tags, Relative vs Absolute URLs, Opening in New Tab, Navigation Bars, Skip Links (Accessibility) |
| 4 | Images & Media | img Tag, alt Text & Accessibility, figure & figcaption, video & audio, Embedding with iframe |
| 5 | Lists | Ordered Lists, Unordered Lists, Nested Lists, Description Lists |
| 6 | Tables | Basic Table Structure, thead / tbody / tfoot, colspan & rowspan, Accessible Tables |
| 7 | Forms | form Element, Input Types, Labels & Accessibility, select / textarea / checkbox / radio, Form Validation (HTML5), Submitting Forms |
| 8 | Document Structure | DOCTYPE, head & meta Tags, Viewport & Mobile, Linking CSS & JS, Favicon |
| 9 | Semantic HTML5 | header / main / footer / aside, article vs section, nav, time & address, Landmark Roles |
| 10 | HTML APIs | Drag & Drop API, Geolocation, LocalStorage vs SessionStorage, History API |
| 11 | Accessibility (a11y) | ARIA Roles, Screen Readers, Tab Order, Focus Management, Color Contrast |
| 12 | HTML Best Practices | Validation, SEO Basics (meta, OG tags), Performance (lazy loading), HTML Email Basics |

---

#### CSS (Priority 3)
> Delete all existing modules. Create new structure.

| # | Module | Lessons |
|---|--------|---------|
| 1 | CSS Fundamentals | What is CSS, Adding CSS (inline/internal/external), Selectors, Specificity, Cascade & Inheritance |
| 2 | Colors & Typography | Color Values (hex/rgb/hsl), Backgrounds, Web Fonts & Google Fonts, font-size / weight / style, line-height / letter-spacing |
| 3 | The Box Model | margin / border / padding / content, box-sizing, Display (block/inline/inline-block), Width & Height, Overflow |
| 4 | Layout Fundamentals | Normal Flow, Positioning (static/relative/absolute/fixed/sticky), z-index, Float & Clear |
| 5 | Flexbox | Flex Container & Items, flex-direction, justify-content, align-items, flex-wrap, flex-grow/shrink/basis |
| 6 | CSS Grid | Grid Container & Items, grid-template-columns/rows, grid-area, auto-placement, minmax() |
| 7 | Responsive Design | Media Queries, Mobile-First Approach, Viewport Units, Responsive Images, CSS Breakpoints |
| 8 | Transitions & Animations | transition Property, CSS Animations & @keyframes, transform (translate/rotate/scale), animation-timing-function |
| 9 | CSS Variables & Modern CSS | Custom Properties (--variables), calc(), clamp(), :is() / :where() / :has() |
| 10 | Pseudo-classes & Pseudo-elements | :hover / :focus / :active, :nth-child / :first-child, ::before / ::after, ::placeholder |
| 11 | CSS Preprocessors & Tools | Sass/SCSS Basics, BEM Naming Convention, CSS Modules, PostCSS |
| 12 | CSS Architecture & Performance | CSS Specificity Wars, Avoiding Render-Blocking, Critical CSS, Accessibility in CSS |

---

#### JAVASCRIPT (Priority 4)
> Delete all existing modules. Create new structure.

| # | Module | Lessons |
|---|--------|---------|
| 1 | JS Fundamentals | What is JS, Script Tags, Variables (var/let/const), Data Types, typeof |
| 2 | Operators & Expressions | Arithmetic, Comparison (== vs ===), Logical, Ternary, Nullish Coalescing |
| 3 | Control Flow | if/else, switch, for / while / do-while, break & continue |
| 4 | Functions | Function Declaration vs Expression, Arrow Functions, Default Parameters, Rest & Spread, Closures |
| 5 | Arrays | Array Methods (map/filter/reduce/forEach/find/some/every), Destructuring, Spread, Array.from |
| 6 | Objects | Object Literals, Property Shorthand, Computed Properties, Destructuring, Object Methods, Prototypes |
| 7 | The DOM | Selecting Elements, Changing Content & Style, Creating & Removing Elements, Event Listeners, Event Bubbling |
| 8 | Asynchronous JS | Callbacks, Promises, async/await, fetch() & REST APIs, Error Handling in Async |
| 9 | OOP in JS | Classes & Constructors, Inheritance (extends), Mixins, Private Fields (#) |
| 10 | Modules | ES Modules (import/export), CommonJS, Dynamic import(), Bundlers Overview |
| 11 | Error Handling & Debugging | try/catch/finally, Custom Errors, Debugging in DevTools, console Methods |
| 12 | Advanced JavaScript | Closures In-Depth, The Event Loop, Generators, Proxy & Reflect, WeakMap/WeakSet, Memory Management |

---

#### C (Priority 5)
> Existing modules are correct — rewrite content only

(Existing module structure: `gcc_compiler_headers` through `file_i_o_descriptors` — keep as-is, content rebuild only)

---

#### JAVA (Priority 6)

| # | Module | Lessons |
|---|--------|---------|
| 1 | Java Basics | JVM/JDK/JRE, Hello World, Data Types & Variables, Type Casting, Scanner Input |
| 2 | Operators & Control Flow | Operators, if/else, switch, for/while/do-while loops |
| 3 | Methods | Method Declaration, Parameters, Return Types, Method Overloading, Recursion |
| 4 | Arrays & Strings | 1D/2D Arrays, String Class & StringBuilder, String Methods, String Pool |
| 5 | OOP Foundations | Classes & Objects, Constructors, this Keyword, Encapsulation, Access Modifiers |
| 6 | Inheritance & Polymorphism | extends, super, Method Overriding, Abstract Classes, final Keyword |
| 7 | Interfaces & Abstract Classes | Interface vs Abstract Class, Default Methods, Multiple Interfaces |
| 8 | Exception Handling | try/catch/finally, Checked vs Unchecked, Custom Exceptions, throws |
| 9 | Collections Framework | List (ArrayList/LinkedList), Set (HashSet/TreeSet), Map (HashMap/TreeMap), Iterator |
| 10 | Generics & Lambdas | Generic Classes & Methods, Bounded Types, Lambda Expressions, Functional Interfaces |
| 11 | Java I/O & Files | FileReader/FileWriter, BufferedReader, Serialization, NIO.2 (Path, Files) |
| 12 | Concurrency & Modern Java | Threads & Runnable, synchronized, Executor Service, Stream API, Optional, Records |

---

#### DSA (Priority 7)

| # | Module | Lessons |
|---|--------|---------|
| 1 | Complexity Analysis | Big-O Notation, Time vs Space Complexity, Amortized Analysis, Best/Average/Worst Case |
| 2 | Arrays | Array Operations, Two-Pointer Technique, Sliding Window, Prefix Sums, Kadane's Algorithm |
| 3 | Strings | String Manipulation, Palindrome Checks, Anagram Detection, KMP Algorithm, Rabin-Karp |
| 4 | Linked Lists | Singly Linked List, Doubly Linked List, Cycle Detection (Floyd's), Merge & Reverse |
| 5 | Stacks & Queues | Stack (LIFO), Queue (FIFO), Monotonic Stack, Deque, Priority Queue |
| 6 | Hashing | Hash Tables, Hash Functions, Collision Resolution, HashMap Internals, Applications |
| 7 | Trees | Binary Trees, BST Operations, DFS (Pre/In/Post-order), BFS, Balanced Trees, Trie |
| 8 | Heaps | Min/Max Heap, Heap Sort, Kth Largest, Top-K Problems |
| 9 | Graphs | Representation (Adj List/Matrix), BFS/DFS, Topological Sort, Union-Find, Dijkstra, Bellman-Ford |
| 10 | Sorting | Bubble/Selection/Insertion Sort, Merge Sort, Quick Sort, Heap Sort, Counting/Radix Sort |
| 11 | Searching | Binary Search, Ternary Search, Search in Rotated Arrays |
| 12 | Dynamic Programming | Memoization vs Tabulation, Fibonacci, 0-1 Knapsack, LCS, LIS, Coin Change, DP on Trees |

---

#### SQL (Priority 8)

| # | Module | Lessons |
|---|--------|---------|
| 1 | SQL Fundamentals | What is SQL, Relational Databases, Installing PostgreSQL/MySQL, SQL vs NoSQL |
| 2 | Basic Queries | SELECT, FROM, WHERE, ORDER BY, LIMIT, DISTINCT |
| 3 | Filtering & Functions | Comparison Operators, LIKE / IN / BETWEEN, NULL & IS NULL, Aggregate Functions (COUNT/SUM/AVG/MIN/MAX) |
| 4 | Joins | INNER JOIN, LEFT/RIGHT JOIN, FULL OUTER JOIN, SELF JOIN, CROSS JOIN, JOIN Best Practices |
| 5 | Grouping & Subqueries | GROUP BY, HAVING, Subqueries (WHERE/FROM/SELECT), CTEs (WITH clause) |
| 6 | DDL — Database Design | CREATE TABLE, Data Types, PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, DEFAULT |
| 7 | DML — Data Manipulation | INSERT, UPDATE, DELETE, UPSERT (ON CONFLICT), RETURNING |
| 8 | Indexes & Performance | CREATE INDEX, Index Types (B-Tree/Hash), EXPLAIN ANALYZE, Query Optimization |
| 9 | Transactions & ACID | BEGIN/COMMIT/ROLLBACK, ACID Properties, Isolation Levels, Deadlocks |
| 10 | Advanced SQL | Window Functions (ROW_NUMBER/RANK/LAG/LEAD), PIVOT, JSON in SQL, Recursive CTEs |
| 11 | Stored Procedures & Triggers | Functions & Procedures, Triggers, Views, Materialized Views |
| 12 | SQL in Practice | ORMs Overview, Database Migrations, PostgreSQL-specific Features, Schema Design Patterns |

---

#### REACT (Priority 9)

| # | Module | Lessons |
|---|--------|---------|
| 1 | React Fundamentals | What is React, CRA vs Vite, JSX Syntax, Rendering & Virtual DOM |
| 2 | Components | Function Components, Props, PropTypes, Component Composition, Children |
| 3 | State & Events | useState Hook, Event Handling, Controlled vs Uncontrolled Inputs, Lifting State Up |
| 4 | Side Effects | useEffect Hook, Dependency Array, Cleanup Functions, Fetching Data |
| 5 | Advanced Hooks | useRef, useContext, useMemo, useCallback, Custom Hooks |
| 6 | Lists & Conditionals | Rendering Lists & Keys, Conditional Rendering (&&, ternary) |
| 7 | Forms | Controlled Forms, Form Validation, React Hook Form |
| 8 | React Router | BrowserRouter, Route & Link, useNavigate, useParams, Nested Routes, Protected Routes |
| 9 | State Management | Context API, Redux Toolkit (createSlice, useSelector, useDispatch), Zustand |
| 10 | Performance | React.memo, Code Splitting, Lazy Loading, Suspense, React DevTools |
| 11 | Testing | Jest, React Testing Library, Mocking, Snapshot Tests |
| 12 | React in Production | Build & Deploy, Server Components (React 18+), Error Boundaries, Accessibility |

---

#### NODE.JS (Priority 10)

| # | Module | Lessons |
|---|--------|---------|
| 1 | Node.js Basics | What is Node.js, Event Loop, CommonJS Modules, Running Files with node |
| 2 | Core Modules | path, fs, os, events, stream, Buffer |
| 3 | NPM & Package Management | package.json, npm install, devDependencies, scripts, npx, Semantic Versioning |
| 4 | Asynchronous Node | Callbacks, Promises, async/await, EventEmitter, Worker Threads |
| 5 | HTTP & Express | http Module, Express Setup, Routing, Middleware, Static Files |
| 6 | REST APIs | RESTful Design, Route Parameters, Query Strings, Request Body (JSON), Status Codes |
| 7 | Authentication | JWT, bcrypt, Session vs Token Auth, Middleware Guards |
| 8 | Databases | Connecting to PostgreSQL (pg/Knex), MongoDB (Mongoose), Redis |
| 9 | File Uploads & Validation | Multer, express-validator, Joi |
| 10 | Error Handling | Express Error Middleware, async Error Wrappers, HTTP Error Classes |
| 11 | Testing | Jest + Supertest, Mocking DB Calls, Integration Tests |
| 12 | Production | Environment Variables, Docker, PM2, Rate Limiting, Logging (winston/pino) |

---

*All remaining roadmaps (Express, TypeScript, Next.js, Docker, Kubernetes, AWS, Azure, GCP, ML, AI, Data Science, Data Engineering, Cybersecurity, System Design, Blockchain, Android, Flutter, UI/UX, DevOps, Frontend, Backend, Full-Stack, Competitive, Placement, WebDev) to be designed in Phase 3 during their respective rebuild turns.*

---

## Phase 4 — Rebuild Progress (Per-Roadmap Sign-off)

| Roadmap | Modules Designed | Content Written | QA Passed | Signed Off |
|---------|-----------------|-----------------|-----------|-----------|
| Python | ✅ | 🔄 | ⬜ | ⬜ |
| HTML | ✅ Design Ready | ⬜ | ⬜ | ⬜ |
| CSS | ✅ Design Ready | ⬜ | ⬜ | ⬜ |
| JavaScript | ✅ Design Ready | ⬜ | ⬜ | ⬜ |
| C | ✅ Design Ready | ⬜ | ⬜ | ⬜ |
| Java | ✅ Design Ready | ⬜ | ⬜ | ⬜ |
| DSA | ✅ Design Ready | ⬜ | ⬜ | ⬜ |
| SQL | ✅ Design Ready | ⬜ | ⬜ | ⬜ |
| React | ✅ Design Ready | ⬜ | ⬜ | ⬜ |
| Node.js | ✅ Design Ready | ⬜ | ⬜ | ⬜ |
| All others | 🔄 Queued | ⬜ | ⬜ | ⬜ |

---

## Phase 6 — Protected Systems (Do Not Touch)

The following systems are permanently out of scope for curriculum work:
- ✅ Authentication (login/register/JWT)
- ✅ Leaderboards
- ✅ XP & Badge system
- ✅ Analytics
- ✅ Profile / Resume / Portfolio
- ✅ AI Mentor (`coach.html`)
- ✅ Projects (non-curriculum)
- ✅ Backend APIs (route handlers, DB schema, controllers)
- ✅ roadmap-learn.html UI and tab rendering
- ✅ roadmap-learn.js navigation, progress, stepper logic
