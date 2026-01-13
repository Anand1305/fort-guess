import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import type { User } from "./users";
import { Fort } from "./fort";
import type { Guess } from "./guess";


@Entity("game_sessions")
export class GameSession {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => require("./users").User, (user: User) => user.sessions)
  user!: User;

  @ManyToOne(() => Fort, (fort) => fort.sessions)
  fort!: Fort;

  @Column({ default: 0 })
  attempts_used!: number;

  @Column({ default: false })
  is_success!: boolean;

  @Column({ default: 0 })
  score!: number;

  @CreateDateColumn()
  started_at!: Date;

  @Column({ type: "timestamp", nullable: true })
  ended_at!: Date;

  @OneToMany(() => require("./guess").Guess, (guess: Guess) => guess.session)
  guesses!: Guess[];
}
