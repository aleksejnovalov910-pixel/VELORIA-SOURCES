import { useEffect, useMemo, useRef, useState } from 'react';
import { Hud, HudState } from './components/Hud';
import { Notifications, Notice } from './components/Notifications';
import { Phone } from './components/Phone';
import { Tablet } from './components/Tablet';
import { Settings, GameSettings } from './components/Settings';
import { Inventory } from './components/Inventory';
import { Bank } from './components/Bank';
import { Market } from './components/Market';
import { Transport } from './components/Transport';
import { Property } from './components/Property';
import { TabletData } from './components/TabletData';
import { VehicleMarket } from './components/VehicleMarket';
import { Dealership } from './components/Dealership';
import { Navigator } from './components/Navigator';

type Character = { id:number; slot:1|2|3; firstName:string; lastName:string; level:number; cash:number; bank:number };
type CreatorTab = 'identity'|'heritage'|'hair'|'face'|'clothes';
type CreatorState = {
  slot:number; firstName:string; lastName:string; gender:'male'|'female';
  mother:number; father:number; shapeMix:number; skinMix:number;
  hair:number; hairColor:number; eyeColor:number; eyebrows:number; beard:number;
  noseWidth:number; jawWidth:number; eyeOpening:number; lipThickness:number;
  top:number; legs:number; shoes:number;
};
type Overlay = 'phone'|'tablet'|'settings'|'inventory'|'bank'|'market'|'transport'|'vehicleMarket'|'dealership'|'property'|'job'|'family'|'faction'|'business'|'equipment'|'dmv'|'impound'|'navigator'|null;
type InventorySlot = { slot:number; item:string; amount:number; metadata?:Record<string,unknown> };

declare global {
  interface Window {
    mp?: { trigger:(event:string,...args:unknown[])=>void };
    veloriaAuthResult?:(success:boolean,message:string)=>void;
    veloriaCharacterList?:(json:string)=>void;
    veloriaHudVisible?:(state:boolean)=>void;
    veloriaHudUpdate?:(json:string)=>void;
    veloriaOverlay?:(name:string,state:boolean,json?:string)=>void;
    veloriaNotify?:(type:Notice['type'],text:string)=>void;
  }
}

const trigger = (event:string,...args:unknown[]) => window.mp?.trigger(event,...args);
const mothers = [21,22,23,24,25,26,27,28,29,30,31,32].map((id,i)=>({id,name:['Hannah','Audrey','Jasmine','Giselle','Amelia','Isabella','Zoe','Ava','Camilla','Violet','Sophia','Evelyn'][i]}));
const fathers = [0,1,2,3,4,5,6,7,8,9,10,11].map((id,i)=>({id,name:['Benjamin','Daniel','Joshua','Noah','Andrew','Juan','Alex','Isaac','Evan','Ethan','Vincent','Angel'][i]}));
const hairStyles = Array.from({length:12},(_,i)=>i);
const eyebrowStyles = Array.from({length:10},(_,i)=>i);
const beardStyles = Array.from({length:9},(_,i)=>i);
const eyeColors = Array.from({length:8},(_,i)=>i);
const colors = [0,1,2,3,4,5,8,10,12,15,18,22];
const clothingVariants = [0,1,2,3,4];

const defaultCreator = (slot:number):CreatorState => ({
  slot, firstName:'', lastName:'', gender:'male', mother:21, father:0, shapeMix:.5, skinMix:.5,
  hair:0, hairColor:0, eyeColor:0, eyebrows:0, beard:0,
  noseWidth:0, jawWidth:0, eyeOpening:0, lipThickness:0,
  top:0, legs:0, shoes:0
});

const defaultSettings:GameSettings = {
  hud:true, minimap:true, voiceVolume:80, interfaceScale:100,
  keybinds:{phone:38,tablet:40,inventory:73,settings:113,vehicleLock:76,vehicleEngine:74,seatbelt:66}
};

