import React, { useState } from 'react';

type FamilyData = {
  selfCharacterId?: number;
  family?: {
    id: number;
    name: string;
    balance?: number;
    rank?: number;
    owner_character_id?: number;
  };
  members?: Array<{
    character_id: number;
    rank: number;
    first_name?: string;
    last_name?: string;
  }>;
} | null;

const trigger = (event: string, ...args: unknown[]) => window.mp?.trigger(event, ...args);

export function Family({ data, onClose }: { data: FamilyData; onClose: () => void }) {
  const [name, setName] = useState('');
  const [inviteCharacterId, setInviteCharacterId] = useState('');
  const family = data?.family;
  const members = Array.isArray(data?.members) ? data!.members! : [];
  const selfId = Number(data?.selfCharacterId ?? 0);
  const myRank = Number(family?.rank ?? 0);
  const isOwner = Number(family?.owner_character_id ?? 0) === selfId;

  if (!family) {
    return <div className="tablet-shell">
      <header><div><b>Семья</b><small>VELORIA TABLET</small></div><button onClick={onClose}>×</button></header>
      <article className="data-card">
        <h3>Создание семьи</h3>
        <p>Создайте собственную семью и приглашайте участников.</p>
        <label>Название семьи<input value={name} maxLength={64} onChange={event => setName(event.target.value)} placeholder="Название" /></label>
        <button className="primary" disabled={name.trim().length < 3} onClick={() => trigger('veloria:cef:family:create', name.trim())}>Создать семью</button>
      </article>
    </div>;
  }

  return <div className="tablet-shell">
    <header><div><b>{family.name}</b><small>VELORIA FAMILY</small></div><button onClick={onClose}>×</button></header>
    <article className="data-card">
      <h3>{family.name}</h3>
      <p>Баланс ${Number(family.balance ?? 0).toLocaleString('ru-RU')} · Ваш ранг {myRank}</p>
      {myRank >= 8 && <div style={{display:'flex',gap:8,alignItems:'end',flexWrap:'wrap'}}>
        <label style={{flex:'1 1 220px'}}>ID персонажа<input value={inviteCharacterId} onChange={event => setInviteCharacterId(event.target.value.replace(/\D/g, ''))} placeholder="Например 125" /></label>
        <button className="primary" disabled={!Number(inviteCharacterId)} onClick={() => { trigger('veloria:cef:family:invite', Number(inviteCharacterId)); setInviteCharacterId(''); }}>Пригласить</button>
      </div>}
    </article>
    <div className="data-grid">
      {members.map(member => {
        const memberId = Number(member.character_id);
        const rank = Number(member.rank ?? 1);
        const self = memberId === selfId;
        const canManage = !self && (isOwner || (myRank >= 9 && rank < myRank));
        return <article className="data-card" key={memberId}>
          <h3>{member.first_name && member.last_name ? `${member.first_name} ${member.last_name}` : `#${memberId}`}</h3>
          <p>ID {memberId} · Ранг {rank}</p>
          {canManage && <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            <button disabled={rank <= 1} onClick={() => trigger('veloria:cef:family:rank', memberId, rank - 1)}>− ранг</button>
            <button disabled={rank >= 9 || (!isOwner && rank + 1 >= myRank)} onClick={() => trigger('veloria:cef:family:rank', memberId, rank + 1)}>+ ранг</button>
            <button onClick={() => trigger('veloria:cef:family:kick', memberId)}>Исключить</button>
          </div>}
        </article>;
      })}
    </div>
    {!members.length && <div className="empty-state">Участников пока нет</div>}
  </div>;
}
