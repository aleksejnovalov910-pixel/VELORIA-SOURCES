import { langStringDefault } from "../../shared/lang";
import {
    CONTAINERS_DATA,
    ExchangeData,
    ExchangeReadyStatus,
    getItemName,
    InventoryDataCef, inventoryShared, ITEM_TYPE,
    MAXIMUM_ITEMS_IN_ONE_EXCHANGE,
    OWNER_TYPES
} from "../../shared/inventory";
import {CustomEvent} from "./custom.event";
import {inventory} from "./inventory";
import {menu} from "./menu";
import {ItemEntity} from "./typeorm/entities/inventory";
import {User} from "./user";
import {TRADE_ITEM_PLAYER_EVENT} from "./advancedQuests/impl/MultiStepQuest/tradeItemPlayerQuestStep";
import {BATTLE_PASS_SEASON} from "../../shared/battlePass/main";
import {isBattlePassItem} from "../../shared/battlePass/history-seasons";
import {donateStorage} from "./donateStorage";

export interface ExchangeServerData {
    targetUserId: number,
    moneySum: number,
    itemsToExchange: ItemEntity[],
    readyStatus: ExchangeReadyStatus,
}

export async function sendExchangeRequest(player: PlayerMp, target: PlayerMp) {
    if (player.user.exchangeData || target.user.exchangeData) {
        return player.notify(player.user.LangString("inventory.exchange.6a48356515e2ccac3a3461ce4f0efafe"), 'error');
    }

    player.notify(player.user.LangString("inventory.exchange.7fb89348a6edffedbf096315c0c007ba", target.user.name));
    const isAccepted = await menu.accept(target, target.user.LangString("inventory.exchange.6cf464a490841abc9ed06bb076ed8d5d", player.user.name), 'small');

    if (!mp.players.exists(player) || !mp.players.exists(target)
        || player.user.exchangeData || target.user.exchangeData) {
        return;
    }

    if (!isAccepted) {
        return player.notify(player.user.LangString("inventory.exchange.b637f0d547abb2623619e5ce015a6735"), 'error');
    }

    player.user.exchangeData = {
        targetUserId: target.dbid,
        moneySum: 0,
        itemsToExchange: [],
        readyStatus: ExchangeReadyStatus.NOT_READY,
    };

    target.user.exchangeData = {
        targetUserId: player.dbid,
        moneySum: 0,
        itemsToExchange: [],
        readyStatus: ExchangeReadyStatus.NOT_READY,
    }

    openExchange(player, convertExchangeServerToCef(player, target));
    openExchange(target, convertExchangeServerToCef(target, player));
}

function convertExchangeServerToCef(player: PlayerMp, target: PlayerMp): ExchangeData {
    return {
        myData: {
            playerName: player.user.name,
            money: player.user.exchangeData.moneySum,
            items: player.user.exchangeData.itemsToExchange.map(item => {
                return [item.id, item.item_id, item.count, item.serial, item.extra]
            }),
            readyStatus: player.user.exchangeData.readyStatus,
        },
        targetData: {
            playerName: target.user.name,
            money: target.user.exchangeData.moneySum,
            items: target.user.exchangeData.itemsToExchange.map(item => {
                return [item.id, item.item_id, item.count, item.serial, item.extra]
            }),
            readyStatus: target.user.exchangeData.readyStatus,
        }
    }
}

function openExchange(player: PlayerMp, exchangeData: ExchangeData) {
      const myInventory: InventoryDataCef = {
        name: langStringDefault("inventory.exchange.e76a891704ba1db41fd108bfe08f63ea"),
        desc: player.user.name,
        owner_id: player.dbid,
        owner_type: OWNER_TYPES.PLAYER,
        weight_max: inventory.getWeightInventoryMax(OWNER_TYPES.PLAYER, player.dbid),
        items: inventory.getInventory(OWNER_TYPES.PLAYER, player.dbid)
            .map(item => [item.id, item.item_id, item.count, item.serial, item.extra])
    }

    CustomEvent.triggerClient(player, 'inventory:openExchange',
        myInventory, exchangeData, player.user.currentWeapon, player.user?.hotkeys, player.user.entity.inventory_level);
}

CustomEvent.registerCef('inventory::exchange::moneyChange', (player, money) => {
    const target = getExchangeTarget(player);
    if (!target) {
        return;
    }

    player.user.exchangeData.moneySum = money;

    updateExchangeMenu(player, target);
    updateExchangeMenu(target, player);
});

