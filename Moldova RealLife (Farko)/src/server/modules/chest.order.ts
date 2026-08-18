import { langStringDefault } from "../../shared/lang";
import {colshapeHandle, colshapes} from "./checkpoints";
import {menu} from "./menu";
import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {getBaseItemNameById} from "../../shared/inventory";
import {FractionChestOrderEntity} from "./typeorm/entities/chest";
import {User} from "./user";
import {Vehicle} from "./vehicles";
import {fractionChest} from "./chest";
import {DynamicBlip} from "./dynamicBlip";
import {ScaleformTextMp} from "./scaleform.mp";
import {saveEntity} from "./typeorm";
import {Logs} from "./logs";
import {FamilyReputationType} from "../../shared/family";
import {Family} from "./families/family";
import {OrderedItem, OrderItem, OrderMenuStyle} from "../../shared/chest";
import {fractionCfg} from "./fractions/main";

const paramsName = [
    langStringDefault("chest.order.c89ceeb05140feed22b8aa7c5395d14d"),
    langStringDefault("chest.order.c9c2032c93e939c589bd726387e2d053"),
    langStringDefault("chest.order.1cf1019e8a28c8889e6be81de9bbcb7d"),
    langStringDefault("chest.order.1d3b380f1da00cef3abf969818ff3f72"),
    langStringDefault("chest.order.7d463356b24e50b670b4b002fefa1904"),
    langStringDefault("chest.order.ecb9e0506e905a0ceca4484eef5f505a"),
];

export class fractionChestOrder {
    static list = new Map<number, fractionChestOrder>()
    label: ScaleformTextMp;
    blip: DynamicBlip;
    limitEnable = new Map<number, boolean>();
    static get(id: number) {
        return this.list.get(id);
    }
    static getByFraction(id: number) {
        let item: fractionChestOrder;
        this.list.forEach(q => {
            if (q.fraction === id) item = q;
        })
        return item;
    }
    static getByFamily(type: FamilyReputationType) {
        let item: fractionChestOrder;
        this.list.forEach(q => {
            if (q.familyType == type) item = q;
        })
        return item;
    }

    private static createChest(fraction: number, pos: Vector3Mp, dimension: number, items?: [number, number, number, number, number, number][], family?: FamilyReputationType) {
        let entity = new FractionChestOrderEntity();
        entity.fraction = fraction;
        entity.familyType = family;
        entity.x = pos.x;
        entity.y = pos.y;
        entity.z = pos.z;
        entity.d = dimension;
        if (items) entity.items = items;
        entity.save().then(ent => {
            this.load(ent);
        })
    }
    
    static createForFamily(familyType: FamilyReputationType, pos: Vector3Mp, dimension: number, items?: [number, number, number, number, number, number][]) {
        fractionChestOrder.createChest(0, pos, dimension, items, familyType);
    }
    
