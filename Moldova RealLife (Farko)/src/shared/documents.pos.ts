import { langStringDefault } from "./lang/index";
import {DocumentId} from "./documents";
import {LicenceType} from "./licence";

/** Сколько процентов будет отдано игроку. Остаток упадёт в сейф фракции */
export const DOCUMENT_GIVE_MONEY_FOR_PLAYER_PERCENT = 30;

export const DOCUMENT_GIVE_POSITIONS: {
    /** Название маркера */ name: string;
    /** Местоположение (обычный маркер) */ pos: Vector3Mp;
    /** Справки, которые можно выдать */ documents?: { id: DocumentId, cost: number}[];
    /** Лицензии, которые можно выдать */ license?: {id: LicenceType, cost: number, days: number}[];
    /** Предметы, которые можно выдать */ items?: {id: number, cost: number}[];
    /** Член какой фракции имеет доступ */ fraction: number;
    /** Какой минимальный ранг требуется чтобы иметь доступ */ rank: number;
}[] = [
    {
        name: langStringDefault("documents.pos.5d9acd74a8de747d3ce70ce2121693df"),
        pos: new mp.Vector3(450.62, -973.74, 29.69),
        documents: [
            {id: "weapon_theory" , cost: 10000 }
        ],
        items: [{id: 824,cost:1000}],


        fraction: 2, rank: 7
    },
    { 
        name: langStringDefault("documents.pos.6d41b2e8911342a4b077e85079c76147"),
        pos: new mp.Vector3(317.55, -589.85, 42.26),  // 317.55, -589.85, 43.26
        documents: [
            {id: "mental_examination_ok" , cost: 5000 },
            {id: "mental_examination_middle" , cost: 5000 },
            {id: "phisical_examination_ok" , cost: 5000 },
        ],
        license: [
            {id: "med", cost: 15000, days: 30},
            {id: "reanimation", cost: 100000, days: 30}
        ],
        items: [{id: 824,cost:1000}],
        fraction: 16, rank: 7
    },
    { 
        name: langStringDefault("documents.pos.8a076e320bafe8d8eabf0da1fbf251fc"),
        pos: new mp.Vector3(-538.15, -196.20, 37.23),
        license: [
            {id: "fishsell", cost: 5000, days: 30},
            {id: "fishrod", cost: 5000, days: 30},
            {id: "biz", cost: 15000, days: 30},
            {id: "advokat", cost: 35000, days: 30},
            {id: "hunting", cost: 5000, days: 15},
        ],
        items: [{id: 824,cost:1000}],
        fraction: 1, rank: 7
    },
    { 
        name: langStringDefault("documents.pos.191c3008a98f86055923965bf88fd525"),
        pos: new mp.Vector3(-250.35, 6312.85, 31.43),
        documents: [
            {id: "mental_examination_ok" , cost: 5000 },
            {id: "mental_examination_middle" , cost: 5000 },
            {id: "phisical_examination_ok" , cost: 5000 },
        ],
        license: [
            {id: "med", cost: 15000, days: 30},
            {id: "reanimation", cost: 100000, days: 30}
        ],
        items: [{id: 824,cost:1000}],
        fraction: 16, rank: 7
    },
    {
        name: langStringDefault("documents.pos.4c150c3e0211de5dfd6cd1efd33926aa"),
        pos: new mp.Vector3(1858.27, 3697.67, 33.27),
        documents: [
            {id: "weapon_theory" , cost: 10000 }
        ],
        items: [{id: 824,cost:1000}],
        
        fraction: 7, rank: 7
    },
    {
        name: langStringDefault("documents.pos.9f30b8e500d0a3b0697aaafb713f5579"),
        pos: new mp.Vector3(-442.12, 6006.53, 30.72),
        documents: [
            {id: "weapon_theory" , cost: 10000 }
        ],
        items: [{id: 824,cost:1000}],
        fraction: 7, rank: 7
    },
    { 
        name: langStringDefault("documents.pos.e95669ddae4123678af2c99c5b851d34"),
        pos: new mp.Vector3(259.97, -1359.23, 23.54),
        documents: [
            {id: "mental_examination_ok" , cost: 5000 },
            {id: "mental_examination_middle" , cost: 5000 },
            {id: "phisical_examination_ok" , cost: 5000 },
        ],
        license: [
            {id: "med", cost: 15000, days: 30},
            {id: "reanimation", cost: 100000, days: 30}
        
        ],
        items: [{id: 824,cost:1000}],
        fraction: 16, rank: 7
    },
    { 
        name: langStringDefault("documents.pos.105d2dc0a1e61383352f185566cdb112"),
        pos: new mp.Vector3(304.57, -571.70, 85.93),
        documents: [
            {id: "mental_examination_ok" , cost: 5000 },
            {id: "mental_examination_middle" , cost: 5000 },
            {id: "phisical_examination_ok" , cost: 5000 },
        ],
        license: [
            {id: "med", cost: 15000, days: 30},
            {id: "reanimation", cost: 100000, days: 30}
        ],
        items: [{id: 824,cost:1000}],
        fraction: 16, rank: 7
    },
    { 
        name: langStringDefault("documents.pos.bc65d472f296e258a1cc2242eb5b51b2"),
        pos: new mp.Vector3(356.34, -601.91, 43.28),
        documents: [
        {id: "mental_examination_ok" , cost: 5000 },
        {id: "mental_examination_middle" , cost: 5000 },
        {id: "phisical_examination_ok" , cost: 5000 },
    ],
    license: [
        {id: "med", cost: 15000, days: 30},
        {id: "reanimation", cost: 100000, days: 30}
    ],
        items: [{id: 824,cost:1000}],
        fraction: 16, rank: 7
    },
    { 
        name: langStringDefault("documents.pos.5a247aeb970a8a5ebbac1b60d8525610"),
        pos: new mp.Vector3(-2353.04, 3263.80, 31.81),
        
        license: [
            {id: "military", cost: 10000, days: 30},
            {id: "air", cost: 15000, days: 30}
        ],
        
        fraction: 4, rank: 13
    },
    {
        name: langStringDefault("documents.pos.eddc3c222c489a04884c8cc8120ed999"),
        pos: new mp.Vector3(2509.55, -443.80, 105.91),
        items: [{id: 824,cost:1000}],
        
        fraction: 3, rank: 6
    },
    { 
        name: langStringDefault("documents.pos.e48fe12377954d9a51dfa91c52bf0f00"),
        pos: new mp.Vector3(1830.10, 3673.16, 33.27),
        documents: [
            {id: "mental_examination_ok" , cost: 5000 },
            {id: "mental_examination_middle" , cost: 5000 },
            {id: "phisical_examination_ok" , cost: 5000 },
        ],
        license: [
            {id: "med", cost: 15000, days: 30},
            {id: "reanimation", cost: 100000, days: 30}
        ],
        items: [{id: 824,cost:1000}],
        fraction: 16, rank: 7
    },
    ]