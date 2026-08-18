import {
    DRUG_ITEM,
    DRUG_NPC_TASK,
    DRUG_POS_LIST,
    DRUGS_ITEMS,
    DRUG_TASK_COUNT, DRUG_TASK_FRACTION_MONEY_PERCENT,
    DRUG_TASK_REWARD, FRACTION_LIST_TASKS_NPC, NPCTaskItemVehicle, VEHICLE_EVACUATION_NPC
} from "../../shared/tasks";
import {system} from "./system";
import {colshapeHandle, colshapes} from "./checkpoints";
import {NpcSpawn} from "./npc";
import {menu} from "./menu";
import {inventory} from "./inventory";
import {CustomEvent} from "./custom.event";
import {Vehicle} from "./vehicles";
import {HousesTeleportsList} from "../../shared/houses";
import {houses} from "./houses";
import {MoneyChestClass} from "./money.chest";
import { langStringDefault } from "../../shared/lang";



export let vehTaskData = new Map<number, {count: number, reward: number, returnNeed?: Vector3Mp, cooldown: number, points: NPCTaskItemVehicle['positions'], npc: number, task: number}>();

export let getGpsMissionVehs = (player: PlayerMp) => {

    const user = player.user;
    if(!user) return;
    if(!vehTaskData.has(user.id)) return;
    const points = Vehicle.toArray().filter(veh => veh.isMission && veh.missionType == 'fractionVehicleDeliver' && veh.missionOwner == user.id).map(veh => veh.position);
    if(points.length === 0) return;
    user.setWaypointBlips(points.map(q => {
        return {
            x: q.x,
            y: q.y,
            name: langStringDefault("task.getGpsMissionVehs.waypointname"),
            shortRange: false,
            type: 225,
            color: 59,
            distDestroy: 15
        }
    }))
}

mp.events.add("playerEnterVehicle", (player:PlayerMp, vehicle) => {
    const user = player.user;
    if (!player.user) return;
    if(!vehicle.isMission) return;
    if(vehicle.missionOwner !== user.id) return player.notify(player.user.LangString("task.enterVeh.mission"), 'error');
    if(vehicle.missionType == 'fractionVehicleDeliver'){
        const data = vehTaskData.get(user.id);
        if(!data || !data.count) {
            user.leaveVehicle()
            return player.notify(player.user.LangString("task.enterVeh.mission"), 'error');
        }
        const cfg = FRACTION_LIST_TASKS_NPC[data.npc].tasks[data.task];
        if(!cfg) return player.notify(player.user.LangString("task.enterVeh.cfg"), 'error');
        if(cfg.returnPoint){
            user.setWaypoint(cfg.returnPoint.x, cfg.returnPoint.y, cfg.returnPoint.z);
            player.notify(player.user.LangString("task.enterVeh.cfgReturn"), 'info')
        } else {
            player.notify(player.user.LangString("task.enterVeh.cfgReturn2"), 'error')
        }
    }
});

