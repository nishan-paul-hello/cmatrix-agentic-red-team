import { useEffect, useMemo, useState } from "react";

import { filterMissions, type MissionFilter } from "@/features/missions/utils";
import { useServices } from "@/lib/services-context";
import { type Mission } from "@/types/domain-types";

export function useMissionsData() {
    const [filter, setFilter] = useState<MissionFilter>("ALL");
    const [missions, setMissions] = useState<Mission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { missionRepository } = useServices();

    useEffect(() => {
        void missionRepository.fetchAll({ limit: 1000 }).then((data) => {
            setMissions(data);
            setIsLoading(false);
        });
    }, [missionRepository]);

    const filtered = useMemo(() => filterMissions(missions, filter), [missions, filter]);

    return { filter, setFilter, missions, isLoading, filtered };
}
