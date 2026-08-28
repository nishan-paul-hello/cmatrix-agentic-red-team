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
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
            }}
            className="font-inherit tracking-wider-1 cursor-pointer rounded-[2px] bg-[transparent] px-[12px] py-[4px] text-base"
            style={{
                color: red ? "var(--color-brand)" : "var(--color-hex-666666)",
                border: `1px solid ${red ? "var(--color-hex-6f171b)" : "var(--color-hex-292929)"}`,
            }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = red
                    ? "var(--color-brand)"
                    : "var(--color-hex-444444)")
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = red
                    ? "var(--color-hex-6f171b)"
                    : "var(--color-hex-292929)")
            }
        >
            {label}
        </button>
    );
}
