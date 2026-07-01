// ============================================================
// js/resume.js — AI Resume Builder Controller
// ============================================================
'use strict';

(function () {
  const { apiFetch, getToken, getSession, showToast } = window.EduNetAPI;

  let activeResumeId = null;
  let personalInfo = {};
  let summary = '';
  let skills = {};
  let educationList = [];
  let experienceList = [];
  let projectsList = [];

  // Initialize page shell
  if (window.initPageShell) {
    window.initPageShell();
  }

  // Section switcher
  window.switchSectionTab = function (tabName) {
    document.querySelectorAll('.section-panel').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.section-tab-btn').forEach(btn => btn.classList.remove('active'));
    
    const panel = document.getElementById(`section_${tabName}`);
    if (panel) panel.style.display = 'block';
    
    // Find matching button to activate
    const tabs = document.getElementById('sectionsTabsContainer');
    if (tabs) {
      const btn = Array.from(tabs.children).find(b => b.textContent.toLowerCase().includes(tabName.slice(0, 4)));
      if (btn) btn.classList.add('active');
    }
  };

  // Load user resumes
  async function loadUserResume() {
    try {
      const res = await apiFetch('/api/resume');
      if (res.success && res.resumes.length > 0) {
        const r = res.resumes[0]; // load first active resume
        activeResumeId = r.id;
        personalInfo = r.personal_info || {};
        summary = r.summary || '';
        skills = r.skills || {};
        educationList = r.sections.education || [];
        experienceList = r.sections.experience || [];
        projectsList = r.sections.projects || [];

        // Set selected template
        const selectTmpl = document.getElementById('resumeTemplateSelect');
        if (selectTmpl) selectTmpl.value = r.template;

        // Populate contact form fields
        document.getElementById('pName').value = personalInfo.name || '';
        document.getElementById('pEmail').value = personalInfo.email || '';
        document.getElementById('pPhone').value = personalInfo.phone || '';
        document.getElementById('pLocation').value = personalInfo.location || '';
        document.getElementById('pGithub').value = personalInfo.github || '';
        document.getElementById('pLinkedin').value = personalInfo.linkedin || '';
        document.getElementById('pSummary').value = summary;

        // Populate skills fields
        document.getElementById('skLangs').value = (skills.languages || []).join(', ');
        document.getElementById('skFrontend').value = (skills.frontend || []).join(', ');
        document.getElementById('skBackend').value = (skills.backend || []).join(', ');
        document.getElementById('skDatabase').value = (skills.database || []).join(', ');

        // Sync lists displays
        renderEducationList();
        renderExperienceList();
        renderProjectsList();

        // Render preview canvas
        renderPreview();
      }
    } catch (e) {
      showToast('Error loading resume details.', 'error');
    }
  }

  // Education list handlers
  function renderEducationList() {
    const list = document.getElementById('educationListContainer');
    if (!list) return;
    list.innerHTML = educationList.map((edu, idx) => `
      <div class="dynamic-list-item">
        <div>
          <strong>${edu.degree} in ${edu.stream}</strong> at <span>${edu.college}</span>
          <div style="font-size:11px; color:var(--mist-dim);">${edu.start_year} - ${edu.end_year} | CGPA: ${edu.cgpa}</div>
        </div>
        <button class="btn btn-danger btn-sm" onclick="removeEduItem(${idx})">✕</button>
      </div>
    `).join('');
  }

  window.removeEduItem = function (idx) {
    educationList.splice(idx, 1);
    renderEducationList();
    renderPreview();
  };

  document.getElementById('btnAddEdu')?.addEventListener('click', () => {
    const college = document.getElementById('eduColl').value.trim();
    const degree = document.getElementById('eduDeg').value.trim();
    const stream = document.getElementById('eduStream').value.trim();
    const cgpa = document.getElementById('eduCgpa').value.trim();
    const start_year = document.getElementById('eduStart').value.trim();
    const end_year = document.getElementById('eduEnd').value.trim();

    if (!college || !degree) {
      showToast('Please fill College name and Degree.', 'warning');
      return;
    }

    educationList.push({ college, degree, stream, cgpa, start_year, end_year });
    renderEducationList();
    renderPreview();

    // Clear inputs
    document.getElementById('eduColl').value = '';
    document.getElementById('eduDeg').value = '';
    document.getElementById('eduStream').value = '';
    document.getElementById('eduCgpa').value = '';
    document.getElementById('eduStart').value = '';
    document.getElementById('eduEnd').value = '';
  });

  // Experience list handlers
  function renderExperienceList() {
    const list = document.getElementById('experienceListContainer');
    if (!list) return;
    list.innerHTML = experienceList.map((exp, idx) => `
      <div class="dynamic-list-item">
        <div>
          <strong>${exp.role}</strong> at <span>${exp.company}</span>
          <div style="font-size:11px; color:var(--mist-dim);">${exp.start_date} - ${exp.end_date}</div>
        </div>
        <button class="btn btn-danger btn-sm" onclick="removeExpItem(${idx})">✕</button>
      </div>
    `).join('');
  }

  window.removeExpItem = function (idx) {
    experienceList.splice(idx, 1);
    renderExperienceList();
    renderPreview();
  };

  document.getElementById('btnAddExp')?.addEventListener('click', () => {
    const company = document.getElementById('expCompany').value.trim();
    const role = document.getElementById('expRole').value.trim();
    const start_date = document.getElementById('expStart').value.trim();
    const end_date = document.getElementById('expEnd').value.trim();
    const description = document.getElementById('expDesc').value.trim();

    if (!company || !role) {
      showToast('Please fill Company name and Role.', 'warning');
      return;
    }

    experienceList.push({ company, role, start_date, end_date, description });
    renderExperienceList();
    renderPreview();

    // Clear inputs
    document.getElementById('expCompany').value = '';
    document.getElementById('expRole').value = '';
    document.getElementById('expStart').value = '';
    document.getElementById('expEnd').value = '';
    document.getElementById('expDesc').value = '';
  });

  // Projects list handlers
  function renderProjectsList() {
    const list = document.getElementById('projectsListContainer');
    if (!list) return;
    list.innerHTML = projectsList.map((proj, idx) => `
      <div class="dynamic-list-item">
        <div>
          <strong>${proj.name}</strong> (${proj.technologies})
          <div style="font-size:11px; color:var(--mist-dim);">${proj.description}</div>
        </div>
        <button class="btn btn-danger btn-sm" onclick="removeProjItem(${idx})">✕</button>
      </div>
    `).join('');
  }

  window.removeProjItem = function (idx) {
    projectsList.splice(idx, 1);
    renderProjectsList();
    renderPreview();
  };

  document.getElementById('btnAddProj')?.addEventListener('click', () => {
    const name = document.getElementById('projName').value.trim();
    const technologies = document.getElementById('projTech').value.trim();
    const github_url = document.getElementById('projGit').value.trim();
    const live_url = document.getElementById('projLive').value.trim();
    const description = document.getElementById('projDesc').value.trim();

    if (!name) {
      showToast('Project Name is required.', 'warning');
      return;
    }

    projectsList.push({ name, technologies, github_url, live_url, description });
    renderProjectsList();
    renderPreview();

    // Clear inputs
    document.getElementById('projName').value = '';
    document.getElementById('projTech').value = '';
    document.getElementById('projGit').value = '';
    document.getElementById('projLive').value = '';
    document.getElementById('projDesc').value = '';
  });

  // Live Sync Inputs changes to Preview canvas
  function bindLiveSync() {
    const fields = ['pName', 'pEmail', 'pPhone', 'pLocation', 'pGithub', 'pLinkedin', 'pSummary', 'skLangs', 'skFrontend', 'skBackend', 'skDatabase'];
    fields.forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        updateLocalState();
        renderPreview();
      });
    });

    document.getElementById('resumeTemplateSelect')?.addEventListener('change', () => {
      renderPreview();
    });
  }

  function updateLocalState() {
    personalInfo.name = document.getElementById('pName').value;
    personalInfo.email = document.getElementById('pEmail').value;
    personalInfo.phone = document.getElementById('pPhone').value;
    personalInfo.location = document.getElementById('pLocation').value;
    personalInfo.github = document.getElementById('pGithub').value;
    personalInfo.linkedin = document.getElementById('pLinkedin').value;
    
    summary = document.getElementById('pSummary').value;

    skills.languages = document.getElementById('skLangs').value.split(',').map(s => s.trim()).filter(Boolean);
    skills.frontend = document.getElementById('skFrontend').value.split(',').map(s => s.trim()).filter(Boolean);
    skills.backend = document.getElementById('skBackend').value.split(',').map(s => s.trim()).filter(Boolean);
    skills.database = document.getElementById('skDatabase').value.split(',').map(s => s.trim()).filter(Boolean);
  }

  // Render HTML preview based on selected template layout rules
  function renderPreview() {
    const preview = document.getElementById('resumePreview');
    const template = document.getElementById('resumeTemplateSelect')?.value || 'classic';
    if (!preview) return;

    // Apply template styling overrides class
    preview.className = `preview-container tmpl-${template}`;

    // Render Contact Header Block
    let headerHtml = `
      <div style="text-align:center; border-bottom:2px solid ${template === 'modern' ? '#0284c7' : '#cbd5e1'}; padding-bottom:1rem; margin-bottom:1rem;">
        <h2 style="font-size:20px; font-weight:800; text-transform:uppercase; margin-bottom:0.25rem;">${personalInfo.name || 'Your Name'}</h2>
        <div style="font-size:11.5px; color:#475569; display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
          <span>📧 ${personalInfo.email || 'email@example.com'}</span>
          <span>📞 ${personalInfo.phone || '+91 99999 99999'}</span>
          <span>📍 ${personalInfo.location || 'City, Country'}</span>
        </div>
        <div style="font-size:11px; color:#64748b; margin-top:0.35rem; display:flex; justify-content:center; gap:8px; flex-wrap:wrap;">
          <span>🐱 ${personalInfo.github || 'github.com'}</span>
          <span>💼 ${personalInfo.linkedin || 'linkedin.com'}</span>
        </div>
      </div>
    `;

    // Render Summary Section
    let summaryHtml = '';
    if (summary) {
      summaryHtml = `
        <div style="margin-bottom:1.25rem;">
          <h4 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${template === 'modern' ? '#0284c7' : '#1e293b'}; border-bottom:1px solid #e2e8f0; padding-bottom:0.25rem; margin-bottom:0.5rem;">Summary</h4>
          <p style="color:#334155; line-height:1.5;">${summary}</p>
        </div>
      `;
    }

    // Render Education Section
    let eduHtml = '';
    if (educationList.length > 0) {
      eduHtml = `
        <div style="margin-bottom:1.25rem;">
          <h4 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${template === 'modern' ? '#0284c7' : '#1e293b'}; border-bottom:1px solid #e2e8f0; padding-bottom:0.25rem; margin-bottom:0.5rem;">Education</h4>
          ${educationList.map(e => `
            <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem;">
              <div>
                <strong>${e.college}</strong>
                <div>${e.degree} in ${e.stream}</div>
              </div>
              <div style="text-align:right;">
                <div>${e.start_year} - ${e.end_year}</div>
                <div style="font-size:11px; color:#64748b;">CGPA: ${e.cgpa}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Render Experience Section
    let expHtml = '';
    if (experienceList.length > 0) {
      expHtml = `
        <div style="margin-bottom:1.25rem;">
          <h4 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${template === 'modern' ? '#0284c7' : '#1e293b'}; border-bottom:1px solid #e2e8f0; padding-bottom:0.25rem; margin-bottom:0.5rem;">Experience</h4>
          ${experienceList.map(ex => `
            <div style="margin-bottom:0.6rem;">
              <div style="display:flex; justify-content:space-between;">
                <strong>${ex.company}</strong>
                <span style="color:#64748b; font-size:11.5px;">${ex.start_date} - ${ex.end_date}</span>
              </div>
              <div><em>${ex.role}</em></div>
              <p style="color:#475569; margin-top:0.2rem; font-size:12.5px;">${ex.description}</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Render Projects Section
    let projHtml = '';
    if (projectsList.length > 0) {
      projHtml = `
        <div style="margin-bottom:1.25rem;">
          <h4 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${template === 'modern' ? '#0284c7' : '#1e293b'}; border-bottom:1px solid #e2e8f0; padding-bottom:0.25rem; margin-bottom:0.5rem;">Projects</h4>
          ${projectsList.map(p => `
            <div style="margin-bottom:0.6rem;">
              <div style="display:flex; justify-content:space-between;">
                <strong>${p.name}</strong>
                <span style="font-size:11px; color:#64748b;">${p.technologies}</span>
              </div>
              <p style="color:#475569; margin-top:0.15rem; font-size:12.5px;">${p.description}</p>
              ${p.github_url ? `<div style="font-size:11px; color:#0284c7;">Link: ${p.github_url}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    // Render Skills Section
    let skillsHtml = '';
    const hasSkills = Object.values(skills).some(arr => arr && arr.length > 0);
    if (hasSkills) {
      skillsHtml = `
        <div>
          <h4 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${template === 'modern' ? '#0284c7' : '#1e293b'}; border-bottom:1px solid #e2e8f0; padding-bottom:0.25rem; margin-bottom:0.5rem;">Skills</h4>
          <div style="display:flex; flex-direction:column; gap:4px; font-size:12px; color:#334155;">
            ${skills.languages && skills.languages.length ? `<div><strong>Languages:</strong> ${skills.languages.join(', ')}</div>` : ''}
            ${skills.frontend && skills.frontend.length ? `<div><strong>Frontend:</strong> ${skills.frontend.join(', ')}</div>` : ''}
            ${skills.backend && skills.backend.length ? `<div><strong>Backend:</strong> ${skills.backend.join(', ')}</div>` : ''}
            ${skills.database && skills.database.length ? `<div><strong>Database:</strong> ${skills.database.join(', ')}</div>` : ''}
          </div>
        </div>
      `;
    }

    preview.innerHTML = headerHtml + summaryHtml + eduHtml + expHtml + projHtml + skillsHtml;
  }

  // Save Resume draft trigger
  document.getElementById('btnSaveResume')?.addEventListener('click', async () => {
    updateLocalState();
    const template = document.getElementById('resumeTemplateSelect')?.value || 'classic';

    const payload = {
      id: activeResumeId,
      title: 'My Saved Resume',
      template,
      personal_info: personalInfo,
      summary,
      skills,
      sections: {
        education: educationList,
        experience: experienceList,
        projects: projectsList
      }
    };

    try {
      const endpoint = activeResumeId ? '/api/resume/update' : '/api/resume/save';
      const method = activeResumeId ? 'PUT' : 'POST';
      const res = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(payload)
      });

      if (res.success) {
        showToast(res.message, 'success');
        if (res.id) activeResumeId = res.id;
        await loadUserResume();
      } else {
        showToast(res.message || 'Failed to save resume.', 'error');
      }
    } catch (e) {
      showToast('Connection failed.', 'error');
    }
  });

  // Export PDF and print trigger
  document.getElementById('btnExportPDF')?.addEventListener('click', async () => {
    if (!activeResumeId) {
      showToast('Save resume draft first before exporting!', 'warning');
      return;
    }

    try {
      await apiFetch('/api/resume/download', {
        method: 'POST',
        body: JSON.stringify({ id: activeResumeId, format: 'pdf' })
      });

      showToast('Export tracked successfully. Triggering print options...', 'success');
      
      // Open clean print page using preview content
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <head>
              <title>Resume Print Preview</title>
              <style>
                body { padding: 2rem; background: #fff; color: #1a1a1a; font-family: 'Georgia', serif; }
                .preview-container { max-width: 800px; margin: 0 auto; }
              </style>
            </head>
            <body onload="window.print(); window.close();">
              <div class="preview-container">
                ${document.getElementById('resumePreview').innerHTML}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }

    } catch (err) {
      showToast('Failed to track downloads.', 'error');
    }
  });

  // ATS scanner triggers
  document.getElementById('btnScanATS')?.addEventListener('click', async () => {
    if (!activeResumeId) {
      showToast('Please save your resume draft first!', 'warning');
      return;
    }

    const jd = document.getElementById('jobDescriptionInput').value.trim();
    if (!jd || jd.length < 10) {
      showToast('Paste a valid job description to scan.', 'warning');
      return;
    }

    const btnScan = document.getElementById('btnScanATS');
    btnScan.disabled = true;
    btnScan.textContent = 'Analyzing...';

    try {
      const res = await apiFetch('/api/resume/scan', {
        method: 'POST',
        body: JSON.stringify({
          id: activeResumeId,
          job_description: jd
        })
      });

      if (res.success) {
        showToast('ATS Scan complete!', 'success');
        document.getElementById('scoreDisplayVal').textContent = res.score + '%';
        
        // Show result details panel
        const overlay = document.getElementById('scanResultsOverlay');
        overlay.style.display = 'block';

        document.getElementById('matchedTags').textContent = res.matched.join(', ') || 'None';
        document.getElementById('missingTags').textContent = res.missing.join(', ') || 'None';

        const suggestList = document.getElementById('atsSuggestionsBox');
        if (suggestList) {
          suggestList.innerHTML = res.suggestions.map(s => `<li>${s}</li>`).join('');
        }
      } else {
        showToast(res.message || 'Scan failed.', 'error');
      }
    } catch (e) {
      showToast('Scan connection failed.', 'error');
    } finally {
      btnScan.disabled = false;
      btnScan.textContent = 'Analyze Blueprint Compatibility';
    }
  });

  // AI Summary Polish
  document.getElementById('btnAiImproveSummary')?.addEventListener('click', async () => {
    const text = document.getElementById('pSummary').value.trim();
    if (!text) {
      showToast('Type a summary draft first.', 'warning');
      return;
    }

    try {
      const res = await apiFetch('/api/resume/ai/improve', {
        method: 'POST',
        body: JSON.stringify({
          id: activeResumeId,
          section_name: 'summary',
          content: text
        })
      });

      if (res.success) {
        showToast('AI polished summary generated.', 'success');
        document.getElementById('pSummary').value = res.improved;
        updateLocalState();
        renderPreview();
      }
    } catch (e) {
      showToast('AI polish failed.', 'error');
    }
  });

  // Initial loader
  loadUserResume();
  bindLiveSync();

})();
