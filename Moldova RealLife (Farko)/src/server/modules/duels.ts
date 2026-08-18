import { langStringDefault } from "../../shared/lang";
import {DUELS_FIGHT_POS, DUELS_REGISTER_POS, DUELS_TABLE_DATA, DUELS_WEAPON} from "../../shared/duels";
import {ScaleformTextMp} from "./scaleform.mp";
import {DuelRatingEntity} from "./typeorm/entities/duel";
import {system} from "./system";
import {colshapes} from "./checkpoints";
import {menu} from "./menu";
import {inventoryShared} from "../../shared/inventory";
import {User} from "./user";
import {DeathMath} from "./deadmatch";
import {getAchievConfigByType} from "../../shared/achievements";
import {DEATHMATH_LIMIT_BET_MAX} from "../../shared/gungame";

/** Имена оружий */
const weaponNames: string[] = []
DUELS_WEAPON.map(weapon => {
    weaponNames.push(inventoryShared.getWeaponNameByHash(weapon) || weapon);
})

/** Табличка с рейтингом */
const table = new ScaleformTextMp(DUELS_TABLE_DATA[0], "", {
    dimension: 0,
    type: 'board',
    rotation: new mp.Vector3(0, 0, DUELS_TABLE_DATA[1]),
    range: 40
});


colshapes.new(DUELS_REGISTER_POS, player => player?.user?.LangString("duels.81bf84ce79d6b74cf63c85f0cd9d042c") ?? langStringDefault("duels.81bf84ce79d6b74cf63c85f0cd9d042c"), player => {
    duels.menu(player);
}, {
    radius: 2
})

interface LobbyItem {
    /** ID лобби */
    id: number,
    /** Пароль */
    password: string,
    /** ID владельца лобби */
    owner: number,
    /** ID второго участника */
    target?: number,
    /** Индикатор статуса того, что лобби запущено */
    started: boolean,
    /** Индикатор статуса того, что лобби завершено */
    ended: boolean,
    /** Выбранное оружие */
    weapon: string,
    /** Сумма ставки */
    money?: number
}

