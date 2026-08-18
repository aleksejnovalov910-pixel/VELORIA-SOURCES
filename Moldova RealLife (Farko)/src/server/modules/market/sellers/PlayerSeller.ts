import { langStringDefault } from "../../../../shared/lang";
import {ISeller} from "./ISeller";
import {CustomEvent} from "../../custom.event";

export class PlayerSeller implements ISeller {
    public constructor(
        private readonly position: Vector3Mp,
        private readonly player: PlayerMp
    ) {
        player.notify(player.user.LangString("PlayerSeller.758dcd1b338e1148c947aafd69bfafeb"), "info");

        CustomEvent.triggerClient(player, "market:setSellerPosition", this.position);
    }

    public destroy(isTentDestroyed: boolean): void {
        CustomEvent.triggerClient(this.player, "market:setSellerPosition", null);
    }

    public makePayment(money: number): void {
        return;
    }

    public getSellsPercent(): number {
        return 0;
    }

    public callToTent(caller: PlayerMp): void {
        CustomEvent.triggerClient(this.player, "market:calledByCop");
        caller.notify(caller.user.LangString("PlayerSeller.e96855c3b6d3d9e4d63de987674b88d6"));
    }
}