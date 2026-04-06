/**
 * API configuration
 */

const getBaseUrl = (): string => {
  // Always use the relative path /api/v1 for the client side.
  // This ensures we use the Next.js proxy (configured in next.config.mjs)
  // which works seamlessly on both localhost and VPS/Production.
  if (typeof window !== "undefined") {
    // Check if we have an override from environment variables, otherwise use relative path
    return process.env.NEXT_PUBLIC_API_URL || "/api/v1";
  }

  // If we're on the server side (SSR/API Routes)
  const backendUrl = process.env.PYTHON_BACKEND_URL;
  if (backendUrl) {
    return `${backendUrl}/api/v1`;
  }

  // Fallback for SSR/Server components when no internal URL is set
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3012/api/v1";
};

export const apiConfig = {
  baseUrl: getBaseUrl(),

  endpoints: {
    chat: "/chat",
    chatStream: "/chat/stream",
    health: "/health",
    conversations: "/conversations",
    jobs: {
      create: "/jobs/scan",
      get: (id: string) => `/jobs/${id}`,
      list: "/jobs",
      cancel: (id: string) => `/jobs/${id}`,
    },
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
