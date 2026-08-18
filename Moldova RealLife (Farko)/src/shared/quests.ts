import { langStringDefault } from "./lang/index";
import { ITEM_TYPE } from "./inventory";
import { LicenceType } from "./licence";

/** Конфиг по выдаче стартовых квестов. Должно быть 3 элемента, для первого второго и третьего начального квеста (они являются первыми квестами сюжетной линии). */
export const QUEST_SPAWN_ITEM: {
    x: number, 
    y: number, 
    z: number, 
    h: number, 
    /** ID самого квеста, который будет выдан игроку при создании персонажа. Если не указать - квест выдан не будет */
    questID?: number
}[] = [
    {x: 3.29, y: -1308.97, z: 30.17, h: 293, questID: 1},
    {x: -1057.11, y: -855.24, z: 4.87, h: 151, questID: 500},
    {x: -519.57, y: -258.77, z: 35.59, h: 28},
]

export const QUESTS_DATA: QuestData[] = [
    {
        id: 1, name: langStringDefault("quests.7417593e4781b7d3aad44b3da8b7fbbf"), desc: langStringDefault("quests.dcf448a13332b8bf5d39186bba9fb87d"), reward: 
        [{ type: "cash", value: 500 }, { type: "item", value: 850}], taskStepByStep: true, nextQuest: 2,  botData: {
            id: 0,
            dialogStart: [langStringDefault("quests.63b6f227996ed212e8aa474da4c08269"), 
            { answers: [langStringDefault("quests.e30498d969fdb59116d7bc05132ed4ba")], onAnswer: () => {                   
                return [langStringDefault("quests.4ca2b78258b56e2daec4dca83eb5f565"), 
                { answers: [langStringDefault("quests.71c4168ca9e7d9cd92c98dfa4f3f2514")] 
            }]
            } }],
            dialogComplete: [langStringDefault("quests.f3fe839ed135272f5eb2aae7e8a48922"), {
                answers: [langStringDefault("quests.26d2f141e526ab8334636226eeb6e946"),], onAnswer: (index) => 2
            }],
        },
        tasks: [
            {   
                nameTask: langStringDefault("quests.c43ebcdb66faeaef32f9df57a0866c5d"),
                descTask: langStringDefault("quests.0d6494b7489a56d7b2624659d31810f0"),
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {
                nameTask: langStringDefault("quests.ef0ea73e441ec8e015cead25f8e4676a"),
                descTask: langStringDefault("quests.b8defa0a8a7c56f87a272beebb4b480a"),
                type: "delivertonpc",
                name: langStringDefault("quests.834156d161887a6bdb1f6cba548c64e2"),
                role: "",
                dialog: [langStringDefault("quests.7cc1ed25abe82c382828d710d61b93e2"), { answers: [langStringDefault("quests.4135dcdb7519a2ce87a721aa1a80ac9a")], onAnswer: () => {
                    return [langStringDefault("quests.a9dfef9a20437c3a677c8b2584b216a4"), {
                        answers: [langStringDefault("quests.28e265d9b1e21692c087e6a0f7ea893b")], onAnswer: () => {
                            return [langStringDefault("quests.2e19f95e46c4b470d9539cf374553cb5"), {
                                answers: [langStringDefault("quests.374edc722d8985413ad681e381901b70")], onAnswer: () => {
                                    return [langStringDefault("quests.b4ae18b535eac8a9f6c81055883c07af"), {
                                        answers: [langStringDefault("quests.76f2eb883786b526fd3342e5f03f9e2b")] 
                                    }]
                                }
                            }]
                        }
                    }] 
                } }],
                model: "a_m_m_paparazzi_01",
                x: 446.59, y: -1231.38, z: 29.94, h: 288,
                itemName: langStringDefault("quests.14c234d9795b65310e394822a0fd5dfa"),
                blipData: {
                    x: 446.59, y: -1231.38,
                    text: langStringDefault("quests.d9efc1777acaf59ecee2f7bbf6d3bedd"),
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: langStringDefault("quests.df5ad4d55fc8a7754328950f16242197"),
                descTask: langStringDefault("quests.7cf4723ea1656bb2fe322ef14f239720"),
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]
    },
    {
        id: 2,
        name: langStringDefault("quests.775b53f8a4f314b2fd2f0065294be06c"), desc: langStringDefault("quests.483da8a6a1669a7fedeeae6c00b34b58"), reward: [{ type: "cash", value: 500 }], taskStepByStep: true, nextQuest: 3, botData: {
            id: 0,
            dialogStart: [langStringDefault("quests.d0a63feb798147c0a3930399667f7afd"), 
            { answers: [langStringDefault("quests.b6f36eba8ed5cc579661c835b7264351")], }],
            dialogComplete: [langStringDefault("quests.cad217cfd7a6c1f1cdd8c48fc267bbf5"), {
                answers: [langStringDefault("quests.234dc7dbfe57e5f8391ba25150542408")], onAnswer: (index) => 3 }],
        },
        tasks: [
            {   
                nameTask: langStringDefault("quests.8ac41534c9299686c6ab38ecb985373a"),
                descTask: langStringDefault("quests.611dbfcffdf24540e29df51384ff21be"),
                type: "itemHave",
                item_id: 851,
                blipData: {
                    x: -658.13,
                    y: -853.86,
                    text: langStringDefault("quests.ea1ad8ea092339aaaa1d39def96bd40c"),
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: langStringDefault("quests.06a5c3623b7d6bbbe3f6b6953f4752b7"),
                descTask: langStringDefault("quests.b6d8df9ff0c30b1cb03e8ef7c45a502d"),
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
    {
        id: 3, name: langStringDefault("quests.368404c3833f51f23c4a6459e350e1ed"), desc: langStringDefault("quests.ca340aa5e5b8f605f88d71c81e0b2952"), reward: [{ type: "cash", value: 500 }], taskStepByStep: true, nextQuest: 4, botData: {
            id: 0,
            dialogStart: [langStringDefault("quests.e46a1c6a599571762791193851d113c7"), { answers: [langStringDefault("quests.394496183b2251dd06d899289db1f257")], onAnswer: () => {
                return [langStringDefault("quests.27288765eec992a645d81426c6df6785"), {
                    answers: [langStringDefault("quests.ef2aefdd3ffb275554ab844660420bc2")]
                }]
            } }],
            dialogComplete: [langStringDefault("quests.09a728eaef2d2c027b3595cdd5c02ef8"), {
                answers: [langStringDefault("quests.67f372be0d60e41a0961daf605ff6d8d")], onAnswer: (idnex) => 4 }],
        },
        tasks: [
            {   
                nameTask: langStringDefault("quests.de153b42c5e687f20cbfd8e0e8dd92bc"),
                descTask: langStringDefault("quests.50dbd43cb2e3da891b6deed7a89ba132"),
                type: "itemHave",
                item_id: 800,
                blipData: {
                    x: -541.83,
                    y: -209.09,
                    text: langStringDefault("quests.9d82812074740caf0a1573e1d6315f74"),
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 1
                }
            },
            {   
                nameTask: langStringDefault("quests.adddde20fa0d77aa69c30f632014139e"),
                descTask: langStringDefault("quests.244ee041ddc3f932bd83791c0b53e17b"),
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ] 
    },
    {
        id: 4, name: langStringDefault("quests.b7fd6ea8c08b1a48e5649afbeadce5d2"), desc: langStringDefault("quests.9ebbb562351352c6cdcd42816b6ad18d"), reward: [{ type: "cash", value: 500 }], taskStepByStep: true, nextQuest: 5, botData: {
            id: 0,
            dialogStart: [langStringDefault("quests.4fce2c26f7ae6be0d384e19e079025f3"), { answers: [langStringDefault("quests.562a331a887b17a8700f840d5f726d03")], onAnswer: () => {
                return [langStringDefault("quests.b19109ae3321a9d8d471831614c52d19"), {
                    answers: [langStringDefault("quests.2907631bd49620bfb0d7b14d3b544a03")]
                }]
            } }],
            dialogComplete: [langStringDefault("quests.d3568333c88c9b00d4abcc27c9312a76"), {
                answers: [langStringDefault("quests.c116daa009a55a008b71ee10de1b9c45")], onAnswer: (index) => 5 }],
        },
        tasks: [
            {   
                nameTask: langStringDefault("quests.158c7ae8c5a157580a91b035a3d53e43"),
                descTask: langStringDefault("quests.a7373552477729686ef62a2bd411c2a2"),
                type: "itemHave",
                item_id: 7,
                blipData: {
                    x: 28.92,
                    y: -1350.07,
                    text: langStringDefault("quests.77d5dbebc89ab9ca686273ffd37005b8"),
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: langStringDefault("quests.2e70b5e0ee6b4a59c81f48051462619e"),
                descTask: langStringDefault("quests.d0318f93938de2ba5b2991921fa50329"),
                type: "itemHave",
                item_id: 21,
            },
            {   
                nameTask: langStringDefault("quests.ef5941ca9c6fc2e2398980127f5ef0fc"),
                descTask: langStringDefault("quests.9b8c44da96917d5d17889552a356af80"),
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]
    },
    {
        id: 5,
        name: langStringDefault("quests.b0a57ff6fb5ae8940a910f690b7075e9"), desc: langStringDefault("quests.1205ed6248cca0dabcf8495e4ef92840"), reward: [{ type: "cash", value: 500 }], 
        taskStepByStep: true, nextQuest: 6, botData: {
            id: 0,
            dialogStart: [langStringDefault("quests.5c0eab900733444bfa60b7877eb03d8a"), { answers: [langStringDefault("quests.dc64c5cbcee295e7592d67d71993c4f1")], onAnswer: () => {
                return [langStringDefault("quests.1725a3a6b9976180129d03e893f18ae2"), {
                    answers: [langStringDefault("quests.5ee934c9c650e6a197c5fdfba495b118")]
                }]
            } }],
            dialogComplete: [langStringDefault("quests.e74cb71e2e1c5dec1377317435018568"), {
                answers: [langStringDefault("quests.6166fa2b7c165cfd4ad37ba24d0c6d9a")], onAnswer: (index) => 6 }],
        },
        tasks: [
            {   
                nameTask: langStringDefault("quests.23a707e00b32aed82ec49d2893b3a232"),
                descTask: langStringDefault("quests.fb7e1200624d9147ce2a873a3384e00d"),
                type: "jobFarm",
                job: "marihuana",
                amount: 700,
                blipData: {
                    x: 1966.38,
                    y: 5184.26,
                    text: langStringDefault("quests.c5dc3666f8afeabaccc9631abbcce956"),
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: 'Întoarceti-va la Stanley',
                descTask: langStringDefault("quests.490218709050a570e527bb34cd275853"),
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
    {
        id: 6,
        name: langStringDefault("quests.cb879cd60fb8260872b0c62d7e51cd25"), desc: langStringDefault("quests.1316907f84aa2c2138ba26c39c62ac93"), reward: [{ type: "cash", value: 1000 }], taskStepByStep: true, nextQuest: 7, botData: {
            id: 0,
            dialogStart: [langStringDefault("quests.d123f8c870270bd82fdaf5a3f69a2f23"), 
            { answers: [langStringDefault("quests.eed7bc7c20d90d658b17eef1c8872075")], }],
            dialogComplete: [langStringDefault("quests.b0b143036a40b7f42dda011d626ca9ec"), {
                answers: [langStringDefault("quests.f6020763efc016d320db9c2dc54b0a5d")], onAnswer: (index) => 7 }],
        },
        tasks: [
            {   
                nameTask: langStringDefault("quests.fae43646b7e5b3a3e78c02655855ca95"),
                descTask: langStringDefault("quests.fe04f4e1d6858d8b4eabd6da7b1bc40b"),
                type: "licenseHave",
                license: "car",
                blipData: {
                    x: -817.61,
                    y: -1340.45,
                    text: langStringDefault("quests.03b6d8bc91aa4828061589cf5d4f2730"),
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: langStringDefault("quests.f4193865bd85143487f45e166043e5f2"),
                descTask: langStringDefault("quests.821209fb4faa083586c4041e4657c91f"),
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
    {
        id: 7,
        name: langStringDefault("quests.a5302b4a82c8aa53449609bcac427682"), desc: langStringDefault("quests.335c7d981be3cfd32e851edafb77dd10"), reward: [{ type: "cash", value: 500 }, {type: "item", value: 813}], nextQuest: 8, taskStepByStep: true, botData: {
            id: 0,
            dialogStart: [langStringDefault("quests.de5f89078017c0d3eabfe2ecddcfbebf"), 
            { answers: [langStringDefault("quests.8c64e8cdebe3f0f35f31836c6af74956")], }],
            dialogComplete: [langStringDefault("quests.a24448750a346e603f29b537cfca991e"), {
                answers: [langStringDefault("quests.922b49a6bd5c89ef0d9d3154ca08287d")], onAnswer: (index) => 8 }],
        },
        tasks: [
            {   
                nameTask: langStringDefault("quests.4412470f1c98d08bf972372b26634a34"),
                descTask: langStringDefault("quests.06ca8536e686d9e7a89770c59e1a6c4f"),
                type: "itemHave",
                item_id: 801,
                blipData: {
                    x: 151.19,
                    y: -1037.22,
                    text: langStringDefault("quests.b055dba0ba73396a236dc541238266fc"),
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: langStringDefault("quests.9ded420d57215de0f7fa44d26100d6d4"),
                descTask: langStringDefault("quests.4838f7fcdd59d931c7bf69d8ada0ddaa"),
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
    {
        id: 8,
        name: langStringDefault("quests.3326a16bf4c8bfb51ef422c3fdda5674"), desc: langStringDefault("quests.226c1e38a8b842a3c1914dc53b7252ab"), reward: [{ type: "license", value: 15, licenseType: "weapon", }, {type: "item", value: 813}], taskStepByStep: true, nextQuest: 9, botData: {
            id: 0, 
            dialogStart: [langStringDefault("quests.594cfc57f49e72af7e994a2fb9cf28ac"), 
            { answers: [langStringDefault("quests.404f7e7891d8c78ae86c09e831eefb1a")], }],
            dialogComplete: [langStringDefault("quests.e318b93e90a9a29e282188173f4e52ff"), {
                answers: [langStringDefault("quests.5ab961fdd55cca3723fabc7dcf1cfb81")], onAnswer: (index) => 9 }],
        },
        tasks: [
            {   
                nameTask: langStringDefault("quests.bf0540f2aa057c3aad9c9461ca653216"),
                descTask: langStringDefault("quests.28aa12a5bc67b8e705e14bb18190d336"),
                type: "gotopos",
                x: 446.59,
                y: -1231.38,
                z: 29.94,
                text:langStringDefault("quests.243cc26d3691fefa1cde367b91e3ae24"),
                blipData: {
                    x: 446.59,
                    y: -1231.38,
                    text: langStringDefault("quests.90d79c829811174a3c8c08f39b3f1766"),
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 11
                }
            },
            {   
                nameTask: langStringDefault("quests.3baff17c556539fc3a1baf62ceae96b1"),
                descTask: langStringDefault("quests.4ab10ce2acbd68e7bd13bad80f03678d"),
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
    {
    
        id: 9,
        name: langStringDefault("quests.5f3a0d6b94b7a1610f86a2126a2c3000"), desc: langStringDefault("quests.f1d5acecf6cdeb959404525afd9de1fb"), reward: [
            { type: "item", value: 856, }, 
            { type: "cash", value: 1000, },
            ],  taskStepByStep: true,
            botData: {
            id: 0,
            dialogStart: [langStringDefault("quests.a868a3e93a48d055fcff009aa10ae444"), 
            { answers: [langStringDefault("quests.88dba4e9ef76a0142636fad82960fbe2")], }],
            dialogComplete: [langStringDefault("quests.d7abf5cf23d7e6a94482da509450fed7"), {
                answers: [langStringDefault("quests.558cac4e9ec37afeeaa2b8cab3890f8a")], }],
        },
        tasks: [
            {   
                nameTask: langStringDefault("quests.d75afaaac374117ba54877141f1f3329"),
                descTask: langStringDefault("quests.b256d91b25a48310c20162b34b5d7dd1"),
                type: "lamar",
                blipData: {
                    x: 294.22,
                    y: -1187.72,
                    text: langStringDefault("quests.f2fcd0f96b429d48c46c939801c87a57"),
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: langStringDefault("quests.2f854f8465370a1520e67da6c9981189"),
                descTask: langStringDefault("quests.b832cdf3de57a6688137d1c47732a42b"),
                type: "questBotSpeak",
                blipData: {
                    x: 21.26, 
                    y: -1301.40, 
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
    {
        id: 500,
        name: langStringDefault("quests.a871b58ed7f0c2d512f91b33b0d6e2f6"), desc: langStringDefault("quests.b1c73583269b998ee0711599924534a5"), reward: [{ type: "cash", value: 500 }, { type: "item", value: 850}],
        taskStepByStep: true,
            nextQuest: 501, botData: {
            id: 500,
            dialogStart: [langStringDefault("quests.508fcae20be826a927cfb5e18d52f3b5"), 
            { answers: [langStringDefault("quests.cedd2a672827dc4bf00ae9f88fe7ec76")], onAnswer: () => {
                return [langStringDefault("quests.486480495242ac2a594159c0c6cbbcfd"), {
                    answers: [langStringDefault("quests.0ba815c6d18b8104c6f91bf3528aa4fd")]
                } ]
            } }],
            dialogComplete: [langStringDefault("quests.55a5044c02b5f2aeb2f6ca951a9d2a65"), {
                answers: [langStringDefault("quests.7c433e601fdf00c4f418737c8589dcad")], onAnswer: () => 501 }],
        },
        tasks: [
            {   
                nameTask: langStringDefault("quests.19641b0e1fe648f04f247351ad03668f"),
                descTask: langStringDefault("quests.982b739590c262557534fe7059e2f333"),
                type: "questBotSpeak",
                blipData: {
                    x: -1066.17, 
                    y: -874.74,
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {
                nameTask: langStringDefault("quests.45463ce8bb8c745deb2d469a8de6dccb"),
                descTask: langStringDefault("quests.a4d0ed35262ffe635c22b59ca41f7dc4"),
                type: "delivertonpc",
                name: langStringDefault("quests.7bcc09de1d9cbd506e904c0b75ca453c"),
                role: "",
                dialog: [langStringDefault("quests.1ad6ac668aabb92464b3f0e86c42278e"), 
                { answers: [langStringDefault("quests.a87e693720c9090f3700a4892dd6eff3")], }],
                model: "ig_barry",
                x: -1307.28, 
                y: -833.50, 
                z: 17.09, 
                h: 197,
                itemName: langStringDefault("quests.113cac707f993dd6a8d444d55e7e02b5"),
                blipData: {
                    x: -1307.28, 
                    y: -833.50, 
                    text: langStringDefault("quests.8940367f6eb5460ac6cf0e4c69352637"),
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: langStringDefault("quests.0bc71aa6fe19b772954b88a71f2227cb"),
                descTask: langStringDefault("quests.51d49f6266355aac0ddb648dfa1fa95a"),
                type: "questBotSpeak",
                blipData: {
                    x: -1066.17, 
                    y: -874.74,
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]  
    },
    {
        id: 501,
        name: langStringDefault("quests.826d682d529421937128c6237d5cf1f4"), desc: langStringDefault("quests.67178eb74d7126c509e7f987fab50c27"), reward: [{ type: "cash", value: 500 }], nextQuest: 502, taskStepByStep: true, botData: {
            id: 500,
            dialogStart: [langStringDefault("quests.b28dd1640a9ab64951065e5040797bde"), 
            { answers: [langStringDefault("quests.91a47c93096d004c0a7adeff5d20c40a")], }],
            dialogComplete: [langStringDefault("quests.6948b13791f89d9db827f75bf1f73ea1"), {
                answers: [langStringDefault("quests.b024cbf133f0c5383f8150b139d96477")], onAnswer: (index) => 502 }],
        },
        tasks: [
            {   
                nameTask: langStringDefault("quests.54ced2ac6e9d5dd17d76632447b24c14"),
                descTask: langStringDefault("quests.78ce14e352805afa2b3ff7160e7e7a07"),
                type: "itemHave",
                item_id: 851,
                blipData: {
                    x: -658.13,
                    y: -853.86,
                    text: langStringDefault("quests.1230a86494b78a8b8a48f76090c79345"),
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: langStringDefault("quests.e83489e5fd54aa32e3bcc921f8aeb9b5"),
                descTask: langStringDefault("quests.5e58c50f88e16504f68eb653c73d3b38"),
                type: "questBotSpeak",
                blipData: {
                    x: -1066.17, 
                    y: -874.74,
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
    {
        id: 502, name: langStringDefault("quests.08c27675a8a81fd01831b41a582d682e"), desc: langStringDefault("quests.94f1bdc8bb965bf3b485518c6a527992"), reward: [{ type: "cash", value: 1000 }], nextQuest: 503, taskStepByStep: true, botData: {
            id: 500,
            dialogStart: [langStringDefault("quests.8c235428c393cb8831cf7ab63dc39c3b"), { answers: [langStringDefault("quests.4f12531fec07c97460a7999faf47febc")], onAnswer: () => {
                return [langStringDefault("quests.1be22cbd99ccfbb6c5df7b03895e2a49"), {
                    answers: [langStringDefault("quests.ce251840e4ae72425d4db3bb4421fc26")]
                }]
            } }],
            dialogComplete: [langStringDefault("quests.8141a1da35fe7032cb203973464d9eac"), {
                answers: [langStringDefault("quests.369f59b17903f10b829eca6ac9566188")], onAnswer: (idnex) => 503 }],
        },
        tasks: [
            {   
                nameTask: langStringDefault("quests.71cec1bb73a1fae0e59b37a7b79a9b12"),
                descTask: langStringDefault("quests.692d36ee446b063905946ed0f328cf52"),
                type: "itemHave",
                item_id: 800,
                blipData: {
                    x: -541.83,
                    y: -209.09,
                    text: langStringDefault("quests.940fee5cc9094efd54519297be6bbbc9"),
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: langStringDefault("quests.de623e97df1f1ad50a91d87d95595ad7"),
                descTask: langStringDefault("quests.9933b561ff48cd6748f477857047a1bf"),
                type: "questBotSpeak",
                blipData: {
                    x: -1066.17, 
                    y: -874.74,
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ] 
    },
    {
        id: 503,
        name: langStringDefault("quests.4452f4bc27dee52330eb97af36511407"), desc: langStringDefault("quests.0bddd7dece8e00126d505bab5802816c"), reward: [{ type: "cash", value: 500 }], nextQuest: 504, taskStepByStep: true, botData: {
            id: 500,
            dialogStart: [langStringDefault("quests.9c145eb7e9d50df80d6676c45a7b8004"), { answers: [langStringDefault("quests.399a1a5030e0b0744c87365cc85a6057")], }],
            dialogComplete: [langStringDefault("quests.6da3669b1c472b8db8425450968ed2f3"), {
                answers: [langStringDefault("quests.49ffe4cc3e462175f8a1ab2e067c937b")], onAnswer: (index) => 504 }],
        },
        tasks: [
            {   
                nameTask: langStringDefault("quests.2c01809d9427cb4a800526635cf33501"),
                descTask: langStringDefault("quests.89a2e60cd753bd6f4ea2b64a04ca56db"),
                type: "jobFarm",
                job: "builder",
                amount: 700,
                blipData: {
                    x: -510.88,
                    y: -999.74,
                    text: langStringDefault("quests.9d71f5317e2f643820371a31d5f2e84c"),
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: langStringDefault("quests.bee81b3b494ff64fe595c8a0ed5209c7"),
                descTask: langStringDefault("quests.8489f481db5f652e7362905496f5a629"),
                type: "questBotSpeak",
                blipData: {
                    x: -1066.17, 
                    y: -874.74,
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
    {
        id: 504,
        name: langStringDefault("quests.374333332b8b84c9188c48103be3fa5d"), desc: langStringDefault("quests.d53be2b5e0ba6aa88b670426806cdf16"), reward: [{ type: "cash", value: 1000 }], nextQuest: 505, taskStepByStep: true, botData: {
            id: 500,
            dialogStart: [langStringDefault("quests.74a5f919c800c58a3f7a380933b75755"), { answers: [langStringDefault("quests.fbd664fd5e66dcdd2b8983e9e770b112")], }],
            dialogComplete: [langStringDefault("quests.d7efef8bcdfbdfd267126795cf43fa70"), {
                answers: [langStringDefault("quests.c82b829046d4a07582e0683ef85e90c4")], onAnswer: (index) => 505 }],
        },
        tasks: [
            {   
                nameTask: langStringDefault("quests.f547f06c81d40d4d094d007ec9a35959"),
                descTask: langStringDefault("quests.3514d69ae1b17291034c9069a9fda305"),
                type: "itemHave",
                item_id: 7,
                blipData: {
                    x: -1227.35,
                    y: -902.03,
                    text: langStringDefault("quests.f970e9568c9194a6986b23804d649309"),
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: langStringDefault("quests.497c93f3c2517ef3c93adaee40c034c5"),
                descTask: langStringDefault("quests.9f26e85586d404ccbcd558204e44a031"),
                type: "itemHave",
                item_id: 21,
            },
            {   
                nameTask: langStringDefault("quests.8f8fb06f1d452dc96c62cd6717037f97"),
                descTask: langStringDefault("quests.9ebc0e99210d402dbd71c6958bfed5b1"),
                type: "questBotSpeak",
                blipData: {
                    x: -1066.17, 
                    y: -874.74,
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]
    },
    {
        id: 505,
        name: langStringDefault("quests.20f77cef83a27b8fb36ecae8cc456960"), desc: langStringDefault("quests.6b00a5630f23590a72ce27d6cf72968a"), reward: [{ type: "cash", value: 2000 }], taskStepByStep: true, nextQuest: 506, botData: {
            id: 500,
            dialogStart: [langStringDefault("quests.d8586cc62b2d836e1b5e7389994b3509"), 
            { answers: [langStringDefault("quests.e621dfd75ac69063ac28f13767f54d93")], }],
            dialogComplete: [langStringDefault("quests.63fc528f78702f474c18879922b8ad70"), {
                answers: [langStringDefault("quests.379ed49ba55496b96c9d0e1a147c1975")], onAnswer: (index) => 506 }],
        },
        tasks: [
            {   
                nameTask: langStringDefault("quests.89445e8ee4eb3ec2087a17f647069bcb"),
                descTask: langStringDefault("quests.01518c01e641e1a98d33b6e5b31e7ac0"),
                type: "licenseHave",
                license: "car",
                blipData: {
                    x: -817.61,
                    y: -1340.45,
                    text: langStringDefault("quests.d4e62341c3a4fc748d87692cf7283558"),
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: langStringDefault("quests.ccad73d797fabe1f62448dd5d9956e22"),
                descTask: langStringDefault("quests.82d05c80fe39854ec0571c2f03fc3042"),
                type: "questBotSpeak",
                blipData: {
                    x: -1066.17, 
                    y: -874.74,
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
    {
        id: 506,
        name: langStringDefault("quests.eefc6eab6462cae6f8ef3e57c0d46f7c"), desc: langStringDefault("quests.42799cb52f783021d07df6cf25414f33"), reward: 
        [{ type: "cash", value: 4000 },  { type: "item", value: 856}], taskStepByStep: true, botData: {
            id: 500,
            dialogStart: [langStringDefault("quests.aca6f03ba3d4a022d2d9cb3b8e99f5fd"), 
            { answers: [langStringDefault("quests.6230a1bf619c2ca6534c9c4ba41d8b24")], }],
            dialogComplete: [langStringDefault("quests.336e4f0be25885614f18d2a74d7f8b68"), {
                answers: [langStringDefault("quests.ea2f232148b5eca55c77cf7be34bfe42")], onAnswer: () => {
                    return [langStringDefault("quests.3f82e9b5b47710228b76b56539186182"), {
                        answers: [langStringDefault("quests.5c008aba37c20a90d638aca08faeeeae")]
                    }]
                } }],
        },
        tasks: [
            {   
                nameTask: langStringDefault("quests.0f428ff75ae90189f830bb0e10fd059c"),
                descTask: langStringDefault("quests.0935b19397311fe0c8bb721e44206e00"),
                type: "itemHave",
                item_id: 801,
                blipData: {
                    x: -1214.85,
                    y: -326.60,
                    text: langStringDefault("quests.cc93fb3d1edb7d943baf560747725c4e"),
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
            {   
                nameTask: langStringDefault("quests.dfd16ce9a6d1b92d75e2480da7de5da5"),
                descTask: langStringDefault("quests.d1c18eb90325475c4cc6eff36ea3aa45"),
                type: "questBotSpeak",
                blipData: {
                    x: -1066.17, 
                    y: -874.74,
                    text: "",
                    bliptype: 1,
                    blipcolor: 51,
                    bliproute: 51
                }
            },
        ]        
    },
];

export const QUEST_BOT_DATA: { model: string; x: number; y: number; z: number; h: number; name: string; role: string, id: number; freeError: string, anim?:string|[string, string] }[] = [
    { id: 0, name: langStringDefault("quests.2491dbe696b3f94605f550aab6940d68"), role: "", x: 21.26, y: -1301.40, z: 29.14, h: 88, model: langStringDefault("quests.82647d9734a42ec219f9a77c5d95696a"), freeError: langStringDefault("quests.ad8a572fba3c9c9b20518bc36b2f4f49") },
    { id: 500, name: langStringDefault("quests.73b9962f3b23b26f90dbbcb2d5fcc5a7"), role: "", x: -1066.17, y: -874.74, z: 4.98, h: 332, model: "s_m_m_fiboffice_01", freeError: langStringDefault("quests.9ea3ea404ea86b710ef7a09adeeec415") },
]


export type QuestDialog = [string, QuestDialogAnswer]
interface QuestDialogAnswer {
    /** Варианты ответов игрока */
    answers: string[];
    /** Ивент ответа игрока. Функция должна вернуть либо новый диалог, либо диалог нового квеста по ID квеста. Если не указывать функцию - то диалог просто закроеться. */
    onAnswer?: (index?: number) => QuestDialog | number
}

interface QuestData {
    /** Уникальный ID каждого квеста. Ни в коем случае не должен совпадать... */
    id: number;
    /** Название квеста */
    name: string;
    /** Статическое описание квеста */
    desc: string;
    /** Награда за выполнение квеста. Массив со всеми данными */
    reward: RewardData[];
    /** ID квеста, который будет выдан автоматически */
    nextQuest?: number;
    /** Настройки NPC на карте. Если не указывать бота - то квест сам завершиться при выполнении всех тасков */
    botData?: {
        /** ID NPC, у которого будет этот квест */
        id: number;
        /** Диалог начала выполнения задания  */
        dialogStart: QuestDialog;
        /** Конечный диалог с НПЦ при завершении задания  */
        dialogComplete: QuestDialog;
    };
    /** Список действий, которые необходимо выполнить для того, чтобы задание считалось выполненым. */
    tasks: (TasksNpcDeliver | TaskHaveItem | QuestBotSpeak | TaskJobFarm | TaskLicenceHave | TaskDressBuy | TaskGotoPos | TaskLamar | TaskSendBankMoney | TaskBuyItem)[];
    /** Действия необходимо выполнять строго по очереди. Допустим если вы планируете развозку предметов по разным точкам - можно спланировать точный маршрут, по которому игроку придёться пермещаться */
    taskStepByStep?: boolean;
    /** Позволяет вывести уведомление при выполнении таска. Если функция не вернёт строку - то уведомления не будет */
    onTaskComplete?: (
        /** ИД таска, который выполнен. Счёт идёт от нуля */
        index: number
    ) => string;
}


interface TaskBase {
    /** Название для худа */
    nameTask: string,
    /** Краткое описание для худа */
    descTask?: string;
    /** Данные для метки на карте, если она необходима */
    blipData?: {
        x: number;
        y: number;
        /** Название блипа */
        text: string;
        bliptype: number;
        blipcolor: number;
        /** Цвет маршрута, если нужно отрисовать */
        bliproute?: number;
    }
}



interface RewardData {
    type: "exp" | "item" | "cash" | "bank" | "license";
    /** Сумма награды, либо ID предмета либо срок выдачи лицензии в зависимости от типа*/
    value: number;
    /** Тип лицензии если выдать нужно лицензию */
    licenseType?:LicenceType;
}

//? Интерфейсы различных тасков

/** Интерфейс доставки предмета другому боту. Игрок получает мифический предмет у того бота, у которого берёт задание и доставляет указанному боту */
interface TasksNpcDeliver extends TaskBase {
    type: "delivertonpc";
    /** Модель NPC */
    model: string;
    /** Имя бота над головой */
    name: string;
    /** Роль НЦП для диалога */
    role: string;
    /** Координата X */
    x: number;
    /** Координата Y */
    y: number;
    /** Координата Z */
    z: number;
    /** Угол поворота */
    h: number;
    /** Название мифического предмета */
    itemName: string;
    /** Диалог с NPC */
    dialog: QuestDialog;
    anim?: string | [string, string]
}

/** Интерфейс таска покупки предмета в магазине */
interface TaskBuyItem extends TaskBase {
    type: "itemBuy"
    /** ИД предмета или массив ИДшников, если проверка нужна по нему */
    item_id?: number;
}
/** Интерфейс таска наличия предмета в магазине */
interface TaskHaveItem extends TaskBase {
    type: "itemHave"
    /** ИД предмета или массив ИДшников, если проверка нужна по нему */
    item_id: number;
}
/** Интерфейс таска покупки предмета в магазине */
export interface TaskJobFarm extends TaskBase {
    type: "jobFarm"
    /** ID работы, если нужна конкретная работа */
    job?: string;
    /** Сколько нужно заработать средств на работе */
    amount: number;
}
/** Интерфейс таска покупки предмета в магазине */
interface TaskLicenceHave extends TaskBase {
    type: "licenseHave"
    /** ИД лицензии, которую проверяем. */
    license: LicenceType;
    /** Если требуется, можно отключить проверку актуальности, тогда просроченная лицензия так же подойдёт */
    ignoreExpired?: boolean;
}
/** Интерфейс проверки покупки одежды */
interface TaskDressBuy extends TaskBase {
    /** Идентификатор для системы, обязательный */
    type: "dress"
}
/** Интерфейс таска достижения точки назначения  */
interface TaskGotoPos extends TaskBase {
    /** Идентификатор для системы, обязательный */
    type: "gotopos";
    x: number;
    y: number;
    z: number;
    /** Текст над точкой назначения, он же для блипа */
    text:string;
    /** Требуется нажать на E, если не указать - то сработает если просто наступить */
    keypress?:boolean;
}
/** Интерфейс таска угона ТС для Ламара  */
interface TaskLamar extends TaskBase {
    /** Идентификатор для системы, обязательный */
    type: "lamar";
}
/** Интерфейс таска что требуется начать диалог с NPC, у которого брали квест */
interface QuestBotSpeak extends TaskBase {
    type: "questBotSpeak"
}

/** Интерфейс таска перевода средств для NPC  */
interface TaskSendBankMoney extends TaskBase {
    /** Идентификатор для системы, обязательный */
    type: "sendbankmoney";
    /** Номер счёта */
    number: string;
    /** Сумма перевода */
    sum: number;
}

