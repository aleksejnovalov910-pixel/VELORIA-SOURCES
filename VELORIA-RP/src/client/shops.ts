export {};

const SHOPS = [
  { id: 1, name: '24/7 Strawberry', x: 25.74, y: -1347.33, z: 29.5 },
  { id: 2, name: '24/7 Vinewood', x: 373.88, y: 325.9, z: 103.57 },
  { id: 3, name: '24/7 Mirror Park', x: 1163.38, y: -323.8, z: 69.21 },
  { id: 4, name: '24/7 Vespucci', x: -1222.9, y: -906.99, z: 12.33 }
] as const;

let openShopId: number | null = null;

function characterLoaded(): boolean {
  const id = Number(mp.players.local.getVariable('veloria:characterId') ?? 0);
  return Number.isSafeInteger(id) && id > 0;
}

function distanceSquared(x: number, y: number, z: number): number {
  const p = mp.players.local.position;
  const dx = p.x - x;
  const dy = p.y - y;
  const dz = p.z - z;
  return dx * dx + dy * dy + dz * dz;
}

function closestShop(radius = 3.25) {
  if (!characterLoaded()) return null;
  let best: (typeof SHOPS)[number] | null = null;
  let bestDistance = radius * radius;
  for (const shop of SHOPS) {
    const distance = distanceSquared(shop.x, shop.y, shop.z);
    if (distance <= bestDistance) {
      best = shop;
      bestDistance = distance;
    }
  }
  return best;
}

function execAll(code: string) {
  mp.browsers.forEach((browser: BrowserMp) => browser.execute(code));
}

function closeShop() {
  openShopId = null;
  execAll(`document.getElementById('veloria-shop-overlay')?.remove()`);
  mp.gui.cursor.show(false, false);
}

function showShop(json: string) {
  let parsed: any;
  try { parsed = JSON.parse(json); } catch { return; }
  const shopId = Number(parsed?.id);
  if (!Number.isSafeInteger(shopId)) return;
  openShopId = shopId;
  mp.gui.cursor.show(true, true);

  const payload = JSON.stringify(parsed).replace(/</g, '\\u003c');
  execAll(`(() => {
    const data = ${payload};
    document.getElementById('veloria-shop-overlay')?.remove();
    const root = document.createElement('div');
    root.id = 'veloria-shop-overlay';
    root.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(5,7,12,.58);backdrop-filter:blur(4px);font-family:Inter,Arial,sans-serif;color:#fff';
    const panel = document.createElement('section');
    panel.style.cssText = 'width:min(900px,88vw);max-height:78vh;overflow:auto;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:linear-gradient(145deg,rgba(17,22,34,.98),rgba(9,12,20,.98));box-shadow:0 24px 80px rgba(0,0,0,.45);padding:26px';
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:22px';
    header.innerHTML = '<div><div style="font-size:12px;letter-spacing:.22em;opacity:.55">VELORIA MARKET</div><h2 style="margin:5px 0 0;font-size:26px">'+String(data.name || '24/7')+'</h2></div><button id="veloria-shop-close" style="border:0;border-radius:12px;background:rgba(255,255,255,.08);color:white;padding:10px 14px;cursor:pointer">Закрыть</button>';
    panel.appendChild(header);
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px';
    for (const item of Array.isArray(data.items) ? data.items : []) {
      const card = document.createElement('article');
      card.style.cssText = 'border:1px solid rgba(255,255,255,.08);border-radius:16px;background:rgba(255,255,255,.045);padding:18px;display:flex;flex-direction:column;gap:10px';
      card.innerHTML = '<div style="font-size:17px;font-weight:700">'+String(item.name || item.id)+'</div><div style="opacity:.62;font-size:13px">Товар 24/7</div><div style="font-size:22px;font-weight:800;margin-top:auto">$'+Number(item.price || 0).toLocaleString('ru-RU')+'</div>';
      const actions = document.createElement('div');
      actions.style.cssText = 'display:flex;gap:8px';
      for (const qty of [1, 5]) {
        const button = document.createElement('button');
        button.textContent = qty === 1 ? 'Купить' : 'Купить ×5';
        button.style.cssText = 'flex:1;border:0;border-radius:10px;padding:10px 8px;background:rgba(126,106,255,.9);color:#fff;font-weight:700;cursor:pointer';
        button.onclick = () => window.mp?.trigger('veloria:cef:shop:buy', Number(data.id), String(item.id), qty);
        actions.appendChild(button);
      }
      card.appendChild(actions);
      grid.appendChild(card);
    }
    panel.appendChild(grid);
    root.appendChild(panel);
    document.body.appendChild(root);
    document.getElementById('veloria-shop-close')?.addEventListener('click', () => window.mp?.trigger('veloria:cef:shop:close'));
  })();`);
}

mp.events.add('playerReady', () => {
  for (const shop of SHOPS) {
    mp.markers.new(1, new mp.Vector3(shop.x, shop.y, shop.z - 1), 0.75, {
      visible: true,
      dimension: 0
    });
  }
});

mp.events.add('render', () => {
  if (openShopId !== null) return;
  const shop = closestShop();
  if (!shop) return;
  const graphics: any = mp.game.graphics as any;
  graphics.drawText?.(`~w~E~s~  ${shop.name}`, [0.5, 0.83], {
    font: 4,
    color: [255, 255, 255, 230],
    scale: [0.38, 0.38],
    outline: true,
    centre: true
  });
});

mp.keys.bind(0x45, true, () => {
  if (openShopId !== null) return;
  const shop = closestShop();
  if (!shop) return;
  mp.events.callRemote('veloria:shop:open', shop.id);
});

mp.events.add('veloria:shop:data', (json: string) => showShop(String(json ?? '{}')));
mp.events.add('veloria:shop:purchased', () => {
  if (openShopId !== null) mp.events.callRemote('veloria:shop:open', openShopId);
});
mp.events.add('veloria:cef:shop:buy', (shopId: number, item: string, amount: number) => {
  mp.events.callRemote('veloria:shop:buy', shopId, item, amount);
});
mp.events.add('veloria:cef:shop:close', closeShop);
