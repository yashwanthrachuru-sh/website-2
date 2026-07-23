// ============================================================
// js/stage-engine.js — EduNet Stage Engine
//
// Single source of truth for all lesson stage logic.
//
// ALL navigation, stepper rendering, XP calculation, sidebar
// states, and completion logic must derive from this module.
//
// Never hardcode stage IDs or counts elsewhere.
// ============================================================
'use strict';

window.StageEngine = (function () {

  // ── 1. Stage Definition ─────────────────────────────────────
  //
  // id          : unique identifier used throughout the app
  // label       : human-readable name shown in stepper
  // icon        : emoji for stepper and sidebar
  // required    : false = auto-skipped when content is absent
  // ctaVerb     : override for the "Continue" button; null = auto-label
  //
  const LESSON_STAGES = [
    { id: 'learn',     label: 'Learn',             icon: '🧠', required: true,  ctaVerb: 'Start Examples' },
    { id: 'example',   label: 'Interactive Example',icon: '⚡', required: true,  ctaVerb: 'Start Practice' },
    { id: 'practice',  label: 'Practice & Code',   icon: '💻', required: true,  ctaVerb: 'Take Checkpoint Quiz' },
    { id: 'quiz',      label: 'Checkpoint Quiz',   icon: '📝', required: true,  ctaVerb: 'Review Summary' },
    { id: 'project',   label: 'Mini Project',      icon: '🚀', required: false, ctaVerb: 'Go to Revision' },
    { id: 'revision',  label: 'Revision & Notes',  icon: '📒', required: true,  ctaVerb: 'Complete Lesson' },
    { id: 'complete',  label: 'Lesson Complete',   icon: '🎉', required: true,  ctaVerb: 'Next Lesson' },
  ];

  // ── 2. Stage Skip Rules ─────────────────────────────────────
  const PRESENCE_RULES = {
    project: (ui) => !!(ui.hasProject || ui.project?.title),
  };

  // ── 3. getEffectiveStages(lessonUI) ────────────────────────
  //
  // Returns the filtered, ordered stage array for a specific lesson.
  // Optional stages absent from the lesson are excluded entirely.
  //
  // Cache key: lessonUI.id — invalidated on lesson change.
  //
  let _effectiveStagesCache = null;
  let _effectiveStageCacheId = null;

  function getEffectiveStages(lessonUI) {
    if (!lessonUI) return LESSON_STAGES.filter(s => s.required);

    // Return cached result if same lesson
    if (_effectiveStageCacheId === lessonUI.id && _effectiveStagesCache) {
      return _effectiveStagesCache;
    }

    const result = LESSON_STAGES.filter(stage => {
      if (stage.required) return true;           // always include required stages
      const rule = PRESENCE_RULES[stage.id];
      if (!rule) return true;                    // no rule = include by default
      return rule(lessonUI);                     // include only if content present
    });

    _effectiveStagesCache  = result;
    _effectiveStageCacheId = lessonUI.id;
    return result;
  }

  // ── 4. Stage Status ─────────────────────────────────────────
  //
  // Given a progress object and effective stages list, return
  // the status of every stage for rendering.
  //
  // Returns: Array of { ...stage, status, positionInJourney }
  //
  function getStagesWithStatus(effectiveStages, progress) {
    const completed = new Set(progress.completedSet || []);
    const skipped   = new Set(progress.skippedSet   || []);
    const furthest  = progress.furthestIndex         || 0;

    return effectiveStages.map((stage, idx) => {
      let status;

      if (skipped.has(stage.id)) {
        status = 'skipped';
      } else if (completed.has(stage.id)) {
        status = 'completed';
      } else if (idx === furthest) {
        status = 'current';
      } else if (idx < furthest) {
        // All stages before furthest that aren't completed are available (review mode)
        status = 'available';
      } else {
        status = 'locked';
      }

      return { ...stage, status, positionInJourney: idx };
    });
  }

  // ── 5. Navigation helpers ───────────────────────────────────

  function getPrevStage(effectiveStages, currentIndex) {
    if (currentIndex <= 0) return null;
    return effectiveStages[currentIndex - 1];
  }

  function getNextStage(effectiveStages, currentIndex) {
    if (currentIndex >= effectiveStages.length - 1) return null;
    return effectiveStages[currentIndex + 1];
  }

  function getStageNavLabel(stage, direction) {
    if (!stage) return direction === 'next' ? 'Finish' : 'Back to Lessons';
    if (direction === 'next') {
      return stage.ctaVerb ? `${stage.ctaVerb} →` : `Continue to ${stage.label} →`;
    }
    return `← ${stage.label}`;
  }

  // ── 6. Initial Progress Factory ────────────────────────────────
  function createInitialProgress(lessonId = null) {
    return {
      lessonId: lessonId,
      currentStage: 'overview',
      furthestIndex: 0,
      completedStages: [],
      completedSet: [],
      skippedSet: [],
      unlockedStages: ['overview'],
      progress: 0,
      xp: 0,
      quizScore: null,
      quizPassed: false,
      projectDone: false,
      assignmentDone: false,
      startedAt: Date.now(),
      actualStartTime: Date.now(),
      actualEndTime: null,
      actualTimeMinutes: 0,
      completed: false,
      isLessonCompleted: false
    };
  }

  // ── 7. LessonStageProgress ──────────────────────────────────
  //
  // Manages per-lesson progress state.
  // Storage: localStorage (backend sync added in Phase 8).
  //
  const STORAGE_PREFIX = 'edunet_stage_v1_';

  class LessonStageProgress {
    constructor(lessonId) {
      this.lessonId       = lessonId || null;
      this.furthestIndex  = 0;
      this.completedSet   = [];
      this.skippedSet     = [];
      this.quizScore      = null;
      this.quizPassed     = false;
      this.projectDone    = false;
      this.assignmentDone = false;
      this.actualStartTime = Date.now();
      this.actualEndTime   = null;
    }

    // ── Load from localStorage ─────────────────────────────
    static load(lessonId) {
      if (!lessonId) return createInitialProgress();
      const instance = new LessonStageProgress(lessonId);
      try {
        const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_PREFIX + lessonId) : null;
        if (raw) {
          const saved = JSON.parse(raw);
          Object.assign(instance, saved);
          // Ensure arrays are non-null
          instance.completedSet = Array.isArray(instance.completedSet) ? instance.completedSet : [];
          instance.skippedSet   = Array.isArray(instance.skippedSet) ? instance.skippedSet : [];
          instance.actualStartTime = Date.now();
          instance.lessonId = lessonId;
        }
      } catch (e) {
        console.warn('[StageEngine] Failed to load progress for lesson', lessonId, e);
      }
      return instance;
    }

    // ── Persist to localStorage ────────────────────────────
    save() {
      if (!this.lessonId || typeof localStorage === 'undefined') return;
      try {
        localStorage.setItem(STORAGE_PREFIX + this.lessonId, JSON.stringify({
          lessonId:       this.lessonId,
          furthestIndex:  this.furthestIndex || 0,
          completedSet:   this.completedSet || [],
          skippedSet:     this.skippedSet || [],
          quizScore:      this.quizScore ?? null,
          quizPassed:     !!this.quizPassed,
          projectDone:    !!this.projectDone,
          assignmentDone: !!this.assignmentDone,
          actualStartTime: this.actualStartTime || Date.now(),
          actualEndTime:  this.actualEndTime || null,
        }));
      } catch (e) {
        console.warn('[StageEngine] Failed to save progress for lesson', this.lessonId, e);
      }
    }

    // ── Mark a stage as completed and advance furthest ─────
    markCompleted(stageId, stageIndex) {
      this.completedSet = this.completedSet || [];
      if (stageId && !this.completedSet.includes(stageId)) {
        this.completedSet.push(stageId);
      }
      if (typeof stageIndex === 'number' && stageIndex >= (this.furthestIndex || 0)) {
        this.furthestIndex = stageIndex + 1;
      }
      this.save();
    }

    // ── Mark optional stages as skipped ───────────────────
    markSkipped(stageIds) {
      this.skippedSet = this.skippedSet || [];
      (stageIds || []).forEach(id => {
        if (id && !this.skippedSet.includes(id)) this.skippedSet.push(id);
      });
      this.save();
    }

    // ── Set quiz result ────────────────────────────────────
    setQuizScore(score) {
      this.quizScore  = score;
      this.quizPassed = typeof score === 'number' && score >= 80;
      this.save();
    }

    // ── Set project/assignment completion ──────────────────
    setProjectDone(done) {
      this.projectDone = !!done;
      this.save();
    }

    setAssignmentDone(done) {
      this.assignmentDone = !!done;
      this.save();
    }

    // ── Mark lesson end time ───────────────────────────────
    complete() {
      this.actualEndTime = Date.now();
      this.save();
    }

    // ── Computed getters ───────────────────────────────────

    get actualTimeMinutes() {
      if (!this.actualEndTime) return Math.round((Date.now() - (this.actualStartTime || Date.now())) / 60000);
      return Math.round((this.actualEndTime - this.actualStartTime) / 60000);
    }

    get isLessonCompleted() {
      return Array.isArray(this.completedSet) && this.completedSet.includes('complete');
    }

    // ── Reset progress (for retry) ─────────────────────────
    reset() {
      this.furthestIndex  = 0;
      this.completedSet   = [];
      this.quizScore      = null;
      this.quizPassed     = false;
      this.projectDone    = false;
      this.assignmentDone = false;
      this.actualStartTime = Date.now();
      this.actualEndTime   = null;
      this.save();
    }

    // ── Build payload for backend sync (Phase 8) ───────────
    toBackendPayload() {
      return {
        furthestIndex:    this.furthestIndex || 0,
        completedSet:     this.completedSet || [],
        skippedSet:       this.skippedSet || [],
        quizScore:        this.quizScore ?? null,
        quizPassed:       !!this.quizPassed,
        projectDone:      !!this.projectDone,
        assignmentDone:   !!this.assignmentDone,
        actualTimeMinutes: this.actualTimeMinutes || 0,
      };
    }
  }

  // ── 8. XP Computation ───────────────────────────────────────
  function computeXP(progress, lessonUI) {
    const breakdown = [];
    let total = 0;

    const base = 50;
    breakdown.push({ label: 'Lesson Completed', xp: base });
    total += base;

    if (progress?.quizPassed) {
      breakdown.push({ label: 'Quiz Passed (≥80%)', xp: 50 });
      total += 50;

      if ((progress.quizScore ?? 0) >= 80) {
        breakdown.push({ label: 'Score 80%+', xp: 25 });
        total += 25;
      }

      if (progress.quizScore === 100) {
        breakdown.push({ label: 'Perfect Score 🏆', xp: 25 });
        total += 25;
      }
    }

    if (progress?.projectDone && lessonUI?.hasProject) {
      breakdown.push({ label: 'Mini Project Submitted', xp: 50 });
      total += 50;
    }

    if (progress?.assignmentDone && lessonUI?.hasAssignment) {
      breakdown.push({ label: 'Assignment Submitted', xp: 25 });
      total += 25;
    }

    return { breakdown, total };
  }

  // ── 9. Cache Control ─────────────────────────────────────────

  function invalidateCache() {
    _effectiveStagesCache  = null;
    _effectiveStageCacheId = null;
  }

  // ── Public API ───────────────────────────────────────────────

  return {
    // Constants
    LESSON_STAGES,

    // Core stage logic
    getEffectiveStages,
    getStagesWithStatus,
    createInitialProgress,

    // Navigation helpers
    getPrevStage,
    getNextStage,
    getStageNavLabel,

    // Progress state
    LessonStageProgress,

    // XP
    computeXP,

    // Cache control
    invalidateCache,
  };

})();
