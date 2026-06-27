// ============================================================
// controllers/toolsController.js — Public AI Tools API
// ============================================================

const toolModel = require('../models/toolModel');
const auditModel = require('../models/auditModel');

// GET /api/tools
// Returns a list of all approved AI tools
const getApprovedTools = async (req, res) => {
  try {
    const tools = await toolModel.getApprovedTools();
    res.json({
      success: true,
      tools
    });
  } catch (err) {
    console.error('Fetch tools error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching tools.' });
  }
};

// POST /api/tools/:id/bookmark
const toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { bookmark } = req.body; // boolean flag

    if (bookmark) {
      await toolModel.addBookmark(userId, id);
      res.json({ success: true, message: 'Tool bookmarked successfully.' });
    } else {
      await toolModel.removeBookmark(userId, id);
      res.json({ success: true, message: 'Bookmark removed successfully.' });
    }
  } catch (err) {
    console.error('Toggle bookmark error:', err);
    res.status(500).json({ success: false, message: 'Server error updating bookmark.' });
  }
};

// POST /api/tools/:id/rate
const rateTool = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Invalid rating. Choose 1 to 5 stars.' });
    }

    const newAvg = await toolModel.addRating(userId, id, rating);
    res.json({ success: true, message: 'Rating saved successfully.', averageRating: newAvg });
  } catch (err) {
    console.error('Rate tool error:', err);
    res.status(500).json({ success: false, message: 'Server error saving rating.' });
  }
};

// POST /api/tools/:id/reviews
const submitReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewText, rating } = req.body;
    const userId = req.user.id;

    if (!reviewText) {
      return res.status(400).json({ success: false, message: 'Review content required.' });
    }

    const reviewId = await toolModel.addReview(userId, id, reviewText, rating || 5);
    res.status(201).json({ success: true, message: 'Review submitted successfully.', reviewId });
  } catch (err) {
    console.error('Submit review error:', err);
    res.status(500).json({ success: false, message: 'Server error saving review.' });
  }
};

// GET /api/tools/:id/reviews
const getReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await toolModel.getReviewsByToolId(id);
    res.json({ success: true, reviews });
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ success: false, message: 'Server error loading reviews.' });
  }
};

// POST /api/tools/:id/launch
const logLaunchUsage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await toolModel.logUsage(userId, id);
    res.json({ success: true, message: 'Launch log registered.' });
  } catch (err) {
    console.error('Log tool usage error:', err);
    res.status(500).json({ success: false, message: 'Server error registering launch log.' });
  }
};

module.exports = {
  getApprovedTools,
  toggleBookmark,
  rateTool,
  submitReview,
  getReviews,
  logLaunchUsage
};
