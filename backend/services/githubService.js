// ============================================================
// backend/services/githubService.js
// GitHub API abstraction layer with graceful fallback to mock data
// ============================================================
'use strict';

const https = require('https');
const db = require('../config/db');

const GITHUB_API = 'api.github.com';
const USER_AGENT = 'EduNet-Portfolio/2.0';

// ── Generic HTTPS GET helper ───────────────────────────────────
function httpsGet(hostname, path, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      path,
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/vnd.github.v3+json',
        ...headers
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(parsed.message || `GitHub API error ${res.statusCode}`));
          } else {
            resolve({ data: parsed, headers: res.headers, status: res.statusCode });
          }
        } catch (e) {
          reject(new Error('Failed to parse GitHub API response'));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(8000, () => { req.destroy(); reject(new Error('GitHub API timeout')); });
    req.end();
  });
}

// ── Build auth header ──────────────────────────────────────────
function authHeader(token) {
  return token ? { 'Authorization': `token ${token}` } : {};
}

// ── Fetch GitHub user profile ──────────────────────────────────
async function fetchGitHubProfile(username, token = null) {
  try {
    const { data } = await httpsGet(GITHUB_API, `/users/${username}`, authHeader(token));
    return {
      success: true,
      profile: {
        login: data.login,
        name: data.name,
        bio: data.bio,
        company: data.company,
        blog: data.blog,
        location: data.location,
        avatar_url: data.avatar_url,
        followers: data.followers || 0,
        following: data.following || 0,
        public_repos: data.public_repos || 0,
        github_created_at: data.created_at
      }
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── Fetch user repositories (paginated) ───────────────────────
async function fetchUserRepos(username, token = null) {
  try {
    let allRepos = [];
    let page = 1;
    const perPage = 100;

    while (page <= 5) { // max 500 repos
      const { data } = await httpsGet(
        GITHUB_API,
        `/users/${username}/repos?sort=updated&per_page=${perPage}&page=${page}&type=owner`,
        authHeader(token)
      );
      if (!Array.isArray(data) || data.length === 0) break;
      allRepos = allRepos.concat(data);
      if (data.length < perPage) break;
      page++;
    }

    // Enrich with total stars and forks
    let totalStars = 0, totalForks = 0;
    allRepos.forEach(r => {
      totalStars += r.stargazers_count || 0;
      totalForks += r.forks_count || 0;
    });

    return { success: true, repos: allRepos, totalStars, totalForks };
  } catch (err) {
    return { success: false, repos: [], error: err.message };
  }
}

// ── Fetch last commit for a specific repo ──────────────────────
async function fetchLastCommit(username, repoName, token = null) {
  try {
    const { data } = await httpsGet(
      GITHUB_API,
      `/repos/${username}/${repoName}/commits?per_page=1`,
      authHeader(token)
    );
    if (Array.isArray(data) && data.length > 0) {
      const c = data[0];
      return {
        sha: c.sha ? c.sha.slice(0, 7) : null,
        message: c.commit?.message ? c.commit.message.split('\n')[0].slice(0, 100) : null,
        date: c.commit?.author?.date || null,
        author: c.commit?.author?.name || null
      };
    }
    return null;
  } catch (_) {
    return null;
  }
}

// ── Fetch contribution calendar (365 days) ─────────────────────
// GitHub doesn't offer a public API for contributions; we use events as proxy
async function fetchContributions(username, token = null) {
  try {
    const { data } = await httpsGet(
      GITHUB_API,
      `/users/${username}/events?per_page=100`,
      authHeader(token)
    );

    // Build day map from push events
    const dayMap = {};
    if (Array.isArray(data)) {
      data.forEach(event => {
        if (event.type === 'PushEvent' && event.created_at) {
          const day = event.created_at.slice(0, 10);
          dayMap[day] = (dayMap[day] || 0) + (event.payload?.commits?.length || 1);
        }
      });
    }

    return { success: true, commits: dayMap };
  } catch (err) {
    return { success: false, commits: {}, error: err.message };
  }
}

// ── Generate mock heatmap from EduNet internal activity ────────
async function generateMockHeatmap(userId) {
  try {
    const [activityRows] = await db.query(`
      SELECT DATE_FORMAT(date, '%Y-%m-%d') AS day,
             COALESCE(lessons_done, 0) + COALESCE(quiz_attempts, 0) AS activity_count,
             COALESCE(xp_earned, 0) AS xp,
             COALESCE(coding_minutes, 0) AS coding_minutes
      FROM user_activity
      WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 365 DAY)
      ORDER BY date ASC
    `, [userId]).catch(() => [[]]);

    const dayMap = {};
    activityRows.forEach(r => {
      dayMap[r.day] = {
        commits: r.activity_count || 0,
        xp: r.xp || 0,
        coding_minutes: r.coding_minutes || 0,
        source: 'edunet'
      };
    });

    // Also merge challenge submissions
    const [challengeRows] = await db.query(`
      SELECT DATE_FORMAT(submitted_at, '%Y-%m-%d') AS day, COUNT(*) AS cnt
      FROM challenge_submissions
      WHERE user_id = ?
      GROUP BY DATE(submitted_at)
    `, [userId]).catch(() => [[]]);

    challengeRows.forEach(r => {
      if (dayMap[r.day]) {
        dayMap[r.day].commits += r.cnt;
      } else {
        dayMap[r.day] = { commits: r.cnt, xp: 0, coding_minutes: 0, source: 'challenges' };
      }
    });

    return { success: true, commits: dayMap, source: 'mock' };
  } catch (err) {
    return { success: false, commits: {}, error: err.message };
  }
}

// ── Build OAuth URL ────────────────────────────────────────────
function getOAuthUrl(state) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) return null;
  const scope = 'read:user,repo';
  return `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`;
}

// ── Exchange OAuth code for access token ───────────────────────
function exchangeCodeForToken(code) {
  return new Promise((resolve, reject) => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return reject(new Error('GitHub OAuth not configured.'));
    }

    const body = JSON.stringify({ client_id: clientId, client_secret: clientSecret, code });

    const options = {
      hostname: 'github.com',
      path: '/login/oauth/access_token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': USER_AGENT,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) reject(new Error(parsed.error_description || parsed.error));
          else resolve(parsed.access_token);
        } catch (e) {
          reject(new Error('Failed to parse token response'));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(8000, () => { req.destroy(); reject(new Error('OAuth timeout')); });
    req.write(body);
    req.end();
  });
}

// ── Simple XOR obfuscation for token storage (not production crypto) ─
function simpleEncrypt(text, key) {
  if (!text) return null;
  const keyStr = key || 'edunet_gh_key';
  return Buffer.from(
    text.split('').map((c, i) =>
      c.charCodeAt(0) ^ keyStr.charCodeAt(i % keyStr.length)
    )
  ).toString('base64');
}

function simpleDecrypt(encoded, key) {
  if (!encoded) return null;
  const keyStr = key || 'edunet_gh_key';
  const bytes = Buffer.from(encoded, 'base64');
  return bytes.map((b, i) => b ^ keyStr.charCodeAt(i % keyStr.length)).reduce((s, c) => s + String.fromCharCode(c), '');
}

// ── Check if OAuth is configured ──────────────────────────────
function isOAuthConfigured() {
  return !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
}

module.exports = {
  fetchGitHubProfile,
  fetchUserRepos,
  fetchLastCommit,
  fetchContributions,
  generateMockHeatmap,
  getOAuthUrl,
  exchangeCodeForToken,
  simpleEncrypt,
  simpleDecrypt,
  isOAuthConfigured
};
