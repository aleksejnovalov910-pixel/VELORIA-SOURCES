import { langStringDefault } from "../../lang/index";
import {NpcParameters} from "../../../server/modules/npc";
import {AnimationData} from "../../anim";

// Первый квестовый NPC

export const NEW_YEAR_SANTA_NPC_ID = "new-year-santa";
export const NEW_YEAR_SANTA_NPC_NAME = langStringDefault("events.newYear.quests.config.d8eb85226792bcafcfa519471cd9a05f");
export const NEW_YEAR_SANTA_NPC_PARAMETERS: NpcParameters = {
    Position: new mp.Vector3(1674.40, 3684.91, 34.32),
    Heading: 5,
    Model: "s_m_y_clown_01",
    Name: NEW_YEAR_SANTA_NPC_NAME
}

// Второй квестовый NPC

export const NEW_YEAR_HARRY_NPC_ID = "new-year-harry";
export const NEW_YEAR_HARRY_NPC_NAME = langStringDefault("events.newYear.quests.config.1bfd79a2de394b911fe9bb7132083d23");
export const NEW_YEAR_HARRY_NPC_PARAMETERS: NpcParameters = {
        Position: new mp.Vector3(2220.25, 5609.61, 54.71),
        Heading: 117,
        Model: "ig_isldj_02",
        Name: NEW_YEAR_HARRY_NPC_NAME
}

// Третий квестовый NPC

export const NEW_YEAR_WORD_NPC_POSITION: Vector3Mp = new mp.Vector3(63.42, 118.50, 79.11);
export const NEW_YEAR_WORD_NPC_HEADING: number = 140;
export const NEW_YEAR_WORD_NPC_MODEL: string = "s_m_m_postal_01";
export const NEW_YEAR_WORD_NPC_NAME: string = langStringDefault("events.newYear.quests.config.6b864587a4fbc85f178f4fa862e8ea51");
export const NEW_YEAR_WORD_NPC_RANGE: number = 1.5;
export const NEW_YEAR_WORD_NPC_DIMENSION: number = 0;

// Четвертый квестовый NPC

export const NEW_YEAR_HOMELESS_NPC_ID = "new-year-marv";
export const NEW_YEAR_HOMELESS_NPC_NAME = langStringDefault("events.newYear.quests.config.6b43a5f1ea152280308ea6df792b0abb");
export const NEW_YEAR_HOMELESS_NPC_PARAMETERS: NpcParameters = {
    Position: new mp.Vector3(1099.42, -775.49, 58.35),
    Heading: 183,
    Model: "a_m_m_tramp_01",
    Name: NEW_YEAR_HOMELESS_NPC_NAME
}

// Пятый квестовый NPC

export const NEW_YEAR_SPANISH_NPC_ID = "new-year-abelardo";
export const NEW_YEAR_SPANISH_NPC_NAME = langStringDefault("events.newYear.quests.config.4c5a0f865b84117c201b7fbcf83de3b9");
export const NEW_YEAR_SPANISH_NPC_PARAMETERS: NpcParameters = {
    Position: new mp.Vector3(-1069.57, -1675.77, 4.54),
    Heading: 29,
    Model: "s_m_o_busker_01",
    Name: NEW_YEAR_SPANISH_NPC_NAME
}

// 1ый квест

export const NEW_YEAR_FIRST_QUEST_ID = "new-year-first-quest";
export const NEW_YEAR_FIRST_QUEST_NAME = langStringDefault("events.newYear.quests.config.37b8798c8bb4a1da1aefde3c0762c38b");

export const NEW_YEAR_FIRST_QUEST_COGNAC_ITEM_ID = 215;
export const NEW_YEAR_FIRST_QUEST_COGNAC_GOAL = 1;
export const NEW_YEAR_FIRST_QUEST_DONUT_ITEM_ID = 26;
export const NEW_YEAR_FIRST_QUEST_DONUT_GOAL = 1;
export const NEW_YEAR_FIRST_QUEST_COFFEE_ITEM_ID = 5;
export const NEW_YEAR_FIRST_QUEST_COFFEE_GOAL = 1;
export const NEW_YEAR_FIRST_QUEST_TREES_ITEM_ID = 7011;
export const NEW_YEAR_FIRST_QUEST_TREES_GOAL = 20;


