const db = require('../config/db');

async function check() {
  try {
    const [counts] = await db.query(`
      SELECT r.id, r.title, COUNT(DISTINCT rm.id) as modules_count, COUNT(DISTINCT ml.id) as lessons_count
      FROM roadmaps r
      LEFT JOIN roadmap_modules rm ON r.id = rm.roadmap_id
      LEFT JOIN module_lessons ml ON rm.id = ml.module_id
      GROUP BY r.id, r.title
      ORDER BY r.id
    `);
    console.table(counts);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
