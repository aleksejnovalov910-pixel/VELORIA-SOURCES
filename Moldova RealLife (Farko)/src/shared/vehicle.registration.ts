import { langStringDefault } from "./lang/index";
/** Услуги центра регистрации */
export const VEHICLE_REGISTRATION_TARIFS:[string, number, boolean, number][] = [
    [langStringDefault("vehicle.registration.587aa3877eb80ec67a098ea6bcf7610e"), 5000, false, 8],
    [langStringDefault("vehicle.registration.bf91ed0a5253cdfdc0a3bed6718edb55"), 10000, false, 7],
    [langStringDefault("vehicle.registration.7b8cba868c985b29e1efaf4b3e393e89"), 15000, false, 6],
    [langStringDefault("vehicle.registration.5a81a37d2446a8eeac2a5c2af4fbbe86"), 45, true, 0],
]
/** Координаты точек регистрации транспорта */
export const VEHICLE_REGISTRATION_POS:{x:number, y: number, z: number}[] = [
    {x: -705.50, y: -1285.73, z: 4.10}
]