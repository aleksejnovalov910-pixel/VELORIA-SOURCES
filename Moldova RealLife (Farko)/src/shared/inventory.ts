import { langStringDefault } from "./lang/index";
import {LicenseName} from "./licence";
import {systemUtil} from "./system";
import {document_templates} from "./documents";
import {BANK_CARD_NAME_LIST} from "./economy";
import {WEAPON_ATTACH_LIST} from "./attach.system";
import {BagAttachData} from "./bag";
import {FACTION_ID} from "./fractions";

export const business_stock_level = [100000, 500000, 1000000]

export interface houseUpgradeLevelData {
    /** Стоимость дома, которая нужна для данного апгрейда */
    house: number;
    /** Стоимость данного апгрейда */
    price: number;
    /** Сколько веса в КГ даёт данный апгрейд к базовому */
    amount: number;
}


/** Базовая вместительность хранилища в доме в КГ */
export const HOUSE_DEFAULT_WEIGHT_KG = 150;

export const getItemDesc = (item_id: number) => {
    const cfg = inventoryShared.get(item_id)
    if(!cfg) return null;
    let text = "";
    let cfgWeapon = ITEM_TYPE.WEAPON == cfg.type ? inventoryShared.getWeaponConfigByItemId(cfg.item_id) : null
    if([ITEM_TYPE.WEAPON_MAGAZINE, ITEM_TYPE.WEAPON].includes(cfg.type)) text += langStringDefault("inventory.3d08b93313feeae4674d1811a25e5459", cfgWeapon.caliber)
    if(cfg.type == ITEM_TYPE.AMMO_BOX) text += langStringDefault("inventory.56f4f90ef63bded082845605913c6340", cfg.default_count)
    if(cfg.type == ITEM_TYPE.WEAPON_MAGAZINE) text += langStringDefault("inventory.c6e0c81b96cda1ec29a9e72f6dc41802", cfg.default_count)

    if(cfg.type === ITEM_TYPE.WEAPON_ADDON){
        const list: string[] = [];
        weapon_list.filter(q => q.addons).map(q => {
            for(let type in q.addons){
                const data: WeaponAddonsItemBase = (q.addons as any)[type]
                if(data){
                    if(data.item_id === cfg.item_id) list.push(inventoryShared.get(q.weapon).name)
                }
            }
        })
        if(list.length > 0){
            text += langStringDefault("inventory.fe9da5f5ceb787a70df04189fd2db5cb", list.join(", "))
        }
    }
    if(cfg.type === ITEM_TYPE.WEAPON){
        const weapon = inventoryShared.getWeaponConfigByItemId(cfg.item_id);
        if(weapon && weapon.addons){
            const list: string[] = [];
            for(let type in weapon.addons){
                const data: WeaponAddonsItemBase = (weapon.addons as any)[type]
                if (data.hash.includes("WEAPON_TINT")) 
                    continue
                if(data){
                    const itm = inventoryShared.get(data.item_id)
                    if(itm) list.push(itm.name)
                }
            }
            if(list.length > 0){
                text += langStringDefault("inventory.4a03fc20cd10ddb38100d898d7dbadca", list.join(", "))
            }
        }



    } else {
        const container = getContainerByItemID(cfg.item_id)
        if(container){
            text += langStringDefault("inventory.3e14331adab2689d825e60804cb25a6f", (container.max_size / 1000).toFixed(1))
        }
    }

    if(cfg.desc) text += `${cfg.desc}\n`;

    return text
}

/** Объём инвентаря игрока в КГ */
export const PLAYER_DEFAULT_WEIGHT_KG = 40;
/** Сколько максимум уровней может быть у расширеного инвентаря */
export const PLAYER_INVENTORY_MAX_LEVEL = 4;
/** Сколько КГ даётся за уровень */
export const PLAYER_INVENTORY_KG_PER_LEVEL = 5;
export const DIRTY_MONEY_ITEM_ID = 40157;

export interface InventoryWeaponPlayerData {
    item_id: number,
    id: number,
    // caliber: WEAPON_CALIBER,
    ammo: number,
    // name: string,
    serial: string,
    max_ammo: number,
    unloaded?: boolean;
}

export const enum OWNER_TYPES {
    /** Мир */
    WORLD = 0,
    /** Игрок */
    PLAYER = 1,
    /** Временное хранилище игрока, в него слетают его вещи во время мероприятий, где нужен голый инвентарь */
    PLAYER_TEMP = 1111,
    /** ТС */
    VEHICLE = 2,
    /** ТС заспавненое, то есть предмет будет удалён */
    VEHICLE_TEMP = 1000,
    /** Дом */
    HOUSE = 3,
    /** Склад хранилища 1 */
    STOCK_1 = 4,
    /** Склад хранилища 2 */
    STOCK_2 = 5,
    /** Склад хранилища 3 */
    STOCK_3 = 6,
    /** Склад хранилища 4 */
    STOCK_4 = 7,
    /** Склад хранилища 5 */
    STOCK_5 = 8,
    /** Склад хранилища 6 */
    STOCK_6 = 9,
    /** Склад хранилища 7 */
    STOCK_7 = 10,
    /** Склад хранилища 8 */
    STOCK_8 = 11,
    /** Склад хранилища 9 */
    STOCK_9 = 12,
    /** Склад хранилища 10 */
    STOCK_10 = 13,
    /** Склад хранилища 11 */
    STOCK_11 = 14,
    /** Склад хранилища 12 */
    STOCK_12 = 15,
    /** Склад хранилища 13 */
    STOCK_13 = 16,
    /** Склад хранилища 14 */
    STOCK_14 = 17,
    /** Склад хранилища 15 */
    STOCK_15 = 18,
    /** Склад дома с кодовым замком */
    STOCK_SAFE = 19,
    /** Временное хранилище */
    BUSINESS = 100,
    /** Фракционный ТС */
    FRACTION_VEHICLE = 20,
    /** Бумажник */
    // WALLET = 21,
    /**Сумка для предметов */
    BAG = 22,
    /**Модификации оружия */
    WEAPON_MODS = 23,
    /** Майнинг ферма */
    MINING_FARM = 25,
    /** Меню обмена */
    EXCHANGE_MENU = 600,
    /** Хранилище внутри БР режима */

    /** Хранилище внутри БР режима */
    GANGWAR_CONTAINER = 997,
    /** Временное хранилище */
    TEMP = 999,
    /** Хоткей ( для драг-дропа) */
    HOTKEY = 9998,
    /** Оружие ( для драг-дропа) */
    WEAPON = 9997,
    /** Одежда ( для драг-дропа) */
    CLOTHES = 9996,
    /** Склад рынка */
    MARKET_STOCK = 500,
    /** Склад рынка */
    FARM_STOCK = 501,
    BP_STORAGE = 502,
    DONATE_STORAGE = 503,
    /** Сумки и рюкзаки  */
    BAG1 = 15000,
    BAG2 = 15001,
    BAG3 = 15002,
    BAG4 = 15003,
    BAG5 = 15004,
    BAG6 = 15005,
    BAG7 = 15006,
    BAG8 = 15007,
    BAG9 = 15008,
    BAG10 = 15010,
    BAG11 = 15011,
    BAG12 = 15012,
    BAG13 = 15013,
    BAG14 = 15014,
    BAG15 = 15015,
    BAG16 = 15016,
    BAG17 = 15017,
    BAG18 = 15018,
    BAG19 = 15019,
    BAG20 = 15020,
    BAG21 = 15021,
    BAG22 = 15023,
    BAG23 = 15024,
    BAG24 = 15025,
    BAG25 = 15026,
    BAG26 = 15027,
    BAG27 = 15028,
    BAG28 = 15029,
    BAG29 = 15030,
    BAG30 = 15031,
    BAG31 = 15032,
    BAG32 = 15033,
    BAG33 = 15034,
    BAG34 = 15035,
    BAG35 = 15036,
    BAG36 = 15037,
    BAG37 = 15038,
    BAG38 = 15039,
    BAG39 = 15040,
    BAG40 = 15041,
    BAG41 = 15042,
    BAG42 = 15043,
    BAG43 = 15044,
    BAG44 = 15045,
    BAG45 = 15046,
    BAG46 = 15047,
    BAG47 = 15048,
    BAG48 = 15049,
    BAG49 = 15050,
    BAG50 = 15051,
    BAG51 = 15052,
    BAG53 = 15053,
    BAG54 = 15053,
    BAG55 = 15053,
    BAG56 = 15053,
    BAG57 = 15054,
    BAG58 = 15055,
    BAG59 = 15056,
    BAG60 = 15057,
    BAG61 = 15058,
    BAG62 = 15059,
    BAG63 = 15060,
    BAG64 = 15061,
    BAG65 = 15062,
    BAG66 = 15063,
    BAG67 = 15064,
    BAG68 = 15065,
    BAG69 = 15066,
    BAG70 = 15067,
    BAG71 = 15068,
    BAG72 = 15069,
    BAG73 = 15070,
    BAG74 = 15071,
    BAG75 = 15072,
    BAG76 = 15073,
    BAG77 = 15074,
    BAG78 = 15075,
    BAG79 = 15076,
    BAG80 = 15077,
    BAG81 = 15078,
    BAG82 = 15079,
    BAG83 = 15080,
    BAG84 = 15081,
    BAG85 = 15082,
    BAG86 = 15083,
    BAG87 = 15084,
    BAG88 = 15085,
    BAG89 = 15086,
    BAG90 = 15087,
    BAG91 = 15088,
    BAG92 = 15089,
    BAG93 = 15090,
    BAG94 = 15091,
    BAG95 = 15092,
    BAG96 = 15093,
    BAG97 = 15094,
    BAG98 = 15095,
    BAG99 = 15096,
    BAG100 = 15097,
    BAG101 = 15098,
    // сюда новые
    BAG_102 = 19999,
    BAG_103 = 20000,
    BAG_104 = 20001,
    BAG_105 = 20002,
    BAG_106 = 20003,
    BAG_107 = 20004,
    BAG_108 = 20005,
    BAG_109 = 20006,
    BAG_110 = 20007,
    BAG_111 = 20008,
    BAG_112 = 20009,
    BAG_113 = 20010,
    BAG_114 = 20011,
    BAG_115 = 20012,
    BAG_116 = 20013,
    BAG_117 = 20014,
    BAG_118 = 20015,
    BAG_119 = 20016,
    BAG_120 = 20017,
    BAG_121 = 20018,
    BAG_122 = 20019,
    BAG_123 = 20020,
    BAG_124 = 20021,
    BAG_125 = 20022,
    BAG_126 = 20023,
    BAG_127 = 20024,
    BAG_128 = 20025,
    BAG_129 = 20026,
    BAG_130 = 20027,
    BAG_131 = 20028,
    BAG_132 = 20029,
    BAG_133 = 20030,
    BAG_134 = 20031,
    BAG_135 = 20032,
    BAG_136 = 20033,
    BAG_137 = 20034,
    BAG_138 = 20035,
    BAG_139 = 20036,
    BAG_140 = 20038,
    BAG_141 = 20039,
    BAG_142 = 20040,
    BAG_143 = 20041,
    BAG_144 = 20042,
    BAG_145 = 20043,
    BAG_146 = 20044,
    BAG_147 = 20045,
    BAG_148 = 20046,
    BAG_149 = 20047,
    BAG_150 = 20048,
    BAG_151 = 20049,
    BAG_152 = 20050,
    BAG_153 = 20051,
    BAG_154 = 20052,
    BAG_155 = 20053,
    // DO NOT REMOVE IT!!! IT MUST HAVE LAST BAG ID
    BAG_LAST = 20053,
}


export const getContainerByOwnerType = (owner_type: OWNER_TYPES) => {
    return CONTAINERS_DATA.find(q => q.owner_type === owner_type)
}
export const getContainerByItemID = (item_id: number) => {
    return CONTAINERS_DATA.find(q => q.item_id === item_id)
}

/**
 * Список параметров: 
 * @arg {number} ID {number}
 * @arg {number} ITEM_ID {number}
 * @arg {number} COUNT {number}
 * @arg {string} SERIAL {number}
 * @arg {string} EXTRA {string}
 */
export type InventoryItemCef = [number, number, number, string, string];

export const MAXIMUM_ITEMS_IN_ONE_EXCHANGE = 20;

export interface ExchangeData {
    myData: ExchangePlayerData;
    targetData: ExchangePlayerData;
}

export interface ExchangePlayerData {
    /** Имя игрока, с которым совершается обмен */
    playerName: string;
    /** Деньги, участвующие в обмене */
    money: number;
    /** Предметы, участвующие в обмене */
    items: InventoryItemCef[];
    /** Статус готовности к обмену */
    readyStatus: ExchangeReadyStatus;
}

export enum ExchangeReadyStatus {
    NOT_READY,
    READY,
    CONFIRMED,
}

export interface InventoryDataCef {
    /** Название */
    name: string;
    /** Описание */
    desc: string;
    /** ИД */
    owner_id: number;
    /** Тип */
    owner_type: OWNER_TYPES;
    /** Максимальный вес */
    weight_max: number;
    /** Доступ закрыт */
    closed?: boolean;
    /** Вещи */
    items: InventoryItemCef[];
    /** Показать динамический инвентарь */
    show?:boolean;
    /** Позиция для отображения */
    left?:number;
    /** Позиция для отображения */
    top?:number;
    /** Для драг-дропа */
    drag?:{x:number, y:number}
}

export interface InventoryChoiseItemData {
    item: InventoryItemCefObject;
    task: string;
    owner_type: number;
    owner_id: number;
    target_id?: number;
    target_type?: number;
    target_slot?: number;
    hotkey_slot?: number;
    source_slot?: number;
}

/** Список типов всех предметов */
export const enum ITEM_TYPE {
    /** Вода */
    WATER = 0,
    /** Еда */
    FOOD = 1,
    /** Оружие */
    WEAPON = 2,
    /** Коробка с патронами */
    AMMO_BOX = 3,
    /** Магазин/Обойма для оружия */
    WEAPON_MAGAZINE = 4,
    /** Наркотики */
    DRUG = 5,
    /** Системные предметы (Документы, ключи и прочее) */
    SYSTEM = 6,
    // Медикаменты
    MEDICATION = 7,
    // Донатные предметы
    DONAT = 8,
    // Одежда
    CLOTH = 9,
    // Алкоголь
    ALCO = 10,
    // Прочее
    OTHER = 11,
    /** Модификации оружия */
    WEAPON_ADDON = 12,
    /**Сумки и рюкзаки */
    BAGS = 13,
    /** Компоненты майнинга */
    MINING = 14,
    // Зелья
    POTION = 15,
    // Животные
    ANIMAL = 16,
    // Курительные принадлежности
    SMOKING = 17,
    DISCOUNT = 18
}

// export const ITEM_TYPE_ARRAY = [langStringDefault("inventory.0e40488813596c06f7ca132722ee6041"), langStringDefault("inventory.2d8f8361a938c0cc8be74633bec667ae"), langStringDefault("inventory.bb67784916aaa0159ef3a44c3ca9699c"), langStringDefault("inventory.a1f65c9be873b51ac9daa85c412274be"), langStringDefault("inventory.1077bad0fc9b62bbe44cad94484b9ee3"), langStringDefault("inventory.bc96eff1e3dff8180c8e89863d213244"), "System", langStringDefault("inventory.02276fea087e09c7bc8df2d249f5b54b"), langStringDefault("inventory.90df2307c92e582af8ba59b63cb259af"), langStringDefault("inventory.52fa125e629ee08a44a8efff0664ba8d"), langStringDefault("inventory.0055d1e945e19f6812a1f91f5237494f"), langStringDefault("inventory.df4e8d26acd0b6fca16d7a1d3a18f686"), langStringDefault("inventory.b534b287c548e4d13fc11f640fadd3b7"), langStringDefault("inventory.05d8cfb5b27ff06f1335ea199c439282"), langStringDefault("inventory.a403f170ce6a90a71d86979961d1883f"), langStringDefault("inventory.914b9f07c93fde150c21fa70ab668f5c"), langStringDefault("inventory.96e0179428895d6491eb4705cb2d7aa4"), langStringDefault("inventory.6db81239090a4576b7388ff1032b115d")]
export const ITEM_TYPE_ARRAY = [
  "Bauturi",
  "Mancare",
  "Arme",
  "Cutie de gloante",
  "Magazin de arme",
  "Droguri",
  "Sistem",
  "Medicamente",
  "Obiecte donate",
  "Haine",
  "Alcool",
  "Altele",
  "Modificari de arme",
  "Genti si rucsacuri",
  "Componente de minerit",
  "Elixire",
  "Animale"
];

export interface InventoryItemCefObject {
    id: number;
    item_id: number;
    count: number;
    serial: string;
    extra: string;
    desc?: string;
}

/** Конвертор читаемого объёкта предмета в короткий массив */
export const convertInventoryItemObjectToArray = (item: InventoryItemCefObject): InventoryItemCef => {
    return [item.id, item.item_id, item.count, item.serial, item.extra]
}

/** Конвертор короткого массива в читаемый объёкт */
export const convertInventoryItemArrayToObject = (item: InventoryItemCef): InventoryItemCefObject => {
    const cfg = inventoryShared.get(item[1]);
    return {
        id: item[0],
        item_id: item[1],
        count: item[2],
        serial: item[3],
        extra: item[4],
        desc: cfg.desc,
    }
}

export const ELECTRO_SHOP_ITEMS:number[] = []

export const getItemName = (item: InventoryItemCefObject) => {
    let name = getBaseItemNameById(item.item_id);
    if (item.serial){
        let cfg = inventoryShared.get(item.item_id);
        if(cfg){
            if ([ITEM_TYPE.WEAPON_MAGAZINE, ITEM_TYPE.WEAPON].includes(cfg.type) || item.item_id == 800){
                name += ` (#${item.serial})`
            }
            if (item.item_id == 805){
                name += ` ${item.serial}`;
            }
            if (item.item_id == 851){
                const q = item.serial.split("_");
                if(q.length > 0){
                    name += ` #${q[q.length - 1]}`;
                }
            }
            if (item.item_id == 803){
                const q = item.serial.split("-");
                if(q.length === 5){
                    name += langStringDefault("inventory.1fdf501819cd2164285db8e006a7cd87", (LicenseName as any)[q[0]], parseInt(q[3]) < systemUtil.timestamp ? langStringDefault("inventory.37f76a3fa0b19b5ffba63c45c6e834b1") : "");
                }
            }
            if (item.item_id == 802){
                const q = item.serial.split("|");
                if(q.length === 10){
                    const doc = document_templates.find(s => s.id === q[0])
                    name += ` ${doc.typeShort}`;
                }
            }
            if (item.item_id == 801){
                // let bank_number = (`${item.sub_type + 1}_${item.id}_${tarif}_${system.getRandomInt(1000000, 9999999)}`)
                if (!item.extra){
                    name += langStringDefault("inventory.575efd4218c79dc164e289d140d1f1bd")
                } else {
                    const [sub_type, id, tarifid, rand] = item.serial.split("A");
                    name += ` (${BANK_CARD_NAME_LIST[parseInt(tarifid)] || langStringDefault("inventory.825ec85e94bac7f0066b30fd4435e3d1")})`
                }
            }
            if(cfg.type == ITEM_TYPE.CLOTH){
                name += ` (${item.serial})`
            }
        }
    }
    return name
}
export const getBaseItemNameById = (item_id: number) => {
    let cfg = inventoryShared.get(item_id);
    if (!cfg) return langStringDefault("inventory.824b174a2ec8456874bbe88f468ad4e6")
    return cfg.name;
}

export const canUse = (item_id: number) => {
    let cfg = inventoryShared.get(item_id);
    if (!cfg) return false
    return !!cfg.use
}

export interface InventoryEquipList {
    bracelet: number,
    watch: number,
    ear: number,
    glasses: number,
    hat: number,
    accessorie: number,
    accessorie2: number,
    foot: number,
    leg: number,
    torso: number,
    mask: number,
    armor: number,
    gloves: number,
}

export interface itemConfig {
    /** ID предмета */
    item_id: number;
    /** Название предмета */
    name: string;
    /** Тип предмета */
    type: ITEM_TYPE,
    /** Должен ли предмет группироваться с подобными */
    need_group?: boolean;
    /** Вес одной единици */
    weight: number;
    /** Дополнительный вес по умолчанию
     * @example Вес самой бутылки с водой */
    base_weight?: number;
    /** Название пропа, когда лежит на земле */
    prop: string;
    /** Уникальные настройки атача пропа для проигрывания анимации держания в руке. Данные получаются через специальную систему */
    propAttachParam?: [number, number, number, number, number, number];
    /** Запас по умолчанию */
    default_count: number;
    /** Можно ли использовать предмет */
    use?: boolean;
    /** Сколько единиц потратить при использовании
     * @default ALL
     */
    count_use?: number;


    /** Предмет с данным флагом нельзя будет отобрать у другого игрока */
    protect?:boolean;
    /** Базовая стоимость товара для заказа владельцем бизнеса, для продажи продукции на склад и в других подобных моментах. Если 0 - заказать нельзя */
    defaultCost?: number;
    /** Множитель параметра количества наркотиков. Когда будет использоватся 1 единица наркотика - значение будет исходя из drugMultiple. Лечение игрока будет происходит по формуле drugMultiple * 0.3 */
    drugMultiple?: number;
    /** Количество ХП восстанавливаемое с определныым периодом времени */
    drugHeal?: number;
    /** Описание предмета */
    desc?: string;
    /** Текст уведомления при первом появлении предмета в инвентаре. Чтобы уведомление появилось нужно указать и описание и иконку */
    helpDesc?: string;
    /** Иконка уведомления при первом появлении предмета в инвентаре. В папке /src/shared/SuccessInfo без .png Чтобы уведомление появилось нужно указать и описание и иконку */
    helpIcon?: string;
    /** Предмет можно разделить */
    canSplit?:boolean;
    /** Предмет может поднять только член фракции из массива  */
    canFactionsTake?:FACTION_ID[];
    /** Данный предмет нельзя будет переместить из изначально выданого инвентаря */
    blockMove?:true,
    attachBody?:keyof typeof WEAPON_ATTACH_LIST,
    /** Если указать этот параметр и включить параметр use - то будет лечить на указанное количество ХП*/
    healUse?:number,
    /** Этот предмет можно взять в руки (цветы и прочее)
     * <p color='red'>ОБЯЗАТЕЛЬНО УКАЖИТЕ ПАРАМЕТР <b>propAttachParam</b></p> */
    inHand?: boolean,
    /** Параметр для продуктов, который указывает через сколько дней продукт будет считаться испорченым после создания (покупки в магазине, крафта и т.д.). Если не указать - то будет параметр по умолчанию <b>POISONING_DAYS</b>*/
    poisoning?:number,
    /** Флаг, запрещающий использовать предмет через хоткей */
    blockHotkey?: boolean,
    /** Нелегальный */
    isIllegal?: boolean,
    /** Количество еды, которое восстанавливает предмет (в процентах или очках) */
    restore_food?: number;
    /** Количество воды, которое восстанавливает предмет (в процентах или очках) */
    restore_water?: number;
}

/** Получить вес предмета исходя из количества */
export const getItemWeight = (
    /** Либо ID предмета, либо сам конфиг */
    item: number | itemConfig,
    /** Параметр количества предмета */
    count?: number,
    /** Если необходимо - вернём в КГ, то есть поделим на тысячу */
    returnKg = false
) => {
    let cfg = inventoryShared.get(typeof item === "number" ? item : item.item_id);
    if (!cfg) return 0;
    if (typeof count !== "number") count = cfg.default_count;
    if (typeof item === "object") return item.weight * count
    if (!cfg) return 0
    let weight = cfg.weight * count;
    if (cfg.base_weight) weight += cfg.base_weight;
    if (returnKg) return weight / 1000
    return weight;
}

/** Получить вес предмета в текстовом представлении */
export const getItemWeightText = (
    /** Либо ID предмета, либо сам конфиг */
    item: number | itemConfig,
    /** Параметр количества предмета */
    count: number
) => {
    let weight = getItemWeight(item, count);
    if (weight > 1000) return langStringDefault("inventory.7635dfaf7fc116392f7e0a61f7762f12", (weight / 1000).toFixed(3))
    else return langStringDefault("inventory.a28e9ecb92901f4a4e8028fa53528d79", Math.floor(weight))
}
/** Получить вес всех предметов в текстовом представлении */
export function getAllItemsWeightText(...itm: [number, number][]): string;
export function getAllItemsWeightText(...itm: [itemConfig, number][]): string;
export function getAllItemsWeightText(...itm: number[][]): string;
export function getAllItemsWeightText(...itm: [number | itemConfig, number][] | number[][]) {
    let weight = 0;
    (itm as any).map((i: any) => {
        weight += getItemWeight(i[0], i[1])
    })
    if (weight > 1000) return langStringDefault("inventory.27481054234b807543e660fbbe160ed6", (weight / 1000).toFixed(3))
    else return langStringDefault("inventory.0c98649ff3cf613acb83ac7c8a3fad8e", Math.floor(weight))
}


export const CUFFS_ITEM_ID = 804;
export const CUFFS_KEY_ITEM_ID = 899;
export const SCREWS_ITEM_ID = 799;
export const SCREWS_DESTROYER_ITEM_IDS = [552, 890];

export const ARMOR_ITEM_ID = 960;

/** Калибр оружия */
export type WEAPON_CALIBER = 5.45 | 5.56 | 7.62 | 12.7 | 9 | 18.5 ;

/** Параметр веса патрона каждого калибра */
export const enum WEAPON_AMMO_WEIGHT {
    /** 5.45 */
    "AK" = 10,
    /** 5.56 */
    "NATO" = 12,
    /**7.62 */
    "COMBAT" = 15,
    /**12.7 */
    "HEAVY" = 20,
    /**9mm */
    "PISTOL" = 8,
    /**18.5 */
    "SHOTGUN" = 30,
 
}

/**
 * 1-100 - Вода
 * 500-599 - Оружие (Не группировать)
 * 600-699 - Магазины (НЕ группировать)
 * 800-899 - Системные предметы (НЕ группировать)
 */
