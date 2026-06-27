// ============================================================
// js/index.js — EduNet Landing Page Logic (null-safe, fully guarded)
// ============================================================
'use strict';

const { apiFetch, getToken, getSession, saveSession, clearSession, showToast } = window.EduNetAPI;

// ── Session Check ─────────────────────────────────────────────
const token   = getToken();
const session = getSession();

function updateNavForSession() {
  const navAuth = document.getElementById('navAuthBtn');
  const navGet  = document.getElementById('navGetStarted');
  if (token && session) {
    const dest = session.role === 'admin' ? 'admin.html' : 'user.html';
    if (navAuth) { navAuth.textContent = 'Dashboard'; navAuth.onclick = () => window.location.href = dest; }
    if (navGet)  { navGet.textContent  = 'Go to Dashboard'; navGet.onclick = () => window.location.href = dest; }
  } else {
    if (navAuth) navAuth.addEventListener('click', () => openAuthModal('login'));
    if (navGet)  navGet.addEventListener('click', () => openAuthModal('register'));
  }
}
updateNavForSession();

// CTA buttons
['heroCtaBtn','freeStartBtn','proStartBtn','ctaFinalBtn','mobileAuthBtn'].forEach(id => {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (token && session) { window.location.href = session.role === 'admin' ? 'admin.html' : 'user.html'; }
    else openAuthModal('register');
  });
});

// ── Search Modal ──────────────────────────────────────────────
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const searchList  = document.getElementById('searchResultsList');
const navPill     = document.getElementById('navSearchPill');

const SEARCH_DATA = [
  { title:'Data Structures & Algorithms', desc:'SDE Roadmap Track', cat:'Roadmaps', link:'roadmaps.html', icon:'🗺' },
  { title:'System Design', desc:'Architecture & Scalability', cat:'Roadmaps', link:'roadmaps.html', icon:'🗺' },
  { title:'Machine Learning', desc:'Data Science Track', cat:'Roadmaps', link:'roadmaps.html', icon:'🗺' },
  { title:'Web Development', desc:'Full Stack Roadmap', cat:'Roadmaps', link:'roadmaps.html', icon:'🗺' },
  { title:'Python Roadmap', desc:'Python development path', cat:'Roadmaps', link:'roadmaps.html', icon:'🗺' },
  { title:'CodeSynth AI', desc:'DSA solution generator', cat:'AI Tools', link:'ai-tools.html', icon:'🛠' },
  { title:'AlgorithmVisualizer', desc:'Visual algorithm tracer', cat:'AI Tools', link:'ai-tools.html', icon:'🛠' },
  { title:'ResumeReviewer ATS', desc:'ATS score & keyword optimizer', cat:'AI Tools', link:'ai-tools.html', icon:'🛠' },
  { title:'MockInterviewer AI', desc:'FAANG-style mock interviews', cat:'AI Tools', link:'ai-tools.html', icon:'🛠' },
  { title:'Coding Lab', desc:'Multi-language browser sandbox', cat:'Features', link:'coding-lab.html', icon:'💻' },
  { title:'Quiz Center', desc:'MCQ quizzes with XP & leaderboard', cat:'Features', link:'quiz.html', icon:'🧠' },
  { title:'Resume Builder', desc:'ATS-optimized resume & PDF export', cat:'Features', link:'resume.html', icon:'📄' },
  { title:'Certificates', desc:'Verified completion certificates', cat:'Features', link:'certificates.html', icon:'🏆' },
  { title:'Leaderboard', desc:'XP rankings by branch', cat:'Features', link:'leaderboard.html', icon:'🥇' },
  { title:'Interview Prep', desc:'Technical interview flashcards', cat:'Features', link:'interview.html', icon:'💬' },
  { title:'Bookmarks', desc:'Your saved roadmaps & tools', cat:'Features', link:'bookmarks.html', icon:'🔖' },
];

function openSearch() {
  if (!searchModal) return;
  searchModal.classList.add('open');
  setTimeout(() => searchInput && searchInput.focus(), 80);
}
function closeSearch() {
  if (!searchModal) return;
  searchModal.classList.remove('open');
  if (searchInput) searchInput.value = '';
  if (searchList)  searchList.innerHTML = '';
}

