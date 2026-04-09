import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

const SESSION_KEY = "panorama-session-id";

/**
 * Returns a stable session ID for the current browser tab/session.
 * Persists in sessionStorage so it survives page refreshes
 * but not new tabs — each tab gets its own upload space.
 */
export function useSessionId(): string {
  return useMemo(() => {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = uuidv4();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  }, []);
}
