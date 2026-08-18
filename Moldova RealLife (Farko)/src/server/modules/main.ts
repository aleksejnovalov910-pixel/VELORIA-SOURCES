import { langStringDefault } from "../../shared/lang";
import {CustomEvent} from "./custom.event";
import {account, User} from "./user";
import {MenuAdsEntity} from "./typeorm/entities/menu_ads";
import {menu} from "./menu";
import {getVipConfig, PACKETS, VipId} from "../../shared/vip";
import {DEFAULT_VEHICLE_PLAYER_LIMIT_MAX, getDonateItemConfig, MEDIA_PROMOCODE} from "../../shared/economy";
import {system} from "./system";
import {business} from "./business";
import {UserDatingEntity, UserEntity} from "./typeorm/entities/user";
import {OWNER_TYPES, PLAYER_INVENTORY_MAX_LEVEL} from "../../shared/inventory";
import {inventory} from "./inventory";
import {Family} from "./families/family";
import {RpHistoryEntity} from "./typeorm/entities/rp_history";
import {getX2Param} from "./usermodule/static";
import {PromocodeList, PromocodeUseEntity} from "./typeorm/entities/promocodes";
import {AccountEntity} from "./typeorm/entities/account";
import {SocketSyncWeb} from "./socket.sync.web";
import {dress} from "./customization";
import {CLOTH_VARIATION_ID_MULTIPLER} from "../../shared/cloth";
import {saveEntity} from "./typeorm";
import {CAR_FOR_PLAY_REWARD_MAX} from "../../shared/reward.time";
import {LicenceType} from "../../shared/licence";

CustomEvent.registerClient('admin:mainmenu:ads', player => {
    adsMenu(player);
})

