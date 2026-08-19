import { VeloriaEvents } from '../../shared/events/veloria';
import type { CharacterAppearance } from '../../shared/types/appearance';
import { VELORIA_CONFIG } from '../../shared/config/server';

let creatorCam: CameraMp | null = null;
let active = false;
let yaw = 180;
let distance = 2.1;
let mouseDown = false;
let lastX = 0;

function cameraPosition() {
  const p = mp.players.local.position;
  const r = yaw * Math.PI / 180;
  return new mp.Vector3(p.x + Math.sin(r) * distance, p.y + Math.cos(r) * distance, p.z + 0.65);
}

function refreshCamera() {
  if (!creatorCam) return;
  const pos = cameraPosition();
  creatorCam.setCoord(pos.x, pos.y, pos.z);
  creatorCam.pointAtCoord(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z + 0.65);
}

export function openCreator(initial?: Partial<CharacterAppearance>) {
  active = true;
  const s = VELORIA_CONFIG.creatorScene;
  mp.players.local.position = new mp.Vector3(s.x, s.y, s.z);
  mp.players.local.setHeading(s.heading);
  mp.players.local.freezePosition(true);
  creatorCam = mp.cameras.new('default', cameraPosition(), new mp.Vector3(0,0,0), 45);
  refreshCamera(); creatorCam.setActive(true); mp.game.cam.renderScriptCams(true,false,0,true,false);
  mp.gui.cursor.show(true,true);
  mp.gui.chat.show(false);
  mp.events.call(VeloriaEvents.CharacterCreatorOpen, JSON.stringify(initial ?? {}));
}

export function closeCreator() {
  active = false; mp.players.local.freezePosition(false); mp.gui.cursor.show(false,false); mp.gui.chat.show(true);
  if (creatorCam) { creatorCam.destroy(); creatorCam = null; }
  mp.game.cam.renderScriptCams(false,false,0,true,false);
  mp.events.call(VeloriaEvents.CharacterCreatorClose);
}

mp.events.add('render', () => {
  if (!active) return;
  if (mp.game.controls.isDisabledControlPressed(0, 24)) {
    const [x] = mp.gui.cursor.position;
    if (!mouseDown) { mouseDown = true; lastX = x; }
    const dx = x - lastX; lastX = x; yaw += dx * 0.25; refreshCamera();
  } else mouseDown = false;
});

mp.events.add('veloria:creator:zoom', (delta:number) => { if (!active) return; distance = Math.max(1.25, Math.min(3.5, distance + delta * 0.1)); refreshCamera(); });
