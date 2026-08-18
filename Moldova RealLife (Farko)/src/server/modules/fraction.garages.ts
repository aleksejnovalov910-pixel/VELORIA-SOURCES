import { langStringDefault } from "../../shared/lang";
import {FractionGarageEntity} from "./typeorm/entities/fraction.garage";
import {colshapeHandle, colshapes} from "./checkpoints";
import {system} from "./system";
import {menu} from "./menu";
import {Vehicle} from "./vehicles";
import {CustomEvent} from "./custom.event";
import {User} from "./user";
import {DynamicBlip} from "./dynamicBlip";
import {ScaleformTextMp} from "./scaleform.mp";
import {fractionCfg} from "./fractions/main";


CustomEvent.registerClient('admin:fraction:garage', player => {
    const open = () => {
        const user = player.user;
        if (!user) return false;
        if (!user.hasPermission("admin:garage:accessRemote")) return player.notify(player.user.LangString("fraction.garages.05e5c814cd25da3350687500266c45ce"), "error");
        const m = menu.new(player, player.user.LangString("fraction.garages.2f00da4132e1f39ca20330f6cf1b3f77"), player.user.LangString("fraction.garages.1ae7c703f1a0e5eaf734b11149f1d04d"));
        FractionGarage.list.forEach(item => {
            m.newItem({
                name: `#${item.id} ${item.name}`,
                onpress: () => {
                    const submenu = menu.new(player, player.user.LangString("fraction.garages.df1fbd407f2d5960222a6b0d5220ff9f"), player.user.LangString("fraction.garages.f72e35fb9ab85d7a604af646b1c92c3a"));
                    submenu.onclose = () => {
                        open();
                    }
                    submenu.newItem({
                        name: player.user.LangString("fraction.garages.4c2d42fd155d881e03b3a545036a31f3"),
                        onpress: () => {
                            item.menu(player);
                        }
                    })
                    submenu.newItem({
                        name: player.user.LangString("fraction.garages.bdcc8890b6ee083c0e949b8b77bfaf0e"),
                        desc: player.user.LangString("fraction.garages.a51d5b2676acc52d021ffe06e7f486fc"),
                        onpress: () => {
                            submenu.close();

                            FractionGarage.create(item.name, item.fraction, new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.9), player.heading, player.dimension, item.cars.map(car => {
                                let item = [...car]
                                item[1] = system.randomStr(8)
                                item[2] = system.getRandomInt(100000, 999999)
                                return item;
                            }));
                        }
                    })
                    submenu.open();
                }
            })
        })
        m.newItem({
            name: player.user.LangString("fraction.garages.c846a23ef5b42f33931586ab15b346a1"),
            desc: player.user.LangString("fraction.garages.ee00cd21217d643fc24215d05dfd5131"),
            onpress: () => {
                menu.selectFraction(player).then(fraction => {
                    if(!fraction) return open();
                    FractionGarage.create(fractionCfg.getFractionName(fraction), fraction, new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.98), player.heading, player.dimension);
                    player.notify(player.user.LangString("fraction.garages.4bac1bcb8029ea01e87cc7072bd45c1e"), "success");
                })
            }
        })
        m.open();
    }
    open();
})


export class FractionGarage {
    data: FractionGarageEntity;
    colshape: colshapeHandle;
    label: ScaleformTextMp;
    blip: DynamicBlip;
    static create(name: string, fraction: number, position: Vector3Mp, heading: number, dimension: number, cars?: any[]){
        const data = new FractionGarageEntity();

        data.name = name;
        data.fraction = fraction;
        data.x = position.x;
        data.y = position.y;
        data.z = position.z;
        data.d = dimension;
        data.h = heading;
        data.cars = cars ? cars : [];

        data.save().then(res => {
            this.load(res)
        })
    }
    static load(data: FractionGarageEntity){
        return new FractionGarage(data)
    }
    static loadAll(){
        return FractionGarageEntity.find().then(datas => {
            datas.map(data => {
                this.load(data);
            })
        })
    }
    static list = new Map < number, FractionGarage>();
    static get(id: number){
        return this.list.get(id);
    }

