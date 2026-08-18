import { langStringDefault } from "./lang/index";
// import {DynamicBlipOption} from "./dynamicBlip";
import {BUSINESS_TYPE} from "./business";
import {SELL_FISH_POS} from "./npc.customer";
import {WEDDING_NAME, WEDDING_POS} from "./wedding";
import {HousesTeleportsList} from "./houses";
// import {CONSTRUCTION_REGISTER_POS} from "./construction";
import {DRIFT_MAP_EXIT} from "./drift";
import {DynamicBlipOption} from "./dynamicBlip";
import { COIN_SELL_POS } from "./mining";
import {FAMILY_CREATE_POS_CRIME} from "./family";

export const BUSINESS_BLIPS: {type: BUSINESS_TYPE, subtype: number, blip: number, color: number, scale?: number}[] = [
    {type: BUSINESS_TYPE.BANK, subtype: 0, blip: 374, color: 39},
    {type: BUSINESS_TYPE.BANK, subtype: 1, blip: 374, color: 1},
    {type: BUSINESS_TYPE.BANK, subtype: 2, blip: 374, color: 2},
    {type: BUSINESS_TYPE.BANK, subtype: 3, blip: 374, color: 3},
    {type: BUSINESS_TYPE.FUEL, subtype: 0, blip: 415, color: 4},
    {type: BUSINESS_TYPE.FUEL, subtype: 1, blip: 415, color: 4},
    {type: BUSINESS_TYPE.TUNING, subtype: 0, blip: 446, color: 0},
    {type: BUSINESS_TYPE.TUNING, subtype: 1, blip: 488, color: 0},
    {type: BUSINESS_TYPE.PARKING, subtype: 0, blip: 524, color: 2},
    {type: BUSINESS_TYPE.PARKING, subtype: 1, blip: 524, color: 2},
    {type: BUSINESS_TYPE.VEHICLE_SHOP, subtype: 0, blip: 739, color: 1},
    {type: BUSINESS_TYPE.VEHICLE_SHOP, subtype: 1, blip: 522, color: 1},
    {type: BUSINESS_TYPE.VEHICLE_SHOP, subtype: 2, blip: 225, color: 1},
    {type: BUSINESS_TYPE.VEHICLE_SHOP, subtype: 3, blip: 225, color: 1},
    {type: BUSINESS_TYPE.VEHICLE_SHOP, subtype: 4, blip: 226, color: 1},
    {type: BUSINESS_TYPE.VEHICLE_SHOP, subtype: 5, blip: 427, color: 1},
    {type: BUSINESS_TYPE.VEHICLE_SHOP, subtype: 6, blip: 251, color: 1},
    {type: BUSINESS_TYPE.VEHICLE_SHOP, subtype: 7, blip: 530, color: 1},
    {type: BUSINESS_TYPE.VEHICLE_SHOP, subtype: 8, blip: 530, color: 1},
    {type: BUSINESS_TYPE.ITEM_SHOP, subtype: 0, blip: 52, color: 0},
    {type: BUSINESS_TYPE.ITEM_SHOP, subtype: 1, blip: 521, color: 4},
    {type: BUSINESS_TYPE.ITEM_SHOP, subtype: 2, blip: 110, color: 0},
    {type: BUSINESS_TYPE.ITEM_SHOP, subtype: 3, blip: 153, color: 69},
    {type: BUSINESS_TYPE.ITEM_SHOP, subtype: 4, blip: 850, color: 69},
    {type: BUSINESS_TYPE.ITEM_SHOP, subtype: 5, blip: 52, color: 2},
    {type: BUSINESS_TYPE.ITEM_SHOP, subtype: 6, blip: 463, color: 64},
    {type: BUSINESS_TYPE.ITEM_SHOP, subtype: 7, blip: 403, color: 48},
    {type: BUSINESS_TYPE.BAR, subtype: 0, blip: 136, color: 4},
    {type: BUSINESS_TYPE.BAR, subtype: 1, blip: 136, color: 4},
    {type: BUSINESS_TYPE.BARBER, subtype: 0, blip: 71, color: 81},
    {type: BUSINESS_TYPE.BARBER, subtype: 1, blip: 71, color: 81},
    {type: BUSINESS_TYPE.BARBER, subtype: 2, blip: 71, color: 81},
    {type: BUSINESS_TYPE.BARBER, subtype: 3, blip: 71, color: 81},
    {type: BUSINESS_TYPE.TATTOO_SALON, subtype: 0, blip: 75, color: 10},
    {type: BUSINESS_TYPE.TATTOO_SALON, subtype: 1, blip: 75, color: 10},
    {type: BUSINESS_TYPE.TATTOO_SALON, subtype: 2, blip: 75, color: 10},
    {type: BUSINESS_TYPE.TATTOO_SALON, subtype: 3, blip: 75, color: 10},
    {type: BUSINESS_TYPE.TATTOO_SALON, subtype: 4, blip: 75, color: 10},
    {type: BUSINESS_TYPE.DRESS_SHOP, subtype: 0, blip: 73, color: 3},
    {type: BUSINESS_TYPE.DRESS_SHOP, subtype: 1, blip: 73, color: 3},
    {type: BUSINESS_TYPE.DRESS_SHOP, subtype: 2, blip: 73, color: 3},
    {type: BUSINESS_TYPE.DRESS_SHOP, subtype: 3, blip: 73, color: 3},
    {type: BUSINESS_TYPE.DRESS_SHOP, subtype: 4, blip: 617, color: 3},
    {type: BUSINESS_TYPE.WASH, subtype: 0, blip: 100, color: 4},
]

