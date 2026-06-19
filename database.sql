-- ============================================================================
-- EduNet Learning Platform — Database Schema & Initial Data
-- Target Database: MySQL / PostgreSQL / Standard SQL-92
-- File Name: database.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Table: users
-- Stores registered students and administrators.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Stored as cleartext or hash representation
    branch VARCHAR(100) NOT NULL, -- Study pathways: SDE, Data Science, Cybersecurity, Self Learner
    role VARCHAR(20) NOT NULL DEFAULT 'user', -- Access levels: user, admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes to optimize authentication lookups
CREATE INDEX idx_users_auth ON users (username, password_hash);
CREATE INDEX idx_users_email ON users (email);

-- ----------------------------------------------------------------------------
-- 2. Table: tools
-- Directory of approved and pending AI learning micro-assistants.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tools (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- Coding, Research, Writing, Career Preparation, etc.
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- approved, pending, rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for catalog queries based on category and status
CREATE INDEX idx_tools_catalog ON tools (category, status);

-- ----------------------------------------------------------------------------
-- 3. Table: audit_logs
-- Monitoring trail tracking actions like logins, logouts, and tool updates.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actor VARCHAR(50) NOT NULL,
    action TEXT NOT NULL
);

-- ----------------------------------------------------------------------------
-- 4. Table: roadmap_progress
-- Tracks student checkbox progress on career path syllabus milestones.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roadmap_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    track VARCHAR(50) NOT NULL, -- sde, ds, cyber
    node_id VARCHAR(50) NOT NULL, -- e.g., sde-1, ds-2, cyber-3
    completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_progress (username, track, node_id)
);

-- Create foreign key index for progress queries
CREATE INDEX idx_progress_user ON roadmap_progress (username, track);


-- ============================================================================
-- SEED DATA SETUP
-- ============================================================================

-- Seed: users
INSERT INTO users (username, email, password_hash, branch, role) VALUES 
('admin', 'admin@edunet.com', 'admin', 'Admin', 'admin'),
('john_doe', 'john@example.com', 'password123', 'SDE', 'user');

-- Seed: tools (Core and newly added Enhanced / Rapidly Growing Tools)
INSERT INTO tools (id, name, description, category, status) VALUES 
('t1', 'CodeSynth AI', 'Generates optimal DSA solutions, explains time/space complexity, and outputs clean syntax templates.', 'Coding', 'approved'),
('t2', 'PaperGrasp Summarizer', 'Extract core equations, methodologies, and findings from academic papers or textbook PDFs in seconds.', 'Research', 'pending'),
('t3', 'ResumeReviewer ATS', 'Analyze resume templates, score readability, and optimize keywords based on technical target descriptions.', 'Writing', 'approved'),
('t4', 'QueryResolve Exam Bot', 'Instant math proofs, circuit analysis calculations, and computer architecture breakdown answers.', 'Research', 'approved'),
('t5', 'AlgorithmVisualizer', 'Generates visual, interactive step-by-step traces of pathfinders, tree balances, and sorting arrays.', 'Coding', 'approved'),
('t6', 'SOP Refiner', 'Polish statements of purpose, scholarship applications, and recommendation letters for premium tone.', 'Writing', 'approved'),
('t7', 'GitDraft Explainer', 'Generates clear, comprehensive git commit logs and pull request descriptions from raw local diff files.', 'Coding', 'approved'),
('t8', 'DeepCite Scholar', 'Finds and formats relevant peer-reviewed papers into standard APA/IEEE citations based on user theses.', 'Research', 'pending'),
('t9', 'CoverFlow Generator', 'Crafts tailored cover letters matching job descriptions, maintaining a highly professional tone.', 'Writing', 'approved'),
('t10', 'MockVerify QA', 'Analyzes unit tests, scans for edge cases, and writes automated testing scripts for API endpoints.', 'Coding', 'approved'),
('t11', 'MathSolver Matrix', 'Step-by-step calculus integration, differential equations, and eigenvalues vector solver.', 'Research', 'approved'),
('t12', 'EssayPolisher AI', 'Scans academic write-ups for clarity, structural flow, vocabulary variety, and tone adjustments.', 'Writing', 'approved'),
('t13', 'AgentCraft Studio', 'Design and execute multi-agent autonomous loops, connect custom tools, and monitor execution graph details.', 'Coding', 'approved'),
('t14', 'SemanticSearch RAG', 'Query loaded PDF document corpuses using custom semantic vector embeddings and similarity scores.', 'Research', 'approved'),
('t15', 'PromptRefiner AI', 'Optimize raw prompts using structural templates, chain-of-thought rules, and adversarial input checks.', 'Writing', 'approved'),
('t16', 'VectorLens Inspector', 'Inspect high-dimensional vector embeddings, compute cosine similarities, and verify database index builds.', 'Coding', 'approved'),
('t17', 'WebSocket Tracer', 'Traces live WebSocket messages, inspects frames, audits payload schemas, and measures response latency.', 'Coding', 'approved'),
('t18', 'SynthData Engine', 'Generates clean, mock relational database rows and JSON payloads matching specific target configurations.', 'Research', 'approved');

-- Seed: audit_logs
INSERT INTO audit_logs (actor, action) VALUES 
('System', 'EduNet Database Initialized successfully with seed tables.');

-- Seed: sample roadmap_progress for student john_doe
INSERT INTO roadmap_progress (username, track, node_id, completed) VALUES 
('john_doe', 'sde', 'sde-1', TRUE),
('john_doe', 'sde', 'sde-2', TRUE),
('john_doe', 'sde', 'sde-3', FALSE),
('john_doe', 'sde', 'sde-4', FALSE);