const adsMenu = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (!user.hasPermission('admin:mainmenu:ads')) return player.notify(player.user.LangString("main.43d2f0ff158a228e793b739133188b1a"), "error");
    let m = menu.new(player, player.user.LangString("main.4b09e0882d84283baa982a93baf1ab58"), player.user.LangString("main.8e173b949bf086c88a2ec580ca64f9cf"));
    m.newItem({
        name: player.user.LangString("main.a4bf80b881d78d66e427969861ccd59b"),
        onpress: () => {
            menu.input(player, player.user.LangString("main.dad57301238b316000fa89ba357e5f70"), "", 60).then(title => {
                if(!title) return;
                menu.input(player, player.user.LangString("main.2f1312990ac276d949bae8aed208e59e"), "", 320, 'textarea').then(text => {
                    if (!text) return;
                    menu.selector(player, player.user.LangString("main.f662ff813ea29cf1bed823b53f9cfb0f"), [player.user.LangString("main.5131741f07c3417c9c85b701f1dc56d8"), player.user.LangString("main.a5cf4fa43230ea215a62fba4cf920c9e")], true).then(async val => {
                        if(typeof val !== "number") return;
                        let item = new MenuAdsEntity();
                        item.title = title;
                        item.text = text;
                        if(val){
                            item.button = await menu.input(player, player.user.LangString("main.ce487f0dfd283ca205771644dd554bc0"), player.user.LangString("main.13d16f08f8be4a4f4251d24ff080dd9d"), 60);
                            if (!item.button) return player.notify(player.user.LangString("main.5beb6b77ba16814da07923703044676e"), 'error'), adsMenu(player);
                        }
                        item.pic = await menu.input(player, player.user.LangString("main.c94b4bf76304fa278e9c9fd221921503"), "", 60);
                        if (val) item.pos = { x: player.position.x, y: player.position.y, z: player.position.z - 1 };
                        item.save().then(r => {
                            catalog.set(r.id, r);
                            player.notify(player.user.LangString("main.1c67a2dd3238c315ed7434f7cc704ce6"), "success");
                            return adsMenu(player);
                        })
                    })
                })
            })
        }
    })
    catalog.forEach(item => {
        m.newItem({
            name: item.title,
            desc: item.text,
            onpress: () => {
                let submenu = menu.new(player, player.user.LangString("main.320358af919848a33c3d1e272a8c924f"), item.title)
                submenu.newItem({
                    name: player.user.LangString("main.c0a9d470dcbf04596b0aaf9fe4c08e4f"),
                    desc: item.title,
                    onpress: () => {
                        menu.input(player, player.user.LangString("main.d3a10361609195fb4998ee16aa6ad9a2"), item.title, 60).then(val => {
                            if(!val) return adsMenu(player);
                            item.title = val;
                            item.save().then(() => {
                                player.notify(player.user.LangString("main.8f406435c892af68207599561a9f6983"), "success");
                                adsMenu(player);
                            })
                        })
                    }
                })
                submenu.newItem({
                    name: player.user.LangString("main.8b9543d28ba8e105fd6b159b7c3fe002"),
                    desc: item.text,
                    onpress: () => {
                        menu.input(player, player.user.LangString("main.3b7dee1a008e1218afd45b9feacafd32"), item.text, 320).then(val => {
                            if(!val) return adsMenu(player);
                            item.text = val;
                            item.save().then(() => {
                                player.notify(player.user.LangString("main.11c3809f3076f683e66caee1f40fd3ae"), "success");
                                adsMenu(player);
                            })
                        })
                    }
                })
                submenu.newItem({
                    name: player.user.LangString("main.4b89698049745928cf85f56ee03b661d"),
                    desc: item.pic,
                    onpress: () => {
                        menu.input(player, player.user.LangString("main.13d83175f181bd6758289be5b88fd17a"), item.pic, 320).then(val => {
                            if(typeof val !== "string") return adsMenu(player);
                            item.pic = val;
                            item.save().then(() => {
                                player.notify(player.user.LangString("main.d699acfe8739530bbdd5b04081a3cbe4"), "success");
                                adsMenu(player);
                            })
                        })
                    }
                })
                submenu.newItem({
                    name: item.pos ? player.user.LangString("main.cecef663ff9827a875923fe66d466823") : player.user.LangString("main.572431885041ae658aceb1cb87a835bb"),
                    onpress: () => {
                        item.pos = {x: player.position.x, y: player.position.y, z: player.position.z - 1};
                        item.save().then(() => {
                            player.notify(player.user.LangString("main.911726e718643dbad6af8cd5f7cdeb1e"), "success");
                            adsMenu(player);
                        })
                    }
                })
                if(item.pos){
                    submenu.newItem({
                        name: player.user.LangString("main.5891907b5bb222c26a6e7b4f9a989b14"),
                        desc: item.button,
                        onpress: () => {
                            menu.input(player, player.user.LangString("main.92793fe7ad3d1d8f45d7b8c593043309"), item.text, 320).then(val => {
                                if (!val) return adsMenu(player);
                                item.button = val;
                                item.save().then(() => {
                                    player.notify(player.user.LangString("main.1daef7a7e5e05648826b97904c534b8f"), "success");
                                    adsMenu(player);
                                })
                            })
                        }
                    })
                    submenu.newItem({
                        name: player.user.LangString("main.3093aa76b324e524a2022cdf4651b71c"),
                        onpress: () => {
                            menu.accept(player).then(status => {
                                if(!status) return adsMenu(player);
                                item.pos = null;
                                item.save().then(() => {
                                    player.notify(player.user.LangString("main.aed6bd22249a9a82ff4ef85a9c0bed71"), "success");
                                    adsMenu(player);
                                })
                            })
                        }
                    })  
                }
                submenu.newItem({
                    name: player.user.LangString("main.75ee6542232af6feaa6ca59863291da0"),
                    onpress: () => {
                        menu.accept(player).then(status => {
                            if (!status) return adsMenu(player);
                            const id = item.id;
                            item.remove().then(() => {
                                player.notify(player.user.LangString("main.5026d7b1360e0bee06784b62175ef8de"), "success");
                                catalog.delete(id);
                                adsMenu(player);
                            })
                        })
                    }
                })
                submenu.open();
            }
        })
    })
    m.open();
}

