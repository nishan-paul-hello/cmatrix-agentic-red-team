/**
 * Strategy pattern for Specialist behavior.
 * Represents an interchangeable strategy object for each specialist type,
 * providing capabilities, available tools, and display metadata.
 */

export interface SpecialistStrategy {
    roleId: string; // e.g., "RECON", "INJECT", "AUTH"
    displayName: string;
    capabilities: string[]; // Known skills/tools for this specialist
}

export const SPECIALIST_STRATEGIES: Record<string, SpecialistStrategy> = {
    "RECON-SPEC": {
        roleId: "RECON-SPEC",
        displayName: "Reconnaissance Specialist",
        capabilities: ["nmap_scan", "dirb_enum", "spider_crawl", "wayback_urls"],
    },
    "INJECT-SPEC": {
        roleId: "INJECT-SPEC",
        displayName: "Injection Specialist",
        capabilities: ["sqli_blind_time", "sqli_error_based", "sqli_union", "cmd_inject"],
    },
    "AUTH-SPEC": {
        roleId: "AUTH-SPEC",
        displayName: "Authentication Specialist",
        capabilities: ["jwt_forge", "brute_force", "bypass_mfa", "token_spray"],
    },
    "VALID-AGENT": {
        roleId: "VALID-AGENT",
        displayName: "Validation Agent",
        capabilities: ["oracle_test", "vuln_verify", "false_positive_check"],
    },
    "EXEC-AGENT": {
        roleId: "EXEC-AGENT",
        displayName: "Execution Agent",
        capabilities: ["curl_payload", "run_script", "proxy_request"],
    },
    "NETWORK-SPEC": {
        roleId: "NETWORK-SPEC",
        displayName: "Network Specialist",
        capabilities: ["lateral_move", "port_forward", "pcap_analyze"],
    },
};

export function getStrategyForRole(role: string): SpecialistStrategy {
    const strat = SPECIALIST_STRATEGIES[role] as SpecialistStrategy | undefined;
    return (
        strat ?? {
            roleId: role,
            displayName: role,
            capabilities: ["generic_scan", "analyze", "report"],
        }
    );
}
