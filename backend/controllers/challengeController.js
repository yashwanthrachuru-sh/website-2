// ============================================================
// backend/controllers/challengeController.js
// Business logic for Daily Coding Challenges
// ============================================================
'use strict';

const db = require('../config/db');
const challengeModel = require('../models/challengeModel');
const runnerService = require('../runnerService');

// GET /api/challenges/daily
const getDaily = async (req, res) => {
  try {
    const userId = req.user.id;
    const challenge = await challengeModel.getDailyChallenge();
    if (!challenge) return res.status(404).json({ success: false, message: 'No challenges found.' });

    const isBookmarked = await challengeModel.isBookmarked(userId, challenge.id);
    const testCases = await challengeModel.getTestCases(challenge.id);

    // Fetch previous code draft if exists
    const draft = await challengeModel.getDraftCode(userId, challenge.id, 'solution');

    res.json({
      success: true,
      challenge: {
        ...challenge,
        is_bookmarked: isBookmarked,
        test_cases: testCases,
        draft: draft ? draft.content : null,
        hints: JSON.parse(challenge.hints || '[]')
      }
    });
  } catch (err) {
    console.error('getDaily error:', err);
    res.status(500).json({ success: false, message: 'Server error loading daily challenge.' });
  }
};

// GET /api/challenges/recommended
const getRecommended = async (req, res) => {
  try {
    const challenges = await challengeModel.getRecommendedChallenges();
    res.json({ success: true, challenges });
  } catch (err) {
    console.error('getRecommended error:', err);
    res.status(500).json({ success: false, message: 'Server error loading recommendations.' });
  }
};

// GET /api/challenges/:id
const getById = async (req, res) => {
  try {
    const userId = req.user.id;
    const challengeId = req.params.id;

    const challenge = await challengeModel.getChallenge(challengeId);
    if (!challenge) return res.status(404).json({ success: false, message: 'Challenge not found.' });

    const isBookmarked = await challengeModel.isBookmarked(userId, challenge.id);
    const testCases = await challengeModel.getTestCases(challenge.id);
    const draft = await challengeModel.getDraftCode(userId, challenge.id, 'solution');

    res.json({
      success: true,
      challenge: {
        ...challenge,
        is_bookmarked: isBookmarked,
        test_cases: testCases,
        draft: draft ? draft.content : null,
        hints: JSON.parse(challenge.hints || '[]')
      }
    });
  } catch (err) {
    console.error('getById error:', err);
    res.status(500).json({ success: false, message: 'Server error loading challenge details.' });
  }
};

// POST /api/challenges/submit
const submitSolution = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, language, source_code } = req.body;

    if (!id || !language || !source_code) {
      return res.status(400).json({ success: false, message: 'Invalid payload.' });
    }

    const challenge = await challengeModel.getChallenge(id);
    if (!challenge) return res.status(404).json({ success: false, message: 'Challenge not found.' });

    const testCases = await challengeModel.getTestCases(id);
    const primaryTestCase = testCases[0] || { input_data: '', expected_output: 'Success' };

    // Run execution abstraction layer
    const result = await runnerService.runCode(language, source_code, primaryTestCase.input_data, primaryTestCase.expected_output);

    let xpAwarded = 0;

    if (result.status === 'Accepted') {
      const sourceKey = `challenge_${id}`;
      const reward = challenge.xp_reward || 100;
      const userModel = require('../models/userModel');
      const awardResult = await userModel.awardXPAndIncrementStreak(userId, reward, sourceKey);
      xpAwarded = awardResult.already_claimed ? 0 : awardResult.added;
    }

    // Save submission records
    await challengeModel.insertSubmission(userId, id, language, source_code, result.status, result.execution_time_ms, result.memory_usage_kb, xpAwarded);

    // Call static AI Review reviews using Content Engine
    const contentEngine = require('../services/contentEngine');
    const aiReviewFeedback = contentEngine.generate({
      type: 'code_review',
      code: source_code,
      language
    });

    res.json({
      success: true,
      status: result.status,
      execution_time_ms: result.execution_time_ms,
      memory_usage_kb: result.memory_usage_kb,
      output: result.output,
      xp_awarded: xpAwarded,
      ai_review: aiReviewFeedback
    });

  } catch (err) {
    console.error('submitSolution error:', err);
    res.status(500).json({ success: false, message: 'Server error processing solution.' });
  }
};

// POST /api/challenges/save
const saveDraft = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, filename, content, language } = req.body;

    if (!filename || !content || !language) {
      return res.status(400).json({ success: false, message: 'Missing parameters.' });
    }

    await challengeModel.saveDraftCode(userId, id || null, filename, content, language);
    res.json({ success: true, message: 'Draft saved successfully.' });
  } catch (err) {
    console.error('saveDraft error:', err);
    res.status(500).json({ success: false, message: 'Server error saving code.' });
  }
};

// GET /api/challenges/history
const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await challengeModel.getSubmissionHistory(userId);
    res.json({ success: true, history });
  } catch (err) {
    console.error('getHistory error:', err);
    res.status(500).json({ success: false, message: 'Server error loading history.' });
  }
};

// POST /api/challenges/bookmark
const bookmarkChallenge = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.body;

    if (!id) return res.status(400).json({ success: false, message: 'Challenge ID required.' });

    const bookmarked = await challengeModel.toggleBookmark(userId, id);
    res.json({ success: true, bookmarked, message: bookmarked ? 'Added bookmark.' : 'Removed bookmark.' });
  } catch (err) {
    console.error('bookmarkChallenge error:', err);
    res.status(500).json({ success: false, message: 'Server error processing bookmark.' });
  }
};

module.exports = {
  getDaily,
  getRecommended,
  getById,
  submitSolution,
  saveDraft,
  getHistory,
  bookmarkChallenge
};
