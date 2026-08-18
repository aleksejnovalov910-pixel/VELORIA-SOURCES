import { langStringDefault } from "./lang/index";
/** На сколько настроен таймер */
export const ILL_SYSTEM_STEP = 5;

/** Через сколько дней по умолчанию продукт считается испорченым */
export const POISONING_DAYS = 2;
/** Шанс отравится за каждый день просрочки. */
export const POISONING_CHANCE_PER_DAY = 40;

export type IllId = "narko" | "alco" | "food"
interface illItem {
    id: IllId
    /** Название */
    name: string;
    /** Максимальное значение */
    max: number;
    /** Критическое значение. При его достижении болезнь/зависимость сама будет увеличиватся */
    critical: number;
    /** На сколько будет уменьшаться болезнь/зависимость раз в {ILL_SYSTEM_STEP} минут до критической отметки самостоятельно. */
    step: number;
    /** На сколько будет расти болезнь/зависимость раз в {ILL_SYSTEM_STEP} минут после критической отметки самостоятельно. */
    step_critical: number;
    /** Сколько HP отнимать раз в 5 минут. Всего у игрока 100 HP. Не будет отниматся пока игрок в наручниках, в МП и прочих системных штуках */
    hp: number;
    /** Таблетки (ИД предмета), которые может снижать параметр заболевания. Если не указать - то лечить сможет только врач (наверно) */
    healItem?: number;
    /** Сколько единиц заболевания будет снижатся за один приём препарата */
    healItemMultiple?: number;
    /** Стоимость лечения у медика за одну единицу. Он за один присест полностью убирает болезнь.*/
    healByMedicCostPerOne:number;
    /** Шанс того, что человек может траванутся */
    chance?:number;
}
/** База данных всех болезней */
export const illData: illItem[] = [
    { id: "narko", name: langStringDefault("ill.76a2e0dcf47e6b1b453f239969676cd2"), max: 1000, critical: 700, step: 5, healItem:903, step_critical: 30, hp: 10, healByMedicCostPerOne: 20 },
    { id: "alco", name: langStringDefault("ill.7326341b07002f24f4fca843099a7ca2"), max: 1000, critical: 700, step: 10, step_critical: 20, hp: 5, healItem: 900, healItemMultiple: 100, healByMedicCostPerOne: 10 },
    { id: "food", chance: 5, name: langStringDefault("ill.1b4604736f1d927a438720addc582b9c"), max: 1000, critical: 700, step: 10, step_critical: 20, hp: 5, healItem: 909, healItemMultiple: 100, healByMedicCostPerOne: 10 },
]
/** Местоположение маркера где медик сможет лечить игрока */
export const HEAL_MEDIC_POSITION = [
    // Los Santos
    new mp.Vector3(359.59, -585.29, 43.26),
    // Paleto Bay
    new mp.Vector3(-248.21, 6315.83, 31.43)
];
/** Какой таймер использования препарата в минутах. */
export const PILL_USE_TIMER = 5;

export const getIllConfig = (ill: IllId) => {
    return illData.find(q => q.id === ill);
}
