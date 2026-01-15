export const runtime = "nodejs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { success, error } from "@/lib/response";
import { startGameController } from "@/modules/game/game.controller";
import { AppDataSource } from "@/databse/data-source";
import { User } from "@/databse/entities/users";

export async function POST() {
  try {
    console.log("=== START GAME REQUEST ===");

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log("Unauthorized - no session");
      return error("Unauthorized", 401);
    }

    console.log("User email:", session.user.email);

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
    console.log("Starting game...");

    const data = await startGameController(user);

    console.log("Game started successfully");
    console.log("Session ID:", data.sessionId);

    return success(data);
  } catch (e: any) {
    console.error("=== START GAME ERROR ===");
    console.error("Error message:", e.message);
    console.error("Error stack:", e.stack);

    return error(
      process.env.NODE_ENV === "production"
        ? e.message
        : `${e.message} | Stack: ${e.stack}`,
      400
    );
  }
}
