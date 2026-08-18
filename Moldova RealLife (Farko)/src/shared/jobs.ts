import { langStringDefault } from "./lang/index";
import {MINIGAME_TYPE} from "./minigame";
import {TAXI_CONF} from "./taxi";
import {ORDER_MENU_POS} from "./order.system";
import {GR6_BASE_POS} from "./gr6";
import {LEVEL_PERMISSIONS} from "./level.permissions";

export interface IJobUserMenu {
    img: string,
    title: string,
    lvl: number,
    maxLvl: number,
    exp: number,
    maxExp: number,
}

interface jobPointTaskBase {
    /** Координата X */
    x: number;
    /** Координата Y */
    y: number;
    /** Координата Z */
    z: number;
    /** Угол поворота тела, в который станет игрок когда достигнет точки */
    h?: number;
    /** Текст уведомления, которое отобразится при достижении точки */
    entertext?: string;
    /** Текст уведомления, которое отобразится при УСПЕШНОМ завершении точки */
    successtext?: string;
    /** Сценарий, который автоматически начнёт воспроизводится при достижении точки, если не указать - то игрок будет просто стоять */
    task?: string | [string, string];
    /** Время в секундах, которое игрок проведёт на точке, по умолчанию время не указано, а значит что точка будет сразу засчитана игроку. */
    time?: number;


}
export interface jobPointTaskPointItem extends jobPointTaskBase {
    /** Текст уведомления, которое отобразится при УСПЕШНОМ завершении точки */
    successtext?: string;
    /** Текст уведомления, которое отобразится при ПРОВАЛЬНОМ завершении точки */
    failtext?: string;
    /** Название мини-игры, в которую необходимо сыграть и выиграть для того, чтобы точка была пройдена успешно */
    minigame?: MINIGAME_TYPE;

}
export interface jobPointTaskStartItem extends jobPointTaskBase {
    /** Текст уведомления, которое отобразится при ПРОВАЛЬНОМ завершении точки */
    failtext?: string;
    // /** Название мини-игры, в которую необходимо сыграть и выиграть для того, чтобы точка была пройдена успешно */
    minigame?: MINIGAME_TYPE;
}

interface TaskItemBase {
    /** Название задание */
    name: string,
    /** Необходимый уровень, если требуется 1 или выше */
    level?: 1 | 2 | 3 | 4,
    /** Описание задания */
    desc: string;
    /** Награда за одно выполненое задание */
    money: number;
    /** Количество единиц опыта, которые даються за выполнение */
    exp: number;
    /** Точки, которых необходимо достигнуть игроку */
    points: jobPointTaskPointItem[],
    /** Тип работы (0 - Просто бегать по точкам, 1 - от одной точки до другой)
     * @description 0 Подходит например для стройки, то есть просто расставленные точки, игрок по ним ходит и херачит молотком, 1 - это допустим что то отвезти, в одной точке он берёт заказ, в другую относит
     * Точки берутся случайным образом из массивов
     */
    type: 0 | 1,
}
export interface TaskItem0 extends TaskItemBase {
    type: 0,
}
export interface TaskItem1 extends TaskItemBase {
    type: 1,
    /** Точки, которые будут конечными, они необходимы при type = 1, то есть от одной точки до другой */
    pointsEnd: jobPointTaskStartItem[],
}

export interface jobData {
    /** Спрайт для меню работы */
    sprite?: string;
    /** Если нужно разместить метку на карте */
    icon?: number;
    /** Цвет иконки на карте */
    icon_color?: number;
    /** Короткий ID работы для технической обработки, а так же по нему будет  */
    id: JobId;
    /** Название работы
     * @example Стройка, Мойка окон
     */
    name: string;
    /** Местоположение, где происходит трудоустройство */
    pos: { x: number, y: number, z: number };
    /** Короткое описание работы */
    desc: string;
    /** Подробное описание работы */
    full_desc: string;
    tasks: (TaskItem0 | TaskItem1)[];
    /** Награда за 100% опыт работы */
    maxLevelReward?: number;
    /** Разрешить использовать ТС на маркере */
    allowVehicle?:boolean;
    /** Ограничение по квесту */
    quest?: {
        /** ID квеста */
        id: number,
        /** Квест должен быть завершён?
         * 0 - Должен быть активным, но не завершённым
         * 1 - Должен быть завершённым
         * 2 - Любой вариант
         */
        completed: 0 | 1 | 2
    };
    /** Гардероб работы. Применяется автоматически на персонажа */
    dressMale?:[number, number, number][];
    /** Гардероб работы. Применяется автоматически на персонажа */
    dressFemale?:[number, number, number][];
}

