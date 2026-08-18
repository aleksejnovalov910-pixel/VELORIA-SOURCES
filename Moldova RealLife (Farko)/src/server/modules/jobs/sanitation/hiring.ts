import { NpcSpawn } from "../../npc";
import {
    HIRING_HEADING_SORT,
    HIRING_MODEL_SORT,
    HIRING_POSITION_SORT,
    HIRING_TEXT_SORT
} from "../../../../shared/jobs/sanitation/hiring";
import { sanitation } from "./index";
import { CustomEvent } from "../../custom.event";

const interactionSort = (player: PlayerMp) => {
    player.user.setGui("garbage");
    CustomEvent.triggerCef(player, "sanitation:sort:hiring", player.user.sanitationSort !== null);
};

new NpcSpawn(
    HIRING_POSITION_SORT,
    HIRING_HEADING_SORT,
    HIRING_MODEL_SORT,
    HIRING_TEXT_SORT,
    interactionSort
);

mp.blips.new(318, new mp.Vector3(2407.08, 3128.17, 48.18), {
    color: 2,
    name: "Job Gunoier",
    dimension: 0,
    shortRange: true
});