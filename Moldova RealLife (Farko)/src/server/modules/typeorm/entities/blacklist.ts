import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "black_list_entity" })
export class BlackListEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	/** SocialClub Name */
	@Column({ type: "varchar", length: 100 })
	social_name: string;
	/** Кто внёс */
	@Column({ type: "varchar", length: 100 })
	admin: string;
	/** Причина */
	@Column({ type: "varchar", length: 500 })
	reason: string;
	/** Когда */
	@Column({ type: "int" })
	time: number;
}
