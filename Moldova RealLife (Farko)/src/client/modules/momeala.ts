// Lang file ready
import {MOMEALA_POSITIONS} from "../../shared/momeala";
import {system} from "./system";
import {AttachSystem} from "./attach";

MOMEALA_POSITIONS.map((item, id) => {
    if(item.blip) {
        system.createDynamicBlip(`momeala_${id}`, item.blip.id, item.blip.color, system.middlePoint3d(...item.pos), item.name, {
            dimension: item.d,
            fraction: item.fraction
        })
    }
})

