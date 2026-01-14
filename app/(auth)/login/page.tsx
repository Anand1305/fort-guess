"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSession } from "next-auth/react";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  const res = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  setLoading(false);

  if (res?.error) {
    setError("Invalid email or password");
    return;
  }

  const session = await getSession();
  const role = (session?.user as any)?.role;

  if (role === "ADMIN") {
    router.replace("/forts");
  } else {
    router.replace("/play");
  }
};


  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="w-full bg-primary" disabled={loading} >
          {loading ? "Signing in..." : "Login"}
        </Button>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <span
            className="cursor-pointer underline"
            onClick={() => router.push("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
