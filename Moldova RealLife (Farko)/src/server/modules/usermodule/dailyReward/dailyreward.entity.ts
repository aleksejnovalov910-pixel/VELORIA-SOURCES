import { User } from "../../user";
import { DailyRewardModelEntity } from "../../typeorm/entities/dailyReward";
import { systemUtil } from "../../../../shared/system";
import { RewardType, DailyRewardInfo, DAILY_REWARDS, REQUIRED_PLAY_TIME, RESET_HOUR, MAX_DAYS } from "../../../../shared/dailyRewards";
import type { VipId } from "../../../../shared/vip";
import { getVehicleConfig, Vehicle } from "../../vehicles";
import { VEHICLE_FUEL_TYPE } from "../../../../shared/vehicles";
import { houses } from "../../houses";
import { parking } from "../../businesses/parking";
import { system } from "../../../../cef/modules/system";

export class DailyRewardEntity {
    static all = new Map<PlayerMp, DailyRewardEntity>();
    private user: User;
    private rewardEntity: DailyRewardModelEntity | null = null;

    constructor(user: User) {
        this.user = user;
        user.afterLoginEvents.push(this.load.bind(this));

        DailyRewardEntity.all.set(user.player, this);
    }

    /**
     * Проверяет и обновляет текущий день, если таймер истёк
     */
    private checkAndAdvanceDay(): void {
        if (!this.rewardEntity) return;
        const currentTime = systemUtil.timestamp;
        // Если время сброса прошло, всегда переносим на следующий день
        if (currentTime > this.rewardEntity.resetDate) {
            if (this.rewardEntity.currentDay >= MAX_DAYS) {
                this.rewardEntity.currentDay = 1;
                this.rewardEntity.setMaxRewardDayReached(0);
                this.rewardEntity.claimedRewardsList = [];
            } else {
                this.rewardEntity.currentDay += 1;
            }
            this.rewardEntity.isRewardClaimed = false;
            this.rewardEntity.isDayReached = false;
            this.rewardEntity.todayPlayTime = 0;
            this.rewardEntity.resetDate = this.calculateNextResetDate();
            this.rewardEntity.save();

            return;
        }

        if (this.rewardEntity.todayPlayTime >= REQUIRED_PLAY_TIME && !this.rewardEntity.isDayReached) {
            this.rewardEntity.currentDay += 1;
            
            // if (this.rewardEntity.currentDay > MAX_DAYS) {
                // this.rewardEntity.currentDay = 1;
                // this.rewardEntity.setMaxRewardDayReached(0);
                // this.rewardEntity.claimedRewardsList = [];
            // }
            // this.rewardEntity.isRewardClaimed = false;
            // this.rewardEntity.todayPlayTime = 0;
            // this.rewardEntity.save();

            this.rewardEntity.isDayReached = true;
            this.rewardEntity.save();
        }
    }

    private async load(): Promise<void> {
        const rewardEntities = await DailyRewardModelEntity.find({
            where: { user: { id: this.user.id } }
        });

        if (rewardEntities && rewardEntities[0]) {
            this.rewardEntity = rewardEntities[0];
            if (!this.rewardEntity.allTimeClaimedRewards) {
                this.rewardEntity.allTimeClaimedRewards = JSON.stringify([]);
                await this.rewardEntity.save();
            }
        } else {
            this.rewardEntity = DailyRewardModelEntity.create({
                user: this.user.entity,
                currentDay: 1,
                lastRewardDate: 0,
                resetDate: this.calculateNextResetDate(),
                todayPlayTime: 0,
                isRewardClaimed: false,
                claimedRewards: JSON.stringify([]),
                allTimeClaimedRewards: JSON.stringify([])
            });
            await this.rewardEntity.save();
        }

        this.checkAndAdvanceDay();
    }

    public setDay(day: number) {
        if (!this.rewardEntity) return;
        
        if (day < 1 || day > MAX_DAYS) {
            this.user.notify("Invalid day value. Day must be between 1 and " + MAX_DAYS, "error");
            return;
        }

        this.rewardEntity.currentDay = day;
        this.rewardEntity.todayPlayTime = REQUIRED_PLAY_TIME;
        this.rewardEntity.isRewardClaimed = false;
        this.rewardEntity.isDayReached = false;
        
        this.rewardEntity.save();
        
        this.user.notify(`Day set to ${day}. You can now claim this reward.`, "success");
    }

    private checkAndResetProgress(): void {
        if (!this.rewardEntity) return;

        const currentTime = systemUtil.timestamp;

        if (currentTime > this.rewardEntity.resetDate) {
            this.rewardEntity.currentDay = 1;
            this.rewardEntity.isRewardClaimed = false;
            this.rewardEntity.isDayReached = false;
            this.rewardEntity.todayPlayTime = 0;
            this.rewardEntity.resetDate = this.calculateNextResetDate();
            this.rewardEntity.save();
        }
    }

