import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	RelationId,
} from "typeorm";
import { UserEntity } from "./user";

@Entity({ name: "daily_reward_entity" })
export class DailyRewardModelEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	/** User relationship */
	@ManyToOne((type) => UserEntity, { eager: true })
	@JoinColumn()
	user: UserEntity;
	@RelationId((post: DailyRewardModelEntity) => post.user)
	userId: number;

	/** Current progress day (from 1 to 30) */
	@Column({ default: 1 })
	currentDay: number;

	/** Last reward date (timestamp) */
	@Column({ default: 0 })
	lastRewardDate: number;

	/** Progress reset date (timestamp) - 20:00 each day */
	@Column({ default: 0 })
	resetDate: number;

	/** Time spent in game today (in seconds) */
	@Column({ default: 0 })
	todayPlayTime: number;

	@Column({ default: false })
	isDayReached: boolean;

	/** Whether the reward for the current day has been claimed */
	@Column({ default: false })
	isRewardClaimed: boolean;

	/** List of claimed rewards (JSON string with an array of days) */
	@Column({ type: "varchar", length: 500, default: "[]" })
	claimedRewards: string;

	/** Array of all taked awards */
	@Column({ type: "varchar", length: 1000, default: "[]" })
	allTimeClaimedRewards: string;

	/** Maximum day */
	@Column({ default: 0 })
	maxRewardDayReached: number;

	/** Get the list of days for which rewards have been claimed */
	get claimedRewardsList(): number[] {
		return JSON.parse(this.claimedRewards || "[]");
	}

	/** Set the list of days for which rewards have been claimed */
	set claimedRewardsList(value: number[]) {
		this.claimedRewards = JSON.stringify(value);
	}

	get allTimeClaimedRewardsList(): number[] {
	    return JSON.parse(this.allTimeClaimedRewards || "[]");
	}

	set allTimeClaimedRewardsList(value: number[]) {
	    this.allTimeClaimedRewards = JSON.stringify(value);
	}

	getMaxRewardDayReached(): number {
		return this.maxRewardDayReached || 0;
	}
	setMaxRewardDayReached(day: number): void {
		this.maxRewardDayReached = day;
	}
}