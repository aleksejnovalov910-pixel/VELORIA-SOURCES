import { langStringDefault } from "../../shared/lang";
import { CustomEvent } from "./custom.event";
import { system } from "./system";
import { gui } from "./gui"

CustomEvent.registerClient("debug:fpsData", (player, min: number, max: number, average: number, sum: number, length: number) => {
    const user = player.user;
    if(!user) return;
    user.log(langStringDefault("debug.stats.41bbbacb614e3ef1ff20f0bcf10482a3"), langStringDefault("debug.stats.dee09f77daff06f1d684a1be6db49b59", min, max, average, sum, length));
})

gui.chat.registerCommand("stopcef", (player) => {
    CustomEvent.triggerClient(player, "stopcef")
})