import { langStringDefault } from "../../../shared/lang";
import "./jobs"
import "./quests"
import "./family"
import "./create"
import "./admin_menu"
import {CustomEvent} from "../custom.event";
import {Family} from "./family";
import {FamilyUpgrade, getFamilyUpgradeLevelPrice} from "../../../shared/family";
import {system} from "../system";
import {User} from "../user";
import {Vehicle} from "../vehicles";
import {tablet} from "../tablet";
import {saveEntity} from "../typeorm";
import {menu} from "../menu";
import {gui} from "../gui";

export const FamilyAddPointsAtPayDay = (check:boolean) => {
    Family.getAll().map(async f => {
        // if(( !f.lastContractUpdate || system.timestamp > f.lastContractUpdate + FAMILY_CONTRACT_UPD_TIME ) && !Object.keys(f.contracts).length) f.setRandomContracts()
        f.setRandomHourQuest()
        // let pointToAdd = 0;
        // let members = await f.getAllMembers(true)
        // members.map(member => {
        //     let user = User.get(member.id).user
        //     if(!check || (User.playedTime.has(member.id) && User.playedTime.get(member.id) < PAYDAY_NEED_PLAY && !user.afk)) pointToAdd++
        // })
        // let membersCountAll = await f.getMembersCount()
        // if(members.length > membersCountAll*0.7) f.points +=
        // if(pointToAdd) {
        //     f.addPoints(pointToAdd)
        //     f.addContractValueIfExists(FamilyContractList.onliners, pointToAdd)
        // }
        f.checkContractUpdateTime()
    })
}

CustomEvent.register("newDay", () => {
    Family.getAll().map(async f => {
        f.takePoints(await f.getMembersCount() * 10)
    })
})

gui.chat.registerCommand("h", (player, ...messagearr: string[]) => {
    const user = player.user;
    if (!user) return;
    const familyId = user.familyId;
    if (!familyId) return;
    let message = system.filterInput(escape(messagearr.join(" ")));
    if (!message) return;
    
    mp.players.toArray()
        .filter(q => q.user && q.user.exists && q.user.family && q.user.familyId === familyId)
        .map(target => target.outputChatBox(target.user.LangString("index.b2757a6e8f0121f1b39992e7f7e64d1b", user.getFamilyRank().name, user.name, message)));
})

gui.chat.registerCommand("hb", (player, ...messagearr: string[]) => {
    const user = player.user;
    if (!user) return;
    const familyId = user.familyId;
    if (!familyId) return;
    let message = system.filterInput(escape(messagearr.join(" ")));
    if (!message) return;

    mp.players.toArray()
        .filter(q => q.user && q.user.exists && q.user.family && q.user.familyId === familyId)
        .map(target => target.outputChatBox(target.user.LangString("index.ea10683713bbdfed086a97808e39a3d0", user.getFamilyRank().name, user.name, message)));
})

CustomEvent.register("newHour", (hour: number) => {
    if(hour == 20 && (new Date()).getDate() == 1) {
        Family.getAll().map(async f => {
            f.clearSeasonPoints()
        })
    }
})

const CASH_TYPE_MONEY = 1, CASH_TYPE_COINS = 0


CustomEvent.registerCef("family:saveBio", async (player: PlayerMp, text: string) => {
    if (!mp.players.exists(player) || !player.user || !player.user.family) return;
    if (player.user.isFamilySubLeader || player.user.isFamilyLeader) {
        player.user.family.biography = text;
        player.user.notify(player.user.LangString("index.1cebc5c33a8a6935734d7bdd31a5c5c4"))
        await tablet.updateFamilyData(player.user.family)
    }
    else player.user.notify(player.user.LangString("index.9ea9de5d59a713bb37edcb8a38f5c065"), "error")
})

