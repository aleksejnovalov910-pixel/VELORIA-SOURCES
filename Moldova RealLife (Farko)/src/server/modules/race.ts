import { langStringDefault } from "../../shared/lang";
import {colshapes} from "./checkpoints";
import {
    CHANCE_WIN_EXTRA_BONUS,
    CHANCE_WIN_EXTRA_BONUS_FIRST,
    CHANCE_WIN_MULTIPLER,
    LIMIT_CHECKPOINTS,
    MAX_RACERS,
    MIN_CHECKPOINTS,
    MIN_RACERS,
    MONEY_RAGE,
    PLAYER_MAPS_LIMIT,
    RACE_NAME,
    RACE_REGISTER_BOARD,
    RACE_REGISTER_POS,
    RACE_TYPE,
    RACE_TYPE_ARR,
    RACE_TYPE_ARR_NAME,
    WAIT_FOR_START_REGISTER,
    WAIT_REGISTER
} from "../../shared/race";
import {ScaleformTextMp} from "./scaleform.mp";
import {menu} from "./menu";
import {RaceCategoryEntity, RaceEntity} from "./typeorm/entities/race";
import {system} from "./system";
import {CustomEvent} from "./custom.event";
import {IventClass} from "./invent";
import {getVehicleConfig, Vehicle} from "./vehicles";
import {getAchievConfigByType} from "../../shared/achievements";

let scalforms: ScaleformTextMp[] = [];
RACE_REGISTER_BOARD.map(data => {
    scalforms.push(new ScaleformTextMp(data[0], "", {
        type: 'board',
        rotation: new mp.Vector3(0, 0, data[1]),
        range: 30
    }))
});
export let raceRegisteredPlayers:PlayerMp[] = [];
export let raceSelectedCars = new Map<number, string>();
export let raceCarsEntity = new Map<number, VehicleMp>();
let winMoney:number;
let winner:number[] = [];
let status:"timer"|"register"|"selectCar"|"race"|"end";
let current: RaceEntity;
let dimensionRace: number;

colshapes.new(RACE_REGISTER_POS, "Inregistrare pentru evenimente de curse", player => {
    const user = player.user;
    const m = menu.new(player, "", player.user.LangString("race.5514cbe0b9c9c077f9f0be12444d91e4"));
    m.sprite = "racelobby"
    if (status == "register"){
        if (raceRegisteredPlayers.includes(player)) {
            m.newItem({
                name: player.user.LangString("race.42c52893e3e7c157a47ac9577a1780ef"),
                onpress: () => {
                    if (status != "register") return player.notify(player.user.LangString("race.cf41e2483d433e3a8b35b252b407e55e"), 'error');
                    raceRegisteredPlayers.splice(raceRegisteredPlayers.indexOf(player), 1);
                    player.notify(player.user.LangString("race.e27ce4fde5ea964374140aea84d839f5"), "success");
                }
            })
        } else {
            m.newItem({
                name: player.user.LangString("race.68ee748993a63e3e7335e818219f768d"),
                onpress: () => {
                    if (status != "register") return player.notify(player.user.LangString("race.457ac3b64fb92b4d43dbe2f7cc22ed71"), "error");
                    if (!user.bank_have) return player.notify(player.user.LangString("race.25a5bef70b2df9934d6cb2bed0eff432"), "error");
                    if (user.attachedToPlace) return player.notify(player.user.LangString("race.851b66578cc125f7072fd86fb0001ae7"), "error");
                    if (raceRegisteredPlayers.length >= current.starts.length) return player.notify(player.user.LangString("race.4257e448eda6ceb954580c4330bc2e76"), "error");
                    raceRegisteredPlayers.push(player);
                    player.notify(player.user.LangString("race.55fcd4172fe7420e3b8b56281e40e670"), "success");
                }
            })
        }
    } else {
        m.newItem({
            name: player.user.LangString("race.5e65fc7469d6f0beebe76ccc79d626ae")
        })
        if(user.isAdminNow(6)){
            m.newItem({
                name: player.user.LangString("race.4bac7ff159f336e79c5e8db7a1480b27"),
                onpress: () => {
                    generateRace();
                }
            })
        }
    }


    m.newItem({
        name: player.user.LangString("race.1968711cedf4bde9550a58aeb9ff01a9"),
        onpress: () => {
            if (user.attachedToPlace) return player.notify(player.user.LangString("race.a33987f5dff54baf9214c0c98be709c9"), "error");
            mapEditorMain(player)
        }
    })
    if(user.isAdminNow(5)){
        m.newItem({
            name: player.user.LangString("race.baaf818b380d7439e9acd71048c3bc8e"),
            onpress: () => {
                mapEditorMain(player, true)
            }
        })
        m.newItem({
            name: player.user.LangString("race.1b405fcbf3b9f29f32f1c0c901395af2"),
            onpress: () => {
                categoties(player);
            }
        })
    }
    m.open();
});




