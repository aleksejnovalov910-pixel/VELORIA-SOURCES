const SHOPS = [
  { id: 1, name: '24/7 Strawberry', x: 25.74, y: -1347.33, z: 29.5 },
  { id: 2, name: '24/7 Vinewood', x: 373.88, y: 325.9, z: 103.57 },
  { id: 3, name: '24/7 Mirror Park', x: 1163.38, y: -323.8, z: 69.21 },
  { id: 4, name: '24/7 Vespucci', x: -1222.9, y: -906.99, z: 12.33 }
] as const;

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

mp.events.add('playerReady', () => {
  for (const shop of SHOPS) {
    mp.markers.new(1, new mp.Vector3(shop.x, shop.y, shop.z - 1), 0.75, {
      visible: true,
      dimension: 0
    });
  }
});

mp.events.add('render', () => {
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
  const shop = closestShop();
  if (!shop) return;
  mp.events.callRemote('veloria:shop:open', shop.id);
});
