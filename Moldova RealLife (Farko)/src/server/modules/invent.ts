import { langStringDefault } from "../../shared/lang";
import {colshapeHandle, colshapes} from "./checkpoints";
import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {menu} from "./menu";
import {EVENT_ANNOUNCE_COST, EVENT_ANNOUNCE_MINUTE} from "../../shared/economy";
import {fight} from "./fight";
import {BoxGameCreateAndRun} from './boxgame';
import {clearGangZone} from "./gangwar";
import {eventsList} from "../../shared/events";
import {generateRace} from "./race";
import {CargoBattleFamilyQuest} from "./families/quests/cargobattle";
import {GRAB_POS_LIST} from "../../shared/grab.zone";
import {adminGrabEnable, runAdminGrab} from "./grab.zone";
import {GANGFIGHT_POS} from "../../shared/gangfight";
import {gangfight} from "./gangfight";


CustomEvent.register('newHour', (hour) => {
    console.log("disabled Events succesfully")
    // setTimeout(() => {
    //     if(eventsList.RACE.includes(hour)) generateRace();
    //     if(eventsList.BOX.includes(hour)) {
    //         setTimeout(() => {
    //             return BoxGameCreateAndRun()
    //         }, system.getRandomInt(1, 9) * 60000)
    //     }
    //     if(eventsList.FAMILY_CONTAINER.includes(hour)) {
    //         setTimeout(() => {
    //             new CargoBattleFamilyQuest().startReady(true).then(res => {
    //                 system.debug.info(langStringDefault("invent.438c95ff0b21951b49ec3927d3111ed2"))
    //             }).catch(error => {
    //                 system.debug.error(langStringDefault("invent.e588834baf258a958c9a803db7a7cfc2"))
    //                 system.debug.error(error)
    //             })
    //         }, 30 * 60000)
    //     }
    // }, 60000)
})

export class IventClass {
    id: number;
    type: "pos" | "tp" | "gps";
    name: string;
    colshape: colshapeHandle;
    world: number;
    pos: { x: number; y: number; z: number; h: number };
    closed = false
    endTime: number;
    createTime: number;
    author: string;
    posWorld: { x: number; y: number; z: number; h: number; };
    constructor(
        /** Тип */
        type: "pos" | "tp" | "gps",
        /** Название */
        name: string,
        /** Сколько минут будет существовать */
        minutesToClose: number,
        /** Автор */
        author: string,
        /** Местоположение в мире, если тип не tp */
        pos: { x: number, y: number, z: number, h: number },
        /** Точка телепортации в виртуальный мир, если тип pos или tp */
        posWorld: { x: number, y: number, z: number, h: number },
        /** Закрыто по умолчанию, чтобы допустим заранее на анонсировать. Пока закрыто - отображатся нигде не будет */
        closed: boolean = false
        ) {
        this.id = IventClass.ids++
        this.type = type
        this.name = name
        this.author = author
        this.endTime = system.timestamp + (minutesToClose * 60)
        this.createTime = system.timestamp
        this.pos = pos
        this.posWorld = posWorld
        this.closed = closed
        this.world = system.personalDimension
        if (type === "pos" && this.pos) {
            this.colshape = colshapes.new(new mp.Vector3(this.pos.x, this.pos.y, this.pos.z - 1), name, player => {
                if (player.user.attachedToPlace) return player.notify(player.user.LangString("invent.f6e6db5ba7a6e2148a6ff3115b1db1f0"), "error")
                this.enterWorld(player)
            }, {
                dimension: 0,
            })
        }
        if(!this.closed) this.notify()

        IventClass.pool.push(this)
    }

