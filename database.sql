-- ============================================================================
-- EduNet Learning Platform — Database Schema & Seed Data
-- Version: 3.0 (Comprehensive MVC Schema)
-- Target Database: MySQL 8.x
-- File Name: database.sql
-- ============================================================================

CREATE DATABASE IF NOT EXISTS edunet
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE edunet;

-- Disable checks temporarily during reset/rebuild to allow drops if needed
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables in reverse order of dependency
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS bookmarks;
DROP TABLE IF EXISTS progress;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS approval_queue;
DROP TABLE IF EXISTS admin_actions;
DROP TABLE IF EXISTS leaderboard;
DROP TABLE IF EXISTS badges;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS tool_usage;
DROP TABLE IF EXISTS tools;
DROP TABLE IF EXISTS code_files;
DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS tests;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS modules;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS roadmaps;
DROP TABLE IF EXISTS roadmap_progress;
DROP TABLE IF EXISTS videos;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. Table: users
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50)  UNIQUE NOT NULL,
    email         VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    branch        VARCHAR(100) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'user',
    status        VARCHAR(20)  NOT NULL DEFAULT 'pending', -- pending, approved, rejected, suspended
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_status ON users (status);

-- ----------------------------------------------------------------------------
-- 2. Table: roadmaps
-- ----------------------------------------------------------------------------
CREATE TABLE roadmaps (
    id          VARCHAR(50) PRIMARY KEY, -- e.g. 'cse-sde', 'ece', etc.
    branch      VARCHAR(50) NOT NULL,    -- CSE, ECE, EEE, Mechanical, Civil, IT, AI & DS, AIML
    track       VARCHAR(50),             -- SDE, Full Stack, Java, Python, AI Engineer, ML Engineer, DevOps, Cybersecurity, Data Science, Cloud Engineer
    title       VARCHAR(100) NOT NULL,
    description TEXT
);

-- ----------------------------------------------------------------------------
-- 3. Table: courses
-- ----------------------------------------------------------------------------
CREATE TABLE courses (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    roadmap_id  VARCHAR(50) NOT NULL,
    semester    INT NOT NULL,            -- 1 to 8
    title       VARCHAR(100) NOT NULL,
    description TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE
);
CREATE INDEX idx_courses_roadmap ON courses (roadmap_id);

