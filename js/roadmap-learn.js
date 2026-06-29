// ============================================================
// js/roadmap-learn.js — EduNet Roadmap Learning Page Logic
// ============================================================
'use strict';

const session = window.initPageShell('roadmap-learn.html');
const { apiFetch, showToast, addXP } = window.EduNetAPI;

// Parse URL params
const params = new URLSearchParams(window.location.search);
const ROADMAP_ID  = params.get('rm') || 'webdev';
const INIT_LESSON = params.get('l') ? parseInt(params.get('l')) : null;

let currentRoadmap     = null;
let currentLessonId    = null;
let currentLessonData  = null;
let lessonProgressMap  = {}; // lessonId -> completed (boolean)
let quizAnswers        = {}; // quizId -> option
let quizSubmitted      = false;

let examQuestions      = [];
let examAnswers        = {};
let examSubmitted      = false;

let explanationMode    = 'detailed'; // detailed, beginner, advanced

// ── Init ───────────────────────────────────────────────────────
async function init() {
  try {
    await loadRoadmap();
    renderSidebar();
    updateProgressUI();

    // Auto-open requested or first incomplete lesson
    const lessonsList = getAllLessons();
    if (INIT_LESSON) {
      openLesson(INIT_LESSON);
    } else {
      const firstIncomplete = lessonsList.find(l => !l.completed);
      const first = firstIncomplete || lessonsList[0];
      if (first) openLesson(first.id);
    }

    setupAISystem();
    setupExamSystem();
  } catch (err) {
    console.error('Init error:', err);
    showToast('Failed to load roadmap: ' + err.message, 'error');
  }
}

// ── Load Roadmap ───────────────────────────────────────────────
async function loadRoadmap() {
  const data = await apiFetch('/api/roadmaps/' + ROADMAP_ID);
  if (!data.success) throw new Error(data.message || 'Failed to load roadmap');
  currentRoadmap = data.roadmap;

  // Cache lesson completion statuses
  currentRoadmap.modules.forEach(m => {
    m.lessons.forEach(l => {
      lessonProgressMap[l.id] = !!l.completed;
    });
  });

  document.getElementById('tbRoadmapName').textContent = currentRoadmap.title;
  document.getElementById('sbRoadmapTitle').textContent = currentRoadmap.title;
  document.title = `EduNet — Learn ${currentRoadmap.title}`;
}

// ── Helper: Get flat list of all lessons ──────────────────────
function getAllLessons() {
  const lessons = [];
  currentRoadmap.modules.forEach(m => {
    if (m.lessons) lessons.push(...m.lessons);
  });
  return lessons;
}

// ── Render Sidebar Modules Accordion ───────────────────────────
function renderSidebar() {
  const list = document.getElementById('moduleList');
  list.innerHTML = '';

  currentRoadmap.modules.forEach((mod, idx) => {
    const item = document.createElement('div');
    item.className = `accordion-item`;
    item.id = `mod-accordion-${mod.id}`;

    const doneCount = mod.lessons.filter(l => lessonProgressMap[l.id]).length;
    const totalCount = mod.lessons.length;
    const allDone = doneCount === totalCount && totalCount > 0;

    item.innerHTML = `
      <div class="accordion-header">
        <span class="accordion-header-title">
          ${allDone ? '<span style="color:var(--emerald);margin-right:4px;">✓</span>' : ''}
          ${mod.order_index}. ${mod.title}
        </span>
        <span class="accordion-header-icon">▼</span>
      </div>
      <div class="accordion-body">
        <div style="padding:0.25rem 0 0.5rem 1rem; font-size:11px; color:var(--mist-dim);">
          ${doneCount} / ${totalCount} lessons complete
        </div>
        <div class="lesson-list">
          ${mod.lessons.map(les => `
            <div class="lesson-list-item ${les.id === currentLessonId ? 'active' : ''} ${lessonProgressMap[les.id] ? 'completed' : ''}" data-lid="${les.id}">
              <span class="lesson-list-item-icon">${lessonProgressMap[les.id] ? '✓' : '📄'}</span>
              <span style="flex:1;">${les.title.split('— Lesson')[1]?.replace(/^\s*\d+:\s*/, '') || les.title}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Click handler for toggle header
    item.querySelector('.accordion-header').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });

    // Lesson click handlers
    item.querySelectorAll('.lesson-list-item').forEach(liEl => {
      liEl.addEventListener('click', (e) => {
        e.stopPropagation();
        openLesson(parseInt(liEl.dataset.lid));
      });
    });

    list.appendChild(item);
  });
}

