import { langStringDefault } from "../../shared/lang";
import {SHOOTING_RANGES, SHOOTING_WEAPONS_LIST} from "../../shared/shooting";
import {colshapeHandle, colshapes} from "./checkpoints";
import {menu} from "./menu";
import {inventoryShared} from "../../shared/inventory";
import {LicenseName} from "../../shared/licence";
import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {ShootingRatingEntity} from "./typeorm/entities/shooting";


class ShootingItem {
    readonly configId: number;
    private colshape: colshapeHandle;
    static get(id: number){
        return this.pool.find(q => q.configId === id)
    }
    static pool:ShootingItem[] = []
    success(player: PlayerMp, status: boolean, ms: number): void {
        const user = player.user;
        if(!user) return;
        user.removeWeapon();
        const pos = this.config.exit
        user.teleport(pos.x, pos.y, pos.z, pos.h, 0, true)
        if(!status) return;
        ShootingRatingEntity.findOne({
            where: {
                userId: user.id,
                item: this.configId
            }
        }).then(record => {
            if(record && record.time <= ms) return;
            if(!record) record = new ShootingRatingEntity();
            record.time = ms;
            record.userId = user.id;
            record.name = user.name;
            record.save()
            this.#top = null;
        })
    }
    private load(){
        this.colshape = colshapes.new(this.position, this.name, player => {
            this.menu(player)
        }, {
            drawStaticName: "scaleform"
        })
    }
    #top:[string, number, number][] = [];
    get top(): Promise<[string, number, number][]>{
        return new Promise(resolve => {
            if(this.#top) return resolve(this.#top);
            ShootingRatingEntity.find({
                where: {
                    item: this.configId
                },
                order: {time: "ASC"}
            }).then(top => {
                this.#top = top.map(q => [`${q.name}`, q.id, q.time]);
                return resolve(this.#top);
            })
        })
    }
    private menu(player: PlayerMp){
        const user = player.user;
        if(!user) return;
        const m = menu.new(player, this.name);


        m.newItem({
            name: player.user.LangString("shooting.c9c52fc01824cb43f0e38d7ac3c9edac"),
            onpress: async () => {

                const data = await this.top;
                if(!data || data.length === 0) return player.notify(player.user.LangString("shooting.7ee389d4ab5de08b0bf7c494783c854f"), 'error'), m.close()
                const submenu = menu.new(player, player.user.LangString("shooting.21f430dab83afecdf9881bc6b6048547"));
                submenu.onclose = () => {
                    this.menu(player)
                }

                const myPos = data.findIndex(q => q[1] === user.id);

                if(myPos > -1){
                    submenu.newItem({
                        name: player.user.LangString("shooting.ce57c7781dda7fd1336ba01f89d00f0c", (myPos + 1)),
                        more: system.msecondsToString(data[myPos][2])
                    })
                }

                let end = Math.min(20, data.length);
                for (let index = 0; index < end; index++){
                    const item = data[index];
                    if(item){
                        submenu.newItem({
                            name: `${index + 1}) ${item[0]} [${item[1]}]`,
                            more: system.msecondsToString(item[2])
                        })
                    }
                }

                submenu.open()

            }
        })

        m.newItem({
            name: 'Mitmachen',
            desc: `${this.license && !user.haveActiveLicense(this.license) ? user.LangString("shooting.fa38e0e0f16f345500b451797f429dd7", LicenseName[this.license]) : ''}`,
            onpress: () => {
                let q = false;
                if(this.license && !user.haveActiveLicense(this.license)) return player.notify(player.user.LangString("shooting.25748819a477e86c92bb16baf9e11f87", LicenseName[this.license]), 'error')
                menu.selector(player, player.user.LangString("shooting.5d855cfb5d9d35bc6fdaaf3a5a635e79"), weaponNames, true).then(weapon => {
                    if(q) return;
                    q = true;
                    menu.close(player);
                    if(typeof weapon !== "number" || weapon < 0 || !weaponNames[weapon]) return;
                    if(this.license && !user.haveActiveLicense(this.license)) return player.notify(player.user.LangString("shooting.454c3db790e82206a53098879b38e9af", LicenseName[this.license]), 'error')
                    const pos = this.config.enter
                    user.teleport(pos.x, pos.y, pos.z, pos.h, system.personalDimension)
                    setTimeout(() => {
                        if(!user.exists || user.health <= 0) return;
                        if(user.currentWeapon) user.currentWeapon = null;
                        user.giveWeapon(SHOOTING_WEAPONS_LIST[weapon], 240)
                        if(mp.players.exists(player)) CustomEvent.triggerClient(player, 'shooting:start', this.configId)
                    }, system.TELEPORT_TIME * 2)
                })
                m.close();
            }
        })



        m.open();
    }
    get config(){
        return SHOOTING_RANGES[this.configId]
    }
    get name(){
        return this.config.name
    }
    get license(){
        return this.config.license
    }
    get position(){
        return this.config.pos
    }
    constructor(id: number) {
        this.configId = id;
        this.load()

        ShootingItem.pool.push(this)
    }
}



const weaponNames: string[] = []
SHOOTING_WEAPONS_LIST.map(weapon => {
    weaponNames.push(inventoryShared.getWeaponNameByHash(weapon) || weapon);
})

SHOOTING_RANGES.map((item, id) => {
    new ShootingItem(id)
})

CustomEvent.registerClient('shooting:finish', (player, id: number, status: boolean, ms: number) => {
    const user = player.user;
    if(!user) return;
    const item = ShootingItem.get(id);
    if(item) item.success(player, status, ms);

})

CustomEvent.registerClient('shooting:dead', (player) => {
    if (!player.user) return;
    player.user.removeWeapon();
})
