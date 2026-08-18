import { langStringDefault } from "../../../../../../shared/lang";
import {registerDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {
    NEW_YEAR_FIFTH_QUEST_FIRST_LINE_ID,
    NEW_YEAR_FIFTH_QUEST_ID, NEW_YEAR_FIFTH_QUEST_SECOND_LINE_ID,
    NEW_YEAR_MEGATRON_NPC_NAME,
    NEW_YEAR_SANTA_NPC_NAME
} from "../../../../../../shared/events/newYear/quests.config";
import {QuestStart} from "../../../../advancedQuests/dialogsExtensions/questStart";
import {EventTriggerAnswer} from "../../../../advancedNpc/dialogs/impl/EventTriggerAnswer";
import {TALK_WITH_NPC_EVENT} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";
import {MultiAnswer} from "../../../../advancedNpc/dialogs/impl/MultiAnswer";

registerDialog({
    id: "new-year-quest-5-dialog-1",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 1,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.3ce3b2cf98eab5b840ee6fa0a3ec1ea3")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.c9cc0726b20845d7363639279654aa0d"), toNode: 2}
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.6aa18bc594c64dd45b54cf89200a2b6b")}
            ],
            answers: [
                {
                    text: langStringDefault("fifth.quest.dialogs.96368cc113a92068691b9b97c223dcde"),
                    toNode: 3
                }
            ]
        },
        {
            id: 3,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.52c7772b6e525d891d5f804277ef4c6b")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.bb442d45073b3ab41dd503a4c2502f68"), toNode: 4}
            ]
        },
        {
            id: 4,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.fcbd23295457d2570ee6a9900da5caea")},
                {text: langStringDefault("fifth.quest.dialogs.ca8aaade5b02ecd60324620faf4fd26b")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.764899eb431179f436f5105174959a2f"), toNode: 5}
            ]
        },
        {
            id: 5,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.7fe76d79e4b95614df416842ad996ae7")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.6bceef860ea797377a875e4df01139e1"), isExit: true, onReply: new QuestStart(NEW_YEAR_FIFTH_QUEST_ID)}
            ]
        }
    ]
})

registerDialog({
    id: "new-year-quest-5-dialog-2",
    characterName: NEW_YEAR_MEGATRON_NPC_NAME,
    nodes: [
        {
            id: 6,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.940fd113da5010234a28cc9b191e6469")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.7ec9fe2075e15b31ab217b360a719ed0"), toNode: 7}
            ]
        },
        {
            id: 7,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.774365c8cd98283cd6d86a891d98e75e")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.43e8edb670022f3e12e3f46adabc756a"), toNode: 8}
            ]
        },
        {
            id: 8,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.101647cabf28e38bd15e4ade7837816c")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.81e57dbceeb0c22f1ce23df3fec6c711"), toNode: 9},
                {text: langStringDefault("fifth.quest.dialogs.eb18c09bdb9c634b4f24ac219dcb7da4"), toNode: 10}
            ]
        },
        {
            id: 9,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.c5ded4f9d75c92b19a2f494ef0a6e1d5")}
            ],
            answers: [
                {
                    text: langStringDefault("fifth.quest.dialogs.e0a13047d2c6ee1b678d84b41e897a10"), isExit: true, onReply: new MultiAnswer(
                        new EventTriggerAnswer(TALK_WITH_NPC_EVENT),
                        new QuestStart(NEW_YEAR_FIFTH_QUEST_FIRST_LINE_ID))
                }
            ]
        },
        {
            id: 10,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.adbc7e8d6d6edd3d99d333a41c3f205a")},
                {text: langStringDefault("fifth.quest.dialogs.294168d15cb78d4f93f39c1c1ab305e7")},
                {text: langStringDefault("fifth.quest.dialogs.12e7bf0abf01292c655a6203c7ab85e2")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.e47b6ff8df70314600b3719287614177"), toNode: 11}
            ]
        },
        {
            id: 11,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.0ea9252318699efec7d14dfd089ad629")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.3dd31faaf3f2ef22d193830f55adaf8d"), toNode: 12}
            ]
        },
        {
            id: 12,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.a4db73f0c95c5a90b4f6d2bd45d58b63")}
            ],
            answers: [
                {
                    text: langStringDefault("fifth.quest.dialogs.47da2f7646137c21564b977bb4dc78e1"),
                    toNode: 13
                }
            ]
        },
        {
            id: 13,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.33cc03557eb3e5112f05b71f708ade59")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.63bec3d6b4f4e1784e23b0f4e9350a92"), toNode: 14}
            ]
        },
        {
            id: 14,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.f8b90e11eb4e6ce46a3b2011598e2c3d")}
            ],
            answers: [
                {
                    text: langStringDefault("fifth.quest.dialogs.fb8ac6d8da6420a68921e5911adb06a9"),
                    isExit: true,
                    onReply: new MultiAnswer(new EventTriggerAnswer(TALK_WITH_NPC_EVENT), new QuestStart(NEW_YEAR_FIFTH_QUEST_SECOND_LINE_ID))
                }
            ]
        }
    ]
})

