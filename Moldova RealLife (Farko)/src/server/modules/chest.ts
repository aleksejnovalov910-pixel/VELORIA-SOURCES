import { langStringDefault } from "../../shared/lang";
import {FractionChestEntity} from "./typeorm/entities/chest";
import {colshapeHandle, colshapes} from "./checkpoints";
import {menu} from "./menu";
import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {FACTION_ID} from "../../shared/fractions";
import {inventory} from "./inventory";
import {
    ARMOR_ITEM_ID,
    getBaseItemNameById,
    getItemName,
    getItemWeight,
    inventoryShared,
    OWNER_TYPES
} from "../../shared/inventory";
import {User} from "./user";
import {DynamicBlip} from "./dynamicBlip";
import {ScaleformTextMp} from "./scaleform.mp";
import {CHEST_RECYCLING_LIST} from "../../shared/chest";
import {Logs} from "./logs";
import {Family} from "./families/family";
import {ItemEntity} from "./typeorm/entities/inventory";
import {ArmorNames} from "../../shared/cloth";
import {dress} from "./customization";
import {fractionCfg} from "./fractions/main";

export class fractionChest {
    static list = new Map <number, fractionChest>()
    label: ScaleformTextMp;
    blip: DynamicBlip;
    static get(id: number){
        return this.list.get(id);
    }
    static getByFraction(id: FACTION_ID){
        return [...this.list].map(q => q[1]).filter(q => q.fraction === id)
    }
    static getByFamily(id: number){
        return [...this.list].map(q => q[1]).filter(q => q.family === id)
    }
    
    private static createChest(name: string, prefix: string, fraction: number, familyId: number, pos: Vector3Mp, dimension: number, items?: [number, number, number][], limits?: [number, number, number][]) {
        let entity = new FractionChestEntity();
        entity.name = name;
        entity.prefix = prefix;
        entity.family = familyId;
        entity.fraction = fraction;
        entity.pos_x = pos.x;
        entity.pos_y = pos.y;
        entity.pos_z = pos.z;
        entity.pos_d = dimension;
        entity.logs = JSON.stringify([]);
        if (items) entity.items = items;
        if (limits) entity.limits = limits;
        entity.save().then(ent => {
            this.load(ent);
        }).catch(err => {
            console.error(err);
        })
    }
    
    static createForFamily(name: string, prefix: string, familyId: number, pos: Vector3Mp, dimension: number, items?: [number, number, number][], limits?: [number, number, number][]) {
        fractionChest.createChest(name, prefix, 0, familyId, pos, dimension, items, limits);
    }
    
    static create(name: string, prefix: string, fraction: number, pos: Vector3Mp, dimension: number, items?: [number, number, number][], limits?: [number, number, number][]){
        fractionChest.createChest(name, prefix, fraction, 0, pos, dimension, items, limits);
    }
    static load(data: FractionChestEntity){
        return new fractionChest(data);
    }
    static loadAll(){
        return FractionChestEntity.find().then(items => {
            items.map(item => {
                this.load(item);
            })
        })
    }
    /** Сколько игрок взял предметов по типу
     * @key USERID_ITEMID
     */
    takedByItems = new Map<string, number>()
    /** Сколько игрок взял предметов всего */
    takedTotal = new Map<number, number>()
    colshape: colshapeHandle;
    get pos(){
        return new mp.Vector3(this.data.pos_x, this.data.pos_y, this.data.pos_z);
    }
    set pos(val){
        this.data.pos_x = val.x
        this.data.pos_y = val.y
        this.data.pos_z = val.z
        this.createColshape();
        this.save();
    }
    get dimension(){
        return this.data.pos_d;
    }
    set dimension(val){
        this.data.pos_d = val;
        this.createColshape();
        this.save();
    }
    get fraction(){
        return this.data.fraction;
    }
    set fraction(val){
        this.data.fraction = val;
        this.save();
    }
    get family(){
        return this.data.family;
    }
    set family(val){
        this.data.family = val;
        this.save();
    }
    get name(){
        return this.data.name;
    }
    set name(val){
        this.data.name = val;
        this.createLabel()
        this.save();
    }
    get prefix(){
        return this.data.prefix;
    }
    set prefix(val){
        this.data.prefix = val;
        this.save();
    }
    get items(){
        return this.data.items;
    }
    set items(val){
        this.data.items = val;
    }
    get limits(){
        return this.data.limits;
    }
    set limits(val){
        this.data.limits = val;
        this.save();
    }
    get closed(){
        return !!this.data.closed;
    }
    set closed(val){
        this.data.closed = val ? 1 : 0;
        this.save();
    }
    get currentSize(){
        let size = 0;
        this.items.map(item => {
            size += getItemWeight(item[0]) * item[1]
        })
        return size;
    }
    get size(){
        return this.data.size;
    }
    set size(size){
        this.data.size = size;
        this.save();
    }
    get id(){
        return this.data.id
    }
    save(){
        this.data.save();
    }
    data: FractionChestEntity;
    constructor(data: FractionChestEntity){
        this.data = data;
        let ranks: any[] = [];
        
        if (this.fraction) {
            ranks = fractionCfg.getFractionRanks(this.fraction);
        }
        else if (this.family) {
            ranks = Family.getByID(this.family).ranks;
        }
        
        if (ranks) {
            const limits = [...this.limits]
            ranks.map((_, id) => {
                const rankid = id + 1
                if (!limits.find(q => q[0] === rankid)) limits.push([rankid, 0, 0]);
            })
            if (limits.length !== this.limits.length) this.limits = limits;
        }
        
        let items = [...this.items]
        items.map(item => {
            if(typeof item[1] !== 'number') item[1] = 0;
        })
        this.items = [...items];
        this.createColshape();
        fractionChest.list.set(this.id, this);
    }
    
    
    createLabel() {
        if (this.label && ScaleformTextMp.exists(this.label)) this.label.destroy();
        this.label = new ScaleformTextMp(new mp.Vector3(this.pos.x, this.pos.y, this.pos.z + 1), langStringDefault("chest.3975b57d407ad8942c0f1b786d408ffc", this.name), {
            dimension: this.dimension,
            range: 10,
            type: "front",
        })
    }
    createColshape(){
        this.createLabel()
        if(this.colshape) this.colshape.destroy();
        const color = fractionCfg?.getFractionColor(this.fraction) ?? "#fc0317";
        const rgb = color ? system.hexToRgb(color) : { r: 255, g: 0, b: 0 }
        this.colshape = colshapes.new(this.pos, () => { return this.name }, player => {
            this.menu(player)
        }, {
            dimension: this.dimension,
            type: 27,
            radius: 2,
            color: [rgb.r, rgb.g, rgb.b, 120]
        })
        if (this.blip) this.blip.destroy();
        this.blip = system.createDynamicBlip(`chest_${this.id}`, 568, 4, this.pos, langStringDefault("chest.a8ccf9a0da2ea57c565e90214c08d81c", this.name), {
            dimension: this.dimension,
            fraction: this.fraction ?? 0,
            family: this.family ?? 0,
            shortRange: false,
            range: 50,
            interior: true
        })

        }
    haveAccessToChest(player: PlayerMp){
        const user = player.user;
        if(!user) return false;
        if (user.hasPermission('admin:chest:access')) return true;
        if (this.fraction && !user.hasPermission('fraction:chest:access')) return false;
        if (this.fraction && user.fraction === this.fraction) return true;
        if (this.family && user.familyId === this.family) return true;

        return false;
    }
    // haveAccessToChest(player: PlayerMp) {
    //     const user = player.user;
    //     if (!user) return false;
    
