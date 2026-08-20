let authCamera: CameraMp | null = null;
let active = false;

const scene = {
  player: { x: -1037.72, y: -2737.88, z: 20.17 },
  camera: { x: -1025.5, y: -2760.0, z: 34.0 },
  target: { x: -1044.0, y: -2735.0, z: 22.0 }
};

function destroyCamera() {
  if (authCamera) {
    authCamera.destroy();
    authCamera = null;
  }
  mp.game.cam.renderScriptCams(false, false, 0, true, false);
}

function enterAuthScene() {
  if (active) return;
  active = true;

  const player = mp.players.local;
  player.position = new mp.Vector3(scene.player.x, scene.player.y, scene.player.z);
  player.freezePosition(true);
  try { player.setAlpha(0); } catch { /* older client build */ }

  mp.game.ui.displayRadar(false);
  try { mp.game.ui.displayHud(false); } catch { /* custom HUD is used anyway */ }
  mp.gui.chat.show(false);

  destroyCamera();
  authCamera = mp.cameras.new(
    'default',
    new mp.Vector3(scene.camera.x, scene.camera.y, scene.camera.z),
    new mp.Vector3(0, 0, 0),
    42
  );
  authCamera.pointAtCoord(scene.target.x, scene.target.y, scene.target.z);
  authCamera.setActive(true);
  mp.game.cam.renderScriptCams(true, false, 0, true, false);
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
  authCamera = mp.cameras.new(
    'default',
    new mp.Vector3(scene.camera.x, scene.camera.y, scene.camera.z),
    new mp.Vector3(0, 0, 0),
    42
  );
  authCamera.pointAtCoord(scene.target.x, scene.target.y, scene.target.z);
  authCamera.setActive(true);
  mp.game.cam.renderScriptCams(true, false, 0, true, false);
}

mp.events.add('playerReady', enterAuthScene);
mp.events.add('veloria:character:spawned', leaveAuthScene);
