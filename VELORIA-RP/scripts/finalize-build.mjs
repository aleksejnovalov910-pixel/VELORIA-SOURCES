import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const out = resolve(root, 'deploy');

await rm(out, { recursive: true, force: true });
await mkdir(resolve(out, 'packages/veloria'), { recursive: true });
await mkdir(resolve(out, 'client_packages/veloria/runtime'), { recursive: true });
await mkdir(resolve(out, 'scripts'), { recursive: true });

await cp(resolve(root, 'build/server'), resolve(out, 'packages/veloria'), { recursive: true });
await cp(resolve(root, 'build/client'), resolve(out, 'client_packages/veloria/runtime'), { recursive: true });
await cp(resolve(root, 'client_packages/veloria'), resolve(out, 'client_packages/veloria'), { recursive: true, force: true });

// RAGE:MP's client require resolver does not reliably resolve directories to index.js.
// Create explicit compatibility aliases for directory-style imports emitted by TypeScript.
await writeFile(resolve(out, 'client_packages/veloria/runtime/shared/events.js'), "module.exports = require('./events/index.js');\n", 'utf8');
await writeFile(resolve(out, 'client_packages/veloria/runtime/client/hud.js'), "module.exports = require('./hud/index.js');\n", 'utf8');
await writeFile(resolve(out, 'client_packages/veloria/runtime/client/controls.js'), "module.exports = require('./controls/index.js');\n", 'utf8');
await writeFile(resolve(out, 'client_packages/veloria/runtime/client/vehicles.js'), "require('./vehicles/index.js');\n", 'utf8');

await writeFile(resolve(out, 'packages/veloria/index.js'), "require('./server/index.js');\n", 'utf8');
await writeFile(resolve(out, 'client_packages/index.js'), "require('./veloria/runtime/client/index.js');\n", 'utf8');

await cp(resolve(root, 'conf.json'), resolve(out, 'conf.json'));
await cp(resolve(root, '.env.example'), resolve(out, '.env.example'));
await cp(resolve(root, 'database'), resolve(out, 'database'), { recursive: true });
await cp(resolve(root, 'scripts/migrate.mjs'), resolve(out, 'scripts/migrate.mjs'));
await cp(resolve(root, 'scripts/dependency-smoke.mjs'), resolve(out, 'scripts/dependency-smoke.mjs'));
await cp(resolve(root, 'scripts/host-preflight.mjs'), resolve(out, 'scripts/host-preflight.mjs'));

const runtimePackage = {
  name: 'veloria-rp-runtime',
  private: true,
  version: '0.1.0',
  type: 'commonjs',
  engines: {
    node: '>=12'
  },
  scripts: {
    preflight: 'node scripts/host-preflight.mjs',
    migrate: 'node scripts/migrate.mjs',
    'deps:smoke': 'node scripts/dependency-smoke.mjs',
    'validate:host': 'npm run preflight && npm run deps:smoke && npm run migrate'
  },
  dependencies: {
    bcryptjs: '2.4.3',
    dotenv: '10.0.0',
    ioredis: '4.28.5',
    mysql2: '2.3.3'
  }
};
await writeFile(resolve(out, 'package.json'), JSON.stringify(runtimePackage, null, 2) + '\n', 'utf8');

console.log('VELORIA deploy bundle created:', out);