// ── Open Lesson ────────────────────────────────────────────────
async function openLesson(lessonId) {
  if (currentLessonId === lessonId && currentLessonData) return;
  currentLessonId = lessonId;
  quizAnswers = {};
  quizSubmitted = false;

  history.replaceState(null, '', `?rm=${ROADMAP_ID}&l=${lessonId}`);

  document.getElementById('contentLoading').style.display = 'block';
  document.getElementById('moduleContent').style.display = 'none';

  // Highlight active in sidebar
  document.querySelectorAll('.lesson-list-item').forEach(el => {
    const active = parseInt(el.dataset.lid) === lessonId;
    el.classList.toggle('active', active);
    // Auto-open parent accordion
    if (active) {
      const parentAcc = el.closest('.accordion-item');
      if (parentAcc) parentAcc.classList.add('open');
    }
  });

  try {
    const data = await apiFetch('/api/lessons/' + lessonId);
    if (!data.success) throw new Error(data.message);
    currentLessonData = data;
    renderLessonContent(data);
  } catch (err) {
    showToast('Error loading lesson: ' + err.message, 'error');
    document.getElementById('contentLoading').innerHTML = `<div style="color:#ef4444;padding:2rem;text-align:center;">Failed to load lesson.<br><small>${err.message}</small></div>`;
  }
}

// ── Render Lesson Content ──────────────────────────────────────
function renderLessonContent(data) {
  const { lesson, videos, resources, exercises, quizzes, projects, prev_lesson, next_lesson, completed } = data;
  
  document.getElementById('contentLoading').style.display = 'none';
  document.getElementById('moduleContent').style.display = 'block';

  // Breadcrumb
  document.getElementById('tbModuleName').textContent = lesson.title;
  document.getElementById('moduleRoadmapLabel').textContent = lesson.module_title + ' › Lesson ' + lesson.order_index;
  document.getElementById('moduleTitle').textContent = lesson.title;
  document.getElementById('moduleDesc').textContent = lesson.short_desc;
  document.getElementById('moduleXP').textContent = lesson.xp_reward;
  document.getElementById('moduleLanguageBadge').textContent = lesson.language || 'general';

  // Status Badge
  const statusBadge = document.getElementById('moduleStatusBadge');
  if (completed) {
    statusBadge.textContent = '✓ Completed';
    statusBadge.className = 'badge badge-green';
  } else {
    statusBadge.textContent = 'In Progress';
    statusBadge.className = 'badge badge-blue';
  }

  // Completion banner
  document.getElementById('completionBanner').classList.toggle('show', !!completed);

  // Render notes with Level switcher capability
  renderTheoryWithLevels(lesson.learning_notes);

  // Render exercises
  renderExercises(exercises || [], lesson.language, lesson.starter_code);

  // Render module project
  renderProjects(projects || []);

  // Render quiz
  renderQuiz(quizzes || []);

  // Render right panel videos
  renderRightVideos(videos || []);

  // Render right panel resources
  renderRightResources(resources || []);

  // Lesson Nav
  const prevBtn = document.getElementById('prevModBtn');
  const nextBtn = document.getElementById('nextModBtn');
  if (prev_lesson) {
    prevBtn.style.display = 'block';
    prevBtn.textContent = '← ' + (prev_lesson.title.split('— Lesson')[1] || prev_lesson.title);
    prevBtn.onclick = () => openLesson(prev_lesson.id);
  } else {
    prevBtn.style.display = 'none';
  }
  if (next_lesson) {
    nextBtn.style.display = 'block';
    nextBtn.textContent = (next_lesson.title.split('— Lesson')[1] || next_lesson.title) + ' →';
    nextBtn.onclick = () => openLesson(next_lesson.id);
  } else {
    nextBtn.style.display = 'none';
  }

  // Load student note for this lesson
  loadStudentNote(lesson.id);

  // Reset tab to Learn
  switchTab('learn');

  // Scroll content to top
  document.getElementById('learnContent').scrollTop = 0;
  updateProgressUI();
}

