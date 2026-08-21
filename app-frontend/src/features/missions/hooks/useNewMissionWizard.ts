import { useEffect, useReducer } from "react";

import { sanitizeInput } from "@/utils/sanitize";

import { type ModeType, type SurfaceType, type TargetType } from "../data/wizardMockData";

interface WizardState {
    step: number;
    targetType: TargetType;
    targetValue: string;
    missionName: string;
    surfaceType: SurfaceType;
    mode: ModeType;
    target: string;
    surface: SurfaceType;
    benchSuite: string;
    benchTaskId: string;
    roe: string;
    maxRuntime: string;
    costCeiling: string;
    toolTimeout: string;
    animateIn: boolean;
}

type WizardAction =
    | { type: "SET_STEP"; payload: number | ((s: number) => number) }
    | { type: "SET_TARGET_TYPE"; payload: TargetType }
    | { type: "SET_TARGET_VALUE"; payload: string }
    | { type: "SET_MISSION_NAME"; payload: string }
    | { type: "SET_SURFACE_TYPE"; payload: SurfaceType }
    | { type: "SET_MODE"; payload: ModeType }
    | { type: "SET_TARGET"; payload: string }
    | { type: "SET_SURFACE"; payload: SurfaceType }
    | { type: "SET_BENCH_SUITE"; payload: string }
    | { type: "SET_BENCH_TASK_ID"; payload: string }
    | { type: "SET_ROE"; payload: string }
    | { type: "SET_MAX_RUNTIME"; payload: string }
    | { type: "SET_COST_CEILING"; payload: string }
    | { type: "SET_TOOL_TIMEOUT"; payload: string }
    | { type: "SET_ANIMATE_IN"; payload: boolean };

const initialState: WizardState = {
    step: 1,
    targetType: "URL",
    targetValue: "https://api.example.com/v1",
    missionName: "API Discovery & Pentest",
    surfaceType: "WEB APPLICATION",
    mode: "ONE-DAY",
    target: "https://app.targetcorp.com",
    surface: "WEB APPLICATION",
    benchSuite: "CVE-BENCH",
    benchTaskId: "",
    roe: "No disruptive actions.\nMaintain operational safety.\nScan only in maintenance window.",
    maxRuntime: "10",
    costCeiling: "10.00",
    toolTimeout: "120",
    animateIn: false,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
    switch (action.type) {
        case "SET_STEP":
            return {
                ...state,
                step:
                    typeof action.payload === "function"
                        ? action.payload(state.step)
                        : action.payload,
            };
        case "SET_TARGET_TYPE":
            return { ...state, targetType: action.payload };
        case "SET_TARGET_VALUE":
            return { ...state, targetValue: sanitizeInput(action.payload) };
        case "SET_MISSION_NAME":
            return { ...state, missionName: sanitizeInput(action.payload) };
        case "SET_SURFACE_TYPE":
            return { ...state, surfaceType: action.payload };
        case "SET_MODE":
            return { ...state, mode: action.payload };
        case "SET_TARGET":
            return { ...state, target: sanitizeInput(action.payload) };
        case "SET_SURFACE":
            return { ...state, surface: action.payload };
        case "SET_BENCH_SUITE":
            return { ...state, benchSuite: sanitizeInput(action.payload) };
        case "SET_BENCH_TASK_ID":
            return { ...state, benchTaskId: sanitizeInput(action.payload) };
        case "SET_ROE":
            return { ...state, roe: sanitizeInput(action.payload) };
        case "SET_MAX_RUNTIME":
            return { ...state, maxRuntime: action.payload };
        case "SET_COST_CEILING":
            return { ...state, costCeiling: action.payload };
        case "SET_TOOL_TIMEOUT":
            return { ...state, toolTimeout: action.payload };
        case "SET_ANIMATE_IN":
            return { ...state, animateIn: action.payload };
        default:
            return state;
    }
}

export function useNewMissionWizard() {
    const [state, dispatch] = useReducer(wizardReducer, initialState);

    useEffect(() => {
        const t = setTimeout(() => dispatch({ type: "SET_ANIMATE_IN", payload: true }), 0);
        return () => clearTimeout(t);
    }, []);

    const handleNext = () => {
        if (state.step < 5) {
            dispatch({ type: "SET_STEP", payload: state.step + 1 });
        }
    };

    const handleBack = () => {
        if (state.step > 1) {
            dispatch({ type: "SET_STEP", payload: state.step - 1 });
        }
    };

    return {
        ...state,
        setStep: (p: number | ((s: number) => number)) =>
            dispatch({ type: "SET_STEP", payload: p }),
        setTargetType: (p: TargetType) => dispatch({ type: "SET_TARGET_TYPE", payload: p }),
        setTargetValue: (p: string) => dispatch({ type: "SET_TARGET_VALUE", payload: p }),
        setMissionName: (p: string) => dispatch({ type: "SET_MISSION_NAME", payload: p }),
        setSurfaceType: (p: SurfaceType) => dispatch({ type: "SET_SURFACE_TYPE", payload: p }),
        setMode: (p: ModeType) => dispatch({ type: "SET_MODE", payload: p }),
        setTarget: (p: string) => dispatch({ type: "SET_TARGET", payload: p }),
        setSurface: (p: SurfaceType) => dispatch({ type: "SET_SURFACE", payload: p }),
        setBenchSuite: (p: string) => dispatch({ type: "SET_BENCH_SUITE", payload: p }),
        setBenchTaskId: (p: string) => dispatch({ type: "SET_BENCH_TASK_ID", payload: p }),
        setRoe: (p: string) => dispatch({ type: "SET_ROE", payload: p }),
        setMaxRuntime: (p: string) => dispatch({ type: "SET_MAX_RUNTIME", payload: p }),
        setCostCeiling: (p: string) => dispatch({ type: "SET_COST_CEILING", payload: p }),
        setToolTimeout: (p: string) => dispatch({ type: "SET_TOOL_TIMEOUT", payload: p }),
        handleNext,
        handleBack,
    };
}
