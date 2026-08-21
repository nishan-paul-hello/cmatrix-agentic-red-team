import { TASK_STATUS, type ExecEntry } from "@/types/domain-types";

export const ENTRIES: ExecEntry[] = [
    {
        id: "00484",
        ts: "06:31:04",
        specialist: "INJECT-SPEC",
        command: {
            name: "sqli_blind_time",
            tool: { id: "sqlmap" },
        },
        duration: "6.2s",
        status: TASK_STATUS.RUNNING,
        output: "",
        size: "—",
    },
    {
        id: "00483",
        ts: "06:30:51",
        specialist: "INJECT-SPEC",
        command: {
            name: "sqli_payload_dispatch",
            tool: { id: "curl" },
        },
        duration: "4.2s",
        status: TASK_STATUS.SUCCESS,
        output: "HTTP 200 · 4.18s delta · timing confirmed",
        size: "1.2 KB",
    },
    {
        id: "00482",
        ts: "06:30:39",
        specialist: "VALID-AGENT",
        command: {
            name: "oracle_test",
            tool: { id: "cve_bench" },
            target: "AUTH-001",
        },
        duration: "3.1s",
        status: TASK_STATUS.SUCCESS,
        output: "ORACLE PASS · CVE-BENCH · FILE ACCESS",
        size: "0.4 KB",
    },
    {
        id: "00481",
        ts: "06:30:22",
        specialist: "AUTH-SPEC",
        command: {
            name: "exploit_auth",
            tool: { id: "requests" },
        },
        duration: "1.8s",
        status: TASK_STATUS.SUCCESS,
        output: "Session token returned · admin@targetcorp.com",
        size: "0.8 KB",
    },
    {
        id: "00480",
        ts: "06:29:58",
        specialist: "INJECT-SPEC",
        command: {
            name: "sqli_error_probe",
            tool: { id: "curl" },
        },
        duration: "2.1s",
        status: TASK_STATUS.SUCCESS,
        output: "HTTP 500 · SQL error in response body",
        size: "3.1 KB",
    },
    {
        id: "00479",
        ts: "06:29:44",
        specialist: "RECON-SPEC",
        command: {
            name: "endpoint_enumerate",
            tool: { id: "spider" },
        },
        duration: "18.4s",
        status: TASK_STATUS.SUCCESS,
        output: "12 endpoints discovered · 3 authenticated",
        size: "14.2KB",
    },
    {
        id: "00478",
        ts: "06:29:03",
        specialist: "NETWORK-SPEC",
        command: {
            name: "lateral_pivot",
            tool: { id: "nmap" },
        },
        duration: "30.0s",
        status: TASK_STATUS.TIMEOUT,
        output: "Port 5432 filtered — timeout exceeded",
        size: "0.2 KB",
    },
    {
        id: "00477",
        ts: "06:28:47",
        specialist: "RECON-SPEC",
        command: {
            name: "service_scan",
            tool: { id: "nmap" },
        },
        duration: "12.3s",
        status: TASK_STATUS.SUCCESS,
        output: "8 services · 3 open · SSH OpenSSH 8.9p1",
        size: "2.4 KB",
    },
];

export async function getExecutionEntries(options?: {
    page?: number;
    limit?: number;
}): Promise<ExecEntry[]> {
    const { page = 1, limit = 50 } = options ?? {};
    const start = (page - 1) * limit;
    return Promise.resolve(ENTRIES.slice(start, start + limit));
}

export const PARSED_ROWS = [
    { port: "22", state: "OPEN", service: "SSH", version: "OpenSSH 8.9p1" },
    { port: "80", state: "OPEN", service: "HTTP", version: "nginx/1.24.0" },
    { port: "443", state: "OPEN", service: "HTTPS", version: "nginx/1.24.0" },
    { port: "5432", state: "FILTERED", service: "POSTGRESQL", version: "—" },
    { port: "6379", state: "FILTERED", service: "REDIS", version: "—" },
];

export function getParsedRows(): Promise<typeof PARSED_ROWS> {
    return Promise.resolve(PARSED_ROWS);
}
