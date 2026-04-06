"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, checkSetupStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if setup is complete
    const checkStatus = async () => {
      try {
        const isComplete = await checkSetupStatus();
        if (!isComplete) {
          // Setup not done, redirect to setup
          router.push("/setup");
        }
      } catch (error) {
        console.error("Failed to check setup status:", error);
      }
    };

    checkStatus();
  }, [checkSetupStatus, router]);

  useEffect(() => {
    // If already authenticated, redirect to home
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(username, password);
      // Redirect happens in the login function
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="matrix-rain"></div>

      <div className="bg-card border-primary/20 shadow-glow z-10 w-full max-w-md space-y-6 rounded-lg border p-8">
        <div className="text-center">
          <h1 className="text-primary mb-2 text-3xl font-bold">CMatrix Login</h1>
          <p className="text-muted-foreground">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="text-foreground mb-2 block text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-background border-primary/30 text-foreground focus:ring-primary/50 w-full rounded-md border px-4 py-2 focus:ring-2 focus:outline-none"
              placeholder="Enter username"
              required
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-foreground mb-2 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background border-primary/30 text-foreground focus:ring-primary/50 w-full rounded-md border px-4 py-2 focus:ring-2 focus:outline-none"
              placeholder="Enter password"
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50 w-full rounded-md px-4 py-2 font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
