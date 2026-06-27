// ============================================================
// js/notifications.js — EduNet Notifications Page
// ============================================================
'use strict';
const session = window.initPageShell('notifications.html');
const { showToast } = window.EduNetAPI;

const NOTIF_KEY = 'edunet_notifs_' + session?.username;

const DEFAULT_NOTIFS = [
  { id:'n1', title:'Welcome to EduNet!', body:'Your account is approved and ready. Start your first roadmap to earn XP!', time:'Just now', type:'success', read:false },
  { id:'n2', title:'New Roadmap Available', body:'System Design roadmap has been updated with 3 new modules — AI Infrastructure, Microservices Patterns, and Edge Computing.', time:'2 hours ago', type:'info', read:false },
  { id:'n3', title:'Quiz Unlocked: DSA Linked Lists', body:'A new quiz has been unlocked in the Quiz Center. Complete it for 100 XP!', time:'1 day ago', type:'info', read:false },
  { id:'n4', title:'EduNet Platform Update', body:'Version 2.0 is live! New features include YouTube Learning, Interview Prep, and improved Resume Builder.', time:'2 days ago', type:'info', read:true },
  { id:'n5', title:'Daily Streak Reminder', body:'You haven\'t logged in yesterday. Log in today to maintain your streak and earn bonus XP!', time:'3 days ago', type:'warning', read:true },
];

function getNotifs() {
  const saved = localStorage.getItem(NOTIF_KEY);
  if (!saved) { localStorage.setItem(NOTIF_KEY, JSON.stringify(DEFAULT_NOTIFS)); return DEFAULT_NOTIFS; }
  return JSON.parse(saved);
}

const TYPE_ICONS = { success: '✅', info: 'ℹ️', warning: '⚠️', error: '❌' };
const TYPE_COLORS = { success: 'var(--emerald)', info: 'var(--accent)', warning: 'var(--amber)', error: 'var(--rose)' };

function renderNotifs() {
  const list = document.getElementById('notificationsList');
  if (!list) return;
  const notifs = getNotifs();
  list.innerHTML = '';
  notifs.forEach(n => {
    const el = document.createElement('div');
    el.style.cssText = `display:flex;gap:1rem;background:var(--abyss);border:1px solid ${n.read ? 'var(--border)' : 'var(--border-accent)'};border-radius:var(--r-sm);padding:1.1rem 1.25rem;transition:all .2s;opacity:${n.read ? '.6' : '1'};`;
    el.innerHTML = `
      <div style="font-size:1.4rem;flex-shrink:0;">${TYPE_ICONS[n.type] || 'ℹ️'}</div>
      <div style="flex:1;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;margin-bottom:.25rem;">
          <h4 style="font-size:14px;font-weight:600;">${n.title}</h4>
          <div style="display:flex;gap:.5rem;align-items:center;">
            ${!n.read ? '<span class="badge badge-accent" style="font-size:9px;">NEW</span>' : ''}
            <span style="font-size:11px;color:var(--mist-dim);">${n.time}</span>
          </div>
        </div>
        <p style="font-size:13px;color:var(--mist);line-height:1.5;">${n.body}</p>
      </div>
      <button class="btn btn-ghost btn-sm mark-read-btn" data-id="${n.id}" style="flex-shrink:0;align-self:flex-start;font-size:11px;" title="Mark as read">
        ${n.read ? '✓' : '○'}
      </button>
    `;
    el.querySelector('.mark-read-btn').addEventListener('click', function() {
      const notifs = getNotifs();
      const found = notifs.find(x => x.id === this.getAttribute('data-id'));
      if (found) found.read = true;
      localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
      renderNotifs();
    });
    list.appendChild(el);
  });
}

document.getElementById('markAllReadBtn')?.addEventListener('click', () => {
  const notifs = getNotifs().map(n => ({ ...n, read: true }));
  localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
  renderNotifs();
  showToast('All marked as read.', 'success');
});

renderNotifs();
