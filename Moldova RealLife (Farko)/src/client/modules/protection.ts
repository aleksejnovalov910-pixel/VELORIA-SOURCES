import { LangString, langStringDefault } from "./lang";
import {AntiCheatUserData, weapon_hashes} from "../../shared/anticheat";
import {clearAllWeapons, myWeapons, myWeaponsHash, myWeaponsHashStr, nowPutIntoVehicle, user} from "./user";
import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {blockShootSaveZoneStatus} from "./savezone";

const player = mp.players.local

let vehicles: VehicleMp[];
let players: PlayerMp[];

setInterval(() => {
    vehicles = mp.vehicles.toArray().filter(veh => veh.handle && veh.getSpeed() > 3);
    players = mp.players.toArray().filter(q => q.handle && q != player && !q.vehicle)
    players.map(player => player.setSuffersCriticalHits(false))
    player.setSuffersCriticalHits(false)
}, 300)


// mp.events.add("render", () => {
//     if(player.dimension) return;
//     vehicles?.map(veh => {
//         if(!mp.vehicles.exists(veh) || !veh.handle) return;
//         mp.game.invoke("0xA53ED5520C07654A", player.handle, veh.handle, true)
//         mp.game.invoke("0xA53ED5520C07654A", veh.handle, player.handle, true)
//     })
//     players?.map(player => {
//         if(!mp.players.exists(player) || !player.handle) return;
//         vehicles.map(veh => {
//             if(!mp.vehicles.exists(veh) || !veh.handle) return;
//             mp.game.invoke("0xA53ED5520C07654A", player.handle, veh.handle, true)
//             mp.game.invoke("0xA53ED5520C07654A", veh.handle, player.handle, true)
//         })
//     });
// })

let anticheatProtectList: AntiCheatUserData = {}

let lastTeleportPos: Vector3Mp;

let lastPosition: Vector3Mp;

let lastTeleportTime = 0;



mp.events.add("teleport", (x: number, y: number, z: number) => {
    teleportAnticheat(x,y,z)
})

mp.events.add("teleportVisible", (h?: number, pos?: [number, number, number]) => {
    if(!pos) return;
    teleportAnticheat(...pos)
})

export const teleportAnticheat = (x: number, y: number, z: number) => {
    lastTeleportTime = system.timestamp;
    lastTeleportPos = new mp.Vector3(x,y,z);
    const q = {...lastTeleportPos}
    setTimeout(() => {
        if(!lastTeleportPos) return;
        if(lastTeleportPos.x !== q.x || lastTeleportPos.y !== q.y) return;
        lastTeleportPos = null;
    }, system.TELEPORT_TIME + 1000)
}

// let lastVehiclesPos = new Map<number, Vector3Mp>()
//
// setInterval(() => {
//     if(!user.login) return;
//     if(sendAnticheat) return;
//     mp.vehicles.forEachInStreamRange(vehicle => {
//         if(!vehicle.handle) return;
//         if(player.vehicle === vehicle) return;
//         const max = vehicle.getMaxNumberOfPassengers();
//         let free = true;
//         for(let seat = -1; seat < max; seat++){
//             if(free && !vehicle.isSeatFree(seat)) free = false;
//         }
//         if(!free) return;
//         const id = vehicle.remoteId;
//         const position = vehicle.position;
//
//         if(lastVehiclesPos.has(id) && system.distanceToPos(lastVehiclesPos.get(id), position) > 50){
//             if(!sendAnticheat){
//                 CustomEvent.triggerServer('anticheat:vehicletp', id)
//                 sendAnticheat = true;
//                 setTimeout(() => {
//                     sendAnticheat = false;
//                 }, 1000)
//             }
//         }
//
//
//         lastVehiclesPos.set(id, position)
//     })
// }, 500)


let lastVehicle: VehicleMp;
// @ts-ignore
setInterval(() => {
    const veh = player.vehicle
    if(veh == lastVehicle) return;
    if(!veh && lastVehicle) return lastVehicle = null;
    if(!lastVehicle && veh){
        lastVehicle = veh;
        const locked = veh.getVariable("locked")
        if(locked){
            if(!nowPutIntoVehicle){
                if(veh.lastLockedTime && system.timestamp - veh.lastLockedTime < 2) return;
                user.cheatDetect("entervehicle", LangString("protection.28a56a48b92b98937bfe74113d66ccf1"));
            }
        }
    }
}, 300)

export const anticheatProtect = (key: keyof AntiCheatUserData, time: number = 5000) => {
    if(!anticheatProtectList[key]) anticheatProtectList[key] = 0;
    anticheatProtectList[key]++;
    setTimeout(() => {
        anticheatProtectList[key]--;
    }, time)
}

CustomEvent.registerServer("anticheatProtect", (key: keyof AntiCheatUserData, time: number) => {
    anticheatProtect(key, time);
})

