import { langStringDefault } from "../../../shared/lang";
import { BusinessEntity } from "../typeorm/entities/business";
import { menu } from "../menu";
import { OWNER_TYPES } from "../../../shared/inventory";
import { system } from "../system";
import {business, businessCatalogMenu, businessDefaultCostItem, clearBusinessProduct} from "../business";
import { inventory } from "../inventory";
import { CustomEvent } from "../custom.event";
import { tattoosShared } from "../../../shared/tattoos";
import { tattooRemoveCostMultipler, tattooRemoveMoneySendToBusinessMultipler } from "../../../shared/economy";
import { BUSINESS_TYPE } from "../../../shared/business";
import { needUnload, deliverSet, orderDeliverMenu } from "./order.system";
import {getAchievConfigBiz} from "../../../shared/achievements";
import {canUserStartBizWar, createBizMenuBizWarItem} from "../bizwar";
import {writeClientRatingLog} from "./tablet";

CustomEvent.registerCef("tattoo:buy", (player, shopId: number, itemId: number) => {
    if (!player.user) return;
    const user = player.user;
    if(user.tattoos.length >= 20) return player.notify(player.user.LangString("tattoo.16dc0528ac21817da0914e0511d5d8a3"), "error")
    let shop = business.get(shopId);
    if (!shop) return player.notify(player.user.LangString("tattoo.5fe6a77a4f537fbf2f813dc880d1c6e2"), "error"), reloadShopData(player, shop);
    if (shop.type !== BUSINESS_TYPE.TATTOO_SALON) return player.notify(player.user.LangString("tattoo.7a5053263d2aecfbe9921c340fe21eb2"), "error"), reloadShopData(player, shop);
    const conf = shop.catalog.find(q => q.item == itemId);
    if (!conf) return player.notify(player.user.LangString("tattoo.46cf8e053c33222c09f107a6a1dc98b7"), "error"), reloadShopData(player, shop);
    let tattooCfg = tattoosShared.getTattoo(conf.item);
    if (!tattooCfg) return player.notify(player.user.LangString("tattoo.b214ccb355b9b4829241ca33829cd124"), "error"), reloadShopData(player, shop);
    if (!conf || !conf.price) return player.notify(player.user.LangString("tattoo.c21a36eaa3b8feba622b15be16ff660e"), "error"), reloadShopData(player, shop);
    if (conf.count <= 0 && shop.userId) return player.notify(player.user.LangString("tattoo.c6873c56e74274859322519477178d4b"), "error")
    if (shop.donate) {
        if (user.donate_money < conf.price) return player.notify(player.user.LangString("tattoo.f1372f2fdb7dd4b2a619adcf445e5948"), "error")
    } else {
        if (user.money < conf.price) return player.notify(player.user.LangString("tattoo.8ca843c17a48adead4eb3739fd55d0bd"), "error")
    }
    if(conf.count){
        shop.setItemCountByItemId(conf.item, conf.count - 1)
        business.addMoney(shop, conf.price, langStringDefault("tattoo.c6fa7fa004a68d31c97c714e4e152ad2", player.dbid, tattooCfg.name), false,
            false, true, true, businessDefaultCostItem(shop, conf.item));
    }
    if (shop.donate) {
        user.removeDonateMoney(conf.price, user.LangString("tattoo.e202dc16eef5189ebe72574a762e1835"))
    } else {
        user.removeMoney(conf.price, true, user.LangString("tattoo.506fc077ff2fe52236f9bf71a9c9cc5c"));
        player.user.achiev.setAchievTickBiz(shop.type, shop.sub_type, conf.price)
    }
    user.newTattoo(tattooCfg.collection, user.male ? tattooCfg.overlay_male : tattooCfg.overlay_female)
    writeClientRatingLog(player, shopId, conf.price, tattooCfg.name, 1);
    player.notify(player.user.LangString("tattoo.b3bd10e1c387b7622067a058f7e257f7"), "success");
    reloadShopData(player, shop);
})


