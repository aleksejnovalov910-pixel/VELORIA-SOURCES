import { langStringDefault } from "../../shared/lang";
import "./businesses/lsc.chip";
import {BusinessEntity, BusinessHistoryEntity} from "./typeorm/entities/business"
import {colshapes} from "./checkpoints"
import {menu} from "./menu"
import {system} from "./system"
import {CustomEvent} from "./custom.event"
import {inventory} from "./inventory"
import {ELECTRO_SHOP_ITEMS, getBaseItemNameById, inventoryShared, ITEM_TYPE, OWNER_TYPES} from "../../shared/inventory"
import {User} from "./user"
import {
    bankMaxPercent,
    bankPercentDefault,
    bankPercentMoneyReceive,
    BUSINESS_UPGRADE_DATA,
    SELL_GOS_TAX_PERCENT,
    shopFineWhenNoItems
} from "../../shared/economy"
import {randomArrayElement} from "../../shared/arrays"
import {shopMenu} from "./businesses/shop"
import {bankMenu} from "./businesses/bank"
import {autosalonMenu} from "./businesses/autosalon"
import {dressMenu} from "./businesses/dressShop"
import {tattooMenu} from "./businesses/tattoo"
import {fuelTypeNames} from "../../shared/vehicles"
import {getVehicleMod, lscConfig, lscMenu, openLscBuyMenu} from "./businesses/lsc"
import {Vehicle, vehicleConfigs} from "./vehicles"
import {
    CASH_GRAB_BIZ_DIST,
    CASH_GRAB_MANY,
    CASH_GRAB_MIN_ONLINE,
    CASH_GRAB_PED_SCARE_TIME,
    CASH_RESTORE_HOURS,
    CASH_SUM_REVARD
} from "../../shared/cash.machines"
import {
    BUSINESS_BUY_LEVEL, BUSINESS_GOV_PERCENT,
    BUSINESS_SUBTYPE_NAMES,
    BUSINESS_TYPE,
    BUSINESS_TYPE_NAMES,
    getFuelCost,
    npcBusiness
} from "../../shared/business"
import './businesses/order.system'
import {parkingMenu} from "./businesses/parking"
import {azsMenuBase} from "./businesses/fuel"
import {FACTION_ID} from "../../shared/fractions"
import {barberMenu} from "./businesses/barber";
import {barberCatalogBase, BarberCatalogNames, BarberShopCost} from "../../shared/barbershop";
import {dress} from "./customization";
import {tattoosShared} from "../../shared/tattoos";
import {getBusinessBlip} from "../../shared/blips";
import {BUSINESS_BUY_NEED_LICENSE} from "../../shared/licence";
import {MARKERS_SETTINGS} from "../../shared/markers.settings";
import {Dispatch} from "./dispatch";
import {saveEntity} from "./typeorm";
import {CAR_WASH_ITEM_COST, CAR_WASH_ITEM_COUNT_DEFAULT, CAR_WASH_ITEM_COUNT_MAX_DEFAULT} from "../../shared/carwash";
import {openWashBuyMenu, washMenu} from "./businesses/carwash";
import {Family} from "./families/family";
import {FamilyContractList, FamilyReputationType} from "../../shared/family";
import {openLscChipMenu} from "./businesses/lsc.chip";
import {writeSpecialLog} from "./specialLogs";
import {MoneyChestClass} from "./money.chest";
import {fractionCfg} from "./fractions/main";

CustomEvent.registerClient('admin:gamedata:createbiz', player => {
    business.createBiz(player);
})

let grabPos: { x: number, y: number, z: number }[] = [];
let alertPos: { x: number, y: number }[] = [];
const alreadyGrabbed = (x: number, y: number) => {
    return system.isPointInPoints({x, y}, grabPos, CASH_GRAB_MANY ? 1 : CASH_GRAB_BIZ_DIST);
}

const alreadyAlerted = (x: number, y: number) => {
    return system.isPointInPoints({x, y}, alertPos, CASH_GRAB_BIZ_DIST);
}
const DIRTY_MONEY_ITEM_ID = 40157; // ID-ul itemului de bani murdari

CustomEvent.registerClient('cash:mashine:grab:status', (player, x: number, y: number, z: number) => {
    const user = player.user;
    if (!user) return;
    // if (!user.fractionData?.gang && !user.fractionData?.mafia) return {err: true, text: langStringDefault("business.b8e9e97d419cccc704b5e38f1e39fbb7")}
    if (user.is_gos) return {err: true, text: player.user.LangString("business.4d512a2dbd240b42bc6c03ad71a7be11")}
    if (player.dimension) return {err: true, text: langStringDefault("business.649d2c3f175376743da79f2054d9fb37")}
    // ✅ verificare minim politisti online aici
    const policeCount = mp.players.toArray().filter(p => p.user && p.user.is_gos).length;
    if (policeCount < CASH_GRAB_MIN_ONLINE) {
        if (mp.config.announce) {
            return { err: true, text: player.user.LangString("business.bfbc357c90bedfc01a33cd0abbf6fafa", CASH_GRAB_MIN_ONLINE) };
        } else {
            return { err: true, text: player.user.LangString("business.b06160b15d423fbac2e90bed3e0b347d", CASH_GRAB_MIN_ONLINE) };
        }
    }
    if (alreadyGrabbed(x, y)) return {err: true, text: player.user.LangString("business.44de2ab63e2c103070e1702e448a2398")}
    let biz = business.data.find(q => system.distanceToPos(q.positions[0], {x, y, z}) < CASH_GRAB_BIZ_DIST);
    if (!biz) return {err: true, text: langStringDefault("business.4f736b4cf3e76bd2cfeccce6ff9884b3")}
    if (!alreadyAlerted(x, y)) {
        Dispatch.new([FACTION_ID.LSPD, FACTION_ID.SHERIFF], langStringDefault("business.9de7b16a065f926e56b0bee2776e5429", biz.name, biz.id), {x, y});
        alertPos.push({x, y})
        setTimeout(() => {
            const index = alertPos.findIndex(q => q.x === x && q.y === y)
            if (index > -1) alertPos.splice(index, 1)
        }, 240000)
    }
    return {}
})

CustomEvent.registerClient('cash:mashine:grab:success', (player, x: number, y: number, z: number) => {
    const user = player.user;
    if (!user) return;

    // Verificari de factiune
    if (!user.fractionData?.gang && !user.fractionData?.mafia)
        return player.notify(player.user.LangString("business.62862a184b917a006839f74d6c1434ac"), "error");
    if (user.is_gos)
        return player.notify(langStringDefault("business.9ef812a63d561e51673fd77e3e81101a"), 'error');
    if (alreadyGrabbed(x, y))
        return player.notify(langStringDefault("business.35330714e33b4450e85447e6a0315420"), "error");

    // Gaseste afacerea din apropiere
    let biz = business.data.find(q => system.distanceToPos(q.positions[0], { x, y, z }) < 10);
    if (!biz)
        return player.notify(player.user.LangString("business.f62693c89b8e8e92425d8e8b807958c4"), "error");

    // Notificare de start
    if (!user.grab_money_shop)
        player.notify(player.user.LangString("business.5404e14f4052de3d3b74cc82bec83cb1"), 'success');

    // Calcul recompensa
    const totalReward = typeof CASH_SUM_REVARD === "number"
        ? CASH_SUM_REVARD
        : system.getRandomInt(CASH_SUM_REVARD[0], CASH_SUM_REVARD[1]);

    // Da banii murdari ca item
    user.tryGiveItem(DIRTY_MONEY_ITEM_ID, true, true, totalReward);

    // Adauga puncte la contractul de familie
    player.user.family.addContractValueIfExists(FamilyContractList.robbers, totalReward);

    // Notificare jucator
    player.notify(player.user.LangString("grab.zone.c49bfd165e32579a0948a5ca6a6847c3", system.numberFormat(totalReward)), 'success');

    // Marcare pozitie jefuita
    grabPos.push({ x, y, z });

    // Restore dupa x ore
    if (CASH_RESTORE_HOURS) {
        setTimeout(() => {
            const index = grabPos.findIndex(q => q.x === x && q.y === y && q.z === z);
            if (index > -1) grabPos.splice(index, 1);
        }, CASH_RESTORE_HOURS * 60 * 60000);
    }

    // Gaseste ped din apropiere
    let ped = mp.peds.toArray().find(ped =>
        ped.dimension === player.dimension &&
        system.isPointInPoints(ped.position, biz.positions, 5)
    );
    if (!ped) return;

    // Scade frica dupa X minute
    setTimeout(() => {
        if (!ped || !mp.peds.exists(ped)) return;
        let current = Number(ped.getVariable("grabScared"));
        if (!current) return;
        ped.setVariable("grabScared", current - 1);
    }, CASH_GRAB_PED_SCARE_TIME * 60000);

    // Creste frica acum
    if (!mp.peds.exists(ped)) return;
    let current = Number(ped.getVariable("grabScared"));
    ped.setVariable("grabScared", current + 1);
});

// CustomEvent.registerClient('cash:mashine:grab:success', (player, x: number, y: number, z: number) => {
//     const user = player.user;
//     if (!user) return;
//     if (!user.fractionData?.gang && !user.fractionData?.mafia)
//         return player.notify(player.user.LangString("business.62862a184b917a006839f74d6c1434ac"), "error")
//     if (user.is_gos) return player.notify(langStringDefault("business.9ef812a63d561e51673fd77e3e81101a"), 'error')
//     if (mp.players.length < CASH_GRAB_MIN_ONLINE) {
//         if (mp.config.announce) {
//             return player.notify(player.user.LangString("business.bfbc357c90bedfc01a33cd0abbf6fafa", CASH_GRAB_MIN_ONLINE), "error")
//         } else {
//             player.notify(player.user.LangString("business.b06160b15d423fbac2e90bed3e0b347d", CASH_GRAB_MIN_ONLINE));
//         }
//     }
//     if (alreadyGrabbed(x, y)) return player.notify(langStringDefault("business.35330714e33b4450e85447e6a0315420"), "error")
//     let biz = business.data.find(q => system.distanceToPos(q.positions[0], {x, y, z}) < 10);
//     if (!biz) return player.notify(player.user.LangString("business.f62693c89b8e8e92425d8e8b807958c4"), "error");
//     if (!user.grab_money_shop) player.notify(player.user.LangString("business.5404e14f4052de3d3b74cc82bec83cb1"), 'success');
//     const totalReward = typeof CASH_SUM_REVARD === "number" ? CASH_SUM_REVARD : system.getRandomInt(CASH_SUM_REVARD[0], CASH_SUM_REVARD[1]);
//     user.grab_money_shop += totalReward;
//     player.user.family.addContractValueIfExists(FamilyContractList.robbers, totalReward);
//     grabPos.push({x, y, z});
//     if (CASH_RESTORE_HOURS) {
//         setTimeout(() => {
//             const index = grabPos.findIndex(q => q.x === x && q.y === y && q.z === z)
//             if (index > -1) grabPos.splice(index, 1)
//         }, CASH_RESTORE_HOURS * 60 * 60000);
//     }
//     let ped = mp.peds.toArray().find(ped => ped.dimension === player.dimension && system.isPointInPoints(ped.position, biz.positions, 5));
//     if (!ped) return;
//     setTimeout(() => {
//         if (!ped) return;
//         if (!mp.peds.exists(ped)) return;
//         let current = Number(ped.getVariable("grabScared"));
//         if (!current) return;
//         ped.setVariable("grabScared", current - 1);
//     }, CASH_GRAB_PED_SCARE_TIME * 60000)
//     if (!mp.peds.exists(ped)) return;
//     let current = Number(ped.getVariable("grabScared"));
//     ped.setVariable("grabScared", current + 1);
// })


setTimeout(() => {
    system.createBlip(535, 67, business.BusinessStreetPos[0], langStringDefault("business.f5b674c0b8770ab1fd84bb3cfacb7727"))
}, 100)


setInterval(() => {
    business.saveAllWait();
}, 120000)

