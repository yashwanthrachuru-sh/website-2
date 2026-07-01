// ============================================================
// backend/services/analyticsService.js
// Portfolio view/click tracking and analytics aggregation
// ============================================================
'use strict';

const crypto = require('crypto');
const db = require('../config/db');

// ── Hash visitor identity (privacy-safe, no raw IP storage) ───
function hashVisitor(ip, userAgent = '') {
  const raw = (ip || '') + '|' + (userAgent || '');
  return crypto.createHash('sha256').update(raw).digest('hex').slice(0, 32);
}

// ── Track Portfolio View ───────────────────────────────────────
async function trackView(portfolioUserId, req) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || '';
    const ua = req.headers['user-agent'] || '';
    const referrer = (req.headers['referer'] || '').slice(0, 500);
    const visitorHash = hashVisitor(ip, ua);
    const userAgentHash = crypto.createHash('sha256').update(ua).digest('hex').slice(0, 32);

    // Check if this visitor has been seen today already
    const [[existing]] = await db.query(`
      SELECT id FROM portfolio_views
      WHERE portfolio_user_id = ? AND visitor_hash = ? AND view_date = ?
    `, [portfolioUserId, visitorHash, today]).catch(() => [[null]]);

    const isUnique = !existing ? 1 : 0;

    // Check if returning visitor (seen before today)
    const [[returning]] = await db.query(`
      SELECT id FROM portfolio_visitors
      WHERE portfolio_user_id = ? AND visitor_hash = ?
    `, [portfolioUserId, visitorHash]).catch(() => [[null]]);

    const isReturning = (returning && isUnique) ? 1 : 0;

    await db.query(`
      INSERT INTO portfolio_views
        (portfolio_user_id, visitor_hash, referrer, user_agent_hash, is_unique, is_returning, view_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [portfolioUserId, visitorHash, referrer, userAgentHash, isUnique, isReturning, today]
    ).catch(() => {});

    // Upsert visitor aggregate
    await db.query(`
      INSERT INTO portfolio_visitors (portfolio_user_id, visitor_hash, first_seen, last_seen, total_visits)
      VALUES (?, ?, ?, ?, 1)
      ON DUPLICATE KEY UPDATE last_seen = ?, total_visits = total_visits + 1
    `, [portfolioUserId, visitorHash, today, today, today]).catch(() => {});

  } catch (err) {
    // Non-fatal — tracking errors should not break public portfolio
    console.warn('trackView error:', err.message);
  }
}

// ── Track Portfolio Click ──────────────────────────────────────
async function trackClick(portfolioUserId, clickType, targetId = null, targetName = null, req = null) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const ip = req?.headers?.['x-forwarded-for']?.split(',')[0] || req?.socket?.remoteAddress || '';
    const ua = req?.headers?.['user-agent'] || '';
    const visitorHash = hashVisitor(ip, ua);

    await db.query(`
      INSERT INTO portfolio_clicks
        (portfolio_user_id, visitor_hash, click_type, target_id, target_name, click_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [portfolioUserId, visitorHash, clickType, String(targetId || ''), targetName || null, today]
    ).catch(() => {});
  } catch (err) {
    console.warn('trackClick error:', err.message);
  }
}

