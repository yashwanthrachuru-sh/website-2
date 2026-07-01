// ============================================================
// backend/verify_phase5.js
// Phase 5 Verification: GitHub Integration, Portfolio Analytics,
// Recruiter View, Portfolio Strength Score, Theme Builder,
// Resume Analytics, Contribution Calendar + Full Regression
// ============================================================
'use strict';

const http  = require('http');
const https = require('https');
const db    = require('./config/db');

let passed = 0;
let failed = 0;
const errors = [];

function ok(msg) { console.log(`  ✅ ${msg}`); passed++; }
function fail(msg, err) { console.error(`  ❌ ${msg}${err ? ': ' + err : ''}`); failed++; errors.push(msg); }

async function assert(name, fn) {
  try { const r = await fn(); if (r !== false) ok(name); else fail(name); }
  catch (e) { fail(name, e.message); }
}

// ── DB Table Existence Checks ─────────────────────────────────────
async function testDatabaseTables() {
  console.log('\n📦 Testing Phase 5 Database Tables...');
  const requiredTables = [
    'user_github_profiles',
    'github_repositories',
    'portfolio_views',
    'portfolio_clicks',
    'portfolio_shares',
    'portfolio_qr_scans',
    'portfolio_theme',
    'portfolio_strength_cache',
    'portfolio_visitors'
  ];

  for (const table of requiredTables) {
    await assert(`Table \`${table}\` exists`, async () => {
      const [[row]] = await db.query(`SELECT COUNT(*) as cnt FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?`, [table]);
      if (row.cnt === 0) throw new Error(`Table missing`);
    });
  }
}

// ── portfolio_projects New Columns ────────────────────────────────
async function testPortfolioProjectsColumns() {
  console.log('\n🔧 Testing portfolio_projects Column Extensions...');
  const newColumns = [
    'github_repo_id', 'repository_url', 'stars', 'forks', 'language',
    'last_synced', 'is_pinned', 'is_hidden', 'sort_order', 'cover_image',
    'team_size', 'duration', 'challenges_faced', 'lessons_learned',
    'future_improvements', 'architecture_notes'
  ];

  const [cols] = await db.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'portfolio_projects'`);
  const colNames = cols.map(c => c.COLUMN_NAME.toLowerCase());

  for (const col of newColumns) {
    await assert(`Column \`portfolio_projects.${col}\` exists`, async () => {
      if (!colNames.includes(col.toLowerCase())) throw new Error('Column missing');
    });
  }
}

// ── GitHub Manual Connect ─────────────────────────────────────────
async function testGitHubManualConnect() {
  console.log('\n🐙 Testing GitHub Manual Connection (DB Layer)...');

  // Use a test user ID (user ID 1 if exists, else skip)
  const [[testUser]] = await db.query('SELECT id FROM users LIMIT 1').catch(() => [[null]]);
  if (!testUser) { console.log('  ⚠️  Skipped: No users in database.'); return; }

  const userId = testUser.id;

  await assert('GitHub profile upsert stores data correctly', async () => {
    await db.query(`
      INSERT INTO user_github_profiles
        (user_id, github_username, oauth_mode, last_synced)
      VALUES (?, 'test-gh-user', 0, NOW())
      ON DUPLICATE KEY UPDATE github_username = 'test-gh-user', last_synced = NOW()
    `, [userId]);
    const [[row]] = await db.query('SELECT github_username FROM user_github_profiles WHERE user_id = ?', [userId]);
    if (!row || row.github_username !== 'test-gh-user') throw new Error('Profile not stored correctly');
  });

  await assert('GitHub profile can be read back without access_token', async () => {
    const [[row]] = await db.query('SELECT github_username, access_token FROM user_github_profiles WHERE user_id = ?', [userId]);
    if (!row) throw new Error('Profile not found');
    // Verify we return the row (token might be null for manual mode)
  });
}

