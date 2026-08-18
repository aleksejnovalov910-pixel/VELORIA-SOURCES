import {TAXI_CONF} from "../../shared/taxi";
import {colshapes} from "./checkpoints";
import {menu} from "./menu";
import {Vehicle} from "./vehicles";
import {system} from "./system";
import {User} from "./user";
import {NpcSpawn} from "./npc";
import {CustomEvent} from "./custom.event";
import {LEVEL_PERMISSIONS} from "../../shared/level.permissions";
import {getAchievConfigByType} from "../../shared/achievements";
import { langStringDefault } from "../../shared/lang";

colshapes.new(TAXI_CONF.carRent.pos, player => player.user.LangString("taxi.title"), player => {
    // const user = player.user;
    // if(!user) return;
    // if (user.level < LEVEL_PERMISSIONS.TAXI) return player.notify(player.user.LangString("taxi.level", LEVEL_PERMISSIONS.TAXI))
    const user = player.user;
    if (!user) return;

    if (user.playtime < LEVEL_PERMISSIONS.TAXI) {
        return player.notify(player.user.LangString("taxi.level", LEVEL_PERMISSIONS.TAXI));
    }    
    ////
    if(!user.taxiJob) return player.notify(player.user.LangString("taxi.taxiJob"), 'error', 'CHAR_TAXI');
    const m = menu.new(player, player.user.LangString("taxi.title"), player.user.LangString("taxi.subtitle"));

    TAXI_CONF.carRent.cars.map(car => {
        const cfg = Vehicle.getVehicleConfig(car.model);
        if(!cfg) return;
        m.newItem({
            name: cfg.name,
            more: `$${system.numberFormat(car.cost)}`,
            desc: player.user.LangString("taxi.desc"),
            onpress: () => {
                user.tryPayment(car.cost, 'all', () => {
                    return user.taxiJob && !user.taxiCar
                }, player.user.LangString("taxi.payment", cfg.name), 'TAXI').then(status => {
                    if(!status) return;
                    menu.close(player);
                    user.taxiCar = Vehicle.spawn(car.model, TAXI_CONF.carRent.pos, TAXI_CONF.carRent.h, 0, false, false);
                    setTimeout(() => {
                        if(!mp.players.exists(player)) return;
                        if(!mp.vehicles.exists(user.taxiCar)) return;
                        Vehicle.setPrimaryColor(user.taxiCar, TAXI_CONF.carRent.primaryColor.r, TAXI_CONF.carRent.primaryColor.g, TAXI_CONF.carRent.primaryColor.b)
                        Vehicle.setSecondaryColor(user.taxiCar, TAXI_CONF.carRent.secondaryColor.r, TAXI_CONF.carRent.secondaryColor.g, TAXI_CONF.carRent.secondaryColor.b)
                    }, 100)
                    setTimeout(() => {
                        if(!mp.players.exists(player)) return;
                        if(!mp.vehicles.exists(user.taxiCar)) return;
                        user.taxiCar.taxiCar = user.id;
                        player.user.putIntoVehicle(user.taxiCar, 0);
                        CustomEvent.triggerClient(player, 'taxi:car', user.taxiCar.id)
                    }, 1000);
                })
            }
        })
    })
    m.open();
})

system.createBlip(198, 70, TAXI_CONF.carRent.pos, langStringDefault("taxi.taxiBlip"));

Vehicle.addBlockNpcCarZone(TAXI_CONF.carRent.pos)
// new NpcSpawn(
//     TAXI_CONF.npc.pos,
//     TAXI_CONF.npc.heading,
//     TAXI_CONF.npc.model,
//     TAXI_CONF.npc.name,
//     (player) => {
//         const user = player.user;
//         if (!user) return;
//         const m = menu.new(player, player.user.LangString("taxi.title"), player.user.LangString("taxi.subtitle"));

