import { langStringDefault } from "../../../../shared/lang";
import {IBonus} from "./IBonus";
import {menu, MenuClass} from "../../menu";

interface CoinsBonusData {
    amount: number
}

export class CoinsBonus implements IBonus<CoinsBonusData> {
    activate(player: PlayerMp, promocodeName: string, data: CoinsBonusData): void {
        player.user.addDonateMoney(data.amount, player.user.LangString("CoinsBonus.f9a3a35459e331ddebba90f17d6ade73", promocodeName.toUpperCase()));
    }

    addItemsToCreateMenu(player: PlayerMp, _menu: MenuClass, data: CoinsBonusData, updateMenu: () => void): void {
        if (!data.amount) {
            data.amount = 0
        }

        _menu.newItem({
            name: langStringDefault("CoinsBonus.cb2c7b695bf72b057fd085b3f91024ce"),
            more: data.amount,
            onpress: async () => {
                const amount = await menu.input(player, player.user.LangString("CoinsBonus.1b03887c10b6af8562c0b1562659cc82"), 0, 7, "int");
                if (amount && !isNaN(amount)) {
                    data.amount = amount;
                }

                updateMenu();
            }
        });
    }
}