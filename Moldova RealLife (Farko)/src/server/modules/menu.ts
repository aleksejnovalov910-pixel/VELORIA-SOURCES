import { langStringDefault } from "../../shared/lang";
/// <reference path="../../declaration/server.ts" />

import {MenuItem, MenuItemFromClientToServer, menuSprite} from "../../shared/menu";
import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {inventoryShared, ITEM_TYPE, ITEM_TYPE_ARRAY} from "../../shared/inventory";
import {JobId, jobsList} from "../../shared/jobs";
import {Family} from "./families/family";
import { fractionCfg } from "./fractions/main";
import {PURCHASEABLE_ANIMS} from "../../shared/anim";
export class MenuClass {
    /** Параметр множителя базовой ширины меню, на случай если это необходимо */
    widthMultipler = 1;
    /** Уникальный ID каждого конструктора меню */
    private readonly id: number;
    /** Игрок, за которым меню закреплено */
    readonly player: PlayerMp;
    /** Заголовок меню */
    title: string;
    /** Подзаголовок меню */
    subtitle: string;
    /** Пункты меню */
    items: MenuItem[];
    /** Доп дамп данных игрока */
    private playerData: {
        id: number;
        dbid: number;
    }
    /** Флаг работы в наручниках */
    workAnyTime: boolean;
    /** Защита от выхода из всех колшейпов */
    exitProtect: boolean;
    /** Защита от выхода из определённых колшейпов */
    exitProtectList: ColshapeMp[];
    /** Доп параметры */
    customParams: {
        isResetBackKey?: boolean,
        isDisableAllControls?: boolean,
        DisableAllControlsOnClose?: boolean;
        closeEvent?: boolean;
        selected?: number;
    }
    title_image?: string;
    closedMenu: boolean
    onclose: () => Promise<void> | void;
    tm: number;
    sprite?: menuSprite;
    constructor(player: PlayerMp, title?: string, subtitle?: string, items?: MenuItem[]) {
        this.workAnyTime = false;
        this.tm = new Date().getTime();
        this.exitProtect = false;
        this.exitProtectList = [];
        menu.idgen++;
        this.closedMenu = false;
        this.id = parseInt(`${menu.idgen}`)
        this.player = player;
        if (this.player.serverMenu) {
            this.player.serverMenu.close(true);
        }
        this.playerData = {
            id: player.id,
            dbid: player.user.id,
        }
        this.title = title ? title.replace(/\n/gi, ' ') : "";
        this.subtitle = subtitle ? subtitle.replace(/\n/gi, ' ') : "";
        this.items = (items ? items : []).map((item) => {
            if (!item.type) item.type = "select";
            return item;
        });
        this.customParams = {};
        menu.menumap.set(this.id, this);
    }
    /** Добавляет новые пункты в текущее меню */
    newItem(...items: MenuItem[]) {
        if (!this.items) return;
        items.forEach(item => {
            if (!item.type) item.type = "select"
            //if(item.more) item.name+=" "+item.more, item.more = null;
        })
        this.items.push(...items);
    }
    updateItem(item: MenuItem) {
        const index = this.items.indexOf(item);
        CustomEvent.triggerClient(this.player, 'server:menu:updateItem', index, item);
    }
    /** Отрисовать меню в текущем состоянии у клиента */
    async open(selected: number = null) {
        if (!this.items) return;
        this.player.serverMenu = this;
        this.customParams.closeEvent = (this.checkOncloseStatus() > 3)
        this.customParams.selected = selected ? selected : 0
        this.items.forEach(item => {
            if (item.type == "list" || item.type == "range") {
                if (!item.listSelected) item.listSelected = 0;
            }
            if (item.type == "list") {
                item.listSelectedName = item.list[item.listSelected]
            }
            if (item.type == "color" && !item.color) {
                item.color = {r: 0, g: 0, b: 0};
            }
        })
        CustomEvent.triggerClient(this.player, 'server:menu:open', this.id, this.title, this.subtitle, this.items.map(item => {
            return {
                name: item.name,
                desc: item.desc,
                type: item.type,
                more: item.more,
                rangeselect: item.rangeselect,
                list: item.list,
                listSelected: item.listSelected,
                icon: item.icon,
                color: item.color,
            }
        }) as MenuItemFromClientToServer[], this.customParams, this.workAnyTime, this.sprite, this.widthMultipler)
    }
    /** Функция закрытия меню */
    close(blockClose = false) {
        if (mp.players.exists(this.player) && !blockClose) {
            if (this.player.serverMenu && this.player.serverMenu.id == this.id) CustomEvent.triggerClient(this.player, 'menu:server:close')
            this.player.serverMenu = null;
        }
        this.closedMenu = true;
        this.items = null;
        this.title = null;
        this.subtitle = null;
        if (menu.menumap.has(this.id)) menu.menumap.delete(this.id);
    }
    /** Функция, которая будет вызвана при закрытии меню */
    //async onclose(){}
    /** Проверка на то, что у нас изменёно события onclose */
    checkOncloseStatus() {
        return typeof this.onclose == "function" ? this.onclose.toString().match(/\{([\s\S]*)\}/m)[1].replace(/^\s*\/\/.*$/mg, '').length : 0;
    }
    /** Проверка владельца меню на предмет подмены ивентов */
    check(player: PlayerMp) {
        if (player.id != this.playerData.id) return false;
        if (!this.player.user || this.player.user.id != this.playerData.dbid) return false;
        return true;
    }
}