export const categoties = (player: PlayerMp) => {
    const user = player.user;
    let m = menu.new(player, "", player.user.LangString("race.2426f3ea3c9e14dfdb208f1379d62902"));
    m.sprite = "racelobby"
    race.categories.map(item => {
        m.newItem({
            name: item.name,
            desc: `${item.cars.length} ТС`,
            onpress: () => {
                editCat(player, item)
            }
        })
    })
    m.newItem({
        name: player.user.LangString("race.00e4f00efa2fb6de915477518d0e75ab"),
        onpress: () => {
            menu.input(player, player.user.LangString("race.f07004f442f61260dfee6db78d7283fb"), "").then(name => {
                if (!name) return;
                let item = new RaceCategoryEntity();
                item.name = name;
                item.save().then((r) => {
                    race.categories.push(r)
                    editCat(player, r)
                })
            })
        }
    })
    m.open();
}

const editCat = (player: PlayerMp, item: RaceCategoryEntity) => {
    const submenu = menu.new(player, item.name, player.user.LangString("race.183259b80ae17facc28c37f8ac9174a3"));
    submenu.onclose = () => { categoties(player) };
    submenu.newItem({
        name: player.user.LangString("race.cb121a185778a3aadafdf662984951f5"),
        more: item.name,
        onpress: () => {
            menu.input(player, player.user.LangString("race.32a7010aa6196a580245a186e2059c2a"), item.name).then(name => {
                if (!name) return;
                item.name = name;
                item.save().then(() => {
                    editCat(player, item)
                })
            })
        }
    })
    submenu.newItem({
        name: player.user.LangString("race.498bb07ca33fd3043b90c964457f995b"),
        onpress: () => {
            menu.input(player, player.user.LangString("race.cb6e6550aaaf5c82fe3bfe6a6d9f7d0d"), player.vehicle ? player.vehicle.modelname : "", 15).then(name => {
                if (!name) return;
                let models = [...item.cars];
                if (models.includes(name)) return player.notify(player.user.LangString("race.4c44961629d7cabb250d8e14e55050b2"), "error");
                if (!getVehicleConfig(name)) return player.notify(player.user.LangString("race.a2c16ddc2d158f18530161707b2c1359"), "error");
                models.push(name);
                item.cars = models;
                item.save().then(() => {
                    editCat(player, item)
                })
            })
        }
    })
    item.cars.map(car => {
        const cfg = getVehicleConfig(car)
        submenu.newItem({
            name: cfg ? cfg.name : car,
            onpress: () => {
                menu.accept(player, player.user.LangString("race.fbfa1fe28c6ea6d42ae02fd1893a9270")).then(status => {
                    if(!status) return;
                    let models = [...item.cars];
                    models.splice(models.indexOf(car), 1);
                    item.cars = models;
                    item.save().then(() => {
                        editCat(player, item)
                    })
                })
            }
        })
    })
    submenu.open();
}

