// ============================================================
// js/coding-lab.js — EduNet Coding Lab
// ============================================================
'use strict';
const session = window.initPageShell('coding-lab.html');
const { showToast, addXP } = window.EduNetAPI;

const LANG_STARTERS = {
  javascript: `// Welcome to EduNet Coding Lab!\n// Language: JavaScript\n\nfunction greet(name) {\n  return \`Hello, \${name}! Welcome to EduNet.\`;\n}\n\nconsole.log(greet('Student'));\n\n// Try writing your own function below:\n`,
  python: `# Welcome to EduNet Coding Lab!\n# Language: Python (simulated)\n\ndef greet(name):\n    return f"Hello, {name}! Welcome to EduNet."\n\nprint(greet("Student"))\n\n# Try writing your own function below:\n`,
  java: `// Welcome to EduNet Coding Lab!\n// Language: Java (simulated)\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Student! Welcome to EduNet.");\n    }\n\n    public static String greet(String name) {\n        return "Hello, " + name + "!";\n    }\n}\n`,
  cpp: `// Welcome to EduNet Coding Lab!\n// Language: C++ (simulated)\n\n#include <iostream>\n#include <string>\nusing namespace std;\n\nstring greet(string name) {\n    return "Hello, " + name + "! Welcome to EduNet.";\n}\n\nint main() {\n    cout << greet("Student") << endl;\n    return 0;\n}\n`,
  html: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>EduNet HTML Lab</title>\n  <style>\n    body { font-family: Inter, sans-serif; background: #060811; color: #f0f4ff; padding: 2rem; }\n    h1 { color: #6366f1; }\n  </style>\n</head>\n<body>\n  <h1>Hello, EduNet!</h1>\n  <p>Edit this HTML and click Run to see the preview.</p>\n</body>\n</html>`,
  sql: `-- Welcome to EduNet Coding Lab!\n-- Language: SQL (simulated)\n\n-- Example: Select all users\nSELECT id, username, email, branch, role\nFROM users\nWHERE status = 'approved'\nORDER BY created_at DESC\nLIMIT 10;\n\n-- Try writing your own query:\n`,
};

const LANG_NAMES = { javascript:'JavaScript', python:'Python', java:'Java', cpp:'C++', html:'HTML', sql:'SQL' };
const LANG_EXT = { javascript:'js', python:'py', java:'java', cpp:'cpp', html:'html', sql:'sql' };

const editor = document.getElementById('codeEditor');
const consoleOut = document.getElementById('consoleOutput');
const langSelect = document.getElementById('langSelect');
const runBtn = document.getElementById('runBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const windowTitle = document.getElementById('windowTitle');
const windowLang = document.getElementById('windowLang');
const editorInfo = document.getElementById('editorInfo');
const charCount = document.getElementById('charCount');
const execTime = document.getElementById('execTime');
const execStatus = document.getElementById('execStatus');

let currentLang = 'javascript';

function loadLang(lang) {
  currentLang = lang;
  const saved = localStorage.getItem('edunet_code_' + lang + '_' + session?.username);
  editor.value = saved || LANG_STARTERS[lang] || '';
  windowTitle.textContent = 'script.' + LANG_EXT[lang];
  windowLang.textContent = LANG_NAMES[lang];
  updateEditorInfo();
}

langSelect?.addEventListener('change', function () { loadLang(this.value); });

function updateEditorInfo() {
  const lines = editor.value.split('\n').length;
  const pos = editor.selectionStart;
  const lineNum = editor.value.substring(0, pos).split('\n').length;
  if (editorInfo) editorInfo.textContent = `Ln ${lineNum}, Col ${pos}`;
  if (charCount) charCount.textContent = editor.value.length + ' chars';
}

editor?.addEventListener('input', updateEditorInfo);
editor?.addEventListener('click', updateEditorInfo);
editor?.addEventListener('keydown', function (e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = this.selectionStart; const end = this.selectionEnd;
    this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
    this.selectionStart = this.selectionEnd = start + 2;
  }
});

function log(msg, cls = '') {
  const line = document.createElement('div');
  line.className = 'console-line ' + cls;
  line.textContent = msg;
  consoleOut?.appendChild(line);
  consoleOut?.scrollTo(0, consoleOut.scrollHeight);
}
function clearConsole() { if (consoleOut) consoleOut.innerHTML = ''; }

function runJS(code) {
  clearConsole();
  log('> Running JavaScript...', 'run');
  const start = performance.now();
  try {
    const origLog = console.log;
    const origErr = console.error;
    const origWarn = console.warn;
    console.log = (...args) => { log(args.join(' ')); origLog(...args); };
    console.error = (...args) => { log('[error] ' + args.join(' '), 'error'); origErr(...args); };
    console.warn = (...args) => { log('[warn] ' + args.join(' '), 'info'); origWarn(...args); };
    const fn = new Function(code);
    fn();
    console.log = origLog; console.error = origErr; console.warn = origWarn;
    const ms = (performance.now() - start).toFixed(2);
    log('✓ Execution complete in ' + ms + 'ms', 'ok');
    if (execTime) execTime.textContent = ms + 'ms';
    if (execStatus) { execStatus.textContent = '●'; execStatus.style.color = 'var(--emerald)'; }
    addXP(10);
  } catch (err) {
    console.log = console.log;
    log('✕ ' + err.message, 'error');
    if (execStatus) { execStatus.textContent = '●'; execStatus.style.color = 'var(--rose)'; }
  }
}

function runHTML(code) {
  clearConsole();
  log('> Rendering HTML Preview...', 'run');
  const preview = window.open('', '_blank', 'width=800,height=600');
  if (preview) { preview.document.open(); preview.document.write(code); preview.document.close(); }
  log('✓ Preview opened in new tab.', 'ok');
}

function runSimulated(lang, code) {
  clearConsole();
  log(`> Running ${LANG_NAMES[lang]} (simulated)...`, 'run');
  setTimeout(() => {
    log('Note: ' + LANG_NAMES[lang] + ' requires a server-side runtime. Simulating output...', 'info');
    const lines = code.split('\n').filter(l => l.includes('print(') || l.includes('cout') || l.includes('System.out') || l.includes('printf'));
    if (lines.length) {
      lines.forEach(l => {
        const m = l.match(/["']([^"']+)["']/);
        if (m) log(m[1]);
      });
    } else {
      log('[Simulated] Code received. Output depends on runtime.');
    }
    log('✓ Simulation complete.', 'ok');
    addXP(5);
  }, 400);
}

function runSQL(code) {
  clearConsole();
  log('> Running SQL (simulated)...', 'run');
  setTimeout(() => {
    log('| id | username   | email              | branch | role  |', 'info');
    log('|----|------------|--------------------|--------|-------|', 'cli');
    log('| 1  | admin      | admin@edunet.com   | Admin  | admin |');
    log('| 2  | john_doe   | john@example.com   | SDE    | user  |');
    log('✓ 2 rows returned (simulated)', 'ok');
    addXP(5);
  }, 300);
}

runBtn?.addEventListener('click', () => {
  const code = editor.value.trim();
  if (!code) { showToast('Write some code first!', 'warning'); return; }
  const t = Date.now();
  if (currentLang === 'javascript') { runJS(code); }
  else if (currentLang === 'html') { runHTML(code); }
  else if (currentLang === 'sql') { runSQL(code); }
  else { runSimulated(currentLang, code); }
});
clearBtn?.addEventListener('click', () => {
  editor.value = LANG_STARTERS[currentLang] || '';
  clearConsole();
  log('// Editor cleared', 'cli');
});
saveBtn?.addEventListener('click', () => {
  localStorage.setItem('edunet_code_' + currentLang + '_' + session?.username, editor.value);
  showToast('Code saved!', 'success');
  addXP(5);
  renderSavedFiles();
});
document.getElementById('clearConsoleBtn')?.addEventListener('click', clearConsole);
document.getElementById('clearFilesBtn')?.addEventListener('click', () => {
  Object.keys(LANG_EXT).forEach(l => localStorage.removeItem('edunet_code_' + l + '_' + session?.username));
  showToast('All saved files cleared.', 'info');
  renderSavedFiles();
});

function renderSavedFiles() {
  const list = document.getElementById('savedFilesList');
  if (!list) return;
  list.innerHTML = '';
  Object.keys(LANG_EXT).forEach(l => {
    const saved = localStorage.getItem('edunet_code_' + l + '_' + session?.username);
    if (!saved) return;
    const btn = document.createElement('button');
    btn.className = 'btn btn-secondary btn-sm';
    btn.textContent = 'script.' + LANG_EXT[l];
    btn.addEventListener('click', () => {
      langSelect.value = l;
      loadLang(l);
      showToast('Loaded ' + LANG_NAMES[l] + ' file.', 'info');
    });
    list.appendChild(btn);
  });
  if (!list.children.length) {
    list.innerHTML = '<span style="font-size:12.5px;color:var(--mist-dim);">No saved files yet.</span>';
  }
}

loadLang('javascript');
renderSavedFiles();
