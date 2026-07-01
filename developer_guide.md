# EduNet Developer Guide

Welcome to the EduNet codebase! This guide onboarding manual provides all developer-related specs, code conventions, MVC extension steps, and local validation test flows.

---

## 1. Directory Structure Details

```text
├── css/                 # View-specific styles extending index.css
├── js/                  # Frontend scripts, modules, and API layers
├── backend/
│   ├── config/          # MySQL connection pool configs & schema migrations
│   ├── controllers/     # Express route handlers processing model queries
│   ├── middleware/      # Request filters (JWT auth check, XSS escaping, validation chains)
│   ├── models/          # Relational SQL transaction helpers
│   ├── routes/          # API resource routes
│   └── server.js        # Express HTTP server setup and graceful shutdown handlers
```

---

## 2. Coding Standards & Conventions

To maintain a clean and reliable codebase, follow these rules:

*   **Strict Mode**: Use `'use strict';` in all JavaScript files.
*   **Variable Declarations**: Use `const` or `let`. Do not use `var` for block scopes.
*   **Asynchronous Actions**: Prefer `async / await` over nested `.then()` promises.
*   **Database Interactions**: Use connection pools (`db.js`) instead of manual connection closures.
*   **Input Sanitization**: Always sanitize user bodies and queries. Use the Express sanitize middleware and validate schemas with `express-validator` validators.

---

## 3. How to Extend the MVC Architecture

To add a new feature or API, follow these three steps in order:

### Step 1: Create a Migration (Database Schema update)
If the new feature requires a new database table or column:
1.  Navigate to `backend/config/`.
2.  Add table creation queries to a migration file (e.g., `migrate_phase6.js`).
3.  Require and trigger the migration at the top of `backend/server.js`.

### Step 2: Create a Model File
Create a new file under `backend/models/` to handle all database queries for this feature:
```javascript
'use strict';
const db = require('../config/db');

async function getFeatureData(userId) {
  const [rows] = await db.query('SELECT * FROM user_features WHERE user_id = ?', [userId]);
  return rows;
}

module.exports = { getFeatureData };
```

### Step 3: Create a Controller File
Create a new file under `backend/controllers/` to handle HTTP requests:
```javascript
'use strict';
const FeatureModel = require('../models/featureModel');

async function getUserFeature(req, res, next) {
  try {
    const data = await FeatureModel.getFeatureData(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getUserFeature };
```

### Step 4: Map the Routes
Map the controller action inside `backend/routes/` and mount the router in `backend/server.js`:
```javascript
'use strict';
const express = require('express');
const router = express.Router();
const FeatureController = require('../controllers/featureController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/feature', verifyToken, FeatureController.getUserFeature);

module.exports = router;
```

---

## 4. Testing Workflow

We maintain a comprehensive suite of automated verification scripts at `/backend/`:
*   `verify_phase1.js` through `verify_phase5.js`
*   `verify_backend.js`
*   `verify_final.js`

To run all tests locally before making a commit, run:
```bash
cd backend
node verify_phase1.js && node verify_phase2.js && node verify_phase3.js && node verify_phase4.js && node verify_phase5.js && node verify_backend.js && node verify_final.js
```
All tests must return success checks before merging your branch.