// 2ой квест

export const NEW_YEAR_SECOND_QUEST_ID = "new-year-second-quest";
export const NEW_YEAR_SECOND_QUEST_NAME = langStringDefault("events.newYear.quests.config.25ce51f461df3563a32606db38490f96");

export const NEW_YEAR_SECOND_QUEST_BANANA_ITEM_ID = 25;
export const NEW_YEAR_SECOND_QUEST_BANANA_GOAL = 15;

export const NEW_YEAR_SECOND_QUEST_WEED_POSITION_FIRST = new mp.Vector3(2220.48, 5578.52, 52.72);
export const NEW_YEAR_SECOND_QUEST_WEED_POSITION_SECOND = new mp.Vector3(2225.49, 5578.14, 52.70);
export const NEW_YEAR_SECOND_QUEST_WEED_POSITION_THIRD = new mp.Vector3(2231.56, 5575.46, 52.80);
export const NEW_YEAR_SECOND_QUEST_WEED_POSITION_FOURTH = new mp.Vector3(2223.74, 5575.85, 52.62);

export const NEW_YEAR_SECOND_QUEST_WEED_ANIMATION_DATA: AnimationData = {
    dictionary: "anim@heists@money_grab@duffel",
    name: "loop",
    durationSec: 5
}

export const NEW_YEAR_SECOND_QUEST_WEED_HELP_TEXT = langStringDefault("events.newYear.quests.config.98690c65dde81e10f1b638543553fcd8");
export const NEW_YEAR_SECOND_QUEST_CARRY_GOAL = 2;

// 3ий квест

export const NEW_YEAR_THIRD_QUEST_ID = "new-year-third-quest";
export const NEW_YEAR_THIRD_QUEST_NAME = langStringDefault("events.newYear.quests.config.77dc8d1d9d35fcdcc6546f81f545a892");

export const NEW_YEAR_THIRD_QUEST_VALID_WORD = "dashound";
export const NEW_YEAR_THIRD_QUEST_HUD_NAME = langStringDefault("events.newYear.quests.config.fa6ee7be0d37b151a80f1221e6446bd0");

// 4ый квест

export const NEW_YEAR_FOURTH_QUEST_ID = "new-year-fourth-quest";
export const NEW_YEAR_FOURTH_QUEST_NAME = langStringDefault("events.newYear.quests.config.82785883c45717a302cf197628399966");
export const NEW_YEAR_FOURTH_QUEST_CHEESE_BURGER_ITEM_ID = 20;
export const NEW_YEAR_FOURTH_QUEST_COLA_ITEM_ID = 2;
export const NEW_YEAR_FOURTH_QUEST_CHEESE_BURGER_GOAL = 2;
export const NEW_YEAR_FOURTH_QUEST_COLA_GOAL = 2;
export const NEW_YEAR_FOURTH_QUEST_BANANA_ITEM_ID = 25;
export const NEW_YEAR_FOURTH_QUEST_BANANA_GOAL = 15;

// 5ый квест

export const NEW_YEAR_FIFTH_QUEST_ID = "new-year-fifth-quest";
export const NEW_YEAR_FIFTH_QUEST_FIRST_LINE_ID = "new-year-fifth-quest-first";
export const NEW_YEAR_FIFTH_QUEST_SECOND_LINE_ID = "new-year-fifth-quest-second";
export const NEW_YEAR_FIFTH_QUEST_NAME = langStringDefault("events.newYear.quests.config.6cee854c7a94af43d45b16f6b3b03f7c");

