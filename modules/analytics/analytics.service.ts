import { AppDataSource } from "@/databse/data-source";
import { GameSession } from "@/databse/entities/gamesession";

export async function getAdminAnalytics() {
  const ds = AppDataSource();
  if (!ds.isInitialized) await ds.initialize();

  const repo = ds.getRepository(GameSession);

  const raw = await repo
    .createQueryBuilder("session")
    .innerJoin("session.user", "user")
    .where("session.ended_at IS NOT NULL")
    .select("COUNT(DISTINCT user.id)", "total_players")
    .addSelect("COUNT(session.id)", "total_games")
    .addSelect(
      "SUM(CASE WHEN session.is_success = true THEN 1 ELSE 0 END)",
      "total_wins"
    )
    .addSelect("AVG(session.score)", "avg_score")
    .getRawOne();

  const topPlayers = await repo
    .createQueryBuilder("session")
    .innerJoin("session.user", "user")
    .where("session.ended_at IS NOT NULL")
    .select("user.name", "name")
    .addSelect("SUM(session.score)", "score")
    .groupBy("user.id")
    .orderBy("score", "DESC")
    .limit(5)
    .getRawMany();

  return {
    stats: {
      totalPlayers: Number(raw.total_players),
      totalGames: Number(raw.total_games),
      totalWins: Number(raw.total_wins),
      avgScore: Number(raw.avg_score || 0),
    },
    topPlayers: topPlayers.map((p) => ({
      name: p.name,
      score: Number(p.score),
    })),
  };
}
