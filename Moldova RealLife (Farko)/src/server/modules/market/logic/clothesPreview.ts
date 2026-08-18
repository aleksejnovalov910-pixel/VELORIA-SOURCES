import { langStringDefault } from "../../../../shared/lang";
import {CustomEvent} from "../../custom.event";
import {getTentById} from "../TradeTent";
import {marketItemsDb} from "../marketItemsDb";
import {dress} from "../../customization";
import {CLOTH_VARIATION_ID_MULTIPLER} from "../../../../shared/cloth";
import {inventory} from "../../inventory";

CustomEvent.registerCef("market::clothPreview", (player: PlayerMp, tentId: number, itemId: number) => {
    const tent = getTentById(tentId);
    if (!tent) {
        return player.user.setGui(null);
    }

    const item = inventory.get(itemId);

    if (!item) {
        player.notify(player.user.LangString("clothesPreview.59339c53f53de1ea141cfb2356ec2e46"), "error");
        return player.user.setGui(null);
    }

    let dressId = item.advancedNumber;
    let variation = 0;
    if (dressId >= CLOTH_VARIATION_ID_MULTIPLER) {
        variation = Math.floor(dressId / CLOTH_VARIATION_ID_MULTIPLER);
        dressId = dressId % CLOTH_VARIATION_ID_MULTIPLER;
    }

    const dressConfig = dress.get(dressId);

    if (dressConfig.male !== player.user.is_male) {
        return player.notify(player.user.LangString("clothesPreview.931b59b1ae231fba08cb79ee6cb8e2c5", dressConfig.male ? player.user.LangString("clothesPreview.0c43ac6fcb4191083d6e77ed44fd2903") : player.user.LangString("clothesPreview.b7b27d29057c0ed51e79504997f4ba82")), "error");
    }

    (dressConfig as any).data[variation].forEach((data: any) => {
        player.user.setDress(data.component, data.drawable, data.texture);
    });
});

CustomEvent.registerClient("market:closed", (player) => {
    player.user.reloadSkin();
});

