import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { GameSession } from "../entities/gamesession";

@Entity("guesses")
export class Guess {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => GameSession, (session) => session.guesses)
  session!: GameSession;

  @Column()
  guess_text!: string;

  @Column()
  attempt_number!: number;

  @Column()
  is_correct!: boolean;

  @CreateDateColumn()
  created_at!: Date;
}
