// ============================================================
// controllers/codeController.js — Sandbox Compiler Execution
// ============================================================
const codeModel = require('../models/codeModel');

// GET /api/codelabs/templates
const getTemplates = async (req, res) => {
  try {
    const templates = await codeModel.getTemplates();
    res.json({ success: true, templates });
  } catch (err) {
    console.error('Fetch templates error:', err);
    res.status(500).json({ success: false, message: 'Server error loading templates.' });
  }
};

// GET /api/codelabs/problems
const getProblems = async (req, res) => {
  try {
    const problems = await codeModel.getProblems();
    res.json({ success: true, problems });
  } catch (err) {
    console.error('Fetch problems error:', err);
    res.status(500).json({ success: false, message: 'Server error loading challenges.' });
  }
};

// POST /api/codelabs/save
const saveUserProgram = async (req, res) => {
  try {
    const { name, code, language } = req.body;
    const userId = req.user.id;

    if (!name || !code || !language) {
      return res.status(400).json({ success: false, message: 'Required fields: name, code, language.' });
    }

    const programId = await codeModel.saveProgram(userId, name, code, language);
    res.status(201).json({
      success: true,
      message: 'Program saved successfully.',
      programId
    });
  } catch (err) {
    console.error('Save program error:', err);
    res.status(500).json({ success: false, message: 'Server error saving script.' });
  }
};

// GET /api/codelabs/saved
const getSavedPrograms = async (req, res) => {
  try {
    const userId = req.user.id;
    const programs = await codeModel.getSavedProgramsByUserId(userId);
    res.json({ success: true, programs });
  } catch (err) {
    console.error('Fetch saved programs error:', err);
    res.status(500).json({ success: false, message: 'Server error loading saved scripts.' });
  }
};

// POST /api/codelabs/run
const runSandboxCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    const userId = req.user.id;

    if (!code || !language) {
      return res.status(400).json({ success: false, message: 'Code and language are required.' });
    }

    // Simulate execution output
    let output = 'Stdout Output:\n  Hello from sandbox execution!';
    if (language === 'python') {
      output = 'Python Output:\n  tenude\n\nPerformance: 0.05s CPU usage';
    } else if (language === 'javascript') {
      output = 'JavaScript V8 console logs:\n  tenude';
    }

    await codeModel.createExecutionLog(userId, code, language, output);

    res.json({
      success: true,
      output
    });
  } catch (err) {
    console.error('Run code error:', err);
    res.status(500).json({ success: false, message: 'Server error running execution sandbox.' });
  }
};

// POST /api/codelabs/submit
const submitChallengeCode = async (req, res) => {
  try {
    const { code, language, snippetId, status } = req.body;
    const userId = req.user.id;

    if (!code || !language) {
      return res.status(400).json({ success: false, message: 'Code and language are required.' });
    }

    // Save solver status draft
    if (snippetId) {
      await codeModel.saveUserCode(userId, snippetId, code, language, status || 'completed');
    }

    const historyId = await codeModel.createHistory(userId, code, language);

    res.status(201).json({
      success: true,
      message: 'Challenge code solution submitted successfully.',
      historyId
    });
  } catch (err) {
    console.error('Submit code error:', err);
    res.status(500).json({ success: false, message: 'Server error submitting challenge code.' });
  }
};

// GET /api/codelabs/history
const getSubmissionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await codeModel.getHistoryByUserId(userId);
    res.json({ success: true, history });
  } catch (err) {
    console.error('Fetch history error:', err);
    res.status(500).json({ success: false, message: 'Server error loading history logs.' });
  }
};

// GET /api/codelabs/ or /api/code/
const getCodeOverview = async (req, res) => {
  try {
    const templates = await codeModel.getTemplates();
    const problems = await codeModel.getProblems();
    res.json({ success: true, templates, problems });
  } catch (err) {
    console.error('Fetch code overview error:', err);
    res.status(500).json({ success: false, message: 'Server error loading code overview.' });
  }
};

module.exports = {
  getTemplates,
  getProblems,
  saveUserProgram,
  getSavedPrograms,
  runSandboxCode,
  submitChallengeCode,
  getSubmissionHistory,
  getCodeOverview
};
