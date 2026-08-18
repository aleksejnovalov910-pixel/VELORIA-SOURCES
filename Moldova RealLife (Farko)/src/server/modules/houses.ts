import { langStringDefault } from "../../shared/lang";
import {HouseEntity} from "./typeorm/entities/houses"
import {menu} from "./menu"
import {
    DEFAULT_FAMILY_HOUSE_GARAGE,
    getInteriorGarageById,
    getInteriorHouseById,
    getInteriorsGarage,
    HOUSE_MONEY_POS,
    HOUSE_STOCK_ENTER_POS,
    interriorGarageData,
    interriorHouseData,
    interriorPointData,
    interriors
} from "../../shared/inrerriors"
import {system} from "./system"
import {colshapes} from "./checkpoints"
import {inventory} from "./inventory"
import {getBaseItemNameById, getItemName, OWNER_TYPES} from "../../shared/inventory"
import {
    HOUSE_CHEST_KG_PER_LEVEL,
    HOUSE_CHEST_LEVEL_COST,
    HOUSE_CHEST_LEVEL_COST_COIN,
    HOUSE_CHEST_LEVEL_COST_MULTIPLE,
    HOUSE_CHEST_MAX_LEVEL,
    HOUSE_UPGRADE_LEVEL_COST,
    houseKeyCost,
    houseLockRepairCost,
    houseVehicleRemoveFine,
    SELL_GOS_TAX_PERCENT
} from "../../shared/economy"
import {User} from "./user"
import {Vehicle} from "./vehicles"
import {CustomEvent} from "./custom.event"
import {ScaleformTextMp} from "./scaleform.mp"
import {Family} from "./families/family"
import {HOUSES_TELEPORT_SEPARATOR, HousesTeleportsItem, HousesTeleportsList} from "../../shared/houses";
import {saveEntity} from "./typeorm";
import {getAchievConfigByType} from "../../shared/achievements";
import {Logs} from "./logs";
import {ItemEntity} from "./typeorm/entities/inventory";
import {sendMiningData} from "./mining";
import {gui} from "./gui";
import { FamilyEntity } from './typeorm/entities/family'
import {invokeHook} from "../../shared/hooks";
import {MenuItem} from "../../shared/menu";
import {writeSpecialLog} from "./specialLogs";
import {furniture} from "./houses/furniture";
import {FurnitureEntity} from "./typeorm/entities/furniture";

export const HOUSES_ENTER_MENU_HOOK = 'houses-enter-menu';


const tpHouseMenu = (player: PlayerMp, item: HousesTeleportsItem, tpid: number) => {
    const user = player.user;
    if(!user) return;
    const rooms = houses.getAllHouseInMultihouse(tpid);
    let floors: number[] = [];
    rooms.map(room => {
        if(!floors.includes(room.d)) floors.push(room.d);
    });
    const m = menu.new(player, item.name, player.user.LangString("houses.aef39699cf1595ac08d9da9338b8a596"));
    if(player.dimension){
        m.newItem({
            name: langStringDefault("houses.973396ec293f459d84603a71f56b1f3f"),
            onpress: () => {
                m.close();
                user.teleport(item.pos.x, item.pos.y, item.pos.z, item.posH, 0);
            }
        })
    }
    floors.map((floor, floorShow) => {
        const thisrooms = rooms.filter(q => q.d === floor);
        m.newItem({
            name: `${(floorShow + 1)} Etaj`,
            more: player.dimension === floor ? langStringDefault("houses.d045763fbb857825f17e30e5d8769c85") : '',
            desc: langStringDefault("houses.e1de7c257c4d288adf80ab5dfa07a821", thisrooms.map(q => q.id).join(', ')),
            onpress: () => {
                m.close();
                user.teleport(item.inside.x, item.inside.y, item.inside.z, item.insideH, floor);
            }
        })
    })

    m.open();
}

const tpVehicleMenu = (player: PlayerMp, item: HousesTeleportsItem, tpid: number) => {
    const user = player.user;
    if(!user) return;
    const rooms = houses.getAllHouseInMultihouse(tpid);
    let floors: number[] = [];
    rooms.map(room => {
        if(!floors.includes(room.d)) floors.push(room.d);
    });
    const m = menu.new(player, item.name, player.user.LangString("houses.107a78621aff34ba5df2ffcd9c7582ba"));
    if(player.dimension){
        m.newItem({
            name: langStringDefault("houses.dbd6c9bc3300543d3b9a22254eddc323"),
            onpress: () => {
                m.close();
                user.teleportVeh(item.carExit.x, item.carExit.y, item.carExit.z, item.carH, 0);
            }
        })
    }
    floors.map((floor, floorShow) => {
        const thisrooms = rooms.filter(q => q.d === floor);
        m.newItem({
            name: `${(floorShow + 1)} Etaj`,
            more: player.dimension === floor ? langStringDefault("houses.194804e33bafe2bc0cdded41830077bd") : '',
            desc: langStringDefault("houses.91f71652753c361291a24b88ac78f2b3", thisrooms.map(q => q.id).join(', ')),
            onpress: () => {
                const submenu = menu.new(player, player.user.LangString("houses.c8903e9e21f0823f300d22dd41d02689"));
                submenu.onclose = () => {
                    tpVehicleMenu(player, item, tpid);
                }
                thisrooms.map(item => {
                    submenu.newItem({
                        name: langStringDefault("houses.9eb9225d778d1fc846b05abc41d5b222", item.id),
                        onpress: () => {
                            enterGarage(player, item);
                        }
                    })
                })

                submenu.open();

            }
        })
    })

    m.open();
}

CustomEvent.registerClient('houseteleport:houseMenu', (player, index: number) => {
    const tpid = index + 1;
    const item = HousesTeleportsList[index];
    tpHouseMenu(player, item, tpid)
})
CustomEvent.registerClient('houseteleport:vehicleMenu', (player, index: number) => {
    const tpid = index + 1;
    const item = HousesTeleportsList[index];
    tpVehicleMenu(player, item, tpid)
})

