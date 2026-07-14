// ============================================================
// backend/services/engine/domainDetector.js
// EduNet Content Engine — Robust Domain & Lesson Focus Detector
// Maps (roadmap + module + lessonTitle + description + language) → { domain, focus, language, conceptKey }
// ============================================================
'use strict';

const DOMAINS = [
  { key: 'python', match: /\bpython\b/i },
  { key: 'java', match: /\bjava\b(?!script)/i },
  { key: 'javascript', match: /\b(javascript|js|es6|es20\d\d)\b/i },
  { key: 'c++', match: /\b(c\+\+|cpp)\b/i },
  { key: 'c', match: /\b(c)\b/i }, // will check with word boundaries
  { key: 'sql', match: /\b(sql|mysql|postgres|postgresql|database|queries)\b/i },
  { key: 'html', match: /\b(html|html5)\b/i },
  { key: 'css', match: /\b(css|css3|style|flexbox|grid)\b/i },
  { key: 'react', match: /\b(react|reactjs|jsx|hooks|components)\b/i },
  { key: 'node.js', match: /\b(node|nodejs|express|backend)\b/i },
  { key: 'mongodb', match: /\b(mongodb|mongo|nosql)\b/i },
  { key: 'rest apis', match: /\b(rest api|rest apis|web api|web apis|endpoints)\b/i },
  { key: 'git', match: /\b(git|github|version control)\b/i },
  { key: 'docker', match: /\b(docker|kubernetes|k8s|containers)\b/i },
  { key: 'devops', match: /\b(devops|ci\/cd|pipeline|jenkins)\b/i },
  { key: 'linux', match: /\b(linux|unix|bash|shell|terminal)\b/i },
  { key: 'operating systems', match: /\b(operating system|operating systems|processes|threads|semaphores|deadlocks)\b/i },
  { key: 'networking', match: /\b(networking|tcp|ip|dns|http|udp|socket|sockets)\b/i },
  { key: 'algorithms', match: /\b(algorithms|sorting|searching|dijkstra|greedy|dynamic programming|dp|memoization)\b/i },
  { key: 'data structures', match: /\b(data structures|arrays|linked lists|stacks|queues|trees|graphs|heaps|hashing|bst)\b/i },
  { key: 'deep learning', match: /\b(deep learning|neural network|neural networks|cnn|rnn|transformers|pytorch|tensorflow)\b/i },
  { key: 'nlp', match: /\b(nlp|natural language|large language models|llm|llms|prompt engineering|langchain|rag)\b/i },
  { key: 'computer vision', match: /\b(computer vision|opencv|image processing)\b/i },
  { key: 'machine learning', match: /\b(machine learning|regression|classification|clustering|random forest|supervised|unsupervised|ml)\b/i },
  { key: 'cybersecurity', match: /\b(cybersecurity|security|encryption|cryptography|hacking|auth|jwt)\b/i },
  { key: 'cloud', match: /\b(cloud|aws|azure|gcp|serverless)\b/i },
];

const FOCUS_PATTERNS = [
  { match: /\b(setup|installation|environment|install)\b/i, focus: 'Setup' },
  { match: /\b(introduction|intro|overview|fundamentals|basics|getting started)\b/i, focus: 'Introduction' },
  { match: /\b(syntax|grammar|variables|data types|constants|operators|declaration)\b/i, focus: 'Syntax' },
  { match: /\b(control flow|logic|conditionals|if|else|switch|branching)\b/i, focus: 'Control Flow' },
  { match: /\b(loops|loop|iteration|while|for|repeat)\b/i, focus: 'Logic' },
  { match: /\b(functions|function|methods|method|scope|closure|callbacks)\b/i, focus: 'Functions' },
  { match: /\b(classes|class|constructors|blueprints)\b/i, focus: 'Classes' },
  { match: /\b(objects|object|properties)\b/i, focus: 'Objects' },
  { match: /\b(abstraction|interfaces|abstract)\b/i, focus: 'Abstraction' },
  { match: /\b(encapsulation|private|public|getters|setters)\b/i, focus: 'Encapsulation' },
  { match: /\b(packages|package|modules|module|imports|exports)\b/i, focus: 'Packages' },
  { match: /\b(best practices|standards|style guide|clean code|refactoring)\b/i, focus: 'Best Practices' },
  { match: /\b(optimization|tuning|efficiency|indexing)\b/i, focus: 'Optimization' },
  { match: /\b(debugging|bugs|troubleshooting|stack trace)\b/i, focus: 'Debugging' },
  { match: /\b(testing|tests|unit testing|assertions|mocking)\b/i, focus: 'Testing' },
  { match: /\b(interview|prep|questions|faqs)\b/i, focus: 'Interview Preparation' },
  { match: /\b(projects|project|capstone|build)\b/i, focus: 'Projects' },
  { match: /\b(exercises|exercise|practice|challenges|challenge)\b/i, focus: 'Exercises' },
  { match: /\b(advanced|deep dive|complex|expert)\b/i, focus: 'Advanced Concepts' },
  { match: /\b(performance|complexity|time complexity|space complexity|o\(1\)|o\(n\))\b/i, focus: 'Performance' },
  { match: /\b(architecture|design patterns|mvc|microservices|system design)\b/i, focus: 'Architecture' },
  { match: /\b(deployment|ci\/cd|cloud|hosting|production)\b/i, focus: 'Deployment' },
];

/**
 * Normalizes text to help find patterns.
 */
function cleanText(val) {
  return String(val || '').toLowerCase().trim();
}

/**
 * Detects domain from full metadata context
 */
