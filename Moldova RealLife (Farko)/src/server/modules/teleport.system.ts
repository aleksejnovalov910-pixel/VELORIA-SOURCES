import {CustomEvent} from "./custom.event";
import {TELEPORT_CONFIG} from "../../shared/teleport.system";
import { LEVEL_PERMISSIONS } from "../../shared/level.permissions";

CustomEvent.registerClient("teleport:go", (player, confid: number, index: number) => {
    const user = player.user;
    if(!user) return;
    const conf = TELEPORT_CONFIG[confid];
    if(conf.oneway && !index) return;
    if (conf.minHours) {
        if (user.playtime < LEVEL_PERMISSIONS.CASIOENTER) {
            return player.notify(`Ai nevoie de ${LEVEL_PERMISSIONS.CASIOENTER} ore jucate pentru a intra in cazino.`, 'error');
        }
    }

    if(conf.cost && user.money < conf.cost) return player.notify(player.user.LangString("teleport.cost"), "error");

    if(conf.cost) user.removeMoney(conf.cost, true, player.user.LangString("teleport.reason", conf.name));
    const pos = conf.points[index];
    if(conf.vehicle) user.teleportVeh(pos.x, pos.y, pos.z, pos.h, pos.d != -1 ? pos.d : player.dimension);
    else user.teleport(pos.x, pos.y, pos.z, pos.h, pos.d != -1 ? pos.d : player.dimension);
});