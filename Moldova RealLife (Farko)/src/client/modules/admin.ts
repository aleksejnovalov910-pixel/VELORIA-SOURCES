import { GetCurrentLang, LangString, SetCurrentLang, langStringDefault } from "./lang";
import {cursorX, cursorY, disableControlGroup, raycastTarget, registerHotkey, tempCursorStatus} from "./controls";
import {currentMenu, DialogInput, MenuClass} from "./menu";
import {CustomEvent} from "./custom.event";
import {user} from "./user";
import {inventoryShared} from "../../shared/inventory";
import {gui, inputOnFocus} from "./gui";
import {system} from "./system";
import {vehicles} from "./vehicles";
import {selectItem} from "./inventory";
import {vehicleSpawnPoints} from "../../shared/npc.park.zone";
import {CAMERA_WAYPOINTS} from "../../shared/cameraWaypoints";
import {CamerasManager, drawCameraConf} from "./cameraManager";
import {DialogAccept} from "./accept";
import {GANGWAR_RADIUS, GANGWAR_ZONES} from "../../shared/gangwar";
import {ATTACH_BONES_LIST} from "../../shared/attach.system";
import {createDress} from "./cloth";
import SplineCameraGUI from "./splineCamera";
import { getAllLangs } from "../../shared/lang";

const player = mp.players.local

CustomEvent.register("admin", () => {
    adminMenu()
})

let inSp:PlayerMp;
let inSpId: number;
let spError = false;

export const inSpectatorMode = () => {
    return inSp;
}


mp.keys.bind(0x72, false, () => { // F3
    if(user.admin_level == 0) return;
    if (!mp.game.recorder.isRecording()) {
        mp.game.recorder.start(1);
    } else {
        mp.game.recorder.stop(true);
    }
});

let currentQuickAdmin = false;
mp.keys.bind(48, true, () => {
    if(!user.isAdminNow()) return;
    if(gui.currentGui) return;
    if(inputOnFocus) return;
    currentQuickAdmin = !currentQuickAdmin;
    tempCursorStatus(currentQuickAdmin)
    sendAdminPanelData();
})

mp.keys.bind(113, true, () => {
    if (!user.isAdminNow()) return;
    if (gui.currentGui) return;
    if (inputOnFocus) return;

    CustomEvent.triggerServer("mainmenu:open", true);
    setTimeout(() => {
        CustomEvent.triggerCef("ticket:selectFirstFree", true);
    }, 500)
})

setInterval(() => {
    if(!user.isAdminNow()) return;
    if(!currentQuickAdmin) return;
    sendAdminPanelData()
}, 10000)

const sendAdminPanelData = (id?: number) => {
    CustomEvent.triggerCef("admin:panel:show", currentQuickAdmin, currentQuickAdmin ? system.sortArrayObjects(mp.players.toArray().filter(player => player.getVariable("id")).map(q => {
        return {
            id: q.getVariable("id"),
            name: q.getVariable("name"),
            dist: system.distanceToPos(mp.players.local.position, q.position)
        }
    }), [
        {id: "dist", type: "ASC"}
    ]).map(player => {
        return [player.id, player.name]
    }) : [], id)
}

mp.events.addDataHandler("admin:freeze", async (target: VehicleMp, val: boolean) => {
    if(target.type !== "player") return;
    target.freezePosition(val);

    if (val) mp.events.add("render", freezeRender)
    else mp.events.remove("render", freezeRender)
})

mp.events.add("entityStreamIn", async (target: PlayerMp) => {
    if (target.type !== "player") return;
    if (!target.getVariable("admin:freeze")) return;
    target.freezePosition(true);
});

function freezeRender() {
    if(player.getVariable("admin:freeze")) disableControlGroup.allControls()
}

// mp.events.add("render", () => {
//     if(player.getVariable("admin:freeze")) disableControlGroup.allControls()
// })

CustomEvent.registerServer("admin:sp", (pos: [number, number, number], remoteId: number, id: number) => {
    const target = mp.players.atRemoteId(remoteId);
    if(!target && !target.handle) return user.notify(LangString("admin.d0744a2cac91803a0b16614d5b3130dc"), "error");
    inSp = target
    inSpId = id
    spError = true;
    currentQuickAdmin = true;
    tempCursorStatus(true)
    sendAdminPanelData(id)
    player.setCoords(pos[0], pos[1], pos[2], true, true, true, true)

    if (inSp) mp.events.add("render", spectateRender)

    setTimeout(() => {
        spError = false;
    }, 5000)
});

mp.events.add("admin:spectate:stop", (returnMe, tpHim, id) => {
    CustomEvent.triggerServer("admin:spectate:stop", returnMe, tpHim, id)
    stop();
})

const stop = () => {
    inSp = null;
    inSpId = null;
    spError = true;
    CustomEvent.triggerCef("admin:spectate:stop")
    user.notify(LangString("admin.3b626bd83806e83488ccc2625baf54c8"), "error");
    if(currentQuickAdmin) sendAdminPanelData();

    mp.events.remove("render", spectateRender)
}

function spectateRender() {
    if(!inSp) return;
    if(!user.isAdminNow()){
        stop()
        CustomEvent.triggerServer("admin:spectate:stop")
        return;
    }
    if(!spError && (!mp.players.exists(inSp) || !inSp.handle || player.position.z > 2000)){
        spError = true;
        CustomEvent.triggerServer("admin:spectate:problem", inSpId)
        return;
    }
    if(mp.players.exists(inSp) && inSp.handle){
        const pos = inSp.position;
        const h = inSp.getHeading();
        if(pos) player.setCoords(pos.x - 5, pos.y, pos.z - 10, true, true, true, true)
        if(h) player.setHeading(h);
        mp.game.invoke("0x8BBACBF51DA047A8", inSp.handle)
    }
}


export let debug = false;



let anticheatNotify = true;

