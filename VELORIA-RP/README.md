# VELORIA RP

VELORIA RP is a new RAGE:MP server assembled from selected systems and ideas found in the donor codebases in this repository. Donor folders stay untouched; all integration work lives under `VELORIA-RP/`.

## Current v0.1 scope

- MySQL + Redis bootstrap
- account/login/register foundation
- 3 character slots and character creator
- inventory/equipment core
- banking and transactions
- phone and messages
- V-Market
- vehicles, VIN, keys, mileage, insurance and garages
- dealerships, DMV and impound
- houses/properties and businesses
- jobs, families and factions
- HUD, speedometer, notifications
- phone/tablet/F2/inventory/bank/market CEF
- deploy bundle generator and ordered database migrations

## Development build

Use Node.js 20+.

```bash
npm install
npm --prefix src/cef install
npm run deps:smoke
npm run typecheck
npm run migrate
npm run build
```

`npm run build` creates `deploy/` with the RAGE:MP-ready layout:

- `deploy/packages/veloria/` — compiled server package
- `deploy/client_packages/index.js` — client entrypoint
- `deploy/client_packages/veloria/` — compiled client runtime + CEF
- `deploy/database/` — ordered SQL migrations
- `deploy/scripts/` — host preflight, dependency smoke and migration scripts
- `deploy/conf.json` — RAGE:MP config
- `deploy/.env.example` — environment template
- `deploy/package.json` — production-only runtime dependencies and host commands

## Database

Copy `.env.example` to `.env`, fill MySQL/Redis credentials and create the MySQL database. Never keep the example password in a real host environment.

The migration runner discovers numbered SQL files recursively and applies them in numeric order. Applied migrations are stored in `schema_migrations`.

## Host deployment checklist

Use the generated `deploy/` directory, not raw TypeScript source.

1. Upload the contents of `deploy/` to the RAGE:MP server root expected by the hosting panel.
2. Copy `.env.example` to `.env`.
3. Set real MySQL and Redis connection values in `.env` and set `NODE_ENV=production`.
4. Confirm `conf.json` contains the host port and desired slot count before starting the server.
5. Install production dependencies and validate the runtime:

```bash
npm install --omit=dev
npm run preflight
npm run deps:smoke
npm run migrate
```

Only start RAGE:MP after all four commands complete successfully. `preflight` validates required environment values, `deps:smoke` performs real MySQL and Redis connections, and `migrate` prepares/updates the schema.

## CI deployment gate

The `VELORIA Build` workflow mirrors the host preparation path. It starts disposable MySQL and Redis services, verifies dependency connectivity, typechecks server/client/CEF, runs migrations, builds the deploy bundle, validates its layout, installs production dependencies inside `deploy/`, then runs the deploy runtime checks again. A successful run publishes the `veloria-deploy` artifact.

Do not use a failed CI artifact for the first host test. The first host test should use the latest `veloria-deploy` artifact produced by a fully green workflow run.

## Test branch status

`veloria-core-v0.1` remains an integration/test branch until the generated deploy artifact has passed a real RAGE:MP host boot and in-game smoke test. After that test, runtime issues should be fixed on this branch before promoting a release build.
