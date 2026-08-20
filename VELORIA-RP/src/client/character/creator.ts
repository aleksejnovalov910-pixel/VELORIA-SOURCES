import { VeloriaEvents } from '../../shared/events/veloria';
import type { CharacterAppearance } from '../../shared/types/appearance';
import { VELORIA_CONFIG } from '../../shared/config/server';
import { suspendAuthCamera, resumeAuthCamera } from '../authScene';
import { applyAppearance } from './appearance';

let creatorCam: CameraMp | null = null;
let active = false;
let yaw = 180;
let distance = 2.05;
let mouseDown = false;
let lastX = 0;

function cameraPosition() {
  const p = mp.players.local.position;
  const r = yaw * Math.PI / 180;
  return new mp.Vector3(
    p.x + Math.sin(r) * distance,
    p.y + Math.cos(r) * distance,
    p.z + 0.68
  );
}

function refreshCamera() {
  if (!creatorCam) return;
  const pos = cameraPosition();
  creatorCam.setCoord(pos.x, pos.y, pos.z);
  creatorCam.pointAtCoord(
    mp.players.local.position.x,
    mp.players.local.position.y,
    mp.players.local.position.z + 0.68
  );
}

export function openCreator(initial?: Partial<CharacterAppearance>) {
  if (active) {
    if (initial && Object.keys(initial).length) applyAppearance(initial as CharacterAppearance);
    return;
  }

  active = true;
  yaw = 180;
  distance = 2.05;
  mouseDown = false;
  suspendAuthCamera();

  const s = VELORIA_CONFIG.creatorScene;
  const player = mp.players.local;
  player.position = new mp.Vector3(s.x, s.y, s.z);
  player.setHeading(s.heading);
  player.freezePosition(true);
  try { player.setAlpha(255); } catch { /* Legacy client compatibility */ }

  creatorCam = mp.cameras.new('default', cameraPosition(), new mp.Vector3(0, 0, 0), 40);
  refreshCamera();
  creatorCam.setActive(true);
  mp.game.cam.renderScriptCams(true, false, 0, true, false);
  mp.gui.cursor.show(true, true);
  mp.gui.chat.show(false);

  if (initial && Object.keys(initial).length) {
    try { applyAppearance(initial as CharacterAppearance); } catch { /* preview is optional */ }
  }

  mp.events.call(VeloriaEvents.CharacterCreatorOpen, JSON.stringify(initial ?? {}));
}

export function closeCreator() {
  if (!active) return;
  active = false;
  mouseDown = false;

  const player = mp.players.local;
  player.freezePosition(true);
  try { player.setAlpha(0); } catch { /* Legacy client compatibility */ }

  if (creatorCam) {
    creatorCam.destroy();
    creatorCam = null;
  }

  mp.game.cam.renderScriptCams(false, false, 0, true, false);
  mp.gui.cursor.show(true, true);
  mp.gui.chat.show(false);
  resumeAuthCamera();
  mp.events.call(VeloriaEvents.CharacterCreatorClose);
}

mp.events.add('render', () => {
  if (!active) return;

  if (mp.game.controls.isDisabledControlPressed(0, 24)) {
    const [x] = mp.gui.cursor.position;
    if (!mouseDown) {
      mouseDown = true;
      lastX = x;
    }

    const dx = x - lastX;
    lastX = x;
    yaw += dx * 0.22;
    refreshCamera();
  } else {
    mouseDown = false;
  }
});

mp.events.add('veloria:creator:zoom', (delta: number) => {
  if (!active) return;
  const direction = Math.sign(Number(delta) || 0);
  distance = Math.max(1.15, Math.min(3.25, distance + direction * 0.12));
  refreshCamera();
});

mp.events.add('veloria:creator:appearance', (appearanceJson: string) => {
  if (!active) return;
  try {
    applyAppearance(JSON.parse(String(appearanceJson ?? '{}')) as CharacterAppearance);
  } catch {
    // An invalid optional preview should never interrupt character creation.
  }
});

mp.events.add('veloria:cef:character:creator:open', (initialJson?: string) => {
  let initial: Partial<CharacterAppearance> = {};
  try {
    initial = JSON.parse(String(initialJson ?? '{}')) as Partial<CharacterAppearance>;
  } catch {
    // use defaults
  }
  openCreator(initial);
});

mp.events.add('veloria:cef:character:creator:close', closeCreator);

mp.events.add('veloria:character:spawned', () => {
  active = false;
  mouseDown = false;
  if (creatorCam) {
    creatorCam.destroy();
    creatorCam = null;
  }
});
