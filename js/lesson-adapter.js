// ============================================================
// js/lesson-adapter.js — EduNet LessonAdapter
//
// Single source of truth for schema normalization.
// ALL lesson rendering must go through LessonAdapter.normalize().
//
// Architecture:
//   API Response  →  LessonAdapter.normalize()  →  lessonUI  →  Renderers
//
// Schema versions:
//   legacy  : lesson.structured_content holds flat sc.* fields
//   v2.0    : lesson.beginner / .intermediate / .expert / .quiz / etc.
// ============================================================
'use strict';

window.LessonAdapter = (function () {

  // ── Safe array / object accessors ───────────────────────────

  function arr(v) {
    return Array.isArray(v) ? v : [];
  }

  function obj(v) {
    return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
  }

  function str(v, fallback = '') {
    if (v == null) return fallback;
    if (typeof v === 'string') return v;
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    return fallback;
  }

  // ── Schema detection ─────────────────────────────────────────

  function detectVersion(lesson) {
    if (!lesson) return 'legacy';
    const sv = lesson.schemaVersion || lesson.schema_version;
    if (sv && parseFloat(sv) >= 2.0) return 'v2';
    // Heuristic: if beginner is a rich object (not empty), treat as v2
    if (lesson.beginner && typeof lesson.beginner === 'object' &&
        Object.keys(lesson.beginner).length > 2) return 'v2';
    return 'legacy';
  }

  // ── Normalize v2.0 lesson ────────────────────────────────────

  function normalizeV2(lesson) {
    const b  = obj(lesson.beginner);
    const im = obj(lesson.intermediate);
    const ex = obj(lesson.expert);
    const p  = obj(lesson.practice);
    const q  = obj(lesson.quiz);
    const cs = obj(lesson.cheatsheet);
    const pr = obj(lesson.project);
    const iv = obj(lesson.interview);
    const rv = obj(lesson.revision);
    const meta = obj(lesson.lessonMeta);

    return {
      // ── Identity ─────────────────────────────────────────────
      id            : lesson.id,
      title         : str(meta.title || lesson.title, 'Untitled Lesson'),
      schemaVersion : '2.0',
      language      : str(lesson.language, 'python'),
      estimatedTime : meta.estimatedTime || lesson.estimated_hours || 30,
      difficulty    : str(lesson.difficulty || lesson.level || meta.level, 'beginner'),
      level         : str(lesson.level || meta.level, 'beginner'),
      order         : lesson.order || meta.order || lesson.order_index || 1,
      module        : str(lesson.module || meta.module || lesson.module_title || ''),
      roadmap       : str(lesson.roadmap || meta.roadmap || ''),
      xpReward      : lesson.xp_reward || 100,
      moduleTitle   : str(lesson.module_title, ''),
      orderIndex    : lesson.order_index || 1,
      shortDesc     : str(lesson.short_desc || meta.description, ''),
      prerequisites : arr(meta.prerequisites),
      keywords      : arr(meta.keywords || lesson.keywords),
      learningObjectives: arr(meta.learningObjectives || meta.learning_objectives),

      // ── Beginner section ─────────────────────────────────────
      beginner: {
        curiosityQuestion    : str(b.curiosityQuestion),
        whyExists            : str(b.whyExists),
        problemItSolves      : str(b.problemItSolves),
        withoutVariables     : str(b.programmingWithoutVariables),
        whereUsed            : str(b.whereVariablesAreUsed),
        realWorldAnalogy     : str(b.realWorldAnalogy),
        simpleExplanation    : str(b.simpleExplanation),
        syntaxExplanation    : str(b.syntaxExplanation),
        examples             : arr(b.examples),
        visualDiagram        : str(b.visualDiagram),
        memoryDiagram        : obj(b.memoryDiagram),
        stepByStep           : arr(b.stepByStepExecution),
        namingRules          : arr(b.namingRules),
        commonMistakes       : arr(b.commonMistakes),
      },

      // ── Intermediate section ──────────────────────────────────
      intermediate: {
        deeperExplanation    : str(im.deeperExplanation),
        mutability           : str(im.mutabilityExplained),
        noneValue            : str(im.noneValue),
        internalImplementation: str(im.internalImplementation),
        examples             : arr(im.examples),
        bestPractices        : arr(im.bestPractices),
        debuggingWalkthrough : obj(im.debuggingWalkthrough),
        edgeCases            : arr(im.edgeCases),
        performanceNotes     : obj(im.performanceConsiderations),
      },

      // ── Expert section ────────────────────────────────────────
      expert: {
        overview             : str(ex.overview),
        industryContext      : str(ex.industryContext),
        examples             : arr(ex.examples),
        codeReviewChecklist  : arr(ex.codeReviewChecklist),
        testingPatterns      : obj(ex.testingVariables),
        refactoringGuide     : obj(ex.refactoringGuide),
        securityConsiderations: arr(ex.securityConsiderations),
        designPatterns       : arr(ex.designPatterns),
        scalability          : obj(ex.scalabilityConsiderations),
        complexityAnalysis   : obj(ex.complexityAnalysis),
      },

      // ── Practice exercises ────────────────────────────────────
      practice: {
        easy      : obj(p.easy),
        medium    : obj(p.medium),
        hard      : obj(p.hard),
        debugging : obj(p.debugging),
      },

      // ── Quiz ─────────────────────────────────────────────────
      quiz: {
        mcqs        : arr(q.mcqs),
        checkpoints : arr(q.checkpoints),
      },

      // ── Cheatsheet ────────────────────────────────────────────
      cheatsheet: {
        title       : str(cs.title),
        sections    : arr(cs.sections),
      },

      // ── Mini project ──────────────────────────────────────────
      project: {
        title          : str(pr.title),
        tagline        : str(pr.tagline),
        description    : str(pr.description),
        requirements   : arr(pr.requirements),
        learningGoals  : arr(pr.learningGoals),
        starterCode    : str(pr.starterCode),
        solution       : str(pr.solution),
        expectedOutput : str(pr.expectedOutput),
        solutionExpl   : str(pr.solutionExplanation),
        extensions     : arr(pr.extensions),
      },

      // ── Interview questions ────────────────────────────────────
      interview: {
        questions : arr(iv.questions),
      },

      // ── Revision notes ─────────────────────────────────────────
      revision: {
        oneLineSummary       : str(rv.oneLineSummary),
        summary              : str(rv.summary),
        keyTakeaways         : arr(rv.keyTakeaways),
        memoryTricks         : arr(rv.memoryTricks),
        preInterviewChecklist: arr(rv.preInterviewChecklist),
        commonErrors         : arr(rv.commonErrors),
        mindMap              : obj(rv.mindMap),
        nextTopics           : arr(rv.nextTopics),
        estimatedTime        : obj(rv.estimatedLearningTime),
      },

      // ── Related content (from DB, may be empty for new lessons) ─
      videos    : arr(lesson._videos),
      resources : arr(lesson._resources),

      // ── Navigation ─────────────────────────────────────────────
      prevLesson : lesson._prevLesson || null,
      nextLesson : lesson._nextLesson || null,
      completed  : !!lesson._completed,
      locked     : !!lesson._locked,
    };
  }

  // ── Normalize legacy lesson ──────────────────────────────────

  function normalizeLegacy(lesson) {
    const sc = obj(lesson.structured_content);

    // Build examples from whatever fields exist
    const legacyExamples = [];
    if (sc.beginner_example) legacyExamples.push({
      title: 'Basic Example', code: sc.beginner_example, explanation: sc.line_by_line || ''
    });
    if (sc.intermediate_example) legacyExamples.push({
      title: 'Intermediate Example', code: sc.intermediate_example, explanation: ''
    });

    // Flatten legacy quiz rows (from DB) into our mcqs shape
    const dbQuizRows = arr(lesson._quizzes);
    const legacyMCQs = dbQuizRows.map(q => ({
      id          : String(q.id),
      question    : str(q.question),
      options     : [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean),
      answer      : str(q.correct_option, 'A'),
      explanation : str(q.explanation),
    }));

    // Flatten legacy exercises
    const dbExercises = arr(lesson._exercises);
    const legacyPractice = {
      easy: dbExercises.find(e => (e.difficulty || '').toLowerCase() === 'easy') || null,
      medium: dbExercises.find(e => (e.difficulty || '').toLowerCase() === 'medium') || null,
      hard: dbExercises.find(e => (e.difficulty || '').toLowerCase() === 'hard') || null,
      debugging: null,
    };

    return {
      id            : lesson.id,
      title         : str(lesson.title, 'Untitled Lesson'),
      schemaVersion : 'legacy',
      language      : str(lesson.language, 'javascript'),
      estimatedTime : lesson.estimated_hours || 30,
      difficulty    : str(lesson.difficulty || lesson.level, 'beginner'),
      level         : str(lesson.level || 'beginner'),
      order         : lesson.order || lesson.order_index || 1,
      module        : str(lesson.module || lesson.module_title || ''),
      roadmap       : str(lesson.roadmap || ''),
      xpReward      : lesson.xp_reward || 100,
      moduleTitle   : str(lesson.module_title, ''),
      orderIndex    : lesson.order_index || 1,
      shortDesc     : str(lesson.short_desc, ''),
      prerequisites : [],
      keywords      : [],
      learningObjectives: [],

      beginner: {
        curiosityQuestion    : str(sc.definition),
        whyExists            : str(sc.why_exists),
        problemItSolves      : '',
        withoutVariables     : '',
        whereUsed            : '',
        realWorldAnalogy     : str(sc.real_world_analogies),
        simpleExplanation    : str(sc.beginner_explanation),
        syntaxExplanation    : str(sc.syntax_breakdown),
        examples             : legacyExamples,
        visualDiagram        : str(sc.visual_flow),
        memoryDiagram        : safeParseJSON(sc.memoryDiagram),
        stepByStep           : safeParseJSON(sc.executionStepper),
        namingRules          : [],
        commonMistakes       : [str(sc.common_mistakes)].filter(Boolean),
      },

      intermediate: {
        deeperExplanation    : str(sc.detailed_concept),
        mutability           : '',
        noneValue            : '',
        internalImplementation: str(sc.internal_working),
        examples             : [{ title: 'Real-world Example', code: str(sc.intermediate_example) }].filter(e => e.code),
        bestPractices        : str(sc.best_practices) ? [str(sc.best_practices)] : [],
        debuggingWalkthrough : {},
        edgeCases            : [],
        performanceNotes     : { notes: str(sc.performance) },
      },

      expert: {
        overview             : str(sc.advanced_example),
        industryContext      : str(sc.production_example),
        examples             : [],
        codeReviewChecklist  : [],
        testingPatterns      : {},
        refactoringGuide     : {},
        securityConsiderations: [],
        designPatterns       : [],
        scalability          : {},
        complexityAnalysis   : {},
      },

      practice    : legacyPractice,
      quiz        : { mcqs: legacyMCQs, checkpoints: [] },
      cheatsheet  : { title: '', sections: [] },
      project     : { title: '', description: str(lesson.project_description), requirements: [], starterCode: str(lesson.starter_code) },
      interview   : { questions: arr(lesson.interview_questions).map(q => ({ question: q.title, fullAnswer: q.content })) },
      revision    : { summary: str(sc.summary), keyTakeaways: [], memoryTricks: [], preInterviewChecklist: [], commonErrors: [] },
      videos      : arr(lesson._videos),
      resources   : arr(lesson._resources),
      prevLesson  : lesson._prevLesson || null,
      nextLesson  : lesson._nextLesson || null,
      completed   : !!lesson._completed,
      locked      : !!lesson._locked,
    };
  }

  function safeParseJSON(str) {
    try { return str ? JSON.parse(str) : null; } catch { return null; }
  }

  // ── Public API ───────────────────────────────────────────────

  /**
   * Normalize an API response into a consistent lessonUI object.
   *
   * @param {Object} apiResponse  - the full { lesson, videos, resources, ... } response
   * @returns {Object}            - normalized lessonUI ready for renderers
   */
  function normalize(apiResponse) {
    if (!apiResponse || !apiResponse.lesson) {
      return _emptyLesson();
    }

    // Attach side-channel data so normalizers can access it
    const lesson = { ...apiResponse.lesson };
    lesson._videos    = arr(apiResponse.videos);
    lesson._resources = arr(apiResponse.resources);
    lesson._quizzes   = arr(apiResponse.quizzes);
    lesson._exercises = arr(apiResponse.exercises);
    lesson._prevLesson = apiResponse.prev_lesson || null;
    lesson._nextLesson = apiResponse.next_lesson || null;
    lesson._completed  = !!apiResponse.completed;
    lesson._locked     = !!apiResponse.locked;

    const version = detectVersion(lesson);
    return version === 'v2' ? normalizeV2(lesson) : normalizeLegacy(lesson);
  }

  function _emptyLesson() {
    return {
      id: null, title: 'Lesson', schemaVersion: 'legacy', language: 'python',
      beginner: { curiosityQuestion: '', examples: [], namingRules: [], commonMistakes: [], stepByStep: [], memoryDiagram: null },
      intermediate: { examples: [], bestPractices: [], edgeCases: [] },
      expert: { examples: [], codeReviewChecklist: [], securityConsiderations: [], designPatterns: [] },
      practice: { easy: null, medium: null, hard: null, debugging: null },
      quiz: { mcqs: [], checkpoints: [] },
      cheatsheet: { title: '', sections: [] },
      project: { title: '', requirements: [], starterCode: '' },
      interview: { questions: [] },
      revision: { summary: '', keyTakeaways: [], memoryTricks: [], preInterviewChecklist: [], commonErrors: [] },
      videos: [], resources: [], prevLesson: null, nextLesson: null, completed: false, locked: false,
    };
  }

  return { normalize, detectVersion };

})();
