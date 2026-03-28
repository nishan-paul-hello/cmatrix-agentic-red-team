import { useEffect, useRef } from "react";

/**
 * Hook to automatically scroll to bottom of a container
 * Useful for chat interfaces
 */
export function useScrollToBottom<T extends HTMLElement = HTMLDivElement>(
  dependencies: any[] = []
) {
  const ref = useRef<T>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    ref.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { ref, scrollToBottom };
}
