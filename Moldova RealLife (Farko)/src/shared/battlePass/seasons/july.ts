import { langStringDefault } from "../../lang/index";
import {
    AnimationReward,
    ClothReward,
    CoinsReward,
    ExpReward,
    InventoryItemReward,
    LuckyWheelReward,
    MoneyReward,
    RewardRarity,
    VipReward
} from "../rewards";
import {IBattlePassSeason} from "../season";
import {FarmTaskConfig, FishingTaskConfig, HuntTaskConfig, JobTaskConfig} from "../tasks";

export const JULY_SEASON: IBattlePassSeason = {
    id: "july-season",
    name: langStringDefault("battlePass.seasons.july.d26bcd5b80c3f8acc678d57be0dc6aca"),
    levelExp: 1001,
    everyDayExp: {
        time: 2,
        exp: 250
    },
    levelPrice: 500,
    endTime: 1664759700,
    battlePassCost: 4000,
    discount: {
        expires: 1659517200,
        specialPrice: 3000

    },
    rewards:[
        new LuckyWheelReward(langStringDefault("battlePass.seasons.july.825ea79fcbcd4cb128f0a790ed7e5ffe"), RewardRarity.COMMON, "fortune", false),
        new AnimationReward(1, RewardRarity.LEGENDARY, "anim", false),
        new CoinsReward(langStringDefault("battlePass.seasons.july.5efe69758316dfe8687e1fc9fabc75bd"), RewardRarity.COMMON, "coins1", false, 100),
        new VipReward(langStringDefault("battlePass.seasons.july.8ddc82e309e36ce32682be7cae55294a"), RewardRarity.COMMON, "vipR0", false, "Ruby", 7),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 3),
        new ClothReward(langStringDefault("battlePass.seasons.july.ad5c61b0fc8201828e2315455af021dc"), RewardRarity.RARE, "Nike_1","Nike_1", false, langStringDefault("battlePass.seasons.july.863071f75b20457e569c41ba6651e56e"), langStringDefault("battlePass.seasons.july.ad5c61b0fc8201828e2315455af021dc"), langStringDefault("battlePass.seasons.july.c575f29d56f1a9f7bf53fd8ef36f7716"), langStringDefault("battlePass.seasons.july.c575f29d56f1a9f7bf53fd8ef36f7716")),

        new CoinsReward(langStringDefault("battlePass.seasons.july.2c31b4540fa3f47434a008642082b717"), RewardRarity.COMMON, "coins1", false, 100),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.july.521ea5a49711d59116cf594fac954e68"), RewardRarity.COMMON, "fortune", false),
        new AnimationReward(2, RewardRarity.LEGENDARY, "anim", false),
        new VipReward(langStringDefault("battlePass.seasons.july.b06f4d266a7748b80934900397062b0e"), RewardRarity.COMMON, "vipD0", false, "Diamond", 3),
        new MoneyReward(langStringDefault("battlePass.seasons.july.544be3518e70131327186171a24ebfbc"), RewardRarity.COMMON, "money1", false, 25000),
        new ClothReward(langStringDefault("battlePass.seasons.july.7d2887fbb7e516bbc83dc39f4fe34dde"), RewardRarity.LEGENDARY, "Nike_2","Nike_2", false, langStringDefault("battlePass.seasons.july.d83db6f1c68ddb1e38838f0ede0ec968"), langStringDefault("battlePass.seasons.july.7d2887fbb7e516bbc83dc39f4fe34dde"), langStringDefault("battlePass.seasons.july.77ed52f5abeae854a6b4e009c46104bf"), langStringDefault("battlePass.seasons.july.ecbe25e827991daade5a846179e022c7")),

        new CoinsReward(langStringDefault("battlePass.seasons.july.b4adc8cce3b95499df2a972a70234649"), RewardRarity.COMMON, "coins1", false, 100),
        new MoneyReward(langStringDefault("battlePass.seasons.july.bc3253639c9d822aa364bf42b77af94f"), RewardRarity.COMMON, "money1", false, 30000),
        new ClothReward(langStringDefault("battlePass.seasons.july.2e610d6c1d9e6bd2bea3fc63897be654"), RewardRarity.LEGENDARY, "Revenge_1","Revenge_1", true, langStringDefault("battlePass.seasons.july.86aa0311cc38462b76c0fbd922871ea7"), langStringDefault("battlePass.seasons.july.2e610d6c1d9e6bd2bea3fc63897be654"), langStringDefault("battlePass.seasons.july.b14e123ac878e54cc10244ccd51f726e"), langStringDefault("battlePass.seasons.july.b14e123ac878e54cc10244ccd51f726e")),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.july.9a4f83bd7e5c1f2daa3ae6946d3b8d2d"), RewardRarity.COMMON, "fortune", false),
        new AnimationReward(3, RewardRarity.LEGENDARY, "anim", false),
        new ClothReward(langStringDefault("battlePass.seasons.july.0d420b23d6a0c528408ba691fb536d91"), RewardRarity.LEGENDARY, "Revenge_2","Revenge_2", true, langStringDefault("battlePass.seasons.july.7cdb3910575b587224a1728531abd803"), langStringDefault("battlePass.seasons.july.0d420b23d6a0c528408ba691fb536d91"), langStringDefault("battlePass.seasons.july.05ee9500a59d05b963ff8c420b09479b"), langStringDefault("battlePass.seasons.july.dad29d9d5a6700119abe46fb9611d1d4")),

        new CoinsReward(langStringDefault("battlePass.seasons.july.7fddfac1ba975255b90356e379e295d9"), RewardRarity.COMMON, "coins1", false, 100),
        new VipReward(langStringDefault("battlePass.seasons.july.9031082694ab3afb147496fa1cb1dbe6"), RewardRarity.COMMON, "vipD1", false, "Diamond", 7),
        new ClothReward(langStringDefault("battlePass.seasons.july.49fa00afa20b5cfb1cc40f7010382362"), RewardRarity.LEGENDARY, "Revenge_3","Revenge_3", true, langStringDefault("battlePass.seasons.july.c493c43294a8cc1b81c9cd12ccd18c64"), langStringDefault("battlePass.seasons.july.49fa00afa20b5cfb1cc40f7010382362"), langStringDefault("battlePass.seasons.july.edcd559c5c7a315a7aba79f206dba410"), langStringDefault("battlePass.seasons.july.4c1f7c0144e1d6baf877fa53625b67d2")),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 6),
        new MoneyReward(langStringDefault("battlePass.seasons.july.d94caf6af3792940eda8bc10244e373b"), RewardRarity.COMMON, "money1", false, 30000),
        new ClothReward(langStringDefault("battlePass.seasons.july.172d2fea7d8ab0ee0885152895fd5c26"), RewardRarity.RARE, "Revenge_4","Revenge_4", true, langStringDefault("battlePass.seasons.july.65dff5b25328d355c76ab8075e5515fd"), langStringDefault("battlePass.seasons.july.172d2fea7d8ab0ee0885152895fd5c26"), langStringDefault("battlePass.seasons.july.12cb2c75783f08cccac19aa817f01b0f"), langStringDefault("battlePass.seasons.july.b5763896f151783907416b2053294f16"),),

        new CoinsReward(langStringDefault("battlePass.seasons.july.0afdae8b3d065c29cc59937ff97fe049"), RewardRarity.COMMON, "coins1", false, 100),
        new VipReward(langStringDefault("battlePass.seasons.july.55571518b5324e9bd6def983c59e7537"), RewardRarity.COMMON, "vipS0", false, "Sapfire", 5),
        new ClothReward(langStringDefault("battlePass.seasons.july.281bbc4b0046ba599a85251aaaa5b3dd"), RewardRarity.RARE, "black_1","black_1", true, langStringDefault("battlePass.seasons.july.c6b5b4b9efd078e6dfb48d3e0f9a8538"), langStringDefault("battlePass.seasons.july.281bbc4b0046ba599a85251aaaa5b3dd"), langStringDefault("battlePass.seasons.july.965952ec32bf4d0e63f239cca1e07793"), langStringDefault("battlePass.seasons.july.965952ec32bf4d0e63f239cca1e07793"),),
        new MoneyReward(langStringDefault("battlePass.seasons.july.314de6e0c15bb7bf0ff1fec766a08b06"), RewardRarity.COMMON, "money0", false, 15000),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.july.f8c56b8718dd376d898057a0ff9b6dea"), RewardRarity.COMMON, "fortune", false),
        new ClothReward(langStringDefault("battlePass.seasons.july.97c43c9ef271fc11d8bc179a5dc10778"), RewardRarity.LEGENDARY, "black_2","black_2", true, langStringDefault("battlePass.seasons.july.09ea8d507cf8a54bde829f863ec163d9"), langStringDefault("battlePass.seasons.july.97c43c9ef271fc11d8bc179a5dc10778"),langStringDefault("battlePass.seasons.july.aa7d989685b5341ea1dfd0b285a19552"),langStringDefault("battlePass.seasons.july.3139d2b01c59209106ac219547910c15")),

        new VipReward(langStringDefault("battlePass.seasons.july.f59d9adb915555c5a03b06adfc06614a"), RewardRarity.COMMON, "vipS0", false, "Sapfire", 5),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 6),
        new ClothReward(langStringDefault("battlePass.seasons.july.02563bb79de1aaae2fe76995f1f50c49"), RewardRarity.LEGENDARY, "black_3","black_3", true, langStringDefault("battlePass.seasons.july.9382fdbd515a41d2962d4e8166df75e9"), langStringDefault("battlePass.seasons.july.02563bb79de1aaae2fe76995f1f50c49"),langStringDefault("battlePass.seasons.july.de41b0e5c6d2a27691e8dfe08c493dac"),langStringDefault("battlePass.seasons.july.de41b0e5c6d2a27691e8dfe08c493dac")),
        new MoneyReward(langStringDefault("battlePass.seasons.july.eed0445a6d4a1a7bf36cdf18d08cc6a8"), RewardRarity.COMMON, "money0", false, 17000),
        new InventoryItemReward(langStringDefault("battlePass.seasons.july.1009a9bfe51f69c4cac3c4f5fb027820"), RewardRarity.RARE, "camo1",  false, 1604, 1),
        new ClothReward(langStringDefault("battlePass.seasons.july.faf0b456548f980d67c29e01c7cfed69"), RewardRarity.LEGENDARY, "black_4","black_4", true, langStringDefault("battlePass.seasons.july.583b32cb7756e6007555c9a9e0fe9fd3"), langStringDefault("battlePass.seasons.july.faf0b456548f980d67c29e01c7cfed69"),langStringDefault("battlePass.seasons.july.fa758582a50636bb8928ef48a99d6c53"),langStringDefault("battlePass.seasons.july.fa758582a50636bb8928ef48a99d6c53")),

        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 3),
        new CoinsReward(langStringDefault("battlePass.seasons.july.ab72c8d0a384414cd7646f18622e94d0"), RewardRarity.COMMON, "coins1", false, 50),
        new ClothReward(langStringDefault("battlePass.seasons.july.3d4f3904e831a94cd29db5d883d4910d"), RewardRarity.LEGENDARY, "ZXC_1","ZXC_1", true, langStringDefault("battlePass.seasons.july.2394dee14e8a8f56df1fd50866b48302"), langStringDefault("battlePass.seasons.july.3d4f3904e831a94cd29db5d883d4910d"),langStringDefault("battlePass.seasons.july.7f95e0c1d93cf47b191f062b1060e892"),langStringDefault("battlePass.seasons.july.7f95e0c1d93cf47b191f062b1060e892")),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.july.6381bc0e57742070f6ace6247fa13f7d"), RewardRarity.COMMON, "fortune", false),
        new MoneyReward(langStringDefault("battlePass.seasons.july.223f04a04d665d4df020d6326630680a"), RewardRarity.COMMON, "money0", false, 10000),
        new ClothReward(langStringDefault("battlePass.seasons.july.7bfb335171f36b3fcbd89e11554e4d18"), RewardRarity.LEGENDARY, "ZXC_2","ZXC_2", true, langStringDefault("battlePass.seasons.july.259c9f435c71c8caa4a5f940f396672a"), langStringDefault("battlePass.seasons.july.7bfb335171f36b3fcbd89e11554e4d18"),langStringDefault("battlePass.seasons.july.c91e14f63f0500e5c85cd26cdfa38580"),langStringDefault("battlePass.seasons.july.7dacbf87022e0e714d69ae298525e307")),

        new VipReward(langStringDefault("battlePass.seasons.july.d879ed8e4a881eab0e1a5910ea41b86f"), RewardRarity.COMMON, "vipS0", false, "Sapfire", 3),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 3),
        new ClothReward(langStringDefault("battlePass.seasons.july.c022b3e38be1b4426f0982b0573dca1f"), RewardRarity.LEGENDARY, "ZXC_3","ZXC_3", true, langStringDefault("battlePass.seasons.july.1430f51b1da150247a039d5cd083a5f8"), langStringDefault("battlePass.seasons.july.c022b3e38be1b4426f0982b0573dca1f"),langStringDefault("battlePass.seasons.july.183604199524c17ee6c51f22c50b4313"),langStringDefault("battlePass.seasons.july.8a66e065de346612d3a2aa2c7cca7910")),
        new VipReward(langStringDefault("battlePass.seasons.july.e33caf428bb053c28c060ff07713b5f4"), RewardRarity.COMMON, "vipD1", false, "Diamond", 3),
        new MoneyReward(langStringDefault("battlePass.seasons.july.86cf6a80123fc06759c7d290af9a06e4"), RewardRarity.COMMON, "money0", false, 10000),
        new AnimationReward(4, RewardRarity.LEGENDARY, "anim", false),



        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 3),
        new CoinsReward(langStringDefault("battlePass.seasons.july.243572120d33f9e58d578b6df6ebd915"), RewardRarity.COMMON, "coins0", false, 50),
        new ClothReward(langStringDefault("battlePass.seasons.july.35cbd34e8d82e573c987c45550488534"), RewardRarity.LEGENDARY, "ban_1","ban_1", false, langStringDefault("battlePass.seasons.july.12e71e25af584ffa6ac8209ce2011d49"), langStringDefault("battlePass.seasons.july.35cbd34e8d82e573c987c45550488534"),langStringDefault("battlePass.seasons.july.5ca9a75cadb78621e41d908d46a137c4"),langStringDefault("battlePass.seasons.july.5ca9a75cadb78621e41d908d46a137c4")),
        new MoneyReward(langStringDefault("battlePass.seasons.july.e655125c8e2d688346160e7a9ad23240"), RewardRarity.COMMON, "money0", false, 10000),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.july.61559dc71853067801f7f510f1021329"), RewardRarity.COMMON, "fortune", false),
        new ClothReward(langStringDefault("battlePass.seasons.july.20e911f76db323e72e4b41c5424a42d3"), RewardRarity.LEGENDARY, "scarf_1","scarf_1", false, langStringDefault("battlePass.seasons.july.b94649f4bc94ec880d2efe7d3c55bc67"), langStringDefault("battlePass.seasons.july.20e911f76db323e72e4b41c5424a42d3"),langStringDefault("battlePass.seasons.july.0163197ba36a462edea7c6e139964704"),langStringDefault("battlePass.seasons.july.54d102f27941c8be7d6ba146a097a08d")),



        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 6),
        new CoinsReward(langStringDefault("battlePass.seasons.july.855c4ed08ae9dac990b1b8771a3df5ee"), RewardRarity.COMMON, "coins0", false, 50),
        new InventoryItemReward(langStringDefault("battlePass.seasons.july.b588433ef6505c210c5ccc26cd8d120d"), RewardRarity.LEGENDARY, "backpack_1",  true, 2146, 1),
        new MoneyReward(langStringDefault("battlePass.seasons.july.6c6e796b4f7ac46b7d39050a364bedb5"), RewardRarity.COMMON, "money0", false, 10000),
        new CoinsReward(langStringDefault("battlePass.seasons.july.ad5066dc8c5ccf735f9f20fb7649d535"), RewardRarity.COMMON, "coins0", false, 50),
        new AnimationReward(5, RewardRarity.LEGENDARY, "anim", false),


        new VipReward(langStringDefault("battlePass.seasons.july.eabf76b0ea0d79134d2612663a478089"), RewardRarity.COMMON, "vipR0", false, "Ruby", 7),
        new CoinsReward(langStringDefault("battlePass.seasons.july.ede62a90a9de1308053e9335af6fee4c"), RewardRarity.COMMON, "coins0", false, 50),
        new InventoryItemReward(langStringDefault("battlePass.seasons.july.d819c7ef7c90ae978ad833b176444588"), RewardRarity.LEGENDARY, "backpack_2",  true, 2147, 1),
        new MoneyReward(langStringDefault("battlePass.seasons.july.8509f56361261a3c03cad7631b0ca6ee"), RewardRarity.COMMON, "money0", false, 10000),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.july.8c18b1bd96482d821d2c28891c342053"), RewardRarity.COMMON, "fortune", false),
        new AnimationReward(6, RewardRarity.LEGENDARY, "anim", false),


        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 6),
        new CoinsReward(langStringDefault("battlePass.seasons.july.a4360074b29f7deada76aca7de9bbc70"), RewardRarity.COMMON, "coins0", false, 50),
        new InventoryItemReward(langStringDefault("battlePass.seasons.july.8d328d5babd763d9f29b42128c3a3e85"), RewardRarity.RARE, "fire1",  false, 868, 3),
        new MoneyReward(langStringDefault("battlePass.seasons.july.dc90b07e7b0acdee67b7a41a74e8d6e0"), RewardRarity.COMMON, "money0", false, 11000),
        new InventoryItemReward(langStringDefault("battlePass.seasons.july.8e451c89bd1b0f77b2562146ef660e2b"), RewardRarity.RARE, "fire1",  false, 868, 3),
        new AnimationReward(7, RewardRarity.LEGENDARY, "anim", false),



        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 5),
        new MoneyReward(langStringDefault("battlePass.seasons.july.acf2bb06bc5381efc68a8b2c0a91dab2"), RewardRarity.COMMON, "money0", false, 11000),
        new ClothReward(langStringDefault("battlePass.seasons.july.afa5c38d180ad6e42ae876c7b4c845d2"), RewardRarity.LEGENDARY, "Jordan_1","Jordan_1", false, langStringDefault("battlePass.seasons.july.f5a54e09c0c0764a235a4eda671efcb0"), langStringDefault("battlePass.seasons.july.afa5c38d180ad6e42ae876c7b4c845d2"),langStringDefault("battlePass.seasons.july.b9af9f70988156432d034636a28ee19b"),langStringDefault("battlePass.seasons.july.fab525b90f9e73c3522a3aa4bcb46136")),
        new CoinsReward(langStringDefault("battlePass.seasons.july.28f3dfb558923b002f79cc40e7e2ac5e"), RewardRarity.COMMON, "coins0", false, 50),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.july.542fb0ffa2b381bed5fe51319f8e68b9"), RewardRarity.COMMON, "fortune", false),
        new AnimationReward(8, RewardRarity.LEGENDARY, "anim", false),





        new InventoryItemReward(langStringDefault("battlePass.seasons.july.ae68e6615609dc27cbcc0c19ac2d64d7"), RewardRarity.RARE, "z1",  false, 10003, 2),
        new CoinsReward(langStringDefault("battlePass.seasons.july.801960426f2791fa84bb3a2dc288ec9a"), RewardRarity.COMMON, "coins0", false, 50),
        new ClothReward(langStringDefault("battlePass.seasons.july.c1c47f26186bcb25e3eea5dbbec8c3d1"), RewardRarity.LEGENDARY, "Off_1","Off_1", false, langStringDefault("battlePass.seasons.july.0f1120cd19ed723ab0333c213f7ccb12"), langStringDefault("battlePass.seasons.july.c1c47f26186bcb25e3eea5dbbec8c3d1"),langStringDefault("battlePass.seasons.july.d00ca861c0a48efea16fd5c1085ff7e3"),langStringDefault("battlePass.seasons.july.b44e2a3223671e5a52eb52174fb6fdf5")),
        new InventoryItemReward(langStringDefault("battlePass.seasons.july.103fd43e03222dee50abb738b43ed19c"), RewardRarity.RARE, "z2",  false, 10009, 3),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 6),
        new AnimationReward(9, RewardRarity.LEGENDARY, "anim", false),






        new VipReward(langStringDefault("battlePass.seasons.july.fe456882fc6ed5272c80196c81d5b641"), RewardRarity.COMMON, "vipD0", false, "Diamond", 7),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 12),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 12),
        new CoinsReward(langStringDefault("battlePass.seasons.july.307c382fbacb61b2efaa77afd6f58bea"), RewardRarity.COMMON, "coins0", false, 100),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.july.9a3c57eeb487026a787845001cdd76a5"), RewardRarity.COMMON, "fortune", false),
        new AnimationReward(10, RewardRarity.LEGENDARY, "anim", false),





        new MoneyReward(langStringDefault("battlePass.seasons.july.fc0a76943a7429c8c4559cacb6946b16"), RewardRarity.RARE, "money2", false, 20000),
        new MoneyReward(langStringDefault("battlePass.seasons.july.d4f659f2e8006d0084cb151e60813630"), RewardRarity.RARE, "money2", false, 20000),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 3),
        new VipReward(langStringDefault("battlePass.seasons.july.47f5718310760a325a96cdb61ef8b448"), RewardRarity.COMMON, "vipR0", false, "Ruby", 7),
        new VipReward(langStringDefault("battlePass.seasons.july.ae94e916874bf245c2650f22574a5e19"), RewardRarity.COMMON, "vipD0", false, "Diamond", 7),
        new AnimationReward(11, RewardRarity.LEGENDARY, "anim", false),



        new MoneyReward(langStringDefault("battlePass.seasons.july.418bb76f0e8daec6bd6af18e7f402518"), RewardRarity.RARE, "money3", false, 50000),
        new AnimationReward(12, RewardRarity.LEGENDARY, "anim", false),
        new VipReward(langStringDefault("battlePass.seasons.july.9bbe4b29acc0a79a14f0c14edfa99df5"), RewardRarity.COMMON, "vipD0", false, "Diamond", 7),
        new AnimationReward(13, RewardRarity.LEGENDARY, "anim", false)
    ],
    globalTasks:[
        new JobTaskConfig(-1, langStringDefault("battlePass.seasons.july.209fbdddfc3ba3fa0d6491d7406e0ae5"), langStringDefault("battlePass.seasons.july.6e710c26d9dc8e73cc347271f1189f0f"), 2000, 1700, "electric" ),
        new JobTaskConfig(-1, langStringDefault("battlePass.seasons.july.ea7f721edb88764c2873495e412fb4c5"), langStringDefault("battlePass.seasons.july.7e09808504c990d06cb74920b62670de"), 700, 1700, "bus" ),
        new FishingTaskConfig(-1, langStringDefault("battlePass.seasons.july.aeba26c192357ae491a05f01e904a5fd"), langStringDefault("battlePass.seasons.july.326ad241365649ed0ca5029b4162aabb"), 150, 1700, 9210 ),
        new HuntTaskConfig(-1, langStringDefault("battlePass.seasons.july.ca0ff4fdb89bb123b4ff1b299a2a713c"), langStringDefault("battlePass.seasons.july.c90f8ee0483c8572de3559f878c7dc8b"), 80, 1700, 830 ),
        new FarmTaskConfig(-1, langStringDefault("battlePass.seasons.july.5ad959b34d70dfe4dbc4c1b3976510f3"), langStringDefault("battlePass.seasons.july.5da38b9d6711f1e709d135ecdd219781"), 2000, 1700, 7000, true ),
        new JobTaskConfig(-1, langStringDefault("battlePass.seasons.july.c02f336edf90799c06c1b31f558ee3b2"), langStringDefault("battlePass.seasons.july.d06528319753a9614ba71d3cf947af12"), 500, 1700, "collector" ),
        new JobTaskConfig(-1, langStringDefault("battlePass.seasons.july.e9c911bde7792257142ab1f6f10a46cb"), langStringDefault("battlePass.seasons.july.4a8b0a5314997b4b22f61d1557721ff4"), 1200, 1700, "apartmentRepair" ),
        new JobTaskConfig(-1, langStringDefault("battlePass.seasons.july.60f359ca63337f12a88601d5743142b3"), langStringDefault("battlePass.seasons.july.efa8fe64e25c22b0471b17fd3e046440"), 100, 1700, "diving" ),
        new FarmTaskConfig(-1, langStringDefault("battlePass.seasons.july.7c74bf6c6afbf40b6fb185e6c68da206"), langStringDefault("battlePass.seasons.july.4eeba5fc63be8d3c2a10ecd5fed0e6be"), 2000, 1700, 7021, false ),
        new HuntTaskConfig(-1, langStringDefault("battlePass.seasons.july.6d62d9ab93f36b2178595ad19072dc60"), langStringDefault("battlePass.seasons.july.c42bde8bbacb220f0717daae2c2a9f01"), 80, 1700, 831 ),
    ],
    basicTasks:[
        new JobTaskConfig(0, langStringDefault("battlePass.seasons.july.98f67b9095111a2338bda2612d7127b4"), langStringDefault("battlePass.seasons.july.f5d62dcfd893538cbe3843a1879075e0"), 60, 450, "electric" ),
        new JobTaskConfig(1, langStringDefault("battlePass.seasons.july.83a2d5f85ce2cd79a5a7278475a5814e"), langStringDefault("battlePass.seasons.july.469a90264d288c9b86883f71c7e4a82b"), 30, 450, "bus" ),
        new FishingTaskConfig(2, langStringDefault("battlePass.seasons.july.658cf5716ed09819300b757cae0fcbcf"), langStringDefault("battlePass.seasons.july.b862487fe6c9e399bf02e1d966ecca7e"), 18, 450, 9210 ),
        new HuntTaskConfig(3, langStringDefault("battlePass.seasons.july.26afdc809e5914403f361721e3817ee9"), langStringDefault("battlePass.seasons.july.a63da355a2047e1ed7c9aaebf9403648"), 5, 450, 830 ),
        new FarmTaskConfig(4, langStringDefault("battlePass.seasons.july.d8848106c56fff91725065efe636f5ff"), langStringDefault("battlePass.seasons.july.b1250a2438c3c9dbe10056cc2ae4adc2"), 40, 450, 7000, true ),
        new JobTaskConfig(5, langStringDefault("battlePass.seasons.july.49490fa0b4a294c1c68d8522c3c9f1ee"), langStringDefault("battlePass.seasons.july.e4d3d91b13bb89695c05a596fdb5a457"), 10, 450, "taxi" ),
        new JobTaskConfig(6, langStringDefault("battlePass.seasons.july.1b129a8a7a83f2566fce21ce22336607"), langStringDefault("battlePass.seasons.july.285ee8c6725ab86f8694536b53bd0a99"), 15, 450, "collector" ),
        new JobTaskConfig(7, langStringDefault("battlePass.seasons.july.32bb4192b7b5ffd9dbc82ce8d10dbce6"), langStringDefault("battlePass.seasons.july.383a061aebcfb7004a5832297959346e"), 40, 450, "apartmentRepair" ),
        new JobTaskConfig(8, langStringDefault("battlePass.seasons.july.c7c7f4ac1505ac593fcd3dbc69896dde"), langStringDefault("battlePass.seasons.july.fd63d815f66007a7962b266115570397"), 5, 450, "diving" ),
        new FarmTaskConfig(9, langStringDefault("battlePass.seasons.july.6157d1ff51b8bc5cb954ea1962cc8cb7"), langStringDefault("battlePass.seasons.july.80eee5a7847f1c8528ed673fcb6f8bb7"), 45, 450, 7001, true ),
        new FarmTaskConfig(10, langStringDefault("battlePass.seasons.july.be27b3beb7d6b15ca68203c3fded57de"), langStringDefault("battlePass.seasons.july.1e1860797e7fc128d54b64f3c28f44e4"), 30, 450, 7021, false ),
        new HuntTaskConfig(11, langStringDefault("battlePass.seasons.july.d186dac430e9a5552a3c402fa428b17c"), langStringDefault("battlePass.seasons.july.6bb401de36a7cc6166ab4b82176c450b"), 2, 450, 831 ),
        new FarmTaskConfig(12, langStringDefault("battlePass.seasons.july.4e1910441b6fe19d5f4934f34dff2cad"), langStringDefault("battlePass.seasons.july.74d136d4c855b5adb429b6c401c74cda"), 90, 450, 7002, true ),
        new FarmTaskConfig(12, langStringDefault("battlePass.seasons.july.fc70613f5eea67ca023f246192fc2ee4"), langStringDefault("battlePass.seasons.july.acbbdd114335e0227d4cc5638e94e7bc"), 80, 450, 7022, false ),
        new FarmTaskConfig(13, langStringDefault("battlePass.seasons.july.50d8db28c6cbe74edbfa2eaba82650f0"), langStringDefault("battlePass.seasons.july.1802175893112e474cf6370c28f73f41"), 60, 450, 7003, true ),
        new FarmTaskConfig(14, langStringDefault("battlePass.seasons.july.ff5211b7cb92b513392d4ead109ed827"), langStringDefault("battlePass.seasons.july.b869408f1ea5d72fcdfb3149c1f33ea7"), 32, 450, 7023, false ),
        new FarmTaskConfig(15, langStringDefault("battlePass.seasons.july.99f8e4c483680d33a9c0c47175cfe150"), langStringDefault("battlePass.seasons.july.66a2dd311cdc78990ea8392b36aef1bf"), 43, 450, 7004, true ),
        new FarmTaskConfig(16, langStringDefault("battlePass.seasons.july.fb50e13912b1964ca7b673c799c4012c"), langStringDefault("battlePass.seasons.july.60b4ccf2d5227b1a7158e1d6413935d1"), 54, 450, 7024, false ),
        new FarmTaskConfig(17, langStringDefault("battlePass.seasons.july.5622ae5bf42d1b1e079b5095ee58e2b9"), langStringDefault("battlePass.seasons.july.4031c82b3b332c36a5dfe9bae84d5967"), 58, 450, 7005, true ),
        new FarmTaskConfig(18, langStringDefault("battlePass.seasons.july.f0e16ad449ff5f37b55934f14e9855af"), langStringDefault("battlePass.seasons.july.9586885deb80c69e846009a2dd92ebee"), 56, 450, 7025, false ),
        new FarmTaskConfig(19, langStringDefault("battlePass.seasons.july.bf2f5cd278164076e9cc962017f3d710"), langStringDefault("battlePass.seasons.july.0236df07bfe78dc686b4822f6194b77b"), 55, 450, 7006, true ),
        new FarmTaskConfig(20, langStringDefault("battlePass.seasons.july.be225d3731ce1b3c767cc7243b5d584e"), langStringDefault("battlePass.seasons.july.7fab2647b0602543ef6937b46e6947d7"), 50, 450, 7026, false ),
        new FarmTaskConfig(21, langStringDefault("battlePass.seasons.july.7ecb7b2bbd4478dbb4b33ea66916a701"), langStringDefault("battlePass.seasons.july.4662a08ff03aa6b1b91de9d8b687ed4c"), 70, 450, 7007, true ),
        new FarmTaskConfig(22, langStringDefault("battlePass.seasons.july.cf440e43ad56b8ddf484e65ca01e8652"), langStringDefault("battlePass.seasons.july.e3355b1cbe4546aa8ed0f290200be16a"), 45, 450, 7027, false ),
        new FarmTaskConfig(23, langStringDefault("battlePass.seasons.july.1d41e7be18cd92d8946e5fb01dc881b2"), langStringDefault("battlePass.seasons.july.50e54c1f1c6828bcfc04405b6e0abd58"), 49, 450, 7008, true ),
        new FarmTaskConfig(24, langStringDefault("battlePass.seasons.july.4edd77ca1a7f3cd8e0d6643b8fa5d59a"), langStringDefault("battlePass.seasons.july.6233d57146e46838aaee1a7795d5be16"), 36, 450, 7028, false ),
        new FarmTaskConfig(25, langStringDefault("battlePass.seasons.july.679af96929fe769f4949dae82f92ed6a"), langStringDefault("battlePass.seasons.july.caa86e5bdf215bc5d5af27831e260e10"), 37, 450, 7010, true ),
        new FarmTaskConfig(26, langStringDefault("battlePass.seasons.july.b00fd79ed22de77956fff29e5dc94c81"), langStringDefault("battlePass.seasons.july.03ab1afe2f0fe88228cab62a2d4da305"), 35, 450, 7030, false ),
        new FarmTaskConfig(27, langStringDefault("battlePass.seasons.july.7dea55a7ccef69fccb5827d8ee1ac016"), langStringDefault("battlePass.seasons.july.405e83131b36c8260dc5d39e05d69799"), 40, 450, 9101, true ),
        new FarmTaskConfig(28, langStringDefault("battlePass.seasons.july.c8c77cfc0e4af60f8fc9028243e57818"), langStringDefault("battlePass.seasons.july.54ffc1b96f6ee53484038618e11d9392"), 40, 450, 9000, false ),
        new HuntTaskConfig(29, langStringDefault("battlePass.seasons.july.24583b71e1ac0628f88e7aee97c66786"), langStringDefault("battlePass.seasons.july.0d024468c8b2bf715fdb945b1f267e0d"), 2, 450, 832 ),
        new HuntTaskConfig(30, langStringDefault("battlePass.seasons.july.702425d79840c1907d5ae9f96c97fdae"), langStringDefault("battlePass.seasons.july.e578d160f4af9006e2f98480d235a8d7"), 4, 450, 833 ),
        new HuntTaskConfig(31, langStringDefault("battlePass.seasons.july.3907fedd5d113ffe7eac726290bc372c"), langStringDefault("battlePass.seasons.july.d32e253564670563e04daed5fac4644f"), 2, 450, 834 ),
        new HuntTaskConfig(32, langStringDefault("battlePass.seasons.july.24fbbd754226b1d9f1f594b8777c4e45"), langStringDefault("battlePass.seasons.july.e978c38cf43f99d1b34aa04a3bd720c8"), 3, 450, 835 ),
        new HuntTaskConfig(33, langStringDefault("battlePass.seasons.july.3ad464a6bfaf05aa84183a1c3804b79a"), langStringDefault("battlePass.seasons.july.d4b29462d8fea59a5ab7c87648396ccf"), 2, 450, 836 ),
        new FishingTaskConfig(34, langStringDefault("battlePass.seasons.july.7ab7cd558f79a554a87a80a717437861"), langStringDefault("battlePass.seasons.july.3676703883a3c01587cd38f8e6612844"), 18, 450, 9210 ),
        new FishingTaskConfig(35, langStringDefault("battlePass.seasons.july.1dcc7471f243d7da3aeebb762edc71ad"), langStringDefault("battlePass.seasons.july.d7434dc8c52b2f5e40842cc18d9d274a"), 5, 450, 9212 ),
        new FishingTaskConfig(36, langStringDefault("battlePass.seasons.july.8b9522dd3bde11484353742a8ce11191"), langStringDefault("battlePass.seasons.july.a591ca6fffdf69155fcc72262abd4811"), 18, 450, 9210 ),
        new FishingTaskConfig(37, langStringDefault("battlePass.seasons.july.c602b163c742b7fd1a523d6083c68746"), langStringDefault("battlePass.seasons.july.7faf0d3e4638a8e448c7c3b3196b2d18"), 5, 450, 9212 ),
        new JobTaskConfig(38, langStringDefault("battlePass.seasons.july.74260dcfbda8b57a6fcdf09de8e15923"), langStringDefault("battlePass.seasons.july.7564cce7c2241a63c98bd0037ba54a0d"), 10, 450, "trucker" ),
        new JobTaskConfig(39, langStringDefault("battlePass.seasons.july.78f335d3a16039fe19859658918559a8"), langStringDefault("battlePass.seasons.july.a4939006a82fb1f27966812688684b3b"), 10, 450, "firefighter" ),
        new JobTaskConfig(40, langStringDefault("battlePass.seasons.july.8edc7a2c139fe48f3846a3a3db2ab848"), langStringDefault("battlePass.seasons.july.8edc7a2c139fe48f3846a3a3db2ab848"), 40, 450, "garden" ),
        new JobTaskConfig(41, langStringDefault("battlePass.seasons.july.61ac5678f896327fdc298edb4dcd2c4c"), langStringDefault("battlePass.seasons.july.fc09f2f98413a4c5996a85ce37065432"), 50, 450, "cleaning" ),
        new JobTaskConfig(42, langStringDefault("battlePass.seasons.july.e65923eaecc7f70da23e564fee659642"), langStringDefault("battlePass.seasons.july.e65923eaecc7f70da23e564fee659642"), 40, 450, "builder" ),
    ],
    randomExp: {
        exp: 400,
        hour: 19,
        minute: 0
    }
}