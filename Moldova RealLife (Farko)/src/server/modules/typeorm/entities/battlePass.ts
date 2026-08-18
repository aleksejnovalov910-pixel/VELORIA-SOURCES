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
import type { IBasicTasksSave, ITaskSave } from "@/shared/battlePass/tasks";

@Entity({ name: "battle_pass_entity" })
export class BattlePassEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "int", default: 0 })
	exp: number;

	@ManyToOne((type) => UserEntity, {
		onDelete: "CASCADE",
	})
	@JoinColumn()
	user: UserEntity;

	@RelationId((entity: BattlePassEntity) => entity.user)
	userId: number;

	@Column({ type: "varchar", length: 50 })
	battlePassId: string;

	@Column({ type: "text" })
	receivedRewards: string;

	set receiveRewards(arr: number[]) {
		this.receivedRewards = JSON.stringify(arr);
	}

	get receiveRewards() {
		return JSON.parse(this.receivedRewards);
	}

	@Column({ type: "text" })
	globalTaskProgress: string;

	get globalTask(): ITaskSave {
		return JSON.parse(this.globalTaskProgress);
	}

	set globalTask(data) {
		this.globalTaskProgress = JSON.stringify(data);
	}

	@Column({ type: "text" })
	basicTasksProgress: string;

	set basicTasks(data) {
		this.basicTasksProgress = JSON.stringify(data);
	}

	get basicTasks(): IBasicTasksSave {
		return JSON.parse(this.basicTasksProgress);
	}

	@Column({ type: "int", default: 0 })
	expReward: number;
}
