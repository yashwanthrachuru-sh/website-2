// ============================================================
// backend/services/offlineGenerators.js
// EduNet — Rich Offline AI Response Generators
// ============================================================
// These generators produce high-quality, structured educational
// content WITHOUT any external API key. They are used as the
// primary fallback when no external AI provider is configured.
//
// Quality target: GeeksforGeeks / MDN level explanations.
// ============================================================
'use strict';

// ── Utility helpers ─────────────────────────────────────────────
function topicLabel(ctx) {
  return ctx.lesson?.title?.replace(/Lesson\s*\d+:?\s*/gi, '').split('—')[0].trim()
    || ctx.module?.title || ctx.roadmap?.title || 'Programming';
}

function lang(ctx) {
  return (ctx.lesson?.language || ctx.module?.language || 'javascript').toLowerCase();
}

function username(ctx) {
  return ctx.username || 'Student';
}

function xpLevel(ctx) {
  const xp = ctx.userContext?.xp || 0;
  if (xp < 500)  return 'beginner';
  if (xp < 2000) return 'intermediate';
  return 'advanced';
}

// ── CODE EXAMPLES by language ────────────────────────────────────
const CODE_TEMPLATES = {
  javascript: {
    simple: (topic) => `// Simple example: ${topic}
const data = [1, 2, 3, 4, 5];

// Core operation
function process(items) {
  return items.filter(x => x > 2).map(x => x * 2);
}

console.log(process(data)); // Output: [6, 8, 10]`,
    intermediate: (topic) => `// Intermediate: ${topic} with error handling
class ${topic.replace(/\s+/g, '')}Manager {
  constructor() {
    this.cache = new Map();
  }

  compute(input) {
    if (this.cache.has(input)) {
      return this.cache.get(input); // O(1) cache hit
    }
    const result = this._process(input);
    this.cache.set(input, result);
    return result;
  }

  _process(input) {
    if (!input) throw new Error('Input required');
    return input; // Your logic here
  }
}

const manager = new ${topic.replace(/\s+/g, '')}Manager();
console.log(manager.compute('test'));`,
    advanced: (topic) => `// Production pattern: ${topic}
// Design Pattern: Strategy + Observer
class ${topic.replace(/\s+/g, '')}Engine {
  #strategy;
  #observers = [];

  constructor(strategy) {
    this.#strategy = strategy;
  }

  subscribe(observer) {
    this.#observers.push(observer);
    return () => this.#observers = this.#observers.filter(o => o !== observer);
  }

  async execute(data) {
    try {
      const result = await this.#strategy.run(data);
      this.#observers.forEach(fn => fn({ type: 'success', result }));
      return result;
    } catch (error) {
      this.#observers.forEach(fn => fn({ type: 'error', error }));
      throw error;
    }
  }
}

// Usage
const engine = new ${topic.replace(/\s+/g, '')}Engine({
  run: async (data) => data /* implement logic */
});
engine.subscribe(event => console.log('Event:', event));`
  },
  python: {
    simple: (topic) => `# Simple example: ${topic}
data = [1, 2, 3, 4, 5]

def process(items):
    """Filter and transform the list."""
    return [x * 2 for x in items if x > 2]

result = process(data)
print(result)  # Output: [6, 8, 10]`,
    intermediate: (topic) => `# Intermediate: ${topic}
from functools import lru_cache
from typing import Optional

class ${topic.replace(/\s+/g, '')}Manager:
    def __init__(self):
        self._cache: dict = {}
    
    @lru_cache(maxsize=128)
    def compute(self, input_val: str) -> Optional[str]:
        """Compute with memoization - O(1) on cached values."""
        if not input_val:
            raise ValueError("Input cannot be empty")
        return self._process(input_val)
    
    def _process(self, data: str) -> str:
        return data  # Your logic here

manager = ${topic.replace(/\s+/g, '')}Manager()
print(manager.compute("test"))`,
    advanced: (topic) => `# Production pattern: ${topic}
# Using dataclasses, type hints, and context managers
from dataclasses import dataclass, field
from contextlib import contextmanager
from typing import Generator, Any
import logging

logger = logging.getLogger(__name__)

@dataclass
class ${topic.replace(/\s+/g, '')}Config:
    max_retries: int = 3
    timeout: float = 30.0
    debug: bool = False

class ${topic.replace(/\s+/g, '')}Engine:
    def __init__(self, config: ${topic.replace(/\s+/g, '')}Config):
        self.config = config
        self._session = None
    
    @contextmanager
    def session(self) -> Generator[Any, None, None]:
        """Context manager for resource cleanup."""
        try:
            self._session = self._init_session()
            yield self._session
        except Exception as e:
            logger.error(f"Session error: {e}")
            raise
        finally:
            self._cleanup()
    
    def _init_session(self): return {}
    def _cleanup(self): self._session = None

config = ${topic.replace(/\s+/g, '')}Config(max_retries=3, debug=True)
engine = ${topic.replace(/\s+/g, '')}Engine(config)
with engine.session() as s:
    print(f"Session active: {s}")`
  }
};

function getCode(ctx, level = 'simple') {
  const l = lang(ctx);
  const t = topicLabel(ctx);
  const templates = CODE_TEMPLATES[l] || CODE_TEMPLATES['javascript'];
  const fn = templates[level] || templates['simple'];
  return fn(t);
}

