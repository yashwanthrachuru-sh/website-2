# EduNet Production Deployment Guide

This document consolidates the complete architecture and instructions for deploying the EduNet learning platform to production. 

---

## 1. Deployment Architecture

```mermaid
graph TD
    User([Student / Recruiter]) -->|Static Assets| Vercel[Vercel Frontend]
    User -->|API Requests| Render[Render Backend API]
    Render -->|SQL Queries| Railway[(Railway MySQL Database)]
```

*   **Frontend**: Hosted on **Vercel** as a static web application.
*   **Backend**: Hosted on **Render** as a Node.js Express service.
*   **Database**: Hosted on **Railway** as a MySQL 8.0 instance.

---

## 2. Configuration Settings

### Backend Environment Configuration
Configure these keys in Render's environment variable dashboard:
*   `NODE_ENV=production`
*   `PORT=10000` (Render binds automatically)
*   `DATABASE_URL=mysql://user:pass@host:port/dbname` (From Railway)
*   `JWT_SECRET=your_secure_random_key`
*   `FRONTEND_ORIGIN=https://your-frontend.vercel.app` (From Vercel)
*   `OPENAI_API_KEY=sk-...` (Optional)

### Frontend API URL Configuration
In `js/api.js`, update the production backend URL mapping before pushing to Vercel:
```javascript
const CONFIG = {
  PRODUCTION_API_BASE: 'https://your-backend.onrender.com' // Replace with your Render URL
};
```

---

## 3. Sub-Guides Directory

For detailed, step-by-step instructions on each service, refer to:
1.  **[Railway Database Setup Guide](file:///home/asta/Desktop/website-2/railway_database_setup.md)**: Provisoning MySQL and importing `database.sql`.
2.  **[Render Backend Deployment Guide](file:///home/asta/Desktop/website-2/render_deployment.md)**: Web service configs, health checking, and environment settings.
3.  **[Vercel Frontend Deployment Guide](file:///home/asta/Desktop/website-2/vercel_setup.md)**: Static import, clean URLs, and portfolio redirects.
4.  **[Production Deployment Checklist](file:///home/asta/Desktop/website-2/deployment_checklist.md)**: Pre-flight and post-deployment checklist.

---

## 4. Troubleshooting & Common Errors

### Error A: `Cannot connect to server. Please make sure the backend is running.`
*   **Cause**: The frontend in `js/api.js` is still trying to connect to `http://localhost:5000` instead of your Render URL, or the Render service is asleep (cold start).
*   **Fix**: Check that the Vercel deployment has the updated `PRODUCTION_API_BASE` value in `js/api.js`. Wait a few seconds for Render to wake up on the free tier.

### Error B: `Not allowed by CORS`
*   **Cause**: The backend's `FRONTEND_ORIGIN` variable does not match the actual Vercel URL, or Vercel is sending a request from a preview subdomain not allowed.
*   **Fix**: Update the `FRONTEND_ORIGIN` environment variable in the Render settings to match the exact protocol and hostname of your Vercel frontend.

### Error C: `Access denied. No token provided.`
*   **Cause**: The user token was not saved, or the token was cleared.
*   **Fix**: Log in again. The frontend automatically stores the token in `localStorage`.

### Error D: `MySQL connection failed: Access denied for user...`
*   **Cause**: Incorrect host/port/password credentials in `DATABASE_URL`.
*   **Fix**: Re-verify credentials in the Railway variables tab. Ensure the database string uses the correct password characters.
