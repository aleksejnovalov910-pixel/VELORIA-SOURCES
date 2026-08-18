import { langStringDefault } from "../../lang/index";
import {DropSellType, RouletteType} from "./enums";
import {Rarity} from "./rarity";
import {VipDropData} from "./Drops/vipDrop";
import {DropDataBase} from "./Drops/dropBase";
import {RealDropData} from "./Drops/realDrop";
import {VehicleDropData} from "./Drops/vehicleDrop";
import {InventoryDropData} from "./Drops/inventoryDrop";
import {MoneyDropData} from "./Drops/moneyDrop";
import {XpDropData} from "./Drops/xpDrop";
import {CoinsDropData} from "./Drops/coinsDrop";
import {DressDropData} from "./Drops/dressDrop";
import {ArmorDropData} from "./Drops/armorDrop";

export const SPIN_COSTS: {[key: string]: number} = {
    "standart": 100,
    "premium": 135,
    "luxe": 220,
}

export enum RarityType {
    LEGENDARY,// Золотой
    SPECIAL,// Красный
    UNIQUE,// Розовый
    RARE,// Фиолетовый
    COMMON,// Голубой
    CASINO// Колесо в казино
}

// Основной конфиг дропов в рулетке
export const drops: DropDataBase[] = [
    //Geld 200
    new MoneyDropData(0, 0,25000, langStringDefault("donate.donate-roulette.main.08513f8b6c46e88bb00326184a76e5d0"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 25000),
    new MoneyDropData(11, 33, 18000, langStringDefault("donate.donate-roulette.main.73fc8b20e01aec961cb483b6ebd13096"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 18000),
    new MoneyDropData(34, 32, 18000, langStringDefault("donate.donate-roulette.main.5dc90216cd2c1fd7b687494a9c823276"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 18000),
    new MoneyDropData(36, 32, 18000, langStringDefault("donate.donate-roulette.main.bec21ba02036cc9f68ed8c8c7e24416c"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 18000),
    new MoneyDropData(45, 32, 25000, langStringDefault("donate.donate-roulette.main.fc08f4b730fce325e46ca01a62c9ce19"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 25000),
    new MoneyDropData(46, 32, 18000, langStringDefault("donate.donate-roulette.main.7ff1cb989590ec1398c5f9ffd6fc141d"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 18000),
    new MoneyDropData(47, 32, 18000, langStringDefault("donate.donate-roulette.main.f9348d163d6730dfc470f34cdbd822c5"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 18000),
    new MoneyDropData(48, 32, 18000, langStringDefault("donate.donate-roulette.main.0d77680960db6403da1e19ba69c3f731"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 18000),
    new MoneyDropData(10000, 32, 15000, langStringDefault("donate.donate-roulette.main.a8c252763fa9c264244268218441c404"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 15000),
    new MoneyDropData(10001, 32, 15000, langStringDefault("donate.donate-roulette.main.6b80ed05fffb5fffb3b77c101bb8c814"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 15000),
    new MoneyDropData(10002, 32, 15000, langStringDefault("donate.donate-roulette.main.c1c514663ff50464337c6266f965aa7c"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 15000),
    new MoneyDropData(4,  32,  26000, langStringDefault("donate.donate-roulette.main.3eb2b4bb5f111f3d5bddc431fd8c9255"), RarityType.RARE, [RouletteType.STANDART], DropSellType.DOLLARS, 26000),
    new MoneyDropData(54, 33, 35000, langStringDefault("donate.donate-roulette.main.5ffb865047ece96bdf48096d41eca240"), RarityType.RARE,[ RouletteType.STANDART,RouletteType.PREMIUM], DropSellType.DOLLARS, 35000),
    new MoneyDropData(67, 33, 22000, langStringDefault("donate.donate-roulette.main.e0f8ffc8c42c3c8d3817fbeb90e2819d"), RarityType.RARE, [RouletteType.STANDART,RouletteType.PREMIUM], DropSellType.DOLLARS, 22000),
    new MoneyDropData(68, 33, 18000, langStringDefault("donate.donate-roulette.main.9680b50914d838503fd1ad2151fd8ca1"), RarityType.RARE, [RouletteType.STANDART], DropSellType.DOLLARS, 18000),
    new MoneyDropData(69, 33, 18000, langStringDefault("donate.donate-roulette.main.c108e4054edcd9f063300367c7df119a"), RarityType.RARE, [RouletteType.STANDART], DropSellType.DOLLARS, 18000),
    new MoneyDropData(10003, 33, 20000, langStringDefault("donate.donate-roulette.main.c8ef17baaec2db14344acdd84ff52535"), RarityType.RARE, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    new MoneyDropData(10004, 33, 20000, langStringDefault("donate.donate-roulette.main.4b5d94f7f0e14b94361310e19e8a403a"), RarityType.RARE, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    new MoneyDropData(10005, 33, 20000, langStringDefault("donate.donate-roulette.main.5421339d5f2bd3a411048d0add0819f9"), RarityType.RARE, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    new MoneyDropData(70, 33, 18000, langStringDefault("donate.donate-roulette.main.627fe48386a1caac24e084f33dd6b7dd"), RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DOLLARS, 18000),
    new MoneyDropData(71, 33, 23000, langStringDefault("donate.donate-roulette.main.106828d301be5d9522944f9578b68b9d"), RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DOLLARS, 23000),
    new MoneyDropData(72, 34, 26000, langStringDefault("donate.donate-roulette.main.9419b1b41bd1e835235ca8e5980f9067"), RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DOLLARS, 26000),
    new MoneyDropData(73, 34, 36000, langStringDefault("donate.donate-roulette.main.9b80c586475230d9dbb10cdde206557f"), RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DOLLARS, 36000),
    new MoneyDropData(74, 34, 45000, langStringDefault("donate.donate-roulette.main.5947316d13ab6b0ec975dfdb1b499e1b"), RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DOLLARS, 45000),
    new MoneyDropData(75, 34, 60000, langStringDefault("donate.donate-roulette.main.7e3727f4318c70ad1955ef5deb8b9ae9"), RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 60000),
    new MoneyDropData(76, 34, 60000, langStringDefault("donate.donate-roulette.main.00f1dd008504eaa277a6c674490426ed"), RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 60000),
    new MoneyDropData(77, 34, 60000, langStringDefault("donate.donate-roulette.main.e0732b7bebcfaf605219c7fcc8391f8f"), RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 60000),
    new MoneyDropData(108, 33, 60000, langStringDefault("donate.donate-roulette.main.4ae7d14d5f74b3708ce43eae6f84e6a1"), RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 60000),
    new MoneyDropData(109, 33, 60000, langStringDefault("donate.donate-roulette.main.de7a60eada25c93d1cc40b7c0995ac5b"), RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 60000),
    new MoneyDropData(110, 33, 60000, langStringDefault("donate.donate-roulette.main.48ea4cab1bd6d496d7bbeb4042533d28"), RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 60000),
    new MoneyDropData(111, 33, 70000, langStringDefault("donate.donate-roulette.main.b2c0125176545d36d2ddaca7fb2d2d0c"), RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 70000),
    new MoneyDropData(112, 33, 80000, langStringDefault("donate.donate-roulette.main.b49c386d5f77a3c77a90ab0159c9e157"), RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 80000),


    //Коины 200
    new CoinsDropData(3, 3, 15, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 15),
    new CoinsDropData(8, 3, 16, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 16),
    new CoinsDropData(12, 7, 17, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 17),
    new CoinsDropData(120, 3, 18, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 18),
    new CoinsDropData(121, 3, 19, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 19),
    new CoinsDropData(122, 3, 20, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 20),
    new CoinsDropData(123, 3, 21, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 21),
    new CoinsDropData(124, 3, 22, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 22),
    new CoinsDropData(125, 3, 22, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 22),
    new CoinsDropData(199, 3, 22, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 22),
    new CoinsDropData(11000, 3, 15, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 15),
    new CoinsDropData(11001, 3, 25, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 25),
    new CoinsDropData(11002, 3, 25, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 25),
    new CoinsDropData(44, 7, 25, "Coins", RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 25),
    new CoinsDropData(49, 7, 20, "Coins", RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 20),
    new CoinsDropData(53, 3, 15, "Coins", RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 15),
    new CoinsDropData(59, 3, 15, "Coins", RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 15),
    new CoinsDropData(200, 3, 15, "Coins", RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 15),
    new CoinsDropData(201, 3, 15, "Coins", RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 15),
    new CoinsDropData(202, 3, 15, "Coins", RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 15),
    new CoinsDropData(11003, 3, 15, "Coins", RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 15),
    new CoinsDropData(11004, 3, 15, "Coins", RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 15),
    new CoinsDropData(11005, 3, 15, "Coins", RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 15),
    new CoinsDropData(55, 3, 15, "Coins", RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 15),
    new CoinsDropData(203, 3, 2, "Coins", RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 2),
    new CoinsDropData(204, 3, 2, "Coins", RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 2),
    new CoinsDropData(205, 3, 2, "Coins", RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 2),
    new CoinsDropData(206, 3, 2, "Coins", RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 2),
    new CoinsDropData(207, 3, 2, "Coins", RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 2),
    new CoinsDropData(208, 3, 2, "Coins", RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 2),
    new CoinsDropData(209, 3, 2, "Coins", RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 2),
    new CoinsDropData(210, 3, 1, "Coins", RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 1),
    new CoinsDropData(211, 3, 1, "Coins", RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 1),
    new CoinsDropData(212, 3, 1, "Coins", RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 1),
    new CoinsDropData(213, 3, 1, "Coins", RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 1),
    new CoinsDropData(214, 3, 1, "Coins", RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 1),
    new CoinsDropData(215, 3, 1, "Coins", RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 1),
    new CoinsDropData(216, 3, 1, "Coins", RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 1),
    new CoinsDropData(14, 3, 7, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 7),
    new CoinsDropData(17, 3, 7, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 7),
    new CoinsDropData(21, 3, 7, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 7),
    new CoinsDropData(30, 3, 7, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 7),
    new CoinsDropData(31, 3, 7, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 7),
    new CoinsDropData(132, 3, 7, "Coins", RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 7),
    new CoinsDropData(19, 3, 7, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 7),
    new CoinsDropData(139, 3, 6, "Coins", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 6),
    new CoinsDropData(143, 3, 150, "Coins", RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 150),

    //Випки 200
    new VipDropData(1, 1, "Sapfire", 5, "Saphire VIP", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 15),
    new VipDropData(9, 5, "Ruby", 2, "Ruby VIP", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 20),
    new VipDropData(13, 1, "Sapfire", 10, "Sapfire VIP", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 15),
    new VipDropData(35, 1, "Sapfire", 7, "Saphire VIP", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000),
    new VipDropData(42, 1, "Sapfire", 7, "Saphire VIP", RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 15),
    new VipDropData(5, 5, "Ruby", 7, "Ruby VIP", RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 20),
    new VipDropData(6, 1, "Sapfire", 7, "Saphire VIP", RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 15),
    new VipDropData(10, 5, "Ruby", 5, "Ruby VIP", RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 20),
    new VipDropData(50, 5, "Ruby", 10, "Ruby VIP", RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 20),
    new VipDropData(219, 5, "Ruby", 10, "Ruby VIP", RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 10),
    new VipDropData(220, 5, "Ruby", 14, "Ruby VIP", RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 20),
    new VipDropData(221, 6, "Diamond", 3, "Diamond VIP", RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 25),

    //Опыт 200
    new XpDropData(2, 2, 2, langStringDefault("donate.donate-roulette.main.e1f31e070c2c934169c215c721cb25bb"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 22000),
    new XpDropData(7, 2, 3, langStringDefault("donate.donate-roulette.main.63cfc730cc58efeab7d1c54cbc1edb9a"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 22000),
    new XpDropData(43, 2, 2, langStringDefault("donate.donate-roulette.main.b10e645c11c3126fce305f0a736a906e"), RarityType.COMMON,[RouletteType.STANDART], DropSellType.DOLLARS, 22000),

    //Броники 200
    // new ArmorDropData(98, 52, 100, langStringDefault("donate.donate-roulette.main.c22c454105d61717e1e9fa97df0aed19"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000, false, false),
    // new ArmorDropData(99, 52, 100, langStringDefault("donate.donate-roulette.main.126bc1cafde6923b488ee02586d1c474"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000, false, false),
    // new ArmorDropData(104, 52, 100, langStringDefault("donate.donate-roulette.main.693dbfe1cff9241780a07deb71a45326"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000, false, false),
    // new ArmorDropData(105, 52, 100, langStringDefault("donate.donate-roulette.main.d5bb1d7c56cfa0c8a2a81ec70933116a"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000, false, false),
    // new ArmorDropData(106, 52, 100, langStringDefault("donate.donate-roulette.main.c58cafbb60b1d7632b1fd1e450d6ad0f"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000, false, false),
    // new ArmorDropData(107, 52, 100, langStringDefault("donate.donate-roulette.main.a31fd5b3fc735d5c1ccdbd1325f4d521"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000, false, false),
    // new ArmorDropData(1250, 52, 100, langStringDefault("donate.donate-roulette.main.18670275290c9707f0ba8465486446dd"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000, false, false),
    // new ArmorDropData(126, 52, 100, langStringDefault("donate.donate-roulette.main.eca8bc527623581ea91a0da5da410a79"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000, false, false),
    // new ArmorDropData(127, 52, 100, langStringDefault("donate.donate-roulette.main.34b34841cd70a3595d562f9e0c55d6ad"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000),
    // new ArmorDropData(128, 52, 100, langStringDefault("donate.donate-roulette.main.c117839d435a27c078f30175eedfacf4"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000),
    // new ArmorDropData(145, 52, 100, langStringDefault("donate.donate-roulette.main.7e4ab29e247ab813f7767170a0556b0e"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000),
    // new ArmorDropData(146, 52, 100, langStringDefault("donate.donate-roulette.main.a95dfec818e9d0602c63dffb5d2a1c62"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000),
    // new ArmorDropData(147, 52, 100, langStringDefault("donate.donate-roulette.main.b7599082e753446fcfa9e75cbe899d68"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000),
    // new ArmorDropData(148, 52, 100, langStringDefault("donate.donate-roulette.main.752bed66b86116c0f761a5c3acc1bec9"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000),
    // new ArmorDropData(153, 52, 100, langStringDefault("donate.donate-roulette.main.02cf141e1952d6af15012fd832ed84e2"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000),
    // new ArmorDropData(154, 52, 100, langStringDefault("donate.donate-roulette.main.9793268c2320427698392ee3d037dad1"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 5000),

    // //Эпики 200
    // new InventoryDropData(97, 25, 910, 3, langStringDefault("donate.donate-roulette.main.575e32cba39674f9ea931731b998c93b"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    // new InventoryDropData(129, 25, 910, 3, langStringDefault("donate.donate-roulette.main.3a194aec8ad6fe0b0d4d1ff165ddc127"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    // new InventoryDropData(130, 25, 910, 3, langStringDefault("donate.donate-roulette.main.ebb684d6c941aad26b438e36cd983360"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    // new InventoryDropData(131, 25, 910, 3, langStringDefault("donate.donate-roulette.main.0a86d04d3fc91fbdb3995195f3a26c3e"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    // new InventoryDropData(149, 25, 910, 3, langStringDefault("donate.donate-roulette.main.e1d6cb5d6ffa4e013c30b6d4326243ca"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    // new InventoryDropData(150, 25, 910, 3, langStringDefault("donate.donate-roulette.main.4f04675ff5cd3e471615b7d36c0fce81"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    // new InventoryDropData(151, 25, 910, 3, langStringDefault("donate.donate-roulette.main.5e75e074dc85829b5a657bbe17918d5f"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),
    // new InventoryDropData(152, 25, 910, 3, langStringDefault("donate.donate-roulette.main.fa94b9beb2b6a6b439a68bf807bcee84"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 20000),

    // //Оружия 200
    // new InventoryDropData(101, 42, 511, 1, langStringDefault("donate.donate-roulette.main.c98eb545a2b26e798e128aa678224cbe"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 10000),
    // new InventoryDropData(119, 42, 511, 1, langStringDefault("donate.donate-roulette.main.0c44e91884d711cab91ff09f88fdec2b"), RarityType.COMMON, [,RouletteType.STANDART], DropSellType.DOLLARS, 10000),
    // new InventoryDropData(1201, 42, 511, 1, langStringDefault("donate.donate-roulette.main.ac81113782cdc7aa675964cbdffe2fd0"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 10000),
    // new InventoryDropData(156, 42, 511, 1, langStringDefault("donate.donate-roulette.main.493146c51ea0aac75f69e4256334df12"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 10000),
    // new InventoryDropData(217, 42, 511, 1, langStringDefault("donate.donate-roulette.main.39c656e5bb6c775934ee044d60d7e67e"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DOLLARS, 10000, false, false),
    // new InventoryDropData(218, 29, 541, 1, langStringDefault("donate.donate-roulette.main.ed3f6c31c3e33ae1e1354b43a83f6f73"), RarityType.RARE, [RouletteType.STANDART], DropSellType.DOLLARS, 50000),
    // new InventoryDropData(100, 29, 541, 1, langStringDefault("donate.donate-roulette.main.6f77dae40cbdcec59e2d34d827c7f3f6"), RarityType.RARE, [RouletteType.STANDART], DropSellType.DOLLARS, 50000),


    //Машины 200
    // new VehicleDropData(135, 50, "weevil", "weevil", RarityType.RARE, [RouletteType.STANDART], DropSellType.DOLLARS, 30000),
    // new VehicleDropData(142, 18, "brioso", "brioso", RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DOLLARS, 45000),
    new VehicleDropData(15, 108, "bati2", "bati2", RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 70000),
    // new VehicleDropData(16, 127, "hakuchou2", "hakuchou2", RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 50000),
    // new VehicleDropData(22, 37, "focusrs", "focusrs", RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 270000),
    new VehicleDropData(27, 141, "rebla", "rebla", RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 80000),
    // new VehicleDropData(133, 134, "stalion", "stalion", RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 60000),
    // new VehicleDropData(134, 135, "vindicator", "vindicator", RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DOLLARS, 70000),
    // new VehicleDropData(26, 95, "paragon", "paragon", RarityType.SPECIAL, [RouletteType.STANDART], DropSellType.DONATE, 3000),
    new VehicleDropData(28, 84, "aclass", "aclass", RarityType.LEGENDARY, [RouletteType.STANDART], DropSellType.DONATE, 100),
    new VehicleDropData(29, 24, "e63s", "e63s", RarityType.LEGENDARY, [RouletteType.STANDART], DropSellType.DONATE, 100),
    new VehicleDropData(187, 82, "seven70", "seven70", RarityType.LEGENDARY, [RouletteType.STANDART], DropSellType.DONATE, 100),
    new VehicleDropData(189, 83, "osiris", "osiris", RarityType.LEGENDARY, [RouletteType.STANDART], DropSellType.DONATE, 100),
    new VehicleDropData(190, 106, "golf7r", "golf7r", RarityType.LEGENDARY, [RouletteType.STANDART], DropSellType.DONATE, 100),
    new VehicleDropData(191, 130, "bmwe39", "bmwe39", RarityType.LEGENDARY, [RouletteType.STANDART], DropSellType.DONATE, 100),
    new VehicleDropData(193, 107, "corvette2", "corvette2", RarityType.LEGENDARY, [RouletteType.STANDART], DropSellType.DONATE, 100),

    //Одежда 200
    // new InventoryDropData(95, 13, 2053, 1, langStringDefault("donate.donate-roulette.main.ab3854bdc4dda397a853fc59ace10c43"), RarityType.UNIQUE, [RouletteType.PREMIUM,RouletteType.STANDART], DropSellType.DOLLARS, 99000),
    // new DressDropData(157, 57, langStringDefault("donate.donate-roulette.main.779a79d8a7b402cbaccc8fd5146ae704"), langStringDefault("donate.donate-roulette.main.e1be07298177c58dbd02e7d47638560e"), langStringDefault("donate.donate-roulette.main.779a79d8a7b402cbaccc8fd5146ae704"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 150),
    // new DressDropData(159, 55, langStringDefault("donate.donate-roulette.main.97018438e99fde61257f3cb7d503b867"), langStringDefault("donate.donate-roulette.main.628063129892fe23ab582d1436dbb0c5"), langStringDefault("donate.donate-roulette.main.97018438e99fde61257f3cb7d503b867"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 100),
    // new DressDropData(163, 64, langStringDefault("donate.donate-roulette.main.d2ee85cf27ea300b94bd267646d7c99b"), langStringDefault("donate.donate-roulette.main.b110283a38d3f060a8f670542cfc57c9"), langStringDefault("donate.donate-roulette.main.e43716b74bd59f39870a52303b004bc3"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 150),
    // new DressDropData(164, 61, langStringDefault("donate.donate-roulette.main.ca5e6193cf54d805d70d548bf6d11f8a"), "Gucci", langStringDefault("donate.donate-roulette.main.d3305ccd77f10dbb62ff39b02c223a2d"), RarityType.RARE, [RouletteType.PREMIUM, RouletteType.STANDART], DropSellType.DONATE, 200),
    // new DressDropData(167, 65, langStringDefault("donate.donate-roulette.main.c56b29b14e8352c92d863b58bcedbba4"), langStringDefault("donate.donate-roulette.main.b18506031d363f13a1d0934a3e32a3ae"), langStringDefault("donate.donate-roulette.main.c56b29b14e8352c92d863b58bcedbba4"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 150),
    // new DressDropData(170, 62, langStringDefault("donate.donate-roulette.main.2eef3d665dacf6cb6ac8d8af4d7aff07"), langStringDefault("donate.donate-roulette.main.a73696ed36ea882651183e24264132fc"), langStringDefault("donate.donate-roulette.main.fd7c2aa6234f32c78e1ef64c75a5d86c"), RarityType.UNIQUE, [RouletteType.STANDART], DropSellType.DONATE, 400),
    // new DressDropData(173, 72, langStringDefault("donate.donate-roulette.main.608878fe9ce9a2c0471ad335cb4dcf50"), langStringDefault("donate.donate-roulette.main.b0ddeee59a829978c862897dc017654f"), langStringDefault("donate.donate-roulette.main.68d82f6448c88499cb0e8975e2b20369"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 120),
    // new DressDropData(178, 76, langStringDefault("donate.donate-roulette.main.b517caa94c32533a0103ba9a382398f5"), langStringDefault("donate.donate-roulette.main.0f46983c9adcef99364d614147ceaa14"), langStringDefault("donate.donate-roulette.main.0f46983c9adcef99364d614147ceaa14"), RarityType.COMMON, [RouletteType.STANDART], DropSellType.DONATE, 150),
    // new DressDropData(184, 62, langStringDefault("donate.donate-roulette.main.ab899fd7343b1ab278e4dfd523cd3d92"), langStringDefault("donate.donate-roulette.main.4196088bebd72267901e3b872d5c1c68"), langStringDefault("donate.donate-roulette.main.ab899fd7343b1ab278e4dfd523cd3d92"), RarityType.RARE, [RouletteType.STANDART], DropSellType.DONATE, 300),




















    //Geld 500
    new MoneyDropData(238, 34, 50000, langStringDefault("donate.donate-roulette.main.8c2ba13b22ff1e7e5f382fb8fc0612ba"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000),
    new MoneyDropData(239, 34, 80000, langStringDefault("donate.donate-roulette.main.ca160d51d0d2b33230e5e5ae5f0944ca"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 80000),
    new MoneyDropData(240, 34, 90000, langStringDefault("donate.donate-roulette.main.d5cc87d39ef9ba88440c07ca6b1dae1b"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 90000),
    new MoneyDropData(241, 34, 90000, langStringDefault("donate.donate-roulette.main.29b658847fe897738e9952c0c8ec1ec3"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 90000),
    new MoneyDropData(242, 34, 90000, langStringDefault("donate.donate-roulette.main.9fb5f230bde8989216725563e56bf3c1"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 90000),
    new MoneyDropData(37, 34, 50000, langStringDefault("donate.donate-roulette.main.0741510d03ff14d2285e54909243369a"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000),
    new MoneyDropData(250, 34, 80000, langStringDefault("donate.donate-roulette.main.a206f03ecb76c6ff3f485e1c8dd1a1fd"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 80000),
    new MoneyDropData(251, 34, 80000, langStringDefault("donate.donate-roulette.main.ed421d1a9d48a97a17096829263d555f"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 80000),
    new MoneyDropData(252, 34, 70000, langStringDefault("donate.donate-roulette.main.ba7ecfaafa2f6d8a42522c7f46c42a86"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 70000),
    new MoneyDropData(6000, 33, 110000, langStringDefault("donate.donate-roulette.main.14e9c0e9c1ff7e66666a13860070e0fd"), RarityType.RARE,[ RouletteType.PREMIUM], DropSellType.DOLLARS, 110000),
    new MoneyDropData(236, 34, 120000, langStringDefault("donate.donate-roulette.main.b590166e213ceb4c4893f6cb87249d31"), RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 120000),
    new MoneyDropData(237, 34, 120000, langStringDefault("donate.donate-roulette.main.81b84f43b67629c17e248c9a9cb25104"), RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 120000),
    new MoneyDropData(4020, 33, 50000, langStringDefault("donate.donate-roulette.main.9b5b8e54b4425baae13b87cd276ff772"), RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000),
    new MoneyDropData(4021, 33, 50000, langStringDefault("donate.donate-roulette.main.55893fd72c4ce1bb653c1a5dd67cce5b"), RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000),
    new MoneyDropData(4022, 33, 50000, langStringDefault("donate.donate-roulette.main.b8739c62c191f5b61bbfcbee0bcbac9c"), RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000),
    new MoneyDropData(116, 34, 150000, langStringDefault("donate.donate-roulette.main.54f340d5015e96108c9ad2b7cb24ccca"), RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 150000),
    new MoneyDropData(117, 34, 150000, langStringDefault("donate.donate-roulette.main.e760202df272235d86bb1a9ac24d833b"), RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 150000),
    new MoneyDropData(4004, 34, 150000, langStringDefault("donate.donate-roulette.main.6b3149692a03071f06de2137381c06b5"), RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 150000),
    new MoneyDropData(51, 34, 150000, langStringDefault("donate.donate-roulette.main.472398ba9213d90270f4fa60273712b1"), RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 150000),
    new MoneyDropData(253, 34, 130000, langStringDefault("donate.donate-roulette.main.0b08da11e8fe4b6d7b2f46473f9a1371"), RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 130000),
    new MoneyDropData(254, 34, 130000, langStringDefault("donate.donate-roulette.main.38d89fdae602cdff0598dfd380f1135e"), RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 130000),
    new MoneyDropData(267, 34, 130000, langStringDefault("donate.donate-roulette.main.1324f6881fd024651dbec4d9c60ae087"), RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 130000),
    new MoneyDropData(268, 34, 130000, langStringDefault("donate.donate-roulette.main.146c4e6633a4749b884beb42587c60f5"), RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 130000),
    new MoneyDropData(269, 34, 130000, langStringDefault("donate.donate-roulette.main.63b1f842876bb8d95ad21d44476072f8"), RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 130000),
    new MoneyDropData(270, 34, 130000, langStringDefault("donate.donate-roulette.main.0b084bb6a2b28ddcd6652d3c4ba46685"), RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 130000),
    new MoneyDropData(113, 34, 180000, langStringDefault("donate.donate-roulette.main.2f623118a3bf12c2e0d4e4098c76aa9f"), RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 180000),
    new MoneyDropData(114, 34, 200000, langStringDefault("donate.donate-roulette.main.235b1efbec78e67b5e5011be0590d499"), RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 200000),
    new MoneyDropData(115, 34, 200000, langStringDefault("donate.donate-roulette.main.f1920f68a6b1774dcca975dc9cd75ac3"), RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 200000),
    new MoneyDropData(118, 34, 180000, langStringDefault("donate.donate-roulette.main.8656f07cc91c221aafd538937b057db6"), RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 180000),
    new MoneyDropData(228, 34, 200000, langStringDefault("donate.donate-roulette.main.9225341d100b21a1aaf970134edb7ea5"), RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 200000),
    new MoneyDropData(4005, 34, 40000, langStringDefault("donate.donate-roulette.main.a333e84a1d2a6bf48d0687c6f13521b9"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 40000),
    new MoneyDropData(4006, 34, 40000, langStringDefault("donate.donate-roulette.main.a5e492e2dfd46c2274e4f53773c2ccfd"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 40000),
    new MoneyDropData(4007, 34, 40000, langStringDefault("donate.donate-roulette.main.08cd9cdff75318def0b8c7f2ecc0ebcd"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 40000),
    new MoneyDropData(4008, 34, 30000, langStringDefault("donate.donate-roulette.main.f6db1f56624ae2a7aabfc108485c7e43"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 30000),
    new MoneyDropData(4009, 34, 30000, langStringDefault("donate.donate-roulette.main.08ca3b8c80a06c4d662d108acf3746e1"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 30000),
    new MoneyDropData(4010, 34, 30000, langStringDefault("donate.donate-roulette.main.74b731098c0816a0f2f7e4048235fa91"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 30000),
    new MoneyDropData(4011, 34, 45000, langStringDefault("donate.donate-roulette.main.e225e3ddd99b3e74fb9df412166a96db"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 45000),
    new MoneyDropData(4012, 34, 45000, langStringDefault("donate.donate-roulette.main.1c1e88bc89976a8d5a378e7a7882a92c"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 45000),
    new MoneyDropData(4013, 34, 45000, langStringDefault("donate.donate-roulette.main.ad1b5d876f4ec27c0433f3b8e2eb2753"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 45000),



    //Коины 500
    new CoinsDropData(243, 3, 25, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 25),
    new CoinsDropData(244, 3, 26, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 26),
    new CoinsDropData(245, 3, 35, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 35),
    new CoinsDropData(246, 3, 25, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 25),
    new CoinsDropData(260, 3, 25, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 25),
    new CoinsDropData(261, 3, 25, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 25),
    new CoinsDropData(264, 3, 25, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 25),
    new CoinsDropData(232, 3, 35, "Coins", RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 35),
    new CoinsDropData(233, 3, 40, "Coins", RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(234, 3, 40, "Coins", RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(235, 3, 40, "Coins", RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(265, 3, 40, "Coins", RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(266, 3, 40, "Coins", RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(8007, 3, 40, "Coins", RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(8008, 3, 40, "Coins", RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(8009, 3, 40, "Coins", RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(224, 3, 40, "Coins", RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(225, 3, 40, "Coins", RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(229, 3, 40, "Coins", RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(230, 3, 40, "Coins", RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(231, 3, 40, "Coins", RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(226, 3, 40, "Coins", RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(227, 3, 40, "Coins", RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(56, 3, 40, "Coins", RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(58, 3, 40, "Coins", RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(296, 3, 40, "Coins", RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(297, 3, 40, "Coins", RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(298, 3, 40, "Coins", RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(262, 3, 40, "Coins", RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(263, 3, 40, "Coins", RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 40),
    new CoinsDropData(18,  3, 100, "Coins", RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DONATE, 100),
    new CoinsDropData(20,  3, 100, "Coins", RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DONATE, 100),
    new CoinsDropData(278, 3, 15, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 15),
    new CoinsDropData(271, 3, 15, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 15),
    new CoinsDropData(272, 3, 15, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 15),
    new CoinsDropData(273, 3, 15, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 15),
    new CoinsDropData(274, 3, 15, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 15),
    new CoinsDropData(8000, 3, 15, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 15),
    new CoinsDropData(8001, 3, 15, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 15),
    new CoinsDropData(8002, 3, 15, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 15),
    new CoinsDropData(8003, 3, 15, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 15),
    new CoinsDropData(8004, 3, 15, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 15),
    new CoinsDropData(8005, 3, 15, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 15),
    new CoinsDropData(8006, 3, 15, "Coins", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 15),

    //Випки 500
    new VipDropData(247, 1, "Sapfire", 30, "Saphire VIP", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 15),
    new VipDropData(248, 1, "Sapfire", 30, "Saphire VIP", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 15),
    new VipDropData(249, 5, "Ruby", 20, "Ruby VIP", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 20),
    new VipDropData(52, 5, "Ruby", 20, "Ruby VIP", RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 20),
    new VipDropData(280, 5, "Ruby", 20, "Ruby VIP", RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 25),
    new VipDropData(281, 6, "Diamond", 15, "Diamond VIP", RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DONATE, 25),

    // //Оружия 500
    // new InventoryDropData(7000, 29, 541, 1, langStringDefault("donate.donate-roulette.main.405a51bd2dbb0829903669313f5104a7"), RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000, false, false),
    // new InventoryDropData(155, 29, 541, 1, langStringDefault("donate.donate-roulette.main.ef53a8610f580434160aee987f4a05c3"), RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000, false, false),
    // new InventoryDropData(255, 29, 541, 1, langStringDefault("donate.donate-roulette.main.5f768b2b5c37503966304405ad990440"), RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000, false, false),
    // new InventoryDropData(256, 29, 541, 1, langStringDefault("donate.donate-roulette.main.0e7a952ca740d3c70f2d60269158b88a"), RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000, false, false),
    // new InventoryDropData(257, 29, 541, 1, langStringDefault("donate.donate-roulette.main.a29694127ef1453b8ee379aa3a20ad26"), RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000),
    // // new InventoryDropData(377, 120, 573, 1, langStringDefault("donate.donate-roulette.main.54d7eeb4712cbf9a47863c049276d788"), RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 80000),
    // new InventoryDropData(282, 29, 541, 1, langStringDefault("donate.donate-roulette.main.bc365a81e5986bddb3944aa3783d7f8e"), RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 50000),
    // new InventoryDropData(380, 123, 510, 1, langStringDefault("donate.donate-roulette.main.4e07c38523341129659417b79ec9e28f"), RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 90000),
    // new InventoryDropData(381, 123, 510, 1, langStringDefault("donate.donate-roulette.main.8582e43c711fdad5de6879e826da3e1d"), RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 90000),
    // new InventoryDropData(293, 118, 565, 1, langStringDefault("donate.donate-roulette.main.70243dcbe45fe914268fec4b24e6a7b5"), RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 70000),
    // new InventoryDropData(287, 118, 565, 1, langStringDefault("donate.donate-roulette.main.6b5e243ba9c246b0c83bfc825f905fa9"), RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 70000),
    // new InventoryDropData(294, 118, 565, 1, langStringDefault("donate.donate-roulette.main.6d7f5bb5b10ade524779b756b8e56220"), RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 70000),
    // new InventoryDropData(295, 118, 565, 1, langStringDefault("donate.donate-roulette.main.d1ab749960ee34f68deec25e00e4a0a7"), RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 70000),
    // new InventoryDropData(258, 131, 548, 1, langStringDefault("donate.donate-roulette.main.2482bd3fa723288b7d60d3706356e30b"), RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 100000),
    // new InventoryDropData(259, 131, 548, 1, langStringDefault("donate.donate-roulette.main.3cd4eee3c707304183d61a9d63dc5558"), RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 100000),
    // new InventoryDropData(288, 131, 548, 1, langStringDefault("donate.donate-roulette.main.069b440713311457f3fd155c212f75e6"), RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 100000),
    // new InventoryDropData(289, 115, 566, 1, langStringDefault("donate.donate-roulette.main.460465076a9ab89f482078534664ef83"), RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 85000),
    // new InventoryDropData(290, 116, 568, 1, langStringDefault("donate.donate-roulette.main.14134060707784eac4fb26488988aecc"), RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 75000),
    // new InventoryDropData(291, 119, 561, 1, langStringDefault("donate.donate-roulette.main.8a67e93acad30350d14f505bc21e1aee"), RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 90000),
    // new InventoryDropData(292, 117, 567, 1, langStringDefault("donate.donate-roulette.main.4c80d3bfbc6729e68d6962e11ab011a4"), RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 65000),





    //Машины 500
    new VehicleDropData(275, 21, "cheburek", "cheburek", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 40000),
    // new VehicleDropData(276, 132, "rebel", "rebel", RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DOLLARS, 40000),
    // new VehicleDropData(277, 137, "cavalcade2", "cavalcade2", RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 40000),
    // new VehicleDropData(279, 22, "sentinel", "sentinel", RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 40000),
    // new VehicleDropData(283, 45, "sugoi", "sugoi", RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 200000),
    // new VehicleDropData(284, 86, "gauntlet", "gauntlet", RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 100000),
    // new VehicleDropData(285, 88, "tampa2", "tampa2", RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 100000),
    // new VehicleDropData(286, 87, "jester3", "jester3", RarityType.UNIQUE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 100000),
    // new VehicleDropData(23, 46, "sultanrs", "sultanrs", RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 380000),
    // new VehicleDropData(222, 85, "dubsta2", "dubsta2", RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 200000),
    new VehicleDropData(223, 84, "e63s", "e63s", RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DONATE, 4000),
    // new VehicleDropData(136, 46, "sultanrs", "sultanrs", RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 350000),
    // new VehicleDropData(140, 96, "comet5", "comet5", RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 400000),
    // new VehicleDropData(141, 97, "kamacho", "kamacho", RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 300000),
    new VehicleDropData(303, 138, "bmwe39", "bmwe39", RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 1000000),
    new VehicleDropData(304, 138, "bmwe39", "bmwe39", RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DONATE, 3000),
    new VehicleDropData(103, 90, "camry70", "camry70", RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 4000),
    // new VehicleDropData(194, 28, "g63", "g63", RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 10000),
    // new VehicleDropData(195, 98, "bentaygast", "bentaygast", RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 10000),
    // new VehicleDropData(196, 99, "shotaro", "shotaro", RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 5000),
    new VehicleDropData(197, 24, "e63s", "e63s", RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 5000),
    new VehicleDropData(198, 90, "camry70", "camry70", RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 4000),
    // new VehicleDropData(299, 100, "sanctus", "sanctus", RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DOLLARS, 1000000),
    // new VehicleDropData(300, 110, "laferrari", "laferrari", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 15000),
    new VehicleDropData(301, 89, "aclass", "aclass", RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 5000),
    new VehicleDropData(302, 90, "camry70", "camry70", RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 4000),
    // new VehicleDropData(305, 91, "brutale", "brutale", RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 4000),


    //Одежда 500
    // new InventoryDropData(24, 13, 2053, 1, langStringDefault("donate.donate-roulette.main.178244967a5f6cfb186aed3f58c65eb3"), RarityType.UNIQUE, [RouletteType.PREMIUM,RouletteType.STANDART], DropSellType.DOLLARS, 99000),
    // new InventoryDropData(4003, 14, 2054, 1, langStringDefault("donate.donate-roulette.main.2a390bfa441879c53cafda84fdddbe20"), RarityType.UNIQUE, [RouletteType.PREMIUM,RouletteType.LUXE], DropSellType.DOLLARS, 150000),
    // new InventoryDropData(94, 15, 871, 1, langStringDefault("donate.donate-roulette.main.ff38aa43bd05d9f7beb0d6f768ee8c21"), RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DOLLARS, 75000),
    // new InventoryDropData(4030, 13, 2053, 1, langStringDefault("donate.donate-roulette.main.e84a375cc5b6d98819702dc2223dd7a8"), RarityType.UNIQUE, [RouletteType.PREMIUM,RouletteType.STANDART], DropSellType.DOLLARS, 99000),
    // new InventoryDropData(4040, 14, 2054, 1, langStringDefault("donate.donate-roulette.main.77f251a128240a0ab0cc87dbce4659bf"), RarityType.UNIQUE, [RouletteType.PREMIUM,RouletteType.LUXE], DropSellType.DOLLARS, 150000),
    // new DressDropData(158, 56, langStringDefault("donate.donate-roulette.main.6d4d977b4e3d8e352362639710640d7c"), langStringDefault("donate.donate-roulette.main.786afbbdb2a33b6aa1ebf24fa0c99c47"), langStringDefault("donate.donate-roulette.main.6d4d977b4e3d8e352362639710640d7c"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 250),
    // new DressDropData(160, 54, langStringDefault("donate.donate-roulette.main.cb26f35ab437e019144af0da0a373df8"), langStringDefault("donate.donate-roulette.main.04052ba331fd47a3c484eb0a9991ce65"), langStringDefault("donate.donate-roulette.main.cb26f35ab437e019144af0da0a373df8"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 350),
    // new DressDropData(4050, 61, langStringDefault("donate.donate-roulette.main.6cd52b2e3d1a3f6f478141e65830ebbb"), "Gucci", langStringDefault("donate.donate-roulette.main.b23e3009479aacbcccc31606daad3192"), RarityType.RARE, [RouletteType.PREMIUM, RouletteType.STANDART], DropSellType.DONATE, 200),
    // new DressDropData(165, 79, langStringDefault("donate.donate-roulette.main.53293a2c0f5548a99128cbd26cca12fc"), langStringDefault("donate.donate-roulette.main.f6144d34eee8c051bf32a07eba5d5b9d"), langStringDefault("donate.donate-roulette.main.10a580976af1541cbd4a2118c8faafc8"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    // new DressDropData(166, 59, langStringDefault("donate.donate-roulette.main.07da72de5d3bcc9bd698219c1976e457"), langStringDefault("donate.donate-roulette.main.f7c0db767d09b2fbd5523cee8811fa76"), langStringDefault("donate.donate-roulette.main.07da72de5d3bcc9bd698219c1976e457"), RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    // new DressDropData(168, 78, langStringDefault("donate.donate-roulette.main.c34d186350bbfcc85045724e3b12933b"), langStringDefault("donate.donate-roulette.main.54f6a3dfc7aac46fc4445c7a367025a0"), langStringDefault("donate.donate-roulette.main.c34d186350bbfcc85045724e3b12933b"), RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 600),
    // new DressDropData(175, 71, langStringDefault("donate.donate-roulette.main.8cbe677673fe1b0e5042266d97a9f676"), langStringDefault("donate.donate-roulette.main.deb16904ad344966dfe40694a8d7bb72"), langStringDefault("donate.donate-roulette.main.8cbe677673fe1b0e5042266d97a9f676"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    // new DressDropData(177, 70, langStringDefault("donate.donate-roulette.main.04f42e6cad80470b9689d6757f6238f0"), langStringDefault("donate.donate-roulette.main.dcaac738933ade86cce3001d5eabf03f"), langStringDefault("donate.donate-roulette.main.24bb5457cd6dc8a5b71e88f1925ffae7"), RarityType.RARE, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    // new DressDropData(182, 73, langStringDefault("donate.donate-roulette.main.0bd397ef0f103dcdbeb4b4b43ae6536b"), langStringDefault("donate.donate-roulette.main.54b6a9d35a74fb03563c5a39b7dcc748"), langStringDefault("donate.donate-roulette.main.76f38fa5cf34f44ffea4e12ec27c5828"), RarityType.COMMON, [RouletteType.PREMIUM], DropSellType.DONATE, 500),
    // new DressDropData(15001, 142, langStringDefault("donate.donate-roulette.main.a66e93d18f94fcbe2b4be07b7b6d9cce"), langStringDefault("donate.donate-roulette.main.b162c20dbb7895b3340cfe8026c1f2e3"), langStringDefault("donate.donate-roulette.main.7d26c94ca549e77e53ad9fb53ba89029"), RarityType.LEGENDARY, [RouletteType.PREMIUM], DropSellType.DONATE, 3000),



















    //Geld 1000
    new MoneyDropData(312, 34, 90000, langStringDefault("donate.donate-roulette.main.3fd21eb46fb0d19d5188e0233bcfd441"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 90000),
    new MoneyDropData(313, 34, 90000, langStringDefault("donate.donate-roulette.main.10986caa1649c62c12088851646d06b5"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 90000),
    new MoneyDropData(314, 34, 90000, langStringDefault("donate.donate-roulette.main.ccea361ce80e3668a8c36570189bc226"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 90000),
    new MoneyDropData(315, 34, 90000, langStringDefault("donate.donate-roulette.main.3f8ba7bc6e9ff2e8f1fb6caad6388240"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 90000),
    new MoneyDropData(3120, 34, 120000, langStringDefault("donate.donate-roulette.main.370d85c7767df32194a72443be978163"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 120000),
    new MoneyDropData(339, 34, 120000, langStringDefault("donate.donate-roulette.main.34f49b17642eb707d3d1f37b8310a5e5"), RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 120000),
    new MoneyDropData(340, 34, 130000, langStringDefault("donate.donate-roulette.main.c7470d10ed5a4602bd87ef84e7af4440"), RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 130000),
    new MoneyDropData(341, 34, 150000, langStringDefault("donate.donate-roulette.main.123944f6309d78d4c20c7a31b412208a"), RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 150000),
    new MoneyDropData(3160, 34, 155000, langStringDefault("donate.donate-roulette.main.0c106ae369f366b25d3053c7cf4c1eb0"), RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 155000),
    new MoneyDropData(317, 34, 160000, langStringDefault("donate.donate-roulette.main.b1cce67c7e5cd4fca3e1568ab2eaf95d"), RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 160000),
    new MoneyDropData(318, 34, 160000, langStringDefault("donate.donate-roulette.main.96f954109f0b8adedcdb728d887b82e9"), RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 160000),
    new MoneyDropData(3170, 34, 95000, langStringDefault("donate.donate-roulette.main.ee5da4849d7fabe907b9da0ba2a6afa5"), RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 95000),
    new MoneyDropData(3171, 34, 95000, langStringDefault("donate.donate-roulette.main.35ea2ba096e211cd2e1203083731974a"), RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 95000),
    new MoneyDropData(3172, 34, 95000, langStringDefault("donate.donate-roulette.main.631b230acc511c61e17dccbe26b42e38"), RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 95000),
    new MoneyDropData(342, 34, 160000, langStringDefault("donate.donate-roulette.main.b3c8d440bc0f23c887c24d9ddb064e07"), RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DOLLARS, 160000),
    new MoneyDropData(343, 34, 170000, langStringDefault("donate.donate-roulette.main.83a73d70e3b411b179931c178e03f1de"), RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DOLLARS, 170000),
    new MoneyDropData(344, 34, 175000, langStringDefault("donate.donate-roulette.main.c2a34f25591bac2b808f8309dc545ac4"), RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DOLLARS, 175000),
    new MoneyDropData(327, 34, 180000, langStringDefault("donate.donate-roulette.main.a59c146968fb09d84469d760b1005895"), RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DOLLARS, 180000),
    new MoneyDropData(328, 34, 185000, langStringDefault("donate.donate-roulette.main.1d66022d074b56444999e6b4cc415cf2"), RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DOLLARS, 185000),
    new MoneyDropData(329, 34, 190000, langStringDefault("donate.donate-roulette.main.79ec1212223e947cfee431af965651bb"), RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DOLLARS, 190000),
    new MoneyDropData(3130, 34, 90000, langStringDefault("donate.donate-roulette.main.a867dc164aceff31a4697239d06aedf3"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 90000),
    new MoneyDropData(3140, 34, 90000, langStringDefault("donate.donate-roulette.main.4792d93dcace01a3bdabfd2e9456a428"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 90000),
    new MoneyDropData(3150, 34, 90000, langStringDefault("donate.donate-roulette.main.41a96ff3c4c002fe93239e24c04cc14f"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 90000),
    new MoneyDropData(3160, 34, 80000, langStringDefault("donate.donate-roulette.main.2edc1ed3f39cddb52ed0606a20a4ba4d"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 80000),
    new MoneyDropData(3161, 34, 80000, langStringDefault("donate.donate-roulette.main.2998a2d6d31c1b8262fcc5437a82d24a"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 80000),
    new MoneyDropData(3162, 34, 80000, langStringDefault("donate.donate-roulette.main.f5b681e53d980dc5f3e937cbefe0b016"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 80000),
    new MoneyDropData(3163, 34, 80000, langStringDefault("donate.donate-roulette.main.b850d63f1c2db04ade75ce385518782f"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 80000),
    new MoneyDropData(3164, 34, 70000, langStringDefault("donate.donate-roulette.main.d48d3cb9fad52f3cfe9bca70a3a291f2"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 70000),
    new MoneyDropData(3165, 34, 70000, langStringDefault("donate.donate-roulette.main.621b669e72ff552b68a9ff88583e7f11"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 70000),
    new MoneyDropData(3166, 34, 70000, langStringDefault("donate.donate-roulette.main.595398e7fafeeffe0307d15565654843"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 70000),
    new MoneyDropData(3167, 34, 85000, langStringDefault("donate.donate-roulette.main.110f0e0a4843c4164dac168317ea3c00"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 85000),
    new MoneyDropData(3168, 34, 85000, langStringDefault("donate.donate-roulette.main.139e3535844d1e1c0c874f9b72a7a1cb"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 85000),
    new MoneyDropData(3169, 34, 85000, langStringDefault("donate.donate-roulette.main.c8c419bedc1b4e56915ab910dbe8db75"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DOLLARS, 85000),

    //Коины 1000
    new CoinsDropData(306, 3, 25, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(307, 3, 25, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(308, 3, 25, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(309, 3, 25, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(310, 3, 25, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(311, 3, 25, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(319, 3, 25, "Coins", RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(320, 3, 25, "Coins", RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(321, 3, 25, "Coins", RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(322, 3, 25, "Coins", RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(345, 3, 25, "Coins", RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(346, 3, 25, "Coins", RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(347, 3, 25, "Coins", RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(348, 3, 25, "Coins", RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(323, 3, 25, "Coins", RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(324, 3, 25, "Coins", RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(325, 3, 25, "Coins", RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(326, 3, 25, "Coins", RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(5014, 3, 25, "Coins", RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(5015, 3, 25, "Coins", RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(5016, 3, 25, "Coins", RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 25),
    new CoinsDropData(331, 3, 50, "Coins", RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 50),
    new CoinsDropData(332, 3, 50, "Coins", RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 50),
    new CoinsDropData(333, 3, 50, "Coins", RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 50),
    new CoinsDropData(334, 3, 50, "Coins", RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 50),
    new CoinsDropData(335, 3, 50, "Coins", RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 50),
    new CoinsDropData(336, 3, 50, "Coins", RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 50),
    new CoinsDropData(337, 3, 50, "Coins", RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 50),
    new CoinsDropData(338, 3, 50, "Coins", RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 50),
    new CoinsDropData(138, 3, 50, "Coins", RarityType.SPECIAL, [RouletteType.LUXE], DropSellType.DONATE, 50),
    new CoinsDropData(4002, 3, 50, "Coins", RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 50),
    new CoinsDropData(352, 3, 15, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 15),
    new CoinsDropData(354, 3, 15, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 15),
    new CoinsDropData(330, 3, 15, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 15),
    new CoinsDropData(4001, 3, 15, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 15),
    new CoinsDropData(5002, 3, 15, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 15),
    new CoinsDropData(5003, 3, 15, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 15),
    new CoinsDropData(5004, 3, 15, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 15),
    new CoinsDropData(5005, 3, 15, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 15),
    new CoinsDropData(5006, 3, 15, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 15),
    new CoinsDropData(5007, 3, 15, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 15),
    new CoinsDropData(5008, 3, 15, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 15),
    new CoinsDropData(5009, 3, 15, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 15),
    new CoinsDropData(5010, 3, 15, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 15),
    new CoinsDropData(5011, 3, 15, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 15),
    new CoinsDropData(5012, 3, 15, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 15),
    new CoinsDropData(5013, 3, 15, "Coins", RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 15),

    // //Оружия 1000
    // new InventoryDropData(353, 131, 548, 1, langStringDefault("donate.donate-roulette.main.77fc6156781506b67f2440081c25c8b4"), RarityType.SPECIAL, [RouletteType.PREMIUM], DropSellType.DOLLARS, 100000),
    // new InventoryDropData(358, 116, 570, 1, langStringDefault("donate.donate-roulette.main.68de2873a36b8d99000bb900e678aae0"), RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DOLLARS, 150000),
    // new InventoryDropData(378, 121, 572, 1, langStringDefault("donate.donate-roulette.main.126708803c056ca037641bafeb523602"), RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 200000),
    // new InventoryDropData(379, 122, 515, 1, langStringDefault("donate.donate-roulette.main.173a1d7e833b383facff2af120f6f982"), RarityType.RARE, [RouletteType.LUXE], DropSellType.DOLLARS, 170000),

    //Машины 1000
    new VehicleDropData(349, 124, "bolide", "bolide", RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 100),
    new VehicleDropData(350, 92, "chiron19", "chiron19", RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 100),
    new VehicleDropData(355, 94, "amgone", "amgone", RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 100),
    new VehicleDropData(351, 37, "cullinan", "cullinan", RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 100),
    new VehicleDropData(356, 51, "dawn", "xls", RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 100),
    new VehicleDropData(357, 351, "db5", "db5", RarityType.UNIQUE, [RouletteType.LUXE], DropSellType.DONATE, 100),
    new VehicleDropData(5000, 24, "delorean", "delorean", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 100),
    new VehicleDropData(188, 41, "diablo", "diablo", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 100),
    new VehicleDropData(144, 28, "essenza", "essenza", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 100),
    new VehicleDropData(359, 106, "f40", "f40", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 100),
    new VehicleDropData(360, 352, "fordgt", "fordgt", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 100),
    new VehicleDropData(368, 101, "fxxk", "fxxk", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 100),
    // new VehicleDropData(367, 93, "m4comp", "m4comp", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DOLLARS, 1500000),
    // new VehicleDropData(369, 105, "camaro21", "camaro21", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DOLLARS, 1900000),
    // new VehicleDropData(370, 102, "m3g81", "m3g81", RarityType.SPECIAL, [RouletteType.LUXE], DropSellType.DOLLARS, 1300000),
    // new VehicleDropData(371, 140, "subwrx", "Subaruwrxsti", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DOLLARS, 1000000),
    // new VehicleDropData(372, 111, "r820", "r820", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DOLLARS, 1000000),
    // new VehicleDropData(373, 103, "charger20", "charger20", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DOLLARS, 900000),
    // new VehicleDropData(361, 48, "asvj", "asvj", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 20000),
    // new VehicleDropData(362, 110, "laferrari", "laferrari", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 15000),
    // new VehicleDropData(363, 109, "panamera17turbo", "panamera17turbo", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 17000),
    // new VehicleDropData(364, 20, "buzzard2", "Buzzard2", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 12000),
    // new VehicleDropData(365, 35, "maverick", "Maverick", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 14000),
    // new VehicleDropData(366, 104, "frogger2", "Frogger2", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 13000),
    // new VehicleDropData(3670, 143, "bdivo", "bdivo", RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 25000),


    //Одежда 1000
    // new DressDropData(161, 53, langStringDefault("donate.donate-roulette.main.34fbfca7e7a2208950d677bfcd26bffa"), langStringDefault("donate.donate-roulette.main.313a18a70784531a3a8e131cdc79422f"), langStringDefault("donate.donate-roulette.main.34fbfca7e7a2208950d677bfcd26bffa"), RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 700),
    // new DressDropData(162, 53, langStringDefault("donate.donate-roulette.main.f127ae785c2f72d9899fc8170c9d3fbe"), langStringDefault("donate.donate-roulette.main.a8efc33d6dcf90eb09ddb80f997ce7ab"), langStringDefault("donate.donate-roulette.main.64e3ed3a15128719f929f8d356a6f48b"), RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 700),
    // new DressDropData(169, 67, langStringDefault("donate.donate-roulette.main.a44f8edc21da410b0fad5029588b9369"), "Gucci", langStringDefault("donate.donate-roulette.main.a44f8edc21da410b0fad5029588b9369"), RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 800),
    // new DressDropData(171, 60, langStringDefault("donate.donate-roulette.main.104600d65d5528fc2590c898217ab762"), "Gucci", langStringDefault("donate.donate-roulette.main.104600d65d5528fc2590c898217ab762"), RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 900),
    // new DressDropData(176, 69, langStringDefault("donate.donate-roulette.main.f441066bedb2ee56c85ac12f24b14d12"), langStringDefault("donate.donate-roulette.main.8bdd1381137a27829fe3d2bd10bb383e"), langStringDefault("donate.donate-roulette.main.f441066bedb2ee56c85ac12f24b14d12"), RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 900),
    // new DressDropData(185, 63, langStringDefault("donate.donate-roulette.main.23ef31fc57d527773d17bd8395e6f6d1"), langStringDefault("donate.donate-roulette.main.4c8bf802c70b3cc0f204f3a301258ea5"), langStringDefault("donate.donate-roulette.main.700ceb485409ddb6df4bd487d268471c"), RarityType.RARE, [RouletteType.LUXE], DropSellType.DONATE, 700),
    // new DressDropData(186, 60, langStringDefault("donate.donate-roulette.main.8085c7c51e4d229365f9ba71059979df"), "Gucci", langStringDefault("donate.donate-roulette.main.c38484700ee3e99b666810149c54ec46"), RarityType.COMMON, [RouletteType.LUXE], DropSellType.DONATE, 700),
    // new InventoryDropData(25, 14, 2054, 1, langStringDefault("donate.donate-roulette.main.86db8dffce86bb015b4b314d27ed1f82"), RarityType.UNIQUE, [RouletteType.PREMIUM,RouletteType.LUXE], DropSellType.DOLLARS, 150000),
    // new InventoryDropData(96, 14, 2054, 1, langStringDefault("donate.donate-roulette.main.48a28085d89e6f5f5b85c96f6eea517f"), RarityType.UNIQUE, [RouletteType.PREMIUM,RouletteType.LUXE], DropSellType.DOLLARS, 150000),
    // // new DressDropData(15000, 142, langStringDefault("donate.donate-roulette.main.e19103e229e1c9ad1e78a4cb74674451"), langStringDefault("donate.donate-roulette.main.377bb5ec862a847b38ec8163dcd7298c"), langStringDefault("donate.donate-roulette.main.85466f702c97272f354e8ce345982a76"), RarityType.SPECIAL, [RouletteType.LUXE], DropSellType.DONATE, 3000),

    // //реал 1000
    // new RealDropData(32, 9, langStringDefault("donate.donate-roulette.main.1cd995a3ad660af73bf3384cd38b89c5"), RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 100, false),
    // new RealDropData(33, 10, langStringDefault("donate.donate-roulette.main.b5ab5e0ebf5ae6200e6c7763b8fc59af"), RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DONATE, 100, false),
    // new InventoryDropData(102, 30, 546, 1, langStringDefault("donate.donate-roulette.main.8b62388a848a64d1eebd8e58fd866789"), RarityType.LEGENDARY, [RouletteType.LUXE], DropSellType.DOLLARS, 10000, false),



    // Casino
    new MoneyDropData(20000, 32, 814, langStringDefault("donate.donate-roulette.main.bce96f52db8b9d25fb2b0c646453dcb7"), RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    new VehicleDropData(20001, 83, "nsx2", "Dinka NSY NI1", RarityType.CASINO, [RouletteType.LUXE], DropSellType.DOLLARS, 300000, false),
    new CoinsDropData(20002, 3, 3, "Coins", RarityType.CASINO, [RouletteType.LUXE], DropSellType.DONATE, 0, false),
    new MoneyDropData(20003, 32, 3000, langStringDefault("donate.donate-roulette.main.3190108ad6b7bef93232a7cf30475f4e"), RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    new VipDropData(20004, 6, "Diamond", 14, "Diamond VIP", RarityType.CASINO, [RouletteType.STANDART], DropSellType.DONATE, 0, false),
    new MoneyDropData(20005, 32, 2500, langStringDefault("donate.donate-roulette.main.347d35c06fa6b69e64c158d8f0569298"), RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    // new DressDropData(20006, 60, langStringDefault("donate.donate-roulette.main.c6bf0a3b4c60323da7ca550b44364a86"), "Gucci", langStringDefault("donate.donate-roulette.main.c6bf0a3b4c60323da7ca550b44364a86"), RarityType.CASINO, [RouletteType.LUXE], DropSellType.DONATE, 0, false),
    new XpDropData(20007, 2, 1, langStringDefault("donate.donate-roulette.main.9f77568f35393fff9b248b3f9e08b7b7"), RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    new MoneyDropData(20008, 32, 15000, langStringDefault("donate.donate-roulette.main.5d72142a7d9794d5955d867b4d83a622"), RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    new CoinsDropData(20009, 3, 25, "Coins", RarityType.CASINO, [RouletteType.LUXE], DropSellType.DONATE, 0, false),
    new MoneyDropData(20010, 32, 20000, langStringDefault("donate.donate-roulette.main.1c5e77c2c9ac545a1fbe4bf95b630479"), RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    new VehicleDropData(20011, 141, "190e", "190e", RarityType.CASINO, [RouletteType.LUXE], DropSellType.DOLLARS, 170000, false),
    new CoinsDropData(20012, 3, 25, "Coins", RarityType.CASINO, [RouletteType.LUXE], DropSellType.DONATE, 0, false),
    new MoneyDropData(20013, 32, 1800, langStringDefault("donate.donate-roulette.main.1d90e488a1fb477abd891b93b7efd90c"), RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    new VipDropData(20014, 5, "Ruby", 30, "Ruby VIP", RarityType.CASINO, [RouletteType.STANDART], DropSellType.DONATE, 0, false),
    new MoneyDropData(20015, 32, 15000, langStringDefault("donate.donate-roulette.main.dde83ccfb3013aab0ef71af7d2d251bb"), RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    // new DressDropData(20016, 53, langStringDefault("donate.donate-roulette.main.cb8ad44f6d8dd99a8674fab95b2f4e42"), langStringDefault("donate.donate-roulette.main.51d51e3b19f5ffbfc33f0101dea0d232"), langStringDefault("donate.donate-roulette.main.56aae5bea0c4ed6f1ad600f53a1006d4"), RarityType.CASINO, [RouletteType.LUXE], DropSellType.DONATE, 0, false),
    new XpDropData(20017, 2, 2, langStringDefault("donate.donate-roulette.main.d00564798fbac9846b6f0bc01575aed6"), RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    new MoneyDropData(20018, 32, 35000, langStringDefault("donate.donate-roulette.main.8f5d2327ba94fcad14dc6a5c33cfe6a2"), RarityType.CASINO, [RouletteType.STANDART], DropSellType.DOLLARS, 0, false),
    new CoinsDropData(20019, 3, 50, "Coins", RarityType.CASINO, [RouletteType.LUXE], DropSellType.DONATE, 0, false),












]

/*
    Раритетности рулетки с шансом выпадения.
*/
// DEPRECATED
export const rarities: Rarity[] = [
    new Rarity(RarityType.COMMON, langStringDefault("donate.donate-roulette.main.7d84afab553df27ae6ef31b1dff46a06"), 0.4),
    new Rarity(RarityType.RARE, langStringDefault("donate.donate-roulette.main.401d0245e6584a13363154da488f9b8f"), 0.3),
    new Rarity(RarityType.UNIQUE, langStringDefault("donate.donate-roulette.main.341660d0c7293d4bc3455ec6f57f05f8"), 0.14),
    new Rarity(RarityType.SPECIAL, langStringDefault("donate.donate-roulette.main.8c1ccdc4a4a3e498aa55ad7ab486e8f8"), 0.022),
    new Rarity(RarityType.LEGENDARY, langStringDefault("donate.donate-roulette.main.d9b98171d3b8970a6961523ebc3c616c"), 0.0012),
]

export const raritiesByRouletteType = new Map<RouletteType, Rarity[]>([
    [
        RouletteType.STANDART,
        [
            new Rarity(RarityType.COMMON, langStringDefault("donate.donate-roulette.main.bd7446b2dfdf555f575510e53779f73d"), 0.42),
            new Rarity(RarityType.RARE, langStringDefault("donate.donate-roulette.main.659929941c566afe834d2615a93aca09"), 0.28),
            new Rarity(RarityType.UNIQUE, langStringDefault("donate.donate-roulette.main.a210c08283d20e9c967c62b62b85d978"), 0.19),
            new Rarity(RarityType.SPECIAL, langStringDefault("donate.donate-roulette.main.8d917ea6037e6d3df05dc820e17121fa"), 0.015),
            new Rarity(RarityType.LEGENDARY, langStringDefault("donate.donate-roulette.main.b03fd6882f41a6b153ec63d271356ffb"), 0.0010),
        ]
    ],
    [
        RouletteType.PREMIUM,
        [
            new Rarity(RarityType.COMMON, langStringDefault("donate.donate-roulette.main.a5b4cec8a785a7df838df408e83b2236"), 0.42),
            new Rarity(RarityType.RARE, langStringDefault("donate.donate-roulette.main.74faa31c67219adcbd996e45180934b7"), 0.28),
            new Rarity(RarityType.UNIQUE, langStringDefault("donate.donate-roulette.main.47be7602c753d56ad5d1931d272066f9"), 0.19),
            new Rarity(RarityType.SPECIAL, langStringDefault("donate.donate-roulette.main.e8c8ecab4592fd19f0074e4964196b73"), 0.015),
            new Rarity(RarityType.LEGENDARY, langStringDefault("donate.donate-roulette.main.6be32c26986edb190723813a81fa860f"), 0.0010),
        ]
    ],
    [
        RouletteType.LUXE,
        [
            new Rarity(RarityType.COMMON, langStringDefault("donate.donate-roulette.main.210d2c9be8dc43ef633da2d67c7ba6bf"), 0.42),
            new Rarity(RarityType.RARE, langStringDefault("donate.donate-roulette.main.595b12040c8526c8fcff9fa56204aab9"), 0.28),
            new Rarity(RarityType.UNIQUE, langStringDefault("donate.donate-roulette.main.6de2c01cac980b33c48207016922729e"), 0.19),
            new Rarity(RarityType.SPECIAL, langStringDefault("donate.donate-roulette.main.5ac15c3b1235e1a56ab8d3719f2d9417"), 0.015),
            new Rarity(RarityType.LEGENDARY, langStringDefault("donate.donate-roulette.main.0669d09e74fbfad083d918e29d1031ed"), 0.0010),
        ]
    ]
]);