import { langStringDefault } from "../../../shared/lang";
import {BusinessEntity} from "../typeorm/entities/business";
import {menu} from "../menu";
import {
    getBaseItemNameById,
    getItemWeight,
    inventoryShared,
    ITEM_TYPE,
    OWNER_TYPES,
    weapon_list
} from "../../../shared/inventory";
import {system} from "../system";
import {business, businessCatalogItemName, businessCatalogMenu, businessDefaultCostItem} from "../business";
import {inventory} from "../inventory";
import {CustomEvent} from "../custom.event";
import {LicenseName} from "../../../shared/licence";
import {BUSINESS_SUBTYPE_NAMES, BUSINESS_TYPE} from "../../../shared/business";
import {deliverSet, needUnload, orderDeliverMenu} from "./order.system";
import {quests} from "../quest";
import {DONATE_MONEY_NAMES} from "../../../shared/economy";
import {canUserStartBizWar, createBizMenuBizWarItem} from "../bizwar";
import {ItemEntity} from "../typeorm/entities/inventory";
import {dress} from "../customization";
import {ArmorNames} from "../../../shared/cloth";
import {writeClientRatingLog} from "./tablet";

export const SHOP_BUY_ITEM_EVENT = "item_shop:buyItem";

export const generateFreeSimNumber = () => {
    let number: number;
    const usedNumbers = [...inventory.data].map(q => q[1]).filter(q => [850, 851].includes(q.item_id)).map(q => q.advancedNumber)
    while (!number) {
        const newNumber = system.randomNumber(7);
        if (!usedNumbers.includes(newNumber)) number = newNumber;
    }
    return number;
}


