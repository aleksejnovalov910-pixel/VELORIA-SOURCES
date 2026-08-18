import { langStringDefault } from "../../shared/lang";
import {CRAFTING_ITEMS, CRAFTING_TABLES, CraftItem, TableData} from "../../shared/crafting";
import {colshapes} from "./checkpoints";
import {menu} from "./menu";
import {getBaseItemNameById} from "../../shared/inventory";
import {ScaleformTextMp} from "./scaleform.mp";
import {system} from "./system";
import {User} from "./user";
import './crafting.factories';

let usedTable = new Map<string, PlayerMp>();
let activeTextTimers = new Map<string, ScaleformTextMp>();
let longItems:[string, number, number, number][] = [];

CRAFTING_TABLES.map((table, tableId) => {
    table.pos.forEach((pos, colshapeIndex) => {
        colshapes.new(
            new mp.Vector3(pos.x, pos.y, pos.z),
            table.name,
            (player) => {
                const user = player.user;
                if (!user) return;
                
                if (checkLongItems(user.id, tableId, colshapeIndex)) {
                    getLongItems(user, tableId, colshapeIndex);
                    return;
                }
                
                let hasAccess = true;
                if (table.fractions) {
                    hasAccess = table.fractions.includes(user.fraction);
                }
                if (!hasAccess) {
                    return player.notify(player.user.LangString("crafting.9c124625b4f3e2c6a29ec36e219e8f23"), 'error');
                }
                
                openCraftMenuForPlayer(player, table, tableId, colshapeIndex);
            }
        );
    });
});

function checkLongItems(userId: number, tableId: number, colshapeIndex: number): boolean {
    return longItems.findIndex(q => q[0] === `${tableId}_${colshapeIndex}` && q[1] === userId) !== -1;
}

function getLongItems(user: User, tableId: number, colshapeIndex: number) {
    const longItemIndex = longItems.findIndex(q => q[0] === `${tableId}_${colshapeIndex}` && q[1] === user.id);
    if (longItemIndex === -1) return;

    if (!user.tryGiveItem(longItems[longItemIndex][2], true, true, longItems[longItemIndex][3])) return;

    longItems.splice(longItemIndex, 1);
}


function openCraftMenuForPlayer(player: PlayerMp, table: TableData, tableid: number, colshapeIndex: number) {
    const user = player.user;
    const m = menu.new(player, table.name, player.user.LangString("crafting.666ae613fa760ffba0ada79333a638d9"));

    const getCraftResultItemId = (item: any) => {
        const entry = item.item[0];
        return 'id' in entry ? entry.id : entry[0];
    };

    const buildName = (item: any) => {
        const id = getCraftResultItemId(item);
        return getBaseItemNameById(id);
    };

    const buildDesc = (item: any) => {
        return player.user.LangString(
            "crafting.e654680253e4b103e174e6353dfcd156",
            item.recipe
                ? `${getBaseItemNameById(item.recipe)} (${user.haveItem(item.recipe)
                    ? player.user.LangString("crafting.b8058708acc95bf33a6f47218fb71442")
                    : player.user.LangString("crafting.b8a2b3d017b410fdf72e4224b577b7b9")})\n`
                : "",
            item.items.map(z =>
                `${getBaseItemNameById(z[0])} x${z[1]} (${user.haveItem(z[0])
                    ? player.user.LangString("crafting.6c3d195bddfad08d36998aee24d2febe")
                    : player.user.LangString("crafting.ada0a9f444eaab77c247e684c8578445")})`
            ).join('\n')
        );
    };

    const addItemsToMenu = (type: string) => {
        CRAFTING_ITEMS.filter(s => s.type === type).forEach(item => {
            m.newItem({
                name: buildName(item),
                desc: buildDesc(item),
                onpress: () => {
                    craftItem(player, table, tableid, colshapeIndex, item);
                    m.close();
                }
            });
        });
    };

    switch (table.type) {
        case "topitorie":
        case "gunTec":
        case "gun103":
        case "gunTecminereuri":
            addItemsToMenu(table.type);
            break;
        default:
            CRAFTING_ITEMS.filter(s => s.type === table.type).forEach(item => {
                const name = table.type === "spalare" ? "Spalarea Pietrelor" : buildName(item);

                m.newItem({
                    name: name,
                    desc: buildDesc(item),
                    onpress: () => {
                        craftItem(player, table, tableid, colshapeIndex, item);
                        m.close();
                    }
                });
            });
            break;
    }

    m.open();
}


function weightedChoice<T extends { chance: number }>(array: T[]): T | null {
    const total = array.reduce((sum, item) => sum + item.chance, 0);
    const random = Math.random() * total;
    let cumulative = 0;

    for (const item of array) {
        cumulative += item.chance;
        if (random <= cumulative) return item;
    }

    return null;
}
function releaseTable(tableid: number, colshapeIndex: number) {
    const key = `${tableid}_${colshapeIndex}`;
    usedTable.delete(key);

    const timer = activeTextTimers.get(key);
    if (timer && ScaleformTextMp.exists(timer)) {
        timer.destroy();
        activeTextTimers.delete(key);
    }
}


