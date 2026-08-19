import bcrypt from 'bcryptjs';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Events } from '../../../shared/events';
import { db } from '../../database/mysql';
import { logger } from '../../core/logger';
import { sendCharacterList } from '../characters';

interface AccountRow extends RowDataPacket {
  id: number;
  username: string;
  password_hash: string;
}

function setAuthenticated(player: PlayerMp, accountId: number) {
  player.setVariable('accountId', accountId);
  player.setVariable('veloria:authenticated', true);
  player.setVariable('characterId', null);
  player.setVariable('veloria:characterId', null);
  (player as any).veloriaCharacterId = null;
}

async function register(player: PlayerMp, usernameRaw: string, password: string) {
  if (player.getVariable('veloria:authenticated') === true) return;
  const username = String(usernameRaw ?? '').trim().toLowerCase();
  password = String(password ?? '');
  if (username.length < 3 || username.length > 64 || password.length < 6 || password.length > 128) {
    return player.call(Events.AuthResult, [false, 'Логин 3–64 символа, пароль 6–128 символов']);
  }

  const [exists] = await db().query<AccountRow[]>('SELECT id, username, password_hash FROM accounts WHERE username = ? LIMIT 1', [username]);
  if (exists.length) return player.call(Events.AuthResult, [false, 'Аккаунт уже существует']);

  const passwordHash = await bcrypt.hash(password, 12);
  const [result] = await db().execute<ResultSetHeader>('INSERT INTO accounts (username, password_hash, created_at, last_login_at) VALUES (?, ?, NOW(), NOW())', [username, passwordHash]);

  setAuthenticated(player, Number(result.insertId));
  player.call(Events.AuthResult, [true, 'REGISTERED']);
  await sendCharacterList(player);
  logger.info(`Account registered: ${username} #${result.insertId}`);
}

async function login(player: PlayerMp, usernameRaw: string, password: string) {
  if (player.getVariable('veloria:authenticated') === true) return;
  const username = String(usernameRaw ?? '').trim().toLowerCase();
  password = String(password ?? '');
  if (!username || !password) return player.call(Events.AuthResult, [false, 'Введите логин и пароль']);

  const [rows] = await db().query<AccountRow[]>('SELECT id, username, password_hash FROM accounts WHERE username = ? LIMIT 1', [username]);
  const account = rows[0];
  if (!account || !(await bcrypt.compare(password, account.password_hash))) {
    return player.call(Events.AuthResult, [false, 'Неверный логин или пароль']);
  }

  setAuthenticated(player, account.id);
  await db().execute('UPDATE accounts SET last_login_at=NOW() WHERE id=?', [account.id]);
  player.call(Events.AuthResult, [true, 'LOGGED_IN']);
  await sendCharacterList(player);
  logger.info(`Account logged in: ${username} #${account.id}`);
}

export function registerAccountModule() {
  mp.events.add(Events.AuthRegister, (player: PlayerMp, username: string, password: string) => {
    void register(player, username, password).catch((error) => {
      logger.error('Registration failed', error);
      player.call(Events.AuthResult, [false, 'Ошибка сервера']);
    });
  });

  mp.events.add(Events.AuthLogin, (player: PlayerMp, username: string, password: string) => {
    void login(player, username, password).catch((error) => {
      logger.error('Login failed', error);
      player.call(Events.AuthResult, [false, 'Ошибка сервера']);
    });
  });
}
