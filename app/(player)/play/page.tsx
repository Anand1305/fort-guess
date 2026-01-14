"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type GameState = {
  sessionId: string;
  image_url: string;
  description: string;
  location: string;
  hints: string[];
  attempts_left: number;
};

export default function PlayPage() {
  const [game, setGame] = useState<GameState | null>(null);
  const [guess, setGuess] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  /* ---------------- START GAME ---------------- */

  const startGame = async () => {
    setGuess("");
    setLoading(true);
    setMessage(null);
    setGameOver(false);
    setWon(false);
    setGame(null);

    const res = await fetch("/api/game/start", { method: "POST" });
    const data = await res.json();
    setLoading(false);

    if (!res.ok || !data.success) {
      setMessage(data.message || "Something went wrong");
      return;
    }

    setGame(data.data);
  };

  /* ---------------- SUBMIT GUESS ---------------- */

  const submitGuess = async () => {
    if (!game || !guess) return;

    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/game/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: game.sessionId,
        guess,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok || !data.success) {
      setMessage("❌ Invalid guess");
      return;
    }

    const result = data.data;

    if (result.correct) {
      setWon(true);
      setGameOver(true);
      setMessage(`You guessed it right! 🎉`);
      return;
    }

    if (result.hints && result.attempts_left !== undefined) {
      setGame({
        ...game,
        hints: result.hints,
        attempts_left: result.attempts_left,
      });
    }

    if (result.game_over) {
      setGameOver(true);
      setMessage("Better luck next time!");
      return;
    }

    setGuess("");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            🏰 Guess the Fort
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {!game ? (
            <div className="text-center">
              <Button onClick={startGame} disabled={loading}>
                {loading ? "Starting..." : "Start Game"}
              </Button>
            </div>
          ) : (
            <>
              {/* IMAGE */}
              <img
                src={game.image_url}
                alt="Fort"
                className="rounded-lg max-h-64 w-full object-cover border"
              />

              {/* META */}
              <div className="grid gap-2">
                <p>
                  <strong>📍 Location:</strong> {game.location}
                </p>
                <p>
                  <strong>📝 Description:</strong> {game.description}
                </p>
              </div>

              {/* ATTEMPTS */}
              <div className="flex justify-between items-center">
                <Badge
                  variant={
                    game.attempts_left <= 1 ? "destructive" : "secondary"
                  }
                >
                  Attempts left: {game.attempts_left}
                </Badge>
              </div>

              {/* HINTS */}
              <div>
                <h3 className="font-semibold mb-2">💡 Hints Unlocked</h3>
                <div className="grid gap-2">
                  {game.hints.map((hint, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-md bg-muted border text-sm"
                    >
                      <strong>Hint {i + 1}:</strong> {hint}
                    </div>
                  ))}
                </div>
              </div>

              {/* INPUT / RESULT */}
              {!gameOver ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter fort name"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                  />
                  <Button onClick={submitGuess} disabled={loading}>
                    Guess
                  </Button>
                </div>
              ) : (
                <div
                  className={`text-center p-4 rounded-lg ${
                    won
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <p className="text-lg font-semibold">
                    {won ? "🎉 You Won!" : "❌ Game Over"}
                  </p>
                  <p className="mt-1">{message}</p>

                  <Button
                    className="mt-4"
                    onClick={startGame}
                    disabled={loading}
                  >
                    Play Again
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
