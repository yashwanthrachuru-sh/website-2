// ============================================================
// backend/services/contentEngine.js
// EduNet Human Teaching Engine — Coordinator & Entry Point
// ============================================================
'use strict';

const path = require('path');
const fs = require('fs');

const conceptEngine = require('../curriculum/engine/ConceptContentEngine');
const lessonGenerator = require('../curriculum/engine/LessonGenerator');

const STRUCTURED_OPEN  = '<!--EDUNET_STRUCTURED_V1-->';
const STRUCTURED_CLOSE = '<!--/EDUNET_STRUCTURED_V1-->';
const SECTION_OPEN  = (name) => `<!--SECTION:${name}-->`;
const SECTION_CLOSE = (name) => `<!--/SECTION:${name}-->`;

const LESSON_SECTIONS = lessonGenerator.LESSON_SECTIONS;

/**
 * Checks whether the lesson has substantive curriculum content.
 * Looks for the EDUNET_STRUCTURED_V1 markers and at least 3 populated sections.
 */
function isContentComplete(learningNotes) {
  if (!learningNotes || typeof learningNotes !== 'string') return false;
  if (!learningNotes.includes('<!--EDUNET_STRUCTURED_V1-->')) return false;
  if (!learningNotes.includes('<!--/EDUNET_STRUCTURED_V1-->')) return false;
  const sectionCount = (learningNotes.match(/<!--SECTION:/g) || []).length;
  return sectionCount >= 3;
}

/**
 * Legacy wrapper for compatibility.
 */
function serializeLessonContent(sectionsObj) {
  const parts = [STRUCTURED_OPEN];
  for (const key of LESSON_SECTIONS) {
    if (sectionsObj[key] !== undefined) {
      parts.push(SECTION_OPEN(key));
      parts.push(String(sectionsObj[key]));
      parts.push(SECTION_CLOSE(key));
    }
  }
  parts.push(STRUCTURED_CLOSE);
  return parts.join('\n');
}

/**
 * Returns structured content parsed from learning_notes.
 */
function parseStructuredContent(learningNotes) {
  if (!learningNotes) return null;
  const result = {};
  const sectionPattern = /<!--SECTION:(\w+)-->([\s\S]*?)<!--\/SECTION:\1-->/g;
  let match;
  while ((match = sectionPattern.exec(learningNotes)) !== null) {
    result[match[1]] = match[2].trim();
  }
  return Object.keys(result).length > 0 ? result : null;
}

/**
 * Dynamically loads and compiles the lesson metadata and components from the curriculum folder.
 */
async function generateFullLessonContent(metadata, lang = 'javascript') {
  const title = metadata.lessonTitle || metadata.title || '';
  const moduleName = metadata.module || '';
  const roadmapId = metadata.roadmap_id || metadata.roadmap || 'python';

  const resolved = conceptEngine.getConceptContent(title, moduleName, lang, roadmapId);
  if (!resolved || !resolved.content) {
    throw new Error(`Curriculum content not found for lesson: "${title}" inside "${moduleName}"`);
  }
  return resolved.content;
}

/**
 * Enrich lesson structure with all 12 JSON curriculum sections.
 * This function handles API payloads and attaches cheatsheets, quizzes,
 * practices, videos, resources, and interview questions.
 */
/**
 * Safe Array conversion with warning logger
 */
function safeArray(val, fieldName, context = '') {
  if (Array.isArray(val)) {
    return val;
  }
  if (val !== undefined && val !== null) {
    console.warn(`[ContentEngine Warning] In ${context}, expected array for '${fieldName}', but got: ${typeof val}. Falling back to empty array.`);
  }
  return [];
}

/**
 * Safe Object conversion with warning logger
 */
function safeObject(val, fieldName, context = '') {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val;
  }
  if (val !== undefined && val !== null) {
    console.warn(`[ContentEngine Warning] In ${context}, expected object for '${fieldName}', but got: ${typeof val}. Falling back to empty object.`);
  }
  return {};
}

