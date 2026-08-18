import { LangString } from "./lang";
import {TELEPORT_CONFIG} from "../../shared/teleport.system";
import {colshapes} from "./checkpoints";
import {CustomEvent} from "./custom.event";
import {MenuClass} from "./menu";
import {system} from "./system";
import {user} from "./user";
import {waitTimer} from "./anim";

TELEPORT_CONFIG.map((item, confid) => {
    item.points.map((q, index) => {
        const pos = new mp.Vector3(q.x, q.y, q.z)
        colshapes.new(pos, item.name, async (player) => {
            if(item.oneway && index) return;
            if (item.fraction){
                if(typeof item.fraction === "number" && item.fraction !== user.fraction) return user.notify(LangString("teleport.system.5711d4c665ef33757271e374a662b49f"), "error");
                else if(item.fraction === "gang" && !user.is_gang) return user.notify(LangString("teleport.system.b14ba33e6270dcee11bf8fa9f46eebcd"), "error");
                else if(item.fraction === "gos" && !user.is_gos) return user.notify(LangString("teleport.system.0b7de635b9490016bdb1b9510ade48d5"), "error");
            }

            if (item.family && user.family !== item.family) {
                return user.notify(LangString("teleport.system.6904b925cb4c90c06790c9f6e90d9dcc"), "error");
            }

            if(item.cost && user.money < item.cost) return user.notify(LangString("teleport.system.2af930754d5f6b9cd8c1e4703757b66d"), "error");
            if(item.oneway && item.wait && !(await waitTimer(item.wait.distance, item.wait.seconds, item.wait.text))) return;
            if (item.oneway) return CustomEvent.triggerServer("teleport:go", confid, 1);
            if(!item.onenter && !!item.onenterpress && item.points.length == 2 && !item.cost){
                const pos = item.points.findIndex((q, i) => i !== index)
                if(pos > -1){
                    return CustomEvent.triggerServer("teleport:go", confid, pos);
                }
            }
            const m = new MenuClass(item.name);
            if(item.cost) m.subtitle = LangString("teleport.system.a2fe7d9aca30f14dbd41e15ea6394cb9", system.numberFormat(item.cost))
            item.points.map((pos, posindex) => {
                if(posindex === index) return;
                m.newItem({
                    name: pos.name,
                    onpress: async () => {
                        m.close();
                        if(item.wait && !(await waitTimer(item.wait.distance, item.wait.seconds, item.wait.text))) return;
                        CustomEvent.triggerServer("teleport:go", confid, posindex);
                    }
                })
            })
            m.open();
        }, {
            type: 27,
            radius: item.vehicle ? 4 : 1.5,
            onenter: !!item.onenter,
            dimension: q.d,
            drawStaticName: "scaleform"
        })
    })
})