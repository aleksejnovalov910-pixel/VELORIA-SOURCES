import { langStringDefault } from "../../../../../../shared/lang";
import {registerDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {
    NEW_YEAR_ARIEL_NPC_NAME,
    NEW_YEAR_SANTA_NPC_NAME,
    NEW_YEAR_SIXTH_QUEST_ID
} from "../../../../../../shared/events/newYear/quests.config";
import {QuestStart} from "../../../../advancedQuests/dialogsExtensions/questStart";
import {EventTriggerAnswer} from "../../../../advancedNpc/dialogs/impl/EventTriggerAnswer";
import {TALK_WITH_NPC_EVENT} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";

registerDialog({
    id: "new-year-quest-6-dialog-1",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.457f5a8b3afd75d16b723ce223f87e82")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.85e3f3cb7499609dd52d60ef206c96f7"), toNode: 1},
            ]
        },
        {
            id: 1,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.2e47da307a310b7ea007250cba36b77e")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.5fd41b14430ea6d1065fe86e967de3ce"), toNode: 2},
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.f03d855f9ab64dddf1055ee89b0c6888")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.b77f58f9d36060b30e2ef111eb41ca0b"), toNode: 3},
            ]
        },
        {
            id: 3,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.c100e7ff9efbb29e0fc741711879b541")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.2df10b113485168a7cd9e8517075f0ce"), toNode: 4},
            ]
        },
        {
            id: 4,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.acbbd2abbc329499c75c4e5917462eaa")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.d67c24b130b3327bc1e9bc0ea37d39d6"), toNode: 5},
            ]
        },
        {
            id: 5,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.9e75ac488655d75b16a7fa1b36ee0ab2")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.f1a2d35cd33ea0e5f9ee316e0bc792ba"), toNode: 6},
            ]
        },
        {
            id: 6,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.c2a4ea7cb7cb451edd986eeceda26d2e")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.6f55967dee2a7a1619f8f3b6fb0c4de9"), isExit:true, onReply: new QuestStart(NEW_YEAR_SIXTH_QUEST_ID)},
            ]
        },
    ]
})

registerDialog({
    id: "new-year-quest-6-dialog-2",
    characterName: NEW_YEAR_ARIEL_NPC_NAME,
    nodes: [
        
        {
            id: 7,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.b53e77543ef711485a8986079196be9d")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.9d2ea683f2680dd1bc9c43dfe33e824b"), toNode: 8},
                {text: langStringDefault("sixth.quest.dialogs.4c50ca54b99ba723b4558658e7e8f3d6"), toNode: 8},
            ]
        },
        {
            id: 8,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.ab76daa2f4cb659ae755636e04603e3c")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.a620fee2de9f5778667b29d45945f715"), toNode: 9},
            ]
        },
        {
            id: 9,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.d2c0bb829b004f20494f882e8fb17f09")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.e41e73be6b735bd4cb5ffe664e1ed8d2"), toNode: 10},
            ]
        },
        {
            id: 10,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.7dc4e0825cdff9486cdcb0bd26db3fe4")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.d2e54b142027f2bf6b962c14a362d24d"), toNode: 11},
            ]
        },
        {
            id: 11,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.437b052c6c78713d73d741252b5434f7")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.ac2ba6ee083c583104e35be8c384ded5"), toNode: 12},
            ]
        },
        {
            id: 12,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.e4c12a8e48ba4862af8e38edd71f2937")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.d3059bdc7227da5b203089b8daf0cdc6"), toNode: 13},
            ]
        },
        {
            id: 13,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.54b4a49c5e34f0ff422ab805fe09b3e0")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.177f34254c3f9f49960cd2776ef0c587"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        }
    ]
})

registerDialog({
    id: "new-year-quest-6-dialog-3",
    characterName: NEW_YEAR_ARIEL_NPC_NAME,
    nodes: [
        {
            id: 14,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.6ae66e00c87083c58c05b1dd2dfd312e")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.7131f1db140c3dba487a260ed7978804"), toNode: 15},
            ]
        },
        {
            id: 15,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.45c20bc5656b54172687b17784bd2983")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.6031ed16d737fc3730a05b0cb3dc96c3"), toNode: 16},
            ]
        },
        {
            id: 16,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.2f693dddc837fb7ebb1836bf47c641cf")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.30d9570f43398bb9b4bb650b89a2898c"), toNode: 17},
            ]
        },
        {
            id: 17,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.9e881b779d71d557c55e26dbb1ff0e6d")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.835d389d81cd8eedda3f21e87e0020bb"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        },
    ]
})