    //     // Adminii pot accesa mereu
    //     if (user.hasPermission('admin:chest:access')) return true;
    
    //     // Doar GOV (is_gos === true)
    //     if (user.is_gos) return true;
    
    //     // Doar membri ai familiei corecte
    //     if (this.family && user.familyId === this.family) return true;
    
    //     // Altii (mafia, gang, etc) NU au acces
    //     return false;
    // }    
    haveAccessToChestEdit(player: PlayerMp){
        const user = player.user;
        if (!user) return false;
        if (user.hasPermission('admin:chest:accessEdit')) return true;
        if (this.fraction && user.fraction !== this.fraction) return false;
        if (this.fraction && user.hasPermission('fraction:chest:accessEdit')) return true;
        if (this.family && (user.getFamilyRank().isOwner || user.getFamilyRank().isSoOwner)) return true;
        
        return false;
    }
    setItemRank(item_id: number, rank: number){
        if (!item_id) return;
        if (!rank) return;
        const items = [...this.items];
        const target = items.findIndex(q => q[0] === item_id);
        if (target > -1) items[target][2] = rank
        this.items = items;
    }
    addItem(item_id: number, amount: number = 1){
        if (!item_id) return;
        if (!amount) return;
        const currentSize = this.currentSize;
        if(this.size < (currentSize + (getItemWeight(item_id) * amount))) return false
        const items = [...this.items];
        const target = items.findIndex(q => q[0] === item_id);
        if (target > -1) items[target][1] = items[target][1] + amount;
        else items.push([item_id, amount, this.fraction ? fractionCfg.getLeaderRank(this.fraction) : Family.getByID(this.family).ranks.find(r => r.isOwner).id]);
        this.items = items;
        
        return true;
    }
    removeItem(item_id: number, amount: number = 1) {
        if (!item_id || !amount) return;
        const items = [...this.items];
        const index = items.findIndex(q => q[0] === item_id);
    
        if (index > -1) {
            items[index][1] -= amount;
            if (items[index][1] <= 0) {
                items.splice(index, 1); // Eliminam complet itemul
            }
        }
    
        this.items = items;
    }
    // removeItem(item_id: number, amount: number = 1){
    //     if (!item_id) return;
    //     if (!amount) return;
    //     const items = [...this.items];
    //     const target = items.findIndex(q => q[0] === item_id);
    //     if (target > -1) items[target][1] = items[target][1] - amount;
    //     this.items = items;
    // }
    haveItem(item_id: number){
        if (!item_id) return false;
        const itm = this.items.find(q => q[0] === item_id)
        return itm ? itm[1] : 0;
    }
    canTakeItem(player: PlayerMp, item_id: number, notify = false){
        const user = player.user;
        if (!user) return;
        if (!this.haveAccessToChest(player)){
            if(notify) player.notify(player.user.LangString("chest.5cc2c9e3a234a00770e1db0816bc4231"), "error");
            return false
        }
        if (!this.haveItem(item_id)) {
            if (notify) player.notify(player.user.LangString("chest.84d21243e57d8a4cc53b122025780a48"), "error");
            return false
        }
        if (!user.canTakeItem(item_id)) {
            if (notify) player.notify(player.user.LangString("chest.9e5da9a1c77a79b853b12ef13ca60fb5"), "error");
            return false
        }
        if (!user.hasPermission("admin:chest:access")) {
            const itemcfg = this.items.find(q => q[0] === item_id);
            if (!itemcfg){
                if (notify) player.notify(player.user.LangString("chest.e14d7aff2750e0633446345b2efcb94a"), "error");
                return false
            }
            if(itemcfg[2] > this.getPlayerRankId(player)){
                if (notify) player.notify(player.user.LangString("chest.3ea10b9217a3d0b46aa03515bc49c163"), "error");
                return false
            }
            const limit = this.limits.find(q => q[0] === this.getPlayerRankId(player));
            if (!limit) {
                if (notify) player.notify(player.user.LangString("chest.b48df330938d035ce9d8a3496dd25944"), "error");
                return false
            }
            const [rank, item, total] = limit;
            if (!this.takedByItems.has(`${user.id}_${item_id}`)) this.takedByItems.set(`${user.id}_${item_id}`, 0)
            if (!this.takedTotal.has(user.id)) this.takedTotal.set(user.id, 0);
            if (!item) {
                if (notify) player.notify(player.user.LangString("chest.2b0581b53ca5a9487fb3eb21252b2fcb"), "error");
                return false
            }
            if (!total) {
                if (notify) player.notify(player.user.LangString("chest.4b8cddef3ffc495857f57a8dcd3dfe40"), "error");
                return false
            }
            if (item <= this.takedByItems.get(`${user.id}_${item_id}`)) {
                if (notify)  player.notify(player.user.LangString("chest.568011f403942755eda064c4097b357a"), "error");
                return false
            }
            if (total <= this.takedTotal.get(user.id)) {
                if (notify) player.notify(player.user.LangString("chest.1aa103590bbc0fd4a90c9adbfd7fce27"), "error");
                return false
            }

        }
        return true
    }
    getPlayerRankId(player: PlayerMp): number {
        if (!player.user) return;
        if (this.family) return player.user.family.ranks.findIndex(r => r.id == player.user.familyRank) + 1;
        else return player.user.rank;
    }
    giveItem(player: PlayerMp, item_id: number) {
        const user = player.user;
        if (!user) return;
        if(!this.canTakeItem(player, item_id, true)) return;
        this.removeItem(item_id)

        const itemParams: Partial<ItemEntity> = {
            owner_type: OWNER_TYPES.PLAYER,
            owner_id: user.id,
            item_id: item_id,
            serial: this.prefix + "_" + this.id + "_" + user.id + "_" + system.timestamp
        };

        if (item_id === ARMOR_ITEM_ID) {
            let armorName = (this.fraction)
                ? fractionCfg.getFraction(this.fraction).armorName
                : ArmorNames.StandardArmor;


            let isGov = fractionCfg.getFraction(this.fraction)?.gos;

            const dressConfig = dress.data.filter(dressEntity => (dressEntity.name) != (armorName))[0];
            if (!dressConfig) {
                system.debug.debug(`[fractionChest] Catalog not found for ${armorName}`)
                return;
            }
            itemParams.count = isGov ? 100 : 50;
            itemParams.serial = dressConfig.name;
            itemParams.advancedNumber = dressConfig.id;
        }

        inventory.createItem(itemParams);
        this.takedTotal.set(user.id, this.takedTotal.get(user.id) + 1)
        this.takedByItems.set(`${user.id}_${item_id}`, this.takedByItems.get(`${user.id}_${item_id}`) + 1)
        player.notify(player.user.LangString("chest.19b74b4135d3311305f52ebf2c37ca76"), "success");
        user.log('fractionChest', langStringDefault("chest.0e3d840e1f3030c228215943f3db9a3f", this.id, this.name, getBaseItemNameById(item_id)))
        Logs.newMany(`chest_${this.id}`, `${user.name} ${user.id}`, langStringDefault("chest.44c18e2a54af51c7374bca7976522c8e", getBaseItemNameById(item_id)))
        this.open(player);
    }

