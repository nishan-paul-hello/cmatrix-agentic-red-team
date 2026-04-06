"use client";

import { BrandLogo } from "@/components/brand-logo";
import { MESSAGES } from "@/constants/messages";

interface WelcomeScreenProps {
  onSuggestionClick: (prompt: string) => void;
}

/**
 * Welcome screen component
 * Displays when there are no messages in the chat
 */
export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 py-12">
      <div className="flex items-center justify-center gap-6">
        <div className="bg-secondary cyber-border flex h-20 w-20 items-center justify-center rounded-2xl">
          <BrandLogo size={48} />
        </div>
        <div className="text-left">
          <h2 className="terminal-text text-4xl font-bold text-balance">
            {MESSAGES.WELCOME.TITLE}
          </h2>
          <div className="text-muted-foreground terminal-text mt-2 text-sm">
            {MESSAGES.WELCOME.SUBTITLE}
          </div>
        </div>
      </div>

      <div className="space-y-4 text-center">
        <p className="text-muted-foreground terminal-text max-w-md text-pretty">
          {MESSAGES.WELCOME.DESCRIPTION}
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => onSuggestionClick(MESSAGES.SUGGESTIONS.SECURITY_SCAN.PROMPT)}
          className="border-border hover:bg-accent hover:text-accent-foreground cyber-border cursor-pointer rounded-lg border px-4 py-3 text-left text-sm transition-colors"
        >
          <div className="terminal-text font-medium">
            {MESSAGES.SUGGESTIONS.SECURITY_SCAN.TITLE}
          </div>
          <div className="text-muted-foreground text-xs">
            {MESSAGES.SUGGESTIONS.SECURITY_SCAN.DESCRIPTION}
          </div>
        </button>
        <button
          onClick={() => onSuggestionClick(MESSAGES.SUGGESTIONS.SYSTEM_STATUS.PROMPT)}
          className="border-border hover:bg-accent hover:text-accent-foreground cyber-border cursor-pointer rounded-lg border px-4 py-3 text-left text-sm transition-colors"
        >
          <div className="terminal-text font-medium">
            {MESSAGES.SUGGESTIONS.SYSTEM_STATUS.TITLE}
          </div>
          <div className="text-muted-foreground text-xs">
            {MESSAGES.SUGGESTIONS.SYSTEM_STATUS.DESCRIPTION}
          </div>
        </button>
      </div>
    </div>
  );
}
