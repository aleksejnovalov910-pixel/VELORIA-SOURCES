import { langStringDefault } from "../../shared/lang";
import {
    GR6_BASE_POS,
    GR6_DRESS_CONFIG_MAN,
    GR6_DRESS_CONFIG_WOMAN,
    GR6_LEVEL_ACCESS,
    GR6_MONEY_GIVE_RANGE,
    GR6_MONEY_REWARD_PERCENT,
    GR6_POINTS_GRAB,
    GR6_TASKS_COUNT,
    GR6_VEH_BUY_POSITION,
    GR6_VEH_COST,
    GR6_VEH_COST_RETURN,
    GR6_VEH_MODEL
} from "../../shared/gr6";
import {colshapes} from "./checkpoints";
import {menu} from "./menu";
import {system} from "./system";
import {Vehicle} from "./vehicles";
import {LicenseName} from "../../shared/licence";
import {User} from "./user";
import {CustomEvent} from "./custom.event";
import {MINIGAME_TYPE} from "../../shared/minigame";
import {FamilyContractList} from "../../shared/family";


const pointData = new Map<number, number>();

[...GR6_POINTS_GRAB, ...GR6_VEH_BUY_POSITION, GR6_BASE_POS].map(pos => {
    Vehicle.addBlockNpcCarZone(pos)
})

GR6_POINTS_GRAB.map((item, index) => {
    pointData.set(index, 0);
    const check = (player: PlayerMp) => {
        const user = player.user;
        if (!user) return false;
        if (!user.gr6job){
            player.notify(player.user.LangString("gr6.5b818026d3f1ef027709a8b548aa73c9"), 'error');
            return false
        }
        if (pointData.get(index) !== user.gr6jobId){
            player.notify(player.user.LangString("gr6.1aa8d543439506a8c1e73474344d7482"));
            return false
        }
        const veh = User.getNearestVehicles(player, 30).find(q => q.gr6Id === user.gr6jobId);
        if (!veh){
            player.notify(player.user.LangString("gr6.a052d120cfefb2a9117be6f12c53ff11"));
            if(!mp.config.announce) player.notify(player.user.LangString("gr6.b0c855cfa7ab4894fb605968be9424d9"), 'info')
            else return false
        }
        return true;
    }
    colshapes.new(item, "GR6 Point", player => {
        const user = player.user;
        if (!user) return;
        if (!check(player)) return;
        
        // 🔒 Verificare: dacă este în vehicul, nu permite colectarea
        if (player.vehicle) {
            player.notify('Nu poti colecta bani in timp ce esti in vehicul!', 'error');
            return;
        }
        user.playAnimationWithResult(["anim@heists@money_grab@duffel", "loop"], 15, user.LangString("gr6.c4b860f7fcb29ef651a9709d4315230d"), player.heading, MINIGAME_TYPE.MONEY).then(status => {
            if(!status) return;
            if(!mp.players.exists(player)) return;
            if (!check(player)) return;
            pointData.set(index, 0);
            const sum = system.getRandomInt(GR6_MONEY_GIVE_RANGE[0], GR6_MONEY_GIVE_RANGE[1]);
            if (!user.gr6Money) user.gr6Money = 0;
            user.gr6Money += sum;
            player.user.achiev.achievTickByType("gr6count")
            player.user.achiev.achievTickByType("gr6sum", sum)
            player.notify(player.user.LangString("gr6.fa1236aed1a777f86300789973300146", system.numberFormat(sum)), 'success');
            // mp.events.call(JOB_TASK_MANAGER_EVENT, player, 'collector');
            const targets = mp.players.toArray().filter(q => q.user && q.user.gr6jobId === user.gr6jobId);
            targets.map(target => {
                CustomEvent.triggerClient(target, "gr6:tasks:setClear", index)
            })
        })
    }, {
        radius: 1,
        type: 27,
        predicate: colshapePlayerPredicate
    }, 'job');
});

function colshapePlayerPredicate(player: PlayerMp): boolean {
    return player.user && player.user.gr6job;
}

mp.events.add("playerEnterVehicle", (player: PlayerMp, vehicle: VehicleMp) => {
    const user = player.user;
    if(!user) return;
    if (!user.gr6Money) return;
    if (vehicle.locked) return;
    if (!player.user.gr6job) return;
    if (!vehicle.gr6Id) return;
    if (vehicle.gr6Id !== player.user.gr6jobId) return;
    vehicle.getOccupants().map(target => {
        target.notify(target.user.LangString("gr6.2da1c14ce6cd8b5b91f20998b8855f1b", player.user.name, system.numberFormat(user.gr6Money)), 'success')
    })
    if (!vehicle.gr6Money) vehicle.gr6Money = 0;
    vehicle.gr6Money += user.gr6Money;
    user.gr6Money = 0;
});


