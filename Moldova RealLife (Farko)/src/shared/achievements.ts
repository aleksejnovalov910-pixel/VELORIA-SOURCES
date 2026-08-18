// Lang file ready
import { langStringDefault } from "./lang/index";
import {JobId} from "./jobs";
import {BUSINESS_TYPE} from "./business";
import {LicenceType} from "./licence";
import {OWNER_TYPES} from "./inventory";
import {systemUtil} from "./system";
export const DEFAULT_USER_ACHIEV: [number, number] = [0, 0]


export type UserAchievmentItem = typeof DEFAULT_USER_ACHIEV
export type UserAchievmentData = {[param in UserAchievmentKey]?: UserAchievmentItem}
export interface AchievementItemBase {
    key: UserAchievmentKey,
    /** Название ачивки */
    name: string,
    /** Описание ачивки */
    desc: string,
    /** Сколько нужно выполнить задания чтобы достижение было выполнено */
    max: number,
    /** Награда при получении достижения */
    reward: {
        /** Выдать предметы при получении награды */
        item?:number[];
        /** Выдать деньги при получении награды */
        money?:number;
        /** Выдать опыт при получении награды */
        exp?:number;
        /** Выдать донат валюту при получении награды */
        donate?:number;
    }
}

/** Интерфейс заработка денег на работе */
export interface AchievementItemJob extends AchievementItemBase { type: "jobmoney" | "jobexp"; jobId?: JobId }
/** Интерфейс отыгранного времени на сервере */
export interface AchievementItemPlayTime extends AchievementItemBase { type: "playTime" }
/** Проехать на такси */
export interface AchievementItemTaxi extends AchievementItemBase { type: "taxiDriverCount" | "taxiPassengerCount" | "taxiDriverSum" | "taxiPassengerSum" }
/** Задание в инкаске */
export interface AchievementItemGR6 extends AchievementItemBase { type: "gr6count" | "gr6sum" }
/** Задание в дальнобойщиках */
export interface AchievementItemDeliver extends AchievementItemBase { type: "deliverCount" | "deliverSum" }
/** Дуэли */
export interface AchievementItemDuel extends AchievementItemBase { type: "duelCount" | "duelSum" }
/** Победа в БР */
export interface AchievementItemBR extends AchievementItemBase { type: "brCount" | "brSum" }
/** Победа в гонках */
export interface AchievementItemRace extends AchievementItemBase { type: "raceWinPLace" | "raceFirst" | "raceSum" }
/** Покупка в бизнесах */
export interface AchievementItemBiz extends AchievementItemBase { type: "buyShopSum", typeBiz?: BUSINESS_TYPE, subtypeBiz?:number }
/** Использование предмета */
export interface AchievementItemUse extends AchievementItemBase { type: "useItem", item_id: number[] }
/** Получение лицензии */
export interface AchievementItemLicense extends AchievementItemBase { type: "giveLicense", license: LicenceType[] }
/** Получение лицензии */
export interface AchievementItemDocument extends AchievementItemBase { type: "giveDocument", document: string[] }
/** Ловля рыбы */
export interface AchievementItemFish extends AchievementItemBase { type: "fishCount" }
/** Вскрыть ТС */
export interface AchievementItemVehJack extends AchievementItemBase { type: "vehJack" }
/** Угнать ТС для Ламара */
export interface AchievementItemVehJackLamar extends AchievementItemBase { type: "vehJackLamar" }
/** Выполнить другое достижение (НЕ ИСПОЛЬЗОВАТЬ ДЛЯ ВРЕМЕННЫХ ДОСТИЖЕНИЙ) */
export interface AchievementItemComplete extends AchievementItemBase { type: "achieveComplete", achieve?:UserAchievmentKey[] }
/** Познакомится */
export interface AchievementItemMeet extends AchievementItemBase { type: "newMeet" }
/** Купить дом */
export interface AchievementItemBuyHouse extends AchievementItemBase { type: "buyHouse" }
/** Прописать человека */
export interface AchievementItemResidentHouse extends AchievementItemBase { type: "inviteResident" }
/** Оказаться прописаным в доме */
export interface AchievementItemBeResidentHouse extends AchievementItemBase { type: "beResident" }
/** Оказаться прописаным в доме */
export interface AchievementItemFlat extends AchievementItemBase { type: "flatCount" | "flatSum" }
/** Продать ТС */
export interface AchievementItemVehSell extends AchievementItemBase { type: "vehSellGos" | "vehSellPlayer" }
/** Переместить предмет */
export interface AchievementItemMove extends AchievementItemBase { type: "itemMove", owner_types?: OWNER_TYPES[] }
/** Принять участие в МП */
export interface AchievementItemEvent extends AchievementItemBase { type: "eventEnter" }
/** Заработок по безработице */
export interface AchievementItemNoWork extends AchievementItemBase { type: "noWorkMoneySum" }
/** Наработать очки по дрифту */
export interface AchievementItemDrift extends AchievementItemBase { type: "driftPoints" }
/** Наработать очки по дрифту */
export interface AchievementItemHunt extends AchievementItemBase { type: "animalHunt" }
/** Казино */
export interface AchievementItemCasino extends AchievementItemBase { type:
    /** Количество побед где либо кроме крупье */
        "casinoWinCount"
        /** Сумма побед где либо кроме крупье */
        | "casinoWinSum"
        /** Количество побед в рулетке */
        | "casinoRouletteWinCount"
        /** Сумма побед в рулетке */
        | "casinoRouletteWinSum"
        /** Количество побед в костях */
        | "casinoDiceWinCount"
        /** Сумма побед в рулетке */
        | "casinoDiceWinSum"
        /** Количество побед в слотах */
        | "casinoSlotsWinCount"
        /** Сумма побед в рулетке */
        | "casinoSlotsWinSum"
        /** Сколько дилер на костях провёл успешных игр */
        | "casinoDiceDealerWinCount"
        /** Комиссия диллера в костях */
        | "casinoDiceDealerWinSum"
}

