import React from "react";

import { useFindingsData } from "../hooks/useFindingsData";
import FindingDetail from "./FindingDetail";
import FindingsList from "./FindingsList";

export default function FindingsDashboard() {
    const { detail, setDetail } = useFindingsData();
    return detail ? (
        <FindingDetail f={detail} onBack={() => setDetail(null)} />
    ) : (
        <FindingsList onSelect={setDetail} />
    );
}
