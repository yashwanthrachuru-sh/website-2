// ============================================================
// js/videos.js — EduNet Video Learning Hub
// ============================================================
'use strict';
const session = window.initPageShell('videos.html');
const { apiFetch, showToast, addXP, getSession } = window.EduNetAPI;

const CAT_ICONS = {
  'JavaScript': '🟨', 'Python': '🐍', 'DSA': '🔢', 'React': '⚛️',
  'Machine Learning': '🤖', 'System Design': '🏗️', 'Database': '🗄️',
  'DevOps': '⚙️', 'Cybersecurity': '🛡️', 'General': '🎬'
};

let allVideos = [];
let filteredVideos = [];
let currentPage = 0;
const PAGE_SIZE = 12;

// ── Bookmarks ──────────────────────────────────────────────────
function getVideoBookmarks() {
  return JSON.parse(localStorage.getItem('edunet_vid_bm_' + session?.username) || '[]');
}
function isVideoBookmarked(id) {
  return getVideoBookmarks().some(b => b.id === id);
}
function toggleVideoBookmark(video) {
  const bms = getVideoBookmarks();
  const idx = bms.findIndex(b => b.id === video.id);
  if (idx >= 0) {
    bms.splice(idx, 1);
    showToast('Bookmark removed.', 'info');
  } else {
    bms.push({ id: video.id, title: video.title, category: video.category });
    showToast('Video bookmarked!', 'success');
    addXP(5);
  }
  localStorage.setItem('edunet_vid_bm_' + session?.username, JSON.stringify(bms));
}

// ── Continue Watching ──────────────────────────────────────────
function getWatchHistory() {
  return JSON.parse(localStorage.getItem('edunet_watch_' + session?.username) || '{}');
}
function markWatched(videoId, title) {
  const hist = getWatchHistory();
  hist[videoId] = { title, timestamp: Date.now(), progress: 0 };
  localStorage.setItem('edunet_watch_' + session?.username, JSON.stringify(hist));
}
function loadContinueWatching() {
  const hist = getWatchHistory();
  const entries = Object.entries(hist).sort((a, b) => b[1].timestamp - a[1].timestamp);
  if (!entries.length) return;
  const [lastId, lastData] = entries[0];
  const section = document.getElementById('continueWatchingSection');
  if (section) {
    section.style.display = 'block';
    document.getElementById('continueWatchingTitle').textContent = lastData.title;
    document.getElementById('continueWatchingBtn').addEventListener('click', () => {
      const video = allVideos.find(v => String(v.id) === String(lastId));
      if (video) openVideoModal(video);
    });
  }
}

