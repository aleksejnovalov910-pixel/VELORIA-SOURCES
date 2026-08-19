let seatbeltOn = false;

function currentVehicle(): VehicleMp | null {
  return mp.players.local.vehicle ?? null;
}

mp.events.add('veloria:vehicle:seatbelt:state', (state: boolean) => {
  seatbeltOn = Boolean(state);
});

mp.events.add('playerLeaveVehicle', () => {
  seatbeltOn = false;
});

mp.events.add('render', () => {
  if (!seatbeltOn || !currentVehicle()) return;
  mp.game.controls.disableControlAction(0, 75, true);
});
