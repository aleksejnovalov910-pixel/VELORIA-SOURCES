import { langStringDefault } from "./lang/index";
import {CASINO_ENTER, CASINO_MAIN_DIMENSION} from "./casino/main";

export const CASINO_TELEPORT_NAME = "Casino";
export const HOSPITAL_TELEPORT_DIMENSION = 112233;

interface TeleportItem {
    /** Название точки телепортации */
    name: string;
    /** Точки телепортации. Использовать координаты для плоского маркера */
    points: {
        name: string,
        x: number,
        y: number,
        z: number,
        h: number,
        /** Измерение. Если указать -1 - то будет везде, при этом телепорт произойдёт внутри того измерения, в котором находится игрок*/
        d: number
    }[];
    /** Параметр, который указывает на то, что можно телепортироватся только в одном направлении (от первой ко второй точки) */
    oneway?: true;
    /** Параметр, который указывает на то, что телепортация произойдёт сразу при входе в маркер */
    onenter?: true;
    /** Параметр, который указывает на то, что телепортация произойдёт сразу при нажатии на кнопку */
    onenterpress?: true;
    /** Ограничить доступ по фракции */
    fraction?:number | "gang" | "mafia" | "gos";
    /** Взымать плату за телепорт */
    cost?: number;
    /** Позволить телепортироватся транспорту. Радиус маркеров будет увеличен до 4 */
    vehicle?:true;
    /** Настройка параметра ожидания. Если указать - человеку нужно будет подождать какое то время прежде чем его телепортирует */
    wait?: {distance: number, text: string, seconds: number};
    /** Ограничить доступ по семье */
    family?: number;
    minHours?: number; // ✅ numar minim de ore necesare


}

