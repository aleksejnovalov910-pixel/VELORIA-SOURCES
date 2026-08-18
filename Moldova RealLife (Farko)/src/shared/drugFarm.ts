

// Allowed fractions for the drug system
export const ALLOWED_DRUG_FACTIONS = [18, 19 ,20 ,21 ,22 ,23 ,24 ,25];

// Coordinates for chemical barrels
export const METAPHETAMIN_SPAWN_COORDS = [
  { x: 4367.62, y: -4349.17, z: 1.4, h: 0 },
  { x: 4365.39, y: -4344.23, z: 1.33, h: 25 },
  { x: 4360.47, y: -4334.81, z: 1.33, h: 33 },
  { x: 4354.54, y: -4327.19, z: 1.4, h: 38 },
  { x: 4350.91, y: -4322.21, z: 1.45, h: 54 },
  { x: 4334.20, y: -4307.45, z: 1.47, h: 45 },
  { x: 4283.06, y: -4293.41, z: 3.60, h: 114 },
  { x: 4269.57, y: -4294.31, z: 4.47, h: 95 },
  { x: 4248.47, y: -4303.95, z: 7.01, h: 134 },
  { x: 4239.48, y: -4314.21, z: 9.36, h: 146 },
  { x: 4320.52, y: -4291.39, z: 1.45, h: 41 },
  { x: 4229.05, y: -4327.02, z: 9.65, h: 133 },
  { x: 4226.24, y: -4336.39, z: 10.94, h: 186 },
  { x: 4299.97, y: -4287.81, z: 2.15, h: 96 },
  { x: 4203.93, y: -4348.62, z: 6.16, h: 111 },
  { x: 4189.87, y: -4359.31, z: 3.24, h: 157 },
  { x: 4180.90, y: -4370.31, z: 2.11, h: 136 },
  { x: 4174.04, y: -4380.29, z: 1.84, h: 150 },
  { x: 4162.97, y: -4397.60, z: 1.55, h: 145 },
  { x: 4160.83, y: -4417.63, z: 2.92, h: 197 },
  { x: 4159.22, y: -4428.27, z: 2.51, h: 170 }

];

// Name of the prop for chemical barrels
export const METAPHEMATIN_PROP_NAME = "prop_barrel_exp_01a";

// Chemical barrel recovery time (5-10 minutes)
export const METAPHEMATIN_RESET_TIME_MIN = 1000 * 60 * 5;
export const METAPHEMATIN_RESET_TIME_MAX = 1000 * 60 * 10;

// Chemical collection time (10 seconds)
export const METAPHEMATIN_COLLECTION_TIME = 1000 * 10;

// Time for cultivation (0.5 min)
export const DRUG_CULTIVATION_TIME = 1000 * 60 * 0.5;

export const DRUG_ITEMS = {
  WEED_SEED: "seminta_iarba",
  COCA_SEED: "seminta_coca",
  
  WEED_LEAVES: "frunze_iarba",
  COCA_LEAVES: "frunze_coca",
  
  SCISSORS: "foarfeca",
  CHEMICALS: "chemicals"
};

export const DRUG_PROPS = {
  WEED_PLANT: "prop_weed_01",
  COCA_PLANT: "prop_plant_cane_02b"
};

export const DRUG_ANIMATIONS = {
  COLLECT_CHEMICALS: {
    dict: "amb@world_human_gardener_plant@male@base",
    name: "base",
    flag: 1
  },
  HARVEST_PLANT: {
    dict: "amb@world_human_gardener_plant@male@base",
    name: "base",
    flag: 1
  }
};