// ── Render Video Card ──────────────────────────────────────────
function createVideoCard(v) {
  const card = document.createElement('div');
  card.className = 'video-card';
  const icon = CAT_ICONS[v.category] || '🎬';
  const isPinned = v.pinned === 1;
  const isBm = isVideoBookmarked(v.id);

  card.innerHTML = `
    <div class="video-thumb">
      <img src="${v.thumbnail || `https://img.youtube.com/vi/${v.video_id}/maxresdefault.jpg`}" 
           alt="${v.title}" 
           loading="lazy"
           onerror="this.src='https://img.youtube.com/vi/${v.video_id}/hqdefault.jpg'">
      <div class="play-overlay">
        <div class="play-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
      </div>
      ${isPinned ? '<div class="pin-badge">📌 Featured</div>' : ''}
      ${v.duration ? `<div style="position:absolute;bottom:6px;right:6px;background:rgba(0,0,0,.75);color:#fff;font-size:10px;font-family:var(--font-mono);padding:2px 6px;border-radius:4px;">${v.duration}</div>` : ''}
    </div>
    <div class="video-body">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
        <h4 style="line-height:1.35;">${v.title}</h4>
        <button class="btn btn-icon btn-sm vid-bm-btn" data-id="${v.id}" style="color:${isBm ? 'var(--accent)' : 'var(--mist-dim)'};flex-shrink:0;" title="Bookmark">🔖</button>
      </div>
      <p style="font-size:12px;color:var(--mist);margin-top:3px;line-height:1.4;">${(v.description || '').slice(0, 80)}${v.description?.length > 80 ? '...' : ''}</p>
      <div class="video-meta" style="margin-top:.6rem;">
        <span class="badge badge-accent">${icon} ${v.category || 'General'}</span>
        ${v.instructor ? `<span style="font-size:11px;color:var(--mist-dim);">by ${v.instructor}</span>` : ''}
      </div>
    </div>
  `;

  card.querySelector('.video-thumb').addEventListener('click', () => openVideoModal(v));
  card.querySelector('h4').addEventListener('click', () => openVideoModal(v));
  card.querySelector('.vid-bm-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleVideoBookmark(v);
    renderPage(false);
  });

  return card;
}

// ── Featured Section ───────────────────────────────────────────
function renderFeatured(videos) {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const featured = videos.filter(v => v.pinned === 1).slice(0, 3);
  if (!featured.length) {
    document.getElementById('featuredSection').style.display = 'none';
    return;
  }
  grid.innerHTML = '';
  featured.forEach(v => grid.appendChild(createVideoCard(v)));
}

// ── Videos Grid ────────────────────────────────────────────────
function renderPage(append = false) {
  const grid = document.getElementById('videosGrid');
  const emptyState = document.getElementById('videoEmptyState');
  const loadMoreWrap = document.getElementById('loadMoreWrap');
  const countEl = document.getElementById('videoCount');
  if (!grid) return;

  if (!append) {
    currentPage = 0;
    grid.innerHTML = '';
  }

  const start = currentPage * PAGE_SIZE;
  const slice = filteredVideos.slice(start, start + PAGE_SIZE);

  if (!filteredVideos.length) {
    emptyState.style.display = 'block';
    loadMoreWrap.style.display = 'none';
    countEl.textContent = '';
    return;
  }

  emptyState.style.display = 'none';
  countEl.textContent = `(${filteredVideos.length} videos)`;
  slice.forEach(v => grid.appendChild(createVideoCard(v)));

  const hasMore = (currentPage + 1) * PAGE_SIZE < filteredVideos.length;
  loadMoreWrap.style.display = hasMore ? 'block' : 'none';
  currentPage++;
}

// ── Filter & Search ────────────────────────────────────────────
function applyFilters() {
  const activeCat = document.querySelector('#videoCatFilter .filter-btn.active')?.dataset.cat || 'all';
  const q = (document.getElementById('videoSearchBar')?.value || '').toLowerCase().trim();

  filteredVideos = allVideos.filter(v => {
    if (activeCat !== 'all' && v.category !== activeCat) return false;
    if (q) {
      const haystack = [v.title, v.description, v.instructor, v.category, v.tags].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  renderPage(false);
}

// ── Video Player Modal ─────────────────────────────────────────
let currentVideo = null;

function openVideoModal(v) {
  currentVideo = v;
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  const title = document.getElementById('videoModalTitle');
  const meta = document.getElementById('videoModalMeta');
  const desc = document.getElementById('videoModalDesc');
  const bmBtn = document.getElementById('videoBookmarkBtn');
  const ytBtn = document.getElementById('videoOpenYT');

  const embedId = v.video_id || '';
  iframe.src = `https://www.youtube.com/embed/${embedId}?autoplay=1&rel=0`;
  title.textContent = v.title;
  desc.textContent = v.description || '';
  meta.innerHTML = `
    ${v.category ? `<span class="badge badge-accent">${CAT_ICONS[v.category] || '🎬'} ${v.category}</span>` : ''}
    ${v.instructor ? `<span>by ${v.instructor}</span>` : ''}
    ${v.duration ? `<span>⏱ ${v.duration}</span>` : ''}
  `;
  bmBtn.style.color = isVideoBookmarked(v.id) ? 'var(--accent)' : 'var(--mist-dim)';
  ytBtn.onclick = () => window.open(v.youtube_url, '_blank');

  modal.classList.add('open');
  markWatched(v.id, v.title);
  addXP(2);
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  modal.classList.remove('open');
  iframe.src = '';
}

document.getElementById('closeVideoModal')?.addEventListener('click', closeVideoModal);
document.getElementById('videoModal')?.addEventListener('click', (e) => {
  if (e.target === document.getElementById('videoModal')) closeVideoModal();
});
document.getElementById('videoBookmarkBtn')?.addEventListener('click', () => {
  if (!currentVideo) return;
  toggleVideoBookmark(currentVideo);
  document.getElementById('videoBookmarkBtn').style.color = isVideoBookmarked(currentVideo.id) ? 'var(--accent)' : 'var(--mist-dim)';
});

// Category filter listeners
document.querySelectorAll('#videoCatFilter .filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('#videoCatFilter .filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    applyFilters();
  });
});

// Search
document.getElementById('videoSearchBar')?.addEventListener('input', applyFilters);

