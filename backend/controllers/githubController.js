// ============================================================
// backend/controllers/githubController.js
// GitHub Integration for EduNet Developer Portfolio
// ============================================================
'use strict';

const githubModel   = require('../models/githubModel');
const githubService = require('../services/githubService');
const crypto        = require('crypto');

// ── GET /api/github/connect ─────────────────────────────────────
// Returns OAuth URL if configured, or signals manual-only mode
const getConnectUrl = async (req, res) => {
  try {
    if (!githubService.isOAuthConfigured()) {
      return res.json({
        success: true,
        oauth_available: false,
        message: 'GitHub OAuth not configured. Use manual username connection.'
      });
    }
    const state = crypto.randomBytes(16).toString('hex');
    const url = githubService.getOAuthUrl(state);
    res.json({ success: true, oauth_available: true, url, state });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/github/callback ────────────────────────────────────
// OAuth callback — exchanges code for token, saves profile
const handleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const userId = req.user?.id;

    if (!code) {
      return res.redirect('/portfolio.html?github_error=missing_code');
    }

    if (!githubService.isOAuthConfigured()) {
      return res.redirect('/portfolio.html?github_error=oauth_not_configured');
    }

    const token = await githubService.exchangeCodeForToken(code);
    const profileResult = await githubService.fetchGitHubProfile(null, token);

    if (!profileResult.success) {
      return res.redirect(`/portfolio.html?github_error=${encodeURIComponent(profileResult.error)}`);
    }

    const { profile } = profileResult;

    // Fetch repos to calculate stars/forks totals
    const reposResult = await githubService.fetchUserRepos(profile.login, token);

    // Encrypt token before storage
    const encryptedToken = githubService.simpleEncrypt(token, process.env.JWT_SECRET);

    await githubModel.upsertGitHubProfile(userId, {
      ...profile,
      github_username: profile.login,
      access_token: encryptedToken,
      token_encrypted: 1,
      total_stars: reposResult.totalStars || 0,
      total_forks: reposResult.totalForks || 0,
      oauth_mode: 1
    });

    // Auto-import all repos
    if (reposResult.repos.length > 0) {
      for (const repo of reposResult.repos) {
        const lastCommit = await githubService.fetchLastCommit(profile.login, repo.name, token);
        await githubModel.upsertRepository(userId, { ...repo, lastCommit });
      }
    }

    res.redirect('/portfolio.html?github_connected=1');
  } catch (err) {
    console.error('handleCallback error:', err.message);
    res.redirect(`/portfolio.html?github_error=${encodeURIComponent(err.message)}`);
  }
};

// ── POST /api/github/manual ─────────────────────────────────────
// Connect GitHub via manual username (no OAuth)
const connectManual = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username } = req.body;

    if (!username || username.trim().length < 1) {
      return res.status(400).json({ success: false, message: 'GitHub username is required.' });
    }

    const cleanUsername = username.trim().replace(/[^a-zA-Z0-9\-]/g, '');
    if (!cleanUsername) {
      return res.status(400).json({ success: false, message: 'Invalid GitHub username.' });
    }

    // Verify GitHub profile exists
    const profileResult = await githubService.fetchGitHubProfile(cleanUsername);
    if (!profileResult.success) {
      return res.status(404).json({
        success: false,
        message: `GitHub user "${cleanUsername}" not found. Please check the username.`
      });
    }

    const { profile } = profileResult;

    // Fetch repos
    const reposResult = await githubService.fetchUserRepos(cleanUsername);

    await githubModel.upsertGitHubProfile(userId, {
      ...profile,
      github_username: cleanUsername,
      access_token: null,
      token_encrypted: 0,
      total_stars: reposResult.totalStars || 0,
      total_forks: reposResult.totalForks || 0,
      oauth_mode: 0
    });

    // Import all repos
    const newCount = reposResult.repos.length;
    for (const repo of reposResult.repos) {
      const lastCommit = await githubService.fetchLastCommit(cleanUsername, repo.name);
      await githubModel.upsertRepository(userId, { ...repo, lastCommit });
    }

    res.json({
      success: true,
      message: `GitHub connected! Imported ${newCount} repositories.`,
      profile: {
        login: profile.login,
        name: profile.name,
        avatar_url: profile.avatar_url,
        public_repos: profile.public_repos,
        followers: profile.followers,
        following: profile.following
      },
      repos_imported: newCount
    });
  } catch (err) {
    console.error('connectManual error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to connect GitHub: ' + err.message });
  }
};

