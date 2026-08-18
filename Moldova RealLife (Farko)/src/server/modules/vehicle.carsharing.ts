import { colshapes } from './checkpoints'
import { CAR_SHARING_POS, SHARING_DURATION } from '../../shared/vehicle.carsharing'
import { system } from './system'
import {menu, MenuClass} from './menu'
import { CustomEvent } from './custom.event'
import { Vehicle } from './vehicles'
import {User} from "./user";
import {UserStatic} from "./usermodule/static";
import { langStringDefault } from '../../shared/lang'

class CarSharingManager {
    public init(): void {
        colshapes.new(new mp.Vector3(CAR_SHARING_POS.x, CAR_SHARING_POS.y, CAR_SHARING_POS.z), player => player.user.LangString("vehicle.carsharing"), player => {
            if (!player.user) return;
            
            const m = new MenuClass(player, player.user.LangString("vehicle.carsharing"));
            m.newItem({
                name: player.user.LangString("vehicle.carsharing.menu.item.1"),
                onpress: () => {
                    if (!player.user) return

                    let vehRentedByPlayer: Vehicle = null;
                    const availableToRentVehicles: Array<{id: number, name: string, cost: number}> = []
                    Vehicle.list.forEach(veh => {
                        if (!vehRentedByPlayer && veh.rentedBy == player.user)
                            vehRentedByPlayer = veh
                        if (!veh.rentedBy && veh.data.carSharing)
                            availableToRentVehicles.push({ id: veh.data.id, name: veh.model, cost: veh.data.carSharing.sharingCost })
                    })
                    
                    player.user.setGui("carSharing")
                    CustomEvent.triggerCef(player, 'carSharing:open', availableToRentVehicles, vehRentedByPlayer ? { id: vehRentedByPlayer.data.id, name: vehRentedByPlayer.model, cost: vehRentedByPlayer.data.carSharing.sharingCost } : null)
                }
            })
            
            m.newItem({
                name: player.user.LangString("vehicle.carsharing.menu.item.2"),
                onpress: () => {
                    const availableToRentVehicles = player.user.myVehicles
                        ?.filter(veh => !veh.data.carSharing && veh.data.cost > 0)
                    
                    if (!availableToRentVehicles?.length)
                        return player.notify(player.user.LangString("vehicle.carsharing.menu.item.2.err"))
                    
                    const m = new MenuClass(player, player.user.LangString("vehicle.carsharing.menu2.title"));
                    availableToRentVehicles.forEach(veh => {
                        m.newItem({
                            name: `${veh.name} (${veh.number})`,
                            onpress: async () => {
                                const maxPrice = veh.data.cost > 5000000 ? 50000 : 30000
                                const price = Number(await menu.input(
                                    player,
                                    player.user.LangString("vehicle.carsharing.menu2.accept", maxPrice),
                                ))
                                if (isNaN(price) || price <= 0 || price > maxPrice)
                                    return player.notify(player.user.LangString("vehicle.carsharing.menu2.accept.err"))
                                
                                veh.data.carSharing = {
                                    earnedMoney: 0,
                                    sharedTime: system.timestamp,
                                    sharingCost: price
                                }
                                
                                await veh.data.save();
                                m.close()
                            }
                        })
                    })
                    m.open();
                }
            })
            m.newItem({
                name: player.user.LangString("vehicle.carsharing.menu.item.3"),
                onpress: () => {
                    const vehicles = player.user.myVehicles?.filter(veh => veh.data.carSharing)

                    if (!vehicles)
                        return player.notify(player.user.LangString("vehicle.carsharing.menu.item.3.novehs"))

                    const m = new MenuClass(player, player.user.LangString('vehicle.carsharing.menu.item.3.menu.title'));
                    vehicles.forEach(veh => {
                        m.newItem({
                            name: `${veh.name} (${veh.number})`,
                            onpress: async () => {
                                if (veh.rentedBy) return player.notify(player.user.LangString("vehicle.carsharing.menu.item.3.menu.err"), "error")
                                await this.cancelRent(veh)
                                m.close()
                            }
                        })
                    })
                    m.open();
                }
            })
            m.open()
        })
    }
    
    public async cancelRent(vehicle: Vehicle): Promise<void> {
        await UserStatic.addMoney(vehicle.owner, vehicle.data.carSharing.earnedMoney, langStringDefault("vehicle.carsharing.cancel"))
        vehicle.data.carSharing = null
        vehicle.respawn()

        await vehicle.data.save()
    }
}

CustomEvent.register("newHour", () => {
    Vehicle.list.forEach(async veh => {
        if (veh.data?.carSharing?.sharedTime && system.timestamp > veh.data?.carSharing?.sharedTime + SHARING_DURATION * 60 * 60 * 1000) {
            veh.rentedBy = null
            await carsharingManager.cancelRent(veh)
        } else if (veh.rentedBy && veh.data?.carSharing?.sharedTime + 60 * 60 * 1000 < system.timestamp) {// Если прошел час с момента аренды
            if (veh.rentedBy.money < veh.data.carSharing.sharingCost || !veh.rentedBy.removeMoney(veh.data.carSharing.sharingCost, true, veh.rentedBy.LangString("vehicle.carsharing.newHour"))) {
                veh.rentedBy = null
            } else {
                veh.data.carSharing = { ...veh.data.carSharing, earnedMoney: veh.data.carSharing.earnedMoney + veh.data.carSharing.sharingCost }
                await veh.data.save()
            }
        }
    })
})

mp.events.add('playerQuit', player => {
    if (!player.user) return;
    Vehicle.list.forEach(async veh => {
        if (veh.rentedBy == player.user) {
            veh.rentedBy = null
        }
    })
})

CustomEvent.registerCef("carSharing:rent", async (player, id: number) => {
    if (!player.user) return
    const veh = Vehicle.get(id)
    
    if (!veh || veh.rentedBy || !veh.data.carSharing) {
        return player.notify(player.user.LangString("vehicle.carsharing.rent.noveh"))
    }
    if (veh.rentedBy == player.user) {
        return player.notify(player.user.LangString("vehicle.carsharing.rent.already"))
    }

    if (player.user.money < veh.data.carSharing.sharingCost) {
        return player.notify(player.user.LangString("vehicle.carsharing.rent.money"), 'error')
    }

    if (!player.user.removeMoney(veh.data.carSharing.sharingCost, true, player.user.LangString("vehicle.carsharing.rent.money.reason"))) {
        return player.notify(player.user.LangString("vehicle.carsharing.rent.money.reason.notify"))
    }

    player.user.setGui(null);

    Vehicle.teleport(veh.vehicle, player.position, 0, 0)
    veh.rentedBy = player.user;
    veh.data.carSharing = { ...veh.data.carSharing, earnedMoney: veh.data.carSharing.earnedMoney + veh.data.carSharing.sharingCost }
    await veh.data.save()
})

CustomEvent.registerCef("carSharing:stopRent", async (player, id: number) => {
    if (!player.user) return
    const veh = Vehicle.get(id)

    if (!veh || veh.rentedBy != player.user) {
        return player.notify(player.user.LangString("vehicle.carsharing.stopRent.missID"), "error")
    }

    veh.rentedBy = null
    veh.respawn()
    player.user.setGui(null)
})

export interface ICarSharingVehicleData {
    sharingCost: number
    sharedTime: number
    earnedMoney: number
}

const carsharingManager = new CarSharingManager()
carsharingManager.init()