// ── Level Switcher & Note Rendering ─────────────────────────────
function renderTheoryWithLevels(notesMarkdown) {
  if (!notesMarkdown) {
    document.getElementById('notesBody').innerHTML = `<p style="color:var(--mist);">Notes coming soon.</p>`;
    return;
  }

  // Split markdown by level sections
  const parts = notesMarkdown.split('## Beginner Friendly Explanation');
  let detailed = parts[0];
  let beginner = '';
  let advanced = '';

  if (parts[1]) {
    const subParts = parts[1].split('## Advanced Deep-Dive');
    beginner = '## Beginner Friendly Explanation' + subParts[0];
    advanced = subParts[1] ? '## Advanced Deep-Dive' + subParts[1] : '';
  }

  const container = document.getElementById('notesBody');
  container.innerHTML = `
    <div class="notes-level-section" id="notes-sec-detailed">${markdownToHtml(detailed)}</div>
    <div class="notes-level-section" id="notes-sec-beginner">${markdownToHtml(beginner || '### Beginner explanation is coming soon!')}</div>
    <div class="notes-level-section" id="notes-sec-advanced">${markdownToHtml(advanced || '### Advanced explanation is coming soon!')}</div>
  `;

  applyExplanationMode();
}

function applyExplanationMode() {
  document.querySelectorAll('.level-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.level === explanationMode);
  });
  document.querySelectorAll('.notes-level-section').forEach(sec => {
    sec.classList.toggle('active', sec.id === `notes-sec-${explanationMode}`);
  });
}

document.querySelectorAll('.level-toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    explanationMode = btn.dataset.level;
    applyExplanationMode();
  });
});

// ── Render Exercises ───────────────────────────────────────────
function renderExercises(exercises, lang, starterCode) {
  const container = document.getElementById('exercisesContainer');
  if (!exercises || !exercises.length) {
    container.innerHTML = '<p style="color:var(--mist);">No exercises yet for this lesson.</p>';
    return;
  }
  container.innerHTML = '';
  exercises.forEach((ex, i) => {
    const card = document.createElement('div');
    card.className = 'exercise-card';
    const diffColor = ex.difficulty === 'Easy' ? 'badge-green' : ex.difficulty === 'Medium' ? 'badge-blue' : 'badge-accent';
    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;">
        <span style="font-weight:700;color:var(--mist-dim);font-size:12px;font-family:var(--font-mono);">#${i + 1}</span>
        <div class="exercise-title">${ex.title}</div>
        <span class="badge ${diffColor}" style="margin-left:auto;">${ex.difficulty}</span>
      </div>
      <div class="exercise-desc">${ex.description}</div>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.75rem;">
        <button class="btn btn-secondary btn-sm open-ex-hint">💡 View Hint</button>
        <button class="btn btn-secondary btn-sm open-ex-sol">📖 View Solution</button>
        <button class="btn btn-primary btn-sm open-lab-ex" data-code="${encodeURIComponent(ex.starter_code || starterCode || '')}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6L2 12l6 6"/></svg>
          Practice in Coding Lab
        </button>
      </div>
      <div class="ex-hint-box" style="display:none;font-size:12px;color:#fbbf24;background:rgba(251,191,36,0.06);padding:0.6rem;border-radius:6px;margin-top:0.5rem;">
        <strong>Hint:</strong> ${ex.hint || 'Think about core logic scope.'}
      </div>
      <div class="ex-sol-box" style="display:none;font-family:var(--font-mono);font-size:12px;color:var(--emerald);background:rgba(52,211,153,0.06);padding:0.6rem;border-radius:6px;margin-top:0.5rem;">
        <strong>Solution:</strong><br>${escapeHtml(ex.starter_code || 'Solution logic is being generated...')}
      </div>
    `;

    card.querySelector('.open-ex-hint').addEventListener('click', () => {
      const hint = card.querySelector('.ex-hint-box');
      hint.style.display = hint.style.display === 'none' ? 'block' : 'none';
    });
    card.querySelector('.open-ex-sol').addEventListener('click', () => {
      const sol = card.querySelector('.ex-sol-box');
      sol.style.display = sol.style.display === 'none' ? 'block' : 'none';
    });
    card.querySelector('.open-lab-ex').addEventListener('click', () => {
      openCodingLab(lang, ex.starter_code || starterCode);
    });

    container.appendChild(card);
  });
}

// ── Render Projects ─────────────────────────────────────────────
function renderProjects(projects) {
  const container = document.getElementById('projectsContainer');
  if (!projects || !projects.length) {
    container.innerHTML = '<p style="color:var(--mist);">Projects coming soon.</p>';
    return;
  }
  container.innerHTML = '';
  projects.forEach((proj, i) => {
    const card = document.createElement('div');
    card.className = 'exercise-card';
    card.style.borderLeft = '3px solid var(--purple)';
    const diffColor = proj.difficulty === 'Beginner' ? 'badge-green' : proj.difficulty === 'Intermediate' ? 'badge-blue' : 'badge-accent';
    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;">
        <span style="font-weight:700;color:var(--mist-dim);font-size:12px;font-family:var(--font-mono);">#${i + 1}</span>
        <div class="exercise-title" style="font-size:15px;color:var(--text);">${proj.title}</div>
        <span class="badge ${diffColor}" style="margin-left:auto;">${proj.difficulty}</span>
      </div>
      <div class="exercise-desc" style="font-size:13.5px;color:var(--mist);margin-bottom:0.75rem;">${proj.description}</div>
      <div style="font-size:12px;color:var(--mist-dim);background:var(--abyss);padding:0.75rem;border-radius:6px;margin-bottom:0.75rem;">
        <strong>Technologies:</strong> ${proj.technologies} &middot; <strong>Time Estimate:</strong> ${proj.time_estimate}
      </div>
      <div style="font-size:13px;color:var(--mist);line-height:1.6;margin-bottom:0.75rem;">
        <strong>Requirements:</strong>
        <pre style="background:none;border:none;padding:0;margin:0.25rem 0;color:var(--mist);font-family:inherit;white-space:pre-wrap;">${proj.requirements}</pre>
      </div>
      <div style="font-size:13px;color:var(--mist);line-height:1.6;margin-bottom:0.75rem;">
        <strong>Completion Criteria:</strong>
        <pre style="background:none;border:none;padding:0;margin:0.25rem 0;color:var(--mist);font-family:inherit;white-space:pre-wrap;">${proj.completion_criteria}</pre>
      </div>
      <div class="exercise-actions">
        <button class="btn btn-secondary btn-sm open-lab-proj" data-code="${encodeURIComponent(proj.starter_files || '')}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6L2 12l6 6"/></svg>
          Open Starter in Lab
        </button>
      </div>
    `;
    card.querySelector('.open-lab-proj').addEventListener('click', function () {
      const code = decodeURIComponent(this.dataset.code);
      const lang = currentLessonData?.lesson?.language || 'javascript';
      openCodingLab(lang, code);
    });
    container.appendChild(card);
  });
}

