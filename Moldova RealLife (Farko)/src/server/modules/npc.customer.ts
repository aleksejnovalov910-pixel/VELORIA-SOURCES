import { langStringDefault } from "../../shared/lang";
import { getBaseItemNameById } from "../../shared/inventory";
import { LicenseName } from "../../shared/licence";
import {NPC_CUSTOMERS_LIST, NpcCustomer, NpcItemDto} from "../../shared/npc.customer";
import { CustomEvent } from "./custom.event";
import { inventory } from "./inventory";
import { menu } from "./menu";
import { system } from "./system";
import {Vehicle} from "./vehicles";
import {MoneyChestClass} from "./money.chest";
import {FACTION_ID} from "../../shared/fractions";

let currentMap = new Map<number, number[]>();
let currentCost = new Map<number, number[]>();

NPC_CUSTOMERS_LIST.map((npc, id) => {
    let current = npc.items.map(q => q.start);
    currentMap.set(id, current);
    let currentC = npc.items.map(q => typeof q.cost === "number" ? q.cost : system.getRandomIntStep(q.cost[0], q.cost[1], 10));
    currentCost.set(id, currentC);
})

CustomEvent.register('newHour', () => {
    NPC_CUSTOMERS_LIST.map((npc, id) => {
        let current = [...currentMap.get(id)];
        npc.items.map((item, itemid) => {
            if(item.max) current[itemid] = Math.min(current[itemid] + item.perhour, item.max);
        })
        currentMap.set(id, current);
        let currentC = npc.items.map(q => typeof q.cost === "number" ? q.cost : system.getRandomIntStep(q.cost[0], q.cost[1], 10));
        currentCost.set(id, currentC);
    })
})

CustomEvent.registerClient('npc:customer:open', (player, id: number) => {
    const user = player.user;
    if(!user) return;
    const cfg = NPC_CUSTOMERS_LIST[id];
    if(!cfg) return;
    if(cfg.factions && !cfg.factions.includes(user.fraction)) return player.notify(player.user.LangString("npc.customer.a302644448d00e1b841345fc3d033b70"), 'error')
    if(cfg.forFamily && !user.family) return player.notify(player.user.LangString("npc.customer.7c727325c89e769b8eedc26d3f576fa1"), 'error')

    const data : NpcItemDto[] = cfg.items
        .map((item, index) => {
            const playerItemCount = inventory.getItemsCountById(player, item.item);

            return {
                id: item.item,
                playerHasCount: playerItemCount,
                price: currentCost.get(id)[index]
            };
        });

    player.currentNpcCustomerId = id;
    CustomEvent.triggerClient(player, 'npc:customer:open', data, cfg.background);
    return;
});

CustomEvent.registerCef('npc::customer::sellAll', (player: PlayerMp, itemIdsJson: string) => {
    if (!player.user || player.currentNpcCustomerId == null) return null;

    const npcConfig = NPC_CUSTOMERS_LIST[player.currentNpcCustomerId];
    if (!npcConfig) return null;

    const itemIds : number[] = JSON.parse(itemIdsJson);
    const notSoldItems : number[] = [];
    for (let itemId of itemIds) {
        if (!sellItem(player, itemId, npcConfig)) {
            notSoldItems.push(itemId);
        }
    }

    if (notSoldItems.length > 0) {
        player.notify(player.user.LangString("npc.customer.367fb779abde08a9475ddddfbe5295d4"));
    }

    return notSoldItems;
});

CustomEvent.registerCef('npc::customer::sell', (player: PlayerMp, itemId: number, amount: number) => {
    if (!player.user || player.currentNpcCustomerId == null) return false;

    const npcConfig = NPC_CUSTOMERS_LIST[player.currentNpcCustomerId];
    if (!npcConfig) return false;

    return sellItem(player, itemId, npcConfig, amount);
});

// function sellItem(player: PlayerMp, itemId: number, npcConfig: NpcCustomer, amount: number = null) : boolean {
//     const npcItemConfig = npcConfig.items.find(i => i.item === itemId);
//     if (!npcItemConfig) return false;

