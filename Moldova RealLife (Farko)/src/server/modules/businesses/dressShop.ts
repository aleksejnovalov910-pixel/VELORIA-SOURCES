import { langStringDefault } from "../../../shared/lang";
import { BusinessEntity } from "../typeorm/entities/business";
import { menu } from "../menu";
import { system } from "../system";
import {business, businessCatalogMenu, businessDefaultCostItem, clearBusinessProduct} from "../business";
import { inventory } from "../inventory";
import { CustomEvent } from "../custom.event";
import { dress } from "../customization";
import { OWNER_TYPES } from "../../../shared/inventory";
import { CLOTH_VARIATION_ID_MULTIPLER } from "../../../shared/cloth";
import { BUSINESS_TYPE } from "../../../shared/business";
import { needUnload, deliverSet, orderDeliverMenu } from "./order.system";
import { quests } from "../quest";
import {getAchievConfigBiz} from "../../../shared/achievements";
import {canUserStartBizWar, createBizMenuBizWarItem, startBizWar} from "../bizwar";
import {writeClientRatingLog} from "./tablet";

CustomEvent.registerCef("cloth:buy", async (player, shopId: number, itemId: number, variationId: number) => {
    if (!player.user) return;
    const user = player.user;
    let shop = business.get(shopId);
    if (!shop) return;
    if (shop.type !== BUSINESS_TYPE.DRESS_SHOP) return;
    const conf = shop.catalog.find(q => q.item == itemId);
    if (!conf || !conf.price) return player.notify(player.user.LangString("dressShop.a2c1a153cee24c9a1b94ad97d15e1ae4"), "error"), reloadShopData(player, shop);
    let dressCfg = dress.get(itemId);
    if (!dressCfg) return player.notify(player.user.LangString("dressShop.1978a261a88df8f1e5475acad74951f6"), "error"), reloadShopData(player, shop);
    if(!dressCfg.data[variationId]) return player.notify(player.user.LangString("dressShop.4301beeb2d569130dc85841e29b3dca3"), "error");
    const price = conf.count > 0 ? conf.price : businessDefaultCostItem(shop, conf.item)
    let canPay: boolean;
    
    const item = player.user.inventory.find((item) => item.item_id == 40001);
    const discount = item ? 25 : 0;

    if (!shop.donate) {
        canPay = await user.tryPayment(
            price - (price * discount / 100),
            "all",
            null, 
            user.LangString("dressShop.4c7a952318831ac6d82b75453d4852d3", shop.id, itemId, dressCfg.name),
            user.LangString("dressShop.24c902e9d349e6aa8ec28d808f519be0")
        )
    }
    else canPay = user.donate_money >= price
    if (!canPay) return player.notify(player.user.LangString("dressShop.63e4bfe2c963fee9751233b318d4458e"), "error");

    if (item) inventory.deleteItem(item, item.owner_type, item.owner_id, true);

    if (conf.count > 0) {
        business.addMoney(shop, price, langStringDefault("dressShop.9b7d04ce2faeeb9b54325bb806f411ab", player.dbid, dressCfg.name), false,
            false, true, true, businessDefaultCostItem(shop, conf.item));
        shop.setItemCountByItemId(conf.item, conf.count - 1)
    }
    if (shop.donate){
        user.removeDonateMoney(price, user.LangString("dressShop.83e389175009144a5bd6d8888286f48e", shop.id, itemId, dressCfg.name));

    } else {
        //user.removeMoney(price, true, `Покупка одежды в магазине ${shop.id} одежду ${itemId} ${dressCfg.name}`);
        player.user.achiev.setAchievTickBiz(shop.type, shop.sub_type, price)
    }
    player.notify(player.user.LangString("dressShop.365af72df406fcd2c85373f9dc6a6003"), "success");
    writeClientRatingLog(player, shopId, price, dressCfg.name, 1);
    user.quests.map(quest => {
        if (quest[2]) return;
        const qcfg = quests.getQuest(quest[0]);
        if (!qcfg) return;
        qcfg.tasks.map((task, taskindex) => {
            if (task.type === "dress") {
                user.setQuestTaskComplete(quest[0], taskindex);
            }
        })
    })
    let cfg = dress.get(itemId);
    if(cfg){
        itemId = itemId + variationId * CLOTH_VARIATION_ID_MULTIPLER
        if (cfg.category === 1000) user.setDressValueById(949, itemId);
        if (cfg.category == 107) user.setDressValueById(959, itemId);
        if (cfg.category == 106) user.setDressValueById(957, itemId);
        if (cfg.category == 102) user.setDressValueById(956, itemId);
        if (cfg.category == 101) user.setDressValueById(955, itemId);
        if (cfg.category == 100) user.setDressValueById(954, itemId);
        if (cfg.category == 7) user.setDressValueById(958, itemId);
        if (cfg.category == 6) user.setDressValueById(953, itemId);
        if (cfg.category == 4) user.setDressValueById(952, itemId);
        if (cfg.category == 3) user.setDressValueById(951, itemId);
        if (cfg.category == 1) user.setDressValueById(950, itemId);
    }
    reloadShopData(player, shop);
})


