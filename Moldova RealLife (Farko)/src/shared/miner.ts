import { langStringDefault } from "./lang/index";
import {FACTION_ID} from "./fractions";
import {MINIGAME_TYPE} from "./minigame";

export interface MinerItem {
	name: string;
	desc: string;
	item: number | number[];
	amount_max: number;
	restore_tick: number;
	tick_interval_minutes: number;
	split?: boolean;
	d: number;
	pos: { x: number; y: number; z: number }[];
	family?: boolean;
	fraction?: FACTION_ID[];
	needFamily?: boolean;
	needNotFraction?: boolean;
	blip?: { id: number; color: number };
	cooldown: number;
	markerType: number;
    posblips?: { x: number; y: number; z: number }[]; // <— noul câmp

	anim: {
		task?: string | [string, string, boolean?];
		seconds: number;
		text: string;
		heading?: number;
		minigame?: MINIGAME_TYPE;
		custom?: {
			dict: string;
			name: string;
			flag: number;
			prop: {
				model: string;
				bone: number;
				offset: { x: number; y: number; z: number };
				rot: { x: number; y: number; z: number };
			};
		};
	};
}


export const MINER_POSITIONS: MinerItem[] = [
    //// JOB MINERIT
    {
        name: langStringDefault("farm.71e5946a71d2c7b01ffca05be5aba4f4"),
        desc: langStringDefault("farm.54ef2a64bc8a02e06b1d83a3e21ba680"),
        item: [
            885, 886, 885, 885, 885, 886, 885, 886, 885, 885, 885, 885, 885, 886, 885, 885, 885, 885, 885, 885, 885, 885, 886,885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885,885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885,885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 885, 886, 885, 885, 885, 885, 885,
            886, 886, 886,
            886
        ],        
        amount_max: 16, // 2 pietre pentru fiecare punct
        restore_tick: 16, // Când se regenereaza, la fel 16 ca sa refaca tot    
        tick_interval_minutes: 10,
        split: true,
        d: 0,
        cooldown: 5,
        markerType: 20,
        anim: {
            task: "WORLD_HUMAN_GARDENER_PLANT",
            seconds: 15,
            text: langStringDefault("farm.bf19c642cfeea6d8c57c61da04f7ab44"),
            // minigame: MINIGAME_TYPE.DRILL // sau orice alt tip vrei să folosești

        },
        blip: {
            id: 557,
            color: 3,
        },
        posblips: [
            { x: 2920.43, y: 2783.81, z: 40.34 },
        ],
        pos: [
            { x: 2800.50, y: 2732.84, z: 41.11 },
            { x: 2804.37, y: 2732.31, z: 39.36 },
            { x: 2816.12, y: 2733.50, z: 39.72 },
            { x: 2819.18, y: 2756.02, z: 39.14 },
            { x: 2827.94, y: 2737.86, z: 40.10 },
            { x: 2835.85, y: 2737.63, z: 40.79 },
            { x: 2872.38, y: 2758.86, z: 40.71 },
            { x: 2853.43, y: 2748.97, z: 40.21 },
            // (restul pozitiilor aici daca vrei toate)
        ]
    },
];
