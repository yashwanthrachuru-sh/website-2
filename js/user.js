// ============================================================
// js/user.js — EduNet Student Dashboard
// ============================================================
'use strict';

const { apiFetch, getToken, getSession, clearSession, showToast, getXP, addXP } = window.EduNetAPI;

// ── Auth Guard ─────────────────────────────────────────────────
const session = getSession();
const token = getToken();
if (!token || !session) { window.location.href = 'index.html'; }

// ── Populate User Info ─────────────────────────────────────────
function initUserUI() {
  const name = session.username || 'Student';
  const initials = name.slice(0, 2).toUpperCase();
  const branch = session.branch || 'SDE';

  const elems = {
    welcomeName: document.getElementById('welcomeName'),
    sidebarName: document.getElementById('sidebarName'),
    sidebarRole: document.getElementById('sidebarRole'),
    sidebarAvatar: document.getElementById('sidebarAvatar'),
    topbarAvatar: document.getElementById('topbarAvatar'),
    metricBranch: document.getElementById('metricBranch'),
  };

  if (elems.welcomeName) elems.welcomeName.textContent = name;
  if (elems.sidebarName) elems.sidebarName.textContent = name;
  if (elems.sidebarRole) elems.sidebarRole.textContent = session.role || 'user';
  if (elems.sidebarAvatar) elems.sidebarAvatar.textContent = initials;
  if (elems.topbarAvatar) elems.topbarAvatar.textContent = initials;
  if (elems.metricBranch) elems.metricBranch.textContent = branch;
}
initUserUI();

// ── XP System ─────────────────────────────────────────────────
function updateXPDisplay() {
  const xp = getXP();
  const el = document.getElementById('metricXP');
  if (el) el.textContent = xp.toLocaleString();

  const level = Math.floor(xp / 500) + 1;
  const xpInLevel = xp % 500;
  const pct = (xpInLevel / 500) * 100;

  const lvlEl = document.getElementById('xpLevelText');
  const fillEl = document.getElementById('xpProgressFill');
  const curEl = document.getElementById('xpCurrentText');
  const nextEl = document.getElementById('xpNextText');

  if (lvlEl) lvlEl.textContent = 'Lv ' + level;
  if (fillEl) fillEl.style.width = pct + '%';
  if (curEl) curEl.textContent = xp + ' XP';
  if (nextEl) nextEl.textContent = (500 - xpInLevel) + ' XP to next level';
}

// ── User Profile & Stats Loader ────────────────────────────────
async function loadUserProfile() {
  try {
    const data = await apiFetch('/api/profile');
    if (data.success && data.user) {
      const u = data.user;
      const key = 'edunet_xp_' + u.username;
      localStorage.setItem(key, String(u.xp || 0));
      updateXPDisplay();
      
      const branchEl = document.getElementById('metricBranch');
      if (branchEl) branchEl.textContent = u.branch || 'SDE';
      
      // Update badge triggers based on database stats
      const certKey = 'edunet_certs_' + u.username;
      const certs = JSON.parse(localStorage.getItem(certKey) || '[]');
      const certsEl = document.getElementById('metricCerts');
      if (certsEl) certsEl.textContent = certs.length;

      // Unlock quiz hero badge if they have quiz attempts in results table
      try {
        const quizHistory = await apiFetch('/api/quizzes/history');
        if (quizHistory.success && quizHistory.history && quizHistory.history.length > 0) {
          const badge = document.getElementById('badgeQuizHero');
          if (badge) badge.classList.remove('locked');
        }
      } catch (e) {
        console.log('Error loading quiz history for badges:', e);
      }
    }
  } catch (err) {
    console.log('Failed to fetch user profile stats:', err.message);
  }
}
loadUserProfile();
updateXPDisplay();

// ── Progress (from localStorage roadmap data) ─────────────────
function updateProgressMetric() {
  const key = 'edunet_rm_' + (session.username || '') + '_sde';
  const saved = JSON.parse(localStorage.getItem(key) || '{}');
  const totalNodes = Object.keys(saved).length;
  const doneNodes = Object.values(saved).filter(Boolean).length;
  const pct = totalNodes ? Math.round((doneNodes / totalNodes) * 100) : 0;
  const el = document.getElementById('metricProgress');
  if (el) el.textContent = pct + '%';
}
updateProgressMetric();

