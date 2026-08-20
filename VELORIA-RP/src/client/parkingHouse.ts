export {};

const GARAGES = [
  { id: 1, name: 'Legion Square Parking', x: 215.82, y: -810.05, z: 30.73 },
  { id: 2, name: 'Vespucci Parking', x: -1184.37, y: -1510.18, z: 4.65 },
  { id: 3, name: 'Vinewood Parking', x: 365.23, y: 295.11, z: 103.46 },
  { id: 4, name: 'Airport Parking', x: -1034.12, y: -2733.04, z: 20.17 }
] as const;

let openGarageId: number | null = null;

function loaded(): boolean {
  return Number(mp.players.local.getVariable('veloria:characterId') ?? 0) > 0;
}

function distanceSquared(point: { x: number; y: number; z: number }) {
  const p = mp.players.local.position;
  const dx = p.x - point.x;
  const dy = p.y - point.y;
  const dz = p.z - point.z;
  return dx * dx + dy * dy + dz * dz;
}

function nearest(radius = 4.5) {
  if (!loaded()) return null;
  let result: (typeof GARAGES)[number] | null = null;
  let best = radius * radius;
  for (const garage of GARAGES) {
    const value = distanceSquared(garage);
    if (value <= best) {
      best = value;
      result = garage;
    }
  }
  return result;
}

function execAll(code: string) {
  mp.browsers.forEach((browser: BrowserMp) => browser.execute(code));
}

function closeGarage() {
  openGarageId = null;
  execAll(`document.getElementById('veloria-parking-overlay')?.remove()`);
  mp.gui.cursor.show(false, false);
}

function showGarage(garageIdRaw: number, json: string) {
  const garageId = Math.trunc(Number(garageIdRaw));
  const garage = GARAGES.find(item => item.id === garageId);
  if (!garage) return;
  let vehicles: any[] = [];
  try {
    const parsed = JSON.parse(String(json ?? '[]'));
    if (Array.isArray(parsed)) vehicles = parsed;
  } catch {
    vehicles = [];
  }
  openGarageId = garageId;
  mp.gui.cursor.show(true, true);
  const payload = JSON.stringify({ garage, vehicles }).replace(/</g, '\\u003c');
  execAll(`(() => {
    const data = ${payload};
    document.getElementById('veloria-parking-overlay')?.remove();
    const root = document.createElement('div');
    root.id = 'veloria-parking-overlay';
    root.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(3,5,10,.62);backdrop-filter:blur(5px);font-family:Inter,Arial,sans-serif;color:white';
    const panel = document.createElement('section');
    panel.style.cssText = 'width:min(980px,90vw);max-height:80vh;overflow:auto;padding:26px;border-radius:24px;border:1px solid rgba(255,255,255,.11);background:linear-gradient(145deg,rgba(18,23,36,.985),rgba(8,11,18,.985));box-shadow:0 26px 90px rgba(0,0,0,.52)';
    panel.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px"><div><div style="font-size:11px;letter-spacing:.22em;opacity:.5">VELORIA PARKING</div><h2 style="margin:5px 0 0">'+String(data.garage.name || 'Parking House')+'</h2><div style="opacity:.55;margin-top:5px">Автомобилей: '+Number(data.vehicles.length || 0)+'</div></div><button id="veloria-parking-close" style="border:0;border-radius:11px;padding:10px 14px;background:rgba(255,255,255,.08);color:white;cursor:pointer">Закрыть</button></div>';
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px';
    if (!data.vehicles.length) {
      const empty = document.createElement('div');
      empty.style.cssText = 'padding:28px;border:1px dashed rgba(255,255,255,.12);border-radius:16px;opacity:.65;text-align:center;grid-column:1/-1';
      empty.textContent = 'В этом Parking House пока нет ваших автомобилей';
      grid.appendChild(empty);
    }
    for (const vehicle of data.vehicles) {
      const card = document.createElement('article');
      card.style.cssText = 'padding:17px;border:1px solid rgba(255,255,255,.08);border-radius:16px;background:rgba(255,255,255,.045);display:flex;flex-direction:column;gap:8px';
      const plate = String(vehicle.plate || 'VELORIA');
      const model = String(vehicle.model || 'Vehicle');
      card.innerHTML = '<div style="font-size:18px;font-weight:800">'+model+'</div><div style="display:inline-flex;align-self:flex-start;padding:5px 9px;border-radius:7px;background:rgba(255,255,255,.09);font-size:12px;letter-spacing:.12em">'+plate+'</div><div style="font-size:12px;opacity:.55">Топливо: '+Math.round(Number(vehicle.fuel || 0))+'% · Кузов: '+Math.round(Number(vehicle.body_health || 0))+'</div>';
      const button = document.createElement('button');
      button.textContent = 'Забрать автомобиль';
      button.style.cssText = 'margin-top:7px;border:0;border-radius:11px;padding:11px;background:rgba(126,106,255,.92);color:white;font-weight:800;cursor:pointer';
      button.onclick = () => window.mp?.trigger('veloria:cef:parking:take', Number(data.garage.id), Number(vehicle.id));
      card.appendChild(button);
      grid.appendChild(card);
    }
    panel.appendChild(grid);
    root.appendChild(panel);
    document.body.appendChild(root);
    document.getElementById('veloria-parking-close')?.addEventListener('click', () => window.mp?.trigger('veloria:cef:parking:close'));
  })();`);
}

mp.events.add('playerReady', () => {
  for (const garage of GARAGES) {
    mp.markers.new(1, new mp.Vector3(garage.x, garage.y, garage.z - 1), 1.05, { visible: true, dimension: 0 });
  }
});

mp.events.add('render', () => {
  if (openGarageId !== null) return;
  const garage = nearest();
  if (!garage) return;
  const inVehicle = Boolean(mp.players.local.vehicle);
  const graphics: any = mp.game.graphics as any;
  graphics.drawText?.(`~w~E~s~  ${inVehicle ? 'Припарковать автомобиль' : garage.name}`, [0.5, 0.9], {
    font: 4, color: [255, 255, 255, 230], scale: [0.38, 0.38], outline: true, centre: true
  });
});

mp.keys.bind(0x45, true, () => {
  if (openGarageId !== null) return;
  const garage = nearest();
  if (!garage) return;
  if (mp.players.local.vehicle) {
    mp.events.callRemote('veloria:garage:park', garage.id);
  } else {
    mp.events.callRemote('veloria:garage:list', garage.id);
  }
});

mp.events.add('veloria:garage:data', (garageId: number, json: string) => showGarage(garageId, String(json ?? '[]')));
mp.events.add('veloria:cef:parking:take', (garageId: number, vehicleId: number) => {
  closeGarage();
  mp.events.callRemote('veloria:garage:take', vehicleId, garageId);
});
mp.events.add('veloria:cef:parking:close', closeGarage);
mp.events.add('veloria:character:spawned', closeGarage);
