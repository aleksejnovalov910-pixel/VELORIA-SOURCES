import { langStringDefault } from "../../../../shared/lang";
import {CustomEvent} from "../../custom.event";
import {getPlayerTent} from "../TradeTent";
import {getMarketRentCompensation, RENT_COMMON_TENT_COST, RENT_TICK_MINUTES} from "../../../../shared/market/config";
import {menu} from "../../menu";
import {systemUtil} from "../../../../shared/system";

CustomEvent.registerCef("market::finishRent", async (player) => {
    player.user.setGui(null);
    const tent = getPlayerTent(player);
    if (!tent) {
        return;
    }

    const compensation = getMarketRentCompensation(tent.timeLeftS);
    const playerAnswer = await menu.accept(player,
        player.user.LangString("rentLogic.134cf8390131dbfd4cd1e6eaf2922ffd", systemUtil.numberFormat(compensation)));

    if (!playerAnswer || !tent.exists) {
        return;
    }

    tent.destroy();
    player.user.addMoney(compensation, true, player.user.LangString("rentLogic.2c7c216de688133071af5a1d7331cc24"));
    player.notify(player.user.LangString("rentLogic.da478ec5b4e4a48cceed670a4bcb5780"), "success");
});

CustomEvent.registerCef("market::expandRent", async (player, expandTimeMin: number) => {
    player.user.setGui(null);
    const tent = getPlayerTent(player);
    if (!tent) {
        return;
    }

    const expandRentCost = expandTimeMin / RENT_TICK_MINUTES * RENT_COMMON_TENT_COST;
    const isPaymentSuccess = await player.user.tryPayment(expandRentCost, "all",
        () => tent.exists, player.user.LangString("rentLogic.e2eea9f9d8b773ebe6e0dd46a95837b0"), player.user.LangString("rentLogic.edb7610fb8f26c36212ec0c728ac1ceb"));

    if (!isPaymentSuccess) {
        return;
    }

    tent.expandRentTime(expandTimeMin * 60);
    player.notify(player.user.LangString("rentLogic.f936769444e27a9c098a191491a5a26a", expandTimeMin), "success");
});
