import { langStringDefault } from "../lang/index";
export interface DivingAchievementClothesItem {
    dressMaleCfg: number,
    dressFemaleCfg: number,
    variation: number,
    item_id: number,
    serial: string
}

// 1 карта - пиратская шляпа

export const DIVING_FIRST_MAP_ITEM: DivingAchievementClothesItem = {
    dressMaleCfg: 2698,
    dressFemaleCfg: 2695,
    variation: 7,
    item_id: 954,
    serial: langStringDefault("diving.achievement.config.47a62d717705d2b6a4c290112c31feb9")
}

// 2 карта - трубка

export const DIVING_SECOND_MAP_ITEM: DivingAchievementClothesItem = {
    dressMaleCfg: 2697,
    dressFemaleCfg: 2694,
    variation: 7,
    item_id: 958,
    serial: langStringDefault("diving.achievement.config.0ac3932a54374cfbcfa4195ca5b85051")
}

// 3 карта - попугай

export const DIVING_THIRD_MAP_ITEM: DivingAchievementClothesItem = {
    dressMaleCfg: 2699,
    dressFemaleCfg: 2696,
    variation: 7,
    item_id: 958,
    serial: langStringDefault("diving.achievement.config.39233275c02a69545a5747226bb19aac")
}