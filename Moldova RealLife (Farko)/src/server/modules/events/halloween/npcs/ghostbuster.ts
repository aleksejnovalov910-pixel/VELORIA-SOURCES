import { langStringDefault } from "../../../../../shared/lang";
import {ServerNpc} from "../../../advancedNpc";
import {registerDialog} from "../../../advancedNpc/dialogs/dialogs";
import {
    HALLOWEEN_GHOSTBUSTER_NPC_ID,
    HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    HALLOWEEN_GHOSTBUSTER_NPC_PARAMETERS,
    HALLOWEEN_GHOSTS_QUEST_NPC_ID,
    HALLOWEEN_GHOSTS_QUEST_NPC_PARAMETERS
} from "../../../../../shared/events/halloween.config";

const DEFAULT_GHOSTBUSTER_DIALOG_ID = "halloween-ghostbuster-dialog-default";

const ghostbusterNpc = new ServerNpc(HALLOWEEN_GHOSTBUSTER_NPC_ID, HALLOWEEN_GHOSTBUSTER_NPC_PARAMETERS, DEFAULT_GHOSTBUSTER_DIALOG_ID);
registerDialog({
    id: DEFAULT_GHOSTBUSTER_DIALOG_ID,
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                { text: langStringDefault("ghostbuster.b99525c83204deaaf51d77c61d3183e3") }
            ],
            answers: [
                { text: langStringDefault("ghostbuster.07e2074b55b9610a2c2c5af0a1df99de"), isExit: true }
            ]
        }
    ]
});

const ghostsQuestNpc = new ServerNpc(HALLOWEEN_GHOSTS_QUEST_NPC_ID, HALLOWEEN_GHOSTS_QUEST_NPC_PARAMETERS);