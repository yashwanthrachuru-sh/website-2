// ============================================================
// verify_backend.js — Automated Backend Integration & DB Audit
// ============================================================
const mysql = require('mysql2/promise');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000';

const tables = [
  'users',
  'roadmaps',
  'roadmap_progress',
  'courses',
  'modules',
  'lessons',
  'ai_tools',
  'tool_categories',
  'videos',
  'questions',
  'tests',
  'results',
  'bookmarks',
  'leaderboard',
  'notifications',
  'saved_programs',
  'code_snippets',
  'language_templates'
];

async function runTests() {
  console.log('🏁 Starting Backend API & Database Verification...\n');
  const report = [];
  let allPassed = true;

  const dbConfig = {
    host:     process.env.DB_HOST || 'localhost',
    port:     parseInt(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'edunet'
  };

  // ── PART 1: Database Table Counts ───────────────────────────
  console.log('📊 PART 1: Auditing Database Row Counts...');
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully.');
    for (const table of tables) {
      const [rows] = await conn.query(`SELECT COUNT(*) AS count FROM \`${table}\``);
      const count = rows[0].count;
      console.log(`  - Table "${table}": ${count} rows`);
      report.push({ type: 'DB_COUNT', name: table, status: 'PASSED', count });
    }
  } catch (err) {
    console.error('❌ Database connection or count query failed:', err.message);
    allPassed = false;
    report.push({ type: 'DB_CONN', status: 'FAILED', message: err.message });
  } finally {
    if (conn) await conn.end();
  }
  console.log('');

  // ── PART 2: Endpoint testing functions ─────────────────────
  async function testGet(path, token = null) {
    const url = BASE_URL + path;
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(url, { method: 'GET', headers });
      const status = res.status;
      const body = await res.json();
      const passed = status >= 200 && status < 300;
      return { path, status, body, passed };
    } catch (err) {
      return { path, status: 'ERROR', body: err.message, passed: false };
    }
  }

  async function testPost(path, bodyObj, token = null) {
    const url = BASE_URL + path;
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(bodyObj)
      });
      const status = res.status;
      const body = await res.json();
      const passed = status >= 200 && status < 300;
      return { path, status, body, passed };
    } catch (err) {
      return { path, status: 'ERROR', body: err.message, passed: false };
    }
  }

  // ── PART 3: Execute Endpoint Testing ────────────────────────
  console.log('🔌 PART 3: Verifying HTTP Endpoints...');

  // 1. Health check
  const healthTest = await testGet('/api/health');
  console.log(`\nGET /api/health`);
  console.log(`  HTTP Status: ${healthTest.status}`);
  console.log(`  Response Body: ${JSON.stringify(healthTest.body)}`);
  report.push({ name: 'GET /api/health', status: healthTest.passed ? 'PASSED' : 'FAILED', response: healthTest });
  if (!healthTest.passed) allPassed = false;

  // 2. Authentication Login (Student)
  const studentLogin = await testPost('/api/auth/login', { username: 'student', password: 'student123' });
  console.log(`\nPOST /api/auth/login (Student)`);
  console.log(`  HTTP Status: ${studentLogin.status}`);
  console.log(`  Response Body: ${JSON.stringify(studentLogin.body)}`);
  report.push({ name: 'POST /api/auth/login (Student)', status: studentLogin.passed ? 'PASSED' : 'FAILED', response: studentLogin });
  if (!studentLogin.passed) allPassed = false;
  const studentToken = studentLogin.passed ? studentLogin.body.token : null;

  // 3. Authentication Login (Admin)
  const adminLogin = await testPost('/api/auth/login', { username: 'admin', password: 'admin123' });
  console.log(`\nPOST /api/auth/login (Admin)`);
  console.log(`  HTTP Status: ${adminLogin.status}`);
  report.push({ name: 'POST /api/auth/login (Admin)', status: adminLogin.passed ? 'PASSED' : 'FAILED', response: adminLogin });
  if (!adminLogin.passed) allPassed = false;
  const adminToken = adminLogin.passed ? adminLogin.body.token : null;

  // 4. Authentication Login (Faculty)
  const facultyLogin = await testPost('/api/auth/login', { username: 'faculty', password: 'faculty123' });
  console.log(`\nPOST /api/auth/login (Faculty)`);
  console.log(`  HTTP Status: ${facultyLogin.status}`);
  report.push({ name: 'POST /api/auth/login (Faculty)', status: facultyLogin.passed ? 'PASSED' : 'FAILED', response: facultyLogin });
  if (!facultyLogin.passed) allPassed = false;
  const facultyToken = facultyLogin.passed ? facultyLogin.body.token : null;

  // 5. Registration
  const rand = Math.floor(Math.random() * 1000000);
  const registerTest = await testPost('/api/auth/register', {
    username: `test_user_${rand}`,
    email: `test_${rand}@edunet.com`,
    password: 'password123',
    branch: 'CSE'
  });
  console.log(`\nPOST /api/auth/register`);
  console.log(`  HTTP Status: ${registerTest.status}`);
  console.log(`  Response Body: ${JSON.stringify(registerTest.body)}`);
  report.push({ name: 'POST /api/auth/register', status: registerTest.passed ? 'PASSED' : 'FAILED', response: registerTest });
  if (!registerTest.passed) allPassed = false;

  // 6. GET /api/admin/users (Admin required)
  if (adminToken) {
    const adminUsers = await testGet('/api/admin/users', adminToken);
    console.log(`\nGET /api/admin/users (as Admin)`);
    console.log(`  HTTP Status: ${adminUsers.status}`);
    console.log(`  Response: Got ${adminUsers.body?.success ? adminUsers.body.users?.length : 0} users`);
    report.push({ name: 'GET /api/admin/users (Admin Auth)', status: adminUsers.passed ? 'PASSED' : 'FAILED', response: adminUsers });
    if (!adminUsers.passed) allPassed = false;
  }

  // 6b. GET /api/admin/users (Student - Should be Forbidden 403)
  if (studentToken) {
    const studentUsers = await testGet('/api/admin/users', studentToken);
    console.log(`\nGET /api/admin/users (as Student - Guard Check)`);
    console.log(`  HTTP Status: ${studentUsers.status} (Expected: 403)`);
    console.log(`  Response Body: ${JSON.stringify(studentUsers.body)}`);
    const passedGuard = studentUsers.status === 403;
    report.push({ name: 'GET /api/admin/users (Role Guard Check)', status: passedGuard ? 'PASSED' : 'FAILED', response: studentUsers });
    if (!passedGuard) allPassed = false;
  }

  // 7. GET /api/roadmaps
  if (studentToken) {
    const roadmaps = await testGet('/api/roadmaps', studentToken);
    console.log(`\nGET /api/roadmaps`);
    console.log(`  HTTP Status: ${roadmaps.status}`);
    console.log(`  Response: Got ${roadmaps.body?.success ? roadmaps.body.roadmaps?.length : 0} roadmaps`);
    report.push({ name: 'GET /api/roadmaps', status: roadmaps.passed ? 'PASSED' : 'FAILED', response: roadmaps });
    if (!roadmaps.passed) allPassed = false;
  }

  // 8. GET /api/tools
  if (studentToken) {
    const tools = await testGet('/api/tools', studentToken);
    console.log(`\nGET /api/tools`);
    console.log(`  HTTP Status: ${tools.status}`);
    console.log(`  Response: Got ${tools.body?.success ? tools.body.tools?.length : 0} tools`);
    report.push({ name: 'GET /api/tools', status: tools.passed ? 'PASSED' : 'FAILED', response: tools });
    if (!tools.passed) allPassed = false;
  }

  // 9. GET /api/videos
  if (studentToken) {
    const videos = await testGet('/api/videos', studentToken);
    console.log(`\nGET /api/videos`);
    console.log(`  HTTP Status: ${videos.status}`);
    console.log(`  Response: Got ${videos.body?.success ? videos.body.videos?.length : 0} videos`);
    report.push({ name: 'GET /api/videos', status: videos.passed ? 'PASSED' : 'FAILED', response: videos });
    if (!videos.passed) allPassed = false;
  }

  // 10. GET /api/quizzes
  if (studentToken) {
    const quizzes = await testGet('/api/quizzes', studentToken);
    console.log(`\nGET /api/quizzes`);
    console.log(`  HTTP Status: ${quizzes.status}`);
    console.log(`  Response: Got ${quizzes.body?.success ? quizzes.body.quizzes?.length : 0} quizzes`);
    report.push({ name: 'GET /api/quizzes', status: quizzes.passed ? 'PASSED' : 'FAILED', response: quizzes });
    if (!quizzes.passed) allPassed = false;
  }

  // 11. GET /api/code
  if (studentToken) {
    const code = await testGet('/api/code', studentToken);
    console.log(`\nGET /api/code`);
    console.log(`  HTTP Status: ${code.status}`);
    console.log(`  Response: Got templates=${code.body?.templates?.length || 0}, problems=${code.body?.problems?.length || 0}`);
    report.push({ name: 'GET /api/code', status: code.passed ? 'PASSED' : 'FAILED', response: code });
    if (!code.passed) allPassed = false;
  }

  // 12. GET /api/profile
  if (studentToken) {
    const profile = await testGet('/api/profile', studentToken);
    console.log(`\nGET /api/profile`);
    console.log(`  HTTP Status: ${profile.status}`);
    console.log(`  Response Body: ${JSON.stringify(profile.body)}`);
    report.push({ name: 'GET /api/profile', status: profile.passed ? 'PASSED' : 'FAILED', response: profile });
    if (!profile.passed) allPassed = false;
  }

  console.log('\n=======================================');
  console.log(allPassed ? '🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉' : '❌ SOME TESTS FAILED. PLEASE CHECK LOGS. ❌');
  console.log('=======================================\n');
  process.exit(allPassed ? 0 : 1);
}

runTests();