// ── Render Quiz ────────────────────────────────────────────────
function renderQuiz(quizzes) {
  const container = document.getElementById('quizContainer');
  const actions = document.getElementById('quizActions');
  quizAnswers = {};
  quizSubmitted = false;

  if (!quizzes || !quizzes.length) {
    container.innerHTML = '<p style="color:var(--mist);">Quiz coming soon.</p>';
    actions.style.display = 'none';
    return;
  }

  actions.style.display = 'block';
  document.getElementById('quizScore').style.display = 'none';
  document.getElementById('submitQuizBtn').style.display = 'inline-flex';
  container.innerHTML = '';

  quizzes.forEach((q, qi) => {
    const letters = ['A', 'B', 'C', 'D'];
    const options = [q.option_a, q.option_b, q.option_c, q.option_d];
    const card = document.createElement('div');
    card.className = 'quiz-question';
    card.innerHTML = `
      <div class="quiz-q-text"><span style="color:var(--accent);font-family:var(--font-mono);margin-right:.4rem;">Q${qi+1}.</span>${q.question}</div>
      <div class="quiz-options" id="quiz-opts-${q.id}">
        ${options.map((opt, i) => `
          <div class="quiz-option" data-qid="${q.id}" data-letter="${letters[i]}">
            <div class="quiz-letter">${letters[i]}</div>
            <div>${opt}</div>
          </div>
        `).join('')}
      </div>
      <div class="quiz-explanation" id="quiz-exp-${q.id}">${q.explanation || ''}</div>
    `;
    card.querySelectorAll('.quiz-option').forEach(opt => {
      opt.addEventListener('click', function () {
        if (quizSubmitted) return;
        const qid = this.dataset.qid;
        const letter = this.dataset.letter;
        quizAnswers[qid] = letter;
        card.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
      });
    });
    container.appendChild(card);
  });
}

