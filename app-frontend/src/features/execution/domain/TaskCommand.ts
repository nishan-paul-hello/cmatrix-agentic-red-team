/**
 * Command Pattern for Agent Tasks.
 * Represents an executable task as a structured command object
 * rather than a free-form string.
 */

export interface TaskCommand {
    name: string;
    tool: string;
    target?: string;
    params?: Record<string, string | number | boolean>;
}

export function formatCommand(cmd: TaskCommand): string {
    if (cmd.target) {
        return `${cmd.name}(${cmd.target})`;
    }
    return `${cmd.name}()`;
}
