import { langStringDefault } from "../lang/index";
import {CASINO_MAIN_DIMENSION, CHIPS_TYPES, CHIPS_TYPES_SUM} from "./main";
/** Смещение позиции фишек по оси Z */
export const GRID_START_Z = 0.9448;

export const ROULETTE_STATENAMES = [langStringDefault("casino.roulette.e9e6065d3d002fe3cbf3dbeaf2ebb689"), langStringDefault("casino.roulette.94d7b3babf07e22e81c412273eac1236"), langStringDefault("casino.roulette.3ad6ce98f236d78b23fd13f2f5c54942")];
export const enum ROULETTE_STATENAMES_ID {
    /** Ожидание, можно делать ставки */
    WAIT = 0,
    /** Ставки больше не принимаются */
    BET_END = 1,
    /** Рулетка запустилась */
    START = 2,
}
/** Сколько ставок на стол может сделать игрок */
export const ROULETTE_MAX_BETS = 3;
/** Сколько ставок на стол могут сделать игроки в сумме */
export const ROULETTE_MAX_BETS_TABLE = 30;
/** Модель пропа стола */
export const ROULETTE_TABLE_MODEL = "vw_prop_casino_roulette_01";
/** Дистанция на котрой можно подключится к столу */
export const ROULETTE_TABLE_ENTER_DISTANCE = 3;
/** Дистация от точки позади сидения, на которой можно подключится к столу */
export const ROULETTE_TABLE_ENTER_DISTANCE_SEAT = 1;
/** Цвет стола */
export const ROULETTE_TABLE_COLOR = 0;
/** Цвет VIP стола */
export const ROULETTE_VIP_TABLE_COLOR = 1;
/** Сколько секунд даётся на ставку в рулетке */
export const ROULETTE_BET_TIME = 30;
/** Координаты размещения игроков */
export const ROULETTE_TABLE_SEATS_POSITIONS: [number, number, number, number, number, number, number][] = [
    [-0.20, -1.0, 0.70, 0, -0.20, -0.84, 0], // x: -0.20, -1.00, 0.70, h: 0, model: 623773339, needTp: false
    [0.77, -1.05, 0.70, 0, 0.78, -0.825, 0], // x: 0.76, -1.00, 0.70, h: 0, model: 623773339, needTp: false
    [1.50, -0.14, 0.70, 90, 1.35, -0.10, 100], // x: 1.50, -0.14, 0.70, h: 90, model: 623773339, needTp: false
    [0.76, 0.72, 0.70, 180, 0.78, 0.63, 180], // x: 0.76, 0.72, 0.70, h: 180, model: 623773339, needTp: false
]
/** Какую сумму мы считаем большим выигрышем ну или большим проигрышем */
export const ROULETTE_SUM_AS_BIG_WIN = 1000;


export interface ROULETTETableItem {
    /** Позиция стола */
    position: Vector3Mp,
    /** Угол поворота стола */
    heading: number,
    /** Доступные для игры фишки */
    chipTypePrices: CHIPS_TYPES_SUM[],
    /** Стол для вип игроков */
    isVip: boolean,
    /** Измерение в котором создаётся стол */
    dimension: number,
    dealer: number,
}

/** Базовые столы для рулетки */
export const ROULETTE_TABLE_POSITIONS:ROULETTETableItem[] = [
    {
        position: new mp.Vector3(1133.791, 262.3499, -52.04345),
        heading: 208,
        chipTypePrices: [100, 500, 1000],
        isVip: true,
        dimension: CASINO_MAIN_DIMENSION,
        dealer: 1
    },
    {
        position: new mp.Vector3(1129.629, 266.5121, -52.04345),
        heading: 40,
        chipTypePrices: [100, 500, 1000],
        isVip: true,
        dimension: CASINO_MAIN_DIMENSION,
        dealer: 1
    },
    {
        position: new mp.Vector3(1148.843, 251.3866, -52.04153),
        heading: 273,
        chipTypePrices: [100, 500, 1000],
        isVip: true,
        dimension: CASINO_MAIN_DIMENSION,
        dealer: 1
    },
    {
        position: new mp.Vector3(1144.333, 247.603, -52.04153),
        heading: 115,
        chipTypePrices: [100, 500, 1000],
        isVip: true,
        dimension: CASINO_MAIN_DIMENSION,
        dealer: 1
    },
    {
        position: new mp.Vector3(1148.714, 269.6028, -52.83587),
        heading: 45,
        chipTypePrices: [10, 50, 100],
        isVip: false,
        dimension: CASINO_MAIN_DIMENSION,
        dealer: 2
    },
    {
        position: new mp.Vector3(1149.343, 262.3951, -52.83587),
        heading: 222,
        chipTypePrices: [10, 50, 100],
        isVip: false,
        dimension: CASINO_MAIN_DIMENSION,
        dealer: 2
    }
]




