/** Сгенерировать гонку */
export const generateRace = (map?: RaceEntity) => {
    if (race.itemsArray.length == 0) return;
    if (current) return;
    raceRegisteredPlayers = [];
    current = map ? map : system.randomArrayElement(race.itemsArray.filter(q => q.status == 2).sort((a,b) => {
        return a.uses - b.uses
    }));
    if(!current) return;
    const pos = system.middlePoint3d(...RACE_REGISTER_POS);
    new IventClass('gps', langStringDefault("race.35404d5b6570dba914299b82a40465e4"), WAIT_FOR_START_REGISTER, RACE_NAME, { x: pos.x, y: pos.y, z: pos.z, h: 0}, null, false);
    let timer = map ? 1 : WAIT_FOR_START_REGISTER;
    status = "timer"
    scalforms.map(item => {
        if (!ScaleformTextMp.exists(item)) return;
        item.text = langStringDefault("race.5bb659aecb6f82459e0899c4fcd9ff8e", timer)
    })
    let intTm = 0;
    let int = setInterval(() => {
        intTm+=(mp.config.announce ? 1 : 6);
        if(intTm >= 12){
            timer--;
            intTm = 0;
        }
        if(timer > 0){
            scalforms.map(item => {
                if (!ScaleformTextMp.exists(item)) return;
                // item.text = `Начало регистрации\nЧерез ${timer} минут`
            })
        } else {
            clearInterval(int);
            status = "register"
            new IventClass('gps', langStringDefault("race.725ee8fa088ef2be9ec78a37addd1c09"), WAIT_REGISTER, RACE_NAME, { x: pos.x, y: pos.y, z: pos.z, h: 0 }, null, false);
            timer = map ? 1 : WAIT_REGISTER;
            scalforms.map(item => {
                if (!ScaleformTextMp.exists(item)) return;
                // item.text = `Регистрация\nКоличество: ${raceRegisteredPlayers.length} / ${current.starts.length}\nОсталось: ${timer} м`
            })
            let secIntInt = 0;
            let secInt = setInterval(() => {
                secIntInt++;
                if(secIntInt == 10){
                    timer--;
                    secIntInt = 0;
                }
                if (timer > 0){
                    scalforms.map(item => {
                        if (!ScaleformTextMp.exists(item)) return;
                        // item.text = `Регистрация\nКоличество: ${raceRegisteredPlayers.length} / ${current.starts.length}\nОсталось: ${timer} м`
                    })
                } else {
                    clearInterval(secInt);
                    status = "selectCar"
                    scalforms.map(item => {
                        if (!ScaleformTextMp.exists(item)) return;
                        // item.text = `Идёт выбор транспорта`
                    })
                    raceSelectedCars = new Map();
                    dimensionRace = system.personalDimension;
                    const cat = race.categories.find(q => q.id === current.carsId);
                    raceRegisteredPlayers.map((target, i) => {
                        if(!mp.players.exists(target)) return raceRegisteredPlayers.splice(i, 1);
                        target.dimension = dimensionRace;
                        setTimeout(() => {
                            if(!mp.players.exists(target)) return;
                            menu.selector(target, target.user.LangString("race.d7f5fea922dca85af19f91cb70686710"), cat.cars, false, 'shopui_title_ie_modgarage', true).then(model => {
                                if(!model) return;
                                raceSelectedCars.set(target.dbid, model);
                                if (status == "selectCar" && [...raceSelectedCars].length === raceRegisteredPlayers.length) startRace()
                            })
                        }, 1000)
                    })
                    setTimeout(() => {
                        if (status == "selectCar") startRace();
                    }, 10000)
                }
            }, 6000)
        }
    }, 5000)
}

