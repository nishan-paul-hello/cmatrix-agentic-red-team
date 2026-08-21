import { FAILURES, SKILLS, type FailureRecord, type SkillRecord } from "../data/mockData";

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
    readSkills(): SkillRecord[];
    readFailures(): FailureRecord[];
    readContext(key: string): ContextRecord | undefined;
    writeSkill(skill: SkillRecord): void;
    writeFailure(failure: FailureRecord): void;
    writeContext(context: ContextRecord): void;
}

class InMemoryBlackboard implements Blackboard {
    private skills: SkillRecord[] = [...SKILLS];
    private failures: FailureRecord[] = [...FAILURES];
    private contexts: Map<string, ContextRecord> = new Map();

    readSkills(): SkillRecord[] {
        return this.skills;
    }

    readFailures(): FailureRecord[] {
        return this.failures;
    }

    readContext(key: string): ContextRecord | undefined {
        return this.contexts.get(key);
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
