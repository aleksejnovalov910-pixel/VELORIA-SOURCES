import { LangString } from "../../modules/lang";
export type ClothesType = {
  name: string;
  types:Array<number>
}


const personage = {
  face: [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44],
    [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45],
  ],
  clothes:[
    { name:LangString("components.Personage.config.f4253c34b68a360cc4504a44c9d195b2"), types:[0, 1, 2], category: 3},
    { name: LangString("components.Personage.config.1b37824e516ce1ad95fe50ee11d20df5"), types: [0, 1, 2], category: 4 },
    { name: LangString("components.Personage.config.97ca1a084d7bd6647a304c6234457c76"), types: [0, 1, 2], category: 6 }
  ],
  fathers: [
    LangString("components.Personage.config.a7087aade0f618e1f5884f36ab21e2bc"),
    LangString("components.Personage.config.2afcb2d0b1f47c22bf701b626668b709"),
    LangString("components.Personage.config.4c3587d9f14113ac074eeaf91bc3d91d"),
    LangString("components.Personage.config.85f1e2615c9acbee77b4ddc74ad984f0"),
    LangString("components.Personage.config.2a85a1abeb082c614c64c07e9db6657a"),
    LangString("components.Personage.config.fb1d4960689a993994a55d722a8ca44d"),
    LangString("components.Personage.config.d09133c90eab692d6523e506865e6cbc"),
    LangString("components.Personage.config.d7096d16f8325790b33e0e91c0245046"),
    LangString("components.Personage.config.a1834a6adece1b4bfcd1b32af069666c"),
    LangString("components.Personage.config.b6efa921381648b38502d48ecd1147d0"),
    LangString("components.Personage.config.7919c1589a79d610628c7136874a1304"),
    LangString("components.Personage.config.aa78788a136ab0fdee8e4318746ffc32"),
    LangString("components.Personage.config.b1d7457f8a49e192b7ae25b061579beb"),
    LangString("components.Personage.config.85793b53796bd13f835df18d3329cf0a"),
    LangString("components.Personage.config.a39b09d31562d5e713bd52aa0c679dcd"),
    LangString("components.Personage.config.ecabaa1431bf76721330401e3515a5fe"),
    LangString("components.Personage.config.12143c39014561e1e52b495a24cfbe3d"),
    LangString("components.Personage.config.a437fd92da670281ea8fd5673c4d9680"),
    LangString("components.Personage.config.f820a2ce7ef05971d05f96677b8fc5e9"),
    LangString("components.Personage.config.841d27b2d51bddf1912cc5cc1ba85fca"),
    LangString("components.Personage.config.62543a26521474fc2a9a3f741f179f2f"),
    LangString("components.Personage.config.a989279c7987361124f4ba091bfce7e4"),
    LangString("components.Personage.config.230214b87d3fd284812b71d6c4b641da"),
    LangString("components.Personage.config.ee532acf2a9ab0752d9dc6f30882e53e"),
  ],
  mothers: [
    LangString("components.Personage.config.d2d020383646b82d6d98f93abe185559"),
    LangString("components.Personage.config.38a3a2be84e979c0093192f4d0352e54"),
    LangString("components.Personage.config.32fee1279f008bb4d99acd4fd7511294"),
    LangString("components.Personage.config.2ec2e9ec36f915597174e96086eaf3f9"),
    LangString("components.Personage.config.d9780206c39243d6c6b6cf13f097c934"),
    LangString("components.Personage.config.461f7a13c0eb31277af021349fe98313"),
    LangString("components.Personage.config.26991fe32181cc8e592eb5e69b3275cd"),
    LangString("components.Personage.config.a83632d70ad563b69199287ca9f5a262"),
    LangString("components.Personage.config.74b980651883c0fa0a6ad5904c15ddfe"),
    LangString("components.Personage.config.54afc500c48d88da6c66827763fa612c"),
    LangString("components.Personage.config.7359b54c30725a8105141216573e1425"),
    LangString("components.Personage.config.c73ac8205633e0747b99c6357a3c9bae"),
    LangString("components.Personage.config.906aef611397fbca25b0e3c5d4a9a6b6"),
    LangString("components.Personage.config.3301796587ff1a91626c4f53684da04c"),
    LangString("components.Personage.config.f58ba93a618d41c6e258559544d85fce"),
    LangString("components.Personage.config.3486fd982a52bd476214c595803a68c9"),
    LangString("components.Personage.config.66c815b6bfb671b09cdcd22ae13316bf"),
    LangString("components.Personage.config.bda502bbb7e62f185ef493db6fa21a12"),
    LangString("components.Personage.config.85c4f285aafa9ada0bfa255cd92ddf55"),
    LangString("components.Personage.config.3a1f062004f1f59658d8a170efdd5540"),
    LangString("components.Personage.config.a45adfd1ad3278eb52b72d310b7bfc86"),
    LangString("components.Personage.config.40d4ea40f58d9cb9d5f8053f627bda01"),
  ],
  features: [
    LangString("components.Personage.config.65f540759f5ff10c2490bbde635e9642"),
    LangString("components.Personage.config.d17c27eeb4225aacb1c4130888bd592f"),
    LangString("components.Personage.config.be3cbc947024a81d3d8a9009895642bd"),
    LangString("components.Personage.config.60cecbe7a053c91069b79e6d1aae76be"),
    LangString("components.Personage.config.30c9d8b6f8adf7003d56c78b5204835c"),
    LangString("components.Personage.config.74432bea69917fcb4b47982a59e12f23"),
    LangString("components.Personage.config.2ca5188d01189fc6b09a36e1cbadd207"),
    LangString("components.Personage.config.2e46a91638fb0630b2c5aede73951ef2"),
    LangString("components.Personage.config.4127fc3b26b5ceda44d2c9a4de88ba6b"),
    LangString("components.Personage.config.978d205eeaff0a8003063af4212c9e57"),
    LangString("components.Personage.config.90aa66466c26a2d5c1528650e40ba8ba"),
    LangString("components.Personage.config.a320def7c8b7ac13ca84f333025b1ce7"),
    LangString("components.Personage.config.01fb076516fad236da58ee4859daeabc"),
    LangString("components.Personage.config.35ec5ada3a8c0d543aadff54ea66ce39"),
    LangString("components.Personage.config.3e492cc06d2a54e3b885cfd9da0c7329"),
    LangString("components.Personage.config.139971d5a2e702c7f8182d5038f693ef"),
    LangString("components.Personage.config.33a3dd49274c317b96882293ab220706"),
    LangString("components.Personage.config.10a4cb992041dd6f9625df187cac7a0b"),
    LangString("components.Personage.config.5bb548de362cd3aa6559993437c2ee86"),
    LangString("components.Personage.config.866e34369cfb09514b92e0dc2dbe3e37"),
  ],
  hair: [
    [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      24,
      31,
      32,
      34,
      35,
      36,
      39,
      52,
      53,
      54,
      55,
      56,
      57,
      59,
      67,
      68,
      69,
      70,
      71,
      72,
      73,
      74
      // 75
      // 76,
      // 77,
      // 78,
      // 79,
      // 80,
      // 81,
      // 82,
      // 83,
      // 84,
      // 85,
      // 86,
      // 87,
      // 88,
      // 89,
      // 90,
      // 91,
      // 92,
      // 93,
      // 94,
      // 95,
      // 96,
      // 97,
      // 98,
      // 99,
      // 100,
      // 101,
      // 102,
      // 103,
      // 106,
      // 107,
      // 108,
      // 109,
      // 110,
      // 111
    ],
    [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      53,
      76
    ],
  ],
  hairColor: 30,
  hairColor2: 30,
  eyebrows: 34,
  eyebrowsColor: 25,
  freckles: 10,
  frecklesColor: 5,
  beard: 22,
  beardColor: 25,
  pomade: 10,
  pomadeColor: 60,
  blush: 7,
  blushColor: 60,
  makeup: 74,
  makeupColor: 10,
  eyeColor: 31,
  lips: 9,
};
export default personage;
export const colors = ["rgb(32, 31, 28)", "rgb(50, 42, 37)", "rgb(79, 58, 47)", "rgb(96, 52, 33)", "rgb(130, 63, 35)", "rgb(137, 59, 30)", "rgb(157, 82, 47)", "rgb(167, 103, 65)", "rgb(170, 113, 74)", "rgb(177, 126, 85)", "rgb(187, 139, 92)", "rgb(200, 160, 105)", "rgb(208, 171, 116)", "rgb(203, 155, 88)", "rgb(228, 186, 116)", "rgb(233, 195, 132)", "rgb(196, 146, 94)", "rgb(169, 93, 61)", "rgb(152, 56, 38)", "rgb(122, 18, 16)", "rgb(147, 21, 17)", "rgb(171, 29, 21)", "rgb(199, 51, 28)", "rgb(213, 65, 29)", "rgb(193, 87, 51)", "rgb(219, 88, 38)", "rgb(155, 129, 111)", "rgb(181, 155, 134)", "rgb(214, 191, 171)", "rgb(233, 212, 194)", "rgb(103, 69, 85)", "rgb(145, 90, 115)", "rgb(156, 62, 92)", "rgb(249, 71, 207)", "rgb(253, 71, 146)", "rgb(252, 167, 179)", "rgb(19, 165, 150)", "rgb(9, 131, 144)", "rgb(9, 75, 117)", "rgb(105, 174, 98)", "rgb(48, 140, 93)", "rgb(27, 93, 80)", "rgb(167, 180, 42)", "rgb(158, 188, 20)", "rgb(100, 175, 34)", "rgb(238, 196, 90)", "rgb(246, 199, 13)", "rgb(244, 162, 14)", "rgb(252, 141, 22)", "rgb(254, 131, 32)", "rgb(254, 116, 32)", "rgb(248, 89, 34)", "rgb(243, 49, 15)", "rgb(210, 12, 15)", "rgb(129, 10, 14)", "rgb(42, 27, 21)", "rgb(63, 36, 29)", "rgb(85, 46, 31)", "rgb(64, 34, 25)", "rgb(68, 36, 26)", "rgb(50, 33, 26)", "rgb(8, 10, 14)", "rgb(196, 162, 118)", "rgb(226, 189, 144)"];


