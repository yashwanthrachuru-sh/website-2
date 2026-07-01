# EduNet Production Deployment Checklist

Use this checklist to ensure all security settings, environment variables, database tables, and CORS configurations are correctly configured before launching EduNet in production.

---

## 1. Pre-Flight Configuration Checklist

- [ ] **Frontend Configuration**: The `PRODUCTION_API_BASE` variable inside `js/api.js` is set to the production Render backend URL.
- [ ] **Git Repository Cleanliness**: Verify that local `.env` and `node_modules` folders are ignored by Git (already managed by `.gitignore`).
- [ ] **Vercel Routing**: Verify `vercel.json` exists at the root of the project.

---

## 2. Environment Variables Checklist (Render Backend)

Ensure the Render backend environment dashboard has the following variables set:

- [ ] **`PORT`**: Set automatically by Render (usually `10000`).
- [ ] **`NODE_ENV`**: Set to `production` (exposes only safe, friendly errors to client).
- [ ] **`DATABASE_URL`**: Set to the full `mysql://` connection string copied from Railway.
- [ ] **`JWT_SECRET`**: Set to a long, cryptographically strong random string.
- [ ] **`JWT_EXPIRES_IN`**: Set to `7d`.
- [ ] **`FRONTEND_ORIGIN`**: Set to your Vercel frontend production domain URL (e.g. `https://edunet-frontend.vercel.app`).
- [ ] **`OPENAI_API_KEY`**: Set to your valid OpenAI API key (optional).

---

## 3. Database Deployment Checklist (Railway)

- [ ] **Database Provisioned**: Provisioned a MySQL database instance.
- [ ] **Table Schemas Loaded**: Executed `database.sql` to import the tables and default seed data.
- [ ] **Verify Connection Limit**: Railway variables tab displays connection string details.

---

## 4. Deployment Order Sequence

Follow this order to prevent connection failures during setup:

1. **Step 1: Railway Database**
   * Provision MySQL.
   * Import `database.sql`.
   * Keep the variables tab open for the `DATABASE_URL`.
2. **Step 2: Render Backend**
   * Deploy the `/backend` directory.
   * Provide the `DATABASE_URL` and `JWT_SECRET` variables.
   * Verify the startup logs show successful database pool connectivity.
   * Copy the public URL of the backend service (e.g., `https://edunet-backend.onrender.com`).
3. **Step 3: Update Frontend Configuration**
   * Update the `PRODUCTION_API_BASE` in `js/api.js` to match the backend URL.
   * Commit and push this change to your repository.
4. **Step 4: Vercel Frontend**
   * Import the repository on Vercel.
   * Deploy the static assets.
   * Update the Render backend's `FRONTEND_ORIGIN` variable if the Vercel URL was unknown initially.

---

## 5. Post-Deployment Verification Checklist

- [ ] **API Health Check**: Access `https://<your-backend>.onrender.com/api/health` and verify the status says: `{"success":true,"database":"connected","version":"2.0"}`.
- [ ] **CORS Verification**: Log in/Register on the frontend and confirm the browser does not throw any CORS resource errors.
- [ ] **Page Routing Check**: Navigate to `/portfolio/john_doe` directly on the browser tab to confirm Vercel rewrites load correctly.
- [ ] **Secure Headers**: Audit headers and confirm `X-Powered-By` is hidden.
