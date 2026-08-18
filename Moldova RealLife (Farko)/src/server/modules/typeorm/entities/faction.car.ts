import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, BaseEntity } from "typeorm";
import { UserEntity } from "./user";

@Entity("faction_car")
export class FactionCar extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  creatorId: number;

  @Column({type: "varchar", length: 12})
  carNumber: string;

  @Column({type: "json", nullable: true})
  elements: {[key: string]: boolean};

  @Column({type: "varchar", length: 1024})
  images: string;

  @Column({ type: "text", nullable: false })
  signature: string;

  @Column({ type: "timestamp" })
  createdAt: Date;
}
