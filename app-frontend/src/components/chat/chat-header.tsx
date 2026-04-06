"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, ChevronDown, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MESSAGES } from "@/constants/messages";
import { siteConfig } from "@/config/site.config";
import { useAuth } from "@/contexts/auth-context";
import { BrandLogo } from "@/components/brand-logo";
import { ConfigurationProfileSelector } from "./configuration-profile-selector";
import { ModelDropdown } from "./model-dropdown";
import { SettingsSidebar } from "./settings-sidebar";
import { useState } from "react";
import { ConfigurationProfile } from "@/lib/api/llm";

export function ChatHeader() {
  const { user, logout } = useAuth();
  const [activeProfile, setActiveProfile] = useState<ConfigurationProfile | null>(null);
  const [isSettingsSidebarOpen, setIsSettingsSidebarOpen] = useState(false);

  return (
    <header className="border-border bg-card cyber-border border-b">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="bg-secondary/10 cyber-border flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg">
            <BrandLogo size={24} />
          </div>
          <div>
            <h1 className="terminal-text text-lg font-semibold">{siteConfig.name}</h1>
            <div className="text-muted-foreground text-xs">{MESSAGES.LABELS.NEURAL_INTERFACE}</div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ConfigurationProfileSelector
              onActiveProfileChange={setActiveProfile}
              onProfileChange={() => {
                // Refresh profiles when changed
              }}
            />
            <ModelDropdown activeProfile={activeProfile} />
            <Button
              variant="outline"
              size="sm"
              asChild
              className="cyber-border terminal-text hover:bg-secondary/50 cursor-pointer transition-colors"
            >
              <a href="/dashboard">Dashboard</a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="cyber-border terminal-text hover:bg-secondary/50 cursor-pointer transition-colors"
            >
              <a href="/tools/cve" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                CVE Search
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsSidebarOpen(true)}
              className="cyber-border terminal-text hover:bg-secondary/50 cursor-pointer transition-colors"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-secondary/50 flex cursor-pointer items-center gap-2 px-3 py-1 transition-colors"
                >
                  <User className="text-primary h-4 w-4" />
                  <span className="text-foreground text-sm">{user.username}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card cyber-border w-48">
                <DropdownMenuItem
                  onClick={logout}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <SettingsSidebar
        isOpen={isSettingsSidebarOpen}
        onClose={() => setIsSettingsSidebarOpen(false)}
        onProfilesChange={() => {
          // Profiles will be refreshed automatically by the selector
        }}
      />
    </header>
  );
}