let catalog = new Map<number, MenuAdsEntity>();


export const loadAdsDB = () => MenuAdsEntity.find().then(data => data.map(item => catalog.set(item.id, item)))

const getOnline = (player: PlayerMp) => {
    const user = player.user;
    if(!user) return;
    return mp.players.toArray().filter(pl => !!pl.dbid && !!pl.user).map(pl => {
        return [pl.dbid, pl.user.name, pl.user.level]
    }).sort((a, b) => {
        if (a[0] === user.id) return 1;
        else if (b[0] === user.id) return -1;
        else return ((b[2] as number) - (a[2] as number))
    })
}

const getRich = async (player: PlayerMp) => {
    const user = player.user;
    if(!user) return;
    const data = await UserEntity.find({
        take: 50,
        where: {admin_level: 0},
        order: {money: "DESC"}
    })
    return system.sortArrayObjects(data.map(q => {
        return [q.id, q.rp_name, q.money + q.bank_money]
    }), [
        {id: 2, type: "DESC"}
    ])
}
const getActive = async (player: PlayerMp) => {
    const user = player.user;
    if(!user) return;
    const data = await UserEntity.find({
        take: 50,
        where: {admin_level: 0},
        order: {level: "DESC"}
    })
    return system.sortArrayObjects(data, [
        {id: 'level', type: "DESC"},
        {id: 'exp', type: "DESC"},
    ]).map(q => {
        return [q.id, q.rp_name, q.level]
    })
}

const getBanlist = async () => {
    // const data = await system.getLogsByType('AdminBan', 50)
    // return data.map(q => {
    //     return [q.id, q.text, '']
    // });
    return ['', '', '']
}

CustomEvent.registerCef('mainmenu:getRich', player => getRich(player))
CustomEvent.registerCef('mainmenu:getActive', player => getActive(player))
CustomEvent.registerCef('mainmenu:getOnline', player => getOnline(player))
CustomEvent.registerCef('mainmenu:getBanlist', () => getBanlist())
CustomEvent.registerCef('mainmenu:getFamilies', () => Family.getFamilyTop())

CustomEvent.registerClient('mainmenu:open', async (player, report = false) => {
    const user = player.user;
    if(!user) return;
    const biz = user.business;
    const house = user.houseEntity;
    const online = mp.players.length;
    const total = await UserEntity.count()
    CustomEvent.triggerClient(player, 'mainmenu:data', user.name, user.exp, user.level, user.wanted_level, user.wanted_reason, user.fraction, user.rank, [], biz ? biz.name : null, house ? `${house.name} #${house.id}` : null, [...catalog].map(q => {
        return {
            title: q[1].title,
            text: q[1].text,
            button: q[1].button,
            pic: q[1].pic,
            pos: q[1].pos,
        }
    }), user.vip, user.vip_end, user.donate_money, user.entity.warns.filter(q => q.time > system.timestamp).length, user.job, business.data.filter(q => q.donate).map(q => {
        return {x: q.positions[0].x, y: q.positions[0].y, name: q.name, type: q.type, sub_type: q.sub_type}
    }), user.bank_number, user.myBank ? {x: user.myBank.positions[0].x, y: user.myBank.positions[0].y} : null, getX2Param('donate'), online, total, getX2Param('playtime') && system.playtimeCanNow && User.playedTimeDay.find(q => q.id === player.user.account.id) ? User.playedTimeDay.find(q => q.id === player.user.account.id).time : null, getX2Param('playtimecar') && user.entity.playtimecar && !user.account.playtimecar ? user.entity.playtimecar : null, getX2Param('donate3'), user.entity.achievements, user.achiev.getTempAchievDataBlock(), user.account.promocode_my, user.account.promocode_my ? await PromocodeUseEntity.count({ code: user.account.promocode_my}) : 0, user.account.promocode_my_reward, report, player.user.entity.played_time)
})

