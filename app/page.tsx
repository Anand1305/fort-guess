"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted px-4">
      <div className="max-w-3xl w-full text-center space-y-10">
        {/* HERO */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            🏰 Fort Guess
          </h1>
          <p className="text-lg text-muted-foreground">
            Test your knowledge of Maharashtra’s historic forts. Guess the fort
            using clues, images, and hints.
          </p>
        </div>

        {/* FEATURES */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="text-2xl">🎯</div>
              <h3 className="font-semibold">Guess Smart</h3>
              <p className="text-sm text-muted-foreground">
                Limited attempts with hints unlocking step by step.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="text-2xl">🏆</div>
              <h3 className="font-semibold">Leaderboard</h3>
              <p className="text-sm text-muted-foreground">
                Compete with other players and climb the ranks.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="text-2xl">🛠️</div>
              <h3 className="font-semibold">Admin Control</h3>
              <p className="text-sm text-muted-foreground">
                Manage forts, analytics, and reports easily.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/play">
            <Button size="lg" className="w-full sm:w-auto">
              🎮 Play Game
            </Button>
          </Link>

          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              🔐 Login
            </Button>
          </Link>
        </div>

        {/* FOOTER */}
        <p className="text-xs text-muted-foreground">
          Built with Next.js, PostgreSQL, and ❤️ for history.
        </p>
      </div>
    </div>
  );
}
