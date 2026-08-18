import { langStringDefault } from "./lang/index";
import {componentsFemale, componentsMale} from "./clothesData"

export const clothShopNames = [langStringDefault("cloth.af76f78c5023aea9c458cc3657af2ed5"), langStringDefault("cloth.af76f78c5023aea9c458cc3657af2ed5"), langStringDefault("cloth.af76f78c5023aea9c458cc3657af2ed5"), langStringDefault("cloth.af76f78c5023aea9c458cc3657af2ed5"), langStringDefault("cloth.414b2c2a08ec3dbca5e51ca5ec46c1f6")];

export const CLOTH_VARIATION_ID_MULTIPLER = 10000000

export const getPartName = (id: number) => {
    let res = ""
    switch (id) {
        case 1:
            res = langStringDefault("cloth.ce1d352b018e35ef0aa4cc4d2410248c")
            break;
        case 3:
            res = langStringDefault("cloth.f898d43bf2d409809c8a16a657606516")
            break;
        case 4:
            res = langStringDefault("cloth.676ba15a80e98a7f148d888c6b3e2ea3")
            break;
        case 5:
            res = langStringDefault("cloth.bd741cec2419a18077b9e7f5d8329a33")
            break;
        case 6:
            res = langStringDefault("cloth.f3c3476813f7a44fbe32a3cefe7e9e3c")
            break;
        case 7:
            res = langStringDefault("cloth.4adf65a61a011d38edfaf9a32e57766c")
            break;
        case 8:
            res = langStringDefault("cloth.2303931337b7dc9d12c66284155d68cc")
            break;
        case 9:
            res = langStringDefault("cloth.c943694708d755c5b3e5c45d44672ce6")
            break;
        case 11:
            res = langStringDefault("cloth.84d53b7f48e868fb37562df30e01ae75")
            break;
    }
    return res;
}

export type ClothData = {
    component: number,
    drawable: number,
    texture: number,
    name?: string
}[];

export interface GloveClothData {
    name: string,
    texture: number,
    torsoMap: Array<[number, number]>,
}

export const partsList:[number, string, number?][] = [
    [1, langStringDefault("cloth.bed750e8786dc765a28b14fd77fb60ae")],
    [3, langStringDefault("cloth.998dbaff70bf1d97d7bd2dd89089729e")],
    [333, langStringDefault("cloth.c3f4904e216645868572351483b8f1f6")],
    [4, langStringDefault("cloth.f6be2c21a13b3c403af4eeeba0af0bc4")],
    [5, "Rucsacuri si parasute"],
    [6, langStringDefault("cloth.e9c88b1b82335230af7a3a09e59e7650")],
    [7, langStringDefault("cloth.e5bb2c43fc12eeab4eebef54c625742f")],
    [9, langStringDefault("cloth.3377b74e8831b49ec00019aa23603f3e")],
    [100, langStringDefault("cloth.bf11cb4d2d34d6b2db08955c8707ecc7")],
    [101, langStringDefault("cloth.42118e7e52ad33282d2b7062a6b49cbe")],
    [102, langStringDefault("cloth.b155aacc21d9bdbbd1a286881657a5e6")],
    [106, langStringDefault("cloth.64e722fff662f9c5237a8e59749f9f04")],
    [107, langStringDefault("cloth.bf58b6dc010ca01ed89410db9feec56c")],
    [1000, langStringDefault("cloth.5825b16d9ab3f0c8966bcc08ecf5bb7d")],
]

export const dressShopPartsList:[number, string, number?][] = [
    [1, langStringDefault("cloth.ee4f2f1bc7486ff25771ffae51d9cc6e")],
    [3, langStringDefault("cloth.3ec272054f7c9796a8d62076d149e4a9")],
    [333, langStringDefault("cloth.09fdfd899c337e7c4484f61af260963d")],
    [4, langStringDefault("cloth.9cfc54adca05f294464fc1025c139ba1")],
    // [5, "Genti si Rucsacuri"],
    [6, langStringDefault("cloth.17183583effd6ac8abe106456fee8759")],
    [7, langStringDefault("cloth.519d08013af51ceaf694520702118f49")],
    [100, langStringDefault("cloth.f3a36d91cd9ae9ea98848125db9e3af7")],
    [101, langStringDefault("cloth.a778a3e6be8a435ea529a23f8eb85a6b")],
    [102, langStringDefault("cloth.31e64f36025325bb94437bca310c1322")],
    [106, langStringDefault("cloth.b041522a40da9e0c916802fb446f0c0d")],
    [107, langStringDefault("cloth.40371f8e5403b2eb8d15de1842ccd846")],
    [1000, langStringDefault("cloth.e5faa3c785e6a09e60f9e0ba474b0094")],
]

