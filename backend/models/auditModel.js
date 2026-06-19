// ============================================================
// models/auditModel.js — Database Queries for audit_logs Table
// ============================================================
// Every significant action (login, logout, tool approval, etc.)
// is written here to maintain a verifiable audit trail.
// ============================================================

const db = require('../config/db');

// ── Insert a new audit log entry ─────────────────────────────
const addLog = async (actor, action) => {
  await db.query(
    'INSERT INTO audit_logs (actor, action) VALUES (?, ?)',
    [actor, action]
  );
};

// ── Get all logs (newest first — for admin panel) ─────────────
const getAllLogs = async () => {
  const [rows] = await db.query(
    'SELECT id, timestamp, actor, action FROM audit_logs ORDER BY timestamp DESC'
  );
  return rows;
};

// ── Get recent N logs (for dashboard widget) ─────────────────
const getRecentLogs = async (limit = 10) => {
  const [rows] = await db.query(
    'SELECT id, timestamp, actor, action FROM audit_logs ORDER BY timestamp DESC LIMIT ?',
    [limit]
  );
  return rows;
};

module.exports = { addLog, getAllLogs, getRecentLogs };
