import { langStringDefault } from "../../shared/lang";
import {Like} from "typeorm";
import {CustomEvent} from "./custom.event";
import {system} from "./system";
import {UserEntity} from "./typeorm/entities/user";
import {User} from "./user";
import {Vehicle} from "./vehicles";
import {LicenceType, LicenseName, REMOVE_LICENSE_RANK} from "../../shared/licence";
import {inventory} from "./inventory";
import {CUFFS_ITEM_ID, OWNER_TYPES, SCREWS_ITEM_ID} from "../../shared/inventory";
import {tablet} from "./tablet";
import {Family} from "./families/family";
import {gui} from "./gui";
import {invokeDispatchCode} from './dispatch'
import {fraction, fractionCfg} from "./fractions/main";
import {FRACTION_RIGHTS} from "../../shared/fractions/ranks";

CustomEvent.registerClient('cuffTarget', (player, targetId: number) => {
    const user = player.user
    const target = mp.players.at(targetId)
    
    if (!user || !target || !mp.players.exists(target)) 
        return

    if (user.cuffed) {
        return player.notify(player.user.LangString("faction.086382ad82944f0b99b8e525addb5f74"), 'error');
    }

    const firstCuffsOrScrewsInInventory = user.inventory.find(i => i.item_id == SCREWS_ITEM_ID || i.item_id == CUFFS_ITEM_ID)
    if (!firstCuffsOrScrewsInInventory)
        return player.notify(player.user.LangString("faction.54a16c7a7a695e85ee4ca9ef3dda03b0"))
    
    user.setCuffedTarget(target, firstCuffsOrScrewsInInventory)
});

CustomEvent.registerClient('uncuffTarget', (player, targetId: number) => {
    const user = player.user
    const target = mp.players.at(targetId)

    if (!user || !target || !mp.players.exists(target))
        return

    user.setUncuffedTarget(target)
});

CustomEvent.registerClient('followTarget', (player, targetId: number) => {
    const user = player.user
    const target = mp.players.at(targetId)

    if (!user || !target || !mp.players.exists(target))
        return

    if (user.cuffed) {
        return player.notify(player.user.LangString("faction.8f811f9278a319d6c3ee4166929a6080"), 'error');
    }

    user.setFollowTarget(target)
});

