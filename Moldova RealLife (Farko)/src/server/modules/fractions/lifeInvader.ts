import { langStringDefault } from "../../../shared/lang";
import {gui} from "../gui";
import {FACTION_ID} from "../../../shared/fractions";

const NEWS_COMMAND_MIN_RANK = 6;

gui.chat.registerCommand("w", (player, ...args) => {
    if (!player.user) return;

    if (player.user.fraction !== FACTION_ID.LIFEINVADER) return;
    if (player.user.rank < NEWS_COMMAND_MIN_RANK) {
        player.notify(player.user.LangString("lifeInvader.47d2d35a1131f261a34d062b31644e4e"), "error");
        return;
    }

    const message = args.join(" ");
    mp.players.toArray()
        .forEach(p => p.outputChatBox(p.user.LangString("lifeInvader.fe87cb49614a573a7bd0ba5460d26bb0", player.user.name, player.dbid, message)));
});