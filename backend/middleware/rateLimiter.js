// ============================================================
// backend/middleware/rateLimiter.js — In-Memory Rate Limiting
// ============================================================
'use strict';

const ipRequests = new Map();

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

    // Opportunistically prune inactive entries to prevent memory accumulation
    if (Math.random() < 0.05) {
      for (const [key, value] of ipRequests.entries()) {
        const active = value.filter(time => now - time < windowMs);
        if (active.length === 0) {
          ipRequests.delete(key);
        } else {
          ipRequests.set(key, active);
        }
      }
    }

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
