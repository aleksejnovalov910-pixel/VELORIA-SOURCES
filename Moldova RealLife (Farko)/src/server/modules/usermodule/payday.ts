import { langStringDefault } from "../../../shared/lang";
import {playTimeX2Users, User} from "../user";
import {getX2Param} from "./static";
import {ADMIN_DATA, HELPER_PAYDAY_MONEY} from "../../../shared/admin.data";
import {system} from "../system";
import {
    DONATE_MONEY_NAMES,
    familyFractionPayDayRewardPercent,
    PAYDAY_MONEY_PER_HOUR_MULTIPLE,
    PLAYTIME_MONEY,
    PLAYTIME_TIME,
    PLAYTIME_TYPE,
    UNEMPLOYMENT_BENEFIT
} from "../../../shared/economy";
import {CustomEvent} from "../custom.event";
import {FamilyAddPointsAtPayDay} from "../families";
import {business} from "../business";
import {MoneyChestClass} from "../money.chest";
import {getZonesByOwner} from "../gangwar";
import {GANGWAR_ZONE_MONEY} from "../../../shared/gangwar";
import {PAYDAY_NEED_PLAY} from "../../../shared/payday";
import {
    CAR_FOR_PLAY_REWARD_MAX,
    LEVEL_FOR_PLAY_REWARD_MAX,
    MINUTES_FOR_PLAY_REWARD_MAX
} from "../../../shared/reward.time";
import {Vehicle} from "../vehicles";
import {inventory} from "../inventory";
import {OWNER_TYPES} from "../../../shared/inventory";
import {saveEntity} from "../typeorm";
import {FamilyContractList} from "../../../shared/family";
import {taxRun} from "../tax.system";
import {Family} from "../families/family";
import {fractionCfg} from "../fractions/main";

import dailyRewardController from "./dailyReward/dailyReward.controller";


CustomEvent.register("newHour", () => {
    payDayGlobal()
})


CustomEvent.register("newMinute", () => {
    const players = mp.players.toArray().filter(target => target.user && target.user.load);
    if (!getX2Param("playtime")) playTimeX2Users.data = [];
    players.map(player => {
        try {
            const user = player.user;
            if (getX2Param("playtime")) {
                if (!playTimeX2Users.data.find(q => q.id === player.user.account.id)) {
                    playTimeX2Users.insert({id: player.user.account.id, time: 1})
                } else {
                    const q = [...playTimeX2Users.data]
                    const ind = q.findIndex(s => s.id === player.user.account.id);
                    if (ind > -1) {
                        q[ind].time = q[ind].time + 1;
                        if (q[ind].time === PLAYTIME_TIME * 60) {
                            if (PLAYTIME_TYPE === "donate") {
                                player.user.addDonateMoney(PLAYTIME_MONEY, player.user.LangString("payday.13af424804652104f8a40ab229628501"))
                                player.user.account.save();
                            } else {
                                player.user.addMoney(PLAYTIME_MONEY, true, player.user.LangString("payday.446e65bf44af454900a3f37f754fcb53"));
                            }
                            player.outputChatBox(player.user.LangString("payday.59c7fa94bef99a2047f1f79fae8eebb1", PLAYTIME_TIME, PLAYTIME_TYPE === "donate" ? "" : "$", system.numberFormat(PLAYTIME_MONEY), PLAYTIME_TYPE === "donate" ? DONATE_MONEY_NAMES[2] : ""));
                        }
                    }
                }
            }
            if (user.afk) return;

            dailyRewardController.updateTime(player);

            if (getX2Param("playtimecar") && (user.level <= LEVEL_FOR_PLAY_REWARD_MAX || user.entity.playtimecar > 0)) {
                const MIN_NEED = mp.config.announce ? MINUTES_FOR_PLAY_REWARD_MAX : 10
                if (!user.account.playtimecar) {
                    if (user.entity.playtimecar === MIN_NEED) {
                            const cfg = Vehicle.getVehicleConfig(CAR_FOR_PLAY_REWARD_MAX)
                            if (cfg) {
                                user.notifyBig(user.LangString("payday.07900b611695d2e867aa8ac602e5e49a"), user.LangString("payday.7072c08fdb420804b1a4ba227825f1f4"))
                                player.outputChatBox(player.user.LangString("payday.520df2e2fe8491c375b9fe5ad27511e0"))
                                inventory.createItem({
                                    owner_type: OWNER_TYPES.PLAYER,
                                    owner_id: user.id,
                                    item_id: 866,
                                    advancedNumber: user.id,
                                    advancedString: 'veh|' + CAR_FOR_PLAY_REWARD_MAX
                                })
                                user.account.playtimecar = 1;
                                saveEntity(user.account)
                            }
                    } else if (user.entity.playtimecar < MIN_NEED) {
                        user.entity.playtimecar++;
                    }
                }
            }
            player.user.entity.played_time += 1;
            player.user.questTick();
            if (!User.playedTime.has(player.dbid)) {
                User.playedTime.set(player.dbid, 1);
            } else if (User.playedTime.get(player.dbid) < 60) {
                User.playedTime.set(player.dbid, User.playedTime.get(player.dbid) + 1);
            }
        } catch (e) {
            system.debug.error(`${e.name} ${e.message} ${e.stack}`);
        }
    })
    playTimeX2Users.save()
})

