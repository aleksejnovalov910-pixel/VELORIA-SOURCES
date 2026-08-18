import { langStringDefault } from "../../../../../shared/lang";
import {ServerNpc} from "../../../advancedNpc";
import {
    NEW_YEAR_ARIEL_NPC_ID, NEW_YEAR_ARIEL_NPC_NAME,
    NEW_YEAR_ARIEL_NPC_PARAMETERS
} from "../../../../../shared/events/newYear/quests.config";
import {registerDialog} from "../../../advancedNpc/dialogs/dialogs";


export function SpawnArielNPC() {
    const DEFAULT_ARIEL_DIALOG_ID = "new-year-ariel-dialog-default";

    new ServerNpc(NEW_YEAR_ARIEL_NPC_ID, NEW_YEAR_ARIEL_NPC_PARAMETERS, DEFAULT_ARIEL_DIALOG_ID);

    registerDialog({
        id: DEFAULT_ARIEL_DIALOG_ID,
        characterName: NEW_YEAR_ARIEL_NPC_NAME,
        nodes: [
            {
                id: 0,
                npcReplies: [
                    {text: langStringDefault("ariel.d075a12ccbfed44afb74e632e7542399")}
                ],
                answers: [
                    {text: langStringDefault("ariel.84bdd957b4592a21771ab5169a848454"), isExit: true}
                ]
            }
        ]
    })
}