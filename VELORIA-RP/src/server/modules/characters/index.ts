import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Events } from '../../../shared/events';
import { VeloriaEvents } from '../../../shared/events/veloria';
import { CharacterAppearance, CharacterSummary } from '../../../shared/types/character';
import { db } from '../../database/mysql';
import { logger } from '../../core/logger';

interface CharacterRow extends RowDataPacket {
  id: number;
  slot: 1 | 2 | 3;
  first_name: string;
  last_name: string;
  level: number;
  cash: number;
  bank: number;
  appearance_json: string;
}

interface SpawnRow extends RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  cash: number;
  bank: number;
  appearance_json: string;
  pos_x: number;
  pos_y: number;
  pos_z: number;
  heading: number;
}

const NAME_RE = /^[A-Za-zА-Яа-яЁё-]{2,24}$/;
const VALID_SLOTS = new Set([1, 2, 3]);

function notify(player: PlayerMp, type: 'success' | 'error' | 'info', text: string) {
  player.call(VeloriaEvents.Notify, [type, text]);
}

function accountId(player: PlayerMp): number | null {
  const value = player.getVariable('accountId');
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0 ? value : null;
}

function authenticatedAccountId(player: PlayerMp): number | null {
  if (player.getVariable('veloria:authenticated') !== true) return null;
  return accountId(player);
}

function finite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function validOverlay(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const overlay = value as Record<string, unknown>;
  return finite(overlay.index) && finite(overlay.opacity) && overlay.opacity >= 0 && overlay.opacity <= 1;
}

function validAppearance(value: unknown): value is CharacterAppearance {
  if (!value || typeof value !== 'object') return false;
  const a = value as Partial<CharacterAppearance>;
  if (a.gender !== 'male' && a.gender !== 'female') return false;

  const parents = a.parents as CharacterAppearance['parents'] | undefined;
  if (!parents || !finite(parents.mother) || !finite(parents.father) || !finite(parents.shapeMix) || !finite(parents.skinMix)) return false;
  if (parents.shapeMix < 0 || parents.shapeMix > 1 || parents.skinMix < 0 || parents.skinMix > 1) return false;

  const hair = a.hair as CharacterAppearance['hair'] | undefined;
  if (!hair || !finite(hair.style) || !finite(hair.color) || !finite(hair.highlight)) return false;
  if (!finite(a.eyeColor)) return false;
  if (!a.faceFeatures || typeof a.faceFeatures !== 'object' || Array.isArray(a.faceFeatures)) return false;
  for (const value of Object.values(a.faceFeatures)) if (!finite(value) || value < -1 || value > 1) return false;

  if (!validOverlay(a.eyebrows) || !validOverlay(a.beard)) return false;
  if (a.makeup !== undefined && !validOverlay(a.makeup)) return false;
  if (a.blemishes !== undefined && !validOverlay(a.blemishes)) return false;
  if (a.ageing !== undefined && !validOverlay(a.ageing)) return false;
  if (a.complexion !== undefined && !validOverlay(a.complexion)) return false;
  if (a.sunDamage !== undefined && !validOverlay(a.sunDamage)) return false;
  if (a.lipstick !== undefined && !validOverlay(a.lipstick)) return false;
  if (a.chestHair !== undefined && !validOverlay(a.chestHair)) return false;
  if (a.clothing !== undefined && (!a.clothing || typeof a.clothing !== 'object' || Array.isArray(a.clothing))) return false;
  return true;
}

function defaultAppearance(): CharacterAppearance {
  const emptyOverlay = { index: 0, opacity: 0 };
  return {
    gender: 'male',
    parents: { mother: 21, father: 0, shapeMix: 0.5, skinMix: 0.5 },
    faceFeatures: {},
    hair: { style: 0, color: 0, highlight: 0 },
    eyeColor: 0,
    eyebrows: { index: 0, opacity: 1, color: 0 },
    beard: emptyOverlay,
    makeup: emptyOverlay,
    blemishes: emptyOverlay,
    ageing: emptyOverlay,
    complexion: emptyOverlay,
    sunDamage: emptyOverlay,
    lipstick: emptyOverlay,
    chestHair: emptyOverlay,
    clothing: {}
  };
}