GR6_VEH_BUY_POSITION.map(pos => {
    colshapes.new(pos, player => player?.user?.LangString("gr6.4826b592d4426f40b758b361d9a86058") ?? langStringDefault("gr6.4826b592d4426f40b758b361d9a86058"), player => {
        const user = player.user;
        if (!user) return;
        if (user.playtime < GR6_LEVEL_ACCESS) return player.notify(player.user.LangString("gr6.ac375bd0c27c6936bf8aeddc2daf1327", GR6_LEVEL_ACCESS, user.playtime), 'error');
        if (!user.gr6job) return player.notify(player.user.LangString("gr6.1fa79b4d1a7e9312bad1503e8a772816"), 'error');
        const m = menu.new(player, "", player.user.LangString("gr6.09b826887d6f1e557938578299f0812e"));
        m.sprite = "gr6";
        if (user.gr6jobCar && !mp.vehicles.exists(user.gr6jobCar)) user.gr6jobCar = null

        if (user.gr6jobCar){
            const returnCost = ((GR6_VEH_COST / 100) * GR6_VEH_COST_RETURN);
            m.newItem({
                name: user.LangString("gr6.074cdf534828df5fb712360af1362b8f"),
                more: returnCost ? `+$${system.numberFormat(returnCost)}` : '',
                desc: user.LangString("gr6.d36970ce0d6d06a520d465a71560ed7f"),
                onpress: () => {
                    if (user.gr6jobCar && !mp.vehicles.exists(user.gr6jobCar)) user.gr6jobCar = null;
                    if (!user.gr6jobCar) return player.notify(player.user.LangString("gr6.1ca1b9701bd1b73e763b71f28a69c4d7"), "error");
                    if (user.gr6jobCar.gr6Money) return player.notify(player.user.LangString("gr6.51e1bb0d28a66e80a27960442f5d86e3"), "error");
                    if (system.distanceToPos(user.gr6jobCar.position, player.position) > 10 || user.gr6jobCar.dimension) return player.notify(player.user.LangString("gr6.55708161266b1c5a9ca79bd6c8b5c513"), "error");
                    if (returnCost) user.addBankMoney(returnCost, true, user.LangString("gr6.afb65e1f850f2063fcdce985eb61730f"), user.LangString("gr6.79d6f51d77f1eaae045ccd04c684e264"));
                    user.gr6jobCar.destroy();
                    user.gr6jobCar = null;
                    leaveTeam(player);
                }
            })
        } else {
            m.newItem({
                name: user.LangString("gr6.dc16385ef6439ef350301ae3fab6d0ec"),
                more: `$${system.numberFormat(GR6_VEH_COST)}`,
                desc: user.LangString("gr6.fe4c5fcba38351b0b48f375e4e777b56"),
                onpress: () => {
                    if(user.gr6jobId) return player.notify(player.user.LangString("gr6.be77a9dedab99f4c9e7159fab3f6840f"), "error");
                    if (user.gr6jobCar && mp.vehicles.exists(user.gr6jobCar)) return player.notify(player.user.LangString("gr6.fab47ee247b9508521c1c30a74df1683"), "error");
                    if (!user.haveActiveLicense('truck')) return player.notify(player.user.LangString("gr6.873d789fef1bd6b8ef5e6b0e0311290c", LicenseName.truck), 'error');
                    if(!user.tryRemoveBankMoney(GR6_VEH_COST, true, user.LangString("gr6.5f6a39569e67f2ea85bc9910d9dc53c9"), user.LangString("gr6.0d6cc4591cee9bb78ccbf1e7ec04e211"))) return;
                    user.gr6jobLeader = true;
                    user.gr6jobId = system.getRandomInt(100000, 900000);
                    const crd = Vehicle.findFreeParkingZone(pos, 20);
                    user.gr6jobCar = Vehicle.spawn(GR6_VEH_MODEL, crd ? new mp.Vector3(crd.x, crd.y, crd.z) : pos, crd ? crd.heading : player.heading, 0, true, true);
                    user.gr6jobCar.gr6Money = 0;
                    user.gr6jobCar.gr6Id = user.gr6jobId;
                    setTimeout(() => {
                        if (!mp.vehicles.exists(user.gr6jobCar)) return;
                        player.user.putIntoVehicle(user.gr6jobCar, 0);
                        player.notify(player.user.LangString("gr6.cd880fa7b3569ce5276b63a920a84321"), "error");
                    }, 1000)
                }
            }) 
        }

        m.open();
    }, {
        radius: 3,
        type: 27
    })
})

setTimeout(() => {
    system.createBlip(635, 2, GR6_BASE_POS, langStringDefault("gr6.f34ba8ea206d6fe400188e7ed1451fd2"))
})

