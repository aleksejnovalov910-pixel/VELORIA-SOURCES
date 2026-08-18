import { langStringDefault } from "../../../shared/lang";
import {BusinessEntity} from "../typeorm/entities/business";
import {menu} from "../menu";
import {business, businessCatalogMenu, businessDefaultCostItem} from "../business";
import {deliverSet, needUnload, orderDeliverMenu} from "./order.system";
import {Vehicle} from "../vehicles";
import {canUserStartBizWar, createBizMenuBizWarItem, startBizWar} from "../bizwar";
import {writeClientRatingLog} from "./tablet";



export const openWashBuyMenu = (player: PlayerMp, item: BusinessEntity) => {
    const user = player.user
    const vehicle = player.vehicle;
    if(!user) return;

    if(!vehicle) {
        player.notify(player.user.LangString("carwash.4a8df10b22ecbddb61ea24b637841f71"), "error");
        return false;
    }
    if (!user.isDriver) {
        player.notify(player.user.LangString("carwash.342f0703002eaf0b94f477ad72a1f74d"), "error")
        return false
    }
    if(Vehicle.getDirtLevel(vehicle) < 0.02) return player.notify(player.user.LangString("carwash.3671c3ad7260352530f21f02745bda0f"), "error");
    const cfg = item.catalog[0];


    user.tryPayment(cfg.price, "all", () => {
        return player.vehicle == vehicle && user.isDriver && Vehicle.getDirtLevel(vehicle) >= 0.02
    }, user.LangString("carwash.6d64f48e70dcbbd63e15add16d7a8985"), user.LangString("carwash.edae56fd12057ae6d750e0d900e6fa76", item.id)).then(status => {
        if(!status) return;
        Vehicle.setDirtLevel(vehicle, 0.0)
        player.notify(player.user.LangString("carwash.2669bde9a7c0e7f366896656c9df7584"), "success");
        writeClientRatingLog(player, item.id, cfg.price, langStringDefault("carwash.7b9e620659197c8887f4545312278f85"), 1);
        if(cfg.count > 0){
            cfg.count--;
            item.catalog = [cfg];
            //@ts-ignore
            business.addMoney(item, cfg.p, business.user.LangString("carwash.ade9e4cf5702a3b52dc756eac86186d0"), false, false, true,
                true, businessDefaultCostItem(item, cfg.item));
        }
    })

}





export const washMenu = (player: PlayerMp, item: BusinessEntity) => {
    if (!player.user) return;
    const user = player.user;
    if (!user.isAdminNow(6) && 
        item.userId !== user.id && 
        !needUnload(player, item) &&
        !canUserStartBizWar(user)) return player.notify(player.user.LangString("carwash.1b86d30ee1763ab2718d732743813eef"), "error")
    let m = menu.new(player, player.user.LangString("carwash.560c8d01c4baeda70ffbd5c2269e0c2b"), user.isAdminNow(6) ? player.user.LangString("carwash.7329626077628c7b85b9825016164498", item.id) : "");

    if (needUnload(player, item)) {
        m.newItem({
            name: langStringDefault("carwash.38872c090648c33b409c3b73af5f6f10"),
            onpress: () => {
                m.close();
                deliverSet(player)
            },
        })
    }

    createBizMenuBizWarItem(user, m, item);
    
    if (user.isAdminNow(6) || item.userId === user.id) {
        m.newItem({
            name: langStringDefault("carwash.e0db3b6b491388e6bff2a47146400a2b"),
            onpress: () => {
                businessCatalogMenu(player, item, () => {
                    washMenu(player, item)
                })
            }
        })
        m.newItem({
            name: langStringDefault("carwash.18cffe51a29bda121c3f72e8071528eb"),
            onpress: () => {
                orderDeliverMenu(player, item)
            }
        })

    }

    m.open();
};