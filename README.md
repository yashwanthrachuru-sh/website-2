# EduNet — B.Tech Adaptive Learning Network

EduNet is a premium, production-ready, feature-rich web platform designed for B.Tech engineering students, exam aspirants, and self-directed developers. It unifies study resources, structured roadmaps, interactive code execution sandboxes, AI career coaching, assessment tests, and automated developer portfolio hosting in an elegant dark-theme glassmorphism interface.

---

## 🚀 Features

*   **Interactive Roadmaps**: 24+ structured career paths with checkable milestones, progress percentages, and automated certificate generation.
*   **AI Coach & Study Blueprints**: Generate personalized learning timetables and calendar actions matching target job roles.
*   **AI Coding Mentor**: In-context AI debugging, complexity analysis, and practice question generation.
*   **ATS Resume Builder**: Build resumes, selections templates, and query compatibility indexes against targeted job descriptions.
*   **Developer Portfolios**: Dynamic developer landing pages displaying milestones, achievements, streaks, GitHub contributions, and interactive project catalogs.
*   **Quiz Center**: Timed assessments categorized by topic, XP points rewards, and rank positions.
*   **Coding Lab Sandbox**: Browser-based IDE supporting execution for JavaScript, Python, Java, C++, SQL, and HTML.

---

## 🛠 Tech Stack

*   **Frontend**: Vanilla HTML5, CSS3 (Glassmorphism), Vanilla ES6 JavaScript.
*   **Backend**: Node.js, Express.js.
*   **Database**: MySQL 8.0 (MySQL2 connection pool).
*   **Security & Safety**: Helmet CSP, Express-Rate-Limit, express-validator, input XSS sanitizers.
*   **Third-Party Integrations**: OpenAI API (GPT-4o-mini), GitHub API.

---

## 📂 Folder Structure

```text
├── assets/                  # Public static assets, images, and brand icons
├── css/                     # Subdirectory containing theme-specific CSS
│   ├── coach.css            # Styles for the AI Coach view
│   └── portfolio.css        # Styles for the Portfolio page
├── js/                      # Frontend JavaScript files (modules)
│   ├── api.js               # Common API connection layer
│   ├── index.js             # Landing page event handlers
│   ├── user.js              # Student dashboard renderer
│   ├── coding-lab.js        # Compiler workspace actions
│   └── page-shell.js        # Sidebar/Topbar layout manager
├── backend/                 # Node.js backend application
│   ├── config/              # MySQL connection and migrations
│   ├── controllers/         # MVC Controller handlers
│   ├── middleware/          # JWT auth, rate limits, XSS sanitizer
│   ├── models/              # Database schema access models
│   ├── routes/              # Express API endpoints
│   ├── server.js            # Express application entry point
│   └── package.json         # Node backend dependency packages
├── index.html               # Public landing page
├── user.html                # Student workspace dashboard
├── roadmaps.html            # Roadmaps listing
├── coding-lab.html          # Sandbox compiler lab
├── resume.html              # CV editor
├── portfolio.html           # Developer portfolio host
├── vercel.json              # Static deployment routing rules
└── database.sql             # Relational MySQL tables and seed data
```

---

## 🔧 Installation & Database Setup

### 1. Database Provisioning
Install MySQL 8.0 locally or provision a database on **Railway**. Load the schema from `database.sql`:
```bash
mysql -u root -p -h localhost -P 3306 < database.sql
```

### 2. Configure Environment Variables
Inside `/backend`, copy `.env.example` to `.env` and fill in:
```ini
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=edunet
JWT_SECRET=super_secret_session_key
JWT_EXPIRES_IN=7d
FRONTEND_ORIGIN=http://localhost:5000
OPENAI_API_KEY=your_openai_key
```

### 3. Install Dependencies & Launch
Navigate to `/backend`, install packages, and start the development server:
```bash
cd backend
npm install
npm run dev
```
Open `http://localhost:5000` in your web browser.

---

## 🌐 Production Deployment

*   **Database**: Deploy on **Railway** (copy the provisioned `DATABASE_URL`).
*   **Backend API**: Deploy `/backend` on **Render** as a Web Service. Add environment variables. Set Health Check path to `/api/health`.
*   **Frontend UI**: Deploy the root folder on **Vercel**. Update `PRODUCTION_API_BASE` in `js/api.js` to point to Render.

---

## 🛣 Future Roadmap

*   **Phase 1 — Community Forums**: Peer study groups and chat rooms for branches.
*   **Phase 2 — Mock Interview Video Analytics**: Real-time camera evaluation during interview mock rounds.
*   **Phase 3 — Interactive DSA Debugger**: Visual call-stack debugger inside the Coding Lab.

---

## 💡 FAQ & Troubleshooting

#### Q: The login forms load but clicking submit fails.
Ensure the backend API server is running on port `5000` and the MySQL service is active. Check your browser Console logs (F12) to trace connection errors.

#### Q: Render backend displays DB timeout errors.
Ensure `DATABASE_URL` is correct in Render variables. Check if you whitelisted your Render IPs in Railway, or use internal private networks.

---

## 📄 License
This project is licensed under the ISC License.
