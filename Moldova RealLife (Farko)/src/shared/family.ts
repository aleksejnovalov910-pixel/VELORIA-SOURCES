import { langStringDefault } from "./lang/index";
import {systemUtil} from "./system";

export const FAMILY_TO_ORGANIZATION_MIN_LEVEL = 4;
export const getFamilyFractionName = (type: FamilyReputationType): string => {
    return type == FamilyReputationType.CIVILIAN ? "Civil" : "Mafia";
}

export enum FamilyReputationType {
    /** Гражданская семья */
    CIVILIAN,
    /** Криминальная семья */
    CRIME
}

interface IFamilyMemberAction {
    id: number,
    /** Название действия */
    name: string,
    /** Сколько добавится очков в нужную ветку за это действие */
    scores: number,
    /** Кд в минутах на начисление очков */
    cooldown?: number
}

/** Доступные действия влияющие на очки семьи */
export const familyMemberActions: IFamilyMemberAction[] = [
    // Крайм действия
    { id: 0, name: langStringDefault("family.ec5b33a8f26513b0ff34e7ad73344f8b"), scores: 2, cooldown: 5 },
    { id: 1, name: langStringDefault("family.b923086a5fcf7e21b63d37f006cd0d78"), scores: 3, cooldown: 10 },
    { id: 2, name: langStringDefault("family.056c8881cee00512af36b6b3598bc491"), scores: 2, cooldown: 10 },
    { id: 3, name: langStringDefault("family.d44d9a245540e75b685f4cb22a9f685a"), scores: 5 },
    { id: 4, name: langStringDefault("family.2cad726d2c0d1bd7b97425f9406e1d46"), scores: 5 },
    { id: 5, name: langStringDefault("family.f2a0cb5b92e8d4e5bad637a6613e30db"), scores: 3, cooldown: 10 },
    // Гос действия
    { id: 6, name: langStringDefault("family.339e3147f270008fcdf2e1ced335f6fa"), scores: 2, cooldown: 10 },
    { id: 7, name: langStringDefault("family.64ae6463bed60ba9ff9fdaaf327e9763"), scores: 3, cooldown: 10 },
    { id: 8, name: langStringDefault("family.d45cea18b3964222e2e7ae2493c02f6b"), scores: 2, cooldown: 10 },
    { id: 9, name: langStringDefault("family.71bbff1d9b65110a21034f658872e609"), scores: 3, cooldown: 10 },
    { id: 10, name: langStringDefault("family.36c2f9bbb298c0fc54b9e208819cb98c"), scores: 5, cooldown: 10 },
]

export const newRankRules = [
    { id: 1, name: langStringDefault("family.46e8231cb33ed01b9b72558d6c8eabcb")},
    { id: 2, name: langStringDefault("family.4026e52f9ba37a63f5f26aeb5fafdb99")},
    { id: 3, name: langStringDefault("family.4f56d4163d3aab57539b96ceb3be344a")},
    { id: 4, name: langStringDefault("family.b9b6afc6971ba9a7f6379d6495f49265")},
    { id: 5, name: langStringDefault("family.8e45cb38c76be8980501c75c48c1e93d")},
    { id: 6, name: langStringDefault("family.5f88d3c6e02eaa3f07870795f5944193")},
    { id: 7, name: langStringDefault("family.6f0f9a2fe43ed91e14531f1921b8a0d7")},
    { id: 8, name: langStringDefault("family.65a8b10e3df3c6cc4462de4c660366b3")},
    { id: 9, name: langStringDefault("family.ca243cbf99e95132e7a8a2d04795e249")},
]

export const getRankRuleName = (id: number) => {
    return newRankRules.find(r => r.id === id)
}

export const Timetable = [
    { start: "14:00", stop:"22:00", name: langStringDefault("family.b90719653a5ef0005d0473a629de20c9"), desc: langStringDefault("family.1153c6971cf6155c5b0a842a3350011d")}
]

