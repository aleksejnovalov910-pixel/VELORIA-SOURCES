import { FACTION_ID } from "./fractions";
import { LicenceType } from "./licence";

export interface NpcSeller {
    name: string;
    model: string;
    pos: Vector3Mp;
    heading: number;
    items: {
        item: number;
        cost: number | [number, number];
        max: number;
        start: number;
        perhour: number;
        dirtyMoney?: boolean; // ✅ dacă true -> cere bani murdari, altfel bani curați
    }[];
    dimension: number;
    license?: LicenceType;          // ✅ licența necesară (opțional)
    factions?: FACTION_ID[];        // ✅ acces pe facțiuni (opțional)
    forFamily?: boolean;            // ✅ acces doar pentru membri de familie
    blip?: { id: number; color: number }; // ✅ marker pe hartă
    partToFraction?: number;        // ✅ procent pentru seiful facțiunii
    minHours?: number; // ✅ numar minim de ore necesare

}

export const NPC_SELLERS_LIST: NpcSeller[] = [
    {
        name: "Vadim",
        model: "s_m_y_dealer_01",
        pos: new mp.Vector3(1984.88, 5175.11, 47.64),
        heading: 101,
        items: [
            { item: 40103, cost: [100, 150], max: 0, start: 1000, perhour: 500, dirtyMoney: true },
            { item: 40104, cost: [100, 150], max: 0, start: 1000, perhour: 500, dirtyMoney: true },
            { item: 40105, cost: [150, 200], max: 0, start: 1000, perhour: 500, dirtyMoney: true },
            { item: 40126, cost: [150, 200], max: 0, start: 1000, perhour: 500, dirtyMoney: true },
            { item: 40154, cost: [150, 200], max: 0, start: 1000, perhour: 500, dirtyMoney: true },
            { item: 40155, cost: [150, 200], max: 0, start: 1000, perhour: 500, dirtyMoney: true },
            { item: 55, cost: [150, 200],  max: 0, start: 1000, perhour: 500, dirtyMoney: true },
            { item: 859, cost: [1000, 1350],  max: 0, start: 1000, perhour: 500, dirtyMoney: true },
            { item: 858, cost: [1000, 1450],  max: 0, start: 1000, perhour: 500, dirtyMoney: true },
            { item: 813, cost: [1000, 1450],  max: 0, start: 1000, perhour: 500, dirtyMoney: true },
            { item: 857, cost: [1000, 1500],  max: 0, start: 1000, perhour: 500, dirtyMoney: true },
        ],
        dimension: 0,
        factions: [21, 19, 22, 18, 20],
        blip: { id: 362, color: 1 }
    },
    {
        name: "Job Vanator",
        model: "s_m_m_prisguard_01",
        pos: new mp.Vector3(-674.61, 5837.94, 17.34),
        heading: 136,
        items: [
            { item: 528, cost: [1200, 1500], max: 0, start: 1200, perhour: 500 }, // bani curați (implicit)
            { item: 890, cost: [100, 150], max: 0, start: 100, perhour: 200 },   // bani curați (implicit)
            { item: 154, cost: [10, 15], max: 0, start: 10, perhour: 5 },   // bani curați (implicit)

        ],
        dimension: 0,
        license: "hunting", // ✅ cere licență de vânătoare
        minHours: 1,// ✅ necesita minim 5 ore jucate
        blip: { id: 119, color: 1 }
    }
];
