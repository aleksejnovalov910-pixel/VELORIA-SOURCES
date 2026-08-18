import { langStringDefault } from "../../shared/lang";
import {colshapes} from "./checkpoints";
import {LICENCE_CENTER_LIST, LicenseName} from "../../shared/licence";
import {menu} from "./menu";
import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {Vehicle} from "./vehicles";
import {weapon_list} from "../../shared/inventory";
import {document_templates} from "../../shared/documents";
import {inventory} from "./inventory";
import {MARKERS_SETTINGS} from "../../shared/markers.settings";

// const licenseMap = LICENCE_CENTER_LIST.filter((c) => !c.dontSpawn);

LICENCE_CENTER_LIST.forEach((element, index) => {
    if (element.dontSpawn) return;

    colshapes.new(new mp.Vector3(element.point.x, element.point.y, element.point.z), (player) => {
        return element.name
    }, (player) => {
        openLicense(player, index);
    }, {
        radius: MARKERS_SETTINGS.LICENCE_CENTER.r,
        color: MARKERS_SETTINGS.LICENCE_CENTER.color
    })
})


colshapes.new(LICENCE_CENTER_LIST.map(item => new mp.Vector3(item.point.x, item.point.y, item.point.z)), (player, index) => {
    return LICENCE_CENTER_LIST[index].name
}, (player, index) => {
        openLicense(player, index);
}, {
    radius: MARKERS_SETTINGS.LICENCE_CENTER.r,
    color: MARKERS_SETTINGS.LICENCE_CENTER.color
})

const getLicenses = (player: PlayerMp) => {
    const user = player.user;
    if(!user) return [];

    return user.licenses;
}