CustomEvent.registerCef('inventory::exchange::add', (player, itemId) => {

    const target = getExchangeTarget(player);
    if (!target) {
        return;
    }


    const item = inventory.get(itemId);
    if (!item) {
        return player.notify(player.user.LangString("inventory.exchange.d7c1e69e90ab1887e6f0cd9ba4e59efa"));
    }

    if (!player.user.inventory.find(itemEntity => itemEntity.id === itemId)) {
        return player.notify(player.user.LangString("inventory.exchange.2fa417aea3501faa0beb3741e3fd4c91"));
    }

    if (isBattlePassItem(item.advancedString) || item.advancedString === 'BATTLE_PASS_CLOTHES')
        return player.notify(player.user.LangString("inventory.exchange.90994de6e74c573c3dd182547a1cfffc"));


    if (donateStorage.isDonateItem(item)) {
        return player.notify(player.user.LangString("inventory.exchange.6a8895497c589ff590e5c2025f3b97db"));
    }

    if (player.user.exchangeData.itemsToExchange.length >= MAXIMUM_ITEMS_IN_ONE_EXCHANGE) {
        return player.notify(player.user.LangString("inventory.exchange.0eaf7abcaaa4d9eeb60b5ecbb2df2b4b"), 'error');
    }

    const bags = inventory.getItemsCountByType(target, ITEM_TYPE.BAGS) +
        player.user.exchangeData.itemsToExchange.filter(el => inventoryShared.get(el.item_id)
            && inventoryShared.get(el.item_id).type === ITEM_TYPE.BAGS).length;

    if (inventoryShared.get(item.item_id).type === ITEM_TYPE.BAGS && bags >= 2) {
        return player.notify(player.user.LangString("inventory.exchange.95c4226186dce183e803cee924237b9f"), 'error');
    }

    if (inventoryShared.get(item.item_id) && inventoryShared.get(item.item_id).type === ITEM_TYPE.BAGS) {
        const container = CONTAINERS_DATA.find(el => el.item_id === item.item_id)
        const items = inventory.getInventory(container.owner_type, item.id)
        let haveBattlePassItems: boolean = false;
        let haveDonateStorageItems: boolean = false;

        items.forEach(element => {
            if (isBattlePassItem(element.advancedString) || element.advancedString === 'BATTLE_PASS_CLOTHES')
                haveBattlePassItems = true;

            if (donateStorage.isDonateItem(element))
                haveDonateStorageItems = true;

        });


        if (haveBattlePassItems)
            return player.notify(player.user.LangString("inventory.exchange.61c55b0688f4e9f4634aecbe1849a697"), 'error');

        if (haveDonateStorageItems)
            return player.notify(player.user.LangString("inventory.exchange.94894b729dcbbbb46fb1bcf03c075197"), 'error');
    }

    if (player.user.entity.selectedBag === item.item_id) {
        player.user.entity.selectedBag = null
        player.user.sync_bag()
    }

    player.user.exchangeData.itemsToExchange.push(item);

    inventory.updateItemOwner(item, OWNER_TYPES.EXCHANGE_MENU, player.dbid);
    inventory.reloadPersonalInventory(player);

    updateExchangeMenu(player, target);
    updateExchangeMenu(target, player);
});

function updateExchangeMenu(player: PlayerMp, target: PlayerMp) {
    CustomEvent.triggerCef(player, 'inventory:exchange:update', convertExchangeServerToCef(player, target));
}

CustomEvent.registerCef('inventory::exchange::delete', (player, itemId) => {
    const target = getExchangeTarget(player);
    if (!target) {
        return;
    }

    const item = inventory.get(itemId);
    if (!item) {
        return player.notify(player.user.LangString("inventory.exchange.3fa1dc13ac365a0f94bbe9d7915908a7"));
    }

    const itemIdx = player.user.exchangeData.itemsToExchange.findIndex(itemTmp => itemTmp === item);
    if (itemIdx === -1) {
        return player.notify(player.user.LangString("inventory.exchange.9efe613c82f05c5bec4f9c086ec7c824"));
    }

    player.user.exchangeData.itemsToExchange.splice(itemIdx, 1);
    inventory.updateItemOwner(item, OWNER_TYPES.PLAYER, player.dbid);
    inventory.reloadPersonalInventory(player);

    updateExchangeMenu(player, target);
    updateExchangeMenu(target, player);
});

CustomEvent.registerCef('inventory::exchange::confirm', (player) => {
    const target = getExchangeTarget(player);
    if (!target) {
        return;
    }

    const playerReadyStatus = player.user.exchangeData.readyStatus;
    const targetReadyStatus = target.user.exchangeData.readyStatus;

    if (playerReadyStatus - targetReadyStatus > 1) {
        return;
    }

    if (player.user.exchangeData.readyStatus === ExchangeReadyStatus.CONFIRMED) {
        return;
    }

    player.user.exchangeData.readyStatus = playerReadyStatus + 1;

    if (player.user.exchangeData.readyStatus === ExchangeReadyStatus.CONFIRMED
        && target.user.exchangeData.readyStatus === ExchangeReadyStatus.CONFIRMED) {

        finishExchange(player, target);
    } else {
        updateExchangeMenu(player, target);
        updateExchangeMenu(target, player);
    }
});

