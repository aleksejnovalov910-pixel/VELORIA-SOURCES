import { langStringDefault } from "../../../../shared/lang";
import {IBonus} from "./IBonus";
import {menu, MenuClass} from "../../menu";

interface MoneyBonusData {
    amount: number
}

export class MoneyBonus implements IBonus<MoneyBonusData> {
    activate(player: PlayerMp, promocodeName: string, data: MoneyBonusData): void {
        player.user.addMoney(data.amount, true, player.user.LangString("MoneyBonus.6fd3e74db9b529266de80061227497fc", promocodeName.toUpperCase()));
    }

    addItemsToCreateMenu(player: PlayerMp, _menu: MenuClass, data: MoneyBonusData, updateMenu: () => void): void {
        if (!data.amount) {
            data.amount = 0
        }

        _menu.newItem({
            name: langStringDefault("MoneyBonus.53f2fbe5b016ebcffcb81553ea19cc66"),
            more: data.amount,
            onpress: async () => {
                const amount = await menu.input(player, player.user.LangString("MoneyBonus.f4f308d1687046db0891200987c27119"), 0, 7, "int");
                if (amount && !isNaN(amount)) {
                    data.amount = amount;
                }

                updateMenu();
            }
        });
    }
}