CustomEvent.registerCef("family:upgrade",(player:PlayerMp, id:number, cashType:number) => {
    if(!mp.players.exists(player) || !player.user) return;
    const updateInfo = FamilyUpgrade.find(fu => fu.id == id)
    if(!updateInfo) return;
    const family = player.user.family

    const cost = [
        getFamilyUpgradeLevelPrice(id, (family.upgrades[id] || 0) + 1, "coin"),
        getFamilyUpgradeLevelPrice(id, (family.upgrades[id] || 0) + 1, "money")
    ]

    if(!player.user.isFamilyLeader) return player.notify(player.user.LangString("index.56b619d9b342ec69713986b11a70449b"), "error")
    if(((family.upgrades[id] || 0)+1)*updateInfo.amount > updateInfo.max) return player.notify(player.user.LangString("index.f7f549c143c03de0823165f61d85c6bc"), "error")

    if(id == 4) {
        if(cashType != CASH_TYPE_COINS) return;
        menu.input(player, player.user.LangString("index.237a1748229349bd9461657ed7ba63fd"), "", 15).then(name => {
            if (!name) return;
            if (!name || ! /^[a-zA-Z_-]{0,15}$/i.test(name)) {
                player.notify(player.user.LangString("index.d86ad53d25f5760e4fbf44d002198be2"), "error")
                return false
            }
            if (Family.getAll().find(f => f.name == name)) {
                player.notify(player.user.LangString("index.a005b4b98d66ac8ccd6abc1326fac494"), "error")
                return false;
            }
            if(family.donate < cost[cashType]) return player.notify(player.user.LangString("index.76a3b8fa8cdb8dde1099c3d5c122a7ed"), "error")
            family.removeDonateMoney(cost[cashType], player, family.user.LangString("index.ad4a218d78a7ec23b1358b8d5d1dd7fb"))
            player.notify(player.user.LangString("index.eb5b48602a3d4a201fd0fc03fd041250", system.numberFormat(cost[cashType])))
            family.name = name
            tablet.updateFamilyData(family)
        })
        return;
    }

    if(cashType == CASH_TYPE_MONEY) {
        if(family.money < cost[cashType]) return player.notify(player.user.LangString("index.6a157be517c4d6fa9d3a11193f3ec921"), "error")
        family.removeMoney(cost[cashType], player, family.user.LangString("index.f2e76402f5c4f98ab8524bb9e451823d"))
        player.notify(player.user.LangString("index.bf3ff8f785eec8bedc184cdad732e3c9", system.numberFormat(cost[cashType])))
    }
    else {
        if(family.donate < cost[cashType]) return player.notify(player.user.LangString("index.c2f820431ca6f38f6e4686e6e1848dba"), "error")
        family.removeDonateMoney(cost[cashType], player, family.user.LangString("index.f28f51e6d4bd66baccaa7ccccaae9f14"))
        player.notify(player.user.LangString("index.11d8974a4b5cbd1624263c821ab411df", system.numberFormat(cost[cashType])))
    }
    family.setUpgrade(id, (family.upgrades[id]||0)+1)
})


CustomEvent.registerCef("family:levelup", async (player, type) => {
    if(!player.user || !player.user.family) return false;
    return await player.user.family.tryLevelUp(player, type)
})

CustomEvent.registerCef("family:rankup", async (player, rankID: number) => {
    if(!player.user || !player.user.family || !player.user.isFamilyLeader) return false;
    const family = player.user.family
    const currentRanks = family.ranks

    const rankIndex = currentRanks.findIndex(r => r.id === rankID)
    if(rankIndex === -1 || rankIndex-1 < 0 || currentRanks[rankIndex-1].isPermament || currentRanks[rankIndex].isPermament || currentRanks[rankIndex].isOwner || currentRanks[rankIndex].isSoOwner) return false

    const old = currentRanks[rankIndex-1]
    currentRanks[rankIndex-1] = currentRanks[rankIndex]
    currentRanks[rankIndex] = old

    family.ranks = currentRanks
    tablet.updateFamilyData(family)
    return true;
})

CustomEvent.registerCef("family:rankdown", async (player, rankID: number) => {
    if(!player.user || !player.user.family || !player.user.isFamilyLeader) return false;
    const family = player.user.family
    const currentRanks = family.ranks

    const rankIndex = currentRanks.findIndex(r => r.id === rankID)
    if(rankIndex === -1 || rankIndex+1 >= currentRanks.length-1 || currentRanks[rankIndex+1].isSoOwner || currentRanks[rankIndex+1].isOwner
        || currentRanks[rankIndex].isOwner || currentRanks[rankIndex].isSoOwner || currentRanks[rankIndex].isPermament) return false

    const old = currentRanks[rankIndex+1]
    currentRanks[rankIndex+1] = currentRanks[rankIndex]
    currentRanks[rankIndex] = old

    family.ranks = currentRanks
    tablet.updateFamilyData(family)
    return true;
})

