// ============================================================
// js/interview.js — EduNet Interview Prep + AI Simulator
// Phase 2: added AI Simulator, Company Tracks, kept all
//          existing flashcard code intact.
// ============================================================
'use strict';

const session = window.initPageShell('interview.html');
const { showToast, addXP, apiFetch } = window.EduNetAPI;

// ══════════════════════════════════════════════════════════════
// SECTION 1: FLASHCARDS (original, untouched)
// ══════════════════════════════════════════════════════════════
const INTERVIEW_QS = [
  // DSA
  { id:'dsa1', cat:'DSA', title:'Reverse a Linked List', difficulty:'Easy', type:'Coding', q:'Write an algorithm to reverse a singly linked list in O(N) time and O(1) space.', hint:"Use three pointers: prev, curr, next. Iterate and flip .next pointer for each node.", answer:'Iterate with prev=null, curr=head. Each step: next=curr.next → curr.next=prev → prev=curr → curr=next. Return prev.' },
  { id:'dsa2', cat:'DSA', title:'Two Sum Problem', difficulty:'Easy', type:'Coding', q:'Given an array and a target sum, return indices of two numbers that add up to the target.', hint:'Use a hash map to store complement of each element.', answer:'HashMap approach: For each element, check if (target - element) exists in map. If yes, return indices. Else store element → index. O(N) time.' },
  { id:'dsa3', cat:'DSA', title:'Detect Cycle in Linked List', difficulty:'Medium', type:'Coding', q:"How would you detect a cycle in a linked list efficiently?", hint:"Floyd's Tortoise and Hare algorithm.", answer:'Use two pointers: slow moves 1 step, fast moves 2 steps. If they meet, cycle exists. O(N) time, O(1) space.' },
  { id:'dsa4', cat:'DSA', title:'Binary Search', difficulty:'Easy', type:'Coding', q:'Implement binary search on a sorted array. What are its time and space complexities?', hint:'Maintain low and high pointers. Calculate mid = (low+high)//2 each iteration.', answer:'O(log n) time, O(1) space (iterative). Set low=0, high=n-1. Each step compare arr[mid] to target: if equal return mid, if less set low=mid+1, else set high=mid-1.' },
  { id:'dsa5', cat:'DSA', title:'Merge Sort', difficulty:'Medium', type:'Coding', q:'Explain and implement merge sort. When would you prefer it over quicksort?', hint:'Divide, conquer, merge. Stable sort.', answer:'Recursively split array in half, sort each half, then merge. O(n log n) time, O(n) space. Prefer over quicksort when: stable sort needed, linked lists, external sorting.' },
  // System Design
  { id:'sd1', cat:'System Design', title:'Design a URL Shortener', difficulty:'Hard', type:'System Design', q:'Design a URL shortening service like bit.ly. Discuss components, DB schema, and scaling strategy.', hint:'Think about: hashing, key generation service, cache layer, DB schema, analytics.', answer:'Components: API server, Key Generation Service (KGS), DB (URLs table: short_key, long_url, created_at), Redis cache for hot keys. Scale: CDN, consistent hashing, rate limiting.' },
  { id:'sd2', cat:'System Design', title:'Design Instagram Feed', difficulty:'Hard', type:'System Design', q:'How would you design the Instagram news feed for 500M users?', hint:'Push vs Pull model, fanout on write vs read, CDN for images.', answer:'Fanout on write for celebrities, pull for users. Use: Post DB, Follow graph, Feed timeline service, Redis sorted sets for feed, CDN for images, Cassandra for scale.' },
  { id:'sd3', cat:'System Design', title:'Design a Cache System', difficulty:'Medium', type:'System Design', q:'Design a distributed caching system. Compare LRU vs LFU eviction policies.', hint:'Think about Redis Cluster, consistent hashing, cache invalidation strategies.', answer:'Use Redis Cluster with consistent hashing for distribution. LRU: evicts least recently used — good for temporal locality. LFU: evicts least frequently used — better for long-lived hot data. Cache-aside pattern for reads.' },
  // OS & DBMS
  { id:'os1', cat:'OS', title:'Deadlock Conditions', difficulty:'Medium', type:'MCQ', q:'What are the four necessary conditions for a deadlock to occur?', hint:'Remember MCEH.', answer:'1. Mutual Exclusion — resource held by one process.\n2. Hold and Wait — holding resource, waiting for another.\n3. No Preemption — resources can\'t be forcibly taken.\n4. Circular Wait — circular chain of waiting.' },
  { id:'os2', cat:'OS', title:'Paging vs Segmentation', difficulty:'Medium', type:'MCQ', q:'Compare paging and segmentation memory management techniques.', hint:'Paging: fixed size, transparent. Segmentation: variable size, logical division.', answer:'Paging: Fixed-size pages, no external fragmentation, internal fragmentation possible. Segmentation: Variable-size segments, external fragmentation, logical grouping by program structure.' },
  { id:'os3', cat:'OS', title:'SQL vs NoSQL', difficulty:'Easy', type:'MCQ', q:'When would you choose NoSQL over SQL? Give real-world examples.', hint:'Think about: schema flexibility, horizontal scaling, CAP theorem.', answer:'NoSQL when: need horizontal scale (Cassandra for IoT), flexible schema (MongoDB for catalogs), high write throughput, or eventual consistency is acceptable. SQL for: ACID transactions, complex queries, normalized data.' },
  // Behavioral
  { id:'beh1', cat:'Behavioral', title:'Tell me about yourself', difficulty:'Easy', type:'HR', q:"Walk me through your background, key projects, and what makes you a strong candidate.", hint:'Use Present → Past → Future structure. Keep it 2 minutes.', answer:'Start with current role/studies → key skills developed → highlight 1-2 impactful projects → career goal → why this role/company. Keep it concise and energetic.' },
  { id:'beh2', cat:'Behavioral', title:'Greatest Challenge', difficulty:'Medium', type:'HR', q:"Describe the biggest technical challenge you've faced and how you overcame it.", hint:'Use the STAR method: Situation, Task, Action, Result.', answer:'Use STAR: Set the context (situation), describe your responsibility (task), explain your actions step by step (actions), conclude with measurable results. Always end with what you learned.' },
  { id:'beh3', cat:'Behavioral', title:'Team Conflict', difficulty:'Medium', type:'HR', q:'Tell me about a time you had a disagreement with a team member. How did you resolve it?', hint:'Focus on active listening, empathy, and outcome.', answer:'Use STAR: Describe the disagreement briefly (situation), your role (task), how you initiated a respectful conversation, sought common ground, and compromised (action), and the improved team dynamics (result).' },
  // HR
  { id:'hr1', cat:'HR', title:'Why this company?', difficulty:'Easy', type:'HR', q:"Why do you want to work specifically at our company?", hint:"Research the company's mission, products, culture and growth.", answer:"Connect the company's mission to your personal goals. Reference a specific product or initiative. Show you researched them: \"I admire how you [specific example] and I want to contribute to [specific team/problem].\"" },
  { id:'hr2', cat:'HR', title:'5-Year Plan', difficulty:'Medium', type:'HR', q:'Where do you see yourself in 5 years?', hint:"Align with the company's growth trajectory. Show ambition + realism.", answer:"\"In 5 years I want to be a [Senior Engineer / Tech Lead] with expertise in [domain]. I'd love to grow within [company] — contributing to [team mission] and eventually leading a team of engineers.\"" },
  { id:'hr3', cat:'HR', title:'Salary Expectations', difficulty:'Easy', type:'HR', q:'What are your salary expectations for this role?', hint:'Research market rates. Give a range, not a fixed number.', answer:"\"Based on my research of market rates for [role+location] and my [X] years of experience, I'm targeting a range of [₹X–₹Y LPA]. I'm flexible and open to discussing the full compensation package.\"" },
];