function normalizeBeginner(rawBeginner, context = '') {
  const b = safeObject(rawBeginner, 'beginner', context);
  const examplesRaw = b.examples || b.example;
  const examplesList = safeArray(examplesRaw, 'beginner.examples', context);

  // Normalize memoryDiagram — supports both {stack,heap} and {slots} formats
  let memDiagram = null;
  if (b.memoryDiagram) {
    if (b.memoryDiagram.slots) {
      // Legacy flat slots format
      memDiagram = { slots: safeArray(b.memoryDiagram.slots, 'beginner.memoryDiagram.slots', context), stack: [], heap: [] };
    } else {
      memDiagram = {
        stack: safeArray(b.memoryDiagram.stack, 'beginner.memoryDiagram.stack', context).map(item => ({
          address: item.address || '', label: item.label || '', value: item.value || '', type: item.type || ''
        })),
        heap: safeArray(b.memoryDiagram.heap, 'beginner.memoryDiagram.heap', context).map(item => ({
          address: item.address || '', label: item.label || '', value: item.value || '', type: item.type || ''
        }))
      };
    }
  }

  return {
    // Fields used by lesson-adapter.js + renderers
    motivation            : b.motivation || '',
    curiosityQuestion     : b.curiosityQuestion || b.motivation || '',
    whyExists             : b.whyExists || b.why_exists || '',
    problemItSolves       : b.problemItSolves || '',
    programmingWithoutVariables: b.programmingWithoutVariables || b.withoutVariables || '',
    whereVariablesAreUsed : b.whereVariablesAreUsed || b.whereUsed || '',
    simpleExplanation     : b.simpleExplanation || b.explanation || '',
    syntaxExplanation     : b.syntaxExplanation || b.syntax_breakdown || '',
    visualDiagram         : b.visualDiagram || b.visual_flow || '',
    realWorldAnalogy      : b.realWorldAnalogy || b.real_world_analogies || '',
    examples: examplesList.map(e => ({
      title       : e.title || e.description || '',
      code        : e.code || '',
      explanation : e.explanation || e.desc || ''
    })),
    stepByStepExecution: safeArray(b.stepByStepExecution || b.stepByStep, 'beginner.stepByStepExecution', context).map(s => ({
      step : Number(s.step) || 0,
      line : s.line || s.code || '',
      desc : s.desc || s.explanation || ''
    })),
    namingRules: safeArray(b.namingRules, 'beginner.namingRules', context).map(r => ({
      rule : r.rule || String(r),
      good : r.good || '',
      bad  : r.bad  || '',
      why  : r.why  || ''
    })),
    commonMistakes: safeArray(b.commonMistakes, 'beginner.commonMistakes', context).map(m => ({
      mistake : m.mistake || m.error || String(m),
      wrong   : m.wrong   || m.bad   || '',
      error   : m.error   || '',
      right   : m.right   || m.good  || '',
      why     : m.why     || m.fix   || ''
    })),
    memoryDiagram: memDiagram || { stack: [], heap: [] }
  };
}

function normalizeIntermediate(rawIntermediate, context = '') {
  const im = safeObject(rawIntermediate, 'intermediate', context);
  const examplesRaw = im.examples || im.example;
  const examplesList = safeArray(examplesRaw, 'intermediate.examples', context);

  // bestPractices can be array of strings or array of {rule, good, why} objects — preserve both
  const bpRaw = safeArray(im.bestPractices || im.best_practices, 'intermediate.bestPractices', context);
  const bestPractices = bpRaw.map(bp => {
    if (typeof bp === 'string') return { rule: bp, good: '', why: '' };
    return { rule: bp.rule || bp.practice || String(bp), good: bp.good || bp.example || '', bad: bp.bad || '', why: bp.why || bp.reason || '' };
  });

  return {
    deeperExplanation      : im.deeperExplanation || im.detailed_concept || '',
    mutabilityExplained    : im.mutabilityExplained || im.mutability || '',
    noneValue              : im.noneValue || im.none_value || '',
    internalImplementation : im.internalImplementation || im.internal_working || '',
    examples: examplesList.map(e => ({
      title       : e.title || e.description || '',
      code        : e.code || '',
      explanation : e.explanation || e.desc || ''
    })),
    bestPractices,
    edgeCases: safeArray(im.edgeCases || im.edge_cases, 'intermediate.edgeCases', context).map(ec => {
      if (typeof ec === 'string') return { case: ec, code: '', explanation: ec };
      return { case: ec.case || ec.title || '', code: ec.code || '', explanation: ec.explanation || ec.desc || '' };
    }),
    performanceConsiderations: {
      timeComplexity  : im.performanceConsiderations?.timeComplexity  || im.performance?.timeComplexity  || '',
      spaceComplexity : im.performanceConsiderations?.spaceComplexity || im.performance?.spaceComplexity || '',
      notes           : im.performanceConsiderations?.notes || im.performanceNotes || ''
    },
    debuggingWalkthrough: {
      bugDescription : im.debuggingWalkthrough?.bugDescription || im.debugging?.bugDescription || '',
      scenario       : im.debuggingWalkthrough?.scenario || '',
      incorrectCode  : im.debuggingWalkthrough?.incorrectCode || im.debugging?.incorrectCode || im.debugging?.wrong || '',
      errorMessage   : im.debuggingWalkthrough?.errorMessage || im.debugging?.error || '',
      correctCode    : im.debuggingWalkthrough?.correctCode || im.debugging?.correctCode || im.debugging?.right || '',
      whyItHappens   : im.debuggingWalkthrough?.whyItHappens || im.debuggingWalkthrough?.why || ''
    }
  };
}

