import { langStringDefault } from "../../../../shared/lang";
import {RealDropData} from "../../../../shared/donate/donate-roulette/Drops/realDrop";
import {DropBase} from "./dropBase";

export class RealDrop extends DropBase {
    constructor(public readonly data: RealDropData) {
        super(data.dropId);
    }
    
    protected onDropActivated(player: PlayerMp): boolean {
        player.notify(player.user.LangString("realDrop.171dfd04481e61c84abfd0a809247291"))
        return true;
    };
}