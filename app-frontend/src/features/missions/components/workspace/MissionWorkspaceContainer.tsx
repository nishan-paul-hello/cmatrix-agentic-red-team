import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import MissionWorkspaceView from "@/features/missions/components/workspace/MissionWorkspaceView";
import {
    type LogEntry,
    type MissionSubNav,
} from "@/features/missions/data/fixtures/workspaceMockData";
import { WorkspaceRepository } from "@/features/missions/data/WorkspaceRepository";
import {
    MissionOrchestratorModel,
    type WorkerSpecialist,
} from "@/features/missions/domain/Orchestrator";
import { useElapsed } from "@/features/missions/hooks/useElapsed";
import { useTelemetry } from "@/hooks/useTelemetry";
import { MissionRepository } from "@/repositories/MissionRepository";
import { SpecialistRepository } from "@/repositories/SpecialistRepository";
import { MISSION_STATUS } from "@/types/domain-types";
import { canTransitionMission } from "@/utils/FSM";

interface WorkspaceState {
    subNav: MissionSubNav;
    log: LogEntry[];
    paused: boolean;
    terminated: boolean;
}

export type WorkspaceAction =
    | { type: "SET_SUB_NAV"; payload: MissionSubNav }
    | { type: "ADD_LOG_ENTRY"; payload: LogEntry }
    | { type: "SET_LOG"; payload: LogEntry[] }
    | { type: "SET_PAUSED"; payload: boolean | ((p: boolean) => boolean) }
    | { type: "SET_TERMINATED"; payload: boolean };

function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
    switch (action.type) {
        case "SET_SUB_NAV":
            return { ...state, subNav: action.payload };
        case "ADD_LOG_ENTRY":
            return { ...state, log: [action.payload, ...state.log].slice(0, 60) };
        case "SET_LOG":
            return { ...state, log: action.payload };
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
        log: [],
        paused: false,
        terminated: false,
    });
    const { subNav, log, paused, terminated } = state;

    const pausedRef = useRef(paused);
    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    const dispatch = useCallback(
        (action: WorkspaceAction) => {
            if (action.type === "SET_PAUSED") {
                const willPause =
                    typeof action.payload === "function"
                        ? action.payload(pausedRef.current)
                        : action.payload;

                setOrchestrator((prev) => {
                    if (!prev) {
                        return prev;
                    }
                    const targetStatus = willPause ? MISSION_STATUS.PAUSED : MISSION_STATUS.RUNNING;
                    if (!canTransitionMission(prev.status, targetStatus)) {
                        return prev; // invalid transition, no-op
                    }
                    return new MissionOrchestratorModel(prev.id, targetStatus, prev.workers);
                });

                logEvent(willPause ? "MISSION_PAUSED" : "MISSION_RESUMED", { missionId });
            } else if (action.type === "SET_TERMINATED") {
                logEvent("MISSION_TERMINATED", { missionId });
            }
            rawDispatch(action);
        },
        [logEvent, missionId],
    );

    const nextId = useRef(0);
    const queue = useRef<Omit<LogEntry, "id">[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        void Promise.all([
            WorkspaceRepository.getInitialLog(),
            WorkspaceRepository.getStreamEvents(),
        ]).then(([initialLog, streamEvents]) => {
            dispatch({ type: "SET_LOG", payload: initialLog });
            nextId.current = initialLog.length + 1;
            queue.current = [...streamEvents];
            setDataLoaded(true);
        });
    }, [dispatch]);

    const time = useElapsed(0);
    useEffect(() => {
        if (!dataLoaded) {
            return;
        }
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
    }, [dispatch, dataLoaded]);

    if (!dataLoaded) {
        return null;
    }

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