function finishExchange(player: PlayerMp, target: PlayerMp) {
    player.user.setGui(null);
    target.user.setGui(null);

    const checkMoneyAndWeight = (player: PlayerMp, target: PlayerMp): boolean => {
        if (!checkInventoryWeight(player, player.user.exchangeData.itemsToExchange || [], target.user.exchangeData.itemsToExchange || [])) {
            player.notify(player.user.LangString("inventory.exchange.4b3c88695ed2251f6b7c7eef7c6bfc4b"), 'error');
            target.notify(player.user.LangString("inventory.exchange.1033ef748c9f8c8ebfae0763c3c8d676"), 'error')
            forceCloseExchange(player);
            forceCloseExchange(target);
            return false;
        }

        if (player.user.money < player.user.exchangeData.moneySum) {
            player.notify(player.user.LangString("inventory.exchange.1deec4a4d712186ca623d85ebf85ff06"), 'error');
            target.notify(player.user.LangString("inventory.exchange.9150ed795a1a17034a8959319dcb1e8c"), 'error')
            forceCloseExchange(player);
            forceCloseExchange(target);
            return false;
        }

        return true;
    };

    if (!checkMoneyAndWeight(player, target) || !checkMoneyAndWeight(target, player)) {
        return;
    }

    exchangeMoneyItems(player, target);
    exchangeMoneyItems(target, player);

    inventory.reloadPersonalInventory(player);
    inventory.reloadPersonalInventory(target);

    player.user.exchangeData = null;
    target.user.exchangeData = null;
}

function checkInventoryWeight(player: PlayerMp, itemsToDelete: ItemEntity[], itemsToAdd: ItemEntity[]): boolean {
    const inventoryWeight = inventory.getWeightItems(player.user.inventory);
    const itemsToDeleteWeight = inventory.getWeightItems(itemsToDelete);
    const itemsToAddWeight = inventory.getWeightItems(itemsToAdd);
    const maxWeight = inventory.getWeightInventoryMax(OWNER_TYPES.PLAYER, player.dbid);

    return inventoryWeight - itemsToDeleteWeight + itemsToAddWeight <= maxWeight
}

function exchangeMoneyItems(player: PlayerMp, target: PlayerMp) {
    player.user.removeMoney(player.user.exchangeData.moneySum, false, player.user.LangString("inventory.exchange.cbe8ec2a093ac00a6043fe1c355c8a19", target.user.name, target.dbid));
    player.user.addMoney(target.user.exchangeData.moneySum, false, player.user.LangString("inventory.exchange.11ea329092d2498bb70453aa074c4a25", target.user.name, target.dbid));

    const itemsStr = player.user.exchangeData.itemsToExchange
        .map(item => getItemName(item) + ' x' + item.count)
        .join(', ');

    mp.events.call(TRADE_ITEM_PLAYER_EVENT, player,
        player.user.exchangeData.itemsToExchange);

    player.user.log('exchange', langStringDefault("inventory.exchange.00a3f000b4404648c5affea2e7b9ef0e", target.user.name, target.dbid, itemsStr));
    player.user.exchangeData.itemsToExchange.forEach(item => {
        inventory.updateItemOwner(item, OWNER_TYPES.PLAYER, target.dbid);
    });
}

CustomEvent.registerCef('inventory::exchange::decline', (player) => {
    const target = getExchangeTarget(player);
    if (!target) {
        return;
    }

    forceCloseExchange(player);
    forceCloseExchange(target);

    player.notify(player.user.LangString("inventory.exchange.8488abbbf1926c8a24a0e22ec173e391"));
    target.notify(target.user.LangString("inventory.exchange.f5a6ca4ca1263b3c2656d96dd5ef7f78", player.user.name), 'warning');
});

mp.events.add('playerQuit', closeExchangeIfExists);
CustomEvent.registerCef('inventory:close', closeExchangeIfExists);
CustomEvent.registerClient('inventory:close', closeExchangeIfExists);

function closeExchangeIfExists(player: PlayerMp) {
    if (player.user && player.user.exchangeData) {
        const target = User.get(player.user.exchangeData.targetUserId);
        if (target && mp.players.exists(target)) {
            forceCloseExchange(target);
            target.notify(target.user.LangString("inventory.exchange.2c9d5dfefcb2c0ad825e9bc63a0e8ac9"), 'error');
        }

        forceCloseExchange(player);
    }
}

function getExchangeTarget(player: PlayerMp): PlayerMp | null {
    if (!player.user.exchangeData) {
        forceCloseExchange(player);
        return null;
    }

    const target = User.get(player.user.exchangeData.targetUserId);
    if (!target || !mp.players.exists(target)) {
        forceCloseExchange(player);
        return null;
    }

    return target;
}

function forceCloseExchange(player: PlayerMp) {
    player.user.exchangeData.itemsToExchange.forEach(item => {
        inventory.updateItemOwner(item, OWNER_TYPES.PLAYER, player.dbid);
    });

    inventory.reloadPersonalInventory(player);

    player.user.exchangeData = null;
    player.user.setGui(null);
}