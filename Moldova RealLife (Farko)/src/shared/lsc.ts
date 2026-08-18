import { langStringDefault } from "./lang/index";
export interface lscUpgrade {
    /** ID элемента, который будет приходить в интерфейс, от него берутся все данные */
    id: number,
    /** Название */
    name: string,
    /** ID раздела, если ни одного элемента с ID какого то раздела нет, то раздел не выводить в интерфейс вообще */
    section_type: number,
    /** Нужно ли выводить окно с цветами, и тип для выбора тоже ставить как "Цвет" */
    isColor?: boolean,
    /** Элементов для выбора (это если нет цвета) (например ['Включено','Выключено'] или ['Колеса 1', 'Колеса 2', 'Колеса 3'] и т.д.) */
    elements?: { id:number, name: number | string, percent: number, isUsed?: boolean, isBuy?: boolean }[],
    /** Текущий элемент (только для цефа) */
    currentElement?: number,
    /** Имеется ли текущий элемент тюнинга на складе у владельца */
    available?: boolean,
    /**Закупочная цена*/
    // cost: number,
    /** Если true то elements может не придти, вместо него надо впихнуть названия элементов LSC_WHEELS, т.е. [ 'sportwheels', 'suvwheels' и тд ]*/
    isWheelType?: boolean,
    /** Если true то elements может не придти, вместо него надо впихнуть названия элементов LSC_WHEELS индекса выбранного выше */
    isWheelTypeValue?: boolean,
    /** Если true то выводить модуль который над выбором цвета с выбором одного из LSC_COLOR_MODS (где в примере интерфейса написано Глянцевый).  */
    isColorMod?: boolean,
    /** текущий цвет если есть */
    color?: {r: number, g: number, b: number},
    /** текущий тип цвета из LSC_COLOR_MODS (index) если есть */
    colorMod?: number,
    /** выбранный цвет */
    selectColor?: {r: number, g: number, b: number},
    /** выбранный тип цвета из LSC_COLOR_MODS (index) */
    selectColorMod?: number,
}

// !(WICHTIG) Ich sende ( carName: string (Autoname), [ ]: lscUpgrade[] ) an die Schnittstelle.
// !(WICHTIG) Von der Schnittstelle warte ich auf dem Client auf das Array von buyUpgrades[]


export const LSC_VEHICLE_POS = { x: -846.66, y: -279.26, z: -9.16, h: 0 }
/** Сколько получит бизнес % от стоимости закупки */
export const LSC_PROFIT_PERCENT = 15;

export interface buyUpgrades {
    id: number,
    color: [number, number, number],
    colorMod: number,
    selectedElementID: number
}

export interface LSC_SECTION_TYPES_I {
    id:number,
    name:string,
    /** название картинки, для Витали, можно поменять и на ID картинки, как тебе удобнее */
    imgName: string
}

export const LSC_COLOR_MODS = [
    { name: langStringDefault("lsc.345af30d5854e219046197bba2a165f3"), index: 0 }, {name:langStringDefault("lsc.559839343ecba7ef0e42afb3445716fc"),index:2},{name:langStringDefault("lsc.5a97616dfc5115503ea191b860361972"),index:12},{name:langStringDefault("lsc.360853d754ac7956b6ed3b91ea97827b"),index:85},{name:langStringDefault("lsc.8777720352d5523a5c768965c3530a19"),index:120},{name:langStringDefault("lsc.60871586e638eb8491617e68341bdfc4"),index:157},{name:langStringDefault("lsc.7af936f21b6d76f43789e668e1630804"),index:158},{name:langStringDefault("lsc.12fb8e7e5d8eafc0bc1a4e7fa8cc97e1"),index:159},{name:langStringDefault("lsc.57e55a3d1a9493b50ca0a9c89f365e9f"),index:160}
]