export enum FamilyContractWinTypes {
    MONEY = 20000,
    COINS = 25,
    FAMILY_POINTS = 10001
}

export type rankData = {
    id: number;
    name?: string;
    rules?: Array<number>;
    isOwner?: boolean; 
    isSoOwner?: boolean; 
    isPermament?: boolean;
}
/** Максимальное кол-во рангов */
export const family_max_rank = 10;

/** Максимальное количество машин у семьи без улучшений */
export const family_max_cars = 2000;


/** Максимальное количество груза у семьи без улучшений */
export const family_max_cargo = 3000;

/** Максимальное количество членов семьи у семьи без улучшений */
export const family_max_users = 500;

/** Необходимое количество денежных средств для создания семьи */
export const FAMILY_CREATE_MONEY = 1000000

/** Необходимое количество донат-валюты для создания семьи */
export const FAMILY_CREATE_COINS = 150

/** Координаты плоского маркера (чекпоинта) создания официальной организации */
export const FAMILY_CREATE_POS_GOS = { x: -550.88, y: -188.85, z: 37.23 }
/** Координаты создания крайм семьи */

export const FAMILY_CREATE_POS_CRIME = { x: -800.68, y: 171.59, z: 71.94 }


/** Количество секунд между заказами груза в порту через NPC */
export const FAMILY_TIMEOUT_AFTER_CARGO_REQUEST = 60*5*60

/** Количество кг заказываемое игроком в порту через NPC */
export const FAMILY_REQUEST_CARGO_AMOUNT = 1500

/** Стоимость за заказ груза игроком в порту через NPC */
export const FAMILY_REQUEST_CARGO_PRICE = 60000

export enum FamilyRankPermission {
    FAMILY_LEADER= 10000,
    FAMILY_SUBLEADER
}

export const FamilyPermissions = {
    /** Купить дом */
    buyHouse: FamilyRankPermission.FAMILY_LEADER,
    /** Сменить замок в доме */
    changeLock: FamilyRankPermission.FAMILY_LEADER,
    /** Сделать дубликат ключей */
    keyDublicate: 5,
    /** Продажа дома государство */
    sellHouse: FamilyRankPermission.FAMILY_LEADER,
    /** Продажа ТС государство */
    sellVehicle: 2,
    /** Инвайт в семью */
    invite: 6,
    /** Оплата налога за дом и ТС */
    payTax: FamilyRankPermission.FAMILY_LEADER,
    /** Покупать транспорт в семью */
    buyCar: 1,
    /** Покупать транспорт в семью */
    houseUpgrade: FamilyRankPermission.FAMILY_LEADER,
    /** Повысить уровень семьи через планшет */
    level_up: FamilyRankPermission.FAMILY_LEADER,
    /** Выкинуть другого члена семьи из семьи через планшет */
    kick: 7,
    /** Изменить другому члену семьи ранг семьи через планшет */
    setRank: 7,
    /** Заспавнить машину в гараж */
    car_park: 3,
    /** Телепортировать машину к себе */
    car_teleport: FamilyRankPermission.FAMILY_SUBLEADER,
    /** Брать средства с money safe */
    money_take: FamilyRankPermission.FAMILY_SUBLEADER,
    /** Брать средства с money safe */
    request_cargo: 4,
    /** Запускать бизвар */
    bizwar_start: 8,
    /** Участвовать в бизваре */
    bizwar_join: 9,
}

export interface FamilyTasksInterface {
/** Тип задания. Они уже заранее заготовленные. Сейчас существует только нулевой  */
    type: number;
/** Название задания. Также отображается в планшете */
    name: string;    
/** Доп. информация о задании (для планшета) */
    info: string;    
/** Описание для scores. Игрок получает +scores очков семьи, за что именно указывать для планшета тут */
    desc: string;
/** Количество очков семьи, получаемое игроком за экспорт 1 единицы груза */
    scores: number;
/** Цвет (для планшета) */
    color: string;
    /** Количество денег выдающееся за экспорт 1 единицы груза */
    money: number;
/** Координаты плоского маркера - куда игрок несет коробку на разгрузке */
    importCoords: { x: number, y: number, z: number }[];
    
}

