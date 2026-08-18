import { langStringDefault } from "../../../../../shared/lang";
import {QuestReward} from "../../../advancedQuests/interfaces/questReward";

export class LollipopsReward extends QuestReward {
    private readonly _lollipopsAmount: number;

    constructor(lollipopsAmount: number) {
        super();

        this._lollipopsAmount = lollipopsAmount;
    }

    async giveReward(player: PlayerMp): Promise<void> {
        player.user.giveLollipops(this._lollipopsAmount);
        player.user.log("lollipops", langStringDefault("lollipopsReward.fe4a24e59723f803726c7ace3799609f", this._lollipopsAmount));
    }
}