CustomEvent.registerCef('mainmenu:changePassword', (player, old_password: string, new_password: string) => {
    const user = player.user;
    if (!user) return;
    if (user.password != account.hashPassword(old_password)) return false
    user.newPassword(new_password);
    return true;
})
CustomEvent.registerCef('mediapromo:takereward', async (player, id: number) => {
    const user = player.user;
    if (!user) return;
    if(id !== user.account.promocode_my_reward) return;
    const cfg = MEDIA_PROMOCODE.REWARD_STAGE_LIST[id];
    if(!cfg) return;
    const count = user.account.promocode_my ? await PromocodeUseEntity.count({ code: user.account.promocode_my}) : 0
    if(count < cfg.count) return;
    user.account.promocode_my_reward++;
    if(id === 0) user.addMoney(cfg.data, true, user.LangString("main.619a12bf6d5331b5181fad3de61005f4"));
    if(id === 1) {
        user.giveVip('Diamond', 30);
        player.notify(player.user.LangString("main.073adaf3b0a57665476dfef0488dcf7a"))
    }
    if(id === 2) {
        user.account.freeFamily++;
    }
    if(id === 3) {
        ["reanimation","car","moto","truck","weapon","med",].map(l => user.giveLicense(<LicenceType>l, 30))
    }
    if(id === 4) inventory.createItem({
        owner_type: OWNER_TYPES.PLAYER,
        owner_id: user.id,
        item_id: 866,
        advancedNumber: user.id,
        advancedString: 'veh|'+cfg.data
    })
    saveEntity(user.account);
    player.notify(player.user.LangString("main.ea2fe11a5f0d5fc0266060e2a220cda1"), 'success');
    SocketSyncWeb.fireTarget(player, 'mymediapromo', JSON.stringify({promocodeMy: user.account.promocode_my, promocodeMyCount: count, promocodeMyRewardGived: user.account.promocode_my_reward}))
})
CustomEvent.registerCef('mediapromo:create', (player, newpromo: string) => {
    const user = player.user;
    if (!user) return;
    if(newpromo) newpromo = system.filterInput(newpromo);
    if (!newpromo) return player.notify(player.user.LangString("main.a61b0b609c6fa2ca1ae8c5c5be6ec8fd"), 'error')
    if(user.account.promocode_my) return player.notify(player.user.LangString("main.53d9dc881a12e5003e707c04764dd0f5"), 'error')
    AccountEntity.find({ promocode_my: newpromo }).then(async dublicate => {
        if (!mp.players.exists(player)) return;
        if(user.account.promocode_my) return player.notify(player.user.LangString("main.8bef9d638239fbead449c245ad6411d2"), 'error')
        if (dublicate.length > 0) {
            if (dublicate.length > 0) return player.notify(player.user.LangString("main.6848201ecfd66a050ba2dadb450ecf80"), "error");
        }
        if ((await PromocodeList.count({ code: newpromo })) > 0) return player.notify(player.user.LangString("main.af841aa8137b85c43dc04c6d723f5372"), "error")
        if ((await PromocodeUseEntity.count({ code: newpromo })) > 0) return player.notify(player.user.LangString("main.1dea1c0abd6c3b66d8d82f7dec2ec6a7"), "error")
        user.account.promocode_my = newpromo;
        user.account.save().then(() => {
            if (!mp.players.exists(player)) return;
            player.notify(player.user.LangString("main.1228e663092cfe9feb3633b2067db23e"))
        })
    })
})


