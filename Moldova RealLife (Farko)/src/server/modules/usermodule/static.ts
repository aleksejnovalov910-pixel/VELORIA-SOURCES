import { langStringDefault } from "../../../shared/lang";
import {Vehicle} from "../vehicles";
import {system} from "../system";
import {addAdminStats} from "../admin.stats";
import {gui} from "../gui";
import {OWNER_TYPES} from "../../../shared/inventory";
import {houses} from "../houses";
import {UserDatingEntity, UserEntity} from "../typeorm/entities/user";
import {RpHistoryEntity} from "../typeorm/entities/rp_history";
import {DuelRatingEntity} from "../typeorm/entities/duel";
import {BankHistoryEntity} from "../typeorm/entities/bank_history";
import {phone} from "../phone";
import {CustomEvent} from "../custom.event";
import {AccountEntity} from "../typeorm/entities/account";
import {AlertType, DEFAULT_ALERT_TIME} from "../../../shared/alert";
import {weather} from "../weather";
import {playTimeX2Users, User } from "../user";
import { In } from "typeorm";
import {inventory} from "../inventory";
import {business} from "../business";
import {FileLogType} from "../../../shared/log";
import {NoSQLbase} from "../nosql";
import {payDayGlobal} from "./payday";
import {ItemEntity} from "../typeorm/entities/inventory";
import {PromocodeUseEntity} from "../typeorm/entities/promocodes";
import {dbconnection, saveEntity} from "../typeorm";
import {LogEntity} from "../typeorm/entities/log";
import {WarehouseEntity} from "../typeorm/entities/warehouse";
import { dbLogsConnection } from "../typeorm/logs"
import { Family } from "../families/family"
import { writeSpecialLog } from "../specialLogs"
import { DailyRewardEntity } from "./dailyReward/dailyreward.entity";
import { DailyRewardModelEntity } from "../typeorm/entities/dailyReward";

interface X2Data {
    donate: boolean,
    exp: boolean,
    job: boolean,
    playtime: boolean,
    enabledonate: boolean,
    playtimecar: boolean,
    taxes: boolean,
    donate3: boolean,
    exp3: boolean,
    logoff: boolean,
}

let int = setInterval(() => {
    if (User.x2func.data.length == 0) {
        User.x2func.insert({donate: false, exp: false, job: false, playtime: false, enabledonate: false, playtimecar: false, taxes: false, donate3: false, exp3: false, logoff: false});
        User.x2func.save()
        system.debug.info(langStringDefault("static.65e3458164d869d3ef123ad70af8c323"))
    } else {
        clearInterval(int);
    }
}, 5000)

export const getX2Param = (item: keyof X2Data) => {
    return !!User.x2func.data[0][item]
}



CustomEvent.registerClient("isOnVehicle", (player, status: boolean) => {
    player.isOnVeh = status;
})
CustomEvent.registerClient("setWalkstyle", (player, val: string) => {
    player.setVariable("walkstyle", val);
})

export class UserStatic {

    static x2func = new NoSQLbase<X2Data>("x2func");

    static getRpHistory(id: number, limit = 10) {
        return RpHistoryEntity.find({where: {user: {id}}, take: limit, order: {id: "DESC"}});
    }

    static get playedTimeDay(){
        return playTimeX2Users.data
    }
    static playedTime = new Map<number, number>();

    static async log(id: number, type: FileLogType, text: string, target?: PlayerMp | number) {

        const data = await User.getData(id);
        if (!data) return;
        let myData = `${data.rp_name} [${data.id}]`
        let targetData = ""
        if (target) {
            if (typeof target === "number") {
                let q = User.get(target);
                if (q) target = q;
            }
            targetData = typeof target === "number" ? langStringDefault("static.1642ce1a10bd6648829ca45faaa488ad", target) : `${target.user.name} [${target.user.id}]`
        }
        let resText = target ? langStringDefault("static.d7aa2e5158b936473238697c6af350bc", myData, targetData, text) : `${myData} - ${text}`;
        system.saveLog(type, resText)
    }

    static async addBankMoney(target: number, money: number, reason: string, iniciator: string, cashCan = true) {
        if (typeof money !== "number") return;
        if (money <= 0) return;
        const targetPl = this.get(target);
        if (targetPl) return targetPl.user.addBankMoney(money, false, reason, iniciator, cashCan);
        const data = await User.getData(target);
        if(!data) return;
        const bankHave = !!data.bank_number;
        if(!bankHave && !cashCan) return;
        if(bankHave){
            data.bank_money += money;
        } else {
            data.money += money;
        }
        await saveEntity(data);
        if(!bankHave) this.log(target, "addMoney", langStringDefault("static.bef7898585fd139f0f5c0a439ac7c7e1", system.numberFormat(money), reason))
        this.writeBankNotify(target, "add", money, reason, iniciator);
    }