/** Настройки точки загрузки груза для семей */
export const FamilyTasksLoading = [
    {
        /** Тип, для которого указывается настройка (сейчас у нас только 0 поэтому это постоянное значение) */
        type: 0,

        /** Координаты плоского маркера для точек, откуда игрок берет семейный груз */
        loadingCoords: [ // для плоского маркера
            { x: 1240.8, y: -3135.55, z: 4.63 },
            { x: 1240.8, y: -3142.07, z: 4.63 },
            { x: 1240.8, y: -3148.96, z: 4.63 },
            { x: 1240.8, y: -3155.70, z: 4.63 }
        ],

        /** Координаты плоского маркера для точек регистрации ТС на загрузку семейного груза (по дефолту и как правильно она всего одна, при желании можно потом добавить) */
        carRegisterCoords: [
            { x: 1246.17, y: -3189.19, z: 5.13 }
        ],

        loadingBlip: [
            { x: 1239.95, y: -3145.58, z: 5.53 }
        ],

        requestCargoNpc: [
            { x: 1243.60, y: -3196.76, z: 6.03, h: 282, model: "s_m_y_construct_02" }
        ]
    }
]


export const FamilyExtraTaskTypes = {
    "cargoBattle": { }
}

export enum FamilyContractList {
    delivers = 1,
    taxists,
    builders,
    garders,
    helpers,
    cleaners,
    moneytransfers,
    onliners,
    fishers,
    drifters,
    farmers,
    robbers
}

export const FAMILY_CONTRACT_UPD_TIME = 60*60*2 // секунды
export const CONTRACT_NUM_FOR_FAMILY = 5

