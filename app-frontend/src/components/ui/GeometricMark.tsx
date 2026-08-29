import Image from "next/image";

/**
 * GeometricMark — the brand mark used in the sidebar logo and the login page
 * header. Renders /logo-brand.svg from public/ so there is a single source of
 * truth for the mark geometry and colours.
 */
interface GeometricMarkProps {
    /** Rendered width and height in pixels. Defaults to 28. */
    size?: number;
}

export default function GeometricMark({ size = 28 }: GeometricMarkProps) {
    return (
        <Image
            src="/logo-brand.svg"
            width={size}
            height={size}
            alt=""
            className="block"
            aria-hidden="true"
            draggable={false}
        />
    );
}
