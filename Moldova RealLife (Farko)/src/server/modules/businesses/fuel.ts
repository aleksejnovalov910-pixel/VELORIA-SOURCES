import { langStringDefault } from "../../../shared/lang";
import { PayData, PayType } from "../../../shared/pay";
import { BUSINESS_SUBTYPE_NAMES, BUSINESS_TYPE, getFuelCost } from "../../../shared/business";
import { fuelTypeNames, VEHICLE_FUEL_TYPE } from "../../../shared/vehicles";
import {business, businessCatalogMenu, businessDefaultCostItem} from "../business";
import { CustomEvent } from "../custom.event";
import { menu } from "../menu";
import { system } from "../system";
import { BusinessEntity } from "../typeorm/entities/business";
import { Vehicle } from "../vehicles";
import { deliverSet, needUnload, orderDeliverMenu } from "./order.system";
import {inventoryShared} from "../../../shared/inventory";
import {getAchievConfigBiz} from "../../../shared/achievements";
import {canUserStartBizWar, createBizMenuBizWarItem, startBizWar} from "../bizwar";
import {writeClientRatingLog} from "./tablet";


export const azsMenuOpenEvent = (player: PlayerMp, shop: BusinessEntity, electro: boolean) => {
    const user = player.user;
    if (!user) return;
    const vehicle = player.vehicle;
    if(!vehicle){
        const item = inventoryShared.get(!electro ? 817 : 862)
        if(!item || !item.defaultCost) return player.notify(player.user.LangString("fuel.881de80a1a75275874664f64e0b6d418"), "error");

        menu.accept(player, player.user.LangString("fuel.52908e50577ad027bac45c4bb15b2cc4", item.name, system.numberFormat(item.defaultCost))).then(status => {
            if(!status) return;
            if(user.money < item.defaultCost) return player.notify(player.user.LangString("fuel.46b2882b68fb66cdbf1718affa1f39b9"), "error");
            if(!user.tryGiveItem(item.item_id, true, true)) return;
            user.removeMoney(item.defaultCost, true, user.LangString("fuel.01669257a66089166df489cac4678899", item.name));
            business.addMoney(shop, item.defaultCost * 0.7, langStringDefault("fuel.0a52d7064137b998ac068da8df85b9d2", item.name));
        })

        return;
    }
    if (!vehicle) return player.notify(player.user.LangString("fuel.4a0d7780892ffc68b79c66e28b5a062e"), "error");
    if (!user.isDriver) return player.notify(player.user.LangString("fuel.b670d079ae500da5ebe7c79cb941b5bc"), "error");
    const vehconf = Vehicle.getVehicleConfig(vehicle);
    if(!vehconf) return player.notify(player.user.LangString("fuel.6e00bd16d03a5c6fc2d10e3871b7c251"), "error");
    CustomEvent.triggerClient(player, "fuel:open", electro, shop.catalog, shop.id, shop.name, Vehicle.getFuel(vehicle), Vehicle.getFuelMax(vehicle))
}

