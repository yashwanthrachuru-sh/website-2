// ============================================================
// js/resume.js — EduNet Resume Builder (API Integrated)
// ============================================================
'use strict';
const session = window.initPageShell('resume.html');
const { showToast, addXP } = window.EduNetAPI;

const RESUME_KEY = 'edunet_resume_' + session?.username;

// Load saved data
function loadSaved() {
  const saved = JSON.parse(localStorage.getItem(RESUME_KEY) || '{}');
  Object.entries(saved).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });
}

// Save all fields
function saveResume() {
  const fields = ['rName','rEmail','rPhone','rLinkedin','rGithub','rSummary','rSkills','rExp','rEdu','rProjects','resumeTemplate'];
  const data = {};
  fields.forEach(id => { const el = document.getElementById(id); if (el) data[id] = el.value; });
  localStorage.setItem(RESUME_KEY, JSON.stringify(data));
  showToast('Resume draft saved!', 'success');
  addXP(15);
}

// Live preview & theme styling
function updatePreview() {
  const get = id => document.getElementById(id)?.value || '';
  const name = get('rName') || 'Your Name';
  const email = get('rEmail') || 'email@example.com';
  const phone = get('rPhone') || '';
  const linkedin = get('rLinkedin') || '';
  const github = get('rGithub') || '';
  const summary = get('rSummary') || '';
  const skills = get('rSkills') || '';
  const exp = get('rExp') || '';
  const edu = get('rEdu') || '';
  const projects = get('rProjects') || '';
  const template = get('resumeTemplate') || 'ats';

  // Format skills
  let skillsList = '';
  if (skills) {
    skillsList = skills.split(',').filter(Boolean).map(s => {
      if (template === 'minimalist') {
        return `<span style="font-size:12px;color:#1a1a1a;margin-right:8px;font-family:serif;">${s.trim()}</span>`;
      } else if (template === 'modern') {
        return `<span style="display:inline-block;background:#ebf8ff;color:#2b6cb0;border-radius:4px;padding:3px 10px;margin:3px;font-size:11px;font-weight:600;">${s.trim()}</span>`;
      } else {
        // Standard ATS
        return `<span style="display:inline-block;border:1px solid #cbd5e0;border-radius:2px;padding:2px 8px;margin:2px;font-size:11.5px;color:#2d3748;">${s.trim()}</span>`;
      }
    }).join('');
  }

  const formatTextBlock = (text) => text.split('\n').map(line => {
    if (line.startsWith('•') || line.startsWith('-')) {
      const content = line.slice(1).trim();
      return `<li style="margin-left:1.25rem;font-size:12px;color:#2d3748;margin-bottom:2px;">${content}</li>`;
    }
    return line.trim() ? `<p style="font-weight:600;font-size:13px;margin-top:.4rem;color:#1a202c;margin-bottom:4px;">${line}</p>` : '';
  }).join('');

  const preview = document.getElementById('resumePreview');
  if (!preview) return;

  // Apply templates
  let font = 'Arial, sans-serif';
  let primaryColor = '#2b6cb0';
  let headingBorder = '1px solid #bee3f8';
  
  if (template === 'minimalist') {
    font = 'Georgia, serif';
    primaryColor = '#1a1a1a';
    headingBorder = '1px solid #e2e8f0';
  } else if (template === 'ats') {
    font = 'Calibri, Arial, sans-serif';
    primaryColor = '#2d3748';
    headingBorder = '1px solid #cbd5e0';
  }

  preview.style.fontFamily = font;
  
  preview.innerHTML = `
    <div style="max-width:700px;margin:0 auto;color:#2d3748;">
      <div style="text-align:center;border-bottom:2px solid ${primaryColor};padding-bottom:1rem;margin-bottom:1.25rem;">
        <h1 style="font-size:24px;margin:0;color:#1a202c;font-weight:700;letter-spacing:-0.02em;">${name}</h1>
        <div style="font-size:12px;color:#4a5568;margin-top:.4rem;display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
          ${email ? `<span>📧 ${email}</span>` : ''}
          ${phone ? `<span>📞 ${phone}</span>` : ''}
          ${linkedin ? `<span>🔗 ${linkedin}</span>` : ''}
          ${github ? `<span>💻 ${github}</span>` : ''}
        </div>
      </div>
      
      ${summary ? `
        <div style="margin-bottom:1.25rem;">
          <h2 style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:${primaryColor};border-bottom:${headingBorder};padding-bottom:.3rem;margin-bottom:.5rem;font-weight:700;">Professional Summary</h2>
          <p style="font-size:12.5px;color:#2d3748;line-height:1.6;margin:0;">${summary}</p>
        </div>
      ` : ''}

      ${skills ? `
        <div style="margin-bottom:1.25rem;">
          <h2 style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:${primaryColor};border-bottom:${headingBorder};padding-bottom:.3rem;margin-bottom:.5rem;font-weight:700;">Technical Skills</h2>
          <div style="margin-top:0.4rem;">${skillsList}</div>
        </div>
      ` : ''}

      ${exp ? `
        <div style="margin-bottom:1.25rem;">
          <h2 style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:${primaryColor};border-bottom:${headingBorder};padding-bottom:.3rem;margin-bottom:.5rem;font-weight:700;">Professional Experience</h2>
          <div style="line-height:1.5;">${formatTextBlock(exp)}</div>
        </div>
      ` : ''}

      ${projects ? `
        <div style="margin-bottom:1.25rem;">
          <h2 style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:${primaryColor};border-bottom:${headingBorder};padding-bottom:.3rem;margin-bottom:.5rem;font-weight:700;">Projects</h2>
          <div style="line-height:1.5;">${formatTextBlock(projects)}</div>
        </div>
      ` : ''}

      ${edu ? `
        <div style="margin-bottom:1.25rem;">
          <h2 style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:${primaryColor};border-bottom:${headingBorder};padding-bottom:.3rem;margin-bottom:.5rem;font-weight:700;">Education</h2>
          <div style="line-height:1.5;">${formatTextBlock(edu)}</div>
        </div>
      ` : ''}
      
      <div style="margin-top:2rem;padding-top:.5rem;border-top:1px solid #e2e8f0;text-align:center;font-size:9px;color:#a0aec0;font-family:var(--font-mono);">Generated by EduNet Profile Tools</div>
    </div>
  `;

  updateATSScore();
}

