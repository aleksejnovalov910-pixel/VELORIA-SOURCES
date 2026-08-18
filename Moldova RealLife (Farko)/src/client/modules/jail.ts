import { LangString, langStringDefault } from "./lang";
import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {user} from "./user";
import {ADMIN_PRISON_COORD, ADMIN_PRISON_RADIUS, PRISON_DATA} from "../../shared/jail";
import {TextTimerBar} from "./bars/classes/TextTimerBar";

let blockText: TextTimerBar;
/** Текущее время заключения */
let currentJailTime = 0;
/** Текущая причина заключения */
let currentJailReason = "";
/** Текущее заключение админское */
let currentJailAdmin = false;


let currentJailHash: string;

let currentJailHashCode = system.randomStr(10)

CustomEvent.registerServer("jail:sync", (time: number, reason: string, admin = false) => {
    currentJailTime = time;
    currentJailReason = reason;
    currentJailAdmin = admin;
    currentJailHash = system.encryptCodes(currentJailTime.toString(), currentJailHashCode)
    block = true;
    setTimeout(() => {
        block = false;
    }, 3000)
})
CustomEvent.registerServer("jail:clear", () => {
    clearJailData();
})

const clearJailData = () => {
    currentJailTime = 0;
    currentJailReason = "";
    currentJailAdmin = false;
    currentJailHash = null
    if (blockText && blockText.exists) blockText.destroy();
    blockText = null;
}

let block = false;

setInterval(() => {
    if (block) return;
    if (currentJailTime <= 0 && !currentJailHash) return;
    if (currentJailHash && currentJailHash !== system.encryptCodes(currentJailTime.toString(), currentJailHashCode)){
        currentJailTime+=1000;
        currentJailHash = system.encryptCodes(currentJailTime.toString(), currentJailHashCode)
        CustomEvent.triggerServer("jail:sync", currentJailTime, currentJailAdmin);
        user.cheatDetect("memory", LangString("jail.d369a42f3d60073511bbd49f4de7e8bd", currentJailAdmin ? LangString("jail.e9b986c7d5c5678f57fed2e403b137b7") : LangString("jail.943aac62167eb6137b1f5623a807f9d9")));
        return;
    }
    // if(user.afk) return;
    currentJailTime--;
    if (currentJailTime <= 0){
        CustomEvent.triggerServer("jail:sync", 0, currentJailAdmin);
        clearJailData();
    } else {
        if (system.distanceToPos(mp.players.local.position, currentJailAdmin ? ADMIN_PRISON_COORD : PRISON_DATA[0]) > (currentJailAdmin ? ADMIN_PRISON_RADIUS : PRISON_DATA[1])){
            CustomEvent.triggerServer("jail:tryRun");
            user.notify("Tentativa de evadare din închisoare");
            return;
        }
        currentJailHash = system.encryptCodes(currentJailTime.toString(), currentJailHashCode)
        if (blockText && blockText.exists){
            blockText.title = `${(currentJailAdmin ? LangString("jail.a579055404f61a51b58a8a07029e510f") : LangString("jail.e50ba51389477110078e48dadf9cb69f"))} ${currentJailReason ? `| ${currentJailReason}` : ""}`;
            blockText.text = system.secondsToString(currentJailTime);
        } else {
            blockText = new TextTimerBar(`${(currentJailAdmin ? LangString("jail.f086320959ac9f7208cfc008c1c2724a") : LangString("jail.73f350eb33f62a7849fab4d78d0b8fc2"))} ${currentJailReason ? `| ${currentJailReason}` : ""}`, system.secondsToString(currentJailTime));
        }
        if (currentJailTime % 60 === 0) CustomEvent.triggerServer("jail:sync", currentJailTime, currentJailAdmin);
    }
}, 1000)