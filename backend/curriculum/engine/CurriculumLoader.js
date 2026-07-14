// ============================================================
// backend/curriculum/engine/CurriculumLoader.js
// EduNet Curriculum-Driven Educational Engine — Decentralized Loader
// ============================================================
'use strict';

const fs   = require('fs');
const path = require('path');

const CURRICULUM_DIR = path.resolve(__dirname, '..', '..', '..', 'curriculum');

let _cache = null;
let _cacheBySlug = null;

// Standard slug generator
function getSlug(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Load all roadmap JSON structures from the curriculum root directory.
 * Results are compiled from roadmap.json, modules, and concept JSONs.
 */
function loadAllRoadmaps() {
  if (_cache) return _cache;

  if (!fs.existsSync(CURRICULUM_DIR)) {
    console.warn('[CurriculumLoader] root curriculum/ directory not found. Returning empty.');
    return [];
  }

  const roadmapDirs = fs.readdirSync(CURRICULUM_DIR).filter(f => {
    return fs.statSync(path.join(CURRICULUM_DIR, f)).isDirectory();
  });

  _cache = roadmapDirs.map(rmDir => {
    const rmPath = path.join(CURRICULUM_DIR, rmDir);
    const rmJsonPath = path.join(rmPath, 'roadmap.json');
    if (!fs.existsSync(rmJsonPath)) return null;

    try {
      const roadmapMeta = JSON.parse(fs.readFileSync(rmJsonPath, 'utf8'));
      const modulesDir = path.join(rmPath, 'modules');
      let modules = [];

      if (fs.existsSync(modulesDir)) {
        const modDirs = fs.readdirSync(modulesDir).filter(f => {
          return fs.statSync(path.join(modulesDir, f)).isDirectory();
        });

        const tempModules = modDirs.map(modDir => {
          const modPath = path.join(modulesDir, modDir);
          const modJsonPath = path.join(modPath, 'module.json');
          if (!fs.existsSync(modJsonPath)) return null;

          const modMeta = JSON.parse(fs.readFileSync(modJsonPath, 'utf8'));
          
          // Discover lessons inside the module directory
          const lessonDirs = fs.readdirSync(modPath).filter(f => {
            return fs.statSync(path.join(modPath, f)).isDirectory();
          });

          const lessons = lessonDirs.map(lesDir => {
            const lesPath = path.join(modPath, lesDir);
            const lesJsonPath = path.join(lesPath, 'lesson.json');
            if (!fs.existsSync(lesJsonPath)) return null;

            let lesMeta;
            try {
              lesMeta = JSON.parse(fs.readFileSync(lesJsonPath, 'utf8'));
            } catch (err) {
              throw new Error(`[CurriculumLoader] Failed to parse JSON: ${lesJsonPath} - ${err.message}`);
            }

            // --- 1. Schema Validation (Strict for Version 2.0 or higher) ---
            const isV2 = lesMeta.schemaVersion && parseFloat(lesMeta.schemaVersion) >= 2.0;
            if (isV2) {
              const requiredFiles = [
                'beginner.json',
                'intermediate.json',
                'expert.json',
                'practice.json',
                'quiz.json',
                'cheatsheet.json',
                'project.json',
                'resources.json',
                'videos.json',
                'interview.json',
                'revision.json'
              ];

              const missingFiles = [];
              const defaultLocale = 'en';

              for (const file of requiredFiles) {
                // Design localization-ready paths: look in locales/en/ first, then fall back to root of the lesson directory
                const localePath = path.join(lesPath, 'locales', defaultLocale, file);
                const rootPath = path.join(lesPath, file);
                if (!fs.existsSync(localePath) && !fs.existsSync(rootPath)) {
                  missingFiles.push(`locales/${defaultLocale}/${file} (or root ${file})`);
                }
              }

              if (missingFiles.length > 0) {
                throw new Error(
                  `[CurriculumLoader] Strict validation failed for concept directory: "${lesDir}"\n` +
                  `  Expected schema version: ${lesMeta.schemaVersion}\n` +
                  `  Missing required files:\n  - ` + missingFiles.join('\n  - ')
                );
              }
            }

            return {
              title: lesMeta.title,
              desc: lesMeta.description || lesMeta.learningObjectives[0] || '',
              difficulty: lesMeta.difficultyLevels ? lesMeta.difficultyLevels[0] : 'Beginner',
              estimated_hours: lesMeta.estimatedTime ? lesMeta.estimatedTime / 60 : 0.5,
              prerequisites: lesMeta.prerequisites || [],
              keywords: lesMeta.tags || [],
              learning_objectives: lesMeta.learningObjectives || [],
              conceptSlug: lesDir // store slug to read lesson components later
            };
          }).filter(Boolean);

          return {
            name: modMeta.name,
            desc: modMeta.description || '',
            order_index: modMeta.orderIndex,
            lessons: lessons,
            moduleSlug: modDir // store slug
          };
        }).filter(Boolean);

        // Sort modules by order_index
        modules = tempModules.sort((a, b) => a.order_index - b.order_index);
      }

      return {
        roadmap: {
          id: roadmapMeta.id,
          title: roadmapMeta.title,
          category: roadmapMeta.category,
          difficulty: roadmapMeta.difficulty,
          icon: roadmapMeta.icon,
          tags: roadmapMeta.tags ? roadmapMeta.tags.join(',') : '',
          description: roadmapMeta.description,
          language: roadmapMeta.language
        },
        prerequisites: roadmapMeta.prerequisites || [],
        estimated_hours: roadmapMeta.estimatedHours || 60,
        projects: roadmapMeta.projects || [],
        interview_topics: roadmapMeta.interviewTopics || [],
        modules: modules,
        roadmap_slug: roadmapMeta.id
      };
    } catch (e) {
      console.error(`[CurriculumLoader] Failed to compile roadmap in ${rmDir}:`, e.message);
      return null;
    }
  }).filter(Boolean);

  // Build slug index
  _cacheBySlug = {};
  for (const rm of _cache) {
    if (rm.roadmap_slug) _cacheBySlug[rm.roadmap_slug] = rm;
  }

  console.log(`[CurriculumLoader] Loaded ${_cache.length} roadmaps from root curriculum/ directory.`);
  return _cache;
}

/**
 * Load a single roadmap by slug.
 */
function loadRoadmap(slug) {
  if (!_cacheBySlug) {
    loadAllRoadmaps();
  }
  return _cacheBySlug[slug] || null;
}

/**
 * Iterate every lesson across all roadmaps, calling callback(lesson, module, roadmap).
 */
function forEachLesson(callback) {
  const roadmaps = loadAllRoadmaps();
  for (const roadmap of roadmaps) {
    for (const mod of (roadmap.modules || [])) {
      for (const lesson of (mod.lessons || [])) {
        callback(lesson, mod, roadmap);
      }
    }
  }
}

/**
 * Returns total lesson count across all roadmaps.
 */
function getTotalLessonCount() {
  let total = 0;
  forEachLesson(() => total++);
  return total;
}

/**
 * Clear caches.
 */
function clearCache() {
  _cache = null;
  _cacheBySlug = null;
}

module.exports = {
  loadAllRoadmaps,
  loadRoadmap,
  forEachLesson,
  getTotalLessonCount,
  clearCache,
  CURRICULUM_DIR
};
