let authCamera: CameraMp | null = null;
let active = false;

// Stable interior used for authentication and character selection. Keeping the
// camera inside the GTA Online character room prevents low-detail exterior LOD
// geometry from appearing behind CEF while the world is still streaming.
const scene = {
  player: { x: 402.8664, y: -996.4108, z: -99.00027, heading: 180 },
  camera: { x: 407.25, y: -1001.35, z: -97.65 },
  target: { x: 402.8, y: -996.45, z: -98.55 }
};

function destroyCamera() {
  if (authCamera) {
    authCamera.destroy();
    authCamera = null;
  }
  mp.game.cam.renderScriptCams(false, false, 0, true, false);
}

function createCamera() {
  authCamera = mp.cameras.new(
    'default',
    new mp.Vector3(scene.camera.x, scene.camera.y, scene.camera.z),
    new mp.Vector3(0, 0, 0),
    38
  );
  authCamera.pointAtCoord(scene.target.x, scene.target.y, scene.target.z);
  authCamera.setActive(true);
  mp.game.cam.renderScriptCams(true, false, 0, true, false);
}

function enterAuthScene() {
  if (active) return;
  active = true;

  const player = mp.players.local;
  player.position = new mp.Vector3(scene.player.x, scene.player.y, scene.player.z);
  player.setHeading(scene.player.heading);
  player.freezePosition(true);
  try { player.setAlpha(0); } catch { /* older client build */ }

  mp.game.ui.displayRadar(false);
  try { mp.game.ui.displayHud(false); } catch { /* custom HUD is used */ }
  mp.gui.chat.show(false);

  // Give the interior a frame to stream before presenting the final camera.
  destroyCamera();
  createCamera();
}

export function leaveAuthScene() {
  if (!active) return;
  active = false;
  destroyCamera();

  const player = mp.players.local;
  player.freezePosition(false);
  try { player.setAlpha(255); } catch { /* older client build */ }
  mp.gui.chat.show(true);
}

export function suspendAuthCamera() {
  if (!active) return;
  destroyCamera();
}

export function resumeAuthCamera() {
  if (!active || authCamera) return;
  createCamera();
}

mp.events.add('playerReady', enterAuthScene);
mp.events.add('veloria:character:spawned', leaveAuthScene);
