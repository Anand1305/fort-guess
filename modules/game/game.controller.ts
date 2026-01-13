import { startGame, submitGuess } from "./game.service";
import { User } from "@/databse/entities/users";

export async function startGameController(user: User) {
  return startGame(user);
}

export async function submitGuessController(
  user: User,
  sessionId: string,
  guess: string
) {
  return submitGuess(user, sessionId, guess);
}
