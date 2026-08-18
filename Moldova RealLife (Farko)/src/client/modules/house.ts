import { LangString, langStringDefault } from "./lang";
import {HOUSE_STOCK_POS, interriors} from "../../shared/inrerriors"
import {inventory} from "./inventory"
import {colshapes} from "./checkpoints"
import {MenuClass} from "./menu";
import {user} from "./user";
import {OWNER_TYPES} from "../../shared/inventory";
import {HOUSES_TELEPORT_SEPARATOR, HousesTeleportsList} from "../../shared/houses";
import {CustomEvent} from "./custom.event";
import {system} from "./system";
// let houseBlips: { [key: number]: BlipMp } = {};


const player = mp.players.local
colshapes.new(HOUSE_STOCK_POS, LangString("house.81c585e887c36cd0493134a439a972a8"), () => {
    const m = new MenuClass(LangString("house.9675800a142b15ec08af5ec36060bbec"));
    m.newItem({
        name: LangString("house.f8d351656d3a3bddc537b86b61c56974"),
        onpress: () => {
            inventory.open();
        }
    })
    m.newItem({
        name: LangString("house.78fe2cef9f30ca57b3aca3835a13418a"),
        onpress: () => {
            user.openLogs(`house_${OWNER_TYPES.STOCK_SAFE}_${player.dimension}`, LangString("house.f20a8cf20c24e80a0df79898ad9bfc5c"))
        }
    })
    m.open()

}, {
    color: [100, 203, 63, 100],
    dimension: -1,
    type: 1,
    radius: 1.5,
    drawStaticName: "scaleform"
})

let homeBlip: BlipMp;
let warehouseBlip: BlipMp;
let familyHomeBlip: BlipMp;

CustomEvent.registerServer("warehouseBlip:create", (pos: { x: number, y: number, z: number }) => {
    warehouseBlip = system.createBlip(50, 3, pos, LangString("house.17f08e277789f7179064b996cfa5e1e5"), 0);
})
CustomEvent.registerServer("warehouseBlip:destroy", () => {
    if (warehouseBlip)
        warehouseBlip.destroy()
})
CustomEvent.registerServer("house:homeBlip:create", (positionData) => {
    const pos = JSON.parse(positionData);
    homeBlip = system.createBlip(40, 3, pos, LangString("house.a279cfbca218a1facb026155a43a955d"), 0);
})
CustomEvent.registerServer("house:homeBlip:delete", () => {
    if (homeBlip) 
        homeBlip.destroy()
})

CustomEvent.registerServer("familyHome:createBlip", (positionData) => {
    const pos = JSON.parse(positionData);
    familyHomeBlip = system.createBlip(40, 3, pos, LangString("house.9b2ce8de098e06f3b844b8beea581de9"), 0);
})
CustomEvent.registerServer("familyHome:deleteBlip", (positionData) => {
    if (familyHomeBlip)
        familyHomeBlip.destroy()
})

interriors.map((item, index) => {
    if (item.type === "house") {
        if (item.stock) {
            // mp.markers.new(1, new mp.Vector3(item.stock.x, item.stock.y, item.stock.z), 1, {
            //     color: [100, 203, 63, 100],
            //     dimension: -1,
            // })
            colshapes.new(new mp.Vector3(item.stock.x, item.stock.y, item.stock.z), LangString("house.fe5ca486e3b388cb6c6f06ef0d97add0"), () => {
                const m = new MenuClass(LangString("house.38fcb705a5e74883f1987b8d7bd44eb0"));
                m.newItem({
                    name: LangString("house.c5bf32bd6722bf52dcca1f2c93fe512c"),
                    onpress: () => {
                        inventory.open();
                    }
                })
                m.newItem({
                    name: LangString("house.751746ccf4d2396fd71129826659ecc0"),
                    onpress: () => {
                        user.openLogs(`house_${OWNER_TYPES.HOUSE}_${player.dimension}`, LangString("house.2c340231e272424ac5f4e27ba7f97dc7"))
                    }
                })
                m.open()

            }, {
                color: [100, 203, 63, 100],
                dimension: -1,
                radius: 1.5,
                type: 1,
                drawStaticName: "scaleform"
            })
        }
    }
    // if (item.type === "garage") {
    //     item.cars.map(crd => {
    //         mp.markers.new(27, new mp.Vector3(crd.x, crd.y, crd.z), 4, {
    //             color: [217, 153, 63, 120],
    //             dimension: -1,
    //         })
    //     })
    // }
})



HousesTeleportsList.map((item, index) => {

    colshapes.new(item.pos, item.name, player => {
        CustomEvent.triggerServer("houseteleport:houseMenu", index)
    }, {
        drawStaticName: "scaleform",
        dimension: 0
    });

    colshapes.new(new mp.Vector3(item.carExit.x, item.carExit.y, item.carExit.z + 0.5), item.name, player => {
        CustomEvent.triggerServer("houseteleport:vehicleMenu", index)
    }, {
        drawStaticName: "scaleform",
        dimension: 0,
        radius: 3,
        type: 36
    });

    for(let q = HOUSES_TELEPORT_SEPARATOR * (index + 1); q < HOUSES_TELEPORT_SEPARATOR * (index + 2); q++){
        colshapes.new(item.inside, item.name, player => {
            CustomEvent.triggerServer("houseteleport:houseMenu", index)
        }, {
            drawStaticName: "scaleform",
            dimension: q
        });
    }
})


let houseBlipsArray = [];

mp.events.add("house:blip:create", (data: { x: number, y: number, z: number, isOwner: boolean }) => {
    if (data.isOwner) return;

    findBlipAndDelete({ x: data.x, y: data.y, z: data.z });

    const blip = system.createBlip(374, 1, new mp.Vector3(data.x, data.y, data.z), "Casa ocupata", 0, true, 0.6)
    houseBlipsArray.push(blip)
})

mp.events.add("house:blip:delete", (data: { x: number, y: number, z: number }) => {
    findBlipAndDelete({ x: data.x, y: data.y, z: data.z });
})

mp.events.add("house:blip:deleteAll", () => {
    houseBlipsArray.forEach(blip => {
        blip && mp.blips.exists(blip) && blip.destroy();
    })
    houseBlipsArray = [];
})

mp.events.add("house:blip:createAll", (dataString: string) => {
    const data = JSON.parse(dataString);
    data.forEach((item: { x: number, y: number, z: number }) => {
        findBlipAndDelete({ x: item.x, y: item.y, z: item.z });
        const blip = system.createBlip(374, 1, new mp.Vector3(item.x, item.y, item.z), "Casa ocupata", 0, true, 0.6)
        houseBlipsArray.push(blip)
    })
})

mp.events.add("playerQuit", (player: PlayerMp) => {
    if (player != mp.players.local) return;

    houseBlipsArray.forEach(blip => {
        blip && mp.blips.exists(blip) && blip.destroy();
    })
})


const findBlipAndDelete = (pos: { x: number, y: number, z: number }) => {
    const index = houseBlipsArray.findIndex((blip) => {
        return blip && mp.blips.exists(blip) && blip.position.equals(new mp.Vector3(pos.x, pos.y, pos.z));
    })
    if (index != -1) {
        mp.blips.exists(houseBlipsArray[index]) && houseBlipsArray[index].destroy();
        houseBlipsArray.splice(index, 1);
    }
}