CustomEvent.registerServer("anticheatProtects", (keys: (keyof AntiCheatUserData)[], time: number) => {
    keys.map(key=> {
        if(!anticheatProtectList[key]) anticheatProtectList[key] = 0;
        anticheatProtectList[key]++;
        setTimeout(() => {
            anticheatProtectList[key]--;
        }, time)
    })

    setTimeout(() => {
        keys.map(key=> {
            anticheatProtectList[key]--;
        })
    }, time)
})


setInterval(() => {
    if(!user.login) return;
    let tm = system.timestamp
    setTimeout(() => {
        let tm2 = system.timestamp
        if(tm2 - tm < 4.3) user.cheatDetect("memory", LangString("protection.86009597f5982008dd77ea13c228c233"))
    }, 5000)
}, 10000)

let lastHp = 100;
let lastArmour = 100;
setInterval(() => {
    if(!user.login) return;

    const newposition = player.position;

    if(anticheatProtectList.teleport || user.isAdminNow() || !lastPosition || (player.vehicle && player.vehicle.getPedInSeat(-1) && player.vehicle.getPedInSeat(-1) != player.handle) || (player.vehicle && player.vehicle.autosalon)) {
        lastPosition = newposition;
    } else {
        const dist = lastPosition.z < -100 ? system.distanceToPos2D(lastPosition, newposition) : system.distanceToPos(lastPosition, newposition)
        if(dist > 100){
            if(!lastTeleportPos || system.distanceToPos(newposition, lastTeleportPos) > 50){
                user.cheatDetect("teleport", LangString("protection.4cbb317c1df7235614fe7fdda5cd9e11", lastPosition.x.toFixed(0), lastPosition.y.toFixed(0), lastPosition.z.toFixed(0), newposition.x.toFixed(0), newposition.y.toFixed(0), newposition.z.toFixed(0), dist.toFixed(0), lastTeleportTime ? LangString("protection.68e8c0fca37a89108c39b295f431b28e", system.timestamp - lastTeleportTime) : LangString("protection.4e79396c1932064ebd275df56b621266")));
            }
        }
        lastPosition = newposition;
    }

    // Health check
    let current = player.getHealth()
    if(current < 0) current = 0;
    const superLastHp = lastHp
    if(current > lastHp) {
        setTimeout(() => {
            if(anticheatProtectList.heal) return;
            user.cheatDetect("heal", LangString("protection.6a54afcf3c9ddf10a6e5ba3c809bbf45", superLastHp, current));
        }, 1000)
    }
    lastHp = current



    // Armour check
    const currentArmour = player.getArmour()
    const superLastArmour = lastArmour
    if(currentArmour > lastArmour && !anticheatProtectList.armour) {
        setTimeout(() => {
            if(anticheatProtectList.armour) return;
            user.cheatDetect("armour", LangString("protection.d3fa125cc9500d45744a5bc557d2a9a2", superLastArmour, currentArmour));
        }, 3000)
    }
    lastArmour = currentArmour
}, 400);


mp.events.add("render", () => {
    if(!user.login) return;
    const current = mp.game.invoke("0x0A6DB4965674D243", player.handle);
    if(!weapon_hashes.find(q => q[1] == current)){
        if(player.isUsingAnyScenario()) return;
        if(myWeapons) return;
        player.removeAllWeapons();
        player.giveWeapon(-1569615261, 1, true);
    } else {
        if(current !== -1569615261 && !player.isUsingAnyScenario() && myWeapons != current) {
            user.cheatDetect("weapon", current);
            clearAllWeapons();
        } else if(current === -1569615261 && myWeapons){
            player.giveWeapon(myWeapons, 0, true)
        } else if(myWeaponsHash && myWeaponsHash != system.encryptCodes(myWeapons.toString(), myWeaponsHashStr)){
            user.cheatDetect( "memory", LangString("protection.ebfc79aded8cd2becc9a248234453f0e"));
            clearAllWeapons();
        } else {
            if(blockShootSaveZoneStatus() && player.isShooting()){
                user.cheatDetect( "weapon", LangString("protection.a39ad1898cf5a36081c4568cee374a71"));
                clearAllWeapons();
            }
        }
    }

})

mp.events.add("render", () => {
    const veh = player.vehicle;
    if(veh){
        const engine = veh.getVariable("engine");
        if (!engine && !veh.autosalon) {
            if(veh.getIsEngineRunning()){
                veh.setEngineOn(false, true, false)
                veh.setUndriveable(true)
                setTimeout(() => {
                    if(mp.vehicles.exists(veh) && veh.handle && !veh.getVariable("engine") && veh.getIsEngineRunning()){
                        user.cheatDetect("vehicleengine", LangString("protection.c4a34c887cbc542508e9658204dacb7a"))
                    }
                }, 800)
            }
        }
    }
})