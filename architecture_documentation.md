# EduNet Software Architecture & Design

This document details the system design, frontend layout, backend MVC pipelines, database interface layer, security wrappers, and AI module dataflows for the EduNet application.

---

## 1. Architectural Style Overview

EduNet uses an **MVC-inspired monolithic architecture** structured for ease of deployment, low network overhead, and high performance.

```text
┌──────────────────────────────────────────────────────────────┐
│                   STUDENT CLIENT BROWSER                     │
│  [HTML Layouts] <--> [ES6 JS Modules] <--> [Vanilla CSS]     │
└──────────────┬────────────────────────────────┬──────────────┘
               │                                │
        (Static Assets)                    (REST APIs)
               ▼                                ▼
┌──────────────────────────────┐┌──────────────────────────────┐
│        VERCEL ENGINE         ││      RENDER EXPRESS SERVICE  │
│  (Serves Static Files / SPA) ││  (Router -> Middleware ->)   │
└──────────────────────────────┘│  (Controller -> MySQL pool)  │
                                └──────────────┬───────────────┘
                                               │ (SQL Connection)
                                               ▼
                                ┌──────────────────────────────┐
                                │     RAILWAY MYSQL SERVICE     │
                                │   (18+ Tables, Pool Limit 10)│
                                └──────────────────────────────┘
```

---

## 2. Component Layouts

### 2.1. Frontend Architecture
The client interface is constructed using pure HTML5 and vanilla JavaScript modules:
*   **API Client Layer (`js/api.js`)**: Wraps common fetch queries with authorization headers, handles automatic JWT session pruning on 401 token expiration, and provides alerts tools.
*   **Page Shell Manager (`js/page-shell.js`)**: Dynamically mounts sidebar layouts, topbar headers, responsive hamburger interactions, and global indexing search lists across all 16 student modules.
*   **View Scripts (`js/user.js`, `js/roadmaps.js`, etc.)**: Bind event handlers, fetch backend REST API content asynchronously on page loads, and overwrite DOM elements with dynamic grids or loader shimmers.

### 2.2. Backend Architecture (MVC Pattern)
The API backend operates as an Express service containing:
*   **Routing Directory (`backend/routes/`)**: Map HTTP routes and binds security middlewares.
*   **Middleware Pipeline (`backend/middleware/`)**: Resolves JWT validations, checks active database user flags, escapes XSS inputs, and validates request parameters using `express-validator`.
*   **Controller Layer (`backend/controllers/`)**: Reads request bodies, fetches data models, performs computational analytics or calls AI endpoints, and returns JSON payloads.
*   **Database Models (`backend/models/`)**: Writes or reads database records using `mysql2/promise` SQL connection pools.

---

## 3. Core Workflows

### 3.1. Authentication Lifecycle
```text
[User Form Login] ────► [Express /api/auth/login]
                             │
                      (Checks User Approved & Password Match)
                             │
   [Store JWT & Session] ◄───┴─── (Generate Sign Token)
```
1.  **Registration**: A student submits credentials. The record is inserted with `status = 'pending'`.
2.  **Approval**: Administrators verify the student and set status to `approved`.
3.  **Sign-in**: On submission, the backend signs a JWT token including username and role. The client stores it in `localStorage` as `edunet_token`.
4.  **Authorized Queries**: All consecutive `apiFetch` queries append the token under the `Authorization: Bearer <Token>` header.
5.  **Access Guard**: Mid-route middleware queries the `users` table to confirm that the user remains approved.

### 3.2. AI Assistant Mentoring Flow
1.  **Request**: The student prompts the AI Mentor or Coach.
2.  **Context Construction**: The controller loads the student's recent roadmap module completions and average quiz scores.
3.  **Prompt Assembly**: The AI engine constructs a structured context prompt to feed the LLM model.
4.  **Execution**: Prompt is dispatched to the OpenAI API endpoint.
5.  **Fallback Blueprint**: If the `OPENAI_API_KEY` is missing or the external API call fails, the AI engine falls back to local heuristic study blueprints, ensuring service availability.
