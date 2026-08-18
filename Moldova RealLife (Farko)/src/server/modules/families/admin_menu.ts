import { langStringDefault } from "../../../shared/lang";
import {menu} from "../menu";
import {giveFamilyQuestCargo, registerFamilyCargoVehicle} from "./quests";
import {familyCreateGUI} from "./create";
import {CargoBattleFamilyQuest} from "./quests/cargobattle";
import {Family} from "./family";
import {Vehicle} from "../vehicles";
import {DONATE_MONEY_NAMES} from "../../../shared/economy";
import {system} from "../system";
import {parking} from "../businesses/parking";
import {CONTRACT_NUM_FOR_FAMILY, FamilyReputationType} from "../../../shared/family";
import {writeSpecialLog} from "../specialLogs";


export const showFamilyAdminMenu = (player:PlayerMp) => {
    const m = menu.new(player, player.user.LangString("admin_menu.5c67face151977f22be49bdbe4a3f3d8"));
    m.newItem(
        {
            name: langStringDefault("admin_menu.6640845a7ff43624ac8d6673b5cbacce"),
            onpress: () => registerFamilyCargoVehicle(player)
        },
        {
            name: langStringDefault("admin_menu.e696217530967e3fb91759e049e0af2e"),
            onpress: () => giveFamilyQuestCargo(player)
        },
        {
            name: langStringDefault("admin_menu.fd74f2b1d6ee284fe9b548f170342136"),
            onpress: () => familyCreateGUI(player)
        },
        {
            name: langStringDefault("admin_menu.667ac1c81d8dfd1328af320c8a6ae7f7"),
            onpress: () => new CargoBattleFamilyQuest().start()
        },
        {
            name: langStringDefault("admin_menu.0acbc077ab838c2b7339de60d667e051"),
            onpress: () => new CargoBattleFamilyQuest().startReady(true).then(res => {
                player.notify(player.user.LangString("admin_menu.304d2ebe582ca5f2b180492b2b50564c"))
            }).catch(error => {
                player.notify(player.user.LangString("admin_menu.043116668860f7c6463bc50ced71436b", error))
            })
        },
        {
            name: langStringDefault("admin_menu.e5f90ea3ad3a53c5f4f325d4adc183b3"),
            onpress: () => {
                CargoBattleFamilyQuest.stopAll()
                player.notify(player.user.LangString("admin_menu.c13dea4bba8c367b6f42cdbeaaf6aeec"))
            }
        },
        {
            name: langStringDefault("admin_menu.aebb98950c3befec8a0eed4db62c00f7"),
            onpress: () => {
                let list:string[] = [langStringDefault("admin_menu.3f59f57820b92dbbadf7ffa32673dca7")]
                Family.getAll().map(f => list.push(f.name))
                menu.selector(player, player.user.LangString("admin_menu.a65aebbe22dc2413b6f326c0336b2b64"), list, true).then(id => {
                    if(!id) {
                        if(player.user.family) {
                            player.user.family = null
                            player.notify(player.user.LangString("admin_menu.df4e67d3c1214dea8b618f05cc85f2ce"))
                        }
                        return;
                    }
                    if(!Family.getAll()[id-1]) return;
                    player.notify(player.user.LangString("admin_menu.a684c91253e0d7ccf4f142f939135c8c", Family.getAll()[id-1].name))
                    player.user.family = Family.getAll()[id-1]
                    player.user.familyRank = player.user.family.leaderRankID
                })
            }
        },
        {
            name: langStringDefault("admin_menu.ba9657bb2b467925c9820ea077bd9a53"),
            onpress: () => {
                if(!player.user || !player.user.family) return;
                menu.selector(player, player.user.LangString("admin_menu.d10efe8a65503beee8d43e48404e8875"), player.user.family.ranks.map(r => {
                    return r.name
                }), false).then(name => {
                    player.user.family.ranks.find(r => r.name == name)
                    player.user.familyRank = player.user.family.ranks.find(r => r.name == name).id || 1
                    player.notify(player.user.LangString("admin_menu.657d236e0717efb5307469b2697f54f4", player.user.family.getRank(player.user.familyRank).name))
                })
            }
        },
        {
            name: langStringDefault("admin_menu.9c36b4308ba4d6291afdd69bfbe16c9b"),
            onpress: () => {
                if(!player.user || !player.user.family) return;
                showFamilyEditAdminMenu(player, player.user.family)
            }
        }
    )
    m.open()
}


