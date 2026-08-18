// Lang file ready
import {MINER_POSITIONS} from "../../shared/miner";
import {system} from "./system";
import {AttachSystem} from "./attach";

// MINER_POSITIONS.map((item, id) => {
//     if(item.blip) {
//         system.createDynamicBlip(`miner_${id}`, item.blip.id, item.blip.color, system.middlePoint3d(...item.pos), item.name, {
//             dimension: item.d,
//             fraction: item.fraction
//         })
//     }
// })
MINER_POSITIONS.map((item, id) => {
  if (item.blip && item.posblips) {
    item.posblips.forEach((pos, i) => {
      system.createDynamicBlip(
        `miner_${id}_${i}`,
        item.blip.id,
        item.blip.color,
        new mp.Vector3(pos.x, pos.y, pos.z),
        item.name,
        {
          dimension: item.d,
          fraction: item.fraction,
        }
      );
    });
  }
});