const houseMenu = (player: PlayerMp, int:  interriorGarageData | interriorHouseData) => {
    const user = player.user;
    if(!user) return;
    let item = houses.get(player.dimension)
    if (!item) return player.notify(player.user.LangString("houses.2f8dc514400ed6c0fde213b897597189"), "error");
    const m = menu.new(player, "", `${item.name} №${item.id}`)
    m.sprite = "house";

    m.newItem({
        name: langStringDefault("houses.7c674dd42f57e5c549443c7133ce46e9"),
        onpress: () => {
            m.close();
            furniture.leaveHouse(player);
            if (int.type == "house"){
                player.user.teleport(item.x, item.y, item.z, item.h, item.d);
            } else {
                if(!item.forTp){
                    player.user.teleport(item.car_x, item.car_y, item.car_z, item.car_h, item.car_d);
                } else {
                    const tpcfg = HousesTeleportsList[item.forTp - 1];
                    if(!tpcfg) return player.notify(player.user.LangString("houses.914d50e0956722a8b20909036858a2ce"), 'error');
                    player.user.teleport(tpcfg.carExit.x, tpcfg.carExit.y, tpcfg.carExit.z, tpcfg.carH, 0);
                }
            }

            mp.events.call('playerLeaveHouse', player, item);
        }
    })
    if (item.car_interrior && int.type == "house"){
        m.newItem({
            name: langStringDefault("houses.61a5f0531a5eabcfe75d5461a85f49a4"),
            onpress: () => {
                m.close();
                furniture.leaveHouse(player);
                enterGarage(player, item);
            }
        })
    }
    if(item.haveChest){
        m.newItem({
            name: langStringDefault("houses.b4e2d4cc0679079440ede9c9769a6ef8"),
            onpress: () => {
                m.close();
                let haveAccess = !!item.opened;
                if (player.user.isAdminNow(6)) haveAccess = true;
                if (!item.key) haveAccess = true;
                if (!haveAccess) haveAccess = !!player.user.allMyItems.find(itm => itm.item_id == houses.key_id && itm.advancedNumber == item.key && itm.advancedString == "house_chest");
                if (!haveAccess) return player.notify(player.user.LangString("houses.b1e5611ff8b2e47ec950894fc4356df5"), "error")
                player.user.teleport(HOUSE_STOCK_ENTER_POS.x, HOUSE_STOCK_ENTER_POS.y, HOUSE_STOCK_ENTER_POS.z, HOUSE_STOCK_ENTER_POS.h, item.id);
            }
        })
    }

    if (item.interrior && int.type == "garage"){
        m.newItem({
            name: langStringDefault("houses.28b32a6db9e50acfbd42c05712aa9501"),
            onpress: () => {
                m.close();

                let haveAccess = !!item.opened;
                if (player.user.isAdminNow(6)) haveAccess = true;
                if (!item.key) haveAccess = true;
                if (!haveAccess) haveAccess = !!player.user.allMyItems.find(itm => itm.item_id == houses.key_id && itm.advancedNumber == item.key && itm.advancedString == "house");
                if (!haveAccess) return player.notify(player.user.LangString("houses.685c6b01205f9666a90b3b920146f87a"), "error")

                let int = getInteriorHouseById(item.interrior);
                if (!int) return player.notify(player.user.LangString("houses.77d5c025860f5f6f3f97438ae1966788"), "error")
                houses.enterHouse(player, item)
                furniture.enterHouse(player, item);
            }
        })
    }

    if(item.userId && (user.isAdminNow(6) || item.userId == user.id)){
        // if(!item.miningData){
        //     m.newItem({
        //         name: 'Установить майнинг ферму',
        //         onpress: () => {
        //             if(item.miningData) return player.notify('Майнинг ферма уже Eingerichtetа', 'error');
        //             if(!(user.isAdminNow(6) || item.userId == user.id)) return player.notify('Вы не можете установить майнинг ферму', 'error');
        //             const itemInt = user.haveItem(3001)
        //             if(!itemInt) return player.notify(`Требуется ${getBaseItemNameById(3001)} в инвентаре`, 'error');
        //             inventory.deleteItem(itemInt);
        //             item.miningData = {...MiningHouseDefault};
        //             item.save();
        //             player.notify(`Майнинг ферма Eingerichtetа`, 'success');
        //         }
        //
        //     })
        // } else {
        //     m.newItem({
        //         name: 'Майнинг ферма',
        //         more: `${item.miningData.level} LVL`,
        //         desc: 'Enter чтобы улучшить',
        //         onpress: () => {
        //             if(!item.miningData) return player.notify('Майнинг ферма уже не Eingerichtetа', 'error');
        //             if(!(user.isAdminNow(6) || item.userId == user.id)) return player.notify('Вы не можете установить майнинг ферму', 'error');
        //             const cfg = getMiningLevel(item.miningData.level);
        //             if(!cfg) return;
        //             const nextLevel = cfg.next;
        //             if(!nextLevel) return player.notify('Больше улучшений нет', 'error');
        //             const cfgNext = getMiningLevel(nextLevel);
        //             if(!cfgNext) return;
        //             if(cfgNext.requireMoney && user.money < cfgNext.requireMoney) return player.notify(`Требуется $${system.numberFormat(cfgNext.requireMoney)}`, 'error')
        //             let allhave = true;
        //             if(cfgNext.requireItems) cfgNext.requireItems.map(q => {
        //                 if(allhave && !user.haveItem(q)){
        //                     allhave = false;
        //                     player.notify(`Требуется ${getBaseItemNameById(q)}`, 'error')
        //                 }
        //             })
        //             if(!allhave) return;
        //             if(cfgNext.requireMoney) user.removeMoney(cfgNext.requireMoney, true, `Улучшение майнинг фермы`);
        //             let items: ItemEntity[] = []
        //             if(cfgNext.requireItems) cfgNext.requireItems.map(q => {
        //                 const itemq = user.haveItem(q)
        //                 if(itemq) items.push(itemq)
        //             })
        //             if(items.length > 0) inventory.deleteItems(...items);
        //             item.miningData = {...item.miningData, level: nextLevel};
        //             item.save();
        //             player.notify('Ферма улучшена', 'success');
        //         }
        //     })
        //     const myItems = user.inventory;
        //
        //     const dataMining = calculateMiningFarmData(item.miningData);
        //     if(dataMining){
        //         m.newItem({name: 'Информация о ферме'})
        //         m.newItem({name: 'Заработано', more: `${system.numberFormat(dataMining.amount)}`})
        //         m.newItem({name: 'Профит', more: `${system.numberFormat(dataMining.profit)}`})
        //         m.newItem({name: 'Производительность', more: `${system.numberFormat(dataMining.tf)}TF`})
        //         m.newItem({name: 'Питание', more: `${system.numberFormat(dataMining.power.current)} / ${system.numberFormat(dataMining.power.max)}`})
        //         m.newItem({name: 'CPU', more: `${system.numberFormat(dataMining.cpu.current)} / ${system.numberFormat(dataMining.cpu.max)}`})
        //         m.newItem({name: 'RAM', more: `${system.numberFormat(dataMining.ram.current)} / ${system.numberFormat(dataMining.ram.max)}`})
        //
        //
        //         if(item.miningData.amount > 0){
        //             m.newItem({
        //                 name: 'Вывести заработаные средства',
        //                 onpress: () => {
        //                     if(!item.miningData) return player.notify('Майнинг ферма уже не Eingerichtetа', 'error');
        //                     if(!(user.isAdminNow(6) || item.userId == user.id)) return player.notify('Вы не можете установить майнинг ферму', 'error');
        //                     if(!item.miningData.amount) return player.notify('Пустой баланс', 'error');
        //
        //                     if(!user.crypto_number) user.newCryptoNumber();
        //                     user.addCryptoMoney(item.miningData.amount, true, 'Вывод с майнинг фермы');
        //                     item.miningData = {...item.miningData, amount: 0};
        //                     saveEntity(item);
        //                     player.notify('Вы успешно вывели криптовалюту с фермы', 'success');
        //                 }
        //             })
        //         }
        //
        //         const testSelect = (item_ids: number[]): Promise<ItemEntity> => {
        //             const myItems = user.inventory.filter(q => item_ids.includes(q.item_id));
        //             return new Promise(resolve => {
        //                 const submenu = menu.new(player, 'Выбор предмета')
        //                 submenu.onclose = () => {
        //                     resolve(null);
        //                 }
        //
        //                 myItems.map(q => {
        //                     submenu.newItem({
        //                         name: getItemName(q),
        //                         onpress: () => {
        //                             submenu.close()
        //                             resolve(q);
        //                         }
        //                     })
        //                 })
        //
        //                 submenu.open();
        //             })
        //         }
        //
        //         m.newItem({
        //             name: 'Установить алгоритм',
        //             more: `${item.miningData.algorithm ? 'Eingerichtet' : 'Не Eingerichtet'}`,
        //             onpress: () => {
        //                 testSelect(MINING_ALGORITHMS_LEVELS.map(q => q.item)).then(q => {
        //                     if(!q) return houseMenu(player, int);
        //                     const itm = inventory.get(q.id, OWNER_TYPES.PLAYER, user.id);
        //                     if(!itm) return player.notify('Предмет не обнаружен в инвентаре', 'error');
        //                     if(item.miningData.algorithm) user.giveItem(item.miningData.algorithm)
        //                     item.miningData = {...item.miningData, algorithm: itm.item_id};
        //                     saveEntity(item);
        //                     houseMenu(player, int)
        //                 })
        //             }
        //         })
        //         m.newItem({
        //             name: 'Установить CPU',
        //             more: `${item.miningData.cpu ? 'Eingerichtet' : 'Не Eingerichtet'}`,
        //             onpress: () => {
        //                 testSelect(MINING_CPUS.map(q => q.item)).then(q => {
        //                     if(!q) return houseMenu(player, int);
        //                     const itm = inventory.get(q.id, OWNER_TYPES.PLAYER, user.id);
        //                     if(!itm) return player.notify('Предмет не обнаружен в инвентаре', 'error');
        //                     if(item.miningData.cpu) user.giveItem(item.miningData.cpu)
        //                     item.miningData = {...item.miningData, cpu: itm.item_id};
        //                     saveEntity(item);
        //                     houseMenu(player, int)
        //                 })
        //             }
        //         })
        //         let cfg = getMiningLevel(item.miningData.level);
        //         for(let i = 0; i < cfg.max_ram_count; i++){
        //             m.newItem({
        //                 name: `RAM #${i + 1}`,
        //                 more: `${item.miningData.ram[i] ? 'Eingerichtet' : 'Не Eingerichtet'}`,
        //                 onpress: () => {
        //                     testSelect(MINING_RAMS.map(q => q.item)).then(q => {
        //                         if(!q) return houseMenu(player, int);
        //                         const itm = inventory.get(q.id, OWNER_TYPES.PLAYER, user.id);
        //                         if(!itm) return player.notify('Предмет не обнаружен в инвентаре', 'error');
        //                         if(item.miningData.ram[i]) user.giveItem(item.miningData.ram[i])
        //                         let ram = [...item.miningData.ram];
        //                         ram[i] = q.item_id;
        //                         item.miningData = {...item.miningData, ram};
        //                         saveEntity(item);
        //                         houseMenu(player, int)
        //                     })
        //                 }
        //             })
        //         }
        //         for(let i = 0; i < cfg.max_cards; i++){
        //             m.newItem({
        //                 name: `Видеокарта #${i + 1}`,
        //                 more: `${item.miningData.cards[i] ? 'Eingerichtet' : 'Не Eingerichtet'}`,
        //                 onpress: () => {
        //                     testSelect(MINING_VIDEOCARDS.map(q => q.item)).then(q => {
        //                         if(!q) return houseMenu(player, int);
        //                         const itm = inventory.get(q.id, OWNER_TYPES.PLAYER, user.id);
        //                         if(!itm) return player.notify('Предмет не обнаружен в инвентаре', 'error');
        //                         if(item.miningData.cards[i]) user.giveItem(item.miningData.cards[i])
        //                         let cards = [...item.miningData.cards];
        //                         cards[i] = q.item_id;
        //                         item.miningData = {...item.miningData, cards};
        //                         saveEntity(item);
        //                         houseMenu(player, int)
        //                     })
        //                 }
        //             })
        //         }
        //         for(let i = 0; i < cfg.max_additional_power_blocks; i++){
        //             m.newItem({
        //                 name: `Блок питания #${i + 1}`,
        //                 more: `${item.miningData.powers[i] ? 'Eingerichtet' : 'Не Eingerichtet'}`,
        //                 onpress: () => {
        //                     testSelect(MINING_POWERSS.map(q => q.item)).then(q => {
        //                         if(!q) return houseMenu(player, int);
        //                         const itm = inventory.get(q.id, OWNER_TYPES.PLAYER, user.id);
        //                         if(!itm) return player.notify('Предмет не обнаружен в инвентаре', 'error');
        //                         if(item.miningData.powers[i]) user.giveItem(item.miningData.powers[i])
        //                         let powers = [...item.miningData.powers];
        //                         powers[i] = q.item_id;
        //                         item.miningData = {...item.miningData, powers};
        //                         saveEntity(item);
        //                         houseMenu(player, int)
        //                     })
        //                 }
        //             })
        //         }
        //
        //
        //     }
        //
        //
        // }
    }

    if (int.type == "house" && ((item.familyId && user.family && user.familyId === item.familyId && user.family.isCan(user.familyRank, 'houseUpgrade')) || (item.userId && item.userId === user.id))) {
        if(item.haveChest){
            const multiple = Math.pow(HOUSE_CHEST_LEVEL_COST_MULTIPLE, item.haveChestLevel + 1)
            const costCoin = HOUSE_CHEST_LEVEL_COST_COIN * multiple;
            const cost = item.haveChestLevel >= HOUSE_CHEST_MAX_LEVEL ? 0 : HOUSE_CHEST_LEVEL_COST * multiple;
            m.newItem({
                name: langStringDefault("houses.1e148ecc8bff90c0c889914030273490"),
                more: `${item.haveChestLevel} / ${HOUSE_CHEST_MAX_LEVEL}`,// HOUSE_CHEST_KG_PER_LEVEL `Следующее улучшение стоит $${system.numberFormat(cost)} или ${costCoin} коинов`
                desc: langStringDefault("houses.03c551122fe83a0e17129cef219eca43", cost ? langStringDefault("houses.d91a56970c5195e8ea83a903b83e8355", HOUSE_CHEST_KG_PER_LEVEL) : langStringDefault("houses.5ebc708a94cb112857932854abab1aff")),
                onpress: () => {
                    if(item.haveChestLevel >= HOUSE_CHEST_MAX_LEVEL) return player.notify(player.user.LangString("houses.f101fca3cf991bee0f314d6c4ed52314"), 'error');
                    const multiple = Math.pow(HOUSE_CHEST_LEVEL_COST_MULTIPLE, item.haveChestLevel + 1)
                    const costCoin = HOUSE_CHEST_LEVEL_COST_COIN * multiple;
                    const cost = HOUSE_CHEST_LEVEL_COST * multiple;
                    menu.selector(player, player.user.LangString("houses.b855f83215a852b686f031d865c4a8fb"), [player.user.LangString("houses.4e9489102c3a49d94e8953798fa4e9a7", system.numberFormat(cost)), player.user.LangString("houses.8e5ef46232eeedf85375e4047ee1fc96", system.numberFormat(costCoin))], true).then(status => {
                        if(typeof status !== "number" || status < 0) return;
                        if(item.haveChestLevel >= HOUSE_CHEST_MAX_LEVEL) return player.notify(player.user.LangString("houses.67675185e00522a088f95e1ddaa41173"), 'error');
                        const multiple = Math.pow(HOUSE_CHEST_LEVEL_COST_MULTIPLE, item.haveChestLevel + 1)
                        const costCoin = HOUSE_CHEST_LEVEL_COST_COIN * multiple;
                        const cost = HOUSE_CHEST_LEVEL_COST * multiple;


                        if(item.forFamily){
                            const family = user.family;
                            if(!family || family.id !== item.familyId || !user.family.isCan(user.familyRank, 'houseUpgrade')) return player.notify(player.user.LangString("houses.d95194292cdac2223438766db423eb8b"), 'error')
                            if(status === 0){
                                if(family.money < cost) return player.notify(player.user.LangString("houses.5e668ac4b8d63baa0c3e9e5f4674e9a6"), 'error');
                                family.removeMoney(cost, player,langStringDefault("houses.e697a2c2b54e2f37f80f49fa2dafedd5", item.haveChestLevel+1));
                            } else {
                                if(family.donate < costCoin) return player.notify(player.user.LangString("houses.c2d436ed6cfdd1f419e13d98a058f387"), 'error');
                                family.removeDonateMoney(costCoin, player,langStringDefault("houses.4b38143bda1ee39dc8e96ad59d1b714c", item.haveChestLevel+1));
                            }
                        } else {
                            if(status === 0){
                                if(!user.bank_have) return player.notify(player.user.LangString("houses.cb7c215f8165d0a16af42bd1c559f07e"), "error");
                                if(user.bank_money < cost) return player.notify(player.user.LangString("houses.734262c6119e6019e13e647ca27f9fb6"), 'error');
                                user.removeBankMoney(cost, true, user.LangString("houses.313d08a814577e6c0dd66ea603c3bcbe", item.haveChestLevel+1), user.LangString("houses.2ced5aca5d512a4361208153a495ccc6"));
                            } else {
                                if(user.donate_money < costCoin) return player.notify(player.user.LangString("houses.b671c305b9f7ded29f6894e130640456"), 'error');
                                user.removeDonateMoney(costCoin, user.LangString("houses.cdc8a7ad61f3e377c59c8fbf1299722b"))
                            }
                        }
                        item.haveChestLevel++;
                        item.save();
                        player.notify(player.user.LangString("houses.225d733bd01736ad5c531172f4d1b282"), 'success');
                        houseMenu(player, int);
                    })
                }
            })
        }
        m.newItem({
            name: langStringDefault("houses.19787a75c3bb99b5c4499b6836afbb05"),
            desc: langStringDefault("houses.9817767c62ff6132b08a331647cee979"),
            onpress: () => {
                const current = item.stock;
                const submenu = menu.new(player, player.user.LangString("houses.8bf34faf7a9758c289f3805c62a204c1"), `${item.name} №${item.id}`)
                submenu.sprite = "house";
                const nextUpgrade = HOUSE_UPGRADE_LEVEL_COST.find((upgrade, index) => (index == (item.stock + 1) && upgrade.house <= item.price))
                const currentUpgrade = HOUSE_UPGRADE_LEVEL_COST.find((upgrade, index) => (index == (item.stock)))
                submenu.newItem({
                    name: langStringDefault("houses.102bb1480e427b6b330092cf05ccf82b"),
                    more: `LVL: ${item.stock}`,
                    desc: nextUpgrade ? langStringDefault("houses.bed5b7e79cf22f7a0378c933299eb35a", system.numberFormat(nextUpgrade.price), (nextUpgrade.amount - currentUpgrade.amount)) : (item.stock ? langStringDefault("houses.9b880dd437f221f9ffa8ee92ca12d8c1") : langStringDefault("houses.f1963fa88d84b190b9fef317f740f371")),
                    onpress: () => {
                        if (!nextUpgrade) return player.notify(player.user.LangString("houses.3db4227c60b651f82b8c8338b7ac1829"), "error");

                        const success = () => {
                            item.stock++;
                            item.save();
                            player.notify(player.user.LangString("houses.7952f54d8c4d495f43e5d273f576c143"), 'success');
                        }
                        if(item.forFamily){
                            const family = user.family;
                            if(!family || family.id !== item.familyId || !user.family.isCan(user.familyRank, 'houseUpgrade')) return player.notify(player.user.LangString("houses.386de0c49d88cc4407421ec23ef3f469"), 'error')
                            if(family.money < nextUpgrade.price) return player.notify(player.user.LangString("houses.d42cb63758a47a208057bbb70cb4039c"), 'error');
                            family.removeMoney(nextUpgrade.price, player,langStringDefault("houses.e7968dee3590e6d8bd0d97cd1066857e"));
                            success();
                        } else {
                            user.tryPayment(nextUpgrade.price, "all", () => {
                                return current === item.stock
                            }, user.LangString("houses.003dd093926a8c0826ec98c70bf0574a"), user.LangString("houses.352b658d54a442d46739bd943f159ce5")).then(res => {
                                if (!res) return;
                                success()
                            })
                        }
                    }
                })
                submenu.open();
            }
        })

    }
    if (int.type == "house" && !item.familyId) {
        if(item.residents.includes(user.id)){
            m.newItem({
                name: langStringDefault("houses.3a2c4336fab476db3631e765645d44f7"),
                onpress: () => {
                    menu.accept(player, player.user.LangString("houses.4f33fb1c0020bfd5f85696cdae469953"), 'small').then(status => {
                        if(!item.residents.includes(user.id)) return;
                        const d = [...item.residents];
                        if(d.findIndex(q => q === user.id) > -1) d.splice(d.findIndex(q => q === user.id), 1);
                        if (item.car_interrior) {
                            let int = getInteriorGarageById(item.car_interrior);
                            if (int) {
                                Vehicle.getPlayerVehicles(user.id).map(veh => {
                                    const pos = veh.position;
                                    if (pos.d === item.id) {
                                        if (system.distanceToPos2D({ x: pos.x, y: pos.y }, { x: int.cars[0].x, y: int.cars[0].y }) < 100) {
                                            veh.moveToParkingFine(houseVehicleRemoveFine, !veh.vehicle.usedAfterRespawn, langStringDefault("houses.b78acc2c90768607796193906ad8f5b0"))
                                        }
                                    }
                                })
                            }
                        }
                        CustomEvent.triggerClient(player, 'house:homeBlip:delete')
                        item.residents = d;
                        item.save();
                        menu.close(player);
                        player.notify(player.user.LangString("houses.0a64a71509d05b7631e39f476cfe00e1"), 'success');
                    })
                }
            })
        }
        if ((item.userId === user.id || user.isAdminNow(5))) {
            if(item.max_residents){
                m.newItem({
                    name: langStringDefault("houses.4a37056a9251e29175fe9e71389ec68e"),
                    more: langStringDefault("houses.344e560d10d0d016e51b95f658c3ade5", item.residents.length, item.max_residents),
                    onpress: () => {
                        const s = () => {
                            User.getDatas(...item.residents).then(residents => {
                                const submenu = menu.new(player, player.user.LangString("houses.e6ec6ca4377dcea057f95ce87a295fc7"));
                                submenu.sprite = "house";
                                submenu.onclose = () => {
                                    houseMenu(player, int);
                                }
                                if(item.residents.length < item.max_residents){
                                    const nearestPlayer = user.getNearestPlayer(2);
                                    if(nearestPlayer){
                                        submenu.newItem({
                                            name: langStringDefault("houses.4effb10820443e5c05759ec5e5e04dd6", nearestPlayer.user.name, nearestPlayer.dbid),
                                            onpress: () => {
                                                if(!nearestPlayer || !mp.players.exists(nearestPlayer)) return player.notify(player.user.LangString("houses.dd03d5ebd9e27d03d2f288872c328361"), 'error');
                                                menu.accept(nearestPlayer, langStringDefault("houses.4edbb3359111d72632d3d70b54fb4d07"), 'small').then(status => {
                                                    if(!mp.players.exists(player)) return;
                                                    if(!status) return player.notify(player.user.LangString("houses.600a03ecf6c814e85713a814b34e0fc6"), 'error');
                                                    if(item.residents.length >= item.max_residents) return player.notify(player.user.LangString("houses.ddfbbb52e7e08e4cb6140ad24a629728"), 'error');
                                                    if(houses.dataArray.find(q => q.residents.includes(nearestPlayer.dbid) || q.userId === nearestPlayer.dbid)){
                                                        player.notify(player.user.LangString("houses.751f918ab1225adbe5c19ba2f3f738f4"), 'error');
                                                        nearestPlayer.notify(langStringDefault("houses.d35b55f99460d3ff288a0602c0e0bd14"), 'error');
                                                        return;
                                                    }
                                                    const q = [...item.residents];
                                                    q.push(nearestPlayer.dbid);
                                                    item.residents = q;
                                                    player.notify(player.user.LangString("houses.73815b8e3ad7ce6854ce07eabc8c250f"), 'success');
                                                    nearestPlayer.notify(langStringDefault("houses.7fd91942201860e3096b1f735b698198"), 'success');
                                                    player.user.achiev.achievTickByType("inviteResident")
                                                    nearestPlayer.user.achiev.achievTickByType("beResident")
                                                    CustomEvent.triggerClient(nearestPlayer, 'house:homeBlip:create', 
                                                        JSON.stringify({x: item.x, y: item.y, z: item.z}))
                                                    item.save().then(() => {
                                                        if(mp.players.exists(player)) s();
                                                    });
                                                })
                                            }
                                        })
                                    } else {
                                        submenu.newItem({
                                            name: langStringDefault("houses.f53dce3b2609dec3224553a9e6608e7d"),
                                            desc: langStringDefault("houses.9bd175a6305623c8284687442af52213")
                                        })
                                    }
                                } else {
                                    submenu.newItem({
                                        name: langStringDefault("houses.7d1bfbdbc4f546782d812cf6ac40fb10"),
                                        desc: langStringDefault("houses.a4600462f967b2e88b235f7ee0b746a4")
                                    })
                                }
                                residents.map(resident => {
                                    submenu.newItem({
                                        name: resident.rp_name,
                                        more: `#${resident.id}`,
                                        onpress: () => {
                                            menu.accept(player, player.user.LangString("houses.b99cf7915bd86790f980f47a67dfff96", resident.rp_name)).then(status => {
                                                if(!status) return;
                                                const d = [...item.residents];
                                                if(d.findIndex(q => q === resident.id) > -1) d.splice(d.findIndex(q => q === resident.id), 1);
                                                if (item.car_interrior) {
                                                    let int = getInteriorGarageById(item.car_interrior);
                                                    if (int) {
                                                        Vehicle.getPlayerVehicles(resident.id).map(veh => {
                                                            const pos = veh.position;
                                                            if (pos.d === item.id) {
                                                                if (system.distanceToPos2D({ x: pos.x, y: pos.y }, { x: int.cars[0].x, y: int.cars[0].y }) < 100) {
                                                                    veh.moveToParkingFine(houseVehicleRemoveFine, !veh.vehicle.usedAfterRespawn, langStringDefault("houses.ddef55d8eafaa66b37e743922e43031b"))
                                                                }
                                                            }
                                                        })
                                                    }
                                                }
                                                item.residents = d;
                                                item.save().then(() => {
                                                    s();
                                                })
                                            })
                                        }
                                    })
                                })
                                submenu.open();
                            })
                        }
                        s();
                    }
                })
            }
        }
    }

    m.open();
}

