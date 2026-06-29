// ============================================================
// backend/verify_portfolio.js
// Automated verification tests for Developer Portfolio Module
// ============================================================
'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mysql = require('mysql2/promise');
const http = require('http');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

// Helper to make HTTP requests
function request(method, path, body = null, token = null) {
  return new Promise((resolve) => {
    const url = new URL(BASE_URL + path);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: headers
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    });

    req.on('error', err => resolve({ status: 500, body: { success: false, message: err.message } }));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('🔍 Running Developer Portfolio verification checks...\n');

  // 1. Verify database tables exist
  let conn;
  try {
    conn = await mysql.createConnection({
      host:     process.env.DB_HOST || 'localhost',
      port:     parseInt(process.env.DB_PORT) || 3306,
      user:     process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'edunet'
    });
    console.log('✅ MySQL database is connected.');

    const tables = [
      'portfolio_settings', 'portfolio_socials', 'portfolio_resume',
      'portfolio_projects', 'portfolio_skills'
    ];

    for (const t of tables) {
      const [rows] = await conn.query(`SHOW TABLES LIKE '${t}'`);
      if (rows.length > 0) {
        console.log(`   ✓ Table \`${t}\` exists in database.`);
      } else {
        throw new Error(`Table \`${t}\` is missing!`);
      }
    }
  } catch (err) {
    console.error('❌ Database schema verification failed:', err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }

  // 2. Fetch token for test user "student"
  console.log('\n2. Authenticating test user (student)...');
  const loginRes = await request('POST', '/api/auth/login', {
    username: 'student',
    password: 'student123'
  });

  if (loginRes.status !== 200 || !loginRes.body.success) {
    console.error('❌ Authentication failed. Make sure the backend server is running and seeded.');
    process.exit(1);
  }

  const token = loginRes.body.token;
  console.log('   ✅ Authenticated successfully.');

  // 3. Test GET /api/portfolio (Private)
  console.log('\n3. Testing GET /api/portfolio (Owner Private)...');
  const getPort = await request('GET', '/api/portfolio', null, token);
  if (getPort.status === 200 && getPort.body.success) {
    console.log('   ✅ GET /api/portfolio passed.');
  } else {
    console.error('   ❌ GET /api/portfolio FAILED. Status:', getPort.status, getPort.body);
    process.exit(1);
  }

  // 4. Test PUT /api/portfolio/settings (Private)
  console.log('\n4. Testing PUT /api/portfolio/settings (Owner Settings update)...');
  const updateSettings = await request('PUT', '/api/portfolio/settings', {
    headline: 'Aspiring Full Stack Engineer',
    current_role: 'Trainee',
    years_learning: '1 year',
    location: 'Chennai, India',
    github_url: 'https://github.com/john_doe'
  }, token);

  if (updateSettings.status === 200 && updateSettings.body.success) {
    console.log('   ✅ PUT /api/portfolio/settings passed.');
  } else {
    console.error('   ❌ PUT /api/portfolio/settings FAILED. Status:', updateSettings.status, updateSettings.body);
    process.exit(1);
  }

  // 5. Test Projects CRUD: POST /api/portfolio/project -> PUT -> DELETE
  console.log('\n5. Testing Projects CRUD endpoints...');
  let projectId;
  
  // POST Create
  const createProj = await request('POST', '/api/portfolio/project', {
    title: 'Dynamic Web Dashboard',
    description: 'A responsive real-time operations dashboard built with React and Express.',
    tech_stack: 'React, Express, Chart.js',
    github_link: 'https://github.com/john/dash',
    difficulty: 'Medium',
    status: 'Completed'
  }, token);

  if (createProj.status === 200 && createProj.body.success) {
    projectId = createProj.body.projectId;
    console.log(`   ✅ POST /api/portfolio/project passed. Project ID: ${projectId}`);
  } else {
    console.error('   ❌ POST /api/portfolio/project FAILED. Status:', createProj.status, createProj.body);
    process.exit(1);
  }

  // PUT Update
  const updateProj = await request('PUT', `/api/portfolio/project/${projectId}`, {
    title: 'Dynamic Web Dashboard v2',
    description: 'Updated descriptions.',
    tech_stack: 'React, Express, Chart.js, MySQL'
  }, token);

  if (updateProj.status === 200 && updateProj.body.success) {
    console.log('   ✅ PUT /api/portfolio/project/:id passed.');
  } else {
    console.error('   ❌ PUT /api/portfolio/project/:id FAILED. Status:', updateProj.status, updateProj.body);
    process.exit(1);
  }

  // DELETE Project
  const deleteProj = await request('DELETE', `/api/portfolio/project/${projectId}`, null, token);
  if (deleteProj.status === 200 && deleteProj.body.success) {
    console.log('   ✅ DELETE /api/portfolio/project/:id passed.');
  } else {
    console.error('   ❌ DELETE /api/portfolio/project/:id FAILED. Status:', deleteProj.status, deleteProj.body);
    process.exit(1);
  }

  // 6. Test GET /api/portfolio/analytics
  console.log('\n6. Testing GET /api/portfolio/analytics...');
  const getAnal = await request('GET', '/api/portfolio/analytics', null, token);
  if (getAnal.status === 200 && getAnal.body.success) {
    console.log('   ✅ GET /api/portfolio/analytics passed.');
  } else {
    console.error('   ❌ GET /api/portfolio/analytics FAILED. Status:', getAnal.status, getAnal.body);
    process.exit(1);
  }

  // 7. Test GET /api/portfolio/public/:username (Public view)
  console.log('\n7. Testing GET /api/portfolio/public/student (Public Unauthenticated)...');
  const getPublic = await request('GET', '/api/portfolio/public/student');
  if (getPublic.status === 200 && getPublic.body.success) {
    console.log('   ✅ GET /api/portfolio/public/student passed.');
    if (getPublic.body.user.email) {
      console.error('   ❌ Security warning: Public API exposed direct email without toggle filtering validation.');
      process.exit(1);
    }
    console.log('   ✓ Checked: Public email visibility security filters applied.');
  } else {
    console.error('   ❌ GET /api/portfolio/public/student FAILED. Status:', getPublic.status, getPublic.body);
    process.exit(1);
  }

  console.log('\n🎉 ALL PORTFOLIO API VERIFICATIONS PASSED SUCCESSFULLY!');
  process.exit(0);
}

runTests();
