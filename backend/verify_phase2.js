// ============================================================
// backend/verify_phase2.js
// Automated verification script for Phase 2 Features
// ============================================================
'use strict';

const db = require('./config/db');

async function runTests() {
  console.log('🔍 Starting Phase 2 automated verifications...');

  try {
    // 1. Verify all new tables exist in database
    const tables = ['ai_career_coaches', 'weekly_plans', 'study_tasks', 'study_sessions', 'coach_recommendations'];
    for (const t of tables) {
      const [rows] = await db.query(`SHOW TABLES LIKE '${t}'`);
      if (!rows.length) {
        throw new Error(`Table \`${t}\` is missing from database schema!`);
      }
    }
    console.log('   ✓ Verified all 5 new career mentor tables exist.');

    const testUid = 2; // john_doe

    // 2. Generate Plan API
    console.log('   Testing POST /api/coach/generate (Offline Blueprint)...');
    const { generatePlan } = require('./controllers/coachController');
    let genOutput = null;
    const resGenSim = {
      json: (data) => { genOutput = data; }
    };
    const reqGenSim = {
      user: { id: testUid },
      body: { goal: 'Become Full Stack Developer' }
    };

    await generatePlan(reqGenSim, resGenSim);

    if (genOutput && genOutput.success) {
      console.log('   ✓ Goal plan generation completed successfully.');
    } else {
      throw new Error(`generatePlan failed: ${genOutput ? genOutput.message : 'No output'}`);
    }

    // 3. Get Tasks & Dashboard
    console.log('   Testing GET /api/coach/tasks & GET /api/coach/dashboard...');
    const { getTasks, getDashboard } = require('./controllers/coachController');
    
    let tasksOutput = null;
    await getTasks(reqGenSim, { json: (data) => { tasksOutput = data; } });

    if (tasksOutput && tasksOutput.success && tasksOutput.tasks.length > 0) {
      console.log(`   ✓ Retrieved ${tasksOutput.tasks.length} tasks scheduled in the blueprint.`);
    } else {
      throw new Error('Failed to retrieve planner tasks.');
    }

    let dashOutput = null;
    await getDashboard(reqGenSim, { json: (data) => { dashOutput = data; } });

    if (dashOutput && dashOutput.success) {
      console.log('   ✓ Career Coach Dashboard stats aggregated successfully:');
      console.log(`     - Goal: "${dashOutput.coach.goal}"`);
      console.log(`     - Completion: ${dashOutput.coach.completion_percentage}%`);
      console.log(`     - Portfolio strength: ${dashOutput.coach.portfolio_completion}%`);
      console.log(`     - Roadmap completion: ${dashOutput.coach.roadmap_completion}%`);
    } else {
      throw new Error('Failed to retrieve dashboard metrics.');
    }

    // 4. Test Task actions: Skip, Postpone, Complete
    console.log('   Testing task status mutations (Complete, Postpone, Skip)...');
    const targetTask = tasksOutput.tasks[0];
    const targetTaskId = targetTask.id;
    
    const { completeTask, skipTask, postponeTask } = require('./controllers/coachController');

    // Test Complete
    let completeOutput = null;
    const reqTaskSim = {
      user: { id: testUid },
      body: { id: targetTaskId }
    };
    await completeTask(reqTaskSim, { json: (data) => { completeOutput = data; } });

    if (completeOutput && completeOutput.success) {
      console.log(`   ✓ Task marked complete. XP awarded: +${completeOutput.xp_awarded} XP.`);
    } else {
      throw new Error('completeTask endpoint failed.');
    }

    // Test Skip
    const skipTaskId = tasksOutput.tasks[1].id;
    let skipOutput = null;
    const reqSkipSim = {
      user: { id: testUid },
      body: { id: skipTaskId }
    };
    await skipTask(reqSkipSim, { json: (data) => { skipOutput = data; } });
    if (skipOutput && skipOutput.success) {
      console.log('   ✓ Task marked skipped.');
    } else {
      throw new Error('skipTask endpoint failed.');
    }

    // Test Postpone
    const postponeTaskId = tasksOutput.tasks[2].id;
    let postponeOutput = null;
    const reqPostponeSim = {
      user: { id: testUid },
      body: { id: postponeTaskId }
    };
    await postponeTask(reqPostponeSim, { json: (data) => { postponeOutput = data; } });
    if (postponeOutput && postponeOutput.success) {
      console.log('   ✓ Task successfully postponed to tomorrow.');
    } else {
      throw new Error('postponeTask endpoint failed.');
    }

    // 5. Test Calendar & Sessions
    console.log('   Testing GET /api/coach/calendar...');
    const { getCalendar } = require('./controllers/coachController');
    let calOutput = null;
    await getCalendar(reqGenSim, { json: (data) => { calOutput = data; } });

    if (calOutput && calOutput.success) {
      console.log(`   ✓ Calendar tasks list size: ${calOutput.tasks.length}`);
      console.log(`   ✓ Study sessions logs size: ${calOutput.sessions.length}`);
    } else {
      throw new Error('getCalendar failed.');
    }

    console.log('🎉 ALL PHASE 2 BACKEND VERIFICATIONS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Phase 2 verifications failed:', err.message);
    process.exit(1);
  }
}

runTests();
