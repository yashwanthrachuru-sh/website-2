// ============================================================
// backend/middleware/rateLimiter.js — In-Memory Rate Limiting
// ============================================================
'use strict';

const ipRequests = new Map();

// Clear logs every 15 minutes to avoid memory accumulation
setInterval(() => {
  ipRequests.clear();
}, 15 * 60 * 1000);

const rateLimiter = (maxRequests, windowMs) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!ipRequests.has(ip)) {
      ipRequests.set(ip, []);
    }

    // Keep only requests within the window range
    const requests = ipRequests.get(ip).filter(time => now - time < windowMs);
    requests.push(now);
    ipRequests.set(ip, requests);

    if (requests.length > maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests from this IP. Please try again after some time.'
      });
    }
    next();
  };
};

module.exports = rateLimiter;
