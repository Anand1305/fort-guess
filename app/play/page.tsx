"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  /* ---------------- START GAME ---------------- */

  const startGame = async () => {
    setGuess("");
    setLoading(true);
    setMessage(null);
    setGameOver(false);
    setGame(null); // Reset game state for new game

    const res = await fetch("/api/game/start", {
      method: "POST",
    });

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
      setMessage("Invalid guess");
      return;
    }

    const result = data.data;

    if (result.correct) {
      setMessage(`🎉 Correct! Your score: ${result.score}`);
      setGameOver(true);
      return;
    }

    // Update game state with new hints/attempts (if provided in response)
    if (result.hints !== undefined && result.attempts_left !== undefined) {
      setGame({
        ...game,
        hints: result.hints,
        attempts_left: result.attempts_left,
      });
    }

    if (result.game_over) {
      setMessage("❌ Game over. No attempts left.");
      setGameOver(true);
      return;
    }

    setGuess("");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Guess the Fort</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {!game ? (
            <Button onClick={startGame} disabled={loading}>
              {loading ? "Starting..." : "Start Game"}
            </Button>
          ) : (
            <>
              <img
                src={game.image_url}
                alt="Fort"
                className="rounded-md max-h-64 w-full object-cover"
              />

              <p>
                <strong>Location:</strong> {game.location}
              </p>

              <p>
                <strong>Description:</strong> {game.description}
              </p>

              <div>
                <strong>Hints:</strong>
                <ul className="list-disc ml-6 mt-2">
                  {game.hints.map((hint, i) => (
                    <li key={i}>{hint}</li>
                  ))}
                </ul>
              </div>

              <p>
                <strong>Attempts left:</strong> {game.attempts_left}
              </p>

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
                <Button onClick={startGame} disabled={loading}>
                  {loading ? "Starting..." : "Play Again"}
                </Button>
              )}
            </>
          )}

          {message && <p className="text-center font-medium mt-4">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
