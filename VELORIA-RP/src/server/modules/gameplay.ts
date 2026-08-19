import { VeloriaEvents } from '../../shared/events/veloria';
import { getInventory } from './inventory';
import { setVehicleState } from './vehicles';
import { ensurePhone } from './phone';

function characterId(player: PlayerMp): number | null {
  return Number((player as any).veloriaCharacterId ?? 0) || null;
}

export function registerGameplayModules() {
  mp.events.add(VeloriaEvents.InventoryOpen, async (player: PlayerMp) => {
    const id = characterId(player); if (!id) return;
    const inventory = await getInventory(id);
    player.call(VeloriaEvents.InventorySync, [JSON.stringify(inventory)]);
  });

  mp.events.add(VeloriaEvents.PhoneToggle, async (player: PlayerMp) => {
    const id = characterId(player); if (!id) return;
    const phone = await ensurePhone(id);
    player.call(VeloriaEvents.PhoneToggle, [JSON.stringify(phone)]);
  });

  mp.events.add(VeloriaEvents.VehicleLock, async (player: PlayerMp, remoteId: number) => {
    const vehicle = mp.vehicles.atRemoteId(Number(remoteId)); if (!vehicle) return;
    const locked = !(vehicle as any).locked;
    (vehicle as any).locked = locked;
    if ((vehicle as any).veloriaVehicleId) await setVehicleState((vehicle as any).veloriaVehicleId, { locked });
  });

  mp.events.add(VeloriaEvents.VehicleEngine, async (player: PlayerMp, remoteId: number) => {
    const vehicle = mp.vehicles.atRemoteId(Number(remoteId)); if (!vehicle || player.vehicle !== vehicle) return;
    const engineOn = !(vehicle as any).engine;
    (vehicle as any).engine = engineOn;
    if ((vehicle as any).veloriaVehicleId) await setVehicleState((vehicle as any).veloriaVehicleId, { engineOn });
  });
}
