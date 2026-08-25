import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "RedGrid - Agentic Red Team";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default function Image() {
    return new ImageResponse(
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#080808",
                backgroundImage: "linear-gradient(to bottom right, #080808, #1a1a1a)",
                fontFamily: "system-ui, sans-serif",
                padding: "40px",
            }}
        >
            {/* Subtle grid background for the "Grid" theme */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage:
                        "linear-gradient(rgba(255,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.05) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "40px",
                        backgroundColor: "rgba(255, 0, 0, 0.05)",
                        borderRadius: "32px",
                        padding: "32px",
                        border: "1px solid rgba(255,0,0,0.1)",
                    }}
                >
                    <svg
                        width="120"
                        height="120"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect
                            x="0.5"
                            y="0.5"
                            width="11"
                            height="11"
                            stroke="#FF0000"
                            strokeWidth="1"
                            fill="none"
                        />
                        <rect
                            x="8.5"
                            y="8.5"
                            width="11"
                            height="11"
                            stroke="#FF0000"
                            strokeWidth="1"
                            fill="none"
                        />
                        <rect
                            x="16.5"
                            y="16.5"
                            width="11"
                            height="11"
                            stroke="#FF0000"
                            strokeWidth="1"
                            fill="none"
                        />
                        <line x1="6" y1="6" x2="22" y2="22" stroke="#FF0000" strokeWidth="0.75" />
                    </svg>
                </div>

                {/* Title */}
                <div
                    style={{
                        display: "flex",
                        color: "#ffffff",
                        fontSize: "72px",
                        fontWeight: 800,
                        letterSpacing: "-0.025em",
                        marginBottom: "24px",
                        textShadow: "0px 4px 20px rgba(255, 0, 0, 0.3)",
                    }}
                >
                    RedGrid
                </div>

                {/* Description */}
                <div
                    style={{
                        display: "flex",
                        color: "#a1a1aa",
                        fontSize: "36px",
                        fontWeight: 500,
                        textAlign: "center",
                        maxWidth: "900px",
                        lineHeight: 1.4,
                    }}
                >
                    Autonomous vulnerability assessment and penetration testing.
                </div>

                {/* URL */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "60px",
                        color: "#ef4444",
                        fontSize: "28px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                    }}
                >
                    CMATRIX.KAIOFFICIAL.XYZ
                </div>
            </div>
        </div>,
        {
            ...size,
        },
    );
}
