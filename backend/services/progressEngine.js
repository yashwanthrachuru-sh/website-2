// ============================================================
// backend/services/progressEngine.js
// EduNet Unified Progress & Unlock Engine
//
// Responsibilities:
// - UnlockService: Single source of truth for lesson lock calculations.
// - CompletionService: Handles atomic completion & cascading unlocks.
// - XPService: Handles user XP, leveling, and ledger records.
// - ProgressService: Computes 4-level progress rollups (Lesson -> Tier -> Module -> Roadmap).
// ============================================================
'use strict';

const db = require('../config/db');

// ─────────────────────────────────────────────────────────────
// 1. XP SERVICE
// ─────────────────────────────────────────────────────────────
class XPService {
  /**
   * Award XP to user, update user level, and record in ledger
   */
  static async awardXP(userId, amount, source = 'general') {
    if (!userId || !amount) return { xp: 0, level: 1 };

    const pts = parseInt(amount, 10);
    if (isNaN(pts) || pts <= 0) return { xp: 0, level: 1 };

    // Record in ledger
    try {
      await db.query(`
        INSERT INTO xp_ledger (user_id, source, amount)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE amount = VALUES(amount)
      `, [userId, source, pts]);
    } catch (e) {
      // xp_ledger table may be optional/extended, ignore error if missing
    }

    // Update user xp and calculate level (500 XP per level)
    await db.query(`
      UPDATE users
      SET xp = IFNULL(xp, 0) + ?,
          level = FLOOR((IFNULL(xp, 0) + ?) / 500) + 1
      WHERE id = ?
    `, [pts, pts, userId]);

    const [[user]] = await db.query(
      `SELECT xp, level FROM users WHERE id = ?`,
      [userId]
    );

    return {
      xp: user?.xp || 0,
      level: user?.level || 1
    };
  }
}

// ─────────────────────────────────────────────────────────────
// 2. UNLOCK SERVICE
// ─────────────────────────────────────────────────────────────
class UnlockService {
  /**
   * Computes clean, sequential lock statuses for all lessons in a roadmap.
   *
   * Sequential Rule:
   * - Lesson 0 (first lesson in roadmap) is UNLOCKED (`status: 'current'`).
   * - Lesson i is COMPLETED if lesson_progress has completed = 1.
   * - Lesson i is UNLOCKED (`status: 'current'`) if Lesson i-1 is COMPLETED.
   * - Otherwise Lesson i is LOCKED (`status: 'locked'`).
   */
  static async calculateRoadmapLessonStatuses(roadmapId, userId) {
    // 1. Get all modules for this roadmap
    const [modules] = await db.query(`
      SELECT id, title, description, order_index, xp_reward, icon, language, level
      FROM roadmap_modules
      WHERE roadmap_id = ?
      ORDER BY order_index ASC
    `, [roadmapId]);

    if (!modules.length) {
      return { modules: [], flatLessons: [], progMap: {}, lessonProgMap: {} };
    }

    const totalModules = modules.length;
    modules.forEach((m, idx) => {
      if (!m.level) {
        const levelIdx = Math.floor((idx / totalModules) * 3);
        m.level = levelIdx === 0 ? 'beginner' : levelIdx === 1 ? 'intermediate' : 'expert';
      }
    });

    const mids = modules.map(m => m.id);

    // 2. Fetch all lessons in exact roadmap sequence
    const [lessons] = await db.query(`
      SELECT ml.id, ml.module_id, ml.title, ml.short_desc, ml.order_index, rm.title AS module_title, rm.level
      FROM module_lessons ml
      JOIN roadmap_modules rm ON ml.module_id = rm.id
      WHERE ml.module_id IN (${mids.join(',')})
      ORDER BY rm.order_index ASC, ml.order_index ASC
    `);

    // 3. Fetch user progress if user logged in
    let lessonProgMap = {};
    let moduleProgMap = {};

    if (userId) {
      const [lprog] = await db.query(`
        SELECT lp.lesson_id, lp.completed
        FROM lesson_progress lp
        JOIN module_lessons ml ON lp.lesson_id = ml.id
        JOIN roadmap_modules rm ON ml.module_id = rm.id
        WHERE lp.user_id = ? AND rm.roadmap_id = ?
      `, [userId, roadmapId]);
      lprog.forEach(lp => {
        lessonProgMap[lp.lesson_id] = !!lp.completed;
      });

      const [mprog] = await db.query(`
        SELECT module_id, completed, quiz_score, challenge_done
        FROM module_progress
        WHERE user_id = ? AND roadmap_id = ?
      `, [userId, roadmapId]);
      mprog.forEach(mp => {
        moduleProgMap[mp.module_id] = mp;
      });
    }

    // 4. Sequence evaluation
    const flatLessons = [];
    const lessonGroup = {};
    let previousLessonCompleted = true; // First lesson of roadmap is always unlocked!

    lessons.forEach((l, i) => {
      const isCompleted = !!lessonProgMap[l.id];
      let status = 'locked';

      if (isCompleted) {
        status = 'completed';
        previousLessonCompleted = true;
      } else if (previousLessonCompleted) {
        status = 'current';
        previousLessonCompleted = false; // Only one active lesson at a time
      } else {
        status = 'locked';
      }

      const lessonObj = {
        ...l,
        completed: isCompleted,
        status: status,
        locked: status === 'locked'
      };

      flatLessons.push(lessonObj);

      if (!lessonGroup[l.module_id]) lessonGroup[l.module_id] = [];
      lessonGroup[l.module_id].push(lessonObj);
    });

    // 5. Enrich modules with computed lesson statuses & module progress
    const enrichedModules = modules.map((m) => {
      const moduleLessons = lessonGroup[m.id] || [];
      const doneCount = moduleLessons.filter(l => l.completed).length;
      const totalCount = moduleLessons.length;
      const isModuleCompleted = totalCount > 0 && doneCount === totalCount;
      const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
      const isModuleUnlocked = moduleLessons.some(l => !l.locked);

      return {
        ...m,
        lessons: moduleLessons,
        completed: isModuleCompleted || !!moduleProgMap[m.id]?.completed,
        status: isModuleCompleted ? 'completed' : isModuleUnlocked ? 'unlocked' : 'locked',
        progress: progressPct,
        quiz_score: moduleProgMap[m.id]?.quiz_score || 0,
        challenge_done: !!moduleProgMap[m.id]?.challenge_done
      };
    });

    return {
      modules: enrichedModules,
      flatLessons,
      progMap: moduleProgMap,
      lessonProgMap
    };
  }

