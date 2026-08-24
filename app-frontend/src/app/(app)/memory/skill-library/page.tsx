"use client";

import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import MemoryPage from "@/features/memory/components/MemoryPage";

export default function SkillLibrary() {
    return (
        <PanelErrorBoundary>
            <MemoryPage initialTab="SKILL LIBRARY" />
        </PanelErrorBoundary>
    );
}
