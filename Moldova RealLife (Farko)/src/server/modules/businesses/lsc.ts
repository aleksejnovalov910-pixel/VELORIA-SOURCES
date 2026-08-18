import { langStringDefault } from "../../../shared/lang";
import {BusinessEntity} from "../typeorm/entities/business";
import {menu} from "../menu";
import {business, businessCatalogMenu, businessDefaultCostItem} from "../business";
import {CustomEvent} from "../custom.event";
import {VEHICLE_REPAIR_COST} from "../../../shared/economy";
import {BUSINESS_TYPE} from "../../../shared/business";
import {deliverSet, needUnload, orderDeliverMenu} from "./order.system";
import {
    buyUpgrades,
    convertModCostFromCarCost, getProfitFromTuningCost,
    LSC_PROFIT_PERCENT,
    LSC_VEHICLE_POS,
    LSC_WHEELS,
    lscBrakeUpgrades,
    lscEngineUpgrades,
    lscNumberUpgrades,
    lscSuspensionUpgrades,
    lscTintUpgrades,
    lscTransmissionUpgrades,
    lscXenonColorUpgrades, vehicleModItemBase, vehicleModsList
} from "../../../shared/lsc";
import {saveEntity} from "../typeorm";
import {system} from "../system";
import {PayType} from "../../../shared/pay";
import {canUserStartBizWar, createBizMenuBizWarItem, startBizWar} from "../bizwar";
import {setVehicleParamsByConfig, vehicleConfigs} from "../vehicles";
import {LscConfigEntity} from "../typeorm/entities/lscConfig";
import {writeClientRatingLog} from "./tablet";

// Массив с ID бизнесов, на которых идет тюнинг, нужен чтобы не тюнились на одной ЛСК 2 машины
const busyLscPoints = new Map<number, PlayerMp>()

export const lscConfig: vehicleModItemBase[] = []

export const getVehicleMod = (id: number) => {
    return lscConfig.find(q => q.id === id);
}

const updateModCost = async (modSlotId: number, newValue: number) => {
    lscConfig.find(c => c.id == modSlotId).cost = newValue

    const entityToUpdate = await LscConfigEntity.findOne({ slotId: modSlotId })
    entityToUpdate.cost = newValue

    await entityToUpdate.save()

    mp.players.forEach(p => CustomEvent.triggerClient(p, "lsc:updateCost", modSlotId, newValue))
}

export const loadConfig = async () => {
    const vehiclesMods = await LscConfigEntity.find()

    if (!vehiclesMods.length) {
        vehicleModsList.forEach(modFromConfig => {
            const configToInsert = new LscConfigEntity()

            configToInsert.slotId = modFromConfig.id;
            configToInsert.name = modFromConfig.name;
            configToInsert.cost = modFromConfig.cost;
            configToInsert.default = modFromConfig.default ?? null;
            configToInsert.percent = modFromConfig.percent;
            configToInsert.isColor = modFromConfig.isColor;
            configToInsert.isColorMod = modFromConfig.isColorMod
            configToInsert.sector = modFromConfig.sector;
            configToInsert.isWheelType = modFromConfig.isWheelType;
            configToInsert.isWheelTypeValue = modFromConfig.isWheelTypeValue;
            configToInsert.level = modFromConfig.level;
            configToInsert.target = modFromConfig.target ?? "all";

            configToInsert.save()
        })
    }

    vehiclesMods.forEach(modFromDb => {
        lscConfig.push({
            name: modFromDb.name,
            id: modFromDb.slotId,
            cost: modFromDb.cost,
            default: modFromDb.default,
            percent: modFromDb.percent,
            isColor: modFromDb.isColor,
            isColorMod: modFromDb.isColorMod,
            sector: modFromDb.sector,
            isWheelType: modFromDb.isWheelType,
            isWheelTypeValue: modFromDb.isWheelTypeValue,
            level: modFromDb.level as (0 | 1 | 2),
            target: modFromDb.target as ("car" | "bike" | "all")
        })
    })
}

CustomEvent.registerClient("admin:gamedata:lsc", player => {
    if (!player.user) return;
    if (!player.user.hasPermission("admin:gamedata:lsc")) return player.notify(player.user.LangString("lsc.4df05260a425161085a71e2f40b7f664"), "success");
    openEditMenu(player)
})
const openEditMenu = (player: PlayerMp) => {
    let m = menu.new(player, "", player.user.LangString("lsc.e384566baafcf327cd274ae61d97fa55"))
    lscConfig.forEach(modItem => {
        m.newItem({
            name: modItem.name,
            desc: langStringDefault("lsc.46f5ce4782eb4facfc012adbd0a09757", modItem.cost),
            onpress: () => {
                menu.input(player, player.user.LangString("lsc.82e7057f9b655fda5582596108978860"), modItem.cost, 7, "int").then(val => {
                    if (typeof val !== "number") return;
                    if (isNaN(val)) return;
                    if (val < 0) return;
                    if (val > 99999999) return;
                    updateModCost(modItem.id, val)
                    openEditMenu(player)
                })
            }
        })
    })
    m.open()
}