CustomEvent.registerCef("family:deleterank", async (player, rankID: number) => {
    if(!player.user || !player.user.family || !player.user.isFamilyLeader) return false;
    const family = player.user.family
    const currentRanks = family.ranks


    const rankIndex = currentRanks.findIndex(r => r.id === rankID)
    if(rankIndex === -1 || currentRanks[rankIndex].isOwner || currentRanks[rankIndex].isSoOwner || currentRanks[rankIndex].isPermament) return false

    const defaultRank = currentRanks.find(r => r.isPermament) ? currentRanks.find(r => r.isPermament).id : 1


    family.getAllMembers().then(members => {
        members.map(member => {
            if(member.familyRank != rankID) return;
            if(member.is_online) {
                const mUser = User.get(member.id)
                if(mUser) mUser.user.familyRank = defaultRank
            }
            else {
                member.familyRank = defaultRank
                saveEntity(member)
            }
        })
    })

    family.cars.map(c => {
        if(!c.familyOwner || c.familyOwner != family.id || c.fromRank != rankID) return false;
        c.fromRank = (rankIndex+1 < currentRanks.length) ? currentRanks[rankIndex+1].id : defaultRank
    })


    currentRanks.splice(rankIndex, 1)

    family.ranks = currentRanks
    tablet.updateFamilyData(family)
    return true;
})

CustomEvent.registerCef("family:editrank", async (player, rankID: number, name: string, rankRules: number[]) => {
    if(!player.user || !player.user.family || !player.user.isFamilyLeader) return false;
    const family = player.user.family
    const currentRanks = family.ranks
    const rankIndex = currentRanks.findIndex(r => r.id === rankID)

    if(rankIndex === -1) return false;

    if (!name || ! /^(?!.*([\s])\1)[а-яА-ЯA-Za-z_\s-]{0,20}$/i.test(name)) {
        player.notify(player.user.LangString("index.22a51ca64bfd071546630b77e8531ff6"), "error")
        tablet.updateFamilyData(family)
        return false
    }
    if (currentRanks.find(f => f.id != rankID && f.name == name)) {
        player.notify(player.user.LangString("index.217ed8d96242a204b35269f69c086b2e"), "error")
        tablet.updateFamilyData(family)
        return false;
    }
    currentRanks[rankIndex].name = name;
    currentRanks[rankIndex].rules = rankRules;

    family.ranks = currentRanks
    tablet.updateFamilyData(family)
    return true;
})
CustomEvent.registerCef("family:addrank", async(player:PlayerMp) => {
    if(!player.user || !player.user.family || !player.user.isFamilyLeader) return false;
    const rankID = system.timestamp
    const family = player.user.family

    const currentRanks = family.ranks
    if(currentRanks.find(r => r.id == rankID)) return false;
    currentRanks.splice(1, 0, {id: rankID, name: langStringDefault("index.f426f639ae74a3492df6be832e071ed6"), rules: []})

    family.ranks = currentRanks

    tablet.updateFamilyData(family)
    return true;
})


CustomEvent.registerCef("family:contract:get", async(player:PlayerMp, id: number) => {
    if(!player.user || !player.user.family || (!player.user.isFamilyLeader && !player.user.isFamilySubLeader)) return false;
    const family = player.user.family

    family.setContractActive(id)

    tablet.updateFamilyData(family)
    return true;
})


CustomEvent.registerCef("family:contract:drop", async(player:PlayerMp, id: number) => {
    if(!player.user || !player.user.family || (!player.user.isFamilyLeader && !player.user.isFamilySubLeader)) return false;
    const family = player.user.family

    menu.accept(player).then(status => {
        if (!status) return
        family.resetContracts()
        player.notify(player.user.LangString("index.d591445604443c877318bd8ee72b8fce"))
    })

    tablet.updateFamilyData(family)
    return true;
})

CustomEvent.registerCef("family:kick", (player, id) => {
    if(!player.user || !player.user.family) return false;
    player.user.family.playerKickPlayer(player, id)
})


CustomEvent.registerCef("family:setRank", (player, id, rank) => {
    if(!player.user || !player.user.family) return false;
    player.user.family.playerSetRankPlayer(player, id, rank)
})

CustomEvent.registerCef("family:leaveFamily", (player) => {
    if(!player.user || !player.user.family) return false;
    player.user.family.playerLeaveFamily(player)
})


CustomEvent.registerCef("family:addDonateByPlayer", async (player, addDonate, type=0) => {
    if(!player.user || !player.user.family) return false;
    return await player.user.family.addDonateByPlayer(player, addDonate, type)
})



CustomEvent.registerCef("family:setCarRank", (player, vehicleId, rank) => {
    if(!player.user || !player.user.family) return false;
    const veh = Vehicle.get(vehicleId)
    if(!veh || !veh.familyOwner || veh.familyOwner != player.user.familyId) return;
    player.notify(player.user.LangString("index.1a0c3ec16964e4cf23e9f9a914958413", veh.name, player.user.family.getRank(rank).name))
    veh.fromRank = rank
})
