// @ts-nocheck
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings2, ChevronDown, Key, CheckCircle2 } from "lucide-react";
import { llmService, LLMModel } from "@/lib/api/llm";
import { ModelManagerModal } from "./model-manager-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModelSelector() {
  const [models, setModels] = useState<LLMModel[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const fetchModels = async () => {
    try {
      const data = await llmService.getModels();
      setModels(data);
      // Select active model if exists
      const activeModel = data.find(m => m.is_active);
      if (activeModel) {
        setSelectedModelId(activeModel.id);
      } else if (!selectedModelId && data.length > 0) {
        // If no active model, select first one with API key
        const modelWithKey = data.find(m => m.has_api_key);
        if (modelWithKey) {
          setSelectedModelId(modelWithKey.id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch models", error);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleSelectModel = async (modelId: number) => {
    setSelectedModelId(modelId);
    try {
      await llmService.activateModel(modelId);
      // Refresh to get updated active status
      await fetchModels();
    } catch (error) {
      console.error("Failed to activate model", error);
    }
  };

  const selectedModel = models.find(m => m.id === selectedModelId);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 cyber-border terminal-text min-w-[180px] justify-between">
            <span className="truncate flex items-center gap-2">
              {selectedModel?.is_active && <CheckCircle2 className="w-3 h-3 text-green-500" />}
              {selectedModel?.name || "Select Model"}
            </span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[250px] bg-card cyber-border">
          <DropdownMenuLabel>Available Models</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {models.map((model) => (
            <DropdownMenuItem 
              key={model.id}
              onClick={() => handleSelectModel(model.id)}
              className="cursor-pointer justify-between flex-col items-start gap-1"
              disabled={!model.has_api_key}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{model.name}</span>
                <div className="flex items-center gap-1">
                  {model.has_api_key ? (
                    <Key className="w-3 h-3 text-green-500" />
                  ) : (
                    <Key className="w-3 h-3 text-muted-foreground" />
                  )}
                  {model.is_active && <CheckCircle2 className="w-3 h-3 text-primary" />}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{model.provider}</span>
              {!model.has_api_key && (
                <span className="text-xs text-destructive">No API key configured</span>
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setIsManagerOpen(true)}
            className="cursor-pointer text-primary focus:text-primary"
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Manage API Keys
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModelManagerModal 
        isOpen={isManagerOpen} 
        onClose={() => setIsManagerOpen(false)} 
        onModelChange={fetchModels}
      />
    </>
  );
}
