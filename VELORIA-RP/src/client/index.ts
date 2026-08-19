import { Events } from '../shared/events';

let authBrowser: BrowserMp | null = null;

function openAuth() {
  if (authBrowser) return;
  authBrowser = mp.browsers.new('package://veloria/index.html');
  mp.gui.cursor.show(true, true);
}

function closeAuth() {
  if (!authBrowser) return;
  authBrowser.destroy();
  authBrowser = null;
  mp.gui.cursor.show(false, false);
}

mp.events.add('playerReady', openAuth);

mp.events.add('veloria:cef:login', (username: string, password: string) => {
  mp.events.callRemote(Events.AuthLogin, username, password);
});

mp.events.add('veloria:cef:register', (username: string, password: string) => {
  mp.events.callRemote(Events.AuthRegister, username, password);
});

mp.events.add(Events.AuthResult, (success: boolean, message: string) => {
  authBrowser?.execute(`window.veloriaAuthResult?.(${JSON.stringify(success)}, ${JSON.stringify(message)})`);
});

mp.events.add(Events.CharacterList, (json: string) => {
  authBrowser?.execute(`window.veloriaCharacterList?.(${JSON.stringify(json)})`);
});

mp.events.add('veloria:cef:character:create', (slot: number, firstName: string, lastName: string, appearance: string) => {
  mp.events.callRemote(Events.CharacterCreate, slot, firstName, lastName, appearance);
});

mp.events.add('veloria:cef:character:select', (characterId: number) => {
  mp.events.callRemote(Events.CharacterSelect, characterId);
});

mp.events.add(Events.CharacterSpawned, () => {
  closeAuth();
});
