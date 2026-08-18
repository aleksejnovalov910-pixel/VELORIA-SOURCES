import { langStringDefault } from "../../../shared/lang";
import {menu, MenuClass} from "../menu";
import {promocodeBonuses} from "./bonuses";
import {BonusData, promocodes1x} from "./index";
import {system} from "../system";
import {writeSpecialLog} from "../specialLogs";

export function openPromocodesAdminMenu(player: PlayerMp) {
    const _menu = new MenuClass(player, player.user.LangString("adminMenu.c3cba3ff3c2b6df5bf074981e26e5051"));

    _menu.newItem({
        name: langStringDefault("adminMenu.41ab03207ad7cdc36db8a317d78128b0"),
        onpress: () => {
            openCreatePromocodeMenu(player);
        }
    });

    promocodes1x.getAll().forEach(promocode => {
        _menu.newItem({
            name: (promocode.expiredAt > system.timestamp ? "~g~" : "~r~") + promocode.name,
            desc: langStringDefault("adminMenu.23d74510331fde9626c38df60065c9a4"),
            onpress: async () => {
                const isConfirmed = await menu.accept(player, player.user.LangString("adminMenu.d07141d07b510d60b9da268c9cf1f96c", promocode.name))
                if (isConfirmed) {
                    promocodes1x.delete(promocode.id);
                }

                openPromocodesAdminMenu(player);
            }
        });
    });

    _menu.open();
}

function openCreatePromocodeMenu(player: PlayerMp, name?: string, hours: number = 1, bonuses: BonusData[] = []) {
    const _menu = new MenuClass(player, player.user.LangString("adminMenu.62e4560120d02c0157a8a4cd6e925063"));

    _menu.newItem({
        name: langStringDefault("adminMenu.8f4063cb5da48b08ba31278c7ab83b2c"),
        more: name ? name : langStringDefault("adminMenu.37f699d6cda0b1394f58de5cc71d91f6"),
        onpress: async () => {
            const newName = await menu.input(player, player.user.LangString("adminMenu.38121500b01eb391c6ea1df57c3cd82c"), name, 15, "text");
            if (newName) {
                name = newName;
            }

            openCreatePromocodeMenu(player, name, hours, bonuses);
        }
    });

    _menu.newItem({
        type: "range",
        name: langStringDefault("adminMenu.34a22560f4e85acda5cc8368d661468b"),
        rangeselect: [1, 999],
        listSelected: hours,
        onchange: (value) => {
            hours = value;
        }
    });

    _menu.newItem({
        name: langStringDefault("adminMenu.c680b515cb68b52afebeb68979b3e74f"),
        onpress: () => {
            openBonusListMenu(player, bonuses, () => {
                openCreatePromocodeMenu(player, name, hours, bonuses);
            })
        }
    });

    _menu.newItem({
        name: langStringDefault("adminMenu.de21ca40e209d97a5d14fe69ba6b5350"),
        onpress: async () => {
            _menu.close();

            const error = await promocodes1x.create(name, hours, bonuses);

            writeSpecialLog(langStringDefault("adminMenu.0cd72a29c1201d80d43ee7ccf72a0697", name), player, 0);

            if (error) {
                player.notify(error, "error");
                openCreatePromocodeMenu(player, name, hours, bonuses);
                return;
            }

            openPromocodesAdminMenu(player);
        }
    });

    _menu.open();
}

function openBonusListMenu(player: PlayerMp, bonuses: BonusData[], onClose: () => void) {
    const _menu = new MenuClass(player, player.user.LangString("adminMenu.7e09467b044a8ffaed9945fffa8c0ebc"));
    _menu.onclose = onClose;

    _menu.newItem({
        name: langStringDefault("adminMenu.8bbd4f28cd2f2f06a80e5fb5bbfd4326"),
        onpress: () => {
            openCreateBonusMenu(player,
                (bonus) => {
                    bonuses.push(bonus)
                },
                () => {
                    openBonusListMenu(player, bonuses, onClose);
                }
            );
        }
    });

    bonuses.forEach((bonus, index) => {
        _menu.newItem({
            name: promocodeBonuses.types.find(element => element.type === bonus.type).name,
            desc: langStringDefault("adminMenu.563e089311c7caaa2d68883374567cfb"),
            onpress: () => {
                bonuses.splice(index, 1);
                openBonusListMenu(player, bonuses, onClose);
            }
        })
    });

    _menu.open();
}

function openCreateBonusMenu(
    player: PlayerMp,
    addBonus: (bonus: BonusData) => void,
    onClose: () => void,
    selectedType: number = 0,
    data: any = { }
) {
    const _menu = new MenuClass(player, player.user.LangString("adminMenu.f64270cc488a017167396344754ba5a9"));
    _menu.onclose = onClose;

    _menu.newItem({
        type: "list",
        name: langStringDefault("adminMenu.9576f3128ef7338cb29d3fd657d1213d"),
        list: promocodeBonuses.types.map(element => element.name),
        listSelected: selectedType,
        onchange: (value) => {
            openCreateBonusMenu(player, addBonus, onClose, value);
        }
    });

    const bonus = promocodeBonuses.types[selectedType].bonus;
    bonus.addItemsToCreateMenu(player, _menu, data, () => {
        openCreateBonusMenu(player, addBonus, onClose, selectedType, data);
    });

    _menu.newItem({
        name: langStringDefault("adminMenu.d297f8a7b0bcd495b4d97389d18a5c71"),
        onpress: () => {
            addBonus({ type: promocodeBonuses.types[selectedType].type, data });
            onClose();
        }
    });

    _menu.open();
}