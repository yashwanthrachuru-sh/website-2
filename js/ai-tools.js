// ============================================================
// js/ai-tools.js — EduNet AI Tools Directory
// ============================================================
'use strict';
const session = window.initPageShell('ai-tools.html');
const { apiFetch, showToast, addXP, debounce } = window.EduNetAPI;

const CAT_ICONS = {
  Coding: '💻', Research: '🔬', Productivity: '⚡', Writing: '✍️',
  Image: '🎨', Video: '🎬', Interview: '💼', Resume: '📄', General: '🛠'
};

const TOOLS_DATA = [
  { id:'t1', name:'CodeSynth AI', category:'Coding', desc:'Generates optimal DSA solutions, explains time/space complexity and outputs clean syntax templates.', features:['Optimal solution generation','Complexity insights','Language conversions'], pricing:'Free', rating:4.8, official_link:'https://github.com', tags:['DSA','Coding','LLM'] },
  { id:'t3', name:'ResumeReviewer ATS', category:'Resume', desc:'Analyze resume templates, score readability, and optimize keywords based on technical target descriptions.', features:['ATS scoring','Keyword scanner','Grammar checker'], pricing:'Free', rating:4.5, official_link:'https://resumereviewer.com', tags:['Resume','Career','ATS'] },
  { id:'t4', name:'QueryResolve Bot', category:'Research', desc:'Instant math proofs, circuit analysis calculations, and computer architecture breakdown answers.', features:['Calculus step solving','Circuit mesh parsing','Truth table output'], pricing:'Free', rating:4.6, official_link:'https://wolframalpha.com', tags:['Math','Science','Research'] },
  { id:'t5', name:'AlgorithmVisualizer', category:'Coding', desc:'Generates visual, interactive step-by-step traces of pathfinders, tree balances, and sorting arrays.', features:['Interactive animation','Breakpoint checks','Speed tuner'], pricing:'Free', rating:4.9, official_link:'https://visualgo.net', tags:['DSA','Visual','Learning'] },
  { id:'t6', name:'SOP Refiner', category:'Writing', desc:'Polish statements of purpose, scholarship applications, and recommendation letters.', features:['Tone tuner','Wordiness remover','Passive voice highlights'], pricing:'Free', rating:4.3, official_link:'https://soprefiner.com', tags:['Writing','SOP','Grad School'] },
  { id:'t7', name:'GitDraft Explainer', category:'Coding', desc:'Generates clear git commit logs and pull request descriptions from raw local diff files.', features:['Diff parsing','Conventional commits output','PR list writer'], pricing:'Free', rating:4.4, official_link:'https://github.com', tags:['Git','DevOps','Automation'] },
  { id:'t9', name:'CoverFlow Generator', category:'Resume', desc:'Crafts tailored cover letters matching job descriptions, maintaining a highly professional tone.', features:['Custom cover letter','Target job match','One-page format'], pricing:'Pro', rating:4.5, official_link:'https://linkedin.com', tags:['Resume','Job','Career'] },
  { id:'t10', name:'MockVerify QA', category:'Coding', desc:'Analyzes unit tests, scans for edge cases, and writes automated testing scripts for API endpoints.', features:['Edge case scanner','Mock generators','Coverage report'], pricing:'Free', rating:4.7, official_link:'https://jestjs.io', tags:['Testing','QA','API'] },
  { id:'t11', name:'MathSolver Matrix', category:'Research', desc:'Step-by-step calculus integration, differential equations, and eigenvalues vector solver.', features:['Eigenvalue calculation','Step substitution','Limits check'], pricing:'Free', rating:4.6, official_link:'https://symbolab.com', tags:['Math','Calculus','Linear Algebra'] },
  { id:'t13', name:'AgentCraft Studio', category:'Coding', desc:'Design and execute multi-agent autonomous loops, connect custom tools, and monitor execution graphs.', features:['Multi-agent coordination','Graph telemetry','API webhooks'], pricing:'Pro', rating:4.8, official_link:'https://langchain.com', tags:['AI','Agents','Automation'] },
  { id:'t14', name:'SemanticSearch RAG', category:'Research', desc:'Query loaded PDF corpuses using custom semantic vector embeddings and similarity scores.', features:['Semantic search','PDF chunker','Similarity scoring'], pricing:'Pro', rating:4.7, official_link:'https://pinecone.io', tags:['RAG','Embeddings','NLP'] },
  { id:'t15', name:'PromptRefiner AI', category:'Productivity', desc:'Optimize raw prompts using structural templates, chain-of-thought rules and adversarial input checks.', features:['Chain-of-Thought injector','System role checks','Token reducer'], pricing:'Free', rating:4.5, official_link:'https://promptperfect.xyz', tags:['Prompt Eng','LLM','Optimization'] },
  { id:'t17', name:'WebSocket Tracer', category:'Coding', desc:'Traces live WebSocket messages, inspects frames, audits payload schemas, and measures latency.', features:['Live frame updates','Latency logs','Schema verification'], pricing:'Free', rating:4.6, official_link:'https://websocket.org', tags:['WebSocket','Debug','API'] },
  { id:'t18', name:'SynthData Engine', category:'Research', desc:'Generates clean, mock relational database rows and JSON payloads for testing.', features:['Relational mock schemas','Export SQL/CSV/JSON','Regex validator'], pricing:'Free', rating:4.7, official_link:'https://mockaroo.com', tags:['Database','Testing','Mock Data'] },
  { id:'t20', name:'StableDraft Image', category:'Image', desc:'Generate high-quality images, mockups, and UI screenshots from text prompts.', features:['Text-to-image','Style transfer','Batch generation'], pricing:'Free', rating:4.5, official_link:'https://stability.ai', tags:['Image','Design','AI Art'] },
  { id:'t21', name:'VideoScript AI', category:'Video', desc:'Auto-generate video scripts, storyboards and YouTube descriptions from topic prompts.', features:['Script generation','Storyboard outline','SEO descriptions'], pricing:'Free', rating:4.3, official_link:'https://runwayml.com', tags:['Video','Content','YouTube'] },
  { id:'t22', name:'SlideForge AI', category:'Productivity', desc:'Create beautiful PowerPoint and PDF slides from bullet points or markdown in seconds.', features:['Markdown to slides','Brand templates','Export PPT/PDF'], pricing:'Free', rating:4.4, official_link:'https://gamma.app', tags:['Presentation','Slides','Productivity'] },
  { id:'t23', name:'MockInterviewer AI', category:'Interview', desc:'Simulate FAANG-style technical and HR interviews with real-time AI feedback and scoring.', features:['Technical rounds','HR simulation','Feedback scoring'], pricing:'Pro', rating:4.8, official_link:'https://interviewbit.com', tags:['Interview','FAANG','Career'] },
];

