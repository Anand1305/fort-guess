import { getLeaderboard } from "./leaderboard.service";

export async function leaderboardController(page: number, limit: number) {
  return getLeaderboard(page, limit);
}
