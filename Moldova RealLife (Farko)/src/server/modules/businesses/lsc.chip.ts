import { langStringDefault } from "../../../shared/lang";
import {checkVehicleTuningAvailable, exitLsc} from "./lsc";
import {BusinessEntity} from "../typeorm/entities/business";
import {CHIP_TUNING_COST, ChipTuningOption, LSC_VEHICLE_POS} from "../../../shared/lsc";
import {system} from "../system";
import {CustomEvent} from "../custom.event";
import {PayType} from "../../../shared/pay";
import {vehicleConfigs} from "../vehicles";
import {isAMotorcycle} from "../../../shared/vehicles";
import {User} from "../user";

export const openLscChipMenu = (player: PlayerMp, business: BusinessEntity) => {
    const vehicle = player.vehicle;
    if (!vehicle) {
        return player.notify(player.user.LangString("lsc.chip.29118f7215c10b7fcb3c0932ab86d117"), "error");
    }

    if (isAMotorcycle(vehicle.modelname)) {
        return player.notify(player.user.LangString("lsc.chip.c1f84684593393a8f5198b13130eec9d"));
    }

    if (!checkVehicleTuningAvailable(player, vehicle)) {
        return;
    }

    player.user.teleportVeh(LSC_VEHICLE_POS.x, LSC_VEHICLE_POS.y, LSC_VEHICLE_POS.z, LSC_VEHICLE_POS.h, system.personalDimension);
    setTimeout(() => {
        if(!checkVehicleTuningAvailable(player, vehicle)) {
            if(player) exitLsc(player, business.id, vehicle.id, false);
            return;
        }

        const chipTuningCost = CHIP_TUNING_COST;
        CustomEvent.triggerClient(player, "business:lscChip:open", business.id, chipTuningCost, vehicle.entity?.data?.chipTuning || []);
    }, system.TELEPORT_TIME + 1000);
}

CustomEvent.registerClient("lsc:chip:exit", (player, businessId: number) => {
    if(!mp.players.exists(player) || !player.user) return;

    const vehicle = player.vehicle;

    player.user.setGui(null);
    CustomEvent.triggerClient(player, "lsc:exitChip")
    exitLsc(player, businessId, vehicle.id, false);
})

CustomEvent.registerCef("lsc:chip:buy", (player, businessId: number, vehicleId: number, data: ChipTuningOption[], payType:PayType, pin:string) => {
    if(!mp.players.exists(player) || !player.user) return true;

    player.user.setGui(null);
    CustomEvent.triggerClient(player, "lsc:exitChip")
    exitLsc(player, businessId, vehicleId, false);

    const user = player.user;
    const vehicle = player.vehicle;

    if (!checkVehicleTuningAvailable(player, vehicle)) {
        return;
    }

    const chipTuningCost = CHIP_TUNING_COST;
    if (payType == PayType.CASH) {
        if (user.money < chipTuningCost) {
            return player.notify(player.user.LangString("lsc.chip.de74f58e86d41be0b8c378125c954766"), "error");
        }
        user.removeMoney(chipTuningCost, true, user.LangString("lsc.chip.49e7a9585a87a48ff6ba41c50953ea95"));
    }
    else if (payType == PayType.CARD) {
        if (!user.verifyBankCardPay(pin)) {
            return player.notify(player.user.LangString("lsc.chip.d38d32de205882dd9c2ebdc25a87cfbc"), "error");
        }
        if (!user.tryRemoveBankMoney(chipTuningCost, true, user.LangString("lsc.chip.114dfe4defb560c778bc8b3fcb47fb78"), `#${businessId}`)) {
            return;
        }
    }

    vehicle.entity.data.chipTuning = data;
    vehicle.entity.data.save();

    player.user.entity.isFreeChipTuningUsed = true;

    vehicle.entity.applyCustomization();
});

const defaultConfigByModel = new Map<number, ChipTuningOption[]>();
CustomEvent.registerClient("lsc:chip:setDefault", (player: PlayerMp, vehicleModel: number, config: ChipTuningOption[]) => {
    defaultConfigByModel.set(vehicleModel, config);
});

mp.events.add("_userLoggedIn", (user: User) => {
    CustomEvent.triggerClient(user.player, "lsc:chip:loadDefaults", [...defaultConfigByModel.entries()]);
});
