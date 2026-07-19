'use strict';

const fs = require('fs');
const path = require('path');

const { buildAllContent } = require('./generators/builders');
const { getConceptData } = require('./generators/concepts');

const CURRICULUM_DIR = path.resolve(__dirname, '..', '..', 'curriculum');
const LOCALE = 'en';

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function lessonToWords(slug) {
  return slug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function classifyConcept(title, moduleName) {
  const t = title.toLowerCase();
  const m = (moduleName || '').toLowerCase();
  if (/sqlite|mysql|postgres/i.test(m) || /sqlite|mysql|postgres/i.test(t)) return 'DATABASE';
  if (/comprehension/i.test(t)) return 'COMPREHENSIONS';
  if (/migration|schema|table|crud/i.test(t)) return 'DATABASE';
  if (/interpreter|repl|shell|terminal|install/i.test(t)) return 'SETUP';
  if (/if|else|ternary|condition|branch/i.test(t)) return 'CONDITIONALS';
  if (/for\s*loop|while\s*loop|loop\s*control|do\s*while|iteration/i.test(t)) return 'LOOPS';
  if (/function|lambda|def\b|method|parameter|argument|return/i.test(t)) return 'FUNCTIONS';
  if (/variable|dynamic\s*typing|declaration|hoisting|scope/i.test(t)) return 'VARIABLES';
  if (/string|boolean|numeric|number|int|float|data.type/i.test(t)) return 'DATA_TYPES';
  if (/list|array.*operation|indexing|slicing/i.test(t)) return 'LISTS';
  if (/tuple|immutab/i.test(t)) return 'TUPLES';
  if (/dictionary|dict|key.value|hash.map|map\b/i.test(t)) return 'DICTIONARY';
  if (/set\b|set.operation|hash.set/i.test(t)) return 'SETS';
  if (/file|read|write|stream|i\/o/i.test(t)) return 'FILE_IO';
  if (/exception|try|catch|throw|raise|error|finally/i.test(t)) return 'EXCEPTIONS';
  if (/context.manager|with\b|resource/i.test(t)) return 'CONTEXT_MANAGERS';
  if (/class|object|oop|inherit|polymorph|encapsul|abstract|interface/i.test(t)) return 'OOP';
  if (/import|module|package|library|dependency|virtual.env/i.test(t)) return 'MODULES';
  if (/install|setup|env|interpreter|repl|script/i.test(t)) return 'SETUP';
  if (/database|sql|orm|query|migration|schema|table|crud/i.test(t)) return 'DATABASE';
  if (/node|express|middleware|route|api|rest|express/i.test(t)) return 'NODE';
  if (/linked.list|node\b|pointer/i.test(t) && !/node\.(js|developer)/i.test(t)) return 'LINKED_LIST';
  if (/stack\b|push|pop|LIFO/i.test(t) && !/full.?stack|stack.?overflow/i.test(t)) return 'STACK';
  if (/queue|dequeue|enqueue|FIFO|priority/i.test(t)) return 'QUEUE';
  if (/tree|bst|binary.*tree|traversal|inorder|preorder|postorder/i.test(t)) return 'TREE';
  if (/graph|bfs|dfs|adjacency|vertex|edge/i.test(t)) return 'GRAPH';
  if (/hash|hash.table|hash.map|collision|bucket/i.test(t)) return 'HASH_TABLE';
  if (/sort|bubble|merge|quick|insertion|selection/i.test(t)) return 'SORTING';
  if (/search|binary.search|linear/i.test(t)) return 'SEARCHING';
  if (/recursion|recursive|base.case/i.test(t)) return 'RECURSION';
  if (/dp|dynamic.program|memoization|tabulation|overlap/i.test(t)) return 'DYNAMIC_PROGRAMMING';
  if (/greedy|optimization/i.test(t)) return 'GREEDY';
  if (/backtrack|n.queens|sudoku|permutation/i.test(t)) return 'BACKTRACKING';
  if (/select|from|where|join|group.by|having|order.by|aggregate/i.test(t)) return 'SQL_QUERIES';
  if (/join|inner|left|right|cross|self/i.test(t)) return 'SQL_JOINS';
  if (/subquery|nested|correlated/i.test(t)) return 'SQL_SUBQUERIES';
  if (/index|view|trigger|procedure|function/i.test(t)) return 'SQL_ADVANCED';
  if (/html|tag|element|attribute|dom/i.test(t)) return 'HTML';
  if (/css|style|selector|flex|grid|layout/i.test(t)) return 'CSS';
  if (/react|component|jsx|state|prop|hook/i.test(t)) return 'REACT';
  if (/node|express|middleware|route|api|rest/i.test(t)) return 'NODE';
  if (/array\b|array.method/i.test(t)) return 'ARRAYS';
  return 'GENERIC';
}

function writeLessonFiles(lessonDir, content) {
  const localeDir = path.join(lessonDir, 'locales', LOCALE);
  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir, { recursive: true });
  }
  const fileMap = {
    'beginner.json': content.beginner,
    'intermediate.json': content.intermediate,
    'expert.json': content.expert,
    'practice.json': content.practice,
    'quiz.json': content.quiz,
    'project.json': content.project,
    'cheatsheet.json': content.cheatsheet,
    'interview.json': content.interview,
    'revision.json': content.revision,
    'resources.json': content.resources,
    'videos.json': content.videos
  };
  for (const [filename, data] of Object.entries(fileMap)) {
    fs.writeFileSync(path.join(localeDir, filename), JSON.stringify(data, null, 2), 'utf8');
  }
}

