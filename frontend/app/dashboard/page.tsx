"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { ConversationSidebar } from "@/components/sidebar/conversation-sidebar";
import { ConversationProvider } from "@/contexts/conversation-context";
import { DashboardTable } from "@/features/dashboard/components/DashboardTable";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

function DashboardContent() {
  const {
    history,
    isLoading,
    search,
    setSearch,
    deleteHistoryItem,
    clearConversationHistory,
  } = useDashboard();

  return (
    <div className="flex h-screen bg-background">
      <div className="matrix-rain"></div>

      {/* Sidebar */}
      <ConversationSidebar className="w-80 flex-shrink-0" />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <ChatHeader />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="container max-w-6xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your conversation history and messages.
              </p>
            </div>

            <div className="bg-card rounded-lg border shadow-sm p-6">
              <DashboardTable
                data={history}
                isLoading={isLoading}
                search={search}
                onSearchChange={setSearch}
                onDelete={deleteHistoryItem}
                onClearHistory={clearConversationHistory}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ConversationProvider>
      <DashboardContent />
    </ConversationProvider>
  );
}
