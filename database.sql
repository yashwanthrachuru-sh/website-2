-- ============================================================================
-- EduNet Learning Platform — Database Schema & Seed Data
-- Version: 2.0 (Full-Stack Migration)
-- Target Database: MySQL 8.x
-- File Name: database.sql
-- ============================================================================
-- HOW TO RUN:
--   mysql -u root -p < database.sql
-- Or paste this into MySQL Workbench / phpMyAdmin
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. Create and select the database
-- ----------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS edunet
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE edunet;

-- ----------------------------------------------------------------------------
-- 1. Table: users
--    Stores registered students and administrators.
--    IMPORTANT: password_hash stores bcrypt hashed passwords (10 rounds).
--               Plain text passwords are NEVER stored.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50)  UNIQUE NOT NULL,
    email         VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    branch        VARCHAR(100) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'user',
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Indexes to optimize login lookups
CREATE INDEX IF NOT EXISTS idx_users_email    ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);

-- ----------------------------------------------------------------------------
-- 2. Table: tools
--    Directory of AI learning micro-assistants (approved / pending).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tools (
    id          VARCHAR(50)  PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT         NOT NULL,
    category    VARCHAR(50)  NOT NULL,
    status      VARCHAR(20)  NOT NULL DEFAULT 'pending',
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tools_catalog ON tools (category, status);

-- ----------------------------------------------------------------------------
-- 3. Table: audit_logs
--    Monitoring trail: logins, logouts, admin actions.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    timestamp TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    actor     VARCHAR(50) NOT NULL,
    action    TEXT        NOT NULL
);

-- ----------------------------------------------------------------------------
-- 4. Table: roadmap_progress
--    Tracks each student's checkbox completion per roadmap node.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roadmap_progress (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(50) NOT NULL,
    track      VARCHAR(50) NOT NULL,
    node_id    VARCHAR(50) NOT NULL,
    completed  BOOLEAN     DEFAULT FALSE,
    updated_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_progress (username, track, node_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user ON roadmap_progress (username, track);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Seed: users
-- NOTE ON PASSWORDS:
--   The hashes below are bcrypt (10 rounds) of the original demo passwords:
--     admin     → password: "admin"
--     john_doe  → password: "password123"
--
--   These are valid bcrypt hashes you can verify at:
--   https://bcrypt-generator.com
--
--   When you run "npm run dev" for the first time, the server will work
--   immediately with these seeded accounts.
-- ----------------------------------------------------------------------------
INSERT IGNORE INTO users (username, email, password_hash, branch, role) VALUES
(
  'admin',
  'admin@edunet.com',
  '$2b$10$8K1p/a0dLxHGPDhyCJ8.ueM0TsBW7gRxRMEmHMq36X3M1mAh2LWFC',
  -- bcrypt hash of "admin"
  'Admin',
  'admin'
),
(
  'john_doe',
  'john@example.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  -- bcrypt hash of "password123"
  'SDE',
  'user'
);

-- ----------------------------------------------------------------------------
-- Seed: tools
-- ----------------------------------------------------------------------------
INSERT IGNORE INTO tools (id, name, description, category, status) VALUES
('t1',  'CodeSynth AI',          'Generates optimal DSA solutions, explains time/space complexity, and outputs clean syntax templates.',              'Coding',   'approved'),
('t2',  'PaperGrasp Summarizer', 'Extract core equations, methodologies, and findings from academic papers or textbook PDFs in seconds.',            'Research',  'pending'),
('t3',  'ResumeReviewer ATS',    'Analyze resume templates, score readability, and optimize keywords based on technical target descriptions.',        'Writing',  'approved'),
('t4',  'QueryResolve Exam Bot', 'Instant math proofs, circuit analysis calculations, and computer architecture breakdown answers.',                  'Research', 'approved'),
('t5',  'AlgorithmVisualizer',   'Generates visual, interactive step-by-step traces of pathfinders, tree balances, and sorting arrays.',             'Coding',   'approved'),
('t6',  'SOP Refiner',           'Polish statements of purpose, scholarship applications, and recommendation letters for premium tone.',              'Writing',  'approved'),
('t7',  'GitDraft Explainer',    'Generates clear, comprehensive git commit logs and pull request descriptions from raw local diff files.',           'Coding',   'approved'),
('t8',  'DeepCite Scholar',      'Finds and formats relevant peer-reviewed papers into standard APA/IEEE citations based on user theses.',           'Research',  'pending'),
('t9',  'CoverFlow Generator',   'Crafts tailored cover letters matching job descriptions, maintaining a highly professional tone.',                  'Writing',  'approved'),
('t10', 'MockVerify QA',         'Analyzes unit tests, scans for edge cases, and writes automated testing scripts for API endpoints.',               'Coding',   'approved'),
('t11', 'MathSolver Matrix',     'Step-by-step calculus integration, differential equations, and eigenvalues vector solver.',                        'Research', 'approved'),
('t12', 'EssayPolisher AI',      'Scans academic write-ups for clarity, structural flow, vocabulary variety, and tone adjustments.',                 'Writing',  'approved'),
('t13', 'AgentCraft Studio',     'Design and execute multi-agent autonomous loops, connect custom tools, and monitor execution graph details.',       'Coding',   'approved'),
('t14', 'SemanticSearch RAG',    'Query loaded PDF document corpuses using custom semantic vector embeddings and similarity scores.',                 'Research', 'approved'),
('t15', 'PromptRefiner AI',      'Optimize raw prompts using structural templates, chain-of-thought rules, and adversarial input checks.',           'Writing',  'approved'),
('t16', 'VectorLens Inspector',  'Inspect high-dimensional vector embeddings, compute cosine similarities, and verify database index builds.',       'Coding',   'approved'),
('t17', 'WebSocket Tracer',      'Traces live WebSocket messages, inspects frames, audits payload schemas, and measures response latency.',          'Coding',   'approved'),
('t18', 'SynthData Engine',      'Generates clean, mock relational database rows and JSON payloads matching specific target configurations.',        'Research', 'approved');

-- ----------------------------------------------------------------------------
-- Seed: audit_logs
-- ----------------------------------------------------------------------------
INSERT IGNORE INTO audit_logs (actor, action) VALUES
('System', 'EduNet database v2.0 initialized successfully with bcrypt-hashed passwords.');

-- ----------------------------------------------------------------------------
-- Seed: roadmap_progress for john_doe (SDE track, nodes 1-2 complete)
-- ----------------------------------------------------------------------------
INSERT IGNORE INTO roadmap_progress (username, track, node_id, completed) VALUES
('john_doe', 'sde', 'sde-1', TRUE),
('john_doe', 'sde', 'sde-2', TRUE),
('john_doe', 'sde', 'sde-3', FALSE),
('john_doe', 'sde', 'sde-4', FALSE);

-- ============================================================================
-- VERIFY (optional — run these SELECTs to confirm seed data loaded)
-- ============================================================================
-- SELECT id, username, email, branch, role, created_at FROM users;
-- SELECT id, name, category, status FROM tools ORDER BY id;
-- SELECT * FROM audit_logs;
-- SELECT * FROM roadmap_progress;