CustomEvent.registerCef('mainmenu:buyVip', (player, id: VipId, month: number) => {
    const user = player.user;
    if(!user) return;
    const cfg = getVipConfig(id);
    if(!cfg) return player.notify(player.user.LangString("main.f52b53a03d6ea06185442287696d042e"), 'error');
    const cost = cfg.cost * month;
    if(user.donate_money < cost) return player.notify(player.user.LangString("main.5c3bab9a65dd6e146a4529268ee4fcf3", cfg.name), 'error');
    user.giveVip(id, month * 30)
    user.removeDonateMoney(cost, user.LangString("main.911af134e8ff70e8bb66d1e8aced5d27"))
    user.save();
    player.notify(player.user.LangString("main.aed33b18f77a63c55172a60acbc9465e", cfg.name), 'success');
    CustomEvent.triggerCef(player, 'mainmenu:coins', user.donate_money);
})
CustomEvent.registerCef('mainmenu:buyShop', async (player, id: number, value?: any) => {
    const user = player.user;
    if(!user) return;
    const cfg = getDonateItemConfig(id);
    if(!cfg) return player.notify(player.user.LangString("main.8bc014741178a1a48fcdb2c3a4f707bd"), 'error');
    if(id == 4){
        if (!value || isNaN(value) || value < 1) return player.notify(player.user.LangString("main.f27f382253e435fdd11f32aa000e7a54"), 'error');
        const cost = value * cfg.price;
        if (user.donate_money < value) return player.notify(player.user.LangString("main.29e1464563133ce463cfbdeba6cc533b"), 'error');
        user.removeDonateMoney(value, user.LangString("main.767bdd18f610fcb885fb001f9ff4dfc0"))
        let sum = cost;
        if(getX2Param('donate')) sum *= 2;
        if(getX2Param('donate3')) sum *= 3;
        user.addMoney(sum, true, user.LangString("main.c47c79a3a981bb81715c69f95b528733"));
        user.save();
    } else if(id == 3){
        if(!player.user.mp_character) return player.notify(player.user.LangString("main.f9b7508a52500e85ab79960e6d3e008f"), 'error')
        if (user.donate_money < cfg.price) return player.notify(player.user.LangString("main.e437225801ad43ede5b354610abdd001"), 'error');
        user.removeDonateMoney(cfg.price, user.LangString("main.1949d9df53daa4033b1dbd4938468b8d"))
        user.skin = null;
        user.save();
        user.startCustomization();

        UserDatingEntity.delete({target: {id: user.id}})
    } else if(id == 2){
        const warns = [...user.entity.warns];
        const index = warns.findIndex(q => q.time > system.timestamp)
        if (!user.haveActiveWarns || index == -1) return player.notify(player.user.LangString("main.9c47d6566d8a00ca2d840252ed4e68be"), 'error');
        if (user.donate_money < cfg.price) return player.notify(player.user.LangString("main.21c503db3296a7065ec2ffdeabf5472c"), 'error');
        warns.splice(index, 1);
        user.entity.warns = warns;
        user.removeDonateMoney(cfg.price, user.LangString("main.e54f98a24eb0005a5dc4b2d62d499a48"))
        player.notify(player.user.LangString("main.bc5dea711ac4b7fa9de27ef2e3d5ec39"), 'success')
        user.save();
    } else if(id == 1){
        if (user.donate_money < cfg.price) return player.notify(player.user.LangString("main.a970f41f42bbe07523e31efe40981405"), 'error');
        if(value.split(' ').length !== 2) return player.notify(player.user.LangString("main.3d2559dec4ecb34013a07a2e69645e28"), 'error');
        const [name, fam] = value.split(' ');
        if(!name.match(/^[a-zA-Z]{0,20}$/i)) return player.notify(player.user.LangString("main.b39aa70d64e12a1e9c729fc388e573b9"), 'error')
        if(!fam.match(/^[a-zA-Z]{0,20}$/i)) return player.notify(player.user.LangString("main.2f03156da133f355f7f3cc2aa8eb88d3"), 'error')
        const exists = !!(await UserEntity.count({ rp_name: `${value}` }))
        if(exists) return player.notify(player.user.LangString("main.a6940ec23708bae4f7772f3d2ec216e5"), 'error');
        user.removeDonateMoney(cfg.price, user.LangString("main.0fa16b4f7d4d8ca465e52993f8c9f8ee"))
        user.name = value;
        player.notify(player.user.LangString("main.dbaa2ced18910e46032090d2e8097512"), 'success')
        RpHistoryEntity.delete({user: {id: user.id}})
        UserDatingEntity.delete({user: {id: user.id}})
        UserDatingEntity.delete({target: {id: user.id}})
        user.save();
    } else if(id == 5){
        if (user.donate_money < cfg.price) return player.notify(player.user.LangString("main.04dee00eac79f40bdc18e78ad597fcf8"), 'error');
        user.removeDonateMoney(cfg.price, player.user.LangString("main.4e4c527e8c030ca188c050ae75250c23"))
        if(value < 18 || value > 77) return player.notify(player.user.LangString("main.179ab11fdf5aee1568a1aa6b28285472"), 'error');
        user.age = value;
        player.notify(player.user.LangString("main.1119d6f40f51eac37bd8fe06f8bf5a15"), 'success')
        user.save();
    } else if(id == 7){
        if (user.donate_money < cfg.price) return player.notify(player.user.LangString("main.e76728ea457e512bd1f0b3332d78474e"), 'error');
        if (user.entity.inventory_level >= PLAYER_INVENTORY_MAX_LEVEL) return player.notify(player.user.LangString("main.2a4bf972216bc955fbeb3e0cb14d2b0a"), 'error');
        user.entity.inventory_level++;
        user.removeDonateMoney(cfg.price, user.LangString("main.01e01f9ca403798db7bb69d9ce6b9dfa"))
        player.notify(player.user.LangString("main.1607237e56663dc8eec3ef029011b1bc"), 'success')
        user.save();
        if(player.openInventory) return inventory.reloadInventory(player)
    } else if(id == 6){
        if (user.donate_money < cfg.price) return player.notify(player.user.LangString("main.019a0853f06bc13c2ed47fe969e00a35"), 'error');
        if(user.current_vehicle_limit >= DEFAULT_VEHICLE_PLAYER_LIMIT_MAX) return player.notify(player.user.LangString("main.205fac46a384d6c9ce98f77c2fbd8089", DEFAULT_VEHICLE_PLAYER_LIMIT_MAX), "error");
        user.removeDonateMoney(cfg.price, user.LangString("main.a157acf92974bfa41c6f334362f9246f"))
        user.addVehicleLimit();
        player.notify(player.user.LangString("main.a433ff05870d94bc339399b65947790b", user.current_vehicle_limit), 'success')
        user.save();
    }
    CustomEvent.triggerCef(player, 'mainmenu:coins', user.donate_money);
})