    static async addMoney(target: number, money: number, reason: string) {
        if (typeof money !== "number") return;
        if (money <= 0) return;
        const targetPl = this.get(target);
        if (targetPl) return targetPl.user.addMoney(money, false, reason);
        const data = await User.getData(target);
        data.money += money;
        saveEntity(data);
        if (reason) this.log(target, "addMoney", langStringDefault("static.6605ae8b916ac6698de77d27b45b9d86", system.numberFormat(money), reason))
    }

    static get sockets() : Socket[]{
        return mp.players.toArray().filter(q => q.user && q.user.socket).map(q => q.user.socket)
    }

    static getBySocketID(id: string) : PlayerMp {
        return mp.players.toArray().find(q => q.user && q.user.socket && q.user.socketId === id);
    }

    static lastSave = new Map<number, number>();
    static writeRpHistory(user: number, text: string) {
        if (!text) return;
        if (text.length > 1000) text = text.slice(0, 1000);
        let record = new RpHistoryEntity();
        record.userId = user;
        record.text = text;
        record.time = system.timestamp;
        record.save();
    }

    /** Хранилище переведённых средств за сутки */
    static dayTransferMoney = new Map<number, number>();

    static async writeBankNotify(target: number | User | PlayerMp, type: "add" | "remove" | "reject", sum: number, reason: string, iniciator: string) {
        let data = typeof target === "number" ? await this.getData(target) : (target instanceof this ? target.entity : target.user.entity);
        let ent = new BankHistoryEntity();
        ent.user = data;
        ent.type = type;
        ent.bank_number = data.bank_number;
        ent.sum = sum;
        ent.text = reason.replace(/<br\/>/g, "||||");
        ent.time = system.timestamp;
        ent.target = iniciator;
        ent.ticket = system.generateTransaction()
        setTimeout(() => {
            ent.save();
        }, 1000)
        if (type === "add") {
            system.saveLog("addBankMoney", langStringDefault("static.87ae2bbd3cbffaf5ddd3aa07a5d47a47", data.id, data.bank_number, system.numberFormat(sum), reason, iniciator), data)
        } else if (type === "remove") {
            system.saveLog("removeBankMoney", langStringDefault("static.856a05cdc57dc43750ef5b52fdcb7d90", data.id, data.bank_number, system.numberFormat(sum), reason, iniciator), data)
        }
    }

    static async sendMoney(player: PlayerMp, sum: number, targetNumber: string) {
        const user = player.user;
        if (!user) return;
        let targetName: string;
        let targetId: number;
        if(!user.bank_have) return player.notify(player.user.LangString("static.4f9add3fccdce7531c794ca2c76286c1"), "error");
        if(user.bank_money < sum) return player.notify(player.user.LangString("static.ce5753c21021dbbceeab4f5bdecf6c5d"), "error"), user.bankLog("reject", sum, user.LangString("static.29289a633f7fd94bcee54184cf157d34", targetNumber), user.LangString("static.e720443181c546769a488fb28e29e497"));
        const targetPlayer = mp.players.toArray().find(q => mp.players.exists(q) && q.user && q.user.bank_number === targetNumber);
        let send = false;
        if (targetPlayer) {
            const tuser = targetPlayer.user
            const tarif = tuser.bank_tarif_max
            targetName = tuser.name
            targetId = tuser.id
            if (tuser.bank_money + sum > tarif) {
                player.notify(player.user.LangString("static.c9c59152cb0f15613f0550a80edfd54a"), "error");
                user.bankLog("reject", sum, user.LangString("static.460dddfb3998e3b0febc7e3fc2092114", targetName, targetId), user.LangString("static.727ec9a2025600443e7b4dd49048c61b"));
                tuser.bankLog("reject", sum, langStringDefault("static.cdb6292d0b8cfc13c9dca6ca00af5003", user.name, user.id), user.bank_number);
            } else {
                send = true;
                tuser.addBankMoney(sum, true, tuser.LangString("static.6723a55e8a6971426c495aa8dfc741bf", user.name, user.id), user.bank_number);
            }
        } else {
            return player.notify(player.user.LangString("static.8cf82bfd1c5b18eb9e0aa6b74c8d5630"), "error");
        }
        if (send) {
            user.removeBankMoney(sum, true, user.LangString("static.0a126b1533a8b05a228086d4a9ef320d", targetName, targetId), user.LangString("static.edbe367b6217782a27f018cafec64940"));
            CustomEvent.triggerCef(player, "phone:sendMoney:success")
        }
        setTimeout(() => {
            if (mp.players.exists(player) && player.phoneCurrent) phone.loadBankHistory(player)
        }, 5000)
    }

