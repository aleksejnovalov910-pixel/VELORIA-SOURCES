import { VeloriaEvents } from '../../shared/events/veloria';

let seatbeltOn = false;
let lastActionAt = 0;

function canAct(): boolean {
  const now = Date.now();
  if (now - lastActionAt < 250) return false;
  lastActionAt = now;
  return true;
}

function currentVehicle(): VehicleMp | null {
  return mp.players.local.vehicle ?? null;
}

mp.keys.bind(76, true, () => {
  if (!canAct()) return;
  const vehicle = currentVehicle();
  if (!vehicle || typeof vehicle.remoteId !== 'number' || vehicle.remoteId < 0) return;
  mp.events.callRemote(VeloriaEvents.VehicleLock, vehicle.remoteId);
});

mp.keys.bind(74, true, () => {
  if (!canAct()) return;
  const vehicle = currentVehicle();
  if (!vehicle || typeof vehicle.remoteId !== 'number' || vehicle.remoteId < 0) return;
  mp.events.callRemote(VeloriaEvents.VehicleEngine, vehicle.remoteId);
});

mp.keys.bind(66, true, () => {
  if (!canAct() || !currentVehicle()) return;
  mp.events.callRemote(VeloriaEvents.VehicleSeatbelt);
});

mp.events.add('veloria:vehicle:seatbelt:state', (state: boolean) => {
  seatbeltOn = Boolean(state);
});

mp.events.add('playerLeaveVehicle', () => {
  seatbeltOn = false;
});

mp.events.add('render', () => {
  if (!seatbeltOn || !currentVehicle()) return;
  // Prevent accidental exit while the seatbelt is fastened.
  mp.game.controls.disableControlAction(0, 75, true);
});
