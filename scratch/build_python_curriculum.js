// ============================================================
// scratch/build_python_curriculum.js
// Script to generate production-ready 12-file curriculum for all 37 Python lessons
// ============================================================
'use strict';

const fs = require('fs');
const path = require('path');

const CURRICULUM_BASE = path.join(__dirname, '..', 'curriculum', 'python', 'modules');

// Helper to write JSON cleanly
function writeJson(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

console.log('Building Python curriculum overhaul script...');
