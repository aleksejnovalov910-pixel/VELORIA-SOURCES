import { VeloriaEvents } from '../../shared/events/veloria';
import { getInventory } from './inventory';
import { hasVehicleKey, setVehicleState } from './vehicles';
import { ensurePhone } from './phone';

function characterId(player: PlayerMp): number | null {
  const value = Number(player.getVariable('veloria:characterId') ?? player.getVariable('characterId'));
  return Number.isSafeInteger(value) && value > 0 ? value : null;
}

async function canControlVehicle(player: PlayerMp, vehicle: VehicleMp): Promise<boolean> {
  const id = characterId(player);
  const vehicleId = Number((vehicle as any).veloriaVehicleId ?? vehicle.getVariable('veloria:vehicleId') ?? 0);
  if (!id || !Number.isSafeInteger(vehicleId) || vehicleId <= 0) return false;
  return hasVehicleKey(vehicleId, id);
}

function findVehicle(rawId: unknown): VehicleMp | null {
  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id < 0) return null;
  return mp.vehicles.at(id) ?? null;
}

function notify(player: PlayerMp, type: 'info' | 'error', text: string) {
  player.call(VeloriaEvents.Notify, [type, text]);
}

export function registerGameplayModules() {
  mp.events.add(VeloriaEvents.InventoryOpen, async (player: PlayerMp) => {
    const id = characterId(player);
    if (!id) return;
    try {
      const inventory = await getInventory(id);
      player.call(VeloriaEvents.InventorySync, [JSON.stringify(inventory)]);
    } catch {
      notify(player, 'error', 'Не удалось загрузить инвентарь');
    }
  });

  mp.events.add(VeloriaEvents.PhoneToggle, async (player: PlayerMp) => {
    const id = characterId(player);
    if (!id) return;
    try {
      const phone = await ensurePhone(id);
      player.call(VeloriaEvents.PhoneToggle, [JSON.stringify(phone)]);
    } catch {
      notify(player, 'error', 'Не удалось открыть телефон');
    }
  });

  mp.events.add(VeloriaEvents.VehicleLock, async (player: PlayerMp, vehicleIdRaw: unknown) => {
    const vehicle = findVehicle(vehicleIdRaw);
    if (!vehicle) return notify(player, 'error', 'Автомобиль не найден');
    try {
      if (!(await canControlVehicle(player, vehicle))) return notify(player, 'error', 'У вас нет ключа от этого автомобиля');
      const locked = !(vehicle as any).locked;
      (vehicle as any).locked = locked;
      const vehicleId = Number((vehicle as any).veloriaVehicleId ?? vehicle.getVariable('veloria:vehicleId') ?? 0);
      if (Number.isSafeInteger(vehicleId) && vehicleId > 0) await setVehicleState(vehicleId, { locked });
      notify(player, 'info', locked ? 'Автомобиль закрыт' : 'Автомобиль открыт');
    } catch {
      notify(player, 'error', 'Не удалось изменить состояние замка');
    }
  });

  mp.events.add(VeloriaEvents.VehicleEngine, async (player: PlayerMp, vehicleIdRaw: unknown) => {
    const vehicle = findVehicle(vehicleIdRaw);
    if (!vehicle || player.vehicle !== vehicle) return;
    try {
      if (!(await canControlVehicle(player, vehicle))) return notify(player, 'error', 'Для запуска двигателя нужен ключ');
      const engineOn = !(vehicle as any).engine;
      (vehicle as any).engine = engineOn;
      const vehicleId = Number((vehicle as any).veloriaVehicleId ?? vehicle.getVariable('veloria:vehicleId') ?? 0);
      if (Number.isSafeInteger(vehicleId) && vehicleId > 0) await setVehicleState(vehicleId, { engineOn });
      notify(player, 'info', engineOn ? 'Двигатель запущен' : 'Двигатель заглушен');
    } catch {
      notify(player, 'error', 'Не удалось изменить состояние двигателя');
    }
  });

  mp.events.add(VeloriaEvents.VehicleSeatbelt, (player: PlayerMp) => {
    if (!player.vehicle) return;
    const current = Boolean(player.getVariable('veloria:seatbelt'));
    const next = !current;
    player.setVariable('veloria:seatbelt', next);
    player.call('veloria:vehicle:seatbelt:state', [next]);
    notify(player, 'info', next ? 'Ремень пристегнут' : 'Ремень отстегнут');
  });
}