function processRoadmap(roadmapId) {
  const rmPath = path.join(CURRICULUM_DIR, roadmapId);
  const rmJsonPath = path.join(rmPath, 'roadmap.json');
  if (!fs.existsSync(rmJsonPath)) {
    console.log(`  \u26a0  No roadmap.json found at ${rmJsonPath}, skipping`);
    return 0;
  }
  const rmMeta = JSON.parse(fs.readFileSync(rmJsonPath, 'utf8'));
  const roadmapTitle = rmMeta.title || lessonToWords(roadmapId);
  const language = rmMeta.language || 'javascript';
  const modulesDir = path.join(rmPath, 'modules');
  if (!fs.existsSync(modulesDir)) {
    console.log(`  \u26a0  No modules/ directory for ${roadmapId}, skipping`);
    return 0;
  }
  let lessonCount = 0;
  const modDirs = fs.readdirSync(modulesDir).filter(d => fs.statSync(path.join(modulesDir, d)).isDirectory());
  for (const modDir of modDirs) {
    const modPath = path.join(modulesDir, modDir);
    const modJsonPath = path.join(modPath, 'module.json');
    if (!fs.existsSync(modJsonPath)) continue;
    const modMeta = JSON.parse(fs.readFileSync(modJsonPath, 'utf8'));
    const moduleName = modMeta.name || lessonToWords(modDir);
    const lessonDirs = fs.readdirSync(modPath).filter(d => fs.statSync(path.join(modPath, d)).isDirectory());
    for (const lessonDir of lessonDirs) {
      const lessonPath = path.join(modPath, lessonDir);
      const lessonJsonPath = path.join(lessonPath, 'lesson.json');
      if (!fs.existsSync(lessonJsonPath)) continue;
      const lesMeta = JSON.parse(fs.readFileSync(lessonJsonPath, 'utf8'));
      const lessonTitle = lesMeta.title || lessonToWords(lessonDir);
      const conceptType = classifyConcept(lessonTitle, moduleName);
      console.log(`    \u{1f4dd} ${lessonTitle} [${conceptType}]`);
      const data = getConceptData(conceptType, lessonTitle, moduleName, roadmapTitle, language);
      const content = buildAllContent(data, language, roadmapTitle, conceptType);
      writeLessonFiles(lessonPath, content);
      lessonCount++;
    }
  }
  return lessonCount;
}

async function main() {
  const targetRoadmap = process.argv[2];
  let totalLessons = 0;
  if (targetRoadmap) {
    console.log(`\n\u{1f4da} Processing single roadmap: ${targetRoadmap}\n`);
    const count = processRoadmap(targetRoadmap);
    totalLessons += count;
    console.log(`\n\u2705 Done. ${count} lessons written for ${targetRoadmap}.\n`);
  } else {
    const roadmaps = fs.readdirSync(CURRICULUM_DIR).filter(d => fs.statSync(path.join(CURRICULUM_DIR, d)).isDirectory());
    console.log(`\n\u{1f4da} Processing ALL ${roadmaps.length} roadmaps...\n`);
    for (const rm of roadmaps) {
      console.log(`  \u{1f4c1} ${rm}...`);
      const count = processRoadmap(rm);
      totalLessons += count;
      console.log(`     ${count} lessons written.\n`);
    }
    console.log(`\n\u2705 Complete. ${totalLessons} lessons written across ${roadmaps.length} roadmaps.\n`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
