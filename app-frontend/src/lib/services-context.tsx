"use client";

import React, { createContext, useContext, type ReactNode } from "react";

import {
    globalCircuitBreaker,
    type ToolCircuitBreaker,
} from "@/features/execution/domain/CircuitBreaker";
import { globalBlackboard, type Blackboard } from "@/features/memory/domain/Blackboard";
import { MissionRepository } from "@/repositories/MissionRepository";
import { SpecialistRepository } from "@/repositories/SpecialistRepository";
import { globalEventBus, type EventBus } from "@/utils/EventBus";

export interface ServicesContextType {
    eventBus: EventBus;
    circuitBreaker: ToolCircuitBreaker;
    blackboard: Blackboard;
    missionRepository: MissionRepository;
    specialistRepository: SpecialistRepository;
}

const ServicesContext = createContext<ServicesContextType | null>(null);

export function ServicesProvider({ children }: { children: ReactNode }) {
    // Instantiate repositories per-session boundary to avoid mutable static leakage
    const missionRepository = React.useMemo(() => new MissionRepository(), []);
    const specialistRepository = React.useMemo(() => new SpecialistRepository(), []);

    return (
        <ServicesContext.Provider
            value={{
                eventBus: globalEventBus,
                circuitBreaker: globalCircuitBreaker,
                blackboard: globalBlackboard,
                missionRepository,
                specialistRepository,
            }}
        >
            {children}
        </ServicesContext.Provider>
    );
}

export function useServices(): ServicesContextType {
    const context = useContext(ServicesContext);
    if (!context) {
        throw new Error("useServices must be used within a ServicesProvider");
    }
    return context;
}