//         if (user.taxiJob) {
//             m.newItem({
//                 name: player.user.LangString("taxi.menu.item1"),
//                 onpress: () => {
//                     m.close();
//                     player.notify(player.user.LangString("taxi.menu.item1.notify"), 'error', 'CHAR_TAXI');
//                     leaveJob(player);
//                 }
//             });
//         } else {
//             m.newItem({
//                 name: player.user.LangString("taxi.menu.item2"),
//                 onpress: () => {
//                     if (user.playtime < LEVEL_PERMISSIONS.TAXI)
//                         return player.notify(player.user.LangString("taxi.menu.item2.notify", LEVEL_PERMISSIONS.TAXI));
//                     m.close();
//                     player.notify(player.user.LangString("taxi.menu.item2.notify2"), 'success', 'CHAR_TAXI');
//                     user.taxiJob = true;
//                 }
//             });
//         }

//         m.open();
//     },
//     5.0 // ← AICI setezi raza de colshape
// );

new NpcSpawn(TAXI_CONF.npc.pos, TAXI_CONF.npc.heading, TAXI_CONF.npc.model, TAXI_CONF.npc.name, (player) => {
    const user = player.user;
    if(!user) return;
    const m = menu.new(player, player.user.LangString("taxi.title"), player.user.LangString("taxi.subtitle"));

    if(user.taxiJob){
        m.newItem({
            name: player.user.LangString("taxi.menu.item1"),
            onpress: () => {
                m.close();
                player.notify(player.user.LangString("taxi.menu.item1.notify"), 'error', 'CHAR_TAXI')
                leaveJob(player);
            }
        })
    } else {
        m.newItem({
            name: player.user.LangString("taxi.menu.item2"),
            onpress: () => {
                if (user.playtime < LEVEL_PERMISSIONS.TAXI) return player.notify(player.user.LangString("taxi.menu.item2.notify", LEVEL_PERMISSIONS.TAXI))
                m.close();
                player.notify(player.user.LangString("taxi.menu.item2.notify2"), 'success', 'CHAR_TAXI');
                user.taxiJob = true;
            }
        })
    }
    m.open();
})


let orderids = 0;