function normalizeExpert(rawExpert, context = '') {
  const ex = safeObject(rawExpert, 'expert', context);
  const examplesRaw = ex.examples || ex.example;
  const examplesList = safeArray(examplesRaw, 'expert.examples', context);

  return {
    overview          : ex.overview || ex.production_overview || '',
    industryContext   : ex.industryContext || ex.industry_context || '',
    examples: examplesList.map(e => ({
      title       : e.title || e.description || '',
      code        : e.code || '',
      explanation : e.explanation || e.desc || ''
    })),
    codeReviewChecklist: safeArray(ex.codeReviewChecklist || ex.code_review_checklist, 'expert.codeReviewChecklist', context).map(item => String(item)),
    testingVariables: ex.testingVariables || ex.testing_patterns || {
      objective : '',
      code      : ''
    },
    refactoringGuide: {
      before      : ex.refactoringGuide?.before || '',
      after       : ex.refactoringGuide?.after  || '',
      explanation : ex.refactoringGuide?.explanation || ex.refactoringGuide?.why || ''
    },
    securityConsiderations: safeArray(ex.securityConsiderations || ex.security, 'expert.securityConsiderations', context).map(s => {
      if (typeof s === 'string') return { risk: s, bad: '', good: '', why: s };
      return { risk: s.risk || s.title || '', bad: s.bad || '', good: s.good || '', why: s.why || s.explanation || '' };
    }),
    designPatterns: safeArray(ex.designPatterns || ex.design_patterns, 'expert.designPatterns', context).map(p => String(p)),
    scalabilityConsiderations: ex.scalabilityConsiderations || ex.scalability || {},
    complexityAnalysis: {
      time  : ex.complexityAnalysis?.time  || ex.timeComplexity  || '',
      space : ex.complexityAnalysis?.space || ex.spaceComplexity || '',
      notes : ex.complexityAnalysis?.notes || ''
    }
  };
}

function normalizePractice(rawPractice, context = '') {
  const p = safeObject(rawPractice, 'practice', context);

  const normalizePracticeItem = (item, defaultTitle, fieldName) => {
    if (!item) return null;
    const it = safeObject(item, `practice.${fieldName}`, context);
    
    let hintsList = [];
    if (it.hints) {
      hintsList = safeArray(it.hints, `practice.${fieldName}.hints`, context);
    } else if (it.hint) {
      hintsList = [it.hint];
    }

    return {
      title: it.title || defaultTitle,
      description: it.description || it.problem || '',
      problem: it.problem || it.description || '',
      starterCode: it.starterCode || it.code || '',
      expectedOutput: it.expectedOutput || '',
      solution: it.solution || '',
      hints: hintsList.map(h => String(h))
    };
  };

  return {
    easy: normalizePracticeItem(p.easy, 'Easy Challenge', 'easy'),
    medium: normalizePracticeItem(p.medium, 'Medium Challenge', 'medium'),
    hard: normalizePracticeItem(p.hard, 'Hard Challenge', 'hard'),
    debugging: normalizePracticeItem(p.debugging, 'Debugging Exercise', 'debugging')
  };
}

