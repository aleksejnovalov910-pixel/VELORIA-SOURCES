import { langStringDefault } from "../../shared/lang";
import {system} from "./system";
import {menu} from "./menu";
import {User} from "./user";
import {FIGHT_LIST} from "../../shared/fight";
import {inventoryShared} from "../../shared/inventory";
import {DeathMath} from "./deadmatch";
import {fractionCfg} from "./fractions/main";

let currentIDinFight: number[] = [];

mp.events.add('playerDeath', (player => {
    if (!mp.players.exists(player)) return;
    if (!player.dbid) return;
    if (!player.dimension) return;
    const index = currentIDinFight.findIndex(q => q == player.dbid)
    if (index == -1) return;
    currentIDinFight.splice(index, 1);
    if(mp.players.exists(player)){
        player.user.adminRestore();
        player.user.returnToOldPos();
        player.user.removeWeapon();
        setTimeout(() => {
            if(!mp.players.exists(player)) return;
            player.user.adminRestore();
            player.user.removeWeapon();
        }, 1000)
    }
}))
mp.events.add('playerQuit', (player => {
    if (!player.dbid) return;
    const index = currentIDinFight.findIndex(q => q == player.dbid)
    if (index == -1) return;
    currentIDinFight.splice(index, 1);
}))

export const fight = {
    startFight: (admin: PlayerMp, blueTeam: PlayerMp[], redTeam: PlayerMp[], location = 0, weapon = 0, minutes = 10, admins: PlayerMp[]) => {
        const dimension = system.personalDimension;
        system.debug.debug('[FIGHT]', 'create fight', `dimension ${dimension}`)
        if(!mp.players.exists(admin)) return;


        const cfg = FIGHT_LIST[location];


        const dm = new DeathMath(cfg.pos, cfg.radius)
        dm.time = minutes * 60
        dm.team1_name = langStringDefault("fight.d65a5ef05cb5737cfe805f8b83b1992e");
        dm.team2_name = langStringDefault("fight.98c37f1946ce3b3831c2ea6c02226154");

        dm.team1_start = {x: cfg.blueTeamPos.x, y: cfg.blueTeamPos.y, z: cfg.blueTeamPos.z, h: cfg.blueTeamH, r: 5}
        dm.team2_start = {x: cfg.redTeamPos.x, y: cfg.redTeamPos.y, z: cfg.redTeamPos.z, h: cfg.redTeamH, r: 5}

        admins.map(item => {
            dm.spectators.push({id: item.dbid, name: item.user.name, death: 0, score: 0, player: item, enter: {x: item.position.x, y: item.position.y, z: item.position.z, h: item.heading, d: item.dimension}})
        })

        blueTeam.map((target, id) => {
            if(!mp.players.exists(target)) return blueTeam.splice(id, 1);
            dm.insertPlayer(target, 1);
        });

        redTeam.map((target, id) => {
            if(!mp.players.exists(target)) return redTeam.splice(id, 1);
            dm.insertPlayer(target, 2);
        });

        let team1_fractions: number[] = dm.team1.map(q => q.player.user.fraction);
        let team1_fractions_check: number[] = dm.team1.map(q => q.player.user.fraction).filter((q, i, a) => q === a[0]);
        if(team1_fractions.length === team1_fractions_check.length){
            dm.team1_name = fractionCfg.getFractionName(team1_fractions[0])
            dm.team1_image = `f${team1_fractions[0]}`
        }

        let team2_fractions: number[] = dm.team2.map(q => q.player.user.fraction);
        let team2_fractions_check: number[] = dm.team2.map(q => q.player.user.fraction).filter((q, i, a) => q === a[0]);
        if(team2_fractions.length === team2_fractions_check.length){
            dm.team2_name = fractionCfg.getFractionName(team2_fractions[0])
            dm.team2_image = `f${team2_fractions[0]}`
        }


        const weaponCfg = inventoryShared.weapons[weapon];

        dm.weapon = weaponCfg.hash;
        dm.ammo = 480;

        dm.wait = 5;

        dm.start()

    },
    create: (player: PlayerMp, blueTeam: PlayerMp[] = [], redTeam: PlayerMp[] = [], location = 0, weapon = 0, minutes = 10, admins: PlayerMp[] = []) => {
        const user = player.user;
        if(!user) return;
        const m = menu.new(player, player.user.LangString("fight.05598931e95ba23d93b61be39e48cded"), player.user.LangString("fight.73c7e846c5cbfcb0a0513b7d28b780a3"));

        m.newItem({
            name: player.user.LangString("fight.d35cd498d5aa01608fa68889edd5bf5c"),
            onpress: () => {
                blueTeam = []
                redTeam = []
                fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
            }
        })
        m.newItem({
            name: player.user.LangString("fight.1ab2d818f54e9cbb06af9b1505ad72ca"),
            type: 'list',
            list: FIGHT_LIST.map(q => q.name),
            listSelected: location,
            onchange: (val) => {
                location = val;
            }
        })
        m.newItem({
            name: player.user.LangString("fight.dbb37ebf585f707dc736fb443b885e4e"),
            type: 'list',
            list: inventoryShared.weapons.map(q => {
                return inventoryShared.getWeaponNameByHash(q.hash);
            }),
            listSelected: weapon,
            onchange: (val) => {
                weapon = val;
            }
        })
        m.newItem({
            name: player.user.LangString("fight.4d1dfa99eb50b37ffcf2419b73a528b0"),
            type: 'range',
            desc: player.user.LangString("fight.c50b15331f22482b0e51fa5b7512be42"),
            rangeselect: [0, 120],
            listSelected: minutes,
            onchange: (val) => {
                minutes = val;
            }
        })
        m.newItem({
            name: player.user.LangString("fight.19ee89d899d782848c84812344049956"),
            desc: player.user.LangString("fight.548a83cd8c34bbad06fe8ad60d246b3f"),
            onpress: () => {
                fight.startFight(player, blueTeam, redTeam, location, weapon, minutes, admins)
            }
        })

        m.newItem({name: player.user.LangString("fight.e4c0e6c6995786393ecaf7d26d254faa")})
        m.newItem({
            name: player.user.LangString("fight.42c62d136068f901d61056aa1b5aa048"),
            onpress: () => {
                blueTeam = []
                fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
            }
        })
        m.newItem({
            name: player.user.LangString("fight.bf45f231210dd0b43cfab78dac3860d0"),
            onpress: () => {
                menu.input(player, player.user.LangString("fight.dac41ab78724df2ec67dddb76d302b76"), user.getNearestPlayer() ? user.getNearestPlayer().dbid : 0, 5, 'int').then(id => {
                    if(!id || id < 0) return;
                    const target = User.get(id);
                    if(!target) return player.notify(player.user.LangString("fight.051f791a13521f91fbf03c965fabae54"), 'error');
                    if(blueTeam.find(q => q.id === target.id)) return player.notify(player.user.LangString("fight.57753682266be69ad19d01fe00f0d604"), 'error');
                    if(redTeam.find(q => q.id === target.id)) return player.notify(player.user.LangString("fight.eb734fbac3c52eeb98de2e8877e95d16"), 'error');
                    if(admins.find(q => q.id === target.id)) return player.notify(player.user.LangString("fight.fe2bb97fcaebe60261f7cdb60eac86bb"), 'error');
                    blueTeam.push(target);
                    fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
                })
            }
        })
        blueTeam.map((target, id) => {
            if(!mp.players.exists(target)) return blueTeam.splice(id, 1);
            m.newItem({
                name: `${target.user.name} ${target.user.id}`,
                desc: `${target.user.fractionData ? target.user.fractionData.name : player.user.LangString("fight.f7d8921ee264b61ab16be234877e7dbb")}`,
                onpress: () => {
                    blueTeam.splice(id, 1);
                    fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
                }
            })
        })

        m.newItem({name: player.user.LangString("fight.0b2c764f596846a19811fd739f451e42")})
        m.newItem({
            name: player.user.LangString("fight.58fde3788115789960a0fea8801f9b03"),
            onpress: () => {
                redTeam = []
                fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
            }
        })
        m.newItem({
            name: player.user.LangString("fight.ef1b9d77f2ffc368a3e29eda59bca898"),
            onpress: () => {
                menu.input(player, player.user.LangString("fight.5c4cded1edd59f22b5dd901f332174bf"), user.getNearestPlayer() ? user.getNearestPlayer().dbid : 0, 5, 'int').then(id => {
                    if(!id || id < 0) return;
                    const target = User.get(id);
                    if(!target) return player.notify(player.user.LangString("fight.62722cb29ffff358b48ca73e16c7b49f"), 'error');
                    if(blueTeam.find(q => q.id === target.id)) return player.notify(player.user.LangString("fight.7e375317fce20e04429f90bde6204e13"), 'error');
                    if(redTeam.find(q => q.id === target.id)) return player.notify(player.user.LangString("fight.25924c3f094c9be79adff0b3e6d212af"), 'error');
                    if(admins.find(q => q.id === target.id)) return player.notify(player.user.LangString("fight.88ff34986395a89e814888664a69f0d4"), 'error');
                    redTeam.push(target);
                    fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
                })
            }
        })
        redTeam.map((target, id) => {
            if(!mp.players.exists(target)) return blueTeam.splice(id, 1);
            m.newItem({
                name: `${target.user.name} ${target.user.id}`,
                desc: `${target.user.fractionData ? target.user.fractionData.name : player.user.LangString("fight.595dd7666520505502d8033d3b828add")}`,
                onpress: () => {
                    redTeam.splice(id, 1);
                    fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
                }
            })
        })


        m.newItem({
            name: player.user.LangString("fight.4ae35384cc5f670759170a01865e7709"),
            more: `${admins.find(q => q.dbid === user.id) ? player.user.LangString("fight.fe4a2b59db031e93e584629c55a8c50e") : player.user.LangString("fight.c58d855dabd34e6d60563ea9d80ecdcc")}`
        })
        m.newItem({
            name: player.user.LangString("fight.2b74e73323cedc370dca58c829437d7e"),
            onpress: () => {
                admins = []
                fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
            }
        })
        m.newItem({
            name: player.user.LangString("fight.b3495e31a88616ef007ce16f29f89513"),
            onpress: () => {
                menu.input(player, player.user.LangString("fight.3347c3e044d9b79385c3fe47921e66a9"), user.getNearestPlayer() ? user.getNearestPlayer().dbid : 0, 5, 'int').then(id => {
                    if(!id || id < 0) return;
                    const target = User.get(id);
                    if(!target) return player.notify(player.user.LangString("fight.921018e452fa0085381eb31ab44cb653"), 'error');
                    if(blueTeam.find(q => q.id === target.id)) return player.notify(player.user.LangString("fight.71e74dd79955e05574a0dc66af712272"), 'error');
                    if(redTeam.find(q => q.id === target.id)) return player.notify(player.user.LangString("fight.85afbc95c3d53e66f9f95359bb3df926"), 'error');
                    if(admins.find(q => q.id === target.id)) return player.notify(player.user.LangString("fight.da6a7cd520e3fb35c7fab6ab3fb5000b"), 'error');
                    admins.push(target);
                    fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
                })
            }
        })
        admins.map((target, id) => {
            if(!mp.players.exists(target)) return blueTeam.splice(id, 1);
            m.newItem({
                name: `${target.user.name} ${target.user.id}`,
                desc: `${target.user.fractionData ? target.user.fractionData.name : player.user.LangString("fight.54d3e63d9934cfe93fe69b86e749fc52")}`,
                onpress: () => {
                    admins.splice(id, 1);
                    fight.create(player, blueTeam, redTeam, location, weapon, minutes, admins)
                }
            })
        })

        m.open();
    }
}
