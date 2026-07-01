// ============================================================
// backend/controllers/runnerController.js
// Sandbox code execution controller
// ============================================================
'use strict';

const runnerService = require('../runnerService');

const runPlaygroundCode = async (req, res) => {
  try {
    const { language, source_code, input } = req.body;

    if (!language || !source_code) {
      return res.status(400).json({ success: false, message: 'Missing parameters.' });
    }

    const result = await runnerService.runCode(language, source_code, input || '', '');

    res.json({
      success: true,
      status: result.status,
      execution_time_ms: result.execution_time_ms,
      memory_usage_kb: result.memory_usage_kb,
      output: result.output
    });

  } catch (err) {
    console.error('runPlaygroundCode error:', err);
    res.status(500).json({ success: false, message: 'Server error compiling code.' });
  }
};

module.exports = {
  runPlaygroundCode
};
