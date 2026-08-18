import { LangString, langStringDefault } from "./lang";
import {CustomEvent} from "./custom.event";
import {user} from "./user";
import {system} from "./system";
import {GR6_GPS_TASK_NAME} from "../../shared/gr6";

let blips = new Map<number, BlipMp>()

const name = GR6_GPS_TASK_NAME;

const clearBlips = () => {
    blips.forEach(item => {
        if (mp.blips.exists(item)) item.destroy();
    })
    blips = new Map();
}

CustomEvent.registerServer("gr6:tasks:clear", () => {
    user.clearWaypointHistoryByName(name);
    clearBlips();
})
CustomEvent.registerServer("gr6:tasks:setClear", (index: number) => {
    user.clearWaypointHistoryByName(`${name} #${index}`);
    const item = blips.get(index);
    if (item && mp.blips.exists(item)) item.destroy();
    blips.delete(index);
})
CustomEvent.registerServer("gr6:tasks", async (pos: { x: number, y: number, z: number, id: number }[]) => {
    user.clearWaypointHistoryByName(name);
    clearBlips();
    await system.sleep(500);
    if (pos.length === 0) return user.notify(LangString("gr6.0dbde8358d41ac48d594cb87c7d31877"), "error");
    user.notify(`Ai ${pos.length} sarcini. Adresele sunt disponibile in navigatorul tau. Dupa ce colectezi toate punctele, intoarce-te aici si preda banii.`);
    pos.map(item => {
        blips.set(item.id, system.createBlip(1, 1, new mp.Vector3(item.x, item.y, item.z), LangString("gr6.eb72fee31a65148691540fb0f85c267c", item.id), 0, false))
        user.addWaypointHistory(item.x, item.y, item.z, `${name} #${item.id}`);
    })
})