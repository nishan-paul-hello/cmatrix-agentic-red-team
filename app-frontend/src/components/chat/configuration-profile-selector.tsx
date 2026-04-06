import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { llmService, ConfigurationProfile } from "@/lib/api/llm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ConfigurationProfileSelectorProps {
  onProfileChange?: () => void;
  onActiveProfileChange?: (profile: ConfigurationProfile | null) => void;
}

export function ConfigurationProfileSelector({
  onProfileChange,
  onActiveProfileChange,
}: ConfigurationProfileSelectorProps) {
  const [profiles, setProfiles] = useState<ConfigurationProfile[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchProfiles = async () => {
    try {
      const data = await llmService.getProfiles();
      setProfiles(data);
    } catch (error) {
      console.error("Failed to fetch profiles", error);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await llmService.getProfiles();
        if (!cancelled) setProfiles(data);
      } catch (error) {
        console.error("Failed to fetch profiles", error);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleActivateProfile = async (profileId: number) => {
    try {
      await llmService.activateProfile(profileId);
      await fetchProfiles();
      setIsDropdownOpen(false);
      onProfileChange?.();
    } catch (error) {
      console.error("Failed to activate profile", error);
    }
  };

  const activeProfile = profiles.find((p) => p.is_active);

  useEffect(() => {
    if (activeProfile && onActiveProfileChange) {
      onActiveProfileChange(activeProfile);
    } else if (!activeProfile && onActiveProfileChange) {
      // Handle case where no profile is active
      onActiveProfileChange(null);
    }
  }, [activeProfile, onActiveProfileChange]); // Only trigger if active profile changes

  const hasProfiles = profiles.length > 0;

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0} className="inline-block">
              {" "}
              {/* Wrapper for disabled button tooltip */}
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="cyber-border terminal-text min-w-[180px] cursor-pointer justify-between gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => {
                    fetchProfiles();
                  }}
                  disabled={!hasProfiles}
                >
                  <span className="truncate">{activeProfile?.name || "Load Configuration"}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
            </span>
          </TooltipTrigger>
          {!hasProfiles && (
            <TooltipContent>
              <p>
                Setup Required • Open Settings <span className="text-primary">⚙️</span>
              </p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent
        align="start"
        className="bg-card cyber-border custom-scrollbar max-h-[400px] w-[320px] overflow-y-auto"
      >
        {profiles.length === 0 ? (
          <div className="text-muted-foreground px-4 py-8 text-center text-sm">
            No profiles configured. Click Settings to create one.
          </div>
        ) : (
          profiles.map((profile) => {
            const isActive = activeProfile?.id === profile.id;
            return (
              <DropdownMenuItem
                key={profile.id}
                className={`focus:bg-secondary/50 cursor-pointer p-3 ${
                  isActive ? "bg-primary/10" : ""
                }`}
                onClick={() => handleActivateProfile(profile.id)}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{profile.name}</div>
                    <div className="text-muted-foreground truncate text-xs">
                      {profile.api_provider} • {profile.selected_model_name || "No model"}
                    </div>
                  </div>
                  {isActive && <CheckCircle2 className="text-primary ml-2 h-5 w-5 flex-shrink-0" />}
                </div>
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
