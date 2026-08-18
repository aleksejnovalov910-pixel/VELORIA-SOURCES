import { langStringDefault } from "../../../shared/lang";
import {BATTLE_PASS_SEASON, IBattlePassRating} from "../../../shared/battlePass/main";
import {IBattlePassSeason} from "../../../shared/battlePass/season";
import {BattlePassEntity} from "../typeorm/entities/battlePass";
import {CustomEvent} from "../custom.event";
import {system} from "../system";
import {RatingDTO, TaskDTO} from "../../../shared/battlePass/DTOs";
import {User} from "../user";
import {BaseTask} from "../../../shared/battlePass/tasks";
import {gui} from "../gui";
import {writeSpecialLog} from "../specialLogs";
import "./storage";
import {battlePassStorage} from "./storage";


class BattlePass {
    private _season: IBattlePassSeason;
    private _expInterval: number
    private _rating: Map<number, IBattlePassRating> = new Map<number, IBattlePassRating>();
    private _publicRating: RatingDTO[] = []
    private _randomExpSent: boolean = false

    constructor(season: IBattlePassSeason) {
        this._season = season;
        CustomEvent.registerCef("battlePass:buy", this.buyBattlePass)
        CustomEvent.registerCef("battlePass:openInterface", this.openInterfaceHandle);
        CustomEvent.registerClient("battlePass:openInterface", this.openInterfaceHandle);
        CustomEvent.register("battlePass:openInterface", this.openInterfaceHandle);
        CustomEvent.registerCef("battlePass:takeReward", this.takeRewardHandle);
        CustomEvent.registerCef("battlePass:buyLevels", this.buyLevels)
        CustomEvent.registerCef("battlePass:sendGiftPass", this.giftPass)
        CustomEvent.registerCef("battlePass:sendGiftLevels", this.giftLevels)
        CustomEvent.register("battlePass:setRating", this.setRating)
        gui.chat.registerCommand("bpexp", (player: PlayerMp, id, count) => this.giveAdminExp(player, id, count));

        this._expInterval = setInterval(() => this.expIntervalHandle(), 120000);

        setTimeout(() => this.init(), 5000);

        setInterval(() => this.updatePublicRating(), 10000);
    }

    private giveAdminExp(player: PlayerMp, id: string, count: string) {
        if (!player.user || !player.user.isAdminNow(6)) return;

        if (!id || !count) return;

        const target = User.get(parseInt(id));

        if (!target || !target.user) return player.notify(player.user.LangString("index.fab55cfc42b8de44cbf4e5609282f97c"), "error");
        if (!target.user.battlePass || !target.user.battlePass.battlePassEntity)
            return player.notify(player.user.LangString("index.38f40913fd79a4b5727afa79f9847417"), "error");

        const exp = parseInt(count);

        if (exp < 0 || exp > 9999) return player.notify(player.user.LangString("index.7d042feb4e3a249a83e982799aa1890b"), "error");

        target.user.battlePass.addExp(exp);
        writeSpecialLog(langStringDefault("index.c72bc2004be8ac32c9ee079d41d49f6d", exp), player, target.user.id);
    }

    private setRating = (staticId: number, name: string, exp: number) => {
        this._rating.set(staticId, {name, exp});
    }

    public saveAll() {
        const users = [...User.list.values()];
        for (let user of users) {
            if (user.battlePass && user.battlePass.battlePassEntity) {
                user.battlePass.battlePassEntity.save();
            }
        }
    }

    // private randomExpPrize = () => {
    //     if (this._randomExpSent) return;

    //     const date = new Date();

    //     if (this._season.randomExp.hour !== date.getHours() && this._season.randomExp.minute !== date.getMinutes())
    //         return;

    //     const players = mp.players.toArray().filter(player => {
    //         return !!(player && player.user && player.user.battlePass && player.user.battlePass.battlePassEntity);
    //     });

    //     if (players.length === 0) return;

    //     const winner = players[Math.floor(Math.random() * players.length)],
    //         user = winner.user,
    //         name = user.name;

    //     if (!user || !user.battlePass || !user.battlePass.battlePassEntity) return;

    //     this._randomExpSent = true;
    //     user.battlePass.addExp(this._season.randomExp.exp);

    //     players.forEach(player => {
    //         if (!player.user) return;

    //         player.outputChatBox(player.user.LangString("index.18c26b6751ebcaccaa74ba57f6ee87cd", name));
    //     })
    // }

    private async init() {
        const result = await BattlePassEntity.find({
            where: {
                battlePassId: this._season.id
            }
        })
        if (!result) return;

        result.forEach(async (el) => {
            const UserEntity = await User.getData(el.userId);
            this._rating.set(el.userId, {
                name: UserEntity.rp_name,
                exp: el.exp
            })
        });

        this.updatePublicRating();
    }

