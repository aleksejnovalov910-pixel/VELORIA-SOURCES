import { langStringDefault } from "../../../../../shared/lang";
import {MonopolyPlayer} from "../monopolyPlayer";
import {IField} from "./IField";
import {FieldBase} from "./FieldBase";
import {system} from "../../../system";
import {FieldType} from "../fieldType";

const WIN_AMOUNT = 2500

export class JackpotField extends FieldBase implements IField {
    public readonly type: FieldType = FieldType.Jackpot

    public onPlayerReached(player: MonopolyPlayer): void {
        const randomNumber = system.getRandomInt(1, 100)
        if (randomNumber < 20) {
            player.balance += WIN_AMOUNT
            player.player.notify(langStringDefault("JackpotField.ddacff2a482553c4c1e9d461737deea8", WIN_AMOUNT), "success")
        } else {
            player.player.notify(langStringDefault("JackpotField.dfec63b3a307582835167ef52a9b445c"), "error")
        }
        player.releaseMove()
    }
}