import { gui } from "../../gui";
import { CustomEvent } from "../../custom.event";
import { DailyRewardEntity } from "./dailyreward.entity";

class DailyRewardController {
  constructor() {
    this.subscribeToEvents();
  }

  public getDailyRewardEntity(player: PlayerMp): DailyRewardEntity | undefined {
    // return Entity;
    return DailyRewardEntity.all.get(player);
  }

  public getDailyReward(player: PlayerMp): any {
    try {
      const rewards = this.getDailyRewardEntity(player)?.getProgressInfo();
      if (!rewards) return undefined;

      return rewards;
    }
    catch (e) {
      console.log(e);
      return undefined;
    }
  }

  private async claimRewardHandler(player: PlayerMp, id: number) {
    try {
      const entity = this.getDailyRewardEntity(player);
      if (!entity) return null;

      const reward = await entity.claimReward(id);
      if (!reward) return null;
    }
    catch (e) {
      console.log('Err in claim daily reward', e);
      return null;
    }
  }

  public updateTime(player: PlayerMp, time: number = 60) {
    try {
      const entity = this.getDailyRewardEntity(player);
      if (!entity) return null;

      entity.updatePlayTime(time);
    }
    catch (e) {
      console.log('Err in update daily reward time', e);
      return null;
    }
  }

  private playerQuitHandler(player: PlayerMp) {
    if (DailyRewardEntity.all.has(player)) DailyRewardEntity.all.delete(player);
  }

  private setDay(player: PlayerMp, day: number) {
    if (day < 1 || day > 30) return;

    const entity = this.getDailyRewardEntity(player);
    if (!entity) return null;

    entity.setDay(day);
  }

  private subscribeToEvents() {
    CustomEvent.registerCef("server:dailyrewards:claim", this.claimRewardHandler.bind(this))
    CustomEvent.registerCef("server::dailyrewards:get", this.getDailyReward.bind(this))
    mp.events.add("playerQuit", this.playerQuitHandler.bind(this));

    gui.chat.registerCommand("dailyday", (player: PlayerMp, day: string) => {
      this.setDay(player, parseInt(day));
    });
  }
}

export default new DailyRewardController();