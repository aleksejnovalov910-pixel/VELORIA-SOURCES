import { langStringDefault } from "../../../shared/lang";
import {CustomEvent} from "../custom.event";
import {slotMachineData} from "../../../shared/casino/slots";
import _ from "lodash";
import {user} from "../../../client/modules/user";
import {system} from "../system";
import {runCasinoAchievWin} from "./achiev";
let slots = new Map<number, PlayerMp>();

CustomEvent.registerClient("casino:slots:enter", (player, id: number) => {
    if(player.user.getJobDress) return player.user.LangString("slots.8b5e6a913fb41e1f29d70ab6839868e6");
    verifySlot(id);
    if(slots.get(id)) return false;
    slots.set(id, player);
    player.user.currentWeapon = null;
    return true;
})

const generateWin = () => {
    const winActions = _.shuffle(_.flatMap(slotMachineData.rulesPercentage, (winAction => Array(winAction.pct).fill(winAction))));

    const winAction = winActions[Math.floor(Math.random() * winActions.length)];

    const winStrings = slotMachineData.rulesMap[winAction.value];
    const winString = winStrings[Math.floor(Math.random() * winStrings.length)];

    const rule = slotMachineData.rules[winString];

    return {
        winString,
        rule,
        isWinBet: typeof rule === "number"
    };
}

CustomEvent.registerClient("casino:slots:roll", (player, id: number, bet: number) => {
    const user = player.user;
    verifySlot(id);
    if(slots.get(id) != player) return null;
    if(user.chips < bet) {
        user.notify(user.LangString("slots.0c27a51a53523946af706950c176602f"), "error");
        return null;
    }
    user.removeChips(bet, false, user.LangString("slots.ce49b549d166d5ca294ecdeb70bca380"));
    const {winString, rule, isWinBet} = generateWin();
    const winBalance = bet * rule;


    setTimeout(() => {
        if (player && mp.players.exists(player) && slots.get(id) == player) {
            if (isWinBet) {
                user.addChips(winBalance, true, user.LangString("slots.5cdf77d3f6b8488dd04264502199b713"));
                runCasinoAchievWin(player, "Slots", winBalance)
            } else {
                player.notify(player.user.LangString("slots.4a22437621d4298e1a40c3f5126291cf", system.numberFormat(bet)), "error");
            }
        }
    }, 5000);
    const nearest = user.getNearestPlayers();
    nearest.map(q => {
        CustomEvent.triggerClient(q, "casino:slots:rollVisual", player.id, id, winString)
    })
    return [winString, isWinBet]
})

CustomEvent.registerClient("casino:slots:exit", (player, id: number) => {
    verifySlot(id);
    const q = slots.get(id)
    if(!q) return;
    if(q.id !== player.id) return;
    slots.delete(id);
})

const verifySlot = (id: number) => {
    const q = slots.get(id)
    if(!q) return;
    if(mp.players.exists(q)) return;
    slots.delete(id);
}