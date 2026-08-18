import { LangString, langStringDefault } from "./lang";
import {user} from "./user";
import {healTimer} from "./survival";
import {inCasinoRoulette} from "./casino/roulette";
import {inDiceGame} from "./casino/dice";

const player = mp.players.local

let currentSetStatus: string;
let currentSetText: string;
export const discord = {
    get status(){
        return currentSetStatus
    },
    set status(val){
        currentSetStatus = val;  
        discord.update();
    },
    update(){
        let text:string;
        if (currentSetStatus) text = currentSetStatus;
        if(!text && !user.login) text = LangString("discord.fc274a5574c40b96e8138deb4cf6f9b8");
        if(!text && mp.game.ui.isPauseMenuActive()) text = LangString("discord.14e450fc3ded69ce113f9774b5c9a482");
        if(!text && user.afk) text = "AFK";
        if(!text && user.isAdminNow()) text = LangString("discord.1e8cf78cbfadd0e7a6b8f4b7b1d856e6");
        if (!text && (player.isSprinting() || player.isRunning())) text = LangString("discord.1ca1a8961dd650a773fb91950c05554b");
        if (!text && user.dead) text = LangString("discord.f1983aab44b85eab7a4d6afe3541baed");
        if (!text && healTimer) text = LangString("discord.fa8ebf853d7e05d772ca05c98bffa8bf");
        if (!text && inCasinoRoulette()) text = LangString("discord.558723b79d469690c6553bd57641bef1");
        if (!text && inDiceGame()) text = LangString("discord.fd0ddcafd5d06b397f54deec2b0562b6");

        
        if(!text) text = LangString("discord.5ed4696006c37c7f24e3509e5677e897");
        if (text === currentSetText) return;
        currentSetText = text
        mp.discord.update("Moldova 𝗥𝗲𝗮𝗹 𝗟𝗶𝗳𝗲", text);
    }
}

setInterval(() => {
    discord.update();
}, 5000)