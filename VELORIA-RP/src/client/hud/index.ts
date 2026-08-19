import { VeloriaEvents } from '../../shared/events/veloria';

let visible=false;
let last=0;
let seatbelt=false;
let cash=0;
let bank=0;

export function setHudVisible(state:boolean){
  visible=state;
  mp.events.call(VeloriaEvents.HudSetVisible,state);
}

mp.events.add('veloria:hud:wallet',(nextCash:number,nextBank:number)=>{
  cash=Number.isFinite(Number(nextCash))?Math.max(0,Math.trunc(Number(nextCash))):cash;
  bank=Number.isFinite(Number(nextBank))?Math.max(0,Math.trunc(Number(nextBank))):bank;
});

mp.events.add('veloria:vehicle:seatbelt:state',(state:boolean)=>{seatbelt=Boolean(state);});
mp.events.add('playerLeaveVehicle',()=>{seatbelt=false;});

mp.events.add('render',()=>{
  if(!visible)return;
  const now=Date.now();
  if(now-last<100)return;
  last=now;

  const p=mp.players.local;
  const veh=p.vehicle;
  let online=0;
  try{online=Number((mp.players as any).length??0)||0;}catch{}

  let vehicleData:null|{speed:number;engine:boolean;rpm:number;seatbelt:boolean;fuel?:number}=null;
  if(veh){
    let fuel: number | undefined;
    try{
      const raw=Number(veh.getVariable('veloria:fuel'));
      if(Number.isFinite(raw))fuel=Math.max(0,Math.min(100,raw));
    }catch{}
    vehicleData={
      speed:Math.max(0,Math.round(veh.getSpeed()*3.6)),
      engine:Boolean(veh.getIsEngineRunning()),
      rpm:Number.isFinite(Number((veh as any).rpm))?Math.max(0,Number((veh as any).rpm)):0,
      seatbelt,
      ...(fuel===undefined?{}:{fuel})
    };
  }

  mp.events.call(VeloriaEvents.HudUpdate,JSON.stringify({
    health:Math.max(0,Math.round(p.getHealth())),
    armour:Math.max(0,Math.round(p.getArmour())),
    cash,
    bank,
    online,
    vehicle:vehicleData
  }));
});
