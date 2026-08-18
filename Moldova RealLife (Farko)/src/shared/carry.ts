import { langStringDefault } from "./lang/index";

export interface CarrySharedData {
    targetId: number,
    carryCfgIdx: number
}

export interface CarryConfig {
    name: string,
    carriedAnimation: CarryAnimation,
    carriedAttach: CarryAttach,
    carryAnimation: CarryAnimation
}

export interface CarryAnimation {
    dictionary: string,
    name: string,
    flag: number,
    isUpper: boolean
}

export interface CarryAttach {
    boneIndex: number,
    posOffset: Vector3Mp,
    rotation: Vector3Mp
}

export const CARRY_LIST: CarryConfig[] = [
    {
        name: langStringDefault("carry.63184393c74d0dd8610ebbb4064da34c"),
        carriedAnimation: {
            dictionary: "nm",
            name: langStringDefault("carry.86a3b9f20a1ed6a814897c8a36643d1e"),
            flag: 33,
            isUpper: false
        },
        carryAnimation: {
            dictionary: "missfinale_c2mcs_1",
            name: langStringDefault("carry.6ec73e026b2566720fcf349f4f7ced69"),
            flag: 49,
            isUpper: true
        },
        carriedAttach: {
            boneIndex: 0,
            posOffset: new mp.Vector3(0.15, 0.22, 0.63),
            rotation: new mp.Vector3(0.5, 0.5, 0.0)
        }
    },

    {
        name: langStringDefault("carry.bb03429a371eea01cd7431c51b389311"),
        carriedAnimation: {
            dictionary: "amb@code_human_in_car_idles@generic@ps@base",
            name: "base",
            flag: 33,
            isUpper: false
        },
        carryAnimation: {
            dictionary: "anim@heists@box_carry@",
            name: "idle",
            flag: 50,
            isUpper: true
        },
        carriedAttach: {
            boneIndex: 0,
            posOffset: new mp.Vector3(0.08, 0.38, 0.25),
            rotation: new mp.Vector3(0.9, 0.30, 90.0)
        }
    },

    {
        name: langStringDefault("carry.0e90d6a90e0cd5b600805de68f2b5f06"),
        carriedAnimation: {
            dictionary: "anim@arena@celeb@flat@paired@no_props@",
            name: langStringDefault("carry.37177ac923c9642f01119e493daf1689"),
            flag: 33,
            isUpper: false
        },
        carryAnimation: {
            dictionary: "anim@arena@celeb@flat@paired@no_props@",
            name: langStringDefault("carry.ce37aa03b48f5d16e08e9fb44bc7bdd2"),
            flag: 49,
            isUpper: true
        },
        carriedAttach: {
            boneIndex: 0,
            posOffset: new mp.Vector3(0, -0.15, 0.45),
            rotation: new mp.Vector3(0, 0, 0.0)
        }
    }
]
