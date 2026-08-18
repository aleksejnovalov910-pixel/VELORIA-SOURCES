import { langStringDefault } from "../../lang/index";

import { ClothReward, CoinsReward, ExpReward, InventoryItemReward, LuckyWheelReward, MoneyReward, RewardRarity, VehicleReward, VipReward } from "../rewards";
import { IBattlePassSeason } from "../season";
import { FarmTaskConfig, FishingTaskConfig, HuntTaskConfig, JobTaskConfig } from "../tasks";

export const MAY_SEASON: IBattlePassSeason = {
    id: "may-season",
    name: langStringDefault("battlePass.seasons.may.0529c818470318ab19fa7198737ee987"),
    levelExp: 1001,
    everyDayExp: {
        time: 2,
        exp: 250
    },
    levelPrice: 500,
    endTime: 1659301261,
    battlePassCost: 4000,
    discount: {
        expires: 1644310831,
        specialPrice: 3000

    },
    rewards:[
        new LuckyWheelReward(langStringDefault("battlePass.seasons.may.8401b5253b1abe27e2338c3facb9e73c"), RewardRarity.COMMON, "fortune", false),
        new InventoryItemReward(langStringDefault("battlePass.seasons.may.aee2e6b237329e0737c7e0f8a15ced0c"), RewardRarity.RARE, "camo1",  false, 1604, 1),
        new CoinsReward(langStringDefault("battlePass.seasons.may.f3a7424270ef18f1905cfa29089517d3"), RewardRarity.COMMON, "coins1", false, 100),
        new VipReward(langStringDefault("battlePass.seasons.may.7a0327108223a92624d74c183ab63ef2"), RewardRarity.COMMON, "vipR0", false, "Ruby", 7),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 3),
        new ClothReward(langStringDefault("battlePass.seasons.may.8b2cb49b6115e096f4fe9076e14b06ac"), RewardRarity.RARE, "body6_m","body6_f", true, langStringDefault("battlePass.seasons.may.8b2cb49b6115e096f4fe9076e14b06ac"), langStringDefault("battlePass.seasons.may.ca2a9baf5b72f6baddd6f80e28d1edea"), langStringDefault("battlePass.seasons.may.6be673214ca4e853237f42ad9620b26d"), langStringDefault("battlePass.seasons.may.6be673214ca4e853237f42ad9620b26d")),
        new CoinsReward(langStringDefault("battlePass.seasons.may.0974ee3bf7ead747940f10d248cc7ccf"), RewardRarity.COMMON, "coins1", false, 100),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.may.6344b52d3703d6cf8f7db4af347f1a1f"), RewardRarity.COMMON, "fortune", false),
        new InventoryItemReward(langStringDefault("battlePass.seasons.may.c890ca0484980c6b6e252eb61ac2ca3d"), RewardRarity.RARE, "camo1",  false, 1604, 1),
        new VipReward(langStringDefault("battlePass.seasons.may.41ff366f2fb1c670134dede606445080"), RewardRarity.COMMON, "vipD0", false, "Diamond", 3),
        new MoneyReward(langStringDefault("battlePass.seasons.may.5b95d162e1fca71b76743c62798f70ad"), RewardRarity.COMMON, "money1", false, 25000),
        new ClothReward(langStringDefault("battlePass.seasons.may.9bd3713efd979e799ce4ce2d0c396581"), RewardRarity.LEGENDARY, "pants6_m","pants6_f", true, langStringDefault("battlePass.seasons.may.af031548ec005592ec708a97454469d9"), langStringDefault("battlePass.seasons.may.f22dca2ba6da003c763d683cfc74170b"), langStringDefault("battlePass.seasons.may.8db1b9b1db30b9782b5610cec4b77044"), langStringDefault("battlePass.seasons.may.ed4b441adf5cf6b26b2a460fc6739b3a")),
        new CoinsReward(langStringDefault("battlePass.seasons.may.e6fc93e33945f0f64bd9ec8ab47cdbc4"), RewardRarity.COMMON, "coins1", false, 100),
        new MoneyReward(langStringDefault("battlePass.seasons.may.1c28ad15769adddd1ecfda5080a01c9b"), RewardRarity.COMMON, "money1", false, 30000),
        new VipReward(langStringDefault("battlePass.seasons.may.02dd1217a028567d814c77888db91f8f"), RewardRarity.COMMON, "vipS0", false, "Sapfire", 7),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.may.b5fc39411f951ff697f0754fc274f228"), RewardRarity.COMMON, "fortune", false),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 3),
        new ClothReward(langStringDefault("battlePass.seasons.may.31cd61f280e000b57b1c49cc96b39b11"), RewardRarity.LEGENDARY, "head1_m","head1_f", false, langStringDefault("battlePass.seasons.may.6891b49812bfd4d21ab577e5eb1da51a"), langStringDefault("battlePass.seasons.may.ef02bd7e08156406c92cb9d0b42dfc14"), langStringDefault("battlePass.seasons.may.3b49c169c514fa60cadf40946f9e76b0"), langStringDefault("battlePass.seasons.may.d5f43d3f37149ade775bf2033de6f13a")),
        new CoinsReward(langStringDefault("battlePass.seasons.may.834fb71e9de0c6f908eac5add41f7d0e"), RewardRarity.COMMON, "coins1", false, 100),
        new VipReward(langStringDefault("battlePass.seasons.may.98bbdac30c58d066dd3056439c826b99"), RewardRarity.COMMON, "vipD1", false, "Diamond", 7),
         new MoneyReward(langStringDefault("battlePass.seasons.may.6ae19105a0ace0351002bf89dfab8c4e"), RewardRarity.COMMON, "money1", false, 30000),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 6),
        new MoneyReward(langStringDefault("battlePass.seasons.may.15547048db1067c09eb387e281f13d93"), RewardRarity.COMMON, "money1", false, 30000),
        new ClothReward(langStringDefault("battlePass.seasons.may.5ec97c28a2197e682b5ecb2a16f87ab8"), RewardRarity.RARE, "mask17_m","mask17_f", false, langStringDefault("battlePass.seasons.may.c448b096f6a4ca68df62e3bb7d36cb38"), langStringDefault("battlePass.seasons.may.4c9549454fce44420fef624d36ccdec6"), langStringDefault("battlePass.seasons.may.bef1b5906995bf9f798263bb706ab0b5"), langStringDefault("battlePass.seasons.may.ff42fd64dc6eac3373019bdcdb7220fd"),),
        new CoinsReward(langStringDefault("battlePass.seasons.may.68024bb71ce41d29fa04cbbb463e8c85"), RewardRarity.COMMON, "coins1", false, 100),
        new VipReward(langStringDefault("battlePass.seasons.may.025ac8b1675c291889c9ac529604cc7a"), RewardRarity.COMMON, "vipS0", false, "Sapfire", 5),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 6),
        new MoneyReward(langStringDefault("battlePass.seasons.may.f2ad49cd0624afc8edec40c16ca9ede6"), RewardRarity.COMMON, "money0", false, 15000),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.may.9b8b93a3ea72e2cedd20cf1847652076"), RewardRarity.COMMON, "fortune", false),
        new ClothReward(langStringDefault("battlePass.seasons.may.df9eea19f9095e45a9ed90f08eae903d"), RewardRarity.LEGENDARY, "head4_m","head4_f", false, langStringDefault("battlePass.seasons.may.66c48419691795c246b116538fc11c87"), langStringDefault("battlePass.seasons.may.f83c3874c5359d7233e8aac9710b4713"),langStringDefault("battlePass.seasons.may.5feff1a2a38b15e2529f2e0638b579c0"),langStringDefault("battlePass.seasons.may.5876150cd5486a1de2b674de60cf26ed")),
        new VipReward(langStringDefault("battlePass.seasons.may.e6b886700be687a8fe95ac0e23decbb2"), RewardRarity.COMMON, "vipS0", false, "Sapfire", 5),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 6),
        new CoinsReward(langStringDefault("battlePass.seasons.may.57072b5301dfeeb351e19e3ea50e2b31"), RewardRarity.COMMON, "coins1", false, 100),
        new MoneyReward(langStringDefault("battlePass.seasons.may.138b515afa91c9bdfa7c2f047fdcdea5"), RewardRarity.COMMON, "money0", false, 17000),
        new InventoryItemReward(langStringDefault("battlePass.seasons.may.a80e50b6ff650d7bc8377bef2c1e0b26"), RewardRarity.RARE, "camo1",  false, 1604, 1),
        new ClothReward(langStringDefault("battlePass.seasons.may.fe2f02fa24cdea0c1d61050053ee47c3"), RewardRarity.LEGENDARY, "head0_m","head0_f", false, langStringDefault("battlePass.seasons.may.a7b8470461bed880743671bc012b384b"), langStringDefault("battlePass.seasons.may.bdd5d2676e70ac1c35fb6c880d96f27f"),langStringDefault("battlePass.seasons.may.91e893ea395bd5d9efe9e963fc66cbee"),langStringDefault("battlePass.seasons.may.91e893ea395bd5d9efe9e963fc66cbee")),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 3),
        new CoinsReward(langStringDefault("battlePass.seasons.may.d0fd4d02774e2b14aa519a4bb83ad58f"), RewardRarity.COMMON, "coins1", false, 50),
        new CoinsReward(langStringDefault("battlePass.seasons.may.736cb5dbb4622b120650d7968e1dc08c"), RewardRarity.COMMON, "coins1", false, 50),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.may.4664553487677f0c12e59505bc45d52e"), RewardRarity.COMMON, "fortune", false),
        new MoneyReward(langStringDefault("battlePass.seasons.may.eb815730b3776d4b1e255b70fb1db3b7"), RewardRarity.COMMON, "money0", false, 10000),
        new InventoryItemReward(langStringDefault("battlePass.seasons.may.02bdc2206d00860a4966a696e8d04292"), RewardRarity.LEGENDARY, "backpack1",  true, 2142, 1),
        new VipReward(langStringDefault("battlePass.seasons.may.0948dc5ce87fef5e5a78760afdc5ceb4"), RewardRarity.COMMON, "vipS0", false, "Sapfire", 3),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 3),
        new ClothReward(langStringDefault("battlePass.seasons.may.49666353872e959276f31ef962665a22"), RewardRarity.LEGENDARY, "body10_m","body10_f", false, langStringDefault("battlePass.seasons.may.8125eb2781b2cc1e0e1b767033d78eec"), langStringDefault("battlePass.seasons.may.4fdf69f652bd6914327dd30d10c8d57b"),langStringDefault("battlePass.seasons.may.0b99f53d421386f6c5766519b016f9fa"),langStringDefault("battlePass.seasons.may.0b99f53d421386f6c5766519b016f9fa")),
        new VipReward(langStringDefault("battlePass.seasons.may.b3d5cc24a86399c77a8c584ca0347eca"), RewardRarity.COMMON, "vipD1", false, "Diamond", 3),
        new MoneyReward(langStringDefault("battlePass.seasons.may.6c00557b3ea3a6b64ddee56b3e811ffe"), RewardRarity.COMMON, "money0", false, 10000),
        new ClothReward(langStringDefault("battlePass.seasons.may.407e1839ebb20edf0bde15cbd1ed7a9e"), RewardRarity.LEGENDARY, "sneakers6_m","sneakers6_f", false, langStringDefault("battlePass.seasons.may.cf816e876cf20c6b3e59039b3ac4edce"), langStringDefault("battlePass.seasons.may.888d277a9ac1ba9fa0802fd4da963b0e"),langStringDefault("battlePass.seasons.may.0391b9a19843134a42eedd7828994886"),langStringDefault("battlePass.seasons.may.0391b9a19843134a42eedd7828994886")),



        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 3),
        new CoinsReward(langStringDefault("battlePass.seasons.may.42f9d02dee0599a8cddc4fce8ee39991"), RewardRarity.COMMON, "coins0", false, 50),
        new CoinsReward(langStringDefault("battlePass.seasons.may.f1a988df6b80a09c405d12dafc0b4747"), RewardRarity.COMMON, "coins0", false, 50),
        new MoneyReward(langStringDefault("battlePass.seasons.may.e47f42ca35f6956b8cdf15203e98959c"), RewardRarity.COMMON, "money0", false, 10000),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.may.8e9a037ac80f1eb7d4ff76a8c4835f03"), RewardRarity.COMMON, "fortune", false),
        new ClothReward(langStringDefault("battlePass.seasons.may.37079da0872e0e9262dbfee7e3c979e0"), RewardRarity.LEGENDARY, "mask20_m","mask20_f", false, langStringDefault("battlePass.seasons.may.9de39a2870f9ae145d4b0e33f9a87c5f"), langStringDefault("battlePass.seasons.may.45fa377578b0ffc5cd5247aff9e09faa"),langStringDefault("battlePass.seasons.may.ce7785a365350e68f444cc864dcea61c"),langStringDefault("battlePass.seasons.may.ce7785a365350e68f444cc864dcea61c")),



        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 6),
        new CoinsReward(langStringDefault("battlePass.seasons.may.7eadeedc7be8e8297c051b5d887a19bd"), RewardRarity.COMMON, "coins0", false, 50),
        new MoneyReward(langStringDefault("battlePass.seasons.may.b8e7f240c0db9984c2a91905dd569f33"), RewardRarity.COMMON, "money0", false, 10000),
        new MoneyReward(langStringDefault("battlePass.seasons.may.b60c724ec07707ab11fbf13acad78889"), RewardRarity.COMMON, "money0", false, 10000),
        new CoinsReward(langStringDefault("battlePass.seasons.may.c70397c75b1d1e6c6de87417c9d0dadc"), RewardRarity.COMMON, "coins0", false, 50),
        new ClothReward(langStringDefault("battlePass.seasons.may.5e9c24ac086314c34e4e64e15331e18a"), RewardRarity.RARE, "head5_m","head5_f", false, langStringDefault("battlePass.seasons.may.28052edc99e0eafa6c99757fcaeadacc"), langStringDefault("battlePass.seasons.may.e47fa3a43321dc03c5a3c3c6f354a60b"), langStringDefault("battlePass.seasons.may.770ef2e544fd33cd43fdb99b04810e49"), langStringDefault("battlePass.seasons.may.3c7a358a248ec96e495191ed08d390dc")),


        new VipReward(langStringDefault("battlePass.seasons.may.0eddea3c7a509354a9698ae58d37d6b0"), RewardRarity.COMMON, "vipR0", false, "Ruby", 7),
        new CoinsReward(langStringDefault("battlePass.seasons.may.707688abe092062326a4da9559c08b02"), RewardRarity.COMMON, "coins0", false, 50),
        new VipReward(langStringDefault("battlePass.seasons.may.fbd5e449d9f6d000bb4e70d8ecc730bc"), RewardRarity.COMMON, "vipR0", false, "Ruby", 7),
        new MoneyReward(langStringDefault("battlePass.seasons.may.2c0aa476501e3bf8c4572caa71ea6cb5"), RewardRarity.COMMON, "money0", false, 10000),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.may.3b6279492ebcdab9f7eb835a5cd17c2c"), RewardRarity.COMMON, "fortune", false),
        new ClothReward(langStringDefault("battlePass.seasons.may.17e50013e73d6c0bfb52960e449b0b9d"), RewardRarity.RARE, "head2_m","head2_f", false, langStringDefault("battlePass.seasons.may.9fd5688874f47accbd38d3fb3e35de1a"), langStringDefault("battlePass.seasons.may.eb6c29c0ed2cc4bb1de69c254f4a1dcc"),langStringDefault("battlePass.seasons.may.d652e0b3ac003c17c20ad51b8758e389"), langStringDefault("battlePass.seasons.may.d652e0b3ac003c17c20ad51b8758e389")),


        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 6),
        new CoinsReward(langStringDefault("battlePass.seasons.may.1bf3ce279086ada1c4f242d559ca1e41"), RewardRarity.COMMON, "coins0", false, 50),
        new InventoryItemReward(langStringDefault("battlePass.seasons.may.c5f2198439841b9da88dbef111512239"), RewardRarity.RARE, "fire1",  false, 868, 3),
        new MoneyReward(langStringDefault("battlePass.seasons.may.dc46b8270f0371bd7d5a9dfd966f5592"), RewardRarity.COMMON, "money0", false, 11000),
        new InventoryItemReward(langStringDefault("battlePass.seasons.may.cda420c2fb028e6d46f35fea564f539d"), RewardRarity.RARE, "fire1",  false, 868, 3),
        new ClothReward(langStringDefault("battlePass.seasons.may.bcc358c0fc122dffc8ec32cd47660030"), RewardRarity.RARE, "sneakers5_m","sneakers5_f", false, langStringDefault("battlePass.seasons.may.b1a518ee5cb5f5d3a305e1825588ae61"), langStringDefault("battlePass.seasons.may.8e1ea8c2aa4ebc2a9585808e70669a2b"), langStringDefault("battlePass.seasons.may.0314dc1f7a0d03fbdb6387ed9772d727"), langStringDefault("battlePass.seasons.may.d4d94222fe9c2b019036c085d560eb01")),



        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 5),
        new MoneyReward(langStringDefault("battlePass.seasons.may.7db46d488630e0c863f292e19f8ce647"), RewardRarity.COMMON, "money0", false, 11000),
        new MoneyReward(langStringDefault("battlePass.seasons.may.f47d96b7387281b1ee7271037d6fb95d"), RewardRarity.COMMON, "money0", false, 11000),
        new CoinsReward(langStringDefault("battlePass.seasons.may.79593094c7bd76da6a0cbc0d9e8bd1c3"), RewardRarity.COMMON, "coins0", false, 50),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.may.fc424123b25430b5161f30ca6f4180b8"), RewardRarity.COMMON, "fortune", false),
        new ClothReward(langStringDefault("battlePass.seasons.may.676320c630ff219dbe5940e98ac25286"), RewardRarity.RARE, "parrot_m","parrot_f", false, langStringDefault("battlePass.seasons.may.1a6d0fe985a578453f96e39d8868ca01"), langStringDefault("battlePass.seasons.may.9e0dea2ca236bcb41f824b30a3bbab0b"), langStringDefault("battlePass.seasons.may.a6c72edeebdb276d91953c455e3f4f75"), langStringDefault("battlePass.seasons.may.a6c72edeebdb276d91953c455e3f4f75")),





        new InventoryItemReward(langStringDefault("battlePass.seasons.may.920c7f10122ed2fc2d0ae90f582c8f16"), RewardRarity.RARE, "z1",  false, 10003, 2),
        new CoinsReward(langStringDefault("battlePass.seasons.may.07c3c308f53834562fcf5afe83e2ffa3"), RewardRarity.COMMON, "coins0", false, 50),
        new InventoryItemReward(langStringDefault("battlePass.seasons.may.2ae1399e4f7bee879170bdb9be45f3f2"), RewardRarity.RARE, "z2",  false, 10009, 3),
        new InventoryItemReward(langStringDefault("battlePass.seasons.may.7ebc365dc77cfc8b709cb2e4fe7936a4"), RewardRarity.RARE, "z2",  false, 10009, 3),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 6),
        new ClothReward(langStringDefault("battlePass.seasons.may.708dcba24bdde231b3c3c943ccee79e1"), RewardRarity.RARE, "head5_m","head5_f", false, langStringDefault("battlePass.seasons.may.9cfb78fec180d632a7c184ae7c096677"), langStringDefault("battlePass.seasons.may.5c92d1ab649365450132fdcf649f8966"), langStringDefault("battlePass.seasons.may.3551de2d703fe96fbc22ea69b78d34de"), langStringDefault("battlePass.seasons.may.0e47196147b6c25f79411b064eb8b7d2")),







        new VipReward(langStringDefault("battlePass.seasons.may.e171332a9c4f6faa55d2899fa7f64739"), RewardRarity.COMMON, "vipD0", false, "Diamond", 7),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 12),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 12),
        new CoinsReward(langStringDefault("battlePass.seasons.may.5879ebb55acf715ee01ede4297074499"), RewardRarity.COMMON, "coins0", false, 100),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.may.1a960a7bac58ea5e9e0f2daf26f1bbf4"), RewardRarity.COMMON, "fortune", false),
        new ClothReward(langStringDefault("battlePass.seasons.may.49f37f595f9a110b41eec56433bbf8bd"), RewardRarity.LEGENDARY, "mask18_m","mask18_f", false, langStringDefault("battlePass.seasons.may.1323f919f0745c03738c86ada76afd73"), langStringDefault("battlePass.seasons.may.956c3f3deb45c028f4b65567908e3294") ,langStringDefault("battlePass.seasons.may.a1f1141c78f3219e1b469e567770ddd9"),langStringDefault("battlePass.seasons.may.d80dd5835d03030b2341c2ffec0f83c6")),





        new MoneyReward(langStringDefault("battlePass.seasons.may.9502bdec3b7c50ae47ff1abc8b91cc33"), RewardRarity.RARE, "money2", false, 20000),
        new MoneyReward(langStringDefault("battlePass.seasons.may.2fb17302acefbc7c4bf234366027f069"), RewardRarity.RARE, "money2", false, 20000),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 3),
        new VipReward(langStringDefault("battlePass.seasons.may.74ce47a73c9ff1123beaa1f461c6b1df"), RewardRarity.COMMON, "vipR0", false, "Ruby", 7),
        new VipReward(langStringDefault("battlePass.seasons.may.5325b62e43d169b900048aba4179f5c9"), RewardRarity.COMMON, "vipR1", false, "Diamond", 7),
        new ClothReward(langStringDefault("battlePass.seasons.may.7e6240cd18d36f00d3f25b8038b798c5"), RewardRarity.LEGENDARY, "pants7_m","pants7_f", false, langStringDefault("battlePass.seasons.may.7e6240cd18d36f00d3f25b8038b798c5"), langStringDefault("battlePass.seasons.may.0c53a4a9f2c4ce4a1e34472993579e28"),langStringDefault("battlePass.seasons.may.3c2c42d03f06f0456c55fee8898952c7"),langStringDefault("battlePass.seasons.may.3c2c42d03f06f0456c55fee8898952c7")),



        new MoneyReward(langStringDefault("battlePass.seasons.may.265cfa74cf4469fc18efa793a5aab6cf"), RewardRarity.RARE, "money3", false, 50000),
        new MoneyReward(langStringDefault("battlePass.seasons.may.a3da85c2a47aafff511916e772fcff69"), RewardRarity.RARE, "money3", false, 50000),
        new ClothReward(langStringDefault("battlePass.seasons.may.8fa50387479519188b3f087da778e7db"), RewardRarity.LEGENDARY, "body8_m","body8_f", true, langStringDefault("battlePass.seasons.may.8fa50387479519188b3f087da778e7db"), langStringDefault("battlePass.seasons.may.a53c455d1a7095cc4ac96ae89eef84e5"),langStringDefault("battlePass.seasons.may.9268128fa5ef4f764928e1a071c6d2c0"),langStringDefault("battlePass.seasons.may.2df4053e76f3a5fa0488e9046669aa61")),
        new VehicleReward("Panamera",RewardRarity.LEGENDARY, "Panamera", true, "panamera" )
        
    ],
    globalTasks:[
        new JobTaskConfig(-1, langStringDefault("battlePass.seasons.may.9468211cdbf329bb5c24457bfb1a028d"), langStringDefault("battlePass.seasons.may.85683884d7b4181068408fab9cc9d998"), 2000, 1700, "electric" ),
        new JobTaskConfig(-1, langStringDefault("battlePass.seasons.may.8a944f8bcf97d9ac30ac67dd38edb761"), langStringDefault("battlePass.seasons.may.cf10355344be6e34c3e68f8206151242"), 700, 1700, "bus" ),
        new FishingTaskConfig(-1, langStringDefault("battlePass.seasons.may.042433a13d5ecb4f52017187f2c01a2e"), langStringDefault("battlePass.seasons.may.293785e2c8b23aebc5433e0c3a81378b"), 150, 1700, 9210 ),
        new HuntTaskConfig(-1, langStringDefault("battlePass.seasons.may.43eb4fdd77cbb8c36a7ebc4b8a5ffe55"), langStringDefault("battlePass.seasons.may.685653277f9be5981c73ea33c3ea6e2b"), 80, 1700, 830 ),
        new FarmTaskConfig(-1, langStringDefault("battlePass.seasons.may.9ea7bd0a6247ea8b48f9e98ceaff1588"), langStringDefault("battlePass.seasons.may.581f30962d7132de99f5686d7dc397cb"), 2000, 1700, 7000, true ),
        new JobTaskConfig(-1, langStringDefault("battlePass.seasons.may.528f1d3040aaee83ae1a6b59174a4470"), langStringDefault("battlePass.seasons.may.2cb7a5eaba02ece5e37d026c336604b5"), 500, 1700, "collector" ),
        new JobTaskConfig(-1, langStringDefault("battlePass.seasons.may.d487b002eb522ec4c4af972b114a40d5"), langStringDefault("battlePass.seasons.may.66422925a56bcf0e9231cafed5c25c4d"), 1200, 1700, "apartmentRepair" ),
        new JobTaskConfig(-1, langStringDefault("battlePass.seasons.may.6b5737fdb34a2ec7738ccb9416f2c1a8"), langStringDefault("battlePass.seasons.may.d68f1feb739b839a0c7b5201fde4f182"), 100, 1700, "diving" ),
        new FarmTaskConfig(-1, langStringDefault("battlePass.seasons.may.555d00826c9088747302fb937ab81978"), langStringDefault("battlePass.seasons.may.c684082529e0cd8d80e3d2969c612b8b"), 2000, 1700, 7021, false ),
        new HuntTaskConfig(-1, langStringDefault("battlePass.seasons.may.21e66bc0d5797dc74b350f3e4baecebd"), langStringDefault("battlePass.seasons.may.f439062295765f9132e2f8d7d4299dc7"), 80, 1700, 831 ),
    ],
    basicTasks:[
        new JobTaskConfig(0, langStringDefault("battlePass.seasons.may.8034948b5402220669b3621b9537e5f5"), langStringDefault("battlePass.seasons.may.d6171ab8b099866ab5a699bc88c10912"), 60, 450, "electric" ),
        new JobTaskConfig(1, langStringDefault("battlePass.seasons.may.0e94b2c3f37f834de1dbcaf571455cbf"), langStringDefault("battlePass.seasons.may.0ea71f6684c53838252364c194690ad6"), 30, 450, "bus" ),
        new FishingTaskConfig(2, langStringDefault("battlePass.seasons.may.3556ad5f77e3e1e3fd3f708fda4ae766"), langStringDefault("battlePass.seasons.may.46c20210e9ad191d2b23017c31247381"), 18, 450, 9210 ),
        new HuntTaskConfig(3, langStringDefault("battlePass.seasons.may.d7d9c416d438755b9df969353c85836f"), langStringDefault("battlePass.seasons.may.120a43872ecdb8104a2506626cb28132"), 5, 450, 830 ),
        new FarmTaskConfig(4, langStringDefault("battlePass.seasons.may.2333c804441d112bf6c1ecc61995291a"), langStringDefault("battlePass.seasons.may.2baac4e1628229e8cc96b2d76e3e70f1"), 40, 450, 7000, true ),
        new JobTaskConfig(5, langStringDefault("battlePass.seasons.may.5e70eb0dfcc6308c5bc6f329b9a7e009"), langStringDefault("battlePass.seasons.may.6e7afcc2899ad16a1e7f06f7eda94e6d"), 10, 450, "taxi" ),
        new JobTaskConfig(6, langStringDefault("battlePass.seasons.may.adeebb84dbbfe451dd68acf4f9adbdcd"), langStringDefault("battlePass.seasons.may.5ea93f3481b6978b5aeeb3b3803d826a"), 15, 450, "collector" ),
        new JobTaskConfig(7, langStringDefault("battlePass.seasons.may.5e203358e10c2ba1dcbef3e3b51b379c"), langStringDefault("battlePass.seasons.may.27090d72d0b54b5dec97f1474b972389"), 40, 450, "apartmentRepair" ),
        new JobTaskConfig(8, langStringDefault("battlePass.seasons.may.9956b38333a29d91a2b3121c419fc314"), langStringDefault("battlePass.seasons.may.05d7cee7ec8e6368fbc081e719eedc8e"), 5, 450, "diving" ),
        new FarmTaskConfig(9, langStringDefault("battlePass.seasons.may.0a97cb7789d0e08d876da14ae41403d0"), langStringDefault("battlePass.seasons.may.e1e84cfb92f1fccb5badb19bb0d57cb4"), 45, 450, 7001, true ),
        new FarmTaskConfig(10, langStringDefault("battlePass.seasons.may.c25d1b8dcbf42cf5aa237c8f22c1dba8"), langStringDefault("battlePass.seasons.may.cc5d9d5662597d131f2b94e5bbe93541"), 30, 450, 7021, false ),
        new HuntTaskConfig(11, langStringDefault("battlePass.seasons.may.d0586618525596dc7d5f148985a4b22c"), langStringDefault("battlePass.seasons.may.c46239b8ac25c7a08d5fca4bd50c784e"), 2, 450, 831 ),
        new FarmTaskConfig(12, langStringDefault("battlePass.seasons.may.da4ca928f392a1cecce577952e20e261"), langStringDefault("battlePass.seasons.may.624c6e4d03f180aff28fde8338b2443f"), 90, 450, 7002, true ),
        new FarmTaskConfig(12, langStringDefault("battlePass.seasons.may.66a89bbb4866db370358ed6772c97053"), langStringDefault("battlePass.seasons.may.05fc61db67f59073eed6a27f43ef75ed"), 80, 450, 7022, false ),
        new FarmTaskConfig(13, langStringDefault("battlePass.seasons.may.4e1449edfad72d58ae94bf725b8e576a"), langStringDefault("battlePass.seasons.may.e58ac1e815d0dbafeacebce1bec5cce8"), 60, 450, 7003, true ),
        new FarmTaskConfig(14, langStringDefault("battlePass.seasons.may.46e2c05d51816ab5fbd4606bad33b9dc"), langStringDefault("battlePass.seasons.may.bb43108bcc66df363c368801f9399b21"), 32, 450, 7023, false ),
        new FarmTaskConfig(15, langStringDefault("battlePass.seasons.may.cdbee706ddb9b40d89c21be9eef7239b"), langStringDefault("battlePass.seasons.may.a14a51579a422f9b08b2e1486f4b5ad4"), 43, 450, 7004, true ),
        new FarmTaskConfig(16, langStringDefault("battlePass.seasons.may.c69eef3c08182c90f8d50775ea9cd00d"), langStringDefault("battlePass.seasons.may.b14fcea0ab21a473d70181360d225a34"), 54, 450, 7024, false ),
        new FarmTaskConfig(17, langStringDefault("battlePass.seasons.may.e2334c4da7d955ffdcdc5b4f70028e9b"), langStringDefault("battlePass.seasons.may.3b0e8872138e941fbf3f261d2fdf4f40"), 58, 450, 7005, true ),
        new FarmTaskConfig(18, langStringDefault("battlePass.seasons.may.57b1e06e69c50a126d4570b4440bcaa5"), langStringDefault("battlePass.seasons.may.77a5610a716691b2c99a66a972cbbd32"), 56, 450, 7025, false ),
        new FarmTaskConfig(19, langStringDefault("battlePass.seasons.may.8abe6212ba082a76b427a00ca02937ad"), langStringDefault("battlePass.seasons.may.370ad3c0b28f06da44cdf2101f5e99c7"), 55, 450, 7006, true ),
        new FarmTaskConfig(20, langStringDefault("battlePass.seasons.may.ff2516498da4d0176834aed05dfc71b8"), langStringDefault("battlePass.seasons.may.aea63214fc3e28a2bf0b37c90d431950"), 50, 450, 7026, false ),
        new FarmTaskConfig(21, langStringDefault("battlePass.seasons.may.7301e411969446fd7395fa5b74b71a07"), langStringDefault("battlePass.seasons.may.85d81d6302cc04d11ab0fb8927ba86b8"), 70, 450, 7007, true ),
        new FarmTaskConfig(22, langStringDefault("battlePass.seasons.may.2f859b5208f54f716afaf8569820d63a"), langStringDefault("battlePass.seasons.may.e39558379aca570bcd183add02d9b22e"), 45, 450, 7027, false ),
        new FarmTaskConfig(23, langStringDefault("battlePass.seasons.may.2eba4ec07ad0908edc98c4af8ddbd0de"), langStringDefault("battlePass.seasons.may.91b5d3058be9277fe400b3c4dd4a02ce"), 49, 450, 7008, true ),
        new FarmTaskConfig(24, langStringDefault("battlePass.seasons.may.a6eb214b7f84ff2ac1c2c13333f87b88"), langStringDefault("battlePass.seasons.may.29ce949e58dc237dbbee32a972ab6ed2"), 36, 450, 7028, false ),
        new FarmTaskConfig(25, langStringDefault("battlePass.seasons.may.8094c5143909d3a5889731d29f6f2978"), langStringDefault("battlePass.seasons.may.c2c1f849f5a41efed6bc45921267c8a8"), 37, 450, 7010, true ),
        new FarmTaskConfig(26, langStringDefault("battlePass.seasons.may.d205610c3e337224d5385a89c76291c6"), langStringDefault("battlePass.seasons.may.2c076461783f853a1d64f5c28974e09e"), 35, 450, 7030, false ),
        new FarmTaskConfig(27, langStringDefault("battlePass.seasons.may.d7ce6d8f1e1b75f9c28cf41bcaf15927"), langStringDefault("battlePass.seasons.may.de5661ddb57f41e9b7b7736abbab3dcc"), 40, 450, 9101, true ),
        new FarmTaskConfig(28, langStringDefault("battlePass.seasons.may.41a5791f77d9d2db6dbe97aec2f18f3f"), langStringDefault("battlePass.seasons.may.a5018d894be9136bd29b96e706e7bac3"), 40, 450, 9000, false ),
        new HuntTaskConfig(29, langStringDefault("battlePass.seasons.may.b3e2e6526923f0abc0f75a865ae659f9"), langStringDefault("battlePass.seasons.may.376d9ad90a96a1166033073a9f4d1bf2"), 2, 450, 832 ),
        new HuntTaskConfig(30, langStringDefault("battlePass.seasons.may.1c79cc89f5fd9c692e6947866eb7afb1"), langStringDefault("battlePass.seasons.may.8ebae9b28977f8aacbb34c7e1fd10462"), 4, 450, 833 ),
        new HuntTaskConfig(31, langStringDefault("battlePass.seasons.may.f33966e179fc27c6dd0a7ba81521123b"), langStringDefault("battlePass.seasons.may.cabbd6ef98654a42c2f36980f8e78165"), 2, 450, 834 ),
        new HuntTaskConfig(32, langStringDefault("battlePass.seasons.may.0069ed1c1ea3a3e2670b4af434fc68c8"), langStringDefault("battlePass.seasons.may.85d747a05393def2c74893623bd46dab"), 3, 450, 835 ),
        new HuntTaskConfig(33, langStringDefault("battlePass.seasons.may.faf884a578bf48036e9ac9927d66106c"), langStringDefault("battlePass.seasons.may.be99825852659f1bd91e2e58a6e49ea1"), 2, 450, 836 ),
        new FishingTaskConfig(34, langStringDefault("battlePass.seasons.may.8b177d0bc5abea6e2c825ab6dce72b8a"), langStringDefault("battlePass.seasons.may.50c108eff2d8a8c5af3c97c3def39dc3"), 18, 450, 9210 ),
        new FishingTaskConfig(35, langStringDefault("battlePass.seasons.may.f2f92f7ebfeebdc120e030b13ef61899"), langStringDefault("battlePass.seasons.may.297aafd46f4e2167e99bdb0f0971e8a4"), 5, 450, 9212 ),
        new FishingTaskConfig(36, langStringDefault("battlePass.seasons.may.8fc81c5f5a4e32101d8be83d43dd0f91"), langStringDefault("battlePass.seasons.may.8af1b4a0997c1d4c09c055c341881037"), 18, 450, 9210 ),
        new FishingTaskConfig(37, langStringDefault("battlePass.seasons.may.327f170d2c29a3fc66ff475c8ed17d8c"), langStringDefault("battlePass.seasons.may.ff882367ab8fd33a7b9c11e9f5664224"), 5, 450, 9212 ),
        new JobTaskConfig(38, langStringDefault("battlePass.seasons.may.124648a88c2cc0e3bc26df0598578d0f"), langStringDefault("battlePass.seasons.may.6c2175a57db526a738878973903c1f52"), 10, 450, "trucker" ),
        new JobTaskConfig(39, langStringDefault("battlePass.seasons.may.7161a4ee710e10f753d5bbaef7dbcc02"), langStringDefault("battlePass.seasons.may.eefafb78d15d1c30cbd53eef6c785bb8"), 10, 450, "firefighter" ),
        new JobTaskConfig(40, langStringDefault("battlePass.seasons.may.c5de2ba3f6498b8496d2fb97714e80ce"), langStringDefault("battlePass.seasons.may.c5de2ba3f6498b8496d2fb97714e80ce"), 40, 450, "garden" ),
        new JobTaskConfig(41, langStringDefault("battlePass.seasons.may.b325b41524c59a052cdc4a71cf264bfb"), langStringDefault("battlePass.seasons.may.475f0ffe935cf37f13bc735ff440967f"), 50, 450, "cleaning" ),
        new JobTaskConfig(42, langStringDefault("battlePass.seasons.may.4302c53640fee541ffea7126b8c5547e"), langStringDefault("battlePass.seasons.may.4302c53640fee541ffea7126b8c5547e"), 40, 450, "builder" ),
    ],
    randomExp: {
        exp: 400,
        hour: 19,
        minute: 0
    }       
}