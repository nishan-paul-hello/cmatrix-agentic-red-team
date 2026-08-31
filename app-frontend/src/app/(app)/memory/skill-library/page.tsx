import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import MemoryBrowser from "@/features/memory/components/MemoryBrowser";

export default function SkillLibrary() {
    return (
        <PanelErrorBoundary>
            <MemoryBrowser initialTab="SKILL LIBRARY" />
        </PanelErrorBoundary>
    );
}