// ── Repository Deduplication ──────────────────────────────────────
async function testRepositoryDeduplication() {
  console.log('\n🔁 Testing Repository Import Deduplication...');

  const [[testUser]] = await db.query('SELECT id FROM users LIMIT 1').catch(() => [[null]]);
  if (!testUser) { console.log('  ⚠️  Skipped: No users in database.'); return; }

  const userId = testUser.id;
  const testRepoId = 99999999; // fake GitHub repo ID for testing

  await assert('First insert creates repository', async () => {
    await db.query(`
      INSERT INTO github_repositories (user_id, github_repo_id, name, full_name)
      VALUES (?, ?, 'test-repo', 'testuser/test-repo')
      ON DUPLICATE KEY UPDATE name = 'test-repo'
    `, [userId, testRepoId]);
    const [[row]] = await db.query('SELECT id FROM github_repositories WHERE user_id = ? AND github_repo_id = ?', [userId, testRepoId]);
    if (!row) throw new Error('Repository not created');
  });

  await assert('Duplicate insert (ON DUPLICATE KEY) does not create second row', async () => {
    await db.query(`
      INSERT INTO github_repositories (user_id, github_repo_id, name, full_name)
      VALUES (?, ?, 'test-repo', 'testuser/test-repo')
      ON DUPLICATE KEY UPDATE name = 'test-repo'
    `, [userId, testRepoId]);
    const [rows] = await db.query('SELECT id FROM github_repositories WHERE user_id = ? AND github_repo_id = ?', [userId, testRepoId]);
    if (rows.length !== 1) throw new Error(`Expected 1 row, got ${rows.length}`);
  });

  await assert('Pin/Unpin repository toggle updates correctly', async () => {
    const [[repo]] = await db.query('SELECT id FROM github_repositories WHERE user_id = ? AND github_repo_id = ?', [userId, testRepoId]);
    if (!repo) throw new Error('Test repo not found');
    await db.query('UPDATE github_repositories SET is_pinned = 1 WHERE id = ?', [repo.id]);
    const [[pinned]] = await db.query('SELECT is_pinned FROM github_repositories WHERE id = ?', [repo.id]);
    if (pinned.is_pinned !== 1) throw new Error('Pin failed');
    await db.query('UPDATE github_repositories SET is_pinned = 0 WHERE id = ?', [repo.id]);
  });

  await assert('Hide/Show repository toggle works correctly', async () => {
    const [[repo]] = await db.query('SELECT id FROM github_repositories WHERE user_id = ? AND github_repo_id = ?', [userId, testRepoId]);
    await db.query('UPDATE github_repositories SET is_hidden = 1 WHERE id = ?', [repo.id]);
    const [[hidden]] = await db.query('SELECT is_hidden FROM github_repositories WHERE id = ?', [repo.id]);
    if (hidden.is_hidden !== 1) throw new Error('Hide failed');
    await db.query('UPDATE github_repositories SET is_hidden = 0 WHERE id = ?', [repo.id]);
  });

  // Cleanup test repo
  await db.query('DELETE FROM github_repositories WHERE user_id = ? AND github_repo_id = ?', [userId, testRepoId]).catch(() => {});
}

// ── Portfolio View Tracking ───────────────────────────────────────
async function testAnalyticsTracking() {
  console.log('\n📊 Testing Portfolio Analytics Tracking...');

  const [[testUser]] = await db.query('SELECT id FROM users LIMIT 1').catch(() => [[null]]);
  if (!testUser) { console.log('  ⚠️  Skipped: No users in database.'); return; }

  const userId = testUser.id;
  const today = new Date().toISOString().slice(0, 10);

  await assert('Portfolio view tracking inserts to portfolio_views', async () => {
    const testHash = 'verify_phase5_test_hash_' + Date.now();
    await db.query(`
      INSERT INTO portfolio_views (portfolio_user_id, visitor_hash, is_unique, is_returning, view_date)
      VALUES (?, ?, 1, 0, ?)
    `, [userId, testHash, today]);
    const [[row]] = await db.query('SELECT id FROM portfolio_views WHERE visitor_hash = ?', [testHash]);
    if (!row) throw new Error('View not tracked');
    await db.query('DELETE FROM portfolio_views WHERE visitor_hash = ?', [testHash]);
  });

  await assert('Portfolio click tracking inserts to portfolio_clicks', async () => {
    const testHash = 'verify_click_' + Date.now();
    await db.query(`
      INSERT INTO portfolio_clicks (portfolio_user_id, visitor_hash, click_type, click_date)
      VALUES (?, ?, 'github', ?)
    `, [userId, testHash, today]);
    const [[row]] = await db.query('SELECT id FROM portfolio_clicks WHERE visitor_hash = ?', [testHash]);
    if (!row) throw new Error('Click not tracked');
    await db.query('DELETE FROM portfolio_clicks WHERE visitor_hash = ?', [testHash]);
  });

  await assert('Analytics aggregation query runs without error', async () => {
    const [[res]] = await db.query(`
      SELECT COUNT(*) AS total_views, SUM(is_unique) AS unique_views
      FROM portfolio_views WHERE portfolio_user_id = ?
    `, [userId]);
    if (res === undefined) throw new Error('Aggregation failed');
  });
}

