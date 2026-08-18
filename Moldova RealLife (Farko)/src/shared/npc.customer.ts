import { langStringDefault } from "./lang/index";
import { LicenceType } from "./licence";
import {FACTION_ID} from "./fractions";

export type NpcMenuBackground = "sellman" | "fisher" | "meat" | "miner" | "farmer" | "pirate";

export interface NpcItemDto {
    /** ID предмета из конфига айтемов */
    id: number,
    /** Количество этого предмета у персонажа */
    playerHasCount: number,
    /** Текущая цена предмета */
    price: number
}

export interface NpcCustomer {
    /** Имя НЦП */
    name: string;
    /** Модель НЦП */
    model: string;
    /** Местоположение */
    pos: Vector3Mp;
    /** Угол поворота */
    heading: number;
    /** Список предметов, которые можно продать */
    items: {
        /** ID предмета */
        item: number,
        /** Стоимость за единицу, либо указать массив из двух чисел, тогда сумма будет случайной между ними */
        cost: number | [number, number],
        /** Максимальное количество. Если указать 0 - то неограничено */
        max: number,
        /** Какое количество единиц будет при запуске сервера */
        start: number,
        /** Количество восстановления каждый час */
        perhour: number
    }[];
    /** Измерение, в котором NPC должен находится
     * @default 0
     */
    dimension: number;
    /** Требуется ли лицензия для продажи? Если да, то какая? */
    license?: LicenceType;
    /** Список фракций, у которых есть доступ, если не указать - то доступ будет для всех */
    factions?: FACTION_ID[];
    /** Доступ для членов семьи */
    forFamily?: boolean;
    /** Радиус действия */
    radius: number;
    /** Разрешить продажу вещей из ТС */
    allowSellFromVehicle?: boolean;
    /** Метка на карте, если она необходима */
    blip?: { id: number, color: number },
    /** Какой процент от суммы пойдёт в сейф фракции, если не указать - то никакой */
    partToFraction?: number,
    /** Фон в меню */
    background: NpcMenuBackground
}

export const SELL_FISH_POS = new mp.Vector3(10.77, -2765.96, 2.53)

