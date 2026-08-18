import { langStringDefault } from "../../../../../../shared/lang";
import {registerDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {
    HALLOWEEN_GHOSTBUSTER_NPC_NAME, HALLOWEEN_GHOSTS_QUEST_ID,
    HALLOWEEN_GHOSTS_QUEST_NPC_NAME
} from "../../../../../../shared/events/halloween.config";
import {QuestStart} from "../../../../advancedQuests/dialogsExtensions/questStart";
import {EventTriggerAnswer} from "../../../../advancedNpc/dialogs/impl/EventTriggerAnswer";
import {TALK_WITH_NPC_EVENT} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";
import {DateCondition} from "../../../../advancedNpc/dialogs/impl/dateCondition";

const HALLOWEEN_GHOSTS_QUEST_AVAILABLE_DATE = new Date(2021, 11, 3, 9);

registerDialog({
    id: "halloween-quest-2-dialog-1",
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 26,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.db144200cddd7c1e490e3b5e47a716ec") },
            ],
            answers: [
                {
                    text: langStringDefault("ghosts.quest.dialogs.28a9a0bc3643c732a6cea7fdb196f264"),
                    toNode: 27
                    // toNode: new DateCondition(HALLOWEEN_GHOSTS_QUEST_AVAILABLE_DATE, 27, 900)
                }
            ]
        },

        {
            id: 900,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.f477e42e1d4df6263f6fdf8cfc480d9c") },
                { text: langStringDefault("ghosts.quest.dialogs.1f17b1224ec55a30c10bdda0d38be84e") },
                { text: langStringDefault("ghosts.quest.dialogs.3d6f900953e4e326443d6070f45b9ea3") },
                { text: langStringDefault("ghosts.quest.dialogs.1824e30b84cd6a0be60ae0fb68ee1920") }
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.1a02ebaad84eb4ba12ffef85ef2f8640"), isExit: true }
            ]
        },

        {
            id: 27,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.269a19fcda083ee6ff544c5c885d6f32") },
                { text: langStringDefault("ghosts.quest.dialogs.fdcf86b5a29595eb22f3400ee25be7c8") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.789a7c6dd98f021d108bf0447ced67d5"), toNode: 28 }
            ]
        },
        {
            id: 28,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.f6973ebbef4be81f26f56fed6458428f") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.a7d28611e2d6ad71253a923721191fa7"), toNode: 29 }
            ]
        },
        {
            id: 29,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.95bda0cf59bf535797124eb604239508") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.39a52e745482816cf427748ea7d44ac4"), toNode: 30 }
            ]
        },
        {
            id: 30,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.7329ea593a1c523f6e59be97a7111f66") },
                { text: langStringDefault("ghosts.quest.dialogs.0fcfe7570f8d9dc9576c963c5dfce486") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.a2a5be830a5113d3a00b9f65d7054505"), toNode: 31 }
            ]
        },
        {
            id: 31,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.5cc21db1e2a229ae638957964b9dc2b5") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.285ff979129d6fd19a96f61916bce1d8"), toNode: 32 }
            ]
        },
        {
            id: 32,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.c7d43da4b5b00be753ce3bb0ece182e3") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.fc41385d00878c294d8b745946746e7d"), isExit: true, onReply: new QuestStart(HALLOWEEN_GHOSTS_QUEST_ID) }
            ]
        },
    ]
});

registerDialog({
    id: "halloween-quest-2-dialog-2",
    characterName: HALLOWEEN_GHOSTS_QUEST_NPC_NAME,
    nodes: [
        {
            id: 33,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.d0a69e3745583dd9a511e5901a232b41") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.71fd16cdff7668870fc40b4f5c08605e"), toNode: 34 }
            ]
        },
        {
            id: 34,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.f28fd53002723ac3311adc8eafb652ec") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.798e89f1ce5fb00fbc6087ce3ef1f40a"), toNode: 35 }
            ]
        },
        {
            id: 35,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.6d9cbdf6feba55799d5893902679096a") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.389ed4bea3d798cdd49390ae431acc04"), toNode: 36 }
            ]
        },
        {
            id: 36,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.ff4b48c77bee1344bb8b1d7b264a1096") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.8f229e2e5a2e1fa1a44717096d509c44"), toNode: 37 }
            ]
        },
        {
            id: 37,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.ee586901cd8202a7811f1e211dcc9207") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.2c6d493b26c8857df0055c420069270f"), toNode: 38 }
            ]
        },
        {
            id: 38,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.e146cbbcfa8dc7cf3fc355672f3d8667") },
                { text: langStringDefault("ghosts.quest.dialogs.eb9332964ec840fc8cd53f81b3cec94a") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.e4cbb550ccea6add552df1c03a7ddb7b"), toNode: 39 }
            ]
        },
        {
            id: 39,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.81eecbad5b3a781314e122c84ac2f2e3") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.24500ae11fe602103784cf9ef8fb39bc"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});

registerDialog({
    id: "halloween-quest-2-dialog-3",
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 40,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.9e1bd4ed0893fdab36017842df890e96") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.420d237b5756850de67afeda477a330f"), toNode: 41 }
            ]
        },
        {
            id: 41,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.853f01c509ca7189733ca8cc66c16764") },
                { text: langStringDefault("ghosts.quest.dialogs.956754597fbcbe35d80bf6d666e66e9f") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.7c79022cf9e57395bdff4a98c8b058f8"), toNode: 42 }
            ]
        },
        {
            id: 42,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.6ae193a49ef04c79b03fff8fa5a98acf") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.f2d1133b7a341c2fc5e8df58bc4af8ab"), toNode: 43 }
            ]
        },
        {
            id: 43,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.6b0863cb616e1d1ef9c4c2065f2c1433") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.6fbc88a19b3e2df4223283485c8ddf01"), isExit:true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});