function detectDomain(metadata) {
  const roadmap = cleanText(metadata.roadmap);
  const language = cleanText(metadata.language);
  const moduleTitle = cleanText(metadata.module);
  const title = cleanText(metadata.lessonTitle || metadata.title);
  const desc = cleanText(metadata.lessonDescription || metadata.description || '');

  // High priority check: exact match language profiles or roadmap slugs
  if (language === 'python' || roadmap === 'python') return 'Python';
  if (language === 'java' || roadmap === 'java') return 'Java';
  if (language === 'javascript' || language === 'js' || roadmap === 'javascript' || roadmap === 'js') return 'JavaScript';
  if (language === 'cpp' || language === 'c++' || roadmap === 'cpp' || roadmap === 'c++') return 'C++';
  if (language === 'c' || roadmap === 'c') return 'C';
  if (language === 'sql' || roadmap === 'sql') return 'SQL';
  if (language === 'html' || roadmap === 'html') return 'HTML';
  if (language === 'css' || roadmap === 'css') return 'CSS';
  if (roadmap === 'webdev' || roadmap === 'web') {
    if (moduleTitle.includes('html') || title.includes('html')) return 'HTML';
    if (moduleTitle.includes('css') || title.includes('css')) return 'CSS';
    if (moduleTitle.includes('javascript') || title.includes('javascript') || moduleTitle.includes('js') || title.includes('js')) return 'JavaScript';
    if (moduleTitle.includes('react') || title.includes('react')) return 'React';
    if (moduleTitle.includes('node') || title.includes('node') || moduleTitle.includes('express') || title.includes('express')) return 'Node.js';
    return 'JavaScript'; // Web dev default
  }

  // Scan text combining fields
  const combined = `${title} ${moduleTitle} ${desc} ${roadmap}`;
  for (const item of DOMAINS) {
    if (item.match.test(combined)) {
      // Normalize casing
      return item.key.charAt(0).toUpperCase() + item.key.slice(1);
    }
  }

  // Language mapping as a fallback
  if (language === 'html') return 'HTML';
  if (language === 'css') return 'CSS';

  return 'General Programming';
}

/**
 * Detects lesson focus from titles and description
 */
function detectFocus(metadata) {
  const title = cleanText(metadata.lessonTitle || metadata.title);
  const moduleTitle = cleanText(metadata.module);
  const desc = cleanText(metadata.lessonDescription || metadata.description || '');

  const combined = `${title} ${moduleTitle} ${desc}`;

  for (const item of FOCUS_PATTERNS) {
    if (item.match.test(combined)) {
      return item.focus;
    }
  }

  return 'Core Concepts';
}

/**
 * Detects the language identifier
 */
function detectLanguage(metadata) {
  const lang = cleanText(metadata.language || '');
  const roadmap = cleanText(metadata.roadmap || '');

  const langMap = {
    'javascript': 'javascript', 'js': 'javascript', 'ts': 'javascript', 'typescript': 'javascript',
    'python': 'python', 'py': 'python',
    'java': 'java',
    'cpp': 'cpp', 'c++': 'cpp',
    'c': 'c',
    'sql': 'sql',
    'html': 'html',
    'css': 'css'
  };

  if (langMap[lang]) return langMap[lang];
  if (langMap[roadmap]) return langMap[roadmap];

  // Try parsing roadmap
  if (roadmap.includes('python')) return 'python';
  if (roadmap.includes('java') && !roadmap.includes('javascript')) return 'java';
  if (roadmap.includes('web') || roadmap.includes('sde')) return 'javascript';
  if (roadmap.includes('sql') || roadmap.includes('db') || roadmap.includes('database')) return 'sql';

  return 'javascript';
}

/**
 * Maps metadata to a normalized concept identifier key.
 */
function detectConceptKey(metadata, domain) {
  const moduleTitle = cleanText(metadata.module || '');
  const title = cleanText(metadata.lessonTitle || metadata.title || '');
  const combined = `${moduleTitle} ${title}`;

  if (combined.includes('variables') || combined.includes('variable')) return 'variables';
  if (combined.includes('constants') || combined.includes('constant')) return 'constants';
  if (combined.includes('loops') || combined.includes('loop') || combined.includes('iteration')) return 'loops';
  if (combined.includes('if statement') || combined.includes('conditionals') || combined.includes('control flow') || combined.includes('branching')) return 'if_statements';
  if (combined.includes('functions') || combined.includes('function') || combined.includes('scope')) return 'functions';
  if (combined.includes('classes') || combined.includes('class')) return 'classes';
  if (combined.includes('objects') || combined.includes('object') || combined.includes('oop')) return 'objects';
  if (combined.includes('inheritance')) return 'inheritance';
  if (combined.includes('polymorphism')) return 'polymorphism';
  if (combined.includes('pointers') || combined.includes('pointer') || combined.includes('memory address')) return 'pointers';
  if (combined.includes('recursion') || combined.includes('recursive')) return 'recursion';
  if (combined.includes('join') || combined.includes('joins')) return 'joins';
  if (combined.includes('rest api') || combined.includes('apis')) return 'rest_api';
  if (combined.includes('json')) return 'json';
  if (combined.includes('http')) return 'http';

  // Fallback slug format
  return moduleTitle
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
}

/**
 * Main detection entry point.
 * @param {Object} metadata - { language, module, lessonTitle, roadmap, description }
 * @returns {{ domain, focus, language, conceptKey }}
 */
function detect(metadata) {
  if (!metadata) {
    return { domain: 'General Programming', focus: 'Core Concepts', language: 'javascript', conceptKey: 'general' };
  }

  const domain = detectDomain(metadata);
  const focus = detectFocus(metadata);
  const language = detectLanguage(metadata);
  const conceptKey = detectConceptKey(metadata, domain);

  return { domain, focus, language, conceptKey };
}

module.exports = {
  detect,
  detectDomain,
  detectFocus,
  detectLanguage,
  detectConceptKey
};
