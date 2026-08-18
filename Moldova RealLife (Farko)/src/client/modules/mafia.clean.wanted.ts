import { LangString, langStringDefault } from "./lang";
import {NpcSpawn} from "./npc.dialog";
import {MAFIA_CLEAN_WANTED_CONFIG} from "../../shared/mafia.clean.wanted";
import {DialogInput, MenuClass} from "./menu";
import {user} from "./user";
import {system} from "./system";
import {CustomEvent} from "./custom.event";

const player = mp.players.local

MAFIA_CLEAN_WANTED_CONFIG.map((item, itemid) => {
    new NpcSpawn(item.pos, item.heading, item.model, item.name, async () => {
        if (!user.is_mafia) return user.notify(LangString("mafia.clean.wanted.5c561378705d0eb302b236216a536a36"), "error");
        const id = await DialogInput(LangString("mafia.clean.wanted.a1d7ba4ebea9b51427f168001574739b"), null, 6, "int");
        if(!id) return;
        if(isNaN(id) || id < 0 || id > 999999) return user.notify(LangString("mafia.clean.wanted.233bd526cf1a7b8c3120e1761e4560c7"), "error");
        const target = mp.players.toArray().find(q => q.handle && q.getVariable("id") == id);
        if(!target) return user.notify(LangString("mafia.clean.wanted.d3d43eea4f62f8c29b772fa2ec67262e"), "error");
        if(system.distanceToPos(player.position, target.position) > 5) return user.notify(LangString("mafia.clean.wanted.4a0c0f5d3c936d3d60bde332de390a79"), "error");
        if(player.dimension != target.dimension) return user.notify(LangString("mafia.clean.wanted.fcc4ba0d0db5815757ab746675e95cf3"), "error");
        const data:string|number = await CustomEvent.callServer("mafia:wanted:data", id)
        if(typeof data === "string"){
            if (data === "NOT_FND") return user.notify(LangString("mafia.clean.wanted.bd528b52242624980de8b96d64a2f2a2"), "error");
            if (data === "NOT_NEAR") return user.notify(LangString("mafia.clean.wanted.127c23334b5c3737c3a5833cdf7f8bba"), "error");
        } else {
            const m = new MenuClass(item.name, LangString("mafia.clean.wanted.748f208cbe6602783d2b3a671c164a6e"));
            m.newItem({
                name: LangString("mafia.clean.wanted.855f64358291d6b8cc75e474c1912b8a"),
                more: `${data}`
            })
            m.newItem({
                name: LangString("mafia.clean.wanted.3acbc37a1e49cc4ffd20d53f8948e465"),
                more: `${system.numberFormat(item.costPerStar * data)}$ | Bani murdari`

            })
            m.newItem({
                name: LangString("mafia.clean.wanted.9e8e4806b59e8ee3db812f4f7ebd6cc6"),
                desc: LangString("mafia.clean.wanted.aa3e720c1941d3ba8845e8bda0781fdc"),
                onpress: () => {
                    m.close();
                    CustomEvent.triggerServer("mafia:wanted:clear", id, itemid)
                }
            })
    
            m.open();
        }
    })
})
