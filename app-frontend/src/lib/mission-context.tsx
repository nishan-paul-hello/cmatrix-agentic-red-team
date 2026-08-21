"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface MissionContextValue {
  activeMissionId: string;
  setActiveMissionId: (id: string) => void;
}

const MissionContext = createContext<MissionContextValue | null>(null);

export function MissionProvider({ children }: { children: ReactNode }) {
  const [activeMissionId, setActiveMissionId] = useState("CVE-001");

  return (
    <MissionContext.Provider value={{ activeMissionId, setActiveMissionId }}>
      {children}
    </MissionContext.Provider>
  );
}

export function useMission() {
  const ctx = useContext(MissionContext);
  if (!ctx) throw new Error("useMission must be used within MissionProvider");
  return ctx;
}