// ── Get Analytics Summary ──────────────────────────────────────
async function getAnalyticsSummary(userId) {
  try {
    // Total views
    const [[viewTotals]] = await db.query(`
      SELECT
        COUNT(*) AS total_views,
        SUM(is_unique) AS unique_views,
        SUM(is_returning) AS returning_views,
        ROUND(AVG(session_seconds)) AS avg_session
      FROM portfolio_views
      WHERE portfolio_user_id = ?
    `, [userId]).catch(() => [[{ total_views: 0, unique_views: 0, returning_views: 0, avg_session: 0 }]]);

    // Clicks by type
    const [clickTypes] = await db.query(`
      SELECT click_type, COUNT(*) AS cnt
      FROM portfolio_clicks
      WHERE portfolio_user_id = ?
      GROUP BY click_type
    `, [userId]).catch(() => [[]]);

    const clicks = {};
    clickTypes.forEach(r => { clicks[r.click_type] = r.cnt; });

    // Most viewed project (by click count)
    const [[topProject]] = await db.query(`
      SELECT target_name, COUNT(*) AS cnt
      FROM portfolio_clicks
      WHERE portfolio_user_id = ? AND click_type = 'project'
      GROUP BY target_name
      ORDER BY cnt DESC LIMIT 1
    `, [userId]).catch(() => [[null]]);

    // Resume downloads and views
    const resumeDownloads = clicks['resume_download'] || 0;
    const resumeViews = clicks['resume_view'] || 0;

    // Certificate downloads
    const certDownloads = clicks['certificate'] || 0;

    // GitHub clicks
    const githubClicks = clicks['github'] || 0;

    // Contact clicks
    const contactClicks = clicks['contact'] || 0;

    return {
      total_views: viewTotals?.total_views || 0,
      unique_visitors: viewTotals?.unique_views || 0,
      returning_visitors: viewTotals?.returning_views || 0,
      avg_session_seconds: viewTotals?.avg_session || 0,
      resume_downloads: resumeDownloads,
      resume_views: resumeViews,
      certificate_downloads: certDownloads,
      github_clicks: githubClicks,
      project_clicks: clicks['project'] || 0,
      contact_clicks: contactClicks,
      linkedin_clicks: clicks['linkedin'] || 0,
      share_clicks: clicks['share'] || 0,
      top_project: topProject?.target_name || null
    };
  } catch (err) {
    console.error('getAnalyticsSummary error:', err.message);
    return { total_views: 0, unique_visitors: 0, returning_visitors: 0 };
  }
}

// ── Get Daily Views (for line chart) ──────────────────────────
async function getDailyViews(userId, days = 30) {
  try {
    const [rows] = await db.query(`
      SELECT
        DATE_FORMAT(view_date, '%Y-%m-%d') AS day,
        COUNT(*) AS total,
        SUM(is_unique) AS unique_views
      FROM portfolio_views
      WHERE portfolio_user_id = ? AND view_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY view_date
      ORDER BY view_date ASC
    `, [userId, days]).catch(() => [[]]);

    return rows;
  } catch (err) {
    return [];
  }
}

// ── Get Top Projects (by click count) ─────────────────────────
async function getTopProjects(userId) {
  try {
    const [rows] = await db.query(`
      SELECT target_name AS project, COUNT(*) AS clicks
      FROM portfolio_clicks
      WHERE portfolio_user_id = ? AND click_type = 'project'
      GROUP BY target_name
      ORDER BY clicks DESC
      LIMIT 5
    `, [userId]).catch(() => [[]]);
    return rows;
  } catch (err) {
    return [];
  }
}

// ── Get Traffic Sources (referrer distribution) ────────────────
async function getTrafficSources(userId) {
  try {
    const [rows] = await db.query(`
      SELECT
        CASE
          WHEN referrer LIKE '%linkedin%' THEN 'LinkedIn'
          WHEN referrer LIKE '%github%' THEN 'GitHub'
          WHEN referrer LIKE '%google%' THEN 'Google'
          WHEN referrer LIKE '%twitter%' OR referrer LIKE '%x.com%' THEN 'Twitter/X'
          WHEN referrer = '' OR referrer IS NULL THEN 'Direct'
          ELSE 'Other'
        END AS source,
        COUNT(*) AS count
      FROM portfolio_views
      WHERE portfolio_user_id = ? AND view_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY source
      ORDER BY count DESC
    `, [userId]).catch(() => [[]]);
    return rows;
  } catch (err) {
    return [];
  }
}