-- ----------------------------------------------------------------------------
-- 4. Table: modules
-- ----------------------------------------------------------------------------
CREATE TABLE modules (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    course_id   INT NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 5. Table: lessons
-- ----------------------------------------------------------------------------
CREATE TABLE lessons (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    module_id   INT NOT NULL,
    name        VARCHAR(100) NOT NULL,
    content     TEXT,
    video_url   VARCHAR(255),
    books       TEXT,                    -- JSON array or text
    playlists   TEXT,                    -- YouTube playlists JSON or text
    skills      TEXT,                    -- Skills tags
    resources   TEXT,                    -- Additional URLs
    order_index INT DEFAULT 0,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 6. Table: tests
-- ----------------------------------------------------------------------------
CREATE TABLE tests (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id   INT DEFAULT NULL,        -- optional tie to a specific lesson
    course_id   INT DEFAULT NULL,        -- optional tie to a specific course
    title       VARCHAR(100) NOT NULL,
    difficulty  VARCHAR(20) NOT NULL,    -- Easy, Medium, Hard
    type        VARCHAR(50) NOT NULL,    -- MCQ, Aptitude, Coding, MockInterview
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 7. Table: questions
-- ----------------------------------------------------------------------------
CREATE TABLE questions (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    test_id         INT NOT NULL,
    question_text   TEXT NOT NULL,
    option_a        TEXT,
    option_b        TEXT,
    option_c        TEXT,
    option_d        TEXT,
    correct_option  CHAR(1) DEFAULT NULL, -- A, B, C, D
    coding_template TEXT,                 -- boilerplate code for coding challenges
    coding_test_cases TEXT,               -- JSON of input/output checks
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 8. Table: results
-- ----------------------------------------------------------------------------
CREATE TABLE results (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    user_id           INT NOT NULL,
    test_id           INT NOT NULL,
    score             INT NOT NULL,
    total_questions   INT NOT NULL,
    correct_answers   INT NOT NULL,
    coding_submission TEXT,
    feedback          TEXT,
    attempted_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 9. Table: certificates
-- ----------------------------------------------------------------------------
CREATE TABLE certificates (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT NOT NULL,
    course_id        INT DEFAULT NULL,
    roadmap_id       VARCHAR(50) DEFAULT NULL,
    issue_date       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    certificate_hash VARCHAR(64) UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 10. Table: code_files
-- ----------------------------------------------------------------------------
CREATE TABLE code_files (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    file_name  VARCHAR(100) NOT NULL,
    file_content TEXT NOT NULL,
    language   VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 11. Table: tools
-- ----------------------------------------------------------------------------
CREATE TABLE tools (
    id            VARCHAR(50) PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    description   TEXT NOT NULL,
    category      VARCHAR(50) NOT NULL,   -- Coding, Research, Image, Video, Coding Agents, Voice, Productivity
    status        VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, approved, rejected, deleted
    features      TEXT,                   -- JSON list or string
    pricing       VARCHAR(50),            -- e.g. Free, Pro, Paid
    use_cases     TEXT,
    alternatives  TEXT,
    tutorials     TEXT,
    official_link VARCHAR(255),
    rating        DECIMAL(3,2) DEFAULT 0.00,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_tools_status ON tools (status);

-- ----------------------------------------------------------------------------
-- 12. Table: tool_usage
-- ----------------------------------------------------------------------------
CREATE TABLE tool_usage (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    user_id   INT NOT NULL,
    tool_id   VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 13. Table: notifications
-- ----------------------------------------------------------------------------
CREATE TABLE notifications (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    message    TEXT NOT NULL,
    is_read    BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 14. Table: audit_logs
-- ----------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actor     VARCHAR(50) NOT NULL,
    action    TEXT NOT NULL
);

-- ----------------------------------------------------------------------------
-- 15. Table: badges
-- ----------------------------------------------------------------------------
CREATE TABLE badges (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    user_id           INT NOT NULL,
    badge_name        VARCHAR(50) NOT NULL,
    badge_description VARCHAR(255) NOT NULL,
    earned_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 16. Table: leaderboard
-- ----------------------------------------------------------------------------
CREATE TABLE leaderboard (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT NOT NULL,
    score         INT NOT NULL DEFAULT 0,
    rank_position INT DEFAULT NULL,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 17. Table: admin_actions
-- ----------------------------------------------------------------------------
CREATE TABLE admin_actions (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    admin_id    INT NOT NULL,
    target_id   VARCHAR(50) NOT NULL, -- User ID or Tool ID
    target_type VARCHAR(50) NOT NULL, -- user, tool
    action      VARCHAR(50) NOT NULL, -- approve, reject, suspend, delete
    details     TEXT,
    timestamp   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 18. Table: approval_queue
-- ----------------------------------------------------------------------------
CREATE TABLE approval_queue (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    target_type VARCHAR(50) NOT NULL, -- user, tool
    target_id   VARCHAR(50) NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 19. Table: sessions
-- ----------------------------------------------------------------------------
CREATE TABLE sessions (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    token      VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 20. Table: progress
-- ----------------------------------------------------------------------------
CREATE TABLE progress (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    lesson_id   INT NOT NULL,
    completed   BOOLEAN DEFAULT FALSE,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_lesson (user_id, lesson_id)
);

-- ----------------------------------------------------------------------------
-- 21. Table: bookmarks
-- ----------------------------------------------------------------------------
CREATE TABLE bookmarks (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    item_type  VARCHAR(20) NOT NULL, -- course, roadmap, tool
    item_id    VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 22. Table: projects
-- ----------------------------------------------------------------------------
CREATE TABLE projects (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    title       VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    github_link VARCHAR(255),
    live_link   VARCHAR(255),
    grade       VARCHAR(10) DEFAULT NULL,
    graded_by   INT DEFAULT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 23. Table: roadmap_progress (keeps retro-compatibility/sync)
-- ----------------------------------------------------------------------------
CREATE TABLE roadmap_progress (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(50) NOT NULL,
    track      VARCHAR(50) NOT NULL,
    node_id    VARCHAR(50) NOT NULL,
    completed  BOOLEAN     DEFAULT FALSE,
    updated_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_progress (username, track, node_id)
);

-- ----------------------------------------------------------------------------
-- 24. Table: videos (YouTube video management)
-- ----------------------------------------------------------------------------
CREATE TABLE videos (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    youtube_url VARCHAR(255) NOT NULL,
    video_id    VARCHAR(50)  NOT NULL,
    embed_url   VARCHAR(255) NOT NULL,
    thumbnail   VARCHAR(255),
    description TEXT,
    category    VARCHAR(100) DEFAULT 'General',
    tags        TEXT,
    instructor  VARCHAR(100),
    duration    VARCHAR(20),
    pinned      TINYINT(1)   DEFAULT 0,
    status      VARCHAR(20)  DEFAULT 'active', -- active, archived
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE INDEX idx_videos_category ON videos (category);
CREATE INDEX idx_videos_status ON videos (status);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- 1. Seed: users (hashed passwords: admin -> "admin123", john_doe -> "password123")
INSERT INTO users (username, email, password_hash, branch, role, status) VALUES
('admin', 'admin@edunet.com', '$2b$10$v4X3gUcbWqfKqpqItYhHV.k9vPsy5SsVpjzaiXM2.HR6v5rK1NldC', 'Admin', 'admin', 'approved'),
('john_doe', 'john@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'SDE', 'user', 'approved');

-- 2. Seed: roadmaps
INSERT INTO roadmaps (id, branch, track, title, description) VALUES
('cse-sde', 'CSE', 'SDE', 'Software Development Engineer', 'Core curriculum path focusing on algorithms, backend frameworks, database systems, and scalability.'),
('cse-ds', 'CSE', 'Data Science', 'Data Scientist', 'Mathematical foundations, statistics, machine learning algorithms, vector databases, and LLMs.'),
('cse-cyber', 'CSE', 'Cybersecurity', 'Cybersecurity Analyst', 'Networking protocols, penetration testing, cryptography, and defending AI against prompt injection.');

-- 3. Seed: courses
INSERT INTO courses (roadmap_id, semester, title, description) VALUES
('cse-sde', 1, 'Data Structures & Algorithms', 'Master classical lists, trees, graphs, and search strategies.'),
('cse-sde', 2, 'System Design & WebSockets', 'Study load balancers, caching layers, and real-time socket streams.'),
('cse-sde', 3, 'GenAI & LLM Integration', 'Learn model API invocation, prompting guidelines, and autonomous agents.'),
('cse-sde', 4, 'Cloud & Deployments', 'Containerization with Docker, CI/CD actions, and cloud orchestration.'),
('cse-ds', 1, 'Mathematics, Statistics & SQL', 'Fundamentals of algebra, matrix computations, probability, and database indexing.'),
('cse-ds', 2, 'Machine Learning & MLOps', 'Learn training loops, validator systems, and model registers.'),
('cse-ds', 3, 'Vector Databases & RAG', 'Configure semantic similarities, embeddings, and retrieval pipelines.'),
('cse-ds', 4, 'Large Language Models (LLMs)', 'Fine-tune weights, construct pipelines, and evaluate parameters.'),
('cse-cyber', 1, 'Networking Protocols & Linux', 'Trace OSI packets, firewall setups, and custom server shell environments.'),
('cse-cyber', 2, 'Offensive Security & AI Risks', 'Audit OWASP hazards, inspect penetration metrics, and secure AI inputs.');

-- 4. Seed: modules
INSERT INTO modules (course_id, name, description, order_index) VALUES
(1, 'Arrays & Linked Lists', 'Linear structures complexity analysis.', 1),
(1, 'Trees & Graphs', 'Hierarchical searches and graph pathfinders.', 2),
(2, 'System Scalability', 'Horizontal vs vertical database scaling.', 1),
(3, 'Semantic Inference', 'Structuring prompts and JSON outputs.', 1);

-- 5. Seed: lessons
INSERT INTO lessons (module_id, name, content, video_url, books, playlists, skills, resources, order_index) VALUES
(1, 'Singly Linked Lists', 'Trace pointer swaps and list reversals.', 'https://www.youtube.com/embed/58YBPFoFHto', '["CLRS Algorithms", "DSA Made Simple"]', '["https://youtube.com/playlist?list=PL2_aWCzGMAwI3W_yfRjt5_55UrDFspGXP"]', 'JavaScript, DSA, Complexity Analysis', '{"GitHub Practice": "https://github.com"}', 1),
(2, 'Binary Search Trees', 'Traverse node relationships recursively.', 'https://www.youtube.com/embed/t0Cq6tVNRBA', '["CLRS Algorithms"]', '["https://youtube.com/playlist?list=PL2_aWCzGMAwI3W_yfRjt5_55UrDFspGXP"]', 'Recursion, BST, Sorting', '{}', 1);

-- 6. Seed: tests
INSERT INTO tests (lesson_id, course_id, title, difficulty, type) VALUES
(1, 1, 'Linked Lists Mastery', 'Easy', 'MCQ'),
(1, 1, 'DSA In-place Reversal Test', 'Medium', 'Coding'),
(2, 1, 'Trees & Traversals MCQ', 'Hard', 'MCQ');

-- 7. Seed: questions
INSERT INTO questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_option, coding_template, coding_test_cases) VALUES
(1, 'What is the time complexity of deleting a node at the head of a Singly Linked List of size N, assuming you have a pointer to the head?', 'O(1)', 'O(N)', 'O(log N)', 'O(N^2)', 'A', NULL, NULL),
(1, 'Which data structure follows a Last In First Out (LIFO) pattern?', 'Queue', 'Stack', 'Linked List', 'Graph', 'B', NULL, NULL),
(2, 'Write a function reverseList(head) that reverses a singly linked list in-place and returns the new head.', NULL, NULL, NULL, NULL, NULL, 
'function reverseList(head) {\n    let prev = null;\n    let curr = head;\n    while (curr !== null) {\n        let nextTemp = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}', 
'[{"input": [1,2,3,4,5], "output": [5,4,3,2,1]}, {"input": [], "output": []}]'),
(3, 'In a balanced BST with N elements, what is the worst-case lookup time?', 'O(1)', 'O(N)', 'O(log N)', 'O(N log N)', 'C', NULL, NULL);

-- 8. Seed: tools
INSERT INTO tools (id, name, description, category, status, features, pricing, use_cases, alternatives, tutorials, official_link, rating) VALUES
('t1',  'CodeSynth AI',          'Generates optimal DSA solutions, explains time/space complexity, and outputs clean syntax templates.',              'Coding',   'approved', '["Optimal solution generation", "Complexity insights", "Language conversions"]', 'Free', 'Interview practice, syntax reference', 'ChatGPT, GitHub Copilot', 'http://localhost:5000/tutorials/codesynth', 'https://github.com', 4.8),
('t2',  'PaperGrasp Summarizer', 'Extract core equations, methodologies, and findings from academic papers or textbook PDFs in seconds.',            'Research',  'pending',  '["PDF parsing", "Equation extractor", "Summarizer"]', 'Paid', 'Academic reading, literature reviews', 'Elicit, Consensus', 'http://localhost:5000/tutorials/papergrasp', 'https://arxiv.org', 4.2),
('t3',  'ResumeReviewer ATS',    'Analyze resume templates, score readability, and optimize keywords based on technical target descriptions.',        'Productivity',  'approved', '["ATS scoring", "Keyword scanner", "Grammar checker"]', 'Free', 'Job applications, placement prep', 'Jobscan', 'http://localhost:5000/tutorials/resumereview', 'https://resumereviewer.com', 4.5),
('t4',  'QueryResolve Exam Bot', 'Instant math proofs, circuit analysis calculations, and computer architecture breakdown answers.',                  'Research', 'approved', '["Calculus step solving", "Circuit mesh parsing", "Truth table output"]', 'Free', 'Homework checks, exam prep', 'Wolfram Alpha', 'http://localhost:5000/tutorials/queryresolve', 'https://wolframalpha.com', 4.6),
('t5',  'AlgorithmVisualizer',   'Generates visual, interactive step-by-step traces of pathfinders, tree balances, and sorting arrays.',             'Coding',   'approved', '["Interactive animation", "Breakpoint checks", "Speed tuner"]', 'Free', 'DSA learning, algorithm analysis', 'VisuAlgo', 'http://localhost:5000/tutorials/algovisualizer', 'https://visualgo.net', 4.9),
('t6',  'SOP Refiner',           'Polish statements of purpose, scholarship applications, and recommendation letters for premium tone.',              'Productivity',  'approved', '["Tone tuner", "Wordiness remover", "Passive voice highlights"]', 'Free', 'Grad school apps, statement letters', 'Grammarly', 'http://localhost:5000/tutorials/soprefiner', 'https://soprefiner.com', 4.3),
('t7',  'GitDraft Explainer',    'Generates clear, comprehensive git commit logs and pull request descriptions from raw local diff files.',           'Coding',   'approved', '["Diff parsing", "Conventional commits output", "PR list writer"]', 'Free', 'Version control hygiene, peer reviews', 'Cursor', 'http://localhost:5000/tutorials/gitdraft', 'https://github.com', 4.4),
('t8',  'DeepCite Scholar',      'Finds and formats relevant peer-reviewed papers into standard APA/IEEE citations based on user theses.',           'Research',  'pending',  '["APA/IEEE Citation generator", "Semantic scholar query"]', 'Free', 'Academic writing, thesis citations', 'Zotero', 'http://localhost:5000/tutorials/deepcite', 'https://scholar.google.com', 4.1),
('t9',  'CoverFlow Generator',   'Crafts tailored cover letters matching job descriptions, maintaining a highly professional tone.',                  'Productivity',  'approved', '["Custom cover letter", "Target job match", "One-page format limit"]', 'Pro', 'Career search, custom outreach', 'Jasper AI', 'http://localhost:5000/tutorials/coverflow', 'https://linkedin.com', 4.5),
('t10', 'MockVerify QA',         'Analyzes unit tests, scans for edge cases, and writes automated testing scripts for API endpoints.',               'Coding',   'approved', '["Edge case scanner", "Mock generators", "Coverage report generator"]', 'Free', 'Code quality assurance, unit tests', 'Jest, Supertest', 'http://localhost:5000/tutorials/mockverify', 'https://jestjs.io', 4.7),
('t11', 'MathSolver Matrix',     'Step-by-step calculus integration, differential equations, and eigenvalues vector solver.',                        'Research', 'approved', '["Eigenvalue calculation", "Step substitution detail", "Limits check"]', 'Free', 'Linear algebra, calculus courses', 'Symbolab', 'http://localhost:5000/tutorials/mathsolver', 'https://symbolab.com', 4.6),
('t12', 'EssayPolisher AI',      'Scans academic write-ups for clarity, structural flow, vocabulary variety, and tone adjustments.',                 'Productivity',  'approved', '["Academic style guide", "Vocabulary expansion", "Readability stats"]', 'Free', 'Academic journals, essay writing', 'ProWritingAid', 'http://localhost:5000/tutorials/essaypolisher', 'https://essaypolisher.com', 4.4),
('t13', 'AgentCraft Studio',     'Design and execute multi-agent autonomous loops, connect custom tools, and monitor execution graph details.',       'Coding',   'approved', '["Multi-agent coordination", "Graph telemetry dashboard", "API web hook bindings"]', 'Pro', 'Automation agents, AI workflows', 'LangChain, AutoGPT', 'http://localhost:5000/tutorials/agentcraft', 'https://langchain.com', 4.8),
('t14', 'SemanticSearch RAG',    'Query loaded PDF document corpuses using custom semantic vector embeddings and similarity scores.',                 'Research', 'approved', '["Semantic search index", "PDF document chunker", "Similarity scoring"]', 'Pro', 'RAG search systems, document query', 'Pinecone, ChromaDB', 'http://localhost:5000/tutorials/semanticrag', 'https://pinecone.io', 4.7),
('t15', 'PromptRefiner AI',      'Optimize raw prompts using structural templates, chain-of-thought rules, and adversarial input checks.',           'Productivity',  'approved', '["Chain-of-Thought injector", "System role checks", "Token reducer"]', 'Free', 'Prompt engineering, input auditing', 'PromptPerfect', 'http://localhost:5000/tutorials/promptrefiner', 'https://promptperfect.xyz', 4.5),
('t16', 'VectorLens Inspector',  'Inspect high-dimensional vector embeddings, compute cosine similarities, and verify database index builds.',       'Coding',   'approved', '["Similarity graphing", "HNSW Index validations", "Token weight counts"]', 'Free', 'Embedding debugging, NLP testing', 'TensorBoard', 'http://localhost:5000/tutorials/vectorlens', 'https://github.com', 4.4),
('t17', 'WebSocket Tracer',      'Traces live WebSocket messages, inspects frames, audits payload schemas, and measures response latency.',          'Coding',   'approved', '["Live frame updates", "Latency measurement logs", "Schema verification"]', 'Free', 'Realtime api debug, WebSocket audit', 'Postman', 'http://localhost:5000/tutorials/wstracer', 'https://websocket.org', 4.6),
('t18', 'SynthData Engine',      'Generates clean, mock relational database rows and JSON payloads matching specific target configurations.',        'Research', 'approved', '["Relational mock schemas", "Export to SQL/CSV/JSON", "Regex validator setup"]', 'Free', 'Database testing, seed generators', 'Mockaroo', 'http://localhost:5000/tutorials/synthdata', 'https://mockaroo.com', 4.7);

-- 9. Seed: audit_logs
INSERT INTO audit_logs (actor, action) VALUES
('System', 'EduNet database v3.0 initialized successfully with 23 relational tables.');

-- 10. Seed: roadmap_progress (for john_doe)
INSERT INTO roadmap_progress (username, track, node_id, completed) VALUES
('john_doe', 'sde', 'sde-1', TRUE),
('john_doe', 'sde', 'sde-2', TRUE),
('john_doe', 'sde', 'sde-3', FALSE),
('john_doe', 'sde', 'sde-4', FALSE);

-- 11. Seed: leaderboard
INSERT INTO leaderboard (user_id, score, rank_position) VALUES
(2, 250, 1);
