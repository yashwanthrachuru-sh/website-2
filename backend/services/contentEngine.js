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
 * Always returns true since all files are loaded statically from the curriculum folder.
 */
function isContentComplete(learningNotes) {
  return true;
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
function enrichLesson(lesson) {
  if (!lesson) return lesson;

  const title = lesson.title || '';
  const moduleName = lesson.module_title || '';
  const lang = (lesson.language || 'javascript').toLowerCase();
  const roadmapId = lesson.roadmap_id || 'python';

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

  lesson.beginner = raw.beginner || {};
  lesson.intermediate = raw.intermediate || {};
  lesson.expert = raw.expert || {};
  
  const p = raw.practice || {};
  const normalizePracticeItem = (item, defaultTitle) => {
    if (!item) return null;
    return {
      title: item.title || defaultTitle,
      description: item.description || item.problem || '',
      problem: item.problem || item.description || '',
      starterCode: item.starterCode || item.code || '',
      expectedOutput: item.expectedOutput || '',
      solution: item.solution || '',
      hints: Array.isArray(item.hints) ? item.hints : (item.hint ? [item.hint] : [])
    };
  };

  lesson.practice = {
    easy: normalizePracticeItem(p.easy, 'Easy Challenge'),
    medium: normalizePracticeItem(p.medium, 'Medium Challenge'),
    hard: normalizePracticeItem(p.hard, 'Hard Challenge'),
    debugging: normalizePracticeItem(p.debugging, 'Debugging Exercise'),
    coding: s.coding_practice,
    mcqs: s.mcqs,
    projects: s.project_ideas
  };

  lesson.quiz = raw.quiz || { mcqs: [] };
  if (!Array.isArray(lesson.quiz.mcqs)) lesson.quiz.mcqs = [];

  const cs = raw.cheatsheet || {};
  const normalizedSections = [];
  if (Array.isArray(cs.sections)) {
    cs.sections.forEach(sec => {
      const entries = (sec.entries || []).map(ent => ({
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
  lesson.cheatsheet = {
    printNote: cs.printNote || 'Print this cheat sheet or use the search bar.',
    sections: normalizedSections
  };

  const pr = raw.project || {};
  lesson.project = {
    title: pr.title || 'Mini Project',
    tagline: pr.tagline || 'Module Practical Project',
    description: pr.description || '',
    learningGoals: pr.learningGoals || pr.objectives || [],
    requirements: pr.requirements || [],
    starterCode: pr.starterCode || '',
    solution: pr.solution || '',
    solutionExpl: pr.solutionExpl || '',
    expectedOutput: pr.expectedOutput || '',
    extensions: pr.extensions || []
  };

  const res = raw.resources || {};
  let links = [];
  if (Array.isArray(res)) {
    links = res;
  } else if (Array.isArray(res.links)) {
    links = res.links;
  } else {
    Object.keys(res).forEach(key => {
      if (typeof res[key] === 'string') {
        links.push({
          type: 'reference',
          title: key.replace(/_/g, ' '),
          url: res[key]
        });
      }
    });
  }
  lesson.resources = links;

  const vids = Array.isArray(raw.videos) ? raw.videos : [];
  const normalizedVideos = vids.map(v => {
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
  lesson.videos = normalizedVideos;

  const iv = raw.interview || {};
  const normalizedQuestions = (iv.questions || []).map(q => ({
    question: q.question || '',
    answer: q.fullAnswer || q.answer || q.shortAnswer || '',
    level: q.level || q.difficulty || 'beginner'
  }));
  lesson.interview = {
    questions: normalizedQuestions
  };

  const rv = raw.revision || {};
  lesson.revision = {
    summary: rv.summary || '',
    oneLineSummary: rv.oneLineSummary || rv.summary || '',
    keyTakeaways: rv.keyTakeaways || rv.key_takeaways || [],
    memoryTricks: rv.memoryTricks || [],
    preInterviewChecklist: rv.preInterviewChecklist || [],
    commonErrors: rv.commonErrors || [],
    nextTopics: rv.nextTopics || []
  };

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

  lesson.interview_questions = normalizedQuestions.map(q => ({
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
  generate
};