export const EYE_COLORS = [
    "rgba(0, 128, 0, 1)", // Зеленый (Green)
  "rgba(0, 201, 87, 1)", // Изумрудный (Emerald)
  "rgba(135, 206, 235, 1)", // Голубой (Sky Blue)
  "rgba(0, 0, 255, 1)", // Синий (Blue)
  "rgba(181, 101, 29, 1)", // Светлый шатен (Light Brown)
  "rgba(101, 67, 33, 1)", // Темно-коричневый (Dark Brown)
  "rgba(139, 69, 19, 1)", // Карий (Hazel)
  "rgba(105, 105, 105, 1)", // Темно-серый (Dark Gray)
  "rgba(192, 192, 192, 1)", // Светло-серый (Light Gray)
  "rgba(255, 105, 180, 1)", // Розовый (Pink)
  "rgba(255, 255, 0, 1)", // Желтый (Yellow)
  "rgba(128, 0, 128, 1)", // Фиолетовый (Purple)
  "rgba(0, 0, 0, 0.8)", // Затемнение (Black, semi-transparent for darkening)
  "rgba(128, 128, 128, 1)", // Оттенки серого (Gray)
  "rgba(255, 99, 71, 1)", // Текила-санрайз (Tomato, warm gradient-inspired)
  "rgba(255, 165, 0, 1)", // Atomic (Orange, vibrant)
  "rgba(148, 0, 211, 1)", // Искажение (Dark Violet, distortion-inspired)
  "rgba(255, 0, 0, 1)", // ECola (Red, brand-inspired)
  "rgba(0, 255, 255, 1)", // Космический рейнджер (Cyan, space-themed)
  "rgba(255, 255, 255, 1)", // Инь-ян (White, balance-inspired)
  "rgba(255, 69, 0, 1)", // Мишень (Red-Orange, target-inspired)
  "rgba(50, 205, 50, 1)", // Ящерица (Lime Green, lizard-inspired)
  "rgba(255, 140, 0, 1)", // Дракон (Dark Orange, dragon-inspired)
  "rgba(127, 255, 0, 1)", // Инопланетянин (Chartreuse, alien-inspired)
  "rgba(139, 69, 19, 1)", // Козел (Brown, goat-inspired)
  "rgba(255, 255, 102, 1)", // Смайлик (Light Yellow, smiley-inspired)
  "rgba(75, 0, 130, 1)", // Одержимый (Indigo, possessed-inspired)
  "rgba(178, 34, 34, 1)", // Демон (Firebrick, demon-inspired)
  "rgba(0, 100, 0, 1)", // Зараженный (Dark Green, infected-inspired)
  "rgba(173, 216, 230, 1)", // Пришелец (Light Blue, alien-inspired)
  "rgba(245, 245, 220, 1)", // Нежить (Beige, undead-inspired)
  "rgba(128, 128, 128, 1)" // Зомби (Gray, zombie-inspired)
];

export const Ranges = {
  age: [ 18, 80],
  face:[ [ 0, personage.face[0].length ] , [ 0, personage.face[1].length ] ],
  hair:[ [ 0, personage.hair[0].length ] , [ 0, personage.hair[1].length ] ],
  skin: [ 0.0, 0.99 ],
  heredity: [0.0, 0.99 ],
  features: [-1.0, 1.0 ],
  colors: [0, colors.length],

  opacity: [ 0.1, 0.9 ], 
  eyebrows: [0, personage.eyebrows],
  freckles: [0, personage.freckles],
  beard: [0, personage.beard]
}
