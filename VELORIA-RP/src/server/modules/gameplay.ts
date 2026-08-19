import { VeloriaEvents } from '../../shared/events/veloria';
import { getInventory } from './inventory';
import { hasVehicleKey, setVehicleState } from './vehicles';
import { ensurePhone } from './phone';

function characterId(player: PlayerMp): number | null {
  const value = player.getVariable('veloria:characterId') ?? player.getVariable('characterId');
  return typeof value === 'number' ? value : null;
}

async function canControlVehicle(player: PlayerMp, vehicle: VehicleMp): Promise<boolean> {
  const id = characterId(player);
  const vehicleId = Number((vehicle as any).veloriaVehicleId ?? vehicle.getVariable('veloria:vehicleId') ?? 0);
  if (!id || !vehicleId) return false;
  return hasVehicleKey(vehicleId, id);
}

function findVehicle(rawId: number): VehicleMp | null {
  const id = Number(rawId);
  if (!Number.isFinite(id)) return null;
  return mp.vehicles.at(id) ?? null;
}

export function registerGameplayModules() {
  mp.events.add(VeloriaEvents.InventoryOpen, async (player: PlayerMp) => {
    const id = characterId(player);
    if (!id) return;
    const inventory = await getInventory(id);
    player.call(VeloriaEvents.InventorySync, [JSON.stringify(inventory)]);
  });

  mp.events.add(VeloriaEvents.PhoneToggle, async (player: PlayerMp) => {
    const id = characterId(player);
    if (!id) return;
    const phone = await ensurePhone(id);
    player.call(VeloriaEvents.PhoneToggle, [JSON.stringify(phone)]);
  });

  mp.events.add(VeloriaEvents.VehicleLock, async (player: PlayerMp, vehicleIdRaw: number) => {
    const vehicle = findVehicle(vehicleIdRaw);
    if (!vehicle) return;
    if (!(await canControlVehicle(player, vehicle))) {
      player.call(VeloriaEvents.Notify, ['error', 'У вас нет ключа от этого автомобиля']);
      return;
    }

    const locked = !(vehicle as any).locked;
    (vehicle as any).locked = locked;
    const vehicleId = Number((vehicle as any).veloriaVehicleId ?? vehicle.getVariable('veloria:vehicleId') ?? 0);
    if (vehicleId) await setVehicleState(vehicleId, { locked });
    player.call(VeloriaEvents.Notify, ['info', locked ? 'Автомобиль закрыт' : 'Автомобиль открыт']);
  });

  mp.events.add(VeloriaEvents.VehicleEngine, async (player: PlayerMp, vehicleIdRaw: number) => {
    const vehicle = findVehicle(vehicleIdRaw);
    if (!vehicle || player.vehicle !== vehicle) return;
    if (!(await canControlVehicle(player, vehicle))) {
      player.call(VeloriaEvents.Notify, ['error', 'Для запуска двигателя нужен ключ']);
      return;
    }

    const engineOn = !(vehicle as any).engine;
    (vehicle as any).engine = engineOn;
    const vehicleId = Number((vehicle as any).veloriaVehicleId ?? vehicle.getVariable('veloria:vehicleId') ?? 0);
    if (vehicleId) await setVehicleState(vehicleId, { engineOn });
    player.call(VeloriaEvents.Notify, ['info', engineOn ? 'Двигатель запущен' : 'Двигатель заглушен']);
  });

  mp.events.add(VeloriaEvents.VehicleSeatbelt, (player: PlayerMp) => {
    if (!player.vehicle) return;
    const current = Boolean(player.getVariable('veloria:seatbelt'));
    const next = !current;
    player.setVariable('veloria:seatbelt', next);
    player.call('veloria:vehicle:seatbelt:state', [next]);
    player.call(VeloriaEvents.Notify, ['info', next ? 'Ремень пристегнут' : 'Ремень отстегнут']);
  });
}
