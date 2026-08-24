"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MissionContextValue {
    activeMissionId: string;
    setActiveMissionId: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const MissionContext = createContext<MissionContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function MissionProvider({ children }: { children: ReactNode }) {
    const [activeMissionId, setActiveMissionIdRaw] = useState("CVE-001");

    const setActiveMissionId = useCallback((id: string) => {
        setActiveMissionIdRaw(id);
    }, []);

    return (
        <MissionContext.Provider value={{ activeMissionId, setActiveMissionId }}>
            {children}
        </MissionContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useMission(): MissionContextValue {
    const ctx = useContext(MissionContext);
    if (!ctx) {
        throw new Error("useMission must be used within MissionProvider");
    }
    return ctx;
}
