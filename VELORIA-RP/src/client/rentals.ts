const STATIONS = [
  { id: 1, name: 'VELORIA Rent — Airport', x: -1034.7, y: -2732.5, z: 20.17 },
  { id: 2, name: 'VELORIA Rent — Downtown', x: -507.3, y: -670.2, z: 33.18 }
] as const;

let openStationId: number | null = null;

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

function nearest(radius = 4) {
  if (!loaded()) return null;
  let result: (typeof STATIONS)[number] | null = null;
  let best = radius * radius;
  for (const station of STATIONS) {
    const value = distanceSquared(station);
    if (value <= best) {
      best = value;
      result = station;
    }
  }
  return result;
}

function execAll(code: string) {
  mp.browsers.forEach((browser: BrowserMp) => browser.execute(code));
}

function close() {
  openStationId = null;
  execAll(`document.getElementById('veloria-rental-overlay')?.remove()`);
  mp.gui.cursor.show(false, false);
}

function show(json: string) {
  let data: any;
  try { data = JSON.parse(json); } catch { return; }
  if (!Number.isSafeInteger(Number(data?.id))) return;
  openStationId = Number(data.id);
  mp.gui.cursor.show(true, true);
  const payload = JSON.stringify(data).replaceAll('<', '\\u003c');
  execAll(`(() => {
    const data = ${payload};
    document.getElementById('veloria-rental-overlay')?.remove();
    const root = document.createElement('div');
    root.id = 'veloria-rental-overlay';
    root.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(4,7,13,.64);backdrop-filter:blur(5px);font-family:Inter,Arial,sans-serif;color:white';
    const panel = document.createElement('section');
    panel.style.cssText = 'width:min(940px,90vw);padding:28px;border-radius:24px;border:1px solid rgba(255,255,255,.11);background:linear-gradient(145deg,rgba(18,23,36,.98),rgba(8,11,18,.98));box-shadow:0 25px 90px rgba(0,0,0,.5)';
    panel.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px"><div><div style="font-size:12px;letter-spacing:.2em;opacity:.55">VELORIA MOBILITY</div><h2 style="margin:5px 0 0">'+String(data.name || 'Аренда транспорта')+'</h2><div style="opacity:.58;margin-top:5px">Срок: '+Number(data.minutes || 30)+' минут</div></div><button id="veloria-rental-close" style="border:0;border-radius:12px;padding:10px 14px;background:rgba(255,255,255,.08);color:#fff;cursor:pointer">Закрыть</button></div>';
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px';
    for (const vehicle of Array.isArray(data.vehicles) ? data.vehicles : []) {
      const card = document.createElement('article');
      card.style.cssText = 'min-height:150px;padding:18px;border-radius:17px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.045);display:flex;flex-direction:column;gap:8px';
      card.innerHTML = '<div style="font-size:18px;font-weight:800">'+String(vehicle.name || vehicle.model)+'</div><div style="opacity:.55;text-transform:uppercase;font-size:11px;letter-spacing:.1em">'+String(vehicle.model || '')+'</div><div style="font-size:23px;font-weight:800;margin-top:auto">$'+Number(vehicle.price || 0).toLocaleString('ru-RU')+'</div>';
      const button = document.createElement('button');
      button.textContent = 'Арендовать';
      button.style.cssText = 'border:0;border-radius:11px;padding:11px;background:rgba(126,106,255,.92);color:white;font-weight:800;cursor:pointer';
      button.onclick = () => window.mp?.trigger('veloria:cef:rental:create', Number(data.id), String(vehicle.model));
      card.appendChild(button);
      grid.appendChild(card);
    }
    panel.appendChild(grid);
    root.appendChild(panel);
    document.body.appendChild(root);
    document.getElementById('veloria-rental-close')?.addEventListener('click', () => window.mp?.trigger('veloria:cef:rental:close'));
  })();`);
}

mp.events.add('playerReady', () => {
  for (const station of STATIONS) {
    mp.markers.new(1, new mp.Vector3(station.x, station.y, station.z - 1), 0.9, { visible: true, dimension: 0 });
  }
});

mp.events.add('render', () => {
  if (openStationId !== null) return;
  const station = nearest();
  if (!station) return;
  const graphics: any = mp.game.graphics as any;
  graphics.drawText?.(`~w~E~s~  ${station.name}`, [0.5, 0.87], {
    font: 4, color: [255, 255, 255, 230], scale: [0.38, 0.38], outline: true, centre: true
  });
});

mp.keys.bind(0x45, true, () => {
  if (openStationId !== null) return;
  const station = nearest();
  if (station) mp.events.callRemote('veloria:rental:open', station.id);
});

mp.events.add('veloria:rental:data', (json: string) => show(String(json ?? '{}')));
mp.events.add('veloria:rental:created', () => close());
mp.events.add('veloria:cef:rental:create', (stationId: number, model: string) => mp.events.callRemote('veloria:rental:create', stationId, model));
mp.events.add('veloria:cef:rental:close', close);
mp.events.add('veloria:character:spawned', () => mp.events.callRemote('veloria:rental:restore'));