export const LSC_WHEEL_COLOR_MODS = [
    { name: langStringDefault("lsc.e69a2bd3eb9252a8d4079c345f996e14"), index: 0 }, {name:langStringDefault("lsc.668aaf5936d599ec8154b2c4d85f6a0e"),index:1},{name:langStringDefault("lsc.f45b6a1eae5629ff38b94627eee5b691"),index:2},{name:langStringDefault("lsc.e0192140da56720d3c81e92dfc9da444"),index:3},
    {name:langStringDefault("lsc.5d00f7063507b6dd01549c9cecee27f0"),index:4},{name:langStringDefault("lsc.b5d058e923ff3f3a3b571e8ef1c8cde9"),index:5}, { name: langStringDefault("lsc.fe71c684495c0f5e56ded440f4c21eb1"), index: 6 }, { name: langStringDefault("lsc.f903a7ef5e8594b163c55caecb36f35f"), index: 7 },
    {name: langStringDefault("lsc.56cca57657f99b7ff29faf5e65e585a9"), index: 8 }, { name: langStringDefault("lsc.639dba9ef3a363bb7b2d865a3b67260e"), index: 9 }, { name: langStringDefault("lsc.c6e0e9ef92c05a522fe35c688babbd87"), index: 10 }, { name:langStringDefault("lsc.8d244cbf34a93eb0a81630773725e3a1"),index:11},
    {name:langStringDefault("lsc.99cd2b7f1718f588ae2d7f59581ec301"),index:12},{name:langStringDefault("lsc.728bf2c9086a1615baf827a689ba346c"),index:13},{name:langStringDefault("lsc.b377d412e1f5ca79f4f003f6c76821b8"),index:14},{name:langStringDefault("lsc.f3a77557c0db87a3c50d494b934e4757"),index:21},{name:langStringDefault("lsc.41490c0b01cd956a38151f9a626ac418"),index:22},
    {name:langStringDefault("lsc.dea9b1453d797fa3a4934d923950852e"),index:23}, {name:langStringDefault("lsc.bd8bf08c38ac3de8c0c8c898ff50074f"),index:24},{name:langStringDefault("lsc.3331d179501387c9575202e4327be59d"),index:25},
    {name:langStringDefault("lsc.8ed88da250abaca4c6911b51a26997a5"),index:26},{name:langStringDefault("lsc.6ff88385a644c1fd235266789a273f7c"),index:27}, {name:langStringDefault("lsc.afd265e2b75551344068b16e5a0aed1c"),index:28},{name:langStringDefault("lsc.37aa2f7c4a4b70c94ed75d4fb8523b48"),index:29},
    {name:langStringDefault("lsc.d4fcfd78784434d77b7a4561ead12880"),index:33},{name:langStringDefault("lsc.20c5c707a6293f8b4fedbd792f29047b"),index:34},{name:langStringDefault("lsc.d73cae5ae4b4dcf7e52b185ed6c28d0f"),index:35},
    {name:langStringDefault("lsc.b942fcced4cc5a3f7853ba2aeced66e5"),index:36},{name:langStringDefault("lsc.1d8b4ddb82099b800f1d387bec86d310"),index:37},{name:langStringDefault("lsc.c53f49b3577ab4edf36de3a5ec0fdea3"),index:38},{name:langStringDefault("lsc.3fa7483381b6190055d6f7348cd7ed67"),index:39},
    {name:langStringDefault("lsc.3404c30608b7653cf23585ee66f32574"),index:40},{name:langStringDefault("lsc.fcbd1263da7e9be85320c35d445df39a"),index:41},
    {name:langStringDefault("lsc.51ff0578619e9f775210aae4edf0636d"),index:42},{name:langStringDefault("lsc.e3616ab9f7ff22a27acc0e80b3cc6cea"),index:49},{name:langStringDefault("lsc.c390338621272bedd08c5b7f6337ae36"),index:50},{name:langStringDefault("lsc.eb801641dbbb80e6852f25413c3f852c"),index:51},
    {name:langStringDefault("lsc.3e1e4d0da5c7b0e0bed0e3c5e4c9eadd"),index:52},{name:langStringDefault("lsc.e9188958fd66bcdba548051d7f8279c6"),index:53},{name:langStringDefault("lsc.9c8b0c23e401cf19c863f86d42acf6d9"),index:54},{name:langStringDefault("lsc.167cd6f13df640dd1bbec19f3bb536f3"),index:55},{name:langStringDefault("lsc.f4d876dc09f5e57fc443839b3a75ef61"),index:64},
    {name:langStringDefault("lsc.24581a43bf3851abaadec04ded846eb4"),index:70},{name:langStringDefault("lsc.8f48fb17006ce0153a4b68e615449856"),index:71}, {name:langStringDefault("lsc.e7dc49a73881c204689cc743c83cca13"),index:81},{name:langStringDefault("lsc.648ebcaf9ae7a9417b19f688737f9dd2"),index:82},{name:langStringDefault("lsc.5f7078532991316f3d9511f58064b93c"),index:83},
    {name:langStringDefault("lsc.34d66c363a7d5d160ef5fd5ec5daad02"),index:84},{name:langStringDefault("lsc.5d3ae30985f61fd0967cc449c9d73145"),index:88},{name:langStringDefault("lsc.fb5a6eb75e2cb86f757616570548ef04"),index:89},
    {name:langStringDefault("lsc.c866514c194016e7fa0b1718b54f06e1"),index:90},{name:langStringDefault("lsc.359493ff2495249083504ea8ba279b53"),index:91},{name:langStringDefault("lsc.e05dda48e4ad3189a62db0107af03a86"),index:94},{name:langStringDefault("lsc.f61c59f58d9c8b9212e3b3e08c325cc9"),index:95},
    {name:langStringDefault("lsc.be11730e25d26899a3f323ab369f7ac9"),index:102},{name:langStringDefault("lsc.86dfb820d070cfd854ab043322a7ae72"),index:103},{name:langStringDefault("lsc.7d098b28c58ff5c98a0dd6aedb1e1fa6"),index:104},{name:langStringDefault("lsc.8b50437f8354fbbb765681e58749363c"),index:105},{name:langStringDefault("lsc.b6ed31d64b3fa8ab8b2123060a96f4b3"),index:107},
    {name:langStringDefault("lsc.561cf81fc6ccf86f55804ac53673da96"),index:111},{name:langStringDefault("lsc.f6531b1238de99e5c66966288dbae831"),index:112},{name:langStringDefault("lsc.709512a5aa54393b042e249f74caa36a"),index:113},{name:langStringDefault("lsc.8b351581792a9c2ca1e3e3254310cac4"),index:124},
    {name:langStringDefault("lsc.7826546dc0ea4f2aeb51faa880a3e9da"),index:127},{name:langStringDefault("lsc.76ebae8061bf4540e63e5c51ed9d3455"),index:128},{name:langStringDefault("lsc.3ed80923fc2836adb8459890d4414831"),index:129},{name:langStringDefault("lsc.2461290f12725a93059f28795491e383"),index:135},
    {name:langStringDefault("lsc.d6319f219fad341bafaf7930f2dfcc6d"),index:145},{name:langStringDefault("lsc.84dca78353ce436fa2554a7eb1b007c5"),index:160}
]

