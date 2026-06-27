// ============================================================
// js/roadmaps.js — EduNet Roadmaps Page
// ============================================================
'use strict';

const session = window.initPageShell('roadmaps.html');
const { showToast, addXP } = window.EduNetAPI;

// Override search results to show roadmaps (page-shell handles modal open/close)
document.getElementById('searchInput')?.addEventListener('input', function () {
  const q = this.value.toLowerCase().trim();
  const searchList = document.getElementById('searchResultsList');
  if (!searchList) return;
  searchList.innerHTML = '';
  if (!q) return;
  const hits = ALL_ROADMAPS.filter(r => r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q));
  if (!hits.length) { searchList.innerHTML = '<div class="search-no-results">No roadmaps match.</div>'; return; }
  hits.forEach(function (r) {
    const el = document.createElement('div');
    el.className = 'search-result-item';
    el.innerHTML = '<div class="search-result-icon">' + r.icon + '</div><div class="search-result-info"><div class="search-result-title">' + r.title + '</div><div class="search-result-desc">' + r.desc + '</div></div><div class="search-result-cat">Roadmap</div>';
    el.addEventListener('click', function () { document.getElementById('searchModal').classList.remove('open'); openDrawer(r); });
    searchList.appendChild(el);
  });
});

// ── Roadmap Data ───────────────────────────────────────────────
const ALL_ROADMAPS = [
  {
    id:'webdev', icon:'🌐', title:'Web Development', desc:'Build full-stack web applications with HTML, CSS, JS, React, Node.js and more.',
    difficulty:'Beginner', time:'6 months', xp:2400, cert:true,
    modules:['HTML & CSS Foundations','JavaScript Fundamentals','DOM Manipulation','React.js','Node.js & Express','Databases (SQL/MongoDB)','REST APIs & Auth','Deployment & DevOps']
  },
  {
    id:'java', icon:'☕', title:'Java', desc:'Master Java programming from OOP fundamentals to Spring Boot enterprise applications.',
    difficulty:'Intermediate', time:'5 months', xp:2200, cert:true,
    modules:['Java Basics & OOP','Collections & Generics','Exception Handling','Multithreading','Spring Boot','JDBC & JPA','Microservices','Testing with JUnit']
  },
  {
    id:'python', icon:'🐍', title:'Python', desc:'Learn Python from basics to advanced automation, scripting, APIs and data science.',
    difficulty:'Beginner', time:'4 months', xp:2000, cert:true,
    modules:['Python Basics','Functions & Modules','OOP in Python','File Handling','APIs with Flask','Data with Pandas','NumPy & Matplotlib','Automation & Scripting']
  },
  {
    id:'c', icon:'🔵', title:'C Programming', desc:'Master procedural programming with C — memory management, pointers, and systems.',
    difficulty:'Intermediate', time:'3 months', xp:1800, cert:true,
    modules:['C Basics & I/O','Control Flow','Functions & Pointers','Arrays & Strings','Memory Management','Structures & Unions','File I/O','System Programming']
  },
  {
    id:'cpp', icon:'⚡', title:'C++', desc:'Advanced C++ with STL, templates, OOP, and competitive programming patterns.',
    difficulty:'Advanced', time:'5 months', xp:2600, cert:true,
    modules:['C++ Fundamentals','OOP & Inheritance','Templates & Generics','STL Containers','Smart Pointers','Concurrency','Design Patterns','Competitive Programming']
  },
  {
    id:'js', icon:'💛', title:'JavaScript', desc:'Deep-dive into modern JS — ES6+, async/await, closures, prototypes, and beyond.',
    difficulty:'Beginner', time:'4 months', xp:2000, cert:true,
    modules:['JS Fundamentals','DOM & Events','ES6+ Features','Async & Promises','Fetch API','Closures & Scope','OOP in JS','Testing with Jest']
  },
  {
    id:'react', icon:'⚛️', title:'React.js', desc:'Build production-grade UIs with React, hooks, state management, and Next.js.',
    difficulty:'Intermediate', time:'4 months', xp:2200, cert:true,
    modules:['React Basics','Components & Props','Hooks (useState/useEffect)','Context API','React Router','Redux Toolkit','Next.js','Performance Optimization']
  },
  {
    id:'nodejs', icon:'🟢', title:'Node.js', desc:'Build scalable backend services with Node.js, Express, REST APIs and databases.',
    difficulty:'Intermediate', time:'4 months', xp:2200, cert:true,
    modules:['Node.js Basics','Express Framework','Routing & Middleware','Authentication (JWT)','MySQL & Mongoose','REST API Design','WebSockets','Deployment']
  },
  {
    id:'sql', icon:'🗄️', title:'SQL & Databases', desc:'Master relational databases, SQL queries, indexing, normalization and performance.',
    difficulty:'Beginner', time:'2 months', xp:1400, cert:true,
    modules:['SQL Basics','SELECT & Filtering','Joins & Aggregations','Subqueries','Indexing','Normalization','Transactions','Query Optimization']
  },
  {
    id:'ai', icon:'🤖', title:'Artificial Intelligence', desc:'AI fundamentals — search algorithms, knowledge representation, planning and agents.',
    difficulty:'Advanced', time:'6 months', xp:3000, cert:true,
    modules:['AI Foundations','Search Algorithms','Constraint Satisfaction','Knowledge Representation','Bayesian Networks','NLP Basics','Computer Vision Intro','Ethical AI']
  },
  {
    id:'ml', icon:'📈', title:'Machine Learning', desc:'Train models, understand algorithms, and deploy ML solutions end-to-end.',
    difficulty:'Advanced', time:'6 months', xp:3200, cert:true,
    modules:['Math & Stats Foundations','Supervised Learning','Unsupervised Learning','Neural Networks','Model Evaluation','Feature Engineering','MLOps & Deployment','AutoML']
  },
  {
    id:'ds', icon:'📊', title:'Data Science', desc:'From data wrangling to storytelling — the full data science lifecycle.',
    difficulty:'Intermediate', time:'5 months', xp:2800, cert:true,
    modules:['Python for Data Science','Pandas & NumPy','Data Visualization','Statistics','Machine Learning Basics','SQL for Analysis','Big Data & Spark','Dashboards (Tableau/PowerBI)']
  },
  {
    id:'cyber', icon:'🔒', title:'Cyber Security', desc:'Ethical hacking, penetration testing, cryptography and security operations.',
    difficulty:'Advanced', time:'7 months', xp:3400, cert:true,
    modules:['Networking & Protocols','Linux Administration','OWASP Top 10','Pen Testing Basics','Cryptography','SOC & SIEM','Cloud Security','Threat Intelligence']
  },
  {
    id:'cloud', icon:'☁️', title:'Cloud Computing', desc:'Deploy, scale and manage infrastructure on AWS, GCP and Azure.',
    difficulty:'Intermediate', time:'5 months', xp:2600, cert:true,
    modules:['Cloud Fundamentals','AWS Core Services','Azure / GCP Overview','IAM & Security','Serverless Functions','Containers & Kubernetes','CI/CD Pipelines','Cloud Architecture']
  },
  {
    id:'devops', icon:'🔄', title:'DevOps', desc:'Automate builds, deployments, monitoring and infrastructure with DevOps practices.',
    difficulty:'Intermediate', time:'5 months', xp:2600, cert:true,
    modules:['Linux & Bash Scripting','Git & GitHub Actions','Docker','Kubernetes','CI/CD (Jenkins / GitHub Actions)','Terraform (IaC)','Monitoring & Alerting','SRE Principles']
  },
  {
    id:'blockchain', icon:'⛓️', title:'Blockchain', desc:'Build decentralized apps and smart contracts on Ethereum and Solana.',
    difficulty:'Advanced', time:'5 months', xp:2800, cert:true,
    modules:['Blockchain Fundamentals','Ethereum & Solidity','Smart Contracts','DeFi Protocols','NFTs','Web3.js & Ethers.js','Solana Basics','Security & Auditing']
  },
  {
    id:'uiux', icon:'🎨', title:'UI/UX Design', desc:'Master user research, wireframing, prototyping and design systems with Figma.',
    difficulty:'Beginner', time:'4 months', xp:1800, cert:true,
    modules:['Design Thinking','User Research','Wireframing','Prototyping with Figma','Design Systems','Accessibility','Usability Testing','Portfolio Building']
  },
  {
    id:'dsa', icon:'🌳', title:'DSA', desc:'Master data structures and algorithms for FAANG and competitive programming.',
    difficulty:'Intermediate', time:'6 months', xp:3000, cert:true,
    modules:['Arrays & Strings','Linked Lists','Stacks & Queues','Trees & Graphs','Sorting & Searching','Dynamic Programming','Greedy Algorithms','Bit Manipulation']
  },
  {
    id:'dbms', icon:'📁', title:'DBMS', desc:'Database management systems theory, transactions, query processing and optimization.',
    difficulty:'Intermediate', time:'3 months', xp:1800, cert:true,
    modules:['ER Diagrams','Relational Model','SQL & DDL','Normalization (1NF–BCNF)','Transactions & ACID','Concurrency Control','Recovery Systems','NoSQL Intro']
  },
  {
    id:'os', icon:'💽', title:'Operating Systems', desc:'Processes, memory management, file systems and OS design from scratch.',
    difficulty:'Intermediate', time:'3 months', xp:2000, cert:true,
    modules:['OS Fundamentals','Process Management','CPU Scheduling','Memory Management','Virtual Memory','File Systems','I/O Systems','Deadlocks']
  },
  {
    id:'cn', icon:'🌍', title:'Computer Networks', desc:'OSI/TCP-IP model, protocols, routing, switching and network security.',
    difficulty:'Intermediate', time:'3 months', xp:1800, cert:true,
    modules:['Network Models (OSI/TCP-IP)','Physical & Data Link Layer','IP Addressing & Subnetting','Routing Protocols','TCP vs UDP','DNS & HTTP','Firewalls & VPN','Wireshark & Packet Analysis']
  },
  {
    id:'aptitude', icon:'🧮', title:'Aptitude', desc:'Quantitative, logical and verbal aptitude for placement tests and competitive exams.',
    difficulty:'Beginner', time:'2 months', xp:1200, cert:false,
    modules:['Numbers & Arithmetic','Percentages & Ratios','Time, Speed & Distance','Probability & Permutations','Logical Reasoning','Data Interpretation','Verbal Reasoning','Mock Tests']
  },
  {
    id:'interview', icon:'💼', title:'Interview Preparation', desc:'Crack technical and HR interviews at top tech companies with proven strategies.',
    difficulty:'Intermediate', time:'3 months', xp:2000, cert:false,
    modules:['Resume & LinkedIn','Behavioral Questions (STAR)','Technical HR Rounds','System Design Interviews','DSA Interview Questions','Company-Specific Prep','Mock Interviews','Offer Negotiation']
  },
  {
    id:'sysdesign', icon:'🏗️', title:'System Design', desc:'Design scalable, fault-tolerant distributed systems like Netflix, Uber, Twitter.',
    difficulty:'Advanced', time:'4 months', xp:2800, cert:true,
    modules:['Scalability Basics','Load Balancing','Caching Strategies','Database Sharding','CAP Theorem','Microservices','Message Queues (Kafka/RabbitMQ)','Case Studies']
  },
];

