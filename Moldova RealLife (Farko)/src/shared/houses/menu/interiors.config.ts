import { langStringDefault } from "../../lang/index";
export interface ILayout {
    id: number
    name: string
    img: string | string[]
}

export interface IInteriorData {
    id: number
    interiorId: number
    name: string
    cost: number
    isDonate?: boolean
    img: string
    layoutId: number
}

export const layoutsData: ILayout[] = [
    {
        id: 0,
        name: langStringDefault("houses.menu.interiors.config.f6b1def34020a842d50f44a3bc692e48"),
        img: "layout0"
    },
    {
        id: 1,
        name: langStringDefault("houses.menu.interiors.config.7f7f88e32871e725e56bc503f5a0d170"),
        img: "layout1"
    },
    {
        id: 2,
        name: langStringDefault("houses.menu.interiors.config.cdc23732752ce62502d8ed246a82da9f"),
        img: ["layout2-1", "layout2-2"]
    },
    {
        id: 3,
        name: langStringDefault("houses.menu.interiors.config.4fdcc64b593ba3dc8357dc4627d874c1"),
        img: ["layout3-1", "layout3-2"]
    },
    {
        id: 4,
        name: langStringDefault("houses.menu.interiors.config.6b22674f0437f97a46f8efb9e82c9a35"),
        img: "layout4"
    },
    {
        id: 5,
        name: langStringDefault("houses.menu.interiors.config.8e485b64e2cac66c596afb1d8d36bcc1"),
        img: ["layout5-1", "layout5-2", "layout5-3"]
    },
    {
        id: 6,
        name: langStringDefault("houses.menu.interiors.config.8ef4f633a32e6684f402e3c669bc2854"),
        img: ["layout6-1", "layout6-2"]
    }
]

// img - house
export const interiorsData: IInteriorData[] = [
    {
        id: 0,
        interiorId: 24,
        name: langStringDefault("houses.menu.interiors.config.8215c67f80c41aa46b76c453c675a01a"),
        cost: 200000,
        isDonate: false,
        img: "interior24",
        layoutId: 0
    },
    {
        id: 1,
        interiorId: 25,
        name: langStringDefault("houses.menu.interiors.config.42d740c1f94b82bd8ea0e6909245e30f"),
        cost: 250000,
        isDonate: false,
        img: "interior25",
        layoutId: 0
    },
    {
        id: 2,
        interiorId: 26,
        name: langStringDefault("houses.menu.interiors.config.d73e93f6f4b39e7773334af5144c1286"),
        cost: 300000,
        isDonate: false,
        img: "interior26",
        layoutId: 0
    },
    {
        id: 3,
        interiorId: 27,
        name: langStringDefault("houses.menu.interiors.config.3971b2f0e16ffb5d84b2191f0dcda2b5"),
        cost: 500000,
        isDonate: false,
        img: "interior27",
        layoutId: 1
    },
    {
        id: 4,
        interiorId: 28,
        name: langStringDefault("houses.menu.interiors.config.6a57a07ac02d736f08bbde4fcef514a7"),
        cost: 600000,
        isDonate: false,
        img: "interior28",
        layoutId: 1
    },
    {
        id: 5,
        interiorId: 29,
        name: langStringDefault("houses.menu.interiors.config.68a0b8aa148579b0e9b416aa9e92ba20"),
        cost: 10000,
        isDonate: true,
        img: "interior29",
        layoutId: 1
    },
    {
        id: 6,
        interiorId: 30,
        name: langStringDefault("houses.menu.interiors.config.5e107b28598dcfaae3f48e123483e15c"),
        cost: 2000000,
        isDonate: false,
        img: "interior30",
        layoutId: 2
    },
    {
        id: 7,
        interiorId: 31,
        name: langStringDefault("houses.menu.interiors.config.15e5fccf60ca442818654056f589b807"),
        cost: 2500000,
        isDonate: false,
        img: "interior31",
        layoutId: 2
    },
    {
        id: 8,
        interiorId: 32,
        name: langStringDefault("houses.menu.interiors.config.018a5f8eb8c662295ec22bc761ff1d01"),
        cost: 25000,
        isDonate: true,
        img: "interior32",
        layoutId: 2
    },
    {
        id: 9,
        interiorId: 33,
        name: langStringDefault("houses.menu.interiors.config.5155c49bbf59e43ef25c2a9958fef8b4"),
        cost: 30000,
        isDonate: true,
        img: "interior34",
        layoutId: 3
    },
    {
        id: 10,
        interiorId: 34,
        name: langStringDefault("houses.menu.interiors.config.05fbe1cc1d2154682184520d365eb26f"),
        cost: 30000,
        isDonate: true,
        img: "interior33",
        layoutId: 3
    },
    {
        id: 11,
        interiorId: 35,
        name: langStringDefault("houses.menu.interiors.config.e7f0e88f00e8fe711038e7b13815d744"),
        cost: 30000,
        isDonate: true,
        img: "interior35",
        layoutId: 3
    },
    {
        id: 12,
        interiorId: 36,
        name: langStringDefault("houses.menu.interiors.config.bf492871d17421c17f76fdf55bdc041c"),
        cost: 12000,
        isDonate: true,
        img: "interior36",
        layoutId: 4
    },
    {
        id: 13,
        interiorId: 37,
        name: langStringDefault("houses.menu.interiors.config.f5d807c5e1a3ce453cfcccbe0fa8a485"),
        cost: 12000,
        isDonate: true,
        img: "interior37",
        layoutId: 4
    },
    {
        id: 14,
        interiorId: 38,
        name: langStringDefault("houses.menu.interiors.config.872e692ddb7a78019965aab4371b69e5"),
        cost: 12000,
        isDonate: true,
        img: "interior38",
        layoutId: 4
    },
    {
        id: 15,
        interiorId: 39,
        name: langStringDefault("houses.menu.interiors.config.34b457f7b062c776c5cc402660515a1a"),
        cost: 25000,
        isDonate: true,
        img: "interior39",
        layoutId: 5
    },
    {
        id: 16,
        interiorId: 40,
        name: langStringDefault("houses.menu.interiors.config.82a5557d5007f49a6b256590c356e0bf"),
        cost: 25000,
        isDonate: true,
        img: "interior40",
        layoutId: 5
    },
    {
        id: 17,
        interiorId: 41,
        name: langStringDefault("houses.menu.interiors.config.babee6910fd2c789f7e5e5bb0dd82dd3"),
        cost: 1500000,
        isDonate: false,
        img: "interior41",
        layoutId: 5
    },
    {
        id: 18,
        interiorId: 42,
        name: langStringDefault("houses.menu.interiors.config.5b5038f4427e7d12606a9e7c8006f83e"),
        cost: 1000000,
        isDonate: false,
        img: "interior42",
        layoutId: 6
    },
    {
        id: 19,
        interiorId: 43,
        name: langStringDefault("houses.menu.interiors.config.d6ebd6ed1ec2c0a1334586bdbb5f3f37"),
        cost: 20000,
        isDonate: true,
        img: "interior43",
        layoutId: 6
    },
    {
        id: 20,
        interiorId: 44,
        name: langStringDefault("houses.menu.interiors.config.7d809ea02ba57794e26f7f9d2427b51c"),
        cost: 20000,
        isDonate: true,
        img: "interior44",
        layoutId: 6
    }
]