// ── Submit Lesson Quiz ─────────────────────────────────────────
async function submitQuiz() {
  if (!currentLessonId || quizSubmitted) return;
  if (!Object.keys(quizAnswers).length) {
    showToast('Please answer at least one question!', 'warning');
    return;
  }

  quizSubmitted = true;
  const btn = document.getElementById('submitQuizBtn');
  btn.textContent = 'Submitting...';
  btn.disabled = true;

  try {
    const data = await apiFetch(`/api/roadmaps/modules/${currentLessonData.lesson.module_id}/quiz/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers: quizAnswers }),
    });

    if (!data.success) throw new Error(data.message);

    // Show correct/wrong
    data.results.forEach(r => {
      const opts = document.querySelectorAll(`[data-qid="${r.quiz_id}"]`);
      opts.forEach(opt => {
        const letter = opt.dataset.letter;
        if (letter === r.correct_option) opt.classList.add('correct');
        else if (letter === quizAnswers[r.quiz_id] && !r.correct) opt.classList.add('wrong');
      });
      const expEl = document.getElementById(`quiz-exp-${r.quiz_id}`);
      if (expEl) expEl.classList.add('show');
    });

    const scoreEl = document.getElementById('quizScore');
    const pct = data.score;
    const color = pct >= 80 ? 'var(--emerald)' : pct >= 60 ? '#fbbf24' : '#ef4444';
    scoreEl.style.display = 'block';
    scoreEl.innerHTML = `
      <div style="display:flex;align-items:center;gap:1rem;">
        <div style="font-size:2rem;font-weight:800;color:${color};">${pct}%</div>
        <div>
          <div style="font-weight:600;">${data.correct} / ${data.total} correct</div>
          <div style="font-size:12px;color:var(--mist);">${pct >= 80 ? '🎉 Excellent! +100 XP' : '👍 Good work! Keep practicing.'}</div>
        </div>
      </div>
    `;
    btn.style.display = 'none';
    if (pct >= 60) addXP(100);
  } catch (err) {
    showToast('Quiz submit error: ' + err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Submit Lesson Quiz';
    quizSubmitted = false;
  }
}

// ── Complete Lesson ────────────────────────────────────────────
async function completeLesson() {
  if (!currentLessonId) return;

  try {
    const data = await apiFetch(`/api/lessons/${currentLessonId}/progress`, { method: 'POST' });
    if (!data.success) throw new Error(data.message);

    lessonProgressMap[currentLessonId] = true;
    showToast(`+${data.xp_awarded} XP earned! 🎉`, 'success');

    // Update completion banner
    document.getElementById('completionBanner').classList.add('show');

    // Update sidebar & progress bar
    await loadRoadmap();
    renderSidebar();
    updateProgressUI();

    // Auto navigate to next lesson after short delay
    if (currentLessonData?.next_lesson) {
      setTimeout(() => {
        showToast('Moving to next lesson...', 'info');
        setTimeout(() => openLesson(currentLessonData.next_lesson.id), 2000);
      }, 3000);
    }
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

// ── Personal Lesson Notes ──────────────────────────────────────
async function loadStudentNote(lessonId) {
  try {
    const data = await apiFetch(`/api/lessons/${lessonId}/notes`);
    if (data.success && data.note) {
      document.getElementById('studentNotesArea').value = data.note.content || '';
    } else {
      document.getElementById('studentNotesArea').value = '';
    }
  } catch (e) {
    document.getElementById('studentNotesArea').value = '';
  }
}

document.getElementById('saveNotesBtn').addEventListener('click', async () => {
  if (!currentLessonId) return;
  const content = document.getElementById('studentNotesArea').value;
  const statusEl = document.getElementById('notesStatus');
  statusEl.textContent = 'Saving note...';

  try {
    const data = await apiFetch(`/api/lessons/${currentLessonId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
    if (data.success) {
      statusEl.textContent = 'Notes saved successfully!';
      showToast('Notes saved successfully!', 'success');
      setTimeout(() => { statusEl.textContent = 'All notes are auto-saved to database.'; }, 3000);
    } else {
      statusEl.textContent = 'Error: ' + data.message;
    }
  } catch (err) {
    statusEl.textContent = 'Error: ' + err.message;
  }
});

// ── Related Videos & Resources ────────────────────────────────
function renderRightVideos(videos) {
  const container = document.getElementById('rightVideos');
  if (!videos || !videos.length) {
    container.innerHTML = '<p style="font-size:12px;color:var(--mist);">No videos yet.</p>';
    return;
  }
  container.innerHTML = videos.map(v => `
    <div class="vid-card" onclick="openVideoModal('${v.video_id}','${escapeAttr(v.title)}')">
      <div class="vid-thumb">
        <img src="${v.thumbnail}" alt="" loading="lazy">
        <div class="vid-play-overlay">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
      </div>
      <div class="vid-info">
        <div class="vid-title">${v.title}</div>
        <div class="vid-meta">${v.channel} · ${v.duration}</div>
      </div>
    </div>
  `).join('');
}

function renderRightResources(resources) {
  const container = document.getElementById('rightResources');
  if (!resources || !resources.length) {
    container.innerHTML = '<p style="font-size:12px;color:var(--mist);">No resources yet.</p>';
    return;
  }
  const iconMap = { docs: '📄', tutorial: '📖', reference: '📌', practice: '💪', tool: '🔧' };
  container.innerHTML = resources.map(r => `
    <a href="${r.url}" target="_blank" class="resource-link">
      <span>${iconMap[r.type] || '🔗'}</span>
      <span style="flex:1;">${r.title}</span>
    </a>
  `).join('');
}

// ── AI Assistant Copilot Panel ─────────────────────────────────
function setupAISystem() {
  document.querySelectorAll('.ai-tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.ai;
      openAIModal(mode);
    });
  });

  document.getElementById('aiModalClose').addEventListener('click', () => {
    document.getElementById('aiModal').classList.remove('open');
  });

  document.getElementById('aiSendBtn').addEventListener('click', sendAIChatMessage);
}

