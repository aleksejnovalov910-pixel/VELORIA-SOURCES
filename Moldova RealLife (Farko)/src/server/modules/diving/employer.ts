import { langStringDefault } from "../../../shared/lang";
import {EMPLOYER_BLIP, EMPLOYER_NPC} from "../../../shared/diving/employer.config";
import {NpcSpawn} from "../npc";
import {CustomEvent} from "../custom.event";
import {DIVING_COSTUME_ITEM_ID} from "../../../shared/diving/work.config";
import {LEVEL_PERMISSIONS} from "../../../shared/level.permissions";

function interaction(player: PlayerMp) {
    const user = player.user;
    if (!user) return;
    if (user.playtime < LEVEL_PERMISSIONS.SCAFANDRU) {
        return player.notify(
            `Ai nevoie de minim ${LEVEL_PERMISSIONS.SCAFANDRU} ore jucate pentru a lucra ca scafandru.`,
            "error"
        );
    }
    if (!player.user.haveItem(DIVING_COSTUME_ITEM_ID))
        return player.notify(player.user.LangString("employer.35fbc3e5363ff062025c21a1f39e049f"), "error");

    CustomEvent.triggerClient(player, "diving:openEmployer");
}


new NpcSpawn(
    EMPLOYER_NPC.Position,
    EMPLOYER_NPC.Heading,
    EMPLOYER_NPC.Model,
    EMPLOYER_NPC.Name,
    interaction,
    EMPLOYER_NPC.Range,
    EMPLOYER_NPC.Dimension
)

mp.blips.new(EMPLOYER_BLIP.Sprite, EMPLOYER_BLIP.Position, {
    color: EMPLOYER_BLIP.Color,
    shortRange: true,
    name: EMPLOYER_BLIP.Name
});


