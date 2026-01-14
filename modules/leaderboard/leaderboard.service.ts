import { AppDataSource } from "@/databse/data-source";
import { GameSession } from "@/databse/entities/gamesession";

export async function getLeaderboard(page: number, limit: number) {
  const ds = AppDataSource();
  if (!ds.isInitialized) await ds.initialize();

  const offset = (page - 1) * limit;
  const repo = ds.getRepository(GameSession);

  // total distinct players
  const total = await repo
    .createQueryBuilder("session")
    .innerJoin("session.user", "user")
    .where("session.ended_at IS NOT NULL")
    .select("COUNT(DISTINCT user.id)", "count")
    .getRawOne()
    .then((r) => Number(r.count));

  const rows = await repo
    .createQueryBuilder("session")
    .innerJoin("session.user", "user")
    .where("session.ended_at IS NOT NULL")
    .select("user.id", "user_id")
    .addSelect("user.name", "name")
    .addSelect("COUNT(session.id)", "games_played")
    .addSelect(
      "SUM(CASE WHEN session.is_success = true THEN 1 ELSE 0 END)",
      "wins"
    )
    .addSelect("SUM(session.score)", "total_score")
    .groupBy("user.id")
    .orderBy("total_score", "DESC")
    .offset(offset)
    .limit(limit)
    .getRawMany();

  const items = rows.map((row, index) => ({
    rank: offset + index + 1,
    name: row.name,
    gamesPlayed: Number(row.games_played),
    wins: Number(row.wins),
    totalScore: Number(row.total_score),
  }));

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