function openAIModal(mode) {
  const modal = document.getElementById('aiModal');
  const chat = document.getElementById('aiChatHistory');
  modal.classList.add('open');

  const topic = currentLessonData?.lesson?.title || 'this topic';

  let reply = '';
  if (mode === 'explain') reply = `Here is a detailed explanation of **${topic}**:\n\nThis core concept represents the logical design framework behind computational executions. It processes dynamic inputs via stack scopes and executes instructions linearly.`;
  if (mode === 'simplify') reply = `Let's simplify **${topic}** for a beginner:\n\nImagine it like a post office. You have letters (variables), postal routes (control flow statements), and mailboxes (memory pointers). It just manages routes cleanly!`;
  if (mode === 'debug') reply = `Debugging copilot initialized for **${topic}**:\n\nCommon errors include:\n1. Off-by-one boundary checking\n2. Null dereferences\n3. Scope leaks.\n\nPaste your code snippet here to scan for warnings.`;
  if (mode === 'optimize') reply = `Optimization options for **${topic}**:\n\n1. Replace loops with linear operations\n2. Cache values to avoid recurrent allocations\n3. Restructure nested scopes for clean compiler executions.`;

  chat.innerHTML += `
    <div style="margin-top:1rem;padding:0.75rem;background:rgba(255,255,255,0.02);border-radius:6px;font-size:13px;border-left:3px solid var(--accent);">
      <strong>AI Copilot:</strong><br>${reply.replace(/\n/g, '<br>')}
    </div>
  `;
  chat.scrollTop = chat.scrollHeight;
}

function sendAIChatMessage() {
  const input = document.getElementById('aiChatInput');
  const txt = input.value.trim();
  if (!txt) return;

  const chat = document.getElementById('aiChatHistory');
  chat.innerHTML += `
    <div style="margin-top:1rem;font-size:13px;text-align:right;color:var(--accent);">
      <strong>You:</strong> ${txt}
    </div>
  `;

  input.value = '';
  chat.scrollTop = chat.scrollHeight;

  // Dynamic response mock explaining/answering
  setTimeout(() => {
    chat.innerHTML += `
      <div style="margin-top:1rem;padding:0.75rem;background:rgba(255,255,255,0.02);border-radius:6px;font-size:13px;border-left:3px solid var(--accent);">
        <strong>AI Copilot:</strong><br>Regarding "${txt}", under this lesson topic we ensure references point to stack scopes. That guarantees safe multi-threaded memory allocation. Let me know if you need code snippets!
      </div>
    `;
    chat.scrollTop = chat.scrollHeight;
  }, 1000);
}

// ── Certification Exam Section ─────────────────────────────────
function setupExamSystem() {
  document.getElementById('takeExamBtn').addEventListener('click', loadRoadmapExam);
  document.getElementById('examModalClose').addEventListener('click', () => {
    document.getElementById('examModal').classList.remove('open');
  });
  document.getElementById('submitExamBtn').addEventListener('click', submitExam);
}

