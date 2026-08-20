import { mysql } from '../../core/mysql';
import { createFamily, getFamilyByCharacter, getFamilyMembers, removeFromFamily, setFamilyRank } from './index';

function characterId(player: PlayerMp): number | null {
  const value = Number(player.getVariable('veloria:characterId'));
  return Number.isInteger(value) && value > 0 ? value : null;
}

function send(player: PlayerMp, event: string, payload: unknown) {
  player.call(event, [JSON.stringify(payload)]);
}

function notify(player: PlayerMp, type: 'success' | 'error' | 'info', text: string) {
  player.call('veloria:notify', [type, text]);
}

function cleanName(raw: unknown): string {
  return String(raw ?? '').replace(/\s+/g, ' ').trim().slice(0, 64);
}

async function familyMembership(id: number) {
  const [rows] = await mysql.query(
    `SELECT f.id AS family_id,f.name,f.owner_character_id,fm.\`rank\` AS member_rank
       FROM family_members fm
       JOIN families f ON f.id=fm.family_id
      WHERE fm.character_id=? LIMIT 1`,
    [id]
  );
  return (rows as any[])[0] ?? null;
}

function onlinePlayerByCharacterId(targetCharacterId: number): PlayerMp | null {
  let found: PlayerMp | null = null;
  mp.players.forEach(player => {
    if (found) return;
    const id = Number(player.getVariable('veloria:characterId'));
    if (id === targetCharacterId) found = player;
  });
  return found;
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
      const mine = characterId(player);
      if (!mine) return send(player, 'veloria:families:members:result', { ok: false, error: 'CHARACTER_REQUIRED' });
      const membership = await familyMembership(mine);
      if (!membership || Number(membership.family_id) !== familyId) {
        return send(player, 'veloria:families:members:result', { ok: false, error: 'NOT_FAMILY_MEMBER' });
      }
      send(player, 'veloria:families:members:result', { ok: true, familyId, members: await getFamilyMembers(familyId) });
    } catch {
      send(player, 'veloria:families:members:result', { ok: false, error: 'FAMILY_MEMBERS_LOAD_FAILED' });
    }
  });

  mp.events.add('veloria:families:create', async (player: PlayerMp, nameRaw: unknown) => {
    const id = characterId(player);
    const name = cleanName(nameRaw);
    if (!id) return notify(player, 'error', 'Сначала выберите персонажа');
    if (name.length < 3) return notify(player, 'error', 'Название семьи должно быть не короче 3 символов');
    try {
      if (await familyMembership(id)) return notify(player, 'error', 'Вы уже состоите в семье');
      const familyId = await createFamily(id, name);
      notify(player, 'success', `Семья ${name} создана`);
      send(player, 'veloria:families:create:result', { ok: true, familyId, name });
    } catch (error) {
      const code = (error as any)?.code;
      notify(player, 'error', code === 'ER_DUP_ENTRY' ? 'Такое название семьи уже занято' : 'Не удалось создать семью');
    }
  });

  mp.events.add('veloria:families:invite', async (player: PlayerMp, targetCharacterIdRaw: unknown) => {
    const inviterId = characterId(player);
    const targetCharacterId = Math.trunc(Number(targetCharacterIdRaw));
    if (!inviterId || !Number.isSafeInteger(targetCharacterId) || targetCharacterId <= 0 || targetCharacterId === inviterId) return;
    try {
      const membership = await familyMembership(inviterId);
      if (!membership || Number(membership.member_rank) < 8) return notify(player, 'error', 'Недостаточно прав для приглашения');
      if (await familyMembership(targetCharacterId)) return notify(player, 'error', 'Игрок уже состоит в семье');
      const [targetRows] = await mysql.query('SELECT id,first_name,last_name FROM characters WHERE id=? LIMIT 1', [targetCharacterId]);
      const target = (targetRows as any[])[0];
      if (!target) return notify(player, 'error', 'Персонаж не найден');

      await mysql.query(
        `INSERT INTO family_invites(family_id,inviter_character_id,target_character_id,created_at,expires_at)
         VALUES(?,?,?,NOW(),DATE_ADD(NOW(),INTERVAL 10 MINUTE))
         ON DUPLICATE KEY UPDATE family_id=VALUES(family_id),inviter_character_id=VALUES(inviter_character_id),created_at=NOW(),expires_at=VALUES(expires_at)`,
        [Number(membership.family_id), inviterId, targetCharacterId]
      );
      notify(player, 'success', `Приглашение отправлено: ${target.first_name} ${target.last_name}`);
      const targetPlayer = onlinePlayerByCharacterId(targetCharacterId);
      if (targetPlayer) {
        send(targetPlayer, 'veloria:families:invite:received', {
          familyId: Number(membership.family_id),
          familyName: String(membership.name),
          inviterCharacterId: inviterId,
          expiresInSeconds: 600
        });
        notify(targetPlayer, 'info', `Вас пригласили в семью ${membership.name}`);
      }
    } catch {
      notify(player, 'error', 'Не удалось отправить приглашение');
    }
  });

  mp.events.add('veloria:families:invite:respond', async (player: PlayerMp, acceptRaw: unknown) => {
    const id = characterId(player);
    if (!id) return;
    const accept = acceptRaw === true || acceptRaw === 1 || String(acceptRaw) === '1' || String(acceptRaw).toLowerCase() === 'true';
    const conn = await mysql.getConnection();
    try {
      await conn.beginTransaction();
      const [rows] = await conn.query(
        `SELECT id,family_id,expires_at FROM family_invites
          WHERE target_character_id=? FOR UPDATE`,
        [id]
      );
      const invite = (rows as any[])[0];
      if (!invite) throw new Error('INVITE_NOT_FOUND');
      if (new Date(invite.expires_at).getTime() <= Date.now()) {
        await conn.query('DELETE FROM family_invites WHERE id=?', [Number(invite.id)]);
        throw new Error('INVITE_EXPIRED');
      }
      const [memberRows] = await conn.query('SELECT family_id FROM family_members WHERE character_id=? LIMIT 1 FOR UPDATE', [id]);
      if ((memberRows as any[])[0]) throw new Error('ALREADY_MEMBER');
      if (accept) {
        await conn.query('INSERT INTO family_members(family_id,character_id,`rank`) VALUES(?,?,1)', [Number(invite.family_id), id]);
      }
      await conn.query('DELETE FROM family_invites WHERE id=?', [Number(invite.id)]);
      await conn.commit();
      notify(player, 'success', accept ? 'Вы вступили в семью' : 'Приглашение отклонено');
      send(player, 'veloria:families:invite:result', { ok: true, accepted: accept, familyId: Number(invite.family_id) });
    } catch (error) {
      await conn.rollback();
      const code = error instanceof Error ? error.message : '';
      const text = code === 'INVITE_EXPIRED' ? 'Приглашение истекло' : code === 'ALREADY_MEMBER' ? 'Вы уже состоите в семье' : 'Активное приглашение не найдено';
      notify(player, 'error', text);
    } finally {
      conn.release();
    }
  });

  mp.events.add('veloria:families:kick', async (player: PlayerMp, targetCharacterIdRaw: unknown) => {
    const actorId = characterId(player);
    const targetId = Math.trunc(Number(targetCharacterIdRaw));
    if (!actorId || !Number.isSafeInteger(targetId) || targetId <= 0 || targetId === actorId) return;
    try {
      const actor = await familyMembership(actorId);
      const target = await familyMembership(targetId);
      if (!actor || !target || Number(actor.family_id) !== Number(target.family_id)) return notify(player, 'error', 'Игрок не состоит в вашей семье');
      if (Number(actor.member_rank) < 8 || Number(target.member_rank) >= Number(actor.member_rank)) return notify(player, 'error', 'Недостаточно прав');
      await removeFromFamily(Number(actor.family_id), targetId);
      notify(player, 'success', 'Участник исключён из семьи');
      const targetPlayer = onlinePlayerByCharacterId(targetId);
      if (targetPlayer) notify(targetPlayer, 'info', 'Вы были исключены из семьи');
    } catch {
      notify(player, 'error', 'Не удалось исключить участника');
    }
  });

  mp.events.add('veloria:families:rank', async (player: PlayerMp, targetCharacterIdRaw: unknown, rankRaw: unknown) => {
    const actorId = characterId(player);
    const targetId = Math.trunc(Number(targetCharacterIdRaw));
    const rank = Math.max(1, Math.min(9, Math.trunc(Number(rankRaw))));
    if (!actorId || !Number.isSafeInteger(targetId) || targetId <= 0 || targetId === actorId) return;
    try {
      const actor = await familyMembership(actorId);
      const target = await familyMembership(targetId);
      if (!actor || !target || Number(actor.family_id) !== Number(target.family_id)) return notify(player, 'error', 'Игрок не состоит в вашей семье');
      const isOwner = Number(actor.owner_character_id) === actorId;
      if (!isOwner && Number(actor.member_rank) < 9) return notify(player, 'error', 'Недостаточно прав');
      if (!isOwner && rank >= Number(actor.member_rank)) return notify(player, 'error', 'Нельзя выдать ранг выше или равный своему');
      await setFamilyRank(Number(actor.family_id), targetId, rank);
      notify(player, 'success', `Ранг участника изменён на ${rank}`);
    } catch {
      notify(player, 'error', 'Не удалось изменить ранг');
    }
  });
}