CustomEvent.registerCef('mainmenu:buyPacket', (player, id: number) => {
    const user = player.user;
    if(!user) return;
    const cfg = PACKETS.find(q => q.id === id);
    if(!cfg) return;
    if (user.donate_money < cfg.price) return player.notify(player.user.LangString("main.2f93a68cbcf1ab22a22f40c8a3dff4fc"), 'error');
    user.removeDonateMoney(cfg.price, player.user.LangString("main.9659be5aee62f239d8b00697a7a82699")+(cfg.name))
    const item = cfg.items
    if(item.vip) user.giveVip(item.vip.type, item.vip.time * 30);
    if(item.licenses) item.licenses.map(lic => user.giveLicense(lic.id, lic.days))
    if(item.money) user.addMoney(item.money, true, user.LangString("main.b8297628bd775d07d8db432999595f64", cfg.name));
    if(item.items) item.items.map(q => user.giveItem(q))
    user.save();
    player.notify(player.user.LangString("main.c34e6253658a194c336a4a3d3462918d"), 'success')

    CustomEvent.triggerCef(player, 'mainmenu:coins', user.donate_money);
})

CustomEvent.registerCef("usermenu:setHouseWaypoint", (player: PlayerMp) => {
    if (!player.user) return;
    if (!player.user.house || !player.user.houseEntity) return player.notify("House not found", "error");

    player.user.setWaypoint(player.user.houseEntity.x, player.user.houseEntity.y, player.user.houseEntity.z);
})

CustomEvent.registerCef("usermenu:setBusinessWaypoint", (player: PlayerMp) => {
    if (!player.user) return;
    if (!player.user.business) return player.notify("Business not found", "error");

    player.user.setWaypoint(player.user.business.positions[0].x, player.user.business.positions[0].y, player.user.business.positions[0].z);
})
