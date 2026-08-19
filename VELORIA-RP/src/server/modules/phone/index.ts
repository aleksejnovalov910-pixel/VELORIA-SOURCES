import { mysql } from '../../core/mysql';

function getCharacterId(player: PlayerMp): number | null {
  const value = player.getVariable('veloria:characterId');
  return typeof value === 'number' ? value : null;
}

async function ensurePhone(characterId: number): Promise<string> {
  const [rows] = await mysql.query('SELECT phone_number FROM phone_numbers WHERE character_id=? LIMIT 1', [characterId]);
  const existing = (rows as any[])[0];
  if (existing) return String(existing.phone_number);

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const number = `555${Math.floor(1000000 + Math.random() * 9000000)}`;
    try {
      await mysql.query('INSERT INTO phone_numbers(character_id,phone_number) VALUES(?,?)', [characterId, number]);
      return number;
    } catch {
      // Retry if the generated number already exists.
    }
  }
  throw new Error('Unable to allocate phone number');
}

export function registerPhoneModule(): void {
  mp.events.add('veloria:phone:open', async (player: PlayerMp) => {
    const characterId = getCharacterId(player);
    if (!characterId) return;
    try {
      const number = await ensurePhone(characterId);
      const [contacts] = await mysql.query('SELECT id,phone_number,display_name FROM phone_contacts WHERE owner_character_id=? ORDER BY display_name', [characterId]);
      const [messages] = await mysql.query('SELECT id,sender_number,receiver_number,body,is_read,created_at FROM phone_messages WHERE sender_number=? OR receiver_number=? ORDER BY id DESC LIMIT 100', [number, number]);
      player.call('veloria:phone:data', [JSON.stringify({ number, contacts, messages })]);
    } catch {
      player.call('veloria:notify', ['error', 'Телефон временно недоступен']);
    }
  });

  mp.events.add('veloria:phone:contact:add', async (player: PlayerMp, rawNumber: string, rawName: string) => {
    const characterId = getCharacterId(player);
    if (!characterId) return;
    const number = String(rawNumber ?? '').replace(/[^0-9+]/g, '').slice(0, 16);
    const name = String(rawName ?? '').trim().slice(0, 64);
    if (!number || !name) return;
    await mysql.query('INSERT INTO phone_contacts(owner_character_id,phone_number,display_name) VALUES(?,?,?)', [characterId, number, name]);
    player.call('veloria:notify', ['success', 'Контакт добавлен']);
  });

  mp.events.add('veloria:phone:message:send', async (player: PlayerMp, receiverRaw: string, bodyRaw: string) => {
    const characterId = getCharacterId(player);
    if (!characterId) return;
    const receiver = String(receiverRaw ?? '').replace(/[^0-9+]/g, '').slice(0, 16);
    const body = String(bodyRaw ?? '').trim().slice(0, 512);
    if (!receiver || !body) return;
    try {
      const sender = await ensurePhone(characterId);
      await mysql.query('INSERT INTO phone_messages(sender_number,receiver_number,body) VALUES(?,?,?)', [sender, receiver, body]);
      player.call('veloria:phone:message:sent', [receiver, body]);
    } catch {
      player.call('veloria:notify', ['error', 'Сообщение не отправлено']);
    }
  });
}
