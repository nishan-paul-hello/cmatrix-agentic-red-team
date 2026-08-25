import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "RedGrid - Agentic Red Team";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
    // Fetch JetBrains Mono fonts (Regular and Bold)
    const jetbrainsMonoRegular = await fetch(
        new URL("https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.ttf")
    ).then((res) => res.arrayBuffer());
    
    const jetbrainsMonoBold = await fetch(
        new URL("https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-700-normal.ttf")
    ).then((res) => res.arrayBuffer());

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
                fontFamily: '"JetBrains Mono"',
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
                        "linear-gradient(rgba(41, 41, 41, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(41, 41, 41, 0.18) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
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
                            stroke="#e31b23"
                            strokeWidth="1"
                            fill="none"
                        />
                        <rect
                            x="8.5"
                            y="8.5"
                            width="11"
                            height="11"
                            stroke="#e31b23"
                            strokeWidth="1"
                            fill="none"
                        />
                        <rect
                            x="16.5"
                            y="16.5"
                            width="11"
                            height="11"
                            stroke="#e31b23"
                            strokeWidth="1"
                            fill="none"
                        />
                        <line x1="6" y1="6" x2="22" y2="22" stroke="#e31b23" strokeWidth="0.75" />
                    </svg>
                </div>

                {/* Title */}
                <div
                    style={{
                        color: "#f2f2f2",
                        fontSize: "72px",
                        fontWeight: 700,
                        letterSpacing: "-0.05em",
                        marginBottom: "24px",
                    }}
                >
                    RedGrid
                </div>

                {/* Description */}
                <div
                    style={{
                        color: "#888888",
                        fontSize: "32px",
                        fontWeight: 400,
                        textAlign: "center",
                        lineHeight: 1.5,
                    }}
                >
                    LLM-orchestrated multi-agent framework for autonomous VAPT
                </div>
            </div>

            {/* Subtle Watermark */}
            <div
                style={{
                    position: "absolute",
                    top: "40px",
                    right: "40px",
                    color: "#666666",
                    fontSize: "20px",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                }}
            >
                cmatrix.kaiofficial.xyz
            </div>
        </div>,
        {
            ...size,
            fonts: [
                {
                    name: "JetBrains Mono",
                    data: jetbrainsMonoRegular,
                    weight: 400,
                    style: "normal",
                },
                {
                    name: "JetBrains Mono",
                    data: jetbrainsMonoBold,
                    weight: 700,
                    style: "normal",
                },
            ],
        },
    );
}