    static create(fraction: number, pos: Vector3Mp, dimension: number, items?: [number, number, number, number, number, number][]) {
        fractionChestOrder.createChest(fraction, pos, dimension, items, null);
    }
    static load(data: FractionChestOrderEntity) {
        return new fractionChestOrder(data);
    }
    static loadAll() {
        return FractionChestOrderEntity.find().then(items => {
            items.map(item => {
                this.load(item);
            })
        })
    }
    /** Таймер обратного отсчёта */
    timer = 0;
    colshape: colshapeHandle;
    get pos() {
        return new mp.Vector3(this.data.x, this.data.y, this.data.z);
    }
    set pos(val) {
        this.data.x = val.x
        this.data.y = val.y
        this.data.z = val.z
        this.createColshape();
        this.save();
    }
    get dimension() {
        return this.data.d;
    }
    set dimension(val) {
        this.data.d = val;
        this.createColshape();
        this.save();
    }
    get fraction() {
        return this.data.fraction;
    }
    set fraction(val) {
        this.data.fraction = val;
        this.save();
    }
    get familyType(): FamilyReputationType {
        return this.data.familyType;
    }
    set familyType(val: FamilyReputationType) {
        this.data.familyType = val;
        this.save();
    }
    get items() {
        return this.data.items;
    }
    set items(val) {
        this.data.items = val;
    }
    get closed() {
        return !!this.data.closed;
    }
    set closed(val) {
        this.data.closed = val ? 1 : 0;
        this.save();
    }
    get id() {
        return this.data.id
    }
    get name() {
        return langStringDefault("chest.order.5f444e93476071b24d67e2ceecd1ca61");
    }
    save() {
        saveEntity(this.data);
    }
    data: FractionChestOrderEntity;
    constructor(data: FractionChestOrderEntity) {
        this.data = data;
        this.createColshape();

        fractionChestOrder.list.set(this.id, this);
    }
    createLabel() {
        if (this.label && ScaleformTextMp.exists(this.label)) this.label.destroy();
        this.label = new ScaleformTextMp(new mp.Vector3(this.pos.x, this.pos.y, this.pos.z + 1), `${this.name}`, {
            dimension: this.dimension,
            range: 15
        }, player => this.haveAccessToOrder(player), 'admin', 'fraction');
    }
    createColshape() {
        if (this.colshape) this.colshape.destroy();
        this.createLabel()
        const color = fractionCfg.getFractionColor(this.fraction);
        const rgb = color ? system.hexToRgb(color) : { r: 255, g: 0, b: 0 }
        this.colshape = colshapes.new(this.pos, () => { return this.name }, player => {
            this.menu(player)
        }, {
            dimension: this.dimension,
            type: 27,
            radius: 2,
            color: [rgb.r, rgb.g, rgb.b, 120],
            predicate: player => this.haveAccessToOrder(player)
        }, 'admin', 'fraction');
        if (this.blip) this.blip.destroy();

        this.blip = system.createDynamicBlip(`chestorder_${this.id}`, 501, 1, this.pos, `${this.name}`, {
            dimension: this.dimension,
            fraction: this.fraction,
            family: this.getFamiliesWithAccess()
        });
    }
    getFamiliesWithAccess(): number[] {
        if (this.familyType === null) {
            return null;
        }

        return Family.getAll()
            .filter(f => f.level >= 4)
            .map(f => f.id);
    }
    haveAccessToOrder(player: PlayerMp) {
        const user = player.user;
        if (!user) return false;

        if (user.hasPermission('admin:chestorder:access')) return true;
        if (this.fraction && !user.hasPermission('fraction:chestorder:access')) return false;
        if (this.fraction && user.fraction !== this.fraction) return false;
        if (this.familyType !== null && (!user.family || user.family.reputationType !== this.familyType || user.family.level < 4)) return false;
        
        return true;
    }
    addItem(item_id: number, amount: number = 0) {
        if (!item_id) return;
        // if (!amount) return;
        const items = [...this.items];
        const target = items.findIndex(q => q[0] === item_id);
        if (target > -1) {
            items[target][1] = items[target][1] + amount;
        }
        else items.push([item_id, amount, 0, 0, 0, 0]);
        this.items = items;
    }
    removeItem(item_id: number, amount: number) {
        if (!item_id) return;
        if (!amount) return;
        const items = [...this.items];
        const target = items.findIndex(q => q[0] === item_id);
        if (target > -1) {
            items[target][1] = items[target][1] - amount;
        }
        if (items[target][1] < 0) items[target][1] = 0;
        
        this.items = items;
    }
    getItemCost(item_id: number) {
        const item = this.items.find(itm => itm[0] === item_id)
        return item ? item[2] : 0
    }
    getItemAmount(item_id: number) {
        const item = this.items.find(itm => itm[0] === item_id)
        return item ? item[1] : 0
    }

