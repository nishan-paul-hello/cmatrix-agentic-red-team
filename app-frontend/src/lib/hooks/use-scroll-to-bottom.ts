import { useEffect, useRef, useCallback } from "react";

/**
 * Hook to automatically scroll to bottom of a container
 * Useful for chat interfaces
 */
export function useScrollToBottom<T extends HTMLElement = HTMLDivElement>(
  dependencies: unknown[] = []
) {
  const ref = useRef<T>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    ref.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, dependencies]);

  return { ref, scrollToBottom };
}
