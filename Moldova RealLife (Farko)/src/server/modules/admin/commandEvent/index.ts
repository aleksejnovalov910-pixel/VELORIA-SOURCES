import { langStringDefault } from "../../../../shared/lang";
import {gui} from "../../gui";
import {
    ADMIN_LEVEL_EVENT_ACCESS, COMMAND_EVENT_CHAT_COLOR,
    COMMAND_EVENT_DIMENSION,
    ICommandEventState
} from "../../../../shared/adminEvents/commandEvent/config";
import {menu, MenuClass} from "../../menu";

class CommandEvent {

    private _state: ICommandEventState = null;
    private _data: ICommandEventState = CommandEvent.getEmptyState();

    constructor() {
        gui.chat.registerCommand("aevent", this.adminCommandHandler);
        gui.chat.registerCommand("event", this.playerCommandHandler);
        mp.events.add("playerDeath", this.deathHandler);
    }

    private adminCommandHandler = (player: PlayerMp): void => {
        if (!player.user) return;
        if (!player.user.isAdminNow(ADMIN_LEVEL_EVENT_ACCESS)) return;

        this.openAdminMenu(player);
    }

    private playerCommandHandler = (player: PlayerMp): void => {
        if (!player.user) return;
        if (this._state === null)
            return player.notify(player.user.LangString("index.c443e64fc8ab8219021cc10d2ec20a3e"), "error");

        if (!this._state.teleportActive)
            return player.notify(player.user.LangString("index.3fb744e89a37d0372b07d4f2124b7ef0"), "error");

        if (this._state.players.length >= this._state.maxPlayers)
            return player.notify(player.user.LangString("index.bfa8e31ba06b87e6e0ef6d6f25033228"), "error");

        if (
            this._state.players.find(el => el === player.user.id) !== undefined
            &&
            player.dimension === COMMAND_EVENT_DIMENSION
        )
            return player.notify(player.user.LangString("index.27a136299a5844d64cea5299b8f41975"), "error");

        if (this._state.players.find(el => el === player.user.id) === undefined)
            this._state.players.push(player.user.id);

        const randomX = Math.floor(Math.random() * 10 - 5),
            randomY = Math.floor(Math.random() * 10 - 5);

        player.user.teleport(
            this._state.spawnPosition.x + randomX,
            this._state.spawnPosition.y + randomY,
            this._state.spawnPosition.z + 0.5,
            180,
            COMMAND_EVENT_DIMENSION
        );

        player.notify(player.user.LangString("index.927a1e0dbc90a800ace39caad7143aff"), "success");
    }

    private static getEmptyState(): ICommandEventState {
        return {
            name: "",
            spawnPosition: new mp.Vector3(0, 0, 0),
            returnPosition: new mp.Vector3(0, 0, 0),
            maxPlayers: 50
        }
    }

