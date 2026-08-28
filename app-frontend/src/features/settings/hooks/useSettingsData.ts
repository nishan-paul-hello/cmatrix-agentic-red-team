import { useState } from "react";

import { type SettingsTab } from "@/features/settings/components/SettingsPageView";

export function useSettingsData() {
    const [tab, setTab] = useState<SettingsTab>("GENERAL");

    // General
    const [runtime, setRuntime] = useState("4");
    const [ceiling, setCeiling] = useState("5.00");
    const [roe, setRoe] = useState(
        "No destructive actions. No data exfiltration beyond evidence collection. No lateral movement beyond defined scope. Stop on any sign of production data exposure. Authorized targets only.",
    );
    const [devRef, setDevRef] = useState(false);

    // Models
    const [specialist, setSpecialist] = useState("claude-sonnet-5");
    const [manager, setManager] = useState("claude-opus-5");
    const [validator, setValidator] = useState("claude-haiku-4-5");

    // Missions
    const [surface, setSurface] = useState("WEB APPLICATION");
    const [mode, setMode] = useState("ONE-DAY");

    // Tools
    const [toolsTimeout, setToolsTimeout] = useState("30");
    const [parallel, setParallel] = useState("4");

    // Memory
    const [thresh, setThresh] = useState("85");
    const [maxEp, setMaxEp] = useState("500");
    const [skillProm, setSkillProm] = useState("3");

    // VDG
    const [c, setC] = useState("0.40");
    const [eordThresh, setEordThresh] = useState("3");
    const [retryCap, setRetryCap] = useState("3");
    /** UCB α — E_ord-weighted prior strength (§5.1) */
    const [alpha, setAlpha] = useState("0.25");
    /** Maximum VDG traversal depth before forced backtrack */
    const [maxDepth, setMaxDepth] = useState("6");
    /** Exploit bias — fraction of cycles run greedy vs exploratory (§5.1) */
    const [exploitBias, setExploitBias] = useState("0.30");
    /** Validation Agent Diagnosis-Adapt-Cap retry cap (§11.3) */
    const [validationRetryCap, setValidationRetryCap] = useState("3");

    // Validation
    const [retries, setRetries] = useState("3");
    const [valTimeout, setValTimeout] = useState("60");

    // Benchmarks
    const [suite, setSuite] = useState("CVE-BENCH");
    const [runs, setRuns] = useState("3");
    const [benchBudget, setBenchBudget] = useState("5.00");

    // Cost
    const [costCeiling, setCostCeiling] = useState("10.00");
    const [perSpec, setPerSpec] = useState("2.00");
    const [alertPct, setAlertPct] = useState("80");

    // Security
    const [sessionTimeout, setSessionTimeout] = useState("60");
    const [retention, setRetention] = useState("90");

    return {
        tab,
        setTab,
        general: { runtime, setRuntime, ceiling, setCeiling, roe, setRoe, devRef, setDevRef },
        models: { specialist, setSpecialist, manager, setManager, validator, setValidator },
        missions: { surface, setSurface, mode, setMode },
        tools: { timeout: toolsTimeout, setTimeout: setToolsTimeout, parallel, setParallel },
        memory: { thresh, setThresh, maxEp, setMaxEp, skillProm, setSkillProm },
        vdg: {
            c,
            setC,
            eordThresh,
            setEordThresh,
            retryCap,
            setRetryCap,
            alpha,
            setAlpha,
            maxDepth,
            setMaxDepth,
            exploitBias,
            setExploitBias,
            validationRetryCap,
            setValidationRetryCap,
        },
        validation: { retries, setRetries, timeout: valTimeout, setTimeout: setValTimeout },
        benchmarks: {
            suite,
            setSuite,
            runs,
            setRuns,
            budget: benchBudget,
            setBudget: setBenchBudget,
        },
        cost: {
            ceiling: costCeiling,
            setCeiling: setCostCeiling,
            perSpec,
            setPerSpec,
            alertPct,
            setAlertPct,
        },
        security: { sessionTimeout, setSessionTimeout, retention, setRetention },
    };
}
export type SettingsData = ReturnType<typeof useSettingsData>;
