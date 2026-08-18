import { langStringDefault } from "../../../../../shared/lang";
import {ServerNpc} from "../../../advancedNpc";
import {
    NEW_YEAR_SPANISH_NPC_ID, NEW_YEAR_SPANISH_NPC_NAME,
    NEW_YEAR_SPANISH_NPC_PARAMETERS
} from "../../../../../shared/events/newYear/quests.config";
import {registerDialog} from "../../../advancedNpc/dialogs/dialogs";


export function SpawnAbelardoNPC() {
    const DEFAULT_ABELARDO_DIALOG_ID = "new-year-marv-abelardo-default";

    const MarvNPC = new ServerNpc(NEW_YEAR_SPANISH_NPC_ID, NEW_YEAR_SPANISH_NPC_PARAMETERS, DEFAULT_ABELARDO_DIALOG_ID);

    registerDialog({
        id: DEFAULT_ABELARDO_DIALOG_ID,
        characterName: NEW_YEAR_SPANISH_NPC_NAME,
        nodes: [
            {
                id: 0,
                npcReplies: [
                    {text: langStringDefault("abelardo.c746bfb23bf0750deec7ca11e168bd83")}
                ],
                answers: [
                    {text: langStringDefault("abelardo.b9e502ba41014661de477b7bf507b69c"), isExit: true}
                ]
            }
        ]
    })
}