function adminMenu() {
    if (!user.admin_level) return;
    let m = new MenuClass("", LangString("admin.774604740bfca9d37d45f13590bb0b5c"));
    m.spriteName = "admin"
    m.exitProtect = true;
    m.newItem({
        name: user.enabledAdmin ? LangString("admin.d980359a4327a2c0f65f40a7c7edbd75") : LangString("admin.43b92d828ae2e943ff3ca3cf677290f8"),
        onpress: async () => {
            if(user.enabledAdmin && noClipEnabled) return user.notify(LangString("admin.bada7e6d5884a449153635d02973d60c"), "error")
            if(user.enabledAdmin && inSpectatorMode()) return user.notify(LangString("admin.2801f9f73c02db5d182439f107af8590"), "error")
            const status = !user.enabledAdmin
            if(!status && currentQuickAdmin){
                currentQuickAdmin = false;
                sendAdminPanelData()
            }
            user.enabledAdmin = !user.enabledAdmin;
            let c = 0;
            while (c < 100 && status != user.enabledAdmin) {
                await system.sleep(10)
                c++;
            }
            adminMenu()
        }
    })
    if (user.enabledAdmin){
        m.newItem({
            name: LangString("admin.236e7f9ee15aa7a3a9960bc2641ffac4"),
            onpress: () => {
                usersList()
            }
        })
    }
    m.newItem({
        name: "Admin-Chat",
        onpress: () => {
            m.close();
            gui.setGui("adminchat");
        }
    })
    m.newItem({
        name: LangString("admin.a845a1cf8ba60fae6ad2d659e81b4325"),
        onpress: () => {
            m.close();
            gui.setGui("admincheat");
        }
    })
    if (!user.enabledAdmin) return m.open();
    m.newItem({
        name: LangString("admin.b3c9d825ab8e4153de46db721f1c809e"),
        more: anticheatNotify ? LangString("admin.07b8b80585974ec63287a298dd8f7f52") : LangString("admin.1a9dde315ed06391f2ec60a3a6f9fd3d"),
        desc: LangString("admin.4a14ca694fac754057bff6b75059149d"),
        onpress: () => {
            anticheatNotify = !anticheatNotify;
            CustomEvent.triggerServer("anticheatNotify", anticheatNotify);
            adminMenu()
        }
    })
    m.newItem({
        name: LangString("admin.460e3d432d1d7b21614b8b6acfb3d80c"),
        onpress: () => {
            DialogInput("Introduceti un nume nou", player.getVariable("adminName") || "", 15).then(name => {
                if(!name) return;
                name = system.filterInput(name);
                if(!name) return;
                CustomEvent.triggerServer("admin:setName", name)
            })
        }
    })
    m.newItem({
        name: LangString("admin.54c443146a9dccec8ce9f94cdf33dca8"),
        onpress: () => {
            user.teleportWaypoint();
        }
    })
    m.newItem({
        name: LangString("admin.c3390490ce6f94d1d73d19795941f936"),
        onpress: () => {
            vehicleMenu()
        }
    })
    if (user.hasPermission("admin:events:system")) {
        m.newItem({
            name: LangString("admin.e6c456ea71734f1d43c18a8b85b276e5"),
            onpress: () => {
                CustomEvent.triggerServer("admin:events:system")
            }
        })
    }
    if (user.hasPermission("admin:1xPromocodes:manage")) {
        m.newItem({
            name: LangString("admin.b7843f3c209bfa2abe3cbd70ca60d1ce"),
            onpress: () => {
                CustomEvent.triggerServer("admin:onetimePromo");
            }
        });
    }
    if (user.hasPermission("admin:gamedata:menu")) {
        m.newItem({
            name: LangString("admin.e7c456ab61841e1dbd408401ec526436"),
            onpress: () => {
                gameMenu()
            }
        })
    }
    if (user.hasPermission("admin:mainmenu:ads")) {
        m.newItem({
            name: LangString("admin.ccae98382319727201605987b2758d40"),
            onpress: () => {
                m.close();
                CustomEvent.triggerServer("admin:mainmenu:ads")
            }
        })
    }
    if (user.hasPermission("admin:global:notify")) {
        m.newItem({
            name: LangString("admin.fe71a739cb9e2f83da0c3d22981ca148"),
            desc: LangString("admin.b57b6cbd4afb88cb7b8c4b9bbecd1b74"),
            type: "list",
            list: [LangString("admin.b69ff1a0fbe6a7efb0ed52284cb2c24a"), LangString("admin.dc66f0029a972e0f29eeb6bc3a4cd6f2")],
            onpress: (itm) => {
                m.close();
                DialogInput(LangString("admin.6e595a286f818bd500fd654cf074a017"), "", 120, "textarea").then(text => {
                    if(!text) return;
                    CustomEvent.triggerServer("admin:global:notify", text, !!itm.listSelected)
                })
            }
        })
        m.newItem({
            name: LangString("admin.0a49faf24d9ec1fa5eec157c4dfdbbb9"),
            desc: LangString("admin.a86caefd823fb2834555d03f898be335"),
            type: "list",
            list: [LangString("admin.c2fb27b5a7ba7a452d287d15b8f5e15c"), LangString("admin.a22a293a5bafa71f866a01703ce87981")],
            onpress: (itm) => {
                m.close();
                DialogInput(LangString("admin.caadefb2884741b859431ce3b478cb76"), "", 120, "textarea").then(text => {
                    if(!text) return;
                    CustomEvent.triggerServer("admin:globalevent:notify", text, !!itm.listSelected)
                })
            }
        })
    }
    if (user.hasPermission("admin:x2func")) {
        m.newItem({
            name: LangString("admin.ac97dee8be3bc46b2c769a01ce619432"),
            onpress: () => {
                m.close();
                CustomEvent.triggerServer("admin:x2func")
            }
        })
    }
    if(user.hasPermission("admin:familyControl")) {
        m.newItem({
            name: LangString("admin.fdb84883b63f7673695eb29302cbb7b7"),
            onpress: () => {
                m.close();
                CustomEvent.triggerServer("admin:familyControl")
            }
        })
    }
    if (user.hasPermission("admin:paydayglobal")) {
        m.newItem({
            name: LangString("admin.460c7c7d1d5b9bf53d4f5b3212627b42"),
            desc: LangString("admin.2faabebebc16e1f33e0aa1baf23fe0db"),
            onpress: () => {
                m.close();
                DialogAccept(LangString("admin.6d472c014c60e4995efb0accc19aacd6"), "big").then(status => {
                    if(!status) return;
                    CustomEvent.triggerServer("admin:paydayglobal")
                })
            }
        })
    }
    // if (user.hasPermission("admin:language:change")) {
    //     m.newItem({
    //         type: 'list',
    //         name: "Language",
    //         desc: "Change current language",
    //         list: getAllLangs(),
    //         listSelected: getAllLangs().indexOf(GetCurrentLang()),
    //         onpress: (itm) => {
    //             m.close();
    //             CustomEvent.triggerServer('admin:server:setLang', itm.listSelected)
    //             CustomEvent.triggerCef('admin:cef:setLang', itm.listSelected)
    //             SetCurrentLang(getAllLangs()[itm.listSelected]);
    //             adminMenu();
    //         }
    //     })
    // }
    m.newItem({
        name: LangString("admin.b4f37f7c856c603d24fd474ea6fa7888"),
        onpress: () => {
            devData();
        }
    })
    if(user.hasPermission("admin:blacklist")){
        m.newItem({
            name: LangString("admin.00c66f8bc560a73b9b70ec122dbdb7d1"),
            onpress: () => {
                CustomEvent.triggerServer("admin:blacklist")
            }
        })
    }
    if(user.hasPermission("admin:allheal")){
        m.newItem({
            name: LangString("admin.0c9c8d7f0efd30f374d93448ba668e2c"),
            onpress: () => {
                CustomEvent.triggerServer("admin:allheal")
            }
        })
    }
    if(user.test){
        m.newItem({
            name: LangString("admin.5363daa0ad17f325d6b4482af8659c6d"),
            onpress: () => {
                CustomEvent.triggerServer("users:whitelist")
            }
        })
    }
    m.newItem({
        name: LangString("admin.35ba14d10389b02b8b5d15fd4bda9201"),
        onpress: () => {
            m.close();
            CustomEvent.triggerServer("admin:reconnect")
        }
    })
    m.newItem({
        name: LangString("admin.370858bf7039f317fb9cccf18ed7b168"),
        onpress: () => {
            m.close();
            CustomEvent.triggerServer("admin:quit")
        }
    })
    if (user.hasPermission("admin:system:reboot")) {
        m.newItem({
            name: LangString("admin.e3249a1fed41e258618f7a7a6925061a"),
            onpress: () => {
                const submenu = new MenuClass("", LangString("admin.a099cb1c0d187407163cac33c447cbcb"));
                submenu.spriteName = "admin"
                submenu.exitProtect = true;
                submenu.newItem({
                    name: LangString("admin.191ceebfe6d8cc775e4b782985226d73"),
                    desc: LangString("admin.40f47fac1ee64486940de21bf4063056"),
                    type: "range",
                    rangeselect: [0, 120],
                    onpress: (itm) => {
                        if (!user.hasPermission("admin:system:reboot")) return;
                        let code = system.randomStr(4, "QAZXDCFGHJKLVBNMRTYHJK")
                        DialogInput(LangString("admin.951920dbefd299e16b23c520495fc13f", code), "", 120).then(reason => {
                            if (!reason) return user.notify(LangString("admin.8c495dbf50b76acac40473e4cbe76175"), "success");
                            if (reason !== code) return;
                            if (!user.hasPermission("admin:system:reboot")) return;
                            MenuClass.closeMenu();
                            CustomEvent.triggerServer("admin:system:reboot", itm.listSelected)
                        })
                    }
                })
                submenu.newItem({
                    name: LangString("admin.41e2df02406efdc4c7168583bd359a1b"),
                    onpress: (itm) => {
                        if (!user.hasPermission("admin:system:reboot")) return;
                        CustomEvent.triggerServer("admin:system:rebootstop")
                    }
                })
                submenu.newItem({
                    name: LangString("admin.0c9bef9ca98fd9215e1108b6925f0ca7"),
                    desc: LangString("admin.0bee6963946975302cdc7b5e3972d5a4"),
                    onpress: (itm) => {
                        if (!user.hasPermission("admin:system:reboot")) return;
                        CustomEvent.triggerServer("admin:system:update")
                    }
                })

                submenu.open();
            }
        })
    }
    m.newItem({
        name: LangString("admin.08e77b28b45405a1a69e86f9f03b5af1"),
        onpress: () => {
            m.close();
            CustomEvent.triggerServer("admin:fullrestore")
        }
    })
    m.newItem({
        name: LangString("admin.c455fdf974ff264e6b0d08c6df4da6d1"),
        onpress: () => {
            m.close();
            CustomEvent.triggerServer("death:log")
        }
    })

    m.open();
}
let lastSpawnModel = mp.storage.data.lastVehicle || null;
const vehicleMenu = () => {
    let m = new MenuClass("", LangString("admin.3db6dc0d25d5f329dcc06867efb824f8"));
    m.onclose = () => { adminMenu(); }
    m.spriteName = "admin"
    m.newItem({
        name: LangString("admin.54fe5256762209b1e1b1dbc0cb91581a"),
        onpress: () => {
            const spawnMethood = [LangString("admin.f7d1df94de50eca8922193487b3c2b0d"), LangString("admin.0b14172eb2d60b9dc9832fdd96f81ce7")];
            let spawnMethoodSelect = 0;
            let headersList:string[] = [LangString("admin.bad78bde14f661a0c51a48ba9aa63a2f")];
            for (let id = 1; id <= 360; id++) headersList.push(`${id}`)
            let headerSelect = 0;
            const submenu = new MenuClass("", LangString("admin.b4172a806c3c99dacad07eb2ba8c77f5"));
            submenu.onclose = () => { vehicleMenu(); }
            submenu.newItem({
                name: LangString("admin.e4d6e415e43bacda63cf546695b29bf7"),
                onpress: () => DialogInput(LangString("admin.aded1ccded89de810efd8afade38f4e4")).then(async model => {
                    if (!model) return;
                    if(noClipEnabled) return user.notify(LangString("admin.6957f9398bf2663a62df7c67eb282ed9"), "error")
                    if (!mp.game.streaming.isModelAVehicle(mp.game.joaat(model))) return user.notify(LangString("admin.34189043ad4e86b28cbc0b03d0d888db"), "error");
                    CustomEvent.triggerServer("admin:spawn:vehicle", model, spawnMethoodSelect, headerSelect)
                    let c = 0;
                    while (spawnMethoodSelect && !player.vehicle && c < 100) await system.sleep(20), c++;
                    lastSpawnModel = model;
                    mp.storage.data.lastVehicle = model;
                    vehicleMenu();
                })
            })
            submenu.newItem({
                name: LangString("admin.330e072d0ff28a427b9092e6fb9c7999"),
                type: "list",
                list: spawnMethood,
                listSelected: spawnMethoodSelect,
                onchange: (val) => {
                    spawnMethoodSelect = val;
                }
            })
            submenu.newItem({
                name: LangString("admin.552bf9cdc1ae97b57712ba89aaec4272"),
                desc: LangString("admin.f4d7cf3833514ac715723f1964f47d5f"),
                type: "list",
                list: headersList,
                listSelected: headerSelect,
                onchange: (val) => {
                    headerSelect = val;
                }
            })
            if (lastSpawnModel) {
                submenu.newItem({
                    name: LangString("admin.27b9cd38d030a1acc1f4b487419ecb03"),
                    more: lastSpawnModel,
                    desc: LangString("admin.bc26e76af90f5a079b7c80afa0ae3bf2"),
                    onpress: () => {
                        if(noClipEnabled) return user.notify(LangString("admin.82ee5a9a198df66de15293d186e73422"), "error")
                        CustomEvent.triggerServer("admin:spawn:vehicle", lastSpawnModel, spawnMethoodSelect, headerSelect)
                    }
                })
            }
            submenu.open();

            
        }
    })
    m.newItem({
        name: LangString("admin.f91ccc969c69ba5936a0e3cef3c4da80"),
        onpress: () => {
            CustomEvent.triggerServer("admins:vehicle:respawnRange")
        }
    })
    if (user.hasPermission("admin:vehicle:configs")) {
        m.newItem({
            name: LangString("admin.2177793f25cf521b746722956e18833e"),
            onpress: () => {
                CustomEvent.triggerServer("admins:vehicle:config")
            }
        })
    }
    if (player.vehicle) {
        m.newItem({
            name: LangString("admin.3ad55ac1b191f9f646a51a08a07988fa"),
            onpress: () => {
                CustomEvent.triggerServer("admins:vehicle:info")
            }
        })
        m.newItem({
            name: LangString("admin.7157973103a3df836a888192be9c53e3"),
            desc: LangString("admin.310e01c2b9519a498518f5ecc0a84645"),
            onpress: () => {
                CustomEvent.triggerServer("admins:vehicle:fuel")
            }
        })
        m.newItem({
            name: LangString("admin.cc97220d03092ce72f0498e53c733080"),
            desc: LangString("admin.633af83f8514dc952145a794ac61abf2"),
            onpress: () => {
                CustomEvent.triggerServer("admins:vehicle:color")
            }
        })
    }
    m.newItem({
        name: LangString("admin.b839e37c7b676de1e6bcb78d7852aab1"),
        desc: LangString("admin.6e8f7b55a44f7bf269313715d2fe8caa"),
        onpress: () => {
            const veh = vehicles.findNearest(5);
            if (!veh) return user.notify(LangString("admin.6867abc862276116d4104063eda83816"), "error");
            if (veh.autosalon) return;
            CustomEvent.triggerServer("admins:vehicle:respawn", veh.remoteId, false)
        }
    })
    m.newItem({
        name: LangString("admin.6aa8096de957c0c405ab4b09465e0a92"),
        desc: LangString("admin.2edcc2bcadf39a5c9073fc3acdbbf224"),
        onpress: () => {
            const veh = vehicles.findNearest(5);
            if (!veh) return user.notify(LangString("admin.afe9000bf3fffa053fc0eeedc0979254"), "error");
            if (veh.autosalon) return;
            CustomEvent.triggerServer("admins:vehicle:respawn", veh.remoteId, true)
        }
    })
    m.newItem({
        name: LangString("admin.48c7d99a6b891d980b562f4212531984"),
        desc: LangString("admin.79be6810f5aa963d390958d2bf912c7b"),
        onpress: () => {
            const veh = vehicles.findNearest(5);
            if (!veh) return user.notify(LangString("admin.02eb8f54cff93f6c04594da1f9bb545c"), "error");
            if (veh.autosalon) return;
            CustomEvent.triggerServer("admins:vehicle:fullFix", veh.remoteId)
        }
    })

    m.open()
}


