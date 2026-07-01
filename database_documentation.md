# EduNet Database Documentation

This document describes the relational MySQL database schema, indices, primary/foreign keys, table purposes, and phase migrations sequence.

---

## 1. Relational Entity Relationship Diagram (Conceptual)

```text
┌──────────────┐          ┌────────────────┐          ┌─────────────────┐
│    users     │ ◄─────── │    bookmarks   │ ────────► │     lessons     │
│  (User IDs)  │          │   (Saved items)│          │  (Lesson IDs)   │
└──────┬───────┘          └────────────────┘          └────────┬────────┘
       │                                                       │
       ├──────────────┐                                        │
       ▼              ▼                                        ▼
┌──────────────┐┌──────────────┐                      ┌─────────────────┐
│  portfolios  ││ github_repos │                      │  lesson_quizzes │
│ (Theme, views││(Stars, forks)│                      │(Assessments Qs) │
└──────────────┘└──────────────┘                      └─────────────────┘
```

---

## 2. Table Specifications

### 2.1. `users` Table
*   **Purpose**: Stores student, faculty, and administrator accounts.
*   **Columns**:
    *   `id` (INT, Primary Key, Auto-increment)
    *   `username` (VARCHAR(50), Unique)
    *   `email` (VARCHAR(100), Unique)
    *   `password` (VARCHAR(255))
    *   `role` (ENUM('user', 'admin', 'faculty'), Default: 'user')
    *   `branch` (VARCHAR(20))
    *   `status` (ENUM('pending', 'approved', 'suspended'), Default: 'pending')
    *   `xp` (INT, Default: 0)
    *   `level` (INT, Default: 1)
    *   `streak` (INT, Default: 0)
    *   `created_at` (TIMESTAMP)
*   **Indexes**:
    *   `idx_users_username` on `username` (BTREE)
    *   `idx_users_email` on `email` (BTREE)
    *   `idx_users_role` on `role` (BTREE)

### 2.2. `roadmaps` Table
*   **Purpose**: Career path definitions (e.g., SDE, Frontend, AI/ML).
*   **Columns**:
    *   `id` (INT, Primary Key, Auto-increment)
    *   `slug` (VARCHAR(50), Unique)
    *   `title` (VARCHAR(100))
    *   `description` (TEXT)
    *   `difficulty` (VARCHAR(20))
    *   `estimated_hours` (INT)

### 2.3. `user_github_profiles` Table (Phase 5 Extension)
*   **Purpose**: Stores student linked GitHub profiles.
*   **Columns**:
    *   `user_id` (INT, Foreign Key referencing `users.id`)
    *   `github_username` (VARCHAR(100))
    *   `avatar_url` (VARCHAR(255))
    *   `public_repos` (INT)
    *   `followers` (INT)
    *   `total_stars` (INT)
    *   `total_commits` (INT)
    *   `last_synced` (TIMESTAMP)

### 2.4. `github_repositories` Table (Phase 5 Extension)
*   **Purpose**: Repos imported from student's GitHub accounts.
*   **Columns**:
    *   `id` (INT, Primary Key, Auto-increment)
    *   `user_id` (INT, Foreign Key referencing `users.id`)
    *   `name` (VARCHAR(100))
    *   `description` (TEXT)
    *   `html_url` (VARCHAR(255))
    *   `language` (VARCHAR(50))
    *   `stars` (INT)
    *   `forks` (INT)
    *   `is_pinned` (TINYINT)
    *   `is_hidden` (TINYINT)

### 2.5. `portfolio_views` Table (Phase 5 Extension)
*   **Purpose**: Logs visitor views on developer portfolios.
*   **Columns**:
    *   `id` (INT, Primary Key, Auto-increment)
    *   `portfolio_user_id` (INT, Foreign Key referencing `users.id`)
    *   `viewer_ip` (VARCHAR(45))
    *   `viewed_at` (TIMESTAMP)

---

## 3. Database Migration Sequence

The application executes the following migrations sequentially on server boot (defined in `/backend/config/`):

1.  **`migrate_phase1.js`**: Core tables (`users`, `roadmaps`, `modules`, `lessons`).
2.  **`migrate_phase2.js`**: Analytics, activity history, and smart review feeds.
3.  **`migrate_phase3.js`**: Security audit log, lockouts, and rate limiter.
4.  **`migrate_phase4.js`**: Portfolio core templates, resume layouts, and bookmarks.
5.  **`migrate_phase5.js`**: GitHub profile mappings, repo sync caches, and visitor click logs.
