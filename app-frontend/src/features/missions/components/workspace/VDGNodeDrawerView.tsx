import {
    NodeDrawerContext,
    type DrawerNode,
} from "@/features/missions/components/workspace/VDGNodeDrawerContext";
import { VDGNodeDrawerHeader } from "@/features/missions/components/workspace/VDGNodeDrawerHeader";
import {
    VDGNodeDrawerEnables,
    VDGNodeDrawerEvidence,
    VDGNodeDrawerFacts,
    VDGNodeDrawerIntent,
    VDGNodeDrawerLifecycle,
    VDGNodeDrawerMetrics,
    VDGNodeDrawerPrerequisites,
} from "@/features/missions/components/workspace/VDGNodeDrawerSections";

const NODE_DETAIL: Record<
    string,
    {
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
    }
> = {
    "SQLI-001": {
        intent: "Exploit time-based blind SQL injection in /api/users via id parameter",
        prerequisites: [
            {
                id: "AUTH-001",
                done: true,
            },
            {
                id: "RECON-004",
                done: true,
            },
        ],
        enables: ["DB-ACCESS-002", "RCE-007"],
        facts: [
            {
                k: "ENDPOINT",
                v: "GET /api/users",
            },
            {
                k: "PARAMETER",
                v: "id (integer, unsanitised)",
            },
            {
                k: "AUTH STATE",
                v: "SESSION admin@targetcorp.com",
            },
            {
                k: "TECH",
                v: "Flask 2.3 / SQLite 3.39",
            },
            {
                k: "EVIDENCE",
                v: "HTTP 500 on id=1' observed (E_ord 3)",
            },
        ],
    },
    "AUTH-001": {
        intent: "Exploit authentication bypass on /api/auth/login",
        prerequisites: [
            {
                id: "RECON-001",
                done: true,
            },
        ],
        enables: ["SQLI-001", "XSS-002", "CSRF-003"],
        facts: [
            {
                k: "ENDPOINT",
                v: "POST /api/auth/login",
            },
            {
                k: "PARAMETER",
                v: "username, password",
            },
            {
                k: "AUTH STATE",
                v: "UNAUTHENTICATED",
            },
            {
                k: "EVIDENCE",
                v: "Default admin credentials accepted (E_ord 4)",
            },
        ],
    },
    "RECON-001": {
        intent: "Enumerate attack surface via spider, port scan, technology fingerprint",
        prerequisites: [],
        enables: ["AUTH-001", "ENUM-002"],
        facts: [
            {
                k: "TARGET",
                v: "app.targetcorp.com",
            },
            {
                k: "METHOD",
                v: "nmap + spider",
            },
            {
                k: "TECH",
                v: "nginx/1.24, Flask 2.3, PostgreSQL 14",
            },
            {
                k: "EVIDENCE",
                v: "12 endpoints discovered (E_ord 5)",
            },
        ],
    },
};
const DEFAULT_DETAIL = {
    intent: "Investigate target node for exploitable vulnerabilities.",
    prerequisites: [] as {
        id: string;
        done: boolean;
    }[],
    enables: [] as string[],
    facts: [] as {
        k: string;
        v: string;
    }[],
};
export default function VDGNodeDrawerView({
    node,
    onClose,
}: {
    node: DrawerNode;
    onClose: () => void;
}) {
    const detail = NODE_DETAIL[node.id] ?? DEFAULT_DETAIL;
    const statusColor = (() => {
        if (node.status === "ELIGIBLE") {
            return "var(--destructive)";
        }
        if (node.status === "EXPLOITED") {
            return "var(--primary)";
        }
        if (node.status === "IN_PROGRESS") {
            return "var(--destructive)";
        }
        return "var(--muted-foreground)";
    })();
    const statusBg = ["ELIGIBLE", "EXPLOITED", "IN_PROGRESS"].includes(node.status)
        ? "var(--border)"
        : "var(--border)";
    const statusBorder = ["ELIGIBLE", "EXPLOITED", "IN_PROGRESS"].includes(node.status)
        ? "var(--border)"
        : "var(--border)";

    return (
        <aside className="border-border bg-background flex h-full w-[var(--width-drawer-md)] shrink-0 flex-col gap-0 border-l p-0 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
            <NodeDrawerContext.Provider
                value={{ node, detail, onClose, statusColor, statusBg, statusBorder }}
            >
                <VDGNodeDrawerHeader />
                <div className="flex-1 overflow-y-auto">
                    <VDGNodeDrawerIntent />
                    <VDGNodeDrawerMetrics />
                    <VDGNodeDrawerEvidence />
                    <VDGNodeDrawerPrerequisites />
                    <VDGNodeDrawerEnables />
                    <VDGNodeDrawerFacts />
                    <VDGNodeDrawerLifecycle />
                </div>
            </NodeDrawerContext.Provider>
        </aside>
    );
}
