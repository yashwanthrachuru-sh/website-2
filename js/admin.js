// ============================================================
// js/admin.js — EduNet Admin Panel
// ============================================================
'use strict';

const { apiFetch, getToken, getSession, clearSession, showToast } = window.EduNetAPI;

// ── Auth Guard (admin only) ────────────────────────────────────
const session = getSession();
const token = getToken();
if (!token || !session) { window.location.href = 'index.html'; }
if (session && session.role !== 'admin') {
  showToast('Access denied. Admins only.', 'error');
  setTimeout(() => window.location.href = 'user.html', 1000);
}

// ── Populate Admin Info ────────────────────────────────────────
function initAdminUI() {
  const name = session?.username || 'Admin';
  const initials = name.slice(0, 2).toUpperCase();
  const adminAvatar = document.getElementById('adminAvatar');
  const topbarAdminAvatar = document.getElementById('topbarAdminAvatar');
  const adminName = document.getElementById('adminName');
  if (adminAvatar) adminAvatar.textContent = initials;
  if (topbarAdminAvatar) topbarAdminAvatar.textContent = initials;
  if (adminName) adminName.textContent = name;
}
initAdminUI();

// ── Sidebar Navigation ─────────────────────────────────────────
const sidebarItems = document.querySelectorAll('.dash-nav-item[data-section]');
const sections = document.querySelectorAll('[id^="section-"]');
const SECTION_LOADERS = {};

function showSection(name) {
  sections.forEach(s => s.style.display = 'none');
  const target = document.getElementById('section-' + name);
  if (target) target.style.display = 'block';
  sidebarItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-section') === name);
  });
  if (SECTION_LOADERS[name]) SECTION_LOADERS[name]();
}

sidebarItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    showSection(item.getAttribute('data-section'));
  });
});

// Quick action buttons
document.querySelectorAll('[data-section][data-action]').forEach(btn => {
  btn.addEventListener('click', () => {
    const sec = btn.getAttribute('data-section');
    showSection(sec);
    const action = btn.getAttribute('data-action');
    setTimeout(() => {
      if (action === 'add' && sec === 'videos') document.getElementById('addVideoForm')?.style.setProperty('display', 'block');
      if (action === 'new' && sec === 'announcements') document.getElementById('announcementForm')?.style.setProperty('display', 'block');
      if (action === 'approve' && sec === 'users') loadUsers();
    }, 100);
  });
});

// ── Burger & Sidebar ───────────────────────────────────────────
const sidebar = document.getElementById('dashSidebar');
const overlay = document.getElementById('sidebarOverlay');
document.getElementById('burgerBtn')?.addEventListener('click', () => { sidebar?.classList.add('open'); overlay?.classList.add('open'); });
overlay?.addEventListener('click', () => { sidebar?.classList.remove('open'); overlay?.classList.remove('open'); });

// ── Logout ─────────────────────────────────────────────────────
document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
  clearSession(); window.location.href = 'index.html';
});

// ── Search Modal ───────────────────────────────────────────────
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const searchList = document.getElementById('searchResultsList');
document.getElementById('topbarSearch')?.addEventListener('click', () => { searchModal?.classList.add('open'); setTimeout(() => searchInput?.focus(), 80); });
searchModal?.addEventListener('click', e => { if (e.target === searchModal) { searchModal.classList.remove('open'); } });
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') searchModal?.classList.remove('open');
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchModal?.classList.add('open'); setTimeout(() => searchInput?.focus(), 80); }
});
const ADMIN_SEARCH = [
  { title:'Users', desc:'Manage user accounts', icon:'👥', sec:'users' },
  { title:'YouTube Videos', desc:'Add/edit/delete videos', icon:'🎬', sec:'videos' },
  { title:'AI Tools', desc:'Moderate tool listings', icon:'🛠', sec:'tools' },
  { title:'Announcements', desc:'Post platform updates', icon:'📣', sec:'announcements' },
  { title:'Analytics', desc:'Platform stats', icon:'📊', sec:'analytics' },
  { title:'Settings', desc:'Platform configuration', icon:'⚙️', sec:'settings' },
  { title:'Certificates', desc:'Manage certificates', icon:'🏆', sec:'certificates' },
];
searchInput?.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase();
  searchList.innerHTML = '';
  if (!q) return;
  ADMIN_SEARCH.filter(i => i.title.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)).forEach(item => {
    const el = document.createElement('div');
    el.className = 'search-result-item';
    el.innerHTML = `<div class="search-result-icon">${item.icon}</div><div class="search-result-info"><div class="search-result-title">${item.title}</div><div class="search-result-desc">${item.desc}</div></div><div class="search-result-cat">Admin</div>`;
    el.addEventListener('click', () => { searchModal.classList.remove('open'); showSection(item.sec); });
    searchList.appendChild(el);
  });
});

