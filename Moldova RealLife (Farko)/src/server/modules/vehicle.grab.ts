import {npcGrabCarSetting, npcVehicleJack, VEHICLE_GRAB_COOLDOWN_MINUTES} from "../../shared/vehicles";
import {system} from "./system";
import {colshapes} from "./checkpoints";
import {getVehicleConfig, Vehicle} from "./vehicles";
import {menu} from "./menu";
import {quests} from "./quest";
import {NpcSpawn} from "./npc";
import {CustomEvent} from "./custom.event";
import { getBaseItemNameById, inventoryShared, DIRTY_MONEY_ITEM_ID } from "../../shared/inventory";
import {LEVEL_PERMISSIONS} from "../../shared/level.permissions";

import {Family} from "./families/family";
import {FamilyReputationType} from "../../shared/family";
import {MoneyChestClass} from "./money.chest";

/** Liste der derzeit bestellten TCs */
export let activeCars: {model: string, number: string, pos: Vector3Mp, veh: VehicleMp}[] = [];

const getModelCost = (model: string) => {
    let data = npcVehicleJack.find(q => q[0] === model);
    if(!data) return 0
    return data[1]
}

setTimeout(() => {
    setInterval(() => {
        activeCars.map((item, itemid) => {
            if (!mp.vehicles.exists(item.veh) || item.veh.deleted) return activeCars.splice(itemid, 1);
        });
        if (activeCars.length === 20) return;
        let npcCars = Vehicle.toArray().filter(q => q.npc && !q.usedAfterRespawn && q.dimension === 0);
        const grabModels = [...npcVehicleJack].map(q => q[0])
        npcCars = npcCars.filter(q => grabModels.includes(q.modelname));
        if (npcCars.length === 0) return;
        let randCar = system.randomArrayElement(npcCars);
        const model = randCar.modelname;
        const number = randCar.numberPlate;
        const pos = new mp.Vector3(system.getRandomInt(randCar.position.x - npcGrabCarSetting.vehPosOffset, randCar.position.x + npcGrabCarSetting.vehPosOffset), system.getRandomInt(randCar.position.y - npcGrabCarSetting.vehPosOffset, randCar.position.y + npcGrabCarSetting.vehPosOffset), system.getRandomInt(randCar.position.z - npcGrabCarSetting.vehPosOffset, randCar.position.z + npcGrabCarSetting.vehPosOffset));
        activeCars.push({ model, number, pos, veh: randCar});
    }, 1000)
}, mp.config.announce ? 120000 : 10000)

new NpcSpawn(new mp.Vector3(npcGrabCarSetting.npcPos.x, npcGrabCarSetting.npcPos.y, npcGrabCarSetting.npcPos.z), npcGrabCarSetting.npcHeading, npcGrabCarSetting.npcModel, "Lamar", (player) => {
    handle(player)
});

let blockReward = new Map<number, boolean>();

