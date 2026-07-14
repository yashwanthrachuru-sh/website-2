# Render Backend Deployment Guide

This guide details the procedure to deploy the Node.js Express backend API of EduNet to Render.

**Backend Production URL**: `https://edunet-yx17.onrender.com`

---

## 1. Prerequisites
* A [Render account](https://render.com/).
* A GitHub repository containing the EduNet source code.
* A running database instance on Railway (with connection details ready).

---

## 2. Option A — Automatic Deployment via render.yaml

The repository includes a `render.yaml` file at the project root. Render can read this automatically:

1. Go to **Render Dashboard** → **New** → **Blueprint**.
2. Connect your GitHub repository.
3. Render will detect `render.yaml` and pre-configure the service.
4. Manually set the **secret** environment variables in the dashboard (those marked `sync: false`):
   - `DATABASE_URL` — copy from Railway
   - `JWT_SECRET` — generate a 64-byte random hex string

---

## 3. Option B — Manual Service Setup

1. **Create a Web Service**:
   * Navigate to the Render Dashboard.
   * Click **New +** and select **Web Service**.
   * Connect your GitHub account and select your repository.

2. **Configure Settings**:
   * **Name**: `edunet-yx17`
   * **Region**: Select a region close to your user base.
   * **Branch**: `main`
   * **Runtime**: `Node`
   * **Root Directory**: `backend` ← **Critical**: the server code is inside this subdirectory
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`

3. **Configure Environment Variables**:

   | Key | Value | Description |
   |-----|-------|-------------|
   | `PORT` | `10000` | Render-managed port |
   | `NODE_ENV` | `production` | Prevents stack traces from leaking |
   | `DATABASE_URL` | `mysql://user:pass@host:port/dbname` | From Railway |
   | `JWT_SECRET` | `<strong random key>` | 64-byte hex — never reuse dev key |
   | `JWT_EXPIRES_IN` | `7d` | Token lifespan |
   | `FRONTEND_ORIGIN` | `https://edunet-seven.vercel.app` | ← Exact Vercel URL |
   | `OPENAI_API_KEY` | `sk-...` | Optional |
   | `RATE_LIMIT_WINDOW_MS` | `900000` | 15 min |
   | `RATE_LIMIT_MAX` | `150` | Requests per window |

4. **Verify Health Checking**:
   * Under **Advanced** settings, set **Health Check Path** to `/api/health`.
   * Render will monitor this path before directing production traffic to the container.

---

## 4. Verify Deployment

Once Render displays **Build Successful**, test the health endpoint:

```
https://edunet-yx17.onrender.com/api/health
```

Expected response:
```json
{"success":true,"database":"connected","version":"2.0"}
```

---

## 5. Cold Start Warning (Free Tier)

Render free-tier services spin down after 15 minutes of inactivity. The first request after sleep may take 20–30 seconds. The frontend API client (`js/api.js`) handles this with a generic "Cannot connect to server" error that resolves on retry.

To avoid cold starts, upgrade to a paid Render plan or use an uptime monitor (e.g., UptimeRobot) to ping `/api/health` every 5 minutes.
