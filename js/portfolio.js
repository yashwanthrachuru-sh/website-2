// ============================================================
// js/portfolio.js — Developer Portfolio Frontend Controller
// Handles owner edit mode & public visitor mode, dynamic stats
// calculations, and rich charts rendering.
// ============================================================
'use strict';

(function () {
  const { apiFetch, getToken, getSession, showToast } = window.EduNetAPI;

  // State managers
  let isOwner = false;
  let portfolioData = null;
  let usernameContext = '';
  let chartInstances = {};
  let projectsList = [];
  let currentProjectPage = 1;
  const projectsPerPage = 3;

  // Simple, safe markdown parser that prevents XSS
  function parseMarkdown(text) {
    if (!text) return '<p style="color:var(--mist-dim);font-style:italic;">No bio details provided yet.</p>';
    
    // Escape HTML to prevent XSS
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // Code blocks: ```code```
    escaped = escaped.replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>');

    // Inline code: `code`
    escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold: **text**
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Bullet lists: - item or * item
    escaped = escaped.replace(/^(?:\-|\*)\s+(.+)$/gm, '<li>$1</li>');
    escaped = escaped.replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>');
    // Clean up adjacent ul tags
    escaped = escaped.replace(/<\/ul>\s*<ul>/g, '');

    // Links: [text](url)
    escaped = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Paragraphs
    const paras = escaped.split(/\n\n+/);
    return paras.map(p => {
      if (p.trim().startsWith('<pre>') || p.trim().startsWith('<ul>')) return p;
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('');
  }

  // Detect Route and Auth mode
  function detectMode() {
    const path = window.location.pathname;
    const session = getSession();
    
    // Path patterns: /profile/portfolio (owner) or /portfolio.html (owner) or /portfolio/:username (public)
    if (path.includes('/profile/portfolio') || path.includes('/portfolio.html')) {
      isOwner = true;
      if (!session) {
        window.location.href = '/index.html';
        return;
      }
      usernameContext = session.username;
    } else {
      // Extract username from /portfolio/username
      const segments = path.split('/');
      const portIdx = segments.indexOf('portfolio');
      if (portIdx !== -1 && segments[portIdx + 1]) {
        usernameContext = segments[portIdx + 1];
        isOwner = session && session.username === usernameContext;
      } else {
        // Fallback or invalid path
        window.location.href = '/index.html';
        return;
      }
    }

    // Toggle Owner class visibility
    document.querySelectorAll('.owner-only').forEach(el => {
      el.style.setProperty('display', isOwner ? '' : 'none', isOwner ? '' : 'important');
    });

    // Toggle page shell navigation elements if not authenticated visitor
    if (!session) {
      document.getElementById('dashSidebar').style.display = 'none';
      document.getElementById('dashTopbar').style.display = 'none';
      document.getElementById('publicNavbar').style.display = 'flex';
      
      const mainLayout = document.getElementById('dashLayoutContainer');
      if (mainLayout) mainLayout.style.display = 'block'; // remove sidebar spacer constraints
    } else {
      // Boot page shell integrations
      if (window.initPageShell) {
        window.initPageShell('sidebarPortfolioLink');
      }
    }
  }

  // Fetch Portfolio details
  async function loadPortfolio() {
    try {
      let data;
      if (isOwner) {
        data = await apiFetch('/api/portfolio');
      } else {
        data = await apiFetch(`/api/portfolio/public/${usernameContext}`);
      }

      if (!data.success) {
        showToast('Failed to load portfolio details.', 'error');
        return;
      }

      portfolioData = data;
      projectsList = data.projects || [];

      // Render all panels
      renderHero();
      renderAbout();
      renderSkills();
      renderProjects();
      renderCertificates();
      renderContact();
      renderAchievements();

      // Render settings inside edit modals
      if (isOwner) {
        populateSettingsModal();
        renderCompletionStrength();
      }

      // Fetch analytics / charts
      loadAnalyticsData();

      // Display main container
      document.getElementById('portfolioSkeleton').style.display = 'none';
      document.getElementById('portfolioContent').style.display = 'block';

      // Phase 5: Initialize GitHub, Analytics, Strength, Theme, Recruiter features
      if (window.__p5Init) window.__p5Init(data);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error loading profile.', 'error');
    }
  }

  // Render portfolio completion strength card for owner
  function renderCompletionStrength() {
    const card = document.getElementById('portfolioCompletionCard');
    const pctVal = document.getElementById('completionPctVal');
    const pctBar = document.getElementById('completionPctBar');
    if (!card) return;

    if (!isOwner) {
      card.style.display = 'none';
      return;
    }

    card.style.display = 'block';
    const pct = portfolioData.completion_percentage || 0;
    if (pctVal) pctVal.textContent = pct + '%';
    if (pctBar) setTimeout(() => { pctBar.style.width = pct + '%'; }, 100);
  }

  // Render Hero Section
  function renderHero() {
    const u = portfolioData.user;
    const s = portfolioData.settings || {};

    const profilePic = document.getElementById('profileAvatarImg');
    const profileText = document.getElementById('profileAvatarText');
    const banner = document.getElementById('profileBannerImg');

    // Avatar pic or initials
    if (s.profile_picture) {
      profilePic.src = s.profile_picture;
      profilePic.style.display = 'block';
      profileText.style.display = 'none';
    } else {
      profilePic.style.display = 'none';
      profileText.style.display = 'block';
      profileText.textContent = (u.username || 'ST').slice(0,2).toUpperCase();
    }

    // Banner
    if (s.profile_banner) {
      banner.src = s.profile_banner;
    }

    document.getElementById('profFullName').textContent = u.username || 'Student';
    document.getElementById('profHeadline').textContent = s.headline || 'EduNet Developer';
    
    // badges
    const openToWorkBadge = document.getElementById('badgeOpenToWork');
    if (s.open_to_work === 1) {
      openToWorkBadge.style.display = 'inline-flex';
    } else {
      openToWorkBadge.style.display = 'none';
    }

    // user detail pills
    document.getElementById('detailCollege').innerHTML = `🏢 ${s.college || u.college || 'Self Learner'}`;
    document.getElementById('detailCountry').innerHTML = `🌍 ${s.location || u.country || 'Global'}`;
    document.getElementById('detailStreak').innerHTML = `🔥 ${u.streak || 0} Day streak`;
    document.getElementById('detailRoadmap').innerHTML = `🗺️ ${u.branch || 'SDE'} Track`;

    // Stats
    const xpPanel = document.getElementById('quickStatsPanel');
    if (s.show_xp === 0) {
      xpPanel.style.display = 'none';
    } else {
      xpPanel.style.display = 'grid';
      document.getElementById('statValXP').textContent = u.xp ? u.xp.toLocaleString() : '0';
      document.getElementById('statValLevel').textContent = u.level || '1';
    }
    
    if (s.show_certificates === 0) {
      document.getElementById('cardCertificates').style.display = 'none';
      document.getElementById('statValCerts').parentElement.style.display = 'none';
    } else {
      document.getElementById('cardCertificates').style.display = 'block';
      document.getElementById('statValCerts').parentElement.style.display = 'block';
      document.getElementById('statValCerts').textContent = (portfolioData.certificates || []).length;
    }

    // Download resume button
    const btnResume = document.getElementById('btnResumeDownload');
    if (portfolioData.resume_url) {
      btnResume.style.display = 'inline-flex';
      btnResume.onclick = () => window.open(portfolioData.resume_url, '_blank');
      
      const btnDelete = document.getElementById('btnResumeDelete');
      if (btnDelete) btnDelete.style.display = 'inline-flex';
    } else {
      btnResume.style.display = 'none';
      
      const btnDelete = document.getElementById('btnResumeDelete');
      if (btnDelete) btnDelete.style.display = 'none';
    }
  }

  // Render About section
  function renderAbout() {
    const s = portfolioData.settings || {};
    document.getElementById('profAboutContent').innerHTML = parseMarkdown(s.about_me);
  }

  // Render Skills chips
  function renderSkills() {
    const skills = portfolioData.skills || [];
    const grid = document.getElementById('profSkillsGrid');
    
    if (!skills.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;color:var(--mist-dim);text-align:center;padding:1.5rem;">Study courses and finish lessons to auto-populate skills profile.</div>';
      return;
    }

    const icons = {
      javascript: '🟨', python: '🐍', java: '☕', cpp: '🔵', html: '🟧', css: '🟦',
      sql: '🛢️', 'node.js': '🟢', express: '🚀', mysql: '🐬', git: '🐙', github: '🐈',
      linux: '🐧', dsa: '🧠'
    };

    grid.innerHTML = skills.map(skill => {
      const nameLower = skill.name.toLowerCase();
      const icon = icons[nameLower] || '⚙️';
      return `
        <div class="portfolio-skill-chip animate-fade-in">
          <div class="portfolio-skill-icon">${icon}</div>
          <div class="portfolio-skill-name" title="${skill.name}">${skill.name}</div>
          <div class="portfolio-skill-progress-bar">
            <div class="portfolio-skill-progress-fill" style="width: ${skill.proficiency}%;"></div>
          </div>
          <div class="portfolio-skill-meta">
            <span>${skill.proficiency}%</span>
            <span>${skill.xp_earned} XP</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Projects Showcase list (with local Search, Filter, Pagination)
  function renderProjects() {
    const grid = document.getElementById('profProjectsGrid');
    const s = portfolioData.settings || {};

    if (s.show_projects === 0) {
      document.getElementById('cardProjects').style.display = 'none';
      return;
    }
    document.getElementById('cardProjects').style.display = 'block';

    // Apply Search
    const searchVal = document.getElementById('projSearchInput').value.trim().toLowerCase();
    
    // Apply Category Filter
    const activeFilterBtn = document.querySelector('#projFilterRow .filter-btn.active');
    const catFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

    let filtered = projectsList.filter(proj => {
      const matchSearch = proj.title.toLowerCase().includes(searchVal) || proj.description.toLowerCase().includes(searchVal) || (proj.tech_stack || '').toLowerCase().includes(searchVal);
      
      let matchCat = true;
      if (catFilter === 'featured') {
        matchCat = proj.is_featured === 1;
      } else if (catFilter === 'graded') {
        matchCat = proj.is_graded === 1;
      } else if (catFilter === 'manual') {
        matchCat = !proj.is_graded;
      }

      return matchSearch && matchCat;
    });

    if (!filtered.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;color:var(--mist-dim);text-align:center;padding:2.5rem;">No projects matching conditions.</div>';
      document.getElementById('profProjectsPagination').innerHTML = '';
      return;
    }

    // Paginate
    const totalPages = Math.ceil(filtered.length / projectsPerPage);
    if (currentProjectPage > totalPages) currentProjectPage = 1;
    const startIdx = (currentProjectPage - 1) * projectsPerPage;
    const paginated = filtered.slice(startIdx, startIdx + projectsPerPage);

    // Render cards
    grid.innerHTML = paginated.map(proj => {
      const techChips = (proj.tech_stack || '').split(',').map(t => `<span>${t.trim()}</span>`).join('');
      const isGraded = proj.is_graded;
      const thumbUrl = proj.images ? proj.images.split(',')[0] : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80';

      return `
        <div class="portfolio-project-card animate-fade-in">
          <div class="portfolio-project-thumb">
            <img src="${thumbUrl}" alt="${proj.title}" onerror="this.src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80'">
            <div class="portfolio-project-badge-container">
              ${proj.is_featured ? '<span class="badge badge-accent">Featured</span>' : ''}
              ${isGraded ? '<span class="badge badge-green">Graded Tasks</span>' : '<span class="badge badge-muted">Personal</span>'}
            </div>
          </div>
          <div class="portfolio-project-body">
            <div>
              <h4>${proj.title}</h4>
              <p>${proj.description}</p>
              <div class="portfolio-project-tech">${techChips}</div>
            </div>
            <div class="portfolio-project-actions">
              <span style="font-size:11px;color:var(--mist-dim);">${proj.difficulty || 'Medium'} · ${proj.status || 'Completed'}</span>
              <div class="portfolio-project-links">
                ${proj.github_link ? `<a href="${proj.github_link}" target="_blank">GitHub</a>` : ''}
                ${proj.live_link ? `<a href="${proj.live_link}" target="_blank">Demo</a>` : ''}
                ${isOwner && !isGraded ? `
                  <a href="#" class="edit-proj-btn" data-id="${proj.id}" style="color:var(--purple);">Edit</a>
                  <a href="#" class="delete-proj-btn" data-id="${proj.id}" style="color:var(--rose);">Delete</a>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind edit/delete handlers
    grid.querySelectorAll('.edit-proj-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const id = parseInt(btn.getAttribute('data-id'));
        openProjectModal(id);
      });
    });

    grid.querySelectorAll('.delete-proj-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const id = parseInt(btn.getAttribute('data-id'));
        triggerDeleteProject(id);
      });
    });

    // Render Pagination Controls
    renderPaginationControls(totalPages);
  }

  function renderPaginationControls(totalPages) {
    const pagin = document.getElementById('profProjectsPagination');
    if (totalPages <= 1) {
      pagin.innerHTML = '';
      return;
    }

    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
      buttons += `<button class="portfolio-page-btn ${currentProjectPage === i ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    pagin.innerHTML = buttons;

    pagin.querySelectorAll('.portfolio-page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentProjectPage = parseInt(btn.getAttribute('data-page'));
        renderProjects();
      });
    });
  }

  // Render Certificates List
  function renderCertificates() {
    const list = portfolioData.certificates || [];
    const grid = document.getElementById('profCertsGrid');
    const s = portfolioData.settings || {};

    if (s.show_certificates === 0) return;

    if (!list.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;color:var(--mist-dim);text-align:center;padding:1.5rem;">Earn completion certificates on roadmaps to showcase here.</div>';
      return;
    }

    grid.innerHTML = list.map(c => `
      <div class="portfolio-cert-card">
        <div>
          <span style="font-size:24px;">🎓</span>
          <h4 style="margin-top:0.5rem;font-size:14px;color:var(--frost);">${c.title || 'Course Certificate'}</h4>
          <div class="portfolio-cert-hash">ID: ${c.certificate_hash.slice(0, 16)}...</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border);padding-top:0.75rem;margin-top:1rem;">
          <span style="font-size:11px;color:var(--mist-dim);font-family:var(--font-mono);">${new Date(c.issue_date).toLocaleDateString()}</span>
          <div style="display:flex;gap:8px;">
            <a href="/verify.html?hash=${c.certificate_hash}" class="btn btn-secondary btn-sm" style="padding:4px 8px;">Verify</a>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render Contact information
  function renderContact() {
    const u = portfolioData.user;
    const s = portfolioData.socials || {};
    const settings = portfolioData.settings || {};
    const panel = document.getElementById('profContactPanel');

    const list = [];
    if (s.email && settings.hide_email !== 1) {
      list.push(`<div>📧 <strong>Email:</strong> <a href="mailto:${s.email}">${s.email}</a></div>`);
    } else if (u.email && settings.hide_email !== 1) {
      list.push(`<div>📧 <strong>Email:</strong> <a href="mailto:${u.email}">${u.email}</a></div>`);
    }

    if (s.phone) {
      list.push(`<div>📞 <strong>Phone:</strong> ${s.phone}</div>`);
    }
    if (settings.location) {
      list.push(`<div>📍 <strong>Location:</strong> ${settings.location}</div>`);
    }
    if (settings.availability) {
      list.push(`<div>⌛ <strong>Availability:</strong> ${settings.availability}</div>`);
    }

    // Social Links
    const socialLinks = [];
    if (s.github_url) socialLinks.push(`<a href="${s.github_url}" target="_blank" class="btn btn-icon" title="GitHub"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.21.08 1.85 1.24 1.85 1.24 1.08 1.85 2.83 1.31 3.52 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02 0 2.05.13 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg></a>`);
    if (s.linkedin_url) socialLinks.push(`<a href="${s.linkedin_url}" target="_blank" class="btn btn-icon" title="LinkedIn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M8 11v5M8 8v.5M12 16v-3a2 2 0 014 0v3" stroke="currentColor" stroke-width="1.5"/></svg></a>`);
    if (s.twitter_url) socialLinks.push(`<a href="${s.twitter_url}" target="_blank" class="btn btn-icon" title="Twitter"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 4l16 16M20 4L4 20" stroke="currentColor" stroke-width="1.8"/></svg></a>`);
    if (s.instagram_url) socialLinks.push(`<a href="${s.instagram_url}" target="_blank" class="btn btn-icon" title="Instagram"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg></a>`);
    if (s.website_url) socialLinks.push(`<a href="${s.website_url}" target="_blank" class="btn btn-icon" title="Website">🌐</a>`);

    if (socialLinks.length) {
      list.push(`<div style="display:flex;gap:0.5rem;margin-top:0.75rem;">${socialLinks.join('')}</div>`);
    }

    if (!list.length) {
      panel.innerHTML = '<div style="color:var(--mist-dim);">No contact references shared.</div>';
    } else {
      panel.innerHTML = list.join('');
    }
  }

  // Render Achievements
  function renderAchievements() {
    const list = portfolioData.achievements || [];
    const grid = document.getElementById('profAchievementsGrid');
    const s = portfolioData.settings || {};

    if (s.show_achievements === 0) {
      document.getElementById('cardAchievements').style.display = 'none';
      return;
    }
    document.getElementById('cardAchievements').style.display = 'block';

    if (!list.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;color:var(--mist-dim);text-align:center;padding:1.5rem;">Earn points and finish modules to unlock achievements.</div>';
      return;
    }

    grid.innerHTML = list.map(a => `
      <div class="ach-badge earned" title="${a.description}" style="margin:0;padding:.75rem;">
        <div class="ach-icon" style="font-size:24px;margin-bottom:4px;">${a.icon || '🏆'}</div>
        <div class="ach-name" style="font-size:11.5px;font-weight:600;color:var(--frost);">${a.title}</div>
      </div>
    `).join('');
  }

  // Load Charts and Heatmap Analytics
  async function loadAnalyticsData() {
    try {
      const s = portfolioData.settings || {};
      let stats;
      
      if (isOwner) {
        stats = await apiFetch('/api/portfolio/analytics');
      } else {
        // public route aggregates everything in single query
        stats = portfolioData;
      }

      if (!stats.success) return;

      // Render Heatmap
      if (!s || s.show_streak === 1) {
        document.getElementById('cardHeatmap').style.display = 'block';
        renderHeatmapGrid(stats.heatmap);
      } else {
        document.getElementById('cardHeatmap').style.display = 'none';
      }

      // Render Charts
      if (!s || s.show_xp === 1) {
        document.getElementById('cardCharts').style.display = 'block';
        renderWeeklyChart(stats.heatmap);
        renderSkillsRadarChart();
        renderMonthlyAggChart(stats.heatmap);
      } else {
        document.getElementById('cardCharts').style.display = 'none';
      }

      // Render Timeline
      renderTimeline(stats.timeline);

      // Render Mock Interview Stats
      if (!s || s.show_interview_scores === 1) {
        document.getElementById('cardInterviews').style.display = 'block';
        renderInterviewPanel(stats.interview);
      } else {
        document.getElementById('cardInterviews').style.display = 'none';
      }

    } catch (e) {
      console.warn('Analytics loading error (possibly unpopulated stats):', e.message);
    }
  }

  // Render weekly XP line chart
  function renderWeeklyChart(heatmap) {
    const canvas = document.getElementById('chartWeeklyTelemetry');
    if (!canvas) return;

    // Calculate last 7 days of XP earned
    const days = [];
    const labels = [];
    const xpData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().slice(0, 10);
      days.push(str);
      labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
    }

    const activityMap = {};
    if (heatmap) {
      heatmap.forEach(h => activityMap[h.day] = h.xp_earned || 0);
    }

    days.forEach(day => xpData.push(activityMap[day] || 0));

    if (chartInstances.weekly) chartInstances.weekly.destroy();

    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 180);
    grad.addColorStop(0, 'rgba(99,102,241,0.3)');
    grad.addColorStop(1, 'rgba(99,102,241,0.01)');

    chartInstances.weekly = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'XP Gained',
          data: xpData,
          borderColor: '#6366f1',
          backgroundColor: grad,
          borderWidth: 2,
          pointRadius: 4,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' }, beginAtZero: true }
        }
      }
    });
  }

  // Render Skill Radar Chart
  function renderSkillsRadarChart() {
    const canvas = document.getElementById('chartSkillsRadar');
    if (!canvas) return;

    const skills = portfolioData.skills || [];
    const sorted = [...skills].sort((a,b) => b.proficiency - a.proficiency).slice(0, 5);

    const labels = sorted.map(s => s.name);
    const data = sorted.map(s => s.proficiency);

    if (chartInstances.radar) chartInstances.radar.destroy();

    chartInstances.radar = new Chart(canvas.getContext('2d'), {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: 'Skill Depth %',
          data,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139,92,246,0.15)',
          borderWidth: 1.5,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            angleLines: { color: 'rgba(255,255,255,0.05)' },
            grid: { color: 'rgba(255,255,255,0.05)' },
            pointLabels: { color: '#64748b', font: { size: 10 } },
            ticks: { display: false, max: 100 }
          }
        }
      }
    });
  }

  // Render Monthly Growth Chart
  function renderMonthlyAggChart(heatmap) {
    const canvas = document.getElementById('chartMonthlyAggregates');
    if (!canvas) return;

    // Group last 30 days into 4 weeks
    const data = [0, 0, 0, 0];
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

    if (heatmap) {
      const now = new Date();
      heatmap.forEach(h => {
        const diff = Math.floor((now - new Date(h.day)) / (1000 * 60 * 60 * 24));
        if (diff >= 0 && diff < 30) {
          const wkIdx = Math.min(3, Math.floor(diff / 7));
          // Reverse index to show oldest week first
          data[3 - wkIdx] += h.xp_earned || 0;
        }
      });
    }

    if (chartInstances.monthly) chartInstances.monthly.destroy();

    chartInstances.monthly = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: '#06b6d4',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#64748b' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' }, beginAtZero: true }
        }
      }
    });
  }

  // Render Activity Heatmap
  function renderHeatmapGrid(heatmap) {
    const grid = document.getElementById('heatmapGrid');
    const monthsEl = document.getElementById('heatmapMonths');
    const totalEl = document.getElementById('heatmapTotal');
    const tooltip = document.getElementById('hmTooltip');
    if (!grid) return;

    // Last 364 days cells
    const today = new Date();
    today.setHours(0,0,0,0);
    const startOffset = (today.getDay() + 1) % 7;
    const start = new Date(today);
    start.setDate(today.getDate() - 363 - startOffset);

    const activityMap = {};
    if (heatmap) {
      heatmap.forEach(h => {
        activityMap[h.day] = h;
      });
    }

    let activeDays = 0;
    const monthLabels = [];
    let prevMonth = -1;

    grid.innerHTML = '';
    
    for (let i = 0; i < 364; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const str = d.toISOString().slice(0, 10);
      const act = activityMap[str];

      const lessons = act ? act.lessons_done || 0 : 0;
      const xp = act ? act.xp_earned || 0 : 0;
      const mins = act ? act.coding_minutes || 0 : 0;

      let level = 0;
      if (xp > 0 || lessons > 0 || mins > 0) {
        activeDays++;
        const score = (lessons * 3) + (mins * 2) + (xp / 100);
        if (score < 3) level = 1;
        else if (score < 8) level = 2;
        else if (score < 15) level = 3;
        else level = 4;
      }

      // Track month transitions
      const col = Math.floor(i / 7);
      if (d.getMonth() !== prevMonth) {
        monthLabels.push({ label: d.toLocaleDateString('en-US', { month: 'short' }), col });
        prevMonth = d.getMonth();
      }

      // Create cell element
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      cell.style.width = '11px';
      cell.style.height = '11px';
      cell.style.borderRadius = '2px';
      cell.style.background = 'var(--border)';

      if (level > 0) {
        const colors = {
          '1': 'rgba(99, 102, 241, 0.25)',
          '2': 'rgba(99, 102, 241, 0.5)',
          '3': 'rgba(99, 102, 241, 0.75)',
          '4': 'rgba(99, 102, 241, 1)'
        };
        cell.style.background = colors[level];
      }

      // Tooltip actions
      const dateFriendly = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const tipStr = (xp || lessons || mins) 
        ? `${dateFriendly} · ${xp} XP · ${lessons} lessons · ${mins} mins coding`
        : `No activity — ${dateFriendly}`;

      cell.addEventListener('mouseenter', e => {
        tooltip.textContent = tipStr;
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX + 10) + 'px';
        tooltip.style.top = (e.clientY - 30) + 'px';
      });
      cell.addEventListener('mousemove', e => {
        tooltip.style.left = (e.clientX + 10) + 'px';
        tooltip.style.top = (e.clientY - 30) + 'px';
      });
      cell.addEventListener('mouseleave', () => tooltip.style.display = 'none');

      grid.appendChild(cell);
    }

    // Render Month labels row
    if (monthsEl) {
      const colWidth = 14; // 11px cell + 3px gap
      monthsEl.innerHTML = monthLabels.map((m, idx) => {
        const nextCol = monthLabels[idx + 1] ? monthLabels[idx + 1].col : 52;
        const width = (nextCol - m.col) * colWidth;
        return `<div style="width:${width}px;flex-shrink:0;">${m.label}</div>`;
      }).join('');
    }

    if (totalEl) {
      totalEl.textContent = `${activeDays} active day${activeDays !== 1 ? 's' : ''} in the last 365 days`;
    }
  }

  // Render Timeline
  function renderTimeline(timeline) {
    const container = document.getElementById('profTimelineGrid');
    
    if (!timeline || !timeline.length) {
      container.innerHTML = '<div style="color:var(--mist-dim);">No recent activity recorded on timeline.</div>';
      return;
    }

    container.innerHTML = timeline.slice(0, 8).map(t => {
      const dateStr = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `
        <div class="portfolio-timeline-node">
          <div class="portfolio-timeline-dot">${t.icon}</div>
          <div class="portfolio-timeline-content animate-fade-in">
            <div class="portfolio-timeline-title">
              <span>${t.title}</span>
              <span class="portfolio-timeline-date">${dateStr}</span>
            </div>
            <div style="font-size:12px;color:var(--mist);margin-top:2px;">
              ${t.desc}
              ${t.link ? `<br><a href="${t.link}" style="color:var(--accent);font-size:11px;margin-top:4px;display:inline-block;">Verify link</a>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Mock Interview Panel
  function renderInterviewPanel(interview) {
    const summary = document.getElementById('interviewSummaryPanel');
    const feedbackList = document.getElementById('interviewFeedbackList');
    const canvas = document.getElementById('chartInterviewRadar');

    if (!interview || interview.completed === 0) {
      summary.innerHTML = '<div style="color:var(--mist-dim);padding:1rem;">Complete mock interviews in interview prep dashboard.</div>';
      feedbackList.innerHTML = '';
      if (canvas) canvas.style.display = 'none';
      return;
    }

    if (canvas) canvas.style.display = 'block';
    
    // Average score display
    document.getElementById('interviewsAvgScore').textContent = interview.average_score;
    
    // Render radar
    const topics = interview.radar_data.map(r => r.topic);
    const scores = interview.radar_data.map(r => r.score);

    if (chartInstances.interviewRadar) chartInstances.interviewRadar.destroy();
    
    chartInstances.interviewRadar = new Chart(canvas.getContext('2d'), {
      type: 'radar',
      data: {
        labels: topics,
        datasets: [{
          label: 'Avg Topic Score',
          data: scores,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.15)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            pointLabels: { color: '#64748b', font: { size: 10 } },
            ticks: { display: false }
          }
        }
      }
    });

    // Render Recent feed
    feedbackList.innerHTML = interview.recent_feedback.map(f => `
      <div style="background:var(--void);border:1px solid var(--border);border-radius:var(--r-sm);padding:.75rem;font-size:12.5px;">
        <div style="display:flex;justify-content:space-between;font-weight:600;color:var(--frost);margin-bottom:2px;">
          <span>${f.topic}</span>
          <span style="color:var(--emerald);">${f.score}/100</span>
        </div>
        <p style="color:var(--mist);font-size:11.5px;line-height:1.45;">"${f.feedback ? f.feedback.slice(0, 150) + '...' : 'Excellent performance.'}"</p>
      </div>
    `).join('');
  }

  // Populate settings modal inputs
  function populateSettingsModal() {
    const s = portfolioData.settings || {};
    const socials = portfolioData.socials || {};
    
    document.getElementById('setPublic').checked = s.is_public !== 0;
    document.getElementById('setShowXp').checked = s.show_xp !== 0;
    document.getElementById('setShowStreak').checked = s.show_streak !== 0;
    document.getElementById('setShowCerts').checked = s.show_certificates !== 0;
    document.getElementById('setShowProjects').checked = s.show_projects !== 0;
    document.getElementById('setShowAch').checked = s.show_achievements !== 0;
    document.getElementById('setShowInterviews').checked = s.show_interview_scores !== 0;

    document.getElementById('setHeadline').value = s.headline || '';
    document.getElementById('setRole').value = s.current_role || '';
    document.getElementById('setYears').value = s.years_learning || '';
    document.getElementById('setLocation').value = s.location || '';
    document.getElementById('setAvailability').value = s.availability || '';
    document.getElementById('setOpenWork').checked = s.open_to_work === 1;
    document.getElementById('setAbout').value = s.about_me || '';

    document.getElementById('setGithub').value = socials.github_url || '';
    document.getElementById('setLinkedin').value = socials.linkedin_url || '';
    document.getElementById('setTwitter').value = socials.twitter_url || '';
    document.getElementById('setInstagram').value = socials.instagram_url || '';
    document.getElementById('setWebsite').value = socials.website_url || '';
    document.getElementById('setEmail').value = socials.email || '';
    document.getElementById('setPhone').value = socials.phone || '';

    document.getElementById('setPic').value = s.profile_picture || '';
    document.getElementById('setBanner').value = s.profile_banner || '';
  }

  // Save Settings Modal
  document.getElementById('portfolioSettingsForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const errorEl = document.getElementById('settingsFormError');
    errorEl.textContent = '';
    
    const body = {
      is_public: document.getElementById('setPublic').checked ? 1 : 0,
      show_xp: document.getElementById('setShowXp').checked ? 1 : 0,
      show_streak: document.getElementById('setShowStreak').checked ? 1 : 0,
      show_certificates: document.getElementById('setShowCerts').checked ? 1 : 0,
      show_projects: document.getElementById('setShowProjects').checked ? 1 : 0,
      show_achievements: document.getElementById('setShowAch').checked ? 1 : 0,
      show_interview_scores: document.getElementById('setShowInterviews').checked ? 1 : 0,

      headline: document.getElementById('setHeadline').value.trim(),
      current_role: document.getElementById('setRole').value.trim(),
      years_learning: document.getElementById('setYears').value.trim(),
      location: document.getElementById('setLocation').value.trim(),
      availability: document.getElementById('setAvailability').value.trim(),
      open_to_work: document.getElementById('setOpenWork').checked ? 1 : 0,
      about_me: document.getElementById('setAbout').value.trim(),

      github_url: document.getElementById('setGithub').value.trim(),
      linkedin_url: document.getElementById('setLinkedin').value.trim(),
      twitter_url: document.getElementById('setTwitter').value.trim(),
      instagram_url: document.getElementById('setInstagram').value.trim(),
      website_url: document.getElementById('setWebsite').value.trim(),
      email: document.getElementById('setEmail').value.trim(),
      phone: document.getElementById('setPhone').value.trim(),

      profile_picture: document.getElementById('setPic').value.trim(),
      profile_banner: document.getElementById('setBanner').value.trim()
    };

    try {
      const res = await apiFetch('/api/portfolio/settings', {
        method: 'PUT',
        body: JSON.stringify(body)
      });

      if (res.success) {
        showToast('Settings saved successfully.', 'success');
        document.getElementById('settingsModal').classList.remove('open');
        loadPortfolio();
      }
    } catch (err) {
      errorEl.textContent = err.message;
    }
  });

  // Base64 File Uploader Process
  async function triggerBase64Upload(fileInputId, apiPath, successMsg) {
    const input = document.getElementById(fileInputId);
    const file = input.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Maximum file size allowed is 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await apiFetch(apiPath, {
          method: 'POST',
          body: JSON.stringify({
            base64File: reader.result,
            filename: file.name
          })
        });

        if (res.success) {
          showToast(successMsg, 'success');
          loadPortfolio();
        }
      } catch (err) {
        showToast(err.message, 'error');
      }
    };
    reader.onerror = () => showToast('Failed to read file.', 'error');
    reader.readAsDataURL(file);
  }

  // Bind file inputs changes
  document.getElementById('resumeFile')?.addEventListener('change', () => {
    triggerBase64Upload('resumeFile', '/api/portfolio/resume', 'Resume PDF uploaded successfully!');
  });
  
  document.getElementById('avatarFile')?.addEventListener('change', () => {
    // Actually our settings accepts profile_picture. If we want immediate base64 save, we can send to settings or store it
    const file = document.getElementById('avatarFile').files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await apiFetch('/api/portfolio/settings', {
          method: 'PUT',
          body: JSON.stringify({ profile_picture: reader.result })
        });
        if (res.success) {
          showToast('Profile image updated successfully.', 'success');
          loadPortfolio();
        }
      } catch (e) { showToast(e.message, 'error'); }
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('bannerFile')?.addEventListener('change', () => {
    const file = document.getElementById('bannerFile').files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await apiFetch('/api/portfolio/settings', {
          method: 'PUT',
          body: JSON.stringify({ profile_banner: reader.result })
        });
        if (res.success) {
          showToast('Profile banner updated successfully.', 'success');
          loadPortfolio();
        }
      } catch (e) { showToast(e.message, 'error'); }
    };
    reader.readAsDataURL(file);
  });

  // Delete Resume
  document.getElementById('btnResumeDelete')?.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to delete your uploaded resume?')) return;
    try {
      const res = await apiFetch('/api/portfolio/resume', { method: 'DELETE' });
      if (res.success) {
        showToast('Resume deleted successfully.', 'success');
        loadPortfolio();
      }
    } catch (e) { showToast(e.message, 'error'); }
  });

  // Open/Close modals handlers
  document.getElementById('btnOpenSettings')?.addEventListener('click', () => {
    document.getElementById('settingsModal').classList.add('open');
  });

  document.getElementById('settingsCloseBtn')?.addEventListener('click', () => {
    document.getElementById('settingsModal').classList.remove('open');
  });

  // Project Modal Actions (Add / Edit)
  function openProjectModal(projectId = null) {
    const modal = document.getElementById('projectModal');
    const form = document.getElementById('projectForm');
    const titleEl = document.getElementById('projectModalTitle');
    
    document.getElementById('projectFormError').textContent = '';
    form.reset();

    if (projectId) {
      const proj = projectsList.find(p => p.id === projectId);
      if (!proj) return;
      titleEl.textContent = 'Edit Project';
      document.getElementById('projId').value = proj.id;
      document.getElementById('projTitle').value = proj.title || '';
      document.getElementById('projDesc').value = proj.description || '';
      document.getElementById('projTech').value = proj.tech_stack || '';
      document.getElementById('projGithub').value = proj.github_link || '';
      document.getElementById('projLive').value = proj.live_link || '';
      document.getElementById('projDiff').value = proj.difficulty || 'Medium';
      document.getElementById('projStatus').value = proj.status || 'Completed';
      document.getElementById('projFeatured').checked = proj.is_featured === 1;
      if (proj.completion_date) {
        document.getElementById('projDate').value = new Date(proj.completion_date).toISOString().slice(0, 10);
      }
    } else {
      titleEl.textContent = 'Add Project';
      document.getElementById('projId').value = '';
    }

    modal.classList.add('open');
  }

  document.getElementById('btnAddProjectBtn')?.addEventListener('click', () => openProjectModal());
  document.getElementById('projectCloseBtn')?.addEventListener('click', () => {
    document.getElementById('projectModal').classList.remove('open');
  });

  // Project Save submission
  document.getElementById('projectForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const errorEl = document.getElementById('projectFormError');
    errorEl.textContent = '';

    const id = document.getElementById('projId').value;
    const body = {
      title: document.getElementById('projTitle').value.trim(),
      description: document.getElementById('projDesc').value.trim(),
      tech_stack: document.getElementById('projTech').value.trim(),
      github_link: document.getElementById('projGithub').value.trim(),
      live_link: document.getElementById('projLive').value.trim(),
      difficulty: document.getElementById('projDiff').value,
      status: document.getElementById('projStatus').value,
      completion_date: document.getElementById('projDate').value || null,
      is_featured: document.getElementById('projFeatured').checked ? 1 : 0
    };

    if (!body.title || !body.description) {
      errorEl.textContent = 'Title and description are required.';
      return;
    }

    try {
      let res;
      if (id) {
        res = await apiFetch(`/api/portfolio/project/${id}`, {
          method: 'PUT',
          body: JSON.stringify(body)
        });
      } else {
        res = await apiFetch('/api/portfolio/project', {
          method: 'POST',
          body: JSON.stringify(body)
        });
      }

      if (res.success) {
        showToast(id ? 'Project updated successfully.' : 'Project added successfully.', 'success');
        document.getElementById('projectModal').classList.remove('open');
        loadPortfolio();
      }
    } catch (err) {
      errorEl.textContent = err.message;
    }
  });

  // Delete project
  async function triggerDeleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await apiFetch(`/api/portfolio/project/${id}`, { method: 'DELETE' });
      if (res.success) {
        showToast('Project deleted successfully.', 'success');
        loadPortfolio();
      }
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  // Share Options Modal
  document.getElementById('btnSharePortfolio')?.addEventListener('click', () => {
    const modal = document.getElementById('qrModal');
    const qrContainer = document.getElementById('qrContainer');
    
    // Construct public link
    const shareLink = `${window.location.origin}/portfolio/${usernameContext}`;
    
    // Generate QR using free qserver API
    qrContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareLink)}" alt="QR Code" style="width:150px;height:150px;">`;
    
    modal.classList.add('open');
  });

  document.getElementById('qrCloseBtn')?.addEventListener('click', () => {
    document.getElementById('qrModal').classList.remove('open');
  });

  document.getElementById('copyShareLinkBtn')?.addEventListener('click', () => {
    const shareLink = `${window.location.origin}/portfolio/${usernameContext}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      showToast('Portfolio URL copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy link.', 'error');
    });
  });

  // Contact Developer actions
  document.getElementById('btnContact')?.addEventListener('click', () => {
    const s = portfolioData.socials || {};
    const email = s.email || portfolioData.user.email;
    if (email) {
      window.location.href = `mailto:${email}?subject=EduNet%20Inquiry`;
    } else {
      showToast('No contact email provided by developer.', 'warning');
    }
  });

  // Bind projects local inputs controls
  document.getElementById('projSearchInput')?.addEventListener('input', () => {
    currentProjectPage = 1;
    renderProjects();
  });

  document.querySelectorAll('#projFilterRow .filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('#projFilterRow .filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentProjectPage = 1;
      renderProjects();
    });
  });

  // Run initialization routines
  detectMode();
  loadPortfolio();

  // ============================================================
  // PHASE 5 — GitHub, Analytics, Strength, Theme, Recruiter
  // ============================================================

  // ── Phase 5 Tab Navigation ────────────────────────────────────
  function initP5Tabs() {
    const tabBtns = document.querySelectorAll('.p5-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.p5-tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add('active');

        // Lazy-load tab data
        const tab = btn.dataset.tab;
        if (tab === 'p5-analytics') loadAnalyticsTab();
        else if (tab === 'p5-strength') loadStrengthScore();
        else if (tab === 'p5-resume-analytics') loadResumeAnalytics();
        else if (tab === 'p5-theme') loadThemeBuilder();
      });
    });
  }

  // ── SEO Meta Tag Injection ─────────────────────────────────────
  function injectSEOMeta(data) {
    const { user, settings } = data;
    const name = user?.username || 'Developer';
    const headline = settings?.headline || `${name}'s Professional Developer Portfolio`;
    const about = (settings?.about_me || '').slice(0, 160);
    const avatarUrl = settings?.profile_picture || '';
    const url = window.location.href;

    const setMeta = (id, content) => { const el = document.getElementById(id); if (el) el.content = content; };
    const setEl = (id, content) => { const el = document.getElementById(id); if (el) el.textContent = content; };

    setEl('pageTitle', `${name} — Developer Portfolio | EduNet`);
    setMeta('metaDesc', about || headline);
    setMeta('ogTitle', `${name} — Developer Portfolio`);
    setMeta('ogDesc', about || headline);
    setMeta('ogUrl', url);
    setMeta('ogImage', avatarUrl);
    setMeta('twTitle', `${name} — Developer Portfolio`);
    setMeta('twDesc', about || headline);
  }

  // ── Track portfolio view for the currently viewed user ─────────
  async function trackCurrentView() {
    try {
      if (!usernameContext) return;
      await apiFetch('/api/portfolio/track-view', {
        method: 'POST',
        body: JSON.stringify({ username: usernameContext })
      }).catch(() => {});
    } catch (_) {}
  }

  // ── Recruiter Quick Actions Bar ────────────────────────────────
  function initRecruiterActions(data) {
    // Track clicks on key public buttons
    const trackClick = (type, targetName) => {
      if (!usernameContext) return;
      apiFetch('/api/portfolio/track-click', {
        method: 'POST',
        body: JSON.stringify({ username: usernameContext, click_type: type, target_name: targetName || type })
      }).catch(() => {});
    };

    // Resume Download click tracking
    document.getElementById('btnResumeDownload')?.addEventListener('click', () => {
      trackClick('resume_download', 'resume');
    });

    // Contact button
    document.getElementById('btnContact')?.addEventListener('click', () => {
      trackClick('contact', 'contact');
    });

    // Share button → also triggers QR modal (existing)
    document.getElementById('btnSharePortfolio')?.addEventListener('click', () => {
      trackClick('share', 'share');
    });

    // Track GitHub link click if visible in contact panel
    document.addEventListener('click', e => {
      const link = e.target.closest('a[href*="github.com"]');
      if (link && link.href.includes('github.com') && usernameContext) {
        trackClick('github', 'github_link');
      }
      const liLink = e.target.closest('a[href*="linkedin.com"]');
      if (liLink && usernameContext) {
        trackClick('linkedin', 'linkedin_link');
      }
    });
  }

  // ── QR Code Generation (use QRCode.js) ────────────────────────
  async function initQRModal() {
    const qrBtn = document.getElementById('btnSharePortfolio');
    const qrModal = document.getElementById('qrModal');
    const qrContainer = document.getElementById('qrContainer');
    const qrClose = document.getElementById('qrCloseBtn');
    const copyBtn = document.getElementById('copyShareLinkBtn');

    if (!qrBtn) return;

    qrBtn.addEventListener('click', async () => {
      if (!isOwner) return;

      try {
        const res = await apiFetch('/api/portfolio/qr');
        if (!res.success) return;

        const shareUrl = res.url;

        // Clear old QR
        if (qrContainer) qrContainer.innerHTML = '';

        // Generate QR if library loaded
        if (window.QRCode && qrContainer) {
          new window.QRCode(qrContainer, {
            text: shareUrl,
            width: 160,
            height: 160,
            colorDark: '#7c3aed',
            colorLight: '#ffffff',
            correctLevel: window.QRCode.CorrectLevel.M
          });
        } else if (qrContainer) {
          qrContainer.innerHTML = `<div style="font-size:10px;color:#888;word-break:break-all;padding:1rem;">${shareUrl}</div>`;
        }

        if (copyBtn) {
          copyBtn.onclick = () => {
            navigator.clipboard.writeText(shareUrl).then(() => {
              showToast('Portfolio URL copied!', 'success');
            });
          };
        }

        qrModal?.classList.add('open');
      } catch (err) {
        showToast('Failed to generate QR code', 'error');
      }
    });

    qrClose?.addEventListener('click', () => qrModal?.classList.remove('open'));
    qrModal?.addEventListener('click', e => {
      if (e.target === qrModal) qrModal.classList.remove('open');
    });
  }

  // ── GitHub Integration ─────────────────────────────────────────
  const LANG_COLORS = {
    JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572A5',
    Java: '#b07219', 'C++': '#f34b7d', C: '#555555', Go: '#00ADD8',
    Rust: '#dea584', PHP: '#4F5D95', Ruby: '#701516', Swift: '#F05138',
    Kotlin: '#A97BFF', HTML: '#e34c26', CSS: '#563d7c', SQL: '#e38c00',
    Shell: '#89e051', Vue: '#41b883', Dart: '#00B4AB', default: '#8b5cf6'
  };

  function langColor(lang) { return LANG_COLORS[lang] || LANG_COLORS.default; }

  function renderRepoCard(repo) {
    const topics = repo.topics ? repo.topics.split(',').filter(Boolean) : [];
    const topicsHtml = topics.slice(0, 4).map(t =>
      `<span class="gh-repo-topic">${t}</span>`
    ).join('');

    const pinClass = repo.is_pinned ? 'is-pinned' : '';
    const pinLabel = repo.is_pinned ? '📌 Unpin' : '📌 Pin';
    const hideLabel = repo.is_hidden ? '👁 Show' : '🙈 Hide';

    const lastUpdated = repo.github_updated_at
      ? new Date(repo.github_updated_at).toLocaleDateString()
      : 'Unknown';

    return `
      <div class="gh-repo-card ${pinClass}" data-repo-id="${repo.id}" data-gh-id="${repo.github_repo_id}">
        <div class="gh-repo-name">
          ${repo.is_pinned ? '<span title="Pinned">📌</span>' : '<span>📁</span>'}
          <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
          ${repo.is_fork ? '<span style="font-size:10px;color:var(--mist);">(fork)</span>' : ''}
          ${repo.is_archived ? '<span style="font-size:10px;color:var(--rose);">[archived]</span>' : ''}
        </div>
        ${repo.description ? `<div class="gh-repo-desc">${repo.description}</div>` : ''}
        ${topicsHtml ? `<div class="gh-repo-topics">${topicsHtml}</div>` : ''}
        <div class="gh-repo-stats">
          ${repo.language ? `<div class="gh-repo-stat">
            <div class="gh-lang-dot" style="background:${langColor(repo.language)};"></div>
            ${repo.language}
          </div>` : ''}
          <div class="gh-repo-stat">⭐ ${repo.stars || 0}</div>
          <div class="gh-repo-stat">🍴 ${repo.forks || 0}</div>
          <div class="gh-repo-stat">👁 ${repo.watchers || 0}</div>
          ${repo.open_issues > 0 ? `<div class="gh-repo-stat">🔴 ${repo.open_issues}</div>` : ''}
        </div>
        <div style="font-size:10px; color:var(--mist-dim);">
          ${repo.last_commit_message ? `💬 ${repo.last_commit_message.slice(0,60)}` : ''}
          · Updated ${lastUpdated}
          ${repo.license ? `· ${repo.license}` : ''}
          ${repo.size_kb ? `· ${(repo.size_kb/1024).toFixed(1)} MB` : ''}
        </div>
        <div class="gh-repo-actions">
          <a href="${repo.html_url}" target="_blank" class="btn btn-secondary btn-sm" style="font-size:10px; padding:3px 8px;" onclick="window.__trackGhClick(event)">GitHub ↗</a>
          ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="btn btn-secondary btn-sm" style="font-size:10px; padding:3px 8px;">Demo ↗</a>` : ''}
          <button class="gh-pin-btn" onclick="togglePin(${repo.id}, ${repo.is_pinned ? 0 : 1})">${pinLabel}</button>
          <button class="gh-hide-btn" onclick="toggleHide(${repo.id}, ${repo.is_hidden ? 0 : 1})">${hideLabel}</button>
        </div>
      </div>
    `;
  }

  window.__trackGhClick = function(e) {
    apiFetch('/api/portfolio/track-click', {
      method: 'POST',
      body: JSON.stringify({ username: usernameContext, click_type: 'github', target_name: 'repository' })
    }).catch(() => {});
  };

  window.togglePin = async function(repoId, pinned) {
    try {
      const res = await apiFetch('/api/github/pin', {
        method: 'POST',
        body: JSON.stringify({ repo_id: repoId, pinned: !!pinned })
      });
      if (res.success) { showToast(res.message, 'success'); loadGitHubData(); }
    } catch (e) { showToast('Failed to pin repo', 'error'); }
  };

  window.toggleHide = async function(repoId, hidden) {
    try {
      const res = await apiFetch('/api/github/hide', {
        method: 'POST',
        body: JSON.stringify({ repo_id: repoId, hidden: !!hidden })
      });
      if (res.success) { showToast(res.message, 'success'); loadGitHubData(); }
    } catch (e) { showToast('Failed to hide repo', 'error'); }
  };

  async function loadGitHubData() {
    if (!isOwner) return;

    try {
      const res = await apiFetch('/api/github/profile');

      // Show OAuth button if configured
      const oauthSection = document.getElementById('ghOAuthSection');
      if (res.oauth_available && oauthSection) oauthSection.style.display = 'block';

      if (!res.connected) {
        document.getElementById('ghConnectPanel').style.display = 'block';
        document.getElementById('ghConnectedPanel').style.display = 'none';
        document.getElementById('ghSyncBtn').style.display = 'none';
        document.getElementById('ghDisconnectBtn').style.display = 'none';
        return;
      }

      // Connected state
      document.getElementById('ghConnectPanel').style.display = 'none';
      document.getElementById('ghConnectedPanel').style.display = 'block';
      document.getElementById('ghSyncBtn').style.display = 'inline-flex';
      document.getElementById('ghDisconnectBtn').style.display = 'inline-flex';

      const p = res.profile;
      document.getElementById('ghAvatarImg').src = p.avatar_url || '';
      document.getElementById('ghDisplayName').textContent = p.name || p.github_username;
      document.getElementById('ghBio').textContent = p.bio || '';
      document.getElementById('ghRepoCount').textContent = p.public_repos || 0;
      document.getElementById('ghStars').textContent = p.total_stars || 0;
      document.getElementById('ghForks').textContent = p.total_forks || 0;
      document.getElementById('ghFollowers').textContent = p.followers || 0;

      // Last synced
      const syncEl = document.getElementById('ghLastSynced');
      if (syncEl && p.last_synced) {
        syncEl.innerHTML = `<span class="sync-dot"></span> Synced ${new Date(p.last_synced).toLocaleDateString()}`;
      }

      // Render repos
      const repoGrid = document.getElementById('ghRepoGrid');
      const repos = res.repos || [];
      document.getElementById('ghRepoTotal').textContent = `(${repos.length})`;

      if (repoGrid) {
        repoGrid.innerHTML = repos.length
          ? repos.map(r => renderRepoCard(r)).join('')
          : '<p style="color:var(--mist); font-size:13px;">No repositories imported yet. Click "Import More" to add repos.</p>';
      }

    } catch (err) {
      console.warn('loadGitHubData error:', err.message);
    }
  }

  function initGitHubConnectBtn() {
    document.getElementById('ghManualConnectBtn')?.addEventListener('click', async () => {
      const input = document.getElementById('ghUsernameInput');
      const username = input?.value.trim();
      if (!username) return showToast('Enter a GitHub username', 'error');

      const btn = document.getElementById('ghManualConnectBtn');
      btn.disabled = true; btn.textContent = 'Connecting...';

      try {
        const res = await apiFetch('/api/github/manual', {
          method: 'POST',
          body: JSON.stringify({ username })
        });
        if (res.success) {
          showToast(res.message, 'success');
          loadGitHubData();
          loadContributionHeatmap();
        } else {
          showToast(res.message || 'Connection failed', 'error');
        }
      } catch (err) {
        showToast(err.message || 'Connection failed', 'error');
      } finally {
        btn.disabled = false; btn.textContent = 'Connect';
      }
    });

    document.getElementById('ghOAuthBtn')?.addEventListener('click', async () => {
      try {
        const res = await apiFetch('/api/github/connect');
        if (res.oauth_available && res.url) {
          window.location.href = res.url;
        } else {
          showToast('OAuth not configured. Use manual username.', 'error');
        }
      } catch (_) {}
    });

    document.getElementById('ghSyncBtn')?.addEventListener('click', async () => {
      const btn = document.getElementById('ghSyncBtn');
      btn.disabled = true; btn.textContent = '⏳ Syncing...';
      try {
        const res = await apiFetch('/api/github/sync', { method: 'POST', body: '{}' });
        if (res.success) {
          showToast(`${res.message}`, 'success');
          loadGitHubData();
          loadContributionHeatmap();
        }
      } catch (err) { showToast('Sync failed', 'error'); }
      finally { btn.disabled = false; btn.textContent = '🔄 Sync Now'; }
    });

    document.getElementById('ghDisconnectBtn')?.addEventListener('click', async () => {
      if (!confirm('Disconnect GitHub? All imported repositories will be removed.')) return;
      try {
        const res = await apiFetch('/api/github/disconnect', { method: 'POST', body: '{}' });
        if (res.success) { showToast(res.message, 'success'); loadGitHubData(); }
      } catch (err) { showToast('Disconnect failed', 'error'); }
    });

    document.getElementById('ghImportBtn')?.addEventListener('click', async () => {
      showToast('Fetching all available repos...', 'info');
      try {
        const res = await apiFetch('/api/github/repos');
        if (!res.success || !res.repos) return showToast('Failed to fetch repos', 'error');
        const notImported = res.repos.filter(r => !r.already_imported);
        if (!notImported.length) return showToast('All repositories are already imported!', 'success');
        const ids = notImported.map(r => r.id);
        const importRes = await apiFetch('/api/github/import', {
          method: 'POST',
          body: JSON.stringify({ repo_ids: ids })
        });
        if (importRes.success) {
          showToast(importRes.message, 'success');
          loadGitHubData();
        }
      } catch (err) { showToast('Import failed', 'error'); }
    });

    // Handle OAuth callback URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get('github_connected')) showToast('GitHub connected successfully!', 'success');
    if (params.get('github_error')) showToast('GitHub error: ' + params.get('github_error'), 'error');
  }

  // ── Enhanced Contribution Heatmap (Phase 5) ─────────────────────
  async function loadContributionHeatmap() {
    if (!isOwner) return;

    try {
      const res = await apiFetch('/api/github/contributions');
      if (!res.success) return;

      const { heatmap, stats, source } = res;

      // Update source label
      const srcEl = document.getElementById('heatmapSource');
      const srcLabels = { github: 'GitHub Activity', edunet: 'EduNet Activity', combined: 'Combined: GitHub + EduNet', mock: 'EduNet Activity' };
      if (srcEl) srcEl.textContent = srcLabels[source] || 'Activity';

      // Update stats
      const s = stats || {};
      const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      setVal('csTotalContribs', s.total_contributions || 0);
      setVal('csActiveDays', s.active_days || 0);
      setVal('csCurrent', s.current_streak || 0);
      setVal('csLongest', s.longest_streak || 0);

      // Render heatmap grid
      renderP5Heatmap(heatmap || {}, stats || {});
    } catch (err) {
      console.warn('loadContributionHeatmap error:', err.message);
    }
  }

  function renderP5Heatmap(heatmap, stats) {
    const grid = document.getElementById('p5HeatmapGrid');
    const monthsRow = document.getElementById('p5HeatmapMonths');
    const totalEl = document.getElementById('p5HeatmapTotal');
    if (!grid) return;

    // Build 52-week grid
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 364);

    // Align to Sunday
    const dayOfWeek = start.getDay();
    start.setDate(start.getDate() - dayOfWeek);

    grid.innerHTML = '';

    let maxVal = 0;
    const days = [];
    for (let i = 0; i < 364; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const val = heatmap[key];
      const count = val ? (typeof val === 'number' ? val : (val.commits || 0)) : 0;
      if (count > maxVal) maxVal = count;
      days.push({ date: key, count, xp: val?.xp || 0, coding: val?.coding_minutes || 0, source: val?.source || '' });
    }

    days.forEach(d => {
      const cell = document.createElement('div');
      cell.style.cssText = 'width:11px;height:11px;border-radius:2px;cursor:pointer;transition:transform 0.1s;';
      const level = !d.count ? 0 : d.count <= 2 ? 1 : d.count <= 5 ? 2 : d.count <= 10 ? 3 : 4;
      const colors = ['var(--border)', 'rgba(139,92,246,0.3)', 'rgba(139,92,246,0.55)', 'rgba(139,92,246,0.8)', 'var(--accent)'];
      cell.style.background = colors[level];

      // Day popup on hover
      cell.addEventListener('mouseenter', e => {
        const popup = document.getElementById('hmTooltip');
        if (!popup) return;
        const dateStr = new Date(d.date + 'T12:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
        popup.innerHTML = `
          <div class="heatmap-popup-title">${dateStr}</div>
          <div class="heatmap-popup-row"><span>Contributions</span><span>${d.count}</span></div>
          ${d.xp ? `<div class="heatmap-popup-row"><span>XP Earned</span><span>+${d.xp}</span></div>` : ''}
          ${d.coding ? `<div class="heatmap-popup-row"><span>Coding Time</span><span>${d.coding}m</span></div>` : ''}
          ${d.source ? `<div class="heatmap-popup-row"><span>Source</span><span style="text-transform:capitalize;">${d.source}</span></div>` : ''}
        `;
        popup.style.display = 'block';
        popup.style.left = (e.clientX + 12) + 'px';
        popup.style.top = (e.clientY - 10) + 'px';
      });

      cell.addEventListener('mousemove', e => {
        const popup = document.getElementById('hmTooltip');
        if (popup) { popup.style.left = (e.clientX + 12) + 'px'; popup.style.top = (e.clientY - 10) + 'px'; }
      });

      cell.addEventListener('mouseleave', () => {
        const popup = document.getElementById('hmTooltip');
        if (popup) popup.style.display = 'none';
      });

      grid.appendChild(cell);
    });

    if (totalEl) {
      totalEl.textContent = `${stats.total_contributions || 0} contributions in the last year`;
    }
  }

  // ── Analytics Tab ──────────────────────────────────────────────
  let analyticsCharts = {};

  async function loadAnalyticsTab() {
    try {
      const res = await apiFetch('/api/portfolio/views');
      if (!res.success) return;

      const { summary, daily, top_projects, traffic_sources } = res;

      const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v ?? '-'; };
      setText('anTotalViews', summary.total_views);
      setText('anUniqueVisitors', summary.unique_visitors);
      setText('anReturning', summary.returning_visitors);
      setText('anResumeDownloads', summary.resume_downloads);
      setText('anGithubClicks', summary.github_clicks);
      setText('anProjectClicks', summary.project_clicks);
      setText('anContactClicks', summary.contact_clicks);
      setText('anLinkedinClicks', summary.linkedin_clicks);

      // Daily views line chart
      const labels = daily.map(d => d.day);
      const vals = daily.map(d => d.total);
      const uniqueVals = daily.map(d => d.unique_views);

      renderAnalyticsChart('chartPortfolioViews', 'line', {
        labels,
        datasets: [
          { label: 'Total Views', data: vals, borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.1)', fill: true, tension: 0.4 },
          { label: 'Unique Visitors', data: uniqueVals, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4 }
        ]
      });

      // Traffic sources doughnut
      const srcLabels = (traffic_sources || []).map(t => t.source);
      const srcVals = (traffic_sources || []).map(t => t.count);
      renderAnalyticsChart('chartTrafficSources', 'doughnut', {
        labels: srcLabels.length ? srcLabels : ['No data'],
        datasets: [{
          data: srcVals.length ? srcVals : [1],
          backgroundColor: ['#8b5cf6','#3b82f6','#10b981','#f59e0b','#ef4444','#ec4899'],
          borderWidth: 0
        }]
      });

      // Top projects bar chart
      const projLabels = (top_projects || []).map(p => p.project);
      const projVals = (top_projects || []).map(p => p.clicks);
      renderAnalyticsChart('chartTopProjects', 'bar', {
        labels: projLabels.length ? projLabels : ['No data yet'],
        datasets: [{
          label: 'Project Clicks',
          data: projVals.length ? projVals : [0],
          backgroundColor: 'rgba(139,92,246,0.6)',
          borderColor: '#8b5cf6',
          borderWidth: 1,
          borderRadius: 4
        }]
      });

    } catch (err) {
      console.warn('loadAnalyticsTab error:', err.message);
    }
  }

  function renderAnalyticsChart(canvasId, type, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    if (analyticsCharts[canvasId]) { analyticsCharts[canvasId].destroy(); }
    analyticsCharts[canvasId] = new Chart(canvas, {
      type,
      data,
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8', font: { size: 11 } } } },
        scales: type === 'doughnut' ? {} : {
          x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
          y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } }
        }
      }
    });
  }

  // ── Portfolio Strength Score ────────────────────────────────────
  async function loadStrengthScore() {
    try {
      const res = await apiFetch('/api/portfolio/strength');
      if (!res.success) return;

      const { score, recommendations } = res;

      // Animate SVG circle
      const circle = document.getElementById('strengthCircle');
      if (circle) {
        const circumference = 2 * Math.PI * 50; // r=50
        const offset = circumference - (score / 100) * circumference;
        setTimeout(() => {
          circle.style.strokeDashoffset = offset;
          // Color grade
          if (score >= 80) circle.style.stroke = '#10b981';
          else if (score >= 60) circle.style.stroke = '#f59e0b';
          else circle.style.stroke = '#ef4444';
        }, 100);
      }

      const el = document.getElementById('strengthScoreVal');
      if (el) {
        let current = 0;
        const interval = setInterval(() => {
          current = Math.min(current + 2, score);
          el.textContent = current;
          if (current >= score) clearInterval(interval);
        }, 20);
      }

      // Stars
      const starEl = document.getElementById('strengthStars');
      if (starEl) {
        const stars = Math.round(score / 20);
        starEl.textContent = '★'.repeat(stars) + '☆'.repeat(5 - stars);
      }

      // Label
      const label = document.getElementById('strengthLabel');
      if (label) {
        if (score >= 90) label.textContent = 'Excellent! Recruiter-ready portfolio.';
        else if (score >= 75) label.textContent = 'Great portfolio! Keep improving.';
        else if (score >= 50) label.textContent = 'Good start! Complete the recommendations.';
        else label.textContent = 'Beginner portfolio — lots of room to grow!';
      }

      // Recommendations
      const recsEl = document.getElementById('strengthRecs');
      if (recsEl && recommendations) {
        recsEl.innerHTML = recommendations.length
          ? recommendations.map(r => `<div class="strength-rec-item">💡 ${r}</div>`).join('')
          : '<div class="strength-rec-item">✅ Your portfolio is complete!</div>';
      }
    } catch (err) {
      console.warn('loadStrengthScore error:', err.message);
    }
  }

  // ── Resume Analytics ────────────────────────────────────────────
  async function loadResumeAnalytics() {
    try {
      const res = await apiFetch('/api/portfolio/resume-analytics');
      if (!res.success) return;

      const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v ?? '-'; };
      setText('raDownloads', res.total_downloads);
      setText('raScans', res.scan_history.length);

      const avgScore = res.scan_history.length
        ? Math.round(res.scan_history.reduce((a, s) => a + s.score, 0) / res.scan_history.length)
        : '-';
      setText('raAvgScore', avgScore !== '-' ? avgScore + '%' : '-');

      // Daily downloads chart
      renderAnalyticsChart('chartResumeDownloads', 'bar', {
        labels: (res.daily_downloads || []).map(d => d.day),
        datasets: [{
          label: 'Downloads',
          data: (res.daily_downloads || []).map(d => d.cnt),
          backgroundColor: 'rgba(139,92,246,0.5)',
          borderColor: '#8b5cf6', borderWidth: 1, borderRadius: 4
        }]
      });

      // ATS scan history
      const histEl = document.getElementById('atsScanHistory');
      if (histEl) {
        histEl.innerHTML = (res.scan_history || []).length
          ? res.scan_history.map(s => {
            const color = s.score >= 80 ? '#10b981' : s.score >= 60 ? '#f59e0b' : '#ef4444';
            return `<div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0.75rem; background:rgba(255,255,255,0.02); border-radius:6px; font-size:12.5px;">
              <span style="color:var(--mist);">${new Date(s.created_at).toLocaleDateString()}</span>
              <span style="color:${color}; font-weight:700;">${s.score}% ATS Score</span>
            </div>`;
          }).join('')
          : '<p style="color:var(--mist); font-size:13px;">No ATS scans yet. Go to Resume Builder to scan your resume.</p>';
      }
    } catch (err) {
      console.warn('loadResumeAnalytics error:', err.message);
    }
  }

  // ── Theme Builder ───────────────────────────────────────────────
  let selectedAccentColor = '#8b5cf6';

  async function loadThemeBuilder() {
    try {
      const res = await apiFetch('/api/portfolio/theme');
      if (res.success && res.theme) {
        const t = res.theme;
        if (t.accent_color) { selectedAccentColor = t.accent_color; highlightSwatch(t.accent_color); }
        const setVal = (id, v) => { const el = document.getElementById(id); if (el && v) el.value = v; };
        setVal('themeFontFamily', t.font_family);
        setVal('themeCardRadius', t.card_radius);
        setVal('themeAnimSpeed', t.animation_speed);
        setVal('themeBackground', t.background_style);
        setVal('themeCardStyle', t.card_style);
        setVal('themeGlassBlur', t.glass_blur);
        setVal('themeBorderStyle', t.border_style);
      }
    } catch (_) {}
  }

  function highlightSwatch(color) {
    document.querySelectorAll('.theme-swatch-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.color === color);
    });
  }

  function initThemeBuilder() {
    document.querySelectorAll('.theme-swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedAccentColor = btn.dataset.color;
        highlightSwatch(selectedAccentColor);
      });
    });

    document.getElementById('themeCustomColor')?.addEventListener('input', e => {
      selectedAccentColor = e.target.value;
      document.querySelectorAll('.theme-swatch-btn').forEach(b => b.classList.remove('selected'));
    });

    document.getElementById('saveThemeBtn')?.addEventListener('click', async () => {
      const btn = document.getElementById('saveThemeBtn');
      btn.disabled = true; btn.textContent = '⏳ Saving...';
      try {
        const payload = {
          accent_color: selectedAccentColor,
          background_style: document.getElementById('themeBackground')?.value,
          card_radius: document.getElementById('themeCardRadius')?.value,
          glass_blur: document.getElementById('themeGlassBlur')?.value,
          font_family: document.getElementById('themeFontFamily')?.value,
          animation_speed: document.getElementById('themeAnimSpeed')?.value,
          border_style: document.getElementById('themeBorderStyle')?.value,
          card_style: document.getElementById('themeCardStyle')?.value
        };
        const res = await apiFetch('/api/portfolio/theme', {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        if (res.success) showToast('Theme saved successfully!', 'success');
        else showToast('Failed to save theme', 'error');
      } catch (_) { showToast('Failed to save theme', 'error'); }
      finally { btn.disabled = false; btn.textContent = '💾 Save Theme'; }
    });
  }

  // ── Phase 5 Main Initializer ────────────────────────────────────
  function initPhase5(portfolioData) {
    // Show Phase 5 cards only for owner
    const p5Cards = document.getElementById('phase5Cards');
    if (!isOwner || !p5Cards) return;
    p5Cards.style.display = 'block';

    // SEO meta injection for public profile
    if (portfolioData) injectSEOMeta(portfolioData);

    // Init all Phase 5 features
    initP5Tabs();
    initGitHubConnectBtn();
    initThemeBuilder();
    initQRModal();
    initRecruiterActions(portfolioData);

    // Load initial GitHub data (first tab active by default)
    loadGitHubData();
    loadContributionHeatmap();

    // Track view
    trackCurrentView();
  }

  // ── Hook into existing loadPortfolio() success path ─────────────
  // We intercept the original portfolioContent reveal to trigger Phase 5 init.
  // Wrap the window.portfolioLoaded hook pattern:
  window.__p5Init = function(data) { initPhase5(data); };

})();

