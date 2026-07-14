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
let currentLessonUI    = null;  // normalized via LessonAdapter — always use this for rendering
let lessonProgressMap  = {}; // lessonId -> completed (boolean)
let quizAnswers        = {}; // quizId -> option
let quizSubmitted      = false;

let examQuestions      = [];
let examAnswers        = {};
let examSubmitted      = false;

// ── Course Stepper State ───────────────────────────────────────
let activeStepIndex = 0;
let stepProgress = {};
const STEPS = [
  { id: 'overview', label: 'Overview', tab: 'overview' },
  { id: 'beginner-learn', label: 'Beginner Learn', tab: 'beginner' },
  { id: 'beginner-practice', label: 'Beginner Practice', tab: 'beginner' },
  { id: 'beginner-checkpoint', label: 'Beginner Checkpoint', tab: 'beginner' },
  { id: 'intermediate-learn', label: 'Intermediate Learn', tab: 'intermediate' },
  { id: 'intermediate-practice', label: 'Intermediate Practice', tab: 'intermediate' },
  { id: 'intermediate-checkpoint', label: 'Intermediate Checkpoint', tab: 'intermediate' },
  { id: 'expert-learn', label: 'Expert Learn', tab: 'expert' },
  { id: 'expert-debugging', label: 'Debugging Challenge', tab: 'debugging' },
  { id: 'expert-project', label: 'Mini Project', tab: 'project' },
  { id: 'final-assessment', label: 'Final Assessment', tab: 'assessment' },
  { id: 'cheatsheet', label: 'Cheat Sheet', tab: 'cheatsheet' },
  { id: 'interview', label: 'Interview Prep', tab: 'interview' },
  { id: 'revision', label: 'Revision Notes', tab: 'revision' },
  { id: 'complete', label: 'Completion', tab: 'revision' }
];

function initStepperState() {
  activeStepIndex = 0;
  stepProgress = {
    'overview': true
  };
  STEPS.forEach(s => {
    if (s.id !== 'overview') {
      stepProgress[s.id] = false;
    }
  });
}

let explanationMode    = 'detailed'; // detailed, beginner, advanced
let checkpointCorrectCount = 0;
let checkpointTotalCount = 0;
let stepperCompleted = false;
let mcqAnsweredCount = 0;

// ── Init ───────────────────────────────────────────────────────
async function init() {
  console.log('[DEBUG] init() started, ROADMAP_ID=', ROADMAP_ID);
  console.log('[DEBUG] session=', session);
  try {
    console.log('[DEBUG] calling loadRoadmap()...');
    await loadRoadmap();
    console.log('[DEBUG] loadRoadmap() done, currentRoadmap=', currentRoadmap?.title, 'modules=', currentRoadmap?.modules?.length);
    renderSidebar();
    console.log('[DEBUG] renderSidebar() done');
    updateProgressUI();
    console.log('[DEBUG] updateProgressUI() done');

    // Auto-open requested or first incomplete lesson
    const lessonsList = getAllLessons();
    console.log('[DEBUG] lessonsList.length=', lessonsList.length);
    if (INIT_LESSON) {
      openLesson(INIT_LESSON);
    } else {
      const firstIncomplete = lessonsList.find(l => !l.completed);
      const first = firstIncomplete || lessonsList[0];
      console.log('[DEBUG] first lesson to open:', first?.id, first?.title);
      if (first) openLesson(first.id);
    }

    setupAISystem();
    setupExamSystem();
    console.log('[DEBUG] init() complete');
  } catch (err) {
    console.error('[DEBUG] Init error:', err);
    console.error('[DEBUG] Stack:', err.stack);
    showToast('Failed to load roadmap: ' + err.message, 'error');
  }
}

// ── Load Roadmap ───────────────────────────────────────────────
async function loadRoadmap() {
  console.log('[DEBUG] loadRoadmap(): fetching /api/roadmaps/' + ROADMAP_ID);
  let data;
  try {
    data = await apiFetch('/api/roadmaps/' + ROADMAP_ID);
  } catch(fetchErr) {
    console.error('[DEBUG] loadRoadmap(): apiFetch threw:', fetchErr.message);
    throw fetchErr;
  }
  console.log('[DEBUG] loadRoadmap(): response received, success=', data.success, 'roadmap=', data.roadmap?.title);
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
  console.log('[DEBUG] loadRoadmap(): DOM updated, title set to', currentRoadmap.title);
}

// ── Helper: Get flat list of all lessons ──────────────────────
function getAllLessons() {
  const lessons = [];
  if (currentRoadmap) {
    if (currentRoadmap.beginner) lessons.push(...currentRoadmap.beginner);
    if (currentRoadmap.intermediate) lessons.push(...currentRoadmap.intermediate);
    if (currentRoadmap.expert) lessons.push(...currentRoadmap.expert);
  }
  return lessons;
}

// ── Render Sidebar Modules Accordion ───────────────────────────
function renderSidebar() {
  const list = document.getElementById('moduleList');
  list.innerHTML = '';

  if (!currentRoadmap) return;

  const levels = [
    { key: 'beginner', title: 'Beginner', lessons: currentRoadmap.beginner || [], progress: currentRoadmap.beginner_progress || 0, assessment: currentRoadmap.beginner_assessment },
    { key: 'intermediate', title: 'Intermediate', lessons: currentRoadmap.intermediate || [], progress: currentRoadmap.intermediate_progress || 0, assessment: currentRoadmap.intermediate_assessment },
    { key: 'expert', title: 'Expert', lessons: currentRoadmap.expert || [], progress: currentRoadmap.expert_progress || 0, assessment: currentRoadmap.expert_assessment }
  ];

  levels.forEach(lvl => {
    const levelSec = document.createElement('div');
    levelSec.className = 'level-section';
    levelSec.id = `level-sec-${lvl.key}`;

    const hasActiveLesson = lvl.lessons.some(l => l.id === currentLessonId);
    const isCurrentLevel = lvl.lessons.some(l => l.status === 'current');
    if (hasActiveLesson || isCurrentLevel || (lvl.key === 'beginner' && !currentLessonId)) {
      levelSec.classList.add('open');
    }

    levelSec.innerHTML = `
      <div class="level-header">
        <span class="level-header-title">${lvl.title}</span>
        <div class="level-header-progress">
          <div class="level-header-progress-fill" style="width: ${lvl.progress}%"></div>
        </div>
        <span class="level-header-percentage">${lvl.progress}%</span>
        <span class="level-header-icon">▼</span>
      </div>
      <div class="level-body">
        <div class="level-modules-container"></div>
      </div>
    `;

    levelSec.querySelector('.level-header').addEventListener('click', () => {
      levelSec.classList.toggle('open');
    });

    const modulesContainer = levelSec.querySelector('.level-modules-container');

    const groups = [];
    const map = {};
    lvl.lessons.forEach(l => {
      if (!map[l.module_id]) {
        map[l.module_id] = {
          id: l.module_id,
          module_title: l.module_title || l.moduleTitle || '',
          lessons: []
        };
        groups.push(map[l.module_id]);
      }
      map[l.module_id].lessons.push(l);
    });

    groups.forEach((mod) => {
      const item = document.createElement('div');
      item.className = `accordion-item`;
      item.id = `mod-accordion-${mod.id}`;

      const doneCount = mod.lessons.filter(l => lessonProgressMap[l.id]).length;
      const totalCount = mod.lessons.length;
      const allDone = doneCount === totalCount && totalCount > 0;

      const hasActive = mod.lessons.some(l => l.id === currentLessonId);
      if (hasActive) {
        item.classList.add('open');
      }

      item.innerHTML = `
        <div class="accordion-header">
          <span class="accordion-header-title">
            ${allDone ? '<span style="color:var(--emerald);margin-right:4px;">✓</span>' : ''}
            ${mod.module_title}
          </span>
          <span class="accordion-header-icon">▼</span>
        </div>
        <div class="accordion-body">
          <div style="padding:0.25rem 0 0.5rem 1rem; font-size:11px; color:var(--mist-dim);">
            ${doneCount} / ${totalCount} lessons complete
          </div>
          <div class="lesson-list">
            ${mod.lessons.map(les => {
              let icon = '📄';
              if (les.status === 'completed') icon = '✓';
              else if (les.status === 'locked') icon = '🔒';
              else if (les.status === 'current') icon = '▶';

              return `
                <div class="lesson-list-item ${les.id === currentLessonId ? 'active' : ''} ${les.status === 'completed' ? 'completed' : ''} ${les.status === 'locked' ? 'locked' : ''}" data-lid="${les.id}" data-status="${les.status}">
                  <span class="lesson-list-item-icon">${icon}</span>
                  <span style="flex:1;">${les.title.split('— Lesson')[1]?.replace(/^\s*\d+:\s*/, '') || les.title}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

      item.querySelector('.accordion-header').addEventListener('click', () => {
        item.classList.toggle('open');
      });

      item.querySelectorAll('.lesson-list-item').forEach(liEl => {
        liEl.addEventListener('click', (e) => {
          e.stopPropagation();
          const status = liEl.dataset.status;
          if (status === 'locked') {
            showToast('This lesson is locked! Complete preceding topics to unlock.', 'warning');
            return;
          }
          openLesson(parseInt(liEl.dataset.lid));
        });
      });

      modulesContainer.appendChild(item);
    });

    if (lvl.assessment) {
      const assessItem = document.createElement('div');
      const isLocked = lvl.assessment.locked;
      const isPassed = lvl.assessment.passed;

      assessItem.className = `level-assessment-item ${isLocked ? 'locked' : ''} ${isPassed ? 'completed' : ''}`;

      let label = `▶ Take ${lvl.title} Assessment`;
      let icon = '🏆';
      if (isLocked) {
        label = `🔒 ${lvl.title} Assessment (Locked)`;
        icon = '🔒';
      } else if (isPassed) {
        label = `✓ ${lvl.title} Assessment Passed`;
        icon = '✓';
      }

      assessItem.innerHTML = `
        <span class="lesson-list-item-icon">${icon}</span>
        <span>${label}</span>
      `;

      assessItem.addEventListener('click', () => {
        if (isLocked) {
          showToast(`Finish all ${lvl.title} lessons to unlock the assessment!`, 'warning');
          return;
        }
        startLevelAssessment(lvl.key);
      });

      modulesContainer.appendChild(assessItem);
    }

    list.appendChild(levelSec);
  });

  if (currentRoadmap.certification_exam) {
    const certExam = currentRoadmap.certification_exam;
    const isLocked = certExam.locked;
    const isPassed = certExam.passed;

    const certItem = document.createElement('div');
    certItem.className = `certification-exam-item ${isLocked ? 'locked' : ''} ${isPassed ? 'completed' : ''}`;
    certItem.style.margin = '1rem 0';

    let label = `🎓 Take Certification Exam`;
    let icon = '🥇';
    if (isLocked) {
      label = `🔒 Certification Exam (Locked)`;
      icon = '🔒';
    } else if (isPassed) {
      label = `🏆 Certificate Earned!`;
      icon = '🎓';
    }

    certItem.innerHTML = `
      <span class="lesson-list-item-icon">${icon}</span>
      <span>${label}</span>
    `;

    certItem.addEventListener('click', () => {
      if (isLocked) {
        showToast('Complete all level assessments to unlock the Certification Exam!', 'warning');
        return;
      }
      startCertificationExam();
    });

    list.appendChild(certItem);
  }
}

function startLevelAssessment(level) {
  startExamSession('level', level);
}

function startCertificationExam() {
  startExamSession('final', ROADMAP_ID);
}

// ── Open Lesson ────────────────────────────────────────────────
async function openLesson(lessonId) {
  if (currentLessonId === lessonId && currentLessonData) return;
  currentLessonId = lessonId;
  quizAnswers = {};
  quizSubmitted = false;
  // Reset step interactive quiz states
  delete window.final_quiz_answers;
  delete window.final_quiz_completed;
  delete window.final_quiz_active_q;
  delete window.checkpoint_beginner_ans;
  delete window.checkpoint_intermediate_ans;
  delete window.cheatsheet_search_query;
  initStepperState();

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
  // ── 1. Normalize via LessonAdapter ──────────────────────────
  currentLessonUI = window.LessonAdapter.normalize(data);
  const ui = currentLessonUI;
  const { lesson, videos, resources, exercises, quizzes, projects, prev_lesson, next_lesson, completed } = data;

  document.getElementById('contentLoading').style.display = 'none';
  document.getElementById('moduleContent').style.display = 'block';

  // ── 2. Header metadata ───────────────────────────────────────
  document.getElementById('tbModuleName').textContent = ui.title;
  document.getElementById('moduleRoadmapLabel').textContent = (ui.moduleTitle || '') + ' › Lesson ' + (ui.orderIndex || 1);
  document.getElementById('moduleTitle').textContent = ui.title;
  document.getElementById('moduleDesc').textContent = ui.shortDesc;
  document.getElementById('moduleXP').textContent = ui.xpReward;
  document.getElementById('moduleLanguageBadge').textContent = ui.language || 'general';

  // ── 3. Status badge ──────────────────────────────────────────
  const statusBadge = document.getElementById('moduleStatusBadge');
  if (ui.completed) {
    statusBadge.textContent = '✓ Completed';
    statusBadge.className = 'badge badge-green';
  } else {
    statusBadge.textContent = 'In Progress';
    statusBadge.className = 'badge badge-blue';
  }
  document.getElementById('completionBanner').classList.toggle('show', !!ui.completed);

  // ── 4. Dynamically populate the tabs container ───────────────
  const tabsContainer = document.getElementById('learnTabs');
  if (tabsContainer) {
    tabsContainer.innerHTML = '';
    const tabs = [
      { id: 'overview', label: 'Overview' },
      { id: 'learn', label: 'Learning Notes' },
      { id: 'examples', label: 'Examples' },
      { id: 'visualization', label: 'Visualization' },
      { id: 'practice', label: 'Practice' },
      { id: 'quiz', label: 'Topic Quiz' },
      { id: 'project', label: 'Mini Project' },
      { id: 'cheatsheet', label: 'Cheat Sheet' },
      { id: 'interview', label: 'Interview Questions' },
      { id: 'notes', label: 'Notes' }
    ];
    tabs.forEach(t => {
      // Conditional project tab showing
      if (t.id === 'project' && (!ui.project || (!ui.project.title && !ui.project.description))) return;
      
      const btn = document.createElement('button');
      btn.className = 'learn-tab';
      btn.dataset.tab = t.id;
      btn.textContent = t.label;
      btn.addEventListener('click', () => {
        switchTab(t.id);
      });
      tabsContainer.appendChild(btn);
    });
  }

  // Expose currentLessonUI to window for DevTools inspection
  window.currentLessonUI = ui;

  // ── 5. Route to correct pathway ──
  const stepper = document.getElementById('courseStepper');
  if (stepper) stepper.style.display = 'none'; // Hide old visual stepper
  
  // Pre-render all containers
  renderOverviewStep(ui);
  renderLearnContainer(ui);
  renderExamplesContainer(ui);
  renderVisualizationContainer(ui);
  renderPracticeContainer(ui);
  renderProjectPage(ui);
  renderCheatSheet(ui);
  renderInterview(ui);
  
  switchTab('overview');

  // ── 6. Right panel resources & videos ─────────────────────────
  const panelVideos   = (ui.videos?.length ? ui.videos : videos) || [];
  const panelResources = (Array.isArray(ui.resources) ? ui.resources : (ui.resources?.links || resources)) || [];
  renderRightVideos(panelVideos);
  renderRightResources(panelResources);

  // ── 7. Module adjacent navigation ────────────────────────────
  const prevBtn = document.getElementById('prevModBtn');
  const nextBtn = document.getElementById('nextModBtn');
  const prevL = ui.prevLesson;
  const nextL = ui.nextLesson;
  if (prevL) {
    prevBtn.style.display = 'block';
    prevBtn.textContent = '← ' + (prevL.title?.split('— Lesson')[1] || prevL.title);
    prevBtn.onclick = () => openLesson(prevL.id);
  } else {
    prevBtn.style.display = 'none';
  }
  if (nextL) {
    nextBtn.style.display = 'block';
    nextBtn.textContent = (nextL.title?.split('— Lesson')[1] || nextL.title) + ' →';
    nextBtn.onclick = () => openLesson(nextL.id);
  } else {
    nextBtn.style.display = 'none';
  }

  loadStudentNote(lesson?.id);
  const container = document.getElementById('learnContent');
  if (container) container.scrollTop = 0;
  updateProgressUI();
}

// ============================================================
// ── Schema v2.0 Journey Renderer ──────────────────────────────
// ============================================================

function renderV2Journey(ui) {
  initStepperState();
  goToStepIndex(0); // Show first step: Overview
}

// ── Visual Stepper Controls & Flow ────────────────────────────
function goToStepIndex(index) {
  if (index < 0 || index >= STEPS.length) return;
  activeStepIndex = index;

  const currentStep = STEPS[index];
  switchTab(currentStep.tab);

  // Mark current and previous steps as completed
  stepProgress[currentStep.id] = true;
  for (let i = 0; i < index; i++) {
    stepProgress[STEPS[i].id] = true;
  }

  renderStepperHeader();
  renderActiveStepContent(currentStep);

  // Scroll main learning panel to top
  const container = document.getElementById('learnContent');
  if (container) container.scrollTop = 0;
}

