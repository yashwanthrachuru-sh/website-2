// ============================================================
// js/interview.js — EduNet Interview Preparation
// ============================================================
'use strict';
const session = window.initPageShell('interview.html');
const { showToast, addXP } = window.EduNetAPI;

const INTERVIEW_QS = [
  // DSA
  { id:'dsa1', cat:'DSA', title:'Reverse a Linked List', difficulty:'Easy', type:'Coding', q:'Write an algorithm to reverse a singly linked list in O(N) time and O(1) space.', hint:'Use three pointers: prev, curr, next. Iterate and flip .next pointer for each node.', answer:'Iterate with prev=null, curr=head. Each step: next=curr.next → curr.next=prev → prev=curr → curr=next. Return prev.' },
  { id:'dsa2', cat:'DSA', title:'Two Sum Problem', difficulty:'Easy', type:'Coding', q:'Given an array and a target sum, return indices of two numbers that add up to the target.', hint:'Use a hash map to store complement of each element.', answer:'HashMap approach: For each element, check if (target - element) exists in map. If yes, return indices. Else store element → index. O(N) time.' },
  { id:'dsa3', cat:'DSA', title:'Detect Cycle in Linked List', difficulty:'Medium', type:'Coding', q:'How would you detect a cycle in a linked list efficiently?', hint:'Floyd\'s Tortoise and Hare algorithm.', answer:'Use two pointers: slow moves 1 step, fast moves 2 steps. If they meet, cycle exists. O(N) time, O(1) space.' },
  // System Design
  { id:'sd1', cat:'System Design', title:'Design a URL Shortener', difficulty:'Hard', type:'System Design', q:'Design a URL shortening service like bit.ly. Discuss components, DB schema, and scaling strategy.', hint:'Think about: hashing, key generation service, cache layer, DB schema, analytics.', answer:'Components: API server, Key Generation Service (KGS), DB (URLs table: short_key, long_url, created_at), Redis cache for hot keys. Scale: CDN, consistent hashing, rate limiting.' },
  { id:'sd2', cat:'System Design', title:'Design Instagram Feed', difficulty:'Hard', type:'System Design', q:'How would you design the Instagram news feed for 500M users?', hint:'Push vs Pull model, fanout on write vs read, CDN for images.', answer:'Fanout on write for celebrities, pull for users. Use: Post DB, Follow graph, Feed timeline service, Redis sorted sets for feed, CDN for images, Cassandra for scale.' },
  // OS
  { id:'os1', cat:'OS', title:'Deadlock Conditions', difficulty:'Medium', type:'MCQ', q:'What are the four necessary conditions for a deadlock to occur?', hint:'Remember MCEH.', answer:'1. Mutual Exclusion — resource held by one process.\n2. Hold and Wait — holding resource, waiting for another.\n3. No Preemption — resources can\'t be forcibly taken.\n4. Circular Wait — circular chain of waiting.' },
  { id:'os2', cat:'OS', title:'Paging vs Segmentation', difficulty:'Medium', type:'MCQ', q:'Compare paging and segmentation memory management techniques.', hint:'Paging: fixed size, transparent. Segmentation: variable size, logical division.', answer:'Paging: Fixed-size pages, no external fragmentation, internal fragmentation possible. Segmentation: Variable-size segments, external fragmentation, logical grouping by program structure.' },
  // Behavioral
  { id:'beh1', cat:'Behavioral', title:'Tell me about yourself', difficulty:'Easy', type:'HR', q:'Walk me through your background, key projects, and what makes you a strong candidate.', hint:'Use Present → Past → Future structure. Keep it 2 minutes.', answer:'Start with current role/studies → key skills developed → highlight 1-2 impactful projects → career goal → why this role/company. Keep it concise and energetic.' },
  { id:'beh2', cat:'Behavioral', title:'Greatest Challenge', difficulty:'Medium', type:'HR', q:'Describe the biggest technical challenge you\'ve faced and how you overcame it.', hint:'Use the STAR method: Situation, Task, Action, Result.', answer:'Use STAR: Set the context (situation), describe your responsibility (task), explain your actions step by step (actions), conclude with measurable results. Always end with what you learned.' },
  // HR
  { id:'hr1', cat:'HR', title:'Why this company?', difficulty:'Easy', type:'HR', q:'Why do you want to work specifically at our company?', hint:'Research the company\'s mission, products, culture and growth.', answer:'Connect the company\'s mission to your personal goals. Reference a specific product or initiative. Show you researched them: "I admire how you [specific example] and I want to contribute to [specific team/problem]."' },
  { id:'hr2', cat:'HR', title:'5-Year Plan', difficulty:'Medium', type:'HR', q:'Where do you see yourself in 5 years?', hint:'Align with the company\'s growth trajectory. Show ambition + realism.', answer:'"In 5 years I want to be a [Senior Engineer / Tech Lead] with expertise in [domain]. I\'d love to grow within [company] — contributing to [team mission] and eventually leading a team of engineers."' },
];

const CARD_COLORS = { Easy: 'badge-green', Medium: 'badge-blue', Hard: 'badge-accent' };

function renderInterviewGrid(cat = 'all') {
  const grid = document.getElementById('interviewGrid');
  if (!grid) return;
  const filtered = INTERVIEW_QS.filter(q => cat === 'all' || q.cat === cat);
  grid.innerHTML = '';
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
      <button class="btn btn-secondary btn-sm" style="margin-top:1rem;" data-qid="${item.id}">View & Practice →</button>
    `;
    card.querySelector('button').addEventListener('click', () => openFlashcard(item));
    grid.appendChild(card);
  });
}

let revealed = false;

function openFlashcard(item) {
  revealed = false;
  const modal = document.getElementById('flashcardModal');
  const box = document.getElementById('flashcardContent');
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

document.querySelectorAll('#interviewFilter .filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('#interviewFilter .filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderInterviewGrid(this.getAttribute('data-icat'));
  });
});

renderInterviewGrid();
