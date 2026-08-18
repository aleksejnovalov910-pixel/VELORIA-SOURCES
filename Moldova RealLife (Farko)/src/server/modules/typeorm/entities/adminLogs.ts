import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import type { chatDialogMessage } from "@/shared/chat";
import type { AdminStatsData, HelperStatsData } from "@/shared/admin.data";

@Entity({ name: "admin_dialog_entity" })
export class AdminDialogEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	/** Текст записи */
	@Column({ type: "varchar", length: 1024, default: "" })
	name: string;

	@Column({ type: "boolean", default: true })
	byAdmin: boolean;

	/** Время лога в формате UNIX TIMESTAMP */
	@Column({ type: "int", default: 0 })
	time: number;

	@Column({ type: "int", default: 0 })
	creator: number;

	/** Массив сообщений JSON */
	@Column({ type: "varchar", length: 4096, default: "" })
	messages: string;

	public set setMessages(val: chatDialogMessage[]) {
		this.messages = JSON.stringify(val);
	}
}

@Entity({ name: "admin_stat_entity" })
export class AdminStatEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	/** Время лога в формате UNIX TIMESTAMP */
	@Column({ type: "int", default: 0 })
	time: number;

	/** Массив сообщений JSON */
	@Column({ type: "varchar", length: 4096, default: "" })
	data: string;

	public set setData(val: AdminStatsData[] | HelperStatsData[]) {
		this.data = JSON.stringify(val);
	}
}