export const NEW_YEAR_MEGATRON_NPC_ID = "new-year-megatron";
export const NEW_YEAR_MEGATRON_NPC_NAME = langStringDefault("events.newYear.quests.config.6a95f12caf8f4d284f8efa0b5722ee30");
export const NEW_YEAR_MEGATRON_NPC_PARAMETERS: NpcParameters = {
    Position: new mp.Vector3(-420.54, 1219.48, 325.76),
    Heading: 176,
    Model: "a_m_m_genfat_02",
    Name: NEW_YEAR_MEGATRON_NPC_NAME
}


export const NEW_YEAR_BOLVANKA_NPC_ID = "new-year-bolvanka";
export const NEW_YEAR_BOLVANKA_NPC_NAME = langStringDefault("events.newYear.quests.config.c7efe25f49ad0c1e737bcc753687997d");
export const NEW_YEAR_BOLVANKA_NPC_PARAMETERS: NpcParameters = {
    Position: new mp.Vector3(722.53, 1291.67, 360.30),
    Heading: 181,
    Model: "csb_prologuedriver",
    Name: NEW_YEAR_BOLVANKA_NPC_NAME
}

export const NEW_YEAR_FIFTH_QUEST_COLLECT_POSITION: Vector3Mp = new mp.Vector3(714.02, 1285.84, 359.30);
export const NEW_YEAR_FIFTH_QUEST_COLLECT_ANIMATION_DATA: AnimationData = {
    dictionary: "missbigscore1switch_trevor_piss",
    name: langStringDefault("events.newYear.quests.config.6533b74f1b11b0b66944e8b3962ec4ca"),
    durationSec: 10
};
export const NEW_YEAR_FIFTH_QUEST_COLLECT_HELP_TEXT: string = langStringDefault("events.newYear.quests.config.cc09e199164c256be90ec77318ae8d64");

export const NEW_YEAR_FIFTH_QUEST_COLLECT_HUD_TEXT = langStringDefault("events.newYear.quests.config.a5656c0e4accc1b971e17a0fa3ae2a6a");
export const NEW_YEAR_FIFTH_QUEST_JOB_TYPE = "electrician";
export const NEW_YEAR_FIFTH_QUEST_JOB_GOAL = 30;
export const NEW_YEAR_FIFTH_QUEST_JOB_HUD_NAME = langStringDefault("events.newYear.quests.config.cb53b5d0cfa0122dac096b2403f38b20");

export const NEW_YEAR_FIFTH_QUEST_PIZZA_ITEM_ID = 24;
export const NEW_YEAR_FIFTH_QUEST_PIZZA_GOAL = 2;

export const NEW_YEAR_FIFTH_QUEST_COLA_ITEM_ID = 2;
export const NEW_YEAR_FIFTH_QUEST_COLA_GOAL = 3;

export const NEW_YEAR_FIFTH_QUEST_ENERGY_ITEM_ID = 7;
export const NEW_YEAR_FIFTH_QUEST_ENERGY_GOAL = 4;

export const NEW_YEAR_FIFTH_QUEST_SIDR_ITEM_ID = 200;
export const NEW_YEAR_FIFTH_QUEST_SIDR_GOAL = 5;

export const NEW_YEAR_FIFTH_QUEST_POTATO_ITEM_ID = 7000;
export const NEW_YEAR_FIFTH_QUEST_POTATO_GOAL = 15;

export const NEW_YEAR_FIFTH_QUEST_TOMATO_ITEM_ID = 7022;
export const NEW_YEAR_FIFTH_QUEST_TOMATO_GOAL = 10;

// 6ой квест

export const NEW_YEAR_SIXTH_QUEST_ID = "new-year-sixth-quest";
export const NEW_YEAR_SIXTH_QUEST_NAME = langStringDefault("events.newYear.quests.config.52d58d97dd2d990b3609264d13c69c81");

