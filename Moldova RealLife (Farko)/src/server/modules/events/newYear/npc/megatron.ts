import { langStringDefault } from "../../../../../shared/lang";
import {ServerNpc} from "../../../advancedNpc";
import {
    NEW_YEAR_MEGATRON_NPC_ID,
    NEW_YEAR_MEGATRON_NPC_NAME,
    NEW_YEAR_MEGATRON_NPC_PARAMETERS
} from "../../../../../shared/events/newYear/quests.config";
import {registerDialog} from "../../../advancedNpc/dialogs/dialogs";

export function SpawnMegatronNPC() {
    const DEFAULT_MEGATRON_DIALOG_ID = "new-year-megatron-dialog-default";

    const MegatronNPC = new ServerNpc(NEW_YEAR_MEGATRON_NPC_ID, NEW_YEAR_MEGATRON_NPC_PARAMETERS, DEFAULT_MEGATRON_DIALOG_ID);

    registerDialog({
        id: DEFAULT_MEGATRON_DIALOG_ID,
        characterName: NEW_YEAR_MEGATRON_NPC_NAME,
        nodes: [
            {
                id: 0,
                npcReplies: [
                    { text: langStringDefault("megatron.999045be4be160091719fcd970a675ca") }
                ],
                answers: [
                    { text: langStringDefault("megatron.0ad0a2e3dd06f79f4abf7fcb9d2981ad"), isExit: true }
                ]
            }
        ]
    });
}