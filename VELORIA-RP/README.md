# VELORIA RP

VELORIA RP is a new RAGE:MP server assembled from selected systems and ideas found in the four donor codebases in this repository. Donor folders stay untouched; all integration work lives under `VELORIA-RP/`.

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
npm run typecheck
npm run build
```

`npm run build` creates `deploy/` with the RAGE:MP-ready layout:

- `deploy/packages/veloria/` — server package
- `deploy/client_packages/index.js` — client entrypoint
- `deploy/client_packages/veloria/` — client runtime + CEF
- `deploy/database/` — SQL migrations
- `deploy/conf.json` — RAGE:MP config
- `deploy/.env.example` — environment template

## Database

Copy `.env.example` to `.env`, fill MySQL/Redis credentials, create the MySQL database, then run:

```bash
npm run migrate
```

The migration runner discovers numbered SQL files recursively and applies them in numeric order. Applied migrations are stored in `schema_migrations`.

## Host deployment

The first host test should use the generated `deploy/` directory rather than raw TypeScript source. Runtime dependencies from the root `package.json` must be installed on the host (`npm install --omit=dev`) unless the hosting panel supplies its own Node dependency deployment process.

Do not deploy this branch as production yet: v0.1 is the integration/test branch and still requires real RAGE:MP runtime testing.
