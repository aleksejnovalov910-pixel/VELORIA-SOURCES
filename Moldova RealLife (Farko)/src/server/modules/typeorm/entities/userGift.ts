import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "user_gift_entity" })
export class UserGiftEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "int" })
	item_id: number;

	@Column({ type: "int" })
	userFromId: number;

	@Column({ type: "int" })
	userToId: number;
}