export const business = {
    BanksNames: BUSINESS_SUBTYPE_NAMES[0],
    BusinessOfficePos: <[Vector3Mp, number]>[new mp.Vector3(-140.7121, -617.3683, 167.8204), 183],
    BusinessMotorPos: <[Vector3Mp, number]>[new mp.Vector3(-138.6593, -592.6267, 166.0002), 73],
    BusinessStreetPos: <[Vector3Mp, number]>[new mp.Vector3(-116.8427, -604.7336, 35.28074), 250],
    BusinessGaragePos: <[Vector3Mp, number]>[new mp.Vector3(-155.6696, -577.3766, 31.42448), 164],
    BusinessRoofPos: <[Vector3Mp, number]>[new mp.Vector3(-136.6686, -596.3055, 205.9157), 250],
    BusinessMenuPos: new mp.Vector3(-139.2922, -631.5964, 167.8204),
    data: <BusinessEntity[]>[],
    dataEntity: new Map<number, { destroy: () => void }[]>(),
    saveAll: () => {
        business.data.map(item => {
            item.save()
        });
    },
    saveAllWait: () => {
        const list = business.data.filter(q => q.mark_for_save).map(q => {
            q.mark_for_save = false;
            return q
        });
        if (list.length == 0) return;
        BusinessEntity.save(list);
    },
    getAllBanks: () => {
        return business.data.filter(q => q.type == BUSINESS_TYPE.BANK)
    },
    /** Получить бизнес по ID */
    get: (id: number) => {
        return business.data.find(b => b.id === id)
    },
    /** Получить бизнес по ID владельца */
    getByOwner: (id: number | PlayerMp) => {
        if (typeof id !== "number") {
            if (!mp.players.exists(id)) return;
            if (!id.user) return;
            if (!id.user.id) return;
        }
        return business.data.find(b => b.userId === (typeof id === "number" ? id : id.user.id))
    },
    load: () => {
        return new Promise((resolve, reject) => {
            BusinessEntity.find().then(async (items) => {
                items.map(item => business.loadItem(item));
                resolve(true)
            })
        })
    },
    delete: (id: number | BusinessEntity) => {
        let item = typeof id === "number" ? business.get(id) : id;
        business.dataEntity.get(item.id).map(q => {
            try {
                q.destroy();
            } catch (error) {
                console.error(error);
            }
        })
        if (business.data.findIndex(q => q.id == item.id) > -1) business.data.splice(business.data.findIndex(q => q.id == item.id), 1);
        item.remove();
    },
    fixCatalog: (item: BusinessEntity) => {
        const catalog = [...item.catalog];
        const mult = item.multiple_price;
        catalog.map(itemC => {
            if (itemC.count < 0) itemC.count = 0;
            if (!itemC.count) itemC.count = 0;
            if (typeof itemC.max_count !== "number") itemC.max_count = itemC.count
            if (item.userId && !item.donate) {
                const max = businessDefaultCostItem(item, itemC.item) * mult;
                if (max) {
                    itemC.price = Math.min(itemC.price, max);
                    if (!itemC.price) itemC.price = max;
                    if (itemC.price && itemC.price > max) itemC.price = max;
                }
            }
        })
        item.catalog = [...catalog];
    },
    loadItem: (item: BusinessEntity) => {
        Vehicle.addBlockNpcCarZone(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z))
        ////////////////////////////
        // Возврат резервных средств
        item.money += item.reserve_money;
        item.reserve_money = 0;
        let entities: { destroy: () => void }[] = []
        const blipdata = getBusinessBlip(item.type, item.sub_type)
        const blip = system.createBlip(blipdata ? blipdata.blip : 1, blipdata ? blipdata.color : 1, new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z), `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`, item.dimension)
        if (blipdata && blipdata.scale) blip.scale = blip.scale * blipdata.scale;
        entities.push(blip)
        if (item.type == BUSINESS_TYPE.BANK) {
            item.positions.map(pos => {
                entities.push(colshapes.new(new mp.Vector3(pos.x, pos.y, pos.z), () => {
                    return `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]} #${item.id}`
                }, player => {
                    bankMenu(player, item)
                }, {
                    dimension: item.dimension
                }))
            })
        } else if (item.type == BUSINESS_TYPE.FUEL) {
            const object = mp.objects.new('prop_electrokolonka', new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z + 1), {
                rotation: new mp.Vector3(0.0, .0, item.positions[0].h),
                dimension: item.dimension
            })
            entities.push(object)
            entities.push(colshapes.new(new mp.Vector3(item.positions[1].x, item.positions[1].y, item.positions[1].z), `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`, player => {
                azsMenuBase(player, item, true)
            }, {
                radius: 4,
                color: [0, 0, 0, 0],
                dimension: item.dimension
            }))
            item.positions.map((q, qi) => {
                if (qi <= 1) return;
                entities.push(colshapes.new(new mp.Vector3(q.x, q.y, q.z), `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`, player => {
                    azsMenuBase(player, item, false)
                }, {
                    radius: 4,
                    color: [0, 0, 0, 0],
                    dimension: item.dimension
                }))
            })
            const l = [...item.catalog]
            l.map(item => {
                if (!item.item) item.item = 0
            })
            item.catalog = l;


        } else if (item.type == BUSINESS_TYPE.TUNING) {

            let catalog = [...item.catalog];

            let shouldUpdateCatalog = false
            catalog.forEach(el => {
                if (el.price > 1) {
                    console.log(el.item)
                    shouldUpdateCatalog = true
                    el.price = lscConfig.find(c => c.id == el.item)?.percent ?? 0.1
                }
            })

            lscConfig.map(mod => {
                if (mod.level > item.upgrade) return;
                if (!item.catalog.find(q => q.item === mod.id)) {
                    catalog.push({item: mod.id, count: 5, price: mod.percent, max_count: 20});
                }
            })
            if (catalog.length != item.catalog.length || shouldUpdateCatalog) {
                item.catalog = catalog;
                item.save()
            }

            if (item.sub_type === 1) {
                entities.push(colshapes.new(new mp.Vector3(item.positions[1].x, item.positions[1].y, item.positions[1].z), `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`, player => {
                    openLscChipMenu(player, item);
                }, {
                    type: 27, radius: 5, color: [255, 0, 0, 200],
                    dimension: item.dimension
                }))
            } else {
                entities.push(colshapes.new(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z), `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`, player => {
                    lscMenu(player, item)
                }, {
                    drawStaticName: 'scaleform',
                    dimension: item.dimension
                }))
                entities.push(colshapes.new(new mp.Vector3(item.positions[1].x, item.positions[1].y, item.positions[1].z), `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`, player => {
                    openLscBuyMenu(player, item)
                }, {type: 27, radius: 5, color: [255, 0, 0, 200], dimension: item.dimension}))
            }
        } else if (item.type == BUSINESS_TYPE.WASH) {

            if (item.catalog.length === 0) {
                item.catalog = [{
                    item: 0,
                    price: CAR_WASH_ITEM_COST,
                    count: CAR_WASH_ITEM_COUNT_DEFAULT,
                    max_count: CAR_WASH_ITEM_COUNT_MAX_DEFAULT
                }];
            }

            entities.push(colshapes.new(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z), `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`, player => {
                washMenu(player, item)
            }, {
                drawStaticName: 'scaleform',
                dimension: item.dimension
            }))
            entities.push(colshapes.new(new mp.Vector3(item.positions[1].x, item.positions[1].y, item.positions[1].z), `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`, player => {
                openWashBuyMenu(player, item)
            }, {type: 27, radius: 5, color: [255, 0, 0, 200], dimension: item.dimension}))

        } else if (item.type == BUSINESS_TYPE.PARKING) {

            entities.push(colshapes.new(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z -0.2 ), `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`, player => {
                parkingMenu(player, item)
            }, {type: 1, radius: 1, colshapeRadius: 3 , color: [255, 182, 193, 20], drawStaticName: 'scaleform', dimension: item.dimension}))


        } else if (item.type == BUSINESS_TYPE.VEHICLE_SHOP) {
            entities.push(colshapes.new(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z + 1.0), item.name, player => {
                autosalonMenu(player, item)
            }, {
                drawStaticName: 'scaleform',
                radius: 1,
                type: 36,
                colshapeRadius: 3,
                color: [255, 182, 193, 200],
                dimension: item.dimension
            }))
        } else if (item.type == BUSINESS_TYPE.ITEM_SHOP) {

            let model = randomArrayElement(npcBusiness.ITEM[item.sub_type])

            entities.push(system.createPed(new mp.Vector3(item.positions[1].x, item.positions[1].y, item.positions[1].z), item.positions[1].h, model, true, true, item.dimension))
            entities.push(colshapes.new(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z), () => {
                return item.name
            }, player => {
                shopMenu(player, item)
            }, {
                radius: 1,
                type: 27,
                colshapeRadius: 3,
                color: [255, 182, 193, 200],
                // color: MARKERS_SETTINGS.ITEMS.color,
                dimension: item.dimension
            }))
        } else if (item.type == BUSINESS_TYPE.BAR) {
            let model = randomArrayElement(npcBusiness.BAR[item.sub_type])
            entities.push(system.createPed(new mp.Vector3(item.positions[1].x, item.positions[1].y, item.positions[1].z), item.positions[1].h, model, true, true, item.dimension))
            entities.push(colshapes.new(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z), () => {
                return item.name
            }, player => {
                shopMenu(player, item)
            }, {
                radius: 1,
                type: 27,
                colshapeRadius: 3,
                color: [255, 182, 193, 200],
                dimension: item.dimension
            }))
        } else if (item.type == BUSINESS_TYPE.BARBER) {
            if (item.catalog.length === 0) {
                item.catalog = barberCatalogBase
                item.mark_for_save = true
            }
            let model = randomArrayElement(npcBusiness.BARBER[item.sub_type])
            entities.push(system.createPed(new mp.Vector3(item.positions[1].x, item.positions[1].y, item.positions[1].z), item.positions[1].h, model, true, true, item.dimension))
            entities.push(colshapes.new(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z), () => {
                return item.name
            }, player => {
                barberMenu(player, item)
            }, {
                radius: 1,
                type: 27,
                colshapeRadius: 3,
                color: [255, 182, 193, 200],
                dimension: item.dimension
            }))
        } else if (item.type == BUSINESS_TYPE.TATTOO_SALON) {
            let model = randomArrayElement(npcBusiness.TATTOO[item.sub_type])

            entities.push(system.createPed(new mp.Vector3(item.positions[1].x, item.positions[1].y, item.positions[1].z), item.positions[1].h, model, true, true, item.dimension))
            entities.push(colshapes.new(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z), () => {
                return item.name
            }, player => {
                tattooMenu(player, item)
            }, {
                radius: 1,
                type: 27,
                colshapeRadius: 3,
                color: [255, 182, 193, 200],
                dimension: item.dimension
            }))
        } else if (item.type == BUSINESS_TYPE.DRESS_SHOP) {

            let model = randomArrayElement(npcBusiness.DRESS[item.sub_type])

            entities.push(system.createPed(new mp.Vector3(item.positions[1].x, item.positions[1].y, item.positions[1].z), item.positions[1].h, model, true, true, item.dimension))
            entities.push(colshapes.new(new mp.Vector3(item.positions[0].x, item.positions[0].y, item.positions[0].z), () => {
                return item.name
            }, player => {
                dressMenu(player, item)
            }, {
                radius: 1,
                type: 27,
                colshapeRadius: 3,
                color: [255, 182, 193, 200],
                dimension: item.dimension
            }))
        }
        business.data.push(item);
        business.dataEntity.set(item.id, entities)

        ////////////////////////////
        // Восстановление параметров каталога
        business.fixCatalog(item);
        ///////////////////////////
    },
    setOwner: async (id: number | BusinessEntity, owner: PlayerMp | number) => {
        let businessEntity = typeof id === "number" ? business.get(id) : id;
        if (!businessEntity) return;

        if (!businessEntity.userId) {
            businessEntity.tax = 0;
            businessEntity.money = 0;
            businessEntity.reserve_money = 0;
        }

        if (!owner && businessEntity.type !== BUSINESS_TYPE.PARKING) businessEntity.upgrade = 0;

        if (!owner) {
            businessEntity.user = null;
            businessEntity.userId = 0;
        } else {
            const userEntity = typeof owner === "number" ? await User.getData(owner) : owner.user.entity
            if (!userEntity) return;

            businessEntity.user = userEntity;
            businessEntity.userId = userEntity.id;
            businessEntity.tax = businessEntity.taxDay * 2;

            if (typeof owner !== 'number') {
                owner.notify(owner.user.LangString("business.d7f75f87752207bfefe369f713fb62c5"), 'warning');
            }
        }

        businessEntity.save();
    },
    bizMenu: async (player: PlayerMp, item?: BusinessEntity) => {
        const user = player.user;
        if (player.dimension == 0 && !item) return player.notify(player.user.LangString("business.749c17c35b1fd2fe34a05a88532fa55b"), "error"), player.user.teleport(business.BusinessStreetPos[0].x, business.BusinessStreetPos[0].y, business.BusinessStreetPos[0].z, business.BusinessStreetPos[1], 0);
        if (!item) item = business.get(player.dimension);
        if (!item) return player.notify(player.user.LangString("business.cc46bd45ef872fc5c60802a2b1aea518"), "error"), player.user.teleport(business.BusinessStreetPos[0].x, business.BusinessStreetPos[0].y, business.BusinessStreetPos[0].z, business.BusinessStreetPos[1], 0);
        const name = [BUSINESS_TYPE.BAR, BUSINESS_TYPE.PARKING].includes(item.type) ? item.name : `${BUSINESS_SUBTYPE_NAMES[item.type][item.sub_type]}`
        let m = menu.new(player, "", `${name} #${item.id}`)
        m.sprite = "arcadius"

        if (!item.userId) {
            m.newItem({
                name: player.user.LangString("business.782bff0562db7d1037ec7a4e903cc706"),
                more: `$${system.numberFormat(item.price)}`,
                onpress: () => {
                    m.close();
                    if (!item.price) return player.notify(player.user.LangString("business.5625e7ba5e09a7a740354076aa32d6b4"), "error")
                    if (item.userId) return player.notify(player.user.LangString("business.9d5b77d809726c8a737894d1e38135bc"), "error");
                    if (business.getByOwner(player)) return player.notify(player.user.LangString("business.adad2e065252187f0ea814afac251b06"), "error");
                    if (BUSINESS_BUY_NEED_LICENSE && !player.user.haveActiveLicense('biz')) return player.notify(player.user.LangString("business.5af6c4e8fa1d4f7eecea20611287ec4b"), "error");
                    if (player.user.level < BUSINESS_BUY_LEVEL) return player.notify(player.user.LangString("business.52933c5baad5be5e08c858b37c9ac783", BUSINESS_BUY_LEVEL), "error");
                    const check = () => {
                        let status = !(!!item.userId)
                        if (!status) player.notify(player.user.LangString("business.e2b098db0d05c0f28451285fd4f44f97"), "error");
                        return status;
                    }
                    player.user.tryPayment(item.price, "all", check, player.user.LangString("business.17ee340d5e25a6a21328b7d6730b67a9", item.id), player.user.LangString("business.30113541f4ba0bd8d138b6f5e42d720b")).then((status) => {
                        if (!status) return;
                        business.setOwner(item, player);
                        player.notify(player.user.LangString("business.4a9f58948d4bf92f8d906e79d4620e05"), "success");
                        player.user.log("PlayerBuy", langStringDefault("business.5beaeba54257760644837d7b7a4b1a13", item.id));
                        business.bizMenu(player, item);
                    })
                }
            })
        }

        const selectOwnerAdmin = () => {
            const nearest = user.getNearestPlayer()
            menu.input(player, player.user.LangString("business.af25ed05ec28be79cedeefedb95abf9a"), nearest ? nearest.dbid : null, 6, 'int').then(async ids => {
                if (!ids || ids < 0 || ids > 999999) return;
                const data = await User.getData(ids);
                if (!data) return player.notify(player.user.LangString("business.bbadf3d07d6102bbec0e7c891b3465b3"), 'error');
                business.setOwner(item, ids)
                business.bizMenu(player, item);
            })
        }

        if (item.userId) {
            let owner = await User.getData(item.userId);
            m.newItem({
                name: langStringDefault("business.8907daec282055c33a6e33de51954dee"),
                more: `${owner.rp_name} (${owner.id})`,
                onpress: () => {
                    if (!user.isAdminNow(6)) return;
                    menu.selector(player, player.user.LangString("business.f160a4dc113a089a4b4bca988637473f"), [player.user.LangString("business.eb75b7787e7b047e91163794f7da5f26"), player.user.LangString("business.7cde07f9f347f39b1ba9778a0a21ca93")], true).then(q => {
                        if (typeof q !== "number") return;
                        if (!q) business.setOwner(item, null)
                        else selectOwnerAdmin()

                        writeSpecialLog(langStringDefault("business.9db757f85a432497ab2b1fb672501631", item.id), player, owner.id);
                    })
                }
            })
        }

        if (item.userId === player.user.id || player.user.isAdminNow(6)) {
            if (item.userId === player.dbid) {
                m.newItem({
                    name: player.user.LangString("business.f00fb027bddc15f1e9fabc2d1795bbef"),
                    more: langStringDefault("business.67daa94c9494b1b5d20b73a3165aabdf", SELL_GOS_TAX_PERCENT),
                    onpress: () => {
                        m.close();
                        if (!player.user.bank_have) return player.notify(player.user.LangString("business.d9f3fcd5fad538a77c13f7e867c16b03"), "error");
                        menu.accept(player, player.user.LangString("business.b7cbf32710ead89e75e52f1596cae7a1")).then(status => {
                            if (!status) return;
                            if (business.get(item.id).userId !== player.user.id) return player.notify(player.user.LangString("business.fce61eaa978e0adc34ba515414d314c6"), "error");
                            const sum = (item.price - ((item.price / 100) * SELL_GOS_TAX_PERCENT))
                            business.setOwner(item, null);
                            player.user.addBankMoney(sum, true, player.user.LangString("business.fcad49abf53a458f8adaf5d76b3d083f", name, item.id), player.user.LangString("business.3f8d2aedbfad5a41beebae691ff9e313"));
                            player.notify(player.user.LangString("business.7db4490d45f317ff4c9911e679b57d57"), "success");
                        })
                    }
                })
                m.newItem({
                    name: langStringDefault("business.2c2ffc912c39b85159da6735ab620ce1"),
                    more: ``,
                    onpress: () => {
                        m.close();
                        if (!player.user.bank_have) return player.notify(player.user.LangString("business.b276e6dd27ea6a74ebcc7c0aec7f01d2"), "error");
                        menu.input(player, player.user.LangString("business.07ffee2f1219e0ee82b75301e12d2c0b"), item.price, 8, 'int').then(cost => {
                            if (!cost || isNaN(cost) || cost <= 0 || cost >= 999999999) return;
                            player.user.selectNearestPlayer(5).then(target => {
                                if (!target) return;
                                if (!target.user.haveActiveLicense('biz')) return target.notify(target.user.LangString("business.7794cc39938e5753ac1381d81cc74ff1"), "error");
                                if (target.user.level < 3) return target.notify(target.user.LangString("business.e4625779c4c7df2467d0e41f57136e17"), "error");
                                if (business.get(item.id).userId !== player.user.id) return player.notify(player.user.LangString("business.b8004813ca66c11a1e0a505638e478b3"), "error");
                                if (!target.user.bank_have) return target.notify(target.user.LangString("business.73920549d77b85516ab6bd07b570032b"), "error");
                                player.notify(player.user.LangString("business.27d385be7b0a761fb8b62643049bf489"), "success");
                                menu.accept(target, target.user.LangString("business.d59ccd988e87fa65a4628629372b9ed9", cost)).then(status => {
                                    if (!status) return;
                                    if (!mp.players.exists(player)) return;
                                    if (business.get(item.id).userId !== player.user.id) return;
                                    if (system.distanceToPos(business.BusinessMenuPos, player.position) > 10) {
                                        player.notify(player.user.LangString("business.eac1b331449a3e2501dad0791f85cda5"), "error");
                                        target.notify(target.user.LangString("business.d5fa8ea958d1c10ebbdf71d408419463"), "error");
                                        return;
                                    }
                                    if (system.distanceToPos(target.position, player.position) > 10) {
                                        player.notify(player.user.LangString("business.463e3a3818c093e8992b76f99504cca5"), "error");
                                        target.notify(target.user.LangString("business.7b8084f7a2b080829e4dfb43311d71b4"), "error");
                                        return;
                                    }
                                    target.user.tryPayment(cost, 'card', () => {
                                        return mp.players.exists(player) && business.get(item.id).userId === player.user.id
                                    }, target.user.LangString("business.1b9ba6ebb21c682f40008ace810f3709", name, item.id, player.user.name, player.dbid), target.user.LangString("business.38fd9ef57ea4da65817155f17a36c6b9")).then(paystatus => {
                                        if (!paystatus) return;
                                        player.user.addBankMoney(cost, true, player.user.LangString("business.d9c5e45f279cf9227be7724e41cdc441", name, item.id, target.user.name, target.dbid), player.user.LangString("business.1421b7d6ad7d32cd661464bf06a70698"))
                                        business.setOwner(item, target);
                                        menu.close(player);
                                        menu.close(target);
                                        player.notify(player.user.LangString("business.24a2a2054adb989021c077ff7861abe4"), 'success');
                                        target.notify(target.user.LangString("business.d7aedf32c19349a0e5844de050e714fa"), 'success');
                                    })
                                })
                            })
                        })
                    }
                })
            }
            const cfgUpdate = BUSINESS_UPGRADE_DATA.find(q => q.type.includes(item.type));
            if (cfgUpdate) {
                m.newItem({
                    name: langStringDefault("business.2ae27f497eb658cd8a90278e68af326d"),
                    more: langStringDefault("business.d7042c1b9b603d7745f0be53ffa23161", item.upgrade),
                    desc: cfgUpdate.desc,
                    onpress: () => {
                        let submenu = menu.new(player, "", player.user.LangString("business.612c884ce47deded9d07d64e1a859aee"))
                        submenu.sprite = "arcadius"

                        for (let level = 0; level <= cfgUpdate.max_level; level++) {
                            const cost = ((item.price / 100 * cfgUpdate.level_percent) * (cfgUpdate.level_multiple ? level : 1))
                            submenu.newItem({
                                name: langStringDefault("business.83b60fced7e2ba5f8b0b728dca99eef0", level),
                                more: `${item.upgrade == level ? langStringDefault("business.dd22589fe59a6c6c1301a92aa363ac93") : ''}${(item.upgrade + 1) == level ? langStringDefault("business.6d615e702e59b9dc3e7a33e150c44ab2") : ''} $${system.numberFormat(cost)}`,
                                desc: cfgUpdate.desc,
                                onpress: () => {
                                    if (!player.user.isAdminNow(6)) {
                                        if (item.upgrade == level) return player.notify(player.user.LangString("business.f57525feec0b92f2351d37ab37af4bf8"), "error");
                                        if (level < item.upgrade) return player.notify(player.user.LangString("business.a60ba52442f8214c65b904c30d1ab1b2"), 'error');
                                        if ((item.upgrade + 1) != level && cfgUpdate.step_by_step) return player.notify(player.user.LangString("business.e12a2168b86ee99f940bb0e9722e2cfb"), "error");
                                        if (item.money < cost) return player.notify(player.user.LangString("business.14ef0e2c3391f1718a4eace5446d8356", system.numberFormat(cost - item.money)), 'error');
                                        item.upgrade = level;
                                        business.removeMoney(item, cost, langStringDefault("business.2b67e855f15794c55b0a0b05584e48f8"), false);
                                    } else {
                                        item.upgrade = level;
                                    }
                                    player.notify(player.user.LangString("business.57756b035a1fb7efeeb6608829c41729"), 'success');
                                    business.bizMenu(player, item);
                                }
                            })
                        }

                        submenu.open();
                    }
                })
            }
            m.newItem({
                name: langStringDefault("business.53d0b668e3d2cd611b6d0f2df9478202"),
                more: `$${system.numberFormat(item.money)}`
            })
            if (item.donate) {
                m.newItem({
                    name: langStringDefault("business.e120e930161ccb941a1624072aa860c6"),
                    more: langStringDefault("business.a4d6bcd237e41c34c984f596f749ab32"),
                    desc: langStringDefault("business.67e374349bb6b295ad388b8c1d6981d5")
                })
            }
            m.newItem({
                name: langStringDefault("business.308d665405b50be55c86fa26ebc472ee"),
                more: `$${system.numberFormat(item.tax)} / $${system.numberFormat(item.taxMax)}`,
                desc: langStringDefault("business.1de82f7aebe65ff84a144fb6e48e2b20"),
                onpress: () => {
                    const withdrawAmount = item.taxMax - item.tax;

                    if (withdrawAmount <= 0) {
                        return player.notify(player.user.LangString("business.f594b8adbce722210e3b5ec6400f2ab5"));
                    }

                    if (item.money < withdrawAmount)
                        return player.notify(player.user.LangString("business.4bafc523501c8bfe4f6d34b84fbd8a7e", system.numberFormat(withdrawAmount - item.money)), 'error');
                    business.removeMoney(item, withdrawAmount, langStringDefault("business.c0777f97d8816e691c7c4d480fccc4f4"))
                    item.tax = item.taxMax;
                    player.notify(player.user.LangString("business.fd739312600c183d35aa6fdad8e480ca"), "success");
                    business.bizMenu(player, item);
                }
            })
            if (item.type !== BUSINESS_TYPE.BANK) {
                const banks = business.getAllBanks();
                const bank = item.bank;
                if (bank) {
                    if (!banks.find(q => q.id == bank.id)) {
                        item.bank = null;
                        item.mark_for_save = true
                    }
                }
                m.newItem({
                    name: langStringDefault("business.0ca7049ab9d6d9a46686e99cef3b44b4"),
                    more: bank ? `${bank.name} #${bank.id}` : langStringDefault("business.fd0310ee0d941929da341c7e181d7108"),
                    desc: langStringDefault("business.6b59679bb54035ada398a85150c56b52", bank ? bank.param1 : bankPercentDefault),
                    onpress: () => {
                        let submenu = menu.new(player, "", player.user.LangString("business.ff8798a2987466f6f3ec77b00aa22e8f"));
                        submenu.onclose = () => {
                            business.bizMenu(player, item);
                        }
                        banks.map(itm => {
                            submenu.newItem({
                                name: `${itm.name} #${itm.id}`,
                                more: langStringDefault("business.d037c50d50779bbbb1c3dc3d303db4f3", itm.param1),
                                onpress: () => {
                                    submenu.close();
                                    player.notify(player.user.LangString("business.6989efa1a2bfafd6dedf6e868aa07575", itm.name, itm.id), `success`);
                                    item.bank = itm;
                                    item.mark_for_save = true
                                    business.bizMenu(player, item);
                                }
                            })
                        })
                        submenu.open();
                    }
                })
            }
            m.newItem({
                name: langStringDefault("business.e6669a9f1f0a7dbafeb78b96aff32e58"),
                more: langStringDefault("business.cee1daa66b2c45459eac23ec8c577a1c", system.numberFormat(1000)),
                onpress: () => {
                    m.close();
                    menu.input(player, player.user.LangString("business.aa3fbbb88c69a46e4aa901dd292484ab"), "", 7, "int").then(sum => {
                        if (sum === null) return business.bizMenu(player, item);
                        if (isNaN(sum) || sum <= 0) return player.notify(player.user.LangString("business.8d2b94a2c71a5922c1df47ee14df3f2f"), "success"), business.bizMenu(player, item);
                        if (sum < 1000) return player.notify(player.user.LangString("business.062f52bf2430dd6a15f6ee3d9498cb83", system.numberFormat(1000)), "success"), business.bizMenu(player, item);
                        player.user.tryPayment(sum, "card", null, player.user.LangString("business.f4c79c149d8e71464d3c8b44180141a2", item.id), item.name).then(status => {
                            if (status) business.addMoney(item, sum, langStringDefault("business.baad65330d9ebdc55eb41a374aaac8ae"), false, true), player.notify(player.user.LangString("business.98c206ae879369b02e4433298ddf69e1"), "success");
                            business.bizMenu(player, item);
                        })
                    })
                }
            })
            m.newItem({
                name: langStringDefault("business.319627a910db8ecaf07215a9b8c2234f"),
                more: langStringDefault("business.b79066b812c0ce03625182ca96bc88a9", system.numberFormat(1000)),
                onpress: () => {
                    m.close();
                    menu.input(player, player.user.LangString("business.285eb4728f9c06eca5b7abf5187e5c0a"), "", 7, "int").then(sum => {
                        if (sum === null) return business.bizMenu(player, item);
                        if (isNaN(sum) || sum <= 0) return player.notify(player.user.LangString("business.b91819b2c6193c7e8c3da2102d00f2a1"), "success"), business.bizMenu(player, item);
                        if (sum < 1000) return player.notify(player.user.LangString("business.51499225d28d3be86f1cb2d5ed2a4a8c", system.numberFormat(1000)), "success"), business.bizMenu(player, item);
                        if (!player.user.bank_number) return player.notify(player.user.LangString("business.a597dfc84be1315161252a838c44ca88"), 'error');
                        if (item.money < sum) return player.notify(player.user.LangString("business.ab03ae14121281f2c2aac2a4a8f6abf6"), 'error');
                        business.removeMoney(item, sum, langStringDefault("business.acf39aa30c6c5ab472086811fab3684a"));
                        player.user.addBankMoney(sum, true, player.user.LangString("business.a9c0f6f52a1458cc31387e7f498a7133", item.id), player.user.LangString("business.13cd2cb45b8510010cacedee89c57ae0"));
                        business.bizMenu(player, item);
                    })
                }
            })
        }


        if (player.user.isAdminNow(6)) {
            m.newItem({
                name: langStringDefault("business.45eff49a712e1038b2399a256fb17df5")
            })
            m.newItem({
                name: langStringDefault("business.19d679bdeb2ecbad1a2aab42349e2c65"),
                more: `${system.numberFormat(item.max_per_day)}`,
                desc: langStringDefault("business.eabd8f7d48f63d97420e1e4157408973"),
                onpress: () => {
                    if (!player.user.isAdminNow(6)) return;
                    menu.input(player, player.user.LangString("business.95268d836d4cb1e4571bb95da1698483"), item.max_per_day, 2, 'int').then(val => {
                        if (typeof val !== "number" || isNaN(val)) return;
                        if (val <= 0) return player.notify(player.user.LangString("business.86748cf2c481a170a7047d5ec9e48598"), 'error');
                        if (val > 999999999) return player.notify(player.user.LangString("business.d02e529f02a319f991741261aacdf74e"), 'error');
                        item.max_per_day = val;
                        item.save().then(() => {
                            business.bizMenu(player, item);
                            player.notify(player.user.LangString("business.6b9e9b1883af4d3d43c8e590c84928ec"), 'success');
                        })
                    })
                }
            })
            m.newItem({
                name: langStringDefault("business.db27969ebdbb1c5274ab0ea159e22901"),
                onpress: () => {
                    m.close();
                    menu.input(player, player.user.LangString("business.79863d46df80a8a55c002bfaac77e98d"), item.name, 100).then(name => {
                        if (!name) return;
                        item.name = name;
                        item.save();
                    })
                }
            })
            m.newItem({
                name: langStringDefault("business.e52184584ef52c888f0565b9e10fae4a"),
                more: `$${system.numberFormat(item.price)}`,
                onpress: () => {
                    if (item.donate) return player.notify(player.user.LangString("business.5585fdc6d45909bca6f98f10dfefc5ae"), 'error')
                    m.close();
                    menu.input(player, player.user.LangString("business.bf4a8c7363b9d830c8be13735ff72c71"), item.price, 100, "int").then(price => {
                        if (typeof price !== 'number') return;
                        if (isNaN(price) || price < 0) return;
                        item.price = price;
                        item.save();
                        player.notify(player.user.LangString("business.48723695ba5f059700fad24c1cdff556"))
                    })
                }
            })
            if (item.price) {
                m.newItem({
                    name: langStringDefault("business.5fed3b932ba27f41522945135601679d"),
                    desc: langStringDefault("business.199d2cb691f04642e0df0b490c32da25"),
                    onpress: () => {
                        m.close();
                        menu.accept(player).then(status => {
                            if (!status) return;
                            item.price = 0;
                            item.save()
                            player.notify(player.user.LangString("business.8bc3c5bf7f8b201e03a3ee2212765473"))
                        })
                    }
                })
            }
            m.newItem({
                name: langStringDefault("business.26ff8900100ef45794aab1bd238d0fb8"),
                onpress: () => {
                    m.close();
                    menu.accept(player).then(status => {
                        if (status) business.delete(item);
                    })
                }
            })
        }

        if (player.user.isAdminNow(4)) {
            m.newItem({
                name: langStringDefault("business.25fb5a2c913afadb5560a8f0ffe0f85d"),
                more: `${fractionCfg.getFraction(item.mafiaOwner)?.name ?? langStringDefault("business.5e706e6aaa76318f413aa9d4d0771905")}`,
                desc: langStringDefault("business.8a270a04ca7c6b7bd72b4c02c63da6e9"),
                onpress: () => {
                    if (!player.user.isAdminNow(4)) return;
                    let submenu = menu.new(player, "", player.user.LangString("business.17e92fd989a216a05e532946416f7993"));
                    submenu.onclose = () => {
                        business.bizMenu(player, item);
                    }
                    fractionCfg.mafiaFactions.map(itm => {
                        submenu.newItem({
                            name: `${fractionCfg.getFraction(itm)?.name}`,
                            onpress: () => {
                                submenu.close();
                                player.notify(player.user.LangString("business.42f496982b7707b7ee89c41b41796a12", fractionCfg.getFraction(itm)?.name), `success`);
                                item.mafiaOwner = itm
                                item.mark_for_save = true
                                business.bizMenu(player, item);
                            }
                        })
                    })
                    submenu.open();
                }
            })
        }

        m.open();
    },
    fineItem: (biz: number | BusinessEntity, sum: number) => {
        let item = typeof biz === "number" ? business.get(biz) : biz;
        sum = sum / 100 * shopFineWhenNoItems
        item.money -= sum;
        if (item.money < 0) item.tax += Math.abs(item.money);
        item.mark_for_save = true
    },
    log: (biz: number | BusinessEntity, sum: number, type: "add" | "remove", reason: string) => {
        let item = new BusinessHistoryEntity();
        item.business = typeof biz === "number" ? business.get(biz) : biz;
        item.type = type;
        item.time = system.timestamp
        item.text = reason;
        item.sum = sum;
        saveEntity(item);
    },
    addTax: (biz: number | BusinessEntity, sum: number) => {
        let item = typeof biz === "number" ? business.get(biz) : biz;
        item.tax += sum;
        item.mark_for_save = true
    },
    addMoney: (biz: number | BusinessEntity, sum: number, reason?: string, fromReserve = false,
               ignoreLimit = false, needSave = true, notify = true,
               purchaseComponentsPrice: number = null, profit = 0) => {
        if (typeof sum !== "number") return;
        if (isNaN(sum) || sum <= 0) return;
        let item = typeof biz === "number" ? business.get(biz) : biz;
        if (!item) return;
        if (item.type !== BUSINESS_TYPE.BANK) {
            const bank = item.bank;
            if (bank && !fromReserve) {
                if (bank.param1 > bankMaxPercent) bank.param1 = bankMaxPercent;
                let banksum;

                if (profit !== 0) {
                    banksum = profit / 100 * bank.param1
                } else {
                    banksum = sum / 100 * bank.param1;
                }

                sum -= banksum;
                banksum = banksum / 100 * bankPercentMoneyReceive;
                business.addMoney(bank, banksum, langStringDefault("business.5164245946843f2c23620abb687f6dd8", item.id), false, true)
            } else {
                if (fromReserve) {
                    item.reserve_money -= sum
                } else {
                    sum -= sum / 100 * bankPercentDefault
                }
            }
        }
        if (item.type !== BUSINESS_TYPE.BANK && item.type != BUSINESS_TYPE.TUNING) {
            let amount;

            if (profit !== 0) {
                amount = Math.floor(profit / 100 * BUSINESS_GOV_PERCENT);
            } else {
                amount = Math.floor(sum / 100 * BUSINESS_GOV_PERCENT);
            }

            sum -= amount;
            const fraction = MoneyChestClass.getByFraction(1);
            if (fraction) fraction.money = fraction.money + amount;
            console.log(amount);
        }
        if (!ignoreLimit) {
            if (item.current_day < item.max_per_day) {
                if (item.type === BUSINESS_TYPE.TUNING && purchaseComponentsPrice !== 0) {
                    item.current_day += sum;
                    item.money += sum;
                    if (reason && notify) business.log(item, sum, "add", reason)
                }

                if (item.type !== BUSINESS_TYPE.TUNING) {
                    item.current_day += sum;
                    item.money += sum;
                    if (reason && notify) business.log(item, sum, "add", reason)
                }
            } else if (purchaseComponentsPrice) {
                let increment = purchaseComponentsPrice
                // Учитываем уровень прокачки бизнеса и стоимость закупки товаров
                if (item.upgrade > 0 &&
                    [BUSINESS_TYPE.BAR, BUSINESS_TYPE.ITEM_SHOP, BUSINESS_TYPE.BARBER, BUSINESS_TYPE.TATTOO_SALON, BUSINESS_TYPE.FUEL, BUSINESS_TYPE.DRESS_SHOP, BUSINESS_TYPE.TUNING]
                        .includes(item.type))
                    increment = purchaseComponentsPrice - (purchaseComponentsPrice / 100 * (item.upgrade * 10))
                item.money += increment
                if (reason && notify) business.log(item, increment, "add", langStringDefault("business.c4acdbb48f79209fc6a68162d70c3493", reason));
            }
        } else {
            if (item.type === BUSINESS_TYPE.TUNING && purchaseComponentsPrice !== 0) {
                item.money += sum;
                if (reason && notify) business.log(item, sum, "add", reason)
            }

            if (item.type !== BUSINESS_TYPE.TUNING) {
                item.money += sum;
                if (reason && notify) business.log(item, sum, "add", reason)
            }
        }

        if (needSave) {
            setTimeout(() => {
                item.mark_for_save = true
            }, 100)
        }

    },
    removeMoney: (biz: number | BusinessEntity, sum: number, reason?: string, reserve = false, save = true) => {
        if (typeof sum !== "number") return;
        if (isNaN(sum) || sum <= 0) return;
        let item = typeof biz === "number" ? business.get(biz) : biz;
        item.money -= sum;
        if (reserve) item.reserve_money += sum;
        if (reason) business.log(item, sum, "remove", reason)
        if (save) item.mark_for_save = true
    },
    arcadiusMenu: (player: PlayerMp) => {
        const user = player.user;
        if (!user) return;
        let m = menu.new(player, "", player.user.LangString("business.adcdd57c25861a1e3e9b359b2cbb9253"));
        m.sprite = "arcadius"
        const myBiz = user.business;
        if (myBiz) {
            m.newItem({
                name: langStringDefault("business.2b8d332e28199cbda7deeac6f4e1a890"),
                more: `${BUSINESS_SUBTYPE_NAMES[myBiz.type][myBiz.sub_type]}`,
                onpress: () => {
                    player.user.teleport(business.BusinessOfficePos[0].x, business.BusinessOfficePos[0].y, business.BusinessOfficePos[0].z, business.BusinessOfficePos[1], myBiz.id);
                }
            })
        }
        BUSINESS_TYPE_NAMES.map((catName, type) => {
            m.newItem({
                name: catName,
                onpress: () => {
                    let submenu = menu.new(player, "", player.user.LangString("business.f8ae08623376ae7d996d82795a5a714c"));
                    submenu.sprite = "arcadius"
                    submenu.onclose = () => {
                        business.arcadiusMenu(player)
                    };
                    const admin = player.user.isAdminNow(6);
                    business.data.filter(biz => biz.type == type && (!biz.donate || admin)).map(biz => {
                        const name = [BUSINESS_TYPE.BAR, BUSINESS_TYPE.PARKING].includes(biz.type) ? biz.name : `${BUSINESS_SUBTYPE_NAMES[biz.type][biz.sub_type]} #${biz.id}`
                        const desc = [BUSINESS_TYPE.BAR, BUSINESS_TYPE.PARKING].includes(biz.type) ? '' : `${biz.name}. `
                        submenu.newItem({
                            name,
                            desc: langStringDefault("business.c41af98c41081a18fdd50b50fece7ea5", desc, biz.userId ? biz.userId : langStringDefault("business.6033d986537f0761d0351576071a8bd5"), system.numberFormat(biz.price)),
                            onpress: () => {
                                player.user.teleport(business.BusinessOfficePos[0].x, business.BusinessOfficePos[0].y, business.BusinessOfficePos[0].z, business.BusinessOfficePos[1], biz.id);
                            }
                        })
                    })
                    submenu.open();
                }
            })
        })
        if (player.dimension != 0) {
            m.newItem({
                name: langStringDefault("business.73495fcee4072a8068d24afe37ac2c07"),
                onpress: () => {
                    player.user.teleport(business.BusinessStreetPos[0].x, business.BusinessStreetPos[0].y, business.BusinessStreetPos[0].z, business.BusinessStreetPos[1], 0)
                }
            })
        }
        m.open();
    },
    createBiz: (player: PlayerMp) => {
        if (!player.user.hasPermission('admin:gamedata:createbiz')) return player.notify(player.user.LangString("business.43f73b5b8ed3d355b65a2aa449c455e6"), "error");
        const user = player.user;
        let m = menu.new(player, "", player.user.LangString("business.a5a496983a4b572cb546a3638874319a"));
        m.sprite = "arcadius"
        const biznear = business.data.find(q => system.isPointInPoints(player.position, q.positions, 20));
        if (biznear) {
            m.newItem({
                name: langStringDefault("business.4bb6d917adab867533e23a3c598de5d6"),
                onpress: () => {
                    business.bizMenu(player, biznear)
                }
            })
        }
        BUSINESS_TYPE_NAMES.map((catName, type) => {
            m.newItem({
                name: catName,
                onpress: () => {
                    let points: { x: number, y: number, z: number, h?: number }[] = []
                    const create = async (item?: BusinessEntity) => {
                        if (!player.user.hasPermission('admin:gamedata:createbiz')) return player.notify(player.user.LangString("business.47cee464201199981ad1ca5620d18450"), "error");
                        if (!item) {
                            item = new BusinessEntity();
                            item.type = type;
                            item.sub_type = 0;
                            item.mafiaOwner = 0;
                            item.multiple_price = 2;
                            item.max_per_day = 0;
                        }
                        item.dimension = player.dimension;
                        item.catalog = [];
                        if (!item.name) {
                            item.name = await CustomEvent.callClient(player, "currentStreet")
                        }
                        let submenu = menu.new(player, "", player.user.LangString("business.ab2c067ef2b912ca89dff74e4e1787bb"));
                        submenu.sprite = "arcadius"
                        submenu.exitProtect = true
                        submenu.newItem({
                            name: item.type === BUSINESS_TYPE.PARKING ? langStringDefault("business.75e87f14e0ef220c191d7dcccb41b934") : langStringDefault("business.fc104c335c715278fdb308b9860cacc8"),
                            more: item.name ? item.name : langStringDefault("business.ecac0404f20705272ddbb7b50305b078"),
                            onpress: () => {
                                menu.input(player, player.user.LangString("business.1010ed5d68a10acba521f5f1d2dfd402"), item.name ? item.name : ``, 100).then(name => {
                                    if (name) item.name = name;
                                    else if (!item.name) player.notify(player.user.LangString("business.271f070c503ae5c4f2070b3c3ef7386f"), 'error');
                                    create(item);
                                })
                            }
                        })
                        if (BUSINESS_SUBTYPE_NAMES[type].length > 1) {
                            submenu.newItem({
                                name: langStringDefault("business.fb4dff6dc6fed174e8b46370745312f8"),
                                type: "list",
                                list: BUSINESS_SUBTYPE_NAMES[type],
                                listSelected: item.sub_type,
                                onchange: (val) => {
                                    item.sub_type = val;
                                }
                            })
                        }
                        submenu.newItem({
                            name: langStringDefault("business.c264eaa75c9da0606b5eaee8a9a5534f"),
                            more: item.price ? `~g~$${system.numberFormat(item.price)}` : langStringDefault("business.9fd65fa1272cbef2195b78e111e6ddc8"),
                            onpress: () => {
                                menu.input(player, player.user.LangString("business.91bc3c95967275b22113ac9f66568c49"), item.price, 100, "int").then(price => {
                                    if (typeof price !== "number") return create();
                                    if (isNaN(price) || price < 0 || price > 99999999999) return player.notify(player.user.LangString("business.40c0698a377957c08c634029e1048670"), 'error');
                                    item.price = price;
                                    create(item);
                                })
                            }
                        })
                        submenu.newItem({
                            name: langStringDefault("business.a5ec891161ed57d257ab1d71689857e7"),
                            more: item.multiple_price ? `~g~$${system.numberFormat(item.multiple_price)}` : langStringDefault("business.893c10fded13521e0da98010914862de"),
                            desc: langStringDefault("business.8810c5b39b57a81e4ea12cbebc660cec"),
                            onpress: () => {
                                menu.input(player, player.user.LangString("business.8112d46a19595fd43922af0c71e2e77e"), item.multiple_price, 2, "int").then(price => {
                                    if (typeof price !== "number") return create();
                                    if (isNaN(price) || price < 1 || price > 99) return player.notify(player.user.LangString("business.156341fd0746dc6d5115432f547c2a6a"), 'error');
                                    item.multiple_price = price;
                                    business.fixCatalog(item);
                                    create(item);
                                })
                            }
                        })
                        submenu.newItem({
                            name: langStringDefault("business.c8c1094a5db2c3fea4ba0c9b58c5f34c"),
                            more: item.max_per_day ? `~g~$${system.numberFormat(item.max_per_day)}` : langStringDefault("business.a496921e72f3fe22f3925f7e14f8255c"),
                            desc: langStringDefault("business.d28611f8675d3683b7cabe9245b3605b"),
                            onpress: () => {
                                menu.input(player, player.user.LangString("business.f2f2d0009b3aa0176b17c27bb7c9a4fc"), item.max_per_day, 2, "int").then(price => {
                                    if (typeof price !== "number") return create();
                                    if (isNaN(price) || price < 1 || price > 999999999) return player.notify(player.user.LangString("business.6ae86a873eee710c0cef5c103a61c2fb"), 'error');
                                    item.max_per_day = price;
                                    create(item);
                                })
                            }
                        })

                        submenu.newItem({
                            name: langStringDefault("business.84f38621169c895b6e5539b8a4d40729"),
                            more: langStringDefault("business.5012093c8f0ac0f02cd0d5d26a909247"),
                            onpress: () => {
                                points = []
                                player.notify(player.user.LangString("business.c2933237f443551903e6542f59b39009"), 'error');
                                create(item);
                            }
                        })

                        if (item.type == BUSINESS_TYPE.BANK) {
                            submenu.newItem({
                                name: langStringDefault("business.d8b23b13f9fc892c0b9745f1948c355d"),
                                onpress: () => {
                                    points.push({
                                        x: (player.position.x),
                                        y: (player.position.y),
                                        z: (player.position.z - 1)
                                    })
                                    player.notify(player.user.LangString("business.191cd1749a809d180ae64882586bf429", points.length), 'success');
                                }
                            })
                        } else if (item.type == BUSINESS_TYPE.FUEL) {
                            submenu.newItem({
                                name: langStringDefault("business.9a7dbd96d307ad45cb1847cc76a82dd9"),
                                onpress: () => {
                                    if (points.length === 0) points.push({
                                        x: (player.position.x),
                                        y: (player.position.y),
                                        z: (player.position.z - 1),
                                        h: Math.floor(player.heading)
                                    })
                                    else points[0] = {
                                        x: (player.position.x),
                                        y: (player.position.y),
                                        z: (player.position.z - 1),
                                        h: Math.floor(player.heading)
                                    };
                                    player.notify(player.user.LangString("business.593ba95053e92723e410bbfd4c3e1a75"), 'success');
                                }
                            })
                            submenu.newItem({
                                name: langStringDefault("business.910d3ea25a2e29f2e51c7ab1f05210be"),
                                onpress: () => {
                                    if (points.length === 0) return player.notify(player.user.LangString("business.f144e54a46a43684d0689661819b4ca5"), 'error')
                                    else if (points.length === 1) points.push({
                                        x: (player.position.x),
                                        y: (player.position.y),
                                        z: (player.position.z - 1),
                                        h: Math.floor(player.heading)
                                    })
                                    else points[1] = {
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1),
                                            h: Math.floor(player.heading)
                                        };
                                    player.notify(player.user.LangString("business.d2961fe97d5d87d57ca1513f3d5dafa5"), 'success');
                                }
                            })
                            submenu.newItem({
                                name: langStringDefault("business.859214c7f7689b85d183f65db2579c28"),
                                onpress: () => {
                                    if (points.length === 0) return player.notify(player.user.LangString("business.e238de38d882939b9ee52316f9e402c3"), 'error')
                                    else if (points.length === 1) return player.notify(player.user.LangString("business.7e92bd64423afb65d317586b74f9a2fa"), 'error')
                                    else points.push({
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1)
                                        })
                                    player.notify(player.user.LangString("business.14374b1c892ebe66925f2536f900eee1"), 'success');
                                }
                            })
                        } else if (item.type == BUSINESS_TYPE.PARKING) {
                            submenu.newItem({
                                name: langStringDefault("business.ba89171a89892872032de141434a7ac9"),
                                desc: langStringDefault("business.bfebe208869dd56dac8b3552373359ec"),
                                onpress: () => {
                                    points[0] = {
                                        x: (player.position.x),
                                        y: (player.position.y),
                                        z: (player.position.z - 0.85),
                                        h: Math.floor(player.heading)
                                    };
                                    player.notify(player.user.LangString("business.ae2d949b1dd2ce72e202ffce81206bcc"), 'success');
                                }
                            })
                        } else if ([BUSINESS_TYPE.TUNING, BUSINESS_TYPE.WASH].includes(item.type)) {
                            submenu.newItem({
                                name: langStringDefault("business.571aaae1e1fe480720dee3fbb54cb2af"),
                                onpress: () => {
                                    if (points.length == 1) {
                                        points[0] = {
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1)
                                        }
                                        player.notify(player.user.LangString("business.77b85242da839f1eacadb6fa86c85b85"), 'success');
                                    } else {
                                        points.push({
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1)
                                        })
                                        player.notify(player.user.LangString("business.d73a47340d444cfc12afa69de36108a0"), 'success');
                                    }
                                }
                            })
                            submenu.newItem({
                                name: langStringDefault("business.dfce8dba106d5e1662d9ba1e03293a70"),
                                onpress: () => {
                                    if (points.length == 0) return player.notify(player.user.LangString("business.f070cf3c3ba864a8a79d8a16a475282e"))
                                    if (points.length >= 2) {
                                        points[1] = {
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 0.85),
                                            h: Math.floor(player.heading)
                                        }
                                        player.notify(player.user.LangString("business.7fe9a672a66dd4904b99da429084c78d"), 'success');
                                    } else {
                                        points.push({
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 0.85),
                                            h: Math.floor(player.heading)
                                        })
                                        player.notify(player.user.LangString("business.d36e5c6b9c41f8eee418c3f6038f459a"), 'success');
                                    }
                                }
                            })
                        } else if (item.type == BUSINESS_TYPE.VEHICLE_SHOP) {
                            submenu.newItem({
                                name: langStringDefault("business.a7dd458dd652c33417812b195bfa3e6d"),
                                onpress: () => {
                                    if (points.length == 1) {
                                        points[0] = {
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1)
                                        }
                                        player.notify(player.user.LangString("business.9ecb8777b368df7dc32fb060eac92b2f"), 'success');
                                    } else {
                                        points.push({
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1)
                                        })
                                        player.notify(player.user.LangString("business.23cfa4d9fdeab1e09cd280bf8e74d3e1"), 'success');
                                    }
                                }
                            })
                            submenu.newItem({
                                name: langStringDefault("business.5fee9368d48e6e6dd6a70f396a7a737d"),
                                desc: langStringDefault("business.b12bac4079580332a5d02ebc40495de5"),
                                onpress: () => {
                                    if (points.length == 0) return player.notify(player.user.LangString("business.94feb0569e9de7eb83a83816f0c326d6"))
                                    if (points.length >= 2) {
                                        points[1] = {
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1),
                                            h: Math.floor(player.heading)
                                        }
                                        player.notify(player.user.LangString("business.f7de486fa19898d2793c9179b4a7948c"), 'success');
                                    } else {
                                        points.push({
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1),
                                            h: Math.floor(player.heading)
                                        })
                                        player.notify(player.user.LangString("business.4f454ff6406c7e97a280c7f64d349994"), 'success');
                                    }
                                }
                            })
                            if (item.sub_type != 0) {

                                submenu.newItem({
                                    name: langStringDefault("business.1634bafd49bf20a2d76b63b479a90461"),
                                    desc: langStringDefault("business.8b1d5895233f9b1e47eba10432faae2b"),
                                    onpress: () => {
                                        if (points.length < 2) return player.notify(player.user.LangString("business.427de07825e323c64318664aac7b7fe3"))
                                        if (points.length >= 3) {
                                            points[2] = {
                                                x: (player.position.x),
                                                y: (player.position.y),
                                                z: (player.position.z - 1),
                                                h: Math.floor(player.heading)
                                            }
                                            player.notify(player.user.LangString("business.04334390df61254412223c05e2b7ee32"), 'success');
                                        } else {
                                            points.push({
                                                x: (player.position.x),
                                                y: (player.position.y),
                                                z: (player.position.z - 1),
                                                h: Math.floor(player.heading)
                                            })
                                            player.notify(player.user.LangString("business.27480dc774e3f1f7ff6b25a7509f0999"), 'success');
                                        }
                                    }
                                })
                                submenu.newItem({
                                    name: langStringDefault("business.b308aee5c7f704bf1246d8b988a66d6e"),
                                    desc: langStringDefault("business.e3cab7100a43ec0a3f0f9363e8f3065d"),
                                    onpress: () => {
                                        if (points.length < 3) return player.notify(player.user.LangString("business.499b25451272bbfc6834477743846e53"))
                                        points.push({
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1),
                                            h: Math.floor(player.heading)
                                        })
                                        player.notify(player.user.LangString("business.965eeb274a714ba177357aa11ad4ed44"), 'success');
                                    }
                                })
                            }
                        } else if ([BUSINESS_TYPE.BAR, BUSINESS_TYPE.TATTOO_SALON, BUSINESS_TYPE.DRESS_SHOP, BUSINESS_TYPE.ITEM_SHOP, BUSINESS_TYPE.BARBER].includes(item.type)) {
                            submenu.newItem({
                                name: langStringDefault("business.9c5cff642a4efac8321d8a47a3199164"),
                                desc: langStringDefault("business.227989a773fb1abf6a90a9615dc4e0db"),
                                onpress: () => {
                                    if (points.length != 0) {
                                        points[0] = {
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1),
                                            h: (player.heading)
                                        }
                                        player.notify(player.user.LangString("business.660f5aba277234801628fffd47138707"), 'success');
                                    } else {
                                        points.push({
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z - 1),
                                            h: (player.heading)
                                        })
                                        player.notify(player.user.LangString("business.0f1e2d44e16835a05e7e951e5e867385"), 'success');
                                    }
                                }
                            })
                            submenu.newItem({
                                name: langStringDefault("business.7131b4cb77ecbfac79627f54e4888ecd"),
                                desc: langStringDefault("business.5be70da0558898f784e0c416a9c5872e"),
                                onpress: () => {
                                    if (points.length == 0) {
                                        player.notify(player.user.LangString("business.906ceaa267c0d16c364c51499c28543e"), 'error');
                                    } else if (points.length == 2) {
                                        points[1] = {
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z),
                                            h: (player.heading)
                                        }
                                        player.notify(player.user.LangString("business.7f36ce51f9553a937c25681cd7c4489e"), 'success');
                                    } else {
                                        points.push({
                                            x: (player.position.x),
                                            y: (player.position.y),
                                            z: (player.position.z),
                                            h: (player.heading)
                                        })
                                        player.notify(player.user.LangString("business.423b2aa1a248f3f40cda7025ae9c1327"), 'success');
                                    }
                                }
                            })
                        }

                        submenu.newItem({
                            name: langStringDefault("business.2218945720e912ad2dbf1a01d3c6d67a"),
                            desc: langStringDefault("business.14f69f17f5169803720d9e04b4e7a05e"),
                            onpress: () => {
                                let d = player.dimension;
                                [...points].map(q => {
                                    let marker = mp.markers.new(1, new mp.Vector3(q.x, q.y, q.z), 1,
                                        {
                                            color: [255, 0, 0, 120],
                                            dimension: d
                                        });

                                    setTimeout(() => {
                                        if (mp.markers.exists(marker)) marker.destroy();
                                    }, 5000)
                                })
                            }
                        })

                        submenu.newItem({
                            name: langStringDefault("business.dbfdf468fc377327332eee632b79adfb"),
                            more: item.catalog.length === 0 ? langStringDefault("business.8d7934f6313dc0f8d8aa3c94e468100f") : langStringDefault("business.9eeef0a39657650c9b6f8ca01ffffedd"),
                            onpress: () => {
                                const submenu2 = menu.new(player, player.user.LangString("business.e725a9202e810e574f0c7f94ad1b0ce1"), player.user.LangString("business.e885bf95f9edbc4e9250b9da9e03dde6"));
                                submenu2.sprite = "arcadius"
                                submenu2.onclose = () => {
                                    create(item);
                                }
                                submenu2.exitProtect = true
                                if (item.catalog.length !== 0) {
                                    submenu2.newItem({
                                        name: langStringDefault("business.284096c65cfff9e80d6437dd3a7935be"),
                                        onpress: () => {
                                            item.catalog = [];
                                            player.notify(player.user.LangString("business.ecad7f7205fcf0fffddba411e2a02235"), "success");
                                            create(item);
                                        }
                                    })
                                }
                                business.data.filter(q => q.type === item.type && q.sub_type === item.sub_type).map(q => {
                                    submenu2.newItem({
                                        name: `#${q.id} ${q.name}`,
                                        onpress: () => {
                                            item.catalog = [...q.catalog];
                                            player.notify(player.user.LangString("business.7e8a79a71c86d9b4fa08ccac643465e7"), "success");
                                            create(item);
                                        }
                                    })
                                })
                                submenu2.open();
                            }
                        })

                        if ([BUSINESS_TYPE.ITEM_SHOP, BUSINESS_TYPE.VEHICLE_SHOP, BUSINESS_TYPE.TATTOO_SALON, BUSINESS_TYPE.DRESS_SHOP].includes(item.type)) {
                            submenu.newItem({
                                name: langStringDefault("business.5f5ce08a2c060ec182cbf91c81f40174"),
                                type: "list",
                                list: [langStringDefault("business.4f2c4f4b7cba124bb0fa73dd44929517"), langStringDefault("business.8621cdd490830ba536c2448ae9482540")],
                                desc: langStringDefault("business.9406885586698d8e2c42215af438e327"),
                                onchange: (val: number) => {
                                    item.donate = val;
                                }
                            })
                        }

                        submenu.newItem({
                            name: langStringDefault("business.8538a13e9ff368040d33235a82f83563"),
                            onpress: () => {
                                if (!item.name) return player.notify(player.user.LangString("business.58c974dd0ad50cfa7e970ae0d7b9f880"), 'error');
                                if (item.donate && item.price) return player.notify(player.user.LangString("business.327ec124331293fc92639e92a3b507e0"), 'error');
                                if (points.length == 0) return player.notify(player.user.LangString("business.9d2040f49d5cf8d71f24efdee7da9375"), 'error');
                                if ([BUSINESS_TYPE.TUNING, BUSINESS_TYPE.WASH].includes(item.type) && points.length < 2) return player.notify(player.user.LangString("business.f7e8fb2fd5fb0491fa3f0cd15c9c5910"), 'error');
                                if ([BUSINESS_TYPE.TATTOO_SALON, BUSINESS_TYPE.DRESS_SHOP, BUSINESS_TYPE.ITEM_SHOP].includes(item.type) && points.length < 2) return player.notify(player.user.LangString("business.ec4afdcd2413caf201423b54fb8abfa6"), 'error');
                                if (item.type == BUSINESS_TYPE.VEHICLE_SHOP && ((item.sub_type != 0 && points.length < 6) || (item.sub_type == 0 && points.length < 2))) return player.notify(player.user.LangString("business.68ed4ef799bc299769732582adf87b0c"), 'error');
                                submenu.close();
                                item.positions = points;
                                item.save().then(itm => {
                                    business.loadItem(itm)
                                    player.notify(player.user.LangString("business.ff6c0c03e1617425edac96143cbe82a1"), "success")
                                }).catch(err => {
                                    console.error(err)
                                    player.notify(player.user.LangString("business.ce2e680ba1b81d062677752c3b582a90"), "error")
                                })
                            }
                        })

                        submenu.open();
                    }
                    create();
                }
            })
        })
        m.newItem({
            name: langStringDefault("business.e852cfc0bf5b889affd985b807cfa965"),
            onpress: () => {
                m.close();
                const biz = business.data.find(q => system.distanceToPos(q.positions[0], player.position) < 5);
                if (!biz) return player.notify(player.user.LangString("business.1b9d4178f85a0ec4fba714534ba3ed36"), 'error');
                menu.accept(player, player.user.LangString("business.019dacb51ba48c03add23ec6edcb7eb2")).then(status => {
                    if (!status) return;
                    business.delete(biz.id);
                    player.notify(player.user.LangString("business.3e2f70e7f09ffc32e706e4ab72e54718"), "success");
                })
            }
        })
        m.open();
    }
}

