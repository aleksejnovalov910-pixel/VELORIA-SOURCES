import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';

const root = resolve(process.cwd());
const out = resolve(root, 'deploy');
const runtime = resolve(out, 'client_packages/veloria/runtime');

await rm(out, { recursive: true, force: true });
await mkdir(resolve(out, 'packages/veloria'), { recursive: true });
await mkdir(runtime, { recursive: true });
await mkdir(resolve(out, 'scripts'), { recursive: true });

await cp(resolve(root, 'build/server'), resolve(out, 'packages/veloria'), { recursive: true });
await cp(resolve(root, 'build/client'), runtime, { recursive: true });
await cp(resolve(root, 'client_packages/veloria'), resolve(out, 'client_packages/veloria'), { recursive: true, force: true });

async function exists(path) {
  try { await stat(path); return true; } catch { return false; }
}

async function files(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) result.push(...await files(path));
    else result.push(path);
  }
  return result;
}

async function resolveClientRequire(sourceFile, request) {
  const base = resolve(dirname(sourceFile), request);
  const candidates = request.endsWith('.js') || request.endsWith('.json')
    ? [base]
    : [base, `${base}.js`, `${base}.json`, resolve(base, 'index.js')];
  for (const candidate of candidates) {
    if (await exists(candidate)) return candidate;
  }
  return null;
}

const clientJsFiles = (await files(runtime)).filter(path => path.endsWith('.js'));
const unresolved = [];
let rewritten = 0;

for (const file of clientJsFiles) {
  let source = await readFile(file, 'utf8');
  const pattern = /require\((['"])(\.\.?\/[^'"]+)\1\)/g;
  const matches = [...source.matchAll(pattern)];
  for (const match of matches) {
    const request = match[2];
    const target = await resolveClientRequire(file, request);
    if (!target) {
      unresolved.push(`${relative(runtime, file)} -> ${request}`);
      continue;
    }
    const targetRelative = relative(runtime, target).replaceAll('\\', '/');
    const rageRequest = `./veloria/runtime/${targetRelative}`;
    source = source.replace(match[0], `require(${JSON.stringify(rageRequest)})`);
    rewritten += 1;
  }
  await writeFile(file, source, 'utf8');
}

if (unresolved.length) {
  throw new Error(`Unresolved client requires:\n${unresolved.join('\n')}`);
}

const remaining = [];
for (const file of clientJsFiles) {
  const source = await readFile(file, 'utf8');
  const pattern = /require\((['"])(\.\.?\/[^'"]+)\1\)/g;
  for (const match of source.matchAll(pattern)) {
    if (!match[2].startsWith('./veloria/runtime/')) remaining.push(`${relative(runtime, file)} -> ${match[2]}`);
  }
}
if (remaining.length) throw new Error(`Unsafe client requires remain after rewrite:\n${remaining.join('\n')}`);

await writeFile(resolve(out, 'packages/veloria/index.js'), "require('./server/index.js');\n", 'utf8');
await writeFile(
  resolve(out, 'client_packages/index.js'),
  ["require('./veloria/runtime/client/index.js');", "require('./veloria/runtime/client/world.js');", ''].join('\n'),
  'utf8'
);

await cp(resolve(root, 'conf.json'), resolve(out, 'conf.json'));
await cp(resolve(root, '.env.example'), resolve(out, '.env.example'));
await cp(resolve(root, 'database'), resolve(out, 'database'), { recursive: true });
await cp(resolve(root, 'scripts/migrate.mjs'), resolve(out, 'scripts/migrate.mjs'));
await cp(resolve(root, 'scripts/dependency-smoke.mjs'), resolve(out, 'scripts/dependency-smoke.mjs'));
await cp(resolve(root, 'scripts/host-preflight.mjs'), resolve(out, 'scripts/host-preflight.mjs'));

const runtimePackage = {
  name: 'veloria-rp-runtime', private: true, version: '0.1.0', type: 'commonjs',
  engines: { node: '>=12' },
  scripts: {
    preflight: 'node scripts/host-preflight.mjs', migrate: 'node scripts/migrate.mjs',
    'deps:smoke': 'node scripts/dependency-smoke.mjs',
    'validate:host': 'npm run preflight && npm run deps:smoke && npm run migrate'
  },
  dependencies: { bcryptjs: '2.4.3', dotenv: '10.0.0', ioredis: '4.28.5', mysql2: '2.3.3' }
};
await writeFile(resolve(out, 'package.json'), JSON.stringify(runtimePackage, null, 2) + '\n', 'utf8');
console.log(`VELORIA deploy bundle created: ${out}`);
console.log(`RAGE:MP client require paths rewritten: ${rewritten}`);
