// ============================================================
// backend/verify_final.js
// Final production-ready verification script for EduNet
// ============================================================
'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mysql = require('mysql2/promise');
const http = require('http');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

function get(path) {
  return new Promise((resolve) => {
    http.get(BASE_URL + path, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    }).on('error', err => resolve({ status: 500, body: { success: false, message: err.message } }));
  });
}

async function run() {
  console.log('🔍 Running final verification checks...\n');

  // 1. Check database connectivity and rows
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
      'roadmaps', 'roadmap_modules', 'module_lessons', 'lesson_videos',
      'lesson_resources', 'lesson_exercises', 'lesson_challenges', 'lesson_quizzes',
      'lesson_projects', 'lesson_notes'
    ];

    for (const t of tables) {
      const [[res]] = await conn.query(`SELECT COUNT(*) AS cnt FROM \`${t}\``);
      console.log(`   ✓ Table \`${t}\` has ${res.cnt} rows.`);
    }
  } catch (err) {
    console.error('❌ Database verification failed:', err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }

  console.log('\n2. Testing REST API Endpoints...');

  const endpoints = [
    ['GET /api/health', '/api/health'],
    ['GET /api/roadmaps', '/api/roadmaps'],
    ['GET /api/roadmaps/webdev', '/api/roadmaps/webdev'],
    ['GET /api/roadmaps/webdev/modules', '/api/roadmaps/webdev/modules'],
    ['GET /api/lessons/1', '/api/lessons/1'],
    ['GET /api/lessons/1/videos', '/api/lessons/1/videos'],
    ['GET /api/lessons/1/resources', '/api/lessons/1/resources'],
    ['GET /api/lessons/1/exercises', '/api/lessons/1/exercises'],
    ['GET /api/lessons/1/quizzes', '/api/lessons/1/quizzes'],
    ['GET /api/roadmaps/webdev/exam', '/api/roadmaps/webdev/exam'],
    ['GET /api/certificates/verify/invalidhash', '/api/certificates/verify/invalidhash'],
    ['GET /api/roadmaps/search?q=python', '/api/roadmaps/search?q=python']
  ];

  let allOk = true;
  for (const [label, path] of endpoints) {
    const res = await get(path);
    const isVerifyFailCheck = path.includes('/verify/invalidhash');
    const ok = isVerifyFailCheck 
      ? res.status === 404 && res.body.success === false 
      : res.status === 200 && res.body.success !== false;

    if (ok) {
      console.log(`   ✅ ${label} passed.`);
    } else {
      console.error(`   ❌ ${label} FAILED. Status: ${res.status}, Error:`, JSON.stringify(res.body));
      allOk = false;
    }
  }

  if (allOk) {
    console.log('\n🎉 ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.error('\n❌ SOME VERIFICATION CHECKS FAILED.');
    process.exit(1);
  }
}

run();
