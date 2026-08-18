import { langStringDefault } from "./lang/index";
export const WEDDING_POS = [
    // Сенди шорс церковь
    new mp.Vector3(-327.25, 2798.52, 59.18),
    // Церковь город
    new mp.Vector3(-1669.60, -291.65, 51.62)

];
export const WEDDING_NAME = langStringDefault("wedding.f130959c77c3d2ed4798a552584f9442");
/** Стоимость развода без обоюдного согласия */
export const WEEDING_PAY = 7000;

export interface Person {
    name: string,
    staticID: number
}

export type DivorceType = "money" | "consent";