    notify(){
        if(!this.exist) return;
        mp.players.toArray()
            .filter(target => target.user)
            .forEach(target => {
                const targetPlayer = target;

                const notifyText = this.type === 'tp'
                    ? langStringDefault("invent.3838361e282c22f4163bf38d71484fa5")
                    : langStringDefault("invent.516bc0e0f7890bc217025726d1330798") ;

                menu.accept(targetPlayer, langStringDefault("invent.fcfba761df74329dfa364291163eb488", this.name, this.author, notifyText), 'small', 20000)
                    .then((isAgreed) => {
                        if (!isAgreed || !mp.players.exists(targetPlayer)) {
                            return;
                        }

                        if (this.type === 'tp') {
                            if (targetPlayer.user.attachedToPlace) {
                                return targetPlayer.notify(targetPlayer.user.LangString("invent.7c7386c9e4fe40dd64583cbfd3427a09"), "error")
                            }

                            this.enterWorld(targetPlayer);
                        } else {
                            targetPlayer.user.setWaypoint(this.pos.x, this.pos.y);
                        }
                    });
        })
    }

    get exist(){
        if (this.closed) return false;
        if (this.endTime < system.timestamp) return false;

        return true;
    }

    get players(){
        return mp.players.toArray().filter(target => target.user && target.dimension === this.world);
    }

    enterWorld(player: PlayerMp){
        if(!mp.players.exists(player)) return;
        player.user.revive(0)
        player.user.teleport(this.posWorld.x, this.posWorld.y, this.posWorld.z, this.posWorld.h, this.world);
        player.user.achiev.achievTickByType("eventEnter")
    }
    exitWorld(player: PlayerMp){
        if(!mp.players.exists(player)) return;
        player.user.revive(0)
        player.user.returnToOldPos();
        player.notify(player.user.LangString("invent.5d44a007c3c2f1f32dd5dc50f2d92c7b"), "success");
    }

    delete() {
        if (this.colshape) this.colshape.destroy();
        this.players.map(target => {
            this.exitWorld(target);
        })
        const index = IventClass.pool.findIndex(q => q.id === this.id);
        if (index > -1) IventClass.pool.splice(index, 1);
    }


    //* Static pool
    static pool: IventClass[] = []
    static ids = 1;
    static get(id: number) {
        return this.pool.find(q => q.id === id)
    }
    static delete(id: number) {
        const item = this.pool.find(q => q.id === id);
        if (item) item.delete()
    }
}

setInterval(() => {
    IventClass.pool.map(item => {
        if (item.type === "pos" && item.endTime < system.timestamp && item.colshape){
            item.colshape.destroy();
            item.colshape = null;
        }
    })
}, 10000)

const iventtypearray: ("pos" | "tp" | "gps")[] = ["pos", "tp", "gps"]
const iventtypenames = [langStringDefault("invent.d53468cdd72e6d24ef899fc88f23008e"), langStringDefault("invent.7ced1c08017e2d89a7b24b21b56694c3"), langStringDefault("invent.52ca74dd8b5ed734ffe83c5d09fb9268")]
const iventtypedesc = [langStringDefault("invent.2d3213d8d5846e4d1959d7a096976d70"), langStringDefault("invent.57e184beb7f726d3cac3e3823f7e12ac"), langStringDefault("invent.2f42f410a61ead7ba3f12aec5ad335bd")]

