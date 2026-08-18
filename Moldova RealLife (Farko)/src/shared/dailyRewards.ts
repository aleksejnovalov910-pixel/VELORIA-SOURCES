export const REQUIRED_PLAY_TIME = 0.1 * 60 * 60; // 3 hours in seconds
export const RESET_HOUR = 0; // Reset hour (20:00)
export const MAX_DAYS = 30; // Maximum number of days

export enum RewardType {
  MONEY,
  COINS,
  VIP,
  PLAYTIME,
  CUSTOM_BAG,
  DISCOUNT_SHOWROOM,
  DISCOUNT_SHOP,
  DISCOUNT_CLOTHES,
  EXP_BONUS,
  VEHICLE,
}

export interface DailyRewardInfo {
  type: RewardType;
  value: number | string;
  amount?: number;
  days?: number;
  discount?: number;
  title: string;
  image?: string; // <-- Adaugat aicib
}

export const DAILY_REWARDS: { [day: number]: DailyRewardInfo } = {
  1: { type: RewardType.MONEY, value: 3000, title: "3000$", image: "day1" },
  2: { type: RewardType.COINS, value: 2, title: "2 SC", image: "day4" },
  3: { type: RewardType.MONEY, value: 9000, title: "9000$", image: "day1" },
  4: { type: RewardType.COINS, value: 3, title: "3 SC", image: "day4" },
  // 5: { type: RewardType.PLAYTIME, value: 7 * 60, title: "+7 ore jucate", image: "day5" },
  5: {
    type: RewardType.PLAYTIME,
    value: 7 * 60,
    title: "+7 ore jucate",
    image: "day5",
  },

  6: { type: RewardType.MONEY, value: 10000, title: "10000$", image: "day1" },
  7: {
    type: RewardType.VIP,
    value: "Diamond",
    days: 2,
    title: "2 zile",
    image: "day6",
  },
  8: { type: RewardType.COINS, value: 5, title: "5 SC", image: "day4" },
  9: {
    type: RewardType.DISCOUNT_SHOWROOM,
    value: 40000,
    discount: 10,
    title: "Reducere in showroom",
    image: "day7",
  }, // 10% discount
  10: { type: RewardType.COINS, value: 3, title: "3 SC", image: "day4" },
  11: {
    type: RewardType.DISCOUNT_SHOP,
    value: 40002,
    discount: 25,
    title: "Reducere in magazin",
    image: "magazin",
  }, // 25% discount
  12: { type: RewardType.MONEY, value: 4000, title: "4000$", image: "day1" },
  13: {
    type: RewardType.PLAYTIME,
    value: 10 * 3600,
    title: "+10 ore jucate",
    image: "day5",
  },
  14: {
    type: RewardType.VIP,
    value: "Diamond",
    days: 5,
    title: "5 zile",
    image: "day6",
  },
  15: { type: RewardType.MONEY, value: 5000, title: "5000$", image: "day1" },
  16: { type: RewardType.COINS, value: 2, title: "2 SC", image: "day4" },
  17: {
    type: RewardType.CUSTOM_BAG,
    value: 2008,
    title: "Ghiozdan",
    image: "day2",
  },
  18: { type: RewardType.MONEY, value: 6000, title: "6000$", image: "day1" },
  19: { type: RewardType.COINS, value: 2, title: "2 SC", image: "day4" },
  20: {
    type: RewardType.PLAYTIME,
    value: 5 * 3600,
    title: "+ 5 ore jucate",
    image: "day5",
  },
  21: { type: RewardType.MONEY, value: 7000, title: "7000$", image: "day1" },
  22: { type: RewardType.COINS, value: 4, title: "4 SC", image: "day4" },
  23: {
    type: RewardType.DISCOUNT_CLOTHES,
    value: 40001,
    discount: 25,
    title: "Reducere in magazin inbracaminte",
    image: "hainedisc",
  },
  24: { type: RewardType.MONEY, value: 8000, title: "8000$", image: "day1" },
  25: {
    type: RewardType.VIP,
    value: "Diamond",
    days: 3,
    title: "3 zile",
    image: "day6",
  },
  26: { type: RewardType.COINS, value: 10, title: "10 SC", image: "day4" },
  27: { type: RewardType.MONEY, value: 10000, title: "10000$", image: "day1" },
  28: {
    type: RewardType.DISCOUNT_SHOP,
    value: 40001,
    discount: 25,
    title: "Reducere in magazin",
    image: "magazin",
  },
  29: { type: RewardType.COINS, value: 5, title: "5 SC", image: "day4" },
  30: {
    type: RewardType.VEHICLE,
    value: "giulia",
    title: "Giulia",
    image: "giulia",
  },
};
