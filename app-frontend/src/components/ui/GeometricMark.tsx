/**
 * GeometricMark — the three-nested-squares brand mark used in the sidebar
 * logo and the login page header.
 */
interface GeometricMarkProps {
  /** Rendered width and height in pixels. Defaults to 28. */
  size?: number;
}

export default function GeometricMark({ size = 28 }: GeometricMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="0.5"
        y="0.5"
        width="11"
        height="11"
        stroke="var(--color-hex-e31b23)"
        strokeWidth="1"
        fill="none"
      />
      <rect
        x="8.5"
        y="8.5"
        width="11"
        height="11"
        stroke="var(--color-hex-9e1118)"
        strokeWidth="1"
        fill="none"
      />
      <rect
        x="16.5"
        y="16.5"
        width="11"
        height="11"
        stroke="var(--color-hex-6f171b)"
        strokeWidth="1"
        fill="none"
      />
      <line
        x1="6"
        y1="6"
        x2="22"
        y2="22"
        stroke="var(--color-hex-e31b23)"
        strokeWidth="0.75"
      />
    </svg>
  );
}