if (navPill)     navPill.addEventListener('click', openSearch);
if (searchModal) searchModal.addEventListener('click', e => { if (e.target === searchModal) closeSearch(); });
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSearch();
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
});

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!searchList) return;
    searchList.innerHTML = '';
    if (!q) return;
    const hits = SEARCH_DATA.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.desc.toLowerCase().includes(q) ||
      d.cat.toLowerCase().includes(q)
    );
    if (!hits.length) {
      searchList.innerHTML = '<div class="search-no-results">No results found. Try "DSA", "Python", or "Resume".</div>';
      return;
    }
    hits.forEach(item => {
      const el = document.createElement('div');
      el.className = 'search-result-item';
      el.setAttribute('role', 'option');
      el.innerHTML =
        '<div class="search-result-icon">' + item.icon + '</div>' +
        '<div class="search-result-info">' +
          '<div class="search-result-title">' + item.title + '</div>' +
          '<div class="search-result-desc">'  + item.desc  + '</div>' +
        '</div>' +
        '<div class="search-result-cat">' + item.cat + '</div>';
      el.addEventListener('click', () => { closeSearch(); window.location.href = item.link; });
      searchList.appendChild(el);
    });
  });
}

// ── Auth Modal ─────────────────────────────────────────────────
const authModal    = document.getElementById('authModal');
const authClose    = document.getElementById('authClose');
const tabRegBtn    = document.getElementById('tabRegisterBtn');
const tabLogBtn    = document.getElementById('tabLoginBtn');
const registerForm = document.getElementById('registerForm');
const loginForm    = document.getElementById('loginForm');

function openAuthModal(tab) {
  tab = tab || 'register';
  if (authModal) authModal.classList.add('open');
  switchTab(tab);
}
function closeAuthModal() {
  if (authModal) authModal.classList.remove('open');
}

if (authClose) authClose.addEventListener('click', closeAuthModal);
if (authModal) authModal.addEventListener('click', e => { if (e.target === authModal) closeAuthModal(); });

function switchTab(tab) {
  if (!tabRegBtn || !tabLogBtn || !registerForm || !loginForm) return;
  if (tab === 'register') {
    tabRegBtn.classList.add('active');    tabLogBtn.classList.remove('active');
    registerForm.classList.add('active'); loginForm.classList.remove('active');
  } else {
    tabLogBtn.classList.add('active');    tabRegBtn.classList.remove('active');
    loginForm.classList.add('active');    registerForm.classList.remove('active');
  }
}

if (tabRegBtn) tabRegBtn.addEventListener('click', () => switchTab('register'));
if (tabLogBtn) tabLogBtn.addEventListener('click', () => switchTab('login'));

// ── Sign-up link inside login form ─────────────────────────────
document.getElementById('switchToRegister')?.addEventListener('click', e => {
  e.preventDefault(); switchTab('register');
});
document.getElementById('switchToLogin')?.addEventListener('click', e => {
  e.preventDefault(); switchTab('login');
});

// ── Register Form ─────────────────────────────────────────────
if (registerForm) {
  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    const regError   = document.getElementById('regError');
    const regSuccess = document.getElementById('regSuccess');
    if (regError)   regError.textContent   = '';
    if (regSuccess) regSuccess.textContent = '';
    const submitBtn  = registerForm.querySelector('button[type=submit]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Creating account...'; }
    try {
      const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email:    (document.getElementById('regEmail')?.value    || '').trim(),
          username: (document.getElementById('regUsername')?.value || '').trim(),
          branch:    document.getElementById('regBranch')?.value   || 'General',
          password:  document.getElementById('regPassword')?.value || ''
        })
      });
      if (regSuccess) regSuccess.textContent = data.message || 'Account created! Awaiting admin approval.';
      registerForm.reset();
    } catch (err) {
      if (regError) regError.textContent = err.message;
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Create Account'; }
    }
  });
}

