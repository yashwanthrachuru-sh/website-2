// ============================================================
// js/profile.js — EduNet Profile Page (API Integrated)
// ============================================================
'use strict';
const session = window.initPageShell('profile.html');
const { apiFetch, showToast } = window.EduNetAPI;

const CERT_KEY = 'edunet_certs_' + session?.username;

async function loadProfile() {
  try {
    const data = await apiFetch('/api/profile');
    if (!data.success || !data.user) {
      throw new Error('User not found in system.');
    }
    
    const u = data.user;
    const name = u.username || 'Student';
    const initials = (u.avatar_initials || name.slice(0, 2)).toUpperCase();
    const xp = u.xp || 0;
    const level = Math.floor(xp / 500) + 1;
    const certs = JSON.parse(localStorage.getItem(CERT_KEY) || '[]').length;

    // Update Profile Card DOM
    const avEl = document.getElementById('profileAvatar');
    if (avEl) avEl.textContent = initials;
    const nameEl = document.getElementById('profileName');
    if (nameEl) nameEl.textContent = name;
    
    function getRankTitle(xpVal) {
      if (xpVal < 1000) return '🌱 Beginner';
      if (xpVal < 2500) return '🚀 Explorer';
      if (xpVal < 5000) return '⚡ Challenger';
      if (xpVal < 7500) return '💎 Achiever';
      if (xpVal < 10000) return '🏆 Elite';
      if (xpVal < 15000) return '👑 Master';
      return '🔥 Grandmaster';
    }

    const branchEl = document.getElementById('profileBranch');
    if (branchEl) branchEl.textContent = (u.branch || 'SDE') + ' Track • ' + getRankTitle(xp);
    const roleEl = document.getElementById('profileRole');
    if (roleEl) roleEl.textContent = u.role || 'user';

    const pXP = document.getElementById('pXP');
    if (pXP) pXP.textContent = xp.toLocaleString();
    const pCerts = document.getElementById('pCerts');
    if (pCerts) pCerts.textContent = certs;
    const pLevel = document.getElementById('pLevel');
    if (pLevel) pLevel.textContent = level;

    // Populate fields
    const fields = {
      pDispName: u.username || '', 
      pBio: u.bio || '', 
      pLinkedin: u.linkedin || '', 
      pGithub: u.github || '', 
      pInterests: u.interests || '',
      pGoals: u.learning_goals || '',
    };
    Object.entries(fields).forEach(([id, val]) => { 
      const el = document.getElementById(id); 
      if (el) el.value = val; 
    });

    // Populate dropdowns and checkboxes
    const setSelect = (id, val) => {
      const el = document.getElementById(id);
      if (el && val) el.value = val;
    };
    setSelect('pTargetXP', u.weekly_target_xp);
    setSelect('pPrefLanguage', u.preferred_language);
    setSelect('pPrefDifficulty', u.preferred_difficulty);

    const remEl = document.getElementById('pReminder');
    if (remEl) remEl.checked = !!u.daily_reminder;

    // Load Badges/Achievements
    loadBadges();

  } catch (err) {
    showToast('Failed to load profile details: ' + err.message, 'error');
  }
}

async function loadBadges() {
  const grid = document.getElementById('profileBadgesGrid');
  if (!grid) return;
  try {
    const data = await apiFetch('/api/achievements');
    if (data.success && data.achievements) {
      const earned = data.achievements.filter(a => a.earned);
      if (earned.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;font-size:11.5px;color:var(--mist-dim);padding:1rem 0;">No badges earned yet. Complete challenges to earn badges!</div>';
        return;
      }
      grid.innerHTML = earned.map(a => `
        <div style="background:var(--abyss-2); border:1px solid hsl(262,40%,25%); border-radius:var(--r-sm); padding:.4rem; display:flex; flex-direction:column; align-items:center;" title="${a.title}: ${a.description}">
          <div style="font-size:1.4rem; margin-bottom:.15rem;">${a.icon}</div>
          <div style="font-size:9.5px; font-weight:600; color:var(--frost); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:60px;">${a.title.split(' ').slice(1).join(' ') || a.title}</div>
        </div>
      `).join('');
    }
  } catch (e) {
    grid.innerHTML = '<div style="grid-column:1/-1;font-size:11.5px;color:var(--mist-dim);padding:1rem 0;">Achievements temporary offline.</div>';
  }
}

document.getElementById('saveProfileBtn')?.addEventListener('click', async () => {
  const data = {
    bio: document.getElementById('pBio')?.value || '',
    linkedin: document.getElementById('pLinkedin')?.value || '',
    github: document.getElementById('pGithub')?.value || '',
    interests: document.getElementById('pInterests')?.value || '',
    learning_goals: document.getElementById('pGoals')?.value || '',
    weekly_target_xp: parseInt(document.getElementById('pTargetXP')?.value || '500'),
    preferred_language: document.getElementById('pPrefLanguage')?.value || 'javascript',
    preferred_difficulty: document.getElementById('pPrefDifficulty')?.value || 'medium',
    daily_reminder: document.getElementById('pReminder')?.checked ? 1 : 0,
    avatar_initials: (document.getElementById('pDispName')?.value || '').slice(0, 2) || null
  };

  try {
    const res = await apiFetch('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    
    if (res.success) {
      const msgEl = document.getElementById('profileFormMsg');
      if (msgEl) { 
        msgEl.textContent = '✓ Profile saved successfully!'; 
        setTimeout(() => msgEl.textContent = '', 3000); 
      }
      showToast('Profile updated!', 'success');
      loadProfile();
    } else {
      throw new Error(res.message);
    }
  } catch (err) {
    showToast('Failed to update profile: ' + err.message, 'error');
  }
});

loadProfile();