FRACTION_LIST_TASKS_NPC.map((npc, npcid) => {
    npc.tasks.map((task, taskid) => {
       if(task.type === "vehicle" && task.returnPoint){
           colshapes.new(new mp.Vector3(task.returnPoint.x, task.returnPoint.y, task.returnPoint.z), task.returnPoint.name, player => {
               const user = player.user;
               if(!user) return;
               if(!vehTaskData.has(user.id)) return player.notify(player.user.LangString("task.npcTask.vehTaskData"), 'error');
               const veh = player.vehicle;
               if(!veh) return player.notify(player.user.LangString("task.npcTask.noveh", 'error'));
               if(!user.isDriver) return player.notify(player.user.LangString("task.npcTask.driver"), 'error');
               if(veh.missionType != 'fractionVehicleDeliver') return player.notify(player.user.LangString("task.npcTask.mission"), 'error');
               if(veh.missionOwner != user.id) return player.notify(player.user.LangString("task.npcTask.mission2"), 'error');
               let data = vehTaskData.get(user.id);
               if(data.count <= 0) return player.notify(player.user.LangString("task.npcTask.count"), 'error');
               if(data.npc !== npcid) return player.notify(player.user.LangString("task.npcTask.npc"), 'error');
               if(data.task !== taskid) return player.notify(player.user.LangString("task.npcTask.task"), 'error');
               data.count--;
               Vehicle.destroy(veh);
               if(data.count > 0){
                   vehTaskData.set(user.id, data);
               } else {
                   FRACTION_LIST_TASKS_NPC[data.npc].tasks[data.task].positions.push(...data.points)
                   if(data.returnNeed) {
                       user.setWaypoint(data.returnNeed.x, data.returnNeed.y, data.returnNeed.z, user.LangString("task.npcTask.return"));
                       return player.notify(player.user.LangString("task.npcTask.return.notify"));
                   } else {
                       user.addMoney(data.reward, true, user.LangString("task.npcTask.addMoney"));
                       vehTaskData.set(user.id, data);
                       const ids = user.id;

                       setTimeout(() => {
                           vehTaskData.delete(user.id);
                       }, data.cooldown * 60000)
                   }
               }
           }, {
               type: task.returnPoint.type,
               radius: task.returnPoint.r,
               drawStaticName: "scaleform"
           })
       }
    });
    new NpcSpawn(npc.pos, npc.heading, npc.model, npc.name, player => {
        const user = player.user;
        if(!user) return;
        if(npc.fraction && !npc.fraction.includes(user.fraction)) return player.notify(player.user.LangString("task.npcTask.npc.faction"), 'error');
        if(npc.rank && user.rank < npc.rank) return player.notify(player.user.LangString("task.npcTask.npc.rank", npc.rank), 'error');

        const m = menu.new(player, npc.name);

        let data = vehTaskData.get(user.id);
        npc.tasks.map((task, taskid) => {
            if(data && data.count === 0 && data.npc === npcid && data.task === taskid){
                m.newItem({
                    name: task.name,
                    more: player.user.LangString("task.npcTask.npc.menu.item1.more"),
                    onpress: () => {
                        m.close()
                        let data = vehTaskData.get(user.id);
                        if(data && data.count === 0 && data.npc === npcid && data.task === taskid){
                            data.count = -1
                            user.addMoney(data.reward, true, user.LangString("task.npcTask.npc.menu.item1.addMoney"));
                            vehTaskData.set(user.id, data);
                            const ids = user.id;

                            setTimeout(() => {
                                vehTaskData.delete(user.id);
                            }, data.cooldown * 60000)
                        } else {
                            player.notify(player.user.LangString("task.npcTask.npc.menu.item1.err"), 'error');
                        }
                    }
                })
            } else {
                m.newItem({
                    name: task.name,
                    desc: task.desc,
                    more: `$${system.numberFormat(task.reward)}`,
                    onpress: () => {
                        if(task.positions.length < task.count) return player.notify(player.user.LangString("task.npcTask.npc.menu.item2.notify"), 'error');
                        if(vehTaskData.has(user.id)) return player.notify(player.user.LangString("task.npcTask.npc.menu.item2.task"), 'error');
                        let points: typeof task.positions = [];
                        for(let z = 0; z < task.count; z++){
                            const i = system.randomArrayElementIndex(task.positions);
                            points.push(task.positions[i])
                            task.positions.splice(i, 1);
                        }

                        points.map(pos => {
                            const veh = Vehicle.spawn(system.randomArrayElement(task.models), new mp.Vector3(pos.x, pos.y, pos.z), pos.h, 0, false, true);
                            veh.isMission = true;
                            veh.missionType = 'fractionVehicleDeliver';
                            veh.missionOwner = user.id;
                            veh.deliverPos = task.returnPoint
                        })



                        player.notify(player.user.LangString("task.npcTask.npc.menu.item2.notify2"), 'error');
                        vehTaskData.set(user.id, {count: task.count, reward: task.reward, returnNeed: task.returnToNpc ? npc.pos : null, cooldown: task.cooldown, points, npc: npcid, task: taskid});
                        getGpsMissionVehs(player)
                    }
                })
            }

        })

        m.open();

    })
})




//
//
//
//
// class Task {
//     owner: PlayerMp;
//     config: typeof FRACTION_LIST_TASKS_NPC[number]['tasks'][number];
//     constructor(owner: PlayerMp, config: typeof FRACTION_LIST_TASKS_NPC[number]['tasks'][number]){
//         this.owner = owner;
//         this.config = config;
//
//     }
// }

let missionIds = 0;
let drugTaskPoints: Vector3Mp[] = [...DRUG_POS_LIST];

const getDrugPoint = () => {
    const index = system.randomArrayElementIndex(drugTaskPoints);
    const req = [...drugTaskPoints][index];
    drugTaskPoints.splice(index, 1);
    return req;
};

let npcTaskList = new Map<number, colshapeHandle[]>();

mp.events.add('playerQuit', player => {
    const user = player.user;
    if (!user) return;
    if (npcTaskList.has(user.id)) npcTaskList.delete(user.id);
});