export const FamilyContracts: {id:number, type:number, name:string, desc: string, needScore: number, win: { type: FamilyContractWinTypes, amount?: number, desc?: string}[] }[] = [
    { id: 1, type: FamilyContractList.delivers, name: langStringDefault("family.4e4fce6c4b9d77dd474c5dac3bc4e864"), desc: langStringDefault("family.ce3116b93c4c2b06b1b050d91c11d612", systemUtil.numberFormat(100)), needScore: 100, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 } ] },
    { id: 2, type: FamilyContractList.taxists, name: langStringDefault("family.95e92a0dbb7d21522559c244f00aaba1"), desc: langStringDefault("family.c838e4b23caddb9cb7978d903f3e6c38", systemUtil.numberFormat(100)), needScore: 100, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 } ] },
    { id: 3, type: FamilyContractList.builders, name: langStringDefault("family.f04ef6322823a6ed918c3588091e2da3"), desc: langStringDefault("family.3575658b555bd513c14e9b5fd3042ae2"), needScore: 2, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 } ] },
    { id: 4, type: FamilyContractList.garders, name: langStringDefault("family.5ed5b5de391a869ae1c3e4f35f778d8b"), desc: langStringDefault("family.e8647b714e399dfd8fcd8b169742f73b", systemUtil.numberFormat(50000)), needScore: 50000, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 } ] },
    { id: 5, type: FamilyContractList.helpers, name: langStringDefault("family.1aae0b134d5b644ad033e88364b67058"), desc: langStringDefault("family.6de17758efda0f85fa36322fae0dc328", systemUtil.numberFormat(50000)), needScore: 50000, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 }] },
    { id: 6, type: FamilyContractList.cleaners, name: langStringDefault("family.813c3e0e8beb0b9e020a5fc8d2493053"), desc: langStringDefault("family.0397e879d55349098eba745653049640", systemUtil.numberFormat(50000)), needScore: 50000, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 } ] },
    { id: 7, type: FamilyContractList.moneytransfers, name: langStringDefault("family.c1bbfc9971572fd60d3d219a988e1bf0"), desc: langStringDefault("family.1d66fd7dac853fbf1c9bfc4e8d16f4c8", systemUtil.numberFormat(100000)), needScore: 100000, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 }] },
    { id: 8, type: FamilyContractList.onliners, name: langStringDefault("family.0182bb2253899c3cf805f470b0508eff"), desc: langStringDefault("family.03e456a27d7acec1e50579cb6d7ff39c", systemUtil.numberFormat(80)), needScore: 80, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 } ] },
    { id: 9, type: FamilyContractList.fishers, name: langStringDefault("family.f98a14113d7396aaf70662f0db946836"), desc: langStringDefault("family.af9401fba2883ceffe1f6627d88e47a9", systemUtil.numberFormat(3000)), needScore: 3000, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 }] },
    { id: 10, type: FamilyContractList.drifters, name: langStringDefault("family.59d1dc98c873f68a903bfbf7dde5c36b"), desc: langStringDefault("family.a76cc2b86debddbda687062e952bcafb", systemUtil.numberFormat(2000000)), needScore: 2000000, win: [{ type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 }, { type: FamilyContractWinTypes.MONEY, amount: 50000 } ] },
    { id: 11, type: FamilyContractList.farmers, name: langStringDefault("family.be88dfa61d62f1fd19969d42c18314c9"), desc: langStringDefault("family.e1fd844e531fd83dda98b47329fe3061", systemUtil.numberFormat(50)), needScore: 50, win: [{ type: FamilyContractWinTypes.FAMILY_POINTS, amount: 1000 }] },
    { id: 12, type: FamilyContractList.farmers, name: langStringDefault("family.138b030cf5470caa55353daba9291251"), desc: langStringDefault("family.6ba1f22bcf9011540b56dffb2c1828ee", systemUtil.numberFormat(25)), needScore: 25, win: [{ type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 } ] },
    { id: 13, type: FamilyContractList.delivers, name: langStringDefault("family.88aca7feea68d75e14f70b7cf3578838"), desc: langStringDefault("family.931508210faa8bd31052ce8419849fd2", systemUtil.numberFormat(50)), needScore: 50, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 } ] },
    { id: 14, type: FamilyContractList.taxists, name: langStringDefault("family.61f8ecd58504064cebece60aece3e855"), desc: langStringDefault("family.edb7a9ab306989831e330729263d4213", systemUtil.numberFormat(50)), needScore: 50, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 } ] },
    { id: 15, type: FamilyContractList.builders, name: langStringDefault("family.9c8e85ddb3b247fe8f53985bec305a77"), desc: langStringDefault("family.44a8a718dd62456134b137b807492729"), needScore: 1, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 } ] },
    { id: 16, type: FamilyContractList.garders, name: langStringDefault("family.dc9aa82e53df8e403fdeeca2f823f2eb"), desc: langStringDefault("family.b95f3e9ddc6b102fd062b110695f767a", systemUtil.numberFormat(25000)), needScore: 25000, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 } ] },
    { id: 17, type: FamilyContractList.helpers, name: langStringDefault("family.83744f4bceed1c8c8771005d73785763"), desc: langStringDefault("family.3b41c62f64750a0d7ba8af22b74f6765", systemUtil.numberFormat(25000)), needScore: 25000, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 }] },
    { id: 18, type: FamilyContractList.cleaners, name: langStringDefault("family.943f126df7c7185566f2cac202a2ce4b"), desc: langStringDefault("family.3d7a572063c1e1f085f8fd7b33e1c95a", systemUtil.numberFormat(25000)), needScore: 25000, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 } ] },
    { id: 19, type: FamilyContractList.moneytransfers, name: langStringDefault("family.7d1bfc4069a498717aef17b9e9779617"), desc: langStringDefault("family.837041707ba77f3e276c1976c938aa32", systemUtil.numberFormat(50000)), needScore: 50000, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 }] },
    { id: 20, type: FamilyContractList.onliners, name: langStringDefault("family.b6c8d6063d02165b24377596fdd1c329"), desc: langStringDefault("family.14f7cddcbd9a31f7b3a8c882de3604a6", systemUtil.numberFormat(40)), needScore: 40, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 } ] },
    { id: 21, type: FamilyContractList.fishers, name: langStringDefault("family.5d202758ec817e34a729e9c619552d06"), desc: langStringDefault("family.64458fd14bc4bb3efa9bea0e7a8d24cd", systemUtil.numberFormat(1500)), needScore: 1500, win: [ { type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 }] },
    { id: 22, type: FamilyContractList.drifters, name: langStringDefault("family.feb88131ff539142387772e6916e7247"), desc: langStringDefault("family.6dc2bb6f1dc6a6e9bbd6d92893efe6b5", systemUtil.numberFormat(1000000)), needScore: 1000000, win: [{ type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 }, { type: FamilyContractWinTypes.MONEY, amount: 25000 } ] },
    { id: 23, type: FamilyContractList.robbers, name: langStringDefault("family.9dd7425292118be971fdc620dcdb91f3"), desc: langStringDefault("family.7cef4ed86a29aadfd5f651b7caed6320", systemUtil.numberFormat(75000)), needScore: 75000, win: [{ type: FamilyContractWinTypes.FAMILY_POINTS, amount: 500 }, { type: FamilyContractWinTypes.MONEY, amount: 25000 } ] },
]