    itemsEdit(player: PlayerMp){
        if (!this.haveAccessToChestEdit(player)) return player.notify(player.user.LangString("chest.b0962b9957a5162b297c6d7611fae1f7"), "error");
        const m = menu.new(player, "", player.user.LangString("chest.d675aa13d7a6dac9dfd3c9d77844e086"))
        m.sprite = "shopui_title_gr_gunmod";
        
        this.items.map(item => {
            m.newItem({
                name: getBaseItemNameById(item[0]),
                icon: `Item_${item[0]}`,
                more: `x${item[1]}`,
                desc: player.user.LangString("chest.ff8527ffabcbd2e0f0f75fbd49221832", item[2]),
                onpress: () => {
                    const submenu = menu.new(player, "", getBaseItemNameById(item[0]));
                    submenu.onclose = () => {
                        this.itemsEdit(player)
                    }
                    submenu.newItem({
                        name: player.user.LangString("chest.5a05169be42494539759b5236f5a3fe1"),
                        type: 'list',
                        list: this.fraction ? fractionCfg.getFractionRanks(this.fraction) : Family.getByID(this.family).ranks.map(rank => rank.name),
                        listSelected: item[2] - 1,
                        onchange: (val) => {
                            const items = [...this.items];
                            items.find(q => q[0] === item[0])[2] = val + 1
                            this.items = items;
                        }
                    })

                    if (player.user.hasPermission('admin:chest:accessEdit')){
                        submenu.newItem({
                            name: player.user.LangString("chest.7a1f01bb5941f8515b0875d38bd2cea2"),
                            type: 'range',
                            rangeselect: [0, 1500],
                            listSelected: item[1],
                            onpress: () => {
                              menu.input(player, player.user.LangString("chest.279c2e94d4d06ec3bc9dfa8234069787"), item[1], 5, 'int').then(val => {
                                  if(typeof val !== "number") return;
                                  if(val < 0) return;
                                  const items = [...this.items];
                                  items.find(q => q[0] === item[0])[1] = val || 0;
                                  this.items = items;
                                  this.itemsEdit(player)
                              })
                            },
                            onchange: (val) => {
                                const items = [...this.items];
                                items.find(q => q[0] === item[0])[1] = val + 1
                                this.items = items;
                            }
                        })
                        submenu.newItem({
                            name: player.user.LangString("chest.dcc73d6b4d8a535a78bae3025c76e7b9"),
                            onpress: () => {
                                menu.accept(player).then(status => {
                                    if (!status) return this.itemsEdit(player);
                                    const items = [...this.items];
                                    const index = items.findIndex(q => q[0] === item[0])
                                    items.splice(index, 1)
                                    this.items = items;
                                    this.itemsEdit(player);
                                })
                            }
                        })
                    }

                    submenu.open();
                }
            })  
        })

        if (player.user.hasPermission('admin:chest:accessEdit')) {
            m.newItem({
                name: player.user.LangString("chest.9190ac04d1e7f7aeff718f322bd3191f"),
                onpress: () => {
                    menu.selectItem(player).then(itemid => {
                        if (!itemid) return this.itemsEdit(player);
                        this.addItem(itemid, 10);
                        player.notify(player.user.LangString("chest.e78214280542657fa55f5543b1aadcfb"), "success");
                        this.itemsEdit(player);
                    })
                }
            })
        }
        
        m.open();
    }
    ranksEdit(player: PlayerMp){
        if (!this.haveAccessToChestEdit(player)) return player.notify(player.user.LangString("chest.d29458344339e51eaba694a8a6d62bb0"), "error");
        const submenu = menu.new(player, "", player.user.LangString("chest.56de78a7831430e11dedc29a239043c8"))
        submenu.sprite = "shopui_title_gr_gunmod";
        submenu.newItem({
            name: player.user.LangString("chest.d1cf0a1cb21b3a7c13333223164eda42"),
            desc: player.user.LangString("chest.fc48ddec99745867cd7c8afb2ecfb6c7")
        })
        this.limits.map(([rankid, item, total], index) => {
            submenu.newItem({
                name: this.fraction ? fractionCfg.getRankName(this.fraction, rankid) : Family.getByID(this.family).ranks[rankid]?.name ?? player.user.LangString("chest.927ce601cf9393b2218fd3cdc9bda28a"),
                more: `${item} / ${total}`,
                onpress: () => {
                    const submenu2 = menu.new(player, "", player.user.LangString("chest.d23642aa2c32547b95637b6a70ef0662"))
                    submenu2.sprite = "shopui_title_gr_gunmod";
                    submenu2.newItem({
                        name: player.user.LangString("chest.bb20e8410130cedb8933d7a750dcf10c"),
                        type: "range",
                        rangeselect: [0, 1000],
                        listSelected: item,
                        onchange: (val) => {
                            item = val;
                        }
                    })
                    submenu2.newItem({
                        name: player.user.LangString("chest.68bbfcbb6be4d6eaa107fb9fd7afdde8"),
                        type: "range",
                        rangeselect: [0, 1000],
                        listSelected: total,
                        onchange: (val) => {
                            total = val;
                        }
                    })
                    submenu2.newItem({
                        name: player.user.LangString("chest.b4920e036d7bd8df4f7082e16254cab1"),
                        onpress: (val) => {
                            const limits = [...this.limits];
                            limits[index][1] = item;
                            limits[index][2] = total;
                            this.limits = limits;
                            player.notify(player.user.LangString("chest.663c83ea7698f4509fa27406a4cbb1d0"), "success");
                            this.menu(player);
                        }
                    })

                    submenu2.open();
                }
            })
        })
        submenu.open();
    }
    menu(player: PlayerMp){
        if (!this.haveAccessToChest(player)) return player.notify(player.user.LangString("chest.f6a29abd8b2ad03f1832cab04cbd19bb"), "error");
        
        let veh: VehicleMp = null;
        if (this.family) {
            const house = Family.getByID(this.family).house;
            veh = User.getNearestVehicleByCoord({ x: house.car_x, y: house.car_y, z: house.car_z }, 40);

            if (veh && veh.fraction) {
                veh = null;
                player.notify(player.user.LangString("chest.07e89b4d4518335c995db720478797f7"), 'warning');
            }
        }
        else if (this.fraction) veh = User.getNearestVehicle(player, 40);
        if (veh) {
            if (!veh.fractionOrder) veh = null;
        }

        // if (!veh && !this.haveAccessToChestEdit(player)) return this.open(player);
        const user = player.user;
        const m = menu.new(player, "", player.user.LangString("chest.34133a04917f8021405a3ec9d07dd736"));
        m.sprite = "shopui_title_gr_gunmod";

        m.newItem({
            name: player.user.LangString("chest.e8b39c6da4cd98e673f7bdbc4f22da1a"),
            onpress: () => {
                this.open(player);
            }
        })

        if(user.grab_item && user.grab_item.length > 0){
            m.newItem({
                name: player.user.LangString("chest.905f6c1fad1f2915eb8faf50565d49e8"),
                onpress: () => {
                    if(!user.grab_item || user.grab_item.length == 0) return;
                    if(user.is_gos){
                        player.notify(player.user.LangString("chest.0be55865d57056c9c9e408d1efcfc494"), 'success')
                    } else {
                        user.grab_item.map(q => this.addItem(q.id, q.amount))
                        player.notify(player.user.LangString("chest.eb318ebdb3f6a3614607df91690cfb72"), 'success');
                        Logs.newMany(`chest_${this.id}`, `${user.name} ${user.id}`, langStringDefault("chest.0bfbb714b5a6bf6a63dc3ac216439613"))
                    }
                    user.grab_item = [];
                    this.menu(player);
                }
            })
        }

        if(user.is_gos && CHEST_RECYCLING_LIST.length > 0){
            m.newItem({
                name: player.user.LangString("chest.1168afad81c19505d326d767a58b2a96"),
                onpress: () => {
                    const myItems = user.inventory.filter(q => CHEST_RECYCLING_LIST.find(z => z.item_id === q.item_id))
                    if(myItems.length === 0) return player.notify(player.user.LangString("chest.2b8914a7e035376a9845e97ffcf1a9d3"), "error");
                    const submenu = menu.new(player, player.user.LangString("chest.d204843409ca5ca84ee06e94809740ba"), player.user.LangString("chest.7205ed1bd17c5db0082ff5fa37cc90e3"));
                    submenu.sprite = "shopui_title_gr_gunmod";
                    submenu.onclose = () => {
                        this.menu(player);
                    }
                    myItems.map(item => {
                        const name = getItemName(item)
                        submenu.newItem({
                            name,
                            onpress: () => {
                                if(!user.inventory.find(q => q.id === item.id)) return player.notify(player.user.LangString("chest.1e036c3f0543a9272483ac05617bbb51"), 'error');
                                const cfg = inventoryShared.get(item.item_id);
                                if(!cfg) return;
                                if(cfg.default_count && cfg.default_count > 1 && item.count < cfg.default_count) return player.notify(player.user.LangString("chest.d058801c1f1676062d2ba9dd3c731044"), 'error');
                                let count = Math.floor(item.count / cfg.default_count)
                                const sum = CHEST_RECYCLING_LIST.find(z => z.item_id === cfg.item_id).price * count
                                user.addMoney(sum, false, user.LangString("chest.10750b7fca73dbd4c9f100d979b7b861", name, count))
                                Logs.newMany(`chest_${this.id}`, `${user.name} ${user.id}`, langStringDefault("chest.7c99ad7c9d666b96f881a5e6a2cdf1cf", name, count))
                                inventory.deleteItem(item);
                                player.notify(player.user.LangString("chest.1a9c17262ec39ce00e7ce2e6c0c31de2", name, sum), 'success')
                            }
                        })
                    })

                    submenu.open()
                }
            })
        }
        m.newItem({
            name: player.user.LangString("chest.67ee5c723dd4c2a683d544a3c72c42f2"),
            onpress: () => {
                const myItems = user.inventory;
                if (myItems.length === 0)
                    return player.notify(player.user.LangString("chest.2b3e9a6d2f7336d862532f3da11372e6"), "error");
        
                const submenu = menu.new(
                    player,
                    player.user.LangString("chest.c6ceb1a10aed123c1464c265dc128309"),
                    player.user.LangString("chest.13b6321037e38c194d6c97f819a5b72c")
                );
                submenu.sprite = "shopui_title_gr_gunmod";
                submenu.onclose = () => {
                    this.menu(player);
                };
        
                myItems.forEach(originItem => {
                    // Copie pentru siguranță context (nu pierde referința în callback)
                    const item = { ...originItem };
                    const name = getItemName(item);
                    submenu.newItem({
                        name,
                        onpress: () => {
                            if (!user.inventory.find(q => q.id === item.id))
                                return player.notify(player.user.LangString("chest.23a7305bb6acbaf4b8c1380d88e3667f"), 'error');
        
                            const cfg = inventoryShared.get(item.item_id);
                            if (!cfg) return;
        
                            // ARMOR - logica originală, fără input!
                            if (item.item_id === ARMOR_ITEM_ID) {
                                const availableArmorName = this.fraction
                                    ? fractionCfg.getFraction(this.fraction).armorName : ArmorNames.StandardArmor;
        
                                if (item.serial !== availableArmorName) {
                                    return player.notify(player.user.LangString("chest.29765adc265903e79613ccaaf8d75812", availableArmorName), 'error');
                                }
        
                                const unbrokenArmorCount = this.fraction && fractionCfg.getFraction(this.fraction).gos
                                    ? 100 : 50;
        
                                if (item.count < unbrokenArmorCount) {
                                    return player.notify(player.user.LangString("chest.ffebede796fd2f0bd1e73ad954a9963c"));
                                }
        
                                this.addItem(item.item_id, 1);
                                Logs.newMany(
                                    `chest_${this.id}`,
                                    `${user.name} ${user.id}`,
                                    langStringDefault("chest.92124d42a08a0bb0f02853149909b67d", getBaseItemNameById(item.item_id), 1)
                                );
                                inventory.deleteItem(item);
                                player.notify(player.user.LangString("chest.66394046bcc245e97115414064a92fc3", name));
                                return;
                            }
        
                            // Pentru restul itemelor, cere input de cantitate
                            menu.input(
                                player,
                                `Cate bucati vrei sa depozitezi? (maxim ${item.count})`,
                                item.count, 1, "int"
                            ).then(val => {
                                const amount = parseInt(val);
                                if (isNaN(amount) || amount <= 0)
                                    return player.notify("Cantitate invalida.", "error");
                                if (amount > item.count)
                                    return player.notify("Nu ai atatea bucati!", "error");
        
                                if (cfg.default_count && cfg.default_count > 1 && amount < cfg.default_count)
                                    return player.notify(player.user.LangString("chest.dd8c397f7eaa5c18fc2256d9591d049b"), 'error');
        
                                this.addItem(item.item_id, amount);
                                Logs.newMany(
                                    `chest_${this.id}`,
                                    `${user.name} ${user.id}`,
                                    langStringDefault("chest.92124d42a08a0bb0f02853149909b67d", getBaseItemNameById(item.item_id), amount)
                                );
                                if (amount === item.count) {
                                    inventory.deleteItem(item);
                                } else {
                                    item.count -= amount;
                                }
                                player.notify(player.user.LangString("chest.66394046bcc245e97115414064a92fc3", name));
                            });
                        }
                    });
                });
        
                submenu.open();
            }
        });
                
        // m.newItem({
        //     name: player.user.LangString("chest.67ee5c723dd4c2a683d544a3c72c42f2"),
        //     onpress: () => {
        //         // const myItems = user.inventory.filter(q => this.items.map(s => s[0]).includes(q.item_id))
        //         const myItems = user.inventory;
        //         if(myItems.length === 0) return player.notify(player.user.LangString("chest.2b3e9a6d2f7336d862532f3da11372e6"), "error");
        //         const submenu = menu.new(player, player.user.LangString("chest.c6ceb1a10aed123c1464c265dc128309"), player.user.LangString("chest.13b6321037e38c194d6c97f819a5b72c"));
        //         submenu.sprite = "shopui_title_gr_gunmod";
        //         submenu.onclose = () => {
        //             this.menu(player);
        //         }
        //         myItems.map(item => {
        //             const name = getItemName(item)
        //             submenu.newItem({
        //                 name,
        //                 onpress: () => {
        //                     if(!user.inventory.find(q => q.id === item.id)) return player.notify(player.user.LangString("chest.23a7305bb6acbaf4b8c1380d88e3667f"), 'error');
        //                     const cfg = inventoryShared.get(item.item_id);
        //                     if(!cfg) return;

        //                     let count = 0;

        //                     if (item.item_id === ARMOR_ITEM_ID) {
        //                         const availableArmorName = this.fraction
        //                             ? fractionCfg.getFraction(this.fraction).armorName : ArmorNames.StandardArmor;

        //                         if (item.serial !== availableArmorName) {
        //                             return player.notify(player.user.LangString("chest.29765adc265903e79613ccaaf8d75812", availableArmorName), 'error');
        //                         }

        //                         const unbrokenArmorCount = this.fraction && fractionCfg.getFraction(this.fraction).gos
        //                             ? 100 : 50;

        //                         if (item.count < unbrokenArmorCount) {
        //                             return player.notify(player.user.LangString("chest.ffebede796fd2f0bd1e73ad954a9963c"));
        //                         }

        //                         count = 1;
        //                     }
        //                     else {
        //                         if (cfg.default_count && cfg.default_count > 1 && item.count < cfg.default_count) return player.notify(player.user.LangString("chest.dd8c397f7eaa5c18fc2256d9591d049b"), 'error');

        //                         count = Math.floor(item.count / cfg.default_count)
        //                     }

        //                     this.addItem(item.item_id, count);
        //                     Logs.newMany(`chest_${this.id}`, `${user.name} ${user.id}`, langStringDefault("chest.92124d42a08a0bb0f02853149909b67d", getBaseItemNameById(item.item_id), count))
        //                     inventory.deleteItem(item);
        //                     player.notify(player.user.LangString("chest.66394046bcc245e97115414064a92fc3", name))
        //                 }
        //             })
        //         })

        //         submenu.open()
        //     }
        // })
        if (veh) {
            m.newItem({
                name: player.user.LangString("chest.326b534195fbf5c1bc20cd74d22c9cea"),
                onpress: () => {
                    if (!mp.vehicles.exists(veh)) return player.notify(player.user.LangString("chest.de562476a6d8ba149b40bba5932f9bb9"), "error");
                    if (!veh.fractionOrder) return player.notify(player.user.LangString("chest.83a69f64b574e42c7bbd5005ea32134f"), "error");
                    if (!veh.fractionOrder.length) return player.notify(player.user.LangString("chest.14088baecfaa2afd9e88d5ae71985381"), "error");
                    //if (system.distanceToPos(player.position, veh.position) > 30) return player.notify("Транспорт слишком далеко", "error");
                    const driver = veh.getOccupant(0);
                    if(!driver || !mp.players.exists(driver)) return player.notify(player.user.LangString("chest.38c8dd5a9862c5ddf37f7a8817682fc5"), "error")
                    if (this.fraction && driver.user.fraction !== this.fraction) return player.notify(player.user.LangString("chest.eda2dc2466c007365a92de2fdb1e0f49"), "error")
                    if (this.family && driver.user.familyId !== this.family) return player.notify(player.user.LangString("chest.01b6ba1c47873a5c602992de8907a59b"), "error")
                    const items = [...veh.fractionOrder];
                    veh.fractionOrder = null;
                    let names: [string, number][] = []
                    items.map(([item, amount]) => {
                        const name = getBaseItemNameById(item);
                        if(!names.find(s => s[0] === name)) names.push([name, amount]);
                        if(!this.addItem(item, amount)){
                            player.notify(player.user.LangString("chest.fe3bd99542b123825471adcc0c25ee70", getBaseItemNameById(item), amount), "error");
                        }
                    })

                    Logs.new(`chest_unload_${this.id}`, `${user.name} [${user.id}]`, `${names.map(z => `${z[0]} x${z[1]}`).join(', ')}`)

                    this.save();
                    player.notify(player.user.LangString("chest.d65b92d5aab243b724efe1caf0ed653f"), "success");
                }
            })
        }

        if ((this.fraction && user.rank >= 9) || (this.family && user.familyRank >= 3)) {
            m.newItem({
                name: player.user.LangString("chest.dc0c390298cfd38b3c4b166c6f0311e4"),
                onpress: () => {
                    Logs.open(player, `chest_${this.id}`, player.user.LangString("chest.e7083d637708a2205acae0fa40350e5a"))
                }
            })
        }

        if (!this.haveAccessToChestEdit(player)) return m.open();

        m.newItem({
            name: player.user.LangString("chest.5e6be22f69cd4a1b466db68586aa6f82"),
            desc: player.user.LangString("chest.fb1df147ba628757cabbd6ab4e93b846"),
            onpress: () => {
                this.ranksEdit(player);
            }
        })
        m.newItem({
            name: player.user.LangString("chest.2ad2044cf037a6fc46e55bbac4755e21"),
            // desc: 'In diesem Abschnitt kannst du den Mindestzugriffsrang auf Artikel aus dem Lager konfigurieren' + (user.hasPermission('admin:chest:accessEdit') ? '\n~r~Du hast Zugriff auf die vollständige Bearbeitung von Lagerartikeln' : ''),
            desc: 'In aceasta sectiune poti configura rangul minim de acces la articolele din depozit' + (user.hasPermission('admin:chest:accessEdit') ? '\n~r~Ai acces complet la editarea articolelor din depozit' : ''),

            onpress: () => {
                this.itemsEdit(player);
            }
        })
        m.newItem({
            name: player.user.LangString("chest.9a95c0a4bfacf868b088ab4632bdc231"),
            desc: player.user.LangString("chest.12f65120161229df84f1fd132bef112f"),
            more: `${this.closed ? player.user.LangString("chest.a87de39be02c95463b49e6c7ddf4731d") : player.user.LangString("chest.e3f3f285373073a48cd97ae81d7dc2fa")}`,
            onpress: () => {
                this.closed = !this.closed;
                player.notify(player.user.LangString("chest.d5160d2e51ad04c52f45803dcf474262", this.closed ? player.user.LangString("chest.e382c7dcfac32644b642d28b65bf9035") : player.user.LangString("chest.ae6ec20b1b6ade43a4c0549d4b1f7a6a")), "error");
                this.menu(player);
            }
        })
        m.newItem({
            name: (this.currentSize < this.size ? '~g~' : '~r~')+player.user.LangString("chest.e3245cbb646e2cdea0b9b8adda02f19a"),
            more: player.user.LangString("chest.e875f52c05ecf17ff82e2ad3f853185e", system.numberFormat(this.currentSize / 1000), system.numberFormat(this.size / 1000)),
            onpress: () => {
                if (!user.hasPermission('admin:chest:accessEdit')) return;
                menu.input(player, player.user.LangString("chest.bc34fdba49d2f6bc68eb3ca95f2f6d8c"), this.size / 1000, 9, 'int').then(size => {
                    if (!size) return;
                    this.size = size * 1000
                    player.notify(player.user.LangString("chest.c97311c8a0672685fe4652b124ee5ad9"), "success");
                    this.menu(player);
                })
            }
        })

        if (user.hasPermission('admin:chest:accessEdit')){
            m.newItem({
                name: player.user.LangString("chest.e903144722bcc27d7c186a60ab27f8b0"),
                desc: player.user.LangString("chest.b072bca76407c575fb85d03d9d5397c2"),
                onpress: () => {
                    player.notify(player.user.LangString("chest.912bfb805723708d082321a00cb34ecd"), "error", null, 60000);
                }
            })
            m.newItem({
                name: player.user.LangString("chest.d88bcb46b790f0ac75155481f957c3c0"),
                more: this.name,
                onpress: () => {
                    menu.input(player, player.user.LangString("chest.32179f49390b8544dd99a2df63abcbf6"), this.name).then(name => {
                        if(!name) return;
                        this.name = name
                        player.notify(player.user.LangString("chest.4d78ad4b79acd8d190e15ae694b8362b"), "success");
                        this.menu(player);
                    })
                }
            })
            
            m.newItem({
                name: player.user.LangString("chest.7690d31adf49bf789266554d8b13d381"),
                more: this.prefix,
                desc: player.user.LangString("chest.e21382673113256e50e5d5ce91a115a6"),
                onpress: () => {
                    menu.input(player, player.user.LangString("chest.fe3ae8a6668acda73b72f9808901af59"), this.prefix, 6).then(prefix => {
                        if (!prefix) return;
                        this.prefix = prefix
                        player.notify(player.user.LangString("chest.5dc63c32437642dd7ad65c86c10c1cfc"), "success");
                        this.menu(player);
                    })
                }
            })
            if (user.hasPermission('admin:chest:accessRemote') && system.distanceToPos(player.position, this.pos) > 1 || this.dimension != player.dimension){
                m.newItem({
                    name: player.user.LangString("chest.a219e5fdcf821f44da28783b167f01c3"),
                    onpress: () => {
                        menu.accept(player, player.user.LangString("chest.ef54acf158f96f9f2cb6931b550b250b")).then(status => {
                            if(!status) return;
                            const d = player.dimension;
                            this.pos = new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.98);
                            setTimeout(() => {
                                if (this.dimension != d) this.dimension = d;
                                setTimeout(() => {
                                    if (!mp.players.exists(player)) return;
                                    player.notify(player.user.LangString("chest.341373f2bca0d844b35fb3d8016331e9"), "success")
                                    this.menu(player);
                                }, 500)
                            }, 100)
                        })
                    }
                })
            }
            m.newItem({
                name: player.user.LangString("chest.7afd0840a85648ec30bce526fec02d70"),
                more: player.user.LangString("chest.d031ec8900028301047b792a40808309"),
                onpress: () => {
                    menu.accept(player, player.user.LangString("chest.a8c7d5e78dabd83a8de82e99d6dc72fd")).then(status => {
                        if (!status) return;
                        this.delete();
                        player.notify(player.user.LangString("chest.c889d042b614112e9905cd3cd1225c1d"), "success");
                    })
                }
            })
        }
        m.open()
    }
    open(player: PlayerMp){
        if (!this.haveAccessToChest(player)) return player.notify(player.user.LangString("chest.f2b4d29653940d77be1baa8e09dfa6c7"), "error");
        if (!this.haveAccessToChestEdit(player) && this.closed) return player.notify(player.user.LangString("chest.b7ec08d49e8e264ee813f1856664158c"), "error");

        CustomEvent.triggerClient(player, "chest:open", this.id, this.name, this.items.map(item => {
            return {
                id: item[0],
                amount: item[1],
                canTake: this.canTakeItem(player, item[0], true)
            }
        }))

    }
    delete(){
        if (this.label) this.label.destroy();
        if (this.colshape) this.colshape.destroy();
        if (this.blip) this.blip.destroy();
        this.data.remove()
        fractionChest.list.delete(this.id);
    }
    static delete(id: number){
        const item = this.get(id);
        if(item) item.delete();
    }
    static saveAll(){
        this.list.forEach(item => {
            item.save();
        })
    }
}