export const showFamilyEditAdminMenu = (player:PlayerMp, family:Family) => {
    return new Promise<void>(async () => {
        if(!family && !family.id) return;
        if(!player.user || !player.user.hasPermission("admin:familyControl")) return;

        const allMembers = await family.getAllMembers()
        const membersOnline = allMembers.filter(u => u.is_online)

        const m = menu.new(player, player.user.LangString("admin_menu.da2783b1f50f601823addf9fe9516241"));
        m.newItem(
            {
                name: langStringDefault("admin_menu.03be20efb161809e682bc321591f3c44"),
                more: family.id
            },
            {
                name: langStringDefault("admin_menu.21964bf41c6eca7414c691cb181df3da"),
                more: langStringDefault("admin_menu.6d1731c0d64d062571ac9a346621f5f6", allMembers.length),
                desc: langStringDefault("admin_menu.3388407b7937de509150931bafebfb5f", membersOnline.length)
            },
            {
                name: langStringDefault("admin_menu.eb828c9dd87b43d136547e95a2e3e27e"),
                more: family.name,
                onpress: () => menu.input(player, player.user.LangString("admin_menu.0174b37a9a462d15920e3eb2f82d8a87"), family.name, 24).then(newName => {
                    if(newName.length < 3) player.notify(player.user.LangString("admin_menu.c7306576cdfb9a634c1aac1056b237a9"))
                    if (!newName || ! /^[a-zA-Z_-]{0,15}$/i.test(newName)) {
                        player.notify(player.user.LangString("admin_menu.f2338f6dc91f5017e60890044ffa864b"), "error")
                    }
                    else if (Family.getAll().find(f => f.name == newName)) {
                        player.notify(player.user.LangString("admin_menu.59290e3046405ce8e8132e65d78f3ac3"), "error")
                        return false;
                    }
                    else family.name = newName
                    showFamilyEditAdminMenu(player, family)
                })
            },
            {
                name: langStringDefault("admin_menu.21592652a287167540b478d050176648"),
                more: family.points,
                onpress: () => menu.input(player, player.user.LangString("admin_menu.783a3992f90328ad23475f7320cc5f3b"), family.points, 20, "int").then(newVal => {
                    if(isNaN(newVal) || newVal < 0) player.notify(player.user.LangString("admin_menu.99a9b94d61dd1c5e8114a55833f30fc2"))
                    else family.points = newVal
                    player.user.log("AdminJob", langStringDefault("admin_menu.49f5eb9358816096a5b74e5d1ca42e55", family.seasonPoints, family.name), family.id)
                    showFamilyEditAdminMenu(player, family)
                })
            },
            {
                name: langStringDefault("admin_menu.900d9e70dea2ba9115ea6d1f16a2f890"),
                more: family.seasonPoints,
                onpress: () => menu.input(player, player.user.LangString("admin_menu.2e667f4285df7feacb20ec1395f6542d"), family.seasonPoints, 20, "int").then(newVal => {
                    if(isNaN(newVal) || newVal < 0) player.notify(player.user.LangString("admin_menu.d7e778fd387be8ab3cbb4d5345e7f130"))
                    else family.seasonPoints = newVal
                    player.user.log("AdminJob", langStringDefault("admin_menu.4d4cc5cd49a7976cdb687c605dbf0a34", family.seasonPoints, family.name), family.id)
                    showFamilyEditAdminMenu(player, family)
                })
            },
            {
                name: langStringDefault("admin_menu.15ca6b5c4be7ef534b8dac8774abe5e3"),
                more: family.cargo,
                onpress: () => menu.input(player, player.user.LangString("admin_menu.ca76a877c6746b3b192f3ef44c806b11"), family.cargo, 20, "int").then(newVal => {
                    const lastValue = family.cargo;
                    if(isNaN(newVal) || newVal < 0) player.notify(player.user.LangString("admin_menu.dae0fec99ecc5d2bc2fd325cc6b4825e"))
                    else family.cargo = newVal
                    writeSpecialLog(langStringDefault("admin_menu.c95f9808c401e43a2f20d3b87b764228", lastValue, newVal, family.name), player, 0);
                    showFamilyEditAdminMenu(player, family)
                })
            },
            {
                name: langStringDefault("admin_menu.d68adb9cce1a8d218175de88777cf7e0"),
                more: family.level,
                onpress: () => menu.input(player, player.user.LangString("admin_menu.47768fa3de5044c8f5e5bb19300e7e6a"), family.level, 20, "int").then(newVal => {
                    const lastValue = family.level;
                    if(isNaN(newVal) || newVal < 0) player.notify(player.user.LangString("admin_menu.312eaf85f2456806298977c9291c8ab2"))
                    else family.level = newVal
                    writeSpecialLog(langStringDefault("admin_menu.27c0dd09fd6e10729bdf268068d50133", lastValue, newVal, family.name), player, 0);
                    showFamilyEditAdminMenu(player, family)
                })
            },
            {
                name: langStringDefault("admin_menu.520299beb4426c4c63c3a9fba9d9ce1d"),
                more: family.wins,
                onpress: () => menu.input(player, player.user.LangString("admin_menu.70224eaf4eb11a1b1a1a91f621582814"), family.wins, 20, "int").then(newVal => {
                    if(isNaN(newVal) || newVal < 0) player.notify(player.user.LangString("admin_menu.f6bbeca9a48a93ae14d7b74c5f72ed82"))
                    else family.wins = newVal
                    showFamilyEditAdminMenu(player, family)
                })
            },
            // {
            //     name: '~r~Сброс сезонных очков',
            //     onpress: () => {
            //         menu.accept(player).then(status => {
            //             if(!status) return;
            //             family.clearSeasonPoints(true)
            //             player.notify('Готово', 'success');
            //         })
            //     }
            // }

            {
                name: langStringDefault("admin_menu.deb3a68419e2a1e4fd9f5f1756112819"),
                onpress: () => {
                    menu.accept(player).then(status => {
                        if(!status) return;
                        family.setRandomContracts(CONTRACT_NUM_FOR_FAMILY)
                        player.notify(player.user.LangString("admin_menu.d653eeeae7004660d21e226277506ec7"), "success");
                    })
                }
            }
        );
        if (player.user.hasPermission("admin:familyBank")) {
            m.newItem(
                {
                    name: langStringDefault("admin_menu.fce8b98359195583be8a6354e222b8c6"),
                    more: family.money,
                    onpress: () => menu.input(player, player.user.LangString("admin_menu.57ae2cbe204961790954a1e4fd9de7dd"), family.money, 20, "int").then(newVal => {
                        const lastValue = family.money;
                        if(isNaN(newVal) || newVal < 0) player.notify(player.user.LangString("admin_menu.4451c8b9858a03fd2816effe80da5791"))
                        else family.money = newVal
                        writeSpecialLog(langStringDefault("admin_menu.e929cc900e4dd26db63c7d166ff0f3a7", lastValue, newVal, family.name), player, 0);
                        showFamilyEditAdminMenu(player, family)
                    })
                },
                {
                    name: langStringDefault("admin_menu.82886dc8b2dff24c0f82db5b0876ef20"),
                    more: family.donate,
                    onpress: () => menu.input(player, player.user.LangString("admin_menu.5a1d516fe6b9123dd1304b84acc4a806"), family.donate, 20, "int").then(newVal => {
                        const lastValue = family.donate;
                        if(isNaN(newVal) || newVal < 0) player.notify(player.user.LangString("admin_menu.d33abdaf69e3463bcfb3137b9da0f0c6"))
                        else family.donate = newVal
                        writeSpecialLog(langStringDefault("admin_menu.2ca3f486e55e2124de27cffee90236b6", lastValue, newVal, family.name), player, 0);
                        showFamilyEditAdminMenu(player, family)
                    })
            })
        }
        
        m.newItem({
            name: langStringDefault("admin_menu.4014fffdab1ce2fed2ce0ce4b67b1dc0"),
            more: !!family.house?`${family.house.name} #${family.house.id}`:langStringDefault("admin_menu.ba7228ceb5f441dc24f214a806b8ca80"),
            onpress: () => {
                if(!!family.house) player.user.teleport(family.house.x, family.house.y, family.house.z, family.house.h, family.house.d)
            }
        })

        const targetVehs = Vehicle.getFamilyVehicles(family.id)
        if(!targetVehs || !targetVehs.length){
            m.newItem({
                name: langStringDefault("admin_menu.4e98cbb4e0de5fdbd73a9242bfd41a69"),
                more: langStringDefault("admin_menu.b850fb29b4569be2b1ac3a48b9710a01"),
            })
        } else {
            m.newItem({
                name: langStringDefault("admin_menu.0dd3e8e16b282661005627aba3ca7a7b"),
                more: `x${targetVehs.length}`,
                onpress: () => {
                    let submenu = menu.new(player, player.user.LangString("admin_menu.59ac8e9a256a383131bb142eb75c8460", family.name));
                    submenu.onclose = () => {
                        showFamilyEditAdminMenu(player, family)
                    }
                    targetVehs.map(veh => {
                        submenu.newItem({
                            name: `#${veh.id} ${veh.name}`,
                            more: `${veh.number}`,
                            desc: `Kosten der Anschaffung: ${veh.isDonate ? DONATE_MONEY_NAMES[2] : "$"} ${system.numberFormat(veh.data.cost)}. ${veh.onParkingFine ? `На штрафстоянке $${system.numberFormat(veh.fine)}` : `На точке спавна - ${veh.inSpawnPoint ? langStringDefault("admin_menu.271318ba3873464c93951eed1793c8b8") : langStringDefault("admin_menu.34decba36d80b2bb1d43506240569e36")}, Место парковки - ${parking.allVehsInAllParking().find(q => q.entity.id === veh.id) ? "Парковка" : "Дом"}`}`,
                            onpress: () => {
                                let submenu2 = menu.new(player, player.user.LangString("admin_menu.e6a7685b77e4fadbda485c493c33d757"));
                                submenu.onclose = () => {
                                    showFamilyEditAdminMenu(player, family)
                                }
                                submenu2.newItem({
                                    name: langStringDefault("admin_menu.d24f308a42259289025793c746219977"),
                                    onpress: () => {
                                        veh.respawn();
                                    }
                                })
                                submenu2.newItem({
                                    name: langStringDefault("admin_menu.370e90bb6cea4aec4c8e0b6636750507"),
                                    onpress: () => {
                                        Vehicle.teleport(veh.vehicle, player.position, player.heading, player.dimension);
                                    }
                                })
                                submenu2.newItem({
                                    name: langStringDefault("admin_menu.034710c1f5877dee42551024fdcdddef"),
                                    onpress: () => {
                                        if (veh.exists) player.user.teleport(veh.vehicle.position.x, veh.vehicle.position.y, veh.vehicle.position.z, 0, veh.vehicle.dimension)
                                    }
                                })
                                submenu2.newItem({
                                    name: langStringDefault("admin_menu.2dfb38b0b0d7ce3905f4e15f90128a8e"),
                                    onpress: () => {
                                        player.user.teleport(veh.position.x, veh.position.y, veh.position.z, veh.position.h, veh.position.d)
                                    }
                                })
                                if(player.user.isAdminNow(6)){
                                    submenu2.newItem({
                                        name: langStringDefault("admin_menu.14f17b970b97e68dc95aab850f96be8e"),
                                        onpress: () => {
                                            menu.accept(player).then(status => {
                                                if(!status) return;
                                                veh.deleteFromDatabase()
                                                showFamilyEditAdminMenu(player, family)
                                                player.notify(player.user.LangString("admin_menu.b55573ee56344267f4bc41c7a3183615"), "success");
                                            })
                                        }
                                    })
                                }
                                submenu2.open();
                            }
                        })
                    })
                    submenu.open();
                }
            })
        }


        if(player.user.family != family) {
            m.newItem({
                name: langStringDefault("admin_menu.5b74dde0f2fb1d9df30d84d120676578"),
                onpress: () => {
                    player.notify(player.user.LangString("admin_menu.8ef1abe5747f83bfe6b325df17a540ba", family.name))
                    player.user.family = family
                    player.user.familyRank = player.user.family.leaderRankID
                }
            })
        }
        m.open()
    })
}