export const LSC_SECTION_TYPES: LSC_SECTION_TYPES_I[] = [
    {
        id: 1,
        name: langStringDefault("lsc.97d204db9c36433b6d30e237a6973d85"),
        imgName: "tuning-tab-1"
    },
    {
        id: 2,
        name: langStringDefault("lsc.20bf52235c4a79db7d6794a7d8a9c0de"),
        imgName: "tuning-tab-2"
    },
    {
        id: 3,
        name: langStringDefault("lsc.e948bc40d471d5f062b38f7ff01c2d4c"),
        imgName: "tuning-tab-3"
    }
]
type LSC_WHEELS_TYPE = {
    name: string;
    type: number;
    percent: number;
    elements: [string , number][];
}[]
export const LSC_WHEELS:LSC_WHEELS_TYPE = [
    {
        name: langStringDefault("lsc.aec12fa892aa8723c941aea6d7821720"),
        type: 0,
        percent: 0.06,
        elements: [
            ["Stock", -1],
            ["Inferno", 0], ["Deepfive", 1], ["Lozspeed", 2], ["Diamondcut", 3], ["Chrono", 4], ["Feroccirr", 5], ["Fiftynine", 6], ["Mercie", 7], ["Syntheticz", 8], ["Organictyped", 9], ["Endov1", 10], ["Duper7", 11], ["Uzer", 12],
            ["Groundride", 13], ["Spacer", 14], ["Venum", 15], ["Cosmo", 16], ["Dashvip", 17], ["Icekid", 18], ["Ruffeld", 19], ["Wangenmaster", 20], ["Superfive", 21], ["Endov2", 22], ["Slitsix", 23]
        ]
    },
    {
        name: langStringDefault("lsc.9bb35cfad4155e61c076b3a018e9ee30"),
        type: 1,
        percent: 0.06,
        elements: [
            ["Stock", -1],
            ["Classicfive", 0], ["Dukes", 1], ["Musclefreak", 2], ["Kracka", 3], ["Azrea", 4], ["Mecha", 5], ["Blacktop", 6], ["Dragspl", 7], ["Revolver", 8], ["Classicrod", 9], ["Spooner", 10], ["Fivestar", 11], ["Oldschool", 12],
            ["Eljefe", 13], ["Dodman", 14], ["Sixgun", 15], ["Mercenary", 16]
        ]
    },
    {
        name: langStringDefault("lsc.79dbf9aea8034439cefa7f2829dc0233"),
        type: 2,
        percent: 0.06,
        elements: [
            ["Stock", -1],
            ["Flare", 0], ["Wired", 1], ["Triplegolds", 2], ["Bigworm", 3], ["Sevenfives", 4], ["Splitsix", 5], ["Freshmesh", 6], ["Leadsled", 7], ["Turbine", 8], ["Superfin", 9], ["Classicrod", 10], ["Dollar", 11], ["Dukes", 12],
            ["Lowfive", 13], ["Gooch", 14]
        ]
    },
    {
        name: langStringDefault("lsc.ff46555e38c5354901da1a587340a833"),
        type: 3,
        percent: 0.06,
        elements: [
            ["Stock", -1],
            ["Vip", 0], ["Benefactor", 1], ["Cosmo", 2], ["Bippu", 3], ["Royalsix", 4], ["Fagorme", 5], ["Deluxe", 6], ["Icedout", 7], ["Cognscenti", 8], ["Lozspeedten", 9], ["Supernova", 10], ["Obeyrs", 11], ["Lozspeedballer", 12],
            ["Extra vaganzo", 13], ["Splitsix", 14], ["Empowered", 15], ["Sunrise", 16], ["Dashvip", 17], ["Cutter", 18]
        ]
    },
    {
        name: langStringDefault("lsc.34d50f77d3c4112eebd71537c1f500b2"),
        type: 4,
        percent: 0.06,
        elements: [
            ["Stock", -1],
            ["Raider", 0], ["Nevis", 2], ["Cairngorm", 3], ["Amazon", 4], ["Challenger", 5], ["Dunebasher", 6], ["Fivestar", 7], ["Rockcrawler", 8], ["Milspecsteelie", 9]
        ]
    },
    {
        name: langStringDefault("lsc.d2edca86272f84300272652149bda6c0"),
        type: 5,
        percent: 0.06,
        elements: [
            ["Stock", -1],
            ["Cosmo", 0], ["Supermesh", 1], ["Outsider", 2], ["Rollas", 3], ["Driffmeister", 4], ["Slicer", 5], ["Elquatro", 6], ["Dubbed", 7], ["Fivestar", 8], ["Slideways", 9], ["Apex", 10], ["Stancedeg", 11], ["Countersteer", 12],
            ["Endov1", 13], ["Endov2dish", 14], ["Guppez", 15], ["Chokadori", 16], ["Chicane", 17], ["Saisoku", 18], ["Dishedeight", 19], ["Fujiwara", 20], ["Zokusha", 21], ["Battlevill", 22], ["Rallymaster", 23]
        ]
    },
    {
        name: langStringDefault("lsc.1de6e0bebd463fc514316a0b502412ab"),
        type: 7,
        percent: 0.06,
        elements: [
            ["Stock", -1],
            ["Shadow", 0], ["Hyper", 1], ["Blade", 2], ["Diamond", 3], ["Supagee", 4], ["Chromaticz", 5], ["Merciechlip", 6], ["Obeyrs", 7], ["Gtchrome", 8], ["Cheetahr", 9], ["Solar", 10], ["Splitten", 11], ["Dashvip", 12],
            ["Lozspeedten", 13], ["Carboninferno", 14], ["Carbonshadow", 15], ["Carbonz", 16], ["Carbonsolar", 17], ["Carboncheetahr", 18], ["Carbonsracer", 19]
        ]
    }
]
//
// export const LSC_WHEELS = {
//     // "frontwheel": [
//     //     {name: "Stock", "wtype": 6, index: -1},{name: "Speedway", "wtype": 6, index: 0},
//     //     {name: "Streetspecial", "wtype": 6, index: 1},{name: "Racer", "wtype": 6, index: 2},
//     //     {name: "Trackstar", "wtype": 6, index: 3},{name: "Overlord", "wtype": 6, index: 4},
//     //     {name: "Trident", "wtype": 6, index: 5},{name: "Triplethreat", "wtype": 6, index: 6},
//     //     {name: "Stilleto", "wtype": 6, index: 7},{name: "Wires", "wtype": 6, index: 8},
//     //     {name: "Bobber", "wtype": 6, index: 9},{name: "Solidus", "wtype": 6, index: 10},
//     //     {name: "Iceshield", "wtype": 6, index: 11},{name: "Loops", "wtype": 6, index: 12}
//     // ],
//     //     "backwheel": [
//     //     {name: "Stock", "wtype": 6, index: -1},{name: "Speedway", "wtype": 6, index: 0},
//     //     {name: "Streetspecial", "wtype": 6, index: 1},{name: "Racer", "wtype": 6, index: 2},
//     //     {name: "Trackstar", "wtype": 6, index: 3},{name: "Overlord", "wtype": 6, index: 4},
//     //     {name: "Trident", "wtype": 6, index: 5},{name: "Triplethreat", "wtype": 6, index: 6},
//     //     {name: "Stilleto", "wtype": 6, index: 7},{name: "Wires", "wtype": 6, index: 8},
//     //     {name: "Bobber", "wtype": 6, index: 9},{name: "Solidus", "wtype": 6, index: 10},
//     //     {name: "Iceshield", "wtype": 6, index: 11},{name: "Loops", "wtype": 6, index: 12}
//     // ],
//
// }


export interface vehicleModItemBase {
    /** ID слота мода */
    id: number;
    /** Название мода */
    name: string;
    /** Раздел мода */
    sector: number;
    /** С какого уровня бизнеса данная штука будет доступна для заказа */
    level:0|1|2;
    target?:"car"|"bike"|"all",
    /** Процент от стоимости машины, который будет минимальной ценой на штуку */
    percent: number,
    isColor?: boolean
    /** Если true то elements может не придти, вместо него надо впихнуть названия элементов LSC_WHEELS, т.е. [ 'sportwheels', 'suvwheels' и тд ]*/
    isWheelType?: boolean,
    /** Если true то elements может не придти, вместо него надо впихнуть названия элементов LSC_WHEELS индекса выбранного выше */
    isWheelTypeValue?: boolean,
    /** Если true то выводить модуль который над выбором цвета с выбором одного из LSC_COLOR_MODS (где в примере интерфейса написано Глянцевый).  */
    isColorMod?: boolean,
    default?: number,
    // Закупочная стоимость
    cost: number,
}