interface RuleInterface {
    multiplier: number;
    title: string;
    type: string;
    winNumbers: number[]
}

export const mapWinMultiplier: {[key: string]: number} = {
    "number": 35,
    "trio": 11,
    "dozen": 2,
    "small": 1,
    "even": 1,
    "red": 1,
    "black": 1,
    "odd": 1,
    "big": 1,
    "column": 2,
    "split": 17,
    "five-numbers": 6,
    "six-numbers": 5,
    "square": 8,
    "straight": 11,
};

export const mapWinName: {[key: string]: string} = {
    "number": langStringDefault("casino.roulette.7ade52d7c46e0036c93dfbca6fb412c3"),
    "trio": langStringDefault("casino.roulette.754a69d6475c541414b62b7a6cf5bd9a"),
    "dozen": langStringDefault("casino.roulette.fd3ebc481eeeb90f0297ecf7c026fa36"),
    "small": langStringDefault("casino.roulette.0adec770b19492ac6a995e664d991a26"),
    "even": langStringDefault("casino.roulette.c9c06b7318d32e6e238e7ff983e95125"),
    "red": langStringDefault("casino.roulette.21225b111edebe338a61e74d3bd25dda"),
    "black": langStringDefault("casino.roulette.54f1086616fbe385225cef1bf8e98e64"),
    "odd": langStringDefault("casino.roulette.ed9f71efea30610473f3bfa651811e9e"),
    "big": langStringDefault("casino.roulette.21cbc52fa64894fb4332b1036c5e5b31"),
    "column": langStringDefault("casino.roulette.fa1f81be1070ef29e099c473f214907e"),
    "split": langStringDefault("casino.roulette.8a6a81a7d8681db67e42ab91e4f66551"),
    "five-numbers": langStringDefault("casino.roulette.fed35e0a3580026878c1c833cd1d237f"),
    "six-numbers": langStringDefault("casino.roulette.45170aa47af21cc28753b34474e218ec"),
    "square": langStringDefault("casino.roulette.36280358761048be7a897d65cbf6f0a2"),
    "straight": langStringDefault("casino.roulette.d8304455f8209e527f3bfa0ebc7f00de"),
};

export const mapWinDesc: {[key: string]: string} = {
    "number": langStringDefault("casino.roulette.accca5f98a6cacb174d08e877f262cab"),
    "trio": "Trio",
    "dozen": langStringDefault("casino.roulette.fd91b2794d1657cd9f81b7d161fbb3cc"),
    "small": langStringDefault("casino.roulette.365e8049c150b047681fbec1eabe7bcf"),
    "even": langStringDefault("casino.roulette.abf2b95d6dc9aac88dbdc13bb743267a"),
    "red": langStringDefault("casino.roulette.366dd28338a0092a84177c3bae82abb3"),
    "black": langStringDefault("casino.roulette.abf7b1fa57c6aacc58766aedb5f9355d"),
    "odd": langStringDefault("casino.roulette.0a56ec0fab67ba336d585ffb5cc0214e"),
    "big": langStringDefault("casino.roulette.9877c63600b2e6ebbcb668a0db961231"),
    "column": langStringDefault("casino.roulette.f517dc2a702e8a931b9394ef94ade5e9"),
    "split": langStringDefault("casino.roulette.6c92b72e6c83936d92dbf1507b9b01e7"),
    "five-numbers": langStringDefault("casino.roulette.ae5dafb1451c7b983f7c2c0adca50836"),
    "six-numbers": langStringDefault("casino.roulette.75c29128b3dada1c4d49157c4ebb2f21"),
    "square": langStringDefault("casino.roulette.80a0d0929cae5249bcdce2579853d75f"),
    "straight": langStringDefault("casino.roulette.ef4d2e8d8cbfbf333d2324d829aa9dcd"),
};