CustomEvent.registerCef("server:item_shop:buy_item", (player, shopId: number, itemData: [number, number][], paytype: number, pin?: string) => {
    if (!player.user) return;
    const user = player.user;
    let shop = business.get(shopId);
    if (!shop) return;
    if (![BUSINESS_TYPE.ITEM_SHOP, BUSINESS_TYPE.BAR].includes(shop.type)) return;

    let ok = true;
    let weight = 0;
    let sum = 0;
    let catalog = shop.catalog
    const donate = !!shop.donate
    let remove: [number, number][] = []
    itemData.map(([itemId, amount]) => {
        if (!ok) return;
        if (!amount) return;
        const itemConf = inventoryShared.get(itemId);
        if (!itemConf) return ok = false;
        const conf = catalog.find(q => q.item == itemId);
        if (!conf) {
        player.notify(player.user.LangString("shop.ffdb60a1afd6752cffe07118a7281dd5", itemConf.name), "error");
            reloadShopData(player, shop);
            ok = false;
            return;
        }

        // // verificare stoc
        // if (conf.count <= 0) {
        //     player.notify(`Produsul ${itemConf.name} nu mai este in stoc!`, "error");
        //     reloadShopData(player, shop);
        //     ok = false;
        //     return;
        // }

        // if (conf.count < amount) {
        //     player.notify(`Nu sunt suficiente produse in stoc pentru ${itemConf.name}!`, "error");
        //     reloadShopData(player, shop);
        //     ok = false;
        //     return;
        // }


        // if (!conf || (!conf.price && conf.count)) return player.notify(player.user.LangString("shop.ffdb60a1afd6752cffe07118a7281dd5", itemConf.name), "error"), reloadShopData(player, shop), ok = false;
        if ([ITEM_TYPE.WEAPON_MAGAZINE, ITEM_TYPE.WEAPON, ITEM_TYPE.AMMO_BOX].includes(itemConf.type)) {
            let needLic = false;
            if (ITEM_TYPE.WEAPON_MAGAZINE === itemConf.type) needLic = true;
            else if (ITEM_TYPE.AMMO_BOX === itemConf.type) needLic = true;
            else if (ITEM_TYPE.WEAPON === itemConf.type) {
                const wConf = weapon_list.find(q => q.weapon === itemId);
                if (wConf.need_license) needLic = true;
            }
            if (needLic && !user.haveActiveLicense("weapon"))
                return player.notify(player.user.LangString("shop.8dfa016b0062fd85828e3413b7d8d979", getBaseItemNameById(itemId), LicenseName["weapon"]), "error"), ok = false;
        }
        const multiple = shop.sub_type === 3 && user.haveActiveLicense("med") ? 0.6 : 1.0
        if (donate) {
            if (conf.count < amount) return player.notify(player.user.LangString("shop.e99280acbf1692a320fc29541676c506", itemConf.name), "error"), ok = false;
            sum += conf.price * amount;
        } else {
            sum += (((conf.count && conf.count >= amount) || !itemConf.defaultCost ? conf.price : itemConf.defaultCost) * multiple) * amount;
            if (conf.count && conf.count >= amount) remove.push([itemId, Math.min(conf.count, amount)])
        }

        const itemConfig = inventoryShared.get(conf.item);
        weight += getItemWeight(conf.item, itemConfig.default_count) * amount
    })

    if (!ok) return;

    const item = player.user.inventory.find((item) => item.item_id == 40002);
    const discount = item ? 25 : 0;

    sum = sum - (sum * discount / 100);


    if ((inventory.getWeightItems(inventory.getInventory(OWNER_TYPES.PLAYER, user.id)) + weight) > inventory.getWeightInventoryMax(OWNER_TYPES.PLAYER, user.id))
        return player.notify(player.user.LangString("shop.cb00dc0b005a4e6de608773d5fc316c0"), "error"), reloadShopData(player, shop);

    if (donate) {
        if (user.donate_money < sum)
            return player.notify(player.user.LangString("shop.b6f527d3e9e348b500e75ba4c3dd0f83", DONATE_MONEY_NAMES[2]), "error"), reloadShopData(player, shop);
        user.removeDonateMoney(sum, user.LangString("shop.7e5bf5e813c0329f4f05737c8e6bd7b0", shop.name, shop.id))
    } else {
        if (paytype === 0) {
            if (user.money < sum) return player.notify(player.user.LangString("shop.241750d0d63de987a81e1389fba4a934"), "error"), reloadShopData(player, shop);
            user.removeMoney(sum, true, user.LangString("shop.90de24957fb961dfd3a18908a8748bec", shop.name, shop.id))
        } else if (paytype === 1) {
            if (!user.verifyBankCardPay(pin))
                return player.notify(player.user.LangString("shop.acbbbb5b2d21bcdc05520502328f1518"), "error"), reloadShopData(player, shop);
            if (!user.tryRemoveBankMoney(sum, true, user.LangString("shop.e5ca939490ae52c40a9b4c25274a7a8e"), `${shop.name} ${shop.id}`)) return reloadShopData(player, shop);
        } else {
            return;
        }
        player.user.achiev.setAchievTickBiz(shop.type, shop.sub_type, sum)
    }

    itemData.map(async ([itemId, amount]) => {
        const type = BUSINESS_TYPE.BAR === shop.type ? "BAR" : "SHOP";

        const conf = catalog.find(q => q.item == itemId);
        const itemConf = inventoryShared.get(itemId);
        const multiple = shop.sub_type === 3 && user.haveActiveLicense("med") ? 0.6 : 1.0;
        const name = businessCatalogItemName(shop, itemId)

        writeClientRatingLog(
            player,
            shop.id,
            donate
                ?
                conf.price
                :
                (((conf.count && conf.count >= amount) || !itemConf.defaultCost ? conf.price : itemConf.defaultCost) * multiple),
            name,
            amount
        )

        for (let q = 0; q < amount; q++) {
            const itemParams: Partial<ItemEntity> = {
                owner_type: OWNER_TYPES.PLAYER,
                owner_id: user.id,
                item_id: itemId,
                serial: `${type}_${shop.id}_${user.id}_${system.timestamp}`
            }

            if (itemId === 960) {
                itemParams.count = ARMOR_DEFAULT_COUNT_IN_SHOP;

                const dressCfg = dress.data
                    .find(dressEntity => dressEntity.name === ArmorNames.StandardArmor);

                itemParams.advancedNumber = dressCfg.id;
                itemParams.serial = dressCfg.name;
            }

            mp.events.call(SHOP_BUY_ITEM_EVENT, player, itemParams.item_id, 1);
            await inventory.createItem(itemParams).then(item => {
                if (item.item_id === 851) {
                    const conf = catalog.find(q => q.item == itemId);
                    item.advancedString = `${Math.floor(conf.price / 2)}`;
                    item.save();
                }
            });
        }

    })
    let bizadd = 0;
    let totalItemsPurchasePrice = 0;
    remove.map(([itemId, amount]) => {
        const conf = catalog.find(q => q.item == itemId);
        shop.setItemCountByItemId(conf.item, conf.count - amount)
        bizadd += conf.price * amount;
        totalItemsPurchasePrice += businessDefaultCostItem(shop, conf.item, amount);
    })
    if (bizadd > 0) {
        business.addMoney(shop, bizadd, langStringDefault("shop.87d3d328474c90fff244e36aa2161782", player.dbid), false, false,
            true, true, totalItemsPurchasePrice);
    }

    const itemsId = itemData.map(q => q[0])

    user.quests.map(quest => {
        const qcfg = quests.getQuest(quest[0]);
        if (!qcfg) return;
        qcfg.tasks.map((task, taskindex) => {
            if (task.type !== "itemBuy") return;
            if (task.item_id && !itemsId.includes(task.item_id)) return;
            user.setQuestTaskComplete(quest[0], taskindex)
        })
    })

    if (item) inventory.deleteItem(item, item.owner_type, item.owner_id, true);

    player.notify(player.user.LangString("shop.b4a7d30fe806d42efdf4c4131f9f1f40"), "success");
    player.user.setGui(null);
    return;

})