CustomEvent.registerCef('faction:tag', (player, tag: string) => {
    const user = player.user;
    if (!user) return;
    if (!user.fraction) return;
    user.tag = tag ? system.filterInput(tag) : "";
    tablet.reloadFractionData(player)
});
CustomEvent.registerCef('faction:kick', (player, id: number) => {
    const user = player.user;
    if (!user) return;
    if (!user.fraction) return;
    if (!fraction.getRightsForRank(player.user.fraction, player.user.rank).includes(FRACTION_RIGHTS.KICK)) return;
    const target = User.get(id);
    if(target){
        const data = target.user;
        if (data.fraction !== user.fraction) return;
        if (data.rank >= user.rank) return;
        user.log('fractionKick', langStringDefault("faction.a8a1575633f8bad862b4d0bdcca160e0", data.rank), id)
        data.fraction = 0
        data.setJobDress(null); // SCOATE ȚINUTA
        data.fractionWarns = 0;
        return;
    }
    User.getData(id).then(data => {
        if(!data) return;
        if(data.fraction !== user.fraction) return;
        if(data.rank >= user.rank) return;
        user.log('fractionKick', langStringDefault("faction.7cfa6623fb6cf4a9f89055246e54515b", data.rank), id)
        data.fraction = 0;
        data.rank = 0;
        data.fraction_warns = 0;
        data.save().then(() => {
            tablet.reloadFractionData(player)
        });
    })
})
CustomEvent.registerCef('faction:database:search', async (player, id: number, name: string, social: string, bank: string, veh: string) => {
    const user = player.user;
    if (!user) return;
    if (!user.fraction) return;
    if (user.fraction !== 1 && !user.fractionData.police) return;
    let data: {id: number, name: string}[] = [];
    if (id && typeof id === "number" && !isNaN(id) && id > 0 && id < 99999999){
        const dataq = await User.getData(id);
        if (!dataq) return {status: langStringDefault("faction.5079b013f11dd5a165b938daf26dc9b9")};
        data = [{ id, name: dataq.rp_name}];
        return { data };
    }
    // if (veh && veh.length >= 1){
    //     data.push(...[...Vehicle.list].map(q => q[1]).filter(q => q.number.includes(veh)).map(async q => {

    //     }))
    // }

    if(name && name.length > 2){
        let q = (await UserEntity.find({ where: { rp_name: Like(`%${system.filterInput(name)}%`)}, take: 15 }));
        data.push(...q.map(s => {
            return {
                id: s.id,
                name: s.rp_name,
            }
        }))
    }

    if(social && social.length > 2){
        let q = (await UserEntity.find({ where: { social_number: Like(`%${system.filterInput(social)}%`)}, take: 15 }));
        data.push(...q.map(s => {
            return {
                id: s.id,
                name: s.rp_name,
            }
        }))
    }

    if(bank && bank.length > 2){
        let q = (await UserEntity.find({ where: { bank_number: Like(`%${system.filterInput(bank)}%`)}, take: 15 }));
        data.push(...q.map(s => {
            return {
                id: s.id,
                name: s.rp_name,
            }
        }))
    }

    if(data.length === 0){
        return { status: langStringDefault("faction.601dea8033c2ccb909b8431f4047b3af") }; 
    }
    return { data };
})
CustomEvent.registerCef('faction:database:searchvehicle', async (player, number: string) => {
    const user = player.user;
    if (!user) return;
    if (!user.fraction) return;
    if (user.fraction !== 1 && !user.fractionData.police) return;
    number = number.toLowerCase();
    let q = 0;
    let cars = [...Vehicle.list].map(q => q[1]).filter(veh => {
        if(q > 30) return false;
        if(veh.id.toString() == number) return true;
        if(veh.number.toLowerCase().includes(number)) return true;
        if(veh.name.toLowerCase().includes(number)) return true;
    }).map(veh => {
        return  {
            name: veh.name,
            model: veh.model,
            owner: veh.owner,
            number: veh.number,
            fam: !!veh.familyOwner,
            ownername: veh.familyOwner ? Family.getByID(veh.familyOwner)?.name : ''
        }
    })
    let ownersid = cars.filter(q => !q.ownername).map(q => q.owner);
    let owners = await User.getDatas(...ownersid);
    cars.map(q => {
        if(!q.ownername){
            const owner = owners.find(z => z.id === q.owner);
            if(owner) q.ownername = owner.rp_name
        }
    })
    return cars
});
CustomEvent.registerCef('faction:database:data', async (player, id: number) => {
    const user = player.user;
    if (!user) return;
    if (!user.fraction) return;
    if (user.fraction !== 1 && !user.fractionData.police) return;
    return tablet.gosSearchData(id)
});
CustomEvent.registerCef('faction:setGpsTracker', (player, status: boolean) => {
    const user = player.user;
    if (!user) return;
    if (!user.fraction) return;
    player.setVariable('gpsTrack', status);
    if(status){
        player.setVariable('gpsTrackPos', JSON.stringify({
            x: Math.floor(player.position.x),
            y: Math.floor(player.position.y),
            z: Math.floor(player.position.z),
            v: !!player.vehicle
        }))
    } else {
        player.setVariable('gpsTrackPos', null)
    }
    tablet.reloadFractionData(player)
})

setInterval(() => {
    mp.players.toArray().map(player => {
        if(!player.user) return
        if(player.getVariable('gpsTrack')) {
            player.setVariable('gpsTrackPos', JSON.stringify({
                x: Math.floor(player.position.x),
                y: Math.floor(player.position.y),
                z: Math.floor(player.position.z),
                v: !!player.vehicle
            }));
        }
        updateSuspectGPS(player)
    })

}, 10000)

export const updateSuspectGPS = (player: PlayerMp) => {
    if(!mp.players.exists(player) || !player.user) return;
    let setMark = false
    if(player.getVariable('suspectGPS_position')) {
        if(!player.user.wanted_level) player.setVariable('suspectGPS_position', null)
        else setMark = true
    }
    else if(player.user.wanted_level) setMark = true
    if(setMark) {
        player.setVariable('suspectGPS_position', JSON.stringify({
            x: Math.floor(player.position.x),
            y: Math.floor(player.position.y),
            z: Math.floor(player.position.z),
            v: !!player.vehicle
        }))
    }
}