async function loadRoadmapExam() {
  const modal = document.getElementById('examModal');
  const container = document.getElementById('examQuizContainer');
  const intro = document.getElementById('examIntro');
  const footer = document.getElementById('examFooter');

  intro.style.display = 'none';
  container.style.display = 'block';
  footer.style.display = 'block';
  modal.classList.add('open');

  try {
    const data = await apiFetch(`/api/roadmaps/${ROADMAP_ID}/exam`);
    if (data.success && data.questions) {
      examQuestions = data.questions;
      examAnswers = {};
      examSubmitted = false;

      container.innerHTML = '';
      examQuestions.forEach((q, qi) => {
        const letters = ['A', 'B', 'C', 'D'];
        const options = [q.option_a, q.option_b, q.option_c, q.option_d];
        const card = document.createElement('div');
        card.className = 'quiz-question';
        card.innerHTML = `
          <div class="quiz-q-text"><span style="color:var(--accent);font-family:var(--font-mono);margin-right:.4rem;">Q${qi+1}.</span>${q.question}</div>
          <div class="quiz-options">
            ${options.map((opt, i) => `
              <div class="quiz-option exam-opt" data-qid="${q.id}" data-letter="${letters[i]}">
                <div class="quiz-letter">${letters[i]}</div>
                <div>${opt}</div>
              </div>
            `).join('')}
          </div>
        `;
        card.querySelectorAll('.exam-opt').forEach(opt => {
          opt.addEventListener('click', function () {
            if (examSubmitted) return;
            const qid = this.dataset.qid;
            const letter = this.dataset.letter;
            examAnswers[qid] = letter;
            card.querySelectorAll('.exam-opt').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
          });
        });
        container.appendChild(card);
      });
    }
  } catch (err) {
    showToast('Failed to load exam questions.', 'error');
  }
}