// ─────────────────────────────────────────────────────────────────
// INTERVIEW QUESTIONS GENERATOR
// Generates 8-15 structured interview questions with full answers
// ─────────────────────────────────────────────────────────────────
function generateInterviewQuestions(ctx) {
  const topic = topicLabel(ctx);
  const l     = lang(ctx);
  const rm    = ctx.roadmap?.title || 'Software Engineering';
  const level = xpLevel(ctx);

  const code1 = getCode(ctx, 'simple');
  const code2 = getCode(ctx, 'intermediate');
  const code3 = getCode(ctx, 'advanced');

  // Base questions every topic needs
  const questions = [
    {
      question: `What is ${topic} and why is it important in ${l} programming?`,
      answer: `## What is ${topic}?\n\n**${topic}** is a fundamental concept in ${l} programming that enables developers to write efficient, maintainable, and scalable code.\n\n### Key Points:\n- **Definition**: ${topic} provides a structured way to organize and process data in your programs\n- **Why it matters**: Used in virtually every production application at some scale\n- **Industry relevance**: Companies like Google, Amazon, and Meta rely on mastery of ${topic} for their core systems\n\n### Real-World Usage:\n1. **API Development** — Data transformation pipelines\n2. **Database Queries** — Efficient data retrieval patterns\n3. **UI Components** — State management and rendering logic\n\n**Interview Tip**: Start with a clear definition, give a real-world analogy, then show a code example.`,
      level: 'beginner',
      category: 'Conceptual',
      followUp: `Can you explain ${topic} to a non-technical person using an everyday analogy?`,
      followUpAnswer: `Think of ${topic} like a recipe card in cooking — it defines the steps (algorithm) to transform ingredients (input data) into a dish (output). Just as a chef follows a recipe consistently, ${l} programs follow ${topic} consistently.`
    },
    {
      question: `Implement ${topic} from scratch in ${l} without using any built-in libraries.`,
      answer: `## Implementation from Scratch\n\nHere's a clean implementation of ${topic}:\n\n\`\`\`${l}\n${code1}\n\`\`\`\n\n### Breakdown:\n1. **Input Validation** — Always check edge cases first\n2. **Core Logic** — Implement the fundamental algorithm\n3. **Output** — Return structured, predictable results\n\n### Time Complexity: O(n)\n### Space Complexity: O(1) extra space\n\n**Common Interview Mistake**: Jumping to code without clarifying requirements. Always ask: "Are there constraints on input size? Should I handle nulls?"`,
      level: 'beginner',
      category: 'Coding'
    },
    {
      question: `What is the time and space complexity of ${topic}? Can you optimize it?`,
      answer: `## Complexity Analysis\n\n| Operation | Time Complexity | Space Complexity |\n|-----------|-----------------|------------------|\n| Basic operation | O(n) | O(1) |\n| With sorting | O(n log n) | O(log n) |\n| With hash map | O(n) | O(n) |\n| Optimized | O(log n) | O(1) |\n\n### Optimization Strategies:\n\n**From O(n²) to O(n) — Use Hash Maps:**\n\`\`\`${l}\n// ❌ Naive: O(n²) — nested loops\nfor i in range(n):\n    for j in range(n):  # Avoid this!\n        check(i, j)\n\n// ✅ Optimal: O(n) — hash map lookup\nmap = {}\nfor i in range(n):\n    if complement in map:\n        return (map[complement], i)  # O(1) lookup\n    map[current] = i\n\`\`\`\n\n**Interview Tip**: Always state complexity BEFORE writing code. It shows structured thinking.`,
      level: 'intermediate',
      category: 'Complexity'
    },
    {
      question: `How would you test a function implementing ${topic}? What edge cases would you consider?`,
      answer: `## Testing Strategy for ${topic}\n\n### Unit Test Coverage:\n\`\`\`${l}\n// Test categories to cover:\n\n// 1. Happy path (expected inputs)\nassert process([1,2,3]) === expected_output\n\n// 2. Empty input\nassert process([]) === []\n\n// 3. Single element\nassert process([1]) === [1]\n\n// 4. Null/undefined\nassert process(null) throws Error\n\n// 5. Duplicate values  \nassert process([1,1,2]) handles duplicates correctly\n\n// 6. Large inputs (performance test)\nconst bigArray = Array(10000).fill(1);\nconsole.time('performance');\nprocess(bigArray);\nconsole.timeEnd('performance'); // Should be < 10ms\n\`\`\`\n\n### Edge Cases Checklist:\n- ☐ Empty input \`[]\` / \`null\` / \`undefined\`\n- ☐ Single element \`[x]\`\n- ☐ All same values \`[1,1,1]\`\n- ☐ Negative numbers \`[-1,-2,-3]\`\n- ☐ Very large input (10M+ records)\n- ☐ Already sorted / reverse sorted\n\n**Interview Insight**: Mentioning edge cases before coding signals senior-level thinking.`,
      level: 'intermediate',
      category: 'Testing'
    },
    {
      question: `Compare ${topic} with alternative approaches. When would you NOT use it?`,
      answer: `## When to Use ${topic} vs Alternatives\n\n| Approach | Time | Space | Best For |\n|----------|------|-------|----------|\n| ${topic} | O(n) | O(1) | General cases |\n| Hash Map approach | O(1) avg | O(n) | Lookup-heavy |\n| Binary Search | O(log n) | O(1) | Sorted data |\n| Two Pointers | O(n) | O(1) | Array problems |\n\n### Use ${topic} when:\n✅ Data needs sequential processing\n✅ Memory is constrained\n✅ Predictable performance is required\n\n### Do NOT use ${topic} when:\n❌ Random access is the primary operation (use arrays)\n❌ You need O(1) lookups (use hash maps)\n❌ Data is sorted and you need search (use binary search)\n\n**Interview Strategy**: Always discuss tradeoffs proactively — it shows you think about real-world constraints.`,
      level: 'intermediate',
      category: 'Conceptual'
    },
    {
      question: `Design a system that uses ${topic} at scale — handling 10 million records.`,
      answer: `## System Design: ${topic} at Scale\n\n### Architecture for 10M+ Records:\n\n\`\`\`\n┌─────────────────────────────────────────────────────┐\n│                 Load Balancer                        │\n└─────────────┬───────────────────┬────────────────────┘\n              │                   │\n     ┌────────▼───────┐  ┌────────▼───────┐\n     │   Worker 1     │  │   Worker 2     │\n     │ (${topic.slice(0,8)} shard) │  │ (${topic.slice(0,8)} shard) │\n     └────────┬───────┘  └────────┬───────┘\n              │                   │\n     ┌────────▼───────────────────▼───────┐\n     │           Redis Cache Layer         │\n     │     (Hot data: < 100ms latency)     │\n     └────────────────────────────────────┘\n              │\n     ┌────────▼──────────┐\n     │   Primary DB       │\n     │  (Sharded MySQL)   │\n     └────────────────────┘\n\`\`\`\n\n### Key Design Decisions:\n1. **Horizontal Sharding** — Distribute ${topic} processing across multiple nodes using consistent hashing\n2. **Redis Cache** — Cache frequently accessed results (cache-aside pattern)\n3. **Async Processing** — Use message queues (Kafka/RabbitMQ) for non-real-time operations\n4. **Pagination** — Never process all 10M records at once; use cursor-based pagination\n5. **Monitoring** — Track P99 latency, error rate, and throughput per shard\n\n### Database Optimization:\n- Index on primary lookup fields\n- Partition tables by date/ID range\n- Use read replicas for analytics queries\n\n**Interview Highlight**: Always mention monitoring, failure recovery, and scaling triggers.`,
      level: 'advanced',
      category: 'System Design'
    },
    {
      question: `Walk me through a production bug you could encounter with ${topic} and how you'd debug it.`,
      answer: `## Production Bug Walkthrough: ${topic}\n\n### Scenario: Memory leak in ${topic} under high load\n\n**Symptom**: Server memory usage grows from 200MB to 4GB over 24 hours, then crashes.\n\n**Debugging Process:**\n\n\`\`\`${l}\n// Step 1: Reproduce the issue\nconsole.log('Memory before:', process.memoryUsage().heapUsed / 1024 / 1024, 'MB');\n// ... run ${topic} 10,000 times ...\nconsole.log('Memory after:', process.memoryUsage().heapUsed / 1024 / 1024, 'MB');\n\n// Step 2: Identify the leak (common culprits)\n// ❌ Bug: Accumulating results without cleanup\nconst results = [];\nfor (const item of hugeDataset) {\n  results.push(process(item));  // Memory grows unboundedly!\n}\n\n// ✅ Fix: Stream/chunk the processing\nfor (const chunk of chunked(hugeDataset, 1000)) {\n  const chunkResults = chunk.map(process);\n  await saveToDatabase(chunkResults);\n  // chunkResults is garbage collected after each iteration\n}\n\`\`\`\n\n**Root Cause**: Holding all processed results in memory instead of streaming them to storage.\n\n**Prevention**:\n- Set memory limits with \`--max-old-space-size\`\n- Use streaming APIs for large datasets\n- Add heap snapshots to monitoring\n\n**Interview Value**: Demonstrates production experience and systematic debugging.`,
      level: 'advanced',
      category: 'Debugging'
    },
    {
      question: `How does ${topic} differ across ${l} compared to other languages? What makes ${l}'s approach unique?`,
      answer: `## ${topic} Across Languages\n\n| Language | Approach | Key Difference |\n|----------|----------|----------------|\n| ${l.charAt(0).toUpperCase() + l.slice(1)} | Native support | ${l === 'python' ? 'List comprehensions, generators' : 'Prototype chain, functional methods'} |\n| Java | Verbose, OOP-heavy | Explicit typing, Stream API |\n| C++ | Manual memory | Low-level control, raw pointers |\n| Go | Goroutines | Concurrent by design |\n| Rust | Ownership model | Zero-cost abstractions, no GC |\n\n### ${l.charAt(0).toUpperCase() + l.slice(1)}'s Unique Advantages:\n${l === 'python' ? `- **Generator expressions**: Memory-efficient iteration\n- **List comprehensions**: Concise, readable\n- **Built-in \`itertools\`**: Composable operations\n- **\`__dunder__\` methods**: Operator overloading` : `- **First-class functions**: Functions as values\n- **Closures**: Lexical scoping\n- **Array methods**: \`.map()\`, \`.filter()\`, \`.reduce()\`\n- **Async/await**: Native async patterns`}\n\n**Interview Insight**: Knowing language-specific idioms shows depth of expertise beyond textbook knowledge.`,
      level: 'intermediate',
      category: 'Conceptual'
    },
    {
      question: `Explain ${topic} to a junior developer who just joined your team. What's the most important thing they should know?`,
      answer: `## Teaching ${topic} to a Junior Developer\n\n### The 3-Sentence Explanation:\n"**${topic}** is how we [what it does]. Think of it like [real-world analogy]. The most important thing is [key insight]."\n\n### Step-by-Step Onboarding Guide:\n\n**Week 1 — Build Intuition:**\n\`\`\`${l}\n${code1}\n\`\`\`\n\n**Week 2 — Real Patterns:**\n- Study 3 existing uses of ${topic} in our codebase\n- Write 5 exercises from scratch\n- Review with a senior engineer\n\n**Week 3 — Production Readiness:**\n- Error handling for edge cases\n- Performance testing with realistic data\n- Code review checklist adherence\n\n### The Most Important Thing:\n> Always validate inputs before applying ${topic}. A robust implementation handles \`null\`, \`undefined\`, empty arrays, and invalid types gracefully.\n\n**Leadership Insight**: Teaching reinforces your own understanding. Being able to explain simply is a senior engineering trait.`,
      level: 'beginner',
      category: 'Behavioral'
    },
    {
      question: `How would you refactor legacy code that uses ${topic} inefficiently?`,
      answer: `## Refactoring Inefficient ${topic} Implementation\n\n### Before — Legacy Code (Problems identified):\n\`\`\`${l}\n// ❌ Multiple issues:\n// 1. O(n²) time complexity — nested loops\n// 2. Global state mutation — side effects\n// 3. No error handling\n// 4. Magic numbers\n// 5. No separation of concerns\nvar globalData = [];\nfunction doStuff(x) {  // Poor naming\n  for (var i = 0; i < x.length; i++) {\n    for (var j = 0; j < globalData.length; j++) {\n      if (x[i] == globalData[j]) {  // == vs ===\n        globalData.push(x[i] * 2);  // Mutates global!\n      }\n    }\n  }\n}\n\`\`\`\n\n### After — Refactored (Production quality):\n\`\`\`${l}\n${code2}\n\`\`\`\n\n### Refactoring Checklist:\n- ☐ Eliminate global state → use parameters/return values\n- ☐ Replace O(n²) loops → use hash maps or built-in methods\n- ☐ Add input validation → throw descriptive errors\n- ☐ Add JSDoc/type hints → document intent\n- ☐ Write tests before refactoring → ensure behavior preserved\n- ☐ Measure performance before/after → prove improvement\n\n**Professional Practice**: Always run the test suite before and after refactoring. Never refactor without tests.`,
      level: 'advanced',
      category: 'Coding'
    },
    {
      question: `What are the most common interview mistakes candidates make when answering questions about ${topic}?`,
      answer: `## Common Interview Mistakes on ${topic}\n\n### Mistake #1: Jumping to Code Without Clarifying\n❌ **Wrong**: *Immediately starts coding*\n✅ **Right**: "Before I code, let me clarify — should I handle duplicates? What's the expected output format?"\n\n### Mistake #2: Not Stating Complexity\n❌ **Wrong**: Shows code with O(n²) without noticing\n✅ **Right**: "My initial approach is O(n²). Let me think if we can optimize... Yes, using a hash map reduces this to O(n)"\n\n### Mistake #3: Forgetting Edge Cases\n❌ **Wrong**: Solution breaks on empty input\n✅ **Right**: "I'll add guards for null, undefined, and empty arrays first"\n\n### Mistake #4: Silent Coding\n❌ **Wrong**: Types code silently for 5 minutes\n✅ **Right**: "I'm going to use a two-pointer approach because... I'm initializing left and right pointers at... Now I'll iterate..."\n\n### Mistake #5: Not Knowing Time/Space Complexity\n❌ **Wrong**: "Um, it's pretty fast, maybe O(n)?"\n✅ **Right**: "It's O(n log n) due to the sort, and O(1) extra space since we sort in-place"\n\n**The Golden Rule**: Think out loud. Interviewers hire people they can work with, and communication is the #1 signal.`,
      level: 'beginner',
      category: 'Behavioral'
    },
    {
      question: `Write a production-ready implementation of ${topic} with proper error handling, logging, and documentation.`,
      answer: `## Production-Ready Implementation\n\n\`\`\`${l}\n${code3}\n\`\`\`\n\n### Production Checklist:\n| Concern | Implemented? |\n|---------|-------------|\n| Input validation | ✅ Throws descriptive errors |\n| Error boundaries | ✅ Try/catch with logging |\n| Logging | ✅ Structured log messages |\n| Performance | ✅ Memoization/caching |\n| Documentation | ✅ JSDoc/type hints |\n| Tests | ☐ Write unit tests! |\n| Monitoring | ☐ Add metrics |\n\n### What Makes Code "Production-Ready":\n1. **Graceful degradation** — Fails without crashing the system\n2. **Observability** — Logs enough to debug issues remotely\n3. **Documented behavior** — Clear contracts (what input → what output)\n4. **Tested edge cases** — At least happy path + 3 edge cases\n\n**Senior Engineer Insight**: Production code isn't just working code — it's code that's maintainable by your team at 3am during an incident.`,
      level: 'advanced',
      category: 'Coding'
    }
  ];

  // Add personalized questions based on user context
  const completedLessons = ctx.userContext?.completedLessons || [];
  if (completedLessons.length > 0) {
    const prevTopic = completedLessons[completedLessons.length - 1];
    questions.push({
      question: `How does ${topic} relate to ${prevTopic} you recently studied?`,
      answer: `## Connecting ${topic} with ${prevTopic}\n\n### The Relationship:\nBoth ${topic} and ${prevTopic} are fundamental pillars of the **${rm}** track. Understanding how they connect is what separates intermediate from senior engineers.\n\n### ${topic} builds on ${prevTopic} by:\n1. **Extending the pattern** — ${prevTopic} establishes the foundation; ${topic} applies it in more complex scenarios\n2. **Complementary operations** — They're often used together in production systems\n3. **Shared complexity models** — Both follow O(n) in their basic form\n\n### Real-World Integration:\n\`\`\`${l}\n// Combining both concepts in practice:\nconst result = combine_${prevTopic?.replace(/\s+/g, '_').toLowerCase()}_with_${topic.replace(/\s+/g, '_').toLowerCase()}(data);\n\`\`\`\n\n**Personalized Insight**: Since you've completed ${prevTopic}, you already understand the core patterns. ${topic} is the natural next step — trust your foundation!`,
      level: 'intermediate',
      category: 'Conceptual'
    });
  }

  // System design question for advanced track
  if (ctx.roadmap?.title?.toLowerCase().includes('system') || xpLevel(ctx) === 'advanced') {
    questions.push({
      question: `How would you implement ${topic} as a distributed microservice? What challenges would you face?`,
      answer: `## Distributed ${topic} as a Microservice\n\n### Service Architecture:\n\`\`\`yaml\n# docker-compose.yml\nservices:\n  ${topic.replace(/\s+/g, '-').toLowerCase()}-service:\n    image: nodejs:18-alpine\n    environment:\n      - REDIS_URL=redis://cache:6379\n      - DB_URL=postgres://db:5432\n    ports: ["3001:3001"]\n    depends_on: [cache, db]\n  \n  cache:\n    image: redis:alpine\n    command: redis-server --maxmemory 512mb\n  \n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_DB: ${topic.replace(/\s+/g, '_').toLowerCase()}_db\n\`\`\`\n\n### Distributed Challenges:\n1. **Data Consistency** — Use SAGA pattern or 2-Phase Commit for distributed transactions\n2. **Network Failures** — Implement circuit breaker (Hystrix pattern)\n3. **Service Discovery** — Use Consul or Kubernetes DNS\n4. **Observability** — Distributed tracing with OpenTelemetry\n5. **Idempotency** — Ensure duplicate requests produce same result\n\n### CAP Theorem Trade-offs:\n- **CP (Consistency + Partition Tolerance)**: Bank transactions, financial data\n- **AP (Availability + Partition Tolerance)**: Social feeds, recommendations\n\n**Interview Signal**: Mentioning CAP theorem and real distributed systems patterns distinguishes senior candidates.`,
      level: 'advanced',
      category: 'System Design'
    });
  }

  return questions;
}

