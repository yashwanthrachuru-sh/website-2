// ============================================================
// js/certificates.js — EduNet Certificates Page
// ============================================================
'use strict';
const session = window.initPageShell('certificates.html');
const { showToast, getXP } = window.EduNetAPI;

const CERT_KEY = 'edunet_certs_' + session?.username;

// Sample certs seeded if user has enough XP
function seedCerts() {
  const xp = getXP();
  const existing = JSON.parse(localStorage.getItem(CERT_KEY) || '[]');
  if (existing.length) return existing;

  const base = [
    { id:'C001', title:'EduNet Platform Initiation', track:'General', date: new Date().toLocaleDateString('en-IN'), hash: 'EN-' + Math.random().toString(36).slice(2,10).toUpperCase(), auto: true },
  ];
  if (xp >= 100) base.push({ id:'C002', title:'Coding Lab Explorer', track:'Coding Lab', date: new Date().toLocaleDateString('en-IN'), hash: 'EN-' + Math.random().toString(36).slice(2,10).toUpperCase(), auto: true });
  if (xp >= 250) base.push({ id:'C003', title:'Quiz Champion', track:'Quiz Center', date: new Date().toLocaleDateString('en-IN'), hash: 'EN-' + Math.random().toString(36).slice(2,10).toUpperCase(), auto: true });

  // Check roadmap completions
  const rmKeys = Object.keys(localStorage).filter(k => k.startsWith('edunet_rm_' + session?.username + '_'));
  rmKeys.forEach(k => {
    const data = JSON.parse(localStorage.getItem(k) || '{}');
    const done = Object.values(data).filter(Boolean).length;
    const total = Object.keys(data).length;
    if (total >= 4 && done >= total) {
      const track = k.split('_').pop().toUpperCase();
      base.push({ id: 'C' + base.length, title: track + ' Roadmap Certificate', track, date: new Date().toLocaleDateString('en-IN'), hash: 'EN-' + Math.random().toString(36).slice(2,10).toUpperCase(), auto: true });
    }
  });

  localStorage.setItem(CERT_KEY, JSON.stringify(base));
  return base;
}

function renderCerts() {
  const certs = seedCerts();
  const grid = document.getElementById('certsGrid');
  const noMsg = document.getElementById('noYetMsg');
  if (!certs.length) { noMsg.style.display = 'block'; return; }
  noMsg.style.display = 'none';
  grid.innerHTML = '';
  certs.forEach(cert => {
    const card = document.createElement('div');
    card.className = 'glass-card';
    card.style.cssText = 'padding:1.5rem;cursor:pointer;position:relative;overflow:hidden;';
    card.innerHTML = `
      <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--accent),var(--accent-2));"></div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem;">
        <div style="font-size:2rem;">🏆</div>
        <div>
          <h3 style="font-size:14.5px;margin-bottom:.2rem;">${cert.title}</h3>
          <div style="font-size:12px;color:var(--mist);">${cert.track} Track</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--mist-dim);">
        <span>Issued: ${cert.date}</span>
        <span class="badge badge-green">Verified</span>
      </div>
      <div style="margin-top:.75rem;font-family:var(--font-mono);font-size:10px;color:var(--mist-dim);background:var(--surface);padding:.4rem .7rem;border-radius:var(--r-xs);">${cert.hash}</div>
      <div style="display:flex;gap:.5rem;margin-top:1rem;">
        <button class="btn btn-primary btn-sm view-cert-btn" data-id="${cert.id}">👁 View</button>
        <button class="btn btn-secondary btn-sm dl-cert-btn" data-id="${cert.id}">⬇ Download</button>
      </div>
    `;
    card.querySelector('.view-cert-btn').addEventListener('click', () => viewCert(cert));
    card.querySelector('.dl-cert-btn').addEventListener('click', () => downloadCert(cert));
    grid.appendChild(card);
  });
}

function viewCert(cert) {
  const modal = document.getElementById('certModal');
  const content = document.getElementById('certModalContent');
  content.innerHTML = `
    <div style="padding:0;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;border-bottom:1px solid var(--border);">
        <h3 style="font-size:16px;">Certificate Preview</h3>
        <button onclick="document.getElementById('certModal').classList.remove('open')" style="background:none;border:none;color:var(--mist);font-size:22px;cursor:pointer;">&times;</button>
      </div>
      <div style="padding:2rem;">
        <div style="background:linear-gradient(135deg,#0a0f1e,rgba(99,102,241,0.08));border:2px solid var(--border-accent);border-radius:var(--r-lg);padding:3rem;text-align:center;position:relative;max-width:600px;margin:0 auto;">
          <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--accent),var(--accent-2),var(--purple));border-radius:var(--r-lg) var(--r-lg) 0 0;"></div>
          <div style="font-size:2.5rem;margin-bottom:1rem;">🏆</div>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--mist-dim);text-transform:uppercase;letter-spacing:.1em;margin-bottom:.75rem;">Certificate of Completion</div>
          <h2 style="font-size:1.4rem;margin-bottom:.5rem;">This certifies that</h2>
          <h1 style="font-size:2rem;background:linear-gradient(135deg,var(--accent),var(--accent-2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:.5rem;">${session?.username || 'Student'}</h1>
          <p style="color:var(--mist);font-size:14px;margin-bottom:1rem;">has successfully completed</p>
          <h2 style="font-size:1.3rem;margin-bottom:1.5rem;">${cert.title}</h2>
          <div style="display:flex;justify-content:center;gap:3rem;margin-bottom:1.5rem;">
            <div><div style="font-size:10px;color:var(--mist-dim);margin-bottom:.25rem;">ISSUED ON</div><div style="font-size:13px;font-weight:600;">${cert.date}</div></div>
            <div><div style="font-size:10px;color:var(--mist-dim);margin-bottom:.25rem;">TRACK</div><div style="font-size:13px;font-weight:600;">${cert.track}</div></div>
          </div>
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--mist-dim);background:rgba(255,255,255,0.04);padding:.5rem 1rem;border-radius:var(--r-xs);display:inline-block;">Verification ID: ${cert.hash}</div>
          <div style="margin-top:.75rem;font-size:11px;color:var(--mist-dim);">Verify at edunet.app/verify/${cert.hash}</div>
        </div>
        <div style="display:flex;gap:.75rem;justify-content:center;margin-top:1.5rem;">
          <button class="btn btn-primary" onclick="window.print()">🖨 Print / Save PDF</button>
          <button class="btn btn-secondary" onclick="document.getElementById('certModal').classList.remove('open')">Close</button>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('open');
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}

function downloadCert(cert) {
  showToast('Opening print dialog — Save as PDF to download.', 'info');
  viewCert(cert);
  setTimeout(() => window.print(), 800);
}

renderCerts();
