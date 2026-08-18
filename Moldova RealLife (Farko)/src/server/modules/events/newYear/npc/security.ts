import { langStringDefault } from "../../../../../shared/lang";
import {ServerNpc} from "../../../advancedNpc";
import {
    NEW_YEAR_BOLVANKA_NPC_ID,
    NEW_YEAR_BOLVANKA_NPC_NAME,
    NEW_YEAR_BOLVANKA_NPC_PARAMETERS
} from "../../../../../shared/events/newYear/quests.config";
import {registerDialog} from "../../../advancedNpc/dialogs/dialogs";

export function SpawnSecurityNPC() {
    const DEFAULT_BOLVANKA_DIALOG_ID = "new-year-bolvanka-dialog-default";

    const SecurityNPC = new ServerNpc(NEW_YEAR_BOLVANKA_NPC_ID, NEW_YEAR_BOLVANKA_NPC_PARAMETERS, DEFAULT_BOLVANKA_DIALOG_ID);

    registerDialog({
        id: DEFAULT_BOLVANKA_DIALOG_ID,
        characterName: NEW_YEAR_BOLVANKA_NPC_NAME,
        nodes: [
            {
                id: 0,
                npcReplies: [
                    { text: langStringDefault("security.330fa3db543a6f302e7ef8e4eae80d15") }
                ],
                answers: [
                    { text: langStringDefault("security.82e6039fa126cbe2f56a2e0ea906bb3b"), isExit: true }
                ]
            }
        ]
    });
}