# EduNet Project Statistics

This report documents the quantitative footprint of the EduNet workspace, counting pages, routes, controllers, database schemas, and verification modules.

---

## 1. Frontend Statistics

*   **Total HTML Pages**: **17**
    *   `index.html` (Landing portal)
    *   `user.html` (Dashboard hub)
    *   `roadmaps.html` (Career listings)
    *   `roadmap-learn.html` (Milestone progress tracker)
    *   `ai-tools.html` (AI resources catalog)
    *   `coding-lab.html` (Compiler workspace sandbox)
    *   `quiz.html` (Assessments center)
    *   `resume.html` (ATS builder)
    *   `interview.html` (AI interviewer mock portal)
    *   `certificates.html` (XP milestones catalog)
    *   `leaderboard.html` (Rankings index)
    *   `bookmarks.html` (Saved items index)
    *   `notifications.html` (Alerts history)
    *   `profile.html` (Student CV profile settings)
    *   `settings.html` (System configurations)
    *   `admin.html` (Moderation console)
    *   `portfolio.html` (Developer landing page)
*   **Total JavaScript Files**: **19** (corresponding module scripts in `js/`)
*   **Total CSS Style Files**: **3** (`index.css`, `css/coach.css`, `css/portfolio.css`)

---

## 2. Backend Statistics

*   **Total Express Resource Routers**: **8**
    *   `authRoutes.js`
    *   `userRoutes.js`
    *   `adminRoutes.js`
    *   `coachRoutes.js`
    *   `challengeRoutes.js`
    *   `portfolioRoutes.js`
    *   `resumeRoutes.js`
    *   `analyticsRoutes.js`
*   **Total MVC Controllers**: **8**
    *   `authController.js`
    *   `userController.js`
    *   `adminController.js`
    *   `coachController.js`
    *   `challengeController.js`
    *   `portfolioController.js`
    *   `resumeController.js`
    *   `analyticsController.js`
*   **Total Middleware Layers**: **5** (`authMiddleware.js`, `rateLimiter.js`, `sanitizeMiddleware.js`, `uploadMiddleware.js`, `validateMiddleware.js`)

---

## 3. Database & Operations Statistics

*   **Total MySQL Tables**: **24**
*   **Total Schema Migration Modules**: **6** (`migrate_phase1.js` through `migrate_phase5.js` and `migrate_portfolio.js`)
*   **Total Automated Verification Scripts**: **7** (`verify_phase1.js` through `verify_phase5.js`, `verify_backend.js`, `verify_final.js`)
*   **Total Environment Files**: **2** (`.env.example`, `.gitignore`)
