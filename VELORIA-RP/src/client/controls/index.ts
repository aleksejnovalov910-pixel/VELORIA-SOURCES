import { VeloriaEvents } from '../../shared/events/veloria';
import { VELORIA_CONFIG } from '../../shared/config/server';

export type ClientKeybinds = {
  phone: number;
  tablet: number;
  inventory: number;
  settings: number;
  vehicleLock: number;
  vehicleEngine: number;
  seatbelt: number;
};

export const DEFAULT_KEYBINDS: ClientKeybinds = {
  phone: VELORIA_CONFIG.phoneKey,
  tablet: VELORIA_CONFIG.tabletKey,
  inventory: VELORIA_CONFIG.inventoryKey,
  settings: VELORIA_CONFIG.settingsKey,
  vehicleLock: 76,
  vehicleEngine: 74,
  seatbelt: 66
};

let current = { ...DEFAULT_KEYBINDS };
let lastVehicleActionAt = 0;

const handlers: Record<keyof ClientKeybinds, () => void> = {
  phone: () => mp.events.call(VeloriaEvents.PhoneToggle),
  tablet: () => mp.events.call(VeloriaEvents.TabletToggle),
  inventory: () => mp.events.call(VeloriaEvents.InventoryToggle),
  settings: () => mp.events.call(VeloriaEvents.SettingsToggle),
  vehicleLock: () => {
    const now = Date.now(); if (now - lastVehicleActionAt < 250) return; lastVehicleActionAt = now;
    const vehicle = mp.players.local.vehicle;
    if (vehicle && typeof vehicle.remoteId === 'number' && vehicle.remoteId >= 0) mp.events.callRemote(VeloriaEvents.VehicleLock, vehicle.remoteId);
  },
  vehicleEngine: () => {
    const now = Date.now(); if (now - lastVehicleActionAt < 250) return; lastVehicleActionAt = now;
    const vehicle = mp.players.local.vehicle;
    if (vehicle && typeof vehicle.remoteId === 'number' && vehicle.remoteId >= 0) mp.events.callRemote(VeloriaEvents.VehicleEngine, vehicle.remoteId);
  },
  seatbelt: () => {
    const now = Date.now(); if (now - lastVehicleActionAt < 250) return; lastVehicleActionAt = now;
    if (mp.players.local.vehicle) mp.events.callRemote(VeloriaEvents.VehicleSeatbelt);
  }
};

function safeKey(value: unknown, fallback: number): number {
  const key = Number(value);
  return Number.isSafeInteger(key) && key >= 8 && key <= 255 ? key : fallback;
}

function bindAll(bindings: ClientKeybinds) {
  for (const name of Object.keys(bindings) as (keyof ClientKeybinds)[]) {
    mp.keys.bind(bindings[name], true, handlers[name]);
  }
}

function unbindAll(bindings: ClientKeybinds) {
  for (const name of Object.keys(bindings) as (keyof ClientKeybinds)[]) {
    try {
      mp.keys.unbind(bindings[name], handlers[name]);
    } catch {
      /* RAGE client may already have removed the bind */
    }
  }
}

export function applyKeybinds(value: unknown): ClientKeybinds {
  const raw = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const next: ClientKeybinds = {
    phone: safeKey(raw.phone, DEFAULT_KEYBINDS.phone),
    tablet: safeKey(raw.tablet, DEFAULT_KEYBINDS.tablet),
    inventory: safeKey(raw.inventory, DEFAULT_KEYBINDS.inventory),
    settings: safeKey(raw.settings, DEFAULT_KEYBINDS.settings),
    vehicleLock: safeKey(raw.vehicleLock, DEFAULT_KEYBINDS.vehicleLock),
    vehicleEngine: safeKey(raw.vehicleEngine, DEFAULT_KEYBINDS.vehicleEngine),
    seatbelt: safeKey(raw.seatbelt, DEFAULT_KEYBINDS.seatbelt)
  };
  unbindAll(current);
  current = next;
  bindAll(current);
  return { ...current };
}

bindAll(current);
