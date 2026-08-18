import { langStringDefault } from "./lang/index";
import {ItemEntity} from "../server/modules/typeorm/entities/inventory";
import {ARMOR_ITEM_ID} from "./inventory";

export type CraftType = "bomb" | "medicine" | "gun103" | "gunTec" | "gunTecminereuri" | "mef" | "coca" | "meth" | "methpas2" | "trava" | "winepress" | "winebottle" | "biofuel" | "armor" | "silos" | "sushi" | "spalare" | "topitorie" 

export type CraftItemFactoryMethod = (table: TableData, tableIndex: number) => Partial<ItemEntity>;

export interface CraftItem {
    /** ID предмета рецепта */
    recipe?: number;
    /** ID предмета, который будет получен по итогу */
    // item: ({ id: number, count: number, chance: number } | [number, number])[]; // <-- modificat aici
    item: CraftItemReward[]; // AICI corect

    /** Количество предмета. Если указать, то количество у предмета будет определённым */
    count?:number
    /** Какие предметы и в каком количестве необходимы для крафта */
    items: [number, number][];
    /** Сколько секунд необходимо для крафта */
    seconds: number;
    type: CraftType,

    /** Крафт находится в семейном доме */
    inHouseInterior?: boolean;

    itemFactoryMethod?: CraftItemFactoryMethod;
}
export type CraftItemReward = {
    id: number;
    count: number;
    chance?: number; // chance este optional
}
export interface TableData {
    /** Координаты всех точек крафта данного раздела */
    pos: { x: number, y: number, z: number, h: number }[],
    /** Какой тип объектов можно крафтить на данных столах */
    type: CraftType,
    /** Название зоны крафта */
    name: string,
    /** Анимация которая будет проиграна */
    anim: string | [string, string],
    /** Режим работы, 
     * @example long - будет проиграна анимка в течении 5 секунд а потом пойдёт таймер отсчёта без участия игрока. То есть находится постоянно на маркере не надо будет.
     * @example short - будет проигрыватся анимка в течении всего таймера, рассчитана на вариант сделать тут на месте и получить результат.
     */
    mode: "short" | "long",
    /** ID блипа, если он необходим */
    blipid?:number;
    /** Цвет блипа, если он необходим */
    blipcolor?:number;
    /** Список ИД фрккций, у которых есть доступ */
    fractions?:number[]
    /** Есть ли доступ у семьи-мафии */
    mafia?: boolean;
}

