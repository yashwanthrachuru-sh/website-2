const db = require('../config/db');

async function check() {
  try {
    const [modProgress] = await db.query('SELECT COUNT(*) as count FROM module_progress');
    const [lesProgress] = await db.query('SELECT COUNT(*) as count FROM lesson_progress');
    const [roadmapProgress] = await db.query('SELECT COUNT(*) as count FROM roadmap_progress');
    console.log('module_progress count:', modProgress[0].count);
    console.log('lesson_progress count:', lesProgress[0].count);
    console.log('roadmap_progress count:', roadmapProgress[0].count);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