const usersList = (name?: string) => {
    if (name) name = name.toLowerCase();
    let m = new MenuClass(LangString("admin.e70747404d8ce54c1f46f248c2f24385"))
    m.onclose = () => { adminMenu(); }
    m.newItem({
        name: LangString("admin.ee6d8c19fde672dc160f74fcbbbf9b38"),
        more: name,
        onpress: () => {
            DialogInput(LangString("admin.df2cc4a74bf47b8774d7f0ab2180be8b"), name ? name : "").then(val => {
                if (val === null) return usersList(name)
                else return usersList(val);
            })
        }
    })
    m.newItem({
        name: LangString("admin.adec256d88d7b89b6bc237ee2887df90"),
        onpress: () => {
            DialogInput(LangString("admin.64dd76e8c4aa415c8d1575620abe0b05"), null, 6, "int").then(val => {
                if (val === null) return;
                if(val <= 0) return;
                CustomEvent.triggerServer("admin:users:choice", val)
            })
        }
    })
    m.newItem({
        name: `${mp.players.local.getVariable("name")} (EU)`,
        more: `ID: ${mp.players.local.getVariable("id")}`,
        onpress: () => {
            CustomEvent.triggerServer("admin:users:choice", mp.players.local.getVariable("id"))
        }
    })
    mp.players.toArray().filter(player => player.getVariable("id") && user.id != player.getVariable("id") && (!name || player.getVariable("name").toLowerCase().includes(name) || parseInt(name) == player.getVariable("id"))).map(player => {
        const id = player.getVariable("id")
        m.newItem({
            name: player.getVariable("name"),
            more: `ID: ${id}`,
            onpress: () => {
                CustomEvent.triggerServer("admin:users:choice", id)
            }
        })
    })
    m.open();
}


const coordDebugData: [string, number][] = [
    [LangString("admin.ea18f7047ae0e64abedb011cee18d6f0"), 0],
    [LangString("admin.7d5b7cef96669f133838eb8af46965e5"), 1],
    [LangString("admin.9acf2cd116c7d9056df22d53d5286e4c"), 0.9]
]

const drawDebugCoordString = (name: string, offset: number, type: number, withHeading: boolean) => {
    const crd = player.vehicle ? player.vehicle.position : player.position
    const pos = new mp.Vector3(crd.x, crd.y, crd.z - offset);
    const res = !type ? `${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}${withHeading ? `, ${Math.floor(player.getHeading())}` : ""}` : `x: ${pos.x.toFixed(2)}, y: ${pos.y.toFixed(2)}, z: ${pos.z.toFixed(2)}${withHeading ? `, h: ${Math.floor(player.getHeading())}` : ""}`
    DialogInput(name, res)
}

let debugPointsList: [Vector3Mp, number, MarkerMp, BlipMp][] = []

const clearPoints = () => {
    debugPointsList.map(item => {
        if (mp.markers.exists(item[2])) item[2].destroy();
        if (mp.blips.exists(item[3])) item[3].destroy();
    })
    debugPointsList = [];
}

export let adminDataDrawPlayers = false;
export let adminDataDrawVehicles = false;
export let adminDataDrawRange = 1;

