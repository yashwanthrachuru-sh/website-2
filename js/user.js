// ============================================================
// js/user.js — EduNet Student Dashboard
// Extended in Phase 2: heatmap, achievements, analytics charts,
// smart revision, DB-backed stats. All existing features kept.
// ============================================================
'use strict';

const { apiFetch, getToken, getSession, clearSession, showToast, getXP, addXP } = window.EduNetAPI;

// ── Auth Guard ─────────────────────────────────────────────────
const session = getSession();
const token   = getToken();
if (!token || !session) { window.location.href = 'index.html'; }

// ── Populate User Info ─────────────────────────────────────────
function initUserUI() {
  const name     = session.username || 'Student';
  const initials = name.slice(0, 2).toUpperCase();
  const branch   = session.branch || 'SDE';

  const set = (id, val, prop) => {
    const el = document.getElementById(id);
    if (el) { if (prop === 'text') el.textContent = val; else el[prop] = val; }
  };

  set('welcomeName',  name,   'text');
  set('sidebarName',  name,   'text');
  set('sidebarRole',  session.role || 'user', 'text');
  set('sidebarAvatar', initials, 'text');
  set('topbarAvatar',  initials, 'text');
  set('metricBranch',  branch,  'text');
}
initUserUI();

// ── XP Display (local cache) ────────────────────────────────────
function updateXPDisplay(xp) {
  xp = xp !== undefined ? xp : getXP();
  const level     = Math.floor(xp / 500) + 1;
  const xpInLevel = xp % 500;
  const pct       = (xpInLevel / 500) * 100;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const metricXP = document.getElementById('metricXP');
  if (metricXP) metricXP.textContent = xp.toLocaleString();

  const metricLvl = document.getElementById('metricLevel');
  if (metricLvl) metricLvl.textContent = level;

  set('xpLevelText',  'Lv ' + level);
  set('xpCurrentText', xp.toLocaleString() + ' XP');
  set('xpNextText',    (500 - xpInLevel) + ' XP to next level');

  const fill = document.getElementById('xpProgressFill');
  if (fill) setTimeout(() => { fill.style.width = pct + '%'; }, 100);
}
updateXPDisplay();

// ── Load Dashboard from Analytics API ─────────────────────────
async function loadDashboard() {
  try {
    const data = await apiFetch('/api/analytics/dashboard');
    if (!data.success) return;
    const d = data.dashboard;

    // Update stats band
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    updateXPDisplay(d.xp);
    setEl('metricLevel',   d.level || 1);
    setEl('metricStreak',  (d.streak || 0) + ' 🔥');
    setEl('dashStreakVal',  '🔥 ' + (d.streak || 0) + ' Day' + (d.streak === 1 ? '' : 's'));
    setEl('metricLessons', d.lessons_done || 0);
    setEl('metricModules', d.modules_done || 0);
    setEl('metricCerts',   d.certificates || 0);
    setEl('metricRank',    d.leaderboard_rank ? '#' + d.leaderboard_rank : '#—');
    setEl('metricBranch',  session.branch || 'SDE');

    // Cache XP locally too
    if (session.username && d.xp) {
      localStorage.setItem('edunet_xp_' + session.username, String(d.xp));
    }

    // Trigger achievement check silently
    apiFetch('/api/achievements/check', { method: 'POST' })
      .then(res => {
        if (res.newly_earned && res.newly_earned.length > 0) {
          res.newly_earned.forEach(a => {
            showToast(`🏆 Achievement unlocked: ${a.title}! ${a.xp_reward ? '+' + a.xp_reward + ' XP' : ''}`, 'success', 5000);
          });
          // Reload achievements after a short delay
          setTimeout(loadAchievements, 1200);
        }
      })
      .catch(() => {});

  } catch (err) {
    console.log('Dashboard load from API failed, using localStorage fallback:', err.message);
    // Fallback to localStorage
    updateXPDisplay();
  }
}
loadDashboard();