const ARMOR_DEFAULT_COUNT_IN_SHOP = 50;

const reloadShopData = (player: PlayerMp, item: BusinessEntity) => {
    const user = player.user;
    if (!user) return;
    let catalog: { item_id: number, count: number, price: number }[] = [];
    const multiple = item.sub_type === 3 && user.haveActiveLicense("med") ? 0.9 : 1.0
    item.catalog.map(data => {
        const cfg = inventoryShared.get(data.item);
        catalog.push({item_id: data.item, price: data.price * multiple, count: data.count})
    })

    CustomEvent.triggerClient(player, "item_shop:init", item.id, item.name, catalog, item.donate, item.type, item.sub_type)
}


export const shopMenu = (player: PlayerMp, item: BusinessEntity) => {
    if (!player.user) return;
    const user = player.user;
    const openShop = () => {
        if (item.catalog.length == 0) return player.notify(player.user.LangString("shop.a24c2fa1cb66745ba66300acb7afde91"), "error");
        if (item.sub_type == 5) {
            user.setGui("farm")
            CustomEvent.triggerCef(player, "farm:setComponent", "shop")
        } else {
            CustomEvent.triggerClient(player, "shop:open");
        }
        reloadShopData(player, item)
    }
    if (!user.isAdminNow(6) && item.userId !== user.id && !needUnload(player, item) && !canUserStartBizWar(user))
        return openShop();
    const name = BUSINESS_TYPE.BAR === item.type ? item.name : `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`
    let m = menu.new(player, "", `${name} #${item.id}`);
    let sprite = "interaction_bgd";
    if (BUSINESS_TYPE.BAR !== item.type) {
        switch (item.sub_type) {
            case 0:
                sprite = "shopui_title_conveniencestore";
                break;
            case 1:
                sprite = "digital";
                break;
            case 2:
                sprite = "shopui_title_gunclub";
                break;
            case 3:
                sprite = "m3";
                break;
            case 5:
                sprite = "farm";
                break;
        }
    }
    m.sprite = sprite as any;

    m.newItem({
        name: langStringDefault("shop.789f69f7c75461c4f4dae98dc65b20a8"),
        onpress: () => {
            m.close();
            openShop()
        },
    })

    if (needUnload(player, item)) {
        m.newItem({
            name: langStringDefault("shop.8ab6535de533faa2dd51a9dad5716ca7"),
            onpress: () => {
                m.close();
                deliverSet(player)
            },
        })
    }

    createBizMenuBizWarItem(user, m, item);

    if (user.isAdminNow(6) || item.userId === user.id) {
        m.newItem({
            name: langStringDefault("shop.aaa491426f4cf8a9b2a20e882bb4fb0e"),
            onpress: () => {
                businessCatalogMenu(player, item, () => {
                    shopMenu(player, item)
                })
            },
        })
        m.newItem({
            name: langStringDefault("shop.6dbe21ebcd0a1e9a9884b5ed3d9dd060"),
            onpress: () => {
                orderDeliverMenu(player, item)
            }
        })


    }


    m.open();
};