CustomEvent.registerCef("fuel:add", async (player, id: number, amount: number, payType: PayType, pin: string, electro: boolean, selectedFuel: VEHICLE_FUEL_TYPE) => {
    const user = player.user;
    if (!user) return langStringDefault("fuel.d032dde96d56f1ac4c21eaecdbaf7a46");
    const veh = player.vehicle;
    if (!veh) return user.LangString("fuel.c44f5594e9248cbe64cd93ef3ccd77d1", electro ? user.LangString("fuel.525f38537d6ce87df33b381cff1dd3dd") : user.LangString("fuel.961780fd5e82a453d53d7a7986022772"));
    if (!user.isDriver) return user.LangString("fuel.a908c97883e60d7d93e74a842cd14b64");
    const vehconf = Vehicle.getVehicleConfig(veh);
    if (!vehconf) return user.LangString("fuel.90ae336c27e6092ce15c636452a0a4ec");
    const biz = business.get(id);
    if(!biz) return user.LangString("fuel.362799eef3ce6351a5a64aede081035d");
    if (biz.type !== BUSINESS_TYPE.FUEL) return user.LangString("fuel.72352f22a97776cdbe7d7d677f227636");
    if(electro && vehconf.fuel_type !== VEHICLE_FUEL_TYPE.ELECTRO) return user.LangString("fuel.5effaa4c649626f2336552efcdfccd1d");
    if(!electro && vehconf.fuel_type === VEHICLE_FUEL_TYPE.ELECTRO) return user.LangString("fuel.43523468cb14fcae7bfe9040d4707f01");
    if (vehconf.fuel_type !== selectedFuel) return user.LangString("fuel.54ce39d5b2ae091b99abd4b35ea975cd");

    const item = biz.catalog.find(q => q.item === selectedFuel);
    if (!item) return user.LangString("fuel.7e686b0f23514306c2a0185d5fb08462");
    let sum: number;
    if(item.count < amount) sum = getFuelCost(selectedFuel) * amount;
    else sum = item.price * amount;

    if(payType === PayType.COMPANY && (!user.fractionData || !user.fractionData.gos)) return user.LangString("fuel.e3c696b03fb058bcb9673177a1d351e4");
    if(payType === PayType.COMPANY && veh.fraction !== user.fraction) return user.LangString("fuel.18dbbb7e7e3f4d6c94725f3fe78acdf9");

    if (payType === PayType.CASH && user.money < sum) return user.LangString("fuel.b0d9c40b74f1f57c07df391d6dd763d7");

    if (payType === PayType.CARD && !user.tryRemoveBankMoney(sum, true, user.LangString("fuel.c40f9c3be93a48a3ce7516c68898bd2a", vehconf.name, fuelTypeNames[selectedFuel], amount, electro ? "kW" : "l"), `${BUSINESS_SUBTYPE_NAMES[biz.type][biz.sub_type]} #${biz.id}`)) return user.LangString("fuel.3aa143eb5d73dff3936b38dca33642e9");
    if (payType === PayType.CASH) user.removeMoney(sum, true, user.LangString("fuel.455beaa783c9bc69d9f09de35bc593a3", vehconf.name, fuelTypeNames[selectedFuel], amount, electro ? "kW" : "l", BUSINESS_SUBTYPE_NAMES[biz.type][biz.sub_type], biz.id));
    Vehicle.addFuel(veh, amount);
    if([PayType.CASH, PayType.CARD].includes(payType)) player.user.achiev.setAchievTickBiz(biz.type, biz.sub_type, sum)
    writeClientRatingLog(player, biz.id, businessDefaultCostItem(biz, biz.catalog.find(s => s.item === selectedFuel).item, 1), fuelTypeNames[selectedFuel], amount);
    player.notify(player.user.LangString("fuel.d8b1a29a73dde10fa000cf7d269b58e8", electro ? player.user.LangString("fuel.0273748749eb0aba27a8cc0eee93e671") : player.user.LangString("fuel.bd7adfbebee3cd631a9adee676c09f19")), "success");
    if(item.count >= amount){
        const o = [...biz.catalog]
        const fuelItem = o.find(s => s.item === selectedFuel);
        fuelItem.count -= amount;
        biz.catalog = o;
        business.addMoney(biz, sum, langStringDefault("fuel.ec0576d11a09e03a2ff48c6f9d24a7cf", fuelTypeNames[selectedFuel], amount, electro ? "kW" : "l"),
            false, false, true, true, businessDefaultCostItem(biz, fuelItem.item, amount));
    }
    return "";
})

export const azsMenuBase = (player: PlayerMp, item: BusinessEntity, electro: boolean) => {
    const user = player.user;
    if(!user) return;
    if (!user.isAdminNow(6) && item.userId !== user.id && !needUnload(player, item) && !canUserStartBizWar(user))
        return azsMenuOpenEvent(player, item, electro);
    const m = menu.new(player, "", player.user.LangString("fuel.07229bddbf929e5d3e47d560f7fbf071"));
    m.sprite = "shopui_title_gasstation";

    if (needUnload(player, item)){
        m.newItem({
            name: langStringDefault("fuel.a0c19293411a403805bf23e7ea559ef3"),
            onpress: () => {
                m.close();
                deliverSet(player)
            },
        })
    }

    m.newItem({
        name: langStringDefault("fuel.2c0206cde4360cd7d9f7cb2f3a56efb7"),
        onpress: () => {
            m.close();
            azsMenuOpenEvent(player, item, electro);
        },
    })

    createBizMenuBizWarItem(user, m, item);
    
    if (user.isAdminNow(6) || item.userId === user.id){

        m.newItem({
            name: langStringDefault("fuel.9a6c2d3df324daf621b08a43168312c7"),
            onpress: () => {
                orderDeliverMenu(player, item)
            }
        })


        m.newItem({
            name: langStringDefault("fuel.278123f8631e1d28e9da49230c5631ce"),
            onpress: () => {

                businessCatalogMenu(player, item, () => {
                    azsMenuBase(player, item, electro)
                })
            }
        })

    }

    m.open();
}