export type AchievementItem = AchievementItemJob | AchievementItemPlayTime | AchievementItemTaxi | AchievementItemGR6 | AchievementItemDeliver | AchievementItemDuel | AchievementItemBR | AchievementItemRace | AchievementItemBiz | AchievementItemUse | AchievementItemLicense | AchievementItemDocument | AchievementItemFish | AchievementItemVehJack | AchievementItemVehJackLamar | AchievementItemComplete | AchievementItemMeet | AchievementItemBuyHouse | AchievementItemResidentHouse | AchievementItemBeResidentHouse | AchievementItemFlat | AchievementItemVehSell | AchievementItemMove | AchievementItemEvent | AchievementItemNoWork | AchievementItemDrift | AchievementItemCasino | AchievementItemHunt

/** Ключи */
export type UserAchievmentKey = "24hours" | "48hours" | "1hours" | "2hours" | "jobferma" | "jobferma2" | "jobferma3" | "jobbuilder" | "jobbuilder1" | "jobbuilder2" | "jobwash" | "jobwash1" | "jobwash2" | "jobtoni" | "jobtoni1" | "jobtoni2" | "72hours" | "500hours" | "buyhouse" | "buylic" | "buylic1" | "Fishman" | "duelman" | "duelman1" | "freeworkman" | "meet" | "adminevent" | "invitehouse" | "jobmoneyall" | "247magazine" | "buytunning" | "buyweapons" | "winsbattle" | "buyclotches" | "winsplacerace" | "winsrace" | "sellcarsruki" | "sellcarsgos" | "passtaxi" | "drivetaxi" | "drivetruck" | "vzlommachin" | "buylic2" | "otdelkahati" | "otdelkahati1" | "achiev" | "achiev1" | "achiev2" | "duelstemp" | "racetemp" | "healtemp" | "drinktemp" | "eattemp" | "narkotemp" | "247magazinetemp" | "buyclotchestemp" | "buytunningtemp" | "buyaptekatemp" | "buyfueltemp" | "buyprokattemp" | "buytatu" | "modweaponstemp" | "fishtemp" | "worktemp1" | "worktemp2" | "worktemp3" | "worktemp4" | "taxipastemp" | "meettemp" | "vehvzlomtemp" | "jobtimetemp" | "canoiltemp" | "buyweaponstemp" | "buybarbertemp" | "drinkvodkatemp" | "eatnaggtemp" | "eatcheestemp" | "drinkcofetemp" | "drinenergytemp" | "eatappletemp" | "eatbanantemp" | "eatpotfreetemp" | "masfishtemp" | "putinsotragetemp" | "drinkrichtemp" | "drinkvinetemp" | "drinkpivotemp" | "buylic3" | "buylic4" | "buylic5" | "buybarber" | "driftpoint1" | "driftpoint2" | "driftpoint3" | "rouleteCountWins" | "rouleteCountWins100" | "diceWinsCount20" | "diceWinsCount100" | "slotWinsCount20" | "slotWinsCount100" | "rouleteWinsSum2" | "rouleteWinsSum15" | "diceWinsSum2" | "diceWinsSum25" | "slotsWinsSum2" | "slotsWinsSum50" | "usecartpirat" | "usecarttreasures" | "usecartlocman"
/** Список постоянных достижений. Можно добавлять, нельзя удалять */
export const ACHIEVEMENT_LIST:AchievementItem[] = [
    { key: '24hours', name: 'Jucator muncitor', desc: 'joaca 24 de ore si primeste recompensa.', max: 24, reward: { money: 3000 }, type: 'playTime' },
    { key: '48hours', name: 'Rezident', desc: 'joaca 48 de ore si primeste recompensa.', max: 48, reward: { money: 7000 }, type: 'playTime' },
    { key: '72hours', name: 'Experimentat', desc: 'joaca 72 de ore si primeste recompensa.', max: 72, reward: { money: 10000 }, type: 'playTime' },
    { key: '500hours', name: 'X-User', desc: 'joaca 500 de ore si primeste recompensa.', max: 500, reward: { money: 250000 }, type: 'playTime' },
    { key: 'jobferma', name: 'Gradinar incepator', desc: `castiga $${systemUtil.numberFormat(1000)} in gradina.`, max: 1000, reward: { money: 1000 }, type: 'jobmoney', jobId: 'garden' },
    { key: 'jobferma2', name: 'Gradinar avansat', desc: `castiga $${systemUtil.numberFormat(3000)} in gradina.`, max: 3000, reward: { money: 2000 }, type: 'jobmoney', jobId: 'garden' },
    { key: 'jobferma3', name: 'Gradinar cu experienta', desc: `castiga $${systemUtil.numberFormat(6000)} in gradina.`, max: 6000, reward: { money: 3000 }, type: 'jobmoney', jobId: 'garden' },
    { key: 'jobbuilder', name: 'Constructor incepator', desc: `castiga $${systemUtil.numberFormat(1000)} pe santier.`, max: 1000, reward: { money: 1000 }, type: 'jobmoney', jobId: 'builder' },
    { key: 'jobbuilder1', name: 'Constructor avansat', desc: `castiga $${systemUtil.numberFormat(3000)} pe santier.`, max: 3000, reward: { money: 2000 }, type: 'jobmoney', jobId: 'builder' },
    { key: 'jobbuilder2', name: 'Constructor cu experienta', desc: `castiga $${systemUtil.numberFormat(6000)} pe santier.`, max: 6000, reward: { money: 3000 }, type: 'jobmoney', jobId: 'builder' },
    { key: 'jobwash', name: 'Spalator harnic', desc: `castiga $${systemUtil.numberFormat(500)} spaland geamuri.`, max: 500, reward: { money: 1000 }, type: 'jobmoney', jobId: 'cleaning' },
    { key: 'jobwash1', name: 'Spalator nebun', desc: `castiga $${systemUtil.numberFormat(1500)} spaland geamuri.`, max: 1500, reward: { money: 2000 }, type: 'jobmoney', jobId: 'cleaning' },
    { key: 'jobwash2', name: 'Perfectionist', desc: `castiga $${systemUtil.numberFormat(3000)} spaland geamuri.`, max: 3000, reward: { money: 2000 }, type: 'jobmoney', jobId: 'cleaning' },
    { key: 'jobtoni', name: 'Ajutor incepator', desc: `castiga $${systemUtil.numberFormat(3000)} ajutandu-l pe Toni.`, max: 1000, reward: { money: 1000 }, type: 'jobmoney', jobId: 'marihuana' },
    { key: 'jobtoni1', name: 'Ajutor avansat', desc: `castiga $${systemUtil.numberFormat(6000)} ajutandu-l pe Toni.`, max: 3000, reward: { money: 2000 }, type: 'jobmoney', jobId: 'marihuana' },
    { key: 'jobtoni2', name: 'Ajutor cu experienta', desc: `castiga $${systemUtil.numberFormat(12000)} ajutandu-l pe Toni.`, max: 6000, reward: { money: 3000 }, type: 'jobmoney', jobId: 'marihuana' },
    { key: 'buyhouse', name: 'Localnic', desc: 'cumpara o casa.', max: 1, reward: { exp: 2 }, type: 'buyHouse' },
    { key: 'buylic', name: 'Tractiune integrala', desc: 'obtine licenta auto.', max: 1, reward: { exp: 2 }, type: 'giveLicense', license: ['car'] },
    { key: 'buylic1', name: 'Pregatit de pescuit', desc: 'obtine licenta de pescuit.', max: 1, reward: { exp: 2, item: [855] }, type: 'giveLicense', license: ['fishrod'] },
    { key: 'buylic2', name: 'Asigurare ieftina', desc: 'obtine asigurare medicala.', max: 1, reward: { exp: 2, item: [902], money: 500 }, type: 'giveLicense', license: ['med'] },
    { key: 'buylic3', name: 'Baiat periculos', desc: 'obtine licenta de arme.', max: 1, reward: { exp: 2, money: 1500 }, type: 'giveLicense', license: ['weapon'] },
    { key: 'buylic4', name: 'Motociclist', desc: 'obtine licenta moto.', max: 1, reward: { exp: 1, money: 300 }, type: 'giveLicense', license: ['moto'] },
    { key: 'buylic5', name: 'Sofer de camion', desc: 'obtine licenta camion.', max: 1, reward: { exp: 1, money: 3000 }, type: 'giveLicense', license: ['truck'] },
    { key: 'Fishman', name: 'Pescar nebun', desc: `prinde ${systemUtil.numberFormat(2000)} peste.`, max: 2000, reward: { exp: 1, item: [211, 25] }, type: 'fishCount' },
    { key: 'duelman', name: 'Duelist', desc: 'castiga 100 dueluri', max: 100, reward: { money: 10000, exp: 1 }, type: 'duelCount' },
    { key: 'duelman1', name: 'Gloante si bani', desc: `castiga $${systemUtil.numberFormat(100000)} din pariuri in dueluri`, max: 100000, reward: { item: [1102] }, type: 'duelSum' },
    { key: 'freeworkman', name: 'Somer lenes', desc: `castiga $${systemUtil.numberFormat(200000)} din ajutor de somaj`, max: 200000, reward: { money: 10000, item: [2, 24] }, type: 'noWorkMoneySum' },
    { key: 'meet', name: 'Persoana cunoscuta', desc: 'intalneste 100 persoane', max: 100, reward: { money: 5000 }, type: 'newMeet' },
    { key: 'adminevent', name: 'Activist', desc: 'participa la 5 evenimente admin', max: 5, reward: { money: 5000 }, type: 'eventEnter' },
    { key: 'invitehouse', name: 'Gospodar', desc: 'inregistreaza 5 persoane in casa', max: 5, reward: { exp: 2 }, type: 'inviteResident' },
    { key: 'jobmoneyall', name: 'Angajatul lunii', desc: `castiga $${systemUtil.numberFormat(25000)} din joburi de inceput`, max: 25000, reward: { money: 10000, exp: 2 }, type: 'jobmoney' },
    { key: '247magazine', name: 'Consumator', desc: `cheltuie $${systemUtil.numberFormat(100000)} in magazinele 24/7`, max: 100000, reward: { money: 5000, exp: 1 }, type: 'buyShopSum', typeBiz: BUSINESS_TYPE.ITEM_SHOP, subtypeBiz: 0 },
    { key: 'buytunning', name: 'Sofer vitezoman', desc: `cheltuie $${systemUtil.numberFormat(500000)} in ateliere auto`, max: 500000, reward: { item: [865, 815, 817] }, type: 'buyShopSum', typeBiz: BUSINESS_TYPE.TUNING },
    { key: 'buyweapons', name: 'Periculos', desc: `cheltuie $${systemUtil.numberFormat(1000000)} in magazine de arme`, max: 1000000, reward: { item: [532, 1601, 1101, 1102, 1005, 1100] }, type: 'buyShopSum', typeBiz: BUSINESS_TYPE.ITEM_SHOP, subtypeBiz: 2 },
    { key: 'buyclotches', name: 'La moda dar flamand', desc: `cheltuie $${systemUtil.numberFormat(1000000)} in magazine de haine`, max: 1000000, reward: { item: [26], money: 10000, exp: 1 }, type: 'buyShopSum', typeBiz: BUSINESS_TYPE.DRESS_SHOP },
    { key: 'buytatu', name: 'Tatuat', desc: `cheltuie $${systemUtil.numberFormat(50000)} in saloane de tatuaje`, max: 50000, reward: { money: 5000, exp: 1 }, type: 'buyShopSum', typeBiz: BUSINESS_TYPE.TATTOO_SALON },
    { key: 'buybarber', name: 'Ingrijit', desc: `cheltuie $${systemUtil.numberFormat(50000)} in frizerii`, max: 50000, reward: { money: 5000, exp: 1 }, type: 'buyShopSum', typeBiz: BUSINESS_TYPE.BARBER },
    { key: 'winsplacerace', name: 'Vin Diesel', desc: 'ocupa loc fruntas in curse de 100 ori', max: 100, reward: { item: [815], money: 50000, exp: 2 }, type: 'raceWinPLace' },
    { key: 'winsrace', name: 'Schumacher', desc: 'castiga o cursa', max: 1, reward: { item: [815], money: 2000 }, type: 'raceFirst' },
    { key: 'sellcarsruki', name: 'Revanzator', desc: 'vinde 5 masini unui jucator', max: 5, reward: { item: [817, 815], money: 10000 }, type: 'vehSellPlayer' },
    { key: 'sellcarsgos', name: 'Statul are bani', desc: 'vinde 10 masini statului', max: 10, reward: { item: [817] }, type: 'vehSellGos' },
    { key: 'passtaxi', name: 'Pieton beat', desc: 'foloseste taxiul de 100 ori', max: 100, reward: { item: [209, 29], money: 2000, exp: 2 }, type: 'taxiPassengerCount' },
    { key: 'drivetaxi', name: 'Sofer de taxi', desc: 'transporta 100 persoane cu taxiul', max: 100, reward: { item: [817, 815], money: 10000, exp: 1 }, type: 'taxiDriverCount' },
    { key: 'drivetruck', name: 'Sofer de tir', desc: 'transporta 100 incarcaturi', max: 100, reward: { money: 35000 }, type: 'deliverCount' },
    { key: 'vzlommachin', name: 'Hot de masini', desc: 'fura 100 masini pentru Lamar', max: 100, reward: { money: 20000 }, type: 'vehJackLamar' },
    // { key: 'otdelkahati', name: 'Mester incepator', desc: 'Renoveaza un apartament', max: 1, reward: { exp: 2, item: [24, 2] }, type: 'flatCount' },
    // { key: 'otdelkahati1', name: 'Mester cu experienta', desc: 'Renoveaza 10 apartamente', max: 10, reward: { exp: 3, item: [24, 2] }, type: 'flatCount' },
    { key: 'achiev', name: 'Obisnuit', desc: 'finalizeaza 5 realizari', max: 5, reward: { money: 5000, exp: 1 }, type: "achieveComplete", achieve: ["247magazine", "24hours", "48hours", "500hours", "72hours", "Fishman", "adminevent", "buyclotches", "buyhouse", "buylic", "buylic1", "buylic2", "buytunning", "buyweapons", "drivetaxi", "drivetruck", "duelman", "duelman1", "freeworkman", "invitehouse", "jobbuilder", "jobbuilder1", "jobbuilder2", "jobferma", "jobferma2", "jobferma3", "jobmoneyall", "jobtoni", "jobtoni1", "jobtoni2", "jobwash", "jobwash1", "jobwash2", "meet", "otdelkahati", "otdelkahati1", "passtaxi", "sellcarsgos", "sellcarsruki", "vzlommachin", "winsbattle", "winsplacerace", "winsrace", "buytatu", "buylic3", "buylic4", "buylic5", "buybarber", "driftpoint1", "driftpoint2", "driftpoint3"]},
    { key: 'achiev1', name: 'Localnic', desc: 'finalizeaza 20 realizari', max: 20, reward: { money: 7000, exp: 1 }, type: "achieveComplete", achieve: ["247magazine", "24hours", "48hours", "500hours", "72hours", "Fishman", "adminevent", "buyclotches", "buyhouse", "buylic", "buylic1", "buylic2", "buytunning", "buyweapons", "drivetaxi", "drivetruck", "duelman", "duelman1", "freeworkman", "invitehouse", "jobbuilder", "jobbuilder1", "jobbuilder2", "jobferma", "jobferma2", "jobferma3", "jobmoneyall", "jobtoni", "jobtoni1", "jobtoni2", "jobwash", "jobwash1", "jobwash2", "meet", "otdelkahati", "otdelkahati1", "passtaxi", "sellcarsgos", "sellcarsruki", "vzlommachin", "winsbattle", "winsplacerace", "winsrace", "buytatu", "buylic3", "buylic4", "buylic5", "buybarber", "driftpoint1", "driftpoint2", "driftpoint3"]},
    { key: 'achiev2', name: 'Rezident fidel', desc: 'finalizeaza 40 realizari', max: 40, reward: { money: 10000 }, type: "achieveComplete", achieve: ["247magazine", "24hours", "48hours", "500hours", "72hours", "Fishman", "adminevent", "buyclotches", "buyhouse", "buylic", "buylic1", "buylic2", "buytunning", "buyweapons", "drivetaxi", "drivetruck", "duelman", "duelman1", "freeworkman", "invitehouse", "jobbuilder", "jobbuilder1", "jobbuilder2", "jobferma", "jobferma2", "jobferma3", "jobmoneyall", "jobtoni", "jobtoni1", "jobtoni2", "jobwash", "jobwash1", "jobwash2", "meet", "otdelkahati", "otdelkahati1", "passtaxi", "sellcarsgos", "sellcarsruki", "vzlommachin", "winsbattle", "winsplacerace", "winsrace", "buytatu", "buylic3", "buylic4", "buylic5", "buybarber", "driftpoint1", "driftpoint2", "driftpoint3"]},
    { key: 'driftpoint1', name: 'Primul cauciuc uzat', desc: `castiga ${systemUtil.numberFormat(150000)} puncte pe harta drift`, max: 150000, reward: { money: 15000, item: [815, 817] }, type: 'driftPoints' },
    { key: 'driftpoint2', name: 'Driftuitor', desc: `castiga ${systemUtil.numberFormat(500000)} puncte pe harta drift`, max: 500000, reward: { money: 25000, item: [815, 817] }, type: 'driftPoints' },
    { key: 'driftpoint3', name: 'Regele driftului', desc: `castiga ${systemUtil.numberFormat(1000000)} puncte pe harta drift`, max: 1000000, reward: { money: 50000, item: [815, 817] }, type: 'driftPoints' },
    { key: 'rouleteCountWins', name: 'Norocos', desc: 'fa 20 de pariuri castigatoare la ruleta', max: 20, reward: { exp: 2 }, type: 'casinoRouletteWinCount' },
    { key: 'rouleteCountWins100', name: 'Castigator in serie', desc: 'fa 100 de pariuri castigatoare la ruleta', max: 100, reward: { exp: 3 }, type: 'casinoRouletteWinCount' },
    { key: 'diceWinsCount20', name: 'Jucator de zaruri', desc: 'castiga de 20 ori la zaruri', max: 20, reward: { exp: 2 }, type: 'casinoDiceWinCount' },
    { key: 'diceWinsCount100', name: 'Maestru la zaruri', desc: 'castiga de 100 ori la zaruri', max: 100, reward: { exp: 3 }, type: 'casinoDiceWinCount' },
    { key: 'slotWinsCount20', name: 'Noroc la aparate', desc: 'castiga de 20 ori la sloturi', max: 20, reward: { exp: 2 }, type: 'casinoSlotsWinCount' },
    { key: 'slotWinsCount100', name: 'Jucator pasionat', desc: 'castiga de 100 ori la sloturi', max: 100, reward: { exp: 3 }, type: 'casinoSlotsWinCount' },
    { key: 'rouleteWinsSum2', name: 'Negru sau Rosu?', desc: `castiga ${systemUtil.numberFormat(2000)} jetoane la ruleta`, max: 2000, reward: { exp: 2 }, type: 'casinoRouletteWinSum' },
    { key: 'rouleteWinsSum15', name: 'Negru sau Rosu?', desc: `castiga ${systemUtil.numberFormat(15000)} jetoane la ruleta`, max: 15000, reward: { exp: 3 }, type: 'casinoRouletteWinSum' },
    { key: 'diceWinsSum2', name: 'Zaruri', desc: `castiga ${systemUtil.numberFormat(2000)} jetoane la zaruri`, max: 2000, reward: { exp: 2 }, type: 'casinoDiceWinSum' },
    { key: 'diceWinsSum25', name: 'Zaruri', desc: `castiga ${systemUtil.numberFormat(25000)} jetoane la zaruri`, max: 25000, reward: { exp: 3 }, type: 'casinoDiceWinSum' },
    { key: 'slotsWinsSum2', name: 'Sloturi', desc: `castiga ${systemUtil.numberFormat(2000)} jetoane la aparate`, max: 2000, reward: { exp: 2 }, type: 'casinoSlotsWinSum' },
    { key: 'slotsWinsSum50', name: 'Sloturi', desc: `castiga ${systemUtil.numberFormat(50000)} jetoane la aparate`, max: 50000, reward: { exp: 3 }, type: 'casinoSlotsWinSum' },
    // Для дайвинга
    // { key: 'usecartpirat', name: 'Colecteaza harta piratilor', desc: 'Foloseste harta piratilor', max: 1, reward: { money: 20000 }, type: 'useItem', item_id: [6526] },
    // { key: 'usecarttreasures', name: 'Colecteaza harta comorilor', desc: 'Foloseste harta comorilor', max: 1, reward: { money: 50000 }, type: 'useItem', item_id: [6527] },
    // { key: 'usecartlocman', name: 'Colecteaza harta marinarului', desc: 'Foloseste harta marinarului', max: 1, reward: { money: 100000 }, type: 'useItem', item_id: [6528] },
]