CustomEvent.registerClient("business:lsc:restoreCar", (player, carId: number) => {
    restore(carId);
});

CustomEvent.registerClient("lsc:restoreExit", (player, carId: number) => {
    restore(carId);
})

CustomEvent.registerCef("vehicle:lsc:repair", (player, shopId: number) => {
    const user = player.user;
    if(!user) return false;
    const veh = player.vehicle;
    if(!veh) return player.notify(player.user.LangString("lsc.67c605b52a7756005396e6e05219c613"), "error"), false;
    let shop = business.get(shopId);
    if (!shop) return player.notify(player.user.LangString("lsc.959aaff01e12b3dbeb449d1c0c27fd81"), "error"), false;
    if (user.money < VEHICLE_REPAIR_COST) return player.notify(player.user.LangString("lsc.9f0e03032176eb9b6766bc8164c9ad1b") , "error"), false;
    user.removeMoney(VEHICLE_REPAIR_COST, true, user.LangString("lsc.629499b5d222714f25b97541fc9acc38"))
    player.vehicle.repair();

    setTimeout(() => {
        if (!mp.players.exists(player) || !mp.vehicles.exists(player.vehicle)) {
            return;
        }

        setVehicleParamsByConfig(player.vehicle);
    }, 500)
    business.addMoney(shop, VEHICLE_REPAIR_COST / 10, langStringDefault("lsc.cbc4a0e7d1d6388ab751159a7b51d20a"));
    player.user.achiev.setAchievTickBiz(shop.type, shop.sub_type, VEHICLE_REPAIR_COST)
    player.notify(player.user.LangString("lsc.73221da7d2a9f9cec1bddc443fbf583b"), "success");
    writeClientRatingLog(player, shopId, VEHICLE_REPAIR_COST, langStringDefault("lsc.f428d8f42a1576752ff47c0f141e5e34"), 1);
    return true
})

const restore = (carId: number) => {
    const veh = mp.vehicles.at(carId);
    if (!veh) return;
    if (!veh.entity) return;
    // Vehicle.repair(veh, true)
    veh.entity.applyCustomization();
}

