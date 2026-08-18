import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { DONATE_STATUS } from "@/shared/economy";

@Entity({ name: "donate_entity" })
export class DonateEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	/** Сумма донат валюты */
	@Column({ type: "int", default: 0 })
	sum: number;

	/** Сумма донат валюты */
	@Column({ type: "int", default: 0 })
	account: number;

	/** Статус оплаты */
	@Column({ type: "int", default: 0 })
	status: DONATE_STATUS;

	/** Тип оплаты */
	@Column({ type: "varchar", default: "" })
	paytype: string;

	/** Тип оплаты */
	@Column({ type: "varchar", default: "" })
	paynumber: string;
}
