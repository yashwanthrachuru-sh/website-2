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
      }

      // Fetch analytics / charts
      loadAnalyticsData();

      // Display main container
      document.getElementById('portfolioSkeleton').style.display = 'none';
      document.getElementById('portfolioContent').style.display = 'block';
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error loading profile.', 'error');
    }
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

})();
