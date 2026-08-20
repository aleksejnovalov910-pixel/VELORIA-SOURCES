export {};

function execAll(code: string) {
  mp.browsers.forEach((browser: BrowserMp) => browser.execute(code));
}

function refreshFamily() {
  mp.events.callRemote('veloria:tablet:data', 'family');
}

mp.events.add('veloria:cef:family:create', (name: string) => {
  mp.events.callRemote('veloria:families:create', String(name ?? ''));
});

mp.events.add('veloria:cef:family:invite', (targetCharacterId: number) => {
  mp.events.callRemote('veloria:families:invite', Math.trunc(Number(targetCharacterId)));
});

mp.events.add('veloria:cef:family:kick', (targetCharacterId: number) => {
  mp.events.callRemote('veloria:families:kick', Math.trunc(Number(targetCharacterId)));
});

mp.events.add('veloria:cef:family:rank', (targetCharacterId: number, rank: number) => {
  mp.events.callRemote('veloria:families:rank', Math.trunc(Number(targetCharacterId)), Math.trunc(Number(rank)));
});

mp.events.add('veloria:families:refresh', refreshFamily);
mp.events.add('veloria:families:create:result', refreshFamily);
mp.events.add('veloria:families:invite:result', refreshFamily);

mp.events.add('veloria:families:invite:received', (jsonRaw: string) => {
  let payload: any;
  try { payload = JSON.parse(String(jsonRaw ?? '{}')); } catch { return; }
  const familyName = String(payload?.familyName ?? 'семью').slice(0, 64);
  const safeName = JSON.stringify(familyName).replace(/</g, '\\u003c');
  mp.gui.cursor.show(true, true);
  execAll(`(() => {
    document.getElementById('veloria-family-invite')?.remove();
    const root = document.createElement('div');
    root.id = 'veloria-family-invite';
    root.style.cssText = 'position:fixed;inset:0;z-index:100001;display:flex;align-items:center;justify-content:center;background:rgba(2,4,9,.48);font-family:Inter,Arial,sans-serif;color:#fff';
    const card = document.createElement('section');
    card.style.cssText = 'width:min(420px,88vw);padding:24px;border-radius:20px;border:1px solid rgba(255,255,255,.12);background:linear-gradient(145deg,rgba(19,24,37,.99),rgba(8,11,18,.99));box-shadow:0 24px 80px rgba(0,0,0,.5)';
    card.innerHTML = '<div style="font-size:11px;letter-spacing:.2em;opacity:.5">VELORIA FAMILY</div><h2 style="margin:7px 0 8px">Приглашение</h2><p style="margin:0 0 18px;opacity:.72">Вас пригласили в семью <b>'+${safeName}+'</b>. Приглашение действительно 10 минут.</p><div style="display:flex;gap:9px"><button data-family-answer="0" style="flex:1;border:1px solid rgba(255,255,255,.1);border-radius:11px;padding:11px;background:rgba(255,255,255,.06);color:#fff;cursor:pointer">Отклонить</button><button data-family-answer="1" style="flex:1;border:0;border-radius:11px;padding:11px;background:rgba(126,106,255,.92);color:#fff;font-weight:800;cursor:pointer">Принять</button></div>';
    root.appendChild(card);
    root.addEventListener('click', event => {
      const button = event.target?.closest?.('[data-family-answer]');
      if (!button) return;
      const accept = Number(button.dataset.familyAnswer || 0) === 1;
      window.mp?.trigger('veloria:cef:family:invite:respond', accept);
      root.remove();
    });
    document.body.appendChild(root);
  })();`);
});

mp.events.add('veloria:cef:family:invite:respond', (accept: boolean) => {
  execAll(`document.getElementById('veloria-family-invite')?.remove()`);
  mp.gui.cursor.show(false, false);
  mp.events.callRemote('veloria:families:invite:respond', Boolean(accept));
});
