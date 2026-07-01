// ============================================================
// backend/models/githubModel.js
// SQL query wrappers for GitHub Integration
// ============================================================
'use strict';

const db = require('../config/db');

// ── Profile Operations ─────────────────────────────────────────

async function getGitHubProfile(userId) {
  const [[row]] = await db.query(
    'SELECT * FROM user_github_profiles WHERE user_id = ?',
    [userId]
  );
  return row || null;
}

async function upsertGitHubProfile(userId, data) {
  const {
    github_username, access_token = null, token_encrypted = 0,
    avatar_url = null, name = null, bio = null, company = null,
    blog = null, location = null, followers = 0, following = 0,
    public_repos = 0, total_stars = 0, total_forks = 0,
    github_created_at = null, oauth_mode = 0
  } = data;

  await db.query(`
    INSERT INTO user_github_profiles
      (user_id, github_username, access_token, token_encrypted, avatar_url, name, bio,
       company, blog, location, followers, following, public_repos,
       total_stars, total_forks, github_created_at, oauth_mode, last_synced)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      github_username   = VALUES(github_username),
      access_token      = VALUES(access_token),
      token_encrypted   = VALUES(token_encrypted),
      avatar_url        = VALUES(avatar_url),
      name              = VALUES(name),
      bio               = VALUES(bio),
      company           = VALUES(company),
      blog              = VALUES(blog),
      location          = VALUES(location),
      followers         = VALUES(followers),
      following         = VALUES(following),
      public_repos      = VALUES(public_repos),
      total_stars       = VALUES(total_stars),
      total_forks       = VALUES(total_forks),
      github_created_at = VALUES(github_created_at),
      oauth_mode        = VALUES(oauth_mode),
      last_synced       = NOW()
  `, [
    userId, github_username, access_token, token_encrypted, avatar_url,
    name, bio, company, blog, location, followers, following,
    public_repos, total_stars, total_forks, github_created_at, oauth_mode
  ]);
}

async function deleteGitHubProfile(userId) {
  await db.query('DELETE FROM user_github_profiles WHERE user_id = ?', [userId]);
  await db.query('DELETE FROM github_repositories WHERE user_id = ?', [userId]);
}

async function updateLastSynced(userId) {
  await db.query(
    'UPDATE user_github_profiles SET last_synced = NOW() WHERE user_id = ?',
    [userId]
  );
}

// ── Repository Operations ──────────────────────────────────────

async function getRepositories(userId) {
  const [rows] = await db.query(`
    SELECT * FROM github_repositories
    WHERE user_id = ? AND is_hidden = 0
    ORDER BY is_pinned DESC, sort_order ASC, stars DESC
  `, [userId]);
  return rows;
}

async function getAllRepositories(userId) {
  const [rows] = await db.query(
    'SELECT * FROM github_repositories WHERE user_id = ? ORDER BY is_pinned DESC, stars DESC',
    [userId]
  );
  return rows;
}

async function getImportedRepoIds(userId) {
  const [rows] = await db.query(
    'SELECT github_repo_id FROM github_repositories WHERE user_id = ?',
    [userId]
  );
  return rows.map(r => r.github_repo_id);
}

async function upsertRepository(userId, repo) {
  const topics = Array.isArray(repo.topics) ? repo.topics.join(',') : (repo.topics || '');
  await db.query(`
    INSERT INTO github_repositories
      (user_id, github_repo_id, name, full_name, description, html_url, homepage,
       language, stars, forks, watchers, open_issues, size_kb, license, topics,
       default_branch, is_fork, is_archived, last_commit_sha, last_commit_message,
       last_commit_date, github_created_at, github_updated_at, last_synced)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      name               = VALUES(name),
      full_name          = VALUES(full_name),
      description        = VALUES(description),
      html_url           = VALUES(html_url),
      homepage           = VALUES(homepage),
      language           = VALUES(language),
      stars              = VALUES(stars),
      forks              = VALUES(forks),
      watchers           = VALUES(watchers),
      open_issues        = VALUES(open_issues),
      size_kb            = VALUES(size_kb),
      license            = VALUES(license),
      topics             = VALUES(topics),
      default_branch     = VALUES(default_branch),
      is_fork            = VALUES(is_fork),
      is_archived        = VALUES(is_archived),
      last_commit_sha    = VALUES(last_commit_sha),
      last_commit_message= VALUES(last_commit_message),
      last_commit_date   = VALUES(last_commit_date),
      github_updated_at  = VALUES(github_updated_at),
      last_synced        = NOW()
  `, [
    userId, repo.id, repo.name, repo.full_name, repo.description || null,
    repo.html_url, repo.homepage || null,
    repo.language || null, repo.stargazers_count || 0, repo.forks_count || 0,
    repo.watchers_count || 0, repo.open_issues_count || 0,
    repo.size || 0,
    repo.license ? (repo.license.spdx_id || repo.license.name || null) : null,
    topics,
    repo.default_branch || 'main',
    repo.fork ? 1 : 0,
    repo.archived ? 1 : 0,
    repo.lastCommit ? repo.lastCommit.sha : null,
    repo.lastCommit ? repo.lastCommit.message : null,
    repo.lastCommit ? repo.lastCommit.date : null,
    repo.created_at || null,
    repo.updated_at || null
  ]);
}

async function setPinnedRepo(userId, repoId, pinned) {
  await db.query(
    'UPDATE github_repositories SET is_pinned = ? WHERE user_id = ? AND id = ?',
    [pinned ? 1 : 0, userId, repoId]
  );
}

async function setHiddenRepo(userId, repoId, hidden) {
  await db.query(
    'UPDATE github_repositories SET is_hidden = ? WHERE user_id = ? AND id = ?',
    [hidden ? 1 : 0, userId, repoId]
  );
}

async function setSortOrder(userId, repoId, order) {
  await db.query(
    'UPDATE github_repositories SET sort_order = ? WHERE user_id = ? AND id = ?',
    [order, userId, repoId]
  );
}

async function getRepoByGitHubId(userId, githubRepoId) {
  const [[row]] = await db.query(
    'SELECT * FROM github_repositories WHERE user_id = ? AND github_repo_id = ?',
    [userId, githubRepoId]
  );
  return row || null;
}

module.exports = {
  getGitHubProfile,
  upsertGitHubProfile,
  deleteGitHubProfile,
  updateLastSynced,
  getRepositories,
  getAllRepositories,
  getImportedRepoIds,
  upsertRepository,
  setPinnedRepo,
  setHiddenRepo,
  setSortOrder,
  getRepoByGitHubId
};
