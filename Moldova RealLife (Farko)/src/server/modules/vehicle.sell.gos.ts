import {
    VEHICLE_SELL_CONFIG,
    VEHICLE_SELL_GOS_CONFIG,
    VEHICLE_SELL_PLAYER_RADIUS,
    VEHICLE_SELL_POS_RADIUS
} from "../../shared/vehicle.sell.gos";
import {menu} from "./menu";
import {NpcSpawn} from "./npc";
import {system} from "./system";
import {colshapes} from "./checkpoints";
import {Vehicle} from "./vehicles";
import {CustomEvent} from "./custom.event";
import {PARKING_START_COST} from "../../shared/parking";
import {houses} from "./houses";
import {parking} from "./businesses/parking";
import {Family} from "./families/family";
import {BATTLE_PASS_VEHICLES} from "../../shared/battlePass/main";

import { langStringDefault } from "../../shared/lang";

new NpcSpawn(VEHICLE_SELL_GOS_CONFIG.pos, VEHICLE_SELL_GOS_CONFIG.heading, VEHICLE_SELL_GOS_CONFIG.model, VEHICLE_SELL_GOS_CONFIG.name, player => {
    const user = player.user;
    if (!user) return;
    const m = menu.new(player, VEHICLE_SELL_GOS_CONFIG.name, 'Lista vehiculelor de vanzare');

    let myVehs = user.myVehicles;
    let famVehs = user.family && user.family.isCan(user.familyRank, 'sellVehicle') ? Vehicle.getFamilyVehicles(user.familyId) : [];

    [...myVehs, ...famVehs].map(veh => {
        const target = veh.vehicle;
        const ch = () => {
            if (!veh.exists || target.dimension != player.dimension || system.distanceToPos(player.position, target.position) > VEHICLE_SELL_GOS_CONFIG.distanceForSell) { 
                player.notify(player.user.LangString("vehicle.sell.distanceErr"), 'error'); 
                return false; 
            }
            if (veh.fine) { 
                player.notify(player.user.LangString('vehicle.sell.fineErr'), 'error'); 
                return false; 
            }
            return true;
        };

        if (veh.isDonate) {
            m.newItem({
                name: `${veh.name} ${veh.number}`,
                type: 'list',
                list: [`$${system.numberFormat(veh.sellSumMoney)}`, `${system.numberFormat(veh.sellSumCoin)} SC`],
                onpress: (item) => {
                    if (!ch()) return;
                    menu.accept(player, player.user.LangString('vehicle.sell.accept', veh.name, item.listSelected ? player.user.LangString('vehicle.sell.accept2', system.numberFormat(veh.sellSumCoin)) : `$${system.numberFormat(veh.sellSumMoney)}`)).then(status => {
                        if (!status) return;
                        if (!ch()) return;
                        menu.close(player);
                        if (item.listSelected) veh.sellVehicleByCoin();
                        else veh.sellVehicleByMoney();
                        user.achiev.achievTickByType('vehSellGos');
                        player.notify(player.user.LangString("vehicle.sell.accept.ok"), 'success');
                    });
                }
            });
        } else {  // ✅ Am eliminat acolada gresita
            m.newItem({
                name: `${veh.name} ${veh.number}`,
                more: `$${system.numberFormat(veh.sellSumMoney)}`,
                onpress: (item) => {
                    if (!ch()) return;
                    menu.accept(player, player.user.LangString('vehicle.sell.2.accept', veh.name, `$${system.numberFormat(veh.sellSumMoney)}`)
                    ).then(status => {
                        if (!status) return;
                        if (!ch()) return;
                        menu.close(player);
                        veh.sellVehicleByMoney();
                        user.achiev.achievTickByType('vehSellGos');
                        player.notify(player.user.LangString("vehicle.sell.2.accept.ok"), 'success');
                    });
                }
            });
        }
    });

    m.open();
});


let textList = new Map<number, TextLabelMp>();
let sellerList = new Map<number, PlayerMp>();
let vehicleList = new Map<number, VehicleMp>();
let priceList = new Map<number, number>();

