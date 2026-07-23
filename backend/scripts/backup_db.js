// ============================================================
// backend/scripts/backup_db.js
// Automated full database backup utility
// ============================================================
'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const cfg = {
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'edunet',
  charset:  'utf8mb4'
};

async function createBackup() {
  console.log('📦 Starting database backup...');
  let conn;
  try {
    conn = await mysql.createConnection(cfg);
    const [tables] = await conn.query('SHOW TABLES');
    const dbName = cfg.database;
    const tableKey = `Tables_in_${dbName}`;

    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const backupFile = path.join(backupDir, `edunet_backup_${timestamp}.sql`);

    let stream = fs.createWriteStream(backupFile, { encoding: 'utf8' });
    stream.write(`-- EduNet Database Backup\n-- Generated: ${new Date().toISOString()}\n\nSET FOREIGN_KEY_CHECKS = 0;\n\n`);

    for (const row of tables) {
      const tableName = row[tableKey] || Object.values(row)[0];
      const [[createRow]] = await conn.query(`SHOW CREATE TABLE \`${tableName}\``);
      const createSql = createRow['Create Table'] || Object.values(createRow)[1];

      stream.write(`DROP TABLE IF EXISTS \`${tableName}\`;\n`);
      stream.write(`${createSql};\n\n`);

      const [dataRows] = await conn.query(`SELECT * FROM \`${tableName}\``);
      if (dataRows.length > 0) {
        for (const data of dataRows) {
          const keys = Object.keys(data).map(k => `\`${k}\``).join(', ');
          const values = Object.values(data).map(val => {
            if (val === null) return 'NULL';
            if (typeof val === 'number') return val;
            if (typeof val === 'boolean') return val ? 1 : 0;
            if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
            return `'${String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r')}'`;
          }).join(', ');
          stream.write(`INSERT INTO \`${tableName}\` (${keys}) VALUES (${values});\n`);
        }
        stream.write('\n');
      }
    }

    stream.write(`SET FOREIGN_KEY_CHECKS = 1;\n`);
    stream.end();

    console.log(`✅ Backup created successfully: ${backupFile}`);
    return backupFile;
  } catch (err) {
    console.error('❌ Backup failed:', err.message);
    throw err;
  } finally {
    if (conn) await conn.end();
  }
}

if (require.main === module) {
  createBackup().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { createBackup };