CustomEvent.registerCef("lsc:buyTuning", (player, shopId:number, carId: number, payType:PayType, pin:string, buyElementsJSON:string, buyWheelsType:number, buyWheelsID:number) => {
    if(!mp.players.exists(player) || !player.user) return true;
    const user = player.user;
    const vehicle = player.vehicle;
    const shop = business.get(shopId);

    if((!buyElementsJSON || !buyElementsJSON.length) && buyWheelsID == null && buyWheelsType == null) return true;
    let buyElements:buyUpgrades[] = JSON.parse(buyElementsJSON)
    if((!buyElements || !buyElements.length)  && buyWheelsID == null && buyWheelsType == null) return true;

    const check = () => {
        if(!mp.vehicles.at(carId)) return false;
        if(!vehicle || player.vehicle != mp.vehicles.at(carId)) return player.notify(player.user.LangString("lsc.34d83067a9ce8551cd0d58b185706860")), false;
        if(!player.vehicle.entity) return player.notify(player.user.LangString("lsc.335620f965548ce010ddd1c0d15bbcdd")), false;
        if (!player.user) return false;
        if(!shop) return player.notify(player.user.LangString("lsc.d5dcb2446a11c038784671a28681ba1c")), false;
        if (shop.type !== BUSINESS_TYPE.TUNING) return player.notify(player.user.LangString("lsc.23941699c6501d7aab16af78324e4e50"), "error"), false;
        return true;
    }
    if (!check()) {
        exitLsc(player, shopId, carId, true)
        return true;
    }

    const vehEntity = vehicle.entity
    let vehicleCost = vehEntity ? vehEntity.sellSumMoney : 2000000
    if (vehicleCost == 0) vehicleCost = vehicle.entity.config.cost;
    let tuningData:[number,number][] = []
    let primaryColor:[number,number,number] = null
    let secondaryColor:[number,number,number] = null
    let neonColor:[number,number,number] = null
    let tyreSmokeColor:[number,number,number] = null

    let tuningCostBeforeBuyElementIteration = 0
    let tuningCost = 0
    let tuningToShopCost = 0
    let totalComponentsPurchasePriceRaw = 0;

    buyElements.map(async element => {
        const mod = getVehicleMod(element.id)
        if(!mod) return;
        const bizItem = shop.catalog.find(i => i.item == mod.id)
        totalComponentsPurchasePriceRaw += bizItem.count ? businessDefaultCostItem(shop, bizItem.item) : 0;

        if(mod.id == 55) tuningCost += convertModCostFromCarCost(lscTintUpgrades.find(t => t.value == element.selectedElementID)?.percent + bizItem.price || mod.percent + bizItem.price, vehicleCost)
        // else if(mod.id == 16) tuningCost += convertModCostFromCarCost(lscArmourUpgrades.find(t => t.value == element.selectedElementID)?.cost || mod.cost, vehicleCost)
        else if(mod.id == 15) tuningCost += convertModCostFromCarCost(lscSuspensionUpgrades.find(t => t.value == element.selectedElementID)?.percent + bizItem.price || mod.percent + bizItem.price, vehicleCost)
        else if(mod.id == 13) tuningCost += convertModCostFromCarCost(lscTransmissionUpgrades.find(t => t.value == element.selectedElementID)?.percent + bizItem.price || mod.percent + bizItem.price, vehicleCost)
        else if(mod.id == 12) tuningCost += convertModCostFromCarCost(lscBrakeUpgrades.find(t => t.value == element.selectedElementID)?.percent + bizItem.price || mod.percent + bizItem.price, vehicleCost)
        else if(mod.id == 1007) tuningCost += convertModCostFromCarCost(lscNumberUpgrades.find(t => t.value == element.selectedElementID)?.percent + bizItem.price || mod.percent + bizItem.price, vehicleCost)
        else if(mod.id == 1008) tuningCost += convertModCostFromCarCost(lscXenonColorUpgrades.find(t => t.value == element.selectedElementID)?.percent + bizItem.price || mod.percent + bizItem.price, vehicleCost)
        else if(mod.id == 11) tuningCost += convertModCostFromCarCost(lscEngineUpgrades.find(t => t.value == element.selectedElementID)?.percent + bizItem.price || mod.percent + bizItem.price, vehicleCost)
        else tuningCost += element.selectedElementID == -1 && !element.color && !element.colorMod ? convertModCostFromCarCost(bizItem.price / 2, vehicleCost) : convertModCostFromCarCost(bizItem.price, vehicleCost)

        if (shop.upgrade > 0) {
            tuningToShopCost += bizItem.count ? mod.cost - (mod.cost * (shop.upgrade * 10 / 100)) : 0;
        }else{
            tuningToShopCost += bizItem.count ? mod.cost : 0;
        }

        if(mod.id == 1000) {
            if(element.color) primaryColor = element.color
            if(element.colorMod) tuningData.push([1005, element.colorMod])
        }
        else if(mod.id == 1001) {
            if(element.color) secondaryColor = element.color
            if(element.colorMod) tuningData.push([1006, element.colorMod])
        }
        else if(mod.id == 4004) {
            if(element.color) neonColor = element.color
        }
        else if(mod.id == 3002) {
            if(element.color) tyreSmokeColor = element.color
        }
        else tuningData.push([mod.id, element.selectedElementID])

        await writeClientRatingLog(
            player,
            shopId,
            tuningCost - tuningCostBeforeBuyElementIteration,
            mod.name,
            1
        );
        tuningCostBeforeBuyElementIteration = tuningCost
    })

    if (buyWheelsID != -500) {
        const bizItem = shop.catalog.find(i => i.item == 62)
        // player.notify(`type: ${buyWheelsType}, cost: ${LSC_WHEELS.find(w => w.type == buyWheelsType)?.cost || 0}, applier: ${applier}, veh: ${vehicleCost}`)
        const wheelMod = LSC_WHEELS.find(w => w.type == buyWheelsType)
        tuningCost += convertModCostFromCarCost(wheelMod?.percent || 5000, vehicleCost)
        tuningToShopCost += bizItem && bizItem.count > 0 ? (getVehicleMod(62) ? getVehicleMod(62).cost : (1350)) : 0
    }
    if(!tuningData.length && !primaryColor && !secondaryColor && !neonColor && !tyreSmokeColor && buyWheelsID == null && buyWheelsType == null) return true;
    if(!tuningCost) return true;
    // if(tuningToShopCost > tuningCost) tuningToShopCost = tuningCost;
    tuningToShopCost += getProfitFromTuningCost(tuningCost)



    if (payType == PayType.CASH) {
        if (user.money < tuningCost) {
            return player.notify(player.user.LangString("lsc.d942304ed469b46dbcb40d63ba253d74"), "error"), true
        }
        user.removeMoney(tuningCost, true, user.LangString("lsc.3f5ef5b224d4a1a0803752183497b6de"))
    }
    else if (payType == PayType.CARD) {
        if (!user.verifyBankCardPay(pin)) {
            return player.notify(player.user.LangString("lsc.66e410625045416df6fdd31bece41c83"), "error"), true
        }
        if (!user.tryRemoveBankMoney(tuningCost, true, user.LangString("lsc.8605402516358e2046faafb9b12c39be"), `#${shop.id} ${shop.name}`)) return false;
    }
    else {
        system.debug.error(langStringDefault("lsc.0da9779146b1ec7fa68eb352adf9d5ee"))
        return true
    }

    const totalComponentsPurchasePrice = totalComponentsPurchasePriceRaw - (totalComponentsPurchasePriceRaw / 100 * (shop.upgrade * 10))

    let totalTuningIncome = totalComponentsPurchasePrice + tuningCost * 0.2
    if (totalTuningIncome < totalComponentsPurchasePrice)
        totalTuningIncome = totalComponentsPurchasePrice + tuningCost * 0.9

    business.addMoney(shop, totalTuningIncome, langStringDefault("lsc.5f23ef4a777ae9f7eadc3047745b2830", player.user.id), false, false, true,
        true, totalComponentsPurchasePriceRaw, getProfitFromTuningCost(tuningCost));
    player.user.achiev.setAchievTickBiz(shop.type, shop.sub_type, tuningCost)

    buyElements.map(element => {
        const mod = getVehicleMod(element.id)
        if (!mod) return;
        const conf = shop.catalog.find(q => q.item == mod.id);
        if (conf && conf.count > 0) shop.setItemCountByItemId(conf.item, conf.count - 1)
    })

    if(buyWheelsID != -500) {
        const conf = shop.catalog.find(q => q.item == 62);
        if (conf && conf.count > 0) shop.setItemCountByItemId(conf.item, conf.count - 1)
    }
    
    let currentTuning = vehEntity.data.tuning
    if(buyWheelsType != -500) {
        let ind = currentTuning.findIndex(d => d[0] == 2999)

        if(ind != -1) currentTuning[ind][1] = buyWheelsType
        else currentTuning.push([2999, buyWheelsType])
    }
    if(buyWheelsID != -500) {
        let ind = currentTuning.findIndex(d => d[0] == 62)

        if(ind != -1) currentTuning[ind][1] = buyWheelsID
        else currentTuning.push([62, buyWheelsID])
    }
    for(let i = 0, l = tuningData.length; i<l; i++) {
        let ind = currentTuning.findIndex(d => d[0] == tuningData[i][0])

        if(ind != -1) currentTuning[ind][1] = tuningData[i][1]
        else currentTuning.push(tuningData[i])
    }

    vehEntity.data.tuning = currentTuning
    if(primaryColor) vehEntity.data.color_primary = JSON.stringify([primaryColor[0], primaryColor[1], primaryColor[2]])
    if(secondaryColor) vehEntity.data.color_secondary = JSON.stringify([secondaryColor[0], secondaryColor[1], secondaryColor[2]])
    if(neonColor) vehEntity.data.color_neon = JSON.stringify([neonColor[0], neonColor[1], neonColor[2]])
    if(tyreSmokeColor) vehEntity.data.color_tyre_smoke = JSON.stringify([tyreSmokeColor[0], tyreSmokeColor[1], tyreSmokeColor[2]])
    saveEntity(vehEntity.data)
    restore(carId)
    user.teleportVeh(shop.positions[1].x, shop.positions[1].y, shop.positions[1].z, shop.positions[1].h, 0)
    return false;
})

