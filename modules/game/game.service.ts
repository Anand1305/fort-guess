import { AppDataSource } from "@/databse/data-source";
import { GameSession } from "@/databse/entities/gamesession";
import { Fort } from "@/databse/entities/fort";
import { Guess } from "@/databse/entities/guess";
import { User } from "@/databse/entities/users";

function normalize(text: string) {
  return text.trim().toLowerCase();
}

const MAX_ATTEMPTS = 3;
const SCORE_MAP = [100, 70, 50];

export async function startGame(user: User) {
  const ds = AppDataSource();

  const fortRepo = ds.getRepository(Fort);
  const sessionRepo = ds.getRepository(GameSession);

  const forts = await fortRepo.find({ where: { is_active: true } });
  if (forts.length === 0) throw new Error("NO_FORTS_AVAILABLE");

  const fort = forts[Math.floor(Math.random() * forts.length)];

  const session = sessionRepo.create({
    user,
    fort,
    attempts_used: 0,
    is_success: false,
  });

  await sessionRepo.save(session);

  // Ensure hints is an array
  const hints = Array.isArray(fort.hints) ? fort.hints : [];

  return {
    sessionId: session.id,
    image_url: fort.image_url,
    location: fort.location,
    description: fort.description,
    hints: hints.slice(0, 1),
    attempts_left: MAX_ATTEMPTS,
  };
}

export async function submitGuess(
  user: User,
  sessionId: string,
  guessText: string
) {
  try {
    const ds = AppDataSource();

    const sessionRepo = ds.getRepository(GameSession);
    const guessRepo = ds.getRepository(Guess);

    console.log("Looking for session:", sessionId);

    const session = await sessionRepo.findOne({
      where: { id: sessionId },
      relations: ["fort", "user"],
    });

    console.log("Session found:", !!session);
    console.log("Fort loaded:", !!session?.fort);
    console.log("User loaded:", !!session?.user);

    if (!session) throw new Error("SESSION_NOT_FOUND");
    if (!session.fort) throw new Error("FORT_NOT_LOADED");
    if (!session.user) throw new Error("USER_NOT_LOADED");
    if (session.user.id !== user.id) throw new Error("FORBIDDEN");
    if (session.ended_at) throw new Error("GAME_ALREADY_ENDED");

    const attemptNumber = session.attempts_used + 1;
    const isCorrect = normalize(guessText) === normalize(session.fort.name);

    console.log("Attempt:", attemptNumber, "Correct:", isCorrect);

    // Save the guess - Create a plain object to avoid cyclic dependency
    try {
      // Option 1: Use insert instead of save (bypasses relations entirely)
      await guessRepo.insert({
        session: { id: sessionId } as any,
        guess_text: guessText,
        attempt_number: attemptNumber,
        is_correct: isCorrect,
      });
      console.log("Guess saved successfully");
    } catch (err: any) {
      console.error("Failed to save guess:", err);
      throw new Error(`GUESS_SAVE_FAILED: ${err.message}`);
    }

    session.attempts_used = attemptNumber;

    // Ensure hints is an array
    const hints = Array.isArray(session.fort.hints) ? session.fort.hints : [];
    console.log("Hints array:", hints);

    if (isCorrect) {
      session.is_success = true;
      session.ended_at = new Date();
      session.score = SCORE_MAP[attemptNumber - 1] ?? 0;

      await sessionRepo.save(session);
      console.log("Game won, session updated");

      return { correct: true, game_over: true, score: session.score };
    }

    if (attemptNumber >= MAX_ATTEMPTS) {
      session.ended_at = new Date();
      session.score = 0;

      await sessionRepo.save(session);
      console.log("Game over, session updated");

      return {
        correct: false,
        game_over: true,
        attempts_left: 0,
        hints: hints,
      };
    }

    await sessionRepo.save(session);
    console.log("Session updated, game continues");

    return {
      correct: false,
      game_over: false,
      attempts_left: MAX_ATTEMPTS - attemptNumber,
      hints: hints.slice(0, attemptNumber + 1),
    };
  } catch (error: any) {
    console.error("Submit guess error:", error);
    console.error("Error stack:", error.stack);
    throw error;
  }
}
