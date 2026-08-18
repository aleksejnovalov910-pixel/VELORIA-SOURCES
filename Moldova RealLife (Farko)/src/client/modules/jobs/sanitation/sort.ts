import { LangString, langStringDefault } from "../../lang";
import {colshapes, colshapeHandle} from "../../checkpoints";
import {CustomEvent} from "../../custom.event";
import {gui} from "../../gui";
import {createRouteBlip, destroyRouteBlip} from "../../blips";

const sortGameInteractionHandler = () => {
    gui.setGui("sortGarbage");
}

let interaction: colshapeHandle = null;

CustomEvent.registerServer("sanitation:sort:addInteraction", (pos: Vector3Mp) => {
    if (interaction) interaction.destroy();

    interaction = colshapes.new(new mp.Vector3(pos.x, pos.y, pos.z - 1), LangString("sort.33386e43edf4d7fcecb002bc1fd54923"), sortGameInteractionHandler, {
        type: 1,
        radius: 2,
        color: [249, 215, 28, 255]
    })

    createRouteBlip(LangString("sort.613925f2a116caff641ddefc9ea50c89"), new mp.Vector3(pos.x, pos.y, pos.z - 1), 21);
})

CustomEvent.registerServer("sanitation:sort:removeInteraction", () => {
    destroyRouteBlip(LangString("sort.a8429b9bdc7dfa9741a20218a1016fa0"));
    if (interaction) interaction.destroy();
    interaction = null;
})