const startRace = () => {
    status = "race";
    winner = [];
    winMoney = system.getRandomInt(MONEY_RAGE[0], MONEY_RAGE[1])
    winMoney -= winMoney % 100;
    raceCarsEntity.forEach(item => {
        if(item && mp.vehicles.exists(item)) Vehicle.destroy(item)
    })
    raceCarsEntity = new Map();
    if(raceRegisteredPlayers.length < MIN_RACERS){
        raceRegisteredPlayers.map(target => {
            if (!mp.players.exists(target)) return;
            if(mp.config.announce){
                target.notify(target.user.LangString("race.aa11edf9c064a1c279132f046de91fb8"), "error");
                target.user.teleport(RACE_REGISTER_POS[0].x, RACE_REGISTER_POS[0].y, RACE_REGISTER_POS[0].z, 0, 0);
            } else {
                target.notify(target.user.LangString("race.fb57fe14c84d51a9e92ea62b53b45b82"), "error");
            }
        })
        if (mp.config.announce || !raceRegisteredPlayers.length){
            scalforms.map(item => {
                if (!ScaleformTextMp.exists(item)) return;
                item.text = langStringDefault("race.13832c17346c737e0e90a8927d7d3394")
            })
            raceRegisteredPlayers = [];
            status = null;
            current = null;
            return;
        }
    }
    scalforms.map(item => {
        if (!ScaleformTextMp.exists(item)) return;
        item.text = langStringDefault("race.201f0d0f4d710cd7e29f4d649411dc3a")
    })
    const cat = race.categories.find(q => q.id === current.carsId);
    let laps = current.type == "circle" ? system.getRandomInt(2, 4) : 1;
    raceRegisteredPlayers.map((target, position) => {
        if (!mp.players.exists(target)) return;
        menu.close(target);
        if (!raceSelectedCars.has(target.dbid)){
            target.notify(target.user.LangString("race.4c6616ea858ebdb3b38db4a9057abccc"), "error");
            raceSelectedCars.set(target.dbid, system.randomArrayElement(cat.cars));
        }
        target.user.anticheatProtect('teleport', 30000);
        target.user.showLoadDisplay(100);
        target.user.disableAllControls(true);
        const pos = new mp.Vector3(current.starts[position].x, current.starts[position].y, current.starts[position].z);
        const veh = Vehicle.spawn(raceSelectedCars.get(target.dbid), pos, current.starts[position].h, dimensionRace, true, false, 99999);
        raceCarsEntity.set(target.dbid, veh);
        veh.numberPlate = `POS ${position+1}`;
        CustomEvent.triggerClient(target, "race:load", veh.id, current.pos, laps)
        setTimeout(() => {
            if(!mp.players.exists(target)) return;
            if(!mp.vehicles.exists(veh)) return;
            target.position = pos;
            veh.position = pos;
            setTimeout(() => {
                if(!mp.players.exists(target)) return;
                if(!mp.vehicles.exists(veh)) return;
                target.user.putIntoVehicle(veh, 0);
                target.user.hideLoadDisplay(1000);
            }, 2000)
        }, 1000)
    })

    setTimeout(async () => {
        raceRegisteredPlayers.map(target => {
            if (!mp.players.exists(target)) return;
            CustomEvent.triggerClient(target, 'race:starttimer')
        })
        await system.sleep(3000);
        await system.sleep(system.getRandomInt(2000, 5000));
        raceRegisteredPlayers.map(target => {
            if (!mp.players.exists(target)) return;
            CustomEvent.triggerClient(target, "race:start")
        })
    }, 5000);
    
}

