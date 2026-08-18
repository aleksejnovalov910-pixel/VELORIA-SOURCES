import { langStringDefault } from "../../../shared/lang";
import {CustomEvent} from "../custom.event";
import {
    FAMILY_CREATE_COINS,
    FAMILY_CREATE_MONEY, FAMILY_CREATE_POS_CRIME,
    FAMILY_CREATE_POS_GOS,
    FamilyReputationType
} from "../../../shared/family";
import {PayType} from "../../../shared/pay";
import {colshapes} from "../checkpoints";
import {Family} from "./family";
import {system} from "../system";


enum PayTypeFamily {
    CASH = PayType.CASH,
    CARD = PayType.CARD,
    DONATE = 150
}
const createPosition = FAMILY_CREATE_POS_GOS


colshapes.new(new mp.Vector3(createPosition.x, createPosition.y, createPosition.z), player => player?.user?.LangString("create.183b82ada1e8a1df8d9bb808aa697454") ?? langStringDefault("create.183b82ada1e8a1df8d9bb808aa697454"), (player) => {
    familyCreateGUI(player)
}, {
    drawStaticName: "scaleform",
    dimension: 0
})

/** Отобразить ГУИ создания семьи игроку */
export const familyCreateGUI = (player: PlayerMp) => {
    if(!mp.players.exists(player) || !player.user) return;
    if(player.user.family) return player.notify(player.user.LangString("create.0780b8acb500e9ecbe7b6e27d36e2193"))
    CustomEvent.triggerClient(player, "family:create:start", [player.user.account.freeFamily ? 1 : FAMILY_CREATE_COINS, player.user.account.freeFamily ? 1 : FAMILY_CREATE_MONEY])
}

CustomEvent.registerCef("family:create", (player: PlayerMp, name: string, payType: PayTypeFamily, pin: string) => {
    if (!name || ! /^[a-zA-Z_-]{0,15}$/i.test(name)) {
        player.notify(player.user.LangString("create.016b20fcf611bc2c5bf3365ce9c81842"), "error")
        return false
    }
    if (Family.getAll().find(f => f.name == name)) {
        player.notify(player.user.LangString("create.d472f4e8087c2cee57645f2ba8704e2d"), "error")
        return false;
    }
    let user = player.user;


    if(!user.account.freeFamily) {
        if (payType == PayTypeFamily.CASH) {
            if (user.money < FAMILY_CREATE_MONEY) {
                player.notify(player.user.LangString("create.7f6951a86177f2e2ba47646bcaed062e"), "error");
                return false
            }
            user.removeMoney(FAMILY_CREATE_MONEY, true, user.LangString("create.5acf928ca06bfb536148816846034097"))
        }
        else if (payType == PayTypeFamily.CARD) {
            if (!user.verifyBankCardPay(pin)) {
                player.notify(player.user.LangString("create.bcd0b0e71b5a5f56bc2d9ea61bab1616"), "error")
                return false
            }
            if (!user.tryRemoveBankMoney(FAMILY_CREATE_MONEY, true, user.LangString("create.0b4678b6207ea7b8b94c5c09c5c712ca"), `${name}`)) return false;
        }
        else if (payType == PayTypeFamily.DONATE) {
            if (!user.tryRemoveDonateMoney(FAMILY_CREATE_COINS, true, user.LangString("create.bbc49cd3e13c60015aa44d5ccd1239cf"))) return false;
        }
        else {
            system.debug.error(langStringDefault("create.33d15a1ac795503dd919e5b8af40bc25"))
            return false
        }
    }


    Family.new(name).then((f) => {
        if(!user.exists) return;
        player.user.family = f
        player.user.familyRank = player.user.family.leaderRankID
        if(player.user.account.freeFamily) player.user.account.freeFamily = 0
        player.notify(player.user.LangString("create.9c16f6ee14ab6cd21edfe4a980628533"), "success")
    }).catch(r => {
        console.error(langStringDefault("create.3790d707bd228caa20d3ff7946dbe1d2", r));
        player.notify(player.user.LangString("create.7a8f29f922ff320384ff61c2a6d06a76"), "error")
    })
    return true;
})
