import { LangString, langStringDefault } from "./lang";
import {CustomEvent} from "./custom.event";
import {SHOOTING_RANGES} from "../../shared/shooting";
import {system} from "./system";
import {TextTimerBar} from "./bars/classes/TextTimerBar";
import {CheckpointTimerBar} from "./bars/classes/CheckpointTimerBar";
import {colshapes} from "./checkpoints";
import {user} from "./user";
const player = mp.players.local;
let inShooting = false;

let objectsShoot:[ObjectMp, BlipMp, number][] = [];
const clearObjects = () => {
    objectsShoot.map(item => {
        if(item){
            if (mp.objects.exists(item[0])) item[0].destroy();
            if (mp.blips.exists(item[1])) item[1].destroy();
        }
    })
    objectsShoot = []
}
const countObjects = () => {
    return objectsShoot.length
}
let CheckpointBar: TextTimerBar;
let checkPointCnt = 0;
CustomEvent.registerServer("shooting:start", async (id: number) => {
    const config = SHOOTING_RANGES[id];
    if(!config) return
    inShooting = true;
    clearObjects();
    config.items.map(item => {
        const pos = new mp.Vector3(item.position.x, item.position.y, item.position.z)
        setTimeout(() => {
            const obj = mp.objects.new(mp.game.joaat(item.model), pos, {
                dimension: player.dimension,
                rotation: new mp.Vector3(item.rotation.x * -1, item.rotation.y * -1, item.rotation.z * -1)
            });
            setTimeout(() => {
                objectsShoot.push([obj, system.createBlip(119, 1, pos, LangString("shooting.0efa3a2639a48904a40f45d2afdb8f1e"), player.dimension, false), obj.handle]);
                obj.setCanBeDamaged(true)
            }, 100)
        }, 10)
    })
    const startMS = system.timestampMS
    const start = system.timestamp
    const mapTimeBar = new TextTimerBar(LangString("shooting.e79061a7c75965289e78b2afcde193df"), system.secondsToString(0));
    CheckpointBar = new TextTimerBar(LangString("shooting.32ecc9bf7573e5df44bf194cf2eb7e94"), LangString("shooting.55eea6f1ec7fe43274f3f02b12707420", config.items.length));
    checkPointCnt = 0;

    setTimeout(() => {
        let int = setInterval(() => {
            if(!inShooting || user.dead){
                if(mapTimeBar && mapTimeBar.exists()) mapTimeBar.destroy();
                if(CheckpointBar && CheckpointBar.exists()) CheckpointBar.destroy();
                clearObjects();
                clearInterval(int);
            } else {
                const count = countObjects();
                mapTimeBar.text = system.secondsToString(system.timestamp - start)
                CheckpointBar.text = `${checkPointCnt} / ${config.items.length}`
                if(count == 0 || mp.players.local.isDead() || mp.players.local.getHealth() <= 0){
                    inShooting = false;
                    CustomEvent.triggerServer("shooting:finish", id, count == 0, system.timestampMS - startMS);
                    if(colshape){
                        colshape.destroy()
                        colshape = null
                    }
                }
            }
        }, 100)
    }, 1000)

    let colshape = colshapes.new(new mp.Vector3(config.exit.x, config.exit.y, config.exit.z), LangString("shooting.6385ed0588370867cd08febfceca4f75"), () => {
        inShooting = false;
        if(countObjects() > 0) user.notify(LangString("shooting.76335583162bd711fdf8b348ef220988"), "error")
        CustomEvent.triggerServer("shooting:finish", id, countObjects() > 0, system.timestampMS - startMS);
        colshape.destroy()
        colshape = null
    }, {
        drawStaticName: "scaleform",
        dimension: player.dimension
    })

})


mp.events.add("playerWeaponShot", (targetPosition: Vector3Mp, targetEntity: any) => {
    if (!inShooting || objectsShoot.length === 0) return;
    let index = objectsShoot.findIndex(q => mp.objects.exists(q[0]) && q[0].getMaxHealth() > q[0].getHealth());
    if(index === -1) return
    checkPointCnt++;
    if (mp.objects.exists(objectsShoot[index][0])) objectsShoot[index][0].destroy();
    if (mp.blips.exists(objectsShoot[index][1])) objectsShoot[index][1].destroy();
    objectsShoot.splice(index, 1);
});

mp.events.add("playerDeath", () => {
    if (!inShooting) return;

    CustomEvent.triggerServer("shooting:dead");
})