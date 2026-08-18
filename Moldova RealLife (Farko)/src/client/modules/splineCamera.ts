import { LangString, langStringDefault } from "./lang";
import {DialogInput, MenuClass} from "./menu";
import {system} from "./system";
import {user} from "./user";
import {cameraManager} from "./camera";
import {CamerasManager, drawCamera} from "./cameraManager";
import {CustomEvent} from "./custom.event";
import {hideHud} from "./gui";

let point1: Vector3Mp;
let rot1: Vector3Mp;
let point2: Vector3Mp;
let rot2: Vector3Mp;
let fov: number = 70;

export default class SplineCameraGUI {
    /** Создать нативное меню управления */ 
    public static createMenu(): void {
        let menu = new MenuClass(LangString("splineCamera.a881cea42ea88ca67775889ccc2b032a"));
        menu.exitProtect = true;
        menu.newItem({
            name: LangString("splineCamera.28aff9636cc68dd04b3dcdca4b74de81"),
            desc: LangString("splineCamera.faee5d8cb223ed252772d160dee4fa66"),
            onpress: () => {
                point1 = mp.players.local.position;
                rot1 = mp.game.cam.getGameplayCamRot(0)
            }
        })

        menu.newItem({
            name: LangString("splineCamera.f186b4f47c6dd8ea95e4f0a27c42f3a7"),
            desc: LangString("splineCamera.75750a81bd4085bfcc721387bb6c9a6e"),
            onpress: () => {
                point2 = mp.players.local.position;
                rot2 = mp.game.cam.getGameplayCamRot(0)
            }
        })

        menu.newItem({
            name: LangString("splineCamera.fa5f3df52c3af35ad0fa4a83c3e96317"),
            desc: LangString("splineCamera.c9496c72a59d91565e188900b367c41d"),
            onpress: () => {
                DialogInput(LangString("splineCamera.fdf7eba74b84124a32fbd09b5bb09f1a"), 0, 1000, "int").then(val => {
                    if (!val || isNaN(val) || val <= 0) return;
                    fov = val;
                })
            }
        })

        menu.newItem({
            name: LangString("splineCamera.e5e5df30c2d6b89480248ac9ffe097a3"),
            desc: LangString("splineCamera.e01cfdc4bd200c7bb6de5687367ab86c"),
            onpress: () => {
                MenuClass.closeMenu()
                DialogInput(LangString("splineCamera.f651079db973e5d975ac989076bd3d8b"), 0, 1000000, "int").then(val => {
                    if (!val || isNaN(val) || val <= 0) return;
                    drawCamera(point1, rot1, point2, rot2, fov, val)
                    hideHud(true)
                })
            }
        })
        menu.open();
    }
}

class SplineCamera {
    private readonly _cameraIndex: number;
    private _currentNodeIndex: number = 0;
    private _isActive: boolean;
    
    constructor() {
        this._cameraIndex = mp.game.cam.createCam("DEFAULT_SPLINE_CAMERA", false);
    }

    /**
     * Добавить точку движения камере
     * @param position - Координаты точки
     * @param rotation - Поворот камеры в момент
     */
    public addNode(position: Vector3Mp, rotation: Vector3Mp): void {
        mp.game.cam.addCamSplineNode(
            this._cameraIndex, 
            position.x, position.y, position.z, 
            rotation.x, rotation.y, rotation.z, 
            100, 100, 1
        );
    }

    /**
     * Начать переход к следующей точке
     * @param transitionTime - Время перехода
     * @param waitTime - Время ожидания в точке
     */
    public startTransitionToNextNode(transitionTime: number, waitTime: number = 0): void {
        if (!this._isActive) {
            mp.game.cam.renderScriptCams(true, false, 0, false, false);
            this._isActive = true;
        }
        user.notify(`index ${mp.game.cam.getCamSplineNodePhase(this._cameraIndex)}`)
        user.notify(`index2 ${this._currentNodeIndex}`)
        mp.game.cam.setCamSplineDuration(this._cameraIndex, transitionTime);
        mp.game.cam.setCamSplinePhase(this._cameraIndex, this._currentNodeIndex++);
        //await system.sleep(waitTime + transitionTime);
    }
    
    public destroy(): void {
        mp.game.cam.renderScriptCams(false, false, 0, false, true);
    }
}

let cam = new SplineCamera();