export const NPC_CUSTOMERS_LIST: NpcCustomer[] = [
    {
        name: langStringDefault("npc.customer.92f75c79390c3f7e5645728af18706a7"),
        model: "a_m_m_prolhost_01",
        pos:  new mp.Vector3(-1604.16, -1061.38, 13.02),
        heading: 53,
        items: [
            { item: 819, cost: [350,450] , max: 0, start: 0, perhour: 0 },
            { item: 820, cost: [1000,1500] , max: 0, start: 0, perhour: 0 },
            { item: 821, cost: [370,470] , max: 0, start: 0, perhour: 0 },
            { item: 822, cost: [500,700] , max: 0, start: 0, perhour: 0 },
            { item: 823, cost: [400,500] , max: 0, start: 0, perhour: 0 },
            { item: 9210, cost: [180,220] , max: 0, start: 0, perhour: 0 },
            { item: 9211, cost: [300,400] , max: 0, start: 0, perhour: 0 },
            { item: 9212, cost: [220, 250] , max: 0, start: 0, perhour: 0 },
            { item: 9213, cost: [250,300] , max: 0, start: 0, perhour: 0 },
            { item: 9214, cost: [280,350] , max: 0, start: 0, perhour: 0 }
        ],
        dimension: 0,
        radius: 3,
        license: "fishsell",
        allowSellFromVehicle: true,
        background: "fisher"
    },
    {
        name: langStringDefault("npc.customer.cc4ae0350fed1e0c121803dcb913388b"),
        model: "g_m_m_armlieut_01",
        pos: new mp.Vector3(-1607.10, -1073.28, 13.02),
        heading: 51,
        items: [
            {item: 882, cost: 1000, max: 30, start: 30, perhour: 30},
            {item: 884, cost: 1000, max: 30, start: 30, perhour: 30},
        ],
        dimension: 0,
        radius: 3,
        allowSellFromVehicle: true,
        factions: [23,24,25],
        partToFraction: 20,
        background: "sellman"
    },
    {
        name: langStringDefault("npc.customer.0038c8c70250baa23f06a66e53db24cc"),
        model: "s_m_m_janitor",
        pos: new mp.Vector3(-1627.47, -1088.61, 13.02),
        heading: 53,
        items: [
            { item: 885, cost: 150, max: 90, start: 90, perhour: 90 },
            { item: 886, cost: 150, max: 50, start: 50, perhour: 50 },
            { item: 40106, cost: 250, max: 90, start: 90, perhour: 90 }, // Minereu de Cupru
            { item: 40107, cost: 350, max: 90, start: 90, perhour: 90 }, // Minereu de Fier
            { item: 40108, cost: 500, max: 90, start: 90, perhour: 90 }, // Argint Neformat
            { item: 40109, cost: 600, max: 90, start: 90, perhour: 90 }, // Aur Neformat
            { item: 40110, cost: 450, max: 90, start: 90, perhour: 90 }, // Minereu de Aluminium
            { item: 40111, cost: 300, max: 90, start: 90, perhour: 90 }, // Minereu de Sulf
            { item: 40112, cost: 800, max: 90, start: 90, perhour: 90 }, // Diamant Neformat
            { item: 40113, cost: 700, max: 90, start: 90, perhour: 90 }, // Smarald Neformat
            { item: 40114, cost: 650, max: 90, start: 90, perhour: 90 }, // Saphir Neformat
            { item: 40115, cost: 650, max: 90, start: 90, perhour: 90 }, // Rubin Neformat
        
            { item: 40116, cost: 800, max: 90, start: 90, perhour: 90 }, // Lingou de Cupru
            { item: 40117, cost: 700, max: 90, start: 90, perhour: 90 }, // Lingou de Fier
            { item: 40118, cost: 850, max: 90, start: 90, perhour: 90 }, // Lingou de Argint
            { item: 40119, cost: 900, max: 90, start: 90, perhour: 90 }, // Lingou de Aur
            { item: 40120, cost: 800, max: 90, start: 90, perhour: 90 }, // Lingou de Aluminium
            { item: 40121, cost: 850, max: 90, start: 90, perhour: 90 },  // Sulf
            { item: 40122, cost: 1200, max: 90, start: 90, perhour: 90 }, // Diamant
            { item: 40123, cost: 1300, max: 90, start: 90, perhour: 90 }, // Smarald
            { item: 40124, cost: 1450, max: 90, start: 90, perhour: 90 }, // Saphir
            { item: 40125, cost: 1550, max: 90, start: 90, perhour: 90 }, // Rubin
        ],
        dimension: 0,
        radius: 5,
        allowSellFromVehicle: true,
        background: "miner"
    },
    {
        name: langStringDefault("npc.customer.85986e46b5dfcad0e07b24c9ed11f3f6"),
        model: "s_m_m_migrant_01",
        pos: new mp.Vector3(-1610.81, -1077.52, 13.02),
        heading: 54,
        items: [
            { item: 830, cost: [1300, 1800], max: 20, start: 20, perhour: 20 },
            { item: 831, cost: [200, 700], max: 20, start: 20, perhour: 20 },
            { item: 832, cost: [1700, 2200], max: 10, start: 10, perhour: 10 },
            { item: 833, cost: [50, 200], max: 50, start: 50, perhour: 25 },
            { item: 834, cost: [200, 350], max: 40, start: 20, perhour: 20 },
            { item: 835, cost: [700, 1200], max: 30, start: 30, perhour: 15 },
            { item: 836, cost: [700, 1200], max: 30, start: 30, perhour: 15 },
        ],
        dimension: 0,
        radius: 5,
        allowSellFromVehicle: true,
        license: "hunting",
        background: "meat"
    },
    // {
    //     name: "Скупщик силоса Mike",
    //     model: "g_m_m_armlieut_01",
    //     pos: new mp.Vector3(2328.74, 4849.62, 41.81),
    //     heading: 225,
    //     items: [
    //         {item: 896, cost: 1000, max: 30, start: 30, perhour: 30},
    //     ],
    //     dimension: 0,
    //     radius: 5,
    //     allowSellFromVehicle: true,
    //     factions: [11],
    //     blip: { id: 480, color: 27 },
    //     partToFraction: 20
    // },
    // {
    //     name: "Покупатель суши",
    //     model: "g_m_m_armlieut_01",
    //     pos: new mp.Vector3(-2193.13, 4293.48, 49.17),
    //     heading: 48,
    //     items: [
    //         {item: 898, cost: 1000, max: 30, start: 30, perhour: 30},
    //     ],
    //     dimension: 0,
    //     radius: 5,
    //     allowSellFromVehicle: true,
    //     factions: [10],
    //     blip: { id: 409, color: 17 },
    //     partToFraction: 20
    // }
    {
        name: langStringDefault("npc.customer.02a9a0ad3dde2ecdbd0cc9164eefffc2"),
        model: "a_m_m_hasjew_01",
        pos: new mp.Vector3(-1616.57, -1084.58, 13.02),
        heading: 52,
        items: [
            { item: 5000, cost: [1500, 2000], max: 90, start: 90, perhour: 90 },
            { item: 5001, cost: [1400, 1900], max: 90, start: 90, perhour: 90 },
            { item: 5002, cost: [1000, 1600], max: 90, start: 90, perhour: 90 },
            { item: 5003, cost: [4000, 6000], max: 90, start: 90, perhour: 90 },
            { item: 5004, cost: [1000, 2000], max: 90, start: 90, perhour: 90 },
            { item: 5005, cost: [2000, 3200], max: 90, start: 90, perhour: 90 },
            { item: 5006, cost: [5000, 7000], max: 90, start: 90, perhour: 90 },
            { item: 5007, cost: [700, 1100], max: 90, start: 90, perhour: 90 },
            { item: 5008, cost: [200, 2000], max: 90, start: 90, perhour: 90 },
            { item: 5009, cost: [500, 1900], max: 90, start: 90, perhour: 90 },
            { item: 5010, cost: [0, 1700], max: 90, start: 90, perhour: 90 },
            { item: 5011, cost: [100, 3000], max: 90, start: 90, perhour: 90 },
            { item: 5012, cost: [50, 1350], max: 90, start: 90, perhour: 90 },
            { item: 5013, cost: [20, 5000], max: 90, start: 90, perhour: 90 },
            { item: 5014, cost: [3000, 7000], max: 90, start: 90, perhour: 90 },
            { item: 5015, cost: [6000, 9000], max: 90, start: 90, perhour: 90 },
        ],
        dimension: 0,
        radius: 5,
        background: "sellman"
     },
     {
         name: langStringDefault("npc.customer.ffc43dc356f7e9ccb44858f1e1b86336"),
         model: "s_m_m_cntrybar_01",
         pos: new mp.Vector3(-1608.25, -1066.29, 13.0),
         heading: 71,
         items: [
            {item: 896, cost: 1000, max: 30, start: 30, perhour: 30},
            // {item: 898, cost: 1000, max: 30, start: 30, perhour: 30},
            {item: 7020, cost: [350, 400], max: 0, start: 0, perhour: 0},
            {item: 7021, cost: [355, 405], max: 0, start: 0, perhour: 0},
            {item: 7022, cost: [375, 410], max: 0, start: 0, perhour: 0},
            {item: 7023, cost: [370, 425], max: 0, start: 0, perhour: 0},
            {item: 7024, cost: [320, 405], max: 0, start: 0, perhour: 0},
            {item: 7025, cost: [365, 430], max: 0, start: 0, perhour: 0},
            {item: 7026, cost: [335, 390], max: 0, start: 0, perhour: 0},
            {item: 7027, cost: [375, 430], max: 0, start: 0, perhour: 0},
            {item: 7028, cost: [325, 395], max: 0, start: 0, perhour: 0},
            // {item: 7029, cost: [1200, 1350], max: 0, start: 0, perhour: 0},
            {item: 7030, cost: [460, 480], max: 0, start: 0, perhour: 0},
            {item: 7031, cost: [375, 410], max: 0, start: 0, perhour: 0},
            {item: 9000, cost: [470, 550], max: 0, start: 0, perhour: 0},
         ],
         dimension: 0,
         radius: 5,
         allowSellFromVehicle: true,
         background: "farmer"
     },
    //  {
    //      name: langStringDefault("npc.customer.55172934fc26b745bb44bfad8ad7b0f9"),
    //      model: "s_m_m_janitor",
    //      pos: new mp.Vector3(-1628.46, -1097.32, 13.02),
    //      heading: 47,
    //      items: [
    //          { item: 6519, cost: [2000, 3000], max: 0, start: 0, perhour: 0 },
    //          { item: 6520, cost: [2500, 3500], max: 0, start: 0, perhour: 0 },
    //          { item: 6521, cost: [1500, 2000], max: 0, start: 0, perhour: 0 },
    //          { item: 6522, cost: [3000, 4000], max: 0, start: 0, perhour: 0 },
    //          { item: 6523, cost: [3500, 4500], max: 0, start: 0, perhour: 0 },
    //          { item: 6524, cost: [4000, 5000], max: 0, start: 0, perhour: 0 },
    //          { item: 6525, cost: [4500, 5500], max: 0, start: 0, perhour: 0 },
    //      ],
    //      dimension: 0,
    //      radius: 5,
    //      allowSellFromVehicle: true,
    //      background: "pirate"
    //  },
];