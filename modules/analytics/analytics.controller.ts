import { getAdminAnalytics } from "./analytics.service";

export function analyticsController() {
  return getAdminAnalytics();
}