export const partsListAdmin:[number, string, number?][] = [
    ...partsList,
    [5, langStringDefault("cloth.84d535f9c4391e4b3341bbba66806de5")],
    [10, langStringDefault("cloth.cae12651aa36b8568257e45512573448")]
]


export const boneParts:[number, number, number?, number?, number?][] = [
    [1, 31086, 0.5, 2.5, 1],
    [3, 24818, 0, 3.5, 0.3],
    [4, 63931, -1.0, 3.0, 0],
    [6, 52301, 1.0, 2.5, 0],
    [7, 24818, 0, 2.5, 0],
    [100, 31086, 1.5, 2.0, 1.3],
    [101, 31086, 0.0, 2.5, 1],
    [102, 31086, 0.8, 0.0, 0.7],
    [106, 60309, 0, 2.5, 0],
    [107, 28422, 0, 2.5, 0],
]

export enum ArmorNames {
    StandardArmor = 'Standard Bodyarmor',
    PurpleArmor = 'Bodyarmor - Ballas',
    GreenArmor = 'Bodyarmor - Families',
    BlueArmor = 'Bodyarmor - Marabunta',
    RedArmor = 'Bodyarmor - Bloods',
    YellowArmor = 'Bodyarmor - Vagos',
    GovernmentArmor = 'Bodyarmor - GOV',
    PoliceArmor = 'Bodyarmor - LSPD',
    FibArmor = 'Bodyarmor FIB',
    ArmyArmor = 'Bodyarmor - SANG',
    SheriffArmor = 'Bodyarmor - LSSD',
    YakuzaArmor = 'Bodyarmor - Yakuza',
    RMArmor = 'Bodyarmor - RM',
    LCNArmor = 'Bodyarmor - LCN', 
}

export const getBoneData = (part:number) => {
    const cfg = boneParts.find(q => q[0] == part);
    if(!cfg) return null;
    return {
        bone: cfg[1],
        x: cfg[2],
        y: cfg[3],
        z: cfg[4],
    }
}

/** https://wiki.rage.mp/index.php?title=Masks */
export const getAllMasks = (male = true) => {
    return (male ? componentsMale : componentsFemale).filter(q => q.component === 1)
}

/** 
 * https://wiki.rage.mp/index.php?title=Bags_and_Parachutes
 */
export const getAllBags = (male = true) => {
    return (male ? componentsMale : componentsFemale).filter(q => q.component === 5);
}


/** 
 * https://wiki.rage.mp/index.php?title=Male_Torsos \
 * https://wiki.rage.mp/index.php?title=Female_Torsos 
 * */
export const getAllTorsos = (male = true) => {
    return (male ? componentsMale : componentsFemale).filter(q => q.component === 3)
}
/** 
 * https://wiki.rage.mp/index.php?title=Male_Tops \
 * https://wiki.rage.mp/index.php?title=Female_Tops
 * */
export const getAllTops = (male = true) => {
    return (male ? componentsMale : componentsFemale).filter(q => q.component === 11)
}
/** 
 * https://wiki.rage.mp/index.php?title=Male_Undershirts \
 * https://wiki.rage.mp/index.php?title=Female_Undershirts
 * */
export const getAllUndershirts = (male = true) => {
    return (male ? componentsMale : componentsFemale).filter(q => q.component === 8)
}



/**
 *  https://wiki.rage.mp/index.php?title=Male_Legs \
 *  https://wiki.rage.mp/index.php?title=Female_Legs
*/
export const getAllLegs = (male = true) => {
    return (male ? componentsMale : componentsFemale).filter(q => q.component === 4)
}

/** 
 * https://wiki.rage.mp/index.php?title=Male_Shoes \
 * https://wiki.rage.mp/index.php?title=Female_Shoes
 * */
export const getAllShoes = (male = true) => {
    return (male ? componentsMale : componentsFemale).filter(q => q.component === 6)
}