// =====================
// Craft item
// =====================
function craftItem(player: PlayerMp, table: TableData, tableid: number, colshapeIndex: number, craftItem: CraftItem) {
    const user = player.user;

    if (usedTable.has(`${tableid}_${colshapeIndex}`) && mp.players.exists(usedTable.get(`${tableid}_${colshapeIndex}`)))
        return player.notify(player.user.LangString("crafting.6c59c4b1523a9b772ae371007f58e1ef"), "error");

    const check = () => {
        if (craftItem.recipe && !user.haveItem(craftItem.recipe)) {
            player.notify(player.user.LangString("crafting.0fc641fdc3a8709677dc139c99499d1f", getBaseItemNameById(craftItem.recipe)), 'error');
            return false;
        }

        let isHaveAllComponents = true;
        craftItem.items.forEach(q => {
            const [ item_id, needAmount ] = q;
            const arrayItems = user.getArrayItem(item_id);
            const total = arrayItems.reduce((sum, item) => sum + item.count, 0);
            if (total < needAmount) {
                isHaveAllComponents = false;
                player.notify(player.user.LangString("crafting.565812a210cecfdb34c39ca14f94aec6", getBaseItemNameById(item_id), needAmount), 'error');
            }
        });
        return isHaveAllComponents;
    }

    if (!check()) return;

    const pos = table.pos[colshapeIndex];
    usedTable.set(`${tableid}_${colshapeIndex}`, player);

    // let timer = table.mode === "short" ? craftItem.seconds : craftItem.seconds + 5;
    let timer = craftItem.seconds;

    let itemName = table.type === "spalare"
        ? "Spalarea Pietrelor"
        : getBaseItemNameById(Array.isArray(craftItem.item[0]) ? craftItem.item[0][0] : craftItem.item[0].id);

    const textKey = `${tableid}_${colshapeIndex}`;
    let existingTimer = activeTextTimers.get(textKey);
    if (existingTimer && ScaleformTextMp.exists(existingTimer)) {
        existingTimer.destroy();
        activeTextTimers.delete(textKey);
    }

    let textTimer = new ScaleformTextMp(
        new mp.Vector3(pos.x, pos.y, pos.z + 1.5),
        langStringDefault("crafting.c8ccae2104d725670e483437c202d4b7", itemName, timer),
        { dimension: player.dimension, type: 'front', range: 5 }
    );
    activeTextTimers.set(textKey, textTimer);
    user.playAnimationWithResult(table.anim, timer, itemName, pos.h)

    // user.playAnimationWithResult(table.anim, table.mode === "short" ? craftItem.seconds : 5, itemName, pos.h)
        .then(status => {
            if (!mp.players.exists(player)) return releaseTable(tableid, colshapeIndex);
            if (!status) return releaseTable(tableid, colshapeIndex);
            if (!check()) return releaseTable(tableid, colshapeIndex);

            // ======== Procesare iteme ========
            if (craftItem.itemFactoryMethod) {
                const itemParams = craftItem.itemFactoryMethod(table, colshapeIndex);
                if (!itemParams || typeof itemParams.item_id === "undefined" || typeof itemParams.count === "undefined") {
                    player.notify("Eroare interna: itemFactoryMethod a returnat date invalide.", "error");
                    return releaseTable(tableid, colshapeIndex);
                }
                if (!user.canTakeItem(itemParams.item_id, 1, itemParams.count)) {
                    player.notify(player.user.LangString("crafting.4abf4d3139b2d10635548ab5c4db10e0", itemName), "error");
                    return releaseTable(tableid, colshapeIndex);
                }
                user.giveItem(itemParams, true);
            } else {
                let hasReceived = false;
                craftItem.item.forEach(i => {
                    const itemId = 'id' in i ? i.id : i[0];
                    const itemCount = 'count' in i ? i.count : i[1];
                    const itemChance = 'chance' in i ? i.chance : 100;

                    if (Math.random() * 100 <= itemChance) {
                        user.tryGiveItem(itemId, true, true, itemCount);
                        player.notify(`Ai primit x${itemCount} ${getBaseItemNameById(itemId)}.`, 'success');
                        hasReceived = true;
                    }
                });
                if (!hasReceived) player.notify("N-ai primit nimic din piatra spalata.", "error");
            }

            // Consum iteme folosite
            craftItem.items.forEach(([item_id, needAmount]) => {
                let taken = 0;
                user.getArrayItem(item_id).forEach(item => {
                    if (taken < needAmount) {
                        const take = Math.min(needAmount - taken, item.count);
                        item.useCount(take, player);
                        taken += take;
                    }
                });
            });

            // ======== Eliberăm masa ========
            releaseTable(tableid, colshapeIndex);
        });
}