# Vercel Frontend Deployment Guide

This guide details the procedure to deploy the static HTML/JS/CSS frontend of EduNet to Vercel.

---

## 1. Prerequisites
* A [Vercel account](https://vercel.com/).
* A GitHub repository containing the EduNet source code.
* The public URL of your deployed Render backend (e.g. `https://edunet-backend.onrender.com`).

---

## 2. Deploying on Vercel

1. **Import Project**:
   * Navigate to the Vercel Dashboard.
   * Click **Add New** and select **Project**.
   * Import your GitHub repository.

2. **Configure Settings**:
   * **Project Name**: `edunet-frontend`
   * **Framework Preset**: `Other` or `Vanilla` (EduNet uses vanilla CSS and JS).
   * **Root Directory**: `./` (The static HTML/CSS files are located at the root of the workspace).
   * **Build Command**: Leave blank (no build compilation needed).
   * **Output Directory**: `.` or leave default (Vercel will serve all root static assets).

3. **Routing Configuration**:
   * Ensure `vercel.json` exists in the repository root. Vercel automatically reads this file to configure redirects and clean URLs so that sub-paths like `/portfolio/:username` correctly map to `/portfolio.html`.

---

## 3. Configuring Backend URL Config

To connect your deployed frontend to the production Render backend, update the `PRODUCTION_API_BASE` setting in `/js/api.js`:

1. Open `js/api.js`.
2. Locate the `CONFIG` constant near the top:
   ```javascript
   const CONFIG = {
     PRODUCTION_API_BASE: 'https://edunet-backend.onrender.com' // Replace with your Render URL
   };
   ```
3. Commit and push this change to your repository. Vercel will automatically trigger a rebuild and redeploy the frontend with the corrected API endpoint.

---

## 4. Verification

After deployment, visit your Vercel URL (e.g. `https://edunet-frontend.vercel.app`):
* Try clicking **Sign in** or registering a user to verify the login forms connect and fetch data from your Render backend API.
* Visit a developer portfolio link (e.g. `/portfolio/john_doe`) to ensure the page resolves without throwing a Vercel 404 router error.
* Check your browser Console logs (F12) for any network connection or CORS block errors.