/** Список ежедневных достижений. Можно добавлять, нельзя удалять */
export const ACHIEVEMENT_TEMP_LIST:AchievementItem[] = [
    { key: '1hours', name: '1 ora online', desc: 'joaca 1 ora si primeste recompensa.', max: 1, reward: { money: 250, item: [1] }, type: 'playTime' },
    { key: '2hours', name: '2 ore online', desc: 'joaca 2 ore si primeste recompensa.', max: 2, reward: { money: 500, item: [21] }, type: 'playTime' },
    { key: '3hours', name: '3 ore online', desc: 'joaca 3 ore si primeste recompensa.', max: 3, reward: { money: 1500, item: [21] }, type: 'playTime' },
    { key: 'duelstemp', name: 'Duelist temporar', desc: 'castiga 5 dueluri', max: 5, reward: { money: 1000, item: [1] }, type: 'duelCount' },
    { key: 'racetemp', name: 'Sofer temporar', desc: 'ocupa un loc pe podium intr-o cursa', max: 1, reward: { money: 1000, item: [21] }, type: 'raceWinPLace' },
    { key: 'healtemp', name: 'Sanatate buna', desc: 'foloseste un medkit', max: 1, reward: { money: 150, item: [1] }, type: 'useItem', item_id: [902] },
    { key: 'drinktemp', name: 'Un strop de foc', desc: 'bea o sticla de whisky', max: 1, reward: { money: 150, item: [21] }, type: 'useItem', item_id: [209] },
    { key: 'eattemp', name: 'Pofticios', desc: 'mananca o pizza sau bea o cola', max: 1, reward: { money: 150, item: [1] }, type: 'useItem', item_id: [24, 2] },
    { key: 'narkotemp', name: 'Yoga dimineata, drum seara', desc: 'consuma cocaina', max: 1, reward: { money: 200, item: [21] }, type: 'useItem', item_id: [54] },
    { key: '247magazinetemp', name: 'Shopaholic', desc: `cheltuie $${systemUtil.numberFormat(1000)} in magazinele 24/7`, max: 1000, reward: { money: 400, item: [1] }, type: 'buyShopSum', typeBiz: BUSINESS_TYPE.ITEM_SHOP, subtypeBiz: 0 },
    { key: 'buyclotchestemp', name: 'Noua tinuta', desc: `cheltuie $${systemUtil.numberFormat(5000)} in magazine de haine`, max: 5000, reward: { money: 1000, item: [21] }, type: 'buyShopSum', typeBiz: BUSINESS_TYPE.DRESS_SHOP },
    { key: 'buytunningtemp', name: 'Polisare perfecta', desc: `cheltuie $${systemUtil.numberFormat(500)} in atelierul auto`, max: 500, reward: { item: [815] }, type: 'buyShopSum', typeBiz: BUSINESS_TYPE.TUNING },
    { key: 'buyaptekatemp', name: 'Pensionar in devenire', desc: `cheltuie $${systemUtil.numberFormat(2000)} in farmacie`, max: 2000, reward: { item: [902], money: 500 }, type: 'buyShopSum', typeBiz: BUSINESS_TYPE.ITEM_SHOP, subtypeBiz: 3 },
    { key: 'buyfueltemp', name: 'Mi-e sete de benzina', desc: `cheltuie $${systemUtil.numberFormat(500)} pe carburant`, max: 500, reward: { item: [817], money: 100 }, type: 'buyShopSum', typeBiz: BUSINESS_TYPE.FUEL, subtypeBiz: 0 },
    { key: 'buyprokattemp', name: 'Fara responsabilitate', desc: `cheltuie $${systemUtil.numberFormat(100)} pentru a inchiria un vehicul`, max: 100, reward: { money: 50, item: [1] }, type: 'buyShopSum', typeBiz: BUSINESS_TYPE.VEHICLE_SHOP, subtypeBiz: 0 },
    { key: 'modweaponstemp', name: 'Pistol gol', desc: 'monteaza o modificare pe o arma', max: 1, reward: { money: 500 }, type: 'itemMove', owner_types: [23] },
    { key: 'fishtemp1', name: 'Pescar incepator', desc: 'prinde 10 pesti', max: 10, reward: { money: 1000 }, type: 'fishCount' },
    { key: 'fishtemp2', name: 'Pescar activ', desc: 'prinde 20 pesti', max: 20, reward: { money: 1500 }, type: 'fishCount' },
    // { key: 'worktemp1', name: 'Cuie prajite', desc: `Castiga $${systemUtil.numberFormat(500)} pe santier`, max: 500, reward: { money: 500 }, type: 'jobmoney', jobId: 'builder' },
    { key: 'worktemp2', name: 'Corn si copita', desc: `castiga $${systemUtil.numberFormat(500)} in gradina`, max: 500, reward: { money: 500 }, type: 'jobmoney', jobId: 'garden' },
    { key: 'worktemp3', name: 'Spalatorul', desc: `castiga $${systemUtil.numberFormat(500)} spaland geamuri`, max: 500, reward: { money: 500 }, type: 'jobmoney', jobId: 'cleaning' },
    { key: 'worktemp4', name: 'Fumeaza zilnic', desc: `castiga $${systemUtil.numberFormat(500)} ajutand in garajul lui Toni`, max: 500, reward: { money: 500 }, type: 'jobmoney', jobId: 'marihuana' },
    { key: 'taxipastemp', name: 'Plecare in apus', desc: 'foloseste taxiul o data', max: 1, reward: { money: 250 }, type: 'taxiPassengerCount' },
    { key: 'meettemp', name: 'Mana calda', desc: 'cunoaste o persoana', max: 1, reward: { item: [7] }, type: 'newMeet' },
    { key: 'vehvzlomtemp1', name: 'Prieten cu surubelnita', desc: 'sparge o masina', max: 1, reward: { money: 500 }, type: 'vehJack' },
    { key: 'vehvzlomtemp2', name: 'Prieten cu lockpick', desc: 'sparge 3 masini', max: 3, reward: { money: 1500 }, type: 'vehJack' },
    { key: 'jobtimetemp', name: 'Alergare matinala', desc: `castiga $${systemUtil.numberFormat(500)} din joburi de inceput`, max: 500, reward: { money: 250 }, type: 'jobmoney' },
    { key: 'canoiltemp', name: 'Canistra parfumata', desc: 'alimenteaza masina cu o canistra', max: 1, reward: { money: 250, item: [817] }, type: 'useItem', item_id: [817] },
    { key: 'buyweaponstemp', name: 'Trecator periculos', desc: `cheltuie $${systemUtil.numberFormat(1000)} in magazinul de arme`, max: 1000, reward: { item: [206] }, type: 'buyShopSum', typeBiz: BUSINESS_TYPE.ITEM_SHOP, subtypeBiz: 2 },
    { key: 'buybarbertemp', name: 'Frizerul Zverev', desc: `cheltuie $${systemUtil.numberFormat(1000)} la frizerie`, max: 1000, reward: { money: 500 }, type: 'buyShopSum', typeBiz: BUSINESS_TYPE.BARBER },
    { key: 'drinkvodkatemp', name: 'Baiatu, adu-ne vodca', desc: 'bea o sticla de vodca', max: 1, reward: { money: 250 }, type: 'useItem', item_id: [211] },
    { key: 'eatnaggtemp', name: 'Printul nuggetsilor', desc: 'mananca 20 nuggets', max: 20, reward: { money: 150 }, type: 'useItem', item_id: [27] },
    { key: 'eatcheestemp', name: 'Visul american', desc: 'mananca 10 cheeseburgeri deodata', max: 10, reward: { money: 1200 }, type: 'useItem', item_id: [20] },
    { key: 'drinkcofetemp', name: 'Insomnie fermecatoare', desc: 'bea 8 cafele', max: 8, reward: { money: 1000 }, type: 'useItem', item_id: [5] },
    { key: 'drinenergytemp', name: 'Baterie umana', desc: 'bea 5 energizante', max: 5, reward: { money: 600 }, type: 'useItem', item_id: [7] },
    { key: 'eatappletemp', name: 'Fructul interzis', desc: 'mananca un mar', max: 1, reward: { money: 100 }, type: 'useItem', item_id: [28] },
    { key: 'eatbanantemp', name: 'Australopitec', desc: 'mananca 20 banane', max: 20, reward: { money: 1000 }, type: 'useItem', item_id: [25] },
    { key: 'eatpotfreetemp', name: 'Gandac de balegar', desc: 'mananca cartofi prajiti', max: 1, reward: { money: 150 }, type: 'useItem', item_id: [22] },
    { key: 'masfishtemp', name: 'Maestru in pescuit', desc: 'prinde 20 pesti', max: 20, reward: { money: 1000 }, type: 'fishCount' },
    { key: 'putinsotragetemp', name: 'Fa o ascunzatoare', desc: 'muta un obiect in orice loc', max: 1, reward: { item: [1] }, type: 'itemMove' },
    { key: 'drinkrichtemp', name: 'Puternic si matur', desc: 'bea 5 sticle de coniac, whisky sau bourbon', max: 5, reward: { money: 1000 }, type: 'useItem', item_id: [209, 210, 215] },
    { key: 'drinkvinetemp', name: 'Somelier ametit', desc: 'bea 3 sticle de vin', max: 3, reward: { money: 1500 }, type: 'useItem', item_id: [212, 213, 214] },
    { key: 'drinkpivotemp', name: 'Romantic al berii', desc: 'bea 8 sticle de bere', max: 8, reward: { money: 2000 }, type: 'useItem', item_id: [201, 202, 203, 204, 205, 206, 207, 208] },
]

export const getAchievConfigBiz = (typeBiz: BUSINESS_TYPE, subtypeBiz:number) => {
    return ACHIEVEMENT_LIST.filter(q => q.type === "buyShopSum" && (!q.typeBiz || q.typeBiz == typeBiz) && (!q.subtypeBiz || q.subtypeBiz == subtypeBiz)) as AchievementItemBiz[]
}

export const getAchievConfig = (key: UserAchievmentKey) => {
    return ACHIEVEMENT_LIST.find(q => q.key === key);
}
export const getTempAchievConfig = (key: UserAchievmentKey) => {
    return ACHIEVEMENT_TEMP_LIST.find(q => q.key === key);
}
export const getAchievConfigByType = (type: typeof ACHIEVEMENT_LIST[number]["type"]):AchievementItem[] => {
    return ACHIEVEMENT_LIST.filter(q => q.type === type);
}
export const getTempAchievConfigByType = (type: typeof ACHIEVEMENT_LIST[number]["type"]):AchievementItem[] => {
    return ACHIEVEMENT_LIST.filter(q => q.type === type);
}