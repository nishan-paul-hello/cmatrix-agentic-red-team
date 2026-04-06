"use client";

import React from "react";
import { Search, PanelLeft, SquarePen } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useConversations } from "@/contexts/conversation-context";
import { ConversationItem } from "./conversation-item";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ConversationSidebarProps {
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ConversationSidebar({
  className,
  isOpen = true,
  onToggle,
}: ConversationSidebarProps) {
  const { conversations, activeConversation, isLoading, createConversation, selectConversation } =
    useConversations();

  const [searchQuery] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  const filteredConversations = React.useMemo(() => {
    if (!searchQuery.trim()) return conversations;

    return conversations.filter((conversation) =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const handleCreateConversation = async () => {
    if (isCreating) return;

    try {
      setIsCreating(true);
      await createConversation();
    } catch (error) {
      console.error("Failed to create conversation:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectConversation = (
    conversation: import("@/types/conversation.types").Conversation
  ) => {
    selectConversation(conversation);
  };

  const SidebarItem = ({
    icon: Icon,
    label,
    onClick,
    active,
  }: {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
    active?: boolean;
  }) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "h-10 w-full cursor-pointer justify-start px-2",
              !isOpen && "justify-center px-0",
              active && "bg-secondary/50"
            )}
            onClick={onClick}
          >
            <Icon className={cn("h-5 w-5", isOpen && "mr-2")} />
            {isOpen && <span className="truncate">{label}</span>}
          </Button>
        </TooltipTrigger>
        {!isOpen && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div
      className={cn(
        "bg-sidebar custom-scrollbar flex h-full flex-col overflow-x-hidden overflow-y-auto",
        className
      )}
    >
      {/* Top Actions */}
      <div className="bg-sidebar sticky top-0 z-10 space-y-1 p-2">
        {/* Toggle & Brand/Logo area if needed */}
        <div
          className={cn(
            "flex items-center",
            isOpen ? "mb-2 justify-between px-2" : "mb-1 justify-center"
          )}
        >
          {isOpen && <span className="text-sm font-semibold">Chats</span>}
          {onToggle && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      isOpen
                        ? "h-8 w-8 cursor-ew-resize p-0"
                        : "h-10 w-full cursor-ew-resize justify-center"
                    )}
                    onClick={onToggle}
                  >
                    <PanelLeft className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {isOpen ? "Close sidebar" : "Open sidebar"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <SidebarItem icon={SquarePen} label="New chat" onClick={handleCreateConversation} />

        <SidebarItem
          icon={Search}
          label="Search chats"
          onClick={() => {}} // TODO: Implement search focus or modal
        />

        {/* Placeholder items from design */}
        {/* <SidebarItem icon={Library} label="Library" /> */}
        {/* <SidebarItem icon={FolderKanban} label="Projects" /> */}
      </div>

      {/* Conversations List */}
      <div className="flex-1">
        {isOpen && (
          <div className="text-muted-foreground px-4 py-2 text-xs font-semibold">Your chats</div>
        )}

        <div className="space-y-1 p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="border-primary h-4 w-4 animate-spin rounded-full border-b-2"></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            isOpen && (
              <div className="px-2 py-8 text-center">
                <p className="text-muted-foreground text-xs">No conversations yet</p>
              </div>
            )
          ) : (
            conversations.map((conversation) =>
              isOpen ? (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={activeConversation?.id === conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                />
              ) : // Mini item for closed state - just a clickable dot or initial if we had one,
              // but for now maybe just the Message icon or similar if we want to show history in closed state.
              // The user design shows icons in closed state.
              // Since we don't have icons per chat, we might just hide the list or show a generic history icon.
              // However, the user said "tiny sidebar should have icon for 'folding icon', 'new chat', 'search chats'".
              // It implies the list might NOT be visible or just not the main focus.
              // Let's hide the list items in closed state for now as per standard "folded" behavior unless specified otherwise.
              null
            )
          )}
        </div>
      </div>

      {/* User Profile or Bottom Actions could go here */}
    </div>
  );
}