export const taxi = {
    calculateOrderCost: (start: {x: number, y: number}, end: {x: number, y: number}) => {
        const dist = system.distanceToPos2D(start, end);
        return Math.floor(TAXI_CONF.cost.base + TAXI_CONF.cost.km * (dist / 1000));
    },
    list: <{id: number, user: number, driver?: number, start: {x: number, y: number}, end: {x: number, y: number}, startName: string, endName: string, orderName: string, fake?:true}[]>[],
    newOrder: (player: PlayerMp, start: {x: number, y: number}, end: {x: number, y: number}, startName: string, endName: string) => {
        const user = player.user;
        if(!user) return;
        if(user.taxiJob) return player.notify(player.user.LangString("taxi.neworder.taxiJob"), 'error', 'CHAR_TAXI');
        if(taxi.list.find(order => order.user === user.id)) return player.notify(player.user.LangString("taxi.neworder.list"), 'error', 'CHAR_TAXI');
        const dist = system.distanceToPos2D(start, end);
        if(dist < 100) return player.notify(player.user.LangString("taxi.neworder.dist"), 'error', 'CHAR_TAXI');
        orderids++;
        player.notify(player.user.LangString("taxi.neworder.notify"), 'success', 'CHAR_TAXI');
        mp.players.toArray().filter(target => target.user && target.user.taxiJob).map(target => {
            const str = target.user.LangString("taxi.neworder.str", system.numberFormat(taxi.calculateOrderCost(start, end)), system.distanceToPos2D(start, end).toFixed(2))
            target.notify(str, 'info', 'CHAR_TAXI');
        })
        taxi.list.push({id: orderids, user: user.id, start, end, startName, endName, orderName: user.name});
    },
    removeOrder: (id: number) => {
        if(taxi.list.findIndex(q => q.id === id) > -1) taxi.list.splice(taxi.list.findIndex(q => q.id === id), 1);
    },
    takeOrder: (player: PlayerMp, id: number) => {
        const user = player.user;
        if(!user) return;
        if(!user.taxiJob) return player.notify(player.user.LangString('taxi.takeOrder.taxiJob'), 'error', 'CHAR_TAXI');
        if(!user.taxiCar) return player.notify(player.user.LangString('taxi.takeOrder.taxiCar'), 'error', 'CHAR_TAXI');
        if(player.taxiNpc) return player.notify(player.user.LangString('taxi.takeOrder.taxiNpc'), 'error', 'CHAR_TAXI');
        if(taxi.list.find(q => q.driver === user.id)) return player.notify(player.user.LangString("taxi.takeOrder.list"), 'error', 'CHAR_TAXI');
        const order = taxi.list.find(q => q.id === id)
        if(!order) return player.notify(player.user.LangString("taxi.takeOrder.notOrder"), 'error', 'CHAR_TAXI');
        if(order.user === user.id) return player.notify(player.user.LangString("taxi.takeOrder.me"), 'error', 'CHAR_TAXI');
        const passanger = User.get(order.user);
        if(!passanger || !mp.players.exists(passanger)) return player.notify(player.user.LangString("taxi.takeOrder.notOrder"), 'error', 'CHAR_TAXI'), taxi.removeOrder(id);
        if(order.driver) return player.notify(player.user.LangString("taxi.takeOrder.driver"), 'error', 'CHAR_TAXI');
        if(!passanger.user.tryRemoveBankMoney(taxi.calculateOrderCost(order.start, order.end), true, passanger.user.LangString('taxi.takeOrder.tryRemoveMoney', order.id, order.startName, order.endName)
        , passanger.user.LangString("taxi.takeOrder.tryRemoveMoneyInit"))){
            taxi.removeOrder(id);
            passanger.notify(passanger.user.LangString("taxi.takeOrder.tryRemoveMoney.notify"), 'error', 'CHAR_TAXI');
            return player.notify(player.user.LangString("taxi.takeOrder.tryRemoveMoney.notify2"), 'error', 'CHAR_TAXI');
        }
        order.driver = user.id;
        player.notify(player.user.LangString("taxi.takeOrder.notify"), 'success', 'CHAR_TAXI');
        passanger.notify(passanger.user.LangString("taxi.takeOrder.notify2"), 'success', 'CHAR_TAXI');
        user.setWaypoint(order.start.x, order.start.y, 0, user.LangString("taxi.takeOrder.waypoint", order.id));
    },
    orderList: (player: PlayerMp) => {
        const user = player.user;
        if(!user) return;
        const m = menu.new(player, user.LangString("taxi.takeOrder.tryRemoveMoneyInit"), user.LangString("taxi.orderList.subtitle"));
        let myOrder = taxi.list.find(q => q.driver === user.id)
        if(myOrder){
            m.newItem({
                name: user.LangString("taxi.orderList.menu.item1"),
                onpress: () => {
                    myOrder = taxi.list.find(q => q.driver === user.id)
                    if(!myOrder) return player.notify(player.user.LangString("taxi.orderList.menu.item1.myOrder"), 'error', 'CHAR_TAXI'), taxi.orderList(player);
                    menu.accept(player, player.user.LangString("taxi.orderList.menu.item1.accept"), 'big').then(status => {
                        if(!status) return;
                        taxi.setOrderEnd(myOrder.id, false);
                        taxi.orderList(player);
                    })
                }
            })
        }
        const list = taxi.list.filter(q => !q.driver);
        if(list.length === 0){
            m.newItem({
                name: player.user.LangString("taxi.orderList.menu.item2"),
                more: ``
            })
            m.newItem({
                name: player.user.LangString("taxi.orderList.menu.item3"),
                desc: player.user.LangString("taxi.orderList.menu.item3.desc"),
                more: ``,
                onpress: () => {
                    if(player.taxiNpc) return player.notify(player.user.LangString("taxi.orderList.menu.item3.taxiNPC"), 'error');
                    if(!user.taxiCar) return player.notify(player.user.LangString("taxi.orderList.menu.item3.taxiCar"), 'error');
                    myOrder = taxi.list.find(q => q.driver === user.id)
                    if(myOrder) return player.notify(player.user.LangString("taxi.orderList.menu.item3.myOrder"), 'error', 'CHAR_TAXI'), taxi.orderList(player);
                    m.close();
                    const ind = system.randomArrayElementIndex(TAXI_CONF.ordersNpc)
                    if(ind === -1) return;
                    let el = TAXI_CONF.ordersNpc[ind]
                    player.taxiNpc = el.price
                    CustomEvent.triggerClient(player, 'taxi:random', ind)
                }
            })
        }
        list.map((order) => {
            m.newItem({
                name: `${order.orderName}`,
                more: `$${system.numberFormat(taxi.calculateOrderCost(order.start, order.end))} / ${system.distanceToPos2D(order.start, order.end).toFixed(2)}km`,
                desc: player.user.LangString("taxi.orderList.menu.item4.desc", order.startName, order.endName),
                onpress: () => {
                    taxi.takeOrder(player, order.id);
                    taxi.orderList(player);
                }
            })
        })
        m.open();
    },
    setOrderEnd: (id: number, status: boolean) => {
        const order = taxi.list.find(q => q.id === id);
        if(!order) return;
        const sum = taxi.calculateOrderCost(order.start, order.end);
        const passanger = User.get(order.user)
        if(!status){
            if(passanger && mp.players.exists(passanger)) passanger.user.addMoney(sum, true, passanger.user.LangString("taxi.setOrderEnd.addMoney"));
        } else {
            const driver = User.get(order.driver)
            if(driver && mp.players.exists(driver)) {
                driver.user.addMoney(sum * TAXI_CONF.rewardMultipler, true, driver.user.LangString("taxi.setOrderEnd.addMoney2", order.user))
                // mp.events.call(JOB_TASK_MANAGER_EVENT, driver, 'taxi');
                driver.user.achiev.achievTickByType("taxiDriverCount")
                driver.user.achiev.achievTickByType("taxiDriverSum", sum * TAXI_CONF.rewardMultipler)
            }
            if(passanger && mp.players.exists(passanger)){
                passanger.user.achiev.achievTickByType("taxiPassengerCount")
                passanger.user.achiev.achievTickByType("taxiPassengerSum", sum)
            }
        }
        return taxi.removeOrder(id);
    }
}

