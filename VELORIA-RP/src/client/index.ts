import { Events } from '../shared/events';
import { VeloriaEvents } from '../shared/events/veloria';
import { setHudVisible } from './hud';
import { applyKeybinds, DEFAULT_KEYBINDS } from './controls';
import './vehicles';
import './character/creator';

let browser: BrowserMp | null = null;
let authenticated = false;
let activeOverlay: string | null = null;
const ensureBrowser=()=>{if(!browser)browser=mp.browsers.new('package://veloria/index.html');return browser};
const exec=(code:string)=>ensureBrowser().execute(code);const cursor=(state:boolean)=>mp.gui.cursor.show(state,state);
function openAuth(){ensureBrowser();authenticated=false;activeOverlay=null;setHudVisible(false);cursor(true)}
function closeAuth(){authenticated=true;activeOverlay=null;cursor(false);setHudVisible(true);mp.events.callRemote('veloria:settings:get');mp.events.callRemote('veloria:hud:wallet:get')}
function overlay(name:string,state:boolean,data:unknown={}){if(!authenticated)return;if(state){activeOverlay=name;cursor(true)}else if(activeOverlay===name){activeOverlay=null;cursor(false)}exec(`window.veloriaOverlay?.(${JSON.stringify(name)},${JSON.stringify(state)},${JSON.stringify(JSON.stringify(data))})`)}
function parsed(json:string,fallback:unknown=[]){try{return JSON.parse(json)}catch{return fallback}}
function normalizeRuntimeSettings(raw:any){const scale=Number(raw?.interfaceScale??100),voice=Number(raw?.voiceVolume??80);return{hud:typeof raw?.hud==='boolean'?raw.hud:true,minimap:typeof raw?.minimap==='boolean'?raw.minimap:true,voiceVolume:Number.isFinite(voice)?Math.max(0,Math.min(100,voice)):80,interfaceScale:Number.isFinite(scale)?Math.max(80,Math.min(120,scale)):100,keybinds:applyKeybinds(raw?.keybinds??DEFAULT_KEYBINDS)}}
function applyRuntimeSettings(raw:any){const data=normalizeRuntimeSettings(raw);if(authenticated)setHudVisible(data.hud);mp.game.ui.displayRadar(data.minimap);exec(`document.documentElement.style.zoom=${JSON.stringify(String(data.interfaceScale/100))}`);return data}