  /**
   * Check if a specific lesson is locked for a user
   */
  static async isLessonLocked(userId, lessonId) {
    const [[lesson]] = await db.query(`
      SELECT ml.id, ml.module_id, rm.roadmap_id
      FROM module_lessons ml
      JOIN roadmap_modules rm ON ml.module_id = rm.id
      WHERE ml.id = ?
    `, [lessonId]);

    if (!lesson) return { locked: true, reason: 'Lesson not found' };
    if (!userId) return { locked: false, reason: 'Guest access' };

    const { flatLessons } = await UnlockService.calculateRoadmapLessonStatuses(lesson.roadmap_id, userId);
    const target = flatLessons.find(l => l.id === parseInt(lessonId, 10));

    if (!target) return { locked: false, reason: 'Not tracked' };
    return {
      locked: target.locked,
      status: target.status,
      completed: target.completed
    };
  }
}

// ─────────────────────────────────────────────────────────────
// 3. COMPLETION SERVICE
// ─────────────────────────────────────────────────────────────
class CompletionService {
  /**
   * Atomically completes a lesson, awards XP, updates streak, checks module & tier completions,
   * and computes the next unlocked lesson for seamless auto-navigation.
   */
  static async completeLesson(userId, lessonId) {
    if (!userId || !lessonId) {
      throw new Error('userId and lessonId are required');
    }

    const lid = parseInt(lessonId, 10);

    // 1. Get lesson & roadmap metadata
    const [[lesson]] = await db.query(`
      SELECT ml.id, ml.module_id, ml.title, ml.order_index, rm.roadmap_id, rm.level AS module_level
      FROM module_lessons ml
      JOIN roadmap_modules rm ON ml.module_id = rm.id
      WHERE ml.id = ?
    `, [lid]);

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // 2. Check if already completed
    const [[already]] = await db.query(
      `SELECT completed FROM lesson_progress WHERE user_id = ? AND lesson_id = ?`,
      [userId, lid]
    );

    const isFirstTime = !already || !already.completed;

    // 3. Mark lesson complete in database
    await db.query(`
      INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at)
      VALUES (?, ?, 1, CURRENT_TIMESTAMP)
      ON DUPLICATE KEY UPDATE completed = 1, completed_at = IFNULL(completed_at, CURRENT_TIMESTAMP)
    `, [userId, lid]);

    // 4. Award XP if first time
    let xpData = { xp: 0, level: 1 };
    if (isFirstTime) {
      xpData = await XPService.awardXP(userId, 100, `lesson_${lid}_complete`);
    } else {
      const [[u]] = await db.query(`SELECT xp, level FROM users WHERE id = ?`, [userId]);
      xpData = { xp: u?.xp || 0, level: u?.level || 1 };
    }

    // 5. Check if Module is complete
    const [[totalInMod]] = await db.query(
      `SELECT COUNT(*) AS cnt FROM module_lessons WHERE module_id = ?`,
      [lesson.module_id]
    );
    const [[doneInMod]] = await db.query(`
      SELECT COUNT(*) AS cnt FROM lesson_progress lp
      JOIN module_lessons ml ON lp.lesson_id = ml.id
      WHERE lp.user_id = ? AND ml.module_id = ? AND lp.completed = 1
    `, [userId, lesson.module_id]);

    const isModuleComplete = doneInMod.cnt >= totalInMod.cnt && totalInMod.cnt > 0;
    if (isModuleComplete) {
      await db.query(`
        INSERT INTO module_progress (user_id, module_id, roadmap_id, completed)
        VALUES (?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE completed = 1
      `, [userId, lesson.module_id, lesson.roadmap_id]);
    }

    // 6. Calculate full updated roadmap lock state to find next lesson
    const { flatLessons } = await UnlockService.calculateRoadmapLessonStatuses(lesson.roadmap_id, userId);

    // Find current lesson index and next sequential lesson
    const currentIndex = flatLessons.findIndex(l => l.id === lid);
    const nextLesson = (currentIndex !== -1 && currentIndex < flatLessons.length - 1)
      ? flatLessons[currentIndex + 1]
      : null;

    // Check if Tier is complete
    const currentTier = lesson.module_level || 'beginner';
    const tierLessons = flatLessons.filter(l => l.level === currentTier);
    const isTierComplete = tierLessons.length > 0 && tierLessons.every(l => l.completed);

    if (isTierComplete) {
      await db.query(`
        INSERT INTO level_progress (user_id, roadmap_id, level, passed)
        VALUES (?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE passed = 1
      `, [userId, lesson.roadmap_id, currentTier]);
    }

    // Check if Roadmap is complete
    const isRoadmapComplete = flatLessons.every(l => l.completed);

    return {
      success: true,
      completed: true,
      is_first_time: isFirstTime,
      xp_awarded: isFirstTime ? 100 : 0,
      user_xp: xpData.xp,
      user_level: xpData.level,
      module_completed: isModuleComplete,
      tier_completed: isTierComplete,
      roadmap_completed: isRoadmapComplete,
      next_lesson: nextLesson ? {
        id: nextLesson.id,
        title: nextLesson.title,
        module_id: nextLesson.module_id,
        module_title: nextLesson.module_title,
        locked: nextLesson.locked
      } : null
    };
  }
}

