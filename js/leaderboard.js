// ============================================================
// js/leaderboard.js — EduNet Leaderboard
// ============================================================
'use strict';
const session = window.initPageShell('leaderboard.html');
const { apiFetch, getXP } = window.EduNetAPI;

const myXP = getXP();
const myLevel = Math.floor(myXP / 500) + 1;

document.getElementById('myXPDisplay').textContent = myXP.toLocaleString();
document.getElementById('myLevelDisplay').textContent = myLevel;

// Generate simulated leaderboard with real user mixed in
const DEMO_USERS = [
  { username:'Arjun_Kumar', branch:'SDE', xp: 4800, badges:['🏆','⚡','🎯'] },
  { username:'Priya_Sharma', branch:'AI/ML', xp: 4320, badges:['🏆','🔬','💡'] },
  { username:'Rahul_Verma', branch:'Cybersec', xp: 3980, badges:['🛡️','⚡','🎯'] },
  { username:'Sneha_Patel', branch:'Data Science', xp: 3750, badges:['📊','🏆','✍️'] },
  { username:'Kiran_Singh', branch:'SDE', xp: 3420, badges:['⚡','💻','🎯'] },
  { username:'Divya_Nair', branch:'Cloud', xp: 3100, badges:['☁️','⚡','🏆'] },
  { username:'Amit_Joshi', branch:'DevOps', xp: 2880, badges:['🔄','🛡️','💻'] },
  { username:'Riya_Kapoor', branch:'Web Dev', xp: 2640, badges:['🌐','✍️','🎯'] },
  { username:'Varun_Menon', branch:'AI/ML', xp: 2300, badges:['🔬','💡','⚡'] },
  { username:'Pooja_Iyer', branch:'SDE', xp: 2050, badges:['💻','🎯'] },
];

function renderLeaderboard() {
  // Insert current user
  const me = { username: session?.username || 'You', branch: session?.branch || 'SDE', xp: myXP, badges: ['🔐'], isMe: true };
  const all = [...DEMO_USERS, me].sort((a, b) => b.xp - a.xp);
  const myRank = all.findIndex(u => u.isMe) + 1;
  document.getElementById('myRankDisplay').textContent = '#' + myRank;

  const tbody = document.getElementById('leaderboardBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  all.forEach((u, i) => {
    const rank = i + 1;
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
    const level = Math.floor(u.xp / 500) + 1;
    const row = document.createElement('tr');
    row.style.cssText = u.isMe ? 'background:rgba(99,102,241,.08);' : '';
    row.innerHTML = `
      <td style="font-size:1.1rem;text-align:center;">${medal}</td>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="dash-avatar" style="width:30px;height:30px;font-size:11px;">${u.username.slice(0,2).toUpperCase()}</div>
          <span style="font-weight:${u.isMe ? '700' : '500'};color:${u.isMe ? 'var(--accent)' : 'var(--frost)'};">${u.isMe ? '⭐ ' + u.username + ' (you)' : u.username}</span>
        </div>
      </td>
      <td><span class="badge badge-muted">${u.branch}</span></td>
      <td style="font-family:var(--font-mono);color:var(--accent);font-weight:700;">${u.xp.toLocaleString()}</td>
      <td><span class="badge badge-blue">Lv ${level}</span></td>
      <td>${(u.badges || []).join(' ')}</td>
    `;
    tbody.appendChild(row);
  });
}

// Try loading from API
let leaderboardData = [...DEMO_USERS];

function getRankTitle(xp) {
  if (xp < 1000) return '🌱 Beginner';
  if (xp < 2500) return '🚀 Explorer';
  if (xp < 5000) return '⚡ Challenger';
  if (xp < 7500) return '💎 Achiever';
  if (xp < 10000) return '🏆 Elite';
  if (xp < 15000) return '👑 Master';
  return '🔥 Grandmaster';
}

async function initLeaderboard() {
  try {
    const d = await apiFetch('/api/user/leaderboard');
    if (d.success && d.users && d.users.length) {
      leaderboardData = d.users.map(u => ({
        username: u.username,
        branch: u.branch || 'SDE',
        xp: u.xp || 0,
        badges: u.role === 'admin' ? ['👑', '⚡'] : ['🔐']
      }));
    }
  } catch (err) {
    console.log('Failed to fetch backend leaderboard, using offline fallback.');
  }
  
  // Insert current user if not already in list
  const username = session?.username || 'You';
  const meExists = leaderboardData.some(u => u.username === username);
  if (!meExists) {
    leaderboardData.push({
      username: username,
      branch: session?.branch || 'SDE',
      xp: myXP,
      badges: ['🔐'],
      isMe: true
    });
  } else {
    // Flag the existing user as current user
    leaderboardData.forEach(u => {
      if (u.username === username) {
        u.isMe = true;
        u.xp = myXP; // keep in sync with local state
      }
    });
  }

  // Sort by XP
  leaderboardData.sort((a, b) => b.xp - a.xp);

  const myRank = leaderboardData.findIndex(u => u.isMe) + 1;
  const myRankEl = document.getElementById('myRankDisplay');
  if (myRankEl) myRankEl.textContent = myRank > 0 ? '#' + myRank : '—';

  const tbody = document.getElementById('leaderboardBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  leaderboardData.forEach((u, i) => {
    const rank = i + 1;
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
    const level = Math.floor(u.xp / 500) + 1;
    const row = document.createElement('tr');
    if (u.isMe) row.style.cssText = 'background:rgba(99,102,241,.08);';
    row.innerHTML = `
      <td style="font-size:1.1rem;text-align:center;">${medal}</td>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div class="dash-avatar" style="width:30px;height:30px;font-size:11px;">${u.username.slice(0,2).toUpperCase()}</div>
          <span style="font-weight:${u.isMe ? '700' : '500'};color:${u.isMe ? 'var(--accent)' : 'var(--frost)'};">${u.isMe ? '⭐ ' + u.username + ' (you)' : u.username}</span>
        </div>
      </td>
      <td><span class="badge badge-muted">${u.branch}</span></td>
      <td style="font-family:var(--font-mono);color:var(--accent);font-weight:700;">${u.xp.toLocaleString()}</td>
      <td><span class="badge badge-blue" style="margin-right:6px;">Lv ${level}</span><span class="badge badge-muted">${getRankTitle(u.xp)}</span></td>
      <td>${(u.badges || []).join(' ')}</td>
    `;
    tbody.appendChild(row);
  });
}

initLeaderboard();