    orderItems(player: PlayerMp, orderedItems: OrderedItem[]) {
        if (orderedItems.some(item => this.getItemAmount(item.ItemId) < item.Count)) {
            return player.notify(player.user.LangString("chest.order.27274e9f0153ca0fb21bac40b73f589e"), "error");
        }

        if (this.timer) {
            return player.notify(player.user.LangString("chest.order.71e92bb5e51e5cda7a438e6402f8cafb") + this.timer + player.user.LangString("chest.order.353df236699c051f1f4933cda54f1e2a"), 'error');
        }

        const orderSum = orderedItems
            .map(item => this.getItemCost(item.ItemId) * item.Count)
            .reduce((cost1, cost2) => cost1 + cost2, 0);

        if (orderSum && player.user.money < orderSum) {
            return player.notify(player.user.LangString("chest.order.316742ef8b80398cedbfb788da6fd8db"), "error");
        }

        const veh = User.getNearestVehicle(player, 10);
        if (!veh) return player.notify(player.user.LangString("chest.order.17f3dcfed4572579143e19ad920b86e3"), "error");
        if (this.fraction && veh.fraction !== this.fraction) return player.notify(player.user.LangString("chest.order.516e11586f55286bb92258db3812d3ca"), "error");
        if (Vehicle.getLocked(veh)) return player.notify(player.user.LangString("chest.order.afd401ff67f9ebd7dedf20e0a323d358"), "error")
        if (!Vehicle.isVehicleCommercial(veh)) return player.notify(player.user.LangString("chest.order.da7bc0bc44a78771cca9e312eb2708d7"), "error");
        if (!Vehicle.isVehicleCommercialFree(veh)) return player.notify(player.user.LangString("chest.order.b67589d288499fcf4e69deb6199fd1fa"), "error");

        if (orderSum) {
            player.user.removeMoney(orderSum, true, player.user.LangString("chest.order.3f29cd90aefec23a5c3a8377b76fffe4"));
        }

        player.notify(player.user.LangString("chest.order.36a00581eef7815b391558f4e23bb7bc"), "success");

        orderedItems.forEach(item => {
            this.removeItem(item.ItemId, item.Count);
            const chestItem = this.items.find(i => i[0] === item.ItemId);
            if (!chestItem || !chestItem[5]) {
                return;
            }

            const id = item.ItemId;
            this.limitEnable.set(id, true);
            setTimeout(() => {
                this.limitEnable.delete(id);
            }, chestItem[5] * 60000);
        })

        this.save();
        Logs.new(`chest_order_${this.id}`, `${player.user.name} [${player.user.id}]`,
            `${orderedItems.map(item => `${getBaseItemNameById(item.ItemId)} x${item.Count}`).join(', ')}`)

        const castedOrder = orderedItems.map<[number, number]>(item => [item.ItemId, item.Count]);
        veh.fractionOrder = [...castedOrder];

        player.user.setGui(null);
    }
    openOrderMenu(player: PlayerMp) {
        const user = player.user;
    
        if (!this.haveAccessToOrder(player)) {
            return player.notify("Nu ai acces sa comanzi marfa.", "error");
        }
    
        if (!user.hasPermission('admin:chestorder:access') && this.closed) {
            return player.notify("Comanda de marfuri este închisa.", "error");
        }
    
        if (this.timer) {
            return player.notify(
                player.user.LangString("chest.order.0e9ebd91496e3a62c255b43292b74f46") + this.timer +
                player.user.LangString("chest.order.ade35e928ad5e2a7ed12429bc9746f41"),
                'error'
            );
        }
    
        const m = menu.new(player, this.name, "Comanda marfa");
    
        this.items.forEach(item => {
            const [itemId, amount, price] = item;
            const blocked = this.limitEnable.has(itemId);
            if (amount <= 0 || blocked) return;
    
            m.newItem({
                name: `${getBaseItemNameById(itemId)} (x${amount})`,
                more: `${price}$`,
                onpress: () => {
                    menu.input(player, `Cate vrei sa comanzi?`, '', 5, 'int').then(val => {
                        if (typeof val !== 'number' || val <= 0 || val > amount) return;
    
                        this.orderItems(player, [{ ItemId: itemId, Count: val }]);
                    });
                }
            });
        });
    
        m.open();
    }
            
    // openOrderMenu(player: PlayerMp) {
    //     const user = player.user;
    //     if (!this.haveAccessToOrder(player)) return player.notify(player.user.LangString("chest.order.288c074fbd30027c1824210a2004857d"), "error");
    //     if (!user.hasPermission('admin:chestorder:access') && this.closed) return player.notify(player.user.LangString("chest.order.0c1584b1104771c532b5afec946a682f"), "error");
    //     if (this.timer) return player.notify(player.user.LangString("chest.order.0e9ebd91496e3a62c255b43292b74f46") + this.timer + player.user.LangString("chest.order.ade35e928ad5e2a7ed12429bc9746f41"), 'error');

    //     user.selectedChestOrderId = this.id;
    //     const availableItems = this.items.map<OrderItem>(item => {
    //         return {
    //             ItemId: item[0],
    //             IsBlocked: this.limitEnable.has(item[0]),
    //             MaxCount: system.smallestNumber(item[5], item[1]),
    //             Price: item[2]
    //         };
    //     });

    //     user.setGui('orderofgoods', 'orderOfGoods::set',
    //         user.money, user.bank_money,
    //         this.getOrderMenuStyle(), availableItems);
    //     return;
    // }

    getOrderMenuStyle(): OrderMenuStyle {
        if (this.fraction) {
            return fractionCfg.getFraction(this.fraction).gos ? 'gov' : 'gang';
        } else {
            return this.familyType === 0 ? 'PSC' : 'mafia';
        }
    }

