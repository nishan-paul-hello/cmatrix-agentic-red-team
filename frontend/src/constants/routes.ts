/**
 * Application route constants
 */

export const ROUTES = {
  HOME: "/",
  DEMO: "/demo",
  API: {
    CHAT: "/api/chat",
  },
} as const;

export type Routes = typeof ROUTES;
