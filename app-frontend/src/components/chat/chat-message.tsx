"use client";

import { cn } from "@/lib/utils";
import { User, Loader2, Activity, CheckCircle, VenetianMask } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { AnimatedDiagram } from "../diagram/animated-diagram";
import { MESSAGES } from "@/constants/messages";
import type { ChatMessage as ChatMessageType } from "@/types/chat.types";
import { ApprovalMessage } from "./approval-message";

interface ChatMessageProps {
  message: ChatMessageType;
  isLoading?: boolean;
  currentAnimationStep?: number;
  isAnimating?: boolean;
  onRefresh?: () => void;
}

/**
 * Chat message component
 * Displays user or assistant messages with optional animations and diagrams
 */
export function ChatMessage({
  message,
  isLoading = false,
  currentAnimationStep = 0,
  isAnimating = false,
  onRefresh,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const { content, animationSteps = [], diagram, pending_approval, thread_id } = message;

  return (
    <div className={cn("group flex gap-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex flex-shrink-0 items-start">
          <div className="bg-secondary cyber-border flex h-10 w-10 items-center justify-center rounded-lg">
            <VenetianMask className="text-secondary-foreground h-5 w-5" />
          </div>
        </div>
      )}

      <div className={cn("flex max-w-[80%] flex-col gap-2 sm:max-w-[70%]", isUser && "items-end")}>
        {/* Render Approval Card if pending approval exists */}
        {pending_approval && thread_id && (
          <div className="mb-4 w-full">
            <ApprovalMessage
              threadId={thread_id}
              pendingApproval={pending_approval}
              onActionComplete={onRefresh}
            />
          </div>
        )}

        <div
          className={cn(
            "cyber-border rounded-lg px-4 py-3 text-sm leading-relaxed",
            isUser ? "bg-black text-white" : "bg-muted text-foreground terminal-text",
            !isUser && (isLoading || isAnimating) && "scan-line"
          )}
        >
          {/* ... existing content rendering ... */}
          {animationSteps.length > 0 ? (
            <div className="space-y-4">
              {/* ... existing animation steps ... */}
              {/* Animated Diagram */}
              {diagram && (
                <div className="mb-4">
                  <AnimatedDiagram
                    nodes={diagram.nodes}
                    edges={diagram.edges}
                    currentStep={currentAnimationStep}
                    isAnimating={isAnimating}
                    className="w-full"
                  />
                </div>
              )}

              {/* Animation Steps */}
              <div className="space-y-2">
                {animationSteps.map((step, index) => {
                  const isActive = index === currentAnimationStep - 1 && isAnimating;
                  const isCompleted = index < currentAnimationStep - 1 || (!isAnimating && content);

                  return (
                    <div
                      key={step.step}
                      className={cn(
                        "flex items-start gap-3 rounded p-2 transition-all duration-300",
                        isActive && "border border-blue-500/20 bg-blue-500/10",
                        isCompleted && "border border-sky-500/20 bg-sky-500/10"
                      )}
                      style={{ backgroundColor: step.bgColor + "30" }}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-sky-400" />
                        ) : isActive ? (
                          <Activity className="h-4 w-4 animate-spin text-blue-400" />
                        ) : (
                          <div className="border-muted-foreground/30 h-4 w-4 rounded-full border-2" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="terminal-text text-xs font-medium">
                            {step.icon} {step.title}
                          </span>
                          {isActive && (
                            <div className="flex gap-1">
                              <div
                                className="h-1 w-1 animate-bounce rounded-full bg-blue-400"
                                style={{ animationDelay: "0ms" }}
                              />
                              <div
                                className="h-1 w-1 animate-bounce rounded-full bg-blue-400"
                                style={{ animationDelay: "150ms" }}
                              />
                              <div
                                className="h-1 w-1 animate-bounce rounded-full bg-blue-400"
                                style={{ animationDelay: "300ms" }}
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-muted-foreground terminal-text text-xs">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {content && (
                <div className="border-border mt-4 border-t pt-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ) : isLoading ? (
            <div className="terminal-text flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
              <span className="text-muted-foreground">{MESSAGES.SYSTEM.PROCESSING}</span>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {isUser ? (
                <span>{content}</span>
              ) : (
                <ReactMarkdown>{content || "\u00A0"}</ReactMarkdown>
              )}
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex flex-shrink-0 items-start">
          <div className="bg-secondary cyber-border flex h-10 w-10 items-center justify-center rounded-lg">
            <User className="text-secondary-foreground h-5 w-5" />
          </div>
        </div>
      )}
    </div>
  );
}
