import { useEffect, useState } from "react";

import { type ModeType, type SurfaceType, type TargetType } from "../data/wizardMockData";

export function useNewMissionWizard() {
    const [step, setStep] = useState(1);

    // Form State
    const [targetType, setTargetType] = useState<TargetType>("URL");
    const [targetValue, setTargetValue] = useState("https://api.example.com/v1");
    const [missionName, setMissionName] = useState("API Discovery & Pentest");
    const [surfaceType, setSurfaceType] = useState<SurfaceType>("WEB APPLICATION");
    const [mode, setMode] = useState<ModeType>("ONE-DAY");
    const [target, setTarget] = useState("https://app.targetcorp.com");
    const [surface, setSurface] = useState<SurfaceType>("WEB APPLICATION");
    const [benchSuite, setBenchSuite] = useState("CVE-BENCH");
    const [benchTaskId, setBenchTaskId] = useState("");
    const [roe, setRoe] = useState(
        "No disruptive actions.\nMaintain operational safety.\nScan only in maintenance window.",
    );
    const [maxRuntime, setMaxRuntime] = useState("10");
    const [costCeiling, setCostCeiling] = useState("10.00");
    const [toolTimeout, setToolTimeout] = useState("120");

    // Animate in
    const [animateIn, setAnimateIn] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setAnimateIn(true), 0);
        return () => clearTimeout(t);
    }, []);

    const handleNext = () => {
        if (step < 5) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    return {
        step,
        setStep,
        targetType,
        setTargetType,
        targetValue,
        setTargetValue,
        missionName,
        setMissionName,
        surfaceType,
        setSurfaceType,
        mode,
        setMode,
        target,
        setTarget,
        surface,
        setSurface,
        benchSuite,
        setBenchSuite,
        benchTaskId,
        setBenchTaskId,
        roe,
        setRoe,
        maxRuntime,
        setMaxRuntime,
        costCeiling,
        setCostCeiling,
        toolTimeout,
        setToolTimeout,
        animateIn,
        handleNext,
        handleBack,
    };
}