CustomEvent.registerClient('race:end', (player, status: boolean) => {
    const user = player.user;
    if(!user) return;
    if (!raceRegisteredPlayers.includes(player)) return;
    if (winner.includes(user.id)) return;
    if (status || (raceRegisteredPlayers.length === 1 && winner.length == 0)){
        winner.push(user.id);
        if(winner.length === 1) player.user.achiev.achievTickByType("raceFirst");
        if(winner.length < 4){
            user.addBankMoney(winMoney / winner.length, true, user.LangString("race.99a392edb5d1227a149774a93177c98c", winner.length), RACE_NAME);
            player.user.achiev.achievTickByType("raceWinPLace")
            player.user.achiev.achievTickByType("raceSum", winMoney / winner.length)
        }
        if (CHANCE_WIN_EXTRA_BONUS > 0){
            if (!CHANCE_WIN_EXTRA_BONUS_FIRST || winner.length < 4){
                let chance = system.getRandomInt(1, 100);
                if (chance <= CHANCE_WIN_EXTRA_BONUS){
                    user.addBankMoney(winMoney * CHANCE_WIN_MULTIPLER, true, user.LangString("race.92eda1da182989f55e1ea2e78dcfe7f4"), RACE_NAME);
                }
            }
        }
    }
    raceRegisteredPlayers.map(target => {
        if (!mp.players.exists(target)) return;
        target.notify(`racer ${user.name} ${status ? target.user.LangString("race.6af68b76c6abaccb202e031b0caed8c5", winner.length) : target.user.LangString("race.cd491e32ca4b1f15d20e025697e5df56")}`, status ? 'success' : 'error');
        if (winner.length === 1) {
            target.notify(target.user.LangString("race.22585e585713a63aadf8c40e0850cd51"), 'success')
            setTimeout(() => {
                raceRegisteredPlayers.map(target => {
                    if (!mp.players.exists(target)) return;
                    target.notify(target.user.LangString("race.bf1a650c90ebec1c79a704102ea583c4"), 'success')
                })
            }, 30000)
        }
    })
    if (winner.length === 1) {
        setTimeout(() => {
            stopRace();
        }, 30000 + 30000)
    }
    raceRegisteredPlayers.splice(raceRegisteredPlayers.indexOf(player), 1);
    user.teleport(RACE_REGISTER_POS[0].x, RACE_REGISTER_POS[0].y, RACE_REGISTER_POS[0].z, 0, 0, true);
    const ids = user.id
    setTimeout(() => {
        if (raceCarsEntity.has(ids) && mp.vehicles.exists(raceCarsEntity.get(ids))){
            Vehicle.destroy(raceCarsEntity.get(ids))
        }
        raceCarsEntity.delete(ids);
    }, 5000)
})

const stopRace = () => {
    raceRegisteredPlayers.map(target => {
        if (!mp.players.exists(target)) return;
        target.notify(target.user.LangString("race.be25b4d47820bd023c97464f5491d72e"), 'error');
        const user = target.user;
        user.teleport(RACE_REGISTER_POS[0].x, RACE_REGISTER_POS[0].y, RACE_REGISTER_POS[0].z, 0, 0);
        setTimeout(() => {
            if (raceCarsEntity.has(user.id) && mp.vehicles.exists(raceCarsEntity.get(user.id))) Vehicle.destroy(raceCarsEntity.get(user.id))
            raceCarsEntity.delete(user.id);
        }, 5000)
    })

    scalforms.map(item => {
        if (!ScaleformTextMp.exists(item)) return;
        item.text = langStringDefault("race.8cf6195be5623d9b20d628783a4b0ee3")
    })

    current = null;

}

export let race = {
    items: new Map<number, RaceEntity>(),
    categories: <RaceCategoryEntity[]>[],
    get itemsArray(): RaceEntity[]{
        return [...race.items].map(q => q[1])
    },
    loadAll: () => {
        return new Promise<void>(resolve => {
            console.time('Der Download der Daten der Rennstrecke ist abgeschlossen. Ladezeit')
            RaceCategoryEntity.find().then(cars => {
                race.categories = cars
                RaceEntity.find().then(data => {
                    data.map(item => {
                        race.items.set(item.id, item);
                    })
                    system.debug.info(`Laden von Rennstreckendaten, Anzahl der Elemente: ${data.length}`);
                    console.timeEnd('Der Download der Daten der Rennstrecke ist abgeschlossen. Ladezeit')
                    resolve()
                })
            })
        })
    }
}


