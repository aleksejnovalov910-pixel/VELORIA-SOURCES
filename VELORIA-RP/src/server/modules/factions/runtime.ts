import { getFactionByCharacter, getFactionMembers, getFactions } from './index';

function characterId(player: PlayerMp): number | null {
  const value = Number(player.getVariable('veloria:characterId'));
  return Number.isInteger(value) && value > 0 ? value : null;
}

function send(player: PlayerMp, event: string, payload: unknown) {
  player.call(event, [JSON.stringify(payload)]);
}

export function registerFactionsModule() {
  mp.events.add('veloria:factions:list', async (player: PlayerMp) => {
    try {
      send(player, 'veloria:factions:list:result', { ok: true, factions: await getFactions() });
    } catch {
      send(player, 'veloria:factions:list:result', { ok: false, error: 'FACTIONS_LOAD_FAILED' });
    }
  });

  mp.events.add('veloria:factions:mine', async (player: PlayerMp) => {
    const id = characterId(player);
    if (!id) return send(player, 'veloria:factions:mine:result', { ok: false, error: 'CHARACTER_REQUIRED' });
    try {
      const faction = await getFactionByCharacter(id);
      send(player, 'veloria:factions:mine:result', { ok: true, faction });
    } catch {
      send(player, 'veloria:factions:mine:result', { ok: false, error: 'FACTION_LOAD_FAILED' });
    }
  });

  mp.events.add('veloria:factions:members', async (player: PlayerMp, factionIdRaw: unknown) => {
    const factionId = Number(factionIdRaw);
    if (!Number.isInteger(factionId) || factionId <= 0) return send(player, 'veloria:factions:members:result', { ok: false, error: 'INVALID_FACTION' });
    try {
      send(player, 'veloria:factions:members:result', { ok: true, factionId, members: await getFactionMembers(factionId) });
    } catch {
      send(player, 'veloria:factions:members:result', { ok: false, error: 'FACTION_MEMBERS_LOAD_FAILED' });
    }
  });
}
