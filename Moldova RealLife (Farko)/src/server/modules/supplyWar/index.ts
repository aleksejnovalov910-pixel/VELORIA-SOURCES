import { langStringDefault } from "../../../shared/lang";
import {gui} from "../gui";
import {menu, MenuClass} from "../menu";
import {ISupplyWarItem, ISupplyWarCreate} from "../../../shared/supplyWar/config";
import {SupplyWar} from "./supplyWar";

let war: SupplyWar | null = null;

function openSupplyWarMenu(player: PlayerMp, item: ISupplyWarCreate) {
    const _menu = new MenuClass(player, player.user.LangString("index.1bdb5c8f17674743e5a93d232637817d"));

    if (war === null) {

        _menu.newItem({
            type: "range",
            name: langStringDefault("index.2e81ab758fe1aec996be37eddd0e4e6f"),
            rangeselect: [1, 100],
            listSelected: item.maxVehiclesLoad,
            onchange: (value) => {
                item.maxVehiclesLoad = value;
            }
        });

        _menu.newItem({
            name: langStringDefault("index.3dc167ac7d28a0de40f20bafda010f05"),
            more: item.items ? item.items : langStringDefault("index.d6bdc5b9a845fc51ec027a4496d85d18"),
            onpress: async () => {
                const newItems = await menu.input(player, player.user.LangString("index.4dfcfcdc05e94a0e92255b2f3bb313d3"), item.items, 150, "text");
                if (newItems) {
                    item.items = newItems;
                }

                openSupplyWarMenu(player, item);
            }
        });

        _menu.newItem({
            name: langStringDefault("index.448f4d245dff718e017aececde3d8e20"),
            more: item.position && item.position.x ? langStringDefault("index.08a9e026b87ea16c42169651ad33f816") : langStringDefault("index.79f0f6a47285957fbf2b0108cd3123e6"),
            onpress: () => {
                if (item.position && item.position.x !== 0) {
                    item.position = new mp.Vector3(0, 0, 0)
                } else {
                    item.position = player.position;
                }

                openSupplyWarMenu(player, item);
            }
        })

        _menu.newItem({
            name: langStringDefault("index.d7ad2bfc8fd192f261d055db42a2643a"),
            onpress: async () => {
                if (!item.maxVehiclesLoad || !item.items || !item.position || item.position.x === 0) {
                    player.notify(player.user.LangString("index.05719677c88477d610fd383c1f0479e6"));
                    openSupplyWarMenu(player, item);
                    return;
                }


                try {
                    const splitItems = item.items.split(","),
                        items: ISupplyWarItem[] = []

                    splitItems.forEach(el => {
                        const split = el.split(":");

                        if (!split[0] || !split[1]) return;

                        items.push({
                            itemId: parseInt(split[0]),
                            count: parseInt(split[1])
                        })
                    })

                    war = new SupplyWar(item.position, item.maxVehiclesLoad, items);
                    player.notify(player.user.LangString("index.11f8267b885d3c302a5e23c994404ae0"), "success");
                }
                catch (e) {
                    player.notify(player.user.LangString("index.5e4e3e5344e6408bb4e1b5d38138dcb9"), "error");
                    console.log(langStringDefault("index.81aa34785a78779cc1c7913521325b93", player.user.id, e));
                }

                _menu.close();
            }
        })
    } else {
        _menu.newItem({
            name: langStringDefault("index.e1fdd66f1b1767050bb7cd96e02c17cc"),
            onpress: async () => {
                if (!war) return player.notify(player.user.LangString("index.7b23c0c70827d5abf1c216ab5f3d9c54"), "error");
                war.destroy();
                war = null;
                _menu.close();
                player.notify(player.user.LangString("index.83d3b651c95f629c12e63fb58453be2c"), "success");
            }
        })
    }

    _menu.open();
}

gui.chat.registerCommand("supplywar", (player) => {
    if (!player.user.isAdminNow(6)) return;

    const item: ISupplyWarCreate = {
        maxVehiclesLoad: 2
    }

    openSupplyWarMenu(player, item)
});