const createMp = (player: PlayerMp, conf: {
    fromSystem: boolean,
    type: number,
    name: string,
    minutesToClose: number,
    closed: boolean,
    posWorld?: { x: number, y: number, z: number, h: number }
    pos?: { x: number, y: number, z: number, h: number }
}) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:events:system')) return;
    const m = menu.new(player, player.user.LangString("invent.fbdae1339e34ef4497a85e781097130a"), player.user.LangString("invent.50511e157792c215577e040cf36859cd"))
    m.newItem({
        name: langStringDefault("invent.eedede4820fda8302016b58982be1580"),
        desc: iventtypedesc[conf.type],
        type: "list",
        list: iventtypenames,
        listSelected: conf.type,
        onchange: (val) => {
            conf.type = val
            createMp(player, conf)
        }
    })
    if(conf.type != 2){
        m.newItem({
            name: langStringDefault("invent.c5e6d6a5d77b4d3933b431ebb9a665da"),
            desc: langStringDefault("invent.48af2010ede7192a722ec9f3d423395a"),
            more: conf.posWorld ? langStringDefault("invent.fbfdf79dc3ece39ec9902b3d8cbfdcf2") : langStringDefault("invent.e6d2e8a39c5eb09c2a1dedbcc3129f8a"),
            onpress: () => {
                conf.posWorld = { x: player.position.x, y: player.position.y, z: player.position.z, h: player.heading}
                player.notify(player.user.LangString("invent.15d20369936db1dcfb8aacfd22a19712"), "success");
                createMp(player, conf)
            }
        })
    }
    if(conf.type != 1){
        m.newItem({
            name: langStringDefault("invent.376f8fa12ee971997f38553c0cc12440"),
            desc: langStringDefault("invent.ff1d65c7e00ef31f0c92112144ab8fc0"),
            more: conf.pos ? langStringDefault("invent.3fb4223b31ec2832d87cc3b4a88d4b9b") : langStringDefault("invent.fae978ea2cf13ce10b93c6cdd8ead9a9"),
            onpress: () => {
                conf.pos = { x: player.position.x, y: player.position.y, z: player.position.z, h: player.heading }
                player.notify(player.user.LangString("invent.fff30681e1175d41f629591df49f4790"), "success");
                createMp(player, conf)
            }
        })
    }
    
    m.newItem({
        name: langStringDefault("invent.150dd28f3bfa4931a4f1f39f96fb130a"),
        more: conf.name,
        onpress: () => {
            menu.input(player, player.user.LangString("invent.9f47a9a2cae758311bc3553006ace22f"), conf.name, 20).then(name => {
                if(!name) return createMp(player, conf)
                conf.name = name;
                createMp(player, conf)
            })
        }
    })
    m.newItem({
        name: langStringDefault("invent.66e2c7a577167aa5ec635666a4f976f9"),
        desc: langStringDefault("invent.809911e2e66970795f1c772a19e08c38"),
        more: conf.closed ? langStringDefault("invent.9ad81670bbe99c08ad76b3c1b7f685f1") : langStringDefault("invent.7fd07edf6fd113fdc9f926c8968da435"),
        onpress: () => {
            conf.closed = !conf.closed
            createMp(player, conf)
        }
    })
    m.newItem({
        name: langStringDefault("invent.409a1bcc7ea7e2d4dd8d94aedecffb8f"),
        desc: langStringDefault("invent.fd85868f9f1ae3272b209a25b83bde9a"),
        more: conf.fromSystem ? "SYSTEM" : langStringDefault("invent.8e1c7e912ad5b14180ef1ac364705a50"),
        onpress: () => {
            conf.fromSystem = !conf.fromSystem
            createMp(player, conf)
        }
    })
    m.newItem({
        name: langStringDefault("invent.e51e75a68758df3c2cc6ce8b271abbd8"),
        desc: langStringDefault("invent.168bc95e6f117f56096f20434322e152"),
        more: conf.minutesToClose+langStringDefault("invent.2797b6e7f076f31664c21da9d3bd6a66"),
        onpress: () => {
            menu.input(player, player.user.LangString("invent.a2e71359cbc3861ba32b9ce810079649"), conf.minutesToClose, 3, "int").then(min => {
                if (!min || min < 0) return createMp(player, conf)
                conf.minutesToClose = min;
                createMp(player, conf)
            })
        }
    })
    m.newItem({
        name: langStringDefault("invent.d22d8c3ccb6d1c8fe21f335a2cffd245"),
        desc: langStringDefault("invent.9f7adf9a8adfb85da9fd08efcd03f4b6"),
        onpress: () => {
            if(!conf.name) return player.notify(player.user.LangString("invent.a3df8ee435cf1f6e47ae55b8c3dd2e18"), "error")
            if (!conf.pos && conf.type != 1) return player.notify(player.user.LangString("invent.248848e930e7c1a1d58976b1de224290"), "error")
            if (!conf.posWorld && conf.type != 2) return player.notify(player.user.LangString("invent.4ffac2bbd09aaab285b8c989d881c29e"), "error")
            new IventClass(iventtypearray[conf.type], conf.name, conf.minutesToClose, conf.fromSystem ? 'SYSTEM' : player.user.name, conf.pos, conf.posWorld, conf.closed);
            player.notify(player.user.LangString("invent.18e7ac3b855cd396083a9b574655efd0"), "success")
            adminMenu(player)
        }
    })
    m.open();
}

