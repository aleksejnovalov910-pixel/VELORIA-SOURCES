import { langStringDefault } from "./lang/index";
import {jobsList} from "./jobs";
import {ORDER_MENU_POS} from "./order.system";
import {GR6_BASE_POS} from "./gr6";
import {npcGrabCarSetting} from "./vehicles";
import {RACE_REGISTER_POS} from "./race";
import {DUELS_REGISTER_POS} from "./duels";
import {FINE_AIR_POS, FINE_CAR_POS} from "./fine.car";
import {TAXI_CONF} from "./taxi";
import {CONSTRUCTION_REGISTER_POS} from "./construction";
import {DRIFT_MAP_EXIT} from "./drift";

export interface Contact {
    groupName: string;
    contactId?: number;
    contactName?: string;
    contactNumber?: number;
}

export interface IPhoneMessengerDialogDTO {
    contactName: string,
    lastMessage: string,
    unreadMessages: boolean,
    time: number
    number: number
}

export interface IPhoneMessengerMessageDTO {
    text: string
    sender: number
    target: number
    time: number
    read: boolean
    gps: [number, number]
}

export interface PhoneSettings {
    /** Звуковые оповещения при СМС */
    sound?: boolean;
    /** Авиарежим */
    aviamode?: boolean;
    /** Тёмный цветовой режим */
    dark?: boolean;
    /** Увеличеный режим */
    big?: boolean;
    /** Уменьшать если курсор не в телефоне */
    minimize?: boolean;
    /** Фоновое изображение */
    background?: string;
}

export interface PhoneHistory {
    number: number;
    type: "fromme" | "tome" | "frommeC" | "tomeC" | "tommeMissed";
    time: string;
    count: number;
}[]

export interface BankingHistoryItem { id: number, text: string, type: "remove" | "add" | "reject", sum: number, time: number, target: string, ticket: string }


export const PHONE_GPS_STATIC = [
    {
        name: langStringDefault("phone.4b32983d9c77f62a2a071f710b68e87b"),
        id: "jobs",
        cats: [
            {
                name: langStringDefault("phone.fc64b098a20bbb66ac30273686c08a09"), items: jobsList.map(q => {
                    return [q.name, q.pos.x, q.pos.y, q.pos.z]
                })
            },
            {
                name: langStringDefault("phone.76bb2b552f032e374009ee397f678489"), items: [
                    ...ORDER_MENU_POS.map((item, index) => {
                      return [langStringDefault("phone.1a89b4a40b721ee3062133e8296ed040", index+1), item.x, item.y, item.z]
                    }),
                    [langStringDefault("phone.97fb16766754b3d8fd4bb00da5f40eb2"), GR6_BASE_POS.x, GR6_BASE_POS.y, GR6_BASE_POS.z],
                    [langStringDefault("phone.8614efe83a0e47b7e17e217fed205b6d"), npcGrabCarSetting.npcPos.x, npcGrabCarSetting.npcPos.y, npcGrabCarSetting.npcPos.z],
                    [langStringDefault("phone.310df74f94baef682ba724fe2393e875"), TAXI_CONF.carRent.pos.x, TAXI_CONF.carRent.pos.y, TAXI_CONF.carRent.pos.z],
                    // [langStringDefault("phone.b59555c9a6d5fb1702c83b7e99667d13"), CONSTRUCTION_REGISTER_POS.x, CONSTRUCTION_REGISTER_POS.y, CONSTRUCTION_REGISTER_POS.z],
                ]
            }
        ]
    },
    {
        name: langStringDefault("phone.aca39cd10c5b59e06d38538a1891ef21"),
        id: "games",
        cats: [
            {
                name: langStringDefault("phone.bf2ab26962c93167126db007addaf25c"), items: [
                    [langStringDefault("phone.f4be9c08020f815172b3943490573a3e"), RACE_REGISTER_POS[0].x, RACE_REGISTER_POS[0].y, RACE_REGISTER_POS[0].z],
                    [langStringDefault("phone.1338f345ca07a6a1b52a904ffb184678"), DUELS_REGISTER_POS.x, DUELS_REGISTER_POS.y, DUELS_REGISTER_POS.z],
                    [langStringDefault("phone.3e654ccb39c6dc24f4b3ea927390c0d0"), DRIFT_MAP_EXIT.x, DRIFT_MAP_EXIT.y, DRIFT_MAP_EXIT.z],

                ]
            },
        ]
    },
    {
        name: langStringDefault("phone.cbd748ebde16af414d264762238ccdbc"),
        id: "info",
        cats: [
            {
                name: langStringDefault("phone.af3f71b711f6d4a5c8c175bbe72664ce"), items: FINE_CAR_POS.map((q, i) => {
                    return [langStringDefault("phone.08fc8c04ec6ed47cf2d038faef881cd2", i+1), q.x, q.y, q.z]
                })
            },
            {
                name: langStringDefault("phone.b29e57aaddeeb624730b38f8948064ad"), items: FINE_AIR_POS.map((q, i) => {
                    return [langStringDefault("phone.2537f7c3add5830725563bed45d3e980", i+1), q.x, q.y, q.z]
                })
            },
        ]
    }
]