import { FAILURES, SKILLS, type FailureRecord, type SkillRecord } from "../data/mockData";

/**
 * Blackboard Pattern
 * A shared knowledge store that any specialist/agent can read from and write to.
 * Separates long-term memory (skills, failures) from page-local datasets or single mission state.
 */
export interface Blackboard {
    readSkills(): SkillRecord[];
    readFailures(): FailureRecord[];
    writeSkill(skill: SkillRecord): void;
    writeFailure(failure: FailureRecord): void;
}

class InMemoryBlackboard implements Blackboard {
    private skills: SkillRecord[] = [...SKILLS];
    private failures: FailureRecord[] = [...FAILURES];

    readSkills(): SkillRecord[] {
        return this.skills;
    }

    readFailures(): FailureRecord[] {
        return this.failures;
    }

    writeSkill(skill: SkillRecord): void {
        this.skills.push(skill);
    }

    writeFailure(failure: FailureRecord): void {
        this.failures.push(failure);
    }
}

export const globalBlackboard = new InMemoryBlackboard();