function normalizeQuiz(rawQuiz, context = '') {
  const q = safeObject(rawQuiz, 'quiz', context);
  const mcqsList = safeArray(q.mcqs, 'quiz.mcqs', context);
  const checkpointsList = safeArray(q.checkpoints, 'quiz.checkpoints', context);

  return {
    mcqs: mcqsList.map(item => ({
      id          : item.id || '',
      question    : item.question || '',
      options     : safeArray(item.options, 'quiz.mcqs[].options', context).map(opt => String(opt)),
      answer      : item.answer || '',
      explanation : item.explanation || '',
      difficulty  : item.difficulty || 'medium'
    })),
    // Checkpoint questions gate progression through stepper steps
    checkpoints: checkpointsList.map(cp => ({
      question    : cp.question || '',
      options     : safeArray(cp.options, 'quiz.checkpoints[].options', context).map(opt => String(opt)),
      correct     : typeof cp.correct === 'number' ? cp.correct : 0,
      explanation : cp.explanation || ''
    }))
  };
}

function normalizeCheatsheet(rawCheatsheet, context = '') {
  const cs = safeObject(rawCheatsheet, 'cheatsheet', context);
  const sectionsList = cs.sections;

  const normalizedSections = [];
  if (Array.isArray(sectionsList)) {
    sectionsList.forEach((sec, idx) => {
      const entries = safeArray(sec.entries, `cheatsheet.sections[${idx}].entries`, context).map(ent => ({
        syntax: ent.syntax || '',
        example: ent.example || '',
        description: ent.description || '',
        commonMistake: ent.commonMistake || ent.mistake || ''
      }));
      normalizedSections.push({
        heading: sec.heading || 'Syntax Guide',
        entries
      });
    });
  } else {
    if (cs.syntax || cs.quickExamples || cs.quickRevision) {
      const syntaxStr = cs.syntax || 'Syntax Reference';
      const exampleStr = cs.quickExamples || 'Code Examples';
      normalizedSections.push({
        heading: 'General Syntax Reference',
        entries: [
          {
            syntax: typeof syntaxStr === 'string' ? (syntaxStr.split('\n')[0] || '// Syntax') : '// Syntax',
            example: typeof exampleStr === 'string' ? exampleStr : 'Example snippet',
            description: cs.quickRevision || 'Quick Reference Guide',
            commonMistake: Array.isArray(cs.commonErrors) && cs.commonErrors[0] ? cs.commonErrors[0].description : ''
          }
        ]
      });
    }
  }

  return {
    printNote: cs.printNote || 'Print this cheat sheet or use the search bar.',
    sections: normalizedSections
  };
}

function normalizeProject(rawProject, context = '') {
  const pr = safeObject(rawProject, 'project', context);
  const goals = pr.learningGoals || pr.objectives;
  const learningGoals = safeArray(goals, 'project.learningGoals', context).map(g => String(g));

  return {
    title: pr.title || 'Mini Project',
    tagline: pr.tagline || 'Module Practical Project',
    description: pr.description || '',
    learningGoals: learningGoals,
    requirements: safeArray(pr.requirements, 'project.requirements', context).map(r => String(r)),
    starterCode: pr.starterCode || '',
    solution: pr.solution || '',
    solutionExpl: pr.solutionExpl || '',
    expectedOutput: pr.expectedOutput || '',
    extensions: safeArray(pr.extensions, 'project.extensions', context).map(ext => String(ext))
  };
}

function normalizeResources(rawResources, context = '') {
  let rawLinks = [];
  if (Array.isArray(rawResources)) {
    rawLinks = rawResources;
  } else if (rawResources && Array.isArray(rawResources.links)) {
    rawLinks = rawResources.links;
  } else if (rawResources && typeof rawResources === 'object') {
    Object.keys(rawResources).forEach(key => {
      if (typeof rawResources[key] === 'string') {
        rawLinks.push({
          type: 'reference',
          title: key.replace(/_/g, ' '),
          url: rawResources[key]
        });
      }
    });
  } else if (rawResources !== undefined && rawResources !== null) {
    console.warn(`[ContentEngine Warning] In ${context}, expected array/object for 'resources', but got: ${typeof rawResources}.`);
  }

  return {
    links: rawLinks.map(link => ({
      type: link.type || 'reference',
      title: link.title || 'Resource Link',
      url: link.url || ''
    }))
  };
}

