// ============================================================
// backend/scripts/test_progression_engine.js
// Integration test suite for EduNet Progress & Lock Engine
// ============================================================
'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('../config/db');
const { UnlockService, CompletionService, ProgressService, XPService } = require('../services/progressEngine');

async function runTests() {
  console.log('🧪 Starting EduNet Progression & Lock Engine Verification Suite...\n');
  let testUserId = null;
  let testRoadmapId = 'python';

  try {
    // 1. Setup test user
    const [[user]] = await db.query(`SELECT id FROM users LIMIT 1`);
    if (!user) {
      console.log('⚠️ No test user found in database. Skipping live DB test.');
      return;
    }
    testUserId = user.id;
    console.log(`👤 Using test User ID: ${testUserId}`);

    // 2. Fetch initial roadmap lock state
    console.log('\n--- TEST 1: Initial Lock State Calculation ---');
    const lockState1 = await UnlockService.calculateRoadmapLessonStatuses(testRoadmapId, testUserId);
    console.log(`✅ Total modules retrieved: ${lockState1.modules.length}`);
    console.log(`✅ Total flat lessons retrieved: ${lockState1.flatLessons.length}`);
    
    if (lockState1.flatLessons.length > 0) {
      const firstL = lockState1.flatLessons[0];
      console.log(`✅ First lesson ("${firstL.title}") status: ${firstL.status}, locked: ${firstL.locked}`);
      if (firstL.locked) {
        throw new Error('FAIL: First lesson of roadmap should be unlocked!');
      }
    }

    // 3. Test 4-Level Progress Rollup
    console.log('\n--- TEST 2: 4-Level Progress Rollup API ---');
    const rollUp = await ProgressService.get4LevelProgress(testUserId, testRoadmapId);
    console.log(`✅ Overall progress: ${rollUp.overall_progress_pct}%`);
    console.log(`✅ Beginner tier pct: ${rollUp.tiers.beginner.pct}%`);
    console.log(`✅ Intermediate tier pct: ${rollUp.tiers.intermediate.pct}%`);
    console.log(`✅ Expert tier pct: ${rollUp.tiers.expert.pct}%`);

    // 4. Test Atomic Completion & Next Unlocked Lesson
    if (lockState1.flatLessons.length > 1) {
      console.log('\n--- TEST 3: Atomic Lesson Completion & Next Unlocked Lesson ---');
      const targetL = lockState1.flatLessons[0];
      console.log(`Completing lesson ID ${targetL.id} ("${targetL.title}")...`);
      
      const compRes = await CompletionService.completeLesson(testUserId, targetL.id);
      console.log(`✅ Completion result: success=${compRes.success}, completed=${compRes.completed}`);
      console.log(`✅ XP awarded: ${compRes.xp_awarded}, user_xp=${compRes.user_xp}, user_level=${compRes.user_level}`);
      if (compRes.next_lesson) {
        console.log(`✅ Next unlocked lesson: "${compRes.next_lesson.title}" (locked=${compRes.next_lesson.locked})`);
        if (compRes.next_lesson.locked) {
          throw new Error('FAIL: Next lesson should be UNLOCKED after completing preceding lesson!');
        }
      }

      // Re-query lock state
      const lockState2 = await UnlockService.calculateRoadmapLessonStatuses(testRoadmapId, testUserId);
      const nextLInState = lockState2.flatLessons[1];
      console.log(`✅ Verified next lesson state in roadmap: status=${nextLInState.status}, locked=${nextLInState.locked}`);
      if (nextLInState.locked) {
        throw new Error('FAIL: Next lesson state in roadmap should be unlocked!');
      }
    }

    console.log('\n🎉 ALL PROGRESSION & LOCK ENGINE TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('\n❌ VERIFICATION TEST FAILED:', err.message);
    console.error(err.stack);
    process.exitCode = 1;
  } finally {
    process.exit();
  }
}

runTests();
