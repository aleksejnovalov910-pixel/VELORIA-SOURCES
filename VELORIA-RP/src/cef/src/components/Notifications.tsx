import React from 'react';
export type Notice={id:number;type:'info'|'success'|'error'|'warning';text:string};
export function Notifications({items}:{items:Notice[]}){return <div className="notifications">{items.map(n=><div key={n.id} className={`notice ${n.type}`}>{n.text}</div>)}</div>}
