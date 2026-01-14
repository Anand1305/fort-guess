"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Player = {
  id: string;
  name: string;
};

type AnalyticsData = {
  stats: {
    totalPlayers: number;
    totalGames: number;
    totalWins: number;
    avgScore: number;
  };
  topPlayers: {
    name: string;
    score: number;
  }[];
};

export default function AdminReportsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const [playerId, setPlayerId] = useState<string | undefined>();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Load analytics
  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((res) => res.success && setAnalytics(res.data));
  }, []);

  // Load players
  useEffect(() => {
    fetch("/api/players")
      .then((res) => res.json())
      .then((res) => res.success && setPlayers(res.data));
  }, []);

  const downloadReport = () => {
    const params = new URLSearchParams();
    if (playerId) params.append("playerId", playerId);
    if (from) params.append("from", from);
    if (to) params.append("to", to);

    window.open(`/api/reports?${params.toString()}`, "_blank");
  };

  if (!analytics) {
    return <p className="text-sm text-muted-foreground">Loading reports…</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Admin Reports</h1>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Players" value={analytics.stats.totalPlayers} />
        <StatCard title="Total Games" value={analytics.stats.totalGames} />
        <StatCard title="Total Wins" value={analytics.stats.totalWins} />
        <StatCard
          title="Average Score"
          value={Math.round(analytics.stats.avgScore)}
        />
      </div>

      {/* CHART */}
      <Card>
        <CardHeader>
          <CardTitle>Top Players</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.topPlayers}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--primary))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="score" fill="#4f4765" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* FILTER + DOWNLOAD */}
      <Card>
        <CardHeader>
          <CardTitle>Download CSV Report</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Player filter */}
            <Select onValueChange={setPlayerId}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by player" />
              </SelectTrigger>
              <SelectContent>
                {players.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date filters */}
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <Button onClick={downloadReport}>Download CSV</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">{value}</CardContent>
    </Card>
  );
}
