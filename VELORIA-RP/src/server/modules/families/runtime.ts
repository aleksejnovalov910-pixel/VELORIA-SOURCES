import { getFamilyByCharacter, getFamilyMembers } from './index';

function characterId(player: PlayerMp): number | null {
  const value = Number(player.getVariable('veloria:characterId'));
  return Number.isInteger(value) && value > 0 ? value : null;
}

function send(player: PlayerMp, event: string, payload: unknown) {
  player.call(event, [JSON.stringify(payload)]);
}

export function registerFamiliesModule() {
  mp.events.add('veloria:families:mine', async (player: PlayerMp) => {
    const id = characterId(player);
    if (!id) return send(player, 'veloria:families:mine:result', { ok: false, error: 'CHARACTER_REQUIRED' });
    try {
      const family = await getFamilyByCharacter(id);
      send(player, 'veloria:families:mine:result', { ok: true, family });
    } catch {
      send(player, 'veloria:families:mine:result', { ok: false, error: 'FAMILY_LOAD_FAILED' });
    }
  });

  mp.events.add('veloria:families:members', async (player: PlayerMp, familyIdRaw: unknown) => {
    const familyId = Number(familyIdRaw);
    if (!Number.isInteger(familyId) || familyId <= 0) return send(player, 'veloria:families:members:result', { ok: false, error: 'INVALID_FAMILY' });
    try {
      send(player, 'veloria:families:members:result', { ok: true, familyId, members: await getFamilyMembers(familyId) });
    } catch {
      send(player, 'veloria:families:members:result', { ok: false, error: 'FAMILY_MEMBERS_LOAD_FAILED' });
    }
  });
}
