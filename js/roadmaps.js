// ============================================================
// js/roadmaps.js — EduNet Roadmaps Grid Page
// ============================================================
'use strict';

const session = window.initPageShell('roadmaps.html');
const { apiFetch, showToast, getSession } = window.EduNetAPI;

let allRoadmaps = [];
let activeFilter = 'all';
let searchQuery = '';

// ── Init ────────────────────────────────────────────────────────
async function init() {
  await Promise.all([loadRoadmaps(), loadUserStats()]);
}

// ── Load Roadmaps from API ──────────────────────────────────────
async function loadRoadmaps() {
  try {
    const data = await apiFetch('/api/roadmaps');
    if (!data.success) throw new Error(data.message || 'Failed');
    allRoadmaps = data.roadmaps || [];
    document.getElementById('heroRoadmapCount').textContent = allRoadmaps.length;
    renderRoadmaps();
  } catch (err) {
    console.error('Load roadmaps error:', err);
    // Fallback to static data
    allRoadmaps = getStaticRoadmaps();
    renderRoadmaps();
    showToast('Using cached roadmap data.', 'warning');
  }
}

// ── Load User Stats ─────────────────────────────────────────────
async function loadUserStats() {
  try {
    const data = await apiFetch('/api/roadmaps/user/stats');
    if (data.success && data.stats) {
      const s = data.stats;
      if (s.roadmaps_started > 0) {
        document.getElementById('userStatsBar').style.display = 'flex';
        document.getElementById('statRoadmaps').textContent = s.roadmaps_started;
        document.getElementById('statModules').textContent = s.modules_completed;
        document.getElementById('statChallenges').textContent = s.challenges_done;
        document.getElementById('statCerts').textContent = s.certificates;
      }
    }
  } catch (err) {
    // Stats not available (not logged in), ignore
  }
}

// ── Render Grid ─────────────────────────────────────────────────
function renderRoadmaps() {
  const grid = document.getElementById('roadmapsGrid');
  if (!grid) return;

  const filtered = allRoadmaps.filter(rm => {
    if (activeFilter !== 'all' && rm.difficulty !== activeFilter) return false;
    if (searchQuery) {
      const hay = (rm.title + ' ' + rm.description + ' ' + (rm.tags || '') + ' ' + (rm.category || '')).toLowerCase();
      if (!hay.includes(searchQuery)) return false;
    }
    return true;
  });

  grid.innerHTML = '';
  if (!filtered.length) {
    grid.innerHTML = `<p style="color:var(--mist);padding:2rem;grid-column:1/-1;text-align:center;">No roadmaps match your filter.</p>`;
    return;
  }

  filtered.forEach(rm => {
    const pct = rm.progress_pct || 0;
    const done = rm.modules_done || 0;
    const total = rm.module_count || rm.lesson_count || 12;
    const hasProgress = pct > 0;
    const diffColor = rm.difficulty === 'Beginner' ? 'badge-green' : rm.difficulty === 'Intermediate' ? 'badge-blue' : 'badge-accent';

    const card = document.createElement('div');
    card.className = `rm-card ${hasProgress ? 'enrolled' : ''}`;

    // Salary range display
    const salaryStr = rm.salary_min && rm.salary_max
      ? `$${Math.round(rm.salary_min / 1000)}k–$${Math.round(rm.salary_max / 1000)}k/yr`
      : '';

    card.innerHTML = `
      ${rm.is_featured ? '<div class="rm-featured-badge">⭐ Featured</div>' : ''}
      <div class="rm-card-top">
        <div class="rm-icon">${rm.icon || '📚'}</div>
        <div style="flex:1;min-width:0;">
          <div class="rm-title">${rm.title}</div>
          <div class="rm-cat">${rm.category || 'Programming'}</div>
        </div>
        <span class="badge ${diffColor}" style="flex-shrink:0;">${rm.difficulty}</span>
      </div>
      <p class="rm-desc">${rm.description || ''}</p>

      ${hasProgress ? `
        <div class="rm-progress-wrap">
          <div class="rm-progress-row">
            <span>${done} of ${total} modules</span>
            <span class="rm-progress-pct">${pct}%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;"></div></div>
        </div>
      ` : ''}

      <div class="rm-stats">
        <div class="rm-stat">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          ${rm.duration || '12 weeks'}
        </div>
        <div class="rm-stat">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          +${rm.xp_reward || 2000} XP
        </div>
        <div class="rm-stat">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
          ${total} modules
        </div>
        ${salaryStr ? `<div class="rm-stat">💰 ${salaryStr}</div>` : ''}
      </div>

      <div class="rm-footer">
        <div style="display:flex;gap:.4rem;align-items:center;">
          ${pct === 100 ? '<span class="badge badge-green">✓ Complete</span>' : ''}
          ${pct === 100 ? '<a href="certificates.html" class="btn btn-secondary btn-sm">Certificate</a>' : ''}
        </div>
        <button class="btn btn-primary btn-sm start-btn" data-rmid="${rm.id}">
          ${pct === 100 ? '🏆 Review' : pct > 0 ? '▶ Continue' : '→ Start'}
        </button>
      </div>
    `;

    card.querySelector('.start-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = `roadmap-learn.html?rm=${rm.id}`;
    });
    card.addEventListener('click', () => {
      window.location.href = `roadmap-learn.html?rm=${rm.id}`;
    });

    grid.appendChild(card);
  });
}

// ── Filters ─────────────────────────────────────────────────────
document.querySelectorAll('#rmFilterRow .filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('#rmFilterRow .filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    activeFilter = this.dataset.diff || 'all';
    renderRoadmaps();
  });
});