function renderStepperHeader() {
  const container = document.getElementById('courseStepper');
  if (!container) return;
  container.style.display = 'flex';
  container.innerHTML = '';

  STEPS.forEach((step, idx) => {
    const isCompleted = stepProgress[step.id];
    const isActive = activeStepIndex === idx;

    const stepEl = document.createElement('div');
    stepEl.className = `stepper-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
    stepEl.innerHTML = `
      <div class="stepper-step-indicator">
        ${isCompleted ? '✓' : (idx + 1)}
      </div>
      <span>${step.label}</span>
    `;

    const isClickable = idx === 0 || stepProgress[STEPS[idx - 1]?.id] || isCompleted || isActive;
    if (isClickable) {
      stepEl.addEventListener('click', () => {
        goToStepIndex(idx);
      });
    } else {
      stepEl.style.opacity = '0.4';
      stepEl.style.cursor = 'not-allowed';
    }

    container.appendChild(stepEl);

    if (idx < STEPS.length - 1) {
      const arrow = document.createElement('div');
      arrow.className = 'stepper-arrow';
      arrow.textContent = '→';
      container.appendChild(arrow);
    }
  });
}

function renderActiveStepContent(step) {
  const ui = currentLessonUI;
  if (!ui) return;

  if (step.id === 'overview') {
    renderOverviewStep(ui);
  } else if (step.id === 'beginner-learn') {
    renderBeginnerLearnStep(ui);
  } else if (step.id === 'beginner-practice') {
    renderPracticePage(ui, 'beginner', 'Beginner', 1, 3);
  } else if (step.id === 'beginner-checkpoint') {
    renderCheckpointPage(ui, 'beginner', 0, 2, 4);
  } else if (step.id === 'intermediate-learn') {
    renderIntermediateLearnStep(ui);
  } else if (step.id === 'intermediate-practice') {
    renderPracticePage(ui, 'intermediate', 'Intermediate', 4, 6);
  } else if (step.id === 'intermediate-checkpoint') {
    renderCheckpointPage(ui, 'intermediate', 1, 5, 7);
  } else if (step.id === 'expert-learn') {
    renderExpertLearnStep(ui);
  } else if (step.id === 'expert-debugging') {
    renderDebuggingPage(ui);
  } else if (step.id === 'expert-project') {
    renderProjectPage(ui);
  } else if (step.id === 'final-assessment') {
    renderFinalAssessment(ui);
  } else if (step.id === 'cheatsheet') {
    renderCheatSheet(ui);
  } else if (step.id === 'interview') {
    renderInterview(ui);
  } else if (step.id === 'revision' || step.id === 'complete') {
    renderRevision(ui);
  }
}

// ── Sub-step Renderer: 0. Overview ───────────────────────────
function renderOverviewStep(ui) {
  const container = document.getElementById('overviewContainer');
  if (!container) return;

  const preList = ui.prerequisites && ui.prerequisites.length 
    ? ui.prerequisites.map(p => `<li>${escapeHtml(p)}</li>`).join('') 
    : '<li>None</li>';

  const objList = ui.learningObjectives && ui.learningObjectives.length 
    ? ui.learningObjectives.map(o => `<li>${escapeHtml(o)}</li>`).join('') 
    : '<li>Master variables definition and assignment syntax</li>';

  const buildSummary = ui.project?.title 
    ? `<strong>${escapeHtml(ui.project.title)}</strong>: ${escapeHtml(ui.project.tagline || '')} — ${markdownToHtml(ui.project.description || '')}`
    : 'A command-line tool applying the concepts learned in this lesson.';

  const checklistHtml = STEPS.map((s, i) => {
    const done = stepProgress[s.id];
    return `
      <div style="display:flex;align-items:center;gap:0.75rem;padding:0.4rem 0.6rem;background:var(--abyss);border-radius:6px;border:1px solid var(--border);">
        <span style="color:${done ? 'var(--emerald)' : 'var(--mist-dim)'};font-weight:700;">${done ? '✓' : '○'}</span>
        <span style="font-size:12.5px;color:${done ? 'var(--frost)' : 'var(--mist)'};">${i+1}. ${s.label}</span>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="journey-card" style="border-left: 4px solid var(--accent);">
      <h2>📋 Module Overview</h2>
      <p style="font-size:14.5px;color:var(--mist);margin-bottom:1.5rem;">${escapeHtml(ui.shortDesc || 'Welcome to this roadmap learning module. This step-by-step interactive course will take you from zero to expert mastery.')}</p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;">
        <div style="background:var(--abyss-2);padding:1rem;border-radius:8px;border:1px solid var(--border);">
          <strong>🎯 Learning Objectives:</strong>
          <ul style="margin:0.5rem 0 0 1.25rem;font-size:13px;color:var(--mist);line-height:1.7;">
            ${objList}
          </ul>
        </div>
        <div style="background:var(--abyss-2);padding:1rem;border-radius:8px;border:1px solid var(--border);">
          <strong>⏱️ Details:</strong>
          <div style="font-size:13px;color:var(--mist);margin-top:0.5rem;line-height:1.8;">
            <div>• <strong>Duration:</strong> ~${ui.estimatedTime || 30} minutes</div>
            <div>• <strong>Difficulty:</strong> ${escapeHtml(ui.difficulty || 'Beginner')}</div>
            <div>• <strong>XP Reward:</strong> ${ui.xpReward || 100} XP</div>
          </div>
        </div>
      </div>

      <div style="background:var(--abyss-2);padding:1rem;border-radius:8px;border:1px solid var(--border);margin-bottom:1.5rem;">
        <strong>🛠️ What You Will Build:</strong>
        <div style="font-size:13px;color:var(--mist);margin-top:0.4rem;line-height:1.7;">
          ${buildSummary}
        </div>
      </div>

      <div style="margin-bottom:1.5rem;">
        <strong>🗺️ Course Progress Tracker Checklist:</strong>
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));gap:0.5rem;margin-top:0.6rem;">
          ${checklistHtml}
        </div>
      </div>

      <div class="step-nav-footer">
        <div></div>
        <button class="btn btn-primary" onclick="switchTab('learn')">Continue to Learn →</button>
      </div>
    </div>
  `;
}

function renderLearnContainer(ui) {
  const container = document.getElementById('learnContainer');
  if (!container) return;

  const b = ui.beginner || {};
  const im = ui.intermediate || {};
  const ex = ui.expert || {};

  // 1. Beginner Theory Section
  let beginnerHtml = '';
  if (b.simpleExplanation || b.whyExists || b.realWorldAnalogy) {
    beginnerHtml = `
      <div class="theory-section" style="margin-bottom: 2rem;">
        <h3 style="color:var(--accent); font-size:16px; border-bottom:1px solid var(--border); padding-bottom:0.5rem; margin-bottom:1rem;">🌟 Level 1: Concept Introduction (Beginner)</h3>
        ${b.simpleExplanation ? `<div style="font-size:14px; line-height:1.75; color:var(--text);">${markdownToHtml(b.simpleExplanation)}</div>` : ''}
        ${b.whyExists ? `<h4 style="margin-top:1.25rem; margin-bottom:0.5rem; font-size:13.5px; color:var(--frost);">🔍 Why it exists & what problem it solves:</h4><div style="font-size:13.5px; line-height:1.7; color:var(--mist);">${markdownToHtml(b.whyExists)}</div>` : ''}
        ${b.realWorldAnalogy ? `<div class="analogy-card" style="margin-top:1.25rem;background:rgba(99,102,241,0.02);padding:1rem;border-left:3px solid var(--accent);border-radius:6px; font-size:13.5px; line-height:1.7;"><strong>💡 Real-World Analogy:</strong><br>${markdownToHtml(b.realWorldAnalogy)}</div>` : ''}
        ${b.syntaxExplanation ? `<h4 style="margin-top:1.25rem; margin-bottom:0.5rem; font-size:13.5px; color:var(--frost);">📐 Syntax Breakdown:</h4><div style="font-size:13.5px; line-height:1.7; color:var(--mist);">${markdownToHtml(b.syntaxExplanation)}</div>` : ''}
      </div>
    `;
  }

  // 2. Intermediate Theory Section
  let intermediateHtml = '';
  if (im.deeperExplanation || im.mutability || im.noneValue || im.internalImplementation) {
    intermediateHtml = `
      <div class="theory-section" style="margin-top: 2.5rem; margin-bottom: 2rem;">
        <h3 style="color:#fbbf24; font-size:16px; border-bottom:1px solid var(--border); padding-bottom:0.5rem; margin-bottom:1rem;">⚙️ Level 2: Deeper Concept Analysis (Intermediate)</h3>
        ${im.deeperExplanation ? `<div style="font-size:14px; line-height:1.75; color:var(--text);">${markdownToHtml(im.deeperExplanation)}</div>` : ''}
        ${im.mutability ? `<h4 style="margin-top:1.25rem; margin-bottom:0.5rem; font-size:13.5px; color:var(--frost);">🔄 Mutability details:</h4><div style="font-size:13.5px; line-height:1.7; color:var(--mist);">${markdownToHtml(im.mutability)}</div>` : ''}
        ${im.noneValue ? `<h4 style="margin-top:1.25rem; margin-bottom:0.5rem; font-size:13.5px; color:var(--frost);">🚫 Special Scopes / None Value:</h4><div style="font-size:13.5px; line-height:1.7; color:var(--mist);">${markdownToHtml(im.noneValue)}</div>` : ''}
        ${im.internalImplementation ? `<h4 style="margin-top:1.25rem; margin-bottom:0.5rem; font-size:13.5px; color:var(--frost);">🔬 Under the Hood & Memory Allocations:</h4><div style="font-size:13.5px; line-height:1.7; color:var(--mist);">${markdownToHtml(im.internalImplementation)}</div>` : ''}
      </div>
    `;
  }

  // 3. Expert Theory Section
  let expertHtml = '';
  if (ex.overview || ex.industryContext || ex.complexityAnalysis || ex.designPatterns) {
    expertHtml = `
      <div class="theory-section" style="margin-top: 2.5rem; margin-bottom: 2rem;">
        <h3 style="color:#ef4444; font-size:16px; border-bottom:1px solid var(--border); padding-bottom:0.5rem; margin-bottom:1rem;">🚀 Level 3: Production & Architecture (Expert)</h3>
        ${ex.overview ? `<div style="font-size:14px; line-height:1.75; color:var(--text);">${markdownToHtml(ex.overview)}</div>` : ''}
        ${ex.industryContext ? `<h4 style="margin-top:1.25rem; margin-bottom:0.5rem; font-size:13.5px; color:var(--frost);">💼 Industry Context & Real-world Usage:</h4><div style="font-size:13.5px; line-height:1.7; color:var(--mist);">${markdownToHtml(ex.industryContext)}</div>` : ''}
        ${ex.complexityAnalysis ? `<h4 style="margin-top:1.25rem; margin-bottom:0.5rem; font-size:13.5px; color:var(--frost);">📈 Complexity Analysis:</h4><div style="font-size:13.5px; line-height:1.7; color:var(--mist);">${markdownToHtml(ex.complexityAnalysis.time || '')} ${markdownToHtml(ex.complexityAnalysis.space || '')}</div>` : ''}
        ${ex.designPatterns ? `<h4 style="margin-top:1.25rem; margin-bottom:0.5rem; font-size:13.5px; color:var(--frost);">🎭 Design Patterns:</h4><div style="font-size:13.5px; line-height:1.7; color:var(--mist);">${markdownToHtml(ex.designPatterns.join('\n') || '')}</div>` : ''}
      </div>
    `;
  }

  // Naming rules
  let rulesHtml = '';
  const namingRules = b.namingRules || [];
  if (namingRules.length) {
    rulesHtml = `
      <div class="theory-section" style="margin-top:2.5rem;border-top:1px solid var(--border);padding-top:2rem;">
        <h3>📏 Coding & Naming Guidelines</h3>
        <table style="width:100%;border-collapse:collapse;font-size:13px;background:var(--abyss);border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-top:0.75rem;">
          <thead><tr style="background:var(--abyss-2);">
            <th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--mist-dim);">Rule</th>
            <th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--emerald);">Good Example</th>
            <th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--rose);">Bad Example</th>
          </tr></thead>
          <tbody>${namingRules.map(r => `
            <tr>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);vertical-align:top;color:var(--text);font-weight:600;">${escapeHtml(r.rule || '')}</td>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);vertical-align:top;font-family:var(--font-mono);font-size:11.5px;color:var(--emerald);">${escapeHtml(r.good || '')}</td>
              <td style="padding:8px 12px;border-bottom:1px solid var(--border);vertical-align:top;font-family:var(--font-mono);font-size:11.5px;color:var(--rose);">${escapeHtml(r.bad || '')}</td>
            </tr>
          `).join('')}</tbody>
        </table>
      </div>
    `;
  }

  // Mistakes
  let mistakesHtml = '';
  const commonMistakes = b.commonMistakes || im.commonErrors || [];
  if (commonMistakes.length) {
    mistakesHtml = `
      <div class="theory-section" style="margin-top:2.5rem;border-top:1px solid var(--border);padding-top:2rem;">
        <h3>⚠️ Common Pitfalls & Mistakes to Avoid</h3>
        <div style="display:flex;flex-direction:column;gap:1.5rem;margin-top:1rem;">
          ${commonMistakes.slice(0, 3).map(m => `
            <div>
              <div style="font-weight:600;font-size:13.5px;color:var(--text);margin-bottom:0.5rem;">• ${escapeHtml(m.mistake || m.error || '')}</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div style="border:1px solid rgba(244,63,94,0.15);background:rgba(244,63,94,0.01);border-radius:6px;padding:0.75rem;">
                  <div style="color:var(--rose);font-weight:700;font-size:11px;margin-bottom:0.4rem;">❌ Incorrect Code</div>
                  <pre style="margin:0;"><code style="font-size:12px;">${escapeHtml(m.wrong || m.bad || '')}</code></pre>
                </div>
                <div style="border:1px solid rgba(16,185,129,0.15);background:rgba(16,185,129,0.01);border-radius:6px;padding:0.75rem;">
                  <div style="color:var(--emerald);font-weight:700;font-size:11px;margin-bottom:0.4rem;">✅ Corrected Code</div>
                  <pre style="margin:0;"><code style="font-size:12px;">${escapeHtml(m.right || m.good || '')}</code></pre>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="journey-card" style="border-left:4px solid var(--accent);">
      <h2>📖 Learning Notes</h2>
      <p style="font-size:13px;color:var(--mist);margin-bottom:1.5rem;">Read through the complete concept guide structured progressively from beginner basics to advanced architectures.</p>
      <div style="margin-top:1.5rem;">
        ${beginnerHtml}
        ${intermediateHtml}
        ${expertHtml}
        ${rulesHtml}
        ${mistakesHtml}
      </div>
      <div class="step-nav-footer" style="margin-top:2.5rem;display:flex;justify-content:space-between;border-top:1px solid var(--border);padding-top:1.5rem;">
        <button class="btn btn-secondary" onclick="switchTab('overview')">← Back to Overview</button>
        <button class="btn btn-primary" onclick="switchTab('examples')">Continue to Examples →</button>
      </div>
    </div>
  `;
}

function renderVisualizationContainer(ui) {
  const container = document.getElementById('visualizationContainer');
  if (!container) return;

  const b = ui.beginner || {};
  const im = ui.intermediate || {};
  const ex = ui.expert || {};

  const memDiagram = b.memoryDiagram || im.memoryDiagram || ex.memoryDiagram;
  const visualDiagram = b.visualDiagram || im.visualDiagram || ex.visualDiagram;
  const stepByStep = b.stepByStep || im.stepByStep || ex.stepByStep;

  let memTableHtml = '';
  if (memDiagram && (memDiagram.rows || memDiagram.slots)) {
    memTableHtml = renderV2MemoryTable(memDiagram);
  } else if (visualDiagram) {
    memTableHtml = `<pre style="font-size:12px;overflow:auto;padding:0.75rem;background:var(--abyss);border:1px solid var(--border);border-radius:6px;color:var(--accent);">${escapeHtml(visualDiagram)}</pre>`;
  }

  const traceHtml = stepByStep && stepByStep.length ? `
    <div style="margin-top:1.5rem;">
      <h4 style="margin-bottom:0.75rem; font-size:14px; color:var(--frost);">👣 Step-by-Step Dry Run Execution Trace:</h4>
      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        ${stepByStep.map((s, idx) => `
          <div style="display:flex;gap:0.75rem;background:var(--abyss-2);padding:0.75rem;border-radius:6px;border:1px solid var(--border);font-size:12.5px;">
            <span style="font-weight:700;color:var(--accent);font-family:var(--font-mono);">${idx + 1}</span>
            <div>
              <code style="color:var(--accent); font-weight:600;">${escapeHtml(s.code || s.line || '')}</code>
              <div style="color:var(--mist);margin-top:0.25rem;">${escapeHtml(s.explanation || s.desc || '')}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  if (!memTableHtml && !traceHtml) {
    container.innerHTML = `
      <div class="journey-card" style="border-left:4px solid var(--border);">
        <h2>📊 Visualization</h2>
        <p style="color:var(--mist);margin-top:1rem;">Memory models and execution traces are not required or available for this basic topic.</p>
        <div class="step-nav-footer" style="margin-top:2.5rem;display:flex;justify-content:space-between;border-top:1px solid var(--border);padding-top:1.5rem;">
          <button class="btn btn-secondary" onclick="switchTab('examples')">← Back to Examples</button>
          <button class="btn btn-primary" onclick="switchTab('practice')">Continue to Practice →</button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="journey-card" style="border-left:4px solid var(--accent);">
      <h2>📊 Visualization & Dry Run Trace</h2>
      <p style="font-size:13px;color:var(--mist);margin-bottom:1.5rem;">Study the RAM memory allocations and code execution steps of the compiler below.</p>
      <div style="margin-top:1rem;">
        ${memTableHtml ? `
          <div style="margin-bottom:1.5rem;">
            <h4 style="margin-bottom:0.5rem; font-size:14px; color:var(--frost);">🧠 System RAM / Memory State:</h4>
            ${memTableHtml}
          </div>
        ` : ''}
        ${traceHtml}
      </div>
      <div class="step-nav-footer" style="margin-top:2.5rem;display:flex;justify-content:space-between;border-top:1px solid var(--border);padding-top:1.5rem;">
        <button class="btn btn-secondary" onclick="switchTab('examples')">← Back to Examples</button>
        <button class="btn btn-primary" onclick="switchTab('practice')">Continue to Practice →</button>
      </div>
    </div>
  `;
}

function renderExamplesContainer(ui) {
  const container = document.getElementById('examplesContainer');
  if (!container) return;

  const b = ui.beginner || {};
  const im = ui.intermediate || {};
  const ex = ui.expert || {};

  const begEx = (b.examples || []);
  const intEx = (im.examples || []);
  const expEx = (ex.examples || []);

  let html = '<h2>💻 Code Examples Library</h2><p style="font-size:13px;color:var(--mist);margin-bottom:1.5rem;">Study these source code examples demonstrating beginner, intermediate, and expert level implementations of this concept.</p>';

  const renderSection = (title, examples, badgeClass) => {
    if (!examples || !examples.length) return '';
    return `
      <div style="margin-bottom:2rem;">
        <h3 style="display:flex;align-items:center;gap:0.5rem;">
          <span class="badge ${badgeClass}">${title}</span>
        </h3>
        <div style="display:flex;flex-direction:column;gap:1.5rem;margin-top:0.75rem;">
          ${examples.map(e => `
            <div style="background:var(--abyss-2);border:1px solid var(--border);border-radius:8px;padding:1rem;">
              <div style="font-weight:600;font-size:14px;color:var(--text);margin-bottom:0.5rem;">${escapeHtml(e.description || e.title || 'Implementation Pattern')}</div>
              <pre style="position:relative;"><button class="copy-btn" onclick="copyCode(this)">Copy</button><code>${escapeHtml(e.code || '')}</code></pre>
              ${e.explanation ? `<div style="font-size:12.5px;color:var(--mist);margin-top:0.75rem;line-height:1.6;border-top:1px dashed var(--border);padding-top:0.5rem;"><strong>💡 Breakdown:</strong> ${markdownToHtml(e.explanation)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  html += renderSection('Beginner Examples', begEx, 'badge-blue');
  html += renderSection('Intermediate Examples', intEx, 'badge-amber');
  html += renderSection('Expert Examples', expEx, 'badge-red');

  if (!begEx.length && !intEx.length && !expEx.length) {
    html += '<p style="color:var(--mist-dim);">No code examples available for this topic.</p>';
  }

  html += `
    <div class="step-nav-footer" style="margin-top:2.5rem;display:flex;justify-content:space-between;border-top:1px solid var(--border);padding-top:1.5rem;">
      <button class="btn btn-secondary" onclick="switchTab('learn')">← Back to Learn</button>
      <button class="btn btn-primary" onclick="switchTab('practice')">Continue to Practice →</button>
    </div>
  `;

  container.innerHTML = html;
}

function renderPracticeContainer(ui) {
  const container = document.getElementById('practiceContainer');
  if (!container) return;

  const p = ui.practice || {};
  let html = '<h2>💪 Practice Exercises</h2><p style="font-size:13px;color:var(--mist);margin-bottom:1.5rem;">Complete these coding exercises and challenges to solidify your understanding.</p>';

  const categories = [
    { key: 'easy', title: 'Easy Challenge', badge: 'badge-blue' },
    { key: 'medium', title: 'Medium Challenge', badge: 'badge-amber' },
    { key: 'hard', title: 'Hard Challenge', badge: 'badge-red' },
    { key: 'debugging', title: 'Debugging Exercise', badge: 'badge-purple' }
  ];

  categories.forEach(cat => {
    const ex = p[cat.key];
    if (!ex) return;
    
    const title = ex.title || cat.title;
    const desc = ex.description || ex.problem || '';
    if (!title && !desc) return;

    html += `
      <div style="background:var(--abyss-2);border:1px solid var(--border);border-radius:8px;padding:1.25rem;margin-bottom:1.5rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.5rem;">
          <h3 style="margin:0;font-size:14.5px;">${escapeHtml(title)}</h3>
          <span class="badge ${cat.badge}">${cat.title}</span>
        </div>
        <div style="font-size:13px;color:var(--mist);margin-bottom:1rem;">${markdownToHtml(desc)}</div>
        ${ex.starterCode || ex.code ? `
          <div style="margin-bottom:1rem;">
            <strong>Starter Code:</strong>
            <pre style="position:relative;margin-top:0.4rem;"><button class="copy-btn" onclick="copyCode(this)">Copy</button><code>${escapeHtml(ex.starterCode || ex.code)}</code></pre>
          </div>
        ` : ''}
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" onclick="openPracticeInLab('${cat.key}')">Solve in Coding Lab</button>
          ${ex.hint || (ex.hints && ex.hints[0]) ? `<button class="btn btn-secondary btn-sm" onclick="showPracticeHint('${cat.key}', '${escapeAttr(ex.hint || ex.hints[0])}')">View Hint</button>` : ''}
        </div>
      </div>
    `;
  });

  html += `
    <div class="step-nav-footer" style="margin-top:2.5rem;display:flex;justify-content:space-between;border-top:1px solid var(--border);padding-top:1.5rem;">
      <button class="btn btn-secondary" onclick="switchTab('examples')">← Back to Examples</button>
      <button class="btn btn-primary" onclick="switchTab('quiz')">Continue to Quiz →</button>
    </div>
  `;

  container.innerHTML = html;
}

window.openPracticeInLab = function(key) {
  const ex = currentLessonUI?.practice?.[key];
  if (!ex) return;
  const lang = currentLessonUI?.language || 'javascript';
  const code = ex.starterCode || ex.code || '';
  openCodingLab(lang, code);
};

window.showPracticeHint = function(key, hint) {
  showToast(`Hint: ${hint}`, 'info');
};

function renderSummaryContainer(ui) {
  const container = document.getElementById('summaryContainer');
  if (!container) return;

  const rv = ui.revision || {};
  let html = '<h2>📝 Topic Summary & Takeaways</h2>';

  if (rv.oneLineSummary) {
    html += `
      <div style="background:rgba(99,102,241,0.03);border-left:4px solid var(--accent);padding:1rem;border-radius:6px;margin-bottom:1.5rem;font-size:14px;color:var(--text);font-style:italic;">
        "${escapeHtml(rv.oneLineSummary)}"
      </div>
    `;
  }

  if (rv.summary) {
    html += `
      <div style="margin-bottom:1.5rem;">
        <h3>📌 Overview Summary</h3>
        <div style="font-size:13px;color:var(--mist);line-height:1.7;">${markdownToHtml(rv.summary)}</div>
      </div>
    `;
  }

  if (rv.keyTakeaways && rv.keyTakeaways.length) {
    html += `
      <div style="margin-bottom:1.5rem;background:var(--abyss-2);padding:1rem;border-radius:8px;border:1px solid var(--border);">
        <strong>💡 Key Takeaways:</strong>
        <ul style="margin:0.5rem 0 0 1.25rem;font-size:13px;color:var(--mist);line-height:1.7;">
          ${rv.keyTakeaways.map(k => `<li>${escapeHtml(k)}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (rv.preInterviewChecklist && rv.preInterviewChecklist.length) {
    html += `
      <div style="margin-bottom:1.5rem;background:var(--abyss-2);padding:1rem;border-radius:8px;border:1px solid var(--border);">
        <strong>🎯 Pre-Interview Checklist:</strong>
        <ul style="margin:0.5rem 0 0 1.25rem;font-size:13px;color:var(--mist);line-height:1.7;">
          ${rv.preInterviewChecklist.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  html += `
    <div class="step-nav-footer" style="margin-top:2.5rem;display:flex;justify-content:space-between;border-top:1px solid var(--border);padding-top:1.5rem;">
      <button class="btn btn-secondary" onclick="switchTab('interview')">← Back to Interview Prep</button>
      <button class="btn btn-primary" onclick="completeLesson()">Mark Lesson Complete ✓</button>
    </div>
  `;

  container.innerHTML = html;
}

// ── Sub-step Renderer: 1. Beginner Learn ──────────────────────
function renderBeginnerLearnStep(ui) {
  const container = document.getElementById('beginnerContainer');
  if (!container) return;

  const b = ui.beginner || {};

  const memHtml = (b.memoryDiagram && (b.memoryDiagram.rows || b.memoryDiagram.slots))
    ? renderV2MemoryTable(b.memoryDiagram)
    : (b.visualDiagram ? `<pre style="font-size:12px;overflow:auto;padding:0.75rem;background:var(--abyss);border:1px solid var(--border);border-radius:6px;">${escapeHtml(b.visualDiagram)}</pre>` : '');

  const beginnerExamples = (b.examples || []).filter(e => e && e.code);

  const rules = b.namingRules || [];
  const isObjectRules = typeof rules[0] === 'object';
  const namingTableHtml = rules.length ? `
    <table style="width:100%;border-collapse:collapse;font-size:13px;background:var(--abyss);border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-top:0.5rem;">
      <thead><tr style="background:var(--abyss-2);">
        <th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--mist-dim);">Rule</th>
        <th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--emerald);">✅ Good</th>
        <th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--rose);">❌ Bad</th>
        <th style="text-align:left;padding:8px 12px;border-bottom:1px solid var(--border);color:var(--mist-dim);">Why</th>
      </tr></thead>
      <tbody>${rules.map(r => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid var(--border);vertical-align:top;color:var(--text);font-weight:600;">${escapeHtml(r.rule||'')}</td>
          <td style="padding:8px 12px;border-bottom:1px solid var(--border);vertical-align:top;font-family:var(--font-mono);font-size:11.5px;color:var(--emerald);">${escapeHtml(r.good||'')}</td>
          <td style="padding:8px 12px;border-bottom:1px solid var(--border);vertical-align:top;font-family:var(--font-mono);font-size:11.5px;color:var(--rose);">${escapeHtml(r.bad||'')}</td>
          <td style="padding:8px 12px;border-bottom:1px solid var(--border);vertical-align:top;color:var(--mist);font-size:12px;">${escapeHtml(r.why||'')}</td>
        </tr>
      `).join('')}</tbody>
    </table>` : '';

  const mistakes = b.commonMistakes || [];
  const isObjectMistakes = typeof mistakes[0] === 'object';
  const mistakesHtml = mistakes.length ? mistakes.map(m => `
    <div class="mistake-comparison-grid" style="margin-bottom:1.25rem;margin-top:0.5rem;">
      <div style="font-weight:600;font-size:13.5px;margin-bottom:0.5rem;color:var(--text);">• ${escapeHtml(m.mistake||'')}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="comparison-card bad" style="border:1px solid rgba(244,63,94,0.2);background:rgba(244,63,94,0.02);border-radius:8px;padding:0.75rem;">
          <div class="card-header" style="color:var(--rose);font-weight:700;font-size:12px;margin-bottom:0.5rem;">❌ The Mistake</div>
          <div class="card-body">
            <pre style="margin:0;"><code class="lang-python">${escapeHtml(m.wrong||'')}</code></pre>
            ${m.error ? `<div style="font-size:11px;color:var(--rose);margin-top:0.4rem;font-family:var(--font-mono);">Error: ${escapeHtml(m.error)}</div>` : ''}
          </div>
        </div>
        <div class="comparison-card good" style="border:1px solid rgba(16,185,129,0.2);background:rgba(16,185,129,0.02);border-radius:8px;padding:0.75rem;">
          <div class="card-header" style="color:var(--emerald);font-weight:700;font-size:12px;margin-bottom:0.5rem;">✅ Correct Way</div>
          <div class="card-body">
            <pre style="margin:0;"><code class="lang-python">${escapeHtml(m.right||'')}</code></pre>
            <div class="card-desc" style="font-size:12px;color:var(--mist);margin-top:0.4rem;">${escapeHtml(m.why||'')}</div>
          </div>
        </div>
      </div>
    </div>
  `).join('') : '';

  container.innerHTML = `
    <div class="journey-card" style="border-left: 4px solid var(--accent);">
      <h2>👶 Beginner Learning</h2>

      ${b.curiosityQuestion ? `
        <div class="premium-callout callout-curiosity" style="margin-bottom:1.5rem;background:rgba(99,102,241,0.04);border:1px solid var(--border-accent);padding:1rem;border-radius:8px;">
          <div style="font-size:15px;line-height:1.7;color:var(--frost);font-weight:600;">🤔 Curiosity Hook: ${escapeHtml(b.curiosityQuestion)}</div>
        </div>` : ''}

      <div style="display:flex;flex-direction:column;gap:1.5rem;">
        <div>
          <h3>💡 What is a Variable?</h3>
          <div style="color:var(--mist);font-size:13.5px;line-height:1.7;margin-top:0.4rem;">
            ${b.simpleExplanation ? markdownToHtml(b.simpleExplanation) : ''}
          </div>
          ${b.realWorldAnalogy ? `
            <div class="premium-callout callout-info" style="margin-top:1rem;background:rgba(59,130,246,0.04);border-left:3px solid var(--blue);padding:0.75rem 1rem;border-radius:0 8px 8px 0;">
              <strong>🏷️ Analogy:</strong> ${markdownToHtml(b.realWorldAnalogy)}
            </div>` : ''}
        </div>

        ${b.whyExists || b.withoutVariables ? `
          <div>
            <h3>❓ Why do we need them?</h3>
            <div style="color:var(--mist);font-size:13.5px;line-height:1.7;margin-top:0.4rem;">
              ${b.whyExists ? markdownToHtml(b.whyExists) : ''}
            </div>
            ${b.withoutVariables ? `
              <details class="bts-collapsible" style="margin-top:0.75rem;">
                <summary class="bts-summary">📜 What code looked like before variables...</summary>
                <div class="bts-details-box">${markdownToHtml(b.withoutVariables)}</div>
              </details>` : ''}
          </div>` : ''}

        ${memHtml ? `
          <div>
            <h3>🧠 Visual RAM Model</h3>
            ${b.syntaxExplanation ? `<p style="font-size:13.5px;color:var(--mist);margin-bottom:0.75rem;margin-top:0.4rem;">${markdownToHtml(b.syntaxExplanation)}</p>` : ''}
            <div style="margin-top:0.75rem;">${memHtml}</div>
          </div>` : ''}

        ${beginnerExamples.length ? `
          <div>
            <h3>💻 Beginner Code Examples</h3>
            ${beginnerExamples.map(ex => renderV2Example(ex)).join('')}
          </div>` : ''}

        ${b.stepByStep && b.stepByStep.length ? `
          <div>
            <h3>🔍 Step-by-Step Tracing</h3>
            <div style="display:flex;flex-direction:column;gap:0.75rem;background:var(--abyss-2);padding:1rem;border-radius:8px;border:1px solid var(--border);margin-top:0.5rem;">
              ${b.stepByStep.map((s, i) => `
                <div style="display:grid;grid-template-columns:30px 1fr;gap:0.75rem;align-items:start;">
                  <div style="background:var(--accent);color:#000;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;margin-top:2px;">${s.step || i+1}</div>
                  <div>
                    <code style="display:block;background:var(--abyss);padding:0.4rem 0.6rem;border-radius:4px;font-size:12px;margin-bottom:0.4rem;color:var(--accent);">${escapeHtml(s.line || '')}</code>
                    <div style="font-size:13px;color:var(--mist);">${escapeHtml(s.desc || '')}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>` : ''}

        ${namingTableHtml ? `
          <div>
            <h3>📛 Naming Rules</h3>
            <div>${namingTableHtml}</div>
          </div>` : ''}

        ${mistakesHtml ? `
          <div>
            <h3>⚠️ Mistakes to Avoid</h3>
            <div>${mistakesHtml}</div>
          </div>` : ''}
      </div>

      <div class="step-nav-footer">
        <button class="btn btn-secondary" onclick="goToStepIndex(0)">← Back to Overview</button>
        <button class="btn btn-primary" onclick="goToStepIndex(2)">Continue to Practice →</button>
      </div>
    </div>
  `;
}

// ── Sub-step Renderer: 2. Practice (Beginner/Intermediate) ───
function renderPracticePage(ui, stepKey, levelLabel, backIndex, nextIndex) {
  const isBeginner = stepKey === 'beginner';
  const containerId = isBeginner ? 'beginnerContainer' : 'intermediateContainer';
  const container = document.getElementById(containerId);
  if (!container) return;

  const p = ui.practice || {};
  let exercises = [];
  if (isBeginner) {
    if (p.easy) exercises.push({ ...p.easy, label: '⭐ Easy Challenge' });
    if (p.medium) exercises.push({ ...p.medium, label: '⭐⭐ Medium Challenge' });
  } else {
    if (p.hard) exercises.push({ ...p.hard, label: '⭐⭐⭐ Hard Challenge' });
  }

  let contentHtml = '';
  if (!exercises.length) {
    contentHtml = '<p style="color:var(--mist);">Practice exercises coming soon for this section.</p>';
  } else {
    contentHtml = exercises.map((ex, i) => {
      const code = ex.starterCode || '';
      return `
        <div class="exercise-card" style="margin-bottom:1.5rem;background:var(--abyss-2);border:1px solid var(--border);border-radius:10px;padding:1.25rem;">
          <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;">
            <span style="font-weight:700;color:var(--mist-dim);font-size:12px;font-family:var(--font-mono);">#${i+1}</span>
            <div class="exercise-title" style="font-size:15px;font-weight:700;color:var(--frost);">${escapeHtml(ex.title || ex.label)}</div>
            <span class="badge badge-accent" style="margin-left:auto;">${ex.label}</span>
          </div>
          <div class="exercise-desc" style="color:var(--mist);font-size:13.5px;line-height:1.7;margin-bottom:0.75rem;">${markdownToHtml(ex.problem || ex.objective || '')}</div>
          
          ${Array.isArray(ex.hints) && ex.hints.length ? `
            <div class="ex-hint-box" id="step-hint-${stepKey}-${i}" style="display:none;font-size:12px;color:#fbbf24;background:rgba(251,191,36,0.06);padding:0.6rem;border-radius:6px;margin-bottom:0.75rem;">
              <strong>Hints:</strong><ul style="margin:0.3rem 0 0 1.25rem;">${ex.hints.map(h=>`<li>${escapeHtml(h)}</li>`).join('')}</ul>
            </div>` : ''}

          ${ex.solution ? `
            <div class="ex-sol-box" id="step-sol-${stepKey}-${i}" style="display:none;font-family:var(--font-mono);font-size:12px;color:var(--emerald);background:rgba(52,211,153,0.06);padding:0.6rem;border-radius:6px;margin-bottom:0.75rem;">
              <strong>Solution:</strong><br><pre style="margin:0.3rem 0 0;font-size:11px;">${escapeHtml(ex.solution)}</pre>
              ${ex.solutionExplanation ? `<div style="font-size:12px;color:var(--mist);margin-top:0.5rem;font-family:var(--font-body);">${escapeHtml(ex.solutionExplanation)}</div>` : ''}
            </div>` : ''}

          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.75rem;">
            ${ex.hints ? `<button class="btn btn-secondary btn-sm" onclick="toggleEl('step-hint-${stepKey}-${i}')">💡 Hints</button>` : ''}
            ${ex.solution ? `<button class="btn btn-secondary btn-sm" onclick="toggleEl('step-sol-${stepKey}-${i}')">📖 Solution</button>` : ''}
            ${code ? `<button class="btn btn-primary btn-sm" onclick="openCodingLab('${escapeAttr(ui.language||'python')}', decodeURIComponent('${encodeURIComponent(code)}'))">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6L2 12l6 6"/></svg>
              Practice in Coding Lab</button>` : ''}
          </div>
          ${ex.expectedOutput ? `<div style="font-size:12px;margin-top:0.75rem;padding:0.4rem 0.6rem;background:rgba(52,211,153,0.06);border-left:3px solid var(--emerald);border-radius:0 4px 4px 0;"><strong style="color:var(--emerald);">Expected Output:</strong><pre style="margin:0.25rem 0 0;font-size:11px;">${escapeHtml(ex.expectedOutput)}</pre></div>` : ''}
        </div>
      `;
    }).join('');
  }

  container.innerHTML = `
    <div class="journey-card" style="border-left: 4px solid var(--accent);">
      <h2>💪 ${levelLabel} Practice Exercises</h2>
      <p style="font-size:14px;color:var(--mist);margin-bottom:1.5rem;">Apply the concepts you just learned in the coding workspace. Try to write the solution code yourself first!</p>

      <div>${contentHtml}</div>

      <div class="step-nav-footer">
        <button class="btn btn-secondary" onclick="goToStepIndex(${backIndex})">← Back</button>
        <button class="btn btn-primary" onclick="goToStepIndex(${nextIndex})">Continue to Checkpoint Quiz →</button>
      </div>
    </div>
  `;
}

// ── Sub-step Renderer: 3. Checkpoint Quiz ────────────────────
function renderCheckpointPage(ui, stepKey, checkIdx, backIndex, nextIndex) {
  const isBeginner = stepKey === 'beginner';
  const containerId = isBeginner ? 'beginnerContainer' : 'intermediateContainer';
  const container = document.getElementById(containerId);
  if (!container) return;

  const checkpoints = ui.quiz?.checkpoints || [];
  const q = checkpoints[checkIdx];

  if (!q) {
    container.innerHTML = `
      <div class="journey-card" style="border-left: 4px solid var(--accent);">
        <h2>🧠 Checkpoint Quiz</h2>
        <p style="color:var(--mist);">No checkpoint question configured for this section.</p>
        <div class="step-nav-footer">
          <button class="btn btn-secondary" onclick="goToStepIndex(${backIndex})">← Back</button>
          <button class="btn btn-primary" onclick="goToStepIndex(${nextIndex})">Continue →</button>
        </div>
      </div>
    `;
    return;
  }

  const letters = ['A', 'B', 'C', 'D', 'E'];
  const options = Array.isArray(q.options) ? q.options : [];

  const stateKey = `checkpoint_${stepKey}_ans`;
  const isAnswered = window[stateKey] !== undefined;
  const chosenIdx = window[stateKey];

  const optsHtml = options.map((opt, oidx) => {
    let statusClass = '';
    if (isAnswered) {
      if (oidx === q.correct) statusClass = 'correct';
      else if (oidx === chosenIdx) statusClass = 'wrong';
    }
    return `
      <div class="checkpoint-option checkpoint-opt-btn ${statusClass} ${oidx === chosenIdx ? 'selected' : ''}" 
           data-oidx="${oidx}" data-stepkey="${stepKey}" data-correct="${q.correct}" data-nextindex="${nextIndex}">
        <div class="quiz-letter">${letters[oidx]}</div>
        <div>${escapeHtml(opt)}</div>
      </div>
    `;
  }).join('');

  const feedbackStyle = isAnswered ? 'display:block;' : 'display:none;';

  container.innerHTML = `
    <div class="journey-card" style="border-left: 4px solid var(--accent);">
      <h2>🧠 Checkpoint Quiz — Test Your Knowledge</h2>
      <p style="font-size:13.5px;color:var(--mist);margin-bottom:1.5rem;">Select the correct option to verify you understood the key concepts before continuing.</p>

      <div class="checkpoint-card-item" style="background:var(--abyss-2);border:1px solid var(--border);border-radius:10px;padding:1.5rem;margin-bottom:1.5rem;">
        <div class="checkpoint-question" style="font-size:15px;line-height:1.7;color:var(--frost);margin-bottom:1rem;">${escapeHtml(q.question)}</div>
        <div class="checkpoint-options" style="display:flex;flex-direction:column;gap:0.75rem;">
          ${optsHtml}
        </div>
        <div class="checkpoint-feedback" id="cp-feedback-step-${stepKey}" style="${feedbackStyle}margin-top:1rem;background:var(--abyss);padding:1rem;border-radius:8px;border-left:3px solid var(--accent);">
          <strong>Explanation:</strong> ${escapeHtml(q.explanation)}
        </div>
      </div>

      <div class="step-nav-footer">
        <button class="btn btn-secondary" onclick="goToStepIndex(${backIndex})">← Back</button>
        <button class="btn btn-primary" id="cp-continue-btn-${stepKey}" ${isAnswered ? '' : 'disabled'} onclick="goToStepIndex(${nextIndex})">
          ${isAnswered ? 'Continue →' : '🔒 Select Correct Answer to Continue'}
        </button>
      </div>
    </div>
  `;

  // Bind option clicks
  container.querySelectorAll('.checkpoint-opt-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (window[stateKey] !== undefined) return; // already answered
      const oidx = parseInt(this.dataset.oidx);
      const correct = parseInt(this.dataset.correct);

      window[stateKey] = oidx;

      // Update options UI
      container.querySelectorAll('.checkpoint-opt-btn').forEach((el, idx) => {
        if (idx === correct) el.classList.add('correct');
        else if (idx === oidx) el.classList.add('wrong');
      });

      // Show feedback
      const feedbackEl = document.getElementById(`cp-feedback-step-${stepKey}`);
      if (feedbackEl) feedbackEl.style.display = 'block';

      // Unlock button
      const continueBtn = document.getElementById(`cp-continue-btn-${stepKey}`);
      if (continueBtn) {
        continueBtn.removeAttribute('disabled');
        continueBtn.textContent = 'Continue →';
      }

      if (oidx === correct) {
        showToast('Correct! Well done.', 'success');
        addXP(10);
      } else {
        showToast('Incorrect. Try again next time!', 'error');
      }
    });
  });
}

// ── Sub-step Renderer: 4. Intermediate Learn ─────────────────
function renderIntermediateLearnStep(ui) {
  const container = document.getElementById('intermediateContainer');
  if (!container) return;

  const im = ui.intermediate || {};
  const imExamples = (im.examples || []).filter(e => e && e.code);

  const bestPracticesHtml = im.bestPractices && im.bestPractices.length ? im.bestPractices.map(bp => `
    <div style="border-left:3px solid var(--emerald);padding:0.6rem 1rem;margin-bottom:0.75rem;background:rgba(16,185,129,0.02);border-radius:0 6px 6px 0;font-size:13.5px;">
      <div style="font-weight:600;color:var(--snow);margin-bottom:0.25rem;">• ${escapeHtml(bp.rule || bp)}</div>
      ${bp.good ? `<code style="font-size:11.5px;color:var(--emerald);display:block;margin-bottom:0.25rem;">✅ Good: ${escapeHtml(bp.good)}</code>` : ''}
      ${bp.why ? `<div style="font-size:12px;color:var(--mist);">${escapeHtml(bp.why)}</div>` : ''}
    </div>
  `).join('') : '';

  const edgeCasesHtml = im.edgeCases && im.edgeCases.length ? im.edgeCases.map(ec => `
    <div style="background:var(--abyss);padding:1rem;border-radius:8px;border:1px solid var(--border);margin-bottom:1rem;font-size:13.5px;">
      <div style="font-weight:700;color:var(--amber);margin-bottom:0.5rem;">⚡ ${escapeHtml(ec.case || '')}</div>
      <pre style="margin:0 0 0.50rem;"><code class="lang-python">${escapeHtml(ec.code || '')}</code></pre>
      <div style="font-size:12.5px;color:var(--mist);line-height:1.6;">${markdownToHtml(ec.explanation || '')}</div>
    </div>
  `).join('') : '';

  container.innerHTML = `
    <div class="journey-card" style="border-left: 4px solid var(--accent);">
      <h2>⚙️ Intermediate Learning</h2>

      <div style="display:flex;flex-direction:column;gap:1.5rem;">
        <div>
          <h3>💡 Going Deeper</h3>
          <div style="color:var(--mist);font-size:13.5px;line-height:1.7;margin-top:0.4rem;">
            ${im.deeperExplanation ? markdownToHtml(im.deeperExplanation) : ''}
          </div>
        </div>

        ${im.mutability ? `
          <div>
            <h3>🔄 Mutable vs Immutable (Object Semantics)</h3>
            <div style="color:var(--mist);font-size:13.5px;line-height:1.7;margin-top:0.4rem;">
              ${markdownToHtml(im.mutability)}
            </div>
          </div>` : ''}

        ${im.noneValue ? `
          <div>
            <h3>🚫 None — The Absence of Value</h3>
            <div style="color:var(--mist);font-size:13.5px;line-height:1.7;margin-top:0.4rem;">
              ${markdownToHtml(im.noneValue)}
            </div>
          </div>` : ''}

        ${im.internalImplementation ? `
          <div>
            <h3>🔬 Under the Hood (CPython Internals)</h3>
            <div style="color:var(--mist);font-size:13.5px;line-height:1.7;margin-top:0.4rem;">
              ${markdownToHtml(im.internalImplementation)}
            </div>
          </div>` : ''}

        ${imExamples.length ? `
          <div>
            <h3>💻 Intermediate Examples</h3>
            ${imExamples.map(e => renderV2Example(e)).join('')}
          </div>` : ''}

        ${bestPracticesHtml ? `
          <div>
            <h3>✅ Best Practices</h3>
            <div style="margin-top:0.5rem;">${bestPracticesHtml}</div>
          </div>` : ''}

        ${edgeCasesHtml ? `
          <div>
            <h3>🔮 Edge Cases & Cache Details</h3>
            <div style="margin-top:0.5rem;">${edgeCasesHtml}</div>
          </div>` : ''}
      </div>

      <div class="step-nav-footer">
        <button class="btn btn-secondary" onclick="goToStepIndex(3)">← Back</button>
        <button class="btn btn-primary" onclick="goToStepIndex(5)">Continue to Practice →</button>
      </div>
    </div>
  `;
}

// ── Sub-step Renderer: 5. Expert Learn ───────────────────────
function renderExpertLearnStep(ui) {
  const container = document.getElementById('expertContainer');
  if (!container) return;

  const ex = ui.expert || {};
  const exExamples = (ex.examples || []).filter(e => e && e.code);

  const checklistHtml = ex.codeReviewChecklist && ex.codeReviewChecklist.length ? `
    <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:0.5rem;margin-top:0.5rem;">
      ${ex.codeReviewChecklist.map((item, i) => `
        <li style="display:flex;align-items:flex-start;gap:0.6rem;padding:0.6rem 0.85rem;background:var(--abyss);border:1px solid var(--border);border-radius:8px;font-size:13px;color:var(--mist);">
          <span style="color:var(--emerald);font-weight:700;">${i+1}.</span>
          <span>${escapeHtml(item)}</span>
        </li>
      `).join('')}
    </ul>` : '';

  const securityHtml = ex.securityConsiderations && ex.securityConsiderations.length ? ex.securityConsiderations.map(s => `
    <div style="border-left:3px solid var(--rose);padding:0.6rem 1rem;margin-bottom:0.75rem;background:rgba(244,63,94,0.02);border-radius:0 6px 6px 0;font-size:13px;margin-top:0.5rem;">
      <div style="font-weight:600;color:var(--rose);margin-bottom:0.25rem;">⚠️ Risk: ${escapeHtml(s.risk || s)}</div>
      ${s.bad ? `<code style="font-size:11.5px;color:var(--rose);display:block;margin-bottom:0.25rem;">❌ Bad: ${escapeHtml(s.bad)}</code>` : ''}
      ${s.good ? `<code style="font-size:11.5px;color:var(--emerald);display:block;margin-bottom:0.25rem;">✅ Good: ${escapeHtml(s.good)}</code>` : ''}
      ${s.why ? `<div style="color:var(--mist);margin-top:0.25rem;">${escapeHtml(s.why)}</div>` : ''}
    </div>
  `).join('') : '';

  container.innerHTML = `
    <div class="journey-card" style="border-left: 4px solid var(--accent);">
      <h2>🚀 Expert Learning</h2>

      <div style="display:flex;flex-direction:column;gap:1.5rem;">
        <div>
          <h3>💡 Production Architecture</h3>
          <div style="color:var(--mist);font-size:13.5px;line-height:1.7;margin-top:0.4rem;">
            ${ex.overview ? markdownToHtml(ex.overview) : ''}
          </div>
          ${ex.industryContext ? `
            <div class="premium-callout callout-info" style="margin-top:1rem;background:rgba(139,92,246,0.04);border-left:3px solid var(--purple);padding:0.75rem 1rem;border-radius:0 8px 8px 0;">
              <strong>🏢 Industry Context:</strong> ${markdownToHtml(ex.industryContext)}
            </div>` : ''}
        </div>

        ${ex.testingPatterns && (ex.testingPatterns.objective || ex.testingPatterns.code) ? `
          <div>
            <h3>🧪 Testing Variables & Configurations</h3>
            <p style="font-size:13.5px;color:var(--mist);margin-bottom:0.5rem;margin-top:0.4rem;">${escapeHtml(ex.testingPatterns.objective || '')}</p>
            <pre style="margin-top:0.4rem;"><code>${escapeHtml(ex.testingPatterns.code || '')}</code></pre>
          </div>` : ''}

        ${ex.refactoringGuide && (ex.refactoringGuide.before || ex.refactoringGuide.after) ? `
          <div>
            <h3>🔧 Refactoring: Globals to Pure Scopes</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:0.5rem;">
              <div style="border:1px solid rgba(244,63,94,0.15);padding:0.75rem;border-radius:8px;background:rgba(244,63,94,0.01);">
                <strong style="color:var(--rose);font-size:12px;">❌ Before Refactoring</strong>
                <pre style="margin:0.25rem 0 0;"><code>${escapeHtml(ex.refactoringGuide.before || '')}</code></pre>
              </div>
              <div style="border:1px solid rgba(16,185,129,0.15);padding:0.75rem;border-radius:8px;background:rgba(16,185,129,0.01);">
                <strong style="color:var(--emerald);font-size:12px;">✅ After Refactoring</strong>
                <pre style="margin:0.25rem 0 0;"><code>${escapeHtml(ex.refactoringGuide.after || '')}</code></pre>
              </div>
            </div>
            ${ex.refactoringGuide.explanation ? `<p style="font-size:12.5px;color:var(--mist);margin-top:0.5rem;">${escapeHtml(ex.refactoringGuide.explanation)}</p>` : ''}
          </div>` : ''}

        ${exExamples.length ? `
          <div>
            <h3>💻 Expert Examples</h3>
            ${exExamples.map(e => renderV2Example(e)).join('')}
          </div>` : ''}

        ${checklistHtml ? `
          <div>
            <h3>👁️ Code Review Checklist</h3>
            <div>${checklistHtml}</div>
          </div>` : ''}

        ${securityHtml ? `
          <div>
            <h3>🔐 Security & Scopes</h3>
            <div>${securityHtml}</div>
          </div>` : ''}
      </div>

      <div class="step-nav-footer">
        <button class="btn btn-secondary" onclick="goToStepIndex(6)">← Back</button>
        <button class="btn btn-primary" onclick="goToStepIndex(8)">Continue to Debugging →</button>
      </div>
    </div>
  `;
}

// ── Sub-step Renderer: 6. Expert Debugging ───────────────────
function renderDebuggingPage(ui) {
  const container = document.getElementById('debuggingContainer');
  if (!container) return;

  const p = ui.practice || {};
  const dbg = p.debugging || {};
  const im = ui.intermediate || {};
  const dw = im.debuggingWalkthrough || {};

  container.innerHTML = `
    <div class="journey-card" style="border-left: 4px solid var(--accent);">
      <h2>🐛 Debugging Challenges</h2>

      <div style="display:flex;flex-direction:column;gap:1.5rem;">
        ${dbg.problem || dbg.title ? `
          <div>
            <h3>🔍 Logical Debugging Challenge</h3>
            <div style="font-size:14px;color:var(--mist);margin-bottom:0.75rem;margin-top:0.4rem;">${markdownToHtml(dbg.problem || '')}</div>
            
            <div class="comparison-card bad" style="border:1px solid rgba(244,63,94,0.15);padding:1rem;border-radius:8px;background:rgba(244,63,94,0.01);margin-bottom:0.75rem;">
              <strong style="color:var(--rose);font-size:12.5px;">❌ Broken Code:</strong>
              <pre style="margin-top:0.4rem;"><code>${escapeHtml(dbg.brokenCode || '')}</code></pre>
            </div>

            <div style="display:flex;gap:0.5rem;">
              <button class="btn btn-secondary btn-sm" onclick="toggleEl('dbg-sol-box')">📖 Reveal Solution Bugs</button>
              ${dbg.brokenCode ? `<button class="btn btn-primary btn-sm" onclick="openCodingLab('${escapeAttr(ui.language||'python')}', decodeURIComponent('${encodeURIComponent(dbg.brokenCode)}'))">🧪 Open in Lab</button>` : ''}
            </div>

            <div class="exercise-sol-toggle" id="dbg-sol-box" style="display:none;margin-top:0.75rem;">
              <strong>Bugs & Fixes:</strong>
              <ol style="margin:0.5rem 0 0 1.25rem;font-size:13px;color:var(--mist);line-height:1.75;">
                ${(dbg.bugs || []).map(b => {
                  if (typeof b === 'object') return `<li><strong>Line ${b.line}</strong>: ${escapeHtml(b.bug)} → <span style="color:var(--emerald);">${escapeHtml(b.fix)}</span></li>`;
                  return `<li>${escapeHtml(b)}</li>`;
                }).join('')}
              </ol>
            </div>
          </div>` : ''}

        ${dw.bugDescription ? `
          <div>
            <h3>🔍 Scope & Assignment Bug Walkthrough</h3>
            <div style="font-weight:600;font-size:13.5px;color:#fbbf24;margin-bottom:0.5rem;margin-top:0.4rem;">Bug: ${escapeHtml(dw.bugDescription)}</div>
            ${dw.scenario ? `<p style="font-size:13.5px;color:var(--mist);margin-bottom:0.5rem;">${markdownToHtml(dw.scenario)}</p>` : ''}
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:0.5rem;">
              <div style="border:1px solid rgba(244,63,94,0.15);padding:0.75rem;border-radius:8px;background:rgba(244,63,94,0.01);">
                <strong style="color:var(--rose);font-size:12px;">❌ Incorrect Code</strong>
                <pre style="margin:0.25rem 0 0;"><code>${escapeHtml(dw.incorrectCode || '')}</code></pre>
                ${dw.errorMessage ? `<div style="font-size:11px;color:var(--rose);margin-top:0.4rem;font-family:var(--font-mono);">${escapeHtml(dw.errorMessage)}</div>` : ''}
              </div>
              <div style="border:1px solid rgba(16,185,129,0.15);padding:0.75rem;border-radius:8px;background:rgba(16,185,129,0.01);">
                <strong style="color:var(--emerald);font-size:12px;">✅ Correct Code</strong>
                <pre style="margin:0.25rem 0 0;"><code>${escapeHtml(dw.correctCode || '')}</code></pre>
              </div>
            </div>
            ${dw.whyItHappens ? `<div style="font-size:13px;color:var(--mist);margin-top:0.5rem;line-height:1.75;">${markdownToHtml(dw.whyItHappens)}</div>` : ''}
          </div>` : ''}
      </div>

      <div class="step-nav-footer">
        <button class="btn btn-secondary" onclick="goToStepIndex(7)">← Back</button>
        <button class="btn btn-primary" onclick="goToStepIndex(9)">Continue to Mini Project →</button>
      </div>
    </div>
  `;
}

// ── Sub-step Renderer: 7. Expert Project ─────────────────────
function renderProjectPage(ui) {
  const container = document.getElementById('projectContainer');
  if (!container) return;

  const pr = ui.project || {};

  container.innerHTML = `
    <div class="journey-card" style="border-left: 4px solid var(--accent);">
      <h2>🛠️ Module Mini Project</h2>
      <p style="font-size:14px;color:var(--mist);margin-bottom:1.5rem;">Synthesize everything you've learned in this module to build a fully functional application.</p>

      <div class="exercise-card" style="border:1px solid var(--purple);background:rgba(168,85,247,0.01);border-radius:10px;padding:1.5rem;margin-bottom:1.5rem;">
        <div style="margin-bottom:0.75rem;">
          <div style="font-size:17px;font-weight:800;color:var(--frost);">${escapeHtml(pr.title || 'Mini Project')}</div>
          ${pr.tagline ? `<div style="font-size:13px;color:var(--accent);margin-top:0.25rem;">${escapeHtml(pr.tagline)}</div>` : ''}
        </div>
        
        ${pr.description ? `<div style="color:var(--mist);font-size:13.5px;line-height:1.7;margin-bottom:1rem;">${markdownToHtml(pr.description)}</div>` : ''}

        ${Array.isArray(pr.learningGoals) && pr.learningGoals.length ? `
          <div style="margin-bottom:1rem;">
            <strong>🎯 Learning Goals:</strong>
            <ul style="list-style:disc;padding-left:1.25rem;margin-top:0.4rem;color:var(--mist);font-size:13px;line-height:1.7;">
              ${pr.learningGoals.map(g => `<li>${escapeHtml(g)}</li>`).join('')}
            </ul>
          </div>` : ''}

        ${Array.isArray(pr.requirements) && pr.requirements.length ? `
          <div style="margin-bottom:1rem;">
            <strong>📋 Requirements Checklist:</strong>
            <ul style="list-style:none;padding-left:0;margin-top:0.4rem;color:var(--mist);font-size:13px;line-height:1.8;">
              ${pr.requirements.map(r => `<li>☐ ${escapeHtml(r)}</li>`).join('')}
            </ul>
          </div>` : ''}

        ${pr.starterCode ? `
          <div style="margin-bottom:1rem;">
            <strong>📦 Starter Code Skeleton:</strong>
            <pre style="margin-top:0.4rem;"><button class="copy-btn" onclick="copyCode(this)">Copy</button><code class="lang-python">${escapeHtml(pr.starterCode)}</code></pre>
          </div>` : ''}

        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:1rem;">
          ${pr.starterCode ? `<button class="btn btn-secondary" onclick="openCodingLab('${escapeAttr(ui.language||'python')}', decodeURIComponent('${encodeURIComponent(pr.starterCode)}'))">🧪 Open Starter in Lab</button>` : ''}
          ${pr.solution ? `<button class="btn btn-secondary" onclick="toggleEl('proj-sol-toggle-box')">📖 View Solution Code</button>` : ''}
        </div>

        <div id="proj-sol-toggle-box" style="display:none;margin-top:1rem;border-top:1px solid var(--border);padding-top:1rem;">
          <strong>✅ Reference Solution:</strong>
          <pre style="margin-top:0.4rem;"><code class="lang-python">${escapeHtml(pr.solution || '')}</code></pre>
          ${pr.solutionExpl ? `<div style="font-size:13px;color:var(--mist);margin-top:0.5rem;line-height:1.7;">${markdownToHtml(pr.solutionExpl)}</div>` : ''}
        </div>

        ${pr.expectedOutput ? `
          <div style="font-size:12.5px;margin-top:1rem;padding:0.6rem 0.85rem;background:rgba(16,185,129,0.06);border-left:3px solid var(--emerald);border-radius:0 6px 6px 0;">
            <strong style="color:var(--emerald);">Expected Output:</strong>
            <pre style="margin-top:0.25rem;font-size:11px;">${escapeHtml(pr.expectedOutput)}</pre>
          </div>` : ''}

        ${Array.isArray(pr.extensions) && pr.extensions.length ? `
          <details class="bts-collapsible" style="margin-top:1rem;">
            <summary class="bts-summary">🚀 Extension Challenges (Level Up)</summary>
            <div class="bts-details-box">
              <ol style="padding-left:1.25rem;line-height:1.8;">
                ${pr.extensions.map(e => `<li style="color:var(--mist);">${escapeHtml(e)}</li>`).join('')}
              </ol>
            </div>
          </details>` : ''}
      </div>

      <div class="step-nav-footer">
        <button class="btn btn-secondary" onclick="goToStepIndex(8)">← Back</button>
        <button class="btn btn-primary" onclick="goToStepIndex(10)">Continue to Final Assessment →</button>
      </div>
    </div>
  `;
}

// ── Sub-step Renderer: 8. Final Assessment Quiz ─────────────
function renderFinalAssessment(ui) {
  const container = document.getElementById('assessmentContainer');
  if (!container) return;

  const mcqs = ui.quiz?.mcqs || [];

  if (!mcqs.length) {
    container.innerHTML = `
      <p style="color:var(--mist);">Final assessment questions coming soon.</p>
      <div class="step-nav-footer">
        <button class="btn btn-secondary" onclick="goToStepIndex(9)">← Back</button>
        <button class="btn btn-primary" onclick="goToStepIndex(11)">Continue →</button>
      </div>
    `;
    return;
  }

  const stateQuizAnswersKey = `final_quiz_answers`;
  const stateQuizCompletedKey = `final_quiz_completed`;
  const stateActiveQuestionKey = `final_quiz_active_q`;

  if (window[stateActiveQuestionKey] === undefined) {
    window[stateActiveQuestionKey] = 0;
  }
  if (window[stateQuizAnswersKey] === undefined) {
    window[stateQuizAnswersKey] = {};
  }
  if (window[stateQuizCompletedKey] === undefined) {
    window[stateQuizCompletedKey] = false;
  }

  const activeIdx = window[stateActiveQuestionKey];
  const q = mcqs[activeIdx];
  const total = mcqs.length;

  if (window[stateQuizCompletedKey]) {
    let correctCount = 0;
    mcqs.forEach((item, qi) => {
      const selected = window[stateQuizAnswersKey][qi];
      const correctAns = String(item.answer).toUpperCase();
      if (selected === correctAns) correctCount++;
    });

    const pct = Math.round((correctCount / total) * 100);
    const color = pct >= 80 ? 'var(--emerald)' : pct >= 60 ? '#fbbf24' : '#ef4444';

    container.innerHTML = `
      <div style="text-align:center;padding:2rem 1rem;">
        <div style="font-size:3.5rem;margin-bottom:0.75rem;">🏆</div>
        <h2 style="color:${color};font-size:24px;margin-bottom:0.5rem;">Assessment Complete: ${pct}%</h2>
        <p style="font-size:14.5px;color:var(--mist);max-width:500px;margin:0 auto 1.5rem;">
          You answered <strong>${correctCount}</strong> out of <strong>${total}</strong> questions correctly.
          ${pct >= 70 ? '🎉 Excellent! You have verified your mastery of this module.' : '⚠️ Take a moment to review the cheatsheet and mistakes before retrying.'}
        </p>

        <div style="display:flex;gap:0.75rem;justify-content:center;">
          <button class="btn btn-secondary" id="retry-assessment-btn">🔄 Retry Assessment</button>
          <button class="btn btn-primary" onclick="goToStepIndex(11)">Continue to Cheat Sheet →</button>
        </div>
      </div>
    `;

    document.getElementById('retry-assessment-btn')?.addEventListener('click', () => {
      window[stateQuizAnswersKey] = {};
      window[stateQuizCompletedKey] = false;
      window[stateActiveQuestionKey] = 0;
      renderFinalAssessment(ui);
    });
    return;
  }

  const letters = ['A', 'B', 'C', 'D', 'E'];
  const options = Array.isArray(q.options) ? q.options : [];
  const selectedAns = window[stateQuizAnswersKey][activeIdx];
  const isSubmitted = selectedAns !== undefined;

  const correctAnsLetter = String(q.answer).toUpperCase();

  const optsHtml = options.map((opt, oidx) => {
    const letter = letters[oidx];
    let statusClass = '';
    if (isSubmitted) {
      if (letter === correctAnsLetter) statusClass = 'correct';
      else if (letter === selectedAns) statusClass = 'wrong';
    }
    return `
      <div class="quiz-option final-assessment-opt-btn ${statusClass} ${letter === selectedAns ? 'selected' : ''}" 
           data-letter="${letter}">
        <div class="quiz-letter">${letter}</div>
        <div>${markdownToHtml(opt)}</div>
      </div>
    `;
  }).join('');

  const feedbackStyle = isSubmitted ? 'display:block;' : 'display:none;';

  container.innerHTML = `
    <div style="background:var(--abyss-2);border:1px solid var(--border);border-radius:10px;padding:1.5rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--mist-dim);margin-bottom:1rem;">
        <span>Final Assessment MCQ</span>
        <span>Question ${activeIdx + 1} of ${total}</span>
      </div>

      <div class="progress-bar" style="height:6px;margin-bottom:1.5rem;">
        <div class="progress-fill" style="width:${((activeIdx + 1) / total) * 100}%;"></div>
      </div>

      <div class="quiz-question-item">
        <div class="quiz-q-text" style="font-size:15px;color:var(--frost);line-height:1.7;margin-bottom:1rem;">${markdownToHtml(q.question)}</div>
        ${q.level ? `<div style="font-size:11px;color:var(--mist-dim);margin-bottom:0.5rem;font-family:var(--font-mono);">Complexity Level: ${escapeHtml(q.level)}</div>` : ''}
        <div class="quiz-options" style="display:flex;flex-direction:column;gap:0.75rem;">
          ${optsHtml}
        </div>
        <div class="quiz-explanation" id="assessment-q-feedback" style="${feedbackStyle}margin-top:1rem;background:var(--abyss);padding:1rem;border-radius:8px;border-left:3px solid var(--emerald);">
          <strong>Explanation:</strong> ${markdownToHtml(q.explanation || '')}
        </div>
      </div>

      <div style="margin-top:1.5rem;display:flex;justify-content:space-between;align-items:center;">
        <button class="btn btn-secondary btn-sm" id="assessment-prev-q-btn" ${activeIdx === 0 ? 'disabled' : ''}>← Prev Question</button>
        ${isSubmitted ? `
          <button class="btn btn-primary btn-sm" id="assessment-next-q-btn">
            ${activeIdx === total - 1 ? 'Finish Assessment ✓' : 'Next Question →'}
          </button>
        ` : `
          <button class="btn btn-primary btn-sm" id="assessment-submit-q-btn" disabled>🔒 Select Answer</button>
        `}
      </div>
    </div>
  `;

  // Bind option click
  container.querySelectorAll('.final-assessment-opt-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (isSubmitted) return; // already answered
      const letter = this.dataset.letter;

      container.querySelectorAll('.final-assessment-opt-btn').forEach(el => el.classList.remove('selected'));
      this.classList.add('selected');

      const submitBtn = document.getElementById('assessment-submit-q-btn');
      if (submitBtn) {
        submitBtn.removeAttribute('disabled');
        submitBtn.textContent = 'Submit Answer';
        submitBtn.onclick = () => {
          window[stateQuizAnswersKey][activeIdx] = letter;
          renderFinalAssessment(ui);
        };
      }
    });
  });

  // Prev / Next button listeners
  document.getElementById('assessment-prev-q-btn')?.addEventListener('click', () => {
    if (window[stateActiveQuestionKey] > 0) {
      window[stateActiveQuestionKey]--;
      renderFinalAssessment(ui);
    }
  });

  document.getElementById('assessment-next-q-btn')?.addEventListener('click', () => {
    if (activeIdx === total - 1) {
      window[stateQuizCompletedKey] = true;
      let score = 0;
      mcqs.forEach((item, qi) => {
        if (window[stateQuizAnswersKey][qi] === String(item.answer).toUpperCase()) score++;
      });
      const pct = Math.round((score / total) * 100);
      if (pct >= 60) addXP(100);
      renderFinalAssessment(ui);
    } else {
      window[stateActiveQuestionKey]++;
      renderFinalAssessment(ui);
    }
  });
}

