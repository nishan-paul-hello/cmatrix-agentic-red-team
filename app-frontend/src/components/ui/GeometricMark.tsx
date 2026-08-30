import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * GeometricMark — the brand mark used in the sidebar logo and the login page
 * header. Renders /logo-brand.svg from public/ so there is a single source of
 * truth for the mark geometry and colours.
 */
interface GeometricMarkProps {
    /** Tailwind class name to apply size, e.g. "h-7 w-7". Defaults to "h-7 w-7" (28px). */
    className?: string;
}

export default function GeometricMark({ className = "h-7 w-7" }: GeometricMarkProps) {
    return (
        <div className={cn("relative shrink-0", className)}>
            <Image
                src="/logo-brand.svg"
                alt=""
                fill
                className="object-contain"
                aria-hidden="true"
                draggable={false}
            />
        </div>
    );
}
