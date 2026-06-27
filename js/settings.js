// ============================================================
// js/settings.js — EduNet Settings Page
// ============================================================
'use strict';
const session = window.initPageShell('settings.html');
const { showToast, clearSession } = window.EduNetAPI;

// Populate username (readonly)
const sUsername = document.getElementById('sUsername');
if (sUsername) sUsername.value = session?.username || '';

// Load saved settings
const SETTINGS_KEY = 'edunet_settings_' + session?.username;
function loadSettings() {
  const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
  const emailEl = document.getElementById('sEmail');
  if (emailEl && s.email) emailEl.value = s.email;
  if (document.getElementById('notifEmail')) document.getElementById('notifEmail').checked = s.notifEmail !== false;
  if (document.getElementById('notifQuiz')) document.getElementById('notifQuiz').checked = s.notifQuiz !== false;
  if (document.getElementById('notifRoadmap')) document.getElementById('notifRoadmap').checked = s.notifRoadmap !== false;
}

document.getElementById('saveAccountBtn')?.addEventListener('click', () => {
  const email = document.getElementById('sEmail')?.value || '';
  const newPw = document.getElementById('sNewPw')?.value || '';
  const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
  s.email = email;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  const msg = document.getElementById('settingsMsgAcc');
  if (msg) { msg.textContent = '✓ Account settings saved.'; setTimeout(() => msg.textContent = '', 3000); }
  showToast('Account settings saved!', 'success');
});

document.getElementById('saveNotifBtn')?.addEventListener('click', () => {
  const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
  s.notifEmail = document.getElementById('notifEmail')?.checked;
  s.notifQuiz = document.getElementById('notifQuiz')?.checked;
  s.notifRoadmap = document.getElementById('notifRoadmap')?.checked;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  showToast('Notification preferences saved!', 'success');
});

document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  showToast('Theme toggled. (Full light mode requires css/light.css)', 'info');
});

document.getElementById('fontSizeSelect')?.addEventListener('change', function() {
  const sizes = { 'Default (16px)': '16px', 'Large (18px)': '18px', 'Small (14px)': '14px' };
  document.documentElement.style.fontSize = sizes[this.value] || '16px';
});

document.getElementById('clearDataBtn')?.addEventListener('click', () => {
  if (!confirm('This will delete ALL local data (progress, saved code, resume, bookmarks). Continue?')) return;
  const keysToKeep = ['edunet_token', 'edunet_session', 'edunet_user'];
  const keys = Object.keys(localStorage).filter(k => !keysToKeep.includes(k));
  keys.forEach(k => localStorage.removeItem(k));
  showToast('Local data cleared. Redirecting...', 'info');
  setTimeout(() => window.location.href = 'user.html', 1200);
});

loadSettings();
