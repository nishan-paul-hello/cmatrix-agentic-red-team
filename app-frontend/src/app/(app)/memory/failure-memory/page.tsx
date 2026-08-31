import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import MemoryBrowser from "@/features/memory/components/MemoryBrowser";

export default function FailureMemory() {
    return (
        <PanelErrorBoundary>
            <MemoryBrowser initialTab="FAILURE MEMORY" />
        </PanelErrorBoundary>
    );
}