// ── Sub-step Renderer: 9. Cheat Sheet ────────────────────────
function renderCheatSheet(ui) {
  const container = document.getElementById('cheatsheetContainer');
  if (!container) return;

  const cs = ui.cheatsheet || {};
  let sections = cs.sections || [];

  if (!sections.length && (cs.syntax || cs.quickExamples || cs.quickRevision)) {
    sections = [{
      heading: 'General Syntax Reference',
      entries: [{
        syntax: typeof cs.syntax === 'string' ? (cs.syntax.split('\n')[0] || '// Syntax') : '// Syntax',
        example: typeof cs.quickExamples === 'string' ? cs.quickExamples : 'Example snippet',
        description: cs.quickRevision || 'Quick Reference Guide',
        commonMistake: Array.isArray(cs.commonErrors) && cs.commonErrors[0] ? cs.commonErrors[0].description : ''
      }]
    }];
  }

  const stateSearchKey = `cheatsheet_search_query`;
  const searchQuery = (window[stateSearchKey] || '').toLowerCase().trim();
  let filteredSections = sections;
  if (searchQuery) {
    filteredSections = sections.map(s => {
      const entries = s.entries.filter(e => 
        e.syntax.toLowerCase().includes(searchQuery) ||
        e.example.toLowerCase().includes(searchQuery) ||
        e.description.toLowerCase().includes(searchQuery) ||
        (e.commonMistake || '').toLowerCase().includes(searchQuery)
      );
      return { ...s, entries };
    }).filter(s => s.entries.length > 0);
  }

  const sectionsHtml = filteredSections.map((s, si) => `
    <div style="background:var(--abyss-2);border:1px solid var(--border);border-radius:10px;padding:1.25rem;margin-bottom:1.5rem;">
      <h3 style="color:var(--frost);font-size:15px;margin-bottom:0.75rem;border-bottom:1px solid var(--border);padding-bottom:0.4rem;">${escapeHtml(s.heading)}</h3>
      <div style="display:flex;flex-direction:column;gap:1rem;">
        ${s.entries.map((e, ei) => `
          <div style="border-bottom:1px solid rgba(255,255,255,0.02);padding-bottom:0.75rem;font-size:13.5px;">
            <div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.35rem;">
              <code style="color:var(--accent);font-weight:700;">${escapeHtml(e.syntax)}</code>
              <code style="color:var(--emerald);font-size:12px;background:var(--abyss);padding:2px 6px;border-radius:4px;">${escapeHtml(e.example)}</code>
            </div>
            <div style="color:var(--mist);font-size:13px;line-height:1.6;">${escapeHtml(e.description)}</div>
            ${e.commonMistake ? `<div style="font-size:11.5px;color:var(--rose);margin-top:0.25rem;font-family:var(--font-mono);">⚠️ Mistake: ${escapeHtml(e.commonMistake)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="journey-card" style="border-left: 4px solid var(--accent);">
      <h2>📋 Quick Cheat Sheet Reference</h2>
      <p style="font-size:14px;color:var(--mist);margin-bottom:1.5rem;">${escapeHtml(cs.printNote || 'Print this cheat sheet or use the search bar to locate specific variables syntax.')}</p>

      <div style="margin-bottom:1.5rem;display:flex;gap:0.5rem;">
        <input type="text" id="cs-search-input" value="${escapeHtml(window[stateSearchKey] || '')}" style="flex:1;background:var(--abyss-2);border:1px solid var(--border);border-radius:6px;color:#fff;padding:0.6rem;font-size:13px;" placeholder="Search cheat sheet syntax, keywords, or examples...">
        <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ PDF / Print</button>
      </div>

      <div id="cs-list-container">
        ${sectionsHtml || '<p style="color:var(--mist);text-align:center;padding:2rem;">No matching cheat sheet syntax found.</p>'}
      </div>

      <div class="step-nav-footer">
        <button class="btn btn-secondary" onclick="goToStepIndex(10)">← Back</button>
        <button class="btn btn-primary" onclick="goToStepIndex(12)">Continue to Interview Prep →</button>
      </div>
    </div>
  `;

  const searchInput = document.getElementById('cs-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      window[stateSearchKey] = this.value;
      renderCheatSheet(ui);
      const val = this.value;
      this.value = '';
      this.value = val;
      this.focus();
    });
  }
}

