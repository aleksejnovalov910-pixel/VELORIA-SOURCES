import { LangString, langStringDefault } from "./lang";
import {CustomEvent} from "./custom.event"
import {colshapeHandle, colshapes} from "./checkpoints";
import {playAnimationWithResult} from "./anim";


let isAlreadyPlacingBag = false

let localBlip:BlipMp = null
let localColshape:colshapeHandle = null

CustomEvent.registerServer("boxgame:readyStart", (type, name?, time?) => {
    CustomEvent.triggerCef("hud:gamebox", type, name, time)
})

CustomEvent.registerServer("boxgame:stopBag", () => {
    takeBag()
})

CustomEvent.registerServer("boxgame:takeBag", (pos) => {
    localBlip = mp.blips.new(164, new mp.Vector3(pos.x, pos.y, pos.z),
    {
        name: LangString("boxgame.4fccff5b973528b9bd1b1e823da3861f"),
        scale: 0.9,
        color: 1,
        shortRange: false,
        dimension: 0
        });
    
    localColshape = colshapes.new(new mp.Vector3(pos.x, pos.y, pos.z - 1), LangString("boxgame.29176b1288276b4d1a4e4826c321ce05"), (player) => {
        if (isAlreadyPlacingBag) return;
        isAlreadyPlacingBag = true;
        playAnimationWithResult(["anim@heists@money_grab@duffel", "loop"], 3, LangString("boxgame.21f94ac42bdac5fe5f8dc4cd93ecbc78")).then(isDone => {
            if (!isDone) return;
            takeBag();
            CustomEvent.triggerServer("boxgame:bagEnd")
        })
    }, { radius: 2 })
})

let takeBag = () => {
    localBlip.destroy()
    localBlip = null
    localColshape.destroy()
    localColshape = null
    isAlreadyPlacingBag = false
}