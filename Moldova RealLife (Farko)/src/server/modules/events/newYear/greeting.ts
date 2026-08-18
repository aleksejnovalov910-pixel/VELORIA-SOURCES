import { langStringDefault } from "../../../../shared/lang";
import {User} from "../../user";
import {GREETING_COLOR} from "../../../../shared/events/newYear/main.config";

export function greeting() {
    mp.events.add("_userLoggedIn", (user: User) => {
        const player = user.player,
            date = new Date();

        if (date.getMonth() === 11) {
            if (date.getDate() === 31) {
                player.outputChatBox(player.user.LangString("greeting.aa5b266c1158842dccaa515171ab0cb9", GREETING_COLOR, date.getFullYear() + 1));
            }else{
                player.outputChatBox(player.user.LangString("greeting.fdbda2b8c9dc1a21973652558ed84b26", GREETING_COLOR, date.getFullYear() + 1));
            }
        }

        if (date.getMonth() === 0) {
            player.outputChatBox(player.user.LangString("greeting.4ed4420eb02ca60592d29c6dcb9711f6", GREETING_COLOR, date.getFullYear()));
        }
    });
}