CustomEvent.registerClient('taxi:delivernpc', player => {
    if(!player.taxiNpc) return;
    player.user.addMoney(player.taxiNpc, true, player.user.LangString("taxi.delivernpc.addMoney"));
    player.user.achiev.achievTickByType("taxiDriverCount")
    player.user.achiev.achievTickByType("taxiDriverSum", player.taxiNpc)
    player.taxiNpc = null;
})

mp.events.add('playerQuit', player => {
    leaveJob(player)
});

mp.events.add('playerExitVehicle', (player: PlayerMp, vehicle: VehicleMp) => {
    if(!player.user) return;
    if(player.dimension) return;
    if(!vehicle.taxiCar) return;
    const order = taxi.list.find(q => q.user === player.user.id && q.driver === vehicle.taxiCar);
    if(!order) return;
    const driver = User.get(vehicle.taxiCar);
    if(!driver) return taxi.setOrderEnd(order.id, false);
    taxi.setOrderEnd(order.id, true);
})
mp.events.add('playerEnterVehicle', (player: PlayerMp, vehicle: VehicleMp) => {
    if(!player.user) return;
    if(player.dimension) return;
    if(!vehicle.taxiCar) return;
    const order = taxi.list.find(q => q.user === player.user.id && q.driver === vehicle.taxiCar);
    if(!order) return;
    const driver = User.get(vehicle.taxiCar);
    if(!driver) return;
    player.notify(player.user.LangString("taxi.enterVeh"), 'warning', 'CHAR_TAXI');
    driver.notify(driver.user.LangString("taxi.enterVehDriver"), 'warning', 'CHAR_TAXI');
    driver.user.setWaypoint(order.end.x, order.end.y, 0, driver.user.LangString("taxi.enterVehDriverWaypoint", order.id));
})


CustomEvent.registerClient('phone:requestTaxi', (player,end, startZone, endZone) => {
    taxi.newOrder(player, player.position, end, startZone, endZone)
})

const leaveJob = (player: PlayerMp) => {
    const user = player.user;
    if(!user) return;
    const id = user.id;
    if(user.taxiCar && mp.vehicles.exists(user.taxiCar) && !user.taxiCar.entity?.owner) Vehicle.destroy(user.taxiCar);
    taxi.list.map((order, id) => {
        if([order.driver, order.user].includes(id)) taxi.setOrderEnd(id, false);
    })
    user.taxiCar = null;
    user.taxiJob = null;
}
