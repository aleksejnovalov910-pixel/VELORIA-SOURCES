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
    node: '>=20'
  },
  scripts: {
    preflight: 'node scripts/host-preflight.mjs',
    migrate: 'node scripts/migrate.mjs',
    'deps:smoke': 'node scripts/dependency-smoke.mjs'
  },
  dependencies: {
    bcryptjs: '^3.0.2',
    dotenv: '^17.2.3',
    ioredis: '^5.7.0',
    mysql2: '^3.14.4'
  }
};
await writeFile(resolve(out, 'package.json'), JSON.stringify(runtimePackage, null, 2) + '\n', 'utf8');

console.log('VELORIA deploy bundle created:', out);
