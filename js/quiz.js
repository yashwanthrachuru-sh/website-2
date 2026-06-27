// ============================================================
// js/quiz.js — EduNet Quiz Center (API Integrated)
// ============================================================
'use strict';
const session = window.initPageShell('quiz.html');
const { apiFetch, showToast, getXP, addXP } = window.EduNetAPI;

document.getElementById('quizXPDisplay').textContent = getXP();

let allQuizzes = [];
let filteredQuizzes = [];
let activeQuiz = null;
let quizQuestions = [];
let currentQIndex = 0;
let correctCount = 0;
let userAnswers = []; // store user selected choices for review
let timerInterval = null;
let timeLeft = 0;
let totalDuration = 0;

// Fetch quizzes list
async function loadQuizzes() {
  try {
    const data = await apiFetch('/api/quizzes');
    allQuizzes = data.quizzes || [];
    filteredQuizzes = [...allQuizzes];
    renderQuizLobby();
  } catch (err) {
    showToast('Failed to load quizzes: ' + err.message, 'error');
    allQuizzes = getFallbackQuizzes();
    filteredQuizzes = [...allQuizzes];
    renderQuizLobby();
  }
}

// Fetch quiz attempt history
async function loadHistory() {
  const historyBody = document.getElementById('quizHistoryBody');
  if (!historyBody) return;
  try {
    const data = await apiFetch('/api/quizzes/history');
    const history = data.history || [];
    if (!history.length) {
      historyBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--mist-dim);padding:1.5rem;">No quiz attempts logged yet. Start a quiz to build history!</td></tr>`;
      return;
    }
    historyBody.innerHTML = history.map(h => {
      const dt = new Date(h.attempted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      const pass = h.score >= 50;
      return `
        <tr>
          <td style="font-weight:600;">${h.quiz_title || `Quiz ${h.test_id}`}</td>
          <td><span class="badge ${h.difficulty === 'Easy' ? 'badge-green' : h.difficulty === 'Hard' ? 'badge-accent' : 'badge-blue'}">${h.difficulty}</span></td>
          <td>${h.type || 'MCQ'}</td>
          <td style="font-family:var(--font-mono);font-weight:700;color:${pass ? 'var(--emerald)' : 'var(--rose)'};">${h.score}%</td>
          <td><span class="badge ${pass ? 'badge-green' : 'badge-danger'}">${pass ? 'Passed' : 'Failed'}</span></td>
          <td style="color:var(--mist-dim);font-size:12px;">${dt}</td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    historyBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--rose);padding:1.5rem;">Failed to load history logs.</td></tr>`;
  }
}

function renderQuizLobby(cat = 'all') {
  const grid = document.getElementById('quizGrid');
  if (!grid) return;
  
  filteredQuizzes = allQuizzes.filter(q => {
    if (cat === 'all') return true;
    return q.type === cat || q.difficulty === cat;
  });

  grid.innerHTML = '';
  if (!filteredQuizzes.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--mist);padding:2rem;">No quizzes found in this category.</div>`;
    return;
  }

  filteredQuizzes.forEach(quiz => {
    const diffColor = quiz.difficulty === 'Easy' ? 'badge-green' : quiz.difficulty === 'Hard' ? 'badge-accent' : 'badge-blue';
    const card = document.createElement('div');
    card.className = 'quiz-select-card';
    const questionCount = quiz.question_count || 5;
    const estimatedTime = quiz.duration_minutes || (questionCount * 2);
    const xpVal = quiz.difficulty === 'Easy' ? 100 : quiz.difficulty === 'Hard' ? 250 : 150;

    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.75rem;">
        <div>
          <h3 style="font-size:15px;margin-bottom:.3rem;">${quiz.title}</h3>
          <div style="display:flex;gap:.4rem;flex-wrap:wrap;">
            <span class="badge ${diffColor}">${quiz.difficulty}</span>
            <span class="badge badge-muted">${quiz.type || 'MCQ'}</span>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:1.2rem;font-weight:700;color:var(--accent);">+${xpVal}</div>
          <div style="font-size:10px;color:var(--mist-dim);">XP</div>
        </div>
      </div>
      <div style="display:flex;gap:1rem;font-size:12px;color:var(--mist);margin-bottom:1rem;">
        <span>⏱ ${estimatedTime} min</span>
        <span>❓ ${questionCount} questions</span>
      </div>
      <button class="btn btn-primary btn-sm" style="width:100%;justify-content:center;" data-id="${quiz.id}">Start Quiz →</button>
    `;
    card.querySelector('button').addEventListener('click', () => startQuiz(quiz));
    grid.appendChild(card);
  });
}

async function startQuiz(quiz) {
  try {
    showToast('Loading quiz questions...', 'info');
    const data = await apiFetch(`/api/quizzes/${quiz.id}/questions`);
    if (!data.success || !data.questions || !data.questions.length) {
      throw new Error('No questions seeded for this quiz.');
    }
    
    activeQuiz = quiz;
    quizQuestions = data.questions;
    currentQIndex = 0;
    correctCount = 0;
    userAnswers = [];

    document.getElementById('quizLobby').style.display = 'none';
    document.getElementById('quizActive').style.display = 'block';

    const questionCount = quizQuestions.length;
    timeLeft = quizQuestions.length * 60; // 60 seconds per question
    totalDuration = timeLeft;

    renderQuestion();
    startTimer();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    const timerEl = document.getElementById('quizTimer');
    if (timerEl) {
      const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
      timerEl.textContent = m + ':' + String(s).padStart(2, '0');
      if (timeLeft < 30) timerEl.style.color = 'var(--rose)';
    }
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      finishQuiz();
    }
  }, 1000);
}

function renderQuestion() {
  const container = document.getElementById('quizContainer');
  if (!container || !activeQuiz || !quizQuestions.length) return;

  const q = quizQuestions[currentQIndex];
  container.innerHTML = `
    <div class="quiz-active-box" style="max-width:700px; margin:0 auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
        <div>
          <h3 style="font-size:16px;">${activeQuiz.title}</h3>
          <div style="font-size:12px;color:var(--mist);">Question ${currentQIndex + 1} of ${quizQuestions.length}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:var(--font-mono);font-size:1.2rem;color:var(--accent);" id="quizTimer">${Math.floor(timeLeft/60)}:${String(timeLeft%60).padStart(2,'0')}</div>
          <div style="font-size:11px;color:var(--mist-dim);">remaining</div>
        </div>
      </div>
      <div class="progress-bar" style="margin-bottom:1.5rem; height:6px;">
        <div class="progress-fill" style="width:${(currentQIndex / quizQuestions.length) * 100}%;"></div>
      </div>
      <div style="background:var(--abyss-2);border:1px solid var(--border);border-radius:var(--r-sm);padding:1.25rem;margin-bottom:1.5rem;">
        <p style="font-size:15px;font-weight:600;line-height:1.5;">${q.question_text}</p>
      </div>
      <div id="quizOptions" style="display:flex;flex-direction:column;gap:.65rem;margin-bottom:1.5rem;"></div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <button class="btn btn-secondary btn-sm" id="quitQuizBtn">✕ Quit Quiz</button>
        <span style="font-size:11px; color:var(--mist-dim); font-family:var(--font-mono);">+30 XP per correct answer</span>
      </div>
    </div>
  `;

  const optContainer = document.getElementById('quizOptions');
  const opts = [
    { key: 'A', text: q.option_a },
    { key: 'B', text: q.option_b },
    { key: 'C', text: q.option_c },
    { key: 'D', text: q.option_d }
  ].filter(o => o.text);

  opts.forEach(o => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.textContent = `${o.key}. ${o.text}`;
    btn.addEventListener('click', () => answerQuestion(o.key, btn));
    optContainer.appendChild(btn);
  });

  document.getElementById('quitQuizBtn')?.addEventListener('click', () => {
    clearInterval(timerInterval);
    backToLobby();
  });
}

function answerQuestion(selectedKey, btn) {
  const q = quizQuestions[currentQIndex];
  const allBtns = document.querySelectorAll('.quiz-option-btn');
  allBtns.forEach(b => b.disabled = true);

  const isCorrect = selectedKey === q.correct_option;
  userAnswers.push({
    question: q.question_text,
    selected: selectedKey,
    correct: q.correct_option,
    options: { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }
  });

  if (isCorrect) {
    btn.classList.add('correct');
    correctCount++;
    showToast('Correct! Keep it up.', 'success');
  } else {
    btn.classList.add('wrong');
    // Highlight the correct one
    allBtns.forEach(b => {
      if (b.textContent.startsWith(q.correct_option)) b.classList.add('correct');
    });
    showToast('Incorrect answer.', 'error');
  }

  setTimeout(() => {
    currentQIndex++;
    if (currentQIndex < quizQuestions.length) {
      renderQuestion();
    } else {
      clearInterval(timerInterval);
      finishQuiz();
    }
  }, 1200);
}

async function finishQuiz() {
  const pct = Math.round((correctCount / quizQuestions.length) * 100);
  const quizXP = activeQuiz.difficulty === 'Easy' ? 100 : activeQuiz.difficulty === 'Hard' ? 250 : 150;
  const earnedXP = Math.round(quizXP * (correctCount / quizQuestions.length));

  // Add client XP
  addXP(earnedXP);

  // Submit to backend
  try {
    await apiFetch(`/api/quizzes/${activeQuiz.id}/submit`, {
      method: 'POST',
      body: JSON.stringify({
        score: pct,
        totalQuestions: quizQuestions.length,
        correctAnswers: correctCount,
        feedback: `Scored ${correctCount}/${quizQuestions.length} on ${activeQuiz.title}`
      })
    });
    showToast('Attempt synced with profile!', 'success');
  } catch (err) {
    showToast('Failed to sync progress with cloud.', 'warning');
  }

  const container = document.getElementById('quizContainer');
  container.innerHTML = `
    <div class="quiz-active-box" style="text-align:center;max-width:600px;margin:0 auto;">
      <div style="font-size:3.5rem;margin-bottom:1rem;">${pct >= 70 ? '🎉' : '📚'}</div>
      <h2 style="margin-bottom:.5rem;">${pct >= 70 ? 'Mastery Unlocked!' : 'Practice Makes Perfect!'}</h2>
      <p style="color:var(--mist);font-size:14px;margin-bottom:1.5rem;">You answered <strong style="color:var(--frost);">${correctCount}/${quizQuestions.length}</strong> questions correctly (${pct}%)</p>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;">
        <div style="background:var(--abyss-2);border:1px solid var(--border);border-radius:var(--r-sm);padding:1rem;">
          <div style="font-size:1.6rem;font-weight:700;color:var(--accent);">+${earnedXP}</div>
          <div style="font-size:12px;color:var(--mist);">XP Gained</div>
        </div>
        <div style="background:var(--abyss-2);border:1px solid var(--border);border-radius:var(--r-sm);padding:1rem;">
          <div style="font-size:1.6rem;font-weight:700;">${pct}%</div>
          <div style="font-size:12px;color:var(--mist);">Grade Score</div>
        </div>
      </div>

      <h3 style="font-size:14px;text-align:left;margin-bottom:.75rem;">📖 Review Questions &amp; Answers</h3>
      <div id="reviewContainer" style="text-align:left;display:flex;flex-direction:column;gap:.75rem;max-height:220px;overflow-y:auto;background:var(--abyss-2);border:1px solid var(--border);border-radius:var(--r-sm);padding:1rem;margin-bottom:1.5rem;">
        ${userAnswers.map((ans, i) => {
          const isCorrect = ans.selected === ans.correct;
          return `
            <div style="border-bottom:1px solid var(--border);padding-bottom:.5rem;margin-bottom:.25rem;">
              <div style="font-size:13px;font-weight:600;display:flex;gap:8px;">
                <span style="color:${isCorrect ? 'var(--emerald)' : 'var(--rose)'}">${isCorrect ? '✓' : '✕'}</span>
                <span>${i + 1}. ${ans.question}</span>
              </div>
              <div style="font-size:12px;color:var(--mist);margin-top:4px;padding-left:1.25rem;">
                Your Answer: <span style="color:${isCorrect ? 'var(--emerald)' : 'var(--rose)'};">${ans.selected} (${ans.options[ans.selected] || ''})</span><br>
                Correct Answer: <span style="color:var(--emerald);">${ans.correct} (${ans.options[ans.correct]})</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-primary" id="retakeBtn">Retake Quiz</button>
        <button class="btn btn-secondary" id="backLobbyBtn">Back to Quizzes</button>
      </div>
    </div>
  `;

  document.getElementById('retakeBtn')?.addEventListener('click', () => startQuiz(activeQuiz));
  document.getElementById('backLobbyBtn')?.addEventListener('click', backToLobby);
  document.getElementById('quizXPDisplay').textContent = getXP();
  loadHistory();
}

function backToLobby() {
  document.getElementById('quizLobby').style.display = 'block';
  document.getElementById('quizActive').style.display = 'none';
  activeQuiz = null;
  loadHistory();
}

// Fallback quizzes if DB fails
function getFallbackQuizzes() {
  return [
    { id: 1, title: 'DSA Fundamentals', type: 'MCQ', difficulty: 'Easy', question_count: 3, duration_minutes: 5 },
    { id: 2, title: 'Python Basics', type: 'MCQ', difficulty: 'Easy', question_count: 3, duration_minutes: 5 },
    { id: 3, title: 'JavaScript Essentials', type: 'MCQ', difficulty: 'Intermediate', question_count: 3, duration_minutes: 5 },
  ];
}

// Category filter listeners
document.querySelectorAll('#quizFilterRow .filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('#quizFilterRow .filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderQuizLobby(this.getAttribute('data-qcat'));
  });
});

// Initial loading
loadQuizzes();
loadHistory();
