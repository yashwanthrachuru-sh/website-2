// ============================================================
// js/page-shell.js — Shared page initialization (sidebar, search, auth guard)
// Include this AFTER api.js and BEFORE any page-specific script.
// Usage: call initPageShell(activeNavId) from each page's JS.
// ============================================================
'use strict';

window.initPageShell = function (activeNavId) {
  const { getToken, getSession, clearSession, showToast } = window.EduNetAPI;
  const token = getToken();
  const session = getSession();
  if (!token || !session) { window.location.href = 'index.html'; return null; }

  // Populate user info
  const initials = (session.username || 'ST').slice(0, 2).toUpperCase();
  ['sidebarAvatar', 'topbarAvatar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = initials;
  });
  const nameEl = document.getElementById('sidebarName');
  const roleEl = document.getElementById('sidebarRole');
  if (nameEl) nameEl.textContent = session.username || 'Student';
  if (roleEl) roleEl.textContent = session.role || 'user';

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    clearSession(); window.location.href = 'index.html';
  });

  // Burger / mobile sidebar
  const sidebar = document.getElementById('dashSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  document.getElementById('burgerBtn')?.addEventListener('click', () => {
    sidebar?.classList.add('open'); overlay?.classList.add('open');
  });
  overlay?.addEventListener('click', () => {
    sidebar?.classList.remove('open'); overlay?.classList.remove('open');
  });

  // Dynamic sidebar injections
  const nav = document.querySelector('.dash-nav');
  if (nav) {
    // 1. Inject Videos link dynamically if not present
    if (!nav.querySelector('a[href="videos.html"]')) {
      const toolsLink = nav.querySelector('a[href="ai-tools.html"]');
      const vidLink = document.createElement('a');
      vidLink.href = 'videos.html';
      vidLink.className = 'dash-nav-item';
      vidLink.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>Videos`;
      if (toolsLink) {
        toolsLink.insertAdjacentElement('afterend', vidLink);
      } else {
        nav.appendChild(vidLink);
      }
    }
    // 2. Normalize active states based on current filename
    const pathSegments = window.location.pathname.split('/');
    const currentFile = pathSegments[pathSegments.length - 1] || 'user.html';
    nav.querySelectorAll('.dash-nav-item').forEach(item => {
      const href = item.getAttribute('href');
      if (href === currentFile) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Global search modal
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  const searchList = document.getElementById('searchResultsList');
  const SEARCH_INDEX = [
    { title:'Dashboard', desc:'Learning overview', cat:'Main', link:'user.html', icon:'📊' },
    { title:'Roadmaps', desc:'Career learning paths', cat:'Main', link:'roadmaps.html', icon:'🗺' },
    { title:'AI Tools', desc:'Curated AI tool directory', cat:'Main', link:'ai-tools.html', icon:'🛠' },
    { title:'Videos', desc:'Watch programming tutorials', cat:'Main', link:'videos.html', icon:'🎬' },
    { title:'Coding Lab', desc:'Browser code sandbox', cat:'Main', link:'coding-lab.html', icon:'💻' },
    { title:'Quizzes', desc:'MCQ & XP quizzes', cat:'Main', link:'quiz.html', icon:'🧠' },
    { title:'Resume Builder', desc:'ATS resume creator', cat:'Career', link:'resume.html', icon:'📄' },
    { title:'Interview Prep', desc:'Technical interview practice', cat:'Career', link:'interview.html', icon:'💬' },
    { title:'Certificates', desc:'Earned certificates', cat:'Career', link:'certificates.html', icon:'🏆' },
    { title:'Leaderboard', desc:'XP rankings', cat:'Account', link:'leaderboard.html', icon:'🥇' },
    { title:'Bookmarks', desc:'Saved items', cat:'Account', link:'bookmarks.html', icon:'🔖' },
    { title:'Notifications', desc:'Alerts & updates', cat:'Account', link:'notifications.html', icon:'🔔' },
    { title:'Profile', desc:'Manage your profile', cat:'Account', link:'profile.html', icon:'👤' },
    { title:'Settings', desc:'Account settings', cat:'Account', link:'settings.html', icon:'⚙️' },
  ];
  document.getElementById('topbarSearch')?.addEventListener('click', () => {
    searchModal?.classList.add('open'); setTimeout(() => searchInput?.focus(), 80);
  });
  searchModal?.addEventListener('click', e => {
    if (e.target === searchModal) { searchModal.classList.remove('open'); if (searchInput) searchInput.value = ''; if (searchList) searchList.innerHTML = ''; }
  });
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') { searchModal?.classList.remove('open'); if (searchInput) searchInput.value = ''; if (searchList) searchList.innerHTML = ''; }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchModal?.classList.add('open'); setTimeout(() => searchInput?.focus(), 80); }
  });
  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!searchList) return;
    searchList.innerHTML = '';
    if (!q) return;
    const hits = SEARCH_INDEX.filter(d => d.title.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q) || d.cat.toLowerCase().includes(q));
    if (!hits.length) { searchList.innerHTML = '<div class="search-no-results">No results found.</div>'; return; }
    hits.slice(0, 8).forEach(item => {
      const el = document.createElement('div');
      el.className = 'search-result-item';
      el.innerHTML = `<div class="search-result-icon">${item.icon}</div><div class="search-result-info"><div class="search-result-title">${item.title}</div><div class="search-result-desc">${item.desc}</div></div><div class="search-result-cat">${item.cat}</div>`;
      el.addEventListener('click', () => { searchModal.classList.remove('open'); window.location.href = item.link; });
      searchList.appendChild(el);
    });
  });

  return session;
};