colshapes.new(business.BusinessMenuPos, (player) => {
    if (!player.dimension) return "";
    let item = business.get(player.dimension);
    if (!item) return "";
    return `${item.name}`;
}, player => {
    business.bizMenu(player);
}, {dimension: -1})

colshapes.new([business.BusinessStreetPos[0]], langStringDefault("business.2f778ccbaad13744c2c5757a186efce6"), player => {
    business.arcadiusMenu(player);
}, {dimension: 0})

colshapes.new([business.BusinessOfficePos[0]], langStringDefault("business.205ab4735fd4d6574cfc470ad517719c"), player => {
    business.arcadiusMenu(player);
}, {dimension: -1})

mp.events.add("playerQuit", (player: PlayerMp, exitType: string, reason: string) => {
    if (!player.user) return;
    if (!player.user.hasPermission('admin:gamedata:createbiz')) return;
    mp.markers.toArray().filter(item => item.tmpid = player.user.id).map(item => {
        item.destroy();
    })
});


export const clearBusinessProduct = (item: BusinessEntity) => {
    inventory.clearInventory(OWNER_TYPES.BUSINESS, item.id)
    item.catalog = inventoryShared.items.filter(q =>
        (item.sub_type == 0 && [ITEM_TYPE.FOOD, ITEM_TYPE.WATER].includes(q.type)) ||
        (item.sub_type == 2 && [ITEM_TYPE.WEAPON, ITEM_TYPE.WEAPON_MAGAZINE, ITEM_TYPE.AMMO_BOX].includes(q.type)) ||
        (item.sub_type == 1 && ELECTRO_SHOP_ITEMS.includes(q.item_id)) ||
        (item.sub_type == 3 && ITEM_TYPE.MEDICATION === q.type)
    ).map(cat => {
        return {
            item: cat.item_id,
            price: 0,
            count: 10,
            max_count: 20
        }
    })
    item.save();
}