// ── Sub-step Renderer: 10. Interview Prep ────────────────────
function renderInterview(ui) {
  const container = document.getElementById('interviewContainer');
  if (!container) return;

  const iv = ui.interview || {};
  const questions = iv.questions || [];

  const qaHtml = questions.map((q, qi) => {
    const diffColor = (q.level || 'beginner').toLowerCase() === 'beginner' 
      ? 'badge-green' 
      : (q.level || 'beginner').toLowerCase() === 'intermediate' 
        ? 'badge-blue' 
        : 'badge-accent';

    const detailStateKey = `interview_detail_${qi}_open`;
    const isOpen = window[detailStateKey] === true;

    return `
      <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:1rem;background:var(--abyss-2);">
        <div onclick="toggleInterviewQ(${qi})" style="padding:0.85rem 1.25rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;user-select:none;font-weight:600;font-size:14px;color:var(--frost);">
          <span><span style="color:var(--accent);margin-right:0.4rem;">Q${qi+1}.</span>${escapeHtml(q.question)}</span>
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <span class="badge ${diffColor}" style="font-size:9px;padding:2px 6px;">${escapeHtml(q.level || 'Beginner')}</span>
            <span style="font-size:11px;color:var(--mist-dim);">${isOpen ? '▼' : '►'}</span>
          </div>
        </div>
        <div id="interview-ans-${qi}" style="display:${isOpen ? 'block' : 'none'};padding:1rem 1.25rem;border-top:1px solid var(--border);background:var(--abyss);font-size:13.5px;color:var(--mist);line-height:1.75;">
          ${markdownToHtml(q.fullAnswer || q.answer || q.shortAnswer || '')}
          ${q.followUp ? `
            <div class="premium-callout callout-info" style="margin-top:0.75rem;background:rgba(59,130,246,0.03);border-left:3px solid var(--blue);padding:0.75rem;border-radius:0 6px 6px 0;">
              <strong>🤔 Follow-up Question:</strong> ${escapeHtml(q.followUp)}
              <div style="margin-top:0.25rem;color:var(--mist-dim);font-size:12.5px;">${escapeHtml(q.followUpAnswer || '')}</div>
            </div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="journey-card" style="border-left: 4px solid var(--accent);">
      <h2>🎯 Technical Interview Prep</h2>
      <p style="font-size:14px;color:var(--mist);margin-bottom:1.5rem;">Prepare for common company technical screening questions categorized by difficulty levels. Click any question card to reveal answers.</p>

      <div style="margin-top:1rem;">
        ${qaHtml || '<p style="color:var(--mist);">Interview prep questions coming soon.</p>'}
      </div>

      <div class="step-nav-footer">
        <button class="btn btn-secondary" onclick="goToStepIndex(11)">← Back</button>
        <button class="btn btn-primary" onclick="goToStepIndex(13)">Continue to Revision Notes →</button>
      </div>
    </div>
  `;
}

window.toggleInterviewQ = function(qi) {
  const key = `interview_detail_${qi}_open`;
  window[key] = !window[key];
  if (currentLessonUI) {
    renderInterview(currentLessonUI);
  }
};

// ── Sub-step Renderer: 11. Revision Notes ────────────────────
function renderRevision(ui) {
  const container = document.getElementById('revisionContainer');
  if (!container) return;

  const rv = ui.revision || {};
  const activeStep = STEPS[activeStepIndex];

  if (activeStep.id === 'revision') {
    const takeawaysHtml = rv.keyTakeaways && rv.keyTakeaways.length ? rv.keyTakeaways.map(t => {
      const p = typeof t === 'object' ? t.point : String(t);
      const why = typeof t === 'object' ? t.why : null;
      return `
        <li style="padding:0.6rem 0.85rem;background:var(--abyss-2);border:1px solid var(--border);border-radius:8px;font-size:13.5px;color:var(--frost);margin-bottom:0.5rem;line-height:1.65;">
          <span style="color:var(--accent);font-weight:700;">→</span> ${markdownToHtml(p)}
          ${why ? `<div style="font-size:11.5px;color:var(--mist-dim);margin-top:0.3rem;">• Why: ${escapeHtml(why)}</div>` : ''}
        </li>
      `;
    }).join('') : '';

    const tricksHtml = rv.memoryTricks && rv.memoryTricks.length ? rv.memoryTricks.map(t => `
      <div style="margin-bottom:0.75rem;font-size:13px;line-height:1.7;">
        <strong style="color:var(--accent);">• ${escapeHtml(t.concept || '')}</strong>
        <div style="color:var(--frost);font-family:var(--font-mono);font-size:11.5px;background:var(--abyss);padding:4px 8px;border-radius:4px;display:inline-block;margin:2px 0;">Mnemonic: ${escapeHtml(t.trick || '')}</div>
      </div>
    `).join('') : '';

    const preCheckHtml = rv.preInterviewChecklist && rv.preInterviewChecklist.length ? `
      <ul style="list-style:none;padding:0;font-size:13px;line-height:1.8;color:var(--mist);margin-top:0.5rem;">
        ${rv.preInterviewChecklist.map(c => `<li>☐ ${escapeHtml(c)}</li>`).join('')}
      </ul>` : '';

    const commonErrorsHtml = rv.commonErrors && rv.commonErrors.length ? rv.commonErrors.map(e => {
      if (typeof e === 'object') {
        return `
          <div style="margin-bottom:0.75rem;font-size:13px;line-height:1.7;">
            <code style="color:var(--rose);font-weight:700;">${escapeHtml(e.error || '')}</code>
            <div style="color:var(--mist);margin-top:0.15rem;">Cause: ${escapeHtml(e.cause || '')}</div>
            <div style="color:var(--emerald);font-size:12.5px;">Fix: ${escapeHtml(e.fix || '')}</div>
          </div>
        `;
      }
      return `<div>${escapeHtml(e)}</div>`;
    }).join('') : '';

    const nextTopicsHtml = rv.nextTopics && rv.nextTopics.length ? rv.nextTopics.map(t => `
      <div style="background:var(--abyss-2);padding:0.75rem 1rem;border-radius:8px;border:1px solid var(--border);margin-bottom:0.5rem;font-size:13px;">
        <strong style="color:var(--accent);">${escapeHtml(t.title || '')}</strong>
        <div style="color:var(--mist);font-size:12.5px;margin-top:0.2rem;">${escapeHtml(t.whyNext || '')}</div>
      </div>
    `).join('') : '';

    container.innerHTML = `
      <div class="journey-card" style="border-left: 4px solid var(--accent);">
        <h2>📝 Revision Notes & Key Summary</h2>
        
        ${rv.oneLineSummary ? `
          <div class="premium-callout callout-curiosity" style="margin-bottom:1.5rem;background:rgba(99,102,241,0.04);border:1px solid var(--border-accent);padding:1rem;border-radius:8px;">
            <div style="font-size:14.5px;line-height:1.7;color:var(--frost);font-weight:600;">📝 Quick Recap: ${escapeHtml(rv.oneLineSummary)}</div>
          </div>` : ''}

        <div style="display:flex;flex-direction:column;gap:1.5rem;">
          ${rv.summary ? `
            <div>
              <h3>📖 Executive Summary</h3>
              <div style="font-size:13.5px;color:var(--mist);line-height:1.7;margin-top:0.4rem;">${markdownToHtml(rv.summary)}</div>
            </div>` : ''}

          ${takeawaysHtml ? `
            <div>
              <h3>🔑 Key Takeaways</h3>
              <ul style="list-style:none;padding:0;margin-top:0.5rem;">
                ${takeawaysHtml}
              </ul>
            </div>` : ''}

          ${tricksHtml ? `
            <details class="bts-collapsible" style="margin-top:0.5rem;">
              <summary class="bts-summary">🧠 Memory Tricks & Mnemonics</summary>
              <div class="bts-details-box">
                ${tricksHtml}
              </div>
            </details>` : ''}

          ${preCheckHtml ? `
            <details class="bts-collapsible" style="margin-top:0.5rem;">
              <summary class="bts-summary">✅ Pre-Interview Checklist</summary>
              <div class="bts-details-box">
                ${preCheckHtml}
              </div>
            </details>` : ''}

          ${commonErrorsHtml ? `
            <details class="bts-collapsible" style="margin-top:0.5rem;">
              <summary class="bts-summary">⚠️ Common Errors Glossary</summary>
              <div class="bts-details-box">
                ${commonErrorsHtml}
              </div>
            </details>` : ''}

          ${nextTopicsHtml ? `
            <div>
              <h3>🗺️ Next Modules in the Learning Track</h3>
              <div style="margin-top:0.5rem;">${nextTopicsHtml}</div>
            </div>` : ''}
        </div>

        <div class="step-nav-footer">
          <button class="btn btn-secondary" onclick="goToStepIndex(12)">← Back</button>
          <button class="btn btn-primary" onclick="goToStepIndex(14)">Continue to Completion ✓</button>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="journey-card" style="border-left: 4px solid var(--emerald);text-align:center;padding:3rem 1.5rem;">
        <div style="font-size:4rem;margin-bottom:1rem;">🎉</div>
        <h2 style="color:var(--emerald);font-size:26px;margin-bottom:0.5rem;">Congratulations! Lesson Complete</h2>
        <p style="font-size:15px;color:var(--mist);max-width:550px;margin:0 auto 2rem;line-height:1.7;">
          You have successfully completed all 15 stages of the <strong>${escapeHtml(ui.title)}</strong> interactive course.
          You earned <strong>+100 XP</strong> for finishing this module!
        </p>

        <div style="display:flex;gap:0.75rem;justify-content:center;">
          <button class="btn btn-secondary" onclick="goToStepIndex(13)">← Review Revision</button>
          <button class="btn btn-primary" id="btn-finish-lesson-stepper">Mark Lesson Completed ✓</button>
        </div>
      </div>
    `;

    document.getElementById('btn-finish-lesson-stepper')?.addEventListener('click', () => {
      completeLesson();
    });
  }
}

// ── Helper: build a card config object ───────────────────────────
function makeCard(id, title, content, locked) {
  return { id, title, content: content || '', locked: !!locked };
}

// ── Helper: render a v2 memory table ─────────────────────────────
function renderV2MemoryTable(diagram) {
  if (!diagram) return '';
  // Support both 'rows' (old) and 'slots' (curriculum JSON format)
  const rows = diagram.rows || diagram.slots || [];
  if (!rows.length) return '';

  const headers = diagram.headers || ['Address', 'Variable', 'Value'];
  const rowsHtml = rows.map((r, i) => {
    const addr  = r.address || r[headers[0]] || '';
    const name  = r.name    || r[headers[1]] || r.label || '';
    const value = r.value   || r[headers[2]] || '';
    return `
      <tr class="${i === 0 ? 'active-slot' : ''}">
        <td class="memory-address">${escapeHtml(String(addr))}</td>
        <td class="memory-label">${escapeHtml(String(name))}</td>
        <td class="memory-value">${escapeHtml(String(value))}</td>
      </tr>`;
  }).join('');

  return `
    <table class="memory-table">
      <thead>
        <tr>
          <th>${escapeHtml(headers[0] || 'Address')}</th>
          <th>${escapeHtml(headers[1] || 'Variable')}</th>
          <th>${escapeHtml(headers[2] || 'Value')}</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>`;
}

// ── Helper: render a single code example card ─────────────────────
function renderV2Example(ex) {
  if (!ex || !ex.code) return '';
  return `
    <div style="margin-bottom:1.5rem;">
      ${ex.title ? `<div style="font-weight:600;font-size:13px;margin-bottom:0.5rem;color:var(--accent);">▶ ${escapeHtml(ex.title)}</div>` : ''}
      <pre><button class="copy-btn" onclick="copyCode(this)">Copy</button><code class="lang-python">${escapeHtml(ex.code)}</code></pre>
      ${ex.explanation ? `<div style="font-size:13px;color:var(--mist);margin-top:0.5rem;line-height:1.6;">${markdownToHtml(ex.explanation)}</div>` : ''}
      ${Array.isArray(ex.lineByLine) && ex.lineByLine.length > 0 ? `
        <details class="bts-collapsible" style="margin-top:0.5rem;">
          <summary class="bts-summary">📋 Line-by-line walkthrough</summary>
          <div class="bts-details-box">
            <ol style="padding-left:1.25rem;line-height:2;color:var(--mist);margin:0;">
              ${ex.lineByLine.map(l => `<li style="font-size:12.5px;">${escapeHtml(String(l))}</li>`).join('')}
            </ol>
          </div>
        </details>` : ''}
      ${ex.expectedOutput ? `<div style="font-size:12px;margin-top:0.5rem;padding:0.4rem 0.6rem;background:rgba(52,211,153,0.06);border-left:3px solid var(--emerald);border-radius:0 4px 4px 0;"><strong style="color:var(--emerald);">Output:</strong> <code>${escapeHtml(ex.expectedOutput)}</code></div>` : ''}
    </div>
  `;
}

// ── Helper: render v2 quiz inside quizContainer (legacy tab) ─────
function renderV2QuizLegacy(quiz) {
  const container = document.getElementById('quizContainer');
  const actions   = document.getElementById('quizActions');
  quizAnswers   = {};
  quizSubmitted = false;

  const mcqs = Array.isArray(quiz?.mcqs) ? quiz.mcqs : [];

  if (!mcqs.length) {
    if (container) container.innerHTML = '<p style="color:var(--mist);">Quiz coming soon.</p>';
    if (actions)   actions.style.display = 'none';
    return;
  }

  if (actions) {
    actions.style.display = 'block';
    const scoreEl = document.getElementById('quizScore');
    const submitBtn = document.getElementById('submitQuizBtn');
    if (scoreEl)   scoreEl.style.display = 'none';
    if (submitBtn) submitBtn.style.display = 'inline-flex';
  }

  if (container) {
    container.innerHTML = '';
    mcqs.forEach((q, qi) => {
      const letters  = ['A','B','C','D','E'];
      const options  = Array.isArray(q.options) ? q.options : [];
      const card = document.createElement('div');
      card.className = 'quiz-question';
      card.innerHTML = `
        <div class="quiz-q-text"><span style="color:var(--accent);font-family:var(--font-mono);margin-right:.4rem;">Q${qi+1}.</span>${markdownToHtml(q.question||'')}</div>
        ${q.level ? `<div style="font-size:11px;color:var(--mist-dim);margin-bottom:0.4rem;">Level: ${escapeHtml(q.level)}</div>` : ''}
        <div class="quiz-options" id="v2-quiz-opts-${qi}">
          ${options.map((opt, i) => `
            <div class="quiz-option" data-qidx="${qi}" data-letter="${letters[i]}">
              <div class="quiz-letter">${letters[i]}</div>
              <div>${markdownToHtml(opt)}</div>
            </div>
          `).join('')}
        </div>
        <div class="quiz-explanation" id="v2-quiz-exp-${qi}">${markdownToHtml(q.explanation||'')}</div>
      `;

      card.querySelectorAll('.quiz-option').forEach(opt => {
        opt.addEventListener('click', function () {
          if (quizSubmitted) return;
          const qidx   = this.dataset.qidx;
          const letter = this.dataset.letter;
          quizAnswers[qidx] = letter;
          card.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
          this.classList.add('selected');
        });
      });

      container.appendChild(card);
    });
  }
}

// ── toggleEl helper (show/hide by id) ─────────────────────────────
window.toggleEl = function(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
};



// ── Educational Journey & Note Rendering (Legacy fallback) ─────────────────────────────
function renderTheoryWithLevels(notesMarkdown) {
  const lesson = currentLessonData?.lesson;
  const sc = lesson?.structured_content;
  const container = document.getElementById('lessonJourney');
  
  if (!container) return;
  container.innerHTML = '';

  // Reset trackers
  checkpointCorrectCount = 0;
  checkpointTotalCount = 0;
  stepperCompleted = false;
  mcqAnsweredCount = 0;

  if (!sc) {
    // Fallback: render raw notes markdown as a single card if not structured
    container.innerHTML = `
      <div class="journey-card">
        <h2>📖 Lesson Notes</h2>
        <div class="journey-card-content">${markdownToHtml(notesMarkdown || 'Notes coming soon.')}</div>
      </div>
    `;
    return;
  }

  // Parse structured elements if present
  let memoryData = null;
  let stepperSteps = null;
  let checkpoints = null;
  let gradualSteps = null;

  try { if (sc.memoryDiagram) memoryData = JSON.parse(sc.memoryDiagram); } catch(e) {}
  try { if (sc.executionStepper) stepperSteps = JSON.parse(sc.executionStepper); } catch(e) {}
  try { if (sc.checkpointQuestions) checkpoints = JSON.parse(sc.checkpointQuestions); } catch(e) {}
  try { if (sc.gradualCode) gradualSteps = JSON.parse(sc.gradualCode); } catch(e) {}

  if (checkpoints && checkpoints.length) {
    checkpointTotalCount = checkpoints.length;
  }

  // Determine concept theme class
  const themeClass = 'theme-' + (sc.memoryDiagram ? JSON.parse(sc.memoryDiagram).theme || 'variables' : 'variables');

  // Let's create the 13 sequential learning blocks
  const blocks = [];

  // Stage 1: Curiosity & Scenario
  blocks.push({
    id: "stage-1",
    title: "🤔 Think About This",
    content: markdownToHtml(sc.definition || ''),
    interactive: true
  });

  // Stage 2: Why it is needed
  blocks.push({
    id: "stage-2",
    title: "❓ Why do we need this?",
    content: markdownToHtml(sc.why_exists || ''),
    locked: true
  });

  // Stage 3: The Big Idea
  blocks.push({
    id: "stage-3",
    title: "💡 The Big Idea",
    content: `
      <p>${markdownToHtml(sc.beginner_explanation || '')}</p>
      <div class="premium-callout callout-info" style="margin-top:1rem;">
        <div class="callout-icon">💡</div>
        <div class="callout-body">
          <strong>Analogy Metaphor:</strong><br>
          ${markdownToHtml(sc.real_world_analogies || '')}
        </div>
      </div>
    `,
    locked: true
  });

  // Stage 4: Visuals
  let visualContent = '';
  if (memoryData) {
    visualContent = renderMemoryDiagramComponent(memoryData);
  } else {
    visualContent = markdownToHtml(sc.visual_flow || '');
  }
  blocks.push({
    id: "stage-4",
    title: "🧠 Visual Map",
    content: visualContent,
    locked: true
  });

  // Stage 5: Behind the scenes
  blocks.push({
    id: "stage-5",
    title: "⚙️ Behind the Scenes",
    content: `
      <details class="bts-collapsible" style="margin-top:0.5rem;">
        <summary class="bts-summary">⚙️ What the computer actually does</summary>
        <div class="bts-details-box">
          ${markdownToHtml(sc.detailed_concept || '')}
          <div style="margin-top:1rem; border-top:1px solid var(--border); padding-top:0.75rem;">
            <strong>Internal Execution Flow:</strong><br>
            ${markdownToHtml(sc.internal_working || '')}
          </div>
        </div>
      </details>
    `,
    locked: true
  });

  // Stage 6: Code Syntax & Progression
  let codeContent = markdownToHtml(sc.syntax_breakdown || '');
  if (gradualSteps && gradualSteps.length) {
    codeContent += renderGradualCodeComponent(gradualSteps, lesson.language);
  } else {
    codeContent += `<div style="margin-top:1rem;"><strong>Beginner Example:</strong><br>${markdownToHtml(sc.beginner_example || '')}</div>`;
  }
  blocks.push({
    id: "stage-6",
    title: "💻 Writing Code",
    content: codeContent,
    locked: true
  });

  // Stage 7: Stepper Dry Run
  let stepperContent = '';
  if (stepperSteps && stepperSteps.length) {
    stepperContent = renderExecutionStepperComponent(stepperSteps, themeClass);
  } else {
    stepperContent = markdownToHtml(sc.line_by_line || '');
  }
  blocks.push({
    id: "stage-7",
    title: "🔍 Step-by-Step Dry Run",
    content: stepperContent,
    locked: true
  });

  // Stage 8: Real World Apps
  blocks.push({
    id: "stage-8",
    title: "🌍 Real-World Software Examples",
    content: `
      <div style="margin-bottom:1rem;">
        <strong>Practical Level 2 Example:</strong><br>
        ${markdownToHtml(sc.intermediate_example || '')}
      </div>
      <div style="margin-bottom:1rem;">
        <strong>Advanced Level 3 Example:</strong><br>
        ${markdownToHtml(sc.advanced_example || '')}
      </div>
      <div style="margin-top:1rem; border-top:1px solid var(--border); padding-top:0.75rem;">
        <strong>Real Production Use Cases:</strong><br>
        ${markdownToHtml(sc.production_example || '')}
      </div>
    `,
    locked: true
  });

  // Stage 9: Common Mistakes
  blocks.push({
    id: "stage-9",
    title: "⚠️ Mistakes to Avoid",
    content: renderMistakeCardComponent(sc.common_mistakes || '', lesson.language),
    locked: true
  });

  // Stage 10: Best Practices
  blocks.push({
    id: "stage-10",
    title: "✅ Best Practices",
    content: `
      ${markdownToHtml(sc.best_practices || '')}
      <div style="margin-top:1rem; border-top:1px solid var(--border); padding-top:0.75rem;">
        <strong>Performance & Complexity:</strong><br>
        ${markdownToHtml(sc.performance || '')}
      </div>
    `,
    locked: true
  });

  // Stage 11: Interview corner
  blocks.push({
    id: "stage-11",
    title: "🎯 Interview Corner & FAQs",
    content: `
      <div style="margin-bottom:1rem;">
        <strong>Common Interview Questions:</strong><br>
        ${markdownToHtml(sc.interview_questions || '')}
      </div>
      <div style="margin-top:1rem; border-top:1px solid var(--border); padding-top:0.75rem;">
        <strong>Frequently Asked Questions (FAQs):</strong><br>
        ${markdownToHtml(sc.faqs || '')}
      </div>
    `,
    locked: true
  });

  // Stage 12: Interactive Practice
  let practiceContent = '';
  if (checkpoints && checkpoints.length) {
    practiceContent = renderCheckpointsComponent(checkpoints, themeClass);
  } else {
    practiceContent = markdownToHtml(sc.mcqs || '');
  }
  blocks.push({
    id: "stage-12",
    title: "🧠 Checkpoint Questions",
    content: practiceContent,
    locked: true
  });

  // Stage 13: Summary & Next path
  blocks.push({
    id: "stage-13",
    title: "📌 Quick Revision",
    content: `
      ${markdownToHtml(sc.summary || '')}
      <div style="margin-top:1rem; border-top:1px solid var(--border); padding-top:0.75rem;">
        <strong>🗺️ Next Learning Path:</strong><br>
        ${markdownToHtml(sc.next_learning_path || '')}
      </div>
    `,
    locked: true
  });

  // Render cards
  blocks.forEach(b => {
    const card = document.createElement('div');
    card.id = b.id;
    card.className = `journey-card ${themeClass} ${b.locked ? 'journey-card-locked' : ''}`;
    card.innerHTML = `
      <h2>${b.title}</h2>
      <div class="journey-card-content">${b.content}</div>
    `;

    // Add lock overlay button if locked
    if (b.locked) {
      const lockOverlay = document.createElement('button');
      lockOverlay.className = 'lock-overlay-btn';
      lockOverlay.innerHTML = '🔒 Lock — Complete tasks above to unlock';
      lockOverlay.disabled = true;
      card.appendChild(lockOverlay);
    }

    container.appendChild(card);
  });

  // Initialize interactive script components handlers
  initJourneyInteractions(themeClass);
}

// ── Journey Interactions & Handlers ──────────────────────────────────
function initJourneyInteractions(themeClass) {
  // 1. Stage 1 has a default "Think Checkpoint" at bottom
  const stage1 = document.getElementById('stage-1');
  if (stage1) {
    const contentDiv = stage1.querySelector('.journey-card-content');
    const checkpointDiv = document.createElement('div');
    checkpointDiv.className = 'premium-callout checkpoint-card';
    checkpointDiv.style.marginTop = '1.5rem';
    checkpointDiv.innerHTML = `
      <div class="checkpoint-question">🤔 Pause & Think: How would you store a player's points total if they earn bonuses?</div>
      <div style="margin-bottom:0.75rem;">
        <input type="text" id="stage1-thought-input" style="width:100%; background:var(--abyss-2); border:1px solid var(--border); border-radius:6px; color:#fff; padding:0.6rem; font-size:13px;" placeholder="Write down your prediction first...">
      </div>
      <button class="btn btn-primary btn-sm" id="stage1-thought-btn">I've thought about it →</button>
    `;
    contentDiv.appendChild(checkpointDiv);

    document.getElementById('stage1-thought-btn').addEventListener('click', () => {
      // Unlock Stages 2, 3, 4, 5
      unlockJourneyStage('stage-2');
      unlockJourneyStage('stage-3');
      unlockJourneyStage('stage-4');
      unlockJourneyStage('stage-5');
      showToast('Curiosity unlocked! Proceed down the journey.', 'success');
      document.getElementById('stage1-thought-btn').disabled = true;
      document.getElementById('stage-2').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 2. Behind the scenes details expand listener
  const bts = document.querySelector('.bts-collapsible');
  if (bts) {
    bts.addEventListener('toggle', () => {
      if (bts.open) {
        // Unlock Stage 6
        unlockJourneyStage('stage-6');
      }
    });
  }

  // 3. Gradual code walkthrough next stepper
  const gradualNext = document.getElementById('gradual-code-next');
  if (gradualNext) {
    gradualNext.addEventListener('click', () => {
      const activeStep = document.querySelector('.gradual-code-step.active');
      if (activeStep) {
        const nextStep = activeStep.nextElementSibling;
        if (nextStep && nextStep.classList.contains('gradual-code-step')) {
          activeStep.classList.remove('active');
          nextStep.classList.add('active');
          nextStep.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          // Finished code build
          unlockJourneyStage('stage-7');
          gradualNext.disabled = true;
        }
      }
    });
  }

  // 4. Stepper initialization
  initStepperComponent();
}

function unlockJourneyStage(id) {
  const card = document.getElementById(id);
  if (card && card.classList.contains('journey-card-locked')) {
    card.classList.remove('journey-card-locked');
    const lockBtn = card.querySelector('.lock-overlay-btn');
    if (lockBtn) lockBtn.remove();
  }
}

// ── Structured Components Generators ──────────────────────────────────

// Memory Diagram Component
function renderMemoryDiagramComponent(data) {
  if (data.type === 'variables' || data.type === 'constants') {
    return `
      <p style="margin-bottom:0.75rem;">Here is what the CPU allocates inside RAM:</p>
      <table class="memory-table">
        <thead>
          <tr>
            <th>RAM Address</th>
            <th>Variable Name</th>
            <th>Value Stored</th>
            <th>Size (Bytes)</th>
          </tr>
        </thead>
        <tbody>
          ${data.memory.map(slot => `
            <tr>
              <td class="memory-address">${slot.address}</td>
              <td class="memory-label">${slot.label}</td>
              <td class="memory-value">${escapeHtml(slot.value)}</td>
              <td>${slot.bytes || 4} bytes</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  if (data.type === 'joins') {
    return `
      <div style="display:flex;gap:1.5rem;flex-wrap:wrap;margin-bottom:0.75rem;">
        ${data.tables.map(tbl => `
          <div style="flex:1;min-width:200px;">
            <strong style="color:var(--accent);">${tbl.name} Table</strong>
            <table class="memory-table" style="margin-top:0.4rem;">
              <tbody>
                ${tbl.rows.map(r => `
                  <tr>
                    ${Object.entries(r).map(([k,v]) => `<td><strong>${k}:</strong> ${v}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (data.type === 'objects') {
    return `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <div>
          <strong>Stack Frames (References):</strong>
          <table class="memory-table" style="margin-top:0.4rem;">
            <tbody>
              ${data.stack.map(s => `
                <tr>
                  <td><span class="memory-label">${s.label}</span></td>
                  <td><span class="memory-address">${s.value}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div>
          <strong>Heap Allocations (Data objects):</strong>
          <table class="memory-table" style="margin-top:0.4rem;">
            <tbody>
              ${data.heap.map(h => `
                <tr>
                  <td class="memory-address">${h.address}</td>
                  <td><strong>${h.label}</strong></td>
                  <td>${Object.entries(h.properties).map(([k,v]) => `<div>${k}: <span class="memory-value">${v}</span></div>`).join('')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // Fallback visual flow
  return `<div class="premium-visual-diagram-card"><pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre></div>`;
}

// Stepper Component
function renderExecutionStepperComponent(steps, themeClass) {
  return `
    <div class="stepper-layout">
      <div>
        <div class="stepper-code-panel" id="stepper-code-panel">
          ${steps.map((s, idx) => `
            <div class="stepper-code-line ${idx === 0 ? 'active' : ''}" data-step="${idx}">
              <span class="stepper-line-number">${s.line || (idx+1)}</span>
              <span>${escapeHtml(s.code)}</span>
            </div>
          `).join('')}
        </div>
        <div class="stepper-nav">
          <button class="btn btn-secondary btn-sm" id="stepper-prev-btn" disabled>← Previous</button>
          <button class="btn btn-primary btn-sm" id="stepper-next-btn">Next Step →</button>
        </div>
      </div>
      <div class="stepper-visual-panel">
        <div style="font-weight:600;font-size:12px;color:var(--mist-dim);">EXPLANATION</div>
        <div class="stepper-explanation-box" id="stepper-explanation-box">
          ${steps[0]?.explanation || 'Select a step to run.'}
        </div>
        <div style="font-weight:600;font-size:12px;color:var(--mist-dim);margin-top:0.5rem;">SCREEN CONSOLE OUTPUT</div>
        <div class="stepper-console-box" id="stepper-console-box">
          ${steps[0]?.output ? `<div class="stepper-console-line">&gt; ${steps[0].output}</div>` : '&lt; Console is empty &gt;'}
        </div>
      </div>
    </div>
  `;
}

let activeStepperIdx = 0;
function initStepperComponent() {
  const steps = currentLessonData?.lesson?.structured_content?.executionStepper;
  if (!steps) return;
  const parsedSteps = JSON.parse(steps);

  activeStepperIdx = 0;
  const prevBtn = document.getElementById('stepper-prev-btn');
  const nextBtn = document.getElementById('stepper-next-btn');
  const expBox = document.getElementById('stepper-explanation-box');
  const consoleBox = document.getElementById('stepper-console-box');

  const updateStepperUI = () => {
    document.querySelectorAll('.stepper-code-line').forEach(line => {
      line.classList.toggle('active', parseInt(line.dataset.step) === activeStepperIdx);
    });

    const step = parsedSteps[activeStepperIdx];
    expBox.textContent = step?.explanation || '';
    
    // Accumulate all output up to this step
    let accumulatedOutput = '';
    for (let i = 0; i <= activeStepperIdx; i++) {
      if (parsedSteps[i].output) {
        accumulatedOutput += `<div class="stepper-console-line">&gt; ${parsedSteps[i].output}</div>`;
      }
    }
    consoleBox.innerHTML = accumulatedOutput || '&lt; Console is empty &gt;';

    prevBtn.disabled = activeStepperIdx === 0;
    nextBtn.textContent = activeStepperIdx === parsedSteps.length - 1 ? 'Finish Dry Run ✓' : 'Next Step →';
  };

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      if (activeStepperIdx > 0) {
        activeStepperIdx--;
        updateStepperUI();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (activeStepperIdx < parsedSteps.length - 1) {
        activeStepperIdx++;
        updateStepperUI();
      } else {
        // Finished the stepper trace walkthrough
        stepperCompleted = true;
        showToast('Dry run completed! Proceed to next section.', 'success');
        unlockJourneyStage('stage-8');
        unlockJourneyStage('stage-9');
        unlockJourneyStage('stage-10');
        unlockJourneyStage('stage-11');
        unlockJourneyStage('stage-12');
        unlockJourneyStage('stage-13');
        nextBtn.disabled = true;
      }
    });
  }
}

// Checkpoint Questions Component
function renderCheckpointsComponent(checkpoints, themeClass) {
  return `
    <div style="display:flex;flex-direction:column;gap:1.5rem;">
      ${checkpoints.map((q, qidx) => `
        <div class="checkpoint-card-item" data-qidx="${qidx}">
          <div class="checkpoint-question">${q.question}</div>
          <div class="checkpoint-options">
            ${q.options.map((opt, oidx) => `
              <div class="checkpoint-option checkpoint-opt-btn" data-qidx="${qidx}" data-oidx="${oidx}">
                <div class="quiz-letter">${String.fromCharCode(65 + oidx)}</div>
                <div>${opt}</div>
              </div>
            `).join('')}
          </div>
          <div class="checkpoint-feedback" id="cp-feedback-${qidx}">
            <strong>Explanation:</strong> ${q.explanation}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Hint/Mistake Card Component
function renderMistakeCardComponent(mistakesMarkdown, language) {
  // If we can extract code blocks, render the mistake grid. Else fallback to standard markdown.
  const blocks = mistakesMarkdown.split('```');
  if (blocks.length >= 5) {
    const badCode = blocks[1].split('\n').slice(1).join('\n');
    const badWhy = blocks[2].replace(/\*Why this is bad:\*/gi, '').trim();
    const goodCode = blocks[3].split('\n').slice(1).join('\n');
    const goodWhy = blocks[4] || 'Follow proper standard guidelines.';

    return `
      <div class="mistake-comparison-grid">
        <div class="comparison-card bad">
          <div class="card-header">⚠️ The Mistake</div>
          <div class="card-body">
            <pre><code>${escapeHtml(badCode)}</code></pre>
            <div class="card-desc">${badWhy}</div>
          </div>
        </div>
        <div class="comparison-card good" style="margin-top:1rem;">
          <div class="card-header">✅ The Correct Way</div>
          <div class="card-body">
            <pre><code>${escapeHtml(goodCode)}</code></pre>
            <div class="card-desc">${goodWhy}</div>
          </div>
        </div>
      </div>
    `;
  }
  return markdownToHtml(mistakesMarkdown);
}

// Gradual Code reveal
function renderGradualCodeComponent(steps, language) {
  return `
    <div class="gradual-code-card">
      ${steps.map((s, idx) => `
        <div class="gradual-code-step ${idx === 0 ? 'active' : ''}">
          <div class="gradual-code-explain"><strong>Step ${idx+1}:</strong> ${s.explanation}</div>
          <pre><code>${escapeHtml(s.code)}</code></pre>
        </div>
      `).join('')}
    </div>
    <button class="btn btn-secondary btn-sm" id="gradual-code-next" style="margin-top:0.75rem;">Next Code Line →</button>
  `;
}

// MCQ interaction listeners — vanilla JS event delegation (no jQuery)
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.checkpoint-opt-btn');
  if (!btn) return;

  const qidx = parseInt(btn.dataset.qidx);
  const oidx = parseInt(btn.dataset.oidx);

  // Resolve checkpoints from either v2 normalized model or legacy sc.*
  let checkpoints = null;
  if (currentLessonUI?.schemaVersion === '2.0') {
    checkpoints = currentLessonUI?.quiz?.checkpoints || [];
  } else if (currentLessonData?.lesson?.structured_content?.checkpointQuestions) {
    try {
      checkpoints = JSON.parse(currentLessonData.lesson.structured_content.checkpointQuestions);
    } catch(e) { checkpoints = []; }
  }
  if (!checkpoints || !checkpoints.length) return;

  const q = checkpoints[qidx];
  if (!q) return;
  const parent = btn.closest('.checkpoint-card-item');
  if (!parent) return;

  if (parent.querySelector('.checkpoint-option.correct')) return; // already answered

  if (oidx === q.correct) {
    parent.querySelectorAll('.checkpoint-option').forEach(el => el.classList.add('correct'));
    const feedbackEl = parent.querySelector(`#cp-feedback-${qidx}`);
    if (feedbackEl) feedbackEl.classList.add('show');
    showToast('Correct! Well done.', 'success');
    checkpointCorrectCount++;
    mcqAnsweredCount++;
  } else {
    btn.classList.add('wrong');
    showToast('Incorrect. Try again!', 'error');
  }
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

// ── Timed Exam & Assessment Workspace Section ──────────────────
let examType = ''; 
let examTargetId = '';
let examQuestionsList = [];
let examActiveIndex = 0;
let examTimerSeconds = 0;
let examTimerInterval = null;
let examAnswersMap = {};
let examBookmarksList = [];
let examSubmittedState = false;

function setupExamSystem() {
  document.getElementById('examPrevBtn').addEventListener('click', () => {
    if (examActiveIndex > 0) renderExamQuestion(examActiveIndex - 1);
  });
  document.getElementById('examNextBtn').addEventListener('click', () => {
    if (examActiveIndex < examQuestionsList.length - 1) renderExamQuestion(examActiveIndex + 1);
  });
  document.getElementById('submitExamBtn').addEventListener('click', submitExam);
  document.getElementById('saveExamSessionBtn').addEventListener('click', async () => {
    await saveExamSessionStateSilently();
    exitExamMode();
    showToast('Session saved successfully! You can resume later.', 'success');
  });
  document.getElementById('exitExamBtn').addEventListener('click', async () => {
    if (confirm('Exit assessment? Your current progress is saved.')) {
      await saveExamSessionStateSilently();
      exitExamMode();
    }
  });
}

async function startExamSession(type, targetId) {
  if (examTimerInterval) clearInterval(examTimerInterval);

  examType = type;
  examTargetId = targetId;
  examAnswersMap = {};
  examBookmarksList = [];
  examActiveIndex = 0;
  examSubmittedState = false;

  const workspace = document.getElementById('examWorkspace');
  const mainContent = document.getElementById('moduleContent');
  const contentLoading = document.getElementById('contentLoading');

  mainContent.style.display = 'none';
  contentLoading.style.display = 'block';
  contentLoading.innerHTML = '<div style="text-align:center;padding:3rem;"><p style="margin-top:1rem;color:var(--mist);">Initializing Timed Assessment Workspace...</p></div>';

  try {
    let url = `/api/roadmaps/${ROADMAP_ID}/level/${targetId}/exam`;
    if (type === 'final') {
      url = `/api/roadmaps/${ROADMAP_ID}/exam`;
    }

    const data = await apiFetch(url);
    if (!data.success) throw new Error(data.message);

    examQuestionsList = data.questions;
    examAnswersMap = data.session ? data.session.answers : (data.answers || {});
    examBookmarksList = data.session ? data.session.bookmarks : (data.bookmarks || []);
    examTimerSeconds = data.session && data.session.time_left ? data.session.time_left : (data.timeLeft || (type === 'level' ? 3600 : 5400));

    contentLoading.style.display = 'none';
    workspace.style.display = 'block';

    const titleEl = document.getElementById('examTitle');
    const subtitleEl = document.getElementById('examSubtitle');
    if (type === 'level') {
      titleEl.textContent = `${targetId.charAt(0).toUpperCase() + targetId.slice(1)} Level Assessment`;
      subtitleEl.textContent = `Timed test consisting of 50 questions from all ${targetId} topics. Passing score: 70%.`;
    } else {
      titleEl.textContent = `Roadmap Certification Exam`;
      subtitleEl.textContent = `Comprehensive timed examination covering the entire roadmap. 100 questions. Passing score: 70%.`;
    }

    const oldReport = document.getElementById('examReportCard');
    if (oldReport) oldReport.remove();

    document.getElementById('examQuestionsContainer').style.display = 'block';
    document.getElementById('examPrevBtn').style.display = 'inline-flex';
    document.getElementById('examNextBtn').style.display = 'inline-flex';
    document.getElementById('submitExamBtn').style.display = 'inline-flex';
    document.getElementById('submitExamBtn').textContent = 'Submit Assessment';
    document.getElementById('submitExamBtn').disabled = false;
    document.getElementById('saveExamSessionBtn').style.display = 'inline-flex';
    document.getElementById('examPagination').style.display = 'flex';

    renderExamQuestion(0);
    startExamTimer();
  } catch (err) {
    showToast('Failed to initialize assessment: ' + err.message, 'error');
    mainContent.style.display = 'block';
    workspace.style.display = 'none';
    contentLoading.style.display = 'none';
  }
}

function startExamTimer() {
  const timerEl = document.getElementById('examTimer');
  const updateTimerDisplay = () => {
    const mins = Math.floor(examTimerSeconds / 60);
    const secs = examTimerSeconds % 60;
    timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    if (examTimerSeconds <= 300) {
      timerEl.style.color = '#ef4444';
      timerEl.style.borderColor = '#ef4444';
    } else {
      timerEl.style.color = 'var(--accent)';
      timerEl.style.borderColor = 'var(--border)';
    }
  };

  updateTimerDisplay();

  examTimerInterval = setInterval(async () => {
    if (examTimerSeconds > 0) {
      examTimerSeconds--;
      updateTimerDisplay();
      if (examTimerSeconds % 30 === 0 && !examSubmittedState) {
        saveExamSessionStateSilently();
      }
    } else {
      clearInterval(examTimerInterval);
      showToast('Time is up! Submitting...', 'warning');
      submitExam();
    }
  }, 1000);
}

async function saveExamSessionStateSilently() {
  try {
    const targetKey = examType === 'level' ? ROADMAP_ID + '_' + examTargetId : ROADMAP_ID;
    await apiFetch(`/api/roadmaps/quiz-session/save`, {
      method: 'POST',
      body: JSON.stringify({
        type: examType,
        target_id: targetKey,
        questions: examQuestionsList.map(q => q.id),
        answers: examAnswersMap,
        time_left: examTimerSeconds,
        bookmarks: examBookmarksList
      })
    });
  } catch (e) {}
}

function renderExamQuestion(index) {
  if (index < 0 || index >= examQuestionsList.length) return;
  examActiveIndex = index;

  const q = examQuestionsList[index];
  const container = document.getElementById('examQuestionsContainer');
  const letters = ['A', 'B', 'C', 'D'];
  const options = [q.option_a, q.option_b, q.option_c, q.option_d];
  const isBookmarked = examBookmarksList.includes(q.id);

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem;">
      <div style="font-weight:700; font-size:16px; color:var(--text); line-height:1.5;">
        <span style="color:var(--accent); font-family:var(--font-mono); margin-right:0.5rem;">Q${index + 1}.</span>${escapeHtml(q.question)}
      </div>
      <button class="btn btn-secondary btn-sm" id="bookmarkQBtn" style="flex-shrink:0; margin-left:1.5rem; display:flex; align-items:center; gap:0.4rem; border-color:${isBookmarked ? 'var(--accent)' : 'var(--border)'}; background:${isBookmarked ? 'rgba(99,102,241,0.06)' : 'transparent'};">
        ${isBookmarked ? '🔖 Bookmarked' : '☆ Bookmark'}
      </button>
    </div>
    <div class="exam-options" style="display:flex; flex-direction:column; gap:0.75rem;">
      ${options.map((opt, i) => {
        const isSelected = examAnswersMap[q.id] === letters[i];
        let style = 'border:1px solid var(--border); background:var(--abyss);';
        let letterStyle = 'background:var(--abyss-2); color:var(--mist);';
        
        if (isSelected) {
          style = 'border:1px solid var(--accent); background:rgba(99,102,241,0.04);';
          letterStyle = 'background:var(--accent); color:#fff;';
        }

        return `
          <div class="exam-option" data-letter="${letters[i]}" style="display:flex; align-items:center; gap:1rem; padding:0.85rem 1.25rem; border-radius:8px; cursor:pointer; font-size:13px; transition:all 0.15s ease; ${style}">
            <div class="exam-option-letter" style="width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; transition:all 0.15s ease; ${letterStyle}">${letters[i]}</div>
            <div style="color:var(--text); font-weight:500;">${escapeHtml(opt)}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  document.getElementById('bookmarkQBtn').addEventListener('click', () => {
    const qid = q.id;
    if (examBookmarksList.includes(qid)) {
      examBookmarksList = examBookmarksList.filter(id => id !== qid);
    } else {
      examBookmarksList.push(qid);
    }
    renderExamQuestion(index);
    saveExamSessionStateSilently();
  });

  container.querySelectorAll('.exam-option').forEach(opt => {
    opt.addEventListener('click', function () {
      if (examSubmittedState) return;
      const letter = this.dataset.letter;
      examAnswersMap[q.id] = letter;
      renderExamQuestion(index);
      saveExamSessionStateSilently();
    });
  });

  document.getElementById('examProgress').textContent = `Question ${index + 1} of ${examQuestionsList.length}`;
  document.getElementById('examPrevBtn').disabled = index === 0;
  document.getElementById('examNextBtn').disabled = index === examQuestionsList.length - 1;

  renderExamPagination();
}

function renderExamPagination() {
  const container = document.getElementById('examPagination');
  if (!container) return;
  container.innerHTML = '';

  examQuestionsList.forEach((q, i) => {
    const btn = document.createElement('button');
    btn.style = 'width:30px; height:30px; font-size:10px; font-weight:700; border-radius:6px; cursor:pointer; display:flex; align-items:center; justify-content:center; border:1px solid var(--border); transition:all 0.15s ease; position:relative;';
    
    const isAnswered = !!examAnswersMap[q.id];
    const isActive = i === examActiveIndex;
    const isBookmarked = examBookmarksList.includes(q.id);

    if (isActive) {
      btn.style.background = 'var(--accent)';
      btn.style.borderColor = 'var(--accent)';
      btn.style.color = '#fff';
    } else if (isAnswered) {
      btn.style.background = 'rgba(99,102,241,0.1)';
      btn.style.borderColor = 'var(--accent)';
      btn.style.color = 'var(--accent-light)';
    } else {
      btn.style.background = 'var(--abyss-2)';
      btn.style.color = 'var(--mist)';
    }

    if (isBookmarked) {
      const dot = document.createElement('span');
      dot.style = 'position:absolute; top:-3px; right:-3px; width:7px; height:7px; background:#f59e0b; border-radius:50%; border:1px solid var(--surface);';
      btn.appendChild(dot);
    }

    btn.appendChild(document.createTextNode(i + 1));
    btn.addEventListener('click', () => renderExamQuestion(i));
    container.appendChild(btn);
  });
}

async function submitExam() {
  if (examSubmittedState) return;

  const answeredCount = Object.keys(examAnswersMap).length;
  if (answeredCount < examQuestionsList.length) {
    if (!confirm(`Warning: You have only answered ${answeredCount} of ${examQuestionsList.length} questions. Are you sure you want to submit?`)) {
      return;
    }
  }

  examSubmittedState = true;
  if (examTimerInterval) clearInterval(examTimerInterval);

  const submitBtn = document.getElementById('submitExamBtn');
  submitBtn.textContent = 'Grading Exam...';
  submitBtn.disabled = true;

  try {
    let url = `/api/roadmaps/${ROADMAP_ID}/level/${examTargetId}/exam/submit`;
    if (examType === 'final') {
      url = `/api/roadmaps/${ROADMAP_ID}/exam/submit`;
    }

    const maxTime = examType === 'level' ? 3600 : 5400;
    const timeTaken = maxTime - examTimerSeconds;

    const data = await apiFetch(url, {
      method: 'POST',
      body: JSON.stringify({
        answers: examAnswersMap,
        time_taken: timeTaken
      })
    });

    if (!data.success) throw new Error(data.message);
    renderExamReport(data);
  } catch (err) {
    showToast('Failed to submit exam: ' + err.message, 'error');
    submitBtn.textContent = 'Submit Assessment';
    submitBtn.disabled = false;
    examSubmittedState = false;
    startExamTimer();
  }
}

function renderExamReport(data) {
  const workspace = document.getElementById('examWorkspace');
  
  document.getElementById('examQuestionsContainer').style.display = 'none';
  document.getElementById('examPrevBtn').style.display = 'none';
  document.getElementById('examNextBtn').style.display = 'none';
  document.getElementById('submitExamBtn').style.display = 'none';
  document.getElementById('saveExamSessionBtn').style.display = 'none';
  document.getElementById('examPagination').style.display = 'none';

  const reportCard = document.createElement('div');
  reportCard.id = 'examReportCard';
  reportCard.style = 'margin-top:1.5rem; text-align:center; padding:2.5rem; border-radius:12px; background:var(--abyss-2); border:1px solid var(--border);';
  
  const pct = data.score;
  const passed = data.passed;
  const color = passed ? 'var(--emerald)' : '#ef4444';

  reportCard.innerHTML = `
    <div style="font-size:3.5rem; margin-bottom:1rem;">${passed ? '🏆' : '❌'}</div>
    <h2 style="font-size:2rem; font-weight:800; color:${color}; margin:0;">${pct}%</h2>
    <h3 style="margin:0.5rem 0 1.5rem 0; font-size:1.5rem; color:var(--text);">${passed ? 'Assessment Passed!' : 'Assessment Failed'}</h3>
    <p style="color:var(--mist); font-size:14px; max-width:500px; margin:0 auto 2rem auto; line-height:1.6;">
      ${passed 
        ? `Incredible job! You scored ${data.correct} out of ${data.total} questions correctly. You have unlocked the next stage of your learning roadmap!`
        : `You scored ${data.correct} out of ${data.total} questions correctly. A minimum score of 70% is required to pass. Study the concept notes and try again.`}
    </p>
    
    <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">
      <button class="btn btn-secondary" id="exitExamReportBtn">Back to Learning</button>
      ${passed && data.certificate ? `
        <button class="btn btn-primary" id="viewCertificateBtn" style="background:var(--emerald);">🎓 View Certificate</button>
      ` : ''}
      <button class="btn btn-secondary" id="reviewExamBtn">Review Questions</button>
    </div>
  `;

  workspace.appendChild(reportCard);

  document.getElementById('exitExamReportBtn').addEventListener('click', () => {
    exitExamMode();
  });

  if (passed && data.certificate) {
    document.getElementById('viewCertificateBtn').addEventListener('click', () => {
      window.location.href = `certificates.html?hash=${data.certificate.hash}`;
    });
  }

  document.getElementById('reviewExamBtn').addEventListener('click', () => {
    reportCard.style.display = 'none';
    renderExamReviewMode(data.results);
  });
}

function exitExamMode() {
  if (examTimerInterval) clearInterval(examTimerInterval);
  document.getElementById('examWorkspace').style.display = 'none';
  document.getElementById('moduleContent').style.display = 'block';
  loadRoadmap().then(() => renderSidebar());
}

function renderExamReviewMode(results) {
  const container = document.getElementById('examQuestionsContainer');
  container.style.display = 'block';
  container.innerHTML = '<h2>🔍 Assessment Review</h2><p style="font-size:13px;color:var(--mist);margin-bottom:1.5rem;">Review all questions with correct answers and explanations.</p>';

  results.forEach((r, idx) => {
    const q = examQuestionsList.find(item => item.id === r.quiz_id);
    if (!q) return;

    const letters = ['A', 'B', 'C', 'D'];
    const options = [q.option_a, q.option_b, q.option_c, q.option_d];

    const card = document.createElement('div');
    card.className = 'quiz-question';
    card.style = 'background:var(--abyss-2);border:1px solid var(--border);border-radius:8px;padding:1.25rem;margin-bottom:1.5rem;text-align:left;';
    card.innerHTML = `
      <div class="quiz-q-text" style="font-weight:600;font-size:14px;color:var(--text);margin-bottom:1rem;">
        <span style="color:var(--accent);font-family:var(--font-mono);margin-right:.4rem;">Q${idx+1}.</span>${escapeHtml(q.question)}
      </div>
      <div class="quiz-options" style="display:flex;flex-direction:column;gap:0.5rem;">
        ${options.map((opt, i) => {
          const letter = letters[i];
          const isCorrect = letter === r.correct_option;
          const isSelected = examAnswersMap[q.id] === letter;

          let style = 'border:1px solid var(--border);';
          let letterStyle = 'background:var(--abyss-2);color:var(--mist);';
          
          if (isCorrect) {
            style = 'border:1px solid var(--emerald);background:rgba(16,185,129,0.03);';
            letterStyle = 'background:var(--emerald);color:#fff;';
          } else if (isSelected) {
            style = 'border:1px solid var(--rose);background:rgba(244,63,94,0.03);';
            letterStyle = 'background:var(--rose);color:#fff;';
          }

          return `
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.6rem 1rem;border-radius:6px;font-size:12.5px;${style}">
              <div style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;${letterStyle}">${letter}</div>
              <div style="color:var(--text);">${escapeHtml(opt)}</div>
            </div>
          `;
        }).join('')}
      </div>
      <div style="margin-top:1rem;padding:1rem;background:rgba(16,185,129,0.02);border-left:3px solid var(--emerald);border-radius:4px;font-size:12px;color:var(--mist);line-height:1.6;display:block;">
        <strong>Explanation:</strong><br>${markdownToHtml(r.explanation || 'Refer to the curriculum notes.')}
      </div>
    `;
    container.appendChild(card);
  });

  const footer = document.createElement('div');
  footer.style = 'margin-top:2rem;text-align:center;';
  footer.innerHTML = `<button class="btn btn-primary" id="exitReviewBtn">Back to Learning Path</button>`;
  container.appendChild(footer);

  document.getElementById('exitReviewBtn').addEventListener('click', () => {
    exitExamMode();
  });
}

let activeTopicQuestions = [];
let topicQuizSubmitted = false;

async function loadTopicQuiz(lessonId) {
  const container = document.getElementById('quizContainer');
  const actions = document.getElementById('quizActions');
  if (!container) return;

  container.innerHTML = '<p style="color:var(--mist);text-align:center;">Loading Topic Quiz...</p>';
  if (actions) actions.style.display = 'none';

  try {
    const data = await apiFetch(`/api/lessons/${lessonId}/quiz`);
    if (!data.success) throw new Error(data.message);

    activeTopicQuestions = data.questions;
    topicQuizSubmitted = false;
    quizAnswers = {};

    if (!activeTopicQuestions || activeTopicQuestions.length === 0) {
      container.innerHTML = '<p style="color:var(--mist-dim);text-align:center;">No quiz questions available for this lesson.</p>';
      return;
    }

    renderTopicQuestions();
  } catch (err) {
    container.innerHTML = `<p style="color:#ef4444;text-align:center;">Failed to load quiz: ${err.message}</p>`;
  }
}

function renderTopicQuestions() {
  const container = document.getElementById('quizContainer');
  const actions = document.getElementById('quizActions');
  container.innerHTML = '';
  if (actions) {
    actions.style.display = 'block';
    document.getElementById('quizScore').style.display = 'none';
    document.getElementById('submitQuizBtn').style.display = 'inline-flex';
    document.getElementById('submitQuizBtn').disabled = false;
    document.getElementById('submitQuizBtn').textContent = 'Submit Lesson Quiz';
  }

  const oldRetry = document.getElementById('retryQuizBtn');
  if (oldRetry) oldRetry.remove();

  activeTopicQuestions.forEach((q, qi) => {
    const letters = ['A', 'B', 'C', 'D'];
    const options = [q.option_a, q.option_b, q.option_c, q.option_d];
    const card = document.createElement('div');
    card.className = 'quiz-question';
    card.style = 'background:var(--abyss-2);border:1px solid var(--border);border-radius:8px;padding:1.25rem;margin-bottom:1.5rem;';
    card.innerHTML = `
      <div class="quiz-q-text" style="font-weight:600;font-size:13.5px;color:var(--text);margin-bottom:1rem;">
        <span style="color:var(--accent);font-family:var(--font-mono);margin-right:.4rem;">Q${qi+1}.</span>${escapeHtml(q.question)}
      </div>
      <div class="quiz-options" id="quiz-opts-${q.id}" style="display:flex;flex-direction:column;gap:0.5rem;">
        ${options.map((opt, i) => `
          <div class="quiz-option" data-qid="${q.id}" data-letter="${letters[i]}" style="display:flex;align-items:center;gap:0.75rem;padding:0.6rem 1rem;background:var(--abyss);border:1px solid var(--border);border-radius:6px;cursor:pointer;font-size:12px;transition:all 0.15s ease;">
            <div class="quiz-letter" style="width:22px;height:22px;border-radius:50%;background:var(--abyss-2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--mist);">${letters[i]}</div>
            <div style="color:var(--text);">${escapeHtml(opt)}</div>
          </div>
        `).join('')}
      </div>
      <div class="quiz-explanation" id="quiz-exp-${q.id}" style="display:none;margin-top:1rem;padding:1rem;background:rgba(16,185,129,0.02);border-left:3px solid var(--emerald);border-radius:4px;font-size:12px;color:var(--mist);line-height:1.6;"></div>
    `;

    card.querySelectorAll('.quiz-option').forEach(opt => {
      opt.addEventListener('click', function () {
        if (topicQuizSubmitted) return;
        const qid = this.dataset.qid;
        const letter = this.dataset.letter;
        quizAnswers[qid] = letter;
        card.querySelectorAll('.quiz-option').forEach(o => {
          o.style.borderColor = 'var(--border)';
          o.style.background = 'var(--abyss)';
          o.querySelector('.quiz-letter').style.background = 'var(--abyss-2)';
          o.querySelector('.quiz-letter').style.color = 'var(--mist)';
        });
        this.style.borderColor = 'var(--accent)';
        this.style.background = 'rgba(99,102,241,0.03)';
        this.querySelector('.quiz-letter').style.background = 'var(--accent)';
        this.querySelector('.quiz-letter').style.color = '#fff';
      });
    });

    container.appendChild(card);
  });
}

async function submitV2Quiz() {
  if (topicQuizSubmitted) return;
  if (Object.keys(quizAnswers).length < activeTopicQuestions.length) {
    showToast('Please answer all questions before submitting!', 'warning');
    return;
  }

  topicQuizSubmitted = true;
  const btn = document.getElementById('submitQuizBtn');
  btn.textContent = 'Grading...';
  btn.disabled = true;

  try {
    const data = await apiFetch(`/api/lessons/${currentLessonId}/quiz/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers: quizAnswers })
    });

    if (!data.success) throw new Error(data.message);

    data.results.forEach(r => {
      const qoptsContainer = document.getElementById(`quiz-opts-${r.id}`);
      if (qoptsContainer) {
        qoptsContainer.querySelectorAll('.quiz-option').forEach(opt => {
          const letter = opt.dataset.letter;
          if (letter === r.correct_option) {
            opt.style.borderColor = 'var(--emerald)';
            opt.style.background = 'rgba(16,185,129,0.03)';
            opt.querySelector('.quiz-letter').style.background = 'var(--emerald)';
            opt.querySelector('.quiz-letter').style.color = '#fff';
          } else if (letter === quizAnswers[r.id] && !r.correct) {
            opt.style.borderColor = 'var(--rose)';
            opt.style.background = 'rgba(244,63,94,0.03)';
            opt.querySelector('.quiz-letter').style.background = 'var(--rose)';
            opt.querySelector('.quiz-letter').style.color = '#fff';
          }
        });
      }

      const expEl = document.getElementById(`quiz-exp-${r.id}`);
      if (expEl) {
        expEl.style.display = 'block';
        expEl.innerHTML = `<strong>Breakdown:</strong><br>${markdownToHtml(r.explanation || 'Refer to lesson content.')}`;
      }
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
          <div style="font-size:12px;color:var(--mist);">${pct >= 70 ? '🎉 Passed! Lesson marked as completed.' : '❌ Score below 70%. Retry to improve.'}</div>
        </div>
      </div>
    `;

    btn.style.display = 'none';

    const actions = document.getElementById('quizActions');
    const retryBtn = document.createElement('button');
    retryBtn.id = 'retryQuizBtn';
    retryBtn.className = 'btn btn-secondary';
    retryBtn.style.marginLeft = '1rem';
    retryBtn.textContent = '🔄 Retry Quiz';
    retryBtn.addEventListener('click', () => loadTopicQuiz(currentLessonId));
    if (actions) actions.appendChild(retryBtn);

    await loadRoadmap();
    renderSidebar();
    updateProgressUI();
  } catch (err) {
    showToast('Quiz submit error: ' + err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Submit Lesson Quiz';
    topicQuizSubmitted = false;
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
  const tbProg = document.getElementById('tbProgress');
  if (tbProg) tbProg.textContent = `${done} / ${total} lessons`;
  const tbProgBar = document.getElementById('tbProgressBar');
  if (tbProgBar) tbProgBar.style.width = pct + '%';

  // Level-specific progress bars for sidebar header
  const begLessons = lessons.filter(l => (l.level || '').toLowerCase() === 'beginner');
  const intLessons = lessons.filter(l => (l.level || '').toLowerCase() === 'intermediate');
  const expLessons = lessons.filter(l => (l.level || '').toLowerCase() === 'expert');

  const getPct = (list) => {
    const tot = list.length;
    const completed = list.filter(l => lessonProgressMap[l.id]).length;
    return tot > 0 ? Math.round((completed / tot) * 100) : 0;
  };

  const begPct = getPct(begLessons);
  const intPct = getPct(intLessons);
  const expPct = getPct(expLessons);

  const progContainer = document.getElementById('sbProgressContainer');
  if (progContainer) {
    progContainer.innerHTML = `
      <div style="font-size:11px; color:var(--mist); display:flex; flex-direction:column; gap:2px; margin-bottom: 2px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span>🌟 Beginner</span><span>${begPct}%</span>
        </div>
        <div class="progress-bar" style="height:4px;"><div class="progress-fill" style="width:${begPct}%; background:var(--accent);"></div></div>
      </div>
      <div style="font-size:11px; color:var(--mist); display:flex; flex-direction:column; gap:2px; margin-bottom: 2px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span>⚙️ Intermediate</span><span>${intPct}%</span>
        </div>
        <div class="progress-bar" style="height:4px;"><div class="progress-fill" style="width:${intPct}%; background:#fbbf24;"></div></div>
      </div>
      <div style="font-size:11px; color:var(--mist); display:flex; flex-direction:column; gap:2px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span>🚀 Expert</span><span>${expPct}%</span>
        </div>
        <div class="progress-bar" style="height:4px;"><div class="progress-fill" style="width:${expPct}%; background:#ef4444;"></div></div>
      </div>
    `;
  }

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
  const viewCertBtn = document.getElementById('viewCertBtn');
  const certLabel = document.getElementById('certLabel');
  if (currentRoadmap && currentRoadmap.certification_exam) {
    const certExam = currentRoadmap.certification_exam;
    if (certExam.passed) {
      if (examBtn) examBtn.style.display = 'none';
      if (viewCertBtn) {
        viewCertBtn.style.display = 'block';
        viewCertBtn.onclick = () => {
          window.location.href = `certificates.html?hash=${certExam.hash}`;
        };
      }
      if (certLabel) certLabel.textContent = '🎉 Certificate earned! You have successfully mastered this roadmap track.';
    } else if (!certExam.locked) {
      if (examBtn) {
        examBtn.style.display = 'block';
        examBtn.onclick = () => startCertificationExam();
      }
      if (viewCertBtn) viewCertBtn.style.display = 'none';
      if (certLabel) certLabel.textContent = 'All level assessments passed! Take the Final Certification Exam.';
    } else {
      if (examBtn) examBtn.style.display = 'none';
      if (viewCertBtn) viewCertBtn.style.display = 'none';
      if (certLabel) certLabel.textContent = 'Complete all level assessments to unlock Certification.';
    }
  }
}

// ── Tab Switching ──────────────────────────────────────────────
function switchTab(tabId) {
  document.querySelectorAll('.learn-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  document.querySelectorAll('.tab-panel').forEach(p => p.style.display = p.id === `tab-${tabId}` ? 'block' : 'none');
  if (tabId === 'quiz' && currentLessonId) {
    loadTopicQuiz(currentLessonId);
  }
}

document.querySelectorAll('.learn-tab').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ── Mark Complete Button ───────────────────────────────────────
document.getElementById('markCompleteBtn')?.addEventListener('click', completeLesson);

// ── Open Coding Lab Button ─────────────────────────────────────
document.getElementById('openCodingLabBtn')?.addEventListener('click', () => {
  const lang = currentLessonData?.lesson?.language || 'javascript';
  const code = currentLessonData?.lesson?.starter_code || '';
  openCodingLab(lang, code);
});

// ── Bookmark Button ────────────────────────────────────────────
document.getElementById('bookmarkModBtn')?.addEventListener('click', async () => {
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
document.getElementById('submitQuizBtn')?.addEventListener('click', () => {
  if (currentLessonUI?.schemaVersion === '2.0') {
    submitV2Quiz();
  } else {
    submitQuiz();
  }
});

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
