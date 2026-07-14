# EduNet Production Deployment Guide

This document consolidates the complete architecture and instructions for deploying the EduNet learning platform to production.

---

## 1. Production URLs

| Service  | URL |
|----------|-----|
| **Frontend** | https://edunet-seven.vercel.app |
| **Backend**  | https://edunet-yx17.onrender.com |

These are the **only** production URLs. Every API call, share link, QR code, and CORS configuration must use these exact URLs.

---

## 2. Deployment Architecture

```mermaid
graph TD
    User([Student / Recruiter]) -->|Static Assets| Vercel[Vercel<br/>edunet-seven.vercel.app]
    User -->|API Requests| Render[Render Backend API<br/>edunet-yx17.onrender.com]
    Render -->|SQL Queries| Railway[(Railway MySQL Database)]
```

*   **Frontend**: Hosted on **Vercel** as a static web application.
*   **Backend**: Hosted on **Render** as a Node.js Express service.
*   **Database**: Hosted on **Railway** as a MySQL 8.0 instance.

---

## 3. Configuration Settings

### Backend Environment Variables (Set in Render Dashboard)

| Key | Production Value | Description |
|-----|-----------------|-------------|
| `NODE_ENV` | `production` | Prevents error stack traces from leaking |
| `PORT` | `10000` | Render-managed (do not change) |
| `DATABASE_URL` | `mysql://user:pass@host:port/dbname` | From Railway connection string |
| `JWT_SECRET` | `<64-byte random hex>` | Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_EXPIRES_IN` | `7d` | Token lifespan |
| `FRONTEND_ORIGIN` | `https://edunet-seven.vercel.app` | Exact Vercel frontend URL — no trailing slash |
| `OPENAI_API_KEY` | `sk-...` | Optional — smart offline mentor works without it |
| `RATE_LIMIT_WINDOW_MS` | `900000` | 15 minutes |
| `RATE_LIMIT_MAX` | `150` | Max requests per window per IP |

### Frontend API Configuration

The frontend API URL is centralized in `js/api.js` — **no changes needed**. It auto-detects the environment:

- **Local dev** → `http://localhost:5000`
- **Production (Vercel)** → `https://edunet-yx17.onrender.com`

---

## 4. Sub-Guides Directory

For detailed, step-by-step instructions on each service, refer to:
1.  **[Railway Database Setup Guide](railway_database_setup.md)**: Provisioning MySQL and importing `database.sql`.
2.  **[Render Backend Deployment Guide](render_deployment.md)**: Web service configs, health checking, and environment settings.
3.  **[Vercel Frontend Deployment Guide](vercel_setup.md)**: Static import, clean URLs, and portfolio redirects.
4.  **[Production Deployment Checklist](deployment_checklist.md)**: Pre-flight and post-deployment checklist.

---

## 5. Troubleshooting & Common Errors

### Error A: `Cannot connect to server. Please make sure the backend is running.`
*   **Cause**: Render service is in cold-start sleep (free tier) or CORS is misconfigured.
*   **Fix**: Wait 20–30 seconds for Render to wake up. Verify `FRONTEND_ORIGIN` in Render dashboard matches `https://edunet-seven.vercel.app` exactly.

### Error B: `Not allowed by CORS`
*   **Cause**: The `FRONTEND_ORIGIN` env var in Render does not match the exact Vercel URL.
*   **Fix**: Go to Render dashboard → Environment → set `FRONTEND_ORIGIN=https://edunet-seven.vercel.app` (no trailing slash).

### Error C: `Access denied. No token provided.`
*   **Cause**: The user token was not saved, or was cleared (usually after session expiry).
*   **Fix**: Log in again. The frontend automatically stores tokens in `localStorage`.

### Error D: `MySQL connection failed: Access denied for user...`
*   **Cause**: Incorrect credentials in `DATABASE_URL`.
*   **Fix**: Re-verify the Railway connection string. Check for special characters in the password (URL-encode them if needed).

### Error E: Portfolio share links point to localhost
*   **Cause**: `FRONTEND_ORIGIN` env var is not set in Render.
*   **Fix**: Set `FRONTEND_ORIGIN=https://edunet-seven.vercel.app` in the Render dashboard. The backend falls back to the production URL if the env var is present.