    static notifyToFraction(fraction: number, title: string, sender: string, message: string, notifPic: string, time: number = 8000) {
        this.filterByFraction(fraction).map(target => {
            target.user.notifyWithPicture(title, sender, message, notifPic, time)
        })
    }

    static notifyWithPictureToAll(title: string, sender: string, message: string, notifPic: string, time: number = 8000) {
        CustomEvent.triggerClients("showWithPicture", title, sender, message, notifPic, time)
    }

    static get(id: number) {
        if (typeof id !== "number") return;
        let usr = User.list.get(id);
        if (usr && usr.exists) return usr.player;
        return null;
    }

    static getData(id: number): Promise<UserEntity> {
        let onlineData = User.get(id);
        if (onlineData) return new Promise((resolve) => {
            resolve(onlineData.user.entity)
        })
        return UserEntity.findOne({where: {id}})
    }

    static getDatas(...id: number[]): Promise<UserEntity[]> {
        let res: UserEntity[] = id.filter(q => User.get(q)).map(q => User.get(q).user.entity);
        let offline = id.filter(q => !User.get(q));
        return new Promise(async (resolve) => {
            const datas = await UserEntity.find({
                where: {id: In(offline)}
            })
            if (datas) res.push(...datas)
            resolve(res)
        })
    }

    static getDataAccount(id: number): Promise<AccountEntity> {
        let onlineData = User.getByAccountId(id);
        if (onlineData) return new Promise((resolve) => {
            resolve(onlineData.user.account)
        })
        return AccountEntity.findOne({where: {id}})
    }

    static getByPlayer(player: PlayerMp) {
        if (!mp.players.exists(player)) return null;
        return player.user;
    }

    static getByAccountId(id: number) {
        return mp.players.toArray().find(q => q.user && q.user.account.id === id);
    }

    static userQuit(player: PlayerMp) {
        if (!player || !player.dbid) return;
        let usr = User.list.get(player.dbid);
        if (!usr) return;
        return usr.exit();
    }

    static create(player: PlayerMp, entity: UserEntity, account: AccountEntity, quest?: number) {
        return new User(player, entity, account, quest);
    }

    static remove(id: number): boolean {
        User.list.delete(id)
        return true;
    }

    static saveAll() {
        const users = [...User.list].map(q => q[1]).filter(q => q.exists).map(q => q.savePrepare());
        UserEntity.save(users)
        User.list.forEach((usr, id) => {
            if (!mp.players.exists(usr.player)) return User.list.delete(id);
            // usr.save();
        })
    }

    static initPlayerFunctions(player: PlayerMp) {
        player.notify = (text: string, type: AlertType = "info", img?: string, time = DEFAULT_ALERT_TIME) => {
            if (!mp.players.exists(player)) return;
            if (!player.dbid) return;
            CustomEvent.triggerCef(player, "cef:alert:setAlert", type, text, img, time)
        }
        player.notifyWithPicture = (title: string, sender: string, message: string, notifPic: string, time: number = 8000) => {
            if (!mp.players.exists(player)) return;
            if (!player.dbid) return;
            CustomEvent.triggerClient(player, "showWithPicture", title, sender, message, notifPic, time)
        }
        player.outputChatBox = (message) => {
            if (!mp.players.exists(player)) return;
            if (!player.dbid) return;
            CustomEvent.triggerCef(player, "cef:chat:message", message)
        }
        // player.notifyWithPicture(
        //     `Life Invader [${weather.getFullRpTime()}]`,
        //     '~y~Новости погоды',
        //     `${weather.getWeatherName(weather.weather)}\nТемпература воздуха: ~y~${Math.round(weather.temp)}°C`,
        //     'CHAR_LIFEINVADER'
        // );
    }

    static findByFraction(fraction: number) {
        return mp.players.toArray().find(target => target.user && target.user.fraction === fraction)
    }

    static filterByFraction(fraction: number) {
        return mp.players.toArray().filter(target => target.user && target.user.fraction === fraction)
    }

    static list = new Map<number, User>();

    static getNearestVehicle(player: PlayerMp, r = 5) {
        if (player.vehicle) return player.vehicle;
        let vehs = Vehicle.toArray().filter(veh => veh.dimension == player.dimension && player.dist(veh.position) <= r).sort((a, b) => {
            return player.dist(a.position) - player.dist(b.position)
        });
        if (vehs.length > 0) return vehs[0]
    }