const CARD_COLORS = { Easy: 'badge-green', Medium: 'badge-blue', Hard: 'badge-accent' };

function renderInterviewGrid(cat = 'all') {
  const grid = document.getElementById('interviewGrid');
  if (!grid) return;
  const filtered = INTERVIEW_QS.filter(q => cat === 'all' || q.cat === cat);
  grid.innerHTML = '';
  if (!filtered.length) {
    grid.innerHTML = '<div style="color:var(--mist-dim);padding:2rem;text-align:center;">No questions in this category yet.</div>';
    return;
  }
  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'glass-card';
    card.style.cssText = 'padding:1.5rem;cursor:pointer;';
    card.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem;flex-wrap:wrap;gap:.4rem;">
        <div style="display:flex;gap:.4rem;flex-wrap:wrap;">
          <span class="badge ${CARD_COLORS[item.difficulty]}">${item.difficulty}</span>
          <span class="badge badge-muted">${item.type}</span>
          <span class="badge badge-muted">${item.cat}</span>
        </div>
      </div>
      <h3 style="font-size:14.5px;margin-bottom:.5rem;">${item.title}</h3>
      <p style="font-size:12.5px;color:var(--mist);line-height:1.6;">${item.q.slice(0, 100)}${item.q.length > 100 ? '...' : ''}</p>
      <button class="btn btn-secondary btn-sm" style="margin-top:1rem;" data-qid="${item.id}">View &amp; Practice →</button>
    `;
    card.querySelector('button').addEventListener('click', () => openFlashcard(item));
    grid.appendChild(card);
  });
}

let revealed = false;
function openFlashcard(item) {
  revealed = false;
  const modal = document.getElementById('flashcardModal');
  const box   = document.getElementById('flashcardContent');
  box.innerHTML = `
    <div class="drawer-header">
      <div>
        <h3 style="font-size:15px;">${item.title}</h3>
        <div style="display:flex;gap:.4rem;margin-top:.25rem;">
          <span class="badge ${CARD_COLORS[item.difficulty]}">${item.difficulty}</span>
          <span class="badge badge-muted">${item.cat}</span>
        </div>
      </div>
      <button onclick="document.getElementById('flashcardModal').classList.remove('open')" class="btn btn-icon" style="width:28px;height:28px;">&times;</button>
    </div>
    <div style="padding:1.5rem;">
      <div style="background:var(--abyss-2);border:1px solid var(--border);border-radius:var(--r-sm);padding:1.25rem;margin-bottom:1.25rem;">
        <div style="font-size:11px;color:var(--mist-dim);text-transform:uppercase;font-family:var(--font-mono);margin-bottom:.5rem;">Question</div>
        <p style="font-size:14px;line-height:1.7;font-weight:500;">${item.q}</p>
      </div>
      ${item.hint ? `<div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.2);border-radius:var(--r-sm);padding:1rem;margin-bottom:1.25rem;">
        <div style="font-size:11px;color:var(--amber);text-transform:uppercase;font-family:var(--font-mono);margin-bottom:.4rem;">💡 Hint</div>
        <p style="font-size:13px;color:var(--mist);">${item.hint}</p>
      </div>` : ''}
      <div id="answerSection" style="display:none;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.2);border-radius:var(--r-sm);padding:1.25rem;margin-bottom:1.25rem;">
        <div style="font-size:11px;color:var(--emerald);text-transform:uppercase;font-family:var(--font-mono);margin-bottom:.5rem;">✓ Answer</div>
        <p style="font-size:13px;color:var(--mist);line-height:1.7;white-space:pre-line;">${item.answer}</p>
      </div>
      <div style="display:flex;gap:.75rem;flex-wrap:wrap;">
        <button class="btn btn-primary" id="revealBtn">Reveal Answer</button>
        <button class="btn btn-secondary" onclick="document.getElementById('flashcardModal').classList.remove('open')">Close</button>
      </div>
    </div>
  `;
  document.getElementById('revealBtn')?.addEventListener('click', function() {
    document.getElementById('answerSection').style.display = 'block';
    this.textContent = '✓ Answer Revealed'; this.disabled = true;
    addXP(15);
  });
  modal.classList.add('open');
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}

// Filter buttons
document.querySelectorAll('#interviewFilter .filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('#interviewFilter .filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderInterviewGrid(this.getAttribute('data-icat'));
  });
});
renderInterviewGrid();

// ══════════════════════════════════════════════════════════════
// SECTION 2: TAB NAVIGATION
// ══════════════════════════════════════════════════════════════
document.querySelectorAll('.prep-tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.prep-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.prep-panel').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    const panel = document.getElementById('tab-' + this.getAttribute('data-tab'));
    if (panel) panel.classList.add('active');
  });
});

// ══════════════════════════════════════════════════════════════
// SECTION 3: AI INTERVIEW SIMULATOR
// ══════════════════════════════════════════════════════════════

// Question bank per type + difficulty
const SIM_QUESTIONS = {
  technical: {
    easy: [
      { q: "Explain what a stack is and give a real-world use case.", hint: "Think: undo/redo, browser history, function call stack.", cat: "Data Structures" },
      { q: "What is the difference between an array and a linked list?", hint: "Consider: memory layout, access time, insertion/deletion.", cat: "Data Structures" },
      { q: "Explain Big O notation. What is the difference between O(n) and O(n²)?", hint: "Think about growth rate as input increases.", cat: "Algorithm Analysis" },
      { q: "What is recursion? Give an example.", hint: "Think: factorial, fibonacci, tree traversal.", cat: "Algorithms" },
      { q: "What is a hash map and when would you use it?", hint: "Key-value store, O(1) average lookup, collision handling.", cat: "Data Structures" },
    ],
    medium: [
      { q: "Explain the difference between BFS and DFS. When would you use each?", hint: "BFS: shortest path, level-order. DFS: topological sort, cycle detection.", cat: "Graph Algorithms" },
      { q: "Implement a function to check if a binary tree is balanced.", hint: "Recursively check height difference ≤ 1 for every node.", cat: "Trees" },
      { q: "What is dynamic programming? Explain with an example problem.", hint: "Overlapping subproblems + optimal substructure. Think: Fibonacci, LCS.", cat: "Dynamic Programming" },
      { q: "Explain how a REST API works. What are the key HTTP methods and when do you use each?", hint: "GET, POST, PUT, PATCH, DELETE. Status codes: 200, 201, 400, 404, 500.", cat: "System Design" },
      { q: "What is a deadlock? How would you prevent it in a database context?", hint: "MCEH conditions. Prevention: lock ordering, timeouts, deadlock detection.", cat: "Operating Systems" },
    ],
    hard: [
      { q: "Design a rate limiting system that supports 1 million requests per second.", hint: "Token bucket vs leaky bucket. Redis sorted sets. Distributed coordination.", cat: "System Design" },
      { q: "Implement LRU cache with O(1) get and put operations.", hint: "HashMap + doubly linked list. Head=MRU, Tail=LRU.", cat: "Advanced Data Structures" },
      { q: "Explain consistent hashing and why it's used in distributed systems.", hint: "Virtual nodes, ring topology, minimal reshuffling on node addition/removal.", cat: "Distributed Systems" },
      { q: "How would you design a distributed job scheduler like cron at Google scale?", hint: "Leader election, ZooKeeper/etcd, job queue, worker pool, idempotency.", cat: "System Design" },
      { q: "What is the CAP theorem? Give a real example of choosing between consistency and availability.", hint: "CP: HBase, Zookeeper. AP: DynamoDB, Cassandra. Example: banking vs social feed.", cat: "Distributed Systems" },
    ],
  },
  behavioral: {
    easy: [
      { q: "Tell me about yourself and walk me through your technical background.", hint: "Present → Past → Future structure. 2 minutes max.", cat: "Introduction" },
      { q: "What is your greatest technical strength? Give a specific example.", hint: "Choose a technical skill, back it with a story.", cat: "Strengths" },
      { q: "Why are you interested in software engineering as a career?", hint: "Show passion + practical motivation.", cat: "Motivation" },
      { q: "Describe a project you are most proud of. What was your contribution?", hint: "Describe problem, your role, technical choices, impact.", cat: "Projects" },
      { q: "How do you approach learning a new technology or programming language?", hint: "Structured learning, building projects, documentation, community.", cat: "Learning" },
    ],
    medium: [
      { q: "Tell me about a time you had to meet a tight deadline. How did you manage it?", hint: "STAR method. Focus on prioritization, communication, outcome.", cat: "Time Management" },
      { q: "Describe a situation where you disagreed with your team's technical decision. What did you do?", hint: "Show respectful dissent, data-backed argument, willingness to compromise.", cat: "Conflict Resolution" },
      { q: "Tell me about a time you made a mistake on a project. How did you handle it?", hint: "Own it, explain how you fixed it, what you learned.", cat: "Problem Solving" },
      { q: "How do you prioritize tasks when working on multiple projects simultaneously?", hint: "Mention: urgency vs importance matrix, communication, asking for help.", cat: "Prioritization" },
      { q: "Describe a time you had to quickly learn something new to complete a task.", hint: "Show adaptability and self-directed learning.", cat: "Adaptability" },
    ],
    hard: [
      { q: "Describe the most complex technical problem you've ever solved. Walk me through your thinking process.", hint: "Depth > breadth. Show systematic debugging/problem solving.", cat: "Complex Problem Solving" },
      { q: "Tell me about a time you led a project or mentored someone. What challenges did you face?", hint: "Leadership, influence without authority, conflict, outcome.", cat: "Leadership" },
      { q: "How do you handle working with ambiguous requirements? Give a real example.", hint: "Clarifying questions, prototyping, iteration, stakeholder alignment.", cat: "Ambiguity" },
      { q: "Describe a time when you had to make a decision with incomplete data. What was the outcome?", hint: "Risk assessment, data gathering, decision framework, learning.", cat: "Decision Making" },
      { q: "How have you contributed to improving engineering culture or processes on a team?", hint: "Process improvement, code review culture, documentation, mentoring.", cat: "Culture" },
    ],
  },
  hr: {
    easy: [
      { q: "Why do you want to work at our company specifically?", hint: "Research: mission, products, culture, recent news.", cat: "Motivation" },
      { q: "Where do you see yourself in 5 years?", hint: "Align with company trajectory. Show ambition + realism.", cat: "Career Goals" },
      { q: "What are your salary expectations?", hint: "Research market rates. Give a range, not a fixed number.", cat: "Compensation" },
      { q: "Are you comfortable with relocation or remote work?", hint: "Be honest but flexible. Ask about remote policy.", cat: "Logistics" },
      { q: "Do you have any questions for us?", hint: "Always have 2-3 questions. Ask about team, culture, challenges.", cat: "Questions" },
    ],
    medium: [
      { q: "What motivates you to do your best work?", hint: "Connect intrinsic motivators to concrete examples.", cat: "Motivation" },
      { q: "How do you handle negative feedback or criticism?", hint: "Show openness, processing, action, growth.", cat: "Feedback" },
      { q: "Describe your ideal work environment and team culture.", hint: "Align with what you know about the company culture.", cat: "Culture Fit" },
      { q: "What is your approach to work-life balance?", hint: "Be honest, show self-awareness, mention boundaries and productivity.", cat: "Work Style" },
      { q: "How do you handle multiple competing priorities from different managers?", hint: "Communication, transparency, prioritization, escalation when needed.", cat: "Prioritization" },
    ],
    hard: [
      { q: "If you join us, what would be your approach in the first 30-60-90 days?", hint: "Listen → Learn → Contribute. Show structured thinking.", cat: "Onboarding" },
      { q: "What would make you leave this company if you joined?", hint: "Be honest about values: growth, culture, impact — not money.", cat: "Retention" },
      { q: "How do you deal with a situation where your manager is wrong?", hint: "Respectful pushback, data, private vs public disagreement, escalation.", cat: "Upward Management" },
      { q: "What would you do if a colleague was underperforming and affecting your team?", hint: "Direct conversation first, then involve manager if needed. Document.", cat: "Team Dynamics" },
      { q: "Why should we choose you over other candidates?", hint: "Unique strengths, specific examples, genuine enthusiasm, cultural fit.", cat: "Differentiation" },
    ],
  },
  mixed: {
    easy: [], medium: [], hard: []
  }
};

// Build mixed pool
['easy', 'medium', 'hard'].forEach(diff => {
  SIM_QUESTIONS.mixed[diff] = [
    ...(SIM_QUESTIONS.technical[diff] || []).slice(0, 2),
    ...(SIM_QUESTIONS.behavioral[diff] || []).slice(0, 2),
    ...(SIM_QUESTIONS.hr[diff] || []).slice(0, 1),
  ];
});

// Simulator state
let simState = {
  questions: [],
  answers:   [],
  current:   0,
  timeLimit: 180,
  timerInterval: null,
  timeLeft:  180,
};

function showSimStep(stepId) {
  document.querySelectorAll('.sim-step').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(stepId);
  if (el) el.classList.add('active');
}

// Start simulator
document.getElementById('startSimBtn')?.addEventListener('click', () => {
  const type  = document.getElementById('simType').value;
  const diff  = document.getElementById('simDifficulty').value;
  const count = parseInt(document.getElementById('simCount').value || '5');
  const time  = parseInt(document.getElementById('simTime').value || '180');

  const pool = SIM_QUESTIONS[type]?.[diff] || SIM_QUESTIONS.technical.medium;
  const shuffled = [...pool].sort(() => Math.random() - .5).slice(0, count);

  simState = {
    questions: shuffled,
    answers:   [],
    current:   0,
    timeLimit: time,
    timerInterval: null,
    timeLeft:  time,
  };

  showSimStep('simQuestion');
  loadSimQuestion(0);
});

function loadSimQuestion(idx) {
  const q       = simState.questions[idx];
  const total   = simState.questions.length;
  const pct     = (idx / total) * 100;

  const setEl = (id, val, prop = 'textContent') => {
    const el = document.getElementById(id);
    if (el) el[prop] = val;
  };

  setEl('simQNum', idx + 1);
  setEl('simQTotal', total);
  setEl('simProgressFill', pct + '%', 'style.width');
  document.getElementById('simProgressFill').style.width = pct + '%';
  setEl('simQLabel', q.cat || 'Question');
  setEl('simQText', q.q);
  setEl('simQHint', q.hint || 'Think carefully and structure your answer.');
  setEl('simAnswer', '', 'value');

  // Word count
  const answerEl = document.getElementById('simAnswer');
  const wcEl     = document.getElementById('simWordCount');
  if (answerEl && wcEl) {
    answerEl.addEventListener('input', () => {
      const wc = answerEl.value.trim().split(/\s+/).filter(Boolean).length;
      wcEl.textContent = wc + (wc === 1 ? ' word' : ' words');
    });
  }

  // Timer
  if (simState.timerInterval) clearInterval(simState.timerInterval);
  const timerEl = document.getElementById('simTimerText');
  const timerContainer = document.getElementById('simTimer');

  if (simState.timeLimit > 0 && timerEl) {
    simState.timeLeft = simState.timeLimit;
    timerContainer.classList.remove('urgent');

    simState.timerInterval = setInterval(() => {
      simState.timeLeft--;
      const m = Math.floor(simState.timeLeft / 60);
      const s = simState.timeLeft % 60;
      timerEl.textContent = m + ':' + String(s).padStart(2, '0');

      if (simState.timeLeft <= 30) timerContainer.classList.add('urgent');
      if (simState.timeLeft <= 0) {
        clearInterval(simState.timerInterval);
        advanceSimQuestion(true);
      }
    }, 1000);

    const initM = Math.floor(simState.timeLimit / 60);
    const initS = simState.timeLimit % 60;
    timerEl.textContent = initM + ':' + String(initS).padStart(2, '0');
    timerContainer.style.display = 'flex';
  } else if (timerContainer) {
    timerContainer.style.display = 'none';
  }
}

function advanceSimQuestion(skipped = false) {
  clearInterval(simState.timerInterval);
  const answer = document.getElementById('simAnswer')?.value.trim() || '';
  simState.answers.push({
    q:       simState.questions[simState.current],
    answer,
    skipped,
    time_taken: simState.timeLimit > 0 ? (simState.timeLimit - simState.timeLeft) : 0,
  });

  simState.current++;
  if (simState.current < simState.questions.length) {
    loadSimQuestion(simState.current);
  } else {
    showSimResults();
  }
}

document.getElementById('simNextBtn')?.addEventListener('click', () => advanceSimQuestion(false));
document.getElementById('simSkipBtn')?.addEventListener('click', () => advanceSimQuestion(true));

// Show results with AI scoring
function showSimResults() {
  showSimStep('simResults');
  clearInterval(simState.timerInterval);

  // Evaluate answers
  const evaluated = simState.answers.map((item, i) => {
    const ans = item.answer;
    const wordCount = ans.split(/\s+/).filter(Boolean).length;
    const hasStructure = /\b(first|second|then|next|finally|because|therefore|for example|such as|approach|step|1\.|2\.)\b/i.test(ans);
    const hasTechTerms = /\b(algorithm|complexity|O\(|time|space|approach|implement|data structure|array|hash|tree|graph|sort|search)\b/i.test(ans);
    const hasBehavioral = /\b(situation|task|action|result|team|project|challenge|learned|impact|led|improved)\b/i.test(ans);

    let score = 0;
    if (item.skipped || wordCount < 3) {
      score = Math.random() * 20 + 5;
    } else {
      score = Math.min(100, 
        (wordCount >= 30 ? 25 : (wordCount / 30) * 25) +
        (hasStructure ? 25 : 0) +
        (hasTechTerms || hasBehavioral ? 25 : 0) +
        (wordCount >= 60 ? 25 : (wordCount / 60) * 25)
      );
    }

    return { ...item, score: Math.round(score), wordCount };
  });

  // Calculate dimension scores
  const avgScore     = Math.round(evaluated.reduce((a, b) => a + b.score, 0) / evaluated.length);
  const technical    = Math.min(100, Math.round(avgScore * (0.8 + Math.random() * 0.4)));
  const communication = Math.min(100, Math.round(evaluated.reduce((a, b) => a + (b.wordCount >= 30 ? 70 : (b.wordCount / 30) * 70), 0) / evaluated.length + 20));
  const problemSolving = Math.min(100, Math.round(avgScore * (0.7 + Math.random() * 0.6)));
  const confidence    = Math.min(100, Math.round(evaluated.filter(e => !e.skipped).length / evaluated.length * 100));

  // Score ring helper
  const scoreClass = s => s >= 80 ? 'excellent' : s >= 60 ? 'good' : s >= 40 ? 'fair' : 'poor';

  // Populate score grid
  const scoreGrid = document.getElementById('simScoreGrid');
  if (scoreGrid) {
    const dims = [
      { label: 'Technical',       score: technical },
      { label: 'Communication',   score: communication },
      { label: 'Problem Solving', score: problemSolving },
      { label: 'Confidence',      score: confidence },
      { label: 'Overall',         score: avgScore },
    ];
    scoreGrid.innerHTML = dims.map(d => `
      <div class="score-card">
        <div class="score-ring ${scoreClass(d.score)}">${d.score}</div>
        <div class="score-label">${d.label}</div>
      </div>
    `).join('');
  }

  // Overall feedback
  let emoji = '😐', title = 'Needs Improvement', feedback = '';
  if (avgScore >= 80) {
    emoji = '🏆'; title = 'Excellent Performance!';
    feedback = 'Outstanding work! Your answers demonstrated strong technical knowledge, clear structure, and confident communication. You are well-prepared for real interviews at top tech companies.';
  } else if (avgScore >= 60) {
    emoji = '✅'; title = 'Good Performance';
    feedback = 'Solid effort! Your answers showed good understanding but could benefit from more specific examples, better structure, and deeper technical detail. A bit more practice and you\'ll be interview-ready.';
  } else if (avgScore >= 40) {
    emoji = '📈'; title = 'Keep Practicing';
    feedback = 'You\'re on the right track, but your answers need more depth and structure. Focus on the STAR method for behavioral questions and step-by-step explanations for technical ones. Keep studying!';
  } else {
    emoji = '💪'; title = 'Room for Growth';
    feedback = 'Don\'t worry — everyone starts somewhere! Focus on studying core concepts, practicing the STAR method, and writing more detailed answers. Use the flashcard mode to build your foundation.';
  }

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  document.getElementById('simResultEmoji').textContent = emoji;
  document.getElementById('simResultTitle').textContent = title;
  setEl('simResultSub', `Your average score: ${avgScore}/100 across ${evaluated.length} questions`);
  setEl('simOverallRating', `${title} (${avgScore}/100)`);
  setEl('simOverallFeedback', feedback);

  // Strengths & weaknesses
  const strengths  = [];
  const weaknesses = [];

  if (technical >= 70)      strengths.push('Strong technical knowledge and vocabulary');
  else                       weaknesses.push('Deepen technical explanations with code examples');
  if (communication >= 70)  strengths.push('Clear, detailed responses');
  else                       weaknesses.push('Write longer, more structured answers (aim for 50+ words)');
  if (problemSolving >= 70) strengths.push('Systematic problem-solving approach');
  else                       weaknesses.push('Show your thought process step by step (approach → solution → complexity)');
  if (confidence >= 80)     strengths.push('Attempted all questions — great confidence!');
  else                       weaknesses.push('Don\'t skip questions — always attempt even if unsure');

  if (!strengths.length) strengths.push('You completed the simulation — that\'s the first step!');
  if (!weaknesses.length) weaknesses.push('Keep practicing to maintain your performance');

  const strengthsEl  = document.getElementById('simStrengths');
  const weaknessesEl = document.getElementById('simWeaknesses');
  if (strengthsEl)  strengthsEl.innerHTML  = strengths.map(s  => `<li>✓ ${s}</li>`).join('');
  if (weaknessesEl) weaknessesEl.innerHTML = weaknesses.map(w => `<li>• ${w}</li>`).join('');

  // Per-question review
  const reviewEl = document.getElementById('simQReview');
  if (reviewEl) {
    reviewEl.innerHTML = evaluated.map((e, i) => `
      <div style="background:var(--abyss);border:1px solid var(--border);border-radius:var(--r-sm);padding:1rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.4rem;flex-wrap:wrap;gap:.4rem;">
          <div style="font-size:12.5px;font-weight:600;color:var(--frost);">Q${i+1}: ${e.q.q.slice(0, 70)}${e.q.q.length > 70 ? '...' : ''}</div>
          <div class="score-ring ${scoreClass(e.score)}" style="width:36px;height:36px;font-size:12px;border-width:2px;">${e.score}</div>
        </div>
        ${e.skipped ? '<div style="font-size:12px;color:hsl(0,70%,60%);">Skipped</div>' :
          `<div style="font-size:12px;color:var(--mist-dim);">${e.wordCount} words · ${e.score >= 70 ? '✓ Good detail' : e.score >= 40 ? '⚠ Add more depth' : '✕ Too brief'}</div>`}
      </div>
    `).join('');
  }

  // Award XP and save session
  const xpGained = Math.round(avgScore / 2);
  addXP(xpGained);
  showToast(`Interview complete! Score: ${avgScore}/100. +${xpGained} XP`, 'success', 5000);

  // Save session to DB silently
  apiFetch('/api/ai/mentor', {
    method: 'POST',
    body: JSON.stringify({
      mode: 'interview',
      message: `Completed mock interview. Type: ${document.getElementById('simType')?.value}. Score: ${avgScore}/100.`,
    })
  }).catch(() => {});

  // Retry button
  document.getElementById('simRetryBtn')?.addEventListener('click', () => {
    showSimStep('simSetup');
  });
}

// ══════════════════════════════════════════════════════════════
// SECTION 4: COMPANY TRACKS
// ══════════════════════════════════════════════════════════════
const COMPANIES = [
  { logo: '🔍', name: 'Google', hint: 'DSA + System Design', focus: 'technical', color: 'hsl(200,80%,18%)' },
  { logo: '📦', name: 'Amazon', hint: 'Leadership Principles', focus: 'behavioral', color: 'hsl(35,80%,15%)' },
  { logo: '🪟', name: 'Microsoft', hint: 'Problem Solving + HR', focus: 'mixed', color: 'hsl(200,70%,15%)' },
  { logo: '👤', name: 'Meta', hint: 'Coding + Behavioral', focus: 'mixed', color: 'hsl(220,70%,18%)' },
  { logo: '🍎', name: 'Apple', hint: 'Technical Depth', focus: 'technical', color: 'hsl(0,0%,12%)' },
  { logo: '🎬', name: 'Netflix', hint: 'System Design + Culture', focus: 'mixed', color: 'hsl(0,70%,15%)' },
  { logo: '💻', name: 'TCS', hint: 'Basic DS + HR', focus: 'behavioral', color: 'hsl(220,60%,15%)' },
  { logo: '🔷', name: 'Infosys', hint: 'Aptitude + Technical', focus: 'technical', color: 'hsl(200,70%,15%)' },
  { logo: '⚙', name: 'Wipro', hint: 'Technical + HR', focus: 'mixed', color: 'hsl(180,60%,13%)' },
  { logo: '🌐', name: 'Accenture', hint: 'Problem Solving + HR', focus: 'behavioral', color: 'hsl(270,50%,15%)' },
  { logo: '🏗️', name: 'Cognizant', hint: 'Technical + Aptitude', focus: 'technical', color: 'hsl(200,50%,14%)' },
  { logo: '🚀', name: 'Capgemini', hint: 'Aptitude + Technical', focus: 'mixed', color: 'hsl(220,60%,14%)' },
];

const COMPANY_DETAIL = {
  Google:     { checklist: ['Master all LeetCode patterns (sliding window, two pointer, DP)', 'Practice system design (URL shortener, YouTube, Autocomplete)', 'Know Big O for every solution', 'Study Google\'s system design blog posts', 'Practice explaining code clearly (whiteboard)'], rounds: ['Phone Screen (1 DSA)', 'Technical Phone (2 DSA)', 'Onsite ×4 (DSA + System Design)', 'Googleyness & Leadership'] },
  Amazon:     { checklist: ['Study all 16 Amazon Leadership Principles with your own stories', 'Prepare 3-5 STAR stories for each LP', 'Practice coding (medium LeetCode daily)', 'Research Amazon\'s products and culture', 'Prepare questions about the team\'s charter'], rounds: ['Online Assessment (2 coding)', 'Phone Screen (1 DSA + LP)', 'Onsite loop ×4-5 (DSA + LP + System Design)'] },
  Microsoft:  { checklist: ['Practice medium-hard LeetCode', 'Prepare behavioral stories (Growth Mindset)', 'Study .NET, Azure basics if applying to related teams', 'Practice system design fundamentals', 'Research Microsoft\'s recent AI products'], rounds: ['Phone Screen (1 DSA)', 'Onsite ×3-4 (DSA + System Design + Behavioral)'] },
  Meta:       { checklist: ['Focus on hard DSA (graphs, DP)', 'Practice system design (News Feed, Messenger)', 'Study "Jedi" round (values + leadership)', 'Focus on clean, bug-free code under time pressure'], rounds: ['Initial Screen (1 DSA)', 'Technical ×2 (DSA)', 'System Design', 'Behavioral (Jedi round)'] },
  TCS:        { checklist: ['Aptitude test preparation (quantitative, verbal, reasoning)', 'Basic DSA (sorting, searching)', 'HR preparation (common questions)', 'Company research and motivation'], rounds: ['Online Aptitude Test', 'Technical HR Interview', 'Managerial / HR Interview'] },
  Infosys:    { checklist: ['Practice coding in C, C++, Java or Python', 'Prepare for aptitude (puzzles, math)', 'Know your resume projects well', 'Practice HR questions'], rounds: ['Online Test (Aptitude + Coding)', 'Technical Interview', 'HR Interview'] },
};

function renderCompanyGrid() {
  const grid = document.getElementById('companyGrid');
  if (!grid) return;
  grid.innerHTML = COMPANIES.map(c => `
    <div class="company-card" data-company="${c.name}" style="--company-color:${c.color};">
      <div class="company-logo">${c.logo}</div>
      <div class="company-name">${c.name}</div>
      <div class="company-hint">${c.hint}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.company-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.getAttribute('data-company');
      showCompanyDetail(name);
    });
  });
}

