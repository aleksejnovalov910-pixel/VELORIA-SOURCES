import { LangString, langStringDefault } from "./lang";
import {user} from "./user";

const localPlayer = mp.players.local;
const maxSpeed = 10.0;
const minHeight = 15.0;
const maxHeight = 60.0;
const maxAngle = 15.0;
let timePressKey = 0


mp.events.add("rappelSync", (id: number) => {
    let target = mp.players.atRemoteId(id);
    if (!target.handle) return;
    user.stopAnim();
    target.taskRappelFromHeli(10.0);
})

setInterval(() => {
    if (mp.keys.isDown(69)) {
        // if (!RAGE_BETA) return timePressKey = 0;
        const vehicle = localPlayer.vehicle;
        if (!vehicle) return timePressKey = 0;
        if (!mp.game.invoke("0x4E417C547182C84D", vehicle.handle)) return timePressKey = 0;

        if (vehicle.getSpeed() > maxSpeed) {
            user.notify(LangString("rappel.f6f7bb9567f59d9a617ee7023419081e"), "error");
            return timePressKey = 0;
        }

        if (vehicle.getPedInSeat(-1) === localPlayer.handle || vehicle.getPedInSeat(0) === localPlayer.handle) {
            user.notify(LangString("rappel.898ca888e18f795003a52b326f4f1b68"), "error");
            return timePressKey = 0;
        }

        const taskStatus = localPlayer.getScriptTaskStatus(-275944640);
        if (taskStatus === 0 || taskStatus === 1) {
            user.notify(LangString("rappel.0135d5fb5344171464ed79650401a48c"), "error");
            return timePressKey = 0;
        }

        const curHeight = vehicle.getHeightAboveGround();
        if (curHeight < minHeight || curHeight > maxHeight) {
            user.notify(LangString("rappel.2d077222d9c666d9f119793e02a63125"), "error");
            return timePressKey = 0;
        }

        if (!vehicle.isUpright(maxAngle) || vehicle.isUpsidedown()) {
            user.notify(LangString("rappel.6647f93af8b70778111454ab33bd41e0"), "error");
            return timePressKey = 0;
        }

        if (!user.is_gos) {
            user.notify(LangString("rappel.6932683f5a5a490d9c41cfb67f79f0e3"), "error");
            return timePressKey = 0;
        }

        timePressKey++;
        if (timePressKey < 2) return;
        timePressKey = 0;

        user.stopAnim()
        localPlayer.taskRappelFromHeli(10.0);
    } else {
        timePressKey = 0;
    }
}, 1500);