    static getNearestVehicleByCoord(position: { x: number, y: number, z: number }, r = 5, dimension = 0) {
        let vehs = Vehicle.toArray().filter(veh => veh.dimension == dimension && veh.dist(position) <= r).sort((a, b) => {
            return system.distanceToPos(position, a.position) - system.distanceToPos(position, b.position)
        });
        if (vehs.length > 0) return vehs[0]
    }

    static getNearestPed(player: PlayerMp, r = 5) {
        let peds = mp.peds.toArray().filter(ped => ped.dimension == player.dimension && player.dist(ped.position) <= r).sort((a, b) => {
            return player.dist(a.position) - player.dist(b.position)
        });
        if (peds.length > 0) return peds[0]
    }

    static getNearestPeds(player: PlayerMp, r = 5) {
        return mp.peds.toArray().filter(ped => ped.dimension == player.dimension && player.dist(ped.position) <= r).sort((a, b) => {
            return player.dist(a.position) - player.dist(b.position)
        });
    }

    static getNearestPlayer(player: PlayerMp, r = 5) {
        let vehs = mp.players.toArray().filter(veh => veh.dimension == player.dimension && veh.id != player.id && player.dist(veh.position) <= r).sort((a, b) => {
            return player.dist(a.position) - player.dist(b.position)
        });
        if (vehs.length > 0) return vehs[0]
    }

    static getNearestPlayerByCoord(position: Vector3Mp, r = 5, dimension = 0) {
        return this.getNearestPlayersByCoord(position, r, dimension)[0]
    }

    static getNearestPlayersByCoord(position: Vector3Mp, r = 5, dimension = 0) {
        return mp.players.toArray().filter(veh => veh.dimension == dimension && veh.dist(position) <= r).sort((a, b) => {
            return a.dist(position) - b.dist(position)
        });
    }

    static getNearestVehicles(player: PlayerMp, r = 5) {
        let vehs = Vehicle.toArray().filter(veh => veh.dimension == player.dimension && player.dist(veh.position) <= r).sort((a, b) => {
            return player.dist(a.position) - player.dist(b.position)
        });
        return vehs
    }

    static getNearestPlayers(player: PlayerMp, r = 5, onlyVisible = false) {
        let vehs = mp.players.toArray().filter(veh => veh.dimension == player.dimension && veh.id != player.id && player.dist(veh.position) <= r && (!onlyVisible || veh.alpha > 10)).sort((a, b) => {
            return player.dist(a.position) - player.dist(b.position)
        });
        if (r == 0 && player.vehicle) vehs.filter(t => t.vehicle == player.vehicle);
        return vehs
    }

    static banUser = (id: number, admin: PlayerMp, reason: string, end: number) => {
        User.getData(id).then(usr => {
            if (!usr) return;
            if (!mp.players.exists(admin)) return;
            if (!admin.user) return;
            usr.ban_end = end;
            usr.ban_reason = reason;
            usr.fraction = 0;
            usr.rank = 0;
            usr.ban_admin = admin.dbid;
            admin.user.log("AdminBan", langStringDefault("static.6d2a8241fb6c4ac23684e69c8e3a568b", system.timeStampString(end), reason), usr.id);
            addAdminStats(admin.user.id, "ban")
            usr.save().then(() => {
                const target = User.get(id);
                if (target && mp.players.exists(target)) User.kickUser(target, langStringDefault("static.5cd164ed6aa0239eb11814d1b917d35d", system.timeStampString(end), reason), admin);
            })
        })
    }
    static banUserAccount = (id: number, admin: PlayerMp, reason: string, end: number) => {
        User.getDataAccount(id).then(usr => {
            if (!usr) return;
            if (!mp.players.exists(admin)) return;
            if (!admin.user) return;
            usr.ban_end = end;
            usr.ban_reason = reason;
            usr.ban_admin = admin.dbid;
            admin.user.log("AdminBan", langStringDefault("static.822389b428d10af8546572d501bc306a", id, system.timeStampString(end), reason));
            usr.save().then(() => {
                const target = mp.players.toArray().find(q => q.user && q.user.account.id === id);
                if (target && mp.players.exists(target)) User.kickUser(target, langStringDefault("static.cece2085181958104de741529a4f94f6", system.timeStampString(end), reason));
            })
        })
    }
    static kickUser = (player: PlayerMp, reason: string, who?:PlayerMp) => {
        if (!mp.players.exists(player)) return;
        if(player && mp.players.exists(player) && player.user){
            mp.players.toArray().filter(q => q.id !== player.id && q.user && (q.user.isAdminNow() || (q.dimension === player.dimension && system.distanceToPos(player.position, q.position) < 50))).map(target => {
                target.outputChatBox(target.user.LangString("static.327786fc154c62b56439fa4150f12c6b", gui.chat.getTime(), player.user.name, who ? target.user.LangString("static.889b18b9d260456040e483a9bdec9912", who.user.name, who.user.id) : target.user.LangString("static.188b65f5acb58f559435abe7c91c4ac4"), reason));
            })
        }
        player.outputChatBox(player.user.LangString("static.3fe16e1ab78082563ce0e12a385ea427", reason));
        player.kick(player.user.LangString("static.5f2f12288cd1d5bac5370875bb93e266", reason));
        system.debug.info(langStringDefault("static.a9012ce531b677ff623e2572d731cb6d", player.user ? `${player.user.name} #${player.user.id}` : langStringDefault("static.2a9fcbd47f56711c4c153b701ed5df6c"), reason));
    }

