import { access, readdir, readFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

const root = resolve(process.cwd());
const deploy = resolve(root, 'deploy');

const required = [
  'conf.json',
  '.env.example',
  'package.json',
  'packages/veloria/index.js',
  'packages/veloria/server/index.js',
  'client_packages/index.js',
  'client_packages/veloria/index.html',
  'client_packages/veloria/runtime/client/index.js',
  'scripts/migrate.mjs',
  'scripts/dependency-smoke.mjs',
  'scripts/host-preflight.mjs'
];

for (const file of required) {
  await access(resolve(deploy, file));
  console.log('ok', file);
}

async function sqlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await sqlFiles(full));
    else if (/^\d+.*\.sql$/i.test(entry.name)) out.push(full);
  }
  return out;
}

const files = await sqlFiles(resolve(deploy, 'database'));
const numbered = files.map(file => ({ file, n: Number((basename(file).match(/^(\d+)/) || [])[1]) })).sort((a,b)=>a.n-b.n);
if (!numbered.length) throw new Error('No SQL migrations found');

const seen = new Set();
for (const item of numbered) {
  if (!Number.isFinite(item.n)) throw new Error(`Migration without number: ${item.file}`);
  if (seen.has(item.n)) throw new Error(`Duplicate migration number: ${item.n}`);
  seen.add(item.n);
}
for (let n = numbered[0].n; n <= numbered[numbered.length - 1].n; n++) {
  if (!seen.has(n)) throw new Error(`Missing migration number: ${String(n).padStart(3,'0')}`);
}

const pkg = JSON.parse(await readFile(resolve(deploy, 'package.json'), 'utf8'));
for (const dep of ['bcryptjs','dotenv','ioredis','mysql2']) {
  if (!pkg.dependencies?.[dep]) throw new Error(`Missing runtime dependency: ${dep}`);
}
if (!pkg.scripts?.migrate) throw new Error('Missing runtime migrate script');
if (!pkg.scripts?.['deps:smoke']) throw new Error('Missing runtime dependency smoke script');
if (!pkg.scripts?.preflight) throw new Error('Missing runtime host preflight script');
if (!pkg.scripts?.['validate:host']) throw new Error('Missing runtime validate:host script');
if (!pkg.engines?.node) throw new Error('Missing runtime Node.js engine requirement');

const validateHost = String(pkg.scripts['validate:host']);
for (const command of ['npm run preflight', 'npm run deps:smoke', 'npm run migrate']) {
  if (!validateHost.includes(command)) throw new Error(`validate:host is missing required command: ${command}`);
}

console.log(`VELORIA preflight OK: ${numbered.length} migrations, deploy layout complete`);
