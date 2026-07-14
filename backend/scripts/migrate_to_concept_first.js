// ============================================================
// backend/scripts/migrate_to_concept_first.js
// EduNet Curriculum Architecture Migrator — Monolith to Decentralized Files
// ============================================================
'use strict';

const fs = require('fs');
const path = require('path');

const ROADMAPS_DIR = path.resolve(__dirname, '..', 'curriculum', 'roadmaps');
const TARGET_CURRICULUM_DIR = path.resolve(__dirname, '..', '..', 'curriculum');

// Load existing engines to extract handcrafted content
const conceptEngine = require('../curriculum/engine/ConceptContentEngine');
const lessonGenerator = require('../curriculum/engine/LessonGenerator');
const conceptDNA = require('../services/conceptDNA');

// Standard slugs generator
function getSlug(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Generates rich, realistic CS content dynamically for concepts that do not
 * have handcrafted definitions in ConceptContentEngine.js.
 */
function generateDynamicContent(title, language, difficulty, moduleName, roadmapTitle) {
  const t = title;
  const lang = (language || 'javascript').toLowerCase();
  const langLabel = lang.charAt(0).toUpperCase() + lang.slice(1);
  const slug = getSlug(title);

  // Common sample variables by language
  const codeVars = {
    python: { cart: 'cart_items', price: 'unit_price', balance: 'account_balance', print: 'print' },
    javascript: { cart: 'cartItems', price: 'unitPrice', balance: 'accountBalance', print: 'console.log' },
    java: { cart: 'cartItems', price: 'unitPrice', balance: 'accountBalance', print: 'System.out.println' },
    sql: { cart: 'cart_items', price: 'unit_price', balance: 'account_balance', print: 'SELECT' }
  }[lang] || { cart: 'items', price: 'price', balance: 'balance', print: 'print' };

  const templates = {
    analogy: `Imagine you are working in a warehouse. Instead of tossing boxes around randomly, you place them into labeled shelves. When a package arrives, you look up its shelf label to update the stock index. Similarly, **${t}** acts as a named workspace or rule that coordinates statements, keeping variables safe and ensuring operations execute only when matching conditions are met.`,
    motivation: `In real-world system designs, developers routinely need to process variables, schedule loops, and route data streams. Without a reliable mechanism to execute **${t}**, engineering architectures would suffer from duplicated logic, thread blocking, and resource collisions.`,
    why: `Without **${t}**, modern software engineering would be extremely tedious. Developers would have to manually configure physical memory slots, write repetitive loop patterns, or establish unsafe socket connections for basic data operations. This concept exists to remove boilerplate redundancy, guarantee code safety limits, and offer a standard method for developers to manage application states.`,
    beginnerExample: {
      python: `def run_demo():\n    ${codeVars.balance} = 100.0\n    print(f"Current balance: \${${codeVars.balance}}")\nrun_demo()`,
      javascript: `function runDemo() {\n    const ${codeVars.balance} = 100.0;\n    console.log(\`Current balance: \${${codeVars.balance}}\`);\n}\nrunDemo();`,
      java: `public class Demo {\n    public static void main(String[] args) {\n        double ${codeVars.balance} = 100.0;\n        System.out.println("Current balance: " + ${codeVars.balance});\n    }\n}`,
      sql: `SELECT account_id, customer_name, ${codeVars.balance}\nFROM customer_accounts\nWHERE status = 'ACTIVE'\nORDER BY ${codeVars.balance} DESC;`
    }[lang] || `// Beginner example for ${t}\n${codeVars.print}("Executing ${t} Beginner Example");`,
    
    intermediateExample: {
      python: `class InventoryManager:\n    def __init__(self):\n        self.${codeVars.cart} = {}\n    def add_item(self, item_id: str, price: float):\n        if price < 0:\n            raise ValueError("Price cannot be negative")\n        self.${codeVars.cart}[item_id] = price\n\nmanager = InventoryManager()\nmanager.add_item("ITEM-101", 19.99)`,
      javascript: `class InventoryManager {\n    constructor() {\n        this.${codeVars.cart} = new Map();\n    }\n    addItem(itemId, price) {\n        if (price < 0) throw new Error("Price cannot be negative");\n        this.${codeVars.cart}.set(itemId, price);\n    }\n}\nconst manager = new InventoryManager();\nmanager.addItem("ITEM-101", 19.99);`,
      java: `import java.util.HashMap;\nimport java.util.Map;\npublic class InventoryManager {\n    private final Map<String, Double> ${codeVars.cart} = new HashMap<>();\n    public void addItem(String itemId, double price) {\n        if (price < 0) throw new IllegalArgumentException("Negative price");\n        ${codeVars.cart}.put(itemId, price);\n    }\n}`,
      sql: `SELECT c.category_name, COUNT(p.product_id) AS total_products, AVG(p.${codeVars.price}) AS avg_price\nFROM categories c\nLEFT JOIN products p ON c.category_id = p.category_id\nGROUP BY c.category_name\nHAVING COUNT(p.product_id) > 5;`
    }[lang] || `// Intermediate example for ${t}\n${codeVars.print}("Executing ${t} Intermediate Example");`,

    expertExample: {
      python: `import time\nfrom functools import wraps\n\ndef monitor_latency(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        res = func(*args, **kwargs)\n        print(f"Latency: {func.__name__} took {time.perf_counter() - start:.6f}s")\n        return res\n    return wrapper`,
      javascript: `function monitorLatency(fn) {\n    return function(...args) {\n        const start = performance.now();\n        const result = fn.apply(this, args);\n        console.log(\`Latency: execution took \${(performance.now() - start).toFixed(4)}ms\`);\n        return result;\n    };\n}`,
      java: `public class PerformanceMonitor {\n    public static void runInstrumented(Runnable task) {\n        long start = System.nanoTime();\n        task.run();\n        System.out.println("Execution time: " + (System.nanoTime() - start) / 1_000_000.0 + "ms");\n    }\n}`,
      sql: `EXPLAIN ANALYZE\nSELECT user_id, COUNT(*) as action_count\nFROM user_audit_logs\nWHERE action_timestamp >= NOW() - INTERVAL '30 days'\nGROUP BY user_id\nORDER BY action_count DESC;`
    }[lang] || `// Expert example for ${t}\n${codeVars.print}("Executing ${t} Expert Example");`
  };

  return templates;
}

/**
 * Performs migration.
 */
function migrate() {
  console.log('🚀 Starting Concept-First Curriculum Refactor Migration...');

  if (!fs.existsSync(ROADMAPS_DIR)) {
    console.error(`❌ Source directory ${ROADMAPS_DIR} does not exist!`);
    process.exit(1);
  }

  // Create target directory if missing
  if (!fs.existsSync(TARGET_CURRICULUM_DIR)) {
    fs.mkdirSync(TARGET_CURRICULUM_DIR, { recursive: true });
    console.log(`Created target curriculum directory at ${TARGET_CURRICULUM_DIR}`);
  }

  const roadmapFiles = fs.readdirSync(ROADMAPS_DIR).filter(f => f.endsWith('.json'));
  console.log(`Found ${roadmapFiles.length} roadmaps to migrate.`);

  for (const file of roadmapFiles) {
    const roadmapId = file.replace('.json', '');
    const sourcePath = path.join(ROADMAPS_DIR, file);
    const rawData = fs.readFileSync(sourcePath, 'utf8');
    
    let rmData;
    try {
      rmData = JSON.parse(rawData);
    } catch (e) {
      console.error(`❌ Failed to parse ${file}:`, e.message);
      continue;
    }

    const rm = rmData.roadmap;
    const lang = rm.language || roadmapId;
    const roadmapTitle = rm.title || roadmapId;
    
    // Create roadmap destination path
    const roadmapDestDir = path.join(TARGET_CURRICULUM_DIR, roadmapId);
    const modulesDestDir = path.join(roadmapDestDir, 'modules');
    fs.mkdirSync(modulesDestDir, { recursive: true });

    // Write roadmap.json
    const roadmapJson = {
      id: roadmapId,
      title: roadmapTitle,
      category: rm.category || 'General',
      difficulty: rm.difficulty || 'Beginner',
      icon: rm.icon || '📖',
      tags: rm.tags ? rm.tags.split(',') : [roadmapId],
      description: rm.description || `Master ${roadmapTitle} from basics to production.`,
      language: lang,
      prerequisites: rmData.prerequisites || [],
      estimatedHours: rmData.estimated_hours || 60,
      projects: rmData.projects || [],
      interviewTopics: rmData.interview_topics || []
    };

    fs.writeFileSync(path.join(roadmapDestDir, 'roadmap.json'), JSON.stringify(roadmapJson, null, 2), 'utf8');

    // Migrate Modules
    (rmData.modules || []).forEach((mod, mIdx) => {
      const moduleSlug = getSlug(mod.name);
      const moduleDestDir = path.join(modulesDestDir, moduleSlug);
      fs.mkdirSync(moduleDestDir, { recursive: true });

      // Write module.json
      const moduleJson = {
        id: `${roadmapId}_${moduleSlug}`,
        name: mod.name,
        description: mod.desc || `Complete module covering ${mod.name}.`,
        orderIndex: mIdx + 1,
        xpReward: 200
      };
      fs.writeFileSync(path.join(moduleDestDir, 'module.json'), JSON.stringify(moduleJson, null, 2), 'utf8');

      // Migrate Lessons
      (mod.lessons || []).forEach((les, lIdx) => {
        const conceptSlug = getSlug(les.title);
        const conceptDestDir = path.join(moduleDestDir, conceptSlug);
        fs.mkdirSync(conceptDestDir, { recursive: true });

        // Retrieve existing content if cached
        const dna = conceptDNA.getDNA(les.title);
        const category = conceptEngine.detectConceptCategory(les.title, mod.name);
        const conceptData = category ? conceptEngine.CONCEPT_CONTENT[category] : null;

        // Generate dynamic fallback blocks
        const dyn = generateDynamicContent(les.title, lang, les.difficulty || 'Beginner', mod.name, roadmapTitle);

        // 1. lesson.json
        const lessonJson = {
          id: `${roadmapId}_${conceptSlug}`,
          title: les.title,
          technology: roadmapTitle,
          module: mod.name,
          estimatedTime: les.estimated_hours ? les.estimated_hours * 60 : 30,
          difficultyLevels: ["beginner", "intermediate", "expert"],
          prerequisites: les.prerequisites || [],
          nextLessons: [],
          learningObjectives: les.learning_objectives || [
            `Explain the fundamental operational model of ${les.title}.`,
            `Write clean syntax representations of ${les.title} in ${lang}.`,
            `Identify errors and debugging challenges when running ${les.title}.`
          ],
          tags: les.keywords || [conceptSlug]
        };
        fs.writeFileSync(path.join(conceptDestDir, 'lesson.json'), JSON.stringify(lessonJson, null, 2), 'utf8');

        // Helper definitions
        const analogyText = (conceptData && conceptData.eli10) 
          ? conceptData.eli10(les.title, lang) 
          : dyn.analogy;
        const whyText = (conceptData && conceptData.why_exists)
          ? conceptData.why_exists(les.title, lang)
          : dyn.why;
        const motivationText = les.desc || dyn.motivation;

        // 2. beginner.json
        const beginnerJson = {
          motivation: motivationText,
          whyExists: whyText,
          realWorldAnalogy: analogyText,
          simpleExplanation: `To learn ${les.title} from first principles, start by looking at how data resolves at runtime. Imagine your processor executing instructions sequentially. ${les.title} defines how values bind, operations evaluate, and stack structures are clean.`,
          visualDiagram: `\`\`\`text\n[User Input] ──► [Process Scope: ${les.title}] ──► [Memory Address] ──► [Console Output]\n\`\`\``,
          syntaxExplanation: `Verify that all brackets, colons, keywords, and assignments match the ${lang} syntax specifications. Avoid naming collisions by using scoped namespaces.`,
          stepByStepExecution: [
            { step: 1, desc: "Allocate memory segment and load bindings." },
            { step: 2, desc: "Process instruction registers." },
            { step: 3, desc: "Pop current stack frame." }
          ],
          memoryDiagram: {
            type: 'variables',
            theme: 'dark',
            slots: [
              { address: "0x7fff01", name: `${conceptSlug}_ref`, value: "0x7fff08" },
              { address: "0x7fff08", name: `${conceptSlug}_val`, value: "100" }
            ]
          },
          examples: [
            {
              title: "Basic Syntax Pattern",
              code: les.examples?.beginner?.code || dyn.beginnerExample,
              explanation: les.examples?.beginner?.explanation || "This illustrates basic syntax rules."
            }
          ]
        };
        fs.writeFileSync(path.join(conceptDestDir, 'beginner.json'), JSON.stringify(beginnerJson, null, 2), 'utf8');

        // 3. intermediate.json
        const intermediateJson = {
          deeperExplanation: `Building on top of basic syntax, intermediate-level application of ${les.title} requires mapping scope boundaries, validating dynamic data types, and ensuring that variable transformations don't create reference memory leaks.`,
          internalImplementation: `When the compiler compiles ${les.title}, it registers local descriptors in the namespace symbol table. Scope bounds are tracked via frame pointers, releasing heap references when the parent frame terminates.`,
          bestPractices: [
            "Keep scope parameters local rather than global.",
            "Profile heavy performance paths to reduce garbage collection cycles.",
            "Use type annotations where supported."
          ],
          performanceConsiderations: {
            timeComplexity: "O(1) average lookup, O(N) linear iteration over collection sets.",
            spaceComplexity: "O(1) auxiliary frame stack memory, O(N) dynamic heap growth."
          },
          examples: [
            {
              title: "Realistic Module Handler",
              code: les.examples?.intermediate?.code || dyn.intermediateExample,
              explanation: les.examples?.intermediate?.explanation || "Combines concepts into an encapsulated class/function context."
            }
          ],
          debuggingWalkthrough: {
            bugDescription: "Scope visibility errors or undefined variable references occur when calling values outside local blocks.",
            incorrectCode: `// Incorrect identifier spelling\nconst ${conceptSlug}_val = 50;\nconsole.log(${conceptSlug}_vals);`,
            correctCode: `// Corrected spelling reference\nconst ${conceptSlug}_val = 50;\nconsole.log(${conceptSlug}_val);`,
            fixExplanation: "Align the calling variable name exactly with its declared identifier inside the namespace."
          }
        };
        fs.writeFileSync(path.join(conceptDestDir, 'intermediate.json'), JSON.stringify(intermediateJson, null, 2), 'utf8');

        // 4. expert.json
        const expertJson = {
          productionExplanation: `In high-performance microservices, ${les.title} is utilized inside concurrency layers, cache indexing segments, and transactional boundaries. Memory pooling and zero-allocation techniques are standard.`,
          designDecisions: `Architects must decide between statically-scoped registers and dynamic binding. In ${lang}, scoping matches lexical nesting, which allows compilers to pre-calculate offset registers, optimizing performance.`,
          examples: [
            {
              title: "Enterprise Grade Service",
              code: les.examples?.advanced?.code || les.examples?.production?.code || dyn.expertExample,
              explanation: "Handles async constraints, handles error boundaries, and provides robust latency monitoring."
            }
          ],
          optimizationTips: [
            "Pre-size collection arrays to prevent redundant reallocation resizing.",
            "Use read-only properties to enable memory consolidation optimization in virtual machines.",
            "Avoid deep call hierarchies to limit stack depth overflows."
          ],
          securityConsiderations: "Sanitize arguments, enforce boundaries to block memory overflow vulnerabilities, and keep token signatures out of logs."
        };
        fs.writeFileSync(path.join(conceptDestDir, 'expert.json'), JSON.stringify(expertJson, null, 2), 'utf8');

        // 5. practice.json
        const practiceJson = {
          easy: {
            problem: `Implement a basic routine demonstrating the startup code syntax for ${les.title}.`,
            starterCode: les.exercises?.[0]?.starter_code || (lang === 'python' ? "# Starter Code\n" : "// Starter Code\n"),
            hints: ["Review the syntax rules in the beginner notes.", "Check name spelling."],
            expectedOutput: "Success",
            solution: les.exercises?.[0]?.solution || (lang === 'python' ? "print('Success')" : "console.log('Success')"),
            explanation: "Verifies basic execution."
          },
          medium: {
            problem: `Refactor the simple routine to support dynamic inputs and raise an exception on out-of-bounds parameters.`,
            starterCode: lang === 'python' ? "def process(val):\n    pass" : "function process(val) {\n}",
            hints: ["Use conditional statements to inspect values.", "Throw ValueError or Error."],
            expectedOutput: "Error raised",
            solution: lang === 'python' ? "def process(val):\n    if val < 0:\n        raise ValueError('Negative value')\n    return val" : "function process(val) {\n    if (val < 0) throw new Error('Negative value');\n    return val;\n}",
            explanation: "Ensures input validation constraints are met."
          },
          hard: {
            problem: `Optimize the routine to run in O(1) time complexity by caching duplicate lookup cycles.`,
            starterCode: lang === 'python' ? "cache = {}\ndef lookup(key):\n    pass" : "const cache = new Map();\nfunction lookup(key) {\n}",
            hints: ["Use a dictionary or Map.", "Store results after the first query."],
            expectedOutput: "Cached output retrieved",
            solution: lang === 'python' ? "cache = {}\ndef lookup(key, calculator):\n    if key not in cache:\n        cache[key] = calculator(key)\n    return cache[key]" : "const cache = new Map();\nfunction lookup(key, calculator) {\n    if (!cache.has(key)) cache.set(key, calculator(key));\n    return cache.get(key);\n}",
            explanation: "Implements high-performance memoization caching."
          },
          debugging: {
            problem: "Locate and correct the spelling mismatch preventing this routine from executing.",
            starterCode: lang === 'python' ? "record_data = 100\nprint(record_datas)" : "const recordData = 100;\nconsole.log(recordDatas);",
            hints: ["Inspect variable identifiers.", "Match call names exactly."],
            expectedOutput: "100",
            solution: lang === 'python' ? "record_data = 100\nprint(record_data)" : "const recordData = 100;\nconsole.log(recordData);",
            explanation: "Aligns identifiers within namespace bindings."
          }
        };
        fs.writeFileSync(path.join(conceptDestDir, 'practice.json'), JSON.stringify(practiceJson, null, 2), 'utf8');

        // 6. quiz.json
        const quizJson = {
          mcqs: (les.mcqs || [
            {
              question: `What is the primary role of ${les.title}?`,
              options: [
                "To manage data storage, execution control, or memory variables.",
                "To bypass standard compiler checks.",
                "To execute database table drop operations.",
                "To download static text pages."
              ],
              correct_option: "A",
              explanation: "Organizes variables or executes code flows cleanly."
            }
          ]).map((q, idx) => ({
            id: `q_${idx + 1}`,
            question: q.question,
            options: q.options || ["Option A", "Option B", "Option C", "Option D"],
            answer: q.correct_option || "A",
            explanation: q.explanation || "Verifies understanding of this core concept.",
            difficulty: idx < 3 ? "Beginner" : idx < 7 ? "Intermediate" : "Advanced",
            topic: les.title
          }))
        };
        // Fill up to 10 MCQs if count is less
        while (quizJson.mcqs.length < 10) {
          const idx = quizJson.mcqs.length;
          quizJson.mcqs.push({
            id: `q_${idx + 1}`,
            question: `In ${lang}, which of the following is true about ${les.title}?`,
            options: [
              "It follows local scope rules.",
              "It runs directly on GPUs with zero CPU usage.",
              "It requires network connections to execute.",
              "It is deprecated in the latest release."
            ],
            answer: "A",
            explanation: "Scopes constrain variable accessibility and prevent collisions.",
            difficulty: idx < 6 ? "Intermediate" : "Advanced",
            topic: les.title
          });
        }
        fs.writeFileSync(path.join(conceptDestDir, 'quiz.json'), JSON.stringify(quizJson, null, 2), 'utf8');

        // 7. cheatsheet.json
        const cheatsheetJson = {
          syntax: (conceptData && conceptData.cheat_sheet) ? conceptData.cheat_sheet(lang) : `## Syntax Reference\n\`\`\`${lang}\n// Declaring and executing ${les.title}\n\`\`\``,
          quickExamples: `// Simple usage\n`,
          commonErrors: [
            { error: "ReferenceError", description: "Calling variables outside their declared scope." }
          ],
          tips: ["Keep naming conventions consistent.", "Document complex parameters."],
          shortcuts: [],
          interviewNotes: "Be ready to explain scoping rules and time/space characteristics.",
          bestPractices: ["Avoid global namespaces.", "Use const / final for read-only variables."],
          memoryTricks: "Think of scopes as Russian nesting dolls — inside dolls can see outside, but outside cannot see inside.",
          quickRevision: "Variables store data. Loops repeat blocks. Functions encapsulate tasks. Objects bundle states."
        };
        fs.writeFileSync(path.join(conceptDestDir, 'cheatsheet.json'), JSON.stringify(cheatsheetJson, null, 2), 'utf8');

        // 8. project.json
        const projectJson = {
          title: les.mini_project?.title || `${les.title} System Dashboard`,
          description: les.mini_project?.description || `Build a light terminal tool managing features of ${les.title}.`,
          requirements: les.mini_project?.requirements || [
            "Define attributes cleanly.",
            "Write functions to query values.",
            "Validate error inputs."
          ],
          starterCode: les.mini_project?.starter_code || (lang === 'python' ? "# Project starter code\n" : "// Project starter code\n"),
          solution: lang === 'python' ? "print('Project Complete!')" : "console.log('Project Complete!');"
        };
        fs.writeFileSync(path.join(conceptDestDir, 'project.json'), JSON.stringify(projectJson, null, 2), 'utf8');

        // 9. resources.json
        const resourcesJson = {
          officialDocs: `https://docs.microsoft.com/en-us/ OR https://docs.python.org/3/`,
          books: [
            { title: "Clean Code", author: "Robert C. Martin" },
            { title: "Design Patterns", author: "Gang of Four" }
          ],
          articles: [
            { title: `Understanding ${les.title} Internals`, url: "https://medium.com" }
          ],
          references: ["MDN Web Docs", "Stack Overflow Guide"],
          externalTools: ["Visual Studio Code", "Git"],
          practiceWebsites: ["LeetCode", "HackerRank"]
        };
        fs.writeFileSync(path.join(conceptDestDir, 'resources.json'), JSON.stringify(resourcesJson, null, 2), 'utf8');

        // 10. videos.json
        const videosJson = [
          {
            title: `Intro to ${les.title}`,
            channel: "freeCodeCamp",
            videoId: "PkZNo7MFNFg",
            duration: "15m"
          }
        ];
        fs.writeFileSync(path.join(conceptDestDir, 'videos.json'), JSON.stringify(videosJson, null, 2), 'utf8');

        // 11. interview.json
        const interviewJson = {
          questions: (conceptData && conceptData.interview_questions)
            ? conceptData.interview_questions(lang).map(q => ({
                question: q.question,
                answer: q.answer,
                difficulty: q.difficulty || "Intermediate"
              }))
            : [
                {
                  question: `How does the compiler handle variables or instructions for ${les.title} in memory?`,
                  answer: "It creates registers in symbol lookups, mapping names to stack stack offsets or heap addresses.",
                  difficulty: "Intermediate"
                }
              ]
        };
        // Pad to at least 10 interview questions
        while (interviewJson.questions.length < 10) {
          const idx = interviewJson.questions.length;
          interviewJson.questions.push({
            question: `What are the performance characteristics of high-frequency ${les.title} queries?`,
            answer: `It depends on the data structure used. Average queries execute in O(1) time when using hash indexes, but can degrade to O(N) linear search if colliding.`,
            difficulty: idx < 5 ? "Intermediate" : "Advanced"
          });
        }
        fs.writeFileSync(path.join(conceptDestDir, 'interview.json'), JSON.stringify(interviewJson, null, 2), 'utf8');

        // 12. revision.json
        const revisionJson = {
          summary: `You have completed this lesson! You studied how ${les.title} allocates memory, processes syntax rules, handles errors, and executes in production environments.`,
          keyFormulas: ["O(1) hash mapping", "O(N) linear scan"],
          keySyntax: [`// ${lang} syntax definition\n`],
          mindMap: ["State -> Declarations -> Stack Frame -> Heap allocation"],
          flashcards: [
            { front: `What is the primary role of ${les.title}?`, back: "To manage states, loop checks, or object definitions." },
            { front: "Is local scope preferred over global scope?", back: "Yes, to avoid namespace collisions and memory leakage." }
          ]
        };
        fs.writeFileSync(path.join(conceptDestDir, 'revision.json'), JSON.stringify(revisionJson, null, 2), 'utf8');
      });
    });

    console.log(`✅ Migrated roadmap: ${roadmapId} to concept-first format.`);
  }

  console.log('🎉 Curriculum migration complete!');
}

migrate();