// ── Search ──────────────────────────────────────────────────────
document.getElementById('rmSearchBar')?.addEventListener('input', function () {
  searchQuery = this.value.toLowerCase().trim();
  renderRoadmaps();
});

// ── Global Search Modal ─────────────────────────────────────────
document.getElementById('searchInput')?.addEventListener('input', async function () {
  const q = this.value.trim();
  const list = document.getElementById('searchResultsList');
  if (!q || q.length < 2) { list.innerHTML = ''; return; }

  list.innerHTML = '<div style="padding:.75rem;color:var(--mist);font-size:13px;">Searching...</div>';
  try {
    const data = await apiFetch(`/api/roadmaps/search?q=${encodeURIComponent(q)}`);
    const results = data.results || [];

    if (!results.length) {
      // Fallback to local search
      const local = allRoadmaps.filter(r =>
        r.title.toLowerCase().includes(q.toLowerCase()) ||
        (r.description || '').toLowerCase().includes(q.toLowerCase())
      );
      list.innerHTML = local.length
        ? local.slice(0, 8).map(r => `
            <div class="search-result-item" onclick="window.location.href='roadmap-learn.html?rm=${r.id}'">
              <div class="search-result-icon">${r.icon || '🗺️'}</div>
              <div class="search-result-info">
                <div class="search-result-title">${r.title}</div>
                <div class="search-result-desc">${(r.description || '').slice(0, 80)}...</div>
              </div>
              <div class="search-result-cat">Roadmap</div>
            </div>`).join('')
        : '<div class="search-no-results">No results found.</div>';
      return;
    }

    list.innerHTML = results.map(r => `
      <div class="search-result-item" onclick="window.location.href='roadmap-learn.html?rm=${r.type === 'roadmap' ? r.id : ''}${r.type === 'module' ? `webdev&m=${r.id}` : ''}'">
        <div class="search-result-icon">${r.icon || (r.type === 'roadmap' ? '🗺️' : '📚')}</div>
        <div class="search-result-info">
          <div class="search-result-title">${r.title}</div>
          <div class="search-result-desc">${(r.rdesc || '').slice(0, 80)}...</div>
        </div>
        <div class="search-result-cat">${r.type === 'roadmap' ? 'Roadmap' : 'Module'}</div>
      </div>`).join('');
  } catch (err) {
    list.innerHTML = '<div class="search-no-results">Search error. Try again.</div>';
  }
});

// ── Static Fallback ─────────────────────────────────────────────
function getStaticRoadmaps() {
  return [
    {id:'webdev',  icon:'🌐', title:'Web Development',       category:'Web Dev',    difficulty:'Beginner',     description:'Build full-stack apps with HTML, CSS, JS, React, and Node.js.', duration:'16 weeks', xp_reward:2400, module_count:12, is_featured:1},
    {id:'python',  icon:'🐍', title:'Python',                category:'Programming',difficulty:'Beginner',     description:'Master Python from basics through Flask, Django, and automation.', duration:'12 weeks', xp_reward:2000, module_count:12, is_featured:1},
    {id:'java',    icon:'☕', title:'Java',                  category:'Programming',difficulty:'Intermediate',  description:'Java ecosystem from fundamentals to Spring Boot and microservices.', duration:'14 weeks', xp_reward:2100, module_count:12, is_featured:1},
    {id:'dsa',     icon:'🌳', title:'Data Structures',       category:'Programming',difficulty:'Intermediate',  description:'Master every DS from arrays to advanced graphs and dynamic programming.', duration:'16 weeks', xp_reward:3000, module_count:12, is_featured:1},
    {id:'ml',      icon:'🤖', title:'Machine Learning',      category:'AI/ML',      difficulty:'Advanced',      description:'Train, evaluate, and deploy ML models with Python and TensorFlow.', duration:'20 weeks', xp_reward:3200, module_count:12, is_featured:1},
    {id:'ai',      icon:'🧠', title:'Artificial Intelligence',category:'AI/ML',     difficulty:'Advanced',      description:'NLP, Transformers, LLMs, LangChain, RAG pipelines, and AI Agents.', duration:'20 weeks', xp_reward:3500, module_count:12, is_featured:1},
    {id:'sql',     icon:'🗄️', title:'SQL & Databases',       category:'Data',       difficulty:'Beginner',     description:'Master SQL from basic queries to advanced optimization.', duration:'8 weeks', xp_reward:1400, module_count:12, is_featured:1},
    {id:'cpp',     icon:'⚡', title:'C++',                   category:'Programming',difficulty:'Intermediate',  description:'High-performance C++ with STL, OOP, templates, and competitive programming.', duration:'14 weeks', xp_reward:2400, module_count:12, is_featured:0},
    {id:'c',       icon:'🔵', title:'C Programming',         category:'Programming',difficulty:'Beginner',     description:'Master procedural C with memory management and pointers.', duration:'10 weeks', xp_reward:1800, module_count:12, is_featured:0},
    {id:'js',      icon:'💛', title:'JavaScript',            category:'Web Dev',    difficulty:'Beginner',     description:'Deep-dive into modern JS — DOM, async/await, closures, ES6+.', duration:'10 weeks', xp_reward:2000, module_count:12, is_featured:1},
  ];
}

// ── Logout ──────────────────────────────────────────────────────
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  window.EduNetAPI.clearSession();
  showToast('Logged out.', 'info');
  setTimeout(() => window.location.href = 'index.html', 600);
});

// ── Start ───────────────────────────────────────────────────────
init();
