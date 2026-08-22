import { useState } from "react";

import FindingDetail from "@/features/findings/components/FindingDetail";
import FindingsList from "@/features/findings/components/FindingsList";
import { useFindingsData } from "@/features/findings/hooks/useFindingsData";

export default function FindingsDashboard() {
    const [page, setPage] = useState(1);
    const { detail, setDetail, findings, counts } = useFindingsData(page, 50);
    return detail ? (
        <FindingDetail f={detail} onBack={() => setDetail(null)} />
    ) : (
        <FindingsList
            findings={findings}
            counts={counts}
            onSelect={setDetail}
            page={page}
            setPage={setPage}
        />
    );
}
