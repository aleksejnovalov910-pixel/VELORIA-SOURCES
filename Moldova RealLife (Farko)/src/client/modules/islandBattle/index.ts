import { LangString, langStringDefault } from "../lang";
import {CustomEvent} from "../custom.event";
import {user} from "../user";
import {playAnimationWithResult} from "../anim";
import {system} from "../system";

let prepareBlip: BlipMp = null;

CustomEvent.registerServer("islandBattle:createPrepareBlip", (pos: Vector3Mp) => {
    if (prepareBlip !== null) return;

    prepareBlip = mp.blips.new(159, pos, {
        color: 1,
        name: LangString("index.7930af217753db2b848775d3207ba8f5"),
        shortRange: true,
        scale: 1.5
    })

    user.setWaypoint(pos.x, pos.y, pos.z);
})

CustomEvent.registerServer("islandBattle:destroyPrepareBlip", () => {
    if (prepareBlip === null) return;
    if (prepareBlip.doesExist()) prepareBlip.destroy();
})

CustomEvent.registerServer("islandBattle:pointStart", (id: number, pos: Vector3Mp, time: number) => {
    const player = mp.players.local;

    playAnimationWithResult(
        ["anim@heists@money_grab@duffel", "loop"],
        time,
        LangString("index.0ce5fbe13476d60e7e938812bc4bff41"),
        system.headingToCoord(player.position, pos) + 90
    ).then(status => {
        mp.events.callRemote(`islandBattle:interactResult:${id}`, status);
    })
})