// ── Login Form ─────────────────────────────────────────────────
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const logError  = document.getElementById('logError');
    if (logError) logError.textContent = '';
    const submitBtn = loginForm.querySelector('button[type=submit]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Signing in...'; }
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: (document.getElementById('logUsername')?.value || '').trim(),
          password:  document.getElementById('logPassword')?.value || ''
        })
      });
      if (data.success) {
        saveSession(data.token, data.user);
        showToast('Welcome back, ' + data.user.username + '!', 'success');
        closeAuthModal();
        setTimeout(() => {
          window.location.href = data.user.role === 'admin' ? 'admin.html' : 'user.html';
        }, 800);
      }
    } catch (err) {
      if (logError) logError.textContent = err.message;
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Sign In'; }
    }
  });
}

// ── Navbar ─────────────────────────────────────────────────────
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
if (navbar)    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20));
if (navToggle && navMobile) navToggle.addEventListener('click', () => navMobile.classList.toggle('open'));
if (navMobile) navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMobile.classList.remove('open')));

// ── Live Counter ───────────────────────────────────────────────
const liveEl = document.getElementById('liveCounter');
if (liveEl) {
  let n = 12480;
  setInterval(() => {
    n += Math.floor(Math.random() * 5) - 2;
    n = Math.max(12400, Math.min(12600, n));
    liveEl.textContent = n.toLocaleString();
  }, 3000);
}

// ── Tools Grid (Homepage) ──────────────────────────────────────
const HOME_TOOLS = [
  { id:'t1',  name:'CodeSynth AI',        desc:'Generates optimal DSA solutions with time/space complexity explanations.', category:'Coding',      official_link:'https://github.com',        status:'approved' },
  { id:'t3',  name:'ResumeReviewer ATS',  desc:'ATS score, keyword scanner and grammar check for your resume.',            category:'Productivity', official_link:'https://resumereviewer.com', status:'approved' },
  { id:'t4',  name:'QueryResolve Bot',    desc:'Instant math proofs, circuit analysis and CS theory explanations.',        category:'Research',     official_link:'https://wolframalpha.com',   status:'approved' },
  { id:'t5',  name:'AlgorithmVisualizer', desc:'Visual step-by-step traces of pathfinders, sort algorithms and trees.',   category:'Coding',      official_link:'https://visualgo.net',       status:'approved' },
  { id:'t13', name:'AgentCraft Studio',   desc:'Design multi-agent loops, connect custom tools, monitor graphs.',         category:'Coding',      official_link:'https://langchain.com',      status:'approved' },
  { id:'t14', name:'SemanticSearch RAG',  desc:'Query PDFs with semantic vector embeddings and similarity scores.',       category:'Research',     official_link:'https://pinecone.io',        status:'approved' },
];

const CAT_ICONS = {
  Coding:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6L2 12l6 6"/></svg>',
  Research:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>',
  Productivity:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z"/></svg>',
};

function renderHomeTools(list) {
  const grid = document.getElementById('homeToolsGrid');
  if (!grid) return;
  const filterEl = document.querySelector('.filter-btn.active');
  const cat = filterEl ? filterEl.getAttribute('data-cat') : 'all';
  const q = (document.getElementById('toolSearchHome')?.value || '').toLowerCase().trim();
  const filtered = list.filter(t => {
    if (t.status !== 'approved') return false;
    if (cat !== 'all' && t.category !== cat) return false;
    if (q && !t.name.toLowerCase().includes(q) && !(t.desc || t.description || '').toLowerCase().includes(q)) return false;
    return true;
  });
  grid.innerHTML = '';
  if (!filtered.length) {
    grid.innerHTML = '<p style="color:var(--mist);text-align:center;padding:2rem;grid-column:1/-1;">No tools match your filter.</p>';
    return;
  }
  filtered.slice(0, 6).forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.innerHTML =
      '<div>' +
        '<div class="tool-icon">' + (CAT_ICONS[tool.category] || CAT_ICONS.Coding) + '</div>' +
        '<h3>' + tool.name + '</h3>' +
        '<p>' + (tool.desc || tool.description || '') + '</p>' +
      '</div>' +
      '<div class="tool-meta">' +
        '<span class="badge badge-muted">' + tool.category + '</span>' +
        '<a href="' + (tool.official_link || '#') + '" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">Launch →</a>' +
      '</div>';
    grid.appendChild(card);
  });
}

