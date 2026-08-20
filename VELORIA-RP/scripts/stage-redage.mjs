import { access, cp, mkdir, rm, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const veloriaRoot = resolve(here, '..');
const repoRoot = resolve(veloriaRoot, '..');
const sourceRoot = resolve(repoRoot, 'redage_v3-main');
const destinationRoot = resolve(veloriaRoot, 'integration', 'staged', 'redage');

const copies = [
  ['dotnet/resources/NeptuneEvo', 'server/NeptuneEvo'],
  ['dotnet/resources/NeptuneEvoSDK', 'server/NeptuneEvoSDK'],
  ['dotnet/resources/Localization', 'server/Localization'],
  ['src_client', 'client/src_client'],
  ['src_cef', 'cef/src_cef'],
  ['client_packages', 'client_packages'],
  ['database', 'database'],
  ['settings', 'settings'],
  ['json', 'json'],
];

const required = [
  'dotnet/resources/NeptuneEvo/NeptuneEvo.csproj',
  'dotnet/resources/NeptuneEvo/Main.cs',
  'dotnet/resources/NeptuneEvoSDK/NeptuneEvoSDK.csproj',
  'src_client/index.js',
  'src_cef/package.json',
  'database/main.sql',
];

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

for (const rel of required) {
  const path = resolve(sourceRoot, rel);
  if (!(await exists(path))) {
    throw new Error(`RedAge staging aborted: required source is missing: ${rel}`);
  }
}

await rm(destinationRoot, { recursive: true, force: true });
await mkdir(destinationRoot, { recursive: true });

for (const [fromRel, toRel] of copies) {
  const from = resolve(sourceRoot, fromRel);
  const to = resolve(destinationRoot, toRel);
  await mkdir(dirname(to), { recursive: true });
  await cp(from, to, { recursive: true, force: true });
  console.log(`[VELORIA integration] staged ${fromRel} -> integration/staged/redage/${toRel}`);
}

const stagedChecks = [
  'server/NeptuneEvo/NeptuneEvo.csproj',
  'server/NeptuneEvo/Main.cs',
  'server/NeptuneEvoSDK/NeptuneEvoSDK.csproj',
  'server/Localization/Localization.csproj',
  'client/src_client/index.js',
  'cef/src_cef/package.json',
  'database/main.sql',
];

for (const rel of stagedChecks) {
  const path = resolve(destinationRoot, rel);
  if (!(await exists(path))) {
    throw new Error(`RedAge staging validation failed: ${rel}`);
  }
  const info = await stat(path);
  if (!info.isFile()) throw new Error(`RedAge staging validation expected file: ${rel}`);
}

console.log('[VELORIA integration] RedAge coherent source slice staged successfully.');
console.log(`[VELORIA integration] output: ${relative(repoRoot, destinationRoot)}`);
console.log('[VELORIA integration] runtime is NOT switched automatically; this staging area is integration-only.');
