import { LangString, langStringDefault } from "../../lang";
import {CustomEvent} from "../../custom.event";

let blip: BlipMp = null;
CustomEvent.registerServer("firefighter:deleteBlip", () => {
    if (blip) {
        blip.destroy();
        blip = null;
    }
});

CustomEvent.registerServer("firefighter:setBlip", (position: Vector3Mp) => {
    blip = mp.blips.new(1, position, {
        color: 1,
        name: LangString("job.3d1a036711b3ffd7f7822d217d8e2892"),
        shortRange: false
    });

    mp.game.ui.setNewWaypoint(position.x, position.y);
});