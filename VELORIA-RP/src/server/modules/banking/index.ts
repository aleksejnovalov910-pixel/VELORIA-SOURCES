import { changeMoney, getWallet, transferBank } from '../economy';

function getCharacterId(player: PlayerMp): number | null {
  const value = player.getVariable('veloria:characterId');
  return typeof value === 'number' ? value : null;
}

export function registerBankingModule(): void {
  mp.events.add('veloria:bank:balance', async (player: PlayerMp) => {
    const characterId = getCharacterId(player);
    if (!characterId) return;
    try {
      const wallet = await getWallet(characterId);
      player.call('veloria:bank:balance', [wallet.cash, wallet.bank]);
    } catch {
      player.call('veloria:notify', ['error', 'Не удалось получить баланс']);
    }
  });

  mp.events.add('veloria:bank:deposit', async (player: PlayerMp, rawAmount: number) => {
    const characterId = getCharacterId(player);
    const amount = Math.trunc(Number(rawAmount));
    if (!characterId || amount <= 0) return;
    try {
      await changeMoney(characterId, 'cash', -amount, 'bank_deposit');
      const wallet = await changeMoney(characterId, 'bank', amount, 'bank_deposit');
      player.call('veloria:bank:balance', [wallet.cash, wallet.bank]);
    } catch {
      player.call('veloria:notify', ['error', 'Недостаточно наличных']);
    }
  });

  mp.events.add('veloria:bank:withdraw', async (player: PlayerMp, rawAmount: number) => {
    const characterId = getCharacterId(player);
    const amount = Math.trunc(Number(rawAmount));
    if (!characterId || amount <= 0) return;
    try {
      await changeMoney(characterId, 'bank', -amount, 'bank_withdraw');
      const wallet = await changeMoney(characterId, 'cash', amount, 'bank_withdraw');
      player.call('veloria:bank:balance', [wallet.cash, wallet.bank]);
    } catch {
      player.call('veloria:notify', ['error', 'Недостаточно средств на счете']);
    }
  });

  mp.events.add('veloria:bank:transfer', async (player: PlayerMp, targetCharacterId: number, rawAmount: number) => {
    const characterId = getCharacterId(player);
    const amount = Math.trunc(Number(rawAmount));
    if (!characterId || amount <= 0 || characterId === Number(targetCharacterId)) return;
    try {
      await transferBank(characterId, Number(targetCharacterId), amount);
      const wallet = await getWallet(characterId);
      player.call('veloria:bank:balance', [wallet.cash, wallet.bank]);
      player.call('veloria:notify', ['success', `Переведено $${amount}`]);
    } catch {
      player.call('veloria:notify', ['error', 'Перевод не выполнен']);
    }
  });
}
