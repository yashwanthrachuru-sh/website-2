// ============================================================
// backend/services/knowledgeLoader.js
// EduNet Human Teaching Engine — Filesystem Caching Loader
// ============================================================
'use strict';

const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.resolve(__dirname, '..', 'knowledge');

/**
 * Normalizes title into standard lowercase folder or file slugs.
 */
function getSlug(title) {
  return (title || '')
    .replace(/Lesson\s*\d+:?/gi, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Loads a cached lesson from structured directory or legacy flat path.
 * @param {string} lang - Normalized language (e.g. 'python')
 * @param {string} category - Normalized category slug (e.g. 'variables')
 * @param {string} concept - Normalized concept slug (e.g. 'introduction')
 * @param {string} topic - Original topic/title string
 * @returns {Object|null} Cached JSON data or null
 */
function loadCachedConcept(lang, category, concept, topic) {
  const langKey = (lang || 'javascript').toLowerCase();
  const categorySlug = getSlug(category || 'general');
  const conceptSlug = getSlug(concept || 'general');
  const topicSlug = getSlug(topic || 'general');

  // Path 1: New Category-based path: knowledge/python/variables/introduction.json
  const nestedFile = path.join(KNOWLEDGE_DIR, langKey, categorySlug, `${conceptSlug}.json`);
  if (fs.existsSync(nestedFile)) {
    try {
      return JSON.parse(fs.readFileSync(nestedFile, 'utf8'));
    } catch (e) {
      console.error(`[knowledgeLoader] Error reading nested path: ${nestedFile}`, e.message);
    }
  }

  // Path 2: Legacy Flat path: knowledge/python/variables_data_types_introduction_setup.json
  const flatFile = path.join(KNOWLEDGE_DIR, langKey, `${topicSlug}.json`);
  if (fs.existsSync(flatFile)) {
    try {
      return JSON.parse(fs.readFileSync(flatFile, 'utf8'));
    } catch (e) {
      console.error(`[knowledgeLoader] Error reading legacy flat path: ${flatFile}`, e.message);
    }
  }

  return null;
}

/**
 * Caches newly generated concept lesson into the new structured folder format.
 */
function saveCachedConcept(lang, category, concept, data) {
  const langKey = (lang || 'javascript').toLowerCase();
  const categorySlug = getSlug(category || 'general');
  const conceptSlug = getSlug(concept || 'general');

  const nestedDir = path.join(KNOWLEDGE_DIR, langKey, categorySlug);
  const nestedFile = path.join(nestedDir, `${conceptSlug}.json`);

  try {
    if (!fs.existsSync(nestedDir)) {
      fs.mkdirSync(nestedDir, { recursive: true });
    }
    fs.writeFileSync(nestedFile, JSON.stringify(data, null, 2), 'utf8');
    console.log(`[knowledgeLoader] ✅ Cached lesson saved: ${nestedFile}`);
    return true;
  } catch (err) {
    console.error(`[knowledgeLoader] ❌ Failed to save lesson cache: ${nestedFile}`, err.message);
    return false;
  }
}

module.exports = {
  loadCachedConcept,
  saveCachedConcept,
  getSlug
};