// Bookmarks
function getBookmarks() { return JSON.parse(localStorage.getItem('edunet_bm_' + session?.username) || '[]'); }
function toggleBookmark(toolId) {
  const bms = getBookmarks();
  const idx = bms.findIndex(b => b.id === toolId && b.type === 'tool');
  if (idx >= 0) { bms.splice(idx, 1); showToast('Bookmark removed.', 'info'); }
  else { const tool = TOOLS_DATA.find(t => t.id === toolId); if (tool) { bms.push({ id: toolId, type: 'tool', title: tool.name, link: 'ai-tools.html' }); showToast('Bookmarked!', 'success'); addXP(5); } }
  localStorage.setItem('edunet_bm_' + session?.username, JSON.stringify(bms));
}
function isBookmarked(toolId) { return getBookmarks().some(b => b.id === toolId && b.type === 'tool'); }

// Render
function renderTools(list) {
  const grid = document.getElementById('toolsGrid');
  if (!grid) return;
  const cat = document.querySelector('#toolFilterRow .filter-btn.active')?.getAttribute('data-cat') || 'all';
  const q = (document.getElementById('toolSearchBar')?.value || '').toLowerCase().trim();
  const filtered = list.filter(t => {
    if (cat !== 'all' && t.category !== cat) return false;
    if (q && !t.name.toLowerCase().includes(q) && !t.desc.toLowerCase().includes(q) && !(t.tags || []).join(',').toLowerCase().includes(q)) return false;
    return true;
  });
  grid.innerHTML = '';
  if (!filtered.length) {
    grid.innerHTML = '<p style="color:var(--mist);padding:2rem;grid-column:1/-1;">No tools match your filter.</p>';
    return;
  }
  filtered.forEach(tool => {
    const icon = CAT_ICONS[tool.category] || '🛠';
    const bmd = isBookmarked(tool.id);
    const stars = '★'.repeat(Math.round(tool.rating)) + '☆'.repeat(5 - Math.round(tool.rating));
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.innerHTML = `
      <div>
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:.75rem;">
          <div class="tool-icon">${icon}</div>
          <button class="btn btn-icon btn-sm bm-btn" data-id="${tool.id}" title="${bmd ? 'Remove bookmark' : 'Bookmark'}" style="color:${bmd ? 'var(--accent)' : 'var(--mist-dim)'}">🔖</button>
        </div>
        <h3>${tool.name}</h3>
        <p>${tool.desc}</p>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.6rem;">
          ${(tool.tags || []).map(t => `<span class="badge badge-muted">${t}</span>`).join('')}
        </div>
      </div>
      <div class="tool-meta" style="margin-top:1rem;">
        <div>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--amber);">${stars}</div>
          <div style="font-size:11px;color:var(--mist-dim);margin-top:2px;">${tool.pricing}</div>
        </div>
        <div style="display:flex;gap:.5rem;">
          <button class="btn btn-secondary btn-sm detail-btn" data-id="${tool.id}">Details</button>
          <a href="${tool.official_link}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Launch →</a>
        </div>
      </div>
    `;
    card.querySelector('.bm-btn').addEventListener('click', e => {
      e.stopPropagation();
      toggleBookmark(tool.id);
      renderTools(allTools);
    });
    card.querySelector('.detail-btn').addEventListener('click', () => openToolModal(tool));
    grid.appendChild(card);
  });
}