export const NEW_YEAR_SIXTH_QUEST_COLLECT_POSITION: Vector3Mp = new mp.Vector3(-744.67, 4323.64, 140.35);
export const NEW_YEAR_SIXTH_QUEST_COLLECT_ANIMATION: AnimationData = {
    dictionary: "anim@amb@business@bgen@bgen_no_work@",
    name: langStringDefault("events.newYear.quests.config.74317970cf93953ae26a5643611568d3"),
    durationSec: 5
}
export const NEW_YEAR_SIXTH_QUEST_COLLECT_HUD_TEXT = langStringDefault("events.newYear.quests.config.d566a1600409dfe5992873fb3fc2f5ab");
export const NEW_YEAR_SIXTH_QUEST_HUNT_ITEM_ID = 830;
export const NEW_YEAR_SIXTH_QUEST_HUNT_GOAL = 5;

export const NEW_YEAR_SIXTH_QUEST_JOB_TYPE = "busman:way";
export const NEW_YEAR_SIXTH_QUEST_JOB_GOAL = 4;
export const NEW_YEAR_SIXTH_QUEST_JOB_HUD_NAME = langStringDefault("events.newYear.quests.config.2767363cdc78ce5bb1b0c1aad248c92c");
export const NEW_YEAR_SIXTH_QUEST_LEAVE_JOB_TYPE = "busman";
export const NEW_YEAR_SIXTH_QUEST_LEAVE_JOB_TEXT = langStringDefault("events.newYear.quests.config.597dc5794c6a3fb6cf1fbbe3d9f1bbd7");

export const NEW_YEAR_SIXTH_QUEST_WORD_TEXT = "galileo";
export const NEW_YEAR_SIXTH_QUEST_HUD_NAME = langStringDefault("events.newYear.quests.config.c4642604be1ca21933e6f3938db5390e");


export const NEW_YEAR_ARIEL_NPC_ID = "new-year-ariel";
export const NEW_YEAR_ARIEL_NPC_NAME = langStringDefault("events.newYear.quests.config.45702d19285c33068efb6a6444a72b0f");
export const NEW_YEAR_ARIEL_NPC_PARAMETERS: NpcParameters = {
    Position: new mp.Vector3(-747.22, 4323.73, 141.70),
    Heading: 305,
    Model: "a_f_m_bodybuild_01",
    Name: NEW_YEAR_ARIEL_NPC_NAME
}

export const NEW_YEAR_GALILEO_NPC_POSITION: Vector3Mp = new mp.Vector3(-601.17, 2091.22, 131.50);
export const NEW_YEAR_GALILEO_NPC_HEADING: number = 351;
export const NEW_YEAR_GALILEO_NPC_MODEL: string = "mp_m_counterfeit_01";
export const NEW_YEAR_GALILEO_NPC_NAME: string = langStringDefault("events.newYear.quests.config.63c10b38b97e3d3465237a805b443f49");
export const NEW_YEAR_GALILEO_NPC_RANGE: number = 1.5;
export const NEW_YEAR_GALILEO_NPC_DIMENSION: number = 0;

export const NEW_YEAR_FIRST_QUEST_REWARD_LOLLIPOPS = 1000;
export const NEW_YEAR_SECOND_QUEST_REWARD_LOLLIPOPS = 1500;
export const NEW_YEAR_THIRD_QUEST_REWARD_LOLLIPOPS = 1700;
export const NEW_YEAR_FOURTH_QUEST_REWARD_LOLLIPOPS = 2000;

export const NEW_YEAR_FIFTH_QUEST_REWARD_LOLLIPOPS = 500;
export const NEW_YEAR_FIFTH_QUEST_FIRST_LINE_REWARD_LOLLIPOPS = 1500;
export const NEW_YEAR_FIFTH_QUEST_SECOND_LINE_REWARD_LOLLIPOPS = 1500;

export const NEW_YEAR_SIXTH_QUEST_REWARD_LOLLIPOPS = 2500;
export const NEW_YEAR_SIXTH_QUEST_REWARD_ITEM_ID = 888;