// ── Old compatibility functions (keep for other pages that import) ──
function updateProgressMetric() {
  const key     = 'edunet_rm_' + (session.username || '') + '_sde';
  const saved   = JSON.parse(localStorage.getItem(key) || '{}');
  const total   = Object.keys(saved).length;
  const done    = Object.values(saved).filter(Boolean).length;
  const pct     = total ? Math.round((done / total) * 100) : 0;
  // (metric-progress element removed in new layout — gracefully skip)
  const el = document.getElementById('metricProgress');
  if (el) el.textContent = pct + '%';
}
updateProgressMetric();

function updateCertCount() {
  const key   = 'edunet_certs_' + (session.username || '');
  const certs = JSON.parse(localStorage.getItem(key) || '[]');
  const el    = document.getElementById('metricCerts');
  if (el && el.textContent === '0') el.textContent = certs.length;
}
updateCertCount();

// ── Activity Feed (localStorage-based, keep as is) ────────────
function renderActivityFeed() {
  const feed = document.getElementById('activityFeed');
  if (!feed) return;
  const activities = JSON.parse(localStorage.getItem('edunet_activity_' + session.username) || '[]');
  const defaults   = [
    { icon: '🔐', text: 'Account activated', time: 'Just now' },
    { icon: '🗺', text: 'Joined the platform', time: 'Today' },
  ];
  const all = [...activities, ...defaults].slice(0, 6);
  feed.innerHTML = all.map((a, i) => `
    <div style="display:flex;align-items:center;gap:10px;padding:.85rem 1rem;${i < all.length - 1 ? 'border-bottom:1px solid var(--border);' : ''}">
      <div style="font-size:16px;flex-shrink:0;">${a.icon}</div>
      <div style="flex:1;">
        <div style="font-size:13px;color:var(--frost);font-weight:500;">${a.text}</div>
        <div style="font-size:11px;color:var(--mist-dim);">${a.time}</div>
      </div>
    </div>
  `).join('');
}
renderActivityFeed();

// ── Weekly XP Chart ────────────────────────────────────────────
let weeklyChartInstance = null;

async function loadWeeklyChart() {
  try {
    const data = await apiFetch('/api/analytics/weekly');
    if (!data.success) return;

    const labels = data.weekly.map(d => d.label);
    const xps    = data.weekly.map(d => d.xp_earned || 0);
    const total  = xps.reduce((a, b) => a + b, 0);

    const totalEl = document.getElementById('weeklyTotalXp');
    if (totalEl) totalEl.textContent = total.toLocaleString() + ' XP this week';

    const canvas = document.getElementById('weeklyChart');
    if (!canvas) return;

    if (weeklyChartInstance) weeklyChartInstance.destroy();

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 180);
    gradient.addColorStop(0, 'hsla(262,80%,70%,.35)');
    gradient.addColorStop(1, 'hsla(262,80%,70%,.02)');

    weeklyChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'XP Earned',
          data: xps,
          borderColor: 'hsl(262,80%,70%)',
          backgroundColor: gradient,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: 'hsl(262,80%,70%)',
          pointBorderColor: 'var(--void)',
          pointBorderWidth: 2,
          tension: 0.4,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'hsl(240,20%,10%)',
            borderColor: 'hsl(262,40%,35%)',
            borderWidth: 1,
            titleColor: 'hsl(262,80%,85%)',
            bodyColor: '#ccc',
            callbacks: {
              label: ctx => '  ' + ctx.parsed.y + ' XP earned',
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,.04)' },
            ticks: { color: '#6b6b8a', font: { size: 11 } }
          },
          y: {
            grid: { color: 'rgba(255,255,255,.04)' },
            ticks: { color: '#6b6b8a', font: { size: 11 } },
            beginAtZero: true,
          }
        }
      }
    });
  } catch (err) {
    console.log('Weekly chart failed:', err.message);
    // Draw empty state if Chart.js loaded
    const totalEl = document.getElementById('weeklyTotalXp');
    if (totalEl) totalEl.textContent = 'Start learning to earn XP!';
  }
}

