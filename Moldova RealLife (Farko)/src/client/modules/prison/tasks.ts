import { LangString, langStringDefault } from "../lang";
import {IPrisonTask} from "../../../shared/prison/IPrisonTask";
import {CustomEvent} from "../custom.event";
import {
    COOKING_POSITIONS,
    HAMMER_POSITIONS,
    SEWING_POSITIONS,
    TASK_TYPES,
    TASKS_BLIP_POSITION, TOILET_POSITIONS,
    WASHING_POSITIONS
} from "../../../shared/prison/tasks.config";
import {system} from "../system";
import {user} from "../user";
import {colshapes} from "../checkpoints";
import {MINIGAME_TYPE} from "../../../shared/minigame";
import {MinigamePlay} from "../minigame";
import {createRouteBlip, destroyRouteBlip} from "../blips";


let prisonTask: IPrisonTask | null = null;
let sHash: string | null = null;

CustomEvent.registerServer("prison:tasks:start", (data) => {
    sHash = data;

    const index = Math.floor(Math.random() * TASK_TYPES.length);
    const type = TASK_TYPES[index];

    user.notify(LangString("tasks.791716b8c8af6daea435de905a809b75"), "success");

    createRouteBlip(LangString("tasks.60400b09bc5d931ae76d9ab224be03e2"), TASKS_BLIP_POSITION[index], 28);

    prisonTask = {
        type: type,
        count: system.getRandomInt(4, 20),
        completed: 0
    };

    CustomEvent.triggerCef("prison:task:update", prisonTask);
});

function gameComplete(type: MINIGAME_TYPE) {
    if (prisonTask.type !== type) return;

    prisonTask.completed += 1;

    CustomEvent.triggerCef("prison:task:update", prisonTask);

    if (prisonTask.count <= prisonTask.completed) {
        CustomEvent.callServer("prison:tasks:finish", prisonTask.count, sHash).then(res => {
            if (res === true) {
                destroyRouteBlip(LangString("tasks.e224a7b4f5ca502ec361f02fcf486feb"));
                prisonTask = null;
                user.notify(langStringDefault("index.16a9b1999b8ea35dfc0a53cad127b446"));
                CustomEvent.triggerCef("prison:task:update", null);
            }
        });
    }
}

colshapes.new(
    SEWING_POSITIONS,
    LangString("tasks.84eb8bb8df5f883526535926f284bbc1"),
    async () => {
        if (!prisonTask) return;

        if (prisonTask.type !== MINIGAME_TYPE.JAILSEWING) return user.notify(LangString("tasks.b0e3c03dba590291e0a3e5265d40ffbc"), "error");

        const res = await MinigamePlay(MINIGAME_TYPE.JAILSEWING);

        if (res) gameComplete(MINIGAME_TYPE.JAILSEWING);
    },
    {
        color: [0, 0, 0, 0]
    }
);

colshapes.new(
    HAMMER_POSITIONS,
    LangString("tasks.7c9fec6c7bd3e24e31642223bbf31bdd"),
    async () => {
        if (!prisonTask) return;

        if (prisonTask.type !== MINIGAME_TYPE.JAILHAMMER) return user.notify(LangString("tasks.f87abdef50e7c0b8822de7d05010c4d4"), "error");

        const res = await MinigamePlay(MINIGAME_TYPE.JAILHAMMER);

        if (res) gameComplete(MINIGAME_TYPE.JAILHAMMER);
    },
    {
        color: [0, 0, 0, 0]
    }
)

colshapes.new(WASHING_POSITIONS,
    LangString("tasks.70c8f74fac75dee1fa7d157d0aa24078"),
    async () => {
        if (!prisonTask) return;

        if (prisonTask.type !== MINIGAME_TYPE.JAILWASHING) return user.notify(LangString("tasks.f4358e4ad8d98c33840bc90cf0c4ee6e"), "error");

        const res = await MinigamePlay(MINIGAME_TYPE.JAILWASHING);

        if (res) gameComplete(MINIGAME_TYPE.JAILWASHING);
    },
    {
        color: [0, 0, 0, 0]
    }
)

colshapes.new(COOKING_POSITIONS,
    LangString("tasks.a785099419a9e627318962833cfc1948"),
    async () => {
        if (!prisonTask) return;

        if (prisonTask.type !== MINIGAME_TYPE.JAILCOOKING) return user.notify(LangString("tasks.ed4571a1a271cc57f9f63b75746dd5ae"), "error");

        const res = await MinigamePlay(MINIGAME_TYPE.JAILCOOKING);

        if (res) gameComplete(MINIGAME_TYPE.JAILCOOKING);
    },
    {
        color: [0, 0, 0, 0]
    }
)

colshapes.new(TOILET_POSITIONS,
    LangString("tasks.74999a0584ef223fb80e74d14d3683b1"),
    async () => {
        if (!prisonTask) return;

        if (prisonTask.type !== MINIGAME_TYPE.JAILTOILET) return user.notify(LangString("tasks.2172138eb1bce5d01971240eb1d432d5"), "error");

        const res = await MinigamePlay(MINIGAME_TYPE.JAILTOILET);

        if (res) gameComplete(MINIGAME_TYPE.JAILTOILET);
    },
    {
        color: [0, 0, 0, 0]
    }
)



/*
mp.events.add('prison:tasks:gameComplete', (type: string, hash: string) => {
    if (prisonTask.type !== type) return;
    if (hash !== exhash) return;
    exhash = null;

    prisonTask.completed += 1;

    if (prisonTask.count <= prisonTask.completed) {
        CustomEvent.callServer('prison:tasks:finish', prisonTask.count, sHash).then(res => {
            if (res === true) user.notify("Задания успешно выполнены, можете отправляться за новыми");
        });
    }
});
*/