const createChest = (player: PlayerMp, data?: FractionChestEntity) => {
    menu.input(player, player.user.LangString("chest.fcf34013933d40728d182c5663d2d202"), data ? data.name : "").then(name => {
        if (!name) return openChestAdmin(player);
        menu.input(player, player.user.LangString("chest.2b4f1be274cc8ef594cd3a9111da7bbd"), data ? data.prefix : "", 6).then(prefix => {
            if (!prefix) return openChestAdmin(player);
            const m = menu.new(player, player.user.LangString("chest.c559bc41d5f82fbd092af70749b149d2"));
            
            m.newItem({
                name: player.user.LangString("chest.381a1176a5e4cdf7a10a454a68b936b9"),
                onpress: () => {
                    menu.selectFraction(player, 'all', data ? data.fraction : 0).then(fraction => {
                        if (!fraction) return openChestAdmin(player);
                        fractionChest.create(name, prefix, fraction, new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.98), player.dimension);
                        player.notify(player.user.LangString("chest.b03f1e3a485b529f2d7899c416a4a4d0"), "success");
                        setTimeout(() => {
                            if (mp.players.exists(player)) openChestAdmin(player)
                        }, 500)
                    }).catch(err => {
                        system.debug.error(langStringDefault("chest.ac4ec41fcfa127f2bbeb714047f2f335"), err);
                        if (!mp.players.exists(player)) return;
                        player.notify(player.user.LangString("chest.72f6afb2120c29bc9d39f5d1e9680849"))
                    })
                }
            })
            m.newItem({
                name: player.user.LangString("chest.f897689947fb307dddb6e9ae4b752c34"),
                onpress: () => {
                    menu.selectFamily(player).then(familyId => {
                        if (!familyId) return openChestAdmin(player);
                        fractionChest.createForFamily(name, prefix, familyId, new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.98), player.dimension);
                        player.notify(player.user.LangString("chest.947c63d68d1404d3e9e5ec1531abc9ef"), "success");
                        setTimeout(() => {
                            if (mp.players.exists(player)) openChestAdmin(player)
                        }, 500)
                    }).catch(err => {
                        system.debug.error(langStringDefault("chest.3a06a5abe6491da21b90733d8474b5b9"), err);
                        if (!mp.players.exists(player)) return;
                        player.notify(player.user.LangString("chest.8f962c1ae45a1033960ac2b91dd1d1e1"))
                    })
                }
            })
            m.open();
        })
    })
}

