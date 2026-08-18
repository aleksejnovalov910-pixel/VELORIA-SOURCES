import { langStringDefault } from "../../../../../../shared/lang";
import {registerDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {
    NEW_YEAR_HARRY_NPC_NAME,
    NEW_YEAR_SANTA_NPC_NAME,
    NEW_YEAR_SECOND_QUEST_ID
} from "../../../../../../shared/events/newYear/quests.config";
import {QuestStart} from "../../../../advancedQuests/dialogsExtensions/questStart";
import {EventTriggerAnswer} from "../../../../advancedNpc/dialogs/impl/EventTriggerAnswer";
import {TALK_WITH_NPC_EVENT} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";

registerDialog({
    id: "new-year-quest-2-dialog-1",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.40a6a48e558f7fd4912bcb525674cb30")},
                {text: langStringDefault("second.quest.dialogs.461025e60ab350eff06a68ca84e74762")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.837e49ff739be308deb6a30deded6318"), toNode: 1}
            ]
        },
        {
            id: 1,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.60d2aa704862f329f14078a9cdbc3fe7")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.bec3b2e275bca39a02c3f1bd727b8357"), toNode: 2}
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.1d2dbb4f9209d05920bc37917f4644fe")},
                {text: langStringDefault("second.quest.dialogs.b6d124b3f5a76f84f670e9f7c87dc57e")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.09580ef76b803b1474a4a672a2bd59d9"), toNode: 3}
            ]
        },
        {
            id: 3,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.72031ef87a68d39c36162ab0edfa0ea0")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.898d82e75e8955ac1fff82a29c4f5dca"), toNode: 4}
            ]
        },
        {
            id: 4,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.473b667a468b2045898584d738a1ac2b")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.a451c948107ed4ac31a84bb9a7c4cc9f"), toNode: 5}
            ]
        },
        {
            id: 5,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.2f0444c18775bea54e1fcb979d548a75")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.cf64a4c8d3f4ee1de8db7c1cfbf72d83"), toNode: 6}
            ]
        },
        {
            id: 6,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.dc314d28768f95474243be8601433c6e")},
                {text: langStringDefault("second.quest.dialogs.3a9754b6090762c42dc543e5802b91c8")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.37e24bacab7ee0b6001378cb47fa2853"), isExit: true, onReply: new QuestStart(NEW_YEAR_SECOND_QUEST_ID)}
            ]
        }
    ]
});