export const JOBS_ADVANCED_LIST: {
    id: JobId, // <-- AICI

    /** Название */
    name: string,
    /** Короткое описание */
    desc: string,
    /** Полное описание */
    descFull: string,
    pos: {
        x: number,
        y: number
    }
}[] = [
        {
            id: "taxi",
            name: 'Taxi',
            desc: `ore necesare ${LEVEL_PERMISSIONS.TAXI}`,
            descFull: `1. Obtine permis categoria B.\n2. Mergi la taximetristi si angajeaza-te.\n3. Inchiriaza masina si incepe munca.\nApasa tasta G langa masina pentru comenzi.\nCastig: 50$/km (jucatori), 90$/km (NPC).`,
            pos: TAXI_CONF.npc.pos
        },
        {
            id: "miner",
            name: 'Miner',
            desc: `ore necesare  ${LEVEL_PERMISSIONS.MINER}`,
            descFull: `1. Mergi la cariera pentru a incepe munca.\n3. Poti extrage piatra bruta si carbune.\n4. Dupa colectare, alege: vinde pietrele direct sau du-le la spalatorie pentru a obtine minereuri rare.`,
            pos: { x: 2921.46, y: 2789.13 }
        },
        {
            id: "tirist",
            name: 'Tirist',
            desc: `ore necesare ${LEVEL_PERMISSIONS.DELIVER}`, //
            descFull: `1. Obtine permis marfa.\n2. Mergi la centrul de livrari si inchiriaza un camion.\n3. Alege comanda si mergi la incarcare.\nNiveluri: mic (500$), mediu (1000$), mare (1500$) cu livrari intre 1350-2250$.`,
            pos: ORDER_MENU_POS[0]
        },
        {
            id: "grupeg6",
            name: 'Gruppe Sechs',
            desc: `ore necesare ${LEVEL_PERMISSIONS.GR6}`,
            descFull: `1. Obtine permis marfa.\n2. Mergi la baza Gruppe Sechs.\n3. Creeaza sau intra intr-o echipa (minim 2 persoane).\n4. Ridica sarcini si urmeaza ruta.\n5. Intoarce-te la baza pentru descarcare.`,
            pos: GR6_BASE_POS
        },
        {
            id: "vanator",
            name: 'Vanator',
            desc: `ore necesare ${LEVEL_PERMISSIONS.HUNTING}`,
            descFull: `1. Obtine licenta de vanator de la primarie.\n2. Mergi la locatia de vanator marcata pe harta.\n3. Ia echipamentul necesar de la NPC-ul de vanator.\n4. Mergi la punctele de vanatoare marcate pe harta.\n5. Vaneaza animalele si du-te la piata pentru a le vinde.`,
            pos: { x: -674.61, y: 5837.94 }
        },
        {
            id: "electrician",
            name: 'Electrician',
            desc: `ore necesare ${LEVEL_PERMISSIONS.ELECTRICIAN}`,
            descFull: `1. Mergi la statia electrica, alege nivelul dorit.\nSalariul creste in functie de nivel.`,
            pos: { x: 726.75, y: 138.48 }
        },
        {
            id: "busman",
            name: 'Sofer Autobuz',
            desc: `ore necesare ${LEVEL_PERMISSIONS.BUSSMAN}`,
            descFull: `1. Obtine permis categoria C.\n2. Mergi la depoul de autobuze si angajeaza-te.\nSalariul creste in functie de nivel.`,
            pos: { x: 425.91, y: -621.62 }
        },
        {
            id: "scafandru",
            name: 'Scafandru',
            desc: `ore necesare ${LEVEL_PERMISSIONS.SCAFANDRU}`,
            descFull: `1. Este necesar un echipament special, pe care il poti procura de la magazinul 24/7.\n2. Dupa ce ai echipamentul, deplaseaza-te la locatia jobului.\n3. Acolo vei primi instructiuni si punctele unde trebuie sa mergi pentru scufundari.`,
            pos: { x: -206.81, y: 6573.75 }
        },
        {
            id: "fisher",
            name: 'Pescar',
            desc: `ore necesare ${LEVEL_PERMISSIONS.PESCAR}`,
            descFull: `1. Este necesara o undita, pe care o poti procura de la magazinul 24/7.\n2. Ai nevoie de rame, care pot fi gasite la mlastina.\n3. Iti mai trebuie o lopata, pe care o poti achizitiona tot de la magazinul 24/7.\n4. Dupa ce ai obtinut rame, mergi la locatiile marcate pe harta pentru a pescui.\n5. Unele locatii necesita licenta de pescuit, altele nu.`,
            pos: { x: -1845.52, y: -1253.82 }
        },
        {
            id: "garbage",
            name: 'Gunoier',
            desc: `ore necesare ${LEVEL_PERMISSIONS.GARBAGE}`,
            descFull: 'Colecteaza gunoaie.',
            pos: { x: 2406.58, y: 3128.59 }
        },
        {
            id: "builder",
            name: 'Constructii',
            desc: `ore necesare ${LEVEL_PERMISSIONS.CONSTRUCTOR}`,
            descFull: `Lucreaza pe santier, sudeaza si ridica experienta pentru un castig mai bun.`,
            pos: { x: -514.41, y: -1003.46 }
        },
        {
            id: "garden",
            name: 'Gradinarit',
            desc: `ore necesare ${LEVEL_PERMISSIONS.GRADINAR}`,
            descFull: `Culege portocale, uda copacii sau chiar taie frunzele. Ridica experienta pentru un castig mai mare.`,
            pos: { x: 2411.82, y: 4997.14 }
        },
        {
            id: "cleaning",
            name: 'Spalator Ferestre',
            desc: `ore necesare ${LEVEL_PERMISSIONS.GEAMURI}`,
            descFull: `Spala ferestrele din oras.`,
            pos: { x: -1535.08, y: -454.33 }
        },
        {
            id: "marihuana",
            name: 'Dealer Marihuana',
            desc: `ore necesare ${LEVEL_PERMISSIONS.MARIHUANA}`,
            descFull: `Culege si impacheteaza substantele interzise.`,
            pos: { x: 1966.38, y: 5184.25 }
        },
        {
            id: "dealer",
            name: 'Dealer Casino',
            desc: `ore necesare ${LEVEL_PERMISSIONS.CASINO_DEALER}`,
            descFull: `La acest job trebuie sa lucrezi la mesele de joc din casino.`,
            pos: { x: 920.23, y: 53.30 }
        }
    ]

