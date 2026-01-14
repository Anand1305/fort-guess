import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { success, error } from "@/lib/response";
import { leaderboardController } from "@/modules/leaderboard/leaderboard.controller";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return error("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    const data = await leaderboardController(page, limit);
    return success(data);
  } catch (e: any) {
    return error(e.message || "Failed to load leaderboard", 500);
  }
}