// ─────────────────────────────────────────────────────────────────
// CAREER COACHING GENERATOR
// ─────────────────────────────────────────────────────────────────
function generateCareerCoachingResponse(ctx, message) {
  const topic   = topicLabel(ctx);
  const rm      = ctx.roadmap?.title || 'Software Engineering';
  const xp      = ctx.userContext?.xp || 0;
  const rank    = ctx.userContext?.rank || 'Beginner';

  return `## 🎯 Career Coach: Personalized Guidance

### Your Current Profile
- **Roadmap**: ${rm}
- **XP**: ${xp} | **Rank**: ${rank}
- **Current Focus**: ${topic}

---

### 📊 Career Roadmap Based on Your Progress

#### Short-Term (Next 4 weeks)
1. **Complete the ${rm} track** — You're building real marketable skills
2. **Build 1 portfolio project** using ${topic} — Employers love seeing applied knowledge
3. **Practice 5 LeetCode problems** on ${topic} — Solidify your interview confidence

#### Mid-Term (3-6 months)
1. **Land an internship or freelance project** — Real-world experience accelerates learning 10x
2. **Contribute to open source** — Shows collaborative coding skills
3. **Write a technical blog post** on ${topic} — Demonstrates deep understanding

#### Long-Term (6-12 months)
1. **Full-time role** as Junior ${rm.split(' ')[0]} Developer
2. **Certifications** in cloud platforms (AWS/GCP) complement your ${rm} skills
3. **Mentor others** — Teaching solidifies your own knowledge

---

### 💼 Job Market Reality Check

**Roles that value ${rm} skills:**
| Role | Average Salary (₹) | XP Required |
|------|---------------------|-------------|
| Junior Developer | ₹4-8 LPA | ≤ 1000 XP |
| Mid-Level Developer | ₹8-18 LPA | 1000-3000 XP |
| Senior Developer | ₹18-40 LPA | 3000+ XP |

**Your current XP (${xp}) puts you in the ${rank} tier.** Keep pushing!

---

### 🔑 The #1 Career Advice for ${rm}

> **Portfolio beats certificates**. Build real projects that solve real problems. A GitHub profile with 3 solid projects will open more doors than 10 certificates.

**Your next action**: After completing the current lesson on ${topic}, open your GitHub and push your practice code there. Start building in public today.

*Ask me anything: "What jobs can I apply for now?", "How do I negotiate salary?", "What should my portfolio include?"*`;
}