    static changeId(id: number, newid: number): Promise<boolean>{
        return new Promise(async resolve => {
            UserEntity.count({where: {
                id: newid
            }}).then(async count => {
                if(count > 0) return resolve(false);
                const target = User.get(id);
                if (target) {
                    User.kickUser(target, langStringDefault("static.4f5e69f1ab9fa1a2edf89d38a0b33c0a"));
                    await system.sleep(4000);
                }
                await this.clearPersonage(id);

                let data = (await UserEntity.findOne({relations: ["account"], where: {id}}));
                if(!data) return resolve(false)
                dbconnection.createQueryBuilder()
                    .update(UserEntity)
                    .set({ id: newid })
                    .where("id = :id", { id })
                    .execute()
                return resolve(true);
                // dbconnection.query("UPDATE `user_entity` SET `id` = ? WHERE `id` = ? LIMIT 1", [id, newid]).then(q => {
                //
                // })
                // console.log(data.id);
                // data.id = newid;
                // console.log(data.id);
                // saveEntity(data).then(q => {
                //     console.log(data.id);
                //     console.log(q.id);
                //     // console.log(q);
                //
                // })
                // return resolve(true);
            })
        })
    }

    static clearPersonage(id: number): Promise<boolean>{
        return new Promise(async resolve => {
            // const target = User.get(id);
            // if (target) {
            //     User.kickUser(target, 'Очистка персонажа');
            //     await system.sleep(4000);
            // }
            inventory.clearInventory(OWNER_TYPES.PLAYER, id);
            Vehicle.getPlayerVehicles(id).map(veh => veh.deleteFromDatabase());
            await PromocodeUseEntity.delete({user: {id}})
            const biz = business.getByOwner(id);
            if (biz) await business.setOwner(biz, null);
            const home = houses.dataArray.find(h => h.garageAccess(id))
            if (home) {
                if (home.userId === id) await houses.setOwner(home, null, false);
                else {
                    const d = [...home.residents];
                    d.splice(d.indexOf(id), 1);
                    home.residents = d;
                    home.save();
                }
            }
            await UserDatingEntity.delete({user: {id}});
            await UserDatingEntity.delete({target: {id}});
            await RpHistoryEntity.delete({user: {id}});
            // await AccountEntity.delete({ id: user.accountId });

            //await LogEntity.delete({userId: id});
            await BankHistoryEntity.delete({user: {id}});
            // await DailyRewardModelEntity.delete({ userId: id });
            // 🔥 fix pentru daily reward
            await DailyRewardModelEntity.createQueryBuilder()
            .delete()
            .where("userId = :id", { id })
            .execute();
            await DuelRatingEntity.delete({userId: id});
            const warehouse = WarehouseEntity.getByOwner(id);
            if(warehouse) await warehouse.setOwner(null)
            // UserEntity.remove(data)
            return resolve(true)
        })
    }
    static async deletepersonage(id: number) {
        const target = User.get(id);
        if (target) {
            User.kickUser(target, langStringDefault("static.98c6dbdb8e5ebdb34b522631cad12eb2"));
            await system.sleep(4000);
        }

        // stergi toate datele asociate
        if (!(await this.clearPersonage(id))) return false;

        // cauti user-ul inainte sa-l stergi ca sa iei accountId
        const character = await UserEntity.findOne({ where: { id } });
        if (character) {
            // stergi user-ul
            await UserEntity.delete({ id });

            // abia acum stergi account-ul
            await AccountEntity.delete({ id: character.accountId });
        }

        return true;
    }
}