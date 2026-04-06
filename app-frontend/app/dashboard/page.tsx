"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { ConversationProvider } from "@/contexts/conversation-context";
import { DashboardTable } from "@/features/dashboard/components/DashboardTable";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

function DashboardContent() {
  const { history, isLoading, search, setSearch, deleteExchange } = useDashboard();

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
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your conversation history and messages.
              </p>
            </div>

            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <DashboardTable
                data={history}
                isLoading={isLoading}
                search={search}
                onSearchChange={setSearch}
                onDelete={deleteExchange}
              />
            </div>
          </div>
        </main>
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
