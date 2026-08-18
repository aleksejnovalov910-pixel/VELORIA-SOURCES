import { langStringDefault } from "../../../../shared/lang";
import {CustomEvent} from "../../custom.event";
import {getTentById} from "../TradeTent";
import {marketItemsDb} from "../marketItemsDb";
import {inventoryShared, OWNER_TYPES} from "../../../../shared/inventory";
import {inventory} from "../../inventory";
import {MarketItemEntity} from "../../typeorm/entities/marketItem";
import {ItemEntity} from "../../typeorm/entities/inventory";

CustomEvent.registerCef("market::purchase", async (player, tentId: number, itemId: number, amount: number) => {
    const tent = getTentById(tentId);
    if (!tent) {
        return player.user.setGui(null);
    }

    const marketItem = marketItemsDb.getBySeller(tent.owner)
        .find(entity => entity.itemId === itemId);

    if (!getItemAmountAvailable(marketItem, amount)) {
        player.notify(player.user.LangString("purchaseLogic.3d48e8125a4f2a6e0f3ffb94b2cb512b"), "error")
        await tent.openMarket(player);
        return;
    }

    const itemConfig = inventoryShared.get(marketItem.item.item_id);
    const isPlayerCanTakeItem = player.user.canTakeItem(itemConfig.item_id, amount, amount);
    if (!isPlayerCanTakeItem) {
        return player.notify(player.user.LangString("purchaseLogic.04058c1dcacdaacc650f9a9455427a70"), "error");
    }

    const totalPrice = marketItem.price * amount;
    if (player.user.money < totalPrice || !player.user.removeMoney(totalPrice, true,
        player.user.LangString("purchaseLogic.f6b057f589ca34bc0cb8daf5ab6e7c72", itemConfig.item_id, amount))) {
        return player.notify(player.user.LangString("purchaseLogic.5276eb320e36d5d542a2d7604a6d6439"), "error");
    }

    tent.addMoney(totalPrice, marketItem.item, amount, player.user.name);

    if (itemConfig.canSplit) {
        marketItem.item.count -= amount;
        player.user.giveItem({
            item_id: marketItem.item.item_id,
            count: amount
        });

        if (marketItem.item.count <= 0) {
            inventory.deleteItem(marketItem.item);
            marketItemsDb.delete(marketItem);
        }

    } else {
        inventory.updateItemOwner(marketItem.item, OWNER_TYPES.PLAYER, player.dbid);
        inventory.reloadInventory(player);

        marketItemsDb.delete(marketItem);
    }

    await tent.openMarket(player);
});

function getItemAmountAvailable(marketItem: MarketItemEntity, amount: number): boolean {
    if (!marketItem) {
        return false;
    }

    const itemConfig = inventoryShared.get(marketItem.item.item_id);
    if (itemConfig.canSplit) {
        return marketItem.item.count >= amount;
    }

    return true;
}
