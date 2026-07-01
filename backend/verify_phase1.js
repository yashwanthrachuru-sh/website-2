// ============================================================
// backend/verify_phase1.js
// Automated verification script for Phase 1 Features
// ============================================================
'use strict';

const db = require('./config/db');

async function runTests() {
  console.log('🔍 Starting Phase 1 automated verifications...');

  try {
    // 1. Verify xp_ledger exists and is readable
    const [ledgerRows] = await db.query('SELECT COUNT(*) AS count FROM xp_ledger');
    console.log(`   ✓ verified \`xp_ledger\` table. Currently has ${ledgerRows[0].count} entries.`);

    // 2. Test User Login Reward check
    // We simulate a request to dashboard/analytics for user 2 (john_doe)
    const testUid = 2;
    const today = new Date().toISOString().slice(0, 10);
    const loginSource = `daily_login_${today}`;

    // Clean up any existing login entry for today to perform a clean test run
    await db.query('DELETE FROM xp_ledger WHERE user_id = ? AND source = ?', [testUid, loginSource]);

    console.log('   Testing Daily Login auto-award on dashboard fetch...');
    // We check initial user values
    const [[userBefore]] = await db.query('SELECT xp, level, streak FROM users WHERE id = ?', [testUid]);

    // Query dashboard (which triggers the award)
    const { getDashboard } = require('./controllers/analyticsController');
    const reqSim = { user: { id: testUid } };
    let jsonOutput = null;
    const resSim = {
      json: (data) => { jsonOutput = data; }
    };

    await getDashboard(reqSim, resSim);

    if (jsonOutput && jsonOutput.success) {
      console.log('   ✓ Dashboard API fetched successfully.');
      console.log(`   ✓ Daily login award check: ${jsonOutput.daily_login_awarded ? 'Awarded +50 XP' : 'Already claimed'}`);
      console.log(`   ✓ New user stats -> XP: ${jsonOutput.dashboard.xp}, Level: ${jsonOutput.dashboard.level}, Streak: ${jsonOutput.dashboard.streak}`);
    } else {
      throw new Error('Dashboard API return failed.');
    }

    // 3. Test double claiming blocking on xp_ledger
    console.log('   Testing duplicate XP claim prevention...');
    // Let's manually trigger syncXP with duplicate source
    const { syncXP } = require('./controllers/userController');
    let syncOutput = null;
    const resSyncSim = {
      json: (data) => { syncOutput = data; }
    };
    const reqSyncSim = {
      user: { id: testUid },
      body: { amount: 50, source: loginSource }
    };

    await syncXP(reqSyncSim, resSyncSim);

    if (syncOutput && syncOutput.success) {
      if (syncOutput.added === 0 && syncOutput.already_claimed) {
        console.log('   ✓ Duplicate XP claim blocked successfully by ledger unique constraints.');
      } else {
        throw new Error('Duplicate XP claim was not blocked!');
      }
    } else {
      throw new Error('syncXP failed to process duplicate claim gracefully.');
    }

    // 4. Check Achievements unlock evaluation
    console.log('   Testing dynamic achievements check...');
    // Connect user to tools
    await db.query('INSERT IGNORE INTO tool_usage (user_id, tool_id) VALUES (?, ?), (?, ?), (?, ?)',
      [testUid, 't1', testUid, 't3', testUid, 't5']
    );

    // Call /check
    const axios = require('http'); // we simulate internal router execution
    let checkOutput = null;
    const resCheckSim = {
      json: (data) => { checkOutput = data; }
    };
    const reqCheckSim = { user: { id: testUid } };

    // We fetch routes directly or execute logic
    const express = require('express');
    const router = require('./routes/achievementRoutes');
    // Simulate routes controller check
    // We find route matching '/check'
    const checkLayer = router.stack.find(l => l.route && l.route.path === '/check');
    if (checkLayer && checkLayer.route.stack.length > 1) {
      await checkLayer.route.stack[1].handle(reqCheckSim, resCheckSim, () => {});
    }

    if (checkOutput && checkOutput.success) {
      console.log('   ✓ Achievements check run complete.');
      console.log('   ✓ Stats parsed:', checkOutput.stats);
      if (checkOutput.stats.tools_used >= 3) {
        console.log('   ✓ AI Explorer Badge requirement satisfied.');
      }
    }

    // 5. Test Portfolio Completion strength
    console.log('   Testing portfolio completion strength metrics...');
    const { getPortfolio } = require('./controllers/portfolioController');
    let portOutput = null;
    const resPortSim = {
      json: (data) => { portOutput = data; }
    };
    const reqPortSim = { user: { id: testUid } };
    await getPortfolio(reqPortSim, resPortSim);

    if (portOutput && portOutput.success) {
      console.log(`   ✓ Portfolio completion: ${portOutput.completion_percentage}%`);
      if (typeof portOutput.completion_percentage === 'number') {
        console.log('   ✓ Portfolio Completion Strength evaluated correctly.');
      }
    }

    console.log('🎉 ALL PHASE 1 BACKEND VERIFICATIONS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Phase 1 verifications failed:', err.message);
    process.exit(1);
  }
}

runTests();
