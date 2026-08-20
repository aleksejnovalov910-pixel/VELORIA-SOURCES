export {};

type DealerPoint={id:number;name:string;x:number;y:number;z:number};
type PositionLike={x:number;y:number;z:number};
const DEALERS:DealerPoint[]=[{id:1,name:'Premium Deluxe Motorsport',x:-33.7,y:-1102.0,z:26.4},{id:2,name:'Luxury Autos',x:-796.3,y:-220.7,z:37.1}];
let current:DealerPoint|null=null;
function loaded(){const id=Number(mp.players.local.getVariable('veloria:characterId')??0);return Number.isSafeInteger(id)&&id>0;}
function distance(a:PositionLike,b:DealerPoint){const dx=a.x-b.x,dy=a.y-b.y,dz=a.z-b.z;return Math.sqrt(dx*dx+dy*dy+dz*dz);}
for(const point of DEALERS){mp.markers.new(1,new mp.Vector3(point.x,point.y,point.z-1),1.2,{color:[118,104,255,150],visible:true,dimension:0});mp.labels.new(`~w~${point.name}\n~p~E ~w~— автосалон`,new mp.Vector3(point.x,point.y,point.z+.5),{los:false,font:4,drawDistance:20,dimension:0});}
mp.events.add('render',()=>{current=null;if(!loaded())return;const pos=mp.players.local.position;for(const point of DEALERS)if(distance(pos,point)<=2.2){current=point;break;}});
mp.keys.bind(0x45,true,()=>{if(loaded()&&current&&!mp.gui.cursor.visible)mp.events.callRemote('veloria:dealership:stock',current.id);});
