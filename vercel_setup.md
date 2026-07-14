# Vercel Frontend Deployment Guide

This guide details the procedure to deploy the static HTML/JS/CSS frontend of EduNet to Vercel.

**Frontend Production URL**: `https://edunet-seven.vercel.app`
**Backend Production URL**: `https://edunet-yx17.onrender.com`

---

## 1. Prerequisites
* A [Vercel account](https://vercel.com/).
* A GitHub repository containing the EduNet source code.
* The EduNet Render backend deployed and healthy at `https://edunet-yx17.onrender.com/api/health`.

---

## 2. Deploying on Vercel

1. **Import Project**:
   * Navigate to the Vercel Dashboard.
   * Click **Add New** and select **Project**.
   * Import your GitHub repository.

2. **Configure Settings**:
   * **Project Name**: `edunet-seven`
   * **Framework Preset**: `Other` (EduNet uses vanilla HTML/CSS/JS — no build step needed).
   * **Root Directory**: `./` (static files are in the repository root).
   * **Build Command**: Leave blank.
   * **Output Directory**: Leave blank (Vercel serves the root directory).

3. **No Frontend Environment Variables Needed**:
   * The backend URL is baked into `js/api.js` and auto-detects the environment.
   * You do **not** need to configure any Vercel environment variables.

---

## 3. Routing Configuration

The `vercel.json` at the repository root handles all routing:

```json
{
  "rewrites": [
    { "source": "/portfolio/:username",  "destination": "/portfolio.html" },
    { "source": "/(.*)",                 "destination": "/index.html" }
  ]
}
```

This ensures:
- `/portfolio/johndoe` → serves `portfolio.html` (SPA routing)
- Any direct URL (e.g. `/roadmaps`, `/profile`) on page refresh → serves `index.html`
- No 404 errors on Vercel when navigating to internal pages directly

---

## 4. Verify Deployment

After deployment, test the following:

1. Visit `https://edunet-seven.vercel.app` — confirm the landing page loads.
2. Open browser **DevTools → Network** and log in. Confirm API calls go to `https://edunet-yx17.onrender.com`.
3. Navigate to `https://edunet-seven.vercel.app/roadmaps` and **refresh** — confirm it loads without 404.
4. Visit a portfolio at `https://edunet-seven.vercel.app/portfolio/testuser` — confirm it loads.
5. Check the browser **Console** for any CORS errors.

---

## 5. API URL — How it Works

The API URL is centralized in `js/api.js`. No manual URL changes are needed after the initial setup:

| Environment | API Base URL |
|-------------|-------------|
| Vercel (production) | `https://edunet-yx17.onrender.com` |
| `localhost:5000` (served by Express) | `` (relative paths) |
| File open locally | `http://localhost:5000` |

The detection is automatic based on `window.location.hostname` and `window.location.port`.
