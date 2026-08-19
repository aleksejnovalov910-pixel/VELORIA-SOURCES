import type { PoolConnection } from 'mysql2/promise';
import { mysql } from '../../core/mysql';
import { getWallet, transferBank } from '../economy';

export async function changeBalance(characterId:number,account:'cash'|'bank',delta:number,reason:string,reference='',connection?:PoolConnection){
  const conn=connection??await mysql.getConnection();
  const ownsConnection=!connection;
  try{
    if(ownsConnection)await conn.beginTransaction();
    const[rows]=await conn.query(`SELECT cash,bank FROM characters WHERE id=? FOR UPDATE`,[characterId]);
    const row=(rows as any[])[0];
    if(!row)throw new Error('CHARACTER_NOT_FOUND');
    const current=Number(row[account]??0),next=current+Math.trunc(delta);
    if(next<0)throw new Error('INSUFFICIENT_FUNDS');
    await conn.query(`UPDATE characters SET ${account}=? WHERE id=?`,[next,characterId]);
    await conn.query('INSERT INTO economy_transactions(character_id,account_type,amount,balance_after,reason) VALUES(?,?,?,?,?)',[characterId,account,Math.trunc(delta),next,reference?`${reason}:${reference}`.slice(0,120):reason.slice(0,120)]);
    if(ownsConnection)await conn.commit();
    return account==='cash'?{cash:next,bank:Number(row.bank??0)}:{cash:Number(row.cash??0),bank:next};
  }catch(error){if(ownsConnection)await conn.rollback();throw error}finally{if(ownsConnection)conn.release()}
}

async function moveBetweenAccounts(characterId:number,from:'cash'|'bank',to:'cash'|'bank',amount:number,reason:string){
  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    await changeBalance(characterId,from,-amount,reason,'debit',conn);
    const wallet=await changeBalance(characterId,to,amount,reason,'credit',conn);
    await conn.commit();
    return wallet;
  }catch(error){
    await conn.rollback();
    throw error;
  }finally{
    conn.release();
  }
}

function getCharacterId(player: PlayerMp): number | null {
  const value = player.getVariable('veloria:characterId');
  return typeof value === 'number' ? value : null;
}

export function registerBankingModule(): void {
  mp.events.add('veloria:bank:balance', async (player: PlayerMp) => {
    const characterId = getCharacterId(player); if (!characterId) return;
    try { const wallet = await getWallet(characterId); player.call('veloria:bank:balance', [wallet.cash, wallet.bank]); }
    catch { player.call('veloria:notify', ['error', 'Не удалось получить баланс']); }
  });
  mp.events.add('veloria:bank:deposit', async (player: PlayerMp, rawAmount: number) => {
    const characterId=getCharacterId(player),amount=Math.trunc(Number(rawAmount)); if(!characterId||amount<=0)return;
    try{const wallet=await moveBetweenAccounts(characterId,'cash','bank',amount,'bank_deposit');player.call('veloria:bank:balance',[wallet.cash,wallet.bank]);}catch{player.call('veloria:notify',['error','Недостаточно наличных']);}
  });
  mp.events.add('veloria:bank:withdraw', async (player: PlayerMp, rawAmount: number) => {
    const characterId=getCharacterId(player),amount=Math.trunc(Number(rawAmount)); if(!characterId||amount<=0)return;
    try{const wallet=await moveBetweenAccounts(characterId,'bank','cash',amount,'bank_withdraw');player.call('veloria:bank:balance',[wallet.cash,wallet.bank]);}catch{player.call('veloria:notify',['error','Недостаточно средств на счете']);}
  });
  mp.events.add('veloria:bank:transfer', async (player: PlayerMp, targetCharacterId: number, rawAmount: number) => {
    const characterId=getCharacterId(player),amount=Math.trunc(Number(rawAmount));if(!characterId||amount<=0||characterId===Number(targetCharacterId))return;
    try{await transferBank(characterId,Number(targetCharacterId),amount);const wallet=await getWallet(characterId);player.call('veloria:bank:balance',[wallet.cash,wallet.bank]);player.call('veloria:notify',['success',`Переведено $${amount}`]);}catch{player.call('veloria:notify',['error','Перевод не выполнен']);}
  });
}
