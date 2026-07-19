// ============================================================
// js/ai-tools.js — EduNet Internal AI Tools Suite
// ============================================================
// All tools work INSIDE EduNet. No external redirects.
// Every tool uses /api/ai/mentor with user context for
// personalized, context-aware responses.
// ============================================================
'use strict';
const session = window.initPageShell('ai-tools.html');
const { apiFetch, showToast, addXP } = window.EduNetAPI;

// ── Internal AI Tool Definitions ───────────────────────────────
const TOOLS_DATA = [
  {
    id: 'mentor',
    name: 'AI Coding Mentor',
    emoji: '🧑‍🏫',
    category: 'Learning',
    desc: 'Your personal coding tutor — explains concepts in plain English, gives analogies, walks through code line by line, and adapts to your learning pace.',
    features: ['Context-aware explanations', 'Code walkthroughs', 'Analogies & examples', 'Adapts to your XP'],
    mode: 'explain',
    placeholder: 'Ask anything: "Explain recursion", "What is O(n log n)?", "How does this code work?"',
    quickActions: ['Explain this concept simply', 'Show me a real-world example', 'What\'s the time complexity?', 'Walk me through line by line']
  },
  {
    id: 'interview',
    name: 'Interview Assistant',
    emoji: '💼',
    category: 'Interview',
    desc: 'Generate and practice interview questions for your current lesson — covering conceptual, coding, system design, and behavioral rounds.',
    features: ['8-15 personalized questions', 'Model answers included', 'Difficulty levels', 'Follow-up questions'],
    mode: 'interview_questions',
    placeholder: 'Type "generate" to get interview questions, or ask a specific question like "What are common React interview questions?"',
    quickActions: ['Generate interview questions for this topic', 'What are behavioral questions I should prepare?', 'Give me a system design question', 'How do I answer "Tell me about yourself"?']
  },
  {
    id: 'career',
    name: 'Career Coach',
    emoji: '🎯',
    category: 'Career',
    desc: 'Personalized career guidance based on your roadmap progress, XP, and learning history. Get job market insights, salary data, and a custom roadmap to your dream job.',
    features: ['Personalized career path', 'Salary insights', 'Job market analysis', 'Action plans'],
    mode: 'career_coaching',
    placeholder: 'Ask: "What jobs can I apply for now?", "How do I become a backend developer?", "What skills should I learn next?"',
    quickActions: ['What jobs match my current skills?', 'Give me a 6-month career plan', 'What salary can I expect?', 'How do I transition to tech?']
  },
  {
    id: 'resume',
    name: 'Resume Assistant',
    emoji: '📄',
    category: 'Career',
    desc: 'AI-powered resume review and builder. Get ATS optimization tips, project description templates, and a tailored resume for your target role.',
    features: ['ATS optimization', 'Project descriptions', 'Keyword analysis', 'Role-specific templates'],
    mode: 'resume_review',
    placeholder: 'Paste your resume text for a review, or ask: "How do I write a resume for a Python developer role?"',
    quickActions: ['Review my resume', 'Write a project description for my portfolio', 'What keywords should I include?', 'Give me a resume template for a junior developer']
  },
  {
    id: 'portfolio',
    name: 'Portfolio Assistant',
    emoji: '🌐',
    category: 'Career',
    desc: 'Build a developer portfolio that gets you hired. Get project ideas, README templates, and advice on showcasing your EduNet projects.',
    features: ['Project ideas by skill level', 'README templates', 'Deployment guides', 'Portfolio review'],
    mode: 'portfolio_help',
    placeholder: 'Ask: "What projects should I build?", "How do I deploy my project?", "Review my portfolio"',
    quickActions: ['Suggest portfolio projects for my skill level', 'Write a README for my project', 'How do I deploy to Vercel?', 'What makes a great developer portfolio?']
  },
  {
    id: 'roadmap',
    name: 'Roadmap Guide',
    emoji: '🗺️',
    category: 'Learning',
    desc: 'Get personalized guidance on your learning path. Know exactly what to study next, how long it will take, and how to fill your knowledge gaps.',
    features: ['Personalized study plan', 'Weak area identification', 'Next topic recommendations', 'Progress analysis'],
    mode: 'roadmap_guidance',
    placeholder: 'Ask: "What should I learn next?", "How do I improve my weak areas?", "How long will this roadmap take?"',
    quickActions: ['What should I learn next?', 'Analyze my learning progress', 'Help me create a study schedule', 'Which topics should I focus on?']
  },
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    emoji: '🔍',
    category: 'Coding',
    desc: 'Paste your code for expert-level review. Get feedback on code quality, security vulnerabilities, performance bottlenecks, and refactoring suggestions.',
    features: ['Code quality scoring', 'Security analysis', 'Performance review', 'Refactoring suggestions'],
    mode: 'optimize',
    placeholder: 'Paste your code and I\'ll review it for quality, security, and performance...',
    quickActions: ['Review this code', 'Find security vulnerabilities', 'How can I optimize this?', 'What design pattern should I use?']
  },
  {
    id: 'code-explainer',
    name: 'Code Explainer',
    emoji: '🔬',
    category: 'Coding',
    desc: 'Paste any code and get a line-by-line breakdown explaining exactly what each part does. Great for understanding open-source code or your own complex logic.',
    features: ['Line-by-line breakdown', 'Pattern recognition', 'Jargon-free explanations', 'Complexity analysis'],
    mode: 'lineby',
    placeholder: 'Paste code here and I\'ll explain it line by line...',
    quickActions: ['Explain this code line by line', 'What does this function return?', 'What is the time complexity of this?', 'Simplify this code']
  },
  {
    id: 'bug-finder',
    name: 'Bug Finder',
    emoji: '🐛',
    category: 'Coding',
    desc: 'AI-powered debugging. Paste buggy code or error messages and get the exact fix with an explanation of why the bug occurred.',
    features: ['Bug detection', 'Error message decoder', 'Stack trace analysis', 'Precise fixes'],
    mode: 'debug',
    placeholder: 'Paste your error message or buggy code here...',
    quickActions: ['Find the bug in this code', 'Explain this error message', 'Why is my code not working?', 'Debug this function']
  },
  {
    id: 'project-reviewer',
    name: 'Project Reviewer',
    emoji: '🏗️',
    category: 'Coding',
    desc: 'Get comprehensive feedback on your mini projects and portfolio projects. Scored across 6 dimensions: functionality, code quality, performance, testing, documentation, and security.',
    features: ['6-dimension scoring', 'Improvement roadmap', 'Portfolio readiness check', 'Industry standards check'],
    mode: 'project_review',
    placeholder: 'Describe your project or paste code. I\'ll review it across 6 quality dimensions...',
    quickActions: ['Review my project', 'Is this portfolio-ready?', 'What should I improve?', 'Score my code quality']
  },
  {
    id: 'quiz-gen',
    name: 'Quiz Generator',
    emoji: '🧠',
    category: 'Learning',
    desc: 'Generate custom quizzes on any topic. Great for exam prep, revision, or testing how well you understand a concept before an interview.',
    features: ['5-10 questions per quiz', 'Difficulty levels', 'Explanations for each answer', 'Instant scoring'],
    mode: 'quiz_generate',
    placeholder: 'Type a topic like "Python lists" or "Binary search" to generate a quiz...',
    quickActions: ['Generate a quiz on this lesson', 'Test my understanding of this topic', 'Give me 5 MCQ questions', 'Quiz me on interview topics']
  },
  {
    id: 'simplifier',
    name: 'Concept Simplifier',
    emoji: '✨',
    category: 'Learning',
    desc: 'Struggling with a complex topic? Get the simplest possible explanation using everyday analogies, no jargon, and beginner-friendly code examples.',
    features: ['ELI5 explanations', 'Real-world analogies', 'Visual diagrams (text)', 'Beginner code examples'],
    mode: 'simplify',
    placeholder: 'Type any complex concept and I\'ll explain it in the simplest way possible...',
    quickActions: ['Explain this in simple terms', 'Give me a beginner explanation', 'Use an analogy to explain this', 'What\'s the easiest way to understand this?']
  }
];

