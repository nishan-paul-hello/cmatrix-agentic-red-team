import FindingDetail from "@/features/findings/components/FindingDetail";
import FindingsList from "@/features/findings/components/FindingsList";
import { useFindingsData } from "@/features/findings/hooks/useFindingsData";

export default function FindingsDashboard() {
    const { detail, setDetail } = useFindingsData();
    return detail ? (
        <FindingDetail f={detail} onBack={() => setDetail(null)} />
    ) : (
        <FindingsList onSelect={setDetail} />
    );
}