CustomEvent.registerClient("lsc:release", (player, shopId: number) => {
    busyLscPoints.delete(shopId)
})

CustomEvent.registerClient("lsc:exit", (player, shopId, carId, healthed:boolean) => {
    exitLsc(player, shopId, carId, healthed)
})

export const exitLsc = (player: PlayerMp, shopId: number, carId: number, healthed: boolean) => {
    if(!mp.players.exists(player) || !player.user) return;

    const vehicle = player.vehicle;
    const shop = business.get(shopId);
    busyLscPoints.delete(shop.id)

    if(!shop) return player.notify(player.user.LangString("lsc.7b6340f1ff5b3417bb2ff6c3be946b7a"));
    if (shop.type !== BUSINESS_TYPE.TUNING) return player.notify(player.user.LangString("lsc.1d8a99fb3187f3aa67ff05f2269a39ad"), "error");

    if(!mp.vehicles.at(carId) || !vehicle || player.vehicle != mp.vehicles.at(carId)) {
        player.user.teleport(shop.positions[1].x, shop.positions[1].y, shop.positions[1].z, shop.positions[1].h, 0)
    }
    else {
        if(healthed) restore(carId)
        player.user.teleportVeh(shop.positions[1].x, shop.positions[1].y, shop.positions[1].z, shop.positions[1].h, 0)
    }
}

