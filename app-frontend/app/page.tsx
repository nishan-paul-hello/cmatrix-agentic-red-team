"use client";

import { useState } from "react";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { WelcomeScreen } from "@/components/chat/welcome-screen";
import { ConversationSidebar } from "@/components/sidebar/conversation-sidebar";
import { ConversationProvider } from "@/contexts/conversation-context";
import { useScrollToBottom } from "@/lib/hooks";
import { useChatStream } from "@/features/chat/hooks/use-chat-stream";
import { cn } from "@/lib/utils";

/**
 * Main chat page
 * Handles the chat interface with streaming responses and conversation management
 */
function ChatContent() {
  const {
    messages,
    isLoading,
    isAnimating,
    currentAnimationStep,
    sendMessage,
    setInput,
    input,
    refreshMessages,
  } = useChatStream();

  const { ref: messagesEndRef } = useScrollToBottom([messages]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    await sendMessage(userMessage);
  };

  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <div className="matrix-rain"></div>

      {/* Sidebar */}
      <div
        className={cn(
          "border-border bg-sidebar flex-shrink-0 border-r transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-[260px]" : "w-[60px]"
        )}
      >
        <ConversationSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} className="h-full" />
      </div>

      {/* Main Chat Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <ChatHeader />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-4xl px-4 py-8">
            {messages.length === 0 ? (
              <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    message={message}
                    currentAnimationStep={currentAnimationStep}
                    isAnimating={
                      isAnimating && index === messages.length - 1 && message.role === "assistant"
                    }
                    onRefresh={refreshMessages}
                  />
                ))}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <ChatMessage message={{ role: "assistant", content: "" }} isLoading />
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
    </div>
  );
}

export default function ChatPage() {
  return (
    <ConversationProvider>
      <ChatContent />
    </ConversationProvider>
  );
}