// Calculate ATS Score & update coach advice
function updateATSScore() {
  const get = id => document.getElementById(id)?.value || '';
  const name = get('rName');
  const email = get('rEmail');
  const skills = get('rSkills');
  const exp = get('rExp');
  const edu = get('rEdu');
  const projects = get('rProjects');

  let score = 15; // base
  const suggestions = [];

  if (name) score += 5;
  if (email && email.includes('@')) score += 5;
  else suggestions.push('Add a valid contact email address.');

  const skillsCount = skills.split(',').filter(Boolean).length;
  if (skillsCount >= 8) {
    score += 25;
  } else if (skillsCount >= 4) {
    score += 15;
    suggestions.push('Add at least 8 key skills to increase technical search visibility.');
  } else {
    suggestions.push('List relevant technologies/tools (e.g. Python, SQL, Git).');
  }

  if (exp.length > 200) score += 20;
  else if (exp.length > 50) score += 10;
  else suggestions.push('Detail your experience. Explain achievements using action verbs.');

  if (edu.length > 30) score += 15;
  else suggestions.push('Include your degree, institution name, and CGPA.');

  if (projects.length > 100) score += 15;
  else suggestions.push('Add 2 key projects showing concrete tech stack applications.');

  // Validate action words
  const actionWords = ['built', 'optimized', 'automated', 'designed', 'developed', 'led', 'managed', 'created', 'implemented'];
  const hasActionWord = actionWords.some(w => exp.toLowerCase().includes(w) || projects.toLowerCase().includes(w));
  if (hasActionWord) score = Math.min(100, score + 5);
  else suggestions.push('Use dynamic action words like "Optimized" or "Automated" in descriptions.');

  const scoreEl = document.getElementById('atsScoreText');
  if (scoreEl) {
    scoreEl.textContent = score + '%';
    if (score >= 80) scoreEl.style.color = 'var(--emerald)';
    else if (score >= 50) scoreEl.style.color = 'var(--accent)';
    else scoreEl.style.color = 'var(--rose)';
  }

  const suggContainer = document.getElementById('aiResumeSuggestions');
  if (suggContainer) {
    if (!suggestions.length) {
      suggContainer.innerHTML = `<li style="color:var(--emerald);">✓ Your resume is fully optimized for ATS screening systems!</li>`;
    } else {
      suggContainer.innerHTML = suggestions.slice(0, 3).map(s => `<li>${s}</li>`).join('');
    }
  }
}

// Markdown export
function exportToMarkdown() {
  const get = id => document.getElementById(id)?.value || '';
  const name = get('rName') || 'Your Name';
  const email = get('rEmail') || '';
  const phone = get('rPhone') || '';
  const linkedin = get('rLinkedin') || '';
  const github = get('rGithub') || '';
  const summary = get('rSummary') || '';
  const skills = get('rSkills') || '';
  const exp = get('rExp') || '';
  const edu = get('rEdu') || '';
  const projects = get('rProjects') || '';

  const md = `# ${name}
${email ? `* Email: ${email}` : ''}
${phone ? `* Phone: ${phone}` : ''}
${linkedin ? `* LinkedIn: ${linkedin}` : ''}
${github ? `* GitHub: ${github}` : ''}

## Objective
${summary}

## Technical Skills
${skills.split(',').map(s => s.trim()).join(', ')}

## Professional Experience
${exp}

## Projects
${projects}

## Education
${edu}

---
Generated by EduNet Resume Builder
`;

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name.toLowerCase().replace(/\s+/g, '_') + '_resume.md';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Markdown downloaded!', 'success');
}

// Attach live listeners
const inputs = ['rName','rEmail','rPhone','rLinkedin','rGithub','rSummary','rSkills','rExp','rEdu','rProjects','resumeTemplate'];
inputs.forEach(id => {
  document.getElementById(id)?.addEventListener('input', updatePreview);
  document.getElementById(id)?.addEventListener('change', updatePreview);
});

document.getElementById('previewResumeBtn')?.addEventListener('click', updatePreview);
document.getElementById('saveResumeBtn')?.addEventListener('click', saveResume);
document.getElementById('exportMdBtn')?.addEventListener('click', exportToMarkdown);
document.getElementById('exportPdfBtn')?.addEventListener('click', () => {
  updatePreview();
  showToast('Preparing PDF layout... Please use "Save as PDF" option in browser.', 'info');
  setTimeout(() => window.print(), 600);
});

// Load init state
loadSaved();
updatePreview();