    get position(){
        return new mp.Vector3(this.data.x, this.data.y, this.data.z)
    }
    set position(val){
        this.data.x = val.x;
        this.data.y = val.y;
        this.data.z = val.z;
        this.createColshape();
        this.save();
    }
    
    get dimension(){
        return this.data.d
    }
    set dimension(val){
        this.data.d = val;
        this.createColshape();
        this.save();
    }
    get heading(){
        return this.data.h
    }
    set heading(val){
        this.data.h = val;
        this.save();
    }
    get id(){
        return this.data.id
    }
    get name(){
        return this.data.name
    }
    set name(val){
        this.data.name = val;
        this.createLabel();
        this.save();
    }
    get prefix(){
        return this.data.prefix
    }
    set prefix(val){
        this.data.prefix = val;
        this.createLabel();
        this.save();
    }
    get cars(){
        return this.data.cars
    }
    set cars(val){
        this.data.cars = val;
    }
    get fraction(){
        return this.data.fraction
    }
    set fraction(val){
        this.data.fraction = val;
        this.save();
    }
    get closed(){
        return !!this.data.closed
    }
    set closed(val){
        this.data.closed = val ? 1 : 0;
        this.save();
    }

    delete(){
        FractionGarage.list.delete(this.id)
        if (this.colshape) this.colshape.destroy();
        if (this.label) this.label.destroy();
        if (this.blip) this.blip.destroy();
        this.data.remove();
    }

    save(){
        this.data.save();
    }

    insertCar(model: string, r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, livery: number){
        const plate = system.randomStr(8);
        const cars = [...this.cars];
        cars.push([model, plate.toUpperCase(), system.getRandomInt(100000, 999999), fractionCfg.getLeaderRank(this.fraction), r1, g1, b1, r2, g2, b2, livery]);
        this.cars = cars;
        this.save();
    }

