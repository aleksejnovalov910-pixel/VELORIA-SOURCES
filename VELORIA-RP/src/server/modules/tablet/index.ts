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
}