// ── Cert count ─────────────────────────────────────────────────
function updateCertCount() {
  const key = 'edunet_certs_' + (session.username || '');
  const certs = JSON.parse(localStorage.getItem(key) || '[]');
  const el = document.getElementById('metricCerts');
  if (el) el.textContent = certs.length;
}
updateCertCount();

// ── Activity Feed ──────────────────────────────────────────────
function renderActivityFeed() {
  const feed = document.getElementById('activityFeed');
  if (!feed) return;
  const activities = JSON.parse(localStorage.getItem('edunet_activity_' + session.username) || '[]');
  const defaults = [
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

// ── Videos from Backend ────────────────────────────────────────
async function loadVideos() {
  const grid = document.getElementById('videosGrid');
  if (!grid) return;

  try {
    const data = await apiFetch('/api/videos?limit=6');
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
            ${v.duration ? `<span style="font-size:11px;color:var(--mist-dim);">${v.duration}</span>` : ''}
          </div>
        </div>
      `;
      card.querySelector('.video-thumb').addEventListener('click', () => openVideoModal(v));
      grid.appendChild(card);
    });

    // Filter buttons
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
const dashSidebar = document.getElementById('dashSidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const burgerBtn = document.getElementById('burgerBtn');

function openSidebar() { dashSidebar.classList.add('open'); sidebarOverlay.classList.add('open'); }
function closeSidebar() { dashSidebar.classList.remove('open'); sidebarOverlay.classList.remove('open'); }

if (burgerBtn) burgerBtn.addEventListener('click', openSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

// ── Search Modal ───────────────────────────────────────────────
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const searchList = document.getElementById('searchResultsList');
const topbarSearch = document.getElementById('topbarSearch');

const SEARCH_INDEX = [
  { title:'DSA Roadmap', desc:'Data Structures & Algorithms path', cat:'Roadmaps', link:'roadmaps.html', icon:'🗺' },
  { title:'Python Roadmap', desc:'Python developer path', cat:'Roadmaps', link:'roadmaps.html', icon:'🗺' },
  { title:'Web Development', desc:'Full stack web dev roadmap', cat:'Roadmaps', link:'roadmaps.html', icon:'🗺' },
  { title:'Machine Learning', desc:'ML engineer roadmap', cat:'Roadmaps', link:'roadmaps.html', icon:'🗺' },
  { title:'CodeSynth AI', desc:'DSA solution generator', cat:'AI Tools', link:'ai-tools.html', icon:'🛠' },
  { title:'AlgorithmVisualizer', desc:'Visual algorithm tracer', cat:'AI Tools', link:'ai-tools.html', icon:'🛠' },
  { title:'ResumeReviewer ATS', desc:'Resume optimizer', cat:'AI Tools', link:'ai-tools.html', icon:'🛠' },
  { title:'Coding Lab', desc:'Browser code editor', cat:'Tools', link:'coding-lab.html', icon:'💻' },
  { title:'Quiz Center', desc:'MCQ & XP quizzes', cat:'Quizzes', link:'quiz.html', icon:'🧠' },
  { title:'Resume Builder', desc:'ATS resume builder', cat:'Career', link:'resume.html', icon:'📄' },
  { title:'Interview Prep', desc:'Technical interview practice', cat:'Career', link:'interview.html', icon:'💬' },
  { title:'Certificates', desc:'View earned certificates', cat:'Career', link:'certificates.html', icon:'🏆' },
  { title:'Leaderboard', desc:'XP rankings', cat:'Account', link:'leaderboard.html', icon:'🥇' },
  { title:'Bookmarks', desc:'Saved tools and roadmaps', cat:'Account', link:'bookmarks.html', icon:'🔖' },
  { title:'Profile', desc:'Manage your profile', cat:'Account', link:'profile.html', icon:'👤' },
  { title:'Settings', desc:'Account settings', cat:'Account', link:'settings.html', icon:'⚙️' },
  { title:'Notifications', desc:'View notifications', cat:'Account', link:'notifications.html', icon:'🔔' },
];

function openSearch() {
  searchModal.classList.add('open');
  setTimeout(() => searchInput.focus(), 80);
}
function closeSearch() {
  searchModal.classList.remove('open');
  searchInput.value = '';
  searchList.innerHTML = '';
}
if (topbarSearch) topbarSearch.addEventListener('click', openSearch);
searchModal.addEventListener('click', e => { if (e.target === searchModal) closeSearch(); });
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSearch();
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
});

searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase().trim();
  searchList.innerHTML = '';
  if (!q) return;
  const hits = SEARCH_INDEX.filter(d => d.title.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q) || d.cat.toLowerCase().includes(q));
  if (!hits.length) {
    searchList.innerHTML = '<div class="search-no-results">No results found.</div>';
    return;
  }
  hits.slice(0, 8).forEach(item => {
    const el = document.createElement('div');
    el.className = 'search-result-item';
    el.innerHTML = `
      <div class="search-result-icon">${item.icon}</div>
      <div class="search-result-info">
        <div class="search-result-title">${item.title}</div>
        <div class="search-result-desc">${item.desc}</div>
      </div>
      <div class="search-result-cat">${item.cat}</div>
    `;
    el.addEventListener('click', () => { closeSearch(); window.location.href = item.link; });
    searchList.appendChild(el);
  });
});

// ── Bookmarks & Saved Programs List ──────────────────────────
function renderDashboardLists() {
  // Bookmarks
  const bmList = document.getElementById('dashBookmarksList');
  if (bmList) {
    const bms = JSON.parse(localStorage.getItem('edunet_bm_' + session?.username) || '[]');
    if (bms.length === 0) {
      bmList.innerHTML = '<div style="color:var(--mist-dim); font-size:11.5px;">No bookmarked items.</div>';
    } else {
      bmList.innerHTML = bms.slice(0, 4).map(b => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--abyss-2); border:1px solid var(--border); border-radius:var(--r-xs); padding:.4rem .6rem;">
          <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:130px;" title="${b.title || b.id}">${b.type === 'tool' ? '🛠' : b.type === 'video' ? '🎬' : '🗺'} ${b.title || b.id}</span>
          <a href="${b.type === 'tool' ? 'ai-tools.html' : b.type === 'video' ? 'videos.html' : 'roadmaps.html'}" style="font-size:11px; color:var(--accent);">View</a>
        </div>
      `).join('');
    }
  }

  // Saved Programs (from local storage edunet_code_*)
  const filesList = document.getElementById('dashSavedProgramsList');
  if (filesList) {
    const langNames = { javascript: 'JS', python: 'Python', java: 'Java', cpp: 'C++', html: 'HTML', sql: 'SQL' };
    const savedLangs = [];
    Object.keys(langNames).forEach(l => {
      const saved = localStorage.getItem('edunet_code_' + l + '_' + session?.username);
      if (saved) savedLangs.push({ key: l, name: langNames[l] });
    });

    if (savedLangs.length === 0) {
      filesList.innerHTML = '<div style="color:var(--mist-dim); font-size:11.5px;">No saved programs yet.</div>';
    } else {
      filesList.innerHTML = savedLangs.slice(0, 4).map(f => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--abyss-2); border:1px solid var(--border); border-radius:var(--r-xs); padding:.4rem .6rem;">
          <span>💻 script.${f.key === 'javascript' ? 'js' : f.key === 'python' ? 'py' : f.key} (${f.name})</span>
          <a href="coding-lab.html" style="font-size:11px; color:var(--accent);">Open</a>
        </div>
      `).join('');
    }
  }
}
renderDashboardLists();

// ── Daily Challenge Logic ──────────────────────────────────────
function initDailyChallenge() {
  const challengeBtn = document.getElementById('dashChallengeActionBtn');
  const streakText = document.getElementById('dashStreakVal');
  const challengeText = document.getElementById('dashDailyChallengeText');
  if (!challengeBtn) return;

  const challengeKey = 'edunet_challenge_' + session?.username + '_' + new Date().toDateString();
  const isCompleted = localStorage.getItem(challengeKey) === 'true';

  if (isCompleted) {
    challengeBtn.textContent = '✓ Challenge Completed';
    challengeBtn.className = 'btn btn-secondary btn-sm btn-full';
    challengeBtn.disabled = true;
  }

  challengeBtn.addEventListener('click', () => {
    localStorage.setItem(challengeKey, 'true');
    challengeBtn.textContent = '✓ Challenge Completed';
    challengeBtn.className = 'btn btn-secondary btn-sm btn-full';
    challengeBtn.disabled = true;
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
