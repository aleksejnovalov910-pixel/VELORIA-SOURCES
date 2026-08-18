import { langStringDefault } from "../lang/index";
export enum FRACTION_RIGHTS {
    CHANGE_RANKS,
    WARNS,
    KICK,
    MONEY,
    STORAGE,
    VEHICLES,
    AWARDS,
    DOORS,
    INVITE,
    DEPARTMENT,
    GOVERNMENT,
    BACK_CAR,
    BIZWAR
}

export const ALL_FRACTION_RIGHTS = [
    FRACTION_RIGHTS.CHANGE_RANKS,
    FRACTION_RIGHTS.WARNS,
    FRACTION_RIGHTS.KICK,
    FRACTION_RIGHTS.MONEY,
    FRACTION_RIGHTS.STORAGE,
    FRACTION_RIGHTS.VEHICLES,
    FRACTION_RIGHTS.AWARDS,
    FRACTION_RIGHTS.DOORS,
    FRACTION_RIGHTS.INVITE,
    FRACTION_RIGHTS.DEPARTMENT,
    FRACTION_RIGHTS.GOVERNMENT,
    FRACTION_RIGHTS.BACK_CAR,
    FRACTION_RIGHTS.BIZWAR
]

export const GOV_RIGHTS = [
    FRACTION_RIGHTS.DEPARTMENT,
    FRACTION_RIGHTS.GOVERNMENT
]

export const MAFIA_RIGHTS = [
    FRACTION_RIGHTS.BIZWAR
]

export function getRightName(right: FRACTION_RIGHTS) {
    if (right === FRACTION_RIGHTS.CHANGE_RANKS) {
        return langStringDefault("fractions.ranks.f297e6b022e1ecc424864af0e053d5dd");
    }

    if (right === FRACTION_RIGHTS.WARNS) {
        return langStringDefault("fractions.ranks.a89da4d17a724d48414bdd36a224dd46");
    }

    if (right === FRACTION_RIGHTS.KICK) {
        return langStringDefault("fractions.ranks.2b5324faa25e068c66cee1eb57a23d57");
    }

    if (right === FRACTION_RIGHTS.MONEY) {
        return langStringDefault("fractions.ranks.20d045375dc37bf898d1a3863eecd9a8");
    }

    if (right === FRACTION_RIGHTS.STORAGE) {
        return langStringDefault("fractions.ranks.6a9d93c1f658c08e696c9ed92ed396ed");
    }

    if (right === FRACTION_RIGHTS.VEHICLES) {
        return langStringDefault("fractions.ranks.219665971623a8fdd64adafff6e18e04");
    }

    if (right === FRACTION_RIGHTS.AWARDS) {
        return langStringDefault("fractions.ranks.6e73c436a1dbf2d236eafc11fe4986ad");
    }

    if (right === FRACTION_RIGHTS.DOORS) {
        return langStringDefault("fractions.ranks.cd3adb24cc1b8c4b964b465fa1cb15d7");
    }

    if (right === FRACTION_RIGHTS.INVITE) {
        return langStringDefault("fractions.ranks.1cf7a5a4de49900859b06ea55e3b2399")
    }

    if (right === FRACTION_RIGHTS.DEPARTMENT) {
        return langStringDefault("fractions.ranks.f93651edafbbb65dcf589d5d0bd16bad");
    }

    if (right === FRACTION_RIGHTS.GOVERNMENT) {
        return langStringDefault("fractions.ranks.95f01f25605f15d7c8348a0cec49c497");
    }

    if (right === FRACTION_RIGHTS.BACK_CAR) {
        return langStringDefault("fractions.ranks.465ecfdb44448dab38056c0500ed1a06");
    }

    if (right === FRACTION_RIGHTS.BIZWAR) {
        return langStringDefault("fractions.ranks.d3b55674e1d92656161b57d3fe6f5e27");
    }
}

export interface IFractionRank {
    name: string
    salary: number
    award: number
    rights: FRACTION_RIGHTS[]
    isLeader?: boolean
}

export interface IFractionMemberDTO {
    id: number
    name: string
    rank: number
    warns: number
    tag: string
    lastSeen: number
    tracker: boolean
    tracking?: boolean
}

export interface IFractionGarageDTO {
    id: number
    cars: [string, string, number, number, number, number, number, number, number, number, number][]
}

export interface IFractionStorageDTO {
    id: number
    items: [number, number, number][]
}

export interface IFractionStorageLog {
    who: string
    time: number
    text: string
}

export interface IFractionData {
    id: number;
    members: IFractionMemberDTO[],
    messages: { name: string, id: number, time: number, text: string }[],
    alerts?: { id: number, actual:boolean, name: string, text:string, timestamp: number, type: number, callAnswered?: string, code?: number, isGlobal: boolean, pos: [number, number]}[],
    playerPosition: {x: number, y: number, z: number, h: number, d: number},
    mafiabiz?: { id: number, name: string, price: number, type: number, stype: number}[]
}