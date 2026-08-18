import { langStringDefault } from "../../../shared/lang";
import {BusinessEntity} from "../typeorm/entities/business";
import {menu} from "../menu";
import {CustomEvent} from "../custom.event";
import {deliverSet, needUnload, orderDeliverMenu} from "./order.system";
import {
    BarberData,
    getBarberItemDeafaultCost,
    getCatalogIdByComponent,
    getComponentCost
} from "../../../shared/barbershop";
import {business, businessCatalogMenu, businessDefaultCostItem} from "../business";
import {getAchievConfigBiz} from "../../../shared/achievements";
import {canUserStartBizWar, createBizMenuBizWarItem, startBizWar} from "../bizwar";

export const loadData = (player: PlayerMp, item: BusinessEntity) => {
    if(!player.user.mp_character) return player.notify(player.user.LangString("barber.416eff6e9c1abc4b946683a2a088ca70"), "error")
    player.dimension = player.id + 1;
    player.user.reloadSkin()
    CustomEvent.triggerClient(player, "barber:load", player.user.barbershopData, item.positions[0], item.catalog.map(q => {
        let price = q.count <= 0 ? getBarberItemDeafaultCost(q.item) : q.price
        return {...q, price}
    }), item.id, player.user.skin);
}

CustomEvent.registerClient('barber:close', player => {
    player.dimension = 0;
    player.user.reloadSkin()
})

CustomEvent.registerCef("barbershop:buy", (player, data:Partial<BarberData>, id: number) => {
    const user = player.user;
    if(!user) return;
    const item = business.get(id);
    if(!item) return;
    if(!player.dimension) return;
    const cost = finalySum(data, item);
    user.tryPayment(cost[0], "all", () => true, user.LangString("barber.341137903ae1cba9e71b1bea1971f4c2"), user.LangString("barber.dfe522c8bc5b8c9a280bc180f16aa8fc", item.id)).then(q => {
        if(q){
            user.barbershopData = {...user.barbershopData, ...data};
            if(cost[1] > 0){
                business.addMoney(item, cost[1], langStringDefault("barber.713f18b806bfd83178ad64695a48278a", player.dbid),
                    false, false, true, true, cost[3]);
                player.user.achiev.setAchievTickBiz(item.type, item.sub_type, cost[1])
                cost[2].map(itm => {
                    if(item.catalog.find(q => q.item === itm && q.count > 0)) item.removeItemCountByItemId(itm, 1);
                })
            }
        }
        loadData(player, item);
    })

})


const finalySum = (data: Partial<BarberData>, biz: BusinessEntity): [number, number, number[], number] => {
    let sum = 0;
    let sumBiz = 0;
    let used: number[] = [];
    let purchasePrice = 0;
    for(let key in data){
        const res = getComponentCost(key as keyof BarberData, biz.catalog)
        const id = getCatalogIdByComponent(key as keyof BarberData);
        const item = biz.catalog.find(q => q.item === id);
        if(item && (item.count - used.filter(s => s == id).length) >= 1){
            sum += res;
            sumBiz += res;
            used.push(id);

            purchasePrice += businessDefaultCostItem(biz, item.item);
        } else {
            sum += getBarberItemDeafaultCost(id);
        }
    }
    return [sum, sumBiz, used, purchasePrice];
}

export const barberMenu = (player: PlayerMp, item: BusinessEntity) => {
    if (!player.user) return;
    const user = player.user;
    const openShop = () => {
        if (item.catalog.length == 0) return player.notify('Catalogul magazinului este momentan gol', 'error');
        loadData(player, item)
    }
    if (!user.isAdminNow(6) && item.userId !== user.id && !needUnload(player, item) && !canUserStartBizWar(user)) 
        return openShop();
    let m = menu.new(player, "", user.isAdminNow(6) ? player.user.LangString("barber.ba786e778e02ad2aa0a1d242e52502c7", item.id) : "");
    let sprite = "";
    switch (item.sub_type) {
        case 0:
            m.sprite = "shopui_title_barber";
            break;
        case 1:
            m.sprite = "shopui_title_barber2";
            break;
        case 2:
            m.sprite = "shopui_title_barber3";
            break;
        case 3:
            m.sprite = "shopui_title_barber4";
            break;
        default:
            m.title = player.user.LangString("barber.ab60a607d1ef2ae7ca4ec08a384cebe0")
            break;
    }
    m.sprite = sprite as any;

    m.newItem({
        name: langStringDefault("barber.5040e90fd9798c25879452c4014f300b"),
        onpress: () => {
            m.close();
            openShop()
        },
    })
    if (needUnload(player, item)){
        m.newItem({
            name: langStringDefault("barber.bc348cf967af1188a3ceabc7e41b60d4"),
            onpress: () => {
                m.close();
                deliverSet(player)
            },
        })
    }

    createBizMenuBizWarItem(user, m, item);
    
    if (user.isAdminNow(6) || item.userId === user.id) {
        m.newItem({
            name: langStringDefault("barber.460584eb69d486ef1e0dbc629137abca"),
            onpress: () => {
                businessCatalogMenu(player, item, () => {
                    barberMenu(player, item)
                })
            }
        })
        m.newItem({
            name: langStringDefault("barber.9699e4f0cc5d1021262559aec43f838c"),
            onpress: () => {
                orderDeliverMenu(player, item)
            }
        })

    }


    m.open();
};