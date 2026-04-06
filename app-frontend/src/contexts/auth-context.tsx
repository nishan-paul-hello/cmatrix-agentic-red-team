"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiConfig } from "@/config/api.config";

interface User {
  id: number;
  username: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  setup: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkSetupStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const API_BASE_URL = apiConfig.baseUrl;

  const fetchCurrentUser = useCallback(
    async (authToken: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem("auth_token");
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.warn("Auth check failed:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    },
    [API_BASE_URL]
  );

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setToken(storedToken);

      fetchCurrentUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, [fetchCurrentUser]);

  const checkSetupStatus = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/setup/status`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.is_complete;
    } catch (error) {
      console.error("Failed to check setup status:", error);
      return false;
    }
  }, [API_BASE_URL]);

  const setup = useCallback(
    async (username: string, password: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/setup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Setup failed");
        }

        const { access_token } = await response.json();
        localStorage.setItem("auth_token", access_token);
        setToken(access_token);

        await fetchCurrentUser(access_token);
        router.push("/");
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw err;
        }
        throw new Error("Setup failed");
      }
    },
    [API_BASE_URL, fetchCurrentUser, router]
  );

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username,
            password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Login failed");
        }

        const { access_token } = await response.json();
        localStorage.setItem("auth_token", access_token);
        setToken(access_token);

        await fetchCurrentUser(access_token);
        router.push("/");
      } catch (err: unknown) {
        if (err instanceof Error) {
          throw err;
        }
        throw new Error("Login failed");
      }
    },
    [API_BASE_URL, fetchCurrentUser, router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  const contextValue = React.useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      isLoading,
      login,
      setup,
      logout,
      checkSetupStatus,
    }),
    [user, token, isLoading, login, setup, logout, checkSetupStatus]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