const openLicense = (player: PlayerMp, index: number) => {
    const user = player.user;
    if(!user) return;
    if(!user.social_number) return player.notify(player.user.LangString("license.d71f018bba128fdce5dfa04c7edb9c03"), "error");
    if (user.currentWeapon) return player.notify(player.user.LangString("license.9136302e2a0fa655e3cb9455903a1ba4"), "error")
    const cfg = LICENCE_CENTER_LIST[index];
    const title = player.user.LangString("license.f18464a84816730dde18744ee1dc37c5")
    
    const m = menu.new(player, title, player.user.LangString("license.631fba16ba09d187309bf5c7c4196627"));
    m.newItem({
        name: player.user.LangString("license.f18464a84816730dde18744ee1dc37c5"),
        //desc: `Для управления большинством видов транспорта в нашем штате необходимо иметь лицензию на вождение.`,
        onpress: () => {
            // user.setGui('drivingschool');
            // CustomEvent.triggerCef(player, 'drivingschool', getLicenses(player), 4)

            const isAnyLicenseNeedTheory = cfg.license.some(lic => lic.needTheory);
            if(isAnyLicenseNeedTheory){
                user.setGui('drivingschool');
                CustomEvent.triggerCef(player, 'drivingschool', getLicenses(player), ["car", "moto", "truck", "boat", "air"].includes(cfg.license[0].id) ? 4 : 1, cfg.license[0].id)
                return;
            }

            
            const submenu = menu.new(player, title, player.user.LangString("license.05c7be8c4921b9d0cbbd905844f8a5f8"));
            submenu.onclose = () => {openLicense(player, index)};

            cfg.license.map((lic, licid) => {
                // if(lic.needTheory){
                //     user.setGui('drivingschool');
                //     CustomEvent.triggerCef(player, 'drivingschool', getLicenses(player), ["car", "moto", "truck", "boat", "air"].includes(lic.id) ? 4 : 1, lic.id)
                    
                //     return;
                // }
                submenu.newItem({
                    name: LicenseName[lic.id],
                    more: `$${system.numberFormat(lic.cost)}`,
                    desc: langStringDefault("license.506eb9fdc211521912c42e7f2f7b2209", lic.time),
                    onpress: () => {
                        if (user.getLicense(lic.id)) return player.notify(player.user.LangString("license.abd0b3af8da1ed88362c84c9dffb8a38"), "error");
                        if (typeof player.licenseExam === "number") return player.notify(player.user.LangString("license.9b430f37b63bb42ffcad34c006a4090e"), "error")
                        if(user.currentWeapon) return player.notify(player.user.LangString("license.e47c17635e0eb9ccdbdef1af43d1a4c1"), "error")
                        if(lic.need_document){
                            const haveDoc = user.inventory.find(q => q.advancedNumber === user.id && q.advancedString === lic.need_document && q.item_id === 802 && (!lic.need_document_days || (parseInt(q.serial.split('|')[1]) + lic.need_document_days * 24 * 60 * 60) > system.timestamp));
                            if (!haveDoc) return player.notify(player.user.LangString("license.30fba639c9fb8736d009e0344577a88a", document_templates.find(q => q.id === lic.need_document).typeShort), "error")
                        }
                        submenu.close();
                        player.licenseExam = index;
                        player.licenseExamLic = licid

                            if(lic.guns){
                                user.teleport(cfg.start.x, cfg.start.y, cfg.start.z, cfg.start.h, system.personalDimension)
                                setTimeout(() => {
                                    if(!mp.players.exists(player)) return;
                                    const weapon = system.randomArrayElement(weapon_list.filter(q => lic.guns.includes(q.weapon)).map(q => q.hash))
                                    player.user.giveWeapon(weapon, 120);
                                    CustomEvent.triggerClient(player, 'license:gun', player.licenseExam, player.licenseExamLic, weapon)
                                }, 1000)
                            } else {
                                startPractice(player, true);
                            }
                    }
                })
            })

            submenu.open();
            
        }
    })

    m.newItem({
        name: langStringDefault("license.9c3120abac61343c9a796f8b0403c2d4"),
        desc: langStringDefault("license.09d2ed6a39cf70e69a27d84651d40010"),
        onpress: () => {
            const submenu = menu.new(player, title, player.user.LangString("license.578c310bf8f4968c66e08aa2f43900e3"));
            submenu.onclose = () => {openLicense(player, index)};

            cfg.license.map(lic => {
                submenu.newItem({
                    name: LicenseName[lic.id],
                    more: `$${system.numberFormat(lic.restore)}`,
                    desc: langStringDefault("license.16bb2bb185fe14b9103aebe379a0fd3d", lic.time),
                    onpress: () => {
                        if (typeof player.licenseExam === "number") return player.notify(player.user.LangString("license.d2cd42aa688a9fdca25faf2ea8c44827"), "error")
                        if (!user.getLicense(lic.id)) return player.notify(player.user.LangString("license.7522dbcab363d1a60cf0ee78847e10cd"), "error");
                        user.tryPayment(lic.restore, 'all', null, user.LangString("license.d625057f2b5cd767f6eb6083ed1cb06f", LicenseName[lic.id]), user.LangString("license.a032619352f7f52296579cc0961491f5")).then(status => {
                            player.dimension = 0;
                            if (!status) return openLicense(player, index);
                            user.giveLicense(lic.id, lic.time);
                            player.notify(player.user.LangString("license.aa86efafb1c6adafbd4e8382f7db880f"), "success")
                            user.questTick();
                            openLicense(player, index);
                        })
                    }
                })
            })

            submenu.open();
        }
    })

    m.open();
    
}

