import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import TrajectoryBrowser from "@/features/trajectory/components/TrajectoryBrowser";

export default function Trajectory() {
    return (
        <PanelErrorBoundary>
            <TrajectoryBrowser />
        </PanelErrorBoundary>
    );
}
