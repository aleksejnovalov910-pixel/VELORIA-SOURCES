import 'dotenv/config';
import mysql from 'mysql2/promise';
import { readdir, readFile } from 'node:fs/promises';
import { basename, join, relative, resolve } from 'node:path';

const root = resolve(process.cwd(), 'database');

async function sqlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await sqlFiles(full));
    else if (/^\d+.*\.sql$/i.test(entry.name)) out.push(full);
  }
  return out;
}

const order = file => Number((basename(file).match(/^(\d+)/) || [])[1] ?? 999999);

const db = await mysql.createConnection({
  host: process.env.MYSQL_HOST ?? '127.0.0.1',
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  multipleStatements: true
});

try {
  await db.query('CREATE TABLE IF NOT EXISTS schema_migrations(name VARCHAR(255) PRIMARY KEY, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');

  const files = (await sqlFiles(root)).sort((a, b) => order(a) - order(b) || a.localeCompare(b));
  if (!files.length) throw new Error(`No migrations found under ${root}`);

  const [done] = await db.query('SELECT name FROM schema_migrations');
  const applied = new Set(done.map(row => row.name));

  for (const full of files) {
    const name = relative(root, full).replaceAll('\\', '/');
    if (applied.has(name)) {
      console.log('skip', name);
      continue;
    }

    const sql = await readFile(full, 'utf8');
    console.log(`\n=== apply ${name} ===`);
    try {
      // MySQL DDL implicitly commits, so wrapping schema migrations in a transaction
      // gives a false sense of rollback safety. Execute the migration directly and
      // record it only after every statement succeeds.
      await db.query(sql);
      await db.query('INSERT INTO schema_migrations(name) VALUES(?)', [name]);
      console.log('ok', name);
    } catch (error) {
      console.error(`\nMIGRATION FAILED: ${name}`);
      console.error('code:', error?.code ?? 'unknown');
      console.error('errno:', error?.errno ?? 'unknown');
      console.error('sqlState:', error?.sqlState ?? 'unknown');
      console.error('message:', error?.sqlMessage ?? error?.message ?? String(error));
      throw error;
    }
  }

  const [rows] = await db.query('SELECT name FROM schema_migrations ORDER BY name');
  console.log(`\nVELORIA migrations OK (${rows.length}/${files.length})`);
} finally {
  await db.end();
}