function creatorAppearance(c:CreatorState) {
  return {
    gender:c.gender,
    parents:{mother:c.mother,father:c.father,shapeMix:c.shapeMix,skinMix:c.skinMix},
    faceFeatures:{noseWidth:c.noseWidth,jawWidth:c.jawWidth,eyeOpening:c.eyeOpening,lipThickness:c.lipThickness},
    hair:{style:c.hair,color:c.hairColor,highlight:c.hairColor},
    eyeColor:c.eyeColor,
    eyebrows:{index:c.eyebrows,opacity:1,color:c.hairColor},
    beard:{index:c.beard,opacity:c.gender==='male'?1:0,color:c.hairColor},
    makeup:{index:0,opacity:0}, blemishes:{index:0,opacity:0}, ageing:{index:0,opacity:0},
    complexion:{index:0,opacity:0}, sunDamage:{index:0,opacity:0}, lipstick:{index:0,opacity:0}, chestHair:{index:0,opacity:0},
    clothing:{tops:{drawable:c.top,texture:0},legs:{drawable:c.legs,texture:0},shoes:{drawable:c.shoes,texture:0}}
  };
}

function Slider({label,value,min,max,step=.01,onChange}:{label:string;value:number;min:number;max:number;step?:number;onChange:(v:number)=>void}) {
  return <label className="creator-slider"><span>{label}</span><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}/><b>{Number(value).toFixed(step===1?0:2)}</b></label>;
}

function HeritagePicker({title,items,value,onChange}:{title:string;items:{id:number;name:string}[];value:number;onChange:(v:number)=>void}) {
  return <div className="heritage-group"><h4>{title}</h4><div className="heritage-grid">{items.map((item,index)=><button key={item.id} className={`heritage-card ${value===item.id?'selected':''}`} onClick={()=>onChange(item.id)}><span className={`heritage-face face-${index%6}`}><i/></span><small>{item.name}</small></button>)}</div></div>;
}

function ChoiceGrid({title,values,value,onChange,prefix}:{title:string;values:number[];value:number;onChange:(v:number)=>void;prefix:string}) {
  return <div className="choice-block"><h4>{title}</h4><div className="choice-grid">{values.map(v=><button key={v} className={value===v?'selected':''} onClick={()=>onChange(v)}><span>{prefix}</span><b>{v+1}</b></button>)}</div></div>;
}

