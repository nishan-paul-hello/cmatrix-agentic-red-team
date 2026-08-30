import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Btn({
    onClick,
    label,
    red,
}: {
    onClick: () => void;
    label: string;
    red?: boolean;
}) {
    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
            }}
            className={`cursor-pointer ${cn(
                "text-xs tracking-widest uppercase",
                red
                    ? "text-primary border-border hover:border-primary"
                    : "text-muted-foreground border-border hover:border-border",
            )}`}
        >
            {label}
        </Button>
    );
}
