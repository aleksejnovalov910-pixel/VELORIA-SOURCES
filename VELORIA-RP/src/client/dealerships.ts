export {};

type DealerPoint = { id: number; name: string; x: number; y: number; z: number };
const DEALERS: DealerPoint[] = [
  { id: 1, name: 'Premium Deluxe Motorsport', x: -33.7, y: -1102.0, z: 26.4 },
  { id: 2, name: 'Luxury Autos', x: -796.3, y: -220.7, z: 37.1 }
];
let current: DealerPoint | null = null;
let open = false;

function distance(a: Vector3Mp, b: DealerPoint) {
  const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
function execAll(code: string) { mp.browsers.forEach((browser: BrowserMp) => browser.execute(code)); }
function close() {
  if (!open) return;
  open = false;
  mp.gui.cursor.show(false, false);
  execAll(`document.getElementById('veloria-dealership')?.remove()`);
}
function render(dealershipId: number, raw: string) {
  let stock: any[] = [];
  try { stock = JSON.parse(String(raw ?? '[]')); } catch { stock = []; }
  const safe = JSON.stringify(stock).replace(/</g, '\\u003c');
  const point = DEALERS.find((item) => item.id === Number(dealershipId));
  const title = JSON.stringify(point?.name ?? 'VELORIA AUTOS').replace(/</g, '\\u003c');
  open = true;
  mp.gui.cursor.show(true, true);
  execAll(`(() => {
    document.getElementById('veloria-dealership')?.remove();
    const stock=${safe}; const title=${title};
    const root=document.createElement('div'); root.id='veloria-dealership';
    root.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(4,6,12,.82);display:flex;align-items:center;justify-content:center;font-family:Inter,Arial,sans-serif;color:#fff';
    const card=document.createElement('section'); card.style.cssText='width:min(1040px,92vw);max-height:82vh;overflow:auto;padding:26px;border-radius:24px;background:linear-gradient(145deg,#121827,#080b12);border:1px solid rgba(255,255,255,.1);box-shadow:0 28px 100px rgba(0,0,0,.55)';
    const money=(n)=>'$'+Number(n||0).toLocaleString('en-US');
    card.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center"><div><div style="font-size:11px;letter-spacing:.2em;opacity:.5">VELORIA AUTOS</div><h1 style="margin:6px 0 0;font-size:28px">'+title+'</h1></div><button id="vd-close" style="border:0;border-radius:10px;padding:10px 14px;background:rgba(255,255,255,.08);color:#fff;cursor:pointer">Закрыть</button></div><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:22px">'+stock.map(v=>'<article style="padding:18px;border-radius:17px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.08)"><div style="font-size:18px;font-weight:800">'+String(v.model||'Vehicle')+'</div><div style="opacity:.55;margin:7px 0 16px">В наличии: '+Number(v.stock||0)+'</div><div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><b>'+money(v.price)+'</b><button data-buy="'+Number(v.id)+'" style="border:0;border-radius:10px;padding:10px 15px;background:#7668ff;color:#fff;font-weight:800;cursor:pointer">Купить</button></div></article>').join('')+'</div>';
    root.appendChild(card); document.body.appendChild(root);
    root.addEventListener('click',e=>{const t=e.target;if(t?.id==='vd-close'){window.mp?.trigger('veloria:cef:dealership:close');return;}const b=t?.closest?.('[data-buy]');if(b)window.mp?.trigger('veloria:cef:dealership:buy',Number(b.dataset.buy));});
  })();`);
}

for (const point of DEALERS) {
  mp.markers.new(1, new mp.Vector3(point.x, point.y, point.z - 1), 1.2, { color: [118, 104, 255, 150], visible: true, dimension: 0 });
  mp.labels.new(`~w~${point.name}\n~p~E ~w~— автосалон`, new mp.Vector3(point.x, point.y, point.z + 0.5), { los: false, font: 4, drawDistance: 20, dimension: 0 });
}

mp.events.add('render', () => {
  if (open) return;
  current = null;
  const pos = mp.players.local.position;
  for (const point of DEALERS) if (distance(pos, point) <= 2.2) { current = point; break; }
});
mp.keys.bind(0x45, true, () => { if (!open && current) mp.events.callRemote('veloria:dealership:stock', current.id); });
mp.events.add('veloria:dealership:data', render);
mp.events.add('veloria:dealership:purchased', () => { if (current) mp.events.callRemote('veloria:dealership:stock', current.id); });
mp.events.add('veloria:cef:dealership:buy', (stockId: number) => mp.events.callRemote('veloria:dealership:buy', Math.trunc(Number(stockId))));
mp.events.add('veloria:cef:dealership:close', close);