    constructor(data: FractionGarageEntity){
        this.data = data
        this.createColshape();
        this.cars.map(car => {
            car[1] = car[1].toUpperCase();
        })

        FractionGarage.list.set(this.id, this);
    }
    usedVehicles = new Map<number, string>();
    createLabel(){
        if (this.label && ScaleformTextMp.exists(this.label)) this.label.destroy();
        this.label = new ScaleformTextMp(new mp.Vector3(this.position.x, this.position.y, this.position.z + 1), langStringDefault("fraction.garages.9669aeccea79f1971e08d43f43bd6a47", this.name), {
            dimension: this.dimension,
            range: 10,
            type: "front"
        })
    }
    createColshape(){
        if(this.colshape) this.colshape.destroy();
        this.createLabel();
        const color = fractionCfg.getFractionColor(this.fraction);
        const rgb = color ? system.hexToRgb(color) : {r: 255, g: 0, b: 0};
        
        this.colshape = colshapes.new(this.position, () => {return this.name}, player => {
            this.menu(player)
        }, {
            dimension: this.dimension,
            type: 27,
            radius: 3,
            color: [rgb.r, rgb.g, rgb.b, 120]
        })
        if(this.blip) this.blip.destroy();
        this.blip = system.createDynamicBlip(`garage_${this.id}`, 50, 58, this.position, langStringDefault("fraction.garages.933b862cc16f2c45f433e1e0521b229b", this.name), {
            dimension: this.dimension,
            fraction: this.fraction,
            shortRange: false,
            range: 150
        })
    }
    haveAccessEdit(player: PlayerMp){
        const user = player.user;
        if(!user) return false;
        if (user.hasPermission("admin:garage:accessRemote")) return true;
        if(this.fraction !== user.fraction) return false;
        if (!user.hasPermission("fraction:garage:accessEdit")) return false;
        return true;
    }
    haveAccess(player: PlayerMp){
        const user = player.user;
        if(!user) return false;
        if (user.hasPermission("admin:garage:accessRemote")) return true;
        if(this.fraction === user.fraction) return true;
        return false;
    }
    menu(player: PlayerMp){
        const user = player.user;

        let veh = User.getNearestVehicle(player, 5);
        if (veh) {
            if (veh.garage !== this.id) veh = null;
        }


        if(!this.haveAccess(player)) return player.notify(player.user.LangString("fraction.garages.e7471beb0d58b13b33d130335fe43557"), "error");
        if (!this.haveAccessEdit(player) && !veh) return this.open(player);
        const m = menu.new(player, "", player.user.LangString("fraction.garages.97d31bb526701a1a07314128278928cb", this.name, this.id))
        m.sprite = "shopui_title_ie_modgarage"

        m.newItem({
            name: player.user.LangString("fraction.garages.ca60d0eda2dee9c8a0f2e00152ad5f74"),
            onpress: () => {
                this.open(player);
            }
        })
        m.newItem({
            name: player.user.LangString("fraction.garages.2e9f6842d14a57f1518c5a26beb62e9f"),
            onpress: () => {
                let veh = User.getNearestVehicle(player, 5);
                if (veh) {
                    if (veh.garage !== this.id) veh = null;
                }
                if(!veh){
                    player.notify(player.user.LangString("fraction.garages.ed49249188ffd6e716343edc73bbe287"), "error")
                } else {
                    Vehicle.destroy(veh);
                }
                setTimeout(() => {
                    if(mp.players.exists(player)) this.menu(player);
                }, 100)
            }
        })



        if (!this.haveAccessEdit(player)) return m.open();

        m.newItem({
            name: player.user.LangString("fraction.garages.cb3afab935ddf729a807806c715f6aba"),
            onpress: () => {
                const submenu = menu.new(player, "", player.user.LangString("fraction.garages.e551ada9571c31a0f708eba4375a3052"));
                submenu.onclose = () => {
                    this.save();
                    this.menu(player);
                }
                submenu.sprite = "shopui_title_ie_modgarage"
                let cars = [...this.cars];
                cars.map((car, i) => {
                    const cfg = Vehicle.getVehicleConfig(car[0]);
                    const name = cfg ? cfg.name : car[0];
                    const used = this.usedVehicles.get(car[2]);
                    submenu.newItem({
                        name: `${name} [${car[1]}]`,
                        type: 'list',
                        desc: `${used ? player.user.LangString("fraction.garages.a765de5f2b3ef51e60c98568e8214fd3", used) : player.user.LangString("fraction.garages.0e1f029887e3b448e2f49f10e5493eba")}`,
                        list: fractionCfg.getFractionRanks(this.fraction),
                        listSelected: car[3] - 1,
                        onchange: (val) => {
                            car[3] = val + 1
                        },
                        onpress: () => {
                            if(!user.hasPermission("admin:garage:accessRemote")) return;
                            menu.accept(player, player.user.LangString("fraction.garages.e178619a27dcd742e46a590735e0fd84")).then(status => {
                                if(!status) return;
                                menu.close(player);
                                const used = this.usedVehicles.get(car[2]);
                                if(used) return player.notify(player.user.LangString("fraction.garages.40c519f98574b84cc03dc7485c0a6965"), 'error');
                                cars.splice(i, 1);
                                this.cars = cars;
                                this.save();
                                player.notify(player.user.LangString("fraction.garages.c4a7c10324b2db76a6228d4f2c5f892b"), 'success');
                            })
                        }
                    })
                })

                submenu.newItem({
                    name: player.user.LangString("fraction.garages.046a3d816267f0d97483e902305e1ba8"),
                    onpress: () => {
                        this.cars = cars;
                        this.save();
                        player.notify(player.user.LangString("fraction.garages.4ef1c55f9e2bff3da75f62eb477cd737"), 'success')
                    }
                })

                if (user.hasPermission('admin:garage:accessRemote')){
                    submenu.newItem({
                        type: "range",
                        rangeselect: [1, 10],
                        name: player.user.LangString("fraction.garages.8dd29c90383bb5ff4f01405645cd0680"),
                        desc: player.user.LangString("fraction.garages.0a45c02460c0d8c233a370fa0a74cf8e"),
                        onpress: (itm) => {
                            if(!player.vehicle) return player.notify(player.user.LangString("fraction.garages.75189ca96125e7d2cbffdfd2ad6fa7ae"), "error")
                            const model = player.vehicle.modelname;
                            const color1 = Vehicle.getPrimaryColor(player.vehicle);
                            const color2 = Vehicle.getSecondaryColor(player.vehicle);
                            const livery = player.vehicle.livery
                            for(let id = 0; id <= itm.listSelected; id++) this.insertCar(model, color1.r, color1.g, color1.b, color2.r, color2.g, color2.b, livery);
                            player.notify(player.user.LangString("fraction.garages.4c22d441d81fedeca8b85aab0fc06402"), "success");
                            this.menu(player);
                        }
                    })
                }

                submenu.open();
            }
        })

        m.newItem({
            name: player.user.LangString("fraction.garages.f0a14a4c3e24c3375f894ab7fb4b2116"),
            desc: player.user.LangString("fraction.garages.0dd0b3b20bec84232948e9383a72c782"),
            more: `${this.closed ? player.user.LangString("fraction.garages.b3c093d8357aaa7a96a28f438afb88fe") : player.user.LangString("fraction.garages.e9938b6c6b07f237c62739fe007ccbeb")}`,
            onpress: () => {
                this.closed = !this.closed;
                player.notify(player.user.LangString("fraction.garages.8655556ef6e9b20c578f6c9dc7156868", this.closed ? player.user.LangString("fraction.garages.a8c09438713b7e4be1a63ddb328531ad") : player.user.LangString("fraction.garages.7ef5a89706fe19e6a721c6620d400b32")), "error");
                this.menu(player);
            }
        })

        if (user.hasPermission("admin:garage:accessRemote")){
            if(!this.cars.find(car => Vehicle.isVehicleCommercial(car[0]))){
                m.newItem({
                    name: user.LangString("fraction.garages.7b3087f279570900c8411453cb7fa1d4"),
                    desc: user.LangString("fraction.garages.c1ea51b32c2107f386623db1ec232fb3")
                })
            }
            m.newItem({
                name: user.LangString("fraction.garages.9b70451c002c70893a10bda5a86b4b41"),
                more: this.name,
                onpress: () => {
                    menu.input(player, player.user.LangString("fraction.garages.4563fabb94d2ca6828ce1db03bf0ad3c"), this.name).then(res => {
                        if(!res) return;
                        this.name = res;
                        this.menu(player);
                    })
                }
            })
            m.newItem({
                name: player.user.LangString("fraction.garages.8a8b8c6db9b80375acfec53701a77137"),
                desc: player.user.LangString("fraction.garages.4e58fe6bb0b2edb62536d24c172bebb5"),
                more: this.prefix || player.user.LangString("fraction.garages.496c6cb05c314834da000352b623c09c"),
                onpress: () => {
                    menu.input(player, player.user.LangString("fraction.garages.5e3640092e10dc12c4503eafa8c0d947"), this.prefix).then(res => {
                        if(!res && typeof res !== "string") return;
                        this.prefix = res;
                        this.menu(player);
                    })
                }
            })
            m.newItem({
                name: player.user.LangString("fraction.garages.612083899418da15151a6016b0b15ece"),
                more: this.name,
                onpress: () => {
                    menu.accept(player).then(res => {
                        if (!res) return;
                        this.position = new mp.Vector3(player.position.x, player.position.y, player.position.z - 0.9);
                        if(this.dimension !== player.dimension) this.dimension = player.dimension;
                        player.notify(player.user.LangString("fraction.garages.df9f26ea1ed1fbfb0b0d547873156d3d"), "error");
                    })
                }
            })
            m.newItem({
                name: player.user.LangString("fraction.garages.468f4963feffef2b2987c05938e0cb83"),
                onpress: () => {
                    menu.accept(player).then(res => {
                        if(!res) return;
                        this.delete();
                    })
                }
            })
        }

        m.open();
    }
    open(player: PlayerMp){
        const user = player.user;
        if (!this.haveAccessEdit(player) && this.closed) return player.notify(player.user.LangString("fraction.garages.3954fe3161f87aa2ee043b202156a42d"), "error");
        const m = menu.new(player, "", player.user.LangString("fraction.garages.35a40dfd599d8732161161a84a14dcda"))
        m.sprite = "shopui_title_ie_modgarage"

        this.cars.map((car, carids) => {
            const cfg = Vehicle.getVehicleConfig(car[0]);
            const name = cfg ? cfg.name : car[0];
            const used = this.usedVehicles.get(car[2]);
            const rank = car[3] || 0;
            if(rank > user.rank) return;
            m.newItem({
                name: `${used ? '~r~' : '~g~'}${name}`,
                more: `${car[1]}`,
                desc: used ? player.user.LangString("fraction.garages.ac98433a517aca1dda9aae484ef043da", used) : player.user.LangString("fraction.garages.0fcb1a36a72f028b116a9f89eb5b95bf", Vehicle.isVehicleCommercial(car[0]) ? player.user.LangString("fraction.garages.8c45e5fedfaf928fed52d869afdd9d4c") : ''),
                onpress: () => {
                    m.close();
                    if(!this.haveAccessEdit(player)){
                        if(car[3] > user.rank) return player.notify(player.user.LangString("fraction.garages.e4e527a8af13a4e54a736f0cb3ed8370"), "error");
                    }
                    const used = this.usedVehicles.get(car[2]);
                    if (used){
                        const veh = Vehicle.toArray().find(v => v.fraction === this.fraction && v.garage === this.id && v.garagecarid == car[2])
                        if(veh){
                            if(veh.getOccupants().length > 0){
                                user.setWaypoint(veh.position.x, veh.position.y, veh.position.z, user.LangString("fraction.garages.cb2e3da9780e65db417b2b8ebd973fe8", car[1]), true);
                                player.notify(player.user.LangString("fraction.garages.9eebbdda264138a6c5d0dbf27365ba50", used, veh ? player.user.LangString("fraction.garages.ce77d6828639a5d91730ace54934c4b9") : player.user.LangString("fraction.garages.4c00af955435eca00ee755d47a05da3b")), "error");
                            } else {
                                Vehicle.teleport(veh, this.position, this.heading, this.dimension);
                                Vehicle.repair(veh, true);
                                player.user.putIntoVehicle(veh, 0);
                            }
                        }
                        return;
                    }
                    if(system.distanceToPos(player.position, this.position) > 10 || player.dimension !== this.dimension) return player.notify(player.user.LangString("fraction.garages.2ab2f0cafeced0ca43cf301992217913"), "error");
                    if(Vehicle.toArray().filter(veh => veh && veh.dimension === this.dimension && system.distanceToPos(veh.position, this.position) < 2).length > 0) return player.notify(player.user.LangString("fraction.garages.d397a430d67705d85c2684938efffd9a"), "error")
                    this.usedVehicles.set(car[2], `${user.name} #${user.id}`);
                    const veh = Vehicle.spawnFractionVehicle(this.fraction, car[2], this.id, car[0], this.position, this.heading, this.dimension, this.prefix ? this.prefix+(carids+1) : car[1]);
                    veh.fractionMinRank = car[3];
                    Vehicle.setPrimaryColor(veh, car[4], car[5], car[6])
                    Vehicle.setSecondaryColor(veh, car[7], car[8], car[9])
                    if(typeof car[10] === "number") veh.livery = car[10]
                    setTimeout(() => {
                        if (!mp.players.exists(player)) return;
                        if (!mp.vehicles.exists(veh)) return;
                        player.user.putIntoVehicle(veh, 0);
                    }, 500)
                }
            })
        })
        
        m.newItem({
            name: player.user.LangString("fraction.garages.763b7d3afb0d374d90c0271ee8e0e7b6"),
            onpress: () => {
                m.close();

                if (!this.haveAccessEdit(player)){
                    return player.notify(player.user.LangString("fraction.garages.673c6e63728b4a571b98aa7cc3977530"), 'error')
                }

                let count = 0;
                this.cars.forEach(car => {
                    const used = this.usedVehicles.get(car[2]);
                    
                    if (used) {
                        const veh = Vehicle
                            .toArray()
                            .find(v => v.fraction === this.fraction && v.garage === this.id && v.garagecarid == car[2])
                        if (veh) {
                            if (veh.getOccupants().length === 0) {
                                Vehicle.destroy(veh)
                            }
                            else count++;
                        }
                    }
                });
                if (count) player.notify(player.user.LangString("fraction.garages.59182f4252e2052d3d7f4b8a80ae12af", count), 'info')
            }
        });
                
        m.open();
    }
}

setInterval(() => FractionGarage.list.forEach(item => item.save()), 240000);