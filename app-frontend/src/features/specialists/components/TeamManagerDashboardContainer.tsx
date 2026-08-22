import { useEffect, useState } from "react";

import TeamManagerDashboardView from "@/features/specialists/components/TeamManagerDashboardView";
import {
    getTeamDashboardData,
    type SpecialistEntry,
    type VDGEntry,
} from "@/features/specialists/data/fixtures/teamDashboardMockData";

export default function TeamManagerDashboardContainer() {
    const [ucbEntry, setUcbEntry] = useState<VDGEntry | null>(null);
    const [vdg, setVdg] = useState<VDGEntry[]>([]);
    const [specialists, setSpecialists] = useState<SpecialistEntry[]>([]);
    const [sched, setSched] = useState<
        { step: string; node: string; ucb: number; eta: string; reason: string }[]
    >([]);

    useEffect(() => {
        void getTeamDashboardData().then((data) => {
            setVdg(data.vdg);
            setSpecialists(data.specialists);
            setSched(data.sched);
        });
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
