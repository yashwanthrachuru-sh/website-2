// ============================================================
// backend/controllers/aiController.js
// EduNet — AI Coding Mentor (Smart Context-Aware, No API Key Required)
// ============================================================
'use strict';

const db = require('../config/db');
const https = require('https');

// Helper to call OpenAI API securely using native HTTPS
function callOpenAI(apiKey, systemPrompt, userMessage) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7
    });

    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': data.length
      },
      timeout: 8000 // 8s timeout limit
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.choices && json.choices[0] && json.choices[0].message) {
            resolve(json.choices[0].message.content);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.write(data);
    req.end();
  });
}

// ── Mode response generators ────────────────────────────────────
const MODES = {
  explain:       (ctx) => generateExplanation(ctx, 'detailed'),
  simplify:      (ctx) => generateExplanation(ctx, 'beginner'),
  lineby:        (ctx) => generateLineByLine(ctx),
  example:       (ctx) => generateExample(ctx),
  analogy:       (ctx) => generateAnalogy(ctx),
  practice:      (ctx) => generatePracticeQuestions(ctx),
  flashcards:    (ctx) => generateFlashcardContent(ctx),
  debug:         (ctx) => generateDebugHelp(ctx),
  optimize:      (ctx) => generateOptimizeHelp(ctx),
  errors:        (ctx) => generateErrorExplanation(ctx),
  interview:     (ctx) => generateInterviewQ(ctx),
  predict_interview: (ctx) => predictInterviewQ(ctx),
  next_topic:    (ctx) => suggestNextTopic(ctx),
  chat:          (ctx, message) => generateChatResponse(ctx, message),
};

