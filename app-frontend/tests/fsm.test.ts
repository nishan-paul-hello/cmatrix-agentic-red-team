import { describe, expect, it } from "vitest";

import {
    canTransitionBenchmark,
    canTransitionFinding,
    canTransitionMission,
    canTransitionSpec,
    canTransitionTask,
    canTransitionVdgNode,
} from "@/utils/FSM";

describe("FSM Transitions", () => {
    describe("canTransitionMission", () => {
        it("allows valid transitions", () => {
            expect(canTransitionMission("QUEUED", "RUNNING")).toBe(true);
            expect(canTransitionMission("RUNNING", "PAUSED")).toBe(true);
        });

        it("prevents invalid transitions", () => {
            expect(canTransitionMission("QUEUED", "COMPLETED")).toBe(false);
            expect(canTransitionMission("COMPLETED", "RUNNING")).toBe(false);
        });
    });

    describe("canTransitionTask", () => {
        it("allows valid transitions", () => {
            expect(canTransitionTask("PENDING", "RUNNING")).toBe(true);
            expect(canTransitionTask("RUNNING", "SUCCESS")).toBe(true);
        });

        it("prevents invalid transitions", () => {
            expect(canTransitionTask("SUCCESS", "RUNNING")).toBe(false);
            expect(canTransitionTask("TIMEOUT", "PENDING")).toBe(false);
        });
    });

    describe("canTransitionBenchmark", () => {
        it("allows valid transitions", () => {
            expect(canTransitionBenchmark("QUEUED", "RUNNING")).toBe(true);
            expect(canTransitionBenchmark("RUNNING", "COMPLETE")).toBe(true);
        });

        it("prevents invalid transitions", () => {
            expect(canTransitionBenchmark("QUEUED", "COMPLETE")).toBe(false);
        });
    });

    describe("canTransitionSpec", () => {
        it("allows valid transitions", () => {
            expect(canTransitionSpec("QUEUED", "RUNNING")).toBe(true);
            expect(canTransitionSpec("RUNNING", "WAITING")).toBe(true);
        });

        it("prevents invalid transitions", () => {
            expect(canTransitionSpec("COMPLETED", "RUNNING")).toBe(false);
        });
    });

    describe("canTransitionFinding", () => {
        it("allows valid transitions", () => {
            expect(canTransitionFinding("PENDING", "VALIDATED")).toBe(true);
            expect(canTransitionFinding("VALIDATED", "ORACLE_CONFIRMED")).toBe(true);
        });

        it("prevents invalid transitions", () => {
            expect(canTransitionFinding("PENDING", "ORACLE_CONFIRMED")).toBe(false);
        });
    });

    describe("canTransitionVdgNode", () => {
        it("allows valid transitions", () => {
            expect(canTransitionVdgNode("ELIGIBLE", "IN_PROGRESS")).toBe(true);
            expect(canTransitionVdgNode("IN_PROGRESS", "EXPLOITED")).toBe(true);
        });

        it("prevents invalid transitions", () => {
            expect(canTransitionVdgNode("ELIGIBLE", "EXPLOITED")).toBe(false);
        });
    });
});
