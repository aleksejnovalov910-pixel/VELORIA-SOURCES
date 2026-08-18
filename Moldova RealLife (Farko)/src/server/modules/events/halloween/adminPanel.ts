import { langStringDefault } from "../../../../shared/lang";
import {menu} from "../../menu";
import {invokeHook} from "../../../../shared/hooks";
import {gui} from "../../gui";
import {weather} from "../../weather";

export const HALLOWEEN_MANAGE_MENU_HOOK = "halloween-manage-menu";

export function openHalloweenManageMenu(player: PlayerMp) {
    const _menu = menu.new(player, player.user.LangString("adminPanel.9c386ffa0d83cc7ef5e2816972083e3b"));
    invokeHook(HALLOWEEN_MANAGE_MENU_HOOK, player, _menu, () => openHalloweenManageMenu(player));

    _menu.newItem({
        name: langStringDefault("adminPanel.12e84a01ef643d0d30e71f640add1bdf"),
        onpress: () => {
            weather.halloweenEnabled = !weather.halloweenEnabled;
            weather.setWeather(weather.halloweenEnabled ? "HALLOWEEN" : "EXTRASUNNY")
        }
    })

    _menu.open();
}

gui.chat.registerCommand("halloween", (player) => {
    if (!player.user || !player.user.isAdminNow(7)) {
        return;
    }

    openHalloweenManageMenu(player);
});
