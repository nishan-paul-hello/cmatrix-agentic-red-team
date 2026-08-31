import { useEffect, useState } from "react";

import TeamManagerDashboardView from "@/features/specialists/components/TeamManagerDashboardView";
import {
    type SchedEntry,
    type SpecialistEntry,
    type VDGEntry,
} from "@/features/specialists/data/fixtures/teamDashboardMockData";
import { TeamDashboardRepository } from "@/features/specialists/data/TeamDashboardRepository";

export default function TeamManagerDashboardContainer() {
    const [ucbEntry, setUcbEntry] = useState<VDGEntry | null>(null);
    const [vdg, setVdg] = useState<VDGEntry[]>([]);
    const [specialists, setSpecialists] = useState<SpecialistEntry[]>([]);
    const [sched, setSched] = useState<SchedEntry[]>([]);

    useEffect(() => {
        void new TeamDashboardRepository()
            .fetchAll()
            .then((results) => {
                if (results.length > 0) {
                    const data = results[0];
                    setVdg(data.vdg);
                    setSpecialists(data.specialists);
                    setSched(data.sched);
                }
            })
            .catch(console.error);
    }, []);

    return (
        <TeamManagerDashboardView
            ucbEntry={ucbEntry}
            setUcbEntry={setUcbEntry}
            vdg={vdg}
            specialists={specialists}
            sched={sched}
        />
    );
}