registerDialog({
    id: "new-year-quest-5-line-1-dialog-1",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 1,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.09dfef713d61de9c6beccd83830a28cb")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.c2a8ab25872c18d967b8761cc15d7f3b"), toNode: 2}
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.03371f88472f1b64cbcf19d85be9f444")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.e7fbce86839ba01e1d37e9fd41508edd"), toNode: 3}
            ]
        },
        {
            id: 3,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.fd2151d15a5b5e5193187dc39ef8350f")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.fc73db2556b6e86dc448e0a9e31be6f1"), toNode: 4}
            ]
        },
        {
            id: 4,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.2b44dd5ede158e71b549b3856c2a0305")}
            ],
            answers: [
                {
                    text: langStringDefault("fifth.quest.dialogs.483b12bf12b63ba78a514f9bcf6ce702"),
                    isExit: true,
                    onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)
                }
            ]
        }
    ]
})

registerDialog({
    id: "new-year-quest-5-line-1-dialog-2",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 1,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.85cef8d2be328e2c4c74eb0e589f62bc")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.72d46817a1e0f6488c38ed59bfc1fe60"), toNode: 2}
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.0daa8974d9450a7c78804053a02bc376")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.3530fbe07b111adbad7514bec736d7d6"), toNode: 3}
            ]
        },
        {
            id: 3,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.378ae53d0fe7f0b3027edd7dbac01eab")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.6432d7dcc908f0239dfe6cb2ce378122"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})

registerDialog({
    id: "new-year-quest-5-line-1-dialog-3",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 1,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.8cac965ccaea1333f027d6ebddb62c2a")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.bdfb56ac1d4acca9d3fd73fd2d852cb6"), toNode: 2}
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.bfd795593cb105b961de125c989c6973")}
            ],
            answers: [
                {
                    text: langStringDefault("fifth.quest.dialogs.1ba7fb107889996fc44c961a3cb2046f"),
                    isExit: true,
                    onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)
                }
            ]
        }
    ]
})

registerDialog({
    id: "new-year-quest-5-line-2-dialog-1",
    characterName: NEW_YEAR_MEGATRON_NPC_NAME,
    nodes: [
        {
            id: 1,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.dbd0da677b8b3c16cc0b7ec020c65ca8")},
                {text: langStringDefault("fifth.quest.dialogs.28cb4ae5bf055f19bb330a21b2b46f08")},
                {text: langStringDefault("fifth.quest.dialogs.b3098f6780a0d1f38c9cf895246a3a14")},
                {text: langStringDefault("fifth.quest.dialogs.dbd64cbbf06ad3e7f36b6e04ce720aca")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.bd62684e81b9d7ab4411647a56ede8cf"), toNode: 2}
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.0b1ea210e9ad85aeaf40c68af6cafb13")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.a26795df821a94f74a31ff7fecac32b6"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})

registerDialog({
    id: "new-year-quest-5-line-2-dialog-2",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 1,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.988670d866dfffc284cfca1db8f671cf")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.8a9b838b333caba8b623545625396c8e"), toNode: 2}
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.fbcf0705e1ce317c26cafcb25446705a")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.cf598738e271f92df7161be98edbdc30"), toNode: 3}
            ]
        },
        {
            id: 3,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.ccb6abfb667545f443f69e46e3078408")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.1853df7d2d66cfe53f767019c0f8dc77"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})

registerDialog({
    id: "new-year-quest-5-line-2-dialog-3",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 1,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.d83ce06dea182416a12f078ae92b51f1")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.d5578c05eb761f0845e62c9dc0db2b48"), toNode: 2}
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: langStringDefault("fifth.quest.dialogs.2f27f419c0b0fecbe2f766fd5f496a9f")}
            ],
            answers: [
                {text: langStringDefault("fifth.quest.dialogs.e3097ecd72f9e8665af8b183fd61ad81"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})