export const businessDefaultCostItem = (biz: BusinessEntity, item: number, count = 1) => {
    let sum = 0;
    if (biz.type === BUSINESS_TYPE.ITEM_SHOP || biz.type === BUSINESS_TYPE.BAR) {
        const cfg = inventoryShared.get(item);
        sum = cfg ? (cfg.defaultCost || 0) * count : 0
    } else if (biz.type === BUSINESS_TYPE.BARBER) {
        if (item === 1) sum += BarberShopCost.hair * count;
        if (item === 2) sum += BarberShopCost.paint * count;
        if (item === 3) sum += BarberShopCost.lenses * count;
    } else if (biz.type === BUSINESS_TYPE.FUEL) {
        sum = getFuelCost(item) * count
    } else if (biz.type === BUSINESS_TYPE.DRESS_SHOP) {
        const cfg = dress.get(item);
        sum = cfg ? (cfg.price || 0) * count : 0;
    } else if (biz.type === BUSINESS_TYPE.VEHICLE_SHOP) {
        sum = vehicleConfigs.has(item) ? vehicleConfigs.get(item).cost : 0;
    } else if (biz.type === BUSINESS_TYPE.TATTOO_SALON) {
        const cfg = tattoosShared.getTattoo(item)
        sum = cfg ? (cfg.price || 0) * count : 0;
    } else if (biz.type === BUSINESS_TYPE.WASH) {
        sum = CAR_WASH_ITEM_COST * count
    } else if (biz.type === BUSINESS_TYPE.TUNING) {
        let cfg = getVehicleMod(item);
        sum = cfg ? (cfg.cost || 0) * count : 0;
    }

    return sum;
}

