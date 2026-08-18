import { langStringDefault } from "../../../../../../shared/lang";
import {registerDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {NEW_YEAR_FIRST_QUEST_ID, NEW_YEAR_SANTA_NPC_NAME} from "../../../../../../shared/events/newYear/quests.config";
import {QuestStart} from "../../../../advancedQuests/dialogsExtensions/questStart";
import {EventTriggerAnswer} from "../../../../advancedNpc/dialogs/impl/EventTriggerAnswer";
import {TALK_WITH_NPC_EVENT} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";

registerDialog({
    id: "new-year-quest-1-dialog-1",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.63ce6e132c99e93d36261f85ca85c310")},
                {text: langStringDefault("first.quest.dialogs.4c6bb5c6020e5788bb65eae342ad94ba")},
                {text: langStringDefault("first.quest.dialogs.847ff57a40ec71046f2c9dcdab9b288c")},
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.8c87c54cf2e02e4584dc4cc761c242c6"), toNode: 1}
            ]
        },
        {
            id: 1,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.76f611e3f9f80161986c93d42abddc26")}
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.5bf426377d7823ab4bcbd893abacaa6b"), toNode: 2},
                {text: langStringDefault("first.quest.dialogs.3c488fbf2ea12104cf040fdb0d130a17"), toNode: 3},
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.e568f9e8c46a571bbf1b8daf2b872b45")},
                {text: langStringDefault("first.quest.dialogs.3050d3d511eafbe1df40de7a5d6b4238")},
                {text: langStringDefault("first.quest.dialogs.96e9b17dc3db67c14bcbaaa777eefa2a")},
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.37f3a0dcd7551cbb7f4523d5c43d953a"), isExit: true, onReply: new QuestStart(NEW_YEAR_FIRST_QUEST_ID)}
            ]
        },
        {
            id: 3,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.88a4c177065133b30736a8afc6f0617a")},
                {text: langStringDefault("first.quest.dialogs.677875cd8a9171cc7c14613613ad54bf")}
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.4225d1522efbb80e52364ad6f7e9277c"), isExit: true, onReply: new QuestStart(NEW_YEAR_FIRST_QUEST_ID)}
            ]
        }
    ]
});

registerDialog({
    id: "new-year-quest-1-dialog-2",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 4,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.838876803448b66e2674535812fbdb95")}
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.75cc67103dfcbf6d424079b812b192ba"), toNode: 5}
            ]
        },
        {
            id: 5,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.d929c5e3cd1a6582fed15317b1305135")},
                {text: langStringDefault("first.quest.dialogs.0fe96854f3990861719bdb9d5087cc35")}
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.e7e73f0599407a53bcfbd6357a6ebb03"), toNode: 6},
                {text: langStringDefault("first.quest.dialogs.2091e6f4c56f6e843d103aafb6f71ba1"), toNode: 7}
            ]
        },
        {
            id: 6,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.dbc994d4f3c3508385b403e4ea545af7")}
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.0f9a5353a7905bb8e1eda37c11b70aff"), toNode: 8}
            ]
        },
        {
            id: 7,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.6d9bd20d93c71c26c90d7cdc53787412")}
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.a10488244d9982547e44924a1ea3d946"), toNode: 9}
            ]
        },
        {
            id: 8,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.a8f4f2f0a8f61a2901dbfd4405503f2e")},
                {text: langStringDefault("first.quest.dialogs.f4ade7c99f55e785cbf05fea948f6d0a")}
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.a3228c59e179083e561bac62f27c0f14"), toNode: 10}
            ]
        },
        {
            id: 9,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.677d2b75eb4765b1bdbbcd9410d2c4e7")},
                {text: langStringDefault("first.quest.dialogs.2c43b438d6aea5e0b965266afcb8671e")}
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.2b464d06ecc18e60284c9b5593e7f579"), toNode: 10}
            ]
        },
        {
            id: 10,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.8bba0a31e7521e9ff001ebf99f4c10a4")},
                {text: langStringDefault("first.quest.dialogs.aaa9c5b1a9bfb31e48f3bb21d7b966ed")},
                {text: langStringDefault("first.quest.dialogs.15746576151e86c51e6f7aaf2790fb47")}
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.7102128d0cde2cb80b2ea9cb76493457"), toNode: 11}
            ]
        },
        {
            id: 11,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.e115470374006db7d8ecc47f448540ac")},
                {text: langStringDefault("first.quest.dialogs.3f156c8447103c04cc5d9fd806e6ebaa")},
                {text: langStringDefault("first.quest.dialogs.c74da6551281c10cf7784cc9f30b53b9")},
                {text: langStringDefault("first.quest.dialogs.24718ea5bcfd1b64a1857050ca0d33c2")}
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.83159b2fa6803b54fcbe8b27e447e15c"), toNode: 12}
            ]
        },
        {
            id: 12,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.46343d87584bd382493505dd96eb0f37")},
                {text: langStringDefault("first.quest.dialogs.2ec6c8b1bb86e637f78e9810f55ca6da")}
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.f7ffc7ea920c1b5aadd5c4c8f43a70f4"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})

registerDialog({
    id: "new-year-quest-1-dialog-3",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 13,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.944d5d46f4cbb441131be4ff5b2c2e3a")}
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.b0cd4fe10f3e23d2034101a25d7fcc66"), toNode: 14}
            ]
        },
        {
            id: 14,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.b8cf95ce2d576a631e7e16c1b175e460")}
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.f68597383294f7b5ae47f1d1edfa3e5f"), toNode: 15}
            ]
        },
        {
            id: 15,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.d204efb7a5baa1c8cf7ccbf57e52dcfe")},
                {text: langStringDefault("first.quest.dialogs.ddc434a5b2155b859b1e29566047ae56")}
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.2fea7c1fa2e947442f5f646156ebb44b"), toNode: 16},
                {text: langStringDefault("first.quest.dialogs.17ff5a5ba9632668c51874f5eb38f283"), toNode: 17}
            ]
        },
        {
            id: 16,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.dbf21856812e008eeba53ada84e1b3eb")},
                {text: langStringDefault("first.quest.dialogs.acccfdcb2fc1e4f3a9bcba82d1cd4691")}
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.b6620bc80af77cbe272f455621b6aea3"), toNode: 18}
            ]
        },
        {
            id: 17,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.7cb772a978bd489f968b780a03784f1d")}
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.c326f33b0ca34215b15ab46ecce00bf5"), toNode: 18}
            ]
        },
        {
            id: 18,
            npcReplies: [
                {text: langStringDefault("first.quest.dialogs.035753223e30f38264996398b43e9b07")}
            ],
            answers: [
                {text: langStringDefault("first.quest.dialogs.b61b8bf9886487e19fcb2bfb79945549"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})