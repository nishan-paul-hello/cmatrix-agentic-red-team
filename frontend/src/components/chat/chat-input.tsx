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
    <div className="border-t border-border bg-card cyber-border">
      <div className="container max-w-4xl px-4 py-4 mx-auto">
        <form onSubmit={onSubmit} className="relative">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={MESSAGES.PLACEHOLDERS.INPUT}
            className="pr-12 resize-none min-h-[60px] max-h-[200px] cyber-border bg-black text-white placeholder:text-gray-400"
            disabled={isLoading || disabled}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!value.trim() || isLoading || disabled}
            className="absolute bottom-2 right-2 rounded-lg bg-black text-white hover:bg-gray-800"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
        <p className="mt-2 text-xs text-center text-muted-foreground terminal-text">
          {MESSAGES.SYSTEM.SECURITY_NOTICE}
        </p>
      </div>
    </div>
  );
}