CustomEvent.registerCef('faction:setGpsTrackerWatch', (player, id: number, status: boolean) => {
    const user = player.user;
    if (!user) return;
    if (!user.fraction) return;
    if (user.hasGpsTracking(id) && !status) user.removeGpsTracking(id)
    else if (!user.hasGpsTracking(id) && status) user.addGpsTracking(id)
})
CustomEvent.registerCef('faction:setRank', async (player, id: number, rank: number) => {
    const user = player.user;
    if (!user) return;
    if (!user.fraction) return;
    if (!fraction.getRightsForRank(player.user.fraction, player.user.rank).includes(FRACTION_RIGHTS.CHANGE_RANKS)) return;
    if (fractionCfg.isSubLeader(user.fraction, rank)) {
        const res = await UserEntity.find({
            where: {
                fraction: user.fraction,
                rank
            }
        })

        if (res.length >= 3) return player.notify(player.user.LangString("faction.ccd758c72873ee9db07e88dc93461a81"), "error");
    }

    const target = User.get(id);
    if(target){
        const data = target.user;
        if (data.fraction !== user.fraction) return;
        if (data.rank >= user.rank) return;
        // if(user.is_police && rank >= 6 && !data.haveActiveLicense('military')) return player.notify(player.user.LangString("faction.19e86aa539c34eb1b45488e56a09fde0"), 'error')
        user.log('fractionRank', langStringDefault("faction.edab98b0232e0a4fbbde427932f8d904", rank, data.rank), id)
        data.rank = rank
        return;
    } else {
        if(user.is_police && rank >= 6) return player.notify(player.user.LangString("faction.827db6145e5367b065bb26cd48cd87f7"), 'error')
    }
    User.getData(id).then(data => {
        if(!data) return;
        if(data.fraction !== user.fraction) return;
        if(data.rank >= user.rank) return;
        user.log('fractionRank', langStringDefault("faction.3f8b9e7ce645b9ad55c5c7324e50f90b", rank, data.rank), id)
        data.rank = rank;
        data.save().then(() => {
            tablet.reloadFractionData(player)
        });
    })
})


let removeLicense = new Map<number, boolean>();


CustomEvent.registerCef('faction:removeLicense', (player, id: number, license: LicenceType) => {
    const user = player.user;
    if(!user) return;
    if(user.fraction !== 1 && !user.is_police) return;
    if(user.rank < REMOVE_LICENSE_RANK) return;
    if(removeLicense.has(user.id)) return player.notify(player.user.LangString("faction.bc15c421ed765411830598dc228b6312"), 'error')
    User.getData(id).then((data) => {
        if(!data) return;
        const q = [...data.licenses];
        if(q.findIndex(z => z[0] === license) > -1) q.splice(q.findIndex(z => z[0] === license), 1);
        data.licenses = q;

        player.user.log('gosJob', langStringDefault("faction.26c877bf4222485ae89d221aefc6ef12", LicenseName[license]), id);
        User.writeRpHistory(data.id, langStringDefault("faction.f0d1f138c3913f79e1c2dffc127d30e3", user.name, user.id, LicenseName[license]))
        removeLicense.set(user.id, true)
        const ids = user.id;
        setTimeout(() => {
            removeLicense.delete(ids);
        }, 20 * 60000)
        const items = inventory.getInventory(OWNER_TYPES.PLAYER, data.id);
        if(items && items.length > 0){
            const item = items.find(itm => itm.item_id === 803 && itm.advancedNumber === data.id && itm.serial && itm.serial.split('-')[0] == license)
            if(item) inventory.deleteItem(item);
        }
        const target = User.get(data.id);
        if(target) target.notify(target.user.LangString("faction.5e099fac79dced2159d425546405b477", user.name, user.id, LicenseName[license]))
        data.save().then(() => {
            tablet.gosSearchDataReload(id)
        });
    })
})

gui.chat.registerCommand("m", (player) => {
    const user = player.user;
    const fraction = user?.fraction;
    if (!fractionCfg.getFraction(fraction)?.police || !player.vehicle) return;
    
    mp.players.forEach((nplayer) => {
        if (nplayer.dist(player.position) < gui.chat.chatRange * 2 && nplayer.dimension == player.dimension)
            nplayer.outputChatBox(nplayer.user.LangString("faction.6512f48191dc335a5a50cda327761e0d", gui.chat.getTime(), nplayer.user.getChatNameString(player)))
    })
});

gui.chat.registerCommand("m1", (player) => {
    const user = player.user;
    const fraction = user?.fraction;
    if (!fractionCfg.getFraction(fraction)?.police || !player.vehicle) return;

    mp.players.forEach((nplayer) => {
        if (nplayer.dist(player.position) < gui.chat.chatRange * 2 && nplayer.dimension == player.dimension)
            nplayer.outputChatBox(nplayer.user.LangString("faction.ed26b5860773b2cb6ee109e24b3944e3", gui.chat.getTime(), nplayer.user.getChatNameString(player)))
    })
});

gui.chat.registerCommand("wh", (player, targetIdStr: string, ...messagearr: string[]) => {
    const user = player.user;
    if (!user) return;
    
    const id = parseInt(targetIdStr);
    if (isNaN(id) || id < 1 || id > 99999999) return;
    
    const target = User.get(id)
    if (!target) return;
    
    let message = system.filterInput(escape(messagearr.join(' ')))
    if (!message) return;

    if (player.dist(target.position) > gui.chat.whisperChatRange) {
        player.notify(player.user.LangString("faction.b26b31ba985575af9ffcf4ea56ffc54b"), 'error');
        return;
    }

    target.outputChatBox(target.user.LangString("faction.c5226773a12788c1ba5d2a681dd7ef8a", gui.chat.getTime(), target.user.getChatNameString(player), message))
    player.outputChatBox(player.user.LangString("faction.f7a75d04ac41e8870016f8ba5eec6674", gui.chat.getTime(), player.user.getChatNameString(player), player.user.getChatNameString(target), message))
    
    mp.players.forEach((nplayer) => {
        if (nplayer.dist(player.position) < gui.chat.chatRange && nplayer.dimension == player.dimension && nplayer != target)
            nplayer.outputChatBox(nplayer.user.LangString("faction.607fefe695a80e8cd5954cd732d3b8a5", gui.chat.getTime(), nplayer.user.getChatNameString(player), id))
    })
});