export const businessCatalogItemName = (biz: BusinessEntity, item: number) => {
    let name: string;
    if (biz.type === BUSINESS_TYPE.ITEM_SHOP || biz.type === BUSINESS_TYPE.BAR) name = getBaseItemNameById(item);
    else if (biz.type === BUSINESS_TYPE.FUEL) {
        name = fuelTypeNames[item];
    } else if (biz.type === BUSINESS_TYPE.DRESS_SHOP) {
        const cfg = dress.get(item);
        name = cfg ? cfg.name : langStringDefault("business.6a32d22bf4fce9b8085e8c77aeb9b9af");
    } else if (biz.type === BUSINESS_TYPE.VEHICLE_SHOP) {
        name = vehicleConfigs.has(item) ? vehicleConfigs.get(item).name : '';
    } else if (biz.type === BUSINESS_TYPE.WASH) {
        name = langStringDefault("business.a7e41a0056a07f44e3776ad901d022ab")
    } else if (biz.type === BUSINESS_TYPE.BARBER) {
        name = BarberCatalogNames[item - 1] || langStringDefault("business.ab69961809e1f933bb9b4b46ba3cc3b7");
    } else if (biz.type === BUSINESS_TYPE.TATTOO_SALON) {
        const cfg = tattoosShared.getTattoo(item)
        name = cfg ? cfg.name : langStringDefault("business.dcf8f58e84ebac3d5e4e82c76e1341f7");
    } else if (biz.type === BUSINESS_TYPE.TUNING) {
        let cfg = getVehicleMod(item);
        if (!cfg) return;
        name = cfg.name;
    }
    return name;
}

