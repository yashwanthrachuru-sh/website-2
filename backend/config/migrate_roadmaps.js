// ============================================================
// backend/config/migrate_roadmaps.js
// EduNet — Roadmap Learning System Full Migration + Seed
// Run: node backend/config/migrate_roadmaps.js
// ============================================================
'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const cfg = {
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'edunet',
  multipleStatements: true,
  charset: 'utf8mb4'
};

async function run() {
  const conn = await mysql.createConnection(cfg);
  console.log('✅ DB Connected\n');

  // ─────────────────────────────────────────────
  // PHASE 1: Create new tables
  // ─────────────────────────────────────────────
  console.log('📐 Creating roadmap learning tables...');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS roadmap_modules (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      roadmap_id    VARCHAR(50) NOT NULL,
      title         VARCHAR(200) NOT NULL,
      description   TEXT NOT NULL,
      order_index   INT DEFAULT 0,
      xp_reward     INT DEFAULT 200,
      icon          VARCHAR(10) DEFAULT '📖',
      language      VARCHAR(30) DEFAULT 'text',
      is_free       TINYINT(1) DEFAULT 1,
      created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE,
      INDEX idx_rm_roadmap (roadmap_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('  ✓ roadmap_modules');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS module_lessons (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      module_id       INT NOT NULL,
      title           VARCHAR(200) NOT NULL,
      short_desc      TEXT NOT NULL,
      learning_notes  MEDIUMTEXT NOT NULL,
      starter_code    TEXT,
      language        VARCHAR(30) DEFAULT 'javascript',
      order_index     INT DEFAULT 0,
      xp_reward       INT DEFAULT 50,
      created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (module_id) REFERENCES roadmap_modules(id) ON DELETE CASCADE,
      INDEX idx_ml_module (module_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('  ✓ module_lessons');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS lesson_videos (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      module_id   INT NOT NULL,
      title       VARCHAR(255) NOT NULL,
      channel     VARCHAR(100) NOT NULL,
      video_id    VARCHAR(50) NOT NULL,
      embed_url   VARCHAR(255) NOT NULL,
      thumbnail   VARCHAR(255) NOT NULL,
      duration    VARCHAR(20) DEFAULT '',
      FOREIGN KEY (module_id) REFERENCES roadmap_modules(id) ON DELETE CASCADE,
      INDEX idx_lv_module (module_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('  ✓ lesson_videos');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS lesson_resources (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      module_id   INT NOT NULL,
      title       VARCHAR(255) NOT NULL,
      url         VARCHAR(500) NOT NULL,
      type        VARCHAR(30) DEFAULT 'docs',
      FOREIGN KEY (module_id) REFERENCES roadmap_modules(id) ON DELETE CASCADE,
      INDEX idx_lr_module (module_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('  ✓ lesson_resources');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS lesson_exercises (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      module_id   INT NOT NULL,
      title       VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      difficulty  VARCHAR(20) DEFAULT 'Easy',
      starter_code TEXT,
      hint        TEXT,
      order_index INT DEFAULT 0,
      FOREIGN KEY (module_id) REFERENCES roadmap_modules(id) ON DELETE CASCADE,
      INDEX idx_le_module (module_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('  ✓ lesson_exercises');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS lesson_challenges (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      module_id     INT NOT NULL,
      title         VARCHAR(255) NOT NULL,
      description   TEXT NOT NULL,
      starter_code  TEXT,
      language      VARCHAR(30) DEFAULT 'javascript',
      xp_reward     INT DEFAULT 150,
      FOREIGN KEY (module_id) REFERENCES roadmap_modules(id) ON DELETE CASCADE,
      INDEX idx_lc_module (module_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('  ✓ lesson_challenges');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS lesson_quizzes (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      module_id       INT NOT NULL,
      question        TEXT NOT NULL,
      option_a        VARCHAR(500) NOT NULL,
      option_b        VARCHAR(500) NOT NULL,
      option_c        VARCHAR(500) NOT NULL,
      option_d        VARCHAR(500) NOT NULL,
      correct_option  CHAR(1) NOT NULL,
      explanation     TEXT,
      order_index     INT DEFAULT 0,
      FOREIGN KEY (module_id) REFERENCES roadmap_modules(id) ON DELETE CASCADE,
      INDEX idx_lq_module (module_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('  ✓ lesson_quizzes');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS module_progress (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      user_id     INT NOT NULL,
      module_id   INT NOT NULL,
      roadmap_id  VARCHAR(50) NOT NULL,
      completed   TINYINT(1) DEFAULT 0,
      quiz_score  INT DEFAULT 0,
      challenge_done TINYINT(1) DEFAULT 0,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_user_module (user_id, module_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (module_id) REFERENCES roadmap_modules(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('  ✓ module_progress');

  // ─────────────────────────────────────────────
  // PHASE 2: Ensure roadmaps exist for all 10 tracks
  // ─────────────────────────────────────────────
  console.log('\n🗺  Upserting roadmaps...');

  const roadmaps = [
    ['webdev',  'Web Development',   'Web Dev',   'Beginner',     'Build full-stack apps with HTML, CSS, JS, React, and Node.js from zero to deployed.', '16 weeks', 2400, '🌐', 'html,css,javascript,react,nodejs', 1],
    ['python',  'Python',            'Programming','Beginner',    'Master Python from basics through OOP, Flask, Django, automation and data science.', '12 weeks', 2000, '🐍', 'python,oop,flask,django,pandas', 1],
    ['java',    'Java',              'Programming','Intermediate', 'Java ecosystem from fundamentals to Spring Boot, microservices, and JDBC.', '14 weeks', 2100, '☕', 'java,spring,hibernate,jdbc,maven', 1],
    ['dsa',     'Data Structures',   'Programming','Intermediate', 'Master every DS from arrays to advanced graphs, DP, and competitive programming.', '16 weeks', 3000, '🌳', 'arrays,linked-lists,trees,graphs,dp', 1],
    ['ml',      'Machine Learning',  'AI/ML',      'Advanced',    'Train, evaluate, and deploy ML models using Python, scikit-learn, and TensorFlow.', '20 weeks', 3200, '🤖', 'python,numpy,pandas,sklearn,tensorflow', 1],
    ['ai',      'Artificial Intelligence','AI/ML',  'Advanced',   'NLP, Transformers, LLMs, LangChain, RAG pipelines, and AI Agents from scratch.', '20 weeks', 3500, '🧠', 'nlp,transformers,llms,langchain,openai', 1],
    ['sql',     'SQL & Databases',   'Data',       'Beginner',    'Master SQL from basic queries to advanced optimization, stored procedures, and NoSQL.', '8 weeks', 1400, '🗄️', 'sql,mysql,joins,indexes,procedures', 1],
    ['cpp',     'C++',               'Programming','Intermediate', 'High-performance C++ with STL, OOP, templates, smart pointers, and competitive programming.', '14 weeks', 2400, '⚡', 'cpp,stl,oop,templates,concurrency', 1],
    ['c',       'C Programming',     'Programming','Beginner',    'Master procedural C with memory management, pointers, data structures, and systems programming.', '10 weeks', 1800, '🔵', 'c,pointers,arrays,structures,memory', 1],
    ['js',      'JavaScript',        'Web Dev',    'Beginner',    'Deep-dive into modern JS — DOM, async/await, closures, ES6+, modules, and projects.', '10 weeks', 2000, '💛', 'javascript,dom,es6,async,fetch', 1],
  ];

  for (const [id,title,cat,diff,desc,dur,xp,icon,tags,feat] of roadmaps) {
    await conn.query(`
      INSERT INTO roadmaps (id, branch, track, title, description, category, difficulty, duration, xp_reward, lesson_count, icon, tags, is_featured)
      VALUES (?,?,?,?,?,?,?,?,?,0,?,?,?)
      ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), category=VALUES(category),
        difficulty=VALUES(difficulty), duration=VALUES(duration), xp_reward=VALUES(xp_reward),
        icon=VALUES(icon), tags=VALUES(tags), is_featured=VALUES(is_featured)
    `, [id, cat, cat, title, desc, cat, diff, dur, xp, icon, tags, feat]).catch(() => {
      // column may not exist yet — try without optional columns
      return conn.query(
        `INSERT INTO roadmaps (id, branch, track, title, description) VALUES (?,?,?,?,?)
         ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description)`,
        [id, cat, cat, title, desc]
      );
    });
  }
  console.log('  ✓ 10 roadmaps upserted');

  // ─────────────────────────────────────────────
  // PHASE 3: Seed roadmap_modules
  // ─────────────────────────────────────────────
  console.log('\n📚 Seeding roadmap_modules...');

  // Clear existing modules for clean seed
  await conn.query('DELETE FROM roadmap_modules WHERE roadmap_id IN (?,?,?,?,?,?,?,?,?,?)',
    ['webdev','python','java','dsa','ml','ai','sql','cpp','c','js']);

  const moduleData = {
    webdev: [
      {title:'Introduction to Web Development', icon:'🌐', lang:'html', desc:'Understand how the web works — clients, servers, browsers, HTTP, and URLs. Set up your development environment with VS Code.', xp:150},
      {title:'HTML Fundamentals', icon:'📄', lang:'html', desc:'Learn HTML structure, elements, attributes, headings, paragraphs, links, images, lists, and tables.', xp:200},
      {title:'HTML Semantic Elements', icon:'🏗️', lang:'html', desc:'Use semantic tags like header, nav, main, article, aside, footer for accessibility and SEO.', xp:200},
      {title:'CSS Basics', icon:'🎨', lang:'css', desc:'Apply styles with selectors, colors, fonts, backgrounds, borders, and the cascade and specificity model.', xp:200},
      {title:'CSS Flexbox', icon:'📐', lang:'css', desc:'Master one-dimensional layouts using Flexbox: flex-direction, justify-content, align-items, flex-wrap.', xp:200},
      {title:'CSS Grid', icon:'🔲', lang:'css', desc:'Build two-dimensional layouts with CSS Grid: grid-template-columns, grid-template-rows, gap, areas.', xp:200},
      {title:'Responsive Design', icon:'📱', lang:'css', desc:'Make websites work on all screen sizes with media queries, fluid layouts, and mobile-first design.', xp:200},
      {title:'JavaScript Basics', icon:'💛', lang:'javascript', desc:'Learn JS variables, data types, operators, conditionals, loops, functions, and arrays.', xp:250},
      {title:'DOM Manipulation', icon:'🖱️', lang:'javascript', desc:'Select, modify, create, and delete HTML elements using the Document Object Model API.', xp:250},
      {title:'ES6+ Modern JavaScript', icon:'⚡', lang:'javascript', desc:'Arrow functions, destructuring, spread, rest, template literals, modules, Promises, async/await.', xp:300},
      {title:'React Fundamentals', icon:'⚛️', lang:'javascript', desc:'Build component-based UIs with React — JSX, props, state, hooks (useState, useEffect), and events.', xp:350},
      {title:'Node.js & Express APIs', icon:'🟢', lang:'javascript', desc:'Build backend REST APIs with Node.js and Express. Handle routes, middleware, JSON responses, and MySQL.', xp:400},
    ],
    python: [
      {title:'Python Introduction', icon:'🐍', lang:'python', desc:'Install Python, understand the interpreter, run scripts, use print, comments, and understand indentation.', xp:150},
      {title:'Variables & Data Types', icon:'📦', lang:'python', desc:'Integers, floats, strings, booleans, None. Type conversion, naming conventions, and dynamic typing.', xp:200},
      {title:'Control Flow & Loops', icon:'🔀', lang:'python', desc:'if/elif/else, for loops, while loops, break, continue, pass, range(), and list iteration patterns.', xp:200},
      {title:'Functions & Scope', icon:'🔧', lang:'python', desc:'Define functions with def, parameters, return values, default args, *args, **kwargs, and scope rules.', xp:200},
      {title:'Object-Oriented Python', icon:'🏛️', lang:'python', desc:'Classes, constructors, instance methods, inheritance, polymorphism, encapsulation, and dunder methods.', xp:250},
      {title:'File Handling & I/O', icon:'📂', lang:'python', desc:'Read/write text and binary files, use context managers (with), handle file paths with pathlib.', xp:200},
      {title:'Python Modules & Packages', icon:'📦', lang:'python', desc:'Import standard library modules, install packages with pip, create your own modules and packages.', xp:200},
      {title:'APIs & Requests', icon:'🌐', lang:'python', desc:'Make HTTP requests with the requests library, parse JSON responses, handle errors, and call REST APIs.', xp:250},
      {title:'Flask Web Framework', icon:'🍶', lang:'python', desc:'Build web apps with Flask: routes, templates, forms, SQLite, and deploying to Render or Heroku.', xp:300},
      {title:'Django Framework', icon:'🦄', lang:'python', desc:'Full-stack web framework: models, views, templates, admin panel, authentication, and ORM.', xp:350},
      {title:'Automation & Scripting', icon:'🤖', lang:'python', desc:'Automate tasks with selenium, BeautifulSoup, schedule, smtplib, and Python scripts.', xp:300},
      {title:'Capstone Projects', icon:'🏆', lang:'python', desc:'Build a blog with Flask, a CRUD REST API with Django, an automation script, and a CLI tool.', xp:500},
    ],
    java: [
      {title:'Java Introduction', icon:'☕', lang:'java', desc:'Install JDK, understand JVM/JRE/JDK, write your first Java program, compile and run from terminal.', xp:150},
      {title:'Variables & Data Types', icon:'📦', lang:'java', desc:'Primitive types (int, double, char, boolean), String, type casting, wrapper classes, and constants.', xp:200},
      {title:'Operators & Expressions', icon:'➕', lang:'java', desc:'Arithmetic, relational, logical, bitwise, assignment operators, operator precedence, and expressions.', xp:200},
      {title:'Control Statements', icon:'🔀', lang:'java', desc:'if/else, switch-case, for, while, do-while, break, continue, and enhanced for-each loop.', xp:200},
      {title:'Arrays & Strings', icon:'📊', lang:'java', desc:'1D/2D arrays, array methods, String class, StringBuilder, String methods, and immutability.', xp:200},
      {title:'Methods & Recursion', icon:'🔧', lang:'java', desc:'Method declaration, parameters, return types, method overloading, varargs, and recursive methods.', xp:200},
      {title:'Object-Oriented Programming', icon:'🏛️', lang:'java', desc:'Classes, objects, constructors, this keyword, inheritance, polymorphism, abstraction, interfaces.', xp:300},
      {title:'Exception Handling', icon:'⚠️', lang:'java', desc:'try-catch-finally, multiple exceptions, custom exceptions, throws, checked vs unchecked.', xp:200},
      {title:'Collections Framework', icon:'📚', lang:'java', desc:'ArrayList, LinkedList, HashMap, HashSet, TreeMap, Iterator, generics, and collections utility.', xp:300},
      {title:'JDBC & Database', icon:'🗄️', lang:'java', desc:'Connect to MySQL with JDBC, execute queries, prepared statements, ResultSet, and connection pooling.', xp:300},
      {title:'Multithreading', icon:'⚡', lang:'java', desc:'Thread class, Runnable, synchronized, wait/notify, ExecutorService, thread pools, and concurrency.', xp:300},
      {title:'Spring Boot', icon:'🌱', lang:'java', desc:'Build REST APIs with Spring Boot, auto-configuration, Spring Data JPA, Spring Security basics.', xp:400},
    ],
    dsa: [
      {title:'Arrays & Complexity', icon:'📊', lang:'javascript', desc:'Array operations, time complexity (Big O), space complexity, sliding window, two-pointer techniques.', xp:250},
      {title:'Linked Lists', icon:'🔗', lang:'javascript', desc:'Singly and doubly linked lists, insertion, deletion, reversal, cycle detection, and merge operations.', xp:250},
      {title:'Stacks & Queues', icon:'📚', lang:'javascript', desc:'LIFO stack, FIFO queue, deque, monotonic stack, implement stack using arrays and linked lists.', xp:200},
      {title:'Trees & Binary Search Trees', icon:'🌲', lang:'javascript', desc:'Binary trees, BST operations, tree traversal (inorder, preorder, postorder), height, and balance.', xp:300},
      {title:'Heaps & Priority Queue', icon:'⛰️', lang:'javascript', desc:'Min-heap, max-heap, heapify, heap sort, priority queue, and top-K problems.', xp:300},
      {title:'Graphs & BFS/DFS', icon:'🕸️', lang:'javascript', desc:'Graph representations, BFS, DFS, topological sort, shortest path, and connected components.', xp:350},
      {title:'Hashing', icon:'#️⃣', lang:'javascript', desc:'Hash tables, hash functions, collision resolution, HashMaps for problem solving, anagram detection.', xp:250},
      {title:'Dynamic Programming', icon:'💡', lang:'javascript', desc:'Memoization vs tabulation, Fibonacci, knapsack, LCS, LIS, coin change, and classic DP patterns.', xp:400},
      {title:'Greedy Algorithms', icon:'🎯', lang:'javascript', desc:'Activity selection, interval scheduling, Huffman coding, fractional knapsack, greedy approaches.', xp:300},
      {title:'Sorting Algorithms', icon:'🔢', lang:'javascript', desc:'Bubble, selection, insertion, merge sort, quick sort, counting sort, radix sort, and stability.', xp:300},
      {title:'Searching Algorithms', icon:'🔍', lang:'javascript', desc:'Linear search, binary search, ternary search, exponential search, and search in rotated arrays.', xp:250},
      {title:'Advanced Graph Algorithms', icon:'🗺️', lang:'javascript', desc:'Dijkstra, Bellman-Ford, Floyd-Warshall, Kruskal, Prim, and SCC with Tarjan/Kosaraju.', xp:450},
    ],
    ml: [
      {title:'Python for ML', icon:'🐍', lang:'python', desc:'NumPy arrays, broadcasting, vectorization, Matplotlib basics, and Jupyter Notebook setup for ML.', xp:200},
      {title:'NumPy & Pandas', icon:'📊', lang:'python', desc:'Array operations, DataFrame creation, indexing, groupby, merge, concat, and data cleaning techniques.', xp:250},
      {title:'Data Visualization', icon:'📈', lang:'python', desc:'Matplotlib plots, Seaborn heatmaps, histogram, box plots, correlation matrix, and Plotly interactive.', xp:200},
      {title:'Statistics for ML', icon:'📐', lang:'python', desc:'Mean, median, variance, standard deviation, probability distributions, Bayes theorem, hypothesis testing.', xp:250},
      {title:'Linear & Logistic Regression', icon:'📉', lang:'python', desc:'Cost function, gradient descent, overfitting, regularization (L1/L2), confusion matrix, ROC curve.', xp:300},
      {title:'Classification Algorithms', icon:'🏷️', lang:'python', desc:'KNN, Decision Trees, Random Forest, SVM, Naive Bayes, evaluation metrics — precision, recall, F1.', xp:300},
      {title:'Clustering & Unsupervised', icon:'🌀', lang:'python', desc:'K-Means, hierarchical clustering, DBSCAN, PCA for dimensionality reduction, elbow method.', xp:300},
      {title:'Neural Networks', icon:'🧠', lang:'python', desc:'Perceptron, activation functions, forward/backward propagation, multi-layer networks, batch gradient.', xp:350},
      {title:'Deep Learning with TensorFlow', icon:'🔥', lang:'python', desc:'Keras Sequential API, layers, optimizers, callbacks, CNNs for images, and model evaluation.', xp:400},
      {title:'Feature Engineering', icon:'⚙️', lang:'python', desc:'Encoding, scaling, imputation, feature selection, polynomial features, and pipeline creation.', xp:250},
      {title:'Model Deployment with Flask', icon:'🚀', lang:'python', desc:'Save models with joblib/pickle, serve predictions via Flask REST API, and containerize with Docker.', xp:350},
      {title:'MLOps & Best Practices', icon:'🔄', lang:'python', desc:'ML pipelines, experiment tracking with MLflow, model versioning, data drift, and CI/CD for ML.', xp:400},
    ],
    ai: [
      {title:'AI Fundamentals', icon:'🤖', lang:'python', desc:'History of AI, types (narrow vs general vs super), search algorithms, state spaces, and problem formulation.', xp:200},
      {title:'Natural Language Processing', icon:'💬', lang:'python', desc:'Tokenization, POS tagging, NER, sentiment analysis, TF-IDF, word embeddings (Word2Vec, GloVe).', xp:300},
      {title:'Transformers Architecture', icon:'⚡', lang:'python', desc:'Attention mechanism, self-attention, multi-head attention, positional encoding, encoder-decoder.', xp:350},
      {title:'Prompt Engineering', icon:'✍️', lang:'python', desc:'Zero-shot, few-shot, chain-of-thought, system prompts, temperature, best practices for GPT-4.', xp:250},
      {title:'Large Language Models (LLMs)', icon:'🧠', lang:'python', desc:'GPT, BERT, LLaMA architectures, fine-tuning, RLHF, quantization, and LLM evaluation metrics.', xp:400},
      {title:'LangChain Framework', icon:'🔗', lang:'python', desc:'Chains, agents, tools, memory, LLMChain, SequentialChain, ConversationalChain, and output parsers.', xp:350},
      {title:'RAG — Retrieval Augmented Generation', icon:'📚', lang:'python', desc:'Document chunking, vector embeddings, Chroma/Pinecone, retrieval pipelines, and RAG evaluation.', xp:400},
      {title:'AI Agents & Automation', icon:'🤖', lang:'python', desc:'ReAct agents, tool-calling, function calling, AutoGPT-style loops, memory and planning strategies.', xp:400},
      {title:'OpenAI APIs', icon:'🔑', lang:'python', desc:'GPT-4, DALL-E, Whisper, Embeddings API, assistants API, and function calling with OpenAI SDK.', xp:300},
      {title:'Vector Databases', icon:'🗄️', lang:'python', desc:'Chroma, Pinecone, Weaviate, FAISS — semantic search, similarity search, and cosine distance.', xp:350},
      {title:'AI Safety & Ethics', icon:'⚖️', lang:'python', desc:'Alignment, bias in AI, fairness, explainability (LIME/SHAP), adversarial attacks, and red teaming.', xp:250},
      {title:'Capstone: Build an AI App', icon:'🏆', lang:'python', desc:'Build a full RAG-powered AI assistant using LangChain, OpenAI, and ChromaDB with a Flask UI.', xp:500},
    ],
    sql: [
      {title:'Database Fundamentals', icon:'🗄️', lang:'sql', desc:'DBMS concepts, relational model, tables, rows, columns, keys, and normalization (1NF–3NF).', xp:150},
      {title:'SELECT Queries', icon:'🔍', lang:'sql', desc:'SELECT, FROM, WHERE, DISTINCT, ORDER BY, LIMIT, OFFSET, and column aliases.', xp:200},
      {title:'Filtering with WHERE', icon:'🔎', lang:'sql', desc:'WHERE with AND/OR/NOT, BETWEEN, IN, LIKE, IS NULL, and comparison operators.', xp:200},
      {title:'Aggregation & GROUP BY', icon:'📊', lang:'sql', desc:'COUNT, SUM, AVG, MIN, MAX, GROUP BY, HAVING, and filtering grouped results.', xp:200},
      {title:'JOINs', icon:'🔗', lang:'sql', desc:'INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN, and self-join with real examples.', xp:300},
      {title:'Subqueries & CTEs', icon:'📝', lang:'sql', desc:'Correlated subqueries, WITH clause (CTEs), EXIST, NOT EXISTS, IN subqueries.', xp:250},
      {title:'Views & Stored Procedures', icon:'👁️', lang:'sql', desc:'CREATE VIEW, updatable views, stored procedures, parameters, IN/OUT params, and CALL.', xp:250},
      {title:'Transactions & ACID', icon:'🔒', lang:'sql', desc:'BEGIN, COMMIT, ROLLBACK, SAVEPOINT, isolation levels, ACID properties, and deadlocks.', xp:250},
      {title:'Indexes & Performance', icon:'⚡', lang:'sql', desc:'B-tree indexes, composite indexes, EXPLAIN ANALYZE, query optimization, and covering indexes.', xp:300},
      {title:'Triggers & Events', icon:'⚙️', lang:'sql', desc:'CREATE TRIGGER, BEFORE/AFTER INSERT/UPDATE/DELETE, event scheduler, and temporal data.', xp:250},
      {title:'Window Functions', icon:'📐', lang:'sql', desc:'ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, NTILE, PARTITION BY, and analytical queries.', xp:350},
      {title:'NoSQL & Database Design', icon:'📦', lang:'sql', desc:'MongoDB basics, document model vs relational, ER diagram, schema design, and denormalization.', xp:300},
    ],
    cpp: [
      {title:'C++ Fundamentals', icon:'⚡', lang:'cpp', desc:'Compilation with g++, data types, variables, I/O (cin/cout), constants, and header files.', xp:150},
      {title:'Control Flow & Functions', icon:'🔀', lang:'cpp', desc:'if/else, switch, for, while, function declaration, pass by value/reference, inline functions.', xp:200},
      {title:'Object-Oriented C++', icon:'🏛️', lang:'cpp', desc:'Classes, objects, constructors, destructors, this pointer, access specifiers, inheritance, virtual.', xp:300},
      {title:'STL Containers', icon:'📦', lang:'cpp', desc:'vector, list, deque, set, map, unordered_map, stack, queue, priority_queue, and iterators.', xp:350},
      {title:'STL Algorithms', icon:'🔧', lang:'cpp', desc:'sort, find, binary_search, transform, accumulate, lower_bound, upper_bound, and custom comparators.', xp:300},
      {title:'Templates & Generics', icon:'📐', lang:'cpp', desc:'Function templates, class templates, template specialization, and variadic templates.', xp:300},
      {title:'Smart Pointers & Memory', icon:'💾', lang:'cpp', desc:'unique_ptr, shared_ptr, weak_ptr, RAII, move semantics, and avoiding memory leaks.', xp:350},
      {title:'Concurrency & Threads', icon:'⚡', lang:'cpp', desc:'std::thread, mutex, lock_guard, condition_variable, async/future, and thread pool patterns.', xp:400},
      {title:'Design Patterns in C++', icon:'🏗️', lang:'cpp', desc:'Singleton, Factory, Observer, Strategy, Decorator patterns implemented in modern C++.', xp:350},
      {title:'Competitive Programming', icon:'🏆', lang:'cpp', desc:'Fast I/O, bitwise tricks, modular arithmetic, GCD/LCM, sieve of Eratosthenes, segment trees.', xp:450},
      {title:'File I/O & Serialization', icon:'📂', lang:'cpp', desc:'fstream, ifstream, ofstream, binary files, stringstream, and JSON/CSV serialization.', xp:250},
      {title:'Game Dev Intro with SFML', icon:'🎮', lang:'cpp', desc:'Install SFML, create game window, render sprites, handle keyboard events, and build Pong.', xp:400},
    ],
    c: [
      {title:'C Introduction & Setup', icon:'🔵', lang:'c', desc:'Install GCC, understand C program structure, compilation, linking, and running your first C program.', xp:150},
      {title:'Variables, Data Types & I/O', icon:'📦', lang:'c', desc:'int, char, float, double, unsigned, printf, scanf, format specifiers, and type sizes.', xp:200},
      {title:'Operators & Expressions', icon:'➕', lang:'c', desc:'Arithmetic, relational, logical, bitwise, increment/decrement, precedence, and type casting.', xp:200},
      {title:'Control Flow', icon:'🔀', lang:'c', desc:'if/else, switch, for, while, do-while, break, continue, goto, and nested control structures.', xp:200},
      {title:'Arrays & Strings', icon:'📊', lang:'c', desc:'1D/2D arrays, string.h functions (strlen, strcpy, strcat, strcmp), char arrays, and null terminator.', xp:200},
      {title:'Functions & Scope', icon:'🔧', lang:'c', desc:'Function declaration, definition, parameters, return types, call by value, recursion, and scope.', xp:200},
      {title:'Pointers', icon:'👉', lang:'c', desc:'Pointer declaration, dereferencing, pointer arithmetic, pointer to array, pointer to pointer, NULL.', xp:300},
      {title:'Structures & Unions', icon:'🏗️', lang:'c', desc:'struct keyword, nested structs, typedef, union, enum, bit fields, and struct pointers.', xp:250},
      {title:'Dynamic Memory Allocation', icon:'💾', lang:'c', desc:'malloc, calloc, realloc, free, memory leaks, and dynamic arrays and linked lists.', xp:300},
      {title:'File Handling in C', icon:'📂', lang:'c', desc:'fopen, fclose, fread, fwrite, fprintf, fscanf, fseek, fgetc, fgets, binary vs text mode.', xp:250},
      {title:'Data Structures in C', icon:'🌳', lang:'c', desc:'Implement stack, queue, linked list, binary tree, and hash table using structs and pointers.', xp:350},
      {title:'Mini Projects', icon:'🏆', lang:'c', desc:'Build a student records system, a simple calculator, a file-based contact book, and a mini shell.', xp:500},
    ],
    js: [
      {title:'JavaScript Introduction', icon:'💛', lang:'javascript', desc:'History of JS, how browsers run JS, console, variables (var/let/const), and the REPL environment.', xp:150},
      {title:'Data Types & Operators', icon:'📦', lang:'javascript', desc:'String, number, boolean, null, undefined, symbol, object. Coercion, typeof, equality.', xp:200},
      {title:'Control Flow & Loops', icon:'🔀', lang:'javascript', desc:'if/else, switch, for, while, do-while, for-of, for-in, break, continue, and loop patterns.', xp:200},
      {title:'Functions & Scope', icon:'🔧', lang:'javascript', desc:'Function declaration, expression, arrow functions, IIFE, closure, hoisting, and lexical scope.', xp:250},
      {title:'DOM Manipulation', icon:'🖱️', lang:'javascript', desc:'querySelector, createElement, classList, innerHTML, event listeners, and the event loop.', xp:250},
      {title:'Events & Forms', icon:'📋', lang:'javascript', desc:'Click, input, submit, keyboard, mouse events, event delegation, and form validation.', xp:200},
      {title:'Asynchronous JavaScript', icon:'⏳', lang:'javascript', desc:'setTimeout, setInterval, callbacks, callback hell, and understanding the event loop deeply.', xp:300},
      {title:'Promises & Async/Await', icon:'✅', lang:'javascript', desc:'Promise states, .then/.catch/.finally, Promise.all, Promise.race, async/await error handling.', xp:300},
      {title:'Fetch API & REST', icon:'🌐', lang:'javascript', desc:'fetch(), GET/POST/PUT/DELETE, headers, JSON.parse, error handling, and CORS basics.', xp:250},
      {title:'ES6+ Features', icon:'⚡', lang:'javascript', desc:'Destructuring, spread/rest, optional chaining, nullish coalescing, modules, Map, Set, WeakMap.', xp:300},
      {title:'Object-Oriented JS', icon:'🏛️', lang:'javascript', desc:'Prototypes, prototype chain, class syntax, extends, super, getters/setters, and mixins.', xp:300},
      {title:'Capstone Projects', icon:'🏆', lang:'javascript', desc:'Build a weather app, a todo app with localStorage, a quiz game, and a REST client dashboard.', xp:500},
    ],
  };

  let moduleIdMap = {}; // roadmapId -> [{module_id, ...}]

  for (const [rmId, modules] of Object.entries(moduleData)) {
    moduleIdMap[rmId] = [];
    for (let i = 0; i < modules.length; i++) {
      const m = modules[i];
      const [res] = await conn.query(
        `INSERT INTO roadmap_modules (roadmap_id, title, description, order_index, xp_reward, icon, language)
         VALUES (?,?,?,?,?,?,?)`,
        [rmId, m.title, m.desc, i+1, m.xp, m.icon, m.lang]
      );
      moduleIdMap[rmId].push({ id: res.insertId, title: m.title, lang: m.lang, roadmap: rmId });
    }
    console.log(`  ✓ ${rmId}: ${modules.length} modules`);
  }

  // Update roadmap lesson_count
  for (const rmId of Object.keys(moduleData)) {
    const count = moduleIdMap[rmId].length;
    await conn.query('UPDATE roadmaps SET lesson_count=? WHERE id=?', [count, rmId]).catch(()=>{});
  }

  // ─────────────────────────────────────────────
  // PHASE 4: Seed lesson_videos (2-4 per module)
  // ─────────────────────────────────────────────
  console.log('\n🎬 Seeding lesson videos...');

  const videoBank = {
    html: [
      {title:'HTML Full Course for Beginners', channel:'freeCodeCamp', vid:'pQN-pnXPaVg', dur:'2h 12m'},
      {title:'HTML Tutorial — W3Schools', channel:'Traversy Media', vid:'UB1O30fR-EE', dur:'1h 30m'},
      {title:'Learn HTML in 1 Hour', channel:'Bro Code', vid:'HD13eq_Pei8', dur:'1h 2m'},
    ],
    css: [
      {title:'CSS Full Course for Beginners', channel:'freeCodeCamp', vid:'OXGznpKZ_sA', dur:'11h 0m'},
      {title:'CSS Crash Course', channel:'Traversy Media', vid:'yfoY53QXEnI', dur:'1h 25m'},
      {title:'CSS Flexbox in 100 Seconds', channel:'Fireship', vid:'K74l26pE4YA', dur:'1m 40s'},
    ],
    javascript: [
      {title:'JavaScript Full Course', channel:'freeCodeCamp', vid:'PkZNo7MFNFg', dur:'3h 26m'},
      {title:'JavaScript Crash Course', channel:'Traversy Media', vid:'hdI2bqOjy3c', dur:'1h 40m'},
      {title:'Modern JavaScript Tutorial', channel:'The Coding Train', vid:'8dWL3wB7Hok', dur:'45m'},
      {title:'JavaScript in 100 Seconds', channel:'Fireship', vid:'DHjqpvDnNGE', dur:'1m 40s'},
    ],
    python: [
      {title:'Python Full Course for Beginners', channel:'freeCodeCamp', vid:'rfscVS0vtbw', dur:'4h 21m'},
      {title:'Python Tutorial - Python for Beginners', channel:'Programming with Mosh', vid:'_uQrJ0TkZlc', dur:'6h 14m'},
      {title:'Python Crash Course', channel:'Traversy Media', vid:'JJmcL1N2KQs', dur:'1h 31m'},
      {title:'Python in 100 Seconds', channel:'Fireship', vid:'x7X9w_GIm1s', dur:'1m 40s'},
    ],
    java: [
      {title:'Java Full Course', channel:'freeCodeCamp', vid:'A74TOX803D0', dur:'9h 34m'},
      {title:'Java Tutorial for Beginners', channel:'Programming with Mosh', vid:'eIrMbAQSU34', dur:'2h 30m'},
      {title:'Spring Boot Full Course', channel:'Amigoscode', vid:'9SGDpanrc8U', dur:'3h 0m'},
    ],
    sql: [
      {title:'SQL Full Course', channel:'freeCodeCamp', vid:'HXV3zeQKqGY', dur:'4h 20m'},
      {title:'MySQL Crash Course', channel:'Traversy Media', vid:'9ylj9NR0Lcg', dur:'1h 35m'},
      {title:'SQL Tutorial - Full Database Course', channel:'freeCodeCamp', vid:'p3qvj9hO_Bo', dur:'4h 20m'},
    ],
    cpp: [
      {title:'C++ Full Course', channel:'freeCodeCamp', vid:'8jLOx1hD3_o', dur:'31h 0m'},
      {title:'C++ Tutorial for Beginners', channel:'Programming with Mosh', vid:'ZzaPdXTrM_8', dur:'1h 0m'},
      {title:'C++ STL Tutorial', channel:'Striver', vid:'LyGlTmaWEPs', dur:'2h 30m'},
    ],
    c: [
      {title:'C Programming Full Course', channel:'freeCodeCamp', vid:'KJgsSFOSQv0', dur:'3h 46m'},
      {title:'C Programming Tutorial', channel:'Programming with Mosh', vid:'Bz4MxDeEM6k', dur:'3h 46m'},
      {title:'Pointers in C', channel:'mycodeschool', vid:'h-HBipu_1P0', dur:'45m'},
    ],
    dsa: [
      {title:'Data Structures Full Course', channel:'freeCodeCamp', vid:'pkYVOmU3MgA', dur:'8h 11m'},
      {title:'Algorithms Full Course', channel:'freeCodeCamp', vid:'8hly31xKli0', dur:'2h 22m'},
      {title:'DSA with JavaScript', channel:'Kunal Kushwaha', vid:'RBSGKlAvoiM', dur:'8h 0m'},
    ],
    ml: [
      {title:'Machine Learning Full Course', channel:'freeCodeCamp', vid:'NWONeJKn6kc', dur:'9h 52m'},
      {title:'ML Course by Andrew Ng', channel:'Stanford', vid:'4b4MUYve_U8', dur:'3h 0m'},
      {title:'TensorFlow 2.0 Complete Course', channel:'freeCodeCamp', vid:'tPYj3fFJGjk', dur:'7h 11m'},
    ],
    ai: [
      {title:'LangChain Full Course', channel:'freeCodeCamp', vid:'HSZ_uaif57o', dur:'2h 11m'},
      {title:'AI for Everyone by Andrew Ng', channel:'DeepLearning.AI', vid:'FiXvgOkFNGg', dur:'5h 0m'},
      {title:'Transformers Explained', channel:'3Blue1Brown', vid:'wjZofJX0v4M', dur:'26m'},
      {title:'RAG from Scratch', channel:'LangChain', vid:'sVcwVQRHIc8', dur:'1h 0m'},
    ],
  };

  for (const [rmId, modules] of Object.entries(moduleIdMap)) {
    for (const mod of modules) {
      const pool = videoBank[mod.lang] || videoBank.javascript;
      const picks = pool.slice(0, Math.min(3, pool.length));
      for (const v of picks) {
        await conn.query(
          `INSERT INTO lesson_videos (module_id, title, channel, video_id, embed_url, thumbnail, duration)
           VALUES (?,?,?,?,?,?,?)`,
          [mod.id, v.title, v.channel, v.vid,
           `https://www.youtube.com/embed/${v.vid}`,
           `https://img.youtube.com/vi/${v.vid}/hqdefault.jpg`,
           v.dur]
        );
      }
    }
  }
  console.log('  ✓ Videos seeded for all modules');

  // ─────────────────────────────────────────────
  // PHASE 5: Seed lesson_resources
  // ─────────────────────────────────────────────
  console.log('\n📎 Seeding lesson resources...');

  const resourceBank = {
    html:       [{title:'MDN HTML Reference', url:'https://developer.mozilla.org/en-US/docs/Web/HTML', type:'docs'}, {title:'W3Schools HTML', url:'https://www.w3schools.com/html/', type:'tutorial'}, {title:'HTML Living Standard', url:'https://html.spec.whatwg.org/', type:'spec'}],
    css:        [{title:'MDN CSS Reference', url:'https://developer.mozilla.org/en-US/docs/Web/CSS', type:'docs'}, {title:'CSS-Tricks', url:'https://css-tricks.com/', type:'tutorial'}, {title:'Kevin Powell CSS', url:'https://www.youtube.com/@KevinPowell', type:'video'}],
    javascript: [{title:'MDN JavaScript Guide', url:'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', type:'docs'}, {title:'JavaScript.info', url:'https://javascript.info/', type:'tutorial'}, {title:'ES6 Features', url:'https://es6-features.org/', type:'reference'}],
    python:     [{title:'Python Official Docs', url:'https://docs.python.org/3/', type:'docs'}, {title:'Real Python Tutorials', url:'https://realpython.com/', type:'tutorial'}, {title:'Python Cheatsheet', url:'https://www.pythoncheatsheet.org/', type:'reference'}],
    java:       [{title:'Oracle Java Docs', url:'https://docs.oracle.com/en/java/', type:'docs'}, {title:'Baeldung Java Guides', url:'https://www.baeldung.com/', type:'tutorial'}, {title:'Spring Boot Docs', url:'https://spring.io/projects/spring-boot', type:'docs'}],
    sql:        [{title:'MySQL Official Docs', url:'https://dev.mysql.com/doc/', type:'docs'}, {title:'SQLZoo Practice', url:'https://sqlzoo.net/', type:'practice'}, {title:'Mode SQL Tutorial', url:'https://mode.com/sql-tutorial/', type:'tutorial'}],
    cpp:        [{title:'cppreference.com', url:'https://en.cppreference.com/w/', type:'docs'}, {title:'Learn C++', url:'https://www.learncpp.com/', type:'tutorial'}, {title:'C++ Core Guidelines', url:'https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines', type:'reference'}],
    c:          [{title:'C Standard Library', url:'https://en.cppreference.com/w/c', type:'docs'}, {title:'Learn-C.org', url:'https://www.learn-c.org/', type:'tutorial'}, {title:'GNU C Manual', url:'https://www.gnu.org/software/gnu-c-manual/', type:'docs'}],
    dsa:        [{title:'Visualgo', url:'https://visualgo.net/', type:'tool'}, {title:'CLRS Algorithms Book', url:'https://mitpress.mit.edu/9780262046305/', type:'book'}, {title:'LeetCode Problems', url:'https://leetcode.com/', type:'practice'}],
    ml:         [{title:'Scikit-learn Docs', url:'https://scikit-learn.org/stable/', type:'docs'}, {title:'TensorFlow Guides', url:'https://www.tensorflow.org/guide', type:'docs'}, {title:'Kaggle Learn', url:'https://www.kaggle.com/learn', type:'practice'}],
    ai:         [{title:'LangChain Docs', url:'https://python.langchain.com/docs/', type:'docs'}, {title:'OpenAI API Reference', url:'https://platform.openai.com/docs/', type:'docs'}, {title:'Hugging Face Hub', url:'https://huggingface.co/', type:'tool'}],
  };

  for (const [rmId, modules] of Object.entries(moduleIdMap)) {
    for (const mod of modules) {
      const pool = resourceBank[mod.lang] || resourceBank.javascript;
      for (const r of pool) {
        await conn.query(
          `INSERT INTO lesson_resources (module_id, title, url, type) VALUES (?,?,?,?)`,
          [mod.id, r.title, r.url, r.type]
        );
      }
    }
  }
  console.log('  ✓ Resources seeded for all modules');

  // ─────────────────────────────────────────────
  // PHASE 6: Seed lesson_exercises
  // ─────────────────────────────────────────────
  console.log('\n💪 Seeding exercises...');

  const exerciseTemplates = {
    javascript: [
      ['Print numbers 1 to 100', 'Write a loop that prints 1 to 100. Use FizzBuzz rules.', 'Easy', 'for(let i=1;i<=100;i++){console.log(i%15===0?"FizzBuzz":i%3===0?"Fizz":i%5===0?"Buzz":i);}'],
      ['Reverse a string', 'Write a function that reverses a given string.', 'Easy', 'function reverse(s){return s.split("").reverse().join("");}'],
      ['Check if palindrome', 'Write a function isPalindrome(s) that returns true/false.', 'Easy', 'function isPalindrome(s){const r=s.split("").reverse().join("");return s===r;}'],
      ['Find largest in array', 'Write a function to find the maximum element in an array.', 'Easy', 'function maxEl(arr){return Math.max(...arr);}'],
      ['Count vowels in string', 'Count total vowels in a given string.', 'Easy', 'function countVowels(s){return (s.match(/[aeiou]/gi)||[]).length;}'],
      ['Fibonacci sequence', 'Generate the first N Fibonacci numbers.', 'Medium', 'function fib(n){let a=0,b=1,r=[];for(let i=0;i<n;i++){r.push(a);[a,b]=[b,a+b];}return r;}'],
      ['Binary search', 'Implement binary search on a sorted array.', 'Medium', 'function bs(arr,t){let l=0,r=arr.length-1;while(l<=r){const m=(l+r)>>1;if(arr[m]===t)return m;arr[m]<t?l=m+1:r=m-1;}return -1;}'],
    ],
    python: [
      ['Hello World variations', 'Print "Hello, World!" 5 different ways using Python.', 'Easy', 'print("Hello, World!")\nfor _ in range(5): print("Hello, World!")'],
      ['List comprehension', 'Create a list of squares from 1 to 10 using list comprehension.', 'Easy', 'squares = [x**2 for x in range(1, 11)]\nprint(squares)'],
      ['String reversal', 'Write a function to reverse a string without using slicing.', 'Easy', 'def reverse(s):\n    return "".join(reversed(s))'],
      ['Count word frequency', 'Count how many times each word appears in a sentence.', 'Medium', 'from collections import Counter\ndef word_freq(text):\n    return Counter(text.split())'],
      ['Fibonacci generator', 'Write a generator function for Fibonacci numbers.', 'Medium', 'def fib():\n    a,b=0,1\n    while True:\n        yield a\n        a,b=b,a+b'],
    ],
    java: [
      ['Hello World', 'Write a Java program to print Hello World.', 'Easy', 'public class Main{\n    public static void main(String[] args){\n        System.out.println("Hello, World!");\n    }\n}'],
      ['Sum of array', 'Write a program to find the sum of all elements in an int array.', 'Easy', 'int[] arr = {1,2,3,4,5};\nint sum = 0;\nfor(int n : arr) sum += n;\nSystem.out.println(sum);'],
      ['Palindrome check', 'Check if a given String is a palindrome.', 'Easy', 'String s = "racecar";\nString rev = new StringBuilder(s).reverse().toString();\nSystem.out.println(s.equals(rev));'],
    ],
    sql: [
      ['Select all rows', 'Write a query to select all rows from a users table.', 'Easy', 'SELECT * FROM users;'],
      ['Filter by condition', 'Select users where age > 18 and country = "India".', 'Easy', 'SELECT * FROM users WHERE age > 18 AND country = "India";'],
      ['Count and group', 'Count users per country, order by count descending.', 'Medium', 'SELECT country, COUNT(*) AS cnt FROM users GROUP BY country ORDER BY cnt DESC;'],
      ['JOIN two tables', 'Get all orders with customer names using INNER JOIN.', 'Medium', 'SELECT o.id, c.name, o.total\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.id;'],
    ],
    c: [
      ['Hello World', 'Write a C program to print Hello World.', 'Easy', '#include<stdio.h>\nint main(){\n    printf("Hello, World!\\n");\n    return 0;\n}'],
      ['Sum of digits', 'Write a C program to find sum of digits of a number.', 'Easy', '#include<stdio.h>\nint main(){\n    int n=1234,s=0;\n    while(n>0){s+=n%10;n/=10;}\n    printf("%d",s);\n}'],
      ['Pointer basics', 'Demonstrate pointer declaration and dereferencing in C.', 'Medium', '#include<stdio.h>\nint main(){\n    int x=10;\n    int *p=&x;\n    printf("val:%d addr:%p",*p,p);\n}'],
    ],
    cpp: [
      ['Vector operations', 'Create a vector, push elements, sort, and print.', 'Easy', '#include<iostream>\n#include<vector>\n#include<algorithm>\nusing namespace std;\nint main(){\n    vector<int> v={5,1,3,2,4};\n    sort(v.begin(),v.end());\n    for(auto x:v) cout<<x<<" ";\n}'],
      ['Class with constructor', 'Create a Person class with name and age, print details.', 'Easy', '#include<iostream>\nusing namespace std;\nclass Person{\npublic:\n    string name;int age;\n    Person(string n,int a):name(n),age(a){}\n    void print(){cout<<name<<" "<<age;}\n};\nint main(){Person p("Alice",25);p.print();}'],
    ],
    dsa: [
      ['Reverse an array', 'Reverse an array in place without extra space.', 'Easy', 'function reverseArray(arr){let l=0,r=arr.length-1;while(l<r){[arr[l],arr[r]]=[arr[r],arr[l]];l++;r--;}return arr;}'],
      ['Check balanced parentheses', 'Check if parentheses in a string are balanced using a stack.', 'Medium', 'function isBalanced(s){const stack=[];for(const c of s){if("({[".includes(c))stack.push(c);else if("]})".includes(c)){const m={")";"(","}";"{"," ]":"["};if(stack.pop()!==m[c])return false;}}return stack.length===0;}'],
      ['Find middle of linked list', 'Find the middle element of a linked list using slow/fast pointer.', 'Medium', '// Slow-fast pointer approach\nlet slow=head,fast=head;\nwhile(fast&&fast.next){slow=slow.next;fast=fast.next.next;}\n// slow is now at middle'],
    ],
    ml: [
      ['Load and explore dataset', 'Load iris dataset with pandas and print first 5 rows.', 'Easy', 'from sklearn.datasets import load_iris\nimport pandas as pd\ndf=pd.DataFrame(load_iris().data,columns=load_iris().feature_names)\nprint(df.head())'],
      ['Train a classifier', 'Train a decision tree on iris and print accuracy.', 'Medium', 'from sklearn.tree import DecisionTreeClassifier\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nX,y=load_iris(return_X_y=True)\nXt,Xv,yt,yv=train_test_split(X,y,test_size=0.2)\nclf=DecisionTreeClassifier().fit(Xt,yt)\nprint(clf.score(Xv,yv))'],
    ],
    ai: [
      ['Call OpenAI API', 'Make a basic chat completion call to OpenAI API.', 'Easy', 'from openai import OpenAI\nclient=OpenAI()\nresponse=client.chat.completions.create(model="gpt-3.5-turbo",messages=[{"role":"user","content":"Hello!"}])\nprint(response.choices[0].message.content)'],
      ['Create embeddings', 'Create text embeddings using OpenAI embeddings API.', 'Medium', 'from openai import OpenAI\nclient=OpenAI()\nresponse=client.embeddings.create(input="Hello world",model="text-embedding-3-small")\nprint(len(response.data[0].embedding))'],
    ],
  };

  for (const [rmId, modules] of Object.entries(moduleIdMap)) {
    for (const mod of modules) {
      const pool = exerciseTemplates[mod.lang] || exerciseTemplates.javascript;
      for (let i=0; i<Math.min(pool.length, 5); i++) {
        const [etitle, edesc, ediff, ecode] = pool[i];
        await conn.query(
          `INSERT INTO lesson_exercises (module_id, title, description, difficulty, starter_code, order_index)
           VALUES (?,?,?,?,?,?)`,
          [mod.id, etitle, edesc, ediff, ecode, i+1]
        );
      }
    }
  }
  console.log('  ✓ Exercises seeded for all modules');

  // ─────────────────────────────────────────────
  // PHASE 7: Seed lesson_challenges
  // ─────────────────────────────────────────────
  console.log('\n⚡ Seeding challenges...');

  const challengeBank = {
    javascript: {title:'Build a Mini Calculator', desc:'Create a calculator function that takes two numbers and an operator (+, -, *, /) and returns the result. Handle division by zero.', code:'function calculate(a, b, op) {\n  // Your code here\n  switch(op) {\n    case "+": return a + b;\n    case "-": return a - b;\n    case "*": return a * b;\n    case "/": return b !== 0 ? a / b : "Error: Division by zero";\n    default: return "Invalid operator";\n  }\n}\nconsole.log(calculate(10, 5, "+"));\nconsole.log(calculate(10, 0, "/"));'},
    python: {title:'Word Frequency Counter', desc:'Write a function that takes a paragraph and returns a dictionary of the top 5 most frequent words, excluding common stop words.', code:'from collections import Counter\n\ndef top_words(text, n=5):\n    stop = {"the","a","an","is","it","in","on","at","to","for","of","and","or"}\n    words = [w.lower().strip(".,!?") for w in text.split() if w.lower() not in stop]\n    return dict(Counter(words).most_common(n))\n\ntext = "Python is great and Python is easy to learn. Python programming is fun."\nprint(top_words(text))'},
    java: {title:'Implement a Stack', desc:'Implement a generic Stack class in Java with push, pop, peek, isEmpty, and size methods.', code:'import java.util.*;\npublic class MyStack<T> {\n    private ArrayList<T> items = new ArrayList<>();\n    public void push(T item) { items.add(item); }\n    public T pop() { if(isEmpty()) throw new EmptyStackException(); return items.remove(items.size()-1); }\n    public T peek() { if(isEmpty()) throw new EmptyStackException(); return items.get(items.size()-1); }\n    public boolean isEmpty() { return items.isEmpty(); }\n    public int size() { return items.size(); }\n    public static void main(String[] args) {\n        MyStack<Integer> s = new MyStack<>();\n        s.push(1); s.push(2); s.push(3);\n        System.out.println(s.pop());\n        System.out.println(s.peek());\n    }\n}'},
    sql: {title:'Sales Analytics Query', desc:'Given orders table (id, product, quantity, price, date), write a query to find the top 3 products by total revenue this month.', code:'-- Sales Analytics Challenge\nSELECT \n    product,\n    SUM(quantity * price) AS total_revenue,\n    SUM(quantity) AS units_sold\nFROM orders\nWHERE MONTH(date) = MONTH(CURDATE())\n  AND YEAR(date) = YEAR(CURDATE())\nGROUP BY product\nORDER BY total_revenue DESC\nLIMIT 3;'},
    c: {title:'Implement Linked List in C', desc:'Implement a singly linked list in C with insert, delete, and print operations.', code:'#include<stdio.h>\n#include<stdlib.h>\nstruct Node { int data; struct Node* next; };\nvoid insert(struct Node** head, int val) {\n    struct Node* n = malloc(sizeof(struct Node));\n    n->data = val; n->next = *head; *head = n;\n}\nvoid printList(struct Node* head) {\n    while(head){printf("%d->",head->data);head=head->next;}\n    printf("NULL\\n");\n}\nint main() {\n    struct Node* head = NULL;\n    insert(&head,3); insert(&head,2); insert(&head,1);\n    printList(head);\n}'},
    cpp: {title:'Generic Stack with STL', desc:'Create a templated Stack class using std::deque. Implement push, pop, top, empty, size.', code:'#include<iostream>\n#include<deque>\nusing namespace std;\ntemplate<typename T>\nclass Stack {\n    deque<T> d;\npublic:\n    void push(T x){d.push_back(x);}\n    void pop(){if(!d.empty())d.pop_back();}\n    T top(){return d.back();}\n    bool empty(){return d.empty();}\n    int size(){return d.size();}\n};\nint main(){\n    Stack<int> s;\n    s.push(1);s.push(2);s.push(3);\n    cout<<s.top()<<endl;\n    s.pop();\n    cout<<s.top()<<endl;\n}'},
    dsa: {title:'Two Sum Problem', desc:'Given an array of integers and a target, return indices of two numbers that add up to target. Use O(n) approach with hash map.', code:'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}\nconsole.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]\nconsole.log(twoSum([3, 2, 4], 6));       // [1, 2]'},
    ml: {title:'Train Your First Model', desc:'Load the iris dataset, split into train/test, train a Random Forest classifier, and print accuracy, precision, and recall.', code:'from sklearn.datasets import load_iris\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score, classification_report\n\nX, y = load_iris(return_X_y=True)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\nclf = RandomForestClassifier(n_estimators=100, random_state=42)\nclf.fit(X_train, y_train)\ny_pred = clf.predict(X_test)\n\nprint(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")\nprint(classification_report(y_test, y_pred, target_names=load_iris().target_names))'},
    ai: {title:'Build a Simple Chatbot', desc:'Create a simple chatbot using OpenAI API that maintains conversation history and responds to user messages.', code:'from openai import OpenAI\nclient = OpenAI()\nhistory = [{"role":"system","content":"You are a helpful AI tutor for EduNet learning platform."}]\n\ndef chat(message):\n    history.append({"role":"user","content":message})\n    res = client.chat.completions.create(model="gpt-3.5-turbo", messages=history)\n    reply = res.choices[0].message.content\n    history.append({"role":"assistant","content":reply})\n    return reply\n\nprint(chat("What is machine learning?"))\nprint(chat("Give me a simple example."))'},
  };

  for (const [rmId, modules] of Object.entries(moduleIdMap)) {
    for (const mod of modules) {
      const ch = challengeBank[mod.lang] || challengeBank.javascript;
      await conn.query(
        `INSERT INTO lesson_challenges (module_id, title, description, starter_code, language, xp_reward)
         VALUES (?,?,?,?,?,?)`,
        [mod.id, ch.title, ch.desc, ch.code, mod.lang, 150]
      );
    }
  }
  console.log('  ✓ Challenges seeded for all modules');

  // ─────────────────────────────────────────────
  // PHASE 8: Seed lesson_quizzes (7 per module)
  // ─────────────────────────────────────────────
  console.log('\n❓ Seeding quizzes...');

  const quizBank = {
    webdev: [
      ['What does HTML stand for?', 'Hyper Text Markup Language', 'High Tech Modern Language', 'Hyperlink Text Markup Language', 'Home Tool Markup Language', 'A', 'HTML = HyperText Markup Language'],
      ['Which CSS property makes text bold?', 'font-style:bold', 'font-weight:bold', 'text-weight:bold', 'bold:true', 'B', 'font-weight:bold makes text bold'],
      ['What is the correct syntax for a JS function?', 'function = myFunc()', 'function myFunc()', 'def myFunc():', 'func myFunc()', 'B', 'JavaScript uses the function keyword'],
      ['Which HTML tag creates a hyperlink?', '<link>', '<a>', '<href>', '<url>', 'B', '<a href="..."> creates a hyperlink'],
      ['What does CSS stand for?', 'Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets', 'C', 'CSS = Cascading Style Sheets'],
      ['Which method adds an element to the end of an array in JS?', 'push()', 'append()', 'add()', 'insert()', 'A', 'Array.push() adds to end'],
      ['What is the HTTP status code for "Not Found"?', '200', '301', '404', '500', 'C', '404 = Resource Not Found'],
    ],
    python: [
      ['What keyword defines a function in Python?', 'func', 'def', 'function', 'fn', 'B', 'def keyword is used to define functions'],
      ['What is the output of len("Hello")?', '4', '5', '6', 'Error', 'B', 'len("Hello") returns 5 characters'],
      ['What does PEP 8 define?', 'Python runtime', 'Code style guide', 'Import system', 'Test runner', 'B', 'PEP 8 is the Python style guide'],
      ['What is a list comprehension?', 'A type of list', 'Creating lists concisely using inline loops', 'A list sorting method', 'A built-in function', 'B', 'List comprehension creates lists in one line'],
      ['What does yield do in Python?', 'Returns and exits', 'Pauses and returns a generator value', 'Imports a module', 'Defines a class', 'B', 'yield creates a generator function'],
      ['Which data structure uses LIFO?', 'Queue', 'Stack', 'Deque', 'Priority Queue', 'B', 'Stack follows Last In First Out'],
      ['What is a Python decorator?', 'HTML template', 'Function that wraps another function', 'A CSS class', 'A built-in type', 'B', 'Decorators modify function behavior'],
    ],
    java: [
      ['What is the entry point of a Java program?', 'start()', 'main()', 'init()', 'run()', 'B', 'public static void main(String[] args) is the entry point'],
      ['Which keyword prevents a variable from being reassigned?', 'static', 'final', 'const', 'fixed', 'B', 'final makes a variable constant'],
      ['What is autoboxing in Java?', 'Automatic GUI creation', 'Auto-converting primitives to wrapper classes', 'Memory allocation', 'Thread pooling', 'B', 'Autoboxing converts int to Integer automatically'],
      ['What does the equals() method compare?', 'Object references', 'Object content/values', 'Memory addresses', 'Type only', 'B', 'equals() compares object content'],
      ['What is the difference between == and equals() for Strings?', 'No difference', '== compares reference, equals() compares value', 'equals() is faster', 'Both compare values', 'B', '== checks if same object, equals() checks value'],
      ['What is the purpose of the interface keyword?', 'Creating objects', 'Defining a contract with abstract methods', 'Importing packages', 'Creating threads', 'B', 'Interface defines a contract'],
      ['Which collection maintains insertion order?', 'HashSet', 'TreeSet', 'LinkedList', 'HashMap', 'C', 'LinkedList maintains insertion order'],
    ],
    dsa: [
      ['What is the time complexity of binary search?', 'O(n)', 'O(log n)', 'O(n²)', 'O(1)', 'B', 'Binary search halves the search space each time'],
      ['Which data structure uses FIFO ordering?', 'Stack', 'Queue', 'Tree', 'Heap', 'B', 'Queue = First In First Out'],
      ['What is a balanced BST height for n nodes?', 'O(n)', 'O(n²)', 'O(log n)', 'O(1)', 'C', 'A balanced BST has O(log n) height'],
      ['Which algorithm finds the shortest path in a weighted graph?', 'BFS', 'DFS', 'Dijkstra', 'Prim', 'C', 'Dijkstra finds shortest paths'],
      ['What is dynamic programming based on?', 'Greedy choices', 'Optimal substructure and overlapping subproblems', 'Divide and conquer only', 'Random search', 'B', 'DP uses memoization of subproblems'],
      ['What is the worst-case time of quicksort?', 'O(n log n)', 'O(n)', 'O(n²)', 'O(log n)', 'C', 'QuickSort degrades to O(n²) with bad pivots'],
      ['What data structure is used in BFS?', 'Stack', 'Queue', 'Heap', 'Tree', 'B', 'BFS uses a Queue for level-order traversal'],
    ],
    ml: [
      ['What is supervised learning?', 'Learning without labels', 'Learning with labeled training data', 'Reinforcement learning', 'Transfer learning', 'B', 'Supervised = learning from labeled examples'],
      ['What is overfitting?', 'Poor performance on training', 'Good training, poor test performance', 'Underfitting', 'Missing data', 'B', 'Overfitting = model memorizes training data'],
      ['What does gradient descent minimize?', 'Data size', 'The loss/cost function', 'Number of features', 'Epochs', 'B', 'Gradient descent finds minimum of loss function'],
      ['What is a confusion matrix?', 'Sorting algorithm', 'Table of prediction vs actual class results', 'Loss function', 'Normalization technique', 'B', 'Confusion matrix shows TP, TN, FP, FN'],
      ['What is regularization?', 'Adding more data', 'Penalizing model complexity to prevent overfitting', 'A type of activation', 'Data normalization', 'B', 'L1/L2 regularization reduces overfitting'],
      ['What activation function outputs values between 0 and 1?', 'ReLU', 'Sigmoid', 'Tanh', 'Linear', 'B', 'Sigmoid outputs between 0 and 1'],
      ['What is cross-validation?', 'Testing on training data', 'Evaluating model on multiple data splits', 'A type of regularization', 'Feature selection', 'B', 'Cross-validation uses k-folds for robust evaluation'],
    ],
    sql: [
      ['What does SELECT * mean?', 'Select first column', 'Select all columns', 'Delete all rows', 'Select nothing', 'B', '* is a wildcard for all columns'],
      ['What is a PRIMARY KEY?', 'Can be NULL', 'Uniquely identifies each row', 'A foreign key', 'An optional index', 'B', 'PRIMARY KEY uniquely identifies each row'],
      ['What is the difference between WHERE and HAVING?', 'No difference', 'WHERE filters rows, HAVING filters groups', 'HAVING is older', 'WHERE works with GROUP BY', 'B', 'WHERE before GROUP BY, HAVING after'],
      ['What does INNER JOIN do?', 'Returns all rows', 'Returns matching rows from both tables', 'Returns left table only', 'Deletes duplicates', 'B', 'INNER JOIN = only matching rows'],
      ['What is an index?', 'A backup copy', 'A data structure that speeds up queries', 'A constraint', 'A stored procedure', 'B', 'Indexes speed up SELECT queries'],
      ['What are ACID properties?', 'Algorithm, Cache, Index, Data', 'Atomicity, Consistency, Isolation, Durability', 'Add, Create, Insert, Delete', 'None of the above', 'B', 'ACID ensures reliable transactions'],
      ['What does GROUP BY do?', 'Sorts alphabetically', 'Groups rows with same value for aggregation', 'Joins tables', 'Filters rows', 'B', 'GROUP BY groups rows for aggregate functions'],
    ],
    cpp: [
      ['What is a pointer in C++?', 'A variable holding a value', 'A variable holding a memory address', 'A function reference', 'A class object', 'B', 'Pointer stores memory address of another variable'],
      ['What does STL stand for?', 'Standard Template Library', 'Static Type Library', 'String Template Language', 'Structured Type List', 'A', 'STL = Standard Template Library'],
      ['What is RAII?', 'Runtime AI Interface', 'Resource Acquisition Is Initialization', 'Recursive Array Index Interface', 'None', 'B', 'RAII ties resource lifetime to object lifetime'],
      ['What is a virtual function?', 'A static method', 'A function overridden in derived classes at runtime', 'An abstract class', 'A template function', 'B', 'virtual enables runtime polymorphism'],
      ['What does unique_ptr guarantee?', 'Shared ownership', 'Exclusive ownership, auto-deletes', 'Weak ownership', 'No ownership', 'B', 'unique_ptr = exclusive ownership, RAII'],
      ['What is the difference between struct and class in C++?', 'No difference', 'struct has public members by default, class has private', 'struct cannot have methods', 'class has no constructor', 'B', 'Only default access modifier differs'],
      ['What is move semantics?', 'Copying resources', 'Transferring ownership instead of copying', 'Thread movement', 'Memory mapping', 'B', 'Move semantics avoids expensive deep copies'],
    ],
    c: [
      ['What is a pointer in C?', 'A variable storing a value', 'A variable storing a memory address', 'A function', 'An array', 'B', 'Pointer holds address of another variable'],
      ['What does malloc() do?', 'Frees memory', 'Allocates memory dynamically on heap', 'Declares an array', 'Initializes memory to zero', 'B', 'malloc allocates dynamic memory'],
      ['What is a segmentation fault?', 'Compilation error', 'Accessing invalid memory location', 'Logic error', 'Stack overflow', 'B', 'Segfault = unauthorized memory access'],
      ['What does sizeof() return?', 'Value of variable', 'Size in bytes of a type or variable', 'Memory address', 'Array length', 'B', 'sizeof() returns size in bytes'],
      ['What is the difference between struct and union?', 'No difference', 'struct has all fields, union shares memory', 'union has more fields', 'struct is faster', 'B', 'Union members share same memory location'],
      ['What does void* mean?', 'Empty function', 'Generic pointer to any type', 'Null pointer', 'Pointer to void function', 'B', 'void* is a generic pointer type'],
      ['What is a dangling pointer?', 'An uninitialized pointer', 'A pointer to freed/invalid memory', 'A null pointer', 'A pointer to array', 'B', 'Dangling pointer points to deallocated memory'],
    ],
    js: [
      ['What is the difference between let and var?', 'No difference', 'let is block-scoped, var is function-scoped', 'var is block-scoped', 'let is global', 'B', 'let = block scope, var = function scope'],
      ['What does === check?', 'Value only', 'Type only', 'Both value and type', 'Neither', 'C', '=== is strict equality checking both type and value'],
      ['What is event bubbling?', 'Event goes parent to child', 'Event bubbles from child to parent', 'Event is cancelled', 'Event loops', 'B', 'Bubbling propagates event up the DOM tree'],
      ['What does Array.map() return?', 'Original array', 'New transformed array', 'Nothing', 'An object', 'B', 'map() returns a new array with transformed values'],
      ['What is a closure?', 'A function with no return', 'A function remembering its outer scope variables', 'An imported module', 'A built-in method', 'B', 'Closure = function + its lexical environment'],
      ['What is Promise.all() used for?', 'Cancel promises', 'Run all promises in parallel, wait for all', 'Run promises sequentially', 'Create a promise', 'B', 'Promise.all waits for all promises to resolve'],
      ['What does the spread operator (...) do?', 'Creates functions', 'Expands an array or object into individual elements', 'Imports modules', 'Declares variables', 'B', 'Spread unpacks iterable elements'],
    ],
    ai: [
      ['What does LLM stand for?', 'Linear Learning Model', 'Large Language Model', 'Logical Layer Machine', 'Low-Level Machine', 'B', 'LLM = Large Language Model like GPT-4'],
      ['What is RAG?', 'Random Algorithmic Generation', 'Retrieval Augmented Generation', 'Recursive Agent Grouping', 'None', 'B', 'RAG combines retrieval with LLM generation'],
      ['What is a vector embedding?', 'A 2D array', 'A dense numerical representation of text', 'A database table', 'An image format', 'B', 'Embeddings capture semantic meaning as numbers'],
      ['What is prompt engineering?', 'Coding prompts', 'Designing inputs to get better LLM outputs', 'A programming language', 'Database design', 'B', 'Prompt engineering optimizes LLM instructions'],
      ['What is the attention mechanism in transformers?', 'A memory system', 'Weighting importance of different input tokens', 'A gradient method', 'A pooling layer', 'B', 'Attention allows models to focus on relevant tokens'],
      ['What is LangChain?', 'A blockchain framework', 'A framework for building LLM-powered applications', 'A machine learning library', 'A web framework', 'B', 'LangChain simplifies LLM app development'],
      ['What is fine-tuning?', 'Adjusting hyperparameters', 'Training a pre-trained model on specific domain data', 'Creating a new model', 'Testing a model', 'B', 'Fine-tuning adapts pre-trained models to new tasks'],
    ],
  };

  // Map roadmap → quiz bank key
  const rmQuizMap = { webdev:'webdev', python:'python', java:'java', dsa:'dsa', ml:'ml', ai:'ai', sql:'sql', cpp:'cpp', c:'c', js:'js' };

  for (const [rmId, modules] of Object.entries(moduleIdMap)) {
    const qKey = rmQuizMap[rmId] || 'webdev';
    const qList = quizBank[qKey] || quizBank.webdev;
    for (const mod of modules) {
      for (let qi=0; qi<qList.length; qi++) {
        const [q,a,b,c,d,ans,exp] = qList[qi];
        await conn.query(
          `INSERT INTO lesson_quizzes (module_id,question,option_a,option_b,option_c,option_d,correct_option,explanation,order_index)
           VALUES (?,?,?,?,?,?,?,?,?)`,
          [mod.id,q,a,b,c,d,ans,exp,qi+1]
        );
      }
    }
  }
  console.log('  ✓ Quizzes seeded (7 per module × all modules)');

  // ─────────────────────────────────────────────
  // PHASE 9: Seed module_lessons (1 lesson per module with full notes)
  // ─────────────────────────────────────────────
  console.log('\n📝 Seeding module_lessons with learning notes...');

  for (const [rmId, modules] of Object.entries(moduleIdMap)) {
    for (const mod of modules) {
      const shortDesc = `In this lesson you will learn ${mod.title} — covering core concepts, syntax, practical examples, and best practices.`;
      const notes = generateLearningNotes(mod.title, mod.lang);
      const starterCode = generateStarterCode(mod.lang, mod.title);
      await conn.query(
        `INSERT INTO module_lessons (module_id, title, short_desc, learning_notes, starter_code, language, order_index, xp_reward)
         VALUES (?,?,?,?,?,?,?,?)`,
        [mod.id, mod.title + ' — Core Concepts', shortDesc, notes, starterCode, mod.lang, 1, 50]
      );
    }
  }
  console.log('  ✓ Lessons seeded for all modules');

  await conn.end();
  console.log('\n✅ All phases complete! EduNet Roadmap Learning System seeded.\n');
}

function generateLearningNotes(title, lang) {
  return `# ${title}

## Introduction

Welcome to this module on **${title}**. This is a fundamental topic that every developer needs to understand thoroughly. By the end of this module, you will have a solid understanding of the core concepts and be able to apply them in real projects.

## What You Will Learn

- Core concepts and definitions
- Practical syntax and code examples
- Best practices used by professional developers
- Common mistakes to avoid
- Real-world applications

## Core Concepts

### Understanding ${title}

${title} is one of the most important topics in ${lang === 'python' ? 'Python programming' : lang === 'java' ? 'Java development' : lang === 'sql' ? 'database management' : lang === 'c' ? 'C programming' : lang === 'cpp' ? 'C++ development' : 'software development'}. Let's break it down step by step.

**Key Definition:** ${title} refers to the specific set of rules, syntax, and patterns used to accomplish a particular programming goal. Understanding this concept will form the foundation of your coding journey.

### Why It Matters

Every professional developer relies on these concepts daily. Whether you are building web applications, data pipelines, or enterprise software, mastering ${title} gives you a significant advantage.

## Syntax & Examples

Here is the fundamental syntax you need to know:

\`\`\`${lang}
// Example 1: Basic usage
// This shows the most common pattern for ${title}
\`\`\`

### Step-by-Step Explanation

1. **Step 1**: Understand the problem and what you need to achieve
2. **Step 2**: Choose the right approach based on requirements
3. **Step 3**: Write clean, readable code following best practices
4. **Step 4**: Test your solution thoroughly
5. **Step 5**: Refactor and optimize

## Best Practices

✅ **Do:**
- Always write clean, readable code with meaningful names
- Comment complex logic so future developers (including you) can understand it
- Test edge cases — empty inputs, null values, large numbers
- Follow the language's official style guide (PEP 8 for Python, Google Style for Java, etc.)
- Keep functions small and focused on a single responsibility

❌ **Don't:**
- Don't write overly complex one-liners that are hard to debug
- Don't ignore error handling — always handle exceptions gracefully
- Don't hardcode values — use constants or configuration files
- Don't skip testing — untested code is broken code waiting to happen

## Common Mistakes

### Mistake 1: Not Understanding Scope
Many beginners confuse local and global scope. Always declare variables in the smallest scope needed.

### Mistake 2: Ignoring Edge Cases
A function that works for typical inputs may fail for empty arrays, null values, or extreme numbers. Always test edge cases.

### Mistake 3: Premature Optimization
"Premature optimization is the root of all evil" — Donald Knuth. Write working code first, then optimize only when needed.

## Real-World Applications

- **Web Development**: Used in every modern web application
- **Data Science**: Essential for data processing pipelines
- **System Programming**: Core of operating system and compiler design
- **Game Development**: Fundamental to game engine architecture
- **DevOps**: Used in automation scripts and CI/CD pipelines

## Summary

In this module, you learned:
- The core concepts of ${title}
- Proper syntax and code examples
- Best practices to write clean code
- Common mistakes and how to avoid them
- Real-world applications

Ready for the next step? Complete the practice exercises and mini challenge to solidify your understanding. Then take the quiz to earn your XP!

**Remember:** Practice makes perfect. The more you code, the better you become. 🚀`;
}

function generateStarterCode(lang, title) {
  const starters = {
    javascript: `// ${title} — Starter Code\n// Complete the exercises below\n\n'use strict';\n\n// Exercise 1: Basic Example\nfunction example() {\n  // Your code here\n  console.log("Hello from ${title}!");\n}\n\nexample();\n`,
    python: `# ${title} — Starter Code\n# Complete the exercises below\n\ndef main():\n    # Your code here\n    print("Hello from ${title}!")\n\nif __name__ == "__main__":\n    main()\n`,
    java: `// ${title} — Starter Code\npublic class Main {\n    public static void main(String[] args) {\n        // Your code here\n        System.out.println("Hello from ${title}!");\n    }\n}\n`,
    sql: `-- ${title} — Starter Code\n-- Complete the queries below\n\n-- Query 1: Basic SELECT\nSELECT * FROM your_table LIMIT 10;\n\n-- Query 2: With condition\n-- SELECT * FROM your_table WHERE condition;\n`,
    c: `// ${title} — Starter Code\n#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    // Your code here\n    printf("Hello from ${title}!\\n");\n    return 0;\n}\n`,
    cpp: `// ${title} — Starter Code\n#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    // Your code here\n    cout << "Hello from ${title}!" << endl;\n    return 0;\n}\n`,
  };
  return starters[lang] || starters.javascript;
}

run().catch(err => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);
  process.exit(1);
});