const DIRTY_MONEY_ITEM_ID = 40157; // Itemul de bani murdari

DRUG_NPC_TASK.map(npc => {
    new NpcSpawn(npc.pos, npc.heading, npc.model, npc.name, player => {
        const user = player.user;
        if (!user) return;
        if (npc.fraction && !npc.fraction.includes(user.fraction)) return;
        if (npc.rank && user.rank < npc.rank) return;

        const m = menu.new(player, npc.name);

        // Alegere drog
        DRUGS_ITEMS.forEach(drug => {
            m.newItem({
                name: `Vinde ${drug.name}`,
                onpress: () => {
                    if (npcTaskList.has(user.id)) return player.notify(user.LangString("task.npcTask.drug.npc.menu.item1.has"), 'error');
                    const drugsInInventoryCount = inventory.getItemsCountById(player, drug.item_id);
                    if (drugsInInventoryCount < DRUG_TASK_COUNT) return player.notify(player.user.LangString("task.npcTask.drug.npc.menu.item1.hasCnt", DRUG_TASK_COUNT, drug.name, npc.errorCountString ? `. ${npc.errorCountString}` : ''), 'error');
                    if (drugTaskPoints.length < DRUG_TASK_COUNT) return player.notify(player.user.LangString("task.npcTask.drug.npc.menu.item1.limit"), 'error');

                    const uid = user.id;
                    let shapes: colshapeHandle[] = [];
                    let count = parseInt(`${DRUG_TASK_COUNT}`);
                    let posList: [number, number, number, number][] = [];

                    const sendPos = (target: PlayerMp) => {
                        CustomEvent.triggerClient(target, 'task:getDrugPoints', posList);
                    };

                    for (let q = 0; q < DRUG_TASK_COUNT; q++) {
                        const point = getDrugPoint();
                        posList.push([q, point.x, point.y, point.z]);

                        const shape = colshapes.new(point, player => player.user.LangString("task.npcTask.drug.npc.menu.item1.shape"), target => {
                            const utarget = target.user;
                            if (!utarget) return;
                            if (utarget.id !== uid) return target.notify(target.user.LangString("task.npcTask.drug.npc.menu.item1.shape.uid"), 'error');

                            const myItem = utarget.allMyItems.find(q => q.item_id === drug.item_id && q.count >= 1);
                            if (!myItem) return target.notify(target.user.LangString("task.npcTask.drug.npc.menu.item1.shape.myItem", drug.name), 'error');

                            inventory.deleteItemsById(target, drug.item_id, 1);

                            utarget.playAnimation([["random@domestic", "pickup_low"]], true);
                            drugTaskPoints.push(point);
                            count--;
                            posList.splice(posList.findIndex(s => s[0] === q), 1);
                            sendPos(target);
                            shape.destroy();

                            // 🎯 Primeste bani murdari în functie de reward-ul drogului
                            // Dupa ce livreaza drogul
                            target.user.tryGiveItem(DIRTY_MONEY_ITEM_ID, true, true, drug.reward);


                            const fractionMoneySafe = MoneyChestClass.getByFraction(user.fraction);
                            fractionMoneySafe.money += drug.reward * DRUG_TASK_FRACTION_MONEY_PERCENT / 100;

                            if (count) target.notify(target.user.LangString("task.npcTask.drug.npc.menu.item1.shape.count", count));
                            else {
                                target.notify(target.user.LangString("task.npcTask.drug.npc.menu.item1.shape.allDone"), 'success');
                                npcTaskList.delete(user.id);
                            }
                        }, {
                            type: 27,
                            drawStaticName: "scaleform",
                            predicate: colshapePredicatePlayer => colshapePredicatePlayer === player
                        });

                        shapes.push(shape);
                    }

                    player.notify(player.user.LangString("task.npcTask.drug.npc.menu.item1.jobTaken"), 'error');
                    sendPos(player);
                    npcTaskList.set(user.id, shapes);
                }
            });
        });

        m.open();
    });
});


// VEHICLE_EVACUATION_NPC.map(npc => {
//     new NpcSpawn(npc.pos, npc.heading, npc.model, npc.name, player => {
//         const user = player.user;
//         if(!user) return;
//         if(npc.fraction && !npc.fraction.includes(user.fraction)) return;
//         if(npc.rank && user.rank < npc.rank) return;

//         const m = menu.new(player, npc.name);

//         m.newItem({
//             name: 'Взять задание',
//             onpress: () => {

//             }
//         })


//         m.open()
//     })
// })