interriors.map(int => {
    colshapes.new(new mp.Vector3(int.enter.x, int.enter.y, int.enter.z), int.type == "garage" ? langStringDefault("houses.ca4778461b74e926d5a5102294cca137") : langStringDefault("houses.a631f56994800172e477bf5e18af2907"), player => {
        houseMenu(player, int);
    }, {
        // radius: int.type == "house" ? 1 : 3,
        dimension: -1
    })
})

colshapes.new(new mp.Vector3(HOUSE_STOCK_ENTER_POS.x, HOUSE_STOCK_ENTER_POS.y, HOUSE_STOCK_ENTER_POS.z), player => player?.user?.LangString("houses.1e67caa77b62d5dc879ea9f150c4e4be") ?? langStringDefault("houses.1e67caa77b62d5dc879ea9f150c4e4be"), player => {
    if(!player.user) return
    if(!player.dimension) return;
    const house = houses.get(player.dimension);
    if(!house) return;
    const houseInt = getInteriorHouseById(house.interrior);
    player.user.teleport(houseInt.enter.x, houseInt.enter.y, houseInt.enter.z, houseInt.enter.h, player.dimension);
}, {
    dimension: -1,
    drawStaticName: 'scaleform'
})

mp.events.add("playerEnterVehicle", (player:PlayerMp, vehicle) => {
    if (!player.user) return;
    if (!vehicle.dbid) return;
    if (!player.dimension) return;
    if (vehicle.getOccupant(0) != player) return;
    let house = houses.get(player.dimension);
    if(!house) return;
    if (!houses.isEntityInGarage(vehicle, house)) return;
    vehicle.entity.engine = true;
    if(!house.forTp){
        player.user.teleportVeh(house.car_x, house.car_y, house.car_z, house.car_h, house.d);
    } else {
        const tpcfg = HousesTeleportsList[house.forTp - 1];
        if(!tpcfg) return player.notify(player.user.LangString("houses.f0f72949caedfd6c0f403aa044c4c104"), 'error');
        player.user.teleportVeh(tpcfg.carExit.x, tpcfg.carExit.y, tpcfg.carExit.z, tpcfg.carH, 0);
    }
    // setTimeout(() => {
        // Vehicle.repair(vehicle)
    // }, system.TELEPORT_TIME + 1000)
});

const CACHING_ITEMS_MS : number = 1000;
const _cachedAllMyItems : Map<number, { items: ItemEntity[], cachedMs: number }>
    = new Map<number, {items: ItemEntity[], cachedMs: number}>();
export const isPlayerHasHouseKey = (player: PlayerMp, house: HouseEntity) : boolean => {
    if (!_cachedAllMyItems.has(player.user.id)) {
        _cachedAllMyItems.set(player.user.id, { items: player.user.allMyItems, cachedMs: system.timestampMS });
    }

    const cache = _cachedAllMyItems.get(player.user.id);
    if (system.timestampMS > cache.cachedMs + CACHING_ITEMS_MS) {
        const items = player.user.allMyItems;
        cache.items = items;
        _cachedAllMyItems.set(player.user.id, { items: items, cachedMs: system.timestampMS });
    }

    return !!cache.items.find(itm => itm.item_id == houses.key_id && itm.advancedNumber == house.key && itm.advancedString == "house");
}

