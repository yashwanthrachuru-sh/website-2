// ============================================================
// middleware/authMiddleware.js — JWT Verification & Role Guards
// ============================================================
// Two middleware functions exported:
//
//   1. verifyToken  — reads the JWT from the Authorization header,
//                     verifies its signature, and attaches the
//                     decoded payload to req.user.
//                     Rejects with 401 if missing/invalid/expired.
//
//   2. requireAdmin — chains AFTER verifyToken. Rejects with 403
//                     if the authenticated user is not an admin.
//
// Usage in routes:
//   router.get('/profile', verifyToken, userController.getProfile);
//   router.get('/stats',   verifyToken, requireAdmin, adminController.getStats);
// ============================================================

const jwt = require('jsonwebtoken');

// ── 1. verifyToken ───────────────────────────────────────────
const verifyToken = (req, res, next) => {
  // The client must send: Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  // Extract the token part after "Bearer "
  const token = authHeader.split(' ')[1];

  try {
    // Verify signature and expiry using the secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload to request so downstream handlers
    // can access req.user.id, req.user.username, req.user.role
    req.user = decoded;
    next();
  } catch (err) {
    // jwt.verify throws if token is invalid OR expired
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// ── 2. requireAdmin ──────────────────────────────────────────
const requireAdmin = (req, res, next) => {
  // This middleware assumes verifyToken already ran and
  // populated req.user. If user isn't admin, block access.
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Administrator access required.'
    });
  }
  next();
};

module.exports = { verifyToken, requireAdmin };
