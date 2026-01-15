export const runtime = "nodejs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { success, error } from "@/lib/response";
import { submitGuessController } from "@/modules/game/game.controller";
import { AppDataSource } from "@/databse/data-source";
import { User } from "@/databse/entities/users";

export async function POST(req: Request) {
  try {
    console.log("=== GUESS REQUEST START ===");

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log("Unauthorized - no session");
      return error("Unauthorized", 401);
    }

    console.log("User email:", session.user.email);

    const body = await req.json();
    console.log("Request body:", body);

    const { sessionId, guess } = body;

    if (!sessionId || !guess) {
      console.log("Invalid request - missing sessionId or guess");
      return error("Invalid request", 400);
    }

    const ds = AppDataSource();
    console.log("DataSource initialized:", ds.isInitialized);

    if (!ds.isInitialized) {
      console.log("Initializing DataSource...");
      await ds.initialize();
      console.log("DataSource initialized successfully");
    }

    const user = await ds.getRepository(User).findOne({
      where: { email: session.user.email },
    });

    if (!user) {
      console.log("User not found in database");
      return error("User not found", 404);
    }

    console.log("User found:", user.id);
    console.log("Calling submitGuessController...");

    const result = await submitGuessController(user, sessionId, guess);

    console.log("Result:", result);
    console.log("=== GUESS REQUEST SUCCESS ===");

    return success(result);
  } catch (e: any) {
    console.error("=== GUESS REQUEST ERROR ===");
    console.error("Error message:", e.message);
    console.error("Error stack:", e.stack);
    console.error("Full error:", e);

    return error(
      process.env.NODE_ENV === "production"
        ? e.message
        : `${e.message} | Stack: ${e.stack}`,
      400
    );
  }
}