    private openAdminMenu(player: PlayerMp): void {
        const _menu = new MenuClass(player, player.user.LangString("index.3cdb5035b4ffe26d74abb8b3e60d235f"));

        if (this._state === null) {
            _menu.newItem({
                name: langStringDefault("index.729e7ab67311ae19751ea0f82f0d9b34"),
                more: this._data.name !== "" ? this._data.name : langStringDefault("index.ad3f3e1444183edb02c9b2020865f9a6"),
                onpress: async () => {
                    const name = await menu.input(player, player.user.LangString("index.191a874b413be4a11e9b1a98163554d5"), this._data.name, 150, "text");
                    if (name) this._data.name = name;

                    this.openAdminMenu(player);
                }
            });

            _menu.newItem({
                type: "range",
                name: langStringDefault("index.0a5e880f9a130b8fa18ab818d999bef8"),
                more: this._data.maxPlayers,
                rangeselect: [1, 1500],
                onchange: (value) => {
                    this._data.maxPlayers = value;
                }
            });

            _menu.newItem({
                name: langStringDefault("index.7860e58700dfba2774d861faa02fd7b7"),
                more: this._data.spawnPosition.x !== 0 ? langStringDefault("index.18b0a37f468a77a52d33ab86de347585") : langStringDefault("index.954a887896133a20ce2c126c1b7cbcb8"),
                onpress: () => {
                    if (this._data.spawnPosition.x !== 0) {
                        this._data.spawnPosition = new mp.Vector3(0, 0, 0)
                    } else {
                        this._data.spawnPosition = player.position;
                    }

                    this.openAdminMenu(player);
                }
            })

            _menu.newItem({
                name: langStringDefault("index.50115285d3b07690975f633fca72a37c"),
                more: this._data.returnPosition.x !== 0 ? langStringDefault("index.3cca21d95c13e4af2b465c79a7fd4db4") : langStringDefault("index.5b7b7eeea9ab1cd2b183ddca86b38ad8"),
                onpress: () => {
                    if (this._data.returnPosition.x !== 0) {
                        this._data.returnPosition = new mp.Vector3(0, 0, 0)
                    } else {
                        this._data.returnPosition = player.position;
                    }

                    this.openAdminMenu(player);
                }
            })

            _menu.newItem({
                name: langStringDefault("index.2927d354246c03fd37dd5257aef2b727"),
                onpress: async () => {
                    if (this._data.name === "")
                        return player.notify(player.user.LangString("index.95710307f3afd8b515c05b82ef17e113"), "error");

                    if (this._data.spawnPosition.x === 0)
                        return player.notify(player.user.LangString("index.c5a2c5d7d44c829e1bc1121cf8642cce"), "error");

                    if (this._data.returnPosition.x === 0)
                        return player.notify(player.user.LangString("index.5c44c1948eef7d12ced12ce0694c5687"), "error");

                    const state = {...this._data};
                    state.teleportActive = true;
                    state.players = [];
                    state.adminName = player.user.name;
                    this._data = CommandEvent.getEmptyState();

                    const validPlayers = mp.players.toArray().filter(p => !!p.user);

                    validPlayers.forEach(p => {
                        p.outputChatBox(
                            p.user.LangString("index.6cef3e92cca5ef664ff26c0097ec7ed9", COMMAND_EVENT_CHAT_COLOR, state.adminName, state.name)
                        );
                    })

                    this._state = state
                    _menu.close();
                    player.notify(player.user.LangString("index.6740ef4bc49ee3b29a9efcf2fcf40fbf"), "success");
                }
            });

            _menu.newItem({
                name: langStringDefault("index.9aa7a685fda2f37534a4f5017acb54a8"),
                onpress: async () => {
                    this._data = CommandEvent.getEmptyState();
                    this.openAdminMenu(player);
                }
            });
        } else {
            _menu.newItem({
                name: langStringDefault("index.755562406fa92f6de0ca5606635c8515", this._state.name, this._state.adminName)
            });

            _menu.newItem({
                name: langStringDefault("index.cece89941d6112c39df65031cca156c3"),
                more: `${mp.players.toArray().filter(target => target.user && target.dimension === COMMAND_EVENT_DIMENSION).length}`
            });

            _menu.newItem({
                name: this._state.teleportActive ? langStringDefault("index.7316e7628bba6115feaa653786b5a0cc") : langStringDefault("index.8b2c922e4a7627e872d703b5f273d472"),
                onpress: async () => {
                    this._state.teleportActive = !this._state.teleportActive;
                    this.openAdminMenu(player);

                    const validPlayers = mp.players.toArray().filter(p => !!p.user);

                    validPlayers.forEach(p => {
                        if (this._state.teleportActive) {
                            p.outputChatBox(
                                p.user.LangString("index.a1cbdb3885327fac702e8c183d44a564", COMMAND_EVENT_CHAT_COLOR)
                            );
                        } else {
                            p.outputChatBox(
                                p.user.LangString("index.6317a8ce9c579643c390f566934e3e26", COMMAND_EVENT_CHAT_COLOR)
                            );
                        }
                    })
                }
            });

            _menu.newItem({
                name: langStringDefault("index.ade5e521025d1707ecd5135575c3303d"),
                onpress: async () => {
                    const pos = new mp.Vector3(
                        this._state.returnPosition.x,
                        this._state.returnPosition.y,
                        this._state.returnPosition.z
                    );

                    this._state = null;

                    const players = mp.players.toArray().filter(target => player.user &&
                        target.dimension === COMMAND_EVENT_DIMENSION)

                    players.forEach(target => {
                        const randomX = Math.floor(Math.random() * 10 - 5),
                            randomY = Math.floor(Math.random() * 10 - 5);

                        target.user.spawn(new mp.Vector3(pos.x + randomX, pos.y + randomY, pos.z + 0.5));
                        target.dimension = 0;
                    });


                    player.notify(player.user.LangString("index.16a9b1999b8ea35dfc0a53cad127b446"), "success");
                    _menu.close();
                }
            });
        }

        _menu.open();
    }

    private deathHandler = (player: PlayerMp) => {
        if (this._state === null) return;
        if (!player.user || player.dimension !== COMMAND_EVENT_DIMENSION) return;
        //if (this._state.players.find(id => player.user.id === id) === undefined)

        player.user.spawn(this._state.returnPosition);
        player.dimension = 0;

    }
}

export const commandEvent = new CommandEvent();

// Написано под хард рок / металлику