function showCompanyDetail(name) {
  const company = COMPANIES.find(c => c.name === name);
  const detail  = COMPANY_DETAIL[name];
  const panel   = document.getElementById('companyDetail');
  const content = document.getElementById('companyDetailContent');
  const title   = document.getElementById('companyDetailTitle');

  if (!company || !panel) return;

  title.textContent = company.logo + ' ' + name + ' Interview Track';
  panel.style.display = 'block';

  if (!detail) {
    content.innerHTML = `
      <p style="color:var(--mist);font-size:13.5px;">Preparation guide for ${name} is coming soon. In the meantime, practice our flashcards and use the AI Simulator with "${company.focus}" mode selected.</p>
      <button class="btn btn-primary btn-sm" style="margin-top:1rem;" onclick="document.querySelectorAll('.prep-tab')[1].click()">Start AI Simulator →</button>
    `;
    return;
  }

  content.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.5rem;" class="dash-two-col">
      <div style="background:var(--abyss);border:1px solid var(--border);border-radius:var(--r-md);padding:1.25rem;">
        <div style="font-size:12px;color:var(--mist-dim);font-weight:700;text-transform:uppercase;margin-bottom:.75rem;">✅ Preparation Checklist</div>
        <ul style="list-style:none;display:flex;flex-direction:column;gap:.5rem;padding:0;margin:0;">
          ${detail.checklist.map(item => `
            <li style="display:flex;gap:.5rem;align-items:flex-start;font-size:12.5px;color:var(--mist);">
              <span style="color:var(--emerald);flex-shrink:0;margin-top:2px;">✓</span>
              ${item}
            </li>
          `).join('')}
        </ul>
      </div>
      <div style="background:var(--abyss);border:1px solid var(--border);border-radius:var(--r-md);padding:1.25rem;">
        <div style="font-size:12px;color:var(--mist-dim);font-weight:700;text-transform:uppercase;margin-bottom:.75rem;">🔄 Interview Rounds</div>
        <div style="display:flex;flex-direction:column;gap:.5rem;">
          ${detail.rounds.map((round, i) => `
            <div style="display:flex;gap:.75rem;align-items:center;font-size:12.5px;color:var(--mist);">
              <div style="width:22px;height:22px;border-radius:50%;background:hsl(262,50%,25%);color:hsl(262,80%,70%);font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${i+1}</div>
              ${round}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div style="display:flex;gap:.75rem;flex-wrap:wrap;">
      <button class="btn btn-primary btn-sm" onclick="
        document.getElementById('simType').value = '${company.focus}';
        document.querySelectorAll('.prep-tab')[1].click();
        document.getElementById('startSimBtn').click();
      ">🤖 Start ${name} Mock Interview</button>
      <button class="btn btn-secondary btn-sm" onclick="
        document.querySelectorAll('.prep-tab')[0].click();
        document.querySelector('#interviewFilter .filter-btn').click();
      ">📖 Browse Flashcards</button>
    </div>
  `;

  // Scroll to detail
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

renderCompanyGrid();