// Delay chart init until Chart.js is loaded
if (document.readyState === 'complete') {
  loadWeeklyChart();
} else {
  window.addEventListener('load', loadWeeklyChart);
}

// ── Topic Insights ─────────────────────────────────────────────
async function loadTopicInsights() {
  try {
    const data = await apiFetch('/api/analytics/topics');
    if (!data.success) return;

    const ins = data.insights;

    const weakRow   = document.getElementById('weakTopicsRow');
    const strongRow = document.getElementById('strongTopicsRow');

    if (weakRow) {
      if (ins.weakest_topics && ins.weakest_topics.length) {
        weakRow.innerHTML = ins.weakest_topics.slice(0, 4).map(t =>
          `<span class="insight-pill weak">⚠ ${t.topic || 'Topic'} (${t.score}%)</span>`
        ).join('');
      } else {
        weakRow.innerHTML = '<span style="font-size:12px;color:var(--mist-dim);">Complete quizzes to see insights</span>';
      }
    }

    if (strongRow) {
      if (ins.strongest_topics && ins.strongest_topics.length) {
        strongRow.innerHTML = ins.strongest_topics.slice(0, 4).map(t =>
          `<span class="insight-pill strong">✓ ${t.topic || 'Topic'} (${t.score}%)</span>`
        ).join('');
      } else {
        strongRow.innerHTML = '<span style="font-size:12px;color:var(--mist-dim);">Keep learning!</span>';
      }
    }
  } catch (err) {
    const weakRow = document.getElementById('weakTopicsRow');
    if (weakRow) weakRow.innerHTML = '<span style="font-size:12px;color:var(--mist-dim);">Earn quiz scores to see insights</span>';
    const strongRow = document.getElementById('strongTopicsRow');
    if (strongRow) strongRow.innerHTML = '';
  }
}
loadTopicInsights();