const CATEGORIES = ['All', 'Learning', 'Coding', 'Interview', 'Career'];

// ── Suggested Tools (stored in localStorage) ────────────────────
function getSuggestedTools() {
  try {
    return JSON.parse(localStorage.getItem('edunet_suggested_tools') || '[]');
  } catch { return []; }
}
function saveSuggestedTool(tool) {
  const tools = getSuggestedTools();
  tools.push({ ...tool, id: 'suggested-' + Date.now(), ts: Date.now() });
  localStorage.setItem('edunet_suggested_tools', JSON.stringify(tools));
}

// ── State ───────────────────────────────────────────────────────
let activeTool       = null;
let chatHistories    = {}; // toolId -> [{role, content, ts}]
let userContext      = null;
let isGenerating     = false;
let currentFilter    = 'All';
let searchQuery      = '';

// ── Initialize page ─────────────────────────────────────────────
async function init() {
  renderCategories();
  renderTools();
  bindSearch();
  await loadUserContext();
  renderSuggestButton();
  renderSuggestedTools();
}

// ── Load user context (XP, rank, completed lessons, etc.) ───────
async function loadUserContext() {
  try {
    const result = await apiFetch('/api/ai/user-context');
    if (result.success) userContext = result.context;
  } catch (e) {
    userContext = null;
  }
}