function openToolModal(tool) {
  const modal = document.getElementById('toolModal');
  const box = document.getElementById('toolModalContent');
  const stars = '★'.repeat(Math.round(tool.rating)) + '☆'.repeat(5 - Math.round(tool.rating));
  
  let guideHtml = '';
  const sc = tool.structured_content;

  // Sanitization: Any raw tags or scripts should be stripped/escaped to prevent XSS
  const sanitize = (text) => {
    if (!text) return '';
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/on\w+\s*=\s*'[^']*'/gi, '');
  };

  if (sc) {
    // Generate beautiful learning tabs/sections for the AI tool
    guideHtml = `
      <div style="margin-top: 1.5rem; border-top: 1px solid var(--border); padding-top: 1rem;">
        <h4 style="font-size: 15px; color: var(--frost); margin-bottom: 1rem; font-weight: 700;">📘 Comprehensive AI Tool Learning Guide</h4>
        
        <!-- Accordion container -->
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          ${[
            { title: "📌 What is this tool?", content: sc.definition },
            { title: "📅 History & Origins", content: sc.history },
            { title: "🌱 Why it exists", content: sc.why_created },
            { title: "⚙️ How it works", content: sc.how_it_works },
            { title: "🏗️ System Architecture", content: sc.architecture },
            { title: "🌟 Core Features", content: sc.core_features },
            { title: "✅ Advantages", content: sc.advantages },
            { title: "⚠️ Limitations", content: sc.limitations },
            { title: "💰 Pricing structure", content: sc.pricing },
            { title: "🆓 Free vs Paid comparison", content: sc.free_vs_paid },
            { title: "🏢 Industry Use Cases", content: sc.industry_use_cases },
            { title: "🎓 Student Use Cases", content: sc.student_use_cases },
            { title: "👨‍💻 Developer Use Cases", content: sc.developer_use_cases },
            { title: "💬 Prompt Engineering Tips", content: sc.prompt_tips },
            { title: "🚀 Step-by-step Beginner Guide", content: sc.beginner_guide },
            { title: "🏆 Professional Workflow", content: sc.professional_workflow },
            { title: "✅ Best Practices", content: sc.best_practices },
            { title: "🔄 Alternatives & Comparison", content: `${sc.alternatives || ''}\n\n${sc.comparison_table || ''}` },
            { title: "❓ Frequently Asked Questions (FAQs)", content: sc.faqs },
            { title: "📝 Mini Quiz", content: sc.mini_quiz },
            { title: "💪 Practice Tasks", content: sc.practice_tasks },
            { title: "🚀 Project Ideas", content: sc.project_ideas },
            { title: "🔗 Related AI Tools", content: sc.related_tools },
            { title: "📚 Summary", content: sc.summary }
          ].filter(item => item.content).map((item, index) => `
            <div style="border: 1px solid var(--border); border-radius: 6px; background: var(--abyss);">
              <div onclick="const body = this.nextElementSibling; body.style.display = body.style.display === 'none' ? 'block' : 'none';" 
                   style="padding: 0.75rem 1rem; font-weight: 600; font-size: 13px; color: var(--frost); cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none;">
                <span>${item.title}</span>
                <span style="font-size: 10px; color: var(--mist-dim);">▼</span>
              </div>
              <div style="display: none; padding: 1rem; border-top: 1px solid var(--border); font-size: 13px; color: var(--mist); line-height: 1.6; max-height: 400px; overflow-y: auto;">
                ${markdownToHtml(sanitize(item.content))}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  box.innerHTML = `
    <div class="drawer-header">
      <h3 style="display:flex;align-items:center;gap:10px;font-size:17px;">${CAT_ICONS[tool.category] || '🛠'} ${tool.name}</h3>
      <button onclick="document.getElementById('toolModal').classList.remove('open')" class="btn btn-icon" style="width:28px;height:28px;">&times;</button>
    </div>
    <div style="padding:1.5rem; max-height: calc(100vh - 80px); overflow-y: auto;">
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1rem;">
        <span class="badge badge-accent">${tool.category}</span>
        <span class="badge badge-muted">${tool.pricing}</span>
        <span style="font-family:var(--font-mono);font-size:11px;color:var(--amber);">${stars} ${tool.rating}</span>
      </div>
      <p style="font-size:13.5px;color:var(--mist);line-height:1.7;margin-bottom:1.25rem;">${tool.desc}</p>
      <h4 style="font-size:13px;margin-bottom:.75rem;">Key Features</h4>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:.5rem;margin-bottom:1.5rem;">
        ${(tool.features || []).map(f => `<li style="display:flex;gap:8px;align-items:center;font-size:13px;color:var(--mist);"><span style="color:var(--emerald);">✓</span>${f}</li>`).join('')}
      </ul>
      <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin-bottom:1rem;">
        <a href="${tool.official_link}" target="_blank" rel="noopener" class="btn btn-primary">🚀 Launch Tool</a>
        <button onclick="toggleBookmark('${tool.id}');document.getElementById('toolModal').classList.remove('open');" class="btn btn-secondary">🔖 ${isBookmarked(tool.id) ? 'Remove Bookmark' : 'Bookmark'}</button>
      </div>
      ${guideHtml}
    </div>
  `;
  modal.classList.add('open');
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}

