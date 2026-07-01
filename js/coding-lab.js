// ============================================================
// js/coding-lab.js — Enriched EduNet Coding Lab IDE Controller
// ============================================================
'use strict';

const session = window.initPageShell('coding-lab.html');
const { showToast, apiFetch } = window.EduNetAPI;

const LANG_STARTERS = {
  javascript: `// Language: JavaScript\n\nfunction greet(name) {\n  return \`Hello, \${name}! Welcome to EduNet.\`;\n}\n\nconsole.log(greet('Student'));\n`,
  python: `# Language: Python\n\ndef greet(name):\n    return f"Hello, {name}! Welcome to EduNet."\n\nprint(greet("Student"))\n`,
  java: `// Language: Java\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Student! Welcome to EduNet.");\n    }\n}\n`,
  cpp: `// Language: C++\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, Student! Welcome to EduNet." << endl;\n    return 0;\n}\n`,
  html: `<!DOCTYPE html>\n<html>\n<body>\n  <h1>Hello, EduNet!</h1>\n</body>\n</html>`,
  sql: `-- Language: SQL\nSELECT name FROM employees WHERE salary > 100000;\n`,
};

const LANG_NAMES = { javascript:'JavaScript', python:'Python', java:'Java', cpp:'C++', html:'HTML', sql:'SQL' };
const LANG_EXT = { javascript:'js', python:'py', java:'java', cpp:'cpp', html:'html', sql:'sql' };

const editor = document.getElementById('codeEditor');
const consoleOut = document.getElementById('consoleOutput');
const langSelect = document.getElementById('langSelect');
const runBtn = document.getElementById('runBtn');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const tabFileName = document.getElementById('tabFileName');
const editorInfo = document.getElementById('editorInfo');
const charCount = document.getElementById('charCount');
const execTime = document.getElementById('execTime');
const execStatus = document.getElementById('execStatus');

let currentLang = 'javascript';
let activeChallengeId = null;
let saveDebounceTimer = null;

// Tab visibility triggers
const btnTabExplorer = document.getElementById('btnTabExplorer');
const btnTabChallenges = document.getElementById('btnTabChallenges');
const explorerFilesView = document.getElementById('explorerFilesView');
const explorerChallengesView = document.getElementById('explorerChallengesView');

btnTabExplorer?.addEventListener('click', () => {
  btnTabExplorer.classList.add('active');
  btnTabExplorer.style.background = 'rgba(255,255,255,0.02)';
  btnTabExplorer.style.color = 'var(--frost)';
  btnTabChallenges.classList.remove('active');
  btnTabChallenges.style.background = 'transparent';
  btnTabChallenges.style.color = 'var(--mist-dim)';
  explorerFilesView.style.display = 'flex';
  explorerChallengesView.style.display = 'none';
});

btnTabChallenges?.addEventListener('click', () => {
  btnTabChallenges.classList.add('active');
  btnTabChallenges.style.background = 'rgba(255,255,255,0.02)';
  btnTabChallenges.style.color = 'var(--frost)';
  btnTabExplorer.classList.remove('active');
  btnTabExplorer.style.background = 'transparent';
  btnTabExplorer.style.color = 'var(--mist-dim)';
  explorerChallengesView.style.display = 'flex';
  explorerFilesView.style.display = 'none';
  loadChallengesList();
});

// Console window tabs toggle
const btnTabTerminal = document.getElementById('btnTabTerminal');
const btnTabAIReview = document.getElementById('btnTabAIReview');
const consoleOutput = document.getElementById('consoleOutput');
const aiReviewPanel = document.getElementById('aiReviewPanel');

btnTabTerminal?.addEventListener('click', () => {
  btnTabTerminal.classList.add('active');
  btnTabTerminal.style.background = 'rgba(255,255,255,0.02)';
  btnTabTerminal.style.color = 'var(--frost)';
  btnTabAIReview.classList.remove('active');
  btnTabAIReview.style.background = 'transparent';
  btnTabAIReview.style.color = 'var(--mist-dim)';
  consoleOutput.style.display = 'block';
  aiReviewPanel.style.display = 'none';
});

btnTabAIReview?.addEventListener('click', () => {
  btnTabAIReview.classList.add('active');
  btnTabAIReview.style.background = 'rgba(255,255,255,0.02)';
  btnTabAIReview.style.color = 'var(--frost)';
  btnTabTerminal.classList.remove('active');
  btnTabTerminal.style.background = 'transparent';
  btnTabTerminal.style.color = 'var(--mist-dim)';
  aiReviewPanel.style.display = 'block';
  consoleOutput.style.display = 'none';
});

