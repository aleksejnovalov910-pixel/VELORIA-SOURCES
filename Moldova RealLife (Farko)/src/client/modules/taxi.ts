import { LangString, langStringDefault } from "./lang";
import {CustomEvent} from "./custom.event";
import {user} from "./user";
import {system} from "./system";
import {TAXI_CONF} from "../../shared/taxi";
import {colshapes} from "./checkpoints";
import {dispatch} from "./dispatch";

let currentTaxiCar: number;

CustomEvent.registerServer("taxi:car", (id: number) => {
    currentTaxiCar = id;
})

CustomEvent.registerServer("phone:requestTaxi", () => {
    let pos = system.getWaypointPosition();
    if(!pos || pos.x == 0) return user.notify(LangString("taxi.1dd4a9342e1cfc1a7508fa35844779db"), "error", "CHAR_TAXI");
    if(system.distanceToPos2D(mp.players.local.position, pos) < 100) return user.notify(LangString("taxi.bd01e0920bf36bb3b1ad03e474bcb1f8"), "error", "CHAR_TAXI");
    const startZone = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z));
    const endZone = mp.game.ui.getLabelText(mp.game.zone.getNameOfZone(pos.x, pos.y, pos.z));
    CustomEvent.triggerServer("phone:requestTaxi", pos, startZone, endZone);
})

let call = false;
let timer = 120;

CustomEvent.registerServer("phone:requestPolice", () => {
    if(call) return user.notify("Ai efectuat recent un apel");
    call = true;
    setTimeout(() => {
        call = false;
    }, timer * 1000)
    dispatch.call([2, 7], LangString("taxi.9aeacc7034a472bdf3ed92027300515e"), true);
})

CustomEvent.register("phone:requestEms", () => {
    if(call) return user.notify("Ai efectuat recent un apel");
    call = true;
    setTimeout(() => {
        call = false;
    }, timer * 1000)
    dispatch.call(16, LangString("taxi.e2aa1bbcf92c11128773fc1f380a8434"), true);
})

CustomEvent.registerServer("phone:requestEms", () => {
    if(call) return user.notify("Ai efectuat recent un apel");
    call = true;
    setTimeout(() => {
        call = false;
    }, timer * 1000)
    dispatch.call(16, LangString("taxi.04df3ed2ae4d39a1db6a98cf0c7d69fc"), true);
})

CustomEvent.registerServer("phone:requestNews", () => {
    if(call) return user.notify("Ai efectuat recent un apel");
    call = true;
    setTimeout(() => {
        call = false;
    }, timer * 1000)
    dispatch.call(5, LangString("taxi.aec187ff071c8740ce1412f6862c483f"), true);
})

CustomEvent.registerServer("taxi:random", (index: number) => {
    const cfg = TAXI_CONF.ordersNpc[index];
    // user.clearWaypointHistoryByName('[TAXI]');
    user.notify(LangString("taxi.4ccaf2fa12998952fb9a433bd9eb361e"), "success")
    // user.setWaypoint(cfg.start.x, cfg.start.y, cfg.start.z, true, '[TAXI] Забрать пассажира')

    const blip = system.createBlip(TAXI_CONF.blipNpcOrder.blipStart, TAXI_CONF.blipNpcOrder.color, new mp.Vector3(cfg.start.x, cfg.start.y, cfg.start.z), LangString("taxi.6a29a07e4f64209631540f6e06b0e27a"))
    blip.setRoute(true)
    blip.setRouteColour(TAXI_CONF.blipNpcOrder.color);

    let shape = colshapes.new(cfg.start, LangString("taxi.c370876f8522929f4478eb8258cc1e5b"), player => {
        if(!player.vehicle || player.vehicle.remoteId !== currentTaxiCar) return user.notify(LangString("taxi.626d08d594db39a8fca68f609c0ec9ee"), "error")
        if(player.getSpeed() > 1) return user.notify(LangString("taxi.b30f4e6be89a04e72225c1ed661bdb9c"), "error");
        shape.destroy()
        user.notify(LangString("taxi.ba31b2c463ce9426df2dd475a31fd75d"), "success");
        // user.clearWaypointHistoryByName('[TAXI]');
        setTimeout(() => {
            // user.setWaypoint(cfg.end.x, cfg.end.y, cfg.end.z, true, '[TAXI] Доставить пассажира')
            if(blip && mp.blips.exists(blip)) blip.destroy()
            const blip2 = system.createBlip(TAXI_CONF.blipNpcOrder.blipEnd, TAXI_CONF.blipNpcOrder.color, new mp.Vector3(cfg.end.x, cfg.end.y, cfg.end.z), LangString("taxi.48a51cbe05784cd424dbb132a94942f8"))
            blip2.setRoute(true)
            blip2.setRouteColour(TAXI_CONF.blipNpcOrder.color);
            shape = colshapes.new(cfg.end, LangString("taxi.d24ac2ba84d2bd40a2e449c5cee9961b"), player => {
                if(!player.vehicle || player.vehicle.remoteId !== currentTaxiCar) return user.notify(LangString("taxi.d298b0d4aa65b3801f014205aa2774fa"), "error")
                if(player.getSpeed() > 1) return user.notify(LangString("taxi.2eaf91225c2d250b39997a37342dc606"), "error");
                if(blip2 && mp.blips.exists(blip2)) blip2.destroy()
                shape.destroy()
                user.notify(LangString("taxi.26f4035c2d6c4070361b1d5a641bc9c7"), "success");
                user.clearWaypointHistoryByName("[TAXI]");
                CustomEvent.triggerServer("taxi:delivernpc")
            }, {
                type: 27,
                radius: 5
            })
        }, 1000)
    }, {
        type: 27,
        radius: 5
    })
})