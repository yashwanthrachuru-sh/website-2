// ============================================================
// backend/verify_phase4.js
// Automated verification script for Phase 4 Features
// ============================================================
'use strict';

const db = require('./config/db');

async function runTests() {
  console.log('🔍 Starting Phase 4 automated verifications...');

  try {
    // 1. Verify all new tables exist in database
    const tables = [
      'user_resumes', 'resume_sections', 'resume_templates', 'resume_versions',
      'resume_job_scans', 'resume_keywords', 'resume_downloads', 'resume_ai_history'
    ];
    for (const t of tables) {
      const [rows] = await db.query(`SHOW TABLES LIKE '${t}'`);
      if (!rows.length) {
        throw new Error(`Table \`${t}\` is missing from database schema!`);
      }
    }
    console.log('   ✓ Verified all 8 new resume builder tables exist.');

    const testUid = 2; // john_doe

    // 2. Test Resume CRUD & default seeding
    console.log('   Testing GET /api/resume (Retrials & default seeding)...');
    const { getResume, saveResume, updateResume, deleteResume } = require('./controllers/resumeController');
    let getOutput = null;
    const reqSim = {
      user: { id: testUid },
      params: {},
      body: {}
    };

    await getResume(reqSim, { json: (data) => { getOutput = data; } });

    if (getOutput && getOutput.success && getOutput.resumes.length > 0) {
      const activeRes = getOutput.resumes[0];
      console.log(`   ✓ Resume loaded: "${activeRes.title}" using Template: ${activeRes.template}`);
      console.log(`     - Personal Info: Name = "${activeRes.personal_info.name}", Email = "${activeRes.personal_info.email}"`);
      console.log(`     - Loaded sections: Education items = ${activeRes.sections.education.length}, Experience items = ${activeRes.sections.experience.length}`);
    } else {
      throw new Error(`getResume failed: ${getOutput ? getOutput.message : 'No output'}`);
    }

    const activeResume = getOutput.resumes[0];

    // 3. Test update template choice
    console.log('   Testing POST /api/resume/template...');
    const { changeTemplate } = require('./controllers/resumeController');
    let templateOutput = null;
    const reqTmplSim = {
      user: { id: testUid },
      body: {
        id: activeResume.id,
        template: 'modern'
      }
    };
    await changeTemplate(reqTmplSim, { json: (data) => { templateOutput = data; } });
    if (templateOutput && templateOutput.success) {
      console.log('   ✓ Resume template successfully changed to "modern".');
    } else {
      throw new Error('changeTemplate failed.');
    }

    // 4. Test ATS Job Scan Score Matcher
    console.log('   Testing POST /api/resume/scan (ATS Compatibility scanner)...');
    const { scanResume } = require('./controllers/resumeController');
    let scanOutput = null;
    const reqScanSim = {
      user: { id: testUid },
      body: {
        id: activeResume.id,
        job_description: 'We are seeking a JavaScript and Python developer with SQL database skills.'
      }
    };

    await scanResume(reqScanSim, { json: (data) => { scanOutput = data; } });

    if (scanOutput && scanOutput.success) {
      console.log(`   ✓ ATS Scan compatibility calculated successfully: ${scanOutput.score}%`);
      console.log(`     - Matched: [${scanOutput.matched.join(', ')}]`);
      console.log(`     - Missing: [${scanOutput.missing.join(', ')}]`);
    } else {
      throw new Error('scanResume failed.');
    }

    // 5. Test Public CV fetch
    console.log('   Testing GET /api/resume/public/:username (Developer Portfolio integration)...');
    const { getPublicResume } = require('./controllers/resumeController');
    let publicOutput = null;
    const reqPubSim = {
      params: { username: 'john_doe' }
    };

    await getPublicResume(reqPubSim, { json: (data) => { publicOutput = data; } });

    if (publicOutput && publicOutput.success && publicOutput.resume) {
      console.log(`   ✓ Public resume loaded successfully for john_doe. Name: "${publicOutput.resume.personal_info.name}"`);
    } else {
      throw new Error('getPublicResume failed.');
    }

    console.log('🎉 ALL PHASE 4 BACKEND VERIFICATIONS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Phase 4 verifications failed:', err.message);
    process.exit(1);
  }
}

runTests();
