import { langStringDefault } from "../../../shared/lang";
import {getPlayerTent, TradeTent} from "./TradeTent";
import {colshapeHandle, colshapes} from "../checkpoints";
import {ScaleformTextMp} from "../scaleform.mp";
import {menu} from "../menu";
import {systemUtil} from "../../../shared/system";
import {NpcSeller} from "./sellers/NpcSeller";
import {PlayerSeller} from "./sellers/PlayerSeller";
import {BlackViewStrategy} from "./viewStrategy/BlackViewStrategy";
import {CommonViewStrategy} from "./viewStrategy/CommonViewStrategy";
import {RentTimer} from "./RentTimer";
import {
    RENT_BLACK_TENT_COST,
    RENT_COMMON_TENT_COST,
    RENT_TICK_MINUTES, START_RENT_BLACK_TENT_COST,
    START_RENT_COMMON_TENT_COST
} from "../../../shared/market/config";

export class TentSpot {
    private tent: TradeTent = null;
    private rentColshape: colshapeHandle;
    private rentScaleform: ScaleformTextMp;

    public constructor(
        private readonly position: Vector3Mp,
        private readonly heading: number,
        private readonly isBlackMarket: boolean
    ) {
        this.createRentEntities();
    }

    private createRentEntities() {
        const colshapePosition = new mp.Vector3(this.position.x, this.position.y, this.position.z - 0.95);
        this.rentColshape = colshapes.new(colshapePosition, player => player?.user?.LangString("TentSpot.0d3cbbb9de6933a3a2419f011ca93020") ?? langStringDefault("TentSpot.0d3cbbb9de6933a3a2419f011ca93020"), this.rentTent.bind(this), {
            type: 27,
            color: this.isBlackMarket ? [0, 0, 0, 200] : [33, 150, 243, 200]
        });

        this.rentScaleform = new ScaleformTextMp(this.position, langStringDefault("TentSpot.f5659522f9c47a54246662d09a311c81"));
    }

    private destroyRentEntities() {
        this.rentScaleform.destroy();
        this.rentColshape.destroy();
    }

    private handleTentDestroy() {
        this.createRentEntities();
        this.tent = null;
    }

    private async rentTent(player: PlayerMp) {
        if (getPlayerTent(player)) {
            return player.notify(player.user.LangString("TentSpot.a3a90512d92982f0140696d46cad6873"), "error");
        }

        // TODO: Выбор времени аренды (до 5 часов)
        const rentTicksAmount = 30 / RENT_TICK_MINUTES;

        const rentCost = this.isBlackMarket
            ? rentTicksAmount * RENT_BLACK_TENT_COST + START_RENT_BLACK_TENT_COST
            : rentTicksAmount * RENT_COMMON_TENT_COST + START_RENT_COMMON_TENT_COST;

        const isSellerNpc = await menu.accept(player,
            player.user.LangString("TentSpot.e8d5d5e5edb2ccd9b557945f8de46c9a"),
            "big", 30000, player.user.LangString("TentSpot.b755c9fe21947ecd6527f9a330c3db8a"), player.user.LangString("TentSpot.09f010d5692a19f64cd9b193cc08d6ff")
        );

        const isPaymentSuccess = await player.user.tryPayment(rentCost, "all",
            () => this.tent === null, player.user.LangString("TentSpot.b7923e0167b8fb2c9697049029733628"), player.user.LangString("TentSpot.97422f2852b91575a0ad6f72bb279069"));

        if (!isPaymentSuccess) {
            return;
        }

        this.destroyRentEntities();

        const seller = isSellerNpc
            ? new NpcSeller(this.position, this.heading)
            : new PlayerSeller(this.position, player);

        this.tent = new TradeTent(player, this.position, seller,
            this.isBlackMarket ? RENT_BLACK_TENT_COST : RENT_COMMON_TENT_COST,
            new RentTimer(rentTicksAmount * RENT_TICK_MINUTES * 60),
            this.handleTentDestroy.bind(this),
        );

        this.tent.viewStrategy = this.isBlackMarket
            ? new BlackViewStrategy(this.tent)
            : new CommonViewStrategy(this.tent);

        player.notify(player.user.LangString("TentSpot.e00d2b58c9cd79efb7c9bb35a2e6bf15"), "success");
    }
}