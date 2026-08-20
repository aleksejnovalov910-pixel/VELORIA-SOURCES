export {};

let menuOpen = false;

function loaded(): boolean {
  return Number(mp.players.local.getVariable('veloria:characterId') ?? 0) > 0;
}

function execAll(code: string) {
  mp.browsers.forEach((browser: BrowserMp) => browser.execute(code));
}

function closeMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  execAll(`document.getElementById('veloria-interaction-menu')?.remove()`);
  mp.gui.cursor.show(false, false);
}

function openMenu() {
  if (menuOpen || !loaded()) return;
  menuOpen = true;
  mp.gui.cursor.show(true, true);
  execAll(`(() => {
    document.getElementById('veloria-interaction-menu')?.remove();
    const root = document.createElement('div');
    root.id = 'veloria-interaction-menu';
    root.style.cssText = 'position:fixed;inset:0;z-index:99998;display:flex;align-items:center;justify-content:center;background:rgba(2,4,9,.38);font-family:Inter,Arial,sans-serif;color:white';
    const panel = document.createElement('section');
    panel.style.cssText = 'width:420px;padding:20px;border-radius:22px;border:1px solid rgba(255,255,255,.11);background:linear-gradient(145deg,rgba(18,23,36,.97),rgba(8,11,18,.97));box-shadow:0 22px 75px rgba(0,0,0,.48)';
    panel.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px"><div><div style="font-size:11px;letter-spacing:.2em;opacity:.5">VELORIA</div><h2 style="margin:4px 0 0;font-size:22px">Взаимодействие</h2></div><button data-action="close" style="border:0;border-radius:10px;background:rgba(255,255,255,.08);color:#fff;padding:9px 12px;cursor:pointer">ESC</button></div>';
    const actions = [
      ['inventory','Инвентарь','I'],
      ['phone','Телефон','↑'],
      ['tablet','Планшет','↓'],
      ['settings','Настройки','F2'],
      ['vehicleLock','Закрыть / открыть авто','L'],
      ['vehicleEngine','Двигатель','J'],
      ['endRental','Завершить аренду','']
    ];
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:9px';
    for (const [id,label,key] of actions) {
      const button = document.createElement('button');
      button.dataset.action = id;
      button.style.cssText = 'min-height:64px;text-align:left;border:1px solid rgba(255,255,255,.075);border-radius:13px;background:rgba(255,255,255,.045);color:#fff;padding:12px 14px;cursor:pointer';
      button.innerHTML = '<div style="font-weight:800">'+label+'</div><div style="margin-top:3px;font-size:11px;opacity:.45">'+key+'</div>';
      grid.appendChild(button);
    }
    panel.appendChild(grid);
    root.appendChild(panel);
    root.addEventListener('click', event => {
      const target = event.target?.closest?.('[data-action]');
      if (!target) return;
      window.mp?.trigger('veloria:cef:interaction:action', String(target.dataset.action || ''));
    });
    document.body.appendChild(root);
  })();`);
}

mp.keys.bind(0x47, true, () => {
  if (!loaded()) return;
  if (menuOpen) closeMenu(); else openMenu();
});

mp.keys.bind(0x1B, true, () => {
  if (menuOpen) closeMenu();
});

mp.events.add('veloria:cef:interaction:action', (actionRaw: string) => {
  const action = String(actionRaw ?? '');
  closeMenu();
  switch (action) {
    case 'inventory': mp.events.call('veloria:inventory:toggle'); break;
    case 'phone': mp.events.call('veloria:phone:toggle'); break;
    case 'tablet': mp.events.call('veloria:tablet:toggle'); break;
    case 'settings': mp.events.call('veloria:settings:toggle'); break;
    case 'vehicleLock': mp.events.call('veloria:vehicle:lock'); break;
    case 'vehicleEngine': mp.events.call('veloria:vehicle:engine'); break;
    case 'endRental': mp.events.callRemote('veloria:rental:end'); break;
    case 'close': break;
  }
});

mp.events.add('veloria:character:spawned', closeMenu);
