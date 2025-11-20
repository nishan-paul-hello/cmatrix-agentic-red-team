import { useState, useEffect, useCallback } from "react";
import { apiConfig } from "@/config/api.config";

export interface HistoryItem {
  id: number;
  conversation_id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  conversation_name: string;
}

export function useDashboard() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const skip = (page - 1) * pageSize;
      const queryParams = new URLSearchParams({
        skip: skip.toString(),
        limit: pageSize.toString(),
      });
      
      if (search) {
        queryParams.append("search", search);
      }

      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiConfig.baseUrl}/conversations/history/all?${queryParams.toString()}`, {
        headers: {
          ...apiConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else {
        console.error("Failed to fetch history");
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchHistory();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [fetchHistory]);

  const deleteHistoryItem = async (id: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiConfig.baseUrl}/conversations/history/${id}`, {
        method: 'DELETE',
        headers: {
          ...apiConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const clearConversationHistory = async (conversationId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiConfig.baseUrl}/conversations/${conversationId}/history`, {
        method: 'DELETE',
        headers: {
          ...apiConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setHistory((prev) => prev.filter((item) => item.conversation_id !== conversationId));
      }
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  };

  return {
    history,
    isLoading,
    search,
    setSearch,
    page,
    setPage,
    deleteHistoryItem,
    clearConversationHistory,
  };
}