const verifyPoints = () => {
    [...sellerList].map(([index, target]) => {
        const cfg = VEHICLE_SELL_CONFIG[index];
        if(!mp.players.exists(target)) return clearPoint(index);
        if(system.distanceToPos(target.position, cfg.pos) > VEHICLE_SELL_PLAYER_RADIUS) return clearPoint(index);
    });
    [...vehicleList].map(([index, veh]) => {
        const cfg = VEHICLE_SELL_CONFIG[index];
        if(!mp.vehicles.exists(veh)) return clearPoint(index);
        if(system.distanceToPos(veh.position, cfg.pos) > VEHICLE_SELL_POS_RADIUS) return clearPoint(index);
    })
}

setInterval(() => {
    verifyPoints();
}, 5000)

const clearPoint = (index: number) => {
    const veh = vehicleList.get(index)
    if (veh && mp.vehicles.exists(veh)){
        Vehicle.freeze(veh, false)
    }
    vehicleList.delete(index);
    sellerList.delete(index);
    if(textList.has(index) && mp.labels.exists(textList.get(index))) textList.get(index).text = langStringDefault("vehicle.sell.pointText")
    priceList.delete(index);
}

const canControl = (player: PlayerMp, index: number) => {
    verifyPoints();
    if(!sellerList.has(index) && [...sellerList].find(q => q[1].dbid === player.dbid)) {
        player.notify(player.user.LangString("vehicle.sell.control.err"), 'error');
        return false
    }
    return true
}

const getVehicleData = async (vehicle: VehicleMp, index: number) => {
    if(!mp.vehicles.exists(vehicle) || !vehicle.entity) return null;
    const ent = vehicle.entity
    const ownerData = await ent.ownerData;
    return {
        carModel: vehicle.modelname.toLowerCase(),
        carName: ent.name,
        carPlate: ent.number,
        carFuel: ent.config.fuel_max,
        carOwner: ent.owner ? ownerData.rp_name : Family.getByID(ent.familyOwner)?.name,
        carTypeFuel: ent.config.fuel_type,
        carBag: ent.config.stock,
        pos: index,
        color: Vehicle.getPrimaryColor(vehicle),
        color2: Vehicle.getSecondaryColor(vehicle),
        carPrice: priceList.has(index) ? priceList.get(index) : 0
    }
}

VEHICLE_SELL_CONFIG.map((item, index) => {
    textList.set(index, mp.labels.new(langStringDefault("vehicle.sell.pointText"), item.textPos, {
        drawDistance: 5,
        los: true
    }))
    colshapes.new(item.pos, player => player.user.LangString("vehicle.sell.pos", (index + 1)), player => {
        verifyPoints();
        if(sellerList.has(index) && sellerList.get(index).dbid !== player.dbid){
            getVehicleData(player.vehicle, index).then(data => {
                if(!data) return;
                if(!player.vehicle || !player.vehicle.entity || !player.vehicle.entity.data) return;
                CustomEvent.triggerClient(player, 'vehicle:sell:menu', data, player.vehicle.entity.data.tuning);
            });
            return;
        }
        if(!canControl(player, index)) return;
        if(sellerList.has(index)){
            const m = menu.new(player, player.user.LangString("vehicle.sell.menu.title"), player.user.LangString("vehicle.sell.menu.subtitle"));
            m.newItem({
                name: player.user.LangString("vehicle.sell.menu.item1"),
                more: `$${system.numberFormat(priceList.get(index))}`,
                onpress: () => {
                    verifyPoints();
                    if(!vehicleList.has(index)) return;
                    menu.input(player, player.user.LangString("vehicle.sell.menu.item1.accept"), priceList.get(index), 8, 'int').then(cost => {
                        if(!cost) return;
                        if(cost < 0) return;
                        if(isNaN(cost)) return;
                        verifyPoints();
                        if(!vehicleList.has(index)) return;
                        priceList.set(index, cost);
                        textList.get(index).text = `${vehicleList.get(index).entity.name}\n$${system.numberFormat(cost)}`;
                    })
                }
            })
            m.newItem({
                name: player.user.LangString("vehicle.sell.menu.item2"),
                onpress: () => {
                    verifyPoints();
                    if(!vehicleList.has(index)) return;
                    menu.accept(player).then(status => {
                        if(!status) return;
                        clearPoint(index);
                    })
                }
            })
            m.open()
        } else {

            const checkSellableError = checkPlayerVehicleSellable(player);
            if (checkSellableError) {
                return player.notify(checkSellableError, 'error');
            }

            getVehicleData(player.vehicle, index).then(data => {
                if(!data) return;
                if(!player.vehicle || !player.vehicle.entity || !player.vehicle.entity.data) return;
                CustomEvent.triggerClient(player, 'vehicle:sell:menu', data, player.vehicle.entity.data.tuning);
            })
        }
    }, {
        radius: VEHICLE_SELL_POS_RADIUS,
        type: 27
    })
})

