# Render Backend Deployment Guide

This guide details the procedure to deploy the Node.js Express backend API of EduNet to Render.

---

## 1. Prerequisites
* A [Render account](https://render.com/).
* A GitHub repository containing the EduNet source code.
* A running database instance on Railway (with connection details ready).

---

## 2. Deploying on Render

1. **Create a Web Service**:
   * Navigate to the Render Dashboard.
   * Click **New +** and select **Web Service**.
   * Connect your GitHub account and select your repository.

2. **Configure Settings**:
   * **Name**: `edunet-backend`
   * **Region**: Select a region close to your user base.
   * **Branch**: `main` (or whichever branch holds your code).
   * **Runtime**: `Node`
   * **Root Directory**: `backend` (Crucial! The backend code is inside this subdirectory).
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`

3. **Configure Environment Variables**:
   Under the **Environment** tab, click **Add Environment Variable** and configure the following keys:

   | Key | Example Value | Description |
   |---|---|---|
   | `PORT` | `10000` | Port Render listens on (automatically managed by Render). |
   | `NODE_ENV` | `production` | Prevents backend error stack traces from leaking. |
   | `DATABASE_URL` | `mysql://...` | Connection URI string copied from Railway. |
   | `JWT_SECRET` | `your_secure_random_key` | Secret key used for signing user login tokens. |
   | `JWT_EXPIRES_IN` | `7d` | Token lifespan. |
   | `FRONTEND_ORIGIN` | `https://edunet-frontend.vercel.app` | Vercel production frontend origin URL. |
   | `OPENAI_API_KEY` | `sk-...` | Optional API key for AI Tutor queries. |

4. **Verify Health Checking**:
   * Under the **Advanced** settings, configure the **Health Check Path** to `/api/health`.
   * Render will monitor this path before directing production traffic to the container.

---

## 3. Verify Deployment

Once Render displays **Build Successful**, view your logs. You should see:
```text
✅ MySQL pool connected successfully.
⚡ Running database migration checks...
🎉 All migrations checked.
╔════════════════════════════════════════════╗
║       EduNet API Server — v2.0 Running    ║
║   http://localhost:10000                   ║
║   Environment: production                  ║
╚════════════════════════════════════════════╝
```

You can test the public URL of your service (e.g. `https://edunet-backend.onrender.com/api/health`) directly in the browser to verify it returns:
```json
{"success":true,"database":"connected","version":"2.0"}
```