const mapEditStatus = [langStringDefault("race.596eeac6e085b1780c76e7c104860d3b"), langStringDefault("race.a688cbb4092ab6d29d26ba529eb06497"), langStringDefault("race.3338c0368a84fda96b8b7c4dec6c1d3c")];

const mapEditorMain = (player: PlayerMp, admin = false) => {
    const user = player.user;
    let m = menu.new(player, player.user.LangString("race.fc7a5dbf24e9c9b5c732912f1de838d1"));
    let c = 0;
    race.items.forEach(item => {
        if (admin){
            if(!item.status) return;
        } else {
            if (item.userId !== user.id) return;
        }
        c++;
        m.newItem({
            name: item.name,
            more: `${RACE_TYPE_ARR_NAME[RACE_TYPE_ARR.indexOf(item.type)]} (${mapEditStatus[item.status]})`,
            onpress: () => {
                mapEdit(player, item, admin);
            }
        })
    })
    if (!admin){
        m.newItem({
            name: player.user.LangString("race.4e54c6efed7e244240fc414462ee3ba0"),
            more: `${c} / ${PLAYER_MAPS_LIMIT}`,
            onpress: () => {
                if (c >= PLAYER_MAPS_LIMIT) return player.notify(player.user.LangString("race.0ceb35076283f233d87a18ab21bc71da"), 'error');
                menu.input(player, player.user.LangString("race.612d20e0ed1694373c591deb23bf99e2"), '', 15, 'text').then(name => {
                    if(!name) return;
                    if(race.itemsArray.find(q => q.name === name)) return player.notify(player.user.LangString("race.26505a1f135e7b795594a9db3c23ab3c"), "error");
                    let map = new RaceEntity();
                    let cat = system.randomArrayElement(race.categories);
                    if(cat) map.carsId = cat.id
                    map.userId = user.id;
                    map.name = name;
                    map.save().then(s => {
                        race.items.set(s.id, s);
                        player.notify(player.user.LangString("race.5b7d844f656a399d6ed4b9862396847c"))
                        mapEdit(player, s);
                    })
                })
            }
        })
    }
    m.open();
}