// ── Markdown Parser ────────────────────────────────────────────
function markdownToHtml(md) {
  if (!md) return '';
  let html = md
    .replace(/```(\w+)?\n?([\s\S]*?)```/gm, (_, lang, code) => {
      return `<pre><button class="copy-btn" onclick="copyCode(this)">Copy</button><code class="lang-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`;
    })
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^[*\-] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/^---$/gm, '<hr>')
    .replace(/\n\n(?!<[uh]|<li|<hr)/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Premium parser overlays
  html = html.replace(/<blockquote>\s*<p>\s*💡\s*([\s\S]*?)<\/p>\s*<\/blockquote>/gi, (m, content) => {
    return `<div class="premium-callout callout-info"><div class="callout-icon">💡</div><div class="callout-body"><strong>Remember:</strong> ${content}</div></div>`;
  });
  html = html.replace(/<h3>❌ Bad Prompt:<\/h3>([\s\S]*?)<h3>✅ Good Prompt:<\/h3>([\s\S]*?)(?=<div|$)/gi, (m, bad, good) => {
    return `
      <div class="mistake-comparison-grid">
        <div class="comparison-card bad">
          <div class="card-header">❌ Weak Prompt</div>
          <div class="card-body">${bad}</div>
        </div>
        <div class="comparison-card good">
          <div class="card-header">✅ Highly Effective Prompt</div>
          <div class="card-body">${good}</div>
        </div>
      </div>
    `;
  });

  return `<p>${html}</p>`;
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

window.copyCode = function(btn) {
  const code = btn.nextElementSibling?.textContent || '';
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
  });
};

let allTools = [...TOOLS_DATA];

// Try to load from API, fallback to local
apiFetch('/api/tools').then(d => {
  if (d.success && d.tools && d.tools.length) {
    allTools = d.tools.map(t => ({ ...t, tags: t.tags ? (typeof t.tags === 'string' ? t.tags.split(',') : t.tags) : [] }));
  }
  renderTools(allTools);
}).catch(() => renderTools(allTools));

// Filters
document.querySelectorAll('#toolFilterRow .filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('#toolFilterRow .filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderTools(allTools);
  });
});
document.getElementById('toolSearchBar')?.addEventListener('input', debounce(() => renderTools(allTools), 200));
