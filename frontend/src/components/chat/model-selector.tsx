import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings2, ChevronDown } from "lucide-react";
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
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const fetchModels = async () => {
    try {
      const data = await llmService.getConfig();
      setModels(data);
      // Select first active model if none selected
      if (!selectedModelId && data.length > 0) {
        setSelectedModelId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch models", error);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleSelectModel = async (modelId: string) => {
    setSelectedModelId(modelId);
    try {
      await llmService.selectModel(modelId);
    } catch (error) {
      console.error("Failed to select model", error);
    }
  };

  const selectedModel = models.find(m => m.id === selectedModelId);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 cyber-border terminal-text min-w-[140px] justify-between">
            <span className="truncate">{selectedModel?.name || "Select Model"}</span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px] bg-card cyber-border">
          <DropdownMenuLabel>Available Models</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {models.map((model) => (
            <DropdownMenuItem 
              key={model.id}
              onClick={() => handleSelectModel(model.id)}
              className="cursor-pointer justify-between"
            >
              <span>{model.name}</span>
              {selectedModelId === model.id && <span className="text-primary text-xs">●</span>}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setIsManagerOpen(true)}
            className="cursor-pointer text-primary focus:text-primary"
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Manage Models
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
