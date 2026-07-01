// ============================================================
// js/api.js — EduNet Shared API Layer
// IIFE-wrapped: nothing pollutes global scope.
// Only window.EduNetAPI is exposed.
// ============================================================
(function () {
  'use strict';

  // ── Base URL ────────────────────────────────────────────────
  // Auto-detect: if page is served by our Express server (port 5000),
  // use relative paths. Otherwise target localhost:5000.
  const API_BASE = (
    window.location.port === '5000' ||
    window.location.hostname === 'localhost' && window.location.port === '5000'
  ) ? '' : 'http://localhost:5000';

  // ── Session Helpers ─────────────────────────────────────────
  function getToken() {
    return localStorage.getItem('edunet_token');
  }

  function getSession() {
    try {
      const s = localStorage.getItem('edunet_session');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  }

  function saveSession(token, user) {
    localStorage.setItem('edunet_token', token);
    localStorage.setItem('edunet_session', JSON.stringify(user));
  }

  function clearSession() {
    ['edunet_token', 'edunet_session', 'edunet_user'].forEach(k => localStorage.removeItem(k));
  }

  function requireAuth(role) {
    const token = getToken();
    const session = getSession();
    if (!token || !session) { window.location.href = 'index.html'; return null; }
    if (role && session.role !== role) { window.location.href = 'index.html'; return null; }
    return session;
  }

  // ── Core Fetch Wrapper ──────────────────────────────────────
  async function apiFetch(path, options) {
    options = options || {};
    const token = getToken();
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    if (token) headers['Authorization'] = 'Bearer ' + token;

    let res;
    try {
      res = await fetch(API_BASE + path, Object.assign({}, options, { headers }));
    } catch (networkErr) {
      // Network error = server offline or CORS block
      throw new Error('Cannot connect to server. Please make sure the backend is running.');
    }

    // Token expired or invalid
    if (res.status === 401 || res.status === 403) {
      let data;
      try { data = await res.json(); } catch { data = {}; }
      // Only clear session on 401 (expired token) not 403 (wrong role)
      if (res.status === 401) { clearSession(); window.location.href = 'index.html'; }
      throw new Error(data.message || (res.status === 403 ? 'Access denied.' : 'Session expired. Please log in again.'));
    }

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error('Server returned invalid response (status ' + res.status + ').');
    }

    if (!res.ok) {
      throw new Error(data.message || 'Request failed (status ' + res.status + ').');
    }

    return data;
  }

  // ── Toast Notifications ─────────────────────────────────────
  let _toastContainer = null;

  function _getToastContainer() {
    if (_toastContainer && document.contains(_toastContainer)) return _toastContainer;
    _toastContainer = document.getElementById('toastContainer');
    if (!_toastContainer) {
      _toastContainer = document.createElement('div');
      _toastContainer.className = 'toast-container';
      _toastContainer.id = 'toastContainer';
      document.body.appendChild(_toastContainer);
    }
    return _toastContainer;
  }

  function showToast(message, type, duration) {
    type = type || 'info';
    duration = typeof duration === 'number' ? duration : 3500;

    // Friendly error rewrites
    if (message && message.includes('Failed to fetch')) {
      message = 'Cannot reach the server. Is the backend running?';
    }

    const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
    const container = _getToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = '<span class="toast-icon">' + (icons[type] || 'ℹ') + '</span><span class="toast-msg">' + message + '</span>';

    container.appendChild(toast);
    // Animate out
    var t = setTimeout(function () {
      toast.classList.add('fadeout');
      setTimeout(function () { if (toast.parentNode) toast.remove(); }, 350);
    }, duration);
    // Allow click to dismiss
    toast.addEventListener('click', function () {
      clearTimeout(t);
      toast.classList.add('fadeout');
      setTimeout(function () { if (toast.parentNode) toast.remove(); }, 350);
    });
  }

  // ── XP System (DB-backed with localStorage cache) ───────────
  // localStorage is used as a fast cache; DB is the source of truth.

  // Read XP — try DB first, fall back to localStorage
  function getXP() {
    var s = getSession();
    var key = 'edunet_xp_' + ((s && s.username) || 'guest');
    return parseInt(localStorage.getItem(key) || '0', 10);
  }

  // Sync XP to DB — fire-and-forget (doesn't block UI)
  async function syncXPToServer(amount, source) {
    var token = getToken();
    if (!token || !amount) return;
    try {
      var res = await apiFetch('/api/user/xp', {
        method: 'POST',
        body: JSON.stringify({ amount: parseInt(amount, 10), source: source || 'general' })
      });
      if (res.success) {
        // Update localStorage cache with server's authoritative value
        var s = getSession();
        if (s) {
          var key = 'edunet_xp_' + s.username;
          localStorage.setItem(key, String(res.xp));
          // Update session level
          s.level = res.level;
          localStorage.setItem('edunet_session', JSON.stringify(s));
        }
        return res;
      }
    } catch (e) {
      // Network error or server down — localStorage cache remains valid
      console.warn('XP sync to server failed (offline?):', e.message);
    }
  }

  // Add XP locally (immediate) then sync to DB asynchronously
  function addXP(pts) {
    var s = getSession();
    if (!s) return 0;
    var key = 'edunet_xp_' + s.username;
    var cur = parseInt(localStorage.getItem(key) || '0', 10);
    var newVal = cur + (parseInt(pts, 10) || 0);
    localStorage.setItem(key, String(newVal));
    // Async DB sync — non-blocking
    syncXPToServer(parseInt(pts, 10) || 0, 'lesson');
    return newVal;
  }

  // ── Global Search Index ─────────────────────────────────────
  function buildSearchIndex(tools, roadmaps) {
    tools = tools || [];
    roadmaps = roadmaps || [];
    var base = [
      { title: 'Roadmaps', desc: 'All learning roadmaps', cat: 'Pages', link: 'roadmaps.html', icon: '🗺' },
      { title: 'AI Tools', desc: 'Browse all AI tools', cat: 'Pages', link: 'ai-tools.html', icon: '🛠' },
      { title: 'Coding Lab', desc: 'Write and run code in browser', cat: 'Tools', link: 'coding-lab.html', icon: '💻' },
      { title: 'Quiz Center', desc: 'Test your knowledge', cat: 'Features', link: 'quiz.html', icon: '🧠' },
      { title: 'Resume Builder', desc: 'Build ATS-ready resume', cat: 'Features', link: 'resume.html', icon: '📄' },
      { title: 'Certificates', desc: 'View and download certificates', cat: 'Features', link: 'certificates.html', icon: '🏆' },
      { title: 'Leaderboard', desc: 'See rankings and XP', cat: 'Features', link: 'leaderboard.html', icon: '🥇' },
      { title: 'Interview Prep', desc: 'Practice interview questions', cat: 'Features', link: 'interview.html', icon: '💬' },
      { title: 'Bookmarks', desc: 'Your saved items', cat: 'Features', link: 'bookmarks.html', icon: '🔖' },
      { title: 'Settings', desc: 'Account settings', cat: 'Account', link: 'settings.html', icon: '⚙️' },
      { title: 'Profile', desc: 'Your student profile', cat: 'Account', link: 'profile.html', icon: '👤' },
    ];
    var toolItems = tools.map(function (t) {
      return { title: t.name, desc: t.description || '', cat: 'AI Tools', link: 'ai-tools.html', icon: '🛠' };
    });
    var rmItems = roadmaps.map(function (r) {
      return { title: r.title || r.name, desc: r.desc || '', cat: 'Roadmaps', link: 'roadmaps.html', icon: '🗺' };
    });
    return base.concat(toolItems, rmItems);
  }

  // ── Debouncing utility ──────────────────────────────────────
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  // ── Expose public API ────────────────────────────────────────
  window.EduNetAPI = {
    API_BASE:        API_BASE,
    apiFetch:        apiFetch,
    getToken:        getToken,
    getSession:      getSession,
    saveSession:     saveSession,
    clearSession:    clearSession,
    requireAuth:     requireAuth,
    showToast:       showToast,
    buildSearchIndex:buildSearchIndex,
    getXP:           getXP,
    addXP:           addXP,
    syncXPToServer:  syncXPToServer,
    debounce:        debounce
  };

})(); // end IIFE
