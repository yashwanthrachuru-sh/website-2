// ============================================================
// models/userModel.js — Database Queries for the users Table
// ============================================================
// Models contain ONLY SQL logic. No business logic here.
// Controllers call these functions and decide what to do
// with the results.
//
// All functions return promises (mysql2/promise pool).
// ============================================================

const db = require('../config/db');

// ── Find a user by username (used in login) ──────────────────
const findByUsername = async (username) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE username = ? LIMIT 1',
    [username]
  );
  return rows[0] || null; // Return the user object or null
};

// ── Find a user by email (used in login + duplicate check) ───
const findByEmail = async (email) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
};

// ── Find a user by ID (used in protected routes) ─────────────
const findById = async (id) => {
  const [rows] = await db.query(
    // Never return password_hash to the application layer
    'SELECT id, username, email, branch, role, status, created_at FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

// ── Create a new user (registration) ─────────────────────────
// password_hash should already be bcrypt-hashed by the controller
const createUser = async ({ username, email, password_hash, branch }) => {
  const [result] = await db.query(
    `INSERT INTO users (username, email, password_hash, branch, role, status)
     VALUES (?, ?, ?, ?, 'user', 'pending')`,
    [username, email, password_hash, branch]
  );
  // Return the newly inserted user's ID
  return result.insertId;
};

// ── Get all users (admin panel — without password_hash) ──────
const getAllUsers = async () => {
  const [rows] = await db.query(
    'SELECT id, username, email, branch, role, status, created_at FROM users ORDER BY created_at DESC'
  );
  return rows;
};

// ── Count total registered users (admin stats) ───────────────
const countUsers = async () => {
  const [rows] = await db.query(
    'SELECT COUNT(*) AS total FROM users'
  );
  return rows[0].total;
};

// ── Update user status (approve, reject, suspend, etc.) ──────
const updateStatus = async (id, status) => {
  const [result] = await db.query(
    'UPDATE users SET status = ? WHERE id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
};

// ── Update user role (promote to admin/moderator, demote) ──────
const updateRole = async (id, role) => {
  const [result] = await db.query(
    'UPDATE users SET role = ? WHERE id = ?',
    [role, id]
  );
  return result.affectedRows > 0;
};

// ── Delete a user ────────────────────────────────────────────
const deleteUser = async (id) => {
  const [result] = await db.query(
    'DELETE FROM users WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

// ── Count pending users (admin stats) ────────────────────────
const countPendingUsers = async () => {
  const [rows] = await db.query(
    "SELECT COUNT(*) AS total FROM users WHERE status = 'pending'"
  );
  return rows[0].total;
};

// ── Award XP, update level, increment active streak and log activity ──
const awardXPAndIncrementStreak = async (userId, amount, sourceKey) => {
  const today = new Date().toISOString().slice(0, 10);

  // If sourceKey is provided, check the xp_ledger first
  if (sourceKey) {
    try {
      await db.query(
        'INSERT INTO xp_ledger (user_id, source, amount) VALUES (?, ?, ?)',
        [userId, sourceKey, amount]
      );
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        // Already claimed, fetch current values to return gracefully
        const [[current]] = await db.query('SELECT xp, level FROM users WHERE id = ?', [userId]);
        return {
          xp: current.xp,
          level: current.level,
          added: 0,
          already_claimed: true
        };
      }
      throw e;
    }
  }

  // Add XP and recalculate level (every 500 XP = 1 level)
  await db.query(`
    UPDATE users
    SET xp    = xp + ?,
        level = FLOOR((xp + ?) / 500) + 1
    WHERE id = ?
  `, [amount, amount, userId]);

  // Update streak and last_active_date
  await db.query(`
    UPDATE users
    SET last_active_date = ?,
        streak = CASE
          WHEN last_active_date = DATE_SUB(?, INTERVAL 1 DAY) THEN streak + 1
          WHEN last_active_date = ? THEN streak
          ELSE 1
        END,
        longest_streak = GREATEST(longest_streak,
          CASE
            WHEN last_active_date = DATE_SUB(?, INTERVAL 1 DAY) THEN streak + 1
            WHEN last_active_date = ? THEN streak
            ELSE 1
          END
        )
    WHERE id = ?
  `, [today, today, today, today, today, userId]).catch(async () => {
    // Fallback: run basic update if table doesn't have last_active_date or similar constraint
    await db.query('UPDATE users SET streak = LEAST(streak + 1, 999) WHERE id = ?', [userId]);
  });

  // Log to user_activity
  await db.query(`
    INSERT INTO user_activity (user_id, date, xp_earned)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE xp_earned = xp_earned + VALUES(xp_earned)
  `, [userId, today, amount]).catch(() => { /* table may not exist yet */ });

  // Fetch and return updated values
  const [[updated]] = await db.query('SELECT xp, level FROM users WHERE id = ?', [userId]);
  return {
    xp: updated.xp,
    level: updated.level,
    added: amount,
    already_claimed: false
  };
};

module.exports = {
  findByUsername,
  findByEmail,
  findById,
  createUser,
  getAllUsers,
  countUsers,
  updateStatus,
  updateRole,
  deleteUser,
  countPendingUsers,
  awardXPAndIncrementStreak
};