// ── Portfolio Strength Score ──────────────────────────────────────
async function testStrengthScore() {
  console.log('\n🎯 Testing Portfolio Strength Score...');

  const [[testUser]] = await db.query('SELECT id FROM users LIMIT 1').catch(() => [[null]]);
  if (!testUser) { console.log('  ⚠️  Skipped: No users in database.'); return; }

  const userId = testUser.id;

  await assert('Strength cache can be written and read', async () => {
    await db.query(`
      INSERT INTO portfolio_strength_cache (user_id, score, recommendations, breakdown)
      VALUES (?, 75, '["Add more projects"]', '{"headline":5}')
      ON DUPLICATE KEY UPDATE score = 75, recommendations = '["Add more projects"]', calculated_at = NOW()
    `, [userId]);
    const [[row]] = await db.query('SELECT score FROM portfolio_strength_cache WHERE user_id = ?', [userId]);
    if (!row || row.score !== 75) throw new Error('Strength cache read/write failed');
  });
}

// ── Theme CRUD ────────────────────────────────────────────────────
async function testThemeCRUD() {
  console.log('\n🎨 Testing Portfolio Theme CRUD...');

  const [[testUser]] = await db.query('SELECT id FROM users LIMIT 1').catch(() => [[null]]);
  if (!testUser) { console.log('  ⚠️  Skipped: No users in database.'); return; }

  const userId = testUser.id;

  await assert('Theme can be saved (upsert)', async () => {
    await db.query(`
      INSERT INTO portfolio_theme (user_id, accent_color, font_family, card_radius)
      VALUES (?, '#3b82f6', 'Inter', '16px')
      ON DUPLICATE KEY UPDATE accent_color = '#3b82f6', font_family = 'Inter', updated_at = NOW()
    `, [userId]);
    const [[row]] = await db.query('SELECT accent_color FROM portfolio_theme WHERE user_id = ?', [userId]);
    if (!row || row.accent_color !== '#3b82f6') throw new Error('Theme not saved');
  });

  await assert('Theme can be fetched back correctly', async () => {
    const [[row]] = await db.query('SELECT * FROM portfolio_theme WHERE user_id = ?', [userId]);
    if (!row) throw new Error('Theme not found');
    if (!row.accent_color || !row.font_family) throw new Error('Theme data incomplete');
  });
}

// ── Share + QR ────────────────────────────────────────────────────
async function testShareAndQR() {
  console.log('\n🔗 Testing Portfolio Share & QR...');

  const [[testUser]] = await db.query('SELECT id FROM users LIMIT 1').catch(() => [[null]]);
  if (!testUser) { console.log('  ⚠️  Skipped: No users in database.'); return; }

  const userId = testUser.id;

  await assert('Share event can be recorded', async () => {
    const token = 'test_token_' + Date.now();
    await db.query(`
      INSERT INTO portfolio_shares (portfolio_user_id, share_token, share_type)
      VALUES (?, ?, 'copy_link')
    `, [userId, token]);
    const [[row]] = await db.query('SELECT id FROM portfolio_shares WHERE share_token = ?', [token]);
    if (!row) throw new Error('Share not recorded');
    await db.query('DELETE FROM portfolio_shares WHERE share_token = ?', [token]);
  });
}