colshapes.new(GR6_BASE_POS, player => player?.user?.LangString("gr6.a8790f84e9833ea44571aa0bd0d3a20a") ?? langStringDefault("gr6.a8790f84e9833ea44571aa0bd0d3a20a"), player => {
    gr6Menu(player);
}, {
    radius: 1.5,
    type: 27
})

const gr6Menu = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (user.playtime < GR6_LEVEL_ACCESS) return player.notify(player.user.LangString("gr6.b04c76215932716249cc4ffb68289957", GR6_LEVEL_ACCESS, user.playtime), 'error');
    const m = menu.new(player, "", player.user.LangString("gr6.29af77b69cc07c4a2907b922755f57cf"));
    m.sprite = "gr6";
    if (user.gr6job) {
        m.newItem({
            name: user.gr6jobLeader ? user.LangString("gr6.ec27e87995c2a47b21d30d4e2e919f0c") : user.LangString("gr6.66a6359506c89d662d0e3fd96c664037"),
            onpress: () => {
                menu.accept(player).then(status => {
                    if (!status) return;
                    leaveTeam(player);
                    gr6Menu(player);
                })
            }
        })
        if (user.gr6jobCar && !mp.vehicles.exists(user.gr6jobCar)) user.gr6jobCar = null
        if (user.gr6jobCar){
            if (!user.gr6jobCar.gr6Money) user.gr6jobCar.gr6Money = 0;
            m.newItem({
                name: user.LangString("gr6.9a7d587f3bd534f8d50098338d59d214"),
                more: `$${system.numberFormat(user.gr6jobCar.gr6Money)}`,
                onpress: () => {
                    if (!user.gr6jobId) return player.notify(player.user.LangString("gr6.36ad5bc00f0f87a82422aca957ec70dd"), "error"), gr6Menu(player);
                    if (user.gr6jobCar && !mp.vehicles.exists(user.gr6jobCar)) user.gr6jobCar = null;
                    if (!user.gr6jobCar) return player.notify(player.user.LangString("gr6.a2a56de24062d62b31d5d9d5cb5f4712"), "error"), gr6Menu(player);
                    if (system.distanceToPos(user.gr6jobCar.position, GR6_BASE_POS) > 10 || user.gr6jobCar.dimension) return player.notify(player.user.LangString("gr6.c280f1136f2bb3b96bde9bf186a2d11f"), "error"), gr6Menu(player);
                    if (!user.gr6jobCar.gr6Money) return player.notify(player.user.LangString("gr6.b77eb9497d1fae7a2b3f8f0f78df55f6"), "error");
                    unLoadCar(player);
                    player.notify(player.user.LangString("gr6.6efe8989733f90ee7b3b2da9a8309acd"), "success");
                    gr6Menu(player);
                }
            })
        }
        m.newItem({
            name: user.LangString("gr6.4ca7029ea1139fb706cf53cdd67fb866"),
            onpress: () => {
                if (!user.gr6jobId) return player.notify(player.user.LangString("gr6.036894f64a2e7bb72f1e970ef5113fb3"), "error"), gr6Menu(player);
                if (user.gr6jobCar && !mp.vehicles.exists(user.gr6jobCar)) user.gr6jobCar = null;
                if (!user.gr6jobCar) return player.notify(player.user.LangString("gr6.4e4ddbcea0fb530e34c3b5deb7f2ee0f"), "error"), gr6Menu(player);
                if ([...pointData].filter(q => q[1] === user.gr6jobId).length > 0) return player.notify(player.user.LangString("gr6.c6abe3f2942c9d5894f2921622721fa9"), "error");
                if (user.gr6jobCar.gr6Money) return player.notify(player.user.LangString("gr6.15f54f4e1c8e3c6220081cd900b95501"), "error");
                const targets = mp.players.toArray().filter(q => q.user && q.user.gr6jobId === user.gr6jobId);
                if (targets.length < 2){
                    if(mp.config.announce){
                        player.notify(player.user.LangString("gr6.1c7ec5c54166e8cf8b2f02bd1c8e2781"), "error")
                        return 
                    } else {
                        player.notify(player.user.LangString("gr6.fa8a3824c8c7c83a77a366a851107430"), "error", "", 10000)
                    }
                }
                let pos:{x: number, y: number, z: number, id: number}[] = []
                for (let id = 0; id < GR6_TASKS_COUNT; id++) {
                    let rand = system.randomArrayElement([...pointData].filter(q => !q[1]).map(q => q[0]));
                    if (!pointData.get(rand)) {
                        pointData.set(rand, user.gr6jobId)
                        const { x, y, z } = GR6_POINTS_GRAB[rand];
                        pos.push({ x, y, z, id: rand});
                    }
                }
                targets.map(target => {
                    CustomEvent.triggerClient(target, "gr6:tasks", pos)
                })
            }
        })
        m.newItem({
            name: user.LangString("gr6.0924046457f97f1a64a78dbbaafc5b4e"),
            onpress: () => {
                if (!user.gr6job) return player.notify(player.user.LangString("gr6.c225b9f557525ad8e503e9b2c890589a"), "error"), gr6Menu(player);
                if (user.gr6jobId) return player.notify(player.user.LangString("gr6.02c4f46f6838e9b6c70940eb9688aa28"), 'error');
                user.gr6job = false;
                user.gr6jobId = null;
                user.gr6jobLeader = false;
                user.gr6Money = 0;
                CustomEvent.triggerClient(player, "gr6:tasks:clear")
                user.setJobDress(null);
                player.notify(player.user.LangString("gr6.f10a681c93202704306370cfd1714b6b"), "success");
                gr6Menu(player);
            }
        })
    } else {
        m.newItem({
            name: user.LangString("gr6.7f4b9dba9e740c5283ad02dcd535b556"),
            onpress: () => {
                if (user.gr6job) return player.notify(player.user.LangString("gr6.6931f39fcc22a995a9d81b1541f8c7df"), "error"), gr6Menu(player);
                //if (user.fraction) return player.notify("Нельзя работать в службе доставки работая в организации", 'error')
                if (user.playtime < GR6_LEVEL_ACCESS) return player.notify(player.user.LangString("gr6.c9c29eca34c3b3f97b79dd0b6703fa7f", GR6_LEVEL_ACCESS, user.playtime), 'error');
                // if(!user.haveActiveLicense('weapon')) return player.notify(`Для работы вам необходимо иметь лицензию на ${LicenseName.weapon}`, 'error');
                if(!user.bank_have) return player.notify(player.user.LangString("gr6.22696813640b1f5033a9cd735950428b"), 'error');
                user.gr6job = true;
                user.gr6Money = 0;
                user.setJobDress(user.male ? GR6_DRESS_CONFIG_MAN : GR6_DRESS_CONFIG_WOMAN);
                player.notify(player.user.LangString("gr6.098d18f79f0b341106c7b4308ac8fe13"));
                gr6Menu(player);
            }
        })
    }
    m.open();
}