const itemsList: itemConfig[] = [
    { item_id: 99919, name: langStringDefault("inventory.954feeac458bef03756c99fce498fef0"), type: ITEM_TYPE.SYSTEM, weight: 1, base_weight: 30, prop: "ghostbusters_bag", default_count: 0 },

    { item_id: 1, name: langStringDefault("inventory.8c8fa1c71c6b52d1cc2536c3dfac4071"), type: ITEM_TYPE.WATER, weight: 1, base_weight: 30, prop: "prop_ld_flow_bottle", default_count: 1, restore_water: 500, poisoning: 2, use: true, need_group: true, count_use: 100, defaultCost: 90, propAttachParam: [0.120, 0.075, 0.000, 248, 0, 0], protect: true },
    { item_id: 2, name: langStringDefault("inventory.6d61b2b153aff5065891a8b55b3a96a0"), type: ITEM_TYPE.WATER, weight: 1, base_weight: 30, prop: "prop_ecola_can", default_count: 1, restore_water: 330, poisoning: 2, use: true, need_group: true, defaultCost: 100, propAttachParam: [0.135, 0.020, 0.040, 247, 0, 0], protect: true  },
    { item_id: 3, name: langStringDefault("inventory.bd63877b0773cafa755770a91bdb2429"), type: ITEM_TYPE.WATER, weight: 1, base_weight: 30, prop: "ba_prop_club_tonic_can", default_count: 1, restore_water: 330, poisoning: 2, use: true, need_group: true, defaultCost: 100, propAttachParam: [0.135, -0.035, 0.060, 247, 0, 0], protect: true  },
    { item_id: 4, name: langStringDefault("inventory.a21d0935f92189b1afcb7a0c096f85bf"), type: ITEM_TYPE.WATER, weight: 1, base_weight: 30, prop: "prop_orang_can_01", default_count: 1, restore_water: 330, poisoning: 2, use: true, need_group: true, defaultCost: 100, propAttachParam: [0.135, 0.025, 0.025, 243, 0, 0], protect: true  },
    { item_id: 5, name: langStringDefault("inventory.76c4b2678f09e028f5e5c8ad45f62524"), type: ITEM_TYPE.WATER, weight: 1, base_weight: 30, prop: "prop_food_bs_coffee", default_count: 1, restore_water: 230, poisoning: 2, use: true, need_group: true, defaultCost: 120, propAttachParam: [0.120, -0.045, 0.070, 256, 0, 0], protect: true  },
    { item_id: 6, name: langStringDefault("inventory.4a058d924356c7b29e8d65783a43f92e"), type: ITEM_TYPE.WATER, weight: 1, base_weight: 30, prop: "ba_prop_club_tonic_bottle", default_count: 1, restore_water: 450, poisoning: 2, use: true, need_group: true, count_use: 100, defaultCost: 50, propAttachParam: [0.130, -0.095, 0.095, 240, 0, 0], protect: true  },
    { item_id: 7, name: langStringDefault("inventory.d2464e492d65f747b15d05065b43101e"), type: ITEM_TYPE.WATER, weight: 1, base_weight: 30, prop: "prop_energy_drink", default_count: 1, restore_water: 400, poisoning: 2, use: true, count_use: 100, need_group: true, defaultCost: 140, propAttachParam: [0.135, 0.040, 0.025, 241, 0, 0], protect: true  },
    { item_id: 8, name: langStringDefault("inventory.5cc16f1ff46af3510458eec4fca2f1f8"), type: ITEM_TYPE.WATER, weight: 1, base_weight: 20, prop: "v_res_fa_pottea", default_count: 1, restore_water: 300, poisoning: 2, use: true, defaultCost: 120, need_group: true, propAttachParam: [0.135, 0.040, 0.025, 241, 0, 0], protect: true  },
    // Коробки патронов
    { item_id: 150, name: langStringDefault("inventory.c34f68567fb361c648d6307da4760fa7"), type: ITEM_TYPE.AMMO_BOX, weight: WEAPON_AMMO_WEIGHT.AK, base_weight: 10, prop: "prop_ld_ammo_pack_03", default_count: 70, need_group: true, defaultCost: 1400, canSplit: true },
    { item_id: 151, name: langStringDefault("inventory.9010f2215c143100850d654d49bedd50"), type: ITEM_TYPE.AMMO_BOX, weight: WEAPON_AMMO_WEIGHT.NATO, base_weight: 10, prop: "prop_ld_ammo_pack_03", default_count: 70, need_group: true, defaultCost: 1750, canSplit: true },
    { item_id: 152, name: langStringDefault("inventory.78167c949155f4efa6f57c9fa3fd3d8d"), type: ITEM_TYPE.AMMO_BOX, weight: WEAPON_AMMO_WEIGHT.HEAVY, base_weight: 70, prop: "prop_box_ammo02a", default_count: 30, need_group: true, defaultCost: 1850, canSplit: true },
    { item_id: 153, name: langStringDefault("inventory.b273f8bc64f63560ab3a578709ed5289"), type: ITEM_TYPE.AMMO_BOX, weight: WEAPON_AMMO_WEIGHT.PISTOL, base_weight: 10, prop: "prop_ld_ammo_pack_01", default_count: 70, need_group: true, defaultCost: 1350, canSplit: true },
    { item_id: 154, name: langStringDefault("inventory.5d4721d7fa1e5c3c136f1308175b7f19"), type: ITEM_TYPE.AMMO_BOX, weight: WEAPON_AMMO_WEIGHT.SHOTGUN, base_weight: 10, prop: "prop_ld_ammo_pack_01", default_count: 70, need_group: true, defaultCost: 1350 , canSplit: true },
    { item_id: 155, name: langStringDefault("inventory.90c69d896cbcd3bc2aaa40f8327072d4"), type: ITEM_TYPE.AMMO_BOX, weight: WEAPON_AMMO_WEIGHT.COMBAT, base_weight: 10, prop: "prop_ld_ammo_pack_01", default_count: 70, need_group: true, defaultCost: 1200, canSplit: true },
    { item_id: 156, name: langStringDefault("inventory.3212042503441b330a70b04c77eb2d77"), type: ITEM_TYPE.AMMO_BOX, weight: 1, base_weight: 10, prop: "prop_ld_ammo_pack_01", default_count: 999, need_group: true, defaultCost: 500, canSplit: false, blockMove: true },
    // Еда
    { item_id: 20, name: langStringDefault("inventory.93f35b186bdd25720c66a844b0a27dd3"), type: ITEM_TYPE.FOOD, weight: 1, base_weight: 10, prop: "prop_cs_burger_01", default_count: 1, restore_food: 200, poisoning: 2, use: true, defaultCost: 250, need_group: true, propAttachParam: [0.155, 0.035, 0.035, 163, 29, 0], protect: true },
    { item_id: 21, name: langStringDefault("inventory.64a296119ee2cb4d9a10a8acefbdf484"), type: ITEM_TYPE.FOOD, weight: 1, base_weight: 20, prop: "prop_food_cb_chips", default_count: 1, restore_food: 250, poisoning: 2, use: true, defaultCost: 150, need_group: true, propAttachParam: [0.150, -0.045, 0.030, 260, 19, 15], protect: true },
    { item_id: 22, name: langStringDefault("inventory.39d067ccc7ce005886f0e21042fee26d"), type: ITEM_TYPE.FOOD, weight: 1, base_weight: 20, prop: "prop_food_bs_chips", default_count: 1, restore_food: 200, poisoning: 2, use: true, defaultCost: 150, need_group: true, propAttachParam: [0.155, -0.030, 0.060, 232, 0, 0], protect: true },
    { item_id: 23, name: langStringDefault("inventory.60aad582393fed5553fcbf2fa57ca399"), type: ITEM_TYPE.FOOD, weight: 1, base_weight: 10, prop: "ng_proc_food_chips01a", default_count: 1, restore_food: 200, poisoning: 2, use: true, defaultCost: 150, propAttachParam: [0.165, 0.000, 0.060, 332, 161, 0], need_group: true, protect: true },
    { item_id: 24, name: langStringDefault("inventory.24f95ab6fa2aae7b834bb0851c5bdee1"), type: ITEM_TYPE.FOOD, weight: 1, base_weight: 50, prop: "prop_pizza_box_01", default_count: 1, restore_food: 800, poisoning: 2, use: true, count_use: 400, need_group: true, defaultCost: 200, protect: true },
    { item_id: 25, name: langStringDefault("inventory.3b0b6b2c2efb116c16e813a39f5bc274"), type: ITEM_TYPE.FOOD, weight: 1, base_weight: 100, prop: "ng_proc_food_nana1a", default_count: 1, restore_food: 300, poisoning: 2, use: true, defaultCost: 90, need_group: true, propAttachParam: [0.170, 0.000, 0.000, 357, 0, 0], protect: true },
    { item_id: 26, name: langStringDefault("inventory.61113b03d79a5ec9db8148b3303ddfa4"), type: ITEM_TYPE.FOOD, weight: 1, base_weight: 50, prop: "prop_food_cb_donuts", default_count: 1, restore_food: 500, poisoning: 2, use: true, count_use: 200, need_group: true, defaultCost: 100, propAttachParam: [0.155, 0.015, 0.040, 281, 17, 88], protect: true  },
    { item_id: 27, name: langStringDefault("inventory.06e1ac95a344762d7a8ca90d46f2b0d9"), type: ITEM_TYPE.FOOD, weight: 1, base_weight: 30, prop: "prop_food_cb_nugets", default_count: 1, restore_food: 500, poisoning: 2, use: true, defaultCost: 200, need_group: true, propAttachParam: [0.155, 0.015, 0.040, 281, 17, 88], protect: true  },
    { item_id: 28, name: langStringDefault("inventory.2dbe3e06d09b1c5246abe8f82de18a9d"), type: ITEM_TYPE.FOOD, weight: 1, prop: "ng_proc_food_aple2a", default_count: 1, restore_food: 300, use: true, defaultCost: 90, poisoning: 2, need_group: true, propAttachParam: [0.120, -0.000, -0.025, 327, 0, 0], protect: true  },
    { item_id: 29, name: langStringDefault("inventory.275e9ea6b70e9ed2cd94aac2f5698e6d"), type: ITEM_TYPE.FOOD, weight: 1, base_weight: 100, prop: "ng_proc_food_ornge1a", default_count: 1, restore_food: 90, poisoning: 2, use: true, need_group: true, defaultCost: 100, propAttachParam: [0.130, 0.000, 0.000, 328, 0, 0], protect: true  },
    { item_id: 30, name: langStringDefault("inventory.38fa41c8849b8339a678b527ca47a32f"), type: ITEM_TYPE.FOOD, weight: 1, base_weight: 1000, prop: "prop_food_cb_chips", default_count: 1, restore_food: 500, need_group: true, use: true}, // Убрать из продажи, добавить армейцам и фибам!!!!

    // Наркотики
    { item_id: 50, name: langStringDefault("inventory.3bcf5943f82a659b2fe5f3081a8764bb"), type: ITEM_TYPE.DRUG, weight: 1, base_weight: 5, prop: "bkr_prop_meth_smallbag_01a", default_count: 1, use: true, count_use: 1, drugMultiple: 300, drugHeal: 7, need_group: true, canSplit: true },
    { item_id: 51, name: langStringDefault("inventory.9c7a83765281bb65d34e76376b5eb12c"), type: ITEM_TYPE.DRUG, weight: 1, base_weight: 5, prop: "bkr_prop_weed_smallbag_01a", default_count: 1, use: true, count_use: 1, drugMultiple: 100, drugHeal: 6, need_group: true, canSplit: true },
    { item_id: 52, name: langStringDefault("inventory.f42360f3b69b620c399dec7661fb47a1"), type: ITEM_TYPE.DRUG, weight: 1, base_weight: 5, prop: "bkr_prop_meth_smallbag_01a", default_count: 1, use: true, count_use: 1, drugMultiple: 350, drugHeal: 7, need_group: true, canSplit: true },
    { item_id: 53, name: langStringDefault("inventory.c877d7db11b3c29bdbf0d2b0201614db"), type: ITEM_TYPE.DRUG, weight: 1, base_weight: 5, prop: "bkr_prop_meth_smallbag_01a", default_count: 1, use: true, count_use: 1, drugMultiple: 300, drugHeal: 6, need_group: true, canSplit: true },
    { item_id: 54, name: langStringDefault("inventory.cac28df4d3e614b5edb3fa9f632c4d8f"), type: ITEM_TYPE.DRUG, weight: 1, base_weight: 5, prop: "bkr_prop_meth_smallbag_01a", default_count: 1, use: true, count_use: 1, drugMultiple: 300, drugHeal: 10, need_group: true, canSplit: true },
    { item_id: 55, name: langStringDefault("inventory.0bb13fd7a594f0250ecdeafa172284f6"), type: ITEM_TYPE.SYSTEM, weight: 1, base_weight: 5, prop: "ng_proc_drug01a002", default_count: 1, need_group: true, defaultCost: 10, canSplit: true, protect: true },
    { item_id: 56, name: langStringDefault("inventory.ca4857cc8c393db6d2e8b67c57391d96"), type: ITEM_TYPE.SYSTEM, weight: 1, base_weight: 5, prop: "rop_a4_pile_01", default_count: 1, need_group: true, defaultCost: 5, canSplit: true, protect: true },
    { item_id: 57, name: langStringDefault("inventory.c5bea43133e694597194b690c568901e"), type: ITEM_TYPE.SYSTEM, weight: 1, base_weight: 5, prop: "p_a4_sheets_s", default_count: 1, need_group: true, defaultCost: 5, canSplit: true, protect: true },
    { item_id: 58, name: langStringDefault("inventory.050069f0aca357d0459c9b803ccc6803"), type: ITEM_TYPE.OTHER, weight: 1, base_weight: 100, prop: "prop_drug_bottle", default_count: 1, need_group: true, canSplit: true, protect: true }, //Вадим
    { item_id: 59, name: langStringDefault("inventory.eab475e0ac1e3765e1bb4212195fe841"), type: ITEM_TYPE.OTHER, weight: 1, base_weight: 100, prop: "prop_cs_script_bottle", default_count: 1, need_group: true, canSplit: true, protect: true }, //Вадим
    { item_id: 60, name: langStringDefault("inventory.c988ba79e8fa1998d1f025f5d93b5a35"), type: ITEM_TYPE.OTHER, weight: 1, base_weight: 100, prop: "prop_energy_drink", default_count: 1, need_group: true, canSplit: true, protect: true }, //Вадим

    // Алкоголь
    { item_id: 200, name: langStringDefault("inventory.352a79e06679fb7ef8aea78eb4769f43"), type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "ng_proc_beerbottle_01a", default_count: 1, use: true, count_use: 1, defaultCost: 1200, propAttachParam: [0.135, -0.060, 0.065, 242, 0, 0], protect: true},
    { item_id: 201, name: langStringDefault("inventory.12fea0667fa3271e0c47ea6a212e6093"), type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_amb_beer_bottle", default_count: 1, use: true, count_use: 1, defaultCost: 800, propAttachParam: [0.135, 0.055, 0.005, 234, 0, 0], protect: true },
    { item_id: 202, name: langStringDefault("inventory.440efb8d8fc130e90521fe77d3c10461"), type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_beerdusche", default_count: 1, use: true, count_use: 1, defaultCost: 800, propAttachParam: [0.130, -0.140, 0.150, 233, 0, 0], protect: true },
    { item_id: 203, name: langStringDefault("inventory.139b0e45e94c719db4fe16567a65739f"), type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_beer_amopen", default_count: 1, use: true, count_use: 1, defaultCost: 800, propAttachParam: [0.135, -0.125, 0.140, 234, 0, 0], protect: true },
    { item_id: 204, name: langStringDefault("inventory.238608a50cea54852618103bcb36a784"), type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_beer_bar", default_count: 1, use: true, count_use: 1, defaultCost: 800, propAttachParam: [0.135, -0.125, 0.140, 232, 0, 0], protect: true },
    { item_id: 205, name: langStringDefault("inventory.203114f7c9733bb862a5338126d614c3"), type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_beer_blr", default_count: 1, use: true, count_use: 1, defaultCost: 800, propAttachParam: [0.135, -0.135, 0.110, 239, 0, 0], need_group: true, protect: true },
    { item_id: 206, name: langStringDefault("inventory.2689a7f6026227d7dec6657cdd65b9e0"), type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_beer_patriot", default_count: 1, use: true, count_use: 1, defaultCost: 800, protect: true },
    { item_id: 207, name: langStringDefault("inventory.19e52646eaf108289bb58600010a6599"), type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_beer_pride", default_count: 1, use: true, count_use: 1, defaultCost: 800 , protect: true},
    { item_id: 208, name: langStringDefault("inventory.227b2029200884f5dc8c0cb6f749bd4d"), type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_beer_stz", default_count: 1, use: true, count_use: 1, defaultCost: 800, protect: true},
    { item_id: 209, name: langStringDefault("inventory.adbda24ef15ecefccc447a79da362f51"), type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "ba_prop_battle_whiskey_opaque_s", default_count: 1, use: true, count_use: 1, defaultCost: 1500, protect: true },
    { item_id: 210, name: langStringDefault("inventory.abee5c043e3ef039a6fd4397de1f5e97"), type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_cs_whiskey_bottle", default_count: 1, use: true, count_use: 1, defaultCost: 1500, protect: true },
    { item_id: 211, name: langStringDefault("inventory.fd337b28041c425c1393e049e33d0a69"), type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_vodka_bottle", default_count: 1, use: true, count_use: 1, defaultCost: 1000, protect: true },
    { item_id: 212, name: langStringDefault("inventory.c11e907669501c84f8d3136f2bef8e50"), type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_wine_bot_01", default_count: 1, use: true, count_use: 1, defaultCost: 1200 , protect: true},
    { item_id: 213, name: langStringDefault("inventory.4bb14e96c1e96e9b6d2ea13c75fa1e8b"), type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_wine_bot_02", default_count: 1, use: true, count_use: 1, defaultCost: 1200, protect: true },
    { item_id: 214, name: langStringDefault("inventory.e618f61bd523f04a7300cc05875413c4"), type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true, count_use: 1, defaultCost: 1200, protect: true},
    { item_id: 215, name: langStringDefault("inventory.9c837b57da1b6dbc07fc15e18d867f8e"), type: ITEM_TYPE.ALCO, weight: 1, base_weight: 100, prop: "prop_bottle_cognac", default_count: 1, use: true, count_use: 1, defaultCost: 1400, protect: true },

    // Оружие
    { item_id: 500, name: langStringDefault("inventory.b9f32a3dc56494184368f036977aa6c5"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7700, prop: "w_ar_assaultrifle", default_count: 1, use: true, attachBody: "LONG", defaultCost: 3000},
    { item_id: 501, name: langStringDefault("inventory.d0992b80da68567871e2148516a386de"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_pi_pistol", default_count: 1, use: true, defaultCost: 1500, attachBody: "SHORT" },
    { item_id: 502, name: langStringDefault("inventory.8a1d711033b10dd85c5badddb339ad4c"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_pi_pistolmk2", default_count: 1, use: true, defaultCost: 1600, attachBody: "SHORT" },
    { item_id: 503, name: langStringDefault("inventory.59797ef4bd04a38aa4f28b928028d994"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 700, prop: "w_pi_combatpistol", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 800 },
    { item_id: 504, name: langStringDefault("inventory.65af85eb0df16488d448ffee38235353"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 700, prop: "w_pi_appistol", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 800 },
    { item_id: 505, name: langStringDefault("inventory.efdfc607e215e8d17e3700abb5ba4426"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 700, prop: "w_pi_pistol50", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 1500 },
    { item_id: 506, name: langStringDefault("inventory.af52972d5e8a3bb1ed40f8ae2be41e90"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_pi_sns_pistol", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 800 },
    { item_id: 507, name: langStringDefault("inventory.453e35a2e9f00615dd7d19fe70189a67"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_pi_sns_pistolmk2", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 800 },
    { item_id: 508, name: langStringDefault("inventory.3f40b74d402a2bef5adc6968dee08fa8"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 700, prop: "w_pi_heavypistol", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 1200 },
    { item_id: 509, name: langStringDefault("inventory.b85210836a7e964c1050334bf8c8c017"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 800, prop: "w_pi_vintage_pistol", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 1000 },
    { item_id: 510, name: langStringDefault("inventory.e1c7d4734dd6b2cc2bcbe9b094774e9e"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 1100, prop: "w_pi_singleshot", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 1500 },
    { item_id: 511, name: langStringDefault("inventory.737337156d4df613fc364916fc87173f"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 1200, prop: "w_pi_revolver", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 5000 },
    { item_id: 512, name: langStringDefault("inventory.13c0a5cb36156eef2db9a4d8df4d06fc"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 1200, prop: "w_pi_revolvermk2", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 5500 },
    { item_id: 513, name: langStringDefault("inventory.50e75a3cc6eec5c44443c6d983c51469"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 1300, prop: "w_pi_wep1_gun", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 5000 },
    { item_id: 514, name: langStringDefault("inventory.8e02bd12a3b17f3da521176de12c1392"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_pi_ceramic_pistol", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 800 },
    { item_id: 515, name: langStringDefault("inventory.48ac3612b4346447a04266ff43a41193"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 1400, prop: "w_pi_wep2_gun", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 1500 },
    { item_id: 516, name: langStringDefault("inventory.f9ec4ad371b00e8383efd8d01207e6e2"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_sb_microsmg", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 6500 },
    { item_id: 517, name: langStringDefault("inventory.df83d82ab1ec7c2efb47c905c335fa2b"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 3300, prop: "w_sb_smg", default_count: 1, use: true, defaultCost: 4500, attachBody: "SHORT" },
    { item_id: 518, name: langStringDefault("inventory.6b8cbd0c8f0846da6ecfaeebe5d15c54"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 1000, prop: "w_sb_smgmk2", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 3000 },
    { item_id: 519, name: langStringDefault("inventory.7b5bf66c924f5c5e54b3bb7fef2e793e"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 1500, prop: "w_sb_assaultsmg", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 5000 },
    { item_id: 520, name: langStringDefault("inventory.b39f4320bd8a75c47f72ee1e16be6012"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 3200, prop: "w_sb_pdw", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 3000 },
    { item_id: 521, name: langStringDefault("inventory.59d8ef4d2e535ad47e45a2bf1b670d00"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 700, prop: "w_sb_compactsmg", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 2000 },
    { item_id: 522, name: langStringDefault("inventory.01d55e2111f7c42e5baa88b5ff9ab53f"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 450, prop: "w_sb_minismg", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 2000 },
    { item_id: 523, name: langStringDefault("inventory.7b248ca83fb61cd7f3eada65dca71dea"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7000, prop: "w_sg_pumpshotgun", default_count: 1, use: true, attachBody: "LONG", defaultCost: 4500 },
    { item_id: 524, name: langStringDefault("inventory.a950612a7acff8e91bbda1338c542493"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7000, prop: "w_sg_pumpshotgunmk2", default_count: 1, use: true, attachBody: "LONG", defaultCost: 5000 },
    { item_id: 525, name: langStringDefault("inventory.107ebe24a603a1d9f6bd67a57d27c84e"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7000, prop: "w_sg_sawnoff", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 4000 },
    { item_id: 526, name: langStringDefault("inventory.9ef01d6345f26e36db2621c5889808e6"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7000, prop: "w_sg_assaultshotgun", default_count: 1, use: true, attachBody: "LONG", defaultCost: 5000 },
    { item_id: 527, name: langStringDefault("inventory.8a19865c278e63534ca9677f1281527d"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7000, prop: "w_sg_bullpupshotgun", default_count: 1, use: true, attachBody: "LONG", defaultCost: 5000 },
    { item_id: 528, name: langStringDefault("inventory.aa9872676d5e985865830d0cd5442371"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 8000, prop: "w_ar_musket", default_count: 1, use: true, attachBody: "LONG", defaultCost: 7000 },
    { item_id: 529, name: langStringDefault("inventory.573cbd84a433c89329440b341c969619"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7500, prop: "w_sg_heavyshotgun", default_count: 1, use: true, attachBody: "LONG", defaultCost: 6000 },
    { item_id: 530, name: langStringDefault("inventory.c4dd9447e3554e4d49d6c7b259074285"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7500, prop: "w_sg_doublebarrel", default_count: 1, use: true, defaultCost: 3000, attachBody: "SHORT" },
    { item_id: 531, name: langStringDefault("inventory.e8dc12075fa85cd21cf3b3b97fac95f1"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7500, prop: "w_sg_sweeper", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 4000 },
    { item_id: 532, name: langStringDefault("inventory.8c14422ce87d6e11769789cb813fbfe2"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7000, prop: "w_ar_assaultriflemk2", default_count: 1, use: true, attachBody: "LONG", defaultCost: 20000 },
    { item_id: 533, name: langStringDefault("inventory.9adc6e6cb164678f6e0e1d85a79f8ab9"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 6500, prop: "w_ar_carbinerifle", default_count: 1, use: true, attachBody: "LONG", defaultCost: 5000 },
    { item_id: 534, name: langStringDefault("inventory.60f12a6433f4426cdd23db26aa3fe678"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 6500, prop: "w_ar_carbineriflemk2", default_count: 1, use: true, attachBody: "LONG", defaultCost: 6000 },
    { item_id: 535, name: langStringDefault("inventory.a3146102c8a30722e85f2271b73f56ab"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 6500, prop: "w_ar_advancedrifle", default_count: 1, use: true, attachBody: "LONG", defaultCost: 7000 },
    { item_id: 536, name: langStringDefault("inventory.e3b52682b14d262a36da0fb2bd33f746"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 6400, prop: "w_ar_specialcarbine", default_count: 1, use: true, attachBody: "LONG", defaultCost: 5000 },
    { item_id: 537, name: langStringDefault("inventory.0cf81c7c25b51bcc79a99397da5d89ae"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 6200, prop: "w_ar_specialcarbinemk2", default_count: 1, use: true, attachBody: "LONG", defaultCost: 5000 },
    { item_id: 538, name: langStringDefault("inventory.4b76bcd13fd2ea04a1506fa65850e77a"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 8000, prop: "w_ar_bullpuprifle", default_count: 1, use: true, attachBody: "LONG", defaultCost: 5000 },
    { item_id: 539, name: langStringDefault("inventory.134aa21545f87fec19b6e3280912c021"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 8000, prop: "w_ar_bullpupriflemk2", default_count: 1, use: true, attachBody: "LONG", defaultCost: 5000 },
    { item_id: 540, name: langStringDefault("inventory.f367265072789fc465fd14a3903988ec"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 4200, prop: "w_ar_assaultrifle_smg", default_count: 1, use: true, defaultCost: 5000, attachBody: "LONG" },
    { item_id: 541, name: langStringDefault("inventory.f59a229d656330e39dfd6376dffda582"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 11700, prop: "w_mg_mg", default_count: 1, use: true, attachBody: "LONG", defaultCost: 100000 },
    { item_id: 542, name: langStringDefault("inventory.4318716cd77f141c1d31b5b9009e8821"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 14500, prop: "w_mg_combatmg", default_count: 1, use: true, attachBody: "LONG", defaultCost: 70000 },
    { item_id: 543, name: langStringDefault("inventory.aea1327c713cc305a5417adacf9ed183"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 15000, prop: "w_mg_combatmgmk2", default_count: 1, use: true, attachBody: "LONG", defaultCost: 100000 },
    { item_id: 544, name: langStringDefault("inventory.8c65ed0a582dc7c955c8e5a1b417ae8c"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 11000, prop: "w_sb_gusenberg", default_count: 1, use: true, attachBody: "LONG", defaultCost: 5000 },
    { item_id: 545, name: langStringDefault("inventory.abb74f02307f784d4d636a3d55343c25"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 11000, prop: "w_sr_sniperrifle", default_count: 1, use: true, attachBody: "LONG", defaultCost: 60000 },
    { item_id: 546, name: langStringDefault("inventory.77736d239c83ac899d989a8c815ed9f8"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 13000, prop: "w_sr_heavysniper", default_count: 1, use: true, attachBody: "LONG" },
    { item_id: 547, name: langStringDefault("inventory.5704b06eef304787d7c01889fbb250c3"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 14000, prop: "w_sr_heavysnipermk2", default_count: 1, use: true, attachBody: "LONG", defaultCost: 100000 },
    { item_id: 548, name: langStringDefault("inventory.637992d7588615c94da29854ff83d382"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 13000, prop: "w_sr_marksmanrifle", default_count: 1, use: true, attachBody: "LONG", defaultCost: 150000 },
    { item_id: 549, name: langStringDefault("inventory.0816ea5bad2c345535de8fe460797de0"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 13000, prop: "w_sr_marksmanriflemk2", default_count: 1, use: true, attachBody: "LONG", defaultCost: 150000 },
    { item_id: 550, name: langStringDefault("inventory.8547d572546eba768de79a80ae9fb3e7"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_pi_stungun", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 551, name: langStringDefault("inventory.fe8ffc71189e443abd35deda065c37bc"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_me_bat", default_count: 1, use: true, attachBody: "BAT" },
    { item_id: 552, name: langStringDefault("inventory.855b554669a2d0346550eac33b795439"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 553, name: langStringDefault("inventory.dc612ded998a2425d0eb0ef0310a09a6"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_me_nightstick", default_count: 1, use: true, attachBody: "BATON" },
    { item_id: 554, name: langStringDefault("inventory.160f398602a253ee168836504e0ea624"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_lr_firework", default_count: 1, use: true, attachBody: "LONG" },
    { item_id: 555, name: langStringDefault("inventory.f802504ee5b97543d65f28683b051e81"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_flashlight", default_count: 1, use: true, attachBody: "SHORT", defaultCost: 500 },
    { item_id: 556, name: langStringDefault("inventory.4ef29aebeb978b72120ba877bca80e55"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_flashlight", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 557, name: langStringDefault("inventory.52c220d477a55353b78a01f8380d2aae"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_flashlight", default_count: 1, use: true, attachBody: "SHORT"  },
    { item_id: 558, name: langStringDefault("inventory.a3b6aacf3a37c630c2ff51032f3f03ad"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_flashlight", default_count: 1, use: true, attachBody: "SHORT"  },
    { item_id: 559, name: langStringDefault("inventory.fd31e24b56040d5ee2c7eeadfd9d2b44"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_flashlight", default_count: 1, use: true, attachBody: "SHORT"  },
    { item_id: 560, name: langStringDefault("inventory.616d1ba010907f8e04b54c8b73655890"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "w_am_fire_exting", default_count: 1, use: true, blockMove: true  },
    { item_id: 561, name: langStringDefault("inventory.33f1fe3ff9076f2319cd46f2bf3f704a"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 562, name: langStringDefault("inventory.3d8f71cb18ecf94f29c45a1f41ed9852"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 563, name: langStringDefault("inventory.610c283d892481e331ba27c861fb5244"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 564, name: langStringDefault("inventory.43fe9a38a5bf09709cf7a97912e1fa24"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 565, name: langStringDefault("inventory.8cf36a85bb021ff84d7ca28ec2b10b41"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 566, name: langStringDefault("inventory.39bbc975930673054a56c4f7553428e3"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 567, name: langStringDefault("inventory.7865d4619a0cc4ceda9d5618418823ee"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 568, name: langStringDefault("inventory.d25d364b1bab9f3f4df4632e5389737e"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 569, name: langStringDefault("inventory.d77f306cc37e00d707c452c6d1e266b9"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 570, name: langStringDefault("inventory.ebddc84bb224e499b32d46795583fb3c"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 571, name: langStringDefault("inventory.e7e1c1a6012c4c348f69e7c5358bbd90"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7000, prop: "w_ar_assaultriflemk2", default_count: 1, use: true, attachBody: "LONG", defaultCost: 20000 },
    { item_id: 572, name: langStringDefault("inventory.638453156f1c0f9272665953d19519ba"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 7000, prop: "weapon_flashlight", default_count: 1, use: true, attachBody: "LONG", defaultCost: 20000 },
    { item_id: 573, name: langStringDefault("inventory.3b5a0dbb87c1f81730e8fdf6d5caab84"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },
    { item_id: 574, name: langStringDefault("inventory.0f2d5e9c46ed54b4f0b3be9cedb50fc9"), type: ITEM_TYPE.WEAPON, weight: 0, base_weight: 500, prop: "weapon_knife", default_count: 1, use: true, attachBody: "SHORT" },


     // Магазины




    // Системные предметы
    { item_id: 798, name: langStringDefault("inventory.673720bac2079302eb43a9343ded930b"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5400, prop: "ch_prop_ch_ld_bomb_01a", default_count: 1, need_group: true, canSplit: true },
    { item_id: 799, name: langStringDefault("inventory.885dbc44e32dfa5caf2a96886f065894"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 100, prop: "prop_cs_cuffs_01", default_count: 1, use: true, need_group: true, canSplit: true },
    { item_id: 800, name: langStringDefault("inventory.84232a83757a546d4ff7b666439ad6db"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 40, prop: "p_ld_id_card_002", default_count: 1, use: true, helpIcon: "document", protect: true, helpDesc: langStringDefault("inventory.4f1da8f093cb414d6f236dc389fbe94f") },
    { item_id: 801, name: langStringDefault("inventory.1a338e8a96d0e86a4afc66c2666f982c"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 40, prop: "prop_cs_credit_card", default_count: 1, use: true, helpIcon: "card", helpDesc: langStringDefault("inventory.d23a6111e44aa57be27e52fdd7beb0b7"), protect: true },
    { item_id: 802, name: langStringDefault("inventory.eecc53e608eac006c86f7a5ae285e289"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 100, prop: "ng_proc_paper_03a", default_count: 1, use: true, protect: true, },

    { item_id: 803, name: langStringDefault("inventory.e7450a6bd12108c736fa5e7c7fe3987a"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "prop_cs_documents_01", default_count: 1, use: true, protect: true, },
    // { item_id: 804, name: langStringDefault("inventory.e10f89eed8a5b4af5570c7b10ea546b2"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 100, prop: "prop_cs_cuffs_01", default_count: 1, need_group: true, canSplit: true },

    { item_id: 805, name: langStringDefault("inventory.2f1e9b7949f8e32ed53d2d8f06992a1a"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 100, prop: "prop_cuff_keys_01", default_count: 1, use: true, protect: true, },
    { item_id: 806, name: langStringDefault("inventory.8a0cfa2c76966eb30a6d80c25bfeeb5a"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 1100, prop: "prop_barrier_work05", default_count: 1, canFactionsTake: [FACTION_ID.LSPD,FACTION_ID.ARMY,FACTION_ID.FIB]  },
    { item_id: 807, name: langStringDefault("inventory.724b48824ddb13f6569ffb15c2143081"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 800, prop: "prop_mp_cone_01", default_count: 1, canFactionsTake: [FACTION_ID.LSPD,FACTION_ID.ARMY,FACTION_ID.FIB] },
    { item_id: 808, name: langStringDefault("inventory.6d0b84ded2c1bb692db28fff291ccc86"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 600, prop: "prop_cone_float_1", default_count: 1, canFactionsTake: [FACTION_ID.LSPD,FACTION_ID.ARMY,FACTION_ID.FIB]  },
    { item_id: 809, name: langStringDefault("inventory.6637ab43395e00a85bd48ff8739fdfb4"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 600, prop: "prop_mp_cone_03", default_count: 1, canFactionsTake: [FACTION_ID.LSPD,FACTION_ID.ARMY,FACTION_ID.FIB]  },
    { item_id: 810, name: langStringDefault("inventory.e3a63b369684a40dd84c90f0d5813168"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 600, prop: "prop_air_conelight", default_count: 1, canFactionsTake: [FACTION_ID.LSPD,FACTION_ID.ARMY,FACTION_ID.FIB]  },
    { item_id: 811, name: langStringDefault("inventory.29d40185280ef1e593d2514ed7e1f5d4"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 330, prop: "p_cash_envelope_01_s", default_count: 1, use: true },
    { item_id: 813, name: langStringDefault("inventory.7d01c5597485cf29ff780dc9bcbe8fce"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "gr_prop_gr_jailer_keys_01a", default_count: 1, use: true, need_group: true, canSplit: true },
    { item_id: 815, name: langStringDefault("inventory.46683239c8628d9ea12c8acbc669a062"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 330, prop: "gr_prop_gr_tool_box_01a", default_count: 1, use: true, defaultCost: 500, protect: true, canSplit: true },
    { item_id: 816, name: langStringDefault("inventory.4600df2855808ef66e68ab90d504808a"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 330, prop: "prop_devin_rope_01", default_count: 1, use: true , defaultCost: 100, protect: true},
    { item_id: 817, name: langStringDefault("inventory.1e0ebbfbd18d8f75d321a299790696e7"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10000, prop: "prop_ld_jerrycan_01", default_count: 15, use: true, defaultCost: 500, protect: true },
    { item_id: 818, name: langStringDefault("inventory.0d532a65712b8399cb062643128cb2dc"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 30000, prop: "prop_barier_conc_01a", default_count: 1, },
    { item_id: 819, name: langStringDefault("inventory.99f408c658fdbb2ecf6b0308998a8afe"), type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true, canSplit: true },
    { item_id: 820, name: langStringDefault("inventory.07ca814506bf38c62648fa8c7266210a"), type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true , canSplit: true},
    { item_id: 821, name: langStringDefault("inventory.42929223be942368322a5171ceb8723b"), type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true , canSplit: true},
    { item_id: 822, name: langStringDefault("inventory.6c7d9e0690abfb0f053db67c7d56b6d8"), type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true , canSplit: true},
    { item_id: 823, name: langStringDefault("inventory.9c42253a04a3d7d0bbf5090a79cedd45"), type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true , canSplit: true},
    { item_id: 824, name: langStringDefault("inventory.56e8d324226e93fe98488e169436645f"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 100, prop: "prop_cs_documents_01", default_count: 1, protect: true, use: true},

    { item_id: 830, name: langStringDefault("inventory.01b2894b0befb908717e930b02b81ffe"), type: ITEM_TYPE.SYSTEM, weight: 8500, base_weight: 0, prop: "prop_cs_steak", default_count: 1, need_group: true, canSplit: true, helpDesc: langStringDefault("inventory.a08d08d7afa7381d5a68e3a11f9eb032"), helpIcon: "meat", protect: true },
    { item_id: 831, name: langStringDefault("inventory.78d93fe34abf955fd4461bf7a9b5506a"), type: ITEM_TYPE.SYSTEM, weight: 3000, base_weight: 0, prop: "prop_cs_steak", default_count: 1, need_group: true, canSplit: true, helpDesc: langStringDefault("inventory.7c3f30a736a51cf8e1cb05d60c37cdb3"), helpIcon: "meat", protect: true },
    { item_id: 832, name: langStringDefault("inventory.e760a92facd6ae23377d75f1db983b28"), type: ITEM_TYPE.SYSTEM, weight: 10000, base_weight: 0, prop: "prop_cs_steak", default_count: 1, need_group: true, canSplit: true, helpDesc: langStringDefault("inventory.47e0a6d35708aad4586490684a632b5c"), helpIcon: "meat", protect: true },
    { item_id: 833, name: langStringDefault("inventory.34964c76a75dcf1dabe5563aefce5182"), type: ITEM_TYPE.SYSTEM, weight: 1000, base_weight: 0, prop: "prop_cs_steak", default_count: 1, need_group: true, canSplit: true, helpDesc: langStringDefault("inventory.9d80aceea40512484b97fa4f4909d35d"), helpIcon: "meat", protect: true },
    { item_id: 834, name: langStringDefault("inventory.aec3e604d246d448b0e568baae89bacf"), type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_steak", default_count: 1, need_group: true, canSplit: true, helpDesc: langStringDefault("inventory.c35669f26d15850d8273b9668d35bbee"), helpIcon: "meat", protect: true },
    { item_id: 835, name: langStringDefault("inventory.da438f1ae34818181197e5fe756b1091"), type: ITEM_TYPE.SYSTEM, weight: 7000, base_weight: 0, prop: "prop_cs_steak", default_count: 1, need_group: true, canSplit: true, helpDesc: langStringDefault("inventory.fe4eab9a118a46c9926aee76f0af851e"), helpIcon: "meat", protect: true },
    { item_id: 836, name: langStringDefault("inventory.ed77b5c98c07b2ce335b0d7bddfdc424"), type: ITEM_TYPE.SYSTEM, weight: 4500, base_weight: 0, prop: "prop_cs_steak", default_count: 1, need_group: true, canSplit: true, helpDesc: langStringDefault("inventory.ab2e2079e1df619fbd59673a45bff8b0"), helpIcon: "meat", protect: true },


    { item_id: 849, name: langStringDefault("inventory.91746f9f675b7058e0c7e76283066745"), type: ITEM_TYPE.OTHER, weight: 5, base_weight: 4500, prop: "prop_bodyarmour_03", default_count: 50, use: true, defaultCost: 2000},
    { item_id: 850, name: langStringDefault("inventory.c77485c8cc68dd2dcabc266eb04bb78c"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 450, prop: "prop_amb_phone", default_count: 1, use: true, defaultCost: 2200, helpIcon: "phone",    helpDesc: langStringDefault("inventory.c94b360438f42d761dbb0333919964bd"), protect: true, },
    { item_id: 851, name: langStringDefault("inventory.403ed9b757c185edfb4d1bb5e5c9843c"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "ch_prop_vault_key_card_01a", default_count: 1, use: true, defaultCost: 100, helpIcon: "sim-card", helpDesc: langStringDefault("inventory.6f459ffabcbe8594e298e70e6988b684"), protect: true, },
    { item_id: 852, name: langStringDefault("inventory.9c60adb8c0a51a68271655a5a2d38e30"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 550, prop: "prop_cs_hand_radio", default_count: 1, use: true, defaultCost: 1000, protect: true, },
    { item_id: 853, name: langStringDefault("inventory.06dff8b9f85bcd85d6248038f6534857"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 550, prop: "hei_bank_heist_laptop", default_count: 1, use: true },
    { item_id: 854, name: langStringDefault("inventory.f49f7be037a403e392a64e31983fd6c5"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5400, prop: "ch_prop_ch_ld_bomb_01a", default_count: 1, need_group: true, canSplit: true },
    { item_id: 855, name: langStringDefault("inventory.a13e0c50fe4815fc592d4eb87adf9888"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 2500, prop: "prop_fishing_rod_02", default_count: 1, defaultCost: 5000, use: true },
    { item_id: 856, name: langStringDefault("inventory.e39b61917c519da41a025469f4379413"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 800, prop: "xm_prop_x17_tablet_01", default_count: 1, defaultCost: 2500, protect: true, use: true, helpIcon: "tablet", helpDesc: langStringDefault("inventory.4ff778b523277804423ee9905a435b3e") },
    { item_id: 857, name: langStringDefault("inventory.8f0b011273cb55244205b89a4fece269"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 800, prop: "ch_prop_ch_explosive_01a", default_count: 1, need_group: true, canSplit: true },
    { item_id: 858, name: langStringDefault("inventory.5629bca0edb096f09ad9884396a4e379"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 800, prop: "prop_ld_cable_tie_01", default_count: 1, need_group: true, canSplit: true },
    { item_id: 859, name: langStringDefault("inventory.228784797e748196d18d9148776370c2"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 800, prop: "prop_prototype_minibomb", default_count: 1, need_group: true, canSplit: true},
    { item_id: 860, name: langStringDefault("inventory.2772030c16b702bb4a33b4a18072a7da"), type: ITEM_TYPE.OTHER, weight: 10, base_weight: 9000, prop: "prop_bodyarmour_03", default_count: 100, use: true, defaultCost: 4000},
    // { item_id: 861, name: langStringDefault("inventory.2ec38f1e52548a551eee9045aed775ef"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 300, prop: "prop_bodyarmour_03", default_count: 1, defaultCost: 1500, protect: true, use: true},
    { item_id: 862, name: langStringDefault("inventory.f025472df6179629656499e2588889e6"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10000, prop: "prop_ld_jerrycan_01", default_count: 1, use: true, defaultCost: 10000, protect: true },
    { item_id: 863, name: langStringDefault("inventory.9b6fad18c216e678942c8d8a56067c69"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 1000, prop: "xm_prop_x17_bag_01d", default_count: 1, protect: true },
    { item_id: 864, name: langStringDefault("inventory.bae129d479c854f9c1c744ace874fbf3"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10000, prop: "prop_onyx_box", default_count: 1, protect: true },

    { item_id: 865, name: langStringDefault("inventory.91bfb771512c679de07a64b1a012ac88"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 1000, prop: "w_ar_railgun_mag1", default_count: 1, use: true, defaultCost: 5000 , protect: true},
    { item_id: 866, name: langStringDefault("inventory.db4c7d48ef79100142b09040118fe497"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true, blockMove: true },
    { item_id: 867, name: langStringDefault("inventory.9115614a8a2f3bdeb64082cf53a9bc33"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 15000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    { item_id: 868, name: langStringDefault("inventory.a46b9907514b91c78960d364f5859f1e"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 2000, prop: "ind_prop_firework_03", default_count: 1, use: true, protect: true, defaultCost: 15000 },
    { item_id: 869, name: langStringDefault("inventory.777b28d23bf114c245908334c69ce1d7"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 2000, prop: "pp_flowersbucket", default_count: 1, use: true, inHand: true, defaultCost: 5000, propAttachParam: [0.135, -0.060, 0.065, 242, 0, 0] },
    { item_id: 870, name: langStringDefault("inventory.13efffc0264dc47534baafa8ae1c2169"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 1000, prop: "prop_cs_dildo_01", default_count: 1, use: true, inHand: true, defaultCost: 5000, propAttachParam: [0.130, 0.050, -0.005, 66, 159, 0], protect: true },
    { item_id: 871, name: langStringDefault("inventory.59f7b979629d1de959854be167c53249"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 1000, prop: "prop_mr_rasberryclean", default_count: 1, use: true, inHand: true, defaultCost: 25000, propAttachParam: [-0.015, 0.150, -0.050, 186, 271, 0], protect: true },


    // Прочее (Броники, удочки и тд)
    { item_id: 872, name: langStringDefault("inventory.892ee5cbd29cd17f9597ae90b235c713"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 300, prop: "prop_bodyarmour_03", default_count: 1, protect: true},
    { item_id: 873, name: langStringDefault("inventory.cf09696fc55a94ee60d7135136a9b360"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 300, prop: "prop_bodyarmour_03", default_count: 1, protect: true, use: true},
    { item_id: 874, name: langStringDefault("inventory.53011563861f849aaf327f9e2c437633"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 300, prop: "prop_bodyarmour_03", default_count: 1, protect: true},
    { item_id: 875, name: langStringDefault("inventory.dcdecb0d9d11774ead5971ef8cfa07d0"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 300, prop: "prop_bodyarmour_03", default_count: 1, protect: true},
    { item_id: 876, name: langStringDefault("inventory.b824f7a60747157e6f827fcc3ba6e211"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 300, prop: "prop_bodyarmour_03", default_count: 1, protect: true},
    { item_id: 877, name: langStringDefault("inventory.e50c9d87f50b8e4691a7043820984d1b"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 300, prop: "prop_bodyarmour_03", default_count: 1, protect: true},
    { item_id: 878, name: langStringDefault("inventory.e265edd31718ace50831e28080728872"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 300, prop: "prop_bodyarmour_03", default_count: 1, protect: true},
    { item_id: 879, name: langStringDefault("inventory.e898e36f255531a95e43a48231fdf2e6"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 200, prop: "prop_grapes_01", default_count: 1, use: false, protect: true },
    { item_id: 880, name: langStringDefault("inventory.3f7667ea301644c3cfecf6ef91406f52"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "bkr_prop_weed_smallbag_01a", default_count: 1, use: false, need_group: true, canSplit: true },
    { item_id: 881, name: langStringDefault("inventory.ece3dbd52457a9548f68d02c18fd85d8"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 1000, prop: "prop_wine_red", default_count: 1, use: false, protect: true },
    { item_id: 882, name: langStringDefault("inventory.d9dd67b22c2da8f72c42f151ed80c4ea"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 1500, prop: "winerow", default_count: 1, use: false, protect: true },
    { item_id: 883, name: langStringDefault("inventory.e549721d5a7d5367f9101a7320ba9b77"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 5, prop: "ng_proc_leaves05", default_count: 1, use: false, protect: true },
    { item_id: 884, name: langStringDefault("inventory.3065c70215704b489635ee0fd0a5e323"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 1000, prop: "v_ind_cs_jerrycan02", default_count: 1, use: false, protect: true },
    
    { item_id: 885, name: langStringDefault("inventory.667be54647b4a0c9be95f4a9112b3614"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 500, prop: "rock_4_cl_2_1", default_count: 1, use: false, protect: true },
    { item_id: 886, name: langStringDefault("inventory.bf60752591f14b16915e5b6e56fea5fc"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 500, prop: "rock_4_cl_2_1", default_count: 1, use: false, protect: true},
    
    { item_id: 887, name: langStringDefault("inventory.6777ae64e0b8f0b292902fd7dc38ec0f"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 15000, prop: "rock_4_cl_2_1", default_count: 1, use: false, protect: true },
    { item_id: 888, name: langStringDefault("inventory.578d3e82dcc6380ee7fd29de9347c186"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 1000, prop: "v_res_d_dildo_f", default_count: 1, use: true, inHand: true, defaultCost: 15000, propAttachParam: [0.130, 0.050, -0.005, 66, 159, 0], protect: true },
    { item_id: 889, name: langStringDefault("inventory.779a8a75596d95dc60e8460dcfdfb2de"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 3000, prop: "v_microphone", default_count: 1, defaultCost: 10000, protect: true },
    { item_id: 890, name: langStringDefault("inventory.5d9adb80c7c916389f6d7c406b0ec3ba"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "prop_cs_bowie_knife", default_count: 1, protect: true, use: true, inHand: true, defaultCost: 10000, propAttachParam: [0.130, 0.050, -0.005, 252, 19, 0], helpDesc: langStringDefault("inventory.5c1a9575b9c3704009a59ae29f14972c"), helpIcon: "knife" },
    { item_id: 891, name: langStringDefault("inventory.51c10ab385fd832ef445829168f4bd10"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 600, prop: "prop_beach_fire", default_count: 1, protect: true, defaultCost: 5000},
    { item_id: 892, name: langStringDefault("inventory.a86c403cf1b075c3f4af7d1a981674c9"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 1000, prop: "prop_skid_tent_01", default_count: 1, protect: true, defaultCost: 5000},
    { item_id: 893, name: langStringDefault("inventory.7da67ae46b07c1540cd135d55b997a80"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "prop_chaircamp", default_count: 1, protect: true, defaultCost: 5000},
    { item_id: 894, name: langStringDefault("inventory.efb30a32ddd532f5c185de8eb9b6b535"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 1000, prop: "prop_tapeplayer_01", default_count: 1, use: true, helpDesc: langStringDefault("inventory.b47bd5ef334076faeea8b2415ec94207"), helpIcon: "boombox", defaultCost: 10000, protect: true},
    { item_id: 895, name: langStringDefault("inventory.40a23946043c457badc8add72ccf03b8"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "bkr_prop_weed_smallbag_01a", default_count: 1, protect: true},
    { item_id: 896, name: langStringDefault("inventory.17368cd20df4823220812cfcec3ea314"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "bkr_prop_weed_smallbag_01a", default_count: 1, protect: true},
    { item_id: 897, name: langStringDefault("inventory.762495d15e30215a45b9bee3ef5db4db"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "prop_cs_steak", default_count: 1, protect: true},
    { item_id: 898, name: langStringDefault("inventory.ec26dced57cacc6e8b37b911ac28fb7e"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "prop_cs_steak", default_count: 1, protect: true},
    { item_id: 899, name: langStringDefault("inventory.a34493738be28416095840bcb7a97c68"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 50, prop: "prop_cuff_keys_01", default_count: 1 },
// Медикаменты
    { item_id: 900, name: langStringDefault("inventory.1f357df09542686358e8c08e70100c30"), type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "prop_cs_pills", default_count: 1, use: true, count_use: 1, defaultCost: 120, need_group: true, canSplit: true, protect: true },
    { item_id: 901, name: langStringDefault("inventory.2df56a85aeace448af285b5f7ea876c1"), type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "ex_office_swag_pills2", default_count: 1, use: true, count_use: 1, defaultCost: 150, need_group: true, canSplit: true, protect: true },
    { item_id: 902, name: langStringDefault("inventory.efe611f0508be8df5bad35e617934ea7"), type: ITEM_TYPE.MEDICATION, weight: 350, base_weight: 10, prop: "prop_ld_health_pack", default_count: 1, use: true, need_group: true, defaultCost: 500, canSplit: true, healUse: 100, protect: true },
    { item_id: 903, name: langStringDefault("inventory.aeac079fd10837fc2a636668a91dda1f"), type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "ex_office_swag_pills3", default_count: 1, count_use: 1, defaultCost: 500, need_group: true, canSplit: true, use: true, protect: true },
    { item_id: 904, name: langStringDefault("inventory.07d08a539f74635045ef4e9f0c9140bb"), type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "ex_office_swag_pills2", default_count: 1, use: true, count_use: 1, defaultCost: 300, need_group: true, canSplit: true, protect: true },
    { item_id: 905, name: langStringDefault("inventory.cc2a08c4ee8fabc94ec57bdaa3b47cd9"), type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "prop_syringe_01", default_count: 1, need_group: true, defaultCost: 150, canSplit: true , protect: true},
    { item_id: 906, name: langStringDefault("inventory.7e1221bb76f8cbce320af2dfa77add8d"), type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "prop_cs_package_01", default_count: 1, need_group: true, defaultCost: 150 , canSplit: true, protect: true},
    { item_id: 907, name: langStringDefault("inventory.4f8bdba3464d6d7248297f3b35eeb125"), type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "p_w_ar_musket_chrg", default_count: 1, need_group: true, defaultCost: 125, canSplit: true, healUse: 25, use: true, protect: true },
    { item_id: 908, name: langStringDefault("inventory.6fdc3dafb6dc3d72af1d7570150f5eac"), type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "prop_ld_health_pack2", default_count: 1, need_group: true, defaultCost: 200, canSplit: true, healUse: 50, use: true, protect: true },
    { item_id: 909, name: langStringDefault("inventory.214cdeb16a20e07d43680c88b3c61edb"), type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "p_w_ar_musket_chrg", default_count: 1, need_group: true, defaultCost: 150, canSplit: true, use: true, protect: true },
    { item_id: 910, name: langStringDefault("inventory.829c9c281404a10258a8f634b2b9115d"), type: ITEM_TYPE.MEDICATION, weight: 1, base_weight: 5, prop: "p_w_ar_musket_chrg", default_count: 1, need_group: true, defaultCost: 7000, canSplit: true, use: true, protect: true },

    // Одежда
    { item_id: 949, name: langStringDefault("inventory.57de6c8bfd6a70d01772440652fc5f27"), type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 100, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true},
    { item_id: 950, name: langStringDefault("inventory.353c8b2b1af52c7b42e5f1f3c2fe9e3e"), type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 500, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true},
    { item_id: 951, name: langStringDefault("inventory.8d02c8419ed4b74d7542e250cde3b3fa"), type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 1500, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true },
    { item_id: 952, name: langStringDefault("inventory.2cd1b368d343a427a23c3e68dc43f118"), type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 800, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true },
    { item_id: 953, name: langStringDefault("inventory.1a5e9635542e7ea63718697b3b42b371"), type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 800, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true },
    { item_id: 954, name: langStringDefault("inventory.be318a3e5f824b735871c827e38c7fa9"), type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 400, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true },
    { item_id: 955, name: langStringDefault("inventory.99ff8b68236a3c3c2dfacf5761e615b0"), type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 300, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true },
    { item_id: 956, name: langStringDefault("inventory.b075201d10a441724d65042cc4738f70"), type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 200, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true },
    { item_id: 957, name: langStringDefault("inventory.60a1bbf1ea41a4b7fbee0e954951479e"), type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 200, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true },
    { item_id: 958, name: langStringDefault("inventory.5eb84b514c1e68371ac9a5c9c4ea5dc6"), type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 100, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true },
    { item_id: 959, name: langStringDefault("inventory.08b848007195006aaa63db1fef3d23c7"), type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 150, prop: "bkr_prop_duffel_bag_01a", default_count: 1, use: true, protect: true },
    
    
    { item_id: 960, name: langStringDefault("inventory.bf720079b71a38b2c34a59da6566ccc7"), type: ITEM_TYPE.CLOTH, weight: 0, base_weight: 4500, prop: "prop_bodyarmour_03", default_count: 100, use: true, protect: false, blockHotkey: true, defaultCost: 2500 },


    // Waffenmodifikationen
    { item_id: 1003, name: langStringDefault("inventory.fecccdb488deb947df0660897cdd878e"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 150, prop: "w_at_scope_macro", default_count: 1, use: true, protect: true, defaultCost: 2000 },
    { item_id: 1004, name: langStringDefault("inventory.0c3a167906cc2958f3772801da43c494"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 160, prop: "w_at_scope_small", default_count: 1, use: true, protect: true, defaultCost: 3500 },
    { item_id: 1005, name: langStringDefault("inventory.4ae7bbbb36c0ebf5d342b7098fb42550"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 170, prop: "w_at_scope_medium", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    { item_id: 1006, name: langStringDefault("inventory.1fcdb71348bb9197d6ddffeb30550bcd"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 180, prop: "w_at_scope_large", default_count: 1, use: true, protect: true, defaultCost: 6500 },
    { item_id: 1007, name: langStringDefault("inventory.bfabb47cd24705fc7479f3111d5a50b8"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 350, prop: "w_at_scope_max", default_count: 1, use: true, protect: true, defaultCost: 8000 },
    { item_id: 1008, name: langStringDefault("inventory.3c4d6a1bc8e1fa6b94f1418120d5bb60"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_sights_1", default_count: 1, use: true, protect: true, defaultCost: 2000 },
    { item_id: 1009, name: langStringDefault("inventory.8b0d516da04fb65cd16a1bf409078dd4"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_scope_nv", default_count: 1, use: true, protect: true, defaultCost: 15000 },
    { item_id: 1010, name: langStringDefault("inventory.38e14abb4b23e735bb1bd879014aec15"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 650, prop: "w_at_scope_nv", default_count: 1, use: true, protect: true, defaultCost: 15000 },
    // AR
    { item_id: 1100, name: langStringDefault("inventory.d536d89f4d372ef4a7d2bfc9ad6e46af"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 300, prop: "w_at_ar_supp", default_count: 1, use: true, protect: true, defaultCost: 7000 },
    { item_id: 1101, name: langStringDefault("inventory.f475109d04b459d41bfc2ae1f2bf84b9"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 150, prop: "w_at_afgrip_2", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    { item_id: 1102, name: langStringDefault("inventory.b5fa83e749d54e80d7807df46494a439"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 300, prop: "w_me_flashlight_flash", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    // SNIPERS
    { item_id: 1301, name: langStringDefault("inventory.ff77f9df7dc9c525c20ffc96096b1c95"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 500, prop: "w_at_sr_supp", default_count: 1, use: true, protect: true, defaultCost: 9000 },
    // PISTOL
    { item_id: 1401, name: langStringDefault("inventory.f82292770c29b9ee2f6a503970115a18"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 250, prop: "w_at_pi_supp", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    { item_id: 1403, name: langStringDefault("inventory.511e658e0f4260680cb15d00eb3e7b06"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_pi_comp_2", default_count: 1, use: true, protect: true, defaultCost: 3500 },
    { item_id: 1404, name: langStringDefault("inventory.9482c0a6ca3d904b10fb625718a337b6"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 150, prop: "w_at_pi_rail_1", default_count: 1, use: true, protect: true, defaultCost: 2000 },


    { item_id: 1501, name: langStringDefault("inventory.d18094024caa8cc7e633673560059ec9"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_muzzle_1", default_count: 1, use: true, protect: true, defaultCost: 3000 },
    { item_id: 1502, name: langStringDefault("inventory.cb3f8e7d5f1f6e27845964d03923daef"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_muzzle_2", default_count: 1, use: true, protect: true, defaultCost: 3100 },
    { item_id: 1503, name: langStringDefault("inventory.e2db8ddff0a7396c48a5dcf2ede45900"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_muzzle_3", default_count: 1, use: true, protect: true, defaultCost: 3200 },
    { item_id: 1504, name: langStringDefault("inventory.dda20c6434c9658129cf9e6048683b36"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_muzzle_4", default_count: 1, use: true, protect: true, defaultCost: 3300 },
    { item_id: 1505, name: langStringDefault("inventory.a329d2df565cc51f939dbcabf27b91af"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_muzzle_5", default_count: 1, use: true, protect: true, defaultCost: 3400 },
    { item_id: 1506, name: langStringDefault("inventory.c1ac86ff2309f3888327eba6cb9132a1"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_muzzle_6", default_count: 1, use: true, protect: true, defaultCost: 3500 },
    { item_id: 1507, name: langStringDefault("inventory.e855d63f2b12d362dcdf2d894e8ff983"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_muzzle_7", default_count: 1, use: true, protect: true, defaultCost: 3600 },
    { item_id: 1508, name: langStringDefault("inventory.c1364975791c6237f7803720c1f3a174"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_muzzle_8", default_count: 1, use: true, protect: true, defaultCost: 3700 },
    { item_id: 1509, name: langStringDefault("inventory.38cefa9514d10ebde1023c00dca940e2"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 200, prop: "w_at_muzzle_9", default_count: 1, use: true, protect: true, defaultCost: 3800 },


    { item_id: 1601, name: langStringDefault("inventory.d45a5d689a97ee192740bbf977678fe5"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 4800 },
    
    // { item_id: 1603, name: langStringDefault("inventory.caf5c1bf77e32e2e013ac701d0c910e4"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 10000 },
    // { item_id: 1604, name: langStringDefault("inventory.03f3ed48a44502fdda4d9e36a449f583"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 50000  },
    // { item_id: 1605, name: langStringDefault("inventory.3abd3dc2e7acaa7b05cbcd369a0479d0"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 40000 },
    // { item_id: 1606, name: langStringDefault("inventory.30c391d0961128eba9f9ff1cf1c318ac"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 15000 },
    // { item_id: 1607, name: langStringDefault("inventory.386207a8d642433609771d731efb7dc6"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 10000 },
    // { item_id: 1608, name: langStringDefault("inventory.e1c4ff066eb01bed4f9d8358866e9e68"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 15000 },
    // { item_id: 1609, name: langStringDefault("inventory.f0690c6f36a2258f27645f4de70589ce"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 45000 },
    
    // { item_id: 1611, name: langStringDefault("inventory.abf8263f180ca79f69ef7303b05c8908"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    // { item_id: 1612, name: langStringDefault("inventory.ece2f1bd9fa3f6a33a55e6d448118858"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 25000 },
    // { item_id: 1613, name: langStringDefault("inventory.8f51c07bb6031b10dc76ae35dc3bd462"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 30000 },
    // { item_id: 1614, name: langStringDefault("inventory.a515c4576878e6b277dd735c3adeb7de"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    // { item_id: 1615, name: langStringDefault("inventory.cb78426bac6811e9e92830873d7eaaf6"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    // { item_id: 1616, name: langStringDefault("inventory.0811786fcd7a4f0f95ac1694fc110d27"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 6000 },
    // { item_id: 1617, name: langStringDefault("inventory.bb462912609378d55172c78881d105eb"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    // { item_id: 1618, name: langStringDefault("inventory.ec75500e8479b583eba5d6f7943529c8"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    // { item_id: 1619, name: langStringDefault("inventory.6b8ad1d99c37a892d62cd6869761945c"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 5000 },
    // { item_id: 1620, name: langStringDefault("inventory.2a9ec966ddf6286ab030b79bb2447b03"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 7000 },
    // { item_id: 1621, name: langStringDefault("inventory.65d138efe97f0932d26c405260d3ee54"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 20000 },
    // { item_id: 1622, name: langStringDefault("inventory.118d96a5e538ed1b69e3bf6a2e01a9dc"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 12000 },
    // { item_id: 1623, name: langStringDefault("inventory.e7ea3c4104603b6f5757388da4b00d15"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 30000 },
    // { item_id: 1624, name: langStringDefault("inventory.3480986fbf52ad42506517ccc8b4db61"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 60000 },
    // { item_id: 1625, name: langStringDefault("inventory.d1c42a556cf141fcfeb9e751675f1980"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    // { item_id: 1626, name: langStringDefault("inventory.906c9220161dd998824dff2612fecf08"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 55000 },
    // { item_id: 1627, name: langStringDefault("inventory.4196376880dca668ec952e5f37c5f527"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 100000 },
    // { item_id: 1628, name: langStringDefault("inventory.a33605f431e5c0a9dec95128ffb8ce6e"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 100000 },
    // { item_id: 1629, name: langStringDefault("inventory.011067b53a188e5ca749803ff3bf3bb0"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 100000 },
    // { item_id: 1630, name: langStringDefault("inventory.894e86f06c45a81ad2ab2dcf03ddd257"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 100000 },
    // { item_id: 1631, name: langStringDefault("inventory.9896c626b7b41bfe0b20c984fecbc32c"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 100000 },
    // { item_id: 1632, name: langStringDefault("inventory.5467c3780fbc94fbabf2d76c13dd6666"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 90000 },
    // { item_id: 1633, name: langStringDefault("inventory.62237c6e7b6b2ab7cde775c899dcd92d"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 120000  },
    // { item_id: 1634, name: langStringDefault("inventory.30330f4deeef3175b21351ddc417d4de"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 90000 },
    // { item_id: 1635, name: langStringDefault("inventory.04f36798387a9c46e402e350decbb8c5"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 35000 },
    // { item_id: 1636, name: langStringDefault("inventory.2a11968bf8452daa1501f7fd4f46c005"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 90000 },
    // { item_id: 1637, name: langStringDefault("inventory.dbc094d45e7774587461e5282a8d2faa"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 85000 },
    // { item_id: 1638, name: langStringDefault("inventory.b6ef60536d224e55cb85a894ebb51c0c"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 80000 },
    // { item_id: 1639, name: langStringDefault("inventory.b52c19527bdf1aa88abdc6b4b1448db1"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 100000 },
    // { item_id: 1640, name: langStringDefault("inventory.5f38b73f5130d2efdaa5b35ef2c6a61e"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 120000 },
    // { item_id: 1641, name: langStringDefault("inventory.1e0142c555d00f9418edc28d36390754"), type: ITEM_TYPE.WEAPON_ADDON, weight: 0, base_weight: 600, prop: "w_at_sb_barrel_2", default_count: 1, use: true, protect: true, defaultCost: 120000 },

    // Сумки и рюкзаки
    { item_id: 2000, name: langStringDefault("inventory.bb23de96a6282d1ddc29d89df7b73960"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2001, name: langStringDefault("inventory.ba996b8e27ad0ccd37201eaeaa8898fc"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2002, name: langStringDefault("inventory.1b9dc12e9185ee57de51bc7c928cd5b0"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2003, name: langStringDefault("inventory.97826b1bab67eab69f0a94c849aac6ae"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2004, name: langStringDefault("inventory.59917f8b84edc322a80cba2ba5a28c17"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2005, name: langStringDefault("inventory.1c5272cbc72f66055b476fb9c3e4e65a"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2006, name: langStringDefault("inventory.d3d7332b6b979270ff32cd184536527c"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2007, name: langStringDefault("inventory.3a03ac180e5e1e2be4d7bed9b4f1f04a"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2008, name: langStringDefault("inventory.86e7d3190d4f6031f48483ff9d690132"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2009, name: langStringDefault("inventory.658171a1c9c22da2f14b613b0681daf6"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 2000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2010, name: langStringDefault("inventory.c1fa14511c37e25103168adf5e4db8d1"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2011, name: langStringDefault("inventory.8e7d83223accb9113dd5f20c49b97132"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2012, name: langStringDefault("inventory.d2cffb72ea969fd60091f694ae460ccb"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2013, name: langStringDefault("inventory.bbd13e16839c10b37983cd862e41f891"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2014, name: langStringDefault("inventory.eb11cefa9eea772a917f63533377eb7b"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2015, name: langStringDefault("inventory.4ad567215f16adac1ddbe12463391e29"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2016, name: langStringDefault("inventory.e06242de9d399081b729dee81d243558"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2017, name: langStringDefault("inventory.74822efa4a7b0dad3b01c2df9d79301e"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2018, name: langStringDefault("inventory.2741287423abfdbbdec623252c922093"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2019, name: langStringDefault("inventory.6a340827ac95f6cc2102d210957e1350"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2020, name: langStringDefault("inventory.8dec64f25fbb165b1f93008f4bd346a6"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2021, name: langStringDefault("inventory.c27729a9c3c938831ee90789c9a93d75"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2022, name: langStringDefault("inventory.8f212b9bdd298798b7464abff6591a98"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2023, name: langStringDefault("inventory.5441234d2a40455271d7ef672f03e466"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2024, name: langStringDefault("inventory.00dcc6ce4355a74f53b0a06047261352"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2025, name: langStringDefault("inventory.917132b58ddd6d60f6fa5c611036ac7b"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2026, name: langStringDefault("inventory.fbf3e5c1c3b52f71c1cabc889737ff12"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2027, name: langStringDefault("inventory.7f7f2e69efa98c9dd37032022bdcdf5f"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2028, name: langStringDefault("inventory.9b867cb32e4784cfb7bf9eef2ceaa2cb"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2029, name: langStringDefault("inventory.7203cdf8603312a4321078d59eb61b41"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2030, name: langStringDefault("inventory.45d3533407ba9905cf1affc1670933a4"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2031, name: langStringDefault("inventory.ead981986b8ee2513c46c8334f7fa18f"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2032, name: langStringDefault("inventory.1063b20e8e0558c9ad0111becfd2846c"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2033, name: langStringDefault("inventory.0586b3a4c07abfb48c6f82ce5a469079"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2034, name: langStringDefault("inventory.b4b9c8526ad27e0e74571a5204ca64a0"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2035, name: langStringDefault("inventory.29b746ec9b39818e5880a21703235156"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2036, name: langStringDefault("inventory.8919aaaf72221189030bcbf0fdfc6b08"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2037, name: langStringDefault("inventory.b48aabc041b223dda6144aff6a4f1769"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2038, name: langStringDefault("inventory.bdac50ada0fd20305f7642ebb4c65e29"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2039, name: langStringDefault("inventory.eb82f1dda8fa43522e99f1957226366c"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2040, name: langStringDefault("inventory.d551982db6ae9a96c3060d482d90f877"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2041, name: langStringDefault("inventory.bec2107c8537e4094c874dc1f5f80be1"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2042, name: langStringDefault("inventory.991cee36312c1644ebd9809ca0d42d91"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2043, name: langStringDefault("inventory.f2bdf86a3bfc0620c8e3151ceb6af124"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2044, name: langStringDefault("inventory.e9edfc00996b40f0a698cdca56a49fa9"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2045, name: langStringDefault("inventory.2bfea1af4a75e8961e2f90ec52722062"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2046, name: langStringDefault("inventory.728c786379b9d64154b4f0656e311b35"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2047, name: langStringDefault("inventory.7ba424cdae4b6df108d9a7ab55ed3911"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2048, name: langStringDefault("inventory.78c784f4d68aa4f9502af7ec1dc5f83a"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2049, name: langStringDefault("inventory.d34570e5d9dd3a3b9f60ec99f5114cb1"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 7000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2050, name: langStringDefault("inventory.adff922a19bfcfe7469614146f1a43be"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2051, name: langStringDefault("inventory.6cd2039de56660fa6bdad21fd8e8c0f6"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2052, name: langStringDefault("inventory.70e445b739239ea550aa8da3a37896af"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2053, name: langStringDefault("inventory.aef9051a1edc24884c28549d04043a3f"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2054, name: langStringDefault("inventory.e6a89a8dbb666bfc65105e1702bad928"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2055, name: langStringDefault("inventory.3ed6a0ad0d7e5096ba0a034687d0ba2f"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2056, name: langStringDefault("inventory.36141203818c7b224ca51fd335b25796"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2057, name: langStringDefault("inventory.907d0d9c94450b088ac682ced5244e95"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2058, name: langStringDefault("inventory.2281067b45928c93905abc052b70f0e6"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2059, name: langStringDefault("inventory.ade1c51cf92c24fad65a86b6f3fb6c37"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2060, name: langStringDefault("inventory.6b63a1755416fe692d825571d9882010"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2061, name: langStringDefault("inventory.4defb94254e295328b3df8c3fb54dbea"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2062, name: langStringDefault("inventory.3deb2c66f87bbd23ad0b6e1a27491a94"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2063, name: langStringDefault("inventory.022f3d46122754d0acce62b74efcf843"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2064, name: langStringDefault("inventory.1046c2570ddf9ebf1a10274c38508c3f"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2065, name: langStringDefault("inventory.9d6cb4b04869b29bcf7350fbb34940a7"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2066, name: langStringDefault("inventory.1d058445b24ce99b575bb9266ca19f90"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2067, name: langStringDefault("inventory.472b04682b62b81717cae44d43a2fe23"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2068, name: langStringDefault("inventory.953145c84eb3ed611414ca792c5baf37"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2069, name: langStringDefault("inventory.6ee4144fb3826596b0d6bc8b81545bce"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2070, name: langStringDefault("inventory.00479c828df0c8f276bc511acb100308"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2071, name: langStringDefault("inventory.e7bf23b2eac2add7a5c70130f3eb3301"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2072, name: langStringDefault("inventory.cf23dd5db08ff3329ce142940bfd4905"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2073, name: langStringDefault("inventory.11aee692292f59e6cd9cdde5bfea3c01"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2074, name: langStringDefault("inventory.3626b1a02c9e4fae2f756e4d267da2c8"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2075, name: langStringDefault("inventory.40c1d64cae2c2bb5898eea812b6ea24e"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2076, name: langStringDefault("inventory.06f9605e2d41e7f5be7d44f1251c117b"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2077, name: langStringDefault("inventory.f286680e6208cda9b75e0c159699402f"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2078, name: langStringDefault("inventory.eae982585b6b1d00024b1fbc934d05a3"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2079, name: langStringDefault("inventory.1ef74a83006d9ab97e2d0adce7e1f465"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2080, name: langStringDefault("inventory.4fb24b827c44602d7000e44010c454c5"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2081, name: langStringDefault("inventory.44f0c5752a4092316251af3dc71cf26e"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2082, name: langStringDefault("inventory.12f30ace6b6479e698708d5b2abae4ea"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2083, name: langStringDefault("inventory.5a06e0ce5983eb651ac9d63211274b03"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2084, name: langStringDefault("inventory.b021ad16b54382c2d5262fe523e77ccb"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2085, name: langStringDefault("inventory.8ee8b03ecf78d71195403b5a8cd3192e"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2086, name: langStringDefault("inventory.ff814ed16e2e5a3d64faccaad9c13229"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 1000 },
    { item_id: 2087, name: langStringDefault("inventory.eab6efc50c2ea50d5695740f6aed0c20"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2088, name: langStringDefault("inventory.0573074ffb9965a133f460932930638a"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2089, name: langStringDefault("inventory.315b085dff6acabfac707053c6313779"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2090, name: langStringDefault("inventory.5956e227a4de2a3f781876f4a9de3bcc"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2091, name: langStringDefault("inventory.9666e5b235b4defb0a08e380b36c4b05"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2092, name: langStringDefault("inventory.7015ad817f6dfa6a9f9e117123a5cdc8"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2093, name: langStringDefault("inventory.f3819dd0022e1b490dd8d1aec2f419ca"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2094, name: langStringDefault("inventory.d2008d5baf936f9726d26bb1875c0c19"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2095, name: langStringDefault("inventory.85b69c967a9d4771c49884dff747a07a"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2096, name: langStringDefault("inventory.93c5e455d015666ca8c5f0235cb6a450"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2097, name: langStringDefault("inventory.3fbb5b8092aa28bff3395efc13b3da73"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2098, name: langStringDefault("inventory.964fc59687134986d93c5c7be8f2ec34"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2099, name: langStringDefault("inventory.aa3fe6289a5e96865e0ac377aea6b59c"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2100, name: langStringDefault("inventory.483c198ee06c013ba329112079aea3b7"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2101, name: langStringDefault("inventory.88f502f7cb5830de711e5ac05d86e442"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2102, name: langStringDefault("inventory.413124373efd353540e141ab04bb2be4"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2103, name: langStringDefault("inventory.0a977b33b81affbec075c308dda0c573"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2104, name: langStringDefault("inventory.2369c509c0b283a9de32dc47c1e1fdb4"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2105, name: langStringDefault("inventory.d1ce9657998220a088854bfec4b656e4"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2106, name: langStringDefault("inventory.7bf6b45b0a7da3c6962345e96fe8fd93"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2107, name: langStringDefault("inventory.ce73a359d07d4a5b43bd1ed49c2017fa"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2108, name: langStringDefault("inventory.30140e27aa7ac7a182846e6bc6b285a7"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2109, name: langStringDefault("inventory.addeec9a0296c42ab376acf5680ed3bb"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2110, name: langStringDefault("inventory.6ed7c67ebbce9aeb80608b719d338598"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2111, name: langStringDefault("inventory.835e9beb461f17017f1ba19fae3418c6"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2112, name: langStringDefault("inventory.d5fab0efd556b9d3cfd62b8593a0630e"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2113, name: langStringDefault("inventory.e97de61a904ff73a560564e2bc4b4227"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2114, name: langStringDefault("inventory.3ec2eb3a7c11981ada474a8dbd47f9bb"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2115, name: langStringDefault("inventory.d044da959ad347a41027eee81a5afd02"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2116, name: langStringDefault("inventory.e7cafb733141cead907ed5d92181c0ab"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2117, name: langStringDefault("inventory.fab6b553b630ba346c90670a9a0f502d"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2118, name: langStringDefault("inventory.01b90078b33a58e6e8cefb149d2d6539"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2119, name: langStringDefault("inventory.e98eda4a0c756b8baee917460ef5d11f"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2120, name: langStringDefault("inventory.514e7d199bfe0f20fd8a1845ae3d7d50"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2121, name: langStringDefault("inventory.c99e30a8044cb23b074703196b31d1b7"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2122, name: langStringDefault("inventory.c6fd1a462b8b3da0a879d66f89906e1b"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2123, name: langStringDefault("inventory.450eff589cc11c0650d67fa6dcda2aec"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2124, name: langStringDefault("inventory.eda760393e6229cec0e25cade347a3a5"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2125, name: langStringDefault("inventory.79f6f32f602a4b058568e32b90628187"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2126, name: langStringDefault("inventory.193cc0a0012189a404fb67308528e197"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2127, name: langStringDefault("inventory.630eee80459bb7ef7b58fe7a8aa74c5b"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2128, name: langStringDefault("inventory.6c2a960e891f60d8c6e511424789cafe"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2129, name: langStringDefault("inventory.b180e0428329a8d6467e23da2984e0d4"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2130, name: langStringDefault("inventory.0470f79c8d7abbd8173c3f3f6566593d"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2131, name: langStringDefault("inventory.808af35890657d65c85454c8337b320f"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2132, name: langStringDefault("inventory.db47787dc14ed3eb8e3c5461c30008ce"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2133, name: langStringDefault("inventory.a3abf10b492249ac3102ce5b30633927"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2134, name: langStringDefault("inventory.e4ad0c973f03556db04e73cc25306182"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2135, name: langStringDefault("inventory.acc8a9d67708fc7a5d36f40d3b180229"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2136, name: langStringDefault("inventory.e794956c90cf8f3fc0a7d114d6dff068"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2137, name: langStringDefault("inventory.bda53789ab64b5bb12db4a295c26c007"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2138, name: langStringDefault("inventory.b50ff43bcd5ca5cb58060c9dfe62a256"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2139, name: langStringDefault("inventory.896c3874a903b2d5c52befe61246ac12"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2140, name: langStringDefault("inventory.a9fb1d32e16b3e2e763ab38827ba7587"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2141, name: langStringDefault("inventory.ccace69a3a5091f41df3375ef8d840f4"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2142, name: langStringDefault("inventory.89a7bd467007d7c127183baaa6e04236"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2143, name: langStringDefault("inventory.b158ce02526a42c08181bb445dd19e21"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2144, name: langStringDefault("inventory.f7582d363a5aea0e3c6fd22731f6b780"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2145, name: langStringDefault("inventory.17c08907b449011ef57fdccf6af114e1"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2146, name: langStringDefault("inventory.c247d0d796b214f8525fa0c98a049c85"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 2147, name: langStringDefault("inventory.fcdd00d114451c3b0b693ca8a2b99843"), type: ITEM_TYPE.BAGS, weight: 0, base_weight: 3000, prop: "prop_cs_heist_bag_01", default_count: 1, use: true, protect: true, defaultCost: 50000 },












    { item_id: 3000, name: langStringDefault("inventory.c5f39c34ae67b06596178cad416be7cc"), desc: langStringDefault("inventory.dc661f9e7d86d8f69c918295f2e6b186"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 100, prop: "ch_prop_ch_usb_drive01x", default_count: 1, use: true, protect: true, defaultCost: 150000 },
    { item_id: 3001, name: langStringDefault("inventory.5911477333694653c6bd1d8b4ca8b6f2"), desc: langStringDefault("inventory.73c6a44fff97f20a60f649d446b1d4b1"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 5000, prop: "ba_prop_battle_chest_closed", default_count: 1, use: true, protect: true, defaultCost: 100000 },

    // Видеокарты (3100 - 3199)
    { item_id: 3100, name: langStringDefault("inventory.908d30d7430aacf3f6c2ebce2e88c9c8"), desc: langStringDefault("inventory.576fe5a4daa983f4bedf643448762fa7"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "pp_videocard760", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 3101, name: langStringDefault("inventory.7019f7c572fde7923f3778c43f901f9f"), desc: langStringDefault("inventory.06da7907569a4e3a3c4a5b2509254607"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "pp_videocard760", default_count: 1, use: true, protect: true, defaultCost: 100000 },
    { item_id: 3102, name: langStringDefault("inventory.0b8db2bc74c6946da67c8ac6cb1e3477"), desc: langStringDefault("inventory.8abacf1d9180df7e56a771aa9f6d3b5a"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "pp_videocard760", default_count: 1, use: true, protect: true, defaultCost: 120000 },
    { item_id: 3103, name: langStringDefault("inventory.ff8d8363bc33570db5843d562705ba57"), desc: langStringDefault("inventory.88cb896bca2940fe7b3c9782f1f33386"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "pp_videocard760", default_count: 1, use: true, protect: true, defaultCost: 150000 },
    { item_id: 3104, name: langStringDefault("inventory.533ef321cfd967f36fdf98eedb82201d"), desc: langStringDefault("inventory.7455e95117cfe45f2d4ba4b6170e071a"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "pp_videocard760", default_count: 1, use: true, protect: true, defaultCost: 200000 },
    { item_id: 3105, name: langStringDefault("inventory.adf769015ac1227ffd5b7576165537e1"), desc: langStringDefault("inventory.7a7a677cbef62f76be126475878571cc"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "pp_videocard760", default_count: 1, use: true, protect: true, defaultCost: 250000 },

    // Алгоритмы (3200 - 3299)
    { item_id: 3200, name: langStringDefault("inventory.a9e12d5f849cdc4b67d58df045fc0acb"), desc: langStringDefault("inventory.591853ba060823879d2b6fefebdab901"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 35000 },
    { item_id: 3201, name: langStringDefault("inventory.0b11b5b89d9ec39c976720f4b361a664"), desc: langStringDefault("inventory.7a1b4578bf88e7d16f4d98731089d0b6"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 55000 },
    { item_id: 3202, name: langStringDefault("inventory.e389527e420f1590af5ec3d9c85f5bb7"), desc: langStringDefault("inventory.4e09397f5f8e45c800e2c61f04d9cbee"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 85000 },
    { item_id: 3203, name: langStringDefault("inventory.f28a2fe7309f9fdbc9d35cadb1ea6b2a"), desc: langStringDefault("inventory.a101d3d5db7ed0caef0ba7176eb575de"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 125000 },
    { item_id: 3204, name: langStringDefault("inventory.e6b138b58bf66d90a0933b39b3a0e0bd"), desc: langStringDefault("inventory.331179c079508571e379e6cec9f2a837"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 200000 },

    // CPU (3300 - 3399)
    { item_id: 3300, name: langStringDefault("inventory.ee239fec74279c111274d87c0091c095"), desc: langStringDefault("inventory.79c99bc51221445fd7ac54056c2a92ec"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 3301, name: langStringDefault("inventory.6ce53c23dd27dc594e9da40d73ba4927"), desc: langStringDefault("inventory.b550a9f89f59dc91ebe893f91167528f"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 75000 },
    { item_id: 3302, name: langStringDefault("inventory.c907124aca3b80b31ff53ee556801cfd"), desc: langStringDefault("inventory.caad5b5082297649327cfca9624160d6"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 100000 },
    { item_id: 3303, name: langStringDefault("inventory.e22012c087a3b740775c46df9a176d34"), desc: langStringDefault("inventory.4ff5a6a238bfbbe4255c9223d3603279"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 150000 },

    // RAM (3400 - 3499)
    { item_id: 3400, name: langStringDefault("inventory.a65d4f6560b87e9f583b03b894d0943e"), desc: langStringDefault("inventory.f7691cfaff7bb72eebfd25c0397833b4"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 35000 },
    { item_id: 3401, name: langStringDefault("inventory.f0abb9b68172425a1f685517c1eec6ae"), desc: langStringDefault("inventory.8ad7959939e64969ec955f85d7de13c2"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 55000 },
    { item_id: 3402, name: langStringDefault("inventory.222f8919ee9907fca77f2813ecf7e559"), desc: langStringDefault("inventory.5dab0bf4c5e08a2df64554f36e8c9a54"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 95000 },
    { item_id: 3403, name: langStringDefault("inventory.12d5ac21354743a0ae4a095ab0966cb8"), desc: langStringDefault("inventory.fb36c64fe2738f4a9ee3f0a6b1e0e998"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "hei_prop_hst_usb_drive", default_count: 1, use: true, protect: true, defaultCost: 125000 },

    // Блоки питания (3500 - 3599)
    { item_id: 3500, name: langStringDefault("inventory.2e4284dce19a3570ded9a3f1ebf91f19"), desc: langStringDefault("inventory.2a3d2a2c21d90ec39c510e02e511a778"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "pp_powersupply", default_count: 1, use: true, protect: true, defaultCost: 50000 },
    { item_id: 3501, name: langStringDefault("inventory.664d07f12cb018ec376b1fa0eab0d525"), desc: langStringDefault("inventory.cb4856e8006bc8c07e46cedbafdd3a8e"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "pp_powersupply", default_count: 1, use: true, protect: true, defaultCost: 100000 },
    { item_id: 3502, name: langStringDefault("inventory.f922483ffed27ab49c3ac766fa9c42ca"), desc: langStringDefault("inventory.6be01a631a5242f919a97d50601de23a"), type: ITEM_TYPE.MINING, weight: 0, base_weight: 400, prop: "pp_powersupply", default_count: 1, use: true, protect: true, defaultCost: 150000 },


    // Предметы для крафта
    { item_id: 4000, name: langStringDefault("inventory.f8e5f3cedc4c4668ba8b736ab2fcd90a"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 500, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 4001, name: langStringDefault("inventory.acf19c34fd91c3d53a3bcee6d8ac1a5a"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 1000, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 4002, name: langStringDefault("inventory.54f5267d0ebecb3a054256c393541f0d"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 1000, prop: "xm_prop_x17_bag_01d", default_count: 1 },

    // Предметы в ограбления домов
    { item_id: 5000, name: langStringDefault("inventory.cecb0fcaeb32a5e3a324a6e5fe5f8df2"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5001, name: langStringDefault("inventory.193536dbdc4c3c33879e92bad4fae6b7"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5002, name: langStringDefault("inventory.6c1a036d6b2ae624935581777464f943"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5003, name: langStringDefault("inventory.6f6d64f5e3c8961f9cb5191e85d8064b"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5004, name: langStringDefault("inventory.379bd595ec480154d9e0757790044e20"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5005, name: langStringDefault("inventory.76bb859105a5b36447290beff0ae6205"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5006, name: langStringDefault("inventory.e8892742c1c1043bd272acbbffc18996"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5007, name: langStringDefault("inventory.438909a1451c38dc49bda2bc4bd34a27"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5008, name: langStringDefault("inventory.ce3fca12d6bac2b5232bd66c037683a4"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5009, name: langStringDefault("inventory.f5d0d613c4616874a5071eee5e700ba5"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5010, name: langStringDefault("inventory.33bfde202db2ae2410e384e46105b9bd"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5011, name: langStringDefault("inventory.3ac4f19572f837de9534a8d8b0ce20c6"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5012, name: langStringDefault("inventory.228aad13014efe847506478dc7680b79"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5013, name: langStringDefault("inventory.46eebda7e7dc1863484275a61a1a116a"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5014, name: langStringDefault("inventory.62657d20231844a7ea300e7ecf628345"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },
    { item_id: 5015, name: langStringDefault("inventory.383146bfe241750e65db472bd8843ceb"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1 },


    { item_id: 6000, name: langStringDefault("inventory.ae9042adf36941af0f512a266a5ebe1a"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true, blockMove: true },
    { item_id: 6001, name: langStringDefault("inventory.5f7027174a8996363dd08297be4d3eaf"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true, blockMove: true },
    { item_id: 6002, name: langStringDefault("inventory.66fd29d853ed50e19d97f7ca910008a9"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true, blockMove: true },
    { item_id: 6003, name: langStringDefault("inventory.6706db96eb397f5fbd8550d7eef557b5"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true, blockMove: true },



    // Для дайвинга
    { item_id: 6500, name: langStringDefault("inventory.0fc16c01075def4779e295665b0e5c82"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 1000, prop: "prop_cs_heist_bag_01", default_count: 1, defaultCost: 40000, use: true },

    // Элементы карты
    { item_id: 6501, name: langStringDefault("inventory.be048eb595691839468b153eeaa1fc76"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6502, name: langStringDefault("inventory.4f8ab5367621dca589bcc9f3e889464f"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6503, name: langStringDefault("inventory.45dfdcdd5612d18cbcfe23ce726517e8"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6504, name: langStringDefault("inventory.83de2b76c1be134c800b2aa1ec9cf32b"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6505, name: langStringDefault("inventory.9d29b7c236d577b9cbedb414ec3baacd"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6506, name: langStringDefault("inventory.80ff431257103fa485efcf0a38a5dcec"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6507, name: langStringDefault("inventory.63b8371fcd20c115a4489fa7038faa07"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6508, name: langStringDefault("inventory.08dfdd87cc48cdabff0d99f2f87738ba"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6509, name: langStringDefault("inventory.d2dc4f73dcd18b78f7ff699742dac6f6"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6510, name: langStringDefault("inventory.5935b2e8c28210d0a40a699c23902f6f"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6511, name: langStringDefault("inventory.8272dcfe09d1491b99e1d7983dff8fe0"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6512, name: langStringDefault("inventory.7b231fb6c6ab8a0623aa301e044730a7"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6513, name: langStringDefault("inventory.fd87a1a4b719023711e5fd4786220925"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6514, name: langStringDefault("inventory.c6a245e10c7712a0210771140d608937"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6515, name: langStringDefault("inventory.200886cb68e7a2047cf43cc8469544a6"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6516, name: langStringDefault("inventory.4a8263e35127f0d26d80c1a04ec09c0b"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6517, name: langStringDefault("inventory.94ce0ad42e6a06a8c49a202767435730"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6518, name: langStringDefault("inventory.21d7822a5bda83942d57f79ae5c6f445"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },

    // // Предметы падающие с сундуков
    // { item_id: 6519, name: langStringDefault("inventory.504935469dcfbfd9ba71e650c44c9ea6"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    // { item_id: 6520, name: langStringDefault("inventory.bbab651663f42b7d43441ca193b48fb2"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    // { item_id: 6521, name: langStringDefault("inventory.00e045832ebd26ce32039c391a23fee1"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    // { item_id: 6522, name: langStringDefault("inventory.e390b38ab564e27b6c49259e1698fde7"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    // { item_id: 6523, name: langStringDefault("inventory.40e101b614bb69b191461e662bb05391"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    // { item_id: 6524, name: langStringDefault("inventory.ea3de9ea39d95038658528a4b691a474"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },
    // { item_id: 6525, name: langStringDefault("inventory.34816002caf5ab7cef2ff3db53a97ace"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 10, prop: "prop_cs_documents_01", default_count: 1, use: true },

    { item_id: 6526, name: langStringDefault("inventory.403f86332ca068556f1978cd1b52b64b"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 100, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6527, name: langStringDefault("inventory.d287c53ca0e8c3a65b54f122e5489f88"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 100, prop: "prop_cs_documents_01", default_count: 1, use: true },
    { item_id: 6528, name: langStringDefault("inventory.a4deeeccb019b441c417ff4fefff597f"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 100, prop: "prop_cs_documents_01", default_count: 1, use: true },

    // Для фермы

    { item_id: 7000, name: langStringDefault("inventory.56da63a24b921197beaefe046a6caf6c"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 150},
    { item_id: 7001, name: langStringDefault("inventory.a01d87197ec9ae7bb21cc97d59423bd9"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 155},
    { item_id: 7002, name: langStringDefault("inventory.1483af5e2817d8277e729a1175f02eba"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 160},
    { item_id: 7003, name: langStringDefault("inventory.a7c3155940049126638406c04f1439cb"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 165},
    { item_id: 7004, name: langStringDefault("inventory.452e83ac1f3c6b91b0c4529a79a04051"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 170},
    { item_id: 7005, name: langStringDefault("inventory.e7352a2569f911f75e04bc0d2d1b3e48"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 175},
    { item_id: 7006, name: langStringDefault("inventory.e928630a5da1dd12469ee39931d56599"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 230},
    { item_id: 7007, name: langStringDefault("inventory.38ab499272bc20b28f6211982aec9171"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 200},
    { item_id: 7008, name: langStringDefault("inventory.7f16d833eb9fa53ebbc4777c4e5ff7bd"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 210},
    // { item_id: 7009, name: "Семена винограда", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 210},
    { item_id: 7010, name: langStringDefault("inventory.df27751c0f5bdf8d0c97169203ffeb98"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 250},
    { item_id: 7011, name: langStringDefault("inventory.32bc159654a0080abc6e74e357d0a5e4"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true, defaultCost: 150},


    { item_id: 7020, name: langStringDefault("inventory.bc865083be96ada48aaee601f3e510d7"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    { item_id: 7021, name: langStringDefault("inventory.1d27e1c9044984d408c8146ba3a21d31"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    { item_id: 7022, name: langStringDefault("inventory.4c6f9bf5f7ef4471c1e0fe0662e69c57"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    { item_id: 7023, name: langStringDefault("inventory.7acd1c0bf5f5a78af27b547b287399b3"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    { item_id: 7024, name: langStringDefault("inventory.b730f65bcf923d3e3dfb3819814954fb"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    { item_id: 7025, name: langStringDefault("inventory.29e4b76826b1d494190b0b9da21f4d46"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    { item_id: 7026, name: langStringDefault("inventory.58a6fa1f878f7eb526b3ff91941b8ea1"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    { item_id: 7027, name: langStringDefault("inventory.1969e132d5ac1eced4c3a6281822ef8e"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    { item_id: 7028, name: langStringDefault("inventory.e2a588c8740790bc62bc7bb19bda6d8f"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    // { item_id: 7029, name: "Виноград", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true,canSplit: true},
    { item_id: 7030, name: langStringDefault("inventory.df726f79bffdfda446d830481fbdd25f"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true, canSplit: true},
    { item_id: 7031, name: langStringDefault("inventory.8954366c68d540f19a0708c5cac1f28d"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true, canSplit: true},

    { item_id: 8000, name: langStringDefault("inventory.167aac1e3beb7577a2bc8364c6f4ac8a"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 1000, prop: "w_ar_railgun_mag1", default_count: 1, use: true, defaultCost: 200000 , protect: true},
    { item_id: 8001, name: langStringDefault("inventory.ff13a1210ed0e4b01442ec7e5028dbc4"), type: ITEM_TYPE.SYSTEM, weight: 0, base_weight: 1000, prop: "w_ar_railgun_mag1", default_count: 1, use: true, defaultCost: 2500000 , protect: true},

    { item_id: 9000, name: langStringDefault("inventory.e190228ec369295e4f3ca401ea92a76d"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true, canSplit: true},
    { item_id: 9100, name: langStringDefault("inventory.fbe2605c4ad81225188e992842e9cb58"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true, canSplit: true, defaultCost: 150},
    { item_id: 9101, name: langStringDefault("inventory.6041fe6216e0d10c858ff6d0333a07ba"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true, canSplit: true, defaultCost: 50},
    { item_id: 9102, name: langStringDefault("inventory.0906d4e50a8f105725b3d735bf9cd89d"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 400, prop: "ng_proc_food_ornge1a", default_count: 1, protect: true, need_group: true, canSplit: true, defaultCost: 80},

    { item_id: 9200, name: langStringDefault("inventory.6f42f9178ed808a302ba97424c57d1ae"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 2500, prop: "prop_fishing_rod_02", default_count: 1, defaultCost: 10000, use: true },
    { item_id: 9201, name: langStringDefault("inventory.671d86f1e2ec1c2bb25c3eab41ab7ed0"), type: ITEM_TYPE.OTHER, weight: 0, base_weight: 2500, prop: "prop_fishing_rod_02", default_count: 1, defaultCost: 20000, use: true },

    { item_id: 9210, name: langStringDefault("inventory.fa0ced7bf16e02cbbb20b46c0f5b3d68"), type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true, canSplit: true },
    { item_id: 9211, name: langStringDefault("inventory.2dbb7c9fd26cc617d6b49ebd18e95969"), type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true , canSplit: true},
    { item_id: 9212, name: langStringDefault("inventory.8376a3d9aa908547ad4cd12955648889"), type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true , canSplit: true},
    { item_id: 9213, name: langStringDefault("inventory.b3ffa2f4406a3b7f063b1a5cca72d3ff"), type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true , canSplit: true},
    { item_id: 9214, name: langStringDefault("inventory.802118715f3087f814a6550882ab643c"), type: ITEM_TYPE.SYSTEM, weight: 2000, base_weight: 0, prop: "prop_cs_brain_chunk", default_count: 1, need_group: true , canSplit: true},

    { item_id: 9500, name: langStringDefault("inventory.36833fa4d3dad15b626f60d453a0dec6"), type: ITEM_TYPE.SYSTEM, weight: 1, prop: "pumpkin_basket", default_count: 1, propAttachParam: [0.505, -0.090, -0.110, 161, 256, 0], inHand: true, use: true },

    //Зелья
    { item_id: 10000, name: langStringDefault("inventory.4e02c95da9af817c8015b757cdfd951e"), type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10001, name: langStringDefault("inventory.fb2c040f8dc399d1d2b3dbdb65d8279d"), type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10002, name: langStringDefault("inventory.62a11cfa809874c94e596e6122c8bebc"), type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10003, name: langStringDefault("inventory.46b1e83e31b926236524c06e9421db38"), type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10004, name: langStringDefault("inventory.994c823f643d0a572e7819b98f9f88e3"), type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10005, name: langStringDefault("inventory.2d8fd4ea3f6a35b787971192b8834d0e"), type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10006, name: langStringDefault("inventory.4fea6c7a341811297ae8576a540a3c9f"), type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10007, name: langStringDefault("inventory.c842f193769abde04be1c9d77414ca6f"), type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10008, name: langStringDefault("inventory.d06a290b22e5176d6e5b14c7a94e76fe"), type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10009, name: langStringDefault("inventory.8b8e09ed99106aa8686bfe607c1a7fe4"), type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},
    { item_id: 10010, name: langStringDefault("inventory.66fcefdfd2c2ea2552f2cc28fd682a54"), type: ITEM_TYPE.POTION, weight: 1, base_weight: 100, prop: "prop_wine_rose", default_count: 1, use: true,  protect: true},


    // Собаки
    { item_id: 15000, name: langStringDefault("inventory.7aee904a9a846bf3816847b6feea8004"), type: ITEM_TYPE.ANIMAL, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1, blockMove:true,  protect: true, use: true },
    { item_id: 15001, name: langStringDefault("inventory.7a508de70d340f82f2b8863425db4079"), type: ITEM_TYPE.ANIMAL, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1, blockMove:true,  protect: true, use: true },
    { item_id: 15002, name: langStringDefault("inventory.275fbeb10d6b5ab1b579ad46a99b0313"), type: ITEM_TYPE.ANIMAL, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1, blockMove:true,  protect: true, use: true },
    { item_id: 15003, name: langStringDefault("inventory.6d7ba02306cdca4359f2b665bc984765"), type: ITEM_TYPE.ANIMAL, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1, blockMove:true,  protect: true, use: true},
    { item_id: 15004, name: langStringDefault("inventory.b764cc1cd234c8767257a49a37b8943d"), type: ITEM_TYPE.ANIMAL, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1, blockMove:true,  protect: true, use: true },
    { item_id: 15005, name: langStringDefault("inventory.a602b9945280a0e299d31410eeed9d96"), type: ITEM_TYPE.ANIMAL, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1, blockMove:true,  protect: true, use: true },
    { item_id: 15006, name: langStringDefault("inventory.c63ad5dabc2deff55908f945fe309d6e"), type: ITEM_TYPE.ANIMAL, weight: 0, base_weight: 5, prop: "xm_prop_x17_bag_01d", default_count: 1, blockMove:true,  protect: true, use: true },



    // Кальяны и табачка 
    { item_id: 20000, name: langStringDefault("inventory.db77b2879506699ef3baca79d6c2f1d0"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 5, prop: "kalian", default_count: 1, use: true },
    { item_id: 20001, name: langStringDefault("inventory.d8f0832a33c7c325c49caed9ed844e72"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 5, prop: "vape", default_count: 1,   protect: true, use: true },
    { item_id: 20002, name: langStringDefault("inventory.34896dea3803e2aa9de573339dd41b78"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "prop_bong_01", default_count: 1,   protect: true, use: true },
    { item_id: 20010, name: langStringDefault("inventory.0454dc0238382fba3732fc8ee70c6eb1"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20011, name: langStringDefault("inventory.1e2d969cb16debdb65866a1a0df9f0ac"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20012, name: langStringDefault("inventory.449f104c4f3005d15174732e525d89b1"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20013, name: langStringDefault("inventory.2afd42402a63f385c8c1d58fb5b409cc"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20014, name: langStringDefault("inventory.7456c5fb250df22d62a46141abd5b157"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20015, name: langStringDefault("inventory.71b390e98e3396c36c1525ece82b1791"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20016, name: langStringDefault("inventory.1c75f2d8a844b18917aa1fc63f3e8599"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20017, name: langStringDefault("inventory.8743f215110ce2c521fddb20cde88323"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20018, name: langStringDefault("inventory.24bb505064b635d723f97f57f09cdc30"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20019, name: langStringDefault("inventory.b017ce8e46908a0c33824a70553f1733"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20020, name: langStringDefault("inventory.883f6e3eb5fa627357df13cc45ae7475"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20021, name: langStringDefault("inventory.b6455e74287e246dc97a5f454cc18203"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20030, name: langStringDefault("inventory.8b82678fa4722aa7d77c1c1c78a94a65"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 150, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true , need_group: true},
    { item_id: 20050, name: langStringDefault("inventory.9fab16a4cbba60a174898ddf89a663f3"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20051, name: langStringDefault("inventory.db5531c6008c2e56cacac172c5116f0d"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20052, name: langStringDefault("inventory.bc6e0c6397c23950ad7ba4543c21bd28"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20053, name: langStringDefault("inventory.cc8cf18c2fbdf3bbf7a5a1989dd58e72"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20054, name: langStringDefault("inventory.40490979ec47b30cb3dece716904791b"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20055, name: langStringDefault("inventory.aff1fffea1a877d3df3b555d3d1fdd0a"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20056, name: langStringDefault("inventory.a559e1b3c0a2ccee7a6c771380a74d4b"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },
    { item_id: 20057, name: langStringDefault("inventory.2038232defa361ab48e1e47edb18202e"), type: ITEM_TYPE.SMOKING, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1,   protect: true, use: true },

    //Discount
    { item_id: 40000, name: "Vehicle shop discount 10%", type: ITEM_TYPE.DISCOUNT, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, protect: true, use: false },
    { item_id: 40001, name: "Clothes shop discount 25%", type: ITEM_TYPE.DISCOUNT, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, protect: true, use: false },
    { item_id: 40002, name: "Shop discount 25%", type: ITEM_TYPE.DISCOUNT, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, protect: true, use: false },

    //DRUSG 
    { item_id: 40100, name: "Ephedrine", type: ITEM_TYPE.OTHER, weight: 0.1, base_weight: 0.1, prop: "ng_proc_paintcan01a_sh", default_count: 1, need_group: true, protect: true, use: false, canSplit: true },
    { item_id: 40101, name: "Frunze de iarba", type: ITEM_TYPE.DRUG, weight: 0.1, base_weight: 0.1, prop: "ng_proc_paintcan01a_sh", default_count: 1, need_group: true, protect: true, use: false, canSplit: true },
    { item_id: 40102, name: "Frunze de cocaina", type: ITEM_TYPE.DRUG, weight: 0.1, base_weight: 0.1, prop: "ng_proc_paintcan01a_sh", default_count: 1, need_group: true, protect: true, use: false, canSplit: true },
    { item_id: 40103, name: "Seminte de iarba", type: ITEM_TYPE.OTHER, weight: 0.1, base_weight: 0.1, prop: "ng_proc_paintcan01a_sh", default_count: 1, need_group: true, protect: true, use: true, canSplit: true },
    { item_id: 40104, name: "Seminte de Cocaina", type: ITEM_TYPE.OTHER, weight: 0.1, base_weight: 0.1, prop: "ng_proc_paintcan01a_sh", default_count: 1, need_group: true, protect: true, use: true, canSplit: true },
    { item_id: 40105, name: "Foarfeca", type: ITEM_TYPE.OTHER, weight: 0.5, base_weight: 0.5, prop: "ng_proc_paintcan01a_sh", default_count: 1, protect: true, use: false, canSplit: true },

    //Spalare
    { item_id: 40106, name: "Minereu de Cupru", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, need_group: true, use: false, protect: true, canSplit: true },
    { item_id: 40107, name: "Minereu de Fier", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40108, name: "Argint Neformat", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40109, name: "Aur Neformat", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40110, name: "Minereu de Aluminium", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40111, name: "Minereu de Sulf", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40112, name: "Diamant Neformat", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40113, name: "Smarald Neformat", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40114, name: "Saphir Neformat", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40115, name: "Rubin Neformat", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },

    //Topitorie
    { item_id: 40116, name: "Lingou de Cupru", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40117, name: "Lingou de Fier", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40118, name: "Lingou de Argint", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40119, name: "Lingou de Aur", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40120, name: "Lingou de Aluminium", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40121, name: "Sulf", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, protect: true, need_group: true, canSplit: true },
    { item_id: 40122, name: "Diamant", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, need_group: true, protect: true, canSplit: true }, 
    { item_id: 40123, name: "Smarald", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40124, name: "Saphir", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40125, name: "Rubin", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "rock_4_cl_2_1", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },

    /// praf de pusca
    { item_id: 40126, name: "Salpetru", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    /// parti arme
    { item_id: 40127, name: "AK47 part 1", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40128, name: "AK47 part 2", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40129, name: "AK47 part 3", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40130, name: "AK47 part 4", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40131, name: "AK47 part 5", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40132, name: "AK47 part 6", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40133, name: "AK47 part 7", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40134, name: "AK47 part 8", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40135, name: "AK47 part 9", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },

    { item_id: 40136, name: "Combatpdw part 1", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40137, name: "Combatpdw part 1", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40138, name: "Combatpdw part 1", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40139, name: "Combatpdw part 1", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40140, name: "Combatpdw part 1", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40141, name: "Combatpdw part 1", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
   
    { item_id: 40142, name: "Microsmg part 1", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, protect: true, canSplit: true },
    { item_id: 40143, name: "Microsmg part 2", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, protect: true, canSplit: true },
    { item_id: 40144, name: "Microsmg part 3", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40145, name: "Microsmg part 4", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },

    { item_id: 40146, name: "Pistol50 part 1", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40147, name: "Pistol50 part 2", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40148, name: "Pistol50 part 3", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },
    { item_id: 40149, name: "Pistol50 part 4", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, use: false, need_group: true, protect: true, canSplit: true },

    { item_id: 40150, name: "Pistolmk2 part 1", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, need_group: true, use: false, protect: true, canSplit: true },
    { item_id: 40151, name: "Pistolmk2 part 2", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, need_group: true, use: false, protect: true, canSplit: true },
    { item_id: 40152, name: "Pistolmk2 part 3", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, need_group: true, use: false, protect: true, canSplit: true },
   
    { item_id: 40153, name: "Praf de pusca", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 100, prop: "ng_proc_paintcan01a_sh", default_count: 1, need_group: true, use: false, protect: true, canSplit: true },


    { item_id: 40154, name: "Lithium", type: ITEM_TYPE.OTHER, weight: 0.5, base_weight: 0.5, prop: "ng_proc_paintcan01a_sh", default_count: 1, need_group: true, protect: true, use: false, canSplit: true },
    { item_id: 40155, name: "Acid sulfuric", type: ITEM_TYPE.OTHER, weight: 0.5, base_weight: 0.5, prop: "ng_proc_paintcan01a_sh", default_count: 1, need_group: true, protect: true, use: false, canSplit: true },

    { item_id: 40156, name: "Tava cu amfetamina", type: ITEM_TYPE.OTHER, weight: 0.5, base_weight: 0.5, prop: "ng_proc_paintcan01a_sh", default_count: 1, need_group: true, protect: true, use: false, canSplit: true },
    { item_id: 40157, name: "Bani murdari", type: ITEM_TYPE.OTHER, weight: 0.5, base_weight: 0.5, prop: "ng_proc_paintcan01a_sh", default_count: 1, need_group: true, protect: true, use: false, canSplit: true },
    { item_id: 40158, name: "Lopata", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 4, prop: "ng_proc_paintcan01a_sh", default_count: 1, need_group: true, defaultCost: 3, canSplit: true, helpIcon: "lopata",    helpDesc: "Cu aceasta lopata puteti sapa rame pentru jobul de pescuit. Le gasiti pe harta in zona Mlastina", protect: true, },
    { item_id: 40159, name: "Rame", type: ITEM_TYPE.OTHER, weight: 0, base_weight: 0.5, prop: "ng_proc_paintcan01a_sh", default_count: 1, need_group: true, defaultCost: 3, canSplit: true, helpIcon: "rame",    helpDesc: "Acestea sunt rame pentru jobul de pescar. Aveti nevoie de 1 bucata la fiecare aruncare", protect: true, }
];
export const AUTO_SOUND_ITEM_ID = 8000;
export const HALLOWEEN_BASKET_ITEM_ID = 9500;
export const KEYS_ITEM_ID = 805;

export interface WeaponAddonsItemBase {
    /** ID предмета из инвентаря*/
    item_id: number,
    /** Hash вариации (уникален для каждого оружия) */
    hash: string,
    /** Группа модификации. Если внутри оружия уже есть предмет из данной группы - второй поставить не выйдет */
    group: number,
}

export interface WeaponAddonsItem {
    /** Глушитель (ID предмета и ХЕШ компонента) */
    suppressor?: WeaponAddonsItemBase
    /** Компенсатор (ID предмета и ХЕШ компонента) */
    compensator?: WeaponAddonsItemBase
    /** Фонарь (ID предмета и ХЕШ компонента) */
    flashlight?: WeaponAddonsItemBase
    /** Рукоять (ID предмета и ХЕШ компонента) */
    grip?: WeaponAddonsItemBase
    /** Прицел (Макро) */
    makro?: WeaponAddonsItemBase
    /** Прицел (Малый) */
    small?: WeaponAddonsItemBase
    /** Прицел (Монтированый) */
    mounted?: WeaponAddonsItemBase
    /** Прицел (Голограф) */
    holographic?: WeaponAddonsItemBase
    /** Прицел (NV) */
    nv?: WeaponAddonsItemBase
    /** Прицел (термальный) */
    thermal?: WeaponAddonsItemBase

    /** ДТ */
    muzzle_1?: WeaponAddonsItemBase
    /** ДТ */
    muzzle_2?: WeaponAddonsItemBase
    /** ДТ */
    muzzle_3?: WeaponAddonsItemBase
    /** ДТ */
    muzzle_4?: WeaponAddonsItemBase
    /** ДТ */
    muzzle_5?: WeaponAddonsItemBase
    /** ДТ */
    muzzle_6?: WeaponAddonsItemBase
    /** ДТ */
    muzzle_7?: WeaponAddonsItemBase
    /** ДТ */
    muzzle_8?: WeaponAddonsItemBase
    /** ДТ */
    muzzle_9?: WeaponAddonsItemBase
    /** Ствол */
    barrel_heavy?: WeaponAddonsItemBase
    /** Скин оружия */
    tint_1?: WeaponAddonsItemBase
    tint_2?: WeaponAddonsItemBase
    tint_3?: WeaponAddonsItemBase
    tint_4?: WeaponAddonsItemBase
    tint_5?: WeaponAddonsItemBase
    tint_6?: WeaponAddonsItemBase
    tint_7?: WeaponAddonsItemBase
    
    tint_8?: WeaponAddonsItemBase
    tint_9?: WeaponAddonsItemBase
    tint_10?: WeaponAddonsItemBase
    tint_11?: WeaponAddonsItemBase
    tint_12?: WeaponAddonsItemBase
    tint_13?: WeaponAddonsItemBase
    tint_14?: WeaponAddonsItemBase
    tint_15?: WeaponAddonsItemBase
    tint_16?: WeaponAddonsItemBase
    tint_17?: WeaponAddonsItemBase
    tint_18?: WeaponAddonsItemBase
    tint_19?: WeaponAddonsItemBase
    tint_20?: WeaponAddonsItemBase
    tint_21?: WeaponAddonsItemBase
    tint_22?: WeaponAddonsItemBase
    tint_23?: WeaponAddonsItemBase
    tint_24?: WeaponAddonsItemBase
    tint_25?: WeaponAddonsItemBase
    tint_26?: WeaponAddonsItemBase
    tint_27?: WeaponAddonsItemBase
    tint_28?: WeaponAddonsItemBase
    tint_29?: WeaponAddonsItemBase
    tint_30?: WeaponAddonsItemBase
    tint_31?: WeaponAddonsItemBase
    
    camo?: WeaponAddonsItemBase
}

export const weapon_list: {
    /** item_id Оружия */
    weapon: number,
    /** Калибр оружия */
    caliber: WEAPON_CALIBER,
    /** item_id Магазина оружия */
    // magazine: number,
    /** Хэш оружия в строковом виде */
    hash: string
    /** ID предмета коробки с патронами */
    ammo_box: number,
    /** Сколько патронов в магазине */
    ammo_max: number,
    /** Для этого оружия требуется лицензия */
    need_license?:true,
    /** Крепление оружия на теле*/
    attach?: {},
    /** Список модификаций, доступных на данном оружии */
    addons?: WeaponAddonsItem
}[] = [
        { weapon: 500, caliber: 5.45, ammo_max: 30, hash: "weapon_assaultrifle", ammo_box: 150, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1604, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1605, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1606, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1607, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1608, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1609, hash: "WEAPON_TINT7", group: 6},
                
            suppressor: {item_id: 1100, hash: "COMPONENT_AT_AR_SUPP_02", group: 1},
            grip: {item_id: 1101, hash: "COMPONENT_AT_AR_AFGRIP", group: 2},
            flashlight: {item_id: 1102, hash: "COMPONENT_AT_AR_FLSH", group: 3},
            makro: {item_id: 1003, hash: "COMPONENT_AT_SCOPE_MACRO", group: 4},
        }},
        { weapon: 501, caliber: 9, ammo_max: 12, hash: "weapon_pistol", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1604, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1605, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1606, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1607, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1608, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1609, hash: "WEAPON_TINT7", group: 6},
            
            suppressor: {item_id: 1401, hash: "COMPONENT_AT_PI_SUPP_02", group: 1},
            flashlight: {item_id: 1102, hash: "COMPONENT_AT_PI_FLSH", group: 2},
        }},
        { weapon: 502, caliber: 9, ammo_max: 12, hash: "weapon_pistol_mk2", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1611, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1612, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1613, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1614, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1615, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1616, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1617, hash: "WEAPON_TINT7", group: 6},
                tint_8: {item_id: 1618, hash: "WEAPON_TINT8", group: 6},
                tint_9: {item_id: 1619, hash: "WEAPON_TINT9", group: 6},
                tint_10: {item_id: 1620, hash: "WEAPON_TINT10", group: 6},
                tint_11: {item_id: 1621, hash: "WEAPON_TINT11", group: 6},
                tint_12: {item_id: 1622, hash: "WEAPON_TINT12", group: 6},
                tint_13: {item_id: 1623, hash: "WEAPON_TINT13", group: 6},
                tint_14: {item_id: 1624, hash: "WEAPON_TINT14", group: 6},
                tint_15: {item_id: 1625, hash: "WEAPON_TINT15", group: 6},
                tint_16: {item_id: 1626, hash: "WEAPON_TINT16", group: 6},
                tint_17: {item_id: 1627, hash: "WEAPON_TINT17", group: 6},
                tint_18: {item_id: 1628, hash: "WEAPON_TINT18", group: 6},
                tint_19: {item_id: 1629, hash: "WEAPON_TINT19", group: 6},
                tint_20: {item_id: 1630, hash: "WEAPON_TINT20", group: 6},
                tint_21: {item_id: 1631, hash: "WEAPON_TINT21", group: 6},
                tint_22: {item_id: 1632, hash: "WEAPON_TINT22", group: 6},
                tint_23: {item_id: 1633, hash: "WEAPON_TINT23", group: 6},
                tint_24: {item_id: 1634, hash: "WEAPON_TINT24", group: 6},
                tint_25: {item_id: 1635, hash: "WEAPON_TINT25", group: 6},
                tint_26: {item_id: 1636, hash: "WEAPON_TINT26", group: 6},
                tint_27: {item_id: 1637, hash: "WEAPON_TINT27", group: 6},
                tint_28: {item_id: 1638, hash: "WEAPON_TINT28", group: 6},
                tint_29: {item_id: 1639, hash: "WEAPON_TINT29", group: 6},
                tint_30: {item_id: 1640, hash: "WEAPON_TINT30", group: 6},
                tint_31: {item_id: 1641, hash: "WEAPON_TINT31", group: 6},
                
                suppressor: {item_id: 1401, hash: "COMPONENT_AT_PI_SUPP_02", group: 1},
                compensator: {item_id: 1403, hash: "COMPONENT_AT_PI_COMP", group: 1},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_PI_FLSH_02", group: 2},
                mounted: {item_id: 1404, hash: "COMPONENT_AT_PI_RAIL", group: 3},
        }},
        { weapon: 503, caliber: 9, ammo_max: 12, hash: "weapon_combatpistol", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1604, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1605, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1606, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1607, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1608, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1609, hash: "WEAPON_TINT7", group: 6},
                
                suppressor: {item_id: 1401, hash: "COMPONENT_AT_PI_SUPP", group: 1},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_PI_FLSH", group: 2},
        }},
        { weapon: 504, caliber: 9, ammo_max: 18, hash: "weapon_appistol", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1604, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1605, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1606, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1607, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1608, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1609, hash: "WEAPON_TINT7", group: 6},
                
                suppressor: {item_id: 1401, hash: "COMPONENT_AT_PI_SUPP", group: 1},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_PI_FLSH", group: 2},
            }},
        { weapon: 505, caliber: 9, ammo_max: 9, hash: "weapon_pistol50", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1604, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1605, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1606, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1607, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1608, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1609, hash: "WEAPON_TINT7", group: 6},
            
                suppressor: {item_id: 1401, hash: "COMPONENT_AT_AR_SUPP_02", group: 1},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_PI_FLSH", group: 2},
        }},
        { weapon: 506, caliber: 9, ammo_max: 6, hash: "weapon_snspistol", ammo_box: 153, need_license: true},
        { weapon: 507, caliber: 9, ammo_max: 6, hash: "weapon_snspistol_mk2", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1611, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1612, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1613, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1614, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1615, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1616, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1617, hash: "WEAPON_TINT7", group: 6},
                tint_8: {item_id: 1618, hash: "WEAPON_TINT8", group: 6},
                tint_9: {item_id: 1619, hash: "WEAPON_TINT9", group: 6},
                tint_10: {item_id: 1620, hash: "WEAPON_TINT10", group: 6},
                tint_11: {item_id: 1621, hash: "WEAPON_TINT11", group: 6},
                tint_12: {item_id: 1622, hash: "WEAPON_TINT12", group: 6},
                tint_13: {item_id: 1623, hash: "WEAPON_TINT13", group: 6},
                tint_14: {item_id: 1624, hash: "WEAPON_TINT14", group: 6},
                tint_15: {item_id: 1625, hash: "WEAPON_TINT15", group: 6},
                tint_16: {item_id: 1626, hash: "WEAPON_TINT16", group: 6},
                tint_17: {item_id: 1627, hash: "WEAPON_TINT17", group: 6},
                tint_18: {item_id: 1628, hash: "WEAPON_TINT18", group: 6},
                tint_19: {item_id: 1629, hash: "WEAPON_TINT19", group: 6},
                tint_20: {item_id: 1630, hash: "WEAPON_TINT20", group: 6},
                tint_21: {item_id: 1631, hash: "WEAPON_TINT21", group: 6},
                tint_22: {item_id: 1632, hash: "WEAPON_TINT22", group: 6},
                tint_23: {item_id: 1633, hash: "WEAPON_TINT23", group: 6},
                tint_24: {item_id: 1634, hash: "WEAPON_TINT24", group: 6},
                tint_25: {item_id: 1635, hash: "WEAPON_TINT25", group: 6},
                tint_26: {item_id: 1636, hash: "WEAPON_TINT26", group: 6},
                tint_27: {item_id: 1637, hash: "WEAPON_TINT27", group: 6},
                tint_28: {item_id: 1638, hash: "WEAPON_TINT28", group: 6},
                tint_29: {item_id: 1639, hash: "WEAPON_TINT29", group: 6},
                tint_30: {item_id: 1640, hash: "WEAPON_TINT30", group: 6},
                tint_31: {item_id: 1641, hash: "WEAPON_TINT31", group: 6},
            
                suppressor: {item_id: 1401, hash: "COMPONENT_AT_PI_SUPP_02", group: 1},
                compensator: {item_id: 1403, hash: "COMPONENT_AT_PI_COMP_02", group: 1},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_PI_FLSH_03", group: 2},
                mounted: {item_id: 1404, hash: "COMPONENT_AT_PI_RAIL_02", group: 3},
        }},
        { weapon: 508, caliber: 9, ammo_max: 18, hash: "weapon_heavypistol", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1604, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1605, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1606, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1607, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1608, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1609, hash: "WEAPON_TINT7", group: 6},
            
                suppressor: {item_id: 1401, hash: "COMPONENT_AT_PI_SUPP", group: 1},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_PI_FLSH", group: 2},
            }},
        { weapon: 509, caliber: 9, ammo_max: 7, hash: "weapon_vintagepistol", ammo_box: 153, need_license: true, addons: {
                suppressor: {item_id: 1401, hash: "COMPONENT_AT_PI_SUPP", group: 1},
            } },
        { weapon: 510, caliber: 9, ammo_max: 1, hash: "weapon_marksmanpistol", ammo_box: 153, need_license: true },
        { weapon: 511, caliber: 9, ammo_max: 6, hash: "weapon_revolver", ammo_box: 153, need_license: true },
        { weapon: 512, caliber: 9, ammo_max: 6, hash: "weapon_revolver_mk2", ammo_box: 153, need_license: true, addons: {
                camo: {item_id: 1611, hash: "COMPONENT_REVOLVER_MK2_CAMO_ONYX_01", group: 7},
                //tint_1: {item_id: 1611, hash: 'WEAPON_TINT1', group: 6},
                tint_2: {item_id: 1612, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1613, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1614, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1615, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1616, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1617, hash: "WEAPON_TINT7", group: 6},
                tint_8: {item_id: 1618, hash: "WEAPON_TINT8", group: 6},
                tint_9: {item_id: 1619, hash: "WEAPON_TINT9", group: 6},
                tint_10: {item_id: 1620, hash: "WEAPON_TINT10", group: 6},
                tint_11: {item_id: 1621, hash: "WEAPON_TINT11", group: 6},
                tint_12: {item_id: 1622, hash: "WEAPON_TINT12", group: 6},
                tint_13: {item_id: 1623, hash: "WEAPON_TINT13", group: 6},
                tint_14: {item_id: 1624, hash: "WEAPON_TINT14", group: 6},
                tint_15: {item_id: 1625, hash: "WEAPON_TINT15", group: 6},
                tint_16: {item_id: 1626, hash: "WEAPON_TINT16", group: 6},
                tint_17: {item_id: 1627, hash: "WEAPON_TINT17", group: 6},
                tint_18: {item_id: 1628, hash: "WEAPON_TINT18", group: 6},
                tint_19: {item_id: 1629, hash: "WEAPON_TINT19", group: 6},
                tint_20: {item_id: 1630, hash: "WEAPON_TINT20", group: 6},
                tint_21: {item_id: 1631, hash: "WEAPON_TINT21", group: 6},
                tint_22: {item_id: 1632, hash: "WEAPON_TINT22", group: 6},
                tint_23: {item_id: 1633, hash: "WEAPON_TINT23", group: 6},
                tint_24: {item_id: 1634, hash: "WEAPON_TINT24", group: 6},
                tint_25: {item_id: 1635, hash: "WEAPON_TINT25", group: 6},
                tint_26: {item_id: 1636, hash: "WEAPON_TINT26", group: 6},
                tint_27: {item_id: 1637, hash: "WEAPON_TINT27", group: 6},
                tint_28: {item_id: 1638, hash: "WEAPON_TINT28", group: 6},
                tint_29: {item_id: 1639, hash: "WEAPON_TINT29", group: 6},
                tint_30: {item_id: 1640, hash: "WEAPON_TINT30", group: 6},
                tint_31: {item_id: 1641, hash: "WEAPON_TINT31", group: 6},
            
                holographic: {item_id: 1008, hash: "COMPONENT_AT_SIGHTS", group: 1},
                small: {item_id: 1004, hash: "COMPONENT_AT_SCOPE_MACRO_MK2", group: 1},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_PI_FLSH", group: 2},
                compensator: {item_id: 1403, hash: "COMPONENT_AT_PI_COMP_03", group: 3},
            } },
        { weapon: 513, caliber: 9, ammo_max: 6, hash: "weapon_doubleaction", ammo_box: 153, need_license: true },
        { weapon: 514, caliber: 9, ammo_max: 12, hash: "weapon_ceramicpistol", ammo_box: 153, need_license: true , addons: {
                suppressor: {item_id: 1401, hash: "COMPONENT_CERAMICPISTOL_SUPP", group: 1},
            } },
        { weapon: 515, caliber: 9, ammo_max: 6, hash: "weapon_navyrevolver", ammo_box: 153, need_license: true },
        { weapon: 516, caliber: 9, ammo_max: 16, hash: "weapon_microsmg", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1604, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1605, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1606, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1607, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1608, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1609, hash: "WEAPON_TINT7", group: 6},
            
                suppressor: {item_id: 1100, hash: "COMPONENT_AT_AR_SUPP_02", group: 1},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_PI_FLSH", group: 2},
                makro: {item_id: 1003, hash: "COMPONENT_AT_SCOPE_MACRO", group: 3},
            } },
        { weapon: 517, caliber: 9, ammo_max: 30, hash: "weapon_smg", ammo_box: 153, need_license: true, /*addons: {
                suppressor: {item_id: 1401, hash: 'COMPONENT_AT_PI_SUPP', group: 1},
                flashlight: {item_id: 1102, hash: 'COMPONENT_AT_AR_FLSH', group: 2},
                makro: {item_id: 1003, hash: 'COMPONENT_AT_SCOPE_MACRO_02', group: 3},
            }*/ },
        { weapon: 518, caliber: 9, ammo_max: 30, hash: "weapon_smg_mk2", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1611, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1612, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1613, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1614, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1615, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1616, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1617, hash: "WEAPON_TINT7", group: 6},
                tint_8: {item_id: 1618, hash: "WEAPON_TINT8", group: 6},
                tint_9: {item_id: 1619, hash: "WEAPON_TINT9", group: 6},
                tint_10: {item_id: 1620, hash: "WEAPON_TINT10", group: 6},
                tint_11: {item_id: 1621, hash: "WEAPON_TINT11", group: 6},
                tint_12: {item_id: 1622, hash: "WEAPON_TINT12", group: 6},
                tint_13: {item_id: 1623, hash: "WEAPON_TINT13", group: 6},
                tint_14: {item_id: 1624, hash: "WEAPON_TINT14", group: 6},
                tint_15: {item_id: 1625, hash: "WEAPON_TINT15", group: 6},
                tint_16: {item_id: 1626, hash: "WEAPON_TINT16", group: 6},
                tint_17: {item_id: 1627, hash: "WEAPON_TINT17", group: 6},
                tint_18: {item_id: 1628, hash: "WEAPON_TINT18", group: 6},
                tint_19: {item_id: 1629, hash: "WEAPON_TINT19", group: 6},
                tint_20: {item_id: 1630, hash: "WEAPON_TINT20", group: 6},
                tint_21: {item_id: 1631, hash: "WEAPON_TINT21", group: 6},
                tint_22: {item_id: 1632, hash: "WEAPON_TINT22", group: 6},
                tint_23: {item_id: 1633, hash: "WEAPON_TINT23", group: 6},
                tint_24: {item_id: 1634, hash: "WEAPON_TINT24", group: 6},
                tint_25: {item_id: 1635, hash: "WEAPON_TINT25", group: 6},
                tint_26: {item_id: 1636, hash: "WEAPON_TINT26", group: 6},
                tint_27: {item_id: 1637, hash: "WEAPON_TINT27", group: 6},
                tint_28: {item_id: 1638, hash: "WEAPON_TINT28", group: 6},
                tint_29: {item_id: 1639, hash: "WEAPON_TINT29", group: 6},
                tint_30: {item_id: 1640, hash: "WEAPON_TINT30", group: 6},
                tint_31: {item_id: 1641, hash: "WEAPON_TINT31", group: 6},
            
                suppressor: {item_id: 1401, hash: "COMPONENT_AT_PI_SUPP", group: 1},
                flashlight: {item_id: 1100, hash: "COMPONENT_AT_AR_FLSH", group: 2},
                holographic: {item_id: 1008, hash: "COMPONENT_AT_SIGHTS_SMG", group: 3},
                makro: {item_id: 1003, hash: "COMPONENT_AT_SCOPE_MACRO_02_SMG_MK2", group: 3},
                small: {item_id: 1004, hash: "COMPONENT_AT_SCOPE_SMALL_SMG_MK2", group: 3},
                muzzle_1: {item_id: 1501, hash: "COMPONENT_AT_MUZZLE_01", group: 1},
                muzzle_2: {item_id: 1502, hash: "COMPONENT_AT_MUZZLE_02", group: 1},
                muzzle_3: {item_id: 1503, hash: "COMPONENT_AT_MUZZLE_03", group: 1},
                muzzle_4: {item_id: 1504, hash: "COMPONENT_AT_MUZZLE_04", group: 1},
                muzzle_5: {item_id: 1505, hash: "COMPONENT_AT_MUZZLE_05", group: 1},
                muzzle_6: {item_id: 1506, hash: "COMPONENT_AT_MUZZLE_06", group: 1},
                muzzle_7: {item_id: 1507, hash: "COMPONENT_AT_MUZZLE_07", group: 1},
                barrel_heavy: {item_id: 1601, hash: "COMPONENT_AT_SB_BARREL_02", group: 1},
            } },
        { weapon: 519, caliber: 9, ammo_max: 30, hash: "weapon_assaultsmg", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1604, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1605, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1606, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1607, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1608, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1609, hash: "WEAPON_TINT7", group: 6},
            
                suppressor: {item_id: 1100, hash: "COMPONENT_AT_AR_SUPP_02", group: 1},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_AR_FLSH", group: 2},
                makro: {item_id: 1003, hash: "COMPONENT_AT_SCOPE_MACRO_02", group: 3},
            } },
        { weapon: 520, caliber: 9, ammo_max: 30, hash: "weapon_combatpdw", ammo_box: 153, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1604, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1605, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1606, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1607, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1608, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1609, hash: "WEAPON_TINT7", group: 6},
                
                grip: {item_id: 1101, hash: "COMPONENT_AT_AR_AFGRIP", group: 1},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_AR_FLSH", group: 2},
                small: {item_id: 1003, hash: "COMPONENT_AT_SCOPE_SMALL", group: 3},
            } },
        { weapon: 521, caliber: 9, ammo_max: 12, hash: "weapon_machinepistol", ammo_box: 153, need_license: true , addons: {
                suppressor: {item_id: 1401, hash: "COMPONENT_AT_PI_SUPP", group: 1},
            } },
        { weapon: 522, caliber: 9, ammo_max: 20, hash: "weapon_minismg", ammo_box: 153, need_license: true },
        { weapon: 523, caliber: 18.5, ammo_max: 8, hash: "weapon_pumpshotgun", ammo_box: 154, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1604, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1605, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1606, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1607, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1608, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1609, hash: "WEAPON_TINT7", group: 6},
            
                suppressor: {item_id: 1301, hash: "COMPONENT_AT_SR_SUPP", group: 1},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_AR_FLSH", group: 2},
            } },
        { weapon: 524, caliber: 18.5, ammo_max: 8, hash: "weapon_pumpshotgun_mk2", ammo_box: 154, need_license: true, addons: {
                tint_1: {item_id: 1611, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1612, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1613, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1614, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1615, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1616, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1617, hash: "WEAPON_TINT7", group: 6},
                tint_8: {item_id: 1618, hash: "WEAPON_TINT8", group: 6},
                tint_9: {item_id: 1619, hash: "WEAPON_TINT9", group: 6},
                tint_10: {item_id: 1620, hash: "WEAPON_TINT10", group: 6},
                tint_11: {item_id: 1621, hash: "WEAPON_TINT11", group: 6},
                tint_12: {item_id: 1622, hash: "WEAPON_TINT12", group: 6},
                tint_13: {item_id: 1623, hash: "WEAPON_TINT13", group: 6},
                tint_14: {item_id: 1624, hash: "WEAPON_TINT14", group: 6},
                tint_15: {item_id: 1625, hash: "WEAPON_TINT15", group: 6},
                tint_16: {item_id: 1626, hash: "WEAPON_TINT16", group: 6},
                tint_17: {item_id: 1627, hash: "WEAPON_TINT17", group: 6},
                tint_18: {item_id: 1628, hash: "WEAPON_TINT18", group: 6},
                tint_19: {item_id: 1629, hash: "WEAPON_TINT19", group: 6},
                tint_20: {item_id: 1630, hash: "WEAPON_TINT20", group: 6},
                tint_21: {item_id: 1631, hash: "WEAPON_TINT21", group: 6},
                tint_22: {item_id: 1632, hash: "WEAPON_TINT22", group: 6},
                tint_23: {item_id: 1633, hash: "WEAPON_TINT23", group: 6},
                tint_24: {item_id: 1634, hash: "WEAPON_TINT24", group: 6},
                tint_25: {item_id: 1635, hash: "WEAPON_TINT25", group: 6},
                tint_26: {item_id: 1636, hash: "WEAPON_TINT26", group: 6},
                tint_27: {item_id: 1637, hash: "WEAPON_TINT27", group: 6},
                tint_28: {item_id: 1638, hash: "WEAPON_TINT28", group: 6},
                tint_29: {item_id: 1639, hash: "WEAPON_TINT29", group: 6},
                tint_30: {item_id: 1640, hash: "WEAPON_TINT30", group: 6},
                tint_31: {item_id: 1641, hash: "WEAPON_TINT31", group: 6},
            
                holographic: {item_id: 1008, hash: "COMPONENT_AT_SIGHTS", group: 1},
                makro: {item_id: 1003, hash: "COMPONENT_AT_SCOPE_MACRO_MK2", group: 1},
                small: {item_id: 1004, hash: "COMPONENT_AT_SCOPE_SMALL_MK2", group: 1},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_AR_FLSH", group: 2},
                suppressor: {item_id: 1301, hash: "COMPONENT_AT_SR_SUPP_03", group: 3},
                muzzle_8: {item_id: 1508, hash: "COMPONENT_AT_MUZZLE_08", group: 3},
            } },
        { weapon: 525, caliber: 18.5, ammo_max: 8, hash: "weapon_sawnoffshotgun", ammo_box: 154, need_license: true },
        { weapon: 526, caliber: 18.5, ammo_max: 8, hash: "weapon_assaultshotgun", ammo_box: 154, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1604, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1605, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1606, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1607, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1608, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1609, hash: "WEAPON_TINT7", group: 6},
                
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_AR_FLSH", group: 2},
                suppressor: {item_id: 1100, hash: "COMPONENT_AT_AR_SUPP", group: 3},
                grip: {item_id: 1101, hash: "COMPONENT_AT_AR_AFGRIP", group: 1},
            } },
        { weapon: 527, caliber: 18.5, ammo_max: 14, hash: "weapon_bullpupshotgun", ammo_box: 154, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1604, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1605, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1606, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1607, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1608, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1609, hash: "WEAPON_TINT7", group: 6},
                
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_AR_FLSH", group: 2},
                suppressor: {item_id: 1100, hash: "COMPONENT_AT_AR_SUPP_02", group: 3},
                grip: {item_id: 1101, hash: "COMPONENT_AT_AR_AFGRIP", group: 1},
            } },
        { weapon: 528, caliber: 18.5, ammo_max: 1, hash: "weapon_musket", ammo_box: 154, need_license: true },
        { weapon: 529, caliber: 18.5, ammo_max: 6, hash: "weapon_heavyshotgun", ammo_box: 154, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1604, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1605, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1606, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1607, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1608, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1609, hash: "WEAPON_TINT7", group: 6},
                
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_AR_FLSH", group: 2},
                suppressor: {item_id: 1100, hash: "COMPONENT_AT_AR_SUPP_02", group: 3},
                grip: {item_id: 1101, hash: "COMPONENT_AT_AR_AFGRIP", group: 1},
            } },
        { weapon: 530, caliber: 18.5, ammo_max: 2, hash: "weapon_dbshotgun", ammo_box: 154, need_license: true },
        { weapon: 531, caliber: 18.5, ammo_max: 10, hash: "weapon_autoshotgun", ammo_box: 154, need_license: true },
        { weapon: 532, caliber: 7.62, ammo_max: 30, hash: "weapon_assaultrifle_mk2", ammo_box: 155, need_license: true, addons: {
            barrel_heavy: {item_id: 1601, hash: "COMPONENT_AT_AR_BARREL_02", group: 5},
            grip: {item_id: 1101, hash: "COMPONENT_AT_AR_AFGRIP_02", group: 2},
            flashlight: {item_id: 1102, hash: "COMPONENT_AT_AR_FLSH", group: 3},
            holographic: {item_id: 1008, hash: "COMPONENT_AT_SIGHTS", group: 4},
            makro: {item_id: 1003, hash: "COMPONENT_AT_SCOPE_MACRO_MK2", group: 4},
            small: {item_id: 1005, hash: "COMPONENT_AT_SCOPE_MEDIUM_MK2", group: 4},
            suppressor: {item_id: 1100, hash: "COMPONENT_AT_AR_SUPP_02", group: 1},
            muzzle_1: {item_id: 1501, hash: "COMPONENT_AT_MUZZLE_01", group: 1},
            muzzle_2: {item_id: 1502, hash: "COMPONENT_AT_MUZZLE_02", group: 1},
            muzzle_3: {item_id: 1503, hash: "COMPONENT_AT_MUZZLE_03", group: 1},
            muzzle_4: {item_id: 1504, hash: "COMPONENT_AT_MUZZLE_04", group: 1},
            muzzle_5: {item_id: 1505, hash: "COMPONENT_AT_MUZZLE_05", group: 1},
            muzzle_6: {item_id: 1506, hash: "COMPONENT_AT_MUZZLE_06", group: 1},
            muzzle_7: {item_id: 1507, hash: "COMPONENT_AT_MUZZLE_07", group: 1},
            } },
        { weapon: 533, caliber: 5.56, ammo_max: 30, hash: "weapon_carbinerifle", ammo_box: 151, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1604, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1605, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1606, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1607, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1608, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1609, hash: "WEAPON_TINT7", group: 6},
                
                grip: {item_id: 1101, hash: "COMPONENT_AT_AR_AFGRIP", group: 4},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_AR_FLSH", group: 3},
                small: {item_id: 1005, hash: "COMPONENT_AT_SCOPE_MEDIUM", group: 2},
                suppressor: {item_id: 1100, hash: "COMPONENT_AT_AR_SUPP", group: 1},
            } },
        { weapon: 534, caliber: 5.56, ammo_max: 30, hash: "weapon_carbinerifle_mk2", ammo_box: 151, need_license: true, addons: {
                tint_1: {item_id: 1611, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1612, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1613, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1614, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1615, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1616, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1617, hash: "WEAPON_TINT7", group: 6},
                tint_8: {item_id: 1618, hash: "WEAPON_TINT8", group: 6},
                tint_9: {item_id: 1619, hash: "WEAPON_TINT9", group: 6},
                tint_10: {item_id: 1620, hash: "WEAPON_TINT10", group: 6},
                tint_11: {item_id: 1621, hash: "WEAPON_TINT11", group: 6},
                tint_12: {item_id: 1622, hash: "WEAPON_TINT12", group: 6},
                tint_13: {item_id: 1623, hash: "WEAPON_TINT13", group: 6},
                tint_14: {item_id: 1624, hash: "WEAPON_TINT14", group: 6},
                tint_15: {item_id: 1625, hash: "WEAPON_TINT15", group: 6},
                tint_16: {item_id: 1626, hash: "WEAPON_TINT16", group: 6},
                tint_17: {item_id: 1627, hash: "WEAPON_TINT17", group: 6},
                tint_18: {item_id: 1628, hash: "WEAPON_TINT18", group: 6},
                tint_19: {item_id: 1629, hash: "WEAPON_TINT19", group: 6},
                tint_20: {item_id: 1630, hash: "WEAPON_TINT20", group: 6},
                tint_21: {item_id: 1631, hash: "WEAPON_TINT21", group: 6},
                tint_22: {item_id: 1632, hash: "WEAPON_TINT22", group: 6},
                tint_23: {item_id: 1633, hash: "WEAPON_TINT23", group: 6},
                tint_24: {item_id: 1634, hash: "WEAPON_TINT24", group: 6},
                tint_25: {item_id: 1635, hash: "WEAPON_TINT25", group: 6},
                tint_26: {item_id: 1636, hash: "WEAPON_TINT26", group: 6},
                tint_27: {item_id: 1637, hash: "WEAPON_TINT27", group: 6},
                tint_28: {item_id: 1638, hash: "WEAPON_TINT28", group: 6},
                tint_29: {item_id: 1639, hash: "WEAPON_TINT29", group: 6},
                tint_30: {item_id: 1640, hash: "WEAPON_TINT30", group: 6},
                tint_31: {item_id: 1641, hash: "WEAPON_TINT31", group: 6},
            
                barrel_heavy: {item_id: 1601, hash: "COMPONENT_AT_CR_BARREL_02", group: 5},
                grip: {item_id: 1101, hash: "COMPONENT_AT_AR_AFGRIP_02", group: 2},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_AR_FLSH", group: 3},
                holographic: {item_id: 1008, hash: "COMPONENT_AT_SIGHTS", group: 4},
                makro: {item_id: 1003, hash: "COMPONENT_AT_SCOPE_MACRO_MK2", group: 4},
                small: {item_id: 1005, hash: "COMPONENT_AT_SCOPE_MEDIUM_MK2", group: 4},
                suppressor: {item_id: 1100, hash: "COMPONENT_AT_AR_SUPP", group: 1},
                muzzle_1: {item_id: 1501, hash: "COMPONENT_AT_MUZZLE_01", group: 1},
                muzzle_2: {item_id: 1502, hash: "COMPONENT_AT_MUZZLE_02", group: 1},
                muzzle_3: {item_id: 1503, hash: "COMPONENT_AT_MUZZLE_03", group: 1},
                muzzle_4: {item_id: 1504, hash: "COMPONENT_AT_MUZZLE_04", group: 1},
                muzzle_5: {item_id: 1505, hash: "COMPONENT_AT_MUZZLE_05", group: 1},
                muzzle_6: {item_id: 1506, hash: "COMPONENT_AT_MUZZLE_06", group: 1},
                muzzle_7: {item_id: 1507, hash: "COMPONENT_AT_MUZZLE_07", group: 1},
        }},
        { weapon: 535, caliber: 5.56, ammo_max: 30, hash: "weapon_advancedrifle", ammo_box: 151, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1604, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1605, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1606, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1607, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1608, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1609, hash: "WEAPON_TINT7", group: 6},
            
                small: {item_id: 1004, hash: "COMPONENT_AT_SCOPE_SMALL", group: 4},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_AR_FLSH", group: 3},
                suppressor: {item_id: 1100, hash: "COMPONENT_AT_AR_SUPP", group: 1},
            } },
        { weapon: 536, caliber: 5.56, ammo_max: 30, hash: "weapon_specialcarbine", ammo_box: 151, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1604, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1605, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1606, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1607, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1608, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1609, hash: "WEAPON_TINT7", group: 6},
            
                small: {item_id: 1005, hash: "COMPONENT_AT_SCOPE_MEDIUM", group: 4},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_AR_FLSH", group: 3},
                suppressor: {item_id: 1100, hash: "COMPONENT_AT_AR_SUPP_02", group: 1},
                grip: {item_id: 1101, hash: "COMPONENT_AT_AR_AFGRIP", group: 5},
            } },
        { weapon: 537, caliber: 5.56, ammo_max: 30, hash: "weapon_specialcarbine_mk2", ammo_box: 151, need_license: true, addons: {
                tint_1: {item_id: 1611, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1612, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1613, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1614, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1615, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1616, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1617, hash: "WEAPON_TINT7", group: 6},
                tint_8: {item_id: 1618, hash: "WEAPON_TINT8", group: 6},
                tint_9: {item_id: 1619, hash: "WEAPON_TINT9", group: 6},
                tint_10: {item_id: 1620, hash: "WEAPON_TINT10", group: 6},
                tint_11: {item_id: 1621, hash: "WEAPON_TINT11", group: 6},
                tint_12: {item_id: 1622, hash: "WEAPON_TINT12", group: 6},
                tint_13: {item_id: 1623, hash: "WEAPON_TINT13", group: 6},
                tint_14: {item_id: 1624, hash: "WEAPON_TINT14", group: 6},
                tint_15: {item_id: 1625, hash: "WEAPON_TINT15", group: 6},
                tint_16: {item_id: 1626, hash: "WEAPON_TINT16", group: 6},
                tint_17: {item_id: 1627, hash: "WEAPON_TINT17", group: 6},
                tint_18: {item_id: 1628, hash: "WEAPON_TINT18", group: 6},
                tint_19: {item_id: 1629, hash: "WEAPON_TINT19", group: 6},
                tint_20: {item_id: 1630, hash: "WEAPON_TINT20", group: 6},
                tint_21: {item_id: 1631, hash: "WEAPON_TINT21", group: 6},
                tint_22: {item_id: 1632, hash: "WEAPON_TINT22", group: 6},
                tint_23: {item_id: 1633, hash: "WEAPON_TINT23", group: 6},
                tint_24: {item_id: 1634, hash: "WEAPON_TINT24", group: 6},
                tint_25: {item_id: 1635, hash: "WEAPON_TINT25", group: 6},
                tint_26: {item_id: 1636, hash: "WEAPON_TINT26", group: 6},
                tint_27: {item_id: 1637, hash: "WEAPON_TINT27", group: 6},
                tint_28: {item_id: 1638, hash: "WEAPON_TINT28", group: 6},
                tint_29: {item_id: 1639, hash: "WEAPON_TINT29", group: 6},
                tint_30: {item_id: 1640, hash: "WEAPON_TINT30", group: 6},
                tint_31: {item_id: 1641, hash: "WEAPON_TINT31", group: 6},
            
                barrel_heavy: {item_id: 1601, hash: "COMPONENT_AT_SC_BARREL_02", group: 5},
                grip: {item_id: 1101, hash: "COMPONENT_AT_AR_AFGRIP_02", group: 2},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_AR_FLSH", group: 3},
                holographic: {item_id: 1008, hash: "COMPONENT_AT_SIGHTS", group: 4},
                makro: {item_id: 1003, hash: "COMPONENT_AT_SCOPE_MACRO_MK2", group: 4},
                small: {item_id: 1005, hash: "COMPONENT_AT_SCOPE_MEDIUM_MK2", group: 4},
                suppressor: {item_id: 1100, hash: "COMPONENT_AT_AR_SUPP_02", group: 1},
                muzzle_1: {item_id: 1501, hash: "COMPONENT_AT_MUZZLE_01", group: 1},
                muzzle_2: {item_id: 1502, hash: "COMPONENT_AT_MUZZLE_02", group: 1},
                muzzle_3: {item_id: 1503, hash: "COMPONENT_AT_MUZZLE_03", group: 1},
                muzzle_4: {item_id: 1504, hash: "COMPONENT_AT_MUZZLE_04", group: 1},
                muzzle_5: {item_id: 1505, hash: "COMPONENT_AT_MUZZLE_05", group: 1},
                muzzle_6: {item_id: 1506, hash: "COMPONENT_AT_MUZZLE_06", group: 1},
                muzzle_7: {item_id: 1507, hash: "COMPONENT_AT_MUZZLE_07", group: 1},
            }},
        { weapon: 538, caliber: 5.56, ammo_max: 30, hash: "weapon_bullpuprifle", ammo_box: 151, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1604, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1605, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1606, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1607, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1608, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1609, hash: "WEAPON_TINT7", group: 6},
            
                small: {item_id: 1004, hash: "COMPONENT_AT_SCOPE_SMALL", group: 4},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_AR_FLSH", group: 3},
                suppressor: {item_id: 1100, hash: "COMPONENT_AT_AR_SUPP", group: 1},
                grip: {item_id: 1101, hash: "COMPONENT_AT_AR_AFGRIP", group: 5},
            } },
        { weapon: 539, caliber: 5.56, ammo_max: 30, hash: "weapon_bullpuprifle_mk2", ammo_box: 151, need_license: true, addons: {
                tint_1: {item_id: 1611, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1612, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1613, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1614, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1615, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1616, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1617, hash: "WEAPON_TINT7", group: 6},
                tint_8: {item_id: 1618, hash: "WEAPON_TINT8", group: 6},
                tint_9: {item_id: 1619, hash: "WEAPON_TINT9", group: 6},
                tint_10: {item_id: 1620, hash: "WEAPON_TINT10", group: 6},
                tint_11: {item_id: 1621, hash: "WEAPON_TINT11", group: 6},
                tint_12: {item_id: 1622, hash: "WEAPON_TINT12", group: 6},
                tint_13: {item_id: 1623, hash: "WEAPON_TINT13", group: 6},
                tint_14: {item_id: 1624, hash: "WEAPON_TINT14", group: 6},
                tint_15: {item_id: 1625, hash: "WEAPON_TINT15", group: 6},
                tint_16: {item_id: 1626, hash: "WEAPON_TINT16", group: 6},
                tint_17: {item_id: 1627, hash: "WEAPON_TINT17", group: 6},
                tint_18: {item_id: 1628, hash: "WEAPON_TINT18", group: 6},
                tint_19: {item_id: 1629, hash: "WEAPON_TINT19", group: 6},
                tint_20: {item_id: 1630, hash: "WEAPON_TINT20", group: 6},
                tint_21: {item_id: 1631, hash: "WEAPON_TINT21", group: 6},
                tint_22: {item_id: 1632, hash: "WEAPON_TINT22", group: 6},
                tint_23: {item_id: 1633, hash: "WEAPON_TINT23", group: 6},
                tint_24: {item_id: 1634, hash: "WEAPON_TINT24", group: 6},
                tint_25: {item_id: 1635, hash: "WEAPON_TINT25", group: 6},
                tint_26: {item_id: 1636, hash: "WEAPON_TINT26", group: 6},
                tint_27: {item_id: 1637, hash: "WEAPON_TINT27", group: 6},
                tint_28: {item_id: 1638, hash: "WEAPON_TINT28", group: 6},
                tint_29: {item_id: 1639, hash: "WEAPON_TINT29", group: 6},
                tint_30: {item_id: 1640, hash: "WEAPON_TINT30", group: 6},
                tint_31: {item_id: 1641, hash: "WEAPON_TINT31", group: 6},
            
                barrel_heavy: {item_id: 1601, hash: "COMPONENT_AT_BP_BARREL_02", group: 5},
                grip: {item_id: 1101, hash: "COMPONENT_AT_AR_AFGRIP_02", group: 2},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_AR_FLSH", group: 3},
                holographic: {item_id: 1008, hash: "COMPONENT_AT_SIGHTS", group: 4},
                makro: {item_id: 1003, hash: "COMPONENT_AT_SCOPE_MACRO_02_MK2", group: 4},
                small: {item_id: 1004, hash: "COMPONENT_AT_SCOPE_SMALL_MK2", group: 4},
                suppressor: {item_id: 1100, hash: "COMPONENT_AT_AR_SUPP", group: 1},
                muzzle_1: {item_id: 1501, hash: "COMPONENT_AT_MUZZLE_01", group: 1},
                muzzle_2: {item_id: 1502, hash: "COMPONENT_AT_MUZZLE_02", group: 1},
                muzzle_3: {item_id: 1503, hash: "COMPONENT_AT_MUZZLE_03", group: 1},
                muzzle_4: {item_id: 1504, hash: "COMPONENT_AT_MUZZLE_04", group: 1},
                muzzle_5: {item_id: 1505, hash: "COMPONENT_AT_MUZZLE_05", group: 1},
                muzzle_6: {item_id: 1506, hash: "COMPONENT_AT_MUZZLE_06", group: 1},
                muzzle_7: {item_id: 1507, hash: "COMPONENT_AT_MUZZLE_07", group: 1},
            }},
        { weapon: 540, caliber: 5.45, ammo_max: 30,  hash: "weapon_compactrifle", ammo_box: 150, need_license: true },
        { weapon: 541, caliber: 7.62, ammo_max: 70,  hash: "weapon_mg", ammo_box: 155, need_license: true },
        { weapon: 542, caliber: 7.62, ammo_max: 100,  hash: "weapon_combatmg", ammo_box: 155, need_license: true },
        { weapon: 543, caliber: 7.62, ammo_max: 70,  hash: "weapon_combatmg_mk2", ammo_box: 155, need_license: true },
        { weapon: 544, caliber: 7.62, ammo_max: 55,  hash: "weapon_gusenberg", ammo_box: 155, need_license: true },
        { weapon: 545, caliber: 12.7, ammo_max: 10,  hash: "weapon_sniperrifle", ammo_box: 152, need_license: true, addons: {
                suppressor: {item_id: 1301, hash: "COMPONENT_AT_AR_SUPP_02", group: 1},
        }},
        { weapon: 546, caliber: 12.7, ammo_max: 6,  hash: "weapon_heavysniper", ammo_box: 152, need_license: true },
        { weapon: 547, caliber: 12.7, ammo_max: 6,  hash: "weapon_heavysniper_mk2", ammo_box: 152, need_license: true, addons: {
                tint_1: {item_id: 1611, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1612, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1613, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1614, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1615, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1616, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1617, hash: "WEAPON_TINT7", group: 6},
                tint_8: {item_id: 1618, hash: "WEAPON_TINT8", group: 6},
                tint_9: {item_id: 1619, hash: "WEAPON_TINT9", group: 6},
                tint_10: {item_id: 1620, hash: "WEAPON_TINT10", group: 6},
                tint_11: {item_id: 1621, hash: "WEAPON_TINT11", group: 6},
                tint_12: {item_id: 1622, hash: "WEAPON_TINT12", group: 6},
                tint_13: {item_id: 1623, hash: "WEAPON_TINT13", group: 6},
                tint_14: {item_id: 1624, hash: "WEAPON_TINT14", group: 6},
                tint_15: {item_id: 1625, hash: "WEAPON_TINT15", group: 6},
                tint_16: {item_id: 1626, hash: "WEAPON_TINT16", group: 6},
                tint_17: {item_id: 1627, hash: "WEAPON_TINT17", group: 6},
                tint_18: {item_id: 1628, hash: "WEAPON_TINT18", group: 6},
                tint_19: {item_id: 1629, hash: "WEAPON_TINT19", group: 6},
                tint_20: {item_id: 1630, hash: "WEAPON_TINT20", group: 6},
                tint_21: {item_id: 1631, hash: "WEAPON_TINT21", group: 6},
                tint_22: {item_id: 1632, hash: "WEAPON_TINT22", group: 6},
                tint_23: {item_id: 1633, hash: "WEAPON_TINT23", group: 6},
                tint_24: {item_id: 1634, hash: "WEAPON_TINT24", group: 6},
                tint_25: {item_id: 1635, hash: "WEAPON_TINT25", group: 6},
                tint_26: {item_id: 1636, hash: "WEAPON_TINT26", group: 6},
                tint_27: {item_id: 1637, hash: "WEAPON_TINT27", group: 6},
                tint_28: {item_id: 1638, hash: "WEAPON_TINT28", group: 6},
                tint_29: {item_id: 1639, hash: "WEAPON_TINT29", group: 6},
                tint_30: {item_id: 1640, hash: "WEAPON_TINT30", group: 6},
                tint_31: {item_id: 1641, hash: "WEAPON_TINT31", group: 6},
            
                suppressor: {item_id: 1301, hash: "COMPONENT_AT_SR_SUPP_03", group: 1},
                makro: {item_id: 1006, hash: "COMPONENT_AT_SCOPE_LARGE_MK2", group: 2},
                small: {item_id: 1007, hash: "COMPONENT_AT_SCOPE_MAX", group: 2},
                nv: {item_id: 1009, hash: "COMPONENT_AT_SCOPE_NV", group: 2},
                thermal: {item_id: 1010, hash: "COMPONENT_AT_SCOPE_THERMAL", group: 2},
                muzzle_8: {item_id: 1508, hash: "COMPONENT_AT_MUZZLE_08", group: 1},
                muzzle_9: {item_id: 1509, hash: "COMPONENT_AT_MUZZLE_09", group: 1},
                barrel_heavy: {item_id: 1601, hash: "COMPONENT_AT_SR_BARREL_02", group: 3},
            }},
        { weapon: 548, caliber: 12.7, ammo_max: 8,  hash: "weapon_marksmanrifle", ammo_box: 152, need_license: true, addons: {
                tint_1: {item_id: 1603, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1604, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1605, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1606, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1607, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1608, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1609, hash: "WEAPON_TINT7", group: 6},
                
                suppressor: {item_id: 1301, hash: "COMPONENT_AT_AR_SUPP", group: 1},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_AR_FLSH", group: 2},
                grip: {item_id: 1101, hash: "COMPONENT_AT_AR_AFGRIP", group: 3},
            }},
        { weapon: 549, caliber: 12.7, ammo_max: 8,  hash: "weapon_marksmanrifle_mk2", ammo_box: 152, need_license: true, addons: {
                tint_1: {item_id: 1611, hash: "WEAPON_TINT1", group: 6},
                tint_2: {item_id: 1612, hash: "WEAPON_TINT2", group: 6},
                tint_3: {item_id: 1613, hash: "WEAPON_TINT3", group: 6},
                tint_4: {item_id: 1614, hash: "WEAPON_TINT4", group: 6},
                tint_5: {item_id: 1615, hash: "WEAPON_TINT5", group: 6},
                tint_6: {item_id: 1616, hash: "WEAPON_TINT6", group: 6},
                tint_7: {item_id: 1617, hash: "WEAPON_TINT7", group: 6},
                tint_8: {item_id: 1618, hash: "WEAPON_TINT8", group: 6},
                tint_9: {item_id: 1619, hash: "WEAPON_TINT9", group: 6},
                tint_10: {item_id: 1620, hash: "WEAPON_TINT10", group: 6},
                tint_11: {item_id: 1621, hash: "WEAPON_TINT11", group: 6},
                tint_12: {item_id: 1622, hash: "WEAPON_TINT12", group: 6},
                tint_13: {item_id: 1623, hash: "WEAPON_TINT13", group: 6},
                tint_14: {item_id: 1624, hash: "WEAPON_TINT14", group: 6},
                tint_15: {item_id: 1625, hash: "WEAPON_TINT15", group: 6},
                tint_16: {item_id: 1626, hash: "WEAPON_TINT16", group: 6},
                tint_17: {item_id: 1627, hash: "WEAPON_TINT17", group: 6},
                tint_18: {item_id: 1628, hash: "WEAPON_TINT18", group: 6},
                tint_19: {item_id: 1629, hash: "WEAPON_TINT19", group: 6},
                tint_20: {item_id: 1630, hash: "WEAPON_TINT20", group: 6},
                tint_21: {item_id: 1631, hash: "WEAPON_TINT21", group: 6},
                tint_22: {item_id: 1632, hash: "WEAPON_TINT22", group: 6},
                tint_23: {item_id: 1633, hash: "WEAPON_TINT23", group: 6},
                tint_24: {item_id: 1634, hash: "WEAPON_TINT24", group: 6},
                tint_25: {item_id: 1635, hash: "WEAPON_TINT25", group: 6},
                tint_26: {item_id: 1636, hash: "WEAPON_TINT26", group: 6},
                tint_27: {item_id: 1637, hash: "WEAPON_TINT27", group: 6},
                tint_28: {item_id: 1638, hash: "WEAPON_TINT28", group: 6},
                tint_29: {item_id: 1639, hash: "WEAPON_TINT29", group: 6},
                tint_30: {item_id: 1640, hash: "WEAPON_TINT30", group: 6},
                tint_31: {item_id: 1641, hash: "WEAPON_TINT31", group: 6},
            
                suppressor: {item_id: 1301, hash: "COMPONENT_AT_AR_SUPP", group: 1},
                flashlight: {item_id: 1102, hash: "COMPONENT_AT_AR_FLSH", group: 2},
                muzzle_1: {item_id: 1501, hash: "COMPONENT_AT_MUZZLE_01", group: 1},
                muzzle_2: {item_id: 1502, hash: "COMPONENT_AT_MUZZLE_02", group: 1},
                muzzle_3: {item_id: 1503, hash: "COMPONENT_AT_MUZZLE_03", group: 1},
                muzzle_4: {item_id: 1504, hash: "COMPONENT_AT_MUZZLE_04", group: 1},
                muzzle_5: {item_id: 1505, hash: "COMPONENT_AT_MUZZLE_05", group: 1},
                muzzle_6: {item_id: 1506, hash: "COMPONENT_AT_MUZZLE_06", group: 1},
                muzzle_7: {item_id: 1507, hash: "COMPONENT_AT_MUZZLE_07", group: 1},
                barrel_heavy: {item_id: 1601, hash: "COMPONENT_AT_MRFL_BARREL_02", group: 3},
                grip: {item_id: 1101, hash: "COMPONENT_AT_AR_AFGRIP_02", group: 3},
            }},
        { weapon: 550, caliber: null, ammo_max: 0,  hash: "weapon_stungun", ammo_box: null, need_license: true },
        { weapon: 551, caliber: null, ammo_max: 0,  hash: "weapon_bat", ammo_box: null, need_license: true },
        { weapon: 552, caliber: null, ammo_max: 0,  hash: "weapon_knife", ammo_box: null, need_license: true },
        { weapon: 553, caliber: null, ammo_max: 0,  hash: "weapon_nightstick", ammo_box: null, need_license: true },
        { weapon: 554, caliber: 12.7, ammo_max: 1,  hash: "weapon_firework", ammo_box: 152, need_license: true },
        { weapon: 555, caliber: null, ammo_max: 0,  hash: "weapon_flashlight", ammo_box: null},
        { weapon: 556, caliber: 12.7, ammo_max: 0,  hash: "weapon_raypistol", ammo_box: null},
        { weapon: 557, caliber: 12.7, ammo_max: 0,  hash: "weapon_rayminigun", ammo_box: null},
        { weapon: 558, caliber: 12.7, ammo_max: 0,  hash: "weapon_railgun", ammo_box: null},
        { weapon: 559, caliber: 12.7, ammo_max: 0,  hash: "weapon_compactlauncher", ammo_box: null},
        { weapon: 560, caliber: null, ammo_max: 999,  hash: "weapon_fireextinguisher", ammo_box: 156 },
        { weapon: 561, caliber: null, ammo_max: 0,  hash: "weapon_bottle", ammo_box: null, need_license: true },
        { weapon: 562, caliber: null, ammo_max: 0,  hash: "weapon_crowbar", ammo_box: null, need_license: true },
        { weapon: 563, caliber: null, ammo_max: 0,  hash: "weapon_hammer", ammo_box: null, need_license: true },
        { weapon: 564, caliber: null, ammo_max: 0,  hash: "weapon_hatchet", ammo_box: null, need_license: true },
        { weapon: 565, caliber: null, ammo_max: 0,  hash: "weapon_knuckle", ammo_box: null, need_license: true },
        { weapon: 566, caliber: null, ammo_max: 0,  hash: "weapon_machete", ammo_box: null, need_license: true },
        { weapon: 567, caliber: null, ammo_max: 0,  hash: "weapon_wrench", ammo_box: null, need_license: true },
        { weapon: 568, caliber: null, ammo_max: 0,  hash: "weapon_battleaxe", ammo_box: null, need_license: true },
        { weapon: 569, caliber: null, ammo_max: 0,  hash: "weapon_poolcue", ammo_box: null, need_license: true },
        { weapon: 570, caliber: null, ammo_max: 0,  hash: "weapon_stone_hatchet", ammo_box: null, need_license: true },
        { weapon: 571, caliber: 5.56, ammo_max: 30,  hash: "weapon_militaryrifle", ammo_box: 151, need_license: true },
        { weapon: 572, caliber: 9, ammo_max: 6,  hash: "weapon_gadgetpistol", ammo_box: 153, need_license: true },
        { weapon: 573, caliber: null, ammo_max: 0,  hash: "weapon_golfclub", ammo_box: null, need_license: true },
        { weapon: 574, caliber: null, ammo_max: 0,  hash: "weapon_switchblade", ammo_box: null, need_license: true },
    ]


export const getWeaponAddonKeyByItemId = (weapon: number, addon_id: number): keyof WeaponAddonsItem => {
    const q = inventoryShared.getWeaponConfigByItemId(weapon)
    if(!q) return null;
    for(let type in q.addons){
        const t = type as keyof WeaponAddonsItem
        if(q.addons[t]?.item_id === addon_id) return t
    }
    return null;
}

export const CONTAINERS_DATA:{
    /** ID предмета, который будет инвентарём (сумка, бумажник и т.д.)*/
    item_id: number,
    /** Тип хранилища. нужно создавать уникальный в OWNER_TYPES */
    owner_type: OWNER_TYPES,
    /** Максимальный вес в гр. */
    max_size: number,
    /** Список предметов, которые можно поместить в данное хранилище. Если не указывать - то можно поместить что угодно. */
    access?:number[],
    /** Внешний вид контейнера (сумки на теле), если не указать - то не будет отображаться. */
    bag_sync?: BagAttachData,
}[] = [
    // {item_id: 861, owner_type: OWNER_TYPES.WALLET, max_size: 1500, access: [824, 800, 801, 802, 803, 805, 851]},
    {item_id: 2000, owner_type: OWNER_TYPES.BAG1, max_size: 10000, bag_sync: {d: 112, t: 0, p: 2}},
    {item_id: 2001, owner_type: OWNER_TYPES.BAG2, max_size: 10000, bag_sync: {d: 122, t: 0, p: 2}},
    {item_id: 2002, owner_type: OWNER_TYPES.BAG3, max_size: 10000, bag_sync: {d: 123, t: 0, p: 2}}, 
    {item_id: 2003, owner_type: OWNER_TYPES.BAG4, max_size: 10000, bag_sync: {d: 127, t: 0, p: 2}}, 
    {item_id: 2004, owner_type: OWNER_TYPES.BAG5, max_size: 10000, bag_sync: {d: 128, t: 0, p: 2}},
    {item_id: 2005, owner_type: OWNER_TYPES.BAG6, max_size: 10000, bag_sync: {d: 129, t: 0, p: 2}},
    {item_id: 2006, owner_type: OWNER_TYPES.BAG7, max_size: 10000, bag_sync: {d: 130, t: 0, p: 2}},
    {item_id: 2007, owner_type: OWNER_TYPES.BAG8, max_size: 10000, bag_sync: {d: 134, t: 0, p: 2}},
     //////////////////////////////////////////////////



    {item_id: 2008, owner_type: OWNER_TYPES.BAG9, max_size: 10000, bag_sync: {d: 135, t: 0, p: 2}},
    {item_id: 2009, owner_type: OWNER_TYPES.BAG10, max_size: 10000, bag_sync: {d: 86, t: 6, p: 2}}, 
    {item_id: 2010, owner_type: OWNER_TYPES.BAG11, max_size: 30000, bag_sync: {d: 82, t: 0, p: 2}},
    {item_id: 2011, owner_type: OWNER_TYPES.BAG12, max_size: 30000, bag_sync: {d: 82, t: 1, p: 2}},
    {item_id: 2012, owner_type: OWNER_TYPES.BAG13, max_size: 30000, bag_sync: {d: 82, t: 2, p: 2}},
    {item_id: 2013, owner_type: OWNER_TYPES.BAG14, max_size: 30000, bag_sync: {d: 82, t: 3, p: 2}},
    {item_id: 2014, owner_type: OWNER_TYPES.BAG15, max_size: 30000, bag_sync: {d: 82, t: 4, p: 2}},
    {item_id: 2015, owner_type: OWNER_TYPES.BAG16, max_size: 30000, bag_sync: {d: 82, t: 5, p: 2}},
    {item_id: 2016, owner_type: OWNER_TYPES.BAG17, max_size: 30000, bag_sync: {d: 82, t: 6, p: 2}},
    {item_id: 2017, owner_type: OWNER_TYPES.BAG18, max_size: 30000, bag_sync: {d: 82, t: 7, p: 2}},
    {item_id: 2018, owner_type: OWNER_TYPES.BAG19, max_size: 30000, bag_sync: {d: 82, t: 8, p: 2}},
    {item_id: 2019, owner_type: OWNER_TYPES.BAG20, max_size: 30000, bag_sync: {d: 82, t: 9, p: 2}},
    {item_id: 2020, owner_type: OWNER_TYPES.BAG21, max_size: 30000, bag_sync: {d: 82, t: 10, p: 2}},
    {item_id: 2021, owner_type: OWNER_TYPES.BAG22, max_size: 30000, bag_sync: {d: 82, t: 11, p: 2}},
    {item_id: 2022, owner_type: OWNER_TYPES.BAG23, max_size: 30000, bag_sync: {d: 82, t: 12, p: 2}},
    {item_id: 2023, owner_type: OWNER_TYPES.BAG24, max_size: 30000, bag_sync: {d: 82, t: 14, p: 2}},
    {item_id: 2024, owner_type: OWNER_TYPES.BAG26, max_size: 30000, bag_sync: {d: 82, t: 15, p: 2}},
    {item_id: 2025, owner_type: OWNER_TYPES.BAG27, max_size: 30000, bag_sync: {d: 86, t: 0, p: 2}},
    {item_id: 2026, owner_type: OWNER_TYPES.BAG28, max_size: 30000, bag_sync: {d: 86, t: 1, p: 2}},
    {item_id: 2027, owner_type: OWNER_TYPES.BAG29, max_size: 30000, bag_sync: {d: 86, t: 2, p: 2}},
    {item_id: 2028, owner_type: OWNER_TYPES.BAG30, max_size: 30000, bag_sync: {d: 86, t: 3, p: 2}},
    {item_id: 2029, owner_type: OWNER_TYPES.BAG31, max_size: 30000, bag_sync: {d: 86, t: 4, p: 2}},
    {item_id: 2030, owner_type: OWNER_TYPES.BAG32, max_size: 30000, bag_sync: {d: 86, t: 5, p: 2}},
    {item_id: 2031, owner_type: OWNER_TYPES.BAG33, max_size: 30000, bag_sync: {d: 86, t: 6, p: 2}},
    {item_id: 2032, owner_type: OWNER_TYPES.BAG34, max_size: 30000, bag_sync: {d: 86, t: 7, p: 2}},
    {item_id: 2033, owner_type: OWNER_TYPES.BAG35, max_size: 30000, bag_sync: {d: 86, t: 8, p: 2}},
    {item_id: 2034, owner_type: OWNER_TYPES.BAG36, max_size: 30000, bag_sync: {d: 86, t: 9, p: 2}},
    {item_id: 2035, owner_type: OWNER_TYPES.BAG37, max_size: 30000, bag_sync: {d: 86, t: 10, p: 2}},
    {item_id: 2036, owner_type: OWNER_TYPES.BAG38, max_size: 30000, bag_sync: {d: 86, t: 11, p: 2}},
    {item_id: 2037, owner_type: OWNER_TYPES.BAG39, max_size: 30000, bag_sync: {d: 86, t: 12, p: 2}},
    {item_id: 2038, owner_type: OWNER_TYPES.BAG40, max_size: 30000, bag_sync: {d: 86, t: 13, p: 2}},
    {item_id: 2039, owner_type: OWNER_TYPES.BAG41, max_size: 30000, bag_sync: {d: 86, t: 14, p: 2}},
    {item_id: 2040, owner_type: OWNER_TYPES.BAG42, max_size: 30000, bag_sync: {d: 86, t: 15, p: 2}},
    {item_id: 2041, owner_type: OWNER_TYPES.BAG43, max_size: 30000, bag_sync: {d: 86, t: 16, p: 2}},
    {item_id: 2042, owner_type: OWNER_TYPES.BAG44, max_size: 30000, bag_sync: {d: 86, t: 17, p: 2}},
    {item_id: 2043, owner_type: OWNER_TYPES.BAG45, max_size: 30000, bag_sync: {d: 86, t: 18, p: 2}},
    {item_id: 2044, owner_type: OWNER_TYPES.BAG46, max_size: 30000, bag_sync: {d: 86, t: 19, p: 2}},
    {item_id: 2045, owner_type: OWNER_TYPES.BAG47, max_size: 30000, bag_sync: {d: 86, t: 20, p: 2}},
    {item_id: 2046, owner_type: OWNER_TYPES.BAG48, max_size: 30000, bag_sync: {d: 86, t: 21, p: 2}},
    {item_id: 2047, owner_type: OWNER_TYPES.BAG49, max_size: 30000, bag_sync: {d: 86, t: 22, p: 2}},
    {item_id: 2048, owner_type: OWNER_TYPES.BAG50, max_size: 30000, bag_sync: {d: 86, t: 23, p: 2}},
    {item_id: 2049, owner_type: OWNER_TYPES.BAG51, max_size: 30000, bag_sync: {d: 86, t: 24, p: 2}},
    {item_id: 2050, owner_type: OWNER_TYPES.BAG53, max_size: 18000, bag_sync: {d: 91, t: 0, p: 2}},
    {item_id: 2051, owner_type: OWNER_TYPES.BAG54, max_size: 18000, bag_sync: {d: 91, t: 1, p: 2}},
    {item_id: 2052, owner_type: OWNER_TYPES.BAG55, max_size: 18000, bag_sync: {d: 91, t: 2, p: 2}},
    {item_id: 2053, owner_type: OWNER_TYPES.BAG56, max_size: 18000, bag_sync: {d: 91, t: 3, p: 2}},
    {item_id: 2054, owner_type: OWNER_TYPES.BAG57, max_size: 23000, bag_sync: {d: 91, t: 4, p: 2}},
    {item_id: 2055, owner_type: OWNER_TYPES.BAG58, max_size: 23000, bag_sync: {d: 91, t: 6, p: 2}},
    {item_id: 2056, owner_type: OWNER_TYPES.BAG59, max_size: 23000, bag_sync: {d: 91, t: 7, p: 2}},
    {item_id: 2057, owner_type: OWNER_TYPES.BAG60, max_size: 23000, bag_sync: {d: 91, t: 8, p: 2}},
    {item_id: 2058, owner_type: OWNER_TYPES.BAG61, max_size: 7000, bag_sync: {d: 97, t: 0, p: 2}},
    {item_id: 2059, owner_type: OWNER_TYPES.BAG62, max_size: 7000, bag_sync: {d: 97, t: 1, p: 2}},
    {item_id: 2060, owner_type: OWNER_TYPES.BAG63, max_size: 7000, bag_sync: {d: 97, t: 2, p: 2}},
    {item_id: 2061, owner_type: OWNER_TYPES.BAG64, max_size: 7000, bag_sync: {d: 97, t: 3, p: 2}},
    {item_id: 2062, owner_type: OWNER_TYPES.BAG65, max_size: 7000, bag_sync: {d: 97, t: 4, p: 2}},
    {item_id: 2063, owner_type: OWNER_TYPES.BAG66, max_size: 5000, bag_sync: {d: 93, t: 0, p: 2}},
    {item_id: 2064, owner_type: OWNER_TYPES.BAG67, max_size: 5000, bag_sync: {d: 93, t: 1, p: 2}},
    {item_id: 2065, owner_type: OWNER_TYPES.BAG68, max_size: 5000, bag_sync: {d: 93, t: 2, p: 2}},
    {item_id: 2066, owner_type: OWNER_TYPES.BAG69, max_size: 5000, bag_sync: {d: 93, t: 3, p: 2}},
    {item_id: 2067, owner_type: OWNER_TYPES.BAG70, max_size: 5000, bag_sync: {d: 93, t: 4, p: 2}},
    {item_id: 2068, owner_type: OWNER_TYPES.BAG71, max_size: 18000, bag_sync: {d: 94, t: 0, p: 2}},
    {item_id: 2069, owner_type: OWNER_TYPES.BAG72, max_size: 18000, bag_sync: {d: 94, t: 1, p: 2}},
    {item_id: 2070, owner_type: OWNER_TYPES.BAG73, max_size: 18000, bag_sync: {d: 94, t: 2, p: 2}},
    {item_id: 2071, owner_type: OWNER_TYPES.BAG74, max_size: 18000, bag_sync: {d: 95, t: 0, p: 2}},
    {item_id: 2072, owner_type: OWNER_TYPES.BAG75, max_size: 18000, bag_sync: {d: 95, t: 1, p: 2}},
    {item_id: 2073, owner_type: OWNER_TYPES.BAG76, max_size: 18000, bag_sync: {d: 95, t: 2, p: 2}},
    {item_id: 2074, owner_type: OWNER_TYPES.BAG77, max_size: 23000, bag_sync: {d: 96, t: 0, p: 2}},
    {item_id: 2075, owner_type: OWNER_TYPES.BAG78, max_size: 23000, bag_sync: {d: 96, t: 1, p: 2}},
    {item_id: 2076, owner_type: OWNER_TYPES.BAG79, max_size: 23000, bag_sync: {d: 96, t: 2, p: 2}},
    {item_id: 2077, owner_type: OWNER_TYPES.BAG80, max_size: 23000, bag_sync: {d: 96, t: 3, p: 2}},
    {item_id: 2078, owner_type: OWNER_TYPES.BAG81, max_size: 23000, bag_sync: {d: 98, t: 0, p: 2}},
    {item_id: 2079, owner_type: OWNER_TYPES.BAG82, max_size: 23000, bag_sync: {d: 98, t: 1, p: 2}},
    {item_id: 2080, owner_type: OWNER_TYPES.BAG83, max_size: 23000, bag_sync: {d: 98, t: 2, p: 2}},
    {item_id: 2081, owner_type: OWNER_TYPES.BAG84, max_size: 23000, bag_sync: {d: 98, t: 4, p: 2}},
    {item_id: 2082, owner_type: OWNER_TYPES.BAG85, max_size: 23000, bag_sync: {d: 98, t: 6, p: 2}},
    {item_id: 2083, owner_type: OWNER_TYPES.BAG86, max_size: 23000, bag_sync: {d: 98, t: 7, p: 2}},
    {item_id: 2084, owner_type: OWNER_TYPES.BAG87, max_size: 23000, bag_sync: {d: 98, t: 8, p: 2}},
    {item_id: 2085, owner_type: OWNER_TYPES.BAG88, max_size: 23000, bag_sync: {d: 98, t: 9, p: 2}},
    {item_id: 2086, owner_type: OWNER_TYPES.BAG89, max_size: 23000, bag_sync: {d: 98, t: 10, p: 2}},
    {item_id: 2087, owner_type: OWNER_TYPES.BAG90, max_size: 30000, bag_sync: {d: 100, t: 0, p: 2}},
    {item_id: 2088, owner_type: OWNER_TYPES.BAG91, max_size: 30000, bag_sync: {d: 100, t: 1, p: 2}},
    {item_id: 2089, owner_type: OWNER_TYPES.BAG92, max_size: 30000, bag_sync: {d: 101, t: 0, p: 2}},
    {item_id: 2090, owner_type: OWNER_TYPES.BAG93, max_size: 30000, bag_sync: {d: 102, t: 0, p: 2}},
    {item_id: 2091, owner_type: OWNER_TYPES.BAG94, max_size: 30000, bag_sync: {d: 103, t: 0, p: 2}},
    {item_id: 2092, owner_type: OWNER_TYPES.BAG95, max_size: 30000, bag_sync: {d: 103, t: 1, p: 2}},
    {item_id: 2093, owner_type: OWNER_TYPES.BAG96, max_size: 33000, bag_sync: {d: 104, t: 0, p: 2}},
    {item_id: 2094, owner_type: OWNER_TYPES.BAG97, max_size: 33000, bag_sync: {d: 104, t: 1, p: 2}},
    {item_id: 2095, owner_type: OWNER_TYPES.BAG98, max_size: 33000, bag_sync: {d: 104, t: 2, p: 2}},
    {item_id: 2096, owner_type: OWNER_TYPES.BAG99, max_size: 33000, bag_sync: {d: 104, t: 3, p: 2}},
    {item_id: 2097, owner_type: OWNER_TYPES.BAG100, max_size: 33000, bag_sync: {d: 104, t: 4, p: 2}},
    {item_id: 2098, owner_type: OWNER_TYPES.BAG_102, max_size: 35000, bag_sync: {d: 105, t: 0, p: 2}},
    {item_id: 2099, owner_type: OWNER_TYPES.BAG_103, max_size: 35000, bag_sync: {d: 106, t: 0, p: 2}},
    {item_id: 2100, owner_type: OWNER_TYPES.BAG_104, max_size: 33000, bag_sync: {d: 107, t: 0, p: 2}},
    {item_id: 2101, owner_type: OWNER_TYPES.BAG_105, max_size: 33000, bag_sync: {d: 107, t: 1, p: 2}},
    {item_id: 2102, owner_type: OWNER_TYPES.BAG_106, max_size: 33000, bag_sync: {d: 107, t: 2, p: 2}},
    {item_id: 2103, owner_type: OWNER_TYPES.BAG_107, max_size: 33000, bag_sync: {d: 107, t: 3, p: 2}},
    {item_id: 2104, owner_type: OWNER_TYPES.BAG_108, max_size: 33000, bag_sync: {d: 107, t: 4, p: 2}},
    {item_id: 2105, owner_type: OWNER_TYPES.BAG_109, max_size: 33000, bag_sync: {d: 107, t: 5, p: 2}},
    {item_id: 2106, owner_type: OWNER_TYPES.BAG_110, max_size: 33000, bag_sync: {d: 108, t: 0, p: 2}},
    {item_id: 2107, owner_type: OWNER_TYPES.BAG_111, max_size: 33000, bag_sync: {d: 108, t: 1, p: 2}},
    {item_id: 2108, owner_type: OWNER_TYPES.BAG_112, max_size: 33000, bag_sync: {d: 108, t: 2, p: 2}},
    {item_id: 2109, owner_type: OWNER_TYPES.BAG_113, max_size: 33000, bag_sync: {d: 108, t: 3, p: 2}},
    {item_id: 2110, owner_type: OWNER_TYPES.BAG_114, max_size: 33000, bag_sync: {d: 108, t: 4, p: 2}},
    {item_id: 2111, owner_type: OWNER_TYPES.BAG_115, max_size: 33000, bag_sync: {d: 108, t: 5, p: 2}},
    {item_id: 2112, owner_type: OWNER_TYPES.BAG_116, max_size: 33000, bag_sync: {d: 108, t: 6, p: 2}},
    {item_id: 2113, owner_type: OWNER_TYPES.BAG_117, max_size: 33000, bag_sync: {d: 108, t: 7, p: 2}},
    {item_id: 2114, owner_type: OWNER_TYPES.BAG_118, max_size: 33000, bag_sync: {d: 109, t: 0, p: 2}},
    {item_id: 2115, owner_type: OWNER_TYPES.BAG_119, max_size: 33000, bag_sync: {d: 109, t: 1, p: 2}},
    {item_id: 2116, owner_type: OWNER_TYPES.BAG_120, max_size: 33000, bag_sync: {d: 109, t: 2, p: 2}},
    {item_id: 2117, owner_type: OWNER_TYPES.BAG_121, max_size: 33000, bag_sync: {d: 109, t: 3, p: 2}},
    {item_id: 2118, owner_type: OWNER_TYPES.BAG_122, max_size: 33000, bag_sync: {d: 109, t: 4, p: 2}},
    {item_id: 2119, owner_type: OWNER_TYPES.BAG_123, max_size: 33000, bag_sync: {d: 109, t: 5, p: 2}},
    {item_id: 2120, owner_type: OWNER_TYPES.BAG_124, max_size: 15000, bag_sync: {d: 110, t: 0, p: 2}},
    {item_id: 2121, owner_type: OWNER_TYPES.BAG_125, max_size: 15000, bag_sync: {d: 110, t: 1, p: 2}},
    {item_id: 2122, owner_type: OWNER_TYPES.BAG_126, max_size: 15000, bag_sync: {d: 110, t: 2, p: 2}},
    {item_id: 2123, owner_type: OWNER_TYPES.BAG_127, max_size: 15000, bag_sync: {d: 110, t: 3, p: 2}},
    {item_id: 2124, owner_type: OWNER_TYPES.BAG_128, max_size: 15000, bag_sync: {d: 110, t: 4, p: 2}},
    {item_id: 2125, owner_type: OWNER_TYPES.BAG_129, max_size: 15000, bag_sync: {d: 110, t: 5, p: 2}},
    {item_id: 2126, owner_type: OWNER_TYPES.BAG_130, max_size: 15000, bag_sync: {d: 110, t: 6, p: 2}},
    {item_id: 2127, owner_type: OWNER_TYPES.BAG_135, max_size: 25000, bag_sync: {d: 111, t: 0, p: 2}},
    {item_id: 2128, owner_type: OWNER_TYPES.BAG_136, max_size: 25000, bag_sync: {d: 112, t: 0, p: 2}},
    {item_id: 2129, owner_type: OWNER_TYPES.BAG_137, max_size: 20000, bag_sync: {d: 114, t: 0, p: 2}},
    {item_id: 2130, owner_type: OWNER_TYPES.BAG_138, max_size: 30000, bag_sync: {d: 115, t: 0, p: 2}},
    {item_id: 2131, owner_type: OWNER_TYPES.BAG_139, max_size: 30000, bag_sync: {d: 117, t: 0, p: 2}},
    {item_id: 2132, owner_type: OWNER_TYPES.BAG_140, max_size: 30000, bag_sync: {d: 117, t: 1, p: 2}},
    {item_id: 2133, owner_type: OWNER_TYPES.BAG_141, max_size: 30000, bag_sync: {d: 117, t: 2, p: 2}},
    {item_id: 2134, owner_type: OWNER_TYPES.BAG_142, max_size: 30000, bag_sync: {d: 117, t: 3, p: 2}},
    {item_id: 2135, owner_type: OWNER_TYPES.BAG_143, max_size: 30000, bag_sync: {d: 117, t: 5, p: 2}},
    {item_id: 2136, owner_type: OWNER_TYPES.BAG_144, max_size: 30000, bag_sync: {d: 117, t: 6, p: 2}},
    {item_id: 2137, owner_type: OWNER_TYPES.BAG_145, max_size: 30000, bag_sync: {d: 117, t: 7, p: 2}},
    {item_id: 2138, owner_type: OWNER_TYPES.BAG_146, max_size: 30000, bag_sync: {d: 117, t: 8, p: 2}},
    {item_id: 2139, owner_type: OWNER_TYPES.BAG_147, max_size: 30000, bag_sync: {d: 117, t: 9, p: 2}},
    {item_id: 2140, owner_type: OWNER_TYPES.BAG_148, max_size: 30000, bag_sync: {d: 117, t: 10, p: 2}},
    {item_id: 2141, owner_type: OWNER_TYPES.BAG_149, max_size: 30000, bag_sync: {d: 117, t: 11, p: 2}},
    {item_id: 2142, owner_type: OWNER_TYPES.BAG_150, max_size: 30000, bag_sync: {d: 118, t: 0, p: 2}},
    {item_id: 2143, owner_type: OWNER_TYPES.BAG_151, max_size: 30000, bag_sync: {d: 119, t: 0, p: 2}},
    {item_id: 2144, owner_type: OWNER_TYPES.BAG_152, max_size: 35000, bag_sync: {d: 120, t: 0, p: 2}},
    {item_id: 2145, owner_type: OWNER_TYPES.BAG_153, max_size: 35000, bag_sync: {d: 121, t: 0, p: 2}},
    {item_id: 2146, owner_type: OWNER_TYPES.BAG_154, max_size: 25000, bag_sync: {d: 122, t: 0, p: 2}},
    {item_id: 2147, owner_type: OWNER_TYPES.BAG_155, max_size: 25000, bag_sync: {d: 122, t: 1, p: 2}},
    //! Данный кусок не трогать, нужен для модификаций оружия
    ...weapon_list.filter(q => q.addons).map(q => {
        let access: number[] = []
        for(let type in q.addons){
            const t = type as keyof WeaponAddonsItem
            if(q.addons[t]?.item_id) access.push(q.addons[t]?.item_id)
        }
        return {
            item_id: q.weapon,
            owner_type: OWNER_TYPES.WEAPON_MODS,
            max_size: 10000,
            access
        }
    })
]


let itemsAttachBody = itemsList.filter(q => q.attachBody)

export const inventoryShared = {
    get items(): itemConfig[]{
        return itemsList
    },
    get itemsHand(): itemConfig[]{
        return itemsList.filter(q => q.inHand)
    },
    get itemsAttachBody(): itemConfig[]{
        return itemsAttachBody
    },
    get: (item_id: number) => inventoryShared.items.find(item => item.item_id == item_id),
    getWeaponConfigByItemId: (id: number) => {
        return weapon_list.find(q => q.weapon == id);
    },
    getWeaponNameByHash: (hash: string) => {
        hash = hash.replace("weapon_", "");
        let cfg = weapon_list.find(q => q.hash.includes(hash));
        if(!cfg) return null;
        const item = inventoryShared.get(cfg.weapon);
        if(!item) return null;
        return item.name
    },
    getWeaponConfigByHash: (hash: string) => {
        if(!hash) return null;
        hash = hash.toLowerCase().replace("weapon_", "");
        let cfg = weapon_list.find(q => q.hash.includes(hash));
        if(!cfg) return null;
        const item = inventoryShared.get(cfg.weapon);
        if(!item) return null;
        return inventoryShared.getWeaponConfigByItemId(item.item_id)
    },
    get weapons(){
        return weapon_list
    }
}