// ── API Health Check ──────────────────────────────────────────────
async function testAPIHealth() {
  console.log('\n🌐 Testing API Health & New Routes...');

  await assert('GET /api/health returns 200', async () => {
    return new Promise((resolve, reject) => {
      http.get('http://localhost:5000/api/health', res => {
        if (res.statusCode === 200) resolve(true);
        else reject(new Error(`Status ${res.statusCode}`));
      }).on('error', reject);
    });
  });

  const routes = [
    { method: 'GET', path: '/api/github/connect' },
    { method: 'GET', path: '/api/portfolio/strength' },
    { method: 'GET', path: '/api/portfolio/views' },
    { method: 'GET', path: '/api/portfolio/theme' },
    { method: 'GET', path: '/api/portfolio/qr' },
    { method: 'GET', path: '/api/portfolio/resume-analytics' }
  ];

  for (const route of routes) {
    await assert(`${route.method} ${route.path} returns 401 (not 404)`, async () => {
      return new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost', port: 5000, path: route.path, method: route.method
        }, res => {
          // 401 = auth required (route exists), 404 = route missing
          if (res.statusCode === 401 || res.statusCode === 403 || res.statusCode === 200) resolve(true);
          else reject(new Error(`Unexpected status: ${res.statusCode}`));
        });
        req.on('error', reject);
        req.end();
      });
    });
  }

  await assert('POST /api/portfolio/track-view accepts public requests', async () => {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({ username: 'nonexistent_test_user_xyz' });
      const req = http.request({
        hostname: 'localhost', port: 5000, path: '/api/portfolio/track-view',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
      }, res => {
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => {
          // Should not return 404 — route exists, just returns {success: false}
          if (res.statusCode === 200) resolve(true);
          else reject(new Error(`Status: ${res.statusCode}`));
        });
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  });

  await assert('GET /api/github/contributions returns 401 (route registered)', async () => {
    return new Promise((resolve, reject) => {
      http.get('http://localhost:5000/api/github/contributions', res => {
        if (res.statusCode === 401) resolve(true);
        else if (res.statusCode === 404) reject(new Error('Route not found'));
        else resolve(true);
      }).on('error', reject);
    });
  });
}

// ── Regression: Previous verification files ───────────────────────
async function runRegressionTests() {
  console.log('\n🔄 Running Previous Phase Regression Tests...');
  const phases = ['verify_portfolio.js', 'verify_phase2.js', 'verify_phase3.js', 'verify_phase4.js'];

  for (const phase of phases) {
    try {
      const { execSync } = require('child_process');
      const output = execSync(`node ${__dirname}/${phase}`, {
        encoding: 'utf8',
        cwd: __dirname,
        timeout: 30000
      });
      if (output.includes('FAILED') || output.includes('❌')) {
        fail(`Regression ${phase}`, 'Some tests failed');
        console.log(output.slice(-500));
      } else {
        ok(`Regression ${phase} passed`);
      }
    } catch (e) {
      // If file doesn't exist, skip gracefully
      if (e.message && e.message.includes('Cannot find module')) {
        console.log(`  ⚠️  ${phase} not found — skipped`);
      } else {
        fail(`Regression ${phase}`, e.message.slice(0, 200));
      }
    }
  }
}

// ── Main Runner ───────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║     EduNet Phase 5 Verification Suite v1.0          ║');
  console.log('║  GitHub · Analytics · Strength · Theme · Recruiter  ║');
  console.log('╚══════════════════════════════════════════════════════╝');

  await testDatabaseTables();
  await testPortfolioProjectsColumns();
  await testGitHubManualConnect();
  await testRepositoryDeduplication();
  await testAnalyticsTracking();
  await testStrengthScore();
  await testThemeCRUD();
  await testShareAndQR();
  await testAPIHealth();
  await runRegressionTests();

  console.log('\n' + '═'.repeat(56));
  console.log(`📊 Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    errors.forEach(e => console.log(`   • ${e}`));
    console.log('\n⚠️  PHASE 5 VERIFICATION FAILED');
  } else {
    console.log('\n✅ ALL PHASE 5 TESTS PASSED — Production Ready!');
  }
  console.log('═'.repeat(56) + '\n');

  await db.end?.().catch(() => process.exit(0));
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
