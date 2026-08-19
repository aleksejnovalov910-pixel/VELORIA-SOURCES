import bcrypt from 'bcryptjs';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Events } from '../../../shared/events';
import { db } from '../../database/mysql';
import { logger } from '../../core/logger';

interface AccountRow extends RowDataPacket {
  id: number;
  username: string;
  password_hash: string;
}

async function register(player: PlayerMp, usernameRaw: string, password: string) {
  const username = usernameRaw.trim().toLowerCase();
  if (username.length < 3 || password.length < 6) {
    return player.call(Events.AuthResult, [false, 'Логин от 3 символов, пароль от 6 символов']);
  }

  const [exists] = await db().query<AccountRow[]>('SELECT id, username, password_hash FROM accounts WHERE username = ? LIMIT 1', [username]);
  if (exists.length) return player.call(Events.AuthResult, [false, 'Аккаунт уже существует']);

  const passwordHash = await bcrypt.hash(password, 12);
  const [result] = await db().execute<ResultSetHeader>(
    'INSERT INTO accounts (username, password_hash, created_at) VALUES (?, ?, NOW())',
    [username, passwordHash]
  );

  player.setVariable('accountId', result.insertId);
  player.call(Events.AuthResult, [true, 'REGISTERED']);
  logger.info(`Account registered: ${username} #${result.insertId}`);
}

async function login(player: PlayerMp, usernameRaw: string, password: string) {
  const username = usernameRaw.trim().toLowerCase();
  const [rows] = await db().query<AccountRow[]>('SELECT id, username, password_hash FROM accounts WHERE username = ? LIMIT 1', [username]);
  const account = rows[0];
  if (!account || !(await bcrypt.compare(password, account.password_hash))) {
    return player.call(Events.AuthResult, [false, 'Неверный логин или пароль']);
  }

  player.setVariable('accountId', account.id);
  player.call(Events.AuthResult, [true, 'LOGGED_IN']);
  player.call(Events.CharacterListRequest);
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
