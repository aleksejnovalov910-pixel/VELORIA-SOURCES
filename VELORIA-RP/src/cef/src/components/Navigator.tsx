import React from 'react';
type Destination={id:string;name:string;description:string;x:number;y:number};
const destinations:Destination[]=[
  {id:'cityhall',name:'Мэрия',description:'Центр государственных услуг',x:-545.61,y:-204.03},
  {id:'hospital',name:'Больница',description:'Pillbox Hill Medical Center',x:307.24,y:-595.31},
  {id:'lspd',name:'LSPD',description:'Полицейский департамент',x:425.13,y:-979.56},
  {id:'airport',name:'Аэропорт',description:'Los Santos International Airport',x:-1037.7,y:-2737.8},
  {id:'casino',name:'Казино',description:'Diamond Casino & Resort',x:935.88,y:46.78},
  {id:'beach',name:'Пляж',description:'Vespucci Beach',x:-1476.84,y:-1245.34}
];
export function Navigator({onClose}:{onClose:()=>void}){const go=(d:Destination)=>window.mp?.trigger('veloria:cef:navigator:set',d.x,d.y,d.name);return <div className="tablet-shell"><header><div><b>VELORIA NAVIGATOR</b><small>Быстрые маршруты по Los Santos</small></div><button onClick={onClose}>×</button></header><div className="data-grid">{destinations.map(d=><article className="data-card" key={d.id}><h3>{d.name}</h3><p>{d.description}</p><div className="market-actions"><button onClick={()=>go(d)}>Построить маршрут</button></div></article>)}</div></div>}
