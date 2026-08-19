# VELORIA RP

VELORIA RP is a new RAGE:MP server assembled from selected systems and ideas found in the four donor codebases in this repository. Donor folders stay untouched; all integration work lives under `VELORIA-RP/`.

## v0.1 scope

- unified TypeScript structure
- RAGE:MP server/client bootstrap
- shared event contracts
- MySQL + Redis infrastructure
- account/auth foundation
- three-slot character foundation
- character appearance persistence schema
- CEF shell

## Layout

- `src/server` — authoritative game logic
- `src/client` — RAGE:MP client logic
- `src/shared` — shared contracts/types/config
- `src/cef` — UI application
- `database/migrations` — SQL migrations
- `game_resources` — custom DLC/resources (added later)
