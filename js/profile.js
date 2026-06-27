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
    const branchEl = document.getElementById('profileBranch');
    if (branchEl) branchEl.textContent = (u.branch || 'SDE') + ' Track';
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
      pSkills: u.skills || ''
    };
    Object.entries(fields).forEach(([id, val]) => { 
      const el = document.getElementById(id); 
      if (el) el.value = val; 
    });

  } catch (err) {
    showToast('Failed to load profile details: ' + err.message, 'error');
  }
}

document.getElementById('saveProfileBtn')?.addEventListener('click', async () => {
  const data = {
    bio: document.getElementById('pBio')?.value || '',
    linkedin: document.getElementById('pLinkedin')?.value || '',
    github: document.getElementById('pGithub')?.value || '',
    skills: document.getElementById('pSkills')?.value || '',
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