CustomEvent.registerCef("tattoo:remove", (player, shopId: number, itemId: number, removePrice: number) => {
    if (!player.user) return;
    const user = player.user;
    let shop = business.get(shopId);
    if (!shop) return player.notify(player.user.LangString("tattoo.2f37a53e6baca7bd5a06080a43986dc7"), "error"), reloadShopData(player, shop);
    if (shop.type !== BUSINESS_TYPE.TATTOO_SALON) return player.notify(player.user.LangString("tattoo.072c676f1585e7a1ad1bed06bcebb6a3"), "error"), reloadShopData(player, shop);
    const q = user.tattoos[itemId];
    if (!q) return player.notify(player.user.LangString("tattoo.a003fb8fbf584fe6862f857893daab3d"), "error");
    let tattooCfg = tattoosShared.findTattoo(q[0], q[1])
    if(user.haveTattoo(tattooCfg.collection, user.male ? tattooCfg.overlay_male : tattooCfg.overlay_female)){
        if (user.money < tattooCfg.price * tattooRemoveCostMultipler) return player.notify(player.user.LangString("tattoo.5880f6c48be80fd3b262ea889e369619"), "error");
        user.removeMoney(tattooCfg.price * tattooRemoveCostMultipler, true, user.LangString("tattoo.c123547a6621381fb804519f37393310"));
        user.removeTattoo(tattooCfg.collection, user.male ? tattooCfg.overlay_male : tattooCfg.overlay_female);
        business.addMoney(shop, tattooCfg.price * tattooRemoveCostMultipler * tattooRemoveMoneySendToBusinessMultipler, langStringDefault("tattoo.838b3bae49c446758bed661950cdcf2d", player.dbid, tattooCfg.name));
        player.notify(player.user.LangString("tattoo.e9e2474f5964491f8c654034bbf506db"), "success");
        reloadShopData(player, shop);
        return;
    }
})


const reloadShopData = (player: PlayerMp, item: BusinessEntity) => {
    let catalog: { item_id: number, count: number, price: number }[] = [];
    item.catalog.map(data => {
        if (!data.price) return;
        if (!data.count && item.userId) return;
        let cfg = tattoosShared.getTattoo(data.item);
        if(!cfg) return;
        if(player.user.male && !cfg.overlay_male) return;
        if(!player.user.male && !cfg.overlay_female) return;
        catalog.push({ item_id: data.item, price: data.price, count: data.count })
    })
    if (player.dimension === 0) {
        player.user.teleport(item.positions[0].x, item.positions[0].y, item.positions[0].z, item.positions[0].h, player.id + 1)
        player.user.undress();
    }
    CustomEvent.triggerClient(player, "tattooshop:open", item.id, item.name, item.sub_type, catalog, player.user.tattoos, item.positions[0].h)
}


CustomEvent.registerClient("tattoo:exit", player => {
    player.user.reloadSkin();
    player.dimension = 0;
})

export const tattooMenu = (player: PlayerMp, item: BusinessEntity) => {
    if (!player.user) return;
    const user = player.user;
    const openShop = () => {
        if (item.catalog.length == 0) return player.notify(player.user.LangString("tattoo.747b1c6bbc7e08fb0ac34e87681b6864"), "error");
        if(!user.mp_character) return player.notify(player.user.LangString("tattoo.b58676ccffd64734c29d583266d02f36"), "error")
        reloadShopData(player, item)
    }
    if (!user.isAdminNow(6) && item.userId !== user.id && !needUnload(player, item) && !canUserStartBizWar(user))
        return openShop();
    let m = menu.new(player, "", user.isAdminNow(6) ? player.user.LangString("tattoo.73ca492bd61c7b7d83991c6075b831fb", item.id) : "");
    let sprite = "";
    switch (item.sub_type) {
        case 0:
            m.sprite = "shopui_title_tattoos";
            break;
        case 1:
            m.sprite = "shopui_title_tattoos2";
            break;
        case 2:
            m.sprite = "shopui_title_tattoos3";
            break;
        case 3:
            m.sprite = "shopui_title_tattoos4";
            break;
        case 4:
            m.sprite = "shopui_title_tattoos5";
            break;
        default:
            m.title = "Tattoo-Salon"
            break;
    }
    m.sprite = sprite as any;

    m.newItem({
        name: langStringDefault("tattoo.d7715120bb709d8a640294db3fb9847e"),
        onpress: () => {
            m.close();
            openShop()
        },
    })
    if (needUnload(player, item)){
        m.newItem({
            name: langStringDefault("tattoo.8969f85b879ec1acf4bbac0b1226e0a7"),
            onpress: () => {
                m.close();
                deliverSet(player)
            },
        })
    }

    createBizMenuBizWarItem(user, m, item);
    
    if (user.isAdminNow(6) || item.userId === user.id) {
        m.newItem({
            name: langStringDefault("tattoo.b55a95e7b396287e7ea709a916416cfd"),
            onpress: () => {
                businessCatalogMenu(player, item, () => {
                    tattooMenu(player, item)
                })
            },
        })
        m.newItem({
            name: langStringDefault("tattoo.39af48f21121a7dccc6cf75c4cae7e67"),
            onpress: () => {
                orderDeliverMenu(player, item)
            }
        })
    }

    




    m.open();
};