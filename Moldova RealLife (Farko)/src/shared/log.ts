import { langStringDefault } from "./lang/index";
export type FileLogType =
    "fractionChest"
    | "PlayerKill"
    | "PlayerDeath"
    | "PlayerJoin"
    | "PlayerLeave"
    | "codeInjection"
    | "anticheat"
    | "AdminJob"
    | "PlayerBuy"
    | "news"
    | "warningLog"
    | "errorLog"
    | "addCrypto"
    | "removeCrypto"
    | "addMoney"
    | "removeMoney"
    | "addChips"
    | "removeChips"
    | "addBankMoney"
    | "removeBankMoney"
    | "gosJob"
    | "fpsDebug"
    | "fractionKick"
    | "fractionInvite"
    | "fractionRank"
    | "AdminBan"
    | "DonateMoney"
    | "familyInvite"
    | "Jajplayer"
    | "famAction"
    | "exchange"
    | "candiesAdd"
    | "lollipops"
    | "diving"
    | "houses"
    | "tabletFraction"
    | "dailyReward"

export type FamilyLogType =
    "intoFamily"
    | "leaveFamily"
    | "addDonate"
    | "removeDonate"
    | "addMoney"
    | "removeMoney"
    | "addCargo"
    | "removeCargo"
    | "addPoints"
    | "removePoints"


export const logTypesList: [FileLogType, string][] = [
    ["codeInjection", "CodeInjection"],
    ["anticheat", langStringDefault("log.84b7240ad2d75b0b0ded5e0178d5d706")],
    ["AdminJob", langStringDefault("log.9208daff304dee74d104dc5c4fd66ac9")],
    ["AdminBan", langStringDefault("log.ffc976d4268e6cdcf4cbb6669edadfca")],
    ["PlayerBuy", langStringDefault("log.3d145ba24314ecc8b2b86f4c5de89464")],
    ["PlayerKill", langStringDefault("log.9d96a7dbf3184f1dd5e640a5a64f9448")],
    ["PlayerDeath", langStringDefault("log.b50d87a73719a20162ca88ecd4d7c0c4")],
    ["news", langStringDefault("log.0d4ff8048439fa83a2c551ef2c1ee907")],
    ["news", langStringDefault("log.fa84e8b54bbfc7ec9a37e041bd7e9ac3")],
    ["addMoney", langStringDefault("log.67198bbededc8427483a4ca74ec205db")],
    ["removeMoney", langStringDefault("log.c00b2d99c87f9f70828e540d9791b249")],
    ["addChips", langStringDefault("log.e9af0876d7a75eba5df8fc2200be8860")],
    ["removeChips", langStringDefault("log.c0cad53085a658680e2837f8ae67785e")],
    ["addBankMoney", langStringDefault("log.40ecc85fc0450e6230f1ca56e53b90fd")],
    ["removeBankMoney", langStringDefault("log.a698bff1750bb856b0d29e36ee3740a0")],
    ["gosJob", langStringDefault("log.eee99f0b189849a6cfae8626d7c07a04")],
    ["fpsDebug", langStringDefault("log.98058ac7768ba21e5ecbf203f48f5a75")],
    ["fractionKick", langStringDefault("log.ce7261dbcf1d3cb8a3fe94b7d19d46f0")],
    ["fractionInvite", langStringDefault("log.59e60a7c4006f051dad70b3d191823f2")],
    ["fractionRank", langStringDefault("log.e534032d768770423602bb14324fb657")],
    ["PlayerJoin", langStringDefault("log.c9a8bb717b952dc9b48e82529b3bee07")],
    ["PlayerLeave", langStringDefault("log.ff644c0d148f8aa88aca068201732130")],
    ["fractionChest", langStringDefault("log.c160f9cbab2d9f0cb9c0febd4e833ea9")],
    ["DonateMoney", langStringDefault("log.9c9eb52cde6b7453645bb811bf2d4f07")]
]

export const getLogTypeName = (id: FileLogType) => {
    return logTypesList.find(q => q[0] === id) ? logTypesList.find(q => q[0] === id)[1] : "!!!ОШИБКА!!!"
}

export const AdminStatsLog = 4
export const HelperStatsLog = 3
export const LogAccessLevel = 2
export const addBlackList = 5

export interface MyData {
    id: number;
    level: number;
    online: boolean;
    name: string;
}

export interface FetchedData {
    regToday: number;
    authToday: number;
    regYesterday: number;
    authYesterday: number;
    serverData: ServerData;
}

export interface ServerData { online: number, maxplayers: number, masterposition: number, allservers: number, peak: number, name: string }


export const logDomain = "panel.vipuri-rp.ro";

export interface UserTableData {
    id: number;
    online: number;
    rp_name: string;
    money: number;
    bank: number;
    bank_number: string;
    admin: number;
    helper: number;
    fraction: number;
    rank: number;
    register: number;
    enter: number;
    vip_status: string;
    vip_time: number;
}
export interface UserData extends UserTableData {
    played_time: number;
    lic: string;
    social: string;
    social_register: string;
    ip_reg: string;
    ip_last: string;
    donate: number | null;
    register: number;
    enter: number;
    date_ban: number;
    account: number;
}

export interface AdminItem {
    id: number;
    lvl: number;
    name: string;
    online: boolean;
    reports: number;
    played_time: number;
}


export interface LogItem {
    id: number;
    type: FileLogType;
    time: number;
    target?: number;
    userId: number;
    text: string;
}
export interface TradeLogItem {
    id: number;
    user_id: number;
    action: string;
    price: number;
    coins_before: number;
    coins_after: number;
    datetime: string;
}
export interface UnitPayLogItem {
    id: number;
    unitpay_id: number;
    account: number;
    sum: number;
    create_time: number;
    complete_time: number;
    status: number;
}


export interface BlackListData {
    id: number;
    steam?: string;
    lic?: string;
    guid: string;
    rgscId: bigint;
    reason: string;
}