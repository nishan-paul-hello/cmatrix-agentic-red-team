import { apiConfig } from "@/config/api.config";

export interface LLMModel {
  id: number;
  name: string;
  description?: string;
  provider: string;
  default_model_name?: string;
  status: string;
  has_api_key: boolean;
  is_active: boolean;
  api_key_masked?: string;
}

export const llmService = {
  getModels: async (): Promise<LLMModel[]> => {
    const response = await fetch(`${apiConfig.baseUrl}/llm/models`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch LLM models");
    return response.json();
  },

  updateApiKey: async (modelId: number, apiKey: string): Promise<void> => {
    const response = await fetch(`${apiConfig.baseUrl}/llm/models/${modelId}/api-key`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: JSON.stringify({ api_key: apiKey }),
    });
    if (!response.ok) throw new Error("Failed to update API key");
  },

  activateModel: async (modelId: number): Promise<void> => {
    const response = await fetch(`${apiConfig.baseUrl}/llm/models/${modelId}/activate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to activate model");
  },

  getActiveModel: async (): Promise<any> => {
    const response = await fetch(`${apiConfig.baseUrl}/llm/models/active`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to get active model");
    return response.json();
  },

  importConfig: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${apiConfig.baseUrl}/llm/models/import-config`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to import LLM configuration");
    return response.json();
  },
};
