import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MandateType } from "../../../../shared/mdt";

@Entity("faction_mandate")
export class FactionMandate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  creatorId: number;

  @Column({ type: "varchar", length: 255 })
  orderTime: string;
  
  @Column({ type: "varchar", length: 255 })
  _usersId: string;

  @Column({ type: "varchar", length: 255 })
  _personsInvolved: string;

  @Column({ type: "varchar", length: 24 })
  orderType: MandateType;

  @Column({ type: "varchar", length: 255 })
  address: string;

  @Column({ type: "varchar", length: 1024 })
  description: string;

  @Column({ type: "varchar", length: 255 })
  proofs: string;

  @Column({ type: "text" })
  signature: string;

  @Column({ type: "varchar", length: 255 })
  orderTitle: string;

  @Column({ type: "timestamp" })
  createdAt: Date;

  get usersId() {
    return JSON.parse(this._usersId);
  }

  set usersId(value: number[]) {
    this._usersId = JSON.stringify(value);
  }

  get personsInvolved() {
    return this._personsInvolved.split(",");
  }

  set personsInvolved(value: string[]) {
    this._personsInvolved = value.join(",");
  }
}
