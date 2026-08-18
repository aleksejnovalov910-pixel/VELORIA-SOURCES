import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, BaseEntity } from "typeorm";
import { UserEntity } from "./user";

@Entity("faction_criminal")
export class FactionCriminal extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  userId: number;

  @Column({ type: "varchar", length: 255 })
  _policeUsersId: string;

  @Column({ type: "varchar", length: 1024, nullable: false })
  description: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  proofs: string;

  @Column({ type: "text", nullable: false })
  signature: string;

  @Column({ type: "timestamp" })
  createdAt: Date;

  @Column({ type: "varchar", length: 255 })
  orderTime: string;

  @Column({ type: "boolean", default: false })
  paid: boolean;

  get policeUsersId() {
    return this._policeUsersId.split(",");
  }

  set policeUsersId(value: string[]) {
    this._policeUsersId = value.join(",");
  }
}