function normalizeVideos(rawVideos, context = '') {
  let vids = [];
  if (Array.isArray(rawVideos)) {
    vids = rawVideos;
  } else if (rawVideos && Array.isArray(rawVideos.items)) {
    vids = rawVideos.items;
  } else if (rawVideos !== undefined && rawVideos !== null) {
    console.warn(`[ContentEngine Warning] In ${context}, expected array for 'videos', but got: ${typeof rawVideos}.`);
  }

  return vids.map(v => {
    const video_id = v.video_id || v.videoId || 'rfscVS0vtbw';
    return {
      title: v.title || 'Introduction Video',
      url: v.url || `https://www.youtube.com/watch?v=${video_id}`,
      video_id: video_id,
      thumbnail: v.thumbnail || `https://img.youtube.com/vi/${video_id}/maxresdefault.jpg`,
      channel: v.channel || 'EduNet Learning',
      duration: v.duration || '5m',
      description: v.description || 'Educational concept tutorial'
    };
  });
}

function normalizeInterview(rawInterview, context = '') {
  const iv = safeObject(rawInterview, 'interview', context);
  const questionsList = safeArray(iv.questions, 'interview.questions', context);

  return {
    questions: questionsList.map(q => ({
      question: q.question || '',
      answer: q.fullAnswer || q.answer || q.shortAnswer || '',
      level: q.level || q.difficulty || 'beginner'
    }))
  };
}

function normalizeRevision(rawRevision, context = '') {
  const rv = safeObject(rawRevision, 'revision', context);
  const takeaways = rv.keyTakeaways || rv.key_takeaways;

  return {
    summary: rv.summary || '',
    oneLineSummary: rv.oneLineSummary || rv.summary || '',
    keyTakeaways: safeArray(takeaways, 'revision.keyTakeaways', context).map(t => String(t)),
    memoryTricks: safeArray(rv.memoryTricks, 'revision.memoryTricks', context).map(t => ({
      concept: t.concept || '',
      trick: t.trick || ''
    })),
    commonErrors: safeArray(rv.commonErrors, 'revision.commonErrors', context).map(e => {
      if (e && typeof e === 'object') {
        return {
          error: e.error || '',
          cause: e.cause || '',
          fix: e.fix || ''
        };
      }
      return String(e);
    }),
    preInterviewChecklist: safeArray(rv.preInterviewChecklist, 'revision.preInterviewChecklist', context).map(c => String(c)),
    nextTopics: safeArray(rv.nextTopics, 'revision.nextTopics', context).map(t => ({
      title: t.title || '',
      whyNext: t.whyNext || ''
    }))
  };
}

function enrichLesson(lesson) {
  if (!lesson) return lesson;

  const title = lesson.title || '';
  const moduleName = lesson.module_title || '';
  const lang = (lesson.language || 'javascript').toLowerCase();
  const roadmapId = lesson.roadmap_id || 'python';
  const context = `Lesson "${title}" (Module: "${moduleName}", Language: "${lang}", Roadmap: "${roadmapId}")`;

  let resolved = conceptEngine.getConceptContent(title, moduleName, lang, roadmapId);
  if (!resolved) {
    resolved = {
      schemaVersion: '2.0',
      lessonMeta: { title, level: 'beginner', order: 1, module: moduleName, roadmap: roadmapId },
      content: { raw: {} }
    };
  }

  const s = resolved.content;
  const raw = s.raw || {};

  lesson.schemaVersion = resolved.schemaVersion || '2.0';
  lesson.lessonMeta    = resolved.lessonMeta    || {};
  lesson.level         = resolved.lessonMeta?.level || 'beginner';
  lesson.order         = resolved.lessonMeta?.order || 1;
  lesson.module        = resolved.lessonMeta?.module || moduleName;
  lesson.roadmap       = resolved.lessonMeta?.roadmap || roadmapId;

  lesson.structured_content = s;
  lesson.raw = raw;
  lesson.stages = s.stages;

  // Use the modular normalization layer
  lesson.beginner = normalizeBeginner(raw.beginner, context);
  lesson.intermediate = normalizeIntermediate(raw.intermediate, context);
  lesson.expert = normalizeExpert(raw.expert, context);
  lesson.practice = normalizePractice(raw.practice, context);
  lesson.quiz = normalizeQuiz(raw.quiz, context);
  lesson.cheatsheet = normalizeCheatsheet(raw.cheatsheet, context);
  lesson.project = normalizeProject(raw.project, context);
  lesson.resources = normalizeResources(raw.resources, context);
  lesson.videos = normalizeVideos(raw.videos, context);
  lesson.interview = normalizeInterview(raw.interview, context);
  lesson.revision = normalizeRevision(raw.revision, context);

  // Attach legacy variables if any code expects them
  lesson.practice.coding = s.coding_practice;
  lesson.practice.mcqs = s.mcqs;
  lesson.practice.projects = s.project_ideas;

  // Build legacy fields
  lesson.learning_sections = [
    { title: "Definition", content: s.definition },
    { title: "Why it is important", content: s.importance },
    { title: "Real-life analogy", content: s.real_world_analogies },
    { title: "Simple example", content: s.beginner_example },
    { title: "Line-by-line explanation", content: s.line_by_line },
    { title: "One real-world application", content: s.production_example },
    { title: "Common mistakes", content: s.common_mistakes },
    { title: "Interview question", content: s.interview_questions },
    { title: "Summary", content: s.summary }
  ];

  lesson.generated_examples = [
    { title: "Simple Example", code: s.beginner_example },
    { title: "Explanation", content: s.line_by_line }
  ];

  lesson.interview_questions = lesson.interview.questions.map(q => ({
    title: q.question,
    content: q.answer
  }));

  return lesson;
}

