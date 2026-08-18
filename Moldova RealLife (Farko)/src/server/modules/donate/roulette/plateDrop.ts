import { langStringDefault } from "../../../../shared/lang";
import {DropBase} from "./dropBase";
import {PlateDropData} from "../../../../shared/donate/donate-roulette/Drops/plateDrop";
import {menu} from "../../menu";

export class PlateDrop extends DropBase {
    constructor(public readonly data: PlateDropData) {
        super(data.dropId);
    }

    protected onDropActivated(player: PlayerMp): boolean {
        let m = menu.new(player, player.user.LangString("plateDrop.553ccfb23d09129fde790eb0ba69987b"), player.user.LangString("plateDrop.58e7d46ced03bccbaaa3c9c73104df30"));
        if (player.user.myVehicles.length === 0) {
            player.notify(player.user.LangString("plateDrop.fca0554950903415755adcc943315fa4"));
            return false;
        }
        
        player.user.myVehicles.forEach(v => {
            m.newItem({
                name: `${v.name} (${v.number})`,
                onpress: () => {
                    v.setNumber(this.data.plateNumber)
                }
            })
        });
        
        m.open();
        
        return true;
    };
}