export function App() {
  const [mode,setMode] = useState<'login'|'register'>('login');
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [message,setMessage] = useState('');
  const [characters,setCharacters] = useState<Character[]|null>(null);
  const [creator,setCreator] = useState<CreatorState|null>(null);
  const [creatorTab,setCreatorTab] = useState<CreatorTab>('identity');
  const creatorWasOpen = useRef(false);
  const [hudVisible,setHudVisible] = useState(false);
  const [hud,setHud] = useState<HudState>({health:100,armour:0});
  const [overlay,setOverlay] = useState<Overlay>(null);
  const [overlayData,setOverlayData] = useState<any>(null);
  const [inventory,setInventory] = useState<InventorySlot[]>([]);
  const [phoneData,setPhoneData] = useState<any>({});
  const [bankData,setBankData] = useState<any>({cash:0,bank:0});
  const [marketData,setMarketData] = useState<any[]>([]);
  const [notices,setNotices] = useState<Notice[]>([]);
  const [settings,setSettings] = useState<GameSettings>(defaultSettings);

  useEffect(()=>{
    window.veloriaAuthResult=(success,text)=>setMessage(success?'':text);
    window.veloriaCharacterList=json=>{try{setCharacters(JSON.parse(json))}catch{setMessage('Не удалось загрузить персонажей')}};
    window.veloriaHudVisible=state=>{setHudVisible(state);if(state)setCreator(null)};
    window.veloriaHudUpdate=json=>{try{setHud(v=>({...v,...JSON.parse(json)}))}catch{}};
    window.veloriaOverlay=(name,state,json)=>{
      if(!state){setOverlay(null);return}
      setOverlay(name as Overlay);
      let data:any=null;if(json)try{data=JSON.parse(json)}catch{}
      setOverlayData(data);
      if(name==='inventory')setInventory(data??[]);
      if(name==='phone')setPhoneData(data??{});
      if(name==='bank')setBankData(data??{});
      if(name==='market')setMarketData(data??[]);
      if(name==='settings'&&data&&typeof data==='object')setSettings({hud:typeof data.hud==='boolean'?data.hud:true,minimap:typeof data.minimap==='boolean'?data.minimap:true,voiceVolume:Number(data.voiceVolume??80),interfaceScale:Number(data.interfaceScale??100),keybinds:{...defaultSettings.keybinds,...(data.keybinds??{})}});
    };
    window.veloriaNotify=(type,text)=>{const id=Date.now()+Math.random();setNotices(v=>[...v,{id,type,text}].slice(-5));setTimeout(()=>setNotices(v=>v.filter(n=>n.id!==id)),4500)};
    return()=>{delete window.veloriaAuthResult;delete window.veloriaCharacterList;delete window.veloriaHudVisible;delete window.veloriaHudUpdate;delete window.veloriaOverlay;delete window.veloriaNotify};
  },[]);

  useEffect(()=>{
    if(creator){
      const appearance=creatorAppearance(creator);
      if(!creatorWasOpen.current){
        creatorWasOpen.current=true;
        trigger('veloria:cef:character:creator:open',JSON.stringify(appearance));
      }
      trigger('veloria:creator:appearance',JSON.stringify(appearance));
    } else if(creatorWasOpen.current){
      creatorWasOpen.current=false;
      trigger('veloria:cef:character:creator:close');
    }
  },[creator]);

  useEffect(()=>{
    const onWheel=(event:WheelEvent)=>{if(creator)trigger('veloria:creator:zoom',Math.sign(event.deltaY||0))};
    window.addEventListener('wheel',onWheel,{passive:true});
    return()=>window.removeEventListener('wheel',onWheel);
  },[creator]);

  const slots=useMemo(()=>[1,2,3].map(slot=>characters?.find(c=>c.slot===slot)),[characters]);
  const closeOverlay=()=>{setOverlay(null);trigger('veloria:cef:overlay:close')};

  if(creator){
    const patch=(next:Partial<CreatorState>)=>setCreator({...creator,...next});
    const save=()=>trigger('veloria:cef:character:create',creator.slot,creator.firstName.trim(),creator.lastName.trim(),JSON.stringify(creatorAppearance(creator)));
    const validName=/^[A-Za-zА-Яа-яЁё]{2,24}$/.test(creator.firstName.trim())&&/^[A-Za-zА-Яа-яЁё]{2,24}$/.test(creator.lastName.trim());
    return <main className="creator-screen">
      <div className="creator-topbar"><div className="brand compact"><div className="brand-mark">V</div><div><h1>VELORIA RP</h1><p>Создание персонажа · Слот {creator.slot}</p></div></div><div className="creator-hint">ЛКМ + движение — вращение персонажа · Колесо — приближение</div></div>
      <aside className="creator-dock">
        <nav className="creator-tabs">
          {([['identity','Профиль'],['heritage','Родители'],['hair','Стиль'],['face','Лицо'],['clothes','Одежда']] as [CreatorTab,string][]).map(([tab,label])=><button key={tab} className={creatorTab===tab?'active':''} onClick={()=>setCreatorTab(tab)}>{label}</button>)}
        </nav>
        <section className="creator-content">
          {creatorTab==='identity'&&<><div className="section-title"><span>01</span><div><h2>Кто ваш персонаж?</h2><p>Основная информация, которая будет видна другим игрокам.</p></div></div><div className="name-grid"><label>Имя<input autoFocus value={creator.firstName} maxLength={24} onChange={e=>patch({firstName:e.target.value})} placeholder="Например, Alex"/></label><label>Фамилия<input value={creator.lastName} maxLength={24} onChange={e=>patch({lastName:e.target.value})} placeholder="Например, Morgan"/></label></div><div className="gender-row"><button className={creator.gender==='male'?'selected':''} onClick={()=>patch({gender:'male',beard:creator.beard})}><span>♂</span><b>Мужчина</b><small>Мужская модель</small></button><button className={creator.gender==='female'?'selected':''} onClick={()=>patch({gender:'female',beard:0})}><span>♀</span><b>Женщина</b><small>Женская модель</small></button></div></>}
          {creatorTab==='heritage'&&<><div className="section-title"><span>02</span><div><h2>Наследственность</h2><p>Выберите родителей и смешайте черты лица.</p></div></div><HeritagePicker title="Мать" items={mothers} value={creator.mother} onChange={mother=>patch({mother})}/><HeritagePicker title="Отец" items={fathers} value={creator.father} onChange={father=>patch({father})}/><Slider label="Сходство" value={creator.shapeMix} min={0} max={1} onChange={shapeMix=>patch({shapeMix})}/><Slider label="Тон кожи" value={creator.skinMix} min={0} max={1} onChange={skinMix=>patch({skinMix})}/></>}
          {creatorTab==='hair'&&<><div className="section-title"><span>03</span><div><h2>Стиль</h2><p>Причёска, волосы, брови, борода и глаза.</p></div></div><ChoiceGrid title="Причёска" values={hairStyles} value={creator.hair} onChange={hair=>patch({hair})} prefix="✦"/><div className="choice-block"><h4>Цвет волос</h4><div className="color-grid">{colors.map(c=><button key={c} className={creator.hairColor===c?'selected':''} style={{'--swatch':`hsl(${28+c*4} 28% ${Math.max(8,58-c*1.7)}%)`} as React.CSSProperties} onClick={()=>patch({hairColor:c})}/>)}</div></div><ChoiceGrid title="Брови" values={eyebrowStyles} value={creator.eyebrows} onChange={eyebrows=>patch({eyebrows})} prefix="⌁"/>{creator.gender==='male'&&<ChoiceGrid title="Борода" values={beardStyles} value={creator.beard} onChange={beard=>patch({beard})} prefix="⌄"/>}<ChoiceGrid title="Цвет глаз" values={eyeColors} value={creator.eyeColor} onChange={eyeColor=>patch({eyeColor})} prefix="◉"/></>}
          {creatorTab==='face'&&<><div className="section-title"><span>04</span><div><h2>Черты лица</h2><p>Тонкая настройка внешности без перегруженного редактора.</p></div></div><Slider label="Ширина носа" value={creator.noseWidth} min={-1} max={1} onChange={noseWidth=>patch({noseWidth})}/><Slider label="Ширина челюсти" value={creator.jawWidth} min={-1} max={1} onChange={jawWidth=>patch({jawWidth})}/><Slider label="Разрез глаз" value={creator.eyeOpening} min={-1} max={1} onChange={eyeOpening=>patch({eyeOpening})}/><Slider label="Толщина губ" value={creator.lipThickness} min={-1} max={1} onChange={lipThickness=>patch({lipThickness})}/></>}
          {creatorTab==='clothes'&&<><div className="section-title"><span>05</span><div><h2>Стартовый образ</h2><p>Выберите базовый комплект. Позже одежду можно будет сменить в магазине.</p></div></div><ChoiceGrid title="Верх" values={clothingVariants} value={creator.top} onChange={top=>patch({top})} prefix="T"/><ChoiceGrid title="Штаны" values={clothingVariants} value={creator.legs} onChange={legs=>patch({legs})} prefix="Ⅱ"/><ChoiceGrid title="Обувь" values={clothingVariants} value={creator.shoes} onChange={shoes=>patch({shoes})} prefix="⌁"/></>}
        </section>
        <footer className="creator-footer"><button className="ghost" onClick={()=>setCreator(null)}>Назад</button><button className="primary creator-save" disabled={!validName} onClick={save}>Создать персонажа</button></footer>
      </aside>
    </main>;
  }

  if(characters===null){
    return <main className="screen auth-screen"><div className="auth-copy"><span className="eyebrow">WELCOME TO</span><h2>VELORIA</h2><p>Город, в котором историю пишут игроки.</p><div className="server-badges"><span>500 слотов</span><span>Los Santos</span><span>Role Play</span></div></div><section className="panel auth-panel"><header className="brand"><div className="brand-mark">V</div><div><h1>VELORIA RP</h1><p>{mode==='login'?'Войдите в свой аккаунт':'Создайте новый аккаунт'}</p></div></header><div className="mode-switch"><button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>Вход</button><button className={mode==='register'?'active':''} onClick={()=>setMode('register')}>Регистрация</button></div><label>Логин<input value={username} autoComplete="off" onChange={e=>setUsername(e.target.value)} placeholder="Введите логин"/></label><label>Пароль<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Введите пароль"/></label>{message&&<div className="message">{message}</div>}<button className="primary" onClick={()=>trigger(mode==='login'?'veloria:cef:login':'veloria:cef:register',username,password)}>{mode==='login'?'Войти в игру':'Создать аккаунт'}</button><small className="auth-note">Продолжая, вы соглашаетесь с правилами проекта.</small></section></main>;
  }

  const characterScreen=!hudVisible;
  return <>
    {characterScreen&&<main className="screen character-screen"><div className="character-title"><span className="eyebrow">VELORIA RP</span><h2>Выберите историю</h2><p>Три персонажа — три независимых пути.</p></div><section className="character-panel"><div className="character-grid">{slots.map((character,index)=><button key={index} className={`character-card ${character?'filled':'empty'}`} onClick={()=>character?trigger('veloria:cef:character:select',character.id):(setCreatorTab('identity'),setCreator(defaultCreator(index+1)))}>{character?<><div className="slot-top"><span>Слот {index+1}</span><em>Активен</em></div><div className="character-silhouette"><span>{character.firstName.charAt(0)}{character.lastName.charAt(0)}</span></div><div className="character-info"><strong>{character.firstName} {character.lastName}</strong><span>Уровень {character.level}</span><div><b>${character.cash.toLocaleString('ru-RU')}</b><small>Наличные</small></div></div><span className="play-label">Играть →</span></>:<><div className="empty-plus">+</div><strong>Новый персонаж</strong><span>Создать в слоте {index+1}</span></>}</button>)}</div></section></main>}
    {hudVisible&&settings.hud&&<Hud state={hud}/>}<Notifications items={notices}/>
    {overlay==='phone'&&<Phone {...phoneData} onClose={closeOverlay}/>} {overlay==='tablet'&&<Tablet onClose={closeOverlay}/>} {overlay==='settings'&&<Settings value={settings} onChange={v=>{setSettings(v);trigger('veloria:cef:settings',JSON.stringify(v))}} onClose={closeOverlay}/>} {overlay==='inventory'&&<Inventory items={inventory} onClose={closeOverlay}/>} {overlay==='bank'&&<Bank {...bankData} onClose={closeOverlay}/>} {overlay==='market'&&<Market items={marketData} onClose={closeOverlay}/>} {overlay==='transport'&&<Transport vehicles={overlayData??[]} onClose={closeOverlay}/>} {overlay==='vehicleMarket'&&<VehicleMarket items={overlayData??[]} onClose={closeOverlay}/>} {overlay==='dealership'&&<Dealership data={overlayData} onClose={closeOverlay}/>} {overlay==='property'&&<Property items={overlayData??[]} onClose={closeOverlay}/>} {overlay==='job'&&<TabletData title="Работа" data={overlayData} onClose={closeOverlay}/>} {overlay==='family'&&<TabletData title="Семья" data={overlayData} onClose={closeOverlay}/>} {overlay==='faction'&&<TabletData title="Организация" data={overlayData} onClose={closeOverlay}/>} {overlay==='business'&&<TabletData title="Бизнес" data={overlayData} onClose={closeOverlay}/>} {overlay==='equipment'&&<TabletData title="Экипировка" data={overlayData} onClose={closeOverlay}/>} {overlay==='dmv'&&<TabletData title="DMV" data={overlayData} onClose={closeOverlay}/>} {overlay==='impound'&&<TabletData title="Штрафстоянка" data={overlayData} onClose={closeOverlay}/>} {overlay==='navigator'&&<Navigator onClose={closeOverlay}/>} 
  </>;
}
