import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import type { GameSession } from "./gamesession";

@Entity("forts")
export class Fort {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column()
  location!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "jsonb", default: [] })
  hints!: string[];

  @Column({ nullable: true })
  image_url!: string;

  @Column({ default: true })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(
    () => require("./gamesession").GameSession,
    (session: GameSession) => session.fort
  )
  sessions!: GameSession[];
}