export const FamilyTasks:FamilyTasksInterface[] = [
    {
        type: 0,
        name: langStringDefault("family.c7d2ac17de74a633a0fe78e790e52dbe"),
        info: langStringDefault("family.fcfea1077ec04dd44d8565a2bc3aafb7"),
        desc: langStringDefault("family.3030a094a47cea7929c4e5f0448419da"),
        scores: 10,
        money: 700,
        color: "",
        importCoords: [
            { x: -457.02, y: -889.26, z: 22.76 },
            { x: -453.31, y: -889.43, z: 22.76 },
            { x: -449.13, y: -889.16, z: 22.76 }
        ]

    },
    {
        type: 0,
        name: langStringDefault("family.9471bba9ae8e92f1322f53707eb09704"),
        info:langStringDefault("family.efaf6da5e4e9288067770fdb363f7ba3"),
        desc: langStringDefault("family.376cfd3e40844b1e79fd7f79ee0e1b5b"),
        color: "green",
        scores: 10,
        money: 700,
        importCoords: [
            { x: 2684.53, y: 3515.77, z: 52.40 }, // für einen flachen Marker
            { x: 2680.99, y: 3507.77, z: 52.40 },
            { x: 2676.10, y: 3500.36, z: 52.40 }
        ]
    },
    {
        type: 0,
        name: langStringDefault("family.108907141cef9dc10d8a80d07c584269"),
        info:langStringDefault("family.448446fe69ec162d03e7bca9908def5f"),
        desc: langStringDefault("family.8b3844bc7875951954eee97036324bc1"),
        color: "orange",
        scores: 10,
        money: 700,
        importCoords: [
            { x: 2306.87, y: 4882.40, z: 40.91 }, // für einen flachen Marker
            { x: 2312.82, y: 4889.51, z: 40.91 }
        ]
    }
]


