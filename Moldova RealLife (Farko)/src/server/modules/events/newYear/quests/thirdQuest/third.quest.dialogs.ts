import { langStringDefault } from "../../../../../../shared/lang";
import {registerDialog} from "../../../../advancedNpc/dialogs/dialogs";
import {
    NEW_YEAR_SANTA_NPC_NAME,
    NEW_YEAR_THIRD_QUEST_ID
} from "../../../../../../shared/events/newYear/quests.config";
import {QuestStart} from "../../../../advancedQuests/dialogsExtensions/questStart";
import {EventTriggerAnswer} from "../../../../advancedNpc/dialogs/impl/EventTriggerAnswer";
import {TALK_WITH_NPC_EVENT} from "../../../../advancedQuests/impl/MultiStepQuest/talkWithNpcQuestStep";

registerDialog({
    id: "new-year-quest-3-dialog-1",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 0,
            npcReplies: [
                {text: langStringDefault("third.quest.dialogs.f834eda3dd3e403c4ca463df2e675242")}
            ],
            answers: [
                {text: langStringDefault("third.quest.dialogs.60c388e484ff8f6e2c79d3400dd7d121"), toNode: 1}
            ]
        },
        {
            id: 1,
            npcReplies: [
                {text: langStringDefault("third.quest.dialogs.be33973a56f52f3ef52f63a501b25eea")}
            ],
            answers: [
                {text: langStringDefault("third.quest.dialogs.d3018b6439d1c93f7f5cff56b725af60"), toNode: 2}
            ]
        },
        {
            id: 2,
            npcReplies: [
                {text: langStringDefault("third.quest.dialogs.454fa43fb894ef1c68eef07656d802c7")}
            ],
            answers: [
                {text: langStringDefault("third.quest.dialogs.f24f2357dd8788fbd01944522eb5862d"), toNode: 3}
            ]
        },
        {
            id: 3,
            npcReplies: [
                {text: langStringDefault("third.quest.dialogs.b50aa04a0d3b02ad9985cd10748884e3")}
            ],
            answers: [
                {text: langStringDefault("third.quest.dialogs.ee7b7c72f98c14fe92ce3682b553c3f2"), toNode: 4}
            ]
        },
        {
            id: 4,
            npcReplies: [
                {text: langStringDefault("third.quest.dialogs.5aa318880f886021ba20d07bf67aa513")},
                {text: langStringDefault("third.quest.dialogs.ecd8843ff33b190c044a2c53a4b41c40")}
            ],
            answers: [
                {text: langStringDefault("third.quest.dialogs.b5e8daa4ccb47ab974f3ecc562fd3613"), toNode: 5}
            ]
        },
        {
            id: 5,
            npcReplies: [
                {text: langStringDefault("third.quest.dialogs.63cf3551061d87d929aef7b6819a6bab")},
                {text: langStringDefault("third.quest.dialogs.d73ab9f5733b4399089a7bddf82662d8")},
                {text: langStringDefault("third.quest.dialogs.43e2f2776f132b92af1b3944973a688e")},
                {text: langStringDefault("third.quest.dialogs.e831d2299dcc9f4d189748301dab5497")},
                {text: langStringDefault("third.quest.dialogs.d962b5d0a59bfabc66baff4c40e40a55")}
            ],
            answers: [
                {text: langStringDefault("third.quest.dialogs.b4aecc493c8bc4a5488a88e1fb1f7460"), toNode: 6}
            ]
        },
        {
            id: 6,
            npcReplies: [
                {text: langStringDefault("third.quest.dialogs.0353a103c729b91fbb39f7085f619711")}
            ],
            answers: [
                {text: langStringDefault("third.quest.dialogs.5f6ff7767aca0e3105ddc119c7281cd3"), toNode: 7}
            ]
        },
        {
            id: 7,
            npcReplies: [
                {text: langStringDefault("third.quest.dialogs.9ed20f0e88ff761988a844c7a1c0af95")}
            ],
            answers: [
                {text: langStringDefault("third.quest.dialogs.343feb1353baf6f3103642fbf3001ca4"), isExit: true, onReply: new QuestStart(NEW_YEAR_THIRD_QUEST_ID)}
            ]
        }
    ]
})

registerDialog({
    id: "new-year-quest-3-dialog-2",
    characterName: NEW_YEAR_SANTA_NPC_NAME,
    nodes: [
        {
            id: 8,
            npcReplies: [
                {text: langStringDefault("third.quest.dialogs.e44ad83530962111492aa301122fa83d")}
            ],
            answers: [
                {text: langStringDefault("third.quest.dialogs.ee887b85fa0955e812a575df37c18d38"), toNode: 9}
            ]
        },
        {
            id: 9,
            npcReplies: [
                {text: langStringDefault("third.quest.dialogs.fe3f2ebfa94326fd3e4d5d2c8f9c86b8")}
            ],
            answers: [
                {text: langStringDefault("third.quest.dialogs.d2a7fc5da3cf42a17d0a5a17d29b2971"), toNode: 10}
            ]
        },
        {
            id: 10,
            npcReplies: [
                {text: langStringDefault("third.quest.dialogs.ecfee8d456e9bff102b73bcf732a64d4")}
            ],
            answers: [
                {text: langStringDefault("third.quest.dialogs.c74b72534e200b613fdd669aefcd4a66"), isExit: true, onReply: new EventTriggerAnswer(TALK_WITH_NPC_EVENT)}
            ]
        }
    ]
})