let lobbyId = 0;
export const duels = {
    getLobbyByUser: (player: PlayerMp | number) => {
        let id = typeof player === "number" ? player : player.dbid
        return duels.lobbys.find(q => q.owner === id || q.target === id)
    },
    getLobbyById: (id: number) => {
        return duels.lobbys.find(q => q.id === id)
    },
    getLobbyArrayIndex: (item: LobbyItem) => {
        return duels.lobbys.findIndex(q => q.id === item.id);
    },
    removeLobbyById: (id: number) => {
        let lobby = duels.getLobbyById(id)
        let index = duels.getLobbyArrayIndex(lobby);
        if(index == -1) return;
        duels.lobbys.splice(index, 1);
    },
    lobbys: <LobbyItem[]>[],
    menu: (player: PlayerMp) => {
        const user = player.user;
        if(!user) return;
        const m = menu.new(player, "", player.user.LangString("duels.3ea4737217b88fe97b63d126d53843d6"));
        m.sprite = "duels";
        const lobby = duels.getLobbyByUser(player);
        if (lobby) {
            m.newItem({
                name: player.user.LangString("duels.a10a865f6d055cd2e8226b2f06eb147c"),
                more: `ID: ${lobby.id}`,
                onpress: () => {
                    m.close();
                    menu.accept(player, player.user.LangString("duels.a0557a4bd21969d921d65d8ae69f2e7f")).then(status => {
                        if (!status) return;
                        if (!lobby) return;
                        if (lobby.started) return;
                        let index = duels.getLobbyArrayIndex(lobby);
                        if (index > -1) {
                            if (lobby.money) {
                                user.addMoney(lobby.money, true, user.LangString("duels.1d76022535ef760beac610556e999436"));
                            }
                            duels.lobbys.splice(index, 1);
                            duels.menu(player);
                        }
                    })
                }
            })
        } else {
            m.newItem({
                name: player.user.LangString("duels.b0451f3571890321d59656c12e46eacb"),
                onpress: () => {
                    if(user.attachedToPlace) return player.notify(player.user.LangString("duels.4decd3afebe029bfa732e6377e8a53f3"), 'error');
                    let sum = 0;
                    let pass: string;
                    let weapon = system.randomArrayElement(DUELS_WEAPON)
                    const createLobby = () => {
                        const submenu = menu.new(player, "", player.user.LangString("duels.8e6f4450e5aee6f1691347cbbf0be540"));
                        submenu.sprite = "duels";
                        submenu.onclose = () => { duels.menu(player) }

                        submenu.newItem({
                            name: player.user.LangString("duels.fc0fb0f9632ace1d54ef09d7f7def1fd"),
                            more: pass ? player.user.LangString("duels.dac98bf51c0ffb8eb83874eca86ee4c5") : player.user.LangString("duels.1d14b02731a747d99d2ac097d11e41ef"),
                            desc: player.user.LangString("duels.0705609d2f19ea7943ca204db805f566"),
                            onpress: () => {
                                menu.input(player, player.user.LangString("duels.b4b00f64e1518d3cce0765a89162eddf"), "", 6, 'password').then(passwd => {
                                    if (typeof passwd !== "string") return;
                                    pass = passwd;
                                    createLobby();
                                })
                            }
                        })

                        submenu.newItem({
                            name: player.user.LangString("duels.24cff84508a99f7785d60c7dc9409ba1"),
                            more: sum ? `$${system.numberFormat(sum)}` : player.user.LangString("duels.16fdd6cd9e758e0c1fbb0572461de017"),
                            onpress: () => {
                                menu.input(player, player.user.LangString("duels.87204c70ef42374a45ed69625c4d08f3"), sum, 6, 'int').then(cost => {
                                    if (typeof cost !== "number") return;
                                    if(cost < 0 || cost > DEATHMATH_LIMIT_BET_MAX) return player.notify(player.user.LangString("duels.899cc23c750c4af42b805ef7c6053470"), 'error');
                                    sum = cost;
                                    createLobby();
                                })
                            }
                        })

                        submenu.newItem({
                            name: player.user.LangString("duels.5192aff9398b9a7525042cff65a9fdc6"),
                            more: inventoryShared.getWeaponNameByHash(weapon),
                            onpress: () => {
                                menu.selector(player, player.user.LangString("duels.b688efd2c0b56a313b6fb40f2f80ddf1"), weaponNames, true, null, false, weaponNames.findIndex(q => q === (inventoryShared.getWeaponNameByHash(weapon) || weapon))).then(select => {
                                    if(typeof select !== "number" || select < 0 || select > 9999) return createLobby();
                                    weapon = DUELS_WEAPON[select];
                                    createLobby();
                                })
                            }
                        })


                        submenu.newItem({
                            name: player.user.LangString("duels.4a679d8e861f049d1ea4193803d63a51"),
                            onpress: () => {
                                if (user.attachedToPlace) return submenu.close(), player.notify(player.user.LangString("duels.6a29c3cc0111948b474ceebdb0759f61"), "error");
                                lobbyId++;
                                if (sum) {
                                    if (user.money < sum) return player.notify(player.user.LangString("duels.3206e65c4e0429dfcd93ec154c19dbfb"), "error");
                                    user.removeMoney(sum, true, user.LangString("duels.4937ef7108fdfb10922ec87701242814"));
                                }
                                duels.lobbys.push({ id: parseInt(`${lobbyId}`), owner: player.dbid, money: sum, started: false, ended: false, password: pass, weapon })
                                player.notify(player.user.LangString("duels.31d60d88d0f392ba064a27c7ff43d9e7"), "success");
                                duels.menu(player);
                            }
                        })

                        submenu.open()
                    }
                    createLobby();
                }
            })

            duels.lobbys.map(item => {
                if(item.started) return;
                if(item.ended) return;
                m.newItem({
                    name: `Lobby #${item.id}`,
                    more: item.money ? `$${system.numberFormat(item.money)}` : player.user.LangString("duels.0284f8023f71ae0c4fe25e61b09fea9a"),
                    desc: player.user.LangString("duels.43ba34da0563139209dd28dfa66070b1", item.password ? player.user.LangString("duels.d1eec286f5739d0d5efe7d8f2f5c85b7") : player.user.LangString("duels.67ea518a98b7e26674c1e1043025a056"), inventoryShared.getWeaponNameByHash(item.weapon) || item.weapon),
                    onpress: async () => {
                        m.close();
                        if (user.attachedToPlace) return player.notify(player.user.LangString("duels.543d05a27497f1e7cafe7e208b2ec6e0"), "error");
                        let access = item.password ? (await menu.input(player, player.user.LangString("duels.1d664f2d5fda0242234710d455ae9f98"), "", 6, 'password')) == item.password : true;
                        if (!access) return player.notify(player.user.LangString("duels.73c9c4202e6ece10034d0dbd9d383a6d"), "error")
                        let lobby = duels.getLobbyById(item.id);
                        if(!lobby) return player.notify(player.user.LangString("duels.85b3a1e073c2d9d629ea923b7e08539a"), 'error'), duels.menu(player);
                        if(lobby.started) return player.notify(player.user.LangString("duels.7b166405f3a8a46286551d556131804e"), 'error'), duels.menu(player);
                        const owner = User.get(lobby.owner);
                        if(!owner){
                            player.notify(player.user.LangString("duels.500e442f918b290528e48fbe277add09"), "error");
                            duels.removeLobbyById(item.id);
                            duels.menu(player);
                            return;
                        }
                        if(system.distanceToPos(DUELS_REGISTER_POS, owner.position) > 10 || owner.dimension){
                            player.notify(player.user.LangString("duels.357d42c486fcfbec7c09e3ac54a4795e"), "error");
                            owner.notify(owner.user.LangString("duels.87f5de1c3a3e2e19604a87413f562bfb"), "error");
                            duels.removeLobbyById(item.id);
                            duels.menu(player);
                            return;
                        }
                        if(lobby.money){
                            if(user.money < lobby.money) return player.notify(player.user.LangString("duels.d97402bbd0423d11650f6950f749be0a"), "error");
                            user.removeMoney(lobby.money, true, user.LangString("duels.cffc96c60066279e79da9643e44b36d4"));
                        }
                        lobby.target = player.dbid;
                        lobby.started = true;


                        let pos = system.randomArrayElement(DUELS_FIGHT_POS)
                        const middle = system.middlePoint3d(pos.pos1, pos.pos2);
                        const dm = new DeathMath(new mp.Vector3(middle.x, middle.y, middle.z), system.distanceToPos(pos.pos1, pos.pos2) * 1.2)

                        dm.armour = 100;
                        dm.team1_start = {x: pos.pos1.x, y: pos.pos1.y, z: pos.pos1.z + 1, h: pos.heading1, r: 1}
                        dm.team2_start = {x: pos.pos2.x, y: pos.pos2.y, z: pos.pos2.z + 1, h: pos.heading2, r: 1}

                        dm.name = langStringDefault("duels.f1cda681becdd664029289764dc86681")

                        dm.team1_name = owner.user.name
                        dm.team2_name = player.user.name

                        dm.insertPlayer(owner, 1)
                        dm.insertPlayer(player, 2)

                        dm.weapon = lobby.weapon;
                        dm.ammo = 240;

                        dm.time = 180;

                        dm.wait = 5;

                        dm.start()

                        dm.handler(winnerindex => {
                            item.ended = true
                            const winner = winnerindex === 1 ? owner : player;
                            const looser = winnerindex === 2 ? owner : player;

                            if(mp.players.exists(winner)){
                                if (!item.password) duels.writeWin(winner);
                                if (item.money) {
                                    winner.user.addMoney(item.money * 1.9, true, winner.user.LangString("duels.4852f806d566605732118238231e5f3a", mp.players.exists(looser) ? winner.user.LangString("duels.43fe00473a939e5c14f57986e782059f", looser.dbid) : ''));
                                }
                                winner.user.achiev.achievTickByType("duelCount")
                            }

                            if(mp.players.exists(looser) && !item.password) duels.writeDefeate(looser);

                            let index = duels.getLobbyArrayIndex(item);
                            if (index > -1) duels.lobbys.splice(index, 1);

                        })

                    }
                })
            })
        }
        let myRating = duels.getUserRating(user.id);
        let ratingPos = myRating ? duels.rating.findIndex(q => q.id === myRating.id) : -1
        m.newItem({
            name: langStringDefault("duels.cfa550bbb630399c2540ef6c5beece20"),
            more: myRating ? langStringDefault("duels.2a29c8caa0fbebed25c6dacdc5765274", ratingPos + 1) : langStringDefault("duels.ff5e424545bb876e354ea41e1408e336"),
            desc: myRating ? langStringDefault("duels.6d2069401c9a63f0b0eda88ca3ef175a", myRating.wins, myRating.defeates) : ``
        })
        m.open();
    },
    rating: <DuelRatingEntity[]>[],
    getUserRating: (user_id: number) => {
        return duels.rating.find(q => q.userId == user_id)
    },
    loadAll: () => {
        return duels.loadRatings();
    },
    loadRatings: () => {
        console.time('Der Download der Duellbewertung ist abgeschlossen. Download-Zeit')
        return DuelRatingEntity.find().then(data => {
            duels.rating = data;
            updateTable();
            system.debug.info(langStringDefault("duels.273b52e4360c7a4829be2377ae82ac37", data.length));
            console.timeEnd('Der Download der Duellbewertung ist abgeschlossen. Download-Zeit')
        })
    },
    writeWin: (player: PlayerMp) => {
        duels.writeData(player, true)
    },
    writeDefeate: (player: PlayerMp) => {
        duels.writeData(player, false)
    },
    writeData: (player: PlayerMp, win: boolean) => {
        if (!mp.players.exists(player)) return;
        let item = duels.getUserRating(player.dbid);
        const have = !!item;
        if (!item){
            item = new DuelRatingEntity();
            item.userId = player.user.id;
            item.wins = 0;
            item.defeates = 0;
        }
        if (win) item.wins++;
        else item.defeates++;
        item.name = player.user.name
        item.save().then((r) => {
            if (!have) duels.rating.push(r);
            updateTable();
        })
    },
}

let updateTableStatus = false;
const updateTable = () => {
    if (updateTableStatus) return;
    updateTableStatus = true;
    setTimeout(() => {
        duels.rating.sort((a, b) => {
            return b.wins - a.wins
        });
        let data = [...duels.rating].slice(0, 3);

        let ratingText = data.length > 0 ? data.map((q, i) => `${(i+1)}) ${q.name}: ${q.wins}`).join('\n') : langStringDefault("duels.317e76a6c2c7838a6fc3fa505992bf1a");
        let text = langStringDefault("duels.05941a6ac64603dc61e90cee077b6790", ratingText);
        if (text != table.text) table.text = text, system.debug.debug(langStringDefault("duels.8cb7521bbc4626a70bd0657b3cd118e7", text));
        updateTableStatus = false;
    }, 2000)
}