    private updatePublicRating = () => {
        // this.randomExpPrize();

        let array: RatingDTO[] = [];
        this._rating.forEach((el, key) => {
            array.push({
                id: key,
                name: el.name,
                exp: el.exp
            })
        })

        array = array.sort((a, b) => b.exp - a.exp)

        array.forEach((el, key) => {
            el.place = key;
        })
        this._publicRating = array;
    }

    private getRatingForPlayer(id: number): RatingDTO[] {
        const array: RatingDTO[] = [];
        let exist = false;

        this._publicRating.every((el, key) => {
            if (key > 9) return false;
            array.push(el);
            return true;
        })

        array.forEach((el) => {
            if (el.id === id) exist = true;
        })


        if (!exist) {
            const personalRating = this._publicRating.find(el => el.id === id);

            if (!personalRating) return array;

            array.push(personalRating);
        }

        return array;
    }

    private expIntervalHandle = () => {
        mp.players.forEach((player: PlayerMp) => {
            if (!player || !player.user || !player.user.battlePass || !player.user.battlePass.battlePassEntity) return;

            if (player.user.battlePass.haveEveryDayExp) return;

            if (player.user.stats.getDto().dailyOnline >= this._season.everyDayExp.time)
                player.user.battlePass.giveEveryDayExp();
        })
    }

    private giftLevels = async (player: PlayerMp, staticId: number, levels: number) => {
        if (player.user.battlePass && player.user.battlePass.isSpam()) return;
        const cost = levels * this._season.levelPrice;

        if (player.user.donate_money < cost)
            return player.user.notify(player.user.LangString("index.6606bc5a7680ec4378a95e0460baaa16"));

        let online = true,
            target = User.get(staticId)

        if (!target || !target.user) online = false;

        const userEntity = await User.getData(staticId)

        if (!userEntity) return player.notify(player.user.LangString("index.1862336ede7f7da4df25dfbbfa98e9a9"), "error");

        if (online) {
            if (target.user.battlePass.battlePassEntity === undefined)
                return player.notify(player.user.LangString("index.c8c06138d9cc3ea428ce0a5f251a924c"), "error");
            player.user.donate_money = player.user.donate_money - cost;

            target.user.battlePass.addExp(levels * this._season.levelExp);
            target.notify(target.user.LangString("index.17d64476c7ea68d6ac7fb97bd3b1ca5d", levels), "info");
        } else {
            const battlePassEntities = await BattlePassEntity.find({
                where: {
                    battlePassId: this._season.id,
                    user: {id: staticId}
                }
            });

            if (!battlePassEntities || !battlePassEntities[0])
                return player.notify(player.user.LangString("index.23f90ef29e168124ad118ac544c113a9"), "error");

            player.user.donate_money = player.user.donate_money - cost;

            battlePassEntities[0].exp = battlePassEntities[0].exp + levels * this._season.levelExp;

            battlePassEntities[0].save();

            const UserEntity = await User.getData(staticId);

            if (!UserEntity || !UserEntity.rp_name) return;

            this._rating.set(staticId, {name: UserEntity.rp_name, exp: battlePassEntities[0].exp})
        }

        player.notify(player.user.LangString("index.7ee6351f43b7abdbb6c95e7683e3a38b"));
        player.user.log("battlePass", langStringDefault("index.84b487c9d707d2a3b10650dda2924e49", levels), staticId);
    }

    private giftPass = async (player: PlayerMp, staticId: number) => {
        if (player.user.battlePass && player.user.battlePass.isSpam()) return;

        let cost: number;

        if (this._season.discount.expires > system.timestamp) {
            cost = this._season.discount.specialPrice;
        } else {
            cost = this._season.battlePassCost;
        }

        if (player.user.donate_money < cost)
            return player.notify(player.user.LangString("index.12b32ddc6817b5b7808148328bf9facb"), "error");

        let online = true,
            target = User.get(staticId)

        if (!target || !target.user) online = false;

        const userEntity = await User.getData(staticId)

        if (!userEntity) return player.notify(player.user.LangString("index.f62429432e0ed1d6e262e3a44a8f0387"), "error");

        if (online) {
            if (target.user.battlePass.battlePassEntity !== undefined)
                return player.notify(player.user.LangString("index.3dd9fd33702bc1fadfcf34116ef884cd"), "error");
            player.user.donate_money = player.user.donate_money - cost;

            target.user.battlePass.giftBattlePass();
            target.notify(target.user.LangString("index.829b08ff30276b969c29532a35712319"), "info");
        } else {
            const battlePassEntities = await BattlePassEntity.find({
                where: {
                    battlePassId: this._season.id,
                    user: {id: staticId}
                }
            });

            if (battlePassEntities && battlePassEntities[0])
                return player.notify(player.user.LangString("index.e3520120e936fbbd90c8ba4e2a53a1f2"), "error");

            player.user.donate_money = player.user.donate_money - cost;

            const battlePassEntity = BattlePassEntity.create({
                battlePassId: this._season.id,
                user: userEntity,
                receivedRewards: JSON.stringify([]),
                exp: 0,
                globalTaskProgress: JSON.stringify({taskId: 0, goalsCount: 0}),
                basicTasksProgress: JSON.stringify(player.user.battlePass.generateBasicTasksSave())
            });

            battlePassEntity.save();
            this._rating.set(staticId, {name: userEntity.rp_name, exp: 0});
        }

        player.notify(player.user.LangString("index.ce223d11040d53e369c2ab757cd37e1a"));
        player.user.log("battlePass", langStringDefault("index.c0c71df1beb9c4d73deeef631b5b8977"), staticId);

        //data = target && target.user ? target.user.entity : await User.getData(staticId);
    }

