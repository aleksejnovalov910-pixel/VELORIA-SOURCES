import { getAdminLevel, logAdmin } from './index';

function accountId(player: PlayerMp): number | null {
  const value = Number(player.getVariable('accountId'));
  return Number.isInteger(value) && value > 0 ? value : null;
}

async function requireAdmin(player: PlayerMp, minimum = 1): Promise<number | null> {
  const id = accountId(player);
  if (!id) return null;
  const level = await getAdminLevel(id);
  if (level < minimum) {
    player.call('veloria:notify', ['error', 'Недостаточно прав администратора']);
    return null;
  }
  return level;
}

export function registerAdminModule(): void {
  mp.events.add('veloria:admin:status', async (player: PlayerMp) => {
    const id = accountId(player);
    if (!id) return player.call('veloria:admin:status', [JSON.stringify({ level: 0 })]);
    try {
      const level = await getAdminLevel(id);
      player.call('veloria:admin:status', [JSON.stringify({ level })]);
    } catch {
      player.call('veloria:admin:status', [JSON.stringify({ level: 0 })]);
    }
  });

  mp.events.add('veloria:admin:kick', async (player: PlayerMp, targetIdRaw: unknown, reasonRaw: unknown) => {
    const level = await requireAdmin(player, 1);
    if (!level) return;
    const targetId = Math.trunc(Number(targetIdRaw));
    const reason = String(reasonRaw ?? '').trim().slice(0, 120) || 'Без причины';
    if (!Number.isInteger(targetId) || targetId < 0) return;
    const target = mp.players.at(targetId);
    if (!target) return player.call('veloria:notify', ['error', 'Игрок не найден']);
    const adminAccountId = accountId(player)!;
    await logAdmin(adminAccountId, 'kick', `player:${targetId}`, { reason, targetName: target.name, level });
    target.kick(reason);
    player.call('veloria:notify', ['success', `Игрок ${target.name} отключён`]);
  });
}