export const getBusinessBlip = (type: BUSINESS_TYPE, subtype: number) => {
    return BUSINESS_BLIPS.find(q => q.type === type && q.subtype === subtype)
}

export const BLIPS_DATA: { type: number, color: number, position: Vector3Mp, name: string, options?: DynamicBlipOption}[] = [
    {
        type: 61, 
        color: 1,
        position: new mp.Vector3(283.97, -586.67, 43.38),
        name: langStringDefault("blips.1368f1c4869d43f681ee604e66e45bd2")
        
    },
    {
        type: 540, 
        color: 63,
        position: new mp.Vector3(2506.09, -379.85, 94.12),
        name: langStringDefault("blips.f5bdaebb2a9ff5ca747c7c83d3d58d78")
    },
    {
        type: 526, 
        color: 60,
        position: new mp.Vector3(1846.05, 3679.35, 38.89),
        name: langStringDefault("blips.4add76b4e15f08c2c58ea2802ba930e6")
    },
    {
        type: 526, 
        color: 60,
        position: new mp.Vector3(-447.44, 6008.74, 40.32),
        name: langStringDefault("blips.6b8b0766007790ab655eede8c494ffd6")
    },
    {
        type: 598, 
        color: 4,
        position: new mp.Vector3(-2018.60, 3162.23, 57.58),
        name: langStringDefault("blips.015393628695f372fd9d42e7d7edae14")
    },
    // {
    //     type: 78, 
    //     color: 2,
    //     position: new mp.Vector3(-1503.98, 850.20, 188.74),
    //     name: langStringDefault("blips.1e49cf1979264dacd29e97b4630e2e72")
    // },
    // {
    //     type: 78, 
    //     color: 4,
    //     position: new mp.Vector3(-1374.22, 54.72, 60.38),
    //     name: "Русское посольство"
    // },
    // {
    //     type: 78, 
    //     color: 1,
    //     position: new mp.Vector3(-349.98, 191.19, 103.70),
    //     name: langStringDefault("blips.fdb54e947980d947b3c42182d21c4e5c")
    // },
    // {
    //     type: 78, 
    //     color: 46,
    //     position: new mp.Vector3(1405.99, 1147.69, 119.26),
    //     name: langStringDefault("blips.ced7c74670483a67f6fc77080a04d79d")
    // },
    {
        type: 590, 
        color: 59,
        position: new mp.Vector3(-585.05, -928.50, 36.83),
        name: langStringDefault("blips.e9c0b90da4ce07ab0ac6f8d5915e70bd")
    },
    {
        type: 672, 
        color: 18,
        position: new mp.Vector3(-704.59, -1286.57, 5.05),
        name: langStringDefault("blips.f121afd0b638abcdbe0f00586a5b247d")
    },
    {
        type: 641, 
        color: 50,
        position: new mp.Vector3(-1656.09, -826.43, 9.94),
        name: langStringDefault("blips.53a6bb75cd428c7986839c1cecd367c8")
    },
    {
        type: 238, 
        color: 4,
        position: new mp.Vector3(1848.93, 2608.78, 45.59),
        name: langStringDefault("blips.9a5ff93d0c8a2fb68bfd49a31e82ab4b")
    },
    {
        type: 126, 
        color: 41,
        position: new mp.Vector3(-235.38, -2035.33, 36.20),
        name: langStringDefault("blips.016ea6926690e11498d70c0ec1cbaaba")
    },
    {
        type: 61, 
        color: 1,
        position: new mp.Vector3(-249.51, 6326.59, 32.43),
        name: langStringDefault("blips.15581f8b1bc1cf7b3cdb68300ba91fd7")
        
    },
    // {
    //     type: 280, 
    //     color: 8,
    //     position: new mp.Vector3(295.27, -1191.71, 29.25),
    //     name: langStringDefault("blips.f23677edef92758add5e09155c32309b")
        
    // },
    {
        type: 280, 
        color: 5,
        position: new mp.Vector3(20.22, -1301.45, 29.13),
        name: langStringDefault("blips.6ea029d9cff73d534bae01130459a8f4")
        
    },
    {
        type: 280, 
        color: 5,
        position: new mp.Vector3(-1066.14, -873.60, 4.99),
        name: langStringDefault("blips.1525ca4a73270d3d2632e8f5ea7c42b6")
        
    },
    // {
    //     type: 84, 
    //     color: 59,
    //     position: new mp.Vector3(-461.37, -1715.58, 18.64),
    //     name: langStringDefault("blips.62fa6479ed8dd9e2bf7ebc15cd546e65")
        
    // },
    // {
    //     type: 84, 
    //     color: 25,
    //     position: new mp.Vector3(100.15, -1948.33, 22.35),
    //     name: langStringDefault("blips.f25f543268af6fd4a31c3feb3af9618e")
        
    // },
    // {
    //     type: 84, 
    //     color: 27,
    //     position: new mp.Vector3(892.59, -2173.04, 32.29),
    //     name: langStringDefault("blips.4ebca5579ac1c0c50e178f7c99bc66de")
        
    // },
    // {
    //     type: 84, 
    //     color: 46,
    //     position: new mp.Vector3(542.46, -1944.71, 24.99),
    //     name: langStringDefault("blips.01bba22704654c3db41b7e7465d70d07")
        
    // },
    // {
    //     type: 478,
    //     color: 5,
    //     name: langStringDefault("blips.c6e10539334bae827648ff37760db43b"),
    //     position: CONSTRUCTION_REGISTER_POS,
    // },
    {
        type: 467,
        color: 4,
        name: langStringDefault("blips.641c784d9cd720294c35e00cfaa05166"),
        position: new mp.Vector3(-1627.47, -1088.61, 13.02),
    },
    ...HousesTeleportsList.map(item => {
        return {
            type: 476,
            color: 26,
            name: item.name,
            position: new mp.Vector3(item.pos.x, item.pos.y, item.pos.z)
        }
    }),
    ...WEDDING_POS.map(item => {
        return {
            type: 305,
            color: 0,
            name: WEDDING_NAME,
            position: item,
        }
    }),
    {
        type: 649,
        color: 1,
        name: langStringDefault("blips.6a49a8bfdbb5f5bbd73e7e3db45c93e4"),
        position: new mp.Vector3(DRIFT_MAP_EXIT.x, DRIFT_MAP_EXIT.y, DRIFT_MAP_EXIT.z),
        // options: {
        //     range: 150
        // }
    },
    {
        type: 84, 
        color: 3,
        position: new mp.Vector3(496.25, -1336.79, 29.32),
        name: langStringDefault("blips.ff346fe48935ba4b720fb9cae9932ba9")
        
    },
    {
        type: 594, 
        color: 0,
        position: COIN_SELL_POS,
        name: langStringDefault("blips.0f51848ecd6c06e9e7c45a1d77a79e6c")
        
    },
    // {
    //     type: 304, 
    //     color: 4,
    //     position: new mp.Vector3(705.81, -966.68, 30.41),
    //     name: langStringDefault("blips.5dc92e9e16423354b95782350bae6e38")
        
    // },
    // {
    //     type: 304, 
    //     color: 4,
    //     position: new mp.Vector3(-749.69, 5589.60, 38.03),
    //     name: langStringDefault("blips.098d379d9c6739eba866edeb31b3b536")
        
    // },
    // {
    //     type: 304, 
    //     color: 4,
    //     position: new mp.Vector3(1702.38, 3290.27, 48.92),
    //     name: langStringDefault("blips.e50d9289760b3b92ceba0112663e5338")
        
    // },
    {
        type: 61, 
        color: 1,
        position: new mp.Vector3(1835.30, 3678.29, 34.27),
        name: langStringDefault("blips.e8c9eb5592796ff62d004bd5ef141f49")
        
    },

      // Bauernhof
    {
         type: 206, 
         color: 2,
         position: new mp.Vector3(2091.61,5150.82,50.28),
         name: langStringDefault("blips.b21ddac8e2270a7a447b98e3fda532ce")
        
     },
     {
        type: 206, 
        color: 2,
        position: new mp.Vector3(1884.17,5019.68,49.83),
        name: langStringDefault("blips.dacd05e3068844968f5a6e3e3e62b374")
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(1803.65,5041.41,60.04),
        name: langStringDefault("blips.9cfe59ff595ce3366e17c6aeb8569a23")
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(1875.42,4868.56,46.70),
        name: langStringDefault("blips.1b387038f0b070f7ab198456ca8763f8")
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2002.49,4802.68,44.85),
        name: langStringDefault("blips.d37d70739ecdd17d98f5421ad64f784a")
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2066.05,4864.52,43.89),
        name: langStringDefault("blips.7781de815398316c17864409de1cd19d")
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2106.92,4907.48,41.88),
        name: langStringDefault("blips.7c767c9f94ab5e21f86ec414e171757f")
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2167.01,5011.55,42.04),
        name: langStringDefault("blips.46db4f56ba00ede8f639de5f7cfa6a50")
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2199.60,4983.26,45.08),
        name: langStringDefault("blips.edc3a6ff159be71b7a0c51366428db6e")
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2254.46,4885.33,42.60),
        name: langStringDefault("blips.46e8d5a55621cdbd50810deba1bd9d3f")
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2300.50,4770.67,38.91),
        name: langStringDefault("blips.ffbf86509a57e991e3adbca9c028d2ea")
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2387.49,4803.93,37.76),
        name: langStringDefault("blips.fec59eb35b34f149c5679fbb489a94c4")
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2502.12,4892.72,45.03),
        name: langStringDefault("blips.d674c1dd186bbd2ca148720d1d400d0b")
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2544.27,4859.92,37.79),
        name: langStringDefault("blips.c8a0b122e7ddd301c2270e5a9860a2c7")
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2339.31,5083.47,45.83),
        name: langStringDefault("blips.9c2229e12e752f94983718059b474996")
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(2855.15,4696.89,48.99),
        name: langStringDefault("blips.a9b161b9c5feff3005bc3f410c231e96")
       
    },
    {
        type: 206, 
        color: 2,
        position: new mp.Vector3(1867.55,4756.94,41.73),
        name: langStringDefault("blips.aa6ccf971a0072fb4574b412b0ebd6f5")
       
    },
    {
        type: 523, 
        color: 3,
        position: new mp.Vector3(-1160.78, -1733.07, 3.11),
        name: langStringDefault("blips.723618c19ec14a895f4e09dec5c797b8")
       
    }


]


