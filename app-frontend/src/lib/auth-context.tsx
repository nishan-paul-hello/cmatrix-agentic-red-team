"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
    authenticated: boolean;
    role: "ANALYST" | "ADMIN" | null;
    login: () => void;
    logout: () => void;
    canApprove: (action: string) => boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [role] = useState<"ANALYST" | "ADMIN" | null>("ANALYST");

    const login = useCallback(() => {
        document.cookie = "auth=1; path=/; max-age=86400";
        setAuthenticated(true);
    }, []);
    const logout = useCallback(() => {
        document.cookie = "auth=; path=/; max-age=0";
        setAuthenticated(false);
    }, []);
    const canApprove = useCallback((_action: string) => true, []);

    return (
        <AuthContext.Provider value={{ authenticated, role, login, logout, canApprove }}>
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
