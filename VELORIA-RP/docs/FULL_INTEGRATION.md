# VELORIA Full Integration

VELORIA-RP is built from four upstream server bases already stored in this repository:

1. clean_diamond
2. redage_v3-main
3. Moldova RealLife (Farko)
4. ShadowRP_ragemppro

Primary architecture source: RedAge v3 / NeptuneEvo.
Donor sources: Diamond, Moldova RealLife, ShadowRP.

## Integration order

1. Accounts / authorization / registration / recovery
2. Character slots / loading / creation / spawn
3. HUD / inventory / equipment
4. Phone / tablet / bank / market
5. Vehicles / garages / dealerships / tuning / DMV / impound
6. Property / houses / businesses
7. Jobs / factions / families / criminal systems
8. Economy / battle pass / progression / admin systems

The existing Node VELORIA runtime remains as a GTA5HOST compatibility shell during migration. Systems are considered integrated only after server logic, client logic and database schema are all connected and tested.