gui.chat.registerCommand("s", (player, ...messagearr: string[]) => {
    const user = player.user;
    if (!user) return;

    let message = system.filterInput(escape(messagearr.join(' ')))
    if (!message) return;

    mp.players.forEach((nplayer) => {
        if (nplayer.dist(player.position) < gui.chat.chatRange * 2 && nplayer.dimension == player.dimension)
            nplayer.outputChatBox(nplayer.user.LangString("faction.fc88d6190e806505c44de18931e89dc5", gui.chat.getTime(), nplayer.user.getChatNameString(player), message))
    })
});

gui.chat.registerCommand("mark", (player, codeStr) => {
    const user = player.user;
    if (!user) return;
    if (!user.is_gos) return;
    const code = parseInt(codeStr);
    if (!code || isNaN(code)) return;
    
    invokeDispatchCode(player, code)
});

gui.chat.registerCommand("dep", (player, ...messagearr: string[]) => {
    const user = player.user;
    if(!user) return;
    const fractionId = user.fraction;
    if(!fractionId) return;
    const fractionName = fractionCfg.getFractionName(fractionId);
    if(!fractionName) return;
    if (!user.is_gos) return;
    
    let message = system.filterInput(escape(messagearr.join(' ')))
    if(!message) return;

    if (!fraction.getRightsForRank(user.fraction, user.rank).includes(FRACTION_RIGHTS.DEPARTMENT))
        return player.notify(player.user.LangString("faction.aae990a2406962b50960bab4ebc6c37f"));

    mp.players.toArray().filter(q => q.user && q.user.exists && q.user.fraction && q.user.is_gos).map(target =>
        target.outputChatBox(target.user.LangString("faction.3329552b79560b964cb6d11388171c04", fractionName, user.rankName, user.name, user.dbid, message)))
});

gui.chat.registerCommand("gov", (player, ...messagearr: string[]) => {
    const user = player.user;
    if(!user) return;
    const fractionId = user.fraction;
    if(!fractionId) return;
    const fractionName = fractionCfg.getFractionName(fractionId);
    if(!fractionName) return;
    let message = system.filterInput(escape(messagearr.join(' ')))
    if(!message) return;

    if (!user.is_gos) return;

    if (!fraction.getRightsForRank(user.fraction, user.rank).includes(FRACTION_RIGHTS.GOVERNMENT))
        return player.notify(player.user.LangString("faction.ef367fd4a9fd0524fbd05870201ab59c"));

    mp.players.toArray().filter(q => q.user && q.user.exists).map(target =>
        target.outputChatBox(target.user.LangString("faction.a500aaa9bf716e7ba86997747e3277eb", fractionName, user.name, user.dbid, message)))
});

gui.chat.registerCommand("f", (player, ...messagearr: string[]) => {
    const user = player.user;
    if(!user) return;
    const fraction = user.fraction;
    if(!fraction) return;
    const name = fractionCfg.getFractionName(fraction);
    if(!name) return;
    let message = system.filterInput(escape(messagearr.join(' ')))
    if(!message) return;
    mp.players.toArray().filter(q => q.user && q.user.exists && q.user.fraction === fraction).map(target =>
        target.outputChatBox(target.user.LangString("faction.243036fc7e5f3109db76b8fb51c4b8f4", name, user.rankName, user.name, user.id, message)))

    gui.chat.sendMeCommand(player, player.user.LangString("faction.108a6feadd4bbef36d93c9161f6fc16d"));
})


gui.chat.registerCommand("fb", (player, ...messagearr: string[]) => {
    const user = player.user;
    if(!user) return;
    const fraction = user.fraction;
    if(!fraction) return;
    const name = fractionCfg.getFractionName(fraction);
    if(!name) return;
    let message = system.filterInput(escape(messagearr.join(' ')))
    if(!message) return;
    mp.players.toArray().filter(q => q.user && q.user.exists && q.user.fraction === fraction).map(target =>
        target.outputChatBox(target.user.LangString("faction.6faf11fd65743847137f6cfd21e918c3", name, user.rankName, user.name, user.id, message)))
        //target.outputChatBox(`[Рация ${name}] ${user.name}: (( ${message} ))`))
})