const mapEdit = (player: PlayerMp, map: RaceEntity, admin = false) => {
    const user = player.user;
    let m = menu.new(player, `${map.name}`, player.user.LangString("race.5ed9269538c24dd73d2df77a67f091cd"));
    m.newItem({
        name: player.user.LangString("race.82fca9ce5cfedd1f645ef74fa288466f"),
        onpress: () => {
            if (map.status) return player.notify(player.user.LangString("race.3de8949adf34142f9777d8825d52fc98"), 'error');
            menu.accept(player).then(status => {
                if (map.status) return player.notify(player.user.LangString("race.0475903f6daf87718fa21e17d774775c"), 'error');
                if(!status) return;
                race.items.delete(map.id)
                map.remove();
                mapEditorMain(player)
                player.notify(player.user.LangString("race.a0637d8710be7d734480cc67a671b19e"), "success");
            })
        }
    })
    m.newItem({
        name: player.user.LangString("race.2c52b417007965321f75f9c768a806a5"),
        onpress: () => {
            if (race.itemsArray.filter(q => q.userId === user.id).length >= PLAYER_MAPS_LIMIT) return player.notify(player.user.LangString("race.2f226b4755e4e148c6974e4a40383138"), 'error');
            menu.input(player, player.user.LangString("race.88b23f90e4c66b57a15ea39a9864cbff"), '', 15, 'text').then(name => {
                if (!name) return;
                if (race.itemsArray.find(q => q.name === name)) return player.notify(player.user.LangString("race.f5d06320c43aba13805c3f1ea3f0cdcb"), "error");
                let newmap = new RaceEntity();
                newmap.userId = user.id;
                newmap.name = name;
                newmap.pos = map.pos;
                newmap.starts = map.starts;
                newmap.save().then(s => {
                    race.items.set(s.id, s);
                    player.notify(player.user.LangString("race.afb8ff465a31ab431d3aa78aaee040e8"));
                    mapEdit(player, s);
                })
            })
        }
    })
    const cat = race.categories.find(q => q.id === map.carsId);
    if(!cat){
        map.carsId = 0;
    }
    m.newItem({
        name: langStringDefault("race.786880bbf92fc390765c3f1760d34156"),
        more: map.pos.length
    })
    m.newItem({
        name: langStringDefault("race.87e1082970e94a67ea62d06bd3be1023"),
        more: map.starts.length
    })
    m.newItem({
        name: player.user.LangString("race.41bcf14c8d03e95c9cb27b44559b7c67"),
        more: cat ? cat.name : player.user.LangString("race.cab826ab50f31d9a49d5fa1f047135db"),
        onpress: () => {
            if (map.status) return player.notify(player.user.LangString("race.b4caa3fa856f2c86197ed2c9cc589a43"), 'error');
            menu.selector(player, player.user.LangString("race.7b575eca78eeddcf47143e3d7c5601ce"), race.categories.map(q => q.name), true).then(val => {
                if(typeof val !== "number") return;
                let cat = race.categories[val];
                if(!cat) return;
                map.carsId = cat.id
                map.save().then(() => {
                    mapEdit(player, map);
                })
            })
        }
    })
    if (!map.status){
        m.newItem({
            name: player.user.LangString("race.d63d6895c11bd66e7306ad5d7bc00243"),
            onpress: () => {
                menu.accept(player).then(status => {
                    if(!status) return;
                    if (map.status) return player.notify(player.user.LangString("race.856607ce9b2fcd397fcd0a6886b85d2b"), 'error');
                    if (!cat) return player.notify(player.user.LangString("race.185da798375874167c48c18b6da91b05"), 'error');
                    if (map.starts.length < MIN_RACERS) return player.notify(player.user.LangString("race.dfedff2c57f35b0b31b6eec2e465b6c8", MIN_RACERS), "error");
                    if (map.starts.length > MAX_RACERS) return player.notify(player.user.LangString("race.6a144f3c5b06eecec468bebe77ce5758", MAX_RACERS), "error");
                    if (map.pos.length > LIMIT_CHECKPOINTS) return player.notify(player.user.LangString("race.38af5eebe3306dc845dd42960f652cd8", LIMIT_CHECKPOINTS), "error");
                    if (map.pos.length < MIN_CHECKPOINTS) return player.notify(player.user.LangString("race.4afae3b31c00a58a9a9a9212f8173270", MIN_CHECKPOINTS), "error");
                    map.status = 1;
                    map.save();
                    player.notify(player.user.LangString("race.99ce229f3390efafcc6371a827369fee"), "success");
                    mapEdit(player, map);
                })
            }
        })
    } else {
        m.newItem({
            name: player.user.LangString("race.30fa24504dab97c2ae17434e9da8df25"),
            more: mapEditStatus[map.status],
        }) 
        if (admin){
            if (map.status != 0){
                m.newItem({
                    name: player.user.LangString("race.558d1509a5a26c56300e10c18a6fadd8"),
                    onpress: () => {
                        map.status = 0;
                        map.save().then(() => {
                            mapEdit(player, map, admin);
                        })
                    }
                }) 
            }
            if (map.status != 1){
                m.newItem({
                    name: player.user.LangString("race.863a7a6a97aaf7d9844bfa1426172125"),
                    onpress: () => {
                        map.status = 1;
                        map.save().then(() => {
                            mapEdit(player, map, admin);
                        })
                    }
                }) 
            }
            if (map.status != 2){
                m.newItem({
                    name: player.user.LangString("race.81b041d922324aa99254444b79659396"),
                    onpress: () => {
                        map.status = 2;
                        map.save().then(() => {
                            mapEdit(player, map, admin);
                        })
                    }
                }) 
            }
            if (map.status == 2){
                m.newItem({
                    name: player.user.LangString("race.7fb2bcd31fb9d88a572cbfa8ee4409b3"),
                    onpress: () => {
                        generateRace(map)
                    }
                }) 
            }
        }
    }
    m.newItem({
        name: player.user.LangString("race.8b2473938619d64727304c86c7618afa"),
        onpress: () => {
            menu.selector(player, player.user.LangString("race.7ddd4a26b1941765f043bb77a9b0f67c"), cat.cars).then(model => {
                if(!model) return;
                const testD = system.personalDimension;
                player.dimension = testD;
                let laps = map.type == "circle" ? 2 : 1
                CustomEvent.triggerClient(player, 'race:test', model, map.pos, map.starts[0], laps)
            })
        }
    })
    m.newItem({
        name: player.user.LangString("race.bde37ed2a46fa6c5099ad18b8ead7778"),
        onpress: () => {
            if (map.status) return player.notify(player.user.LangString("race.f620e0f7d2479795276c80e9c3f6cdbd"), 'error');
            CustomEvent.triggerClient(player, "race:editmap", map.id, map.name, map.pos, map.starts, map.type, cat.cars);
            player.dimension = system.personalDimension
        }
    })
    m.open();
}

