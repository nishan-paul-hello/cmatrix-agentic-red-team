"use client";

import dynamic from "next/dynamic";

const ResearchLab = dynamic(() => import("@/features/research/components/ResearchLab"), {
    ssr: false,
});

export default function Ablations() {
    return <ResearchLab initialTab="ABLATION" />;
}