const enterGarage = async(player: PlayerMp, house: HouseEntity) => {
    try {
        if (player.dimension === house.d && (!house.forFamily  && !house.userId) && (house.forFamily && house.familyId != player.user.family.id)) return player.notify(player.user.LangString("houses.482ac15391d613ea88db17023e061a2b"), "error");
        let int = getInteriorGarageById(house.car_interrior);
        if (!int) return player.notify(player.user.LangString("houses.cc7910418daf851c42ef58a8a68ad925"), "error")
        let haveAccess = false;
        if (player.user.isAdminNow(6)) haveAccess = true;
        if (!haveAccess) haveAccess = isPlayerHasHouseKey(player, house);
        if (!haveAccess) return player.notify(player.user.LangString("houses.41d19ba4ff00dad6fc449c0544bc270a"), "error")

        const veh = player.vehicle;
        if(veh){
            const driver = veh.getOccupant(0);
            if(!driver || driver.id != player.id) return player.notify(player.user.LangString("houses.82c888f86f17e93ef692beb3f9d3aa76"));
            if( !veh.entity || (!veh.entity.familyOwner && !veh.user) || !veh.dbid) return player.notify(player.user.LangString("houses.d0e94dda8f022456eadd7c91b252caf7"), 'error');
            if(!house.garageAccessVehicle(veh)) return player.notify(player.user.LangString("houses.6fc757c2ece7565851aff0a8defc776b"), "error");
            const spawn_position = veh.entity.position;
            
            if (veh && veh.entity && veh.entity.data) {
                //@ts-ignore
                veh.entity.data = {
                    ...veh.entity.data,
                    engineHealth: veh.engineHealth
                }
                veh.setVariable('engineHealth', veh.engineHealth);
                // veh.entity.data.engineHealth = veh.engineHealth;
                await veh.entity.save();
            }

            if (!mp.players.exists(player)) return;
            if (!mp.vehicles.exists(veh)) return;

            if (houses.isVehInHouse(house, veh)){
                player.user.teleportVeh(spawn_position.x, spawn_position.y, spawn_position.z, spawn_position.h, house.id);
            } else {
                let freeSlot = houses.getFreeVehicleSlot(house);
                if(!freeSlot) return player.notify(player.user.LangString("houses.bff7ea7bcae90ed46abdaee4c89546f6"), "error");
                veh.entity.position = {
                    x: freeSlot.x,
                    y: freeSlot.y,
                    z: freeSlot.z,
                    h: freeSlot.h,
                    d: house.id
                }
                player.notify(player.user.LangString("houses.ba57936178030bc73cc0fed6d3ac1482"), "success");
                player.user.teleportVeh(freeSlot.x, freeSlot.y, freeSlot.z, freeSlot.h, house.id);
            }

            veh.entity.engine = false;
            setTimeout(() => {
                if (mp.vehicles.exists(veh)){
                    veh.getOccupants().filter(target => mp.players.exists(target) && target.user).map(target => target.user.leaveVehicle())
                    veh.usedAfterRespawn = false;
                    veh.entity.engine = false;
                }
            }, system.TELEPORT_TIME)
        } else {
            player.user.teleport(int.enter.x, int.enter.y, int.enter.z, int.enter.h, house.id);
        }
    }
    catch (e) {
        console.log(e);
    }
}

export const HOUSES_LOADED_EVENT = 'houses:loaded';

