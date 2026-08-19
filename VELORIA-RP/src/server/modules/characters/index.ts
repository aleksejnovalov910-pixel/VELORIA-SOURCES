import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Events } from '../../../shared/events';
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

function accountId(player: PlayerMp): number | null {
  const value = player.getVariable('accountId');
  return typeof value === 'number' ? value : null;
}

function parseAppearance(json: string): CharacterAppearance {
  return JSON.parse(json) as CharacterAppearance;
}

async function sendList(player: PlayerMp) {
  const id = accountId(player);
  if (!id) return;
  const [rows] = await db().query<CharacterRow[]>(
    'SELECT id, slot, first_name, last_name, level, cash, bank, appearance_json FROM characters WHERE account_id = ? ORDER BY slot ASC',
    [id]
  );
  const characters: CharacterSummary[] = rows.map((row) => ({
    id: row.id, slot: row.slot, firstName: row.first_name, lastName: row.last_name,
    level: row.level, cash: row.cash, bank: row.bank, appearance: parseAppearance(row.appearance_json)
  }));
  player.call(Events.CharacterList, [JSON.stringify(characters)]);
}

async function createCharacter(player: PlayerMp, slot: number, firstNameRaw: string, lastNameRaw: string, appearanceJson: string) {
  const id = accountId(player);
  if (!id || ![1, 2, 3].includes(slot)) return;
  const firstName = firstNameRaw.trim();
  const lastName = lastNameRaw.trim();
  if (!/^[A-Za-zА-Яа-яЁё-]{2,24}$/.test(firstName) || !/^[A-Za-zА-Яа-яЁё-]{2,24}$/.test(lastName)) return;
  const [taken] = await db().query<RowDataPacket[]>('SELECT id FROM characters WHERE account_id = ? AND slot = ? LIMIT 1', [id, slot]);
  if (taken.length) return;
  const appearance = JSON.parse(appearanceJson) as CharacterAppearance;
  const [result] = await db().execute<ResultSetHeader>(
    `INSERT INTO characters
      (account_id, slot, first_name, last_name, level, cash, bank, appearance_json, pos_x, pos_y, pos_z, heading, created_at)
     VALUES (?, ?, ?, ?, 1, 5000, 10000, ?, -1037.72, -2737.88, 20.17, 330.0, NOW())`,
    [id, slot, firstName, lastName, JSON.stringify(appearance)]
  );
  logger.info(`Character created: ${firstName} ${lastName} #${result.insertId}`);
  await sendList(player);
}

async function selectCharacter(player: PlayerMp, characterId: number) {
  const id = accountId(player);
  if (!id) return;
  const [rows] = await db().query<RowDataPacket[]>(
    'SELECT id, pos_x, pos_y, pos_z, heading FROM characters WHERE id = ? AND account_id = ? LIMIT 1',
    [characterId, id]
  );
  const character = rows[0];
  if (!character) return;
  const activeCharacterId = Number(character.id);
  player.setVariable('characterId', activeCharacterId);
  player.setVariable('veloria:characterId', activeCharacterId);
  (player as any).veloriaCharacterId = activeCharacterId;
  player.position = new mp.Vector3(Number(character.pos_x), Number(character.pos_y), Number(character.pos_z));
  player.heading = Number(character.heading);
  player.dimension = 0;
  player.call(Events.CharacterSpawned, [activeCharacterId]);
}

export function registerCharacterModule() {
  mp.events.add(Events.CharacterListRequest, (player: PlayerMp) => void sendList(player).catch((e) => logger.error('Character list failed', e)));
  mp.events.add(Events.CharacterCreate, (player: PlayerMp, slot: number, first: string, last: string, appearance: string) =>
    void createCharacter(player, slot, first, last, appearance).catch((e) => logger.error('Character create failed', e))
  );
  mp.events.add(Events.CharacterSelect, (player: PlayerMp, characterId: number) =>
    void selectCharacter(player, characterId).catch((e) => logger.error('Character select failed', e))
  );
}