    menu(player: PlayerMp) {
        const user = player.user;
        if (!this.haveAccessToOrder(player)) return player.notify(player.user.LangString("chest.order.5154486c7b388dd81340e9b87266eb63"), "error");
        if (!user.hasPermission('admin:chestorder:access') && this.closed) return player.notify(player.user.LangString("chest.order.286a65b7528556785f158c50ca2152cf"), "error");

        if (user.hasPermission('admin:chestorder:access')) {
        // if (user.hasPermission('admin:chestorder:access') && this.fraction !== 2) {
            const m = menu.new(player, "", this.name);
            m.sprite = "shopui_title_gr_gunmod";

            m.newItem({
                name: player.user.LangString("chest.order.b724205df63e77e06e7a88eff8c4a95a"),
                onpress: () => {
                    this.openOrderMenu(player);
                }
            })

            m.newItem({
                name: player.user.LangString("chest.order.e7d12d2b539c57545fe374538e5ef930"),
                desc: player.user.LangString("chest.order.1a09e2287b08acb6e97765d38d807b7b"),
                onpress: () => {
                    const itemsMenu = () => {
                        const submenu = menu.new(player, player.user.LangString("chest.order.be0d9efc2912e468893f77cfcee60ed8"), player.user.LangString("chest.order.27d1980d0661368f4e38782c30b9fa0b"));
                        submenu.onclose = () => { this.menu(player) }
                        this.items.map(qs => {
                            submenu.newItem({
                                name: getBaseItemNameById(qs[0]),
                                icon: `Item_${  qs[0]}`,
                                onpress: () => {
                                    const itemchoise = () => {
                                        const item = this.items.find(q => q[0] === qs[0]);
                                        const itemmenu = menu.new(player, getBaseItemNameById(item[0]), player.user.LangString("chest.order.dfbaaf96fe847e908502755b349e0cf6"));
                                        itemmenu.onclose = () => { itemsMenu() }


                                        paramsName.map((param, i) => {
                                            const index = i + 1;
                                            itemmenu.newItem({
                                                name: param.split('|')[0],
                                                desc: param.split('|')[1],
                                                more: `${item[index] || 0}`,
                                                onpress: () => {
                                                    menu.input(player, player.user.LangString("chest.order.72048d2c1e9e508b8f62410939b697b4") + param, item[index], 6, 'int').then(val => {
                                                        if (typeof val !== "number") return;
                                                        const findex = this.items.findIndex(q => q[0] === item[0]);
                                                        if (findex > -1) {
                                                            const items = [...this.items];
                                                            items[findex][index] = val;
                                                            this.items = items;
                                                            this.save();
                                                            player.notify(player.user.LangString("chest.order.17c863f0596eb8f0fb7026d63e938ed4"), "success")
                                                        } else {
                                                            player.notify(player.user.LangString("chest.order.20d543d3ec275353e7e56d69e3684480"), "error");
                                                        }
                                                        setTimeout(() => {
                                                            if(mp.players.exists(player)) itemchoise();
                                                        }, 100)
                                                    })
                                                }
                                            })
                                        })


                                        itemmenu.newItem({
                                            name: player.user.LangString("chest.order.d9f7565ac03b760b9086cdc9f8adedd5"),
                                            onpress: () => {
                                                menu.accept(player).then(status => {
                                                    if(!status) return;
                                                    const findex = this.items.findIndex(q => q[0] === item[0]);
                                                    if (findex > -1) {
                                                        const items = [...this.items];
                                                        items.splice(findex, 1)
                                                        this.items = [...items];
                                                        this.save();
                                                        player.notify(player.user.LangString("chest.order.b2a986eb561ed2c51711b9d54f0a8b4f"), "success")
                                                    } else {
                                                        player.notify(player.user.LangString("chest.order.1e27c1728bfedcb234b7bd616d800757"), "error");
                                                    }
                                                    setTimeout(() => {
                                                        if(mp.players.exists(player)) itemchoise();
                                                    }, 100)
                                                })
                                            }
                                        })

                                        itemmenu.open();
                                    }
                                    itemchoise();
                                }
                            })
                        })
                        submenu.newItem({
                            name: player.user.LangString("chest.order.a2ae3b76040dc28efe77946879a6ba4c"),
                            onpress: () => {
                                menu.selectItem(player).then(item => {
                                    if (!item) return this.menu(player);
                                    menu.input(player, player.user.LangString("chest.order.4ccca12891272ceaa148c8c4ce330ff7"), '1', 5, 'int').then(amount => {
                                        if (typeof amount !== 'number') return this.menu(player);
                                        if (amount < 0) return this.menu(player);
                                        this.addItem(item, amount);
                                        this.save();
                                        this.menu(player);
                                        player.notify(player.user.LangString("chest.order.9bbaf979716fcc8a8e84013a0cb61e4d"), "success");
                                    })

                                })
                            }
                        })
                        submenu.newItem({
                            name: player.user.LangString("chest.order.7b8ab0e92097fe6fba2b2bb68f114543"),
                            desc: player.user.LangString("chest.order.8bb946d8c31575b83f368757caabea79"),
                            onpress: () => {
                                menu.accept(player).then(status => {
                                    if (!status) return this.menu(player);
                                    this.items = [];

                                    fractionChest.list.forEach(chest => {
                                        if (chest.fraction !== this.fraction) return;
                                        chest.items.map(item => {
                                            if (this.items.find(q => q[0] === item[0])) return;
                                            this.addItem(item[0]);
                                        })
                                    })

                                    player.notify(player.user.LangString("chest.order.891420da71a6514204686f0211898e8b"), "success");
                                    this.save();
                                    this.menu(player);
                                })
                            }
                        })
                        submenu.open();
                    }
                    itemsMenu();
                }
            })

            m.newItem({
                name: player.user.LangString("chest.order.725523f9e8d873cc41e27d98dd49943f"),
                desc: player.user.LangString("chest.order.93d28c752f22ba925ec9b6c2d343a035"),
                more: `${this.closed ? player.user.LangString("chest.order.84d9a774b7a52a2a131cd277f12756f7") : player.user.LangString("chest.order.00e858c336b0d944428e17b0958ae975")}`,
                onpress: () => {
                    this.closed = !this.closed;
                    player.notify(player.user.LangString("chest.order.eec5eadae8469ab1cc2889d21f93de2c", this.closed ? player.user.LangString("chest.order.3a60247017aa61363ec5db5438a39fa2") : player.user.LangString("chest.order.e833e6902c683c52227a95502fe1e4e3")), "error");
                    this.menu(player);
                }
            })
            m.newItem({
                name: player.user.LangString("chest.order.2e8998da1ac301e2b63aa0ef8368e27d"),
                more: this.name
            })

            m.newItem({
                name: player.user.LangString("chest.order.7aa052b81ce0e8d765c7ae636df3d16d"),
                onpress: () => {
                    menu.accept(player, player.user.LangString("chest.order.48ddcdbb93d79deb6497244dd6a1719e")).then(status => {
                        if (!status) return;
                        const d = player.dimension;
                        this.pos = player.position;
                        setTimeout(() => {
                            if (this.dimension != d) this.dimension = d;
                            setTimeout(() => {
                                if (!mp.players.exists(player)) return;
                                player.notify(player.user.LangString("chest.order.86b2d34b93fac20f76f97d608fdbc776"), "success")
                                this.menu(player);
                            }, 500)
                        }, 100)
                    })
                }
            })
            m.newItem({
                name: player.user.LangString("chest.order.e233f7df117edbd10eb5d8ebbd922916"),
                more: player.user.LangString("chest.order.d9ba07816e6671ca19dfa0d7514e5ef0"),
                onpress: () => {
                    menu.accept(player, player.user.LangString("chest.order.aaa2c4af13cfa5116d44fd67ff3fc882")).then(status => {
                        if (!status) return;
                        this.delete();
                        player.notify(player.user.LangString("chest.order.ab4eb77e3355344d9e92545cbb341e81"), "success");
                    })
                }
            })

            m.open();
            return;
        }

        this.openOrderMenu(player);
    }
    delete() {
        if (this.label) this.label.destroy();
        if (this.colshape) this.colshape.destroy();
        this.data.remove()
        fractionChestOrder.list.delete(this.id);
    }
    static delete(id: number) {
        const item = this.get(id);
        if (item) item.delete();
    }
    static saveAll() {
        this.list.forEach(item => {
            item.save();
        })
    }
}

