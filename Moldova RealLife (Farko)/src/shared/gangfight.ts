import { langStringDefault } from "./lang/index";
export const GANGFIGHT_POS: {
    x: number,
    y: number,
    z: number,
    h: number,
    d: number,
    /** Название */
    name: string,
    /** Сколько минут будет открыватся контейнер */
    timer: number,
    /** Через сколько времени после открытия контейнер будет уничтожен*/
    destroyTime: number,
    /** В какие часы система будет запускатся */
    startHours?: number[],
    /** Какие предметы будут выпадать из коробки */
    items: {
        /** ID предмета */
        item_id: number,
        /** Количество предмета */
        amount: number,
        /** Параметр количества у предмета (если требуется, если не указать - то будет использоватся параметр предмета по умолчанию) */
        count?:number,
        /** Шанс выпадения предмета (параметр относительно других предметов) */
        chance: number,
    }[],
    /** Сколько предметов будет выпадать (количество) */
    itemsCount: number,
    /** Which factions are participating in the event */
    factions: number[],
    bliptype: number,
    blipcolor: number,
    /** С какого уровня можно запустить мероприятие вручную администратором */
    adminRun: number,
}[] = [

    // Gang
    {x: 2339.79, y: 5564.36, z: 39.44, h: 264, d:0, name: langStringDefault("gangfight.eb06f498a9446dd7d2f7a842e41c18e6"), timer: 15, destroyTime: 3, startHours: [12], items: [
        { item_id: 40127, amount: 4, chance: 45},
        { item_id: 40128, amount: 3, chance: 45},
        { item_id: 40129, amount: 5, chance: 15},
        { item_id: 40130, amount: 10, chance: 50},
        { item_id: 40131, amount: 2, chance: 5},
        { item_id: 40132, amount: 2, chance: 5},
        { item_id: 40133, amount: 2, chance: 5},
        { item_id: 40134, amount: 2, chance: 5},
        { item_id: 40135, amount: 2, chance: 5},
        { item_id: 40136, amount: 2, chance: 5},
        { item_id: 40137, amount: 2, chance: 5},
        { item_id: 40128, amount: 1, chance: 5},
        { item_id: 40139, amount: 10, chance: 5},
    ],  itemsCount: 5, factions: [18,19,20,21,22,23,24,25], bliptype: 550, blipcolor: 0, adminRun: 5 },
     
     {x: 1271.52, y: 3125.04, z: 40.44, h: 101, d:0, name: langStringDefault("gangfight.eb06f498a9446dd7d2f7a842e41c18e6"), timer: 15, destroyTime: 3, startHours: [14], items: [
        { item_id: 40127, amount: 4, chance: 45},
        { item_id: 40128, amount: 3, chance: 45},
        { item_id: 40129, amount: 5, chance: 15},
        { item_id: 40130, amount: 10, chance: 50},
        { item_id: 40131, amount: 2, chance: 5},
        { item_id: 40132, amount: 2, chance: 5},
        { item_id: 40133, amount: 2, chance: 5},
        { item_id: 40134, amount: 2, chance: 5},
        { item_id: 40135, amount: 2, chance: 5},
        { item_id: 40136, amount: 2, chance: 5},
        { item_id: 40137, amount: 2, chance: 5},
        { item_id: 40128, amount: 1, chance: 5},
        { item_id: 40139, amount: 10, chance: 5},
    ], itemsCount: 5, factions: [18,19,20,21,22,23,24,25], bliptype: 550, blipcolor: 0, adminRun: 5 },

    {x: -1134.56, y: 4924.43, z: 219.88, h: 254, d:0, name: langStringDefault("gangfight.eb06f498a9446dd7d2f7a842e41c18e6"), timer: 15, destroyTime: 3, startHours: [16], items: [
        { item_id: 40127, amount: 4, chance: 45},
        { item_id: 40128, amount: 3, chance: 45},
        { item_id: 40129, amount: 5, chance: 15},
        { item_id: 40130, amount: 10, chance: 50},
        { item_id: 40131, amount: 2, chance: 5},
        { item_id: 40132, amount: 2, chance: 5},
        { item_id: 40133, amount: 2, chance: 5},
        { item_id: 40134, amount: 2, chance: 5},
        { item_id: 40135, amount: 2, chance: 5},
        { item_id: 40136, amount: 2, chance: 5},
        { item_id: 40137, amount: 2, chance: 5},
        { item_id: 40128, amount: 1, chance: 5},
        { item_id: 40139, amount: 10, chance: 5},
    ], itemsCount: 5, factions: [18,19,20,21,22,23,24,25], bliptype: 550, blipcolor: 0, adminRun: 5 },

    {x: 1675.79, y: -62.17, z: 173.78, h: 217, d:0, name: langStringDefault("gangfight.eb06f498a9446dd7d2f7a842e41c18e6"), timer: 15, destroyTime: 3, startHours: [18], items: [
        { item_id: 40127, amount: 4, chance: 45},
        { item_id: 40128, amount: 3, chance: 45},
        { item_id: 40129, amount: 5, chance: 15},
        { item_id: 40130, amount: 10, chance: 50},
        { item_id: 40131, amount: 2, chance: 5},
        { item_id: 40132, amount: 2, chance: 5},
        { item_id: 40133, amount: 2, chance: 5},
        { item_id: 40134, amount: 2, chance: 5},
        { item_id: 40135, amount: 2, chance: 5},
        { item_id: 40136, amount: 2, chance: 5},
        { item_id: 40137, amount: 2, chance: 5},
        { item_id: 40128, amount: 1, chance: 5},
        { item_id: 40139, amount: 10, chance: 5},
    ], itemsCount: 5, factions: [18,19,20,21,22,23,24,25], bliptype: 550, blipcolor: 0, adminRun: 5 },

    {x: 299.44, y: -3213.81, z: 5.76, h: 355, d:0, name: langStringDefault("gangfight.eb06f498a9446dd7d2f7a842e41c18e6"), timer: 15, destroyTime: 3, startHours: [20], items: [
        { item_id: 40127, amount: 4, chance: 45},
        { item_id: 40128, amount: 3, chance: 45},
        { item_id: 40129, amount: 5, chance: 15},
        { item_id: 40130, amount: 10, chance: 50},
        { item_id: 40131, amount: 2, chance: 5},
        { item_id: 40132, amount: 2, chance: 5},
        { item_id: 40133, amount: 2, chance: 5},
        { item_id: 40134, amount: 2, chance: 5},
        { item_id: 40135, amount: 2, chance: 5},
        { item_id: 40136, amount: 2, chance: 5},
        { item_id: 40137, amount: 2, chance: 5},
        { item_id: 40128, amount: 1, chance: 5},
        { item_id: 40139, amount: 10, chance: 5},
    ], itemsCount: 5, factions: [18,19,20,21,22,23,24,25], bliptype: 550, blipcolor: 0, adminRun: 5 },

    {x: -1924.89, y: -2994.55, z: 13.94, h: 8, d:0, name: langStringDefault("gangfight.eb06f498a9446dd7d2f7a842e41c18e6"), timer: 15, destroyTime: 3, startHours: [22], items: [
        { item_id: 40127, amount: 4, chance: 45},
        { item_id: 40128, amount: 3, chance: 45},
        { item_id: 40129, amount: 5, chance: 15},
        { item_id: 40130, amount: 10, chance: 50},
        { item_id: 40131, amount: 2, chance: 5},
        { item_id: 40132, amount: 2, chance: 5},
        { item_id: 40133, amount: 2, chance: 5},
        { item_id: 40134, amount: 2, chance: 5},
        { item_id: 40135, amount: 2, chance: 5},
        { item_id: 40136, amount: 2, chance: 5},
        { item_id: 40137, amount: 2, chance: 5},
        { item_id: 40128, amount: 1, chance: 5},
        { item_id: 40139, amount: 10, chance: 5},
    ], itemsCount: 5, factions: [18,19,20,21,22,23,24,25], bliptype: 550, blipcolor: 0, adminRun: 5 },

    {x: 1715.68, y: -1649.67, z: 112.53, h: 191, d:0, name: langStringDefault("gangfight.eb06f498a9446dd7d2f7a842e41c18e6"), timer: 15, destroyTime: 3, startHours: [0], items: [
        { item_id: 40127, amount: 4, chance: 45},
        { item_id: 40128, amount: 3, chance: 45},
        { item_id: 40129, amount: 5, chance: 15},
        { item_id: 40130, amount: 10, chance: 50},
        { item_id: 40131, amount: 2, chance: 5},
        { item_id: 40132, amount: 2, chance: 5},
        { item_id: 40133, amount: 2, chance: 5},
        { item_id: 40134, amount: 2, chance: 5},
        { item_id: 40135, amount: 2, chance: 5},
        { item_id: 40136, amount: 2, chance: 5},
        { item_id: 40137, amount: 2, chance: 5},
        { item_id: 40128, amount: 1, chance: 5},
        { item_id: 40139, amount: 10, chance: 5},
    ], itemsCount: 5, factions: [18,19,20,21,22,23,24,25], bliptype: 550, blipcolor: 0, adminRun: 5 },

    {x: 20.79, y: -1735.82, z: 29.30, h: 328, d:0, name: langStringDefault("gangfight.eb06f498a9446dd7d2f7a842e41c18e6"), timer: 15, destroyTime: 3, items: [
        { item_id: 40127, amount: 4, chance: 45},
        { item_id: 40128, amount: 3, chance: 45},
        { item_id: 40129, amount: 5, chance: 15},
        { item_id: 40130, amount: 10, chance: 50},
        { item_id: 40131, amount: 2, chance: 5},
        { item_id: 40132, amount: 2, chance: 5},
        { item_id: 40133, amount: 2, chance: 5},
        { item_id: 40134, amount: 2, chance: 5},
        { item_id: 40135, amount: 2, chance: 5},
        { item_id: 40136, amount: 2, chance: 5},
        { item_id: 40137, amount: 2, chance: 5},
        { item_id: 40128, amount: 1, chance: 5},
        { item_id: 40139, amount: 10, chance: 5},
    ], itemsCount: 5, factions: [18,19,20,21,22,23,24,25], bliptype: 550, blipcolor: 0, adminRun: 5 }

    

];

export const GANGFIGHT_MODEL = "prop_box_ammo03a_set2"