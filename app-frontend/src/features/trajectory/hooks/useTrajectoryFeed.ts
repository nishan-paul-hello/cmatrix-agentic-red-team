import { useEffect, useState } from "react";

import { globalEventBus } from "@/utils/EventBus";

import { getTrajectorySteps, type TrajStep } from "../data/fixtures/trajectoryMockData";

export const TRAJECTORY_EVENT = "TRAJECTORY_EVENT";

export function useTrajectoryFeed() {
    const [steps, setSteps] = useState<TrajStep[]>([]);

    useEffect(() => {
        // Load initial mock data
        void getTrajectorySteps().then((data) => setSteps(data));

        // Subscribe to live events
        const unsubscribe = globalEventBus.subscribe<TrajStep>(TRAJECTORY_EVENT, (newStep) => {
            setSteps((prev) => [...prev, newStep]); // append to bottom
        });

        return unsubscribe;
    }, []);

    return steps;
}
