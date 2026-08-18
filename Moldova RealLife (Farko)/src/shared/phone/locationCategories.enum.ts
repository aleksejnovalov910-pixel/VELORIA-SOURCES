import { langStringDefault } from "../lang/index";
export enum LocationCategoryEnum {
  // Jobs = "Работы",
  //Mafia = "Мафии",
  Weapons_Shop = langStringDefault("phone.locationCategories.enum.b76a3213b1ed29427d43e759bc85412d") as any,
  Clothing_Store = langStringDefault("phone.locationCategories.enum.5609075b385537cbbd2c91c31db49b00") as any,
  Shop_24_7 = langStringDefault("phone.locationCategories.enum.38c8f77f5228a8f2e4c99f97848855cf") as any,
  Banks = langStringDefault("phone.locationCategories.enum.36bd9f9ea15b82040f406d690a4df130") as any,
  Refueling = langStringDefault("phone.locationCategories.enum.279ab23d0b91698a7b96f88c6551077b") as any,
  Car_Showroom = langStringDefault("phone.locationCategories.enum.743ff0b7f78b435a381c5c8d639398ab") as any,
  // Gangs = langStringDefault("phone.locationCategories.enum.9bcac085c1935083cf93150b77f0b7a1") as any,
  Car_Wash = langStringDefault("phone.locationCategories.enum.b825dd7e76d3ad8af40b6a915b9d86f6") as any,
  Rentals = langStringDefault("phone.locationCategories.enum.f604dce0cf53341bf51ce2ad830c07db") as any,
  Pharmacy = langStringDefault("phone.locationCategories.enum.6291add31ddd11822959284555911326") as any,
  Clubs = langStringDefault("phone.locationCategories.enum.9e31ac1406cbfb1aa4fe54407547d90f") as any,
  Burgers = langStringDefault("phone.locationCategories.enum.aa6288eeed51153fd1285cfac4110e91") as any,
  ATM = langStringDefault("phone.locationCategories.enum.8ddcc6f994b256efe56ae8410c73efdd") as any,
  NPC = langStringDefault("phone.locationCategories.enum.38b8e537c99a46af1ae97876204cc7ff") as any,
  Parking = langStringDefault("phone.locationCategories.enum.5aaa5269ab7f548420105449ccec4b0a") as any,
  Licenses = langStringDefault("phone.locationCategories.enum.62207ddc43a979627bc0e7e2c045b898") as any,
  Los_Santos_Customs = langStringDefault("phone.locationCategories.enum.5225504e093ae3e932e1cc0be558399c") as any,
  Events = langStringDefault("phone.locationCategories.enum.0c5f8b7034b23b6e0ff6594512581a1c") as any,
  //State_Structures = "Гос. структуры",
}

export interface GPSPointData {
  id: number;
  category: LocationCategoryEnum;
  type: GPSPointType;
  name: string;
  distance: number;
}

export enum GPSPointType {
  Business,
  Event
}