registerDialog({
    id: "new-year-quest-6-dialog-4",
    characterName: NEW_YEAR_ARIEL_NPC_NAME,
    nodes: [
        
        {
            id: 18,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.d540a061a14c14d8f94f1872ef3a7f3e")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.6be40b5e38efb32a9d8d70cb647473ed"), toNode: 19},
            ]
        },
        {
            id: 19,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.8b7e5735ace44adf6aa51e71ac13245e")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.2981a714b2298da0cf4ac2c9f1589975"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        },
    ]
})

registerDialog({
    id: "new-year-quest-6-dialog-5",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 20,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.8ed7b36fde731b204678d13fe5d92151")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.a29b8678c201763dc6c3bdf0927383a8"), toNode: 21},
            ]
        },
        {
            id: 21,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.fc8abb0dbd2d654f6d9703e27ae00115")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.fe494f5cc4359a11a4be0d6ab1d27b10"), toNode: 22},
            ]
        },
        {
            id: 22,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.d118d0e7c39306207645713aad804498")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.37dfe70682d4c8b7c9819c820d8f17b2"), toNode: 23},
            ]
        },
        {
            id: 23,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.958a40cc2f0f36c5997f66e2ea6488b3")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.b8eb1bdc156b0fc126c8ca89bf3cb48b"), toNode: 24},
            ]
        },
        {
            id: 24,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.81519774fad4eedf5b98a5df46f4c8ee")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.50d29c229d51457a5fe4e8e26b6e731b"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        },
    ]
})

registerDialog({
    id: "new-year-quest-6-dialog-6",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        
        {
            id: 25,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.fb11728d31dac718dcb54bab9a6585ae")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.121ee86359eb724dcf24512b8e04e1b0"), toNode: 26},
            ]
        },
        {
            id: 26,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.c158825b655e743d3c8f6098e0cf08d7")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.10078b0c7e510ce03132863eb13083c0"), toNode: 27},
            ]
        },
        {
            id: 27,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.b4069b463097af2148daa85fde44b3e7")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.a0b84253f9c1836975ab5651459439ac"), toNode: 28},
            ]
        },
        {
            id: 28,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.e8acbc277ce2af6a02a0401d46d02715")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.5bd036aca9940f89b80aecbdfd06eb41"), toNode: 29},
            ]
        },
        {
            id: 29,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.19cd4ac4d58d1e3648bb28f3d9e95f3c")},
                {text: langStringDefault("sixth.quest.dialogs.f5f0aea8bbcfd774335d1b2914964752")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.dc96f144ea61ad460b0e732c7b35fb00"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        },
    ]
})

registerDialog({
    id: "new-year-quest-6-dialog-7",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 30,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.2cc3e405754700ff70a2b1878b872114")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.83d19a04a8f9c5a60b901acc3a14fd01"), toNode: 31},
            ]
        },
        {
            id: 31,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.d77ada32ca9d49c371156a95a43fa121")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.cd91ffa8076f9c64cb9cb6a505515fa1"), toNode: 32},
            ]
        },
        {
            id: 32,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.0486ad9574be1a503553b2df368da60f")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.72eea6fec18fc07711f89caee6ffbd5f"), toNode: 33},
            ]
        },
        {
            id: 33,
            npcReplies: [
                {text: langStringDefault("sixth.quest.dialogs.d9cf9a8bb44c2a2ba2b292de9a9fa2ef")},
                {text: langStringDefault("sixth.quest.dialogs.5d04e896300bb2c633e3980783d3faee")},
                {text: langStringDefault("sixth.quest.dialogs.007ae861b5ad596eb1b30512ba87e665")},

            ],
            answers: [
                {text: langStringDefault("sixth.quest.dialogs.16de114e9c72fd81405a5fe1c9f53aa8"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
                {text: langStringDefault("sixth.quest.dialogs.5f9b746e710cd7db3ac92090aceaa1c1"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
                {text: langStringDefault("sixth.quest.dialogs.9b9c6425448fdd39d52da8c8fd085796"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        },
    ]
})