//     const itemIndex = npcConfig.items.findIndex(i => i.item === itemId);
//     const price = currentCost.get(player.currentNpcCustomerId)[itemIndex];

//     const availableAmountToSellById = [...currentMap.get(player.currentNpcCustomerId)];
//     // if (npcItemConfig.max && availableAmountToSellById[itemIndex] <= 0) {
//     //     player.notify(player.user.LangString("npc.customer.30f50e91bab0e84214974cb67a2145e2"), 'error');
//     //     return false;
//     // }

//     if (npcConfig.license && !player.user.haveActiveLicense(npcConfig.license)) {
//         player.notify(player.user.LangString("npc.customer.05d81dfdd82c91ac955717ec25670cfd", LicenseName[npcConfig.license]), 'error');
//         return false;
//     }

//     const playerItemsCount = inventory.getItemsCountById(player, itemId);
//     if (amount == null) {
//         amount = playerItemsCount;
//     } else if (playerItemsCount < amount) {
//         player.notify(player.user.LangString("npc.customer.2221d327659f60e658a2748046c2b47c"), 'error');
//         return false;
//     }

//     inventory.deleteItemsById(player, itemId, amount);
//     const sum = price * amount;
//     player.user.addMoney(sum, true, player.user.LangString("npc.customer.921fe7325e785f595995a280b7816239", getBaseItemNameById(itemId), amount))
//     addFractionMoney(player.user.fraction, sum, npcConfig.partToFraction);

//     if (npcItemConfig.max) {
//         availableAmountToSellById[itemIndex] = Math.max(availableAmountToSellById[itemIndex] - amount, 0);
//         currentMap.set(player.currentNpcCustomerId, availableAmountToSellById);
//     }

//     return true;
// }
function sellItem(player: PlayerMp, itemId: number, npcConfig: NpcCustomer, amount: number = null): boolean {
    const npcItemConfig = npcConfig.items.find(i => i.item === itemId);
    if (!npcItemConfig) return false;

    const itemIndex = npcConfig.items.findIndex(i => i.item === itemId);
    const price = currentCost.get(player.currentNpcCustomerId)[itemIndex];

    const availableAmountToSellById = [...currentMap.get(player.currentNpcCustomerId)];

    if (npcConfig.license && !player.user.haveActiveLicense(npcConfig.license)) {
        player.notify(player.user.LangString("npc.customer.05d81dfdd82c91ac955717ec25670cfd", LicenseName[npcConfig.license]), 'error');
        return false;
    }

    const playerItemsCount = inventory.getItemsCountById(player, itemId);
    if (amount == null) {
        amount = playerItemsCount;
    } else if (playerItemsCount < amount) {
        player.notify(player.user.LangString("npc.customer.2221d327659f60e658a2748046c2b47c"), 'error');
        return false;
    }

    inventory.deleteItemsById(player, itemId, amount);
    const sum = price * amount;

    if (npcConfig.background === "sellman") {
        // Da bani murdari
        player.user.tryGiveItem(40157, true, true, sum);
        player.notify(
            player.user.LangString("npc.customer.921fe7325e785f595995a280b7816239", getBaseItemNameById(itemId), amount) +
            ` (+$${system.numberFormat(sum)} bani murdari)`,
            'success'
        );
    } else {
        // Da bani normali
        player.user.addMoney(sum, true, player.user.LangString(
            "npc.customer.921fe7325e785f595995a280b7816239",
            getBaseItemNameById(itemId),
            amount
        ));
    }

    addFractionMoney(player.user.fraction, sum, npcConfig.partToFraction);

    if (npcItemConfig.max) {
        availableAmountToSellById[itemIndex] = Math.max(availableAmountToSellById[itemIndex] - amount, 0);
        currentMap.set(player.currentNpcCustomerId, availableAmountToSellById);
    }

    return true;
}

function addFractionMoney(fraction: FACTION_ID, sum: number, partToFraction: number) {
    const sumToFraction = (partToFraction) ?
        (sum / 100) * partToFraction : 0;

    if (sumToFraction) {
        if (fraction) {
            const safe = MoneyChestClass.getByFraction(fraction);
            if (safe) safe.money = safe.money + sumToFraction;
        }
    }
}