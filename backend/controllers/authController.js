// ============================================================
// controllers/authController.js — Register, Login, Logout
// ============================================================
// Business logic lives here. The controller:
//   1. Validates the request (via express-validator results)
//   2. Calls the model to interact with the database
//   3. Hashes passwords / verifies hashes with bcrypt
//   4. Signs & returns JWTs
//   5. Writes audit log entries
//   6. Sends the HTTP response
// ============================================================

const bcrypt               = require('bcrypt');
const jwt                  = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const userModel            = require('../models/userModel');
const auditModel           = require('../models/auditModel');

// Number of bcrypt salt rounds — 10 is the industry standard
// (higher = more secure but slower; 10 ≈ 100ms on modern hardware)
const SALT_ROUNDS = 10;

// ── Helper: build and sign a JWT for a user ──────────────────
const signToken = (user) => {
  return jwt.sign(
    {
      id:       user.id,
      username: user.username,
      role:     user.role,
      branch:   user.branch
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ============================================================
// POST /api/auth/register
// Body: { username, email, password, branch }
// ============================================================
const register = async (req, res) => {
  try {
    // ── 1. Check validation errors from express-validator ──
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg // Return first error only
      });
    }

    const { username, email, password, branch } = req.body;

    // ── 2. Check if username already exists ───────────────
    const existingUsername = await userModel.findByUsername(username);
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'Username is already taken.'
      });
    }

    // ── 3. Check if email already exists ──────────────────
    const existingEmail = await userModel.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered.'
      });
    }

    // ── 4. Hash the password with bcrypt ──────────────────
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // ── 5. Insert the new user into the database ──────────
    const newUserId = await userModel.createUser({
      username,
      email,
      password_hash,
      branch
    });

    // ── 6. Write audit log ────────────────────────────────
    await auditModel.addLog(username, `New user registered. Branch: ${branch}`);

    // ── 7. Respond with user info (without token) ─────────
    res.status(201).json({
      success: true,
      message: 'Registration successful. Your account is pending administrator approval before you can log in.',
      user: {
        id:       newUserId,
        username,
        email,
        branch,
        role: 'user',
        status: 'pending'
      }
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// ============================================================
// POST /api/auth/login
// Body: { username, password }
// username field accepts both username OR email
// ============================================================
const login = async (req, res) => {
  try {
    // ── 1. Validate inputs ────────────────────────────────
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { username, password } = req.body;

    // ── 2. Find user by username OR email ─────────────────
    let user = await userModel.findByUsername(username);
    if (!user) {
      user = await userModel.findByEmail(username); // Try email fallback
    }

    // ── 3. Generic "invalid credentials" — never reveal which field failed
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    // ── 4. Compare submitted password against stored hash ─
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    // ── 4.5. Check if user status is approved ─────────────
    if (user.status !== 'approved') {
      let statusMsg = 'Your account is waiting for admin approval.';
      if (user.status === 'pending') {
        statusMsg = 'Your account is waiting for admin approval.';
      } else if (user.status === 'rejected') {
        statusMsg = 'Your registration was rejected.';
      } else if (user.status === 'suspended') {
        statusMsg = 'Your account is suspended.';
      }
      return res.status(403).json({
        success: false,
        message: statusMsg
      });
    }

    // ── 5. Sign JWT ───────────────────────────────────────
    const token = signToken(user);

    // ── 6. Write audit log ────────────────────────────────
    await auditModel.addLog(user.username, 'Logged into the platform.');

    // ── 7. Respond — never send password_hash ────────────
    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id:       user.id,
        username: user.username,
        email:    user.email,
        branch:   user.branch,
        role:     user.role,
        status:   user.status
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// ============================================================
// POST /api/auth/logout
// Requires: Authorization: Bearer <token>
// ============================================================
// JWTs are stateless — the server has no session store to clear.
// "Logout" here means: write an audit log entry so admins can
// see who logged out and when. The client discards the token.
// For production, add a token blacklist (Redis) if needed.
// ============================================================
const logout = async (req, res) => {
  try {
    // req.user is set by verifyToken middleware
    const { username } = req.user;
    await auditModel.addLog(username, 'Logged out from platform.');

    res.json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ success: false, message: 'Server error during logout.' });
  }
};

module.exports = { register, login, logout };