export const houses = {
    setDoorOpenStatus: (house: HouseEntity, opened: boolean) => {
        house.opened = opened ? 1 : 0;
        let q = houses.dataList.get(house.id);
        if (q) (q[1] as ScaleformTextMp).text =  langStringDefault("houses.c99b5964af94999e458e67f2c45e5d17", house.name, house.id, house.userId || house.familyId ? `${house.opened ? langStringDefault("houses.53dddb79e3853da894ba585279c6f551") : langStringDefault("houses.f211ec75d3d41af054f982ce8e1f8c08")}` : `~g~${system.numberFormat(house.price)}`);
    },

    enterHouse: (player: PlayerMp, item: HouseEntity) => {
        if(!item) return;
        const houseInt = getInteriorHouseById(item.interrior);
        if(!houseInt) return;
        player.user.teleport(houseInt.enter.x, houseInt.enter.y, houseInt.enter.z, houseInt.enter.h, item.id);
        setTimeout(() => {
            if(mp.players.exists(player)) sendMiningData(player, item)
        }, system.TELEPORT_TIME * 1.2)
    },
    key_id: 805,
    data: new Map <number, HouseEntity>(),
    get dataArray(){
      return [...houses.data].map(q => q[1])
    },
    saveAll: () => {
        houses.dataArray
            .forEach(async house => await house.save());
    },
    dataList: new Map <number, { destroy: () => void}[]>(),
    getAllHouseInMultihouse(id: number){
        return houses.dataArray.filter(room => room.forTp === id)
    },
    getFreePosInMultihouse(id: number){
        const rooms = houses.getAllHouseInMultihouse(id);
        const cfg = HousesTeleportsList[id - 1];
        let startD = HOUSES_TELEPORT_SEPARATOR * id
        const coords = cfg.rooms.map(q => {
            return {
                x: q[0],
                y: q[1],
                z: q[2],
                h: q[3],
            }
        });
        let freeD: number;
        let freePos: {x: number, y: number, z: number, h: number};

        while(!freeD && startD < (HOUSES_TELEPORT_SEPARATOR * (id + 1))){
            const floorRoom = rooms.filter(q => q.d === startD);
            if(floorRoom.length < coords.length){
                freeD = startD;
                freePos = coords[floorRoom.length];
            } else {
                startD++;
            }
        }

        return freeD ? {...freePos, d: freeD} : null;

    },
    isEntityInGarage: (entity: EntityMp, house?: number | HouseEntity) => {
        if(!entity) return false;
        if(!entity.dimension) return false;
        if(!house) house = entity.dimension;
        let item = typeof house === "number" ? houses.get(house) : house;
        let int = getInteriorGarageById(item.car_interrior);
        if (!int) return false;
        if(entity.dimension !== item.id) return false;
        return system.isPointInPoints(entity.position, int.cars, 60)
    },
    isVehInHouse: (house: number | HouseEntity, vehicle: VehicleMp) => {
        if (!mp.vehicles.exists(vehicle)) return false;
        if (!vehicle.dbid) return false;
        if (!vehicle.entity) return false;
        let item = typeof house === "number" ? houses.get(house) : house;
        if (!item) return false;
        const spawn = vehicle.entity.position
        if(item.air_x && spawn.d === item.air_d && system.distanceToPos(spawn, {x: item.air_x, y: item.air_y, z: item.air_z}) < 5) return true;

        let int = getInteriorGarageById(item.car_interrior);
        if (!int) return false;
        return spawn.d === item.id && system.isPointInPoints(spawn, int.cars)
    },
    vehiclesInHouses: (house: number | HouseEntity) => {
        let item = typeof house === "number" ? houses.get(house) : house;
        if(!item) return []
        if(!item.familyId && !item.userId) return [];
        return Vehicle.toArray().filter(veh => veh.dbid && veh.entity && !veh.entity.onParkingFine
            && ((!item.forFamily && veh.entity.owner && item.userList.includes(veh.entity.owner) )
                || (item.forFamily && veh.entity.familyOwner && veh.entity.familyOwner === item.familyId))).filter(q => houses.isVehInHouse(item, q))
    },
    getFreeVehicleSlot: (house: number | HouseEntity, air = false) => {
        let item = typeof house === "number" ? houses.get(house) : house;
        if(!item) return null;
        if(air){
            if(!item.air_x) return null;
            let vehsPos = houses.vehiclesInHouses(item).map(veh => {
                return veh.entity.position
            });
            if(system.isPointInPoints(new mp.Vector3(item.air_x, item.air_y, item.air_z), vehsPos)) return null;
            return {x: item.air_x, y: item.air_y, z: item.air_z, h: item.air_h, d: item.air_d}
        }
        let int = getInteriorGarageById(item.car_interrior);
        if(!int) return null
        let vehsPos = houses.vehiclesInHouses(item).map(veh => {
            return veh.entity.position
        });
        let freeSlot: interriorPointData;
        int.cars.map(slot => {
            if(freeSlot) return;
            let free = !system.isPointInPoints(slot, vehsPos, 3)
            if(free) freeSlot = slot
        })
        if (!freeSlot) return null;
        return { ...freeSlot, d: item.id};
    },
    load: () => {
        console.time(langStringDefault("houses.714e1fbc8531f169b615b6ffa5b7acd9"))
        return new Promise((resolve, reject) => {
            HouseEntity.find().then(items => {
                items.map(item => houses.loadItem(item))
                console.timeEnd(langStringDefault("houses.1899026779deccc24229afc12aacff14"))
                resolve(null)

                mp.events.call(HOUSES_LOADED_EVENT, items);
            })
        })
    },
    get: (id:number) => {
        return houses.data.get(id)
    },
    getByOwner: (id:number): HouseEntity => {
        return [...houses.data].map(q => q[1]).find(q => q.userId === id)
    },
    getByFamilyId: (id: number): HouseEntity => {
        return [...houses.data].map(q => q[1]).find(q => q.familyId === id)
    },
    getByUserList: (id:number): HouseEntity => {
        return [...houses.data].map(q => q[1]).find(q => q.userList.includes(id))
    },
    getVehicleSlots: (house: number | HouseEntity) => {
        let item = typeof house === "number" ? houses.get(house) : house;
        if (!item.car_interrior) return null;
        return getInteriorGarageById(item.car_interrior).cars;
    },
    moveAllVehOnParkingFine: (house: number | HouseEntity) => {
        houses.vehiclesInHouses(typeof house === "number" ? house : house.id).map(q => q.entity.moveToParkingFine(0, !q.usedAfterRespawn))
    },
    delete: async (house: number | HouseEntity) => {
        let item = typeof house === "number" ? houses.get(house) : house;
        houses.moveAllVehOnParkingFine(house);
        houses.dataList.get(item.id).map(q => q.destroy());
        houses.data.delete(item.id);
        houses.dataList.delete(item.id);
        await item.remove();
    },
    setOwner: (house:number|HouseEntity, owner:number|PlayerMp, isFamily: boolean, save = true) => {
        return new Promise(async (resolve) => {
            let houseEntity = typeof house === "number" ? houses.get(house) : house;
            if (!owner) houseEntity.stock = 0;
            if (!owner) houseEntity.haveChestLevel = 0;
            if (!owner || (!houseEntity.familyId && !houseEntity.userId)) houseEntity.tax = 0;
            const targetId = !owner ? 0 : (typeof owner === "number" ? owner : owner.user.id);
            if (houseEntity.userId) {
                houseEntity.key = system.getRandomInt(10000000, 90000000);
                houseEntity.tax = 0;
                let int = getInteriorGarageById(houseEntity.car_interrior);
                User.getDatas(...houseEntity.userList).then(users => {
                    if (!users) return;
                    users.map(userEntity => {
                        if (targetId === userEntity.id && !houseEntity.forFamily) return;
                        const vehs = houseEntity.air_x || houseEntity.car_interrior ? Vehicle.getPlayerVehicles(userEntity.id) : []
                        if (houseEntity.car_interrior) {
                            if (int) {
                                vehs.map(veh => {
                                    const pos = veh.position;
                                    if (pos.d === houseEntity.id) {
                                        if (system.isPointInPoints({x: pos.x, y: pos.y}, int.cars)) {
                                            veh.moveToParkingFine(houseVehicleRemoveFine, !veh.vehicle.usedAfterRespawn, langStringDefault("houses.bb809e84a3d8905e552267ae5a8ef3fc"))
                                        }
                                    }
                                })
                            }
                        }
                        if (houseEntity.air_x) {
                            vehs.map(veh => {
                                const pos = veh.position;
                                if (pos.d === houseEntity.air_d) {
                                    if (system.isPointInPoints({x: pos.x, y: pos.y}, [{
                                        x: houseEntity.air_x,
                                        y: houseEntity.air_y
                                    }])) {
                                        veh.moveToParkingFine(houseVehicleRemoveFine, !veh.vehicle.usedAfterRespawn, langStringDefault("houses.62db88b3b38c5b18ce5fa61d92e1ef94"))
                                    }
                                }
                            })
                        }
                    })
                })
            }
            if (houseEntity.familyId) Vehicle.getFamilyVehicles(houseEntity.familyId).map(veh => veh.moveToParkingFine(houseVehicleRemoveFine, !veh.vehicle.usedAfterRespawn, langStringDefault("houses.583c7628871150782964110c34a5f36e")))

            houseEntity.residents = [];

            if (typeof isFamily === 'boolean') houseEntity.forFamily = isFamily ? 1 : 0

            if (houseEntity.userId) {
                const oldOwner = User.get(houseEntity.userId);
                if (oldOwner) CustomEvent.triggerClient(oldOwner, 'house:homeBlip:delete')
            }

            if (targetId) {
                if (houseEntity.forFamily) {
                    houseEntity.familyId = owner as number;
                    houseEntity.car_interrior = DEFAULT_FAMILY_HOUSE_GARAGE;
                    houseEntity.haveChest = 1
                    houseEntity.haveMoneyChest = 1;
                    houseEntity.family = Family.getByID(owner as number).entity
                } else {
                    const target = User.get(targetId);
                    if (target) {
                        houseEntity.user = target.user.entity;
                        houseEntity.userId = target.user.entity.id;
                        houseEntity.tax = houseEntity.taxDay * 2;
                        target.user.achiev.achievTickByType("buyHouse");
                        target.notify(target.user.LangString("houses.40395f213efb3021fed9edadf8a9a19f"), 'warning');
                    } else {
                        const q = await User.getData(targetId)
                        if (q) {
                            houseEntity.user = q;
                            houseEntity.userId = q.id;
                            await q.save()
                        } else {
                            houseEntity.haveChest = 0
                            houseEntity.haveMoneyChest = 0
                            houseEntity.user = null;
                            houseEntity.userId = 0;
                        }
                    }
                }
            } else {
                houseEntity.miningData = null;
                houseEntity.user = null;
                houseEntity.family = null;
                houseEntity.userId = 0;
                houseEntity.familyId = 0;
                houseEntity.haveChest = 0;
                houseEntity.haveMoneyChest = 0;
            }

            let blip = mp.blips.toArray().find(bl => bl.house == houseEntity.id);
            if (blip) blip.color = !!houseEntity.userId || !!houseEntity.familyId ? 1 : 2


            if (blip) {
                if (houseEntity.forFamily && houseEntity.familyId) blip.dimension = 1234567;
                else if (!houseEntity.forFamily && houseEntity.userId) blip.dimension = 1234567;
                else blip.dimension = houseEntity.d;
                blip.color = !!houseEntity.userId || !!houseEntity.familyId ? 1 : 2;
            }
            const target = User.get(targetId);
            if (target) {
                CustomEvent.triggerClient(target, 'house:homeBlip:create', JSON.stringify(new mp.Vector3(
                    houseEntity.x,
                    houseEntity.y,
                    houseEntity.z
                )));
            }

            let q = houses.dataList.get(houseEntity.id);

            if (q) (q[0] as ScaleformTextMp).text = langStringDefault("houses.0472c1c7d958a80be3897f16de55d40b", houseEntity.name, houseEntity.id, houseEntity.userId || houseEntity.familyId ? `${houseEntity.opened ? langStringDefault("houses.b25e97d33ecf0785b0c681afd78840df") : langStringDefault("houses.517810c9ff01185f07eb6fdf9e6d53f7")}` : `~g~${system.numberFormat(houseEntity.price)}`);

            if (houseEntity.haveMoneyChest) {
                q.push(colshapes.new(HOUSE_MONEY_POS, player => player?.user?.LangString("houses.630b6d2583cb5f139274b4a922039802") ?? langStringDefault("houses.630b6d2583cb5f139274b4a922039802"), (p) => houses.openMoneyChestMenu(p, houseEntity), {
                    color: [100, 103, 163, 100],
                    dimension: houseEntity.id,
                    type: 1,
                    drawStaticName: "scaleform"
                }))
            }

            houses.reloadBlip(houseEntity);

            houses.updateScaleformText(houseEntity);
            if (save) await saveEntity(houseEntity);
            return resolve(null)
        })
    },
    reloadBlip(house: HouseEntity) {
        if (house.forTp) return;

        if (!(house.userId && house.familyId)) {
            if (!house.blip) {
                house.blip = system.createBlip(40, 2, new mp.Vector3(house.x, house.y, house.z), "Casa de Vanzare", 0)

            }
        }
        else {
            if (house.blip) house.blip.destroy();
            
            mp.players.toArray().forEach((c) => {
                c.call('house:blip:create', [{x: house.x, y: house.y, z: house.z, isOwner: (house.userId == c.dbid) || (house.familyId == c.user?.family?.id)}])
            })
        }
    },

    loadAllBlips(player: PlayerMp) {
        let arr = [];

        houses.data.forEach((c) => {
            if (!c.forTp && (c.userId || c.familyId) && !(c.userId == player.dbid || c.familyId == player.user?.family?.id)) arr.push({
                x: c.x,
                y: c.y,
                z: c.z,
                isOwner: false
            });
        })

        player.call("house:blip:createAll", [JSON.stringify(arr)]);
    },
    updateScaleformText: (item: HouseEntity) => {
        let q = houses.dataList.get(item.id);
        if (q) (q[1] as ScaleformTextMp).text = langStringDefault("houses.bb35005be148de9c39723e452c63f808", item.name, item.id, item.userId || item.familyId ? `${item.opened ? langStringDefault("houses.31cd01cbaf89544627468db264cd47cc") : langStringDefault("houses.7a3e542e28d66d818d5e4902f3b967df")}` : `~g~${system.numberFormat(item.price)}`);
    },
    buyHouse: (player: PlayerMp, item: HouseEntity, res: ()=>void) => {
        const user = player.user;
        if(!user) return;
        const m = menu.new(player, "HOUSE", `${item.name} #${item.id}`);
        // const m = menu.new(player, player.user.LangString("houses.14da1a1a9c012a2e02595080d74bb715"), `${item.name} #${item.id}`);
        m.sprite = "house";

        m.newItem({
            name: langStringDefault("houses.49202d6aad22e49ae170b859bd7b562a"),
            more: `$${system.numberFormat(item.price)}`
        })


        m.newItem({
            name: langStringDefault("houses.3e9a899426495497d66da990ece6ed4b"),
            onpress: async () => {
                if (!item.canPurchase) return player.notify(player.user.LangString("houses.6875d3db2e3b761525ae6d874c3f4c39"));
                if(item.userId || item.familyId) return player.notify(player.user.LangString("houses.df8a123606c9d3ff7bcfd922b43f3afd"), 'error');
                if (player.user.houseEntityLive) return player.notify(player.user.LangString("houses.742a90a932a060880354b99e6c26d06a"), "error")
                if (await player.user.tryPayment(item.price, "all", () => {
                    return !(item.userId || item.familyId)
                }, langStringDefault("houses.bfc01358c9c9708e33cdc3937ce89887") + item.id, player.user.LangString("houses.c6c3403a289860d65062f3f8fd6fd902"))) {
                    item.user = player.user.entity;
                    item.key = system.getRandomInt(10000000, 90000000);
                    houses.setOwner(item, player, false);
                    player.notify(player.user.LangString("houses.a63852489e252222268af3ad551a4fce"))
                    inventory.createItem({
                        owner_type: OWNER_TYPES.PLAYER,
                        owner_id: player.user.id,
                        item_id: houses.key_id,
                        advancedNumber: item.key,
                        advancedString: "house",
                        serial: langStringDefault("houses.801e3775a21b85a62bd1380731009c0c", item.name, item.id),
                    })
                    if(res) res();
                }
            }
        })

        m.newItem({
            name: langStringDefault("houses.5b5d10ad65657b3a565fa01ce7547ee8"),
            onpress: async () => {
                const family = user.family;
                if (!item.canPurchase) return player.notify(player.user.LangString("houses.0a3f7945e614bde49c1e3f45209352a7"));
                if (!family || !family.isCan(user.familyRank, 'buyHouse')) return player.notify(player.user.LangString("houses.6cbb39a31545900d764b97797c191e6d"), "error")
                const allowClass = family.getFamilyCanHouseClass;
                if(!!item.forTp && !allowClass.inMultiHouse)
                    return player.notify(player.user.LangString("houses.58fa74e24b7509c95d4bd29057dee431"), "error")
                if(!!item.air_x && !allowClass.inHouseWithAir)
                    return player.notify(player.user.LangString("houses.ab29fc3febe865e84b948e89276bf961"), "error")
                if(!item.forTp && !item.air_x && !allowClass.inCustomHouse)
                    return player.notify(player.user.LangString("houses.d63aa64448d652e197bb7aa6af6f2b34"), "error")
                if (family.house) return player.notify(player.user.LangString("houses.572be9529226e7582ea2c1e760398550"), 'error');
                if (family.money < item.price) return player.notify(player.user.LangString("houses.71de25e7a2896e48ebc87c2a3797c469"), 'error');
                family.removeMoney(item.price, player,langStringDefault("houses.4da8092ffaff1862f78311477094f447", item.name, item.id))
                player.notify(player.user.LangString("houses.131f6bafd9f4bd90f67da8fef356d896"), 'success')
                houses.setOwner(item, family.id, true)
                if(res) res();
            }
        })

        m.open()
    },
    clearHouseEntities: (house: HouseEntity) => {
        const entities = houses.dataList.get(house.id);
        for (let entity of entities) {
            entity.destroy();
        }
    },
    loadItem: async (item: HouseEntity) => {
        Vehicle.addBlockNpcCarZone(new mp.Vector3(item.x, item.y, item.z))
        houses.data.set(item.id, item);
        let ents:any[] = []
        /*
        const blip = system.createBlip(492, 2, new mp.Vector3(item.x, item.y, item.z), !!item.familyId ? 'Семейный дом':'Дом', item.d)
        
        blip.scale = system.blipBaseScale / 1.5;
        blip.house = item.id;
        if (item.userId || (item.familyId)) blip.dimension = 1234567;
        else blip.dimension = item.d;
        ents.push(blip)
        */

        const furnitureResult = await FurnitureEntity.find({
            where: {
                houseId: item.id
            }
        })

        if (furnitureResult) {
            item.furnitureData = furnitureResult;
        }

        let blip: BlipMp;

        if (!(item.userId && item.familyId)) {
            blip = system.createBlip(40, 2, new mp.Vector3(item.x, item.y, item.z), "Casa de Vanzare", 0, true, 0.6)
            ents.push(blip)
        }


        const houseInt = getInteriorHouseById(item.interrior);
        ents.push(new ScaleformTextMp(new mp.Vector3(item.x, item.y, item.z + 1),  langStringDefault("houses.302cd1811434dbf084764811ecd45611", item.name, item.id, item.userId || item.familyId ? `${item.opened ? langStringDefault("houses.2fc2a7917f1b47d0ef6b94116b51e241") : langStringDefault("houses.f47cbc34bc48407d556aff827f51cc33")}` : `~g~${system.numberFormat(item.price)}`), {
            dimension: item.d
        }));
        ents.push(colshapes.new(new mp.Vector3(item.x, item.y, item.z), () => { return `${item.name} #${item.id}`}, player => {
            if (!houseInt) return player.notify(player.user.LangString("houses.38512110364eff9f2e716af8663139e9"), "error")
            const cmenu = async () => {
                const user = player.user
                const m = menu.new(player, "", `${item.name} #${item.id}`)
                m.sprite = "house";
                if (!item.userId && !item.familyId) {
                    m.newItem({
                        name: langStringDefault("houses.fcd1164815c93865c662beb6c5545005"),
                        more: `$${system.numberFormat(item.price)}`,
                        desc: `${item.forFamily ? langStringDefault("houses.b807001a6e43968695b04b8c8c0bd823", item.forTp ? langStringDefault("houses.ed25b9c16f3ab81d3d066c946913afc3") : langStringDefault("houses.afc56ad52c427d4f0686b1b70401cbf4")) : langStringDefault("houses.46f28f2d499e3e3f785da6a9da23abf0", item.forTp ? langStringDefault("houses.bbcd894f2052e7194164689ab1fe41fb") : langStringDefault("houses.9fdba94ee4a1ade1d701bc104c7e7881"))}`,
                        onpress: async () => {
                            houses.buyHouse(player, item, cmenu);
                        }
                    })
                    m.newItem({
                        name: langStringDefault("houses.2701756be438e1bd804c572fa876f2ec"),
                        more: `${item.car_interrior ? langStringDefault("houses.8d18a58e7f6b5d6e461ec1bb233e8e09") + getInteriorGarageById(item.car_interrior).cars.length + langStringDefault("houses.e308e650b6b4b760b7bbfe294e7a01c3") : langStringDefault("houses.decaecc4360a140149023ed17239a466")}`
                    })
                    m.newItem({
                        name: langStringDefault("houses.ac7a676a9dc63b66c683d4e7bdd4ea40"),
                        more: `${item.haveChest ? langStringDefault("houses.c1f1f638dd0548899604f490f541a650") : langStringDefault("houses.8cf62cfa5986d0109988cb733a65b513")}`
                    })
                    if(item.haveChest){
                        m.newItem({
                            name: langStringDefault("houses.89a6bec283ec41e69af9dd37fcead3ea"),
                            more: `${item.haveMoneyChest ? langStringDefault("houses.7492ffab3cd5dc1537765ea3393f6e28") : langStringDefault("houses.a24cc79ad4f1bfefb53436984e17d98a")}`
                        })
                    }
                    m.newItem({
                        name: langStringDefault("houses.6db222775d0de247e4d5315de54d3621"),
                        more: `${!!item.air_x ? langStringDefault("houses.b2461ec0ef01fba5a5ffbb00bda37469") : langStringDefault("houses.653e17db530a80acf3f488e543e52d83")}`
                    })
                    m.newItem({
                        name: langStringDefault("houses.307956aacda8f0db533fc094cabd64ae"),
                        more: `${houseInt.stock ? langStringDefault("houses.c00e4a889b34fc97deab6155288ae54a") : langStringDefault("houses.86f4b2b61a9e9e66e188b53eadbe17ab")}`
                    })
                    m.newItem({
                        name: langStringDefault("houses.8e92ea1c4f14bcbfb9385b1d41a4c7f0"),
                        onpress: () => {
                            m.close();
                            if (item.userId) return player.notify(player.user.LangString("houses.9db5e424e716bc4a10c51332d3d4f106"), 'error')
                            player.user.teleport(houseInt.enter.x, houseInt.enter.y, houseInt.enter.z, houseInt.enter.h, item.id);
                        }
                    })
                } else {
                    if(item.userId) {
                        const owner = await User.getData(item.userId);
                        if (owner) {
                            m.newItem({
                                name: langStringDefault("houses.ca169cd7aba2d617d40e64330de97f9a"),
                                desc: `${owner.rp_name} (${owner.id})`
                            })
                        }
                    }
                    if(item.familyId) {
                        const owner = Family.getByID(item.familyId)
                        if(owner) {
                            m.newItem({
                                name: langStringDefault("houses.285b86a9fc6e8351925104d1766036b5"),
                                desc: `${owner.name}`
                            })
                        }
                    }
                    if (player.user.hasPermission('admin:houses:door') || !!user.allMyItems.find(itm => itm.item_id == houses.key_id && itm.advancedNumber == item.key && itm.advancedString == "house")) {
                        m.newItem({
                            name: langStringDefault("houses.2a87324141debf868e62b17970c69411"),
                            more: !item.opened ? langStringDefault("houses.03ffafc3fc224653462e1f43d2f68d62") : langStringDefault("houses.071786a18c754e2ab549c6a1eb00bc54"),
                            onpress: () => {
                                m.close();
                                if (player.user.spam(1000)) return player.notify(player.user.LangString("houses.584bbd4c3d44def510d43be11545ca74"), 'error');

                                houses.setDoorOpenStatus(item, !item.opened);

                                player.notify(langStringDefault("houses.44b83e289f715315ff425b7085fcd749") + (item.opened ? langStringDefault("houses.c229d9cd89f568c848e4329cdf013ed9") : langStringDefault("houses.7d4877874ba4c268355d9b4daec22e77")), "success");
                                Logs.new(`house_door_${item.id}`, `${user.name} [${user.id}]`, `${item.opened ? langStringDefault("houses.4ce3e625760a10d481c9c384e55b44f3") : langStringDefault("houses.e225e4d9f0f13aec214637e42278d310")} Tür`);
                                item.save();
                            },
                        })
                        m.newItem({
                            name: langStringDefault("houses.e813b8b031738efe000731359c671798"),
                            desc: langStringDefault("houses.c5ae495360cc7aada0334af8fd753e7c"),
                            onpress: () => {
                                Logs.open(player,`house_door_${item.id}`, langStringDefault("houses.b62ae890333be7dd1c42a3ead5880b5e", item.name, item.id));
                            },
                        })
                    }
                    m.newItem({
                        name: langStringDefault("houses.de32d6341d60cf3a26ff63f2f237c1c8"),
                        onpress: () => {
                            m.close();
                            let haveAccess = !!item.opened;
                            if (player.user.isAdminNow(6)) haveAccess = true;
                            if (!item.key) haveAccess = true;
                            if (!haveAccess) haveAccess = !!player.user.allMyItems.find(itm => itm.item_id == houses.key_id && itm.advancedNumber == item.key && itm.advancedString == "house");
                            if (!haveAccess) return player.notify(player.user.LangString("houses.f65601d4ebe4978881aa55dd7f56a24c"), "error")
                            player.user.teleport(houseInt.enter.x, houseInt.enter.y, houseInt.enter.z, houseInt.enter.h, item.id);
                            houses.enterHouse(player, item)
                            furniture.enterHouse(player, item);
                        }
                    })
                    if (item.userId === player.user.id || player.user.isAdminNow(6) || (item.forFamily && user.familyId === item.familyId && user.family.isCan(user.familyRank, 'keyDublicate'))) {
                        m.newItem({
                            name: langStringDefault("houses.e68ec1246cd8440fec98cf7def4e253f"),
                            more: `$${system.numberFormat(houseKeyCost)}`,
                            onpress: async () => {
                                m.close();
                                let haveAccess = false;
                                if (player.user.isAdminNow(6)) haveAccess = true;
                                if (!haveAccess) {
                                    haveAccess = await player.user.tryPayment(houseKeyCost, "all", () => {
                                        return (item.userId === player.user.id || player.user.isAdminNow(6) || (item.forFamily && user.familyId === item.familyId && user.family.isCan(user.familyRank, 'keyDublicate')))
                                    }, langStringDefault("houses.880bf8b30e256151a72799903f16eece") + item.id, player.user.LangString("houses.468151a96ab1c349732a70b949851681"))
                                }
                                if (!haveAccess) return;
                                inventory.createItem({
                                    owner_type: OWNER_TYPES.PLAYER,
                                    owner_id: player.user.id,
                                    item_id: houses.key_id,
                                    advancedNumber: item.key,
                                    advancedString: "house",
                                    serial: langStringDefault("houses.9be2a374fe985267eeaada159763bf4b", item.name, item.id, item.forFamily ? langStringDefault("houses.e9314fa4f93c3d3da3476273b55b2ed4", user.name) : ``),
                                })
                                player.notify(player.user.LangString("houses.f465c8c69a76963606c45318258491ce"), "success")
                            }
                        })
                        if(item.haveChest){
                            m.newItem({
                                name: langStringDefault("houses.a75ee56cf68dfbd7f92e80b7c5704614"),
                                more: `$${system.numberFormat(houseKeyCost)}`,
                                onpress: async () => {
                                    m.close();
                                    let haveAccess = false;
                                    if (player.user.isAdminNow(6)) haveAccess = true;
                                    if (!haveAccess) {
                                        haveAccess = await player.user.tryPayment(houseKeyCost, "all", () => {
                                            return (item.userId === player.user.id || player.user.isAdminNow(6) || (item.forFamily && user.familyId === item.familyId && user.family.isCan(user.familyRank, 'keyDublicate')))
                                        }, langStringDefault("houses.72775cf8f838223c7c6862957cc7b3a9") + item.id, player.user.LangString("houses.716b85684b7c7468e20fe0992e5f4a09"))
                                    }
                                    if (!haveAccess) return;
                                    inventory.createItem({
                                        owner_type: OWNER_TYPES.PLAYER,
                                        owner_id: player.user.id,
                                        item_id: houses.key_id,
                                        advancedNumber: item.key,
                                        advancedString: "house_chest",
                                        serial: langStringDefault("houses.942700593bc17e7bf5529679a876656b", item.name, item.id, item.forFamily ? langStringDefault("houses.09dbae0d6872e6ffaf35297c762badb2", user.name) : ``),
                                    })
                                    player.notify(player.user.LangString("houses.1ee90cafc194a6213292b03aed90e0c4"), "success")
                                }
                            })
                        }
                        if(item.userId === player.user.id || player.user.isAdminNow(6) || (item.forFamily && user.family.isCan(user.familyRank, 'changeLock'))){
                            m.newItem({
                                name: langStringDefault("houses.c696f10aff024b5caf0aab082d6dd27d"),
                                more: `$${system.numberFormat(houseLockRepairCost)}`,
                                desc: langStringDefault("houses.f3e34fd43087a002fe53e2364cb73411"),
                                onpress: async () => {
                                    m.close();
                                    let haveAccess = false;
                                    if (player.user.isAdminNow(6)) haveAccess = true;
                                    if (!haveAccess) {
                                        if(item.forFamily){
                                            if(user.family && user.family.money > houseLockRepairCost) {
                                                haveAccess = true
                                                user.family.removeMoney(houseLockRepairCost, player, langStringDefault("houses.b7281d43ea5a181ae97f1f1ca70b2648", item.id))
                                            } else {
                                                player.notify(player.user.LangString("houses.778be0539226e45293a161d4456850ad"), 'error');
                                            }
                                        } else {
                                            haveAccess = await player.user.tryPayment(houseLockRepairCost, "all", () => {
                                                return (item.userId === player.user.id || player.user.isAdminNow(6) || (item.forFamily && user.familyId === item.familyId && user.family.isCan(user.familyRank, 'changeLock')))
                                            }, langStringDefault("houses.dfc31154881a6b5d9e2c9f958fe826ff") + item.id, player.user.LangString("houses.2d1351c3ac35b9c53dc6b8790d2f11be"))
                                        }
                                    }
                                    if (!haveAccess) return;
                                    item.key = system.getRandomInt(10000000, 90000000);
                                    item.save();
                                    player.notify(player.user.LangString("houses.5e0c8a0b62bfd491d52d89821176be52"), "success")
                                }
                            })
                        }
                    }
                }
                if (item.userId === player.dbid || (item.forFamily && item.familyId === user.familyId && user.family.isCan(user.familyRank, 'sellHouse'))) {
                    m.newItem({
                        name: langStringDefault("houses.07ba37dbb62c42d25c5709ce910b3874"),
                        more: `$${system.numberFormat(item.price - ((item.price / 100) * SELL_GOS_TAX_PERCENT))}`,
                        desc: langStringDefault("houses.a86c01cb281580507c21cb35b2b41fc4", SELL_GOS_TAX_PERCENT),
                        onpress: () => {
                            const vehs = houses.vehiclesInHouses(item).length
                            menu.accept(player, player.user.LangString("houses.1b978db9261d47af24d917bd5eeb352d", vehs > 0 ? langStringDefault("houses.cc2c20b65ce5d5e811c7cd1e561d5400") : '')).then(status => {
                                if (!status) return;
                                if(item.forFamily){
                                    if(!item.familyId || item.familyId !== user.familyId) return player.notify(player.user.LangString("houses.911f682579c6fb6f3938e8d4c0e01399"), 'error');
                                    user.family.addMoney(item.price - ((item.price / 100) * SELL_GOS_TAX_PERCENT), player,langStringDefault("houses.b9a03d54276706d098aa16948c48327e"))
                                } else {
                                    if (!user.bank_have) return player.notify(player.user.LangString("houses.eae18a09bae2c441e5578f966063c341"), "error");
                                    if (item.userId !== player.dbid) return;
                                    user.addBankMoney(item.price - ((item.price / 100) * SELL_GOS_TAX_PERCENT), true, user.LangString("houses.bbef0981e41647c13dcc003e5235f76d", item.name, item.id), user.LangString("houses.b029053eef1bea3e114279499b2fea88"))
                                }
                                houses.setOwner(item, null, true);
                                player.notify(player.user.LangString("houses.00d0f82f5ee263a5f4ef80257bee42cc"), 'success')
                                menu.close(player);
                            })
                        }

                    })
                    if(item.userId === player.dbid){
                        const target = user.getNearestPlayer(2);
                        if (target && !item.forFamily) {
                            m.newItem({
                                name: langStringDefault("houses.3a5741640559be13e04b350e3aecd981"),
                                onpress: () => {
                                    const vehs = houses.vehiclesInHouses(item).length
                                    menu.accept(player, player.user.LangString("houses.4b45360356552612b08046361d5a4c95", vehs > 0 ? player.user.LangString("houses.158f30fc1098bcfe08a0f5ab4b7ccd70") : '')).then(async status => {
                                        if (!status) return;
                                        if (!mp.players.exists(target)) return;
                                        if (!user.bank_have) return player.notify(player.user.LangString("houses.d898605f2bba1f6236ca51ef490bde86"), "error");
                                        if (!target.user.bank_have) return target.notify(target.user.LangString("houses.9d027311c4069d357024fb39466c29b3"), "error");
                                        if (target.user.house) return target.notify(target.user.LangString("houses.a7f0eb5758474fda267287f4d1cecd0f"), "error");
                                        const sum = await menu.input(player, player.user.LangString("houses.fcb746bbadb0dbb85505d8313374e9cf"), '', 7, 'int');
                                        if(!sum || sum < 0) return;
                                        menu.accept(target, target.user.LangString("houses.7c662b51008c91602adb70a6bd9ddcaf", system.numberFormat(sum))).then(status2 => {
                                            if (!status2) return;
                                            if (!mp.players.exists(target)) return;
                                            if (!mp.players.exists(player)) return;
                                            if(user.house !== item.id) return player.notify(player.user.LangString("houses.a5de06270b8105f3115f11f92d2834b2"), 'error'), target.notify(target.user.LangString("houses.2da34bbff0bfdf320a43cf479ea181e6"), 'error');
                                            if (target.user.tryRemoveBankMoney(sum, true, langStringDefault("houses.dcaf8f169c5cc51623780fb42f4aa345", item.name, item.id, player.user.name, player.dbid), langStringDefault("houses.c1646eca59f98f3df5ed1f33c427b812"))) {
                                                houses.setOwner(item, target, false);
                                                user.addBankMoney(sum, true, user.LangString("houses.0f540dc486a6d42eb0f8467bc614fbcc", item.name, item.id, target.user.name, target.dbid), user.LangString("houses.7ed1820ab7c60232c37da9b97107ac4d"))
                                                player.notify(player.user.LangString("houses.b1ef1f7b9b0e47589eb64708844c0e67"), 'success')
                                                target.notify(target.user.LangString("houses.b8ee78acd9c9fb2e089b999f57ba2ee5"), 'success')
                                            } else {
                                                player.notify(player.user.LangString("houses.4638b5d96278ea61bb1df97427fa04b1"), 'error')
                                                target.notify(target.user.LangString("houses.254da028b444e2fdf4e9810caf3a688b"), 'error')
                                            }
                                            menu.close(player);
                                            menu.close(target);
                                        })


                                    })
                                }
                            })
                        }
                    }
                }
                if (player.user.hasPermission('admin:gamedata:edithouse')) {
                    m.newItem({
                        name: langStringDefault("houses.157343473cec16cba70a0fd8ff520589"),
                        onpress: async () => {}
                    })
                    m.newItem({
                        name: langStringDefault("houses.77ba8c3c5e1bbe27b8775b55951cfcab"),
                        more: `$${system.numberFormat(item.price)}`,
                        onpress: async () => {
                            m.close();
                            menu.input(player, player.user.LangString("houses.2d870fd0338efd2b955f31edf65a27df"), item.price, 7, 'int').then(status => {
                                if (!status || status < 0 || status > 9999999) return;
                                const lastValue = item.price;
                                item.price = status;
                                houses.updateScaleformText(item);
                                cmenu()
                                writeSpecialLog(langStringDefault("houses.1fa832ed2475e5a259683038562dee08", item.price, status), player, item.id);
                                player.notify(player.user.LangString("houses.fc23aa9c540b48734fb3d16716d17e68"), 'success')
                                saveEntity(item)
                            }) 
                        }
                    })
                    m.newItem({
                        name: langStringDefault("houses.a3b4933ced7268cbb625f2f53d558499"),
                        desc: langStringDefault("houses.afc7287907e055fb659b490f871045d2"),
                        more: item.interrior ? getInteriorHouseById(item.interrior).name : langStringDefault("houses.bfe44b99924602a4f56109a0d67df1c3"),
                        onpress: () => {

                            const ints:[number, string][] = interriors.filter(q => q.type === "house").map(q => {
                                return [q.id, `${q.name}`]
                            });
                            const z = ints.findIndex(q => q[0] === item.interrior)

                            menu.selector(player, player.user.LangString("houses.15f6d47e2c10ba0f04cf1ab8f693646e"), ints.map(q => `${q[0]}) ${q[1]}`), true, null, true, z > -1 ? z : 0).then(index => {
                                if(typeof index !== "number") return;
                                if(!ints[index]) return;
                                item.interrior = ints[index][0];
                                furniture.clearPlacementFurniture(player, item);
                                saveEntity(item);
                                cmenu();
                                player.notify(player.user.LangString("houses.ff67238bba395bbcfbbfe3a76cdb9e36"), 'success')
                            })
                        }
                    })
                    m.newItem({
                        name: langStringDefault("houses.9c515a55d182f14ef5571d1d02bd26ff"),
                        desc: langStringDefault("houses.95fcd704ee53fcd570aa8a4e5890f935"),
                        more: item.car_interrior ? getInteriorGarageById(item.car_interrior).name : langStringDefault("houses.237f691cdf0d9a68c2fe55424527605f"),
                        onpress: () => {

                            const ints:[number, string][] = interriors.filter(q => q.type === "garage").map(q => {
                                return [q.id, `${q.name}`]
                            });
                            const z = ints.findIndex(q => q[0] === item.car_interrior)

                            menu.selector(player, player.user.LangString("houses.fc4a89b8aba235604888e229e0cdbf5e"), ints.map(q => `${q[0]}) ${q[1]}`), true, null, true, z > -1 ? z : 0).then(index => {
                                if(typeof index !== "number") return;
                                if(!ints[index]) return;
                                item.car_interrior = ints[index][0];
                                saveEntity(item);
                                cmenu();
                                player.notify(player.user.LangString("houses.f160de4a8fbd6b671b71022288cb874d"), 'success')
                            })
                        }
                    })
                    m.newItem({
                        name: langStringDefault("houses.95df52132bf7647414bb8ace41767e16"),
                        onpress: async () => {
                            m.close();
                            menu.accept(player).then(status => {
                                if (!status) return;
                                writeSpecialLog(langStringDefault("houses.b7ca8e5c2516207b9f8719f41896cd92", houses.get(item.id).x, houses.get(item.id).y, houses.get(item.id).z), player, item.userId ? item.userId : 0);
                                houses.delete(item);
                                player.notify(player.user.LangString("houses.9f3c2b19c360114a19b56b03efc42ba7"), 'success')
                            })
                        }
                    })
                    m.newItem({
                        name: langStringDefault("houses.6a53fa7be5dae68e1dcb634de007eaa8"),
                        onpress: async () => {
                            m.close();
                            menu.accept(player).then(status => {
                                if (!status) return;
                                item.miningData = null;
                                item.save();
                            })
                        }
                    })
                }

                invokeHook(HOUSES_ENTER_MENU_HOOK, player, item, m, cmenu);

                m.open();
            }
            cmenu();
        }, {
            dimension: item.d,
            type: -1
        }))
        if(item.car_interrior && !item.forTp){
            ents.push(colshapes.new(new mp.Vector3(item.car_x, item.car_y, item.car_z + 0.03), () => { return langStringDefault("houses.e4ac723eafdedf72e255fadc1b7d851e", item.name, item.id)}, player => {
                const m = menu.new(player, "", player.user.LangString("houses.65a0d28c49d4098c87c3668a4dbf8d8c", item.name, item.id))
                m.sprite = "house";
                
                m.newItem({
                    name: langStringDefault("houses.608450159889004a01e5ce12c3985be4"),
                    onpress: async () => {
                        m.close();
                        enterGarage(player, item)
                    }
                })
                
                m.open();
            }, {
                dimension: item.car_d,
                color: [255, 0, 0, 60],
                type: 27,
                radius: 4,
                predicate: player => {
                    return player.user && (player.user.isAdminNow(6) || isPlayerHasHouseKey(player, item));
                }
            }, 'admin', 'houseKey'))
        }
        if(item.haveMoneyChest){
            ents.push(colshapes.new(HOUSE_MONEY_POS, player => player?.user?.LangString("houses.fc1548fd6189d250a61759498c1f694c") ?? langStringDefault("houses.fc1548fd6189d250a61759498c1f694c"), (p) => houses.openMoneyChestMenu(p, item), {
                color: [100, 103, 163, 100],
                dimension: item.id,
                type: 1,
                drawStaticName: "scaleform"
            }))
        }
        houses.dataList.set(item.id, ents)
    },
    openMoneyChestMenu: (player: PlayerMp, item: HouseEntity) => {
        const user = player.user;
        if(!user) return;
        const m = menu.new(player, player.user.LangString("houses.2551ce3c7f2bf2edd563d65f3120b549"));
        m.newItem({
            name: langStringDefault("houses.3b9f1464ed48d49a462ad3ef7da96a39"),
            more: `$${system.numberFormat(item.moneyChest)}`
        })
        m.newItem({
            name: langStringDefault("houses.c2a9790b2fe56327349c8c6af02659f4"),
            onpress: () => {
                if(!item.forFamily && item.userId !== user.id) return player.notify(player.user.LangString("houses.3817d9ce0171eae7ba1d770e8142e3c7"))
                if(item.forFamily && ((item.familyId !== user.familyId) || !user.family || !user.family.isCan(user.familyRank, 'money_take'))) return player.notify(player.user.LangString("houses.992a15f84e02b8c2692ef25017b70ace"))
                menu.close(player);
                menu.input(player, player.user.LangString("houses.804e8ee4362c36dc4f5de40f9f63a870"), Math.min(100, item.moneyChest), 8, 'int').then(sum => {
                    if(!sum || isNaN(sum) || sum <= 0) return;
                    if(!item.forFamily && item.userId !== user.id) return player.notify(player.user.LangString("houses.fef9f1fd36ee37d2a303d98637f15938"))
                    if(item.forFamily && ((item.familyId !== user.familyId) || !user.family || !user.family.isCan(user.familyRank, 'money_take'))) return player.notify(player.user.LangString("houses.dd2fdf89336fc9e05088e09401594e6c"))
                    if(sum > item.moneyChest) return player.notify(player.user.LangString("houses.42f7de00df78c6874ecbda03df87cac3"), 'error');
                    user.addMoney(sum, true, user.LangString("houses.14cd936a640ecfca9276a5c6e414d815", item.id));
                    item.removeMoneyChest(sum, player, langStringDefault("houses.6f62ccf00f09aacc97e3f6761d210ff7"))
                })
            }
        })
        m.newItem({
            name: langStringDefault("houses.baf96c1859bc93db88f29a148365cb47"),
            onpress: () => {
                menu.close(player);
                menu.input(player, player.user.LangString("houses.0051c1c041a35e9375b48d285b48115f"), Math.min(100, user.money), 8, 'int').then(sum => {
                    if(!sum || isNaN(sum) || sum <= 0) return;
                    if(sum > user.money) return player.notify(player.user.LangString("houses.9d8b9adf2e6e190daf1fa3dd646b002a"), 'error');
                    user.removeMoney(sum, true, user.LangString("houses.f58727a34d4de482ccb1e93ea24bf6af", item.id));
                    item.addMoneyChest(sum, player, langStringDefault("houses.735205d104d550e1a60c17cfbb96f7fe"))
                })
            }
        })
        m.newItem({
            name: langStringDefault("houses.71b070ada84bc76d9b54e362e01079b6"),
            onpress: () => {
                Logs.open(player, `housemoney_${item.id}`, player.user.LangString("houses.309df444db776db3a219587998022b64"))
            }
        })
        if((user.grab_money_shop || user.grab_money) && item.forFamily){
            let amount = user.grab_money ? user.grab_money : user.grab_money_shop;
            m.newItem({
                name: langStringDefault("houses.22fea867e091a3226a859200ed0f47f1"),
                more: `$${system.numberFormat(amount)}`,
                onpress: () => {
                    amount = user.grab_money ? user.grab_money : user.grab_money_shop;
                    if (!amount) return;
                    m.close();
                    item.addMoneyChest(amount, player, langStringDefault("houses.aa9a54d70376864cc552726ba922c2f1"))
                    user.grab_money_shop = 0;
                    user.grab_money = 0;
                    player.notify(player.user.LangString("houses.31e712324dc1b99da42f84d5fba71636"), "success");
                }
            })
        }
        m.open()
    },
    createNewHouseMenu: async (player:PlayerMp, item?: HouseEntity) => {
        if(!item){
            item = new HouseEntity();
            item.name = await CustomEvent.callClient(player, "currentStreet")
            item.price = 0;
        }
        const m = menu.new(player, player.user.LangString("houses.b0cc368c5ccf14b9cb282a3fb9b570c6"))

        if(!item.forTp){
            m.newItem({
                name: langStringDefault("houses.634adbb38bf23544c36c7a7bd1801e64"),
                more: item.name,
                onpress: () => {
                    menu.input(player, player.user.LangString("houses.b455c43dff113d00bc7a16184047837b"), item.name, 100).then(val => {
                        if(val) item.name = val;
                        houses.createNewHouseMenu(player, item);
                    })
                }
            })
        }
        m.newItem({
            name: langStringDefault("houses.df76d9d2dbd0c40f4e01022b782c5f6d"),
            more: `$${system.numberFormat(item.price)}`,
            onpress: () => {
                menu.input(player, player.user.LangString("houses.633ac5e38a8ac7ed8a4620ec55bc0f42"), item.price, 100, "int").then(val => {
                    if (val) item.price = val;
                    houses.createNewHouseMenu(player, item);
                })
            }
        })
        // m.newItem({
        //     type: 'list',
        //     name: "Для семьи",
        //     list: ['Нет', 'Да'],
        //     listSelected: item.forFamily,
        //     onchange: (val) => {
        //         item.forFamily = val
        //     }
        // })

        m.newItem({
            type: 'list',
            name: langStringDefault("houses.0db1652a6e07a1199bf0749b3ea4900c"),
            list: [langStringDefault("houses.e8ea1af5abddba2ec66b4f3b125493f3"), ...HousesTeleportsList.map(q => q.name)],
            listSelected: item.forTp,
            onchange: (val) => {
                let change = !!item.forTp != !!val;
                item.forTp = val;
                if(change) houses.createNewHouseMenu(player, item)
            }
        })
        if(!item.forTp){
            m.newItem({
                name: langStringDefault("houses.f0636408364cdd4f7aa592d2482ff9c0"),
                more: item.air_x ? langStringDefault("houses.ab1a06193f12fce5fcc16f77a5716a63") : langStringDefault("houses.e1a77b2b8ed93e4cba94f11ff1fb9390"),
                onpress: () => {
                    item.air_x = player.position.x;
                    item.air_y = player.position.y;
                    item.air_z = player.position.z - 1;
                    item.air_h = player.heading;
                    item.air_d = player.dimension;
                    player.notify(player.user.LangString("houses.66d54257926a00282bbc75818f9fa7c3"), "success")
                    houses.createNewHouseMenu(player, item);
                }
            })
            m.newItem({
                name: langStringDefault("houses.4ad0f9ebe24028e3cf8ece85e6ac806b"),
                more: item.x ? langStringDefault("houses.6605f727109109950fbfb03a1f744f7a") : langStringDefault("houses.47aa389fa2ac72c0b38eb52d860bbbb8"),
                onpress: () => {
                    item.x = player.position.x;
                    item.y = player.position.y;
                    item.z = player.position.z - 1;
                    item.h = player.heading;
                    item.d = player.dimension;
                    player.notify(player.user.LangString("houses.c36ff5e4063cf8bb1a0c229578fa3fef"), "success")
                    houses.createNewHouseMenu(player, item);
                }
            })
        } else {
            item.name = HousesTeleportsList[item.forTp - 1].name;
            if(!item.x){
                const pos = houses.getFreePosInMultihouse(item.forTp)
                if(pos){
                    item.x = pos.x;
                    item.y = pos.y;
                    item.z = pos.z;
                    item.h = pos.h;
                    item.d = pos.d;
                } else {
                    player.notify(player.user.LangString("houses.4cc2f262f6e946ce396390f733daa712"), 'error');
                }
            }
            m.newItem({
                name: langStringDefault("houses.c67ea26c2e6bf31cedf79d91be745abe"),
                more: item.x ? langStringDefault("houses.7548656da4e11cc954f470fe4cd77007") : langStringDefault("houses.6d6c23607a12e56c43e9273f7fa1c9e5"),
                onpress: () => {
                    player.notify(player.user.LangString("houses.8221d85068f785b634f9cc49de954c3b"))
                }
            })
        }

        m.newItem({
            type: 'list',
            name: langStringDefault("houses.aa600bc5944c5a223dc79126ca0ce28a"),
            list: [langStringDefault("houses.b34ea108f2e06dfb404e3183728de10d"), langStringDefault("houses.c01918319a805297c9f2b0c645debe6c")],
            listSelected: item.haveChest,
            onchange: (val) => {
                item.haveChest = val;
            }
        })

        m.newItem({
            type: 'list',
            name: langStringDefault("houses.5ffe9de3ab1ffd457dd73ec13d0e2c0f"),
            list: [langStringDefault("houses.e58c6ec178c19db92ff145570af8bdc4"), langStringDefault("houses.5d8e908691e760087066f2650a48aa5f")],
            listSelected: item.haveMoneyChest,
            onchange: (val) => {
                item.haveMoneyChest = val;
            }
        })


        if (item.x){
            m.newItem({
                name: langStringDefault("houses.8e2453d695a2f9662c8329cd2d825ff3"),
                more: item.interrior ? getInteriorHouseById(item.interrior).name : langStringDefault("houses.735e31924f08387d5e67ad25d097155c"),
                onpress: () => {
                    let submenu = menu.new(player, player.user.LangString("houses.2d6df2f36c96baf0c82e38283b6327a5"), "")
                    interriors.filter(q => q.type === "house").map(int => {
                        submenu.newItem({
                            name: int.name,
                            onpress: () => {
                                item.interrior = int.id;
                                houses.createNewHouseMenu(player, item);
                            }
                        })
                    })
                    submenu.open();
                }
            })
        }
        if(!item.forTp){
            m.newItem({
                name: langStringDefault("houses.1201f667350373952b60fc7f36f30081"),
                more: item.car_x ? langStringDefault("houses.b5acb2eb7ff1983e6511b8158e03c6a2") : langStringDefault("houses.ec73e6b52a36d5b7f155b287f6e3fe3b"),
                onpress: () => {
                    if(item.car_x){
                        item.car_x = 0;
                        item.car_y = 0;
                        item.car_z = 0;
                        item.car_h = 0;
                        player.notify(player.user.LangString("houses.4a149dac238b2ad4441fdaada6048544"), "success")
                    } else {
                        item.car_x = player.position.x;
                        item.car_y = player.position.y;
                        item.car_z = player.position.z - 1;
                        item.car_h = player.heading;
                        item.car_d = player.dimension;
                        player.notify(player.user.LangString("houses.00585519888a58aa14aa1272051fa76f"), "success")
                    }
                    houses.createNewHouseMenu(player, item);
                }
            })
        }
        if (item.car_x || item.forTp) {
            m.newItem({
                name: langStringDefault("houses.74732d37e96c3f69614acc270fecb6ff"),
                more: item.car_interrior ? getInteriorGarageById(item.car_interrior).name : langStringDefault("houses.4d773cb9cf3e27578e38d869e2b25d9f", item.forTp ? langStringDefault("houses.5ae30da9236555469fb0e13128afcb07") : langStringDefault("houses.9658a43014264d3bf85151c68bb27117")),
                onpress: () => {
                    let submenu = menu.new(player, player.user.LangString("houses.c557577789c6eef9b99819bfc2a8d717"), "")
                    getInteriorsGarage().map(int => {
                        submenu.newItem({
                            name: langStringDefault("houses.5c9d0490e7e854a661ec1d0d251b7c0b", int.name, int.cars.length),
                            onpress: () => {
                                item.car_interrior = int.id;
                                houses.createNewHouseMenu(player, item);
                            }
                        })
                    })
                    submenu.open();
                }
            })
        }
        m.newItem({
            name: langStringDefault("houses.8db17cf04ea70f6972ff07bbd5a99694"),
            onpress: async () => {
                if (!item.name) return player.notify(player.user.LangString("houses.37946f7fa2d4f2b897f5ed118bb8d027"), "error");
                if (!item.price) return player.notify(player.user.LangString("houses.bdcec26911e192ac29d6f49e8a9cd2e4"), "error");
                if (!item.x) return player.notify(player.user.LangString("houses.fdb0cf50a373fc7368a0225a6088f976"), "error");
                if (!item.interrior) return player.notify(player.user.LangString("houses.af3a6cd6c1780e4fe9b1eda94dcbfe25"), "error");
                if (!item.forTp && item.car_x && !item.car_interrior) return player.notify(player.user.LangString("houses.1aea62924cc2439de9d8aadbfb3b8394"), "error");
                if(!item.haveChest && item.haveMoneyChest) return player.notify(player.user.LangString("houses.0527634e35a81bffc2a9f41454f0d5b7"), "error");
                let count = 1;
                if(item.forTp){
                    count = await menu.input(player, player.user.LangString("houses.3f0a8c49b271dc5c9149878968007692"), 1, 2, 'int');
                    if(!count || count < 0 || count > 99) return;
                }
                m.close();
                let herr = false
                for(let q = 0; q < count; q++){
                    let err = false
                    if(item.forTp){
                        item.name = HousesTeleportsList[item.forTp - 1].name;
                        const pos = houses.getFreePosInMultihouse(item.forTp)
                        if(pos){
                            item.x = pos.x;
                            item.y = pos.y;
                            item.z = pos.z;
                            item.h = pos.h;
                            item.d = pos.d;
                        } else {
                            herr = true;
                            err = true
                        }
                    }
                    if(!err){
                        item.id = null;
                        item.key = system.getRandomInt(10000000, 90000000);
                        const z = await item.save()
                        if(z) houses.loadItem(z);
                        else {
                            herr = true
                        }
                    }
                }
                writeSpecialLog(langStringDefault("houses.d69d1f8d121f6845739ce48451779e8d", item.x, item.y, item.z), player, 0);
                if(herr) player.notify(player.user.LangString("houses.614bd627eb0027b2f56df61b46cdb9be"), 'error')
                else player.notify(player.user.LangString("houses.67616b8451898df3f0a99df9f83c0e00"), 'success')
            }
        })

        m.open();
    }
}

