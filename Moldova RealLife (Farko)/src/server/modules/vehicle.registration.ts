import {CustomEvent} from "./custom.event";
import {VEHICLE_REGISTRATION_TARIFS} from "../../shared/vehicle.registration";
import {DONATE_MONEY_NAMES} from "../../shared/economy";
import {menu} from "./menu";
import {Vehicle} from "./vehicles";
import {VehicleEntity} from "./typeorm/entities/vehicle";
import {User} from "./user";

CustomEvent.registerCef("vehiclenumber:buyDonate", (player, number: string) => {
    const user = player.user;
    const veh = player.vehicle;
    const cfg = VEHICLE_REGISTRATION_TARIFS[3];
    
    if (!number || !user) return;
    if (!Vehicle.isNumberValid(number)) return user.notify(user.LangString("vehicle.registration.numberInvalid"), "error", "CHAR_TOM");
    if (!check(user, veh)) return;
    
    VehicleEntity.findOne({number: number}).then(res => {
        if (res) return user.notify(user.LangString("vehicle.registration.exist"), "error", "CHAR_TOM");
        if (user.donate_money < cfg[1]) return user.notify(player.user.LangString("vehicle.registration.removeDonateerr", DONATE_MONEY_NAMES[2])
        , "error", "diamond");
        user.removeDonateMoney(cfg[1], user.LangString("vehicle.registration.removeDonate"))
        veh.entity.setNumber(number);
        user.notify(user.LangString("vehicle.registration.ok"), "success", "CHAR_TOM");
        user.setGui(null);
    })
});

const check = (user: User, veh: VehicleMp) => {
    if (!veh) {
        user.notify(user.LangString("vehicle.registration.check.noVeh"), "error", "CHAR_TOM");
        return false
    }
    if (!veh.entity) {
        user.notify(user.LangString("vehicle.registration.check.noVehEnt"), "error", "CHAR_TOM");
        return false
    }
    if ((veh.entity.owner && veh.entity.owner !== user.id) || (veh.entity.familyOwner && veh.entity.familyOwner !== user.familyId)) {
        user.notify(user.LangString("vehicle.registration.check.noVehEnt"), "error", "CHAR_TOM");
        return false
    }
    
    return true;
}

CustomEvent.registerCef("vehiclenumber:buy", (player, id: number) => {
    const cfg = VEHICLE_REGISTRATION_TARIFS[id];
    if (!cfg) return;
    const user = player.user;
    const veh = player.vehicle;
    
    if (!check(user, veh)) return;
    
    if (!user.bank_number) return user.notify(user.LangString("vehicle.registration.buy.bank"), "error", "CHAR_TOM");
    if (user.bank_money < cfg[1]) return user.notify(user.LangString("vehicle.registration.buy.bankmoney"), "error", "CHAR_TOM");
    user.removeBankMoney(cfg[1], true, user.LangString("vehicle.registration.buy.reason", veh.entity.id), user.LangString("vehicle.registration.buy.init"));
    veh.entity.setRandomNumber(cfg[3]);
    
    user.notify(user.LangString("vehicle.registration.buy.notify"), "success", "CHAR_TOM");
    user.setGui(null);
})