// ── GitHub-style Learning Heatmap ─────────────────────────────
async function loadHeatmap() {
  const grid      = document.getElementById('heatmapGrid');
  const monthsEl  = document.getElementById('heatmapMonths');
  const totalEl   = document.getElementById('heatmapTotal');
  const tooltip   = document.getElementById('hmTooltip');
  if (!grid) return;

  // Build 364 day range (52 weeks, starting last Sunday)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOffset = (today.getDay() + 1) % 7; // days since last Sunday
  const start = new Date(today);
  start.setDate(today.getDate() - 363 - startOffset);

  // Fetch heatmap data from API
  let activityMap = {};
  try {
    const data = await apiFetch('/api/analytics/heatmap?days=365');
    if (data.success && data.heatmap) {
      data.heatmap.forEach(row => {
        activityMap[row.day] = {
          lessons:  row.lessons_done || 0,
          xp:       row.xp_earned || 0,
          coding:   row.coding_minutes || 0,
          quizzes:  row.quiz_attempts || 0,
        };
      });
    }
  } catch (e) { /* show empty heatmap */ }

  let totalActiveDays = 0;
  const cells = [];
  const monthLabels = []; // { month: 'Jan', col: N }
  let prevMonth = -1;

  for (let i = 0; i < 364; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    const dayStr  = d.toISOString().slice(0, 10);
    const act     = activityMap[dayStr];
    const lessons = act?.lessons || 0;
    const xp      = act?.xp || 0;

    let level = 0;
    if (xp > 0 || lessons > 0) {
      totalActiveDays++;
      const score = (lessons * 2) + (xp / 50);
      if (score < 2)       level = 1;
      else if (score < 5)  level = 2;
      else if (score < 10) level = 3;
      else                 level = 4;
    }

    // Month label tracking
    const col = Math.floor(i / 7);
    const month = d.getMonth();
    if (month !== prevMonth) {
      monthLabels.push({ month: d.toLocaleDateString('en-US', { month: 'short' }), col });
      prevMonth = month;
    }

    cells.push({ dayStr, level, act, d });
  }

  // Month label row
  if (monthsEl) {
    const totalCols = Math.ceil(364 / 7);
    const colWidth  = 16; // 13px cell + 3px gap
    monthsEl.innerHTML = monthLabels.map((ml, idx) => {
      const nextCol = monthLabels[idx + 1]?.col ?? totalCols;
      const width   = (nextCol - ml.col) * colWidth;
      return `<div style="width:${width}px;flex-shrink:0;">${ml.month}</div>`;
    }).join('');
  }

  // Render cells
  grid.innerHTML = '';
  cells.forEach(({ dayStr, level, act, d }) => {
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    if (level > 0) cell.setAttribute('data-level', level);
    cell.title = '';

    // Tooltip on hover
    const friendly = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const xpStr    = act?.xp ? ` · ${act.xp} XP` : '';
    const lesStr   = act?.lessons ? ` · ${act.lessons} lesson${act.lessons > 1 ? 's' : ''}` : '';
    const summary  = (act?.xp || act?.lessons) ? `${friendly}${xpStr}${lesStr}` : `No activity — ${friendly}`;

    cell.addEventListener('mouseenter', (e) => {
      tooltip.textContent = summary;
      tooltip.style.display = 'block';
      tooltip.style.left = (e.clientX + 14) + 'px';
      tooltip.style.top  = (e.clientY - 30) + 'px';
    });
    cell.addEventListener('mousemove', (e) => {
      tooltip.style.left = (e.clientX + 14) + 'px';
      tooltip.style.top  = (e.clientY - 30) + 'px';
    });
    cell.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });

    grid.appendChild(cell);
  });

  // Apply legend cell colors
  document.querySelectorAll('.heatmap-legend-cell[data-level]').forEach(c => {
    const lv = c.getAttribute('data-level');
    const colors = { '1': 'hsl(262,60%,28%)', '2': 'hsl(262,70%,45%)', '3': 'hsl(262,80%,60%)', '4': 'hsl(262,90%,72%)' };
    c.style.background = colors[lv] || 'var(--border)';
  });

  if (totalEl) {
    totalEl.textContent = totalActiveDays
      ? `${totalActiveDays} active day${totalActiveDays > 1 ? 's' : ''} in the last year`
      : 'Start learning to see your activity!';
  }
}
loadHeatmap();

// ── Smart Revision Widget ──────────────────────────────────────
// Shows topics to review based on weak quiz scores
async function loadRevisionWidget() {
  const widget = document.getElementById('revisionWidget');
  if (!widget) return;

  try {
    const data = await apiFetch('/api/analytics/topics');
    const weak = data?.insights?.weakest_topics || [];

    // Also get recently viewed modules
    const recent = JSON.parse(localStorage.getItem('edunet_recent_modules_' + session.username) || '[]');

    const items = [];

    // Add weak topics first
    weak.slice(0, 3).forEach(t => {
      items.push({
        icon: '⚠️',
        label: t.topic || 'Topic',
        sub: `Quiz score: ${t.score}% — needs review`,
        color: 'hsl(0,60%,20%)',
        href: 'roadmaps.html',
      });
    });

    // Pad with recent modules if needed
    recent.slice(0, 3 - items.length).forEach(m => {
      items.push({
        icon: '📖',
        label: m.title || 'Module',
        sub: 'Continue where you left off',
        color: 'hsl(220,50%,20%)',
        href: 'roadmaps.html',
      });
    });

    if (!items.length) {
      widget.innerHTML = `
        <div style="text-align:center;padding:1.5rem;color:var(--mist-dim);">
          <div style="font-size:1.5rem;margin-bottom:.4rem;">🎉</div>
          <div style="font-size:13px;">No urgent reviews! Keep learning new topics.</div>
          <a href="roadmaps.html" class="btn btn-primary btn-sm" style="margin-top:.75rem;display:inline-flex;">Browse Roadmaps</a>
        </div>`;
      return;
    }

    widget.innerHTML = items.map(item => `
      <a href="${item.href}" class="revision-item" style="text-decoration:none;color:inherit;margin-bottom:.5rem;display:flex;">
        <div class="revision-badge" style="background:${item.color};">${item.icon}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:600;color:var(--frost);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${item.label}</div>
          <div style="font-size:11px;color:var(--mist-dim);">${item.sub}</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;color:var(--mist-dim);margin-left:.5rem;"><path d="M9 18l6-6-6-6"/></svg>
      </a>
    `).join('');

  } catch (err) {
    if (widget) {
      widget.innerHTML = `
        <div style="font-size:12.5px;color:var(--mist-dim);padding:.5rem;">
          Complete some quizzes to see personalized review suggestions.
        </div>`;
    }
  }
}
loadRevisionWidget();

