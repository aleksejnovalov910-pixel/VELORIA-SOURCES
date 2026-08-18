import { langStringDefault } from "../../../../shared/lang";
import {DropBase} from "./dropBase";
import {VehicleDropData} from "../../../../shared/donate/donate-roulette/Drops/vehicleDrop";
import {Vehicle} from "../../vehicles";
import {LicenseName} from "../../../../shared/licence";
import {DropSellType} from "../../../../shared/donate/donate-roulette/enums";

export class VehicleDrop extends DropBase {
    constructor(public readonly data: VehicleDropData) {
        super(data.dropId);
    }

    protected onDropActivated(player: PlayerMp): boolean {
        const user = player.user;
        const vehConf = Vehicle.getVehicleConfig(this.data.vehicleModel);
        
        if (!vehConf) {
            player.notify(player.user.LangString("vehicleDrop.11a5bcc1a2305c34a45c814c76cb762f"), "error");
            return false;
        }
        if (vehConf.license && !user.haveActiveLicense(vehConf.license)) {
            player.notify(player.user.LangString("vehicleDrop.ad513d4f2a15145a069b8075a8f19425", vehConf.name, LicenseName[vehConf.license]), "error");
            return false
        } 
        if (user.myVehicles.length >= user.current_vehicle_limit) {
                player.notify(player.user.LangString("vehicleDrop.bf00804479920b0f5bcd8f5143a69e19", user.current_vehicle_limit), "error");
                return false;
        }
        
        Vehicle.createNewDatabaseVehicle(
            player, 
            vehConf.id, 
            {r: 0, g: 0, b: 0}, 
            {r: 0, g: 0, b: 0}, 
            new mp.Vector3(0,0,0), 
            0, 
            Vehicle.fineDimension, 
            this.data.sellPrice, 
            this.data.sellType == DropSellType.DONATE ? 1 : 0)
        player.outputChatBox(player.user.LangString("vehicleDrop.e61bfc1baa16fe9f28b72820ef54bcb4", vehConf.name));
        
        return true;
    };
}