/** Обнулить счетчик отыгранного времени для тех кто отыграл 5+ часов*/
export const clearExpiredPlayTime = () => {
    if (!getX2Param("playtime")) return;
    
    const array = [...playTimeX2Users.data]
    array.map(user => {
        if (user.time >= PLAYTIME_TIME * 60) {
            const ind = playTimeX2Users.data.findIndex(s => s.id === user.id);
            playTimeX2Users.remove(ind);
        }
    })
    
    playTimeX2Users.save()
}

CustomEvent.register("newDay", clearExpiredPlayTime)

export const payDayGlobal = (check = true) => {
    system.debug.info(langStringDefault("payday.6de38bfff0ed084019b3b4551c429fb7"))
    let bonus_money = 0;
    let base_money = 0;
    let exp = 0;
    let donate_money = 0;

    fractionCfg.list.filter(q => q.mafia).map(fraction => {
        let addmoney = 0;
        business.data.filter(q => q.mafiaOwner == fraction.id).map(biz => {
            addmoney += Math.floor((((biz.price / 100) * familyFractionPayDayRewardPercent) / 24))
        })
        if (addmoney) {
            const safe = MoneyChestClass.getByFraction(fraction.id);
            if (safe) safe.money = safe.money + addmoney;
        }
    })

    fractionCfg.list.filter(q => q.gang).map(fraction => {
        let addmoney = getZonesByOwner(fraction.id).length * GANGWAR_ZONE_MONEY;
        if(addmoney){
            const safe = MoneyChestClass.getByFraction(fraction.id);
            if (safe) safe.money = safe.money + addmoney;
        }
    })

    const players = mp.players.toArray().filter(target => target.user);
    system.debug.info(langStringDefault("payday.959560146878d1a45767061d08f45cd0", players.length));
    players.map(player => {
        if (check && (!User.playedTime.has(player.dbid) || User.playedTime.get(player.dbid) < PAYDAY_NEED_PLAY)) {
            player.notify(player.user.LangString("payday.5f829d980abb878916dd942c7d7e3fe0", PAYDAY_NEED_PLAY), "error");
        } else if (check && player.user.afk) {
            player.notify(player.user.LangString("payday.0732f407a30edd39a4e259bdb9642ffe"), "error");
        } else {
            const res = player.user.payday();
            bonus_money += res.bonus_money;
            base_money += res.base_money;
            exp += res.exp;
            donate_money += res.donate_money;
        }
    })
    FamilyAddPointsAtPayDay(check)
    User.playedTime = new Map();
    if (players.length > 0) {
        system.debug.info(langStringDefault("payday.02f76931472842ad16016d5fd8623f22", system.numberFormat(base_money)));
        system.debug.info(langStringDefault("payday.cc28d084a259b7e9f3bc3234eda70217", system.numberFormat(bonus_money)));
        system.debug.info(langStringDefault("payday.bf289980e5da18c4bcef2aceee27ac9f", system.numberFormat(donate_money)));
        system.debug.info(langStringDefault("payday.d511e886a4ff594d1d406d747f8f5517", system.numberFormat(exp)));
    }
    system.debug.info(langStringDefault("payday.dc180d457015982a027e279ebdcfa660"))
}


