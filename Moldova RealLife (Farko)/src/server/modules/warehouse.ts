import {WarehouseEntity} from "./typeorm/entities/warehouse";
import {colshapes} from "./checkpoints";
import {WAREHOUSE_CONTROL_POS, WAREHOUSE_INTERIOR_POS, WAREHOUSE_SLOTS_POS} from "../../shared/warehouse";
import {CustomEvent} from "./custom.event";
import {menu} from "./menu";
import {system} from "./system";
import {writeSpecialLog} from "./specialLogs";

export const warehouses = {
    loadAll: () => {
        return new Promise(resolve => {
            WarehouseEntity.find().then(list => {
                list.map(item => warehouses.load(item))
                resolve(null)
            })
        })
    },
    load: (item: WarehouseEntity) => {item.draw()},
    get: (id: number) => WarehouseEntity.get(id),
    get list(){
        return WarehouseEntity.listArray
    },
}

colshapes.new(WAREHOUSE_CONTROL_POS, player => {
    return player.user?.LangString("warehouse.control.title")
}, player => {
    const user = player.user;
    if(!user) return;
    if(!player.dimension) return;
    const item = warehouses.get(player.dimension);
    if(!item) return;
    item.control(player)
}, {
    dimension: -1,
    drawStaticName: "scaleform",
    type: 27
})

colshapes.new(WAREHOUSE_INTERIOR_POS, player => {
    return player.user?.LangString("warehouse.int.title")
}, player => {
    const user = player.user;
    if(!user) return;
    if(!player.dimension) return;
    const item = warehouses.get(player.dimension);
    if(!item) return;
    user.teleport(item.x, item.y, item.z, item.h, item.d)
}, {
    dimension: -1,
    drawStaticName: "scaleform",
    type: 27
})

CustomEvent.registerClient("admin:gamedata:newwarehouse", player => {
    const user = player.user;
    if(!user) return;
    if(!user.hasPermission("admin:gamedata:newwarehouse")) return;

    let price = 0;

    const s = () => {
        const m = menu.new(player, user.LangString("warehouse.admin.menu.title"));
        m.newItem({
            name: user.LangString("warehouse.admin.menu.item1"),
            more: system.numberFormat(price),
            onpress: () => {
                menu.input(player, user.LangString("warehouse.admin.menu.item1.input"), price, 8, "int").then(cost => {
                    if(!cost || cost <= 0 || cost >= 999999999) return;
                    price = cost;
                    s();
                })
            }
        })
        m.newItem({
            name: user.LangString("warehouse.admin.menu.item2"),
            desc: user.LangString("warehouse.admin.menu.item2.desc"),
            onpress: () => {
                if(!price) return player.notify(user.LangString("warehouse.admin.menu.item2.err"), "error");
                m.close();
                let item = new WarehouseEntity();
                item.position = new mp.Vector3(player.position.x, player.position.y, player.position.z - 1);
                item.d = player.dimension;
                item.h = player.heading;
                item.price = price;
                item.chests = (new Array(WAREHOUSE_SLOTS_POS.length)).fill(null);
                item.tax = 0;
                item.key = system.randomNumber(6);
                item.save().then(i => {
                    warehouses.load(i)
                    writeSpecialLog(`${player.user.LangString("warehouse.admin.menu.item2.logPref")} - ${player.position.x}, ${player.position.y}, ${player.position.z}`, player, 0);
                    player.notify(player.user.LangString("warehouse.admin.menu.item2.savenotify"), "success")
                }).catch(err => {
                    system.debug.error(err)
                    player.notify(player.user.LangString("warehouse.admin.menu.item2.savenotifyfail"));
                })
            }
        })
        m.open();

    }

    s();

})