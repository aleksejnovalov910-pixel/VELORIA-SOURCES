import { langStringDefault } from "../../../../../../shared/lang";
import {registerDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {
    NEW_YEAR_FOURTH_QUEST_ID,
    NEW_YEAR_HOMELESS_NPC_NAME,
    NEW_YEAR_SANTA_NPC_NAME,
    NEW_YEAR_SPANISH_NPC_NAME
} from "../../../../../../shared/events/newYear/quests.config";
import {QuestStart} from "../../../../advancedQuests/dialogsExtensions/questStart";
import {EventTriggerAnswer} from "../../../../advancedNpc/dialogs/impl/EventTriggerAnswer";
import {TALK_WITH_NPC_EVENT} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";


registerDialog({
    id: "new-year-quest-4-dialog-1",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.f0baf46a5fc1e74a3344e49bad5f075f")}
            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.0eb2240c8d8a71c1bdf67754f3f2df45"), toNode: 1},
                {text: langStringDefault("fourth.quest.dialogs.9721ff59f779231388a48449b3c62bee"), toNode: 2},
            ]
        },
        {
            id: 1,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.38720c8ac75f943c7e4276baa98dc23d")},
                {text: langStringDefault("fourth.quest.dialogs.5573c68b778978f24da20c54a2e8b8b8")}

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.9301d2e3714456493aa71fc9c0fa1051"), toNode: 3},
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.8c4aa60672fa477cf373e496000fbb08")},
                {text: langStringDefault("fourth.quest.dialogs.9677222bccf9f24a3882e5a87ebea84a")}

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.0267a211c0bd947b6035377688986818"), toNode: 3},
            ]
        },
        {
            id: 3,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.542bb1450ac49fd5f950823084c85c62")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.d6070c32961c42aeb5625d54c5685eec"), toNode: 4},
            ]
        },
        {
            id: 4,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.143299c60d1376a3e2d0734ded361199")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.1a4dab02a73d48517647047bce14bdd3"), toNode: 5},
            ]
        },
        {
            id: 5,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.650792ff9d40c83f6ae2d741ea01471a")},
                {text: langStringDefault("fourth.quest.dialogs.a883547bb8ade3626e3f2bf4dfafcf00")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.60cffbd7bdff965eaae94fc2b0f55188"), toNode: 6},
            ]
        },
        {
            id: 6,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.1a09e4ec14122f13f001f51e5f09d97f")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.62b910e744a9152521c970317f06d66d"), toNode: 7},
            ]
        },
        {
            id: 7,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.39b976fc725f48903f69ec41c8aa65cf")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.c8ef472844c50a740d71b6229724d883"), toNode: 8},
            ]
        },
        {
            id: 8,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.f0861671d7268505dda2bfd7670a58bf")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.ef9e461c8f8655c1f67d24ac8958f053"), toNode: 9},
            ]
        },
        {
            id: 9,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.e9d31a56e49e37792333463f5856d2f6")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.4cf0497b5eab87564332a8d8cf8c1d33"), isExit: true, onReply: new QuestStart(NEW_YEAR_FOURTH_QUEST_ID)},
            ]
        },
    ]
})

registerDialog({
    id: "new-year-quest-4-dialog-2",
    characterName: NEW_YEAR_HOMELESS_NPC_NAME,
    nodes: [
        
        {
            id: 10,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.b32de7913d12b4d05d96513533e59ca8")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.fc698814afea90b13688c495e3e3f5b2"), toNode: 11},
            ]
        },
        {
            id: 11,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.53d8dfc3834e34104700b89a1f4bf361")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.1c3fd04048bfdd3139050ff3ab9ccd61"), toNode: 12},
            ]
        },
        {
            id: 12,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.025af10f9bd9fcf10700398fdabf6b7d")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.253572a02deafbeb8d4365243b75bec7"), toNode: 13},
            ]
        },
        {
            id: 13,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.790c72bb985fe35a4244c384948e2bc3")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.cf7fb2626e24b8ae257bcff4b6c5524d"), toNode: 14},
            ]
        },
        {
            id: 14,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.8454231426a97a4d1236b27ffb5d0715")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.3bffb5814de6fff73bc1f45aee03ba30"), toNode: 15},
            ]
        },
        {
            id: 15,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.112c432811ebcf3d9633a3d153377e19")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.6496ad6c42df1b8cd2a2c41dad730d17"), toNode: 16},
            ]
        },
        {
            id: 16,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.9fa0e32535f36794b32d4cf3d8d90102")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.e2ad0e588f5a56fe447f7c3ea3ba1858"), toNode: 17},
            ]
        },
        {
            id: 17,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.adfc15d23ad8541475952da56bf27cb4")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.21dc216ec75cf65cd17fb36eeaf6c498"), toNode: 18},
            ]
        },
        {
            id: 18,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.66d982e768cb95cbe30c4ca544ac78ac")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.cb32cb6807d4ae81e3a40090cd86a89a"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        },
    ]
})

