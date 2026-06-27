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
  countPendingUsers
};
