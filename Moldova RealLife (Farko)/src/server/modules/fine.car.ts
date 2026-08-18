import { langStringDefault } from "../../shared/lang";
import {FINE_AIR_POS, FINE_CAR_POS} from "../../shared/fine.car";
import {colshapes} from "./checkpoints";
import {menu} from "./menu";
import {system} from "./system";
import {houses} from "./houses";
import {parking} from "./businesses/parking";
import {PARKING_START_COST} from "../../shared/parking";
import {Vehicle} from "./vehicles";
import {distinctArray} from "../../shared/arrays";

setTimeout(() => {
    FINE_CAR_POS.map(q => {
        system.createBlip(569, 28, q, langStringDefault("fine.car.8e3a1ad47ae84beee5d853f0ae7ca94c"))
    })
    FINE_AIR_POS.map(q => {
        system.createBlip(481, 28, q, langStringDefault("fine.car.fe2cec6e0260ae991abe8422c30a5b30"))
    })
}, 1000)

const fineMenu = (player: PlayerMp, index: number, air = false) => {
    const user = player.user;
    if (!user) return;
    const poss = air ? FINE_AIR_POS : FINE_CAR_POS
    const cars = distinctArray(
        [...user.myVehicles, ...Vehicle.getVehiclesByPlayerKeys(player)],
        (vehicle) => vehicle.id).filter(q => q.onParkingFine && q.avia === air)
    if (user.family && user.family.house){
        let familyCars = user.family.cars.filter(q => q.onParkingFine && q.avia === air)
        if(familyCars.length > 0) cars.push(...familyCars)
    }
    if(cars.length === 0) return player.notify(player.user.LangString("fine.car.c74ccc00cd1693b91a3baa9ba67de913"), "error");
    const m = menu.new(player, player.user.LangString("fine.car.ab55fba0c2c91d5e9523b7b2e1732f93"));
    cars.map(veh => {
        m.newItem({
            name: `${veh.name}`,
            more: `$${system.numberFormat(veh.fine)}`,
            desc: `${veh.data.fine_reason || player.user.LangString("fine.car.a09ed5e4adcce34b4705afd79ef92607")}`,
            onpress: async () => {
                if(veh.fine){
                    if(!(await user.tryPayment(veh.fine, 'card', () => veh.fine !== 0, user.LangString("fine.car.1445fc0026899e948095e69afcd8a3b4")+veh.name, user.LangString("fine.car.0c1c35f28b72006d49ce35efeb057cde")))) return;
                    else if(mp.players.exists(player)) player.notify(player.user.LangString("fine.car.e69f5f02a01be24038b322d5fc9fef3d"), "success");
                    veh.fine = 0;
                }
                veh.selectParkPlace(player).then(async place => {
                    if (!veh.onParkingFine) return;
                    if(!place) return player.notify(player.user.LangString("fine.car.8f4488bd44803a1aff997c68227a3bd7"), "error");
                    const selectPlace = () => {
                        if(place.type === "house"){
                            return houses.getFreeVehicleSlot(place.id, veh.avia)
                        } else {
                            return parking.getFreeSlot(place.id)
                        }
                    }
                    if(place.type === "parking"){
                        await system.sleep(500);
                        if(!mp.players.exists(player)) return;
                        if (!(await user.tryPayment(PARKING_START_COST, 'card', () => !!selectPlace(), user.LangString("fine.car.50b05f5906ecb1052fc3f91ca302ba3c") + veh.name, user.LangString("fine.car.565f3c3fb0a2190611ecefba80f19666")+place.id))) return player.notify(player.user.LangString("fine.car.a249e45a0847657a574ea7f6f1b1b772"), 'error');
                        else if (mp.players.exists(player)) player.notify(player.user.LangString("fine.car.b0fc33af937c124fa141ebaeae8a4da9"), "success");
                    }
                    const pos = selectPlace();
                    veh.position = {
                        x: pos.x,
                        y: pos.y,
                        z: pos.z,
                        d: pos.d,
                        h: pos.h,
                    }
                    if (!mp.vehicles.exists(veh.vehicle)) return;
                    if(!mp.players.exists(player)) return veh.respawn(false);
                    Vehicle.teleport(veh.vehicle, poss.map(q => new mp.Vector3(q.x, q.y, q.z + 1))[index], poss[index].h, player.dimension)
                    setTimeout(() => {
                        if (!mp.vehicles.exists(veh.vehicle)) return;
                        // Vehicle.teleport(veh.vehicle, poss.map(q => new mp.Vector3(q.x, q.y, q.z + 1))[index], poss[index].h, player.dimension)
                        if(!mp.players.exists(player)) return;
                        player.user.putIntoVehicle(veh.vehicle, 0);
                    }, 1000)

                })
            }
        })
    })
    m.open();
}

colshapes.new(FINE_CAR_POS.map(q => new mp.Vector3(q.x, q.y, q.z)), player => player?.user?.LangString("fine.car.7c750233dd48b64b891180d998f0b917") ?? langStringDefault("fine.car.7c750233dd48b64b891180d998f0b917"), (player, index) => {
    fineMenu(player, index)
}, {
    type: 27,
    radius: 3,
    color: [207, 171, 23, 200]
})
colshapes.new(FINE_AIR_POS.map(q => new mp.Vector3(q.x, q.y, q.z)), player => player?.user?.LangString("fine.car.84797c687270f7920de2d26b5a8c7aec") ?? langStringDefault("fine.car.84797c687270f7920de2d26b5a8c7aec"), (player, index) => {
    fineMenu(player, index, true)
}, {
    type: 27,
    radius: 5,
    color: [207, 171, 23, 200]
})