function parseAppearance(json: string): CharacterAppearance | null {
  try {
    const parsed = JSON.parse(json) as unknown;
    return validAppearance(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function sendCharacterList(player: PlayerMp) {
  const id = authenticatedAccountId(player);
  if (!id) return;

  const [rows] = await db().query<CharacterRow[]>(
    'SELECT id, slot, first_name, last_name, level, cash, bank, appearance_json FROM characters WHERE account_id = ? ORDER BY slot ASC',
    [id]
  );

  const characters: CharacterSummary[] = rows.slice(0, 3).map((row) => ({
    id: Number(row.id),
    slot: row.slot,
    firstName: row.first_name,
    lastName: row.last_name,
    level: Number(row.level),
    cash: Number(row.cash),
    bank: Number(row.bank),
    appearance: parseAppearance(row.appearance_json) ?? defaultAppearance()
  }));

  player.call(Events.CharacterList, [JSON.stringify(characters)]);
}

async function createCharacter(player: PlayerMp, slotRaw: number, firstNameRaw: string, lastNameRaw: string, appearanceJsonRaw: string) {
  const id = authenticatedAccountId(player);
  if (!id) return notify(player, 'error', 'Сессия авторизации истекла. Войдите снова.');

  const slot = Number(slotRaw);
  if (!Number.isInteger(slot) || !VALID_SLOTS.has(slot)) return notify(player, 'error', 'Недопустимый слот персонажа.');

  const firstName = String(firstNameRaw ?? '').trim();
  const lastName = String(lastNameRaw ?? '').trim();
  if (!NAME_RE.test(firstName) || !NAME_RE.test(lastName)) {
    return notify(player, 'error', 'Имя и фамилия: 2–24 буквы, допускается дефис.');
  }

  const appearanceJson = String(appearanceJsonRaw ?? '');
  if (!appearanceJson || appearanceJson.length > 8192) return notify(player, 'error', 'Некорректные данные внешности.');
  const appearance = parseAppearance(appearanceJson);
  if (!appearance) return notify(player, 'error', 'Проверьте параметры внешности персонажа.');

  const [existing] = await db().query<RowDataPacket[]>(
    `SELECT id, slot, first_name, last_name
       FROM characters
      WHERE (account_id = ? AND slot = ?)
         OR (LOWER(first_name) = LOWER(?) AND LOWER(last_name) = LOWER(?))
      LIMIT 2`,
    [id, slot, firstName, lastName]
  );

  if (existing.some((row) => Number(row.slot) === slot && Number(row.id) > 0)) {
    await sendCharacterList(player);
    return notify(player, 'error', 'Этот слот уже занят.');
  }
  if (existing.some((row) => String(row.first_name).toLowerCase() === firstName.toLowerCase() && String(row.last_name).toLowerCase() === lastName.toLowerCase())) {
    return notify(player, 'error', 'Персонаж с таким именем уже существует.');
  }

  const [countRows] = await db().query<RowDataPacket[]>('SELECT COUNT(*) AS total FROM characters WHERE account_id = ?', [id]);
  if (Number(countRows[0]?.total ?? 0) >= 3) {
    await sendCharacterList(player);
    return notify(player, 'error', 'На аккаунте уже создано 3 персонажа.');
  }

  const [result] = await db().execute<ResultSetHeader>(
    `INSERT INTO characters
      (account_id, slot, first_name, last_name, level, cash, bank, appearance_json, pos_x, pos_y, pos_z, heading, created_at)
     VALUES (?, ?, ?, ?, 1, 5000, 10000, ?, -1037.72, -2737.88, 20.17, 330.0, NOW())`,
    [id, slot, firstName, lastName, JSON.stringify(appearance)]
  );

  logger.info(`Character created: ${firstName} ${lastName} #${result.insertId} account=${id} slot=${slot}`);
  notify(player, 'success', 'Персонаж создан.');
  await sendCharacterList(player);
}

async function selectCharacter(player: PlayerMp, characterIdRaw: number) {
  const id = authenticatedAccountId(player);
  if (!id) return notify(player, 'error', 'Сначала войдите в аккаунт.');

  const characterId = Number(characterIdRaw);
  if (!Number.isSafeInteger(characterId) || characterId <= 0) return notify(player, 'error', 'Некорректный персонаж.');

  const [rows] = await db().query<SpawnRow[]>(
    `SELECT id, first_name, last_name, cash, bank, appearance_json, pos_x, pos_y, pos_z, heading
       FROM characters
      WHERE id = ? AND account_id = ?
      LIMIT 1`,
    [characterId, id]
  );
  const character = rows[0];
  if (!character) {
    await sendCharacterList(player);
    return notify(player, 'error', 'Персонаж не найден или не принадлежит этому аккаунту.');
  }

  const position = [Number(character.pos_x), Number(character.pos_y), Number(character.pos_z)];
  const heading = Number(character.heading);
  if (!position.every(Number.isFinite) || !Number.isFinite(heading)) {
    logger.error(`Invalid spawn data for character #${characterId}`);
    return notify(player, 'error', 'Ошибка точки спавна персонажа.');
  }

  player.setVariable('characterId', Number(character.id));
  player.setVariable('veloria:characterId', Number(character.id));
  player.setVariable('veloria:characterName', `${character.first_name} ${character.last_name}`);
  player.setVariable('veloria:cash', Number(character.cash));
  player.setVariable('veloria:bank', Number(character.bank));
  (player as any).veloriaCharacterId = Number(character.id);

  player.dimension = 0;
  player.position = new mp.Vector3(position[0], position[1], position[2]);
  player.heading = heading;
  player.call(Events.CharacterSpawned, [Number(character.id), character.appearance_json]);
  logger.info(`Character selected: #${character.id} ${character.first_name} ${character.last_name} player=${player.name}`);
}

export function registerCharacterModule() {
  mp.events.add(Events.CharacterListRequest, (player: PlayerMp) => {
    void sendCharacterList(player).catch((error) => {
      logger.error('Character list failed', error);
      notify(player, 'error', 'Не удалось загрузить список персонажей.');
    });
  });

  mp.events.add(Events.CharacterCreate, (player: PlayerMp, slot: number, first: string, last: string, appearance: string) => {
    void createCharacter(player, slot, first, last, appearance).catch((error) => {
      logger.error('Character create failed', error);
      notify(player, 'error', 'Не удалось создать персонажа.');
    });
  });

  mp.events.add(Events.CharacterSelect, (player: PlayerMp, characterId: number) => {
    void selectCharacter(player, characterId).catch((error) => {
      logger.error('Character select failed', error);
      notify(player, 'error', 'Не удалось загрузить персонажа.');
    });
  });
}
