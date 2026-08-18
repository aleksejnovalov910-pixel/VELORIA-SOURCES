export abstract class QuestReward {
    abstract giveReward(player: PlayerMp): Promise<void>;
}