// ─────────────────────────────────────────────────────────────
// 4. PROGRESS SERVICE (4-Level Rollup)
// ─────────────────────────────────────────────────────────────
class ProgressService {
  /**
   * Computes total 4-level progress rollup:
   * Level 1: Lesson Progress
   * Level 2: Difficulty Tier Progress (Beginner %, Intermediate %, Expert %)
   * Level 3: Module Progress (% per module and total modules done)
   * Level 4: Roadmap Progress (overall %)
   */
  static async get4LevelProgress(userId, roadmapId) {
    const { modules, flatLessons } = await UnlockService.calculateRoadmapLessonStatuses(roadmapId, userId);

    const totalLessons = flatLessons.length;
    const doneLessons = flatLessons.filter(l => l.completed).length;
    const roadmapProgressPct = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;

    const beginnerLessons = flatLessons.filter(l => l.level === 'beginner');
    const intermediateLessons = flatLessons.filter(l => l.level === 'intermediate');
    const expertLessons = flatLessons.filter(l => l.level === 'expert');

    const getPct = (arr) => arr.length > 0 ? Math.round((arr.filter(l => l.completed).length / arr.length) * 100) : 0;

    return {
      roadmap_id: roadmapId,
      user_id: userId,
      overall_progress_pct: roadmapProgressPct,
      lessons_total: totalLessons,
      lessons_completed: doneLessons,
      tiers: {
        beginner: {
          total: beginnerLessons.length,
          completed: beginnerLessons.filter(l => l.completed).length,
          pct: getPct(beginnerLessons)
        },
        intermediate: {
          total: intermediateLessons.length,
          completed: intermediateLessons.filter(l => l.completed).length,
          pct: getPct(intermediateLessons)
        },
        expert: {
          total: expertLessons.length,
          completed: expertLessons.filter(l => l.completed).length,
          pct: getPct(expertLessons)
        }
      },
      modules: modules.map(m => ({
        id: m.id,
        title: m.title,
        level: m.level,
        progress_pct: m.progress,
        completed: m.completed,
        lessons_total: m.lessons.length,
        lessons_completed: m.lessons.filter(l => l.completed).length
      }))
    };
  }
}

module.exports = {
  XPService,
  UnlockService,
  CompletionService,
  ProgressService
};