const adminMenu = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:events:system')) return;
    const m = menu.new(player, player.user.LangString("invent.7688c252f7b8a68c6c7513c5dcbb926c"), player.user.LangString("invent.c69863fa6ed35f1c43815c9daa9e4fb3"))
    m.newItem({
        name: langStringDefault("invent.9edf992915dfc64740e02789be88bd8e"),
        onpress: () => {
            m.close();
            fight.create(player)
        }
    })
    m.newItem({
        name: langStringDefault("invent.19a5d05633b0f962a22c2f0b636909eb"),
        onpress: () => {
            if (!user.hasPermission('admin:boxGameStart:system')) return;
            m.close();
            BoxGameCreateAndRun()
        }
    })
    // adminRun
    GRAB_POS_LIST.map((item, id) => {
        if(!item.adminRun) return;
        m.newItem({
            name: adminGrabEnable.has(id) ? langStringDefault("invent.8971d8686f5b2c7fd94b9f4bec31fb35", item.name) : langStringDefault("invent.ccd61e807a02040a927ae751cd37b8e3", item.name),
            onpress: (itm) => {
                if (item.adminRun > user.admin_level) return player.notify(player.user.LangString("invent.c165e03061c07cfe2aec508845ce6bfc"), 'error')
                runAdminGrab(id);
                adminMenu(player)
            }
        })
    })
    GANGFIGHT_POS.map((item, id) => {
        if(gangfight.list.has(id)) return;
        if(!item.adminRun) return;
        m.newItem({
            name: langStringDefault("invent.f22d38c1e0ddb62f5a6d3b4931dbc57b", item.name),
            onpress: (itm) => {
                if (item.adminRun > user.admin_level) return player.notify(player.user.LangString("invent.9f61ea7b77bb51cc76a0b6e553e5b6d4"), 'error')
                gangfight.create(id);
            }
        })
    })
    if(user.isAdminNow(6)){
        m.newItem({
            name: langStringDefault("invent.a31a4571032735784eca817e918a0d07"),
            onpress: () => {
                menu.accept(player).then(status => {
                    if(!status) return;
                    clearGangZone()
                    adminMenu(player)
                    player.notify(player.user.LangString("invent.e235ef96d29f5de53f2dda99f57e59af"))
                })
            }
        })
    }
    m.newItem({
        name: langStringDefault("invent.987293417daf7f0084aad3d2c971ec17"),
        onpress: () => {
            createMp(player, {
                fromSystem: true,
                type: 1,
                name: "",
                minutesToClose: 10,
                closed: false,
            })
        }
    })
    IventClass.pool.map(item => {
        m.newItem({
            name: `#${item.id} ${item.name}`,
            more: `${!item.closed ? langStringDefault("invent.a71bc7eb2be3331ed7c21974455de5c4") : langStringDefault("invent.bbd4ee24ef7c5d0b9d4b26cc398801d0")}`,
            desc: langStringDefault("invent.02666994e350b589994a1c990fed59b9", item.author, item.type),
            onpress: () => {
                itemChoise(player, item)
            }
        })
    })
    m.open();
}
const itemChoise = (player: PlayerMp, item: IventClass) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:events:system')) return;
    const m = menu.new(player, `#${item.id} ${item.name}`, player.user.LangString("invent.5356bb5fd13ab395799094b2d87c335c"))
    m.onclose = () => { adminMenu(player)};
    m.newItem({
        name: langStringDefault("invent.2483fe56d0b07a371250343ed6fdb2f7"),
        desc: langStringDefault("invent.4b168f6a91af04c2eccf029747106e6b"),
        more: `${!item.closed ? langStringDefault("invent.75a731b0001878f9e1ed8bdd40f43574") : langStringDefault("invent.712194c4d01516073d6d3aeccea8728f")}`,
        onpress: () => {
            item.closed = !item.closed;
            itemChoise(player, item)
        }
    })
    if (!item.closed){
        m.newItem({
            name: langStringDefault("invent.89f84e543af5adc1a0a73a81a1ec93c6"),
            onpress: () => {
                item.notify();
            }
        })
    }
    m.newItem({
        name: langStringDefault("invent.3e4cd899ab806463673e6b8b06a15b11"),
        onpress: () => {
            menu.accept(player).then(status => {
                if (!status) return itemChoise(player, item);
                item.delete();
                adminMenu(player)
                player.notify(player.user.LangString("invent.3e22e1fd92cda60340ad1b786ac70c82"), "success") 
            })
        }
    })
    m.open();
}