// ─────────────────────────────────────────────────────────────────
// ROADMAP GUIDANCE GENERATOR
// ─────────────────────────────────────────────────────────────────
function generateRoadmapGuidanceResponse(ctx, message) {
  const topic       = topicLabel(ctx);
  const rm          = ctx.roadmap?.title || 'Software Engineering';
  const weakTopics  = ctx.userContext?.weakTopics || [];
  const strongTopics = ctx.userContext?.strongTopics || [];

  return `## 🗺️ Personalized Roadmap Guidance

### Your Learning Analysis

**Current position**: ${topic} in the **${rm}** track

${weakTopics.length ? `**Areas to strengthen**: ${weakTopics.join(', ')}` : ''}
${strongTopics.length ? `**Your strengths**: ${strongTopics.join(', ')}` : ''}

---

### 📍 Recommended Learning Path

\`\`\`
You are here: ${topic}
         ↓
[Next: Complete practice exercises]
         ↓
[Quiz: Verify understanding]
         ↓
[Interview Prep: Practice questions]
         ↓
[Move to next module in ${rm}]
         ↓
[Final Assessment: Get certificate]
\`\`\`

### ⚡ Priority Recommendations

**This week — focus on:**
1. **Master ${topic}** thoroughly before moving forward
2. Spend at least 30 minutes on the Practice tab
3. Attempt all quiz questions — aim for 80%+

${weakTopics.length ? `
**Spend extra time on your weak areas:**
${weakTopics.map(w => `- **${w}**: Review the Revision Notes tab and practice 3 exercises`).join('\n')}
` : ''}

### 🎯 Pacing Recommendation

| Session | Duration | Focus |
|---------|----------|-------|
| Day 1 | 45 min | Overview + Learning Notes |
| Day 2 | 45 min | Examples + Visualization |
| Day 3 | 1 hour | Practice + Debugging |
| Day 4 | 30 min | Quiz + Cheat Sheet review |
| Day 5 | 30 min | Interview Prep questions |
| Day 6 | 30 min | Mini Project |
| Day 7 | 20 min | Revision + Move to next |

### 💡 Staying Motivated

At your current pace, you'll complete the **${rm}** track in approximately **${Math.max(4, Math.round(20 - (ctx.userContext?.xp || 0) / 200))} weeks**. That's an achievable, realistic timeline.

**Remember**: Consistency beats intensity. 45 minutes daily beats 6 hours on weekends.

*Ask me: "What should I learn after ${topic}?", "Which topics are most important for interviews?", "How do I pace my studies?"*`;
}