// ── Real Achievements Grid ─────────────────────────────────────
async function loadAchievements() {
  const skeleton = document.getElementById('achSkeleton');
  const grid     = document.getElementById('achGrid');
  const countEl  = document.getElementById('achEarnedCount');
  if (!grid) return;

  try {
    const data = await apiFetch('/api/achievements');
    if (!data.success) return;

    const achievements = data.achievements || [];
    const earned       = achievements.filter(a => a.earned);

    if (countEl) countEl.textContent = `${earned.length} / ${achievements.length} earned`;

    if (skeleton) skeleton.style.display = 'none';
    grid.style.display = 'grid';

    grid.innerHTML = achievements.map(a => `
      <div class="ach-badge ${a.earned ? 'earned' : 'locked'}" 
           title="${a.description}${a.earned ? '\nEarned!' : '\n' + a.condition_value + ' needed'}">
        <div class="ach-icon">${a.icon}</div>
        <div class="ach-name">${a.title}</div>
        <div class="ach-desc">${a.description}</div>
        ${a.xp_reward > 0 ? `<div style="font-size:10px;color:hsl(262,80%,70%);margin-top:.25rem;font-family:var(--font-mono);">+${a.xp_reward} XP</div>` : ''}
      </div>
    `).join('');

  } catch (err) {
    // Fallback to static badges if API fails
    if (skeleton) skeleton.style.display = 'none';
    if (grid) {
      grid.style.display = 'grid';
      grid.innerHTML = `
        <div class="ach-badge earned"><div class="ach-icon">🛡️</div><div class="ach-name">Auth Guard</div><div class="ach-desc">Account verified and approved.</div></div>
        <div class="ach-badge locked"><div class="ach-icon">⚡</div><div class="ach-name">Quiz Hero</div><div class="ach-desc">Complete your first quiz to unlock.</div></div>
        <div class="ach-badge locked"><div class="ach-icon">💻</div><div class="ach-name">Compiler Slayer</div><div class="ach-desc">Run code in the coding lab to unlock.</div></div>
        <div class="ach-badge locked"><div class="ach-icon">🗺️</div><div class="ach-name">Roadmap Pioneer</div><div class="ach-desc">Complete 3 roadmap nodes to unlock.</div></div>
      `;
    }
    if (countEl) countEl.textContent = '';
  }
}
loadAchievements();

// ── Videos from Backend ────────────────────────────────────────
async function loadVideos() {
  const grid = document.getElementById('videosGrid');
  if (!grid) return;
  try {
    const data   = await apiFetch('/api/videos?limit=6');
    const videos = data.videos || [];
    if (!videos.length) return;

    grid.innerHTML = '';
    videos.forEach(v => {
      const card = document.createElement('div');
      card.className = 'video-card';
      card.setAttribute('data-vcat', v.category || 'General');
      card.innerHTML = `
        <div class="video-thumb">
          <img src="${v.thumbnail}" alt="${v.title}" onerror="this.style.display='none'" loading="lazy">
          <div class="play-overlay">
            <div class="play-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
            </div>
          </div>
          ${v.pinned ? '<div class="pin-badge">📌 PINNED</div>' : ''}
        </div>
        <div class="video-body">
          <h4>${v.title}</h4>
          <p>${v.description || ''}</p>
          <div class="video-meta">
            <span class="badge badge-accent">${v.category || 'General'}</span>
            ${v.instructor ? `<span style="font-size:11px;color:var(--mist-dim);">${v.instructor}</span>` : ''}
            ${v.duration   ? `<span style="font-size:11px;color:var(--mist-dim);">${v.duration}</span>` : ''}
          </div>
        </div>
      `;
      card.querySelector('.video-thumb').addEventListener('click', () => openVideoModal(v));
      grid.appendChild(card);
    });

    document.querySelectorAll('#videoFilterRow .filter-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#videoFilterRow .filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const cat = this.getAttribute('data-vcat');
        grid.querySelectorAll('.video-card').forEach(c => {
          const vc = c.getAttribute('data-vcat') || '';
          c.style.display = (cat === 'all' || vc.toLowerCase().includes(cat.toLowerCase())) ? '' : 'none';
        });
      });
    });
  } catch (err) {
    console.log('Videos load failed (no data yet):', err.message);
  }
}

