import { useEffect, useState } from "react";

import { type TrajStep } from "@/features/trajectory/data/fixtures/trajectoryMockData";
import { TrajectoryRepository } from "@/features/trajectory/data/TrajectoryRepository";
import { globalEventBus } from "@/utils/EventBus";
import { useFeatureFlag } from "@/utils/FeatureFlags";

export const TRAJECTORY_EVENT = "TRAJECTORY_EVENT";

export function useTrajectoryFeed() {
    const [steps, setSteps] = useState<TrajStep[]>([]);
    const liveEnabled = useFeatureFlag("ENABLE_LIVE_FEEDS");

    useEffect(() => {
        // Load initial mock data
        void TrajectoryRepository.getAll().then((data) => setSteps(data));

        // Subscribe to live events
        if (!liveEnabled) {
            return;
        }

        const unsubscribe = globalEventBus.subscribe<TrajStep>(TRAJECTORY_EVENT, (newStep) => {
            setSteps((prev) => [...prev, newStep]); // append to bottom
        });

        return unsubscribe;
    }, [liveEnabled]);

    return steps;
}
