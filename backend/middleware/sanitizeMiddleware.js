// ============================================================
// middleware/sanitizeMiddleware.js — Input HTML Sanitizer for XSS
// ============================================================
'use strict';

const sanitizeInput = (req, res, next) => {
  // Skip sanitization for code compiler/sandbox / save endpoints to avoid breaking programming source code
  const isCompilerRoute = req.path.includes('/run') ||
                          req.path.includes('/submit') ||
                          req.path.includes('/save');

  if (isCompilerRoute) {
    return next();
  }

  const sanitizeValue = (val) => {
    if (typeof val === 'string') {
      // Escape HTML tags to prevent XSS
      return val.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    if (Array.isArray(val)) {
      return val.map(sanitizeValue);
    }
    if (val !== null && typeof val === 'object') {
      const sanitizedObj = {};
      for (const key of Object.keys(val)) {
        sanitizedObj[key] = sanitizeValue(val[key]);
      }
      return sanitizedObj;
    }
    return val;
  };

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  next();
};

module.exports = { sanitizeInput };
