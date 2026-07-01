// ============================================================
// backend/verify_phase3.js
// Automated verification script for Phase 3 Features
// ============================================================
'use strict';

const db = require('./config/db');

async function runTests() {
  console.log('🔍 Starting Phase 3 automated verifications...');

  try {
    // 1. Verify all new tables exist in database
    const tables = ['daily_challenges', 'challenge_test_cases', 'challenge_submissions', 'saved_code', 'challenge_bookmarks'];
    for (const t of tables) {
      const [rows] = await db.query(`SHOW TABLES LIKE '${t}'`);
      if (!rows.length) {
        throw new Error(`Table \`${t}\` is missing from database schema!`);
      }
    }
    console.log('   ✓ Verified all 5 new coding challenges tables exist.');

    const testUid = 2; // john_doe

    // 2. Test challenge list fetching
    console.log('   Testing GET /api/challenges/daily...');
    const { getDaily, getRecommended, submitSolution, saveDraft } = require('./controllers/challengeController');
    let dailyOutput = null;
    const resSim = {
      json: (data) => { dailyOutput = data; }
    };
    const reqSim = {
      user: { id: testUid },
      params: {},
      body: {}
    };

    await getDaily(reqSim, resSim);

    if (dailyOutput && dailyOutput.success && dailyOutput.challenge) {
      console.log(`   ✓ Daily challenge loaded: "${dailyOutput.challenge.title}" (${dailyOutput.challenge.difficulty})`);
    } else {
      throw new Error(`getDaily failed: ${dailyOutput ? dailyOutput.message : 'No output'}`);
    }

    // 3. Test sandbox Run API
    console.log('   Testing POST /api/challenges/run (Playground execution)...');
    const { runPlaygroundCode } = require('./controllers/runnerController');
    let runOutput = null;
    const reqRunSim = {
      body: {
        language: 'javascript',
        source_code: 'function test() { return 1; }',
        input: ''
      }
    };
    await runPlaygroundCode(reqRunSim, { json: (data) => { runOutput = data; } });

    if (runOutput && runOutput.success && runOutput.status === 'Accepted') {
      console.log('   ✓ Sandbox run executed successfully (Accepted mock status).');
    } else {
      throw new Error('Sandbox runner failed.');
    }

    // 4. Test Submission and XP reward claims
    console.log('   Testing POST /api/challenges/submit (Solving Challenge)...');
    let submitOutput = null;
    const reqSubmitSim = {
      user: { id: testUid },
      body: {
        id: dailyOutput.challenge.id,
        language: 'javascript',
        source_code: 'function twoSum(nums, target) { return [0, 1]; }'
      }
    };

    await submitSolution(reqSubmitSim, { json: (data) => { submitOutput = data; } });

    if (submitOutput && submitOutput.success && submitOutput.status === 'Accepted') {
      console.log(`   ✓ Submission Accepted. XP awarded: +${submitOutput.xp_awarded} XP.`);
      console.log(`   ✓ Static AI Review compiled: Complexity = ${submitOutput.ai_review.complexity}, Score = ${submitOutput.ai_review.score}`);
    } else {
      throw new Error('Solution submission failed.');
    }

    // 5. Test Double-XP claim block
    console.log('   Testing Double-claim prevention rules on submission...');
    let resubmitOutput = null;
    await submitSolution(reqSubmitSim, { json: (data) => { resubmitOutput = data; } });

    if (resubmitOutput && resubmitOutput.success && resubmitOutput.xp_awarded === 0) {
      console.log('   ✓ Verified Double-claim XP block: 0 XP awarded on duplicate solution.');
    } else {
      throw new Error(`Double-claim blocker failed! Awarded: ${resubmitOutput ? resubmitOutput.xp_awarded : 'unknown'}`);
    }

    console.log('🎉 ALL PHASE 3 BACKEND VERIFICATIONS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Phase 3 verifications failed:', err.message);
    process.exit(1);
  }
}

runTests();