// ── Progress tracking ──────────────────────────────────────────
let progressCache = {};

async function loadAllProgress() {
  for (const rm of ALL_ROADMAPS) {
    try {
      const data = await apiFetch('/api/user/progress/' + rm.id);
      if (data.success && data.progress) {
        progressCache[rm.id] = {};
        data.progress.forEach(p => {
          progressCache[rm.id][p.node_id] = p.completed === 1 || p.completed === true;
        });
      }
    } catch (e) {
      progressCache[rm.id] = {};
    }
  }
  renderRoadmaps();
}

function getRmProgress(id) {
  const saved = progressCache[id] || {};
  const total = ALL_ROADMAPS.find(r => r.id === id)?.modules.length || 1;
  const done = Object.values(saved).filter(Boolean).length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

// ── Certificate Generation ──────────────────────────────────────
function triggerCertificateCompletion(rm) {
  const certs = JSON.parse(localStorage.getItem('edunet_certs_' + session?.username) || '[]');
  if (!certs.some(c => c.roadmapId === rm.id)) {
    const cert = {
      id: 'cert_' + rm.id + '_' + Date.now().toString().slice(-4),
      roadmapId: rm.id,
      roadmapTitle: rm.title,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      hash: 'EDUNET-' + Math.random().toString(36).substring(2, 10).toUpperCase()
    };
    certs.push(cert);
    localStorage.setItem('edunet_certs_' + session?.username, JSON.stringify(certs));
    showToast('🏆 Congratulations! You have earned a Certificate for completing ' + rm.title + '! View it on your Certificates page.', 'success', 6000);
    addXP(500);
  }
}

// ── Render Roadmaps ────────────────────────────────────────────
function renderRoadmaps(filter = 'all', q = '') {
  const grid = document.getElementById('roadmapsGrid');
  if (!grid) return;
  const filtered = ALL_ROADMAPS.filter(r => {
    if (filter !== 'all' && r.difficulty !== filter) return false;
    if (q && !r.title.toLowerCase().includes(q) && !r.desc.toLowerCase().includes(q)) return false;
    return true;
  });
  grid.innerHTML = '';
  if (!filtered.length) {
    grid.innerHTML = '<p style="color:var(--mist);padding:2rem;grid-column:1/-1;">No roadmaps match your filter.</p>';
    return;
  }
  filtered.forEach(rm => {
    const prog = getRmProgress(rm.id);
    const card = document.createElement('div');
    card.className = 'roadmap-card';
    const diffColor = rm.difficulty === 'Beginner' ? 'badge-green' : rm.difficulty === 'Intermediate' ? 'badge-blue' : 'badge-accent';
    card.innerHTML = `
      <div class="roadmap-card-header">
        <div class="roadmap-card-icon">${rm.icon}</div>
        <div class="roadmap-card-meta">
          <h3>${rm.title}</h3>
          <p>${rm.desc}</p>
        </div>
      </div>
      <div class="rp-info"><span>${prog.done}/${rm.modules.length} modules</span><span class="rp-pct">${prog.pct}%</span></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${prog.pct}%;"></div></div>
      <div class="roadmap-card-stats">
        <div class="roadmap-stat"><div class="roadmap-stat-label">Time</div><div class="roadmap-stat-value">${rm.time}</div></div>
        <div class="roadmap-stat"><div class="roadmap-stat-label">XP</div><div class="roadmap-stat-value">+${rm.xp}</div></div>
        <div class="roadmap-stat"><div class="roadmap-stat-label">Difficulty</div><div class="roadmap-stat-value"><span class="badge ${diffColor}">${rm.difficulty}</span></div></div>
        <div class="roadmap-stat"><div class="roadmap-stat-label">Certificate</div><div class="roadmap-stat-value">${rm.cert ? '🏆 Yes' : '—'}</div></div>
      </div>
      <button class="btn btn-primary btn-sm" style="width:100%;justify-content:center;margin-top:.25rem;">
        ${prog.pct > 0 ? '▶ Continue' : '→ Start Roadmap'}
      </button>
    `;
    card.querySelector('button').addEventListener('click', () => openDrawer(rm));
    card.addEventListener('click', e => { if (e.target.tagName !== 'BUTTON') openDrawer(rm); });
    grid.appendChild(card);
  });
}

// ── Drawer ─────────────────────────────────────────────────────
const drawer = document.getElementById('roadmapDrawer');
const drawerTitle = document.getElementById('drawerTitle');
const drawerBody = document.getElementById('drawerBody');
document.getElementById('drawerClose')?.addEventListener('click', () => drawer.classList.remove('open'));

function openDrawer(rm) {
  drawerTitle.textContent = rm.icon + ' ' + rm.title;
  const prog = getRmProgress(rm.id);
  const saved = progressCache[rm.id] || {};

  drawerBody.innerHTML = `
    <p style="font-size:13px;color:var(--mist);line-height:1.7;margin-bottom:1.25rem;">${rm.desc}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:1.25rem;">
      <div style="background:var(--abyss-2);border:1px solid var(--border);border-radius:var(--r-sm);padding:.85rem;">
        <div style="font-size:10px;color:var(--mist-dim);text-transform:uppercase;margin-bottom:.3rem;font-family:var(--font-mono);">Duration</div>
        <div style="font-weight:600;">${rm.time}</div>
      </div>
      <div style="background:var(--abyss-2);border:1px solid var(--border);border-radius:var(--r-sm);padding:.85rem;">
        <div style="font-size:10px;color:var(--mist-dim);text-transform:uppercase;margin-bottom:.3rem;font-family:var(--font-mono);">XP Reward</div>
        <div style="font-weight:600;color:var(--accent);">+${rm.xp} XP</div>
      </div>
    </div>
    <div style="background:var(--abyss-2);border:1px solid var(--border);border-radius:var(--r-sm);padding:1rem;margin-bottom:1.25rem;">
      <div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--mist);margin-bottom:.5rem;"><span>Progress</span><span style="color:var(--accent);font-weight:700;">${prog.pct}%</span></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${prog.pct}%;"></div></div>
      <div style="font-size:11px;color:var(--mist-dim);margin-top:.4rem;">${prog.done} of ${rm.modules.length} modules completed</div>
    </div>
    <h4 style="font-size:14px;margin-bottom:.85rem;">Modules</h4>
    <div id="drawerModules" style="display:flex;flex-direction:column;gap:.6rem;margin-bottom:1.5rem;"></div>
    <button class="btn btn-primary btn-full" id="drawerContinueBtn" style="justify-content:center;">
      ${prog.pct > 0 ? '▶ Continue Learning' : '→ Start Roadmap'}
    </button>
    ${rm.cert ? '<div style="margin-top:.75rem;text-align:center;font-size:12px;color:var(--emerald);">🏆 Earns a verified certificate on completion</div>' : ''}
  `;

  const modulesContainer = document.getElementById('drawerModules');
  rm.modules.forEach((mod, i) => {
    const isDone = saved['m' + i] === true;
    const div = document.createElement('label');
    div.style.cssText = 'display:flex;align-items:center;gap:12px;padding:.9rem;background:var(--abyss-2);border:1px solid var(--border);border-radius:var(--r-sm);cursor:pointer;transition:border-color .2s;';
    div.innerHTML = `
      <input type="checkbox" ${isDone ? 'checked' : ''} style="accent-color:var(--accent);width:16px;height:16px;flex-shrink:0;" data-mi="${i}">
      <div style="flex:1;">
        <div style="font-size:13.5px;font-weight:500;${isDone ? 'text-decoration:line-through;color:var(--mist-dim);' : ''}">${i + 1}. ${mod}</div>
      </div>
      <span class="badge ${isDone ? 'badge-green' : 'badge-muted'}">${isDone ? 'Done' : 'Todo'}</span>
    `;
    div.querySelector('input').addEventListener('change', async function () {
      const mi = this.getAttribute('data-mi');
      const checked = this.checked;
      if (!progressCache[rm.id]) progressCache[rm.id] = {};
      progressCache[rm.id]['m' + mi] = checked;

      try {
        await apiFetch('/api/progress/' + rm.id, {
          method: 'POST',
          body: JSON.stringify({ nodeId: 'm' + mi, completed: checked })
        });
      } catch (err) {
        showToast('Sync error: ' + err.message, 'warning');
      }

      if (checked) addXP(50);
      const newProg = getRmProgress(rm.id);
      if (newProg.pct === 100) {
        triggerCertificateCompletion(rm);
      }
      openDrawer(rm);
      renderRoadmaps();
    });
    modulesContainer.appendChild(div);
  });

  document.getElementById('drawerContinueBtn')?.addEventListener('click', () => showToast('Keep going! Track your progress in each module.', 'info'));
  drawer.classList.add('open');
}

// ── Filters & Search ───────────────────────────────────────────
document.querySelectorAll('#rmFilterRow .filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('#rmFilterRow .filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderRoadmaps(this.getAttribute('data-diff'), document.getElementById('rmSearchBar')?.value || '');
  });
});
document.getElementById('rmSearchBar')?.addEventListener('input', function () {
  const activeFilter = document.querySelector('#rmFilterRow .filter-btn.active')?.getAttribute('data-diff') || 'all';
  renderRoadmaps(activeFilter, this.value);
});

// Load progress initially
loadAllProgress();
