import { langStringDefault } from "../../lang/index";
export type FurnitureCategory =
    "wardrobe"
    | "bed"
    | "chest"
    | "chair"
    | "table"
    | "armchair"
    | "sofa"
    | "lamp"
    | "decor"
    | "plumbing"
    | "none";
export const FurnitureAllCategories: FurnitureCategory[] = [
    "wardrobe",
    "bed",
    "chest",
    "chair",
    "table",
    "armchair",
    "sofa",
    "lamp",
    "decor",
    "plumbing"
]

export const FurnitureCategoryNames: any = {
    "wardrobe": "Schränke",
    "bed": "Betten",
    "chest": "Kommoden",
    "chair": "Stühle",
    "table": "Tische",
    "armchair": "Sessel",
    "sofa": "Sofas",
    "lamp": "Beleuchtungskörper",
    "decor": "Dekorationen",
    "plumbing": "Klempnerarbeiten"
}

export interface IFurnitureItem {
    id: number
    name: string
    prop: string
    cost: number
    cat: FurnitureCategory
}

export const furnitureList: IFurnitureItem[] = [
    {
        id: 0,
        name: langStringDefault("houses.furniture.furniture.config.5a903f398e7d1a4a7e9990046ee74d7e"),
        prop: "apa_mp_h_stn_sofacorn_01",
        cost: 100000,
        cat: "sofa"
    },
    {
        id: 1,
        name: langStringDefault("houses.furniture.furniture.config.a07a236ef4ef7a8c2b79ead3d0c8a4fd"),
        prop: "apa_mp_h_stn_sofacorn_05",
        cost: 100000,
        cat: "sofa"
    },
    {
        id: 2,
        name: langStringDefault("houses.furniture.furniture.config.7b2727b6c54320d19881b13332e17f0a"),
        prop: "apa_mp_h_stn_sofacorn_06",
        cost: 100000,
        cat: "sofa"
    },
    {
        id: 3,
        name: langStringDefault("houses.furniture.furniture.config.8ce3dcc55ca4e918cf7ceda413ac888d"),
        prop: "apa_mp_h_stn_sofacorn_07",
        cost: 100000,
        cat: "sofa"
    },
    {
        id: 4,
        name: langStringDefault("houses.furniture.furniture.config.2aa1c82565c131ae173a1e7dd144a89b"),
        prop: "apa_mp_h_stn_sofacorn_08",
        cost: 100000,
        cat: "sofa"
    },
    {
        id: 5,
        name: langStringDefault("houses.furniture.furniture.config.2bb663b821550aa2e2c208c2599d56d4"),
        prop: "apa_mp_h_stn_sofacorn_09",
        cost: 100000,
        cat: "sofa"
    },
    {
        id: 6,
        name: langStringDefault("houses.furniture.furniture.config.78b64e02ee8eaf39962e5e8e7fb15c22"),
        prop: "apa_mp_h_stn_sofacorn_10",
        cost: 110000,
        cat: "sofa"
    },
    {
        id: 7,
        name: langStringDefault("houses.furniture.furniture.config.84725eb47c32108b5b3b73e8b4d1db77"),
        prop: "apa_mp_h_stn_sofa_daybed_01",
        cost: 35000,
        cat: "armchair"
    },
    {
        id: 8,
        name: langStringDefault("houses.furniture.furniture.config.f94bc882714d5f137bac393d0e73f775"),
        prop: "apa_mp_h_stn_sofa_daybed_02",
        cost: 30000,
        cat: "armchair"
    },
    {
        id: 9,
        name: langStringDefault("houses.furniture.furniture.config.11a8bc75e89a242157e9a36b9410c191"),
        prop: "apa_mp_h_yacht_sofa_01",
        cost: 50000,
        cat: "sofa"
    },
    {
        id: 10,
        name: langStringDefault("houses.furniture.furniture.config.fa148a4799e0729a057f139bf1f2ef1a"),
        prop: "apa_mp_h_yacht_sofa_02",
        cost: 30000,
        cat: "sofa"
    },
    // {
    //     id: 11,
    //     name: 'Braunes Bürosofa',
    //     prop: 'apa_mp_h_yacht_sofa_01',
    //     cost: 50000,
    //     cat: 'sofa'
    // },
    {
        id: 12,
        name: langStringDefault("houses.furniture.furniture.config.48be43cd9bf8c5b394282b9de23cdc6c"),
        prop: "bkr_prop_clubhouse_sofa_01a",
        cost: 35000,
        cat: "sofa"
    },
    {
        id: 13,
        name: langStringDefault("houses.furniture.furniture.config.5d676ab4eec85605f82275c7d4a84834"),
        prop: "ex_mp_h_off_sofa_003",
        cost: 30000,
        cat: "sofa"
    },
    {
        id: 14,
        name: langStringDefault("houses.furniture.furniture.config.21df2e7d837f36f4c1c730dd03cb75fb"),
        prop: "ex_mp_h_off_sofa_01",
        cost: 30000,
        cat: "sofa"
    },
    {
        id: 15,
        name: langStringDefault("houses.furniture.furniture.config.792842c84d88ab8490a4a88f2838cfb3"),
        prop: "ex_mp_h_off_sofa_02",
        cost: 30000,
        cat: "sofa"
    },
    {
        id: 16,
        name: langStringDefault("houses.furniture.furniture.config.abdbb4c75b371dbde0de318cad131fa1"),
        prop: "hei_heist_stn_sofa2seat_03",
        cost: 30000,
        cat: "sofa"
    },
    {
        id: 17,
        name: langStringDefault("houses.furniture.furniture.config.acbb513e13c1806cc7c7e3e003cc28b5"),
        prop: "hei_heist_stn_sofa2seat_06",
        cost: 30000,
        cat: "sofa"
    },
    {
        id: 18,
        name: langStringDefault("houses.furniture.furniture.config.93ec32044977283a5188d34dc2a87fab"),
        prop: "hei_heist_stn_sofa3seat_01",
        cost: 20000,
        cat: "sofa"
    },
    {
        id: 19,
        name: langStringDefault("houses.furniture.furniture.config.a439be19a50cf0163dbc096d1466b6f1"),
        prop: "hei_heist_stn_sofa3seat_02",
        cost: 25000,
        cat: "sofa"
    },
    {
        id: 20,
        name: langStringDefault("houses.furniture.furniture.config.3c1fd31839df31baac7456b828ac6a2e"),
        prop: "hei_heist_stn_sofa3seat_06",
        cost: 25000,
        cat: "sofa"
    },
    {
        id: 21,
        name: langStringDefault("houses.furniture.furniture.config.c7ad5e42e1ae53ef95e1bea0954de4be"),
        prop: "hei_heist_stn_sofacorn_05",
        cost: 70000,
        cat: "sofa"
    },
    {
        id: 22,
        name: langStringDefault("houses.furniture.furniture.config.054497af16834e9366cb6fdcbb01641d"),
        prop: "prop_t_sofa_02",
        cost: 40000,
        cat: "bed"
    },
    {
        id: 23,
        name: langStringDefault("houses.furniture.furniture.config.75b49c097e86698ebd3f1666db2325c1"),
        prop: "prop_yaught_sofa_01",
        cost: 20000,
        cat: "sofa"
    },
    {
        id: 24,
        name: langStringDefault("houses.furniture.furniture.config.564be6fcbe13d3ea48ff0fb955401daf"),
        prop: "p_lev_sofa_s",
        cost: 70000,
        cat: "sofa"
    },
    {
        id: 25,
        name: langStringDefault("houses.furniture.furniture.config.47db7e5b864083737a40962141f4fe05"),
        prop: "p_res_sofa_l_s",
        cost: 50000,
        cat: "sofa"
    },
    // {
    //     id: 26,
    //     name: 'Heimsofa weiß',
    //     prop: 'p_sofa_s',
    //     cost: 1,
    //     cat: 'sofa'
    // },
    {
        id: 27,
        name: langStringDefault("houses.furniture.furniture.config.1ba0095d3d91ae45647a1f89b58b01d4"),
        prop: "p_v_med_p_sofa_s",
        cost: 40000,
        cat: "sofa"
    },
    {
        id: 28,
        name: langStringDefault("houses.furniture.furniture.config.a2660d165c9d8f00f1b8727c0a565f5d"),
        prop: "p_yacht_sofa_01_s",
        cost: 30000,
        cat: "sofa"
    },
    {
        id: 29,
        name: langStringDefault("houses.furniture.furniture.config.cf508914ef60686121f2ad1365df07ff"),
        prop: "v_res_tre_sofa_s",
        cost: 30000,
        cat: "sofa"
    },
    {
        id: 30,
        name: langStringDefault("houses.furniture.furniture.config.6c08d5cd8db15bb85dec574c9c97ad76"),
        prop: "apa_mp_h_str_avunitl_04",
        cost: 150000,
        cat: "chest"
    },
    {
        id: 31,
        name: langStringDefault("houses.furniture.furniture.config.a54f7817ea1646729e4a017d65443a5e"),
        prop: "apa_mp_h_str_avunitm_01",
        cost: 120000,
        cat: "chest"
    },
    {
        id: 32,
        name: langStringDefault("houses.furniture.furniture.config.7d9f9c470ec7db4d4d3364fa645597f3"),
        prop: "apa_mp_h_str_avunitm_03",
        cost: 120000,
        cat: "chest"
    },
    {
        id: 33,
        name: langStringDefault("houses.furniture.furniture.config.261de7299ded0a4f96dfe458d59f1266"),
        prop: "apa_mp_h_str_avunits_01",
        cost: 100000,
        cat: "chest"
    },
    {
        id: 34,
        name: langStringDefault("houses.furniture.furniture.config.d7ca16d030e82db6e5f4ca1b1d57871d"),
        prop: "apa_mp_h_str_avunits_04",
        cost: 110000,
        cat: "chest"
    },
    {
        id: 35,
        name: langStringDefault("houses.furniture.furniture.config.ef2d0fd148e613d7c377464be8116245"),
        prop: "hei_heist_str_avunitl_03",
        cost: 170000,
        cat: "chest"
    },
    {
        id: 36,
        name: langStringDefault("houses.furniture.furniture.config.4389a5f40c397b4b12ae3fd84898f9c8"),
        prop: "apa_mp_h_str_sideboardl_06",
        cost: 30000,
        cat: "chest"
    },
    {
        id: 37,
        name: langStringDefault("houses.furniture.furniture.config.657c57ac8e9932aa8014b67792d35648"),
        prop: "apa_mp_h_str_sideboardl_11",
        cost: 10000,
        cat: "chest"
    },
    {
        id: 38,
        name: langStringDefault("houses.furniture.furniture.config.bd56b08b90d053ccd1ee19a1700cfce8"),
        prop: "apa_mp_h_str_sideboardl_09",
        cost: 40000,
        cat: "chest"
    },
    {
        id: 39,
        name: langStringDefault("houses.furniture.furniture.config.353c6881efeb4a756800bc204b06a655"),
        prop: "apa_mp_h_str_sideboardl_13",
        cost: 25000,
        cat: "chest"
    },
    {
        id: 40,
        name: langStringDefault("houses.furniture.furniture.config.7f5d6fff64b8126a5a10885260b4a96a"),
        prop: "apa_mp_h_str_sideboardl_14",
        cost: 20000,
        cat: "chest"
    },
    {
        id: 41,
        name: langStringDefault("houses.furniture.furniture.config.8d734041959ce2ca9649998d9cbb5fe1"),
        prop: "apa_mp_h_str_sideboardm_02",
        cost: 15000,
        cat: "chest"
    },
    {
        id: 42,
        name: langStringDefault("houses.furniture.furniture.config.8e01f1200f0635cedd4239820ddcaf10"),
        prop: "apa_mp_h_str_sideboardm_03",
        cost: 30000,
        cat: "chest"
    },
    {
        id: 43,
        name: langStringDefault("houses.furniture.furniture.config.9c5bd3eba87ce7ae0baf886eda03d67b"),
        prop: "apa_mp_h_str_sideboards_01",
        cost: 20000,
        cat: "chest"
    },
    {
        id: 44,
        name: langStringDefault("houses.furniture.furniture.config.f7a4b8254482161512c92e32bdc4c419"),
        prop: "apa_mp_h_str_sideboards_02",
        cost: 25000,
        cat: "table"
    },
    {
        id: 45,
        name: langStringDefault("houses.furniture.furniture.config.5cd5f19d27eaed7ac7fde824e4fe7326"),
        prop: "hei_heist_str_sideboardl_02",
        cost: 20000,
        cat: "chest"
    },
    {
        id: 46,
        name: langStringDefault("houses.furniture.furniture.config.2259fdc0bdf8bb93e20882d544514477"),
        prop: "hei_heist_str_sideboardl_03",
        cost: 15000,
        cat: "chest"
    },
    {
        id: 47,
        name: langStringDefault("houses.furniture.furniture.config.ed40dbebdc688db04f2e99acdb067a19"),
        prop: "hei_heist_str_sideboardl_04",
        cost: 30000,
        cat: "chest"
    },
    {
        id: 48,
        name: langStringDefault("houses.furniture.furniture.config.8148afc77a9e461dfc5dbcbd10df12e0"),
        prop: "hei_heist_str_sideboardl_05",
        cost: 25000,
        cat: "chest"
    },
    {
        id: 49,
        name: langStringDefault("houses.furniture.furniture.config.2fb288f7c5bfc0c56d48dde56fb0f9bc"),
        prop: "hei_heist_str_sideboards_02",
        cost: 25000,
        cat: "table"
    },
    {
        id: 50,
        name: langStringDefault("houses.furniture.furniture.config.c20dab3c9115cba8868be0d261352d52"),
        prop: "apa_mp_h_bed_chestdrawer_02",
        cost: 30000,
        cat: "chest"
    },
    {
        id: 51,
        name: langStringDefault("houses.furniture.furniture.config.b36e64babd554172de97c5bb489eef18"),
        prop: "hei_heist_bed_chestdrawer_04",
        cost: 15000,
        cat: "chest"
    },
    {
        id: 52,
        name: langStringDefault("houses.furniture.furniture.config.491d10999881b2500a997a6f6984c40e"),
        prop: "apa_mp_h_din_chair_04",
        cost: 10000,
        cat: "chair"
    },
    {
        id: 53,
        name: langStringDefault("houses.furniture.furniture.config.fb2dfc25881faba1d503d322e4e80df6"),
        prop: "apa_mp_h_din_chair_08",
        cost: 10000,
        cat: "chair"
    },
    {
        id: 54,
        name: langStringDefault("houses.furniture.furniture.config.c429e648205f0a50f9f8bcf0d2fb7638"),
        prop: "apa_mp_h_din_chair_12",
        cost: 10000,
        cat: "chair"
    },
    {
        id: 55,
        name: langStringDefault("houses.furniture.furniture.config.56b567438b722e6eb859abc13d9c82c5"),
        prop: "apa_mp_h_din_chair_09",
        cost: 13000,
        cat: "chair"
    },
    {
        id: 56,
        name: langStringDefault("houses.furniture.furniture.config.4cfa052469268b209f34d8788507b54d"),
        prop: "hei_heist_din_chair_02",
        cost: 20000,
        cat: "chair"
    },
    {
        id: 57,
        name: langStringDefault("houses.furniture.furniture.config.97342954dfc788e188f4ebe4e72d834b"),
        prop: "hei_heist_din_chair_05",
        cost: 10000,
        cat: "chair"
    },
    {
        id: 58,
        name: langStringDefault("houses.furniture.furniture.config.7b1d37b56f6ddc4ded9ee5307d23110b"),
        prop: "hei_heist_din_chair_06",
        cost: 13000,
        cat: "chair"
    },
    {
        id: 59,
        name: langStringDefault("houses.furniture.furniture.config.73ff2d91aa86d2d94f61b97ef4809356"),
        prop: "prop_table_04_chr",
        cost: 13000,
        cat: "chair"
    },
    {
        id: 60,
        name: langStringDefault("houses.furniture.furniture.config.4931872c8907da98d2a6ed9e0a6f204f"),
        prop: "prop_table_06_chr",
        cost: 20000,
        cat: "chair"
    },
    {
        id: 61,
        name: langStringDefault("houses.furniture.furniture.config.39a1097016fac72ba9471cfc1ab762a1"),
        prop: "apa_mp_h_stn_chairarm_01",
        cost: 25000,
        cat: "armchair"
    },
    {
        id: 62,
        name: langStringDefault("houses.furniture.furniture.config.14c108f1e3e874e1be8d23ebd1595aca"),
        prop: "apa_mp_h_stn_chairarm_02",
        cost: 15000,
        cat: "chair"
    },
    {
        id: 63,
        name: langStringDefault("houses.furniture.furniture.config.e93c4c2e1d65bb802b928393b67e7f8c"),
        prop: "apa_mp_h_stn_chairarm_03",
        cost: 15000,
        cat: "chair"
    },
    {
        id: 64,
        name: langStringDefault("houses.furniture.furniture.config.f87d3d769d5ea89bdd4c278bf306fd44"),
        prop: "apa_mp_h_stn_chairarm_09",
        cost: 20000,
        cat: "chair"
    },
    {
        id: 65,
        name: langStringDefault("houses.furniture.furniture.config.7c0336aedb402970b887c1bb60df26fa"),
        prop: "apa_mp_h_stn_chairarm_11",
        cost: 10000,
        cat: "chair"
    },
    {
        id: 66,
        name: langStringDefault("houses.furniture.furniture.config.bd00a371d05146d59787c7cc6abf8318"),
        prop: "apa_mp_h_stn_chairarm_12",
        cost: 25000,
        cat: "armchair"
    },
    {
        id: 67,
        name: langStringDefault("houses.furniture.furniture.config.28aebf6d18234fd18c94bf2ba89aafcd"),
        prop: "apa_mp_h_stn_chairarm_13",
        cost: 15000,
        cat: "chair"
    },
    {
        id: 68,
        name: langStringDefault("houses.furniture.furniture.config.9293ee1ee56b08b77bfcd74461fd73e7"),
        prop: "apa_mp_h_stn_chairarm_23",
        cost: 25000,
        cat: "armchair"
    },
    {
        id: 69,
        name: langStringDefault("houses.furniture.furniture.config.7c06e34061420b6f61c6abc361908f50"),
        prop: "apa_mp_h_stn_chairarm_24",
        cost: 15000,
        cat: "chair"
    },
    {
        id: 70,
        name: langStringDefault("houses.furniture.furniture.config.2c28eacdbedfc22e90cc9e6cdd9edec5"),
        prop: "apa_mp_h_stn_chairarm_25",
        cost: 20000,
        cat: "armchair"
    },
    {
        id: 71,
        name: langStringDefault("houses.furniture.furniture.config.635061c40e6803a958cdb040850ceaca"),
        prop: "apa_mp_h_stn_chairarm_26",
        cost: 30000,
        cat: "armchair"
    },
    {
        id: 72,
        name: langStringDefault("houses.furniture.furniture.config.c3aed0af29bf7e1ad2681e3be9ccb62d"),
        prop: "apa_mp_h_stn_chairstool_12",
        cost: 15000,
        cat: "armchair"
    },
    {
        id: 73,
        name: langStringDefault("houses.furniture.furniture.config.097b9d71bce842506fc88a54d7079edc"),
        prop: "apa_mp_h_stn_chairstrip_01",
        cost: 20000,
        cat: "armchair"
    },
    {
        id: 74,
        name: langStringDefault("houses.furniture.furniture.config.2d077f2500297cb8882093f1584e57b5"),
        prop: "apa_mp_h_stn_chairstrip_02",
        cost: 25000,
        cat: "armchair"
    },
    {
        id: 75,
        name: langStringDefault("houses.furniture.furniture.config.085f10f8e3c13a7d9e12301540300c66"),
        prop: "apa_mp_h_stn_chairstrip_05",
        cost: 25000,
        cat: "armchair"
    },
    {
        id: 76,
        name: langStringDefault("houses.furniture.furniture.config.2298a90acec2fc4ca8831991fb6138de"),
        prop: "apa_mp_h_stn_chairstrip_04",
        cost: 25000,
        cat: "armchair"
    },
    {
        id: 77,
        name: langStringDefault("houses.furniture.furniture.config.4650a047882a3dcdf9e53f9848d05d6b"),
        prop: "apa_mp_h_stn_chairstrip_07",
        cost: 25000,
        cat: "armchair"
    },
    {
        id: 78,
        name: langStringDefault("houses.furniture.furniture.config.630bd3250505187964805d2a3a0f9f99"),
        prop: "apa_mp_h_stn_chairstrip_08",
        cost: 25000,
        cat: "armchair"
    },
    {
        id: 79,
        name: langStringDefault("houses.furniture.furniture.config.2ddeb1130e1174518ccd77becfe71149"),
        prop: "apa_mp_h_yacht_armchair_01",
        cost: 25000,
        cat: "armchair"
    },
    {
        id: 80,
        name: langStringDefault("houses.furniture.furniture.config.8dfe297711ac1de5367ce5650ddad850"),
        prop: "apa_mp_h_yacht_armchair_03",
        cost: 15000,
        cat: "armchair"
    },
    {
        id: 81,
        name: langStringDefault("houses.furniture.furniture.config.52882bf85585e6706c5e66560af7b686"),
        prop: "apa_mp_h_yacht_armchair_04",
        cost: 30000,
        cat: "armchair"
    },
    {
        id: 82,
        name: langStringDefault("houses.furniture.furniture.config.0adcd674cd1280e950887570e1eb9cfb"),
        prop: "ba_prop_battle_club_chair_01",
        cost: 20000,
        cat: "armchair"
    },
    {
        id: 83,
        name: langStringDefault("houses.furniture.furniture.config.8ab8ce9f990dcf54f3d72dc00bc58ca8"),
        prop: "ba_prop_battle_club_chair_02",
        cost: 100000,
        cat: "armchair"
    },
    {
        id: 84,
        name: langStringDefault("houses.furniture.furniture.config.cda3fbb92d61e6ee0e35602d883b66ba"),
        prop: "ba_prop_battle_club_chair_03",
        cost: 15000,
        cat: "armchair"
    },
    {
        id: 85,
        name: langStringDefault("houses.furniture.furniture.config.00a3b90618fd4429ffd7f6ce78f863fa"),
        prop: "bkr_prop_biker_boardchair01",
        cost: 15000,
        cat: "armchair"
    },
    {
        id: 86,
        name: langStringDefault("houses.furniture.furniture.config.63a5ebe1399cc2bf5cf47d996b5d848c"),
        prop: "bkr_prop_biker_chairstrip_01",
        cost: 15000,
        cat: "armchair"
    },
    {
        id: 87,
        name: langStringDefault("houses.furniture.furniture.config.b763b1ffd396bf5aed04fd7410c9e338"),
        prop: "bkr_prop_clubhouse_armchair_01a",
        cost: 30000,
        cat: "armchair"
    },
    {
        id: 88,
        name: langStringDefault("houses.furniture.furniture.config.3caf7e645914ae0b98b92102aec0d9b8"),
        prop: "bkr_prop_weed_chair_01a",
        cost: 13000,
        cat: "chair"
    },
    {
        id: 89,
        name: langStringDefault("houses.furniture.furniture.config.b02cb292e8d5a6c735545da9e1f35626"),
        prop: "ex_mp_h_off_easychair_01",
        cost: 15000,
        cat: "armchair"
    },
    {
        id: 90,
        name: langStringDefault("houses.furniture.furniture.config.84b7aabdb8efc3839bd4c7ed535b646f"),
        prop: "ex_mp_h_off_chairstrip_01",
        cost: 25000,
        cat: "armchair"
    },
    {
        id: 91,
        name: langStringDefault("houses.furniture.furniture.config.813f914b317dcf813b1a5dcf7b01eec7"),
        prop: "ex_mp_h_stn_chairstrip_010",
        cost: 25000,
        cat: "armchair"
    },
    {
        id: 92,
        name: langStringDefault("houses.furniture.furniture.config.e73db0f36287d4c7184ab0126fa96b9a"),
        prop: "ex_mp_h_stn_chairstrip_011",
        cost: 25000,
        cat: "armchair"
    },
    {
        id: 93,
        name: langStringDefault("houses.furniture.furniture.config.c850683cd3868b8adf53365692bae8d0"),
        prop: "ex_mp_h_stn_chairstrip_07",
        cost: 25000,
        cat: "armchair"
    },
    {
        id: 94,
        name: langStringDefault("houses.furniture.furniture.config.fbd4142289fb3d1cf623470f50140379"),
        prop: "ex_prop_offchair_exec_01",
        cost: 20000,
        cat: "armchair"
    },
    {
        id: 95,
        name: langStringDefault("houses.furniture.furniture.config.88386eb66b3b06d56315febb5de2aad4"),
        prop: "ex_prop_offchair_exec_03",
        cost: 10000,
        cat: "chair"
    },
    {
        id: 96,
        name: langStringDefault("houses.furniture.furniture.config.1137961d4d5a2197b2e1f7863cfae38f"),
        prop: "hei_heist_stn_chairarm_04",
        cost: 30000,
        cat: "armchair"
    },
    {
        id: 97,
        name: langStringDefault("houses.furniture.furniture.config.3076282a2b237a0e357e229ae9a4f7e5"),
        prop: "hei_heist_stn_chairarm_06",
        cost: 15000,
        cat: "armchair"
    },
    {
        id: 98,
        name: langStringDefault("houses.furniture.furniture.config.cd1f04990f886096a50077b625d5f4ca"),
        prop: "hei_heist_stn_chairstrip_01",
        cost: 25000,
        cat: "armchair"
    },
    {
        id: 99,
        name: langStringDefault("houses.furniture.furniture.config.5924081fa8e17014dcdc2ae4542e4cc2"),
        prop: "imp_prop_impexp_offchair_01a",
        cost: 30000,
        cat: "chair"
    },
    {
        id: 100,
        name: langStringDefault("houses.furniture.furniture.config.18f259644b328d1f0d11911acd96eb84"),
        prop: "prop_chair_02",
        cost: 10000,
        cat: "chair"
    },
    {
        id: 101,
        name: langStringDefault("houses.furniture.furniture.config.fcb3097ac613037cede8ef53aa0ff007"),
        prop: "prop_chair_03",
        cost: 13000,
        cat: "chair"
    },
    {
        id: 102,
        name: langStringDefault("houses.furniture.furniture.config.d637cbd015546a5dcc4ad74a66af8d3d"),
        prop: "prop_chair_04a",
        cost: 25000,
        cat: "chair"
    },
    {
        id: 103,
        name: langStringDefault("houses.furniture.furniture.config.f3a8b93953f318118516ce4d1637b526"),
        prop: "prop_chair_04b",
        cost: 25000,
        cat: "chair"
    },
    {
        id: 104,
        name: langStringDefault("houses.furniture.furniture.config.328ab3e933e6ce1cf9de201e9ff4dd29"),
        prop: "prop_chair_05",
        cost: 20000,
        cat: "armchair"
    },
    {
        id: 105,
        name: langStringDefault("houses.furniture.furniture.config.808962c8df6a5ea138b1f20c7dbfe3c1"),
        prop: "prop_clown_chair",
        cost: 10000,
        cat: "chair"
    },
    {
        id: 106,
        name: langStringDefault("houses.furniture.furniture.config.269d55ce2f23f94300270f382f744b25"),
        prop: "prop_cs_office_chair",
        cost: 10000,
        cat: "chair"
    },
    {
        id: 107,
        name: langStringDefault("houses.furniture.furniture.config.b761035fb57d574feba0943abb5932b5"),
        prop: "prop_off_chair_05",
        cost: 15000,
        cat: "chair"
    },
    {
        id: 108,
        name: langStringDefault("houses.furniture.furniture.config.935266a8a5b291777daa50cf31367ab2"),
        prop: "p_armchair_01_s",
        cost: 60000,
        cat: "armchair"
    },
    {
        id: 109,
        name: langStringDefault("houses.furniture.furniture.config.598118c1f9dcbd6e7a01eb2e43d1ab9a"),
        prop: "p_dinechair_01_s",
        cost: 35000,
        cat: "chair"
    },
    {
        id: 110,
        name: langStringDefault("houses.furniture.furniture.config.be6fd929d289864652b1225ac4a2bb4a"),
        prop: "apa_mp_h_bed_double_08",
        cost: 50000,
        cat: "bed"
    },
    {
        id: 111,
        name: langStringDefault("houses.furniture.furniture.config.9a165fec090485cf379cd230d283b738"),
        prop: "apa_mp_h_bed_double_09",
        cost: 50000,
        cat: "bed"
    },
    {
        id: 112,
        name: langStringDefault("houses.furniture.furniture.config.0503e2f8a56e96230a70f6447850b4ff"),
        prop: "apa_mp_h_bed_wide_05",
        cost: 55000,
        cat: "bed"
    },
    {
        id: 113,
        name: langStringDefault("houses.furniture.furniture.config.b6e72ade2bfa2f25e90c3efbeafe9d79"),
        prop: "apa_mp_h_yacht_bed_01",
        cost: 60000,
        cat: "bed"
    },
    {
        id: 114,
        name: langStringDefault("houses.furniture.furniture.config.c36c16f0e059a567b461485cc9657254"),
        prop: "apa_mp_h_bed_with_table_02",
        cost: 80000,
        cat: "bed"
    },
    {
        id: 115,
        name: langStringDefault("houses.furniture.furniture.config.a55d8ef339c0a221b3f6836034216924"),
        prop: "apa_mp_h_yacht_bed_02",
        cost: 90000,
        cat: "bed"
    },
    {
        id: 116,
        name: langStringDefault("houses.furniture.furniture.config.c391f2e07df0015ce6a09008213b9fd8"),
        prop: "gr_prop_bunker_bed_01",
        cost: 10000,
        cat: "bed"
    },
    {
        id: 117,
        name: langStringDefault("houses.furniture.furniture.config.51344aa4dec01a484e92902173c505dd"),
        prop: "ex_prop_exec_bed_01",
        cost: 20000,
        cat: "bed"
    },
    {
        id: 118,
        name: langStringDefault("houses.furniture.furniture.config.1bc6f47f08176c3eca89a702eeed503b"),
        prop: "p_lestersbed_s",
        cost: 5000,
        cat: "bed"
    },
    {
        id: 119,
        name: langStringDefault("houses.furniture.furniture.config.e1196f06580d7f257b12625facb85a7c"),
        prop: "p_mbbed_s",
        cost: 100000,
        cat: "bed"
    },
    {
        id: 120,
        name: langStringDefault("houses.furniture.furniture.config.24b420bde7c3ebc84f623940b2de444b"),
        prop: "v_res_msonbed_s",
        cost: 50000,
        cat: "bed"
    },
    {
        id: 121,
        name: langStringDefault("houses.furniture.furniture.config.b9e21c5cda9cb77ea00c53f27475909d"),
        prop: "hei_heist_bed_table_dble_04",
        cost: 15000,
        cat: "chest"
    },
    {
        id: 122,
        name: langStringDefault("houses.furniture.furniture.config.bc32386001d0fc92ebdd608dc099474c"),
        prop: "apa_mp_h_bed_table_wide_12",
        cost: 15000,
        cat: "chest"
    },
    {
        id: 123,
        name: langStringDefault("houses.furniture.furniture.config.19154d931c1bc876ff02abfe9a9e1a19"),
        prop: "apa_mp_h_din_table_01",
        cost: 35000,
        cat: "table"
    },
    {
        id: 124,
        name: langStringDefault("houses.furniture.furniture.config.1d4076b3a2495df431cd2cc2dc7aa096"),
        prop: "apa_mp_h_din_table_04",
        cost: 35000,
        cat: "table"
    },
    {
        id: 125,
        name: langStringDefault("houses.furniture.furniture.config.95feae22700cf90396f7012e3d63cf4f"),
        prop: "apa_mp_h_din_table_05",
        cost: 30000,
        cat: "table"
    },
    {
        id: 126,
        name: langStringDefault("houses.furniture.furniture.config.f3e2602a0c3db0447af973e9f10bc029"),
        prop: "apa_mp_h_din_table_06",
        cost: 30000,
        cat: "table"
    },
    {
        id: 127,
        name: langStringDefault("houses.furniture.furniture.config.43d11b0109603166fbb780cf37ca6f70"),
        prop: "ba_prop_int_edgy_table_01",
        cost: 15000,
        cat: "table"
    },
    {
        id: 128,
        name: langStringDefault("houses.furniture.furniture.config.da44119a695145306d78d72a4d0c3302"),
        prop: "ba_prop_int_edgy_table_02",
        cost: 15000,
        cat: "table"
    },
    {
        id: 129,
        name: langStringDefault("houses.furniture.furniture.config.9e8f14c7d211dbd460875192afbd2310"),
        prop: "ba_prop_int_glam_table",
        cost: 10000,
        cat: "table"
    },
    {
        id: 130,
        name: langStringDefault("houses.furniture.furniture.config.3809eaabfdee8614f28840371d63776d"),
        prop: "gr_dlc_gr_yacht_props_table_03",
        cost: 15000,
        cat: "table"
    },
    {
        id: 131,
        name: langStringDefault("houses.furniture.furniture.config.febb5944e985497b345776ff0afd298e"),
        prop: "hei_heist_din_table_06",
        cost: 100000,
        cat: "table"
    },
    {
        id: 132,
        name: langStringDefault("houses.furniture.furniture.config.910aad0e14888eaf037182d5ba11b7f4"),
        prop: "hei_heist_din_table_07",
        cost: 25000,
        cat: "table"
    },
    {
        id: 133,
        name: langStringDefault("houses.furniture.furniture.config.fbba225af59a5cbc3c9a628acd719d89"),
        prop: "prop_table_04",
        cost: 20000,
        cat: "table"
    },
    {
        id: 134,
        name: langStringDefault("houses.furniture.furniture.config.dea89ba2f718bc97bf86268440b17975"),
        prop: "prop_table_06",
        cost: 15000,
        cat: "table"
    },
    {
        id: 135,
        name: langStringDefault("houses.furniture.furniture.config.bb5e35497acb2e67f0946cf50ffd2b7b"),
        prop: "apa_mp_h_yacht_coffee_table_01",
        cost: 20000,
        cat: "table"
    },
    {
        id: 136,
        name: langStringDefault("houses.furniture.furniture.config.dbfd9878f76a28259a2eaf7291e8d88c"),
        prop: "apa_mp_h_yacht_coffee_table_02",
        cost: 20000,
        cat: "table"
    },
    {
        id: 137,
        name: langStringDefault("houses.furniture.furniture.config.25f32ab9199cf78479d23d6a19f7732b"),
        prop: "apa_mp_h_yacht_side_table_01",
        cost: 15000,
        cat: "table"
    },
    {
        id: 138,
        name: langStringDefault("houses.furniture.furniture.config.07afa5e3970dd606ee8d2e96633a3e74"),
        prop: "apa_mp_h_yacht_side_table_02",
        cost: 10000,
        cat: "table"
    },
    {
        id: 139,
        name: langStringDefault("houses.furniture.furniture.config.97893b6c04a9f1f36525ddc29fbc659b"),
        prop: "ch_prop_ch_coffe_table_02",
        cost: 15000,
        cat: "table"
    },
    {
        id: 140,
        name: langStringDefault("houses.furniture.furniture.config.89962b9ba0c311b0591e8aa863f3ba9c"),
        prop: "ch_prop_table_casino_short_02a",
        cost: 10000,
        cat: "table"
    },
    {
        id: 141,
        name: langStringDefault("houses.furniture.furniture.config.b46405156effafff934531148e4a4835"),
        prop: "hei_prop_yah_table_01",
        cost: 10000,
        cat: "table"
    },
    {
        id: 142,
        name: langStringDefault("houses.furniture.furniture.config.455eb65f655617b8160b9b5ecec62a2f"),
        prop: "hei_prop_yah_table_02",
        cost: 15000,
        cat: "table"
    },
    {
        id: 143,
        name: langStringDefault("houses.furniture.furniture.config.a23d83b56dc4122bb7f6e448ae9529f2"),
        prop: "prop_fbi3_coffee_table",
        cost: 10000,
        cat: "table"
    },
    {
        id: 144,
        name: langStringDefault("houses.furniture.furniture.config.e8c77e2c25e1a1b72f3c611d60480a06"),
        prop: "prop_patio_lounger1_table",
        cost: 5000,
        cat: "table"
    },
    {
        id: 145,
        name: langStringDefault("houses.furniture.furniture.config.042ccc76969fa59ea64335391c047795"),
        prop: "prop_tablesmall_01",
        cost: 10000,
        cat: "table"
    },
    {
        id: 146,
        name: langStringDefault("houses.furniture.furniture.config.033e11aab9b9e3f40cf2a532648cf5c3"),
        prop: "prop_t_coffe_table",
        cost: 15000,
        cat: "table"
    },
    {
        id: 147,
        name: langStringDefault("houses.furniture.furniture.config.cd2510ea1d5814802bef0a2695e59cad"),
        prop: "apa_mp_h_floorlamp_a",
        cost: 20000,
        cat: "lamp"
    },
    {
        id: 148,
        name: langStringDefault("houses.furniture.furniture.config.f496c27a5ebd0e426d121b64a0a2fb0f"),
        prop: "apa_mp_h_floorlamp_b",
        cost: 20000,
        cat: "lamp"
    },
    {
        id: 149,
        name: langStringDefault("houses.furniture.furniture.config.3a5bc4fa1b11b0a385147eea078acead"),
        prop: "apa_mp_h_floorlamp_c",
        cost: 20000,
        cat: "lamp"
    },
    {
        id: 150,
        name: langStringDefault("houses.furniture.furniture.config.13c24e00283c0001421e660be71fce85"),
        prop: "apa_mp_h_floor_lamp_int_08",
        cost: 20000,
        cat: "lamp"
    },
    {
        id: 151,
        name: langStringDefault("houses.furniture.furniture.config.e4adb356400fa87bca6ac9ace3734945"),
        prop: "apa_mp_h_lit_floorlampnight_05",
        cost: 20000,
        cat: "lamp"
    },
    {
        id: 152,
        name: langStringDefault("houses.furniture.furniture.config.b2f401f3be5476552168bb4a54ac8205"),
        prop: "apa_mp_h_lit_floorlampnight_07",
        cost: 20000,
        cat: "lamp"
    },
    {
        id: 153,
        name: langStringDefault("houses.furniture.furniture.config.593302ee2d11a9dc82616867fc25e194"),
        prop: "apa_mp_h_lit_floorlampnight_14",
        cost: 20000,
        cat: "lamp"
    },
    {
        id: 154,
        name: langStringDefault("houses.furniture.furniture.config.4d41dad8d4f4ed2b1512dab15c668576"),
        prop: "apa_mp_h_lit_floorlamp_01",
        cost: 20000,
        cat: "lamp"
    },
    // {
    //     id: 155,
    //     name: 'Lampe 9',
    //     prop: 'apa_mp_h_lit_floorlamp_02',
    //     cost: 1,
    //     cat: 'lamp'
    // },
    {
        id: 156,
        name: langStringDefault("houses.furniture.furniture.config.93694a9ee67e069c22682e53f9e198ca"),
        prop: "apa_mp_h_lit_floorlamp_03",
        cost: 20000,
        cat: "lamp"
    },
    {
        id: 157,
        name: langStringDefault("houses.furniture.furniture.config.c524d07e469801139bbfea3b9faedf42"),
        prop: "apa_mp_h_lit_floorlamp_06",
        cost: 20000,
        cat: "lamp"
    },
    {
        id: 158,
        name: langStringDefault("houses.furniture.furniture.config.ccbff6ac8d0a31f2287fa6f6c7a5b71f"),
        prop: "apa_mp_h_lit_floorlamp_10",
        cost: 30000,
        cat: "lamp"
    },
    {
        id: 159,
        name: langStringDefault("houses.furniture.furniture.config.00a4324db21d741c21b8c510e6001fe7"),
        prop: "apa_mp_h_lit_floorlamp_13",
        cost: 30000,
        cat: "lamp"
    },
    {
        id: 160,
        name: langStringDefault("houses.furniture.furniture.config.a28ca2f5922f3273dd752700f801567c"),
        prop: "apa_mp_h_lit_floorlamp_17",
        cost: 20000,
        cat: "lamp"
    },
    {
        id: 161,
        name: langStringDefault("houses.furniture.furniture.config.cf4b4615513b512808f621ede490aeb9"),
        prop: "hei_heist_lit_floorlamp_04",
        cost: 20000,
        cat: "lamp"
    },
    {
        id: 162,
        name: langStringDefault("houses.furniture.furniture.config.8c11373aff5b3908c3667c378ebb4f30"),
        prop: "apa_mp_h_acc_plant_palm_01",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 163,
        name: langStringDefault("houses.furniture.furniture.config.5cc76296202c1cb5118dbf4a9fa2b79c"),
        prop: "apa_mp_h_acc_plant_tall_01",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 164,
        name: langStringDefault("houses.furniture.furniture.config.16660643ec0796442695202cd852e860"),
        prop: "ch_prop_ch_planter_01",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 165,
        name: langStringDefault("houses.furniture.furniture.config.5e7db3b689022f838b2bd4f08d9750e3"),
        prop: "prop_plant_int_01a",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 166,
        name: langStringDefault("houses.furniture.furniture.config.2cacc473db9fa1759617fa6fdf8ae0c8"),
        prop: "prop_plant_int_03a",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 167,
        name: langStringDefault("houses.furniture.furniture.config.5373792abcf434cc0411cc0be076d403"),
        prop: "prop_plant_int_03b",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 168,
        name: langStringDefault("houses.furniture.furniture.config.ccabb0f419279a9ac72f7ae9691c3836"),
        prop: "prop_plant_int_03c",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 169,
        name: langStringDefault("houses.furniture.furniture.config.8ab51d48d773976551955c9c8f8f24a8"),
        prop: "p_int_jewel_plant_02",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 170,
        name: langStringDefault("houses.furniture.furniture.config.bd1c5722d67d8b758881fd7b7c0bb3f3"),
        prop: "prop_ld_int_safe_01",
        cost: 70000,
        cat: "decor"
    },
    {
        id: 171,
        name: langStringDefault("houses.furniture.furniture.config.d908b384f4be95b9f040b598705d132b"),
        prop: "p_v_43_safe_s",
        cost: 100000,
        cat: "decor"
    },
    // {
    //     id: 172,
    //     name: 'Weißer Schrank',
    //     prop: 'p_v_43_safe_s',
    //     cost: 1,
    //     cat: 'chest'
    // },
    // {
    //     id: 173,
    //     name: 'Weißer Schrank',
    //     prop: 'p_v_43_safe_s',
    //     cost: 1,
    //     cat: 'chest'
    // },
    {
        id: 174,
        name: langStringDefault("houses.furniture.furniture.config.be383ad9785eb938a82d2bbeaa13222e"),
        prop: "apa_mp_h_acc_artwalll_01",
        cost: 16000, cat: "decor"
    },
    {
        id: 175,
        name: langStringDefault("houses.furniture.furniture.config.e5f7ea5a31a86309d31bea2f8c7a106f"),
        prop: "apa_mp_h_acc_artwalll_02",
        cost: 16000,
        cat: "decor"
    },
    {
        id: 176,
        name: langStringDefault("houses.furniture.furniture.config.80d3781f4684db72b8ae8cc95dc688c3"),
        prop: "apa_mp_h_acc_artwalll_03",
        cost: 16000, cat: "decor"
    },
    {
        id: 177,
        name: langStringDefault("houses.furniture.furniture.config.4d346c4f2bc02afa7126c1001f183411"),
        prop: "apa_mp_h_acc_artwallm_02",
        cost: 16000, cat: "decor"
    },
    {
        id: 178,
        name: langStringDefault("houses.furniture.furniture.config.25b76132495108cab3d89266bad147a8"),
        prop: "apa_mp_h_acc_artwallm_03",
        cost: 16000, cat: "decor"
    },
    {
        id: 179,
        name: langStringDefault("houses.furniture.furniture.config.339db4954fd9d1d5f5921725844999d0"),
        prop: "apa_mp_h_acc_artwallm_04",
        cost: 16000, cat: "decor"
    },
    {
        id: 180,
        name: langStringDefault("houses.furniture.furniture.config.bd792c4dc629d7574440162d51896bd3"),
        prop: "apa_p_h_acc_artwalll_01",
        cost: 16000, cat: "decor"
    },
    {
        id: 181,
        name: langStringDefault("houses.furniture.furniture.config.3b732ac8439ece9ecf61ecfa7cf210eb"),
        prop: "apa_p_h_acc_artwalll_02",
        cost: 16000, cat: "decor"
    },
    {
        id: 182,
        name: langStringDefault("houses.furniture.furniture.config.707e029c6437c5b9628b69a5503b2418"),
        prop: "apa_p_h_acc_artwalll_03",
        cost: 15000, cat: "decor"
    },
    {
        id: 183,
        name: langStringDefault("houses.furniture.furniture.config.9c92f6e2b11a8d5a21959a877427fa9d"),
        prop: "apa_p_h_acc_artwallm_04",
        cost: 16000, cat: "decor"
    },
    {
        id: 184,
        name: langStringDefault("houses.furniture.furniture.config.d9d953638bae22348f24c2790bf70752"),
        prop: "apa_p_h_acc_artwalls_03",
        cost: 10000, cat: "decor"
    },
    {
        id: 185,
        name: langStringDefault("houses.furniture.furniture.config.63205b897376bc93d9169456608f4981"),
        prop: "apa_p_h_acc_artwalls_04",
        cost: 10000, cat: "decor"
    },
    // {
    //     id: 186,
    //     name: 'Malerei 13',
    //     prop: 'apa_p_h_acc_artwalls_04',
    //     cost: 1, cat: 'decor'
    // },
    {
        id: 187,
        name: langStringDefault("houses.furniture.furniture.config.54a7df8ff22ce532cb4a30fcb4c0bf63"),
        prop: "hei_heist_acc_artgolddisc_01",
        cost: 20000, cat: "decor"
    },
    {
        id: 188,
        name: langStringDefault("houses.furniture.furniture.config.f87db1bc7a45e95fd97dc70916e14f62"),
        prop: "hei_heist_acc_artgolddisc_02",
        cost: 20000, cat: "decor"
    },
    {
        id: 189,
        name: langStringDefault("houses.furniture.furniture.config.d296ab2f551013c61cbc91661d858a6c"),
        prop: "hei_heist_acc_artgolddisc_03",
        cost: 20000, cat: "decor"
    },
    {
        id: 190,
        name: langStringDefault("houses.furniture.furniture.config.75fe7b58bfe6254a48355c2801f01943"),
        prop: "hei_heist_acc_artgolddisc_04",
        cost: 20000, cat: "decor"
    },
    {
        id: 191,
        name: langStringDefault("houses.furniture.furniture.config.3105b9550cb087ef8197b0918530f2f7"),
        prop: "vw_prop_casino_art_console_01a",
        cost: 10000, cat: "decor"
    },
    {
        id: 192,
        name: langStringDefault("houses.furniture.furniture.config.94528be4ed724f0b8b534fc3261a6bbe"),
        prop: "vw_prop_casino_art_console_02a",
        cost: 30000, cat: "decor"
    },
    {
        id: 193,
        name: langStringDefault("houses.furniture.furniture.config.f5c0feddc213030634f6afbcae458006"),
        prop: "vw_prop_casino_art_miniature_05a",
        cost: 25000, cat: "decor"
    },
    {
        id: 194,
        name: langStringDefault("houses.furniture.furniture.config.1955974b8b5a81bf2e5a3a1c386a7c17"),
        prop: "vw_prop_casino_art_miniature_05b",
        cost: 30000, cat: "decor"
    },
    {
        id: 195,
        name: langStringDefault("houses.furniture.furniture.config.4874f0a8a62ad6282644b03cff7a2e4b"),
        prop: "vw_prop_casino_art_miniature_05c",
        cost: 50000, cat: "decor"
    },
    {
        id: 196,
        name: langStringDefault("houses.furniture.furniture.config.0c79fbfc5f0d403c615c241e26876a9e"),
        prop: "vw_prop_casino_art_miniature_09a",
        cost: 30000, cat: "decor"
    },
    {
        id: 197,
        name: langStringDefault("houses.furniture.furniture.config.41495ab41fa475161de768d027967cd8"),
        prop: "vw_prop_casino_art_miniature_09b",
        cost: 35000, cat: "decor"
    },
    {
        id: 198,
        name: langStringDefault("houses.furniture.furniture.config.d359f2deebf7ed007273ae10a767961a"),
        prop: "vw_prop_casino_art_miniature_09c",
        cost: 50000, cat: "decor"
    },
    {
        id: 199,
        name: langStringDefault("houses.furniture.furniture.config.2cfc2cb8f96eaf13df1d97f762ad9bff"),
        prop: "vw_prop_casino_art_sculpture_01a",
        cost: 100000, cat: "decor"
    },
    {
        id: 200,
        name: langStringDefault("houses.furniture.furniture.config.32c979543275e03dc930178097b9da2f"),
        prop: "vw_prop_casino_art_sculpture_02a",
        cost: 150000, cat: "decor"
    },
    {
        id: 201,
        name: langStringDefault("houses.furniture.furniture.config.bd111ecdff11fbc91210ae0c7f008f3c"),
        prop: "vw_prop_casino_art_sculpture_02b",
        cost: 100000, cat: "decor"
    },
    {
        id: 202,
        name: langStringDefault("houses.furniture.furniture.config.9f622791aa54a1ee86c5054b39ca92a4"),
        prop: "vw_prop_casino_art_skull_01a",
        cost: 30000, cat: "decor"
    },
    {
        id: 203,
        name: langStringDefault("houses.furniture.furniture.config.f5b58a7e0c61f680ae88b33df8c85ada"),
        prop: "vw_prop_casino_art_skull_01b",
        cost: 30000, cat: "decor"
    },
    {
        id: 204,
        name: langStringDefault("houses.furniture.furniture.config.97e24ffaaf9bb9ba17358496fa6b17c2"),
        prop: "vw_prop_casino_art_skull_02a",
        cost: 30000, cat: "decor"
    },
    {
        id: 205,
        name: langStringDefault("houses.furniture.furniture.config.3ed8abb90240d7f042c513c53b9eed02"),
        prop: "vw_prop_casino_art_skull_02b",
        cost: 30000, cat: "decor"
    },
    {
        id: 206,
        name: langStringDefault("houses.furniture.furniture.config.2c1a489aa2b2335934d5160ce4366d7a"),
        prop: "vw_prop_casino_art_skull_03a",
        cost: 30000, cat: "decor"
    },
    {
        id: 207,
        name: langStringDefault("houses.furniture.furniture.config.93ee9e9c094ee0ff5cab2765aa5967a8"),
        prop: "vw_prop_casino_art_skull_03b",
        cost: 30000, cat: "decor"
    },
    {
        id: 208,
        name: langStringDefault("houses.furniture.furniture.config.108085969b722c13ae3cb113bb44f3e2"),
        prop: "vw_prop_casino_art_statue_01a",
        cost: 200000, cat: "decor"
    },
    {
        id: 209,
        name: langStringDefault("houses.furniture.furniture.config.43646550b5f365f73a1a3f5720698121"),
        prop: "vw_prop_casino_art_statue_02a",
        cost: 200000, cat: "decor"
    },
    {
        id: 210,
        name: langStringDefault("houses.furniture.furniture.config.3da5e98d3a6c88a17764672a21debdab"),
        prop: "vw_prop_casino_art_bird_01a",
        cost: 70000, cat: "decor"
    },
    {
        id: 211,
        name: langStringDefault("houses.furniture.furniture.config.1e04158adcab28f4a927ea610b37d85e"),
        prop: "vw_prop_casino_art_car_01a",
        cost: 10000, cat: "decor"
    },
    {
        id: 212,
        name: langStringDefault("houses.furniture.furniture.config.1f59d31897d4700cbd721da6e28a2ecb"),
        prop: "vw_prop_casino_art_car_02a",
        cost: 20000, cat: "decor"
    },
    {
        id: 213,
        name: langStringDefault("houses.furniture.furniture.config.097c123a4386aaf43d4950e2384f7138"),
        prop: "vw_prop_casino_art_car_03a",
        cost: 15000, cat: "decor"
    },
    {
        id: 214,
        name: langStringDefault("houses.furniture.furniture.config.2ed56072cf6a8565d224214f7d12a89f"),
        prop: "vw_prop_casino_art_car_04a",
        cost: 50900, cat: "decor"
    },
    {
        id: 215,
        name: langStringDefault("houses.furniture.furniture.config.f9dd951142a4e9c37bd42cb34a81a35b"),
        prop: "vw_prop_casino_art_car_05a",
        cost: 33000, cat: "decor"
    },
    {
        id: 216,
        name: langStringDefault("houses.furniture.furniture.config.663a27d9ed12fc64563bbede545c51d1"),
        prop: "vw_prop_casino_art_car_06a",
        cost: 20000, cat: "decor"
    },
    {
        id: 217,
        name: langStringDefault("houses.furniture.furniture.config.8631fcaad358636aae7938bb34cddd33"),
        prop: "vw_prop_casino_art_car_07a",
        cost: 30000, cat: "decor"
    },
    {
        id: 218,
        name: langStringDefault("houses.furniture.furniture.config.05b567fd0b7e80a719f3616ae9ab1e78"),
        prop: "vw_prop_casino_art_car_08a",
        cost: 20000, cat: "decor"
    },
    {
        id: 219,
        name: langStringDefault("houses.furniture.furniture.config.5362017897ec90c8dc79095f18e9c9ec"),
        prop: "vw_prop_casino_art_car_09a",
        cost: 30000, cat: "decor"
    },
    {
        id: 220,
        name: langStringDefault("houses.furniture.furniture.config.400e84481a01ca8085e5428155f675a8"),
        prop: "vw_prop_casino_art_car_10a",
        cost: 25000, cat: "decor"
    },
    {
        id: 221,
        name: langStringDefault("houses.furniture.furniture.config.005038f6f9d84a5c3a121f8948ebae82"),
        prop: "vw_prop_casino_art_car_11a",
        cost: 40000, cat: "decor"
    },
    {
        id: 222,
        name: langStringDefault("houses.furniture.furniture.config.94a32660629cc6b14a29ae6a7ee5938b"),
        prop: "vw_prop_casino_art_car_12a",
        cost: 15000, cat: "decor"
    },
    {
        id: 223,
        name: langStringDefault("houses.furniture.furniture.config.b49785c32ec24b9b69dd03fc2e291d6a"),
        prop: "vw_prop_casino_art_cherries_01a",
        cost: 100000, cat: "decor"
    },
    {
        id: 224,
        name: langStringDefault("houses.furniture.furniture.config.8675052df46a7de6233a82d7dd1805c2"),
        prop: "vw_prop_casino_art_deer_01a",
        cost: 50000, cat: "decor"
    },
    {
        id: 225,
        name: langStringDefault("houses.furniture.furniture.config.f6eb68ace4be806efe9eca890d2f1e7f"),
        prop: "vw_prop_casino_art_dog_01a",
        cost: 50000, cat: "decor"
    },
    {
        id: 226,
        name: langStringDefault("houses.furniture.furniture.config.1cadc6bb68208350382010ff8fd4abeb"),
        prop: "vw_prop_casino_art_egg_01a",
        cost: 30000, cat: "decor"
    },
    {
        id: 227,
        name: langStringDefault("houses.furniture.furniture.config.c46a8160864d9dcd035d116de05bb663"),
        prop: "vw_prop_casino_art_figurines_01a",
        cost: 10000, cat: "decor"
    },
    {
        id: 228,
        name: langStringDefault("houses.furniture.furniture.config.213e86ca2bbb2567278f95c218fff080"),
        prop: "vw_prop_casino_art_figurines_02a",
        cost: 10000, cat: "decor"
    },
    {
        id: 229,
        name: langStringDefault("houses.furniture.furniture.config.53adc8f60d04befd9c4be2dfcd5c1139"),
        prop: "vw_prop_casino_art_grenade_01a",
        cost: 50000, cat: "decor"
    },
    {
        id: 230,
        name: langStringDefault("houses.furniture.furniture.config.18323fe816d39e78c865a3b5c0bf9311"),
        prop: "vw_prop_casino_art_grenade_01b",
        cost: 30000, cat: "decor"
    },
    {
        id: 231,
        name: langStringDefault("houses.furniture.furniture.config.bd809aa4eb081400a727597e815953a2"),
        prop: "vw_prop_casino_art_grenade_01c",
        cost: 20000, cat: "decor"
    },
    {
        id: 232,
        name: langStringDefault("houses.furniture.furniture.config.c29f00d5020bf0156b120de04f68192e"),
        prop: "vw_prop_casino_art_grenade_01d",
        cost: 25000, cat: "decor"
    },
    {
        id: 233,
        name: langStringDefault("houses.furniture.furniture.config.0705f0ac233d2a743a370ea799529619"),
        prop: "vw_prop_casino_art_guitar_01a",
        cost: 25000, cat: "decor"
    },
    {
        id: 234,
        name: langStringDefault("houses.furniture.furniture.config.2ba38e5930091e2b36f59762d06eb963"),
        prop: "vw_prop_casino_art_gun_01a",
        cost: 50000, cat: "decor"
    },
    {
        id: 235,
        name: langStringDefault("houses.furniture.furniture.config.91478178094e33754c7ddf830bd3f495"),
        prop: "vw_prop_casino_art_gun_02a",
        cost: 100000, cat: "decor"
    },
    {
        id: 236,
        name: langStringDefault("houses.furniture.furniture.config.6b409265e678626d6829c100ce2f8204"),
        prop: "vw_prop_casino_art_head_01a",
        cost: 30000, cat: "decor"
    },
    {
        id: 237,
        name: langStringDefault("houses.furniture.furniture.config.f7cab187f9cbd9827a5e3a92f7711556"),
        prop: "vw_prop_casino_art_head_01b",
        cost: 40000, cat: "decor"
    },
    {
        id: 238,
        name: langStringDefault("houses.furniture.furniture.config.3455c2a73a8872cc0f14a91286ff5400"),
        prop: "vw_prop_casino_art_head_01c",
        cost: 20000, cat: "decor"
    },
    {
        id: 239,
        name: langStringDefault("houses.furniture.furniture.config.1fcc714c9bbd3c7fb6bdaf54add7e586"),
        prop: "vw_prop_casino_art_head_01d",
        cost: 20000, cat: "decor"
    },
    {
        id: 240,
        name: langStringDefault("houses.furniture.furniture.config.e6771f1d738f32d6466b8789970499cb"),
        prop: "vw_prop_casino_art_lampf_01a",
        cost: 25000, cat: "lamp"
    },
    {
        id: 241,
        name: langStringDefault("houses.furniture.furniture.config.b61f63dc640fb7bcfaa70581118e2a69"),
        prop: "vw_prop_casino_art_lampm_01a",
        cost: 25000, cat: "lamp"
    },
    {
        id: 242,
        name: langStringDefault("houses.furniture.furniture.config.aa7ba55826f072de7b071582a55e3bba"),
        prop: "vw_prop_casino_art_lollipop_01a",
        cost: 30000, cat: "decor"
    },
    {
        id: 243,
        name: langStringDefault("houses.furniture.furniture.config.cc58494a08d987ed64fdb7b538e00c07"),
        prop: "vw_prop_casino_art_mod_01a",
        cost: 30000, cat: "decor"
    },
    {
        id: 244,
        name: langStringDefault("houses.furniture.furniture.config.7e5c77fdd5dca2a9e5c099413a3c5850"),
        prop: "vw_prop_casino_art_mod_02a",
        cost: 15000, cat: "decor"
    },
    {
        id: 245,
        name: langStringDefault("houses.furniture.furniture.config.d32e1cce0cf69f84077547bc5239605b"),
        prop: "vw_prop_casino_art_mod_03a",
        cost: 35000, cat: "decor"
    },
    {
        id: 246,
        name: langStringDefault("houses.furniture.furniture.config.f966424ce84ea1a89f19b0546963207f"),
        prop: "vw_prop_casino_art_mod_03a_a",
        cost: 35000, cat: "decor"
    },
    {
        id: 247,
        name: langStringDefault("houses.furniture.furniture.config.4b5e65380f399c1e2bebaaad2c2bd0b3"),
        prop: "vw_prop_casino_art_mod_03a_b",
        cost: 35000, cat: "decor"
    },
    {
        id: 248,
        name: langStringDefault("houses.furniture.furniture.config.ced62e80b222a4cd1dff7006d0fadb0c"),
        prop: "vw_prop_casino_art_mod_03a_c",
        cost: 35000, cat: "decor"
    },
    {
        id: 249,
        name: langStringDefault("houses.furniture.furniture.config.01ac0f360426d8550ea4ece0a0c21894"),
        prop: "vw_prop_casino_art_mod_03b",
        cost: 30000, cat: "decor"
    },
    {
        id: 250,
        name: langStringDefault("houses.furniture.furniture.config.a7ed2985b6afebea7b0121cf9ef636cb"),
        prop: "vw_prop_casino_art_mod_03b_a",
        cost: 30000, cat: "decor"
    },
    {
        id: 251,
        name: langStringDefault("houses.furniture.furniture.config.7654ef750834f425160e47b269239382"),
        prop: "vw_prop_casino_art_mod_03b_b",
        cost: 30000, cat: "decor"
    },
    {
        id: 252,
        name: langStringDefault("houses.furniture.furniture.config.57b7a7f2c1721088e1351d85c667cb5b"),
        prop: "vw_prop_casino_art_mod_03b_c",
        cost: 30000, cat: "decor"
    },
    {
        id: 253,
        name: langStringDefault("houses.furniture.furniture.config.99c68f6fd5096db2e18a1ac7d350f050"),
        prop: "vw_prop_casino_art_mod_04a",
        cost: 15000, cat: "decor"
    },
    {
        id: 254,
        name: langStringDefault("houses.furniture.furniture.config.e6691739e2887b5d1e05d1f8ddb320d9"),
        prop: "vw_prop_casino_art_mod_05a",
        cost: 15000, cat: "decor"
    },
    {
        id: 255,
        name: langStringDefault("houses.furniture.furniture.config.7e49649210e2a7fbb9781e6a0ecf2d46"),
        prop: "vw_prop_casino_art_mod_06a",
        cost: 40000, cat: "decor"
    },
    {
        id: 256,
        name: langStringDefault("houses.furniture.furniture.config.5e553cb04ca43e0d259f432ecffc3787"),
        prop: "vw_prop_casino_art_sh_01a",
        cost: 15000, cat: "decor"
    },
    {
        id: 257,
        name: langStringDefault("houses.furniture.furniture.config.75c2cb6758c5f40da7a3c1299031c739"),
        prop: "vw_prop_casino_art_vase_01a",
        cost: 10000, cat: "decor"
    },
    {
        id: 258,
        name: langStringDefault("houses.furniture.furniture.config.e5bf1678290cc2a7ec0981448f2579f4"),
        prop: "vw_prop_casino_art_vase_02a",
        cost: 10000, cat: "decor"
    },
    {
        id: 259,
        name: langStringDefault("houses.furniture.furniture.config.68caadef20bfe5934b61a99aa04d95e1"),
        prop: "vw_prop_casino_art_vase_03a",
        cost: 10000, cat: "decor"
    },
    {
        id: 260,
        name: langStringDefault("houses.furniture.furniture.config.10cd43ee09ba823199f1ddc9b2d2e2d9"),
        prop: "vw_prop_casino_art_vase_04a",
        cost: 10000, cat: "decor"
    },
    {
        id: 261,
        name: langStringDefault("houses.furniture.furniture.config.2fa67cbb5a866b5e6168e937c04d08be"),
        prop: "vw_prop_casino_art_vase_05a",
        cost: 10000, cat: "decor"
    },
    {
        id: 262,
        name: langStringDefault("houses.furniture.furniture.config.c1e118d2c8eee9f3bfd8c45cd0fc0ea6"),
        prop: "vw_prop_casino_art_vase_06a",
        cost: 10000, cat: "decor"
    },
    {
        id: 263,
        name: langStringDefault("houses.furniture.furniture.config.17088f7f092e4210bfdb44dae4560d2d"),
        prop: "vw_prop_casino_art_vase_07a",
        cost: 10000, cat: "decor"
    },
    {
        id: 264,
        name: langStringDefault("houses.furniture.furniture.config.fc62cd09533ddfa7de873e080d29bdd6"),
        prop: "vw_prop_casino_art_vase_08a",
        cost: 10000, cat: "decor"
    },
    {
        id: 265,
        name: langStringDefault("houses.furniture.furniture.config.5f245f406dd99e87c772dfe770e138fd"),
        prop: "vw_prop_casino_art_vase_09a",
        cost: 10000, cat: "decor"
    },
    {
        id: 266,
        name: langStringDefault("houses.furniture.furniture.config.0c8770b4e76201ff380a9b609f297d2a"),
        prop: "vw_prop_casino_art_vase_10a",
        cost: 10000, cat: "decor"
    },
    {
        id: 267,
        name: langStringDefault("houses.furniture.furniture.config.edf9712489f54c46f4e10e0bca0e0672"),
        prop: "vw_prop_casino_art_vase_11a",
        cost: 10000, cat: "decor"
    },
    {
        id: 268,
        name: langStringDefault("houses.furniture.furniture.config.ae1dc12b6ec238089bb1451a14d6b4a9"),
        prop: "vw_prop_casino_art_vase_12a",
        cost: 10000, cat: "decor"
    },
    {
        id: 269,
        name: langStringDefault("houses.furniture.furniture.config.060397448e2077534e18b0984043509e"),
        prop: "vw_prop_art_football_01a",
        cost: 25000, cat: "decor"
    },
    {
        id: 270,
        name: langStringDefault("houses.furniture.furniture.config.28b09bdf91e7f8ff93c25b074d27cc0a"),
        prop: "vw_prop_art_mic_01a",
        cost: 25000, cat: "decor"
    },
    {
        id: 271,
        name: langStringDefault("houses.furniture.furniture.config.f7e22576ac25d11e604bd00580d7fcca"),
        prop: "vw_prop_art_pug_01a",
        cost: 35000, cat: "decor"
    },
    {
        id: 272,
        name: langStringDefault("houses.furniture.furniture.config.657057b5e6fbd417c6f90cab1dc33b17"),
        prop: "vw_prop_art_pug_01b",
        cost: 35000, cat: "decor"
    },
    {
        id: 273,
        name: langStringDefault("houses.furniture.furniture.config.9423c82dfd82ddd0a35065b6a2c902fd"),
        prop: "vw_prop_art_pug_02a",
        cost: 35000, cat: "decor"
    },
    {
        id: 274,
        name: langStringDefault("houses.furniture.furniture.config.edf69d83122b2c1543d1d27ae5938ba0"),
        prop: "vw_prop_art_pug_02b",
        cost: 35000, cat: "decor"
    },
    {
        id: 275,
        name: langStringDefault("houses.furniture.furniture.config.dfbdbb53a6e08bda1800609c8711433e"),
        prop: "vw_prop_art_pug_03a",
        cost: 35000, cat: "decor"
    },
    {
        id: 276,
        name: langStringDefault("houses.furniture.furniture.config.7f83e2701807f4f0252e98b0bb214f36"),
        prop: "vw_prop_art_pug_03b",
        cost: 35000, cat: "decor"
    },
    {
        id: 277,
        name: langStringDefault("houses.furniture.furniture.config.ddbc20f7136401b74e1b1c64a465a83b"),
        prop: "vw_prop_art_resin_balls_01a",
        cost: 80000, cat: "decor"
    },
    {
        id: 278,
        name: langStringDefault("houses.furniture.furniture.config.2093a8ddb19669f0360fb6709c4a0337"),
        prop: "vw_prop_art_resin_guns_01a",
        cost: 80000, cat: "decor"
    },
    {
        id: 279,
        name: langStringDefault("houses.furniture.furniture.config.d51f81d12ed246796901e6b8117c84ce"),
        prop: "vw_prop_art_wall_segment_01a",
        cost: 40000, cat: "decor"
    },
    {
        id: 280,
        name: langStringDefault("houses.furniture.furniture.config.6bae3213f1984a2e67bd02a16517ba17"),
        prop: "vw_prop_art_wall_segment_02a",
        cost: 25000, cat: "decor"
    },
    {
        id: 281,
        name: langStringDefault("houses.furniture.furniture.config.66d9eae083145f48bb1569688469e641"),
        prop: "vw_prop_art_wall_segment_02b",
        cost: 25000,
        cat: "decor"
    },
    {
        id: 282,
        name: langStringDefault("houses.furniture.furniture.config.58437bf57efd4185a17e234f37e8cd06"),
        prop: "vw_prop_art_wall_segment_03a",
        cost: 25000,
        cat: "decor"
    },
    {
        id: 283,
        name: langStringDefault("houses.furniture.furniture.config.7ae75e7fe1d5a4333a6efc54c151fb8b"),
        prop: "vw_prop_art_wings_01a",
        cost: 65000,
        cat: "decor"
    },
    {
        id: 284,
        name: langStringDefault("houses.furniture.furniture.config.98e2c410357d5beda11904455ff66f60"),
        prop: "vw_prop_art_wings_01b",
        cost: 65000,
        cat: "decor"
    },
    {
        id: 285,
        name: langStringDefault("houses.furniture.furniture.config.258ae999b74de786212ba7859ab6d783"),
        prop: "vw_prop_casino_art_basketball_01a",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 286,
        name: langStringDefault("houses.furniture.furniture.config.f062bca7b396adcf25ee4e070a0fe5f6"),
        prop: "vw_prop_casino_art_basketball_02a",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 287,
        name: langStringDefault("houses.furniture.furniture.config.f93c0dab19872855ac8f6b80904914ea"),
        prop: "vw_prop_casino_art_bottle_01a",
        cost: 8000,
        cat: "decor"
    },
    {
        id: 288,
        name: langStringDefault("houses.furniture.furniture.config.a2b7d8d3b05c547683b23a40c995f1b9"),
        prop: "vw_prop_casino_art_bowling_01a",
        cost: 8000,
        cat: "decor"
    },
    {
        id: 289,
        name: langStringDefault("houses.furniture.furniture.config.6fa1a09fdfcab7a613a8e5ac99dda7d2"),
        prop: "vw_prop_casino_art_bowling_01b",
        cost: 8000,
        cat: "decor"
    },
    {
        id: 290,
        name: langStringDefault("houses.furniture.furniture.config.ab6945f10c03894ff39f6d339a59fdda"),
        prop: "vw_prop_casino_art_bowling_02a",
        cost: 8000,
        cat: "decor"
    },
    {
        id: 291,
        name: langStringDefault("houses.furniture.furniture.config.109a9cf636973145f6027bbe53f39bcb"),
        prop: "vw_prop_casino_art_ego_01a",
        cost: 20000,
        cat: "decor"
    },
    {
        id: 292,
        name: langStringDefault("houses.furniture.furniture.config.30dc42f2baf00657e55fda501d4a6773"),
        prop: "vw_prop_casino_art_horse_01a",
        cost: 20000,
        cat: "decor"
    },
    {
        id: 293,
        name: langStringDefault("houses.furniture.furniture.config.38861dc3a876e06a451052f980a18aaf"),
        prop: "vw_prop_casino_art_horse_01b",
        cost: 20000,
        cat: "decor"
    },
    {
        id: 294,
        name: langStringDefault("houses.furniture.furniture.config.ade9c73625fcaac95425d0c35e50fb37"),
        prop: "vw_prop_casino_art_horse_01c",
        cost: 20000,
        cat: "decor"
    },
    {
        id: 295,
        name: langStringDefault("houses.furniture.furniture.config.b1ec53be145805f89b0d26660af5520a"),
        prop: "vw_prop_casino_art_panther_01a",
        cost: 30000,
        cat: "decor"
    },
    {
        id: 296,
        name: langStringDefault("houses.furniture.furniture.config.6e5bbaf02ffbbbed34d5f685660db3ac"),
        prop: "vw_prop_casino_art_panther_01b",
        cost: 30000,
        cat: "decor"
    },
    {
        id: 297,
        name: langStringDefault("houses.furniture.furniture.config.29ed9e15a41bf2530731c304ac34e80d"),
        prop: "vw_prop_casino_art_panther_01c",
        cost: 30000,
        cat: "decor"
    },
    // {
    //     id: 298,
    //     name: 'Kunstleinwand 1',
    //     prop: 'apa_dining_art_new',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 299,
    //     name: 'Kunstleinwand 2',
    //     prop: 'apa_mp_h_acc_artwalll_01_dressing',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 300,
    //     name: 'Kunstleinwand 3',
    //     prop: 'apa_mp_h_acc_artwallm_bed_1',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 301,
    //     name: 'Kunstleinwand 4',
    //     prop: 'apa_mp_h_acc_artwallm_bed_2',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 302,
    //     name: 'Kunstleinwand 5',
    //     prop: 'apa_mpa3_dining_art',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 303,
    //     name: 'Kunstleinwand 5',
    //     prop: 'apa_mpa3_dining_art',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 304,
    //     name: 'Modulare Bilder 1',
    //     prop: 'ex_off2b_artwall',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 305,
    //     name: 'Modulare Bilder 2',
    //     prop: 'ex_off2b_artwallrecp',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 306,
    //     name: 'Modulare Bilder 3',
    //     prop: 'ex_off2c_artwallrecp',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 307,
    //     name: 'Мodulare Bilder 4',
    //     prop: 'ex_office2c_artwall',
    //     cost: 1,
    //     cat: 'decor'
    // },
    {
        id: 308,
        name: langStringDefault("houses.furniture.furniture.config.522ec0440113eb18dd5f4c5d2587f3ef"),
        prop: "h4_prop_h4_art_pant_01a",
        cost: 20000,
        cat: "decor"
    },
    // {
    //     id: 309,
    //     name: 'Tigerstatue',
    //     prop: 'sf_int1_art_statue_tgr_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 310,
    //     name: 'Blaues Gemälde',
    //     prop: 'sf_int1_art2_operations',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 311,
    //     name: 'Teppich 1',
    //     prop: 'sf_int2_art_f2_option_2',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 312,
    //     name: 'Teppich 2',
    //     prop: 'sf_int2_art_f2_option_3',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 313,
    //     name: 'Leinwand mit einem Retroauto',
    //     prop: 'sf_int2_art_gf_option_1_f0',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 314,
    //     name: 'Teppich mit einer Kröte',
    //     prop: 'sf_int2_art_gf_option_2',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 315,
    //     name: 'Leinwand mit einer Waffe',
    //     prop: 'sf_int2_art_gf_option_3',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 316,
    //     name: 'Kunstmodell 1',
    //     prop: 'sf_prop_sf_art_car_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 317,
    //     name: 'Kunstmodell 2',
    //     prop: 'sf_prop_sf_art_car_02a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 318,
    //     name: 'Kunstmodell 3',
    //     prop: 'sf_prop_sf_art_car_03a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 319,
    //     name: 'Trophäenmodell',
    //     prop: 'sf_prop_sf_art_trophy_co_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 320,
    //     name: 'Kappenmodell',
    //     prop: 'sf_prop_art_cap_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 321,
    //     name: 'Zigarren',
    //     prop: 'sf_prop_sf_art_box_cig_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 322,
    //     name: 'Patrone 5.56',
    //     prop: 'sf_prop_sf_art_bullet_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 323,
    //     name: 'Мünzmodell',
    //     prop: 'sf_prop_sf_art_coin_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 324,
    //     name: 'Ballonhund 1',
    //     prop: 'sf_prop_sf_art_dog_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 325,
    //     name: 'Ballonhund 2',
    //     prop: 'sf_prop_sf_art_dog_01b',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 326,
    //     name: 'Ballonhund 3',
    //     prop: 'sf_prop_sf_art_dog_01c',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 327,
    //     name: 'Zigarre',
    //     prop: 'sf_prop_sf_art_roll_up_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 328,
    //     name: 'Surfbretter 1',
    //     prop: 'sf_prop_sf_art_s_board_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 329,
    //     name: 'Surfbretter 2',
    //     prop: 'sf_prop_sf_art_s_board_02a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 330,
    //     name: 'Surfbretter 3',
    //     prop: 'sf_prop_sf_art_s_board_02b',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 331,
    //     name: 'Weed Zeichen',
    //     prop: 'sf_prop_sf_art_sign_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 332,
    //     name: 'Мenschliches Modell 1',
    //     prop: 'sf_prop_sf_art_bobble_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 333,
    //     name: 'Мenschliches Modell 2',
    //     prop: 'sf_prop_sf_art_bobble_bb_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 334,
    //     name: 'Мenschliches Modell 3',
    //     prop: 'sf_prop_sf_art_bobble_bb_01b',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 335,
    //     name: 'Kegeln 4',
    //     prop: 'sf_prop_sf_art_pin_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 336,
    //     name: 'Мumie',
    //     prop: 'sf_prop_sf_art_pogo_01a',
    //     cost: 1,
    //     cat: 'decor'
    // },
    {
        id: 337,
        name: langStringDefault("houses.furniture.furniture.config.994ca78c69eac6e9df6a9ff25917cf3d"),
        prop: "prop_cs_shirt_01",
        cost: 8000,
        cat: "decor"
    },
    {
        id: 338,
        name: langStringDefault("houses.furniture.furniture.config.b52a41fed98e1fa5433cba4a11acce64"),
        prop: "prop_cs_t_shirt_pile",
        cost: 4000,
        cat: "decor"
    },
    {
        id: 339,
        name: langStringDefault("houses.furniture.furniture.config.48777597279b399f49142249192a130a"),
        prop: "prop_phys_wades_head",
        cost: 8000,
        cat: "decor"
    },
    {
        id: 340,
        name: langStringDefault("houses.furniture.furniture.config.3c98ad28ce869c09b138441f51c8bba8"),
        prop: "beerrow_local",
        cost: 25000,
        cat: "decor"
    },
    {
        id: 341,
        name: langStringDefault("houses.furniture.furniture.config.069d320fc091e64ee42e7e2d36acda6b"),
        prop: "beerrow_world",
        cost: 25000,
        cat: "decor"
    },
    {
        id: 342,
        name: langStringDefault("houses.furniture.furniture.config.99cfb7ec5729c4963b8813a0f3a072bd"),
        prop: "apa_mp_h_acc_bottle_02",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 343,
        name: langStringDefault("houses.furniture.furniture.config.0f05e28cf1544d9fa2a6167626db919d"),
        prop: "apa_mp_h_acc_bowl_ceramic_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 344,
        name: langStringDefault("houses.furniture.furniture.config.23e72663d227656fa78c3dfb3bad216a"),
        prop: "apa_mp_h_acc_candles_01",
        cost: 8000,
        cat: "decor"
    },
    {
        id: 345,
        name: langStringDefault("houses.furniture.furniture.config.45f5227ac9a6002020f4911e52f99a92"),
        prop: "apa_mp_h_acc_candles_02",
        cost: 8000,
        cat: "decor"
    },
    {
        id: 346,
        name: langStringDefault("houses.furniture.furniture.config.affe5fd827c17aec05b90bde7cb48ec1"),
        prop: "apa_mp_h_acc_candles_04",
        cost: 8000,
        cat: "decor"
    },
    {
        id: 347,
        name: langStringDefault("houses.furniture.furniture.config.cd6c8974726b9ea9e9ee9ece17ddbcd8"),
        prop: "apa_mp_h_acc_candles_05",
        cost: 8000,
        cat: "decor"
    },
    {
        id: 348,
        name: langStringDefault("houses.furniture.furniture.config.d6782964256f74fa7cdb834efb1218e7"),
        prop: "apa_mp_h_acc_candles_06",
        cost: 8000,
        cat: "decor"
    },
    {
        id: 349,
        name: langStringDefault("houses.furniture.furniture.config.41c1700ec9d5fecceeb1d922ad729f06"),
        prop: "apa_mp_h_acc_coffeemachine_01",
        cost: 20000,
        cat: "decor"
    },
    {
        id: 350,
        name: langStringDefault("houses.furniture.furniture.config.9cae7ecc31d49346fc8cc346cf9e1847"),
        prop: "apa_mp_h_acc_dec_head_01",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 351,
        name: langStringDefault("houses.furniture.furniture.config.fb7466e4ed902b9e8791609afe628f57"),
        prop: "apa_mp_h_acc_dec_plate_01",
        cost: 13000,
        cat: "decor"
    },
    {
        id: 352,
        name: langStringDefault("houses.furniture.furniture.config.7ca54ce26cb9dad1f0c892fd35cab36a"),
        prop: "apa_mp_h_acc_dec_plate_02",
        cost: 13000,
        cat: "decor"
    },
    {
        id: 353,
        name: langStringDefault("houses.furniture.furniture.config.369bfaadb22e611e4063066fb7d38647"),
        prop: "apa_mp_h_acc_dec_sculpt_03",
        cost: 8000,
        cat: "decor"
    },
    {
        id: 354,
        name: langStringDefault("houses.furniture.furniture.config.82eb5e8b40d4acb9b1ae76ea7b5ce45e"),
        prop: "apa_mp_h_acc_drink_tray_02",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 355,
        name: langStringDefault("houses.furniture.furniture.config.fca4cef4f804e7bc8122825112f7aa3e"),
        prop: "apa_mp_h_acc_fruitbowl_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 356,
        name: langStringDefault("houses.furniture.furniture.config.f7b96046e2e23836cc552328f3e1d6e2"),
        prop: "apa_mp_h_acc_fruitbowl_02",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 357,
        name: langStringDefault("houses.furniture.furniture.config.e95272c0de6cf7af2e38bb142b6089c5"),
        prop: "apa_mp_h_acc_jar_02",
        cost: 6000,
        cat: "decor"
    },
    {
        id: 358,
        name: langStringDefault("houses.furniture.furniture.config.96f4987e3abca3793d046ab425e76c5d"),
        prop: "apa_mp_h_acc_jar_03",
        cost: 6000,
        cat: "decor"
    },
    {
        id: 359,
        name: langStringDefault("houses.furniture.furniture.config.ce0177d9c6eeb5930f33e758afea73f8"),
        prop: "apa_mp_h_acc_jar_04",
        cost: 6000,
        cat: "decor"
    },
    {
        id: 360,
        name: langStringDefault("houses.furniture.furniture.config.4fd71afb2e134ee97382ec85a5e638bf"),
        prop: "apa_mp_h_acc_phone_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 361,
        name: langStringDefault("houses.furniture.furniture.config.7311e776457b8e43eb18fb70809cb3cd"),
        prop: "apa_mp_h_acc_pot_pouri_01",
        cost: 8000,
        cat: "decor"
    },
    {
        id: 362,
        name: langStringDefault("houses.furniture.furniture.config.5796c21e77a9e8986ec13a8bdf5a53e0"),
        prop: "apa_mp_h_acc_tray_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 363,
        name: langStringDefault("houses.furniture.furniture.config.21da2d667efe589255fc712f1480a0ea"),
        prop: "bkr_cash_scatter_02",
        cost: 16000,
        cat: "decor"
    },
    {
        id: 364,
        name: langStringDefault("houses.furniture.furniture.config.eb7e2b3b5939835deb1e56b6c313f82d"),
        prop: "bkr_prop_bkr_cash_roll_01",
        cost: 25000,
        cat: "decor"
    },
    {
        id: 365,
        name: langStringDefault("houses.furniture.furniture.config.235d54a2835dd93257c1d0a3720f1085"),
        prop: "bkr_prop_bkr_cashpile_01",
        cost: 100000,
        cat: "decor"
    },
    {
        id: 366,
        name: langStringDefault("houses.furniture.furniture.config.9f662b99bb8c180f8c7531688ab9f80c"),
        prop: "bkr_prop_coke_bakingsoda",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 367,
        name: langStringDefault("houses.furniture.furniture.config.9ff8a43ba063aec5ebb0bfb0aac4e620"),
        prop: "bkr_prop_coke_boxeddoll",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 368,
        name: langStringDefault("houses.furniture.furniture.config.eaa3c11fb980a70fb1ec64f17e68d58f"),
        prop: "bkr_prop_coke_doll",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 369,
        name: langStringDefault("houses.furniture.furniture.config.f238e2e0bb1367c4870d8f4c3d3f538e"),
        prop: "bkr_prop_coke_metalbowl_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 370,
        name: langStringDefault("houses.furniture.furniture.config.c379e36e689998a5b78b8b936c2ca4e4"),
        prop: "bkr_prop_coke_mixer_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 371,
        name: langStringDefault("houses.furniture.furniture.config.8a820b9172ad443599f43a055bcadb47"),
        prop: "bkr_prop_coke_mortalpestle",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 372,
        name: langStringDefault("houses.furniture.furniture.config.5cede05d3d8363870f7ff2dd69057ae7"),
        prop: "bkr_prop_coke_painkiller_01a",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 373,
        name: langStringDefault("houses.furniture.furniture.config.33ea13fb74860f65abed3abd46d09565"),
        prop: "bkr_prop_coke_powderbottle_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 374,
        name: langStringDefault("houses.furniture.furniture.config.6b8130784e39abdf1ec35eb346720505"),
        prop: "bkr_prop_biker_case_shut",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 375,
        name: langStringDefault("houses.furniture.furniture.config.4d6685c2600a17fff865f90cf35ea96e"),
        prop: "bkr_prop_biker_gcase_s",
        cost: 30000,
        cat: "decor"
    },
    {
        id: 376,
        name: langStringDefault("houses.furniture.furniture.config.c22a202e7bc96a058bfc4229d69e09d9"),
        prop: "ex_office_swag_booze_cigs",
        cost: 20000,
        cat: "decor"
    },
    {
        id: 377,
        name: langStringDefault("houses.furniture.furniture.config.2f460621e5f7dc32e68224b844fc1253"),
        prop: "ex_office_swag_booze_cigs3",
        cost: 25000,
        cat: "decor"
    },
    {
        id: 378,
        name: langStringDefault("houses.furniture.furniture.config.97cb8f4f933398d6e2be143a15105261"),
        prop: "ex_office_swag_electronic",
        cost: 20000,
        cat: "decor"
    },
    {
        id: 379,
        name: langStringDefault("houses.furniture.furniture.config.fd1c9cf70b45132d94b3a650ac31727b"),
        prop: "ex_office_swag_pills2",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 380,
        name: langStringDefault("houses.furniture.furniture.config.dd9016a9932eefea403ae2914ebf818b"),
        prop: "ex_prop_ex_laptop_01a",
        cost: 20000,
        cat: "decor"
    },
    {
        id: 381,
        name: langStringDefault("houses.furniture.furniture.config.2a1e682563acf45bb9d9f9a487a37f75"),
        prop: "ex_prop_exec_cigar_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 382,
        name: langStringDefault("houses.furniture.furniture.config.a86a92cf46bc1c34f8f1506cf86ac640"),
        prop: "ex_prop_exec_lighter_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 383,
        name: langStringDefault("houses.furniture.furniture.config.0ec9d92335b63549a9f92adc2adc0295"),
        prop: "ex_prop_tv_settop_box",
        cost: 5000,
        cat: "decor"
    },
    // {
    //     id: 384,
    //     name: 'Fernbedienung',
    //     prop: 'ex_prop_tv_settop_box',
    //     cost: 1,
    //     cat: 'decor'
    // },
    {
        id: 385,
        name: langStringDefault("houses.furniture.furniture.config.42304a11c00497e5374d2872ed737721"),
        prop: "prop_food_sugarjar",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 386,
        name: langStringDefault("houses.furniture.furniture.config.3528de4364b1654067a2712ec1fe261e"),
        prop: "prop_fax_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 387,
        name: langStringDefault("houses.furniture.furniture.config.66a23d4c7c253995e2b20d74e363e935"),
        prop: "prop_fib_ashtray_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 388,
        name: langStringDefault("houses.furniture.furniture.config.d3667786c3e3ff07992505350a756fc5"),
        prop: "prop_amb_phone",
        cost: 12000,
        cat: "decor"
    },
    {
        id: 389,
        name: langStringDefault("houses.furniture.furniture.config.a05f1420bb4350824af967ad178000d3"),
        prop: "prop_fruit_basket",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 390,
        name: langStringDefault("houses.furniture.furniture.config.32d86c5a8e37fe813323ec90608aca7e"),
        prop: "prop_idol_01_error",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 391,
        name: langStringDefault("houses.furniture.furniture.config.360ebe875b04aa595c3d8db154c7ebce"),
        prop: "prop_pap_camera_01",
        cost: 25000,
        cat: "decor"
    },
    {
        id: 392,
        name: langStringDefault("houses.furniture.furniture.config.e986e1ee6c9b30d354400d44ed4a052f"),
        prop: "prop_cs_katana_01",
        cost: 50000,
        cat: "decor"
    },
    {
        id: 393,
        name: langStringDefault("houses.furniture.furniture.config.aef3dbf689d54ecd2901d004a2562682"),
        prop: "prop_cs_cuffs_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 394,
        name: langStringDefault("houses.furniture.furniture.config.743068f89865c2f72a153055a7802f6b"),
        prop: "prop_cs_lipstick",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 395,
        name: langStringDefault("houses.furniture.furniture.config.0491c317257b213f7115a60de8b1ab52"),
        prop: "prop_ld_can_01b",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 396,
        name: langStringDefault("houses.furniture.furniture.config.86351c6ea128a7bf52785eb172fbcdf9"),
        prop: "prop_ld_fags_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 397,
        name: langStringDefault("houses.furniture.furniture.config.51132a01fb0cc6f4a332ed28ab3c3bed"),
        prop: "prop_mem_candle_04",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 398,
        name: langStringDefault("houses.furniture.furniture.config.9ca762004caad8d1bd35f34e5c046a07"),
        prop: "prop_mem_candle_05",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 399,
        name: langStringDefault("houses.furniture.furniture.config.a2afa813465cac9eb94c0fdb8b7911f0"),
        prop: "prop_mem_candle_06",
        cost: 5000,
        cat: "decor"
    },
    // {
    //     id: 400,
    //     name: 'Kerze',
    //     prop: 'prop_mem_candle_06',
    //     cost: 1,
    //     cat: 'decor'
    // },
    {
        id: 401,
        name: langStringDefault("houses.furniture.furniture.config.445674d2889ca070c2a84e5580620f0e"),
        prop: "prop_peanut_bowl_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 402,
        name: langStringDefault("houses.furniture.furniture.config.11f3db10a947e75ef20c5bd9adcdcad1"),
        prop: "prop_rum_bottle",
        cost: 8000,
        cat: "decor"
    },
    {
        id: 403,
        name: langStringDefault("houses.furniture.furniture.config.40a2ce5283c359e0b0eb27e27c6a5954"),
        prop: "v_ilev_csr_lod_boarded",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 404,
        name: langStringDefault("houses.furniture.furniture.config.c7beea7e5e0162b6c8440ba1708e8e03"),
        prop: "v_ilev_exball_blue",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 405,
        name: langStringDefault("houses.furniture.furniture.config.29498a93a2e49d9aad6392037ef89728"),
        prop: "v_ilev_exball_grey",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 406,
        name: langStringDefault("houses.furniture.furniture.config.96416813cbba983f16f099673da92f0e"),
        prop: "v_ilev_fh_lampa_on",
        cost: 15000,
        cat: "lamp"
    },
    {
        id: 407,
        name: langStringDefault("houses.furniture.furniture.config.ffe6d7f7a427aa21871a1141f0a16f37"),
        prop: "v_ilev_lest_bigscreen",
        cost: 20000,
        cat: "decor"
    },
    {
        id: 408,
        name: langStringDefault("houses.furniture.furniture.config.bdf9ee3539b0d16770715c6078b7a1cc"),
        prop: "v_ilev_m_pitcher",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 409,
        name: langStringDefault("houses.furniture.furniture.config.7b48873b68d0a6640eccc924b01934fd"),
        prop: "v_ilev_m_sofacushion",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 410,
        name: langStringDefault("houses.furniture.furniture.config.246865757f905f449e3c00178e85093c"),
        prop: "v_ilev_mchalkbrd_1",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 411,
        name: langStringDefault("houses.furniture.furniture.config.7669ac65db4ab8283d1906e17784d228"),
        prop: "v_ilev_mchalkbrd_2",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 412,
        name: langStringDefault("houses.furniture.furniture.config.c2a82ef842fcd7b8cc1e92448d3eaacf"),
        prop: "v_ilev_mchalkbrd_3",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 413,
        name: langStringDefault("houses.furniture.furniture.config.d099d76aa3a9245254e40a9983fcc185"),
        prop: "v_ilev_mchalkbrd_4",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 414,
        name: langStringDefault("houses.furniture.furniture.config.4c36bbca7b1f3e40fafdae77f2171be7"),
        prop: "v_ilev_mchalkbrd_5",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 415,
        name: langStringDefault("houses.furniture.furniture.config.f94c462035b0be0c084f36bb70b4895c"),
        prop: "v_ilev_mm_faucet",
        cost: 7000,
        cat: "plumbing"
    },
    {
        id: 416,
        name: langStringDefault("houses.furniture.furniture.config.aa4ae57d77ce6df72476b0514c1bd85d"),
        prop: "v_ilev_mm_fridgeint",
        cost: 50000,
        cat: "plumbing"
    },
    {
        id: 417,
        name: langStringDefault("houses.furniture.furniture.config.8dfe8a0a13dfefed1340659bb0deb706"),
        prop: "v_ilev_mp_bedsidebook",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 418,
        name: langStringDefault("houses.furniture.furniture.config.7e52c7ce5808378b45a89aa11d160cb4"),
        prop: "v_ilev_mr_rasberryclean",
        cost: 7000,
        cat: "decor"
    },
    {
        id: 419,
        name: langStringDefault("houses.furniture.furniture.config.3f54fe8d77cca6dcec43b65ff33d4e9c"),
        prop: "v_res_cherubvase",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 420,
        name: langStringDefault("houses.furniture.furniture.config.c1da6a199a1fbe1a640a7c430b10c12f"),
        prop: "v_res_mbronzvase",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 421,
        name: langStringDefault("houses.furniture.furniture.config.3b86a1af628cf1877381380c5887c3e0"),
        prop: "v_res_mvasechinese",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 422,
        name: langStringDefault("houses.furniture.furniture.config.bf259242aeeff49bc362fa90ba0ea7f8"),
        prop: "v_res_rosevase",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 423,
        name: langStringDefault("houses.furniture.furniture.config.5ab8d2b1df43bc8c2151a390c2ea1089"),
        prop: "v_res_rosevasedead",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 424,
        name: langStringDefault("houses.furniture.furniture.config.28019180094277fa97d28193b22d558e"),
        prop: "v_res_tre_sideboard",
        cost: 15000,
        cat: "chest"
    },
    {
        id: 425,
        name: langStringDefault("houses.furniture.furniture.config.501dd4200838e0dc8c404877817714a0"),
        prop: "v_ret_247_choptom",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 426,
        name: langStringDefault("houses.furniture.furniture.config.79a467855ee8cd5d64967058d7576f47"),
        prop: "v_ret_247_popcan2",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 427,
        name: langStringDefault("houses.furniture.furniture.config.eb6b1e6efae4b6f8ee8fe75bb0da0ed2"),
        prop: "v_ret_247_swtcorn2",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 428,
        name: langStringDefault("houses.furniture.furniture.config.a04ef0eba72b8f5b147b6dc6bb1a7512"),
        prop: "v_ret_fh_pizza01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 429,
        name: langStringDefault("houses.furniture.furniture.config.8624bb414e4acaa91453ae0adb7fbb4f"),
        prop: "v_ret_ml_beerben1",
        cost: 7000,
        cat: "decor"
    },
    {
        id: 430,
        name: langStringDefault("houses.furniture.furniture.config.9b58639b9e81f1497dcd4ceab6452a8b"),
        prop: "v_ret_ml_beerbla1",
        cost: 7000,
        cat: "decor"
    },
    {
        id: 431,
        name: langStringDefault("houses.furniture.furniture.config.ac9e8888efed8c1ad5c8688dc48f697e"),
        prop: "v_ret_ml_beerlog1",
        cost: 7000,
        cat: "decor"
    },
    {
        id: 432,
        name: langStringDefault("houses.furniture.furniture.config.a296d0864ace0de07e553ba44106e9a9"),
        prop: "prop_printer_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 433,
        name: langStringDefault("houses.furniture.furniture.config.a7d090be33931979e4ae1053710f7d00"),
        prop: "v_res_cd",
        cost: 3000,
        cat: "decor"
    },
    {
        id: 434,
        name: langStringDefault("houses.furniture.furniture.config.33a9ac813bc3f62e7c4ce57ec1610178"),
        prop: "v_res_desktidy",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 435,
        name: langStringDefault("houses.furniture.furniture.config.087d08d0497b7161cf49135f00f1c875"),
        prop: "p_cs_comb_01",
        cost: 3000,
        cat: "decor"
    },
    {
        id: 436,
        name: langStringDefault("houses.furniture.furniture.config.617f2a8ea2570a0a50647c6534c9e0fd"),
        prop: "p_int_jewel_plant_01",
        cost: 20000,
        cat: "decor"
    },
    {
        id: 437,
        name: langStringDefault("houses.furniture.furniture.config.25dc958064dcbba277c2dac22ab4681a"),
        prop: "p_int_jewel_plant_02",
        cost: 20000,
        cat: "decor"
    },
    {
        id: 438,
        name: langStringDefault("houses.furniture.furniture.config.b111c363b3b43563c05fac9222571a7f"),
        prop: "prop_acc_guitar_01",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 439,
        name: langStringDefault("houses.furniture.furniture.config.af46f48d08d86405f9642a9ffe83437d"),
        prop: "prop_el_guitar_01",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 440,
        name: langStringDefault("houses.furniture.furniture.config.38a7d88c8b75ce5238608c1e60862fdf"),
        prop: "prop_el_guitar_02",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 441,
        name: langStringDefault("houses.furniture.furniture.config.6237589dc6e358bd8ff66a4c27582fff"),
        prop: "prop_el_guitar_03",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 442,
        name: langStringDefault("houses.furniture.furniture.config.b3c6066809fa51c66245fb4732eaa22e"),
        prop: "prop_egg_clock_01",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 443,
        name: langStringDefault("houses.furniture.furniture.config.10d2fb17783765eeeb27ffa68f5135f7"),
        prop: "prop_hotel_clock_01",
        cost: 30000,
        cat: "decor"
    },
    {
        id: 444,
        name: langStringDefault("houses.furniture.furniture.config.a6cd13ce5796ca2801dd58dce65d97c4"),
        prop: "prop_rolled_yoga_mat",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 445,
        name: langStringDefault("houses.furniture.furniture.config.0295dac57ac7b5ec1ead25212094b959"),
        prop: "prop_t_telescope_01b",
        cost: 35000,
        cat: "decor"
    },
    {
        id: 446,
        name: langStringDefault("houses.furniture.furniture.config.4d8f360fc41d399920a66c79207e6b83"),
        prop: "p_yoga_mat_01_s",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 447,
        name: langStringDefault("houses.furniture.furniture.config.19801bf4a4ca4f2202915230daf3a595"),
        prop: "p_yoga_mat_02_s",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 448,
        name: langStringDefault("houses.furniture.furniture.config.08b5a7ebb7e83ac0199d96b7abf06704"),
        prop: "prop_amb_beer_bottle",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 449,
        name: langStringDefault("houses.furniture.furniture.config.6131f9aba85386ce39f45deb47ec6205"),
        prop: "prop_amb_donut",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 450,
        name: langStringDefault("houses.furniture.furniture.config.b8b31457a7efee42d1ddd8ab6dc06801"),
        prop: "prop_bong_01",
        cost: 7000,
        cat: "decor"
    },
    {
        id: 451,
        name: langStringDefault("houses.furniture.furniture.config.f35d1b331150c46c32df97500ae94f91"),
        prop: "prop_controller_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 452,
        name: langStringDefault("houses.furniture.furniture.config.b7fa99d496c9d9b4bd78d9c836f22907"),
        prop: "prop_cs_cctv",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 453,
        name: langStringDefault("houses.furniture.furniture.config.5f8addd715f3d79985e0691a6b17afa8"),
        prop: "prop_cs_champ_flute",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 454,
        name: langStringDefault("houses.furniture.furniture.config.4ce20ecc0d3f0e84cd791dfe88a32752"),
        prop: "prop_cs_dildo_01",
        cost: 50000,
        cat: "decor"
    },
    {
        id: 455,
        name: langStringDefault("houses.furniture.furniture.config.3777dc449eea1b83c68007690a53bfcf"),
        prop: "prop_cs_frank_photo",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 456,
        name: langStringDefault("houses.furniture.furniture.config.918cfa1cc519520537ce817d399c3fdc"),
        prop: "prop_cs_ironing_board",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 457,
        name: langStringDefault("houses.furniture.furniture.config.beb418e53e6288605f58387e54e8a93b"),
        prop: "prop_cs_kettle_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 458,
        name: langStringDefault("houses.furniture.furniture.config.d276ad96dad8cf2242fa2ce7c0f83174"),
        prop: "prop_cs_photoframe_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 459,
        name: langStringDefault("houses.furniture.furniture.config.ca065fd68aefbe127d4a84e197756b81"),
        prop: "prop_cs_plate_01",
        cost: 5000,
        cat: "decor"
    },
    // {
    //     id: 460,
    //     name: 'Kleiderbox',
    //     prop: 'prop_cs_plate_01',
    //     cost: 1,
    //     cat: 'decor'
    // },
    {
        id: 461,
        name: langStringDefault("houses.furniture.furniture.config.eebb0d033cdb7bd0226f30abdf07896d"),
        prop: "prop_ear_defenders_01",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 462,
        name: langStringDefault("houses.furniture.furniture.config.74ec30c1b703a75cc8bb76e5184673ff"),
        prop: "prop_id2_20_clock",
        cost: 25000,
        cat: "decor"
    },
    {
        id: 463,
        name: langStringDefault("houses.furniture.furniture.config.380faddd1cdf128aca7f4668f0537a66"),
        prop: "prop_mp3_dock",
        cost: 7000,
        cat: "decor"
    },
    {
        id: 464,
        name: langStringDefault("houses.furniture.furniture.config.0ffc17cd8f0ae15b3d2e815e9ffc9a2e"),
        prop: "prop_tapeplayer_01",
        cost: 7000,
        cat: "decor"
    },
    {
        id: 465,
        name: langStringDefault("houses.furniture.furniture.config.c105a6ac8f444d3b0a4896ca6f912abf"),
        prop: "p_laz_j02_s",
        cost: 7000,
        cat: "decor"
    },
    {
        id: 466,
        name: langStringDefault("houses.furniture.furniture.config.8a49fa9290f9aca1e4dde0b69cdd44fc"),
        prop: "p_loose_rag_01_s",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 467,
        name: langStringDefault("houses.furniture.furniture.config.1c54c4334975a8b078624119e914e181"),
        prop: "p_t_shirt_pile_s",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 468,
        name: langStringDefault("houses.furniture.furniture.config.b71093f7d49410834956e8cee108fc65"),
        prop: "prop_fragtest_cnst_06",
        cost: 40000,
        cat: "lamp"
    },
    {
        id: 469,
        name: langStringDefault("houses.furniture.furniture.config.5e511894781c6068b99d56627215c554"),
        prop: "ng_proc_drug01a002",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 470,
        name: langStringDefault("houses.furniture.furniture.config.9854d517de6f6d6c45f50728fabc6ccb"),
        prop: "prop_elec_heater_01",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 471,
        name: langStringDefault("houses.furniture.furniture.config.96d57a6aa7fb67081a52717bd4c4b1d4"),
        prop: "prop_speaker_07",
        cost: 20000,
        cat: "decor"
    },
    {
        id: 472,
        name: langStringDefault("houses.furniture.furniture.config.ac67365361ecedd27797cac373a3b0fe"),
        prop: "prop_speaker_06",
        cost: 20000,
        cat: "decor"
    },
    {
        id: 473,
        name: langStringDefault("houses.furniture.furniture.config.0debc6466c44831338e30cf711179ab2"),
        prop: "prop_speaker_03",
        cost: 20000,
        cat: "decor"
    },
    {
        id: 474,
        name: langStringDefault("houses.furniture.furniture.config.f40865f88337c0d876870c04fd74ac27"),
        prop: "prop_micro_02",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 475,
        name: langStringDefault("houses.furniture.furniture.config.37c3d374280fdaf2be4397eebf9b8c08"),
        prop: "prop_micro_04",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 476,
        name: langStringDefault("houses.furniture.furniture.config.753025e863025c6ae941473c43438fdb"),
        prop: "prop_mug_02",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 477,
        name: langStringDefault("houses.furniture.furniture.config.0e41b9d91044748f6e59179ffd8001eb"),
        prop: "prop_mug_03",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 478,
        name: langStringDefault("houses.furniture.furniture.config.84cbb8c63114ac1b644e54e27411dbc3"),
        prop: "prop_mug_04",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 479,
        name: langStringDefault("houses.furniture.furniture.config.67f5cd9d83e1d4097d4de183bd0e0c51"),
        prop: "v_res_fa_potsug",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 480,
        name: langStringDefault("houses.furniture.furniture.config.f264a0a6c21c4603d7751399276489c6"),
        prop: "v_res_fa_pottea",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 481,
        name: langStringDefault("houses.furniture.furniture.config.2fc01604dfff0376896566882d866e25"),
        prop: "v_res_foodjara",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 482,
        name: langStringDefault("houses.furniture.furniture.config.c9fb401966a66219b486518b854b9886"),
        prop: "v_res_foodjarb",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 483,
        name: langStringDefault("houses.furniture.furniture.config.791e8e70ccc757c9f81a5816720e0876"),
        prop: "v_res_foodjarc",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 484,
        name: langStringDefault("houses.furniture.furniture.config.feb3edf85e39fce73acf805e0fb0a5ac"),
        prop: "v_res_mcofcupdirt",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 485,
        name: langStringDefault("houses.furniture.furniture.config.58616a1b344ccc2c084d3e139b3a83d9"),
        prop: "v_res_mbowl",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 486,
        name: langStringDefault("houses.furniture.furniture.config.7bd7d7a4e14e2c0c42b661178fd2fdd6"),
        prop: "v_res_mplatelrg",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 487,
        name: langStringDefault("houses.furniture.furniture.config.80924d5a27025a7416e44894477a0fe1"),
        prop: "v_res_tt_bowlpile02",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 488,
        name: langStringDefault("houses.furniture.furniture.config.8b1980a0e5bfc233305be97bf7437715"),
        prop: "prop_bar_beerfridge_01",
        cost: 70000,
        cat: "decor"
    },
    {
        id: 489,
        name: langStringDefault("houses.furniture.furniture.config.a8668cf83e60fcfaabd184b0e79fc8db"),
        prop: "prop_bar_cockshaker",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 490,
        name: langStringDefault("houses.furniture.furniture.config.8e7bed892f8c21687b784ea04f4325f7"),
        prop: "prop_bar_drinkstraws",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 491,
        name: langStringDefault("houses.furniture.furniture.config.dbd2cedbe2a7ff8894378ddd38632d36"),
        prop: "prop_bar_lemons",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 492,
        name: langStringDefault("houses.furniture.furniture.config.cf4eaa3b954662c317134574481297c0"),
        prop: "prop_bar_limes",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 493,
        name: langStringDefault("houses.furniture.furniture.config.c4ef9ff7bc8c383f0948993927a0fa46"),
        prop: "prop_bar_nuts",
        cost: 5000,
        cat: "decor"
    },
    {
        id: 494,
        name: langStringDefault("houses.furniture.furniture.config.92ab103223c973e9c29d2521766ccae9"),
        prop: "prop_bottle_richard",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 495,
        name: langStringDefault("houses.furniture.furniture.config.8d6e28abc880f1aafb260107290d3a2f"),
        prop: "prop_bottle_cognac",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 496,
        name: langStringDefault("houses.furniture.furniture.config.8198d897b5856597a8094a49bbad1607"),
        prop: "prop_champ_01b",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 497,
        name: langStringDefault("houses.furniture.furniture.config.4af95a6aded1c6a08ae52520fa85659f"),
        prop: "prop_tequila_bottle",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 498,
        name: langStringDefault("houses.furniture.furniture.config.e5fa5e279df81ac9b9650cf02a204d62"),
        prop: "prop_pooltable_02",
        cost: 120000,
        cat: "decor"
    },
    {
        id: 499,
        name: langStringDefault("houses.furniture.furniture.config.1f63f300288e3863259636b757c78460"),
        prop: "prop_pooltable_3b",
        cost: 120000,
        cat: "decor"
    },
    {
        id: 500,
        name: langStringDefault("houses.furniture.furniture.config.8574d60250a4256fc34e69047de2fb52"),
        prop: "prop_dart_bd_01",
        cost: 15000,
        cat: "decor"
    },
    {
        id: 501,
        name: langStringDefault("houses.furniture.furniture.config.e8db07308ab400013894252b025f396f"),
        prop: "apa_mp_h_acc_rugwooll_03",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 502,
        name: langStringDefault("houses.furniture.furniture.config.90dffb531583b1bf0a0137d92ba8a9db"),
        prop: "apa_mp_h_acc_rugwoolm_01",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 503,
        name: langStringDefault("houses.furniture.furniture.config.bd6b2f814f9ec596e2706d919f965a3a"),
        prop: "apa_mp_h_acc_rugwoolm_02",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 504,
        name: langStringDefault("houses.furniture.furniture.config.525a6d968498fe20ea6dbebbaa204202"),
        prop: "apa_mp_h_acc_rugwoolm_03",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 505,
        name: langStringDefault("houses.furniture.furniture.config.09a144499902c80e89470c73dbfc4367"),
        prop: "apa_mp_h_acc_rugwoolm_04",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 506,
        name: langStringDefault("houses.furniture.furniture.config.ee41da2585ec270ecf3f3a625fb78ef4"),
        prop: "apa_mp_h_acc_rugwools_01",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 507,
        name: langStringDefault("houses.furniture.furniture.config.67e96d2f21c72d65e09bc50d8114ff71"),
        prop: "apa_mp_h_acc_rugwools_03",
        cost: 10000,
        cat: "decor"
    },
    {
        id: 508,
        name: langStringDefault("houses.furniture.furniture.config.2f0a658848bba7809f9a87f271589b4f"),
        prop: "apa_mp_h_str_shelffloorm_02",
        cost: 30000,
        cat: "wardrobe"
    },
    {
        id: 509,
        name: langStringDefault("houses.furniture.furniture.config.83bcabb2f4400f19fd559cd91bc9fc3c"),
        prop: "apa_mp_h_str_shelffreel_01",
        cost: 30000,
        cat: "wardrobe"
    },
    {
        id: 510,
        name: langStringDefault("houses.furniture.furniture.config.e2b67ab7ef3602feca6a50de22f10b64"),
        prop: "apa_mp_h_str_shelfwallm_01",
        cost: 15000,
        cat: "wardrobe"
    },
    {
        id: 511,
        name: langStringDefault("houses.furniture.furniture.config.cd793f77b214ddd9155f43643339963e"),
        prop: "apa_p_apdlc_treadmill_s",
        cost: 60000,
        cat: "decor"
    },
    {
        id: 512,
        name: langStringDefault("houses.furniture.furniture.config.9189235f5010228c9f4e72e773958485"),
        prop: "bkr_prop_biker_garage_locker_01",
        cost: 15000,
        cat: "wardrobe"
    },
    // {
    //     id: 513,
    //     name: 'Laufband',
    //     prop: 'apa_p_apdlc_treadmill_s',
    //     cost: 1,
    //     cat: 'decor'
    // },
    // {
    //     id: 514,
    //     name: 'Кüche 1',
    //     prop: 'apa_mp_h_kit_kitchen_01_a',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 515,
    //     name: 'Küche 2',
    //     prop: 'apa_mp_h_kit_kitchen_01_b',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 516,
    //     name: 'Kronleuchter 1',
    //     prop: 'v_44_kitc_chand',
    //     cost: 1,
    //     cat: 'lamp'
    // },
    // {
    //     id: 517,
    //     name: 'Kronleuchter 2',
    //     prop: 'prop_chall_lamp_01n',
    //     cost: 1,
    //     cat: 'lamp'
    // },
    // {
    //     id: 518,
    //     name: 'Kronleuchter 3',
    //     prop: 'prop_chall_lamp_02',
    //     cost: 1,
    //     cat: 'lamp'
    // },
    // {
    //     id: 519,
    //     name: 'Kronleuchter 4',
    //     prop: 'prop_chall_lamp_02',
    //     cost: 1,
    //     cat: 'lamp'
    // },
    // {
    //     id: 520,
    //     name: 'Lampe 1',
    //     prop: 'prop_wall_light_12',
    //     cost: 1,
    //     cat: 'lamp'
    // },
    {
        id: 521,
        name: langStringDefault("houses.furniture.furniture.config.ba8339a045985ebab7c734790571d8a1"),
        prop: "xm_base_cia_lamp_ceiling_02a",
        cost: 30000,
        cat: "lamp"
    },
    {
        id: 522,
        name: langStringDefault("houses.furniture.furniture.config.d889bb0543418fa5e9d7513e3668720c"),
        prop: "ch_prop_ch_lamp_ceiling_01a",
        cost: 30000,
        cat: "lamp"
    },
    {
        id: 523,
        name: langStringDefault("houses.furniture.furniture.config.6cc993e480bf7b1d14814364e2a2f981"),
        prop: "apa_mp_h_lampbulb_multiple_a",
        cost: 30000,
        cat: "lamp"
    },
    {
        id: 524,
        name: langStringDefault("houses.furniture.furniture.config.2e1af3f8150f5566402832cad6437e4c"),
        prop: "apa_mp_h_lit_lightpendant_01",
        cost: 30000,
        cat: "lamp"
    },
    {
        id: 525,
        name: langStringDefault("houses.furniture.furniture.config.05f6f04acd3767ea529f8241c0c7859e"),
        prop: "apa_mp_h_lit_lightpendant_05",
        cost: 30000,
        cat: "lamp"
    },
    {
        id: 526,
        name: langStringDefault("houses.furniture.furniture.config.cf98e6eeba3a935cf4a9e80be73867db"),
        prop: "apa_mp_h_lit_lightpendant_05b",
        cost: 40000,
        cat: "lamp"
    },
    {
        id: 527,
        name: langStringDefault("houses.furniture.furniture.config.f251bb1c891734137c15613958fc9854"),
        prop: "bkr_prop_biker_pendant_light",
        cost: 30000,
        cat: "lamp"
    },
    {
        id: 528,
        name: langStringDefault("houses.furniture.furniture.config.7ee324486ba1eedc303e04897c39d839"),
        prop: "xs_prop_arena_lights_ceiling_l_c",
        cost: 25000,
        cat: "lamp"
    },
    {
        id: 529,
        name: langStringDefault("houses.furniture.furniture.config.cebb26476304dafea8737e90a8bcaae2"),
        prop: "ex_mp_h_lit_lightpendant_01",
        cost: 30000,
        cat: "lamp"
    },
    // {
    //     id: 530,
    //     name: 'Lavalampe',
    //     prop: 'v_57_lavalamp',
    //     cost: 1,
    //     cat: 'lamp'
    // },
    {
        id: 531,
        name: langStringDefault("houses.furniture.furniture.config.846c8c39c439d36409f2ea937ca501e6"),
        prop: "v_9_glasslamps",
        cost: 50000,
        cat: "lamp"
    },
    // {
    //     id: 532,
    //     name: 'Lampe 12',
    //     prop: 'apa_mp_h_05_dining_light',
    //     cost: 1,
    //     cat: 'lamp'
    // },
    {
        id: 533,
        name: langStringDefault("houses.furniture.furniture.config.7f980ef81aecdd9a3f69e296cb987920"),
        prop: "prop_sink_02",
        cost: 7000,
        cat: "plumbing"
    },
    {
        id: 534,
        name: langStringDefault("houses.furniture.furniture.config.19f8624265a05363a810dbc874b679c4"),
        prop: "prop_sink_04",
        cost: 7000,
        cat: "plumbing"
    },
    {
        id: 5340,
        name: langStringDefault("houses.furniture.furniture.config.1dac809902c01306ad00ca07a25662d4"),
        prop: "prop_sink_05",
        cost: 7000,
        cat: "plumbing"
    },
    {
        id: 535,
        name: langStringDefault("houses.furniture.furniture.config.b29f15d43d95111b9d4a8672c89b7dcd"),
        prop: "prop_sink_06",
        cost: 7000,
        cat: "plumbing"
    },
    {
        id: 536,
        name: langStringDefault("houses.furniture.furniture.config.46fa70c73849ddb31f3af0757a52e539"),
        prop: "prop_toilet_01",
        cost: 7000,
        cat: "plumbing"
    },
    {
        id: 537,
        name: langStringDefault("houses.furniture.furniture.config.56f3d3f00e5a1840fd2836038830b68a"),
        prop: "prop_toilet_02",
        cost: 7000,
        cat: "plumbing"
    },
    {
        id: 538,
        name: langStringDefault("houses.furniture.furniture.config.76cdace8d6032382bde4a7684312dda7"),
        prop: "prop_toilet_brush_01",
        cost: 5000,
        cat: "plumbing"
    },
    {
        id: 539,
        name: langStringDefault("houses.furniture.furniture.config.3cff8c9a972b0ba45ac9d8e1aa7cfbd2"),
        prop: "prop_toilet_roll_02",
        cost: 5000,
        cat: "plumbing"
    },
    {
        id: 540,
        name: langStringDefault("houses.furniture.furniture.config.b5076643de002e710ce340d2e842f931"),
        prop: "prop_toilet_shamp_01",
        cost: 7000,
        cat: "decor"
    },
    {
        id: 541,
        name: langStringDefault("houses.furniture.furniture.config.64420a12ab944b73ff3e5df234868f5a"),
        prop: "prop_toilet_shamp_02",
        cost: 7000,
        cat: "decor"
    },
    {
        id: 542,
        name: langStringDefault("houses.furniture.furniture.config.034025ffbc23d68c1a5cf237162ba98e"),
        prop: "prop_toilet_soap_01",
        cost: 7000,
        cat: "decor"
    },
    {
        id: 543,
        name: langStringDefault("houses.furniture.furniture.config.52d142e321e66d3ab20d715e95fd6e9d"),
        prop: "prop_toilet_soap_03",
        cost: 7000,
        cat: "decor"
    },
    {
        id: 544,
        name: langStringDefault("houses.furniture.furniture.config.2fc8a2b00b4c4183dcb91a4936ea7dae"),
        prop: "prop_toilet_soap_04",
        cost: 7000,
        cat: "decor"
    },
    {
        id: 545,
        name: langStringDefault("houses.furniture.furniture.config.da3cffdeb6e647f43763f4f47ad411dd"),
        prop: "apa_mp_h_bathtub_01",
        cost: 50000,
        cat: "plumbing"
    },
    {
        id: 546,
        name: langStringDefault("houses.furniture.furniture.config.bcf1e7929963744c44c94ee1de796a2d"),
        prop: "v_res_mcupboard",
        cost: 10000,
        cat: "wardrobe"
    },
    // {
    //     id: 547,
    //     name: 'Garderobe 1',
    //     prop: 'v_16_wardrobe',
    //     cost: 1,
    //     cat: 'wardrobe'
    // },
    // {
    //     id: 548,
    //     name: 'Garderobe 2',
    //     prop: 'v_16_wardrobe_details',
    //     cost: 1,
    //     cat: 'wardrobe'
    // },
    // {
    //     id: 549,
    //     name: 'Garderobe 3',
    //     prop: 'apa_mpa2_wardrobe_details',
    //     cost: 1,
    //     cat: 'wardrobe'
    // },
    // {
    //     id: 550,
    //     name: 'Garderobe 4',
    //     prop: 'apa_mpa3_wardrobe_details',
    //     cost: 1,
    //     cat: 'wardrobe'
    // },
    // {
    //     id: 551,
    //     name: 'Kleiderschrank',
    //     prop: 'ba_wardrobe',
    //     cost: 1,
    //     cat: 'wardrobe'
    // },
    {
        id: 552,
        name: langStringDefault("houses.furniture.furniture.config.75738ba63c023d870341396d0b2bc3f4"),
        prop: "v_res_tre_wardrobe",
        cost: 20000,
        cat: "wardrobe"
    },
    {
        id: 553,
        name: langStringDefault("houses.furniture.furniture.config.d3be72303286678302ee2f072fc7cbc5"),
        prop: "v_res_mknifeblock",
        cost: 7000,
        cat: "decor"
    },
    {
        id: 554,
        name: langStringDefault("houses.furniture.furniture.config.91d31c10d9e89db20e82ba09489267a6"),
        prop: "v_res_mkniferack",
        cost: 7000,
        cat: "decor"
    },
    {
        id: 555,
        name: langStringDefault("houses.furniture.furniture.config.0a29e6f3f002885efedcc4f6c904cb46"),
        prop: "v_res_fridgemodsml",
        cost: 40000,
        cat: "plumbing"
    },
    {
        id: 556,
        name: langStringDefault("houses.furniture.furniture.config.df2a86785460ab267a1b2726c230af62"),
        prop: "v_res_mutensils",
        cost: 7000,
        cat: "decor"
    },
    {
        id: 557,
        name: langStringDefault("houses.furniture.furniture.config.3ae2816ebbc84922c68144e88fec65ea"),
        prop: "prop_cooker_03",
        cost: 25000,
        cat: "plumbing"
    },
    // {
    //     id: 558,
    //     name: 'Komplette Küche 3',
    //     prop: 'apa_mpa2_dining_kitchen',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 559,
    //     name: 'Komplette Küche 4',
    //     prop: 'apa_mpa3_dining_kitchen',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 560,
    //     name: 'Komplette Küche 5',
    //     prop: 'apa_mp_h_04_kitchen_dining',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 561,
    //     name: 'Komplette Küche 6',
    //     prop: 'apa_mpa6_dining_kitchen',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 562,
    //     name: 'Komplette Küche 7',
    //     prop: 'apa_mp_h_08_kitchen_dining',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 563,
    //     name: 'Komplette Küche 8',
    //     prop: 'apa_mp_stilts_a_kitchen_dtl',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 564,
    //     name: 'Komplette Küche 9',
    //     prop: 'apa_mp_stilts_b_kitchen_dtl',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 565,
    //     name: 'Komplette Küche 10',
    //     prop: 'ex_office_02a_kitchen',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 566,
    //     name: 'Komplette Küche 11',
    //     prop: 'sf_int1_3_kitchen_cabinets',
    //     cost: 1,
    //     cat: 'plumbing'
    // },
    // {
    //     id: 567,
    //     name: 'Komplette Küche 12',
    //     prop: 'h4_int_sub_kitchen',
    //     cost: 1,
    //     cat: 'plumbing'
    // }























]
