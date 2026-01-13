import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import type { GameSession } from "./gamesession";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password_hash!: string;

  @Column({ type: "enum", enum: ["ADMIN", "PLAYER"], default: "PLAYER" })
  role!: "ADMIN" | "PLAYER";

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(
    () => require("./gamesession").GameSession,
    (session: GameSession) => session.user
  )
  sessions!: GameSession[];
}
