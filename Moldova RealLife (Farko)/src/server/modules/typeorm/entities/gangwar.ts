import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity({ name: "gang_war_entity" })
export class GangWarEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	/** ID зоны */
	@Column({ type: "int", default: 0 })
	zone: number;
	/** Владелец зоны (фракция) */
	@Column({ type: "int", default: 0 })
	owner: number;
}
