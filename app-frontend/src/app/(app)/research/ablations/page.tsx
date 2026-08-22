"use client";

import dynamic from "next/dynamic";

import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";

const ResearchLab = dynamic(() => import("@/features/research/components/ResearchLab"), {
    ssr: false,
});

export default function Ablations() {
    return (
        <PanelErrorBoundary>
            <ResearchLab initialTab="ABLATION" />
        </PanelErrorBoundary>
    );
}