// ── POST /api/ai/mentor ─────────────────────────────────────────
const aiMentor = async (req, res) => {
  try {
    const { mode, message, lesson_id, module_id, roadmap_id, user_code } = req.body;
    const uid = req.user.id;

    // Build context
    const ctx = {
      lesson:    null,
      module:    null,
      roadmap:   null,
      user_code: user_code || '',
      username:  req.user.username,
    };

    // Fetch lesson context
    if (lesson_id) {
      const [[lesson]] = await db.query(
        `SELECT ml.title, ml.short_desc, ml.language, ml.starter_code,
                rm.title AS module_title, r.title AS roadmap_title, r.id AS roadmap_id
         FROM module_lessons ml
         JOIN roadmap_modules rm ON ml.module_id = rm.id
         JOIN roadmaps r ON rm.roadmap_id = r.id
         WHERE ml.id = ?`, [lesson_id]
      ).catch(() => [[null]]);
      if (lesson) {
        ctx.lesson  = lesson;
        ctx.module  = { title: lesson.module_title };
        ctx.roadmap = { title: lesson.roadmap_title, id: lesson.roadmap_id };
      }
    } else if (module_id) {
      const [[mod]] = await db.query(
        `SELECT rm.title, rm.language, rm.description, r.title AS roadmap_title
         FROM roadmap_modules rm
         JOIN roadmaps r ON rm.roadmap_id = r.id
         WHERE rm.id = ?`, [module_id]
      ).catch(() => [[null]]);
      if (mod) {
        ctx.module  = mod;
        ctx.roadmap = { title: mod.roadmap_title };
      }
    } else if (roadmap_id) {
      const [[rm]] = await db.query(
        `SELECT title, description, category FROM roadmaps WHERE id = ?`, [roadmap_id]
      ).catch(() => [[null]]);
      if (rm) ctx.roadmap = rm;
    }

    // Generate response based on mode (GPT first if key exists, else offline templates)
    let reply = '';
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey.startsWith('sk-') && apiKey !== 'sk-placeholder_key_here') {
      const systemPrompt = `You are a helpful, senior AI Coding Mentor on the EduNet learning platform.
Student Username: ${ctx.username}
Current Roadmap: ${ctx.roadmap?.title || 'General'}
Current Module: ${ctx.module?.title || 'General'}
Current Lesson: ${ctx.lesson?.title || 'General'}
Programming Language: ${getLang(ctx)}
${ctx.user_code ? `Current Student Code:\n\`\`\`\n${ctx.user_code}\n\`\`\`` : ''}
Mode: ${mode || 'chat'}

Provide a structured, helpful explanation or helper text based on the mode.
Keep the response formatted in clean markdown, using emojis, bullet points, and code blocks.`;

      const userMsg = message || `Help me with mode: ${mode || 'general help'}`;
      reply = await callOpenAI(apiKey, systemPrompt, userMsg);
    }

    if (!reply) {
      if (mode && MODES[mode]) {
        reply = MODES[mode](ctx, message || '');
      } else if (message) {
        reply = generateChatResponse(ctx, message);
      } else {
        reply = `👋 Hi ${ctx.username}! I'm your AI Coding Mentor. Ask me anything about **${ctx.lesson?.title || ctx.module?.title || 'your current topic'}** — I can explain concepts, generate examples, debug code, suggest exercises, and prepare you for interviews!`;
      }
    }

    // Save to chat log
    if (lesson_id) {
      try {
        await db.query(
          `INSERT INTO ai_chat_logs (user_id, lesson_id, role, message)
           VALUES (?, ?, 'user', ?)`,
          [uid, lesson_id, message || `[${mode}]`]
        );
        await db.query(
          `INSERT INTO ai_chat_logs (user_id, lesson_id, role, message)
           VALUES (?, ?, 'assistant', ?)`,
          [uid, lesson_id, reply]
        );
      } catch (e) { /* ai_chat_logs table may not exist yet */ }
    }

    res.json({ success: true, reply, mode, context: {
      lesson:  ctx.lesson?.title  || null,
      module:  ctx.module?.title  || null,
      roadmap: ctx.roadmap?.title || null,
    }});
  } catch (err) {
    console.error('aiMentor error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/ai/history/:lessonId ──────────────────────────────
const getChatHistory = async (req, res) => {
  try {
    const uid = req.user.id;
    const lid = req.params.lessonId;

    const [messages] = await db.query(
      `SELECT role, message, created_at FROM ai_chat_logs
       WHERE user_id = ? AND lesson_id = ?
       ORDER BY created_at ASC LIMIT 100`, [uid, lid]
    ).catch(() => [[]]);

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/ai/flashcards ─────────────────────────────────────
const generateFlashcards = async (req, res) => {
  try {
    const { lesson_id, module_id } = req.body;
    const uid = req.user.id;

    const ctx = {};
    if (lesson_id) {
      const [[lesson]] = await db.query(
        `SELECT ml.title, ml.short_desc, ml.language, rm.title AS module_title
         FROM module_lessons ml
         JOIN roadmap_modules rm ON ml.module_id = rm.id
         WHERE ml.id = ?`, [lesson_id]
      ).catch(() => [[null]]);
      if (lesson) ctx.lesson = lesson;
    }

    const cards = buildFlashcards(ctx);
    res.json({ success: true, flashcards: cards });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ══════════════════════════════════════════════════════════════
// Response Generator Functions
// ══════════════════════════════════════════════════════════════

function getTopicLabel(ctx) {
  return ctx.lesson?.title || ctx.module?.title || ctx.roadmap?.title || 'this topic';
}

function getLang(ctx) {
  return ctx.lesson?.language || ctx.module?.language || ctx.module?.lang || 'JavaScript';
}

function generateExplanation(ctx, level) {
  const topic = getTopicLabel(ctx);
  const lang  = getLang(ctx);
  const rm    = ctx.roadmap?.title || 'your roadmap';

  if (level === 'beginner') {
    return `## 🟢 Beginner-Friendly Explanation: ${topic}

Let me break this down in the simplest way possible!

**Think of it like this:** Imagine you're organizing a filing cabinet. Each **variable** is a drawer with a label. When you open a drawer, you find exactly what you stored there.

In **${lang}**, the concept behind *${topic}* works similarly:

\`\`\`${lang.toLowerCase()}
// Here's the simplest example:
function example() {
  // Step 1: Set up your data
  let data = "Hello from ${topic}!";
  
  // Step 2: Process it
  console.log(data);
  
  // Step 3: Return the result
  return data;
}
\`\`\`

**Key points to remember:**
- 🔑 Start with the basics before moving to edge cases
- 📝 Every complex concept is just simple concepts stacked together
- 💪 Practice each example before moving on

**Don't worry if this feels new** — everyone learns *${topic}* step by step. You're doing great! 🎉`;
  }

  return `## 📖 Detailed Explanation: ${topic}

Welcome to this lesson as part of the **${rm}** path.

### What is ${topic}?

${topic} is a fundamental concept in **${lang}** programming that enables you to write cleaner, more efficient code. Understanding this will unlock the ability to build real-world systems.

### Core Theory

The underlying mechanism works by:
1. **Initialization** — Setting up the required state or data structure
2. **Processing** — Applying logic to transform or query data
3. **Output** — Returning or rendering the computed result

\`\`\`${lang.toLowerCase()}
// Core implementation pattern for ${topic}
function implementConcept(input) {
  // Validate input first
  if (!input) throw new Error('Input required');
  
  // Apply the core logic
  const result = processData(input);
  
  // Return structured output
  return { success: true, data: result };
}
\`\`\`

### Why does this matter?

In production systems, this pattern appears in:
- **API design** — every route handler uses this pattern
- **Database queries** — data retrieval and transformation
- **UI components** — state management and rendering

### Common Pitfalls to Avoid
❌ Don't skip input validation  
❌ Avoid deeply nested conditionals (extract to functions)  
✅ Always handle the error case  
✅ Write tests for boundary conditions

*Ask me to "Give another example" or "Generate practice questions" to go deeper!*`;
}

function generateLineByLine(ctx) {
  const topic = getTopicLabel(ctx);
  const lang  = getLang(ctx);
  const code  = ctx.lesson?.starter_code || `function solve() {\n  return true;\n}`;

  return `## 🔍 Line-by-Line Breakdown: ${topic}

Let me walk through this code **one line at a time**:

\`\`\`${lang.toLowerCase()}
${code}
\`\`\`

---

**Line-by-Line Explanation:**

${generateLineExplanations(code, lang)}

---

💡 **Pro Tip:** Read code like a recipe — each line is a step. If a line confuses you, say "Explain this line: [paste the line]" and I'll clarify!`;
}

function generateLineExplanations(code, lang) {
  const lines = code.split('\n').filter(l => l.trim());
  return lines.map((line, i) => {
    const l = line.trim();
    let explanation = '';
    if (l.startsWith('//') || l.startsWith('#')) explanation = 'This is a **comment** — it explains what the code does, not executed by the computer.';
    else if (l.includes('function') || l.includes('def ') || l.includes('public ')) explanation = 'This **declares a function** — a reusable block of code that can be called multiple times.';
    else if (l.includes('return')) explanation = 'This **returns a value** from the function — the result is sent back to wherever the function was called.';
    else if (l.includes('const') || l.includes('let') || l.includes('var')) explanation = 'This **declares a variable** — a named container that stores a value in memory.';
    else if (l.includes('{')) explanation = 'This **opens a code block** — everything inside the `{}` belongs to this scope.';
    else if (l === '}') explanation = 'This **closes the code block** — marks the end of the function or scope.';
    else explanation = 'This line **executes logic** — performing the core operation of this function.';
    return `**Line ${i+1}:** \`${l}\`\n→ ${explanation}\n`;
  }).join('\n');
}

function generateExample(ctx) {
  const topic = getTopicLabel(ctx);
  const lang  = getLang(ctx);

  const examples = {
    javascript: `// Real-World Example: ${topic}
// Scenario: Building a student progress tracker

class ProgressTracker {
  constructor(studentName) {
    this.student = studentName;
    this.completed = [];
    this.xp = 0;
  }
  
  completeLesson(lessonName, xpReward) {
    this.completed.push({ lesson: lessonName, date: new Date() });
    this.xp += xpReward;
    console.log(\`✅ \${this.student} completed \${lessonName}! +\${xpReward} XP\`);
    return this.xp;
  }
  
  getStats() {
    return {
      student:   this.student,
      lessons:   this.completed.length,
      totalXP:   this.xp,
      level:     Math.floor(this.xp / 500) + 1
    };
  }
}

const tracker = new ProgressTracker("You");
tracker.completeLesson("${topic}", 100);
console.log(tracker.getStats());`,
    python: `# Real-World Example: ${topic}
# Scenario: Building a student progress tracker

class ProgressTracker:
    def __init__(self, student_name):
        self.student = student_name
        self.completed = []
        self.xp = 0
    
    def complete_lesson(self, lesson_name, xp_reward):
        self.completed.append({'lesson': lesson_name, 'date': 'today'})
        self.xp += xp_reward
        print(f"✅ {self.student} completed {lesson_name}! +{xp_reward} XP")
        return self.xp
    
    def get_stats(self):
        return {
            'student': self.student,
            'lessons': len(self.completed),
            'total_xp': self.xp,
            'level': self.xp // 500 + 1
        }

tracker = ProgressTracker("You")
tracker.complete_lesson("${topic}", 100)
print(tracker.get_stats())`,
  };

  const code = examples[lang.toLowerCase()] || examples.javascript;

  return `## 💡 Another Real-World Example: ${topic}

Here's a **practical example** showing how this works in a real application:

\`\`\`${lang.toLowerCase()}
${code}
\`\`\`

**What this demonstrates:**
1. How ${topic} applies in a real project context
2. The professional code structure you'll use in interviews
3. Clean, readable code with comments

**Try it yourself!** Click "Practice in Coding Lab" and modify this example. Can you add a \`resetProgress()\` method?`;
}

function generateAnalogy(ctx) {
  const topic = getTopicLabel(ctx);
  const analogies = [
    { name: 'Restaurant Kitchen', text: `Think of ${topic} like a **restaurant kitchen**. The chef (your function) receives an order (input), follows a recipe (algorithm), and serves the dish (output). Just like how chefs don't reinvent recipes from scratch every time, good code reuses patterns.` },
    { name: 'GPS Navigation', text: `${topic} works like a **GPS navigation system**. You enter a destination (input), the GPS calculates the optimal route (algorithm), and guides you step-by-step (output). If you take a wrong turn (error), it recalculates — just like error handling in code.` },
    { name: 'Library System', text: `Imagine ${topic} as a **library management system**. Books are data, the catalog is your data structure, and searching is your algorithm. The librarian (your function) knows exactly where to find any book in O(log n) time if books are sorted.` },
    { name: 'Post Office', text: `${topic} is like a **post office**. Letters are your data, addresses are your keys, sorting machines are your algorithms, and mailboxes are your storage. The whole system ensures every letter reaches the right destination efficiently.` },
  ];

  const analogy = analogies[Math.floor(Math.random() * analogies.length)];

  return `## 🎯 Real-World Analogy: ${topic}

### The ${analogy.name} Analogy

${analogy.text}

### Breaking Down the Parallel

| Code Concept | Real World Equivalent |
|---|---|
| Input Data | Ingredients / Order / Letter |
| Function | Chef / GPS / Librarian |
| Algorithm | Recipe / Route / Sorting |
| Output | Dish / Directions / Result |
| Error Handling | Recalculating / Out-of-stock notice |

### Why Analogies Help

When you encounter a difficult concept, map it to something physical. Your brain understands physical systems intuitively — then translates that to code understanding.

*Want another analogy? Just ask "Give me another analogy"!*`;
}

function generatePracticeQuestions(ctx) {
  const topic = getTopicLabel(ctx);
  const lang  = getLang(ctx);

  return `## 💪 Practice Questions: ${topic}

Test your understanding with these questions across difficulty levels:

### 🟢 Easy (Warm-up)
1. In your own words, explain what **${topic}** does. (Answer in 1-2 sentences)
2. What happens if you skip the initialization step? Write an example that shows the bug.
3. What is the time complexity of the basic operation in this topic?

### 🟡 Medium (Core)
4. Write a function in **${lang}** that implements the core logic of ${topic} from scratch.
5. Given an array \`[5, 2, 8, 1, 9, 3]\`, trace through your solution step by step.
6. How would you modify your solution to handle duplicate values?

### 🔴 Hard (Challenge)
7. Optimize your solution to reduce time complexity from O(n²) to O(n log n) or better.
8. How would you implement this in a **multithreaded** environment safely?
9. Design a system that uses ${topic} at scale (10 million records). What changes?

### 🎯 Interview Style
10. **"Walk me through your approach to ${topic}. What edge cases would you consider?"**
    - Hint: Think about empty inputs, null values, and very large datasets.

---
💡 Try solving these in the **Coding Lab** and then ask me to review your solution!`;
}

function generateInterviewQ(ctx) {
  const topic = getTopicLabel(ctx);
  const lang  = getLang(ctx);

  const questions = [
    `**Q: Explain ${topic} to a non-technical interviewer.**\n*What they're testing:* Your ability to communicate technical concepts clearly.\n*Strong answer structure:* Start with a simple analogy → add technical detail → give a real example.`,
    `**Q: What is the time and space complexity of your implementation of ${topic}?**\n*What they're testing:* Big O analysis skills.\n*Strong answer:* State both time AND space complexity, then explain your reasoning.`,
    `**Q: How would you test a function implementing ${topic}?**\n*What they're testing:* Testing mindset.\n*Strong answer:* Unit tests, edge cases (empty input, null, duplicates), boundary conditions.`,
    `**Q: Have you used ${topic} in a real project? Describe it.**\n*What they're testing:* Practical experience.\n*Strong answer:* Use the STAR method (Situation, Task, Action, Result).`,
    `**Q: How does ${topic} behave differently in ${lang} vs other languages?**\n*What they're testing:* Language depth.\n*Strong answer:* Mention memory management, type system, specific language features.`,
  ];

  const picked = questions[Math.floor(Math.random() * questions.length)];

  return `## 💼 Interview Question: ${topic}

${picked}

---

### How to Answer Confidently

1. **Pause** — Take 3-5 seconds to structure your answer
2. **Signal your approach** — "I'd approach this by..."
3. **Think out loud** — Interviewers want to see your reasoning
4. **Ask clarifying questions** — "Are there constraints on memory usage?"
5. **Code, then explain** — Write first, narrate second

### Red Flags to Avoid
❌ Jumping straight to code without clarifying requirements  
❌ Saying "I don't know" without attempting to reason through it  
❌ Forgetting to mention edge cases  
✅ Showing systematic thinking under pressure  

*Ask me "Predict interview questions" for a full list of likely questions!*`;
}

function predictInterviewQ(ctx) {
  const topic = getTopicLabel(ctx);
  const rm    = ctx.roadmap?.title || 'Software Engineering';

  return `## 🔮 Predicted Interview Questions: ${topic}

Based on the **${rm}** track and common FAANG/MAANG interview patterns, here are the most likely questions:

### High Probability (>70% chance)
1. "Implement ${topic} from scratch without using built-in libraries"
2. "What is the time complexity? Can you optimize further?"
3. "Walk me through your code line by line"
4. "What edge cases did you consider?"

### Medium Probability (40-70%)
5. "How would you modify this for a distributed system?"
6. "Compare this to [related concept]. When would you use each?"
7. "How would you test this function?"
8. "Can you solve this without extra space? (O(1) space)"

### Conceptual (Common in System Design rounds)
9. "Where does ${topic} appear in real production systems?"
10. "How would ${topic} scale to 1 billion users?"

### Behavioral (Often paired with technical)
11. "Tell me about a time you used this pattern to solve a real problem"
12. "What was the hardest bug you encountered with this pattern?"

---

### 📊 Interview Difficulty Rating for ${topic}

| Level | Question Type | Likelihood |
|-------|------|------|
| Easy | Definition + simple example | ████ 80% |
| Medium | Implementation + optimize | ████ 75% |
| Hard | Scale / distributed | ██ 40% |

*Practice all levels in the Coding Lab — consistency beats cramming!*`;
}

function suggestNextTopic(ctx) {
  const topic  = getTopicLabel(ctx);
  const rm     = ctx.roadmap?.title || 'your learning path';
  const lang   = getLang(ctx);

  return `## 🗺️ What to Learn Next After ${topic}

Great progress on **${topic}**! Here's your personalized learning path forward:

### 📌 Immediate Next Steps (This Week)
1. **Practice Problems** — Solve 3 problems using ${topic} on LeetCode/HackerRank
2. **Code Review** — Have your implementation reviewed (ask me to check it!)
3. **Build a Mini-Project** — Apply ${topic} in a 30-minute project

### 🔜 Next Topics (Logical Progression)

| Topic | Why Learn It Next | Difficulty |
|-------|------|------|
| Advanced ${topic} patterns | Deeper mastery | +1 level |
| Error handling & edge cases | Production readiness | Same level |
| Testing & debugging | Industry standard | Same level |
| Performance optimization | Senior-level skill | +1 level |

### 🎯 Recommended Learning Order

\`\`\`
${topic} ✅
    ↓
[Next logical topic in ${rm}]
    ↓
[Integration with other concepts]
    ↓
[Final capstone project]
\`\`\`

### 💡 How to Know You've Mastered ${topic}

You're ready to move on when you can:
- ✅ Explain it to a beginner without notes
- ✅ Implement it from scratch in under 5 minutes
- ✅ Identify it in other people's code immediately
- ✅ Know its time/space complexity without looking it up

*Open your sidebar to navigate to the next lesson — I'll be here when you arrive!*`;
}

function generateDebugHelp(ctx) {
  const topic = getTopicLabel(ctx);
  const lang  = getLang(ctx);
  const code  = ctx.user_code || ctx.lesson?.starter_code || '';

  return `## 🐛 Debug Mode: ${topic}

${code ? `I can see you're working with this code:\n\n\`\`\`${lang.toLowerCase()}\n${code.slice(0, 500)}\n\`\`\`\n\n` : ''}
### Common Bugs in ${topic}

Here are the **most frequent mistakes** I see in this topic:

**1. Off-by-one errors**
\`\`\`${lang.toLowerCase()}
// ❌ Bug: misses the last element
for (let i = 0; i < arr.length - 1; i++) { ... }

// ✅ Fix: use <= or just arr.length
for (let i = 0; i < arr.length; i++) { ... }
\`\`\`

**2. Null/undefined reference**
\`\`\`${lang.toLowerCase()}
// ❌ Bug: crashes if data is undefined
const result = data.value;

// ✅ Fix: always guard against nulls
const result = data?.value ?? 'default';
\`\`\`

**3. Mutating input unexpectedly**
\`\`\`${lang.toLowerCase()}
// ❌ Bug: modifies the original array
function process(arr) { arr.push(0); return arr; }

// ✅ Fix: work on a copy
function process(arr) { const copy = [...arr]; copy.push(0); return copy; }
\`\`\`

### Debugging Checklist
- [ ] Console.log the input at the start
- [ ] Check for null/undefined before accessing properties
- [ ] Verify loop boundaries (< vs <=)
- [ ] Test with empty input []
- [ ] Test with single element [x]
- [ ] Test with negative numbers / special characters

**Paste your specific code** and I'll pinpoint the exact bug!`;
}

function generateOptimizeHelp(ctx) {
  const topic = getTopicLabel(ctx);
  const lang  = getLang(ctx);

  return `## ⚡ Optimization Guide: ${topic}

Let's transform your working solution into an **optimized, production-ready** one.

### Step 1: Measure First
Before optimizing, identify the bottleneck:
\`\`\`${lang.toLowerCase()}
// Measure execution time
console.time('${topic}');
// ... your code ...
console.timeEnd('${topic}');
\`\`\`

### Step 2: Common Optimizations

**Replace nested loops with hash maps (O(n²) → O(n)):**
\`\`\`${lang.toLowerCase()}
// ❌ O(n²) — too slow for large inputs
for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr.length; j++) { ... }
}

// ✅ O(n) — use a Map for O(1) lookup
const map = new Map();
for (const item of arr) {
  if (map.has(item)) { /* found! */ }
  map.set(item, true);
}
\`\`\`

**Avoid recalculating in loops (Memoization):**
\`\`\`${lang.toLowerCase()}
// ❌ Recalculates every iteration
for (let i = 0; i < arr.length; i++) {
  if (expensiveOperation(arr) === target) { ... }
}

// ✅ Calculate once, reuse
const computed = expensiveOperation(arr);
for (let i = 0; i < arr.length; i++) {
  if (computed === target) { ... }
}
\`\`\`

### Complexity Improvement Checklist
| Technique | When to Use | Improvement |
|-----------|-------------|-------------|
| Hash Map  | Lookup by key | O(n²) → O(n) |
| Two Pointer | Sorted arrays | O(n²) → O(n) |
| Sliding Window | Subarrays | O(n²) → O(n) |
| Binary Search | Sorted data | O(n) → O(log n) |
| Memoization | Repeated calls | O(2ⁿ) → O(n) |

*Paste your code and tell me the current complexity — I'll find the exact optimization!*`;
}

function generateErrorExplanation(ctx) {
  const lang = getLang(ctx);

  return `## ⚠️ Common Errors Explained: ${getTopicLabel(ctx)}

Here are the most common errors you'll encounter and **exactly how to fix them**:

### TypeError: Cannot read property of undefined
\`\`\`${lang.toLowerCase()}
// ❌ Cause: accessing property on undefined
const user = getUser();
console.log(user.name); // Error if getUser() returns undefined

// ✅ Fix 1: Optional chaining
console.log(user?.name);

// ✅ Fix 2: Guard clause
if (!user) return null;
console.log(user.name);
\`\`\`

### RangeError: Maximum call stack exceeded (Stack Overflow)
\`\`\`${lang.toLowerCase()}
// ❌ Cause: infinite recursion (no base case)
function countdown(n) {
  return countdown(n - 1); // Never stops!
}

// ✅ Fix: always have a base case
function countdown(n) {
  if (n <= 0) return 0; // Base case stops recursion
  return countdown(n - 1);
}
\`\`\`

### SyntaxError / IndentationError
\`\`\`${lang.toLowerCase()}
// ❌ Common syntax mistakes
if (x > 0   // Missing closing )
  return x   // Missing ;

// ✅ Use a linter (ESLint / Pylint) to catch these automatically
\`\`\`

### Logic Errors (No error message, wrong output)
- **Symptom:** Code runs but gives wrong answer
- **Technique:** Add console.log at each step to trace the values
- **Tool:** Use browser debugger (F12) to step through execution

*Paste your specific error message and I'll give you the exact fix!*`;
}

function generateChatResponse(ctx, message) {
  const topic = getTopicLabel(ctx);
  const lang  = getLang(ctx);

  // Smart pattern matching for common questions
  const msg = message.toLowerCase();

  if (msg.includes('what is') || msg.includes('explain')) {
    return generateExplanation(ctx, 'detailed');
  }
  if (msg.includes('example') || msg.includes('show me')) {
    return generateExample(ctx);
  }
  if (msg.includes('bug') || msg.includes('error') || msg.includes('debug') || msg.includes('not working')) {
    return generateDebugHelp(ctx);
  }
  if (msg.includes('interview') || msg.includes('question')) {
    return generateInterviewQ(ctx);
  }
  if (msg.includes('optimize') || msg.includes('faster') || msg.includes('complexity')) {
    return generateOptimizeHelp(ctx);
  }
  if (msg.includes('simple') || msg.includes('easy') || msg.includes('beginner')) {
    return generateExplanation(ctx, 'beginner');
  }
  if (msg.includes('next') || msg.includes('after this')) {
    return suggestNextTopic(ctx);
  }
  if (msg.includes('practice') || msg.includes('exercise')) {
    return generatePracticeQuestions(ctx);
  }
  if (msg.includes('why') || msg.includes('analogy')) {
    return generateAnalogy(ctx);
  }

  // Default contextual response
  return `## 💬 AI Mentor Response

Regarding your question about **"${message}"** in the context of **${topic}**:

This is a great question! In **${lang}** programming, this relates to the core principles we've been covering.

**Key insight:** ${message.length > 20 ? message.charAt(0).toUpperCase() + message.slice(1) : 'Your question'} connects directly to how ${topic} manages data flow and control logic in real applications.

**Practical answer:**

The most important thing to understand is that every complex system is built from simple, predictable patterns. When you encounter something confusing, break it down:

1. **What is the input?** — Identify what data enters the function
2. **What should the output be?** — Define the expected result clearly
3. **What transformation happens in between?** — That's the algorithm

If you can answer these 3 questions, you can implement almost any feature.

**Try this exercise:** Describe your specific problem in more detail and I'll give you a step-by-step solution!

*Available quick actions: Explain · Simplify · Debug Code · Optimize · Generate Examples · Practice Questions*`;
}

function generateFlashcardContent(ctx) {
  const topic = getTopicLabel(ctx);
  return `Flashcards mode is available via the /api/ai/flashcards endpoint. For topic: ${topic}.`;
}

function buildFlashcards(ctx) {
  const topic = getTopicLabel(ctx);
  const lang  = getLang(ctx);

  return [
    {
      front: `What is ${topic}?`,
      back:  `${topic} is a fundamental concept in ${lang} that enables structured data handling and algorithmic problem solving. It forms the backbone of most real-world applications.`
    },
    {
      front: `What is the time complexity of a basic operation in ${topic}?`,
      back:  `Depends on implementation: O(1) for hash-based lookups, O(log n) for binary search, O(n) for linear scan, O(n log n) for sorting. Always analyze based on your specific algorithm.`
    },
    {
      front: `Name 3 real-world applications of ${topic}`,
      back:  `1. API data processing and routing\n2. Database query optimization\n3. User interface state management`
    },
    {
      front: `What is the most common mistake beginners make with ${topic}?`,
      back:  `Off-by-one errors in loops, not handling null/undefined inputs, and mutating data instead of working on copies.`
    },
    {
      front: `How would you explain ${topic} in an interview?`,
      back:  `Start with an analogy, then provide the technical definition, give a code example, state the complexity, and mention one real-world use case. Practice the STAR format.`
    },
    {
      front: `What data structure is most commonly paired with ${topic}?`,
      back:  `Arrays for sequential access, Hash Maps for O(1) lookups, Trees for hierarchical data, Graphs for network relationships.`
    },
    {
      front: `What is a good test case for ${topic}?`,
      back:  `Always test: empty input, single element, sorted vs unsorted, negative numbers, very large input, and duplicate values.`
    },
  ];
}

module.exports = {
  aiMentor,
  getChatHistory,
  generateFlashcards,
};