export const startPractice = (player: PlayerMp, status: boolean) => {
    const user = player.user;
    if (!user) return;
    const cfg = LICENCE_CENTER_LIST[player.licenseExam];
    if (!status || !cfg) {
        player.licenseExam = null;
        player.licenseExamLic = null;
        return;
    }
    const dimension = system.personalDimension
    player.licenseVehicle = Vehicle.spawn(system.randomArrayElement(cfg.license[player.licenseExamLic].models), new mp.Vector3(cfg.start.x, cfg.start.y, cfg.start.z), cfg.start.h, dimension, true, false);
    // player.dimension = dimension;
    user.teleport(cfg.start.x, cfg.start.y, cfg.start.z, cfg.start.h, dimension);
    // user.teleportVisible(cfg.start.h, new mp.Vector3(cfg.start.x, cfg.start.y, cfg.start.z));
    setTimeout(() => {
        if (!mp.players.exists(player)) return;
        if (!mp.vehicles.exists(player.licenseVehicle)) return;
        player.user.antiBlockEnterVehicle = true;
        player.user.putIntoVehicle(player.licenseVehicle, 0);
        CustomEvent.triggerClient(player, "autoschool:practice", player.licenseExam, player.licenseExamLic, player.licenseVehicle.id);
    }, system.TELEPORT_TIME + 1000)

    setTimeout(() => {
        player.user.antiBlockEnterVehicle = false;
    }, 10000);
}

CustomEvent.registerCef('client:autoschool:theory', (player, status: boolean) => {
    startPractice(player, status);
})

CustomEvent.registerClient('autoschool:practice:result', (player, result: boolean) => {
    practiceResult(player, result)
})

CustomEvent.registerClient('licese:weapon:result', (player, result: boolean) => {
    player.user.removeWeapon();
    practiceResult(player, result)
})

CustomEvent.registerCef('client:autoschool:selectCategory', (player: PlayerMp, category: string) => {
    const user = player.user;
    if (!user) return;

    let index = -1;
    let licId = -1;

    LICENCE_CENTER_LIST.forEach((cfg, idx) => {
        cfg.license.forEach((lic, id) => {
            if (lic.id === category) {
                index = idx;
                licId = id;
            }
        })
    });


    player.licenseExam = index;
    player.licenseExamLic = licId
})

const practiceResult = (player: PlayerMp, result: boolean) => {
    const user = player.user;
    if (!user) return;
    const cfg = LICENCE_CENTER_LIST[player.licenseExam];
    const license = LICENCE_CENTER_LIST[player.licenseExam].license[player.licenseExamLic];
    user.teleport(cfg.point.x, cfg.point.y, cfg.point.z, null);
    setTimeout(() => {
        if (!mp.players.exists(player)) return;
        destroyVeh(player)
        player.licenseExam = null
        player.licenseExamLic = null
        const haveDoc = user.inventory.find(q => q.advancedNumber === user.id && q.advancedString === license.need_document && q.item_id === 802 && (!license.need_document_days || (parseInt(q.serial.split('|')[1]) + license.need_document_days * 24 * 60 * 60) > system.timestamp));
        if (license.need_document) {
            if (!haveDoc) return player.notify(player.user.LangString("license.9e95026ceda06eced80b7011c0f48617", document_templates.find(q => q.id === license.need_document).typeShort), "error")
        }
        if (!result) return player.notify(player.user.LangString("license.ae441f4674cb8ad1e9ad115c90641262"), "error"), player.dimension = 0;
        user.tryPayment(license.cost, "all", () => {
            return !user.getLicense(license.id)
        }, user.LangString("license.1d81515a3bd89168213139364dcb3cdf", LicenseName[license.id]), user.LangString("license.0698d59524e83722a58e49c7d1f3f513")).then(status => {
            player.dimension = 0;
            if (!status) return;
            if (haveDoc && license.need_document_remove) inventory.deleteItem(haveDoc);
            user.giveLicense(license.id, license.time);
            player.notify(player.user.LangString("license.a73a29991634a26534bbb0195e798b8e"), "success")
            user.questTick();
        })
    }, 5000)
}

const destroyVeh = (player: PlayerMp) => {
    if (player.licenseVehicle && mp.vehicles.exists(player.licenseVehicle)) {
        Vehicle.destroy(player.licenseVehicle);
    }
    player.licenseVehicle = null;
}

mp.events.add('playerQuit', player => {
    destroyVeh(player)
})