export const mapWinIcon: {[key: string]: string} = {
    "number": "info-r-09",
    "trio": "info-r-07",
    "dozen": "info-r-03",
    "small": "info-r-01",
    "even": "info-r-02",
    "red": "info-r-02",
    "black": "info-r-02",
    "odd": "info-r-02",
    "big": "info-r-01",
    "column": "info-r-03",
    "split": "info-r-08",
    "five-numbers": "info-r-04",
    "six-numbers": "info-r-04",
    "square": "info-r-06",
    "straight": "info-r-05",
};

const createRulesObject = (title: string, type: string, winNumbers: number[]): RuleInterface => ({
    multiplier: mapWinMultiplier[type],
    title,
    type,
    winNumbers
});

export const ROULETTE_RULES: {[key: string]: RuleInterface} = {
    "0-1-37": createRulesObject(langStringDefault("casino.roulette.239b494702bb3eb7dab28e4e5af2287f"), "trio", [0, 1, 37]),
    "1-36-37": createRulesObject(langStringDefault("casino.roulette.ec5435d8e48ae17df78f1c6789830144"), "trio", [1, 36, 37]),
    "1-2-36": createRulesObject(langStringDefault("casino.roulette.8b5e2deb7a9bdbc929765f81572225d8"), "trio", [1, 2, 36]),
    "0-37": createRulesObject(langStringDefault("casino.roulette.a92fc8ae045d43d873bca38a3d3a6a17"), "split", [0, 37]),
    "1-37": createRulesObject(langStringDefault("casino.roulette.24acd92fc3c9d42e6b3a4a8e938d0be5"), "split", [1, 37]),
    "1-36": createRulesObject(langStringDefault("casino.roulette.6943c8871a61614ae654364ccee0bf02"), "split", [1, 36]),
    "2-36": createRulesObject(langStringDefault("casino.roulette.468e0db5ca294e956ef9d2b7c1b4d598"), "split", [2, 36]),
    "50": createRulesObject(langStringDefault("casino.roulette.58cbd2973b43d769404bf0c89cb60066"), "split", [36, 37]),
    "36-37": createRulesObject(langStringDefault("casino.roulette.0e157b2cbfe37604027fe9600e2d2cbe"), "split", [36, 37]),
    "36": createRulesObject(langStringDefault("casino.roulette.0a490763e75c7d3c49b9189a3fe3443b"), "number", [36]),
    "37": createRulesObject(langStringDefault("casino.roulette.b722f3fd683c021e955fd98040c2c531"), "number", [37]),
    "38": createRulesObject(langStringDefault("casino.roulette.72da38ccc44a0f0ab4a81b305296ab09"), "dozen", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    "39": createRulesObject(langStringDefault("casino.roulette.e3ca4e8d069dfe156a6589ae4709d9f9"), "dozen", [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]),
    "40": createRulesObject(langStringDefault("casino.roulette.9b58782b0169d3b2fa7e0f77c1bb9664"), "dozen", [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]),
    "41": createRulesObject(langStringDefault("casino.roulette.a17131b531e642a2e211b4763f64d0ba"), "small", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]),
    "42": createRulesObject(langStringDefault("casino.roulette.ebd326f363697cfca1a4701612d4b403"), "even", [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35]),
    "43": createRulesObject(langStringDefault("casino.roulette.b266ab519403e3f0adb72284af37c577"), "red", [0, 2, 4, 6, 8, 11, 13, 15, 17, 18, 20, 22, 24, 26, 29, 31, 33, 35]),
    "44": createRulesObject(langStringDefault("casino.roulette.a26c02851eb263d81b80c1eecc0db266"), "black", [1, 3, 5, 7, 9, 10, 12, 14, 16, 19, 21, 23, 25, 27, 28, 30, 32, 34]),
    "45": createRulesObject(langStringDefault("casino.roulette.f97a974f25727d0d89c1d952cbddc6a4"), "odd", [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34]),
    "46": createRulesObject(langStringDefault("casino.roulette.4b201b68c07cd164a628af48b05b3c7e"), "big", [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]),
    "47": createRulesObject(langStringDefault("casino.roulette.b55f178855463b6ad72c9377830493f4"), "column", [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33]),
    "48": createRulesObject(langStringDefault("casino.roulette.703f7b785cd46eb5ac35de853b052504"), "column", [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]),
    "49": createRulesObject(langStringDefault("casino.roulette.ce8237fdedf20bc0d32d92831d20448a"), "column", [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35]),
    "50-51": createRulesObject(langStringDefault("casino.roulette.e422aaee0d5176b1f6bf3f7e1e405061"), "five-numbers", [37, 38, 0, 1, 2])
};

