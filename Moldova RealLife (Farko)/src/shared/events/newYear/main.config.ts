import { langStringDefault } from "../../lang/index";
export const EVENT_IS_ACTIVE: boolean = false;
export const NEW_YEAR_EXCHANGE_ACTIVE: boolean = true;

export const GREETING_COLOR: string = "ff5a3d";

export const NEW_YEAR_EVENT_BLIP_SPRITE: number = 304;
export const NEW_YEAR_EVENT_BLIP_POSITION: Vector3Mp = new mp.Vector3(-245.59, -2003.67, 29.15);
export const NEW_YEAR_EVENT_BLIP_OPTIONS: {
    alpha?: number;
    color?: number;
    dimension?: number;
    drawDistance?: number;
    name?: string;
    rotation?: number;
    scale?: number;
    shortRange?: boolean;
} = {
    color: 75,
    dimension: 0,
    name: langStringDefault("events.newYear.main.config.50742392e27467dc19a0da859252d1cb"),
    shortRange: true
};