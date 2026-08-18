import { langStringDefault } from "../../shared/lang";
import {MoneyChestEntity} from "./typeorm/entities/money.chest";
import {colshapeHandle, colshapes} from "./checkpoints";
import {system} from "./system";
import {DynamicBlip} from "./dynamicBlip";
import {menu} from "./menu";
import {CustomEvent} from "./custom.event";
import {ScaleformTextMp} from "./scaleform.mp";
import {saveEntity} from "./typeorm";
import {Logs} from "./logs";
import { fractionCfg } from "./fractions/main";


export class MoneyChestClass {
    static pool = new Map<number, MoneyChestClass>()
    colshape: colshapeHandle;
    label: ScaleformTextMp;
    blip: DynamicBlip;
    todayTaked = 0;
    static get(id: number){
        return this.pool.get(id);
    }
    static getByFraction(fraction: number){
        return this.getAllByFraction(fraction)[0]
    }
    static getAllByFraction(fraction: number){
        return [...this.pool].map(q => q[1]).filter(q => q.fraction === fraction)
    }
    static getByPlayer(player: PlayerMp){
        if(!mp.players.exists(player)) return null;
        if(!player.user) return null;
        if(!player.user.fraction) return null;
        return this.getByFraction(player.user.fraction)
    }
    static create(player: PlayerMp, fraction: number) {
        const pos = new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.98);
        let data = new MoneyChestEntity();
        data.x = pos.x;
        data.y = pos.y;
        data.z = pos.z;
        data.d = player.dimension;
        data.fraction = fraction;
        data.save().then(res => {
            this.load(res);
        })
    }
    static loadAll() {
        return MoneyChestEntity.find().then(list => {
            list.map(item => {
                this.load(item);
            })
        })
    }
    static load(data: MoneyChestEntity) {
        return new MoneyChestClass(data);
    }
    data: MoneyChestEntity;
    get day_limit() {
        return this.data.day_limit
    }
    set day_limit(val){
        this.data.day_limit = val
        this.save();
    }
    get money() {
        return this.data.money
    }
    set money(val){
        this.data.money = val
        if (ScaleformTextMp.exists(this.label)) this.label.text = `${this.name} ($${system.numberFormat(this.money)})`;
        this.save();
    }
    get position() {
        return new mp.Vector3(this.data.x, this.data.y, this.data.z)
    }
    set position(val){
        this.data.x = val.x
        this.data.y = val.y
        this.data.z = val.z
        this.drawAll()
        this.save();
    }
    get dimension() {
        return this.data.d
    }
    set dimension(val){
        this.data.d = val;
        this.drawAll()
        this.save();
    }
    get fraction() {
        return this.data.fraction
    }
    get id() {
        return this.data.id
    }
    get name() {
        return langStringDefault("money.chest.ff655da93f0453bbb05faf0e971cd6ba") + fractionCfg.getFractionName(this.fraction);
    }
    save(){
        saveEntity(this.data);
    }
    delete() {
        this.clearAll();
        MoneyChestClass.pool.delete(this.id);
        this.data.remove();
    }
    clearAll(){
        if (this.colshape){
            this.colshape.destroy();
            this.colshape = null;
        }
        if (this.label && ScaleformTextMp.exists(this.label)){
            this.label.destroy();
            this.label = null;
        }
        if (this.blip){
            this.blip.destroy();
            this.blip = null;
        }
        
    }
    drawAll(){
        const visualizationPredicate = (p: PlayerMp) => {
            return p.user && (p.user.fraction === this.fraction || p.user.hasPermission('admin:moneychest:access'));
        }

        this.clearAll();
        this.colshape = colshapes.new(this.position, this.name, player => {
            this.menu(player);
        }, {
            dimension: this.dimension,
            type: 27,
            predicate: visualizationPredicate
        }, 'admin', 'fraction');
        
        this.label = new ScaleformTextMp(new mp.Vector3(this.position.x, this.position.y, this.position.z + 1), `${this.name}\n($${system.numberFormat(this.money)})`, {
            dimension: this.dimension,
            range: 10,
            type: "front"
        }, visualizationPredicate, 'admin', 'fraction');

        this.blip = system.createDynamicBlip(`moneychest_${this.id}`, 108, 1, this.position, `${this.name}`, {
            dimension: this.dimension,
            fraction: this.fraction,
            shortRange: false,
            range: 20,
            interior: true
        });
    }

    showLogs(player: PlayerMp){

        Logs.open(player, `money_${this.id}`, player.user.LangString("money.chest.34a6b33eb7ca27a01ed61f423b47b1f5"))

    }
    addLog(who: PlayerMp, text: string){
        Logs.new(`money_${this.id}`, `${who.user.name} ${who.dbid}`, text)
    }
    /** Внести наличку в сейф */
    addMoney(player: PlayerMp, sum: number, pay = true){
        if(player){
            const user = player.user;
            if (!user) return;
            if (sum < 0) return this.menu(player);
            if (pay && sum > user.money) return this.menu(player), player.notify(player.user.LangString("money.chest.09b3e4d0cd736ebe9b10549f7ba1870d"), "error");
            this.addLog(player, langStringDefault("money.chest.7e7c46ece951fab0f8cab90995117478", system.timeStampString(system.timestamp, true), system.numberFormat(sum), pay ? langStringDefault("money.chest.759ab28105241d20770efeeff4c8d0b3") : ''))
        }
        this.money += sum;
        if(player && pay) player.user.removeMoney(sum, true, player.user.LangString("money.chest.7a55a947ce9d7ffc5fbe5e14247b2f89", this.id));
        if(player && system.distanceToPos(player.position, this.position) < 3) this.menu(player)
    }
    /** Взять наличку с сейфа */
    removeMoney(player: PlayerMp, sum: number){
        const user = player.user;
        if (!user) return;
        if (sum < 0) return this.menu(player);
        if (sum > this.money) return this.menu(player), player.notify(player.user.LangString("money.chest.09d8354df63ac2e3653260ff959163f9"), "error");
        if (this.day_limit){
            if (sum + this.todayTaked > this.day_limit) return player.notify(player.user.LangString("money.chest.de50c9a66ff31fa3ecbe4cfca1bd5dbe", system.numberFormat(this.day_limit), system.numberFormat(this.todayTaked)), 'error')
            this.todayTaked += sum;
        }
        this.addLog(player, langStringDefault("money.chest.9bad9118731865ac798eaf4ca44512e7", system.timeStampString(system.timestamp, true), system.numberFormat(sum)))
        this.money -= sum;
        user.addMoney(sum, true, user.LangString("money.chest.5e2fe1988887730c0390b49a9bdf44b4", this.id));
        if(system.distanceToPos(player.position, this.position) < 3) this.menu(player)
    }
    menu(player: PlayerMp){
        const user = player.user;
        if(!user) return;
        if (!user.hasPermission('admin:moneychest:access') && user.fraction !== this.fraction) return player.notify(player.user.LangString("money.chest.e36dd7cf74d9b3dbbd1a788b1ef85c51"), "error");
        const m = menu.new(player, "", player.user.LangString("money.chest.b2ae21dbd58e4f3a7ce2854f82674c63", this.name, this.id));
        m.sprite = "safe"


        m.newItem({
            name: langStringDefault("money.chest.354cc4be38fbe6bd9527892f7d5769d8"),
            more: `$${system.numberFormat(this.money)}`,
            onpress: () => {
                if(user.isAdminNow(6)){
                    menu.input(player, player.user.LangString("money.chest.332acb584530de1adc84f85992b300c5"), 100, 8, 'int').then(sum => {
                        if (typeof sum !== "number" || sum < 0) return this.menu(player)
                        this.money = sum;
                        this.menu(player)
                    })
                }
            }
        })

        m.newItem({
            name: langStringDefault("money.chest.5e0bb05e20f05eef0b9a39b3805426c6"),
            onpress: () => {
                menu.input(player, player.user.LangString("money.chest.fc49ab726deae614d7f3c99b8189a442"), system.smallestNumber(user.money, 100), 8, 'int').then(sum => {
                    if (typeof sum !== "number" || !sum) return this.menu(player)
                    this.addMoney(player, sum)
                })
            }
        })

        if(user.grab_money || user.grab_money_shop){
            m.newItem({
                name: langStringDefault("money.chest.926d642f8b8e410c4eb2ca08cbda9d4d"),
                more: `$${user.grab_money ? system.numberFormat(user.grab_money) :  system.numberFormat(user.grab_money_shop)}`,
                onpress: () => {
                    if (!user.grab_money && !user.grab_money_shop) return;
                    m.close();
                    const moneyToAdd = user.grab_money ? user.grab_money : user.grab_money_shop
                    this.addMoney(player, fractionCfg.getFraction(this.fraction).gos ? moneyToAdd * 0.15 : moneyToAdd, false)
                    user.grab_money = 0;
                    user.grab_money_shop = 0;
                    player.notify(player.user.LangString("money.chest.276c3f3f5079e8f020d146e44188d17a"), "success");
                }
            })
        }

        if (user.isSubLeader || user.hasPermission('admin:moneychest:access')){
            m.newItem({
                name: langStringDefault("money.chest.ed44b7e5b8bd8bf39bfbcbcf2a137284"),
                onpress: () => {
                    this.showLogs(player);
                }
            })
        }
        if (user.isSubLeader || user.hasPermission('admin:moneychest:access')){
            m.newItem({
                name: langStringDefault("money.chest.6bedfe09b5542e482e97b93f364ab846"),
                onpress: () => {
                    menu.input(player, langStringDefault("money.chest.f08e0e164d81bd3f666870d7267192ea"), system.smallestNumber(this.money, 100), 8, 'int').then(sum => {
                        if (typeof sum !== "number" || !sum) return this.menu(player)
                        this.removeMoney(player, sum)
                    })
                }
            })
            if(this.day_limit){
                m.newItem({
                    name: langStringDefault("money.chest.7f719e4b392764b05db4f2a16bf60cf0"),
                    more: `$${system.numberFormat(this.todayTaked)} / $${system.numberFormat(this.day_limit)}`,
                    desc: langStringDefault("money.chest.d97e2ea64be48a1599002fb1afdcc203")
                })
            }
        }

        if (user.hasPermission('admin:moneychest:access')){
            m.newItem({
                name: langStringDefault("money.chest.fdbaaebfb0bff678f0a0b55ca3b4124b"),
                onpress: () => {
                    menu.input(player, player.user.LangString("money.chest.5831b479ce093233fdded11731895dd1"), this.money, 8, 'int').then(sum => {
                        if(typeof sum !== "number" || sum < 0) return this.menu(player)
                        
                        this.money = sum;
                        player.notify(player.user.LangString("money.chest.1480d60d538fdadb7f293922e6d32612"), "success");
                        this.menu(player)
                    })
                }
            })
            m.newItem({
                name: langStringDefault("money.chest.5c46af2e1ee168a88703ec5b22c1c2b8"),
                desc: langStringDefault("money.chest.b3e6134b1f97ff3dd474d6fbed1a9f35"),
                more: `$${system.numberFormat(this.day_limit)}`,
                onpress: () => {
                    menu.input(player, player.user.LangString("money.chest.1bfc891e19c722df33278fa69d430bb8"), this.day_limit, 8, 'int').then(sum => {
                        if(typeof sum !== "number" || sum < 0) return this.menu(player) 
                        this.day_limit = sum;
                        player.notify(player.user.LangString("money.chest.360c955978f4cada3bbac633d1c9712f"), "success");
                        this.menu(player)
                    })
                }
            })
            if(system.distanceToPos(player.position, this.position) > 10){
                m.newItem({
                    name: langStringDefault("money.chest.8b7afcdf2ad3b5eec1e6634641cdb75d"),
                    onpress: () => {
                        user.teleport(this.position.x, this.position.y, this.position.z, 0, this.dimension)
                    }
                })
            }
            m.newItem({
                name: langStringDefault("money.chest.568353146a2b08c8b8407cf92035e2ce"),
                onpress: () => {
                    menu.accept(player).then(status => {
                        if(!status) return this.menu(player)
                        this.position = new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.98);
                        setTimeout(() => {
                            if(this.dimension !== player.dimension) this.dimension = player.dimension;
                            this.menu(player)
                            player.notify(player.user.LangString("money.chest.96ef9708c74e885ccdcf782e134103ca"), "success")
                        }, 200);
                    })
                }
            })
            m.newItem({
                name: langStringDefault("money.chest.1baf27bd06fc8b3557b848d116d106ce"),
                onpress: () => {
                    menu.accept(player).then(status => {
                        if(!status) return this.menu(player)
                        this.delete()
                        player.notify(player.user.LangString("money.chest.fffab00149444df9908c77a416161061"), "success")
                    })
                }
            })
        }


        m.open();
    }
    constructor(data: MoneyChestEntity) {
        this.data = data;
        this.drawAll();
        MoneyChestClass.pool.set(this.id, this);
    }
}

const adminMenu = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    const m = menu.new(player, player.user.LangString("money.chest.7f346294e2fd8941715f9eac1fb898b8"), player.user.LangString("money.chest.d6e6d6f523ee4ef8ee5e9b9cccb37997"));

    MoneyChestClass.pool.forEach(item => {
        m.newItem({
            name: `${item.name} #${item.id}`,
            more: `$${system.numberFormat(item.money)}`,
            onpress: () => {
                item.menu(player);
            }
        })
    })

    m.newItem({
        name: langStringDefault("money.chest.a6a007b229a0ec0d72d78d2aa3aeb91f"),
        onpress: () => {
            menu.selectFraction(player).then(fraction => {
                if(!fraction) return adminMenu(player)
                if (MoneyChestClass.getByFraction(fraction)) return player.notify(player.user.LangString("money.chest.d3dedd92ead08dd5dd57b0199af02baa"), "error"), adminMenu(player);
                MoneyChestClass.create(player, fraction);
                player.notify(player.user.LangString("money.chest.67dc3033cf203d5ccabb8f41ac397667"), "success");
            })
        }
    })

    m.open();
}

CustomEvent.registerClient('admin:moneychest:access', player => {
    adminMenu(player);
})