    private calculateNextResetDate(): number {
        const now = new Date();
        const resetDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            RESET_HOUR,
            0,
            0
        );

        if (now.getHours() >= RESET_HOUR) {
            resetDate.setDate(resetDate.getDate() + 1);
        }

        return Math.floor(resetDate.getTime() / 1000);
    }

    /**
     * Update play time
     * @param playTimeSeconds Play time in seconds
     */
    public updatePlayTime(playTimeSeconds: number): void {
        if (!this.rewardEntity) return;
        this.checkAndAdvanceDay();
        if (this.rewardEntity.isRewardClaimed || this.rewardEntity.isDayReached) return;
        this.rewardEntity.todayPlayTime += playTimeSeconds;
        this.rewardEntity.save();
    }

    public canClaimReward(id: number): boolean {
        if (!this.rewardEntity) return false;
        this.checkAndAdvanceDay();
        if (id < 1) return false;
        if (id > this.rewardEntity.currentDay) return false;
        if (id <= (this.rewardEntity.getMaxRewardDayReached() || 0)) return false;
        if (this.rewardEntity.claimedRewardsList.includes(id)) {
            return false;
        }
        if (id === this.rewardEntity.currentDay) {
            return this.rewardEntity.todayPlayTime >= REQUIRED_PLAY_TIME && !this.rewardEntity.isRewardClaimed && !this.rewardEntity.isDayReached;
        }
        return true;
    }

    public async claimReward(id: number): Promise<boolean> {
        if (!this.rewardEntity) return false;
        this.checkAndAdvanceDay();
        if (!this.canClaimReward(id)) {
            this.user.notify("Nu poti revendica premiul zilnic.", "error");
            return false;
        }

        const currentDay = this.rewardEntity.currentDay;
        const reward = DAILY_REWARDS[id];

        if (!reward) {
            this.user.notify("Nu exista premiu pentru ziua curenta.", "error");
            return false;
        }

        await this.giveReward(reward);

        this.rewardEntity.lastRewardDate = systemUtil.timestamp;

        const claimedList = this.rewardEntity.claimedRewardsList;
        claimedList.push(id);
        this.rewardEntity.claimedRewardsList = claimedList;

        const allTimeClaimed = this.rewardEntity.allTimeClaimedRewardsList;
        if (!allTimeClaimed.includes(id)) {
            allTimeClaimed.push(id);
            this.rewardEntity.allTimeClaimedRewardsList = allTimeClaimed;
        }

        if (id > (this.rewardEntity.getMaxRewardDayReached() || 0)) {
            this.rewardEntity.setMaxRewardDayReached(id);
        }

        if (id === currentDay) {
            this.rewardEntity.isRewardClaimed = true;
            this.rewardEntity.isDayReached = true;
            this.rewardEntity.todayPlayTime = 0;

            if (id >= MAX_DAYS) {
                this.rewardEntity.currentDay = 1;
                this.rewardEntity.setMaxRewardDayReached(0);
                this.rewardEntity.claimedRewardsList = [];
            } else {
                this.rewardEntity.currentDay = id + 1;
            }
        }

        await this.rewardEntity.save();
        return true;
    }

    /**
     * Give a reward to the player
     * @param reward Reward information
     */
    private async giveReward(reward: DailyRewardInfo): Promise<void> {
        switch (reward.type) {
            case RewardType.MONEY:
                this.user.money += reward.value as number;
                this.user.notify(`Ai primit ${reward.value}`, "success");
                break;

            case RewardType.COINS:
                this.user.donate_money += reward.value as number;
                this.user.notify(`Ai primit ${reward.value} SC`, "success");
                break;

            case RewardType.VIP:
                this.user.giveVip(reward.value as VipId, reward.days as number)
                this.user.notify(`Ai primit VIP ${reward.value} pentru ${reward.days} zile`, "success");
                break;

            case RewardType.PLAYTIME:
                /** TODO */
                this.user.entity.played_time += reward.value as number;
                this.user.save();
                const hours = Math.floor((reward.value as number) / 3600);
                this.user.notify(`Ai primit ${hours} ore de joc.`, "success");
                break;

            case RewardType.CUSTOM_BAG:
                this.user.giveItem(reward.value as number, false, false, 1)
                this.user.notify("Ai primit o geanta.", "success");
                break;

            case RewardType.DISCOUNT_SHOWROOM:
                this.user.giveItem(reward.value as number, false, false, 1);
                this.user.notify(`Ai primit o reducere de ${reward.discount}% in showroom.`, "success");
                break;

            case RewardType.DISCOUNT_SHOP:
                this.user.giveItem(reward.value as number, false, false, 1);
                this.user.notify(`Ai primit o reducere de ${reward.discount}% in magazinul 24/7`, "success");
                break;

            case RewardType.DISCOUNT_CLOTHES: 
                this.user.giveItem(reward.value as number, false, false, 1);
                this.user.notify(`Ai primit o reducere de ${reward.discount}% in magazinul de haine`, "success");
                break;

            case RewardType.EXP_BONUS:
                /** TODO */
                const expHours = Math.floor((reward.value as number) / 3600);
                this.user.notify(`Ai primit un bonus ${expHours} ore`, "success");
                break;


            case RewardType.VEHICLE:
                const vehConf = getVehicleConfig(reward.value as string);
                if (!vehConf) return this.user.notify("nu exista in configuratie.", "error");
                this.user.setGui(null);
                const air = vehConf.fuel_type === VEHICLE_FUEL_TYPE.AIR;
                let place = await Vehicle.selectParkPlace(this.user.player, air, false);
                if (!place) return this.user.notify("Nu aveti un loc de parcare", "error");

                const getParkPos = () => {
                    if (place.type === "house") {
                        return houses.getFreeVehicleSlot(
                            place.id,
                            vehConf.fuel_type === VEHICLE_FUEL_TYPE.AIR,
                        );
                    } else {
                        return parking.getFreeSlot(place.id);
                    }
                };

                const success = () => {
                    const pos = getParkPos();
                    const { x, y, z, d, h } = pos
                        ? pos
                        : { x: 0, y: 0, z: 0, d: Vehicle.fineDimension, h: 0 };
                    const conf = vehConf;
                    const shop = { donate: false, positions: [] };
                    const isFamilyMoney = false;

                    Vehicle.createNewDatabaseVehicle(
                        this.user.player,
                        vehConf.id,
                        { r: 0, g: 0, b: 0 },
                        { r: 0, g: 0, b: 0 },
                        new mp.Vector3(x, y, z),
                        h,
                        d,
                        vehConf.cost,
                        0,
                        false,
                    ).then(async (veh) => {
                        let freePoint = Vehicle.findFreeParkingZone(
                            new mp.Vector3(this.user.player.position.x, this.user.player.position.y, this.user.player.position.z),
                            200,
                        );
                        if (!freePoint) return;
                        veh.engine = false;
                        veh.locked = true;
                        if (freePoint) {
                            Vehicle.teleport(
                                veh.vehicle,
                                new mp.Vector3(freePoint.x, freePoint.y, freePoint.z),
                                freePoint.heading,
                                0,
                            );
                            veh.vehicle.usedAfterRespawn = true;
                            if (system.distanceToPos(shop.positions[0], freePoint) > 20)
                                this.user.setWaypoint(
                                    freePoint.x,
                                    freePoint.y,
                                    freePoint.z,
                                    this.user.LangString("autosalon.0aa6d528ad59700a75c06a42e664a17b"),
                                    true,
                                );
                        }
                    });
                };

                success();

                this.user.notify("Ai primit o masina Giulia.", "success");
                break;
        }

        this.user.log("dailyReward", `Premiul zilnic a fost revendicat ${this.rewardEntity?.currentDay}`);
    }

    public getProgressInfo(): any {
        if (!this.rewardEntity) return null;
        this.checkAndAdvanceDay();
        console.log(this.rewardEntity.currentDay, this.rewardEntity.lastRewardDate, this.rewardEntity.resetDate, this.rewardEntity.todayPlayTime, this.rewardEntity.isRewardClaimed, this.rewardEntity.claimedRewardsList, this.rewardEntity.allTimeClaimedRewardsList, this.rewardEntity.getMaxRewardDayReached())

        return {
            currentDay: this.rewardEntity.currentDay,
            lastRewardDate: this.rewardEntity.lastRewardDate,
            resetDate: this.rewardEntity.resetDate,
            todayPlayTime: this.rewardEntity.todayPlayTime,
            requiredPlayTime: REQUIRED_PLAY_TIME,
            isRewardClaimed: this.rewardEntity.isRewardClaimed,
            claimedRewards: this.rewardEntity.claimedRewardsList,
            allTimeClaimedRewards: this.rewardEntity.allTimeClaimedRewardsList,
            canClaimReward: this.canClaimReward(this.rewardEntity.currentDay),
            maxRewardDayReached: this.rewardEntity.getMaxRewardDayReached()
        };
    }

    /**
     * Get information about the reward for the specified day
     * @param day Day (from 1 to 30)
     */
    public getRewardInfo(day: number): DailyRewardInfo | null {
        return DAILY_REWARDS[day] || null;
    }
}