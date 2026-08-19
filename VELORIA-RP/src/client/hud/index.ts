import { VeloriaEvents } from '../../shared/events/veloria';
let visible = false;
export function setHudVisible(state:boolean){ visible=state; mp.events.call(VeloriaEvents.HudSetVisible,state); }
mp.events.add('render',()=>{ if(!visible) return; const p=mp.players.local; const veh=p.vehicle; mp.events.call(VeloriaEvents.HudUpdate, JSON.stringify({health:p.getHealth(),armour:p.getArmour(),vehicle:veh?{speed:Math.round(veh.getSpeed()*3.6),engine:veh.getIsEngineRunning()}:null})); });
