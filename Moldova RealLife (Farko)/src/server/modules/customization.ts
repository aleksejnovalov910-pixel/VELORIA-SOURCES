import { langStringDefault } from "../../shared/lang";
import {CustomEvent} from "./custom.event";
import {DressEntity} from "./typeorm/entities/dress";
import {menu} from "./menu";
import {CLOTH_VARIATION_ID_MULTIPLER, ClothData, GloveClothData, partsList} from "../../shared/cloth";
import {system} from "./system";
import fs from "fs";
import {writeSpecialLog} from "./specialLogs";

CustomEvent.registerClient('dress:getDressDataById', (player, id: number) => {
    return dress.get(id)?.data as GloveClothData[]
})


CustomEvent.registerClient('admin:gamedata:dress', player => {
    const user = player.user;
    if(!user.hasPermission('admin:gamedata:dress')) return player.notify(player.user.LangString("customization.e91c451080c7a2cddfd8a90f188d240c"), "success");
    dress.adminMenu(player)
})

CustomEvent.registerClient('admin:cloth:saveGlove', async (player, id: number, price: number, name: string, data: GloveClothData[]) => {
    const user = player.user;
    if (!user.hasPermission('admin:gamedata:dress'))
        return player.notify(player.user.LangString("customization.055ee72ed8bd48cf1cb47e08b541d774"), "success");

    let dressEntity: DressEntity = id ? dress.get(id) : new DressEntity();

    dressEntity.price = price || 0;
    dressEntity.name = name;
    dressEntity.data = data;
    dressEntity.male = user.is_male;
    dressEntity.category = 1000;
    dressEntity.edited = true;

    try {
        dressEntity = await dressEntity.save();
    } catch (err) {
        console.error(err)
        player.notify(player.user.LangString("customization.e974325bf5fa1a588e6c0b536ae41238"), "error")
    }

    const idx = dress.data.findIndex(entity => entity.id === dressEntity.id);
    if (idx !== -1) {
        dress.data.splice(idx, 1);
    }

    dress.data.push(dressEntity);

    const dataDto = {
        id: dressEntity.id,
        name: dressEntity.name,
        category: dressEntity.category,
        male: dressEntity.male,
        data: dressEntity.data,
    };
    CustomEvent.triggerClients('dressData:new', [dataDto]);
});

CustomEvent.registerClient('admin:cloth:save', (player, id: number, price: number, name: string, data: { component: number, drawable: number, texture: number, name?: string }[][], page?:number) => {
    const user = player.user;
    if(!user.hasPermission('admin:gamedata:dress')) return player.notify(player.user.LangString("customization.3f7c4f759298dfe46cfe689da5a53989"), "success");
    let item: DressEntity;
    if(!id){
        item = new DressEntity();
        item.price = price || 0;
        item.name = name;
        item.data = data;
        item.male = user.is_male;
        item.category = data[0][0].component;
        item.edited = true;
        item.save().then(r => {
            dress.data.push(r)
            const datasend = [r].map(d => {
                return {
                    id: d.id,
                    name: d.name,
                    category: d.category,
                    male: d.male,
                    data: d.data,
                }
            });
            CustomEvent.triggerClients('dressData:new', datasend)
            player.notify(player.user.LangString("customization.274675e866d2eef5281d755774f96a84", id ? player.user.LangString("customization.658f15b95f08fb414842caa1e2779acf") : player.user.LangString("customization.fc8e5ef2cf8e40e7f8b2f000d1260fbf")), 'success');
        }).catch(err => {
            console.error(err)
            player.notify(player.user.LangString("customization.350ccfa09852c30c701c289f4e6df640"), "error")
        });
    } else {
        item = dress.get(id);
        if(item){
            item.price = price;
            item.name = name;
            item.data = data;
            item.edited = true;
            item.save().then(r => {
                const datasend = [r].map(d => {
                    return {
                        id: d.id,
                        name: d.name,
                        category: d.category,
                        male: d.male,
                        data: d.data,
                    }
                });
                CustomEvent.triggerClients('dressData:new', datasend)
                player.notify(player.user.LangString("customization.924e151b007ef14c32606d4857767455", id ? player.user.LangString("customization.d749c6523f28493f3770603df42ee47c") : player.user.LangString("customization.9a9225018276bdbb642a732f24c98e48")), 'success');
                if(typeof page === "number") dressMenuAdmin(player, item, () => {
                    dress.adminMenu(player);
                }, page)
            }).catch(err => {
                console.error(err)
                player.notify(player.user.LangString("customization.8113d89cea506a772f0e402a36612ee4"), "error")
            });
        }
    }
})