const reloadShopData = (player: PlayerMp, item: BusinessEntity) => {
    let catalog: number[] = [];
    let newcatalog = [...item.catalog]
    newcatalog.map((data, index) => {
        const cfg = dress.get(data.item);
        if(!cfg){
            return newcatalog.splice(index, 1);
        }
        if(player.user.is_male != cfg.male) return;
        catalog.push(data.item)
    })
    if (item.catalog.length != newcatalog.length){
        item.catalog = newcatalog;
    }
    if(player.dimension === 0){
        // player.user.teleport(item.positions[0].x, item.positions[0].y, item.positions[0].z, item.positions[0].h, player.id + 1)
        player.dimension = player.id + 1;
    }
    // console.log(item.id, item.name, item.sub_type, catalog, item.donate)
    CustomEvent.triggerClient(player, "clothshop:open", item.id, item.name, item.sub_type, catalog, item.donate, item.positions[0])
}

CustomEvent.registerClientCef("cloth:exit", player => {
    player.dimension = 0;
    player.user.reloadDress();
})


export const dressMenu = (player: PlayerMp, item: BusinessEntity) => {
    if (!player.user) return;
    const user = player.user;
    const openShop = () => {
        if (item.catalog.length == 0) return player.notify(player.user.LangString("dressShop.dde3dc4a295a8e516c1240985f619b33"), "error");
        if(user.getJobDress) return player.notify(player.user.LangString("dressShop.b166347f2f4876c38307acb0e411833c"), "error")
        if(!user.mp_character) return player.notify(player.user.LangString("dressShop.dbe9e03e12e22540e48e73d3dd4d562b"), "error")
        reloadShopData(player, item)
    }
    if (!user.isAdminNow(6) && item.userId !== user.id && !needUnload(player, item) && !canUserStartBizWar(user))
        return openShop();
    let m = menu.new(player, "", user.isAdminNow(6) ? player.user.LangString("dressShop.f46d2c01aed393e4e00f072b4ab036eb", item.id) : "");
    let sprite = "";

    switch (item.sub_type) {
        case 0:
            sprite = "shopui_title_lowendfashion";
            break;
        case 1:
            sprite = "shopui_title_lowendfashion2";
            break;
        case 2:
            sprite = "shopui_title_midfashion";
            break;
        case 3:
            sprite = "shopui_title_highendfashion";
            break;
    }
    m.sprite = sprite as any;


    m.newItem({
        name: langStringDefault("dressShop.94d53599ad97040bf82afa9aac73bafc"),
        onpress: () => {
            m.close();
            openShop()
        },
    })

    if (needUnload(player, item)) {
        m.newItem({
            name: langStringDefault("dressShop.4cfd0a8fc2710ea028bc4e8d361fb0ab"),
            onpress: () => {
                m.close();
                deliverSet(player)
            },
        })
    }

    createBizMenuBizWarItem(user, m, item);
    
    if (user.isAdminNow(6) || item.userId === user.id) {
        m.newItem({
            name: langStringDefault("dressShop.5b2be828c009dfb44d8b1309c384b92e"),
            onpress: () => {
                businessCatalogMenu(player, item, () => {
                    dressMenu(player, item)
                })
            },
        })
        m.newItem({
            name: langStringDefault("dressShop.643f813990a191b07e9247ba06713c75"),
            onpress: () => {
                orderDeliverMenu(player, item)
            }
        })

    }

    




    m.open();
};