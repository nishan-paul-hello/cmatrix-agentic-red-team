import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  Upload,
  Download,
  Plus,
  Trash2,
  Save,
  Loader2,
  Edit2,
  Key,
  Sparkles,
  Filter,
} from "lucide-react";
import {
  llmService,
  ConfigurationProfile,
  Provider,
  AvailableModel,
  UpdateProfileRequest,
} from "@/lib/api/llm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onProfilesChange: () => void;
}

export function SettingsSidebar({ isOpen, onClose, onProfilesChange }: SettingsSidebarProps) {
  const [profiles, setProfiles] = useState<ConfigurationProfile[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<number | null>(null);
  const [selectedProviderFilter, setSelectedProviderFilter] = useState<string>("all");

  // Form state
  const [profileName, setProfileName] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [availableModels, setAvailableModels] = useState<AvailableModel[]>([]);
  const [selectedModelName, setSelectedModelName] = useState("");
  const [isFetchingModels, setIsFetchingModels] = useState(false);

  const fetchProfiles = async () => {
    try {
      const data = await llmService.getProfiles();
      setProfiles(data);
    } catch (error) {
      console.error("Failed to fetch profiles", error);
    }
  };

  const fetchProviders = async () => {
    try {
      const data = await llmService.getProviders();
      setProviders(data.providers);
    } catch (error) {
      console.error("Failed to fetch providers", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProfiles();
      fetchProviders();
    }
  }, [isOpen]);

  const resetForm = () => {
    setProfileName("");
    setSelectedProvider("");
    setApiKey("");
    setAvailableModels([]);
    setSelectedModelName("");
    setIsCreating(false);
    setEditingProfileId(null);
  };

  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedProvider) return;

      // Case 1: User provided a new API key
      if (apiKey) {
        setIsFetchingModels(true);
        try {
          const response = await llmService.fetchModels(selectedProvider, apiKey);
          setAvailableModels(response.models);
        } catch (error) {
          console.error("Failed to fetch models", error);
          setAvailableModels([]);
        } finally {
          setIsFetchingModels(false);
        }
      }
      // Case 2: Editing existing profile (using stored key)
      else if (editingProfileId) {
        const profile = profiles.find((p) => p.id === editingProfileId);
        // Only fetch if the selected provider matches the profile's provider
        if (profile && profile.api_provider === selectedProvider) {
          setIsFetchingModels(true);
          try {
            const response = await llmService.fetchProfileModels(editingProfileId);
            setAvailableModels(response.models);
          } catch (error) {
            console.error("Failed to fetch stored models", error);
          } finally {
            setIsFetchingModels(false);
          }
        }
      }
    };

    // Debounce only if typing API key
    if (apiKey) {
      const timer = setTimeout(fetchModels, 800);
      return () => clearTimeout(timer);
    } else {
      fetchModels();
    }
  }, [selectedProvider, apiKey, editingProfileId, profiles]);

  const handleSaveProfile = async () => {
    // Validation logic
    const isEditing = !!editingProfileId;
    const profile = profiles.find((p) => p.id === editingProfileId);
    const isProviderChanged = isEditing && profile?.api_provider !== selectedProvider;

    // Require API key if:
    // 1. Creating a new profile
    // 2. Editing and provider changed
    // 3. Editing and user explicitly cleared/changed key (handled by apiKey state being non-empty if typed, but here we check if it's required)
    // Actually, if apiKey is empty string, it means user didn't type anything.

    const isApiKeyRequired = !isEditing || isProviderChanged;

    if (!profileName || !selectedProvider || (isApiKeyRequired && !apiKey)) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (editingProfileId) {
        const updateData: UpdateProfileRequest = {
          name: profileName,
          api_provider: selectedProvider,
          selected_model_name: selectedModelName,
        };

        // Only include API key if user entered one
        if (apiKey) {
          updateData.api_key = apiKey;
        }

        await llmService.updateProfile(editingProfileId, updateData);
      } else {
        await llmService.createProfile({
          name: profileName,
          api_provider: selectedProvider,
          api_key: apiKey,
          selected_model_name: selectedModelName,
        });
      }

      resetForm();
      await fetchProfiles();
      onProfilesChange();
    } catch (error) {
      console.error("Failed to save profile", error);
      alert("Failed to save profile");
    }
  };

  const handleEditProfile = (profile: ConfigurationProfile) => {
    setEditingProfileId(profile.id);
    setProfileName(profile.name);
    setSelectedProvider(profile.api_provider);
    setSelectedModelName(profile.selected_model_name || "");
    setIsCreating(true);
  };

  const handleActivateProfile = async (profileId: number) => {
    try {
      await llmService.activateProfile(profileId);
      await fetchProfiles();
      onProfilesChange();
    } catch (error) {
      console.error("Failed to activate profile", error);
    }
  };

  const handleDeleteProfile = async (profileId: number) => {
    if (!confirm("Are you sure you want to delete this profile?")) return;
    try {
      await llmService.deleteProfile(profileId);
      await fetchProfiles();
      onProfilesChange();
    } catch (error) {
      console.error("Failed to delete profile", error);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await llmService.importConfig(file);
      await fetchProfiles();
      onProfilesChange();
      alert("Configuration imported successfully!");
    } catch (error) {
      console.error("Failed to import config", error);
      alert("Failed to import configuration");
    }
  };

  const handleExport = async () => {
    try {
      const config = await llmService.exportConfig();
      const blob = new Blob([JSON.stringify(config, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "llm-config.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export config", error);
    }
  };

  // Filter profiles by provider
  const filteredProfiles =
    selectedProviderFilter === "all"
      ? profiles
      : profiles.filter((p) => p.api_provider === selectedProviderFilter);

  // Group profiles by provider for display
  const profilesByProvider = profiles.reduce(
    (acc, profile) => {
      if (!acc[profile.api_provider]) {
        acc[profile.api_provider] = [];
      }
      acc[profile.api_provider].push(profile);
      return acc;
    },
    {} as Record<string, ConfigurationProfile[]>
  );

  // Get provider name from ID
  const getProviderName = (providerId: string) => {
    return providers.find((p) => p.id === providerId)?.name || providerId;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="from-card via-card to-card/95 border-border/50 animate-in slide-in-from-right fixed top-0 right-0 flex h-full w-full max-w-xl flex-col overflow-hidden border-l bg-gradient-to-br shadow-2xl duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-border/50 bg-muted/20 flex-shrink-0 border-b px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-secondary rounded-lg p-1.5">
                <Sparkles className="text-primary/80 h-4 w-4" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">LLM Configuration</h2>
                <p className="text-muted-foreground mt-0.5 text-xs">Provider Configurations</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Import/Export Section */}
          <div className="mb-6">
            <div className="bg-secondary/30 border-border/50 flex items-center gap-2 rounded-lg border p-3">
              <div className="flex flex-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="hover:bg-primary/10 hover:text-primary hover:border-primary/50 cursor-pointer transition-all"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <label>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="hover:bg-primary/10 hover:text-primary hover:border-primary/50 cursor-pointer transition-all"
                  >
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Import
                    </span>
                  </Button>
                  <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                </label>
              </div>
              <div className="text-foreground/80 text-xs font-medium">
                Backup & restore configurations
              </div>
            </div>
          </div>

          {/* Profiles Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Saved Configurations</h3>
              </div>
              <Button
                onClick={() => {
                  resetForm();
                  setIsCreating(true);
                }}
                size="sm"
                className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-primary/10 hover:border-primary hover:shadow-primary/25 h-7 cursor-pointer rounded-full border px-3 text-xs font-medium shadow-sm transition-all duration-300 active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                New
              </Button>
            </div>

            {/* Provider Filter */}
            {profiles.length > 0 && (
              <div className="bg-secondary/20 border-border/30 flex items-center gap-2 rounded-lg border p-2.5">
                <Filter className="text-muted-foreground h-3.5 w-3.5" />
                <Select value={selectedProviderFilter} onValueChange={setSelectedProviderFilter}>
                  <SelectTrigger className="bg-background/50 border-border/50 h-7 w-[160px] cursor-pointer text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="cursor-pointer">
                      All Providers ({profiles.length})
                    </SelectItem>
                    {Object.keys(profilesByProvider).map((providerId) => (
                      <SelectItem key={providerId} value={providerId} className="cursor-pointer">
                        {getProviderName(providerId)} ({profilesByProvider[providerId].length})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* New Profile Form (Inline) */}
            {isCreating && !editingProfileId && (
              <div className="border-border bg-muted/30 animate-in fade-in slide-in-from-top-4 space-y-3 rounded-lg border p-4 shadow-sm duration-200">
                <div className="mb-1 flex items-center justify-between">
                  <h4 className="flex items-center gap-1.5 text-sm font-semibold">
                    <Plus className="text-primary h-3.5 w-3.5" />
                    New Configuration
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetForm}
                    className="text-muted-foreground hover:text-foreground h-7 cursor-pointer text-xs"
                  >
                    Cancel
                  </Button>
                </div>

                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Profile name *"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="bg-background/50 h-9 text-sm"
                      autoComplete="off"
                    />

                    <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                      <SelectTrigger className="bg-background/50 h-9 cursor-pointer text-sm">
                        <SelectValue placeholder="Provider *" />
                      </SelectTrigger>
                      <SelectContent>
                        {providers.map((provider) => (
                          <SelectItem
                            key={provider.id}
                            value={provider.id}
                            className="cursor-pointer"
                          >
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Input
                    type="password"
                    placeholder="API Key *"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-background/50 h-9 font-mono text-xs"
                    autoComplete="off"
                  />

                  <Select
                    value={selectedModelName}
                    onValueChange={setSelectedModelName}
                    disabled={isFetchingModels}
                  >
                    <SelectTrigger className="bg-background/50 h-9 cursor-pointer text-sm">
                      {isFetchingModels ? (
                        <div className="text-muted-foreground flex items-center">
                          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                          Loading models...
                        </div>
                      ) : (
                        <SelectValue placeholder="Select model (optional)" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {!selectedProvider && !apiKey ? (
                        <div className="flex flex-col items-center justify-center px-2 py-3 text-center">
                          <span className="text-muted-foreground text-xs">
                            Please select a provider and enter an API key
                          </span>
                        </div>
                      ) : !selectedProvider ? (
                        <div className="flex flex-col items-center justify-center px-2 py-3 text-center">
                          <span className="text-muted-foreground text-xs">
                            Please select a provider first
                          </span>
                        </div>
                      ) : !apiKey ? (
                        <div className="flex flex-col items-center justify-center px-2 py-3 text-center">
                          <span className="text-muted-foreground text-xs">
                            Please enter an API key first
                          </span>
                        </div>
                      ) : availableModels.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-2 py-3 text-center">
                          <span className="text-muted-foreground text-xs">
                            {isFetchingModels ? "Loading models..." : "No models available"}
                          </span>
                        </div>
                      ) : (
                        availableModels.map((model) => (
                          <SelectItem key={model.id} value={model.id} className="cursor-pointer">
                            {model.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSaveProfile}
                  disabled={!profileName || !selectedProvider || !apiKey}
                  className="h-9 w-full cursor-pointer"
                  size="sm"
                >
                  <Save className="mr-2 h-3.5 w-3.5" />
                  Create Configuration
                </Button>
              </div>
            )}

            {/* Profiles List */}
            {filteredProfiles.length === 0 && !isCreating ? (
              <div className="px-4 py-12 text-center">
                <div className="bg-secondary/50 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
                  <Sparkles className="text-muted-foreground h-8 w-8" />
                </div>
                <h4 className="mb-2 text-lg font-medium">No configurations found</h4>
                <p className="text-muted-foreground mb-6 text-sm">
                  Initialize a new provider setup to enable inference
                </p>
                <Button onClick={() => setIsCreating(true)} className="cursor-pointer">
                  <Plus className="mr-2 h-4 w-4" />
                  New Configuration
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredProfiles.map((profile) => {
                  const isEditing = editingProfileId === profile.id;

                  return (
                    <div
                      key={profile.id}
                      className={`group relative rounded-xl border transition-all duration-200 ${
                        isEditing
                          ? "border-primary/30 bg-muted/30 shadow-md"
                          : profile.is_active
                            ? "border-primary/30 bg-primary/5 shadow-sm hover:shadow-md"
                            : "border-border/40 bg-card hover:border-border/60 hover:bg-secondary/20 hover:shadow-sm"
                      }`}
                    >
                      {isEditing ? (
                        // Inline Edit Form
                        <div className="animate-in fade-in space-y-3 p-4 duration-200">
                          <div className="mb-1 flex items-center justify-between">
                            <h4 className="flex items-center gap-1.5 text-sm font-semibold">
                              <Edit2 className="text-primary h-3.5 w-3.5" />
                              Edit Configuration
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={resetForm}
                              className="text-muted-foreground hover:text-foreground h-7 cursor-pointer text-xs"
                            >
                              Cancel
                            </Button>
                          </div>

                          <div className="space-y-2.5">
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                placeholder="Profile name *"
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                className="bg-background/50 h-9 text-sm"
                                autoComplete="off"
                              />

                              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                                <SelectTrigger className="bg-background/50 h-9 cursor-pointer text-sm">
                                  <SelectValue placeholder="Provider *" />
                                </SelectTrigger>
                                <SelectContent>
                                  {providers.map((provider) => (
                                    <SelectItem
                                      key={provider.id}
                                      value={provider.id}
                                      className="cursor-pointer"
                                    >
                                      {provider.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <Input
                              type="password"
                              placeholder="API Key * (leave empty to keep current)"
                              value={apiKey}
                              onChange={(e) => setApiKey(e.target.value)}
                              className="bg-background/50 h-9 font-mono text-xs"
                              autoComplete="off"
                            />

                            <Select
                              value={selectedModelName}
                              onValueChange={setSelectedModelName}
                              disabled={isFetchingModels}
                            >
                              <SelectTrigger className="bg-background/50 h-9 cursor-pointer text-sm">
                                {isFetchingModels ? (
                                  <div className="text-muted-foreground flex items-center">
                                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                    Loading models...
                                  </div>
                                ) : (
                                  <SelectValue placeholder="Select model (optional)" />
                                )}
                              </SelectTrigger>
                              <SelectContent>
                                {!selectedProvider && !apiKey ? (
                                  <div className="flex flex-col items-center justify-center px-2 py-3 text-center">
                                    <span className="text-muted-foreground text-xs">
                                      Please select a provider and enter an API key
                                    </span>
                                  </div>
                                ) : !selectedProvider ? (
                                  <div className="flex flex-col items-center justify-center px-2 py-3 text-center">
                                    <span className="text-muted-foreground text-xs">
                                      Please select a provider first
                                    </span>
                                  </div>
                                ) : !apiKey &&
                                  profiles.find((p) => p.id === editingProfileId)?.api_provider !==
                                    selectedProvider ? (
                                  <div className="flex flex-col items-center justify-center px-2 py-3 text-center">
                                    <span className="text-muted-foreground text-xs">
                                      Please enter an API key first
                                    </span>
                                  </div>
                                ) : availableModels.length === 0 ? (
                                  <div className="flex flex-col items-center justify-center px-2 py-3 text-center">
                                    <span className="text-muted-foreground text-xs">
                                      {isFetchingModels
                                        ? "Loading models..."
                                        : "No models available"}
                                    </span>
                                  </div>
                                ) : (
                                  availableModels.map((model) => (
                                    <SelectItem
                                      key={model.id}
                                      value={model.id}
                                      className="cursor-pointer"
                                    >
                                      {model.name}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          <Button
                            onClick={handleSaveProfile}
                            disabled={!profileName || !selectedProvider}
                            className="h-9 w-full cursor-pointer"
                            size="sm"
                          >
                            <Save className="mr-2 h-3.5 w-3.5" />
                            Update Configuration
                          </Button>
                        </div>
                      ) : (
                        // Profile Display
                        <div className="px-3.5 py-3">
                          <div className="flex items-center gap-3">
                            {/* Status Indicator & Icon */}
                            <div className="relative flex-shrink-0">
                              <div
                                className={`rounded-lg p-2 transition-colors ${
                                  profile.is_active ? "bg-primary/10" : "bg-secondary"
                                }`}
                              >
                                <Key
                                  className={`h-4 w-4 ${
                                    profile.is_active ? "text-primary" : "text-muted-foreground"
                                  }`}
                                />
                              </div>
                              {profile.is_active && (
                                <div className="bg-primary border-card absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2" />
                              )}
                            </div>

                            {/* Profile Info */}
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex items-center gap-2">
                                <h4 className="truncate text-sm font-semibold">{profile.name}</h4>
                              </div>
                              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                <span className="text-foreground/70 font-medium">
                                  {getProviderName(profile.api_provider)}
                                </span>
                                {profile.selected_model_name && (
                                  <>
                                    <span className="text-border">•</span>
                                    <span className="truncate">{profile.selected_model_name}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-shrink-0 items-center gap-2">
                              {profile.is_active ? (
                                <div className="bg-primary/10 text-primary border-primary/20 flex h-7 items-center justify-center rounded-md border px-3 text-xs font-medium select-none">
                                  Active
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleActivateProfile(profile.id)}
                                  className="border-primary/30 hover:bg-primary/10 hover:text-primary hover:border-primary/50 h-7 cursor-pointer px-3 text-xs transition-all"
                                >
                                  Active
                                </Button>
                              )}
                              <div className="flex items-center gap-0.5">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditProfile(profile)}
                                  className="text-muted-foreground hover:text-primary hover:bg-primary/10 h-8 w-8 cursor-pointer transition-colors"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteProfile(profile.id)}
                                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
