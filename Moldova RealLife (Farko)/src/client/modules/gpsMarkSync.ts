import { LangString, langStringDefault } from "./lang";
import {DialogAccept} from "./accept";
import {CustomEvent} from "./custom.event";
import {user} from "./user";

const player = mp.players.local



mp.events.add("playerCreateWaypoint", (position: Vector3Mp) => {
    if(!player.vehicle || user.isDriver) return;
    DialogAccept(LangString("gpsMarkSync.ddcec24159d5aa1b460e349768239bb0"), "small", 15000).then(status => {
        if(!status) return;
        CustomEvent.triggerServer("gpsMarkSyncRequest", position)
    })
});