mp.events.add('playerReady',openAuth);
mp.events.add('veloria:cef:login',(u:string,p:string)=>mp.events.callRemote(Events.AuthLogin,u,p));
mp.events.add('veloria:cef:register',(u:string,p:string)=>mp.events.callRemote(Events.AuthRegister,u,p));
mp.events.add(Events.AuthResult,(ok:boolean,msg:string)=>exec(`window.veloriaAuthResult?.(${JSON.stringify(ok)},${JSON.stringify(msg)})`));
mp.events.add(Events.CharacterList,(json:string)=>exec(`window.veloriaCharacterList?.(${JSON.stringify(json)})`));
mp.events.add('veloria:cef:character:create',(slot:number,f:string,l:string,a:string)=>mp.events.callRemote(Events.CharacterCreate,slot,f,l,a));
mp.events.add('veloria:cef:character:select',(id:number)=>mp.events.callRemote(Events.CharacterSelect,id));
mp.events.add(Events.CharacterSpawned,closeAuth);
mp.events.add(VeloriaEvents.HudSetVisible,(state:boolean)=>exec(`window.veloriaHudVisible?.(${JSON.stringify(state)})`));
mp.events.add(VeloriaEvents.HudUpdate,(json:string)=>exec(`window.veloriaHudUpdate?.(${JSON.stringify(json)})`));
mp.events.add(VeloriaEvents.PhoneToggle,()=>{const next=activeOverlay!=='phone';if(next)mp.events.callRemote('veloria:phone:data');else overlay('phone',false)});
mp.events.add('veloria:phone:data',(json:string)=>overlay('phone',true,parsed(json,{})));
mp.events.add('veloria:cef:phone:contact:add',(number:string,name:string)=>mp.events.callRemote('veloria:phone:contact:add',number,name));
mp.events.add('veloria:cef:phone:message:send',(number:string,text:string)=>mp.events.callRemote('veloria:phone:message:send',number,text));
mp.events.add(VeloriaEvents.TabletToggle,()=>overlay('tablet',activeOverlay!=='tablet'));
mp.events.add(VeloriaEvents.SettingsToggle,()=>{const next=activeOverlay!=='settings';if(next)mp.events.callRemote('veloria:settings:get');else overlay('settings',false)});
mp.events.add('veloria:settings:data',(json:string)=>{const data=applyRuntimeSettings(parsed(json,{hud:true,minimap:true,voiceVolume:80,interfaceScale:100,keybinds:DEFAULT_KEYBINDS}));overlay('settings',true,data)});
mp.events.add(VeloriaEvents.InventoryToggle,()=>{const next=activeOverlay!=='inventory';if(next)mp.events.callRemote('veloria:inventory:data');else overlay('inventory',false)});
mp.events.add('veloria:inventory:data',(json:string)=>overlay('inventory',true,parsed(json,[])));
mp.events.add('veloria:cef:inventory:move',(from:number,to:number)=>mp.events.callRemote('veloria:inventory:move',from,to));
mp.events.add('veloria:cef:inventory:use',(slot:number)=>mp.events.callRemote('veloria:inventory:use',slot));
mp.events.add('veloria:cef:tablet:open',(app:string)=>{const n=String(app??'').trim().toLowerCase();if(n==='bank')mp.events.callRemote('veloria:bank:balance');else if(n==='market')mp.events.callRemote('veloria:market:list');else if(n==='vehicles'||n==='transport')mp.events.callRemote('veloria:tablet:data','transport');else if(n==='property')mp.events.callRemote('veloria:tablet:data','property');else if(n==='jobs'||n==='job')mp.events.callRemote('veloria:tablet:data','job');else if(n==='family')mp.events.callRemote('veloria:tablet:data','family');else if(n==='faction')mp.events.callRemote('veloria:tablet:data','faction');else if(n==='business'||n==='businesses')mp.events.callRemote('veloria:tablet:data','business');else if(n==='equipment'||n==='clothes')mp.events.callRemote('veloria:tablet:data','equipment');else if(n==='dmv')mp.events.callRemote('veloria:dmv:history');else if(n==='impound')mp.events.callRemote('veloria:impound:list');else if(n==='vehiclemarket'||n==='vehicle-market')mp.events.callRemote('veloria:vehicleMarket:list');else if(n==='dealership')mp.events.callRemote('veloria:dealership:stock',1);else exec(`window.veloriaNotify?.('info',${JSON.stringify('Раздел пока не подключен')})`)});
mp.events.add('veloria:tablet:data',(section:string,json:string)=>{const n=String(section??'').trim().toLowerCase();const map:Record<string,string>={transport:'transport',property:'property',job:'job',family:'family',faction:'faction',business:'business',equipment:'equipment'};overlay(map[n]??'tablet',true,parsed(json,null))});
mp.events.add('veloria:dmv:history',(json:string)=>overlay('dmv',true,parsed(json,[])));mp.events.add('veloria:impound:data',(json:string)=>overlay('impound',true,parsed(json,[])));mp.events.add('veloria:impound:released',()=>mp.events.callRemote('veloria:impound:list'));
mp.events.add('veloria:vehicleMarket:data',(json:string)=>overlay('vehicleMarket',true,parsed(json,[])));mp.events.add('veloria:cef:vehicleMarket:buy',(vehicleId:number)=>mp.events.callRemote('veloria:vehicleMarket:buy',vehicleId));mp.events.add('veloria:cef:vehicleMarket:create',(vehicleId:number,price:number)=>mp.events.callRemote('veloria:vehicleMarket:create',vehicleId,price));mp.events.add('veloria:cef:vehicleMarket:cancel',(vehicleId:number)=>mp.events.callRemote('veloria:vehicleMarket:cancel',vehicleId));mp.events.add('veloria:vehicleMarket:purchased',()=>mp.events.callRemote('veloria:vehicleMarket:list'));mp.events.add('veloria:vehicleMarket:listed',()=>mp.events.callRemote('veloria:vehicleMarket:list'));mp.events.add('veloria:vehicleMarket:cancelled',()=>mp.events.callRemote('veloria:vehicleMarket:list'));
mp.events.add('veloria:dealership:data',(dealershipId:number,json:string)=>overlay('dealership',true,{dealershipId,stock:parsed(json,[])}));mp.events.add('veloria:cef:dealership:buy',(stockId:number)=>mp.events.callRemote('veloria:dealership:buy',stockId));mp.events.add('veloria:dealership:purchased',()=>mp.events.callRemote('veloria:dealership:stock',1));
mp.events.add('veloria:bank:balance',(cash:number,bank:number)=>overlay('bank',true,{cash,bank}));mp.events.add('veloria:cef:bank:deposit',(amount:number)=>mp.events.callRemote('veloria:bank:deposit',amount));mp.events.add('veloria:cef:bank:withdraw',(amount:number)=>mp.events.callRemote('veloria:bank:withdraw',amount));mp.events.add('veloria:cef:bank:transfer',(target:number,amount:number)=>mp.events.callRemote('veloria:bank:transfer',target,amount));
mp.events.add('veloria:market:data',(json:string)=>overlay('market',true,parsed(json,[])));mp.events.add('veloria:cef:market:buy',(id:number)=>mp.events.callRemote('veloria:market:buy',id));mp.events.add('veloria:market:purchased',()=>mp.events.callRemote('veloria:market:list'));
mp.events.add('veloria:cef:overlay:close',()=>{activeOverlay=null;cursor(false)});
mp.events.add('veloria:cef:settings',(json:string)=>{const raw=parsed(json,{});applyRuntimeSettings(raw);mp.events.callRemote('veloria:settings:save',JSON.stringify(raw))});
mp.events.add(VeloriaEvents.Notify,(type:string,text:string)=>exec(`window.veloriaNotify?.(${JSON.stringify(type)},${JSON.stringify(text)})`));
