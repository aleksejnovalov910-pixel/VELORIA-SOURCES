import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "family_business_entity" })
export class FamilyBusiness extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar", length: 100 })
	name: string;

	@Column({ type: "varchar", length: 100 })
	position: string;

	@Column({ type: "int", default: 0 })
	familyOwner: number;
}
