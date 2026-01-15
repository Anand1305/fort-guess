export const runtime = "nodejs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { success, error } from "@/lib/response";
import { startGameController } from "@/modules/game/game.controller";
import { AppDataSource } from "@/databse/data-source";
import { User } from "@/databse/entities/users";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return error("Unauthorized", 401);

    const ds = AppDataSource();
    if (!ds.isInitialized) await ds.initialize();

    const user = await ds.getRepository(User).findOne({
      where: { email: session.user.email },
    });

    if (!user) return error("User not found", 404);

    const data = await startGameController(user);
    return success(data);
  } catch (e: any) {
    return error(e.message, 400);
  }
}