export const enum MOD_SECTOR {
    /** Визуальный тюнинг */
    VISUAL = 1,
    /** Внутренний тюнинг */
    PERMORMANCE = 2,
    /** Освещение */
    LIGHT = 3,
}

/** Стоимость покраски */
export const VEHICLE_COLOR_COST = 2000
/** Стоимость винила */
export const VEHICLE_LIVERY_COST = 15000

/**
 * !!! LEGACY конфиг. Предоставляет стандартные значения для конфига, который в бд (LscConfigEntity)
 */
export const vehicleModsList: (vehicleModItemBase)[] = [
    { level: 0, percent: 0.07, id: 1000, name: langStringDefault("lsc.0e8818656997ebf698d739244cc29746"), sector: MOD_SECTOR.VISUAL, isColor: true, isColorMod: true, cost: 15000 },
    { level: 0, percent: 0.05, id: 1001, name: langStringDefault("lsc.72f402148dda36dd74f76e9aad8a37bc"), sector: MOD_SECTOR.VISUAL, isColor: true, isColorMod: true, cost: 13000 },


    { level: 0, percent: 0.05, id: 0, name: langStringDefault("lsc.3bccbb5d38755fd39f98b3fa53d25931"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 18000 }, // +
    { level: 0, percent: 0.05, id: 1, name: langStringDefault("lsc.cd2b10e5139f066863dd66b9e7762f5a"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 22000 }, // +
    { level: 0, percent: 0.05, id: 2, name: langStringDefault("lsc.932f46f559909531941051327a035e5d"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 22000 }, // +
    { level: 0, percent: 0.05, id: 3, name: langStringDefault("lsc.fd7e016fbdfd3967e617469aa4200c38"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 22000 }, // +
    { level: 0, percent: 0.05, id: 4, name: langStringDefault("lsc.15478e27b95fbb084ee226a55f83366a"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 15000 }, // +
    { level: 0, percent: 0.05, id: 5, name: langStringDefault("lsc.b115729fcf49b4fd29d663261051962a"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 30000 }, // +
    { level: 0, percent: 0.05, id: 6, name: langStringDefault("lsc.d081cda0cbdfbc6b40339bf114e597de"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 12000 }, // +
    { level: 0, percent: 0.06, id: 7, name: langStringDefault("lsc.69d2d2646ced64fe2f2652e9eefcb82e"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 30000 }, // +
    { level: 0, percent: 0.05, id: 8, name: langStringDefault("lsc.da7e6e2d99c2fb03e5072dd879971758"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 30000 }, // +
    { level: 0, percent: 0.05, id: 9, name: langStringDefault("lsc.9a31b4d430bf2388e22d5f22e7a5c988"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 30000 }, // +
    { level: 0, percent: 0.05, id: 10, name: langStringDefault("lsc.484ba829c391f6ff96bfe0b41afee8d8"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 40000 }, // +
    { level: 0, percent: 0.02, id: 11, name: langStringDefault("lsc.7f2284f8c75328cc74929e4cef97efbb"), sector: MOD_SECTOR.PERMORMANCE, default: -1, cost: 70000 }, // +
    { level: 0, percent: 0.02, id: 12, name: langStringDefault("lsc.319cf30ed7816e1e8c537e32473ab696"), sector: MOD_SECTOR.PERMORMANCE, default: -1, cost: 50000 }, // +
    { level: 0, percent: 0.02, id: 13, name: langStringDefault("lsc.bfc7123dfd62fe61271ecd128f2896f4"), sector: MOD_SECTOR.PERMORMANCE, default: -1, cost: 60000 }, // +
    { level: 0, percent: 0.01, id: 14, name: langStringDefault("lsc.71e86d21eabfcc5cb7c1d53371bd25d7"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 15000 }, // +
    { level: 0, percent: 0.02, id: 15, name: langStringDefault("lsc.196ba100a800b7dc3a9dd406e0e5785c"), sector: MOD_SECTOR.PERMORMANCE, default: -1, cost: 55000 }, // +
    { level: 0, percent: 0.11, id: 18, name: langStringDefault("lsc.6e45feba7fc3fac10009510e5d6ead07"), sector: MOD_SECTOR.PERMORMANCE, default: -1, cost: 100000 }, // +
    { level: 0, percent: 0.04, id: 27, name: langStringDefault("lsc.5a975a8c9f703fcc52b12ab1d27ea307"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 10000 }, // +
    { level: 0, percent: 0.04, id: 28, name: langStringDefault("lsc.76b8a8e00c605c1d67e48f02ee5686ea"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 5000 }, // ?
    { level: 0, percent: 0.04, id: 29, name: langStringDefault("lsc.f8b4956a5390a124f31889e7b5288370"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 10000 }, // +
    { level: 0, percent: 0.03, id: 30, name: langStringDefault("lsc.35987498f6f869993f1e2909974a2b52"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 5000 }, // +
    { level: 0, percent: 0.03, id: 31, name: langStringDefault("lsc.93313acbfbfa6d82500c0117e0421bdb"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 2000 }, // +
    { level: 0, percent: 0.03, id: 32, name: langStringDefault("lsc.e796e5740b898ea110961fbd8e7092e3"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 5000 }, // +
    { level: 0, percent: 0.03, id: 33, name: langStringDefault("lsc.be30a902c7004a0a74c29cc7ee615eb3"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 1000 }, // +
    { level: 0, percent: 0.03, id: 34, name: langStringDefault("lsc.52c07426d45ddce4429adbeef1c181f4"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 1000 }, // +
    { level: 0, percent: 0.03, id: 35, name: langStringDefault("lsc.9ec63dd59aec88825fa464059dad2cad"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 1000 }, // +
    { level: 0, percent: 0.2, id: 38, name: langStringDefault("lsc.9bd9f8bb5ae9447eeffa34d8aa2161cb"), sector: MOD_SECTOR.PERMORMANCE, default: -1, cost: 80000 }, // +
    { level: 0, percent: 0.1, id: 39, name: langStringDefault("lsc.364b7ac0c07beda2f1da7f0e8b8d8486"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 70000 }, // ?
    { level: 0, percent: 0.07, id: 40, name: langStringDefault("lsc.9365abdff210fb44ae347ab61f7cdf43"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 12000 }, // +
    { level: 0, percent: 0.07, id: 41, name: langStringDefault("lsc.cefce4259282de73cf177089def4003c"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 5000 }, // +
    { level: 0, percent: 0.05, id: 42, name: langStringDefault("lsc.2d241850619ac7c51f559b33b8618c8a"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 5000 }, // +
    { level: 0, percent: 0.02, id: 43, name: langStringDefault("lsc.fe33d550d117bc6e52af661666dff4bb"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 1000 }, // +
    { level: 0, percent: 0.15, id: 55, name: langStringDefault("lsc.866d3c41b4630753f0f4b9653a692ca2"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 30000 },
    { level: 0, percent: 0.17, id: 48, name: langStringDefault("lsc.4209a2fd4096da170f31c1fb413c897b"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 20000 }, // +
    { level: 0, percent: 0.03, id: 46, name: langStringDefault("lsc.381fbc7e6972fd379b89a1ad03715a5e"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 1000 }, // +


    { level: 0, percent: 0.03, id: 4000, name: langStringDefault("lsc.b16bfd400b28f13bb1df60c54aee12c9"), sector: MOD_SECTOR.LIGHT, target: "car", default: -1, cost: 15000 },
    { level: 0, percent: 0.03, id: 4001, name: langStringDefault("lsc.42dd92e1625303d5ec404d8b6a6b7ff8"), sector: MOD_SECTOR.LIGHT, target: "car", default: -1, cost: 15000 },
    { level: 0, percent: 0.03, id: 4002, name: langStringDefault("lsc.68e088ff07f1d5535026b62fb8140d20"), sector: MOD_SECTOR.LIGHT, target: "car", default: -1, cost: 15000 },
    { level: 0, percent: 0.03, id: 4003, name: langStringDefault("lsc.5411f3e4788e32d48b7930fa1e14cbc1"), sector: MOD_SECTOR.LIGHT, target: "car", default: -1, cost: 15000 },
    { level: 0, percent: 0.03, id: 4004, name: langStringDefault("lsc.32c285894bc704b6cebdb200b131a171"), sector: MOD_SECTOR.LIGHT, isColor: true, target: "car", cost: 25000 },

    { level: 0, percent: 0.04, id: 1005, name: langStringDefault("lsc.b200b38626577c271ea0bc5fbd23ac17"), sector: MOD_SECTOR.VISUAL, default: 0, cost: 5000 },
    { level: 0, percent: 0.03, id: 1006, name: langStringDefault("lsc.d123feb4e5487ba8c3afa3a89ea904ca"), sector: MOD_SECTOR.VISUAL, default: 0, cost: 5000 },

    { level: 0, percent: 0.05, id: 25, name: langStringDefault("lsc.e4f8e47b33c47e497ed8fc258c081edc"), sector: MOD_SECTOR.VISUAL, default: 0, cost: 12000 }, // +
    { level: 0, percent: 0.05, id: 1007, name: langStringDefault("lsc.84afdb26b6696054f3cd5280c8e6c810"), sector: MOD_SECTOR.VISUAL, target: "car", default: 0, cost: 12000 }, // +

    { level: 0, percent: 0.02, id: 22, name: langStringDefault("lsc.9a45f01916b3fedf6b4bedfbaf5bfcfd"), sector: MOD_SECTOR.LIGHT, target: "car", default: -1, cost: 25000 }, // +
    { level: 0, percent: 0.01, id: 1008, name: langStringDefault("lsc.38dcee5e34b1cdb607e6df16e9b13f35"), sector: MOD_SECTOR.LIGHT, target: "car", cost: 30000 },


    { level: 0, percent: 0.05, id: 2999, name: langStringDefault("lsc.71aefcfd2ee49dc1122608810943ea42"), sector: MOD_SECTOR.VISUAL, target: "car", cost: 20000 }, // +
    { level: 0, percent: 0.03, id: 62, name: langStringDefault("lsc.e12d424d898297349be09cd1bcca0375"), sector: MOD_SECTOR.VISUAL, target: "car", cost: 20000 }, // +
    { level: 0, percent: 0.01, id: 3000, name: langStringDefault("lsc.a652dc10b6dc8d8437422908dc57285f"), sector: MOD_SECTOR.VISUAL, target: "car", cost: 12000 }, // +

    { level: 0, percent: 0.02, id: 3001, name: langStringDefault("lsc.8cf8e732e44c4a7c0a49ef2ec1577862"), sector: MOD_SECTOR.VISUAL, default: -1, cost: 35000 }, // +
    { level: 0, percent: 0.02, id: 3002, name: langStringDefault("lsc.0a07230ed482437e4ef5148d2c9a3b8e"), sector: MOD_SECTOR.VISUAL, isColor: true, cost: 40000 }, // +


    { level: 0, percent: 0.25, id: 3004, name: langStringDefault("lsc.536c7b06854d6a75561216ef2c2a41fa"), sector: MOD_SECTOR.PERMORMANCE, target: "car", default: -1, cost: 150000 }, // +
]

// Тонировка
export const lscTintUpgrades = [
    { name: langStringDefault("lsc.06cf0ba89f18810554ceb52a001a926b"), value: 0, percent: 0.02 },
    { name: langStringDefault("lsc.39ff90b6cbef99b7edd96e2ca6391e68"), value: 1, percent: 0.08 },
    { name: langStringDefault("lsc.542dbc362b9c0461554a87747c7cc339"), value: 2, percent: 0.03 },
    { name: langStringDefault("lsc.ba045a5886c268522b9cf9609b406f7c"), value: 3, percent: 0.025 },
    { name: langStringDefault("lsc.61f96bfbdd901d579011f325c5a44c11"), value: 4, percent: 0.025 },
]


// export const lscArmourUpgrades = [
//     { name: 'Без брони', value: -1, percent: 1000 },
//     { name: 'Броня 20%', value: 0, percent: 2000 },
//     { name: 'Броня 40%', value: 1, percent: 3000 },
//     { name: 'Броня 60%', value: 2, percent: 1500 },
//     { name: 'Броня 80%', value: 3, percent: 2500 },
//     { name: 'Броня 100%', value: 4, percent: 1800 },
// ]


export const lscSuspensionUpgrades = [
    { name: langStringDefault("lsc.0de8951fa571e888fe4c6a8dbc0a6eaa"), value: -1, percent: 0.02 },
    { name: langStringDefault("lsc.4c727caabecbadda4e9c02027a700597"), value: 0, percent: 0.03 },
    { name: langStringDefault("lsc.6a4683e52a4e18cfb2d85fcd494d0c3d"), value: 1, percent: 0.04 },
    { name: langStringDefault("lsc.78a98a675bda9bc9ff0770508329ebcf"), value: 2, percent: 0.05 },
    { name: langStringDefault("lsc.adcd82b20346035fef03ed13f6e36192"), value: 3, percent: 0.06 }
]


export const lscTransmissionUpgrades = [
    { name: langStringDefault("lsc.9204402c6110ac8f2bc44d001acd745c"), value: -1, percent: 0.02 },
    { name: langStringDefault("lsc.726e0086bb44f3a0fe3fe5767076ba08"), value: 0, percent: 0.03 },
    { name: langStringDefault("lsc.9b0b55f83dfeed63277e5ddaedebdc39"), value: 1, percent: 0.04 },
    { name: langStringDefault("lsc.41f640ee2e4bea3a87f901530261afc1"), value: 2, percent: 0.05 }
]


export const lscBrakeUpgrades = [
    { name: langStringDefault("lsc.b8580fedcf06ad9c5ad8c5cf43be022e"), value: -1, percent: 0.02 },
    { name: langStringDefault("lsc.665319c8d594fc08bdfffb6f1dfc36e2"), value: 0, percent: 0.03 },
    { name: langStringDefault("lsc.77ab2ae4209745d914d4185542281acf"), value: 1, percent: 0.04 },
    { name: langStringDefault("lsc.0be696c1886fb976f67272d4485ffa7b"), value: 2, percent: 0.05 }
]


export const lscNumberUpgrades = [
    { name: langStringDefault("lsc.461ed971e1fd44af7fae0db629f49a04"), value: 0, percent: 0.02 },
    { name: langStringDefault("lsc.27bd9a4a62d296bf230ebd789feb85e6"), value: 1, percent: 0.02 },
    { name: langStringDefault("lsc.53ee8a8da21c21ba5783fcdb4db05aea"), value: 2, percent: 0.02 },
    { name: langStringDefault("lsc.652dbd572dce6e8e3c9b3501bffa3d19"), value: 3, percent: 0.02 },
    { name: langStringDefault("lsc.41cca5de5849d264452ef54f983a6d8a"), value: 4, percent: 0.02 },
    { name: langStringDefault("lsc.df8297c649a3e584f5c6ae765ba286c4"), value: 5, percent: 0.02 }
]


export const lscEngineUpgrades = [
    { name: langStringDefault("lsc.bb2cc9fba5bf8a5173c0da6b176f3f19"), value: -1, percent: 0.02 },
    { name: langStringDefault("lsc.c0fc03a39a1978d0da4372d8d28342a1"), value: 0, percent: 0.04 },
    { name: langStringDefault("lsc.16e6b33777707517c134df77b36744e9"), value: 1, percent: 0.06 },
    { name: langStringDefault("lsc.c384b05ff99238dd656968a7542214b3"), value: 2, percent: 0.08 },
    { name: langStringDefault("lsc.297f56e37659d4d6126ba5d7f6175891"), value: 3, percent: 0.1 }
]


export const lscXenonColorUpgrades = [
    { name: langStringDefault("lsc.813006637121b53858f6ef3f1f67e526"), value: 255, percent: 0.02 },
    { name: langStringDefault("lsc.ed5b05456a80cb23c35c30329cc58cbc"), value: 0, percent: 0.02 },
    { name: langStringDefault("lsc.55a39dd9baa9e636232d35f4b00387a1"), value: 1, percent: 0.02 },
    { name: langStringDefault("lsc.ad1ca9820178b5502c0c90d9f6f3fc79"), value: 2, percent: 0.02 },
    { name: langStringDefault("lsc.837290f9288a10f344ad1155ad74e0e3"), value: 3, percent: 0.02 },
    { name: langStringDefault("lsc.d83eaf94bdbc03002745712d2c5e14b7"), value: 4, percent: 0.02 },
    { name: langStringDefault("lsc.0416d196fa5f9371e8a715cde2aac125"), value: 5, percent: 0.02 },
    { name: langStringDefault("lsc.87ff8f6a6865bef1976a6b3b647cff24"), value: 6, percent: 0.02 },
    { name: langStringDefault("lsc.5fac560826add401a6e7176ca102ac00"), value: 7, percent: 0.02 },
    { name: langStringDefault("lsc.1ae3d77cf611e0f69462f8d1b7d8ae05"), value: 8, percent: 0.02 },
    { name: langStringDefault("lsc.00bed4daf22afd1740690e23bfac9f73"), value: 9, percent: 0.02 },
    { name: langStringDefault("lsc.6c50f854c9779eefc346e364d3283f88"), value: 10, percent: 0.02 },
    { name: langStringDefault("lsc.4c2fe3ed1c7ee9905f007527bd61caae"), value: 11, percent: 0.02 },
    { name: langStringDefault("lsc.f901dba9b042d8259b929bcf23ba0ba0"), value: 12, percent: 0.02 },
]

/** Профит бизнеса от покупки игроком на totalTuningCost */
export const getProfitFromTuningCost = (totalTuningCost: number) => 
    totalTuningCost * LSC_PROFIT_PERCENT / 100

export const convertModCostFromCarCost = (percent: number, carCost: number) => Math.floor(percent * carCost)

const vehicleBones = ["chassis", "chassis_lowlod",  "chassis_dummy", "seat_dside_f",  "seat_dside_r", "seat_dside_r1", "seat_dside_r2", "seat_dside_r3", "seat_dside_r4", "seat_dside_r5", "seat_dside_r6",
    "seat_dside_r7", "seat_pside_f", "seat_pside_r", "seat_pside_r1", "seat_pside_r2", "seat_pside_r3", "seat_pside_r4",  "seat_pside_r5", "seat_pside_r6", "seat_pside_r7", "window_lf1", "window_lf2",
    "window_lf3", "window_rf1", "window_rf2", "window_rf3", "window_lr1", "window_lr2", "window_lr3", "window_rr1", "window_rr2", "window_rr3", "door_dside_f", "door_dside_r", "door_pside_f", "door_pside_r",
    "handle_dside_f", "handle_dside_r", "handle_pside_f", "handle_pside_r", "wheel_lf", "wheel_rf", "wheel_lm1", "wheel_rm1", "wheel_lm2", "wheel_rm2", "wheel_lm3", "wheel_rm3", "wheel_lr", "wheel_rr",
    "suspension_lf", "suspension_rf", "suspension_lm", "suspension_rm", "suspension_lr", "suspension_rr", "spring_rf", "spring_lf", "spring_rr", "spring_lr", "transmission_f", "transmission_m", "transmission_r",
    "hub_lf", "hub_rf", "hub_lm1", "hub_rm1", "hub_lm2", "hub_rm2", "hub_lm3", "hub_rm3", "hub_lr", "hub_rr", "windscreen", "windscreen_r", "window_lf", "window_rf", "window_lr",  "window_rr", "window_lm",
    "window_rm", "bodyshell", "bumper_f", "bumper_r", "wing_rf", "wing_lf", "bonnet", "boot", "exhaust", "exhaust_2", "exhaust_3", "exhaust_4", "exhaust_5", "exhaust_6", "exhaust_7", "exhaust_8", "exhaust_9",
    "exhaust_10", "exhaust_11",  "exhaust_12", "exhaust_13",  "exhaust_14", "exhaust_15", "exhaust_16", "engine", "overheat", "overheat_2", "petrolcap", "petroltank", "petroltank_l", "petroltank_r",     "steering",
    "hbgrip_l", "hbgrip_r", "headlight_l", "headlight_r", "taillight_l", "taillight_r", "indicator_lf", "indicator_rf", "indicator_lr", "indicator_rr", "brakelight_l", "brakelight_r", "brakelight_m", "reversinglight_l", "reversinglight_r",
    "extralight_1", "extralight_2", "extralight_3", "extralight_4", "numberplate", "interiorlight", "siren1",  "siren2", "siren3", "siren4", "siren5", "siren6", "siren7", "siren8", "siren9", "siren10", "siren11", "siren12", "siren13",
    "siren14", "siren15", "siren16", "siren17", "siren18", "siren19", "siren20", "siren_glass1", "siren_glass2", "siren_glass3", "siren_glass4", "siren_glass5", "siren_glass6", "siren_glass7", "siren_glass8", "siren_glass9",
    "siren_glass10", "siren_glass11", "siren_glass12", "siren_glass13", "siren_glass14", "siren_glass15", "siren_glass16",  "siren_glass17",  "siren_glass18",  "siren_glass19",  "siren_glass20",  "spoiler", "struts",
    "misc_a", "misc_b", "misc_c", "misc_d",  "misc_e", "misc_f",  "misc_g", "misc_h", "misc_i", "misc_j", "misc_k", "misc_l", "misc_m", "misc_n", "misc_o", "misc_p", "misc_q", "misc_r", "misc_s", "misc_t", "misc_u", "misc_v",
    "misc_w", "misc_x", "misc_y", "misc_z",  "misc_1", "misc_2",  "weapon_1a", "weapon_1b", "weapon_1c", "weapon_1d", "weapon_1a_rot", "weapon_1b_rot", "weapon_1c_rot", "weapon_1d_rot", "weapon_2a",
    "weapon_2b", "weapon_2c", "weapon_2d", "weapon_2a_rot", "weapon_2b_rot", "weapon_2c_rot",  "weapon_2d_rot", "weapon_3a", "weapon_3b", "weapon_3c", "weapon_3d", "weapon_3a_rot", "weapon_3b_rot",
    "weapon_3c_rot", "weapon_3d_rot", "weapon_4a", "weapon_4b", "weapon_4c", "weapon_4d",  "weapon_4a_rot", "weapon_4b_rot", "weapon_4c_rot", "weapon_4d_rot", "turret_1base", "turret_1barrel",
    "turret_2base",  "turret_2barrel", "turret_3base", "turret_3barrel", "ammobelt", "searchlight_base",  "searchlight_light", "attach_female", "roof", "roof2",  "soft_1", "soft_2", "soft_3", "soft_4", "soft_5", "soft_6",
    "soft_7", "soft_8", "soft_9", "soft_10", "soft_11", "soft_12", "soft_13", "forks", "mast", "carriage", "fork_l", "fork_r", "forks_attach", "frame_1", "frame_2", "frame_3", "frame_pickup_1", "frame_pickup_2", "frame_pickup_3",
    "frame_pickup_4",  "freight_cont", "freight_bogey", "freightgrain_slidedoor", "door_hatch_r", "door_hatch_l", "tow_arm", "tow_mount_a", "tow_mount_b", "tipper", "combine_reel", "combine_auger", "slipstream_l",
    "slipstream_r",  "arm_1", "arm_2", "arm_3", "arm_4", "scoop", "boom", "stick", "bucket", "shovel_2", "shovel_3", "Lookat_UpprPiston_head", "Lookat_LowrPiston_boom", "Boom_Driver", "cutter_driver", "vehicle_blocker",
    "extra_1", "extra_2", "extra_3", "extra_4", "extra_5", "extra_6", "extra_7", "extra_8", "extra_9", "extra_ten", "extra_11", "extra_12", "break_extra_1", "break_extra_2", "break_extra_3", "break_extra_4", "break_extra_5",
    "break_extra_6",  "break_extra_7", "break_extra_8", "break_extra_9", "break_extra_10", "mod_col_1", "mod_col_2", "mod_col_3", "mod_col_4", "mod_col_5", "handlebars", "forks_u", "forks_l", "wheel_f",
    "swingarm", "wheel_r", "crank", "pedal_r", "pedal_l", "static_prop", "moving_prop", "static_prop2", "moving_prop2", "rudder", "rudder2", "wheel_rf1_dummy","wheel_rf2_dummy", "wheel_rf3_dummy", "wheel_rb1_dummy",
    "wheel_rb2_dummy", "wheel_rb3_dummy", "wheel_lf1_dummy", "wheel_lf2_dummy", "wheel_lf3_dummy", "wheel_lb1_dummy", "wheel_lb2_dummy", "wheel_lb3_dummy", "bogie_front", "bogie_rear", "rotor_main",
    "rotor_rear", "rotor_main_2", "rotor_rear_2", "elevators", "tail", "outriggers_l", "outriggers_r", "rope_attach_a", "rope_attach_b", "prop_1", "prop_2", "elevator_l", "elevator_r", "rudder_l", "rudder_r", "prop_3", "prop_4",
    "prop_5", "prop_6", "prop_7", "prop_8",  "rudder_2",  "aileron_l", "aileron_r", "airbrake_l", "airbrake_r", "wing_l", "wing_r", "wing_lr", "wing_rr", "engine_l", "engine_r", "nozzles_f", "nozzles_r", "afterburner", "wingtip_1",
    "wingtip_2", "gear_door_fl", "gear_door_fr", "gear_door_rl1", "gear_door_rr1", "gear_door_rl2", "gear_door_rr2", "gear_door_rml", "gear_door_rmr", "gear_f", "gear_rl", "gear_lm1", "gear_rr", "gear_rm1", "gear_rm",
    "prop_left", "prop_right", "legs", "attach_male", "draft_animal_attach_lr", "draft_animal_attach_rr", "draft_animal_attach_lm", "draft_animal_attach_rm", "draft_animal_attach_lf", "draft_animal_attach_rf", "wheelcover_l",
    "wheelcover_r", "barracks", "pontoon_l", "pontoon_r", "no_ped_col_step_l", "no_ped_col_strut_1_l", "no_ped_col_strut_2_l", "no_ped_col_step_r", "no_ped_col_strut_1_r", "no_ped_col_strut_2_r", "light_cover",
    "emissives", "neon_l", "neon_r", "neon_f", "neon_b", "dashglow", "doorlight_lf", "doorlight_rf", "doorlight_lr", "doorlight_rr", "unknown_id", "dials", "engineblock", "bobble_head", "bobble_base", "bobble_hand", "chassis_Control"]

export type DependencyType = "direct" | "inverse";

export interface HandlingDependency {
    handlingId: number,
    /** Тип зависимости хэндлинга от родительского
     * При прямой (direct) при увеличении родительского хэндлинга будет увеличиваться и зависимый
     * При обратной (inverse) наоборот */
    dependencyType: DependencyType,
}

export interface HandlingConfig {
    id: number,
    name: string,
    description?: string,
    handlingName: string,
    minValue: number,
    maxValue: number,
    step: number,

    dependencies?: HandlingDependency[]
}

export const handlingConfigs: HandlingConfig[] = [
    { id: 0, name: langStringDefault("lsc.43d446803261ac4f57384e76381c6c2b"), handlingName: "fDriveBiasFront", minValue: 0, maxValue: 1, step: 0.5 },
    { id: 1, name: langStringDefault("lsc.8d5a7faccb3296bfec5d93ec399946b9"), handlingName: "nInitialDriveGears", minValue: 3, maxValue: 7, step: 1 },
    { id: 2, name: langStringDefault("lsc.aa63164115354312efb23c206371c1a8"), handlingName: "fInitialDriveForce", minValue: 0.1, maxValue: 2, step: 0.05 },
    { id: 3, name: langStringDefault("lsc.bb3623ab941e16d7e84bb82a932736e7"), handlingName: "fDriveInertia", minValue: 0.1, maxValue: 1.5, step: 0.05 },
    { id: 4, name: langStringDefault("lsc.299f7983c5142ae30a5a4eab140b818b"), handlingName: "fClutchChangeRateScaleUpShift", minValue: 1, maxValue: 2, step: 0.1 },
    { id: 5, name: langStringDefault("lsc.95dccc945a5a060a1082870d562ce119"), handlingName: "fClutchChangeRateScaleDownShift", minValue: 1, maxValue: 2, step: 0.1 },

    { id: 6, name: langStringDefault("lsc.381876c479df6fb70d019dbd9b37e139"), handlingName: "fBrakeForce", minValue: 0.2, maxValue: 2, step: 0.05 },
    { id: 7, name: langStringDefault("lsc.a9b55e22863a3c038c99feace2d0e6b4"), handlingName: "fBrakeBiasFront", minValue: 0.4, maxValue: 0.7, step: 0.05 },
    { id: 8, name: langStringDefault("lsc.768366344ede6a16e20f017d5295b803"), handlingName: "fHandBrakeForce", minValue: 0, maxValue: 2, step: 0.1 },

    { id: 9, name: langStringDefault("lsc.a2a8d37a24e12bde5d6559256b1f395d"), handlingName: "fSteeringLock", minValue: 0, maxValue: 1.5, step: 0.05 },
    { id: 10, name: langStringDefault("lsc.3333f1d1a9a6292c899e3b444415fab5"), handlingName: "fTractionCurveMax", minValue: 0, maxValue: 4, step: 0.5 },
    { id: 11, name: langStringDefault("lsc.70c2def13cbf049c50690975f28503f2"), handlingName: "fTractionCurveMin", minValue: 1, maxValue: 3, step: 0.1 },
    { id: 12, name: langStringDefault("lsc.04d14ce755599d1366d0a1fcbef676d2"), handlingName: "fTractionCurveLateral", minValue: 20, maxValue: 35, step: 0.5 },
    { id: 13, name: langStringDefault("lsc.342764b54bc32f43bdbfd77f7b95edf9"), handlingName: "fLowSpeedTractionLossMult", minValue: 0.1, maxValue: 1.5, step: 0.1 },
    { id: 14, name: langStringDefault("lsc.714b9fca8d8f0d266dbe758026c9f662"), handlingName: "fTractionBiasFront", minValue: 0.4, maxValue: 0.6, step: 0.05 },

    { id: 15, name: langStringDefault("lsc.305df46c01a09e4b0eae722d063220fe"), handlingName: "fSuspensionForce", minValue: 1, maxValue: 4, step: 0.5 },
    { id: 16, name: langStringDefault("lsc.b4970ab91b8edd617d61e8b5480f9e0e"), handlingName: "fSuspensionCompDamp", minValue: 0.6, maxValue: 2, step: 0.05 },
    { id: 17, name: langStringDefault("lsc.7ca776586f6c8e1ce3f6f441b01b11d4"), handlingName: "fSuspensionReboundDamp", minValue: 0.4, maxValue: 3.5, step: 0.1 },
    { id: 20, name: langStringDefault("lsc.81e0c3f9fcbc3bb41a768d4fd9e30981"), handlingName: "fSuspensionRaise", minValue: -0.015, maxValue: 0.04, step: 0.005 },
    { id: 21, name: langStringDefault("lsc.2da50642ac80e2531a6e49e1af715952"), handlingName: "fRollCentreHeightFront", minValue: 0, maxValue: 0.7, step: 0.1 },
    { id: 22, name: langStringDefault("lsc.4d54a517178d24ec844eed7fccfbf28b"), handlingName: "fRollCentreHeightRear", minValue: 0, maxValue: 0.6, step: 0.1 },
]

export interface ChipTuningOption {
    handlingId: number,
    value: number
}

export const CHIP_TUNING_COST = 200000;
