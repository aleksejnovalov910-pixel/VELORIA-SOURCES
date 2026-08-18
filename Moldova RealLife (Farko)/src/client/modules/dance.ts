import { LangString, langStringDefault } from "./lang";
import {system} from "./system"
import {user} from "./user"
import {registerHotkey} from "./controls"
import {CustomEvent} from "./custom.event"

const player = mp.players.local

let intesityCounter = 1
let animIntensity = ["li", "mi", "hi"]
let numCounter = 1
let animNum =  ["09", "11", "13", "15", "17"]
let animVersion = 1
let animPos = 1
export let dancing = false

let block = false;

async function dance(){
    bailoteo(animIntensity[intesityCounter], animNum[numCounter], animVersion, animPos);
    block = true;
    await system.sleep(500)
    block = false;
    return true;
}



function bailoteo(animIntensity: string, animNum: string, animVersion: number, animPos: number){
    let gender = user.isMale() ? "male" : "female"
    let animDict = "anim@amb@nightclub@dancers@crowddance_facedj@";
    let anim = `${animIntensity}_dance_facedj_${animNum}_v${animVersion}_${gender}^${animPos}`;
    user.playAnim([[animDict, anim]], false, true);
}


export const startDance = () => {
    dancing = !dancing;
    dance();
    // user.showHelpKeys([
    //     ["←", "Сменить вариацию"],
    //     ["↑", "Сменить стиль"],
    //     ["→", "Сменить интенсивность"],
    //     ["↓", "Сменить номер"],
    // ])
}

// Интенсивность
registerHotkey(39, () => {
    if (!dancing) return;
    if (block) return;
    if (intesityCounter < 2){
        intesityCounter++;
    } else {
        intesityCounter = 1;
    }
    dance()
    user.notify(LangString("dance.be3b4cb4089d236f2c9b5e5947f147df"), "success")
})
// Number
registerHotkey(40, () => {
    if (!dancing) return;
    if (block) return;
    if (numCounter < 4) {
        numCounter++
    } else {
        numCounter = 0;
    }
    dance()
    user.notify(LangString("dance.8a2dc10972fd9bef16adaef619ed198b"), "success")
})
// Version
registerHotkey(37, () => {
    if (!dancing) return;
    if (block) return;
    animVersion = animVersion === 1 ? 2 : 1
    dance()
    user.notify(LangString("dance.e8b841b5be3eea7bd029b7c2cdc09e57"), "success")
})
// Style
registerHotkey(38, () => {
    if (!dancing) return;
    if (block) return;
    if (animPos < 6 && animPos >= 1) {
        animPos++
    } else {
        animPos = 1 
    }
    dance()
    user.notify(LangString("dance.1771529def29deb7d1a7d63dfe5d7ff3"), "success")
})


CustomEvent.register("stopanim", () => {
    if (!dancing) return;
    // user.showHelpKeys(null)
    dancing = false
    intesityCounter = 1
    numCounter = 1
    animVersion = 1
    animPos = 1
})