const openChestAdmin = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:chest:accessRemote')) return player.notify(player.user.LangString("chest.194e205a7b222244690dc1de080aba73"));
    const m = menu.new(player, player.user.LangString("chest.ac9c108698cbe69f2325c90b3b6565c3"), player.user.LangString("chest.1896ed548ef5ade72675d8d7c7370aba"));

    fractionChest.list.forEach(item => {
        m.newItem({
            name: item.name,
            more: item.fraction ? fractionCfg.getFractionName(item.fraction) : Family.getByID(item.family).name,
            onpress: () => {

                const submenu = menu.new(player, player.user.LangString("chest.158b3e072809bbef799384b614b5c492"), item.name);
                submenu.onclose = () => { openChestAdmin(player) }
                submenu.newItem({
                    name: player.user.LangString("chest.b0bbd6e7aa474fcc0dec7398d094359e"),
                    onpress: () => {
                        item.menu(player);
                    }
                })
                submenu.newItem({
                    name: player.user.LangString("chest.4fe1ab090feb039c9cb4405cfa16b2cb"),
                    onpress: () => {
                        createChest(player, item.data);
                    }
                })

                submenu.open();

            }
        })
    })

    m.newItem({
        name: player.user.LangString("chest.eb9aafc542ca2874a8c6620018c869ee"),
        desc: player.user.LangString("chest.7c4cffbe3f8dcb1e47a9b7d29aa3b944"),
        onpress: () => {
            createChest(player)
        }
    })

    m.open();
}

CustomEvent.registerClient('admin:chest:accessRemote', player => {
    openChestAdmin(player);
})

setInterval(() => {
    fractionChest.list.forEach(item => {
        if(!item) return;
        item.takedByItems.forEach((q, i) => {
            if (!q) return;
            item.takedByItems.set(i, q - 1);
        })
        item.takedTotal.forEach((q, i) => {
            if (!q) return;
            item.takedTotal.set(i, q - 1);
        })
        item.save();
    })
}, 60000)

CustomEvent.registerCef('chest:take', (player, id: number, item_id: number) => {
    const chest = fractionChest.get(id);
    if(chest) chest.giveItem(player, item_id);
})
