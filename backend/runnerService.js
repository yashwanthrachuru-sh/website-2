// ============================================================
// backend/runnerService.js
// Execution abstraction layer for playground script compilation
// ============================================================
'use strict';

async function runCode(language, sourceCode, input, expectedOutput) {
  // Abstract runner simulation (offline mock compiler)
  // Can be plugged with Judge0 API or Piston API in production environment.
  
  const cleanLang = language.toLowerCase();
  let status = 'Accepted';
  let output = expectedOutput || 'Output matches.';
  let executionTimeMs = Math.round(15 + Math.random() * 30);
  let memoryUsageKb = Math.round(2048 + Math.random() * 1024);

  // Basic syntax integrity audits (parenthesis matching checks)
  const openBraces = (sourceCode.match(/\{/g) || []).length;
  const closeBraces = (sourceCode.match(/\}/g) || []).length;
  if (openBraces !== closeBraces && (cleanLang === 'javascript' || cleanLang === 'java' || cleanLang === 'cpp' || cleanLang === 'c')) {
    return {
      status: 'Compilation Error',
      output: `SyntaxError: Unexpected end of input. Unmatched braces: ${openBraces} open vs ${closeBraces} closed.`,
      execution_time_ms: 0,
      memory_usage_kb: 0
    };
  }

  // Logic evaluations mocks
  const codeClean = sourceCode.replace(/\s+/g, '').toLowerCase();
  
  if (cleanLang === 'javascript') {
    if (codeClean.includes('twosum')) {
      if (!codeClean.includes('return') && !codeClean.includes('map') && !codeClean.includes('for')) {
        status = 'Wrong Answer';
        output = `Expected: ${expectedOutput}\nActual: undefined`;
      }
    }
  } else if (cleanLang === 'python') {
    if (codeClean.includes('reversestring')) {
      if (!codeClean.includes('while') && !codeClean.includes('left') && !codeClean.includes('reverse')) {
        status = 'Wrong Answer';
        output = `Expected: ${expectedOutput}\nActual: s[::-1]`;
      }
    }
  } else if (cleanLang === 'sql') {
    if (!codeClean.includes('select') || !codeClean.includes('salary') || !codeClean.includes('employees')) {
      status = 'Compilation Error';
      output = 'SQL Error: Employee table has no matching columns.';
      executionTimeMs = 0;
      memoryUsageKb = 0;
    }
  }

  return {
    status,
    output,
    execution_time_ms: executionTimeMs,
    memory_usage_kb: memoryUsageKb
  };
}

module.exports = { runCode };
