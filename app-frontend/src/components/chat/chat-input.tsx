"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { MESSAGES } from "@/constants/messages";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

/**
 * Chat input component
 * Handles user input with submit button and keyboard shortcuts
 */
export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  disabled = false,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="border-border bg-card cyber-border border-t">
      <div className="container mx-auto max-w-4xl px-4 py-4">
        <form onSubmit={onSubmit} className="relative">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={MESSAGES.PLACEHOLDERS.INPUT}
            className="cyber-border max-h-[200px] min-h-[60px] resize-none bg-black pr-12 text-white placeholder:text-gray-400"
            disabled={isLoading || disabled}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!value.trim() || isLoading || disabled}
            className="absolute right-2 bottom-2 rounded-lg bg-black text-white hover:bg-gray-800"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        <p className="text-muted-foreground terminal-text mt-2 text-center text-xs">
          {MESSAGES.SYSTEM.SECURITY_NOTICE}
        </p>
      </div>
    </div>
  );
}
