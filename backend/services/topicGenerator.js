// ============================================================
// backend/services/topicGenerator.js
// EduNet Human Teaching Engine — Metadata-Driven Topic Generator (Composed Version)
// ============================================================
'use strict';

const domainDetector = require('./engine/domainDetector');
const conceptProfiles = require('./engine/conceptProfiles');
const focusProfiles = require('./engine/focusProfiles');
const languageProfiles = require('./engine/languageProfiles');
const lessonComposer = require('./engine/lessonComposer');

/**
 * Redesigned dynamic composed curriculum engine.
 * Combines Domain + Focus + Language -> Textbook-grade Lesson.
 * @param {Object} metadata - { language, module, lessonTitle, lessonDescription, roadmap }
 * @returns {Object} 32-section structured lesson object
 */
function generateLessonFromTopic(metadata) {
  // 1. Detect metadata context details
  const detected = domainDetector.detect(metadata);

  // 2. Load profiles
  const conceptProfile = conceptProfiles.getProfile(detected.domain, detected.conceptKey, metadata);
  const focusProfile = focusProfiles.getProfile(detected.focus);
  const languageProfile = languageProfiles.getProfile(detected.language);

  // 3. Compose lesson from reusable templates
  return lessonComposer.compose(detected, conceptProfile, focusProfile, languageProfile, metadata);
}

module.exports = {
  generateLessonFromTopic
};