// ─────────────────────────────────────────────────────────────────
// PROJECT REVIEW GENERATOR
// ─────────────────────────────────────────────────────────────────
function generateProjectReviewResponse(ctx, message) {
  const topic = topicLabel(ctx);
  const l     = lang(ctx);

  return `## 🔍 Project Review & Feedback

### Reviewing: ${topic} Mini Project

I'll evaluate your project across 6 dimensions:

---

### 📊 Evaluation Framework

| Dimension | What We Look For | Your Target |
|-----------|-----------------|-------------|
| **Functionality** | Does it work correctly? | All requirements met |
| **Code Quality** | Clean, readable, maintainable? | < 20 lines per function |
| **Error Handling** | Handles edge cases gracefully? | No crashes on bad input |
| **Performance** | Efficient algorithm choice? | No unnecessary O(n²) loops |
| **Documentation** | Comments explain WHY not WHAT? | 20%+ commented |
| **Testing** | Tests for happy path + edge cases? | 3+ test cases |

---

### 💻 Code Review Checklist for ${topic}

**Before submitting, verify:**

\`\`\`${l}
// ✅ Good practices to include:

// 1. Input validation at function entry
function solve(input) {
  if (!input || !Array.isArray(input)) {
    throw new TypeError('Expected non-empty array');
  }
  
  // 2. Descriptive variable names (not i, j, tmp)
  const processedResults = [];
  
  // 3. Single responsibility — one function, one job
  return processedResults;
}

// 4. Guard clauses instead of deep nesting
// ❌ Avoid:
function process(data) {
  if (data) {
    if (data.length > 0) {
      if (data[0] !== null) {
        return compute(data);
      }
    }
  }
}

// ✅ Better:
function process(data) {
  if (!data?.length || data[0] === null) return null;
  return compute(data);
}
\`\`\`

---

### 🚀 Common Project Improvements for ${topic}

**Functionality Upgrades:**
- Add command-line arguments for flexible input
- Add file I/O (read from CSV/JSON, write results)
- Add a simple REST API endpoint

**Code Quality Upgrades:**
- Extract repeated code into helper functions
- Add type hints/JSDoc comments
- Use a linter (ESLint/Pylint)

**Portfolio Upgrades:**
- Add a README.md with setup instructions
- Include a demo GIF or screenshot
- Deploy it online (Vercel/Railway/Heroku)

---

### 📝 Paste Your Code for Specific Feedback

To get detailed, line-by-line feedback on YOUR specific code, paste it in the message box and I'll provide:
- Security vulnerabilities
- Performance bottlenecks  
- Refactoring suggestions
- Missing edge cases
- Grade: A/B/C/D with justification

*Your project is a portfolio asset — make it shine! 🌟*`;
}

// ─────────────────────────────────────────────────────────────────
// RESUME REVIEW GENERATOR
// ─────────────────────────────────────────────────────────────────
function generateResumeReviewResponse(ctx, message) {
  const rm   = ctx.roadmap?.title || 'Software Development';
  const xp   = ctx.userContext?.xp || 0;
  const lang_label = lang(ctx).charAt(0).toUpperCase() + lang(ctx).slice(1);

  return `## 📄 Resume AI Assistant

### Building a Winning Technical Resume for ${rm}

---

### 📐 Resume Structure (ATS-Optimized)

**Section Order that works best:**
\`\`\`
1. Header (Name, Email, Phone, GitHub, LinkedIn, Portfolio URL)
2. Summary (3-4 lines, keyword-rich)
3. Technical Skills (grouped by category)
4. Projects (most impactful first)
5. Education
6. Experience (if any)
7. Certifications
\`\`\`

---

### ✅ Skills Section Template (for ${rm} Developers)

\`\`\`
Technical Skills:
• Languages: ${lang_label}, ${lang_label === 'Python' ? 'JavaScript, SQL' : 'Python, SQL'}
• Frameworks: [add based on your roadmap progress]
• Tools: Git, Docker, VS Code, Linux
• Databases: MySQL, MongoDB
• Platforms: AWS/GCP, Vercel, Railway
\`\`\`

---

### 💼 Project Description Template

**The STAR Format for Projects:**
\`\`\`
[Project Name] | [Tech Stack] | [GitHub Link]
• Built [WHAT] that [SOLVES WHAT PROBLEM] using [TECH]
• Achieved [MEASURABLE RESULT] (e.g., "reduced load time by 40%")
• Implemented [KEY FEATURE] with [TECHNICAL APPROACH]
\`\`\`

**Example:**
> **Student Progress Tracker** | Node.js, MySQL, React | github.com/...
> - Built REST API that tracks 500+ learning metrics for 100+ concurrent users
> - Reduced database queries by 60% using Redis caching and connection pooling
> - Deployed on Railway with CI/CD pipeline via GitHub Actions

---

### 🔴 ATS Killer Mistakes to Avoid

| ❌ Mistake | ✅ Fix |
|----------|--------|
| "Responsible for..." | "Built/Designed/Implemented..." |
| "Worked on team" | "Collaborated with 4-person team to..." |
| No numbers | Add: "50 users", "30% faster", "3 features" |
| PDF with columns | Single-column PDF only |
| Generic summary | Tailor to each job description |
| Missing keywords | Mirror exact words from job posting |

---

### 📊 Resume Score Factors

**Your Current XP (${xp}) supports these claims:**
${xp > 500 ? '✅ Junior Developer roles' : '⚠️ Internship / Entry roles'}
${xp > 1500 ? '✅ Mid-level positions with 1-2 YOE' : ''}
${xp > 3000 ? '✅ Senior roles with strong portfolio' : ''}

---

### 🎯 Next Steps

1. **Paste your current resume text** here and I'll score it (1-100) with specific improvements
2. **Or ask for a template** for any specific role: "Give me a resume for a Python Backend Developer role"
3. **ATS keyword check**: Share a job posting and I'll identify the missing keywords in your resume

*A great resume gets you in the door. A great interview closes the deal. Use the Interview Prep tab to prepare for what comes next!*`;
}

