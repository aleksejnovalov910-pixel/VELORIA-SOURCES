import { langStringDefault } from "./lang/index";
interface AdminItem {
    /** Уровень админки */
    level: number;
    /** Название роли */
    name: string;
    /** Бонус к пейдею */
    money: number;
    /** Бонус к пейдею в виде донат валюты */
    donate_money?: number;
}
export const ADMIN_DATA: AdminItem[] = [
    {level: 1, name: langStringDefault("admin.data.fe54ef70f503f676cf509c7d12f0c9e1"), money: 500},
    {level: 2, name: langStringDefault("admin.data.fc3ff7d9d1d90e6e9091638ee5993eb9"), money: 1000},
    {level: 3, name: langStringDefault("admin.data.cf2c4e4ea96eaf8e8eb887ddd9b47d5f"), money: 1500},
    {level: 4, name: langStringDefault("admin.data.072bf22a8b600a97f93333fdfedea183"), money: 2000},
    {level: 5, name: langStringDefault("admin.data.868c2f3a7618927b5dc685ce447e6e6b"), money: 2500},
    {level: 6, name: langStringDefault("admin.data.b6ac76d967c79212eafb43ad1a27854c"), money: 3000},
    {level: 7, name: langStringDefault("admin.data.63eac707cddb2164e56cb748a0e8ddea"), money: 4000}
]

/** PayDay-Helfer-Gehalt */
export const HELPER_PAYDAY_MONEY = [
    150,
    300,
    500,
]

export const enum REWARD_ADMIN_POINTS {
    CLOSE_TICKET = 1,
    MESSAGE_TICKET = 0,
    KICK = 1,
    JAIL = 2,
    WARN = 5,
    BAN = 5,
    CMUTE = 2,
    VMUTE = 2,
}

export interface AdminStatsData extends AdminStatsDataBase, AdminStatsDataTasks {}
export interface HelperStatsData extends AdminStatsDataBase, HelperStatsDataTasks {}

export interface AdminStatsDataTasks {
    kick: number,
    jail: number,
    warn: number,
    ban: number,
    cmute: number,
    vmute: number,
    close: number,
    message: number,
}
export interface HelperStatsDataTasks {
    close: number,
    message: number,
}

export interface AdminStatsDataBase {
    id: number,
    points: number,
}