const devData = () => {
    clearPoints();
    let m = new MenuClass(LangString("admin.e93aaf4835733f00d26ada44be04fe9f"))
    m.exitProtect = true;
    m.onclose = () => { adminMenu(); }
    m.newItem({ name: LangString("admin.3bd55b3643cc4a3320f339ea5796fbc7"), onpress: () => { debug = !debug } })
    m.newItem({ name: LangString("admin.a2bed8eba8fcf0ecc9bd246597343040"), desc: LangString("admin.85e7d1f80eb48496aaaccf3f95c959e8"), onpress: () => { adminDataDrawPlayers = !adminDataDrawPlayers } })
    m.newItem({ name: LangString("admin.b24585f7b8c3ea259f1dbc77557aabc4"), desc: LangString("admin.5ebc7495111a5eec165b18b572f2f9f9"), onpress: () => { adminDataDrawVehicles = !adminDataDrawVehicles } })
    m.newItem({ name: LangString("admin.bf2e26bc4f130073a80efa867ce35294"), desc: LangString("admin.9e36a257d180864a6cf13f6674257494"), onpress: SplineCameraGUI.createMenu})
    m.newItem({ name: LangString("admin.9a3b8c315cdf5a1e90b36949c5bf725c"), desc: LangString("admin.21a63e78bf3b7cf7a4b8da323eb6dbcd"), onpress: () => {
        DialogInput(LangString("admin.798ba23e7b3faf248489d7bce1a3a1c4"), adminDataDrawRange, 7, "float").then(val => {
            if(!val) return;
            adminDataDrawRange = val;
        })
    } })

    m.newItem({ name: LangString("admin.8fe83d20a087b30d080f3d84c4158099"), onpress: () => { user.notify(LangString("admin.093939048dff4c45d9830d0aba6d8ce5"), "error") } });
    coordDebugData.map(([name, offset]) => {
        m.newItem({
            name: name,
            type: "list",
            list: [LangString("admin.6f0a81fbcd0653788c7d9fdfa3f90389"), LangString("admin.efd39664f8da5a6ab63b8844e8bf385b"), LangString("admin.8d576f4ebb5cf91a497018b4911ff9af"), LangString("admin.a4f5e6c178427d23bb514b40d705e6b3")],
            onpress: (itm) => {
                if (itm.listSelected === 0) return drawDebugCoordString(name, offset, 0, false)
                if (itm.listSelected === 1) return drawDebugCoordString(name, offset, 1, false)
                if (itm.listSelected === 2) return drawDebugCoordString(name, offset, 0, true)
                if (itm.listSelected === 3) return drawDebugCoordString(name, offset, 1, true)
            }
        })
    })

    m.newItem({ name: LangString("admin.8364242f5750a1fe8e303751fe166f2c"), onpress: () => { user.notify(LangString("admin.d997dbc1215ad068ef95fbe1bfb6b672"), "error") } });

    coordDebugData.map(([name, offset]) => {
        m.newItem({
            name: name,
            type: "list",
            list: [LangString("admin.ad495e344f64b2129e1304df9bdbcbb7"), LangString("admin.9c3f71ed51cc147199616078269e4f54"), LangString("admin.946da0ff55fbd3543411eea47b0fba03"), LangString("admin.ce430d322eb7d9f58ce2b0f73de22d1f")],
            onpress: (itm) => {
                const submenu = new MenuClass(LangString("admin.e16e2733c53de21ec8f2aef67c2e3c6d"), itm.listSelectedName);
                submenu.onclose = () => { devData()}
                submenu.newItem({
                    name: LangString("admin.3b7e3282f4b739dd48bba6adb5e9ae81"),
                    onpress: () => {
                        const crd = player.vehicle ? player.vehicle.position : player.position
                        const pos = new mp.Vector3(crd.x, crd.y, crd.z - offset);
                        const pos2 = new mp.Vector3(crd.x, crd.y, crd.z + 1);
                        const marker = mp.markers.new(0, pos2, 2,
                            {
                                color: [255, 0, 0, 255],
                                dimension: player.dimension
                            })

                        const blip = mp.blips.new(164, pos2,
                            {
                                scale: 0.5,
                                color: 1,
                                dimension: player.dimension
                            })
                        
                        debugPointsList.push([pos, player.getHeading(), marker, blip])
                    }
                })

                submenu.newItem({
                    name: LangString("admin.0864d4cd7d19fca8ddec0037c6e762d1"),
                    onpress: () => {
                        const res = debugPointsList.map(q => {
                            let s = itm.listSelected === 0 || itm.listSelected === 2 ? [q[0].x.toFixed(2), q[0].y.toFixed(2), q[0].z.toFixed(2)] : { x: q[0].x.toFixed(2), y: q[0].y.toFixed(2), z: q[0].z.toFixed(2)}
                            if(itm.listSelected === 2 || itm.listSelected === 3){
                                if (itm.listSelected === 2) {
                                    (s as string[]).push(q[1].toFixed(0))
                                } else {
                                    (s as any).h = q[1].toFixed(0);
                                }
                            }
                            return s
                        })
                        DialogInput(LangString("admin.31262e848533354d7bf05d135b1c005d"), JSON.stringify(res).replace(/}/g, "|").replace(/{/g, "|").replace(/\[/g, "|").replace(/]/g, "|").replace(/"/g, "").replace(/'/g, ""), 99999999, "textarea");
                        // user.notify("Данные скопированы в буфер обмена", "success")
                    }
                })

                submenu.newItem({
                    name: LangString("admin.4588e4d24ef2cb061c174521c824474e"),
                    onpress: () => {
                        clearPoints();
                    }
                })


                submenu.open();
            }
        })
    })

    m.newItem({ name: LangString("admin.ede5293489a8ebc728f847203130f668"), onpress: () => { user.notify(LangString("admin.cf5ed1767f333bc831e2d4cc2389b01f"), "error") } });

    m.newItem({
        name: LangString("admin.b333e331242bbe26b5a9aa20c9fd681c"),
        desc: LangString("admin.e0740147bdff2f990905dc346cbb12ff"),
        onpress: () => {
            generateChairConfig()
        }
    })
    m.newItem({
        name: LangString("admin.a902f7cea82bf665a5f2e55ab4db598d"),
        desc: LangString("admin.23641b54ee5b8b919ed023103c3cf2d3"),
        onpress: () => {
            generatePlayerInVehicleConfig()
        }
    })
    m.newItem({
        name: LangString("admin.560c3a08587aebec31c032a827ff7d34"),
        desc: LangString("admin.b49f67cf3c316416dc81fad31de54b55"),
        onpress: () => {
            generateInventoryAttach()
        }
    })
    m.newItem({
        name: LangString("admin.426f68a9045366b89a33a774a1235df7"),
        desc: LangString("admin.a87e393c90e4193747bc5ef90bf53314"),
        onpress: () => {
            createDress(true)
        }
    })
    m.newItem({
        name: LangString("admin.6949bfb6305f00c1efe11567741d12a4"),
        desc: LangString("admin.ebf92c02f10b19afb3c43414943e1ac7"),
        onpress: () => {
            generateAnimConfig()
        }
    })
    m.newItem({
        name: LangString("admin.5a81cddd551dc8ece80bf53f910c5c3c"),
        desc: LangString("admin.3a6ccf710ec06ecc7624351bfa7fa0f0"),
        onpress: () => {
            generateScenarioConfig()
        }
    })
    m.newItem({
        name: LangString("admin.18ed782322269b21b999190d4af7ecee"),
        desc: LangString("admin.aef6ba8d1cafad084f35552a2cf1a283"),
        onpress: () => {
            const submenu = new MenuClass(LangString("admin.681c8801c1847090155219a23a2928cc"));
            submenu.onclose = () => {
                devData();
            }

            CAMERA_WAYPOINTS.map(item => {
                submenu.newItem({
                    name: `${item.id}`,
                    onpress: () => {
                        submenu.close();
                        drawCameraConf(item);
                    }
                })
            })

            submenu.open();
        }
    })
    m.newItem({
        name: LangString("admin.5a118c3732322b9f9e739f0b59988ba7"),
        desc: "",
        onpress: () => {
            const rot = CamerasManager.gameplayCam.getRot(2)
            DialogInput(LangString("admin.b343a6572e53613597539fa0afdff457"), LangString("admin.9c0127328449a242b7d7dd3d758aa5c5", rot.x, rot.y, rot.z));
        }
    })
    m.newItem({
        name: LangString("admin.68e0af8450d4e6a979dba07c8c33b1e0"),
        desc: LangString("admin.74599c39d88bac1ef3b6941b9ca03422"),
        onpress: () => {
            DialogInput(LangString("admin.7b1cf3c20a9358db01d8763b7e526d39"), mp.game.invoke("0x0A6DB4965674D243", player.handle));
        }
    })
    m.newItem({
        name: LangString("admin.35d8eedebdae006337f798f2d5d48614"),
        desc: LangString("admin.4604b7a119fe784b0de83c0b842e0b79"),
        onpress: () => {
            let search: string;
            const ops = () => {
                const submenu = new MenuClass(LangString("admin.320f98acf9f68088a47a12b2d8426946"));
                submenu.onclose = () => {
                    devData();
                }
                submenu.newItem({
                    name: LangString("admin.8f3aa5a173fa26ebf99ebf171a5592d5"),
                    more: `${search}`,
                    onpress: () => {
                        DialogInput(LangString("admin.99d0549ae5d80e7da7f71ff3a6b4e122"), `${search}`, 5, "text").then(res => {
                            if (res === null) return ops();
                            search = res;
                            ops();
                        })
                    }
                })
                vehicleSpawnPoints.filter(q => !search || search.includes(q.id.toString())).map(q => {
                    submenu.newItem({
                        name: `${q.id}`,
                        desc: LangString("admin.b0c437c4c7b42894e288be7269684db7"),
                        onpress: () => {
                            user.teleport(q.x, q.y, q.z);
                        }
                    })
                })
    
                submenu.open();
            }
            ops();
        }
    })

    m.open();
}

const generateInventoryAttach = () => {
    selectItem().then(async item_id => {
        if(!item_id) return devData();
        const cfg = inventoryShared.get(item_id);
        if (!cfg) return devData();
        const m = new MenuClass(LangString("admin.1661ba9d6c3b0cb2723eafba7a947108"), LangString("admin.db01324ac48001c8bea833085fa29789"));
        m.exitProtect = true;


        const weaponCfg = inventoryShared.getWeaponConfigByItemId(cfg.item_id)
        const weaponHash = weaponCfg && weaponCfg.ammo_max ? weaponCfg.hash : null;
        const model = weaponHash ? mp.game.joaat(weaponHash) : mp.game.joaat(cfg.prop)

        if(weaponHash){
            let c = 0;
            mp.game.weapon.requestWeaponAsset(model, 31, 0);
            while (!mp.game.weapon.hasWeaponAssetLoaded(model) && c < 200) await system.sleep(100), c++;
        } else {
            if(!mp.game.streaming.hasModelLoaded(model)){
                let c = 0;
                mp.game.streaming.requestModel(model)
                while(!mp.game.streaming.hasModelLoaded(model) && c < 200) await system.sleep(10), c++;
            }
        }

        let objectH = !weaponHash ? mp.game.object.createObject(model, player.position.x, player.position.y, player.position.z - 10, true, true, true) : mp.game.weapon.createWeaponObject(model, 120, player.position.x, player.position.y, player.position.z + 3, true, 0, 0);

        let object = mp.objects.newWeak(objectH);

        let c = 0;
        let [x, y, z, rx, ry, rz] = cfg.propAttachParam || [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
        while (c < 100 && !object.handle) await system.sleep(10), c++;
        
        m.exitProtect = true;
        m.onclose = () => { 
            devData() 
        }
        let boneId = 18905
        const attach = () => {
            object.attachTo(player.handle, player.getBoneIndex(boneId), x, y, z, rx, ry, rz, false, false, false, false, 2, true);
        }
        attach();
        let variants: number[] = []
        let variantsStr: string[] = [];
        for(let s = -2; s <= 2; s+=0.005){
            variants.push(s);
            variantsStr.push(s.toFixed(3));
        }
        let variantsR: number[] = []
        let variantsRStr: string[] = [];
        for(let s = 0; s <= 360; s++){
            variantsR.push(s);
            variantsRStr.push(s.toFixed(0));
        }
        m.newItem({
            name: LangString("admin.15846b057e35659621853c0c1dd31801"),
            type: "list",
            list: ATTACH_BONES_LIST.map(q => `${q[0]} | ${q[1]}`),
            listSelected: ATTACH_BONES_LIST.findIndex(q => q[1] === boneId),
            onchange: (val) => {
                boneId = ATTACH_BONES_LIST[val][1]
                attach();
            }
        })
        m.newItem({
            name: "X",
            type: "list",
            list: variantsStr,
            listSelected: variants.findIndex(q => q >= x),
            onchange: (val) => {
                let p = variants[val];
                x = p;
                attach();
            }
        })
        m.newItem({
            name: "Y",
            type: "list",
            list: variantsStr,
            listSelected: variants.findIndex(q => q >= y),
            onchange: (val) => {
                let p = variants[val];
                y = p;
                attach();
            }
        })
        m.newItem({
            name: "Z",
            type: "list",
            list: variantsStr,
            listSelected: variants.findIndex(q => q >= z),
            onchange: (val) => {
                let p = variants[val];
                z = p;
                attach();
            }
        })
        m.newItem({
            name: LangString("admin.addd685fbaea0955f068871b0ad69251"),
            type: "list",
            list: variantsRStr,
            listSelected: variantsR.findIndex(q => q >= rx),
            onchange: (val) => {
                let p = variantsR[val];
                rx = p;
                attach();
            }
        })
        m.newItem({
            name: LangString("admin.51660e36305fa854c059360910488e52"),
            type: "list",
            list: variantsRStr,
            listSelected: variantsR.findIndex(q => q >= ry),
            onchange: (val) => {
                let p = variantsR[val];
                ry = p;
                attach();
            }
        })
        m.newItem({
            name: LangString("admin.c0d0b4b22f4a22d0c869f4fccb4d1b16"),
            type: "list",
            list: variantsRStr,
            listSelected: variantsR.findIndex(q => q >= rz),
            onchange: (val) => {
                let p = variantsR[val];
                rz = p;
                attach();
            }
        })
        m.newItem({
            name: LangString("admin.0a9b517ba6d1acdce6bc5d10f0631a87"),
            onpress: () => {
                DialogInput(LangString("admin.67152eaa1fcec5be72e154f221ad82c3"), LangString("admin.765f3db06d9caf6d155a28fbc6b3b7da", boneId, x.toFixed(3), y.toFixed(3), z.toFixed(3), rx.toFixed(0), ry.toFixed(0), rz.toFixed(0)))
            }
        })
        m.open();
        let int = setInterval(() => {
            if(!currentMenu || currentMenu.id !== m.id){
                object.destroy();
                clearInterval(int)
            }
        }, 1000)
    })
}

const generateScenarioConfig = (scenario?:string, name: string = "") => {
    const m = new MenuClass(LangString("admin.e3f0b0a023cd19e3e390fcd6c10b65a4"), LangString("admin.029c5d428e57e8ca7d694f89be555f1d"));
    m.exitProtect = true;
    m.onclose = () => { devData() }
    m.newItem({
        name: LangString("admin.f97c9ac3793cb8bd32b3c8985532dfe3"),
        onpress: () => {
            user.stopAnim();
        }
    })
    m.newItem({
        name: LangString("admin.9a16ed68e842c2ce55f6212d2b0a3ae6"),
        onpress: () => {
            if (!scenario) return user.notify(LangString("admin.a77ea5c3b4200a6b8c31a06e6282e6b4"), "error")
            user.playScenario(scenario)
        }
    })
    // m.newItem({
    //     name: "~g~Сохранить конфиг",
    //     onpress: () => {
    //         if(!dict) return user.notify("Укажите каталог анимации", "error")
    //         if (!anim) return user.notify("Укажите название анимации", "error")
    //         if (!name) return user.notify("Укажите название для конфига", "error")
    //         DialogInput("Параметры", `"${name}": [${upper}, [["${dict}", "${anim}", 1]], ${looping}]`).then(() => {
    //             generateAnimConfig(dict, anim, upper, looping, name)
    //         })
    //     }
    // })
    m.newItem({
        name: LangString("admin.6e3a0e3c5b9496e55a61f00d800a6461"),
        more: scenario || LangString("admin.ece96ab1ca4574b38fd75f9036ffb4c6"),
        onpress: () => {
            DialogInput(LangString("admin.8d86860184579a2d2ebbb00c4451a439"), scenario, 120).then(val => {
                if (val) scenario = val
                generateScenarioConfig(scenario, name)
            })
        }
    })
    // m.newItem({
    //     name: "Название для конфига",
    //     more: name || "~r~Не указано",
    //     onpress: () => {
    //         DialogInput("Укажите название сценария", name).then(val => {
    //             if (val) name = val
    //             generateScenarioConfig(scenario, name)
    //         })
    //     }
    // })

    m.open();
}

const generateAnimConfig = (dict?:string, anim?:string, upper = false, looping = false, name: string = "") => {
    const m = new MenuClass(LangString("admin.5f6205042ff441f5cf7fcc7f02803887"), LangString("admin.b634d05546fb53e9b31ff2988897abe2"));
    m.onclose = () => { devData() }
    m.exitProtect = true;
    m.newItem({
        name: LangString("admin.57f85c62d72752736c5cf49eadbe31d7"),
        onpress: () => {
            user.stopAnim();
        }
    })
    m.newItem({
        name: LangString("admin.f3789be1282747eb0bc7e8edc30864a7"),
        onpress: () => {
            if(!dict) return user.notify(LangString("admin.23a64af20ccbef0f4639ff0b99deb755"), "error")
            if (!anim) return user.notify(LangString("admin.2281ff88e46b53366cf7acde72a2227f"), "error")
            user.playAnim([[dict, anim]], upper, looping);
        }
    })
    // m.newItem({
    //     name: "~g~Сохранить конфиг",
    //     onpress: () => {
    //         if(!dict) return user.notify("Укажите каталог анимации", "error")
    //         if (!anim) return user.notify("Укажите название анимации", "error")
    //         if (!name) return user.notify("Укажите название для конфига", "error")
    //         DialogInput("Параметры", `"${name}": [${upper}, [["${dict}", "${anim}", 1]], ${looping}]`).then(() => {
    //             generateAnimConfig(dict, anim, upper, looping, name)
    //         })
    //     }
    // })
    m.newItem({
        name: LangString("admin.906e7a567580e5e73cc01a6f2d95d062"),
        more: dict || LangString("admin.64914c58ac68ff68fff5e2257e6ac5c0"),
        onpress: () => {
            DialogInput(LangString("admin.875de5b4ea9e6504dd7ede956fb055e7"), dict, 120).then(val => {
                if(val) dict = val
                generateAnimConfig(dict, anim, upper, looping, name)
            })
        }
    })
    m.newItem({
        name: LangString("admin.c9cdd660ac8d9fcd130ca0f719859052"),
        more: anim || LangString("admin.63a28da551fc83e94fd7b1b90f82cb97"),
        onpress: () => {
            DialogInput(LangString("admin.acee4d5ffa66d8c868872f4c1c59ae64"), anim, 120).then(val => {
                if (val) anim = val
                generateAnimConfig(dict, anim, upper, looping, name)
            })
        }
    })
    // m.newItem({
    //     name: "Название для конфига",
    //     more: name || "~r~Не указано",
    //     onpress: () => {
    //         DialogInput("Укажите название анимации", name).then(val => {
    //             if (val) name = val
    //             generateAnimConfig(dict, anim, upper, looping, name)
    //         })
    //     }
    // })
    m.newItem({
        name: LangString("admin.05b297d5fb2aef9b03f9234d247cfed0"),
        type: "list",
        list: [LangString("admin.7d945cba4929d78b42265076c069f170"), LangString("admin.852c446cec180bcc47a0a9fb587aebea")],
        listSelected: upper ? 1 : 0,
        onchange: (val) => {
            upper = val ? true : false
        }
    })
    m.newItem({
        name: LangString("admin.576091ff579f083cdf75f21e805a5cbb"),
        type: "list",
        listSelected: looping ? 1 : 0,
        list: [LangString("admin.60ea0569eb6d6055b53808adfad7dcd7"), LangString("admin.8cd34304c9eff092d127787d26858959")],
        onchange: (val) => {
            looping = val ? true : false
        }
    })

    m.open();
}

const generatePlayerInVehicleConfig = (cfg?: { offset: { x: number, y: number, z: number }, rot: { x: number, y: number, z: number }, place: { x: number, y: number, z: number }}) => {
    cfg = {
        offset: {x: 0, y: 0, z: 0},
        rot: {x: 0, y: 0, z: 0},
        place: {x: 0, y: 0, z: 0},
    }
    let veh: VehicleMp;
    mp.vehicles.forEachInStreamRange(vehicle => {
        if (veh && system.distanceToPos(player.position, veh.position) < system.distanceToPos(player.position, vehicle.position)) return;
        if (system.distanceToPos(player.position, vehicle.position) > 5) return;
        veh = vehicle;
    })
    if(!veh) return user.notify(LangString("admin.72005cb36f761e2d776ff4ea2d522d18"), "error")
    const handle = veh.handle;
    if (!handle) return devData();
    if (veh.getBoneIndexByName("boot") == -1) return user.notify(LangString("admin.dbeb5a6e6c17c992daf60a007fb235ed"), "error");
    if (veh.getBoneIndexByName("engine") == -1) return user.notify(LangString("admin.08e533fb7160cc4b128d24606749af51"), "error");
    const m = new MenuClass(LangString("admin.9d9771c8ff3f60b513726bdb1ddb87d8"), LangString("admin.3ae5b9f93b687ed052c27c1359959963"));
    m.exitProtect = true;
    m.onclose = () => {
        user.stopAnim();
        player.resetAlpha();
        player.detach(false, false)
        devData();
    }
    const fix = () => {
        if(!mp.vehicles.exists(veh)) return;
        user.playAnim([["amb@world_human_bum_slumped@male@laying_on_right_side@idle_a", "idle_a"]], false, true);
        player.attachTo(handle, veh.getBoneIndexByName("engine"), cfg.offset.x, cfg.offset.y, cfg.offset.z, cfg.rot.x, cfg.rot.y, cfg.rot.z, true, true, false, true, 1, true)
        const pos = veh.getOffsetFromGivenWorldCoords(cfg.place.x, cfg.place.y, cfg.place.z)
    }

    fix();

    m.onclose = () => { devData() }
    m.newItem({
        name: LangString("admin.eed798bb1a4bb4211145cbb7b6606756"),
        onpress: () => {
            if (veh.getDoorAngleRatio(5) === 0){
                veh.setDoorOpen(5, false, true)
            } else {
                veh.setDoorShut(5, false)
            }
        }
    })
    m.newItem({
        name: LangString("admin.9d51e42cc0691c14f9d83bfc480e4428"),
        more: veh.getVariable("modelname")
    })
    let coords: string[] =[]
    let coordsN: number[] =[]
    for (let id = -5; id <= 5; id += 0.02) coords.push(`${id.toFixed(2)}`), coordsN.push(id)
    let rots: string[] =[]
    let rotsN: number[] =[]
    for (let id = -360; id <= 360; id += 1) rots.push(`${id.toFixed(0)}`), rotsN.push(id)
    m.newItem({
        name: LangString("admin.0e5b1cf7452f34f6105d989f548e628f"),
        type: "list",
        list: coords,
        listSelected: Math.floor(coords.length / 2),
        onchange: (val) => {
            cfg.offset.x = coordsN[val];
            fix();
        }
    })
    m.newItem({
        name: LangString("admin.29fd0f98f08fc8523029a1b8d06b9525"),
        type: "list",
        list: coords,
        listSelected: Math.floor(coords.length / 2),
        onchange: (val) => {
            cfg.offset.y = coordsN[val];
            fix();
        }
    })
    m.newItem({
        name: LangString("admin.8892e8204ec6775961b78d75e8b8bedf"),
        type: "list",
        list: coords,
        listSelected: Math.floor(coords.length / 2),
        onchange: (val) => {
            cfg.offset.z = coordsN[val];
            fix();
        }
    })
    m.newItem({
        name: LangString("admin.541929dd5c5794da1efd9730fa4796ec"),
        type: "list",
        list: rots,
        listSelected: Math.floor(rots.length / 2),
        onchange: (val) => {
            cfg.rot.x = rotsN[val];
            fix();
        }
    })
    m.newItem({
        name: LangString("admin.df40a821cd734ff08d3f594c5856c100"),
        type: "list",
        list: rots,
        listSelected: Math.floor(rots.length / 2),
        onchange: (val) => {
            cfg.rot.y = rotsN[val];
            fix();
        }
    })
    m.newItem({
        name: LangString("admin.e49b93877b1fd5d2eb814780c4e753e7"),
        type: "list",
        list: rots,
        listSelected: Math.floor(rots.length / 2),
        onchange: (val) => {
            cfg.rot.z = rotsN[val];
            fix();
        }
    })
    m.newItem({
        name: LangString("admin.77df4435fe899fa807229f53c5251da5"),
        desc: LangString("admin.8d4d387ec398774ba2a6d58265ef2139"),
        type: "list",
        list: coords,
        listSelected: Math.floor(coords.length / 2),
        onchange: (val) => {
            cfg.place.x = coordsN[val];
            fix();
        }
    })
    m.newItem({
        name: LangString("admin.9e1be04a81d0e474d37efe227716b73c"),
        desc: LangString("admin.73c7786577c78b4d47493c7ae35be202"),
        type: "list",
        list: coords,
        listSelected: Math.floor(coords.length / 2),
        onchange: (val) => {
            cfg.place.y = coordsN[val];
            fix();
        }
    })
    m.newItem({
        name: LangString("admin.bbcc9513b3f24c3a9302d4084abff7ea"),
        desc: LangString("admin.c496dd294f5baaf07455699e194d93c8"),
        type: "list",
        list: coords,
        listSelected: Math.floor(coords.length / 2),
        onchange: (val) => {
            cfg.place.z = coordsN[val];
            fix();
        }
    })
    m.newItem({
        name: LangString("admin.a35361957b8a7fb64fd1602066975744"),
        onpress: () => {
            DialogInput("Hier sind die Parameter", `x: ${cfg.offset.x.toFixed(2)}, y: ${cfg.offset.y.toFixed(2)}, z: ${cfg.offset.z.toFixed(2)}, model: ${veh.getVariable("modelname")}, rot_x: ${cfg.rot.x.toFixed(2)}, rot_y: ${cfg.rot.y.toFixed(2)}, rot_z: ${cfg.rot.z.toFixed(2)}, place_x: ${cfg.place.x.toFixed(2)}, place_y: ${cfg.place.y.toFixed(2)}, place_z: ${cfg.place.z.toFixed(2)}`)
        }
    })
    m.open();
    
}

const generateChairConfig = (handle?:number, cfg?:{heading: number, offset: {x: number, y: number, z: number}, needTp: number}) => {
    cfg = {
        heading: 180,
        offset: {x: 0, y: 0, z: 0},
        needTp: 0,
    }
    let dict = "";
    let anim = "";
    DialogInput(LangString("admin.be24da9fccd827a13db4184837bb9b95"), handle, 40, "int").then(handle => {
        if (!handle) return devData();
        const m = new MenuClass(LangString("admin.f2350ffc227d4d207d1a406d2973d1da"), LangString("admin.864345d40963419f115f98e3321af547"));
        m.onclose = () => {
            user.stopAnim();
            devData();
        }
        m.exitProtect = true;
        const heading = mp.game.invokeVector3("0xE83D4F9BA2A38914", handle)
        const pos = mp.game.invokeVector3("0x3FEF770D40960D5A", handle, true)
        const model = mp.game.invoke("0x9F47B058362C84B5", handle)

        const fix = () => {
            let posres = mp.game.object.getObjectOffsetFromCoords(pos.x, pos.y, pos.z, heading.x, cfg.offset.x, cfg.offset.y, cfg.offset.z);
            if(dict && anim){
                player.setCoordsNoOffset(posres.x, posres.y, posres.z, true, true, true);
                player.setHeading(heading.x + cfg.heading);
                user.playAnim([[dict, anim]], false, true);
            } else {
                user.playScenario("PROP_HUMAN_SEAT_CHAIR_MP_PLAYER", posres.x, posres.y, posres.z, heading.x + cfg.heading, true)
            }
        }

        fix();

        m.onclose = () => { devData() }
        m.newItem({
            name: LangString("admin.534feb4bdccc9d0770067c40057c26a6"),
            more: handle
        })
        m.newItem({
            name: LangString("admin.5b1a56000de360d9ecdb0808345658c1"),
            more: model
        })
        m.newItem({
            name: LangString("admin.b7dc01fe072e704453e6c58fbb0883e1"),
            type: "range",
            rangeselect: [0, 359],
            listSelected: 180,
            onchange: (val) => {
                cfg.heading = val;
                fix();
            }
        })
        let coords: string[] =[]
        let coordsN: number[] =[]
        for (let id = -5; id <= 5; id += 0.02) coords.push(`${id}`), coordsN.push(id)
        m.newItem({
            name: LangString("admin.87aedbca9b68ddacd71799399a2c9b7e"),
            type: "list",
            list: coords,
            listSelected: Math.floor(coords.length / 2),
            onchange: (val) => {
                cfg.offset.x = coordsN[val];
                fix();
            }
        })
        m.newItem({
            name: LangString("admin.27f199497811e8fa593eb38931976628"),
            type: "list",
            list: coords,
            listSelected: Math.floor(coords.length / 2),
            onchange: (val) => {
                cfg.offset.y = coordsN[val];
                fix();
            }
        })
        m.newItem({
            name: LangString("admin.14d481942ecfd8473565ef79c9c0c41c"),
            type: "list",
            list: coords,
            listSelected: Math.floor(coords.length / 2),
            onchange: (val) => {
                cfg.offset.z = coordsN[val];
                fix();
            }
        })
        m.newItem({
            name: LangString("admin.3b12408f0921fc2a0d9934f6f2c82759"),
            type: "list",
            list: [LangString("admin.8e7fa0ccde39b5075b95cbb3629d200c"), LangString("admin.60b56265b5169fab1ee09471b70dca5e")],
            desc: LangString("admin.b6eaf89d9b4e192aa1beebc156486270"),
            onchange: (val) => {
                cfg.needTp = val
                fix();
            }
        })
        m.newItem({
            name: LangString("admin.5a1bffe18c6e4e8ef40d142cb17c7e5f"),
            desc: LangString("admin.b6e19fe08da235df3ded69f20f8198f0"),
            onpress: (val) => {
                DialogInput(LangString("admin.f090f0dfcc95f71a43e822fcb4372e37"), dict, 240, "textarea").then(val => {
                    if(typeof val !== "string") return;
                    dict = val;
                })
            }
        })
        m.newItem({
            name: LangString("admin.5c783e335bd68bea09cca8a5b8e0f515"),
            desc: LangString("admin.0925cfbf7b6c1d7bcb476b358d47ef26"),
            onpress: (val) => {
                DialogInput(LangString("admin.2dc9dce018f6249b6a6ef78fd24b8820"), anim, 240, "textarea").then(val => {
                    if(typeof val !== "string") return;
                    anim = val;
                })
            }
        })
        m.newItem({
            name: LangString("admin.21563e26861f0b4bc303d7339a2ea125"),
            onpress: () => {
                DialogInput(LangString("admin.edfb6259732502e2afdcb70b1c32d1b6"), LangString("admin.54293d11d62bb9e69141ca1d6ab00248", cfg.offset.x.toFixed(2), cfg.offset.y.toFixed(2), cfg.offset.z.toFixed(2), cfg.heading, model, cfg.needTp ? "true" : "false"))
            }
        })
        m.open();
    })
}


const gameMenu = () => {
    if (!user.hasPermission("admin:gamedata:menu")) return user.notify(LangString("admin.95e2db2e9ebd5d27aedc5f24c05d4e22"), "error");
    let m = new MenuClass(LangString("admin.db07e6f7c67baa2b32f28dd06bf2158e"))
    m.onclose = () => { adminMenu(); }
    m.exitProtect = true;
    if (user.hasPermission("admin:weather:set")) m.newItem({ name: LangString("admin.8109926681124e169313f773e776bcf4"), onpress: () => { m.close(); CustomEvent.triggerServer("admin:weather:control") } })
    if (user.hasPermission("admin:gamedata:createbiz")) m.newItem({ name: LangString("admin.5b32b8f365020b6c617688fe4814fe90"), onpress: () => { m.close(); CustomEvent.triggerServer("admin:gamedata:createbiz") } })
    if (user.hasPermission("admin:gamedata:newhouse")) m.newItem({ name: LangString("admin.5984595ea87f52d3ca8f76da493882b7"), onpress: () => { m.close(); CustomEvent.triggerServer("admin:gamedata:newhouse") } })
    if (user.hasPermission("admin:gamedata:newwarehouse")) m.newItem({ name: LangString("admin.a3026ab0c6aa8cc8d5f2017d2d71d66f"), onpress: () => { m.close(); CustomEvent.triggerServer("admin:gamedata:newwarehouse") } })
    if (user.hasPermission("admin:gamedata:dress")) m.newItem({ name: LangString("admin.42dc5449d4f126869c00e6d18f348326"), onpress: () => { m.close(); CustomEvent.triggerServer("admin:gamedata:dress") } })
    if (user.hasPermission("admin:gamedata:lsc")) m.newItem({ name: LangString("admin.2c23ca0d30920dfc555028d91a493dc5"), onpress: () => { m.close(); CustomEvent.triggerServer("admin:gamedata:lsc") } })
    if (user.hasPermission("admin:chest:accessRemote")) m.newItem({ name: LangString("admin.dfc16d9e510a4b9556600e7e3f3383cc"), onpress: () => { m.close(); CustomEvent.triggerServer("admin:chest:accessRemote") } })
    if (user.hasPermission("admin:garage:accessRemote")) m.newItem({ name: LangString("admin.b4a50bb6bca16f1f76788fad74a4c853"), onpress: () => { m.close(); CustomEvent.triggerServer("admin:fraction:garage") } })
    // if (user.hasPermission("admin:chestorder:access")) m.newItem({ name: LangString("admin.d15b920445ae3992f8f6483de59ff618"), desc: LangString("admin.27a5e1d4e74ff35c8d6f40b5a314713c"), onpress: () => { m.close(); CustomEvent.triggerServer("admin:chestorder:access") } })
    if (user.hasPermission("admin:moneychest:access")) m.newItem({ name: LangString("admin.973592cd799bb28a8e8d9c2798464b11"), onpress: () => { m.close(); CustomEvent.triggerServer("admin:moneychest:access") } })
    if (user.hasPermission("admin:safezones")) m.newItem({ name: LangString("admin.7ff47acd5a6b3351a48f59754ffbac38"), onpress: () => { m.close(); CustomEvent.triggerServer("admin:safezone") } })
    if (user.hasPermission("admin:gamedata:restoregrab")) m.newItem({ name: LangString("admin.c1744d535538a842f1c9d00a06c7f396"), onpress: () => { m.close(); CustomEvent.triggerServer("admin:gamedata:restoregrab") } })
    if (user.hasPermission("admin:gamedata:textworld")) m.newItem({ name: LangString("admin.c8b10bf7f1b903e35369f4037a5d5281"), onpress: () => { m.close(); CustomEvent.triggerServer("admin:gamedata:textworld") } })
    if (user.hasPermission("admin:jobdress")) m.newItem({ name: LangString("admin.b3ad60097f3238be208dc7e1975cad20"), onpress: () => { m.close(); CustomEvent.triggerServer("garderob:new") } })
    if (user.hasPermission("admin:boomboxblock")) m.newItem({ name: LangString("admin.f6a8d3465d55bd6b6769f854ac4aa10d"), desc:LangString("admin.2a267832e6b585c0bdecaebccb831d6b"), onpress: () => {
            DialogInput(LangString("admin.ee9c6b74f9be55cd680d85f36845b4a1"), "", 10).then(val => {
                if(!val) return;
                CustomEvent.triggerServer("boombox:removeIgnore", val)
            })
        }})
    //     // ✅ Nou: Meniu pentru genți disponibile
    // if (user.hasPermission("admin:gamedata:dress"))
    // m.newItem({ name: "🧳 Testează Genți Vizual", onpress: () => { m.close(); CustomEvent.triggerServer("admin:testBags") } });
 
    if(user.isAdminNow(6)){
        m.newItem({ name: LangString("admin.3e6cd344da7ebe2ce8b80764a5a61827"), desc:"", onpress: () => {
                DialogAccept(LangString("admin.2254a32541d6bd4539ac6593cd9ef05c"), "big").then(val => {
                    if(!val) return;
                    CustomEvent.triggerServer("tax:admin")
                })
            }})
    }
    m.open();
}


const controlsIds = {
    F5: 74,
    W: 32,
    S: 33,
    A: 34,
    D: 35,
    Space: 321,
    Shift: 21,
    LCtrl: 326,
    SpeedUP: 38,
    SpeedDOWN: 44,
};

mp.events.addDataHandler("alpha", (entity: PlayerMp, value: number, oldValue) => {
    if (entity.type != "player") return;
    entity.setAlpha(value)
});
mp.events.add("entityStreamIn", (entity: PlayerMp) => {
    if (entity.type != "player") return;
    if (entity.getVariable("alpha")) entity.setAlpha(entity.getVariable("alpha"));
});

const fly = {
    flying: false,
    lockZ: false,
    f: 2.0,
    w: 2.0,
    h: 2.0,
};
const gameplayCam = mp.cameras.new("gameplay");

function switchFly(status: boolean) {
    if (status && mp.players.local.vehicle) return;
    fly.flying = !fly.flying;

    const player = mp.players.local;

    player.freezePosition(fly.flying);
    mp.players.local.setMaxSpeed(fly.flying ? 0 : 99999);
    if (!fly.flying && !mp.game.controls.isControlPressed(0, controlsIds.Space)) {
        let position = mp.players.local.position;
        position.z = mp.game.gameplay.getGroundZFor3dCoord(
            position.x,
            position.y,
            position.z,
            0.0,
            false
        );
        mp.players.local.setCoordsNoOffset(
            position.x,
            position.y,
            position.z,
            false,
            false,
            false
        );
        mp.game.streaming.requestCollisionAtCoord(position.x, position.y, position.z);
    }

    if (fly.flying) {
        user.notify(LangString("admin.9722393eb8d1455b2e9a5d14fceda10d"), "success", null, 2000, "FLY Mode");
    }
    CustomEvent.triggerServer("flyMode", fly.flying);
}

setInterval(() => {
    if (fly.flying && !user.enabledAdmin) switchFly(false);
}, 1000)


//X
mp.keys.bind(0x58, true, function () {
    if (!user.login) return;
    if (!fly.flying) return;
    if (!user.enabledAdmin) return;
    fly.lockZ = !fly.lockZ
    user.notify(LangString("admin.0a9f69f88507976a3c67a178276a4300", fly.lockZ ? LangString("admin.b586230926feb341a18219f535d52e11") : LangString("admin.929c28118b66c9a1ae44adec56ee1f47")), fly.lockZ ? "success" : "error", null, 1000, "FLY Mode");
});

mp.events.add("render", () => {
    if (!user.login) return;
    if (user.enabledAdmin) {
        if (mp.game.controls.isControlJustPressed(0, controlsIds.F5)) switchFly(!fly.flying);
    }
    if (user.login && fly.flying) {
        let controls = mp.game.controls;
        const direction = gameplayCam.getDirection();

        let updated = false;
        let position = mp.players.local.position;
        if (controls.isControlPressed(0, controlsIds.SpeedUP)) fly.f += 0.01;
        if (controls.isDisabledControlPressed(0, controlsIds.SpeedDOWN)) fly.f -= 0.01;

        if (fly.f < 0.1) fly.f = 0.1;
        if (fly.f > 20.0) fly.f = 20.0;

        const speed = controls.isControlPressed(0, controlsIds.Shift) ? fly.f * 3 : fly.f;

        if (controls.isControlPressed(0, controlsIds.W)) {
            position.x += direction.x * speed;
            position.y += direction.y * speed;
            if (!fly.lockZ) position.z += direction.z * speed;
            updated = true;
        } else if (controls.isControlPressed(0, controlsIds.S)) {
            position.x -= direction.x * speed;
            position.y -= direction.y * speed;
            if (!fly.lockZ) position.z -= direction.z * speed;
            updated = true;
        }

        if (controls.isControlPressed(0, controlsIds.A)) {
            position.x += -direction.y * speed;
            position.y += direction.x * speed;
            updated = true;
        } else if (controls.isControlPressed(0, controlsIds.D)) {
            position.x -= -direction.y * speed;
            position.y -= direction.x * speed;
            updated = true;
        }

        if (controls.isControlPressed(0, controlsIds.Space)) {
            position.z += speed;
            updated = true;
        } else if (controls.isControlPressed(0, controlsIds.LCtrl)) {
            position.z -= speed;
            updated = true;
        }

        if (updated) {
            mp.players.local.setMaxSpeed(99999999);
            mp.players.local.setCoordsNoOffset(
                position.x,
                position.y,
                position.z,
                false,
                false,
                false
            );
        } else {
            mp.players.local.setMaxSpeed(0);
        }
    }
});









let noClipEnabled = false;
let noClipSpeed = 1;
let noClipSpeedNames = [LangString("admin.7528c873771cb7373bafa882022e2c8c"), LangString("admin.e83c82b0e3390d6c384896821267bc2f"), LangString("admin.a807e18ae393759110c5285eb929fe5c"), LangString("admin.8a2f1b866fa1baaa071842c9c3b2b7de"), LangString("admin.416a5d841a0f5502d349e67248c41e23"), LangString("admin.c4123c49d64165e246b2040185fd3f13"), LangString("admin.4a86bb858d2dc73036c471d3c8b9b8df")];

export const noClipSwitch = function () {
    noClip(!noClipEnabled);
}

export const noClip = function (enable: boolean) {
    if(inSpectatorMode()) return;
    noClipEnabled = enable;
    if (noClipEnabled)
        user.notify("~b~Presse ~s~H~b~ zum Ausschalten No Clip");
};

export const isNoClipEnable = function () {
    return noClipEnabled;
};

export const getNoClipSpeedName = function () {
    return noClipSpeedNames[noClipSpeed];
};


registerHotkey(103, () => {
    if (!debug) return;
    if (!raycastTarget || !raycastTarget.entity) return user.notify(LangString("admin.881e513bba9f98020e951c166ac1701e"), "error");
    const entity = raycastTarget.entity
    const heading = mp.game.invokeVector3("0xE83D4F9BA2A38914", typeof entity === "number" ? entity : entity.handle)
    const pos = mp.game.invokeVector3("0x3FEF770D40960D5A", typeof entity === "number" ? entity : entity.handle, true)
    const model = typeof entity === "number" ? mp.game.invoke("0x9F47B058362C84B5", entity) : entity.model;

    const m = new MenuClass(LangString("admin.1d8a23da9c27cbefad478878d372a24a"), LangString("admin.beda76eaf0616616eb128497b72c2b1e"));
    m.exitProtect = true;
    m.newItem({
        name: LangString("admin.668218f7b5b2b87daa1388b1c20c8977"),
        more: typeof entity === "number" ? LangString("admin.3ea9b0860b9bca771e4b6df48d967275") : LangString("admin.bab2770a39c80f3df82adf427ed006a4", entity.type)
    })
    m.newItem({
        name: LangString("admin.eb15987f412675c7a88009a462bf5b6b"),
        desc: LangString("admin.f0dcd76040c5fc9c74160cdb5b328b17"),
        more: typeof entity === "number" ? entity : entity.handle,
        onpress: () => {
            DialogInput("", typeof entity === "number" ? entity : entity.handle)
        }
    })
    m.newItem({
        name: LangString("admin.a53e0491eb5969f0c76d4ccff3188846"),
        desc: LangString("admin.1f47432682936e0a459f95527d569289"),
        more: model,
        onpress: () => {
            DialogInput("", model)
        }
    })
    m.newItem({
        name: LangString("admin.d19e7d97d6802be050e523568e9443c8"),
        more: heading.x,
        onpress: () => {
            DialogInput("", heading.x)
        }
    })
    m.newItem({
        name: LangString("admin.aa300fc11a3e9560dfe650872d357be1"),
        more: LangString("admin.43ec5aa7e3abea7039e6b28f0d49e9d5", pos.x.toFixed(2), pos.y.toFixed(2), pos.z.toFixed(2))
    })
    m.newItem({
        name: LangString("admin.9fde4e95acecbb52457372bc8ba1802c"),
        type: "list",
        list: [LangString("admin.0ebeba1cb5f5b96606172c0e6c50ab19"), LangString("admin.da71003a8ef75ebe698dcfe19758f586"), LangString("admin.f6ef8c9dd70ee145953d681a2d25ddc6"), LangString("admin.a099c8c685dd3f3a1b223066a495fa89")],
        onpress: (itm) => {
            let text = "";
            if (itm.listSelected == 0) text = `${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}`
            if (itm.listSelected == 1) text = `x: ${pos.x.toFixed(2)}, y: ${pos.y.toFixed(2)}, z: ${pos.z.toFixed(2)}`
            if (itm.listSelected == 2) text = `${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)} ${heading.x.toFixed(0)}`
            if (itm.listSelected == 3) text = `x: ${pos.x.toFixed(2)}, y: ${pos.y.toFixed(2)}, z: ${pos.z.toFixed(2)}, h: ${heading.x.toFixed(0)}`
            DialogInput(LangString("admin.2449acb5d518e35e2b1ea364ddcecd1b"), text)
        }
    })
    m.newItem({
        name: LangString("admin.19ce6c93a8699ff64eb97ee2dc8ffff4"),
        desc: LangString("admin.46af9db4f3b45199eb68efe8782e8ce3"),
        onpress: () => {
            generateChairConfig(typeof entity === "number" ? entity : entity.handle)
        }
    })

    m.open();
})

mp.events.add("render", () => {
    if (debug) {
        let hitRaycast: number | ObjectMp;
        if (raycastTarget && raycastTarget.entity) {
            const entity = raycastTarget.entity;
            if (mp.gui.cursor.visible && !gui.currentGui) {
                gui.drawText3D(`${typeof entity === "number" ? entity : `${entity.type} ${entity.id}`} ${raycastTarget.position.x.toFixed(2)} ${raycastTarget.position.y.toFixed(2)} ${raycastTarget.position.z.toFixed(2)}`, raycastTarget.position.x, raycastTarget.position.y, raycastTarget.position.z);
                const dist = system.distanceToPos(mp.players.local.position, raycastTarget.position)
                if(dist < 10){
                    const heading = mp.game.invokeVector3("0xE83D4F9BA2A38914", typeof entity === "number" ? entity : entity.handle)
                    const pos = mp.game.invokeVector3("0x3FEF770D40960D5A", typeof entity === "number" ? entity : entity.handle, true)
                    const model = typeof entity === "number" ? mp.game.invoke("0x9F47B058362C84B5", entity) : entity.model
                    gui.drawText(`SELECTED OBJECT HANDLE ${typeof entity === "number" ? entity : entity.handle} \nPOS ${pos.x.toFixed(2)} ${pos.y.toFixed(2)} ${pos.z.toFixed(2)}\nH ${heading.x.toFixed(2)} ${heading.y.toFixed(2)} ${heading.z.toFixed(2)}\nM: ${model}\nNum 7 - Info`, 0.5, 0.02, 0.2)
                }
                if (dist > 2) {
                    const middle = system.middlePoint3d(mp.players.local.position, raycastTarget.position);
                    gui.drawText3D(`${dist.toFixed(1)}m`, middle.x, middle.y, middle.z);
                }
                mp.game.graphics.drawLine(player.position.x, player.position.y, player.position.z, raycastTarget.position.x, raycastTarget.position.y, raycastTarget.position.z, 255, 0, 0, 255);
            }
            hitRaycast = entity as any;
        }
        const zoneGang = GANGWAR_ZONES.find(q => system.distanceToPos(player.position, q) < GANGWAR_RADIUS)
        gui.drawText(`POS ${player.position.x.toFixed(1)} ${player.position.y.toFixed(1)} ${player.position.z.toFixed(1)}\nH: ${Math.floor(player.getHeading())} | D ${player.dimension} Int ${user.interrior} In ${user.inInterrior}\nC ${mp.gui.cursor.visible} X ${cursorX.toFixed(2)} Y ${cursorY.toFixed(2)} ${hitRaycast ? `H ${hitRaycast}` : ""}${zoneGang ? ` | CAPT ${zoneGang.id}` : ""}`, 0.07, 0.5, 0.2)
    }
    if (noClipEnabled) {
        if(!user.isAdminNow()) return noClipEnabled = false;
        let noClipEntity = mp.players.local.isSittingInAnyVehicle() ? mp.players.local.vehicle : mp.players.local;

        noClipEntity.freezePosition(true);

        mp.game.controls.disableControlAction(0, 31, true);
        mp.game.controls.disableControlAction(0, 32, true);
        mp.game.controls.disableControlAction(0, 33, true);
        mp.game.controls.disableControlAction(0, 34, true);
        mp.game.controls.disableControlAction(0, 35, true);
        mp.game.controls.disableControlAction(0, 36, true);
        mp.game.controls.disableControlAction(0, 266, true);
        mp.game.controls.disableControlAction(0, 267, true);
        mp.game.controls.disableControlAction(0, 268, true);
        mp.game.controls.disableControlAction(0, 269, true);
        mp.game.controls.disableControlAction(0, 44, true);
        mp.game.controls.disableControlAction(0, 20, true);
        mp.game.controls.disableControlAction(0, 47, true);

        let yoff = 0.0;
        let zoff = 0.0;

        if (mp.game.controls.isControlJustPressed(0, 22)) {
            noClipSpeed++;
            if (noClipSpeed >= noClipSpeedNames.length)
                noClipSpeed = 0;
        }

        if (mp.game.controls.isDisabledControlPressed(0, 32)) {
            yoff = 0.5;
        }

        if (mp.game.controls.isDisabledControlPressed(0, 33)) {
            yoff = -0.5;
        }

        if (mp.game.controls.isDisabledControlPressed(0, 34)) {
            noClipEntity.setRotation(0, 0, noClipEntity.getRotation(0).z + 3, 0, true);
        }

        if (mp.game.controls.isDisabledControlPressed(0, 35)) {
            noClipEntity.setRotation(0, 0, noClipEntity.getRotation(0).z - 3, 0, true);
        }

        if (mp.game.controls.isDisabledControlPressed(0, 44)) {
            zoff = 0.21;
        }

        if (mp.game.controls.isDisabledControlPressed(0, 20)) {
            zoff = -0.21;
        }

        if (mp.game.controls.isDisabledControlPressed(0, 74)) {
            if (!noClipEntity.getVariable("isTyping")) {
                noClipEnabled = false;
            }
        }

        let newPos = noClipEntity.getOffsetFromInWorldCoords(0, yoff * (noClipSpeed * 0.7), zoff * (noClipSpeed * 0.7));
        let heading = noClipEntity.getRotation(0).z;

        noClipEntity.setVelocity(0, 0, 0);
        noClipEntity.setRotation(0, 0, heading, 0, false);
        noClipEntity.setCollision(false, false);
        noClipEntity.setCoordsNoOffset(newPos.x, newPos.y, newPos.z, true, true, true);

        noClipEntity.freezePosition(false);
        noClipEntity.setInvincible(false);
        noClipEntity.setCollision(true, true);
    }
});