export type JobId = "builder" | "garden" | "miner" | "cleaning" | "marihuana" | "electrician" | "busman" | "fisher" | "dealer" | "garbage" | "taxi" | "scafandru"  | "grupeg6" | "tirist" | "vanator"

export const jobsList: jobData[] = [
    {
        icon: 566, icon_color: 0, id: "builder", name: langStringDefault("jobs.43528a804984a9a23ab9b4a2e2e3fd01"),
        dressMale:
        [   [3,0,0],
            [8,1,0],
            [11,1,1],
            [1,0,0],
            [4,90,2],
            [6,24,0],
        ],
        dressFemale: [
            [3,0,0],
            [8,1,1],
            [11,88,0],
            [1,0,0],
            [4,93,1],
            [6,66,0],
            [100,120,0],
            [101,5,0],
            [106,1,0],
        ]
        , pos: { x: -510.23, y: -1002.15, z: 22.55 }, desc: langStringDefault("jobs.8b5f07596a2db1cfad650772317bc07f"), full_desc: langStringDefault("jobs.fullDescBau"), tasks: [
            {
                name: langStringDefault("jobs.4cffaa3b19054eabab0aacfa9ef65c82"), level: 2, desc: langStringDefault("jobs.0f150a3eb609980648d77a0390be5c13"), money: 60, type: 0, points: [
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "loop"], x: -444.91, y: -911.71, z: 46.98, h: 176, minigame: MINIGAME_TYPE.HAMMER },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "loop"], x: -442.60, y: -914.41, z: 46.98, h: 2, minigame: MINIGAME_TYPE.HAMMER },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "loop"], x: -443.35, y: -947.16, z: 46.98, h: 271, minigame: MINIGAME_TYPE.HAMMER },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "loop"], x: -441.94, y: -958.93, z: 46.98, h: 186, minigame: MINIGAME_TYPE.HAMMER },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "loop"], x: -441.96, y: -950.26, z: 46.98, h: 359, minigame: MINIGAME_TYPE.HAMMER },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "loop"], x: -441.84, y: -943.23, z: 46.98, h: 181, minigame: MINIGAME_TYPE.HAMMER },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "loop"], x: -457.85, y: -934.86, z: 46.98, h: 276, minigame: MINIGAME_TYPE.HAMMER },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "loop"], x: -454.49, y: -953.39, z: 46.98, h: 93, minigame: MINIGAME_TYPE.HAMMER },
                ], exp: 1
            },
            {
                name: langStringDefault("jobs.afa82e3aa6236b25642fcd6ebe28b0c3"), desc: langStringDefault("jobs.54bffdb4ec9ce6ddce87cca91a8d8bda"), money: 80, type: 0, points: [
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -442.26, y: -967.70, z: 24.90, h: 277, minigame: MINIGAME_TYPE.BOX },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -469.23, y: -957.04, z: 28.39, h: 87, minigame: MINIGAME_TYPE.BOX },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -470.11, y: -926.19, z: 28.39, h: 70, minigame: MINIGAME_TYPE.BOX },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -469.33, y: -957.05, z: 37.68, h: 79, minigame: MINIGAME_TYPE.BOX }
                ], exp: 1
            },
            {
                name: langStringDefault("jobs.9f5a0410b8780763bff4087c52980ca6"), level: 1, desc: langStringDefault("jobs.f7a84f6c39e35da891f00d363626e3ec"), money: 130, type: 0, points: [
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -444.26, y: -959.21, z: 46.98, h: 191, minigame: MINIGAME_TYPE.DRILL },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -442.56, y: -914.43, z: 46.98, h: 359, minigame: MINIGAME_TYPE.DRILL },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -442.56, y: -914.43, z: 46.98, h: 359, minigame: MINIGAME_TYPE.DRILL },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -468.42, y: -931.28, z: 37.68, h: 91, minigame: MINIGAME_TYPE.DRILL },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -460.90, y: -944.20, z: 37.69, h: 88, minigame: MINIGAME_TYPE.DRILL },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -442.86, y: -952.68, z: 37.68, h: 270, minigame: MINIGAME_TYPE.DRILL }
                ], exp: 1
            },
            {
                name: langStringDefault("jobs.528ca3526bded074a7f79947f080a80a"), desc: langStringDefault("jobs.0d68afe8f847f31cf4caa639955d241d"), money: 160, type: 0, points: [
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -459.80, y: -947.70, z: 28.39, h: 28, minigame: MINIGAME_TYPE.SVARKA },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -458.70, y: -909.92, z: 28.39, h: 97, minigame: MINIGAME_TYPE.SVARKA },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -471.68, y: -954.96, z: 46.83, h: 18, minigame: MINIGAME_TYPE.SVARKA },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -471.79, y: -952.09, z: 46.83, h: 180, minigame: MINIGAME_TYPE.SVARKA },
                ], exp: 1
            },
            {
                name: langStringDefault("jobs.94c4c6468d04a7a9c987a17fb805e9ee"), level: 3, desc: langStringDefault("jobs.5a8f33cf3dc43ce976d271923b0d4bd8"), money: 180, type: 0, points: [
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -490.35, y: -1020.24, z: 28.13, h: 95, minigame: MINIGAME_TYPE.WIRES },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -482.00, y: -1039.10, z: 28.13, h: 146, minigame: MINIGAME_TYPE.WIRES },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -456.90, y: -954.85, z: 28.39, h: 357, minigame: MINIGAME_TYPE.WIRES },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -447.36, y: -895.61, z: 28.39, h: 5, minigame: MINIGAME_TYPE.WIRES },
                    { time: 1, task: ["missheistdockssetup1ig_4@end_idle", "floyd_fellpackage_endidle_dockworker1"], x: -448.45, y: -889.57, z: 28.39, h: 182, minigame: MINIGAME_TYPE.WIRES },
                ], exp: 1
            },

        ]
    },
    {
        icon: 486, icon_color: 81,
        dressMale:
        [
            [3,0,0],
            [8,5,0],
            [11,135,4],
            [1,0,0],
            [4,27,7],
            [6,1,11],

        ],
        dressFemale: [
            [3,0,0],
            [8,2,0],
            [11,17,0],
            [4,74,4],
            [6,1,8],
            [100,120,0],
            [101,5,0],
            [106,1,0],
        ],
         id: "garden", name: langStringDefault("jobs.1eab3d808d6d6e52508dead2a51e7c66"), pos: { x: 2411.83, y: 4997.15, z: 45.58 }, desc: langStringDefault("jobs.2f8e2250520d3e7d9bc42d05508693b1"), full_desc: langStringDefault("jobs.FullDescOrange"), tasks: [
            {
                name: langStringDefault("jobs.cc733d6a5828683a9cd9e4f9c48b3b2b"), desc: langStringDefault("jobs.bc1c7b68d26bfdba85f25b26f4d72b8b"), money: 28, type: 0, points: [
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2391.99, y: 5005.22, z: 44.81, h: 103, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2389.22, y: 4993.22, z: 44.14, h: 225, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2375.40, y: 4989.58, z: 43.16, h: 120, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2362.66, y: 4989.22, z: 42.39, h: 109, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2350.44, y: 4989.71, z: 42.05, h: 101, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2349.23, y: 4977.19, z: 41.78, h: 179, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2336.99, y: 4976.33, z: 41.62, h: 108, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2319.72, y: 4984.13, z: 40.75, h: 81, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2317.54, y: 4993.46, z: 41.04, h: 24, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2305.19, y: 4997.62, z: 41.33, h: 140, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2315.89, y: 5007.79, z: 41.52, h: 310, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2329.68, y: 5021.01, z: 41.87, h: 323, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2341.64, y: 5034.33, z: 43.27, h: 344, minigame: MINIGAME_TYPE.ORANGE },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2330.32, y: 5037.36, z: 43.46, h: 109, minigame: MINIGAME_TYPE.ORANGE },
                ], exp: 1
            },
            {
                name: langStringDefault("jobs.94d053594407a95841d2cfaa6f052f72"), level: 1,  desc: langStringDefault("jobs.695d2a374ecd2bbdeae66315b7b2889d"), money: 43, type: 0, points: [
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2391.99, y: 5005.22, z: 44.81, h: 103, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2389.22, y: 4993.22, z: 44.14, h: 225, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2375.40, y: 4989.58, z: 43.16, h: 120, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2362.66, y: 4989.22, z: 42.39, h: 109, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2350.44, y: 4989.71, z: 42.05, h: 101, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2349.23, y: 4977.19, z: 41.78, h: 179, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2336.99, y: 4976.33, z: 41.62, h: 108, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2319.72, y: 4984.13, z: 40.75, h: 81, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2317.54, y: 4993.46, z: 41.04, h: 24, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2305.19, y: 4997.62, z: 41.33, h: 140, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2315.89, y: 5007.79, z: 41.52, h: 310, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2329.68, y: 5021.01, z: 41.87, h: 323, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2341.64, y: 5034.33, z: 43.27, h: 344, minigame: MINIGAME_TYPE.SCISSORS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2330.32, y: 5037.36, z: 43.46, h: 109, minigame: MINIGAME_TYPE.SCISSORS },
                ], exp: 1
            },
            {
                name: langStringDefault("jobs.b1e9d4c6fa8c1097cc43201cbcb6d4c7"), level: 2, desc: langStringDefault("jobs.f90025cb0f403df88b8d05a0b7a2e75d"), money: 55, type: 0, points: [
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2391.99, y: 5005.22, z: 44.81, h: 103, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2389.22, y: 4993.22, z: 44.14, h: 225, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2375.40, y: 4989.58, z: 43.16, h: 120, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2362.66, y: 4989.22, z: 42.39, h: 109, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2350.44, y: 4989.71, z: 42.05, h: 101, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2349.23, y: 4977.19, z: 41.78, h: 179, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2336.99, y: 4976.33, z: 41.62, h: 108, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2319.72, y: 4984.13, z: 40.75, h: 81, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2317.54, y: 4993.46, z: 41.04, h: 24, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2305.19, y: 4997.62, z: 41.33, h: 140, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2315.89, y: 5007.79, z: 41.52, h: 310, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2329.68, y: 5021.01, z: 41.87, h: 323, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2341.64, y: 5034.33, z: 43.27, h: 344, minigame: MINIGAME_TYPE.WATERPOT },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2330.32, y: 5037.36, z: 43.46, h: 109, minigame: MINIGAME_TYPE.WATERPOT },
                ], exp: 1
            },


        ]
    },
    {
        icon: 537, icon_color: 38,
        dressMale:
        [
            [3,0,0],
            [8,15,0],
            [11,9,10],
            [4,7,2],
            [6,8,0],

        ],
        dressFemale: [
            [3,14,0],
            [8,2,0],
            [11,14,14],
            [4,11,7],
            [6,4,2],
            [100,120,0],
            [101,5,0],
            [106,1,0],
        ],
         id: "cleaning", name: langStringDefault("jobs.2e6165b55f6d62d4247dd7b75b619d33"), pos: { x: -1534.21, y: -452.88, z: 34.888 }, desc: langStringDefault("jobs.59a8107bcd68fa516f5806a57b32a426"), full_desc: langStringDefault("jobs.fullDescWindow"), tasks: [
            {
                name: langStringDefault("jobs.6688e62c4a727c6de54bfb6341ce4296"), desc: langStringDefault("jobs.19c532d5aad3cfe6bf71cc4f2c8bdbe3"), money: 85, type: 0, points: [
                    { time: 1, task: ["amb@world_human_maid_clean@", "base"], x: -1536.07, y: -457.72, z: 39.52, h: 138, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ["amb@world_human_maid_clean@", "base"], x: -1538.97, y: -455.77, z: 39.52, h: 135, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ["amb@world_human_maid_clean@", "base"], x: -1541.56, y: -453.25, z: 39.52, h: 129, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ["amb@world_human_maid_clean@", "base"], x: -1544.90, y: -450.59, z: 39.52, h: 129, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ["amb@world_human_maid_clean@", "base"], x: -1551.37, y: -448.14, z: 39.52, h: 137, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ["amb@world_human_maid_clean@", "base"], x: -1555.72, y: -444.26, z: 39.52, h: 138, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ["amb@world_human_maid_clean@", "base"], x: -1551.55, y: -438.94, z: 39.52, h: 42, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ["amb@world_human_maid_clean@", "base"], x: -1547.47, y: -434.68, z: 34.88, h: 46, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ["amb@world_human_maid_clean@", "base"], x: -1548.89, y: -436.27, z: 34.88, h: 64, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ["amb@world_human_maid_clean@", "base"], x: -1550.50, y: -438.00, z: 34.88, h: 49, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ["amb@world_human_maid_clean@", "base"], x: -1543.59, y: -444.94, z: 34.88, h: 138, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ["amb@world_human_maid_clean@", "base"], x: -1538.21, y: -449.19, z: 34.88, h: 136, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ["amb@world_human_maid_clean@", "base"], x: -1536.21, y: -451.25, z: 34.88, h: 139, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ["amb@world_human_maid_clean@", "base"], x: -1530.74, y: -455.80, z: 34.88, h: 136, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ["amb@world_human_maid_clean@", "base"], x: -1533.02, y: -461.35, z: 34.41, h: 25, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ["amb@world_human_maid_clean@", "base"], x: -1534.67, y: -463.12, z: 34.41, h: 35, minigame: MINIGAME_TYPE.WINDOW },
                    { time: 1, task: ["amb@world_human_maid_clean@", "base"], x: -1538.46, y: -465.82, z: 34.41, h: 32, minigame: MINIGAME_TYPE.WINDOW },
                ], exp: 1
            },
        ]
    },
    {
        icon: 140, icon_color: 11,
        dressMale:
        [
            [3,4,0],
            [8,15,0],
            [11,65,1],
            [4,38,1],
            [6,14,0],
            [100,11,0],
            [102,33,0],
            [106,2,0],

        ],
        dressFemale: [
            [3,3,0],
            [8,2,0],
            [11,59,1],
            [4,38,1],
            [6,66,4],
            [100,120,0],
            [101,5,0],
        ],
         id: "marihuana", name: langStringDefault("jobs.10f6bbafd9d6d90571ad967244ecbc82"), pos: { x: 1966.38, y: 5184.26, z: 46.95 }, desc: langStringDefault("jobs.7d914f3376f4b63ee4ad3b23e87207c5"), full_desc: langStringDefault("jobs.fullDescGarageTony"), tasks: [
            {
                name: langStringDefault("jobs.28297d786118c635be026c43328c1903"), desc: langStringDefault("jobs.244cc8621b04237c6b09a24145b3880d"), money: 55, type: 0, points: [
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1938.76, y: 5175.07, z: 47.00, h: 88, minigame: MINIGAME_TYPE.GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1938.75, y: 5176.46, z: 47.00, h: 91, minigame: MINIGAME_TYPE.GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1938.65, y: 5177.78, z: 47.00, h: 91, minigame: MINIGAME_TYPE.GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1938.60, y: 5179.11, z: 47.00, h: 92, minigame: MINIGAME_TYPE.GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1938.55, y: 5180.86, z: 47.00, h: 92, minigame: MINIGAME_TYPE.GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1938.44, y: 5182.25, z: 47.00, h: 76, minigame: MINIGAME_TYPE.GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1938.21, y: 5184.05, z: 47.00, h: 80, minigame: MINIGAME_TYPE.GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1940.52, y: 5183.99, z: 47.00, h: 359, minigame: MINIGAME_TYPE.GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1939.30, y: 5184.02, z: 47.00, h: 9, minigame: MINIGAME_TYPE.GRASS },
                ], exp: 1
            },
            {
                name: langStringDefault("jobs.6970d2816e9fc74b1d764bc8cc4e57c4"), level: 1,  desc: langStringDefault("jobs.ded6ca825379b994ba9ff52dfd0ee306"), money: 90, type: 0, points: [
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"],x: 1994.96, y: 5128.82, z: 43.16, h: 226, minigame: MINIGAME_TYPE.SCISSORS_GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1996.32, y: 5130.33, z: 43.42, h: 243, minigame: MINIGAME_TYPE.SCISSORS_GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1998.28, y: 5132.49, z: 43.82, h: 235, minigame: MINIGAME_TYPE.SCISSORS_GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1998.28, y: 5132.49, z: 43.82, h: 235, minigame: MINIGAME_TYPE.SCISSORS_GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2001.56, y: 5136.09, z: 44.42, h: 232, minigame: MINIGAME_TYPE.SCISSORS_GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2003.37, y: 5137.75, z: 44.72, h: 229, minigame: MINIGAME_TYPE.SCISSORS_GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2004.78, y: 5139.40, z: 44.98, h: 239, minigame: MINIGAME_TYPE.SCISSORS_GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2006.44, y: 5140.96, z: 45.21, h: 249, minigame: MINIGAME_TYPE.SCISSORS_GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 2009.94, y: 5144.05, z: 45.65, h: 277, minigame: MINIGAME_TYPE.SCISSORS_GRASS },
                ], exp: 1
            },
            {
                name: langStringDefault("jobs.35a726d567eb0b7fee9bfa0fa33e0a78"), level: 2, desc: langStringDefault("jobs.e452cb13ab673791011565c7b446d9a4"), money: 130, type: 0, points: [
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1944.76, y: 5178.13, z: 47.00, h: 0, minigame: MINIGAME_TYPE.BOX_GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1947.15, y: 5177.98, z: 47.00, h: 359, minigame: MINIGAME_TYPE.BOX_GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1950.39, y: 5178.00, z: 47.00, h: 1, minigame: MINIGAME_TYPE.BOX_GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1952.98, y: 5178.04, z: 47.00, h: 0, minigame: MINIGAME_TYPE.BOX_GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1952.73, y: 5183.04, z: 47.00, h: 179, minigame: MINIGAME_TYPE.BOX_GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1950.33, y: 5183.08, z: 47.00, h: 180, minigame: MINIGAME_TYPE.BOX_GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1947.02, y: 5183.03, z: 47.00, h: 180, minigame: MINIGAME_TYPE.BOX_GRASS },
                    { time: 1, task: ["amb@code_human_wander_texting@male@base", "static"], x: 1944.37, y: 5182.98, z: 47.00, h: 181, minigame: MINIGAME_TYPE.BOX_GRASS },
                ], exp: 1
            },
        ]
    }
]

export const getJobData = (id: JobId) => {
    return jobsList.find(q => q.id === id);
}


export function getJobName(jobId: JobId): string;
export function getJobName(job: jobData): string;
export function getJobName(item: jobData | JobId) {
    const data = typeof item === "string" ? getJobData(item) : item;
    if (!data) return null;
    return data.name
}

export const JOB_MAX_EXP = 1000;


export const getLevelByExp = (exp: number) => {
    if (typeof exp !== "number") return 0;
    if (exp == 1000) return 4;
    if (exp >= 300) return 3;
    if (exp >= 200) return 2;
    if (exp >= 100) return 1;
    return 0;
}