import { TableCell, TableRow } from "@/components/ui/table";

export interface EmptyStateProps {
    message: string;
    colSpan?: number;
    isTable?: boolean;
}

export function EmptyState({ message, colSpan = 1, isTable = false }: EmptyStateProps) {
    const className = "px-6 py-8 text-center text-xs tracking-normal text-muted-foreground";

    if (isTable) {
        return (
            <TableRow>
                <TableCell colSpan={colSpan} className={className}>
                    {message}
                </TableCell>
            </TableRow>
        );
    }

    return <div className={className}>{message}</div>;
}
