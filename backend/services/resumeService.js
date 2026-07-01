// ============================================================
// backend/services/resumeService.js
// ATS Scanner and keyword extraction service
// ============================================================
'use strict';

const STANDARD_TECH_KEYWORDS = [
  'javascript', 'python', 'react', 'node', 'sql', 'docker', 'git', 'css', 'html',
  'aws', 'kubernetes', 'java', 'c++', 'c', 'mongodb', 'express', 'linux', 'typescript',
  'rest api', 'system design', 'machine learning', 'ci/cd', 'agile', 'testing', 'security'
];

async function scanATS(resumeText, jobDescription) {
  const jdClean = jobDescription.toLowerCase();
  const resumeClean = resumeText.toLowerCase();

  let matched = [];
  let missing = [];

  // Match standard technical keywords present in JD
  const keywordsInJd = STANDARD_TECH_KEYWORDS.filter(k => jdClean.includes(k));

  if (!keywordsInJd.length) {
    // If JD is simple or holds no standard tech keywords, default to standard checks
    matched = ['communication'];
    missing = ['problem solving'];
  } else {
    keywordsInJd.forEach(k => {
      if (resumeClean.includes(k)) {
        matched.push(k);
      } else {
        missing.push(k);
      }
    });
  }

  // Calculate ATS Score base ratio
  const total = matched.length + missing.length;
  let score = total ? Math.round((matched.length / total) * 100) : 70;

  // Formatting checklist scores (bonuses for contacts elements)
  if (resumeClean.includes('github.com')) score += 5;
  if (resumeClean.includes('linkedin.com')) score += 5;
  if (resumeClean.includes('email') || resumeClean.includes('@')) score += 5;

  score = Math.min(100, Math.max(30, score));

  // Determine weak sections
  let suggestions = [];
  if (missing.length > 0) {
    suggestions.push(`Integrate missing tools references in skills section: ${missing.slice(0, 3).join(', ')}.`);
  }
  if (!resumeClean.includes('linkedin.com')) {
    suggestions.push('Provide a LinkedIn profile URL for professional recruiter verification.');
  }
  if (resumeText.length < 200) {
    suggestions.push('Expand professional summary section to detail your past impact and projects milestones.');
  }

  return {
    score,
    matched,
    missing,
    suggestions
  };
}

module.exports = { scanATS };