/** Конфиг всех рецептов */
export const CRAFTING_ITEMS: CraftItem[] = [
    { items: [[40101, 3], [55, 1]], seconds: 15, type: "trava", item: [{ id: 51, count: 1, chance: 100 }] },
    { items: [[40102, 3], [55, 1]], seconds: 15, type: "coca", item: [{ id: 52, count: 1, chance: 100 }] },
    { items: [[40100, 3], [40154, 1], [40155, 1]], seconds: 15, type: "meth", item: [{ id: 40156, count: 1, chance: 100 }] },
    { items: [[40156, 1], [55, 1]], seconds: 15, type: "methpas2", item: [{ id: 53, count: 1, chance: 100 }] },
    { items: [[55, 10], [56, 10], [59, 10]], seconds: 2, type: "mef", item: [{ id: 50, count: 1, chance: 100 }] },
    { items: [[4000, 1], [4001, 1], [4002, 1]], seconds: 2, type: "armor", item: [{ id: ARMOR_ITEM_ID, count: 1, chance: 100 }] },
    {
        items: [[885, 1]],
        seconds: 30,
        type: "spalare",
        item: [
            { id: 40106, count: 1, chance: 25 },
            { id: 40107, count: 1, chance: 30 },
            { id: 40108, count: 1, chance: 15 },
            { id: 40109, count: 1, chance: 10 },
            { id: 40110, count: 1, chance: 10 },
            { id: 40111, count: 1, chance: 5 },
            { id: 40112, count: 1, chance: 2 },
            { id: 40113, count: 1, chance: 2 },
            { id: 40114, count: 1, chance: 0.5 },
            { id: 40115, count: 1, chance: 0.5 }
        ]
    },
    { items: [[40111, 5], [40126, 3], [886, 2]], seconds: 30, type: "gun103", item: [{ id: 40153, count: 1, chance: 100 }] },
    { items: [[40153, 3], [40116, 3], [40117, 3]], seconds: 30, type: "gun103", item: [{ id: 153, count: 1, chance: 100 }] },
    { items: [[40127, 1], [40128, 1], [40129, 1], [40130, 1], [40131, 1], [40132, 1], [40133, 1], [40134, 1], [40135, 1]], seconds: 30, type: "gunTec", item: [{ id: 500, count: 1, chance: 100 }] },
    { items: [[40136, 1], [40137, 1], [40138, 1], [40139, 1], [40140, 1], [40141, 1]], seconds: 30, type: "gunTec", item: [{ id: 520, count: 1, chance: 100 }] },
    { items: [[40142, 1], [40143, 1], [40144, 1], [40145, 1]], seconds: 30, type: "gunTec", item: [{ id: 516, count: 1, chance: 100 }] },
    { items: [[40146, 1], [40147, 1], [40148, 1], [40149, 1]], seconds: 30, type: "gunTec", item: [{ id: 505, count: 1, chance: 100 }] },
    { items: [[40150, 1], [40151, 1], [40152, 1]], seconds: 30, type: "gunTec", item: [{ id: 502, count: 1, chance: 100 }] },
    { items: [[859, 1], [858, 1], [857, 1]], seconds: 30, type: "gunTec", item: [{ id: 854, count: 1, chance: 100 }] },

    // AK47 Parts
    { items: [[40107, 8], [40106, 5], [40111, 3], [40110, 2]], seconds: 60, type: "gunTecminereuri", item: [{ id: 40127, count: 1, chance: 100 }] },
    { items: [[40107, 7], [40106, 5], [40110, 3]], seconds: 60, type: "gunTecminereuri", item: [{ id: 40128, count: 1, chance: 100 }] },
    { items: [[40107, 5], [40106, 5], [40111, 4]], seconds: 60, type: "gunTecminereuri", item: [{ id: 40129, count: 1, chance: 100 }] },
    { items: [[40107, 9], [40106, 3], [40110, 2]], seconds: 60, type: "gunTecminereuri", item: [{ id: 40130, count: 1, chance: 100 }] },
    { items: [[40107, 6], [40106, 4], [40111, 2]], seconds: 60, type: "gunTecminereuri", item: [{ id: 40131, count: 1, chance: 100 }] },
    { items: [[40107, 10], [40106, 2], [40110, 3]], seconds: 60, type: "gunTecminereuri", item: [{ id: 40132, count: 1, chance: 100 }] },
    { items: [[40107, 7], [40106, 5], [40111, 2]], seconds: 60, type: "gunTecminereuri", item: [{ id: 40133, count: 1, chance: 100 }] },
    { items: [[40107, 6], [40106, 6], [40110, 3]], seconds: 60, type: "gunTecminereuri", item: [{ id: 40134, count: 1, chance: 100 }] },
    { items: [[40107, 8], [40106, 4], [40111, 2]], seconds: 60, type: "gunTecminereuri", item: [{ id: 40135, count: 1, chance: 100 }] },
    
    // CombatPDW Parts
    { items: [[40110, 6], [40106, 4], [40111, 3]], seconds: 45, type: "gunTecminereuri", item: [{ id: 40136, count: 1, chance: 100 }] },
    { items: [[40110, 7], [40106, 3], [40107, 2]], seconds: 45, type: "gunTecminereuri", item: [{ id: 40137, count: 1, chance: 100 }] },
    { items: [[40110, 5], [40106, 5], [40111, 4]], seconds: 45, type: "gunTecminereuri", item: [{ id: 40138, count: 1, chance: 100 }] },
    { items: [[40110, 8], [40106, 2], [40107, 4]], seconds: 45, type: "gunTecminereuri", item: [{ id: 40139, count: 1, chance: 100 }] },
    { items: [[40110, 6], [40106, 4], [40111, 3]], seconds: 45, type: "gunTecminereuri", item: [{ id: 40140, count: 1, chance: 100 }] },
    { items: [[40110, 7], [40106, 3], [40111, 2]], seconds: 45, type: "gunTecminereuri", item: [{ id: 40141, count: 1, chance: 100 }] },
    
    // MicroSMG Parts
    { items: [[40110, 4], [40106, 4], [40107, 2]], seconds: 40, type: "gunTecminereuri", item: [{ id: 40142, count: 1, chance: 100 }] },
    { items: [[40110, 5], [40106, 3], [40111, 2]], seconds: 40, type: "gunTecminereuri", item: [{ id: 40143, count: 1, chance: 100 }] },
    { items: [[40110, 4], [40106, 4], [40107, 3]], seconds: 40, type: "gunTecminereuri", item: [{ id: 40144, count: 1, chance: 100 }] },
    { items: [[40110, 6], [40106, 2], [40111, 3]], seconds: 40, type: "gunTecminereuri", item: [{ id: 40145, count: 1, chance: 100 }] },
    
    // Pistol50 Parts
    { items: [[40107, 6], [40106, 3], [40110, 2]], seconds: 30, type: "gunTecminereuri", item: [{ id: 40146, count: 1, chance: 100 }] },
    { items: [[40107, 5], [40106, 4], [40111, 2]], seconds: 30, type: "gunTecminereuri", item: [{ id: 40147, count: 1, chance: 100 }] },
    { items: [[40107, 7], [40106, 2], [40110, 3]], seconds: 30, type: "gunTecminereuri", item: [{ id: 40148, count: 1, chance: 100 }] },
    { items: [[40107, 6], [40106, 3], [40111, 3]], seconds: 30, type: "gunTecminereuri", item: [{ id: 40149, count: 1, chance: 100 }] },
    
    // Pistol MK2 Parts
    { items: [[40107, 6], [40106, 3], [40111, 2]], seconds: 30, type: "gunTecminereuri", item: [{ id: 40150, count: 1, chance: 100 }] },
    { items: [[40107, 5], [40106, 4], [40110, 2]], seconds: 30, type: "gunTecminereuri", item: [{ id: 40151, count: 1, chance: 100 }] },
    { items: [[40107, 7], [40106, 2], [40111, 2]], seconds: 30, type: "gunTecminereuri", item: [{ id: 40152, count: 1, chance: 100 }] },



    // 🔥 Topitorie - fiecare minereu topit separat
    { items: [[40106, 5]], seconds: 30, type: "topitorie", item: [{ id: 40116, count: 1, chance: 100 }] },
    { items: [[40107, 5]], seconds: 30, type: "topitorie", item: [{ id: 40117, count: 1, chance: 100 }] },
    { items: [[40108, 5]], seconds: 30, type: "topitorie", item: [{ id: 40118, count: 1, chance: 100 }] },
    { items: [[40109, 5]], seconds: 30, type: "topitorie", item: [{ id: 40119, count: 1, chance: 100 }] },
    { items: [[40110, 5]], seconds: 30, type: "topitorie", item: [{ id: 40120, count: 1, chance: 100 }] },
    { items: [[40111, 5]], seconds: 30, type: "topitorie", item: [{ id: 40121, count: 1, chance: 100 }] },
    { items: [[40112, 5]], seconds: 30, type: "topitorie", item: [{ id: 40122, count: 1, chance: 100 }] },
    { items: [[40113, 5]], seconds: 30, type: "topitorie", item: [{ id: 40123, count: 1, chance: 100 }] },
    { items: [[40114, 5]], seconds: 30, type: "topitorie", item: [{ id: 40124, count: 1, chance: 100 }] },
    { items: [[40115, 5]], seconds: 30, type: "topitorie", item: [{ id: 40125, count: 1, chance: 100 }] },

    // Productie Vin / Combustibil / Sushi
    { items: [[879, 5]], seconds: 20, type: "winepress", item: [{ id: 881, count: 1, chance: 100 }] },
    { items: [[881, 1]], seconds: 40, type: "winebottle", item: [{ id: 882, count: 1, chance: 100 }] },
    { items: [[896, 10]], seconds: 60, type: "biofuel", item: [{ id: 884, count: 1, chance: 100 }] },
    { items: [[895, 10]], seconds: 60, type: "silos", item: [{ id: 896, count: 1, chance: 100 }] },
    // { items: [[897, 10]], seconds: 60, type: "sushi", item: [{ id: 898, count: 1, chance: 100 }] },
];
export const CRAFTING_TABLES: TableData[] = [
    {
        pos: [
            {x: 4979.22, y: -5298.50, z: -1.82, h: 132}
        ],
        type: "gun103",
        name: "Craft Gloante", // <- AICI trebuie sa fie corect
        anim: ["anim@heists@money_grab@duffel", "loop"],
        mode: "long",
        fractions: [18,19,20,21,22,23,24,25],
        mafia: true
    },
    //// CRAFT ARME
    {
        pos: [
            {x: 4982.92, y: -5302.06, z: -1.82, h: 353}
        ],
        type: "gunTec",
        name: "Craft Arme", // <- AICI trebuie sa fie corect
        anim: ["anim@heists@money_grab@duffel", "loop"],
        mode: "long",
        fractions: [18,19,20,21,22,23,24,25],
    },
    {
        pos: [
            {x: 4983.17, y: -5299.63, z: -1.82, h: 174}
        ],
        type: "gunTecminereuri",
        name: "Craft Part", // <- AICI trebuie sa fie corect
        anim: ["anim@heists@money_grab@duffel", "loop"],
        mode: "long",
        fractions: [18,19,20,21,22,23,24,25],
    },
  //  {
  //      pos: [
  //          {x: -481.96, y: -1724.47, z: 18.51, h: 6},
  //          {x: 108.93, y: -1977.78, z: 19.96, h: 293},
  //          {x: 494.31, y: -1948.90, z: 23.72, h: 120},
  //          {x: 886.95, y: -2155.62, z: 31.27, h: 83},
  //          {x: 451.68, y: -1319.48, z: 28.27, h: 324},
  //          {x: -1487.16, y: 836.36, z: 176.00, h: 292},
  //          {x: 1397.72, y: 1144.77, z: 106.33, h: 267},
  //          {x: -352.22, y: 182.68, z: 81.95, h: 297}
  //      ],
  //      type: "armor",
  //      name: "Крафт бронежилета",
  //      anim: ["anim@heists@money_grab@duffel", "loop"],
  //      mode: "short",
  //      fractions: [21,19, 22, 18, 20, 24, 25, 23]
  //  },

    {
        pos: [
            {x: 2260.93, y: 3941.96, z: 29.73, h: 57},
            {x: 2254.76, y: 3935.88, z: 29.48, h: 67},
            {x: 2251.64, y: 3930.27, z: 29.68, h: 69},
            {x: 2268.72, y: 3947.41, z: 29.97, h: 53}
        ],
        type: "spalare",
        name: "Spalarea Pietrelor",
        // anim: ["mini@repair", "fixing_a_ped"],
        // anim: ["amb@world_human_bum_wash@male@low@idle_a", "idle_a"], // ✅ animatie de spalat
        anim: ["anim@heists@narcotics@funding@gang_idle", "gang_chatting_idle01"],
        mode: "short",
        blipid: 1,
        blipcolor: 25
    },

    {
        pos: [
            { x: 1088.00, y: -2001.83, z: 29.88, h: 140 }
            // { x: 896.71, y: -2161.14, z: 31.27, h: 83 },
            // { x: 465.11, y: -1331.95, z: 28.27, h: 324 }
        ],
        type: "topitorie",
        name: "Topitorie", // <- AICI trebuie sa fie corect
        anim: ["mini@repair", "fixing_a_ped"], // <- aici e noua animatie
        mode: "short",
        blipid: 436,
        blipcolor: 1
    },
    {
        pos: [
            {x: 5135.90, y: -5181.43, z: -4.67, h: 347},
            {x: 5139.30, y: -5181.42, z: -4.67, h: 3},
            {x: 5133.09, y: -5181.46, z: -4.67, h: 0}
            // {x: 896.71, y: -2161.14, z: 31.27, h: 83},
            // {x: 465.11, y: -1331.95, z: 28.27, h: 324}
        ],
        type: "trava",
        name: "Craft Iarba", // <- AICI trebuie sa fie corect
        // anim: ["anim@heists@money_grab@duffel", "loop"],
        // mode: "short",
        anim: ["anim@amb@business@weed@weed_inspecting_high_dry@", "weed_inspecting_high_idle_03_inspector"],
        mode: "short",
        fractions: [18,19,20,21,22,23,24,25]
    },
    /////////// procesare meth
    {
        pos: [
            {x: 5133.89, y: -4610.29, z: -5.17, h: 342},
            {x: 5125.62, y: -4614.87, z: -5.16, h: 168}
        ],
        type: "meth",
        name: "Craft Amfetamina", // <- AICI trebuie sa fie corect
        anim: ["anim@heists@money_grab@duffel", "loop"],
        mode: "short",
        fractions: [18,19,20,21,22,23,24,25]
    },
    ////// inpachetarea meth 
    {
        pos: [
            {x: 5123.17, y: -4618.21, z: -5.67, h: 163},
            {x: -1489.74, y: 841.91, z: 176.00, h: 293}
        ],
        type: "methpas2",
        name: "Craft Amfetamina", // <- AICI trebuie sa fie corect
        anim: ["anim@heists@money_grab@duffel", "loop"],
        mode: "short",
        fractions: [18,19,20,21,22,23,24,25]
    },

    //////////// cocaina
    {
        pos: [
            {x: 4989.73, y: -5132.38, z: -5.47, h: 0},
            {x: 4987.03, y: -5132.46, z: -5.47, h: 359},
            {x: 4989.64, y: -5128.58, z: -5.47, h: 2},
            {x: 4980.24, y: -5128.89, z: -5.47, h: 2},
            {x: 4980.64, y: -5132.63, z: -5.47, h: 2},
            {x: 4983.08, y: -5132.58, z: -5.47, h: 1},
        ],
        type: "coca",
        name: "Craft Cocaina", // <- AICI trebuie sa fie corect
        anim: ["anim@heists@money_grab@duffel", "loop"],
        mode: "short",
        fractions: [18,19,20,21,22,23,24,25]
    },
    { 
    pos: [
        { x: 437.13, y: 6455.88, z: 27.74, h: 141 },
        { x: 431.99, y: 6460.27, z: 27.75, h: 141 },
        { x: 426.98, y: 6464.19, z: 27.78, h: 133 },
    ], 
        type: "winepress",
        name: langStringDefault("crafting.a38409a40ea7a15a8c0b639073e24ea0"), 
        anim: ["special_ped@mountain_dancer@monologue_1@monologue_1a", "mtn_dnc_if_you_want_to_get_to_heaven"], 
        mode: "short",
        blipid: 365,
        blipcolor: 49,
        fractions: [23,24,25]
    },
    { 
        pos: [
        { x: 421.14, y: 6453.42, z: 27.98, h: 178 }, 
        { x: 415.34, y: 6452.03, z: 27.81, h: 183 }, 
        { x: 406.10, y: 6452.09, z: 27.81, h: 177 },
    ], 
        type: "winebottle", 
        name: langStringDefault("crafting.deee7506b4e316bd1b000718f4e37d94"), 
        anim: ["mini@repair", "fixing_a_ped"], 
        mode: "short", 
        blipid: 365,
        blipcolor: 49,
        fractions: [23,24,25]
    },
    {
        pos: [
            { x: 360.09, y: 3407.24, z: 35.40, h: 111 },
            { x: 360.83, y: 3404.44, z: 35.40, h: 116 },
        ],
        type: "biofuel",
        name: langStringDefault("crafting.dc948201580acafe7ea867a6ff487203"),
        anim: ["mini@repair", "fixing_a_ped"],
        mode: "short",
        blipid: 361,
        blipcolor: 25,
        fractions: [23,24,25]
    },
    {
        pos: [
            { x: -65.98, y: 6243.67, z: 30.08, h: 298 },
            { x: -64.82, y: 6241.92, z: 30.09, h: 303 },
        ],
        type: "silos",
        name: langStringDefault("crafting.f471217b6ded42de5ed70c8d31c735f5"),
        anim: ["mini@repair", "fixing_a_ped"],
        mode: "short",
        blipid: 361,
        blipcolor: 25,
        fractions: [23,24,25]
    },
    // {
    //     pos: [
    //         { x: -97.38, y: 2809.66, z: 52.22, h: 263 },
    //         { x: -96.05, y: 2811.75, z: 52.26, h: 333 },
    //     ],
    //     type: "sushi",
    //     name: langStringDefault("crafting.2b1727f969cf931330010c7316137897"),
    //     anim: ["mini@repair", "fixing_a_ped"],
    //     mode: "short",
    //     blipid: 760,
    //     blipcolor: 47,
    //     fractions: [23,24,25]
    // },
];