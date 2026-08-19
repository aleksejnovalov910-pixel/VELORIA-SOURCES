import { getCharacterVehicles } from '../vehicles';
import { getOwnedProperties } from '../property';
import { getJob } from '../jobs';
import { getFamilyByCharacter, getFamilyMembers } from '../families';
import { getFactionByCharacter, getFactionMembers } from '../factions';
import { getOwnedBusinesses } from '../businesses';
import { getEquipment } from '../equipment';

function characterId(player: PlayerMp): number | null {
  const value = Number(player.getVariable('veloria:characterId') ?? player.getVariable('characterId'));
  return Number.isInteger(value) && value > 0 ? value : null;
}

function vehiclePosition(value: unknown): { x: number; y: number; z?: number } | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  const x = Number(raw.x), y = Number(raw.y), z = Number(raw.z);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y, ...(Number.isFinite(z) ? { z } : {}) };
}

export function registerTabletModule() {
  mp.events.add('veloria:tablet:data', async (player: PlayerMp, rawSection: string) => {
    const id = characterId(player);
    if (!id) return;

    const section = String(rawSection ?? '').trim().toLowerCase();
    try {
      let data: unknown;
      if (section === 'transport') {
        data = await getCharacterVehicles(id);
      } else if (section === 'property') {
        data = await getOwnedProperties(id);
      } else if (section === 'job') {
        data = await getJob(id);
      } else if (section === 'family') {
        const family = await getFamilyByCharacter(id);
        data = family ? { family, members: await getFamilyMembers(Number(family.id)) } : null;
      } else if (section === 'faction') {
        const faction = await getFactionByCharacter(id);
        data = faction ? { faction, members: await getFactionMembers(Number(faction.id)) } : null;
      } else if (section === 'business') {
        data = await getOwnedBusinesses(id);
      } else if (section === 'equipment') {
        data = await getEquipment(id);
      } else {
        player.call('veloria:notify', ['error', 'Неизвестный раздел планшета']);
        return;
      }

      player.call('veloria:tablet:data', [section, JSON.stringify(data)]);
    } catch {
      player.call('veloria:notify', ['error', 'Не удалось загрузить данные планшета']);
    }
  });

  mp.events.add('veloria:tablet:vehicle:locate', async (player: PlayerMp, rawVehicleId: unknown) => {
    const id = characterId(player), vehicleId = Number(rawVehicleId);
    if (!id || !Number.isSafeInteger(vehicleId) || vehicleId <= 0) return;
    try {
      const vehicles = await getCharacterVehicles(id);
      const vehicle = vehicles.find(entry => entry.id === vehicleId);
      if (!vehicle) {
        player.call('veloria:notify', ['error', 'Автомобиль не принадлежит вам']);
        return;
      }
      const position = vehiclePosition(vehicle.position);
      if (!position) {
        player.call('veloria:notify', ['info', 'Местоположение автомобиля пока неизвестно']);
        return;
      }
      player.call('veloria:tablet:vehicle:located', [position.x, position.y, vehicle.plate || vehicle.model]);
    } catch {
      player.call('veloria:notify', ['error', 'Не удалось определить местоположение автомобиля']);
    }
  });
}
