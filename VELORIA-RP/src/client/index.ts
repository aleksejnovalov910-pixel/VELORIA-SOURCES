import { Events } from '../shared/events';
import { VeloriaEvents } from '../shared/events/veloria';
import { setHudVisible } from './hud';
import './controls';
import './vehicles';
import './character/creator';

let browser: BrowserMp | null = null;
let authenticated = false;
let activeOverlay: string | null = null;

const ensureBrowser = () => {
  if (!browser) browser = mp.browsers.new('package://veloria/index.html');
  return browser;
};

const exec = (code: string) => ensureBrowser().execute(code);
const cursor = (state: boolean) => mp.gui.cursor.show(state, state);

function openAuth() {
  ensureBrowser();
  authenticated = false;
  activeOverlay = null;
  setHudVisible(false);
  cursor(true);
}

function closeAuth() {
  authenticated = true;
  activeOverlay = null;
  cursor(false);
  setHudVisible(true);
}

function overlay(name: string, state: boolean, data: unknown = {}) {
  if (!authenticated) return;
  if (state) {
    activeOverlay = name;
    cursor(true);
  } else if (activeOverlay === name) {
    activeOverlay = null;
    cursor(false);
  }
  exec(`window.veloriaOverlay?.(${JSON.stringify(name)},${JSON.stringify(state)},${JSON.stringify(JSON.stringify(data))})`);
}

mp.events.add('playerReady', openAuth);
mp.events.add('veloria:cef:login', (u: string, p: string) => mp.events.callRemote(Events.AuthLogin, u, p));
mp.events.add('veloria:cef:register', (u: string, p: string) => mp.events.callRemote(Events.AuthRegister, u, p));
mp.events.add(Events.AuthResult, (ok: boolean, msg: string) => exec(`window.veloriaAuthResult?.(${JSON.stringify(ok)},${JSON.stringify(msg)})`));
mp.events.add(Events.CharacterList, (json: string) => exec(`window.veloriaCharacterList?.(${JSON.stringify(json)})`));
mp.events.add('veloria:cef:character:create', (slot: number, f: string, l: string, a: string) => mp.events.callRemote(Events.CharacterCreate, slot, f, l, a));
mp.events.add('veloria:cef:character:select', (id: number) => mp.events.callRemote(Events.CharacterSelect, id));
mp.events.add(Events.CharacterSpawned, closeAuth);

mp.events.add(VeloriaEvents.HudSetVisible, (state: boolean) => exec(`window.veloriaHudVisible?.(${JSON.stringify(state)})`));
mp.events.add(VeloriaEvents.HudUpdate, (json: string) => exec(`window.veloriaHudUpdate?.(${JSON.stringify(json)})`));

mp.events.add(VeloriaEvents.PhoneToggle, () => {
  const next = activeOverlay !== 'phone';
  if (next) mp.events.callRemote('veloria:phone:data');
  else overlay('phone', false);
});
mp.events.add('veloria:phone:data', (json: string) => {
  let data = {};
  try { data = JSON.parse(json); } catch {}
  overlay('phone', true, data);
});

mp.events.add(VeloriaEvents.TabletToggle, () => overlay('tablet', activeOverlay !== 'tablet'));
mp.events.add(VeloriaEvents.SettingsToggle, () => overlay('settings', activeOverlay !== 'settings'));
mp.events.add(VeloriaEvents.InventoryToggle, () => {
  const next = activeOverlay !== 'inventory';
  if (next) mp.events.callRemote('veloria:inventory:data');
  else overlay('inventory', false);
});
mp.events.add('veloria:inventory:data', (json: string) => {
  let data = [];
  try { data = JSON.parse(json); } catch {}
  overlay('inventory', true, data);
});

mp.events.add('veloria:cef:tablet:open', (app: string) => {
  const normalized = String(app ?? '').trim().toLowerCase();
  if (normalized === 'bank') mp.events.callRemote('veloria:bank:balance');
  else if (normalized === 'market') mp.events.callRemote('veloria:market:list');
  else if (normalized === 'vehicles' || normalized === 'transport') mp.events.callRemote('veloria:tablet:data', 'transport');
  else if (normalized === 'property') mp.events.callRemote('veloria:tablet:data', 'property');
  else if (normalized === 'jobs' || normalized === 'job') mp.events.callRemote('veloria:tablet:data', 'job');
  else if (normalized === 'family') mp.events.callRemote('veloria:tablet:data', 'family');
  else if (normalized === 'faction') mp.events.callRemote('veloria:tablet:data', 'faction');
  else if (normalized === 'business' || normalized === 'businesses') mp.events.callRemote('veloria:tablet:data', 'business');
  else if (normalized === 'equipment' || normalized === 'clothes') mp.events.callRemote('veloria:tablet:data', 'equipment');
  else if (normalized === 'dmv') mp.events.callRemote('veloria:dmv:history');
  else if (normalized === 'impound') mp.events.callRemote('veloria:impound:list');
  else exec(`window.veloriaNotify?.('info',${JSON.stringify('Раздел пока не подключен')})`);
});
mp.events.add('veloria:tablet:data', (section: string, json: string) => {
  let data: any = null;
  try { data = JSON.parse(json); } catch {}
  const normalized = String(section ?? '').trim().toLowerCase();
  const map: Record<string,string> = {
    transport: 'transport',
    property: 'property',
    job: 'job',
    family: 'family',
    faction: 'faction',
    business: 'business',
    equipment: 'equipment'
  };
  overlay(map[normalized] ?? 'tablet', true, data);
});

mp.events.add('veloria:dmv:history', (json: string) => {
  let data: unknown = [];
  try { data = JSON.parse(json); } catch {}
  overlay('dmv', true, data);
});
mp.events.add('veloria:impound:data', (json: string) => {
  let data: unknown = [];
  try { data = JSON.parse(json); } catch {}
  overlay('impound', true, data);
});
mp.events.add('veloria:impound:released', () => mp.events.callRemote('veloria:impound:list'));

mp.events.add('veloria:bank:balance', (cash: number, bank: number) => overlay('bank', true, { cash, bank }));
mp.events.add('veloria:cef:bank:deposit', (amount: number) => mp.events.callRemote('veloria:bank:deposit', amount));
mp.events.add('veloria:cef:bank:withdraw', (amount: number) => mp.events.callRemote('veloria:bank:withdraw', amount));
mp.events.add('veloria:cef:bank:transfer', (target: number, amount: number) => mp.events.callRemote('veloria:bank:transfer', target, amount));

mp.events.add('veloria:market:data', (json: string) => {
  let data = [];
  try { data = JSON.parse(json); } catch {}
  overlay('market', true, data);
});
mp.events.add('veloria:cef:market:buy', (id: number) => mp.events.callRemote('veloria:market:buy', id));
mp.events.add('veloria:market:purchased', () => mp.events.callRemote('veloria:market:list'));

mp.events.add('veloria:cef:overlay:close', () => {
  activeOverlay = null;
  cursor(false);
});
mp.events.add('veloria:cef:settings', (json: string) => mp.events.callRemote('veloria:settings:save', json));
mp.events.add(VeloriaEvents.Notify, (type: string, text: string) => exec(`window.veloriaNotify?.(${JSON.stringify(type)},${JSON.stringify(text)})`));