// ═══════════════════════════════════════════════════
// SECTION: DASHBOARD
// ═══════════════════════════════════════════════════
async function loadDashboard() {
  // Metrics
  try {
    const ud = await apiFetch('/api/admin/users');
    if (ud.success) {
      const all = ud.users || [];
      document.getElementById('mTotalUsers').textContent = all.length;
      document.getElementById('mPending').textContent = all.filter(u => u.status !== 'approved').length;
      renderRecentUsersTable(all.slice(0, 5));
    }
  } catch(e) {
    document.getElementById('mTotalUsers').textContent = '—';
    document.getElementById('mPending').textContent = '—';
  }
  try {
    const vd = await apiFetch('/api/videos/admin');
    document.getElementById('mVideos').textContent = (vd.videos || []).length;
  } catch { document.getElementById('mVideos').textContent = '0'; }
  try {
    const td = await apiFetch('/api/admin/tools');
    document.getElementById('mTools').textContent = (td.tools || []).length;
  } catch { document.getElementById('mTools').textContent = '0'; }
}
SECTION_LOADERS['dashboard'] = loadDashboard;

function renderRecentUsersTable(users) {
  const tbody = document.getElementById('recentUsersTable');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!users.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--mist);padding:2rem;">No users found.</td></tr>';
    return;
  }
  users.forEach(u => {
    const row = document.createElement('tr');
    const status = u.status || 'pending';
    row.innerHTML = `
      <td><div style="display:flex;align-items:center;gap:8px;"><div class="dash-avatar" style="width:28px;height:28px;font-size:10px;">${(u.username||'?').slice(0,2).toUpperCase()}</div>${u.username}</div></td>
      <td style="color:var(--mist);">${u.email}</td>
      <td>${u.branch || '—'}</td>
      <td><span class="badge ${status === 'approved' ? 'badge-green' : 'badge-muted'}">${status}</span></td>
      <td style="font-size:12px;color:var(--mist-dim);">${u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '—'}</td>
      <td>
        ${status !== 'approved' ? `<button class="btn btn-primary btn-sm approve-btn" data-id="${u.id}" style="margin-right:.4rem;">Approve</button>` : ''}
        <button class="btn btn-danger btn-sm delete-user-btn" data-id="${u.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
  attachUserActions(tbody);
}

function attachUserActions(tbody) {
  tbody.querySelectorAll('.approve-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      try {
        await apiFetch('/api/admin/users/' + this.getAttribute('data-id') + '/status', { method: 'PUT', body: JSON.stringify({ status: 'approved' }) });
        showToast('User approved!', 'success');
        loadDashboard();
        if (document.getElementById('section-users').style.display !== 'none') loadUsers();
      } catch(e) { showToast(e.message, 'error'); }
    });
  });
  tbody.querySelectorAll('.delete-user-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      if (!confirm('Delete this user permanently?')) return;
      try {
        await apiFetch('/api/admin/users/' + this.getAttribute('data-id'), { method: 'DELETE' });
        showToast('User deleted.', 'info');
        loadDashboard();
        if (document.getElementById('section-users').style.display !== 'none') loadUsers();
      } catch(e) { showToast(e.message, 'error'); }
    });
  });
}

// ═══════════════════════════════════════════════════
// SECTION: ANALYTICS
// ═══════════════════════════════════════════════════
SECTION_LOADERS['analytics'] = function() {
  const tracks = [
    { name:'SDE / Full Stack', pct:72 },
    { name:'Data Science', pct:58 },
    { name:'AI / Machine Learning', pct:65 },
    { name:'Cyber Security', pct:44 },
    { name:'Cloud Computing', pct:38 },
    { name:'DevOps', pct:30 },
  ];
  const tools = [
    { name:'AlgorithmVisualizer', uses:3840 },
    { name:'CodeSynth AI', uses:3210 },
    { name:'MockInterviewer AI', uses:2980 },
    { name:'ResumeReviewer ATS', uses:2650 },
    { name:'SemanticSearch RAG', uses:2100 },
  ];
  const tChart = document.getElementById('topTracksChart');
  if (tChart) {
    tChart.innerHTML = tracks.map(t => `
      <div style="display:flex;flex-direction:column;gap:.3rem;">
        <div style="display:flex;justify-content:space-between;font-size:12.5px;"><span>${t.name}</span><span style="color:var(--accent);font-family:var(--font-mono);">${t.pct}%</span></div>
        <div class="progress-bar" style="height:5px;"><div class="progress-fill" style="width:${t.pct}%;"></div></div>
      </div>
    `).join('');
  }
  const toolChart = document.getElementById('topToolsChart');
  if (toolChart) {
    const max = tools[0].uses;
    toolChart.innerHTML = tools.map(t => `
      <div style="display:flex;flex-direction:column;gap:.3rem;">
        <div style="display:flex;justify-content:space-between;font-size:12.5px;"><span>${t.name}</span><span style="color:var(--purple);font-family:var(--font-mono);">${t.uses.toLocaleString()}</span></div>
        <div class="progress-bar" style="height:5px;"><div class="progress-fill" style="width:${(t.uses/max*100).toFixed(0)}%;background:linear-gradient(90deg,var(--purple),var(--accent-2));"></div></div>
      </div>
    `).join('');
  }
};

// ═══════════════════════════════════════════════════
// SECTION: USERS
// ═══════════════════════════════════════════════════
let allUsersCache = [];
async function loadUsers() {
  document.getElementById('usersLoading').style.display = 'block';
  const tbody = document.getElementById('allUsersTable');
  try {
    const data = await apiFetch('/api/admin/users');
    allUsersCache = data.users || [];
    renderUsersTable(allUsersCache);
    document.getElementById('usersLoading').style.display = 'none';
  } catch(e) {
    document.getElementById('usersLoading').textContent = 'Error loading users: ' + e.message;
  }
}
SECTION_LOADERS['users'] = loadUsers;

function renderUsersTable(users) {
  const tbody = document.getElementById('allUsersTable');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!users.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--mist);padding:2rem;">No users found.</td></tr>';
    return;
  }
  users.forEach(u => {
    const status = u.status || 'pending';
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><div style="display:flex;align-items:center;gap:8px;"><div class="dash-avatar" style="width:28px;height:28px;font-size:10px;">${(u.username||'?').slice(0,2).toUpperCase()}</div><span style="font-weight:600;">${u.username}</span></div></td>
      <td style="color:var(--mist);font-size:12.5px;">${u.email}</td>
      <td>${u.branch || '—'}</td>
      <td><span class="badge ${u.role === 'admin' ? 'badge-accent' : 'badge-muted'}">${u.role || 'user'}</span></td>
      <td><span class="badge ${status === 'approved' ? 'badge-green' : 'badge-muted'}">${status}</span></td>
      <td style="font-size:12px;color:var(--mist-dim);">${u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '—'}</td>
      <td style="display:flex;gap:.4rem;flex-wrap:wrap;">
        ${status !== 'approved' ? `<button class="btn btn-primary btn-sm approve-btn" data-id="${u.id}">✅ Approve</button>` : ''}
        <button class="btn btn-danger btn-sm delete-user-btn" data-id="${u.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
  attachUserActions(tbody);
}

// Filters
document.getElementById('userSearchBar')?.addEventListener('input', function() {
  const q = this.value.toLowerCase();
  const status = document.getElementById('userStatusFilter')?.value || 'all';
  filterUsers(q, status);
});
document.getElementById('userStatusFilter')?.addEventListener('change', function() {
  const q = document.getElementById('userSearchBar')?.value || '';
  filterUsers(q, this.value);
});
function filterUsers(q, status) {
  let filtered = allUsersCache;
  if (q) filtered = filtered.filter(u => u.username?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  if (status !== 'all') filtered = filtered.filter(u => (u.status || 'pending') === status);
  renderUsersTable(filtered);
}

// ═══════════════════════════════════════════════════
// SECTION: YOUTUBE VIDEOS
// ═══════════════════════════════════════════════════
SECTION_LOADERS['videos'] = loadAdminVideos;

document.getElementById('addVideoBtn')?.addEventListener('click', () => {
  const form = document.getElementById('addVideoForm');
  if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
  clearVideoForm();
});
document.getElementById('cancelVideoBtn')?.addEventListener('click', () => {
  document.getElementById('addVideoForm').style.display = 'none';
  clearVideoForm();
});

function clearVideoForm() {
  ['vUrl','vTitle','vInstructor','vDuration','vDesc','vTags'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const pinEl = document.getElementById('vPinned'); if (pinEl) pinEl.checked = false;
  const msg = document.getElementById('videoFormMsg'); if (msg) msg.textContent = '';
  const preview = document.getElementById('vPreviewBox'); if (preview) { preview.style.display = 'none'; preview.innerHTML = ''; }
}

function extractVideoId(url) {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) { const m = url.match(p); if (m) return m[1]; }
  return null;
}

document.getElementById('previewVideoBtn')?.addEventListener('click', () => {
  const url = document.getElementById('vUrl')?.value || '';
  const vid = extractVideoId(url);
  const box = document.getElementById('vPreviewBox');
  const msg = document.getElementById('videoFormMsg');
  if (!vid) { msg.textContent = 'Invalid YouTube URL. Use: youtube.com/watch?v=... or youtu.be/...'; return; }
  msg.textContent = '';
  box.style.display = 'block';
  box.innerHTML = `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-sm);padding:1rem;">
      <div style="font-size:11px;color:var(--mist-dim);margin-bottom:.5rem;">Preview</div>
      <div style="display:flex;gap:.75rem;align-items:flex-start;">
        <img src="https://img.youtube.com/vi/${vid}/mqdefault.jpg" style="width:120px;border-radius:var(--r-xs);" onerror="this.style.display='none'">
        <div>
          <div style="font-size:13px;font-weight:600;margin-bottom:.2rem;">${document.getElementById('vTitle')?.value || 'Video'}</div>
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--mist-dim);">Video ID: ${vid}</div>
        </div>
      </div>
    </div>
  `;
  if (!document.getElementById('vTitle')?.value) {
    document.getElementById('vTitle').placeholder = 'Enter a title for this video';
  }
});

document.getElementById('saveVideoBtn')?.addEventListener('click', async () => {
  const url = document.getElementById('vUrl')?.value?.trim() || '';
  const title = document.getElementById('vTitle')?.value?.trim() || '';
  const msg = document.getElementById('videoFormMsg');

  if (!url || !title) { msg.textContent = 'YouTube URL and title are required.'; return; }
  const vid = extractVideoId(url);
  if (!vid) { msg.textContent = 'Could not extract video ID from URL.'; return; }

  const payload = {
    youtube_url: url,
    title,
    description: document.getElementById('vDesc')?.value || '',
    category: document.getElementById('vCategory')?.value || 'General',
    instructor: document.getElementById('vInstructor')?.value || '',
    duration: document.getElementById('vDuration')?.value || '',
    tags: document.getElementById('vTags')?.value || '',
    pinned: document.getElementById('vPinned')?.checked ? 1 : 0,
  };

  const btn = document.getElementById('saveVideoBtn');
  btn.disabled = true; btn.textContent = 'Saving...';
  msg.textContent = '';
  try {
    const data = await apiFetch('/api/videos/admin', { method: 'POST', body: JSON.stringify(payload) });
    showToast('Video added successfully!', 'success');
    document.getElementById('addVideoForm').style.display = 'none';
    clearVideoForm();
    loadAdminVideos();
  } catch(e) {
    msg.textContent = 'Error: ' + e.message;
  } finally {
    btn.disabled = false; btn.textContent = 'Save Video';
  }
});

async function loadAdminVideos() {
  const grid = document.getElementById('adminVideosGrid');
  const loading = document.getElementById('videosLoadingAdmin');
  try {
    const data = await apiFetch('/api/videos/admin');
    const videos = data.videos || [];
    loading.style.display = 'none';
    grid.innerHTML = '';
    if (!videos.length) {
      grid.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--mist);grid-column:1/-1;"><div style="font-size:2.5rem;margin-bottom:.75rem;">🎬</div><p>No videos yet. Add your first YouTube video!</p></div>';
      return;
    }
    videos.forEach(v => {
      const card = document.createElement('div');
      card.className = 'glass-card';
      card.style.padding = '0';
      card.style.overflow = 'hidden';
      card.innerHTML = `
        <div style="position:relative;">
          <img src="${v.thumbnail}" alt="${v.title}" style="width:100%;aspect-ratio:16/9;object-fit:cover;" onerror="this.style.display='none'">
          ${v.pinned ? '<div style="position:absolute;top:.5rem;left:.5rem;"><span class="badge badge-accent">📌 PINNED</span></div>' : ''}
          <div style="position:absolute;top:.5rem;right:.5rem;"><span class="badge badge-muted">${v.category || 'General'}</span></div>
        </div>
        <div style="padding:1rem;">
          <h4 style="font-size:13.5px;margin-bottom:.3rem;line-height:1.4;">${v.title}</h4>
          <p style="font-size:12px;color:var(--mist);line-height:1.5;margin-bottom:.75rem;">${(v.description || '').slice(0,80)}${(v.description||'').length > 80 ? '...' : ''}</p>
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--mist-dim);margin-bottom:.75rem;">
            ${v.instructor ? `<span>${v.instructor}</span>` : '<span></span>'}
            ${v.duration ? `<span>${v.duration}</span>` : ''}
          </div>
          <div style="display:flex;gap:.4rem;flex-wrap:wrap;">
            <button class="btn btn-secondary btn-sm edit-video-btn" data-id="${v.id}">✏️ Edit</button>
            <button class="btn btn-primary btn-sm toggle-pin-btn" data-id="${v.id}" data-pinned="${v.pinned}">${v.pinned ? '📌 Unpin' : '📍 Pin'}</button>
            <button class="btn btn-danger btn-sm delete-video-btn" data-id="${v.id}">Delete</button>
          </div>
        </div>
      `;
      // Pin toggle
      card.querySelector('.toggle-pin-btn').addEventListener('click', async function() {
        const id = this.getAttribute('data-id');
        const pinned = this.getAttribute('data-pinned') === '1' ? 0 : 1;
        try {
          await apiFetch('/api/videos/admin/' + id + '/pin', { method: 'PUT' });
          showToast(pinned ? 'Video pinned!' : 'Video unpinned.', 'success');
          loadAdminVideos();
        } catch(e) { showToast(e.message, 'error'); }
      });
      // Edit
      card.querySelector('.edit-video-btn').addEventListener('click', function() {
        openEditVideoModal(v);
      });
      // Delete
      card.querySelector('.delete-video-btn').addEventListener('click', async function() {
        if (!confirm('Delete this video permanently?')) return;
        try {
          await apiFetch('/api/videos/admin/' + v.id, { method: 'DELETE' });
          showToast('Video deleted.', 'info');
          loadAdminVideos();
        } catch(e) { showToast(e.message, 'error'); }
      });
      grid.appendChild(card);
    });
  } catch(e) {
    loading.textContent = 'Failed to load videos: ' + e.message;
  }
}

function openEditVideoModal(v) {
  const modal = document.getElementById('adminModal');
  const content = document.getElementById('adminModalContent');
  content.innerHTML = `
    <div class="drawer-header">
      <h3 style="font-size:15px;">Edit Video</h3>
      <button onclick="document.getElementById('adminModal').classList.remove('open')" class="btn btn-icon" style="width:28px;height:28px;">&times;</button>
    </div>
    <div style="padding:1.25rem;display:flex;flex-direction:column;gap:.85rem;">
      <div class="form-group"><label>Title</label><input class="form-control" id="evTitle" value="${v.title || ''}"></div>
      <div class="form-group"><label>Description</label><textarea class="form-control" id="evDesc" rows="2">${v.description || ''}</textarea></div>
      <div class="form-group"><label>Category</label>
        <select class="form-control" id="evCat">
          ${['DSA','Web Dev','AI/ML','System Design','Python','Java','C++','Cloud','DevOps','Interview','General'].map(c => `<option ${v.category===c?'selected':''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Instructor</label><input class="form-control" id="evInstructor" value="${v.instructor || ''}"></div>
      <div class="form-group"><label>Duration</label><input class="form-control" id="evDuration" value="${v.duration || ''}"></div>
      <div class="form-group"><label>Tags</label><input class="form-control" id="evTags" value="${v.tags || ''}"></div>
      <div id="editVideoMsg" class="form-error"></div>
      <div style="display:flex;gap:.75rem;">
        <button class="btn btn-primary" id="saveEditVideoBtn" data-id="${v.id}">Save Changes</button>
        <button onclick="document.getElementById('adminModal').classList.remove('open')" class="btn btn-secondary">Cancel</button>
      </div>
    </div>
  `;
  document.getElementById('saveEditVideoBtn')?.addEventListener('click', async function() {
    const id = this.getAttribute('data-id');
    const payload = {
      title: document.getElementById('evTitle')?.value || '',
      description: document.getElementById('evDesc')?.value || '',
      category: document.getElementById('evCat')?.value || '',
      instructor: document.getElementById('evInstructor')?.value || '',
      duration: document.getElementById('evDuration')?.value || '',
      tags: document.getElementById('evTags')?.value || '',
    };
    try {
      await apiFetch('/api/videos/admin/' + id, { method: 'PUT', body: JSON.stringify(payload) });
      showToast('Video updated!', 'success');
      modal.classList.remove('open');
      loadAdminVideos();
    } catch(e) {
      document.getElementById('editVideoMsg').textContent = e.message;
    }
  });
  modal.classList.add('open');
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}

// ═══════════════════════════════════════════════════
// SECTION: AI TOOLS MODERATION
// ═══════════════════════════════════════════════════
SECTION_LOADERS['tools'] = loadAdminTools;

async function loadAdminTools() {
  const tbody = document.getElementById('adminToolsTable');
  const loading = document.getElementById('toolsLoadingAdmin');
  try {
    const data = await apiFetch('/api/admin/tools');
    const tools = data.tools || [];
    loading.style.display = 'none';
    tbody.innerHTML = '';
    if (!tools.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--mist);padding:2rem;">No tools found.</td></tr>';
      return;
    }
    tools.forEach(t => {
      const row = document.createElement('tr');
      const status = t.status || 'pending';
      row.innerHTML = `
        <td style="font-weight:600;">${t.name}</td>
        <td><span class="badge badge-muted">${t.category}</span></td>
        <td><span class="badge ${status === 'approved' ? 'badge-green' : 'badge-muted'}">${status}</span></td>
        <td><a href="${t.official_link || '#'}" target="_blank" style="color:var(--accent);font-size:12px;">Open →</a></td>
        <td style="display:flex;gap:.4rem;flex-wrap:wrap;">
          ${status !== 'approved' ? `<button class="btn btn-primary btn-sm approve-tool-btn" data-id="${t.id}">Approve</button>` : ''}
          <button class="btn btn-danger btn-sm delete-tool-btn" data-id="${t.id}">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
    tbody.querySelectorAll('.approve-tool-btn').forEach(btn => {
      btn.addEventListener('click', async function() {
        try {
          await apiFetch('/api/admin/tools/' + this.getAttribute('data-id') + '/status', { method: 'PUT', body: JSON.stringify({ status: 'approved' }) });
          showToast('Tool approved!', 'success'); loadAdminTools();
        } catch(e) { showToast(e.message, 'error'); }
      });
    });
    tbody.querySelectorAll('.delete-tool-btn').forEach(btn => {
      btn.addEventListener('click', async function() {
        if (!confirm('Delete this tool?')) return;
        try {
          await apiFetch('/api/admin/tools/' + this.getAttribute('data-id'), { method: 'DELETE' });
          showToast('Tool deleted.', 'info'); loadAdminTools();
        } catch(e) { showToast(e.message, 'error'); }
      });
    });
  } catch(e) {
    loading.textContent = 'Error: ' + e.message;
  }
}

document.getElementById('addToolBtn')?.addEventListener('click', () => openAddToolModal());

function openAddToolModal() {
  const modal = document.getElementById('adminModal');
  const content = document.getElementById('adminModalContent');
  content.innerHTML = `
    <div class="drawer-header">
      <h3 style="font-size:15px;">Add AI Tool</h3>
      <button onclick="document.getElementById('adminModal').classList.remove('open')" class="btn btn-icon" style="width:28px;height:28px;">&times;</button>
    </div>
    <div style="padding:1.25rem;display:flex;flex-direction:column;gap:.85rem;">
      <div class="form-group"><label>Tool Name *</label><input class="form-control" id="atName" placeholder="e.g. CodeSynth AI" required></div>
      <div class="form-group"><label>Category *</label>
        <select class="form-control" id="atCat">
          <option>Coding</option><option>Research</option><option>Productivity</option>
          <option>Writing</option><option>Image</option><option>Video</option>
          <option>Interview</option><option>Resume</option><option>General</option>
        </select>
      </div>
      <div class="form-group"><label>Description</label><textarea class="form-control" id="atDesc" rows="2" placeholder="What does this tool do?"></textarea></div>
      <div class="form-group"><label>Official Website URL</label><input class="form-control" id="atLink" placeholder="https://..."></div>
      <div class="form-group"><label>Tags (comma-separated)</label><input class="form-control" id="atTags" placeholder="AI, Coding, LLM"></div>
      <div id="addToolMsg" class="form-error"></div>
      <div style="display:flex;gap:.75rem;">
        <button class="btn btn-primary" id="saveNewToolBtn">Add Tool</button>
        <button onclick="document.getElementById('adminModal').classList.remove('open')" class="btn btn-secondary">Cancel</button>
      </div>
    </div>
  `;
  document.getElementById('saveNewToolBtn')?.addEventListener('click', async () => {
    const name = document.getElementById('atName')?.value?.trim();
    if (!name) { document.getElementById('addToolMsg').textContent = 'Name is required.'; return; }
    try {
      await apiFetch('/api/admin/tools', {
        method: 'POST',
        body: JSON.stringify({
          name,
          category: document.getElementById('atCat')?.value || 'General',
          description: document.getElementById('atDesc')?.value || '',
          official_link: document.getElementById('atLink')?.value || '',
          tags: document.getElementById('atTags')?.value || '',
        })
      });
      showToast('Tool added!', 'success');
      modal.classList.remove('open');
      loadAdminTools();
    } catch(e) {
      document.getElementById('addToolMsg').textContent = e.message;
    }
  });
  modal.classList.add('open');
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}

// ═══════════════════════════════════════════════════
// SECTION: ROADMAPS (view only)
// ═══════════════════════════════════════════════════
SECTION_LOADERS['roadmaps'] = function() {
  const grid = document.getElementById('adminRoadmapsGrid');
  if (!grid || grid.innerHTML.trim()) return;
  const ROADMAPS = [
    'Web Development','Java','Python','C','C++','JavaScript','React','Node.js','SQL','AI',
    'Machine Learning','Data Science','Cyber Security','Cloud Computing','DevOps',
    'Blockchain','UI/UX','DSA','DBMS','Operating Systems','Computer Networks','Aptitude','Interview Prep','System Design'
  ];
  ROADMAPS.forEach(name => {
    const card = document.createElement('div');
    card.style.cssText = 'background:var(--abyss);border:1px solid var(--border);border-radius:var(--r-sm);padding:1rem;display:flex;align-items:center;justify-content:space-between;';
    card.innerHTML = `
      <span style="font-size:14px;font-weight:600;">${name}</span>
      <div style="display:flex;gap:.5rem;">
        <span class="badge badge-green">Active</span>
        <a href="roadmaps.html" class="btn btn-ghost btn-sm">View →</a>
      </div>
    `;
    grid.appendChild(card);
  });
};

// ═══════════════════════════════════════════════════
// SECTION: ANNOUNCEMENTS
// ═══════════════════════════════════════════════════
const ANN_KEY = 'edunet_announcements';
SECTION_LOADERS['announcements'] = loadAnnouncements;

document.getElementById('newAnnouncementBtn')?.addEventListener('click', () => {
  const form = document.getElementById('announcementForm');
  if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
});
document.getElementById('cancelAnnouncementBtn')?.addEventListener('click', () => {
  document.getElementById('announcementForm').style.display = 'none';
});
document.getElementById('saveAnnouncementBtn')?.addEventListener('click', () => {
  const title = document.getElementById('aTitle')?.value?.trim();
  const body = document.getElementById('aBody')?.value?.trim();
  const type = document.getElementById('aType')?.value || 'info';
  if (!title || !body) { showToast('Title and body required.', 'error'); return; }
  const anns = JSON.parse(localStorage.getItem(ANN_KEY) || '[]');
  anns.unshift({ id: Date.now(), title, body, type, time: new Date().toLocaleString('en-IN') });
  localStorage.setItem(ANN_KEY, JSON.stringify(anns));

  // Also push to user notifications
  const usersNotifKey = 'edunet_notifs_broadcast';
  const bcast = JSON.parse(localStorage.getItem(usersNotifKey) || '[]');
  bcast.push({ id: 'a' + Date.now(), title, body: body, type, time: 'Just now', read: false });
  localStorage.setItem(usersNotifKey, JSON.stringify(bcast));

  showToast('Announcement published!', 'success');
  document.getElementById('announcementForm').style.display = 'none';
  document.getElementById('aTitle').value = '';
  document.getElementById('aBody').value = '';
  loadAnnouncements();
});

function loadAnnouncements() {
  const list = document.getElementById('announcementsList');
  if (!list) return;
  const anns = JSON.parse(localStorage.getItem(ANN_KEY) || '[]');
  list.innerHTML = '';
  if (!anns.length) {
    list.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--mist);"><div style="font-size:2rem;margin-bottom:.5rem;">📣</div><p>No announcements yet. Create one above.</p></div>';
    return;
  }
  const icons = { info: 'ℹ️', success: '✅', warning: '⚠️' };
  anns.forEach(a => {
    const el = document.createElement('div');
    el.style.cssText = 'display:flex;gap:1rem;align-items:flex-start;background:var(--abyss);border:1px solid var(--border);border-radius:var(--r-sm);padding:1rem 1.25rem;';
    el.innerHTML = `
      <div style="font-size:1.4rem;">${icons[a.type] || 'ℹ️'}</div>
      <div style="flex:1;">
        <div style="display:flex;justify-content:space-between;margin-bottom:.25rem;flex-wrap:wrap;gap:.5rem;">
          <h4 style="font-size:14px;">${a.title}</h4>
          <span style="font-size:11px;color:var(--mist-dim);">${a.time}</span>
        </div>
        <p style="font-size:13px;color:var(--mist);">${a.body}</p>
      </div>
      <button class="btn btn-danger btn-sm del-ann" data-id="${a.id}" style="flex-shrink:0;">Delete</button>
    `;
    el.querySelector('.del-ann').addEventListener('click', function() {
      const updated = JSON.parse(localStorage.getItem(ANN_KEY) || '[]').filter(x => x.id != this.getAttribute('data-id'));
      localStorage.setItem(ANN_KEY, JSON.stringify(updated));
      loadAnnouncements();
    });
    list.appendChild(el);
  });
}

// ═══════════════════════════════════════════════════
// SECTION: SETTINGS
// ═══════════════════════════════════════════════════
document.getElementById('savePlatformSettings')?.addEventListener('click', () => {
  showToast('Platform settings saved.', 'success');
});

// ── Initialize Dashboard ────────────────────────────────────────
showSection('dashboard');