async function submitExam() {
  if (examSubmitted) return;
  examSubmitted = true;

  try {
    const data = await apiFetch(`/api/roadmaps/${ROADMAP_ID}/exam/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers: examAnswers })
    });

    if (!data.success) throw new Error(data.message);

    const scoreEl = document.getElementById('examScore');
    scoreEl.style.display = 'block';
    document.getElementById('examQuizContainer').style.display = 'none';
    document.getElementById('examFooter').style.display = 'none';

    if (data.passed) {
      scoreEl.innerHTML = `
        <div style="font-size:3rem;margin-bottom:0.5rem;">🏆</div>
        <h2 style="color:var(--emerald);margin-bottom:0.5rem;">Passed! Score: ${data.score}%</h2>
        <p style="color:var(--mist);font-size:14px;margin-bottom:1.5rem;">Congratulations! You have successfully completed the roadmap and earned your verified certificate.</p>
        <button class="btn btn-primary" onclick="window.location.href='certificates.html'">View Earned Certificate</button>
      `;
      addXP(data.xp_awarded || 500);
      showToast('Mastery Certification Exam Passed! 🏆', 'success', 6000);
    } else {
      scoreEl.innerHTML = `
        <div style="font-size:3rem;margin-bottom:0.5rem;">❌</div>
        <h2 style="color:#ef4444;margin-bottom:0.5rem;">Exam Failed. Score: ${data.score}%</h2>
        <p style="color:var(--mist);font-size:14px;margin-bottom:1.5rem;">Passing score is 70%. Review the module lessons and practice exercises before attempting again.</p>
        <button class="btn btn-secondary" onclick="document.getElementById('examModal').classList.remove('open')">Close</button>
      `;
    }
  } catch (err) {
    showToast('Exam submission failed.', 'error');
    examSubmitted = false;
  }
}

// ── Open Coding Lab Helper ────────────────────────────────────
function openCodingLab(lang, code) {
  const encoded = encodeURIComponent(code || '');
  const url = `coding-lab.html?lang=${lang || 'javascript'}&code=${encoded}`;
  window.open(url, '_blank');
}

// ── Open Video Modal ───────────────────────────────────────────
function openVideoModal(videoId, title) {
  const modal = document.getElementById('vidModal');
  document.getElementById('vidIframe').src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  document.getElementById('vidModalTitle').textContent = title;
  modal.classList.add('open');
}

function closeVideoModal() {
  document.getElementById('vidModal').classList.remove('open');
  document.getElementById('vidIframe').src = '';
}

document.getElementById('vidModalClose').addEventListener('click', closeVideoModal);
document.getElementById('vidModal').addEventListener('click', e => {
  if (e.target === document.getElementById('vidModal')) closeVideoModal();
});

// ── Update Progress Rings & Certification triggers ─────────────
function updateProgressUI() {
  const lessons = getAllLessons();
  const total = lessons.length;
  const done = lessons.filter(l => lessonProgressMap[l.id]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  // Mini progress topbar
  document.getElementById('tbProgress').textContent = `${done} / ${total} lessons`;
  document.getElementById('tbProgressBar').style.width = pct + '%';

  // Sidebar progress
  document.getElementById('sbProgressFill').style.width = pct + '%';
  document.getElementById('sbProgressText').textContent = `${done} / ${total} complete`;

  // Ring right panel
  const circumference = 150.8;
  const offset = circumference - (pct / 100) * circumference;
  const ring = document.getElementById('progressRingCircle');
  if (ring) ring.style.strokeDashoffset = offset;
  const pctEl = document.getElementById('progressRingPct');
  if (pctEl) pctEl.textContent = pct + '%';
  const labelEl = document.getElementById('progressRingLabel');
  if (labelEl) labelEl.textContent = `${done} / ${total} done`;

  const rp_m = document.getElementById('rp_modules');
  if (rp_m) rp_m.textContent = `${done} / ${total}`;

  // XP calculation
  const xpEarned = done * 100;
  const rp_xp = document.getElementById('rp_xp');
  if (rp_xp) rp_xp.textContent = xpEarned + ' XP';

  // Handle Exam unlock trigger
  const examBtn = document.getElementById('takeExamBtn');
  const certLabel = document.getElementById('certLabel');
  if (pct === 100) {
    examBtn.style.display = 'block';
    certLabel.textContent = 'Roadmap completed! Click above to take certification exam.';
  } else {
    examBtn.style.display = 'none';
  }
}

// ── Tab Switching ──────────────────────────────────────────────
function switchTab(tabId) {
  document.querySelectorAll('.learn-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  document.querySelectorAll('.tab-panel').forEach(p => p.style.display = p.id === `tab-${tabId}` ? 'block' : 'none');
}

document.querySelectorAll('.learn-tab').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ── Mark Complete Button ───────────────────────────────────────
document.getElementById('markCompleteBtn').addEventListener('click', completeLesson);

// ── Open Coding Lab Button ─────────────────────────────────────
document.getElementById('openCodingLabBtn').addEventListener('click', () => {
  const lang = currentLessonData?.lesson?.language || 'javascript';
  const code = currentLessonData?.lesson?.starter_code || '';
  openCodingLab(lang, code);
});

// ── Bookmark Button ────────────────────────────────────────────
document.getElementById('bookmarkModBtn').addEventListener('click', async () => {
  try {
    const data = await apiFetch('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ item_type: 'lesson', item_id: String(currentLessonId) }),
    });
    showToast(data.bookmarked ? 'Lesson bookmarked! 🔖' : 'Bookmark removed.', data.bookmarked ? 'success' : 'info');
  } catch (err) {
    showToast('Bookmark error: ' + err.message, 'error');
  }
});

// ── Submit Quiz Button ─────────────────────────────────────────
document.getElementById('submitQuizBtn').addEventListener('click', submitQuiz);

// ── Mock Interview Button ──────────────────────────────────────
document.getElementById('mockInterviewBtn')?.addEventListener('click', () => {
  const chat = document.getElementById('aiChatHistory');
  document.getElementById('aiModal').classList.add('open');
  chat.innerHTML += `
    <div style="margin-top:1rem;padding:0.75rem;background:rgba(52,211,153,0.06);border-radius:6px;font-size:13px;border-left:3px solid var(--emerald);">
      <strong>Mock Interviewer:</strong><br>Welcome to your EduNet mock interview! I will ask a company-specific question for this topic.<br><br><strong>Question:</strong> How would you optimize query execution plans in high-throughput databases? Take your time and draft your answer below.
    </div>
  `;
  chat.scrollTop = chat.scrollHeight;
});

// ── Markdown Parser ────────────────────────────────────────────
function markdownToHtml(md) {
  if (!md) return '';
  let html = md
    .replace(/```(\w+)?\n?([\s\S]*?)```/gm, (_, lang, code) => {
      return `<pre><button class="copy-btn" onclick="copyCode(this)">Copy</button><code class="lang-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`;
    })
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^[*\-] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/^---$/gm, '<hr>')
    .replace(/\n\n(?!<[uh]|<li|<hr)/g, '</p><p>')
    .replace(/\n/g, '<br>');

  return `<p>${html}</p>`;
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return String(str).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
}

function addCopyButtons() {}

window.copyCode = function(btn) {
  const code = btn.nextElementSibling?.textContent || '';
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
  });
};

// ── Start ───────────────────────────────────────────────────────
init();