    private buyLevels = (player: PlayerMp, levels: number) => {
        if (!player || !player.user || !player.user.battlePass) return;
        player.user.battlePass.buyLevels(levels);
    }

    private takeRewardHandle = (player: PlayerMp, level: number) => {
        if (!player.user) return;
        if (!player.user.battlePass || !player.user.battlePass.battlePassEntity) return;
        if (Math.trunc(player.user.battlePass.battlePassEntity.exp / this._season.levelExp) < level + 1)
            return player.notify(player.user.LangString("index.73f1162b5cd29d21d81d2fa8ba8cd57e"), "error");
        player.user.battlePass.giveReward(level);
    }

    buyBattlePass = (player: PlayerMp) => {
        if (!player || !player.user || !player.user.battlePass) return;

        player.user.battlePass.buyBattlePass();
    }

    openInterfaceHandle = (player: PlayerMp) => {
        if (!player.user) return;

        if (player.user.battlePass.battlePassEntity) {
            const time = new Date(this._season.endTime * 1000),
                expires = `${(`0${time.getDate()}`).slice(-2)}.${ 
                    (`0${time.getMonth() + 1}`).slice(-2)}.${ 
                    time.getFullYear()} ${ 
                    (`0${time.getHours()}`).slice(-2)}:${ 
                    (`0${time.getMinutes()}`).slice(-2)}:${ 
                    (`0${time.getSeconds()}`).slice(-2)}`;

            player.user.setGui("battlePass", "battlePass:setComponent", "main");

            CustomEvent.triggerCef(player, "battlePass:setData", {
                exp: player.user.battlePass.battlePassEntity.exp,
                receivedRewards: player.user.battlePass.battlePassEntity.receiveRewards,
                battlePassExpires: expires,
                coins: player.user.donate_money,
                discountActive: this._season.discount.expires - system.timestamp > 5,
                everyDayExp: player.user.battlePass.haveEveryDayExp ? player.user.LangString("index.3dcabaf900972756b7ae7d91163e08bb")
                    :
                    player.user.LangString("index.2d1b63cc04a7fadcdba5644f652ef6fa", this._season.everyDayExp.time - player.user.stats.getDto().dailyOnline)
            });

            CustomEvent.triggerCef(player, "battlePass:setRating", this.getRatingForPlayer(player.user.id));
            battlePassStorage.updatePlayerStorage(player);

            const basic: TaskDTO[] = [];
            let globalTasks: TaskDTO;

            player.user.battlePass.basicTasks.map((el: BaseTask) => {
                basic.push({
                    exp: el.cfg.expReward,
                    name: el.cfg.name,
                    desc: el.cfg.desc,
                    progress: el.goalsCount,
                    goal: el.cfg.goal
                })
            })

            if (player.user.battlePass.globalTask?.cfg) {
                globalTasks = {
                    exp: player.user.battlePass.globalTask.cfg.expReward,
                    name: player.user.battlePass.globalTask.cfg.name,
                    desc: player.user.battlePass.globalTask.cfg.desc,
                    progress: player.user.battlePass.globalTask.goalsCount,
                    goal: player.user.battlePass.globalTask.cfg.goal
                };
            }

            if (globalTasks) {
                CustomEvent.triggerCef(player, "battlePass:setTasksData", {
                    global: globalTasks,
                    basic
                });
            } else {
                CustomEvent.triggerCef(player, "battlePass:setTasksData", {
                    basic
                });
            }
        } else {
            player.user.setGui("battlePass", "battlePass:setComponent", "purchase");
            battlePassStorage.updatePlayerStorage(player);
            CustomEvent.triggerCef(
                player,
                "battlePass:purchase",
                this._season.discount.expires - system.timestamp > 5 ?
                    {
                        coins: player.user.donate_money,
                        discountActive: true,
                        price: this._season.battlePassCost,
                        expires: this._season.discount.expires - system.timestamp,
                        discountPrice: this._season.discount.specialPrice
                    }
                    :
                    {
                        coins: player.user.donate_money,
                        discountActive: false,
                        price: this._season.battlePassCost
                    }
            );
        }
    }

}

export default new BattlePass(BATTLE_PASS_SEASON);