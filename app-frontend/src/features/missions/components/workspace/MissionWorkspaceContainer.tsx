import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import MissionWorkspaceView from "@/features/missions/components/workspace/MissionWorkspaceView";
import {
    INITIAL_LOG,
    STREAM_EVENTS,
    type LogEntry,
    type MissionSubNav,
} from "@/features/missions/data/workspaceMockData";
import {
    MissionOrchestratorModel,
    type WorkerSpecialist,
} from "@/features/missions/domain/Orchestrator";
import { useElapsed } from "@/features/missions/hooks/useElapsed";
import { useTelemetry } from "@/hooks/useTelemetry";
import { MissionRepository } from "@/repositories/MissionRepository";
import { SpecialistRepository } from "@/repositories/SpecialistRepository";

interface WorkspaceState {
    subNav: MissionSubNav;
    log: LogEntry[];
    paused: boolean;
    terminated: boolean;
}

export type WorkspaceAction =
    | { type: "SET_SUB_NAV"; payload: MissionSubNav }
    | { type: "ADD_LOG_ENTRY"; payload: LogEntry }
    | { type: "SET_PAUSED"; payload: boolean | ((p: boolean) => boolean) }
    | { type: "SET_TERMINATED"; payload: boolean };

function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
    switch (action.type) {
        case "SET_SUB_NAV":
            return { ...state, subNav: action.payload };
        case "ADD_LOG_ENTRY":
            return { ...state, log: [action.payload, ...state.log].slice(0, 60) };
        case "SET_PAUSED":
            return {
                ...state,
                paused:
                    typeof action.payload === "function"
                        ? action.payload(state.paused)
                        : action.payload,
            };
        case "SET_TERMINATED":
            return { ...state, terminated: action.payload };
        default:
            return state;
    }
}

export default function MissionWorkspaceContainer({
    missionId = "CVE-001",
}: {
    missionId?: string;
}) {
    const { logEvent } = useTelemetry();
    const [orchestrator, setOrchestrator] = useState<MissionOrchestratorModel | null>(null);

    useEffect(() => {
        const missionRepo = new MissionRepository();
        const specialistRepo = new SpecialistRepository();
        void Promise.all([missionRepo.fetch(missionId), specialistRepo.fetchAll()]).then(
            ([mission, specialists]) => {
                const workers: WorkerSpecialist[] = specialists.map((s) => ({
                    id: s.id,
                    role: s.role,
                    status: s.status,
                    missionId: mission.id,
                }));
                setOrchestrator(new MissionOrchestratorModel(mission.id, mission.status, workers));
            },
        );
    }, [missionId]);

    const [state, rawDispatch] = useReducer(workspaceReducer, {
        subNav: "overview",
        log: INITIAL_LOG,
        paused: false,
        terminated: false,
    });
    const { subNav, log, paused, terminated } = state;

    const dispatch = useCallback(
        (action: WorkspaceAction) => {
            if (action.type === "SET_PAUSED") {
                const willPause =
                    typeof action.payload === "function" ? action.payload(paused) : action.payload;
                logEvent(willPause ? "MISSION_PAUSED" : "MISSION_RESUMED", { missionId });
            } else if (action.type === "SET_TERMINATED") {
                logEvent("MISSION_TERMINATED", { missionId });
            }
            rawDispatch(action);
        },
        [logEvent, missionId, paused],
    );

    const nextId = useRef(INITIAL_LOG.length + 1);
    const queue = useRef([...STREAM_EVENTS]);
    const time = useElapsed(0);
    const pausedRef = useRef(paused);
    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);
    useEffect(() => {
        const iv = setInterval(() => {
            if (pausedRef.current) {
                return;
            }
            const next = queue.current.shift();
            if (!next) {
                return;
            }
            dispatch({
                type: "ADD_LOG_ENTRY",
                payload: {
                    ...next,
                    id: nextId.current++,
                },
            });
        }, 3200);
        return () => clearInterval(iv);
    }, [dispatch]);
    return (
        <MissionWorkspaceView
            missionId={missionId}
            subNav={subNav}
            log={log}
            paused={paused}
            terminated={terminated}
            time={time}
            dispatch={dispatch}
            orchestrator={orchestrator}
        />
    );
}