let staticDress: {
    id: number;
    name: string;
    category: number;
    male: number;
    data: {
        component: number;
        drawable: number;
        texture: number;
        name?: string;
    }[][] | GloveClothData[];
}[] = [];
export const dress = {
    getIdVariation: (multipliedId: number) => {
        let id = multipliedId;
        let variation = 0;
        if (id >= CLOTH_VARIATION_ID_MULTIPLER) {
            variation = Math.floor(id / CLOTH_VARIATION_ID_MULTIPLER);
            id = id % CLOTH_VARIATION_ID_MULTIPLER;
        }

        return { id, variation };
    },

    getTorsoComponent: (torsoId: number) => {
        const { id } = dress.getIdVariation(torsoId);
        return (dress.get(id)?.data[0] as ClothData)?.find(cloth => cloth.component === 3)?.drawable;
    },

    get staticConfig(){
        return staticDress
    },
    get dynamicConfig(){
        return [...dress.data].filter(q => q.edited).map(d => {
            return {
                id: d.id,
                name: d.name,
                category: d.category,
                male: d.male,
                data: d.data,
            }
        })
    },
    get sendingConfig(){
        const staticConfig = dress.staticConfig;
        let dyn = dress.dynamicConfig;
        dyn.map((item, i) => {
            const old = staticConfig.find(q => q.id === item.id);
            if(!old) return;
            if (JSON.stringify(old) == JSON.stringify(item)) dyn.splice(i, 1);
        })
        return dyn;
    },
    data: <DressEntity[]> [],
    get: (id: number) => {
        if(!id) return null;
        if (id >= CLOTH_VARIATION_ID_MULTIPLER) {
            id = id % CLOTH_VARIATION_ID_MULTIPLER;
        }
        return dress.data.find(q => q.id === id);
    },
    getMany: (ids: number[]) => {
        ids.map((id, index) => {
            if(!id) return null;
            if (id >= CLOTH_VARIATION_ID_MULTIPLER) {
                id = id % CLOTH_VARIATION_ID_MULTIPLER;
            }
            ids[index] = id;
        })
        return dress.data.filter(q => ids.includes(q.id));
    },
    delete: (id: number) => {
        let index = dress.data.findIndex(d => d.id === id);
        if (index >= 0){
            CustomEvent.triggerClients('dressData:remove', id)
            dress.data[index].remove();
            dress.data.splice(index, 1);
        }
    },
    load: () => {
        system.debug.info(langStringDefault("customization.0c83498fa6b82d283a2a8165dd2e1ab1"))
        console.time("Verladen von Kleidung")
        console.time("Ladezeit der Kleidung")
        return new Promise((resolve, reject) => {
            DressEntity.find().then(data => {
                // data.map(item => {
                //     const newName = item.name.replace(/[^\da-zA-Zа-яА-Яё #()]/g, '');
                //     if(item.name !== newName) {
                //         debug.error("ERROR "+item.id, item.name, newName)
                //         item.name = newName
                //     }
                // })
                dress.data = data;
                system.debug.info(langStringDefault("customization.a07555ae2737b0381d6c94ca213e6a8a"), data.length);
                console.timeEnd("Ladezeit der Kleidung")
                system.debug.info(langStringDefault("customization.aa43c67db4ecaf18a5fab147c8e20fa8"))
                staticDress = dress.dynamicConfig;
                fs.writeFileSync('./client_packages/dress.json.js', `global.dressstatic = ${JSON.stringify(dress.dynamicConfig)}`);
                system.debug.debug(langStringDefault("customization.1dff55c2790919d93c2b68b7ddf02a61"));
                resolve(null);
            })
        })
    },
    adminMenu: (player: PlayerMp, filter?:string) => {
        let m = menu.new(player, "", player.user.LangString("customization.657c88f271f8371c58eef8225f3e3e89"))
        const user = player.user;
        m.newItem({
            name: player.user.LangString("customization.8d8ad62002c4fa02206aded5acfc54c5"),
            onpress: () => {
                CustomEvent.triggerClient(player, "admin:cloth:new");
            }
        })
        m.newItem({
            name: player.user.LangString("customization.7b89526cc0dedf13b9074e735c3ad698"),
            more: filter || "",
            onpress: () => {
                menu.input(player, player.user.LangString("customization.9cedeaa998db57e70e1537915563fd10")).then(search => {
                    if(!search) return dress.adminMenu(player);
                    dress.adminMenu(player, search);
                })
            }
        })
        if(filter){
            dress.data.filter(q => q.id === parseInt(filter) || q.name.toLowerCase().includes(filter.toLowerCase())).map(item => {
                m.newItem({
                    name: `#${item.id} | ${item.name}`,
                    desc: player.user.LangString("customization.733f5a3168323d4ce36ea454910707a7", item.male ? player.user.LangString("customization.17af0a33e01a32cbd12dbb3245116cbb") : player.user.LangString("customization.3e1ce4533cb562ca339681f1125cc1e5")),
                    more: `$${system.numberFormat(item.price)}`,
                    onpress: () => {
                        dressMenuAdmin(player, item, () => {
                            dress.adminMenu(player, filter)
                        }, 0);
                    }
                })

            })
        } else {
            partsList.map(category => {
                let items: DressEntity[] = [];

                switch (category[0]) {
                    case 333:
                        items = dress.data.filter(q => q.category == category[0]);
                        break;
                    case 1000:
                        items = dress.data.filter(q => q.category === 1000);
                        break;
                    default:
                        items = dress.data.filter(q => q.category === category[0] && (q.data as ClothData[])[0].length >= (partsList.length - 2))
                        break;
                }

                m.newItem({
                    name: category[1],
                    more: `x${items.length}`,
                    onpress: () => {
                        const pageItems = 100;
                        let page = 0;
                        let pageMax = Math.ceil(items.length / pageItems);
                        const vq = () => {
                            items = dress.data.filter(q => q.category == category[0])
                            pageMax = Math.ceil(items.length / pageItems);
                            let submenu = menu.new(player, "", category[1]);
                            submenu.onclose = () => { dress.adminMenu(player) };
                            if (page < pageMax) {
                                submenu.newItem({
                                    name: player.user.LangString("customization.d667bcfc65378ad4e52d5362cca5a9b1"),
                                    onpress: () => {
                                        page++;
                                        vq();
                                    }
                                })
                            }
                            if (page){
                                submenu.newItem({
                                    name: player.user.LangString("customization.c99df4f462b3bfe678a8c41b3971b8ee"),
                                    onpress: () => {
                                        page--;
                                        vq();
                                    }
                                })
                            }
                            submenu.newItem({
                                name: player.user.LangString("customization.b4538e2a3d70371b805ed63be45b0346"),
                                more: `${page+1} / ${pageMax+1}`
                            })
                            items.map((item, index) => {
                                if (index < page * pageItems || index > (page + 1) * pageItems) return;
                                submenu.newItem({
                                    name: `#${item.id} | ${item.name}`,
                                    desc: player.user.LangString("customization.c89aca8122a3e4d0a8f51675ba7b9e74", item.male ? player.user.LangString("customization.b886ca38d2bb8e99ff563a56684a9d94") : player.user.LangString("customization.4cbc6f232a8889e5adc825c7157c80ec")),
                                    more: `$${system.numberFormat(item.price)}`,
                                    onpress: () => {
                                        dressMenuAdmin(player, item, vq, page);
                                    }
                                })
                            })


                            submenu.open();
                        }
                        vq();
                    }
                })
            })
        }
        m.open();
    }
}

