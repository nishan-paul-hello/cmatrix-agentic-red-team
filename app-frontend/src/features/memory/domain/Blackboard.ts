import {
    FAILURES,
    SKILLS,
    type FailureRecord,
    type SkillRecord,
} from "@/features/memory/data/mockData";
import { type MemoryTier } from "@/types/domain-types";

/**
 * Blackboard Pattern
 * A shared knowledge store that any specialist/agent can read from and write to.
 * Separates long-term memory (skills, failures) from page-local datasets or single mission state.
 */
export interface ContextRecord {
    id: string;
    key: string;
    value: unknown;
    timestamp: number;
}

export interface Blackboard {
    readSkills(): (SkillRecord & { tier: MemoryTier })[];
    readFailures(): (FailureRecord & { tier: MemoryTier })[];
    readContext(key: string): (ContextRecord & { tier: MemoryTier }) | undefined;
    readAllContexts(): (ContextRecord & { tier: MemoryTier })[];
    writeSkill(skill: SkillRecord): void;
    writeFailure(failure: FailureRecord): void;
    writeContext(context: ContextRecord): void;
}

class InMemoryBlackboard implements Blackboard {
    private skills: SkillRecord[] = [...SKILLS];
    private failures: FailureRecord[] = [...FAILURES];
    private contexts: Map<string, ContextRecord> = new Map();

    readSkills(): (SkillRecord & { tier: MemoryTier })[] {
        return this.skills.map((s) => ({ ...s, tier: "LONG_TERM" }));
    }

    readFailures(): (FailureRecord & { tier: MemoryTier })[] {
        return this.failures.map((f) => ({ ...f, tier: "LONG_TERM" }));
    }

    readContext(key: string): (ContextRecord & { tier: MemoryTier }) | undefined {
        const ctx = this.contexts.get(key);
        if (!ctx) {
            return undefined;
        }
        return { ...ctx, tier: "SHORT_TERM" as MemoryTier };
    }

    readAllContexts(): (ContextRecord & { tier: MemoryTier })[] {
        return Array.from(this.contexts.values()).map((ctx) => ({ ...ctx, tier: "SHORT_TERM" }));
    }

    writeSkill(skill: SkillRecord): void {
        this.skills.push(skill);
    }

    writeFailure(failure: FailureRecord): void {
        this.failures.push(failure);
    }

    writeContext(context: ContextRecord): void {
        this.contexts.set(context.key, context);
    }
}

export const globalBlackboard = new InMemoryBlackboard();
