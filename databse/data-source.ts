import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/users";
import { Fort } from "./entities/fort";
import { GameSession } from "./entities/gamesession";
import { Guess } from "./entities/guess";

let dataSource: DataSource;

export const AppDataSource = () => {
  if (!dataSource) {
    dataSource = new DataSource({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      // 🔒 Neon requires SSL
      ssl: {
        rejectUnauthorized: false,
      },

      synchronize: true, // OK for assignment
      logging: false,
      entities: [User, Fort, GameSession, Guess],
    });
  }

  return dataSource;
};