// ── POST /api/github/disconnect ─────────────────────────────────
const disconnect = async (req, res) => {
  try {
    const userId = req.user.id;
    await githubModel.deleteGitHubProfile(userId);
    res.json({ success: true, message: 'GitHub disconnected successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/github/profile ─────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await githubModel.getGitHubProfile(userId);

    if (!profile) {
      return res.json({
        success: true,
        connected: false,
        oauth_available: githubService.isOAuthConfigured()
      });
    }

    const repos = await githubModel.getRepositories(userId);

    // Sanitize: never send access token to frontend
    const safeProfile = { ...profile };
    delete safeProfile.access_token;

    res.json({
      success: true,
      connected: true,
      oauth_available: githubService.isOAuthConfigured(),
      profile: safeProfile,
      repos
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/github/repos ───────────────────────────────────────
// Fetch fresh repos from GitHub API (does not save to DB)
const getRepos = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await githubModel.getGitHubProfile(userId);

    if (!profile) {
      return res.status(404).json({ success: false, message: 'GitHub not connected.' });
    }

    const token = profile.oauth_mode && profile.access_token
      ? githubService.simpleDecrypt(profile.access_token, process.env.JWT_SECRET)
      : null;

    const result = await githubService.fetchUserRepos(profile.github_username, token);
    const importedIds = await githubModel.getImportedRepoIds(userId);

    const repos = result.repos.map(r => ({
      ...r,
      already_imported: importedIds.includes(r.id)
    }));

    res.json({ success: true, repos, total: repos.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/github/import ─────────────────────────────────────
// Import selected repos (by GitHub repo IDs) — no duplicates
const importRepos = async (req, res) => {
  try {
    const userId = req.user.id;
    const { repo_ids } = req.body; // array of GitHub repo IDs

    if (!Array.isArray(repo_ids) || repo_ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No repository IDs provided.' });
    }

    const profile = await githubModel.getGitHubProfile(userId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'GitHub not connected.' });
    }

    const token = profile.oauth_mode && profile.access_token
      ? githubService.simpleDecrypt(profile.access_token, process.env.JWT_SECRET)
      : null;

    const reposResult = await githubService.fetchUserRepos(profile.github_username, token);
    const toImport = reposResult.repos.filter(r => repo_ids.includes(r.id));

    let imported = 0, skipped = 0;
    for (const repo of toImport) {
      const existing = await githubModel.getRepoByGitHubId(userId, repo.id);
      if (existing) { skipped++; continue; }
      const lastCommit = await githubService.fetchLastCommit(profile.github_username, repo.name, token);
      await githubModel.upsertRepository(userId, { ...repo, lastCommit });
      imported++;
    }

    res.json({
      success: true,
      message: `Imported ${imported} repositories. ${skipped} already existed.`,
      imported,
      skipped
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/github/sync ───────────────────────────────────────
// Sync all stored repos with GitHub API
const syncRepos = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await githubModel.getGitHubProfile(userId);

    if (!profile) {
      return res.status(404).json({ success: false, message: 'GitHub not connected.' });
    }

    const token = profile.oauth_mode && profile.access_token
      ? githubService.simpleDecrypt(profile.access_token, process.env.JWT_SECRET)
      : null;

    const reposResult = await githubService.fetchUserRepos(profile.github_username, token);
    const importedIds = await githubModel.getImportedRepoIds(userId);

    let updated = 0, newRepos = 0;
    for (const repo of reposResult.repos) {
      const lastCommit = await githubService.fetchLastCommit(profile.github_username, repo.name, token);
      if (importedIds.includes(repo.id)) {
        await githubModel.upsertRepository(userId, { ...repo, lastCommit });
        updated++;
      } else {
        newRepos++;
        // Note: not auto-importing new ones — user chooses which to import
      }
    }

    // Update profile stats
    const profileResult = await githubService.fetchGitHubProfile(profile.github_username, token);
    if (profileResult.success) {
      await githubModel.upsertGitHubProfile(userId, {
        ...profileResult.profile,
        github_username: profile.github_username,
        access_token: profile.access_token,
        token_encrypted: profile.token_encrypted,
        total_stars: reposResult.totalStars || 0,
        total_forks: reposResult.totalForks || 0,
        oauth_mode: profile.oauth_mode
      });
    }

    await githubModel.updateLastSynced(userId);

    res.json({
      success: true,
      message: `Sync complete. ${updated} repositories updated.`,
      updated,
      new_available: newRepos,
      last_synced: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/github/contributions ──────────────────────────────
const getContributions = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await githubModel.getGitHubProfile(userId);

    let commitMap = {};
    let source = 'mock';

    if (profile) {
      const token = profile.oauth_mode && profile.access_token
        ? githubService.simpleDecrypt(profile.access_token, process.env.JWT_SECRET)
        : null;

      const result = await githubService.fetchContributions(profile.github_username, token);
      if (result.success) {
        commitMap = result.commits;
        source = 'github';
      }
    }

    // Always merge EduNet activity regardless
    const mockResult = await githubService.generateMockHeatmap(userId);
    if (mockResult.success) {
      Object.keys(mockResult.commits).forEach(day => {
        if (!commitMap[day]) {
          commitMap[day] = mockResult.commits[day];
        } else {
          // Merge counts
          if (typeof commitMap[day] === 'number') {
            commitMap[day] += (mockResult.commits[day].commits || 0);
          } else {
            commitMap[day].commits = (commitMap[day].commits || 0) + (mockResult.commits[day].commits || 0);
          }
        }
      });
      source = source === 'github' ? 'combined' : 'edunet';
    }

    // Calculate summary stats
    const days = Object.keys(commitMap);
    let totalContributions = 0;
    let longestStreak = 0, currentStreak = 0;
    let streak = 0, prevDay = null;

    const sortedDays = days.sort();
    sortedDays.forEach(d => {
      const val = commitMap[d];
      const count = typeof val === 'number' ? val : (val.commits || 0);
      if (count > 0) {
        totalContributions += count;
        if (prevDay) {
          const diff = (new Date(d) - new Date(prevDay)) / (1000 * 60 * 60 * 24);
          if (diff === 1) { streak++; } else { streak = 1; }
        } else { streak = 1; }
        longestStreak = Math.max(longestStreak, streak);
        prevDay = d;
      } else {
        streak = 0;
        prevDay = null;
      }
    });

    // Current streak (from today backward)
    const today = new Date().toISOString().slice(0, 10);
    const todayDate = new Date(today);
    let cs = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(todayDate);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const val = commitMap[key];
      const count = val ? (typeof val === 'number' ? val : (val.commits || 0)) : 0;
      if (count > 0) { cs++; } else if (i > 0) { break; }
    }
    currentStreak = cs;

    res.json({
      success: true,
      source,
      heatmap: commitMap,
      stats: {
        total_contributions: totalContributions,
        active_days: days.filter(d => {
          const v = commitMap[d];
          return (typeof v === 'number' ? v : (v.commits || 0)) > 0;
        }).length,
        longest_streak: longestStreak,
        current_streak: currentStreak
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/github/pin ─────────────────────────────────────────
const pinRepo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { repo_id, pinned } = req.body;
    await githubModel.setPinnedRepo(userId, repo_id, pinned);
    res.json({ success: true, message: pinned ? 'Repository pinned.' : 'Repository unpinned.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/github/hide ────────────────────────────────────────
const hideRepo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { repo_id, hidden } = req.body;
    await githubModel.setHiddenRepo(userId, repo_id, hidden);
    res.json({ success: true, message: hidden ? 'Repository hidden.' : 'Repository visible.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/github/reorder ────────────────────────────────────
const reorderRepos = async (req, res) => {
  try {
    const userId = req.user.id;
    const { order } = req.body; // [{ repo_id, sort_order }]
    if (!Array.isArray(order)) {
      return res.status(400).json({ success: false, message: 'Order array required.' });
    }
    for (const item of order) {
      await githubModel.setSortOrder(userId, item.repo_id, item.sort_order);
    }
    res.json({ success: true, message: 'Repository order updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getConnectUrl,
  handleCallback,
  connectManual,
  disconnect,
  getProfile,
  getRepos,
  importRepos,
  syncRepos,
  getContributions,
  pinRepo,
  hideRepo,
  reorderRepos
};