registerDialog({
    id: "new-year-quest-4-dialog-3",
    characterName: NEW_YEAR_HOMELESS_NPC_NAME,
    nodes: [
        
        {
            id: 19,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.9b4db04b56737db2bc95bc102a7ba473")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.f3fc0d6d01034a106cad5c83017cd35a"), toNode: 20},
            ]
        },
        {
            id: 20,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.4d22d1190d3ead02bc699ea4d9883993")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.49df4fbb8ea8d11844597f7fe580d42a"), toNode: 21},
            ]
        },
        {
            id: 21,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.194e024781c227fb0bd6aaf28d61a744")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.5ad248872d4ea70cc018562255ee2692"), toNode: 22},
            ]
        },
        {
            id: 22,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.1a51b8487387b92452f369985ccc0d09")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.eac37aa16e362d0abe1f6cb266a23265"), toNode: 23},
                {text: langStringDefault("fourth.quest.dialogs.48ec453e18790ef5f6acb5c6c00f1436"), toNode: 23},
            ]
        },
        {
            id: 23,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.1b78e6227d81fc29f5a9735b37f5a8b4")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.f8ef129a8eb9abec5f34620ace54b372"), toNode: 24},
            ]
        },
        {
            id: 24,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.54c1416e7177c2bfef872f186de2cd13")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.3ee569e7f7911bf606780e16fcc3453b"), toNode: 25},
            ]
        },
        {
            id: 25,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.628704c66db792885996555d7cb269cd")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.b649c579ca4df04b2b4fb3aaed3c5361"), toNode: 26},
            ]
        },
        {
            id: 26,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.472b71ab4518b4f8b0facab71ce9f844")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.50d71c76f354b4dc5ada27bc8790f80e"), toNode: 27},
                {text: langStringDefault("fourth.quest.dialogs.a4c683208947d14f3e0ed216419168cd"), toNode: 27},
            ]
        },
        {
            id: 27,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.9b2cc36be5a2f8e3670481194ad1c282")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.2c8e37a9556642ec538ef8c568dab4ea"), toNode: 28},
            ]
        },
        {
            id: 28,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.efc11ff05ef19cceebbb9b8cf3f68b37")},
                {text: langStringDefault("fourth.quest.dialogs.f20d0fa05a3f902531e897a04bfd06c4")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.45fdb9457c87472c4a302ad071f2b61e"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        }
    ]
})

registerDialog({
    id: "new-year-quest-4-dialog-4",
    characterName: NEW_YEAR_SPANISH_NPC_NAME,
    nodes: [
        {
            id: 29,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.b60873d20f358223fe68ddf5a52324ee")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.6333c264eeed5e0613fa383705bc1c80"), toNode: 30},
            ]
        },
        {
            id: 30,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.bac75b461c80794020cb68be41ee83f5")},
                {text: langStringDefault("fourth.quest.dialogs.e1e530674a5bd98cf578da48a3638e57")},
                {text: langStringDefault("fourth.quest.dialogs.38cb59e1ae4bd6e4a5cd4f5394cbac3e")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.592d3dd060e0a10b5edee97e47cad3e9"), toNode: 31},
            ]
        },
        {
            id: 31,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.f093281b85a53ce9e249e39385c2427c")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.9cc5d7ebaf67f88fcb615877c43d8e3f"), toNode: 32},
            ]
        },
        {
            id: 32,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.4e84deb7a4eb434bb79cbbb6a4b893bc")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.4079d5d46ad41c5cd423df1c70d5065e"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        },
    ]
})

registerDialog({
    id: "new-year-quest-4-dialog-5",
    characterName: NEW_YEAR_SPANISH_NPC_NAME,
    nodes: [
        
        {
            id: 33,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.1ab614105e48e0219c4a70578b42cbca")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.d26210de2570cffebbfb590e11d75a00"), toNode: 34},
            ]
        },
        {
            id: 34,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.9037b0e84854517ab884b2bb5dd398d9")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.d665409e7cd89bd49d1adcffef3501d9"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        },
    ]
})

registerDialog({
    id: "new-year-quest-4-dialog-6",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 35,
            npcReplies: [
                {text: langStringDefault("fourth.quest.dialogs.69543c4a5048984625573b89f5aea746")},

            ],
            answers: [
                {text: langStringDefault("fourth.quest.dialogs.c4104a22af441bea083635a9011ba4fd"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)},
            ]
        },
    ]
})