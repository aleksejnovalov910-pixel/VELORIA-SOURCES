import React, { useState } from 'react';

export type KeybindSettings={phone:number;tablet:number;inventory:number;settings:number;vehicleLock:number;vehicleEngine:number;seatbelt:number};
export type GameSettings={hud:boolean;minimap:boolean;voiceVolume:number;interfaceScale:number;keybinds:KeybindSettings};

type KeybindName=keyof KeybindSettings;
const labels:Record<KeybindName,string>={phone:'Телефон',tablet:'Планшет',inventory:'Инвентарь',settings:'Настройки',vehicleLock:'Замок автомобиля',vehicleEngine:'Двигатель',seatbelt:'Ремень безопасности'};

function keyName(code:number){
  const map:Record<number,string>={8:'Backspace',9:'Tab',13:'Enter',16:'Shift',17:'Ctrl',18:'Alt',27:'Esc',32:'Space',33:'PgUp',34:'PgDn',35:'End',36:'Home',37:'←',38:'↑',39:'→',40:'↓',45:'Insert',46:'Delete',112:'F1',113:'F2',114:'F3',115:'F4',116:'F5',117:'F6',118:'F7',119:'F8',120:'F9',121:'F10',122:'F11',123:'F12'};
  if(map[code])return map[code];
  if(code>=48&&code<=90)return String.fromCharCode(code);
  if(code>=96&&code<=105)return `Num ${code-96}`;
  return `Key ${code}`;
}

export function Settings({value,onChange,onClose}:{value:GameSettings;onChange:(v:GameSettings)=>void;onClose:()=>void}){
  const[listening,setListening]=useState<KeybindName|null>(null);
  const capture=(name:KeybindName,e:React.KeyboardEvent<HTMLButtonElement>)=>{
    e.preventDefault();e.stopPropagation();
    const code=Number(e.keyCode||e.which);
    if(!Number.isSafeInteger(code)||code<8||code>255)return;
    if(Object.entries(value.keybinds).some(([k,v])=>k!==name&&v===code))return;
    onChange({...value,keybinds:{...value.keybinds,[name]:code}});setListening(null);
  };
  return <div className="settings-shell"><header><div><b>Настройки</b><small>VELORIA · персональные параметры</small></div><button onClick={onClose}>×</button></header><label><span>HUD</span><input type="checkbox" checked={value.hud} onChange={e=>onChange({...value,hud:e.target.checked})}/></label><label><span>Мини-карта</span><input type="checkbox" checked={value.minimap} onChange={e=>onChange({...value,minimap:e.target.checked})}/></label><label><span>Громкость голосового чата</span><input type="range" min="0" max="100" value={value.voiceVolume} onChange={e=>onChange({...value,voiceVolume:Number(e.target.value)})}/></label><label><span>Масштаб интерфейса</span><input type="range" min="80" max="120" value={value.interfaceScale} onChange={e=>onChange({...value,interfaceScale:Number(e.target.value)})}/></label><section><h3>Управление</h3>{(Object.keys(labels) as KeybindName[]).map(name=><div className="keybind-row" key={name}><span>{labels[name]}</span><button className="keybind-button" onClick={()=>setListening(name)} onKeyDown={e=>capture(name,e)} autoFocus={listening===name}><kbd>{listening===name?'Нажмите клавишу…':keyName(value.keybinds[name])}</kbd></button></div>)}<small>Нажмите на клавишу справа, затем нажмите новую кнопку. Одинаковые назначения не допускаются.</small></section></div>
}
