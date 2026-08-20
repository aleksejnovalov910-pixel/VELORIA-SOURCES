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

type AuthRate = { windowStartedAt: number; count: number; blockedUntil: number };
const authRate = new Map<number, AuthRate>();
const authInFlight = new Set<number>();
const AUTH_WINDOW_MS = 10_000;
const AUTH_MAX_ATTEMPTS = 6;
const AUTH_BLOCK_MS = 30_000;

function authResult(player: PlayerMp, success: boolean, message: string) {
  player.call(Events.AuthResult, [success, message]);
}

function allowAttempt(player: PlayerMp): boolean {
  const now = Date.now();
  const key = player.id;
  let state = authRate.get(key);
  if (!state || now - state.windowStartedAt > AUTH_WINDOW_MS) {
    state = { windowStartedAt: now, count: 0, blockedUntil: 0 };
  }

  if (state.blockedUntil > now) {
    authRate.set(key, state);
    authResult(player, false, `Слишком много попыток. Подождите ${Math.ceil((state.blockedUntil - now) / 1000)} сек.`);
    return false;
  }

  state.count += 1;
  if (state.count > AUTH_MAX_ATTEMPTS) {
    state.blockedUntil = now + AUTH_BLOCK_MS;
    authRate.set(key, state);
    authResult(player, false, 'Слишком много попыток входа. Повторите через 30 секунд.');
    return false;
  }

  authRate.set(key, state);
  return true;
}

function resetRate(player: PlayerMp) {
  authRate.delete(player.id);
}

function setAuthenticated(player: PlayerMp, accountId: number) {
  player.setVariable('accountId', accountId);
  player.setVariable('veloria:authenticated', true);
  player.setVariable('characterId', null);
  player.setVariable('veloria:characterId', null);
  (player as any).veloriaCharacterId = null;
  resetRate(player);
}

async function register(player: PlayerMp, usernameRaw: string, password: string) {
  if (player.getVariable('veloria:authenticated') === true) return;
  const username = String(usernameRaw ?? '').trim().toLowerCase();
  password = String(password ?? '');
  if (username.length < 3 || username.length > 64 || password.length < 6 || password.length > 128) {
    return authResult(player, false, 'Логин 3–64 символа, пароль 6–128 символов');
  }

  const [exists] = await db().query<AccountRow[]>('SELECT id, username, password_hash FROM accounts WHERE username = ? LIMIT 1', [username]);
  if (exists.length) return authResult(player, false, 'Аккаунт уже существует');

  const passwordHash = await bcrypt.hash(password, 12);
  const [result] = await db().execute<ResultSetHeader>(
    'INSERT INTO accounts (username, password_hash, created_at, last_login_at) VALUES (?, ?, NOW(), NOW())',
    [username, passwordHash]
  );

  setAuthenticated(player, Number(result.insertId));
  authResult(player, true, 'REGISTERED');
  await sendCharacterList(player);
  logger.info(`Account registered: ${username} #${result.insertId}`);
}

async function login(player: PlayerMp, usernameRaw: string, password: string) {
  if (player.getVariable('veloria:authenticated') === true) return;
  const username = String(usernameRaw ?? '').trim().toLowerCase();
  password = String(password ?? '');
  if (!username || !password) return authResult(player, false, 'Введите логин и пароль');

  const [rows] = await db().query<AccountRow[]>('SELECT id, username, password_hash FROM accounts WHERE username = ? LIMIT 1', [username]);
  const account = rows[0];
  if (!account || !(await bcrypt.compare(password, account.password_hash))) {
    return authResult(player, false, 'Неверный логин или пароль');
  }

  setAuthenticated(player, account.id);
  await db().execute('UPDATE accounts SET last_login_at=NOW() WHERE id=?', [account.id]);
  authResult(player, true, 'LOGGED_IN');
  await sendCharacterList(player);
  logger.info(`Account logged in: ${username} #${account.id}`);
}

function executeAuth(player: PlayerMp, action: () => Promise<void>, label: string) {
  if (!allowAttempt(player)) return;
  if (authInFlight.has(player.id)) {
    authResult(player, false, 'Предыдущий запрос ещё обрабатывается');
    return;
  }

  authInFlight.add(player.id);
  void action()
    .catch((error) => {
      logger.error(`${label} failed`, error);
      authResult(player, false, 'Ошибка сервера');
    })
    .finally(() => authInFlight.delete(player.id));
}

export function registerAccountModule() {
  mp.events.add(Events.AuthRegister, (player: PlayerMp, username: string, password: string) => {
    executeAuth(player, () => register(player, username, password), 'Registration');
  });

  mp.events.add(Events.AuthLogin, (player: PlayerMp, username: string, password: string) => {
    executeAuth(player, () => login(player, username, password), 'Login');
  });

  mp.events.add('playerQuit', (player: PlayerMp) => {
    authRate.delete(player.id);
    authInFlight.delete(player.id);
  });
}
