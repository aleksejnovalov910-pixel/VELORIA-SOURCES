import { langStringDefault } from "../../lang/index";

import { ClothReward, CoinsReward, ExpReward, InventoryItemReward, LuckyWheelReward, MoneyReward, RewardRarity, VehicleReward, VipReward } from "../rewards";
import { IBattlePassSeason } from "../season";
import { FarmTaskConfig, FishingTaskConfig, HuntTaskConfig, JobTaskConfig } from "../tasks";

export const FEBRUARY_SEASON: IBattlePassSeason = {
    id: "february-season",
    name: langStringDefault("battlePass.seasons.february.e6609f42aca430c267aefc1c1070c156"),
    levelExp: 1001,
    everyDayExp: {
        time: 2,
        exp: 250
    },
    levelPrice: 500,
    endTime: 1651363200,
    battlePassCost: 4000,
    discount: {
        expires: 1644310831,
        specialPrice: 3000

    },
    rewards:[
        new LuckyWheelReward(langStringDefault("battlePass.seasons.february.8401b5253b1abe27e2338c3facb9e73c"), RewardRarity.COMMON, "fortune", false),
        new InventoryItemReward(langStringDefault("battlePass.seasons.february.aee2e6b237329e0737c7e0f8a15ced0c"), RewardRarity.RARE, "camo1",  false, 1604, 1),
        new CoinsReward(langStringDefault("battlePass.seasons.february.f3a7424270ef18f1905cfa29089517d3"), RewardRarity.COMMON, "coins1", false, 100),
        new VipReward(langStringDefault("battlePass.seasons.february.7a0327108223a92624d74c183ab63ef2"), RewardRarity.COMMON, "vipR0", false, "Ruby", 7),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 3),
        new ClothReward(langStringDefault("battlePass.seasons.february.8b2cb49b6115e096f4fe9076e14b06ac"), RewardRarity.RARE, "body6_m","body6_f", true, langStringDefault("battlePass.seasons.february.8b2cb49b6115e096f4fe9076e14b06ac"), langStringDefault("battlePass.seasons.february.ca2a9baf5b72f6baddd6f80e28d1edea"), langStringDefault("battlePass.seasons.february.6be673214ca4e853237f42ad9620b26d"), langStringDefault("battlePass.seasons.february.6be673214ca4e853237f42ad9620b26d")),
        new CoinsReward(langStringDefault("battlePass.seasons.february.0974ee3bf7ead747940f10d248cc7ccf"), RewardRarity.COMMON, "coins1", false, 100),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.february.6344b52d3703d6cf8f7db4af347f1a1f"), RewardRarity.COMMON, "fortune", false),
        new InventoryItemReward(langStringDefault("battlePass.seasons.february.c890ca0484980c6b6e252eb61ac2ca3d"), RewardRarity.RARE, "camo1",  false, 1604, 1),
        new VipReward(langStringDefault("battlePass.seasons.february.41ff366f2fb1c670134dede606445080"), RewardRarity.COMMON, "vipD0", false, "Diamond", 3),
        new MoneyReward(langStringDefault("battlePass.seasons.february.5b95d162e1fca71b76743c62798f70ad"), RewardRarity.COMMON, "money1", false, 25000),
        new ClothReward(langStringDefault("battlePass.seasons.february.9bd3713efd979e799ce4ce2d0c396581"), RewardRarity.LEGENDARY, "pants6_m","pants6_f", true, langStringDefault("battlePass.seasons.february.af031548ec005592ec708a97454469d9"), langStringDefault("battlePass.seasons.february.f22dca2ba6da003c763d683cfc74170b"), langStringDefault("battlePass.seasons.february.8db1b9b1db30b9782b5610cec4b77044"), langStringDefault("battlePass.seasons.february.ed4b441adf5cf6b26b2a460fc6739b3a")),
        new CoinsReward(langStringDefault("battlePass.seasons.february.e6fc93e33945f0f64bd9ec8ab47cdbc4"), RewardRarity.COMMON, "coins1", false, 100),
        new MoneyReward(langStringDefault("battlePass.seasons.february.1c28ad15769adddd1ecfda5080a01c9b"), RewardRarity.COMMON, "money1", false, 30000),
        new VipReward(langStringDefault("battlePass.seasons.february.02dd1217a028567d814c77888db91f8f"), RewardRarity.COMMON, "vipS0", false, "Sapfire", 7),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.february.38733921005e911f3b41875f8dc45cd5"), RewardRarity.COMMON, "fortune", false),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 3),
        new ClothReward(langStringDefault("battlePass.seasons.february.f4d32b659114eb986d2860c9fe4de7ce"), RewardRarity.LEGENDARY, "head1_m","head1_f", false, langStringDefault("battlePass.seasons.february.903dff3b6fb5dd014cfb7fe8f0d1941a"), langStringDefault("battlePass.seasons.february.f2270ff1e5a7e6182a8e6e99b495f83d"), langStringDefault("battlePass.seasons.february.3b49c169c514fa60cadf40946f9e76b0"), langStringDefault("battlePass.seasons.february.e29db5254a877087ce8acc0421412ecb")),
        new CoinsReward(langStringDefault("battlePass.seasons.february.15bba1022a6c96d90ec2ee40768ee932"), RewardRarity.COMMON, "coins1", false, 100),
        new VipReward(langStringDefault("battlePass.seasons.february.a12dc79188606b47a8cc2bb35239f3c2"), RewardRarity.COMMON, "vipD1", false, "Diamond", 7),
         new MoneyReward(langStringDefault("battlePass.seasons.february.acb17468721ea900103f2cab135ff39a"), RewardRarity.COMMON, "money1", false, 30000),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 6),
        new MoneyReward(langStringDefault("battlePass.seasons.february.936f6049e40da398ab2728849ba8558c"), RewardRarity.COMMON, "money1", false, 30000),
        new ClothReward(langStringDefault("battlePass.seasons.february.8b23bd7889e65eb21e0056dc27dc5ff3"), RewardRarity.RARE, "mask17_m","mask17_f", false, langStringDefault("battlePass.seasons.february.2cd7e2372e6f0205039a72875482f34d"), langStringDefault("battlePass.seasons.february.974b7b888ccf8378f7111050930096a5"), langStringDefault("battlePass.seasons.february.e0fea934352d3d87805f0fe584ae6655"), langStringDefault("battlePass.seasons.february.c0f1685c98c1f299d847febb0a97dbe3"),),
        new CoinsReward(langStringDefault("battlePass.seasons.february.dd5af4a395e3db50c630ac7baeba2e8f"), RewardRarity.COMMON, "coins1", false, 100),
        new VipReward(langStringDefault("battlePass.seasons.february.9ec577f0b4af757d009d34e7727a655d"), RewardRarity.COMMON, "vipS0", false, "Sapfire", 5),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 6),
        new MoneyReward(langStringDefault("battlePass.seasons.february.a1aabf32b21fc8c7bc6474da8a6bd047"), RewardRarity.COMMON, "money0", false, 15000),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.february.9c17fdee991963d17e8fe233e7bc6228"), RewardRarity.COMMON, "fortune", false),
        new ClothReward(langStringDefault("battlePass.seasons.february.ddad2def28b9d58b8ce149f6f985eae8"), RewardRarity.LEGENDARY, "pants0_m","pants3_f", false, langStringDefault("battlePass.seasons.february.4b3dbebbab45031eefd2f4e92e20c1e5"), langStringDefault("battlePass.seasons.february.d42b60343f7441472f835576bfeb9e6b"),langStringDefault("battlePass.seasons.february.877bf9cbcdc14501524953d9b39e9b7c"),langStringDefault("battlePass.seasons.february.e50ef92e3fe5e255e62c0e22d76dea6f")),
        new VipReward(langStringDefault("battlePass.seasons.february.d7e6bfe756847911b411c2f71bdc13f5"), RewardRarity.COMMON, "vipS0", false, "Sapfire", 5),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 6),
        new CoinsReward(langStringDefault("battlePass.seasons.february.4fa58fc63b8123507496bb2bf6f20c7c"), RewardRarity.COMMON, "coins1", false, 100),
        new MoneyReward(langStringDefault("battlePass.seasons.february.0578fe96b2ae74374d2c5e655b525091"), RewardRarity.COMMON, "money0", false, 17000),
        new InventoryItemReward(langStringDefault("battlePass.seasons.february.f970f948f6f8fc13475712bb595bc346"), RewardRarity.RARE, "camo1",  false, 1604, 1),
        new ClothReward(langStringDefault("battlePass.seasons.february.cda22c5d9f586d27e5423161bc3d129a"), RewardRarity.LEGENDARY, "head0_m","head0_f", false, langStringDefault("battlePass.seasons.february.afc3839735de1aab53ac0edde31178c5"), langStringDefault("battlePass.seasons.february.81e39164b99d8ed621576f7ea18cd9ba"),langStringDefault("battlePass.seasons.february.a6c2a440f0edd521301144b1948cfea7"),langStringDefault("battlePass.seasons.february.a6c2a440f0edd521301144b1948cfea7")),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 3),
        new CoinsReward(langStringDefault("battlePass.seasons.february.63faeb92f12d4078bda86b6f8caf356a"), RewardRarity.COMMON, "coins1", false, 50),
        new CoinsReward(langStringDefault("battlePass.seasons.february.1d676c962de49d494c58a13c9fba67cc"), RewardRarity.COMMON, "coins1", false, 50),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.february.d03645a5735755c870e25d38ae26173d"), RewardRarity.COMMON, "fortune", false),
        new MoneyReward(langStringDefault("battlePass.seasons.february.b845da73d217d44e82b43f1730dfb7ae"), RewardRarity.COMMON, "money0", false, 10000),
        new InventoryItemReward(langStringDefault("battlePass.seasons.february.9e1f1097b64962c787b5b8082701b4e3"), RewardRarity.LEGENDARY, "backpack1",  true, 2142, 1),
        new VipReward(langStringDefault("battlePass.seasons.february.d9afb628d5732253c0cf62a181f092c6"), RewardRarity.COMMON, "vipS0", false, "Sapfire", 3),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 3),
        new ClothReward(langStringDefault("battlePass.seasons.february.049810d09df7088c5c467cdde4339968"), RewardRarity.LEGENDARY, "body10_m","body10_f", false, langStringDefault("battlePass.seasons.february.d20b5dd581ec7045ccd26847ac9edd94"), langStringDefault("battlePass.seasons.february.63cb2a889345492372f71ed497e3f063"),langStringDefault("battlePass.seasons.february.1ec66c35e84a72d7a841690251b31f35"),langStringDefault("battlePass.seasons.february.1ec66c35e84a72d7a841690251b31f35")),
        new VipReward(langStringDefault("battlePass.seasons.february.eeb04ffc573ce44c65af33fcce54e7c1"), RewardRarity.COMMON, "vipD1", false, "Diamond", 3),
        new MoneyReward(langStringDefault("battlePass.seasons.february.f51b2e84006f823c72c2a11fd6f58884"), RewardRarity.COMMON, "money0", false, 10000),
        new ClothReward(langStringDefault("battlePass.seasons.february.e98d844333d9fcf66917441c8c1dc344"), RewardRarity.LEGENDARY, "sneakers6_m","sneakers6_f", false, langStringDefault("battlePass.seasons.february.49d140d0088a625f41401befb5c147cc"), langStringDefault("battlePass.seasons.february.d8724f6af5ed4f726ce8e1ada573439d"),langStringDefault("battlePass.seasons.february.c1fa42210c5bef79880b8604558fc545"),langStringDefault("battlePass.seasons.february.c1fa42210c5bef79880b8604558fc545")),



        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 3),
        new CoinsReward(langStringDefault("battlePass.seasons.february.ee7bdef5dfaafc020cfa4a3008f5091d"), RewardRarity.COMMON, "coins0", false, 50),
        new CoinsReward(langStringDefault("battlePass.seasons.february.e903d3265a1ac00a6578423b4c75c301"), RewardRarity.COMMON, "coins0", false, 50),
        new MoneyReward(langStringDefault("battlePass.seasons.february.66493042b141879767dfe475f3c6fea1"), RewardRarity.COMMON, "money0", false, 10000),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.february.c30d75405cb115420d3f7140dedec57f"), RewardRarity.COMMON, "fortune", false),
        new ClothReward(langStringDefault("battlePass.seasons.february.be67a677f229978d2e3754b914506243"), RewardRarity.LEGENDARY, "mask20_m","mask20_f", false, langStringDefault("battlePass.seasons.february.8b899e14f5e64fe768dc07a10df99580"), langStringDefault("battlePass.seasons.february.e2adf7630aa1c63473085212992007e9"),langStringDefault("battlePass.seasons.february.417a2cf2feffb0972b58a27ef2e03224"),langStringDefault("battlePass.seasons.february.417a2cf2feffb0972b58a27ef2e03224")),



        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 6),
        new CoinsReward(langStringDefault("battlePass.seasons.february.d1eb07027536111aada2fb696e5ea2f1"), RewardRarity.COMMON, "coins0", false, 50),
        new MoneyReward(langStringDefault("battlePass.seasons.february.c2062b86f930ff44fdc0df2dd9e62b3d"), RewardRarity.COMMON, "money0", false, 10000),
        new MoneyReward(langStringDefault("battlePass.seasons.february.5d4d33f1c50ab85e5fc83afcb3871d5e"), RewardRarity.COMMON, "money0", false, 10000),
        new CoinsReward(langStringDefault("battlePass.seasons.february.1345569bb072223ff6ecb4ed7d7e3484"), RewardRarity.COMMON, "coins0", false, 50),
        new ClothReward(langStringDefault("battlePass.seasons.february.66cde49733a6b99e865554bb6739e53c"), RewardRarity.RARE, "head5_m","head5_f", false, langStringDefault("battlePass.seasons.february.eedf581311d791c8da79ba63dfb25749"), langStringDefault("battlePass.seasons.february.edba5de106b5ae074d4cba24ca2b2617"), langStringDefault("battlePass.seasons.february.97c0e2631974bb65da6666addbfaf7c8"), langStringDefault("battlePass.seasons.february.d75f4825f428c3da08c04be9fce6a54a")),


        new VipReward(langStringDefault("battlePass.seasons.february.4a921bc2598e7efa2154bdc4d66882f5"), RewardRarity.COMMON, "vipR0", false, "Ruby", 7),
        new CoinsReward(langStringDefault("battlePass.seasons.february.ca597ee150e0b7de2b1cd11c88a6c35d"), RewardRarity.COMMON, "coins0", false, 50),
        new VipReward(langStringDefault("battlePass.seasons.february.0f8297b92166516dab8ebc3fa4d19bbf"), RewardRarity.COMMON, "vipR0", false, "Ruby", 7),
        new MoneyReward(langStringDefault("battlePass.seasons.february.ba2e87f0e5f3595270b7f1eac988f57f"), RewardRarity.COMMON, "money0", false, 10000),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.february.8d2e59393eb5e5fe626ff46c01bf2e22"), RewardRarity.COMMON, "fortune", false),
        new ClothReward(langStringDefault("battlePass.seasons.february.4a209ad3d60f3be05f7c2ed1a0733d2e"), RewardRarity.RARE, "head2_m","head2_f", false, langStringDefault("battlePass.seasons.february.28c19f049f2815088e3be45826edf119"), langStringDefault("battlePass.seasons.february.fc15798bb5a32b6534b253273879c415"),langStringDefault("battlePass.seasons.february.1874ef38131b9535e72cce5ba96feba8"), langStringDefault("battlePass.seasons.february.1874ef38131b9535e72cce5ba96feba8")),


        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 6),
        new CoinsReward(langStringDefault("battlePass.seasons.february.77215a0438dbe3f36dac1e170167bfde"), RewardRarity.COMMON, "coins0", false, 50),
        new InventoryItemReward(langStringDefault("battlePass.seasons.february.8f9caad4f89a5c0d923deaeb04be4ae7"), RewardRarity.RARE, "fire1",  false, 868, 3),
        new MoneyReward(langStringDefault("battlePass.seasons.february.d7b498b284f0db55cb06cd1f792db194"), RewardRarity.COMMON, "money0", false, 11000),
        new InventoryItemReward(langStringDefault("battlePass.seasons.february.3d9cebad0778331cf64e4feecc550321"), RewardRarity.RARE, "fire1",  false, 868, 3),
        new ClothReward(langStringDefault("battlePass.seasons.february.b2314997152efbf9cac6a619e24fceb6"), RewardRarity.RARE, "sneakers5_m","sneakers5_f", false, langStringDefault("battlePass.seasons.february.3c5b37f243001541b5d671cea9f4d33b"), langStringDefault("battlePass.seasons.february.cefd78a739b7bfaec6563ab5fde9f2a7"), langStringDefault("battlePass.seasons.february.5b5498c3da029ae234833f6539e0cddb"), langStringDefault("battlePass.seasons.february.8df70a55134ea89e921e90ec7331db18")),



        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 5),
        new MoneyReward(langStringDefault("battlePass.seasons.february.2f6512c747ebf339453f92bfd76f2bcc"), RewardRarity.COMMON, "money0", false, 11000),
        new MoneyReward(langStringDefault("battlePass.seasons.february.00ef8c56cc9966225bdc48b671d87b87"), RewardRarity.COMMON, "money0", false, 11000),
        new CoinsReward(langStringDefault("battlePass.seasons.february.e89964fa4841e35e8bd627a57a690ddf"), RewardRarity.COMMON, "coins0", false, 50),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.february.71645e5554dd40173d548bbf244b8856"), RewardRarity.COMMON, "fortune", false),
        new ClothReward(langStringDefault("battlePass.seasons.february.34facc536e1a0ff5c59d91521d86ab95"), RewardRarity.RARE, "parrot_m","parrot_f", false, langStringDefault("battlePass.seasons.february.53a9a388104aa60ff8d00c68906533a8"), langStringDefault("battlePass.seasons.february.e8e350beebd6b55cb54583db0d5ce190"), langStringDefault("battlePass.seasons.february.3229e55b54d77252c4f186523a69b053"), langStringDefault("battlePass.seasons.february.3229e55b54d77252c4f186523a69b053")),





        new InventoryItemReward(langStringDefault("battlePass.seasons.february.b71444670dce00303314efe5f70f9a5d"), RewardRarity.RARE, "z1",  false, 10003, 2),
        new CoinsReward(langStringDefault("battlePass.seasons.february.0649f714a6ba3d0c06c504d52b0304c5"), RewardRarity.COMMON, "coins0", false, 50),
        new InventoryItemReward(langStringDefault("battlePass.seasons.february.023c0e7dcffb54b7b8c397109c40a8af"), RewardRarity.RARE, "z2",  false, 10009, 3),
        new InventoryItemReward(langStringDefault("battlePass.seasons.february.77f008fbd6c3f85628ed9489a8ec16e9"), RewardRarity.RARE, "z2",  false, 10009, 3),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 6),
        new ClothReward(langStringDefault("battlePass.seasons.february.5fba5adbcff6b4cad24e14df924734c7"), RewardRarity.RARE, "head5_m","head5_f", false, langStringDefault("battlePass.seasons.february.e537217d5707c446a3ea77f8da453d62"), langStringDefault("battlePass.seasons.february.e74b33a9a5e17979556a3745613b24e4"), langStringDefault("battlePass.seasons.february.321bdacc050bbbba756564666c464fb1"), langStringDefault("battlePass.seasons.february.e9a180d3df025d05b039f58438283bfb")),






        new VipReward(langStringDefault("battlePass.seasons.february.273003fcaecd06c3612d2a4a1d33ce3d"), RewardRarity.COMMON, "vipD0", false, "Diamond", 7),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 12),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 12),
        new CoinsReward(langStringDefault("battlePass.seasons.february.a995800c4965e0f7c7b76a9b75ac35a6"), RewardRarity.COMMON, "coins0", false, 100),
        new LuckyWheelReward(langStringDefault("battlePass.seasons.february.cc43b05326408632ff671b54b84070f2"), RewardRarity.COMMON, "fortune", false),
        new ClothReward(langStringDefault("battlePass.seasons.february.970b62ad050a54b27f14b70acc9c52e3"), RewardRarity.LEGENDARY, "mask18_m","mask18_f", false, langStringDefault("battlePass.seasons.february.d9bd450c4831d7c021b86332054a20a4"), langStringDefault("battlePass.seasons.february.dd9debc017da9dcdca071d5d119cd821") ,langStringDefault("battlePass.seasons.february.4f6cea361b9077dd6618363a0fb13de2"),langStringDefault("battlePass.seasons.february.fdd23da0e1f11e10c270d50645a248ea")),





        new MoneyReward(langStringDefault("battlePass.seasons.february.eff17fb148a823c4d9d408f372693055"), RewardRarity.RARE, "money2", false, 20000),
        new MoneyReward(langStringDefault("battlePass.seasons.february.9647ea565f7a5feaf3412f15a28536ef"), RewardRarity.RARE, "money2", false, 20000),
        new ExpReward("Exp", RewardRarity.COMMON, "exp", false, 3),
        new VipReward(langStringDefault("battlePass.seasons.february.7514c7d3644ed68b8d1e003158b09c7e"), RewardRarity.COMMON, "vipR0", false, "Ruby", 7),
        new VipReward(langStringDefault("battlePass.seasons.february.f6246f7598054b98bc0b161e09fe3d61"), RewardRarity.COMMON, "vipR1", false, "Diamond", 7),
        new ClothReward(langStringDefault("battlePass.seasons.february.5314df778134dc06cf8811e063758894"), RewardRarity.LEGENDARY, "pants7_m","pants7_f", false, langStringDefault("battlePass.seasons.february.5314df778134dc06cf8811e063758894"), langStringDefault("battlePass.seasons.february.88ab21d2852fe71318842efbd4b2cf97"),langStringDefault("battlePass.seasons.february.919aa3cfe1780fb45aeb26e9bcc1a078"),langStringDefault("battlePass.seasons.february.919aa3cfe1780fb45aeb26e9bcc1a078")),



        new MoneyReward(langStringDefault("battlePass.seasons.february.1c9897c0f8d4999accbbdd7316b82b17"), RewardRarity.RARE, "money3", false, 50000),
        new MoneyReward(langStringDefault("battlePass.seasons.february.c1051a57a1852c290d0eb526b38480d6"), RewardRarity.RARE, "money3", false, 50000),
        new ClothReward(langStringDefault("battlePass.seasons.february.2934b027d37c64866406c0a70e4ec9b8"), RewardRarity.LEGENDARY, "body8_m","body8_f", true, langStringDefault("battlePass.seasons.february.2934b027d37c64866406c0a70e4ec9b8"), langStringDefault("battlePass.seasons.february.2e6e873a4a9879cb8f2b48a8a294b82d"),langStringDefault("battlePass.seasons.february.51f8ef5203451b1eef896efee506f259"),langStringDefault("battlePass.seasons.february.d4f8aa3ecdd6f7ce2704db8040107ece")),
        new VehicleReward("Panamera",RewardRarity.LEGENDARY, "Panamera", true, "rmodbacalar" )
        
    ],
    globalTasks:[
        new JobTaskConfig(-1, langStringDefault("battlePass.seasons.february.766d84efc3fd7ba116ea459527129fc3"), langStringDefault("battlePass.seasons.february.2c13fd620eb6134c3a25805fdefaf366"), 2000, 1700, "electric" ),
        new JobTaskConfig(-1, langStringDefault("battlePass.seasons.february.7084830cc013ec74fa976d2e3976fa17"), langStringDefault("battlePass.seasons.february.089353cd0f8f47bae767a1cac983a64d"), 700, 1700, "bus" ),
        new FishingTaskConfig(-1, langStringDefault("battlePass.seasons.february.41fcbdebb3657504951267de347492a1"), langStringDefault("battlePass.seasons.february.f1894874464f404e3427fd3799660d43"), 150, 1700, 9210 ),
        new HuntTaskConfig(-1, langStringDefault("battlePass.seasons.february.3ad676cdf0301b16065aac623ab1dd45"), langStringDefault("battlePass.seasons.february.10236dab326407db6c64638a89f62f01"), 80, 1700, 830 ),
        new FarmTaskConfig(-1, langStringDefault("battlePass.seasons.february.888a2a14508e2fa6d9fecf78f39b6b63"), langStringDefault("battlePass.seasons.february.e5c4ce1b56439c795f2bfbcb4a596a9c"), 2000, 1700, 7000, true ),
        new JobTaskConfig(-1, langStringDefault("battlePass.seasons.february.46645b1b029d819fb3f0c641d4313f71"), langStringDefault("battlePass.seasons.february.831220af93a66f4af4b9ee7b74ec3dc8"), 500, 1700, "collector" ),
        new JobTaskConfig(-1, langStringDefault("battlePass.seasons.february.6e670b6976ecbb3a349f88754b7a3c44"), langStringDefault("battlePass.seasons.february.dcf214bbdee7492242f37a760f7108d0"), 1200, 1700, "apartmentRepair" ),
        new JobTaskConfig(-1, langStringDefault("battlePass.seasons.february.6a9244d928a879c976e1113d89bb10d4"), langStringDefault("battlePass.seasons.february.c8529d0f8513fe16e57c6381917fb1d6"), 100, 1700, "diving" ),
        new FarmTaskConfig(-1, langStringDefault("battlePass.seasons.february.9d06e129662b5a343c27c59cb05805cb"), langStringDefault("battlePass.seasons.february.f3cf0dbf2923aa658d9fea7fcac305c2"), 2000, 1700, 7021, false ),
        new HuntTaskConfig(-1, langStringDefault("battlePass.seasons.february.9a18f8d5e3cbf47570fee4124507fc9e"), langStringDefault("battlePass.seasons.february.fb71db65857ee9783f72c7073f306aab"), 80, 1700, 831 ),
    ],
    basicTasks:[
        new JobTaskConfig(0, langStringDefault("battlePass.seasons.february.d29233bffb4c47426865a2a29236413c"), langStringDefault("battlePass.seasons.february.0bc17d3093d1e7630c999ee934b18817"), 60, 450, "electric" ),
        new JobTaskConfig(1, langStringDefault("battlePass.seasons.february.548eb2088b8915a62d7c6bdb86c1ad25"), langStringDefault("battlePass.seasons.february.e713be683dd665415b3a0e64bfbf02bc"), 30, 450, "bus" ),
        new FishingTaskConfig(2, langStringDefault("battlePass.seasons.february.1079bb0c4902af9f1b935e91fc502f3e"), langStringDefault("battlePass.seasons.february.bbebb721e24b3a5149227145d00573e3"), 18, 450, 9210 ),
        new HuntTaskConfig(3, langStringDefault("battlePass.seasons.february.49156610ed40545d6882549415b8d8ee"), langStringDefault("battlePass.seasons.february.aa62486ad9991f5e56ec260368a110d4"), 5, 450, 830 ),
        new FarmTaskConfig(4, langStringDefault("battlePass.seasons.february.f3d6586de4656eff7ab489a024e77cca"), langStringDefault("battlePass.seasons.february.1e7647f8143723d261e8080131b31204"), 40, 450, 7000, true ),
        new JobTaskConfig(5, langStringDefault("battlePass.seasons.february.2926a1a5d01da58b50097e9877b39e53"), langStringDefault("battlePass.seasons.february.0afb587b549c34ff61f21ea3505d4f0b"), 10, 450, "taxi" ),
        new JobTaskConfig(6, langStringDefault("battlePass.seasons.february.98800c59c3eb1eb9a8a0c9d5c34cc631"), langStringDefault("battlePass.seasons.february.c22884db91bc3ad8ce139a6a687b5e55"), 15, 450, "collector" ),
        new JobTaskConfig(7, langStringDefault("battlePass.seasons.february.98ff6cec3349940710d8c062eae04cd0"), langStringDefault("battlePass.seasons.february.d5e89499445c8c5e7d81a3d348590201"), 40, 450, "apartmentRepair" ),
        new JobTaskConfig(8, langStringDefault("battlePass.seasons.february.d8f4dd389205a743e42d4e78f960030c"), langStringDefault("battlePass.seasons.february.cbb9f3edf1002b6908abd4f2f73522bc"), 5, 450, "diving" ),
        new FarmTaskConfig(9, langStringDefault("battlePass.seasons.february.164fd8ebeebf3b80f2d5f16451001def"), langStringDefault("battlePass.seasons.february.817956b076442d9bd5600128d56484f8"), 45, 450, 7001, true ),
        new FarmTaskConfig(10, langStringDefault("battlePass.seasons.february.a8b00eaa5e1aa09180d236a7bc4eb130"), langStringDefault("battlePass.seasons.february.314664b6c1c55dee621d364a1bb66676"), 30, 450, 7021, false ),
        new HuntTaskConfig(11, langStringDefault("battlePass.seasons.february.2a5c27e4b7cc006e466bb24c317dba60"), langStringDefault("battlePass.seasons.february.4c1091a83c1c3b1af6c70a4d5b075f20"), 2, 450, 831 ),
        new FarmTaskConfig(12, langStringDefault("battlePass.seasons.february.56936644dcf04570d86ab4113b692c0d"), langStringDefault("battlePass.seasons.february.b901282377ffce55f616eebcc7fc5b53"), 90, 450, 7002, true ),
        new FarmTaskConfig(12, langStringDefault("battlePass.seasons.february.869ba040562d51d2a7bc6de0cdd45865"), langStringDefault("battlePass.seasons.february.489f1f32ce822c6f94c0fc0fb09f3855"), 80, 450, 7022, false ),
        new FarmTaskConfig(13, langStringDefault("battlePass.seasons.february.335a7f6950db452ecbc56f105095af24"), langStringDefault("battlePass.seasons.february.82861880e19fb074715c6eabce8b8285"), 60, 450, 7003, true ),
        new FarmTaskConfig(14, langStringDefault("battlePass.seasons.february.f206fa3e984dd5275615598a65c43945"), langStringDefault("battlePass.seasons.february.83ed642112b90b209b796e5d1cfb2a04"), 32, 450, 7023, false ),
        new FarmTaskConfig(15, langStringDefault("battlePass.seasons.february.7af87a182806cde2dcd2b2e07047908a"), langStringDefault("battlePass.seasons.february.43404bd907af8b42cd42dd85d9d3b9b8"), 43, 450, 7004, true ),
        new FarmTaskConfig(16, langStringDefault("battlePass.seasons.february.85acf553749655deab00cb66cacbec5d"), langStringDefault("battlePass.seasons.february.df84e1d8ee2ced7c562d55f8ed50d969"), 54, 450, 7024, false ),
        new FarmTaskConfig(17, langStringDefault("battlePass.seasons.february.95a8de4c668db11c02d6e3467562914d"), langStringDefault("battlePass.seasons.february.a9c43dad1a882f91dc5290181e9fc958"), 58, 450, 7005, true ),
        new FarmTaskConfig(18, langStringDefault("battlePass.seasons.february.a9e434a9f44711eb4811b62041013e4b"), langStringDefault("battlePass.seasons.february.68b3014f64e466795ecd21e3fee0aab5"), 56, 450, 7025, false ),
        new FarmTaskConfig(19, langStringDefault("battlePass.seasons.february.75f261c39a2f7f49cd04289fe900781e"), langStringDefault("battlePass.seasons.february.015a51c9f22a6b0ac1caea2ff2c274b1"), 55, 450, 7006, true ),
        new FarmTaskConfig(20, langStringDefault("battlePass.seasons.february.9e4b4effa20b24b5b8fad79b53c780ad"), langStringDefault("battlePass.seasons.february.934ed2432ea127a1f7eeccc8cfc78a47"), 50, 450, 7026, false ),
        new FarmTaskConfig(21, langStringDefault("battlePass.seasons.february.423f57958a4514b5202911b7f176ac9c"), langStringDefault("battlePass.seasons.february.13778c81b16457408f6a0785f43880a3"), 70, 450, 7007, true ),
        new FarmTaskConfig(22, langStringDefault("battlePass.seasons.february.16a8cf16442ef668849952db23530ff6"), langStringDefault("battlePass.seasons.february.51973c6b77cb4d631fdd36479025051c"), 45, 450, 7027, false ),
        new FarmTaskConfig(23, langStringDefault("battlePass.seasons.february.6d57516fcf0f860e8c4b2b60a6efe81f"), langStringDefault("battlePass.seasons.february.4d9c879c58ef065b214961061fd4efb1"), 49, 450, 7008, true ),
        new FarmTaskConfig(24, langStringDefault("battlePass.seasons.february.2708de19f35f4b9f3f7a1b012d95082d"), langStringDefault("battlePass.seasons.february.f65e8e29ae4dd1772c67fef1015d5be1"), 36, 450, 7028, false ),
        new FarmTaskConfig(25, langStringDefault("battlePass.seasons.february.1893f29d9e1a0b66504dc315ca14743b"), langStringDefault("battlePass.seasons.february.8da0c8d4132a50a36984d2b9ec6b7a54"), 37, 450, 7010, true ),
        new FarmTaskConfig(26, langStringDefault("battlePass.seasons.february.b1bca06d1a4ffebf4ee5f11d9b7fe2f1"), langStringDefault("battlePass.seasons.february.adc4b3fe08523088cec6bf53ff9c44e8"), 35, 450, 7030, false ),
        new FarmTaskConfig(27, langStringDefault("battlePass.seasons.february.11975bd45a5696a659b4057cb4c76aa8"), langStringDefault("battlePass.seasons.february.4cf1c685c4d8155dcde28e7f9225d7df"), 40, 450, 9101, true ),
        new FarmTaskConfig(28, langStringDefault("battlePass.seasons.february.d06702e764c51174ee0b1744267b7acd"), langStringDefault("battlePass.seasons.february.b60cb0ff38cdfd1167f5f8587c0b6ccd"), 40, 450, 9000, false ),
        new HuntTaskConfig(29, langStringDefault("battlePass.seasons.february.bb528b494956049d3dccb488a4f4e8f8"), langStringDefault("battlePass.seasons.february.7051be7e315b45bbb7edfd3e6eec89b6"), 2, 450, 832 ),
        new HuntTaskConfig(30, langStringDefault("battlePass.seasons.february.c73af49469ca9bdf5b95222f3559de94"), langStringDefault("battlePass.seasons.february.f8d54ea9f400437e0e2b6da568294367"), 4, 450, 833 ),
        new HuntTaskConfig(31, langStringDefault("battlePass.seasons.february.5dd767fc0c42cbbcd3e99575f9fd0fc7"), langStringDefault("battlePass.seasons.february.ae0459dfebdcfb9d2efce1c73db392fc"), 2, 450, 834 ),
        new HuntTaskConfig(32, langStringDefault("battlePass.seasons.february.8d8b197718d29ac9a34dfab8065fbc4f"), langStringDefault("battlePass.seasons.february.6ad61d8de03de89e830a0e82dca70831"), 3, 450, 835 ),
        new HuntTaskConfig(33, langStringDefault("battlePass.seasons.february.3b75296ae219f1ee4755b7462a3facf2"), langStringDefault("battlePass.seasons.february.f1d3b9fab9c4029fb08ad8560387c247"), 2, 450, 836 ),
        new FishingTaskConfig(34, langStringDefault("battlePass.seasons.february.95222dbbaa6eca48ca69285f9f6887a9"), langStringDefault("battlePass.seasons.february.633b8a01864bf1f77ce89ba82c8b0417"), 18, 450, 9210 ),
        new FishingTaskConfig(35, langStringDefault("battlePass.seasons.february.f0803ef21a81e9bcb5ae81e6cd623a1d"), langStringDefault("battlePass.seasons.february.b092d0cdbcc64d37b583b8f05c257f1e"), 5, 450, 9212 ),
        new FishingTaskConfig(36, langStringDefault("battlePass.seasons.february.fd91a5b8f02dc9143f9ecad522a2db29"), langStringDefault("battlePass.seasons.february.56d761be6953ce8cf7d73d067ecd8f5f"), 18, 450, 9210 ),
        new FishingTaskConfig(37, langStringDefault("battlePass.seasons.february.7ca77ce74698de3bace671ebe420b11d"), langStringDefault("battlePass.seasons.february.7225c426f9a6c0b6cba764d1ba70c8fd"), 5, 450, 9212 ),
        new JobTaskConfig(38, langStringDefault("battlePass.seasons.february.da8581f8bf2e3c107cda19509c3df05e"), langStringDefault("battlePass.seasons.february.4917b47aaeb2a45c791e1601938c2b98"), 10, 450, "trucker" ),
        new JobTaskConfig(39, langStringDefault("battlePass.seasons.february.b27c32fdc4f881cfd6bffac80e970803"), langStringDefault("battlePass.seasons.february.5ebe3cffc794bb3827015ceb7fad7630"), 10, 450, "firefighter" ),
        new JobTaskConfig(40, langStringDefault("battlePass.seasons.february.f5f4dfaa25ee2061703d399175e0b855"), langStringDefault("battlePass.seasons.february.f5f4dfaa25ee2061703d399175e0b855"), 40, 450, "garden" ),
        new JobTaskConfig(41, langStringDefault("battlePass.seasons.february.b6c39b41f608410d3c50a348a374826e"), langStringDefault("battlePass.seasons.february.ecbef6f4d937f1c546004345c5163dc1"), 50, 450, "cleaning" ),
        new JobTaskConfig(42, langStringDefault("battlePass.seasons.february.10412df80e21299e61f947ff416baab3"), langStringDefault("battlePass.seasons.february.10412df80e21299e61f947ff416baab3"), 40, 450, "builder" ),
    ],
    randomExp: {
        exp: 400,
        hour: 19,
        minute: 0
    }       
}