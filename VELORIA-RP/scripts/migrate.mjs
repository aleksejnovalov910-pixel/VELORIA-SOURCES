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

function versionTuple(raw) {
  const match = String(raw ?? '').match(/(\d+)\.(\d+)(?:\.(\d+))?/);
  return match ? [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)] : [999, 999, 999];
}

function olderThan(tuple, major, minor) {
  return tuple[0] < major || (tuple[0] === major && tuple[1] < minor);
}

function splitSqlArgs(source) {
  const out = [];
  let token = '';
  let quoted = false;
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (char === "'" && source[i - 1] !== '\\') quoted = !quoted;
    if (char === ',' && !quoted) {
      out.push(token.trim());
      token = '';
    } else token += char;
  }
  if (token.trim()) out.push(token.trim());
  return out;
}

function sqlLiteralToJson(raw) {
  const value = raw.trim();
  if (/^NULL$/i.test(value)) return 'null';
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return value;
  if (/^'(?:[^']|'')*'$/.test(value)) {
    const text = value.slice(1, -1).replaceAll("''", "'");
    return JSON.stringify(text);
  }
  return null;
}

function replaceJsonObjectCalls(sql) {
  return sql.replace(/JSON_OBJECT\(([^()]*)\)/gi, (full, inner) => {
    if (!inner.trim()) return "'{}'";
    const args = splitSqlArgs(inner);
    if (args.length % 2 !== 0) return full;
    const object = {};
    for (let i = 0; i < args.length; i += 2) {
      const keyRaw = args[i];
      if (!/^'(?:[^']|'')*'$/.test(keyRaw)) return full;
      const key = keyRaw.slice(1, -1).replaceAll("''", "'");
      const jsonValue = sqlLiteralToJson(args[i + 1]);
      if (jsonValue === null) return full;
      object[key] = JSON.parse(jsonValue);
    }
    return `'${JSON.stringify(object).replaceAll("'", "''")}'`;
  });
}

function legacyMariaSql(sql) {
  let out = sql;
  // MariaDB 10.0/10.1 used by some game-hosting panels has neither a native
  // JSON alias nor JSON_OBJECT(). VELORIA stores these payloads as JSON text,
  // so LONGTEXT is wire-compatible with mysql2 + JSON.parse on the runtime.
  out = out.replace(/\bJSON\b/gi, 'LONGTEXT');
  out = replaceJsonObjectCalls(out);
  out = out.replace(/JSON_ARRAY\(\s*\)/gi, "'[]'");
  out = out.replace(/,?\s*CONSTRAINT\s+chk_character_slot\s+CHECK\s*\(\s*slot\s+BETWEEN\s+1\s+AND\s+3\s*\)/gi, '');
  return out;
}

const db = await mysql.createConnection({
  host: process.env.MYSQL_HOST ?? '127.0.0.1',
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  multipleStatements: true
});

try {
  const [versionRows] = await db.query('SELECT VERSION() AS version');
  const serverVersion = String(versionRows?.[0]?.version ?? 'unknown');
  const isMariaDb = /mariadb/i.test(serverVersion);
  const legacyMaria = isMariaDb && olderThan(versionTuple(serverVersion), 10, 2);
  console.log(`Database server: ${serverVersion}${legacyMaria ? ' (legacy compatibility enabled)' : ''}`);

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

    const sourceSql = await readFile(full, 'utf8');
    const sql = legacyMaria ? legacyMariaSql(sourceSql) : sourceSql;
    console.log(`\n=== apply ${name} ===`);
    try {
      // MySQL/MariaDB DDL implicitly commits. Record a migration only after all
      // statements in that migration have completed successfully.
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