let cachedTools = [...HOME_TOOLS];
apiFetch('/api/tools').then(d => {
  if (d.success && d.tools) cachedTools = d.tools;
  renderHomeTools(cachedTools);
}).catch(() => renderHomeTools(cachedTools));

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderHomeTools(cachedTools);
  });
});
const toolSearchHome = document.getElementById('toolSearchHome');
if (toolSearchHome) toolSearchHome.addEventListener('input', () => renderHomeTools(cachedTools));

// ── Roadmap Tabs (Homepage) ────────────────────────────────────
const rmTabs      = document.querySelectorAll('#rmTabsHome .roadmap-tab-btn');
const rmTimelines = document.querySelectorAll('#roadmaps .roadmap-timeline');

function updateRmProgress() {
  const active = document.querySelector('#roadmaps .roadmap-timeline.active');
  if (!active) return;
  const boxes = active.querySelectorAll('.rm-chk');
  const done  = [...boxes].filter(c => c.checked).length;
  const pct   = boxes.length ? Math.round((done / boxes.length) * 100) : 0;
  const pctEl = document.getElementById('homeRmPct');
  const fillEl= document.getElementById('homeRmFill');
  if (pctEl)  pctEl.textContent  = pct + '%';
  if (fillEl) fillEl.style.width = pct + '%';
}

rmTabs.forEach(btn => {
  btn.addEventListener('click', () => {
    rmTabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const track = btn.getAttribute('data-track');
    rmTimelines.forEach(tl => tl.classList.toggle('active', tl.id === 'rm-' + track));
    updateRmProgress();
  });
});
document.querySelectorAll('#roadmaps .rm-chk').forEach(cb => cb.addEventListener('change', updateRmProgress));
updateRmProgress();

// ── Trending Videos ────────────────────────────────────────────
async function loadHomeVideos() {
  const grid = document.getElementById('homeVideosGrid');
  if (!grid) return;
  try {
    const data = await apiFetch('/api/videos?limit=3');
    const videos = data.videos || [];
    if (!videos.length) {
      grid.innerHTML = '<p style="color:var(--mist);text-align:center;grid-column:1/-1;padding:2rem;">No tutorials uploaded yet.</p>';
      return;
    }
    grid.innerHTML = '';
    videos.forEach(v => {
      const card = document.createElement('div');
      card.className = 'video-card';
      card.innerHTML = `
        <div class="video-thumb">
          <img src="${v.thumbnail}" alt="${v.title}" onerror="this.src='https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg'">
          <div class="play-overlay"><div class="play-btn">▶</div></div>
        </div>
        <div class="video-body">
          <h4>${v.title}</h4>
          <p style="font-size:12px; color:var(--mist); margin-top:.2rem;">${(v.description || '').slice(0, 80)}...</p>
          <div class="video-meta" style="margin-top:.5rem;">
            <span class="badge badge-accent">${v.category || 'General'}</span>
            <span style="font-size:11px;color:var(--mist-dim);">${v.duration || ''}</span>
          </div>
        </div>
      `;
      card.querySelector('.video-thumb').addEventListener('click', () => {
        if (getToken() && getSession()) {
          window.location.href = 'user.html';
        } else {
          openAuthModal('register');
        }
      });
      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = '<p style="color:var(--mist);text-align:center;grid-column:1/-1;padding:2rem;">Unable to load video recommendations.</p>';
  }
}
loadHomeVideos();

// ── Newsletter ─────────────────────────────────────────────────
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail')?.value?.trim();
    if (!email) return;
    showToast('Thanks for subscribing!', 'success');
    if (document.getElementById('newsletterEmail')) document.getElementById('newsletterEmail').value = '';
  });
}
