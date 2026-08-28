export interface EmptyStateProps {
    message: string;
    colSpan?: number;
    isTable?: boolean;
}

export function EmptyState({ message, colSpan = 1, isTable = false }: EmptyStateProps) {
    const className = "px-6 py-8 text-center text-xs tracking-normal text-muted-foreground";

    if (isTable) {
        return (
            <tr>
                <td colSpan={colSpan} className={className}>
                    {message}
                </td>
            </tr>
        );
    }

    return <div className={className}>{message}</div>;
}
