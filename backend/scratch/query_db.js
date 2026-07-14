const db = require('../config/db');

async function check() {
  try {
    const [roadmaps] = await db.query('SELECT id, title FROM roadmaps');
    console.log('--- ROADMAPS ---', roadmaps.length);
    console.log(roadmaps.map(r => r.id));

    const [modules] = await db.query('SELECT COUNT(*) as count FROM roadmap_modules');
    console.log('--- MODULES ---', modules[0].count);

    const [lessons] = await db.query('SELECT COUNT(*) as count FROM module_lessons');
    console.log('--- LESSONS ---', lessons[0].count);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
