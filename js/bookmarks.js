// ============================================================
// js/bookmarks.js — EduNet Bookmarks
// ============================================================
'use strict';
const session = window.initPageShell('bookmarks.html');
const { showToast } = window.EduNetAPI;

const BM_KEY = 'edunet_bm_' + session?.username;

function getBookmarks() { return JSON.parse(localStorage.getItem(BM_KEY) || '[]'); }
function removeBookmark(id, type) {
  const bms = getBookmarks().filter(b => !(b.id === id && b.type === type));
  localStorage.setItem(BM_KEY, JSON.stringify(bms));
  showToast('Bookmark removed.', 'info');
  renderBookmarks();
}

const ICON_MAP = { tool: '🛠', roadmap: '🗺', video: '🎬', course: '📚' };
const LINK_MAP = { tool: 'ai-tools.html', roadmap: 'roadmaps.html', video: 'user.html', course: 'user.html' };

function renderBookmarks(cat = 'all') {
  const list = document.getElementById('bookmarksList');
  const noEl = document.getElementById('noBookmarks');
  const all = getBookmarks();
  const filtered = all.filter(b => cat === 'all' || b.type === cat);
  list.innerHTML = '';

  if (!filtered.length) {
    noEl.style.display = 'block';
    return;
  }
  noEl.style.display = 'none';

  filtered.forEach(bm => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:1rem;background:var(--abyss);border:1px solid var(--border);border-radius:var(--r-sm);padding:1rem 1.25rem;transition:border-color .2s;';
    row.innerHTML = `
      <div style="font-size:1.5rem;">${ICON_MAP[bm.type] || '📌'}</div>
      <div style="flex:1;">
        <div style="font-size:14px;font-weight:600;">${bm.title || bm.id}</div>
        <div style="font-size:12px;color:var(--mist);margin-top:2px;">${bm.type.charAt(0).toUpperCase() + bm.type.slice(1)} · Saved</div>
      </div>
      <div style="display:flex;gap:.5rem;">
        <a href="${LINK_MAP[bm.type] || '#'}" class="btn btn-secondary btn-sm">Open →</a>
        <button class="btn btn-danger btn-sm rm-bm" data-id="${bm.id}" data-type="${bm.type}">Remove</button>
      </div>
    `;
    row.querySelector('.rm-bm').addEventListener('click', function() {
      removeBookmark(this.getAttribute('data-id'), this.getAttribute('data-type'));
    });
    list.appendChild(row);
  });
}

document.querySelectorAll('#bmFilterRow .filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('#bmFilterRow .filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderBookmarks(this.getAttribute('data-bcat'));
  });
});

renderBookmarks();