// ── Render category filters ─────────────────────────────────────
function renderCategories() {
  const row = document.getElementById('toolFilterRow');
  if (!row) return;
  row.innerHTML = CATEGORIES.map(cat => `
    <button class="filter-btn ${cat === currentFilter ? 'active' : ''}"
            onclick="setFilter('${cat}')">
      ${cat}
    </button>
  `).join('');
}

window.setFilter = function(cat) {
  currentFilter = cat;
  renderCategories();
  renderTools();
};

// ── Bind search ─────────────────────────────────────────────────
function bindSearch() {
  const input = document.getElementById('toolSearchBar');
  if (!input) return;
  input.addEventListener('input', () => {
    searchQuery = input.value.toLowerCase().trim();
    renderTools();
  });
}

// ── Render tool cards ───────────────────────────────────────────
function renderTools() {
  const grid = document.getElementById('toolsGrid');
  if (!grid) return;

  const filtered = TOOLS_DATA.filter(t => {
    if (currentFilter !== 'All' && t.category !== currentFilter) return false;
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery) && !t.desc.toLowerCase().includes(searchQuery)) return false;
    return true;
  });

  if (!filtered.length) {
    grid.innerHTML = '<p style="color:var(--mist);padding:2rem;grid-column:1/-1;text-align:center;">No tools match your search.</p>';
    return;
  }

  // Include user-suggested tools
  const suggested = getSuggestedTools().filter(t => {
    if (currentFilter !== 'All' && t.category !== currentFilter) return false;
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery) && !t.description.toLowerCase().includes(searchQuery)) return false;
    return true;
  });
  const allTools = [...filtered, ...suggested];

  if (!allTools.length) {
    grid.innerHTML = '<p style="color:var(--mist);padding:2rem;grid-column:1/-1;text-align:center;">No tools match your search. <button class="btn btn-primary btn-sm" onclick="openSuggestModal()" style="margin-left:0.5rem;">Suggest a Tool</button></p>';
    return;
  }

  grid.innerHTML = allTools.map(tool => {
    const isSuggested = tool.id && tool.id.startsWith('suggested-');
    const features = tool.features || [];
    return `
    <div class="tool-card ${isSuggested ? 'suggested-tool' : ''}" id="tc-${tool.id}" onclick="${isSuggested ? '' : "openTool('" + tool.id + "')"}" style="cursor:${isSuggested ? 'default' : 'pointer'};transition:transform 0.15s,box-shadow 0.15s;${isSuggested ? 'border-color:rgba(251,191,36,0.3);' : ''}" onmouseenter="this.style.transform='translateY(-2px)'" onmouseleave="this.style.transform=''">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.75rem;">
        <div class="tool-icon" style="font-size:2rem;">${tool.emoji || '🔌'}</div>
        <span style="font-size:10px;padding:2px 7px;background:rgba(99,102,241,0.1);color:var(--accent);border-radius:12px;border:1px solid rgba(99,102,241,0.2);font-weight:600;">${tool.category || 'Community'}</span>
      </div>
      <h3 style="font-size:15px;font-weight:700;color:var(--frost);margin-bottom:0.4rem;">${tool.name}${isSuggested ? ' <span style="font-size:10px;color:var(--amber);font-weight:400;">(suggested)</span>' : ''}</h3>
      <p style="font-size:12.5px;color:var(--mist);line-height:1.6;margin-bottom:0.75rem;">${tool.description || tool.desc || ''}</p>
      ${features.length ? `<div style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-bottom:1rem;">
        ${features.map(f => `<span style="font-size:10px;padding:2px 7px;background:var(--abyss);border:1px solid var(--border);border-radius:4px;color:var(--mist-dim);">${f}</span>`).join('')}
      </div>` : ''}
      <div style="display:flex;justify-content:flex-end;gap:0.5rem;">
        ${isSuggested ? `<button class="btn btn-secondary btn-sm" onclick="removeSuggestedTool('${tool.id}')" style="font-size:11px;">Remove</button>` : `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();openTool('${tool.id}')">Open Tool →</button>`}
      </div>
    </div>
  `}).join('');
}

// ── Suggest Tool Feature ────────────────────────────────────────
function renderSuggestButton() {
  const row = document.getElementById('toolFilterRow');
  if (!row) return;
  const btn = document.createElement('button');
  btn.className = 'filter-btn';
  btn.textContent = '💡 Suggest Tool';
  btn.style.cssText = 'margin-left:auto;background:rgba(251,191,36,0.1);border-color:rgba(251,191,36,0.3);color:var(--amber);';
  btn.onclick = openSuggestModal;
  row.appendChild(btn);
}

function renderSuggestedTools() {
  // suggested tools are rendered in renderTools already
}

window.openSuggestModal = function() {
  const existing = document.getElementById('suggestToolModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'suggestToolModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;';
  modal.innerHTML = `
    <div style="background:var(--abyss);border:1px solid var(--border);border-radius:16px;width:min(500px,95vw);max-height:90vh;overflow-y:auto;padding:1.5rem;box-shadow:0 24px 64px rgba(0,0,0,0.5);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
        <h3 style="margin:0;font-size:16px;color:var(--frost);">💡 Suggest an AI Tool</h3>
        <button onclick="this.closest('#suggestToolModal').remove()" style="background:none;border:none;color:var(--mist);font-size:1.2rem;cursor:pointer;">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <div>
          <label style="font-size:12px;color:var(--mist-dim);display:block;margin-bottom:.3rem;">Tool Name *</label>
          <input id="suggest-name" placeholder="e.g., CodeGPT, DataDog AI" style="width:100%;background:var(--abyss-2);border:1px solid var(--border);border-radius:8px;padding:.6rem .75rem;color:var(--text);font-size:13px;outline:none;">
        </div>
        <div>
          <label style="font-size:12px;color:var(--mist-dim);display:block;margin-bottom:.3rem;">Category</label>
          <select id="suggest-category" style="width:100%;background:var(--abyss-2);border:1px solid var(--border);border-radius:8px;padding:.6rem .75rem;color:var(--text);font-size:13px;outline:none;">
            <option value="Coding Assistants">Coding Assistants</option>
            <option value="Resume Builders">Resume Builders</option>
            <option value="Research">Research</option>
            <option value="Learning">Learning</option>
            <option value="Interview">Interview</option>
            <option value="Career">Career</option>
          </select>
        </div>
        <div>
          <label style="font-size:12px;color:var(--mist-dim);display:block;margin-bottom:.3rem;">Description *</label>
          <textarea id="suggest-desc" rows="3" placeholder="What does this tool do?" style="width:100%;background:var(--abyss-2);border:1px solid var(--border);border-radius:8px;padding:.6rem .75rem;color:var(--text);font-size:13px;resize:vertical;outline:none;font-family:inherit;"></textarea>
        </div>
        <div>
          <label style="font-size:12px;color:var(--mist-dim);display:block;margin-bottom:.3rem;">Use Case / Why it's useful</label>
          <input id="suggest-usecase" placeholder="e.g., Use ChatGPT to explain complex DSA concepts" style="width:100%;background:var(--abyss-2);border:1px solid var(--border);border-radius:8px;padding:.6rem .75rem;color:var(--text);font-size:13px;outline:none;">
        </div>
        <div style="display:flex;gap:.75rem;margin-top:.5rem;">
          <button onclick="submitToolSuggestion()" class="btn btn-primary" style="flex:1;">Submit Suggestion</button>
          <button onclick="this.closest('#suggestToolModal').remove()" class="btn btn-secondary">Cancel</button>
        </div>
        <div id="suggest-feedback" style="font-size:12px;color:var(--mist-dim);text-align:center;"></div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  // Focus first input
  setTimeout(() => document.getElementById('suggest-name')?.focus(), 100);
};

window.submitToolSuggestion = function() {
  const name = document.getElementById('suggest-name')?.value.trim();
  const desc = document.getElementById('suggest-desc')?.value.trim();
  const category = document.getElementById('suggest-category')?.value || 'Coding Assistants';
  const useCase = document.getElementById('suggest-usecase')?.value.trim() || '';

  if (!name || !desc) {
    document.getElementById('suggest-feedback').textContent = '⚠️ Please fill in the name and description.';
    document.getElementById('suggest-feedback').style.color = 'var(--rose)';
    return;
  }

  saveSuggestedTool({ name, description: desc, category, useCase, emoji: '🔌' });
  document.getElementById('suggest-feedback').textContent = '✓ Tool suggestion saved! It now appears in the grid below.';
  document.getElementById('suggest-feedback').style.color = 'var(--emerald)';

  // Refresh and close after delay
  setTimeout(() => {
    document.getElementById('suggestToolModal')?.remove();
    renderTools();
  }, 1500);

  showToast('Tool suggestion added!', 'success');
};

window.removeSuggestedTool = function(id) {
  const tools = getSuggestedTools().filter(t => t.id !== id);
  localStorage.setItem('edunet_suggested_tools', JSON.stringify(tools));
  renderTools();
  showToast('Suggested tool removed.', 'info');
};

// ── Open a specific tool (opens chat modal) ─────────────────────
window.openTool = function(toolId) {
  const tool = TOOLS_DATA.find(t => t.id === toolId);
  if (!tool) return;

  activeTool = tool;
  if (!chatHistories[toolId]) chatHistories[toolId] = [];

  const modal = document.getElementById('toolChatModal');
  if (!modal) return;

  renderToolModal(tool);
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Focus input
  setTimeout(() => {
    const inp = document.getElementById('tool-chat-input');
    if (inp) inp.focus();
  }, 100);
};

// ── Render tool modal content ───────────────────────────────────
function renderToolModal(tool) {
  const box = document.getElementById('toolChatModal');
  if (!box) return;

  const history = chatHistories[tool.id] || [];
  const xp      = userContext?.xp || 0;
  const rank    = userContext?.rank || 'Beginner';

  box.innerHTML = `
    <div id="tool-modal-inner" style="
      background:var(--abyss);
      border:1px solid var(--border);
      border-radius:16px;
      width:min(760px,95vw);
      max-height:90vh;
      display:flex;
      flex-direction:column;
      overflow:hidden;
      box-shadow:0 24px 64px rgba(0,0,0,0.5);
    ">
      <!-- Header -->
      <div style="
        display:flex;
        align-items:center;
        gap:0.75rem;
        padding:1rem 1.25rem;
        border-bottom:1px solid var(--border);
        background:var(--abyss-2);
        flex-shrink:0;
      ">
        <div style="font-size:1.75rem;">${tool.emoji}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:15px;font-weight:700;color:var(--frost);">${tool.name}</div>
          <div style="font-size:11px;color:var(--mist-dim);">Context: XP ${xp} · ${rank} · ${userContext?.completedLessons?.length || 0} lessons completed</div>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <button onclick="clearToolChat('${tool.id}')" class="btn btn-secondary btn-sm" title="Clear chat" style="font-size:11px;padding:4px 10px;">🗑 Clear</button>
          <button onclick="closeTool()" style="background:none;border:none;color:var(--mist);cursor:pointer;font-size:1.2rem;padding:4px;line-height:1;" title="Close">✕</button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div id="tool-quick-actions" style="
        display:flex;
        gap:0.4rem;
        flex-wrap:wrap;
        padding:0.75rem 1rem;
        border-bottom:1px solid var(--border);
        background:var(--abyss-2);
        flex-shrink:0;
        ${history.length > 0 ? 'display:none!important;' : ''}
      ">
        ${tool.quickActions.map(a => `
          <button onclick="sendQuickAction('${escapeAttrStr(a)}')"
                  style="font-size:11px;padding:4px 10px;background:var(--abyss);border:1px solid var(--border);border-radius:20px;color:var(--mist);cursor:pointer;white-space:nowrap;transition:border-color 0.15s,color 0.15s;"
                  onmouseenter="this.style.borderColor='var(--accent)';this.style.color='var(--accent)'"
                  onmouseleave="this.style.borderColor='var(--border)';this.style.color='var(--mist)'">
            ${a}
          </button>
        `).join('')}
      </div>

      <!-- Chat area -->
      <div id="tool-chat-messages" style="
        flex:1;
        overflow-y:auto;
        padding:1rem;
        display:flex;
        flex-direction:column;
        gap:1rem;
        min-height:200px;
      ">
        ${history.length === 0 ? renderWelcomeMessage(tool) : history.map(m => renderChatMessage(m)).join('')}
      </div>

      <!-- Input area -->
      <div style="
        padding:0.75rem 1rem;
        border-top:1px solid var(--border);
        background:var(--abyss-2);
        flex-shrink:0;
      ">
        <div style="display:flex;gap:0.5rem;align-items:flex-end;">
          <textarea id="tool-chat-input"
                    rows="2"
                    placeholder="${tool.placeholder}"
                    style="flex:1;background:var(--abyss);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:0.6rem 0.75rem;font-size:13px;resize:none;font-family:var(--font-body);line-height:1.5;outline:none;transition:border-color 0.15s;"
                    onfocus="this.style.borderColor='var(--accent)'"
                    onblur="this.style.borderColor='var(--border)'"
                    onkeydown="handleChatKey(event)"></textarea>
          <button id="tool-send-btn"
                  onclick="sendToolMessage()"
                  class="btn btn-primary"
                  style="padding:0.6rem 1rem;flex-shrink:0;align-self:flex-end;"
                  ${isGenerating ? 'disabled' : ''}>
            ${isGenerating ? '<span style="animation:spin 0.8s linear infinite;display:inline-block;">⟳</span>' : 'Send →'}
          </button>
        </div>
        <div style="font-size:10px;color:var(--mist-dim);margin-top:0.4rem;">
          Powered by EduNet AI · Context-aware · Your data stays private · Press Enter to send
        </div>
      </div>
    </div>
  `;

  // Scroll to bottom of messages
  setTimeout(() => {
    const msgs = document.getElementById('tool-chat-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }, 50);
}

function renderWelcomeMessage(tool) {
  return `
    <div style="text-align:center;padding:2rem 1rem;color:var(--mist);">
      <div style="font-size:3rem;margin-bottom:0.75rem;">${tool.emoji}</div>
      <div style="font-size:15px;font-weight:700;color:var(--frost);margin-bottom:0.5rem;">${tool.name}</div>
      <div style="font-size:13px;line-height:1.6;max-width:400px;margin:0 auto;">${tool.desc}</div>
      <div style="font-size:11px;color:var(--mist-dim);margin-top:1rem;">Use the quick actions above or type your question below to get started.</div>
    </div>
  `;
}

function renderChatMessage(msg) {
  const isUser = msg.role === 'user';
  return `
    <div style="
      display:flex;
      flex-direction:${isUser ? 'row-reverse' : 'row'};
      gap:0.6rem;
      align-items:flex-start;
    ">
      <div style="
        width:30px;height:30px;border-radius:50%;
        background:${isUser ? 'var(--accent)' : 'rgba(99,102,241,0.15)'};
        display:flex;align-items:center;justify-content:center;
        font-size:13px;flex-shrink:0;color:${isUser ? '#000' : 'var(--accent)'};
        font-weight:700;border:1px solid ${isUser ? 'transparent' : 'rgba(99,102,241,0.3)'};
      ">
        ${isUser ? 'U' : '🤖'}
      </div>
      <div style="
        max-width:80%;
        background:${isUser ? 'var(--accent)' : 'var(--abyss-2)'};
        color:${isUser ? '#fff' : 'var(--text)'};
        padding:0.75rem 1rem;
        border-radius:${isUser ? '12px 12px 4px 12px' : '12px 12px 12px 4px'};
        font-size:13.5px;
        line-height:1.7;
        border:1px solid ${isUser ? 'transparent' : 'var(--border)'};
      ">
        ${isUser ? escapeHtmlStr(msg.content) : markdownToHtmlStr(msg.content)}
        ${msg.ts ? `<div style="font-size:9px;opacity:0.5;margin-top:0.4rem;text-align:right;">${new Date(msg.ts).toLocaleTimeString()}</div>` : ''}
      </div>
    </div>
  `;
}

// ── Simple HTML escape for tool modal ──────────────────────────
function escapeHtmlStr(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
function escapeAttrStr(str) {
  return String(str).replace(/'/g,"&#039;").replace(/"/g,"&quot;");
}

// ── Markdown → HTML (basic) ─────────────────────────────────────
function markdownToHtmlStr(text) {
  if (!text) return '';
  let html = String(text);
  // Code blocks
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
    `<pre style="background:var(--abyss);border:1px solid var(--border);border-radius:6px;padding:0.75rem;overflow-x:auto;font-size:12px;margin:0.5rem 0;"><code style="color:var(--accent);">${escapeHtmlStr(code.trim())}</code></pre>`
  );
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code style="background:var(--abyss);padding:1px 5px;border-radius:3px;font-size:12px;color:var(--accent);">$1</code>');
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--frost);">$1</strong>');
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Headers
  html = html.replace(/^### (.*$)/gm, '<h4 style="font-size:13.5px;color:var(--frost);margin:0.75rem 0 0.3rem;font-weight:700;">$1</h4>');
  html = html.replace(/^## (.*$)/gm, '<h3 style="font-size:15px;color:var(--frost);margin:1rem 0 0.5rem;font-weight:700;">$1</h3>');
  html = html.replace(/^# (.*$)/gm, '<h2 style="font-size:17px;color:var(--frost);margin:1rem 0 0.5rem;font-weight:800;">$1</h2>');
  // Tables (basic)
  html = html.replace(/^\|(.+)\|$/gm, (line) => {
    if (line.includes('---')) return '';
    const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
    return `<tr>${cells.map(c => `<td style="padding:5px 10px;border:1px solid var(--border);">${c}</td>`).join('')}</tr>`;
  });
  html = html.replace(/((<tr>.*<\/tr>\n?)+)/gs, (rows) =>
    `<table style="border-collapse:collapse;width:100%;margin:0.5rem 0;font-size:12.5px;">${rows}</table>`
  );
  // Lists
  html = html.replace(/^[\*\-] (.+)$/gm, '<li style="margin-bottom:0.25rem;">$1</li>');
  html = html.replace(/(<li.*<\/li>\n?)+/g, (items) => `<ul style="padding-left:1.25rem;margin:0.5rem 0;">${items}</ul>`);
  html = html.replace(/^\d+\. (.+)$/gm, '<li style="margin-bottom:0.25rem;">$1</li>');
  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr style="border-color:var(--border);margin:0.75rem 0;">');
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p style="margin:0.4rem 0;">');
  html = `<p style="margin:0;">${html}</p>`;
  return html;
}

// ── Close tool modal ────────────────────────────────────────────
window.closeTool = function() {
  const modal = document.getElementById('toolChatModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
  activeTool = null;
};

// ── Clear chat for a tool ───────────────────────────────────────
window.clearToolChat = function(toolId) {
  chatHistories[toolId] = [];
  if (activeTool && activeTool.id === toolId) {
    renderToolModal(activeTool);
  }
};

// ── Handle Enter key in textarea ───────────────────────────────
window.handleChatKey = function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendToolMessage();
  }
};

// ── Quick action button ─────────────────────────────────────────
window.sendQuickAction = function(text) {
  const inp = document.getElementById('tool-chat-input');
  if (inp) inp.value = text;
  sendToolMessage();
};

// ── Send a message to the AI ────────────────────────────────────
window.sendToolMessage = async function() {
  if (!activeTool || isGenerating) return;

  const inp = document.getElementById('tool-chat-input');
  const message = (inp?.value || '').trim();
  if (!message) return;

  // Add user message to history
  if (!chatHistories[activeTool.id]) chatHistories[activeTool.id] = [];
  chatHistories[activeTool.id].push({ role: 'user', content: message, ts: Date.now() });

  // Clear input, hide quick actions, show typing
  if (inp) inp.value = '';
  const qa = document.getElementById('tool-quick-actions');
  if (qa) qa.style.display = 'none';

  isGenerating = true;
  addTypingIndicator();

  try {
    const payload = {
      mode: activeTool.mode,
      message
    };

    const result = await apiFetch('/api/ai/mentor', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    let aiReply = '';
    if (result.success) {
      if (result.mode === 'interview_questions' && result.questions) {
        // Format interview questions as readable chat response
        aiReply = formatInterviewQuestionsAsMarkdown(result.questions);
      } else if (result.mode === 'quiz_generate' && result.quiz) {
        aiReply = formatQuizAsMarkdown(result.quiz);
      } else {
        aiReply = result.reply || 'I\'ve processed your request.';
      }
    } else {
      aiReply = 'Sorry, there was an error. Please try again.';
    }

    chatHistories[activeTool.id].push({ role: 'assistant', content: aiReply, ts: Date.now() });
    addXP(2); // Small XP reward for using AI tools

  } catch (e) {
    chatHistories[activeTool.id].push({
      role: 'assistant',
      content: `## Error\n\nI couldn't process that request. This might be due to a temporary network issue.\n\n**Please try again.** If the problem persists, check your internet connection.`,
      ts: Date.now()
    });
  }

  isGenerating = false;
  renderToolModal(activeTool);
};

function addTypingIndicator() {
  const msgs = document.getElementById('tool-chat-messages');
  if (!msgs) return;
  const indicator = document.createElement('div');
  indicator.id = 'typing-indicator';
  indicator.style.cssText = 'display:flex;gap:0.6rem;align-items:center;';
  indicator.innerHTML = `
    <div style="width:30px;height:30px;border-radius:50%;background:rgba(99,102,241,0.15);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;color:var(--accent);border:1px solid rgba(99,102,241,0.3);">🤖</div>
    <div style="background:var(--abyss-2);border:1px solid var(--border);border-radius:12px 12px 12px 4px;padding:0.75rem 1rem;font-size:13px;color:var(--mist);">
      <span style="animation:pulse 1s ease-in-out infinite;">Generating</span><span style="animation:blink 1s step-start infinite;">...</span>
    </div>
  `;
  msgs.appendChild(indicator);
  msgs.scrollTop = msgs.scrollHeight;
}

function formatInterviewQuestionsAsMarkdown(questions) {
  if (!questions || !questions.length) return 'No questions generated.';
  const grouped = {};
  questions.forEach(q => {
    const level = q.level || 'general';
    if (!grouped[level]) grouped[level] = [];
    grouped[level].push(q);
  });

  let md = `## 🎯 Interview Questions (${questions.length} total)\n\n`;
  const levelEmojis = { beginner: '🟢', intermediate: '🟡', advanced: '🔴', general: '⚪' };

  Object.entries(grouped).forEach(([level, qs]) => {
    md += `### ${levelEmojis[level] || '⚪'} ${level.charAt(0).toUpperCase() + level.slice(1)} Level\n\n`;
    qs.forEach((q, i) => {
      md += `**Q${i+1}. ${q.question}**\n\n`;
      md += `${q.answer || q.fullAnswer || ''}\n\n`;
      if (q.followUp) {
        md += `> 🤔 **Follow-up**: ${q.followUp}\n\n`;
      }
      md += `---\n\n`;
    });
  });

  return md;
}

function formatQuizAsMarkdown(quiz) {
  if (!quiz || !quiz.questions || !quiz.questions.length) return 'No quiz questions generated.';
  let md = `## 🧠 Quiz: ${quiz.topic || 'Current Topic'}\n\nAnswer these questions to test your knowledge:\n\n`;
  quiz.questions.forEach((q, i) => {
    md += `**Q${i+1}. ${q.q}**\n\n`;
    q.options.forEach((opt, j) => {
      md += `${['A','B','C','D'][j]}) ${opt}\n`;
    });
    md += `\n<details>\n<summary>View Answer</summary>\n\n**Answer: ${['A','B','C','D'][q.correct]})**\n\n${q.explanation}\n\n</details>\n\n---\n\n`;
  });
  return md;
}

// ── Click outside to close modal ───────────────────────────────
document.addEventListener('click', (e) => {
  const modal = document.getElementById('toolChatModal');
  if (modal && e.target === modal) closeTool();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeTool();
});

// ── Add spin/blink animations to head ──────────────────────────
if (!document.getElementById('ai-tools-anim-style')) {
  const style = document.createElement('style');
  style.id = 'ai-tools-anim-style';
  style.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes blink { 50% { opacity:0; } }
  `;
  document.head.appendChild(style);
}

// ── Boot ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