const adminMenu = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:chestorder:access')) return player.notify(player.user.LangString("chest.order.9210ac87e7507c8e1093ce8779af2b68"), "error");
    const m = menu.new(player, player.user.LangString("chest.order.a5c68dfa842fdd793f56ab11a2a54ebc"), player.user.LangString("chest.order.62d372e9974bc115655809d5fd02b122"));

    fractionChestOrder.list.forEach(item => {
        m.newItem({
            name: item.name,
            onpress: () => {
                const submenu = menu.new(player, item.name, player.user.LangString("chest.order.304e6287acd16000334ed3bb88144b9c"));
                submenu.newItem({
                    name: player.user.LangString("chest.order.d20bb12f9fbb0a4da8af829420eff167"),
                    onpress: () => {
                        item.menu(player);
                    }
                })
                submenu.newItem({
                    name: player.user.LangString("chest.order.fc423d71e73d90e3376de45f9000336f"),
                    onpress: () => {
                        menu.selectFraction(player, 'all', item.fraction).then(fraction => {
                            if (!fraction) return;
                            if (fractionChestOrder.getByFraction(fraction)) return player.notify(player.user.LangString("chest.order.14a60ca643577c8cc973ebf9c67b19e0"), "error");
                            fractionChestOrder.create(fraction, new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.9), player.dimension, item.items);
                            player.notify(player.user.LangString("chest.order.93cd8a14d30a7b7519a53d6583727f64"), "success");
                        })
                    }
                })

                submenu.open();
            }
        })
    })

    m.newItem({
        name: player.user.LangString("chest.order.08683a53e9eb6f5e2be741ee571cbb76"),
        desc: player.user.LangString("chest.order.9e936249bf2cc23bf19fd83359a0bc88"),
        onpress: () => {
            const submenu = menu.new(player, player.user.LangString("chest.order.811dd9c602b6602319277a6911ee0677"));
            submenu.newItem({
                name: player.user.LangString("chest.order.de98b227343d1382c32e6e24e83e1642"),
                onpress: () => {
                    const subSubMenu = menu.new(player, player.user.LangString("chest.order.92fbd400e44e40e6dfb9ebecf765edd8"));
                    subSubMenu.newItem({
                        name: player.user.LangString("chest.order.74e993a44f4e0a27abde0e770d56a79d"),
                        onpress: () => {
                            fractionChestOrder.createForFamily(FamilyReputationType.CRIME, new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.9), player.dimension);
                            player.notify(player.user.LangString("chest.order.0b94f01d8d0fb4aebb9406191064175a"), "success");
                        }
                    })
                    subSubMenu.newItem({
                        name: player.user.LangString("chest.order.778e3de6f344760cae18d0ac42578a63"),
                        onpress: () => {
                            fractionChestOrder.createForFamily(FamilyReputationType.CIVILIAN, new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.9), player.dimension);
                            player.notify(player.user.LangString("chest.order.a96ec7ddcbabf9ea7650ad1d35d241c2"), "success");
                        }
                    })
                    
                    subSubMenu.open();
                }
            })
            submenu.newItem({
                name: player.user.LangString("chest.order.5e5d2e0da4885995e28863bc0b81247c"),
                onpress: () => {
                    menu.selectFraction(player, 'all').then(fraction => {
                        if (!fraction) return player.notify(player.user.LangString("chest.order.a6c4672d09c3297bbc02fc6edd2929a7"), 'error');
                        if (fractionChestOrder.getByFraction(fraction)) return player.notify(player.user.LangString("chest.order.ad1cfc795d7ee3e889a068334db9c522"), "error");
                        fractionChestOrder.create(fraction, new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.9), player.dimension);
                        player.notify(player.user.LangString("chest.order.22390b0a43494f5ecd6df931de8f4bc2"), "success");
                    })
                }
            })
            
            submenu.open();
        }
    })

    m.open();
}

CustomEvent.registerClient('admin:chestorder:access', player => {
    adminMenu(player)
})

CustomEvent.registerCef('orderOfGoods::buyItems', (player, orderedItems: OrderedItem[]) => {
    if (!player || !player.user) {
        return;
    }

    const orderChestId = player.user.selectedChestOrderId;
    if (!orderChestId) {
        return;
    }

    const orderChest = fractionChestOrder.list.get(orderChestId);
    if (!orderChest) {
        return;
    }

    orderChest.orderItems(player, orderedItems);
});

setInterval(() => {
    fractionChestOrder.list.forEach(item => {
        if (item.timer > 0) item.timer--;
        else item.timer = 0;
    })
}, 60000)
setInterval(() => {
    fractionChestOrder.list.forEach(chest => {
        let haveUpdate = false;
        const items = [...chest.items]
        items.map((item, index) => {
            if (!item[3]) return;
            if (item[1] >= item[4]) return;
            haveUpdate = true;
            items[index][1] += item[3];
        })
        if (haveUpdate) {
            chest.items = items
            chest.save();
        }
    })
}, 60000 * 60 * 6)