import { langStringDefault } from "./lang/index";
export interface DoorConfig {
    /** Конфиг пропов дверей */
    doors: {
        /** Хеш двери */
        hash: number,
        /** Координата X */
        x: number,
        /** Координата Y */
        y: number,
        /** Координата Z */
        z: number
    }[],
    /** Текст кнопки */
    text: string,
    /** Позиция текста */
    pos: {
        /** Координата X */
        x: number,
        /** Координата Y */
        y: number,
        /** Координата Z */
        z: number
    },
    /** Текущая фракция */
    fraction: number,
    /** Пометить дверь открытой по умолчанию */
    defaultOpened?: boolean
}

/** Список всех дверей */
export const DOORS_LIST: DoorConfig[] = [

        // LSPD
        // { text: "Служебный коридор LSPD", fraction: 2, doors: [{ hash: 1557126584, x: 450.10, y: -985.74, z: 30.84 }], pos: { x: 450.06, y: -986.39, z: 30.69}, defaultOpened: true},
        // { text: "Коридор LSPD", fraction: 2, doors: [{ hash: 185711165, x: 443.41, y: -989.45, z: 30.84 },{hash:185711165,x: 446.01, y: -989.45, z: 30.84}], pos: { x: 444.72, y: -989.21, z: 30.69}, defaultOpened: true},
        // { text: "Лестница на второй этаж", fraction: 2, doors: [{ hash: -131296141, x: 443.03, y: -991.94, z: 30.84 },{hash: -131296141, x: 443.03, y: -994.54, z: 30.84}], pos: { x: 443.06, y: -993.23, z: 30.69}, defaultOpened: true},
        // { text: "Допросная LSPD", fraction: 2, doors: [{ hash: -543497392, x: 446.13, y: -987.79, z: 26.82 },{ hash: -543497392, x: 446.12, y: -985.20, z: 26.82 }], pos: { x: 446.11, y: -986.50, z: 26.67}, defaultOpened: true},
        // { text: "Черный вход LSPD", fraction: 2, doors: [{ hash: -1033001619, x: 447.22, y: -999.00, z: 30.79 },{ hash: -1033001619, x: 444.62, y: -999.00, z: 30.79 }], pos: { x: 445.88, y: -999.14, z: 30.72}, defaultOpened: true},
        // { text: "Кабинет шефа LSPD", fraction: 2, doors: [{ hash: -1320876379, x: 463.42, y: -1001.01, z: 36.05 }], pos: { x: 462.65, y: -1000.77, z: 35.93}, defaultOpened: true},
        // { text: "Митинг рум LSPD", fraction: 2, doors: [{ hash: -131296141, x: 474.62, y: -991.97, z: 36.05 }], pos: { x: 475.38, y: -992.18, z: 35.93}, defaultOpened: true},
        // { text: "Митинг рум LSPD", fraction: 2, doors: [{ hash: -131296141, x: 484.04, y: -992.00, z: 36.05 }], pos: { x: 484.71, y: -992.15, z: 35.93}, defaultOpened: true},
        // { text: "Задний вход LSPD", fraction: 2, doors: [{ hash: -2023754432, x: 467.37, y: -1014.45, z: 26.54 },{ hash: -2023754432, x: 469.97, y: -1014.45, z: 26.54 }], pos: { x: 468.57, y: -1014.28, z: 26.39}, defaultOpened: true},
        // { text: "Клетка 1", fraction: 2, doors: [{ hash: 631614199, x: 461.8065, y: -994.4069, z: 25.06535 }], pos: { x: 462.04, y: -993.54, z: 24.91}, defaultOpened: true},
        // { text: "Клетка 2", fraction: 2, doors: [{ hash: 631614199, x: 461.8065, y: -997.6582, z: 25.0653 }], pos: { x: 461.87, y: -998.38, z: 24.91}, defaultOpened: true},
        // { text: "Клетка 3", fraction: 2, doors: [{ hash: 631614199, x:461.8065,  y: -1001.301, z: 25.06535 }], pos: { x: 461.87, y: -1001.95, z: 24.91}, defaultOpened: true},
        // { text: "Допросная 1", fraction: 2, doors: [{ hash: -1033001619, x: 468.49, y: -1003.55, z: 25.01 }], pos: { x: 467.79, y: -1003.50, z: 24.91}, defaultOpened: true},
        // { text: "Допросная 2", fraction: 2, doors: [{ hash: -1033001619, x: 471.47, y: -1003.54, z: 25.01 }], pos: { x: 472.15, y: -1003.46, z: 24.91}, defaultOpened: true},
        // { text: "Допросная 3", fraction: 2, doors: [{ hash: -1033001619, x: 477.05, y: -1003.55, z: 25.01 }], pos: { x: 476.30, y: -1003.53, z: 24.91}, defaultOpened: true},
        // { text: "Допросная 4", fraction: 2, doors: [{ hash: -1033001619, x: 480.03, y: -1003.54, z: 25.01 }], pos: { x: 480.73, y: -1003.52, z: 24.91}, defaultOpened: true},
        // { text: "Крыша ЛСПД", fraction: 2, doors: [{ hash: -340230128, x: 464.36, y: -984.68, z: 43.83 }], pos: { x: 464.38, y: -983.98, z: 43.70}, defaultOpened: true},
        // { text: "Kamera 1", fraction: 2, doors: [{ hash: -1033001619, x: 467.19, y: -996.46, z: 25.01 }], pos: { x: 467.87, y: -996.45, z: 24.91}, defaultOpened: true},
        // { text: "Kamera 2", fraction: 2, doors: [{ hash: -1033001619, x: 471.48, y: -996.46, z: 25.01 }], pos: { x: 472.23, y: -996.54, z: 24.91}, defaultOpened: true},
        // { text: "Kamera 3", fraction: 2, doors: [{ hash: -1033001619, x: 475.75, y: -996.46, z: 25.01 }], pos: { x: 476.50, y: -996.56, z: 24.91}, defaultOpened: true},
        // { text: "Kamera 4", fraction: 2, doors: [{ hash: -1033001619, x: 480.03, y: -996.46, z: 25.01 }], pos: { x: 480.82, y: -996.45, z: 24.91}, defaultOpened: true},


        // GOV
        { text: langStringDefault("doors.457e8b23c0d33087037dc3352fb5334b"), fraction: 1, doors: [{ hash: 736699661, x: -557.67, y: -205.05, z: 38.55 }, {hash: 736699661, x: -556.38, y: -207.31, z: 38.54}], pos: { x: -556.85, y: -206.02, z: 38.38}, defaultOpened: true},
        { text: langStringDefault("doors.3282246235495e0f3ab7867e0ae52c18"), fraction: 1, doors: [{ hash: 736699661, x: -560.68, y: -199.83, z: 38.54 }, {hash: 736699661, x: -559.39, y: -202.08, z: 38.54}], pos: { x: -559.87, y: -200.81, z: 38.38}, defaultOpened: true},
        { text: langStringDefault("doors.f9c28f04eb3e300c34ac6e08671773ec"), fraction: 1, doors: [{ hash: 1219957182, x: -563.42, y: -195.08, z: 37.38 }, {hash: -1225363909, x: -562.68, y: -196.37, z: 37.38}], pos: { x: -562.94, y: -195.65, z: 38.38}, defaultOpened: true},
        { text: langStringDefault("doors.c4c7c879c47e982d885410ed665ce1ab"), fraction: 1, doors: [{ hash: 736699661, x: -543.11, y: -185.10, z: 38.39 }, {hash: 736699661, x: -541.80, y: -187.35, z: 38.38}], pos: { x: -542.63, y: -186.33, z: 38.23}, defaultOpened: true},
        { text: langStringDefault("doors.002a807ee005a68acadb700f1a1c9245"), fraction: 1, doors: [{ hash: 736699661, x: -540.68, y: -189.37, z: 38.38 }, {hash: 736699661, x: -539.39, y: -191.63, z: 38.38}], pos: { x: -540.09, y: -190.57, z: 38.23}, defaultOpened: true},

        // BCSD Sandy Shores
        { text: langStringDefault("doors.8c2210df457234bf3586c42f792ed88f"), fraction: 7, doors: [{ hash: -2023754432, x: 1857.25, y: 3690.30, z: 34.42 }], pos: { x: 1856.68, y: 3689.86, z: 34.27}, defaultOpened: true},
        { text: langStringDefault("doors.5be0a61e6dba216a4d33a3e783995dfc"), fraction: 7, doors: [{ hash: -2023754432, x: 1849.98, y: 3684.11, z: 34.42 }, {hash: -2023754432, x: 1851.29, y: 3681.87, z: 34.42}], pos: { x: 1850.59, y: 3683.01, z: 34.27}, defaultOpened: true},
        { text: langStringDefault("doors.04d0538e7aad7ac6e44870613da7da4c"), fraction: 7, doors: [{ hash: -2023754432, x: 1849.40, y: 3691.21, z: 34.42 }, {hash: -2023754432, x: 1847.13, y: 3689.95, z: 34.42}], pos: { x: 1848.34, y: 3690.48, z: 34.27}, defaultOpened: true},
        { text: langStringDefault("doors.33a69b9b4c508b60d3dd353839096cda"), fraction: 7, doors: [{ hash: 2367212570, x: 1862.763, y: 3688.412, z: 30.40947 }], pos: { x: 1862.18, y: 3689.24, z: 30.26}, defaultOpened: true},
        { text: langStringDefault("doors.b8e3faf5c0c6e73b0bd008a092a630c5"), fraction: 7, doors: [{ hash: 2367212570, x: 1860.897, y: 3691.643, z: 30.40947 }], pos: { x: 1860.68, y: 3692.40, z: 30.26}, defaultOpened: true},
        { text: langStringDefault("doors.6dd8e8366eb7a75c77ba8439aef664f7"), fraction: 7, doors: [{ hash: 2367212570, x: 1858.996, y: 3694.936, z: 30.40947 }], pos: { x: 1858.60, y: 3695.67, z: 30.26}, defaultOpened: true},
        { text: langStringDefault("doors.2285342f453047dbbbb6445895bb0352"), fraction: 7, doors: [{ hash: 749848321, x: 1852.92, y: 3686.41, z: 30.41 }], pos: { x: 1852.39, y: 3686.11, z: 30.26}, defaultOpened: true},

        // BCSD Paleto-Bucht
        { text: langStringDefault("doors.8feee6f5103f4833f3ea5d8ab7e437f5"), fraction: 7, doors: [{ hash: -2023754432, x: -450.71, y: 6016.37, z: 31.87 }], pos: { x: -450.12, y: 6016.14, z: 31.72}, defaultOpened: true},
        { text: langStringDefault("doors.8ce7e8f826586d614bac65d3658e71a6"), fraction: 7, doors: [{ hash: -2023754432, x: -454.04, y: 6010.24, z: 31.86 }], pos: { x: -453.46, y: 6010.71, z: 31.72}, defaultOpened: true},
        { text: langStringDefault("doors.a78eb8ade2a770604dd62be86ae60f31"), fraction: 7, doors: [{ hash: -2023754432, x: -442.86, y: 6010.96, z: 31.87 }, {hash: -2023754432, x: -441.02, y: 6012.79, z: 31.87}], pos: { x: -441.82, y: 6011.81, z: 31.72}, defaultOpened: true},
        { text: langStringDefault("doors.c2af0d612131680664428f2f13d42268"), fraction: 7, doors: [{ hash: -2023754432, x: -442.66, y: 6009.30, z: 31.87 }, {hash: -2023754432, x: -440.82, y: 6007.46, z: 31.87}], pos: { x: -441.63, y: 6008.32, z: 31.72}, defaultOpened: true},
        { text: langStringDefault("doors.564dbc78c0b1bb42496981ed5c590252"), fraction: 7, doors: [{ hash: 749848321, x: -447.77, y: 6005.19, z: 31.87 }], pos: { x: -447.16, y: 6004.93, z: 31.72}, defaultOpened: true},
        { text: langStringDefault("doors.5aecc3bd7f4ca1838667c8cdb4964d4c"), fraction: 7, doors: [{ hash: 749848321, x: -437.04, y: 6003.70, z: 31.87 }], pos: { x: -436.45, y: 6003.40, z: 31.72}, defaultOpened: true},
        { text: langStringDefault("doors.1f86d2573844cff724bc13c314f76c04"), fraction: 7, doors: [{ hash: 749848321, x: -440.42, y: 5998.60, z: 31.87 }], pos: { x: -440.93, y: 5999.20, z: 31.72}, defaultOpened: true},
        { text: langStringDefault("doors.2562685690aa3dc6b020e8547c0ac0db"), fraction: 7, doors: [{ hash: -2023754432, x: -449.57, y: 6008.54, z: 31.87 }, {hash: -2023754432, x: -447.73, y: 6006.70, z: 31.87}], pos: { x: -448.67, y: 6007.65, z: 31.72}, defaultOpened: true},
        { text: langStringDefault("doors.7a2b7e4833aaade80d73eb73a4ecc26c"), fraction: 7, doors: [{ hash: 2367212570, x: -444.3676, y: 6012.223, z: 28.13549 }], pos: { x: -444.54, y: 6011.47, z: 27.99}, defaultOpened: true},
        //{ text: "Задний вход", fraction: 7, doors: [{ hash: -2023754432, x: -454.04, y: 6010.24, z: 31.86 }], pos: { x: -453.46, y: 6010.71, z: 31.72}},
        //{ text: "Задний вход", fraction: 7, doors: [{ hash: -2023754432, x: -454.04, y: 6010.24, z: 31.86 }], pos: { x: -453.46, y: 6010.71, z: 31.72}},
        { text: langStringDefault("doors.69fca8714980d0f5801b5a4d4d198463"), fraction: 7, doors: [{ hash: 749848321, x: -436.63, y: 6002.55, z: 28.14 }], pos: { x: -437.05, y: 6002.04, z: 27.99}, defaultOpened: true},

        // ARMY
        { text: langStringDefault("doors.5e87f9c056965cccd9169f27af383fa8"), fraction: 4, doors: [{hash: 3419809524, x: -1569.93579, y: 2765.0498, z: 18.088747},{hash: 3419809524, x: -1562.23181, y:  2774.231, z: 18.088747}], pos: { x: -1565.88, y: 2769.39, z: 17.44}, defaultOpened: true},
        { text: langStringDefault("doors.a88c5d782c03b990ae8c000e8603d816"), fraction: 4, doors: [{ hash: 3419809524, x: -2322.044, y: 3393.939, z: 31.424181 },{ hash: 3419809524, x: -2314.3186, y: 3403.1123, z: 31.4162941} ], pos: { x: -2318.45, y: 3398.73, z: 30.76}, defaultOpened: true},

        // { text: "Лестничная площадка", fraction: 4, doors: [{ hash: -1207991715, x: -2353.75, y: 3252.64, z: 32.96 }], pos: { x: -2353.09, y: 3252.47, z: 32.81}, defaultOpened: true},
        // { text: "Лифт", fraction: 4, doors: [{ hash: -522980862, x: -2360.82, y: 3251.14, z: 31.81 }, {hash: -1977105237, x: -2359.37, y: 3250.30, z: 31.81}], pos: { x: -2359.97, y: 3250.91, z: 32.81}, defaultOpened: true},
        // { text: "Казарма", fraction: 4, doors: [{ hash: -551608542, x: -2346.58, y: 3231.93, z: 35.08 }], pos: { x: -2345.92, y: 3231.76, z: 34.96}, defaultOpened: true},
        { text: langStringDefault("doors.aedeae80f30c1e5905daacb44eedd2b7"), fraction: 4, doors: [{ hash: 1248599813, x: -2346.53, y: 3231.97, z: 35.09} ], pos: { x: -2346.15, y: 3231.20, z: 34.97}, defaultOpened: true},

        //EMS
        // { text: "Ресепшн", fraction: 16, doors: [{ hash: 854291622, x: 313.48, y: -595.46, z: 43.43}], pos: { x: 313.12, y: -596.31, z: 43.28}, defaultOpened: true},
        // { text: "Служебное Помещение", fraction: 16, doors: [{ hash: 854291622, x: 309.13, y: -597.75, z: 43.43 }], pos: { x: 308.18, y: -597.51, z: 43.28}, defaultOpened: true},
        // { text: "Лаборатория", fraction: 16, doors: [{ hash: 854291622, x: 307.12, y: -569.57, z: 43.43 }], pos: { x: 308.04, y: -569.80, z: 43.28}, defaultOpened: true},
        // { text: "Операционная 1", fraction: 16, doors: [{ hash: -434783486, x: 312.01, y: -571.34, z: 43.43 },{hash: -1700911976, x: 314.42, y: -572.22, z: 43.43}], pos: { x: 313.27, y: -571.64, z: 43.29}, defaultOpened: true},
        // { text: "Операционная 2", fraction: 16, doors: [{ hash: -434783486, x: 317.84, y: -573.47, z: 43.43 },{hash: -1700911976, x: 320.26, y: -574.35, z: 43.43}], pos: { x: 318.94, y: -574.00, z: 43.29}, defaultOpened: true},
        // { text: "Операционная 3", fraction: 16, doors: [{ hash: -434783486, x: 323.24, y: -575.43, z: 43.43 },{hash: -1700911976, x: 325.66, y: -576.31, z: 43.43}], pos: { x: 324.62, y: -575.78, z: 43.28}, defaultOpened: true},
        // { text: "Кабинет МРТ", fraction: 16, doors: [{ hash: 854291622, x: 336.16, y: -580.14, z: 43.43 }], pos: { x: 337.09, y: -580.40, z: 43.28}, defaultOpened: true},
        // { text: "Служебное", fraction: 16, doors: [{ hash: 854291622, x: 340.78, y: -581.82, z: 43.43 }], pos: { x: 341.60, y: -582.09, z: 43.28}, defaultOpened: true},
        // { text: "Рентген Кабинет", fraction: 16, doors: [{ hash: 854291622, x: 346.77, y: -584.00, z: 43.43 }], pos: { x: 347.57, y: -584.32, z: 43.28}, defaultOpened: true},
        // { text: "Кабинет 1", fraction: 16, doors: [{ hash: 854291622, x: 339.00, y: -586.70, z: 43.43 }], pos: { x: 339.91, y: -587.08, z: 43.28}, defaultOpened: true},
        // { text: "VIP Палата 1", fraction: 16, doors: [{ hash: 854291622, x: 357.49, y: -579.61, z: 43.43 }], pos: { x: 357.27, y: -580.34, z: 43.28}, defaultOpened: true},
        // { text: "VIP Палата 2", fraction: 16, doors: [{ hash: 854291622, x: 356.13, y: -583.36, z: 43.43 }], pos: { x: 355.89, y: -584.29, z: 43.28}, defaultOpened: true},
        // { text: "Терапевтический Кабинет", fraction: 16, doors: [{ hash: 854291622, x: 352.20, y: -594.15, z: 43.43 }], pos: { x: 351.87, y: -595.03, z: 43.28}, defaultOpened: true},
        // { text: "Реабилитационный Кабинет", fraction: 16, doors: [{ hash: 854291622, x: 346.89, y: -593.60, z: 43.43 }], pos: { x: 347.21, y: -592.77, z: 43.28}, defaultOpened: true},
        // { text: "Кабинет 2", fraction: 16, doors: [{ hash: 854291622, x: 358.73, y: -593.88, z: 43.43 }], pos: { x: 359.49, y: -594.15, z: 43.28}, defaultOpened: true},
        // { text: "Гараж", fraction: 16, doors: [{ hash: -434783486, x: 338.45, y: -590.05, z: 28.95 },{hash: -1700911976, x: 339.33, y: -587.63, z: 28.9}], pos: { x: 338.91, y: -588.89, z: 28.83}, defaultOpened: true},
        // { text: "Ресепшн", fraction: 16, doors: [{ hash: 854291622, x: 348.55, y: -585.16, z: 28.95 }], pos: { x: 348.22, y: -585.98, z: 28.80}, defaultOpened: true},
        { text: langStringDefault("doors.8fb02a0266706c947425df43ba1b2c5d"), fraction: 16, doors: [{ hash:  741314661, x: 399.8277, y:  -551.1396, z: 27.56778}], pos: {x: 402.78, y: -546.71, z: 28.58}, defaultOpened: true},

        //EMS paleto
        // { text: "Кабинет директора", fraction: 16, doors: [{ hash: 1859711902, x: -261.10, y: 6318.99, z: 32.58 }], pos: { x: -261.60, y: 6318.50, z: 32.44}, defaultOpened: true},
        // { text: "Комната обследований", fraction: 16, doors: [{ hash: 374758529, x: -257.37, y: 6322.71, z: 32.62 },{ hash: 374758529, x: -255.55, y: 6324.54, z: 32.62 }], pos: { x: -256.44, y: 6323.66, z: 32.44}, defaultOpened: true},


        //FIB
        { text: langStringDefault("doors.e0ccb5c33846571ad31fe365b6fdc753"), fraction: 3, doors: [{ hash: -2051651622, x: 2504.32, y: -411.30, z: 94.27 }], pos: { x: 2504.83, y: -411.69, z: 94.11}, defaultOpened: true},
        { text: langStringDefault("doors.11f400d81994104a8956074380b40136"), fraction: 3, doors: [{ hash: -1033001619, x: 2490.97, y: -405.18, z: 94.26 }], pos: { x: 2490.41, y: -404.62, z: 94.11}, defaultOpened: true},
        { text: langStringDefault("doors.63ff2e9b77094894fc2a007f81844bd8"), fraction: 3, doors: [{ hash: -1033001619, x: 2491.09, y: -405.05, z: 90.27 }], pos: { x: 2490.59, y: -404.52, z: 90.11}, defaultOpened: true},
        { text: langStringDefault("doors.8de31161dc7fd8928f21f5776de0cec8"), fraction: 3, doors: [{ hash: -1033001619, x: 2496.61, y: -403.95, z: 90.26 }], pos: { x: 2495.97, y: -403.42, z: 90.10}, defaultOpened: true},
        { text: langStringDefault("doors.4cea43ea72ec892324ee41bd91cbc27e"), fraction: 3, doors: [{ hash: -1033001619, x: 2502.89, y: -416.84, z: 90.25 }], pos: { x: 2502.35, y: -416.28, z: 90.10}, defaultOpened: true},
        { text: langStringDefault("doors.f67d7a8e13ceea73b226c0ad305b0353"), fraction: 3, doors: [{ hash: -1033001619, x: 2506.97, y: -420.91, z: 90.25 }], pos: { x: 2506.44, y: -420.39, z: 90.10}, defaultOpened: true},
        { text: langStringDefault("doors.47ed5b53fdc7b144b9f106d89b74678d"), fraction: 3, doors: [{ hash: -1033001619, x: 2490.97, y: -405.18, z: 100.52 }], pos: { x: 2490.47, y: -404.61, z: 100.36}, defaultOpened: true},
        { text: langStringDefault("doors.7a561c47785d19976fb6208587f86988"), fraction: 3, doors: [{ hash: -2051651622, x: 2517.29, y: -443.74, z: 100.50 }], pos: { x: 2516.75, y: -444.27, z: 100.37}, defaultOpened: true},
        { text: langStringDefault("doors.1a6a651893fb937a0b4073cf1a876d97"), fraction: 3, doors: [{ hash: -2051651622, x: 2523.45, y: -437.57, z: 100.51 }], pos: { x: 2522.92, y: -438.07, z: 100.37}, defaultOpened: true},
        //{ text: "Лаборатория", fraction: 3, doors: [{ hash: -2051651622, x: 2507.83, y: -425.85, z: 100.51 }], pos: { x: 2507.30, y: -425.28, z: 100.36}, defaultOpened: true},
        //{ text: "Гардеробная ", fraction: 3, doors: [{ hash: -2051651622, x: 2507.83, y: -425.85, z: 100.51 }], pos: { x: 2507.30, y: -425.28, z: 100.36}},
        { text: langStringDefault("doors.a38fd00aae0fecea293d3279d3f608e7"), fraction: 3, doors: [{ hash: 3691419444, x: 2521.943, y: -417.3813, z: 93.09399 }, { hash: 1122723068, x: 2520.103, y: -415.5412, z: 93.09382} ], pos: { x: 2520.85, y: -416.45, z: 94.12}, defaultOpened: true},
        //  { text: "Приёмная", fraction: 3, doors: [{ hash: -395331334, x: 2507.42, y: -422.88, z: 104.71 }], pos: { x: 2502.89, y: -422.01, z: 94.58}},
        { text: langStringDefault("doors.dc19d1090450c32a24ee4dd29f4dda16"), fraction: 3, doors: [{ hash: 1055151324, x: 2511.095, y: -416.0965, z: 99.27245 }], pos: { x: 2510.34, y: -415.76, z: 99.11}},
        { text: langStringDefault("doors.720fd438df5e5c034fa9a027920d6eec"), fraction: 3, doors: [{ hash: 1055151324, x: 2510.824, y: -435.6792, z: 99.27245 },{ hash: 1055151324, x: 2512.664, y: -433.8399, z: 99.27245 }], pos: { x: 2511.55, y: -434.44, z: 99.11}},
        { text: langStringDefault("doors.dca8a2ae0df09eea6479695e2461dd5c"), fraction: 3, doors: [{ hash: 1055151324, x: 2499.76, y: -424.20, z: 99.11 },{ hash: 1055151324, x: 2501.43, y: -422.52, z: 99.11 }], pos: {x: 2500.37, y: -423.30, z: 99.11}},
        { text: langStringDefault("doors.f1d7fb5c68b0b6393874b5959ba21bcc"), fraction: 3, doors: [{ hash: 4180086300, x: 2515.791, y: -355.7704, z: 93.08971 },{ hash: 2249271310, x: 2513.928, y: -357.5838, z: 93.08971 }], pos: {x: 2514.82, y: -356.55, z: 94.09}},

        { text: langStringDefault("doors.66d48f90e0d3ede58a732706fa05328c"), fraction: 3, doors: [{ hash: 823867722, x: 2497.481, y: -353.3639, z: 94.25793 }], pos: {x: 2498.03, y: -353.91, z: 94.09}},
        { text: langStringDefault("doors.881bb45beef755543ca8c8fd4a8bce0d"), fraction: 3, doors: [{ hash: 823867722, x: 2506.72, y: -361.99, z: 94.09 },{hash: 823867722, x: 2504.99, y: -360.32, z: 94.09}], pos: {x: 2505.76, y: -361.36, z: 94.09}},
        { text: langStringDefault("doors.fa2819dd60a53fd4b920d91b865a7f3f"), fraction: 3, doors: [{ hash: 823867722, x: 2506.371, y: -357.1198, z: 94.2556 }], pos: {x: 2505.78, y: -356.82, z: 94.09}},
        { text: langStringDefault("doors.7fce09dc462317c262b60e688573092f"), fraction: 3, doors: [{ hash: 823867722, x: 2520.449, y: -336.174, z: 94.25628 },{ hash: 823867722, x: 2522.29, y: -338.0148, z: 94.25628 }], pos: {x: 2521.16, y: -337.32, z: 94.09}},



        //NEWS
        { text: langStringDefault("doors.74a7b3b0353ead457982aa0b789dbfb5"), fraction: 5, doors: [{ hash: 1104171198, x: -1045.118, y: -232.0034, z: 39.44269 },{ hash: 1104171198, x: -1046.52, y: -229.3665, z: 39.44269 }], pos: { x: -1045.79, y: -230.70, z: 39.01}, defaultOpened: true},
        { text: langStringDefault("doors.1092c591db833170d24eb9b2ec1a9396"), fraction: 5, doors: [{ hash: -1679881977, x: -1083.62, y: -260.42, z: 38.19 },{ hash: -1045015371, x: -1080.97, y: -259.02, z: 38.19 }], pos: { x: -1082.22, y: -259.66, z: 37.79}, defaultOpened: true},
        { text: langStringDefault("doors.bb3188d0fbdd2b9f553dadb83e8625d2"), fraction: 5, doors: [{ hash: 2473190209, x: -1048.281, y: -236.8198,z: 44.17329 },{ hash: 2473190209,x: -1047.086,y: -239.1204,z: 44.17329 }], pos: { x: -1048.38, y: -238.24, z: 44.02}, defaultOpened: true},
        { text: langStringDefault("doors.5d8a33e53896e875a9ee3a82d6df4940"), fraction: 5, doors: [{ hash: -495720969, x: -1055.96, y: -236.43, z: 44.17 }], pos: { x: -1055.29, y: -236.18, z: 44.02}, defaultOpened: true},


        //Weazel News
        { text: langStringDefault("doors.5340e369cde61d250bc03c58d6a9b762"), fraction: 5, doors: [{ hash: 738456037, x: -576.44, y: -939.58, z: 23.99 },{ hash: 738456037, x: -573.84, y: -939.58, z: 23.99 } ], pos: { x: -575.15, y: -939.24, z: 23.86}},
        { text: langStringDefault("doors.430cb479f2eeeffa4a29491e28152c2c"), fraction: 5, doors: [{ hash: 1901183774, x: -580.05, y: -918.18, z: 28.34 }, ], pos: { x: -580.24, y: -917.49, z: 28.18}},
        { text: langStringDefault("doors.4d4b44b55a06c8bc85e11978b3e338e0"), fraction: 5, doors: [{ hash: 1901183774, x: -579.25, y: -928.54, z: 28.34 }, ], pos: { x: -579.24, y: -929.38, z: 28.19}},
        { text: langStringDefault("doors.32e13f4de394c60a0d387f72c8b0919e"), fraction: 5, doors: [{ hash: 1901183774, x: -574.97, y: -938.39, z: 28.34 },{ hash: 1901183774, x: -574.98, y: -935.82, z: 28.34 } ], pos: { x: -575.16, y: -937.19, z: 28.18}},
        { text: langStringDefault("doors.60a42a5c11c3a35e53a9c81b2cc75e50"), fraction: 5, doors: [{ hash: 1901183774, x: -594.12, y: -931.85, z: 32.69 } ], pos: { x: -594.75, y: -931.96, z: 32.52}},
        { text: langStringDefault("doors.dd990765d6dbddd58c42d817ebe05e91"), fraction: 5, doors: [{ hash: 1901183774, x: -574.58, y: -935.11, z: 32.69 } ], pos: { x: -574.59, y: -935.85, z: 32.52}},
        { text: langStringDefault("doors.a72a60963701d7b512c9ee31ea5802eb"), fraction: 5, doors: [{ hash: 1901183774, x: -575.70, y: -926.10, z: 32.69 } ], pos: { x: -576.65, y: -926.26, z: 32.52}},


        //Mafia

        //UM
        { text: langStringDefault("doors.ba6b66534b3651c8c382163c2416cb8a"), fraction: 24, doors: [{ hash: 1033441082, x: -1515.80, y: 850.72, z: 181.72 },{ hash: 1033441082, x: -1518.03, y: 851.55, z: 181.72 }], pos: { x: -1516.90, y: 851.30, z: 181.59}, defaultOpened: true},
        { text: langStringDefault("doors.2dbca7cf63f8d68b0e49a3c096b94aeb"), fraction: 24, doors: [{ hash: 1033441082, x: -1520.77, y: 848.33, z: 181.72 }], pos: { x: -1520.14, y: 848.61, z: 181.60}, defaultOpened: true},
        { text: langStringDefault("doors.5a655d9fb9d94b9a5825988235137a72"), fraction: 24, doors: [{ hash: 1033441082, x: -1500.63, y: 856.68, z: 181.72 }], pos: { x: -1501.27, y: 856.46, z: 181.60}, defaultOpened: true},
        { text: langStringDefault("doors.e08b793bc53c4ecd07cde119380fb8e7"), fraction: 24, doors: [{ hash: 1033441082, x: -1490.46, y: 851.03, z: 181.72 },{ hash: 1033441082, x: -1491.46, y: 853.18, z: 181.72 }], pos: { x: -1491.04, y: 852.21, z: 181.60}, defaultOpened: true},
        { text: langStringDefault("doors.c5c3f4652b36fe3f1d478e4316c2d6f4"), fraction: 24, doors: [{ hash: -1785293089, x: -1511.60, y: 844.05, z: 181.70 },{ hash: -1785293089, x: -1510.60, y: 841.90, z: 181.70 }], pos: { x: -1511.13, y: 843.00, z: 181.60}, defaultOpened: true},
        { text: langStringDefault("doors.23c9fd4e23dd6c96052d58c47265199d"), fraction: 24, doors: [{ hash: -1785293089, x: -1520.32, y: 833.40, z: 186.28 }], pos: { x: -1520.03, y: 832.70, z: 186.15}, defaultOpened: true},
        { text: langStringDefault("doors.4758aaa25411d71af46f259122d7c7ba"), fraction: 24, doors: [{ hash: 1033441082, x: -1522.39, y: 843.54, z: 186.28 }], pos: { x: -1521.79, y: 843.83, z: 186.15}, defaultOpened: true},

        // RM
        { text: langStringDefault("doors.e664cbdab09f0b95e88951b293e7101b"), fraction: 8, doors: [{ hash: -462653789, x: -1346.44, y: 57.45, z: 55.69 },{ hash: -462653789, x: -1346.61, y: 59.33, z: 55.69 }], pos: { x: -1346.34, y: 58.40, z: 55.25}, defaultOpened: true},
        { text: langStringDefault("doors.22bb468e0a4ce63f189c09cbad145e6a"), fraction: 8, doors: [{ hash: -462653789, x: -1365.66, y: 57.70, z: 54.44 },{ hash: -462653789, x: -1365.49, y: 55.82, z: 54.44 }], pos: { x: -1365.49, y: 56.75, z: 54.13}, defaultOpened: true},
        { text: langStringDefault("doors.7b3d6fe41c47c9e5e31f97744de50aa1"), fraction: 8, doors: [{ hash: -1687047623, x: -1358.03, y: 90.57, z: 55.40 }], pos: { x: -1358.76, y: 90.47, z: 55.25}, defaultOpened: true},
        { text: langStringDefault("doors.3b0f178736155d462eb878e546030236"), fraction: 8, doors: [{ hash: -1687047623, x: -1349.91, y: 59.18, z: 60.52 }], pos: { x: -1350.16, y: 59.90, z: 60.41}, defaultOpened: true},
        { text: langStringDefault("doors.5689084e7566538f13992a640d1f8ec3"), fraction: 8, doors: [{ hash: -1687047623, x: -1351.09, y: 61.97, z: 60.52 }], pos: { x: -1351.79, y: 61.67, z: 60.41}, defaultOpened: true},
        { text: langStringDefault("doors.0f2d6908c244bf89b3b05723e6b69729"), fraction: 8, doors: [{ hash: -1687047623, x: -1359.27, y: 61.23, z: 60.53 }], pos: { x: -1359.79, y: 60.90, z: 60.41}, defaultOpened: true},

        //LCN
        { text: langStringDefault("doors.84b8977b41e2dd4df93a616ac9dd8c42"), fraction: 9, doors: [{ hash: 1033441082, x: -1929.55, y: 2059.38, z: 140.97 }], pos: { x: -1928.90, y: 2059.12, z: 140.84}, defaultOpened: true},
        { text: langStringDefault("doors.ac5aca83b19fd4987c50021ca67a1816"), fraction: 9, doors: [{ hash: 1662086909, x: -1890.26, y: 2052.15, z: 141.29 },{ hash: 1662086909, x: -1887.94, y: 2051.30, z: 141.29 }], pos: { x: -1888.98, y: 2051.75, z: 141.02}, defaultOpened: true},
        { text: langStringDefault("doors.f773a69decc3611b7d6c1b27a6a46a31"), fraction: 9, doors: [{ hash: 1662086909, x: -1887.56, y: 2051.16, z: 141.29 },{ hash: 1662086909, x: -1885.24, y: 2050.31, z: 141.29 }], pos: { x: -1886.49, y: 2050.75, z: 141.01}, defaultOpened: true},
        { text: langStringDefault("doors.913791859a72e8e7b54b58f06e24645d"), fraction: 9, doors: [{ hash: -245429350, x: -1879.33, y: 2071.39, z: 141.28 },{ hash: -245429350, x: -1879.33, y: 2071.39, z: 141.28 }], pos: { x: -1880.32, y: 2071.58, z: 141.00}, defaultOpened: true},
        { text: langStringDefault("doors.4e9b55020ee6eb7211b5fdc0a0dd8568"), fraction: 9, doors: [{ hash: 1662086909, x: -1861.76, y: 2054.07, z: 141.29 },{ hash: 1662086909, x: -1859.29, y: 2054.07, z: 141.29 }], pos: { x: -1860.61, y: 2054.00, z: 141.01}, defaultOpened: true},
        { text: langStringDefault("doors.89e1cb7d613a42a3aea133531acdb32a"), fraction: 9, doors: [{ hash: -1687047623, x: -1876.10, y: 2057.71, z: 141.11 }], pos: { x: -1875.88, y: 2058.39, z: 140.99}, defaultOpened: true},
        { text: langStringDefault("doors.169f02619148b39cf049f387264b70a1"), fraction: 9, doors: [{ hash: -1687047623, x: -1890.48, y: 2068.24, z: 145.66 }], pos: { x: -1890.77, y: 2067.60, z: 145.51}, defaultOpened: true},
        { text: langStringDefault("doors.85a2815004476c1f78cc6abf1e615793"), fraction: 9, doors: [{ hash: -1687047623, x: -1883.43, y: 2055.98, z: 145.66 }], pos: { x: -1884.12, y: 2056.17, z: 145.51}, defaultOpened: true},
        { text: langStringDefault("doors.1991480b82d04f7f72ab281e8f65ebbf"), fraction: 9, doors: [{ hash: -1687047623, x: -1882.05, y: 2057.23, z: 145.57 }], pos: { x: -1882.28, y: 2056.56, z: 145.51}, defaultOpened: true},
        { text: langStringDefault("doors.68dd59adc7e7a9ca7bced8f151bc34fe"), fraction: 9, doors: [{ hash: 747539127, x: -1881.00, y: 2060.67, z: 144.51 }], pos: { x: -1881.13, y: 2060.27, z: 145.51}, defaultOpened: true},
        // { text: "Подвал", fraction: 9, doors: [{ hash: -1572669922, x: -1932.84, y: 2050.66, z: 139.82 }], pos: { x: -1933.00, y: 2049.92, z: 140.82}},

        //yakuza
        { text: langStringDefault("doors.edaeb51798af2e358caa5273a74bb6f1"), fraction: 23, doors: [{ hash: 1039647283, x: -336.10, y: 206.45, z: 89.45 },{ hash: 1039647283, x: -338.51, y: 207.43, z: 89.45 }], pos: { x: -337.41, y: 206.96, z: 88.58}, defaultOpened: true},
        { text: langStringDefault("doors.09ac744ed9e8d484a8fd5524fbd63d51"), fraction: 23, doors: [{ hash: 866758039, x: -349.39, y: 179.50, z: 88.10 },{ hash: 866758039, x: -347.24, y: 179.50, z: 88.10 }], pos: { x: -348.29, y: 179.52, z: 87.94}, defaultOpened: true},
        { text: langStringDefault("doors.af307f1527b0c45de90cc351dd509006"), fraction: 23, doors: [{ hash: -1687047623, x: -335.20, y: 188.34, z: 88.71 }], pos: { x: -335.94, y: 188.30, z: 88.57}, defaultOpened: true},
        { text: langStringDefault("doors.fb206398f7089d760648703ae7dc1256"), fraction: 23, doors: [{ hash: -121180812, x: -348.75, y: 194.10, z: 88.72 }], pos: { x: -348.71, y: 193.56, z: 88.57}, defaultOpened: true},
        { text: langStringDefault("doors.5c081233984becc200374b55f8616822"), fraction: 23, doors: [{ hash: -121180812, x: -344.98, y: 190.35, z: 95.34 }], pos: { x: -344.89, y: 190.99, z: 95.19}, defaultOpened: true},
        { text: langStringDefault("doors.06ebf7000cc2d9be13accb5e58dd13a1"), fraction: 23, doors: [{ hash: -121180812, x: -351.94, y: 191.08, z: 95.34 }], pos: { x: -351.98, y: 190.52, z: 95.19}, defaultOpened: true},
        { text: langStringDefault("doors.6730d2863a05b6d3a9be1ffd1efd9fdc"), fraction: 23, doors: [{ hash: -121180812, x: -347.58, y: 195.83, z: 95.34 }], pos: { x: -348.14, y: 195.81, z: 95.19}, defaultOpened: true},

        //GANG
        //Ballas
        // { text: "Вход в гараж", fraction: 18, doors: [{ hash: 539180131, x: 105.85, y: -1964.97, z: 20.90 }], pos: { x: 105.95, y: -1964.31, z: 20.88}, defaultOpened: true},
        // { text: "Вход на лестницу", fraction: 18, doors: [{ hash: -1835483074, x: 103.42, y: -1963.44, z: 19.87 }], pos: { x: 104.10, y: -1963.53, z: 20.87}, defaultOpened: true},
        // { text: "Оружейная", fraction: 18, doors: [{ hash: -710818483, x: 89.24, y: -1958.20, z: 15.40 }], pos: { x: 88.47, y: -1958.03, z: 15.26}, defaultOpened: true},
        // { text: "Лабораторная", fraction: 18, doors: [{ hash: -710818483, x: 88.89, y: -1962.10, z: 15.41 }], pos: { x: 88.17, y: -1962.09, z: 15.26}, defaultOpened: true}
        //  { text: "Вход", fraction: 19, doors: [{ hash: 2370261621, x: 101.4777, y: -20.87931, z: 20.88 }], pos: { x: 100.96, y: -1964.26, z: 20.87}, defaultOpened: true},
        //{ text: "Вход", fraction: 21, doors: [{ hash: 2120064279, x: -1721.458, y: -20.87931, z: 17.6739}], pos: { x: -492.15, y: -1720.93, z: 18.67}, defaultOpened: true},
        // { text: "Вход", fraction: 20, doors: [{ hash: 3630385052, x: 496.3792, y:  -1341.297, z: 29.52036}], pos: { x: 495.79, y: -1341.13, z: 29.36}, defaultOpened: true},
        //  { text: "Вход", fraction: 21, doors: [{ hash: 3584148813, x: 848.4344, y:  -2204.545, z: 30.42788}], pos: { x: 848.05, y: -2203.66, z: 30.28}, defaultOpened: true},

        //Bloods
          { text: langStringDefault("doors.860c3cdf1b278bd4626ca058adb64b38"), fraction: 21, doors: [{ hash: -35610440, x: -470.44, y: -1722.93, z: 18.91}], pos: { x: -470.56, y: -1722.24, z: 18.77}, defaultOpened: true},
          { text: langStringDefault("doors.55c5cf451e07205684571c2288c0928a"), fraction: 21, doors: [{ hash: -35610440, x: -484.22, y: -1729.65, z: 19.82}], pos: { x: -485.08, y: -1729.69, z: 19.67}, defaultOpened: true},
          { text: langStringDefault("doors.b43f58665c02f27de2501956513fcff0"), fraction: 21, doors: [{ hash: -35610440, x: -483.51, y: -1728.13, z: 19.68}], pos: { x: -483.93, y: -1727.58, z: 19.51}, defaultOpened: true},
          { text: langStringDefault("doors.7bf82c1b410989168b59a3055d08faa4"), fraction: 21, doors: [{ hash: -35610440, x: -485.73, y: -1719.85, z: 19.72}], pos: { x: -485.43, y: -1720.60, z: 19.57}, defaultOpened: true},
          { text: langStringDefault("doors.bee22458918136abc2e1040a97aa7568"), fraction: 21, doors: [{ hash: 1093926891, x:-1387.088, y:-586.5935, z:30.45739},{ hash: 1093926891, x:-1389.197, y:-587.9832, z:30.45739} ], pos: { x: -1388.32, y: -587.02, z: 30.22}, defaultOpened: true},

          // Ballas
          { text: langStringDefault("doors.08360f8e861c5adc5a91e108d372cef9"), fraction: 18, doors: [{ hash: 4259356856, x: 893.1168, y: -2171.419, z: 32.54395}], pos: { x: 892.44, y: -2171.44, z: 32.39}, defaultOpened: true},
          { text: langStringDefault("doors.2ab4c9e7bb2c6d8f6216bd13b39f26a5"), fraction: 18, doors: [{ hash: 4259356856, x:884.3304, y:-2163.563, z:32.4353}], pos: { x: 884.35, y: -2162.83, z: 32.28}, defaultOpened: true},
          

          // Marabunta
          { text: langStringDefault("doors.ad898595a92065372f74dab46292b19d"), fraction: 20, doors: [{ hash: 1173348778, x:452.0893, y:-1305.413, z:30.35599}], pos: { x: 452.88, y: -1305.54, z: 30.12}, defaultOpened: true},

          // Vagos
          { text: langStringDefault("doors.05826286d21fc2d97bfcebe55dd14a20"), fraction: 22, doors: [{ hash: 2374820049, x:500.0611, y:-1962.585, z:25.16408}], pos: { x: 500.88, y: -1962.96, z: 25.06}, defaultOpened: true},
          { text: langStringDefault("doors.21ca5b3fbc5dab604e9697d987f0399c"), fraction: 22, doors: [{ hash: 2374820049, x:502.4556, y:-1966.44, z:25.16417}], pos: { x: 502.17, y: -1965.70, z: 25.06}, defaultOpened: true},

          // LSPD New
          { text: langStringDefault("doors.82514cab48015c778e9351420b14311e"), fraction: 2, doors: [{ hash: 2974090917, x:471.3868, y:-986.3861, z:28.23847 }, {hash: 2974090917, x:468.783,  y:-986.3882, z:28.23847}], pos: { x: 470.08, y: -985.97, z: 28.09}, defaultOpened: true},
          { text: langStringDefault("doors.25d70e1f6a44a64ef3c87fd93c54f975"), fraction: 2, doors: [{ hash: 4163671155, x:468.7839, y:-993.9683, z:28.23798 }, {hash: 4163671155, x:471.3859,  y:-993.9683, z:28.23798}], pos: { x: 469.98, y: -994.12, z: 28.09}, defaultOpened: true},
          { text: langStringDefault("doors.0d18115fbc7a3fe37f99bea98a36e254"), fraction: 2, doors: [{ hash: 2372686273, x:452.8327, y:-988.2734, z:35.95989 }, {hash: 2372686273, x:452.8327,  y:-990.3912, z:35.95989}], pos: { x: 452.73, y: -989.31, z: 35.68}, defaultOpened: true},
          { text: langStringDefault("doors.fc7e54ee754b23dbcf598a197be04f9e"), fraction: 2, doors: [{ hash: 2974090917, x:459.9573, y:-991.5281, z:35.83414 }, {hash: 2974090917, x:459.9565,  y:-988.9236, z:35.83414}], pos: { x: 459.95, y: -990.31, z: 35.68}, defaultOpened: true},
          { text: langStringDefault("doors.2e26ede8b2b071e9e052fa5bf1545457"), fraction: 2, doors: [{ hash: 2974090917, x:459.9573, y:-991.5283, z:30.83918 }, {hash: 2974090917, x:459.9573,  y:-988.9244, z:30.83918}], pos: { x: 460.03, y: -990.11, z: 30.69}, defaultOpened: true},
          { text: langStringDefault("doors.08a7c09c4a00d0c86734260b15d5624e"), fraction: 2, doors: [{ hash: 4163671155, x:462.2406, y:-988.9244, z:25.86339 }, {hash: 4163671155, x:462.2434,  y:-991.5268, z:25.86339}], pos: {  x: 462.09, y: -990.23, z: 25.71}, defaultOpened: true},
          { text: langStringDefault("doors.c978a356e37156a1e2c640bdd14996f5"), fraction: 2, doors: [{ hash: 4163671155, x:468.7828, y:-986.3874, z:23.46275 }, {hash: 4163671155, x:471.3876,  y:-986.3874, z:23.46275}], pos: {  x: 470.33, y: -986.36, z: 23.31}, defaultOpened: true},
          { text: langStringDefault("doors.02bbfd45c015331614d9925a2fba032d"), fraction: 2, doors: [{ hash: 4163671155, x:471.3864, y:-993.9685, z:23.46061 }, {hash: 4163671155, x:468.7833,  y:-993.9685, z:23.46061}], pos: {  x: 470.03, y: -993.29, z: 23.31}, defaultOpened: true},
         { text: langStringDefault("doors.71cf5b8ad69c7b78db6c92c7c07dccb3"), fraction: 2, doors: [{ hash: 2233064549, x:470.7346, y:-977.412, z:23.4634}], pos: { x: 469.99, y: -977.68, z: 23.31}, defaultOpened: true},
         { text: langStringDefault("doors.08b528631dce7d0c3902b1432b30fd6b"), fraction: 2, doors: [{ hash: 2233064549, x:473.623, y:-972.9127, z:23.4634}], pos: { x: 473.12, y: -972.38, z: 23.31}, defaultOpened: true},
         { text: langStringDefault("doors.74f7b2eee5a236c6613fd198d82f3203"), fraction: 2, doors: [{ hash: 2233064549, x:473.6221, y:-966.6074, z:23.4634}], pos: { x: 472.95, y: -966.00, z: 23.31}, defaultOpened: true},
         { text: langStringDefault("doors.3fc54850dc80730fb21a89aa8cbcd8cb"), fraction: 2, doors: [{ hash: 2233064549, x:473.621, y:-960.3025, z:23.4634}], pos: { x: 472.99, y: -959.90, z: 23.31}, defaultOpened: true},
         { text: langStringDefault("doors.74dd4d771575886b76903364b13fe5d5"), fraction: 2, doors: [{ hash: 2233064549, x:467.468, y:-959.3839, z:23.4634}], pos: { x: 467.35, y: -959.97, z: 23.31}, defaultOpened: true},
         { text: langStringDefault("doors.331e151c0576ca63cacaca9d5f178be1"), fraction: 2, doors: [{ hash: 2233064549, x:467.4684, y:-965.69, z:23.4634}], pos: { x: 467.30, y: -966.31, z: 23.31}, defaultOpened: true},
         { text: langStringDefault("doors.41bf78dc12ad78fffcb44923a8c9dc8b"), fraction: 2, doors: [{ hash: 2233064549, x:467.4698, y:-971.9943, z:23.4634}], pos: { x: 467.37, y: -972.56, z: 23.31}, defaultOpened: true},

        
        
        
        
         //ems
        { text: langStringDefault("doors.d8bde0ac03b1ef7292c55ed13a61e878"), fraction: 16, doors: [{ hash: 1415151278, x:298.2036, y:-592.9224, z:43.40875}], pos: { x: 298.74, y: -593.34, z: 43.26}, defaultOpened: true},
        { text: langStringDefault("doors.1fb7c9598327b0d36a70289c9511a9fa"), fraction: 16, doors: [{ hash: 1415151278, x:298.2036, y:-592.9224, z:43.40875}], pos: { x: 305.23, y: -595.27, z: 43.26}, defaultOpened: true},
        { text: langStringDefault("doors.9d06502a08b67adce80d74a0a6bb16b6"), fraction: 16, doors: [{ hash: 1415151278, x:304.5355, y:-595.2271, z:43.40875}], pos: { x: 311.80, y: -597.61, z: 43.26}, defaultOpened: true},

          //LCN
        // { text: "Вход 1", fraction: 25, doors: [{ hash: 4242392117, x:1409.292, y:1146.254, z:114.4869 }, {hash: 4242392117, x:1409.292,  y:1148.454, z:114.4869}], pos: { x: 1409.24, y: 1145.19, z: 114.33}, defaultOpened: true},
        // { text: "Вход 2", fraction: 25, doors: [ {hash: 4242392117, x:1409.292 ,  y:1146.254, z:114.4869}, { hash: 4242392117, x:1409.292, y:1144.054, z:114.4869 }], pos: { x: 1409.12, y: 1147.64, z: 114.33}, defaultOpened: true},
        // { text: "Вход 3", fraction: 25, doors: [{ hash: 4242392117, x:1409.292, y:1148.454, z:114.4869 }, {hash: 4242392117, x:1409.292  ,  y:1150.654, z:114.4869}], pos: { x: 1409.16, y: 1149.70, z: 114.33}, defaultOpened: true},
        // { text: "Вход 4", fraction: 25, doors: [{ hash: 4242392117, x:1408.58, y:1158.967, z:114.4827 }, {hash: 4242392117, x:1408.58  ,  y:1161.168, z:114.4827}], pos: { x: 1408.61, y: 1159.82, z: 114.33}, defaultOpened: true},
        // { text: "Вход 5", fraction: 25, doors: [{ hash: 4242392117, x:1408.578, y:1165.833, z:114.4827 }, {hash: 4242392117, x:1408.578  ,  y:1163.632, z:114.4827}], pos: { x: 1408.72, y: 1164.85, z: 114.33}, defaultOpened: true},
        // { text: "Вход 6", fraction: 25, doors: [{ hash: 2567541138, x:1395.906, y:1142.904, z:114.7907 }, {hash: 2567541138, x:1395.906  ,  y:1140.705, z:114.4827}], pos: { x: 1395.49, y: 1141.79, z: 114.64}, defaultOpened: true},
        // { text: "Вход 7", fraction: 25, doors: [{ hash: 4242392117, x:1390.666, y:1131.117, z:114.4808 }, {hash: 4242392117, x:1390.666  ,  y:1133.317, z:114.4808}], pos: { x: 1390.40, y: 1132.13, z: 114.33}, defaultOpened: true},
        { text: langStringDefault("doors.ed94e154948fa6b0f71760d723c3cb8b"), fraction: 25, doors: [{ hash: 3262795659, x:1390.488, y:1161.237, z:114.4817 }, {hash: 3262795659, x:1390.488  ,  y:1163.438, z:114.4817}], pos: { x: 1390.18, y: 1162.36, z: 114.33}, defaultOpened: true},
        { text: langStringDefault("doors.ace28268b7674a3f7267d88d8a773590"), fraction: 25, doors: [{ hash: 736699661, x:1407.688, y:1128.333, z:114.4977}], pos: { x: 1406.82, y: 1127.87, z: 114.33}, defaultOpened: true},

    // Jail
    { text: langStringDefault("doors.b11ed04c1adedbb80796500055c6bbbf"), fraction: 7, doors: [{ hash: 1716321923, x: 1691.49, y: 2577.84, z: 45.68}], pos: { x: 1691.49, y: 2577.84, z: 45.68}, defaultOpened: false},
    { text: langStringDefault("doors.caafa39d885870c925eacb9b35b1bf19"), fraction: 7, doors: [{ hash: 1716321923, x: 1688.72, y: 2571.60, z: 45.68}], pos: { x: 1689.24, y: 2571.32, z: 45.68}, defaultOpened: false},
    { text: langStringDefault("doors.4299c31df6b432bdcd5698e83dbc2961"), fraction: 7, doors: [{ hash: 1716321923, x: 1693.94, y: 2571.60, z: 45.68}], pos: { x: 1693.49, y: 2571.36, z: 45.68}, defaultOpened: false},
    { text: langStringDefault("doors.2e80b22171af48acba69abca8746a592"), fraction: 7, doors: [{ hash: 1716321923, x:1670.523, y:2467.454, z:46.13116}], pos: { x: 1670.90, y: 2466.70, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.2c94d51e07b997ba3a83e380b796a372"), fraction: 7, doors: [{ hash: 1716321923, x:1670.688, y:2460.736, z:46.12994}], pos: { x: 1671.05, y: 2459.56, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.5509f5457b3cb5cb48e601e03705c4ea"), fraction: 7, doors: [{ hash: 1716321923, x: 1670.69, y: 2455.92, z: 50.00}], pos: { x: 1671.18, y: 2455.69, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.966a0bb4f18de4c4541f51fe47c6b86e"), fraction: 7, doors: [{ hash: 1716321923, x:1670.693, y:2457.011, z:50.14636}], pos: { x: 1671.03, y: 2459.53, z: 50.00}, defaultOpened: true},
    //{ text: "Kamera 4", fraction: 7, doors: [{ hash: 1716321923, x:1670.688, y:2457.012, z:46.12994}], pos: { x: 1670.38, y: 2456.13, z: 45.98}, defaultOpened: false},
    { text: langStringDefault("doors.2ed9674a89655ea59add3a95dbac187a"), fraction: 7, doors: [{ hash: 1716321923, x:1670.688, y:2457.012, z:46.12994}], pos: { x: 1671.00, y: 2455.85, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.b8fb4d469e1217f2e056d19bc703fc1a"), fraction: 7, doors: [{ hash: 1716321923, x:1670.693, y:2453.287, z:50.14636}], pos: { x: 1670.41, y: 2452.49, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.6e24d2f16d26ae1bc6c07a3eb85a1208"), fraction: 7, doors: [{ hash: 1716321923, x:1670.688, y:2453.286, z:46.12994}], pos: { x: 1671.03, y: 2452.10, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.63ecf51c23e5a47720f5ca8a8d672752"), fraction: 7, doors: [{ hash: 1716321923, x:1670.693, y:2449.561, z:50.14636}], pos: { x: 1671.04, y: 2448.33, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.39a35ed7202fc9360493c0b0698481a9"), fraction: 7, doors: [{ hash: 1716321923, x:1670.688, y:2449.561, z:46.12994}], pos: { x: 1671.02, y: 2448.39, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.ffb1f7b24bf92e48e6df2974968c4b3c"), fraction: 7, doors: [{ hash: 1716321923, x:1670.693, y:2445.841, z:50.14636}], pos: { x: 1671.01, y: 2444.64, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.d6d5b5b9e683c6faff5cac03c10699a6"), fraction: 7, doors: [{ hash: 1716321923, x:1670.688, y:2445.839, z:46.12994}], pos: { x: 1670.99, y: 2444.73, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.a771f6c9e2cba7ab0ffe63a62d670a1a"), fraction: 7, doors: [{ hash: 1716321923, x:1675.566, y:2440.924, z:50.14619}], pos: { x: 1674.42, y: 2441.24, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.30d30ee0f24c64e67f59a3ff3006f589"), fraction: 7, doors: [{ hash: 1716321923, x:1675.565, y:2440.925, z:46.13091}], pos: { x: 1674.37, y: 2441.24, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.d66ef443c4fa10160b1a9672887d7bad"), fraction: 7, doors: [{ hash: 1716321923, x:1679.081, y:2440.924, z:50.14619}], pos: { x: 1677.89, y: 2441.23, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.b1801af85d82483df7abc11601bef807"), fraction: 7, doors: [{ hash: 1716321923, x:1679.082, y:2440.925, z:46.13091}], pos: { x: 1677.95, y: 2441.24, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.589a29915c69fc18aa0a27020c1182a3"), fraction: 7, doors: [{ hash: 1716321923, x:1682.625, y:2440.924, z:50.14619}], pos: { x: 1681.53, y: 2441.27, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.32c5cd2bd92ab06eb3f3e86c08f97d24"), fraction: 7, doors: [{ hash: 1716321923, x:1682.62, y:2440.925, z:46.13091}], pos: { x: 1681.44, y: 2441.27, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.6dfe0c48bd940d777c994d571233e70b"), fraction: 7, doors: [{ hash: 1716321923, x:1686.345, y:2440.925, z:46.13091}], pos: { x: 1685.18, y: 2441.26, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.f83f5bc83b8484f0f56fb373b2945f5e"), fraction: 7, doors: [{ hash: 1716321923, x:1686.345, y:2440.924, z:50.14619}], pos: { x: 1685.17, y: 2441.25, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.42ab973d697295cf27170a56f11aaefa"), fraction: 7, doors: [{ hash: 1716321923, x:1690.071, y:2440.924, z:50.14619}], pos: { x: 1688.87, y: 2441.28, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.7d5d0089cba2c41ef11b7ca4396f5b72"), fraction: 7, doors: [{ hash: 1716321923, x:1690.071, y:2440.924, z:46.13091}], pos: { x: 1688.86, y: 2441.26, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.fbed108d95587570322f2ef21eda1032"), fraction: 7, doors: [{ hash: 1716321923, x:1693.796, y:2440.924, z:46.13091}], pos: { x: 1692.70, y: 2441.24, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.647664cdf6a34a1f91f17765ed39e7c5"), fraction: 7, doors: [{ hash: 1716321923, x:1693.796, y:2440.925, z:50.14619}], pos: { x: 1692.69, y: 2441.27, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.db1a813bb8f8d82137af0564f973b252"), fraction: 7, doors: [{ hash: 1716321923, x:1697.52, y:2440.925, z:50.14619}], pos: { x: 1696.42, y: 2441.25, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.b610d63ded8087baa7d785204e1d7d43"), fraction: 7, doors: [{ hash: 1716321923, x:1697.52, y:2440.925, z:46.13091}], pos: { x: 1696.44, y: 2441.27, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.962f9878cbcbd25eab0f42094aafd863"), fraction: 7, doors: [{ hash: 1716321923, x:1701.245, y:2440.925, z:50.14619}], pos: { x: 1700.11, y: 2441.23, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.ed2569d6c33d03a15496acdffc97d47b"), fraction: 7, doors: [{ hash: 1716321923, x:1701.245, y:2440.925, z:46.13091}], pos: { x: 1700.07, y: 2441.24, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.efafc2eb95dd6093e26d9071c65ba9c4"), fraction: 7, doors: [{ hash: 1716321923, x:1704.971, y:2440.924, z:50.14619}], pos: { x: 1703.89, y: 2441.23, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.1f87c1df01f902fb431f9c9ca3defbc3"), fraction: 7, doors: [{ hash: 1716321923, x:1704.971, y:2440.924, z:46.13091}], pos: { x: 1703.77, y: 2441.28, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.b6c008d505effce156a372ddcaa72f3f"), fraction: 7, doors: [{ hash: 1716321923, x:1708.694, y:2440.924, z:50.14619}], pos: { x: 1707.58, y: 2441.23, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.ff77551ee4a54f223c61f8b140d3f249"), fraction: 7, doors: [{ hash: 1716321923, x:1708.694, y:2440.924, z:46.13091}], pos: { x: 1707.51, y: 2441.32, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.604dea64a5470ad87f409b7e2e186eb4"), fraction: 7, doors: [{ hash: 1716321923, x:1712.421, y:2440.924, z:50.14619}], pos: { x: 1711.26, y: 2441.24, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.62784404ceee092070b203d11a30933c"), fraction: 7, doors: [{ hash: 1716321923, x:1712.421, y:2440.924, z:46.13091}], pos: { x: 1711.29, y: 2441.24, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.5fcc1b860de600db62eaed5cead9e08a"), fraction: 7, doors: [{ hash: 1716321923, x:1715.086, y:2445.84, z:50.14321}], pos: { x: 1714.75, y: 2444.74, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.87953cb82ed8cb766012421ab99eefce"), fraction: 7, doors: [{ hash: 1716321923, x:1715.086, y:2445.84, z:46.12989}], pos: { x: 1714.76, y: 2444.62, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.3bf5748bca1f7e6077abfa5135b38594"), fraction: 7, doors: [{ hash: 1716321923, x:1715.086, y:2449.561, z:50.14321}], pos: { x: 1714.77, y: 2448.39, z: 50.00}, defaultOpened: true},
    //{ text: "Kamera 37", fraction: 7, doors: [{ hash: 1716321923, x:1715.087, y:2449.561, z:46.12989}], pos: { x: 1715.23, y: 2448.81, z: 45.98}, defaultOpened: false},
    { text: langStringDefault("doors.4bf3388cdf4e0a85f67900fe780602b5"), fraction: 7, doors: [{ hash: 1716321923, x:1715.087, y:2449.561, z:46.12989}], pos: { x: 1714.78, y: 2448.38, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.1cef7c38faf24674f8175dad75465508"), fraction: 7, doors: [{ hash: 1716321923, x:1715.086, y:2453.287, z:50.14321}], pos: { x: 1714.78, y: 2452.08, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.f86cbde120ad11e30bc17eca4a3947f8"), fraction: 7, doors: [{ hash: 1716321923, x:1715.087, y:2453.287, z:46.12989}], pos: { x: 1714.78, y: 2452.12, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.4e7ffccbfd2c669e12646ef19d2dd7db"), fraction: 7, doors: [{ hash: 1716321923, x:1715.086, y:2457.012, z:50.14321}], pos: { x: 1714.75, y: 2455.87, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.2a1fb5e16dfe49b1c18ecb175867ba05"), fraction: 7, doors: [{ hash: 1716321923, x:1715.087, y:2457.012, z:46.12989}], pos: { x: 1714.74, y: 2455.81, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.b5e74a8003696b07e9023ad3dbde5020"), fraction: 7, doors: [{ hash: 1716321923, x:1715.086, y:2460.737, z:50.14321}], pos: { x: 1714.77, y: 2459.61, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.b2c703d4170230d615bf3b59896e490c"), fraction: 7, doors: [{ hash: 1716321923, x:1715.087, y:2460.735, z:46.12989}], pos: { x: 1714.78, y: 2459.64, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.c4af9d57347564e9b89fb503c8f38142"), fraction: 7, doors: [{ hash: 1716321923, x:1715.256, y:2466.154, z:46.13197}], pos: { x: 1715.04, y: 2467.00, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.fa80d1f0216ad82741d626113f57ac46"), fraction: 7, doors: [{ hash: 1716321923, x:1670.906, y:2481.484, z:46.12421}], pos: { x: 1670.18, y: 2481.15, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.4f527c0ea7d7168edaa3ab8561332466"), fraction: 7, doors: [{ hash: 3256632098, x:1703.325, y:2475.592, z:46.12902}], pos: { x: 1703.80, y: 2476.14, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.b94682e9e0ec4f8a15f223444ca9ab6d"), fraction: 7, doors: [{ hash: 3256632098, x:1681.741, y:2476.279, z:46.13059}], pos: { x: 1682.31, y: 2475.92, z: 45.95}, defaultOpened: true},
    { text: langStringDefault("doors.93575be1ab2255a48947f07df36508bc"), fraction: 7, doors: [{ hash: 4165413875, x:1707.291, y:2474.066, z:46.13017}], pos: { x: 1706.57, y: 2474.29, z: 45.98}, defaultOpened: false},
    { text: langStringDefault("doors.5e00acee0417c8ab109bf4d0c828b466"), fraction: 7, doors: [{ hash: 4165413875, x:1699.737, y:2468.822, z:46.1289}], pos: { x: 1698.75, y: 2469.00, z: 45.98}, defaultOpened: false},
    { text: langStringDefault("doors.793fd0cd7bad61c6c912eb15cf9cab92"), fraction: 7, doors: [{ hash: 4165413875, x:1687.397, y:2468.821, z:46.12875}], pos: { x: 1686.60, y: 2469.00, z: 45.98}, defaultOpened: false},
    { text: langStringDefault("doors.ba0e2b8df18de03b585b15731dfb8791"), fraction: 7, doors: [{ hash: 4165413875, x:1679.846, y:2473.969, z:46.131}], pos: { x: 1678.83, y: 2473.84, z: 45.98}, defaultOpened: false},
    { text: langStringDefault("doors.cc5f096f5740bb619e3bf7a21c87fc9a"), fraction: 7, doors: [{ hash: 4165413875, x:1667.854, y:2476.09, z:46.12963}], pos: { x: 1667.06, y: 2475.86, z: 45.98}, defaultOpened: true},
    { text: langStringDefault("doors.8b2377c9a9b3b39779c22041637e093b"), fraction: 7, doors: [{ hash: 4165413875, x:1691.794, y:2457.103, z:50.14656}], pos: { x: 1691.89, y: 2457.92, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.4fe326ff25efab4685cfb08ee1f9c6b7"), fraction: 7, doors: [{ hash: 4165413875, x:1693.499, y:2457.103, z:50.14393}], pos: { x: 1693.37, y: 2457.87, z: 50.00}, defaultOpened: true},
    { text: langStringDefault("doors.1f3443c764ee846bb1b63967294f5730"), fraction: 7, doors: [{ hash: 1716321923, x:1775.296, y:2510.252, z:46.11236}], pos: { x: 1775.22, y: 2511.17, z: 45.96}, defaultOpened: true},
    { text: langStringDefault("doors.96b02d5e666fdff8d0f077ae809fd611"), fraction: 7, doors: [{ hash: 1716321923, x:1735.905, y:2489.012, z:46.11648}], pos: { x: 1736.34, y: 2488.18, z: 45.96}, defaultOpened: true},
    { text: langStringDefault("doors.09a929a3745d12fc9c1081814ff8e97b"), fraction: 7, doors: [{ hash: 3256632098, x:1741.226, y:2502.28, z:46.11132}], pos: { x: 1742.06, y: 2502.32, z: 45.81}, defaultOpened: true},
    { text: langStringDefault("doors.2df013e3003538b561c87421efef1ae9"), fraction: 7, doors: [{ hash: 3256632098, x:1760.222, y:2512.462, z:46.11219}], pos: { x: 1760.75, y: 2513.03, z: 45.961}, defaultOpened: true},
    { text: langStringDefault("doors.a2ee17e96107525536dcb2b55bc2a596"), fraction: 7, doors: [{ hash: 1716321923, x:1652.437, y:2482.25, z:46.1146}], pos: { x: 1651.52, y: 2482.68, z: 45.97}, defaultOpened: true},
    { text: langStringDefault("doors.2ed488e95253418f32ca10bf0144772b"), fraction: 7, doors: [{ hash: 1716321923, x:1649.779, y:2484.48, z:46.1146}], pos: { x: 1649.01, y: 2485.12, z: 45.97}, defaultOpened: true},
    { text: langStringDefault("doors.e7d87a1328b4878ce3858a40e373f0a7"), fraction: 7, doors: [{ hash: 1716321923, x:1641.461, y:2475.016, z:46.12078}], pos: { x: 1640.75, y: 2474.66, z: 45.97}, defaultOpened: true},
    { text: langStringDefault("doors.61ce81b8276d63f75a4cc7d7ecd5e424"), fraction: 7, doors: [{ hash: 1716321923, x:1616.702, y:2512.111, z:46.12175}], pos: { x: 1616.17, y: 2512.72, z: 45.97}, defaultOpened: true},
    { text: langStringDefault("doors.4b008e82b63db4b7accaa63869ee9b0f"), fraction: 7, doors: [{ hash: 1716321923, x:1614.043, y:2514.342, z:46.12175}], pos: { x: 1613.63, y: 2515.07, z: 45.97}, defaultOpened: true},
]