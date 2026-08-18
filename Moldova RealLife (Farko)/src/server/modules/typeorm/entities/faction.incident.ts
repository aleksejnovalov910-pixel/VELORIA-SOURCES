import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, BaseEntity } from "typeorm";
import { UserEntity } from "./user";

@Entity("faction_incident")
export class FactionIncident extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  _usersId: string;

  @Column({ type: "int" })
  creatorId: number;

  @Column({ type: "varchar", length: 255 })
  _policeUsersId: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  orderTitle: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  orderTime: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  personsInvolved: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  policeOfficersInvolved: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  vehiclesInvolved: string;

  @Column({ type: "varchar", length: 1024, nullable: true })
  description: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  proofs: string;

  @Column({ type: "text", nullable: true })
  signature: string;

  @Column({ type: "timestamp" })
  createdAt: Date;

  get usersId() {
    return this._usersId.split(",");
  }

  get policeUsersId() {
    return this._policeUsersId.split(",");
  }

  set usersId(value: string[]) {
    this._usersId = value.join(",");
  }

  set policeUsersId(value: string[]) {
    this._policeUsersId = value.join(",");
  }
}