export const TELEPORT_CONFIG: TeleportItem[] = [
    
    {
        name: langStringDefault("teleport.system.2822946c4f0354257ceaa74ae212a162"),
        points: 
        [{name: langStringDefault("teleport.system.1f8d8c785b1be85056080fa78b6f1cf8"), x: -2360.89, y: 3249.38, z: 31.81, h: 325, d: 0},{name: langStringDefault("teleport.system.1f8d8c785b1be85056080fa78b6f1cf8"), x: -2360.76, y: 3249.41, z: 91.90, h: 328, d: 0}], 
        onenter: true,
        fraction: 4
    },
    // {
    //     name: 'Крыша EMS',
    //     points: 
    //     [{name: "EMS улица", x: -259.70, y: 6309.45, z: 31.43, h: 304, d: 0},{name: "EMS крыша", x: -251.17, y: 6338.73, z: 36.56, h: 220, d: 0}], 
    //     onenter: true,
    // },
    // {
    //     name: 'Лифт',
    //     points: 
    //     [{name: "Второй этаж", x: 309.69, y: -569.07, z: 42.36, h: 75, d: 0},{name: "Первый этаж", x: 347.93, y: -580.64, z: 27.80, h: 154, d: 0},{name: "EMS крыша", x: 338.97, y: -584.90, z: 73.27, h: 252, d: 0}], 
    //     onenter: true,
    // },
    {
        name: langStringDefault("teleport.system.86b23cea558c26389e68300df481db70"),
        points: 
        [{name: langStringDefault("teleport.system.4756f46fcf0148fe00f8c2a45010c16f"), x: 1846.56, y: 2585.82, z: 44.67, h: 272, d: 0},{name: langStringDefault("teleport.system.d813d139d0f9d4f13558e5e12e65cb5a"), x: 1775.23, y: 2552.15, z: 44.56, h: 91, d: 0}], 
        onenter: true,
        fraction: 7
    },
    {
        name: langStringDefault("teleport.system.61c667e5cff0ce52e388ab1a43b695cd"),
        points: 
        [{name: langStringDefault("teleport.system.0ca005a9119ab5cf42e93d8e300a55d8"), x: 838.89, y: -1311.06, z: -84.71, h: 179, d: -1},{name: langStringDefault("teleport.system.d5fc66d7c3ef358190c5b3afeb979c6f"), x: 843.53, y: -2049.03, z: -84.71, h: 179, d: -1},{name: langStringDefault("teleport.system.033bac72b3bc38f084b9811691a08e36"), x: 1649.59, y: -1305.16, z: -84.71, h: 359, d: -1},{name: langStringDefault("teleport.system.b50bf8a70b6bb7f9849fb1363c8abf53"), x: -193.68, y: -1321.40, z: -84.71, h: 349, d: -1}],
        onenter: true
    },
    {
        name: CASINO_TELEPORT_NAME,
        points:
        [
            {name: langStringDefault("teleport.system.50e44e8352501fec33285d06fdede714"), ...CASINO_ENTER, d: 0},
            {name: langStringDefault("teleport.system.23767ff7a3938d3865bb974ec80511dc"), x: 1089.63, y: 206.54, z: -50.00, h: 338, d: CASINO_MAIN_DIMENSION},
        ],
        minHours: 1,// ✅ necesita minim 5 ore jucate
        onenterpress: true
    },
    // Левое крыло фиб
    {
        name: langStringDefault("teleport.system.42eb94c016d134be6c2f7471e09326a1"),
        points: 
        [{name: langStringDefault("teleport.system.99c0601d785c0fb1c8ba049a1679a053"), x: 2504.50, y: -433.22, z: 98.21, h: 316, d: 0}, {name: langStringDefault("teleport.system.87116ed668aa210a5b5cc7a92709ec01"), x: 2504.42, y: -433.18, z: 106.01, h: 312, d:0},{name: langStringDefault("teleport.system.87116ed668aa210a5b5cc7a92709ec01"), x: 2497.45, y: -349.18, z: 104.79, h: 313, d: 0}, {name: langStringDefault("teleport.system.e03ce55adea3229c9cd380f6da878f7b"),x: 2491.27, y: -392.06, z: 86.81, h: 44, d:0},{name: langStringDefault("teleport.system.c65d11e5e74fc4b5ba74a7ad984c2eb3"), x: 2509.84, y: -432.72, z: 117.33, h: 296, d:0}], 
        onenter: true,
        fraction: 3
    },
    // Правое крыло фиб
    {
        name: langStringDefault("teleport.system.93156c6998f1401e19538bed8bb23a73"),
        points: 
        [{name: langStringDefault("teleport.system.62f3dcc03aa42a247a37fedf20119343"), x: 2497.47, y: -348.99, z: 93.19, h: 311, d: 0}, {name: langStringDefault("teleport.system.524967648af898360eefdf2482c12b78"), x: 2494.85, y: -346.96, z: 100.99, h: 311, d:0},{name: langStringDefault("teleport.system.377fd5efdefd59d361742304862d6017"), x: 2495.01, y: -346.82, z: 104.79, h: 333, d: 0}, {name: langStringDefault("teleport.system.fabd7975427b312e4d8437f706e4f496"),x: 2491.27, y: -392.06, z: 86.81, h: 44, d:0},{name: langStringDefault("teleport.system.488c3eddd0124a3ed331c8ed313a8254"), x: 2505.44, y: -340.60, z: 117.12, h: 168, d: 0}], 
        onenter: true,
        fraction: 3
    },
    {
        name: langStringDefault("teleport.system.4d347c05bea86351018aee9546f0c141"),
        points: 
        [{name: langStringDefault("teleport.system.7c7401bb51d5ef6b3a90247875ab7479"), x: 2501.93, y: -339.90, z: 100.99, h: 136, d: 0},{name: langStringDefault("teleport.system.bb11e02f55fd5f7e7a3817773e543020"), x: 2501.67, y: -340.05, z: 104.79, h: 134, d: 0}, {name: langStringDefault("teleport.system.6ae15b3658942d5bd5f8deec2de0fe4c"),x: 2491.27, y: -392.06, z: 86.81, h: 44, d:0},{name: langStringDefault("teleport.system.6c3f1b60c2ba30521f73ae5cfe714334"), x: 2505.44, y: -340.60, z: 117.12, h: 168, d: 0}], 
        onenter: true,
        fraction: 3
    },
    {
        name: langStringDefault("teleport.system.2ef95bf950b0b5358d00557fe26b21ae"),
        points: 
        [{name: langStringDefault("teleport.system.eaec73509c7b3d7ca2297db0bf63205f"), x: 2502.01, y: -339.73, z: 93.19, h: 133, d: 0}, {name: langStringDefault("teleport.system.f85ff509dc8bcef9dc7c31af101dc52b"), x: 2504.40, y: -342.22, z: 100.99, h: 129, d:0},{name: langStringDefault("teleport.system.46030bb31936953f34849f1baed77a3c"), x: 2504.14, y: -342.40, z: 104.79, h: 136, d: 0}, {name: langStringDefault("teleport.system.7ef76b5f1b614db687aa65a73595d2ed"),x: 2491.27, y: -392.06, z: 86.81, h: 44, d:0},{name: langStringDefault("teleport.system.be8388601dc2b37592fa04dae399fbd0"), x: 2505.44, y: -340.60, z: 117.12, h: 168, d: 0}], 
        onenter: true,
        fraction: 3
    },
    {
        name: langStringDefault("teleport.system.73d4988d520be36ab23873ae5639cff7"),
        points: 
        [{name: langStringDefault("teleport.system.f6d773812a13db9f11a037c6332769b2"), x: 2504.55, y: -342.13, z: 93.19, h: 137, d: 0}, {name: langStringDefault("teleport.system.d032ef7c5bdaf13dc5c13884155a3e5b"), x: 2497.49, y: -349.05, z: 100.99, h: 310, d:0},{name: langStringDefault("teleport.system.7acf45ec4ce189d2cb4ca69af3c54b75"), x: 2497.45, y: -349.18, z: 104.79, h: 313, d: 0}, {name: langStringDefault("teleport.system.3400c0da35534c01d422de80566c08a5"),x: 2491.27, y: -392.06, z: 86.81, h: 44, d:0},{name: langStringDefault("teleport.system.cd3c7f126e6f98520849f64d1651fe86"), x: 2505.44, y: -340.60, z: 117.12, h: 168, d: 0}], 
        onenter: true,
        fraction: 3
    },
    // Life Invander
    {
        name: langStringDefault("teleport.system.ae16397fb57fe756d637c3f45a532aeb"),
        points: 
        [{name: langStringDefault("teleport.system.0cbd18663a8bd4b486bb099213f6d376"), x: -590.36, y: -938.31, z: 22.97, h: 357, d: 0}, {name: langStringDefault("teleport.system.1d3898e1faf276057b86b3107566f88b"), x: -590.34, y: -938.39, z: 27.28, h: 351, d:0},{name: langStringDefault("teleport.system.721f6f5c2f103dd11c276ffb9e95699f"), x: -590.29, y: -938.41, z: 31.62, h: 351, d: 0}], 
        onenter: true,
        fraction: 5
    },
    {
        name: langStringDefault("teleport.system.9614d612c3d65500c0624689c5a1b2f7"),
        points: 
        [{name: langStringDefault("teleport.system.a4b0165112cfa4087e917f8d90df795a"), x: -586.18, y: -938.64, z: 22.96, h: 358, d: 0}, {name: langStringDefault("teleport.system.8f0ab09439ffada0f6646bd6bb3713dc"), x: -586.10, y: -938.23, z: 27.28, h: 355, d:0},{name: langStringDefault("teleport.system.a16a2837abe42f3ea1413f995e246ab1"), x: -586.25, y: -938.48, z: 31.62, h: 356, d: 0}], 
        onenter: true,
        fraction: 5
    },
    {
        name: langStringDefault("teleport.system.8a4458ddaf37ebd4094a340787df8270"),
        points: 
        [{name: langStringDefault("teleport.system.531f6afe17c90c8e1d0919073137d0e1"), x: -564.61, y: -178.61, z: 41.17, h: 208, d: 0},{name: langStringDefault("teleport.system.de139592e4e48ed05a14600e2ce9848c"), x: -558.15, y: -191.88, z: 69.07, h: 302, d: 0}], 
        onenter: true,
        fraction: 1
    },
    {
        name: langStringDefault("teleport.system.6f752a386160d617bdb7ff0a03113230"),
        points: 
        [{name: langStringDefault("teleport.system.b683c05b933369ba93d03183eb693237"), x: 461.61, y: -981.54, z: 24.81, h: 89, d: 0},{name: langStringDefault("teleport.system.4c19d4f18de8932ed3289343561b2acd"), x: 463.35, y: -981.57, z: 29.79, h: 90, d: 0},{name: langStringDefault("teleport.system.5fcdfded24472a981cccc039c25041e2"), x: 463.40, y: -981.72, z: 34.78, h: 102, d: 0},{name: langStringDefault("teleport.system.ddfd555da8e6da84b5ea4813943d073f"), x: 462.60, y: -983.88, z: 42.79, h: 83, d: 0},{name: langStringDefault("teleport.system.ec8bfa8260241e875742a137d2a9a738"), x: 466.02, y: -981.57, z: 39.78, h: 83, d: 0}], 
        onenter: true,
        fraction: 2
    },
    {
        name: langStringDefault("teleport.system.56ec6737581d88342e19f575a45f5433"),
        points: 
        [{name: langStringDefault("teleport.system.ca59beb6961104e0df3611edac47843d"), x: 334.28, y: -580.72, z: 47.35, h: 69, d: 0},{name: langStringDefault("teleport.system.8411dbb0ac4373a7ed545b38dbacca49"), x: 339.41, y: -584.06, z: 73.16, h: 255, d: 0}], 
        onenter: true,
        fraction: 16
    },
];