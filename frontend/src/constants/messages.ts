/**
 * Message and text constants
 */

export const MESSAGES = {
  SYSTEM: {
    OPERATIONAL: "[SYSTEM STATUS: OPERATIONAL] [AGENT: CMATRIX-CORE-V1]",
    PROCESSING: "[PROCESSING QUERY...]",
    SECURITY_NOTICE: "CMatrix can make mistakes. Check important info.",
  },

  LABELS: {
    NEURAL_INTERFACE: "AI-Powered VAPT Tool",
  },

  PLACEHOLDERS: {
    INPUT: "How can I help you today?",
  },

  ERRORS: {
    GENERIC: "Sorry, I encountered an error. Please try again.",
    NO_RESPONSE: "No response body",
    FETCH_FAILED: "Failed to fetch",
  },

  WELCOME: {
    TITLE: "CMatrix",
    SUBTITLE: "AI-Powered VAPT Tool",
    DESCRIPTION: "Agent capabilities: security scanning, system monitoring, log analysis, configuration deployment.",
  },

  SUGGESTIONS: {
    SECURITY_SCAN: {
      TITLE: "Security Scan",
      DESCRIPTION: "Analyze system vulnerabilities",
      PROMPT: "Scan my web application for vulnerabilities",
    },
    SYSTEM_STATUS: {
      TITLE: "System Status",
      DESCRIPTION: "Monitor infrastructure health",
      PROMPT: "Check the status of critical services",
    },
  },
} as const;

export type Messages = typeof MESSAGES;
