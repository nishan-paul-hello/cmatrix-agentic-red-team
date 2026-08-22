import { createContext, useContext } from "react";

export interface DrawerNode {
    id: string;
    type: string;
    status: string;
    ucb: number;
    eord: number;
    vulnClass: string;
}

export interface NodeDrawerContextType {
    node: DrawerNode;
    detail: {
        intent: string;
        prerequisites: {
            id: string;
            done: boolean;
        }[];
        enables: string[];
        facts: {
            k: string;
            v: string;
        }[];
    };
    onClose: () => void;
    statusColor: string;
    statusBg: string;
    statusBorder: string;
}

export const NodeDrawerContext = createContext<NodeDrawerContextType | null>(null);

export function useNodeDrawerContext() {
    const ctx = useContext(NodeDrawerContext);
    if (!ctx) {
        throw new Error("Missing NodeDrawerContext");
    }
    return ctx;
}