export const dressMenuAdmin = (player: PlayerMp, item: DressEntity, onclose: () => void, page: number) => {
    const user = player.user;
    let choice = menu.new(player, "", player.user.LangString("customization.aea05b0e0359bc6111544a45463d50fb"))
    choice.onclose = () => {
        onclose();
    }
    choice.newItem({
        name: player.user.LangString("customization.0fceb14b70fc91d6cbf9b47c158d4a51"),
        onpress: () => {
            if (user.is_male != item.male) return player.notify(player.user.LangString("customization.13d5647b13417d3318925ff089069b53"), "error");
            CustomEvent.triggerClient(player, "admin:cloth:edit", JSON.stringify([item.category, item.id, item.price, item.name, item.data]), page);
        }
    })
    choice.newItem({
        name: player.user.LangString("customization.733378683b9fc1b8fd74d57720d6eabb"),
        more: `${system.numberFormat(item.price)}`,
        onpress: () => {
            menu.input(player, player.user.LangString("customization.d2e3110a64113a90e61da596d85f9ae9"), item.price, 6, 'int').then(val => {
                if(typeof val !== "number") return;
                if(isNaN(val)) return;
                if(val < 0) return;
                if(val > 99999999) return;
                item.price = val || 0;
                item.save().then(() => {
                    dressMenuAdmin(player, item, onclose, page);
                })
            })
        }
    })
    if ([3, 4, 6].includes(item.category)){
        choice.newItem({
            name: player.user.LangString("customization.2858194505fcad6e5ede1a3b3e79099e"),
            more: `${item.forCreate ? player.user.LangString("customization.423b3f6631a35e9ecd84388231c3c351") : player.user.LangString("customization.7bc4cd065b5c6195208d9122a66d4957")}`,
            desc: player.user.LangString("customization.5b1c19fbae16f3c33e6eeefdcaaa5818"),
            onpress: () => {
                item.forCreate = item.forCreate ? 0 : 1
                item.save().then(() => {
                    dressMenuAdmin(player, item, onclose, page);
                })
            }
        })
    }
    choice.newItem({
        name: player.user.LangString("customization.89a408a58c6f168c267714e528a50f2e"),
        more: `${item.forBox ? player.user.LangString("customization.d9c0a8b5e81becf0495f145433ebb124") : player.user.LangString("customization.ef4d0853c431c8e31fcedac41de27ab3")}`,
        desc: player.user.LangString("customization.9fb7c0e625b853762c31d876cc8bf050"),
        onpress: () => {
            item.forBox = item.forBox ? 0 : 1
            item.save().then(() => {
                dressMenuAdmin(player, item, onclose, page);
            })
        }
    })

    if (item.category !== 1000) {
        const data = item.data as ClothData[];

        choice.newItem({
            name: player.user.LangString("customization.a36c3720a1646e08854f529457db9562"),
            desc: player.user.LangString("customization.e0153fe6498fca213d427589c8cd44f3"),
            more: `${item.forMedia === -1 ? player.user.LangString("customization.7e8198d69d92cb4e28234a0bbdbf7b30") : item.name}`,
            onpress: () => {
                menu.selector(player, player.user.LangString("customization.1d0aa342d2a7b6c893b029e90710241a"), [player.user.LangString("customization.d4cb91acbcca839e814e226f58c3f15e"), ...(data).map(q => q[0].name)], true, null, true, item.forMedia+1).then(val => {
                    if(typeof val !== "number") return;
                    item.forMedia = val - 1;
                    item.save().then(() => {
                        dressMenuAdmin(player, item, onclose, page);
                    })
                })
            }
        })
    }

    choice.newItem({
        name: player.user.LangString("customization.b850876f681fdce40650df7257d580e7"),
        desc: player.user.LangString("customization.cec832f3d6ad169ea7cee177dda2c169"),
        more: `${item.forBattlePass ? player.user.LangString("customization.fdcbf92e15974515f06126755d634ea7") : player.user.LangString("customization.8421a94d466a8c62c2710a2ad3be0af5")}`,
        onpress: () => {
            item.forBattlePass = !item.forBattlePass
            item.save().then(() => {
                dressMenuAdmin(player, item, onclose, page);
            })
        }
    })

    choice.newItem({
        name: player.user.LangString("customization.dea10efc82bec928be584f3f6d4aac00"),
        desc: player.user.LangString("customization.2fb242001d9e919f165f9898d9f95d81"),
        more: `${item.donateBlock ? player.user.LangString("customization.3f53b4f4dc8297295112a4563eec87da") : player.user.LangString("customization.be8e88b0b0e6a5ddc293277758736754")}`,
        onpress: () => {
            item.donateBlock = !item.donateBlock
            item.save().then(() => {
                dressMenuAdmin(player, item, onclose, page);
            })
        }
    })

    choice.newItem({
        name: player.user.LangString("customization.c604db82bf035b8e166e894c5ee2aa21"),
        more: item.name,
        onpress: () => {
            menu.input(player, player.user.LangString("customization.52803412aaea3519e84de2aee30dee22"), item.name, 35).then(name => {
                if(!name) return;
                item.name = name;
                item.edited = true;
                item.save().then(() => {
                    player.notify(player.user.LangString("customization.7ba22940ad0c379be33bbbe3bfd9785b"), "error")
                    const datasend = [item].map(d => {
                        return {
                            name: d.name
                        }
                    });
                    CustomEvent.triggerClients('dressData:new', datasend)
                })
            })
        }
    })
    choice.newItem({
        name: player.user.LangString("customization.2af01c2e9ac68d0717892688b1127a53"),
        type: 'range',
        rangeselect: [0, item.data.length - 1],
        onpress: (itm) => {
            if (user.is_male != item.male) return player.notify(player.user.LangString("customization.5b61e02e20db9a67bb49f04155fcd3a1"), "error");
            writeSpecialLog(langStringDefault("customization.7bee2a338dd5b4dd6018d8f32d527b78", item.id + itm.listSelected * CLOTH_VARIATION_ID_MULTIPLER), player, 0);
            user.setDressValueById(item.inventoryIcon, item.id + itm.listSelected * CLOTH_VARIATION_ID_MULTIPLER);
        }
    })
    choice.newItem({
        name: player.user.LangString("customization.a7909872711402aa2c7008b3a2186d65"),
        onpress: () => {
            menu.accept(player).then(async status => {
                if (status) dress.delete(item.id);
                dress.adminMenu(player);
            })
        }
    })
    choice.open()
}