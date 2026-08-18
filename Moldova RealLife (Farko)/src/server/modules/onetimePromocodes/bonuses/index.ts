import { langStringDefault } from "../../../../shared/lang";
import {CoinsBonus} from "./CoinsBonus";
import {MoneyBonus} from "./MoneyBonus";
import {IBonus} from "./IBonus";

interface Bonuses {
    types: { type: string, name: string, bonus: IBonus<any> }[]
}

export const promocodeBonuses: Bonuses = {
    types: [
        { type: "coins", name: langStringDefault("index.beab92315586d6de2ec13aa55bac6e52"), bonus: new CoinsBonus() },
        { type: "money", name: langStringDefault("index.c907db4e2a556ce2c1eb8a2166ecc4ff"), bonus: new MoneyBonus() }
    ]
}
