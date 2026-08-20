# MAJESTIC RP STYLE archive — donor inventory

Uploaded archive inspected by RAR headers: 1,717 entries, ~95 MB archive.

The archive is treated as a **design/mechanics donor**, not as player-facing branding to copy verbatim. VELORIA keeps its own name, visual identity and event contracts.

## Top-level systems found

| Archive section | Approx. entries | VELORIA target |
|---|---:|---|
| `F2-Menu` | 668 | F2 settings/player menu, battle pass, animations and related panels |
| `Ipad` | 588 | Tablet / multi-app player services |
| `AutoShop` | 176 | Dealership/catalog UX |
| `SHOP24` | 175 | Convenience shop / item store UX |
| `RentCar` | 28 | Vehicle rental |
| `G-Menu` | 24 | Interaction menu |
| `CraftMenu` | 18 | Crafting UI/system |
| `OrgCreate` | 12 | Organization creation UX |
| `X-Menu` | 11 | Secondary interaction/context menu |
| `ParkingHouse` | 9 | Parking/garage UX |
| `Dialog` | 8 | Common dialog/modal patterns |

## Archive technology/profile

Observed by file headers/names:
- 327 `.svelte` files
- 323 `.png` assets
- 160 `.woff`, 151 `.eot`, 151 `.ttf`, 114 `.woff2`
- 64 `.svg`
- 56 `.js`
- 38 `.css`, 20 `.sass`
- WebM animation assets are present (notably battle pass backgrounds)
- RedAge/NeptuneEvo-style directory references are present (`dotnet/resources/NeptuneEvo`, `src_cef`)

## Integration policy

1. Reuse interaction patterns, component structure and mechanic coverage where useful.
2. Do not expose Majestic/other donor branding or logos in VELORIA.
3. Prefer rebuilding components against the existing VELORIA React/CEF event contract rather than dropping Svelte runtime into the current client.
4. Do not import bundled font binaries into the repository merely to imitate the donor UI; use VELORIA-owned/system/web-safe typography unless a properly licensed asset is already part of VELORIA.
5. Keep server authority for purchases, money, inventory, organization creation and vehicle ownership.
6. Integrate in playable priority order rather than archive order.

## Priority order for VELORIA

### P0 — first playable loop
- Auth / three character slots / creator / spawn
- HUD
- Inventory
- F2 settings/keybinds

### P1 — daily gameplay
- G/X interaction menu
- iPad/tablet
- AutoShop/dealership
- RentCar
- ParkingHouse/garage
- SHOP24 stores

### P2 — progression/social
- Organization creation
- Crafting
- Battle pass / animations from F2 ecosystem

## Acceptance rule

A donor section is considered integrated only when its CEF, client event handling, server validation and database persistence work together. A visual-only mock is not considered an implemented system.
