import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppDataSource } from "@/databse/data-source";
import { GameSession } from "@/databse/entities/gamesession";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const playerId = searchParams.get("playerId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const ds = AppDataSource();
  if (!ds.isInitialized) await ds.initialize();

  let qb = ds
    .getRepository(GameSession)
    .createQueryBuilder("session")
    .innerJoin("session.user", "user")
    .where("session.ended_at IS NOT NULL");

  if (playerId) {
    qb = qb.andWhere("user.id = :playerId", { playerId });
  }

  if (from) {
    qb = qb.andWhere("session.ended_at >= :from", { from });
  }

  if (to) {
    qb = qb.andWhere("session.ended_at <= :to", { to });
  }

  const rows = await qb
    .select("user.name", "player")
    .addSelect("session.score", "score")
    .addSelect("session.is_success", "success")
    .addSelect("session.ended_at", "ended_at")
    .orderBy("session.ended_at", "DESC")
    .getRawMany();

  const header = "Player,Score,Success,Ended At\n";
  const csv =
    header +
    rows
      .map((r) => `${r.player},${r.score},${r.success},${r.ended_at}`)
      .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=fort-guess-report.csv",
    },
  });
}