function openVideoModal(v) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:9000;display:flex;align-items:center;justify-content:center;padding:1rem;';
  overlay.innerHTML = `
    <div style="width:100%;max-width:840px;background:var(--abyss);border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;border-bottom:1px solid var(--border);">
        <h4 style="font-size:15px;">${v.title}</h4>
        <button onclick="this.closest('[style*=position]').remove()" style="background:none;border:none;color:var(--mist);font-size:22px;cursor:pointer;">&times;</button>
      </div>
      <div style="position:relative;aspect-ratio:16/9;">
        <iframe src="${v.embed_url}?autoplay=1" width="100%" height="100%" style="border:none;display:block;" allowfullscreen allow="autoplay;encrypted-media"></iframe>
      </div>
      <div style="padding:1rem 1.25rem;">
        <p style="font-size:13px;color:var(--mist);">${v.description || ''}</p>
        ${v.tags ? `<div style="margin-top:.5rem;display:flex;gap:.4rem;flex-wrap:wrap;">${v.tags.split(',').map(t=>`<span class="badge badge-muted">${t.trim()}</span>`).join('')}</div>` : ''}
      </div>
    </div>
  `;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}
loadVideos();

// ── Sidebar & Burger ───────────────────────────────────────────
const dashSidebar    = document.getElementById('dashSidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const burgerBtn      = document.getElementById('burgerBtn');

const openSidebar  = () => { dashSidebar.classList.add('open'); sidebarOverlay.classList.add('open'); };
const closeSidebar = () => { dashSidebar.classList.remove('open'); sidebarOverlay.classList.remove('open'); };

if (burgerBtn) burgerBtn.addEventListener('click', openSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

// ── Search Modal ───────────────────────────────────────────────
const searchModal  = document.getElementById('searchModal');
const searchInput  = document.getElementById('searchInput');
const searchList   = document.getElementById('searchResultsList');
const topbarSearch = document.getElementById('topbarSearch');

const SEARCH_INDEX = [
  { title:'DSA Roadmap',       desc:'Data Structures & Algorithms path',  cat:'Roadmaps', link:'roadmaps.html',    icon:'🗺' },
  { title:'Python Roadmap',    desc:'Python developer path',              cat:'Roadmaps', link:'roadmaps.html',    icon:'🗺' },
  { title:'Web Development',   desc:'Full stack web dev roadmap',         cat:'Roadmaps', link:'roadmaps.html',    icon:'🗺' },
  { title:'Machine Learning',  desc:'ML engineer roadmap',                cat:'Roadmaps', link:'roadmaps.html',    icon:'🗺' },
  { title:'CodeSynth AI',      desc:'DSA solution generator',             cat:'AI Tools', link:'ai-tools.html',   icon:'🛠' },
  { title:'Coding Lab',        desc:'Browser code editor',                cat:'Tools',    link:'coding-lab.html', icon:'💻' },
  { title:'Quiz Center',       desc:'MCQ & XP quizzes',                   cat:'Quizzes',  link:'quiz.html',        icon:'🧠' },
  { title:'Resume Builder',    desc:'ATS resume builder',                 cat:'Career',   link:'resume.html',      icon:'📄' },
  { title:'Interview Prep',    desc:'Technical interview practice',       cat:'Career',   link:'interview.html',   icon:'💼' },
  { title:'Certificates',      desc:'View earned certificates',           cat:'Career',   link:'certificates.html',icon:'🏆' },
  { title:'Leaderboard',       desc:'XP rankings',                        cat:'Account',  link:'leaderboard.html', icon:'🥇' },
  { title:'Bookmarks',         desc:'Saved tools and roadmaps',           cat:'Account',  link:'bookmarks.html',   icon:'🔖' },
  { title:'Profile',           desc:'Manage your profile',                cat:'Account',  link:'profile.html',     icon:'👤' },
  { title:'Settings',          desc:'Account settings',                   cat:'Account',  link:'settings.html',    icon:'⚙️' },
  { title:'Notifications',     desc:'View notifications',                 cat:'Account',  link:'notifications.html',icon:'🔔'},
];

function openSearch() { searchModal.classList.add('open'); setTimeout(() => searchInput.focus(), 80); }
function closeSearch() { searchModal.classList.remove('open'); searchInput.value = ''; searchList.innerHTML = ''; }

if (topbarSearch) topbarSearch.addEventListener('click', openSearch);
searchModal.addEventListener('click', e => { if (e.target === searchModal) closeSearch(); });
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSearch();
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
});
searchInput.addEventListener('input', async () => {
  const q = searchInput.value.trim();
  searchList.innerHTML = '';
  if (!q) {
    SEARCH_INDEX.slice(0, 5).forEach(item => {
      const el = document.createElement('div');
      el.className = 'search-result-item';
      el.innerHTML = `<div class="search-result-icon">${item.icon}</div><div class="search-result-info"><div class="search-result-title">${item.title}</div><div class="search-result-desc">${item.desc}</div></div><div class="search-result-cat">${item.cat}</div>`;
      el.addEventListener('click', () => { closeSearch(); window.location.href = item.link; });
      searchList.appendChild(el);
    });
    return;
  }

  try {
    const res = await apiFetch('/api/roadmaps/search?q=' + encodeURIComponent(q));
    if (res.success && res.results) {
      const results = res.results;
      if (!results.length) {
        searchList.innerHTML = '<div class="search-no-results">No results found in database.</div>';
        return;
      }
      results.forEach(item => {
        const el = document.createElement('div');
        el.className = 'search-result-item';
        const typeIcons = { roadmap: '🗺', module: '📦', lesson: '📖', user: '👤', certificate: '🏆' };
        const icon = item.icon || typeIcons[item.type] || '🔍';

        const regex = new RegExp(`(${q})`, 'gi');
        const titleHighlighted = item.title.replace(regex, '<mark style="background:hsl(262,80%,30%);color:#fff;border-radius:2px;padding:0 2px;">$1</mark>');
        const descHighlighted = (item.rdesc || '').replace(regex, '<mark style="background:hsl(262,80%,30%);color:#fff;border-radius:2px;padding:0 2px;">$1</mark>');

        el.innerHTML = `
          <div class="search-result-icon">${icon}</div>
          <div class="search-result-info">
            <div class="search-result-title">${titleHighlighted}</div>
            <div class="search-result-desc">${descHighlighted}</div>
          </div>
          <div class="search-result-cat" style="text-transform:capitalize;">${item.type}</div>
        `;
        el.addEventListener('click', () => {
          closeSearch();
          if (item.type === 'roadmap') {
            window.location.href = `roadmaps.html?id=${item.id}`;
          } else if (item.type === 'module') {
            window.location.href = `roadmaps.html`;
          } else if (item.type === 'lesson') {
            window.location.href = `roadmaps.html`;
          } else {
            window.location.href = item.link || 'user.html';
          }
        });
        searchList.appendChild(el);
      });
    }
  } catch (e) {
    const hits = SEARCH_INDEX.filter(d => d.title.toLowerCase().includes(q.toLowerCase()) || d.desc.toLowerCase().includes(q.toLowerCase()));
    if (!hits.length) { searchList.innerHTML = '<div class="search-no-results">No results found.</div>'; return; }
    hits.slice(0, 8).forEach(item => {
      const el = document.createElement('div');
      el.className = 'search-result-item';
      el.innerHTML = `<div class="search-result-icon">${item.icon}</div><div class="search-result-info"><div class="search-result-title">${item.title}</div><div class="search-result-desc">${item.desc}</div></div><div class="search-result-cat">${item.cat}</div>`;
      el.addEventListener('click', () => { closeSearch(); window.location.href = item.link; });
      searchList.appendChild(el);
    });
  }
});