function enrichTool(tool) {
  if (!tool) return tool;
  tool.enriched = true;
  tool.structured_guide = {
    overview: `Learning guide for ${tool.name || 'this tool'}.`,
    use_cases: ['General integration', 'Automated tasks'],
    tutorials: []
  };
  return tool;
}

function generate(opts) {
  if (opts && opts.type === 'career_plan') {
    return {
      weeks: [
        {
          week: 1,
          title: "Week 1: Core Fundamentals & Syntax",
          desc: `Establish core vocabulary and basic constructs for reaching your career goal: ${opts.goal || 'General Mastery'}.`,
          tasks: [
            { title: "Complete Beginner Lessons", desc: "Study variable declaration, compiler memory layouts, and basic arithmetic operations.", type: "lesson", xp: 100 },
            { title: "Solve Basic Algorithm Problems", desc: "Implement code structures for simple conditional expressions and logic loops.", type: "challenge", xp: 100 },
            { title: "Write Daily Summary Notes", desc: "Review cheatsheets for keywords and syntax naming standards.", type: "notes", xp: 100 }
          ],
          recs: [
            { id: "python", type: "roadmap", title: "Python Developer Track", desc: "Master basic logic gates and structural paradigms." }
          ]
        },
        {
          week: 2,
          title: "Week 2: Data Structures & Debugging",
          desc: "Learn intermediate data scoping rules, memory registers, and error handling protocols.",
          tasks: [
            { title: "Build Modular Mini Project", desc: "Synthesize lessons learned in week 1 to build a cohesive CLI application.", type: "project", xp: 150 },
            { title: "Resolve Complex Logic Challenges", desc: "Solve challenges related to arrays mapping, mutations, and collections.", type: "challenge", xp: 150 },
            { title: "Technical Screening Simulation", desc: "Simulate answers for common company interview questions.", type: "interview", xp: 150 }
          ],
          recs: [
            { id: "javascript", type: "roadmap", title: "JavaScript Core Logic", desc: "Learn asynchronous flows, scopes, and array helper methods." }
          ]
        }
      ]
    };
  }

  // Fallback for video topic helper
  return {
    definition: `Overview and objectives covering the topic: ${opts.topic || 'Video Topic'}.`,
    learning_objectives: ['Analyze core theoretical mechanics', 'Synthesize implementation patterns', 'Verify execution correctness'],
    project_ideas: ['Build a localized module or proof of concept applying these guidelines']
  };
}

module.exports = {
  isContentComplete,
  generateFullLessonContent,
  enrichLesson,
  serializeLessonContent,
  parseStructuredContent,
  LESSON_SECTIONS,
  enrichTool,
  generate,
  normalizeBeginner,
  normalizeIntermediate,
  normalizeExpert,
  normalizePractice,
  normalizeQuiz,
  normalizeCheatsheet,
  normalizeProject,
  normalizeResources,
  normalizeVideos,
  normalizeInterview,
  normalizeRevision
};
