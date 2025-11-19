/**
 * API configuration
 */

const getBaseUrl = (): string => {
  // For client-side, use relative URLs
  if (typeof window !== "undefined") {
    return "";
  }
  
  // For server-side, use environment variable or default
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

export const apiConfig = {
  baseUrl: getBaseUrl(),
  
  endpoints: {
    chat: "/api/chat",
    chatStream: "/api/v1/chat/stream",
    health: "/api/health",
  },

  timeout: 30000, // 30 seconds
  
  retryConfig: {
    maxRetries: 3,
    retryDelay: 1000,
    retryableStatuses: [408, 429, 500, 502, 503, 504],
  },

  headers: {
    "Content-Type": "application/json",
  },
} as const;

export type ApiConfig = typeof apiConfig;
