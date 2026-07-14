// ============================================================
// backend/services/codeValidator.js
// EduNet Code Quality Validator — Compilers and Syntax Parsers
// ============================================================
'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

/**
 * Validates syntax of a code block based on language.
 * @param {string} language - Target language (e.g., 'python', 'javascript', 'c', 'cpp', 'java', 'sql', 'html', 'css')
 * @param {string} code - The source code to validate.
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateCode(language, code) {
  if (!code || code.trim() === '') {
    return { valid: false, error: 'Empty code block' };
  }

  const lang = language.toLowerCase();
  
  // Clean up markdown markers if present
  let cleanCode = code;
  if (cleanCode.startsWith('```')) {
    const lines = cleanCode.split('\n');
    cleanCode = lines.slice(1, lines.length - 1).join('\n');
  }

  // 1. JavaScript Validation
  if (lang === 'javascript' || lang === 'js') {
    try {
      new vm.Script(cleanCode);
      return { valid: true, error: null };
    } catch (err) {
      return { valid: false, error: `JavaScript Syntax Error: ${err.message}` };
    }
  }

  // Temporary file path for compiled language checks
  const tmpDir = path.join(__dirname, '../scratch');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  const fileHash = require('crypto').createHash('md5').update(cleanCode).digest('hex');

  // 2. Python Validation
  if (lang === 'python' || lang === 'py') {
    const tmpFile = path.join(tmpDir, `tmp_${fileHash}.py`);
    try {
      fs.writeFileSync(tmpFile, cleanCode);
      // Run py_compile via python3
      execSync(`python3 -m py_compile ${tmpFile}`, { stdio: 'pipe' });
      return { valid: true, error: null };
    } catch (err) {
      return { valid: false, error: `Python Compile Error: ${err.stderr ? err.stderr.toString() : err.message}` };
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  }

  // 3. C Validation
  if (lang === 'c') {
    const tmpFile = path.join(tmpDir, `tmp_${fileHash}.c`);
    try {
      fs.writeFileSync(tmpFile, cleanCode);
      // Run gcc -fsyntax-only
      execSync(`gcc -fsyntax-only ${tmpFile}`, { stdio: 'pipe' });
      return { valid: true, error: null };
    } catch (err) {
      const errMsg = err.stderr ? err.stderr.toString() : err.message;
      // Filter out warnings or temp file paths to keep output clean
      return { valid: false, error: `C Syntax Error: ${errMsg.replace(tmpFile, 'source.c')}` };
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  }

  // 4. C++ Validation
  if (lang === 'cpp' || lang === 'c++') {
    const tmpFile = path.join(tmpDir, `tmp_${fileHash}.cpp`);
    try {
      fs.writeFileSync(tmpFile, cleanCode);
      // Run g++ -fsyntax-only
      execSync(`g++ -fsyntax-only ${tmpFile}`, { stdio: 'pipe' });
      return { valid: true, error: null };
    } catch (err) {
      const errMsg = err.stderr ? err.stderr.toString() : err.message;
      return { valid: false, error: `C++ Syntax Error: ${errMsg.replace(tmpFile, 'source.cpp')}` };
    } finally {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  }

  // 5. Java Validation (Fallback Regex-based compile parse)
  if (lang === 'java') {
    // Check balanced braces
    const openBraces = (cleanCode.match(/\{/g) || []).length;
    const closeBraces = (cleanCode.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      return { valid: false, error: `Java Syntax Error: Unbalanced braces. { count: ${openBraces}, } count: ${closeBraces}` };
    }

    // Check class structure presence
    if (!/class\s+\w+/i.test(cleanCode)) {
      return { valid: false, error: 'Java Syntax Error: Class declaration missing' };
    }

    // Check standard public static void main or method structure
    if (cleanCode.includes('main') && !/public\s+static\s+void\s+main/i.test(cleanCode)) {
      return { valid: false, error: 'Java Syntax Error: Invalid main method signature' };
    }

    // Basic semicolon check for statements
    const lines = cleanCode.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.endsWith('{') && !l.endsWith('}') && !l.startsWith('//') && !l.startsWith('import') && !l.startsWith('@') && !l.startsWith('class') && !l.startsWith('public') && !l.startsWith('private') && !l.startsWith('protected'));
    
    for (const line of lines) {
      if (!line.endsWith(';') && !line.startsWith('for') && !line.startsWith('if') && !line.startsWith('while') && !line.startsWith('switch')) {
        return { valid: false, error: `Java Syntax Error: Statement missing semicolon: "${line}"` };
      }
    }

    return { valid: true, error: null };
  }

  // 6. SQL Validation
  if (lang === 'sql') {
    const uppercase = cleanCode.toUpperCase();
    // Validate SQL basic query parser rules
    if (!uppercase.includes('SELECT') && !uppercase.includes('INSERT') && !uppercase.includes('UPDATE') && !uppercase.includes('DELETE') && !uppercase.includes('CREATE') && !uppercase.includes('ALTER') && !uppercase.includes('WITH')) {
      return { valid: false, error: 'SQL Syntax Error: Statement must contain a valid keyword (SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, WITH)' };
    }
    
    if (uppercase.includes('SELECT') && !uppercase.includes('FROM') && !uppercase.includes('SELECT VERSION()') && !uppercase.includes('SELECT NOW()')) {
      return { valid: false, error: 'SQL Syntax Error: SELECT statement missing FROM clause' };
    }

    // Bracket matching
    const openParen = (cleanCode.match(/\(/g) || []).length;
    const closeParen = (cleanCode.match(/\)/g) || []).length;
    if (openParen !== closeParen) {
      return { valid: false, error: `SQL Syntax Error: Unbalanced parentheses. ( count: ${openParen}, ) count: ${closeParen}` };
    }

    return { valid: true, error: null };
  }

  // 7. HTML Validation
  if (lang === 'html') {
    const openTags = (cleanCode.match(/<\w+/g) || []).length;
    const closeTags = (cleanCode.match(/<\/\w+/g) || []).length;
    if (openTags > 0 && closeTags === 0) {
      return { valid: false, error: 'HTML Validation Warning: Missing closing tags.' };
    }
    return { valid: true, error: null };
  }

  // 8. CSS Validation
  if (lang === 'css') {
    const openBrace = (cleanCode.match(/\{/g) || []).length;
    const closeBrace = (cleanCode.match(/\}/g) || []).length;
    if (openBrace !== closeBrace) {
      return { valid: false, error: `CSS Syntax Error: Unbalanced brackets. { count: ${openBrace}, } count: ${closeBrace}` };
    }
    return { valid: true, error: null };
  }

  return { valid: true, error: null };
}

module.exports = {
  validateCode
};