export const businessCatalogMenu = (player: PlayerMp, biz: BusinessEntity, onback: (player: PlayerMp) => any, markup = false, search?: string) => {
    const user = player.user;
    const m = menu.new(player, player.user.LangString("business.add4bd7077b942815c7e122f79385c2f"));
    m.workAnyTime = true;
    m.onclose = () => {
        onback(player);
    }
    const fullAccessCatalog = ![BUSINESS_TYPE.BARBER].includes(biz.type);
    const rent = biz.type === BUSINESS_TYPE.VEHICLE_SHOP && biz.sub_type === 0;
    if (user.isAdminNow(6)) {
        m.newItem({
            name: langStringDefault("business.ac9bac4cba3b03a77bdd5ecc7bfe22d8"),
            onpress: () => {
                const s = () => {
                    const submenu = menu.new(player, player.user.LangString("business.c5920392f9f1e82844ae6bfd337d1915"), player.user.LangString("business.6b27098ad85f01a071ce0bde59ee6827"))
                    submenu.onclose = () => {
                        businessCatalogMenu(player, biz, onback, markup, search)
                    }
                    submenu.workAnyTime = true;
                    submenu.newItem({
                        name: langStringDefault("business.088cf5bd47dfcc87e1ccd331e32b0e76"),
                        desc: langStringDefault("business.33a2d587bec6c909d9fbd019f2cc9a16"),
                        onpress: () => {
                            menu.input(player, player.user.LangString("business.3f0a9fcd0d4c8ec2978e34db5af1111f"), '', 6, "int").then(val => {
                                if (!val) return;
                                let oldBiz = business.get(val);
                                if (!oldBiz) return player.notify(player.user.LangString("business.5db7a3411923eddce8f1ada6fc2e7309"), "error");
                                submenu.close();
                                inventory.clearInventory(OWNER_TYPES.BUSINESS, biz.id)
                                inventory.getInventory(OWNER_TYPES.BUSINESS, oldBiz.id).map(itm => {
                                    inventory.createItem({
                                        owner_type: OWNER_TYPES.BUSINESS,
                                        owner_id: biz.id,
                                        item_id: itm.item_id
                                    });
                                });
                                biz.catalog = [...oldBiz.catalog];
                                biz.save().then(() => {
                                    player.notify(player.user.LangString("business.104326065f174197c57a7f0e3b27e032"), 'success')
                                    businessCatalogMenu(player, biz, onback, markup, search)
                                });
                            })
                        }
                    })
                    submenu.open();
                }
                s();
            }
        })
        m.newItem({
            name: langStringDefault("business.ffa29f548681e2913980671b95e7391c"),
            more: biz.multiple_price,
            desc: langStringDefault("business.083c5e7268c710042b47b2e7bfa8fcbc"),
            onpress: () => {
                menu.input(player, player.user.LangString("business.c8e7298328891b7e03939ad29e983279"), biz.multiple_price, 2, 'int').then(val => {
                    if (typeof val !== "number" || isNaN(val)) return;
                    if (val <= 0) return player.notify(player.user.LangString("business.9c7f56f2e4446149691ae10751156f03"), 'error');
                    if (val > 99) return player.notify(player.user.LangString("business.419051828f28c400e0fba0d169e96f4f"), 'error');
                    biz.multiple_price = val;
                    business.fixCatalog(biz);
                    biz.save().then(() => {
                        businessCatalogMenu(player, biz, onback, markup, search)
                        player.notify(player.user.LangString("business.b34f9b5ba8ac95c0343a82121cfd517a"), 'success');
                    })
                })
            }
        })

        m.newItem({
            name: langStringDefault("business.3ecb3737f61a05d6ff4a671044756a38"),
            onpress: () => {
                business.bizMenu(player, biz);
            },
        })
        m.newItem({
            name: langStringDefault("business.5c02e29b2c85cda3aec4a10a50dc2d87"),
            onpress: () => {
                menu.accept(player).then(status => {
                    if (!status) return;
                    business.delete(biz);
                    menu.close(player)
                })
            },
        })
        m.newItem({name: langStringDefault("business.88aa08951c1cdfb9ec9c976e391ccec4")})
    }
    if (fullAccessCatalog && user.isAdminNow(6) && biz.type !== BUSINESS_TYPE.WASH) {
        m.newItem({
            name: langStringDefault("business.5cb7d856988b524b3bc3329d023a4cbf"),
            onpress: () => {
                let item = {item: <number>null, price: 0, count: 0, max_count: 0}
                const s = () => {
                    const submenu = menu.new(player, player.user.LangString("business.2e50f3c644bae4da143cec8436a2eb9b"), player.user.LangString("business.558cfc2fb968c1c46d3d89bf3cc10820"));
                    submenu.onclose = () => {
                        businessCatalogMenu(player, biz, onback, markup, search)
                    }
                    submenu.workAnyTime = true;
                    submenu.newItem({
                        name: langStringDefault("business.634972174ed026087820bcd0ecea0714"),
                        more: `${typeof item.item === "number" ? businessCatalogItemName(biz, item.item) : langStringDefault("business.5bb30a93e334715169c32588cd4f6e13")}`,
                        onpress: async () => {
                            let itm: number;
                            if ([BUSINESS_TYPE.ITEM_SHOP, BUSINESS_TYPE.BAR].includes(biz.type)) itm = await menu.selectItem(player, biz.catalog.map(q => q.item));
                            if ([BUSINESS_TYPE.TATTOO_SALON, BUSINESS_TYPE.DRESS_SHOP, BUSINESS_TYPE.VEHICLE_SHOP].includes(biz.type)) itm = await menu.input(player, player.user.LangString("business.df898560ecdde7bfabe75868c91d66bb"), itm, 6, 'int');
                            if ([BUSINESS_TYPE.FUEL].includes(biz.type)) itm = await menu.selector(player, player.user.LangString("business.f1c6b8d049a74c8923010794b4f1af46"), [langStringDefault("business.ab519821f0b29d51bfd4859109f52d18"), ...fuelTypeNames], true, null, true);
                            if (typeof itm === "number") {
                                if ([BUSINESS_TYPE.FUEL].includes(biz.type)) itm--;
                                if (biz.type === BUSINESS_TYPE.TATTOO_SALON && !tattoosShared.getTattoo(itm)) return player.notify(player.user.LangString("business.9c5918df06e61a332187520e228b5d03"), 'error');
                                if (biz.type === BUSINESS_TYPE.DRESS_SHOP && !dress.get(itm)) return player.notify(player.user.LangString("business.96b0b6c3889715af4d77870bdb1bb7f4"), 'error');
                                if (biz.type === BUSINESS_TYPE.VEHICLE_SHOP && !vehicleConfigs.get(itm)) return player.notify(player.user.LangString("business.7df662c636970da33bf9a50c477e8849"), 'error');
                                if (biz.catalog.find(q => q.item === itm)) return player.notify(player.user.LangString("business.676aa8ed8e42fea539794ca612d54286", businessCatalogItemName(biz, itm)), 'error');
                                item.item = itm;
                            }
                            s();

                        }
                    })

                    if (typeof item.item === "number") {
                        if (biz.type === BUSINESS_TYPE.TATTOO_SALON) {
                            const cfg = tattoosShared.getTattoo(item.item)
                            if (cfg) {
                                submenu.newItem({
                                    name: langStringDefault("business.309ef5cfde8c96e5e3b4a100cb7ad23d"),
                                    more: `ID: ${cfg.id}`,
                                    desc: langStringDefault("business.0d193cca653a2d089433ed934c9ff42f", !!cfg.overlay_male ? langStringDefault("business.6f5f6a4d78e9a6e920e866880bb1cbe9") : langStringDefault("business.37160d437b73a951ffb02bf7e9da5fb8"), !!cfg.overlay_female ? langStringDefault("business.5b8a4f282bbbfc6b300df7af8eb16921") : langStringDefault("business.b5971df7c2ace3d7bc93b52d1781c138"))
                                })
                            }
                        }

                        submenu.newItem({
                            name: langStringDefault("business.20120f80b768b596b8f7681b7afdc9eb"),
                            desc: langStringDefault("business.5bab018386b1e577736c6293817fce5a"),
                            more: `$${businessDefaultCostItem(biz, item.item)}`
                        })
                        submenu.newItem({
                            name: langStringDefault("business.e1a5c2bbc5a4b030460b5d4f6f9fb99c"),
                            desc: langStringDefault("business.d897180d54108c675df677a1fa57771d"),
                            more: `$${businessDefaultCostItem(biz, item.item) * biz.multiple_price}`
                        })
                        submenu.newItem({
                            name: rent ? langStringDefault("business.4e3c0b7dabaca3c1d0381d4c286451c1") : (markup ? langStringDefault("business.59c5c799c73e54b732dc61c5c1ee72cb") : langStringDefault("business.669b5e2aa4500403adf53476ddc88051")),
                            more: `$${system.numberFormat(item.price)}`,
                            onpress: () => {
                                menu.input(player, player.user.LangString("business.16caf7e0a357bd78587685b96e901948", businessDefaultCostItem(biz, item.item) || langStringDefault("business.916667b5bdfb53aff9fcd4f8aaca0ded")), item.price, 8, "int").then(val => {
                                    if (val === null) return;
                                    if (isNaN(val) || val < 1 || val > 999999999) return player.notify(player.user.LangString("business.b655b9f7ab38dcb1c4052a4064d21753"), "error");
                                    item.price = val;
                                    player.notify(player.user.LangString("business.e197f411720d840d45f5bfc603efac7c"), "success")
                                    s()

                                })
                            }
                        })

                        if (!rent) {
                            submenu.newItem({
                                name: langStringDefault("business.9b65e1438db38f99b78a483a196116d8"),
                                desc: langStringDefault("business.14c2daa9291e8425ce2c4e6f325faf6d"),
                                more: `${(item.count)}`,
                                onpress: () => {
                                    if (!user.isAdminNow(6)) return;
                                    menu.input(player, player.user.LangString("business.2d26c27974b1dd962d4260f18ef3c075"), item.count, 8, "int").then(val => {
                                        if (val === null) return;
                                        if (isNaN(val) || val < 0 || val > 999999999) return player.notify(player.user.LangString("business.968aeedc17240c1f6153cd32cd998a40"), "error");
                                        const lastValue = item.count;
                                        item.count = val;
                                        s()
                                        writeSpecialLog(langStringDefault("business.8efff5ed5c9ea1909b0c42c2aeba9785", lastValue, item.count), player, biz.id);
                                        player.notify(player.user.LangString("business.e0d87d10a7216dd47347c9f5e8f76e22"), "success")
                                    })
                                }
                            })
                            submenu.newItem({
                                name: langStringDefault("business.cab6cd33022a1e2c4566fa7d3b7b6fcc"),
                                desc: langStringDefault("business.91be7b0cc9c709952d84c11a2a1e599a"),
                                more: `${(item.max_count)}`,
                                onpress: () => {
                                    if (!user.isAdminNow(6)) return;
                                    menu.input(player, player.user.LangString("business.b17670a1a90645ca97437701cc7c917d"), item.max_count, 8, "int").then(val => {
                                        if (val === null) return;
                                        if (isNaN(val) || val < 0 || val > 999999999) return player.notify(player.user.LangString("business.a7f444dba83d29c0649e69fc28488d89"), "error");
                                        item.max_count = val;
                                        s()
                                        player.notify(player.user.LangString("business.f740e0576c2e828f3c00c15119e31fc3"), "success")
                                    })
                                }
                            })
                        }


                        submenu.newItem({
                            name: langStringDefault("business.cc44fc4fcd1fa767857139a023fedddc"),
                            desc: langStringDefault("business.3a446d5b7ab41224f127a9179ed382ac"),
                            onpress: () => {
                                if (!rent) {
                                    if (item.count > item.max_count) return player.notify(player.user.LangString("business.70c1fa7ef52645d784f592df3aacf7b4"), 'error');
                                    if (!item.max_count) return player.notify(player.user.LangString("business.3c707ff0f4214fe59ac4fe4f42c10eab"), 'error');
                                }
                                submenu.close();
                                const catalog = [...biz.catalog];
                                catalog.push(item);
                                biz.catalog = catalog;
                                biz.save().then(() => {
                                    businessCatalogMenu(player, biz, onback, markup, search)
                                })
                            }
                        })
                    } else {
                        submenu.newItem({
                            name: langStringDefault("business.63c7de8e209a01a07ef46e6dea56b464")
                        })
                    }
                    submenu.open()

                }
                s();
            }
        })
    }

    m.newItem({
        name: langStringDefault("business.4eccf1578cec7531b10a900e559150fe"),
        more: search || '',
        onpress: () => {
            menu.input(player, player.user.LangString("business.b5a412c97e34a10786a0b12ddc1bf1bd")).then(res => {
                if (typeof res !== 'string') return;
                search = system.filterInput(res);
                businessCatalogMenu(player, biz, onback, markup, search)
            })
        }
    })

    biz.catalog.map((item, index) => {
        const name = businessCatalogItemName(biz, item.item);
        if (biz.type == BUSINESS_TYPE.TUNING && (!name || name.length <= 0)) return;
        if (search && !name.toLowerCase().includes(search.toLowerCase())) return;
        m.newItem({
            name,
            more: biz.type == BUSINESS_TYPE.TUNING
                ? `${item.price}% / x${item.count} / x${item.max_count}`
                : `$${system.numberFormat(item.price)} / x${item.count} / x${item.max_count}`,
            desc: rent ? '' : langStringDefault("business.fd0aef6cfbe342c42d5473a24d1d3f93", system.numberFormat(item.price), item.count, item.max_count),
            onpress: () => {
                if (rent && !user.isAdminNow(6)) return;
                const s = () => {
                    const submenu = menu.new(player, name, player.user.LangString("business.8ea66a66eaf6c038e877c072e3805777"));
                    submenu.onclose = () => {
                        businessCatalogMenu(player, biz, onback, markup, search)
                    }
                    if (biz.type == BUSINESS_TYPE.TUNING) {
                        const currentDefaultPercent = lscConfig.find(m => m.id == item.item).percent
                        submenu.newItem({
                            name: langStringDefault("business.425cb4f56684fa68e0bc8782b625260f"),
                            more: `${system.numberFormat(item.price)}%`,
                            onpress: () => {
                                // Процент с конфига
                                if (!currentDefaultPercent) return
                                menu.input(player, player.user.LangString("business.f7f99b0ae98ac588044ea9a03cd978f7", currentDefaultPercent || langStringDefault("business.1bf77c87c4a189d1eb120f1a86b3c76f"))).then(value => {
                                    if (value === null) return;
                                    const val = Number(value)
                                    if (isNaN(val) || val < 0 || val > 99) return player.notify(player.user.LangString("business.7a605aa3527969f3770bcdd77e0f9b64"), "error");
                                    if (!user.isAdminNow(6)) {
                                        if (val < currentDefaultPercent / 2) return player.notify(player.user.LangString("business.4e2e93d08b06f56c17c6b8d878fcd398"), 'error');
                                        if (val > currentDefaultPercent * 2) return player.notify(player.user.LangString("business.87bea586a58c3a3a1d9b9eb2425c8ef0"), 'error');
                                    }
                                    biz.setItemPrice(index, val)
                                    biz.save().then(() => {
                                        player.notify(player.user.LangString("business.916d4d19f793b4703f5796d7d3e5c644"), "success")
                                        s()
                                    });

                                })
                            }
                        })
                        submenu.newItem({
                            name: langStringDefault("business.ba4763f2b8eb487ce871fef2e82fe574"),
                            desc: langStringDefault("business.8587c64cc04e4ade33ec2f51efc10f44"),
                            more: `${currentDefaultPercent * 2}%`
                        })
                    } else {
                        submenu.newItem({
                            name: rent ? langStringDefault("business.beaa158f914a98ad7b54afe61d2aaa6e") : (markup ? langStringDefault("business.423019e60fb3489352cedd9e0c36c591") : langStringDefault("business.9abb5a644e45d0e4ef3a305bc88569e1")),
                            more: `$${system.numberFormat(item.price)}`,
                            onpress: () => {
                                if (rent && !user.isAdminNow(6)) return;
                                menu.input(player, player.user.LangString("business.97579671d95f9d3cfe48f7d9a9f0bb05", markup ? langStringDefault("business.2012b5bf6abf509ef8b311d6b2913f1e") : langStringDefault("business.2b5b5b0dc808090d5fe9de848ddceaee"), businessDefaultCostItem(biz, item.item) || langStringDefault("business.0396defbf71e18df501874d52c86d3a5")), item.price, 8, "int").then(val => {
                                    if (val === null) return;
                                    if (isNaN(val) || val < 1 || val > 999999999) return player.notify(player.user.LangString("business.278f58f5f1d95b315447b7f0998dddac"), "error");
                                    if (!user.isAdminNow(6)) {
                                        if (!markup && val < businessDefaultCostItem(biz, item.item)) return player.notify(player.user.LangString("business.72fd2315f87fa28222097a79c77ec4dd"), 'error');
                                        if (val > businessDefaultCostItem(biz, item.item) * biz.multiple_price) return player.notify(player.user.LangString("business.e24d5df7ce78853e40ed1e4ed6ad7dd5"), 'error');
                                    }
                                    biz.setItemPrice(index, val)
                                    biz.save().then(() => {
                                        player.notify(player.user.LangString("business.93dd429468a14e04e8eefdf7035cf14d"), "success")
                                        s()
                                    });

                                })
                            }
                        })
                        submenu.newItem({
                            name: langStringDefault("business.03ae6e117e14564a3ab3273fb2c0c6a3", markup ? langStringDefault("business.3a4f9231261f2209a820926a8bc1605b") : langStringDefault("business.b37385579ade8f6285849be861817126")),
                            desc: langStringDefault("business.9a6fb21aba1c1957374b073198ee8acf"),
                            more: `$${system.numberFormat(businessDefaultCostItem(biz, item.item) * biz.multiple_price)}`
                        })
                    }


                    if (!rent) {
                        submenu.newItem({
                            name: langStringDefault("business.98ec1a222e7a3bb9ef1d3cddad8434a6"),
                            desc: langStringDefault("business.39a4eb6cc1ce7149e9ffe222d962bce2"),
                            more: `${(item.count)}`,
                            onpress: () => {
                                if (!user.isAdminNow(6)) return;
                                menu.input(player, player.user.LangString("business.536ecf8c339b6b4c5dbcae2ac374e8a6"), item.count, 8, "int").then(val => {
                                    if (val === null) return;
                                    if (isNaN(val) || val < 0 || val > 999999999) return player.notify(player.user.LangString("business.ce42905978685adea2eaecb1be7d23c6"), "error");
                                    biz.setItemCount(index, val)
                                    biz.save().then(() => s());
                                    player.notify(player.user.LangString("business.1d415dd3921c65aed0c19ed7b0c3700c"), "success")
                                })
                            }
                        })
                        submenu.newItem({
                            name: langStringDefault("business.8c3018523329f05f2910d76b1429215a"),
                            desc: langStringDefault("business.d2b5c6731b17106739c0e880a46da37a"),
                            more: `${(item.max_count)}`,
                            onpress: () => {
                                if (!user.isAdminNow(6)) return;
                                menu.input(player, player.user.LangString("business.16d8de968b5c7b86f5f49eabcb5daaa2"), item.max_count, 8, "int").then(val => {
                                    if (val === null) return;
                                    if (isNaN(val) || val < 0 || val > 999999999) return player.notify(player.user.LangString("business.6f581421dc071b4787c2ed0274fce8d5"), "error");
                                    biz.setItemMaxCount(index, val)
                                    biz.save().then(() => s());
                                    player.notify(player.user.LangString("business.5e187b39ae6008e7bdcdd3a6befed68e"), "success")
                                })
                            }
                        })
                    }


                    if (user.isAdminNow(6)) {
                        submenu.newItem({
                            name: langStringDefault("business.b9e35a457a85eca3ae826a946a1512cd"),
                            desc: langStringDefault("business.d0abd6f9762c3558fe3aa9e6573e82d1"),
                            onpress: () => {
                                if (!fullAccessCatalog) return player.notify(player.user.LangString("business.b5d3757e71d9af0e8afce5d9f8bc395f"), 'error');
                                menu.accept(player).then(val => {
                                    if (!val) return;
                                    const newCatalog = [...biz.catalog].filter(q => q.item !== item.item);
                                    biz.catalog = [...newCatalog]
                                    biz.save().then(() => businessCatalogMenu(player, biz, onback, markup, search));
                                    player.notify(player.user.LangString("business.41a7e407da75353d2ea300a0f2012b8e"), "success")
                                })
                            }
                        })
                    }

                    submenu.open();
                }
                s();
            }
        })
    })

    m.open();
}