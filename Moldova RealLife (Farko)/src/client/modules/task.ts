import { LangString, langStringDefault } from "./lang";
import {CustomEvent} from "./custom.event";
import {system} from "./system";

let blips = new Map<number, BlipMp>();

CustomEvent.registerServer("task:getDrugPoints", (data: [number, number, number, number][]) => {
    blips.forEach(q => {
        if(mp.blips.exists(q)) q.destroy()
    })
    blips = new Map();
    data.map(item => {
        blips.set(item[0], system.createBlip(140, 1, new mp.Vector3(item[1], item[2], item[3]), LangString("task.b5d39a1328f18cda7da9b8129663b2ab"), 0, false))
    })
})