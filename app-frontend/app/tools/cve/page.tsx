"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { ConversationProvider } from "@/contexts/conversation-context";
import { CVESearchTool } from "@/components/tools/cve-search-tool";

function CVEToolContent() {
  return (
    <div className="bg-background flex h-screen">
      <div className="matrix-rain"></div>

      {/* Main Content Area */}
      <div className="bg-background flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <ChatHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-5xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">CVE Search Tool</h1>
              <p className="text-muted-foreground">
                Advanced vulnerability search with semantic reranking and self-correction
              </p>
            </div>

            <CVESearchTool />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function CVEToolPage() {
  return (
    <ConversationProvider>
      <CVEToolContent />
    </ConversationProvider>
  );
}