type LevelInfoType = {
    desc: string;
    members: number;
    scores: number;
    wins: number;
    coin: number;
    /** Может ли семья купить дом в многоквартирном доме */
    canBuyMultiHouse: boolean;
    /** Может ли семья купить дом для семьи без вертолетной площадки */
    canBuyCustomHouse: boolean;
    /** Может ли семья купить дом для семьи с вертолетной площадкой */
    canBuyAirHouse: boolean;
}[];
export const LevelInfo:LevelInfoType = [
    {desc: langStringDefault("family.593d0cb060f735f512f77d1c162a484b"), members: 0, scores: 0, wins: 0, coin: 0, canBuyMultiHouse: true, canBuyCustomHouse: true, canBuyAirHouse: false },
    {desc: langStringDefault("family.e5db7317ded27b6f82f4ae749490608e"),    members: 15, scores: 24000, wins: 10, coin: 59, canBuyMultiHouse: true, canBuyCustomHouse: true, canBuyAirHouse: false },
    {desc: langStringDefault("family.c7ad8ae8f62c962144b0ca15386108ea"), members: 20, scores: 80000, wins: 12, coin: 100, canBuyMultiHouse: true, canBuyCustomHouse: true, canBuyAirHouse: true },
    {desc: langStringDefault("family.47edf8a03fe606681cbdc93f59f62339"), members: 30, scores: 120000, wins: 20, coin: 150, canBuyMultiHouse: true, canBuyCustomHouse: true, canBuyAirHouse: true }
];


interface price {
    money:number,
    coin:number
}

type FamilyUpgrades  = {
    /** ID улучшения. Идут только в плюс, если какое то отсутствует - пропускать */
   id:number,
    /** Название для интерфейса */
   name: string,
    /** Описание для интерфейса */
   desc: string,
    /** Цена в виртах и коинах соответственно */
   price: price,
    /** Одно улучшение добавляет указанное тут количество того, что в нём указано
     * Например если это лимит семьи, то +1 улучшение за price добавляет
     * +10 человек, если указать amount = 10 */
   amount: number,
    /** Сколько можно улучшениями добавить значений к дефолтному
     * Если указать 15 для кол-ва транспорта, то максимальное количество транспорта у семьи
     * будет 15 + default (следующее значение) */
   max: number,
    /** Сколько изначально семья получает данного лимита / улучшения */
   default: number,
    multiple:number
}


/** Обновления семьи
 * После формирования семей айди не менять, иначе поменяются местами текущие улучшения
 */
export const FamilyUpgrade:FamilyUpgrades[] = [
    {id: 1, name: langStringDefault("family.0662c186ec9bede4772e1975b231e41d"), desc:langStringDefault("family.48fcc4ba17f774598bb374dc0fde6ce6"), price: {money:300000, coin: 50}, amount: 10, max: 1000-family_max_users, default: family_max_users, multiple: 1.2},
    {id: 2, name: langStringDefault("family.0f276fc0d21afe807c220027b0431305"), desc:langStringDefault("family.f725e69002864255feb8385836389c35"), price: {money:100000, coin: 25}, amount: 2, max: 100-family_max_cars, default: family_max_cars, multiple: 1.2},
    {id: 3, name: langStringDefault("family.3d23dd0ea94825d14c0d65153af8ccef"), desc:langStringDefault("family.b19bb1859ba2257ce1b4ce6a62cd704e"), price: {money:200000, coin: 30}, amount: 1000, max: 20000-family_max_cargo, default: family_max_cargo, multiple: 1.2},
    // {id: 3, name: 'Подземная парковка. Увеличивает максимальный лимит авто семьи', desc:'мест для авто', price: {money:1000, coin: 100}, amount: 10, max: 10, default: 0},
    {id: 4, name: "", desc:langStringDefault("family.dcb6805f3139586c25fe894b78a94dba"), price: {money:0, coin: 15}, amount: 1, max: 1, default: 0, multiple: 1}
]

export const getFamilyUpgradeLevelPrice = (id: number, level: number, priceType:keyof price) => {
    const fu = FamilyUpgrade.find(fu => fu.id == id)
    if(fu && level == 1) return fu.price[priceType]
    return fu ? Math.floor(Math.pow(fu.multiple, level-1) * fu.price[priceType]) : 0
}