// Load standard language template
function loadLang(lang) {
  currentLang = lang;
  if (langSelect) langSelect.value = lang;
  const saved = localStorage.getItem('edunet_code_' + lang + '_' + session?.username);
  editor.value = saved || LANG_STARTERS[lang] || '';
  if (tabFileName) tabFileName.textContent = 'script.' + LANG_EXT[lang];
  updateEditorInfo();
}

langSelect?.addEventListener('change', function () { loadLang(this.value); });

function updateEditorInfo() {
  const lines = editor.value.split('\n').length;
  const pos = editor.selectionStart;
  const lineNum = editor.value.substring(0, pos).split('\n').length;
  if (editorInfo) editorInfo.textContent = `Ln ${lineNum}, Col ${pos}`;
  if (charCount) charCount.textContent = editor.value.length + ' chars';
  updateLineNumbers();
}

// Render IDE line numbers dynamically
function updateLineNumbers() {
  const lineNumbersContainer = document.getElementById('lineNumbers');
  if (!lineNumbersContainer) return;
  const lines = editor.value.split('\n').length;
  let numsHtml = '';
  for (let i = 1; i <= lines; i++) {
    numsHtml += `<div>${i}</div>`;
  }
  lineNumbersContainer.innerHTML = numsHtml;
}

editor?.addEventListener('input', () => {
  updateEditorInfo();
  debouncedSaveDraft();
});
editor?.addEventListener('click', updateEditorInfo);
editor?.addEventListener('scroll', () => {
  const lineNumbersContainer = document.getElementById('lineNumbers');
  if (lineNumbersContainer) {
    lineNumbersContainer.scrollTop = editor.scrollTop;
  }
});
editor?.addEventListener('keydown', function (e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = this.selectionStart; const end = this.selectionEnd;
    this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
    this.selectionStart = this.selectionEnd = start + 2;
    updateEditorInfo();
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

// Run playground sandbox code execution
runBtn?.addEventListener('click', async () => {
  const code = editor.value.trim();
  if (!code) { showToast('Write some code first!', 'warning'); return; }

  clearConsole();
  log(`> Compiling playground script (${LANG_NAMES[currentLang]})...`, 'run');

  try {
    const res = await apiFetch('/api/challenges/run', {
      method: 'POST',
      body: JSON.stringify({
        language: currentLang,
        source_code: code,
        input: ''
      })
    });

    if (res.success) {
      log(res.output);
      log(`✓ Sandbox status: ${res.status}`, res.status === 'Accepted' ? 'ok' : 'error');
      if (execTime) execTime.textContent = res.execution_time_ms + 'ms';
      if (execStatus) {
        execStatus.textContent = '●';
        execStatus.style.color = res.status === 'Accepted' ? 'var(--emerald)' : 'var(--rose)';
      }
    } else {
      log(`✕ Runtime compilation failed: ${res.message}`, 'error');
    }
  } catch (err) {
    log('✕ Server connection failed.', 'error');
  }
});

// Submit solutions action
submitBtn?.addEventListener('click', async () => {
  if (!activeChallengeId) {
    showToast('Select a challenge to submit first!', 'warning');
    return;
  }

  const code = editor.value.trim();
  if (!code) { showToast('Write code before submitting.', 'warning'); return; }

  clearConsole();
  log('> Running test cases evaluation...', 'run');
  submitBtn.disabled = true;

  try {
    const res = await apiFetch('/api/challenges/submit', {
      method: 'POST',
      body: JSON.stringify({
        id: activeChallengeId,
        language: currentLang,
        source_code: code
      })
    });

    submitBtn.disabled = false;

    if (res.success) {
      log(res.output);
      log(`Submission Output Status: ${res.status}`, res.status === 'Accepted' ? 'ok' : 'error');
      
      if (res.status === 'Accepted') {
        showToast('Accepted! Problem completed.', 'success');
        if (res.xp_awarded > 0) {
          showToast(`🏆 Solution solved! +${res.xp_awarded} XP.`, 'success', 5000);
          
          // Silent achievements triggers checks
          apiFetch('/api/achievements/check', { method: 'POST' })
            .then(achRes => {
              if (achRes.newly_earned && achRes.newly_earned.length > 0) {
                achRes.newly_earned.forEach(a => {
                  showToast(`🏆 Achievement unlocked: ${a.title}! ${a.xp_reward ? '+' + a.xp_reward + ' XP' : ''}`, 'success', 5000);
                });
              }
            }).catch(() => {});
        }
      } else {
        showToast(`Rejected: ${res.status}`, 'warning');
      }

      // Populate AI Review panel
      if (res.ai_review) {
        document.getElementById('aiScoreVal').textContent = res.ai_review.score;
        document.getElementById('aiComplexityVal').textContent = res.ai_review.complexity;
        
        const list = document.getElementById('aiSuggestionsList');
        if (list) {
          list.innerHTML = `
            <div style="font-weight:700; color:var(--frost); margin-bottom:0.35rem;">Telemetry Metrics:</div>
            <div>⏱️ Runtime Complexity: ${res.ai_review.complexity}</div>
            <div>📦 Space auxiliary usage: ${res.ai_review.space_complexity}</div>
            <div>👤 Code readability: ${res.ai_review.naming_rating}</div>
            <div style="margin-top:0.75rem; font-weight:700; color:var(--frost);">Suggestions:</div>
            <ul style="padding-left:1.2rem; margin-top:0.25rem; display:flex; flex-direction:column; gap:4px;">
              ${res.ai_review.suggestions.map(s => `<li>${s}</li>`).join('')}
            </ul>
          `;
        }

        // Auto transition to AI Review tab to highlight mentor feedback
        btnTabAIReview.click();
      }

    } else {
      log(`✕ Submission error: ${res.message}`, 'error');
    }
  } catch (err) {
    submitBtn.disabled = false;
    log('✕ Connection failed.', 'error');
  }
});

// Debounced save drafts
function debouncedSaveDraft() {
  if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
  saveDebounceTimer = setTimeout(async () => {
    localStorage.setItem('edunet_code_' + currentLang + '_' + session?.username, editor.value);
    
    // Sync draft with backend if active challenge is open
    if (activeChallengeId) {
      await apiFetch('/api/challenges/save', {
        method: 'POST',
        body: JSON.stringify({
          id: activeChallengeId,
          filename: 'solution',
          content: editor.value,
          language: currentLang
        })
      });
    }
  }, 1500);
}

// Load coding challenges selection list
async function loadChallengesList() {
  const dailyBox = document.getElementById('dailyChallengeItem');
  const recBox = document.getElementById('recommendedChallengesList');

  if (dailyBox) dailyBox.innerHTML = '<div class="skeleton" style="height:50px;"></div>';
  if (recBox) recBox.innerHTML = '<div class="skeleton" style="height:100px;"></div>';

  try {
    const dailyData = await apiFetch('/api/challenges/daily');
    const recData = await apiFetch('/api/challenges/recommended');

    if (dailyData.success && dailyData.challenge) {
      const c = dailyData.challenge;
      dailyBox.innerHTML = `
        <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:6px; padding:0.85rem; cursor:pointer;" onclick="selectChallenge(${c.id})">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem; font-size:11px;">
            <span style="font-weight:700; color:var(--accent);">${c.difficulty}</span>
            <span style="color:var(--mist-dim);">${c.category}</span>
          </div>
          <div style="font-weight:600; font-size:13px; color:var(--frost);">${c.title}</div>
          <div style="font-size:11px; color:var(--mist); margin-top:2px;">✨ +${c.xp_reward} XP</div>
        </div>
      `;
    } else {
      dailyBox.innerHTML = '<div style="font-size:12px; color:var(--mist-dim);">No challenges today.</div>';
    }

    if (recData.success && recData.challenges.length > 0) {
      recBox.innerHTML = recData.challenges.map(c => `
        <div style="background:rgba(255,255,255,0.01); border:1px solid var(--border); border-radius:6px; padding:0.75rem; margin-bottom:0.5rem; cursor:pointer;" onclick="selectChallenge(${c.id})">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem; font-size:10px;">
            <span style="color:var(--accent); font-weight:700;">${c.difficulty}</span>
            <span style="color:var(--mist-dim);">${c.category}</span>
          </div>
          <div style="font-weight:600; font-size:12px; color:var(--frost);">${c.title}</div>
        </div>
      `).join('');
    } else {
      recBox.innerHTML = '<div style="font-size:12px; color:var(--mist-dim);">No recommended list.</div>';
    }

  } catch (e) {
    if (dailyBox) dailyBox.innerHTML = '<div style="font-size:12px; color:var(--mist-dim);">Error loading.</div>';
  }
}

// Select active challenge details
window.selectChallenge = async function (challengeId) {
  try {
    const data = await apiFetch(`/api/challenges/${challengeId}`);
    if (!data.success) return;

    const c = data.challenge;
    activeChallengeId = c.id;

    // Toggle View pane
    document.getElementById('challengesSelectionList').style.display = 'none';
    document.getElementById('activeChallengeDetails').style.display = 'flex';

    // Populate active instructions
    document.getElementById('activeChallengeTitle').textContent = c.title;
    document.getElementById('activeChallengeDesc').textContent = c.description;
    
    const diffBadge = document.getElementById('activeChallengeDiff');
    if (diffBadge) {
      diffBadge.textContent = c.difficulty;
      diffBadge.className = `badge badge-${c.difficulty.toLowerCase() === 'easy' ? 'accent' : 'warning'}`;
    }
    document.getElementById('activeChallengeCat').textContent = c.category;

    // Spits hints accordion
    const hintsBox = document.getElementById('challengeHintsBox');
    if (hintsBox) {
      hintsBox.innerHTML = c.hints.map((h, i) => `
        <div style="margin-bottom:0.4rem; padding:0.35rem 0.5rem; border:1px solid var(--border); border-radius:4px; background:rgba(255,255,255,0.01);">
          <div style="font-weight:700; color:var(--frost); cursor:pointer;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">Hint ${i+1} 🔍</div>
          <div style="display:none; margin-top:0.25rem; color:var(--mist);">${h}</div>
        </div>
      `).join('');
    }

    // Set code templates boilerplate
    let boilerLang = 'javascript';
    if (c.title.toLowerCase().includes('python')) boilerLang = 'python';
    else if (c.title.toLowerCase().includes('query') || c.title.toLowerCase().includes('sql')) boilerLang = 'sql';
    
    currentLang = boilerLang;
    if (langSelect) langSelect.value = boilerLang;

    // Load active draft if exists or optimal boilerplate fallback
    editor.value = c.draft || LANG_STARTERS[boilerLang];
    if (tabFileName) tabFileName.textContent = 'script.' + LANG_EXT[boilerLang];
    updateEditorInfo();

    showToast(`Loaded coding challenge: ${c.title}`, 'info');

  } catch (err) {
    showToast('Failed to load challenge details.', 'error');
  }
};

// Back button trigger
document.getElementById('btnBackToChallenges')?.addEventListener('click', () => {
  activeChallengeId = null;
  document.getElementById('challengesSelectionList').style.display = 'block';
  document.getElementById('activeChallengeDetails').style.display = 'none';
  loadChallengesList();
});

// General Save click
saveBtn?.addEventListener('click', () => {
  localStorage.setItem('edunet_code_' + currentLang + '_' + session?.username, editor.value);
  showToast('Code saved successfully.', 'success');
  renderSavedFiles();
});

// Clear Editor click
clearBtn?.addEventListener('click', () => {
  editor.value = LANG_STARTERS[currentLang] || '';
  clearConsole();
  log('// Workspace editor reset.', 'cli');
  updateEditorInfo();
});

document.getElementById('createNewFileBtn')?.addEventListener('click', () => {
  const name = prompt('Enter filename (e.g. script.js):');
  if (name) {
    const ext = name.split('.').pop();
    let matchedLang = 'javascript';
    Object.keys(LANG_EXT).forEach(l => {
      if (LANG_EXT[l] === ext) matchedLang = l;
    });
    loadLang(matchedLang);
    if (tabFileName) tabFileName.textContent = name;
    showToast(`Created new file ${name}`, 'success');
  }
});

// Initial boot
loadLang('javascript');
renderSavedFiles();

function renderSavedFiles() {
  const list = document.getElementById('explorerFilesList');
  if (!list) return;
  list.innerHTML = '';
  Object.keys(LANG_EXT).forEach(l => {
    const saved = localStorage.getItem('edunet_code_' + l + '_' + session?.username);
    if (!saved) return;
    const btn = document.createElement('div');
    btn.style.cssText = 'padding:0.4rem 0.65rem; border-radius:4px; font-size:12.5px; font-family:var(--font-mono); color:var(--mist); cursor:pointer; margin-bottom:0.2rem;';
    btn.textContent = '📄 script.' + LANG_EXT[l];
    btn.addEventListener('click', () => {
      loadLang(l);
      showToast(`Switched to script.${LANG_EXT[l]}`, 'info');
    });
    list.appendChild(btn);
  });
  if (!list.children.length) {
    list.innerHTML = '<span style="font-size:11px;color:var(--mist-dim);">No saved files in workspace.</span>';
  }
}
