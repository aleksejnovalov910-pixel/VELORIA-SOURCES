import React from 'react';
import { Family } from './Family';

export function TabletData({title,data,onClose}:{title:string;data:any;onClose:()=>void}){
  if(title==='Семья')return <Family data={data} onClose={onClose}/>;
  const rows=Array.isArray(data)?data:data?.members??[];
  return <div className="tablet-shell"><header><div><b>{title}</b><small>VELORIA TABLET</small></div><button onClick={onClose}>×</button></header>{data?.job_name&&<article className="data-card"><h3>{data.job_name}</h3><p>Смена начата: {String(data.started_at??'—')}</p><pre>{JSON.stringify(data.progress_json??{},null,2)}</pre></article>}{data?.faction&&<article className="data-card"><h3>{data.faction.name}</h3><p>Ранг {data.faction.rank}</p></article>}<div className="data-grid">{rows.map((r:any,i:number)=><article className="data-card" key={r.id??r.character_id??i}><h3>{r.first_name&&r.last_name?`${r.first_name} ${r.last_name}`:r.name??r.job_name??`#${r.id??i+1}`}</h3><p>{r.rank?`Ранг ${r.rank}`:''}</p></article>)}</div>{!data&&<div className="empty-state">Данных пока нет</div>}</div>}
