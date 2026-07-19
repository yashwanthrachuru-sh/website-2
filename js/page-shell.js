// ============================================================
// js/page-shell.js — Shared page initialization (sidebar, search, auth guard)
// Include this AFTER api.js and BEFORE any page-specific script.
// Usage: call initPageShell(activeNavId) from each page's JS.
// ============================================================
'use strict';

window.initPageShell = function (activeNavId) {
  const { getToken, getSession, clearSession, showToast, debounce } = window.EduNetAPI;
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
    // Inject Portfolio link dynamically if not present
    if (!nav.querySelector('a[href*="portfolio"]')) {
      const profileLink = nav.querySelector('a[href="profile.html"]');
      const portLink = document.createElement('a');
      portLink.href = '/portfolio.html';
      portLink.className = 'dash-nav-item';
      portLink.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>Developer Portfolio`;
      if (profileLink) {
        profileLink.insertAdjacentElement('beforebegin', portLink);
      } else {
        nav.appendChild(portLink);
      }
    }
    // Inject AI Career Coach link dynamically if not present
    if (!nav.querySelector('a[href="coach.html"]')) {
      const resumeLink = nav.querySelector('a[href="resume.html"]');
      const coachLink = document.createElement('a');
      coachLink.href = 'coach.html';
      coachLink.className = 'dash-nav-item';
      coachLink.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>AI Career Coach`;
      if (resumeLink) {
        resumeLink.insertAdjacentElement('beforebegin', coachLink);
      } else {
        nav.appendChild(coachLink);
      }
    }
    // 2. Normalize active states based on current filename
    const pathSegments = window.location.pathname.split('/');
    const currentFile = pathSegments[pathSegments.length - 1] || 'user.html';
    nav.querySelectorAll('.dash-nav-item').forEach(item => {
      const href = item.getAttribute('href');
      const isPortfolio = href && href.includes('portfolio') && (currentFile.includes('portfolio') || window.location.pathname.includes('/portfolio/'));
      if (href === currentFile || isPortfolio) {
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
    { title:'Developer Portfolio', desc:'Your dynamic professional profile', cat:'Career', link:'portfolio.html', icon:'🎓' },
    { title:'AI Career Coach', desc:'Your dynamic career mentor', cat:'Career', link:'coach.html', icon:'🤖' },
    { title:'GitHub Integration', desc:'Connect GitHub profile to portfolio', cat:'Career', link:'portfolio.html', icon:'🐙' },
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
  // Fast dynamic database search with local fallback for navigation
  searchInput?.addEventListener('input', debounce(async () => {
    const q = searchInput.value.trim();
    if (!searchList) return;
    searchList.innerHTML = '';
    if (!q) {
      // Show default navigation guides
      SEARCH_INDEX.slice(0, 5).forEach(item => {
        const el = document.createElement('div');
        el.className = 'search-result-item';
        el.innerHTML = `<div class="search-result-icon">${item.icon}</div><div class="search-result-info"><div class="search-result-title">${item.title}</div><div class="search-result-desc">${item.desc}</div></div><div class="search-result-cat">${item.cat}</div>`;
        el.addEventListener('click', () => { searchModal.classList.remove('open'); window.location.href = item.link; });
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
          
          // Highlight match
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
            searchModal.classList.remove('open');
            // Navigate properly based on item type
            if (item.type === 'roadmap') {
              window.location.href = `roadmaps.html?id=${item.id}`;
            } else             if (item.type === 'module') {
              window.location.href = `roadmap-learn.html?rm=${item.roadmap_id || item.rm || ''}`;
            } else if (item.type === 'lesson') {
              window.location.href = `roadmap-learn.html?rm=${item.roadmap_id || item.rm || ''}&l=${item.id}`;
            } else {
              window.location.href = item.link || 'user.html';
            }
          });
          searchList.appendChild(el);
        });
      }
    } catch (e) {
      // Local backup fallback on server search error
      const hits = SEARCH_INDEX.filter(d => d.title.toLowerCase().includes(q.toLowerCase()) || d.desc.toLowerCase().includes(q.toLowerCase()));
      if (!hits.length) { searchList.innerHTML = '<div class="search-no-results">No results found.</div>'; return; }
      hits.slice(0, 8).forEach(item => {
        const el = document.createElement('div');
        el.className = 'search-result-item';
        el.innerHTML = `<div class="search-result-icon">${item.icon}</div><div class="search-result-info"><div class="search-result-title">${item.title}</div><div class="search-result-desc">${item.desc}</div></div><div class="search-result-cat">${item.cat}</div>`;
        el.addEventListener('click', () => { searchModal.classList.remove('open'); window.location.href = item.link; });
        searchList.appendChild(el);
      });
    }
  }, 250));

  return session;
};
