import { LangString, langStringDefault } from "../lang";
import {NpcSpawn} from "../npc.dialog";
import {
    CASINO_CASHIER,
    CASINO_ENTER,
    CASINO_INTERIORS_IDS_IN,
    CASINO_MAIN_DIMENSION
} from "../../../shared/casino/main";
import {system} from "../system";
import {gui} from "../gui";

system.createBlipInterrior(628, 0, new mp.Vector3(CASINO_CASHIER.pedPos.x, CASINO_CASHIER.pedPos.y, CASINO_CASHIER.pedPos.z), LangString("index.744857d6d94996c7ef4c4b94bfd75f07"), CASINO_CASHIER.dimension)
system.createBlipInterrior(366, 0, new mp.Vector3(DICE_TABLE_SETTINGS.DRESS_POS.x, DICE_TABLE_SETTINGS.DRESS_POS.y, DICE_TABLE_SETTINGS.DRESS_POS.z), LangString("index.6a95a8e6db34ed8384f95d76f97dfff5"), CASINO_MAIN_DIMENSION)
system.createBlip(679,0, new mp.Vector3(CASINO_ENTER.x, CASINO_ENTER.y, CASINO_ENTER.z), LangString("index.5da8d6fd98c34cdd22014fcddb5a3ae3"), 0);
let npcCash = new NpcSpawn(new mp.Vector3(CASINO_CASHIER.pedPos.x, CASINO_CASHIER.pedPos.y, CASINO_CASHIER.pedPos.z), CASINO_CASHIER.pedPos.h, CASINO_CASHIER.model, CASINO_CASHIER.name, () => {
    gui.setGuiWithEvent("casino");
}, 7, CASINO_CASHIER.dimension, 4);
npcCash.anim = ["anim_casino_b@amb@casino@games@roulette@dealer_female", "idle"]
npcCash.greeting = {
    dist: 5,
    voiceName: CASINO_CASHIER.speech,
    speechName: "MINIGAME_DEALER_GREET",
    speechParam: "SPEECH_PARAMS_FORCE"
}


mp.events.addDataHandler("casino:freeze", async (target: VehicleMp, val: { x: number, y: number, z: number}) => {
    if(target.type !== "player") return;
    target.freezePosition(!!val)
    // if(val) target.setCoords(val.x, val.y, val.z, true, true, true, true)
})

mp.events.add("entityStreamIn", async (target: VehicleMp) => {
    if (target.type !== "player") return;
    if (!target.getVariable("casino:freeze")) return;
    target.freezePosition(true);
});

export const inCasinoInt = () => {
    const {x,y,z} = mp.players.local.position;
    return CASINO_INTERIORS_IDS_IN.includes(mp.game.interior.getInteriorAtCoords(x, y, z))
}

let inCasinoCef = false;
setInterval(() => {
    if(!user.login) return;
    let q = inCasinoInt();
    if(q !== inCasinoCef){
        CustomEvent.triggerCef("hud:incasino", q);
        inCasinoCef = q;
    }
}, 1000)

//
import "./roulette"
import "./slots"
import "./dice"
import "./fixAnimations"
import "./walls"
import "./wheel"
import {user} from "../user";
import {CustomEvent} from "../custom.event";
import {DICE_TABLE_SETTINGS} from "../../../shared/casino/dice";