// ─────────────────────────────────────────────────────────────────
// PORTFOLIO ASSISTANCE GENERATOR
// ─────────────────────────────────────────────────────────────────
function generatePortfolioHelpResponse(ctx, message) {
  const rm    = ctx.roadmap?.title || 'Software Development';
  const topic = topicLabel(ctx);
  const l     = lang(ctx);

  return `## 🌐 Portfolio Assistant

### Building a Developer Portfolio That Gets You Hired

---

### 🏗️ Portfolio Project Ideas Based on Your Skills (${rm})

**Beginner Projects (Build now):**
1. **${topic} Visualizer** — Interactive web app demonstrating ${topic} with animations
   - Tech: HTML + Canvas/SVG + ${l.charAt(0).toUpperCase() + l.slice(1)}
   - Impact: Shows deep understanding, great for showing employers
   
2. **Personal Study Dashboard** — Track your learning progress
   - Tech: Node.js + MySQL + React
   - Features: XP tracker, streak counter, quiz history
   
3. **${rm.split(' ')[0]} Quiz App** — Test knowledge of ${rm} concepts
   - Tech: Full-stack with your roadmap's language stack
   - Bonus: Add a leaderboard!

**Intermediate Projects (After completing 50% of roadmap):**
4. **REST API with Authentication** — CRUD application with JWT
5. **Real-time Chat App** — WebSockets + Node.js
6. **E-commerce Backend** — Products, cart, orders, payments

**Advanced Projects (For senior positions):**
7. **Distributed Task Queue** — Background job processing
8. **Microservices Demo** — 3 services + API gateway
9. **ML-powered Feature** — Recommendation system or classifier

---

### 📋 Portfolio Website Checklist

**Must-haves:**
- ☐ Clean, fast landing page (< 3s load time)
- ☐ 3-5 featured projects with live demos
- ☐ GitHub profile with contribution graph
- ☐ About section with technical focus
- ☐ Contact form or email link
- ☐ Mobile responsive design

**Each project should have:**
- ☐ Live demo link (Vercel/Netlify)
- ☐ GitHub link with clean README
- ☐ Tech stack badges
- ☐ Problem → Solution narrative
- ☐ Screenshots/GIFs

---

### 🚀 Quick Deploy Stack (Free)

\`\`\`
Frontend: Vercel (free tier, instant deployments)
Backend:  Railway (free $5 credit/month)
Database: PlanetScale (free MySQL) or Supabase (free Postgres)
Domain:   .tech domains from $1-5/year
\`\`\`

---

### 💡 Portfolio Psychology

**What employers actually look at:**
1. **Live demos** first — Can they see it work?
2. **GitHub activity** — Are you coding consistently?
3. **README quality** — Can you communicate technically?
4. **Code quality** — Open one file: is it readable?
5. **Project relevance** — Does it match the job?

**Your EduNet mini projects are portfolio-ready!** The projects in your roadmap lessons are designed to be showcaseable. Push them to GitHub after completion.

*Tell me your target role and I'll suggest the perfect portfolio projects to build!*`;
}

// ─────────────────────────────────────────────────────────────────
// QUIZ GENERATOR (Exhaustive 50+ question schema)
// ─────────────────────────────────────────────────────────────────
function generateQuizResponse(ctx) {
  const topic = topicLabel(ctx);
  const l     = lang(ctx);

  // 20 Premium MCQs
  const mcqs = [];
  for (let i = 1; i <= 20; i++) {
    mcqs.push({
      question: `Scenario ${i}: In a production system processing ${topic}, what is the best approach to handle scale and optimize resource utilization?`,
      options: [
        `Leverage custom indexing, caching layers, and asynchronous processing.`,
        `Run nested loops without memoization or validation guards.`,
        `Store all temporary variables directly on the thread local pool.`,
        `Rebuild the entire memory heap on every client execution request.`
      ],
      answer: 'A',
      explanation: `To optimize ${topic} at scale, caching and non-blocking asynchronous architectures are the industry-standard design choices.`
    });
  }

  // 10 Debug Questions
  const debugQuestions = [];
  for (let i = 1; i <= 10; i++) {
    debugQuestions.push({
      question: `Find the syntax or logic bug in this ${topic} routine (Line ${i * 2}):`,
      code: l === 'python' 
        ? `def process_${i}(data):\n    res = []\n    for x in data:\n        if x = None:  # Bug here!\n            res.append(x)\n    return res`
        : `function process_${i}(data) {\n  let res = [];\n  for (let x of data) {\n    if (x = null) {  // Bug here!\n      res.push(x);\n    }\n  }\n  return res;\n}`,
      bugLine: i * 2,
      expectedFix: `Change assignment operator (=) to comparison operator (== or ===)`,
      explanation: `Using the assignment operator instead of a comparison inside conditionals sets values and yields unintended truths.`
    });
  }

  // 10 Output Predictions
  const outputPredictions = [];
  for (let i = 1; i <= 10; i++) {
    outputPredictions.push({
      question: `Predict the exact console output of this compiled ${topic} execution sequence:`,
      code: l === 'python'
        ? `items = [10, 20, 30]\nprint(items[1] if len(items) > ${i} else -1)`
        : `const items = [10, 20, 30];\nconsole.log(items[1] && items.length > ${i} ? items[1] : -1);`,
      expectedOutput: i < 3 ? '20' : '-1',
      explanation: `Traces conditional array bounds evaluations depending on the item collection length constraints.`
    });
  }

  // 5 Fill in the Blanks
  const fillBlanks = [];
  for (let i = 1; i <= 5; i++) {
    fillBlanks.push({
      question: `To prevent memory leaks when manipulating ${topic}, we must ensure that referenced structures are ______.`,
      correctAnswer: 'garbage collected',
      explanation: `Removing unused pointer references allows standard garbage collectors to free unused memory segments.`
    });
  }

  // 5 Match the Following
  const matchFollowing = [
    { left: `${topic} Node`, right: `Unit of structure housing data and pointer targets.` },
    { left: `Time Complexity`, right: `Scale limit characterizing processor instruction step metrics.` },
    { left: `Space Complexity`, right: `RAM memory footprints relative to inputs scaling parameters.` },
    { left: `Cache hit`, right: `Instant retrieval from intermediate fast-access caching structures.` },
    { left: `SDE Best Practice`, right: `Write pure functions, validate bounds, and document architecture.` }
  ];

  const codingQuiz = {
    problemStatement: `Implement an optimized dynamic evaluator for ${topic} handling custom transaction elements.`,
    starterCode: l === 'python'
      ? `def solve_challenge(transactions):\n    # TODO: Implement optimal O(N) strategy\n    return []`
      : `function solveChallenge(transactions) {\n  // TODO: Implement optimal O(N) strategy\n  return [];\n}`,
    testCases: [
      { input: '[]', expected: '[]' }
    ]
  };

  return { mcqs, debugQuestions, outputPredictions, fillBlanks, matchFollowing, codingQuiz, topic, language: l };
}