export function checkVehicleTuningAvailable(player: PlayerMp, vehicle: VehicleMp): boolean {
    const carId = vehicle.id
    const user = player.user

    if(!vehicle || vehicle.id != carId) {
        player.notify(player.user.LangString("lsc.37df6fff5c1492c91d5f7f03d6ac0ebc"), "error");
        return false;
    }
    if (!user.isDriver) {
        player.notify(player.user.LangString("lsc.303729cab843c75a6b9c594280c9eb43"), "error")
        return false
    }
    if(vehicle.getOccupants().length > 1) {
        player.notify(player.user.LangString("lsc.4e42a6cce7f7024ee11690eeae18b242"), "error")
        return false
    }
    if((!vehicle.entity || !vehicle.entity.data) && !user.isAdminNow()) {
        player.notify(player.user.LangString("lsc.e20fc287e4d96e1932c13138b79c6afa"), "error");
        return false
    }
    if (!user.isAdminNow() && ((vehicle.entity.owner && vehicle.entity.owner !== user.id) || (vehicle.entity.familyOwner && vehicle.entity.familyOwner !== user.familyId))){
        user.notify(user.LangString("lsc.577798849ec315047bfd1a4dff03e788"), "error", user.LangString("lsc.18d420cb5684fa5a2c3e0f050bcbbf08"));
        return false
    }
    return true
}


export const openLscBuyMenu = (player: PlayerMp, item: BusinessEntity) => {
    const user = player.user
    const vehicle = player.vehicle
    if (!vehicle) return player.notify(player.user.LangString("lsc.11b6c9b15b5eab8f333d926cb4342405"))
    const carId = vehicle.id

    if (!checkVehicleTuningAvailable(player, vehicle)) return;

    if (busyLscPoints.has(item.id) && mp.players.exists(busyLscPoints.get(item.id))) return;
    //user.teleportVeh(LSC_VEHICLE_POS.x, LSC_VEHICLE_POS.y, LSC_VEHICLE_POS.z, LSC_VEHICLE_POS.h, system.personalDimension);
    if (!checkVehicleTuningAvailable(player, vehicle)) {
        if(player) exitLsc(player, item.id, carId, false)
        return;
    }
    let vehicleCost = (vehicle && vehicle.entity) ? vehicle.entity.sellSumMoney : 0
    if (vehicleCost == 0) vehicleCost = vehicle.entity.config.cost;

    busyLscPoints.set(item.id, player)
    CustomEvent.triggerClient(player, "business:lsc:open", item.id, vehicleCost, vehicle.entity?.data?.tuning || [], item.catalog)
}

export const lscMenu = (player: PlayerMp, item: BusinessEntity) => {
    if (!player.user) return;
    const user = player.user;
    if (!user.isAdminNow(6) && item.userId !== user.id && !needUnload(player, item) && !canUserStartBizWar(user))
        return player.notify(player.user.LangString("lsc.3c6e5638faff57e07f53ee1a563a5f14"), "error")
    let m = menu.new(player, "", user.isAdminNow(6) ? player.user.LangString("lsc.b6ab865bffef99f1215a3bc403d9fe8d", item.id) : "");
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
            m.title = "LSC"
            break;
    }
    m.sprite = sprite as any;

    if (needUnload(player, item)) {
        m.newItem({
            name: langStringDefault("lsc.77ade9f342b1241d4ea29d6459297084"),
            onpress: () => {
                m.close();
                deliverSet(player)
            },
        })
    }

    createBizMenuBizWarItem(user, m, item);
    
    if (user.isAdminNow(6) || item.userId === user.id) {
        m.newItem({
            name: langStringDefault("lsc.bb8c07035d431e7ec0ab9eb163860253"),
            onpress: () => {
                businessCatalogMenu(player, item, () => {
                    lscMenu(player, item)
                }, true)
            }
        })
        m.newItem({
            name: langStringDefault("lsc.94b986c101c1b60b6c53f56bf755405f"),
            onpress: () => {
                orderDeliverMenu(player, item)
            }
        })

    }
    
    m.open();
};