mp.events.add('playerQuit', player => {
    const user = player.user;
    if (!user) return;
    if(user.gr6jobCar) unLoadCar(player);
    

    leaveTeam(player)
})

const unLoadCar = (player: PlayerMp) => {
    const user = player.user;
    if (!user) return;
    if (!user.gr6jobCar) return;
    if (!mp.vehicles.exists(user.gr6jobCar)) return;
    if (!user.gr6jobCar.gr6Money) return;
    const targets = mp.players.toArray().filter(q => q.user && q.user.gr6jobId === user.gr6jobId);
    let sum = Math.floor(((user.gr6jobCar.gr6Money / 100) * GR6_MONEY_REWARD_PERCENT) / targets.length);
    targets.map(target => {
        target.user.addBankMoney(sum, true, target.user.LangString("gr6.67c65f3113d10674f5f2ee9c16aff5ab", (GR6_MONEY_REWARD_PERCENT / targets.length).toFixed(2)), target.user.LangString("gr6.586143108fb9df730168266a55892958"))

        if(target.user.familyId) target.user.family.addContractValueIfExists(FamilyContractList.moneytransfers, sum)

    })
    user.gr6jobCar.gr6Money = 0;
}

const leaveTeam = (player: PlayerMp) => {
    const user = player.user;
    if(!user) return;
    if (!user.gr6jobId) return;
    if (user.gr6jobLeader){
        pointData.forEach((item, index) => {
            if (item === user.gr6jobId){
                pointData.set(index, 0)
            }
        })
    }
    if (mp.players.exists(player)) {
        if (user.gr6jobLeader) {
            player.notify(player.user.LangString("gr6.0781ae87d6f4312476d489dd1118c698"), "success");
        } else {
            player.notify(player.user.LangString("gr6.80d5148ac6030805a84e7e89a95e0e30"), "warning")
        }
    }
    const targets = mp.players.toArray().filter(q => q.user && q.user.gr6jobId === user.gr6jobId && q.user.id !== user.id);
    targets.map(target => {
        if (user.gr6jobLeader){
            target.user.gr6jobId = null;
            target.notify(target.user.LangString("gr6.4c5fd8ebf2dd5bc554bbeaa2ac00e885"), "success");
            CustomEvent.triggerClient(target, "gr6:tasks:clear")
        } else {
            target.notify(target.user.LangString("gr6.ba008f8a141ba8cca99221a13d5bafd7", user.name), "warning")
        }
    })
    CustomEvent.triggerClient(player, "gr6:tasks:clear")
    user.gr6jobLeader = false;
    user.gr6jobId = null;
    
}