// ─────────────────────────────────────────────────────────────────
// PROJECTS GENERATOR (Mini, Intermediate, Advanced, Capstone)
// ─────────────────────────────────────────────────────────────────
function generateProjectsResponse(ctx) {
  const topic = topicLabel(ctx);
  const l     = lang(ctx);

  return {
    mini: {
      title: `${topic} CLI Auditor`,
      tagline: 'Step 1: Core syntax validation',
      description: `Build a console CLI tool that initializes, inserts, and prints **${topic}** data states with validation logs.`,
      requirements: ['Validate bounds', 'Handle empty inputs gracefully'],
      architecture: `CLI Console -> Data Store -> Logic Processor`,
      folderStructure: `src/\n  ├── main.${l === 'python' ? 'py' : 'js'}\n  └── utils.${l === 'python' ? 'py' : 'js'}`,
      milestones: ['Setup directory structure', 'Write core structures', 'Run validation tests'],
      hints: ['Review error conditions before processing indices'],
      starterCode: l === 'python' ? `def init_cli():\n    pass` : `function initCli() {}`,
      solution: l === 'python' ? `def init_cli():\n    print("CLI Active")` : `function initCli() {\n  console.log("CLI Active");\n}`,
      extensions: ['Save audits to a text file']
    },
    intermediate: {
      title: `${topic} File Engine`,
      tagline: 'Step 2: Stream persistence and serialization',
      description: `Upgrade the CLI auditor to support loading data models from JSON/CSV files and saving outcomes.`,
      requirements: ['Read CSV stream', 'Serialize collections to JSON file'],
      architecture: `File Loader -> Parser -> ${topic} Processor -> Exporter`,
      folderStructure: `src/\n  ├── main.${l === 'python' ? 'py' : 'js'}\n  ├── parser.${l === 'python' ? 'py' : 'js'}\n  └── data/`,
      milestones: ['Add filesystem helpers', 'Parse lines', 'Save output serialized buffers'],
      hints: ['Validate CSV values formatting before ingestion'],
      starterCode: l === 'python' ? `def load_file(path):\n    pass` : `function loadFile(path) {}`,
      solution: l === 'python' ? `def load_file(path):\n    return []` : `function loadFile(path) {\n  return [];\n}`,
      extensions: ['Add binary file exports compression']
    },
    advanced: {
      title: `RESTful ${topic} Microservice`,
      tagline: 'Step 3: Multi-client networking and latency constraints',
      description: `Serve data structures over HTTP endpoints. Build POST /process and GET /history routes.`,
      requirements: ['Support Express/Flask web framework API routes', 'Latency below 50ms'],
      architecture: `HTTP Router -> Controllers layer -> ${topic} Services -> Memory Store`,
      folderStructure: `src/\n  ├── app.${l === 'python' ? 'py' : 'js'}\n  ├── routes.${l === 'python' ? 'py' : 'js'}\n  └── service.${l === 'python' ? 'py' : 'js'}`,
      milestones: ['Setup HTTP server listener', 'Implement routes handlers', 'Write unit testing hooks'],
      hints: ['Use correct HTTP response status codes (200, 400, 500)'],
      starterCode: l === 'python' ? `def start_server():\n    pass` : `function startServer() {}`,
      solution: l === 'python' ? `def start_server():\n    print("Server active")` : `function startServer() {\n  console.log("Server active");\n}`,
      extensions: ['Implement authorization JWT tokens protection']
    },
    capstone: {
      title: `Distributed ${topic} Broker`,
      tagline: 'Step 4: Sharding databases, message queuing, and caching layers',
      description: `Deploy a production-ready distributed system with Redis caching and PostgreSQL persistence shards processing transaction feeds.`,
      requirements: ['Consistent hashing sharding strategy', 'Write-ahead cache logging'],
      architecture: `Load Balancer -> API Cluster -> Redis Cache -> DB Shards`,
      folderStructure: `src/\n  ├── gateway/\n  ├── workers/\n  └── db/`,
      milestones: ['Setup sharding controller', 'Integrate Redis cache-aside client', 'Dockerize nodes deployment'],
      hints: ['Set reasonable database connection pool limits'],
      starterCode: l === 'python' ? `def run_broker():\n    pass` : `function runBroker() {}`,
      solution: l === 'python' ? `def run_broker():\n    pass` : `function runBroker() {}`,
      extensions: ['Add Prometheus performance dashboard dashboards']
    }
  };
}

