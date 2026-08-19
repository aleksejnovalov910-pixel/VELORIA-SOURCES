import { VeloriaEvents } from '../../shared/events/veloria';

mp.keys.bind(76, true, () => { const v=mp.players.local.vehicle; if(v) mp.events.callRemote(VeloriaEvents.VehicleLock, v.remoteId); });
mp.keys.bind(74, true, () => { const v=mp.players.local.vehicle; if(v) mp.events.callRemote(VeloriaEvents.VehicleEngine, v.remoteId); });
mp.keys.bind(66, true, () => mp.events.callRemote(VeloriaEvents.VehicleSeatbelt));
