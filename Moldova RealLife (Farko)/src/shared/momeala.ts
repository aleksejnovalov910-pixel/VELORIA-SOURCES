import { langStringDefault } from "./lang/index";
import {FACTION_ID} from "./fractions";
import {MINIGAME_TYPE} from "./minigame";

export interface MomealaItem {
    /** Название зоны */
    name: string,
    /** Описание зоны */
    desc: string,
    /** Выдаваемый предмет */
    item: number | number[],
    /** Количество предметов */
    amount_max: number,
    /** Количество восстановления за час */
    restore_tick: number,
    /** Интервал между тиками восстановления */
    tick_interval_minutes: number,
    /**
     *  Разделять количество между точками<br/>
     *  Это необходимо чтобы игроку приходилось ходить между точками, а не собирать всё находясь в одном месте
     *  @example К примеру есть 2 точки, и параметр {@param amount_max} = 10, получается что на каждой точке будет по 5 единиц
     *
     */
    split?:boolean,
    /** Измерение, в котором отображать зону. Если что, основное измерение мира - 0 */
    d: number,
    /** Местоположение точек зоны */
    pos: {x: number, y: number, z: number}[],
    /** Доступ для семей */
    family?: boolean,
    /** Доступ для фрации. Првоерка работает только если указать данный параметр */
    fraction?:FACTION_ID[],
    /** Необходимо быть членом семьи */
    needFamily?: boolean,
    /** Необходимо НЕ состоять во фракции. Проверка не будет работать если указан параметр fraction */
    needNotFraction?: boolean,
    /** Метка на карте, если она необходима */
    blip?: { id: number, color: number },
    /** Сценарий, если требуется */
    anim: { task: string | [string, string, boolean?], seconds: number, text: string, heading?: number, minigame?: MINIGAME_TYPE },
    /** Сколько секунд блокировки между тем как игрок может брать следующий предмет */
    cooldown: number,
    /**
     * Какой типа маркера будет
     * Список {@link https://wiki.rage.mp/index.php?title=Markers Wiki}
     */
    markerType: number,
}


export const MOMEALA_POSITIONS: MomealaItem[] = [

    {
        name: "Mlastina",
        desc: "Cauta rame",
        item: [
            40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159,40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159, 40159,
            40159, 40159, 40159,
            40159
        ],        
        amount_max: 16, // 2 pietre pentru fiecare punct
        restore_tick: 16, // Când se regenereaza, la fel 16 ca sa refaca tot    
        tick_interval_minutes: 10,
        split: true,
        d: 0,
        cooldown: 5,
        markerType: 20,
        // anim: {
        //     task: "WORLD_HUMAN_GARDENER_PLANT",
        //     seconds: 40,
        //     text: langStringDefault("farm.bf19c642cfeea6d8c57c61da04f7ab44")
        // },
        anim: {
            task: "WORLD_HUMAN_GARDENER_PLANT",
            seconds: 15,
            text: "Cauta rame",
            // minigame: MINIGAME_TYPE.DRILL // sau orice alt tip vrei să folosești

        },
        blip: {
            id: 270,
            color: 1,
        },
        pos: [
            { x: -1932.23, y: 2657.31, z: 2.70 },
            { x: -1940.75, y: 2648.66, z: 2.94 },
            { x: -1935.33, y: 2638.59, z: 3.35 },
            { x: -1919.00, y: 2638.97, z: 2.85 },
            { x: -1912.67, y: 2629.28, z: 2.89 },
            { x: -1886.56, y: 2622.97, z: 2.80 },
            { x: -1878.77, y: 2623.67, z: 1.61 },
            { x: -1879.66, y: 2612.17, z: 1.62 },
            { x: -1889.41, y: 2605.52, z: 2.23 },
            { x: -1897.58, y: 2606.11, z: 2.81 },
            { x: -1904.44, y: 2610.28, z: 2.93 },
            // (restul pozitiilor aici daca vrei toate)
        ]
    },
];
