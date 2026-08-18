import { CustomEvent } from "./custom.event";
import { gui, hideHud } from "./gui";

var localPlayer = mp.players.local;

class PassportImage {
  private isActive: boolean = false;
  private camera: CameraMp;

  constructor() {
    this.subscribeToEvents();
  }

  private onStart() {
    if (this.isActive) return;

    this.isActive = true;

    mp.game.cam.setFollowPedCamViewMode(1);

    hideHud(true);

    gui.radar = false;

    // gui.setGui("passport::image");

    this.startCamera();
    localPlayer.freezePosition(true);

    setTimeout(() => {
      this.takePhoto();
    }, 400);
  }

  private startCamera() {
    const playerRot = localPlayer.getRotation(2);

    this.camera = mp.cameras.new("default", localPlayer.position, new mp.Vector3(playerRot.x, playerRot.y, playerRot.z), 17);
    if (this.camera) {
      mp.game.cam.renderScriptCams(true, false, 0, true, false);

      let rot = this.camera.getRot(2);
      localPlayer.setHeading(rot.z)
      const boneCoord = localPlayer.getBoneCoords(-1, 0, 1.5, 0.7);
      
      this.camera.setCoord(boneCoord.x, boneCoord.y, boneCoord.z + 0.02)
      
      
      this.camera.setFov(17)
      this.camera.setActive(true);

      const boneRot = localPlayer.getHeading();

      this.camera.setRot(localPlayer.getRotation(2).x, 90, boneRot + 180, 2);
    }
  }

  private takePhoto() {
    if (!this.camera || !this.isActive) return;

    setTimeout(() => {
      const buferPhoto = new Date().getTime();
      // const owner = localPlayer.user.id;
      const screenResolution = mp.game.graphics.getScreenActiveResolution(100, 100);
      
      try {
        mp.gui.takeScreenshot(`${buferPhoto + '.png'}`, 1, 70, 0);
      }
      catch (e) {
        mp.console.logError(`Error in takeScreenshot: ${e}`, true, true);
      }

      setTimeout(() => {
        CustomEvent.triggerCef("passport:image:take", `http://screenshots/${buferPhoto + '.png'}`, screenResolution.x ?? 1920, screenResolution.y ?? 1080);

        this.stop();
      }, 100)
    }, 100);
  }

  private stop() {
    this.isActive = false;

    if (this.camera && mp.cameras.exists(this.camera)) {
      mp.game.cam.renderScriptCams(false, false, 0, false, false);
      this.camera.setActive(false);
      this.camera.destroy();
      this.camera = null;
    }

    hideHud(false);
    gui.radar = true;

    localPlayer.freezePosition(false);
  }

  private subscribeToEvents() {
    mp.events.add("passport:image:start", this.onStart.bind(this));
  }
}

export default new PassportImage();
