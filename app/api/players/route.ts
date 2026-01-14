import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppDataSource } from "@/databse/data-source";
import { User } from "@/databse/entities/users";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const ds = AppDataSource();
  if (!ds.isInitialized) await ds.initialize();

  const players = await ds.getRepository(User).find({
    where: { role: "PLAYER" },
    select: ["id", "name"],
  });

  return Response.json({ success: true, data: players });
}
