# VELORIA RP — Full Integration Roadmap

## Architecture decision

VELORIA uses **RedAge 3 / NeptuneEvo (.NET + RAGE:MP)** as the primary gameplay upstream. The existing NodeJS VELORIA layer remains temporary/compatibility-only until the .NET vertical slice is deployable on GTA5HOST.

Donor priority:
1. `redage_v3-main` — primary gameplay/core/database/account/character implementation.
2. `Moldova RealLife (Farko)` — donor for systems that are stronger or missing in RedAge.
3. `ShadowRP_ragemppro` — donor for compatible C#/.NET gameplay/client systems.
4. `clean_diamond` — reference/donor for JS/CEF/UI and mechanics where useful; do not mix its runtime directly into NeptuneEvo without an adapter.

## Phase 1 — playable vertical slice

### Account
- Authorization
- Registration
- Recovery / password reset
- Account repository and persistence

### Characters
- Exactly 3 character slots in VELORIA UI
- Empty slot opens character creation
- Character create/load/save/delete backend
- Customization backend
- Spawn selection and spawn pipeline

### Character creation UX
- Separate selection and creation screens
- VELORIA branding
- Parent mother/father gallery
- Similarity and skin tone controls
- Hair/eyebrows/eyes/beard previews + separate colors
- Clothing previews (shoes/pants/tops; initial 3–5 variants/category)
- LMB rotates camera
- Mouse wheel zooms
- Isolated creation dimension / attractive scene

### First gameplay load
- Load character items
- HUD
- Inventory
- Money/bank state
- Phone bootstrap
- Quest/new-player bootstrap

## Important RedAge dependency discovered

`Character/Create/Repository.cs` is not standalone. Character creation already initializes and depends on:
- `Database` / `ServerBD`
- `Accounts`
- `Character.Models`
- `Core`
- `MoneySystem.Bank`
- `Players`
- `BattlePass`
- `Quests`
- `Players.Phone`
- `Chars.Repository.LoadCharItemsData`
- `Localization`
- `Redage.SDK`

Therefore VELORIA must port a coherent dependency slice instead of copying only `Accounts`, `Character`, and `Chars`.

## Phase 1 dependency slice

Mandatory server modules to stage together:
- Accounts
- Character
- Chars
- Database
- Core
- Players
- MoneySystem
- Quests
- BattlePass (minimum required interfaces/data)
- Localization
- Redage.SDK / NeptuneEvoSDK

Mandatory client/UI slice:
- account CEF/events
- character selection CEF/events
- character creation/customization CEF/events
- HUD
- inventory
- phone bootstrap dependencies

## Integration rules

- Never merge donor DB schemas blindly. Produce VELORIA migrations and preserve data ownership.
- Never duplicate event names. Maintain a server↔client event contract list.
- Do not copy compiled DLLs when source is available.
- Do not expose donor branding to players.
- Keep `main` deployable; integration work stays on `veloria-full-integration` until the vertical slice passes build/start/login/create/select/spawn tests.
- Every imported subsystem must have its dependencies recorded before it is enabled.

## Acceptance gate for first merge to main

1. Server starts without missing module/runtime errors.
2. MySQL schema migrates cleanly on an empty VELORIA database.
3. Registration and login work.
4. Account shows 3 character slots.
5. Empty slot creates a character and saves appearance.
6. Existing character loads after reconnect.
7. Spawn completes without dimension/camera/input lock bugs.
8. HUD and inventory initialize after spawn.
9. No RedAge/NeptuneEvo/other donor branding is visible in player-facing UI.
10. Two clients can connect without client resource/cache mismatch errors.

## Next implementation action

Stage the coherent RedAge Phase-1 dependency slice, then map server/client events and database tables before enabling it in VELORIA runtime.
