import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { success, error } from "@/lib/response";
import { analyticsController } from "@/modules/analytics/analytics.controller";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return error("Unauthorized", 401);
    }

    const data = await analyticsController();
    return success(data);
  } catch (e: any) {
    return error("Failed to load analytics", 500);
  }
}
