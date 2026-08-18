import { langStringDefault } from "../../../../../../shared/lang";
import {registerDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {QuestStart} from "../../../../advancedQuests/dialogsExtensions/questStart";
import {HALLOWEEN_GHOSTBUSTER_NPC_NAME, HALLOWEEN_START_QUEST_ID} from "../../../../../../shared/events/halloween.config";
import {EventTriggerAnswer} from "../../../../advancedNpc/dialogs/impl/EventTriggerAnswer";
import {TALK_WITH_NPC_EVENT} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";

registerDialog({
    id: "halloween-quest-1-dialog-1",
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.8384d62b932d2d881d7dfc59a373e491") }
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.c345092cbfde56769197554d1061825f"), toNode: 1 }
            ]
        },

        {
            id: 1,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.ba06d435cabf197f064c15ec4d059089") },
                { text: langStringDefault("start.quest.dialogs.8f298de29192897cb4db63411cd70db5") },
                { text: langStringDefault("start.quest.dialogs.0bc8d6286f9f432766936683893cb14f") },
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.e4f79adeffff364e122e33a5d4fb50dc"), isExit: true, onReply: new QuestStart(HALLOWEEN_START_QUEST_ID) }
            ]
        },
    ]
});

registerDialog({
    id: "halloween-quest-1-dialog-2",
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 2,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.71751278527075f040720fd4e16a866d") }
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.0abdce57259760f51a7c61fd0439a315"), toNode: 3 }
            ]
        },

        {
            id: 3,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.5761c82bfe357e4844c02a0625be68b0") }
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.7b60fe31f83e2a793f48a14ce3f0b1e9"), toNode: 4 }
            ]
        },

        {
            id: 4,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.3d9908d8a61d5661beaa6cd7c5c0e06f") }
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.46201b478061546f3c0e935b7a035e12"), toNode: 5 }
            ]
        },

        {
            id: 5,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.fe27b000a6183184b4828866059a0103") }
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.f1b4099cffdc743fd0e0c021f528044b"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});

registerDialog({
    id: "halloween-quest-1-dialog-3",
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 6,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.6c0f5e7919cff7fde341725dc6910a07") }
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.58d9a441363a62f50f47fc4c91d78d0e"), toNode: 7 }
            ]
        },

        {
            id: 7,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.5857d2f7b8e736dae9131d93dfcff0cf") }
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.6422b85f1fb7dabe18df987e5b96fbd2"), toNode: 8 }
            ]
        },

        {
            id: 8,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.4733d622920d211ad675fb8f8e18680a") }
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.131f9677b8635e2d7716957037bc51d1"), toNode: 9 }
            ]
        },

        {
            id: 9,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.10c38b968c416f6f14e2821ebb2cb6ee") },
                { text: langStringDefault("start.quest.dialogs.38d61a1679b0da4dc38358c1da1a54de") }
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.7ca71dc98706f74d834fb1b69fcd0c05"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) },
            ]
        },
    ]
});

registerDialog({
    id: "halloween-quest-1-dialog-4",
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 10,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.5ff918f88e17e240dc91f654389c2fe5") },
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.86adcd67c2b3cfc1a59222d7a55c5e5e"), toNode: 11 }
            ]
        },

        {
            id: 11,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.7e153fd1f1f62c176ab61e4f8c3bc534") },
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.21b580f14b052616e99aaaff95080d43"), toNode: 12 }
            ]
        },
        {
            id: 12,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.ff6dab18023aa5dae393bbff95bc1c32") },
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.85ddc2900d615503eaa162964c9b79b5"), toNode: 13 }
            ]
        },
        {
            id: 13,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.c8e845a0912dbde6b445387d74a7dac7") },
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.1b0733025fe9861466e08c5468db428e"), toNode: 14 }
            ]
        },
        {
            id: 14,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.d6353ff0c2b63236bf6acefa25bbdadb") },
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.3939a54f239dc579fc0ce2406f9c8fe2"), toNode: 15 }
            ]
        },
        {
            id: 15,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.42dd22075852c1c8b8cc6fc1195069bd") },
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.4447adf2f4e5f8f2175a9afae93d9241"), toNode: 16 }
            ]
        },
        {
            id: 16,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.a987d0ec571d8f213c7e8f6d26a6e8ab") },
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.68c659708a82abfcff5e9b9072884449"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});

registerDialog({
    id: "halloween-quest-1-dialog-5",
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 17,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.1e6de18b6cf5d75639f7c897dd758011") },
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.ef447cdd53b8a8904c083e4a8e2c5363"), toNode: 18 }
            ]
        },
        {
            id: 18,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.a5af2c6611a78a9d5f7670576b7f407c") },
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.8db84382e7627c3028441e0f623037a3"), toNode: 19 }
            ]
        },
        {
            id: 19,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.73b2a1fdb1d68e76f1e9db7e8365353c") },
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.ff92eaec7bb4d75f06f4245ca4de2f02"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});

registerDialog({
    id: "halloween-quest-1-dialog-6",
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 20,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.6468370a2bababbd00daeb595419b85b") },
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.3fa26631835c5cf1f49ad9625688306b"), toNode: 21 }
            ]
        },
        {
            id: 21,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.a8d2d1e09224cc4671cd3b7848bd3793") },
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.49b977fc15144d7aafa1b691d10d0a39"), toNode: 22 }
            ]
        },
        {
            id: 22,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.dc3888b3f565dc603fba7dbd932ad1d3") },
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.e6640e10a75b193590fba0f036e750a7"), toNode: 23 }
            ]
        },
        {
            id: 23,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.83e1cff2ea35a6703c2b19fcbb51452a") },
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.6f7769b22d293dcf457379aeb8383ad4"), toNode: 24 }
            ]
        },
        {
            id: 24,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.31654e346b6bd3dda5b615a08d06f7d0") },
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.f04d0a445d6a324c7c27409ac6ea2baf"), toNode: 25 }
            ]
        },
        {
            id: 25,
            npcReplies: [
                { text: langStringDefault("start.quest.dialogs.2b6fa8f3d4844bee636be397f55209fc") },
            ],
            answers: [
                { text: langStringDefault("start.quest.dialogs.e01ace80aeb86bcd230b65c0339d45ae"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});