export function openHouseEditAdminMenu(player: PlayerMp, house: HouseEntity) {
    const m = menu.new(player, player.user.LangString("houses.601c37c7b506c5c31659d0b52ed6e980", house.id));

    m.newItem({
        name: langStringDefault("houses.bce65189fb34671ba6d650c90ea47cde"),
        onpress: () => {
            player.user.teleport(house.x, house.y, house.z, house.h, house.d);
        }
    });

    m.newItem({
        name: langStringDefault("houses.b1434411d42e05ad21e3bafd38e9e641"),
        more: langStringDefault("houses.0cdcba8916e25fb7cfaefb99235cab7d"),
        onpress: () => {
            house.x = player.position.x;
            house.y = player.position.y;
            house.z = player.position.z - 1;
            house.h = player.heading;

            house.save();

            houses.clearHouseEntities(house);
            houses.loadItem(house);

            player.notify(player.user.LangString("houses.ed97488fb238bad9c056ee3b801af830"), 'success');
        }
    });

    m.newItem({
        name: langStringDefault("houses.ceac062c7f1ff0e11efa51e0f28bdbbe"),
        more: langStringDefault("houses.d939f2fd870b1914877e4554aee235ad"),
        onpress: () => {
            house.car_x = player.position.x;
            house.car_y = player.position.y;
            house.car_z = player.position.z - 1;
            house.car_h = player.heading;

            house.save();

            houses.clearHouseEntities(house);
            houses.loadItem(house);

            player.notify(player.user.LangString("houses.67f7e316c4daca431dd40c070c97c3ed"), 'success');
        }
    });

    m.open();
}

gui.chat.registerCommand('openhouseedit', (player, houseIdStr) => {
    if (!player.user.hasPermission('admin:houses:editmarks')) {
        return;
    }

    const houseId = parseInt(houseIdStr);
    const house = houses.get(houseId);

    if (!house) {
        return player.notify(player.user.LangString("houses.56f3ee393ff2203606e0101b38bb5b13"), 'error');
    }

    openHouseEditAdminMenu(player, house);
});

mp.events.add("_userLoggedIn", (user: User) => {
    houses.loadAllBlips(user.player);
})