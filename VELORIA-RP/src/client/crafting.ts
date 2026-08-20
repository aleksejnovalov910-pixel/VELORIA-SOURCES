export {};

const STATIONS = [
  { id: 1, name: 'Верстак — La Mesa', x: 720.42, y: -1088.96, z: 22.18 },
  { id: 2, name: 'Верстак — Sandy Shores', x: 1174.65, y: 2640.31, z: 37.75 }
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

function closeCrafting() {
  openStationId = null;
  execAll(`document.getElementById('veloria-crafting-overlay')?.remove()`);
  mp.gui.cursor.show(false, false);
}

function showCrafting(json: string) {
  let data: any;
  try { data = JSON.parse(json); } catch { return; }
  const stationId = Number(data?.station?.id);
  if (!Number.isSafeInteger(stationId)) return;
  openStationId = stationId;
  mp.gui.cursor.show(true, true);
  const payload = JSON.stringify(data).replace(/</g, '\\u003c');
  execAll(`(() => {
    const data = ${payload};
    document.getElementById('veloria-crafting-overlay')?.remove();
    const root = document.createElement('div');
    root.id = 'veloria-crafting-overlay';
    root.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(3,5,10,.64);backdrop-filter:blur(5px);font-family:Inter,Arial,sans-serif;color:#fff';
    const panel = document.createElement('section');
    panel.style.cssText = 'width:min(960px,90vw);max-height:80vh;overflow:auto;padding:26px;border-radius:24px;border:1px solid rgba(255,255,255,.11);background:linear-gradient(145deg,rgba(20,23,34,.985),rgba(8,10,17,.985));box-shadow:0 26px 90px rgba(0,0,0,.52)';
    panel.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px"><div><div style="font-size:11px;letter-spacing:.22em;opacity:.5">VELORIA CRAFT</div><h2 style="margin:5px 0 0">'+String(data.station?.name || 'Верстак')+'</h2></div><button id="veloria-crafting-close" style="border:0;border-radius:11px;padding:10px 14px;background:rgba(255,255,255,.08);color:white;cursor:pointer">Закрыть</button></div>';
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px';
    for (const recipe of Array.isArray(data.recipes) ? data.recipes : []) {
      const card = document.createElement('article');
      card.style.cssText = 'padding:17px;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.045);display:flex;flex-direction:column;gap:10px';
      const title = document.createElement('div');
      title.style.cssText = 'font-size:18px;font-weight:800';
      title.textContent = String(recipe.name || recipe.id);
      card.appendChild(title);
      const list = document.createElement('div');
      list.style.cssText = 'display:flex;flex-direction:column;gap:5px;font-size:12px;opacity:.68';
      for (const ingredient of Array.isArray(recipe.ingredients) ? recipe.ingredients : []) {
        const row = document.createElement('div');
        row.textContent = String(ingredient.name || ingredient.item) + ' ×' + Number(ingredient.amount || 0);
        list.appendChild(row);
      }
      card.appendChild(list);
      const button = document.createElement('button');
      button.textContent = 'Создать';
      button.style.cssText = 'margin-top:auto;border:0;border-radius:11px;padding:11px;background:rgba(126,106,255,.92);color:white;font-weight:800;cursor:pointer';
      button.onclick = () => window.mp?.trigger('veloria:cef:crafting:craft', Number(data.station.id), String(recipe.id));
      card.appendChild(button);
      grid.appendChild(card);
    }
    panel.appendChild(grid);
    root.appendChild(panel);
    document.body.appendChild(root);
    document.getElementById('veloria-crafting-close')?.addEventListener('click', () => window.mp?.trigger('veloria:cef:crafting:close'));
  })();`);
}

mp.events.add('playerReady', () => {
  for (const station of STATIONS) {
    mp.markers.new(1, new mp.Vector3(station.x, station.y, station.z - 1), 0.85, { visible: true, dimension: 0 });
  }
});

mp.events.add('render', () => {
  if (openStationId !== null) return;
  const station = nearest();
  if (!station) return;
  const graphics: any = mp.game.graphics as any;
  graphics.drawText?.(`~w~E~s~  ${station.name}`, [0.5, 0.86], {
    font: 4, color: [255, 255, 255, 230], scale: [0.38, 0.38], outline: true, centre: true
  });
});

mp.keys.bind(0x45, true, () => {
  if (openStationId !== null) return;
  const station = nearest();
  if (station) mp.events.callRemote('veloria:crafting:open', station.id);
});

mp.events.add('veloria:crafting:data', (json: string) => showCrafting(String(json ?? '{}')));
mp.events.add('veloria:crafting:done', () => {
  if (openStationId !== null) mp.events.callRemote('veloria:crafting:open', openStationId);
});
mp.events.add('veloria:cef:crafting:craft', (stationId: number, recipeId: string) => {
  mp.events.callRemote('veloria:crafting:craft', stationId, recipeId);
});
mp.events.add('veloria:cef:crafting:close', closeCrafting);
mp.events.add('veloria:character:spawned', closeCrafting);
