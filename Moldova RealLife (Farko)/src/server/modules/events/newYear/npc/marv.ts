import { langStringDefault } from "../../../../../shared/lang";
import {ServerNpc} from "../../../advancedNpc";
import {
    NEW_YEAR_HOMELESS_NPC_ID, NEW_YEAR_HOMELESS_NPC_NAME,
    NEW_YEAR_HOMELESS_NPC_PARAMETERS
} from "../../../../../shared/events/newYear/quests.config";
import {registerDialog} from "../../../advancedNpc/dialogs/dialogs";


export function SpawnMarvNPC() {
    const DEFAULT_MARV_DIALOG_ID = "new-year-marv-dialog-default";

    const MarvNPC = new ServerNpc(NEW_YEAR_HOMELESS_NPC_ID, NEW_YEAR_HOMELESS_NPC_PARAMETERS, DEFAULT_MARV_DIALOG_ID);

    registerDialog({
        id: DEFAULT_MARV_DIALOG_ID,
        characterName: NEW_YEAR_HOMELESS_NPC_NAME,
        nodes: [
            {
                id: 0,
                npcReplies: [
                    {text: langStringDefault("marv.f4ea23593f43aa53527cf4fee6eabf0b")}
                ],
                answers: [
                    {text: langStringDefault("marv.79aa16907b2f392d61e0344592ad60cb"), isExit: true}
                ]
            }
        ]
    })
}