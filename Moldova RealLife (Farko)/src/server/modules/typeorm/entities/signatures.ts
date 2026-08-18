import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("signature_entity")
export class Signatures extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 80 })
  type: string;

  @Column({ type: "int" })
  userId: number;

  @Column({ type: "text" })
  signature: string;
}
