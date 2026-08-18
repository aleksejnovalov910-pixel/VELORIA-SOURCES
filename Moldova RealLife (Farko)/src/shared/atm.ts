import { langStringDefault } from "./lang/index";
export const ATM_PROPS = [
    { model: 506770882, offset: { x: 0.0, y: -0.58, z: 1 }, task: "PROP_HUMAN_ATM"},
    { model: -870868698, offset: { x: 0.0, y: -0.88, z: 1 }, task: "PROP_HUMAN_ATM"},
    { model: -1126237515, offset: { x: 0.0, y: -0.58, z: 1 }, task: "PROP_HUMAN_ATM"},
    { model: -1364697528, offset: { x: 0.0, y: -0.58, z: 1 }, task: "PROP_HUMAN_ATM"},
]

export interface BankHistoryItem {
    id: number;
    text: string;
    type: "remove" | "add" | "reject";
    sum: number;
    time: number;
    target: string;
    ticket: string;
}

export const ATM_BUTTONS: {id: number, name: string, icon: string}[] = [
    {id: 0, icon: "wallet", name: langStringDefault("atm.162d11192eb905c3713c48993c5a30dd")},
    {id: 1, icon: "creditcard-income", name: langStringDefault("atm.00fbab62c6e91c3f0f2adb2486efb98a")},
    {id: 2, icon: "table", name: langStringDefault("atm.b53d054c0ec1c92b088334d45d11d46b")},
    {id: 3, icon: "command", name: langStringDefault("atm.7ebc53df469e42436c6b935be63285f4")},
]

export interface BankTax {
    id: number,
    name: string,
    address?: string,
    numberPlate?: string,
    maxTaxAmount: number,
    taxAmountLeft: number
}

export interface BankTaxes {
    houses: BankTax[],
    businesses: BankTax[]
    warehouse: BankTax[]
}