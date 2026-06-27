// ============================================================
// config/db.js — MySQL2 Connection Pool
// ============================================================
// Why a pool?
//   A pool keeps multiple reusable connections alive so the
//   server doesn't open/close a new TCP connection on every
//   single SQL query. This is the standard production pattern.
// ============================================================

const mysql = require('mysql2/promise');
require('dotenv').config();

// Create the connection pool using environment variables
const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  port:               parseInt(process.env.DB_PORT, 10),
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  database:           process.env.DB_NAME,
  waitForConnections: true,   // Queue queries if all connections are busy
  connectionLimit:    10,     // Maximum simultaneous connections
  queueLimit:         0,      // Unlimited queue (0 = no limit)
  timezone:           '+00:00' // Store timestamps in UTC
});

// ── Test the connection on startup ──────────────────────────
// This immediately grabs one connection from the pool,
// runs a ping, and releases it. If MySQL isn't running or
// credentials are wrong, the error surfaces on boot — not
// silently during a live request.
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅  MySQL pool connected successfully.');
    conn.release();
  } catch (err) {
    console.error('❌  MySQL connection failed:', err.message);
    console.error('    Server will start but database queries will fail.');
    console.error('    Fix: Check DB_USER, DB_PASSWORD, DB_HOST in backend/.env');
    // Do NOT exit — let the server start so we can serve helpful error messages
  }
}

testConnection();

// Export the pool so every model can import and use it
module.exports = pool;
