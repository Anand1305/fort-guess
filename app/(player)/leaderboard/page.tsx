"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LeaderboardItem = {
  rank: number;
  name: string;
  gamesPlayed: number;
  wins: number;
  totalScore: number;
};

type ApiResponse = {
  items: LeaderboardItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function LeaderboardPage() {
  const [rows, setRows] = useState<LeaderboardItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 10;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?page=${page}&limit=${limit}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const data: ApiResponse = res.data;
          setRows(data.items);
          setTotalPages(data.totalPages);
        }
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">
            Loading leaderboard...
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>Games</TableHead>
                  <TableHead>Wins</TableHead>
                  <TableHead>Total Score</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                )}

                {rows.map((row) => (
                  <TableRow key={row.rank}>
                    <TableCell>{row.rank}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.gamesPlayed}</TableCell>
                    <TableCell>{row.wins}</TableCell>
                    <TableCell>{row.totalScore}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={p === page}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
