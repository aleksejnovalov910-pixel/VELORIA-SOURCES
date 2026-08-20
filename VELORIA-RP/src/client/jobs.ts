export {};

type JobCenter={name:string;label:string;x:number;y:number;z:number};
type PositionLike={x:number;y:number;z:number};
const CENTERS:JobCenter[]=[{name:'courier',label:'Работа курьером',x:-424.6,y:-2789.0,z:6.0},{name:'dockworker',label:'Работа в порту',x:1204.0,y:-3116.0,z:5.5}];
let nearby:JobCenter|null=null;let active:any=null;
function loaded(){const id=Number(mp.players.local.getVariable('veloria:characterId')??0);return Number.isSafeInteger(id)&&id>0;}
function dist(pos:PositionLike,p:{x:number;y:number;z:number}){const dx=pos.x-p.x,dy=pos.y-p.y,dz=pos.z-p.z;return Math.sqrt(dx*dx+dy*dy+dz*dz);}
for(const c of CENTERS){mp.markers.new(1,new mp.Vector3(c.x,c.y,c.z-1),1.15,{color:[83,194,139,160],visible:true,dimension:0});mp.labels.new(`~w~${c.label}\n~g~E ~w~— начать`,new mp.Vector3(c.x,c.y,c.z+.5),{los:false,font:4,drawDistance:20,dimension:0});}
mp.events.add('veloria:character:spawned',()=>mp.events.callRemote('veloria:job:get'));
mp.events.add('render',()=>{nearby=null;if(!loaded())return;const pos=mp.players.local.position;for(const c of CENTERS)if(dist(pos,c)<=2.2){nearby=c;break;}const point=active?.definition?.point;if(point&&dist(pos,point)<=5){mp.game.graphics.drawText('Нажмите ~g~E~w~, чтобы выполнить задание',[0.5,0.84],{font:4,color:[255,255,255,220],scale:[0.38,0.38],outline:true,centre:true});}});
mp.keys.bind(0x45,true,()=>{if(!loaded()||mp.gui.cursor.visible)return;const point=active?.definition?.point;if(point&&dist(mp.players.local.position,point)<=5){mp.events.callRemote('veloria:job:complete');return;}if(nearby)mp.events.callRemote('veloria:job:start',nearby.name);});
mp.events.add('veloria:job:data',(raw:string)=>{try{active=JSON.parse(String(raw??'null'));}catch{active=null;}const point=active?.definition?.point;if(point&&loaded())mp.game.ui.setNewWaypoint(Number(point.x),Number(point.y));});
mp.events.add('veloria:job:refresh',()=>{if(loaded())mp.events.callRemote('veloria:job:get');});