// ── Bookmarks & Saved Programs (localStorage) ─────────────────
function renderDashboardLists() {
  const bmList = document.getElementById('dashBookmarksList');
  if (bmList) {
    const bms = JSON.parse(localStorage.getItem('edunet_bm_' + session?.username) || '[]');
    if (!bms.length) {
      bmList.innerHTML = '<div style="color:var(--mist-dim);font-size:11.5px;">No bookmarked items.</div>';
    } else {
      bmList.innerHTML = bms.slice(0, 4).map(b => `
        <div style="display:flex;justify-content:space-between;align-items:center;background:var(--abyss-2);border:1px solid var(--border);border-radius:var(--r-xs);padding:.4rem .6rem;">
          <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:130px;" title="${b.title || b.id}">
            ${b.type === 'tool' ? '🛠' : b.type === 'video' ? '🎬' : '🗺'} ${b.title || b.id}
          </span>
          <a href="${b.type === 'tool' ? 'ai-tools.html' : b.type === 'video' ? 'videos.html' : 'roadmaps.html'}" style="font-size:11px;color:var(--accent);">View</a>
        </div>
      `).join('');
    }
  }

  const filesList = document.getElementById('dashSavedProgramsList');
  if (filesList) {
    const langNames = { javascript:'JS', python:'Python', java:'Java', cpp:'C++', html:'HTML', sql:'SQL' };
    const savedLangs = Object.keys(langNames).filter(l => localStorage.getItem('edunet_code_' + l + '_' + session?.username));
    if (!savedLangs.length) {
      filesList.innerHTML = '<div style="color:var(--mist-dim);font-size:11.5px;">No saved programs yet.</div>';
    } else {
      filesList.innerHTML = savedLangs.slice(0, 4).map(f => `
        <div style="display:flex;justify-content:space-between;align-items:center;background:var(--abyss-2);border:1px solid var(--border);border-radius:var(--r-xs);padding:.4rem .6rem;">
          <span>💻 script.${f === 'javascript' ? 'js' : f === 'python' ? 'py' : f} (${langNames[f]})</span>
          <a href="coding-lab.html" style="font-size:11px;color:var(--accent);">Open</a>
        </div>
      `).join('');
    }
  }
}
renderDashboardLists();

// ── Daily Challenge ────────────────────────────────────────────
function initDailyChallenge() {
  const btn  = document.getElementById('dashChallengeActionBtn');
  if (!btn) return;

  const key = 'edunet_challenge_' + session?.username + '_' + new Date().toDateString();
  if (localStorage.getItem(key) === 'true') {
    btn.textContent = '✓ Challenge Completed';
    btn.className   = 'btn btn-secondary btn-sm btn-full';
    btn.disabled    = true;
  }

  btn.addEventListener('click', () => {
    localStorage.setItem(key, 'true');
    btn.textContent = '✓ Challenge Completed';
    btn.className   = 'btn btn-secondary btn-sm btn-full';
    btn.disabled    = true;
    addXP(100);
    showToast('Challenge completed! +100 XP gained.', 'success');
    updateXPDisplay();
  });
}
initDailyChallenge();

// ── Logout ─────────────────────────────────────────────────────
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    clearSession();
    showToast('Logged out successfully.', 'info');
    setTimeout(() => window.location.href = 'index.html', 600);
  });
}
