import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Save, X } from "lucide-react";
import { llmService, LLMModel } from "@/lib/api/llm";

interface ModelManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onModelChange: () => void;
}

export function ModelManagerModal({ isOpen, onClose, onModelChange }: ModelManagerModalProps) {
  const [models, setModels] = useState<LLMModel[]>([]);
  const [editingModel, setEditingModel] = useState<Partial<LLMModel> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchModels();
    }
  }, [isOpen]);

  const fetchModels = async () => {
    try {
      const data = await llmService.getConfig();
      setModels(data);
    } catch (error) {
      console.error("Failed to fetch models", error);
    }
  };

  const handleSave = async () => {
    if (!editingModel || !editingModel.id || !editingModel.provider) return;

    setIsLoading(true);
    try {
      await llmService.saveConfig(editingModel as LLMModel);
      await fetchModels();
      setEditingModel(null);
      onModelChange();
    } catch (error) {
      console.error("Failed to save model", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this model?")) return;
    
    setIsLoading(true);
    try {
      await llmService.deleteModel(id);
      await fetchModels();
      onModelChange();
    } catch (error) {
      console.error("Failed to delete model", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card cyber-border">
        <DialogHeader>
          <DialogTitle className="terminal-text text-xl">Manage LLM Models</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px]">
          {/* Model List */}
          <div className="border-r border-border pr-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Models</h3>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setEditingModel({ is_active: true, provider: "gemini" })}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {models.map((model) => (
                <div 
                  key={model.id} 
                  className={`p-2 rounded border cursor-pointer flex justify-between items-center ${editingModel?.id === model.id ? 'bg-secondary border-primary' : 'border-border hover:bg-secondary/50'}`}
                  onClick={() => setEditingModel(model)}
                >
                  <div className="truncate">
                    <div className="font-medium text-sm">{model.name}</div>
                    <div className="text-xs text-muted-foreground">{model.provider}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); handleDelete(model.id); }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:col-span-2 pl-4 overflow-y-auto">
            {editingModel ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{editingModel.id ? 'Edit Model' : 'New Model'}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingModel(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Model ID (Unique)</label>
                  <Input 
                    value={editingModel.id || ''} 
                    onChange={(e) => setEditingModel({ ...editingModel, id: e.target.value })}
                    placeholder="e.g., gemini-pro-custom"
                    disabled={!!models.find(m => m.id === editingModel.id && m.id !== '')} // Disable ID edit for existing
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <Input 
                    value={editingModel.name || ''} 
                    onChange={(e) => setEditingModel({ ...editingModel, name: e.target.value })}
                    placeholder="e.g., Gemini Pro Custom"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Provider</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editingModel.provider || 'gemini'}
                    onChange={(e) => setEditingModel({ ...editingModel, provider: e.target.value })}
                  >
                    <option value="gemini">Gemini</option>
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="ollama">Ollama</option>
                    <option value="openrouter">OpenRouter</option>
                    <option value="cerebras">Cerebras</option>
                    <option value="kilocode">KiloCode</option>
                    <option value="huggingface">HuggingFace</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">API Key</label>
                  <Input 
                    type="password"
                    value={editingModel.api_key || ''} 
                    onChange={(e) => setEditingModel({ ...editingModel, api_key: e.target.value })}
                    placeholder="sk-..."
                  />
                  <p className="text-xs text-muted-foreground">Stored locally in llm_config.json</p>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Base URL (Optional)</label>
                  <Input 
                    value={editingModel.base_url || ''} 
                    onChange={(e) => setEditingModel({ ...editingModel, base_url: e.target.value })}
                    placeholder="https://api.example.com/v1"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setEditingModel(null)}>Cancel</Button>
                  <Button onClick={handleSave} disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Model
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <p>Select a model to edit or create a new one.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