// ─────────────────────────────────────────────────────────────────
// PRACTICE GENERATOR
// ─────────────────────────────────────────────────────────────────
function generatePracticeExercises(ctx) {
  const topic = topicLabel(ctx);
  const l     = lang(ctx);

  return {
    easy: {
      title: `${topic} — Beginner Exercise`,
      problem: `**Problem**: Write a function \`findMax(arr)\` that finds the maximum value in an array using ${topic}.\n\n**Requirements**:\n- Input: An array of numbers\n- Output: The maximum value\n- Handle empty array with appropriate error\n- Time Complexity: O(n)`,
      starterCode: l === 'python'
        ? `def find_max(arr):\n    \"\"\"Find maximum value using ${topic}.\"\"\"\n    if not arr:\n        raise ValueError(\"Array cannot be empty\")\n    # Your code here\n    pass\n\n# Test\nprint(find_max([3, 1, 4, 1, 5, 9, 2, 6]))  # Expected: 9\nprint(find_max([-1, -5, -2]))               # Expected: -1`
        : `function findMax(arr) {\n  // Input validation\n  if (!arr || arr.length === 0) {\n    throw new Error('Array cannot be empty');\n  }\n  \n  // Your code here\n  \n}\n\n// Tests\nconsole.log(findMax([3, 1, 4, 1, 5, 9, 2, 6])); // Expected: 9\nconsole.log(findMax([-1, -5, -2]));              // Expected: -1`,
      hints: [
        `Start with the first element as your initial maximum`,
        `Iterate through the array comparing each element to your current max`,
        `If the current element is greater, update your max`,
        `Return the max after the loop`
      ],
      solution: l === 'python'
        ? `def find_max(arr):\n    if not arr:\n        raise ValueError("Array cannot be empty")\n    max_val = arr[0]\n    for num in arr:\n        if num > max_val:\n            max_val = num\n    return max_val`
        : `function findMax(arr) {\n  if (!arr || arr.length === 0) throw new Error('Array cannot be empty');\n  let max = arr[0];\n  for (const num of arr) {\n    if (num > max) max = num;\n  }\n  return max;\n}`,
      expectedOutput: `9\n-1`,
      solutionExplanation: `We initialize max with the first element, then compare each subsequent element. If larger, we update max. Final time complexity: O(n).`
    },
    medium: {
      title: `${topic} — Intermediate: Two Sum`,
      problem: `**Problem**: Given an array of integers and a target sum, return the indices of two numbers that add up to the target.\n\n**Constraints**:\n- Each input has exactly one solution\n- Cannot use the same element twice\n- Return as an array [index1, index2]\n- Optimize to O(n) time complexity`,
      starterCode: l === 'python'
        ? `def two_sum(nums, target):\n    \"\"\"Find two indices that sum to target. O(n) solution.\"\"\"\n    seen = {}  # value -> index mapping\n    for i, num in enumerate(nums):\n        complement = target - num\n        # Your code here\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))   # Expected: [0, 1]\nprint(two_sum([3, 2, 4], 6))        # Expected: [1, 2]`
        : `function twoSum(nums, target) {\n  const seen = new Map(); // value -> index\n  \n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    // Check if complement exists in map\n    // If yes: return [seen.get(complement), i]\n    // If no: add nums[i] -> i to map\n  }\n  return [];\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));  // [0, 1]\nconsole.log(twoSum([3, 2, 4], 6));       // [1, 2]`,
      hints: [
        `Use a hash map to store number → index pairs`,
        `For each number, calculate complement = target - number`,
        `Check if the complement already exists in your hash map`,
        `If it does, you found the pair! Return both indices`
      ],
      solution: l === 'python'
        ? `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`
        : `function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (seen.has(complement)) return [seen.get(complement), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}`,
      expectedOutput: `[0, 1]\n[1, 2]`
    },
    hard: {
      title: `${topic} — Advanced: Sliding Window Maximum`,
      problem: `**Problem**: Given an array of integers and a window size k, find the maximum value in each sliding window of size k.\n\n**Example**: \`nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3\`\n→ Output: \`[3, 3, 5, 5, 6, 7]\`\n\n**Requirement**: O(n) time complexity using a deque (monotonic queue)`,
      starterCode: l === 'python'
        ? `from collections import deque\n\ndef max_sliding_window(nums, k):\n    \"\"\"\n    Sliding window maximum using monotonic deque.\n    Time: O(n), Space: O(k)\n    \"\"\"\n    if not nums or k == 0:\n        return []\n    \n    result = []\n    dq = deque()  # stores indices, front is always max\n    \n    for i, num in enumerate(nums):\n        # Remove indices outside window\n        # Remove smaller elements (maintain decreasing order)\n        # Add current index\n        # Append to result when window is full\n        pass\n    \n    return result\n\nprint(max_sliding_window([1,3,-1,-3,5,3,6,7], 3))  # [3,3,5,5,6,7]`
        : `function maxSlidingWindow(nums, k) {\n  if (!nums.length || k === 0) return [];\n  \n  const result = [];\n  const dq = []; // monotonic deque stores indices\n  \n  for (let i = 0; i < nums.length; i++) {\n    // 1. Remove indices outside current window\n    // 2. Remove smaller elements from back of deque\n    // 3. Add current index\n    // 4. Append result when window is full (i >= k-1)\n  }\n  \n  return result;\n}\n\nconsole.log(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3)); // [3,3,5,5,6,7]`,
      hints: [
        `Use a deque (double-ended queue) that stores indices, not values`,
        `Maintain the deque in decreasing order of values`,
        `Front of deque always holds the index of the maximum for current window`,
        `Remove front when it's outside the window (i - dq[0] >= k)`,
        `Remove from back when current element is >= nums[dq.back()] — smaller elements can never be the max`
      ]
    },
    debugging: {
      title: `Debug This: ${topic} Bug Hunt`,
      problem: `**Find and fix all bugs in this code:**\n\nThe function should return the sum of all unique elements in the array.`,
      starterCode: l === 'python'
        ? `def sum_unique(arr):\n    unique = set[]\n    total = 0\n    for num in arr:\n        if num not in unique:\n            unique.add(num)\n            total += total  # Bug!\n    return total\n\n# Expected: sum_unique([1, 2, 2, 3, 3, 3]) == 6\nprint(sum_unique([1, 2, 2, 3, 3, 3]))`
        : `function sumUnique(arr) {\n  const unique = new Set[];\n  let total = 0;\n  \n  for (const num in arr) {  // Bug!\n    if (!unique.has(num)) {\n      unique.add(num);\n      total += total;  // Bug!\n    }\n  }\n  return total;\n}\n\n// Expected: sumUnique([1, 2, 2, 3, 3, 3]) === 6\nconsole.log(sumUnique([1, 2, 2, 3, 3, 3]));`,
      hints: [
        `Bug 1: Set initialization syntax — Set[] is wrong`,
        `Bug 2: for...in vs for...of — what's the difference?`,
        `Bug 3: total += total doubles total instead of adding num`
      ]
    }
  };
}

// ─────────────────────────────────────────────────────────────────
// SMART CHAT RESPONSE GENERATOR
// ─────────────────────────────────────────────────────────────────
function generateSmartChatResponse(ctx, message) {
  const topic = topicLabel(ctx);
  const l     = lang(ctx);
  const msg   = (message || '').toLowerCase();

  if (/interview|question|asked|prepare/.test(msg)) {
    const qs = generateInterviewQuestions(ctx);
    return `## 💼 Interview Questions for ${topic}\n\nHere are the most likely questions you'll face:\n\n${
      qs.slice(0, 5).map((q, i) => `**Q${i+1}. ${q.question}**\n\n${q.answer}`).join('\n\n---\n\n')
    }`;
  }

  if (/practice|exercise|problem|code/.test(msg)) {
    const ex = generatePracticeExercises(ctx);
    return `## 💪 Practice Exercises for ${topic}\n\n${ex.easy.problem}\n\n**Starter Code:**\n\`\`\`${l}\n${ex.easy.starterCode}\n\`\`\``;
  }

  if (/quiz|test|mcq/.test(msg)) {
    const qz = generateQuizResponse(ctx);
    return `## 🧠 Quick Quiz: ${topic}\n\n${qz.questions.slice(0, 3).map((q, i) =>
      `**Q${i+1}**: ${q.q}\n${q.options.map((o, j) => `${['A','B','C','D'][j]}) ${o}`).join('\n')}`
    ).join('\n\n')}`;
  }

  if (/career|job|salary|hire/.test(msg)) {
    return generateCareerCoachingResponse(ctx, message);
  }

  if (/roadmap|path|next|plan/.test(msg)) {
    return generateRoadmapGuidanceResponse(ctx, message);
  }

  // Default: explanation
  const code = getCode(ctx, 'simple');
  return `## 📖 About ${topic}\n\nGreat question about **${topic}**!\n\n${topic} is a core concept in ${l} programming that appears across virtually every type of software — from simple scripts to distributed systems at scale.\n\n### Simple Example:\n\`\`\`${l}\n${code}\n\`\`\`\n\n### Key Points:\n- **What it is**: A fundamental pattern for processing and transforming data\n- **Why it matters**: Efficient use of ${topic} is the difference between O(n) and O(n²) solutions\n- **Where you'll see it**: API handlers, database queries, UI state management\n\n**Try asking me**: "Give me an interview question", "Generate a practice exercise", or "Explain the time complexity"`;
}

module.exports = {
  generateInterviewQuestions,
  generateCareerCoachingResponse,
  generateRoadmapGuidanceResponse,
  generateProjectReviewResponse,
  generateResumeReviewResponse,
  generatePortfolioHelpResponse,
  generateQuizResponse,
  generatePracticeExercises,
  generateSmartChatResponse,
  generateProjectsResponse,
  topicLabel,
  lang: lang,
  getCode
};
