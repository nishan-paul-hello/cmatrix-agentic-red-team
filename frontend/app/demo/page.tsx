"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Zap } from "lucide-react";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { useScrollToBottom } from "@/lib/hooks";
import { useChatStream } from "@/features/chat/hooks/use-chat-stream";
import { ROUTES } from "@/constants/routes";

/**
 * Demo page
 * Interactive demonstration with preset prompts
 */
export default function DemoPage() {
  const {
    messages,
    isLoading,
    isAnimating,
    currentAnimationStep,
    sendMessage,
    setInput,
    input,
  } = useChatStream();

  const { ref: messagesEndRef } = useScrollToBottom([messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    await sendMessage(userMessage);
  };

  const resetDemo = () => {
    window.location.reload();
  };

  // Demo prompt suggestions
  const demoPrompts = [
    "Can you perform a security scan on my web server at 192.168.1.100 to check for any vulnerabilities?",
    "What's the current status of the nginx service on my server?",
    "Please analyze the nginx access logs for any errors or unusual activity in the last 24 hours.",
    "Deploy the updated firewall configuration to the production environment.",
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="matrix-rain"></div>

      {/* Header */}
      <header className="border-b border-border bg-card cyber-border scan-line">
        <div className="container flex items-center justify-between h-14 px-4 mx-auto">
          <div className="flex items-center gap-3">
            <Link href={ROUTES.HOME} className="cursor-pointer">
              <Button variant="ghost" size="icon" className="cyber-border cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary cyber-border">
              <Shield className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold terminal-text">CMatrix Demo</h1>
              <div className="text-xs text-muted-foreground">Interactive Demonstration</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Button
                onClick={resetDemo}
                variant="outline"
                size="sm"
                className="cyber-border terminal-text"
              >
                Reset Demo
              </Button>
            )}
            <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse"></div>
            <div className="text-xs text-muted-foreground terminal-text">DEMO MODE</div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-4xl px-4 py-8 mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-8 py-12">
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary cyber-border">
                  <Zap className="w-10 h-10 text-secondary-foreground" />
                </div>
                <div className="text-left">
                  <h2 className="text-4xl font-bold text-balance terminal-text glow-primary">
                    Demo Mode
                  </h2>
                  <div className="text-sm text-muted-foreground terminal-text mt-2">
                    Try a demo prompt below
                  </div>
                </div>
              </div>
              <div className="text-center space-y-4">
                <p className="text-muted-foreground text-pretty max-w-md terminal-text">
                  Enter one of the demo prompts to see animated visualizations and workflow diagrams.
                </p>
              </div>
              <div className="grid gap-3 mt-4 sm:grid-cols-2 w-full max-w-2xl">
                {demoPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(prompt)}
                    className="px-4 py-3 text-sm text-left transition-colors border rounded-lg border-border hover:bg-accent hover:text-accent-foreground cyber-border cursor-pointer"
                  >
                    <div className="font-medium terminal-text line-clamp-2">{prompt}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message}
                  currentAnimationStep={currentAnimationStep}
                  isAnimating={
                    isAnimating &&
                    index === messages.length - 1 &&
                    message.role === "assistant"
                  }
                />
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <ChatMessage
                  message={{ role: "assistant", content: "" }}
                  isLoading
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