// ── Calculate Portfolio Strength Score (0-100) ─────────────────
async function calculateStrength(userId, portfolioData) {
  try {
    const { settings, socials, resume_url, projects, skills, certificates, achievements } = portfolioData || {};

    const breakdown = {};
    let score = 0;

    // Profile completeness (30pts)
    if (settings?.profile_picture) { breakdown.profile_picture = 5; score += 5; }
    if (settings?.headline)        { breakdown.headline = 5; score += 5; }
    if (settings?.about_me)        { breakdown.about_me = 10; score += 10; }
    if (settings?.location)        { breakdown.location = 5; score += 5; }
    if (settings?.availability)    { breakdown.availability = 5; score += 5; }

    // GitHub integration (15pts)
    const [[gh]] = await db.query(
      'SELECT id FROM user_github_profiles WHERE user_id = ?', [userId]
    ).catch(() => [[null]]);
    if (gh)               { breakdown.github_connected = 10; score += 10; }
    if (socials?.github_url) { breakdown.github_social = 5; score += 5; }

    // Resume (15pts)
    if (resume_url)       { breakdown.resume = 10; score += 10; }
    const [[resume]] = await db.query(
      'SELECT id FROM user_resumes WHERE user_id = ? LIMIT 1', [userId]
    ).catch(() => [[null]]);
    if (resume)           { breakdown.resume_builder = 5; score += 5; }

    // Social links (10pts)
    if (socials?.linkedin_url) { breakdown.linkedin = 5; score += 5; }
    if (socials?.website_url || socials?.twitter_url) { breakdown.social_other = 5; score += 5; }

    // Projects (15pts)
    const projectCount = Array.isArray(projects) ? projects.length : 0;
    if (projectCount >= 3) { breakdown.projects_3plus = 10; score += 10; }
    else if (projectCount >= 1) { breakdown.projects_1plus = 5; score += 5; }
    const [[pinnedGh]] = await db.query(
      'SELECT id FROM github_repositories WHERE user_id = ? AND is_pinned = 1 LIMIT 1', [userId]
    ).catch(() => [[null]]);
    if (pinnedGh)         { breakdown.pinned_repos = 5; score += 5; }

    // Certificates (10pts)
    const certCount = Array.isArray(certificates) ? certificates.length : 0;
    if (certCount >= 2)   { breakdown.certificates_2plus = 10; score += 10; }
    else if (certCount >= 1) { breakdown.certificates_1plus = 5; score += 5; }

    // Skills (5pts)
    const skillCount = Array.isArray(skills) ? skills.length : 0;
    if (skillCount >= 5)  { breakdown.skills = 5; score += 5; }

    score = Math.min(100, score);

    // Generate recommendations
    const recommendations = [];
    if (!settings?.profile_picture) recommendations.push('Add a profile picture to make your portfolio stand out');
    if (!settings?.headline)        recommendations.push('Write a professional headline describing your role');
    if (!settings?.about_me)        recommendations.push('Fill your About Me section with your coding journey');
    if (!gh)                         recommendations.push('Connect your GitHub profile to showcase repositories');
    if (!resume_url && !resume)      recommendations.push('Upload or create a resume using the Resume Builder');
    if (!socials?.linkedin_url)      recommendations.push('Add your LinkedIn profile URL to your portfolio');
    if (projectCount < 3)            recommendations.push('Add at least 3 projects to demonstrate your skills');
    if (certCount < 1)               recommendations.push('Complete a roadmap to earn your first certificate');
    if (skillCount < 5)              recommendations.push('Your skills are auto-calculated — complete more lessons to expand them');
    if (!pinnedGh)                   recommendations.push('Pin your best GitHub repositories for recruiters to see');

    // Cache the result
    await db.query(`
      INSERT INTO portfolio_strength_cache (user_id, score, recommendations, breakdown)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE score = ?, recommendations = ?, breakdown = ?, calculated_at = NOW()
    `, [
      userId, score, JSON.stringify(recommendations), JSON.stringify(breakdown),
      score, JSON.stringify(recommendations), JSON.stringify(breakdown)
    ]).catch(() => {});

    return { score, recommendations, breakdown };
  } catch (err) {
    console.error('calculateStrength error:', err.message);
    return { score: 0, recommendations: [], breakdown: {} };
  }
}

module.exports = {
  trackView,
  trackClick,
  getAnalyticsSummary,
  getDailyViews,
  getTopProjects,
  getTrafficSources,
  calculateStrength,
  hashVisitor
};