setInterval(() => {
    menu.menumap.forEach((item) => {
        if (!mp.players.exists(item.player)) item.close();
        else if (item.tm - new Date().getTime() > 480 * 1000) item.close();
        // else if(item.player.serverMenu != item) item.close();
    })
}, 120000)

export const menu = {
    /** Индекс для генерации уникального ID */
    idgen: 1,
    /** Карта со всеми сгенерированными меню */
    menumap: <Map<number, MenuClass>>new Map(),
    new: (player: PlayerMp, title: string, subtitle?: string, items?: MenuItem[]) => {
        return new MenuClass(player, title, subtitle ? subtitle : player.user.LangString("menu.07706013579d5592a4d5376780d60cde"), items);
    },
    close: (player: PlayerMp) => {
        if (!mp.players.exists(player)) return;
        if (player.serverMenu) return player.serverMenu.close();
        player.serverMenu = null;
        player.call('server:menu:close')
    },
    get: (id: number) => {
        return menu.menumap.has(id) ? menu.menumap.get(id) : null
    },
    input,
    selector,
    accept: (player: PlayerMp, text: string = langStringDefault("menu.c4f63351725ae6cf04acdd6d9ab49f20"), type: "big" | "small" = "big", time = 10000, accept: string = langStringDefault("menu.e39d60435c003b7b5e28e17666472a75"), cancel: string = langStringDefault("menu.676f7e128e71ec49568ed7a8243319e0")): Promise<boolean> => {
        if(!type) type = 'small';
        return new Promise((resolve, reject) => {
            if(!mp.players.exists(player)) return reject();
            CustomEvent.callClient(player, 'dialog:accept', text, type, time, accept, cancel).then((status:boolean) => {
                resolve(status)
            })
            
        })
    },
    selectFamily: (player: PlayerMp):Promise<number> => {
        return new Promise((resolve, reject) => {
            if (!mp.players.exists(player))
                return reject("selectFraction player leave server")

            const fMenu = menu.new(player, player.user.LangString("menu.f76de78a4be64e3ec6ed3b4f6417c4b8"), player.user.LangString("menu.81ca9ff065e67b650db6a6fb69cb8b1d"));
            fMenu.exitProtect = true;
            fMenu.onclose = () => { resolve(null) };

            Family.getAll().forEach(family => {
                fMenu.newItem({
                    name: family.name,
                    onpress: () => {
                        fMenu.close();
                        resolve(family.id);
                    }
                });
            });
            fMenu.open();
        });
    },
    selectFraction: (player: PlayerMp, type: "all" | "gos" | "mafia" | "gang" = "all", current?:number):Promise<number> => {
        return new Promise((resolve, reject) => {
            if (!mp.players.exists(player)) return reject("selectFraction player leave server")
            const m = menu.new(player, player.user.LangString("menu.88a40e54e05c3f6b4cd852f5a54512b7"), player.user.LangString("menu.48cdc0fed2e0f906af3bdfed26e8ec44"));
            m.exitProtect = true;
            m.onclose = () => {resolve(null);}
            let sel = 0;
            let selids = 0;
            fractionCfg.list.map((fraction, index) => {
                if(type !== "all"){
                    if (type === "gos" && !fraction.gos) return;
                    if (type === "gang" && !fraction.gang) return;
                    if (type === "mafia" && !fraction.mafia) return;
                }
                
                const iscurrent = current === fraction.id;
                if (iscurrent) sel = selids;
                m.newItem({
                    name: fraction.name,
                    more: `${iscurrent ? player.user.LangString("menu.da5482cb7815a75d2694fedcec71debb") : ''}`,
                    onpress: () => {
                        m.close();
                        resolve(fraction.id);
                    }
                })
                selids++;
            })
            m.open(sel);
        })
    },
    selectRank: (player: PlayerMp, fraction: number, current?:number):Promise<number> => {
        return new Promise((resolve, reject) => {
            if (!mp.players.exists(player)) return reject("selectFraction player leave server")
            const m = menu.new(player, player.user.LangString("menu.9ac1d5ca63a513fc845d198ce3f3a26a"), player.user.LangString("menu.00309aec5cf78143c13997a9ce790cd2"));
            m.exitProtect = true;
            m.onclose = () => {resolve(null);}
            let sel = 0;
            let selids = 0;
            fractionCfg.getFractionRanks(fraction).map((name, index) => {
                const iscurrent = current === (index + 1);
                if (iscurrent) sel = selids;
                m.newItem({
                    name: name,
                    more: `${iscurrent ? player.user.LangString("menu.62f8c97ff2a3b85f7fdf2b67af571465") : ''}`,
                    onpress: () => {
                        m.close();
                        resolve((index + 1));
                    }
                })
                selids++;
            })
            m.open(sel);
        })
    },
    selectJob: (player: PlayerMp, current?:string):Promise<JobId> => {
        return new Promise((resolve, reject) => {
            if (!mp.players.exists(player)) return reject("selectFraction player leave server")
            const m = menu.new(player, player.user.LangString("menu.8d676ea1d5155a4c1f070dfa5cd7dcb5"), player.user.LangString("menu.76596ff4f6a85a7aca7656ff4d71af78"));
            m.onclose = () => {resolve(null);}
            m.exitProtect = true;
            let sel = 0;
            let selids = 0;
            jobsList.map(job => {
                const iscurrent = current === job.id;
                if (iscurrent) sel = selids;
                m.newItem({
                    name: job.name,
                    more: `${iscurrent ? player.user.LangString("menu.d075c4215e24644d080a75b7bbc6c96f") : ''}`,
                    onpress: () => {
                        m.close();
                        resolve(job.id);
                    }
                })
                selids++;
            })

            m.open(sel);
        })
    },
    selectItem: (player: PlayerMp, disabled:number[] = [], disableName?:string):Promise<number> => {
        return new Promise((resolve, reject) => {
            const select = (name?: string, category: ITEM_TYPE = ITEM_TYPE_ARRAY.length) => {
                if (name) name = name.toLowerCase();
                let m = menu.new(player, player.user.LangString("menu.d788e0690ffe4b5685679155181493e6"))
                m.onclose = () => { resolve(null) }
                m.newItem({
                    name: player.user.LangString("menu.ead0d7ff7c429d8f32257758b52fc96c"),
                    more: name,
                    onpress: () => {
                        menu.input(player, player.user.LangString("menu.9d573065d05f0d6e68513a7802f56f02"), name ? name : "").then(val => {
                            if (val === null) return select(name)
                            else return select(val);
                        })
                    }
                })
                m.newItem({
                    name: player.user.LangString("menu.d00b992ca99265ada89a3d16dedfbf53"),
                    type: "list",
                    list: [...ITEM_TYPE_ARRAY, player.user.LangString("menu.0a1e939d9b062bc92cf56d917f553649")],
                    listSelected: category,
                    onpress: (itm) => {
                        select(name, itm.listSelected);
                    }
                })
                inventoryShared.items.map(item => {
                    if (disabled.includes(item.item_id) && !disableName) return;
                    if (category !== ITEM_TYPE_ARRAY.length){
                        if(item.type !== category) return;
                    }
                    let idsrch = parseInt(name);
                    if (!name || item.name.toLowerCase().includes(name) || (idsrch === item.item_id)) {
                        m.newItem({
                            name: item.name+" #"+item.item_id,
                            icon: `Item_${item.item_id}`,
                            more: disabled.includes(item.item_id) && disableName ? disableName : "",
                            onpress: () => {
                                if (disabled.includes(item.item_id)) return player.notify(disableName, "error");
                                m.close();
                                resolve(item.item_id)
                            }
                        })
                    }
                });
                if (name) m.subtitle = player.user.LangString("menu.efc8bd5788511d67067a7490ed2fbd42", m.items.length, inventoryShared.items.length)
                else m.subtitle = player.user.LangString("menu.2472d24d2dcd035384ab6b9b76f5a434")
                m.open();
            }
            select();
        })
    },
    selectWeapon: (player: PlayerMp, disabled:number[] = [], disableName?:string):Promise<number> => {
        return new Promise((resolve, reject) => {
            const select = (name?: string, category: ITEM_TYPE = ITEM_TYPE.WEAPON) => {
                if (name) name = name.toLowerCase();
                let m = menu.new(player, player.user.LangString("menu.58d7577622a0f7c3b5a58eef5b872c31"))
                m.onclose = () => { resolve(null) }
                m.newItem({
                    name: player.user.LangString("menu.375b08a5e469f7fe92956536e55a5397"),
                    more: name,
                    onpress: () => {
                        menu.input(player, player.user.LangString("menu.e87b4c581ca765456f528e9cbfb45bc8"), name ? name : "").then(val => {
                            if (val === null) return select(name)
                            else return select(val);
                        })
                    }
                })
                inventoryShared.items.map(item => {
                    if (disabled.includes(item.item_id) && !disableName) return;
                    if (category !== ITEM_TYPE_ARRAY.length){
                        if(item.type !== category) return;
                    }
                    let idsrch = parseInt(name);
                    if (!name || item.name.toLowerCase().includes(name) || (idsrch === item.item_id)) {
                        m.newItem({
                            name: item.name+" #"+item.item_id,
                            icon: `Item_${item.item_id}`,
                            more: disabled.includes(item.item_id) && disableName ? disableName : "",
                            onpress: () => {
                                if (disabled.includes(item.item_id)) return player.notify(disableName, "error");
                                m.close();
                                resolve(item.item_id)
                            }
                        })
                    }
                });
                if (name) m.subtitle = player.user.LangString("menu.ee3e89a51cb236ab2da1877f0ee2463f", m.items.length, inventoryShared.items.length)
                else m.subtitle = player.user.LangString("menu.4c67c63ee5188bf81cf6108969c07f0f")
                m.open();
            }
            select();
        })
    }

}