registerDialog({
    id: "new-year-quest-2-dialog-2",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 7,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.3312486356ea45060476769b2c632079")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.31ee8ef3894a120f21cda8f645fcf92c"), toNode: 8},
                {text: langStringDefault("second.quest.dialogs.24164ea28eae3ba0ed6bc8bd15cdf67b"), toNode: 9}
            ]
        },
        {
            id: 8,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.67ada53688b8434d20de6416b4479e8e")},
                {text: langStringDefault("second.quest.dialogs.ac676059b384ba043e24fa3d6d79b8fb")},
                {text: langStringDefault("second.quest.dialogs.c37f5d4d3aa67930ee0dba5271178e50")},
                {text: langStringDefault("second.quest.dialogs.9bdf55cb4579b64745b1220afdfef291")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.4bda138e706b663b6608f5dc439ea576"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
                {text: langStringDefault("second.quest.dialogs.199d60a64cc6ecc52e703114c2654572"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        },
        {
            id: 9,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.119c6e68dc5ec5edbacabd79a1414d66")},
                {text: langStringDefault("second.quest.dialogs.38cc7575da472c1c8a0e48e726534082")},
                {text: langStringDefault("second.quest.dialogs.b2323fa148ce3e1c154e9d18b48bba59")},
                {text: langStringDefault("second.quest.dialogs.d523a87f68be4ab0eb7056edecce2976")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.a1a19d30406f9a699d54a8387b2cd34f"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
                {text: langStringDefault("second.quest.dialogs.1f1622770e670731b467efc9492b0b7d"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
});

registerDialog({
    id: "new-year-quest-2-dialog-3",
    characterName: NEW_YEAR_HARRY_NPC_NAME,
    nodes: [
        {
            id: 10,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.ac9a802a6187a28969fa5e681ea44fad")},
                {text: langStringDefault("second.quest.dialogs.18599233d3e5104ea3b9d8cab3159fd9")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.d683ae5bc2ea5a58d56cad2289aca83e"), toNode: 11},
                {text: langStringDefault("second.quest.dialogs.bb273697af8b87d0d350c680f493ac76"), toNode: 12}
            ]
        },
        {
            id: 11,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.0ca1aed4f2e1737995e25d5c40787e71")},
                {text: langStringDefault("second.quest.dialogs.a3b94f2834ecc1bfa9fe2b00769f1c96")},
                {text: langStringDefault("second.quest.dialogs.b7511bbd8d3fb8c3bebab2bc353c5074")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.54bb3d607dd89ebef458656b8d15dd40"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        },
        {
            id: 12,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.e2500f44aac438e9210bb4e4ea4756e2")},
                {text: langStringDefault("second.quest.dialogs.8c2633f2b9d572c2e0c5b31886711f61")},
                {text: langStringDefault("second.quest.dialogs.aca6c8dce3d3958d872cb8fa076bb302")},
                {text: langStringDefault("second.quest.dialogs.70af6c3c7897736ef6824f3b5b8d7aaf")},
                {text: langStringDefault("second.quest.dialogs.ec35816aef3bd8061147fb4163a677e5")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.17e2c90660bfc5fa8a2439a11515762e"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})

registerDialog({
    id: "new-year-quest-2-dialog-4",
    characterName: NEW_YEAR_HARRY_NPC_NAME,
    nodes: [
        {
            id: 13,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.d49208c137859bc8d0eb463f25beee76")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.360efa1085f5ef7369cb250b083cba58"), toNode: 14},
                {text: langStringDefault("second.quest.dialogs.6ce2d6ea79441ebce37619d3bc90cd6b"), toNode: 14}
            ]
        },
        {
            id: 14,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.968b4b53ce4be8db857c6c727e769598")},
                {text: langStringDefault("second.quest.dialogs.f1092a315a6e58087dea25d959859f21")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.cd216e7c39c22c5554d9463fba2c8668"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})

registerDialog({
    id: "new-year-quest-2-dialog-5",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 15,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.a7cd4cbf80dc3baaf4b98fc96d8dfa0e")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.cca8fcdf40952cfc61764f9116efa2fc"), toNode: 16}
            ]
        },
        {
            id: 16,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.728d66df65fce2517c03378d17d5819e")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.96f8d2264fed5e6b4f1d21cdb4067e4a"), toNode: 17}
            ]
        },
        {
            id: 17,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.67692be6fcf7f926ca7acacd2799680d")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.9dd5f7345ee957adfc40bb6e0a511cfc"), toNode: 18}
            ]
        },
        {
            id: 18,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.1e63349b5b55d65b4d7b3e71047099ff")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.5b98d384334914e74dba52aa1835153b"), toNode: 19}
            ]
        },
        {
            id: 19,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.3a50266d819ba63d8c712c81454cc316")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.15d8bfda83249a885f5843e15cf5252e"), toNode: 20}
            ]
        },
        {
            id: 20,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.a77370dea4c3ab509f8a536550b3b5e4")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.63485184f763045363b691899dea56ce"), toNode: 21}
            ]
        },
        {
            id: 21,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.61c35aeed5601025fb292100e52af648")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.252cb14e3b90246b994e2c8dc6218240"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})

registerDialog({
    id: "new-year-quest-2-dialog-6",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 22,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.f1acb156a2df53647a1b29f8c1165bca")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.2a7ae36f5109679f663c32dffacc0cac"), toNode: 23}
            ]
        },
        {
            id: 23,
            npcReplies: [
                {text: langStringDefault("second.quest.dialogs.651bc7330c670744039a2c02833227f2")}
            ],
            answers: [
                {text: langStringDefault("second.quest.dialogs.6763013b69f7eaaa8812299e9fb53948"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})