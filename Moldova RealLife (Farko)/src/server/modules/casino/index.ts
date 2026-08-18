import { langStringDefault } from "../../../shared/lang";
import "./roulette"
import "./dice"
import "./slots"
import "./wheel"
import {CustomEvent} from "../custom.event";
import {CHIP_COST, CHIP_MIN_BUY, CHIP_MIN_SELL, CHIP_SELL_COST} from "../../../shared/casino/main";
import {CASINO_TELEPORT_NAME, TELEPORT_CONFIG} from "../../../shared/teleport.system";

CustomEvent.registerClientAndCef("casino:chips:buy", (player, count: number) => {
    const user = player.user;
    if(!user) return;
    if(!count || count < CHIP_MIN_BUY) return;
    const sum = CHIP_COST * count;
    if(user.money < sum) return player.notify(player.user.LangString("index.294e229d194193ce65e41f5b0aab03ef"), "error");
    user.removeMoney(sum, true, user.LangString("index.5d2de501daafbc9125ee45f826b8edc0"));
    user.addChips(count, false, user.LangString("index.ae49230935ab09ffb2e68b0b431bfd76"))
})

CustomEvent.registerClientAndCef("casino:chips:sell", (player, count: number) => {
    const user = player.user;
    if(!user) return;
    if(!count || count < CHIP_MIN_SELL) return;
    const sum = CHIP_SELL_COST * count;
    if(user.chips < count) return player.notify(player.user.LangString("index.3030770503840e0645568b2b1bc81fcb"), "error");
    user.addMoney(sum, true, user.LangString("index.cec48b780fe301d7fe0ddfe1b89680dd"));
    user.removeChips(count, false, user.LangString("index.6d63d80274ee9cd11138860c619bc38b"))
})

CustomEvent.registerClient("casino:freeze", (player, status: {x: number, y: number, z: number}) => {
    player.setVariable("casino:freeze", status)
})

// CustomEvent.registerClient("teleport:go", (player, confid: number, index: number) => {
//     if (!player || !player.user) {
//         return;
//     }

//     const teleportConfig = TELEPORT_CONFIG[confid];
//     if (teleportConfig.name !== CASINO_TELEPORT_NAME) {
//         return;
//     }

//     if (player.user.entity.isCasinoHelpShowed) {
//         return;
//     }

//     player.user.entity.isCasinoHelpShowed = true;
//     player.user.setGui("casinoenter");
// });
CustomEvent.registerClient("teleport:go", (player, confid: number, index: number) => {
    if (!player || !player.user) return;

    const teleportConfig = TELEPORT_CONFIG[confid];
    if (teleportConfig.name === CASINO_TELEPORT_NAME) {
        return; // Blocheaza complet afisarea pentru cazino
    }

    // Alte teleportari pot continua aici daca e cazul
});