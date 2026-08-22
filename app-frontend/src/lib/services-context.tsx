"use client";

import { createContext, useContext, type ReactNode } from "react";

import {
    globalCircuitBreaker,
    type ToolCircuitBreaker,
} from "@/features/execution/domain/CircuitBreaker";
import { globalBlackboard, type Blackboard } from "@/features/memory/domain/Blackboard";
import { globalEventBus, type EventBus } from "@/utils/EventBus";

export interface ServicesContextType {
    eventBus: EventBus;
    circuitBreaker: ToolCircuitBreaker;
    blackboard: Blackboard;
}

const ServicesContext = createContext<ServicesContextType | null>(null);

export function ServicesProvider({ children }: { children: ReactNode }) {
    return (
        <ServicesContext.Provider
            value={{
                eventBus: globalEventBus,
                circuitBreaker: globalCircuitBreaker,
                blackboard: globalBlackboard,
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
