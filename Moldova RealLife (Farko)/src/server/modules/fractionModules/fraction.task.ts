import { langStringDefault } from "../../../shared/lang";
import {FRACTION_TASK_ITEMS} from "../../../shared/fraction.task";
import {NpcSpawn} from "../npc";
import {menu} from "../menu";

FRACTION_TASK_ITEMS.map(npc => {
    let currentList = new Map<number, number>()
    npc.tasks.map((q, i) => currentList.set(i, -1));
    new NpcSpawn(npc.pos, npc.heading, npc.model, npc.name, player => {
        const user = player.user;
        if(!user) return;
        if(npc.fraction && !npc.fraction.includes(user.fraction)) return player.notify(player.user.LangString("fraction.task.e3c4e43bd6f1bcbafdbd24a28450edef"), "error");
        const m = menu.new(player, npc.name, player.user.LangString("fraction.task.43c9147015651fbaf7f680d0c29d0990"));
        currentList.forEach((owner, id) => {
            if(owner === -1) return;
            const cfg = npc.tasks[id];
            if(!cfg) return;
            m.newItem({
                name: cfg.name,
                desc: cfg.desc,
                onpress: () => {
                    let owner = currentList.get(id);
                    if(owner === -1) return player.notify(player.user.LangString("fraction.task.1ffecc4ff9439abe644754bb788a51a2"), "error")
                    if(owner !== 0) return player.notify(player.user.LangString("fraction.task.eebc5ebc046b91c3cb9d0533e888fc0d"), "error")
                    currentList.set(id, user.id);

                }
            })
        })
        m.open()
    })
})