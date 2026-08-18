import { langStringDefault } from "./lang/index";
import { StringNullableChain } from "lodash";
import {LicenceType} from "./licence";

/** На сколько дней даётся випка при регистрации аккаунта */
export const VIP_START_DAYS = 14;

/** На сколько дней даётся випка при активации промо */
export const VIP_PROMO_USE_DAYS = 14;

/** Випка которая выдается при вводе промокода */
export const PROMO_VIP_ID: VipId = "Sapfire";

export type VipId = "Sapfire" | "MediaLight" | "MediaHard" | "Ruby" | "Diamond"

/** Информация о випке */
export interface VipData {
    /** Идентификатор випки */
    id: VipId;
    /** Название випки */
    name: string;
    /** Стоимость випки на 30 дней, если 0 или не указывать - купить будет нельзя */
    cost?: number;
    /** Надбавка $ при выдаче PayDay */
    payday_money?: number;
    /** Надбавка опыта при выдаче PayDay */
    payday_exp?: number;
    /** Надбавка донат валюты при выдаче PayDay */
    payday_donate?: number;
    /** доп процент получаемого опыта работы (1-1000%)
     * @example Если будет выдано 200 опыта, а параметр указан 10, то будет выдано 100 + (200 / 100 * 10) опыта
     */
    job_skill_multipler?: number;
    /** Коэффициент зарплат на работах */
    jobPaymentMultiplier?: number;
    /** Данная випка предназначена для медиа */
    media?: true;
    /** Данная випка будет выдана при создании аккаунта. Если випок с этим статусом несколько - выберется случайно */
    start?: true;
    /**Лечение в больнице идет в 2 раза быстрее */
    healmultipler?: boolean;
    /**Сколько времени можно стоять AFK */
    afkminutes?: number;
    /** Доступ к /vipuninvite */
    vipuninvite?: boolean;
    /** Оптала налогов через сайт */
    sitepay?: boolean;
    /** Отметить что популярное */
    popular?: boolean;
    /** Цвет */
    color: string;
    /** VIP членство в казино */
    casino?: boolean;

    /** Время ожидания смерти в миллисекундах */
    deathScreenTime?: number;

    /** Максимальное время уплаты налогов в днях  */
    taxPropertyMaxDays?: number;
}

export const VIP_TARIFS: VipData[] = [

    { id: "Sapfire", name: langStringDefault("vip.469677cca2c808ffecd9dfbb2a44a512"), cost:160, payday_exp: 1, healmultipler: true , afkminutes: 15 , color: "#FFFFFF", jobPaymentMultiplier: 1.2, deathScreenTime: 120000 },
    { id: "MediaLight", name: langStringDefault("vip.44855f32f53d7b0e9883be70dd89c5d3"), media: true, vipuninvite: true, payday_money: 1000, job_skill_multipler: 20, healmultipler: true, afkminutes: 25 , color: "#FFFFFF", casino: true, deathScreenTime: 60000 },
    { id: "MediaHard", name: langStringDefault("vip.33c5424a4d21c7cf93d6aa52c8383367"), media: true, vipuninvite: true, payday_money: 1500, job_skill_multipler: 30, payday_exp: 1, healmultipler: true, afkminutes: 35,  color: "#FFFFFF", casino: true, deathScreenTime: 60000 },
    { id: "Ruby", name: langStringDefault("vip.ec3cf1bc7eab8e63edb10a60ba8c6672"), cost: 230, payday_money: 800, healmultipler: true, afkminutes:30 , payday_exp: 1, color: "#A48A57", jobPaymentMultiplier: 1.5, deathScreenTime: 90000, casino: true },
    { id: "Diamond", name: "Diamond", cost: 400, payday_money: 1200,  healmultipler: true, afkminutes: 45, payday_exp: 2, popular: true , color: "#748DC3", jobPaymentMultiplier: 1.8, deathScreenTime: 60000, casino: true, taxPropertyMaxDays: 21 },

]

export const getVipConfig = (id: VipId) => {
    return VIP_TARIFS.find(q => q.id === id);
}



interface PacketData {
    /** ИД (уникальный, двух одинаковых быть не должно) */
    id: number,
    /** Название */
    name: string,
    /** Стоимость */
    price: number,
    /** Зачёркнутая цена */
    full_price: number,
    /** Отметка что это популярно */
    popular?: boolean,
    /** Награда */
    items: {
        /** Выдать випку */
        vip?: {
            /** Тип */
            type: VipId;
            /** Количество месяцев */
            time: number;
        },
        /** Выдать лицензии */
        licenses?: {id: LicenceType, days: number}[],
        /** Выдать деньги */
        money?:number,
        /** Выдать предметы */
        items?: number[]
    },
    /** Стиль (не трогать) */
    class: string
}
export const PACKETS: PacketData[] = [
    { id: 1, name:langStringDefault("vip.d26de74d2b1b23629f4511df3384ad8c"),  class: "incepator", price: 200, full_price: 800, items: { vip: { type:"Sapfire", time: 1}, licenses: [{id: "car", days: 30}], money: 20000}},
    { id: 2, name:langStringDefault("vip.4f57f60ff67ce78fa97f0de16b9a08a3"),  class: "veteran", price: 250, full_price: 1250, items: { vip: { type:"Sapfire", time: 1}, licenses: [{id: "car", days: 30}, {id: "truck", days: 30},{id: "med", days: 30}], money: 50000}},
    { id: 3, name:langStringDefault("vip.4aed6ec71b8332b709c71d35d211cf49"),    class: "bogat",popular: true, price: 300, full_price: 3770, items: { vip: { type:"Ruby", time: 1}, licenses: [{id: "car", days: 30},{id: "weapon", days: 30},{id: "med", days: 30}], money: 100000, items: [850, 851]}},
    { id: 4, name:langStringDefault("vip.1db33160d3ffccc70e4cefddc26a84b2"),class: "milionar", price: 350, full_price: 5500, items: { vip: { type:"Diamond", time: 1}, licenses: [{id: "car", days: 30},{id: "weapon", days: 30},{id: "med", days: 30}], items: [850, 851], money: 200000}},
    { id: 5, name:langStringDefault("vip.5a1efacb50a61bc603a1b022e74a175b"),  class: "veteran", price: 400, full_price: 2000, items: { licenses: [{id:"reanimation", days:30},{id: "car", days: 30},{id: "moto", days: 30},{id: "truck", days: 30},{id: "weapon", days: 30},{id: "med", days: 30}]}},
]