CustomEvent.registerClient('raceedit:save', (player, id: number, pos: {
    x: number;
    y: number;
    z: number;
    h: number;
}[], starts: {
    x: number;
    y: number;
    z: number;
    h: number;
}[], type: RACE_TYPE) => {
    const user = player.user;
    if(!user) return;
    user.teleport(RACE_REGISTER_POS[0].x, RACE_REGISTER_POS[0].y, RACE_REGISTER_POS[0].z, 0, 0)
    const map = race.items.get(id);
    if(!map) return player.notify(player.user.LangString("race.43b500714984cf6fda8c4226ff78d22c"), "error");
    if(map.userId !== user.id) return player.notify(player.user.LangString("race.c304ee8e8b9a8846eee6f1879855ee70"), "error")
    if (map.status) return player.notify(player.user.LangString("race.2f507c38cb73ae676ae35bce586d4d8a"), 'error');
    if(typeof pos !== "object"){
        system.saveLog('codeInjection', langStringDefault("race.d22a9899625d2aa048a11ee298428f71", user.name, user.id))
        return player.notify(player.user.LangString("race.a09a0a254b624ac701e4ad50e893c82b"), 'error');
    }
    if (typeof starts !== "object"){
        system.saveLog('codeInjection', langStringDefault("race.b795f705c5f68610eca4cbad34a92b76", user.name, user.id))
        return player.notify(player.user.LangString("race.424bdf3016b2169a861c9a663c725c67"), 'error');
    }
    if (!RACE_TYPE_ARR.includes(type)){
        system.saveLog('codeInjection', langStringDefault("race.78ce3a9a008df938529a15b92a367a6b", user.name, user.id))
        return player.notify(player.user.LangString("race.02ce8cda7e657a3e80820479d7e01d66"), 'error');
    }
    map.type = type;
    map.pos = pos;
    map.starts = starts
    map.save().then(() => {
        player.notify(player.user.LangString("race.44b4f3282742f96d3f1133b905b3388e"), "success");
    }).catch(err => {
        player.notify(player.user.LangString("race.18adecb76a117d54f0a49f41ac4dd79a"), "error");
        system.debug.error(`Beim Speichern der Karte ist ein Fehler aufgetreten #${map.id} Spieler ${user.name} ${user.id}`);
        system.debug.error(err);
    });
    
})
CustomEvent.registerClient('raceedit:exit', (player) => {
    const user = player.user;
    if(!user) return;
    user.teleport(RACE_REGISTER_POS[0].x, RACE_REGISTER_POS[0].y, RACE_REGISTER_POS[0].z, 0, 0)
})
