"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { WelcomeScreen } from "@/components/chat/welcome-screen";
import { ConversationSidebar } from "@/components/sidebar/conversation-sidebar";
import { ConversationProvider } from "@/contexts/conversation-context";
import { useScrollToBottom } from "@/lib/hooks";
import { useChatStream } from "@/features/chat/hooks/use-chat-stream";

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
  } = useChatStream();

  const { ref: messagesEndRef } = useScrollToBottom([messages]);

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

  return (
    <div className="flex h-screen bg-background">
      <div className="matrix-rain"></div>

      {/* Sidebar */}
      <ConversationSidebar className="w-80 flex-shrink-0" />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <ChatHeader />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="container max-w-4xl px-4 py-8 mx-auto">
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