function input(player: PlayerMp, title: string, value?: string, limit?: number, type?: "passwordNumber" | "text" | "password" | "textarea"): Promise<string>;
function input(player: PlayerMp, title: string, value?: string | number, limit?: number, type?: "int" | "float"): Promise<number>;

function input(player: PlayerMp, title: string, value = '', limit = 30, type: "text" | "password" | "passwordNumber" | "int" | "float" | "textarea" = "text") {
    return new Promise((resolve) => {
        value = String(value);
        if (value && typeof value == "string") value = value.replace(/`/g, '').replace(/'/g, '').replace(/"/g, '');
        CustomEvent.callClient(player, 'server:input', title, value, limit, type == "passwordNumber" ? "password" : type).then(res => {
            res = String(res);
            if (res) res.replace(/\n/g, '');
            if (type == "int" || type == "float") {
                return resolve(system.parseInt(res));
            }
            resolve(res);
        })
    })
}


function selector(player: PlayerMp, name: string, list: string[], returnid?: false, sprite?: string, colshapeProtect?: boolean, current?:number): Promise<string>;
function selector(player: PlayerMp, name: string, list: string[], returnid?: true, sprite?: string, colshapeProtect?: boolean, current?:number): Promise<number>;

function selector(player: PlayerMp, name: string, list: string[], returnid: true | false = false, sprite?:menuSprite, colshapeProtect = false, current = 0) {
    return new Promise((resolve, reject) => {
        let filter = "";
        let needSearch = () => {
            return list.length > 20;
        }
        let first = true;
        const q = () => {
            let m = menu.new(player, name);
            if(sprite){
                m.title = ""
                m.subtitle = name
                m.sprite = sprite
            }
            m.exitProtect = colshapeProtect
            m.onclose = () => { resolve(null); }
            if(needSearch()){
                m.newItem({
                    name: player.user.LangString("menu.93e047683b3066d344b223eed5704fac"),
                    onpress: () => {
                        menu.input(player, player.user.LangString("menu.55b4d6de84ea754c92b834c336e79e02"), filter).then(val => {
                            if(typeof val !== "string") return;
                            filter = val || "";
                            q();
                        })
                    }
                })
            }

            list.map((item, index) => {
                if(filter && !item.toLowerCase().includes(filter.toLowerCase())) return;
                m.newItem({
                    name: item,
                    onpress: () => {
                        m.close();
                        resolve(returnid ? index : item)
                    }
                })
            })
            m.open(first ? current : 0);
            first = false;
        }
        q();
    })
}

mp.events.add("client:menu:listChange", (player: PlayerMp, menuid: number, itemid: number, value: number) => {
    let menuItem = menu.get(menuid);
    if (!menuItem) return;
    if (!menuItem.check(player)) return;
    let item = menuItem.items[itemid];
    if (!item) return;
    if (item.type == "list" && !item.list[value]) return;
    item.listSelected = value;
    if (item.type == "list") item.listSelectedName = item.list[value];
    if (typeof item.onchange == "function") item.onchange(item.listSelected, item, itemid);
})
mp.events.add("client:menu:colorChange", (player: PlayerMp, menuid: number, itemid: number, value: string) => {
    let menuItem = menu.get(menuid);
    if (!menuItem) return;
    if (!menuItem.check(player)) return;
    let item = menuItem.items[itemid];
    if (!item) return;
    item.color = JSON.parse(value);
    if (typeof item.onchangeColor == "function") item.onchangeColor(item.color, item, itemid);
})

mp.events.add("client:menu:itemSelect", (player: PlayerMp, menuid: number, itemid: number) => {
    let menuItem = menu.get(menuid);
    if (!menuItem) return;
    if (!menuItem.check(player)) return;
    let item = menuItem.items[itemid];
    if (!item) return;
    if (typeof item.onpress == "function") item.onpress(item, itemid)
})

mp.events.add("client:menu:closeEvent", (player: PlayerMp, menuid: number) => {
    let menuItem = menu.get(menuid);
    if (!menuItem) return;
    if (!menuItem.check(player)) return;
    if (!menuItem.customParams.closeEvent) return;
    menuItem.onclose();
})

mp.events.add('playerExitColshape', (player: PlayerMp, shape: ColshapeMp) => {
    if (player.serverMenu) {
        let m = player.serverMenu;
        if (m.exitProtect) return;
        if (m.exitProtectList.indexOf(shape)) return;
    }
    menu.close(player);
})