import { useEffect, useMemo, useState } from "react";

import { filterMissions, type MissionFilter } from "@/features/missions/utils";
import { MissionRepository } from "@/repositories/MissionRepository";
import { type Mission } from "@/types/domain-types";

export function useMissionsData() {
    const [filter, setFilter] = useState<MissionFilter>("ALL");
    const [missions, setMissions] = useState<Mission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        void MissionRepository.getMissions().then((data) => {
            setMissions(data);
            setIsLoading(false);
        });
    }, []);

    const filtered = useMemo(() => filterMissions(missions, filter), [missions, filter]);

    return { filter, setFilter, missions, isLoading, filtered };
}