export function userPayDay(user: User){
    let bonus_money = 0;
    let base_money = 0;
    let donate_money = 0;
    let bonus_money_text: string[] = []
    let base_money_text: string[] = []
    let cef_money_text: [string, number][] = []
    let exp = 1;
    if(getX2Param("exp")) exp += 1;
    if(getX2Param("exp3")) exp += 2;
    const cfgAdmin = ADMIN_DATA.find(q => q.level === user.admin_level)
    if (cfgAdmin) {
        bonus_money += cfgAdmin.money;
        bonus_money_text.push(user.LangString("payday.29a8a1e6508849faaf6b3d26c2a8e824", system.numberFormat(cfgAdmin.money)))
        cef_money_text.push([user.LangString("payday.c6cbff72c8ba64667a38ebd2c5744b73"), cfgAdmin.money])
        if (cfgAdmin.donate_money) donate_money += cfgAdmin.donate_money
    }
    if (user.helper) bonus_money += HELPER_PAYDAY_MONEY[user.helper_level - 1], bonus_money_text.push(user.LangString("payday.31301a55b97d1358266ecf69ba7ed0ab", system.numberFormat(HELPER_PAYDAY_MONEY[user.helper_level - 1]))), cef_money_text.push([user.LangString("payday.65414f02ecba213aa3083ba423bfda24"), HELPER_PAYDAY_MONEY[user.helper_level - 1]]);
    const cfgVip = user.vipData;
    if (cfgVip) {
        if (cfgVip.payday_money) bonus_money += cfgVip.payday_money, bonus_money_text.push(`VIP: $${system.numberFormat(cfgVip.payday_money)}`), cef_money_text.push(["VIP", cfgVip.payday_money]);
        if (cfgVip.payday_exp) exp += cfgVip.payday_exp;
    }

    if(!cfgAdmin){
        const cfgFraction = user.fractionData
        if (cfgFraction) {
            if (cfgFraction.moneybase) {
                base_money += cfgFraction.moneybase;
                base_money_text.push(user.LangString("payday.38c5321cb81d2b55435e8fd5321fe31b", cfgFraction.name, system.numberFormat(cfgFraction.moneybase)));
                cef_money_text.push([user.LangString("payday.1c26ae5b3d884ad70cca770d6d355f32", cfgFraction.name), cfgFraction.moneybase])
            }
            if (user.rank && fractionCfg.getRankSalary(user.fraction, user.rank)) {
                base_money += fractionCfg.getRankSalary(user.fraction, user.rank);
                base_money_text.push(user.LangString("payday.c40e2aaae8ec78cc356485080a01d5c6", fractionCfg.getRankName(user.fraction, user.rank), system.numberFormat(fractionCfg.getRankSalary(user.fraction, user.rank))));
                cef_money_text.push([user.LangString("payday.d26b5a58fb8ca466d6479924e3053e37", fractionCfg.getRankName(user.fraction, user.rank)), fractionCfg.getRankSalary(user.fraction, user.rank)])
            }
        }
    }

    if(!!user.family) {
        user.familyScores += 1
        user.family.addPoints(1)
        user.family.addContractValueIfExists(FamilyContractList.onliners, 1)
    }

    if(!base_money){
        user.achiev.achievTickByType("noWorkMoneySum", UNEMPLOYMENT_BENEFIT)
        base_money_text.push(user.LangString("payday.c251f8497640cddfaca0b222788a1885", system.numberFormat(UNEMPLOYMENT_BENEFIT)))
        cef_money_text.push([user.LangString("payday.18db4620482edb74e5ebdfc253354c50"), UNEMPLOYMENT_BENEFIT])
        base_money += UNEMPLOYMENT_BENEFIT;
    }

    const tm = user.getDaylyOnline
    if(tm){
        const tms = (base_money * PAYDAY_MONEY_PER_HOUR_MULTIPLE[tm]) - base_money
        if(tms > 0){
            base_money_text.push(user.LangString("payday.88f034d549c2bd9c7fc2da4c60f1446c", system.numberFormat(tms)))
            cef_money_text.push([user.LangString("payday.1b678e33b996d2be52fc1eb9449c0797"), tms])
            base_money += tms;
        }
    }


    if (base_money > 0 || bonus_money > 0) {
        const sender = user.LangString("payday.e64bbbee91467d1d2181d31e6fb0f6c5", base_money ? user.LangString("payday.6983fb606f376e8d6ff8308ab3c704f8") : "", base_money && bonus_money ? user.LangString("payday.4d1b12f75091e7f4b9c7a786aa79e653") : "", bonus_money ? (base_money ? user.LangString("payday.dfb469b83dbfdfdf9bf48bb5026a1a8c") : user.LangString("payday.da84a2a58fe9a4e88dbef67222a1b171")) : "");
        const text = user.LangString("payday.a4ce1fd783b08823c3546a82e5edc8c4", base_money ? user.LangString("payday.5f5dd2badb6ea0b21863390ae665e7ce") : "", user.LangString("payday.9260bd24c67d1c682bdab80aec39eb9c", base_money_text.join("<br/>")), bonus_money ? user.LangString("payday.37b823fd65561ca3040d22311055601a") : "", bonus_money_text.join("<br/>"));
        if (user.bank_number) {
            user.addBankMoney(base_money + bonus_money, false, text, sender);
        } else {
            // user.notifyWithPicture(sender, "PayDay", `${base_money ? 'Зарплата<br/>' : ''}${base_money_text.join('')}${bonus_money ? '<br/>Доходы<br/>' : ''}${bonus_money_text.join('')}`, 'diamond', 10000)
            user.addMoney(base_money + bonus_money, false, "PayDay")
        }
    }

    if (donate_money > 0) user.addDonateMoney(donate_money, "PayDay");
    if (exp > 0) user.giveExp(exp);

    CustomEvent.triggerCef(user.player, "hud:payday", user.level, user.exp, {
        money: base_money + bonus_money,
        exp,
        info: cef_money_text.map(q => {
            return {
                money: q[1],
                text: q[0],
            }
        })
    })

    return {bonus_money, base_money, exp, donate_money}
}
