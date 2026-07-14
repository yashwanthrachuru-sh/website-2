const db = require('../config/db');

async function check() {
  try {
    const [roadmaps] = await db.query('SELECT * FROM roadmaps');
    console.log(roadmaps);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