CustomEvent.registerCef('phone:createEvent', (player, name: string) => {
    const user = player.user;
    if(!user) return;
    if(!player.phoneCurrent) return;
    if (!name || name.length < 5) return user.notifyPhone(user.LangString("invent.632ca7c06ad271fd88ab6b860bf60c69"), user.LangString("invent.2c7e96ecaa9d69776e9afbab535b0eed"), user.LangString("invent.8ec08ae22776cf92a15a00f8bb18acb7"), "error");
    if (IventClass.pool.find(q => q.name === name)) return user.notifyPhone(user.LangString("invent.178e7160e1e2c703f66bce3659c3e3cd"), user.LangString("invent.4893c9f052fd6842dbd77da0180fd29b"), user.LangString("invent.23963db5c14eb5725b96e9f4afed2100"), "error");
    if (!user.bank_number) return user.notifyPhone(user.LangString("invent.1db25a1c4b7dedbfbd967f0799e63f5f"), user.LangString("invent.fe59a1cff1d13cd6765c84dfaa7c5ec0"), user.LangString("invent.c1bf1e5489a71a4efbe6ee72e01dea12"), "error");
    if (!user.tryRemoveBankMoney(EVENT_ANNOUNCE_COST, true, user.LangString("invent.8934a27d5eb1bf808251fcddf8d99b33"), user.LangString("invent.d30d3eee02872878015f38ada43ce927"))) return;
    new IventClass("gps", name, EVENT_ANNOUNCE_MINUTE, `${user.name}`, { x: player.position.x, y: player.position.y, z: player.position.z, h: player.heading}, null)
})

mp.events.add('playerDeath', (player => {
    if(!player.dimension) return;
    const ivent = IventClass.pool.find(q => q.world === player.dimension);
    if(ivent) ivent.exitWorld(player);
}))

CustomEvent.registerClient('admin:events:system', (player) => {
    adminMenu(player)
})


CustomEvent.registerCef('ivent:enter', (player, id: number) => {
    if(player.dimension) return player.notify(player.user.LangString("invent.96f73f57142789d257842f5e0bf57c4e"), "error");
    if (player.user.attachedToPlace) return player.notify(player.user.LangString("invent.a6d99f23cba09452063acb67699e7b9b"), "error")
    const ivent = IventClass.get(id);
    if (!ivent || !ivent.exist) return player.notify(player.user.LangString("invent.61c434fbc6d3d4f3b45a56c9136248e3"), "error");
    if (ivent.type !== "tp") return player.notify(player.user.LangString("invent.6a9cdb0f0e0879e3b41c1471e2695145"), "error");
    ivent.enterWorld(player);
})