const handle = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    // // ✅ Verificare playtime minim
    // if (user.playtime < LEVEL_PERMISSIONS.JAFVEHICLE) {
    //     return player.notifyWithPicture(
    //         "Lamar",
    //         "Lamar",
    //         `Ai nevoie de cel putin ${LEVEL_PERMISSIONS.JAFVEHICLE} ore jucate pentru a face acest job.`,
    //         "DIA_LAMAR"
    //     );
    // }
    const vehicle = player.vehicle;
    if (vehicle) {
        if (blockReward.has(user.id)) return player.notifyWithPicture(player.user.LangString("vehicle.grab.blockreward.title"), "Lamar", player.user.LangString("vehicle.grab.blockreward.reason"), "DIA_LAMAR");
        const model = vehicle.modelname;
        if (!user.isDriver) return player.notifyWithPicture(player.user.LangString("vehicle.grab.blockreward.title"), "Lamar", player.user.LangString("vehicle.grab.driver"), "DIA_LAMAR");
        if (!vehicle.npc || !activeCars.find(q => q.model === model && q.number === vehicle.numberPlate)) {
            return player.notifyWithPicture(player.user.LangString("vehicle.grab.blockreward.title"), "Lamar", system.randomArrayElement(npcGrabCarSetting.incorrectCarText), "DIA_LAMAR");
        }
        system.debug.debug("Der TC für Lamar wurde eingereicht", model, vehicle.numberPlate)
        Vehicle.destroy(vehicle);
        const sum = getModelCost(model);
        user.quests.map(quest => {
            if (quest[2]) return;
            const qcfg = quests.getQuest(quest[0]);
            if (!qcfg) return;
            qcfg.tasks.map((task, taskindex) => {
                if (task.type === "lamar") {
                    user.setQuestTaskComplete(quest[0], taskindex);
                }
            })
        })
        if (sum) {
            const give = sum;
            const success = user.tryGiveItem(DIRTY_MONEY_ITEM_ID, true, true, give);
        
            if (success) {
                player.notifyWithPicture(
                    player.user.LangString("vehicle.grab.blockreward.title"),
                    "Lamar",
                    `Ai primit ${system.numberFormat(give)}$ bani murdari pentru livrarea modelului ${model}.`,
                    "DIA_LAMAR"
                );
            } else {
                player.notifyWithPicture(
                    player.user.LangString("vehicle.grab.blockreward.title"),
                    "Lamar",
                    "Inventarul tau este plin. Nu ai primit banii murdari.",
                    "DIA_LAMAR"
                );
            }
        }        
        // if (sum) {
        //     if (user.fraction) {
        //         const safe = MoneyChestClass.getByFraction(user.fraction);
        //         if (safe) safe.money = safe.money + Math.floor(sum * 0.2);
        //     }
        //     user.addMoney(sum, false, player.user.LangString("vehicle.grab.add", model));
        //     player.notifyWithPicture(player.user.LangString("vehicle.grab.blockreward.title"), "Lamar", player.user.LangString("vehicle.grab.sumnot", sum)
        //     , "DIA_LAMAR");
        // }
        player.user.achiev.achievTickByType("vehJackLamar")
        CustomEvent.triggerClient(player, "vehicleGrab:deleteBlip")
        blockReward.set(user.id, true);
        const ids = user.id;
        setTimeout(() => {
            blockReward.delete(ids);
        }, VEHICLE_GRAB_COOLDOWN_MINUTES * 60000);
        return;
    }
    if (activeCars.length === 0) return player.notifyWithPicture(player.user.LangString("vehicle.grab.blockreward.title"), "Lamar", player.user.LangString("vehicle.grab.notactivecars"), "DIA_LAMAR");
    let canWork = false;
    user.quests.map(quest => {
        if (quest[2]) return;
        const qcfg = quests.getQuest(quest[0]);
        if (!qcfg) return;
        qcfg.tasks.map((task, taskindex) => {
            if (task.type === "lamar") canWork = true;
        })
    })
    // if (!canWork) canWork = player.user.fractionData.gang
    if (!canWork) canWork = true;
    // 🔴 Verificare polițiști online (minim 3)
    const onlinePoliceCount = mp.players.toArray().filter(u => u.user?.fractionData?.police).length;
    if (onlinePoliceCount < 2) {
        player.notify("Nu poti incepe jaful. Sunt necesari minim 2 politisti online.", "error");
        return; // oprește execuția jafului
    }

    if (canWork) {
        const m = menu.new(player, "Lamar", player.user.LangString("vehicle.grab.menu.subtitle"));
        m.newItem({
            name: player.user.LangString("vehicle.grab.menu.1"),
            desc: player.user.LangString("vehicle.grab.menu.1.desc")
        })
        activeCars.map((item, itemid) => {
            if (!mp.vehicles.exists(item.veh) || item.veh.deleted) return activeCars.splice(itemid, 1);
            if(item.veh.usedAfterRespawn) return;
            const cfg = getVehicleConfig(item.model)
            const name = cfg ? cfg.name : item.model;

            m.newItem({
                name,
                desc: `${item.veh && item.veh.usedAfterRespawn ? player.user.LangString("vehicle.grab.menu.usedReason") : ""}`,
                more: `${system.numberFormat(getModelCost(item.model))}$ | Bani murdari`,
                onpress: () => {
                    player.notifyWithPicture(
                        player.user.LangString("vehicle.grab.blockreward.title"),
                        "Lamar",
                        player.user.LangString("vehicle.grab.menu.notify", name, item.number),
                        "DIA_LAMAR"
                    );
                    player.outputChatBox(
                        player.user.LangString("vehicle.grab.menu.chat", name, item.number)
                    )
                    CustomEvent.triggerClient(player, "vehicleGrab:setBlipPos", item.pos.x, item.pos.y, item.pos.z);
                }
            })
        })
        m.open();
    } else {
        return player.notifyWithPicture(
            player.user.LangString("vehicle.grab.blockreward.title"),
            "Lamar",
            player.user.LangString("vehicle.grab.menu.cantwork"),
            "DIA_LAMAR"
        );
    }
}
 
//     if (canWork) {
//         const m = menu.new(player, "Lamar", player.user.LangString("vehicle.grab.menu.subtitle"));
//         m.newItem({
//             name: player.user.LangString("vehicle.grab.menu.1"),
//             desc: player.user.LangString("vehicle.grab.menu.1.desc")
//         })
//         activeCars.map((item, itemid) => {
//             if (!mp.vehicles.exists(item.veh) || item.veh.deleted) return activeCars.splice(itemid, 1);
//             if(item.veh.usedAfterRespawn) return;
//             const cfg = getVehicleConfig(item.model)
//             const name = cfg ? cfg.name : item.model;

//             m.newItem({
//                 name,
//                 desc: `${item.veh && item.veh.usedAfterRespawn ? player.user.LangString("vehicle.grab.menu.usedReason") : ""}`,
//                 // more: `$${system.numberFormat(getModelCost(item.model))}`,
//                 more: `${system.numberFormat(getModelCost(item.model))}$ | Bani murdari`,
//                 onpress: () => {
//                     player.notifyWithPicture(player.user.LangString("vehicle.grab.blockreward.title"), "Lamar", player.user.LangString("vehicle.grab.menu.notify", name, item.number)
//                     , "DIA_LAMAR");
//                     player.outputChatBox(player.user.LangString("vehicle.grab.menu.chat", name, item.number)
//                     )
//                     CustomEvent.triggerClient(player, "vehicleGrab:setBlipPos", item.pos.x, item.pos.y, item.pos.z);
//                     //user.setWaypoint(item.pos.x, item.pos.y, item.pos.z, `Доставка для Ламара ${name} ${item.number} за $${system.numberFormat(getModelCost(item.model))}`);
//                 }
//             })
//         })
//         m.open();
//     }
//     else return player.notifyWithPicture(player.user.LangString("vehicle.grab.blockreward.title"), "Lamar", player.user.LangString("vehicle.grab.menu.cantwork"), "DIA_LAMAR");
// }

colshapes.new(new mp.Vector3(npcGrabCarSetting.vehiclePos.x, npcGrabCarSetting.vehiclePos.y, npcGrabCarSetting.vehiclePos.z), "Lamar", player => {
    handle(player)
}, {
    radius: 4,
    dimension: 0,
    type: 27
})