registerDialog({
    id: "halloween-quest-2-dialog-4",
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 44,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.b982fef31e6c22bdb36b69cefd5918bd") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.d7954d9315a50a4d5545d31821a85ce1"), toNode: 45 }
            ]
        },
        {
            id: 45,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.9463d452bd49be54c36ff80865b3e5f8") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.7d2c6adb2efbfe20536b3e29bd15a9f4"), toNode: 46 }
            ]
        },
        {
            id: 46,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.8c3e99a6b54cfdae36ffe6291858484c") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.67cad475676cb984bbdf42e7d8b6a40c"), toNode: 47 }
            ]
        },
        {
            id: 47,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.a400c2798ffecdeb27003577b85663b8") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.c1f13200a7778da005922e7b753c8c67"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});

registerDialog({
    id: "halloween-quest-2-dialog-5",
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 48,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.f6bf8b53cafa4dce93a4c2c462ce3b79") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.f54d7355caeb035226c35fd52efefb5f"), toNode:49 }
            ]
        },
        {
            id: 49,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.03d9540cb85f4f5d5dad1fdc1e077b25") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.9e6f3a9084b4455197c54135cc642f64"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});

registerDialog({
    id: "halloween-quest-2-dialog-6",
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 50,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.52ec8f89c370aaa53f20d7fd0bb63d24") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.98f4d3a0606e98afa982132c68568920"), toNode:51 }
            ]
        },
        {
            id: 51,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.2543f180c0ec7e0463f4c6615c883160") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.12901bda62a127a85b8ad226c8048c6a"), toNode:52 }
            ]
        },
        {
            id: 52,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.31e8ec88544d905e53eb24c3af3f8357") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.af17546d2368628f7cf66aa7c4048d9b"), toNode:53 }
            ]
        },
        {
            id: 53,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.91025e7d7bc9b9e651e0e1b4e7b7bb3e") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.21ea0c385ff1eb549656b1642da95fda"), toNode:54 }
            ]
        },
        {
            id: 54,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.e5cc4e44373deb7df13a54957788c731") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.92e2803433b28c0e880f0ab5f046361e"), toNode:55 }
            ]
        },
        {
            id: 55,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.cc7f30680a9dee16002f581f6b18a4a8") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.8416572d38e545b144825fee2c438110"), toNode:56 }
            ]
        },
        {
            id: 56,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.b63259b241c796919e22f46e64fc16ae") },
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.87f81082b6407e258e5050c0a693108e"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        },
    ]
});

registerDialog({
    id: "halloween-quest-2-dialog-7",
    characterName: HALLOWEEN_GHOSTBUSTER_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.67107e0ce9901c5935b691ccd978e8b5") }
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.2fbfdd94cfb1434ff3cfbfca6febd0bc"), toNode: 1 }
            ]
        },
        {
            id: 1,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.248393867aaa754ab05a01713aef5efa") },
                { text: langStringDefault("ghosts.quest.dialogs.577e074d00dce5b67709570e000b38b7") }
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.c62a771e3ddeabbc971977a6e5de3f86"), toNode: 100 },
                { text: langStringDefault("ghosts.quest.dialogs.6ab225014223f692def3099aed04b1c3"), toNode: 2 }
            ]
        },
        {
            id: 100,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.5deca28907f174779ff48464fa49dea5") },
                { text: langStringDefault("ghosts.quest.dialogs.57d0184444e5ac06e5d213415fd7a2e6") }
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.03877d228ef6bb715cf6cd09208eae99"), toNode: 101 }
            ]
        },
        {
            id: 101,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.8bead16f12d6c190de06afcd2d8122bc") }
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.04b3a61e3f43e8c4b3c370e8843deeb0"), toNode: 2 }
            ]
        },
        {
            id: 2,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.24000eee9287e0c02022f998de3315a0") },
                { text: langStringDefault("ghosts.quest.dialogs.9dd51085e282ddc7953de21b97a50227") },
                { text: langStringDefault("ghosts.quest.dialogs.e9aa41487ec7cebeaee9a9e24aa403ab") }
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.06a746f69715aac06504ed9eac4efa79"), toNode: 3 }
            ]
        },
        {
            id: 3,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.c7a5310ec09c8cc5bea906269c136a13") },
                { text: langStringDefault("ghosts.quest.dialogs.472f9e4d7419a4cee6e06b5be34316eb") }
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.ce5af79c451f45330f1dda9f03026a62"), toNode: 4 }
            ]
        },
        {
            id: 4,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.fc53af5f4596282379f2ec832f7e9682") }
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.cdcc87f2629c0eb1e77f470106ae3157"), toNode: 5 }
            ]
        },
        {
            id: 5,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.eb35f459c337d320cab7e17a1f35ad9c") }
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.c5ef042e3482d88aa9ea018d08b5bfa2"), toNode: 6 }
            ]
        },
        {
            id: 6,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.91cabcc6b13b16a57853955e0cae0fb5") }
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.1d10f26307e0b6eefb8b67332d5c58d1"), toNode: 7 }
            ]
        },
        {
            id: 7,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.910c2f7d29356b8a1712747efa2cc77b") },
                { text: langStringDefault("ghosts.quest.dialogs.7710af589abb0e05fdd0bf28a48c8494") }
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.5caf0488830fce155419defc2119e8d2"), toNode: 8 }
            ]
        },
        {
            id: 8,
            npcReplies: [
                { text: langStringDefault("ghosts.quest.dialogs.5af0777f32de9c0d8cf978ab2ecd6129") }
            ],
            answers: [
                { text: langStringDefault("ghosts.quest.dialogs.df877c64c9669c2be00c588602d3a9b6"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT) }
            ]
        }
    ]
})
