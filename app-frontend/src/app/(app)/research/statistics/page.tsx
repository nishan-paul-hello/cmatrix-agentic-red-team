import dynamic from "next/dynamic";

import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";

const ResearchLab = dynamic(() => import("@/features/research/components/ResearchLab"));

export default function Statistics() {
    return (
        <PanelErrorBoundary>
            <ResearchLab initialTab="STATISTICAL EVALUATION" />
        </PanelErrorBoundary>
    );
}
