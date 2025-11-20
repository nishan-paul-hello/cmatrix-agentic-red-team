import { apiConfig } from "@/config/api.config";

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  api_key?: string;
  is_active: boolean;
  base_url?: string;
}

export const llmService = {
  getConfig: async (): Promise<LLMModel[]> => {
    const response = await fetch(`${apiConfig.baseUrl}/llm/config`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch LLM config");
    return response.json();
  },

  saveConfig: async (model: LLMModel): Promise<void> => {
    const response = await fetch(`${apiConfig.baseUrl}/llm/config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(model),
    });
    if (!response.ok) throw new Error("Failed to save LLM config");
  },

  deleteModel: async (modelId: string): Promise<void> => {
    const response = await fetch(`${apiConfig.baseUrl}/llm/config/${modelId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete LLM model");
  },
  
  selectModel: async (modelId: string): Promise<void> => {
      const response = await fetch(`${apiConfig.baseUrl}/llm/select/${modelId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to select LLM model");
  }
};
