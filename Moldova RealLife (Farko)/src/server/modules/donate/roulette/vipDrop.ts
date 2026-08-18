import { langStringDefault } from "../../../../shared/lang";
import {DropBase} from "./dropBase";
import {VipDropData} from "../../../../shared/donate/donate-roulette/Drops/vipDrop";
import {system} from "../../system";

export class VipDrop extends DropBase {
    constructor(public readonly data: VipDropData) {
        super(data.dropId);
    }

    protected onDropActivated(player: PlayerMp): boolean {
        if (player.user.vip && player.user.vip !== this.data.vipType && system.timestamp < player.user.vip_end) {
            player.notify(player.user.LangString("vipDrop.8927d731088035db96c10e04d51c07cf"), "error")
            return false;
        }
        player.user.giveVip(this.data.vipType, this.data.days);
        player.notify(player.user.LangString("vipDrop.9d146178b1699117ca88deb2596ba8ef", this.data.vipType, this.data.days))
        player.user.save();
        
        return true;
    };
}