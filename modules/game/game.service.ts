import { AppDataSource } from "@/databse/data-source";
import { GameSession } from "@/databse/entities/gamesession";
import { Fort } from "@/databse/entities/fort";
import { Guess } from "@/databse/entities/guess";
import { User } from "@/databse/entities/users";

function normalize(text: string) {
  return text.trim().toLowerCase();
}

export async function startGame(user: User) {
  const ds = AppDataSource();
  if (!ds.isInitialized) await ds.initialize();

  const fortRepo = ds.getRepository(Fort);
  const sessionRepo = ds.getRepository(GameSession);

  const forts = await fortRepo.find({ where: { is_active: true } });
  if (forts.length === 0) {
    throw new Error("NO_FORTS_AVAILABLE");
  }

  const fort = forts[Math.floor(Math.random() * forts.length)];

  const session = sessionRepo.create({
    user,
    fort,
    attempts_used: 0,
    is_success: false,
  });

  await sessionRepo.save(session);

  const MAX_ATTEMPTS = 3;

  return {
    sessionId: session.id,
    image_url: fort.image_url,
    location: fort.location,
    description: fort.description,
    hints: fort.hints.slice(0, 1),
    attempts_left: MAX_ATTEMPTS - session.attempts_used,
  };
}

export async function submitGuess(
  user: User,
  sessionId: string,
  guessText: string
) {
  console.log("Submit work?");
  const ds = AppDataSource();
  if (!ds.isInitialized) await ds.initialize();

  const sessionRepo = ds.getRepository(GameSession);
  const guessRepo = ds.getRepository(Guess);

  const session = await sessionRepo.findOne({
    where: { id: sessionId },
    relations: ["fort", "user"],
  });

  if (!session) throw new Error("SESSION_NOT_FOUND");
  if (session.user.id !== user.id) throw new Error("FORBIDDEN");
  if (session.ended_at) throw new Error("GAME_ALREADY_ENDED");

  const fort = session.fort;

  const MAX_ATTEMPTS = 3;
  const scoreMap = [100, 70, 50];

  const attemptNumber = session.attempts_used + 1;
  const isCorrect = normalize(guessText) === normalize(fort.name);

  await guessRepo.save(
    guessRepo.create({
      session,
      guess_text: guessText,
      attempt_number: attemptNumber,
      is_correct: isCorrect,
    })
  );

  session.attempts_used = attemptNumber;

  if (isCorrect) {
    session.is_success = true;
    session.ended_at = new Date();
    session.score = scoreMap[attemptNumber - 1] || 0;
    await sessionRepo.save(session);

    return {
      correct: true,
      score: session.score,
      game_over: true,
    };
  } else {
    if (session.attempts_used >= MAX_ATTEMPTS) {
      session.ended_at = new Date();
      session.score = 0;
      await sessionRepo.save(session);

      return {
        correct: false,
        game_over: true,
        attempts_left: 0,
        hints: fort.hints.slice(0, session.attempts_used),
      };
    } else {
      await sessionRepo.save(session);

      return {
        correct: false,
        game_over: false,
        attempts_left: MAX_ATTEMPTS - session.attempts_used,
        hints: fort.hints.slice(0, session.attempts_used + 1),
      };
    }
  }
}