/**
 * Проверяет, может ли игрок выставить авто, в котором сидит, на продажу на авторынке
 * @return Возвращает текст ошибки
 */
function checkPlayerVehicleSellable(player: PlayerMp): string {
    if(!player.vehicle)
        return player.user.LangString('vehicle.sell.checksellable.1');
    if(!player.vehicle.entity)
        return player.user.LangString('vehicle.sell.checksellable.2');
    if(player.vehicle.entity.owner && player.vehicle.entity.owner != player.dbid)
        return player.user.LangString('vehicle.sell.checksellable.3');
    if(player.vehicle.entity.familyOwner && player.vehicle.entity.familyOwner != player.user.familyId)
        return player.user.LangString('vehicle.sell.checksellable.4');
    if(player.vehicle.entity.familyOwner && player.vehicle.entity.familyOwner == player.user.familyId && !player.user.isFamilyLeader)
        return player.user.LangString('vehicle.sell.checksellable.5');
    if(player.vehicle.entity.isDonate)
        return player.user.LangString('vehicle.sell.checksellable.6');
    if(player.vehicle.entity.data.cost < 1)
        return player.user.LangString('vehicle.sell.checksellable.7');
    if(player.vehicle.entity.tax)
        return player.user.LangString('vehicle.sell.checksellable.8');

    return null;
}

CustomEvent.registerCef('vehicle:sell:place', (player, index: number, price: number) => {
    const user = player.user;
    if(!user) return;
    verifyPoints();
    if(sellerList.has(index)) return player.notify(player.user.LangString("vehicle.sell.place.exist"));

    const checkSellableError = checkPlayerVehicleSellable(player);
    if (checkSellableError) {
        return player.notify(checkSellableError, 'error');
    }

    if(price < 1) return player.notify(player.user.LangString("vehicle.sell.place.price"), 'error');
    textList.get(index).text = `${player.vehicle.entity.name}\n$${system.numberFormat(price)}`;
    priceList.set(index, price);
    sellerList.set(index, player);
    vehicleList.set(index, player.vehicle);
    player.notify(player.user.LangString("vehicle.sell.place.notify"));
    const pos = VEHICLE_SELL_CONFIG[index].pos
    player.vehicle.position = new mp.Vector3(pos.x, pos.y, player.vehicle.position.z);
    player.vehicle.rotation = new mp.Vector3(0,0, VEHICLE_SELL_CONFIG[index].heading)
    Vehicle.freeze(player.vehicle, true)
    Vehicle.setEngine(player.vehicle, false);
})


