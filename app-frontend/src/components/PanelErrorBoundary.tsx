import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class PanelErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div className="flex h-full w-full items-center justify-center border border-[var(--color-hex-ff2a32)] bg-[var(--color-hex-0b0b0b)] p-4 font-mono text-[10px] text-[var(--color-hex-ff2a32)]">
                    <div className="text-center">
                        <div className="mb-2 font-bold tracking-widest uppercase">Panel Error</div>
                        <div className="text-[9px] text-[var(--color-hex-a0a0a0)]">
                            {this.state.error?.message}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
