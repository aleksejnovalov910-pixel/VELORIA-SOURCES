import { langStringDefault } from "../../../../shared/lang";
import {gui} from "../../gui";
import {menu} from "../../menu";
import {Presents} from "./presents";


export function adminPanel (Presents: Presents) {
    gui.chat.registerCommand("newyear", (player) => {
        if (!player.user || !player.user.isAdminNow(6)) return;

        const _menu = menu.new(player, player.user.LangString("adminPanel.2d59fcb1e27cd2aa69cd30946d46cfd4"));

        _menu.newItem({
            name: langStringDefault("adminPanel.cd789939fc885c6c46c4fe978f204b25"),
            more: `${Presents.active ? langStringDefault("adminPanel.3821dfa38c1d1404699e2ffa426d1de2") : langStringDefault("adminPanel.adc7fa9951f870c084941db3a45585ab")}`,
            onpress: () => {
                Presents.switcher(player);
            }
        })

        _menu.open();
    });
}