CustomEvent.registerCef('vehicle:sell:buy', (player, index: number, price: number, isFamily = false) => {
    const user = player.user;
    if(!user) return;
    verifyPoints();
    if(!sellerList.has(index)) return player.notify(player.user.LangString("vehicle.buy.list"), "error");
    if(price < 1) return player.notify(player.user.LangString("vehicle.buy.price"), 'error');
    if(priceList.get(index) !== price) return player.notify(player.user.LangString("vehicle.buy.price.changed"), 'error');
    const vehicle = vehicleList.get(index);
    if (!vehicle) return player.notify(player.user.LangString("vehicle.buy.noveh"), "error");
    const veh = vehicle.entity;
    if(vehicle !== player.vehicle) return player.notify(player.user.LangString("vehicle.buy.incorrectveh"), 'error');
    if(isFamily) {
        if(!user.family || !user.family.isCan(user.familyRank, 'buyCar')) return player.notify(player.user.LangString("vehicle.buy.family"))
        if(!user.family.canBuyMoreCar) return player.notify(player.user.LangString("vehicle.buy.family.canmore"))
        if(user.family.money < price) return player.notify(player.user.LangString("vehicle.buy.family.money"))
    }
    else {
        if (user.myVehicles.length >= user.current_vehicle_limit) return player.notify(player.user.LangString('vehicle.buy.limit', user.current_vehicle_limit)
        , "error");
        if(user.money < price) return player.notify(player.user.LangString("vehicle.buy.money"), 'error')
    }

    Vehicle.selectParkPlace(player, veh.avia, isFamily).then(place => {
        if (!place) return player.notify(player.user.LangString("vehicle.buy.selectplace"), "error");
        const getParkPos = () => {
            if (place.type === "house") {
                return houses.getFreeVehicleSlot(place.id, veh.avia)
            } else {
                return parking.getFreeSlot(place.id)
            }
        }
        if (priceList.get(index) !== price) return player.notify(player.user.LangString("vehicle.buy.newprice"), 'error');
        if (!sellerList.has(index)) return player.notify(player.user.LangString("vehicle.buy.list"), "error");
        const owner = sellerList.get(index);
        if (!owner) return player.notify(player.user.LangString("vehicle.buy.list"), 'error');
        const familyVeh = veh.familyOwner
        if(isFamily){
            if(!user.family || !user.family.isCan(user.familyRank, 'buyCar')) return player.notify(player.user.LangString("vehicle.buy.family"))
            if(!user.family.canBuyMoreCar) return player.notify(player.user.LangString("vehicle.buy.family.cantbuymore"))
            if(user.family.money < price) return player.notify(player.user.LangString("vehicle.buy.family.money"))
            user.family.removeMoney(price, player, player.user.LangString("vehicle.buy.family.remove", veh.name))
            veh.setOwnerFamily(user.family.entity, getParkPos());
        } else {

            if (user.money < price) return player.notify(player.user.LangString("vehicle.buy.personal.price"), 'error');

            if (place.type === "parking") {
                if(!user.bank_have) return player.notify(player.user.LangString("vehicle.buy.personal.bank"), 'error');
                if (user.bank_money < PARKING_START_COST) return player.notify(player.user.LangString("vehicle.buy.personal.bank.price"), 'error')
                user.tryRemoveBankMoney(PARKING_START_COST, true, player.user.LangString("vehicle.buy.personal.bank.remove.text"), player.user.LangString("vehicle.buy.personal.bank.remove.text2", place.id))
            }

            user.removeMoney(price, true, player.user.LangString("vehicle.buy.personal.bank.reason", veh.name, veh.id, owner.user.name, owner.dbid)
            );
            veh.setOwner(user.entity, getParkPos());
        }
        if(owner.vehicle === vehicle && owner.user.isDriver) owner.user.leaveVehicle();
        if(owner) owner.user.achiev.achievTickByType("vehSellPlayer")
        player.notify(player.user.LangString("vehicle.buy.success"), 'success');
        owner.notify(owner.user.LangString("vehicle.buy.success"), 'success');
        if(familyVeh){
            owner.user.family.addMoney(price, owner, owner.user.LangString('vehicle.buy.success.fam', veh.name, veh.id, user.name, player.dbid)
            );
        } else {
            owner.user.addMoney(price, true, owner.user.LangString('vehicle.buy.success.2', veh.name, veh.id, user.name, player.dbid));
        }
        clearPoint(index);
    })
    
    
})