// Load more
document.getElementById('loadMoreBtn')?.addEventListener('click', () => renderPage(true));

// Sort buttons
document.getElementById('sortNewest')?.addEventListener('click', () => {
  filteredVideos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  renderPage(false);
});
document.getElementById('sortPopular')?.addEventListener('click', () => {
  filteredVideos.sort((a, b) => (b.pinned || 0) - (a.pinned || 0));
  renderPage(false);
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  window.EduNetAPI.clearSession();
  showToast('Logged out.', 'info');
  setTimeout(() => window.location.href = 'index.html', 600);
});

// ── Load Videos ────────────────────────────────────────────────
async function loadVideos() {
  try {
    const data = await apiFetch('/api/videos');
    allVideos = data.videos || [];
    filteredVideos = [...allVideos];

    renderFeatured(allVideos);
    renderPage(false);
    loadContinueWatching();
  } catch (err) {
    console.error('Load videos error:', err);
    // Show fallback static data
    allVideos = getFallbackVideos();
    filteredVideos = [...allVideos];
    renderFeatured(allVideos);
    renderPage(false);
  }
}

function getFallbackVideos() {
  return [
    { id: 1, title: 'JavaScript Full Course for Beginners', video_id: 'PkZNo7MFNFg', youtube_url: 'https://youtu.be/PkZNo7MFNFg', thumbnail: 'https://img.youtube.com/vi/PkZNo7MFNFg/maxresdefault.jpg', category: 'JavaScript', instructor: 'freeCodeCamp', duration: '3h 26m', description: 'Complete JavaScript course from basics to ES6+.', pinned: 1 },
    { id: 2, title: 'Python for Everybody', video_id: 'rfscVS0vtbw', youtube_url: 'https://youtu.be/rfscVS0vtbw', thumbnail: 'https://img.youtube.com/vi/rfscVS0vtbw/maxresdefault.jpg', category: 'Python', instructor: 'Dr. Chuck', duration: '13h 39m', description: 'Full Python course from University of Michigan.', pinned: 1 },
    { id: 3, title: 'Data Structures and Algorithms - Full Course', video_id: '8hly31xKli0', youtube_url: 'https://youtu.be/8hly31xKli0', thumbnail: 'https://img.youtube.com/vi/8hly31xKli0/maxresdefault.jpg', category: 'DSA', instructor: 'freeCodeCamp', duration: '8h 53m', description: 'Complete DSA course with arrays, trees, graphs.', pinned: 1 },
    { id: 4, title: 'React JS Full Course', video_id: 'Ke90Tje7VS0', youtube_url: 'https://youtu.be/Ke90Tje7VS0', thumbnail: 'https://img.youtube.com/vi/Ke90Tje7VS0/maxresdefault.jpg', category: 'React', instructor: 'Dave Gray', duration: '9h 49m', description: 'Complete React.js tutorial with hooks and state.' },
    { id: 5, title: 'Neural Networks from Scratch', video_id: 'aircAruvnKk', youtube_url: 'https://youtu.be/aircAruvnKk', thumbnail: 'https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg', category: 'Machine Learning', instructor: '3Blue1Brown', duration: '19m', description: 'Visual intro to neural networks by 3Blue1Brown.' },
    { id: 6, title: 'System Design Interview Masterclass', video_id: '7eh4d6sabA0', youtube_url: 'https://youtu.be/7eh4d6sabA0', thumbnail: 'https://img.youtube.com/vi/7eh4d6sabA0/maxresdefault.jpg', category: 'System Design', instructor: 'ByteByteGo', duration: '1h 23m', description: 'Design scalable systems like Netflix and Uber.' },
    { id: 7, title: 'SQL Full Course for Beginners', video_id: 'I6id1Y0YuNk', youtube_url: 'https://youtu.be/I6id1Y0YuNk', thumbnail: 'https://img.youtube.com/vi/I6id1Y0YuNk/maxresdefault.jpg', category: 'Database', instructor: 'freeCodeCamp', duration: '4h 20m', description: 'Complete SQL from queries to stored procedures.' },
    { id: 8, title: 'Docker Full Course', video_id: 'CqP7bxCa6Ks', youtube_url: 'https://youtu.be/CqP7bxCa6Ks', thumbnail: 'https://img.youtube.com/vi/CqP7bxCa6Ks/maxresdefault.jpg', category: 'DevOps', instructor: 'TechWorld with Nana', duration: '3h 18m', description: 'Containers, images and docker-compose explained.' },
  ];
}

loadVideos();
