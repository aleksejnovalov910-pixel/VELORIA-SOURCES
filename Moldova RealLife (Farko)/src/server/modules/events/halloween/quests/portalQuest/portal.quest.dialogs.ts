import { langStringDefault } from "../../../../../../shared/lang";
import {registerDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {
    HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    HALLOWEEN_PORTALS_QUEST_ID
} from "../../../../../../shared/events/halloween.config";
import {DateCondition} from "../../../../advancedNpc/dialogs/impl/dateCondition";
import {EventTriggerAnswer} from "../../../../advancedNpc/dialogs/impl/EventTriggerAnswer";
import {TALK_WITH_NPC_EVENT} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";
import {QuestStart} from "../../../../advancedQuests/dialogsExtensions/questStart";

registerDialog({
    id: "halloween-quest-3-dialog-1",
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.4f6e48757773e4d5e8492a9a9a1e2199") }
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.61f6ea677287ad4dfdfa79e2dd5ece8c"), toNode: 57 }
            ]
        },
        {
            id: 1,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.706f0d106c04832b3b7133af48fa878e") },
                { text: langStringDefault("portal.quest.dialogs.6ea36cdad0954a895223f25dcd0d4c27") },
                { text: langStringDefault("portal.quest.dialogs.5584c2fabd6b71969a27423739ae976f") },
                { text: langStringDefault("portal.quest.dialogs.fbf0c665055c485c7b0855199bdb0c1f") },
                { text: langStringDefault("portal.quest.dialogs.0319be338f37aed131dde353154b22a2") }
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.2e2bd2bf02dea0df1189c9a301644f49"), isExit: true }
            ]
        },
        {
            id: 57,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.67016187541a2cc8713714e329b31c61") },
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.1a0a189a16cba9903caa715e566f0f87"), toNode:58 }
            ]
        },
        {
            id: 58,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.3fddc0cda5bc8ab69e7fd1c97a58e1ec") },
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.c93893eab0ed0a5566ca9898a3ec487f"), toNode:59 }
            ]
        },
        {
            id: 59,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.d00aa172d8b58d6d643d0ae26f0fbe0c") },
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.f3923567877b9f3e3dd65ecd013af4a3"), toNode:60 }
            ]
        },
        {
            id: 60,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.694f50ef561a9108df6340b5c6570853") },
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.83b3687c0cfa26c7146d0d27d74af452"), toNode:61 }
            ]
        },
        {
            id: 61,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.abb64de685ca6b2dd66d6903b9b7f810") },
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.375b3a72b4930d9c6a9642a4ef2c3166"), isExit:true, onReply: new QuestStart(HALLOWEEN_PORTALS_QUEST_ID) },
            ]
        },
    ]
});

registerDialog({
    id: "halloween-quest-3-dialog-2",
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 62,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.36b1607f8be6051e268c1106f6b865a4") },
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.818624fc57fed7b676679b4d5c9ad2c8"), toNode:63 }
            ]
        },
        {
            id: 63,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.65d4036fbb4efd03b896538643fe1ceb") },
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.fc3ca7965a8dba9157adf2069b444d73"), toNode:64 }
            ]
        },
        {
            id: 64,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.84335cc4d980dd3a2248105699fb6e17") },
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.5bea0264ea471ea5d469374156e932a2"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});

registerDialog({
    id: "halloween-quest-3-dialog-3",
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 65,
            npcReplies: [
                { text: "" },
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.04ce670375ab90c27e13e5f7719a1a80"), toNode:66 }
            ]
        },
        {
            id: 66,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.afa0b03645b3ff154648389ac3b4e252") },
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.c4a0e44e30a8b3676c45b6eb66c7735e"), toNode:67 }
            ]
        },
        {
            id: 67,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.17beb9edfb70505551fe6bba999ccf2b") },
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.13e1c99c7a3c8b02129b2279ee245366"), toNode:68 }
            ]
        },
        {
            id: 68,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.b086869ed3c7d11e7dbe4ea21cbd72d2") },
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.17e6d03e1c9d09f5292c6aa1eb0cb053"), toNode:69 }
            ]
        },
        {
            id: 69,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.23e7d6fe9ee892967c95bf79d90a889a") },
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.cab867d453f39ecfa4973a5729aa2d48"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) },
            ]
        },
    ]
});

registerDialog({
    id: "halloween-quest-3-dialog-4",
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 70,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.fe27e7f22fe1e35542d16e008f60c4c4") },
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.ae125a8cf5dcc5c8588b43c747a325b1"), toNode:71 }
            ]
        },
        {
            id: 71,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.00e209d464a888ada57ce1b93bb1881a") },
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.721a4a6ac264ab8e248793f51b6124fc"), toNode:72 }
            ]
        },
        {
            id: 72,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.99d73fbbea1244bfc0dae1f0028a1f23") },
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.a9129939bedc879467d1d6079d9972fa"), toNode:73 }
            ]
        },
        {
            id: 73,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.36649fad4fb254163f6de267b25c5215") },
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.354e74aaa86334cffc89aecc6c530778"), toNode: 74 }
            ]
        },
        {
            id: 74,
            npcReplies: [
                { text: langStringDefault("portal.quest.dialogs.40e9119eda225256e1320d05cec4daf9") },
            ],
            answers: [
                { text: langStringDefault("portal.quest.dialogs.6de7aa0f6eb78fec4ef9254bdb1331a6"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        }
    ]
});