export const redNumbers: number[] = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
for (let i = 0; i < 36; i++) {
    ROULETTE_RULES[i] = createRulesObject(`${i + 1} ${redNumbers.includes(i + 1) ? langStringDefault("casino.roulette.2a70efa3f7c5e6add112e7553b2201da"): langStringDefault("casino.roulette.c290c531ec4c03c1048d05a46bc2e2c0")}`, "number", [i]);
}

for (let i = 0; i < 11; i++) {
    const ix3 = i * 3;

    const rulesSquareFirst = [ix3, ix3 + 1, ix3 + 3, ix3 + 4];
    const rulesSquareSecond = [ix3 + 1, ix3 + 2, ix3 + 4, ix3 + 5];

    ROULETTE_RULES[rulesSquareFirst.join("-")] = createRulesObject(langStringDefault("casino.roulette.7cf6c7bb9f0710570d9833c98a30072e"), "square", rulesSquareFirst);
    ROULETTE_RULES[rulesSquareSecond.join("-")] = createRulesObject(langStringDefault("casino.roulette.b12ed146029725fd17333d1f545e5296"), "square", rulesSquareSecond);

    const splitFirst = [ix3, ix3 + 3];
    const splitSecond = [ix3 + 1, ix3 + 4];
    const splitThree = [ix3 + 2, ix3 + 5];

    ROULETTE_RULES[splitFirst.join("-")] = createRulesObject(langStringDefault("casino.roulette.f777f746b772a89e487ac5b09870cfad"), "split", splitFirst);
    ROULETTE_RULES[splitSecond.join("-")] = createRulesObject(langStringDefault("casino.roulette.7196d8e0d6e6bd54297cd84924e2eef9"), "split", splitSecond);
    ROULETTE_RULES[splitThree.join("-")] = createRulesObject(langStringDefault("casino.roulette.fd4689f6c4ebca1e4dd4a7f84f9fb958"), "split", splitThree);
}

for (let i = 0; i < 12; i++) {
    const ix3 = i * 3;

    const splitFirst = [ix3, ix3 + 1];
    const splitSecond = [ix3 + 1, ix3 + 2];

    ROULETTE_RULES[splitFirst.join("-")] = createRulesObject(langStringDefault("casino.roulette.a0b62afb507031a77372649a6a956eaa"), "split", splitFirst);
    ROULETTE_RULES[splitSecond.join("-")] = createRulesObject(langStringDefault("casino.roulette.13c5597a029820bb27e9e5cdea11b3d1"), "split", splitSecond);
}

for (let i = 51; i < 63; i++) {
    const j = i - 51;
    const jx3 = j * 3;

    ROULETTE_RULES[i] = createRulesObject(langStringDefault("casino.roulette.2bd50feaea8b1fb6e4129a3e25403634"), "straight", [jx3, jx3 + 1, jx3 + 2]);

    if (i !== 62) {
        const nextJ = (i - 50) * 3;

        ROULETTE_RULES[`${i}-${i + 1}`] = createRulesObject(langStringDefault("casino.roulette.eb2d5aab957540d0e1a5df79b3fa1ea0"), "six-numbers", [jx3, jx3 + 1, jx3 + 2, nextJ, nextJ + 1, nextJ + 2]);
    }
}

const getChipTypeByBalance = (table: TableInterface, balance: number) => {
    for (let i = table.chipTypePrices.length - 1; i >= 0; i--) {
        const chipPrice = table.chipTypePrices[i];

        if (balance >= chipPrice) {
            return i;
        }
    }
};

export const ROULETTE_MAP_ANIMS: {[key: number]: number} = {
    [36]: 1,
    [26]: 2,
    [9]: 3,
    [24]: 4,
    [28]: 5,
    [11]: 6,
    [7]: 7,
    [18]: 8,
    [12]: 37,
    [17]: 10,
    [5]: 11,
    [20]: 12,
    [32]: 13,
    [15]: 14,
    [3]: 15,
    [22]: 16,
    [34]: 17,
    [13]: 18,
    [1]: 19,
    [37]: 20,
    [27]: 21,
    [8]: 22,
    [25]: 23,
    [29]: 24,
    [10]: 25,
    [6]: 26,
    [19]: 27,
    [31]: 28,
    [16]: 29,
    [4]: 30,
    [21]: 31,
    [33]: 32,
    [14]: 33,
    [2]: 34,
    [23]: 35,
    [35]: 36,
    [30]: 9,
    [0]: 38
};